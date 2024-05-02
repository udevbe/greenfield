#!/usr/bin/env bash
set -e
cd "$(dirname "$(realpath -- "$0")")";

_SDK_DIR=${_SDK_DIR:-$(dirname "$(readlink -f "$PWD/../../build_sysroot.sh")")}
URL='https://github.com/sass/libsass.git'
BRANCH='3.6.6'
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
    # Working directories
    TARGET=$_SDK_DIR/build-sysroot
    mkdir -p "$TARGET"

    # Common compiler flags
    export CFLAGS="-O3 -fPIC -pthread"
    export CXXFLAGS="$CFLAGS"

    # Build paths
    export CPATH="$TARGET/include"
    export PKG_CONFIG_PATH="$TARGET/lib/pkgconfig"

    autoreconf -fiv
    ./configure --prefix="$TARGET" --enable-static --disable-shared -disable-tests
    make install
}

build() {
    ensure_repo
    source ../../emsdk/emsdk_env.sh
    export PKG_CONFIG_PATH="$_SDK_DIR/sysroot/lib/pkgconfig:$_SDK_DIR/sysroot/share/pkgconfig"
    export PKG_CONFIG_LIBDIR="$_SDK_DIR/sysroot"
    pushd repo
      make_install_build_pkg
    popd
}

build
