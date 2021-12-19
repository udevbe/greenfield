# Greenfield

### The in-browser wayland compositor [![Build Status](https://travis-ci.org/udevbe/greenfield.svg)](https://travis-ci.org/udevbe/greenfield)

- Website: https://www.greenfield.app/

Greenfield is a [Wayland compositor](https://en.wikipedia.org/wiki/Wayland_%28display_server_protocol%29) written
entirely in TypeScript while utilizing WebAssembly and WebGL for the performance critical parts. It can run native
Wayland applications remotely and display them directly in your browser.

For more information, visit the [website](https://greenfield.app), or have [a look on how it all began]( https://twitter.com/FriedChicken/status/1420671685485867014)

### Modular Compositor

Greenfield consists of 3 separate parts.

- [Westfield](https://github.com/udevbe/westfield) A Wayland protocols implementation in TypeScript.
- [Greenfield Compositor Proxy](https://github.com/udevbe/greenfield/tree/master/compositor-proxy) A Wayland compositor proxy. Forwards the local Wayland applications to the browser.
- [Greenfield Compositor Module](https://github.com/udevbe/greenfield/tree/master/compositor-module) A bare-bones Wayland compositor library for the browser. Receives the forwarded signals of the compositor-proxy. 

# Running

To run, you will need 2 parts to work together. 
- The *Greenfield Compositor Proxy* that runs remotely and forwards the native Wayland applications to the browser.
- An implementation of the *Greenfield Compositor Module* that runs in your browser and receives the forwarded signals of the Greenfield Compositor Proxy.

### Greenfield Compositor Module
The Greenfield Compositor Module comes with a very simple demo implementation that you can use. It's hard coded to connect to a Greenfield Compositor Proxy running on your local system [but can be easily adapted to connect to any URL of your choosing.](https://github.com/udevbe/greenfield/blob/master/compositor-module/demo-compositor/src/index.ts#L34)

Inside `compositor-module` directory run.
- `yarn install`
- `yarn demo`

Go to [http://localhost:8080]() and be greeted with a nice white compositor with 2 buttons. Each button click creates a new WebSocket connection to a Greenfield Compositor Proxy as indicated
by the text on the button. Clicking these buttons won't do much for now as we need to run a Greenfield Compositor Proxy that will act as a bridge between the native world and the browser.

### Greenfield Compositor Proxy

Running a Greenfield Compositor Proxy requires a set of environment variables to work properly.
- `COMPOSITOR_SESSION_ID=test123` This has to match the compositor session id of the Greenfield browser compositor.
  This is a security measure so other Greenfield browser compositors can't simply connect to your compositor-proxy. To work with the demo compositor that we started earlier, you can simply use the value stated here (`test123`)
- `GST_GL_WINDOW=gbm` This is a GStreamer variable that we can set. More info [here](https://gstreamer.freedesktop.org/documentation/gl/gstgldisplay.html?gi-language=c)

For convenience, there is a demo setup that you can use.

Inside `compositor-proxy`, run:
- `yarn install`
- `yarn generate`
- `yarn build:native`
- `cp dist/encoding/app-endpoint-encoding.node src/encoding/app-endpoint-encoding.node`

and finally
- `yarn demo`

You should now see something that says `Compositor proxy started. Listening on port 8081`. You can also adjust some things
in `src/config.yaml`.

In our browser compositor we can now click the first button to make a connection to the Greenfield Compositor Proxy. You should see a
message appear in the log output of the compositor-proxy that we started earlier: `New websocket connected.`.

That's it! You should now have a Wayland compositor running on your system, so let's start some applications. Most recent GTK3 applications (like gnome-terminal) should
auto-detect the compositor-proxy and simply connect without issues or extra setup. QT applications often require an extra `-platform wayland` parameter.
If your application can't connect, try setting the `WAYLAND_DISPLAY` environment variable to the value that was printed by compositor-proxy. ie if you see `Listening on: WAYLAND_DISPLAY=\"wayland-0\".`
then set the environment variable `export WAYLAND_DISPLAY=wayland-0`.

# Docker

Running the Greenfield Compositor Proxy can also be done using docker-compose (see `docker-compose.yml` in the `compositor-proxy` directory), but you will be limited to the applications specified in the docker-compose file. Beware that this docker compose file only provides the Greenfield Compositor Proxy, so you will still need to run a Greenfield Compositor Module implementation yourself.

There is also a short screen-cast, if you're unsure on how to get started:

[![docker-compose greenfield](https://img.youtube.com/vi/SiVfCMqpj3Q/0.jpg)](https://www.youtube.com/watch?v=SiVfCMqpj3Q)

The compositor-proxy is also available as a public docker image `docker.io/udevbe/compositor-proxy` but does not include any `config.yaml`. This means you'll
have to include it yourself using a mount. Have a look at the docker-compose file for inspiration.

# High level technical

### Client connection
A Greenfield browser compositor uses a native compositor-proxy to talk to native applications. 
This proxy compositor accepts native Wayland client connections and assigns them to a WebSocket connection as soon as 
one becomes available. A native client and it's WebSocket connection are bound to each other until either one is closed.

A compositor-proxy proxy can request additional WebSocket connections from an already connected Greenfield browser compositor.
This is needed in case a Wayland client spawns a new Wayland client process. If no WebSocket connections already exists,
the compositor-proxy will wait until a new WebSocket connection is available. In other words, the first WebSocket connection
is always initiated from the browser.

### Client frame encoding, or "can it run games?"
Each application's content is encoded to video frames using GStreamer and send to the browser for decoding. In the browser the application is realised by a WebGL texture inside a HTML5 canvas.
This canvas is basically what you would call an 'output' in Wayland terminology. The browser compositor is asynchronous, meaning a slow client will not block the processing of another client.

How the current pipeline works can be seen here:

[<img src="https://docs.google.com/drawings/d/e/2PACX-1vRNgOGRL1OKXFGNeVYDylp8CFZLl-GsWFyuVaZP9GkLpARsoMyZcA0KzbtL6vCxCuxnINETogW2mgUd/pub?w=1985&h=561" />](https://docs.google.com/drawings/d/e/2PACX-1vRNgOGRL1OKXFGNeVYDylp8CFZLl-GsWFyuVaZP9GkLpARsoMyZcA0KzbtL6vCxCuxnINETogW2mgUd/pub?w=1985&h=561)

This setup has some performance constraints as a lot of parts still use the CPU to do image encoding and decoding. The proxy compositor can't deal with OpenGL texture coming from the client either, meaning
that a client (ie a game) needs to download its entire rendering to RAM before passing it to the proxy-compositor. Another drawback is that we have to work with a dual encoding/decoding solution as the H.264 codec
does not support transparency (alpha).

To fix this, all image processing should be done on the GPU and an image codec that supports alpha (transparency) should be used.

Such a perfect pipeline would look something like this:

[<img src="https://docs.google.com/drawings/d/e/2PACX-1vQ0BpqicB4wNwYKotSK6Hm1lECZ9k5eQYKekFFjXcx4b2yWEhDIim9Hi0Y1Iq1NoFVaZl-kqA6lJdxh/pub?w=1985&h=561" />](https://docs.google.com/drawings/d/e/2PACX-1vQ0BpqicB4wNwYKotSK6Hm1lECZ9k5eQYKekFFjXcx4b2yWEhDIim9Hi0Y1Iq1NoFVaZl-kqA6lJdxh/pub?w=1985&h=561)

Here, all heavy operations are done by the GPU. H.264 has been replaced with H.265 which supports transparency, so we can use a single encoding/decoding step. The compositor-proxy supports the Wayland DRM protocol, so it can pass OpenGL applications
directly to the encoder without making any copies.

There is however one major drawback to this solution: 
the combination of [WebCodecs API](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API) and the H.265 codec simply does not exist in any browser.

This means a more realistic solution should be based on the current pipeline and would look like this:

[<img src="https://docs.google.com/drawings/d/e/2PACX-1vRIPsXAvlTFj-bERKWLeoo5RFWUQHfLyQOymNZ8c-kVEhpsh8GGXYAkudanvpNzycTC3G9xuCPxHX6x/pub?w=1985&h=561" />](https://docs.google.com/drawings/d/e/2PACX-1vRIPsXAvlTFj-bERKWLeoo5RFWUQHfLyQOymNZ8c-kVEhpsh8GGXYAkudanvpNzycTC3G9xuCPxHX6x/pub?w=1985&h=561)

Here we've extended the current solution with support for the Wayland DRM protocol. This allows for a zero-copy transfer of the application pixels to the encoding pipeline. We've also added support
for the H.264 WebCodecs API, which allows us to do decoding on the GPU of the receiving browser client. 

*The end result is a near ideal solution that is expected be fast enough to support gaming.*


### Copy-Paste

If both clients are connected to separate compositor-proxy, copy-paste will use a direct peer to peer transfer between compositor-proxies.
This avoids the round trip and massive overhead of transferring all content to the browser and back. How this works is illustrated in the image below:

[<img src="https://docs.google.com/drawings/d/e/2PACX-1vQfr7I8GaalOzmOAwAOFYK8bzdeQna82JwxesDvD22_kj5BgSIKM16JKk-E2G-nPt5Ssgrhyi9kO9ZV/pub?w=1056&h=620" />](https://docs.google.com/drawings/d/e/2PACX-1vQfr7I8GaalOzmOAwAOFYK8bzdeQna82JwxesDvD22_kj5BgSIKM16JKk-E2G-nPt5Ssgrhyi9kO9ZV/pub?w=1056&h=620)

# XWayland

Very much beta. Still work in progress. Most things are implemented except for copy/paste and fullscreen applications. Please report any bugs you find.

## Misc
- [Demo Webshell repository](https://github.com/udevbe/webshell)

# Media

Fosdem presentation + demo (2 Feb 2019):

[![Fosdem presentation + demo](https://img.youtube.com/vi/QjJDH7QtlXk/0.jpg)](https://www.youtube.com/watch?v=QjJDH7QtlXk)

Early tech preview demo (23 Nov 2017):

[![Early tech preview demo](https://img.youtube.com/vi/2lyihdFK7EE/0.jpg)](https://www.youtube.com/watch?v=2lyihdFK7EE)
