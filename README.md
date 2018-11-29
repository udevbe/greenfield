# Greenfield :seedling:
in-browser wayland compositor

Uses [Westfield](https://github.com/udevbe/westfield) together with [webrtc](https://webrtc.org/faq/#what-is-webrtc)/[object-rtc](https://ortc.org/) to create an in-browser wayland compositor.

[![Alt text](https://img.youtube.com/vi/2lyihdFK7EE/0.jpg)](https://www.youtube.com/watch?v=2lyihdFK7EE)

Greenfield is different from existing solutions like VNC or RDP in that it does not stream a final server side generated image to a remote.
Instead Greenfield live encodes each individual application to a h264 frame, after which it's send to the browser using a dedicated webrtc datachannel. 
On reception, the h264 frame is decoded using a WASM h264 decoder + WebGL shader. After which the application content
is drawn in it's own HTML5 canvas. As a result, the entire image you see in the browser is actually composed of nothing more than ordinary DOM elements. 

The advantage of this approach is that it retains the entire desktop context which allows for powerful features like 
context aware application positioning & naming, custom task-bars, custom REST api integrations, notifications, css styling, WebRTC VOIP integration and 
much more. All of which can be directly and seamlessly integrated inside the browser.

### Compatible Clients & Toolkits :butterfly:
The core wayland protocol is implemented as well as the *stable* xdg shell protocol. As such it is possible to run applications with a compatible widget toolkit.
Supported toolkits are:
 - GTK+ 3.22.30 (tested)
 - Qt 5.11 (untested)

## Present & Future 
Greenfield is in essence an entire Wayland compositor running in the browser. As such it does not care where and how
client applications run. This has some interesting implications:

- ####Distributed back-end


Native wayland applications can connect to an in-browser compositor by talking to a local application endpoint daemon.
This application endpoint daemon presents itself as a locally running wayland compositor while in reality it forwards
(nearly) all messages between the the actual browser compositor & the native application. The in-browser compositor is 
not limited to handling a single application endpoint. Any number of endpoints can establish a connection. This implies 
that *different wayland application can run on different (physical) hosts*.

The process serving the compositor javascript & html files also functions as the discovery point between application endpoints
and connected browser compositors. It allows for application endpoints and connected browsers to setup a direct WebRTC 
data channel, resulting in no intermediate relaying between a native application & the remote browser.


- ####Web worker :unicorn: :rainbow:


A different (future) variation on distributed applications is to run them using a web worker inside the user's browser. 
All that is required is a javascript/browser widget toolkit that can:
 - render it's content to an ArrayBuffer (as web workers do not have their own DOM), or can render to an off-screen WebGL accelerated canvas.
 - communicating with the compositor using the Wayland protocol.
 
This approach allows for a pure client side application to run inside the browser without the drawbacks of network latency or server load,
while still being able to interact (copy/paste & drag'n drop) with native server-side applications.

Installation :computer:
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

Running :running_man:
=======


`npm start` 