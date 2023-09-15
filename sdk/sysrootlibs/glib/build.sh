#!/usr/bin/env bash
set -e
cd "$(dirname "$(realpath -- "$0")")";

_SDK_DIR=${_SDK_DIR:-$(dirname "$(readlink -f "$PWD/../../build_sysroot.sh")")}
URL='https://github.com/kleisauke/glib.git'
BRANCH='wasm-vips'
NEED_PATCH=false

ensure_repo() {
    git clone --depth 1 --branch "$BRANCH" "$URL" repo
    if [ $NEED_PATCH = true ]; then
        git -C repo apply -v --ignore-space-change --ignore-whitespace ../changes.patch
    fi
}

build() {
    git -C repo pull || ensure_repo
    pushd repo
    	pipx run meson setup build/ --cross-file "${_SDK_DIR}/sysrootlibs/emscripten-toolchain.ini" --cross-file "${_SDK_DIR}/sysrootlibs/glib/emscripten-build.ini" -Dprefix="${_SDK_DIR}/sysroot" --pkg-config-path="${_SDK_DIR}/sysroot/lib/pkgconfig" \
      -Dxattr=false -Dlibmount=disabled -Dnls=disabled -Dtests=false -Dglib_assert=false -Dglib_checks=false
	    ninja -C build/ install
    popd
}

build
