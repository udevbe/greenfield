# Greenfield
### The in-browser wayland compositor [![Build Status](https://travis-ci.org/udevbe/greenfield.svg)](https://travis-ci.org/udevbe/greenfield)

Latest development snapshot available here: https://greenfield-preview.web.app/

[<img src="https://storage.googleapis.com/greenfield.app/Greenfield_2019-09-11.png" height="200" />](https://storage.googleapis.com/greenfield.app/Greenfield_2019-09-11.png)

Greenfield is a [Wayland compositor](https://en.wikipedia.org/wiki/Wayland_%28display_server_protocol%29) written entirely
in JavaScript while utilizing WebAssembly for the performance critical parts. It can run native Wayland 
applications remotely or it can run Wayland [web applications](https://preview.greenfield.app) directly in your browser.

No plugins required.

For more information, visit the [documentation](https://greenfield.app/docs/) or have a look on the [website](https://greenfield.app).

### Quick Demo
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

Go to https://preview.greenfield.app Click the top right raster icon. Click the + icon. Click the cloud icon.
Select the [remote-gtk3-demo](https://github.com/udevbe/greenfield/blob/master/compositor/public/store/remote-gtk3-demo/link.json)
link file.


### Media
Fosdem presentation + demo (2 Feb 2019):

[![Fosdem presentation + demo](https://img.youtube.com/vi/QjJDH7QtlXk/0.jpg)](https://www.youtube.com/watch?v=QjJDH7QtlXk)


Early tech preview demo (23 Nov 2017):

[![Early tech preview demo](https://img.youtube.com/vi/2lyihdFK7EE/0.jpg)](https://www.youtube.com/watch?v=2lyihdFK7EE)
