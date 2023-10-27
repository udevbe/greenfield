export interface Logger {
  info(msg: string): void

  error(msg: string): void

  fatal(msg: string): void

  debug(msg: string): void
}

export type LoggerFactory = (name: string) => Logger

class DefaultLogger implements Logger {
  constructor(public readonly name: string) {}

  info(msg: string) {
    console.info(`{time:"${new Date().toISOString()}",name:"${this.name}",msg:"${msg}"}`)
  }

  debug(msg: string): void {
    // console.debug(`{time:"${new Date().toISOString()}",name:"${this.name}",msg:"${msg}"}`)
  }

  error(msg: string): void {
    console.error(`{time:"${new Date().toISOString()}",name:"${this.name}",msg:"${msg}"}`)
  }

  fatal(msg: string): void {
    console.error(`{time:"${new Date().toISOString()}",name:"${this.name}",msg:"${msg}"}`)
  }
}

function createDefaultLogger(name: string): Logger {
  return new DefaultLogger(name)
}

export function createLogger(name: string, loggerFactory: LoggerFactory = createDefaultLogger): Logger {
  return loggerFactory(name)
}
