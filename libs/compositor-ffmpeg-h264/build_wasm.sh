#!/usr/bin/env bash
set -e

EMSDK_VERSION="3.1.46"
FFMPEG_VERSION="n5.1.2"

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

  git -C "${name}" pull || git clone "${url}" "${name}"
}

ensure_emscripten() {
  ensure_repo url='https://github.com/emscripten-core/emsdk.git' name='emsdk'
  pushd 'emsdk'
  ./emsdk update-tags
  ./emsdk install ${EMSDK_VERSION}
  ./emsdk activate ${EMSDK_VERSION}
  source ./emsdk_env.sh
  popd
}

ensure_ffmpeg() {
  ensure_repo url='git@github.com:FFmpeg/FFmpeg.git' name='ffmpeg'
}

build() {
  rm -rf ffmpeg-h264.js ffmpeg-h264.wasm ffmpeg-h264.worker.js

  ensure_ffmpeg
  pushd ffmpeg
  git checkout "$FFMPEG_VERSION"

  echo "Building ffmpeg..."

  emconfigure ./configure --cc="emcc" --ar="emar" --prefix="$(pwd)"/../ffmpeg-build \
    --enable-cross-compile --target-os=none --arch=x86_32 --cpu=generic \
    --enable-gpl --enable-version3 --enable-nonfree --disable-avdevice --disable-avformat --disable-avfilter \
    --disable-swscale --disable-swresample \
    --disable-programs --disable-logging --disable-everything --enable-decoder=h264 \
    --disable-debug --disable-w32threads \
    --disable-asm --disable-doc --disable-devices --disable-network \
    --disable-hwaccels --disable-parsers --disable-bsfs \
    --disable-protocols --disable-indevs --disable-outdevs \
    --enable-lto --disable-sdl2 --disable-cuda-llvm --disable-iconv --disable-postproc --disable-runtime-cpudetect \
    --disable-autodetect --pkg-config-flags="--static" --nm=emnm --ranlib=emranlib --cxx=em++ --dep-cc=emcc
  emmake make
  emmake make install
  git checkout master

  popd
  echo "Running Emscripten..."
  emcc native/decoder.c -I./ffmpeg-build/include -O3 -flto -msimd128 -Wno-deprecated-declarations -Wno-pointer-sign -Wno-implicit-int-float-conversion -Wno-switch -Wno-parentheses -Qunused-arguments -c -o ffmpeg-build/decoder.bc
  EXPORTED_FUNCTIONS='["_malloc","_free","_create_codec_context","_destroy_codec_context","_decode","_close_frame"]'
  EXPORTED_RUNTIME_METHODS='["getValue"]'
  emcc ffmpeg-build/decoder.bc ffmpeg-build/lib/libavcodec.a ffmpeg-build/lib/libavutil.a -O3 -flto -msimd128 -Wno-deprecated-declarations -Wno-pointer-sign -Wno-implicit-int-float-conversion -Wno-switch -Wno-parentheses -Qunused-arguments -L"$(pwd)"/dist/lib -s INITIAL_MEMORY=32MB -s MAXIMUM_MEMORY=128MB -s EVAL_CTORS=2 -fno-rtti -fno-exceptions --memory-init-file 0 -s ENVIRONMENT='worker' -s NO_EXIT_RUNTIME=1 -s NO_FILESYSTEM=1 -s INVOKE_RUN=0 -s DOUBLE_MODE=0 -s ALLOW_MEMORY_GROWTH=1 -s MODULARIZE=1 -s EXPORT_ES6=1 -s SINGLE_FILE=1 -o ./src/libav-h264.js -s EXPORTED_FUNCTIONS="$EXPORTED_FUNCTIONS" -s EXPORTED_RUNTIME_METHODS="$EXPORTED_RUNTIME_METHODS"

  echo "Finished Build"
}

main() {
  ensure_emscripten
  build
}

main
