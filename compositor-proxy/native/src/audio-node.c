#include <errno.h>
#include <math.h>
#include <signal.h>
#include <stdio.h>
#include <sys/time.h>
// #include <pipewire/registry.h>
#include <pipewire/pipewire.h>
// #include <sndfile.h>
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
   unsigned move:1;
};

const struct spa_pod *params[1];
static struct data data = {0};
static struct pw_registry *registry;
static uint32_t source_node;
static void on_process(void *userdata);
static void on_stream_state_changed(void *_data, enum pw_stream_state old, enum pw_stream_state state,const char *error);
static void do_quit(void *userdata, int signal_number);
static void on_global_add(void *data, uint32_t id, uint32_t permissions, const char *type, uint32_t version, const struct spa_dict *props);
static void on_global_remove(void *data, uint32_t id);


static const struct pw_stream_events stream_events = {
    PW_VERSION_STREAM_EVENTS,
    .process = on_process,
    .state_changed = on_stream_state_changed,
   //  .io_changed = on_io_changed,
};

static const struct pw_registry_events registry_events = {
    PW_VERSION_REGISTRY_EVENTS,
     .global = on_global_add,
     .global_remove = on_global_remove,
};

static void on_process(void *audiodata)
{
   struct data *data = audiodata;
   struct pw_buffer *buffer;
   // struct spa_buffer *buf;
   static __uint64_t cntr = 0;
   // static unsigned int last_node_id = 0;
 
   // const struct pw_properties *props = pw_stream_get_properties(data->stream);
   // const char *object_path = pw_properties_get(props, PW_KEY_TARGET_OBJECT);

   while (((buffer = pw_stream_dequeue_buffer(data->stream)) != NULL))
   {
      cntr++;
      if( !(cntr % 50) && buffer->buffer->datas->chunk->size )
      {
         printf("chunk size: %u, first 3 floats: %f %f %f\n",buffer->buffer->datas->chunk->size,
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
   // inpip_node = pw_stream_get_node_id(data->stream);
 
   pip_node_id = pw_stream_get_node_id(data->stream);
   
   switch (state)
   {
   case PW_STREAM_STATE_UNCONNECTED: 
      // streaming = 0;
      printf("NODE --%d-- UNCONNECTED \n",  pip_node_id);
      break;
   case PW_STREAM_STATE_CONNECTING:
      // streaming = 0;
      printf("NODE --%d-- CONNECTING \n", pip_node_id);
      break;
   case PW_STREAM_STATE_PAUSED:
      // streaming = 0;
      printf("NODE --%d-- PAUSED \n", pip_node_id);
      break;
   case PW_STREAM_STATE_STREAMING:
      // streaming = 1;
      // pip_node_id = pip_node;
      audio_encoder_recreate_pipeline(pip_node_id);
      printf("NODE --%d-- STREAMING\n", pip_node_id);
      break;
   case PW_STREAM_STATE_ERROR:
      // streaming = 0;
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
   // printf("Pripojeny %d, Typ: %s, NAME: %s\n", id, type, props->items[3].value);

   if (!strcmp(type, "PipeWire:Interface:Node")  && !strcmp(media_role, "Stream/Output/Audio") )
   {
     
      int successdis = pw_stream_disconnect	(	data.stream	);	
      printf("success  disconnect: %d , connecting to new:   %d\n", successdis, id);

      int success = pw_stream_connect(data.stream,
                                       PW_DIRECTION_INPUT,
                                       id , 
                                       PW_STREAM_FLAG_AUTOCONNECT |
                                       PW_STREAM_FLAG_MAP_BUFFERS |
                                       PW_STREAM_FLAG_RT_PROCESS,
                                       params, 1);

      source_node = id;
      // pip_node_id = pw_stream_get_node_id(data.stream);
         printf("success connect :  %d \n", success);
         printf("Pripojeny %s, ROLA: %s, NAME: %s\n", obj_ser_c, props->items[5].value, props->items[3].value);

      const struct spa_dict_item new_target = {PW_KEY_TARGET_OBJECT, obj_ser_c};
      const struct spa_dict new_props = {0, 1, &new_target};
      int success2 = pw_stream_update_properties(data.stream, &new_props);
         printf("changed props target: %d\n", success2);
      const struct pw_properties* check_props = pw_stream_get_properties	(	data.stream);
      for( int i = 0; i < check_props->dict.n_items; i++ )
      {
         printf("Key %s: %s\n",check_props->dict.items[i].key,check_props->dict.items[i].value);
      }
      }
  
}

static void on_global_remove(void *userdata, uint32_t id){
   
   if (id == source_node){
   int successdis = pw_stream_disconnect	(	data.stream	);	
   printf("success  disconnect: %d , disconnecting to id :   %d\n", successdis, id);
   pip_node_id = 0;
}
}


//  int main(int argc, char **argv)
// int pipewire_node_start()
// {

void *producer(void *param)
{
//   printf("Producer: %ld%ld", (long)getpid(), (long)getppid());
   pw_init(NULL, NULL);

   /* Create the event loop. */
   data.loop = pw_main_loop_new(NULL);

   struct pw_context *context = pw_context_new(
       pw_main_loop_get_loop(data.loop),
       pw_properties_new(
           /* Explicity ask for the realtime configuration. */
           PW_KEY_CONFIG_NAME, "client-rt.conf",
           NULL),
       0);
   if (context == NULL)
   {
      perror("pw_context_new() failed");
      return 1;
   }

   /* Connect the context, which returns us a proxy to the core
      object. */
   data.core = pw_context_connect(context, NULL, 0);
   if (data.core == NULL)
   {
      perror("pw_context_connect() failed");
      return 1;
   }

   /* Add signal listeners to cleanly close the event loop and
      process when requested. */
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
               PW_ID_ANY , // id            
               // pw_proxy_get_global(proxy),
               //   PW_STREAM_FLAG_AUTOCONNECT |
               //   PW_STREAM_FLAG_DRIVER |
               PW_STREAM_FLAG_MAP_BUFFERS |
               PW_STREAM_FLAG_RT_PROCESS
               ,params, 1);

   
   // nemusi byt global
   registry = pw_core_get_registry(data.core, PW_VERSION_REGISTRY, 0);
  

   if (registry == NULL)
   {
      printf("Failed to get registry \n");
      return 1;
   }

   struct spa_hook registry_listener;
   spa_zero(registry_listener);
   pw_registry_add_listener(registry, &registry_listener, &registry_events, NULL);

   pw_main_loop_run(data.loop);

printf("NEVOLAJ MA");

   pw_proxy_destroy((struct pw_proxy*)registry);
   pw_core_disconnect(data.core);
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



