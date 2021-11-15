#include <stdlib.h>
#include <gst/gst.h>
#include <gst/app/gstappsrc.h>
#include <gst/app/gstappsink.h>
#include <stdio.h>
#include "encoder.h"
#include "shm.h"

struct nv264_gst_alpha_encoder {
    // gstreamer
    GstAppSrc *app_src;
    GstElement *videobox;
    GstAppSink *app_sink_alpha;
    GstAppSink *app_sink;
    GstElement *pipeline;
};

struct nv264_gst_encoder {
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

static void
nv264_gst_alpha_encoder_ensure_size(struct nv264_gst_alpha_encoder *nv264_gst_alpha_encoder,
                                    const char *format,
                                    const u_int32_t width,
                                    const u_int32_t height) {
    const GstCaps *current_src_caps = gst_app_src_get_caps(nv264_gst_alpha_encoder->app_src);
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

    gst_app_src_set_caps(nv264_gst_alpha_encoder->app_src, new_src_caps);
    gst_caps_unref((GstCaps *) new_src_caps);

    g_object_set(nv264_gst_alpha_encoder->videobox,
                 "bottom", 0 - (height % 2),
                 "right", 0 - (width % 2),
                 NULL);
}

static void
nv264_gst_encoder_ensure_size(struct nv264_gst_encoder *nv264_gst_encoder,
                              const char *format,
                              const u_int32_t width,
                              const u_int32_t height) {
    const GstCaps *current_src_caps = gst_app_src_get_caps(nv264_gst_encoder->app_src);
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

    gst_app_src_set_caps(nv264_gst_encoder->app_src, new_src_caps);
    gst_caps_unref((GstCaps *) new_src_caps);

    g_object_set(nv264_gst_encoder->videobox,
                 "bottom", 0 - (height % 2),
                 "right", 0 - (width % 2),
                 NULL);
}

static int
nv264_gst_alpha_encoder_destroy(struct encoder *encoder) {
    struct nv264_gst_alpha_encoder *nv264_gst_alpha_encoder = (struct nv264_gst_alpha_encoder *) encoder->encoder_data;
    // TODO cleanup all gstreamer resources

    gst_object_unref(nv264_gst_alpha_encoder->app_src);
    gst_object_unref(nv264_gst_alpha_encoder->videobox);
    gst_object_unref(nv264_gst_alpha_encoder->app_sink);

    // gstreamer pipeline
    gst_element_set_state(nv264_gst_alpha_encoder->pipeline, GST_STATE_NULL);
    gst_object_unref(nv264_gst_alpha_encoder->pipeline);

    free(nv264_gst_alpha_encoder);
    return 0;
}

static int
nv264_gst_encoder_destroy(struct encoder *encoder) {
    struct nv264_gst_encoder *nv264_gst_encoder = (struct nv264_gst_encoder *) encoder->encoder_data;
    // TODO cleanup all gstreamer resources

    gst_object_unref(nv264_gst_encoder->app_src);
    gst_object_unref(nv264_gst_encoder->videobox);
    gst_object_unref(nv264_gst_encoder->app_sink);

    // gstreamer pipeline
    gst_element_set_state(nv264_gst_encoder->pipeline, GST_STATE_NULL);
    gst_object_unref(nv264_gst_encoder->pipeline);

    free(nv264_gst_encoder);
    return 0;
}

static int
nv264_gst_alpha_encoder_encode(struct encoder *encoder,
                               struct wl_resource *buffer_resource) {
    struct nv264_gst_alpha_encoder *nv264_gst_alpha_encoder = (struct nv264_gst_alpha_encoder *) encoder->encoder_data;
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

    nv264_gst_alpha_encoder_ensure_size(nv264_gst_alpha_encoder, gst_format, buffer_width, buffer_height);
    ret = gst_app_src_push_buffer(nv264_gst_alpha_encoder->app_src, buffer);

    if (ret != GST_FLOW_OK) {
        /* We got some error, stop sending data */
        return TRUE;
    }

    return FALSE;
}

static int
nv264_gst_encoder_encode(struct encoder *encoder,
                         struct wl_resource *buffer_resource) {
    struct nv264_gst_encoder *nv264_gst_encoder = (struct nv264_gst_encoder *) encoder->encoder_data;
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

    nv264_gst_encoder_ensure_size(nv264_gst_encoder, gst_format, buffer_width, buffer_height);
    ret = gst_app_src_push_buffer(nv264_gst_encoder->app_src, buffer);

    if (ret != GST_FLOW_OK) {
        /* We got some error, stop sending data */
        return TRUE;
    }

    return FALSE;
}

int
nv264_gst_alpha_encoder_create(struct encoder* encoder) {
    struct nv264_gst_alpha_encoder *nv264_gst_alpha_encoder;

    nv264_gst_alpha_encoder = calloc(1, sizeof(struct nv264_gst_alpha_encoder));

    gst_init(NULL, NULL);
    nv264_gst_alpha_encoder->pipeline = gst_parse_launch(
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

    nv264_gst_alpha_encoder->app_src = GST_APP_SRC(
            gst_bin_get_by_name(GST_BIN(nv264_gst_alpha_encoder->pipeline), "src"));
    nv264_gst_alpha_encoder->videobox = gst_bin_get_by_name(GST_BIN(nv264_gst_alpha_encoder->pipeline), "videobox");
    nv264_gst_alpha_encoder->app_sink_alpha = GST_APP_SINK(
            gst_bin_get_by_name(GST_BIN(nv264_gst_alpha_encoder->pipeline), "alphasink"));
    nv264_gst_alpha_encoder->app_sink = GST_APP_SINK(
            gst_bin_get_by_name(GST_BIN(nv264_gst_alpha_encoder->pipeline), "sink"));

    GstAppSinkCallbacks opaque_sample_callbacks = {
            .eos = NULL,
            .new_sample = new_opaque_sample,
            .new_preroll = NULL
    }, alpha_sample_callbacks = {
            .eos = NULL,
            .new_sample = new_alpha_sample,
            .new_preroll = NULL
    };

    gst_app_sink_set_callbacks(nv264_gst_alpha_encoder->app_sink,
                               &opaque_sample_callbacks,
                               (gpointer) encoder,
                               NULL);
    gst_app_sink_set_callbacks(nv264_gst_alpha_encoder->app_sink_alpha,
                               &alpha_sample_callbacks,
                               (gpointer) encoder,
                               NULL);

    gst_element_set_state(nv264_gst_alpha_encoder->pipeline, GST_STATE_PLAYING);

    encoder->encoder_data = (struct encoder *) nv264_gst_alpha_encoder;
    return 1;
}

int
nv264_gst_encoder_supports_buffer() {
// TODO
}

int
nv264_gst_encoder_create(const struct encoder* encoder) {
    struct nv264_gst_encoder *nv264_gst_encoder;

    nv264_gst_encoder = calloc(1, sizeof(struct nv264_gst_encoder));
    nv264_gst_encoder->encoder = encoder;

    gst_init(NULL, NULL);
    nv264_gst_encoder->pipeline = gst_parse_launch(
            "appsrc name=src format=3 caps=video/x-raw ! "
            "videobox name=videobox border-alpha=0.0 ! "
            "nvh264enc gop-size=1 qp-min=32 qp-max=38 zerolatency=true preset=5 rc-mode=4 ! "
            "video/x-h264,profile=baseline,stream-format=byte-stream,alignment=au,framerate=60/1 ! "
            "appsink name=sink",
            NULL);

    nv264_gst_encoder->app_src = GST_APP_SRC(gst_bin_get_by_name(GST_BIN(nv264_gst_encoder->pipeline), "src"));
    nv264_gst_encoder->videobox = gst_bin_get_by_name(GST_BIN(nv264_gst_encoder->pipeline), "videobox");
    nv264_gst_encoder->app_sink = GST_APP_SINK(
            gst_bin_get_by_name(GST_BIN(nv264_gst_encoder->pipeline), "sink"));

    GstAppSinkCallbacks opaque_sample_callbacks = {
            .eos = NULL,
            .new_sample = new_opaque_sample,
            .new_preroll = NULL
    };

    gst_app_sink_set_callbacks(nv264_gst_encoder->app_sink,
                               &opaque_sample_callbacks,
                               (gpointer) encoder,
                               NULL);

    gst_element_set_state(nv264_gst_encoder->pipeline, GST_STATE_PLAYING);

    encoder->encoder_data = (struct encoder_data *) nv264_gst_encoder;
    return 1;
}


struct encoder_module {
    nv264_gst_alpha_supports_buffer,
    nv264_gst_alpha_encoder_create,
    nv264_gst_alpha_encoder_encode,
    nv264_gst_alpha_encoder_destroy,
    1,
} nv264_gst_alpha_module;

struct encoder_module {
    nv264_gst_supports_buffer,
    nv264_gst_encoder_create,
    nv264_gst_encoder_encode,
    nv264_gst_encoder_destroy,
    0,
} nv264_gst_module;

