class ChannelNotifier {
  /**
   * @return {ChannelNotifier}
   */
  static create () {
    return new ChannelNotifier()
  }

  constructor () {
    /**
     * @type {Array<function(channel: Channel):void>}
     * @private
     */
    this._listeners = []
  }

  /**
   * @param {function(channel: Channel):void}listener
   */
  addListener (listener) {
    this._listeners.push(listener)
  }

  /**
   * @param {function(channel: Channel):void}listener
   */
  removeListener (listener) {
    const idx = this._listeners.indexOf(listener)
    if (idx > -1) {
      this._listeners.splice(idx, 1)
    }
  }

  /**
   * @param {Channel}newChannel
   */
  notify (newChannel) {
    this._listeners.forEach(listener => listener(newChannel))
  }
}

module.exports = ChannelNotifier
