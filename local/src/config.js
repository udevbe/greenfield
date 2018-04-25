'use strict'

const path = require('path')
const fs = require('fs')

let configFile = process.argv[2]
let config
try {
  if (configFile) {
    config = JSON.parse(fs.readFileSync(configFile.startsWith('/') ? configFile : `${process.cwd()}/${configFile}`))
  } else {
    config = JSON.parse(fs.readFileSync(path.join(__dirname, 'DefaultConfig.json')))
  }
} catch (error) {
  console.trace(error)
  process.exit()
}

console.log(' --- Loaded configuration ---')
console.log(config)
console.log(' ---------------------------- ')

module.exports = config
