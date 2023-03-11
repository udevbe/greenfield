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

typedef void (*frame_callback_func)(void *user_data, struct encoded_frame *encoded_frame);

struct encoder;

int
frame_encoder_create(char preferred_frame_encoder[16], frame_callback_func frame_ready_callback, void *user_data,
                     struct frame_encoder **frame_encoder_pp, struct westfield_egl *westfield_egl);

int
frame_encoder_encode(struct frame_encoder **frame_encoder_pp, struct wl_resource *buffer_resource, uint32_t buffer_content_serial,
                     uint32_t buffer_creation_serial);

int
frame_encoder_request_key_unit(struct frame_encoder **frame_encoder_pp);

int
frame_encoder_destroy(struct frame_encoder **frame_encoder_pp);

int
encoded_frame_finalize(struct encoded_frame *encoded_frame);

#endif //APP_ENDPOINT_ENCODING_ENCODER_H
