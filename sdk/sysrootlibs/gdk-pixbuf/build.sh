#!/usr/bin/env bash
set -e
cd "$(dirname "$(realpath -- "$0")")";

_SDK_DIR=${_SDK_DIR:-$(dirname "$(readlink -f "$PWD/../../build_sysroot.sh")")}
URL='https://gitlab.gnome.org/GNOME/gdk-pixbuf.git'
BRANCH='gdk-pixbuf-2-40'
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
    export PKG_CONFIG_PATH="$_SDK_DIR/sysroot/lib/pkgconfig:$_SDK_DIR/sysroot/share/pkgconfig"
    export PKG_CONFIG_LIBDIR="$_SDK_DIR/sysroot"
    pushd repo
    	meson setup --wipe build/ --cross-file "${_SDK_DIR}/sysrootlibs/emscripten-toolchain.ini" --cross-file "${_SDK_DIR}/sysrootlibs/emscripten-build.ini" -Dprefix="${_SDK_DIR}/sysroot" --pkg-config-path="${_SDK_DIR}/sysroot/lib/pkgconfig:${_SDK_DIR}/sysroot/share/pkgconfig" \
    	  -Dtiff=true -Djpeg=true -Dx11=false -Dgir=false -Dman=false -Dinstalled_tests=false -Dgio_sniffing=false -Dbuiltin_loaders=all
	    ninja -C build/ install
    popd
}

build
