/**
 * The main config type
 */
export interface Configschema {
  /**
   * General server settings
   */
  server: {
    /**
     * Config related to communication over http and websocket
     */
    http: {
      /**
       * The ip address to bind to for websocket and http connections
       */
      bindIP: string
      /**
       * The port to bind to for websocket and http connections
       */
      bindPort: number
      /**
       * The allowed origins during CORS checks.
       */
      allowOrigin: string
    }
  }
  /**
   * Settings for the public endpoint
   */
  public: {
    /**
     * The base ws(s) url to use when connecting to this endpoint. This is also required to inform other endpoints when doing direct endpoint to endpoint transfers.
     */
    baseURL: string
  }
  /**
   * Encoder settings
   */
  encoder: {
    /**
     * Path of the render device that should be used for hardware acceleration. e.g. /dev/dri/renderD128
     *
     */
    renderDevice: string
    /**
     * The gstreamer h264 encoder to use. For now only 'x264' or 'nvh264' is supported. 'x264'
     * is a pure software encoder. While 'nvh264' is a hw accelerated encoder for Nvidia based GPUs.
     * see https://gstreamer.freedesktop.org/documentation/x264/index.html
     * see https://gstreamer.freedesktop.org/documentation/nvenc/nvh264enc.html
     *
     */
    h264Encoder: 'x264' | 'nvh264' | 'vaapih264'
  }
}
