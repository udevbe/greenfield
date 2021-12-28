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

struct node_encoder {
	struct encoder* encoder;
	struct wl_client* client;
	napi_threadsafe_function js_cb_ref;
};

static void encoder_finalize_cb(napi_env env, void *finalize_data, void *finalize_hint) {
    struct node_encoder *node_encoder = finalize_data;
	encoder_free(&node_encoder->encoder);

    NAPI_CALL(env, napi_unref_threadsafe_function(env, node_encoder->js_cb_ref))
    napi_release_threadsafe_function(node_encoder->js_cb_ref, napi_tsfn_release);
}

static void
encoder_opaque_sample_ready_callback(void *user_data, struct encoded_frame *encoded_frame) {
	struct node_encoder *node_encoder = user_data;
    napi_call_threadsafe_function(node_encoder->js_cb_ref, encoded_frame, napi_tsfn_blocking);
}

static void
node_encoder_finalize_encoded_frame(napi_env env, void *finalize_data, void *finalize_hint) {
	encoded_frame_finalize((struct encoded_frame *)finalize_hint);
}

static void
encoded_frame_to_node_buffer_cb(napi_env env, napi_value js_callback, void *context, void *data) {
	assert(env != NULL);

	napi_value buffer_value, global, cb_result;
	struct encoded_frame *encoded_frame = data;

    NAPI_CALL(env, napi_create_external_buffer(env, encoded_frame->size, encoded_frame->encoded_data, node_encoder_finalize_encoded_frame, encoded_frame, &buffer_value))

    napi_value args[] = {buffer_value };
    NAPI_CALL(env, napi_get_global(env, &global))
    NAPI_CALL(env, napi_call_function(env, global, js_callback, sizeof(args) / sizeof(args[0]), args, &cb_result))
}

/**
 *  expected nodejs arguments in order:
 *  - string encoder_type - argv[0] // 'x264' | 'nvh264'
 *  - object wl_client - argv[1]
 *  - function opaque_callback - argv[2]
 * return:
 *  - object encoderContext
 * @param env
 * @param info
 * @return
 */
static napi_value
createEncoder(napi_env env, napi_callback_info info) {
    size_t argc = 3;
    napi_value return_value, argv[argc], cb_name;
    napi_threadsafe_function js_cb_ref;
    size_t encoder_type_length;
    struct wl_client *client;
	struct node_encoder* node_encoder;
	char preferred_encoder[16];

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
	NAPI_CALL(env, napi_get_value_string_latin1(env, argv[0], preferred_encoder, sizeof(preferred_encoder), &encoder_type_length))
	NAPI_CALL(env, napi_get_value_external(env, argv[1], (void **) &client))

	node_encoder = calloc(1, sizeof(struct node_encoder));
	if(encoder_create(preferred_encoder, encoder_opaque_sample_ready_callback, node_encoder, &node_encoder->encoder) == -1) {
		free(node_encoder);
		NAPI_CALL(env,napi_throw_error((env), NULL, "Can't create encoder."))
		NAPI_CALL(env,napi_get_undefined(env, &return_value))
		return return_value;
	};
	node_encoder->client = client;

	napi_create_string_utf8(env, "sample_callback", NAPI_AUTO_LENGTH, &cb_name);
	NAPI_CALL(env, napi_create_threadsafe_function(
			env,
			argv[2],
			NULL,
			cb_name,
			0,
			2,
			NULL,
			NULL,
			node_encoder,
			encoded_frame_to_node_buffer_cb,
			&js_cb_ref))
	node_encoder->js_cb_ref = js_cb_ref;

    NAPI_CALL(env, napi_create_external(env, (void *) node_encoder, encoder_finalize_cb, NULL, &return_value))
    return return_value;
}

// expected arguments in order:
// - encoder - argv[0]
// - object buffer_id - argv[1]
// - serial - argv[2]
// return:
// - object - { width: number, height: number }
static napi_value
encodeBuffer(napi_env env, napi_callback_info info) {
    size_t argc = 3;
    napi_value argv[argc], buffer_width_value, buffer_height_value, return_value;

    struct node_encoder *node_encoder;
    uint32_t buffer_id, buffer_width, buffer_height, serial;
    struct wl_resource *buffer_resource;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    NAPI_CALL(env, napi_get_value_external(env, argv[0], (void **) &node_encoder))
    NAPI_CALL(env, napi_get_value_uint32(env, argv[1], &buffer_id))
    NAPI_CALL(env, napi_get_value_uint32(env, argv[2], &serial))

    buffer_resource = wl_client_get_object(node_encoder->client, buffer_id);

    if(encoder_encode(&node_encoder->encoder, buffer_resource, serial) == -1) {
        NAPI_CALL(env,napi_throw_error((env), NULL, "Can't encode buffer."))
        NAPI_CALL(env,napi_get_undefined(env, &return_value))
        return return_value;
    }

    NAPI_CALL(env, napi_create_int32(env, buffer_width, &buffer_width_value))
    NAPI_CALL(env, napi_create_int32(env, buffer_height, &buffer_height_value))
	NAPI_CALL(env,napi_get_undefined(env, &return_value))
    return return_value;
}

// expected arguments in order:
// - encoder - argv[0]
// return:
// - undefined
static napi_value
requestKeyUnit(napi_env env, napi_callback_info info) {
	size_t argc = 1;
	napi_value argv[argc], return_value;
	struct node_encoder *node_encoder;

	NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
	NAPI_CALL(env, napi_get_value_external(env, argv[0], (void **) &node_encoder))

	encoder_request_key_unit(&node_encoder->encoder);

	NAPI_CALL(env,napi_get_undefined(env, &return_value))
	return return_value;
}

static napi_value
init(napi_env env, napi_value exports) {
    napi_property_descriptor desc[] = {
            DECLARE_NAPI_METHOD("createEncoder", createEncoder),
            DECLARE_NAPI_METHOD("encodeBuffer", encodeBuffer),
			DECLARE_NAPI_METHOD("requestKeyUnit", requestKeyUnit),
    };

    NAPI_CALL(env, napi_define_properties(env, exports, sizeof(desc) / sizeof(napi_property_descriptor), desc))
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init)
