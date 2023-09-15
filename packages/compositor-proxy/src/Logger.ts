import Logger, { LoggerOptions } from 'pino'

const loggerConfig: LoggerOptions = {
  level: process.env.LOG_LEVEL || 'info',
  enabled: true,
} as const

export function createLogger(name: string): Logger.Logger {
  return Logger({
    ...loggerConfig,
    name,
  })
}
