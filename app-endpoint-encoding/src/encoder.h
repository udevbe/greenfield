//
// Created by erik on 9/15/19.
//

#ifndef APP_ENDPOINT_ENCODING_ENCODER_H
#define APP_ENDPOINT_ENCODING_ENCODER_H

#include <gst/gstsample.h>
// TODO use system header once everything is working (currently set to make ide happy)
#include "/home/erik/.nvm/versions/node/v12.9.1/include/node/node_api.h"

// encoder interface
struct encoder;

typedef void (*encode_callback_func)(const struct encoder *encoder, const GstSample *sample);

typedef int (*encode_func)(
        const struct encoder *encoder,
        void *buffer,
        const size_t buffer_size,
        const char *format,
        const uint32_t width,
        const uint32_t height
);

typedef int (*destroy_func)(const struct encoder *encoder);

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
