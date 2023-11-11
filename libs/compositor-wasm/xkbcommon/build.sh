#!/usr/bin/env bash
set -e
cd "$(dirname "$(realpath -- "$0")")";

PACKAGE_DIR=${PACKAGE_DIR:-$(dirname "$(readlink -f "$PWD/../../build_wasm.sh")")}
URL='https://github.com/xkbcommon/libxkbcommon.git'
BRANCH='xkbcommon-1.5.0'
NEED_PATCH=true

ensure_repo() {
    git clone --depth 1 --branch "$BRANCH" "$URL" repo
    if [ $NEED_PATCH = true ]; then
        git -C repo apply -v --ignore-space-change --ignore-whitespace ../changes.patch
    fi
}

ensure_repo_xkeyboard-config() {
      git clone --depth 1 --branch "master" "https://gitlab.freedesktop.org/xkeyboard-config/xkeyboard-config.git" repo-xkeyboard-config
}

ensure_repo_xml2() {
      git clone --depth 1 --branch "v2.11.5" "https://gitlab.gnome.org/GNOME/libxml2.git" repo-xml2
}

build() {
    [ -e repo ] || ensure_repo
    [ -e repo-xkeyboard-config ] || ensure_repo_xkeyboard-config
    [ -e repo-xml2 ] || ensure_repo_xml2

    pushd repo-xml2
      source ../../emsdk/emsdk_env.sh

      # Working directories
      TARGET="$PACKAGE_DIR/xkbcommon/repo/"
      mkdir -p "$TARGET"

      # Common compiler flags
      # we need extra linker flags here: https://github.com/emscripten-core/emscripten/issues/16836
      export CFLAGS="-O3 -fPIC -pthread -flto -msimd128 -msse -include xmmintrin.h -Wl,-u,ntohs -Wl,-u,htons -Wl,-u,htonl"
      export CXXFLAGS="$CFLAGS"

      # Build paths
      export CPATH="$TARGET/include"
      export PKG_CONFIG_PATH="$TARGET/lib/pkgconfig"
      export EM_PKG_CONFIG_PATH="$PKG_CONFIG_PATH"

      # Specific variables for cross-compilation
      export CHOST="wasm32-unknown-linux" # wasm32-unknown-emscripten

      ./autogen.sh
      autoreconf -fiv
      emconfigure ./configure --host=$CHOST --prefix="$TARGET" --enable-static --disable-shared --with-python=no
      emmake make install
    popd

    pushd repo-xkeyboard-config
      pipx run meson setup --wipe build/ --cross-file "${PACKAGE_DIR}/emscripten-toolchain.ini" --cross-file "${PACKAGE_DIR}/emscripten-build.ini" -Dprefix="${PACKAGE_DIR}/xkbcommon/repo/" -Dxkb-base="/usr/share"
      ninja -C build/ install
    popd

    pushd repo
    	pipx run meson setup --wipe build/ --cross-file "${PACKAGE_DIR}/emscripten-toolchain.ini" --cross-file "${PACKAGE_DIR}/emscripten-build.ini" \
    	  -Denable-x11=false -Denable-docs=false -Denable-tools=false -Denable-xkbregistry=true -Dxkb-config-root=/usr/share/X11/xkb -Dxkb-config-extra-path=/usr/share/X11/xkb
	    ninja -C build/
	    emcc -s MODULARIZE=1 -s EXPORT_ES6=1 -s ENVIRONMENT='web' -s SINGLE_FILE=1 -O3 -flto -msimd128 -s EVAL_CTORS=2 "${PACKAGE_DIR}/xkbcommon/repo/build/libxkbcommon.a" -o ../../src/libxkbcommon.js --embed-file "${PACKAGE_DIR}/xkbcommon/repo/share/X11@/usr/share/X11" -s EXPORTED_RUNTIME_METHODS='["lengthBytesUTF8","stringToUTF8","UTF8ToString","FS"]' -s EXPORTED_FUNCTIONS='["_malloc", "_free", "_xkb_context_new","_xkb_keymap_new_from_string","_xkb_state_new","_free","_xkb_keymap_get_as_string","_xkb_state_update_key","_xkb_state_update_key","_xkb_state_serialize_mods","_xkb_state_serialize_layout","_xkb_keymap_new_from_names","_xkb_context_include_path_append","_xkb_keymap_mod_get_index","_xkb_keymap_led_get_index","_xkb_state_update_mask","_xkb_keymap_unref","_xkb_state_led_index_is_active"]'
    popd
}

build
