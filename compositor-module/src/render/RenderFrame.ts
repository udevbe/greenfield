class RenderFrame {
  static create (): Promise<void> {
    return new Promise(resolve => requestAnimationFrame(() => resolve()))
  }
}

export default RenderFrame
