#!/bin/bash
set -xe

WAYLAND_BRANCH=1.19.92

clone_wayland_repo() {
    git clone --depth 1 --branch $WAYLAND_BRANCH https://gitlab.freedesktop.org/wayland/wayland.git
    pushd wayland
      meson build/ -Dscanner=true -Dlibraries=true -Dtests=false -Ddocumentation=false -Ddtd_validation=false
      ninja -C build
    popd
}

copy_wayland_server_sources() {
    mkdir -p native/src/wayland-upstream/protocol
    cp wayland/build/src/wayland-protocol.c native/src/wayland-upstream/wayland-protocol.c
    cp wayland/build/src/wayland-server-protocol.h native/src/wayland-upstream/wayland-server-protocol.h
    cp wayland/build/src/wayland-version.h native/src/wayland-upstream/wayland-version.h

    for i in connection.c wayland-os.h wayland-server-core.h wayland-util.h wayland-util.c event-loop.c wayland-os.c wayland-private.h wayland-server.h wayland-server.c wayland-shm.c
    do
      cp wayland/src/$i native/src/wayland-upstream
    done
}

patch_wayland_server() {
    pushd native/src/wayland-server
      patch -p2 < ../../changes.diff
    popd
}

generate_patched_wayland_server() {
  rm -rf wayland
  clone_wayland_repo

  rm -rf native/src/wayland-upstream
  copy_wayland_server_sources

  rm -rf wayland
  cp -a native/src/wayland-upstream native/src/wayland-server

  patch_wayland_server
}

generate_patched_wayland_server
