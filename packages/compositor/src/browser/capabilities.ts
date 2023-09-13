let orientationType

if (window.screen.orientation) {
  orientationType = window.screen.orientation.type
} else {
  // Safari doesn't undestand window.screen.orientation, for now hardcode this
  // TODO: fix this so ipad's can properly work
  orientationType = 'landscape-primary'
}

export const capabilities = {
  hasTouch: 'ontouchstart' in document.documentElement,
  userAgent: window.navigator.userAgent,
  // Safari doesn't undestand window.screen.orientation, for now hardcode this
  // TODO: fix this so ipad's can properly work
  orientationType: window.screen.orientation ? window.screen.orientation.type : 'landscape-primary',
} as const
