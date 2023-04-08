#include <pipewire/pipewire.h>
#include<unistd.h>
 
struct data {
        struct pw_main_loop *loop;
        struct pw_context *context;
        struct pw_core *core;
 
        struct pw_registry *registry;
        struct spa_hook registry_listener;
 
        struct pw_node *node;
        struct spa_hook node_listener;
};
 
/* [client_info] */
static void client_info(void *object, const struct pw_node_info *info)
{
   
    printf("Hola que tal\n");
  
        struct data *data = object;
        const struct spa_dict_item *item;
 
        printf("client: id:%u, n_items: %u\n", info->id,info->props->n_items);
        printf("\tprops:\n");
        int cntr = 0;
        spa_dict_for_each(item, info->props)
        {
                printf("%d: ",cntr++);
                printf("\t\t%s: \"%s\"\n", item->key, item->value);
        }

        printf("I got after loop\n");
        // pw_proxy_destroy((struct pw_proxy *)data->node);
//  spa_hook_remove(&data->node_listener);
        // pw_main_loop_quit(data->loop);
}
 
static const struct pw_node_events node_events = {
        PW_VERSION_NODE_EVENTS,
        .info = client_info,
};
/* [client_info] */
 
/* [registry_event_global] */
static void registry_event_global(void *_data, uint32_t id,
                        uint32_t permissions, const char *type,
                        uint32_t version, const struct spa_dict *props)
{
        struct data *data = _data;
    printf("Ty chuju type: %s %u %p \n", type, id, data->node);

        //  if (data->client != NULL) return;
               
 
        if (strcmp(type, PW_TYPE_INTERFACE_Node) == 0 && id==74) {
                data->node = pw_registry_bind(data->registry,
                                id, type, PW_VERSION_NODE, 0);


                printf("ptr node: %p, node listener prev: %p, priv: %p\n",data->node,data->node_listener.link.prev,data->node_listener.priv);
                
                pw_node_add_listener(data->node,
                                &data->node_listener,
                                &node_events, data);

                
                printf("2. ptr node: %p, node listener prev: %p, priv: %p\n",data->node,data->node_listener.link.prev,data->node_listener.priv);
                                
        }
}
/* [registry_event_global] */
 static void on_global_remove(void *userdata, uint32_t id){
   
printf("odstranujemmmmmm id %u\n",id);

}
static const struct pw_registry_events registry_events = {
        PW_VERSION_REGISTRY_EVENTS,
        .global = registry_event_global,
        .global_remove = on_global_remove,
};
 
int main(int argc, char *argv[])
{
        struct data data;
 
        spa_zero(data);
 
        pw_init(&argc, &argv);
 
        data.loop = pw_main_loop_new(NULL /* properties */ );
        data.context = pw_context_new(pw_main_loop_get_loop(data.loop),
                                 NULL /* properties */ ,
                                 0 /* user_data size */ );
 
        data.core = pw_context_connect(data.context, NULL /* properties */ ,
                                  0 /* user_data size */ );
 
        data.registry = pw_core_get_registry(data.core, PW_VERSION_REGISTRY,
                                        0 /* user_data size */ );
 
        pw_registry_add_listener(data.registry, &data.registry_listener,
                                 &registry_events, &data);

        pw_main_loop_run(data.loop);
 
        pw_proxy_destroy((struct pw_proxy *)data.node);
        pw_proxy_destroy((struct pw_proxy *)data.registry);
        pw_core_disconnect(data.core);
        pw_context_destroy(data.context);
        pw_main_loop_destroy(data.loop);
 
        return 0;
}