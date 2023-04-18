function parseArgValue<T extends keyof ArgTypes>(
  key: T,
  defaultValue: ArgTypes[T] = null,
): { [key in T]: ArgTypes[T] } {
  // Return true if the key exists and a value is defined
  // @ts-ignore
  if (process.argv.includes(`--${key}`)) return { [`${key}`]: true }
  const value = process.argv.find((element) => element.startsWith(`--${key}=`))
  // Return null if the key does not exist and a value is not defined
  // @ts-ignore
  if (value === undefined) return { [`${key}`]: defaultValue }
  // @ts-ignore
  return { [`${key}`]: value.replace(`--${key}=`, '') }
}

type BooleanValue = boolean | null
type StringValue = string | null

type ArgTypes = Readonly<{
  help: BooleanValue
  'config-path': StringValue
}>

export const args: ArgTypes = {
  ...parseArgValue('help'),
  ...parseArgValue('config-path'),
} as const

export function printHelp() {
  console.log(`
\tUsage
\t  $ compositor-proxy <options>

\tOptions
\t  --help, Print this help text.
\t  --config-path=...,  Use a custom configuration file located at this path.

\tExamples
\t  $ compositor-proxy --static-session-id=test123 --config-path=./config.yaml
  `)
}

const help = args['help']
// TODO look for unrecognized options and abort+print help text
if (help) {
  printHelp()
  process.exit(0)
}
