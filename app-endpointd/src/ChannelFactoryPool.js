const ChannelNotifier = require('./ChannelNotifier')

class ChannelFactoryPool {
  constructor () {
    /**
     * @type {ChannelNotifier}
     */
    this.channelNotifier = ChannelNotifier.create()
  }

  /**
   * @param {string}remotePeerId
   * @return {ChannelFactory}
   * @abstract
   */
  get (remotePeerId) {}
}

module.exports = ChannelFactoryPool
