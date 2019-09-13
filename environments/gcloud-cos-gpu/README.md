## About

For use with Google Compute Engine (GCE) using the Container optimized OS (COS) as the host OS image. The COS
image is expected to have GPU drivers installed using: https://github.com/udevbe/cos-gpu-installer. For decent performance
we recommend at least an Nvidia K80 with 8 vCPUs for a smooth 1080p experience as the encoding is currently still done in software
due to encoder software bugs in the Nvidia gstreamer plugin. See bugs [1077](https://gitlab.freedesktop.org/gstreamer/gst-plugins-bad/issues/1077) 
and [1074](https://gitlab.freedesktop.org/gstreamer/gst-plugins-bad/issues/1074). 
This sadly only leaves alpha color splitting and RGB+A to YUV+A color conversion to be done on the GPU.

## Usage

- Build the container images using `gcloud-build-containers.sh`. This will make them available to your Google Cloud account.
- ssh into your GCE instance running the COS image that was created using: https://github.com/udevbe/cos-gpu-installer
- Make sure you are authorized to pull the docker images on your GCE account using the commands: 
    `docker-credential-gcr configure-docker && docker-credential-gcr gcr-login`.
- Pull the images: `docker pull gcr.io/yourprojectname/xnvidia:latest && docker pull gcr.io/yourpojectname/app-endpoint-server:latest`
- Copy the `docker-compose.yml`, `start.sh` and `stop.sh` files from this repo to your GCE instance.
- Run `start.sh` to start a dockerized docker-compose instance, run`stop.sh` to stop the instance.

- Go to `https://preview.greenfield.app` and add a `link.json` file 
(like [this](https://github.com/udevbe/greenfield/blob/master/compositor/public/store/remote-gtk3-demo/link.json) one) 
and configured it with the IP of your GCE instance. 
Make sure your GCE is accessible through a secure connection or your browser will complain.

Alternatively if you do not want to setup and configure a secure web socket connection.

- Checkout this repository on your local machine.
- Navigate to the `compositor` directory.
- run `npm run start`. Greenfield is now served locally on an insecure http connection and your browser will not complain about mixed content anymore.

Don't forget to properly configure the port in the GCE firewall and link.json file, by default port 8081 is expected.