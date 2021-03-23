export const hasTouch = 'ontouchstart' in document.documentElement
export const userAgent = window.navigator.userAgent

export const orientation = () => {
  const { angle, lock, type, unlock } = window.screen.orientation
  return {
    angle,
    lock,
    type,
    unlock,
  }
}
export const clientWidth = () => window.document.body.clientWidth
export const clientHeight = () => window.document.body.clientHeight
