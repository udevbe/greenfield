#include "westfield.h"
#include <glib.h>
#include <gst/gst.h>
#include <gst/allocators/gstdmabuf.h>
#include <gst/gl/gstglcontext.h>
#include <gst/gl/gstglwindow.h>
#include <gst/gl/egl/gstgldisplay_egl.h>
#include <gst/gl/egl/gsteglimage.h>
#include <gst/gl/egl/gstgldisplay_egl_device.h>
#include <gst/app/gstappsrc.h>
#include <gst/app/gstappsink.h>
#include <assert.h>
#include <stdbool.h>
#include <EGL/egl.h>
#include <drm_fourcc.h>
#include <unistd.h>
#include "encoder.h"
#include "westfield-linux-dmabuf-v1.h"

#define FPS 60

static const char *opaque_fragment_shader =
        "#version 120\n"
        "#ifdef GL_ES\n"
        "    precision mediump float;\n"
        "#endif\n"
        "varying vec2 v_texcoord;\n"
        "uniform sampler2D tex;\n"
        "void main () {\n"
        "        gl_FragColor = texture2D(tex, v_texcoord);\n"
        "}";

static const char *alpha_fragment_shader =
        "#version 120\n"
        "#ifdef GL_ES\n"
        "    precision mediump float;\n"
        "#endif\n"
        "varying vec2 v_texcoord;\n"
        "uniform sampler2D tex;\n"
        "void main () {\n"
        "        vec4 pix = texture2D(tex, v_texcoord);\n"
        "        gl_FragColor = vec4(pix.a, pix.a, pix.a, 0.);\n"
        "}";

static const char *vertex_shader =
        "#version 120\n"
        "#ifdef GL_ES\n"
        "    precision mediump float;\n"
        "#endif\n"
        "attribute vec4 a_position;\n"
        "attribute vec2 a_texcoord;\n"
        "varying vec2 v_texcoord;\n"
        "uniform float scale_x;\n"
        "uniform float scale_y;\n"
        "void main() {\n"
        "        gl_Position = vec4((a_position.x*scale_x)-(1.-scale_x)*2., (a_position.y*scale_y)-(1.-scale_y)*2., 1., 1.);\n"
        "        v_texcoord = a_texcoord;\n"
        "}";

enum encoding_type {
    h264,
    png
};

struct encoding_result {
    uint32_t buffer_id;
    uint32_t serial;
    enum encoding_type encoding_type;
    uint32_t width;
    uint32_t height;
    struct {
        GstMapInfo info;
        GstBuffer *buffer;
    } sample;
    bool has_split_alpha;
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
    struct westfield_drm *drm_context;

    GstContext *gst_context_gl_display;
    GstContext *gst_context_gl_context;
};

struct gst_encoder_pipeline {
    GstAllocator *dma_buf_allocator;
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

static void
ensure_gst_gl(struct encoder *encoder, GstElement *pipeline) {
    if (!encoder->gst_context_gl_display) {
        GstGLDisplay *gst_gl_display;

        EGLDeviceEXT egl_device = westfield_drm_get_egl_device(encoder->drm_context);
        EGLDisplay egl_display = westfield_drm_get_egl_display(encoder->drm_context);
        if (egl_device) {
            gst_gl_display = GST_GL_DISPLAY(gst_gl_display_egl_device_new_with_egl_device(egl_device));
        } else {
            gst_gl_display = GST_GL_DISPLAY(gst_gl_display_egl_new_with_egl_display(egl_display));
        }
        GstContext *gst_context_gl_display = gst_context_new(GST_GL_DISPLAY_CONTEXT_TYPE, TRUE);
        gst_context_set_gl_display(gst_context_gl_display, gst_gl_display);
        encoder->gst_context_gl_display = gst_context_gl_display;

        if (!encoder->gst_context_gl_context) {
            gboolean ret;
            EGLContext egl_context = westfield_drm_get_egl_context(encoder->drm_context);
            eglMakeCurrent(egl_display, EGL_NO_SURFACE, EGL_NO_SURFACE, egl_context);

            if (egl_context == NULL) {
                GST_ERROR_OBJECT (gst_gl_display, "Failed to find EGL context.");
                return;
            }

            GstGLContext *gst_gl_context = gst_gl_context_new_wrapped(gst_gl_display,
                                                                      (guintptr) egl_context,
                                                                      GST_GL_PLATFORM_EGL,
                                                                      GST_GL_API_OPENGL);
            ret = gst_gl_context_activate(gst_gl_context, true);
            if (!ret) {
                GST_ERROR_OBJECT (gst_gl_context, "Failed to activate the wrapped EGL Context.");
                return;
            }

            GError *error = NULL;
            ret = gst_gl_context_fill_info(gst_gl_context, &error);
            if (!ret) {
                GST_ERROR_OBJECT (gst_gl_context, "Failed to create gpu process context: %s",
                                  error->message);
                g_error_free(error);
                // TODO unref context?
                return;
            }

            GstContext *gst_context_gl_context = gst_context_new("gst.gl.app_context", TRUE);
            gst_structure_set(gst_context_writable_structure(gst_context_gl_context), "context", GST_TYPE_GL_CONTEXT,
                              gst_gl_context, NULL);
            encoder->gst_context_gl_context = gst_context_gl_context;
        }
    }

    gst_element_set_context(pipeline, encoder->gst_context_gl_context);
    gst_element_set_context(pipeline, encoder->gst_context_gl_display);
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
            sizeof(encoding_result->buffer_id) + // bufferId: uin32LE
            sizeof(encoding_result->serial) + // serial: uin32LE
            sizeof(encoding_result->encoding_type) + // encodingType: uint32LE
            sizeof(encoding_result->width) + // width: uint32LE
            sizeof(encoding_result->height) + // height: uint32LE
            sizeof(uint32_t) + // fragment opaque length (uin32LE)
            opaque_length +
            sizeof(uint32_t) + // fragment alpha length (uin32LE)
            alpha_length;
    void *frame_blob = malloc(encoded_frame_size);

    memcpy(frame_blob + offset, &opcode, sizeof(opcode));
    offset += sizeof(opcode);

    memcpy(frame_blob + offset, &encoding_result->buffer_id, sizeof(encoding_result->buffer_id));
    offset += sizeof(encoding_result->buffer_id);

    memcpy(frame_blob + offset, &encoding_result->serial, sizeof(encoding_result->serial));
    offset += sizeof(encoding_result->serial);

    memcpy(frame_blob + offset, &encoding_result->encoding_type, sizeof(encoding_result->encoding_type));
    offset += sizeof(encoding_result->encoding_type);

    memcpy(frame_blob + offset, &encoding_result->width, sizeof(encoding_result->width));
    offset += sizeof(encoding_result->width);

    memcpy(frame_blob + offset, &encoding_result->height, sizeof(encoding_result->height));
    offset += sizeof(encoding_result->height);

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
        // TODO log error
        return GST_FLOW_ERROR;
    }

    encoding_result = g_queue_peek_tail(callback_data->encoder->encoding_results);
    if (encoding_result == NULL) {
        // TODO log error
        return GST_FLOW_ERROR;
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

static GstBuffer *
wl_shm_buffer_to_gst_buffer(struct wl_shm_buffer *shm_buffer, uint32_t *width, uint32_t *height, char *gst_format,
                            bool *has_alpha) {
    void *buffer_data;
    struct wl_shm_pool *shm_pool;
    enum wl_shm_format buffer_format;
    uint32_t buffer_width, buffer_height, buffer_stride;
    gsize buffer_size;

    buffer_format = wl_shm_buffer_get_format(shm_buffer);

    if (buffer_format == WL_SHM_FORMAT_ARGB8888) {
        strcpy(gst_format, "BGRA");
        *has_alpha = true;
    } else if (buffer_format == WL_SHM_FORMAT_XRGB8888) {
        strcpy(gst_format, "BGRx");
        *has_alpha = false;
    } else {
        return NULL;
    }

    shm_pool = wl_shm_buffer_ref_pool(shm_buffer);

    buffer_data = wl_shm_buffer_get_data(shm_buffer);
    buffer_stride = wl_shm_buffer_get_stride(shm_buffer);
    buffer_width = wl_shm_buffer_get_width(shm_buffer);
    buffer_height = wl_shm_buffer_get_height(shm_buffer);
    buffer_size = buffer_stride * buffer_height;

    *width = buffer_width;
    *height = buffer_height;

    return gst_buffer_new_wrapped_full(0, (gpointer) buffer_data, buffer_size, 0, buffer_size, shm_pool,
                                       (GDestroyNotify) wl_shm_pool_unref);
}

static inline bool
gst_encoder_pipeline_config(struct gst_encoder_pipeline *gst_encoder_pipeline,
                            const struct encoder_description *encoder_definition,
                            const GstCaps *new_src_caps,
                            const u_int32_t width,
                            const u_int32_t height) {
    const GstCaps *current_src_caps = gst_app_src_get_caps(gst_encoder_pipeline->app_src);
    GstStructure *uniforms;
    GstCaps *shader_src_caps;
    gchar *capsstr;
    u_int32_t encoded_width = width;
    u_int32_t encoded_height = height;

    if (current_src_caps && gst_caps_is_equal(current_src_caps, new_src_caps)) {
        gst_caps_unref((GstCaps *) new_src_caps);
        gst_caps_unref((GstCaps *) current_src_caps);
        return false;
    } else if (current_src_caps) {
        gst_caps_unref((GstCaps *) current_src_caps);
    }

    gst_app_src_set_caps(gst_encoder_pipeline->app_src, new_src_caps);
    gst_caps_unref((GstCaps *) new_src_caps);

    if(encoded_width < encoder_definition->min_width) {
        encoded_width = encoder_definition->min_width;
    }
    if(encoded_height < encoder_definition->min_height) {
        encoded_height = encoder_definition->min_height;
    }
    encoded_width = encoded_width + (encoded_width % encoder_definition->width_multiple);
    encoded_height = encoded_height + (encoded_height % encoder_definition->height_multiple);

    gfloat scale_x = (gfloat) width / (gfloat) encoded_width;
    gfloat scale_y = (gfloat) height / (gfloat) encoded_height;

    uniforms = gst_structure_new("uniforms",
                                 "scale_x", G_TYPE_FLOAT, scale_x,
                                 "scale_y", G_TYPE_FLOAT, scale_y,
                                 NULL);

    capsstr = g_strdup_printf("video/x-raw(memory:GLMemory),width=%d,height=%d",
                              encoded_width, encoded_height);
    shader_src_caps = gst_caps_from_string(capsstr);
    g_free(capsstr);

    g_object_set(gst_encoder_pipeline->glshader, "uniforms", uniforms, NULL);
    g_object_set(gst_encoder_pipeline->shader_capsfilter, "caps", shader_src_caps, NULL);

    gst_structure_free(uniforms);
    gst_caps_unref(shader_src_caps);

    return false;
}

static inline void
gst_encoder_pipeline_destroy(struct gst_encoder_pipeline *gst_encoder_pipeline) {
    gst_element_set_state(gst_encoder_pipeline->pipeline, GST_STATE_NULL);
    gst_object_unref(GST_OBJECT(gst_encoder_pipeline->app_src));
    gst_object_unref(GST_OBJECT(gst_encoder_pipeline->app_sink));
    gst_object_unref(GST_OBJECT(gst_encoder_pipeline->pipeline));
    gst_object_unref(GST_OBJECT(gst_encoder_pipeline->dma_buf_allocator));
    gst_object_unref(GST_OBJECT(gst_encoder_pipeline->glshader));
    gst_object_unref(GST_OBJECT(gst_encoder_pipeline->shader_capsfilter));

    gst_encoder_pipeline->app_src = NULL;
    gst_encoder_pipeline->app_sink = NULL;
    gst_encoder_pipeline->pipeline = NULL;
    gst_encoder_pipeline->dma_buf_allocator = NULL;
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
            if (g_strcmp0(context_type, GST_GL_DISPLAY_CONTEXT_TYPE) == 0 && encoder->drm_context) {
                gst_element_set_context(GST_ELEMENT (msg->src), encoder->gst_context_gl_display);
            }

            if (g_strcmp0(context_type, "gst.gl.app_context") == 0) {
                gst_element_set_context(GST_ELEMENT (msg->src), encoder->gst_context_gl_context);
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
        // TODO log pipeline creation failure
        return NULL;
    }
    setup_pipeline_bus_listeners(encoder, gst_encoder_pipeline->pipeline);

    GstElement *glshader = gst_bin_get_by_name(GST_BIN(gst_encoder_pipeline->pipeline), "shader");
    if (is_alpha) {
        g_object_set(glshader, "fragment", alpha_fragment_shader, NULL);
    } else {
        g_object_set(glshader, "fragment", opaque_fragment_shader, NULL);
    }
    g_object_set(glshader, "vertex", vertex_shader, NULL);
    gst_encoder_pipeline->glshader = glshader;
    gst_encoder_pipeline->shader_capsfilter = gst_bin_get_by_name(
            GST_BIN(gst_encoder_pipeline->pipeline), "shader_capsfilter");

    gst_encoder_pipeline->app_src = GST_APP_SRC(
            gst_bin_get_by_name(GST_BIN(gst_encoder_pipeline->pipeline), "src"));
    gst_encoder_pipeline->app_sink = GST_APP_SINK(
            gst_bin_get_by_name(GST_BIN(gst_encoder_pipeline->pipeline), "sink"));

    callback_data = g_new0(struct sample_callback_data, 1);
    callback_data->encoder = encoder;
    callback_data->is_alpha = is_alpha;
    gst_app_sink_set_callbacks(gst_encoder_pipeline->app_sink, &sample_callback, (gpointer) callback_data,
                               NULL);
    ensure_gst_gl(encoder, gst_encoder_pipeline->pipeline);

    return gst_encoder_pipeline;
}

static bool
gst_encoder_create(struct encoder *encoder) {
    struct gst_encoder *gst_encoder = g_new0(struct gst_encoder, 1);
    gst_encoder->alpha_pipeline = (struct gst_encoder_pipeline *) gst_encoder_pipeline_create(encoder,
                                                                                              encoder->description->pipeline_definition,
                                                                                              true);
    if (gst_encoder->alpha_pipeline == NULL) {
        g_free(gst_encoder);
        // TODO log alpha pipeline creation failure
        return true;
    }
    gst_encoder->alpha_pipeline->dma_buf_allocator = gst_dmabuf_allocator_new();

    gst_encoder->opaque_pipeline = (struct gst_encoder_pipeline *) gst_encoder_pipeline_create(encoder,
                                                                                               encoder->description->pipeline_definition,
                                                                                               false);
    if (gst_encoder->opaque_pipeline == NULL) {
        g_free(gst_encoder);
        // TODO cleanup alpha pipeline
        // TODO log pipeline creation failure
        return true;
    }
    gst_encoder->opaque_pipeline->dma_buf_allocator = gst_dmabuf_allocator_new();

    encoder->impl = gst_encoder;
    return false;
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

static inline bool
gst_encoder_pipeline_encode(struct gst_encoder_pipeline *gst_encoder_pipeline, GstBuffer *buffer) {
    GstFlowReturn ret;
    if (!gst_encoder_pipeline->playing) {
        gst_element_set_state(gst_encoder_pipeline->pipeline, GST_STATE_PLAYING);
        if (gst_element_get_state(gst_encoder_pipeline->pipeline, NULL, NULL, 0) == GST_STATE_CHANGE_FAILURE) {
            return -1;
        }
        gst_encoder_pipeline->playing = true;
    }

    ret = gst_app_src_push_buffer(gst_encoder_pipeline->app_src, buffer);

    if (ret != GST_FLOW_OK) {
        /* We got some error, stop sending data */
        return true;
    }

    return false;
}

static inline bool
gst_encoder_encode_shm(struct encoder *encoder, struct wl_shm_buffer *shm_buffer,
                       struct encoding_result *encoding_result) {
    struct gst_encoder *gst_encoder = (struct gst_encoder *) encoder->impl;

    GstBuffer *opaque_buffer;
    GstBuffer *alpha_buffer;
    uint32_t buffer_width, buffer_height;
    bool buffer_has_alpha;
    char gst_format[16];

    opaque_buffer = wl_shm_buffer_to_gst_buffer(shm_buffer, &buffer_width, &buffer_height, gst_format,
                                                &buffer_has_alpha);
    if (opaque_buffer == NULL) {
        return true;
    }
    const GstCaps *new_opaque_src_caps = gst_caps_new_simple("video/x-raw",
                                                             "framerate", GST_TYPE_FRACTION, FPS, 1,
                                                             "format", G_TYPE_STRING, gst_format,
                                                             "width", G_TYPE_INT, buffer_width,
                                                             "height", G_TYPE_INT, buffer_height,
                                                             NULL);
    if (gst_encoder_pipeline_config(gst_encoder->opaque_pipeline, encoder->description, new_opaque_src_caps,
                                    buffer_width, buffer_height)) {
        gst_buffer_unref(opaque_buffer);
        // TODO log opaque encoding config error?
        return true;
    }
    if (gst_encoder_pipeline_encode(gst_encoder->opaque_pipeline, opaque_buffer)) {
        // TODO log opaque encoding pipeline error?
        return true;
    }

    if (buffer_has_alpha && encoder->description->split_alpha) {
        encoding_result->has_split_alpha = true;
        alpha_buffer = wl_shm_buffer_to_gst_buffer(shm_buffer, &buffer_width, &buffer_height, gst_format,
                                                   &buffer_has_alpha);
        if (alpha_buffer == NULL) {
            return true;
        }
        const GstCaps *new_alpha_src_caps = gst_caps_new_simple("video/x-raw",
                                                                "framerate", GST_TYPE_FRACTION, FPS, 1,
                                                                "format", G_TYPE_STRING, gst_format,
                                                                "width", G_TYPE_INT, buffer_width,
                                                                "height", G_TYPE_INT, buffer_height,
                                                                NULL);
        if (gst_encoder_pipeline_config(gst_encoder->alpha_pipeline, encoder->description, new_alpha_src_caps,
                                        buffer_width, buffer_height)) {
            gst_buffer_unref(alpha_buffer);
            // TODO log alpha encoding config error?
            return true;
        }
        if (gst_encoder_pipeline_encode(gst_encoder->alpha_pipeline, alpha_buffer)) {
            // TODO log alpha encoding pipeline error?
            return true;
        }
    } else {
        encoding_result->has_split_alpha = false;
    }

    encoding_result->width = buffer_width;
    encoding_result->height = buffer_height;
    g_queue_push_head(encoder->encoding_results, encoding_result);

    return false;
}

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
        // TODO more
//        return "GBRA";
//        return "GBR";
//        return "RGBP";
//        return "BGRP";
//        return "Y444";
//        return "I420";
//        return "YV12";
//        return "Y42B";
//        return "Y41B";
//        return "NV12";
//        return "NV21";
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

static inline const struct dmabuf_support_format *
gst_raw_video_format_from_fourcc(const uint32_t fourcc) {
    const size_t dmabuf_supported_formats_size = sizeof(dmabuf_supported_formats) / sizeof(dmabuf_supported_formats[0]);
    for (int i = 0; i < dmabuf_supported_formats_size; ++i) {
        if (dmabuf_supported_formats[i].drm_format == fourcc) {
            return &dmabuf_supported_formats[i];
        }
    }
    return NULL;
}

static inline GstBuffer *
westfield_dmabuf_to_gst_buffer(struct gst_encoder_pipeline *gst_encoder_pipeline,
                               const struct westfield_dmabuf_v1_buffer *westfield_dmabuf_v1_buffer,
                               const struct dmabuf_support_format *dmabuf_support_format) {
    GstBuffer *buf = gst_buffer_new();

    gsize offsets[westfield_dmabuf_v1_buffer->attributes.n_planes];
    gint strides[westfield_dmabuf_v1_buffer->attributes.n_planes];

    for (int i = 0; i < westfield_dmabuf_v1_buffer->attributes.n_planes; ++i) {
        offsets[i] = westfield_dmabuf_v1_buffer->attributes.offset[i];
        strides[i] = (gint) westfield_dmabuf_v1_buffer->attributes.stride[i];
        GstMemory *mem = gst_dmabuf_allocator_alloc_with_flags(gst_encoder_pipeline->dma_buf_allocator,
                                                               westfield_dmabuf_v1_buffer->attributes.fd[i],
                                                               westfield_dmabuf_v1_buffer->attributes.stride[i] *
                                                               westfield_dmabuf_v1_buffer->attributes.height,
                                                               GST_FD_MEMORY_FLAG_DONT_CLOSE);
        gst_buffer_append_memory(buf, mem);
    }
    gst_buffer_add_video_meta_full(buf,
                                   GST_VIDEO_FRAME_FLAG_NONE,
                                   dmabuf_support_format->gst_video_format,
                                   westfield_dmabuf_v1_buffer->base.width,
                                   westfield_dmabuf_v1_buffer->base.height,
                                   westfield_dmabuf_v1_buffer->attributes.n_planes,
                                   offsets,
                                   strides);
    return buf;
}

static inline bool
gst_encoder_encode_linux_dmabuf_v1(struct encoder *encoder, struct wl_resource *buffer,
                                   struct encoding_result *encoding_result) {
    struct gst_encoder *gst_encoder = (struct gst_encoder *) encoder->impl;
    const struct westfield_dmabuf_v1_buffer *westfield_dmabuf_v1_buffer = westfield_dmabuf_v1_buffer_from_buffer_resource(
            buffer);
    GstCaps *new_opaque_src_caps, *new_alpha_src_caps;

    const struct dmabuf_support_format *dmabuf_support_format = gst_raw_video_format_from_fourcc(
            westfield_dmabuf_v1_buffer->attributes.format);
    if (dmabuf_support_format == NULL) {
        // TODO log error
        //GST_ERROR_OBJECT (gst_encoder->app_src, "Failed to interpret fourcc format: %c%c%c%c", GST_FOURCC_ARGS(westfield_dmabuf_v1_buffer->attributes.format));
        return true;
    }

    new_opaque_src_caps = gst_caps_new_simple("video/x-raw",
                                              "framerate", GST_TYPE_FRACTION, FPS, 1,
                                              "format", G_TYPE_STRING,
                                              dmabuf_support_format->gst_format_string,
                                              "width", G_TYPE_INT, westfield_dmabuf_v1_buffer->base.width,
                                              "height", G_TYPE_INT, westfield_dmabuf_v1_buffer->base.height,
                                              NULL);

    GstCapsFeatures *new_src_caps_feature = gst_caps_features_new_single(GST_CAPS_FEATURE_MEMORY_DMABUF);
    gst_caps_set_features_simple(new_opaque_src_caps, new_src_caps_feature);

    if (gst_encoder_pipeline_config(gst_encoder->opaque_pipeline, encoder->description, new_opaque_src_caps,
                                    westfield_dmabuf_v1_buffer->base.width, westfield_dmabuf_v1_buffer->base.height)) {
        // TODO log opaque encoding config error?
        return true;
    }
    gst_encoder_pipeline_encode(gst_encoder->opaque_pipeline,
                                westfield_dmabuf_to_gst_buffer(gst_encoder->opaque_pipeline,
                                                               westfield_dmabuf_v1_buffer,
                                                               dmabuf_support_format));

    if (dmabuf_support_format->has_alpha && encoder->description->split_alpha) {
        encoding_result->has_split_alpha = true;
        new_alpha_src_caps = gst_caps_new_simple("video/x-raw",
                                                 "framerate", GST_TYPE_FRACTION, FPS, 1,
                                                 "format", G_TYPE_STRING,
                                                 dmabuf_support_format->gst_format_string,
                                                 "width", G_TYPE_INT, westfield_dmabuf_v1_buffer->base.width,
                                                 "height", G_TYPE_INT, westfield_dmabuf_v1_buffer->base.height,
                                                 NULL);
        if (gst_encoder_pipeline_config(gst_encoder->alpha_pipeline, encoder->description, new_alpha_src_caps,
                                        westfield_dmabuf_v1_buffer->base.width,
                                        westfield_dmabuf_v1_buffer->base.height)) {
            // TODO log opaque encoding config error?
            return true;
        }
        gst_encoder_pipeline_encode(gst_encoder->alpha_pipeline,
                                    westfield_dmabuf_to_gst_buffer(gst_encoder->alpha_pipeline,
                                                                   westfield_dmabuf_v1_buffer,
                                                                   dmabuf_support_format));
    } else {
        encoding_result->has_split_alpha = false;
    }


    encoding_result->width = westfield_dmabuf_v1_buffer->base.width;
    encoding_result->height = westfield_dmabuf_v1_buffer->base.height;
    g_queue_push_head(encoder->encoding_results, encoding_result);

    // TODO memory management/lifecycle of buffer? ie handle case where buffer is destroyed by client while it's being encoded, see weston remoting implementation.

    return false;
}

static inline bool
gst_encoder_encode(struct encoder *encoder, struct wl_resource *buffer_resource,
                   struct encoding_result *encoding_result) {
    struct wl_shm_buffer *shm_buffer;
    encoding_result->encoding_type = encoder->description->encoding_type;

    if (westfield_dmabuf_v1_resource_is_buffer(buffer_resource)) {
        return gst_encoder_encode_linux_dmabuf_v1(encoder, buffer_resource, encoding_result);
    }

    shm_buffer = wl_shm_buffer_get((struct wl_resource *) buffer_resource);
    if (shm_buffer) {
        return gst_encoder_encode_shm(encoder, shm_buffer, encoding_result);
    }

    return true;
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

    return false;
}

static inline bool
encoder_description_supports_buffer(const struct encoder_description *encoder_itf, const char *preferred_encoder,
                                    struct wl_resource *buffer_resource) {
    int32_t width, height;
    struct wl_shm_buffer *shm_buffer;
    struct westfield_dmabuf_v1_buffer *westfield_dmabuf_v1_buffer;

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
                                       "x264enc rc-lookahead=0 sliced-threads=true qp-max=20 byte-stream=true pass=pass1 tune=zerolatency speed-preset=superfast noise-reduction=0 psy-tune=grain ! "
                                       "video/x-h264,profile=constrained-baseline,stream-format=byte-stream,alignment=au ! "
                                       "appsink name=sink ",
                .split_alpha = true,
                .width_multiple = 2,
                .height_multiple = 2,
                .min_width = 4,
                .min_height = 4,
        },
        {
                .name = "nvh264",
                .encoding_type = h264,
                .pipeline_definition = "appsrc name=src format=3 stream-type=0 ! "
                                       "glupload ! "
                                       "glcolorconvert ! "
                                       "glshader name=shader ! "
                                       "capsfilter name=shader_capsfilter ! "
                                       "glcolorconvert ! video/x-raw(memory:GLMemory),format=NV12 ! "
                                       "nvh264enc qp-max=20 zerolatency=true preset=5 rc-mode=4 ! "
                                       "video/x-h264,profile=baseline,stream-format=byte-stream,alignment=au ! "
                                       "appsink name=sink ",
                .split_alpha = true,
                .width_multiple = 2,
                .height_multiple = 2,
                .min_width = 4,
                .min_height = 4,
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
                                       "vaapih264enc aud=1 ! "
                                       "video/x-h264,profile=constrained-baseline,stream-format=byte-stream,alignment=au ! "
                                       "appsink name=sink",
                .split_alpha = true,
                .width_multiple = 2,
                .height_multiple = 2,
                .min_width = 4,
                .min_height = 4,
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

int
do_gst_encoder_create(char preferred_encoder[16], frame_callback_func frame_ready_callback, void *user_data,
                      struct encoder **encoder_pp, struct westfield_drm *drm_context) {
    struct encoder *encoder = g_new0(struct encoder, 1);

    strncpy(encoder->preferred_encoder, preferred_encoder, sizeof(encoder->preferred_encoder));
    encoder->preferred_encoder[sizeof(encoder->preferred_encoder) - 1] = '\0';
    encoder->frame_callback = frame_ready_callback;
    encoder->user_data = user_data;
    encoder->encoding_results = g_queue_new();
    encoder->drm_context = drm_context;

    *encoder_pp = encoder;
}

bool
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
                if (gst_encoder_create(encoder)) {
                    return false;
                }
                assert(encoder->impl != NULL && "Found matching encoder but implementation was still NULL");
                break;
            }
        }
    }

    assert(encoder->impl != NULL && "No matching encoder found for buffer");

    encoding_result = g_new0(struct encoding_result, 1);
    g_mutex_init(&encoding_result->mutex);
    encoding_result->serial = serial;
    encoding_result->buffer_id = wl_resource_get_id(buffer_resource);
    return gst_encoder_encode(encoder, buffer_resource, encoding_result);
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
