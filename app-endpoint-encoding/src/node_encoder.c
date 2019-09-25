#include <stdio.h>
#include "encoder.h"
#include "x264_gst_encoder.h"
#include "png_gst_encoder.h"

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
    struct encoder *encoder = finalize_data;
    encoder->destroy(encoder);

    NAPI_CALL(env, napi_unref_threadsafe_function(env, encoder->callback_data.js_cb_ref))
    NAPI_CALL(env, napi_unref_threadsafe_function(env, encoder->callback_data.js_cb_ref_alpha))
    napi_release_threadsafe_function(encoder->callback_data.js_cb_ref, napi_tsfn_release);
    napi_release_threadsafe_function(encoder->callback_data.js_cb_ref_alpha, napi_tsfn_release);
}

static void
encoder_opaque_sample_ready_callback(const struct encoder *encoder, const GstSample *sample) {
    napi_call_threadsafe_function(encoder->callback_data.js_cb_ref, (void *) sample, napi_tsfn_blocking);
}

static void
encoder_alpha_sample_ready_callback(const struct encoder *encoder, const GstSample *sample) {
    napi_call_threadsafe_function(encoder->callback_data.js_cb_ref_alpha, (void *) sample, napi_tsfn_blocking);
}

static void
finalize_gst_buffer(napi_env env,
                    void *finalize_data,
                    void *finalize_hint) {
    GstSample *sample = finalize_hint;
    gst_sample_unref(sample);
}

static void
gst_sample_to_node_buffer_cb(napi_env env, napi_value js_callback, void *context, void *data) {
    if (env == NULL) {
        gst_sample_unref(data);
        return;
    }
    napi_value buffer_value, global, cb_result;
    GstSample *sample = data;
    GstBuffer *buffer = gst_sample_get_buffer(sample);
    GstMapInfo map;
    gst_buffer_map(buffer, &map, GST_MAP_READ);

    NAPI_CALL(env,
              napi_create_external_buffer(env, map.size, map.data, finalize_gst_buffer, sample, &buffer_value))
    gst_buffer_unmap(buffer, &map);
    napi_value args[] = {buffer_value};
    NAPI_CALL(env, napi_get_global(env, &global))
    NAPI_CALL(env, napi_call_function(env, global, js_callback, 1, args, &cb_result))
}

static void
gst_alpha_sample_to_node_buffer_cb(napi_env env, napi_value js_callback, void *context, void *data) {
    if (env == NULL) {
        gst_sample_unref(data);
        return;
    }
    napi_value buffer_value, global, cb_result;
    struct encoder *encoder = context;
    GstSample *sample = data;
    GstBuffer *buffer = gst_sample_get_buffer(sample);
    GstMapInfo map;
    gst_buffer_map(buffer, &map, GST_MAP_READ);

    NAPI_CALL(env,
              napi_create_external_buffer(env, map.size, map.data, finalize_gst_buffer, sample, &buffer_value))
    gst_buffer_unmap(buffer, &map);
    napi_value args[] = {buffer_value};
    NAPI_CALL(env, napi_get_global(env, &global))
    NAPI_CALL(env, napi_call_function(env, global, js_callback, 1, args, &cb_result))
}

// expected arguments in order:
// - string encoder_type - argv[0]
// - string format - argv[1]
// - number width - argv[2]
// - number height - argv[3]
// - function callback - argv[4]
// - function alpha_callback - argv[5]
// return:
// - encoderContext
napi_value
createEncoder(napi_env env, napi_callback_info info) {
    size_t argc = 6;
    napi_value encoder_value, null_value, cb_name, cb_alpha_name, argv[argc];
    napi_threadsafe_function js_cb_ref, js_cb_ref_alpha;

    size_t encoder_type_length, format_length;
    uint32_t width, height;
    struct encoder *encoder;
    bool alpha_cb_is_null;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    NAPI_CALL(env, napi_get_value_string_latin1(env, argv[0], NULL, 0L, &encoder_type_length))
    char encoder_type[encoder_type_length + 1];
    NAPI_CALL(env, napi_get_value_string_latin1(env, argv[0], encoder_type, sizeof(encoder_type), NULL))

    NAPI_CALL(env, napi_get_value_string_latin1(env, argv[1], NULL, 0L, &format_length))
    char format[format_length + 1];
    NAPI_CALL(env, napi_get_value_string_latin1(env, argv[1], format, sizeof(format), NULL))

    NAPI_CALL(env, napi_get_value_uint32(env, argv[2], &width))
    NAPI_CALL(env, napi_get_value_uint32(env, argv[3], &height))

    if (strcmp(encoder_type, "x264_alpha") == 0) {
        encoder = x264_gst_alpha_encoder_create(format, width, height);
    } else if (strcmp(encoder_type, "x264") == 0) {
        encoder = x264_gst_encoder_create(format, width, height);
    } else if (strcmp(encoder_type, "png") == 0) {
        encoder = png_gst_encoder_create(format, width, height);
    } else {
        const char msg[] = "No encoder found with type %s";
        char *error_msg = calloc(sizeof(msg) + encoder_type_length, sizeof(char));
        sprintf(error_msg, msg, encoder_type);
        napi_throw_error((env), NULL, error_msg);

        NAPI_CALL(env, napi_get_undefined(env, &encoder_value))
        return encoder_value;
    }

    if (encoder) {
        encoder->callback_data.opaque_sample_ready_callback = encoder_opaque_sample_ready_callback;
        encoder->callback_data.alpha_sample_ready_callback = encoder_alpha_sample_ready_callback;

        NAPI_CALL(env, napi_create_external(env, (void *) encoder, encoder_finalize_cb, NULL, &encoder_value))
    } else {
        NAPI_CALL(env, napi_get_undefined(env, &encoder_value))
        return encoder_value;
    }

    napi_create_string_utf8(env, "opaque_callback", NAPI_AUTO_LENGTH, &cb_name);
    NAPI_CALL(env, napi_create_threadsafe_function(
            env,
            argv[4],
            NULL,
            cb_name,
            0,
            2,
            NULL,
            NULL,
            encoder,
            gst_sample_to_node_buffer_cb,
            &js_cb_ref))
    encoder->callback_data.js_cb_ref = js_cb_ref;

    NAPI_CALL(env, napi_get_null(env, &null_value))
    NAPI_CALL(env, napi_strict_equals(env, argv[5], null_value, &alpha_cb_is_null))
    if (alpha_cb_is_null) {
        encoder->callback_data.js_cb_ref_alpha = NULL;
    } else {
        napi_create_string_utf8(env, "alpha_callback", NAPI_AUTO_LENGTH, &cb_alpha_name);
        NAPI_CALL(env, napi_create_threadsafe_function(
                env, // env
                argv[5], // func
                NULL, // async_resource
                cb_alpha_name, // async_resource_name
                0, // max_queue_size
                2, // initial_thread_count
                NULL, // thread_finalize_data
                NULL, // thread_finalize_cb
                encoder, // context
                gst_alpha_sample_to_node_buffer_cb, // call_js_cb
                &js_cb_ref_alpha)) // result
        encoder->callback_data.js_cb_ref_alpha = js_cb_ref_alpha;
    }

    return encoder_value;
}

// expected arguments in order:
// - encoder - argv[0]
// - Buffer buffer - argv[1]
// - string format - argv[2]
// - number width - argv[3]
// - number height - argv[4]
// return:
// - void
napi_value
encodeBuffer(napi_env env, napi_callback_info info) {
    size_t argc = 5;
    napi_value argv[argc], return_value;

    struct encoder *encoder;
    void *buffer;
    size_t buffer_length, format_length;
    uint32_t width, height;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    NAPI_CALL(env, napi_get_value_external(env, argv[0], (void **) &encoder))
    NAPI_CALL(env, napi_get_buffer_info(env, argv[1], &buffer, &buffer_length))
    NAPI_CALL(env, napi_get_value_string_latin1(env, argv[2], NULL, 0L, &format_length))
    char format[format_length + 1];
    NAPI_CALL(env, napi_get_value_string_latin1(env, argv[2], format, sizeof(format), NULL))
    NAPI_CALL(env, napi_get_value_uint32(env, argv[3], &width))
    NAPI_CALL(env, napi_get_value_uint32(env, argv[4], &height))

    encoder->encode(encoder, buffer, buffer_length, format, width, height);

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
