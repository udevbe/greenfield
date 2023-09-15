/*
 * Copyright © 2011 Intel Corporation
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice (including the
 * next paragraph) shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

#include "config.h"

#include <string.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include <ctype.h>
#include <limits.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <errno.h>

#include <wayland-util.h>
#include <libweston/zalloc.h>
#include <libweston/config-parser.h>
#include "helpers.h"
#include "string-helpers.h"
#include "os-compatibility.h"

struct weston_config_entry {
	char *key;
	char *value;
	struct wl_list link;
};

struct weston_config_section {
	char *name;
	struct wl_list entry_list;
	struct wl_list link;
};

struct weston_config {
	struct wl_list section_list;
	char path[PATH_MAX];
};

static int
open_config_file(struct weston_config *c, const char *name)
{
	const char *config_dir  = getenv("XDG_CONFIG_HOME");
	const char *home_dir	= getenv("HOME");
	const char *config_dirs = getenv("XDG_CONFIG_DIRS");
	const char *p, *next;
	int fd;

	if (name[0] == '/') {
		snprintf(c->path, sizeof c->path, "%s", name);
		return open(name, O_RDONLY | O_CLOEXEC);
	}

	/* Precedence is given to config files in the home directory,
	 * then to directories listed in XDG_CONFIG_DIRS. */

	/* $XDG_CONFIG_HOME */
	if (config_dir) {
		snprintf(c->path, sizeof c->path, "%s/%s", config_dir, name);
		fd = open(c->path, O_RDONLY | O_CLOEXEC);
		if (fd >= 0)
			return fd;
	}

	/* $HOME/.config */
	if (home_dir) {
		snprintf(c->path, sizeof c->path,
			 "%s/.config/%s", home_dir, name);
		fd = open(c->path, O_RDONLY | O_CLOEXEC);
		if (fd >= 0)
			return fd;
	}

	/* For each $XDG_CONFIG_DIRS: weston/<config_file> */
	if (!config_dirs)
		config_dirs = "/etc/xdg";  /* See XDG base dir spec. */

	for (p = config_dirs; *p != '\0'; p = next) {
		next = strchrnul(p, ':');
		snprintf(c->path, sizeof c->path,
			 "%.*s/weston/%s", (int)(next - p), p, name);
		fd = open(c->path, O_RDONLY | O_CLOEXEC);
		if (fd >= 0)
			return fd;

		if (*next == ':')
			next++;
	}

	return -1;
}

static struct weston_config_entry *
config_section_get_entry(struct weston_config_section *section,
			 const char *key)
{
	struct weston_config_entry *e;

	if (section == NULL)
		return NULL;
	wl_list_for_each(e, &section->entry_list, link)
		if (strcmp(e->key, key) == 0)
			return e;

	return NULL;
}

WL_EXPORT struct weston_config_section *
weston_config_get_section(struct weston_config *config, const char *section,
			  const char *key, const char *value)
{
	struct weston_config_section *s;
	struct weston_config_entry *e;

	if (config == NULL)
		return NULL;
	wl_list_for_each(s, &config->section_list, link) {
		if (strcmp(s->name, section) != 0)
			continue;
		if (key == NULL)
			return s;
		e = config_section_get_entry(s, key);
		if (e && strcmp(e->value, value) == 0)
			return s;
	}

	return NULL;
}

WL_EXPORT int
weston_config_section_get_int(struct weston_config_section *section,
			      const char *key,
			      int32_t *value, int32_t default_value)
{
	struct weston_config_entry *entry;

	entry = config_section_get_entry(section, key);
	if (entry == NULL) {
		*value = default_value;
		errno = ENOENT;
		return -1;
	}

	if (!safe_strtoint(entry->value, value)) {
		*value = default_value;
		return -1;
	}

	return 0;
}

WL_EXPORT int
weston_config_section_get_uint(struct weston_config_section *section,
			       const char *key,
			       uint32_t *value, uint32_t default_value)
{
	long int ret;
	struct weston_config_entry *entry;
	char *end;

	entry = config_section_get_entry(section, key);
	if (entry == NULL) {
		*value = default_value;
		errno = ENOENT;
		return -1;
	}

	errno = 0;
	ret = strtol(entry->value, &end, 0);
	if (errno != 0 || end == entry->value || *end != '\0') {
		*value = default_value;
		errno = EINVAL;
		return -1;
	}

	/* check range */
	if (ret < 0 || ret > INT_MAX) {
		*value = default_value;
		errno = ERANGE;
		return -1;
	}

	*value = ret;

	return 0;
}

WL_EXPORT int
weston_config_section_get_color(struct weston_config_section *section,
				const char *key,
				uint32_t *color, uint32_t default_color)
{
	struct weston_config_entry *entry;
	int len;
	char *end;

	entry = config_section_get_entry(section, key);
	if (entry == NULL) {
		*color = default_color;
		errno = ENOENT;
		return -1;
	}

	len = strlen(entry->value);
	if (len == 1 && entry->value[0] == '0') {
		*color = 0;
		return 0;
	} else if (len != 8 && len != 10) {
		*color = default_color;
		errno = EINVAL;
		return -1;
	}

	errno = 0;
	*color = strtoul(entry->value, &end, 16);
	if (errno != 0 || end == entry->value || *end != '\0') {
		*color = default_color;
		errno = EINVAL;
		return -1;
	}

	return 0;
}

WL_EXPORT int
weston_config_section_get_double(struct weston_config_section *section,
				 const char *key,
				 double *value, double default_value)
{
	struct weston_config_entry *entry;
	char *end;

	entry = config_section_get_entry(section, key);
	if (entry == NULL) {
		*value = default_value;
		errno = ENOENT;
		return -1;
	}

	*value = strtod(entry->value, &end);
	if (*end != '\0') {
		*value = default_value;
		errno = EINVAL;
		return -1;
	}

	return 0;
}

WL_EXPORT int
weston_config_section_get_string(struct weston_config_section *section,
				 const char *key,
				 char **value, const char *default_value)
{
	struct weston_config_entry *entry;

	entry = config_section_get_entry(section, key);
	if (entry == NULL) {
		if (default_value)
			*value = strdup(default_value);
		else
			*value = NULL;
		errno = ENOENT;
		return -1;
	}

	*value = strdup(entry->value);

	return 0;
}

WL_EXPORT int
weston_config_section_get_bool(struct weston_config_section *section,
			       const char *key,
			       bool *value, bool default_value)
{
	struct weston_config_entry *entry;

	entry = config_section_get_entry(section, key);
	if (entry == NULL) {
		*value = default_value;
		errno = ENOENT;
		return -1;
	}

	if (strcmp(entry->value, "false") == 0)
		*value = false;
	else if (strcmp(entry->value, "true") == 0)
		*value = true;
	else {
		*value = default_value;
		errno = EINVAL;
		return -1;
	}

	return 0;
}

WL_EXPORT const char *
weston_config_get_name_from_env(void)
{
	const char *name;

	name = getenv(WESTON_CONFIG_FILE_ENV_VAR);
	if (name)
		return name;

	return "weston.ini";
}

static struct weston_config_section *
config_add_section(struct weston_config *config, const char *name)
{
	struct weston_config_section *section;

	section = zalloc(sizeof *section);
	if (section == NULL)
		return NULL;

	section->name = strdup(name);
	if (section->name == NULL) {
		free(section);
		return NULL;
	}

	wl_list_init(&section->entry_list);
	wl_list_insert(config->section_list.prev, &section->link);

	return section;
}

static struct weston_config_entry *
section_add_entry(struct weston_config_section *section,
		  const char *key, const char *value)
{
	struct weston_config_entry *entry;

	entry = zalloc(sizeof *entry);
	if (entry == NULL)
		return NULL;

	entry->key = strdup(key);
	if (entry->key == NULL) {
		free(entry);
		return NULL;
	}

	entry->value = strdup(value);
	if (entry->value == NULL) {
		free(entry->key);
		free(entry);
		return NULL;
	}

	wl_list_insert(section->entry_list.prev, &entry->link);

	return entry;
}

static bool
weston_config_parse_internal(struct weston_config *config, FILE *fp)
{
	struct weston_config_section *section = NULL;
	char line[512], *p;
	int i;

	wl_list_init(&config->section_list);

	while (fgets(line, sizeof line, fp)) {
		switch (line[0]) {
		case '#':
		case '\n':
			continue;
		case '[':
			p = strchr(&line[1], ']');
			if (!p || p[1] != '\n') {
				fprintf(stderr, "malformed "
					"section header: %s\n", line);
				return false;
			}
			p[0] = '\0';
			section = config_add_section(config, &line[1]);
			continue;
		default:
			p = strchr(line, '=');
			if (!p || p == line || !section) {
				fprintf(stderr, "malformed "
					"config line: %s\n", line);
				return false;
			}

			p[0] = '\0';
			p++;
			while (isspace(*p))
				p++;
			i = strlen(p);
			while (i > 0 && isspace(p[i - 1])) {
				p[i - 1] = '\0';
				i--;
			}
			section_add_entry(section, line, p);
			continue;
		}
	}

	return true;
}

WESTON_EXPORT_FOR_TESTS struct weston_config *
weston_config_parse_fp(FILE *file)
{
	struct weston_config *config = zalloc(sizeof(*config));

	if (config == NULL)
		return NULL;

	if (!weston_config_parse_internal(config, file)) {
		weston_config_destroy(config);
		return NULL;
	}

	return config;
}

WL_EXPORT struct weston_config *
weston_config_parse(const char *name)
{
	FILE *fp;
	struct stat filestat;
	struct weston_config *config;
	int fd;
	bool ret;

	config = zalloc(sizeof *config);
	if (config == NULL)
		return NULL;

	fd = open_config_file(config, name);
	if (fd == -1) {
		free(config);
		return NULL;
	}

	if (fstat(fd, &filestat) < 0 ||
	    !S_ISREG(filestat.st_mode)) {
		close(fd);
		free(config);
		return NULL;
	}

	fp = fdopen(fd, "r");
	if (fp == NULL) {
		close(fd);
		free(config);
		return NULL;
	}

	ret = weston_config_parse_internal(config, fp);

	fclose(fp);

	if (!ret) {
		weston_config_destroy(config);
		return NULL;
	}

	return config;
}

WL_EXPORT const char *
weston_config_get_full_path(struct weston_config *config)
{
	return config == NULL ? NULL : config->path;
}

WL_EXPORT int
weston_config_next_section(struct weston_config *config,
			   struct weston_config_section **section,
			   const char **name)
{
	if (config == NULL)
		return 0;

	if (*section == NULL)
		*section = container_of(config->section_list.next,
					struct weston_config_section, link);
	else
		*section = container_of((*section)->link.next,
					struct weston_config_section, link);

	if (&(*section)->link == &config->section_list)
		return 0;

	*name = (*section)->name;

	return 1;
}

WL_EXPORT void
weston_config_destroy(struct weston_config *config)
{
	struct weston_config_section *s, *next_s;
	struct weston_config_entry *e, *next_e;

	if (config == NULL)
		return;

	wl_list_for_each_safe(s, next_s, &config->section_list, link) {
		wl_list_for_each_safe(e, next_e, &s->entry_list, link) {
			free(e->key);
			free(e->value);
			free(e);
		}
		free(s->name);
		free(s);
	}

	free(config);
}
