//
// Created by erik on 9/15/19.
//

#ifndef APP_ENDPOINT_ENCODING_ENCODER_H
#define APP_ENDPOINT_ENCODING_ENCODER_H

#include <westfield-extra.h>
#include <gst/gstsample.h>
#include <node_api.h>

// encoder data interface, we don't know it's contents
struct encoder_data;

typedef void (*encode_callback_func)(struct encoder *encoder, GstSample *sample);

struct encoder {
    struct encoder_module *encoder_module;
    struct encoder_data *encoder_data;
    char encoder_type[16];
    struct wl_client *client;

    struct callback_data {
        encode_callback_func opaque_sample_ready_callback;
        napi_threadsafe_function js_cb_ref;

        encode_callback_func alpha_sample_ready_callback;
        napi_threadsafe_function js_cb_ref_alpha;
    } callback_data;
};

struct encoder_module {
    int (*supports_buffer)(struct encoder *encoder, struct wl_resource *buffer_resource));
    int (*create)(struct encoder *encoder);
    int (*encode)(struct encoder *encoder, struct wl_resource *buffer_resource);
    int (*destroy)(struct encoder *encoder);
    int separate_alpha;
}


#endif //APP_ENDPOINT_ENCODING_ENCODER_H
