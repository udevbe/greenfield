//
// Created by erik on 9/15/19.
//

#ifndef APP_ENDPOINT_ENCODING_ENCODER_H
#define APP_ENDPOINT_ENCODING_ENCODER_H

#include "westfield.h"
// #include <glib.h>
// encoder data interface, we don't know its contents
struct frame_encoder;
struct audio_encoder;

struct encoded_frame {
    void *encoded_data;
    uint32_t size;
};

// Struct that wraps encoded audio data with an extra size member.
struct encoded_audio {
    void *encoded_data;
    uint32_t size;
};

enum frame_buffer_type {
    SHM,
    DMA,
};

union frame_buffer {
    struct {
        enum frame_buffer_type type;
        uint32_t buffer_id;

        void (*discard_cb)(const union frame_buffer *frame_buffer);
    } base;

    struct {
        enum frame_buffer_type type;
        uint32_t buffer_id;

        void (*discard_cb)(const union frame_buffer *frame_buffer);

        uint32_t width;
        uint32_t height;
        enum wl_shm_format buffer_format;
        void *buffer_data;
        uint32_t buffer_stride;
        struct wl_shm_pool *pool;
    } shm;

    struct {
        enum frame_buffer_type type;
        uint32_t buffer_id;

        void (*discard_cb)(const union frame_buffer *frame_buffer);

        uint32_t width;
        uint32_t height;
        struct dmabuf_attributes *attributes;
    } dma;
};

typedef void (*frame_callback_func)(void *user_data, struct encoded_frame *encoded_frame);
typedef void (*audio_callback_func)(void *user_data, struct encoded_audio *encoded_audio);

struct gst_audio_encoder;

// struct audio_encoder {
//     struct gst_audio_encoder *impl;
//     audio_callback_func audio_callback;
//     void *user_data;
//     GQueue *audio_encoding_results;
//     bool terminated;
// };

int
frame_encoder_create(char preferred_frame_encoder[16], frame_callback_func frame_ready_callback, void *user_data,
                     struct frame_encoder **frame_encoder_pp, struct westfield_egl *westfield_egl);

int
frame_encoder_encode(struct frame_encoder **frame_encoder_pp, const union frame_buffer *frame_buffer,
                     uint32_t buffer_content_serial,
                     uint32_t buffer_creation_serial);

int
frame_encoder_request_key_unit(struct frame_encoder **frame_encoder_pp);

int
frame_encoder_destroy(struct frame_encoder **frame_encoder_pp);

int
encoded_frame_finalize(struct encoded_frame *encoded_frame);

// Create a new audio encoder context. Accepts a user_data pointer so arbitrary data can be passed to the underlying audio encoder implementation.
// The callback function pointer will be called when an encoded audio sample is generated.
// The double pointer audio_encoder struct will hold the newly created audio encoder.
int
audio_encoder_create(audio_callback_func audio_ready_callback, void *user_data,
                     struct audio_encoder **audio_encoder_pp);

void
audio_encoder_recreate_pipeline(int PW_node_id, char* PID);

int
audio_encoder_encode(struct audio_encoder **audio_encoder_pp);
// Destroy a previously created audio encoder.
int
audio_encoder_destroy(struct audio_encoder **audio_encoder_pp);

// Free memory allocated for the encoded_audio
int
encoded_audio_finalize(struct encoded_audio *encoded_audio);


#endif //APP_ENDPOINT_ENCODING_ENCODER_H
