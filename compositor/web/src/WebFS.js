import { WebFD } from 'westfield-runtime-common'

export default class WebFS {
  /**
   * @param {Session}session
   * @return {WebFS}
   */
  static create (session) {
    return new WebFS(session)
  }

  /**
   * @param {Session}session
   */
  constructor (session) {
    /**
     * @type {Session}
     * @private
     */
    this._session = session
    /**
     * @type {Object.<number,WebFD>}
     * @private
     */
    this._webFDs = {}
    /**
     * @type {number}
     * @private
     */
    this._nextFD = 0
  }

  /**
   * @param {ArrayBuffer} arrayBuffer
   * @return {WebFD}
   */
  create (arrayBuffer) {
    const fd = this._nextFD++
    // FIXME we want to use reference counting here instead of simply deleting.
    // Sending the WebFD to an endpoint will increase the ref, and we should wait until the endpoint has closed the fd as well.
    const webFD = new WebFD(fd, 'shm', this._session.compositorSessionId, () => Promise.resolve(arrayBuffer), () => { delete this._webFDs[fd] })
    this._webFDs[fd] = webFD
    return webFD
  }

  /**
   * @param {number}fd
   * @return {WebFD}
   */
  getWebFD (fd) {
    return this._webFDs[fd]
  }
}
