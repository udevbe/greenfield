'use strict'

const path = require('path')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const htmlIndex = 'index.html'

const entryFile = path.resolve(__dirname, '../src/index.js')
const keymapsDir = path.resolve(__dirname, '../public/keymaps')
const clientsDir = path.resolve(__dirname, '../public/clients')
const rootFiles = path.resolve(__dirname, '../public/*.*')

/**
 * @param {string}appBundle
 * @param {string}buildDir
 * @param {boolean}debug
 * @return {{entry: string, output: {path: string, filename: string}, plugins: *[]}}
 */
const commonConfig = (appBundle, buildDir, debug) => {
  return {
    entry: [entryFile],
    output: {
      path: path.resolve(__dirname, `../${buildDir}`),
      publicPath: '/',
      filename: appBundle
    },
    plugins: [
      new CopyWebpackPlugin([
        { from: keymapsDir, to: 'keymaps' },
        { from: clientsDir, to: 'clients' },
        { from: rootFiles, to: '.', flatten: true }
      ]),
      new HtmlWebpackPlugin({
        file: htmlIndex,
        title: 'Greenfield',
        favicon: path.resolve(__dirname, `../public/favicon.ico`),
        minify: debug ? false : {
          removeAttributeQuotes: true,
          collapseWhitespace: true,
          html5: true,
          minifyCSS: true,
          removeComments: true,
          removeEmptyAttributes: true
        }
      })
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    }
  }
}

module.exports = commonConfig
