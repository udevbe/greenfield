#include <assert.h>
#include <string.h>
#include "wayland-server/wayland-server-core.h"
#include "addon.h"

void addon_set_init(struct addon_set *set) {
	memset(set, 0, sizeof(*set));
	wl_list_init(&set->addons);
}

void addon_set_finish(struct addon_set *set) {
	struct addon *addon, *tmp;
	wl_list_for_each_safe(addon, tmp, &set->addons, link) {
		addon->impl->destroy(addon);
	}
}

void addon_init(struct addon *addon, struct addon_set *set,
		const void *owner, const struct addon_interface *impl) {
	assert(owner && impl);
	memset(addon, 0, sizeof(*addon));
	struct addon *iter;
	wl_list_for_each(iter, &set->addons, link) {
		if (iter->owner == addon->owner && iter->impl == addon->impl) {
			assert(0 && "Can't have two addons of the same type with the same owner");
		}
	}
	wl_list_insert(&set->addons, &addon->link);
	addon->owner = owner;
	addon->impl = impl;
}

void addon_finish(struct addon *addon) {
	wl_list_remove(&addon->link);
}

struct addon *addon_find(struct addon_set *set, const void *owner,
		const struct addon_interface *impl) {
	struct addon *addon;
	wl_list_for_each(addon, &set->addons, link) {
		if (addon->owner == owner && addon->impl == impl) {
			return addon;
		}
	}
	return NULL;
}
