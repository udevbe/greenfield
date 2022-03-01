import BufferContents from '../BufferContents'
import { createButtonEventFromMouseEvent } from '../ButtonEvent'
import { Point } from '../math/Point'
import { Seat } from '../Seat'

type DndImage = {
  readonly image: ImageBitmap
  readonly imageBlob: Blob
  readonly hotspotOffset: Point
}

export interface DnD {
  handlePointerDown(event: PointerEvent): void
  handlePointerUp(event: PointerEvent): void
  onDnDStarted?: () => void
  onDnDEnded?: () => void
}

let dnd: BrowserDnD | undefined
const maxCursorWidth = 256 as const
const maxCursorHeight = 256 as const

export function createDnd(canvas: HTMLCanvasElement, seat: Seat, outputId: string): DnD {
  const cursorCanvas = document.createElement('canvas')
  const cursorCanvasContext = cursorCanvas.getContext('2d', {
    alpha: true,
    desynchronized: true,
  })
  if (cursorCanvasContext === null) {
    throw new Error('Browser does not support 2d canvas.')
  }
  cursorCanvas.style.background = '#00000000'
  cursorCanvas.style.position = 'absolute'
  cursorCanvas.style.left = `-${maxCursorWidth}px`
  cursorCanvas.style.top = `-${maxCursorHeight}px`
  document.body.appendChild(cursorCanvas)

  dnd = new BrowserDnD(cursorCanvas, cursorCanvasContext, seat, canvas, outputId)

  return dnd
}

export function setBrowserDndImage(cursorBufferContents: BufferContents<unknown>, hotspotOffset: Point): void {
  dnd?.setBrowserDndImage(cursorBufferContents, hotspotOffset)
}

export function clearBrowserDndImage(): void {
  dnd?.clearBrowserDndImage()
}

class BrowserDnD implements DnD {
  private pointerId?: number
  private dndImage?: DndImage
  private dndImageDirty = false
  private readonly mouseMoveListener = (ev: MouseEvent) => ev.preventDefault()
  private dragHelper?: HTMLDivElement
  onDnDStarted?: () => void
  onDnDEnded?: () => void

  constructor(
    private readonly cursorCanvas: HTMLCanvasElement,
    private readonly cursorCanvasContext: CanvasRenderingContext2D,
    private readonly seat: Seat,
    private readonly canvas: HTMLCanvasElement,
    private readonly outputId: string,
  ) {}

  setBrowserDndImage(cursorBufferContents: BufferContents<unknown>, hotspotOffset: Point): void {
    const dndCursorImage =
      cursorBufferContents.mimeType === 'image/png'
        ? (cursorBufferContents.pixelContent as { bitmap: ImageBitmap; blob: Blob } | undefined)
        : undefined
    const dndImage: DndImage | undefined = dndCursorImage
      ? {
          image: dndCursorImage.bitmap,
          imageBlob: dndCursorImage.blob,
          hotspotOffset,
        }
      : undefined
    this.dndImage = dndImage
    this.dndImageDirty = true
    const dndImagePosition = hotspotOffset
    if (
      dndImage &&
      cursorBufferContents.size.width <= maxCursorWidth &&
      cursorBufferContents.size.height <= maxCursorHeight
    ) {
      this.cursorCanvas.width = dndImage.image.width
      this.cursorCanvas.height = dndImage.image.height
      this.cursorCanvas.style.left = `${this.cursorCanvas.clientLeft}px`
      this.cursorCanvas.style.right = `${this.cursorCanvas.clientTop}px`
      this.cursorCanvas.style.width = `${this.cursorCanvas.width}px`
      this.cursorCanvas.style.height = `${this.cursorCanvas.height}px`
      this.cursorCanvasContext.drawImage(dndImage.image, 0, 0)
    } else {
      this.cursorCanvas.width = 1
      this.cursorCanvas.height = 1
      this.cursorCanvas.style.left = `1px`
      this.cursorCanvas.style.right = `1px`
      this.cursorCanvas.style.width = `1px`
      this.cursorCanvas.style.height = `1px`
    }

    if (this.dragHelper) {
      return
    }

    this.onDnDStarted?.()

    if (this.pointerId) {
      this.canvas.releasePointerCapture(this.pointerId)
      this.pointerId = undefined
    }

    // FIXME differentiate between setting the dnd image and setting the actual drag data (which we currently don't do)
    const dragHelper = document.createElement('div')
    this.dragHelper = dragHelper
    dragHelper.id = 'dragHelper'
    dragHelper.style.width = `${this.canvas.clientWidth}px`
    dragHelper.style.height = `${this.canvas.clientHeight}px`
    dragHelper.style.position = 'fixed'
    dragHelper.draggable = true
    dragHelper.addEventListener(
      'dragstart',
      (event) => {
        event.dataTransfer?.setDragImage(this.cursorCanvas, -dndImagePosition.x, -dndImagePosition.y)
        this.dndImageDirty = false
      },
      { passive: true },
    )
    dragHelper.addEventListener('dragover', (event) => {
      if (this.dndImageDirty) {
        event.dataTransfer?.setDragImage(this.cursorCanvas, -dndImagePosition.x, -dndImagePosition.y)
        this.dndImageDirty = false
      }
      event.preventDefault()
      this.seat.notifyMotion(
        createButtonEventFromMouseEvent(event, false, this.outputId, this.canvas.width, this.canvas.height),
      )
      this.seat.notifyFrame()
      this.seat.session.flush()
    })
    dragHelper.addEventListener(
      'dragend',
      (ev) => {
        if (this.dragHelper) {
          document.body.removeChild(this.dragHelper)
          this.dragHelper = undefined
        }
        this.canvas.removeEventListener('mousemove', this.mouseMoveListener)
        this.seat.notifyButton(
          createButtonEventFromMouseEvent(ev, true, this.outputId, this.canvas.width, this.canvas.height),
        )
        this.seat.notifyFrame()
        this.seat.session.flush()
        this.onDnDEnded?.()
      },
      { passive: true },
    )
    document.body.prepend(dragHelper)
  }

  clearBrowserDndImage(): void {
    if (this.dndImage) {
      this.dndImage.image.close()
      this.dndImage = undefined
    }
    if (this.dragHelper) {
      document.body.removeChild(this.dragHelper)
      this.dragHelper = undefined
    }
  }

  handlePointerDown(event: PointerEvent) {
    this.pointerId = event.pointerId
    this.canvas.addEventListener('mousemove', this.mouseMoveListener)
  }
  handlePointerUp(event: PointerEvent) {
    this.canvas.removeEventListener('mousemove', this.mouseMoveListener)
  }
}
