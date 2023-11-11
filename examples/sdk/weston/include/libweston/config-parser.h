/*
 * Copyright © 2008 Kristian Høgsberg
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

#ifndef CONFIGPARSER_H
#define CONFIGPARSER_H

#ifdef  __cplusplus
extern "C" {
#endif

#include <stdbool.h>
#include <stdint.h>

#define WESTON_CONFIG_FILE_ENV_VAR "WESTON_CONFIG_FILE"

enum weston_option_type {
	WESTON_OPTION_INTEGER,
	WESTON_OPTION_UNSIGNED_INTEGER,
	WESTON_OPTION_STRING,
	WESTON_OPTION_BOOLEAN
};

struct weston_option {
	enum weston_option_type type;
	const char *name;
	char short_name;
	void *data;
};

int
parse_options(const struct weston_option *options,
	      int count, int *argc, char *argv[]);

struct weston_config_section;
struct weston_config;

struct weston_config_section *
weston_config_get_section(struct weston_config *config, const char *section,
			  const char *key, const char *value);
int
weston_config_section_get_int(struct weston_config_section *section,
			      const char *key,
			      int32_t *value, int32_t default_value);
int
weston_config_section_get_uint(struct weston_config_section *section,
			       const char *key,
			       uint32_t *value, uint32_t default_value);
int
weston_config_section_get_color(struct weston_config_section *section,
				const char *key,
				uint32_t *color, uint32_t default_color);
int
weston_config_section_get_double(struct weston_config_section *section,
				 const char *key,
				 double *value, double default_value);
int
weston_config_section_get_string(struct weston_config_section *section,
				 const char *key,
				 char **value,
				 const char *default_value);
int
weston_config_section_get_bool(struct weston_config_section *section,
			       const char *key,
			       bool *value, bool default_value);

const char *
weston_config_get_name_from_env(void);

struct weston_config *
weston_config_parse_fp(FILE *file);

struct weston_config *
weston_config_parse(const char *name);

const char *
weston_config_get_full_path(struct weston_config *config);

void
weston_config_destroy(struct weston_config *config);

int weston_config_next_section(struct weston_config *config,
			       struct weston_config_section **section,
			       const char **name);

#ifdef  __cplusplus
}
#endif

#endif /* CONFIGPARSER_H */
