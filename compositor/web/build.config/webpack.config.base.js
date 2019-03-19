'use strict'

const path = require('path')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const htmlTemplate = 'index.template.html'
const htmlIndex = 'index.html'

const entryFile = path.resolve(__dirname, '../src/index.js')
const assetsDir = path.resolve(__dirname, '../public/assets')
const keymapsDir = path.resolve(__dirname, '../public/keymaps')
const clientsDir = path.resolve(__dirname, '../public/clients')
const rootFiles = path.resolve(__dirname, '../public/*.*')
const htmlTemplateFile = path.resolve(__dirname, `../public/${htmlTemplate}`)

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
        { from: assetsDir, to: 'assets' },
        { from: keymapsDir, to: 'keymaps' },
        { from: clientsDir, to: 'clients' },
        { from: rootFiles, to: '.', flatten: true, ignore: [htmlTemplate] }
      ]),
      new HtmlWebpackPlugin({
        template: htmlTemplateFile,
        file: htmlIndex,
        app: appBundle,
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
