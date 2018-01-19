#!/usr/bin/env node

'use strict'

const express = require('express')
const http = require('http')

const childProcess = require('child_process')
const path = require('path')

const forks = {}

function ensureFork (grSessionId) {
  let child = forks[grSessionId]
  if (child == null) {
    // uncomment next line for debugging support
    // process.execArgv.push('--inspect-brk=0')

    console.log('Remote endpoint detected. Starting new shim-compositor.')
    child = childProcess.fork(path.join(__dirname, 'forkIndex.js'))

    const removeChild = () => {
      delete forks[grSessionId]
    }

    child.on('disconnect', removeChild)
    child.on('SIGINT', removeChild)
    child.on('SIGTERM', removeChild)
    child.on('SIGBREAK', removeChild)
    child.on('SIGHUP', removeChild)

    forks[grSessionId] = child
  }
  return child
}

function main () {
  process.on('uncaughtException', (error) => {
    console.error(error)
  })

  const app = express()
  app.use(express.static(path.join(__dirname, '../../browser/public')))

  const server = http.createServer()
  server.on('request', app)

  server.on('upgrade', (request, socket, head) => {
    let child = ensureFork(request.url.substring(1))
    child.send([{
      headers: request.headers,
      method: request.method
    }, head], socket)
  })

  const cleanUp = () => {
    for (const grSessionId in forks) {
      const child = forks[grSessionId]
      if (child != null) {
        child.kill('SIGTERM')
      }
    }
    process.exit(0)
  }

  process.on('exit', cleanUp)
  process.on('SIGINT', cleanUp)
  process.on('SIGTERM', cleanUp)
  process.on('SIGBREAK', cleanUp)
  process.on('SIGHUP', cleanUp)

  server.listen(8080)
}

main()
