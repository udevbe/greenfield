 var LibraryUnixSockFS = {
    $UNIXSOCKFS__postset: function() {
        addAtInit('UNIXSOCKFS.root = FS.mount(UNIXSOCKFS, {}, null);');
    },
    $UNIXSOCKFS__deps: ['$FS', '$SOCKFS', '$Asyncify', '$MEMFS', '$PIPEFS'],
    $UNIXSOCKFS: {
        mount: function(mount) {
            // If Module['messageport'] has already been defined use that, if not initialise it to a new object.
            Module['messageport'] = (Module['messageport'] &&
                ('object' === typeof Module['messageport'])) ? Module['messageport'] : {};

            Module['messageport']._callbacks = {};
            Module['messageport']['on'] = /** @this{Object} */ function(event, callback) {
                if ('function' === typeof callback) {
                    this._callbacks[event] = callback;
                }
                return this;
            };

            Module['messageport'].emit = /** @this{Object} */ function(event, param) {
                if ('function' === typeof this._callbacks[event]) {
                    this._callbacks[event].call(this, param);
                }
            };

            // If debug is enabled register simple default logging callbacks for each Event.
            #if SOCKET_DEBUG
            Module['messageport']['on']('connect', (messagePort, path) => dbg('UnixSocket connection path = ' + path));
            #endif

            if (MEMFS.ops_table) {
                MEMFS.ops_table.file.stream.allocate = UNIXSOCKFS.stream_ops.allocate
            } else {
                MEMFS.stream_ops.allocate = UNIXSOCKFS.stream_ops.allocate
            }
            MEMFS.resizeFileStorage = UNIXSOCKFS.resizeFileStorage

            return FS.createNode(null, '/', {{{ cDefs.S_IFDIR }}} | 511 /* 0777 */, 0);
        },
        stream_ops:{
            poll: function(stream, timeoutInMillis) {
                var sock = stream.node.sock;
                return sock.sock_ops.poll(sock, timeoutInMillis);
            },
            ioctl: function(stream, request, varargs) {
                var sock = stream.node.sock;
                return sock.sock_ops.ioctl(sock, request, varargs);
            },
            read: function(stream, buffer, offset, length, position /* ignored */) {
                var sock = stream.node.sock;
                var msg = sock.sock_ops.recvmsg(sock, length);
                if (!msg) {
                    // socket is closed
                    return 0;
                }
                buffer.set(msg.buffer, offset);
                return msg.buffer.length;
            },
            write: function(stream, buffer, offset, length, position /* ignored */) {
                var sock = stream.node.sock;
                return sock.sock_ops.sendmsg(sock, buffer, offset, length);
            },
            close: function(stream) {
                var sock = stream.node.sock;
                sock.sock_ops.close(sock);
            },
            allocate: function(stream, offset, length) {
                UNIXSOCKFS.expandFileStorage(stream.node, offset + length);
                stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
            }
        },
        messageport_sock_ops: {
            getPeer: function(sock) {
                return sock.peer;
            },
            addPeer: function(sock, peer) {
                sock.peer = peer;
            },
            createPeer: function(sock, path) {
                var messageChannel = new MessageChannel()
                var port1 = messageChannel.port1
                var port2 = messageChannel.port2

                var peer = {
                    port1: port1,
                    port2: port2,
                    path: path
                }

                UNIXSOCKFS.messageport_sock_ops.addPeer(sock, peer)

                return peer
            },
            connect: function(sock, path) {
                // early out if we're already connected
                if (sock.peer) {
                    throw new FS.ErrnoError({{{ cDefs.EISCONN }}});
                }

                var peer = UNIXSOCKFS.messageport_sock_ops.createPeer(sock, path);
                peer.port1.onmessage= (event) => {
                    var data = event.data
                    sock.recv_queue.push(data)
                    if(sock.poll_resolve) sock.poll_resolve()
                }
                Module['messageport'].emit('connect', { port: peer.port2, path: peer.path})
            },
            close: function(sock) {
                sock.peer.port1.close()
                sock.peer.port2.close()
                sock.peer = null
            },
            write: function(sock, buffer, offset, length) {
                // TODO
            },
            recvmsg: function(sock, length) {
                var data = sock.recv_queue.shift();
                if(!data) {
                    throw new FS.ErrnoError({{{ cDefs.EAGAIN }}});
                }

                var buffer = data.shift()
                var fds = []
                if(data.length) {
                    for (var transferable of data) {
                        if(ArrayBuffer.isView(transferable)) {
                            var name = UNIXSOCKFS.nextExtMmapedName()
                            var node = MEMFS.createNode(null, name,  {{{ cDefs.S_IFREG }}}, 0);
                            node.contents = transferable
                            var readableStream = FS.createStream({
                                path: name,
                                node: node,
                                flags: {{{ cDefs.O_RDWR }}},
                                seekable: false,
                                stream_ops: MEMFS.stream_ops
                            });
                            fds.push(readableStream.fd)
                        } else {
                            throw new Error('Unsupported transferable/fd.')
                        }
                    }
                }

                return {
                    buffer: new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength),
                    fds: fds
                }
            },
            ioctl: function(sock, request, varargs) {
                switch (request) {
                    case {{{ cDefs.FIONREAD }}}:
                        var bytes = 0;
                        if (sock.recv_queue.length) {
                            bytes = sock.recv_queue[0].data.length;
                        }
                        {{{ makeSetValue('arg', '0', 'bytes', 'i32') }}};
                        return 0;
                    default:
                        return {{{ cDefs.EINVAL }}};
                }
            },
            poll: async function(sock, timeoutInMillis) {
                var mask= {{{ cDefs.POLLOUT }}};

                if(sock.recv_queue.length) {
                    mask |= ({{{ cDefs.POLLRDNORM }}} | {{{ cDefs.POLLIN }}});
                } else {
                    mask |= await new Promise((resolve) => {
                        sock.poll_resolve = resolve
                        if(timeoutInMillis >= 0) {
                            setTimeout(resolve, timeoutInMillis)
                        }
                    }).then(()=> {
                        sock.poll_resolve = undefined
                        return sock.recv_queue.length ? ({{{ cDefs.POLLRDNORM }}} | {{{ cDefs.POLLIN }}}) : 0;
                    })
                }

                return mask;
            },
            sendmsg: function(sock, buffer, fds) {
                var data = [buffer]
                var transferables = []
                for(var fd of fds) {
                   var stream = FS.getStream(fd)
                   if(stream.mmap) {
                       data.push(HEAP8.subarray(stream.mmap.ptr, stream.mmap.ptr+stream.mmap.len))
                   } else if(stream.node.name.startsWith('pipe')) {
                        // TODO emulate a pipe fd with a messageport object
                       throw new Error('pipe fd not yet supported.')
                   } else {
                       throw new Error('Unsupported fd: '+stream.node.name)
                   }
                }

                sock.peer.port1.postMessage(data, transferables)
                return buffer.length
            }
        },
        // Allocates a new backing store for the given node so that it can fit at least newSize amount of bytes.
        // May allocate more, to provide automatic geometric increase and amortized linear performance appending writes.
        // Never shrinks the storage.
        expandFileStorage: function(node, newCapacity) {
            // FIXME make sure we free memory after files have been deleted
#if CAN_ADDRESS_2GB
            newCapacity >>>= 0;
#endif
            var prevCapacity = node.contents ? node.contents.length : 0;
            if (prevCapacity >= newCapacity) return; // No need to expand, the storage was already large enough.
            // Don't expand strictly to the given requested limit if it's only a very small increase, but instead geometrically grow capacity.
            // For small filesizes (<1MB), perform size*2 geometric increase, but for large sizes, do a much more conservative size*1.125 increase to
            // avoid overshooting the allocation cap by a very large margin.
            var CAPACITY_DOUBLING_MAX = 1024 * 1024;
            newCapacity = Math.max(newCapacity, (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2.0 : 1.125)) >>> 0);
            if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256); // At minimum allocate 256b for each file when expanding.
            var oldContents = node.contents;
            node.contents = new Uint8Array(HEAP8.buffer, _malloc(newCapacity), newCapacity); // Allocate new storage.
            if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0); // Copy old data over to the new storage.
        },
        // Performs an exact resize of the backing file storage to the given size, if the size is not exactly this, the storage is fully reallocated.
        resizeFileStorage: function(node, newSize) {
            // FIXME make sure we free memory after files have been deleted
#if CAN_ADDRESS_2GB
            newSize >>>= 0;
#endif
            if (node.usedBytes == newSize) return;
            if (newSize == 0) {
                node.contents = null; // Fully decommit when requesting a resize to zero.
                node.usedBytes = 0;
            } else {
                var oldContents = node.contents;
                node.contents = new Uint8Array(HEAP8.buffer, _malloc(newSize), newSize); // Allocate new storage.
                if (oldContents) {
                    node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes))); // Copy old data over to the new storage.
                }
                node.usedBytes = newSize;
            }
        },
        nextname: function() {
            if (!UNIXSOCKFS.nextname.current) {
                UNIXSOCKFS.nextname.current = 0;
            }
            return 'unixsocket[' + (UNIXSOCKFS.nextname.current++) + ']';
        },
        nextExtMmapedName: function() {
            if (!UNIXSOCKFS.nextname.current) {
                UNIXSOCKFS.nextname.current = 0;
            }
            return 'extMmapped[' + (UNIXSOCKFS.nextname.current++) + ']';
        },
        createSocket: function(family, type, protocol) {
            type &= ~{{{ cDefs.SOCK_CLOEXEC | cDefs.SOCK_NONBLOCK }}}; // Some applications may pass it; it makes no sense for a single process.
            var streaming = type == {{{ cDefs.SOCK_STREAM }}};
            if (streaming && protocol != 0) {
                throw new FS.ErrnoError({{{ cDefs.EPROTONOSUPPORT }}}); // if SOCK_STREAM, must be 0.
            }

            // create our internal socket structure
            var sock = {
                family,
                type,
                protocol,
                recv_queue: [],
                peer: null,
                sock_ops: UNIXSOCKFS.messageport_sock_ops
            };

            // create the filesystem node to store the socket structure
            var name = UNIXSOCKFS.nextname();
            var node = FS.createNode(UNIXSOCKFS.root, name, {{{ cDefs.S_IFSOCK }}}, 0);
            node.sock = sock;

            // and the wrapping stream that enables library functions such
            // as read and write to indirectly interact with the socket
            var stream = FS.createStream({
                path: name,
                node,
                flags: {{{ cDefs.O_RDWR }}},
                seekable: false,
                stream_ops: UNIXSOCKFS.stream_ops
            });

            // map the new stream to the socket structure (sockets have a 1:1
            // relationship with a stream)
            sock.stream = stream;

            return sock;
        }
    },
    __syscall_socket__deps: ['$SOCKFS', '$UNIXSOCKFS'],
    __syscall_socket: function(domain, type, protocol) {
        var sock
        if(domain == 1) {
            // AF_UNIX/AF_LOCAL
            sock = UNIXSOCKFS.createSocket(domain, type, protocol);
        } else {
            sock = SOCKFS.createSocket(domain, type, protocol);
        }
        #if ASSERTIONS
        assert(sock.stream.fd < 64); // XXX ? select() assumes socket fd values are in 0..63
        #endif
        return sock.stream.fd;
    },
    __syscall_connect__deps: ['$getSocketFromFD', '$getSocketAddress'],
    __syscall_connect: function(fd, addr, addrlen, d1, d2, d3) {
        var family = {{{ makeGetValue('addr', C_STRUCTS.sockaddr_in.sin_family, 'i16') }}};
        var sock = getSocketFromFD(fd);
        if(family === 1) {
            // AF_UNIX/AF_LOCAL
            var path = UTF8ToString(addr + 2, 108);
            sock.sock_ops.connect(sock, path);
        } else {
            var info = getSocketAddress(addr, addrlen);
            sock.sock_ops.connect(sock, info.addr, info.port);
            return 0;
        }
    },
     __syscall_sendmsg__deps: ['$getSocketFromFD', '$readSockaddr', '$DNS'],
     __syscall_sendmsg: function(fd, message, flags, d1, d2, d3) {
         var sock = getSocketFromFD(fd);
         var iov = {{{ makeGetValue('message', C_STRUCTS.msghdr.msg_iov, '*') }}};
         var num = {{{ makeGetValue('message', C_STRUCTS.msghdr.msg_iovlen, 'i32') }}};

         if(sock.family == 1) {
             // AF_UNIX/AF_LOCAL
             var cmsg = {{{ makeGetValue('message', C_STRUCTS.msghdr.msg_iovlen + 4, POINTER_TYPE) }}};
             var cmsglen = {{{ makeGetValue('message', C_STRUCTS.msghdr.msg_iovlen + 8, 'i32') }}};
             var fds = []
             if(cmsglen > 0) {
                // assume fds
                 for (let i = 0; i < (cmsglen - 12); i+=4) {
                     fds.push({{{ makeGetValue('cmsg', `12+i`, 'i32') }}});
                 }
             }

             // concatenate scatter-gather arrays into one message buffer
             var total = 0;
             for (var i = 0; i < num; i++) {
                 total += {{{ makeGetValue('iov', `(${C_STRUCTS.iovec.__size__} * i) + ${C_STRUCTS.iovec.iov_len}`, 'i32') }}};
             }
             var view = new Uint8Array(total);
             var offset = 0;
             for (var i = 0; i < num; i++) {
                 var iovbase = {{{ makeGetValue('iov', `(${C_STRUCTS.iovec.__size__} * i) + ${C_STRUCTS.iovec.iov_base}`, POINTER_TYPE) }}};
                 var iovlen = {{{ makeGetValue('iov', `(${C_STRUCTS.iovec.__size__} * i) + ${C_STRUCTS.iovec.iov_len}`, 'i32') }}};
                 for (var j = 0; j < iovlen; j++) {
                     view[offset++] = {{{ makeGetValue('iovbase', 'j', 'i8') }}};
                 }
             }

             sock.sock_ops.sendmsg(sock, view, fds);
             return total;
         } else {
             // read the address and port to send to
             var addr, port;
             var name = {{{ makeGetValue('message', C_STRUCTS.msghdr.msg_name, '*') }}};
             var namelen = {{{ makeGetValue('message', C_STRUCTS.msghdr.msg_namelen, 'i32') }}};
             if (name) {
                 var info = readSockaddr(name, namelen);
                 if (info.errno) return -info.errno;
                 port = info.port;
                 addr = DNS.lookup_addr(info.addr) || info.addr;
             }
             // concatenate scatter-gather arrays into one message buffer
             var total = 0;
             for (var i = 0; i < num; i++) {
                 total += {{{ makeGetValue('iov', `(${C_STRUCTS.iovec.__size__} * i) + ${C_STRUCTS.iovec.iov_len}`, 'i32') }}};
             }
             var view = new Uint8Array(total);
             var offset = 0;
             for (var i = 0; i < num; i++) {
                 var iovbase = {{{ makeGetValue('iov', `(${C_STRUCTS.iovec.__size__} * i) + ${C_STRUCTS.iovec.iov_base}`, POINTER_TYPE) }}};
                 var iovlen = {{{ makeGetValue('iov', `(${C_STRUCTS.iovec.__size__} * i) + ${C_STRUCTS.iovec.iov_len}`, 'i32') }}};
                 for (var j = 0; j < iovlen; j++) {
                     view[offset++] = {{{ makeGetValue('iovbase', 'j', 'i8') }}};
                 }
             }
             // write the buffer
             return sock.sock_ops.sendmsg(sock, view, 0, total, addr, port);
         }
     },

     _mmap_js__i53abi: true,
     _mmap_js__deps: ['$SYSCALLS',
#if FILESYSTEM && SYSCALLS_REQUIRE_FILESYSTEM
    '$FS',
    // The dependency of FS on `mmapAlloc` and `mmapAlloc` on
    // `emscripten_builtin_memalign` are not encoding as hard dependencies,
    // so we need to explicitly depend on them here to ensure a working
    // `FS.mmap`.
    // `emscripten_builtin_memalign`).
    '$mmapAlloc',
    'emscripten_builtin_memalign',
#endif
    ],
    _mmap_js: (len, prot, flags, fd, offset, allocated, addr) => {
#if FILESYSTEM && SYSCALLS_REQUIRE_FILESYSTEM
        var stream = SYSCALLS.getStreamFromFD(fd);
        var res = FS.mmap(stream, len, offset, prot, flags);
        var ptr = res.ptr;
        {{{ makeSetValue('allocated', 0, 'res.allocated', 'i32') }}};
#if CAN_ADDRESS_2GB
        ptr >>>= 0;
#endif
        {{{ makeSetValue('addr', 0, 'ptr', '*') }}};
        stream.mmap = { ptr, len };
        return 0;
#else // no filesystem support; report lack of support
        return -{{{ cDefs.ENOSYS }}};
#endif
    },
    _munmap_js__i53abi: true,
    _munmap_js: (addr, len, prot, flags, fd, offset) => {
#if FILESYSTEM && SYSCALLS_REQUIRE_FILESYSTEM
        var stream = SYSCALLS.getStreamFromFD(fd);
        if (prot & {{{ cDefs.PROT_WRITE }}}) {
            SYSCALLS.doMsync(addr, stream, len, flags, offset);
        }
        if(stream.mmap.closed) {
            FS.close(stream);
        }
        delete stream.mmap
#endif
    },
    fd_close: (fd) => {
#if SYSCALLS_REQUIRE_FILESYSTEM
     var stream = SYSCALLS.getStreamFromFD(fd);
     if(stream.mmap) {
         stream.mmap.closed = true
     } else {
         FS.close(stream);
     }
     return 0;
#elif PROXY_POSIX_SOCKETS
     // close() is a tricky function because it can be used to close both regular file descriptors
     // and POSIX network socket handles, hence an implementation would need to track for each
     // file descriptor which kind of item it is. To simplify, when using PROXY_POSIX_SOCKETS
     // option, use shutdown() to close a socket, and this function should behave like a no-op.
     warnOnce('To close sockets with PROXY_POSIX_SOCKETS bridge, prefer to use the function shutdown() that is proxied, instead of close()')
     return 0;
#elif ASSERTIONS
     abort('fd_close called without SYSCALLS_REQUIRE_FILESYSTEM');
#else
     return {{{ cDefs.ENOSYS }}};
#endif // SYSCALLS_REQUIRE_FILESYSTEM
     },
    __syscall_recvmsg__deps: ['$getSocketFromFD', '$writeSockaddr', '$DNS'],
     __syscall_recvmsg: function(fd, message, flags, d1, d2, d3) {
         var sock = getSocketFromFD(fd);
         var iov = {{{ makeGetValue('message', C_STRUCTS.msghdr.msg_iov, POINTER_TYPE) }}};
         var num = {{{ makeGetValue('message', C_STRUCTS.msghdr.msg_iovlen, 'i32') }}};
         // get the total amount of data we can read across all arrays
         var total = 0;
         for (var i = 0; i < num; i++) {
             total += {{{ makeGetValue('iov', `(${C_STRUCTS.iovec.__size__} * i) + ${C_STRUCTS.iovec.iov_len}`, 'i32') }}};
         }
         // try to read total data
         var msg = sock.sock_ops.recvmsg(sock, total);
         if (!msg) return 0; // socket is closed

         if(sock.family == 1) {
             // AF_UNIX/AF_LOCAL

             // write the buffer out to the scatter-gather arrays
             var bytesRead = 0;
             var bytesRemaining = msg.buffer.byteLength;
             for (var i = 0; bytesRemaining > 0 && i < num; i++) {
                 var iovbase = {{{ makeGetValue('iov', `(${C_STRUCTS.iovec.__size__} * i) + ${C_STRUCTS.iovec.iov_base}`, POINTER_TYPE) }}};
                 var iovlen = {{{ makeGetValue('iov', `(${C_STRUCTS.iovec.__size__} * i) + ${C_STRUCTS.iovec.iov_len}`, 'i32') }}};
                 if (!iovlen) {
                     continue;
                 }
                 var length = Math.min(iovlen, bytesRemaining);
                 var buf = msg.buffer.subarray(bytesRead, bytesRead + length);
                 HEAPU8.set(buf, iovbase);
                 bytesRead += length;
                 bytesRemaining -= length;
             }

             if(msg.fds.length) {
                 // get cmsghdr struct
                 var cmsgPtr = {{{ makeGetValue('message', C_STRUCTS.msghdr.msg_iovlen + 4, POINTER_TYPE) }}};
                 // cmsg_len+cmsg_level+cmsg_type+data
                 // len
                 var cmsgByteLength = 4 + 4 + 4 + (4 * msg.fds.length)
                 {{{ makeSetValue('cmsgPtr', '0', 'cmsgByteLength', 'u32') }}}
                 // level
                 {{{ makeSetValue('cmsgPtr', '4', 0x01, 'u32') }}}
                 // type
                 {{{ makeSetValue('cmsgPtr', '8', 0x01, 'u32') }}}
                 // data
                 for (var fd of msg.fds) {
                     var fdOffset = 0
                     // fd data
                     {{{ makeSetValue('cmsgPtr', '12+fdOffset', 'fd', 'i32') }}}
                     fdOffset += 4
                 }
                 {{{ makeSetValue('message', C_STRUCTS.msghdr.msg_iovlen + 8, 'cmsgByteLength', 'i32') }}}
             } else {
                 {{{ makeSetValue('message', C_STRUCTS.msghdr.msg_iovlen + 8, '0', 'i32') }}}
             }

             // TODO set msghdr.msg_flags
             // MSG_EOR
             // End of record was received (if supported by the protocol).
             // MSG_OOB
             // Out-of-band data was received.
             // MSG_TRUNC
             // Normal data was truncated.
             // MSG_CTRUNC

             return bytesRead;
         } else {
             // TODO honor flags:
             // MSG_OOB
             // Requests out-of-band data. The significance and semantics of out-of-band data are protocol-specific.
             // MSG_PEEK
             // Peeks at the incoming message.
             // MSG_WAITALL
             // Requests that the function block until the full amount of data requested can be returned. The function may return a smaller amount of data if a signal is caught, if the connection is terminated, if MSG_PEEK was specified, or if an error is pending for the socket.

             // write the source address out
             var name = {{{ makeGetValue('message', C_STRUCTS.msghdr.msg_name, '*') }}};
             if (name) {
                 var errno = writeSockaddr(name, sock.family, DNS.lookup_name(msg.addr), msg.port);
                 #if ASSERTIONS
                 assert(!errno);
                 #endif
             }
             // write the buffer out to the scatter-gather arrays
             var bytesRead = 0;
             var bytesRemaining = msg.buffer.byteLength;
             for (var i = 0; bytesRemaining > 0 && i < num; i++) {
                 var iovbase = {{{ makeGetValue('iov', `(${C_STRUCTS.iovec.__size__} * i) + ${C_STRUCTS.iovec.iov_base}`, POINTER_TYPE) }}};
                 var iovlen = {{{ makeGetValue('iov', `(${C_STRUCTS.iovec.__size__} * i) + ${C_STRUCTS.iovec.iov_len}`, 'i32') }}};
                 if (!iovlen) {
                     continue;
                 }
                 var length = Math.min(iovlen, bytesRemaining);
                 var buf = msg.buffer.subarray(bytesRead, bytesRead + length);
                 HEAPU8.set(buf, iovbase);
                 bytesRead += length;
                 bytesRemaining -= length;
             }

             // TODO set msghdr.msg_flags
             // MSG_EOR
             // End of record was received (if supported by the protocol).
             // MSG_OOB
             // Out-of-band data was received.
             // MSG_TRUNC
             // Normal data was truncated.
             // MSG_CTRUNC

             return bytesRead;
         }
     },
     __syscall_poll: function(fds, nfds, timeout) {
        return Asyncify.handleAsync(async () => {
             var nonzero = 0;
             for (var i = 0; i < nfds; i++) {
                 var pollfd = fds + {{{ C_STRUCTS.pollfd.__size__ }}} * i;
                 var fd = {{{ makeGetValue('pollfd', C_STRUCTS.pollfd.fd, 'i32') }}};
                 var events = {{{ makeGetValue('pollfd', C_STRUCTS.pollfd.events, 'i16') }}};
                 var mask = {{{ cDefs.POLLNVAL }}};
                 var stream = FS.getStream(fd);
                 if (stream) {
                     mask = SYSCALLS.DEFAULT_POLLMASK;
                     if (stream.stream_ops.poll) {
                         mask = await stream.stream_ops.poll(stream, timeout);
                     }
                 }
                 mask &= events | {{{ cDefs.POLLERR }}} | {{{ cDefs.POLLHUP }}};
                 if (mask) nonzero++;
                 {{{ makeSetValue('pollfd', C_STRUCTS.pollfd.revents, 'mask', 'i16') }}};
             }
             return nonzero;
         })
     },
}

autoAddDeps(LibraryUnixSockFS, '$UNIXSOCKFS')
mergeInto(LibraryManager.library, LibraryUnixSockFS)
