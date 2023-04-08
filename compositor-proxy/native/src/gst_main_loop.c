#include <glib.h>
#include <unistd.h>
#include <sys/eventfd.h>
#include <stdio.h>
#include "encoder.h"

#include <pthread.h>
#include "audio-node.h"

extern void
do_gst_init();

extern void
do_gst_frame_encoder_create(char preferred_frame_encoder[16], frame_callback_func frame_ready_callback, void *user_data,
                            struct frame_encoder **frame_encoder_pp, struct westfield_egl *westfield_egl);

extern void
do_gst_frame_encoder_encode(struct frame_encoder **frame_encoder_pp, const union frame_buffer *frame_buffer,
                            uint32_t buffer_content_serial,
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
do_gst_audio_encoder_recreate_pipeline(int PW_node_id, char* PID, struct audio_encoder **audio_encoder_pp);

extern void
do_gst_audio_encoder_encode(struct audio_encoder **audio_encoder_pp);

extern void
do_gst_audio_encoder_free(struct audio_encoder **audio_encoder_pp);

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
    audio_encoder_recreate_pipeline_type,
    // audio_encoder_get_id_type,
    audio_encoder_encode_type,
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
            const union frame_buffer *frame_buffer;
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
            int PW_node_id;
            char* PID;
            struct audio_encoder **audio_encoder_pp;
        }audio_encoder_recreate_pipeline;
        struct {
            struct audio_encoder **audio_encoder_pp;
        } audio_encoder_encode;
        struct {
            struct audio_encoder **audio_encoder_pp;
        } audio_encoder_free;
        struct {
            struct encoded_audio *encoded_audio;
        } encoded_audio_finalize;
    } body;
};

struct audio_encoder_node
{ 
    struct audio_encoder_node *prev;
    struct audio_encoder_node *next;
    struct audio_encoder **audio_encoder_pp;
    pid_t PID;
};

struct audio_encoder_node *last_encoder = NULL;



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

int pip_node_id;
int streaming;
pthread_mutex_t m=PTHREAD_MUTEX_INITIALIZER;	/* mutex lock for buffer */
pthread_cond_t c_cons=PTHREAD_COND_INITIALIZER; /* consumer waits on this cond var */
pthread_cond_t c_prod=PTHREAD_COND_INITIALIZER; /* producer waits on this cond var */


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
                                        message->body.frame_encoder_encode.frame_buffer,
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
        case audio_encoder_recreate_pipeline_type:
            do_gst_audio_encoder_recreate_pipeline(message->body.audio_encoder_recreate_pipeline.PW_node_id,
                                                   message->body.audio_encoder_recreate_pipeline.PID,
                                                   message->body.audio_encoder_recreate_pipeline.audio_encoder_pp


            );
            break;
        case audio_encoder_encode_type:
            do_gst_audio_encoder_encode(message->body.audio_encoder_encode.audio_encoder_pp);
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



void *consumer(void *param)
{
    printf("Consumer: %ld%ld", (long)getpid(), (long)getppid());
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
}

static void *
gf_gst_main_loop_ini(gpointer data) {

	pthread_t tid1, tid2;		/* thread identifiers */
	int i;

	/* create the threads; may be any number, in general */
	if (pthread_create(&tid1,NULL,producer,NULL) != 0) {
		fprintf (stderr, "Unable to create producer thread\n");
		exit (1);
	}
	if (pthread_create(&tid2,NULL,consumer,NULL) != 0) {
		fprintf (stderr, "Unable to create consumer thread\n");
		exit (1);
	}
    printf("Parent: tid1 %lu, tid2 %lu\n",tid1,tid2);
	/* wait for created thread to exit */
	pthread_join(tid1,NULL);
	pthread_join(tid2,NULL);
	printf ("Parent quiting\n");
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
frame_encoder_encode(struct frame_encoder **frame_encoder_pp, const union frame_buffer *frame_buffer,
                     uint32_t buffer_content_serial,
                     uint32_t buffer_creation_serial) {
    struct gf_message *message = g_new0(struct gf_message, 1);
printf("\n \n FREAME ENC \n\n");
    message->type = frame_encoder_encode_type;
    message->body.frame_encoder_encode.frame_encoder_pp = frame_encoder_pp;
    message->body.frame_encoder_encode.frame_buffer = frame_buffer;
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

// The following 3 functions send a message from the nodejs thread to the gstreamer thread. This effectively
// makes these function asynchronous. That is, the audio_encoder_pp argument will most likely not immediately contain
// the created audio encoder. Messages send to the gstreamer thread are in-order, so you can do an immediate create+delete.

int
audio_encoder_create(audio_callback_func audio_ready_callback, void *user_data, // moj pid
                     struct audio_encoder **audio_encoder_pp) {
                                // generates n structs of type
    struct gf_message *message = g_new0(struct gf_message, 1);
    int *pid = (int*)user_data;

    printf(" PIDKOOOO : %d\n", *pid);
    message->type = audio_encoder_create_type;
    message->body.audio_encoder_create.audio_ready_callback = audio_ready_callback;
    message->body.audio_encoder_create.user_data = user_data;
    message->body.audio_encoder_create.audio_encoder_pp = audio_encoder_pp;

    if( ! last_encoder )
    {
        last_encoder = (struct audio_encoder_node *)malloc(sizeof(struct audio_encoder_node));
        last_encoder->prev = NULL;
        last_encoder->audio_encoder_pp = audio_encoder_pp;
        last_encoder->PID = *pid;
    }
    else
    {
        struct audio_encoder_node *new_encoder = (struct audio_encoder_node *)
                        malloc(sizeof(struct audio_encoder_node));
        new_encoder->prev = last_encoder;
        new_encoder->audio_encoder_pp = audio_encoder_pp;
        last_encoder = new_encoder;
        last_encoder->PID = *pid;

    }

    return send_message(message);
}

void
audio_encoder_recreate_pipeline(int PW_node_id, char* PID) {
    struct gf_message *message = g_new0(struct gf_message, 1);
    

    int PW_PID = atoi(PID);
    message->type = audio_encoder_recreate_pipeline_type;
    message->body.audio_encoder_recreate_pipeline.PW_node_id = PW_node_id; 
    message->body.audio_encoder_recreate_pipeline.PID = PW_PID; 

    struct audio_encoder_node *curr_node = last_encoder;
    bool found = false;
    if( ! last_encoder )
    {
        //ERROR, return
    }

    while( curr_node->prev )
    {
        //check na pid, found = true break;
        printf("PID: %d  pidt: %d  bool: %d \n",PW_PID, curr_node->PID ,PW_PID == curr_node->PID);
        if (PW_PID == curr_node->PID){
        
            message->body.audio_encoder_recreate_pipeline.audio_encoder_pp = curr_node->audio_encoder_pp; 
            found = true;
            break;
        }
        curr_node = curr_node->prev;

    }
    printf("PID: %d  pidt: %d  bool: %d \n",PW_PID, curr_node->PID ,PW_PID == curr_node->PID);
        if (PW_PID == curr_node->PID){
        
            message->body.audio_encoder_recreate_pipeline.audio_encoder_pp = curr_node->audio_encoder_pp; 
            found = true;
            // break;
        }
        curr_node = curr_node->prev;
   
    if( found )
    {
        send_message(message);
    }

   
}


int
audio_encoder_encode(struct audio_encoder **audio_encoder_pp) {
    struct gf_message *message = g_new0(struct gf_message, 1);
printf("\n \n AUDIO ENC \n\n");
    message->type = audio_encoder_encode_type;
    message->body.audio_encoder_encode.audio_encoder_pp = audio_encoder_pp;

    return send_message(message);
}

int
audio_encoder_destroy(struct audio_encoder **audio_encoder_pp) {
    struct gf_message *message = g_new0(struct gf_message, 1);

    message->type = audio_encoder_free_type;
    message->body.audio_encoder_free.audio_encoder_pp = audio_encoder_pp;

    return send_message(message);
}
// for the generated encoded data
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
