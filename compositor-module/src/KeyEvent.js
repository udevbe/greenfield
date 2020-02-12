class KeyEvent {
  /**
   * @param {string}code
   * @param {number}timestamp
   * @param {boolean}down
   */
  static create (code, timestamp, down) {
    return new KeyEvent(code, timestamp, down)
  }

  /**
   * @param {KeyboardEvent}keyboardEvent
   * @param {boolean}down
   */
  static fromKeyboardEvent (keyboardEvent, down) {
    return KeyEvent.create(keyboardEvent.code, keyboardEvent.timeStamp, down)
  }

  /**
   * @param {string}code
   * @param {number}timestamp
   * @param {boolean}down
   */
  constructor (code, timestamp, down) {
    /**
     * @type {string}
     */
    this.code = code
    /**
     * @type {number}
     */
    this.timestamp = timestamp
    /**
     * @type {boolean}
     */
    this.down = down
  }
}

export default KeyEvent
