//
// Created by erik on 9/15/19.
//

#ifndef APP_ENDPOINT_ENCODING_ENCODER_H
#define APP_ENDPOINT_ENCODING_ENCODER_H

#include <gst/gstsample.h>
#include "/home/erik/.nvm/versions/node/v12.9.1/include/node/node_api.h"

struct encoding_callback_data;

typedef void (*encode_callback_func)(struct encoding_callback_data *encoding_callback_data,
                                     GstSample *sample);

struct encoding_callback_data {
    encode_callback_func encoder_opaque_sample_ready_callback;
    napi_threadsafe_function js_cb_ref;

    encode_callback_func encoder_alpha_sample_ready_callback;
    napi_threadsafe_function js_cb_ref_alpha;
};

// encoder interface
struct encoder;

typedef int (*encode_func)(
        const struct encoder *encoder,
        void *buffer,
        const char *format,
        const uint32_t width,
        const uint32_t height,
        struct encoding_callback_data *encoding_callback_data
);

typedef int (*destroy_func)(const struct encoder *encoder);

struct encoder {
    destroy_func destroy;
    encode_func encode;
};

#endif //APP_ENDPOINT_ENCODING_ENCODER_H
