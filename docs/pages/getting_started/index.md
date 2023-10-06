---
layout: default
title: Getting Started
nav_order: 2
has_children: false
has_toc: false
---

# Getting Started

## Compositor

Clone the repository.
```shell
git clone https://github.com/udevbe/greenfield.git
```

Inside the `greenfield` repository, we'll tell `yarn` to install all dependencies and build all packages.

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
>The build excludes `compositor-proxy` packages as these will only build on Linux environments.
>We'll come back to this under the chapter [Remote Applications](#remote-applications).

After all packages have been build, we can spin up the Greenfield compositor shell.
```shell
yarn workspace @gfld/shell run start
```
Open a browser and point it at [http://localhost:8080](http://localhost:8080).

![img.png](img.png)

Unfortunately at this point we can't run any applications because there are none available. Let's fix that in the next steps.

## Web Applications

Web applications in Greenfield can either be native Wayland applications compiled to WebAssembly or pure JavaScript applications.
Greenfield provides a few examples that we can use inside the `examles` directory.

- `examples/sdk` shows the usage of the [Greenfield WebAssembly SDK](/pages/sdk) in porting existing native desktop applications to Greenfield.
- `examples/webapps` has some ready-to-run examples that we can use.

Well begin simple and start with `examples/webapps/simple-shm`.

```shell
yarn workspace @gfld/demo-webapp-shm install
yarn workspace @gfld/demo-webapp-shm start
```
The Greenfield Compositor Shell is pre-configured and maps the URL `web:simple-shm` to `http://localhost:9001`, the 
address of this example web app. We can type this URL in the Greenfield address bar and some psychedelic circles should appear.
Exit the application by pressing the `esc` key.

{: .note }
> You might have noticed that `web:simple-shm` is not a normal looking URL as the hostname is missing. The reason for this is that
> Greenfield web apps can only run inside same-origin iframes because of features like `SharedArrayBuffer`. Greenfield thus fills
> in the hostname for you, so you don't having to type out the same hostname each time.

## Remote Applications
