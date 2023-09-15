#ifndef WESTFIELD_WESTFIELD_UTIL_ADDON_H
#define WESTFIELD_WESTFIELD_UTIL_ADDON_H

#include "wayland-server/wayland-server-core.h"

struct addon_set {
	// private state
	struct wl_list addons;
};

struct addon;

struct addon_interface {
	const char *name;
	// Has to call wlr_addon_finish()
	void (*destroy)(struct addon *addon);
};

struct addon {
	const struct addon_interface *impl;
	// private state
	const void *owner;
	struct wl_list link;
};

void addon_set_init(struct addon_set *set);
void addon_set_finish(struct addon_set *set);

void addon_init(struct addon *addon, struct addon_set *set,
	const void *owner, const struct addon_interface *impl);
void addon_finish(struct addon *addon);

struct addon *addon_find(struct addon_set *set, const void *owner,
	const struct addon_interface *impl);

#endif
