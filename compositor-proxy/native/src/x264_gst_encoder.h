//
// Created by erik on 9/14/19.
//

#ifndef APP_ENDPOINT_ENCODING_X264_GST_ENCODER_H
#define APP_ENDPOINT_ENCODING_X264_GST_ENCODER_H

#include <gst/gstelement.h>
#include "encoder.h"

struct encoder *
x264_gst_alpha_encoder_create(const char *format, uint32_t width, uint32_t height);

struct encoder *
x264_gst_encoder_create(char *format, uint32_t width, uint32_t height);

#endif //APP_ENDPOINT_ENCODING_X264_GST_ENCODER_H
