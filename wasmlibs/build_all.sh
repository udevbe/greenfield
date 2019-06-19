#!/usr/bin/env bash
set -e

#######################################
# Ensures a repo is checked out.
# Arguments:
#   url: string
#   name: string
# Returns:
#   None
#######################################
ensure_repo() {
    local repo_url name
    local "${@}"

    git -C ${name} pull || git clone ${repo_url} ${name}
}

ensure_emscripten() {
    ensure_repo url='https://github.com/emscripten-core/emsdk.git' name='emsdk'
    pushd 'emsdk'
        ./emsdk install latest
        ./emsdk activate latest
        source ./emsdk_env.sh
    popd
}

build_libxkbcommon() {
    ensure_repo url='https://github.com/xkbcommon/libxkbcommon.git' name='libxkbcommon'

    pushd libxkbcommon
        ./autogen.sh
        emconfigure ./configure --disable-x11
        emmake make
        emcc -O3 .libs/libxkbcommon.so -o libxkbcommon.js -s WASM=1 -s EXPORTED_FUNCTIONS='["_malloc","_xkb_context_new","_xkb_keymap_new_from_string","_xkb_state_new","_free","_xkb_keymap_get_as_string","_xkb_state_update_key","_xkb_state_update_key","_xkb_state_serialize_mods","_xkb_state_serialize_layout","lengthBytesUTF8","stringToUTF8","Pointer_stringify"]'
    popd
}

# TODO libpixman

main() {
    ensure_emscripten
    build_libxkbcommon
}

main