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
>We'll come back to this under the chapter Remote Applications.

After all packages have been build, we can spin up the Greenfield compositor shell.
```shell
yarn workspace @gfld/shell run start
```
Open a browser and point it at [http://localhost:8080](http://localhost:8080).

![img.png](img.png)

Unfortunatelya at this point we can't run any applications because there are none available. Let's fix that in the next steps.

## Remote Applications

## Web Applications
