// TODO replace with generic ones, once we get everything working

#include <stdio.h>
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

static void encoder_finalize_cb(napi_env env,
                                void *finalize_data,
                                void *finalize_hint) {
    struct encoder *encoder;

    encoder = finalize_data;

    encoder->destroy(encoder);
}

// expected arguments in order:
// - string encoder_type
// - number width
// - number height
// return:
// - encoderContext
napi_value
createEncoder(napi_env env, napi_callback_info info) {
    size_t argc = 3;
    napi_value argv[argc];
    napi_value encoder_value;

    size_t encoder_type_length;
    uint32_t width, height;
    const struct encoder *encoder;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    NAPI_CALL(env, napi_get_value_string_latin1(env, argv[0], NULL, 0L, &encoder_type_length))
    char encoder_type[encoder_type_length + 1];
    NAPI_CALL(env, napi_get_value_string_latin1(env, argv[0], encoder_type, encoder_type_length, NULL))
    NAPI_CALL(env, napi_get_value_uint32(env, argv[1], &width))
    NAPI_CALL(env, napi_get_value_uint32(env, argv[2], &height))

    if (strcmp(encoder_type, "x264_alpha") == 0) {
        encoder = x264gst_alpha_encoder_create(width, height);
    } else if (strcmp(encoder_type, "x264") == 0) {
        encoder = x264gst_encoder_create(width, height);
    } else {
        const char msg[] = "No encoder found with type %s";
        char *error_msg = calloc(sizeof(msg) + encoder_type_length, sizeof(char));
        sprintf(error_msg, msg, encoder_type);
        napi_throw_error((env), NULL, error_msg);

        NAPI_CALL(env, napi_get_undefined(env, &encoder_value))
        return encoder_value;
    }

    if (encoder) {
        NAPI_CALL(env, napi_create_external(env, (void *) encoder, encoder_finalize_cb, NULL, &encoder_value))
    } else {
        NAPI_CALL(env, napi_get_undefined(env, &encoder_value))
    }
    return encoder_value;
}

static void
finalize_gst_buffer(napi_env env,
                    void *finalize_data,
                    void *finalize_hint) {
    GstBuffer *buffer;

    buffer = finalize_data;
    gst_buffer_unref(buffer);
}


static void
gst_sample_to_node_buffer_cb(napi_env env, napi_value js_callback, void *context, void *data) {
    napi_value buffer_value, global, cb_result;
    GstSample *sample;
    GstBuffer *buffer;
    gsize size;

    sample = data;
    buffer = gst_sample_get_buffer(sample);
    size = gst_buffer_get_size(buffer);

    NAPI_CALL(env, napi_create_external_buffer(env, size, (void **) &buffer, finalize_gst_buffer, NULL, &buffer_value))
    NAPI_CALL(env, napi_get_global(env, &global))
    NAPI_CALL(env, napi_call_function(env, global, js_callback, 1, &buffer_value, &cb_result))
}

static void
encoder_opaque_sample_ready_callback(struct encoding_callback_data *encoding_callback_data, GstSample *sample) {
    napi_call_threadsafe_function(encoding_callback_data->js_cb_ref, sample, napi_tsfn_blocking);

    encoding_callback_data->js_cb_ref = NULL;
    if (encoding_callback_data->js_cb_ref_alpha == NULL) {
        free(encoding_callback_data);
    }
}

static void
encoder_alpha_sample_ready_callback(struct encoding_callback_data *encoding_callback_data, GstSample *sample) {
    napi_call_threadsafe_function(encoding_callback_data->js_cb_ref_alpha, sample, napi_tsfn_blocking);

    encoding_callback_data->js_cb_ref_alpha = NULL;
    if (encoding_callback_data->js_cb_ref == NULL) {
        free(encoding_callback_data);
    }
}

// expected arguments in order:
// - encoder - argv[0]
// - Buffer buffer - argv[1]
// - string format - argv[2]
// - number width - argv[3]
// - number height - argv[4]
// - function callback - argv[5]
// - function alpha_callback - argv[6]
// return:
// - void
napi_value
encodeBuffer(napi_env env, napi_callback_info info) {
    size_t argc = 7;
    napi_value argv[argc], return_value, null_value;
    napi_threadsafe_function js_cb_ref, js_cb_ref_alpha;

    const struct encoder *encoder;
    void *buffer;
    size_t buffer_length, format_length;
    uint32_t width, height;
    struct encoding_callback_data *encoding_callback_data;
    bool alpha_cb_is_null;

    encoding_callback_data = malloc(sizeof(struct encoding_callback_data));
    encoding_callback_data->encoder_opaque_sample_ready_callback = encoder_opaque_sample_ready_callback;
    encoding_callback_data->encoder_alpha_sample_ready_callback = encoder_alpha_sample_ready_callback;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    NAPI_CALL(env, napi_get_value_external(env, argv[0], (void **) &encoder))
    NAPI_CALL(env, napi_get_buffer_info(env, argv[1], &buffer, &buffer_length))
    NAPI_CALL(env, napi_get_value_string_latin1(env, argv[2], NULL, 0L, &format_length))
    char format[format_length + 1];
    NAPI_CALL(env, napi_get_value_string_latin1(env, argv[2], format, format_length, NULL))
    NAPI_CALL(env, napi_get_value_uint32(env, argv[3], &width))
    NAPI_CALL(env, napi_get_value_uint32(env, argv[4], &height))
    NAPI_CALL(env, napi_create_threadsafe_function(
            env, argv[5], NULL, NULL, 0, 2, NULL, NULL, NULL, &gst_sample_to_node_buffer_cb, &js_cb_ref))
    encoding_callback_data->js_cb_ref = js_cb_ref;

    NAPI_CALL(env, napi_get_null(env, &null_value))
    NAPI_CALL(env, napi_strict_equals(env, argv[6], null_value, &alpha_cb_is_null))
    if (alpha_cb_is_null) {
        encoding_callback_data->js_cb_ref_alpha = NULL;
    } else {
        NAPI_CALL(env, napi_create_threadsafe_function(
                env, argv[6], NULL, NULL, 0, 2, NULL, NULL, NULL, &gst_sample_to_node_buffer_cb, &js_cb_ref_alpha))
        encoding_callback_data->js_cb_ref_alpha = js_cb_ref_alpha;
    }

    encoder->encode(encoder, buffer, format, width, height, encoding_callback_data);

    NAPI_CALL(env, napi_get_undefined(env, &return_value))
    return return_value;
}


napi_value
init(napi_env env, napi_value exports) {
    napi_property_descriptor desc[] = {
            DECLARE_NAPI_METHOD("createEncoder", createEncoder),
            DECLARE_NAPI_METHOD("encodeBuffer", encodeBuffer),
    };

    NAPI_CALL(env, napi_define_properties(env, exports, sizeof(desc) / sizeof(napi_property_descriptor), desc))
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init)
