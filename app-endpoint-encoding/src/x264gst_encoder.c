#include <gst/gst.h>
#include <gst/app/gstappsrc.h>
#include <gst/app/gstappsink.h>
#include <stdint-gcc.h>

#include "x264gst_encoder.h"

struct x264gst_alpha_encoder {
    // base type
    struct encoder base_encoder;

    // encoding state
    u_int32_t width;
    u_int32_t height;

    // gstreamer
    GstElement *appsrc;
    GstElement *videobox;
    GstElement *tee;

    struct alpha {
        GstElement *queue;
        GstElement *glupload;
        GstElement *glcolorconvert0;
        GstElement *glshader;
        GstElement *glcolorconvert1;
        GstElement *gldownload;
        GstElement *x264enc;
        GstElement *appsink;
    } alpha;

    GstElement *queue;
    GstElement *glupload;
    GstElement *glcolorconvert;
    GstElement *gldownload;
    GstElement *x264enc;
    GstElement *appsink;

    GstElement *pipeline;
};

static GstFlowReturn
new_opaque_sample(GstAppSink *appsink, gpointer user_data) {
    struct encoding_callback_data *encoding_callback_data = user_data;
    // TODO pull sample from appsink
    encoding_callback_data->encode_callback(encoding_callback_data, sample);
}

static GstFlowReturn
new_alpha_sample(GstAppSink *appsink, gpointer user_data) {
    struct encoding_callback_data *encoding_callback_data = user_data;
    // TODO pull sample from alpha appsink
    encoding_callback_data->alpha_encode_callback(encoding_callback_data, alpha_sample);
}

static void
destroy_notify(gpointer data) {
    const struct x264gst_alpha_encoder *x264gst_alpha_encoder = data;
    x264gst_alpha_encoder->base_encoder.destroy((const struct encoder *) x264gst_alpha_encoder);
}


static int
x264gst_alpha_encoder_init(struct x264gst_alpha_encoder *x264gst_alpha_encoder,
                           const u_int32_t width,
                           const u_int32_t height) {
    GstPad *alpha_tee_pad,
            *tee_pad,
            *alpha_queue_pad,
            *queue_pad,
            *alpha_glcolorconvert_source_pad,
            *alpha_x264enc_source_pad,
            *glcolorconvert_source_pad,
            *x264enc_source_pad;
    GstCaps *app_src_caps,
            *alpha_glcolorconvert_source_caps,
            *alpha_x264enc_source_caps,
            *glcolorconvert_source_caps,
            *x264enc_source_caps;

    x264gst_alpha_encoder->width = width;
    x264gst_alpha_encoder->height = height;

    // appsrc
    gst_base_src_set_live(GST_BASE_SRC(x264gst_alpha_encoder->appsrc), TRUE);
    gst_base_src_set_format(GST_BASE_SRC(x264gst_alpha_encoder->appsrc), GST_FORMAT_BYTES);
    gst_base_src_set_do_timestamp(GST_BASE_SRC(x264gst_alpha_encoder->appsrc), TRUE);
    gst_app_src_set_latency(GST_APP_SRC(x264gst_alpha_encoder->appsrc), 0, -1);
    gst_app_src_set_stream_type(GST_APP_SRC(x264gst_alpha_encoder->appsrc), GST_APP_STREAM_TYPE_STREAM);
    g_object_set(x264gst_alpha_encoder->appsrc,
                 "block", TRUE,
                 NULL);
    app_src_caps = gst_caps_new_simple("video/x-raw",
                                       "framerate", GST_TYPE_FRACTION, 60, 1,
                                       NULL);
    gst_app_src_set_caps(GST_APP_SRC(x264gst_alpha_encoder->appsrc), app_src_caps);
    gst_object_unref(app_src_caps);

    // videobox
    g_object_set(x264gst_alpha_encoder->videobox,
                 "border-alpha", G_TYPE_DOUBLE, 0.0,
                 "bottom", G_TYPE_INT, 0 - (height % 2),
                 "right", G_TYPE_INT, 0 - (width % 2),
                 NULL);

    // alpha glshader
    g_object_set(x264gst_alpha_encoder->alpha.glshader,
                 "fragment", G_TYPE_STRING, "#version 120\n"
                                            "#ifdef GL_ES\n"
                                            "precision mediump float;\n"
                                            "#endif\n"
                                            "varying vec2 v_texcoord;\n"
                                            "uniform sampler2D tex;\n"
                                            "uniform float time;\n"
                                            "uniform float width;\n"
                                            "uniform float height;\n"
                                            "void main () {\n"
                                            "    vec4 pix = texture2D(tex, v_texcoord);\n"
                                            "    gl_FragColor = vec4(pix.a,pix.a,pix.a,0);\n"
                                            "}",
                 "vertex", G_TYPE_STRING, "#version 120\n"
                                          "#ifdef GL_ES\n"
                                          "precision mediump float;\n"
                                          "#endif\n"
                                          "attribute vec4 a_position;\n"
                                          "attribute vec2 a_texcoord;\n"
                                          "varying vec2 v_texcoord;\n"
                                          "void main() {\n"
                                          "    gl_Position = a_position;\n"
                                          "    v_texcoord = a_texcoord;\n"
                                          "}",
                 NULL);

    // alpha glcolorconvert1
    alpha_glcolorconvert_source_pad = gst_element_get_static_pad(x264gst_alpha_encoder->alpha.glcolorconvert1,
                                                                 "source");
    alpha_glcolorconvert_source_caps = gst_caps_new_simple("video/x-raw(memory:GLMemory)",
                                                           "format", G_TYPE_STRING, "I420",
                                                           NULL);
    gst_pad_set_caps(alpha_glcolorconvert_source_pad, alpha_glcolorconvert_source_caps);
    gst_object_unref(alpha_glcolorconvert_source_pad);
    gst_object_unref(alpha_glcolorconvert_source_caps);

    // alpha x264enc
    g_object_set(x264gst_alpha_encoder->alpha.x264enc,
                 "byte-stream", G_TYPE_BOOLEAN, TRUE,
                 "qp-max", G_TYPE_INT, 32,
                 "tune", G_TYPE_STRING, "zerolatency",
                 "speed-preset", G_TYPE_STRING, "veryfast",
                 NULL);
    alpha_x264enc_source_pad = gst_element_get_static_pad(x264gst_alpha_encoder->alpha.x264enc,
                                                          "source");
    alpha_x264enc_source_caps = gst_caps_new_simple("video/x-h264",
                                                    "profile", G_TYPE_STRING, "constrained-baseline",
                                                    "stream-format", G_TYPE_STRING, "byte-stream",
                                                    "alignment", G_TYPE_STRING, "au",
                                                    "framerate", GST_TYPE_FRACTION, 60, 1,
                                                    NULL);
    gst_pad_set_caps(alpha_x264enc_source_pad, alpha_x264enc_source_caps);
    gst_object_unref(alpha_x264enc_source_pad);
    gst_object_unref(alpha_x264enc_source_caps);

    // glcolorconvert
    glcolorconvert_source_pad = gst_element_get_static_pad(x264gst_alpha_encoder->glcolorconvert,
                                                           "source");
    glcolorconvert_source_caps = gst_caps_new_simple("video/x-raw(memory:GLMemory)",
                                                     "format", G_TYPE_STRING, "I420",
                                                     NULL);
    gst_pad_set_caps(glcolorconvert_source_pad, glcolorconvert_source_caps);
    gst_object_unref(glcolorconvert_source_pad);
    gst_object_unref(glcolorconvert_source_caps);

    // x264enc
    g_object_set(x264gst_alpha_encoder->x264enc,
                 "byte-stream", G_TYPE_BOOLEAN, TRUE,
                 "qp-max", G_TYPE_INT, 26,
                 "tune", G_TYPE_STRING, "zerolatency",
                 "speed-preset", G_TYPE_STRING, "veryfast",
                 NULL);
    x264enc_source_pad = gst_element_get_static_pad(x264gst_alpha_encoder->x264enc,
                                                    "source");
    x264enc_source_caps = gst_caps_new_simple("video/x-h264",
                                              "profile", G_TYPE_STRING, "constrained-baseline",
                                              "stream-format", G_TYPE_STRING, "byte-stream",
                                              "alignment", G_TYPE_STRING, "au",
                                              "framerate", GST_TYPE_FRACTION, 60, 1,
                                              NULL);
    gst_pad_set_caps(x264enc_source_pad, x264enc_source_caps);
    gst_object_unref(x264enc_source_pad);
    gst_object_unref(x264enc_source_caps);

    gst_bin_add_many(
            GST_BIN(x264gst_alpha_encoder),
            x264gst_alpha_encoder->appsrc,
            x264gst_alpha_encoder->videobox,
            x264gst_alpha_encoder->tee,

            x264gst_alpha_encoder->alpha.queue,
            x264gst_alpha_encoder->alpha.glupload,
            x264gst_alpha_encoder->alpha.glcolorconvert0,
            x264gst_alpha_encoder->alpha.glshader,
            x264gst_alpha_encoder->alpha.glcolorconvert1,
            x264gst_alpha_encoder->alpha.gldownload,
            x264gst_alpha_encoder->alpha.x264enc,
            x264gst_alpha_encoder->alpha.appsink,

            x264gst_alpha_encoder->queue,
            x264gst_alpha_encoder->glupload,
            x264gst_alpha_encoder->glcolorconvert,
            x264gst_alpha_encoder->gldownload,
            x264gst_alpha_encoder->x264enc,
            x264gst_alpha_encoder->appsink,
            NULL
    );

    if (gst_element_link_many(x264gst_alpha_encoder->appsrc,
                              x264gst_alpha_encoder->videobox,
                              x264gst_alpha_encoder->tee,
                              NULL) != TRUE ||
        gst_element_link_many(x264gst_alpha_encoder->alpha.queue,
                              x264gst_alpha_encoder->alpha.glupload,
                              x264gst_alpha_encoder->alpha.glcolorconvert0,
                              x264gst_alpha_encoder->alpha.glshader,
                              x264gst_alpha_encoder->alpha.glcolorconvert1,
                              x264gst_alpha_encoder->alpha.gldownload,
                              x264gst_alpha_encoder->alpha.x264enc,
                              x264gst_alpha_encoder->alpha.appsink, NULL) != TRUE ||
        gst_element_link_many(x264gst_alpha_encoder->queue,
                              x264gst_alpha_encoder->glupload,
                              x264gst_alpha_encoder->glcolorconvert,
                              x264gst_alpha_encoder->gldownload,
                              x264gst_alpha_encoder->x264enc,
                              x264gst_alpha_encoder->appsink, NULL) != TRUE) {
        g_printerr("Elements could not be linked.\n");
        gst_object_unref(x264gst_alpha_encoder->pipeline);
        return -1;
    }

    alpha_tee_pad = gst_element_get_request_pad(x264gst_alpha_encoder->tee, "src_%u");
    alpha_queue_pad = gst_element_get_static_pad(x264gst_alpha_encoder->alpha.queue, "sink");
    tee_pad = gst_element_get_request_pad(x264gst_alpha_encoder->tee, "src_%u");
    queue_pad = gst_element_get_static_pad(x264gst_alpha_encoder->queue, "sink");
    if (gst_pad_link(alpha_tee_pad, alpha_queue_pad) != GST_PAD_LINK_OK ||
        gst_pad_link(tee_pad, queue_pad) != GST_PAD_LINK_OK) {
        g_printerr("Tee could not be linked.\n");
        gst_object_unref(x264gst_alpha_encoder->pipeline);
        return -1;
    }
    gst_object_unref(alpha_queue_pad);
    gst_object_unref(queue_pad);

    return 0;
}

static int
x264gst_alpha_encoder_ensure_size(struct x264gst_alpha_encoder *x264gst_alpha_encoder, const u_int32_t width,
                                  const u_int32_t height) {

    if (x264gst_alpha_encoder->width == width && x264gst_alpha_encoder->height == height) {
        return 0;
    }

    x264gst_alpha_encoder->width = width;
    x264gst_alpha_encoder->height = height;

    // videobox
    g_object_set(x264gst_alpha_encoder->videobox,
                 "border-alpha", G_TYPE_DOUBLE, 0.0,
                 "bottom", G_TYPE_INT, 0 - (height % 2),
                 "right", G_TYPE_INT, 0 - (width % 2),
                 NULL);

    return 0;
}

static int
x264gst_alpha_encoder_destroy(const struct encoder *encoder) {
    struct x264gst_alpha_encoder *x264gst_alpha_encoder;

    x264gst_alpha_encoder = (struct x264gst_alpha_encoder *) encoder;
    // TODO cleanup all gstreamer resources

    free(x264gst_alpha_encoder);
}

static int
x264gst_alpha_encoder_encode(const struct encoder *encoder,
                             void *buffer,
                             const uint32_t bufferWidth,
                             const uint32_t bufferHeight,
                             struct encoding_callback_data *encoding_callback_data) {
    struct x264gst_alpha_encoder *x264gst_alpha_encoder;
    GstAppSinkCallbacks opaque_sample_callbacks, alpha_sample_callbacks;

    x264gst_alpha_encoder = (struct x264gst_alpha_encoder *) encoder;

    opaque_sample_callbacks.new_sample = new_opaque_sample;
    alpha_sample_callbacks.new_sample = new_alpha_sample;

    gst_app_sink_set_callbacks(GST_APP_SINK(x264gst_alpha_encoder->appsink),
                               &opaque_sample_callbacks,
                               encoding_callback_data,
                               destroy_notify);
    gst_app_sink_set_callbacks(GST_APP_SINK(x264gst_alpha_encoder->alpha.appsink),
                               &alpha_sample_callbacks,
                               encoding_callback_data,
                               destroy_notify);

    x264gst_alpha_encoder_ensure_size(x264gst_alpha_encoder, bufferWidth, bufferHeight);
    // TODO push buffer
}

const struct encoder *
x264gst_alpha_encoder_create(const uint32_t width, const uint32_t height) {
    struct x264gst_alpha_encoder *x264gst_alpha_encoder;

    x264gst_alpha_encoder = malloc(sizeof(struct x264gst_alpha_encoder));

    x264gst_alpha_encoder->base_encoder.destroy = x264gst_alpha_encoder_destroy;
    x264gst_alpha_encoder->base_encoder.encode = x264gst_alpha_encoder_encode;

    // common pipe
    x264gst_alpha_encoder->appsrc = gst_element_factory_make("appsrc", "appsrc");
    x264gst_alpha_encoder->videobox = gst_element_factory_make("videobox", "videobox");
    x264gst_alpha_encoder->tee = gst_element_factory_make("tee", "tee");

    // alpha pipe
    x264gst_alpha_encoder->alpha.queue = gst_element_factory_make("queue", "queue_alpha");
    x264gst_alpha_encoder->alpha.glupload = gst_element_factory_make("glupload", "glupload_alpha");
    x264gst_alpha_encoder->alpha.glcolorconvert0 = gst_element_factory_make("glcolorconvert", "glcolorconvert_alpha_0");
    x264gst_alpha_encoder->alpha.glshader = gst_element_factory_make("glshader", "glshader");
    x264gst_alpha_encoder->alpha.glcolorconvert1 = gst_element_factory_make("glcolorconvert", "glcolorconvert_alpha_1");
    x264gst_alpha_encoder->alpha.gldownload = gst_element_factory_make("gldownload", "gldownload_alpha");
    x264gst_alpha_encoder->alpha.x264enc = gst_element_factory_make("x264enc", "x264enc_alpha");
    x264gst_alpha_encoder->alpha.appsink = gst_element_factory_make("appsink", "appsink_alpha");

    // opaque pipe
    x264gst_alpha_encoder->queue = gst_element_factory_make("queue", "queue");
    x264gst_alpha_encoder->glupload = gst_element_factory_make("glupload", "glupload");
    x264gst_alpha_encoder->glcolorconvert = gst_element_factory_make("glcolorconvert", "glcolorconvert");
    x264gst_alpha_encoder->gldownload = gst_element_factory_make("gldownload", "gldownload");
    x264gst_alpha_encoder->x264enc = gst_element_factory_make("x264enc", "x264enc");
    x264gst_alpha_encoder->appsink = gst_element_factory_make("appsink", "appsink");

    // gstreamer pipeline
    x264gst_alpha_encoder->pipeline = gst_pipeline_new("pipeline_x264_alpha");

    x264gst_alpha_encoder_init(x264gst_alpha_encoder, width, height);

    return &x264gst_alpha_encoder->base_encoder;
}
