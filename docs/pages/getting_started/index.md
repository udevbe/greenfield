---
layout: default
title: Getting Started
nav_order: 2
has_children: false
has_toc: false
---


# Getting Started
{: .no_toc }


- 
{: toc }


## Compositor

Clone the repository if you haven't already.
```shell
git clone https://github.com/udevbe/greenfield.git
```

Inside the `greenfield` repository, we'll use `yarn` to install all dependencies and build all packages.

{: .note }
> Greenfield works best with node.js 20 or greater. You can easily install it using [nvm](https://github.com/nvm-sh/nvm).

{: .note }
> Greenfield uses [yarn 4 or greater.](https://yarnpkg.com/getting-started/install)

{: .important }
> Greenfield requires the following packages to be installed on your build system: `autoconf libtool automake meson ninja-build bison cmake build-essential gperf`.

```shell
yarn install
yarn workspaces foreach --all --parallel --topological-dev \
--exclude @gfld/compositor-proxy \
--exclude @gfld/compositor-proxy-cli \
run build
```

{: .note }
>The build excludes `compositor-proxy` packages as these only build on Linux environments.
>We'll come back to this under the chapter [Remote Applications](#remote-applications).

After all packages have been build, we can spin up the Greenfield compositor shell.
```shell
yarn workspace @gfld/compositor-shell run start
```
Open a browser and point it at [http://localhost:8080](http://localhost:8080).

[![](img_small.jpg)](img.png){:target="_blank"}

{: .note }
> The compositor-shell is also hosted at [desktop.greenfield.app](https://desktop.greenfield.app)

{: .note }
>  There is also an experimental kiosk mode available in case you only need to access a single application. An implementation of this can be found under `/examples/compositor/experimental-fullscreen`


## Web Applications

Web applications in Greenfield can either be native Wayland applications compiled to WebAssembly or pure JavaScript applications.
Greenfield provides a few examples that we can use.

- `examples/sdk` shows the usage of the [Greenfield WebAssembly SDK](/pages/sdk) in porting existing native desktop applications to Greenfield (experimental).
- `examples/webapps` has some ready-to-run examples.

We'll begin simple and start the app from `examples/webapps/simple-shm`.

```shell
web:simple-shm-web/app.html
```

Type this URL in the Greenfield address bar and some psychedelic circles should appear.
Press the `esc` key to exit the application.

[![](img_1_small.jpg)](img_1.png){:target="_blank"}

{: .note }
> You might have noticed that `web:simple-shm-web/app.html` is not a normal looking URL as the hostname is missing. The reason for this is that
> Greenfield web apps can only run inside same-origin iframes because of features like `SharedArrayBuffer`. Greenfield thus fills
> in the hostname for you, so you don't having to type out the same hostname each time.

As mentioned earlier, there are also WebAssembly examples available. So let's build something more exciting.

Inside `examples/sdk/weston`
```shell
./build.sh
```

{: .important }
> Building the WebAssembly examples require a working SDK. Head over to the SDK [documentation](/pages/sdk) to set it up.

If all went well, a new `build/clients` directory has appeared with a bunch of `.html`, `.js` and `.wasm`.

Enter any of these in the URL bar to see a WebAssembly desktop application.

```shell
web:weston/weston-eventdemo.html
web:weston/weston-flower.html
web:weston/weston-fullscreen.html
web:weston/weston-resizor.html
web:weston/weston-scaler.html
web:weston/weston-smoke.html
web:weston/weston-stacking.html
web:weston/weston-transformed.html
```

[![](img_2_small.jpg)](img_2.png){:target="_blank"}

## Remote Applications

{: .important }
> Only Linux remote applications are supported. If you don't have a Linux machine, you can still run remote applications
> using a [Docker image](/pages/design/#docker).

Greenfield can also run Linux applications remotely, both Wayland and X11. To do so, the remote machine must run
a compositor proxy process that forwards all communication to the browser. We start by building the Compositor Proxy in
a Linux environment.

```shell
yarn workspace @gfld/compositor-proxy build
```

{: .important }
> Building the native code requires the following dependencies :
> `libffi-dev libudev-dev libgbm-dev libdrm-dev libegl-dev libopengl-dev libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev libgstreamer-plugins-bad1.0-dev libgraphene-1.0-dev`.

{: .note }
> There's also a [Docker build script](https://github.com/udevbe/greenfield/blob/master/docker/compositor-proxy-cli-build.sh#L15) if you're unsure what dependencies you need.

The Compositor Proxy only provides a library to forward applications. We will also need an actual implementation that
can manage application lifecycles, provide some form of auth etc. A basic implementation is provided by Compositor Proxy CLI.

```shell
yarn workspace @gfld/compositor-proxy-cli start
```
{: .note }
> The Compositor Proxy works best with node.js 20 or greater. You can easily install it using [nvm](https://github.com/nvm-sh/nvm).

This will start the Compositor Proxy CLI locally on your machine with several applications pre-configured. The following
URLs are available.

```shell
rem:localhost:8081/gtk4-demo
rem:localhost:8081/kwrite
rem:localhost:8081/xterm
```

[![](img_3_small.jpg)](img_3.png){:target="_blank"}

{: .important }
> `gtk4-demo`, `kwrite` and `xterm` need to be installed separately.

Further reading about the individual components configuration and inner workings can be found on the [design](/pages/design) page.
