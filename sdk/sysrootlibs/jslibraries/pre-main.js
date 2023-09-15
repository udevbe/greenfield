
var waylandConnectionTask = function() {
    ENV.XDG_RUNTIME_DIR = "/", ENV.WAYLAND_DEBUG = "0", ENV.XKB_CONFIG_ROOT = "/"
    addOnPreMain(function () {
        Module['messageport']['on']('connect', ({path, port}) => {
            window.parent.postMessage({
                type: 'Connect',
                messagePort: port,
            }, '*', [port])
        });
    })
}

Module.preRun = Module.preRun ? [...Module.preRun, waylandConnectionTask] : [waylandConnectionTask]
