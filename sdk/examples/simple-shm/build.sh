#!/usr/bin/env bash
set -e

source ../../websdk_env.sh

#generate sources
wayland-scanner client-header < "$_SDK_DIR/sysrootlibs/wayland/xdg-shell.xml" > src/xdg-shell-client-protocol.h
wayland-scanner private-code < "$_SDK_DIR/sysrootlibs/wayland/xdg-shell.xml" > src/xdg-shell-client-protocol.c

#build
mkdir -p build
WAYLAND_FLAGS=$(gfpkg-config --cflags --libs --static wayland-client)
EXTRA_CFLAGS="-O3 -flto -Wl,-u,htons, -Wl,-u,ntohs -msimd128 -msse -includexmmintrin.h"

gfcc src/simple-shm.c src/xdg-shell-client-protocol.c $EXTRA_CFLAGS $WAYLAND_FLAGS -o build/index.html
