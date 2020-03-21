class KeyEvent {
  /**
   * @param {string}code
   * @param {number}timestamp
   * @param {boolean}down
   * @return {{code: string, timestamp: number, down: boolean}}
   */
  static create (code, timestamp, down) {
    return { code, timestamp, down }
  }

  /**
   * @param {KeyboardEvent}keyboardEvent
   * @param {boolean}down
   */
  static fromKeyboardEvent (keyboardEvent, down) {
    return KeyEvent.create(keyboardEvent.code, keyboardEvent.timeStamp, down)
  }
}

export default KeyEvent
