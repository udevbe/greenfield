## About

The HTML5 Wayland compositor library for Greenfield.

## Building

Compositor-module uses open-api to generate client code to talk to the compositor-proxy. This requires `java` to be present on your PATH during build.

Next, simply run:

- `yarn install`
- `yarn generate`
- `yarn build`

## Usage

Inside `compositor-module` directory run.
- `yarn start`

This will start a new demo compositor implementation. 

There are 2 checkboxes that will connect to the compositor-proxy instance as indicated by 
the freely adjustable text input. The last text input can launch a (experimental) web app client that runs entirely inside your browser.
There are 2 demo web apps available `demo-webapp` and `demo-webapp-wgpu` running on `localhost:9000` and `localhost:9001` respectively.
