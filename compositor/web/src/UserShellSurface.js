/**
 * Implementations are expected to extend this class.
 * @interface
 */
export default class UserShellSurface {
  /**
   * The title of the surface
   * @param {string} title
   */
  set title (title) {}

  /**
   * The id of the application. Can be used to group surfaces.
   * @param {string}appId
   */
  set appId (appId) {}

  /**
   * Indicates if the surface contents can be displayed on screen.
   * @param {boolean}mapped
   */
  set mapped (mapped) {}

  /**
   * Indicates if the application is responding.
   * @param {boolean}unresponsive
   */
  set unresponsive (unresponsive) {}

  /**
   * Registers a callback that will be fired when the user shell wants to make a surface active (ie give it input)
   * @param {function}activeCallback
   */
  set onActivationRequest (activeCallback) {}

  /**
   * Registers callback that notifies if a surface is no longer active (ie no longer receives input)
   * @param {function}inactivateCallback
   */
  set onInactive (inactivateCallback) {}

  /**
   * Confirms that the user shell can give the surface input.
   */
  activationAck () {}

  /**
   * Notifies the user shell that it should destroy all resources associated with the surface
   */
  destroy () {}

  /**
   * Notifies the user shell that the surface should no longer be displayed. If the surface is still mapped then the
   * surface contents can still be displayed ie in a live updating tile.
   */
  minimize () {}
}
