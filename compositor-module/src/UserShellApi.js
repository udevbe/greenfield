/**
 * @typedef {{actions: {notifyInactive: (function(UserSurface): void), requestActive: (function(UserSurface): (void)}, events: {updateUserSurface: function(UserSurface,UserSurfaceState):void, destroyUserSurface: function(UserSurface):void, createUserSurface: function(UserSurface,UserSurfaceState):void, notify: function(string,string):void}}}UserShell
 */
/**
 * @param display
 * @return UserShell
 */
export default (display) => (
  {
    /**
     * @typedef {{clientId: string, id: number}}UserSurface
     */
    /**
     * @typedef {{title:string, appId:string, mapped:boolean, active: boolean, unresponsive: boolean, minimized: boolean}}UserSurfaceState
     */
    events: {
      /**
       * Ask the user shell to start managing the given surface.
       * @param {{clientId: string, id}}userSurface
       * @param {UserSurfaceState}state
       */
      createUserSurface: (userSurface, state) => {},

      /**
       * Notify the user of an important event.
       *
       * @param {'success'|'warning'|'error'|'info'}variant
       * @param {string}message
       */
      notify: (variant, message) => {},

      /**
       * @param {UserSurface}userSurface
       * @param {UserSurfaceState}state
       */
      updateUserSurface: (userSurface, state) => {},

      /**
       * @param {UserSurface}userSurface
       */
      destroyUserSurface: userSurface => {}
    },

    actions: {
      /**
       * Request the surface to be made active. An active surface will have a different visual clue ie brighter than
       * an inactive surface. An active surface can receive user input after it has confirmed it's active state.
       * @param {UserSurface}userSurface
       */
      requestActive: userSurface => display.clients[userSurface.clientId].connection.wlObjects[userSurface.id].implementation.role.requestActive(),

      /**
       * Notify a surface that it will no longer receive user input. An inactive surface can update it's visual clue
       * to reflect it's inactive state.
       * @param {UserSurface}userSurface
       */
      notifyInactive: userSurface => display.clients[userSurface.clientId].connection.wlObjects[userSurface.id].implementation.role.notifyInactive(),

      createView: userSurface => display.clients[userSurface.clientId].connection.wlObjects[userSurface.id].implementation.createView()
    }
  }
)
