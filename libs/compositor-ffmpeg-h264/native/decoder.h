#ifndef FFMPEG_H264_WASM_DECODER_H
#define FFMPEG_H264_WASM_DECODER_H

#include "libavcodec/avcodec.h"

AVCodecContext *
create_codec_context();

void
destroy_codec_context(AVCodecContext *ctx);

void
close_frame(AVFrame *frame);

AVFrame *
decode(AVCodecContext *ctx,
       uint8_t *data_in,
       int data_in_size,
       uint8_t **y_plane_out,
       uint8_t **u_plane_out,
       uint8_t **v_plane_out,
       int *width_out,
       int *height_out,
       int *stride_out
);

#endif //FFMPEG_H264_WASM_DECODER_H
