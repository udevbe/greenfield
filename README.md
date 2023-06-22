# Greenfield

### The in-browser wayland compositor

- Website: https://www.greenfield.app

Greenfield is a [Wayland compositor](https://en.wikipedia.org/wiki/Wayland_%28display_server_protocol%29) written
entirely in TypeScript while utilizing WebAssembly and WebGL for the performance critical parts. It can run native
Wayland applications remotely and display them directly in your browser.

Greenfield running DOOM3 remotely 1920x1080@60FPS (16 Mar 2023):

[![Fosdem presentation + demo](https://img.youtube.com/vi/pTn_hjOwK-Y/0.jpg)](https://www.youtube.com/watch?v=pTn_hjOwK-Y)

For more information, visit the [website](https://greenfield.app), or have [a look on how it all began](https://wayouttheresoftware.blogspot.com/2023/07/some-history-about-greenfield.html)

### Modular Compositor

Greenfield consists of 3 separate parts.

- [Westfield](https://github.com/udevbe/westfield) A Wayland protocols implementation in TypeScript.
- [Greenfield Compositor Proxy](https://github.com/udevbe/greenfield/tree/master/compositor-proxy) A Wayland compositor proxy. Forwards the local Wayland applications to the browser.
- [Greenfield Compositor Module](https://github.com/udevbe/greenfield/tree/master/compositor-module) A bare-bones Wayland compositor library for the browser. Receives the forwarded signals of the compositor-proxy. 

# Running

To run, you will need 2 parts to work together. 
- The *Greenfield Compositor Proxy* that runs remotely and forwards the native Wayland applications to the browser. You need at least one, but can run as many as you require e.g. to access different machines.
- An implementation of the *Greenfield Compositor Module* that runs in your browser and receives the forwarded signals of potential multiple Greenfield Compositor Proxies.

## Greenfield Compositor Module
The Greenfield Compositor Module comes with a simple demo implementation.

In the `compositor-module` directory run
- `yarn install`
- `yarn generate`
- `yarn start`

to start the compositor demo module.

*Note that the compositor-module built uses Open-API to generate client code to talk to the compositor-proxy and requires `java` to be present on your PATH during build.*

Go to [http://localhost:8080]() and be greeted with a nice white compositor. It has 2 URL input fields that can be used. The first input field connects to the provided remote compositor and accepts input in the form of `host:port`. The second input field launches
and runs Wayland applications in an iframe (experimental) and accepts input in the form of `http(s)://host:port/path`.

## Greenfield Compositor Proxy

To build, you need a set of native dependencies. You can look at the [Docker image](https://github.com/udevbe/greenfield/blob/master/compositor-proxy/Dockerfile#L4) to see which ones you need to build and run respectively, or if you're running a Debian based distro you can run:
```
sudo apt install cmake build-essential ninja-build pkg-config libffi-dev libudev-dev libgbm-dev libdrm-dev libegl-dev \ 
 libwayland-dev libglib2.0-dev libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev libgraphene-1.0-dev gstreamer1.0-plugins-base \ 
 gstreamer1.0-plugins-good gstreamer1.0-plugins-ugly gstreamer1.0-gl xwayland
```

More dependencies may be required depending on your GPU eg. for nvidia based cards.

Next, inside `compositor-proxy`, run:
- `yarn install`
- `yarn generate`
- `yarn build:native`
- `cp dist/encoding/proxy-encoding-addon.node src/encoding/proxy-encoding-addon.node`
- `cp dist/proxy-poll-addon.node src/proxy-poll-addon.node`

For XWayland support a few extra steps may be needed, this is optional and only required if you don't already hava an X server running eg. when running on a server:

- `export XAUTHORITY=.Xauthority`
- `touch "$HOME/$XAUTHORITY"`
- `xauth add "${HOST}":1 . "$(xxd -l 16 -p /dev/urandom)"`

and finally
- `yarn start`

> **_NOTE:_**  Firefox needs to be at least at version 113 and `dom.workers.modules.enabled` preference needs to be set to true. To change preferences in Firefox, visit `about:config`.

This will start a development build+run. You should now see something that says `Compositor proxy started. Listening on port 8081`.

In our demo compositor we can now input the url `localhost:8081/gtk4-demo` to launch the application in the Greenfield Compositor Proxy. You should see a
 bunch of message appear in the log output of the compositor-proxy that we started earlier. 

Ofcourse we can also change the application that is started. Typing `yarn start --help` reveals the set of commands that we can use to configure the compositor proxy:

```
Usage
  $ compositor-proxy <options>

Options
  --basic-auth=USER:PASSWORD                      Basic auth credentials to use when securing this proxy.
                                                      Optional.
  --bind-ip=IP                                    The ip or hostname to listen on.
                                                      Optional. Default: "0.0.0.0".
  --bind-port=PORT                                The port to listen on. 
                                                      Optional. Default "8081".
  --allow-origin=ORIGIN                           CORS allowed origins, used when doing cross-origin requests. Value can be comma seperated domains. 
                                                      Optional. Default "localhost:8080".
  --base-url=URL                                  The public base url to use when other services connect to this endpoint. 
                                                      Optional. Default "ws://localhost:8081".
  --render-device=PATH                            Path of the render device that should be used for hardware acceleration. 
                                                      Optional. Default "/dev/dri/renderD128".
  --encoder=ENCODER                               The h264 encoder to use. "x264", "nvh264" and "vaapih264" are supported. 
                                                      "x264" is a pure software encoder. "nvh264" is a hw accelerated encoder for Nvidia based GPUs. 
                                                      "vaapih264" is an experimental encoder for intel GPUs.
                                                      Optional. Default "x264".
  --application=NAME:EXECUTABLE_PATH:HTTP_PATH    Maps an application with NAME and EXECUTABLE_PATH to an HTTP_PATH. This option can be repeated 
                                                      with different values to map multiple applications.
                                                      Optional. Default: "gtk4-demo:/gtk4-demo:/usr/bin/gtk4-demo".
  --help, -h                                      Print this help text.

 The environment variable "LOG_LEVEL" is used to set the logging level. Accepted values are: "fatal", "error", "warn", "info", "debug", "trace"

Examples
  $ compositor-proxy --basic-auth=myuser:supersecret --application=gtk4-demo:/gtk4-demo:/usr/bin/gtk4-demo
```
---
_Please note that QT applications often require an extra `-platform wayland` parameter else they will try to use the X server.
If your application can't connect, try setting the `WAYLAND_DISPLAY` environment variable to the value that was printed by compositor-proxy. ie if you see `Listening on: WAYLAND_DISPLAY=\"wayland-0\".`
then set the environment variable `export WAYLAND_DISPLAY=wayland-0`._
---
### Packaged build

It's also possible to build a distributable release.

- `yarn install`
- `yarn generate`
- `yarn build`
- `yarn package`

This creates a set of files in the `package` directory. Execute the `run.sh` script to start the compositor proxy. 

The packaged binary expects the following set of dependencies to be available for mesa & nvidia support, if you're running a Debian based distro you can run:
```
apt-get install \
    libffi8 \
    libudev1 \
    libgbm1 \
    libgraphene-1.0-0 \
    gstreamer1.0-plugins-base \
    gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-bad \
    gstreamer1.0-plugins-ugly \
    gstreamer1.0-gl \
    libosmesa6 \
    libdrm2 \
    libdrm-intel1 \
    libopengl0 \
    libglvnd0 \
    libglx0 \
    libglapi-mesa \
    libegl1-mesa \
    libglx-mesa0 \
    libnvidia-egl-wayland1 \
    libnvidia-egl-gbm1 \
    xwayland \
    xauth \
    xxd \
    inotify-tools \
    libnode108
```

### Docker

Running the Greenfield Compositor Proxy can also be done using docker-compose (see `docker-compose.yml` in the `compositor-proxy` directory), but you will be limited to the applications specified in the docker-compose file. Beware that this docker compose file only provides the Greenfield Compositor Proxy, so you will still need to run a Greenfield Compositor Module implementation yourself.

There is also a short screen-cast, if you're unsure on how to get started:

[![docker-compose greenfield](https://img.youtube.com/vi/SiVfCMqpj3Q/0.jpg)](https://www.youtube.com/watch?v=SiVfCMqpj3Q)

The compositor-proxy is also available as a public docker image `docker.io/udevbe/compositor-proxy` but does not include any `config.yaml`. This means you'll
have to include it yourself using a mount. Have a look at the docker-compose file for inspiration.

# High level technical

## Client connection
A Greenfield browser compositor uses a native compositor-proxy to talk to native applications. 
This proxy compositor accepts native Wayland client connections and assigns them to a WebSocket connection as soon as 
one becomes available. A native client and it's WebSocket connection are bound to each other until either one is closed.

A compositor-proxy proxy can request additional WebSocket connections from an already connected Greenfield browser compositor.
This is needed in case a Wayland client spawns a new Wayland client process. If no WebSocket connections already exists,
the compositor-proxy will wait until a new WebSocket connection is available. In other words, the first WebSocket connection
is always initiated from the browser.

## Client frame encoding, or "can it run games?"

Each application's content is encoded to video frames using GStreamer and send to the browser for decoding. In the browser the application is realised by a WebGL texture inside a HTML5 canvas.
This canvas is basically what you would call an 'output' in Wayland terminology. The browser compositor is asynchronous, meaning a slow client will not block the processing of another client.

## Old implementation

[<img src="https://docs.google.com/drawings/d/e/2PACX-1vRNgOGRL1OKXFGNeVYDylp8CFZLl-GsWFyuVaZP9GkLpARsoMyZcA0KzbtL6vCxCuxnINETogW2mgUd/pub?w=1985&h=561" />](https://docs.google.com/drawings/d/e/2PACX-1vRNgOGRL1OKXFGNeVYDylp8CFZLl-GsWFyuVaZP9GkLpARsoMyZcA0KzbtL6vCxCuxnINETogW2mgUd/pub?w=1985&h=561)

This setup has some performance constraints as a lot of parts still use the CPU to do image encoding and decoding. The proxy compositor can't deal with OpenGL texture coming from the client either, meaning
that a client (ie a game) needs to download its entire rendering to RAM before passing it to the proxy-compositor. Another drawback is that we have to work with a dual encoding/decoding solution as the H.264 codec
does not support transparency (alpha).

To make this performant, all image processing should be done on the GPU and an image codec that supports alpha (transparency) should be used.

Such a hypothetical perfect pipeline would look something like this:

[<img src="https://docs.google.com/drawings/d/e/2PACX-1vQ0BpqicB4wNwYKotSK6Hm1lECZ9k5eQYKekFFjXcx4b2yWEhDIim9Hi0Y1Iq1NoFVaZl-kqA6lJdxh/pub?w=1985&h=561" />](https://docs.google.com/drawings/d/e/2PACX-1vQ0BpqicB4wNwYKotSK6Hm1lECZ9k5eQYKekFFjXcx4b2yWEhDIim9Hi0Y1Iq1NoFVaZl-kqA6lJdxh/pub?w=1985&h=561)

Here, all heavy operations are done by the GPU. H.264 has been replaced with H.265 which supports transparency, so we can use a single encoding/decoding step. The compositor-proxy supports the Wayland DRM protocol, so it can pass OpenGL applications
directly to the encoder without making any copies.

There is however one major problem to this solution: 
the combination of [WebCodecs API](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API) and the H.265 codec simply does not exist in any browser.

## The current implementation:

[<img src="https://docs.google.com/drawings/d/e/2PACX-1vRIPsXAvlTFj-bERKWLeoo5RFWUQHfLyQOymNZ8c-kVEhpsh8GGXYAkudanvpNzycTC3G9xuCPxHX6x/pub?w=1985&h=561" />](https://docs.google.com/drawings/d/e/2PACX-1vRIPsXAvlTFj-bERKWLeoo5RFWUQHfLyQOymNZ8c-kVEhpsh8GGXYAkudanvpNzycTC3G9xuCPxHX6x/pub?w=1985&h=561)

Here we've extended the old solution with support for the Wayland DRM protocol (+ DMA_BUF protocol). This allows for a zero-copy transfer of the application pixels to the encoding pipeline. We've also added support
for the H.264 WebCodecs API, which allows us to do decoding on the GPU of the receiving browser client if supported. If no usable GPU is available in the Compositor-Proxy, the pipeline falls back to slower software rendering.

*The end result is a near ideal solution that is fast enough to support gaming.*

## WebSockets - WebRTC DataChannels - WebTransport

There is one drawback that currently still remains, and that's the use of WebSockets to deliver data to the browser. WebSockets operate over TCP which is ill-suited for real-time applications like Greenfield. 
Instead, a UDP based protocol is needed. Browsers today unfortunately have no support for UDP based protocols aside from WebRTC DataChannels. However, we can not use WebRTC DataChannels as the build-in SCTP congestion algorithm is unacceptably slow. 
A more low level UDP protocol is required and is currently in the works in the form of the WebTransport protocol. Once WebTransport becomes more widely available, we can operate in UDP mode 
and assure fast end reliable transfers using [KCP](https://github.com/skywind3000/kcp/blob/master/README.en.md) in combination with forward-error-correction.


## Copy-Paste

If both clients are connected to separate compositor-proxy, copy-paste will use a direct peer to peer transfer between compositor-proxies.
This avoids the round trip and massive overhead of transferring all content to the browser and back. How this works is illustrated in the image below:

[<img src="https://docs.google.com/drawings/d/e/2PACX-1vQfr7I8GaalOzmOAwAOFYK8bzdeQna82JwxesDvD22_kj5BgSIKM16JKk-E2G-nPt5Ssgrhyi9kO9ZV/pub?w=1056&h=620" />](https://docs.google.com/drawings/d/e/2PACX-1vQfr7I8GaalOzmOAwAOFYK8bzdeQna82JwxesDvD22_kj5BgSIKM16JKk-E2G-nPt5Ssgrhyi9kO9ZV/pub?w=1056&h=620)

## XWayland

Very much beta. Most things are implemented except for fullscreen applications. Please report any bugs or annoyances you find.

## Media

Fosdem presentation + demo (2 Feb 2019):

[![Fosdem presentation + demo](https://img.youtube.com/vi/QjJDH7QtlXk/0.jpg)](https://www.youtube.com/watch?v=QjJDH7QtlXk)

Early tech preview demo (23 Nov 2017):

[![Early tech preview demo](https://img.youtube.com/vi/2lyihdFK7EE/0.jpg)](https://www.youtube.com/watch?v=2lyihdFK7EE)
