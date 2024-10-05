
var setEnv = function() {
    ENV.FONTCONFIG_PATH="/etc/fonts"
}

Module.preRun = Module.preRun ? [...Module.preRun, setEnv] : [setEnv]
