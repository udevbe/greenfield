#!/usr/bin/env bash
set -e
cd "$(dirname "$(realpath -- "$0")")";

_SDK_DIR=${_SDK_DIR:-$(dirname "$(readlink -f "$PWD/../../build_sysroot.sh")")}
URL='https://github.com/sass/sassc.git'
BRANCH='3.6.2'
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

make_install_build_pkg() {
    mkdir -p "$BUILD_SYSROOT"

    export CFLAGS="-O3 -fPIC -pthread"
    export CXXFLAGS="$CFLAGS"

    autoreconf -fiv
    ./configure --prefix="$BUILD_SYSROOT" --enable-static --disable-shared -disable-tests --with-libsass="$BUILD_SYSROOT"
    make install
}

build() {
    ensure_repo
    source ../../emsdk/emsdk_env.sh
    source "$_SDK_DIR/sysrootlibs/build-sysroot-env.sh"
    pushd repo
      make_install_build_pkg
    popd
}

build
