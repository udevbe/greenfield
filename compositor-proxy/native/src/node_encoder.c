#include <stdint.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>
#include "encoder.h"

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

extern struct encoder_itf png_gst_itf;
extern struct encoder_itf nv264_gst_itf;
extern struct encoder_itf nv264_gst_alpha_itf;
extern struct encoder_itf x264_gst_itf;
extern struct encoder_itf x264_gst_alpha_itf;

static size_t encoders_count = 5;
static struct encoder_itf *all_encoder_itfs = NULL;

void __attribute__ ((constructor)) on_load() {
    all_encoder_itfs = calloc(encoders_count, sizeof(struct encoder_itf));
    all_encoder_itfs[0] = x264_gst_alpha_itf;
    all_encoder_itfs[1] = x264_gst_itf;
    all_encoder_itfs[2] = nv264_gst_alpha_itf;
    all_encoder_itfs[3] = nv264_gst_itf;
    all_encoder_itfs[4] = png_gst_itf;
}

static void encoder_finalize_cb(napi_env env, void *finalize_data, void *finalize_hint) {
    struct encoder *encoder = finalize_data;
    encoder->itf.destroy(encoder);

    NAPI_CALL(env, napi_unref_threadsafe_function(env, encoder->callback_data.js_cb_ref))
    NAPI_CALL(env, napi_unref_threadsafe_function(env, encoder->callback_data.js_cb_ref_alpha))
    napi_release_threadsafe_function(encoder->callback_data.js_cb_ref, napi_tsfn_release);
    napi_release_threadsafe_function(encoder->callback_data.js_cb_ref_alpha, napi_tsfn_release);
}

static void
encoder_opaque_sample_ready_callback(struct encoder *encoder, struct encoded_frame *encoded_frame) {
    napi_call_threadsafe_function(encoder->callback_data.js_cb_ref, encoded_frame, napi_tsfn_blocking);
}

static void
encoder_alpha_sample_ready_callback(struct encoder *encoder, struct encoded_frame *encoded_frame) {
    napi_call_threadsafe_function(encoder->callback_data.js_cb_ref_alpha, encoded_frame, napi_tsfn_blocking);
}

static void
encoder_finalize_encoded_frame(napi_env env, void *finalize_data, void *finalize_hint) {
    struct encoded_frame *encoded_frame = finalize_hint;
    encoded_frame->encoder->itf.finalize_encoded_frame(encoded_frame->encoder, encoded_frame);
}

static void
encoded_frame_to_node_buffer_cb(napi_env env, napi_value js_callback, void *context, void *data) {
    napi_value separate_alpha_value, encoding_type_value, buffer_value, global, cb_result;
    struct encoded_frame *encoded_frame = data;

    if (env == NULL) {
        encoded_frame->encoder->itf.finalize_encoded_frame(encoded_frame->encoder, encoded_frame);
        return;
    }

    NAPI_CALL(env, napi_create_external_buffer(env, encoded_frame->encoded_data_size, encoded_frame->encoded_data,
                                               encoder_finalize_encoded_frame, encoded_frame, &buffer_value))
    NAPI_CALL(env, napi_get_boolean(env, encoded_frame->encoder->itf.separate_alpha, &separate_alpha_value))
    NAPI_CALL(env, napi_create_int32(env, encoded_frame->encoder->encoding_type, &encoding_type_value))

    napi_value args[] = {buffer_value, separate_alpha_value, encoding_type_value};
    NAPI_CALL(env, napi_get_global(env, &global))
    NAPI_CALL(env, napi_call_function(env, global, js_callback, sizeof(args) / sizeof(args[0]), args, &cb_result))
}

static void
encoded_alpha_frame_to_node_buffer_cb(napi_env env, napi_value js_callback, void *context, void *data) {
    napi_value buffer_value, global, cb_result;
    struct encoded_frame *encoded_frame = data;

    if (env == NULL) {
        encoded_frame->encoder->itf.finalize_encoded_frame(encoded_frame->encoder, encoded_frame);
        return;
    }

    NAPI_CALL(env, napi_create_external_buffer(env, encoded_frame->encoded_data_size, encoded_frame->encoded_data,
                                               encoder_finalize_encoded_frame, encoded_frame, &buffer_value))

    napi_value args[] = {buffer_value};
    NAPI_CALL(env, napi_get_global(env, &global))
    NAPI_CALL(env, napi_call_function(env, global, js_callback, sizeof(args) / sizeof(args[0]), args, &cb_result))
}

/**
 *  expected nodejs arguments in order:
 *  - string encoder_type - argv[0] // 'x264' | 'nvh264'
 *  - object wl_client - argv[1]
 *  - function opaque_callback - argv[2]
 *  - function alpha_callback - argv[3]
 * return:
 *  - object encoderContext
 * @param env
 * @param info
 * @return
 */
static napi_value
createEncoder(napi_env env, napi_callback_info info) {
    size_t argc = 4;
    napi_value encoder_value, argv[argc], cb_name, cb_alpha_name;
    napi_threadsafe_function js_cb_ref, js_cb_ref_alpha;
    size_t encoder_type_length;
    struct wl_client *client;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))

    struct encoder *encoder = calloc(1, sizeof(struct encoder));
    NAPI_CALL(env,
              napi_get_value_string_latin1(env, argv[0], encoder->preferred_encoder, sizeof(encoder->preferred_encoder),
                                           &encoder_type_length))

    encoder->callback_data.opaque_sample_ready_callback = encoder_opaque_sample_ready_callback;
    encoder->callback_data.alpha_sample_ready_callback = encoder_alpha_sample_ready_callback;

    NAPI_CALL(env, napi_get_value_external(env, argv[1], (void **) &client))
    encoder->client = client;

    napi_create_string_utf8(env, "opaque_callback", NAPI_AUTO_LENGTH, &cb_name);
    NAPI_CALL(env, napi_create_threadsafe_function(
            env,
            argv[2],
            NULL,
            cb_name,
            0,
            2,
            NULL,
            NULL,
            encoder,
            encoded_frame_to_node_buffer_cb,
            &js_cb_ref))
    encoder->callback_data.js_cb_ref = js_cb_ref;

    napi_create_string_utf8(env, "alpha_callback", NAPI_AUTO_LENGTH, &cb_alpha_name);
    NAPI_CALL(env, napi_create_threadsafe_function(
            env, // env
            argv[3], // func
            NULL, // async_resource
            cb_alpha_name, // async_resource_name
            0, // max_queue_size
            2, // initial_thread_count
            NULL, // thread_finalize_data
            NULL, // thread_finalize_cb
            encoder, // context
            encoded_alpha_frame_to_node_buffer_cb, // call_js_cb
            &js_cb_ref_alpha)) // result
    encoder->callback_data.js_cb_ref_alpha = js_cb_ref_alpha;

    NAPI_CALL(env, napi_create_external(env, (void *) encoder, encoder_finalize_cb, NULL, &encoder_value))
    return encoder_value;
}

// expected arguments in order:
// - encoder - argv[0]
// - object buffer_id - argv[1]
// return:
// - object - { width: number, height: number }
static napi_value
encodeBuffer(napi_env env, napi_callback_info info) {
    size_t argc = 2;
    napi_value argv[argc], buffer_width_value, buffer_height_value, return_value;

    struct encoder *encoder;
    uint32_t buffer_id;
    uint32_t buffer_width, buffer_height;
    struct wl_resource *buffer_resource;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    NAPI_CALL(env, napi_get_value_external(env, argv[0], (void **) &encoder))
    NAPI_CALL(env, napi_get_value_uint32(env, argv[1], &buffer_id))

    buffer_resource = wl_client_get_object(encoder->client, buffer_id);

    if (encoder->impl != NULL) {
        if (!encoder->itf.supports_buffer(encoder, buffer_resource)) {
            encoder->itf.destroy(encoder);
            encoder->impl = NULL;
        }
    }

    if (encoder->impl == NULL) {
        for (int i = 0; i < encoders_count; i++) {
            if (all_encoder_itfs[i].supports_buffer(encoder, buffer_resource)) {
                encoder->itf = all_encoder_itfs[i];
                encoder->itf.create(encoder);
                assert(encoder->impl != NULL);
                break;
            }
        }
    }

    encoder->itf.encode(encoder, buffer_resource, &buffer_width, &buffer_height);

    NAPI_CALL(env, napi_create_int32(env, buffer_width, &buffer_width_value))
    NAPI_CALL(env, napi_create_int32(env, buffer_height, &buffer_height_value))
    const napi_property_descriptor properties[] = {
            {"width",  NULL, NULL, NULL, NULL, buffer_width_value,  napi_default, NULL},
            {"height", NULL, NULL, NULL, NULL, buffer_height_value, napi_default, NULL},
    };
    NAPI_CALL(env, napi_create_object(env, &return_value))
    NAPI_CALL(env, napi_define_properties(env, return_value, sizeof(properties) / sizeof(properties[0]), properties))
    return return_value;
}

static napi_value
init(napi_env env, napi_value exports) {
    napi_property_descriptor desc[] = {
            DECLARE_NAPI_METHOD("createEncoder", createEncoder),
            DECLARE_NAPI_METHOD("encodeBuffer", encodeBuffer),
    };

    NAPI_CALL(env, napi_define_properties(env, exports, sizeof(desc) / sizeof(napi_property_descriptor), desc))
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init)
