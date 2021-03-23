// Copyright 2020 Erik De Rijcke
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

import Output from '../Output'
import Session from '../Session'
import Scene from './Scene'

export default class Renderer {
  scenes: { [key: string]: Scene }
  session: Session

  static create(session: Session): Renderer {
    return new Renderer(session)
  }

  private constructor(session: Session) {
    this.scenes = {}
    this.session = session
  }

  initScene(sceneId: string, canvas: HTMLCanvasElement): Promise<void> {
    let scene = this.scenes[sceneId] || null
    if (!scene) {
      const gl = canvas.getContext('webgl', {
        antialias: false,
        depth: false,
        alpha: true,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        desynchronized: true,
      })
      if (!gl) {
        throw new Error("This browser doesn't support WebGL!")
      }
      // TODO sync output properties with scene
      // TODO notify client on which output their surfaces are being displayed
      const output = Output.create(canvas)
      scene = Scene.create(this.session, gl, canvas, output, sceneId)
      this.scenes = { ...this.scenes, [sceneId]: scene }
      this.session.globals.registerOutput(output)
      scene.onDestroy().then(() => {
        delete this.scenes[sceneId]
        this.session.globals.unregisterOutput(output)
      })
    }
    return scene.render()
  }
}
