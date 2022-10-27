import Logger, { LoggerOptions } from 'pino'
import { config } from './config'

const loggerConfig: LoggerOptions = {
  level: config.logging.level,
  enabled: true,
} as const

export function createLogger(name: string): Logger.Logger {
  return Logger({
    ...loggerConfig,
    name,
  })
}
