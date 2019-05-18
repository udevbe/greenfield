# Greenfield :seedling:
### The in-browser wayland compositor [![Build Status](https://travis-ci.org/udevbe/greenfield.svg)](https://travis-ci.org/udevbe/greenfield)

Fosdem presentation + demo (2 Feb 2019):

[![Fosdem presentation + demo](https://img.youtube.com/vi/QjJDH7QtlXk/0.jpg)](https://www.youtube.com/watch?v=QjJDH7QtlXk)


Early tech preview demo (23 Nov 2017):

[![Early tech preview demo](https://img.youtube.com/vi/2lyihdFK7EE/0.jpg)](https://www.youtube.com/watch?v=2lyihdFK7EE)

Greenfield is different from existing solutions like VNC or RDP in that it does not stream a final server side generated image to a remote.
Instead Greenfield live encodes each individual application to a h264 frame, after which it's send to the browser using a dedicated websocket connection. 
On reception, the h264 frame is decoded using a WASM h264 decoder + WebGL shader. After which the application content
is drawn in it's own HTML5 canvas. As a result, the entire image you see in the browser is actually composed of nothing more than ordinary DOM elements. 

The advantage of this approach is that it retains the entire desktop context which allows for powerful features like 
context aware application positioning & naming, custom task-bars, custom REST api integrations, notifications, css styling, WebRTC VOIP integration and 
much more. All of which can be directly and seamlessly integrated inside the browser.

### Compatible Clients & Toolkits
The core wayland protocol is implemented as well as the *stable* xdg shell protocol. As such it is possible to run applications with a compatible widget toolkit.
Supported toolkits are:
 - GTK+ 3.22.30 (tested)
 - Qt 5.11 (untested)

## Applications

Greenfield is in essence an entire Wayland compositor running in the browser. As such it does not care where and how
client applications run. This has some interesting implications:

### Remote Applications

Native wayland applications can connect to an in-browser compositor by talking to a local application endpoint daemon.
This application endpoint daemon presents itself as a locally running wayland compositor while in reality it forwards
(nearly) all messages between the the actual browser compositor & the native application. The in-browser compositor is 
not limited to handling a single application endpoint. Any number of endpoints can establish a connection. As a 
consequence **different wayland applications can run on different physical hosts while being connected to the same compositor.**

The process serving the compositor JavaScript & HTML files also functions as the discovery point between application 
endpoints and connected browser compositors. It allows for application endpoints and connected browsers to setup a 
direct connection, resulting in no intermediate relaying between a native application & the remote browser.


### Web Applictions

tl;dr Run JavaScript Wayland applications directly in your browser: https://preview.greenfield.app

A different variation on distributed applications is to run them directly inside the user's browser.
This can be done using a Web worker. A Web Worker is essentially a stand-alone thread/process, completely separate from
the main thread. Running applications in a Web Worker isolates client code without impacting the performance of the 
compositor and provides isolation from malicious clients. 

Greenfield supports web applications. There are however some prerequisites.

 - Web applications must be written in JavaScript so they can be loaded as a Web Worker.
 - A Web application must render it's content to an ArrayBuffer as Web Workers do not have access to the DOM and as such can not use HTML to render their content
 - Alternatively web applications can render to an off-screen WebGL accelerated canvas. Unfortunately this is still an experimental HTML5 spec.
 - A Web application must communicate with the compositor using a custom Wayland buffer protocol.
 
A Web application can run directly inside the browser without the drawbacks of network latency or server load, while 
still being able to interop (copy/paste & drag'n drop) with native server-side applications running directly next to it.

There are currently 2 small demo web clients available in the repository that you can check out:
- simple-web-shm. Based on weston-simple-shm. Draws psychedelic cirkels. Uses array buffers as shared memory between 
the compositor and the client. Supported on Firefox and Chrome.
- simple-web-gl. Draws a rotating square. Uses offscreen WebGL and streams it's updates to the compositor using HTML5 
ImageBitmaps. Only supported on Chrome.


Installation and running
============

Clone this repo: 

`git clone https://github.com/udevbe/greenfield.git`

## Compositor
  
  Inside the `compositor` directory run 
  
  `npm install`. 
  
  To start the compositor run 
  
  `npm run start`. 
  
  And wait for the a browser to automatically open a tab to `localhost:8080`.
  
## Application end-point
  
  Prerequisites: 
   - The Greenfield application end-point depends on the native-endpoint module of [Westfield](https://github.com/udevbe/westfield). Make sure you have the required Westfield native-endpoint dependencies installed.
   - `sudo apt-get install -y libffi-dev libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev`
   - `npm install -g cmake-js`
    
  At runtime, the endpoint will need gstreamer-1.x with the following plugins:
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
    
  Inside the `app-endpointd` directory run 
  
  `npm install`. 
  
  To start the end-point server
  
  `npm start`. 
  
  For additional debug output, set the environment variable `export DEBUG=1`. 
   
  The endpoint server will lazily create a new child process for each new connected browser compositor instance.
  
#### Configuration
 
 Configuration can be in `app-endpointd/config.json5`
 
 ```json5
{
  serverConfig: {
    httpServer: {
      // The schema to use when connecting to this endpoint. This is required to inform other endpoints when doing direct
      // endpoint to endpoint transfers. Valid values are 'ws:' or 'wss:'.
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
  
## Launching applications

 Applications are linked to the logged in user. There are currently 3 demo applications available.
  
  - Remote Gtk3 demo: A native remote application, requires the `gtk3-demo` application to be natively available.
  - Simple Web GL: A web application, demonstrating the use of offscreen webgl. Source code available in `demo-web-clients/simple-web-gl`
  - Simple Web SHM: A very simple web application, demonstrates the use of simple cpu based rendering. Source code available in `demo-web-clients/simple-web-shm`
  
  All these applications can be found inside `compositor/public/store`. 
  
  To add an application to your account:
  
  - Click the raster icon in the top right.
  - Click the '+' icon.
  - Click the upload icon (arrow up cloud).
  - Select one of the `link.json` files in `compositor/public/store/*`
  
  You can also create your own application by defining a `link.json` and icon, and additionally an `app.js` in case of web application.
  
  An application link file structure looks like this:
  ```json
  {
    "id": "simple-web-gl",
    "title": "Simple Web GL",
    "icon": "http://localhost:8080/store/simple-web-gl/icon.svg",
    "type": "web",
    "url": "http://localhost:8080/store/simple-web-gl/app.js"
  }
  ```
  
  - `id`: Unique application id. In case of remote application, has to match the application id as specified in `app-endpointd/config.json5`
  - `title`: A meaningful and short description. Is shown to the user on mouse-over.
  - `icon`: An application icon url for the application launcher. Can be a image data url if the icon is not remotely available.
  - `type`: Must be `web` or `remote`.
  - `url`: Where the application can be found. Must be a websocket url pointing to an app-endpointd server in case of `type: "remote"`, 
  or a web url in case of `type: "web"`.

