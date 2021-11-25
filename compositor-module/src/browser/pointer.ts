import { Point } from '../math/Point'

const cursorCanvas = document.createElement('canvas')
cursorCanvas.style.background = '#00000000'
const cursorCanvasContext = cursorCanvas.getContext('2d', {
  alpha: true,
  desynchronized: true,
})
if (cursorCanvasContext === null) {
  throw new Error('Browser does not support 2d canvas.')
}
cursorCanvas.style.position = 'absolute'
cursorCanvas.style.left = '-256px'
cursorCanvas.style.top = '-256px'
document.body.appendChild(cursorCanvas)

type DndImage = {
  image: ImageBitmap
  imageBlob: Blob
  hotspotOffset: Point
}

type BrowserCursor = {
  image: ImageBitmap
  imageBlob: Blob
  hotspot: Point
}

let cursor: BrowserCursor | undefined
let dndImage: DndImage | undefined
let spriteURL: string | undefined

export function browserDragStarted(event: DragEvent): void {
  if (dndImage && cursorCanvasContext) {
    const dndImagePosition = dndImage.hotspotOffset

    cursorCanvas.width = dndImage.image.width
    cursorCanvas.height = dndImage.image.height
    cursorCanvas.style.width = `${cursorCanvas.width}px`
    cursorCanvas.style.height = `${cursorCanvas.height}px`
    cursorCanvasContext.drawImage(dndImage.image, 0, 0)

    event.dataTransfer?.setDragImage(cursorCanvas, -dndImagePosition.x, -dndImagePosition.y)
  } else {
    event.preventDefault()
  }
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

export function setBrowserDndImage(image: ImageBitmap, imageBlob: Blob, hotspotOffset: Point): void {
  if (dndImage) {
    dndImage.image = image
    dndImage.imageBlob = imageBlob
    dndImage.hotspotOffset = hotspotOffset
  } else {
    dndImage = {
      image,
      imageBlob,
      hotspotOffset,
    }
  }
}

export function clearBrowserDndImage(): void {
  dndImage = undefined
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
