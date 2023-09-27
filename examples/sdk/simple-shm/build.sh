#!/usr/bin/env bash
set -e

source ../../../sdk/sdk_env.sh

#generate sources
wayland-scanner client-header < "$(pkg-config wayland-protocols --variable=pkgdatadir)/stable/xdg-shell/xdg-shell.xml" > src/xdg-shell-client-protocol.h
wayland-scanner private-code < "$(pkg-config wayland-protocols --variable=pkgdatadir)/stable/xdg-shell/xdg-shell.xml" > src/xdg-shell-client-protocol.c

#build
WAYLAND_FLAGS=$(pkg-config --cflags --libs --static wayland-client)
EXTRA_CFLAGS="-O3 -flto -Wl,-u,htons, -Wl,-u,ntohs -msimd128 -msse -includexmmintrin.h"

mkdir -p build
gfcc src/simple-shm.c src/xdg-shell-client-protocol.c $EXTRA_CFLAGS $WAYLAND_FLAGS -o build/simple-shm.html
