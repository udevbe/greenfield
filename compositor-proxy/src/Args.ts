const argv = [...process.argv.slice(2)]

function consumeArg(arg: string) {
  const i = argv.indexOf(arg)
  if (i >= 0) {
    argv.splice(i, 1)
  }
}

function parseArgValue<T extends keyof ArgTypes>(
  key: T,
  defaultValue: ArgTypes[T] = null,
): { [key in T]: ArgTypes[T] } {
  // Return true if the key exists and a value is defined
  const booleanArg = `--${key}`
  if (argv.includes(booleanArg)) {
    consumeArg(booleanArg)
    // @ts-ignore
    return { [`${key}`]: true }
  }

  const valueArg = argv.find((element) => element.startsWith(`--${key}=`))
  // Return null if the key does not exist and a value is not defined
  if (valueArg === undefined) {
    // @ts-ignore
    return { [`${key}`]: defaultValue }
  }

  consumeArg(valueArg)
  // @ts-ignore
  return { [`${key}`]: valueArg.replace(`--${key}=`, '') }
}

type BooleanValue = boolean | null
type StringValue = string | null

type ArgTypes = Readonly<{
  help: BooleanValue
  'static-session-id': StringValue
  'config-path': StringValue
}>

export const args: ArgTypes = {
  ...parseArgValue('help'),
  ...parseArgValue('config-path'),
  ...parseArgValue('static-session-id'),
} as const

export function printHelp() {
  console.log(`
\tUsage
\t  $ compositor-proxy <options>

\tOptions
\t  --help, Print this help text.
\t  --static-session-id=..., Use and accept this and only this session id when communicating.
\t  --config-path=...,  Use a configuration file located at this file path.

\tExamples
\t  $ compositor-proxy --static-session-id=test123 --config-path=./config.yaml
  `)
}

if (argv.length > 0) {
  console.log(`Unrecognized option: ${argv.toString()}`)
  printHelp()
  process.exit(0)
}

const help = args['help']
// TODO look for unrecognized options and abort+print help text
if (help) {
  printHelp()
  process.exit(0)
}
