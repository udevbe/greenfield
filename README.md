# Greenfield

### The in-browser wayland compositor [![Build Status](https://travis-ci.org/udevbe/greenfield.svg)](https://travis-ci.org/udevbe/greenfield)

Live demo: https://greenfield-preview.web.app/

Greenfield is a [Wayland compositor](https://en.wikipedia.org/wiki/Wayland_%28display_server_protocol%29) written
entirely in TypeScript while utilizing WebAssembly and WebGL for the performance critical parts. It can run native
Wayland applications remotely, or it can run Wayland web applications directly in your browser.

For more information, have a look on the [website](https://greenfield.app).

### Modular Compositor

Greenfield consists of 3 separate parts.

- [Westfield](https://github.com/udevbe/westfield) A Wayland protocols implementation in TypeScript.
- [Greenfield Compositor Module](https://github.com/udevbe/greenfield) A bare-bones Wayland compositor library.
- [Greenfield Web Shell](https://github.com/udevbe/greenfield-webshell) An extensive demo implementation of the Greenfield
  Compositor Module (outdated).

# Running locally

The Greenfield Compositor Module comes with a very simple demo compositor implementation that you can use. Inside `compositor-module` directory run.
- `yarn install`
- `yarn demo`

Go to [http://localhost:8080]() and be greeted with a nice white compositor with 2 buttons. Each button click creates a new WebSocket connection to a remote compositor-proxy as indicated
by the text on the button. 

Next we need to run a compositor-proxy that will act as a bridge between the native world and the browser. Running a compositor-proxy is a bit more complicated as it requires a set of environment variables to work properly. 
Running the compositor-proxy locally can also be done using docker-compose (see `docker-compose.yml` in the `compositor-proxy` directory), but you will be limited to the applications specified in the docker-compose file.

To run locally without docker, we will need the following environment variables:
- `COMPOSITOR_SESSION_ID=test123` This has to match the compositor session id of the Greenfield browser compositor.
  This is a security measure so other Greenfield browser compositors can't simply connect to your compositor-proxy. To work with the demo compositor that we started earlier, you can simply use the value stated here (`test123`)
- `GST_GL_WINDOW=gbm` This is a GStreamer variable that we can set. More info [here](https://gstreamer.freedesktop.org/documentation/gl/gstgldisplay.html?gi-language=c)

The above is already specified in the demo `package.json` script. Now all that is left, is to generate some code and set up the native parts of the compositor-proxy.

Inside `compository-proxy`, run:
- `yarn install`
- `yarn generate`
- `yarn build:native`
- `cp dist/encoding/app-endpoint-encoding.node src/encoding/app-endpoint-encoding.node`

and finally
- `yarn demo`

You should now see something that says `Compositor proxy started. Listening on port 8081`. You can also adjust some things
in `src/config.yaml`.

In our browser compositor we can click the first button to make a connection to the compositor-proxy. You should see a
message appear in the log output of the compositor-proxy that we started earlier: `New websocket connected.`.

You now have a Wayland compositor running on your system, so let's start some applications. Most recent GTK3 applications (like gnome-terminal) should
auto-detect the compositor-proxy and simply connect without issues or extra setup. QT applications often require an extra `-platform wayland` parameter.
If your application can't connect, try setting the `WAYLAND_DISPLAY` environment variable to the value that was printed by compositor-proxy. ie if you see `Listening on: WAYLAND_DISPLAY=\"wayland-0\".`
then set the environment variable `export WAYLAND_DISPLAY=wayland-0`.

# Docker

The compositor-proxy is available as a Docker image `docker.io/udevbe/compositor-proxy` but does not include any `config.yaml`. This means you'll
have to include it yourself using a mount. An example docker-compose file is also available.

# High level technical

### Compositor-Proxy

A Greenfield browser compositor uses a native compositor-proxy running on Node.js to talk to native applications. 
This proxy compositor accepts native Wayland client connections and assigns them to a WebSocket connection as soon as 
one becomes available. A native client and it's WebSocket connection are bound to each other until either one is closed.

A compositor-proxy proxy can request additional WebSocket connections from an already connected Greenfield browser compositor.
This is needed in case a Wayland client spawns a new Wayland client process. If no WebSocket connections already exists, 
the compositor-proxy will wait until a new WebSocket connection is becomes available. In other words, the first WebSocket connection
is always initiated from the browser.

Each application's content is encoded to H264 video frames using GStreamer and send to the browser for decoding. In the browser the applications is realised by a WebGL texture inside a HTML5 canvas.
This canvas is basically what you would commonly call a 'workspace'. The browser compositor is implemented asynchronous, meaning one heavy client will not block the processing of another client.

### Copy-Paste

Copy-paste is implemented using a direct transfer between compositor-proxies if 2 clients are connected to separate compositor-proxy.
This avoids the round trip and massive overhead of transferring all content to the browser and back. How this works is illustrated in the image below:

[<img src="https://docs.google.com/drawings/d/e/2PACX-1vQfr7I8GaalOzmOAwAOFYK8bzdeQna82JwxesDvD22_kj5BgSIKM16JKk-E2G-nPt5Ssgrhyi9kO9ZV/pub?w=1056&h=620" />](https://docs.google.com/drawings/d/e/2PACX-1vQfr7I8GaalOzmOAwAOFYK8bzdeQna82JwxesDvD22_kj5BgSIKM16JKk-E2G-nPt5Ssgrhyi9kO9ZV/pub?w=1056&h=620)

# XWayland

Very much alpha. Still work in progress. Expect something to show up on screen. Don't expect it to work very well.

## Misc
- [Demo Webshell repository](https://github.com/udevbe/webshell)

# Media

Fosdem presentation + demo (2 Feb 2019):

[![Fosdem presentation + demo](https://img.youtube.com/vi/QjJDH7QtlXk/0.jpg)](https://www.youtube.com/watch?v=QjJDH7QtlXk)

Early tech preview demo (23 Nov 2017):

[![Early tech preview demo](https://img.youtube.com/vi/2lyihdFK7EE/0.jpg)](https://www.youtube.com/watch?v=2lyihdFK7EE)
