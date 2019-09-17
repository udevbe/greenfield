//
// Created by erik on 9/15/19.
//

#ifndef APP_ENDPOINT_ENCODING_ENCODER_H
#define APP_ENDPOINT_ENCODING_ENCODER_H


struct encoding_callback_data;

typedef void (*encode_callback_func)(const struct encoding_callback_data *encoding_callback_data, const void *frame);

struct encoding_callback_data {
    encode_callback_func encode_callback;
    void *user_data;

    encode_callback_func alpha_encode_callback;
    void *alpha_user_data;
};

// encoder interface
struct encoder;

typedef int (*encode_func)(
        const struct encoder *encoder,
        void *buffer,
        const uint32_t bufferWidth,
        const uint32_t bufferHeight,
        struct encoding_callback_data *encoding_callback_data
);

typedef int (*destroy_func)(const struct encoder *encoder);

struct encoder {
    destroy_func destroy;
    encode_func encode;
};

#endif //APP_ENDPOINT_ENCODING_ENCODER_H
