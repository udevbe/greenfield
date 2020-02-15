class RenderFrame {
  /**
   * @return {Promise<void>}
   */
  static create () {
    return new Promise(resolve => requestAnimationFrame(() => resolve()))
  }
}

export default RenderFrame
