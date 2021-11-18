//
// Created by erik on 11/16/21.
//

#include <westfield-extra.h>
#include <glib.h>
#include <gst/gst.h>
#include <gst/app/gstappsrc.h>
#include <gst/app/gstappsink.h>
#include "encoder.h"

struct gst_encoder {
    // gstreamer
    GstAppSrc *app_src;
    GstElement *videobox;
    GstAppSink *app_sink_alpha;
    GstAppSink *app_sink;
    GstElement *pipeline;
    int playing;
};

struct encoded_frame_gst_sample {
    struct encoded_frame base;
    GstMapInfo info;
    GstBuffer *buffer;
};

static void
gst_finalize_encoded_frame(struct encoder *encoder, struct encoded_frame *encoded_frame) {
    struct encoded_frame_gst_sample *encoded_frame_gst_sample = (struct encoded_frame_gst_sample *) encoded_frame;
    gst_buffer_unmap(encoded_frame_gst_sample->buffer, &encoded_frame_gst_sample->info);
    gst_buffer_unref(encoded_frame_gst_sample->buffer);
    free(encoded_frame_gst_sample);
}

static struct encoded_frame_gst_sample *
gst_sample_to_encoded_frame(struct encoder *encoder, GstSample *sample) {
    struct encoded_frame_gst_sample *encoded_frame_gst_sample = calloc(1, sizeof(struct encoded_frame_gst_sample));
    GstBuffer *buffer = gst_buffer_ref(gst_sample_get_buffer(sample));
    gst_sample_unref(sample);

    encoded_frame_gst_sample->buffer = buffer;
    gst_buffer_map(buffer, &encoded_frame_gst_sample->info, GST_MAP_READ);

    encoded_frame_gst_sample->base.encoder = encoder;
    encoded_frame_gst_sample->base.encoded_data = encoded_frame_gst_sample->info.data;
    encoded_frame_gst_sample->base.encoded_data_size = encoded_frame_gst_sample->info.size;

    return encoded_frame_gst_sample;
}

static GstFlowReturn
gst_new_sample(GstAppSink *appsink, gpointer user_data) {
    struct encoded_frame_gst_sample *encoded_frame_gst_sample;
    struct encoder *encoder = user_data;
    GstSample *sample = gst_app_sink_pull_sample(appsink);
    if (sample) {
        encoded_frame_gst_sample = gst_sample_to_encoded_frame(encoder, sample);
        encoder->callback_data.opaque_sample_ready_callback(encoder, (struct encoded_frame *) encoded_frame_gst_sample);
        return GST_FLOW_OK;
    }
    return GST_FLOW_ERROR;
}

static GstAppSinkCallbacks sample_callback = {
        .eos = NULL,
        .new_sample = gst_new_sample,
        .new_preroll = NULL
};

static GstFlowReturn
gst_new_alpha_sample(GstAppSink *appsink, gpointer user_data) {
    struct encoded_frame_gst_sample *encoded_frame_gst_sample;
    struct encoder *encoder = user_data;
    GstSample *sample = gst_app_sink_pull_sample(appsink);
    if (sample) {
        encoded_frame_gst_sample = gst_sample_to_encoded_frame(encoder, sample);
        encoder->callback_data.alpha_sample_ready_callback(encoder, (struct encoded_frame *) encoded_frame_gst_sample);
        return GST_FLOW_OK;
    }
    return GST_FLOW_ERROR;
}

static GstAppSinkCallbacks alpha_sample_callback = {
        .eos = NULL,
        .new_sample = gst_new_alpha_sample,
        .new_preroll = NULL
};

struct shm_pool_ref {
    struct wl_shm_buffer *buffer;
    struct wl_shm_pool *pool;
};

static void
handle_gst_buffer_destroyed(gpointer data) {
    struct shm_pool_ref *shm_pool_ref = data;
    wl_shm_pool_unref(shm_pool_ref->pool);
    // FIXME needs to happen in same thread as begin_access
//    wl_shm_buffer_end_access(shm_pool_ref->buffer);
    free(shm_pool_ref);
}

static GstBuffer *
wl_shm_buffer_to_gst_buffer(struct wl_shm_buffer *shm_buffer, uint32_t *width, uint32_t *height, char *gst_format) {
    void *buffer_data;
    struct shm_pool_ref *pool_ref = calloc(1, sizeof(struct shm_pool_ref));
    struct wl_shm_pool *shm_pool;
    enum wl_shm_format buffer_format;
    uint32_t buffer_width, buffer_height, buffer_stride;
    gsize buffer_size;

    buffer_format = wl_shm_buffer_get_format(shm_buffer);

    if (buffer_format == WL_SHM_FORMAT_ARGB8888) {
        strcpy(gst_format, "BGRA");
    } else if (buffer_format == WL_SHM_FORMAT_XRGB8888) {
        strcpy(gst_format, "BGRx");
    } else {
        return NULL;
    }

    shm_pool = wl_shm_buffer_ref_pool(shm_buffer);
    // FIXME needs to happen in same thread as end_access
//    wl_shm_buffer_begin_access(shm_buffer);

    buffer_data = wl_shm_buffer_get_data(shm_buffer);
    buffer_stride = wl_shm_buffer_get_stride(shm_buffer);
    buffer_width = wl_shm_buffer_get_width(shm_buffer);
    buffer_height = wl_shm_buffer_get_height(shm_buffer);
    buffer_size = buffer_stride * buffer_height;

    *width = buffer_width;
    *height = buffer_height;

    pool_ref->buffer = shm_buffer;
    pool_ref->pool = shm_pool;

    return gst_buffer_new_wrapped_full(0, (gpointer) buffer_data, buffer_size, 0, buffer_size, pool_ref,
                                       handle_gst_buffer_destroyed);
}

static void
h264_gst_encoder_ensure_size(struct gst_encoder *gst_encoder, const char *format, const u_int32_t width,
                             const u_int32_t height) {
    const GstCaps *current_src_caps = gst_app_src_get_caps(gst_encoder->app_src);
    const GstCaps *new_src_caps = gst_caps_new_simple("video/x-raw",
                                                      "framerate", GST_TYPE_FRACTION, 60, 1,
                                                      "format", G_TYPE_STRING, format,
                                                      "width", G_TYPE_INT, width,
                                                      "height", G_TYPE_INT, height,
                                                      NULL);
    if (gst_caps_is_equal(current_src_caps, new_src_caps)) {
        gst_caps_unref((GstCaps *) new_src_caps);
        gst_caps_unref((GstCaps *) current_src_caps);
        return;
    }
    gst_caps_unref((GstCaps *) current_src_caps);

    gst_app_src_set_caps(gst_encoder->app_src, new_src_caps);
    gst_caps_unref((GstCaps *) new_src_caps);

    g_object_set(gst_encoder->videobox, "bottom", 0 - (height % 2), "right", 0 - (width % 2), NULL);
}

static void
gst_encoder_destroy(struct encoder *encoder) {
    struct gst_encoder *gst_encoder = (struct gst_encoder *) encoder->impl;
    gst_element_set_state(gst_encoder->pipeline, GST_STATE_NULL);

    gst_object_unref(gst_encoder->app_src);
    gst_object_unref(gst_encoder->videobox);
    gst_object_unref(gst_encoder->app_sink);
    if (gst_encoder->app_sink_alpha) {
        gst_object_unref(gst_encoder->app_sink_alpha);
    }

    // gstreamer pipeline
    gst_object_unref(gst_encoder->pipeline);

    free(gst_encoder);
}

static int
gst_encoder_encode(struct encoder *encoder, struct wl_resource *buffer_resource, uint32_t *buffer_width,
                   uint32_t *buffer_height,
                   void (*gst_encoder_ensure_size)(struct gst_encoder *, const char *format,
                                                   const u_int32_t width, const u_int32_t height)) {
    struct gst_encoder *gst_encoder = (struct gst_encoder *) encoder->impl;
    GstFlowReturn ret;
    struct wl_shm_buffer *shm_buffer;
    GstBuffer *buffer;
    char gst_format[16];

    shm_buffer = wl_shm_buffer_get((struct wl_resource *) buffer_resource);
    if (shm_buffer == NULL) {
        return -1;
    }

    buffer = wl_shm_buffer_to_gst_buffer(shm_buffer, buffer_width, buffer_height, gst_format);
    if (buffer == NULL) {
        return -1;
    }

    gst_encoder_ensure_size(gst_encoder, gst_format, *buffer_width, *buffer_height);

    if (gst_encoder->playing == 0) {
        gst_element_set_state(gst_encoder->pipeline, GST_STATE_PLAYING);
        if (gst_element_get_state(gst_encoder->pipeline, NULL, NULL, 0) == GST_STATE_CHANGE_FAILURE) {
            return -1;
        };
        gst_encoder->playing = 1;
    }

    ret = gst_app_src_push_buffer(gst_encoder->app_src, buffer);

    if (ret != GST_FLOW_OK) {
        /* We got some error, stop sending data */
        return -1;
    }

    return 0;
}

static int
h264_gst_encoder_encode(struct encoder *encoder, struct wl_resource *buffer_resource, uint32_t *buffer_width,
                        uint32_t *buffer_height) {
    return gst_encoder_encode(encoder, buffer_resource, buffer_width, buffer_height, h264_gst_encoder_ensure_size);
}

static int
nvh264_gst_alpha_encoder_create(struct encoder *encoder) {
    struct gst_encoder *gst_encoder = calloc(1, sizeof(struct gst_encoder));

    gst_init(NULL, NULL);
    gst_encoder->pipeline = gst_parse_launch(
            "appsrc name=src format=3 caps=video/x-raw ! "
            "videobox name=videobox border-alpha=0.0 ! "
            "tee name=t ! queue ! "
            "glupload ! "
            "glcolorconvert ! "
            "glshader fragment=\"\n"
            "#version 120\n"
            "#ifdef GL_ES\n"
            "    precision mediump float;\n"
            "#endif\n"
            "varying vec2 v_texcoord;\n"
            "uniform sampler2D tex;\n"
            "uniform float time;\n"
            "uniform float width;\n"
            "uniform float height;\n"
            "void main () {\n"
            "        vec4 pix = texture2D(tex, v_texcoord);\n"
            "        gl_FragColor = vec4(pix.a,pix.a,pix.a,0);\n"
            "}\n"
            "\""
            "vertex = \"\n"
            "#version 120\n"
            "#ifdef GL_ES\n"
            "    precision mediump float;\n"
            "#endif\n"
            "attribute vec4 a_position;\n"
            "attribute vec2 a_texcoord;\n"
            "varying vec2 v_texcoord;\n"
            "void main() {\n"
            "        gl_Position = a_position;\n"
            "        v_texcoord = a_texcoord;\n"
            "}\n"
            "\" ! "
            "glcolorconvert ! "
            "nvh264enc gop-size=500 qp-min=29 qp-max=40 zerolatency=true preset=5 rc-mode=4 ! "
            "video/x-h264,profile=baseline,stream-format=byte-stream,alignment=au,framerate=60/1 ! "
            "appsink name=alphasink "
            "t. ! queue ! "
            "nvh264enc gop-size=500 qp-min=29 qp-max=40 zerolatency=true preset=5 rc-mode=4 ! "
            "video/x-h264,profile=baseline,stream-format=byte-stream,alignment=au,framerate=60/1 ! "
            "appsink name=sink",
            NULL);
    if (gst_encoder->pipeline == NULL) {
        return -1;
    }

    gst_encoder->app_src = GST_APP_SRC(gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "src"));
    gst_encoder->videobox = gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "videobox");
    gst_encoder->app_sink_alpha = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "alphasink"));
    gst_encoder->app_sink = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "sink"));

    gst_app_sink_set_callbacks(gst_encoder->app_sink, &sample_callback, (gpointer) encoder, NULL);
    gst_app_sink_set_callbacks(gst_encoder->app_sink_alpha, &alpha_sample_callback, (gpointer) encoder, NULL);

    encoder->impl = gst_encoder;
    encoder->encoding_type = h264;

    return 0;
}

static int
nvh264_gst_encoder_create(struct encoder *encoder) {
    struct gst_encoder *gst_encoder = calloc(1, sizeof(struct gst_encoder));

    gst_init(NULL, NULL);
    gst_encoder->pipeline = gst_parse_launch(
            "appsrc name=src format=3 caps=video/x-raw ! "
            "videobox name=videobox border-alpha=0.0 ! "
            "nvh264enc gop-size=500 qp-min=29 qp-max=40 zerolatency=true preset=5 rc-mode=4 ! "
            "video/x-h264,profile=baseline,stream-format=byte-stream,alignment=au,framerate=60/1 ! "
            "appsink name=sink",
            NULL);
    if (gst_encoder->pipeline == NULL) {
        return -1;
    }

    gst_encoder->app_src = GST_APP_SRC(gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "src"));
    gst_encoder->videobox = gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "videobox");
    gst_encoder->app_sink = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "sink"));

    gst_app_sink_set_callbacks(gst_encoder->app_sink, &sample_callback, (gpointer) encoder, NULL);

    encoder->impl = gst_encoder;
    encoder->encoding_type = h264;

    return 0;
}

static int
h264_gst_encoder_supports_buffer(struct encoder *encoder, struct wl_resource *buffer_resource, int alpha,
                                 char *preferred_encoder) {
    // different encoder selected so not for us
    if (strcmp(encoder->preferred_encoder, preferred_encoder) != 0) {
        return 0;
    }

    struct wl_shm_buffer *shm_buffer = wl_shm_buffer_get(buffer_resource);
    // not an shm buffer
    if (shm_buffer == NULL) {
        return 0;
    }

    int32_t width = wl_shm_buffer_get_width(shm_buffer);
    int32_t height = wl_shm_buffer_get_height(shm_buffer);
    uint32_t shm_format = wl_shm_buffer_get_format(shm_buffer);

    // Too small needs the png encoder so refuse those
    if (width * height <= 256 * 256) {
        return 0;
    }

    if (alpha && shm_format == WL_SHM_FORMAT_ARGB8888) {
        return 1;
    }
    if (!alpha && shm_format == WL_SHM_FORMAT_XRGB8888) {
        return 1;
    }
    return 0;
}

static int
nvh264_gst_supports_buffer(struct encoder *encoder, struct wl_resource *buffer_resource) {
    return h264_gst_encoder_supports_buffer(encoder, buffer_resource, 0, "nvh264");
}

static int
nvh264_gst_alpha_supports_buffer(struct encoder *encoder, struct wl_resource *buffer_resource) {
    return h264_gst_encoder_supports_buffer(encoder, buffer_resource, 1, "nvh264");
}


const struct encoder_itf nv264_gst_alpha_itf = {
        .supports_buffer = nvh264_gst_alpha_supports_buffer,
        .create = nvh264_gst_alpha_encoder_create,
        .encode = h264_gst_encoder_encode,
        .destroy = gst_encoder_destroy,
        .finalize_encoded_frame = gst_finalize_encoded_frame,
        .separate_alpha = 1,
};

const struct encoder_itf nv264_gst_itf = {
        .supports_buffer = nvh264_gst_supports_buffer,
        .create = nvh264_gst_encoder_create,
        .encode = h264_gst_encoder_encode,
        .destroy = gst_encoder_destroy,
        .finalize_encoded_frame = gst_finalize_encoded_frame,
        .separate_alpha = 0,
};

static int
x264_gst_alpha_encoder_create(struct encoder *encoder) {
    struct gst_encoder *gst_encoder = calloc(1, sizeof(struct gst_encoder));

    gst_init(NULL, NULL);
    gst_encoder->pipeline = gst_parse_launch(
            "appsrc name=src format=3 caps=video/x-raw ! "
            "videobox name=videobox border-alpha=0 ! "
            "tee name=t ! queue ! "
            "glupload ! "
            "glcolorconvert ! "
            "glshader fragment=\"\n"
            "#version 120\n"
            "#ifdef GL_ES\n"
            "    precision mediump float;\n"
            "#endif\n"
            "varying vec2 v_texcoord;\n"
            "uniform sampler2D tex;\n"
            "uniform float time;\n"
            "uniform float width;\n"
            "uniform float height;\n"
            "void main () {\n"
            "        vec4 pix = texture2D(tex, v_texcoord);\n"
            "        gl_FragColor = vec4(pix.a,pix.a,pix.a,0);\n"
            "}\n"
            "\""
            "vertex = \"\n"
            "#version 120\n"
            "#ifdef GL_ES\n"
            "    precision mediump float;\n"
            "#endif\n"
            "attribute vec4 a_position;\n"
            "attribute vec2 a_texcoord;\n"
            "varying vec2 v_texcoord;\n"
            "void main() {\n"
            "        gl_Position = a_position;\n"
            "        v_texcoord = a_texcoord;\n"
            "}\n"
            "\" ! "
            "glcolorconvert ! video/x-raw(memory:GLMemory),format=I420 ! "
            "gldownload ! "
            "x264enc key-int-max=2000 byte-stream=true pass=qual bitrate=18000 tune=zerolatency speed-preset=medium ! "
            "video/x-h264,profile=baseline,stream-format=byte-stream,alignment=au,framerate=60/1 ! "
            "appsink name=alphasink "
            "t. ! queue ! "
            "glupload ! "
            "glcolorconvert ! video/x-raw(memory:GLMemory),format=I420 ! "
            "gldownload !"
            "x264enc key-int-max=2000 byte-stream=true pass=qual bitrate=18000 tune=zerolatency speed-preset=medium ! "
            "video/x-h264,profile=baseline,stream-format=byte-stream,alignment=au,framerate=60/1 ! "
            "appsink name=sink",
            NULL);
    if (gst_encoder->pipeline == NULL) {
        return -1;
    }

    gst_encoder->app_src = GST_APP_SRC(gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "src"));
    gst_encoder->videobox = gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "videobox");
    gst_encoder->app_sink_alpha = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "alphasink"));
    gst_encoder->app_sink = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "sink"));

    gst_app_sink_set_callbacks(gst_encoder->app_sink, &sample_callback, (gpointer) encoder, NULL);
    gst_app_sink_set_callbacks(gst_encoder->app_sink_alpha, &alpha_sample_callback, (gpointer) encoder, NULL);

    encoder->impl = (struct encoder *) gst_encoder;
    encoder->encoding_type = h264;

    return 0;
}

static int
x264_gst_encoder_create(struct encoder *encoder) {
    struct gst_encoder *gst_encoder = calloc(1, sizeof(struct gst_encoder));

    gst_init(NULL, NULL);
    gst_encoder->pipeline = gst_parse_launch(
            "appsrc name=src format=3 caps=video/x-raw ! "
            "videobox name=videobox border-alpha=0 ! "
            "glupload ! "
            "glcolorconvert ! video/x-raw(memory:GLMemory),format=I420 ! "
            "gldownload !"
            "x264enc byte-stream=true qp-max=32 tune=zerolatency speed-preset=veryfast ! "
            "video/x-h264,profile=constrained-baseline,stream-format=byte-stream,alignment=au,framerate=60/1 ! "
            "appsink name=sink",
            NULL);
    if (gst_encoder->pipeline == NULL) {
        return -1;
    }

    gst_encoder->app_src = GST_APP_SRC(gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "src"));
    gst_encoder->videobox = gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "videobox");
    gst_encoder->app_sink = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "sink"));

    gst_app_sink_set_callbacks(gst_encoder->app_sink, &sample_callback, (gpointer) encoder, NULL);

    encoder->impl = gst_encoder;
    encoder->encoding_type = h264;

    return 0;
}

static int
x264_gst_alpha_encoder_supports_buffer(struct encoder *encoder, struct wl_resource *buffer_resource) {
    return h264_gst_encoder_supports_buffer(encoder, buffer_resource, 1, "x264");
}

static int
x264_gst_encoder_supports_buffer(struct encoder *encoder, struct wl_resource *buffer_resource) {
    return h264_gst_encoder_supports_buffer(encoder, buffer_resource, 0, "x264");
}

const struct encoder_itf x264_gst_alpha_itf = {
        .supports_buffer = x264_gst_alpha_encoder_supports_buffer,
        .create = x264_gst_alpha_encoder_create,
        .encode = h264_gst_encoder_encode,
        .destroy = gst_encoder_destroy,
        .finalize_encoded_frame = gst_finalize_encoded_frame,
        .separate_alpha = 1,
};

const struct encoder_itf x264_gst_itf = {
        .supports_buffer = x264_gst_encoder_supports_buffer,
        .create = x264_gst_encoder_create,
        .encode = h264_gst_encoder_encode,
        .destroy = gst_encoder_destroy,
        .finalize_encoded_frame = gst_finalize_encoded_frame,
        .separate_alpha = 0,
};

static int
png_gst_encoder_create(struct encoder *encoder) {
    struct gst_encoder *gst_encoder = calloc(1, sizeof(struct gst_encoder));

    gst_init(NULL, NULL);
    gst_encoder->pipeline = gst_parse_launch(
            "appsrc name=src format=3 caps=video/x-raw ! "
            "videobox name=videobox border-alpha=0.0 ! "
            "videoconvert ! videoscale ! "
            "pngenc ! "
            "appsink name=sink",
            NULL);

    if (gst_encoder->pipeline == NULL) {
        return -1;
    }

    gst_encoder->app_src = GST_APP_SRC(gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "src"));
    gst_encoder->videobox = gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "videobox");
    gst_encoder->app_sink = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "sink"));

    gst_app_sink_set_callbacks(gst_encoder->app_sink, &sample_callback, (gpointer) encoder, NULL);

    encoder->impl = gst_encoder;
    encoder->encoding_type = png;

    return 0;
}

static void
png_gst_encoder_ensure_size(struct gst_encoder *gst_encoder, const char *format, const u_int32_t width,
                            const u_int32_t height) {
    const GstCaps *current_src_caps = gst_app_src_get_caps(gst_encoder->app_src);
    const GstCaps *new_src_caps = gst_caps_new_simple("video/x-raw",
                                                      "framerate", GST_TYPE_FRACTION, 60, 1,
                                                      "format", G_TYPE_STRING, format,
                                                      "width", G_TYPE_INT, width,
                                                      "height", G_TYPE_INT, height,
                                                      NULL);
    if (gst_caps_is_equal(current_src_caps, new_src_caps)) {
        gst_caps_unref((GstCaps *) new_src_caps);
        gst_caps_unref((GstCaps *) current_src_caps);
        return;
    }
    gst_caps_unref((GstCaps *) current_src_caps);

    gst_app_src_set_caps(gst_encoder->app_src, new_src_caps);
    gst_caps_unref((GstCaps *) new_src_caps);

    g_object_set(gst_encoder->videobox, "bottom", height < 16 ? height - 16 : 0, "right", width < 16 ? width - 16 : 0,
                 NULL);
}

static int
png_gst_encoder_supports_buffer(struct encoder *encoder, struct wl_resource *buffer_resource) {
    struct wl_shm_buffer *shm_buffer = wl_shm_buffer_get(buffer_resource);
    if (shm_buffer == NULL) {
        return 0;
    }

    int32_t width = wl_shm_buffer_get_width(shm_buffer);
    int32_t height = wl_shm_buffer_get_height(shm_buffer);
    uint32_t shm_format = wl_shm_buffer_get_format(shm_buffer);

    return (width * height) <= (256 * 256) &&
           (shm_format == WL_SHM_FORMAT_ARGB8888 || shm_format == WL_SHM_FORMAT_XRGB8888);
}

static int
png_gst_encoder_encode(struct encoder *encoder, struct wl_resource *buffer_resource, uint32_t *buffer_width,
                       uint32_t *buffer_height) {
    return gst_encoder_encode(encoder, buffer_resource, buffer_width, buffer_height, png_gst_encoder_ensure_size);
}

const struct encoder_itf png_gst_itf = {
        .supports_buffer = png_gst_encoder_supports_buffer,
        .create = png_gst_encoder_create,
        .encode = png_gst_encoder_encode,
        .destroy = gst_encoder_destroy,
        .finalize_encoded_frame = gst_finalize_encoded_frame,
        .separate_alpha = 0,
};
