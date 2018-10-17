'use strict'

const path = require('path')
const fs = require('fs')

let configFile = process.argv[2]

let configPath
try {
  if (configFile) {
    configPath = configFile.startsWith('/') ? configFile : `${process.cwd()}/${configFile}`
  } else {
    configPath = path.join(__dirname, '../config/DefaultConfig.json')
  }
  const configJSON = fs.readFileSync(configPath, {'encoding': 'utf8'})
  const config = JSON.parse(configJSON)

  console.log(` --- [app-endpoint] Loaded configuration: ${configPath} ---`)
  console.log(configJSON)

  module.exports = config
} catch (error) {
  console.trace(error)
  process.exit()
}
