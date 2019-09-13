#include <node_api.h>
#include <gst/gst.h>

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

GstElement *pipeline;
GstBus *bus;

// expected arguments in order:
// - string pipelineName
// - number width
// - number height
// - string gstEncoding
// return:
// - void
napi_value
startEncoder(napi_env env, napi_callback_info info) {
    gst_init (NULL, NULL);

    /* Build the pipeline */
    pipeline = gst_parse_launch(
            "appsrc name=source block=true is-live=true min-latency=0 max-latency=-1 do-timestamp=true format=bytes stream-type=stream caps=video/x-raw,framerate=60/1 ! \n"
            "       \n"
            "       tee name=t ! queue ! \n"
            "       glupload ! \n"
            "       glcolorconvert ! \n"
            "       glshader fragment=\" \n"
            "         #version 120 \n"
            "         #ifdef GL_ES \n"
            "         precision mediump float; \n"
            "         #endif \n"
            "         varying vec2 v_texcoord; \n"
            "         uniform sampler2D tex; \n"
            "         uniform float time; \n"
            "         uniform float width; \n"
            "         uniform float height; \n"
            " \n"
            "         void main () { \n"
            "           vec4 pix = texture2D(tex, v_texcoord); \n"
            "           gl_FragColor = vec4(pix.a,pix.a,pix.a,0); \n"
            "         } \n"
            "       \" \n"
            "       vertex = \" \n"
            "         #version 120 \n"
            "         #ifdef GL_ES \n"
            "         precision mediump float; \n"
            "         #endif \n"
            "         attribute vec4 a_position; \n"
            "         attribute vec2 a_texcoord; \n"
            "         varying vec2 v_texcoord; \n"
            " \n"
            "         void main() { \n"
            "           gl_Position = a_position; \n"
            "           v_texcoord = a_texcoord; \n"
            "       } \n"
            "       \" ! \n"
            "       glcolorconvert ! video/x-raw(memory:GLMemory),format=NV12 ! \n"
            "       nvh264enc gop-size=1 qp-min=23 qp-max=42 preset=low-latency-hp rc-mode=vbr-minqp ! \n"
            "       video/x-h264,profile=baseline,stream-format=byte-stream,alignment=au,framerate=60/1 ! \n"
            "       appsink name=alphasink \n"
            " \n"
            "       t. ! queue ! \n"
            "       glupload ! \n"
            "       glcolorconvert ! video/x-raw(memory:GLMemory),format=NV12 ! \n"
            "       nvh264enc gop-size=1 qp-min=23 qp-max=38 preset=low-latency-hp rc-mode=vbr-minqp ! \n"
            "       video/x-h264,profile=baseline,stream-format=byte-stream,alignment=au,framerate=60/1 ! \n"
            "       appsink name=sink",
            NULL
    );

    /* Start playing */
    gst_element_set_state(pipeline, GST_STATE_PLAYING);

//    /* Wait until error or EOS */
//    bus = gst_element_get_bus(pipeline);
//    msg = gst_bus_timed_pop_filtered(bus, GST_CLOCK_TIME_NONE,
//                                     GST_MESSAGE_ERROR | GST_MESSAGE_EOS);
}

// expected arguments in order:
// return:
// - void
napi_value
stopEncoder(napi_env env, napi_callback_info info) {
    /* Free resources */
    gst_object_unref(bus);
    gst_element_set_state(pipeline, GST_STATE_NULL);
    gst_object_unref(pipeline);
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
