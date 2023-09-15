/** @description This type carefully mimics a native file descriptor and adds additional information to make it usable in a  remote context. */
export type ProxyFD = {
  /**
   * Format: int32
   * @description The native FD
   * @example 12
   */
  handle: number
  /**
   * @description The file type of the native FD. 'unknown' type means that FD was created by an external application, in which case the 'type' should be manually updated to a more concrete type before doing any operations on the ProxyFD.
   *
   * @enum {string}
   */
  type: 'pipe-read' | 'pipe-write' | 'shm' | 'unknown'
  /**
   * Format: uri
   * @description The url where this ProxyFD originated from and where it can be accessed e.g. for reading or writing.
   * @example https://proxy-endpoint.com:8081
   */
  host: string
}
