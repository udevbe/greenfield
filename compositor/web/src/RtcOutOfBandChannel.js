export default class RtcOutOfBandChannel {
  /**
   * @param {function(ArrayBuffer):void}onOutOfBandSend
   * @return {RtcOutOfBandChannel}
   */
  static create (onOutOfBandSend) {
    return new RtcOutOfBandChannel(onOutOfBandSend)
  }

  /**
   * @param {function(ArrayBuffer):void}onOutOfBandSend
   */
  constructor (onOutOfBandSend) {
    /**
     * Out of band listeners. Allows for messages & listeners not part of the ordinary wayland protocol.
     * @type {Object.<number, function(ArrayBuffer):void>}
     * @private
     */
    this._outOfBandListeners = {}
    /**
     * @type {function(ArrayBuffer): void}
     * @private
     */
    this._onOutOfBandSend = onOutOfBandSend
  }

  /**
   * @param {ArrayBuffer}incomingMessage
   */
  message (incomingMessage) {
    const dataView = new DataView(incomingMessage)
    const opcode = dataView.getUint32(0, true)

    const outOfBandHandler = this._outOfBandListeners[opcode]
    if (outOfBandHandler) {
      outOfBandHandler(incomingMessage.slice(4))
    } else {
      console.log(`[BUG?] Out of band using opcode: ${opcode} not found. Ignoring.`)
    }
  }

  /**
   * @param {number}opcode
   * @param {function(ArrayBuffer):void}listener
   */
  setListener (opcode, listener) {
    this._outOfBandListeners[opcode] = listener
  }

  /**
   * @param {number}opcode
   */
  removeListener (opcode) {
    delete this._outOfBandListeners[opcode]
  }

  /**
   * @param {number}opcode
   * @param {ArrayBuffer}payload
   */
  send (opcode, payload) {
    // FIXME there's the danger of sending > 16kb, which might fail in chrome. => Chunk the message
    const sendBuffer = new ArrayBuffer(4 + payload.byteLength)
    const dataView = new DataView(sendBuffer)
    dataView.setUint32(0, opcode, true)
    new Uint8Array(sendBuffer, 4).set(new Uint8Array(payload))

    this._onOutOfBandSend(sendBuffer)
  }
}
