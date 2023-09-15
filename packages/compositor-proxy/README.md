# Usage

## Development

- `yarn install`
- `yarn generate`
- `yarn build:native`
- `cp dist/encoding/proxy-encoding-addon.node src/encoding/proxy-encoding-addon.node`
- `cp dist/proxy-poll-addon.node src/proxy-poll-addon.node`

and finally
- `yarn start`

You should now see something that says `Compositor proxy started. Listening on port 8081`.

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
  --basic-auth=USER:PASSWORD                      Basic auth credentials to use when securing this proxy.
                                                      Optional.
  --bind-ip=IP                                    The ip or hostname to listen on.
                                                      Optional. Default: "0.0.0.0".
  --bind-port=PORT                                The port to listen on. 
                                                      Optional. Default "8081".
  --allow-origin=ORIGIN                           CORS allowed client origins, used when doing cross-origin requests. Value can be comma seperated domains. 
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
```
