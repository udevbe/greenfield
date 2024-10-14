#!/usr/bin/env bash
set -e
cd "$(dirname "$(realpath -- "$0")")";

_SDK_DIR=${_SDK_DIR:-$(dirname "$(readlink -f "$PWD/../../build_sysroot.sh")")}
URL='https://github.com/winlibs/libjpeg.git'
BRANCH='libjpeg-turbo-2.1.0'
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

make_install() {
    source "$_SDK_DIR/sysrootlibs/sysroot-env.sh"
    mkdir -p "$SYSROOT"

    # Common compiler flags
    export CFLAGS="-O3 -fPIC -pthread -flto -msimd128 -msse -include xmmintrin.h"
    export CXXFLAGS="$CFLAGS"

    emcmake cmake . --install-prefix="$SYSROOT" -DENABLE_SHARED=0
    emmake make install
}

build() {
    ensure_repo
    source ../../emsdk/emsdk_env.sh

    pushd repo
      make_install
    popd
}

build
