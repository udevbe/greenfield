export type ServerConfig = {
  protocol: 'ws:' | 'wss:'
  hostname: string
  port: number
  timeout: number
}

export const serverConfig: ServerConfig = {
  // The schema to use when connecting to this endpoint. This is required to
  // inform other endpoints when doing direct
  // endpoint to endpoint transfers. Valid values are 'ws:' or 'wss:'.
  protocol: 'ws:',
  // Hostname argument.
  hostname: '0.0.0.0',
  // Port argument.
  port: 8081,
  // Timeout argument
  timeout: 12000,
} as const

export type SessionConfig = {
  xWayland: boolean
  encoder: {
    h264Encoder: 'x264' | 'nvh264'
    maxPngBufferSize: number
  }
}

export const sessionConfig: SessionConfig = {
  // Indicates if we should launch an XWayland server to support legacy X11 applications.
  xWayland: true,
  encoder: {
    // The gstreamer h264 encoder to use. For now only 'x264' or 'nvh264' is supported. 'x264'
    // is a pure software encoder. While 'nvh264' is a hw accelerated encoder for Nvidia based GPUs.
    // see https://gstreamer.freedesktop.org/documentation/x264/index.html
    // see https://gstreamer.freedesktop.org/documentation/nvenc/nvh264enc.html
    h264Encoder: 'x264',
    // Maximum number of pixels an image can have before we switch to h264 encoding.
    // If lower, png encoding is used.
    // Png encoding has perfect image quality but has a far larger image size than
    // h264. Default is (256*256)-1 = 0xFFFF
    maxPngBufferSize: 0xffff,
  },
} as const
