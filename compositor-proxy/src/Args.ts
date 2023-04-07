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

type ArgTypes = Readonly<{
  'static-session-id': string | null
  'config-location': string | null
}>

export const args: ArgTypes = {
  ...parseArgValue('config-location'),
  ...parseArgValue('static-session-id'),
} as const
