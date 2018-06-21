'use strict'

import { Global } from 'westfield-runtime-server'
import { GrOutput } from './protocol/greenfield-browser-protocol'

/**
 *
 *            An output describes part of the compositor geometry.  The
 *            compositor works in the 'compositor coordinate system' and an
 *            output corresponds to a rectangular area in that space that is
 *            actually visible.  This typically corresponds to a monitor that
 *            displays part of the compositor space.  This object is published
 *            as global during start up, or when a monitor is hotplugged.
 *
 */
export default class BrowserOutput extends Global {
  static create () {
    return new BrowserOutput()
  }

  /**
   * Use BrowserOutput.create(..) instead.
   * @private
   */
  constructor () {
    super(GrOutput.name, 3)
  }

  /**
   * @param {Client}client
   * @param {number}id
   * @param {number}version
   */
  bindClient (client, id, version) {
    const grOutputResource = new GrOutput(client, id, version)
    grOutputResource.implementation = this
    this.emitSpecs(grOutputResource)
  }

  /**
   * @param {GrOutput}grOutputResource
   */
  emitSpecs (grOutputResource) {
    // TODO we might want to listen for window/document size changes and emit on update
    this._emitGeomtry(grOutputResource)
    this._emitMode(grOutputResource)
    // TODO scaling info using window.devicePixelRatio (+allow manual override in settings)
    if (grOutputResource.version >= 2) {
      grOutputResource.done()
    }
  }

  /**
   * @param {GrOutput}grOutputResource
   */
  _emitMode (grOutputResource) {
    const flags = GrOutput.Mode.current
    const width = Math.ceil(window.innerWidth * window.devicePixelRatio)
    const height = Math.ceil(window.innerHeight * window.devicePixelRatio)
    // the refresh rate is impossible to query without manual measuring, which is error prone.
    const refresh = 60
    grOutputResource.mode(flags, width, height, refresh)
  }

  /**
   * @param {GrOutput}grOutputResource
   */
  _emitGeomtry (grOutputResource) {
    const x = 0
    const y = 0
    // this is really just an approximation as browsers don't offer a way to get the physical width :(
    // A css pixel is roughly 1/96 of an inch, so ~0.2646 mm
    // TODO test this on high dpi devices
    const physicalWidth = Math.ceil(window.innerWidth * 0.2646)
    const physicalHeight = Math.ceil(window.innerHeight * 0.2646)
    const subpixel = GrOutput.Subpixel.unknown
    const make = 'Greenfield'
    const model = window.navigator.userAgent

    const orientation = window.screen.orientation.type
    let transform = GrOutput.Transform.normal

    // TODO this will probably require some experimentation to get it right
    switch (orientation) {
      case 'portrait-primary': {
        transform = GrOutput.Transform.normal
        break
      }
      case 'portrait-secondary': {
        transform = GrOutput.Transform['180']
        break
      }
      case 'landscape-primary': {
        transform = GrOutput.Transform.normal
        break
      }
      case 'landscape-secondary': {
        transform = GrOutput.Transform['180']
        break
      }
    }

    grOutputResource.geometry(x, y, physicalWidth, physicalHeight, subpixel, make, model, transform)
  }

  /**
   *
   *                Using this request a client can tell the server that it is not going to
   *                use the output object anymore.
   *
   *
   * @param {GrOutput} resource
   *
   * @since 3
   *
   */
  release (resource) {
    // TODO
  }
}
