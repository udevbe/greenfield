//
// Created by erik on 9/15/19.
//

#ifndef APP_ENDPOINT_ENCODING_ENCODER_H
#define APP_ENDPOINT_ENCODING_ENCODER_H

struct encoder;

typedef int (*init_func)(struct encoder *, u_int32_t width, u_int32_t height);

typedef int (*resize_func)(struct encoder *, u_int32_t width, u_int32_t height);

typedef int (*deinit_func)(struct encoder *);


struct encoder {
    u_int32_t width;
    u_int32_t height;

    init_func init;
    resize_func resize;
    deinit_func deinit;
};

#endif //APP_ENDPOINT_ENCODING_ENCODER_H
