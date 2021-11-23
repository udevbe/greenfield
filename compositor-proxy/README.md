# Usage
run:
- `yarn install`
- `yarn generate`
- `yarn build:native`
- `cp dist/encoding/app-endpoint-encoding.node src/encoding/app-endpoint-encoding.node`

and finally
- `yarn demo`

You should now see something that says `Compositor proxy started. Listening on port 8081`. You can also adjust some things
in `src/config.yaml`.

There is also a docker image available `docker.io/udevbe/compositor-proxy` that you can use as well as an example docker compose file with some applications.
This docker compose file only runs the compositor-proxy as well as some extra containerized applications. You still need to run a compositor-module separately to connect to
this compositor-proxy.
