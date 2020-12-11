'use strict'

const path = require('path')

const entryFile = path.resolve(__dirname, './src/index.tsx')

const commonConfig = () => {
  return {
    // mode: 'development',
    // devtool: 'inline-source-map',
    entry: [entryFile],
    target: 'webworker',
    module: {
      rules: [
        // Handle TypeScript
        {
          test: /\.(tsx?)$/,
          use: 'ts-loader',
          exclude: [/node_modules/]
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    output: {
      // put build output somewhere where the compositor can find it.
      path: path.resolve(__dirname, `./build`),
      publicPath: '/',
      filename: 'app.js'
    },
    node: {
      fs: 'empty'
    }
  }
}

module.exports = commonConfig
