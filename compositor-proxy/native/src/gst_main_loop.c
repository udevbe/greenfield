#include <glib.h>
#include <unistd.h>
#include <sys/eventfd.h>
#include <stdio.h>
#include "encoder.h"

extern void
do_gst_init();

extern void
do_gst_frame_encoder_create(char preferred_frame_encoder[16], frame_callback_func frame_ready_callback, void *user_data,
                            struct frame_encoder **frame_encoder_pp, struct westfield_egl *westfield_egl);

extern void
do_gst_frame_encoder_encode(struct frame_encoder **frame_encoder_pp, struct wl_resource *buffer_resource, uint32_t buffer_content_serial,
                            uint32_t buffer_creation_serial);

extern void
do_gst_frame_encoder_free(struct frame_encoder **frame_encoder_pp);

extern void
do_gst_encoded_frame_finalize(struct encoded_frame *encoded_frame);

extern void
do_gst_frame_encoder_request_key_unit(struct frame_encoder **frame_encoder_pp);

extern void
do_gst_audio_encoder_create(audio_callback_func audio_ready_callback, void *user_data,
                            struct audio_encoder **audio_encoder_pp);

extern void
do_gst_audio_encoder_free(struct audio_encoder **frame_encoder_pp);

void
do_gst_encoded_audio_finalize(struct encoded_audio *encoded_audio);


struct gf_gst_main_loop {
    GMainLoop *main;
    struct SyncSource *src;
};
static struct gf_gst_main_loop *main_loop;

enum gf_message_type {
    frame_encoder_create_type,
    frame_encoder_encode_type,
    frame_encoder_free_type,
    encoded_frame_finalize_type,
    frame_encoder_request_key_unit_type,
    audio_encoder_create_type,
    audio_encoder_free_type,
    encoded_audio_finalize_type,
};

struct gf_message {
    enum gf_message_type type;
    union {
        struct {
            char preferred_frame_encoder[16];
            frame_callback_func frame_ready_callback;
            void *user_data;
            struct frame_encoder **frame_encoder_pp;
            struct westfield_egl *westfield_egl;
        } frame_encoder_create;
        struct {
            struct frame_encoder **frame_encoder_pp;
            struct wl_resource *buffer_resource;
            uint32_t buffer_content_serial;
            uint32_t buffer_creation_serial;
        } frame_encoder_encode;
        struct {
            struct frame_encoder **frame_encoder_pp;
        } frame_encoder_free;
        struct {
            struct encoded_frame *encoded_frame;
        } encoded_frame_finalize;
        struct {
            struct frame_encoder **frame_encoder_pp;
        } frame_encoder_request_key_unit;
        struct {
            audio_callback_func audio_ready_callback;
            void *user_data;
            struct audio_encoder **audio_encoder_pp;
        } audio_encoder_create;
        struct {
            struct audio_encoder **audio_encoder_pp;
        } audio_encoder_free;
        struct {
            struct encoded_audio *encoded_audio;
        } encoded_audio_finalize;
    } body;
};

typedef void (*SyncWorkerCb)(struct gf_message *message, gpointer udata);

static void
message_free(gpointer item) {
    free(item);
}

struct SyncSource {
    GSource parent;

    gint fd;
    gpointer fd_tag;

    GAsyncQueue *work_queue;
};

static gboolean
syso_prepare(GSource *_source, gint *timeout) {
    struct SyncSource *source = (struct SyncSource *) _source;
    return (g_source_query_unix_fd(_source, source->fd_tag) > 0);
}

static gboolean
syso_check(GSource *_source) {
    struct SyncSource *source = (struct SyncSource *) _source;
    return (g_source_query_unix_fd(_source, source->fd_tag) > 0);
}

static gboolean
syso_dispatch(GSource *_source, GSourceFunc callback, gpointer user_data) {
    struct SyncSource *source = (struct SyncSource *) _source;

    guint64 n_events;
    if (read(source->fd, &n_events, sizeof(n_events)) != sizeof(n_events)) {
        g_warning("EventFD read failed");
        return FALSE;
    }

    SyncWorkerCb cb = (SyncWorkerCb) callback;

    while (n_events-- > 0) {
        struct gf_message *message = g_async_queue_try_pop(source->work_queue);
        if (message) {
            if (cb) {
                (*cb)(message, user_data);
            }
            free(message);
        }
    }

    return TRUE;
}

static void
syso_finalize(GSource *_source) {
    struct SyncSource *source = (struct SyncSource *) _source;

    close(source->fd);
    g_async_queue_unref(source->work_queue);
}

static GSourceFuncs syncsource_funcs = {
        syso_prepare,
        syso_check,
        syso_dispatch,
        syso_finalize
};

static GSource *
sync_source_create() {
    GSource *ret = g_source_new(&syncsource_funcs, sizeof(struct SyncSource));

    struct SyncSource *source = (struct SyncSource *) ret;

    source->fd = eventfd(0, 0);
    source->work_queue = g_async_queue_new_full(message_free);

    source->fd_tag = g_source_add_unix_fd(ret, source->fd, G_IO_IN);

    return ret;
}

static gboolean
main_loop_handle_message(struct gf_message *message) {
    switch (message->type) {
        case frame_encoder_create_type:
            do_gst_frame_encoder_create(message->body.frame_encoder_create.preferred_frame_encoder,
                                        message->body.frame_encoder_create.frame_ready_callback,
                                        message->body.frame_encoder_create.user_data,
                                        message->body.frame_encoder_create.frame_encoder_pp,
                                        message->body.frame_encoder_create.westfield_egl
            );
            break;
        case frame_encoder_encode_type:
            do_gst_frame_encoder_encode(message->body.frame_encoder_encode.frame_encoder_pp,
                                        message->body.frame_encoder_encode.buffer_resource,
                                        message->body.frame_encoder_encode.buffer_content_serial,
                                        message->body.frame_encoder_encode.buffer_creation_serial
            );
            break;
        case frame_encoder_free_type:
            do_gst_frame_encoder_free(message->body.frame_encoder_free.frame_encoder_pp);
            break;
        case encoded_frame_finalize_type:
            do_gst_encoded_frame_finalize(message->body.encoded_frame_finalize.encoded_frame);
            break;
        case frame_encoder_request_key_unit_type:
            do_gst_frame_encoder_request_key_unit(message->body.frame_encoder_request_key_unit.frame_encoder_pp);
            break;
        case audio_encoder_create_type:
            do_gst_audio_encoder_create(message->body.audio_encoder_create.audio_ready_callback,
                                        message->body.audio_encoder_create.user_data,
                                        message->body.audio_encoder_create.audio_encoder_pp
            );
            break;
        case audio_encoder_free_type:
            do_gst_audio_encoder_free(message->body.audio_encoder_free.audio_encoder_pp);
            break;
        case encoded_audio_finalize_type:
            do_gst_encoded_audio_finalize(message->body.encoded_audio_finalize.encoded_audio);
            break;
    }
    return G_SOURCE_CONTINUE;
}

static void *
gf_gst_main_loop_ini(gpointer data) {
    GMainLoop *main = g_main_loop_new(NULL, FALSE);

    GSource *worker = sync_source_create();
    g_source_attach(worker, NULL);
    g_source_unref(worker);
    g_source_set_callback(worker, G_SOURCE_FUNC(main_loop_handle_message), NULL, NULL);

    main_loop = malloc(sizeof(struct gf_gst_main_loop));
    main_loop->main = main;
    main_loop->src = (struct SyncSource *) worker;

    do_gst_init();
    g_main_loop_run(main);

    g_main_loop_unref(main);
    g_source_destroy(worker);

    return NULL;
}

static int
send_message(struct gf_message *message) {
    g_async_queue_push(main_loop->src->work_queue, message);
    guint64 event = 1;
    if (write(main_loop->src->fd, &event, sizeof(event)) == -1) {
        return -1;
    }
    return 0;
}

int
frame_encoder_create(char preferred_frame_encoder[16],
                     frame_callback_func frame_ready_callback,
                     void *user_data,
                     struct frame_encoder **frame_encoder_pp,
                     struct westfield_egl *westfield_egl) {
    struct gf_message *message = g_new0(struct gf_message, 1);

    message->type = frame_encoder_create_type;
    sprintf(message->body.frame_encoder_create.preferred_frame_encoder, "%s", preferred_frame_encoder);
    message->body.frame_encoder_create.frame_ready_callback = frame_ready_callback;
    message->body.frame_encoder_create.user_data = user_data;
    message->body.frame_encoder_create.frame_encoder_pp = frame_encoder_pp;
    message->body.frame_encoder_create.westfield_egl = westfield_egl;

    return send_message(message);
}

int
frame_encoder_encode(struct frame_encoder **frame_encoder_pp, struct wl_resource *buffer_resource, uint32_t buffer_content_serial,
                     uint32_t buffer_creation_serial) {
    struct gf_message *message = g_new0(struct gf_message, 1);

    message->type = frame_encoder_encode_type;
    message->body.frame_encoder_encode.frame_encoder_pp = frame_encoder_pp;
    message->body.frame_encoder_encode.buffer_resource = buffer_resource;
    message->body.frame_encoder_encode.buffer_content_serial = buffer_content_serial;
    message->body.frame_encoder_encode.buffer_creation_serial = buffer_creation_serial;

    return send_message(message);
}

int
frame_encoder_destroy(struct frame_encoder **frame_encoder_pp) {
    struct gf_message *message = g_new0(struct gf_message, 1);

    message->type = frame_encoder_free_type;
    message->body.frame_encoder_free.frame_encoder_pp = frame_encoder_pp;

    return send_message(message);
}

int
encoded_frame_finalize(struct encoded_frame *encoded_frame) {
    struct gf_message *message = g_new0(struct gf_message, 1);

    message->type = encoded_frame_finalize_type;
    message->body.encoded_frame_finalize.encoded_frame = encoded_frame;

    return send_message(message);
}

int
frame_encoder_request_key_unit(struct frame_encoder **frame_encoder_pp) {
    struct gf_message *message = g_new0(struct gf_message, 1);

    message->type = frame_encoder_request_key_unit_type;
    message->body.frame_encoder_request_key_unit.frame_encoder_pp = frame_encoder_pp;

    return send_message(message);
}

int
audio_encoder_create(audio_callback_func audio_ready_callback, void *user_data,
                     struct audio_encoder **audio_encoder_pp) {
    struct gf_message *message = g_new0(struct gf_message, 1);

    message->type = audio_encoder_create_type;
    message->body.audio_encoder_create.audio_ready_callback = audio_ready_callback;
    message->body.audio_encoder_create.user_data = user_data;
    message->body.audio_encoder_create.audio_encoder_pp = audio_encoder_pp;

    return send_message(message);
}

int
audio_encoder_destroy(struct audio_encoder **audio_encoder_pp) {
    struct gf_message *message = g_new0(struct gf_message, 1);

    message->type = audio_encoder_free_type;
    message->body.audio_encoder_free.audio_encoder_pp = audio_encoder_pp;

    return send_message(message);
}

int
encoded_audio_finalize(struct encoded_audio *encoded_audio) {
    struct gf_message *message = g_new0(struct gf_message, 1);

    message->type = encoded_audio_finalize_type;
    message->body.encoded_audio_finalize.encoded_audio = encoded_audio;

    return send_message(message);
}

__attribute__((constructor))
static
void init_gst_main_loop() {
    g_thread_new("gf_gst_main_loop", gf_gst_main_loop_ini, NULL);
}
