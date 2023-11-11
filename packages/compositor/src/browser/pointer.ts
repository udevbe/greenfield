import { Point } from '../math/Point'

let cursor: BrowserCursor | undefined
const cursorCanvasCtx = document.createElement('canvas').getContext('2d')
if (cursorCanvasCtx === null) {
  throw new Error('Cant create cursor canvas')
}

type BrowserCursor = {
  dataURL: string
  hotspot: Point
}

function updateBrowserCursor() {
  if (cursor) {
    document.body.style.cursor = `url('${cursor.dataURL}') ${cursor.hotspot.x} ${cursor.hotspot.y}, auto`
  } else {
    document.body.style.cursor = 'none'
  }
}

export function setBrowserCursor(image: ImageBitmap, hotspot: Point): void {
  if (cursorCanvasCtx === null) {
    throw new Error('Cant use cursor canvas')
  }
  cursorCanvasCtx.canvas.width = image.width
  cursorCanvasCtx.canvas.height = image.height
  cursorCanvasCtx.drawImage(image, 0, 0)
  const dataURL = cursorCanvasCtx.canvas.toDataURL()

  cursor = {
    dataURL,
    hotspot,
  }
  updateBrowserCursor()
}

export function resetBrowserCursor(): void {
  hideBrowserCursor()
  document.body.style.cursor = 'unset'
}

export function hideBrowserCursor(): void {
  cursor = undefined
  updateBrowserCursor()
}

export type CursorType =
  | 'default'
  | 'unset'
  | 'inherit'
  | 'none'
  | 'context-menu'
  | 'help'
  | 'pointer'
  | 'progress'
  | 'wait'
  | 'cell'
  | 'crosshair'
  | 'text'
  | 'vertical-text'
  | 'alias'
  | 'copy'
  | 'move'
  | 'no-drop'
  | 'not-allowed'
  | 'all_scroll'
  | 'col-resize'
  | 'row-resize'
  | 'n-resize'
  | 'e-resize'
  | 's-resize'
  | 'w-resize'
  | 'ne-resize'
  | 'nw-resize'
  | 'se-resize'
  | 'sw-resize'
  | 'ew-resize'
  | 'ns-resize'
  | 'nesw-resize'
  | 'nwse-resize'
  | 'zoom-in'
  | 'zoom-out'
  | 'grab'
  | 'grabbing'
  | 'all-scroll'

export function setCursor(cursorType: CursorType): void {
  document.body.style.cursor = cursorType
}
