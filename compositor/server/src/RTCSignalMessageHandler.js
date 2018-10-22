'use strict'

class RTCSignalMessageHandler {
  /**
   * @param {CompositorSession}compositorSession
   */
  static create (compositorSession) {
    return new RTCSignalMessageHandler(compositorSession)
  }

  /**
   * @param {CompositorSession}compositorSession
   */
  constructor (compositorSession) {
    /**
     * @type {CompositorSession}
     * @private
     */
    this._compositorSession = compositorSession
  }

  rtcSignal (args) {
    const { signalMessage, appEndpointSessionId } = args

    const appEndpointSession = this._compositorSession.appEndpointSessions[appEndpointSessionId]
    if (appEndpointSession) {
      appEndpointSession.webSocket.send(signalMessage)
    } else {
      throw new Error(`Compositor session [${this._compositorSession.id}] failed to parse incoming compositor message. Property 'appEndpointSessionId' with value '${appEndpointSessionId}' did not match a known app endpoint session.`)
    }
  }

  rtcAppEndpointSignal (args) {
    const { signalMessage } = args
    this._compositorSession.webSocket.send(signalMessage)
  }
}

module.exports = RTCSignalMessageHandler
