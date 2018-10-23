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
      process.env.DEBUG && console.log(`[compositor-session-${this._compositorSession.id}] Received compositor RTC signal. Forwarding to [app-endpoint-${appEndpointSessionId}].`)
      appEndpointSession.webSocket.send(signalMessage)
    } else {
      throw new Error(`[compositor-session-${this._compositorSession.id}] Failed to parse incoming compositor message. Property 'appEndpointSessionId' with value '${appEndpointSessionId}' did not match a known app endpoint session.`)
    }
  }
}

module.exports = RTCSignalMessageHandler
