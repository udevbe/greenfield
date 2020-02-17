class ButtonEvent {
  /**
   * @param {number}x
   * @param {number}y
   * @param {number}timestamp
   * @param {number}buttonCode
   * @param {boolean}released
   * @param {number}buttons
   * @param {string}sceneId
   * @return {ButtonEvent}
   */
  static create (x, y, timestamp, buttonCode, released, buttons, sceneId) {
    return new ButtonEvent(x, y, timestamp, buttonCode, released, buttons, sceneId)
  }

  /**
   * @param {MouseEvent}mouseEvent
   * @param {boolean}released
   * @param {string}sceneId
   * @return {ButtonEvent}
   */
  static fromMouseEvent (mouseEvent, released, sceneId) {
    const currentTarget = /** @type{HTMLElement} */mouseEvent.currentTarget
    const { left: targetX, top: targetY } = currentTarget.getBoundingClientRect()

    return ButtonEvent.create(
      mouseEvent.clientX - targetX,
      mouseEvent.clientY - targetY,
      mouseEvent.timeStamp,
      mouseEvent.button,
      released,
      mouseEvent.buttons,
      sceneId
    )
  }

  /**
   * @param {number}x
   * @param {number}y
   * @param {number}timestamp
   * @param {number}buttonCode
   * @param {boolean}released
   * @param {number}buttons
   * @param {string}sceneId
   */
  constructor (x, y, timestamp, buttonCode, released, buttons, sceneId) {
    /**
     * @type {number}
     */
    this.timestamp = timestamp
    /**
     * @type {number}
     */
    this.x = x
    /**
     * @type {number}
     */
    this.y = y
    /**
     * @type {number}
     */
    this.buttonCode = buttonCode
    /**
     * @type {boolean}
     */
    this.released = released
    /**
     * @type {number}
     */
    this.buttons = buttons
    /**
     * @type {string}
     */
    this.sceneId = sceneId
  }
}

export default ButtonEvent
