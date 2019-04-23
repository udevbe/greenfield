// Copyright 2019 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

'use strict'

import XdgToplevelResource from './protocol/XdgToplevelResource'
import XdgToplevelRequests from './protocol/XdgToplevelRequests'
import XdgWmBaseResource from './protocol/XdgWmBaseResource'

import Point from './math/Point'
import Size from './Size'
import Renderer from './render/Renderer'
import Mat4 from './math/Mat4'

const { none, bottom, bottomLeft, bottomRight, left, right, top, topLeft, topRight } = XdgToplevelResource.ResizeEdge
const { fullscreen, activated, maximized, resizing } = XdgToplevelResource.State

/**
 *
 *      This interface defines an xdg_surface role which allows a surface to,
 *      among other things, set window-like properties such as maximize,
 *      fullscreen, and minimize, set application-specific metadata like title and
 *      id, and well as trigger user interactive operations such as interactive
 *      resize and move.
 *
 *      Unmapping an xdg_toplevel means that the surface cannot be shown
 *      by the compositor until it is explicitly mapped again.
 *      All active operations (e.g., move, resize) are canceled and all
 *      attributes (e.g. title, state, stacking, ...) are discarded for
 *      an xdg_toplevel surface when it is unmapped.
 *
 *      Attaching a null buffer to a toplevel unmaps the surface.
 *
 * @implements {SurfaceRole}
 * @implements {XdgToplevelRequests}
 */
export default class XdgToplevel extends XdgToplevelRequests {
  /**
   * @param {XdgToplevelResource}xdgToplevelResource
   * @param {XdgSurface}xdgSurface
   * @param {Session} session
   * @param {UserShell}userShell
   */
  static create (xdgToplevelResource, xdgSurface, session, userShell) {
    const surface = /** @type {Surface} */xdgSurface.wlSurfaceResource.implementation
    const xdgToplevel = new XdgToplevel(xdgToplevelResource, xdgSurface, session)
    xdgToplevelResource.implementation = xdgToplevel
    surface.role = xdgToplevel

    xdgToplevel.userShellSurface = userShell.manage(
      surface,
      (userShellSurface) => {
        if (xdgToplevel._configureState.state.includes(activated)) {
          userShellSurface.activation()
        } else {
          const newState = xdgToplevel._configureState.state.slice()
          newState.push(activated)
          xdgToplevel._emitConfigure(xdgToplevelResource, xdgToplevel._configureState.width, xdgToplevel._configureState.height, newState, none)
        }
      },
      (userShellSurface) => {
        if (xdgToplevel._configureState.state.includes(activated)) {
          const newState = xdgToplevel._configureState.state.slice()
          const idx = newState.indexOf(activated)
          newState.splice(idx, 1)
          xdgToplevel._emitConfigure(xdgToplevelResource, xdgToplevel._configureState.width, xdgToplevel._configureState.height, newState, none)
        }
      }
    )

    return xdgToplevel
  }

  /**
   * Use XdgToplevel.create(..) instead.
   * @param {XdgToplevelResource}xdgToplevelResource
   * @param {XdgSurface}xdgSurface
   * @param {Session} session
   * @private
   */
  constructor (xdgToplevelResource, xdgSurface, session) {
    super()
    /**
     * @type {XdgToplevelResource}
     */
    this.resource = xdgToplevelResource
    /**
     * @type {XdgSurface}
     */
    this.xdgSurface = xdgSurface
    /**
     * @type {Session}
     * @private
     */
    this._session = session
    /**
     * @type {UserShellSurface}
     */
    this.userShellSurface = null
    /**
     * @type {XdgToplevelResource|null}
     * @private
     */
    this._parent = null
    /**
     * @type {string}
     * @private
     */
    this._title = ''
    /**
     * @type {string}
     * @private
     */
    this._appId = ''
    /**
     * @type {Point}
     * @private
     */
    this._pendingMaxSize = Point.create(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
    /**
     * @type {Point}
     */
    this._maxSize = Point.create(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
    /**
     * @type {Point}
     * @private
     */
    this._pendingMinSize = Point.create(0, 0)
    /**
     * @type {Point}
     */
    this._minSize = Point.create(0, 0)
    /**
     * @type {Array<{serial: number, state: number[], width: number, height: number, resizeEdge: number}>}
     */
    this._pendingConfigureStates = []
    /**
     * @type {{state: number[], width: number, height: number}|null}
     * @private
     */
    this._unfullscreenConfigureState = null

    /**
     * @type {{serial: number, state: number[], width: number, height: number}}
     * @private
     */
    this._ackedConfigureState = { serial: 0, state: [], width: 0, height: 0, resizeEdge: 0 }
    /**
     * @type {{serial: number, state: number[], width: number, height: number}}
     * @private
     */
    this._configureState = { serial: 0, state: [], width: 0, height: 0, resizeEdge: 0 }
    /**
     * @type {Rect|Null}
     * @private
     */
    this._previousGeometry = null
    /**
     * @type {boolean}
     */
    this.mapped = false
  }

  /**
   * @return {{windowGeometry: Rect, maxSize: Point, minSize: Point, configureState: {serial: number, state: number[], width: number, height: number}}}
   * @override
   */
  captureRoleState () {
    return {
      windowGeometry: this.xdgSurface.pendingWindowGeometry,
      maxSize: this._pendingMaxSize,
      minSize: this._pendingMinSize,
      configureState: this._ackedConfigureState
    }
  }

  /**
   * @param {{windowGeometry: Rect, maxSize: Point, minSize: Point, configureState: {serial: number, state: number[], width: number, height: number}}}roleState
   * @override
   */
  setRoleState (roleState) {
    this._minSize = roleState.minSize
    this._maxSize = roleState.maxSize

    const { x: minWidth, y: minHeight } = roleState.minSize
    let { x: maxWidth, y: maxHeight } = roleState.maxSize
    maxWidth = maxWidth === 0 ? Number.MAX_SAFE_INTEGER : maxWidth
    maxHeight = maxHeight === 0 ? Number.MAX_SAFE_INTEGER : maxHeight

    if (minWidth < 0 || minHeight < 0 || minWidth > maxWidth || minHeight > maxHeight) {
      this.resource.postError(XdgWmBaseResource.Error.invalidSurfaceState, 'Min size can not be greater than max size.')
      DEBUG && console.log('[client-protocol-error] Min size can not be greater than max size.')
      return
    }
    if (maxWidth < 0 || maxHeight < 0 || maxWidth < minWidth || maxHeight < minHeight) {
      this.resource.postError(XdgWmBaseResource.Error.invalidSurfaceState, 'Max size can not be me smaller than min size.')
      DEBUG && console.log('[client-protocol-error] Max size can not be less than min size.')
      return
    }

    this._minSize = Point.create(minWidth, minHeight)
    this._maxSize = Point.create(maxWidth, maxHeight)

    if (roleState.configureState.state.includes(activated) &&
      !this._configureState.state.includes(activated)) {
      this.userShellSurface.activation()
    }

    this._configureState = roleState.configureState
    this.xdgSurface.updateWindowGeometry(roleState.windowGeometry)
  }

  /**
   * @param {Surface}surface
   * @param {RenderFrame}renderFrame
   * @param {SurfaceState}newState
   * @return {Promise<void>}
   * @override
   */
  async onCommit (surface, renderFrame, newState) {
    if (newState.bufferContents) {
      if (!this.mapped) {
        this._map(surface)
      }
      if (newState.roleState.configureState.state.includes(resizing)) {
        this._resizingCommit(surface, renderFrame, newState)
      } else if (newState.roleState.configureState.state.includes(maximized)) {
        this._maximizedCommit(surface, renderFrame, newState)
      } else if (newState.roleState.configureState.state.includes(fullscreen)) {
        this._fullscreenCommit(surface, renderFrame, newState)
      } else {
        this._normalCommit(surface, renderFrame, newState)
      }
    } else if (this.mapped) {
      this._unmap()
    }

    await surface.render(renderFrame, newState)
    renderFrame.fire()
    await renderFrame
    this._session.flush()
  }

  /**
   * @param {Surface}surface
   * @private
   */
  _map (surface) {
    this.mapped = true
    this.userShellSurface.mapped = true
  }

  /**
   * @private
   */
  _unmap () {
    this.mapped = false
    this._configureState = { serial: 0, state: [], width: 0, height: 0, resizeEdge: 0 }
    this.userShellSurface.mapped = false
  }

  /**
   * @param {Surface}surface
   * @param {RenderFrame}renderFrame
   * @param {SurfaceState}newState
   * @private
   */
  _resizingCommit (surface, renderFrame, newState) {
    const roleState = newState.roleState
    const { w: newSurfaceWidth, h: newSurfaceHeight } = roleState.windowGeometry.size

    const { w: oldSurfaceWidth, h: oldSurfaceHeight } = this.xdgSurface.windowGeometry.size

    let dx = 0
    let dy = 0
    const edges = this._configureState.resizeEdge
    switch (edges) {
      case topRight:
      case top: {
        dy = oldSurfaceHeight - newSurfaceHeight
        break
      }
      case bottomLeft:
      case left: {
        dx = oldSurfaceWidth - newSurfaceWidth
        break
      }
      case topLeft: {
        dx = oldSurfaceWidth - newSurfaceWidth
        dy = oldSurfaceHeight - newSurfaceHeight
        break
      }
      default: {
        break
      }
    }

    if (dx || dy) {
      const { x, y } = surface.surfaceChildSelf.position
      surface.surfaceChildSelf.position = Point.create(x + dx, y + dy)
      surface.views.forEach(value => {
        value.applyTransformations(renderFrame)
      })
    }
  }

  /**
   * @param {Surface}surface
   * @param {RenderFrame}renderFrame
   * @param {SurfaceState}newState
   * @private
   */
  _maximizedCommit (surface, renderFrame, newState) {
    const roleState = newState.roleState
    const { w: newSurfaceWidth, h: newSurfaceHeight } = roleState.windowGeometry.size

    if (newSurfaceWidth !== roleState.configureState.width || newSurfaceHeight !== roleState.configureState.height) {
      this.resource.postError(XdgWmBaseResource.Error.invalidSurfaceState, 'Surface size does not match configure event.')
      DEBUG && console.log('[client-protocol-error] Surface size does not match configure event.')
      return
    }

    if (!this._previousGeometry) {
      this._storePreviousGeometry()
    }
    if (this._unfullscreenConfigureState) {
      this._unfullscreenConfigureState = null
    }
    const windowGeoPositionOffset = newState.roleState.windowGeometry.position

    const primaryView = surface.views.find(view => { return view.primary })
    const viewPositionOffset = primaryView.toViewSpaceFromSurface(windowGeoPositionOffset)

    primaryView.customTransformation = Mat4.translation(0 - viewPositionOffset.x, 0 - viewPositionOffset.y)
    primaryView.applyTransformations(renderFrame)
  }

  /**
   * @param {Surface}surface
   * @param {RenderFrame}renderFrame
   * @param {SurfaceState}newState
   * @private
   */
  _fullscreenCommit (surface, renderFrame, newState) {
    const bufferSize = newState.bufferContents.size
    const { x: newSurfaceWidth, y: newSurfaceHeight } = surface.toSurfaceSpace(Point.create(bufferSize.w, bufferSize.h))
    if (newSurfaceWidth > this._configureState.width || newSurfaceHeight > this._configureState.height) {
      this.resource.postError(XdgWmBaseResource.Error.invalidSurfaceState, 'Surface size does not match configure event.')
      DEBUG && console.log('[client protocol error] Surface size does not match configure event.')
      return
    }

    if (!this._unfullscreenConfigureState) {
      this._unfullscreenConfigureState = this._configureState
    }
    if (!this._previousGeometry) {
      this._storePreviousGeometry()
    }

    const x = (window.innerWidth - newSurfaceWidth) / 2
    const y = (window.innerHeight - newSurfaceHeight) / 2

    surface.surfaceChildSelf.position = Point.create(x, y)
    surface.views.forEach(value => {
      value.applyTransformations(renderFrame)
    })
    // TODO put an opaque black fullscreen div behind the fullscreened application
    // TODO make sure z-order is always the highest
    // TODO also do this for ShellSurface
  }

  /**
   * @param {Surface}surface
   * @param {RenderFrame}renderFrame
   * @param {SurfaceState}newState
   * @private
   */
  _normalCommit (surface, renderFrame, newState) {
    if (this._previousGeometry) {
      // restore position (we came from a fullscreen or maximize and must restore the position)
      const primaryView = surface.views.find(view => { return view.primary })
      primaryView.customTransformation = null
      primaryView.applyTransformations(renderFrame)
      this._previousGeometry = null
    }
    if (this._unfullscreenConfigureState) {
      this._unfullscreenConfigureState = null
    }
  }

  /**
   * @param {number}serial
   */
  ackConfigure (serial) {
    this._pendingConfigureStates = this._pendingConfigureStates.filter((pendingConfigureState) => {
      if (pendingConfigureState.serial < serial) {
        return false
      } else if (pendingConfigureState.serial === serial) {
        this._ackedConfigureState = pendingConfigureState
        return false
      }
      return true
    })
  }

  /**
   * @private
   */
  _storePreviousGeometry () {
    this._previousGeometry = this.xdgSurface.windowGeometry
  }

  /**
   *
   *  This request destroys the role surface and unmaps the surface;
   *  see "Unmapping" behavior in interface section for details.
   *
   *
   * @param {XdgToplevelResource} resource
   *
   * @since 1
   * @override
   */
  destroy (resource) {
    this._unmap()
    resource.destroy()
  }

  /**
   *
   *  Set the "parent" of this surface. This surface should be stacked
   *  above the parent surface and all other ancestor surfaces.
   *
   *  Parent windows should be set on dialogs, toolboxes, or other
   *  "auxiliary" surfaces, so that the parent is raised when the dialog
   *  is raised.
   *
   *  Setting a null parent for a child window removes any parent-child
   *  relationship for the child. Setting a null parent for a window which
   *  currently has no parent is a no-op.
   *
   *  If the parent is unmapped then its children are managed as
   *  though the parent of the now-unmapped parent has become the
   *  parent of this surface. If no parent exists for the now-unmapped
   *  parent then the children are managed as though they have no
   *  parent surface.
   *
   *
   * @param {XdgToplevelResource} resource
   * @param {?XdgToplevelResource} parent
   *
   * @since 1
   * @override
   */
  setParent (resource, parent) {
    if (this._parent) {
      const oldParentXdgToplevel = /** @type {XdgToplevel} */this._parent.implementation
      const oldParentXdgSurface = oldParentXdgToplevel.xdgSurface
      const oldParentSurface = /** @type {Surface} */oldParentXdgSurface.wlSurfaceResource.implementation
      const surface = /** @type {Surface} */this.xdgSurface.wlSurfaceResource.implementation
      oldParentSurface.removeChild(surface.surfaceChildSelf)
    }

    if (parent) {
      const parentXdgToplevel = /** @type {XdgToplevel} */parent.implementation
      const parentXdgSurface = parentXdgToplevel.xdgSurface
      const parentSurface = /** @type {Surface} */parentXdgSurface.wlSurfaceResource.implementation
      const surface = /** @type {Surface} */this.xdgSurface.wlSurfaceResource.implementation
      parentSurface.addToplevelChild(surface.surfaceChildSelf)
    }

    this._parent = parent
  }

  /**
   *
   *  Set a short title for the surface.
   *
   *  This string may be used to identify the surface in a task bar,
   *  window list, or other user interface elements provided by the
   *  compositor.
   *
   *  The string must be encoded in UTF-8.
   *
   *
   * @param {XdgToplevelResource} resource
   * @param {string} title undefined
   *
   * @since 1
   * @override
   */
  setTitle (resource, title) {
    this._title = title
    this.userShellSurface.title = title
  }

  /**
   *
   *  Set an application identifier for the surface.
   *
   *  The app ID identifies the general class of applications to which
   *  the surface belongs. The compositor can use this to group multiple
   *  surfaces together, or to determine how to launch a new application.
   *
   *  For D-Bus activatable applications, the app ID is used as the D-Bus
   *  service name.
   *
   *  The compositor shell will try to group application surfaces together
   *  by their app ID. As a best practice, it is suggested to select app
   *  ID's that match the basename of the application's .desktop file.
   *  For example, "org.freedesktop.FooViewer" where the .desktop file is
   *  "org.freedesktop.FooViewer.desktop".
   *
   *  See the desktop-entry specification [0] for more details on
   *  application identifiers and how they relate to well-known D-Bus
   *  names and .desktop files.
   *
   *  [0] http://standards.freedesktop.org/desktop-entry-spec/
   *
   *
   * @param {XdgToplevelResource} resource
   * @param {string} appId undefined
   *
   * @since 1
   * @override
   */
  setAppId (resource, appId) {
    this._appId = appId
    this.userShellSurface.appId = appId
  }

  /**
   *
   *  Clients implementing client-side decorations might want to show
   *  a context menu when right-clicking on the decorations, giving the
   *  user a menu that they can use to maximize or minimize the window.
   *
   *  This request asks the compositor to pop up such a window menu at
   *  the given position, relative to the local surface coordinates of
   *  the parent surface. There are no guarantees as to what menu items
   *  the window menu contains.
   *
   *  This request must be used in response to some sort of user action
   *  like a button press, key press, or touch down event.
   *
   *
   * @param {XdgToplevelResource} resource
   * @param {WlSeatResource} wlSeatResource the wl_seat of the user event
   * @param {number} serial the serial of the user event
   * @param {number} x the x position to pop up the window menu at
   * @param {number} y the y position to pop up the window menu at
   *
   * @since 1
   *
   */
  showWindowMenu (resource, wlSeatResource, serial, x, y) {
    const seat = /** @type {Seat} */wlSeatResource.implementation

    if (!seat.isValidInputSerial(serial)) {
      DEBUG && console.log('[client-protocol-warning] - showWindowMenu serial mismatch. Ignoring.')
      return
    }

    this._showWindowMenuAt(Point.create(x, y))
  }

  /**
   * @param {Point}point
   * @private
   */
  _showWindowMenuAt (point) {
    // TODO
  }

  /**
   *
   *  Start an interactive, user-driven move of the surface.
   *
   *  This request must be used in response to some sort of user action
   *  like a button press, key press, or touch down event. The passed
   *  serial is used to determine the type of interactive move (touch,
   *  pointer, etc).
   *
   *  The server may ignore move requests depending on the state of
   *  the surface (e.g. fullscreen or maximized), or if the passed serial
   *  is no longer valid.
   *
   *  If triggered, the surface will lose the focus of the device
   *  (wl_pointer, wl_touch, etc) used for the move. It is up to the
   *  compositor to visually indicate that the move is taking place, such as
   *  updating a pointer cursor, during the move. There is no guarantee
   *  that the device focus will return when the move is completed.
   *
   *
   * @param {XdgToplevelResource} resource
   * @param {WlSeatResource} wlSeatResource the wl_seat of the user event
   * @param {number} serial the serial of the user event
   *
   * @since 1
   * @override
   */
  move (resource, wlSeatResource, serial) {
    if (this._configureState.state.includes(fullscreen) || this._configureState.state.includes(maximized)) {
      return
    }

    const seat = /** @type {Seat} */wlSeatResource.implementation

    if (!seat.isValidInputSerial(serial)) {
      DEBUG && console.log('[client-protocol-warning] - Move serial mismatch. Ignoring.')
      return
    }

    const pointer = seat.pointer
    const surface = /** @type {Surface} */this.xdgSurface.wlSurfaceResource.implementation
    const surfaceChildSelf = surface.surfaceChildSelf
    const origPosition = surfaceChildSelf.position

    const pointerX = pointer.x
    const pointerY = pointer.y

    const moveListener = () => {
      if (!this.mapped) {
        pointer.removeMouseMoveListener(moveListener)
        return
      }

      const deltaX = pointer.x - pointerX
      const deltaY = pointer.y - pointerY

      surfaceChildSelf.position = Point.create(origPosition.x + deltaX, origPosition.y + deltaY)

      const renderFrame = Renderer.createRenderFrame()
      surface.views.forEach((view) => {
        view.applyTransformations(renderFrame)
      })
      renderFrame.fire()
    }

    pointer.onButtonRelease().then(() => {
      surface.hasPointerInput = true
      pointer.removeMouseMoveListener(moveListener)
      pointer.setDefaultCursor()
    })

    surface.hasPointerInput = false
    pointer.unsetFocus()
    pointer.addMouseMoveListener(moveListener)
    window.document.body.style.cursor = 'move'
  }

  /**
   *
   *  Start a user-driven, interactive resize of the surface.
   *
   *  This request must be used in response to some sort of user action
   *  like a button press, key press, or touch down event. The passed
   *  serial is used to determine the type of interactive resize (touch,
   *  pointer, etc).
   *
   *  The server may ignore resize requests depending on the state of
   *  the surface (e.g. fullscreen or maximized).
   *
   *  If triggered, the client will receive configure events with the
   *  "resize" state enum value and the expected sizes. See the "resize"
   *  enum value for more details about what is required. The client
   *  must also acknowledge configure events using "ack_configure". After
   *  the resize is completed, the client will receive another "configure"
   *  event without the resize state.
   *
   *  If triggered, the surface also will lose the focus of the device
   *  (wl_pointer, wl_touch, etc) used for the resize. It is up to the
   *  compositor to visually indicate that the resize is taking place,
   *  such as updating a pointer cursor, during the resize. There is no
   *  guarantee that the device focus will return when the resize is
   *  completed.
   *
   *  The edges parameter specifies how the surface should be resized,
   *  and is one of the values of the resize_edge enum. The compositor
   *  may use this information to update the surface position for
   *  example when dragging the top left corner. The compositor may also
   *  use this information to adapt its behavior, e.g. choose an
   *  appropriate cursor image.
   *
   *
   * @param {XdgToplevelResource} resource
   * @param {WlSeatResource} wlSeatResource the wl_seat of the user event
   * @param {Number} serial the serial of the user event
   * @param {Number} edges which edge or corner is being dragged
   *
   * @since 1
   * @override
   */
  resize (resource, wlSeatResource, serial, edges) {
    if (this._configureState.state.includes(fullscreen) || this._configureState.state.includes(maximized)) {
      return
    }

    const seat = /** @type {Seat} */wlSeatResource.implementation
    const pointer = seat.pointer

    if (!seat.isValidInputSerial(serial)) {
      DEBUG && console.log('[client-protocol-warning] - Resize serial mismatch. Ignoring.')
      return
    }
    // assigned in switch statement
    let sizeAdjustment = /** @type {function(width, height, deltaX, deltaY):void} */ null

    switch (edges) {
      case bottomRight: {
        window.document.body.style.cursor = 'nwse-resize'
        sizeAdjustment = (width, height, deltaX, deltaY) => {
          return { w: width + deltaX, h: height + deltaY }
        }
        break
      }
      case top: {
        window.document.body.style.cursor = 'ns-resize'
        sizeAdjustment = (width, height, deltaX, deltaY) => {
          return { w: width, h: height - deltaY }
        }
        break
      }
      case bottom: {
        window.document.body.style.cursor = 'ns-resize'
        sizeAdjustment = (width, height, deltaX, deltaY) => {
          return { w: width, h: height + deltaY }
        }
        break
      }
      case left: {
        window.document.body.style.cursor = 'ew-resize'
        sizeAdjustment = (width, height, deltaX, deltaY) => {
          return { w: width - deltaX, h: height }
        }
        break
      }
      case topLeft: {
        window.document.body.style.cursor = 'nwse-resize'
        sizeAdjustment = (width, height, deltaX, deltaY) => {
          return { w: width - deltaX, h: height - deltaY }
        }
        break
      }
      case bottomLeft: {
        window.document.body.style.cursor = 'nesw-resize'
        sizeAdjustment = (width, height, deltaX, deltaY) => {
          return { w: width - deltaX, h: height + deltaY }
        }
        break
      }
      case right: {
        window.document.body.style.cursor = 'ew-resize'
        sizeAdjustment = (width, height, deltaX, deltaY) => {
          return { w: width + deltaX, h: height }
        }
        break
      }
      case topRight: {
        window.document.body.style.cursor = 'nesw-resize'
        sizeAdjustment = (width, height, deltaX, deltaY) => {
          return { w: width + deltaX, h: height - deltaY }
        }
        break
      }
      case none:
      default: {
        pointer.setDefaultCursor()
        sizeAdjustment = (width, height, deltaX, deltaY) => {
          return { w: width, h: height }
        }
        break
      }
    }

    const pointerX = pointer.x
    const pointerY = pointer.y
    const { width: windowGeometryWidth, height: windowGeometryHeight } = this.xdgSurface.windowGeometry

    const sizeCalculation = () => {
      const deltaX = pointer.x - pointerX
      const deltaY = pointer.y - pointerY

      const size = sizeAdjustment(windowGeometryWidth, windowGeometryHeight, deltaX, deltaY)
      // TODO min/max constraints
      const width = Math.max(this._minSize.x, Math.min(size.w, this._maxSize.x))
      const height = Math.max(this._minSize.y, Math.min(size.h, this._maxSize.y))

      return Size.create(width, height)
    }

    const resizeListener = () => {
      if (!this.mapped) {
        pointer.removeMouseMoveListener(resizeListener)
        return
      }

      const { w: width, h: height } = sizeCalculation()
      this._emitConfigure(resource, width, height, [activated, resizing], edges)
      this._session.flush()
    }

    const surface = /** @type {Surface} */this.xdgSurface.wlSurfaceResource.implementation
    pointer.onButtonRelease().then(() => {
      surface.hasPointerInput = true
      pointer.removeMouseMoveListener(resizeListener)
      pointer.setDefaultCursor()

      const { w: width, h: height } = sizeCalculation()
      this._emitConfigure(resource, width, height, [activated], none)
      this._session.flush()
    })

    surface.hasPointerInput = false
    pointer.unsetFocus()
    pointer.addMouseMoveListener(resizeListener)
  }

  /**
   * @param {XdgToplevelResource} resource
   * @param {number}width
   * @param {number}height
   * @param {Array<number>}states
   * @param {number}resizeEdge
   * @private
   */
  _emitConfigure (resource, width, height, states, resizeEdge) {
    resource.configure(width, height, Uint32Array.from(states))
    this.xdgSurface.emitConfigureDone()
    this._pendingConfigureStates.push({
      serial: this.xdgSurface.configureSerial,
      state: states,
      width: width,
      height: height,
      resizeEdge: resizeEdge
    })
  }

  /**
   *
   *  Set a maximum size for the window.
   *
   *  The client can specify a maximum size so that the compositor does
   *  not try to configure the window beyond this size.
   *
   *  The width and height arguments are in window geometry coordinates.
   *  See xdg_surface.set_window_geometry.
   *
   *  Values set in this way are double-buffered. They will get applied
   *  on the next commit.
   *
   *  The compositor can use this information to allow or disallow
   *  different states like maximize or fullscreen and draw accurate
   *  animations.
   *
   *  Similarly, a tiling window manager may use this information to
   *  place and resize client windows in a more effective way.
   *
   *  The client should not rely on the compositor to obey the maximum
   *  size. The compositor may decide to ignore the values set by the
   *  client and request a larger size.
   *
   *  If never set, or a value of zero in the request, means that the
   *  client has no expected maximum size in the given dimension.
   *  As a result, a client wishing to reset the maximum size
   *  to an unspecified state can use zero for width and height in the
   *  request.
   *
   *  Requesting a maximum size to be smaller than the minimum size of
   *  a surface is illegal and will result in a protocol error.
   *
   *  The width and height must be greater than or equal to zero. Using
   *  strictly negative values for width and height will result in a
   *  protocol error.
   *
   *
   * @param {XdgToplevelResource} resource
   * @param {number} width undefined
   * @param {number} height undefined
   *
   * @since 1
   * @override
   */
  setMaxSize (resource, width, height) {
    this._pendingMaxSize = Point.create(width, height)
  }

  /**
   *
   *  Set a minimum size for the window.
   *
   *  The client can specify a minimum size so that the compositor does
   *  not try to configure the window below this size.
   *
   *  The width and height arguments are in window geometry coordinates.
   *  See xdg_surface.set_window_geometry.
   *
   *  Values set in this way are double-buffered. They will get applied
   *  on the next commit.
   *
   *  The compositor can use this information to allow or disallow
   *  different states like maximize or fullscreen and draw accurate
   *  animations.
   *
   *  Similarly, a tiling window manager may use this information to
   *  place and resize client windows in a more effective way.
   *
   *  The client should not rely on the compositor to obey the minimum
   *  size. The compositor may decide to ignore the values set by the
   *  client and request a smaller size.
   *
   *  If never set, or a value of zero in the request, means that the
   *  client has no expected minimum size in the given dimension.
   *  As a result, a client wishing to reset the minimum size
   *  to an unspecified state can use zero for width and height in the
   *  request.
   *
   *  Requesting a minimum size to be larger than the maximum size of
   *  a surface is illegal and will result in a protocol error.
   *
   *  The width and height must be greater than or equal to zero. Using
   *  strictly negative values for width and height will result in a
   *  protocol error.
   *
   *
   * @param {XdgToplevelResource} resource
   * @param {number} width
   * @param {number} height
   *
   * @since 1
   * @override
   */
  setMinSize (resource, width, height) {
    this._pendingMinSize = Point.create(width, height)
  }

  /**
   *
   *  Maximize the surface.
   *
   *  After requesting that the surface should be maximized, the compositor
   *  will respond by emitting a configure event with the "maximized" state
   *  and the required window geometry. The client should then update its
   *  content, drawing it in a maximized state, i.e. without shadow or other
   *  decoration outside of the window geometry. The client must also
   *  acknowledge the configure when committing the new content (see
   *  ack_configure).
   *
   *  It is up to the compositor to decide how and where to maximize the
   *  surface, for example which output and what region of the screen should
   *  be used.
   *
   *  If the surface was already maximized, the compositor will still emit
   *  a configure event with the "maximized" state.
   *
   *  If the surface is in a fullscreen state, this request has no direct
   *  effect. It will alter the state the surface is returned to when
   *  unmaximized if not overridden by the compositor.
   *
   *
   * @param {XdgToplevelResource} resource
   *
   * @since 1
   * @override
   */
  setMaximized (resource) {
    if (this._configureState.state.includes(resizing)) {
      return
    }

    const { width: workspaceWidth, height: workspaceHeight } = document.getElementById('workspace').getBoundingClientRect()
    const maxWidth = Math.round(workspaceWidth)
    const maxHeight = Math.round(workspaceHeight)

    if (this._configureState.state.includes(fullscreen)) {
      this._unfullscreenConfigureState = {
        state: [maximized, activated],
        width: maxWidth,
        height: maxHeight
      }
    } else {
      this._emitConfigure(resource, maxWidth, maxHeight, [maximized, activated], none)
    }
  }

  /**
   *
   *  Unmaximize the surface.
   *
   *  After requesting that the surface should be unmaximized, the compositor
   *  will respond by emitting a configure event without the "maximized"
   *  state. If available, the compositor will include the window geometry
   *  dimensions the window had prior to being maximized in the configure
   *  event. The client must then update its content, drawing it in a
   *  regular state, i.e. potentially with shadow, etc. The client must also
   *  acknowledge the configure when committing the new content (see
   *  ack_configure).
   *
   *  It is up to the compositor to position the surface after it was
   *  unmaximized; usually the position the surface had before maximizing, if
   *  applicable.
   *
   *  If the surface was already not maximized, the compositor will still
   *  emit a configure event without the "maximized" state.
   *
   *  If the surface is in a fullscreen state, this request has no direct
   *  effect. It will alter the state the surface is returned to when
   *  unmaximized if not overridden by the compositor.
   *
   *
   * @param {XdgToplevelResource} resource
   *
   * @since 1
   * @override
   */
  unsetMaximized (resource) {
    if (this._configureState.state.includes(resizing)) {
      return
    }

    if (this._configureState.state.includes(fullscreen) && this._previousGeometry) {
      this._unfullscreenConfigureState = {
        state: [activated],
        width: this._previousGeometry.width,
        height: this._previousGeometry.height
      }
    } else if (this._configureState.state.includes(maximized) && this._previousGeometry) {
      this._emitConfigure(resource, this._previousGeometry.width, this._previousGeometry.height, [activated], none)
    } else {
      this._emitConfigure(resource, 0, 0, [activated], none)
    }
  }

  /**
   *
   *  Make the surface fullscreen.
   *
   *  After requesting that the surface should be fullscreened, the
   *  compositor will respond by emitting a configure event with the
   *  "fullscreen" state and the fullscreen window geometry. The client must
   *  also acknowledge the configure when committing the new content (see
   *  ack_configure).
   *
   *  The output passed by the request indicates the client's preference as
   *  to which display it should be set fullscreen on. If this value is NULL,
   *  it's up to the compositor to choose which display will be used to map
   *  this surface.
   *
   *  If the surface doesn't cover the whole output, the compositor will
   *  position the surface in the center of the output and compensate with
   *  with border fill covering the rest of the output. The content of the
   *  border fill is undefined, but should be assumed to be in some way that
   *  attempts to blend into the surrounding area (e.g. solid black).
   *
   *  If the fullscreened surface is not opaque, the compositor must make
   *  sure that other screen content not part of the same surface tree (made
   *  up of subsurfaces, popups or similarly coupled surfaces) are not
   *  visible below the fullscreened surface.
   *
   *
   * @param {XdgToplevelResource} resource
   * @param {?WlOutput} output undefined
   *
   * @since 1
   * @override
   */
  setFullscreen (resource, output) {
    this._emitConfigure(resource, window.innerWidth, window.innerHeight, [fullscreen, activated], none)
  }

  /**
   *
   *  Make the surface no longer fullscreen.
   *
   *  After requesting that the surface should be unfullscreened, the
   *  compositor will respond by emitting a configure event without the
   *  "fullscreen" state.
   *
   *  Making a surface unfullscreen sets states for the surface based on the following:
   *  * the state(s) it may have had before becoming fullscreen
   *  * any state(s) decided by the compositor
   *  * any state(s) requested by the client while the surface was fullscreen
   *
   *  The compositor may include the previous window geometry dimensions in
   *  the configure event, if applicable.
   *
   *  The client must also acknowledge the configure when committing the new
   *  content (see ack_configure).
   *
   *
   * @param {XdgToplevelResource} resource
   *
   * @since 1
   * @override
   */
  unsetFullscreen (resource) {
    if (this._configureState.state.includes(fullscreen)) {
      if (this._unfullscreenConfigureState) {
        this._emitConfigure(resource, this._unfullscreenConfigureState.width, this._unfullscreenConfigureState.height, this._unfullscreenConfigureState.state, none)
      } else if (this._previousGeometry) {
        this._emitConfigure(resource, this._previousGeometry.width, this._previousGeometry.height, [activated], none)
      } else {
        this._emitConfigure(resource, 0, 0, [activated], none)
      }
    }
  }

  /**
   *
   *  Request that the compositor minimize your surface. There is no
   *  way to know if the surface is currently minimized, nor is there
   *  any way to unset minimization on this surface.
   *
   *  If you are looking to throttle redrawing when minimized, please
   *  instead use the wl_surface.frame event for this, as this will
   *  also work with live previews on windows in Alt-Tab, Expose or
   *  similar compositor features.
   *
   *
   * @param {XdgToplevelResource} resource
   *
   * @since 1
   * @override
   */
  setMinimized (resource) {
    this.userShellSurface.minimize()
  }
}
