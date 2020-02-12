class AxisEvent {
  /**
   * @param {number}deltaMode
   * @param {number}DOM_DELTA_LINE
   * @param {number}DOM_DELTA_PAGE
   * @param {number}DOM_DELTA_PIXEL
   * @param {number}deltaX
   * @param {number}deltaY
   * @param {number}timestamp
   * @param {number}sceneId
   * @return {AxisEvent}
   */
  static create (
    deltaMode,
    DOM_DELTA_LINE,
    DOM_DELTA_PAGE,
    DOM_DELTA_PIXEL,
    deltaX,
    deltaY,
    timestamp,
    sceneId
  ) {
    return new AxisEvent(
      deltaMode,
      DOM_DELTA_LINE,
      DOM_DELTA_PAGE,
      DOM_DELTA_PIXEL,
      deltaX,
      deltaY,
      timestamp,
      sceneId
    )
  }

  /**
   * @param {WheelEvent}wheelEvent
   * @param {string}sceneId
   */
  static fromWheelEvent (wheelEvent, sceneId) {
    return AxisEvent.create(
      wheelEvent.deltaMode,
      wheelEvent.DOM_DELTA_LINE,
      wheelEvent.DOM_DELTA_PAGE,
      wheelEvent.DOM_DELTA_PIXEL,
      wheelEvent.deltaX,
      wheelEvent.deltaY,
      wheelEvent.timeStamp,
      sceneId
    )
  }

  /**
   * @param {number}deltaMode
   * @param {number}DOM_DELTA_LINE
   * @param {number}DOM_DELTA_PAGE
   * @param {number}DOM_DELTA_PIXEL
   * @param {number}deltaX
   * @param {number}deltaY
   * @param {number}timestamp
   * @param {number}sceneId
   * @return {AxisEvent}
   */
  constructor (
    deltaMode,
    DOM_DELTA_LINE,
    DOM_DELTA_PAGE,
    DOM_DELTA_PIXEL,
    deltaX,
    deltaY,
    timestamp,
    sceneId
  ) {
    this.deltaMode = deltaMode
    this.DOM_DELTA_LINE = DOM_DELTA_LINE
    this.DOM_DELTA_PAGE = DOM_DELTA_PAGE
    this.DOM_DELTA_PIXEL = DOM_DELTA_PIXEL
    this.deltaX = deltaX
    this.deltaY = deltaY
    this.timestamp = timestamp
    this.sceneId = sceneId
  }
}

export default AxisEvent
