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

{: .important }
>Greenfield requires [`yarn >=3.6`.](https://yarnpkg.com/getting-started/install)

```shell
yarn install
yarn workspaces foreach --parallel --topological-dev \
--exclude @gfld/compositor-proxy \
--exclude @gfld/compositor-proxy-cli \
run build
```

{: .note }
>The build excludes `compositor-proxy` packages as these only build on Linux environments.
>We'll come back to this under the chapter [Remote Applications](#remote-applications).

After all packages have been build, we can spin up the Greenfield compositor shell.
```shell
yarn workspace @gfld/shell run start
```
Open a browser and point it at [http://localhost:8080](http://localhost:8080).

[![](img_small.jpg)](img.png){:target="_blank"}

Unfortunately at this point we can't run any applications because there are none available. Let's fix that in the next steps.

## Web Applications

Web applications in Greenfield can either be native Wayland applications compiled to WebAssembly or pure JavaScript applications.
Greenfield provides a few examples that we can use.

- `examples/sdk` shows the usage of the [Greenfield WebAssembly SDK](/greenfield/pages/sdk) in porting existing native desktop applications to Greenfield (experimental).
- `examples/webapps` has some ready-to-run examples.

We'll begin simple with `examples/webapps/simple-shm`.

```shell
yarn workspace @gfld/demo-webapp-simple-shm start
```

The Greenfield Compositor Shell maps the URL `web:simple-shm` to `http://localhost:9001`, which is the 
address of this example web app. Type this URL in the Greenfield address bar and some psychedelic circles should appear.
To exit the application, press the `esc` key.

[![](img_1_small.jpg)](img_1.png){:target="_blank"}

{: .note }
> The Compositor Shell uses a reverse proxy config to map `web:simple-shm` to `http://localhost:9001`.

{: .note }
> You might have noticed that `web:simple-shm` is not a normal looking URL as the hostname is missing. The reason for this is that
> Greenfield web apps can only run inside same-origin iframes because of features like `SharedArrayBuffer`. Greenfield thus fills
> in the hostname for you, so you don't having to type out the same hostname each time.

As mentioned earlier, there are also WebAssembly examples available. So let's build something more exciting.

Inside `examples/sdk/weston`
```shell
./build.sh
```

{: .important }
> Building the WebAssembly examples require a working SDK. Head over to the SDK [documentation](/greenfield/pages/sdk) to set it up.

If all went well, a new `build/clients` directory has appeared with a bunch of `.html`, `.js` and `.wasm`. Spin up a web server so these can be served.

```shell
yarn workspace @gfld/weston-clients preview
```

Enter any of these in the URL bar to see a WebAssembly desktop application.

```shell
web:weston-clients/weston-eventdemo.html
web:weston-clients/weston-flower.html
web:weston-clients/weston-fullscreen.html
web:weston-clients/weston-resizor.html
web:weston-clients/weston-scaler.html
web:weston-clients/weston-smoke.html
web:weston-clients/weston-stacking.html
web:weston-clients/weston-transformed.html
```

[![](img_2_small.jpg)](img_2.png){:target="_blank"}

## Remote Applications

{: .important }
> Only Linux remote applications are supported. If you don't have a Linux machine, you can still run remote applications
> using a [Docker image](http://127.0.0.1:4000/greenfield/pages/design/#docker).

Greenfield can also run Linux applications remotely, both Wayland and X11. To do so, the remote machine must run
a compositor proxy process that forwards all communication to the browser. We start by building the Compositor Proxy in
a Linux environment.

```shell
yarn workspace @gfld/compositor-proxy build
```

{: .note }
> Building the native code requires CMake and Ninja. The build system will tell you what other packages might be missing.

The Compositor Proxy only provides a library to forward applications. We will also need an actual implementation that
can manage application lifecycles, provide some form of auth etc. A basic implementation is provided by Compositor Proxy CLI.

```shell
yarn workspace @gfld/compositor-proxy-cli start
```

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

Further reading about the individual components configuration and inner workings can be found on the [design](/greenfield/pages/design) page.
