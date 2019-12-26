const webpack = require('webpack')
const merge = require('webpack-merge')

const baseConfig = require('./webpack.config.base')

const base = baseConfig()
const prod = {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      DEBUG: JSON.stringify(false)
    })
  ]
}

module.exports = merge(base, prod)
