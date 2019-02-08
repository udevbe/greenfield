'use strict'

/**
 * @interface
 */
class CommunicationChannelFactory {
  /**
   * @return {CommunicationChannel}
   */
  createMessagesChannel () {}
}

module.exports = CommunicationChannelFactory
