#!/usr/bin/env bash
set -e
cd "$(dirname "$(realpath -- "$0")")"

_SDK_DIR=${_SDK_DIR:-$(dirname "$(readlink -f "$PWD/../../build_sysroot.sh")")}
URL='https://gitlab.freedesktop.org/wayland/wayland.git'
BRANCH='1.22.0'
NEED_PATCH=true

ensure_repo() {
    if [ -e repo ]
    then
      return 0
    fi
    git clone --depth 1 --branch "$BRANCH" "$URL" repo
    if [ $NEED_PATCH = true ]; then
        git -C repo apply -v --ignore-space-change --ignore-whitespace ../changes.patch
    fi
}

build() {
    ensure_repo
    pushd repo
      #scanner
      meson setup --wipe build-scanner/ -Dprefix="$_SDK_DIR/build-sysroot" --pkg-config-path="$_SDK_DIR/build-sysroot/lib/pkgconfig" --libdir=lib \
        -Dlibraries=false -Dscanner=true -Dtests=false -Ddocumentation=false -Ddtd_validation=false
      ninja -C build-scanner/ install
      #lib
      source ../../../emsdk/emsdk_env.sh
    	meson setup --wipe build/ --cross-file "${_SDK_DIR}/sysrootlibs/emscripten-toolchain.ini" --cross-file "$_SDK_DIR/sysrootlibs/emscripten-build.ini" --build.pkg-config-path="$_SDK_DIR/build-sysroot/lib/pkgconfig" \
    	  -Dlibraries=true -Dscanner=false -Dtests=false -Ddocumentation=false -Ddtd_validation=false
	    ninja -C build/ install
    popd
}

build
