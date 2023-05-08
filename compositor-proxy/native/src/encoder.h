//
// Created by erik on 9/15/19.
//

#ifndef APP_ENDPOINT_ENCODING_ENCODER_H
#define APP_ENDPOINT_ENCODING_ENCODER_H

#include "westfield.h"

// encoder data interface, we don't know its contents
struct frame_encoder;

struct encoded_frame {
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

struct encoder;

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

#endif //APP_ENDPOINT_ENCODING_ENCODER_H
