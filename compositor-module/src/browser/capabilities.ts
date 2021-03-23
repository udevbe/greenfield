export const capabilities = {
  hasTouch: 'ontouchstart' in document.documentElement,
  userAgent: window.navigator.userAgent,
  orientationType: window.screen.orientation.type,
}
