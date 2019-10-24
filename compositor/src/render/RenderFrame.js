export default class RenderFrame {
  static create () { return new RenderFrame() }

  constructor () {
    /**
     * @type {?function(number):void}
     * @private
     */
    this._animationResolve = null
    /**
     * @type {boolean}
     * @private
     */
    this._fireNow = false
    /**
     * @type {Promise<number>}
     * @private
     */
    this._promise = new Promise(resolve => {
      this._animationResolve = resolve
      window.requestAnimationFrame(() => {
        if (this._fireNow) {
          resolve(Date.now())
        } else {
          this._fireNow = true
        }
      })
    })
  }

  fire () {
    if (this._fireNow) {
      this._animationResolve(Date.now())
    } else {
      this._fireNow = true
    }
  }

  /**
   * @param {function(number):void}doStuff
   * @return {Promise}
   */
  then (doStuff) { return this._promise.then(doStuff) }
}
