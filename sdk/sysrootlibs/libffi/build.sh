#!/usr/bin/env bash
set -e
cd "$(dirname "$(realpath -- "$0")")"

_SDK_DIR=${_SDK_DIR:-$(dirname "$(readlink -f "$PWD/../../build_sysroot.sh")")}
URL='https://github.com/udevbe/libffi-emscripten.git'
BRANCH='master'
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
    mkdir -p "$SYSROOT"

    export CFLAGS="-O3 -fPIC -pthread -flto -msimd128 -msse -include xmmintrin.h"
    export CXXFLAGS="$CFLAGS"

    autoreconf -fiv
    emconfigure ./configure --host="$CHOST" --prefix="$SYSROOT" --enable-static --disable-shared --disable-dependency-tracking \
      --disable-builddir --disable-multi-os-directory --disable-raw-api --disable-docs
    emmake make install
    cp fficonfig.h "$SYSROOT/include/"
    cp include/ffi_common.h "$SYSROOT/include/"
}

build() {
    ensure_repo
    source ../../emsdk/emsdk_env.sh
    source "$_SDK_DIR/sysrootlibs/sysroot-env.sh"
    pushd repo
      make_install
    popd
}

build
