#!/usr/bin/env node

// Copyright 2019 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

'use strict'

require('json5/lib/register')
const AppEndpointServer = require('./src/AppEndpointServer')

async function main () {
  try {
    console.log(`[app-endpoint-daemon] >>> Running in ${process.env.DEBUG ? 'DEBUG' : 'PRODUCTION'} mode <<<`)
    const appEndpointDaemon = AppEndpointServer.create()

    const cleanUp = () => {
      console.log('[app-endpoint-daemon] - Exit.')
      appEndpointDaemon.destroy()
    }

    process.on('exit', cleanUp)
    process.on('SIGINT', () => {
      console.log('[app-endpoint-daemon] - Received SIGINT')
      process.exit()
    })
    process.on('SIGTERM', () => {
      console.log('[app-endpoint-daemon] - Received SIGTERM')
      process.exit()
    })
  } catch (e) {
    console.error('[app-endpoint-daemon] - Failed to start.', e)
    process.exit(1)
  }
}

main()
