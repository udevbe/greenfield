'use strict'

/**
 * @interface
 */
class CommunicationChannel {
  close () {}

  /**
   * @param {ArrayBuffer}arrayBuffer
   */
  send (arrayBuffer) {}

  set onerror (onErrorEventHandler) {}

  set onclose (onCloseEventHandler) {}

  set onmessage (onMessageEventHandler) {}

  set onopen (onOpenEventHandler) {}

  /**
   * @return {string}
   */
  get readyState () {}
}

module.exports = CommunicationChannel
