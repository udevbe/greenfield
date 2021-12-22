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

import {
  clearBrowserDndImage,
  resetBrowserCursor,
  setBrowserCursor,
  setBrowserDndImage,
  hideBrowserCursor,
} from '../browser/pointer'
import BufferImplementation from '../BufferImplementation'
import { ButtonEvent } from '../ButtonEvent'
import Callback from '../Callback'
import { queueCancellableMicrotask } from '../Loop'
import { Point } from '../math/Point'
import Output from '../Output'
import { isDecodedFrame } from '../remotestreaming/DecodedFrame'
import Session from '../Session'
import Surface from '../Surface'
import View from '../View'
import { Scene } from './Scene'

function createRenderFrame(): Promise<number> {
  return new Promise<number>((resolve) => {
    requestAnimationFrame(resolve)
  })
}

export default class Renderer {
  private renderFrame?: Promise<void>
  private renderTaskRegistration?: () => void

  private constructor(
    public readonly session: Session,
    public scenes: { [key: string]: Scene } = {},
    public topLevelViews: View[] = [],
    private frameCallbacks: Callback[] = [],
    private viewStack: View[] = [],
  ) {}

  static create(session: Session): Renderer {
    return new Renderer(session)
  }

  initScene(sceneId: string, canvas: HTMLCanvasElement): void {
    let scene = this.scenes[sceneId] || null
    if (!scene) {
      const gl = canvas.getContext('webgl', {
        antialias: false,
        depth: false,
        alpha: true,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        desynchronized: true,
        powerPreference: 'high-performance',
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
    this.render()
  }

  updateCursor(view: View, hotspot: Point): void {
    if (view.surface.state.bufferContents) {
      const cursorBufferContents = view.surface.state.bufferContents

      const cursorImage = cursorBufferContents.pixelContent as { bitmap: ImageBitmap; blob: Blob } | undefined
      if (cursorImage === undefined) {
        return
      }

      setBrowserCursor(cursorImage.bitmap, cursorImage.blob, hotspot)
    } else {
      this.hideCursor()
    }
    view.surface.state.frameCallbacks.forEach((callback) => callback.done(Date.now()))
    view.surface.state.frameCallbacks = []
    this.session.flush()
  }

  raiseSurface(surface: Surface): void {
    const raisedViews = this.topLevelViews.filter((topLevelView) => topLevelView.surface === surface)
    const rest = this.topLevelViews.filter((topLevelView) => topLevelView.surface !== surface)
    this.topLevelViews = [...rest, ...raisedViews]
  }

  render(afterUpdatePixelContent?: () => void): void {
    if (this.renderTaskRegistration) {
      return
    }
    this.renderTaskRegistration = queueCancellableMicrotask(() => {
      this.renderTaskRegistration = undefined
      const sceneList = Object.values(this.scenes)
      if (sceneList.length === 0) {
        return
      }
      this.updateViewStack()
      this.viewStack.forEach((view) => {
        this.updateRenderStatesPixelContent(view)
        this.registerFrameCallbacks(view.surface.state.frameCallbacks)
        view.surface.state.frameCallbacks = []
      })
      afterUpdatePixelContent?.()
      // TODO we can check which views are damaged and filter out only those scenes that need a re-render
      if (this.renderFrame) {
        return
      }
      this.renderFrame = createRenderFrame().then((time) => {
        this.renderFrame = undefined
        // TODO we can further limit the visible region of each view by removing the area covered by other views
        sceneList.forEach((scene) => scene.render([...this.viewStack]))
        this.frameCallbacks.forEach((callback) => callback.done(time))
        this.frameCallbacks = []
        this.session.flush()
      })
    })
  }

  pickView(scenePoint: Point): View | undefined {
    // test views from front to back
    return [...this.viewStack].reverse().find((view) => {
      const surfacePoint = view.sceneToViewSpace(scenePoint)
      return view.surface.isWithinInputRegion(surfacePoint)
    })
  }

  hideCursor(): void {
    hideBrowserCursor()
  }

  resetCursor(): void {
    resetBrowserCursor()
  }

  clearDndImage(): void {
    clearBrowserDndImage()
  }

  updateDndImage(view: View): void {
    if (view.surface.state.bufferContents) {
      const cursorBufferContents = view.surface.state.bufferContents

      const dndImage = cursorBufferContents.pixelContent as { bitmap: ImageBitmap; blob: Blob } | undefined
      if (dndImage === undefined) {
        return
      }

      setBrowserDndImage(dndImage.bitmap, dndImage.blob, view.positionOffset)
    } else {
      this.clearDndImage()
    }
    view.surface.state.frameCallbacks.forEach((callback) => callback.done(Date.now()))
    view.surface.state.frameCallbacks = []
    this.session.flush()
  }

  removeTopLevelView(topLevelView: View): void {
    this.topLevelViews = this.topLevelViews.filter((view) => view !== topLevelView)
  }

  hasTopLevelView(topLevelView: View): boolean {
    return this.topLevelViews.includes(topLevelView)
  }

  addTopLevelView(topLevelView: View): void {
    this.topLevelViews = [...this.topLevelViews, topLevelView]
    topLevelView.onDestroy().then(() => {
      this.removeTopLevelView(topLevelView)
      this.render()
    })
  }

  clampMouseMove(event: ButtonEvent): { x: number; y: number } {
    return {
      x: Math.min(Math.max(event.x, 0), this.scenes[event.sceneId].canvas.width),
      y: Math.min(Math.max(event.y, 0), this.scenes[event.sceneId].canvas.height),
    }
  }

  /**
   * Update stack of all views of this scene, in-order from bottom to top.
   */
  private updateViewStack(): void {
    const stack: View[] = []
    this.topLevelViews.forEach((topLevelView) => {
      // toplevel surface with a parent will be added automatically by the parent so we filter them out here.
      this.addToViewStack(stack, topLevelView)
    })
    this.viewStack = stack
  }

  private addToViewStack(stack: View[], view: View) {
    view.surface.children.forEach((surfaceChild) => {
      const childViewOrParentView = surfaceChild.surface.role?.view
      if (childViewOrParentView) {
        stack.push(childViewOrParentView)
        if (childViewOrParentView !== view) {
          this.addToViewStack(stack, childViewOrParentView)
        }
      }
    })
  }

  private registerFrameCallbacks(frameCallbacks?: Callback[]): void {
    if (frameCallbacks) {
      this.frameCallbacks = [...this.frameCallbacks, ...frameCallbacks]
    }
  }

  private updateRenderStatesPixelContent(view: View): void {
    view.applyTransformations()
    const { buffer, bufferContents } = view.surface.state
    if (isDecodedFrame(bufferContents)) {
      if (view.mapped && buffer && view.surface.damaged) {
        const bufferImplementation = buffer.implementation as BufferImplementation<any>
        if (!bufferImplementation.released) {
          Object.values(view.renderStates).forEach((renderState) => {
            renderState.scene[bufferContents.mimeType](bufferContents, renderState)
          })
          view.surface.damaged = false
          bufferImplementation.release()
        }
      }
    } else if (buffer !== undefined) {
      throw new Error(`BUG. Unsupported buffer type: ${typeof bufferContents}`)
    }
  }
}
