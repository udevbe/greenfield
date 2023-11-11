export const hasTouch = 'ontouchstart' in document.documentElement
export const userAgent = window.navigator.userAgent

export const orientation = () => {
  const { angle, type, unlock } = window.screen.orientation
  return {
    angle,
    type,
    unlock,
  }
}
export const clientWidth = () => window.document.body.clientWidth
export const clientHeight = () => window.document.body.clientHeight
