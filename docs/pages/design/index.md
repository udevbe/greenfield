---
layout: default
title: Design
nav_order: 3
has_children: false
has_toc: false
---


# Design
{: .no_toc }

Greenfield consists of many separate [components](/greenfield/pages/components). We'll go over the most relevant ones in detail. Make sure to go
over the [getting started](/greenfield/pages/getting_started) page first to have a minimal working setup.

- 
{:toc}

# Compositor

The Compositor package sits at the center. It's responsible for drawing application pixels on the screen and handling all
user input for these applications. It's a [Wayland compositor](https://en.wikipedia.org/wiki/Wayland_(protocol)#Wayland_compositors) library
that is 100% compatible with existing native Wayland protocol. It implements the Wayland protocols `core` and `xdg-shell`. 
In the browser, all applications are drawn using a WebGL texture inside a HTML5 canvas. 
The HTML5 canvas corresponds to an 'output' in the Wayland protocol. 
The browser compositor is asynchronous, meaning a slow client will not block the processing of another client.

The Compositor package has no 3rd party runtime dependencies, building is straightforward.

```shell
yarn workspace @gfld/compositor build
```

The build result is inside the `dist` folder.

The Compositor package is a library, so it doesn't do much without an actual implementation. This is where the Compositor Shell comes into play.

# Compositor Shell

The Compositor Shell provides an implementation on top of the Compositor. It provides auxiliary controls like application 
management, keyboard configuration etc. and works closely together with the [Compositor Proxy CLI](#compositor-proxy-cli).

The Compositor Shell included in the repository implements the bare minimum, while still trying to be somewhat esthetically pleasing.
It uses [Preact](https://preactjs.com/) and [Tailwind CSS](https://tailwindcss.com/) and has no runtime dependencies besides
Preact and the Compositor library. The Compositor Shell is implemented as a single page application.

Building is straightforward

```shell
yarn workspace @gfld/compositor-shell build
```

The build result is inside the `dist` folder and consists of static assets.

{: .important }
> Firefox needs to be at least at version 113 and `dom.workers.modules.enabled` preference needs to be set to true. To change preferences in Firefox, visit `about:config`.

# Compositor Proxy

The Compositor Proxy is a library that acts as a real native Wayland compositor and deals with all communication between a native Wayland application
and the Compositor running in the browser.

To build, a set of build dependencies is required. Look at the [Docker image](https://github.com/udevbe/greenfield/blob/master/compositor-proxy/Dockerfile#L4) to see which ones you need to build and run respectively, or if you're running a Debian based distro you can run:
```
sudo apt install cmake build-essential ninja-build pkg-config libffi-dev libudev-dev libgbm-dev libdrm-dev libegl-dev \ 
 libwayland-dev libglib2.0-dev libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev libgraphene-1.0-dev gstreamer1.0-plugins-base \ 
 gstreamer1.0-plugins-good gstreamer1.0-plugins-ugly gstreamer1.0-gl xwayland
```

More dependencies may be required depending on your GPU eg. for nvidia based cards, you might need additional drivers and libraries.

Building the Compositor Proxy is straightforward.

```shell
yarn workspace @gfld/compositor-proxy build
```

The build output can be found inside the `dist` folder. 

## Usage

The Compositor Proxy is just a library and requires an implementation in order to run. A basic implementation is provided by the [Compositor Proxy CLI](#compositor-proxy-cli).

## Encoding Pipeline

The Compositor Proxy implementation listens to native Wayland applications and talks to the remote Compositor that runs in the browser.
Each remote application's content is encoded to video frames using GStreamer and send to the browser for decoding.

[<img src="https://docs.google.com/drawings/d/e/2PACX-1vRIPsXAvlTFj-bERKWLeoo5RFWUQHfLyQOymNZ8c-kVEhpsh8GGXYAkudanvpNzycTC3G9xuCPxHX6x/pub?w=1985&h=561" />](https://docs.google.com/drawings/d/e/2PACX-1vRIPsXAvlTFj-bERKWLeoo5RFWUQHfLyQOymNZ8c-kVEhpsh8GGXYAkudanvpNzycTC3G9xuCPxHX6x/pub?w=1985&h=561)

{: .note }
> This pipeline is [fast enough to support gaming.](https://www.youtube.com/watch?v=pTn_hjOwK-Y)

Image processing is done on the GPU if configured and available, if not, slower CPU software encoding is used. The Compositor Proxy implements the Wayland `wl-drm` & `dmabuf-v1` protocol. This allows for a zero-copy transfer of the application pixels to the encoding pipeline. The Compositor in the browser also supports
the H.264 WebCodecs API, which can either use the GPU of the receiving browser client, or a native CPU based decoder. In case the browser does not support the WebCodecs API, the Compositor falls back to a WebAssembly decoder.

## Browser Connection

The current implementation of Compositor Proxy uses WebSockets to deliver data to the browser. WebSockets operate over TCP which is ill-suited for real-time applications.
Instead, a UDP based protocol is needed. Browsers today unfortunately have no support for UDP based protocols aside from WebRTC DataChannels. However, we can not use WebRTC DataChannels as the build-in SCTP congestion algorithm is unacceptably slow.
A more low level UDP protocol is required and is currently in the works in the form of the WebTransport protocol. Once WebTransport becomes more widely available, we can operate in UDP mode
and assure fast end reliable transfers using [KCP](https://github.com/skywind3000/kcp/blob/master/README.en.md) in combination with forward-error-correction.

## Copy-Paste

If both native applications are connected to separate Compositor Proxy instances, the Compositor Proxy will use a direct peer-to-peer connection to transfer copy-paste 
data to other remote Compositor Proxy instance. This avoids the round trip and overhead of transferring all content to the browser and back.

# Compositor Proxy CLI

The Compositor Proxy CLI provides an implementation on top of the [Compositor Proxy](#compositor-proxy) and works closely together with the
Compositor Shell to start, stop, or force quit applications. The Compositor Proxy CLI can be built into a single distributable binary.

```shell
yarn workspace @gfld/compositor-proxy-cli build
yarn workspace @gfld/compositor-proxy-cli package
````

This creates a single binary `compositor-proxy-cli` in the `/packages/compositor-proxy-cli/package` directory.
The Compositor Proxy CLI expects a set of dependencies to be available at runtime for [Mesa](https://www.mesa3d.org/) & Nvidia GPU support. 

On a Debian based distro run the following command.

```shell
apt-get install libffi8 libudev1 libgbm1 libgraphene-1.0-0 gstreamer1.0-plugins-base gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-bad gstreamer1.0-plugins-ugly gstreamer1.0-gl libosmesa6 libdrm2 libdrm-intel1 \
    libopengl0 libglvnd0 libglx0 libglapi-mesa libegl1-mesa libglx-mesa0 libnvidia-egl-wayland1 libnvidia-egl-gbm1 \
    xwayland xauth xxd inotify-tools
```

## Usage

The Compositor Proxy CLI accepts the arguments listed below.

| Flag              | Default                 | Explanation                                                                                                                                                    |
|-------------------|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--help`/`-h`     |                         | Show a help text.                                                                                                                                              |
| `--basic-auth`    |                         | Basic auth to use when launching a new application.                                                                                                            |
| `--bind-ip`       | `0.0.0.0`               | The ip address to bind to for websocket and http connections.                                                                                                  |
| `--bind-port`     | `8081`                  | The port to bind to for websocket and http connections.                                                                                                        |
| `--allow-origin`  | `http://localhost:8080` | The allowed origins during CORS checks.                                                                                                                        |
| `--base-url`      | `ws://localhost:8081`   | The base ws(s) url to use when connecting to this endpoint.  This is also required to inform other endpoints when doing direct endpoint to endpoint transfers. |
| `--render-device` | `/dev/dri/renderD128`   | Path of the render device that should be used for hardware acceleration. e.g. /dev/dri/renderD128                                                              |
| `--encoder`       | `x264`                  | The gstreamer h264 encoder to use. 'x264' is a pure software encoder while 'nvh264' is a hw  accelerated encoder for Nvidia based GPUs.                        |
| `--applications`  |                         | The path of the applications JSON file.                                                                                                                        |

An additional `--applications` config file is also required. This example applications JSON file maps the
paths `/gtk4-demo`, `/kwrite` and `/xterm` to an executable with additional context.
```json
{
  "/gtk4-demo": {
    "name": "GTK Demo",
    "executable": "gtk4-demo",
    "args": [],
    "env": {}
  },
  "/kwrite": {
    "name": "KWrite",
    "executable": "kwrite",
    "args": [
      "-platform",
      "wayland"
    ],
    "env": {}
  },
  "/xterm": {
    "name": "XTerm",
    "executable": "xterm",
    "args": [],
    "env": {}
  }
}
```

{: .note }
> Most recent GTK3/4 applications should  auto-detect the compositor-proxy and simply connect without issues or extra 
> setup. QT applications often require an extra `-platform wayland` parameter.

For XWayland support a few extra steps may be needed, this is optional and only required if you don't already 
hava an X server running eg. when running on a server. These commands should be executed before starting the 
Compositor Proxy CLI.

```shell
export XAUTHORITY=.Xauthority
touch "$HOME/$XAUTHORITY"`
xauth add "${HOST}":1 . "$(xxd -l 16 -p /dev/urandom)"
````

After starting an application, you should see a message appear in the log output of the Compositor Proxy CLI that we started earlier: `New websocket connected.`.

## Docker

Running the Compositor Proxy CLI can also be done using docker-compose (see `docker-compose.yml` in the 
`compositor-proxy` directory), but you will be limited to the applications specified in the docker-compose file. Beware 
that this docker compose file only provides the Compositor Proxy CLI, so you will still need to run the Compositor Shell yourself.

The Compositor Proxy CLI is also available as a public docker image `docker.io/udevbe/compositor-proxy-cli` but does not include 
any `applications.json`. This means you'll have to include it yourself using a mount.