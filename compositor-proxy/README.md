# Usage

## Development

- `yarn install`
- `yarn generate`
- `yarn build:native`
- `cp dist/encoding/proxy-encoding-addon.node src/encoding/proxy-encoding-addon.node`
- `cp dist/proxy-poll-addon.node src/proxy-poll-addon.node`

and finally
- `yarn start`

You should now see something that says `Compositor proxy started. Listening on port 8081`. You can also adjust some things
in `src/config.yaml`.

> **_NOTE:_**  Firefox needs to be at least at version 113 and `dom.workers.modules.enabled` preference needs to be set to true. To change preferences in Firefox, visit `about:config`.

## Production build

- `yarn install`
- `yarn generate`
- `yarn build`
- `yarn package`

This creates a set of files in the `package` directory, to start simply run the `run.sh` script inside.

There is also a docker image available `docker.io/udevbe/compositor-proxy` that you can use as well as an example docker compose file with some applications.
This docker compose file only runs the compositor-proxy as well as some extra containerized applications. You still need to run a compositor-module separately to connect to
this compositor-proxy.

## Options
The `run.sh` script accepts several arguments: 

```
	Usage
	  $ compositor-proxy <options>

	Options
	  --help, Print this help text.
      --session-id=...,  Mandatory. Only use and accept this session id when communicating.
	  --config-path=...,  Use a configuration file located at this file path.

	Examples
	  $ compositor-proxy --session-id=test123 --config-path=./config.yaml
```

## Config
The compositor-proxy can be configured by supplying it a configuration file path using `--config-path=`.
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
  # The base url to use when connecting to this endpoint. This is the publicly reachable address of the compositor proxy.
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


