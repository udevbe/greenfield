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

  /**
   * Signal the user shell that a keyboard resource is available [for a particular client]. Useful to decide if a
   * surface can be given keyboard input.
   * @param {GrKeyboard}grKeyboard
   */
  keyboardAvailable (grKeyboard) {}
}
