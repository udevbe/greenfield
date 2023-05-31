import { parseArgs, ParseArgsConfig } from 'util'

type ArgValues = {
  help: boolean
  'session-id': string | undefined
  'bind-ip': string
  'bind-port': string
  'allow-origin': string
  'base-url': string
  'render-device': string
  encoder: 'x264' | 'nvh264' | 'vaapih264'
  application: Record<string, { path: string; executable: string }>
}

const options: Record<keyof ArgValues, NonNullable<ParseArgsConfig['options']>[string]> = {
  help: {
    type: 'boolean',
    default: false,
    short: 'h',
  },
  'session-id': {
    type: 'string',
  },
  'bind-ip': {
    type: 'string',
    default: '0.0.0.0',
  },
  'bind-port': {
    type: 'string',
    default: '8081',
  },
  'allow-origin': {
    type: 'string',
    default: '*',
  },
  'base-url': {
    type: 'string',
    default: 'http://localhost:8081',
  },
  'render-device': {
    type: 'string',
    default: '/dev/dri/renderD128',
  },
  encoder: {
    type: 'string',
    default: 'x264',
  },
  application: {
    type: 'string',
    multiple: true,
    default: ['gtk4-demo:/usr/bin/gtk4-demo:/gtk4-demo'],
  },
}

const parseArgsConfig: ParseArgsConfig = {
  strict: true,
  allowPositionals: false,
  options,
}

function parseApplicationArg(rawArg: string[]): ArgValues['application'] {
  const applicationValue: ArgValues['application'] = {}
  for (const rawEntry of rawArg) {
    const values = rawEntry.trim().split(':')
    if (values.length !== 3) {
      console.error('Invalid argument for "application"')
      printHelp()
      process.exit(1)
    }

    const [name, executable, path] = values
    applicationValue[name] = { executable, path }
  }
  return applicationValue
}

function parseEncoderArg(rawArg: string): ArgValues['encoder'] {
  switch (rawArg) {
    case 'x264':
    case 'nvh264':
    case 'vaapih264':
      return rawArg
    default: {
      console.error('Invalid argument for "encoder"')
      printHelp()
      process.exit(1)
    }
  }
}

const argMappers: Record<
  Extract<keyof ArgValues, 'encoder' | 'application'>,
  (rawValue: any) => ArgValues[keyof ArgValues]
> = {
  encoder: parseEncoderArg,
  application: parseApplicationArg,
}

export const args = Object.fromEntries(
  Object.entries(parseArgs(parseArgsConfig).values).map(([key, value]) => {
    switch (key) {
      case 'encoder':
      case 'application':
        return [key, argMappers[key](value)]
      default:
        return [key, value]
    }
  }),
) as ArgValues

export function printHelp() {
  console.log(`
\tUsage
\t  $ compositor-proxy --session-id=SESSION-ID <options>

\tOptions
\t  --session-id=SESSION-ID                         Use and accept this and only this session id when communicating.
\t                                                      Mandatory.
\t  --bind-ip=IP                                    The ip or hostname to listen on.
\t                                                      Optional. Default: "0.0.0.0".c
\t  --bind-port=PORT                                The port to listen on. 
\t                                                      Optional. Default "8081".
\t  --allow-origin=ORIGIN                           CORS allowed origins, used when doing cross-origin requests. Value can be * or comma seperated domains. 
\t                                                      Optional. Default "*".
\t  --base-url=URL                                  The public base url to use when other services connect to this endpoint. 
\t                                                      Optional. Default "http://localhost:8081".
\t  --render-device=PATH                            Path of the render device that should be used for hardware acceleration. 
\t                                                      Optional. Default "/dev/dri/renderD128".
\t  --encoder=ENCODER                               The h264 encoder to use. "x264", "nvh264" and "vaapih264" are supported. 
\t                                                      "x264" is a pure software encoder. "nvh264" is a hw accelerated encoder for Nvidia based GPUs. 
\t                                                      "vaapih264" is an experimental encoder for intel GPUs.
\t                                                      Optional. Default "x264".
\t  --application=NAME:EXECUTABLE_PATH:HTTP_PATH    Maps an application with NAME and EXECUTABLE_PATH to an HTTP_PATH. This option can be repeated 
\t                                                      with different values to map multiple applications.
\t                                                      Optional. Default: "gtk4-demo:/gtk4-demo:/usr/bin/gtk4-demo".
\t  --help, -h                                      Print this help text.
\t
\t The environment variable "LOG_LEVEL" is used to set the logging level. Accepted values are: "fatal", "error", "warn", "info", "debug", "trace"
\t
\tExamples
\t  $ compositor-proxy --session-id=test123 --application=gtk4-demo:/gtk4-demo:/usr/bin/gtk4-demo
  `)
}

const help = args['help']
if (help) {
  printHelp()
  process.exit(0)
}
