# greenfield
in-browser wayland compositor

Experiment in using [Westfield](https://github.com/udevbe/westfield) together with [webrtc](https://webrtc.org/faq/#what-is-webrtc)/[object-rtc](https://ortc.org/) to create an in-browser wayland compositor.

[![Alt text](https://img.youtube.com/vi/2lyihdFK7EE/0.jpg)](https://www.youtube.com/watch?v=2lyihdFK7EE)


Installation
============

Clone this repo and inside the cloned directory run:

`npm install`

You will also need gstreamer-1.x and the following plugins:
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
 - Port `80`

`npm start`  

### Clients
You can try some wayland clients. Preferably the Weston 1.4 (early version) test clients, as xdg_shell support is not yet implemented.
