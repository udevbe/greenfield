## About

The HTML5 Wayland compositor library for Greenfield.

## Building

Compositor-module uses open-api to generate client code to talk to the compositor-proxy. This requires `java` to be present on your PATH during build.

Next, simply run:

- `yarn install`
- `yarn generate`

## Usage

Inside `compositor-module` directory run.
- `yarn start`

This will start a new example compositor implementation. 

There are 2 inputs available to launch applications. 

The first one  will connect to a compositor-proxy instance as indicated by 
the freely adjustable text input in the form of `domain:port`.

The last text input can launch (experimental) web app clients that runs entirely inside your browser.
There are also 2 demo web apps available `demo-webapp` and `demo-webapp-wgpu` that you can run by going into the respective directory running on `http://localhost:9000` and `http://localhost:9001` respectively.
