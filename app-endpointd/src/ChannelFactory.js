'use strict'

/**
 * @interface
 */
class ChannelFactory {
  /**
   * @return {Channel}
   */
  createChannel () {}
}

module.exports = ChannelFactory
