const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ClosureCompilerPlugin = require('webpack-closure-compiler')
const merge = require('webpack-merge')

const baseConfig = require('./webpack.config.base')

const appBundle = 'app.min.js'
const buildDir = 'dist'

const base = baseConfig(appBundle, buildDir, false)
const prod = {
  mode: 'none',
  plugins: [
    new ClosureCompilerPlugin({
      compiler: {
        create_source_map: true,
        language_in: 'ECMASCRIPT6_STRICT',
        language_out: 'ECMASCRIPT6_STRICT',
        compilation_level: 'ADVANCED'
      }
    }),
    new CleanWebpackPlugin([buildDir], {
      root: path.resolve(__dirname, '..')
    })
  ]
}

module.exports = merge(base, prod)
