'use strict'

/**
 * @interface
 */
class CommunicationChannelFactory {
  /**
   * @param {string}label
   * @return {CommunicationChannel}
   */
  createMessagesChannel (label) {}
}

module.exports = CommunicationChannelFactory
