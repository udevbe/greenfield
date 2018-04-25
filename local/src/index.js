'use strict'

const config = require('./config')
const express = require('express')
const http = require('http')

const childProcess = require('child_process')
const path = require('path')

const forks = {}
const uuidRegEx = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

/**
 * @param {string} sessionId
 * @return {ChildProcess}
 */
function ensureFork (sessionId) {
  let child = forks[sessionId]
  if (child == null) {
    // uncomment next line for debugging support in the child process
    // process.execArgv.push('--inspect-brk=0')

    console.log('Parent creating new child process.')
    const configPath = process.argv[2]
    child = childProcess.fork(path.join(__dirname, 'forkIndex.js'), configPath == null ? [] : [`${configPath}`])

    const removeChild = () => {
      console.log(`Child ${child.pid} exit.`)
      delete forks[sessionId]
    }

    child.on('exit', removeChild)
    child.on('SIGINT', function () {
      console.log(`Child ${child.pid} received SIGINT.`)
      child.exit()
    })
    child.on('SIGTERM', function () {
      console.log(`Child ${child.pid} received SIGTERM.`)
      child.exit()
    })

    forks[sessionId] = child
  }
  return child
}

function run () {
  console.log('>>> Running in PRODUCTION mode <<<\n')
  express.static.mime.define({'application/wasm': ['wasm']})
  const app = express()
  app.use(express.static(path.join(__dirname, '../../browser/dist')))

  const server = http.createServer()
  server.on('request', app)
  server.setTimeout(config['http-server']['socket-timeout'])

  server.on('upgrade', (request, socket, head) => {
    console.log('Parent received websocket upgrade request. Will delegating to child process.')
    const pathElements = request.url.split('/')
    pathElements.shift() // empty element
    const sessionId = pathElements.shift()
    if (sessionId && uuidRegEx.test(sessionId)) {
      let child = ensureFork(sessionId)
      child.send([{
        headers: request.headers,
        method: request.method,
        pathElements: pathElements
      }, head], socket)
    }
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

  server.listen(config['http-server']['port'])
}

function main () {
  process.on('uncaughtException', (error) => {
    console.error(error)
  })
  run()
}

main()
