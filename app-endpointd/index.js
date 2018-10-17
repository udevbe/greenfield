'use strict'

const AppEndpointDaemon = require('./src/AppEndpointDaemon')

async function main () {
  console.log('>>> [app-endpoint-daemon] Running in PRODUCTION mode <<<\n')
  const appEndpointDaemon = await AppEndpointDaemon.create()
  console.log(`>>> [app-endpoint-daemon] connected to ${appEndpointDaemon.ws.url}. <<<\n`)

  const cleanUp = () => {
    console.log('Parent exit. Cleaning up child processes.')
    appEndpointDaemon.destroy()
  }

  process.on('exit', cleanUp)
  process.on('SIGINT', () => {
    console.log('Parent received SIGINT')
    process.exit()
  })
  process.on('SIGTERM', () => {
    console.log('Parent received SIGTERM')
    process.exit()
  })
}

main()
