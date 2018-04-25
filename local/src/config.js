'use strict'

const path = require('path')
const fs = require('fs')

let configFile = process.argv[2]
let config
if (configFile) {
  config = JSON.parse(fs.readFileSync(configFile.startsWith('/') ? configFile : `${process.cwd()}/${configFile}`))
} else {
  config = JSON.parse(fs.readFileSync(path.join(__dirname, 'DefaultConfig.json')))
}

console.log(' --- Loaded configuration ---')
console.log(config)
console.log(' ---------------------------- ')

module.exports = config
