About
=

Example of a compositor running a single remote GTK4 demo application. The GTK4 demo application is expected to be
provided externally by a compositor-proxy, e.g. `packages/compositor-proxy-cli` in this repo.

Running
=

- `yarn install`
- `yarn start`
- Go to `http://localhost:8080`

The remote url is hard-coded inside `src/index.ts` as `http://localhost:8081/gtk4-demo` but can easily be adjusted to e.g. `https://my.domain.com/someapp` in case
you want to run your own remote compositor-proxy.

The fullscreen application can be installed as a [Progressive Web App](https://en.wikipedia.org/wiki/Progressive_web_app) or PWA by browsers that support it.
When installed as a PWA, the application will still be running remotely but will be integrated as it were a local application.
