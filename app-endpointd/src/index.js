'use strict'

const AppEndpointDaemon = require('./AppEndpointDaemon')

async function main () {
  try {
    console.log(`[app-endpoint-daemon] >>> Running in ${process.env.DEBUG ? 'DEBUG' : 'PRODUCTION'} mode <<<`)
    const appEndpointDaemon = await AppEndpointDaemon.create()
    process.env.DEBUG && console.log(`[app-endpoint-daemon] Web socket connected to ${appEndpointDaemon.webSocket.url}.`)

    const cleanUp = () => {
      console.log('[app-endpoint-daemon] Exit.')
      appEndpointDaemon.destroy()
    }

    process.on('exit', cleanUp)
    process.on('SIGINT', () => {
      console.log('[app-endpoint-daemon] Received SIGINT')
      process.exit()
    })
    process.on('SIGTERM', () => {
      console.log('[app-endpoint-daemon] Received SIGTERM')
      process.exit()
    })
  } catch (e) {
    console.error('[app-endpoint-daemon] Failed to start.', e)
    process.exit(1)
  }
}

main()
