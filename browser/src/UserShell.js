/**
 * Implementations are expected to extend this class.
 */
export default class UserShell {
  /**
   * Ask the user shell to start managing the given surface.
   * @param {BrowserSurface}browserSurface
   * @return {UserShellSurface}
   */
  manage (browserSurface) {}
}
