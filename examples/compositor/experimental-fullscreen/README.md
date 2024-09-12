About
=

Example of a compositor running a single remote GTK4 demo application. The GTK4 demo application is expected to be
provided externally by a compositor-proxy, e.g. `packages/compositor-proxy-cli` in this repo.

Running
=

- `yarn install`
- `yarn start`
- Go to `http://localhost:8080`

The remote application can be installed as a [Progressive Web App](https://en.wikipedia.org/wiki/Progressive_web_app) by browsers that support it.
When installed as a PWA the application will still be running remotely but will be integrated as it were a local application.

