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

This will build a number of commonly used graphics libraries, so they can be used to compile applications to WebAssembly. 
If all went well there should be 3 additional directories. `build-sysroot` has
native binaries that are required to build and use the Greenfield SDK. `emsdk` is the Emscripten SDK which the Greenfield SDK
uses. `sysroot` is a cross-compilation sysroot which contains the libraries we just build.

# Usage


