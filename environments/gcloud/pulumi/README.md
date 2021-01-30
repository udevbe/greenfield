# About
This will create a `n1-standard-8` machine (8 vCPU, 30GB ram) with a 30GB SSD and an Nvidia T4. The machine is
configured to
be [preemptible](https://cloud.google.com/compute/docs/instances/preemptible#what_is_a_preemptible_instance) to lower
the cost of running it. (~0.20$/hour)

# Building

- Install & configure [pulumi](https://www.pulumi.com/) so it can access your Google cloud.
- `yarn install`
- `pulumi up`

After the setup is done, a compute machine will be started. [You can now build & deploy the app-endpoint-server.](https://github.com/udevbe/greenfield/tree/master/environments/gcloud/gcloud-cos-gpu)


