class AxisEvent {
  /**
   * @param {number}deltaMode
   * @param {number}DOM_DELTA_LINE
   * @param {number}DOM_DELTA_PAGE
   * @param {number}DOM_DELTA_PIXEL
   * @param {number}deltaX
   * @param {number}deltaY
   * @param {number}timestamp
   * @param {string}sceneId
   * @return {{
   * deltaMode: number,
   * DOM_DELTA_LINE: number,
   * DOM_DELTA_PAGE: number,
   * DOM_DELTA_PIXEL: number,
   * deltaX: number,
   * deltaY: number,
   * timestamp: number,
   * sceneId: string
   * }}
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
    return {
      deltaMode,
      DOM_DELTA_LINE,
      DOM_DELTA_PAGE,
      DOM_DELTA_PIXEL,
      deltaX,
      deltaY,
      timestamp,
      sceneId
    }
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
}

export default AxisEvent
