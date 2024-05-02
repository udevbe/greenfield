#!/usr/bin/env bash
set -e
cd "$(dirname "$(realpath -- "$0")")";

_SDK_DIR=${_SDK_DIR:-$(dirname "$(readlink -f "$PWD/../../build_sysroot.sh")")}
URL='https://gitlab.gnome.org/GNOME/gtk.git'
BRANCH='4.10.5'
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
    export PATH=$PATH:$_SDK_DIR/build-sysroot/bin
    pushd repo
    	meson setup --wipe build/ --cross-file "${_SDK_DIR}/sysrootlibs/emscripten-toolchain.ini" --cross-file "${_SDK_DIR}/sysrootlibs/pango/emscripten-build.ini" -Dprefix="${_SDK_DIR}/sysroot" --pkg-config-path="${_SDK_DIR}/sysroot/lib/pkgconfig:${_SDK_DIR}/sysroot/share/pkgconfig" \
    	  -Dx11-backend=false -Dwayland-backend=true -Dbroadway-backend=false -Dwin32-backend=false -Dmacos-backend=false -Dmedia-gstreamer=disabled -Dprint-cups=disabled -Dvulkan=disabled \
    	  -Dcloudproviders=disabled -Df16c=disabled -Dintrospection=disabled -Dbuild-testsuite=false -Dbuild-tests=false -Ddemos=false -Dbuild-examples=false -Dc_args="-I${_SDK_DIR}/sysroot/include"
	    ninja -C build/ install
    popd
}

build
