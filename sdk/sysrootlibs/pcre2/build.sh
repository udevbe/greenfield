#!/usr/bin/env bash
set -e
cd "$(dirname "$(realpath -- "$0")")"

_SDK_DIR=${_SDK_DIR:-$(dirname "$(readlink -f "$PWD/../../build_sysroot.sh")")}
URL='https://github.com/PCRE2Project/pcre2.git'
BRANCH='pcre2-10.43'
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
      #!/usr/bin/env bash
      command -v emcc >/dev/null 2>&1 || {
        echo >&2 "emsdk could not be found.  Aborting."
        exit 1
      }

      # Working directories
      TARGET="$_SDK_DIR/sysroot"
      mkdir -p "$TARGET"

      # Common compiler flags
      # we need extra linker flags here: https://github.com/emscripten-core/emscripten/issues/16836
      export CFLAGS="-O3 -fPIC -pthread -flto -msimd128 -msse"
      export CXXFLAGS="$CFLAGS"

      # Build paths
      export CPATH="$TARGET/include"
      export PKG_CONFIG_PATH="$TARGET/lib/pkgconfig"
      export EM_PKG_CONFIG_PATH="$PKG_CONFIG_PATH"

      # Specific variables for cross-compilation
      export CHOST="wasm32-unknown-linux" # wasm32-unknown-emscripten

      autoreconf -fiv
      emconfigure ./configure --host=$CHOST --prefix="$TARGET" --enable-static --disable-shared
      emmake make install
}

build() {
    ensure_repo
    source ../../emsdk/emsdk_env.sh
    export PKG_CONFIG_PATH="$_SDK_DIR/sysroot/lib/pkgconfig:$_SDK_DIR/sysroot/share/pkgconfig"
    export PKG_CONFIG_LIBDIR="$_SDK_DIR/sysroot"
    pushd repo
      make_install
    popd
}

build
