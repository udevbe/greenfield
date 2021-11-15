#include <westfield-extra.h>
#include <stdlib.h>
#include <gst/gst.h>
#include <gst/app/gstappsrc.h>
#include <gst/app/gstappsink.h>
#include <gst/gstelement.h>

#include "encoder.h"
#include "shm.h"

struct x264_gst_alpha_encoder {
    // gstreamer
    GstAppSrc *app_src;
    GstElement *videobox;
    GstAppSink *app_sink_alpha;
    GstAppSink *app_sink;
    GstElement *pipeline;
};

struct x264_gst_encoder {
    // gstreamer
    GstAppSrc *app_src;
    GstElement *videobox;
    GstAppSink *app_sink;
    GstElement *pipeline;
};

static GstFlowReturn
new_opaque_sample(GstAppSink *appsink, gpointer user_data) {
    struct encoder *encoder = user_data;
    GstSample *sample = gst_app_sink_pull_sample(appsink);
    if (sample) {
        encoder->callback_data.opaque_sample_ready_callback(encoder, sample);
        return GST_FLOW_OK;
    }
    return GST_FLOW_ERROR;
}

static GstAppSinkCallbacks opaque_sample_callbacks = {
        .eos = NULL,
        .new_sample = new_opaque_sample,
        .new_preroll = NULL
};

static GstFlowReturn
new_alpha_sample(GstAppSink *appsink, gpointer user_data) {
    struct encoder *encoder = user_data;
    GstSample *sample = gst_app_sink_pull_sample(appsink);
    if (sample) {
        encoder->callback_data.alpha_sample_ready_callback(encoder, sample);
        return GST_FLOW_OK;
    }
    return GST_FLOW_ERROR;
}

static GstAppSinkCallbacks alpha_sample_callbacks = {
        .eos = NULL,
        .new_sample = new_alpha_sample,
        .new_preroll = NULL
};

static void
x264_gst_alpha_encoder_ensure_size(struct x264_gst_alpha_encoder *x264_gst_alpha_encoder,
                                   const char *format,
                                   const u_int32_t width,
                                   const u_int32_t height) {
    const GstCaps *current_src_caps = gst_app_src_get_caps(x264_gst_alpha_encoder->app_src);
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

    gst_app_src_set_caps(x264_gst_alpha_encoder->app_src, new_src_caps);
    gst_caps_unref((GstCaps *) new_src_caps);

    g_object_set(x264_gst_alpha_encoder->videobox,
                 "bottom", -(height % 2),
                 "right", -(width % 2),
                 NULL);
}

static void
x264_gst_encoder_ensure_size(struct x264_gst_encoder *x264_gst_encoder,
                             const char *format,
                             const u_int32_t width,
                             const u_int32_t height) {
    const GstCaps *current_src_caps = gst_app_src_get_caps(x264_gst_encoder->app_src);
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

    gst_app_src_set_caps(x264_gst_encoder->app_src, new_src_caps);
    gst_caps_unref((GstCaps *) new_src_caps);

    g_object_set(x264_gst_encoder->videobox,
                 "bottom", -(height % 2),
                 "right", -(width % 2),
                 NULL);
}

static int
x264_gst_alpha_encoder_destroy(struct encoder *encoder) {
    struct x264_gst_alpha_encoder *x264_gst_alpha_encoder;

    x264_gst_alpha_encoder = (struct x264_gst_alpha_encoder *) encoder->encoder_data;
    // TODO cleanup all gstreamer resources


    gst_object_unref(x264_gst_alpha_encoder->app_src);
    gst_object_unref(x264_gst_alpha_encoder->videobox);
    gst_object_unref(x264_gst_alpha_encoder->app_sink);

    // gstreamer pipeline
    gst_element_set_state(x264_gst_alpha_encoder->pipeline, GST_STATE_NULL);
    gst_object_unref(x264_gst_alpha_encoder->pipeline);

    free(x264_gst_alpha_encoder);
    return 0;
}

static int
x264_gst_encoder_destroy(struct encoder *encoder) {
    struct x264_gst_encoder *x264_gst_encoder;

    x264_gst_encoder = (struct x264_gst_encoder *) encoder->encoder_data;
    // TODO cleanup all gstreamer resources

    gst_object_unref(x264_gst_encoder->app_src);
    gst_object_unref(x264_gst_encoder->videobox);
    gst_object_unref(x264_gst_encoder->app_sink);

    // gstreamer pipeline
    gst_element_set_state(x264_gst_encoder->pipeline, GST_STATE_NULL);
    gst_object_unref(x264_gst_encoder->pipeline);

    free(x264_gst_encoder);
    return 0;
}
static int
x264_gst_alpha_encoder_encode(struct encoder *encoder,
                              struct wl_resource *buffer_resource) {
    struct x264_gst_alpha_encoder *x264_gst_alpha_encoder = (struct x264_gst_alpha_encoder *) encoder->encoder_data;
    GstFlowReturn ret;
    struct wl_shm_buffer *shm_buffer;
    GstBuffer *buffer;
    char *gst_format = NULL;
    uint32_t buffer_width, buffer_height;

    shm_buffer = wl_shm_buffer_get((struct wl_resource *) buffer_resource);
    if (shm_buffer == NULL) {
        return TRUE;
    }

    buffer = wl_shm_buffer_to_gst_buffer(shm_buffer, &buffer_width, &buffer_height, &gst_format);
    if(buffer == NULL) {
        return TRUE;
    }

    x264_gst_alpha_encoder_ensure_size(x264_gst_alpha_encoder, gst_format, buffer_width, buffer_height);
    ret = gst_app_src_push_buffer(x264_gst_alpha_encoder->app_src, buffer);

    if (ret != GST_FLOW_OK) {
        /* We got some error, stop sending data */
        return TRUE;
    }

    return FALSE;
}

static int
x264_gst_encoder_encode(struct encoder *encoder,
                        struct wl_resource *buffer_resource) {
    struct x264_gst_encoder *x264_gst_encoder = (struct x264_gst_encoder *) encoder;
    GstFlowReturn ret;
    struct wl_shm_buffer *shm_buffer;
    GstBuffer *buffer;
    char *gst_format = NULL;
    uint32_t buffer_width, buffer_height;

    shm_buffer = wl_shm_buffer_get((struct wl_resource *) buffer_resource);
    if (shm_buffer == NULL) {
        return TRUE;
    }

    buffer = wl_shm_buffer_to_gst_buffer(shm_buffer, &buffer_width, &buffer_height, &gst_format);
    if(buffer == NULL) {
        return TRUE;
    }

    x264_gst_encoder_ensure_size(x264_gst_encoder, gst_format, buffer_width, buffer_height);
    ret = gst_app_src_push_buffer(x264_gst_encoder->app_src, buffer);

    if (ret != GST_FLOW_OK) {
        /* We got some error, stop sending data */
        return TRUE;
    }

    return FALSE;
}

int
x264_gst_alpha_encoder_create(struct encoder* encoder) {
    struct x264_gst_alpha_encoder *x264_gst_alpha_encoder;

    x264_gst_alpha_encoder = calloc(1, sizeof(struct x264_gst_alpha_encoder));

    gst_init(NULL, NULL);
    x264_gst_alpha_encoder->pipeline = gst_parse_launch(
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

    x264_gst_alpha_encoder->app_src = GST_APP_SRC(
            gst_bin_get_by_name(GST_BIN(x264_gst_alpha_encoder->pipeline), "src"));
    x264_gst_alpha_encoder->videobox = gst_bin_get_by_name(GST_BIN(x264_gst_alpha_encoder->pipeline), "videobox");
    x264_gst_alpha_encoder->app_sink_alpha = GST_APP_SINK(
            gst_bin_get_by_name(GST_BIN(x264_gst_alpha_encoder->pipeline), "alphasink"));
    x264_gst_alpha_encoder->app_sink = GST_APP_SINK(
            gst_bin_get_by_name(GST_BIN(x264_gst_alpha_encoder->pipeline), "sink"));

    gst_app_sink_set_callbacks(x264_gst_alpha_encoder->app_sink,
                               &opaque_sample_callbacks,
                               (gpointer) encoder,
                               NULL);
    gst_app_sink_set_callbacks(x264_gst_alpha_encoder->app_sink_alpha,
                               &alpha_sample_callbacks,
                               (gpointer) encoder,
                               NULL);

    gst_element_set_state(x264_gst_alpha_encoder->pipeline, GST_STATE_PLAYING);

    encoder->encoder_data =  (struct encoder *) x264_gst_alpha_encoder;
    return 1;
}

int
x264_gst_encoder_create(char *format, uint32_t width, uint32_t height) {
    struct x264_gst_encoder *x264_gst_encoder;

    x264_gst_encoder = calloc(1, sizeof(struct x264_gst_encoder));

    gst_init(NULL, NULL);
    x264_gst_encoder->pipeline = gst_parse_launch(
            "appsrc name=src format=3 caps=video/x-raw ! "
            "videobox name=videobox border-alpha=0 ! "
            "glupload ! "
            "glcolorconvert ! video/x-raw(memory:GLMemory),format=I420 ! "
            "gldownload !"
            "x264enc byte-stream=true qp-max=32 tune=zerolatency speed-preset=veryfast ! "
            "video/x-h264,profile=constrained-baseline,stream-format=byte-stream,alignment=au,framerate=60/1 ! "
            "appsink name=sink",
            NULL);

    x264_gst_encoder->app_src = GST_APP_SRC(gst_bin_get_by_name(GST_BIN(x264_gst_encoder->pipeline), "src"));
    x264_gst_encoder->videobox = gst_bin_get_by_name(GST_BIN(x264_gst_encoder->pipeline), "videobox");
    x264_gst_encoder->app_sink = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(x264_gst_encoder->pipeline), "sink"));

    x264_gst_encoder_ensure_size(x264_gst_encoder, format, width, height);

    gst_app_sink_set_callbacks(x264_gst_encoder->app_sink,
                               &opaque_sample_callbacks,
                               (gpointer) encoder,
                               NULL);

    gst_element_set_state(x264_gst_encoder->pipeline, GST_STATE_PLAYING);

    encoder->encoder_data = (struct encoder *) x264_gst_encoder;
    return 1;
}

struct encoder_module {
    x264_gst_alpha_supports_buffer,
    x264_gst_alpha_encoder_create,
    x264_gst_alpha_encoder_encode,
    x264_gst_alpha_encoder_destroy,
    1,
} x264_gst_alpha_module;

struct encoder_module {
    x264_gst_supports_buffer,
    x264_gst_encoder_create,
    x264_gst_encoder_encode,
    x264_gst_encoder_destroy,
    0,
} x264_gst_module;
