# Application End-Point Server

Prerequisites:

* The Greenfield application end-point depends on the native-endpoint module of [Westfield](https://github.com/udevbe/westfield) so make sure you have the required Westfield native-endpoint dependencies installed.

  ```bash
  sudo apt-get install -y libffi-dev libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev
  ```

  ```bash
  sudo npm install -g cmake-js
  ```

  At runtime, the endpoint will need gstreamer-1.x with the following plugins:

  * appsrc
  * glupload
  * glcolorconvert
  * glcolorscale
  * tee
  * glshader
  * gldownload
  * x264enc
  * pngenc
  * appsink

Get the sources:

```bash
  git clone https://github.com/udevbe/greenfield.git
```

Inside the `app-endpoint-server` directory run

```bash
  npm install
```

To start the end-point server

```bash
  npm start
```

For nicer logging output, set the environment variable

```bash
  export DEBUG=1
```

The endpoint server will lazily create a new child process for each new connected browser compositor instance. The Greenfield compositor will initiate a new websocket connection for each individual remote application it wants to launch.

## Configuration

Configuration can be found in `app-endpoint-server/config.json5`

```text
{
  serverConfig: {
    httpServer: {
      // The schema to use when connecting to this endpoint. This is required to inform other endpoints when doing direct
      // endpoint to endpoint copy-paste transfers. Valid values are 'ws:' or 'wss:'.
      protocol: 'ws:',
      // Hostname argument, see https://nodejs.org/api/net.html#net_server_listen_port_host_backlog_callback for details
      hostname: 'localhost',
      // Port argument, see https://nodejs.org/api/net.html#net_server_listen_port_host_backlog_callback for details
      port: 8081,
      // Timeout argument, see https://nodejs.org/api/http.html#http_server_timeout for details
      timeout: 2000,
    }
  },
  sessionConfig: {
    // Time to wait in milli seconds before destroying this session when no more native clients are running.
    destroyTimeout: 60000,
    webSocketServer: {
      // Options argument, see https://github.com/websockets/ws/blob/master/doc/ws.md#class-websocket for details.
      options: {
        // 'noServer: true' is mandatory.
        noServer: true,
      },
    },
    encoder: {
      // The gstreamer h264 encoder to use. For now only 'x264' is supported. 'x264' is a pure software encoder.
      // Future versions will support 'vaapih264enc' which is a hw accelerated encoder.
      h264Encoder: 'x264',
      // Maximum number of pixels an image can have before we switch to h264 encoding. If lower, png encoding is used.
      // Png encoding has perfect image quality but has a far larger image size than h264.
      // default is (256*256)-1 = 0xFFFF
      maxPngBufferSize: 0xFFFF,
    },
    // List of apps that can be started by this application-endpoint, based on the 'id' send from the browser.
    // The 'id' attribute of a remote application link file is matched with a key value in 'apps'.
    apps: {
      'remote-gtk3-demo': {
        // The full path of the executable binary. Can also be a symlink.
        bin: "/usr/bin/gtk3-demo",
        // Arguments passed to the binary
        args: [],
      }
    }
  }
}
```

