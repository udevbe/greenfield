#include <stdint.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>
#include "encoder.h"
#include "westfield.h"
#include "node_api.h"
#include "wlr_linux_dmabuf_v1.h"
#include "wlr_drm.h"

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

#ifndef NDEBUG
#define NAPI_CALL(env, the_call) \
if((the_call) != napi_ok) { \
    GET_AND_THROW_LAST_ERROR((env)); \
}
#else
#define NAPI_CALL(env, the_call) \
the_call;
#endif

struct node_frame_encoder {
    struct frame_encoder *encoder;
    struct wl_client *client;
    napi_threadsafe_function js_cb_ref;
};

napi_threadsafe_function discard_frame_buffer_js_cb_ref;

static void
discard_frame_buffer_cb_node(napi_env env, napi_value js_callback, void *context, void *data) {
    const union frame_buffer *frame_buffer = data;
    if(frame_buffer->base.type == SHM) {
        wl_shm_pool_unref(frame_buffer->shm.pool);
    }
    free((void*)frame_buffer);
}

static void
discard_frame_buffer_cb(const union frame_buffer *frame_buffer) {
    napi_call_threadsafe_function(discard_frame_buffer_js_cb_ref, (void*)frame_buffer, napi_tsfn_blocking);
}

static void
node_frame_encoder_opaque_sample_ready_callback(void *user_data, struct encoded_frame *encoded_frame) {
    struct node_frame_encoder *node_frame_encoder = user_data;
    napi_call_threadsafe_function(node_frame_encoder->js_cb_ref, encoded_frame, napi_tsfn_blocking);
}

static void
node_frame_encoder_finalize_encoded_frame(napi_env env, void *finalize_data, void *finalize_hint) {
    encoded_frame_finalize((struct encoded_frame *) finalize_hint);
}

static void
encoded_frame_to_node_buffer_cb(napi_env env, napi_value js_callback, void *context, void *data) {
    assert(env != NULL);

    napi_value buffer_value, global, cb_result;
    struct encoded_frame *encoded_frame = data;

    if (encoded_frame == NULL) {
        NAPI_CALL(env, napi_get_undefined(env, &buffer_value))
    } else {
        NAPI_CALL(env, napi_create_external_buffer(env, encoded_frame->size, encoded_frame->encoded_data,
                                                   node_frame_encoder_finalize_encoded_frame, encoded_frame,
                                                   &buffer_value))
    }

    napi_value args[] = {buffer_value};
    NAPI_CALL(env, napi_get_global(env, &global))
    NAPI_CALL(env, napi_call_function(env, global, js_callback, sizeof(args) / sizeof(args[0]), args, &cb_result))
}

/**
 *  expected nodejs arguments in order:
 *  - string encoder_type - argv[0] // 'x264' | 'nvh264'
 *  - object wl_client - argv[1]
 *  - object westfield_egl - argv[2]
 *  - function opaque_callback - argv[3]
 * return:
 *  - object encoderContext
 * @param env
 * @param info
 * @return
 */
napi_value
createFrameEncoder(napi_env env, napi_callback_info info) {
    static size_t argc = 4;
    napi_value return_value, argv[argc], cb_name;
    size_t encoder_type_length;
    struct wl_client *client;
    struct westfield_egl *westfield_egl;
    struct node_frame_encoder *node_frame_encoder;
    char preferred_encoder[16];

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    NAPI_CALL(env, napi_get_value_string_latin1(env, argv[0], preferred_encoder, sizeof(preferred_encoder),
                                                &encoder_type_length))
    NAPI_CALL(env, napi_get_value_external(env, argv[1], (void **) &client))
    NAPI_CALL(env, napi_get_value_external(env, argv[2], (void **) &westfield_egl))

    node_frame_encoder = calloc(1, sizeof(struct node_frame_encoder));
    node_frame_encoder->client = client;

    if (frame_encoder_create(preferred_encoder, node_frame_encoder_opaque_sample_ready_callback, node_frame_encoder,
                             &node_frame_encoder->encoder,
                             westfield_egl) == -1) {
        free(node_frame_encoder);
        NAPI_CALL(env, napi_throw_error((env), NULL, "Can't create frame encoder."))
        NAPI_CALL(env, napi_get_undefined(env, &return_value))
        return return_value;
    }

    napi_create_string_utf8(env, "frame_sample_callback", NAPI_AUTO_LENGTH, &cb_name);
    NAPI_CALL(env, napi_create_threadsafe_function(
            env,
            argv[3],
            NULL,
            cb_name,
            0,
            2,
            NULL,
            NULL,
            node_frame_encoder,
            encoded_frame_to_node_buffer_cb,
            &node_frame_encoder->js_cb_ref))

    NAPI_CALL(env, napi_create_external(env, (void *) node_frame_encoder, NULL, NULL, &return_value))
    return return_value;
}

/**
 *  expected nodejs arguments in order:
 *  - unknown encoder - argv[0]
 * return:
 *  - object encoderContext
 * @param env
 * @param info
 * @return
 */
static napi_value
destroyFrameEncoder(napi_env env, napi_callback_info info) {
    static size_t argc = 1;
    napi_value return_value, argv[argc];
    struct node_frame_encoder *node_frame_encoder;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    NAPI_CALL(env, napi_get_value_external(env, argv[0], (void **) &node_frame_encoder))

    // TODO close encoder first, wait for eos callback, then destroy rest of resources
    frame_encoder_destroy(&node_frame_encoder->encoder);
//
//    NAPI_CALL(env, napi_unref_threadsafe_function(env, node_encoder->js_cb_ref))
//    napi_release_threadsafe_function(node_encoder->js_cb_ref, napi_tsfn_release);
//
//    free(node_encoder);
    NAPI_CALL(env, napi_get_undefined(env, &return_value))
    return return_value;
}


// expected arguments in order:
// - encoder - argv[0]
// - number buffer_id - argv[1]
// - number buffer_content_serial - argv[2]
// - number buffer_creation_serial - argv[3]
// return:
// - undefined
static napi_value
encodeFrame(napi_env env, napi_callback_info info) {
    static size_t argc = 4;
    napi_value argv[argc], return_value;

    struct node_frame_encoder *node_frame_encoder;
    uint32_t buffer_id, buffer_content_serial, buffer_creation_serial;

    struct wl_resource *buffer_resource;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    NAPI_CALL(env, napi_get_value_external(env, argv[0], (void **) &node_frame_encoder))
    NAPI_CALL(env, napi_get_value_uint32(env, argv[1], &buffer_id))
    NAPI_CALL(env, napi_get_value_uint32(env, argv[2], &buffer_content_serial))
    NAPI_CALL(env, napi_get_value_uint32(env, argv[3], &buffer_creation_serial))

    buffer_resource = wl_client_get_object(node_frame_encoder->client, buffer_id);
    union frame_buffer *frame_buffer = calloc(1, sizeof(*frame_buffer));
    frame_buffer->base.buffer_id = wl_resource_get_id(buffer_resource);
    frame_buffer->base.discard_cb = discard_frame_buffer_cb;

    if (wlr_dmabuf_v1_resource_is_buffer(buffer_resource)) {
        struct wlr_dmabuf_v1_buffer *dmabuf_v1_buffer = wlr_dmabuf_v1_buffer_from_buffer_resource(buffer_resource);
        frame_buffer->base.type = DMA;
        frame_buffer->dma.width = dmabuf_v1_buffer->base.width;
        frame_buffer->dma.height = dmabuf_v1_buffer->base.height;
        frame_buffer->dma.attributes = &dmabuf_v1_buffer->attributes;
    } else if(wlr_drm_buffer_is_resource(buffer_resource)) {
        struct wlr_drm_buffer *westfield_drm_buffer = wlr_drm_buffer_from_resource(buffer_resource);
        frame_buffer->base.type = DMA;
        frame_buffer->dma.width = westfield_drm_buffer->base.width;
        frame_buffer->dma.height = westfield_drm_buffer->base.height;
        frame_buffer->dma.attributes = &westfield_drm_buffer->dmabuf;
    } else if(wl_shm_buffer_get(buffer_resource) != NULL) {
        struct wl_shm_buffer *shm_buffer = wl_shm_buffer_get(buffer_resource);
        frame_buffer->base.type = SHM;
        frame_buffer->shm.width = wl_shm_buffer_get_width(shm_buffer);
        frame_buffer->shm.height = wl_shm_buffer_get_height(shm_buffer);

        frame_buffer->shm.buffer_format = wl_shm_buffer_get_format(shm_buffer);
        frame_buffer->shm.buffer_data = wl_shm_buffer_get_data(shm_buffer);
        frame_buffer->shm.buffer_stride = wl_shm_buffer_get_stride(shm_buffer);
        frame_buffer->shm.pool = wl_shm_buffer_ref_pool(shm_buffer);
    }

    if (frame_encoder_encode(&node_frame_encoder->encoder, frame_buffer, buffer_content_serial, buffer_creation_serial) == -1) {
        NAPI_CALL(env, napi_throw_error((env), NULL, "Can't encode frame buffer."))
        NAPI_CALL(env, napi_get_undefined(env, &return_value))
        return return_value;
    }

    NAPI_CALL(env, napi_get_undefined(env, &return_value))
    return return_value;
}

// expected arguments in order:
// - encoder - argv[0]
// return:
// - undefined
static napi_value
requestKeyUnit(napi_env env, napi_callback_info info) {
    static size_t argc = 1;
    napi_value argv[argc], return_value;
    struct node_frame_encoder *node_frame_encoder;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    NAPI_CALL(env, napi_get_value_external(env, argv[0], (void **) &node_frame_encoder))

    frame_encoder_request_key_unit(&node_frame_encoder->encoder);

    NAPI_CALL(env, napi_get_undefined(env, &return_value))
    return return_value;
}

static napi_value
init(napi_env env, napi_value exports) {
    napi_value discard_frame_buffer_cb_name;
    napi_create_string_utf8(env, "discard_frame_buffer_callback", NAPI_AUTO_LENGTH, &discard_frame_buffer_cb_name);
    NAPI_CALL(env, napi_create_threadsafe_function(
            env,
            NULL,
            NULL,
            discard_frame_buffer_cb_name,
            0,
            2,
            NULL,
            NULL,
            NULL,
            discard_frame_buffer_cb_node,
            &discard_frame_buffer_js_cb_ref))

    napi_property_descriptor desc[] = {
            DECLARE_NAPI_METHOD("createFrameEncoder", createFrameEncoder),
            DECLARE_NAPI_METHOD("destroyFrameEncoder", destroyFrameEncoder),
            DECLARE_NAPI_METHOD("encodeFrame", encodeFrame),
            DECLARE_NAPI_METHOD("requestKeyUnit", requestKeyUnit),
    };

    NAPI_CALL(env, napi_define_properties(env, exports, sizeof(desc) / sizeof(napi_property_descriptor), desc))
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init)
