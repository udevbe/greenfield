'use strict'

const fastcall = require('fastcall')
const Library = fastcall.Library

const libc = new Library('libc.so.6', {
  defaultCallMode: Library.callMode.sync
})

libc.function('void *mmap(void *addr, long length, int prot, int flags, int fd, long offset)')
libc.function('int munmap(void *addr, long length)')
libc.PROT_READ = 0x1
libc.PROT_WRITE = 0x2
libc.MAP_SHARED = 0x01

module.exports = {
  libc: libc
}
