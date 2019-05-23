# Greenfield
### The in-browser wayland compositor

Greenfield remote applications are different from existing solutions like VNC or RDP as Greenfield does not stream the
entire desktop screen to your browser. Instead Greenfield live encodes each individual application to an h264 stream which is 
send to the browser using a dedicated websocket connection. On reception, the h264 stream is decoded and drawn directly 
into it's own HTML5 canvas. As a result, the screen you see in the browser is actually composed of nothing more than 
ordinary browser DOM elements. 

The advantage of this approach is that it retains the entire desktop context which allows for powerful features like 
context aware application positioning & naming, custom task-bars, custom REST api integrations, notifications, css 
styling, WebRTC VOIP integration and much more. All of which can be directly and seamlessly integrated inside the browser.

## Applications

Because Greenfield is in essence an entire Wayland compositor running in the browser, it does not care where and how
client applications run. This has some interesting implications:

### Remote Applications

Native wayland applications can connect to the in-browser compositor by talking to a local application endpoint server.
This application endpoint server presents itself as a locally running native wayland compositor while in reality it relays
(nearly) all messages between the browser compositor & the native application. The in-browser compositor is 
not limited to handling a single application endpoint. Any number of endpoints can establish a connection. As a 
consequence **different wayland applications can run on different physical hosts while being connected to the same compositor.**

The in-browser compositor and the local application endpoint server use a direct websocket connection per native application. 
As such there is no delaying or interfering intermediate party involved. This is made possible by the fact that websocket 
connections are not bound to the same origin policy, unlike ordinary http connections.

The core Wayland protocol is implemented as well as the *stable* XDG shell protocol. As such it is possible to run 
Wayland applications with a compatible widget toolkit.

Supported toolkits are:
 - GTK+ 3.22.30 or later (tested)
 - Qt 5.11 or later (untested)
 - Any toolkit that supports Wayland using XDG shell protocol.


### Web Applications

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
- simple-web-shm. Based on weston-simple-shm. Draws psychedelic circles. Uses array buffers as shared memory between 
the compositor and the client. Supported on Firefox and Chrome.
- simple-web-gl. Draws a rotating square. Uses offscreen WebGL and streams it's updates to the compositor using HTML5 
ImageBitmaps. Only supported on Chrome.