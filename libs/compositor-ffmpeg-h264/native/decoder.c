#include <stdio.h>
#include "decoder.h"
#include "libavcodec/avcodec.h"
#include "libavutil/imgutils.h"

AVCodecContext *
create_codec_context() {
    const AVCodec *codec = avcodec_find_decoder(AV_CODEC_ID_H264);
    AVCodecContext *ctx = avcodec_alloc_context3(codec);
    if (avcodec_open2(ctx, codec, NULL) < 0) {
        avcodec_free_context(&ctx);
        return 0;
    }

    return ctx;
}

void
destroy_codec_context(AVCodecContext *ctx) {
    avcodec_free_context(&ctx);
}

void
close_frame(AVFrame *frame) {
    av_frame_unref(frame);
    av_frame_free(&frame);
}

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
) {
    AVFrame *frame = av_frame_alloc();
    AVPacket avpkt;
    int ret;

    avpkt.data = data_in;
    avpkt.size = data_in_size;

    ret = avcodec_send_packet(ctx, &avpkt);
    if (ret != 0) {
        // TODO handle error codes?
        return NULL;
    }

    ret = avcodec_receive_frame(ctx, frame);
    if (ret != 0) {
        // TODO handle error codes?
        return NULL;
    }

    *y_plane_out = frame->data[0];
    *u_plane_out = frame->data[1];
    *v_plane_out = frame->data[2];
    *stride_out = frame->linesize[0];
    *width_out = frame->width;
    *height_out = frame->height;

    return frame;
}
