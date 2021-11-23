## About

The HTML5 Wayland compositor library for Greenfield.

## Building

- `yarn install`
- `yarn build`

## Usage

To use this library in your own implementation, you will need:
- a worker loader that matches on `*.worker.js` imports.
- a file (url) loader that matches on `*.asset` and `*.png`

An example webpack config can be found in the [demo](https://github.com/udevbe/greenfield/tree/master/compositor-demo) implementation 
that you can use. Inside `compositor-module` directory run.
- `yarn install`
- `yarn demo`
