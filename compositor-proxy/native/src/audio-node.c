#include <errno.h>
#include <signal.h>
#include <stdio.h>
#include <pipewire/pipewire.h>
#include <spa/param/audio/format-utils.h>
#include "audio-node.h"
#include "encoder.h"

struct data
{
   struct pw_main_loop *loop;
   struct pw_core *core;
};

struct node_listener {
    struct spa_hook spa_hook;
    uint32_t node_id;
};

static struct data data = {0};
static struct pw_registry *registry;

static void on_global_add(void *data, uint32_t id, uint32_t permissions, const char *type, uint32_t version, const struct spa_dict *props);
static void on_global_remove(void *data, uint32_t id);
static void node_info(void *object, const struct pw_node_info *info);

static const struct pw_registry_events registry_events = {
    PW_VERSION_REGISTRY_EVENTS,
    .global = on_global_add,           // new object in PW daemon
};

static const struct pw_node_events node_events = {
    PW_VERSION_NODE_EVENTS,
    .info = node_info, // geting app props, for PID
};

static void node_info(void *object, const struct pw_node_info *info)
{
   struct node_listener *node_listener = object;
   const struct spa_dict_item *item = spa_dict_lookup_item(info->props, PW_KEY_APP_PROCESS_ID);
   spa_hook_remove(&node_listener->spa_hook);
   printf("SPA HOOK REMOVED");
   char *rest;
   pid_t pid = (int) strtol(item->value, &rest, 10);
   audio_encoder_set_pipewire_node_id_by_pid(node_listener->node_id, pid);  // message to create encoder and pipeline -- encoder.h
   free(node_listener);
}

static void on_global_add(void *userdata, uint32_t id, uint32_t permissions, const char *type, uint32_t version, const struct spa_dict *props)
{
   if (!props)
   {
      return;
   }

   // FIXME iterate & look at the item key name to get media_class value
   const char *media_class = props->items[5].value;

   if (!media_class)
   {
      return;
   }

   // filtering Node with media role producing audio from all objects connecting to core daemon
   if (!strcmp(type, "PipeWire:Interface:Node") && !strcmp(media_class, "Stream/Output/Audio"   ) && id != 0)
   {
      // printf("TU ASI BUDE PROBLEM");
      
      // binding to object node and connecting .info listener to get PID
      struct node_listener *node_listener = calloc(1, sizeof(struct node_listener));
      node_listener->node_id = id;
      struct pw_node *node = pw_registry_bind(registry, id, type, PW_VERSION_NODE, 0);
      pw_node_add_listener(node, &node_listener->spa_hook, &node_events, node_listener);
   }
}

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

   struct spa_hook event_listener;

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
