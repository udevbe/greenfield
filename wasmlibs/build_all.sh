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
    local url name
    local "${@}"

    git -C ${name} pull || git clone ${url} ${name}
}

ensure_emscripten() {
    ensure_repo url='https://github.com/emscripten-core/emsdk.git' name='emsdk'
    pushd 'emsdk'
        ./emsdk install 1.38.36
        ./emsdk activate 1.38.36
        source ./emsdk_env.sh
    popd
}

build_libxkbcommon() {
    ensure_repo url='https://gitlab.freedesktop.org/xkeyboard-config/xkeyboard-config.git' name='xkeyboard-config'
    pushd xkeyboard-config
        ./autogen.sh --datarootdir=$(pwd)
        make all install
    popd

    ensure_repo url='https://github.com/xkbcommon/libxkbcommon.git' name='libxkbcommon'
    rm libxkbcommon.data libxkbcommon.js libxkbcommon.wasm
    pushd libxkbcommon
        ./autogen.sh
        emconfigure ./configure --disable-x11
        emmake make clean all
        emcc -s MODULARIZE_INSTANCE=1 -s DISABLE_EXCEPTION_CATCHING=0 -s ENVIRONMENT='web' -Oz -mnontrapping-fptoint --llvm-opts 3 --llvm-lto 3 .libs/libxkbcommon.so -o ../libxkbcommon.js -s WASM=1 --preload-file $(pwd)/../xkeyboard-config/X11/xkb@/usr/local/share/X11/xkb -s EXPORTED_RUNTIME_METHODS='["lengthBytesUTF8","stringToUTF8","UTF8ToString"]' -s EXPORTED_FUNCTIONS='["_malloc","_xkb_context_new","_xkb_keymap_new_from_string","_xkb_state_new","_free","_xkb_keymap_get_as_string","_xkb_state_update_key","_xkb_state_update_key","_xkb_state_serialize_mods","_xkb_state_serialize_layout","_xkb_keymap_new_from_names","_xkb_context_include_path_append"]'
    popd
}

# TODO libpixman

main() {
    ensure_emscripten
    build_libxkbcommon
}

main