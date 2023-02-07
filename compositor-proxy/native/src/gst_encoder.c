#include "westfield.h"
#include <glib.h>
#include <gst/gst.h>
#include <gst/gl/gstglfuncs.h>
#include <gst/gl/gstglcontext.h>
#include <gst/gl/gstglwindow.h>
#include <gst/gl/gstglbasememory.h>
#include <gst/gl/egl/gstgldisplay_egl.h>
#include <gst/gl/egl/gstgldisplay_egl_device.h>
#include <gst/app/gstappsrc.h>
#include <gst/app/gstappsink.h>
#include <graphene-1.0/graphene-gobject.h>
#include <assert.h>
#include <stdbool.h>
#include <EGL/egl.h>
#include <libdrm/drm_fourcc.h>
#include <unistd.h>
#include <GL/gl.h>
#include <gst/gl/gstglmemory.h>
#include <gst/gl/gstglutils.h>
#include <gst/gl/gstglsyncmeta.h>
#include <gst/gl/egl/gstglmemoryegl.h>
#include "encoder.h"
#include "wlr_drm.h"
#include "wlr_linux_dmabuf_v1.h"

#define FPS 60
#define GF_BUFFER_CONTENT_SERIAL_META "BUFFER_CONTENT_SERIAL"
const GstMetaInfo *gfBufferContentSerialMetaInfo = NULL;

static const char *opaque_fragment_shader =
        "#version 330\n"
        "in vec2 v_texcoord;\n"
        "out vec4 color;\n"
        "uniform sampler2D tex;\n"
        "void main () {\n"
        "        color = texture2D(tex, v_texcoord);\n"
        "}";

static const char *alpha_fragment_shader =
        "#version 330\n"
        "in vec2 v_texcoord;\n"
        "out vec4 color;\n"
        "uniform sampler2D tex;\n"
        "void main () {\n"
        "        vec4 pix = texture2D(tex, v_texcoord);\n"
        "        color = vec4(pix.a, pix.a, pix.a, 0.);\n"
        "}";

static const char *vertex_shader =
        "#version 330\n"
        "in vec4 a_position;\n"
        "in vec2 a_texcoord;\n"
        "out vec2 v_texcoord;\n"
        "uniform mat4 u_transformation;\n"
        "void main() {\n"
        "    gl_Position = u_transformation * vec4(a_position.x, a_position.y, 0, 1);\n"
        "    v_texcoord = a_texcoord;\n"
        "}";

enum encoding_type {
    h264,
    png
};

struct encoding_result {
    struct __attribute__((__packed__)) {
        uint32_t buffer_id;
        uint32_t buffer_creation_serial;
        uint32_t buffer_content_serial;
        enum encoding_type encoding_type;
        uint32_t width;
        uint32_t height;
        uint32_t coded_width;
        uint32_t coded_height;
    } props;
    bool has_split_alpha;
    struct {
        GstMapInfo info;
        GstBuffer *buffer;
    } sample;
    struct {
        GstMapInfo info;
        GstBuffer *buffer;
    } alpha_sample;
    GMutex mutex;
};

struct encoder_description {
    uint8_t width_multiple;
    uint8_t height_multiple;
    uint16_t min_width;
    uint16_t min_height;
    const char *name;
    enum encoding_type encoding_type;
    const char *pipeline_definition;
    bool split_alpha;
};

struct encoder {
    struct gst_encoder *impl;
    char preferred_encoder[16]; // "x264" or "nvh264"

    frame_callback_func frame_callback;
    GQueue *encoding_results;
    void *user_data;
    struct westfield_egl *westfield_egl;
};

struct gst_encoder_pipeline {
    struct gst_encoder *gst_encoder;
    GstElement *pipeline;
    gulong app_src_pad_probe;
    bool playing;
    bool eos;

    // configured pipeline sizes for buffers currently traveling through the pipeline
    uint32_t width;
    uint32_t height;
    uint32_t coded_width;
    uint32_t coded_height;
};

struct gst_encoder {
    struct encoder *encoder;
    const struct encoder_description *description;
    struct gst_encoder_pipeline *alpha_pipeline;
    struct gst_encoder_pipeline *opaque_pipeline;

    GstGLDisplay *wrapped_gst_gl_display;
    GstGLContext *wrapped_gst_gl_context;
    GstGLContext *shared_gst_gl_context;
};

struct shmbuf_support_format {
    const bool has_alpha;
    enum wl_shm_format wl_shm_format;
    const char *gst_format_string;
    const GstVideoFormat gst_video_format;
};

static const struct shmbuf_support_format shmbuf_supported_formats[] = {
        {
                .has_alpha = true,
                .wl_shm_format = WL_SHM_FORMAT_ARGB8888,
                .gst_format_string = "BGRA",
                .gst_video_format = GST_VIDEO_FORMAT_BGRA,
        },
        {
                .has_alpha = true,
                .wl_shm_format = WL_SHM_FORMAT_XRGB8888,
                .gst_format_string = "BGRx",
                .gst_video_format = GST_VIDEO_FORMAT_BGRx,
        },
        {
                .has_alpha = false,
                .wl_shm_format = WL_SHM_FORMAT_YUV420,
                .gst_format_string = "I420",
                .gst_video_format = GST_VIDEO_FORMAT_I420,
        },
        {
                .has_alpha = false,
                .wl_shm_format = WL_SHM_FORMAT_NV12,
                .gst_format_string = "NV12",
                .gst_video_format = GST_VIDEO_FORMAT_NV12,
        },
        {
                .has_alpha = false,
                .wl_shm_format = WL_SHM_FORMAT_YUV444,
                .gst_format_string = "Y444",
                .gst_video_format = GST_VIDEO_FORMAT_Y444,
        },
        {
                .has_alpha = false,
                .wl_shm_format = WL_SHM_FORMAT_NV21,
                .gst_format_string = "NV21",
                .gst_video_format = GST_VIDEO_FORMAT_NV21,
        },
};

struct dmabuf_support_format {
    const bool has_alpha;
    const uint32_t drm_format;
};

static const struct dmabuf_support_format dmabuf_supported_formats[] = {
        {
                .has_alpha = true,
                .drm_format = DRM_FORMAT_ARGB8888,
        },
        {
                .has_alpha = true,
                .drm_format = DRM_FORMAT_RGBA8888,
        },
        {
                .has_alpha = true,
                .drm_format = DRM_FORMAT_BGRA8888,
        },
        {
                .has_alpha = false,
                .drm_format =DRM_FORMAT_RGBX8888,
        },
        {
                .has_alpha = false,
                .drm_format =DRM_FORMAT_BGRX8888,
        },
        {
                .has_alpha = false,
                .drm_format =DRM_FORMAT_RGB888,
        },
        {
                .has_alpha = true,
                .drm_format = DRM_FORMAT_ABGR8888,
        },
        {
                .has_alpha = false,
                .drm_format = DRM_FORMAT_BGR888,
        },
        {
                .has_alpha = false,
                .drm_format = DRM_FORMAT_XBGR8888,
        },
        {
                .has_alpha = false,
                .drm_format = DRM_FORMAT_XRGB8888,
        },
        {
                .has_alpha = false,
                .drm_format = DRM_FORMAT_RGB565,
        },
        {
                .has_alpha = false,
                .drm_format = DRM_FORMAT_YUV444,
        },
        {
                .has_alpha = false,
                .drm_format = DRM_FORMAT_YUV420,
        },
        {
                .has_alpha = false,
                .drm_format = DRM_FORMAT_NV12,
        },
        {
                .has_alpha = false,
                .drm_format = DRM_FORMAT_NV21,
        }
        // TODO more
//        return "GBRA";
//        return "GBR";
//        return "RGBP";
//        return "BGRP";
//        return "YV12";
//        return "Y42B";
//        return "Y41B";
//        return "NV16";
//        return "NV61";
//        return "YUY2";
//        return "UYVY";
//        return "Y210";
//        return "AYUV";
//        return "VUYA";
//        return "Y410";
//        return "GRAY8";
//        return "GRAY16_LE";
//        return "GRAY16_BE";
//        return "BGR16";
//        return "ARGB64";
//        return "A420";
//        return "AV12";
//        return "NV12_16L32S";
//        return "NV12_4L4";
//        return "BGR10A2_LE";
//        return "RGB10A2_LE";
//        return "P010_10LE";
//        return "P012_LE";
//        return "P016_LE";
//        return "Y212_LE";
//        return "Y412_LE";
};

static void
gst_encoder_ensure_gst_gl_setup(struct gst_encoder *gst_encoder) {
    EGLDeviceEXT egl_device = westfield_egl_get_device(gst_encoder->encoder->westfield_egl);
    EGLDisplay egl_display = westfield_egl_get_display(gst_encoder->encoder->westfield_egl);

    if (gst_encoder->wrapped_gst_gl_display == NULL) {
        GstGLDisplay *gst_gl_display;
        if (egl_device) {
            gst_gl_display = GST_GL_DISPLAY(gst_gl_display_egl_device_new_with_egl_device(egl_device));
        } else {
            gst_gl_display = GST_GL_DISPLAY(gst_gl_display_egl_new_with_egl_display(egl_display));
        }

        gst_encoder->wrapped_gst_gl_display = gst_gl_display;
    }

    if (gst_encoder->wrapped_gst_gl_context == NULL) {
        EGLContext egl_context = westfield_egl_get_context(gst_encoder->encoder->westfield_egl);
        if (egl_context == NULL) {
            g_warning("Failed to find EGL context.");
            return;
        }
        eglMakeCurrent(egl_display, EGL_NO_SURFACE, EGL_NO_SURFACE, egl_context);

        gst_encoder->wrapped_gst_gl_context = gst_gl_context_new_wrapped(gst_encoder->wrapped_gst_gl_display,
                                                                         (guintptr) egl_context,
                                                                         GST_GL_PLATFORM_EGL,
                                                                         GST_GL_API_OPENGL);
        gst_gl_context_activate(gst_encoder->wrapped_gst_gl_context, TRUE);
        gst_gl_context_fill_info(gst_encoder->wrapped_gst_gl_context, NULL);
    }

    if (gst_encoder->shared_gst_gl_context == NULL) {
        GstGLContext *shared_gst_gl_context;
        /* Create a new non-wrapped local GstGlContext to share with other elements. */
        GError *err = NULL;
        if (!gst_gl_display_create_context(gst_encoder->wrapped_gst_gl_display,
                                           gst_encoder->wrapped_gst_gl_context,
                                           &shared_gst_gl_context,
                                           &err)) {
            g_error("Failed to create GstGLContex context: %s", err->message);
        }

        gst_gl_display_add_context(gst_encoder->wrapped_gst_gl_display, shared_gst_gl_context);
        gst_encoder->shared_gst_gl_context = shared_gst_gl_context;
    }
}

void
encoding_result_free(struct encoding_result *encoding_result) {
    g_mutex_clear(&encoding_result->mutex);
    if (encoding_result->sample.buffer) {
        gst_buffer_unmap(encoding_result->sample.buffer, &encoding_result->sample.info);
        gst_buffer_unref(encoding_result->sample.buffer);
    }
    if (encoding_result->alpha_sample.buffer) {
        gst_buffer_unmap(encoding_result->alpha_sample.buffer, &encoding_result->alpha_sample.info);
        gst_buffer_unref(encoding_result->alpha_sample.buffer);
    }
    free(encoding_result);
}

struct encoded_frame *
encoding_result_to_encoded_frame(struct encoding_result *encoding_result, bool separate_alpha) {
    gsize opaque_length, alpha_length, offset, encoded_frame_blob_size;
    struct encoded_frame *encoded_frame;

    opaque_length = encoding_result->sample.info.size;
    alpha_length = separate_alpha ? encoding_result->alpha_sample.info.size : 0;

    offset = 0;
    encoded_frame_blob_size =
            sizeof(encoding_result->props) +
            sizeof(uint32_t) + // fragment opaque length (uin32LE)
            opaque_length +
            sizeof(uint32_t) + // fragment alpha length (uin32LE)
            alpha_length;
    void *frame_blob = malloc(encoded_frame_blob_size);

    memcpy(frame_blob + offset, &encoding_result->props, sizeof(encoding_result->props));
    offset += sizeof(encoding_result->props);

    memcpy(frame_blob + offset, &encoding_result->sample.info.size, sizeof(uint32_t));
    offset += sizeof(uint32_t);

    memcpy(frame_blob + offset, encoding_result->sample.info.data, opaque_length);
    offset += opaque_length;

    memcpy(frame_blob + offset, &alpha_length, sizeof(uint32_t));
    offset += sizeof(uint32_t);

    if (alpha_length > 0) {
        memcpy(frame_blob + offset, encoding_result->alpha_sample.info.data, alpha_length);
    }

    encoded_frame = malloc(sizeof(struct encoded_frame));
    encoded_frame->encoded_data = frame_blob;
    encoded_frame->size = encoded_frame_blob_size;

    return encoded_frame;
}

struct sample_callback_data {
    const struct encoder *encoder;
    bool is_alpha;
};

static gint
has_buffer_content_serial(gconstpointer encoding_result_arg, gconstpointer buffer_content_serial_arg) {
    const struct encoding_result *encoding_result = encoding_result_arg;
    uint32_t buffer_content_serial = *((uint32_t *) buffer_content_serial_arg);

    return encoding_result->props.buffer_content_serial != buffer_content_serial;
}

static GstFlowReturn
gst_new_sample(GstAppSink *appsink, gpointer user_data) {
    const struct sample_callback_data *callback_data = user_data;
    struct encoding_result *encoding_result = NULL;
    GList *link;
    struct encoded_frame *encoded_frame;
    GstBuffer *buffer;
    uint32_t buffer_content_serial = 0;

    GstSample *sample = gst_app_sink_pull_sample(appsink);

    if (sample == NULL) {
        // end of stream
        return GST_FLOW_OK;
    }

    buffer = gst_sample_get_buffer(sample);
    gst_buffer_ref(buffer);
    gst_sample_unref(sample);
    GstCustomMeta *meta = gst_buffer_get_custom_meta(buffer, GF_BUFFER_CONTENT_SERIAL_META);
    GstStructure *s = gst_custom_meta_get_structure(meta);
    gst_structure_get_uint(s, "buffer_content_serial", &buffer_content_serial);

    // make sure we have the right encoding result
    link = g_queue_find_custom(callback_data->encoder->encoding_results, &buffer_content_serial,
                               has_buffer_content_serial);
    if (link) {
        encoding_result = link->data;
    }

    if (encoding_result == NULL) {
        g_error("BUG? No encoding result container available for encoded sample with content serial: %d.",
                buffer_content_serial);
    }

    if (encoding_result->has_split_alpha) {
        g_mutex_lock(&encoding_result->mutex);
        if (callback_data->is_alpha) {
            encoding_result->alpha_sample.buffer = buffer;
            gst_buffer_map(encoding_result->alpha_sample.buffer, &encoding_result->alpha_sample.info, GST_MAP_READ);
        } else {
            encoding_result->sample.buffer = buffer;
            gst_buffer_map(encoding_result->sample.buffer, &encoding_result->sample.info, GST_MAP_READ);
        }

        const bool is_complete = encoding_result->sample.buffer && encoding_result->alpha_sample.buffer;
        g_mutex_unlock(&encoding_result->mutex);

        if (is_complete) {
            encoded_frame = encoding_result_to_encoded_frame(encoding_result, true);
            g_queue_delete_link(callback_data->encoder->encoding_results, link);
            encoding_result_free(encoding_result);
            callback_data->encoder->frame_callback(callback_data->encoder->user_data, encoded_frame);
        }
    } else {
        encoding_result->sample.buffer = buffer;
        gst_buffer_map(encoding_result->sample.buffer, &encoding_result->sample.info, GST_MAP_READ);

        encoded_frame = encoding_result_to_encoded_frame(encoding_result, false);
        g_queue_delete_link(callback_data->encoder->encoding_results, link);
        encoding_result_free(encoding_result);
        callback_data->encoder->frame_callback(callback_data->encoder->user_data, encoded_frame);
    }

    return GST_FLOW_OK;
}

static GstAppSinkCallbacks sample_callback = {
        .eos = NULL,
        .new_sample = gst_new_sample,
        .new_preroll = NULL
};

static inline GstSample *
wl_shm_buffer_to_new_gst_sample(struct wl_shm_buffer *shm_buffer, const uint32_t width, const uint32_t height,
                                const struct shmbuf_support_format *shmbuf_support_format, GstCaps *caps) {
    void *buffer_data = wl_shm_buffer_get_data(shm_buffer);
    struct wl_shm_pool *shm_pool = wl_shm_buffer_ref_pool(shm_buffer);
    const uint32_t buffer_stride = wl_shm_buffer_get_stride(shm_buffer);
    const gsize buffer_size = buffer_stride * height;
    GstSample *sample;

    gsize offset[] = {0, 0, 0, 0};
    gint stride[] = {(gint) buffer_stride, 0, 0, 0};
    GstBuffer *buffer = gst_buffer_new_wrapped_full(GST_MEMORY_FLAG_READONLY | GST_MEMORY_FLAG_PHYSICALLY_CONTIGUOUS,
                                                    (gpointer) buffer_data, buffer_size, 0, buffer_size, shm_pool,
                                                    (GDestroyNotify) wl_shm_pool_unref);

    gst_buffer_add_video_meta_full(buffer, GST_VIDEO_FRAME_FLAG_NONE, shmbuf_support_format->gst_video_format,
                                   width, height, 1, offset, stride);

    sample = gst_sample_new(buffer, caps, NULL, NULL);
    gst_buffer_unref(buffer);

    return sample;
}

static inline void
gst_encoder_pipeline_coded_size(const struct encoder_description *encoder_definition,
                                const u_int32_t width,
                                const u_int32_t height,
                                u_int32_t *coded_width,
                                u_int32_t *coded_height) {
    *coded_width = width;
    *coded_height = height;
    uint32_t mod;

    if (*coded_width < encoder_definition->min_width) {
        *coded_width = encoder_definition->min_width;
    }
    if (*coded_height < encoder_definition->min_height) {
        *coded_height = encoder_definition->min_height;
    }

    mod = *coded_width % encoder_definition->width_multiple;
    if (mod) {
        *coded_width = *coded_width + (encoder_definition->width_multiple - mod);
    }
    mod = *coded_height % encoder_definition->height_multiple;
    if (mod) {
        *coded_height = *coded_height + (encoder_definition->width_multiple - mod);
    }
}

static inline void
gst_encoder_pipeline_config(struct gst_encoder_pipeline *gst_encoder_pipeline) {
    GstStructure *uniforms;
    GstCaps *shader_src_caps;
    GstCapsFeatures *shader_src_caps_features;
    gfloat scale_x, scale_y;
    GstElement *shader_element, *shader_capsfilter;
    graphene_matrix_t *graphene_matrix;

    scale_x = (gfloat) gst_encoder_pipeline->width / (gfloat) gst_encoder_pipeline->coded_width;
    scale_y = (gfloat) gst_encoder_pipeline->height / (gfloat) gst_encoder_pipeline->coded_height;

    const gfloat matrix[] = {
            scale_x, 0, 0, 0,
            0, scale_y, 0, 0,
            0, 0, 1, 0,
            -scale_x + 1, -scale_y + 1, 0, 1
    };
    graphene_matrix = graphene_matrix_alloc();
    graphene_matrix_init_from_float(graphene_matrix, matrix);
    uniforms = gst_structure_new("uniforms",
                                 "u_transformation", GRAPHENE_TYPE_MATRIX, graphene_matrix,
                                 NULL);
    shader_element = gst_bin_get_by_name(GST_BIN(gst_encoder_pipeline->pipeline), "shader");
    g_object_set(shader_element, "uniforms", uniforms, NULL);
    gst_object_unref(shader_element);
    gst_structure_free(uniforms);
    graphene_matrix_free(graphene_matrix);

    shader_capsfilter = gst_bin_get_by_name(GST_BIN(gst_encoder_pipeline->pipeline), "shader_capsfilter");
    shader_src_caps = gst_caps_new_simple("video/x-raw",
                                          "width", G_TYPE_INT, gst_encoder_pipeline->coded_width,
                                          "height", G_TYPE_INT, gst_encoder_pipeline->coded_height,
                                          NULL);
    shader_src_caps_features = gst_caps_features_from_string(GST_CAPS_FEATURE_MEMORY_GL_MEMORY);
    gst_caps_set_features(shader_src_caps, 0, shader_src_caps_features);
    g_object_set(shader_capsfilter, "caps", shader_src_caps, NULL);
    gst_object_unref(shader_capsfilter);
    gst_caps_unref(shader_src_caps);
}

static inline void
gst_encoder_pipeline_destroy(struct gst_encoder_pipeline *gst_encoder_pipeline) {
    GstAppSrc *app_src;
    GstPad *pad;
    GstBus *bus = gst_pipeline_get_bus(GST_PIPELINE (gst_encoder_pipeline->pipeline));
    gst_bus_set_sync_handler(bus, NULL, NULL, NULL);
    gst_bus_remove_watch(bus);
    gst_bus_set_flushing(bus, TRUE);
    gst_object_unref(bus);

    app_src = GST_APP_SRC(gst_bin_get_by_name(GST_BIN(gst_encoder_pipeline->pipeline), "src"));
    pad = gst_element_get_static_pad(GST_ELEMENT(app_src), "src");
    gst_pad_remove_probe(pad, gst_encoder_pipeline->app_src_pad_probe);
    gst_object_unref(pad);
    gst_object_unref(app_src);

    gst_element_set_state(gst_encoder_pipeline->pipeline, GST_STATE_NULL);
    if (gst_element_get_state(gst_encoder_pipeline->pipeline, NULL, NULL, 0) == GST_STATE_CHANGE_FAILURE) {
        g_warning("BUG? Could not set pipeline to null state.");
    }
    gst_object_unref(GST_OBJECT(gst_encoder_pipeline->pipeline));

    gst_encoder_pipeline->pipeline = NULL;
}

static inline void
gst_encoder_eos(struct gst_encoder *gst_encoder) {
    GstAppSrc *app_src;

    app_src = GST_APP_SRC(gst_bin_get_by_name(GST_BIN(gst_encoder->opaque_pipeline->pipeline), "src"));
    gst_app_src_end_of_stream(app_src);
    gst_object_unref(app_src);

    if (gst_encoder->alpha_pipeline) {
        app_src = GST_APP_SRC(gst_bin_get_by_name(GST_BIN(gst_encoder->alpha_pipeline->pipeline), "src"));
        gst_app_src_end_of_stream(app_src);
        gst_object_unref(app_src);
    }
}

static inline void
gst_encoder_destroy(struct gst_encoder *gst_encoder) {
    if (gst_encoder->opaque_pipeline) {
        gst_encoder_pipeline_destroy(gst_encoder->opaque_pipeline);
        gst_encoder->opaque_pipeline = NULL;
    }

    if (gst_encoder->alpha_pipeline) {
        gst_encoder_pipeline_destroy(gst_encoder->alpha_pipeline);
        gst_encoder->alpha_pipeline = NULL;
    }
    if (gst_encoder->opaque_pipeline == NULL && gst_encoder->alpha_pipeline == NULL) {
        free(gst_encoder);
    }
}

static inline gboolean
gst_encoder_destroy_if_eos(struct gst_encoder *gst_encoder) {
    if (gst_encoder->opaque_pipeline && gst_encoder->opaque_pipeline->eos) {
        gst_encoder_pipeline_destroy(gst_encoder->opaque_pipeline);
        g_free(gst_encoder->opaque_pipeline);
        gst_encoder->opaque_pipeline = NULL;
    }

    if (gst_encoder->alpha_pipeline && gst_encoder->alpha_pipeline->eos) {
        gst_encoder_pipeline_destroy(gst_encoder->alpha_pipeline);
        g_free(gst_encoder->alpha_pipeline);
        gst_encoder->alpha_pipeline = NULL;
    }

    if (gst_encoder->opaque_pipeline == NULL && gst_encoder->alpha_pipeline == NULL) {
        // TODO (re)use gl contexts & display for all pipelines
        if (gst_encoder->shared_gst_gl_context) {
            gst_gl_display_remove_context(gst_encoder->wrapped_gst_gl_display, gst_encoder->shared_gst_gl_context);
            gst_gl_context_destroy(gst_encoder->shared_gst_gl_context);
            gst_object_unref(gst_encoder->shared_gst_gl_context);
            gst_encoder->shared_gst_gl_context = NULL;
        }
        if (gst_encoder->wrapped_gst_gl_context) {
            gst_object_unref(gst_encoder->wrapped_gst_gl_context);
            gst_encoder->wrapped_gst_gl_context = NULL;
        }

        free(gst_encoder);
        return FALSE;
    }

    return TRUE;
}

static gboolean
async_bus_call(GstBus *bus, GstMessage *msg, gpointer data) {
    struct gst_encoder_pipeline *gst_encoder_pipeline = data;

    switch (GST_MESSAGE_TYPE (msg)) {
        case GST_MESSAGE_EOS: {
            gst_encoder_pipeline->eos = true;
            return gst_encoder_destroy_if_eos(gst_encoder_pipeline->gst_encoder);
        }
        default:
            break;
    }

    return TRUE;
}

static GstBusSyncReply
sync_bus_call(__attribute__((unused)) GstBus *bus, GstMessage *msg, gpointer data) {
    struct gst_encoder_pipeline *gst_encoder_pipeline = data;

    switch (GST_MESSAGE_TYPE (msg)) {
        case GST_MESSAGE_EOS: {
            return GST_BUS_PASS;
        }
        case GST_MESSAGE_NEED_CONTEXT: {
            const gchar *context_type;
            gst_message_parse_context_type(msg, &context_type);

            if (gst_encoder_pipeline->gst_encoder->encoder->westfield_egl &&
                g_strcmp0(context_type, GST_GL_DISPLAY_CONTEXT_TYPE) == 0) {
                GstContext *gst_context_gl_display = gst_context_new(GST_GL_DISPLAY_CONTEXT_TYPE, FALSE);
                gst_context_set_gl_display(gst_context_gl_display,
                                           gst_encoder_pipeline->gst_encoder->wrapped_gst_gl_display);
                gst_element_set_context(GST_ELEMENT (msg->src), gst_context_gl_display);
                gst_context_unref(gst_context_gl_display);
            }

            if (gst_encoder_pipeline->gst_encoder->encoder->westfield_egl &&
                g_strcmp0(context_type, "gst.gl.app_context") == 0) {
                GstGLContext *shared_gst_gl_context = gst_encoder_pipeline->gst_encoder->shared_gst_gl_context;
                GstContext *gst_context_gl_context = gst_context_new("gst.gl.app_context", FALSE);
                gst_structure_set(gst_context_writable_structure(gst_context_gl_context), "context",
                                  GST_TYPE_GL_CONTEXT,
                                  shared_gst_gl_context, NULL);
                gst_element_set_context(GST_ELEMENT (msg->src), gst_context_gl_context);
                gst_context_unref(gst_context_gl_context);
            }
            break;
        }
        default:
            break;
    }

    gst_message_unref(msg);
    return GST_BUS_DROP;
}

static inline void
setup_pipeline_bus_listeners(struct gst_encoder_pipeline *gst_encoder_pipeline) {
    GstBus *bus = gst_pipeline_get_bus(GST_PIPELINE(gst_encoder_pipeline->pipeline));
    gst_bus_set_sync_handler(bus, sync_bus_call, gst_encoder_pipeline, NULL);
    gst_bus_add_watch(bus, async_bus_call, gst_encoder_pipeline);
    gst_object_unref(bus);
}

static GstPadProbeReturn
app_src_have_data(GstPad *pad, GstPadProbeInfo *info, gpointer user_data) {
    struct gst_encoder_pipeline *gst_encoder_pipeline = user_data;
    GstBuffer *buffer = gst_pad_probe_info_get_buffer(info);
    GstVideoMeta *video_meta = gst_buffer_get_video_meta(buffer);

    uint32_t coded_width, coded_height;
    gst_encoder_pipeline_coded_size(gst_encoder_pipeline->gst_encoder->description, video_meta->width,
                                    video_meta->height,
                                    &coded_width, &coded_height);

    if (gst_encoder_pipeline->width != video_meta->width ||
        gst_encoder_pipeline->height != video_meta->height ||
        gst_encoder_pipeline->coded_width != coded_width ||
        gst_encoder_pipeline->coded_height != coded_height) {

        gst_encoder_pipeline->width = video_meta->width;
        gst_encoder_pipeline->height = video_meta->height;
        gst_encoder_pipeline->coded_width = coded_width;
        gst_encoder_pipeline->coded_height = coded_height;

        gst_encoder_pipeline_config(gst_encoder_pipeline);
    }

    return GST_PAD_PROBE_OK;
}

static inline struct gst_encoder_pipeline *
gst_encoder_pipeline_create(struct gst_encoder *gst_encoder, const bool is_alpha) {
    struct gst_encoder_pipeline *gst_encoder_pipeline = g_new0(struct gst_encoder_pipeline, 1);
    struct sample_callback_data *callback_data;
    GstAppSink *app_sink;
    GstAppSrc *app_src;
    GstPad *pad;
    GError *parse_error = NULL;
    gst_encoder_pipeline->pipeline = gst_parse_launch_full(gst_encoder->description->pipeline_definition, NULL,
                                                           GST_PARSE_FLAG_FATAL_ERRORS,
                                                           &parse_error);
    if (gst_encoder_pipeline->pipeline == NULL) {
        g_free(gst_encoder_pipeline);
        g_error("BUG? Failed to create encoding pipeline from it's definition: %s", parse_error->message);
    }

    GstElement *glshader = gst_bin_get_by_name(GST_BIN(gst_encoder_pipeline->pipeline), "shader");
    if (glshader == NULL) {
        g_error("Can't get element with name 'shader' from encoding pipeline. Missing gstreamer plugin element?");
    }
    if (is_alpha) {
        g_object_set(glshader, "fragment", alpha_fragment_shader, NULL);
    } else {
        g_object_set(glshader, "fragment", opaque_fragment_shader, NULL);
    }
    g_object_set(glshader, "vertex", vertex_shader, NULL);

    app_sink = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(gst_encoder_pipeline->pipeline), "sink"));
    gst_app_sink_set_wait_on_eos(app_sink, true);
    callback_data = g_new0(struct sample_callback_data, 1);
    callback_data->encoder = gst_encoder->encoder;
    callback_data->is_alpha = is_alpha;
    gst_app_sink_set_callbacks(app_sink, &sample_callback, (gpointer) callback_data,
                               NULL);
    gst_object_unref(app_sink);

    setup_pipeline_bus_listeners(gst_encoder_pipeline);

    app_src = GST_APP_SRC(gst_bin_get_by_name(GST_BIN(gst_encoder_pipeline->pipeline), "src"));
    pad = gst_element_get_static_pad(GST_ELEMENT(app_src), "src");
    gst_encoder_pipeline->app_src_pad_probe = gst_pad_add_probe(pad, GST_PAD_PROBE_TYPE_BUFFER,
                                                                (GstPadProbeCallback) app_src_have_data,
                                                                gst_encoder_pipeline, NULL);
    gst_object_unref(pad);
    gst_object_unref(app_src);

    return gst_encoder_pipeline;
}

static inline void
gst_encoder_create(struct encoder *encoder, const struct encoder_description *description) {
    struct gst_encoder *gst_encoder = g_new0(struct gst_encoder, 1);
    gst_encoder->encoder = encoder;
    gst_encoder->description = description;

    if (encoder->westfield_egl) {
        gst_encoder_ensure_gst_gl_setup(gst_encoder);
    }

    gst_encoder->opaque_pipeline = (struct gst_encoder_pipeline *) gst_encoder_pipeline_create(gst_encoder, false);
    if (gst_encoder->opaque_pipeline == NULL) {
        g_error("BUG? Failed to create opaque pipeline.");
    }
    gst_encoder->opaque_pipeline->gst_encoder = gst_encoder;

    if (gst_encoder->description->split_alpha) {
        gst_encoder->alpha_pipeline = (struct gst_encoder_pipeline *) gst_encoder_pipeline_create(gst_encoder, true);
        if (gst_encoder->alpha_pipeline == NULL) {
            g_error("BUG? Failed to create alpha pipeline.");
        }
        gst_encoder->alpha_pipeline->gst_encoder = gst_encoder;
    }

    encoder->impl = gst_encoder;
}


static inline int
gst_encoder_request_key_unit(struct gst_encoder *gst_encoder) {
    gst_element_send_event(gst_encoder->opaque_pipeline->pipeline, gst_event_new_custom(GST_EVENT_CUSTOM_DOWNSTREAM,
                                                                                        gst_structure_new(
                                                                                                "GstForceKeyUnit",
                                                                                                "all-headers",
                                                                                                G_TYPE_BOOLEAN, TRUE,
                                                                                                NULL)));
    if (gst_encoder->alpha_pipeline) {
        gst_element_send_event(gst_encoder->alpha_pipeline->pipeline, gst_event_new_custom(GST_EVENT_CUSTOM_DOWNSTREAM,
                                                                                           gst_structure_new(
                                                                                                   "GstForceKeyUnit",
                                                                                                   "all-headers",
                                                                                                   G_TYPE_BOOLEAN, TRUE,
                                                                                                   NULL)));
    }
}

static inline void
gst_encoder_pipeline_encode(struct gst_encoder_pipeline *gst_encoder_pipeline, GstSample *sample,
                            const guint buffer_content_serial) {
    if (sample == NULL) {
        g_error("BUG? Received a NULL sample to encode.");
    }

    GstBuffer *buffer = gst_sample_get_buffer(sample);
    buffer = gst_buffer_make_writable(buffer);
    GstCustomMeta *custom_meta = (GstCustomMeta *) gst_buffer_add_meta(buffer, gfBufferContentSerialMetaInfo, NULL);
    GstStructure *structure = gst_custom_meta_get_structure(custom_meta);
    GstFlowReturn ret;
    GstAppSrc *app_src;

    GValue val = G_VALUE_INIT;
    g_value_init(&val, G_TYPE_UINT);
    g_value_set_uint(&val, buffer_content_serial);
    gst_structure_set_value(structure, "buffer_content_serial", &val);
    g_value_unset(&val);
    gst_sample_set_buffer(sample, buffer);

    app_src = GST_APP_SRC(gst_bin_get_by_name(GST_BIN(gst_encoder_pipeline->pipeline), "src"));
    if (gst_encoder_pipeline->playing) {
        ret = gst_app_src_push_sample(app_src, sample);
        if (ret != GST_FLOW_OK) {
            g_error("BUG? Could not push sample to pipeline: %s", gst_flow_get_name(ret));
        }
    } else {
        guint32 coded_width, coded_height;

        GstVideoMeta *video_meta = gst_buffer_get_video_meta(buffer);
        gst_encoder_pipeline_coded_size(gst_encoder_pipeline->gst_encoder->description, video_meta->width,
                                        video_meta->height,
                                        &coded_width, &coded_height);
        gst_encoder_pipeline->width = video_meta->width;
        gst_encoder_pipeline->height = video_meta->height;
        gst_encoder_pipeline->coded_width = coded_width;
        gst_encoder_pipeline->coded_height = coded_height;
        gst_encoder_pipeline_config(gst_encoder_pipeline);

        ret = gst_app_src_push_sample(app_src, sample);
        if (ret != GST_FLOW_FLUSHING && ret != GST_FLOW_OK) {
            g_error("BUG? Could not push sample to pipeline: %s", gst_flow_get_name(ret));
        }

        gst_element_set_state(gst_encoder_pipeline->pipeline, GST_STATE_PLAYING);
        if (gst_element_get_state(gst_encoder_pipeline->pipeline, NULL, NULL, 0) == GST_STATE_CHANGE_FAILURE) {
            g_error("BUG? Could not set pipeline to playing state.");
        }
        gst_encoder_pipeline->playing = true;
    }
    gst_object_unref(app_src);
}

static inline const struct shmbuf_support_format *
shmbuf_support_format_from_wl_shm_format(const enum wl_shm_format buffer_format) {
    static const size_t shmbuf_supported_formats_size =
            sizeof(shmbuf_supported_formats) / sizeof(shmbuf_supported_formats[0]);
    for (int i = 0; i < shmbuf_supported_formats_size; ++i) {
        if (shmbuf_supported_formats[i].wl_shm_format == buffer_format) {
            return &shmbuf_supported_formats[i];
        }
    }
    return NULL;
}

static inline void
gst_encoder_encode_shm(struct gst_encoder *gst_encoder, struct wl_shm_buffer *shm_buffer,
                       struct encoding_result *encoding_result) {
    GstCaps *sample_caps;
    GstSample *opaque_sample, *alpha_sample;
    uint32_t coded_width, coded_height;
    const uint32_t width = wl_shm_buffer_get_width(shm_buffer);
    const uint32_t height = wl_shm_buffer_get_height(shm_buffer);
    const enum wl_shm_format buffer_format = wl_shm_buffer_get_format(shm_buffer);

    const struct shmbuf_support_format *shmbuf_support_format = shmbuf_support_format_from_wl_shm_format(buffer_format);
    if (shmbuf_support_format == NULL) {
        g_error("Failed to interpret shm format: %d", buffer_format);
    }

    sample_caps = gst_caps_new_simple("video/x-raw",
                                      "framerate", GST_TYPE_FRACTION, FPS, 1,
                                      "format", G_TYPE_STRING, shmbuf_support_format->gst_format_string,
                                      "width", G_TYPE_INT, width,
                                      "height", G_TYPE_INT, height,
                                      NULL);
    gst_encoder_pipeline_coded_size(gst_encoder->description, width, height, &coded_width, &coded_height);

    encoding_result->props.width = width;
    encoding_result->props.height = height;
    encoding_result->props.coded_width = coded_width;
    encoding_result->props.coded_height = coded_height;
    g_queue_push_tail(gst_encoder->encoder->encoding_results, encoding_result);
    opaque_sample = wl_shm_buffer_to_new_gst_sample(shm_buffer, width, height, shmbuf_support_format, sample_caps);

    gst_encoder_pipeline_encode(gst_encoder->opaque_pipeline, opaque_sample,
                                encoding_result->props.buffer_content_serial);
    gst_sample_unref(opaque_sample);

    if (shmbuf_support_format->has_alpha && gst_encoder->description->split_alpha) {
        encoding_result->has_split_alpha = true;

        alpha_sample = wl_shm_buffer_to_new_gst_sample(shm_buffer, width, height, shmbuf_support_format, sample_caps);

        gst_encoder_pipeline_encode(gst_encoder->alpha_pipeline, alpha_sample,
                                    encoding_result->props.buffer_content_serial);
        gst_sample_unref(alpha_sample);
    } else {
        encoding_result->has_split_alpha = false;
    }

    gst_caps_unref(sample_caps);
}

static inline const struct dmabuf_support_format *
dmabuf_support_format_from_fourcc(const uint32_t fourcc) {
    static const size_t dmabuf_supported_formats_size =
            sizeof(dmabuf_supported_formats) / sizeof(dmabuf_supported_formats[0]);
    for (int i = 0; i < dmabuf_supported_formats_size; ++i) {
        if (dmabuf_supported_formats[i].drm_format == fourcc) {
            return &dmabuf_supported_formats[i];
        }
    }
    return NULL;
}

static void
destroy_gst_egl_image(GstEGLImage *image, gpointer user_data) {
    struct gst_encoder_pipeline *gst_encoder_pipeline = user_data;
    westfield_egl_destroy_image(gst_encoder_pipeline->gst_encoder->encoder->westfield_egl, gst_egl_image_get_image(image));
}

static void
destroy_gst_gl_memory(gpointer data) {
    GstEGLImage *gst_egl_image = data;
    gst_egl_image_unref(gst_egl_image);
}

static inline GstBuffer *
gst_encoder_pipeline_create_gl_memory_buffer(struct gst_encoder_pipeline *gst_encoder_pipeline,
                                             const struct dmabuf_attributes *attributes, GstCaps *caps) {
    GstGLMemoryAllocator *allocator = GST_GL_MEMORY_ALLOCATOR (gst_allocator_find(GST_GL_MEMORY_EGL_ALLOCATOR_NAME));
    GstBuffer *buffer = gst_buffer_new();
    GstVideoInfo *video_info;
    GstEGLImage *gst_egl_image;

    GstGLVideoAllocationParams *params;
    gboolean ret;
    bool external_only;
    EGLImageKHR egl_image = westfield_egl_create_image_from_dmabuf(
            gst_encoder_pipeline->gst_encoder->encoder->westfield_egl,
            attributes,
            &external_only);

    gst_egl_image = gst_egl_image_new_wrapped(gst_encoder_pipeline->gst_encoder->shared_gst_gl_context,
                                              egl_image,
                                              GST_GL_RGBA8,
                                              gst_encoder_pipeline,
                                              destroy_gst_egl_image);

    video_info = gst_video_info_new();
    gst_video_info_from_caps(video_info, caps);
    params = gst_gl_video_allocation_params_new_wrapped_gl_handle(
            gst_encoder_pipeline->gst_encoder->shared_gst_gl_context,
            NULL,
            video_info,
            -1,
            NULL,
            GST_GL_TEXTURE_TARGET_2D,
            0,
            NULL,
            gst_egl_image,
            destroy_gst_gl_memory);
    gst_video_info_free(video_info);
    ret = gst_gl_memory_setup_buffer(allocator, buffer, params, NULL, (gpointer *) &gst_egl_image, 1);

    if (!ret) {
        g_error ("Failed to setup gl memory.");
    }

    gst_gl_allocation_params_free((GstGLAllocationParams *) params);
    gst_object_unref(allocator);

    return buffer;
}

static inline GstSample *
gst_encoder_pipeline_dmabuf_attributes_to_new_gst_sample(struct gst_encoder_pipeline *gst_encoder_pipeline,
                                                         const struct dmabuf_attributes *attributes,
                                                         GstCaps *caps) {
    GstBuffer *buffer = gst_encoder_pipeline_create_gl_memory_buffer(gst_encoder_pipeline, attributes, caps);

    GstGLSyncMeta *sync_meta = gst_buffer_get_gl_sync_meta (buffer);
    if (sync_meta) {
        gst_gl_sync_meta_set_sync_point(sync_meta, gst_encoder_pipeline->gst_encoder->shared_gst_gl_context);
        gst_gl_sync_meta_wait(sync_meta, gst_encoder_pipeline->gst_encoder->shared_gst_gl_context);
    }
    GstSample *sample = gst_sample_new(buffer, caps, NULL, NULL);
    gst_buffer_unref(buffer);

    return sample;
}

static inline void
gst_encoder_encode_dmabuf(struct gst_encoder *gst_encoder,
                          struct westfield_buffer *base,
                          struct dmabuf_attributes *attributes,
                          struct encoding_result *encoding_result) {
    GstCaps *sample_caps;
    GstSample *opaque_sample, *alpha_sample;
    uint32_t coded_width, coded_height;

    const struct dmabuf_support_format *dmabuf_support_format = dmabuf_support_format_from_fourcc(attributes->format);
    if (dmabuf_support_format == NULL) {
        g_error("Can't encode buffer. Unsupported buffer. Failed to interpret buffer's fourcc format: %c%c%c%c",
                GST_FOURCC_ARGS(attributes->format));
    }

    sample_caps = gst_caps_new_simple("video/x-raw",
                                      "framerate", GST_TYPE_FRACTION, FPS, 1,
                                      "format", G_TYPE_STRING, "RGBA",
                                      "width", G_TYPE_INT, base->width,
                                      "height", G_TYPE_INT, base->height,
                                      NULL);
    gst_encoder_pipeline_coded_size(gst_encoder->description, base->width, base->height, &coded_width,
                                    &coded_height);

    encoding_result->props.width = base->width;
    encoding_result->props.height = base->height;
    encoding_result->props.coded_width = coded_width;
    encoding_result->props.coded_height = coded_height;
    g_queue_push_tail(gst_encoder->encoder->encoding_results, encoding_result);

    opaque_sample = gst_encoder_pipeline_dmabuf_attributes_to_new_gst_sample(gst_encoder->opaque_pipeline, attributes,
                                                                             sample_caps);
    gst_encoder_pipeline_encode(gst_encoder->opaque_pipeline, opaque_sample,
                                encoding_result->props.buffer_content_serial);
    gst_sample_unref(opaque_sample);

    if (dmabuf_support_format->has_alpha && gst_encoder->description->split_alpha) {
        encoding_result->has_split_alpha = true;
        alpha_sample = gst_encoder_pipeline_dmabuf_attributes_to_new_gst_sample(gst_encoder->alpha_pipeline, attributes,
                                                                                sample_caps);
        gst_encoder_pipeline_encode(gst_encoder->alpha_pipeline, alpha_sample,
                                    encoding_result->props.buffer_content_serial);
        gst_sample_unref(alpha_sample);
    } else {
        encoding_result->has_split_alpha = false;
    }

    gst_caps_unref(sample_caps);
    // TODO memory management/lifecycle of buffer? ie handle case where buffer is destroyed by client while it's being encoded, see weston remoting implementation?
}

static inline void
gst_encoder_encode(struct gst_encoder *gst_encoder, struct wl_resource *buffer_resource,
                   struct encoding_result *encoding_result) {
    struct wl_shm_buffer *shm_buffer;
    struct wlr_dmabuf_v1_buffer *dmabuf_v1_buffer;
    struct wlr_drm_buffer *westfield_drm_buffer;
    encoding_result->props.encoding_type = gst_encoder->description->encoding_type;

    if (wlr_dmabuf_v1_resource_is_buffer(buffer_resource)) {
        dmabuf_v1_buffer = wlr_dmabuf_v1_buffer_from_buffer_resource(buffer_resource);
        gst_encoder_encode_dmabuf(gst_encoder, &dmabuf_v1_buffer->base,
                                  &dmabuf_v1_buffer->attributes, encoding_result);
        return;
    }

    if (wlr_drm_buffer_is_resource(buffer_resource)) {
        westfield_drm_buffer = wlr_drm_buffer_from_resource(buffer_resource);
        gst_encoder_encode_dmabuf(gst_encoder, &westfield_drm_buffer->base,
                                  &westfield_drm_buffer->dmabuf, encoding_result);
        return;
    }

    shm_buffer = wl_shm_buffer_get(buffer_resource);
    if (shm_buffer) {
        gst_encoder_encode_shm(gst_encoder, shm_buffer, encoding_result);
        return;
    }
}

static inline bool
png_gst_encoder_supports_buffer(struct wl_resource *buffer_resource) {
    int32_t width, height;

    struct wl_shm_buffer *shm_buffer = wl_shm_buffer_get(buffer_resource);
    if (shm_buffer) {
        uint32_t shm_format = wl_shm_buffer_get_format(shm_buffer);
        width = wl_shm_buffer_get_width(shm_buffer);
        height = wl_shm_buffer_get_height(shm_buffer);


        return (width * height) <= (256 * 256) &&
               (shm_format == WL_SHM_FORMAT_ARGB8888 || shm_format == WL_SHM_FORMAT_XRGB8888);
    }

    if (wlr_dmabuf_v1_resource_is_buffer(buffer_resource)) {
        struct wlr_dmabuf_v1_buffer *dmabuf_v1_buffer = wlr_dmabuf_v1_buffer_from_buffer_resource(
                buffer_resource);
        width = dmabuf_v1_buffer->base.width;
        height = dmabuf_v1_buffer->base.height;

        if (width * height <= 256 * 256) {
            return true;
        }
    }

    if (wlr_drm_buffer_is_resource(buffer_resource)) {
        struct wlr_drm_buffer *westfield_drm_buffer = wlr_drm_buffer_from_resource(buffer_resource);
        width = westfield_drm_buffer->base.width;
        height = westfield_drm_buffer->base.height;

        // Too small needs the png encoder so refuse
        if (width * height <= 256 * 256) {
            return true;
        }
    }

    return false;
}

static inline bool
encoder_description_supports_buffer(const struct encoder_description *encoder_itf, const char *preferred_encoder,
                                    struct wl_resource *buffer_resource) {
    int32_t width, height;
    struct wl_shm_buffer *shm_buffer;
    struct wlr_dmabuf_v1_buffer *dmabuf_v1_buffer;
    struct wlr_drm_buffer *westfield_drm_buffer;

    if (strcmp(encoder_itf->name, "png") == 0) {
        return png_gst_encoder_supports_buffer(buffer_resource);
    }

    // different encoder preferred so not for this interface
    if (strcmp(encoder_itf->name, preferred_encoder) != 0) {
        return false;
    }

    if (wlr_dmabuf_v1_resource_is_buffer(buffer_resource)) {
        dmabuf_v1_buffer = wlr_dmabuf_v1_buffer_from_buffer_resource(buffer_resource);
        width = dmabuf_v1_buffer->base.width;
        height = dmabuf_v1_buffer->base.height;

        // Too small needs the png encoder so refuse
        if (width * height <= 256 * 256) {
            return false;
        }

        return true;
    }

    if (wlr_drm_buffer_is_resource(buffer_resource)) {
        westfield_drm_buffer = wlr_drm_buffer_from_resource(buffer_resource);
        width = westfield_drm_buffer->base.width;
        height = westfield_drm_buffer->base.height;

        // Too small needs the png encoder so refuse
        if (width * height <= 256 * 256) {
            return false;
        }

        return true;
    }

    shm_buffer = wl_shm_buffer_get(buffer_resource);
    if (shm_buffer != NULL) {
        const uint32_t shm_format = wl_shm_buffer_get_format(shm_buffer);
        width = wl_shm_buffer_get_width(shm_buffer);
        height = wl_shm_buffer_get_height(shm_buffer);

        // Too small needs the png encoder so refuse
        if (width * height <= 256 * 256) {
            return false;
        }

        if (shm_format == WL_SHM_FORMAT_ARGB8888 || shm_format == WL_SHM_FORMAT_XRGB8888) {
            return true;
        }
    }

    return false;
}

static const struct encoder_description encoder_descriptions[] = {
        {
                .name = "x264",
                .encoding_type = h264,
                .pipeline_definition = "appsrc name=src format=3 stream-type=0 ! "
                                       "glupload ! "
                                       "glcolorconvert ! "
                                       "glshader name=shader ! "
                                       "capsfilter name=shader_capsfilter ! "
                                       "glcolorconvert ! video/x-raw(memory:GLMemory),format=NV12 ! "
                                       "gldownload ! "
                                       // The ueue is silent
                                       "queue silent=true ! "
                                       "x264enc me=2 analyse=51 dct8x8=true cabac=true bframes=0 b-adapt=false rc-lookahead=0 sliced-threads=true qp-max=18 byte-stream=true tune=zerolatency psy-tune=2 pass=0 bitrate=12800 vbv-buf-capacity=1000 ! "
                                       "video/x-h264,profile=high,stream-format=byte-stream,alignment=au ! "
                                       "appsink name=sink ",
                .split_alpha = true,
                .width_multiple = 128,
                .height_multiple = 128,
                .min_width = 128,
                .min_height = 128,
        },
        {
                .name = "nvh264",
                .encoding_type = h264,
                // TODO see if we can somehow get https://en.wikipedia.org/wiki/YCoCg color conversion to work with full range colors
                // FIXME current colors lacks gamma correction, light colors are too white and dark colors are too black.
                .pipeline_definition = "appsrc name=src format=3 stream-type=0 ! "
                                       "glupload ! "
                                       "glcolorconvert ! "
                                       "glshader name=shader ! "
                                       "capsfilter name=shader_capsfilter ! "
                                       "queue silent=true ! "
                                       // TODO use cudascale/cudaconvert once gstreamer 1.22 is released
                                       "nvh264enc qp-max=18 zerolatency=true preset=4 rc-mode=5 max-bitrate=12800 vbv-buffer-size=12800 ! "
                                       "video/x-h264,profile=high,stream-format=byte-stream,alignment=au ! "
                                       "appsink name=sink ",
                .split_alpha = true,
                .width_multiple = 128,
                .height_multiple = 128,
                .min_width = 128,
                .min_height = 128,
        },
        {
                .name = "vaapih264",
                .encoding_type = h264,
                .pipeline_definition = "appsrc name=src format=3 stream-type=0 ! "
                                       "glupload ! "
                                       "glcolorconvert ! "
                                       "glshader name=shader ! "
                                       "capsfilter name=shader_capsfilter ! "
                                       "glcolorconvert ! video/x-raw(memory:GLMemory),format=NV12 ! "
                                       "gldownload ! "
                                       "queue silent=true ! "
                                       "vaapih264enc aud=1 ! "
                                       "video/x-h264,profile=high,stream-format=byte-stream,alignment=au ! "
                                       "appsink name=sink",
                .split_alpha = true,
                .width_multiple = 128,
                .height_multiple = 128,
                .min_width = 128,
                .min_height = 128,
        },
        // always keep png last as fallback encoder
        {
                .name = "png",
                .encoding_type = png,
                .pipeline_definition = "appsrc name=src format=3 stream-type=0 ! "
                                       "glupload ! "
                                       "glcolorconvert ! "
                                       "glshader name=shader ! "
                                       "capsfilter name=shader_capsfilter ! "
                                       "glcolorconvert ! video/x-raw(memory:GLMemory),format=RGBA ! "
                                       "gldownload ! "
                                       "queue silent=true ! "
                                       "pngenc ! "
                                       "appsink name=sink",
                .split_alpha = false,
                .width_multiple = 16,
                .height_multiple = 16,
                .min_width = 16,
                .min_height = 16,
        }
};

void
do_gst_init() {
    gst_init(NULL, NULL);
    static const gchar *tags[] = {NULL};
    gfBufferContentSerialMetaInfo = gst_meta_register_custom(GF_BUFFER_CONTENT_SERIAL_META, tags, NULL, NULL, NULL);
}

void
do_gst_encoder_create(char preferred_encoder[16], frame_callback_func frame_ready_callback, void *user_data,
                      struct encoder **encoder_pp, struct westfield_egl *westfield_egl) {
    struct encoder *encoder = g_new0(struct encoder, 1);

    strncpy(encoder->preferred_encoder, preferred_encoder, sizeof(encoder->preferred_encoder));
    encoder->preferred_encoder[sizeof(encoder->preferred_encoder) - 1] = '\0';
    encoder->frame_callback = frame_ready_callback;
    encoder->user_data = user_data;
    encoder->encoding_results = g_queue_new();
    encoder->westfield_egl = westfield_egl;

    *encoder_pp = encoder;
}

void
do_gst_encoder_encode(struct encoder **encoder_pp, struct wl_resource *buffer_resource, uint32_t buffer_content_serial,
                      uint32_t buffer_creation_serial) {
    struct encoder *encoder = *encoder_pp;
    struct encoding_result *encoding_result;
    const size_t nro_encoders = sizeof(encoder_descriptions) / sizeof(encoder_descriptions[0]);

    if (encoder->impl != NULL) {
        if (!encoder_description_supports_buffer(encoder->impl->description, encoder->preferred_encoder,
                                                 buffer_resource)) {
            gst_encoder_eos(encoder->impl);
            encoder->impl = NULL;
        }
    }

    if (encoder->impl == NULL) {
        for (int i = 0; i < nro_encoders; i++) {
            if (encoder_description_supports_buffer(&encoder_descriptions[i], encoder->preferred_encoder,
                                                    buffer_resource)) {
                gst_encoder_create(encoder, &encoder_descriptions[i]);
                assert(encoder->impl != NULL && "Found matching encoder and have implementation.");
                break;
            }
        }
    }

    if (encoder->impl == NULL) {
        // Buffer could have been destroyed, or no matching encoder is available, return an empty encoding result
        // FIXME log & handle this
        encoder->frame_callback(encoder->user_data, NULL);
        return;
    }

    encoding_result = g_new0(struct encoding_result, 1);
    g_mutex_init(&encoding_result->mutex);
    encoding_result->props.buffer_content_serial = buffer_content_serial;
    encoding_result->props.buffer_creation_serial = buffer_creation_serial;
    encoding_result->props.buffer_id = wl_resource_get_id(buffer_resource);
    gst_encoder_encode(encoder->impl, buffer_resource, encoding_result);
}

void
do_gst_encoder_free(struct encoder **encoder_pp) {
    struct encoder *encoder = *encoder_pp;
    gst_encoder_destroy(encoder->impl);
    encoder->impl = NULL;
    g_queue_free_full(encoder->encoding_results, (GDestroyNotify) encoding_result_free);
    free(encoder);
}

void
do_gst_encoded_frame_finalize(struct encoded_frame *encoded_frame) {
    free(encoded_frame->encoded_data);
    free(encoded_frame);
}

void
do_gst_request_key_unit(struct encoder **encoder_pp) {
    struct encoder *encoder = *encoder_pp;
    struct gst_encoder *gst_encoder = (struct gst_encoder *) encoder->impl;
    gst_encoder_request_key_unit(gst_encoder);
}
