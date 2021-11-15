#include <stdlib.h>
#include <gst/gst.h>
#include <gst/app/gstappsrc.h>
#include <gst/app/gstappsink.h>
#include <stdint.h>
#include "encoder.h"
#include "shm.h"

struct png_gst_encoder {
    // gstreamer
    GstAppSrc *app_src;
    GstAppSink *app_sink;
    GstElement *pipeline;
};

static GstFlowReturn
new_sample(GstAppSink *appsink, gpointer user_data) {
    struct encoder *encoder = user_data;
    GstSample *sample = gst_app_sink_pull_sample(appsink);

    if(sample) {
        encoder->callback_data.opaque_sample_ready_callback(encoder, sample);
        return GST_FLOW_OK;
    }

    return GST_FLOW_ERROR;
}

static GstAppSinkCallbacks opaque_sample_callbacks = {
        .eos = NULL,
        .new_sample = new_sample,
        .new_preroll = NULL
};

static int
png_encoder_destroy(struct encoder *encoder) {
    struct png_gst_encoder *png_gst_encoder = (struct png_gst_encoder *) encoder->encoder_data;
    // TODO cleanup all gstreamer resources

    gst_object_unref(png_gst_encoder->app_src);
    gst_object_unref(png_gst_encoder->app_sink);

    // gstreamer pipeline
    gst_element_set_state(png_gst_encoder->pipeline, GST_STATE_NULL);
    gst_object_unref(png_gst_encoder->pipeline);

    free(png_gst_encoder);
    return 0;
}

static void
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
        return;
    }
    gst_caps_unref((GstCaps *) current_src_caps);

    gst_app_src_set_caps(png_gst_encoder->app_src, new_src_caps);
    gst_caps_unref((GstCaps *) new_src_caps);
}

static int
png_gst_encoder_encode(struct encoder *encoder,
                       struct wl_resource *buffer_resource) {
    struct png_gst_encoder *png_gst_encoder = (struct png_gst_encoder *) encoder->encode_data;
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

    png_gst_encoder_ensure_size(png_gst_encoder, gst_format, buffer_width, buffer_height);
    ret = gst_app_src_push_buffer(png_gst_encoder->app_src, buffer);

    if (ret != GST_FLOW_OK) {
        /* We got some error, stop sending data */
        return TRUE;
    }

    return FALSE;
}

static struct encoder *
png_gst_encoder_create(const struct encoder *encoder) {
    struct png_gst_encoder *png_gst_encoder;

    png_gst_encoder = calloc(1, sizeof(struct png_gst_encoder));

    gst_init(NULL, NULL);
    png_gst_encoder->pipeline = gst_parse_launch(
            "appsrc name=src format=3 caps=video/x-raw ! "
            "videoconvert ! "
            "pngenc ! "
            "appsink name=sink",
            NULL);

    png_gst_encoder->app_src = GST_APP_SRC(gst_bin_get_by_name(GST_BIN(png_gst_encoder->pipeline), "src"));
    png_gst_encoder->app_sink = GST_APP_SINK(
            gst_bin_get_by_name(GST_BIN(png_gst_encoder->pipeline), "sink"));

    gst_app_sink_set_callbacks(png_gst_encoder->app_sink,
                               &opaque_sample_callbacks,
                               (gpointer) encoder,
                               NULL);

    gst_element_set_state(png_gst_encoder->pipeline, GST_STATE_PLAYING);
    encoder->encoder_data = (struct encoder *) png_gst_encoder;
    return 1;
}

static int png_supports_buffer(struct encoder *encoder,
                               struct wl_resource *buffer_resource) {

    struct wl_shm_buffer *shm_buffer;

    shm_buffer = wl_shm_buffer_get(buffer_resource);

    const int32_t width = wl_shm_buffer_get_width(shm_buffer);
    const int32_t height = wl_shm_buffer_get_height(shm_buffer);

    if (width * height <= 256 * 256) {
        return 1;
    }
    return 0;
}

struct encoder_module {
    png_supports_buffer,
    png_gst_encoder_create,
    png_gst_encoder_encode,
    png_encoder_destroy,
    0,
} png_module;
