'use strict'

const fastcall = require('fastcall')
const Library = fastcall.Library

const libc = new Library('libc.so.6', {
  defaultCallMode: Library.callMode.sync
})

libc.function('void *mmap(void *addr, long length, int prot, int flags, int fd, long offset)')
libc.function('int mkstemp(char *template)')
libc.function('int fcntl(int fd, int cmd, int arg )')
libc.function('int ftruncate(int fd, long length);')

const utils = {


module.exports = {
  libc: libc,
}
