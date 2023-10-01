import { parseArgs, ParseArgsConfig } from 'node:util'
import { AppConfigSchema } from './app-config'
import { readFileSync } from 'node:fs'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import applicationSchema from './app-config-schema.json'

const ajv = new Ajv()
addFormats(ajv)
const validate = ajv.compile(applicationSchema)

type ArgValues = {
  help: boolean
  'basic-auth': string
  'bind-ip': string
  'bind-port': string
  'allow-origin': string
  'base-url': string
  'render-device': string
  encoder: 'x264' | 'nvh264' | 'vaapih264'
  applications: AppConfigSchema
}

const options: Record<keyof ArgValues, NonNullable<ParseArgsConfig['options']>[string]> = {
  help: {
    type: 'boolean',
    default: false,
    short: 'h',
  },
  'basic-auth': {
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
    default: 'http://localhost:8080',
  },
  'base-url': {
    type: 'string',
    default: 'ws://localhost:8081',
  },
  'render-device': {
    type: 'string',
    default: '/dev/dri/renderD128',
  },
  encoder: {
    type: 'string',
    default: 'x264',
  },
  applications: {
    type: 'string',
    default: '',
  },
}

const parseArgsConfig: ParseArgsConfig = {
  strict: true,
  allowPositionals: false,
  options,
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

function parseApplicationsArg(rawArg: string): ArgValues['applications'] {
  if (rawArg === '') {
    return {
      '/gtk4-demo': {
        name: 'GTK Demo',
        executable: 'gtk4-demo',
        args: [],
        env: {},
      },
    }
  }

  const applicationMappingFileContents = readFileSync(rawArg, 'utf8')
  const apps = JSON.parse(applicationMappingFileContents)
  const isValid = validate(apps)
  if (!isValid) {
    throw new Error(`Error validating --applications file: ${JSON.stringify(validate.errors)}`)
  }

  return apps as unknown as AppConfigSchema
}

const argMappers: Record<
  Extract<keyof ArgValues, 'encoder' | 'applications'>,
  (rawValue: any) => ArgValues[keyof ArgValues]
> = {
  encoder: parseEncoderArg,
  applications: parseApplicationsArg,
}

export const args = Object.fromEntries(
  Object.entries(parseArgs(parseArgsConfig).values).map(([key, value]) => {
    switch (key) {
      case 'encoder':
      case 'applications':
        return [key, argMappers[key](value)]
      default:
        return [key, value]
    }
  }),
) as ArgValues

Object.entries(options).forEach(([key, value]) => {
  // @ts-ignore
  args[key] = args[key] ?? value.default
})

export function printHelp() {
  console.log(`
Usage
  $ compositor-proxy <options>

Options
  --basic-auth=USER:PASSWORD                      Basic auth credentials to use when securing this proxy.
                                                      Optional.
  --bind-ip=IP                                    The ip or hostname to listen on.
                                                      Optional. Default: "0.0.0.0".
  --bind-port=PORT                                The port to listen on. 
                                                      Optional. Default "8081".
  --allow-origin=ORIGIN                           CORS allowed client origins, used when doing cross-origin requests. Value can be comma seperated domains. 
                                                      Optional. Default "localhost:8080".
  --base-url=URL                                  The public base url to use when other services connect to this endpoint. 
                                                      Optional. Default "ws://localhost:8081".
  --render-device=PATH                            Path of the render device that should be used for hardware acceleration. 
                                                      Optional. Default "/dev/dri/renderD128".
  --encoder=ENCODER                               The h264 encoder to use. "x264", "nvh264" and "vaapih264" are supported. 
                                                      "x264" is a pure software encoder. "nvh264" is a hw accelerated encoder for Nvidia based GPUs. 
                                                      "vaapih264" is an experimental encoder for intel GPUs.
                                                      Optional. Default "x264".
  --application=NAME:EXECUTABLE_PATH:HTTP_PATH    Maps an application with NAME and EXECUTABLE_PATH to an HTTP_PATH. This option can be repeated 
                                                      with different values to map multiple applications.
                                                      Optional. Default: "gtk4-demo:/gtk4-demo:/usr/bin/gtk4-demo".
  --help, -h                                      Print this help text.

 The environment variable "LOG_LEVEL" is used to set the logging level. Accepted values are: "fatal", "error", "warn", "info", "debug", "trace"

Examples
  $ compositor-proxy --basic-auth=myuser:supersecret --application=gtk4-demo:/gtk4-demo:/usr/bin/gtk4-demo
`)
}

const help = args['help']
if (help) {
  printHelp()
  process.exit(0)
}
