#!/usr/bin/env bash
set -e
cd "$(dirname "$(realpath -- "$0")")";

_SDK_DIR=${_SDK_DIR:-$(dirname "$(readlink -f "$PWD/../../build_wasm.sh")")}
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

build() {
    git -C repo pull || ensure_repo
    git -C repo-xkeyboard-config pull || ensure_repo_xkeyboard-config

    pushd repo-xkeyboard-config
      pipx run meson setup build/ --cross-file "${_SDK_DIR}/emscripten-toolchain.ini" --cross-file "${_SDK_DIR}/emscripten-build.ini" -Dprefix="${_SDK_DIR}/xkbcommon/repo/"
      ninja -C build/ install
    popd

    pushd repo
    	pipx run meson setup build/ --cross-file "${_SDK_DIR}/emscripten-toolchain.ini" --cross-file "${_SDK_DIR}/emscripten-build.ini" \
    	  -Denable-x11=false -Denable-docs=false -Denable-tools=false
	    ninja -C build/
	    emcc -s MODULARIZE=1 -s EXPORT_ES6=1 -s ENVIRONMENT='web' -s SINGLE_FILE=1 -O3 -flto -msimd128 -s EVAL_CTORS=2 "${_SDK_DIR}/xkbcommon/repo/build/libxkbcommon.a" -o ../../src/libxkbcommon.js --embed-file "${_SDK_DIR}/xkbcommon/repo/share/X11/xkb@/usr/local/share/X11/xkb" -s EXPORTED_RUNTIME_METHODS='["lengthBytesUTF8","stringToUTF8","UTF8ToString","FS"]' -s EXPORTED_FUNCTIONS='["_malloc", "_free", "_xkb_context_new","_xkb_keymap_new_from_string","_xkb_state_new","_free","_xkb_keymap_get_as_string","_xkb_state_update_key","_xkb_state_update_key","_xkb_state_serialize_mods","_xkb_state_serialize_layout","_xkb_keymap_new_from_names","_xkb_context_include_path_append","_xkb_keymap_mod_get_index","_xkb_keymap_led_get_index","_xkb_state_update_mask","_xkb_keymap_unref","_xkb_state_led_index_is_active"]'
    popd
}

build
