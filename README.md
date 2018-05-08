# greenfield
in-browser wayland compositor

Experiment in using [Westfield](https://github.com/udevbe/westfield) together with [webrtc](https://webrtc.org/faq/#what-is-webrtc)/[object-rtc](https://ortc.org/) to create an in-browser wayland compositor.

[![Alt text](https://img.youtube.com/vi/2lyihdFK7EE/0.jpg)](https://www.youtube.com/watch?v=2lyihdFK7EE)

Greenfield is different from existing solutions like VNC or RDP in that it does not stream a final server side generated image to a remote.
Instead Greenfield live encodes each individual application to a h264 frame, after which it's send to the browser using a dedicated webrtc datachannel. 
On reception, the h264 frame is decoded using a WASM h264 decoder + WebGL shader. After which the application content
is drawn in it's own HTML5 canvas. As a result, the entire image you see in the browser is actually composed of nothing more than ordinary DOM elements. 

The advantage of this approach is that it retains the entire desktop context which allows for powerful features like 
context aware application positioning & naming, custom task-bars, custom REST api integrations, notifications, css styling, WebRTC VOIP integration and 
much more. All of which can be directly and seamlessly integrated inside the browser.

#### Future

Greenfield is in essence an entire Wayland compositor running in the browser. As such it does not care where and how
client applications run. This has some interesting implications as it allows for client applications to run directly in the browser inside a web 
worker. All that is required is a Javascript widget toolkit that can:
 - render it's content to an ArrayBuffer (as web workers do not have their own DOM), or can render to an off-screen WebGL accelerated canvas.
 - communicating with the compositor using the Wayland protocol.
 
This approach allows for a pure client side application to run inside the browser without the drawbacks of network latency or server load,
while still being able to interact (copy/paste & drag'n drop) with native server-side applications.

Installation
============

Clone this repo and inside the cloned directory run:

`npm install`

At runtime you will also need gstreamer-1.x with the following plugins:
- appsrc
- glupload
- glcolorconvert
- glcolorscale
- tee
- glshader
- gldownload
- x264enc
- pngenc
- appsink

Running
=======

Open a browser, preferably Firefox or Chrome.

### Development mode 
- Hot module redeploy support
- Single server process
- Max 1 connection
- Port `8080`
- Ideal for testing and demoing

`npm run start:dev`

### Production mode
 - Optimized and minimized build
 - One parent http server process for incoming connections
 - Separate child process for each accepted connection. (one server side child process per spawned compositor instance)
 - Configurable

`npm start` 

To create a distributable build, run `./build-dist.sh`. This will create a `dist` folder with a `greenfield` executable.
This executable is a self contained node instance with all bundled javascript sources. The native *.node dependencies 
inside the dist folder must be located next to the `greenfield` executable. Gstreamer dependencies are expected to be
present on the system.


### Configuration
A production or development build accepts a config file in json format. The config file can be specified as the first argument to the greenfield
executable.


example_config.json
```json
{
  "http-server": {
    "port": 8080,
    "socket-timeout": 6000,
    "static-dirs": [
      {
        "http-path": "/apps/icons",
        "fs-path": "./app-entries/"
      }
    ]
  },
  "png-encoder": {
    "max-target-buffer-size": 4096
  },
  "desktop-shell": {
    "apps-controller": {
      "app-entries-urls": [
        "file:./app-entries/"
      ]
    }
  }
}
```

key |value
:----|:----
http-server.port|port number (default `8080`)
http-server.socket-timeout| socket connection timeout (default `6000`)
http-server.static-dirs|Array of object with keys `http-path` and `fs-path`, denoting the mapping between the http url and the directory on disk. The primary use case of this property is to expose directories containing application icons.
png-encoder.max-target-buffer-size| Maximum number of pixels before the encoding process will switch from png encoding to h264.
desktop-shell.apps-controller.app-entries-urls| Array of url strings describing where app entry definitions can be found. Accepted `app-entries-url` location protocols are `file`, `http` or `https`.

`./greenfield example_config.json` 

or

`npm start -- example_config.json`

#### Application Entries
Greenfield uses so called application entries to dynamically expose available applications to a connected user. Application entry sources are defined using
the config proprety: `desktop-shell.apps-controller.app-entries-urls`.

Application entries can be queried from an `http`, `https` GET or a single `file` on disk.

`all-entries.json`
```json
[
  {
    "executable": "/path/to/weston-simple-egl",
    "name": "Weston Simple EGL",
    "description": "A spinning rgb triangle",
    "icon": "apps/icons/weston-simple-egl.svg"
  },
  {
    "executable": "/path/to/weston-terminal",
    "name": "Weston Terminal",
    "description": "A minimal terminal emulator",
    "icon": "apps/icons/weston-terminal.svg"
  }
]
```

Alternatively, in case the `file` url points to a directory, individual entries can be specified in a separates files.

key |value
:----|:----
executable|The binary that will be executed once the user clicks this application's icon.
name|The name of the application that will be shown to the user under the application icon
description|The description of the application that will be shown to the user on mouse over.
icon|the relative http path where the application icon can be found


### Compatible Clients
For now only the core wayland protocol is implemented. As such it is only possible to run application that do not require xdg_shell (which rules out gtk for now).
To try some wayland clients, the Weston 1.4 (early version) test clients are nearly all fully supported.
