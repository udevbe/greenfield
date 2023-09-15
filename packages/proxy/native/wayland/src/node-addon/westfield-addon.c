#include "node_api.h"
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/mman.h>
#include "westfield-wayland-server-extra.h"
#include "westfield.h"
#include "wlr_drm.h"
#include "wlr_linux_dmabuf_v1.h"

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

struct display_destruction_listener {
    struct wl_listener listener;
    napi_env env;
    napi_ref client_creation_cb_ref;
    napi_ref global_created_cb_ref;
    napi_ref global_destroyed_cb_ref;
};

struct client_destruction_listener {
    struct wl_listener listener;
    napi_ref js_object;
    napi_ref destroy_cb_ref;
    napi_ref wire_message_cb_ref;
    napi_ref wire_message_end_cb_ref;
    napi_ref registry_created_cb_ref;
    napi_ref buffer_created_cb_ref;
    napi_ref sync_done_cb_ref;
};

struct weston_xwayland_callbacks {
    napi_env env;
    napi_ref xwwayland_destroyed_cb_ref;
    napi_ref xwayland_starting_cb_ref;
};

static void
finalize_cb(napi_env env, void *finalize_data, void *finalize_hint) {
    free(finalize_data);
}

static void
on_display_destroyed(struct wl_listener *listener, void *data) {
    struct display_destruction_listener *display_destruction_listener = (struct display_destruction_listener *) listener;
    napi_env env = display_destruction_listener->env;

    NAPI_CALL(env, napi_delete_reference(env, display_destruction_listener->client_creation_cb_ref))
    NAPI_CALL(env, napi_delete_reference(env, display_destruction_listener->global_created_cb_ref))
    NAPI_CALL(env, napi_delete_reference(env, display_destruction_listener->global_destroyed_cb_ref))
}

static void
on_client_destroyed(struct wl_listener *listener, void *data) {
    struct client_destruction_listener *destruction_listener = (struct client_destruction_listener *) listener;
    if (destruction_listener->destroy_cb_ref) {
        struct wl_client *client = data;
        struct display_destruction_listener *display_destruction_listener;
        napi_value global, client_value, cb_result, cb;
        napi_env env;


        display_destruction_listener = (struct display_destruction_listener *) wl_display_get_destroy_listener(
                wl_client_get_display(client), on_display_destroyed);
        env = display_destruction_listener->env;

        NAPI_CALL(env, napi_get_reference_value(env, destruction_listener->js_object, &client_value))
        napi_value argv[1] = {client_value};

        NAPI_CALL(env, napi_get_reference_value(env, destruction_listener->destroy_cb_ref, &cb))
        NAPI_CALL(env, napi_get_global(env, &global))
        NAPI_CALL(env, napi_call_function(env, global, cb, 1, argv, &cb_result))

        napi_delete_reference(env, destruction_listener->js_object);
        if (destruction_listener->destroy_cb_ref) {
            NAPI_CALL(env, napi_delete_reference(env, destruction_listener->destroy_cb_ref))
        }
        if (destruction_listener->wire_message_cb_ref) {
            NAPI_CALL(env, napi_delete_reference(env, destruction_listener->wire_message_cb_ref))
        }
        if (destruction_listener->wire_message_end_cb_ref) {
            NAPI_CALL(env, napi_delete_reference(env, destruction_listener->wire_message_end_cb_ref))
        }
        if (destruction_listener->registry_created_cb_ref) {
            NAPI_CALL(env, napi_delete_reference(env, destruction_listener->registry_created_cb_ref))
        }
        if (destruction_listener->sync_done_cb_ref) {
            NAPI_CALL(env, napi_delete_reference(env, destruction_listener->sync_done_cb_ref))
        }
        if (destruction_listener->buffer_created_cb_ref) {
            NAPI_CALL(env, napi_delete_reference(env, destruction_listener->buffer_created_cb_ref))
        }
    }
}

static int
on_wire_message(struct wl_client *client, int32_t *wire_message,
                size_t wire_message_size, int object_id, int opcode) {
    struct client_destruction_listener *destruction_listener = (struct client_destruction_listener *) wl_client_get_destroy_listener(
            client, on_client_destroyed);
    if (destruction_listener->wire_message_cb_ref) {
        struct display_destruction_listener *display_destruction_listener;
        uint32_t cb_result_consumed;
        napi_value wire_message_value, client_value, object_id_value, opcode_value, global, cb_result, cb;
        napi_env env;

        display_destruction_listener = (struct display_destruction_listener *) wl_display_get_destroy_listener(
                wl_client_get_display(client), on_display_destroyed);
        env = display_destruction_listener->env;

        NAPI_CALL(env, napi_create_external_arraybuffer(env, wire_message, wire_message_size, finalize_cb, NULL,
                                                        &wire_message_value))
        NAPI_CALL(env, napi_create_uint32(env, (uint32_t) object_id, &object_id_value))
        NAPI_CALL(env, napi_create_uint32(env, (uint32_t) opcode, &opcode_value))
        NAPI_CALL(env, napi_get_global(env, &global))
        NAPI_CALL(env, napi_get_reference_value(env, destruction_listener->js_object, &client_value))
        napi_value argv[4] = {client_value, wire_message_value, object_id_value, opcode_value};

        NAPI_CALL(env, napi_get_reference_value(env, destruction_listener->wire_message_cb_ref, &cb))
        NAPI_CALL(env, napi_call_function(env, global, cb, 4, argv, &cb_result))
        NAPI_CALL(env, napi_get_value_uint32(env, cb_result, &cb_result_consumed))
        return cb_result_consumed;
    } else {
        return 0;
    }
}

static void
on_wire_message_end(struct wl_client *client) {
    int *fds_in;
    size_t fds_in_size;
    struct wl_connection *connection;
    struct client_destruction_listener *destruction_listener = (struct client_destruction_listener *) wl_client_get_destroy_listener(
            client, on_client_destroyed);
    if (destruction_listener->wire_message_end_cb_ref) {
        connection = wl_client_get_connection(client);
        fds_in_size = wl_connection_fds_in_size(connection);
        fds_in = malloc(fds_in_size);
        if (fds_in_size) {
            wl_connection_copy_fds_in(connection, fds_in, fds_in_size);
        }

        struct display_destruction_listener *display_destruction_listener;
        napi_value client_value, fds_value = NULL, global, cb_result, cb;
        napi_env env;

        display_destruction_listener = (struct display_destruction_listener *) wl_display_get_destroy_listener(
                wl_client_get_display(client), on_display_destroyed);
        env = display_destruction_listener->env;

        if (fds_in_size) {
            NAPI_CALL(env,
                      napi_create_external_arraybuffer(env, fds_in, fds_in_size, finalize_cb,
                                                       NULL,
                                                       &fds_value))
        } else {
            NAPI_CALL(env, napi_get_null(env, &fds_value))
        }

        NAPI_CALL(env, napi_get_global(env, &global))
        NAPI_CALL(env, napi_get_reference_value(env, destruction_listener->js_object, &client_value))
        napi_value argv[2] = {client_value, fds_value};

        NAPI_CALL(env, napi_get_reference_value(env, destruction_listener->wire_message_end_cb_ref, &cb))
        NAPI_CALL(env, napi_call_function(env, global, cb, 2, argv, &cb_result))
    }
}

static void
on_registry_created(struct wl_client *client, struct wl_resource *registry, uint32_t registry_id) {
    struct client_destruction_listener *destruction_listener = (struct client_destruction_listener *) wl_client_get_destroy_listener(
            client,
            on_client_destroyed);

    if (destruction_listener->registry_created_cb_ref) {
        struct display_destruction_listener *display_destruction_listener = (struct display_destruction_listener *) wl_display_get_destroy_listener(
                wl_client_get_display(client), on_display_destroyed);
        napi_env env = display_destruction_listener->env;
        napi_value cb, registry_value, registry_id_value, global, cb_result;

        NAPI_CALL(env, napi_create_external(env, registry, NULL, NULL, &registry_value))
        NAPI_CALL(env, napi_create_uint32(env, registry_id, &registry_id_value))
        napi_value argv[2] = {registry_value, registry_id_value};

        NAPI_CALL(env, napi_get_reference_value(env, destruction_listener->registry_created_cb_ref, &cb))
        NAPI_CALL(env, napi_get_global(env, &global))
        NAPI_CALL(env, napi_call_function(env, global, cb, 2, argv, &cb_result))
    }
}

static void
on_sync_done(struct wl_client *client, uint32_t callback_id) {
    struct client_destruction_listener *destruction_listener = (struct client_destruction_listener *) wl_client_get_destroy_listener(
            client,
            on_client_destroyed);

    if (destruction_listener->sync_done_cb_ref) {
        struct display_destruction_listener *display_destruction_listener = (struct display_destruction_listener *) wl_display_get_destroy_listener(
                wl_client_get_display(client), on_display_destroyed);
        napi_env env = display_destruction_listener->env;
        napi_value cb, callback_id_value, global, cb_result;

        NAPI_CALL(env, napi_create_uint32(env, callback_id, &callback_id_value))
        napi_value argv[1] = {callback_id_value};

        NAPI_CALL(env, napi_get_reference_value(env, destruction_listener->sync_done_cb_ref, &cb))
        NAPI_CALL(env, napi_get_global(env, &global))
        NAPI_CALL(env, napi_call_function(env, global, cb, 1, argv, &cb_result))
    }
}

static void
on_resource_created(struct wl_listener *listener, void *data) {
    struct wl_resource *resource = data;
    struct wl_client *client = wl_resource_get_client(resource);
    struct client_destruction_listener *client_destruction_listener
            = (struct client_destruction_listener *) wl_client_get_destroy_listener(client, on_client_destroyed);
    struct display_destruction_listener *display_destruction_listener
            = (struct display_destruction_listener *) wl_display_get_destroy_listener(wl_client_get_display(client),
                                                                                      on_display_destroyed);

    const char *itf_name = wl_resource_get_class(resource);
    if (strcmp(itf_name, "wl_buffer") == 0 && client_destruction_listener->buffer_created_cb_ref) {
        napi_env env = display_destruction_listener->env;
        napi_value cb, global, cb_result, resource_id_value;

        NAPI_CALL(env, napi_get_reference_value(env, client_destruction_listener->buffer_created_cb_ref, &cb))
        NAPI_CALL(env, napi_get_global(env, &global))
        NAPI_CALL(env, napi_create_uint32(env, wl_resource_get_id(resource), &resource_id_value))

        napi_value argv[] = {resource_id_value};
        NAPI_CALL(env, napi_call_function(env, global, cb, 1, argv, &cb_result))
    }
}

static void
on_client_created(struct wl_listener *listener, void *data) {
    struct wl_client *client = data;
    struct display_destruction_listener *display_destruction_listener;
    napi_value client_value, global, cb_result, cb;
    napi_ref client_ref;
    napi_env env;

    display_destruction_listener = (struct display_destruction_listener *) wl_display_get_destroy_listener(
            wl_client_get_display(client), on_display_destroyed);
    env = display_destruction_listener->env;

    struct client_destruction_listener *destruction_listener = malloc(sizeof(struct client_destruction_listener));
    destruction_listener->listener.notify = on_client_destroyed;
    destruction_listener->wire_message_cb_ref = NULL;
    destruction_listener->wire_message_end_cb_ref = NULL;
    destruction_listener->registry_created_cb_ref = NULL;
    destruction_listener->destroy_cb_ref = NULL;
    destruction_listener->buffer_created_cb_ref = NULL;

    wl_client_add_destroy_listener(client, &destruction_listener->listener);
    wl_client_set_wire_message_cb(client, on_wire_message);
    wl_client_set_wire_message_end_cb(client, on_wire_message_end);
    wl_client_set_registry_created_cb(client, on_registry_created);
    wl_client_set_sync_done_cb(client, on_sync_done);

    struct wl_listener *resource_listener = malloc(sizeof(struct wl_listener));
    resource_listener->notify = on_resource_created;
    wl_client_add_resource_created_listener(client, resource_listener);

    NAPI_CALL(env, napi_create_external(env, client, NULL, NULL, &client_value))
    NAPI_CALL(env, napi_create_reference(env, client_value, 1, &client_ref))
    destruction_listener->js_object = client_ref;

    NAPI_CALL(env, napi_get_global(env, &global))
    napi_value argv[1] = {client_value};
    NAPI_CALL(env, napi_get_reference_value(env, display_destruction_listener->client_creation_cb_ref, &cb))
    NAPI_CALL(env, napi_call_function(env, global, cb, 1, argv, &cb_result))
}

// expected arguments in order:
// - Object client
// - onWireMessage(Object client, ArrayBuffer wireMessage, ArrayBuffer fdsIn):void
// return:
// - void
napi_value
setClientDestroyedCallback(napi_env env, napi_callback_info info) {
    size_t argc = 2;
    napi_value argv[argc], client_value, js_cb, return_value;
    napi_ref js_cb_ref;
    struct wl_client *client;
    struct client_destruction_listener *destruction_listener;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))

    client_value = argv[0];
    NAPI_CALL(env, napi_get_value_external(env, client_value, (void **) &client))

    js_cb = argv[1];
    NAPI_CALL(env, napi_create_reference(env, js_cb, 1, &js_cb_ref))

    destruction_listener = (struct client_destruction_listener *) wl_client_get_destroy_listener(client,
                                                                                                 on_client_destroyed);
    destruction_listener->destroy_cb_ref = js_cb_ref;

    NAPI_CALL(env, napi_get_undefined(env, &return_value))
    return return_value;
}


// expected arguments in order:
// - Object client
// - onWireMessage(Object client, ArrayBuffer wireMessage, number objectId, number opcode):void
// return:
// - void
napi_value
setWireMessageCallback(napi_env env, napi_callback_info info) {
    size_t argc = 2;
    napi_value argv[argc], client_value, js_cb, return_value;
    napi_ref js_cb_ref;
    struct wl_client *client;
    struct client_destruction_listener *destruction_listener;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))

    client_value = argv[0];
    NAPI_CALL(env, napi_get_value_external(env, client_value, (void **) &client))

    js_cb = argv[1];
    NAPI_CALL(env, napi_create_reference(env, js_cb, 1, &js_cb_ref))

    destruction_listener = (struct client_destruction_listener *) wl_client_get_destroy_listener(client,
                                                                                                 on_client_destroyed);
    destruction_listener->wire_message_cb_ref = js_cb_ref;

    NAPI_CALL(env, napi_get_undefined(env, &return_value))
    return return_value;
}

// expected arguments in order:
// - Object client
// - onWireMessage(Object client, ArrayBuffer fdsIn):void
// return:
// - void
napi_value
setWireMessageEndCallback(napi_env env, napi_callback_info info) {
    size_t argc = 2;
    napi_value argv[argc], client_value, js_cb, return_value;
    napi_ref js_cb_ref;
    struct wl_client *client;
    struct client_destruction_listener *destruction_listener;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))

    client_value = argv[0];
    NAPI_CALL(env, napi_get_value_external(env, client_value, (void **) &client))

    js_cb = argv[1];
    NAPI_CALL(env, napi_create_reference(env, js_cb, 1, &js_cb_ref))

    destruction_listener = (struct client_destruction_listener *) wl_client_get_destroy_listener(client,
                                                                                                 on_client_destroyed);
    destruction_listener->wire_message_end_cb_ref = js_cb_ref;

    NAPI_CALL(env, napi_get_undefined(env, &return_value))
    return return_value;
}


static void
on_global_created(struct wl_display *display, uint32_t global_name) {
    struct display_destruction_listener *display_destruction_listener = (struct display_destruction_listener *) wl_display_get_destroy_listener(
            display, on_display_destroyed);
    napi_value cb, global, global_name_value, cb_result;
    napi_env env = display_destruction_listener->env;

    NAPI_CALL(env, napi_get_reference_value(env, display_destruction_listener->global_created_cb_ref, &cb))
    NAPI_CALL(env, napi_get_global(env, &global))
    NAPI_CALL(env, napi_create_uint32(env, global_name, &global_name_value))
    napi_value argv[1] = {global_name_value};
    NAPI_CALL(env, napi_call_function(env, global, cb, 1, argv, &cb_result))
}

static void
on_global_destroyed(struct wl_display *display, uint32_t global_name) {
    struct display_destruction_listener *display_destruction_listener = (struct display_destruction_listener *) wl_display_get_destroy_listener(
            display, on_display_destroyed);
    if (display_destruction_listener == NULL) {
        // If the destruction listener is NULL then the whole display is being destroyed. Not much we can do here.
        return;
    }

    napi_value cb, global, global_name_value, cb_result;
    napi_env env = display_destruction_listener->env;

    NAPI_CALL(env, napi_get_reference_value(env, display_destruction_listener->global_destroyed_cb_ref, &cb))
    NAPI_CALL(env, napi_get_global(env, &global))
    NAPI_CALL(env, napi_create_uint32(env, global_name, &global_name_value))
    napi_value argv[1] = {global_name_value};
    NAPI_CALL(env, napi_call_function(env, global, cb, 1, argv, &cb_result))
}

// expected arguments in order:
// - onClientCreated(Object client):void
// - onGlobalCreated(number name):void
// - onGlobalDestroyed(number name):void
// return:
// - Object display
napi_value
createDisplay(napi_env env, napi_callback_info info) {
    size_t argc = 3;
    napi_value argv[argc], display_value;
    struct wl_listener *client_creation_listener;
    struct display_destruction_listener *display_destruction_listener;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))

    client_creation_listener = malloc(sizeof(struct wl_listener));
    client_creation_listener->notify = on_client_created;

    display_destruction_listener = malloc(sizeof(struct display_destruction_listener));
    display_destruction_listener->listener.notify = on_display_destroyed;
    display_destruction_listener->env = env;

    NAPI_CALL(env, napi_create_reference(env, argv[0], 1, &display_destruction_listener->client_creation_cb_ref))
    NAPI_CALL(env, napi_create_reference(env, argv[1], 1, &display_destruction_listener->global_created_cb_ref))
    NAPI_CALL(env, napi_create_reference(env, argv[2], 1, &display_destruction_listener->global_destroyed_cb_ref))

    struct wl_display *display = wl_display_create();
    wl_display_add_destroy_listener(display, &display_destruction_listener->listener);
    wl_display_add_client_created_listener(display, client_creation_listener);
    wl_display_set_global_created_cb(display, on_global_created);
    wl_display_set_global_destroyed_cb(display, on_global_destroyed);

    NAPI_CALL(env, napi_create_external(env, display, NULL, NULL, &display_value))
    return display_value;
}

// expected arguments in order:
// - Object display
// return:
// - string
napi_value
addSocketAuto(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value argv[argc], display_value, display_name_value;
    struct wl_display *display;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))

    display_value = argv[0];
    napi_get_value_external(env, display_value, (void **) &display);
    struct display_destruction_listener *display_destruction_listener = (struct display_destruction_listener *) wl_display_get_destroy_listener(
            display, on_display_destroyed);
    display_destruction_listener->env = env;

    const char *display_name = wl_display_add_socket_auto(display);
    NAPI_CALL(env, napi_create_string_latin1(env, display_name, NAPI_AUTO_LENGTH, &display_name_value))

    return display_name_value;
}

// expected arguments in order:
// - Object display
// return:
// - void
napi_value
destroyDisplay(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value argv[argc], display_value, return_value;
    struct wl_display *display;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))

    display_value = argv[0];
    NAPI_CALL(env, napi_get_value_external(env, display_value, (void **) &display))

    struct display_destruction_listener *display_destruction_listener = (struct display_destruction_listener *) wl_display_get_destroy_listener(
            display, on_display_destroyed);
    display_destruction_listener->env = env;
    wl_display_terminate(display);
    wl_display_destroy_clients(display);
    wl_display_destroy(display);

    NAPI_CALL(env, napi_get_undefined(env, &return_value))
    return return_value;
}

// expected arguments in order:
// - Object client
// return:
// - void
napi_value
destroyClient(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value argv[argc], client_value, return_value;
    struct wl_client *client;
    struct wl_display *display;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))

    client_value = argv[0];
    napi_get_value_external(env, client_value, (void **) &client);

    display = wl_client_get_display(client);
    struct display_destruction_listener *display_destruction_listener = (struct display_destruction_listener *) wl_display_get_destroy_listener(
            display, on_display_destroyed);
    display_destruction_listener->env = env;
    wl_client_destroy(client);

    NAPI_CALL(env, napi_get_undefined(env, &return_value))
    return return_value;
}

// expected arguments in order:
// - Object client
// - ArrayBuffer messages
// - ArrayBuffer fds
// return:
// - void
napi_value
sendEvents(napi_env env, napi_callback_info info) {
    size_t argc = 3;
    napi_value argv[argc], client_value, messages_value, fds_value, return_value;
    struct wl_client *client;
    struct wl_connection *connection;
    void *messages;
    int *fds;
    size_t messages_length, fds_length;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    client_value = argv[0];
    messages_value = argv[1];
    fds_value = argv[2];

    NAPI_CALL(env, napi_get_value_external(env, client_value, (void **) &client))
    NAPI_CALL(env, napi_get_typedarray_info(env, messages_value, NULL, &messages_length, &messages, NULL, NULL))
    NAPI_CALL(env, napi_get_typedarray_info(env, fds_value, NULL, &fds_length, (void **) &fds, NULL, NULL))

    connection = wl_client_get_connection(client);
    for (int i = 0; i < fds_length; ++i) {
        wl_connection_put_fd(connection, fds[i]);
    }
    wl_connection_write(connection, messages, messages_length * 4);

    NAPI_CALL(env, napi_get_undefined(env, &return_value))
    return return_value;
}

// expected arguments in order:
// - Object display
// return:
// - void
napi_value
dispatchRequests(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value argv[argc], display_value, return_value;
    struct wl_display *display;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))

    display_value = argv[0];
    napi_get_value_external(env, display_value, (void **) &display);

    struct display_destruction_listener *display_destruction_listener = (struct display_destruction_listener *) wl_display_get_destroy_listener(
            display, on_display_destroyed);
    display_destruction_listener->env = env;
    wl_display_flush_clients(display);
    wl_event_loop_dispatch(wl_display_get_event_loop(display), 0);
    wl_display_flush_clients(display);

    NAPI_CALL(env, napi_get_undefined(env, &return_value))
    return return_value;
}

// expected arguments in order:
// - Object client
// return:
// - void
napi_value
flush(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value argv[argc], client_value, return_value;
    struct wl_client *client;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))

    client_value = argv[0];
    NAPI_CALL(env, napi_get_value_external(env, client_value, (void **) &client))
    wl_connection_flush(wl_client_get_connection(client));

    NAPI_CALL(env, napi_get_undefined(env, &return_value))
    return return_value;
}

// expected arguments in order:
// - Object display
// return:
// - number
napi_value
getFd(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value argv[argc], display_value, fd_value;
    struct wl_display *display;
    int fd;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    display_value = argv[0];
    NAPI_CALL(env, napi_get_value_external(env, display_value, (void **) &display))

    fd = wl_event_loop_get_fd(wl_display_get_event_loop(display));
    NAPI_CALL(env, napi_create_int32(env, fd, &fd_value))
    return fd_value;
}

// expected arguments in order:
// - number size
// return:
// - number
napi_value
createMemoryMappedFile(napi_env env, napi_callback_info info) {
    void *contents;
    size_t argc = 1, size;
    napi_value argv[argc], buffer_value, fd_value;
    int fd;
    ssize_t written;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    buffer_value = argv[0];
    NAPI_CALL(env, napi_get_buffer_info(env, buffer_value, &contents, &size))

    fd = westfield_os_create_anonymous_file(size);
    mmap(NULL, size, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);

    while (size > 0) {
        // FIXME error handling
        written = write(fd, contents, size);
        if (written <= 0)
            break;

        contents += written;
        size -= written;
    }

    NAPI_CALL(env, napi_create_int32(env, fd, &fd_value))
    return fd_value;
}

// expected arguments in order:
// - Object display
// return:
// - void
napi_value
initShm(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value argv[argc], display_value, return_value;
    struct wl_display *display;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    display_value = argv[0];
    NAPI_CALL(env, napi_get_value_external(env, display_value, (void **) &display))

    struct display_destruction_listener *display_destruction_listener = (struct display_destruction_listener *) wl_display_get_destroy_listener(
            display, on_display_destroyed);
    display_destruction_listener->env = env;
    wl_display_init_shm(display);

    // FIXME don't hardcode shm formats here
    wl_display_add_shm_format(display, WL_SHM_FORMAT_YUV420);
    wl_display_add_shm_format(display, WL_SHM_FORMAT_NV12);
    wl_display_add_shm_format(display, WL_SHM_FORMAT_YUV444);
    wl_display_add_shm_format(display, WL_SHM_FORMAT_NV21);

    NAPI_CALL(env, napi_get_undefined(env, &return_value))
    return return_value;
}

static void
finalize_westfield_drm(napi_env env,
                       void *finalize_data,
                       void *finalize_hint) {
    westfield_egl_finalize(finalize_data);
}

// expected arguments in order:
// - Object display
// - string device_path
// return:
// - unknown westfield_drm object
napi_value
initDrm(napi_env env, napi_callback_info info) {
    size_t argc = 2;
    napi_value argv[argc], display_value, device_path_value, return_value;
    struct wl_display *display;
    struct westfield_egl *westfield_egl = NULL;
    char device_path[128] = {0};
    size_t device_path_length;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    display_value = argv[0];
    device_path_value = argv[1];
    NAPI_CALL(env, napi_get_value_external(env, display_value, (void **) &display))
    NAPI_CALL(env,
              napi_get_value_string_utf8(env, device_path_value, device_path, sizeof(device_path), &device_path_length))

    struct display_destruction_listener *display_destruction_listener = (struct display_destruction_listener *) wl_display_get_destroy_listener(
            display, on_display_destroyed);
    display_destruction_listener->env = env;

    // init egl backend
    westfield_egl = westfield_egl_new(device_path);
    // init wayland egl related buffer protocols
    if (westfield_egl) {
        // TODO do something with the global objects?
        wlr_linux_dmabuf_v1_create_with_renderer(display, 4, westfield_egl);
        wlr_drm_create(display, westfield_egl);
    } else {
        fprintf(stderr, "Can't initialize EGL, wl_dmabuf and wl_drm disabled.");
    }

    NAPI_CALL(env, napi_create_external(env, westfield_egl, finalize_westfield_drm, NULL, &return_value))

    return return_value;
}

// expected arguments in order:
// - Object client
// - onSyncDone(Object client, number callbackId):void
// return:
// - void
napi_value
setSyncDoneCallback(napi_env env, napi_callback_info info) {
    size_t argc = 2;
    napi_value argv[argc], client_value, js_cb, return_value;
    napi_ref js_cb_ref;

    struct wl_client *client;
    struct client_destruction_listener *destruction_listener;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    client_value = argv[0];
    js_cb = argv[1];

    NAPI_CALL(env, napi_get_value_external(env, client_value, (void **) &client))
    NAPI_CALL(env, napi_create_reference(env, js_cb, 1, &js_cb_ref))

    destruction_listener = (struct client_destruction_listener *) wl_client_get_destroy_listener(client,
                                                                                                 on_client_destroyed);
    destruction_listener->sync_done_cb_ref = js_cb_ref;

    NAPI_CALL(env, napi_get_undefined(env, &return_value))
    return return_value;
}

// expected arguments in order:
// - Object client
// - onRegistryCreated(Object client, Object registry, number registryId):void
// return:
// - void
napi_value
setRegistryCreatedCallback(napi_env env, napi_callback_info info) {
    size_t argc = 2;
    napi_value argv[argc], client_value, js_cb, return_value;
    napi_ref js_cb_ref;

    struct wl_client *client;
    struct client_destruction_listener *destruction_listener;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    client_value = argv[0];
    js_cb = argv[1];

    NAPI_CALL(env, napi_get_value_external(env, client_value, (void **) &client))
    NAPI_CALL(env, napi_create_reference(env, js_cb, 1, &js_cb_ref))

    destruction_listener = (struct client_destruction_listener *) wl_client_get_destroy_listener(client,
                                                                                                 on_client_destroyed);
    destruction_listener->registry_created_cb_ref = js_cb_ref;

    NAPI_CALL(env, napi_get_undefined(env, &return_value))
    return return_value;
}

// expected arguments in order:
// - Object client
// - onBufferCreated(Object client, number bufferId):void
// return:
// - void
napi_value
setBufferCreatedCallback(napi_env env, napi_callback_info info) {
    size_t argc = 2;
    napi_value argv[argc], client_value, js_cb, return_value;
    napi_ref js_cb_ref;

    struct wl_client *client;
    struct client_destruction_listener *destruction_listener;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    client_value = argv[0];
    js_cb = argv[1];

    NAPI_CALL(env, napi_get_value_external(env, client_value, (void **) &client))
    NAPI_CALL(env, napi_create_reference(env, js_cb, 1, &js_cb_ref))

    destruction_listener = (struct client_destruction_listener *) wl_client_get_destroy_listener(client,
                                                                                                 on_client_destroyed);
    destruction_listener->buffer_created_cb_ref = js_cb_ref;

    NAPI_CALL(env, napi_get_undefined(env, &return_value))
    return return_value;
}

napi_value
emitGlobals(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value argv[argc], registry_value, return_value;
    struct wl_resource *registry_resource;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    registry_value = argv[0];
    NAPI_CALL(env, napi_get_value_external(env, registry_value, (void **) &registry_resource))

    wl_registry_emit_globals(registry_resource);

    NAPI_CALL(env, napi_get_undefined(env, &return_value))
    return return_value;
}

napi_value
createWlMessage(napi_env env, napi_callback_info info) {
    size_t argc = 3, name_size = 64, signature_size = 16;
    napi_value argv[argc], name_value, signature_value, types_value, type_value, message_value, null_value;
    char *name, *signature;
    size_t length;
    const struct wl_interface **types;
    struct wl_message *message;
    bool is_null;

    NAPI_CALL(env, napi_get_null(env, &null_value))
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))

    name_value = argv[0];
    signature_value = argv[1];
    types_value = argv[2];

    // TODO do we care about copied length for strings?
    name = calloc(1, name_size);
    signature = calloc(1, signature_size);
    NAPI_CALL(env, napi_get_value_string_latin1(env, name_value, name, name_size, &length))
    NAPI_CALL(env, napi_get_value_string_latin1(env, signature_value, signature, signature_size, &length))
    napi_get_array_length(env, types_value, (uint32_t *) &length);
    types = malloc(length * sizeof(struct wl_interface *));


    for (int i = 0; i < length; ++i) {
        NAPI_CALL(env, napi_get_element(env, types_value, i, &type_value))
        NAPI_CALL(env, napi_strict_equals(env, type_value, null_value, &is_null))
        if (is_null) {
            types[i] = NULL;
        } else {
            NAPI_CALL(env, napi_get_value_external(env, type_value, (void **) (types + i)))
        }
    }

    message = malloc(sizeof(struct wl_message));
    message->name = name;
    message->signature = signature;
    message->types = types;

    NAPI_CALL(env, napi_create_external(env, message, NULL, NULL, &message_value))
    return message_value;
}

napi_value
createWlInterface(napi_env env, napi_callback_info info) {
    napi_value interface_value;

    struct wl_interface *interface = malloc(sizeof(struct wl_interface));
    NAPI_CALL(env, napi_create_external(env, interface, NULL, NULL, &interface_value))
    return interface_value;
}

napi_value
initWlInterface(napi_env env, napi_callback_info info) {
    size_t argc = 5, name_size = 64, length;
    napi_value argv[argc], name_value, version_value, requests_value, events_value, request_value, event_value, interface_value, return_value;
    struct wl_interface *interface;
    int version;
    char *name;
    uint32_t method_count, event_count;
    struct wl_message *methods = NULL, *events = NULL, *message;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    interface_value = argv[0];
    name_value = argv[1];
    version_value = argv[2];
    requests_value = argv[3];
    events_value = argv[4];

    // TODO do we care about copied length for strings?
    name = calloc(1, name_size);
    NAPI_CALL(env, napi_get_value_string_latin1(env, name_value, name, name_size, &length))
    NAPI_CALL(env, napi_get_value_int32(env, version_value, &version))

    NAPI_CALL(env, napi_get_array_length(env, requests_value, &method_count))
    if (method_count) {
        methods = malloc(method_count * sizeof(struct wl_message));
        for (int i = 0; i < method_count; ++i) {
            NAPI_CALL(env, napi_get_element(env, requests_value, i, &request_value))
            NAPI_CALL(env, napi_get_value_external(env, request_value, (void **) &message))
            methods[i] = *message;
        }
    }

    NAPI_CALL(env, napi_get_array_length(env, events_value, &event_count))
    if (event_count) {
        events = malloc(event_count * sizeof(struct wl_message));
        for (int i = 0; i < event_count; ++i) {
            NAPI_CALL(env, napi_get_element(env, events_value, i, &event_value))
            NAPI_CALL(env, napi_get_value_external(env, event_value, (void **) &message))
            events[i] = *message;
        }
    }

    NAPI_CALL(env, napi_get_value_external(env, interface_value, (void **) &interface))
    interface->name = name;
    interface->version = version;
    interface->method_count = method_count;
    interface->methods = methods;
    interface->event_count = event_count;
    interface->events = events;

    NAPI_CALL(env, napi_get_undefined(env, &return_value))
    return return_value;
}

napi_value
createWlResource(napi_env env, napi_callback_info info) {
    size_t argc = 4;
    napi_value argv[argc], interface_value, client_value, version_value, id_value, resource_value;
    struct wl_client *client;
    int id, version;
    struct wl_interface *interface;
    struct wl_resource *resource;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    client_value = argv[0];
    id_value = argv[1];
    version_value = argv[2];
    interface_value = argv[3];

    NAPI_CALL(env, napi_get_value_external(env, client_value, (void **) &client))
    NAPI_CALL(env, napi_get_value_int32(env, id_value, &id))
    NAPI_CALL(env, napi_get_value_int32(env, version_value, &version))
    NAPI_CALL(env, napi_get_value_external(env, interface_value, (void **) &interface))

    resource = wl_resource_create(client, interface, version, (uint32_t) id);
    NAPI_CALL(env, napi_create_external(env, resource, NULL, NULL, &resource_value))
    return resource_value;
}

napi_value
destroyWlResourceSilently(napi_env env, napi_callback_info info) {
    size_t argc = 2;
    napi_value argv[argc], client_value, id_value, return_value;
    uint32_t id;
    struct wl_client *client;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    client_value = argv[0];
    id_value = argv[1];

    NAPI_CALL(env, napi_get_value_external(env, client_value, (void **) &client))
    NAPI_CALL(env, napi_get_value_uint32(env, id_value, &id))

    wl_resource_destroy_silently(wl_client_get_object(client, id));

    NAPI_CALL(env, napi_get_undefined(env, &return_value))
    return return_value;
}

napi_value
getServerObjectIdsBatch(napi_env env, napi_callback_info info) {
    size_t argc = 2;
    napi_value argv[argc], client_value, ids_value, return_value;
    size_t amount;
    uint32_t *ids;
    struct wl_client *client;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    client_value = argv[0];
    ids_value = argv[1];

    NAPI_CALL(env, napi_get_value_external(env, client_value, (void **) &client))
    NAPI_CALL(env, napi_get_typedarray_info(env, ids_value, NULL, &amount, (void **) &ids, NULL, NULL))

    wl_get_server_object_ids_batch(client, ids, amount);

    NAPI_CALL(env, napi_get_undefined(env, &return_value))
    return return_value;
}

napi_value
makePipe(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value argv[argc], pipefd_value, return_value;
    size_t amount;
    int *pipefd;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    pipefd_value = argv[0];

    NAPI_CALL(env, napi_get_typedarray_info(env, pipefd_value, NULL, &amount, (void **) &pipefd, NULL, NULL))
    if (amount < 2) {
        // TODO error out
    }

    if (pipe(pipefd)) {
        // TODO error out
    }

    NAPI_CALL(env, napi_get_undefined(env, &return_value))
    return return_value;
}

static void
westfield_xserver_starting(void *user_data, int wm_fd, struct wl_client *client, int display_fd) {
    struct weston_xwayland_callbacks *weston_xwayland_callbacks;
    napi_value starting_js_cb, global, cb_result, wm_fd_value, client_value, display_fd_value;
    napi_env env;

    weston_xwayland_callbacks = user_data;
    env = weston_xwayland_callbacks->env;

    NAPI_CALL(env, napi_get_reference_value(env, weston_xwayland_callbacks->xwayland_starting_cb_ref, &starting_js_cb))
    NAPI_CALL(env, napi_get_global(env, &global))
    NAPI_CALL(env, napi_create_int32(env, wm_fd, &wm_fd_value))
    NAPI_CALL(env, napi_create_external(env, client, NULL, NULL, &client_value))
    NAPI_CALL(env, napi_create_int32(env, display_fd, &display_fd_value))
    napi_value argv[3] = {wm_fd_value, client_value, display_fd_value};
    NAPI_CALL(env, napi_call_function(env, global, starting_js_cb, 3, argv, &cb_result))
}

static void
westfield_xserver_destroyed(void *user_data) {
    struct weston_xwayland_callbacks *weston_xwayland_callbacks;
    napi_value destroyed_js_cb, global, cb_result;
    napi_env env;

    weston_xwayland_callbacks = user_data;
    env = weston_xwayland_callbacks->env;

    NAPI_CALL(env,
              napi_get_reference_value(env, weston_xwayland_callbacks->xwwayland_destroyed_cb_ref, &destroyed_js_cb))
    NAPI_CALL(env, napi_get_global(env, &global))
    napi_value argv[0] = {};
    NAPI_CALL(env, napi_call_function(env, global, destroyed_js_cb, 0, argv, &cb_result))
    free(weston_xwayland_callbacks);
}

napi_value
setupXWayland(napi_env env, napi_callback_info info) {
    size_t argc = 3;
    napi_value argv[argc], return_value;
    struct wl_display *display;
    struct westfield_xwayland *westfield_xwayland;
    struct weston_xwayland_callbacks *weston_xwayland_callbacks;
    napi_ref starting_cb_ref, destroyed_cb_ref;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    NAPI_CALL(env, napi_create_reference(env, argv[1], 1, &starting_cb_ref))
    NAPI_CALL(env, napi_create_reference(env, argv[2], 1, &destroyed_cb_ref))
    NAPI_CALL(env, napi_get_value_external(env, argv[0], (void **) &display))

    weston_xwayland_callbacks = calloc(1, sizeof(struct weston_xwayland_callbacks));
    weston_xwayland_callbacks->env = env;
    weston_xwayland_callbacks->xwayland_starting_cb_ref = starting_cb_ref;
    weston_xwayland_callbacks->xwwayland_destroyed_cb_ref = destroyed_cb_ref;

    westfield_xwayland = westfield_xwayland_setup((struct wl_display *) display,
                                                  weston_xwayland_callbacks,
                                                  westfield_xserver_starting,
                                                  westfield_xserver_destroyed);

    if (westfield_xwayland) {
        NAPI_CALL(env, napi_create_external(env, westfield_xwayland, NULL, NULL, &return_value))
    } else {
        NAPI_CALL(env, napi_get_undefined(env, &return_value))
    }
    return return_value;
}

napi_value
teardownXWayland(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value argv[argc], return_value;
    struct westfield_xwayland *westfield_xwayland;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    NAPI_CALL(env, napi_get_value_external(env, argv[0], (void **) &westfield_xwayland));
    NAPI_CALL(env, napi_get_undefined(env, &return_value))

    westfield_xwayland_teardown(westfield_xwayland);

    return return_value;
}

napi_value
equalValueExternal(napi_env env, napi_callback_info info) {
    size_t argc = 2;
    napi_value argv[argc], return_value;
    void *wrapped_a, *wrapped_b;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    NAPI_CALL(env, napi_get_value_external(env, argv[0], (void **) &wrapped_a))
    NAPI_CALL(env, napi_get_value_external(env, argv[1], (void **) &wrapped_b))
    NAPI_CALL(env, napi_get_boolean(env, wrapped_a == wrapped_b, &return_value))

    return return_value;
}

napi_value
getXWaylandDisplay(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value argv[argc], return_value;
    struct westfield_xwayland *westfield_xwayland;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    NAPI_CALL(env, napi_get_value_external(env, argv[0], (void **) &westfield_xwayland))
    NAPI_CALL(env, napi_create_int32(env, westfield_xwayland_get_display(westfield_xwayland), &return_value))

    return return_value;
}

napi_value
getCredentials(napi_env env, napi_callback_info info) {
    size_t argc = 2;
    napi_value argv[argc], array_buffer_value, return_value;
    struct wl_client *client;
    size_t typed_array_length;
    napi_typedarray_type typed_array_type;
    void *typed_array_data;
    size_t typed_array_byte_offset;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    NAPI_CALL(env, napi_get_value_external(env, argv[0], (void **) &client));
    NAPI_CALL(env, napi_get_typedarray_info(env,
                                            argv[1],
                                            &typed_array_type,
                                            &typed_array_length,
                                            &typed_array_data,
                                            &array_buffer_value,
                                            &typed_array_byte_offset))
    NAPI_CALL(env, napi_get_undefined(env, &return_value))

    if (typed_array_length != 3 || typed_array_type != napi_uint32_array) {
        return return_value;
    }

    uint32_t *uint32_data = typed_array_data;
    wl_client_get_credentials(client, (pid_t *) uint32_data, uint32_data + 1, uint32_data + 2);

    return return_value;
}

napi_value
init(napi_env env, napi_value exports) {
    napi_property_descriptor desc[] = {
            // core
            DECLARE_NAPI_METHOD("createDisplay", createDisplay),
            DECLARE_NAPI_METHOD("destroyDisplay", destroyDisplay),
            DECLARE_NAPI_METHOD("addSocketAuto", addSocketAuto),
            DECLARE_NAPI_METHOD("getFd", getFd),
            DECLARE_NAPI_METHOD("destroyClient", destroyClient),
            DECLARE_NAPI_METHOD("sendEvents", sendEvents),
            DECLARE_NAPI_METHOD("dispatchRequests", dispatchRequests),
            DECLARE_NAPI_METHOD("flush", flush),
            DECLARE_NAPI_METHOD("createMemoryMappedFile", createMemoryMappedFile),
            DECLARE_NAPI_METHOD("initShm", initShm),
            DECLARE_NAPI_METHOD("initDrm", initDrm),
            DECLARE_NAPI_METHOD("setWireMessageCallback", setWireMessageCallback),
            DECLARE_NAPI_METHOD("setWireMessageEndCallback", setWireMessageEndCallback),
            DECLARE_NAPI_METHOD("setClientDestroyedCallback", setClientDestroyedCallback),
            DECLARE_NAPI_METHOD("setRegistryCreatedCallback", setRegistryCreatedCallback),
            DECLARE_NAPI_METHOD("setSyncDoneCallback", setSyncDoneCallback),
            DECLARE_NAPI_METHOD("emitGlobals", emitGlobals),
            DECLARE_NAPI_METHOD("createWlMessage", createWlMessage),
            DECLARE_NAPI_METHOD("initWlInterface", initWlInterface),
            DECLARE_NAPI_METHOD("createWlInterface", createWlInterface),
            DECLARE_NAPI_METHOD("createWlResource", createWlResource),
            DECLARE_NAPI_METHOD("destroyWlResourceSilently", destroyWlResourceSilently),
            DECLARE_NAPI_METHOD("setBufferCreatedCallback", setBufferCreatedCallback),
            DECLARE_NAPI_METHOD("getServerObjectIdsBatch", getServerObjectIdsBatch),
            DECLARE_NAPI_METHOD("makePipe", makePipe),
            DECLARE_NAPI_METHOD("equalValueExternal", equalValueExternal),
            DECLARE_NAPI_METHOD("getCredentials", getCredentials),

            // xwayland
            DECLARE_NAPI_METHOD("setupXWayland", setupXWayland),
            DECLARE_NAPI_METHOD("teardownXWayland", teardownXWayland),
            DECLARE_NAPI_METHOD("getXWaylandDisplay", getXWaylandDisplay),
    };

    NAPI_CALL(env, napi_define_properties(env, exports, sizeof(desc) / sizeof(napi_property_descriptor), desc))

    westfield_xwayland_init();

    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init)
