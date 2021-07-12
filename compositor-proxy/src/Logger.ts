import Logger from 'pino'
import { config } from './config'

const loggerConfig = {
  // @ts-ignore
  prettyPrint: config.logging.level === 'debug',
  // @ts-ignore
  level: config.logging.level,
} as const

export function createLogger(name: string): Logger.Logger {
  return Logger({
    ...loggerConfig,
    name,
  })
}
