#include <stdlib.h>
#include "node_api.h"
// avoid depending on libuv
#include "uv.h"


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

struct node_cb {
    napi_env env;
    napi_ref js_cb_ref;
};

static void
handle_poll_event(struct uv_poll_s *handle, int status, int events) {
    napi_value status_value, events_value, global, js_cb, cb_result;
    struct node_cb *node_cb = handle->data;
    napi_handle_scope scope;

    NAPI_CALL(node_cb->env, napi_open_handle_scope(node_cb->env, &scope))
    NAPI_CALL(node_cb->env, napi_get_global(node_cb->env, &global))
    NAPI_CALL(node_cb->env, napi_create_int32(node_cb->env, status, &status_value))
    NAPI_CALL(node_cb->env, napi_create_int32(node_cb->env, events, &events_value))
    NAPI_CALL(node_cb->env, napi_get_reference_value(node_cb->env, node_cb->js_cb_ref, &js_cb))
    napi_value args[] = {status_value, events_value};
    NAPI_CALL(node_cb->env, napi_call_function(node_cb->env, global, js_cb, sizeof(args) / sizeof(args[0]), args, &cb_result))
    NAPI_CALL(node_cb->env, napi_close_handle_scope(node_cb->env, scope))
}

/**
 *  expected nodejs arguments in order:
 *  - number fd - argv[0]
 *  - function poll_callback - argv[1]
 * return:
 *  - object pollHandle
 * @param env
 * @param info
 * @return
 */
napi_value
start_poll(napi_env env, napi_callback_info info) {
    static size_t argc = 2;
    napi_value return_value, argv[argc];
    napi_ref js_cb_ref;
    int32_t fd;
    struct uv_loop_s *loop;
    struct uv_poll_s *poll_handle = calloc(1, sizeof(*poll_handle));
    struct node_cb *node_cb = calloc(1, sizeof(*node_cb));

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    NAPI_CALL(env, napi_get_value_int32(env, argv[0], &fd))
    NAPI_CALL(env, napi_create_external(env, (void *) poll_handle, NULL, NULL, &return_value))
    NAPI_CALL(env, napi_get_uv_event_loop(env, &loop))
    NAPI_CALL(env, napi_create_reference(env, argv[1], 1, &js_cb_ref))

    node_cb->env = env;
    node_cb->js_cb_ref = js_cb_ref;
    poll_handle->data = node_cb;

    uv_poll_init(loop, poll_handle, fd);
    uv_poll_start(poll_handle, UV_READABLE, handle_poll_event);

    return return_value;
}

void
poll_handle_close(struct uv_handle_s* handle) {
    struct node_cb *node_cb = handle->data;

    NAPI_CALL(node_cb->env, napi_delete_reference(node_cb->env, node_cb->js_cb_ref))

    free(node_cb);
    free(handle);
}

static napi_value
stop_poll(napi_env env, napi_callback_info info) {
    static size_t argc = 1;
    napi_value argv[argc], return_value;
    struct uv_poll_s *poll_handle;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    NAPI_CALL(env, napi_get_value_external(env, argv[0], (void **) &poll_handle))
    NAPI_CALL(env, napi_get_undefined(env, &return_value))

    uv_poll_stop(poll_handle);
    uv_close((struct uv_handle_s*)poll_handle, poll_handle_close);

    return return_value;
}

static napi_value
init(napi_env env, napi_value exports) {
    napi_property_descriptor desc[] = {
            DECLARE_NAPI_METHOD("startPoll", start_poll),
            DECLARE_NAPI_METHOD("stopPoll", stop_poll),
    };

    NAPI_CALL(env, napi_define_properties(env, exports, sizeof(desc) / sizeof(napi_property_descriptor), desc))
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init)