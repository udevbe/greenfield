# Remote Applications

Greenfield remote applications are different from existing solutions like VNC or RDP as Greenfield does not stream the
entire desktop screen to your browser. Instead Greenfield live encodes each individual application to an h264 stream which is 
send to the browser using a dedicated websocket connection. On reception, the h264 stream is decoded and drawn directly 
into it's own HTML5 canvas. As a result, the screen you see in the browser is actually composed of nothing more than 
ordinary browser DOM elements.

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