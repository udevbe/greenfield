
var setEnv = function() {
    ENV.WESTON_DATA_DIR = "/data"
}

Module.preRun = Module.preRun ? [...Module.preRun, setEnv] : [setEnv]
