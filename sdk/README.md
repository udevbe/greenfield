Greenfield SDK
==

The Greenfield SDK provides a set of tools and libraries to compile
native Linux Wayland applications to Web Assembly and run them directly
inside [Greenfield](https://github.com/udevbe/greenfield).

Getting Started
==
The Greenfield SDK uses [Emscripten](https://emscripten.org/) and enhances it with functionality needed to
compile Wayland applications. To use this SDK, run `./build_sysroot.sh` and wait for all packages to compile. 
This will create a new `sysroot` directory. This directory contains a set of library commonly used by UI applications.

Inside `toolkit/bin`, there are a set of binaries that can be used to build an application. 
There is also `meson-gf-cross.ini` and `meson-gf-toolchain.ini` which can be used to compile applications with the meson
build system.

Have a look inside the `examples` folder for more information.
