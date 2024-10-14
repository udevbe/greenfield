#!/usr/bin/env bash
set -e
cd "$(dirname "$(realpath -- "$0")")";

_SDK_DIR=${_SDK_DIR:-$(dirname "$(readlink -f "$PWD/../../build_sysroot.sh")")}
URL='https://gitlab.com/libtiff/libtiff.git'
BRANCH='v4.6.0'
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

      export CFLAGS="-O3 -fPIC -pthread -flto"
      export CXXFLAGS="$CFLAGS"

      ./autogen.sh
      emconfigure ./configure --prefix="$SYSROOT" --enable-shared=no --with-sysroot="$SYSROOT" \
        --with-zlib-include-dir="$SYSROOT/include" --with-zlib-lib-dir="$SYSROOT/lib"
      emmake make install
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
