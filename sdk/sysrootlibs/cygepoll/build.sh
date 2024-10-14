#!/usr/bin/env bash
set -e
cd "$(dirname "$(realpath -- "$0")")"

_SDK_DIR=${_SDK_DIR:-$(dirname "$(readlink -f "$PWD/../../build_sysroot.sh")")}
URL='https://github.com/Zubnix/cygepoll.git'
BRANCH='master'
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

make_install() {
    mkdir -p "$SYSROOT"

    export CFLAGS="-O3 -fPIC -pthread -flto -msimd128 -msse -include xmmintrin.h -lrt"
    export CXXFLAGS="$CFLAGS"

    autoreconf -fiv
    emconfigure ./configure --host="$CHOST" --prefix="$SYSROOT" --enable-static --disable-shared
    emmake make install
}

build() {
    ensure_repo
    source ../../emsdk/emsdk_env.sh

    SYSROOT="$_SDK_DIR/sysroot"
    export CHOST="wasm32-unknown-linux" # wasm32-unknown-emscripten
    export CPATH="${TARGET}/include"
    export PKG_CONFIG_PATH="${SYSROOT}/lib/pkgconfig"
    export EM_PKG_CONFIG_PATH="$PKG_CONFIG_PATH"

    pushd repo
      make_install
    popd
}

build
