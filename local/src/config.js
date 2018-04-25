'use strict'

const path = require('path')
const fs = require('fs')

let configFile = process.argv[2]

let configPath
try {
  if (configFile) {
    configPath = configFile.startsWith('/') ? configFile : `${process.cwd()}/${configFile}`
  } else {
    configPath = path.join(__dirname, 'DefaultConfig.json')
  }
  const config = JSON.parse(fs.readFileSync(configPath))

  console.log(` --- Loaded configuration: ${configPath} ---`)
  console.log('')
  console.log(config)
  console.log('')

  module.exports = config
} catch (error) {
  console.trace(error)
  process.exit()
}
