//
// Created by erik on 9/15/19.
//

#ifndef APP_ENDPOINT_ENCODING_ENCODER_H
#define APP_ENDPOINT_ENCODING_ENCODER_H

#include <westfield-extra.h>
#include <node_api.h>

// encoder data interface, we don't know its contents
struct encoder;
enum encoding_type {
    h264,
    png
};

struct encoded_frame {
        struct encoder *encoder;
        size_t encoded_data_size;
        void* encoded_data;
};
typedef void (*encode_callback_func)(struct encoder *encoder, struct encoded_frame *encoded_frame);

struct encoder_itf {
    int (*supports_buffer)(struct encoder *encoder, struct wl_resource *buffer_resource);
    int (*create)(struct encoder *encoder);
    int (*encode)(struct encoder *encoder, struct wl_resource *buffer_resource, uint32_t *buffer_width, uint32_t *buffer_height);
    void (*destroy)(struct encoder *encoder);
    void (*finalize_encoded_frame)(struct encoder *encoder, struct encoded_frame *encoded_frame);
    int separate_alpha;
};

struct encoder {
    struct encoder_itf itf;
    void *impl;
    char preferred_encoder[16]; // "x264" or "nvh264"
    enum encoding_type encoding_type;
    struct wl_client *client;

    struct callback_data {
        encode_callback_func opaque_sample_ready_callback;
        napi_threadsafe_function js_cb_ref;

        encode_callback_func alpha_sample_ready_callback;
        napi_threadsafe_function js_cb_ref_alpha;
    } callback_data;
};


#endif //APP_ENDPOINT_ENCODING_ENCODER_H
