# Greenfield :seedling:
### The in-browser wayland compositor [![Build Status](https://travis-ci.org/udevbe/greenfield.svg)](https://travis-ci.org/udevbe/greenfield)

Fosdem presentation + demo (2 Feb 2019):

[![Fosdem presentation + demo](https://img.youtube.com/vi/QjJDH7QtlXk/0.jpg)](https://www.youtube.com/watch?v=QjJDH7QtlXk)


Early tech preview demo (23 Nov 2017):

[![Early tech preview demo](https://img.youtube.com/vi/2lyihdFK7EE/0.jpg)](https://www.youtube.com/watch?v=2lyihdFK7EE)

Greenfield is different from existing solutions like VNC or RDP in that it does not stream a final server side generated image to a remote.
Instead Greenfield live encodes each individual application to a h264 frame, after which it's send to the browser using a dedicated webrtc datachannel. 
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

##Applications

Greenfield is in essence an entire Wayland compositor running in the browser. As such it does not care where and how
client applications run. This has some interesting implications:

### Remote Distributed Back-end

Native wayland applications can connect to an in-browser compositor by talking to a local application endpoint daemon.
This application endpoint daemon presents itself as a locally running wayland compositor while in reality it forwards
(nearly) all messages between the the actual browser compositor & the native application. The in-browser compositor is 
not limited to handling a single application endpoint. Any number of endpoints can establish a connection. As a 
consequence **different wayland applications can run on different physical hosts while being connected to the same compositor.**

The process serving the compositor JavaScript & HTML files also functions as the discovery point between application 
endpoints and connected browser compositors. It allows for application endpoints and connected browsers to setup a 
direct connection, resulting in no intermediate relaying between a native application & the remote browser.


### Local Web worker

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

You can check the source code in the repository or try them directly in your browser: 

https://preview.greenfield.app

Installation and running
============

Clone this repo: 

`git clone https://github.com/udevbe/greenfield.git`

### Compositor
  
  Inside the `compositor` directory run 
  
  `npm install`. 
  
  To start the compositor run 
  
  `npm start:dev`. 
  
  Open a browser (Firefox or Chrome) and go to `localhost:8080`.
  
### Application end-point
  
  Prerequisites: 
   - The Greenfield application end-point depends on the native-endpoint module of [Westfield](https://github.com/udevbe/westfield). Make sure you have the required Westfield native-endpoint dependencies installed.
   - `sudo apt-get install -y libffi-dev libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev`
   - `npm install -g cmake-js`
    
  Inside the `app-endpointd` directory run 
  
  `npm install`. 
  
  To start the end-point daemon, first make sure the compositor  is running, then start the endpoint with 
  
  `npm start`. 
  
  For additional debug output, set the environment variable `export DEBUG=1`. 
   
   The endpoint daemon will create new child process for each connected browser tab and will report on 
   wich `WAYLAND_DISPLAY` environment variable a child process is listening. To show something in your browser, first
   make sure the `WAYLAND_DISPLAY` environment variable is set: `export WAYLAND_DISPLAY="wayland-0"`. Next, you can fire
    up a wayland client ie. `gtk3-demo`.

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
