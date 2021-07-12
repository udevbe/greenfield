import Logger from 'pino'
import { config } from './config'

const loggerConfig = {
  prettyPrint: config.logging.level === 'debug',
  level: config.logging.level,
} as const

export function createLogger(name: string): Logger.Logger {
  return Logger({
    ...loggerConfig,
    name,
  })
}
