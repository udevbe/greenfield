/*
 * Copyright 2022 Collabora, Ltd.
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

#include <assert.h>
#include <ctype.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#include <wayland-util.h>

#include "helpers.h"
#include "os-compatibility.h"
#include "process-util.h"
#include "string-helpers.h"

extern char **environ; /* defined by libc */

void
fdstr_update_str1(struct fdstr *s)
{
	snprintf(s->str1, sizeof(s->str1), "%d", s->fds[1]);
}

void
fdstr_set_fd1(struct fdstr *s, int fd)
{
	s->fds[0] = -1;
	s->fds[1] = fd;
	fdstr_update_str1(s);
}

bool
fdstr_clear_cloexec_fd1(struct fdstr *s)
{
	return os_fd_clear_cloexec(s->fds[1]) >= 0;
}

void
fdstr_close_all(struct fdstr *s)
{
	unsigned i;

	for (i = 0; i < ARRAY_LENGTH(s->fds); i++) {
		close(s->fds[i]);
		s->fds[i] = -1;
	}
}

void
custom_env_init_from_environ(struct custom_env *env)
{
	char **it;
	char **ep;

	wl_array_init(&env->envp);
	env->env_finalized = false;
	wl_array_init(&env->argp);
	env->arg_finalized = false;

	for (it = environ; *it; it++) {
		ep = wl_array_add(&env->envp, sizeof *ep);
		assert(ep);
		*ep = strdup(*it);
		assert(*ep);
	}
}

void
custom_env_fini(struct custom_env *env)
{
	char **p;

	wl_array_for_each(p, &env->envp)
		free(*p);
	wl_array_release(&env->envp);

	wl_array_for_each(p, &env->argp)
		free(*p);
	wl_array_release(&env->argp);
}

static char **
custom_env_get_env_var(struct custom_env *env, const char *name)
{
	char **ep;
	size_t name_len = strlen(name);

	wl_array_for_each(ep, &env->envp) {
		char *entry = *ep;

		if (strncmp(entry, name, name_len) == 0 &&
		    entry[name_len] == '=') {
			return ep;
		}
	}

	return NULL;
}

void
custom_env_add_arg(struct custom_env *env, const char *arg)
{
	char **ap;

	assert(!env->arg_finalized);

	ap = wl_array_add(&env->argp, sizeof *ap);
	assert(ap);

	*ap = strdup(arg);
	assert(*ap);
}

void
custom_env_set_env_var(struct custom_env *env, const char *name, const char *value)
{
	char **ep;

	assert(strchr(name, '=') == NULL);
	assert(!env->env_finalized);

	ep = custom_env_get_env_var(env, name);
	if (ep)
		free(*ep);
	else
		ep = wl_array_add(&env->envp, sizeof *ep);
	assert(ep);

	str_printf(ep, "%s=%s", name, value);
	assert(*ep);
}

/**
 * Add information from a parsed exec string to a custom_env
 *
 * An 'exec string' is a string in the format:
 *   ENVFOO=bar ENVBAR=baz /path/to/exec --arg anotherarg
 *
 * This function will parse such a string and add the specified environment
 * variables (in the format KEY=value) up until it sees a non-environment
 * string, after which point every entry will be interpreted as a new
 * argument.
 *
 * Entries are space-separated; there is no support for quoting.
 */
void
custom_env_add_from_exec_string(struct custom_env *env, const char *exec_str)
{
	char *dup_path = strdup(exec_str);
	char *start = dup_path;

	assert(dup_path);

	/* Build the environment array (if any) by handling any number of
	 * equal-separated key=value at the start of the string, split by
	 * spaces; uses "foo=bar  baz=quux meh argh" as the example, where
	 * "foo=bar" and "baz=quux" should go into the environment, and
	 * "meh" should be executed with "argh" as its first argument */
	while (*start) {
		char *k = NULL, *v = NULL;
		char *p;

		/* Leaves us with "foo\0bar  baz=quux meh argh", with k pointing
		 * to "foo" and v pointing to "bar  baz=quux meh argh" */
		for (p = start; *p && !isspace(*p); p++) {
			if (*p == '=') {
				*p++ = '\0';
				k = start;
				v = p;
				break;
			}
		}

		if (!v)
			break;

		/* Walk to the next space or NUL, filling any trailing spaces
		 * with NUL, to give us "foo\0bar\0\0baz=quux meh argh".
		 * k will point to "foo", v will point to "bar", and
		 * start will point to "baz=quux meh argh". */
		while (*p && !isspace(*p))
			p++;
		while (*p && isspace(*p))
			*p++ = '\0';
		start = p;

		custom_env_set_env_var(env, k, v);
	}

	/* Now build the argv array by splitting on spaces */
	while (*start) {
		char *p;
		bool valid = false;

		for (p = start; *p && !isspace(*p); p++)
			valid = true;

		if (!valid)
			break;

		while (*p && isspace(*p))
			*p++ = '\0';

		custom_env_add_arg(env, start);
		start = p;
	}

	free(dup_path);
}

char *const *
custom_env_get_envp(struct custom_env *env)
{
	char **ep;

	assert(!env->env_finalized);

	/* add terminating NULL */
	ep = wl_array_add(&env->envp, sizeof *ep);
	assert(ep);
	*ep = NULL;

	env->env_finalized = true;

	return env->envp.data;
}

char *const *
custom_env_get_argp(struct custom_env *env)
{
	char **ap;

	assert(!env->arg_finalized);

	/* add terminating NULL */
	ap = wl_array_add(&env->argp, sizeof *ap);
	assert(ap);
	*ap = NULL;

	env->arg_finalized = true;

	return env->argp.data;
}
