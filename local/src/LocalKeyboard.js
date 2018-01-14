'use strict'

const util = require('util')
const fs = require('fs')
const path = require('path')

const fastcall = require('fastcall')
const libc = require('./native').libc

module.exports = class LocalKeyboard {
  static create (grKeyboardProxy) {
    return new LocalKeyboard(grKeyboardProxy)
  }

  constructor (grKeyboardProxy) {
    this.resource = null
    this.proxy = grKeyboardProxy
    this._newKeymapString = ''
    this.keymapString = ''
    this.keymapFormat = ''
    this.keymapFd = 0
  }

  /**
   *
   *                This event provides a file descriptor to the client which can be
   *                memory-mapped to provide a keyboard mapping description.
   *
   *
   * @param {Number} format keymap format
   * @param {string} transfer keymap blob transfer descriptor
   * @param {Number} size keymap size, in bytes
   *
   * @since 1
   *
   */
  keymap (format, transfer, size) {
    const localRtcPeerConnection = this.proxy.connection._localRtcPeerConnection
    const localRtcBlobTransfer = localRtcPeerConnection.createBlobTransferFromDescriptor(transfer)
    localRtcBlobTransfer.open().then((rtcDataChannel) => {
      return new Promise((resolve, reject) => {
        // We use an intermediate new keymap field, to ensure we don't send out partially constructed keymaps
        // when we are in the process of receiving. Only when the full keymap is received do we actually update
        // the field that is used to send out a keymap
        this._newKeymapString = ''
        rtcDataChannel.onmessage = (event) => {
          this._newKeymapString += event.data
          if (this._newKeymapString.length === size) {
            this.keymapString = this._newKeymapString
            // TODO close channel?
            resolve()
          }
        }
        rtcDataChannel.onerror = (event) => {
          // TODO close channel?
          reject(event)
        }
      })
    }).then(() => {
      return this._updateKeymap(format)
    }).then(() => {
      return this.emitKeymap()
    }).catch((error) => {
      console.log(error)
    })
  }

  _updateKeymap (format) {
    // TODO unmap any previous keymap?

    // size+1 for null terminator
    this._createAnonymousFile(this.keymapString.length + 1).then((fd) => {
      const PROT_READ = 0x1
      const PROT_WRITE = 0x2
      const MAP_SHARED = 0x01
      const keymapFilePtr = libc.interface.mmap(null, this.keymapString.length + 1, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0)
      fastcall.ref.writeCString(keymapFilePtr, 0, this.keymapString, 'utf8')
      this.keymapFd = fd
      this.keymapFormat = format
      return util.promisify(fs.close)(fd)
    })
  }

  emitKeymap () {
    this.resource.keymap(this.keymapFormat, this.keymapFd, this.keymapString.length)
  }

  /**
   * Create a new, unique, anonymous file of the given size, and return the file descriptor for it. The file
   * descriptor is set CLOEXEC. The file is immediately suitable for mmap()'ing the given size at offset zero.
   *
   *
   * The file should not have a permanent backing store like a disk, but may have if XDG_RUNTIME_DIR is not properly
   * implemented in OS.
   *
   *
   * The file name is deleted from the file system.
   *
   *
   * The file is suitable for buffer sharing between processes by transmitting the file descriptor over Unix sockets
   * using the SCM_RIGHTS methods.
   */
  _createAnonymousFile (size) {
    const xdgPath = process.env.XDG_RUNTIME_DIR
    if (xdgPath == null) return Promise.reject(new Error('Cannot create temporary file: XDG_RUNTIME_DIR not set'))

    return util.promisify(fs.mkdtemp)(path.join(xdgPath, 'keymap-')).then((folder) => {
      const filePath = path.join(folder, 'keymap')
      return Promise.all([
        filePath,
        util.promisify(fs.open)(filePath, 600)
      ])
    }).then((values) => {
      const filePath = values[0]
      const fd = values[1]
      return Promise.all([
        fd,
        util.promisify(fs.ftruncate)(fd, size),
        util.promisify(fs.unlink)(filePath)
      ])
    }).then((values) => {
      const fd = values[0]
      return Promise.resolve(fd)
    })
  }

  /**
   *
   *                Notification that this seat's keyboard focus is on a certain
   *                surface.
   *
   *
   * @param {Number} serial serial number of the enter event
   * @param {*} surface surface gaining keyboard focus
   * @param {ArrayBuffer} keys the currently pressed keys
   *
   * @since 1
   *
   */
  enter (serial, surface, keys) {
    const wlSurfaceResource = surface.listener.resource
    this.resource.enter(serial, wlSurfaceResource, keys)
  }

  /**
   *
   *                Notification that this seat's keyboard focus is no longer on
   *                a certain surface.
   *
   *                The leave notification is sent before the enter notification
   *                for the new focus.
   *
   *
   * @param {Number} serial serial number of the leave event
   * @param {*} surface surface that lost keyboard focus
   *
   * @since 1
   *
   */
  leave (serial, surface) {
    const wlSurfaceResource = surface.listener.resource
    this.resource.leave(serial, wlSurfaceResource)
  }

  /**
   *
   *                A key was pressed or released.
   *                The time argument is a timestamp with millisecond
   *                granularity, with an undefined base.
   *
   *
   * @param {Number} serial serial number of the key event
   * @param {Number} time timestamp with millisecond granularity
   * @param {Number} key key that produced the event
   * @param {Number} state physical state of the key
   *
   * @since 1
   *
   */
  key (serial, time, key, state) {
    this.resource.key(serial, time, key, state)
  }

  /**
   *
   *                Notifies clients that the modifier and/or group state has
   *                changed, and it should update its local state.
   *
   *
   * @param {Number} serial serial number of the modifiers event
   * @param {Number} modsDepressed depressed modifiers
   * @param {Number} modsLatched latched modifiers
   * @param {Number} modsLocked locked modifiers
   * @param {Number} group keyboard layout
   *
   * @since 1
   *
   */
  modifiers (serial, modsDepressed, modsLatched, modsLocked, group) {
    this.resource.modifiers(serial, modsDepressed, modsLatched, modsLocked, group)
  }

  /**
   *
   *                Informs the client about the keyboard's repeat rate and delay.
   *
   *                This event is sent as soon as the gr_keyboard object has been created,
   *                and is guaranteed to be received by the client before any key press
   *                event.
   *
   *                Negative values for either rate or delay are illegal. A rate of zero
   *                will disable any repeating (regardless of the value of delay).
   *
   *                This event can be sent later on as well with a new value if necessary,
   *                so clients should continue listening for the event past the creation
   *                of gr_keyboard.
   *
   *
   * @param {Number} rate the rate of repeating keys in characters per second
   * @param {Number} delay delay in milliseconds since key down until repeating starts
   *
   * @since 4
   *
   */
  repeatInfo (rate, delay) {
    this.resource.repeatInfo(rate, delay)
  }
}
