# Greenfield
### The in-browser wayland compositor [![Build Status](https://travis-ci.org/udevbe/greenfield.svg)](https://travis-ci.org/udevbe/greenfield)

Greenfield is a [Wayland compositor](https://en.wikipedia.org/wiki/Wayland_%28display_server_protocol%29) written entirely
in JavaScript while utilizing WebAssembly for the performance critical parts. It can run native Wayland 
applications remotely or it can run Wayland [web applications](https://preview.greenfield.app) directly in your browser.

No plugins required.

For more information, visit the [documentation](https://greenfield.app/docs/) or have a look on the [website](https://greenfield.app).

### Quick Demo
- `git clone https://github.com/udevbe/greenfield.git`
- `cd greenfield/docker/compose-demo`
- `docker-compose up`
- Go to https://preview.greenfield.app. Click the top right raster icon. Click the + icon. Click the cloud icon.
Select the [remote-gtk3-demo](https://github.com/udevbe/greenfield/blob/master/compositor/public/store/remote-gtk3-demo/link.json)
link file.

If you are using Firefox, you might need to go to`about:config` and toggle `network.websocket.allowInsecureFromHTTPS`

There is also [simple-webgl](https://github.com/udevbe/greenfield/blob/master/compositor/public/store/simple-web-gl/link.json) 
and [simple-shm](https://github.com/udevbe/greenfield/blob/master/compositor/public/store/simple-web-shm/link.json) 
which demo how apps can run directly in the browser and as such do not require the use of docker.

### Media
Fosdem presentation + demo (2 Feb 2019):

[![Fosdem presentation + demo](https://img.youtube.com/vi/QjJDH7QtlXk/0.jpg)](https://www.youtube.com/watch?v=QjJDH7QtlXk)


Early tech preview demo (23 Nov 2017):

[![Early tech preview demo](https://img.youtube.com/vi/2lyihdFK7EE/0.jpg)](https://www.youtube.com/watch?v=2lyihdFK7EE)
