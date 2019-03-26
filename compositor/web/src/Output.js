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

import WlOutputRequests from './protocol/WlOutputRequests'
import WlOutputResource from './protocol/WlOutputResource'

/**
 *
 *            An output describes part of the compositor geometry.  The
 *            compositor works in the 'compositor coordinate system' and an
 *            output corresponds to a rectangular area in that space that is
 *            actually visible.  This typically corresponds to a monitor that
 *            displays part of the compositor space.  This object is published
 *            as global during start up, or when a monitor is hotplugged.
 * @implements WlOutputRequests
 */
export default class Output extends WlOutputRequests {
  /**
   * @return {!Output}
   */
  static create () {
    return new Output()
  }

  /**
   * Use Output.create(..) instead.
   * @private
   */
  constructor () {
    super()
    /**
     * @type {Global}
     * @private
     */
    this._global = null
  }

  /**
   * @param {Registry}registry
   */
  registerGlobal (registry) {
    if (this._global) {
      return
    }
    this._global = registry.createGlobal(this, WlOutputResource.protocolName, 3, (client, id, version) => {
      this.bindClient(client, id, version)
    })
  }

  unregisterGlobal () {
    if (!this._global) {
      return
    }
    this._global.destroy()
    this._global = null
  }

  /**
   * @param {!Client}client
   * @param {!number}id
   * @param {!number}version
   */
  bindClient (client, id, version) {
    const wlOutputResource = new WlOutputResource(client, id, version)
    wlOutputResource.implementation = this
    this.emitSpecs(wlOutputResource)
  }

  /**
   * @param {!WlOutputResource}wlOutputResource
   */
  emitSpecs (wlOutputResource) {
    // TODO we might want to listen for window/document size changes and emit on update
    this._emitGeomtry(wlOutputResource)
    this._emitMode(wlOutputResource)
    // TODO scaling info using window.devicePixelRatio
    // TODO expose pixel scaling in config menu
    if (wlOutputResource.version >= 2) {
      wlOutputResource.done()
    }
  }

  /**
   * @param {!WlOutputResource}wlOutputResource
   */
  _emitMode (wlOutputResource) {
    const flags = WlOutputResource.Mode.current
    const width = Math.ceil(window.innerWidth * window.devicePixelRatio)
    const height = Math.ceil(window.innerHeight * window.devicePixelRatio)
    // the refresh rate is impossible to query without manual measuring, which is error prone.
    const refresh = 60
    wlOutputResource.mode(flags, width, height, refresh)
  }

  /**
   * @param {!WlOutputResource}wlOutputResource
   */
  _emitGeomtry (wlOutputResource) {
    const x = 0
    const y = 0
    // this is really just an approximation as browsers don't offer a way to get the physical width :(
    // A css pixel is roughly 1/96 of an inch, so ~0.2646 mm
    // TODO test this on high dpi devices
    const physicalWidth = Math.ceil(window.innerWidth * 0.2646)
    const physicalHeight = Math.ceil(window.innerHeight * 0.2646)
    const subpixel = WlOutputResource.Subpixel.unknown
    const make = 'Greenfield'
    const model = window.navigator.userAgent

    const orientation = window.screen.orientation.type
    let transform = WlOutputResource.Transform.normal

    // FIXME this requires some experimentation to get it right
    switch (orientation) {
      case 'portrait-primary': {
        transform = WlOutputResource.Transform.normal
        break
      }
      case 'portrait-secondary': {
        transform = WlOutputResource.Transform['180']
        break
      }
      case 'landscape-primary': {
        transform = WlOutputResource.Transform.normal
        break
      }
      case 'landscape-secondary': {
        transform = WlOutputResource.Transform['180']
        break
      }
    }

    wlOutputResource.geometry(x, y, physicalWidth, physicalHeight, subpixel, make, model, transform)
  }

  /**
   *
   *                Using this request a client can tell the server that it is not going to
   *                use the output object anymore.
   *
   *
   * @param {!WlOutputResource} resource
   *
   * @since 3
   *
   */
  release (resource) {
    resource.destroy()
  }
}
