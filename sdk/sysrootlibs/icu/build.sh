#!/usr/bin/env bash
set -e
cd "$(dirname "$(realpath -- "$0")")"

_SDK_DIR=${_SDK_DIR:-$(dirname "$(readlink -f "$PWD/../../build_sysroot.sh")")}
URL='https://github.com/unicode-org/icu.git'
BRANCH='release-73-2'
NEED_PATCH=false

ensure_repo() {
    git clone --depth 1 --branch "$BRANCH" "$URL" repo
    if [ $NEED_PATCH = true ]; then
        git -C repo apply -v --ignore-space-change --ignore-whitespace ../changes.patch
    fi
}

make_hostbuild() {
  mkdir -p hostbuild
  pushd hostbuild
  ./../configure --disable-shared --enable-static
  make
  popd
}

make_install() {
      command -v emcc >/dev/null 2>&1 || {
        echo >&2 "emsdk could not be found.  Aborting."
        exit 1
      }

      mkdir -p wasmbuild
      pushd wasmbuild

      # Working directories
      TARGET="$_SDK_DIR/sysroot"
      mkdir -p "$TARGET"

      # Common compiler flags
      export CFLAGS="-O3 -fPIC -pthread -flto"
      export CXXFLAGS="$CFLAGS"

      # Build paths
      export CPATH="$TARGET/include"
      export PKG_CONFIG_PATH="$TARGET/lib/pkgconfig"
      export EM_PKG_CONFIG_PATH="$PKG_CONFIG_PATH"

      # Specific variables for cross-compilation
      export CHOST="wasm32-unknown-linux" # wasm32-unknown-emscripten

      emconfigure ./../configure --host=$CHOST --target=$CHOST --prefix="$TARGET" --enable-static=yes --enable-shared=no --with-data-packaging=static --enable-icu-config --enable-extras=no --enable-tools=no --enable-samples=no --enable-tests=no \
        --with-cross-build=$_SDK_DIR/sysrootlibs/icu/repo/icu4c/source/hostbuild
      emmake make install

      popd
}

build() {
    git -C repo pull || ensure_repo
    pushd repo/icu4c/source
      make_hostbuild
      make_install
    popd
}

build
