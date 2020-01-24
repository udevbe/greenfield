/**
 * @typedef {{
 * actions: {
 * notifyInactive: (function(UserSurface): void),
 * requestActive: (function(UserSurface): (void)
 * },
 * events: {
 * updateUserSurface: function(UserSurface,UserSurfaceState):void,
 * destroyUserSurface: function(UserSurface):void,
 * createUserSurface: function(UserSurface,UserSurfaceState):void,
 * notify: function(string,string):void
 * }
 * }}UserShell
 */

/**
 * @param {Display}display
 * @param {UserSurface}userSurface
 * @param {function(surface: Surface):void}surfaceAction
 */
const performSurfaceAction = (display, userSurface, surfaceAction) => {
  const wlSurfaceResource = display.clients[userSurface.clientId].connection.wlObjects[userSurface.id]
  if (wlSurfaceResource) {
    surfaceAction(wlSurfaceResource.implementation)
  }
}

/**
 * @param {Display}display
 * @return UserShell
 */
export default display => (
  {
    /**
     * @typedef {{id: string, variant: 'web'|'remote'}}ApplicationClient
     */
    /**
     * @typedef {{pointerGrab: UserSurface, keyboardFocus: UserSurface, scrollFactor: number}}UserSeatState
     */
    /**
     * @typedef {{clientId: string, id: number}}UserSurface
     */
    /**
     * @typedef {{title:string, appId:string, mapped:boolean, active: boolean, unresponsive: boolean, minimized: boolean}}UserSurfaceState
     */
    /**
     * @typedef {{scrollFactor:number, keyboardLayoutName: ?string}}UserConfiguration
     */
    events: {
      /**
       * @param {ApplicationClient}applicationClient
       */
      createApplicationClient: (applicationClient) => {},
      /**
       * @param {ApplicationClient}applicationClient
       */
      destroyApplicationClient: (applicationClient) => {},
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
      destroyUserSurface: userSurface => {},

      /**
       * @param {UserSeatState}userSeatState
       */
      updateUserSeat: (userSeatState) => {}
    },

    actions: {
      /**
       * Request the surface to be made active. An active surface will have a different visual clue ie brighter than
       * an inactive surface. An active surface can receive user input after it has confirmed it's active state.
       * @param {UserSurface}userSurface
       */
      requestActive: userSurface => performSurfaceAction(display, userSurface, surface => surface.role.requestActive()),

      /**
       * Notify a surface that it will no longer receive user input. An inactive surface can update it's visual clue
       * to reflect it's inactive state.
       * @param {UserSurface}userSurface
       */
      notifyInactive: userSurface => performSurfaceAction(display, userSurface, surface => surface.role.notifyInactive()),

      /**
       * @param {UserSurface}userSurface
       * @return {View}
       */
      createView: userSurface => display.clients[userSurface.clientId].connection.wlObjects[userSurface.id].implementation.createView(),

      /**
       * @param {UserSurface}userSurface
       */
      setKeyboardFocus: userSurface => performSurfaceAction(display, userSurface, surface => surface.seat.keyboard.focusGained(surface)),

      /**
       * @param {Globals}globals
       * @param {UserConfiguration}userConfiguration
       */
      setUserConfiguration: (globals, userConfiguration) => {
        const { pointer, keyboard } = globals.seat

        pointer.scrollFactor = userConfiguration.scrollFactor

        if (userConfiguration.keyboardLayoutName) {
          keyboard.updateKeymapFromNames(keyboard.nrmlvoEntries.find(nrmlvo => nrmlvo.name === userConfiguration.keyboardLayoutName))
        } else {
          keyboard.updateKeymapFromNames(keyboard.defaultNrmlvo)
        }
      },

      /**
       * @param {ApplicationClient}applicationClient
       */
      closeClient: applicationClient => display.clients[applicationClient.id].close()
    }
  }
)
