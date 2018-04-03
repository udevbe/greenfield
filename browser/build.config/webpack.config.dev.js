'use strict'

const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

const appBundle = 'app.js'
const buildDir = 'dev'

const base = baseConfig(appBundle, buildDir, true)
const dev = {
  mode: 'development'
}

module.exports = merge(base, dev)
