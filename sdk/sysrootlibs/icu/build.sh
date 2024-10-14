#!/usr/bin/env bash
set -e
cd "$(dirname "$(realpath -- "$0")")"

_SDK_DIR=${_SDK_DIR:-$(dirname "$(readlink -f "$PWD/../../build_sysroot.sh")")}
URL='https://github.com/unicode-org/icu.git'
BRANCH='release-73-2'
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

make_hostbuild() {
  mkdir -p hostbuild
  pushd hostbuild
  ./../configure --disable-shared --enable-static
  make
  popd
}

make_install() {
      mkdir -p wasmbuild
      pushd wasmbuild

      mkdir -p "$SYSROOT"

      # Common compiler flags
      export CFLAGS="-O3 -fPIC -pthread -flto"
      export CXXFLAGS="$CFLAGS"

      emconfigure ./../configure --host="$CHOST" --target="$CHOST" --prefix="$SYSROOT" --enable-static=yes --enable-shared=no --with-data-packaging=static --enable-icu-config --enable-extras=no --enable-tools=no --enable-samples=no --enable-tests=no \
        --with-cross-build="$_SDK_DIR"/sysrootlibs/icu/repo/icu4c/source/hostbuild
      emmake make install

      popd
}

build() {
    ensure_repo
    source ../../emsdk/emsdk_env.sh
    source "$_SDK_DIR/sysrootlibs/sysroot-env.sh"
    pushd repo/icu4c/source
      make_hostbuild
      make_install
    popd
}

build
