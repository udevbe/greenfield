'use strict'

const os = require('os')
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
    this._keymapString = ''
    this._keymapFilePtr = null
    this._keymapFd = -1
  }

  /**
   *
   * This event provides a file descriptor to the client which can be
   * memory-mapped to provide a keyboard mapping description.
   *
   *
   * @param {Number} format keymap format
   * @param {string} blobDescriptor keymap blob transfer descriptor
   * @param {Number} size keymap size, in bytes
   *
   * @since 1
   *
   */
  keymap (format, blobDescriptor, size) {
    const localRtcPeerConnection = this.proxy.connection._localRtcPeerConnection
    const localRtcBlobTransfer = localRtcPeerConnection.createBlobTransferFromDescriptor(blobDescriptor)
    localRtcBlobTransfer.open().then((rtcDataChannel) => {
      return new Promise((resolve, reject) => {
        let newKeymapString = ''
        rtcDataChannel.onmessage = (event) => {
          newKeymapString += event.data
          if (newKeymapString.length === size) {
            // unmap any previous mapping
            if (this._keymapFilePtr) {
              // TODO check munmap return value?
              libc.interface.munmap(this._keymapFilePtr, this._keymapString.length + 1)
              this._keymapFilePtr = null
            }
            if (this._keymapFd >= 0) {
              fs.closeSync(this._keymapFd)
              this._keymapFd = -1
            }
            this._keymapString = newKeymapString
            localRtcBlobTransfer.closeAndSeal()
            resolve()
          }
        }
        rtcDataChannel.onerror = (event) => {
          localRtcBlobTransfer.closeAndSeal()
          reject(event)
        }
      })
    }).then(() => {
      return this._createAnonymousFile(this._keymapString.length + 1)
    }).then((fd) => {
      this._keymapFd = fd

      const PROT_READ = 0x1
      const PROT_WRITE = 0x2
      const MAP_SHARED = 0x01
      this._keymapFilePtr = libc.interface.mmap(null, this._keymapString.length + 1, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0)
      this._keymapFilePtr = fastcall.ref.reinterpret(this._keymapFilePtr, this._keymapString.length + 1, 0)
      fastcall.ref.writeCString(this._keymapFilePtr, 0, this._keymapString, 'utf8')
      return Promise.all([
        fd,
        format
      ])
    }).then((values) => {
      const fd = values[0]
      const format = values[1]
      this.resource.keymap(format, fd, this._keymapString.length)
    }).catch((error) => {
      console.log(error)
    })
  }

  _createAnonymousFile (size) {
    let dirPath = process.env.XDG_RUNTIME_DIR
    if (dirPath == null) {
      dirPath = os.tmpdir()
    }

    return util.promisify(fs.mkdtemp)(path.join(dirPath, 'keymap-')).then((tempFolder) => {
      const filePath = path.join(tempFolder, 'keymap')
      return Promise.all([
        filePath,
        util.promisify(fs.open)(filePath, 'w+', 0o600),
        tempFolder
      ])
    }).then((values) => {
      const filePath = values[0]
      const fd = values[1]
      const tempFolder = values[2]
      return Promise.all([
        filePath,
        fd,
        tempFolder,
        util.promisify(fs.ftruncate)(fd, size)
      ])
    }).then((values) => {
      const filePath = values[0]
      const fd = values[1]
      const tempFolder = values[2]
      return Promise.all([
        fd,
        tempFolder,
        util.promisify(fs.unlink)(filePath)
      ])
    }).then((values) => {
      const fd = values[0]
      const tempFolder = values[1]
      return Promise.all([
        fd,
        util.promisify(fs.rmdir)(tempFolder)
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
