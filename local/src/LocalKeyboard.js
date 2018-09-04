'use strict'

const os = require('os')
const util = require('util')
const fs = require('fs')
const path = require('path')
const {StringDecoder} = require('string_decoder')

const fastcall = require('fastcall')
const libc = require('./native').libc

class LocalKeyboard {
  /**
   * @param {wfc.GrKeyboard}grKeyboardProxy
   * @param {LocalClientSession}localClientSession
   * @return {LocalKeyboard}
   */
  static create (grKeyboardProxy, localClientSession) {
    return new LocalKeyboard(grKeyboardProxy, localClientSession.localRtcPeerConnection)
  }

  /**
   * @param {wfc.GrKeyboard}grKeyboardProxy
   * @param {LocalRtcPeerConnection}localRtcPeerConnection
   */
  constructor (grKeyboardProxy, localRtcPeerConnection) {
    /**
     * @type {LocalRtcPeerConnection}
     * @private
     */
    this._localRtcPeerConnection = localRtcPeerConnection
    /**
     * @type {WlKeyboard|null}
     */
    this.resource = null
    /**
     * @type {wfc.GrKeyboard}
     */
    this.proxy = grKeyboardProxy
    /**
     * @type {string}
     * @private
     */
    this._keymapString = ''
    /**
     * @type {Buffer|null}
     * @private
     */
    this._keymapFilePtr = null
    /**
     * @type {number}
     * @private
     */
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
  async keymap (format, blobDescriptor, size) {
    const localRtcBlobTransfer = this._localRtcPeerConnection.createBlobTransferFromDescriptor(blobDescriptor)
    const decoder = new StringDecoder('utf8')
    const rtcDataChannel = await localRtcBlobTransfer.open()

    let receivedSize = 0
    let newKeymapString = ''
    rtcDataChannel.onmessage = async (event) => {
      const arrayBuffer = event.data
      receivedSize += arrayBuffer.byteLength
      if (receivedSize === size) {
        newKeymapString += decoder.end(Buffer.from(arrayBuffer))
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

        const fd = await this._createAnonymousFile(size + 1)
        this._keymapFd = fd

        const PROT_READ = 0x1
        const PROT_WRITE = 0x2
        const MAP_SHARED = 0x01
        this._keymapFilePtr = libc.interface.mmap(null, size + 1, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0)
        this._keymapFilePtr = fastcall.ref.reinterpret(this._keymapFilePtr, size + 1, 0)
        fastcall.ref.writeCString(this._keymapFilePtr, 0, this._keymapString, 'utf8')

        this.resource.keymap(format, fd, size)
      } else {
        newKeymapString += decoder.write(Buffer.from(arrayBuffer))
      }
    }
    rtcDataChannel.onerror = (event) => {
      localRtcBlobTransfer.closeAndSeal()
      throw new Error(event)
    }
  }

  async _createAnonymousFile (size) {
    let dirPath = process.env.XDG_RUNTIME_DIR
    if (dirPath == null) {
      dirPath = os.tmpdir()
    }

    const tempFolder = await util.promisify(fs.mkdtemp)(path.join(dirPath, 'keymap-'))
    const filePath = path.join(tempFolder, 'keymap')
    const fd = await util.promisify(fs.open)(filePath, 'w+', 0o600)
    await util.promisify(fs.ftruncate)(fd, size)
    await util.promisify(fs.unlink)(filePath)
    await util.promisify(fs.rmdir)(tempFolder)
    return fd
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
    if (surface == null) {
      // object argument was destroyed by the client before the server noticed.
      return
    }
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
    if (surface == null) {
      // object argument was destroyed by the client before the server noticed.
      return
    }
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

module.exports = LocalKeyboard
