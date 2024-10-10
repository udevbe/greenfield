#!/usr/bin/env bash
set -e
cd "$(dirname "$(realpath -- "$0")")";

_SDK_DIR=${_SDK_DIR:-$(dirname "$(readlink -f "$PWD/../../build_sysroot.sh")")}
URL='https://gitlab.freedesktop.org/cairo/cairo.git'
BRANCH='1.17.8'
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
    source ../../emsdk/emsdk_env.sh
    pushd repo
    	meson setup --wipe build/ --cross-file "${_SDK_DIR}/sysrootlibs/emscripten-toolchain.ini" --cross-file "${_SDK_DIR}/sysrootlibs/emscripten-build.ini" -Dprefix="${_SDK_DIR}/sysroot" --pkg-config-path="${_SDK_DIR}/sysroot/lib/pkgconfig:${_SDK_DIR}/sysroot/share/pkgconfig" \
    	  -Ddwrite=disabled -Dpng=enabled -Dquartz=disabled -Dtee=disabled -Dxcb=disabled -Dxlib=disabled -Dxlib-xcb=disabled -Dzlib=enabled \
    	  -Dtests=disabled -Dgtk2-utils=disabled -Dglib=enabled -Dspectre=disabled -Dsymbol-lookup=disabled -Dgtk_doc=false
	    ninja -C build/ install
    popd
}

build
