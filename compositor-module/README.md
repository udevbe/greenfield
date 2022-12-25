## About

The HTML5 Wayland compositor library for Greenfield.

## Building

Compositor-module uses open-api to generate client code to talk to the compositor-proxy. This requires `java` to be present on your PATH during build.

Next, simply run:

- `yarn install`
- `yarn generate`
- `yarn build`

## Usage

To use this library in your own implementation, you will need:
- a worker loader that matches on `*.worker.js` imports.
- a file (url) loader that matches on `*.asset` and `*.png`

An example webpack config can be found in the [demo](https://github.com/udevbe/greenfield/tree/master/compositor-demo) implementation 
that you can use. Inside `compositor-module` directory run.
- `yarn install`
- `yarn start`

This will start a new demo compositor implementation with 4 buttons. The first 2 buttons will connect to a compositor-proxy instance, the last 2 buttons will launch a new (experimental)
demo web app client that runs entirely inside your browser.
