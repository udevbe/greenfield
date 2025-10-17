
var setEnv = function() {
    ENV.FONTCONFIG_PATH="/etc/fonts"
    ENV.GSK_RENDERER="cairo"
}

Module.preRun = Module.preRun ? [...Module.preRun, setEnv] : [setEnv]
