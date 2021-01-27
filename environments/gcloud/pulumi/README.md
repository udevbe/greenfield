# Building

- Install & configure [pulumi](https://www.pulumi.com/) so it can access your Google cloud.
- `yarn install`
- `pulumi up`

This will create a `n1-standard-8` machine (4 vCPU, 30GB ram) with a 30GB SSD and an Nvidia T4. The machine is
configured to
be [preemptible](https://cloud.google.com/compute/docs/instances/preemptible#what_is_a_preemptible_instance) to lower
the cost of running it. (~0.25$/hour)
