## About

For use with Google Compute Engine (GCE) using the Container optimized OS (COS) as the host OS image as described [here](https://github.com/udevbe/greenfield/tree/master/environments/gcloud/pulumi).

## Usage

- Configure the app-endpoint-server to use ['nvh264'](https://github.com/udevbe/greenfield/blob/master/app-endpoint-server/config.json5#L37)
- Build the container images using `gcloud-build-containers.sh`. This will make them available to your Google Cloud account.
- ssh into your GCE instance [that you created](https://github.com/udevbe/greenfield/tree/master/environments/gcloud/pulumi).
- Make sure you are authorized to pull the docker images on your GCE account using the commands: 
    `docker-credential-gcr configure-docker && docker-credential-gcr gcr-login`.
- Pull the images: `docker pull gcr.io/yourprojectname/xnvidia:0 && docker pull gcr.io/yourpojectname/app-endpoint-server:latest`
- Copy the `docker-compose.yml`, `start.sh` and `stop.sh` files from this repo to your GCE instance.
- Run `start.sh` to start a dockerized docker-compose instance, run`stop.sh` to stop the instance.
- Run the [compositor demo](https://github.com/udevbe/greenfield/tree/master/compositor-demo) and adjust the URLs of the remote application to match the GCE server's IP.
