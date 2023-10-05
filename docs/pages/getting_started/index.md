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
> Greenfield requires [`yarn >=3.6`.](https://yarnpkg.com/getting-started/install)

```shell
yarn install
yarn workspaces foreach --parallel --topological-dev run build
```
This might take a while so grab a ☕ while you wait.

After all packages have been build, we can spin up the Greenfield compositor shell.
```shell
yarn workspace @gfld/shell run start
```
At this point we still can't run any applications because there are none available. Let's fix that.

## Remote Applications

## Web Applications
