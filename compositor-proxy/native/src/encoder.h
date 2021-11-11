//
// Created by erik on 9/15/19.
//

#ifndef APP_ENDPOINT_ENCODING_ENCODER_H
#define APP_ENDPOINT_ENCODING_ENCODER_H

#include <westfield-extra.h>
#include <gst/gstsample.h>
#include <node_api.h>

// encoder interface
struct encoder;

typedef void (*encode_callback_func)(struct encoder *encoder, GstSample *sample);

typedef int (*encode_func)(struct encoder *encoder, struct wl_resource *buffer_resource);
typedef int (*destroy_func)(struct encoder *encoder);

struct encoder {
    destroy_func destroy;
    encode_func encode;

    struct callback_data {
        encode_callback_func opaque_sample_ready_callback;
        napi_threadsafe_function js_cb_ref;

        encode_callback_func alpha_sample_ready_callback;
        napi_threadsafe_function js_cb_ref_alpha;
    } callback_data;
};

#endif //APP_ENDPOINT_ENCODING_ENCODER_H
