class RenderFrame {
  static create () {
    return new Promise(resolve => window.requestAnimationFrame(() => resolve(Date.now())))
  }
}

export default RenderFrame
