import Logger from 'pino'
import { loggingConfig } from '../config'

const loggerConfig = {
  prettyPrint: loggingConfig.level === 'debug',
  level: loggingConfig.level,
} as const

export function createLogger(name: string): Logger.Logger {
  return Logger({
    ...loggerConfig,
    name,
  })
}
