import Logger, { LoggerOptions } from 'pino'
import { config } from './config'

const loggerConfig: LoggerOptions = {
  prettyPrint: config.logging.level === 'debug',
  level: config.logging.level,
  enabled: true,
} as const

export function createLogger(name: string): Logger.Logger {
  return Logger({
    ...loggerConfig,
    name,
  })
}
