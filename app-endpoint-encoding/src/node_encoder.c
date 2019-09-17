// TODO replace with generic ones, once we get everything working
#include "/home/erik/.nvm/versions/node/v12.9.1/include/node/node_api.h"
#include "/home/erik/.nvm/versions/node/v12.9.1/include/node/uv.h"

#include "encoder.h"
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

// expected arguments in order:
// - string type
// - number width
// - number height
// - string gstFormat
// return:
// - encoderContext
napi_value
createEncoder(const napi_env env, const napi_callback_info info) {
    // TODO get args from nodejs
    const char *type;
    const uint32_t width, height;
    const struct encoder *encoder;

    if (strcmp(type, "x264_alpha") == 0) {
        encoder = x264gst_alpha_encoder_create(width, height);
    } else if (strcmp(type, "x264") == 0) {
        encoder = x264gst_encoder_create(width, height);
    } else if (strcmp(type, "nv264") == 0) {

    } else if (strcmp(type, "nv264_alpha") == 0) {

    } else {
        //TODO throw exception
    }

    // TODO return encoder as context
}

static void
opaque_encode_callback(const struct encoding_callback_data *encoding_callback_data, const void *frame) {
    // TODO call js function on main node thread
    // TODO if all members are null, free callback_data
}

static void
alpha_encode_callback(const struct encoding_callback_data *encoding_callback_data, const void *frame) {
    // TODO call js function on main node thread
    // TODO if all members are null, free callback_data
}


// expected arguments in order:
// - encoder
// - Buffer buffer
// - number width
// - number height
// - function callback
// return:
// - void
napi_value
encodeBuffer(const napi_env env, const napi_callback_info info) {
    // TODO get arguments from nodejs args
    uint32_t width, height;
    const struct encoder *encoder;
    void *buffer;
    struct encoding_callback_data *encoding_callback_data;

    encoding_callback_data = malloc(sizeof(struct encoding_callback_data));
    encoding_callback_data->encode_callback = opaque_encode_callback;
    encoding_callback_data->user_data = js_callback;
    encoding_callback_data->alpha_encode_callback = alpha_encode_callback;
    encoding_callback_data->alpha_user_data = alpha_js_callback;

    // TODO ensure encoding size
    // TODO save js function callback in encoder
    encoder->encode(encoder, buffer, width, height, encoding_callback_data);
}


napi_value
init(const napi_env env, const napi_value exports) {
    napi_property_descriptor desc[] = {
            DECLARE_NAPI_METHOD("createEncoder", createEncoder),
            DECLARE_NAPI_METHOD("encodeBuffer", encodeBuffer),
    };

    NAPI_CALL(env, napi_define_properties(env, exports, sizeof(desc) / sizeof(napi_property_descriptor), desc))
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init)
