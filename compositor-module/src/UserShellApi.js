/**
 * @typedef {{
 * actions: {
 * notifyInactive: (function(UserSurface): void),
 * requestActive: (function(UserSurface): void)
 * },
 * events: {
 * updateUserSurface: function(UserSurface,UserSurfaceState):void,
 * destroyUserSurface: function(UserSurface):void,
 * createUserSurface: function(UserSurface,UserSurfaceState):void,
 * notify: function(string,string):void
 * }
 * }}UserShell
 */

import ButtonEvent from './ButtonEvent'
import AxisEvent from './AxisEvent'
import KeyEvent from './KeyEvent'

/**
 * @param {Display}display
 * @param {UserSurface}userSurface
 * @param {function(surface: Surface):*}surfaceAction
 * @return {*}
 */
function performSurfaceAction (display, userSurface, surfaceAction) {
  const wlSurfaceResource = display.clients[userSurface.clientId].connection.wlObjects[userSurface.id]
  if (wlSurfaceResource) {
    return surfaceAction(wlSurfaceResource.implementation)
  } else {
    return null
  }
}

/**
 * @param {Session}session
 * @return UserShell
 */
export default session => (
  {
    /**
     * @typedef {{id: string, variant: 'web'|'remote'}}ApplicationClient
     */
    /**
     * @typedef {{pointerGrab: UserSurface, keyboardFocus: UserSurface}}UserSeatState
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
      input: {
        pointerMove: (mouseEvent, sceneId) => {
          mouseEvent.preventDefault()
          session.globals.seat.pointer.handleMouseMove(ButtonEvent.fromMouseEvent(mouseEvent, null, sceneId))
          session.flush()
        },
        buttonUp: (mouseEvent, sceneId) => {
          mouseEvent.preventDefault()
          session.globals.seat.pointer.handleMouseUp(ButtonEvent.fromMouseEvent(mouseEvent, true, sceneId))
          session.flush()
        },
        buttonDown: (mouseEvent, sceneId) => {
          mouseEvent.preventDefault()
          session.globals.seat.pointer.handleMouseDown(ButtonEvent.fromMouseEvent(mouseEvent, false, sceneId))
          session.flush()
        },
        axis: (wheelEvent, sceneId) => {
          wheelEvent.preventDefault()
          session.globals.seat.pointer.handleWheel(AxisEvent.fromWheelEvent(wheelEvent, sceneId))
          session.flush()
        },

        key: (keyboardEvent, down) => {
          session.globals.seat.keyboard.handleKey(KeyEvent.fromKeyboardEvent(keyboardEvent, down))
        }
      },
      /**
       * @param {UserSurface}userSurface
       * @param {string}sceneId
       */
      raise: (userSurface, sceneId) => performSurfaceAction(session.display, userSurface, surface => session.renderer.scenes[sceneId].raiseSurface(surface)),
      /**
       * Request the surface to be made active. An active surface will have a different visual clue ie brighter than
       * an inactive surface. An active surface can receive user input after it has confirmed it's active state.
       * @param {UserSurface}userSurface
       */
      requestActive: userSurface => performSurfaceAction(session.display, userSurface, surface => surface.role.requestActive()),

      /**
       * Notify a surface that it will no longer receive user input. An inactive surface can update it's visual clue
       * to reflect it's inactive state.
       * @param {UserSurface}userSurface
       */
      notifyInactive: userSurface => performSurfaceAction(session.display, userSurface, surface => surface.role.notifyInactive()),

      /**
       * Register a canvas so it can be used to draw applications.
       *
       * @param {string}sceneId
       * @param {HTMLCanvasElement|OffscreenCanvas}canvas
       */
      initScene: (sceneId, canvas) => session.renderer.initScene(sceneId, canvas),

      /**
       * @param {string}sceneId
       * @param {{width:number, height:number}}sceneConfig
       */
      setSceneConfiguration: (sceneId, sceneConfig) => { session.renderer.scenes[sceneId].updateResolution(sceneConfig.width, sceneConfig.height) },

      /**
       * Destroy a scene and all the views that were displayed on it.
       * @param {string}sceneId
       */
      destroyScene: sceneId => session.renderer.scenes[sceneId].destroy(),

      /**
       * Create a new application view that will be shown on the canvas identified by a scene id.
       * @param {UserSurface}userSurface
       * @param {string}sceneId
       * @return {View}
       */
      createView: (userSurface, sceneId) => session.display.clients[userSurface.clientId].connection.wlObjects[userSurface.id].implementation.createTopLevelView(session.renderer.scenes[sceneId]),

      /**
       * @param {UserSurface}userSurface
       */
      setKeyboardFocus: userSurface => performSurfaceAction(session.display, userSurface, surface => session.globals.seat.keyboard.focusGained(surface)),

      /**
       * @param {UserConfiguration}userConfiguration
       */
      setUserConfiguration: userConfiguration => {
        const { pointer, keyboard } = session.globals.seat

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
      closeClient: applicationClient => session.display.clients[applicationClient.id].close()
    }
  }
)
