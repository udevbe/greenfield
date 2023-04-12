#include <errno.h>
#include <signal.h>
#include <stdio.h>
#include <sys/time.h>
#include <pipewire/pipewire.h>
#include <spa/param/audio/format-utils.h>
#include "audio-node.h"
#include "encoder.h"

struct data
{
   struct pw_main_loop *loop;
   struct pw_core *core;
   struct spa_audio_info format;
   struct pw_stream *stream;
   struct pw_properties *stream_properties;
   struct spa_hook node_listener;
   char *PID;
   unsigned move : 1; // unused for now I think
};

const struct spa_pod *params[1];
static struct data data = {0};
static struct pw_registry *registry;
static uint32_t source_node;
uint32_t pip_node_id;

static void on_process(void *userdata);
static void on_stream_state_changed(void *_data, enum pw_stream_state old, enum pw_stream_state state, const char *error);
static void do_quit(void *userdata, int signal_number);
static void on_global_add(void *data, uint32_t id, uint32_t permissions, const char *type, uint32_t version, const struct spa_dict *props);
static void on_global_remove(void *data, uint32_t id);
static void node_info(void *object, const struct pw_node_info *info);

static const struct pw_stream_events stream_events = {
    PW_VERSION_STREAM_EVENTS,
   //  .process = on_process,
    .state_changed = on_stream_state_changed, // whether the stream is connected and recieving data in on_process
    //  .io_changed = on_io_changed,
};

static const struct pw_registry_events registry_events = {
    PW_VERSION_REGISTRY_EVENTS,
    .global = on_global_add,           // new object in PW daemon
    .global_remove = on_global_remove, // object removed from PW daemon
};

static const struct pw_node_events node_events = {
    PW_VERSION_NODE_EVENTS,
    .info = node_info, // geting app props, for PID
};

static void node_info(void *object, const struct pw_node_info *info)
{
   struct data *data = object;
   struct spa_dict_item *item = spa_dict_lookup_item(info->props, PW_KEY_APP_PROCESS_ID);
   printf("ITEM: %s \n", item->value);
   data->PID = strdup(item->value);
   printf("ITEM PID: %s \n", data->PID);
   // pw_stream_disconnect(data->stream);
   spa_hook_remove(&data->node_listener);
   printf("SPA HOOK REMOVED");
   char *rest;
   pid_t pid = (int) strtol(data->PID, &rest, 10);
   audio_encoder_set_pipewire_node_id_by_pid(pip_node_id, pid);  // message to create encoder and pipeline -- encoder.h
}

/* [registry_event_global] */

static void on_process(void *audiodata)
{
   struct data *data = audiodata;
   struct pw_buffer *buffer;
   // struct spa_buffer *buf;
   static __uint64_t cntr = 0;

   while (((buffer = pw_stream_dequeue_buffer(data->stream)) != NULL))
   {
      cntr++;
      if (!(cntr % 50) && buffer->buffer->datas->chunk->size)
      {
         printf("chunk size: %u, first 3 floats: %f %f %f\n", buffer->buffer->datas->chunk->size,
                (((float *)buffer->buffer->datas->data)[0]),
                (((float *)buffer->buffer->datas->data)[1]),
                (((float *)buffer->buffer->datas->data)[2]));
      }

      // uint32_t my_node_id = pw_stream_get_node_id(data->stream);
      pw_stream_queue_buffer(data->stream, buffer);
   }
}

static void on_stream_state_changed(void *_data, enum pw_stream_state old, enum pw_stream_state state,
                                    const char *error)
{
   struct data *data = _data;
   // pip_node_id = pw_stream_get_node_id(data->stream);

   switch (state)
   {
   case PW_STREAM_STATE_UNCONNECTED:
      printf("NODE --%d-- UNCONNECTED \n", pip_node_id);
      break;
   case PW_STREAM_STATE_CONNECTING:
      printf("NODE --%d-- CONNECTING \n", pip_node_id);
      break;
   case PW_STREAM_STATE_PAUSED:
      printf("NODE --%d-- PAUSED \n", pip_node_id);
      break;
   case PW_STREAM_STATE_STREAMING:
      // pip_node_id = pip_node;
      printf(" PID %d PID %s \n", pip_node_id, data->PID);
      printf("NODE --%d-- STREAMING\n", pip_node_id);
      break;
   case PW_STREAM_STATE_ERROR:
      printf("NODE --%d-- IN ERROR : %s\n", pip_node_id, error);
      break;
   default:
      break;
   }
}

static void on_global_add(void *userdata, uint32_t id, uint32_t permissions, const char *type, uint32_t version, const struct spa_dict *props)
{
   if (!props)
   {
      return;
   }

   const char *obj_ser_c = (props->items->value);
   const char *media_role = props->items[5].value;

   if (!media_role)
   {
      return;
   }

   const char *pid_str = NULL;
      printf("TU ASI BUDE PROBLEM %d,,      %d   %d \n", id, pip_node_id, pip_node_id!=id  );

   // filtering Node with media role producing audio from all objects connecting to core daemon
   if (!strcmp(type, "PipeWire:Interface:Node") && !strcmp(media_role, "Stream/Output/Audio"   ) && id !=0 && id != pip_node_id)
   {

      pip_node_id = id;
      // printf("TU ASI BUDE PROBLEM");
 
  
      struct spa_hook node_listener;
      
      // binding to object node and connecting .info listener to get PID
      struct pw_node *node = pw_registry_bind(registry, id, type, PW_VERSION_NODE, 0);
      pw_node_add_listener(node, &data.node_listener, &node_events, &data);
   
      // for multiple apps playing, disconnecting current stream connection to reconnect to another   
      int successdis = pw_stream_disconnect(data.stream);
      // printf("success  disconnect: %d , connecting to new: %d\n", successdis, id);

      // int success = pw_stream_connect(data.stream,
      //                                 PW_DIRECTION_INPUT,
      //                                 id,
      //                                 PW_STREAM_FLAG_AUTOCONNECT |
      //                                     PW_STREAM_FLAG_MAP_BUFFERS |
      //                                     PW_STREAM_FLAG_RT_PROCESS,
      //                                 params, 1);
      // printf("success connect :  %d \n", success);
      // if we want to pass app id to gstreamer, for now we are passing node id
      source_node = id;

      //setting node as target object but has no influence on stream that is why reconnecting stream was implemented
      // const struct spa_dict_item new_target = {PW_KEY_TARGET_OBJECT, obj_ser_c};
      // const struct spa_dict new_props = {0, 1, &new_target};
      // int success2 = pw_stream_update_properties(data.stream, &new_props);
      // printf("changed props target: %d\n", success2);

      // props check, not necessarry
      // const struct pw_properties *check_props = pw_stream_get_properties(data.stream);
         // for (int i = 0; i < check_props->dict.n_items; i++)
         // {
         //    printf("Key %s: %s\n", check_props->dict.items[i].key, check_props->dict.items[i].value);
         // }
   }
}

static void on_global_remove(void *userdata, uint32_t id)
{

   if (id == source_node)
   {
      int successdis = pw_stream_disconnect(data.stream);
      printf("success  disconnect: %d , disconnecting to id :   %d\n", successdis, id);
   }
}

//  int main(int argc, char **argv)
// {

void *producer(void *param)
{
   pw_init(NULL, NULL);

   // Create the event loop. 
   data.loop = pw_main_loop_new(NULL);

   struct pw_context *context = pw_context_new(
       pw_main_loop_get_loop(data.loop),
       pw_properties_new(
           // Explicity ask for the realtime configuration. 
           PW_KEY_CONFIG_NAME, "client-rt.conf",
           NULL),
       0);
   if (context == NULL)
   {
      perror("pw_context_new() failed");
      return NULL;
   }

   // Connect the context, which returns us a proxy to the core object
   data.core = pw_context_connect(context, NULL, 0);
   if (data.core == NULL)
   {
      perror("pw_context_connect() failed");
      return NULL;
   }

   // Add signal listeners to cleanly close the event loop and process when requested. 
   pw_loop_add_signal(pw_main_loop_get_loop(data.loop), SIGINT,
                      do_quit, &data);
   pw_loop_add_signal(pw_main_loop_get_loop(data.loop), SIGTERM,
                      do_quit, &data);

   data.stream_properties = pw_properties_new(
       PW_KEY_MEDIA_TYPE, "Audio",
       PW_KEY_MEDIA_CATEGORY, "Duplex",
       //   PW_KEY_MEDIA_CLASS, "Audio/Sink",
       //  Midi/Bridge
       PW_KEY_MEDIA_ROLE, "Music",
       // PW_KEY_NODE_EXCLUSIVE, "true",
       /* Our node name. */
       PW_KEY_NODE_NAME, "NODAAAAA",
       // PW_KEY_NODE_RATE, rate_str,
       PW_KEY_TARGET_OBJECT, " ",
       NULL);

   data.stream = pw_stream_new(
       data.core, /* Core proxy. */
       "example stream",
       data.stream_properties);

   if (data.stream == NULL)
   {
      printf("mame problem");
   };

   struct spa_hook event_listener;
   pw_stream_add_listener(data.stream, &event_listener,
                          &stream_events, &data);

   uint8_t buffer[1024];
   struct spa_pod_builder b = SPA_POD_BUILDER_INIT(buffer,
                                                   sizeof(buffer));
   params[0] = spa_format_audio_raw_build(&b,
                                          SPA_PARAM_EnumFormat,
                                          &SPA_AUDIO_INFO_RAW_INIT(
                                                  .format = SPA_AUDIO_FORMAT_F32,
                                              // .channels = data.fileinfo.channels,
                                              // .rate = data.fileinfo.samplerate
                                              ));

   pw_stream_connect(data.stream,
                     PW_DIRECTION_INPUT,
                     PW_ID_ANY, // id
              //when using autoconnect without specified id node connects to alsa and starts recording audio
                     //   PW_STREAM_FLAG_AUTOCONNECT | 
                     PW_STREAM_FLAG_MAP_BUFFERS |
                         PW_STREAM_FLAG_RT_PROCESS,
                     params, 1);

   registry = pw_core_get_registry(data.core, PW_VERSION_REGISTRY, 0);

   if (registry == NULL)
   {
      printf("Failed to get registry \n");
      return NULL;
   }

   struct spa_hook registry_listener;
   spa_zero(registry_listener);
   pw_registry_add_listener(registry, &registry_listener, &registry_events, NULL);

   pw_main_loop_run(data.loop);

   printf("NEVOLAJ MA");

   pw_proxy_destroy((struct pw_proxy *)registry);
   pw_core_disconnect(data.core);
   if (data.stream)
      pw_stream_destroy(data.stream);
   spa_hook_remove(&event_listener);
   spa_hook_remove(&registry_listener);
   pw_context_destroy(context);
   pw_main_loop_destroy(data.loop);
   pw_deinit();

   return 0;
}

static void do_quit(void *userdata, int signal_number)
{
   // struct data *data = userdata;
   pw_main_loop_quit(data.loop);
}
