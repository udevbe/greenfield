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

The Compositor is at the center of everything. It's responsible for drawing application pixels on the screen and handling all
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

# Compositor Proxy

The Compositor Proxy is a library that acts as a real native Wayland compositor and deals with all communication between a native Wayland application
and the Compositor running in the browser.

To build, you need a set of native dependencies. You can look at the [Docker image](https://github.com/udevbe/greenfield/blob/master/compositor-proxy/Dockerfile#L4) to see which ones you need to build and run respectively, or if you're running a Debian based distro you can run:
```
sudo apt install cmake build-essential ninja-build pkg-config libffi-dev libudev-dev libgbm-dev libdrm-dev libegl-dev \ 
 libwayland-dev libglib2.0-dev libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev libgraphene-1.0-dev gstreamer1.0-plugins-base \ 
 gstreamer1.0-plugins-good gstreamer1.0-plugins-ugly gstreamer1.0-gl xwayland
```

More dependencies may be required depending on your GPU eg. for nvidia based cards, you might need additional drivers and libraries.

Building is straightforward.

```shell
yarn workspace @gfld/compositor-proxy build
```

The build output can be found inside the `dist` folder. 

The Compositor Proxy requires an implementation in order to run, a basic one is provided by the [Compositor Proxy CLI](#compositor-proxy-cli).

## High level technical

The Compositor Proxy implementation listens to native Wayland applications and talks to the remote Compositor that runs in the browser.
Each remote application's content is encoded to video frames using GStreamer and send to the browser for decoding.

[<img src="https://docs.google.com/drawings/d/e/2PACX-1vRIPsXAvlTFj-bERKWLeoo5RFWUQHfLyQOymNZ8c-kVEhpsh8GGXYAkudanvpNzycTC3G9xuCPxHX6x/pub?w=1985&h=561" />](https://docs.google.com/drawings/d/e/2PACX-1vRIPsXAvlTFj-bERKWLeoo5RFWUQHfLyQOymNZ8c-kVEhpsh8GGXYAkudanvpNzycTC3G9xuCPxHX6x/pub?w=1985&h=561)

{: .note }
> This pipeline [fast enough to support gaming.](https://www.youtube.com/watch?v=pTn_hjOwK-Y)

Image processing is done on the GPU if available, if not, slower CPU software encoding is used. The Compositor Proxy implements the Wayland `wl-drm` & `dmabuf-v1` protocol. This allows for a zero-copy transfer of the application pixels to the encoding pipeline. The Compositor in the browser also supports
the H.264 WebCodecs API, which can use the GPU of the receiving browser client to decode frames.

### WebSockets - WebRTC DataChannels - WebTransport

The current implementation of Compositor Proxy uses WebSockets to deliver data to the browser. WebSockets operate over TCP which is ill-suited for real-time applications.
Instead, a UDP based protocol is needed. Browsers today unfortunately have no support for UDP based protocols aside from WebRTC DataChannels. However, we can not use WebRTC DataChannels as the build-in SCTP congestion algorithm is unacceptably slow.
A more low level UDP protocol is required and is currently in the works in the form of the WebTransport protocol. Once WebTransport becomes more widely available, we can operate in UDP mode
and assure fast end reliable transfers using [KCP](https://github.com/skywind3000/kcp/blob/master/README.en.md) in combination with forward-error-correction.

### Copy-Paste

If both native applications are connected to separate Compositor Proxy instances, the Compositor Proxy will use a direct peer-to-peer connection to transfer copy-paste 
data to other remote Compositor Proxy instance. This avoids the round trip and overhead of transferring all content to the browser and back.

# Compositor Proxy CLI

The Compositor Proxy CLI provides an implementation on top of the [Compositor Proxy](#compositor-proxy) and works together with the
Compositor Shell.

For XWayland support a few extra steps may be needed, this is optional and only required if you don't already hava an X server running eg. when running on a server:

- `export XAUTHORITY=.Xauthority`
- `touch "$HOME/$XAUTHORITY"`
- `xauth add "${HOST}":1 . "$(xxd -l 16 -p /dev/urandom)"`

This will start a development build+run. You should now see something that says `Compositor proxy started. Listening on port 8081`. You can also adjust some things
in `src/config.yaml`.

{: .note }
> Firefox needs to be at least at version 113 and `dom.workers.modules.enabled` preference needs to be set to true. To change preferences in Firefox, visit `about:config`.

You should now have a Wayland compositor running on your system, so let's start some applications. Most recent GTK3/4 applications (like gnome-terminal) should
auto-detect the compositor-proxy and simply connect without issues or extra setup. QT applications often require an extra `-platform wayland` parameter.
If your application can't connect, try setting the `WAYLAND_DISPLAY` environment variable to the value that was printed by compositor-proxy. ie if you see `Listening on: WAYLAND_DISPLAY=\"wayland-0\".`
then set the environment variable `export WAYLAND_DISPLAY=wayland-0`.

After starting an application, you should see a message appear in the log output of the compositor-proxy that we started earlier: `New websocket connected.`.

## Packaged build

It's also possible to build a distributable release.

```shell
yarn package
````

This creates a set of files in the `package` directory. The `run.sh` script accepts several options:

```shell
Usage
  $ compositor-proxy <options>

Options
  --help, Print this help text.
  --static-session-id=...,  Mandatory. Only use and accept this session id when communicating.
  --config-path=...,  Use a custom configuration file located at this path.

Examples
  $ compositor-proxy --static-session-id=test123 --config-path=./config.yaml
```

Below is an example config file (the default config). It can be copy-pasted and used with the `--config-path=...` option.
You will at least need to set the `public.baseURL` when not running locally.
```yaml
server:
  http:
    # Hostname argument.
    bindIP: 0.0.0.0
    # Port argument.
    bindPort: 8081
    # CORS allowed origins, used when doing cross-origin requests. Value can be * or comma seperated domains.
    allowOrigin: '*'
public:
  # The base url to use when connecting to this endpoint. 
  # This is the publicly reachable address of the compositor proxy.
  baseURL: http://localhost:8081
encoder:
  # Path of the render device that should be used for hardware acceleration. e.g. /dev/dri/renderD128
  renderDevice: /dev/dri/renderD128
  # The gstreamer h264 encoder to use. 'x264' and 'nvh264' are supported ('vaapih264' is currently broken). 'x264'
  # is a pure software encoder. While 'nvh264' is a hw accelerated encoder for Nvidia based GPUs.
  # see https://gstreamer.freedesktop.org/documentation/x264/index.html
  # see https://gstreamer.freedesktop.org/documentation/nvenc/nvh264enc.html
  h264Encoder: x264
logging:
  # "fatal" | "error" | "warn" | "info" | "debug" | "trace"
  level: info
```
The packaged binary expects the following set of dependencies to be available for mesa & nvidia support, if you're running a Debian based distro you can run:
```
apt-get install libffi8 libudev1 libgbm1 libgraphene-1.0-0 gstreamer1.0-plugins-base gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-bad gstreamer1.0-plugins-ugly gstreamer1.0-gl libosmesa6 libdrm2 libdrm-intel1 \
    libopengl0 libglvnd0 libglx0 libglapi-mesa libegl1-mesa libglx-mesa0 libnvidia-egl-wayland1 libnvidia-egl-gbm1 \
    xwayland xauth xxd inotify-tools libnode108
```

## Docker

Running the Greenfield Compositor Proxy can also be done using docker-compose (see `docker-compose.yml` in the 
`compositor-proxy` directory), but you will be limited to the applications specified in the docker-compose file. Beware 
that this docker compose file only provides the Greenfield Compositor Proxy, so you will still need to run a Greenfield 
Compositor Module implementation yourself.

The compositor-proxy is also available as a public docker image `docker.io/udevbe/compositor-proxy` but does not include 
any `config.yaml`. This means you'll have to include it yourself using a mount. Have a look at the docker-compose file for inspiration.