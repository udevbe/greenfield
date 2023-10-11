---
layout: default
title: SDK
nav_order: 5
has_children: false
---

# About

The Greenfield SDK allows for native Wayland applications to be compiled to WebAssembly.
The SDK is based on [Emscripten](https://emscripten.org/) and adds support for Wayland and blocking poll/epoll.

# Installation

Clone the repository if you haven't already.
```shell
git clone https://github.com/udevbe/greenfield.git
```

The SDK is located inside directory `sdk`. To use the SDK, we first need to build it. 

```shell
./build_sysroot.sh
```

This will build a sysroot with number of commonly used graphics libraries. 
If all went well there should be 3 additional directories. `build-sysroot` has
native binaries that are required to build and use the Greenfield SDK. `emsdk` is the Emscripten SDK which the Greenfield SDK
uses. `sysroot` is a cross-compilation sysroot which contains the libraries we just build.

{: .note }
> You only need to build the SDK once.

# Usage

Add the SDK binaries to the PATH of your current running shell.

```shell
source sdk_env.sh
```

This makes following programs available. Arguments for each of these are the same as in Emscripten, except for `wayland-scanner`.

```shell
gf++
gf_file_packager
gfar
gfcc
gfnm
gfranlib
wayland-scanner
```

There are also two [Meson](https://mesonbuild.com/) `--cross-file` available. These need to be specified in-order when using Meson.

```shell
--cross-file "$SDK_DIR/toolkit/meson-gf-cross.ini" --cross-file "$SDK_DIR/toolkit/meson-gf-toolchain.ini"
```

More examples are available in `examples/sdk`.
