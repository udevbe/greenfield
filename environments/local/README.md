## About

Demo docker compose configuration. For use on your local machine.

## Usage

`docker-compose up`

This will start 3 containers.
- An app-endpoint-server, has the gtk3-demo-application as launchable application.
- A dummy X server, used by the gstreamer encoder from the app-endpoint-server container.
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

