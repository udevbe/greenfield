#include <node_api.h>

#include <gst/gst.h>
#include <gst/app/gstappsrc.h>
#include "gst/videobox/gstvideobox.h"

#include "x264gst_encoder.h"

#define DECLARE_NAPI_METHOD(name, func)                          \
  { name, 0, func, 0, 0, 0, napi_default, 0 }

#define GET_AND_THROW_LAST_ERROR(env)                                    \
    const napi_extended_error_info *error_info;                          \
    napi_get_last_error_info((env), &error_info);                        \
    bool is_pending;                                                     \
    napi_is_exception_pending((env), &is_pending);                       \
    /* If an exception is already pending, don't rethrow it */           \
    if (!is_pending) {                                                   \
      const char* error_message = error_info->error_message != NULL ?    \
        error_info->error_message :                                      \
        "empty error message";                                           \
      napi_throw_error((env), NULL, error_message);                      \
    }

#define NAPI_CALL(env, the_call) {                                       \
    if ((the_call) != napi_ok) {                                         \
        GET_AND_THROW_LAST_ERROR((env));                                 \
    }                                                                    \
}

int
init_x264gst_encoder(struct encoder *encoder, u_int32_t width, u_int32_t height) {
    struct x264gst_alpha_encoder *x264gst_alpha_encoder;
    GstPad *alpha_tee_pad, *tee_pad, *alpha_queue_pad, *queue_pad, *alpha_glcolorconvert_source;
    GstCaps *app_src_caps, *alpha_glcolorconvert_source_caps;

    x264gst_alpha_encoder = (struct x264gst_alpha_encoder *) encoder;

    x264gst_alpha_encoder->base_encoder.width = width;
    x264gst_alpha_encoder->base_encoder.height = height;

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
                 "bottom", G_TYPE_INT, 0 - (width % 2),
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
    alpha_glcolorconvert_source = gst_element_get_static_pad(x264gst_alpha_encoder->alpha.glcolorconvert1,
                                                             "source");
    alpha_glcolorconvert_source_caps = gst_caps_new_simple("video/x-raw(memory:GLMemory)",
                                                           "format", G_TYPE_STRING, "I420",
                                                           NULL);
    gst_pad_set_caps(alpha_glcolorconvert_source, alpha_glcolorconvert_source_caps);
    gst_object_unref(alpha_glcolorconvert_source);
    gst_object_unref(alpha_glcolorconvert_source_caps);

    gst_bin_add_many(
            GST_BIN (x264gst_alpha_encoder),
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
        gst_object_unref(x264gst_alpha_encoder);
        return -1;
    }

    alpha_tee_pad = gst_element_get_request_pad(x264gst_alpha_encoder->tee, "src_%u");
    alpha_queue_pad = gst_element_get_static_pad(x264gst_alpha_encoder->alpha.queue, "sink");
    tee_pad = gst_element_get_request_pad(x264gst_alpha_encoder->tee, "src_%u");
    queue_pad = gst_element_get_static_pad(x264gst_alpha_encoder->queue, "sink");
    if (gst_pad_link(alpha_tee_pad, alpha_queue_pad) != GST_PAD_LINK_OK ||
        gst_pad_link(tee_pad, queue_pad) != GST_PAD_LINK_OK) {
        g_printerr("Tee could not be linked.\n");
        gst_object_unref(x264gst_alpha_encoder);
        return -1;
    }
    gst_object_unref(alpha_queue_pad);
    gst_object_unref(queue_pad);
}

int
resize_x264gst_encoder(struct encoder *encoder, u_int32_t width, u_int32_t height) {

}

int
deinit_x264gst_encoder(struct encoder *encoder) {

}

struct x264gst_alpha_encoder *
create(void) {
    struct x264gst_alpha_encoder *x264gst_alpha_encoder;

    x264gst_alpha_encoder = malloc(sizeof(struct x264gst_alpha_encoder));

    x264gst_alpha_encoder->base_encoder.init = init_x264gst_encoder;
    x264gst_alpha_encoder->base_encoder.deinit = deinit_x264gst_encoder;
    x264gst_alpha_encoder->base_encoder.resize = resize_x264gst_encoder;

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

    // actual pipeline
    x264gst_alpha_encoder->pipeline = gst_pipeline_new("pipeline_x264_alpha");

    return x264gst_alpha_encoder;
}

// expected arguments in order:
// - string pipelineName
// - number width
// - number height
// - string gstEncoding
// return:
// - void
napi_value
startEncoder(napi_env env, napi_callback_info info) {

}

// expected arguments in order:
// return:
// - void
napi_value
stopEncoder(napi_env env, napi_callback_info info) {

}


napi_value
init(napi_env env, napi_value exports) {
    napi_property_descriptor desc[] = {
            DECLARE_NAPI_METHOD("startEncoder", startEncoder),
            DECLARE_NAPI_METHOD("stopEncoder", stopEncoder),
    };

    NAPI_CALL(env, napi_define_properties(env, exports, sizeof(desc) / sizeof(napi_property_descriptor), desc))
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init
)
