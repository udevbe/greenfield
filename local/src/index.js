'use strict'

const express = require('express')
const http = require('http')
const fs = require('fs')

const childProcess = require('child_process')
const path = require('path')

const forks = {}

function ensureFork (grSessionId) {
  let child = forks[grSessionId]
  if (child == null) {
    console.log('Parent creating new child process.')
    child = childProcess.fork(path.join(__dirname, 'forkIndex.js'))

    const removeChild = () => {
      console.log('child exit')
      delete forks[grSessionId]
    }

    child.on('exit', removeChild)
    child.on('SIGINT', function () {
      console.log(`Child ${child.pid} received SIGINT`)
      child.exit()
    })
    child.on('SIGTERM', function () {
      console.log(`Child ${child.pid} received SIGTERM.`)
      child.exit()
    })

    forks[grSessionId] = child
  }
  return child
}

/**
 * @param {{port:number}}config
 */
function run (config) {
  console.log('>>> Running in PRODUCTION mode <<<\n')
  console.log(' --- configuration ---')
  console.log(config)
  console.log(' --------------------- ')
  express.static.mime.define({'application/wasm': ['wasm']})
  const app = express()
  app.use(express.static(path.join(__dirname, '../../browser/dist')))
  app.use(express.query)

  const server = http.createServer()
  server.on('request', app)

  server.on('upgrade', (request, socket, head) => {
    console.log('Parent received websocket upgrade request. Will delegating to new child process.')
    let child = ensureFork(request.url.substring(1))
    child.send([{
      headers: request.headers,
      method: request.method
    }, head], socket)
  })

  const cleanUp = () => {
    console.log('Parent exit. Cleaning up child processes.')
    for (const grSessionId in forks) {
      const child = forks[grSessionId]
      if (child != null) {
        console.log(`Parent sending child ${child.pid} SIGKILL`)
        child.disconnect()
        child.kill('SIGKILL')
      }
    }
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

  server.listen(config.port)
}

function main () {
  process.on('uncaughtException', (error) => {
    console.error(error)
  })

  let configFile = process.argv[2]
  let config
  if (configFile) {
    config = JSON.parse(fs.readFileSync(process.cwd() + '/' + configFile))
  } else {
    config = JSON.parse(fs.readFileSync(path.join(__dirname, 'DefaultConfig.json')))
  }

  run(config)
}

main()
