//
// Created by erik on 11/11/21.
//

#ifndef APP_ENDPOINT_ENCODING_SHM_H
#define APP_ENDPOINT_ENCODING_SHM_H

#include <westfield-extra.h>

void
wayland_shm_to_gst_format(enum wl_shm_format wl_shm_format, char **gst_format);

GstBuffer *
wl_shm_buffer_to_gst_buffer(struct wl_shm_buffer *shm_buffer, uint32_t *width, uint32_t *height, char** gst_format);

#endif //APP_ENDPOINT_ENCODING_SHM_H
