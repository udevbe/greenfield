import { Point } from '../math/Point'

let cursor: BrowserCursor | undefined
let spriteURL: string | undefined

type BrowserCursor = {
  image: ImageBitmap
  imageBlob: Blob
  hotspot: Point
}

function updateBrowserCursor() {
  if (cursor) {
    if (spriteURL) {
      URL.revokeObjectURL(spriteURL)
      spriteURL = undefined
    }
    spriteURL = URL.createObjectURL(cursor.imageBlob)
    document.body.style.cursor = `url('${spriteURL}') ${cursor.hotspot.x} ${cursor.hotspot.y}, auto`
  } else {
    if (spriteURL) {
      URL.revokeObjectURL(spriteURL)
      spriteURL = undefined
    }
    document.body.style.cursor = 'none'
  }
}

export function setBrowserCursor(image: ImageBitmap, imageBlob: Blob, hotspot: Point): void {
  cursor = {
    image,
    imageBlob,
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

// export function setCursor(cursorType: CursorType): void {
//   if (cursor?.cursorIconURL) {
//     URL.revokeObjectURL(cursor.cursorIconURL)
//   }
//   document.body.style.cursor = cursorType
// }
