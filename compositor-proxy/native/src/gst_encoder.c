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
#include "encoder.h"
#include "westfield-linux-dmabuf-v1.h"
#include "westfield-drm.h"
#include "westfield-dmabuf.h"

#define FPS 60

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
        uint32_t serial;
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
    const struct encoder_description *description;
    void *impl;
    char preferred_encoder[16]; // "x264" or "nvh264"

    frame_callback_func frame_callback;
    GQueue *encoding_results;
    void *user_data;

    struct {
        struct westfield_egl *westfield_egl;
        GstContext *gst_context_gl_display;
        GstContext *gst_context_gl_context;
        GstGLContext *wrapped_gst_gl_context;
        GstGLContext *shared_gst_gl_context;
    } gpu;
};

struct gst_encoder_pipeline {
    GstAppSrc *app_src;
    GstAppSink *app_sink;
    GstElement *pipeline;
    GstElement *glshader;
    GstElement *shader_capsfilter;
    bool playing;
};

struct gst_encoder {
    struct gst_encoder_pipeline *opaque_pipeline;
    struct gst_encoder_pipeline *alpha_pipeline;
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
    const char *gst_format_string;
    const GstVideoFormat gst_video_format;
};

static const struct dmabuf_support_format dmabuf_supported_formats[] = {
        {
                .has_alpha = true,
                .drm_format = DRM_FORMAT_ARGB8888,
                .gst_format_string = "BGRA",
                .gst_video_format = GST_VIDEO_FORMAT_BGRA,
        },
        {
                .has_alpha = true,
                .drm_format = DRM_FORMAT_RGBA8888,
                .gst_format_string = "ABGR",
                .gst_video_format = GST_VIDEO_FORMAT_ABGR,
        },
        {
                .has_alpha = true,
                .drm_format = DRM_FORMAT_BGRA8888,
                .gst_format_string = "ARGB",
                .gst_video_format = GST_VIDEO_FORMAT_ARGB,
        },
        {
                .has_alpha = false,
                .drm_format =DRM_FORMAT_RGBX8888,
                .gst_format_string = "xBGR",
                .gst_video_format = GST_VIDEO_FORMAT_xBGR,
        },
        {
                .has_alpha = false,
                .drm_format =DRM_FORMAT_BGRX8888,
                .gst_format_string = "xRGB",
                .gst_video_format = GST_VIDEO_FORMAT_xRGB,
        },
        {
                .has_alpha = false,
                .drm_format =DRM_FORMAT_RGB888,
                .gst_format_string = "BGR",
                .gst_video_format = GST_VIDEO_FORMAT_BGR,
        },
        {
                .has_alpha = true,
                .drm_format = DRM_FORMAT_ABGR8888,
                .gst_format_string = "RGBA",
                .gst_video_format = GST_VIDEO_FORMAT_RGBA,
        },
        {
                .has_alpha = false,
                .drm_format = DRM_FORMAT_BGR888,
                .gst_format_string = "RGB",
                .gst_video_format = GST_VIDEO_FORMAT_RGB,
        },
        {
                .has_alpha = false,
                .drm_format = DRM_FORMAT_XBGR8888,
                .gst_format_string = "RGBx",
                .gst_video_format = GST_VIDEO_FORMAT_RGBx,
        },
        {
                .has_alpha = false,
                .drm_format = DRM_FORMAT_XRGB8888,
                .gst_format_string = "BGRx",
                .gst_video_format = GST_VIDEO_FORMAT_BGRx,
        },
        {
                .has_alpha = false,
                .drm_format = DRM_FORMAT_RGB565,
                .gst_format_string = "RGB16",
                .gst_video_format = GST_VIDEO_FORMAT_RGB16,
        },
        {
                .has_alpha = false,
                .drm_format = DRM_FORMAT_YUV444,
                .gst_format_string = "Y444",
                .gst_video_format = GST_VIDEO_FORMAT_Y444,
        },
        {
                .has_alpha = false,
                .drm_format = DRM_FORMAT_YUV420,
                .gst_format_string = "I420",
                .gst_video_format = GST_VIDEO_FORMAT_I420,
        },
        {
                .has_alpha = false,
                .drm_format = DRM_FORMAT_NV12,
                .gst_format_string = "NV12",
                .gst_video_format = GST_VIDEO_FORMAT_NV12,
        },
        {
                .has_alpha = false,
                .drm_format = DRM_FORMAT_NV21,
                .gst_format_string = "NV21",
                .gst_video_format = GST_VIDEO_FORMAT_NV21,
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
ensure_gst_gl(struct encoder *encoder, GstElement *pipeline) {
    if (!encoder->gpu.gst_context_gl_display) {
        GstGLDisplay *gst_gl_display;

        EGLDeviceEXT egl_device = westfield_egl_get_device(encoder->gpu.westfield_egl);
        EGLDisplay egl_display = westfield_egl_get_display(encoder->gpu.westfield_egl);
        if (egl_device) {
            gst_gl_display = GST_GL_DISPLAY(gst_gl_display_egl_device_new_with_egl_device(egl_device));
        } else {
            gst_gl_display = GST_GL_DISPLAY(gst_gl_display_egl_new_with_egl_display(egl_display));
        }
        GstContext *gst_context_gl_display = gst_context_new(GST_GL_DISPLAY_CONTEXT_TYPE, TRUE);
        gst_context_set_gl_display(gst_context_gl_display, gst_gl_display);
        encoder->gpu.gst_context_gl_display = gst_context_gl_display;

        if (!encoder->gpu.gst_context_gl_context) {
            EGLContext egl_context = westfield_egl_get_context(encoder->gpu.westfield_egl);
            eglMakeCurrent(egl_display, EGL_NO_SURFACE, EGL_NO_SURFACE, egl_context);

            if (egl_context == NULL) {
                GST_ERROR_OBJECT (gst_gl_display, "Failed to find EGL context.");
                return;
            }
            encoder->gpu.wrapped_gst_gl_context = gst_gl_context_new_wrapped(gst_gl_display,
                                                                             (guintptr) egl_context,
                                                                             GST_GL_PLATFORM_EGL,
                                                                             GST_GL_API_OPENGL);
            gst_gl_context_activate(encoder->gpu.wrapped_gst_gl_context, TRUE);
            gst_gl_context_fill_info(encoder->gpu.wrapped_gst_gl_context, NULL);
            /* Create a new non-wrapped local GstGlContext to share with other elements. */
            GError *err = NULL;
            if (!gst_gl_display_create_context(gst_gl_display,
                                               encoder->gpu.wrapped_gst_gl_context, &encoder->gpu.shared_gst_gl_context,
                                               &err)) {
                fprintf(stderr, "Failed to create GstGLContex context: %s\n", err->message);
                g_clear_error(&err);
                exit(EXIT_FAILURE);
            }
            gst_gl_display_add_context(gst_gl_display, encoder->gpu.shared_gst_gl_context);

            GstContext *gst_context_gl_context = gst_context_new("gst.gl.app_context", TRUE);
            gst_structure_set(gst_context_writable_structure(gst_context_gl_context), "context", GST_TYPE_GL_CONTEXT,
                              encoder->gpu.shared_gst_gl_context, NULL);
            encoder->gpu.gst_context_gl_context = gst_context_gl_context;
        }
    }

    gst_element_set_context(pipeline, encoder->gpu.gst_context_gl_context);
    gst_element_set_context(pipeline, encoder->gpu.gst_context_gl_display);
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
    gsize opaque_length, alpha_length, offset, encoded_frame_size;
    struct encoded_frame *encoded_frame;
    uint32_t opcode = 3;

    opaque_length = encoding_result->sample.info.size;
    alpha_length = separate_alpha ? encoding_result->alpha_sample.info.size : 0;

    offset = 0;
    encoded_frame_size =
            sizeof(uint32_t) + // opcode: uin32LE
            sizeof(encoding_result->props) +
            sizeof(uint32_t) + // fragment opaque length (uin32LE)
            opaque_length +
            sizeof(uint32_t) + // fragment alpha length (uin32LE)
            alpha_length;
    void *frame_blob = malloc(encoded_frame_size);

    memcpy(frame_blob + offset, &opcode, sizeof(opcode));
    offset += sizeof(opcode);

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
    encoded_frame->size = encoded_frame_size;

    return encoded_frame;
}

struct sample_callback_data {
    const struct encoder *encoder;
    bool is_alpha;
};

static GstFlowReturn
gst_new_sample(GstAppSink *appsink, gpointer user_data) {
    GstSample *sample = gst_app_sink_pull_sample(appsink);
    const struct sample_callback_data *callback_data = user_data;
    struct encoding_result *encoding_result;
    struct encoded_frame *encoded_frame;

    if (sample == NULL) {
        g_error("BUG? Got a NULL sample from encoding pipeline.");
    }

    encoding_result = g_queue_peek_tail(callback_data->encoder->encoding_results);
    if (encoding_result == NULL) {
        g_error("BUG? No encoding result container available for encoded sample.");
    }

    if (encoding_result->has_split_alpha) {
        g_mutex_lock(&encoding_result->mutex);

        if (callback_data->is_alpha) {
            encoding_result->alpha_sample.buffer = gst_buffer_ref(gst_sample_get_buffer(sample));
            gst_buffer_map(encoding_result->alpha_sample.buffer, &encoding_result->alpha_sample.info, GST_MAP_READ);
        } else {
            encoding_result->sample.buffer = gst_buffer_ref(gst_sample_get_buffer(sample));
            gst_buffer_map(encoding_result->sample.buffer, &encoding_result->sample.info, GST_MAP_READ);
        }
        gst_sample_unref(sample);

        const bool is_complete = encoding_result->sample.buffer && encoding_result->alpha_sample.buffer;
        g_mutex_unlock(&encoding_result->mutex);

        if (is_complete) {
            encoded_frame = encoding_result_to_encoded_frame(encoding_result, true);
            g_queue_pop_tail(callback_data->encoder->encoding_results);
            encoding_result_free(encoding_result);
            callback_data->encoder->frame_callback(callback_data->encoder->user_data, encoded_frame);
        }
    } else {
        encoding_result->sample.buffer = gst_buffer_ref(gst_sample_get_buffer(sample));
        gst_buffer_map(encoding_result->sample.buffer, &encoding_result->sample.info, GST_MAP_READ);
        gst_sample_unref(sample);

        encoded_frame = encoding_result_to_encoded_frame(encoding_result, false);
        g_queue_pop_tail(callback_data->encoder->encoding_results);
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

static inline GstBuffer *
wl_shm_buffer_to_gst_buffer(struct wl_shm_buffer *shm_buffer, const uint32_t width, const uint32_t height,
                            const struct shmbuf_support_format *shmbuf_support_format) {
    void *buffer_data = wl_shm_buffer_get_data(shm_buffer);
    struct wl_shm_pool *shm_pool = wl_shm_buffer_ref_pool(shm_buffer);
    const uint32_t buffer_stride = wl_shm_buffer_get_stride(shm_buffer);
    const gsize buffer_size = buffer_stride * height;
    gsize offset[] = {
            0, 0, 0, 0
    };
    gint stride[] = {
            (gint) buffer_stride, 0, 0, 0
    };
    GstBuffer *buffer = gst_buffer_new_wrapped_full(GST_MEMORY_FLAG_READONLY | GST_MEMORY_FLAG_PHYSICALLY_CONTIGUOUS,
                                                    (gpointer) buffer_data, buffer_size, 0, buffer_size, shm_pool,
                                                    (GDestroyNotify) wl_shm_pool_unref);
    gst_buffer_add_video_meta_full(buffer,
                                   GST_VIDEO_FRAME_FLAG_NONE,
                                   shmbuf_support_format->gst_video_format,
                                   width,
                                   height,
                                   1,
                                   offset,
                                   stride);

    return buffer;
}

static inline void
gst_encoder_pipeline_config(struct gst_encoder_pipeline *gst_encoder_pipeline,
                            const struct encoder_description *encoder_definition,
                            const GstCaps *new_src_caps,
                            const u_int32_t width,
                            const u_int32_t height,
                            u_int32_t *coded_width,
                            u_int32_t *coded_height) {
    const GstCaps *current_src_caps = gst_app_src_get_caps(gst_encoder_pipeline->app_src);
    GstStructure *uniforms;
    GstCaps *shader_src_caps;
    gchar *capsstr;
    *coded_width = width;
    *coded_height = height;
    uint32_t mod;
    gfloat scale_x, scale_y;
    graphene_matrix_t *graphene_matrix;

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

    if (current_src_caps && gst_caps_is_equal(current_src_caps, new_src_caps)) {
        gst_caps_unref((GstCaps *) current_src_caps);
        return;
    }

    gst_app_src_set_caps(gst_encoder_pipeline->app_src, new_src_caps);

    scale_x = (gfloat) width / (gfloat) *coded_width;
    scale_y = (gfloat) height / (gfloat) *coded_height;

    const gfloat matrix[] = {
            scale_x, 0, 0, 0,
            0, scale_y, 0, 0,
            0, 0, 1, 0,
            -scale_x + 1, -scale_y + 1, 0, 1
    };
    graphene_matrix = graphene_matrix_alloc();
    graphene_matrix_init_from_float(graphene_matrix, matrix);

    uniforms = gst_structure_new("uniforms",
                                 "u_transformation", GRAPHENE_TYPE_MATRIX, matrix,
                                 NULL);

    capsstr = g_strdup_printf("video/x-raw(memory:GLMemory),width=%d,height=%d",
                              *coded_width, *coded_height);
    shader_src_caps = gst_caps_from_string(capsstr);
    g_free(capsstr);

    g_object_set(gst_encoder_pipeline->glshader, "uniforms", uniforms, NULL);
    g_object_set(gst_encoder_pipeline->shader_capsfilter, "caps", shader_src_caps, NULL);

    gst_structure_free(uniforms);
    gst_caps_unref(shader_src_caps);
    graphene_matrix_free(graphene_matrix);
}

static inline void
gst_encoder_pipeline_destroy(struct gst_encoder_pipeline *gst_encoder_pipeline) {
    gst_element_set_state(gst_encoder_pipeline->pipeline, GST_STATE_NULL);
    gst_object_unref(GST_OBJECT(gst_encoder_pipeline->app_src));
    gst_object_unref(GST_OBJECT(gst_encoder_pipeline->app_sink));
    gst_object_unref(GST_OBJECT(gst_encoder_pipeline->pipeline));
    gst_object_unref(GST_OBJECT(gst_encoder_pipeline->glshader));
    gst_object_unref(GST_OBJECT(gst_encoder_pipeline->shader_capsfilter));

    gst_encoder_pipeline->app_src = NULL;
    gst_encoder_pipeline->app_sink = NULL;
    gst_encoder_pipeline->pipeline = NULL;
    gst_encoder_pipeline->pipeline = NULL;
    gst_encoder_pipeline->glshader = NULL;
    gst_encoder_pipeline->shader_capsfilter = NULL;

    g_free(gst_encoder_pipeline);
}

static inline void
gst_encoder_destroy(struct encoder *encoder) {
    struct gst_encoder *gst_encoder = (struct gst_encoder *) encoder->impl;
    gst_encoder_pipeline_destroy(gst_encoder->opaque_pipeline);
    gst_encoder->opaque_pipeline = NULL;
    if (gst_encoder->alpha_pipeline) {
        gst_encoder_pipeline_destroy(gst_encoder->alpha_pipeline);
        gst_encoder->alpha_pipeline = NULL;
    }
    free(gst_encoder);
    encoder->impl = NULL;
}

static GstBusSyncReply
sync_bus_call(__attribute__((unused)) GstBus *bus, GstMessage *msg, gpointer data) {
    struct encoder *encoder = data;

    switch (GST_MESSAGE_TYPE (msg)) {
        case GST_MESSAGE_NEED_CONTEXT: {
            const gchar *context_type;

            gst_message_parse_context_type(msg, &context_type);
            if (g_strcmp0(context_type, GST_GL_DISPLAY_CONTEXT_TYPE) == 0 && encoder->gpu.westfield_egl) {
                gst_element_set_context(GST_ELEMENT (msg->src), encoder->gpu.gst_context_gl_display);
            }

            if (g_strcmp0(context_type, "gst.gl.app_context") == 0) {
                gst_element_set_context(GST_ELEMENT (msg->src), encoder->gpu.gst_context_gl_context);
            }
            break;
        }
        default:
            break;
    }

    return GST_BUS_DROP;
}

static inline void
setup_pipeline_bus_listeners(struct encoder *encoder, GstElement *pipeline) {
    GstBus *bus = gst_element_get_bus(pipeline);
    gst_bus_set_sync_handler(bus, sync_bus_call, encoder, NULL);
}

static inline struct gst_encoder_pipeline *
gst_encoder_pipeline_create(struct encoder *encoder, const char *pipeline_definition, const bool is_alpha) {
    struct gst_encoder_pipeline *gst_encoder_pipeline = g_new0(struct gst_encoder_pipeline, 1);
    struct sample_callback_data *callback_data;
    gst_encoder_pipeline->pipeline = gst_parse_launch(pipeline_definition, NULL);
    if (gst_encoder_pipeline->pipeline == NULL) {
        g_free(gst_encoder_pipeline);
        g_error("BUG? Failed to create encoding pipeline from it's definition.");
    }


    GstElement *glshader = gst_bin_get_by_name(GST_BIN(gst_encoder_pipeline->pipeline), "shader");
    if(glshader == NULL) {
        g_error("Can't get element with name 'shader' from encoding pipeline. Missing gstreamer plugin element?");
    }
    if (is_alpha) {
        g_object_set(glshader, "fragment", alpha_fragment_shader, NULL);
    } else {
        g_object_set(glshader, "fragment", opaque_fragment_shader, NULL);
    }
    g_object_set(glshader, "vertex", vertex_shader, NULL);
    gst_encoder_pipeline->glshader = glshader;
    gst_encoder_pipeline->shader_capsfilter = gst_bin_get_by_name(
            GST_BIN(gst_encoder_pipeline->pipeline), "shader_capsfilter");
    if(gst_encoder_pipeline->shader_capsfilter == NULL) {
        g_error("Can't get element with name 'shader_capsfilter' from encoding pipeline. Missing gstreamer plugin element?");
    }

    gst_encoder_pipeline->app_src = GST_APP_SRC(
            gst_bin_get_by_name(GST_BIN(gst_encoder_pipeline->pipeline), "src"));
    if(gst_encoder_pipeline->app_src == NULL) {
        g_error("Can't get element with name 'src' from encoding pipeline. Missing gstreamer plugin element?");
    }
    gst_encoder_pipeline->app_sink = GST_APP_SINK(
            gst_bin_get_by_name(GST_BIN(gst_encoder_pipeline->pipeline), "sink"));
    if(gst_encoder_pipeline->app_sink == NULL) {
        g_error("Can't get element with name 'sink' from encoding pipeline. Missing gstreamer plugin element?");
    }

    callback_data = g_new0(struct sample_callback_data, 1);
    callback_data->encoder = encoder;
    callback_data->is_alpha = is_alpha;
    gst_app_sink_set_callbacks(gst_encoder_pipeline->app_sink, &sample_callback, (gpointer) callback_data,
                               NULL);
    if (encoder->gpu.westfield_egl) {
        ensure_gst_gl(encoder, gst_encoder_pipeline->pipeline);
        setup_pipeline_bus_listeners(encoder, gst_encoder_pipeline->pipeline);
    }

    return gst_encoder_pipeline;
}

static inline void
gst_encoder_create(struct encoder *encoder) {
    struct gst_encoder *gst_encoder = g_new0(struct gst_encoder, 1);
    gst_encoder->opaque_pipeline = (struct gst_encoder_pipeline *) gst_encoder_pipeline_create(encoder,
                                                                                               encoder->description->pipeline_definition,
                                                                                               false);
    if (gst_encoder->opaque_pipeline == NULL) {
        // TODO log pipeline creation failure
        g_free(gst_encoder);
        return;
    }

    if (encoder->description->split_alpha) {
        gst_encoder->alpha_pipeline = (struct gst_encoder_pipeline *) gst_encoder_pipeline_create(encoder,
                                                                                                  encoder->description->pipeline_definition,
                                                                                                  true);
        if (gst_encoder->alpha_pipeline == NULL) {
            // TODO cleanup opaque pipeline
            // TODO log alpha pipeline creation failure
            g_free(gst_encoder);
            return;
        }
    }

    encoder->impl = gst_encoder;
}


static inline int
gst_encoder_request_key_unit(struct encoder *encoder) {
    struct gst_encoder *gst_encoder = (struct gst_encoder *) encoder->impl;
    gst_element_send_event(gst_encoder->opaque_pipeline->pipeline, gst_event_new_custom(GST_EVENT_CUSTOM_DOWNSTREAM,
                                                                                        gst_structure_new(
                                                                                                "GstForceKeyUnit",
                                                                                                "all-headers",
                                                                                                G_TYPE_BOOLEAN, TRUE,
                                                                                                NULL)));
    gst_element_send_event(gst_encoder->alpha_pipeline->pipeline, gst_event_new_custom(GST_EVENT_CUSTOM_DOWNSTREAM,
                                                                                       gst_structure_new(
                                                                                               "GstForceKeyUnit",
                                                                                               "all-headers",
                                                                                               G_TYPE_BOOLEAN, TRUE,
                                                                                               NULL)));
}

static inline void
gst_encoder_pipeline_encode(struct gst_encoder_pipeline *gst_encoder_pipeline, GstBuffer *buffer) {
    if (buffer == NULL) {
        // TODO log error
        return;
    }

    GstFlowReturn ret;
    if (!gst_encoder_pipeline->playing) {
        gst_element_set_state(gst_encoder_pipeline->pipeline, GST_STATE_PLAYING);
        if (gst_element_get_state(gst_encoder_pipeline->pipeline, NULL, NULL, 0) == GST_STATE_CHANGE_FAILURE) {
            // TODO log error?
            return;
        }
        gst_encoder_pipeline->playing = true;
    }

    ret = gst_app_src_push_buffer(gst_encoder_pipeline->app_src, buffer);

    if (ret != GST_FLOW_OK) {
        /* We got some error, stop sending data */
        // TODO log error?
    }
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
gst_encoder_encode_shm(struct encoder *encoder, struct wl_shm_buffer *shm_buffer,
                       struct encoding_result *encoding_result) {
    struct gst_encoder *gst_encoder = (struct gst_encoder *) encoder->impl;
    GstCaps *new_src_caps;
    const uint32_t width = wl_shm_buffer_get_width(shm_buffer);
    const uint32_t height = wl_shm_buffer_get_height(shm_buffer);
    uint32_t coded_width, coded_height;
    const enum wl_shm_format buffer_format = wl_shm_buffer_get_format(shm_buffer);

    const struct shmbuf_support_format *shmbuf_support_format = shmbuf_support_format_from_wl_shm_format(buffer_format);
    if (shmbuf_support_format == NULL) {
        g_error("Failed to interpret shm format: %d", buffer_format);
    }

    new_src_caps = gst_caps_new_simple("video/x-raw",
                                       "framerate", GST_TYPE_FRACTION, FPS, 1,
                                       "format", G_TYPE_STRING, shmbuf_support_format->gst_format_string,
                                       "width", G_TYPE_INT, width,
                                       "height", G_TYPE_INT, height,
                                       NULL);

    gst_encoder_pipeline_config(gst_encoder->opaque_pipeline, encoder->description, new_src_caps,
                                width, height, &coded_width, &coded_height);
    gst_encoder_pipeline_encode(gst_encoder->opaque_pipeline,
                                wl_shm_buffer_to_gst_buffer(shm_buffer, width, height, shmbuf_support_format));

    if (shmbuf_support_format->has_alpha && encoder->description->split_alpha) {
        encoding_result->has_split_alpha = true;
        gst_encoder_pipeline_config(gst_encoder->alpha_pipeline, encoder->description, new_src_caps,
                                    width, height, &coded_width, &coded_height);
        gst_encoder_pipeline_encode(gst_encoder->alpha_pipeline,
                                    wl_shm_buffer_to_gst_buffer(shm_buffer, width, height, shmbuf_support_format));
    } else {
        encoding_result->has_split_alpha = false;
    }

    gst_caps_unref(new_src_caps);

    encoding_result->props.width = width;
    encoding_result->props.height = height;
    encoding_result->props.coded_width = coded_width;
    encoding_result->props.coded_height = coded_height;

    g_queue_push_head(encoder->encoding_results, encoding_result);
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

struct gl_memory_destroyed_data {
    struct encoder *encoder;
    GLuint tex;
    EGLImageKHR egl_image;
};

static void
gl_memory_destroyed(struct gl_memory_destroyed_data *gl_memory_destroyed_data) {
    gl_memory_destroyed_data->encoder->gpu.shared_gst_gl_context->gl_vtable->DeleteTextures(1,
                                                                                            &gl_memory_destroyed_data->tex);
    westfield_egl_destroy_image(gl_memory_destroyed_data->encoder->gpu.westfield_egl,
                                gl_memory_destroyed_data->egl_image);
    g_free(gl_memory_destroyed_data);
}

static inline GstBuffer *
create_gl_memory(struct encoder *encoder, const struct dmabuf_attributes *attributes, GstCaps *caps) {
    GstGLMemoryAllocator *allocator = gst_gl_memory_allocator_get_default(encoder->gpu.shared_gst_gl_context);
    GLuint wrapped_tex[] = {0};
    GstGLFormat formats[] = {GST_GL_RGBA8};
    GstBuffer *buffer = gst_buffer_new();
    GstVideoInfo *video_info = gst_video_info_new();
    gst_video_info_from_caps(video_info, caps);
    struct gl_memory_destroyed_data *gl_memory_destroyed_data = g_new0(struct gl_memory_destroyed_data, 1);
    GLenum target;
    GstGLVideoAllocationParams *params;
    gboolean ret;
    bool external_only;
    EGLImageKHR egl_image = westfield_egl_create_image_from_dmabuf(encoder->gpu.westfield_egl,
                                                                   attributes,
                                                                   &external_only);

    target = GL_TEXTURE_2D;
    encoder->gpu.shared_gst_gl_context->gl_vtable->GenTextures(1, wrapped_tex);
    encoder->gpu.shared_gst_gl_context->gl_vtable->BindTexture(target, wrapped_tex[0]);
    encoder->gpu.shared_gst_gl_context->gl_vtable->TexParameteri(target, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    encoder->gpu.shared_gst_gl_context->gl_vtable->TexParameteri(target, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
    encoder->gpu.shared_gst_gl_context->gl_vtable->EGLImageTargetTexture2D(target, egl_image);
    encoder->gpu.shared_gst_gl_context->gl_vtable->BindTexture(target, 0);

    gl_memory_destroyed_data->encoder = encoder;
    gl_memory_destroyed_data->egl_image = egl_image;
    gl_memory_destroyed_data->tex = wrapped_tex[0];

    params = gst_gl_video_allocation_params_new_wrapped_texture(
            encoder->gpu.shared_gst_gl_context,
            NULL,
            video_info,
            0,
            NULL,
            external_only
            ? GST_GL_TEXTURE_TARGET_EXTERNAL_OES
            : GST_GL_TEXTURE_TARGET_2D,
            GST_GL_RGBA8,
            wrapped_tex[0],
            // TODO cleanup texture
            gl_memory_destroyed_data,
            (GDestroyNotify) gl_memory_destroyed
    );

    ret = gst_gl_memory_setup_buffer(allocator, buffer, params,
                                     formats, (gpointer *) wrapped_tex, 1);
    if (!ret) {
        g_error ("Failed to setup gl memory.");
    }

    gst_gl_allocation_params_free((GstGLAllocationParams *) params);
    gst_object_unref(allocator);

    return buffer;
}

static inline GstBuffer *
dmabuf_attributes_to_gst_buffer(struct encoder *encoder,
                                const struct dmabuf_attributes *attributes,
                                GstCaps *caps) {
    GstBuffer *buffer = create_gl_memory(encoder, attributes, caps);
    GstGLSyncMeta *sync_meta = gst_buffer_get_gl_sync_meta (buffer);
    if (sync_meta) {
        gst_gl_sync_meta_set_sync_point(sync_meta, encoder->gpu.shared_gst_gl_context);
        gst_gl_sync_meta_wait(sync_meta, encoder->gpu.shared_gst_gl_context);
    }

    return buffer;
}

static inline void
gst_encoder_encode_dmabuf(struct encoder *encoder,
                          struct westfield_buffer *base,
                          struct dmabuf_attributes *attributes,
                          struct encoding_result *encoding_result) {
    struct gst_encoder *gst_encoder = (struct gst_encoder *) encoder->impl;
    GstCaps *new_src_caps;
    uint32_t coded_width, coded_height;

    const struct dmabuf_support_format *dmabuf_support_format = dmabuf_support_format_from_fourcc(attributes->format);
    if (dmabuf_support_format == NULL) {
        g_error("Can't encode buffer. Failed to interpret buffer's fourcc format: %c%c%c%c", GST_FOURCC_ARGS(attributes->format));
    }

    new_src_caps = gst_caps_new_simple("video/x-raw",
                                       "framerate", GST_TYPE_FRACTION, FPS, 1,
                                       "format", G_TYPE_STRING, dmabuf_support_format->gst_format_string,
                                       "width", G_TYPE_INT, base->width,
                                       "height", G_TYPE_INT, base->height,
                                       NULL);
    gst_encoder_pipeline_config(gst_encoder->opaque_pipeline, encoder->description, new_src_caps,
                                base->width, base->height, &coded_width, &coded_height);
    gst_encoder_pipeline_encode(gst_encoder->opaque_pipeline,
                                dmabuf_attributes_to_gst_buffer(encoder, attributes, new_src_caps));

    if (dmabuf_support_format->has_alpha && encoder->description->split_alpha) {
        encoding_result->has_split_alpha = true;
        gst_encoder_pipeline_config(gst_encoder->alpha_pipeline, encoder->description, new_src_caps,
                                    base->width, base->height, &coded_width, &coded_height);
        gst_encoder_pipeline_encode(gst_encoder->alpha_pipeline,
                                    dmabuf_attributes_to_gst_buffer(encoder, attributes, new_src_caps));
    } else {
        encoding_result->has_split_alpha = false;
    }

    gst_caps_unref(new_src_caps);

    encoding_result->props.width = base->width;
    encoding_result->props.height = base->height;
    encoding_result->props.coded_width = coded_width;
    encoding_result->props.coded_height = coded_height;

    g_queue_push_head(encoder->encoding_results, encoding_result);

    // TODO memory management/lifecycle of buffer? ie handle case where buffer is destroyed by client while it's being encoded, see weston remoting implementation?
}

static inline void
gst_encoder_encode(struct encoder *encoder, struct wl_resource *buffer_resource,
                   struct encoding_result *encoding_result) {
    struct wl_shm_buffer *shm_buffer;
    struct westfield_dmabuf_v1_buffer *westfield_dmabuf_v1_buffer;
    struct westfield_drm_buffer *westfield_drm_buffer;
    encoding_result->props.encoding_type = encoder->description->encoding_type;

    if (westfield_dmabuf_v1_resource_is_buffer(buffer_resource)) {
        westfield_dmabuf_v1_buffer = westfield_dmabuf_v1_buffer_from_buffer_resource(buffer_resource);
        gst_encoder_encode_dmabuf(encoder, &westfield_dmabuf_v1_buffer->base,
                                  &westfield_dmabuf_v1_buffer->attributes, encoding_result);
        return;
    }

    if (westfield_drm_buffer_is_resource(buffer_resource)) {
        westfield_drm_buffer = westfield_drm_buffer_from_resource(buffer_resource);
        gst_encoder_encode_dmabuf(encoder, &westfield_drm_buffer->base,
                                  &westfield_drm_buffer->dmabuf, encoding_result);
        return;
    }

    shm_buffer = wl_shm_buffer_get(buffer_resource);
    if (shm_buffer) {
        gst_encoder_encode_shm(encoder, shm_buffer, encoding_result);
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

    if (westfield_dmabuf_v1_resource_is_buffer(buffer_resource)) {
        struct westfield_dmabuf_v1_buffer *westfield_dmabuf_v1_buffer = westfield_dmabuf_v1_buffer_from_buffer_resource(
                buffer_resource);
        width = westfield_dmabuf_v1_buffer->base.width;
        height = westfield_dmabuf_v1_buffer->base.height;

        if (width * height <= 256 * 256) {
            return true;
        }
    }

    if (westfield_drm_buffer_is_resource(buffer_resource)) {
        struct westfield_drm_buffer *westfield_drm_buffer = westfield_drm_buffer_from_resource(buffer_resource);
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
    struct westfield_dmabuf_v1_buffer *westfield_dmabuf_v1_buffer;
    struct westfield_drm_buffer *westfield_drm_buffer;

    if (strcmp(encoder_itf->name, "png") == 0) {
        return png_gst_encoder_supports_buffer(buffer_resource);
    }

    // different encoder preferred so not for this interface
    if (strcmp(encoder_itf->name, preferred_encoder) != 0) {
        return false;
    }

    if (westfield_dmabuf_v1_resource_is_buffer(buffer_resource)) {
        westfield_dmabuf_v1_buffer = westfield_dmabuf_v1_buffer_from_buffer_resource(buffer_resource);
        width = westfield_dmabuf_v1_buffer->base.width;
        height = westfield_dmabuf_v1_buffer->base.height;

        // Too small needs the png encoder so refuse
        if (width * height <= 256 * 256) {
            return false;
        }

        return true;
    }

    if (westfield_drm_buffer_is_resource(buffer_resource)) {
        westfield_drm_buffer = westfield_drm_buffer_from_resource(buffer_resource);
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
                                       "glupload name=upload ! "
                                       "glcolorconvert ! "
                                       "glshader name=shader ! "
                                       "capsfilter name=shader_capsfilter ! "
                                       "glcolorconvert ! video/x-raw(memory:GLMemory),format=I420 ! "
                                       "gldownload ! "
                                       "x264enc rc-lookahead=0 sliced-threads=true qp-max=20 byte-stream=true pass=pass1 tune=zerolatency speed-preset=superfast noise-reduction=0 psy-tune=grain ! "
                                       "video/x-h264,profile=constrained-baseline,stream-format=byte-stream,alignment=au ! "
                                       "appsink name=sink ",
                .split_alpha = true,
                .width_multiple = 16,
                .height_multiple = 16,
                .min_width = 16,
                .min_height = 16,
        },
        {
                .name = "nvh264",
                .encoding_type = h264,
                .pipeline_definition = "appsrc name=src format=3 stream-type=0 block=true max-buffers=60 ! "
                                       "glupload name=upload ! "
                                       "glcolorconvert ! "
                                       "glshader name=shader ! "
                                       "capsfilter name=shader_capsfilter ! "
                                       "glcolorconvert ! video/x-raw(memory:GLMemory),format=NV12 ! "
                                       "nvh264enc qp-max=20 zerolatency=true preset=5 rc-mode=4 ! "
                                       "video/x-h264,profile=baseline,stream-format=byte-stream,alignment=au ! "
                                       "appsink name=sink ",
                .split_alpha = true,
                .width_multiple = 16,
                .height_multiple = 16,
                .min_width = 16,
                .min_height = 16,
        },
        {
                .name = "vaapih264",
                .encoding_type = h264,
                .pipeline_definition = "appsrc name=src format=3 stream-type=0 ! "
                                       "glupload name=upload ! "
                                       "glcolorconvert ! "
                                       "glshader name=shader ! "
                                       "capsfilter name=shader_capsfilter ! "
                                       "glcolorconvert ! video/x-raw(memory:GLMemory),format=NV12 ! "
                                       "gldownload ! "
                                       "vaapih264enc aud=1 ! "
                                       "video/x-h264,profile=constrained-baseline,stream-format=byte-stream,alignment=au ! "
                                       "appsink name=sink",
                .split_alpha = true,
                .width_multiple = 16,
                .height_multiple = 16,
                .min_width = 16,
                .min_height = 16,
        },
        // always keep png last as fallback encoder
        {
                .name = "png",
                .encoding_type = png,
                .pipeline_definition = "appsrc name=src format=3 stream-type=0 ! "
                                       "glupload name=upload ! "
                                       "glcolorconvert ! "
                                       "glshader name=shader ! "
                                       "capsfilter name=shader_capsfilter ! "
                                       "glcolorconvert ! video/x-raw(memory:GLMemory),format=RGBA ! "
                                       "gldownload ! "
                                       "pngenc ! "
                                       "appsink name=sink",
                .split_alpha = false,
                .width_multiple = 1,
                .height_multiple = 1,
                .min_width = 16,
                .min_height = 16,
        }
};

int
do_gst_init() {
    gst_init(NULL, NULL);
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
    encoder->gpu.westfield_egl = westfield_egl;

    *encoder_pp = encoder;
}

void
do_gst_encoder_encode(struct encoder **encoder_pp, struct wl_resource *buffer_resource, uint32_t serial) {
    struct encoder *encoder = *encoder_pp;
    struct encoding_result *encoding_result;
    const size_t nro_encoders = sizeof(encoder_descriptions) / sizeof(encoder_descriptions[0]);

    if (encoder->impl != NULL) {
        if (!encoder_description_supports_buffer(encoder->description, encoder->preferred_encoder, buffer_resource)) {
            gst_encoder_destroy(encoder);
            encoder->impl = NULL;
        }
    }

    if (encoder->impl == NULL) {
        for (int i = 0; i < nro_encoders; i++) {
            if (encoder_description_supports_buffer(&encoder_descriptions[i], encoder->preferred_encoder,
                                                    buffer_resource)) {
                encoder->description = &encoder_descriptions[i];
                gst_encoder_create(encoder);
                assert(encoder->impl != NULL && "Found matching encoder but implementation was still NULL");
                break;
            }
        }
    }

    assert(encoder->impl != NULL && "No matching encoder found for buffer");

    encoding_result = g_new0(struct encoding_result, 1);
    g_mutex_init(&encoding_result->mutex);
    encoding_result->props.serial = serial;
    encoding_result->props.buffer_id = wl_resource_get_id(buffer_resource);
    gst_encoder_encode(encoder, buffer_resource, encoding_result);
}

void
do_gst_encoder_free(struct encoder **encoder_pp) {
    struct encoder *encoder = *encoder_pp;
    gst_encoder_destroy(encoder);
    // TODO drain the queue & send encoded frames anyway?
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
    gst_encoder_request_key_unit(encoder);
}
