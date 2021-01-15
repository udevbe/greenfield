# Greenfield
### The in-browser wayland compositor [![Build Status](https://travis-ci.org/udevbe/greenfield.svg)](https://travis-ci.org/udevbe/greenfield)

Latest development snapshot: https://greenfield-preview.web.app/

Greenfield is a [Wayland compositor](https://en.wikipedia.org/wiki/Wayland_%28display_server_protocol%29) written entirely
in TypeScript while utilizing WebAssembly and WebGL for the performance critical parts. It can run native Wayland 
applications remotely, or it can run Wayland web applications directly in your browser.


For more information, visit the [documentation](https://greenfield.app/docs/) or have a look on the [website](https://greenfield.app).

### Modular Compositor
Greenfield consists of 3 separate parts.
 - [Westfield](https://github.com/udevbe/westfield) A Wayland protocol implementation.
 - [Greenfield Compositor Module](https://github.com/udevbe/greenfield) A bare bones Wayland compositor library.
 - [Greenfield Web Shell](https://github.com/udevbe/greenfield-webshell) An extensive implementation of the Greenfield Compositor Module.

# Running latest code locally
From the root of this repository run:
### app-endpoint server
- `pushd app-endpoint-server && yarn install && yarn generate && yarn build && GST_GL_WINDOW=gbm yarn start`

### compositor-demo
- `pushd compositor-module && yarn install && yarn build && yarn link && popd && pushd compositor-demo && yarn install && yarn link greenfield-compositor && yarn start`

# Quick Docker Demo
- `git clone https://github.com/udevbe/greenfield.git`
- `cd greenfield/environments/local`
- `docker-compose up`

This will start 3 containers.
- An app-endpoint-server, has the gtk3-demo-application as launchable application.
- A dummy X server, required by the gstreamer encoder from the app-endpoint-server to run OpengGL commands. Not used for anything else.
- An nginx server, has ssl termination and uses a self-signed localhost certificate so a secure websocket connection can be set up.

Your browser will, by default, reject the secure websocket connection as it uses a self-signed certificate. 
You can however force your browser to accept the certificate.
- In Firefox, go to https://localhost and simply follow the dialogue and accept the certificate. You should now get a `502 bad gateway` which means
your browser can communicate. This is fine as the app-endpoint-server only handles websocket requests, hence you get a `5xx error`.
Simply close the tab, the certificate has now been permanently accepted.
- In Chrome there is no dialogue button. Go to `chrome://flags/#allow-insecure-localhost` and enable `Allow invalid certificates for resources loaded from localhost.`

Go to https://greenfield-preview.web.app and click the top right raster icon. Go to the web store and add the [remote-gtk3-demo](https://greenfield-preview.web.app/webstore/remote-gtk3-demo).


### Media

First User Shell implementation (April 2019)

[<img src="https://storage.googleapis.com/greenfield.app/Greenfield_2019-09-11.png" height="200" />](https://storage.googleapis.com/greenfield.app/Greenfield_2019-09-11.png)

Fosdem presentation + demo (2 Feb 2019):

[![Fosdem presentation + demo](https://img.youtube.com/vi/QjJDH7QtlXk/0.jpg)](https://www.youtube.com/watch?v=QjJDH7QtlXk)


Early tech preview demo (23 Nov 2017):

[![Early tech preview demo](https://img.youtube.com/vi/2lyihdFK7EE/0.jpg)](https://www.youtube.com/watch?v=2lyihdFK7EE)
