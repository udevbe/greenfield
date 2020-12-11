let cursorIconURL: string | undefined

export function setCursorImage(cursorImageBlob: Blob, hotspotX: number, hotspotY: number) {
  if (cursorIconURL) {
    URL.revokeObjectURL(cursorIconURL)
  }
  cursorIconURL = URL.createObjectURL(cursorImageBlob)
  document.body.style.cursor = `url('${cursorIconURL}') ${hotspotX} ${hotspotY}, auto`
}

export function resetCursorImage() {
  setCursor('unset')
}

export type CursorType = 'default'
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

export function setCursor(cursorType: CursorType) {
  if (cursorIconURL) {
    URL.revokeObjectURL(cursorIconURL)
  }
  document.body.style.cursor = cursorType
}

