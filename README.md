# greenfield
in-browser wayland compositor

Experiment in using [Westfield](https://github.com/udevbe/westfield) together with [webrtc](https://webrtc.org/faq/#what-is-webrtc)/[object-rtc](https://ortc.org/) to create an in-browser wayland compositor.

[![Alt text](https://img.youtube.com/vi/2lyihdFK7EE/0.jpg)](https://www.youtube.com/watch?v=2lyihdFK7EE)


Installation
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

Running
=======

Open a browser, preferably Firefox or Chrome.

### Development mode 
- Hot module redeploy support
- Single server process
- Max 1 connection
- Port `8080`
- Ideal for testing and demoing

`npm run start:dev`

### Production mode
 - Optimized and minimized build
 - One parent http server process for incoming connections
 - Separate child process for each accepted connection. (one server side child process per spawned compositor instance)
 - Configurable

`npm start` 

To create a distributable build, run `./build-dist.sh`. This will create a `dist` folder with a `greenfield` executable.
This executable is a self contained node instance with all bundled javascript sources. The native *.node dependencies 
inside the dist folder must be located next to the `greenfield` executable. Gstreamer dependencies are expected to be
present on the system.

A production build accepts a config file in json format. The config file is specified as the first argument to the greenfield
executable.

key |value
:----:|:----:
port|port number (default `8080`)

example_config.json
```json
{
  "port":80
}
```

`./greenfield example_config.json` 

or

`npm start -- example_config.json`

### Clients
You can try some wayland clients. Preferably the Weston 1.4 (early version) test clients, as xdg_shell support is not yet implemented.
