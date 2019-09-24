//
// Created by erik on 9/24/19.
//

#ifndef APP_ENDPOINT_ENCODING_PNG_GST_ENCODER_H
#define APP_ENDPOINT_ENCODING_PNG_GST_ENCODER_H

#include <gst/gstelement.h>
#include "encoder.h"

struct encoder *
png_gst_encoder_create(const char *format, uint32_t width, uint32_t height);

#endif //APP_ENDPOINT_ENCODING_PNG_GST_ENCODER_H
