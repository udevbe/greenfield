#!/usr/bin/env bash
set -e
cd "$(dirname "$(realpath -- "$0")")";

_SDK_DIR=${_SDK_DIR:-$(dirname "$(readlink -f "$PWD/../../build_sysroot.sh")")}
URL='https://github.com/udevbe/glib-emscripten.git'
BRANCH='2.80.2-emscripten'
NEED_PATCH=false

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
    	meson setup --wipe build/ -Dprefix="$_SDK_DIR/sysroot" --cross-file "${_SDK_DIR}/sysrootlibs/emscripten-toolchain.ini" --cross-file "${_SDK_DIR}/sysrootlibs/emscripten-build.ini" \
      -Dxattr=false -Dlibmount=disabled -Dnls=disabled -Dtests=false -Dglib_assert=false -Dglib_checks=false
	    ninja -C build/ install
    popd
}

build
