/*
 * Copyright © 2012 Kristian Høgsberg
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

#include <stdbool.h>
#include <stdlib.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include <assert.h>
#include <errno.h>

#include <libweston/config-parser.h>
#include "string-helpers.h"

static bool
handle_option(const struct weston_option *option, char *value)
{
	char* p;

	switch (option->type) {
	case WESTON_OPTION_INTEGER:
		if (!safe_strtoint(value, option->data))
			return false;
		return true;
	case WESTON_OPTION_UNSIGNED_INTEGER:
		errno = 0;
		* (uint32_t *) option->data = strtoul(value, &p, 10);
		if (errno != 0 || p == value || *p != '\0')
			return false;
		return true;
	case WESTON_OPTION_STRING:
		* (char **) option->data = strdup(value);
		return true;
	default:
		assert(0);
		return false;
	}
}

static bool
long_option(const struct weston_option *options, int count, char *arg)
{
	int k, len;

	for (k = 0; k < count; k++) {
		if (!options[k].name)
			continue;

		len = strlen(options[k].name);
		if (strncmp(options[k].name, arg + 2, len) != 0)
			continue;

		if (options[k].type == WESTON_OPTION_BOOLEAN) {
			if (!arg[len + 2]) {
				* (bool *) options[k].data = true;

				return true;
			}
		} else if (arg[len+2] == '=') {
			return handle_option(options + k, arg + len + 3);
		}
	}

	return false;
}

static bool
long_option_with_arg(const struct weston_option *options, int count, char *arg,
		     char *param)
{
	int k, len;

	for (k = 0; k < count; k++) {
		if (!options[k].name)
			continue;

		len = strlen(options[k].name);
		if (strncmp(options[k].name, arg + 2, len) != 0)
			continue;

		/* Since long_option() should handle all booleans, we should
		 * never reach this
		 */
		assert(options[k].type != WESTON_OPTION_BOOLEAN);

		return handle_option(options + k, param);
	}

	return false;
}

static bool
short_option(const struct weston_option *options, int count, char *arg)
{
	int k;

	if (!arg[1])
		return false;

	for (k = 0; k < count; k++) {
		if (options[k].short_name != arg[1])
			continue;

		if (options[k].type == WESTON_OPTION_BOOLEAN) {
			if (!arg[2]) {
				* (bool *) options[k].data = true;

				return true;
			}
		} else if (arg[2]) {
			return handle_option(options + k, arg + 2);
		} else {
			return false;
		}
	}

	return false;
}

static bool
short_option_with_arg(const struct weston_option *options, int count, char *arg, char *param)
{
	int k;

	if (!arg[1])
		return false;

	for (k = 0; k < count; k++) {
		if (options[k].short_name != arg[1])
			continue;

		if (options[k].type == WESTON_OPTION_BOOLEAN)
			continue;

		return handle_option(options + k, param);
	}

	return false;
}

int
parse_options(const struct weston_option *options,
	      int count, int *argc, char *argv[])
{
	int i, j;

	for (i = 1, j = 1; i < *argc; i++) {
		if (argv[i][0] == '-') {
			if (argv[i][1] == '-') {
				/* Long option, e.g. --foo or --foo=bar */
				if (long_option(options, count, argv[i]))
					continue;

				/* ...also handle --foo bar */
				if (i + 1 < *argc &&
				    long_option_with_arg(options, count,
							 argv[i], argv[i+1])) {
					i++;
					continue;
				}
			} else {
				/* Short option, e.g -f or -f42 */
				if (short_option(options, count, argv[i]))
					continue;

				/* ...also handle -f 42 */
				if (i+1 < *argc &&
				    short_option_with_arg(options, count, argv[i], argv[i+1])) {
					i++;
					continue;
				}
			}
		}
		argv[j++] = argv[i];
	}
	argv[j] = NULL;
	*argc = j;

	return j;
}
