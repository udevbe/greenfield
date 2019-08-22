## About

For use with Google cloud compute engine (GCE) using the Container optimized OS (COS) as the host OS image. The COS
image is expected to have GPU drivers installed using: https://github.com/udevbe/cos-gpu-installer. For decent performance
we recommend at least 8 vCPUs for a smooth 1080p experience as the content encoding is currently still done in software.

## Usage
Ssh into your compute engine instance running a COS image that was created using: https://github.com/udevbe/cos-gpu-installer

- Checkout this repository on your GCE instance.
- Navigate to this directory in the cloned repo.
- Run `$ bash run.sh` and make sure the port & firewall settings are correctly configured on your GCE instance
- Go to `https://preview.greenfield.app` and add a `link.json` file (like [this](https://github.com/udevbe/greenfield/blob/master/compositor/public/store/remote-gtk3-demo/link.json) one) with the IP of your GCE instance. 
Make sure your GCE is accessible through a secure connection or your browser will complain.

Alternatively if you do not want to setup and configure secure web socket connection.

- Checkout this repository on your local machine.
- Navigate to the `compositor` directory.
- run `npm run start`. Greenfield is now served on an insecure http connection and your browser will not complaing about mixed content anymore.
