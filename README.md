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
- appsink

Running
=======

`npm start`

Open a browser, preferably Firefox as chrome has frequent crashes when using webworkers with asm.js.

Navigate to `http://localhost:8080`

Next you can try some wayland clients. Preferably the Weston 1.4 (early version) test clients, as xdg_shell support is not yet implemented.
