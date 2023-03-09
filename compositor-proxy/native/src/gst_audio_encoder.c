#include <gst/gstelement.h>
#include "encoder.h"

enum audio_encoding_type {
    aac,
};

struct audio_encoder {
    struct gst_audio_encoder *impl;
    audio_callback_func audio_callback;
    bool terminated;
};

struct gst_audio_encoder {
    struct audio_encoder *audio_encoder;
    const char *pipeline_definition;
    struct gst_audio_encoder_pipeline *pipeline;
};

struct gst_audio_encoder_pipeline {
    struct gst_audio_encoder *gst_audio_encoder;
    GstElement *pipeline;
    gulong app_src_pad_probe;
    bool playing;
    bool eos;
};

struct audio_encoding_result {
    struct __attribute__((__packed__)) {
        enum audio_encoding_type audio_encoding_type;
        // TODO extra metadata required for decoding can go here
    } props;
    struct {
        GstMapInfo info;
        GstBuffer *buffer;
    } sample;
};

// TODO set the pipewire node id on the pipewiresrc element
// TODO more/less/other gstreamer elements?
static const char *audio_pipeline = "pipewiresrc ! "
                                    "rawaudioparse format=pcm pcm-format=f32le sample-rate=48000 num-channels=2 ! "
                                    "audioresample ! "
                                    "audioconvert ! "
                                    "voaacenc ! "
                                    "appsink name=sink ";

void
do_gst_audio_encoder_create(audio_callback_func audio_ready_callback, void *user_data,
                            struct audio_encoder **audio_encoder_pp) {
    pid_t *client_pid = user_data;
    // TODO lookup  node id from pipewire

    struct audio_encoder *audio_encoder = *audio_encoder_pp;
    audio_encoder->audio_callback = audio_ready_callback;
    *audio_encoder_pp = audio_encoder;

    // TODO
    gst_audio_encoder_create(audio_encoder, audio_pipeline);
}

void
do_gst_audio_encoder_free(struct audio_encoder **frame_encoder_pp) {
    // TODO
}

void
do_gst_encoded_audio_finalize(struct encoded_audio *encoded_audio) {
    // TODO
}