#ifndef APP_ENDPOINT_ENCODING_GST_FRAME_ENCODER_DRM_FORMATS_H
#define APP_ENDPOINT_ENCODING_GST_FRAME_ENCODER_DRM_FORMATS_H

#include <libdrm/drm_fourcc.h>
#include <stddef.h>
#include <stdbool.h>
#include <stdint.h>

static const uint32_t dmabuf_alpha_formats[] = {
        DRM_FORMAT_ABGR1555,
        DRM_FORMAT_ABGR16161616,
        DRM_FORMAT_ABGR16161616F,
        DRM_FORMAT_ABGR2101010,
        DRM_FORMAT_ABGR4444,
        DRM_FORMAT_ABGR8888,
        DRM_FORMAT_ARGB1555,
        DRM_FORMAT_ARGB16161616,
        DRM_FORMAT_ARGB16161616F,
        DRM_FORMAT_ARGB2101010,
        DRM_FORMAT_ARGB4444,
        DRM_FORMAT_ARGB8888,
        DRM_FORMAT_AXBXGXRX106106106106,
        DRM_FORMAT_AYUV,
        DRM_FORMAT_BGRA1010102,
        DRM_FORMAT_BGRA4444,
        DRM_FORMAT_BGRA5551,
        DRM_FORMAT_BGRA8888,
        DRM_FORMAT_RGBA1010102,
        DRM_FORMAT_RGBA4444,
        DRM_FORMAT_RGBA5551,
        DRM_FORMAT_RGBA8888
};

static const size_t dmabuf_alpha_formats_size =
        sizeof(dmabuf_alpha_formats) / sizeof(dmabuf_alpha_formats[0]);

static inline bool
dmabuf_format_has_alpha(uint32_t drm_format) {
    for (int i = 0; i < dmabuf_alpha_formats_size; ++i) {
        if (dmabuf_alpha_formats[i] == drm_format) {
            return true;
        }
    }
    return false;
}

#endif //APP_ENDPOINT_ENCODING_GST_FRAME_ENCODER_DRM_FORMATS_H
