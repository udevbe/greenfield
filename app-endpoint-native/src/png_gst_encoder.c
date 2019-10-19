//
// Created by erik on 9/24/19.
//
#include <gst/gst.h>
#include <gst/app/gstappsrc.h>
#include <gst/app/gstappsink.h>
#include <stdio.h>
#include "png_gst_encoder.h"

struct png_gst_encoder {
    // base type
    struct encoder base_encoder;

    // gstreamer
    GstAppSrc *app_src;
    GstElement *videobox;
    GstAppSink *app_sink;
    GstElement *pipeline;
};

static GstFlowReturn
new_sample(GstAppSink *appsink, gpointer user_data) {
    const struct encoder *encoder = user_data;
    const GstSample *sample = gst_app_sink_pull_sample(appsink);

    encoder->callback_data.opaque_sample_ready_callback(encoder, sample);

    return GST_FLOW_OK;
}

static int
png_encoder_destroy(const struct encoder *encoder) {
    struct png_gst_encoder *png_gst_encoder;

    png_gst_encoder = (struct png_gst_encoder *) encoder;
    // TODO cleanup all gstreamer resources

    png_gst_encoder->base_encoder.destroy = NULL;
    png_gst_encoder->base_encoder.encode = NULL;

    gst_object_unref(png_gst_encoder->app_src);
    gst_object_unref(png_gst_encoder->videobox);
    gst_object_unref(png_gst_encoder->app_sink);

    // gstreamer pipeline
    gst_element_set_state(png_gst_encoder->pipeline, GST_STATE_NULL);
    gst_object_unref(png_gst_encoder->pipeline);

    free(png_gst_encoder);
    return 0;
}

static int
png_gst_encoder_ensure_size(struct png_gst_encoder *png_gst_encoder,
                            const char *format,
                            const u_int32_t width,
                            const u_int32_t height) {
    const GstCaps *current_src_caps = gst_app_src_get_caps(png_gst_encoder->app_src);
    const GstCaps *new_src_caps = gst_caps_new_simple("video/x-raw",
                                                      "framerate", GST_TYPE_FRACTION, 0, 1,
                                                      "format", G_TYPE_STRING, format,
                                                      "width", G_TYPE_INT, width,
                                                      "height", G_TYPE_INT, height,
                                                      NULL);
    if (gst_caps_is_equal(current_src_caps, new_src_caps)) {
        gst_caps_unref((GstCaps *) new_src_caps);
        gst_caps_unref((GstCaps *) current_src_caps);
        return 0;
    }
    gst_caps_unref((GstCaps *) current_src_caps);

    gst_app_src_set_caps(png_gst_encoder->app_src, new_src_caps);
    gst_caps_unref((GstCaps *) new_src_caps);

    g_object_set(png_gst_encoder->videobox,
                 "bottom", height < 16 ? height - 16 : 0,
                 "right", width < 16 ? width - 16 : 0,
                 NULL);

    return 0;
}

static int
png_gst_encoder_encode(const struct encoder *encoder,
                       void *buffer_data,
                       const size_t buffer_size,
                       const char *format,
                       const uint32_t buffer_width,
                       const uint32_t buffer_height) {
    struct png_gst_encoder *png_gst_encoder = (struct png_gst_encoder *) encoder;
    GstBuffer *buffer = gst_buffer_new_wrapped(buffer_data, buffer_size);
    // FIXME find a way so that the buffer doesn't free the memory instead of keeping the gst_buffer object alive eternally (mem leak)
    gst_buffer_ref(buffer);

    png_gst_encoder_ensure_size(png_gst_encoder, format, buffer_width, buffer_height);
    gst_app_src_push_buffer(png_gst_encoder->app_src, buffer);

    return 0;
}

struct encoder *
png_gst_encoder_create(const char *format, uint32_t width, uint32_t height) {
    struct png_gst_encoder *png_gst_encoder;

    png_gst_encoder = calloc(1, sizeof(struct png_gst_encoder));
    png_gst_encoder->base_encoder.destroy = png_encoder_destroy;
    png_gst_encoder->base_encoder.encode = png_gst_encoder_encode;

    gst_init(NULL, NULL);
    png_gst_encoder->pipeline = gst_parse_launch(
            "appsrc name=src format=3 caps=video/x-raw ! "
            "videobox name=videobox border-alpha=0.0 ! "
            "videoconvert ! videoscale ! "
            "pngenc ! "
            "appsink name=sink",
            NULL);

    png_gst_encoder->app_src = GST_APP_SRC(gst_bin_get_by_name(GST_BIN(png_gst_encoder->pipeline), "src"));
    png_gst_encoder->videobox = gst_bin_get_by_name(GST_BIN(png_gst_encoder->pipeline), "videobox");
    png_gst_encoder->app_sink = GST_APP_SINK(
            gst_bin_get_by_name(GST_BIN(png_gst_encoder->pipeline), "sink"));

    png_gst_encoder_ensure_size(png_gst_encoder, format, width, height);

    GstAppSinkCallbacks opaque_sample_callbacks = {
            .eos = NULL,
            .new_sample = new_sample,
            .new_preroll = NULL
    };

    gst_app_sink_set_callbacks(png_gst_encoder->app_sink,
                               &opaque_sample_callbacks,
                               (gpointer) png_gst_encoder,
                               NULL);

    gst_element_set_state(png_gst_encoder->pipeline, GST_STATE_PLAYING);

    return (struct encoder *) png_gst_encoder;
}
