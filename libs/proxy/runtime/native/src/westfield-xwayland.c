#include "westfield-xwayland.h"
#include <sys/types.h>
#include <unistd.h>

#include <stdlib.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/un.h>
#include <fcntl.h>
#include <errno.h>
#include <signal.h>
#include <assert.h>
#include "wayland-server/wayland-util.h"

struct westfield_process;

typedef void (*westfield_process_cleanup_func_t)(struct westfield_process *process,
                                                 int status);

struct westfield_process {
    pid_t pid;
    westfield_process_cleanup_func_t cleanup;
    struct wl_list link;
};

struct westfield_xserver {
    void *user_data;
    struct wl_display *wl_display;
    struct wl_event_loop *loop;
    struct wl_event_source *unix_source;
    westfield_xserver_starting_func_t starting_func;
    westfield_xserver_destroyed_func_t destroyed_func;
    struct westfield_xwayland *xwayland;
    int unix_fd;
    int display;
    pid_t pid;
};

static struct wl_list child_process_list;

struct westfield_xwayland {
    struct wl_display *wl_display;
    struct westfield_xserver *xserver;
    int wm_fd;
    int display_fd;
    struct westfield_process process;
};

static struct wl_list child_process_list;

int
westfield_xwayland_get_display(struct westfield_xwayland *westfield_xwayland) {
    return westfield_xwayland->xserver->display;
}

static void
westfield_watch_process(struct westfield_process *process) {
    wl_list_insert(&child_process_list, &process->link);
}

static void
westfield_xserver_shutdown(struct westfield_xserver *wxs) {
    char path[256];

    snprintf(path, sizeof path, "/tmp/.X%d-lock", wxs->display);
    unlink(path);
    snprintf(path, sizeof path, "/tmp/.X11-unix/X%d", wxs->display);
    unlink(path);
    if (wxs->pid == 0) {
        wl_event_source_remove(wxs->unix_source);
    }
    close(wxs->unix_fd);

    if (wxs->destroyed_func)
        wxs->destroyed_func(wxs->user_data);
    wxs->destroyed_func = NULL;
    wxs->loop = NULL;
}

static int
bind_to_unix_socket(int display) {
    struct sockaddr_un addr;
    socklen_t size, name_size;
    int fd;

    fd = socket(PF_LOCAL, SOCK_STREAM | SOCK_CLOEXEC, 0);
    if (fd < 0)
        return -1;

    addr.sun_family = AF_LOCAL;
    name_size = snprintf(addr.sun_path, sizeof addr.sun_path,
                         "/tmp/.X11-unix/X%d", display) + 1;
    size = offsetof(struct sockaddr_un, sun_path) + name_size;
    unlink(addr.sun_path);
    if (bind(fd, (struct sockaddr *) &addr, size) < 0) {
        printf("failed to bind to %s: %s\n", addr.sun_path,
               strerror(errno));
        close(fd);
        return -1;
    }

    if (listen(fd, 1) < 0) {
        unlink(addr.sun_path);
        close(fd);
        return -1;
    }

    return fd;
}

/* Convert string to integer
 *
 * Parses a base-10 number from the given string.  Checks that the
 * string is not blank, contains only numerical characters, and is
 * within the range of INT32_MIN to INT32_MAX.  If the validation is
 * successful the result is stored in *value; otherwise *value is
 * unchanged and errno is set appropriately.
 *
 * \return true if the number parsed successfully, false on error
 */
static inline bool
safe_strtoint(const char *str, int32_t *value)
{
    long ret;
    char *end;

    assert(str != NULL);

    errno = 0;
    ret = strtol(str, &end, 10);
    if (errno != 0) {
        return false;
    } else if (end == str || *end != '\0') {
        errno = EINVAL;
        return false;
    }

    if ((long)((int32_t)ret) != ret) {
        errno = ERANGE;
        return false;
    }
    *value = (int32_t)ret;

    return true;
}

static int
create_lockfile(int display, char *lockfile, size_t lsize) {
    /* 10 decimal characters, trailing LF and NUL byte; see comment
     * at end of function. */
    char pid[11];
    int fd, size;
    pid_t other;

    snprintf(lockfile, lsize, "/tmp/.X%d-lock", display);
    fd = open(lockfile, O_WRONLY | O_CLOEXEC | O_CREAT | O_EXCL, 0444);
    if (fd < 0 && errno == EEXIST) {
        fd = open(lockfile, O_CLOEXEC | O_RDONLY);
        if (fd < 0 || read(fd, pid, 11) != 11) {
            printf("can't read lock file %s: %s\n",
                   lockfile, strerror(errno));
            if (fd >= 0)
                close(fd);

            errno = EEXIST;
            return -1;
        }

        /* Trim the trailing LF, or at least ensure it's NULL. */
        pid[10] = '\0';

        if (!safe_strtoint(pid, &other)) {
            printf("can't parse lock file %s\n",
                   lockfile);
            close(fd);
            errno = EEXIST;
            return -1;
        }

        if (kill(other, 0) < 0 && errno == ESRCH) {
            /* stale lock file; unlink and try again */
            printf("unlinking stale lock file %s\n", lockfile);
            close(fd);
            if (unlink(lockfile))
                /* If we fail to unlink, return EEXIST
                   so we try the next display number.*/
                errno = EEXIST;
            else
                errno = EAGAIN;
            return -1;
        }

        close(fd);
        errno = EEXIST;
        return -1;
    } else if (fd < 0) {
        printf("failed to create lock file %s: %s\n",
               lockfile, strerror(errno));
        return -1;
    }

    /* Subtle detail: we use the pid of the wayland compositor, not the
     * xserver in the lock file.
     * Also subtle is that we don't emit a trailing NUL to the file, so
     * our size here is 11 rather than 12. */
    size = dprintf(fd, "%10d\n", getpid());
    if (size != 11) {
        unlink(lockfile);
        close(fd);
        return -1;
    }

    close(fd);

    return 0;
}

void
westfield_xwayland_teardown(struct westfield_xwayland *wxw) {
    struct westfield_xserver *wxs = wxw->xserver;
    if (!wxs)
        return;

    if (wxs->loop)
        westfield_xserver_shutdown(wxs);

    free(wxs);
    free(wxw);
}


static pid_t
spawn_xserver(void *user_data, const char *display, int unix_fd) {
    struct westfield_xwayland *wxw = user_data;
    pid_t pid;
    char s[12], unix_fd_str[12], wm_fd_str[12];
    char display_fd_str[12];
    int sv[2], wm[2], fd, display_fd[2];

    if (socketpair(AF_UNIX, SOCK_STREAM | SOCK_CLOEXEC, 0, sv) < 0) {
        printf("wl connection socketpair failed\n");
        return 1;
    }

    if (socketpair(AF_UNIX, SOCK_STREAM | SOCK_CLOEXEC, 0, wm) < 0) {
        printf("X wm connection socketpair failed\n");
        return 1;
    }

    if (pipe(display_fd) < 0) {
        return 1;
    }

    if (fcntl(display_fd[0], F_SETFD, FD_CLOEXEC) != 0) {
        return 1;
    }

    wxw->display_fd = display_fd[0];
    wxw->wm_fd = wm[0];
    struct wl_client *client = wl_client_create(wxw->wl_display, sv[0]);
    wxw->xserver->starting_func(wxw->xserver->user_data, wxw->wm_fd, client, wxw->display_fd);

    pid = fork();
    switch (pid) {
        case 0:
            dup2(1, 2);
            /* SOCK_CLOEXEC closes both ends, so we need to unset
             * the flag on the client fd. */
            fd = dup(sv[1]);
            if (fd < 0) {
                goto fail;
            }
            snprintf(s, sizeof s, "%d", fd);
            setenv("WAYLAND_SOCKET", s, 1);

            fd = dup(unix_fd);
            if (fd < 0) {
                goto fail;
            }
            snprintf(unix_fd_str, sizeof unix_fd_str, "%d", fd);
            fd = dup(wm[1]);
            if (fd < 0) {
                goto fail;
            }
            snprintf(wm_fd_str, sizeof wm_fd_str, "%d", fd);
            snprintf(display_fd_str, sizeof display_fd_str, "%d", display_fd[1]);

            if (execlp("Xwayland",
                       "Xwayland",
                       display,
                       "-ac",
                       "-rootless",
                       "-listen", unix_fd_str,
                       "-displayfd", display_fd_str,
                       "-wm", wm_fd_str,
                       (char *) NULL) < 0)
                printf("exec of '%s %s -ac -rootless "
                       "-listen %s -displayfd %s -wm %s "
                       "' failed: %s\n",
                       "XWayland",
                       display,
                       unix_fd_str,
                       display_fd_str,
                       wm_fd_str,
                       strerror(errno));
        fail:
            _exit(EXIT_FAILURE);

        default:
            close(sv[1]);
            close(wm[1]);

            /* During initialization the X server will round trip
             * and block on the wayland compositor, so avoid making
             * blocking requests (like xcb_connect_to_fd) until
             * it's done with that. */
            close(display_fd[1]);
            wxw->process.pid = pid;
            westfield_watch_process(&wxw->process);
            break;

        case -1:
            printf("Failed to fork to spawn xserver process\n");
            break;
    }

    return pid;
}

static int
westfield_xserver_handle_event(int listen_fd, uint32_t mask, void *data) {
    struct westfield_xserver *wxs = data;
    char display[8];

    snprintf(display, sizeof display, ":%d", wxs->display);

    wxs->pid = spawn_xserver(wxs->xwayland, display, wxs->unix_fd);
    if (wxs->pid == -1) {
        printf("Failed to spawn the Xwayland server\n");
        return 1;
    }

    printf("Spawned Xwayland server, pid %d\n", wxs->pid);
    wl_event_source_remove(wxs->unix_source);

    return 1;
}

static int
westfield_xserver_listen(struct westfield_xserver *wxs) {
    char lockfile[256], display_name[8];
    wxs->display = 1;
    retry:
    if (create_lockfile(wxs->display, lockfile, sizeof lockfile) < 0) {
        if (errno == EAGAIN) {
            goto retry;
        } else if (errno == EEXIST) {
            wxs->display++;
            goto retry;
        } else {
            free(wxs);
            return -1;
        }
    }

    wxs->unix_fd = bind_to_unix_socket(wxs->display);
    if (wxs->unix_fd < 0) {
        unlink(lockfile);
        free(wxs);
        return -1;
    }

    snprintf(display_name, sizeof display_name, ":%d", wxs->display);
    printf("xserver listening on display %s\n", display_name);
    setenv("DISPLAY", display_name, 1);

    wxs->loop = wl_display_get_event_loop(wxs->wl_display);
    wxs->unix_source =
            wl_event_loop_add_fd(wxs->loop, wxs->unix_fd,
                                 WL_EVENT_READABLE,
                                 westfield_xserver_handle_event, wxs);
    return 0;
}


static void
westfield_xserver_exited(struct westfield_xserver *wxs,
                         int exit_status) {
    wxs->pid = 0;

    wxs->unix_source =
            wl_event_loop_add_fd(wxs->loop, wxs->unix_fd,
                                 WL_EVENT_READABLE,
                                 westfield_xserver_handle_event, wxs);

    // for now this if condition will always be true as we don't clear starting_func.
    // FIXME when should we clear starting_func ?
    if (wxs->starting_func) {
        /* If the X server crashes before it binds to the
         * xserver interface, shut down and don't try
         * again. */
        printf("xserver crashing too fast: %d\n", exit_status);
        westfield_xserver_shutdown(wxs);
    } else {
        printf("xserver exited, code %d\n", exit_status);
        if (wxs->destroyed_func)
            wxs->destroyed_func(wxs->user_data);
        wxs->destroyed_func = NULL;
    }
}

static void
xserver_cleanup(struct westfield_process *process, int status) {
    struct westfield_xwayland *wxw;
    wxw = wl_container_of(process, wxw, process);

    westfield_xserver_exited(wxw->xserver, status);
}

struct westfield_xwayland *
westfield_xwayland_setup(struct wl_display *wl_display,
                         void *user_data,
                         westfield_xserver_starting_func_t starting_func,
                         westfield_xserver_destroyed_func_t destroyed_func) {
    sigset_t mask;
    struct westfield_xserver *westfield_xserver;
    struct westfield_xwayland *westfield_xwayland;

    sigemptyset(&mask);
    sigaddset(&mask, SIGPIPE);
    pthread_sigmask(SIG_BLOCK, &mask, NULL);

    westfield_xserver = calloc(sizeof *westfield_xserver, 1);
    if (westfield_xserver == NULL)
        return NULL;
    westfield_xserver->user_data = user_data;
    westfield_xserver->wl_display = (struct wl_display *) wl_display;
    westfield_xserver->starting_func = starting_func;
    westfield_xserver->destroyed_func = destroyed_func;

    westfield_xwayland = calloc(sizeof *westfield_xwayland, 1);
    if (!westfield_xwayland) {
        free(westfield_xserver);
        return NULL;
    }

    westfield_xserver->xwayland = westfield_xwayland;
    westfield_xwayland->wl_display = (struct wl_display *) wl_display;
    westfield_xwayland->xserver = westfield_xserver;
    westfield_xwayland->process.cleanup = xserver_cleanup;
    if (westfield_xserver_listen(westfield_xserver) < 0) {
        free(westfield_xserver);
        free(westfield_xwayland);
        return NULL;
    }

    return westfield_xwayland;
}

void
westfield_xwayland_init(void) {
    wl_list_init(&child_process_list);
}
