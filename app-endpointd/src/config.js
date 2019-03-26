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

const path = require('path')
const fs = require('fs')

let configFile = process.argv[2]

let configPath
try {
  if (configFile) {
    configPath = configFile.startsWith('/') ? configFile : `${process.cwd()}/${configFile}`
  } else {
    configPath = path.join(__dirname, '../config/app-endpoint-config.json')
  }
  const configJSON = fs.readFileSync(configPath, { 'encoding': 'utf8' })
  const config = JSON.parse(configJSON)

  process.env.DEBUG && console.log(` --- Loaded configuration: ${configPath} ---`)
  console.log(configJSON)

  module.exports = config
} catch (error) {
  console.trace(error)
  process.exit()
}
