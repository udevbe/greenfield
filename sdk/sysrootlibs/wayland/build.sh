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
      rm -rf build
      meson setup --wipe build/ -Dprefix="$_SDK_DIR/build-sysroot" --pkg-config-path="$_SDK_DIR/build-sysroot/lib/pkgconfig" --libdir=lib \
        -Dlibraries=false -Dscanner=true -Dtests=false -Ddocumentation=false -Ddtd_validation=false
      ninja -C build/ install
      #lib
      source ../../../emsdk/emsdk_env.sh
      export PKG_CONFIG_PATH="$_SDK_DIR/sysroot/lib/pkgconfig:$_SDK_DIR/sysroot/share/pkgconfig"
      export PKG_CONFIG_LIBDIR="$_SDK_DIR/sysroot"
    	meson setup --wipe build/ -Dprefix="$_SDK_DIR/sysroot" --pkg-config-path="$_SDK_DIR/sysroot/lib/pkgconfig:" --build.pkg-config-path="$_SDK_DIR/build-sysroot/lib/pkgconfig" --cross-file "${_SDK_DIR}/sysrootlibs/emscripten-toolchain.ini" --cross-file "$_SDK_DIR/sysrootlibs/emscripten-build.ini" \
    	  -Dlibraries=true -Dscanner=false -Dtests=false -Ddocumentation=false -Ddtd_validation=false
	    ninja -C build/ install
    popd
}

build
