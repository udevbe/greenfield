'use strict'

const WlShellSurfaceRequests = require('./protocol/wayland/WlShellSurfaceRequests')

module.exports = class ShimShellSurface extends WlShellSurfaceRequests {
  static create (grShelSurfaceProxy) {
    return new ShimShellSurface(grShelSurfaceProxy)
  }

  constructor (grShelSurfaceProxy) {
    super()
    this.proxy = grShelSurfaceProxy
  }

  pong (resource, serial) {
    this.proxy.pong()
  }

  move (resource, seat, serial) {
    const grSeatProxy = seat.implementation.proxy
    this.proxy.move(grSeatProxy, serial)
  }

  resize (resource, seat, serial, edges) {
    const grSeatProxy = seat.implementation.proxy
    this.proxy.resize(grSeatProxy, serial, edges)
  }

  setToplevel (resource) {
    this.proxy.setToplevel()
  }

  setTransient (resource, parent, x, y, flags) {
    const grParentProxy = parent.implementation.proxy
    this.proxy.setTransient(grParentProxy, x, y, flags)
  }

  setFullscreen (resource, method, framerate, output) {
    const grOutputProxy = output.implementation.proxy
    this.proxy.setFullscreen(method, framerate, grOutputProxy)
  }

  setPopup (resource, seat, serial, parent, x, y, flags) {
    const grSeatProxy = seat.implementation.proxy
    const grParentProxy = parent.implementation.proxy
    this.proxy.setPopup(grSeatProxy, serial, grParentProxy, x, y, flags)
  }

  setMaximized (resource, output) {
    const grOutputProxy = output.implementation.proxy
    this.proxy.setMaximized(grOutputProxy)
  }

  setTitle (resource, title) {
    this.proxy.setTitle(title)
  }

  setClass (resource, clazz) {
    this.proxy.setClass(clazz)
  }
}
