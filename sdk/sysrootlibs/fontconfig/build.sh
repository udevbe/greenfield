#!/usr/bin/env bash
set -e
cd "$(dirname "$(realpath -- "$0")")"

_SDK_DIR=${_SDK_DIR:-$(dirname "$(readlink -f "$PWD/../../build_sysroot.sh")")}
URL='https://gitlab.freedesktop.org/fontconfig/fontconfig.git'
BRANCH='2.14.2'
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
    	meson setup --wipe build/ --cross-file "${_SDK_DIR}/sysrootlibs/emscripten-toolchain.ini" --cross-file "${_SDK_DIR}/sysrootlibs/emscripten-build.ini" \
    	  -Dtests=disabled -Dtools=disabled -Dcache-build=disabled -Ddoc=disabled
	    ninja -C build/ install
    popd
}

build
