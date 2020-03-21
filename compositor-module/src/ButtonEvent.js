class ButtonEvent {
  /**
   * @param {number}x
   * @param {number}y
   * @param {number}timestamp
   * @param {number}buttonCode
   * @param {boolean}released
   * @param {number}buttons
   * @param {string}sceneId
   * @return {{x: number, y:  number, timestamp: number, buttonCode: number, released: boolean, buttons: number, sceneId: string}}
   */
  static create (x, y, timestamp, buttonCode, released, buttons, sceneId) {
    return { x, y, timestamp, buttonCode, released, buttons, sceneId }
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
}

export default ButtonEvent
