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

import Scene from './Scene'
import Output from '../Output'

export default class Renderer {
  /**
   * @param {Session}session
   * @returns {Renderer}
   */
  static create (session) {
    return new Renderer(session)
  }

  /**
   * Use Renderer.create(..) instead.
   * @param {Session}session
   * @private
   */
  constructor (session) {
    /**
     * @type {Object.<number, Scene>}
     */
    this.scenes = {}
    /**
     * @type {Session}
     */
    this.session = session
  }

  /**
   * @param {string}sceneId
   * @param {HTMLCanvasElement|OffscreenCanvas}canvas
   */
  initScene (sceneId, canvas) {
    let scene = this.scenes[sceneId] || null
    if (!scene) {
      const gl = canvas.getContext('webgl', {
        antialias: false,
        depth: false,
        alpha: false,
        preserveDrawingBuffer: false,
        desynchronized: true
      })
      if (!gl) {
        throw new Error('This browser doesn\'t support WebGL!')
      }
      // TODO sync output properties with scene
      const output = Output.create(canvas)
      scene = Scene.create(this.session, gl, canvas, output)
      this.scenes = { ...this.scenes, [sceneId]: scene }
      this.session.globals.registerOutput(output)
      scene.onDestroy().then(() => {
        this.scenes = this.scenes.filter(otherScene => otherScene !== scene)
        this.session.globals.unregisterOutput(output)
      })
    }
    scene.render()
  }
}
