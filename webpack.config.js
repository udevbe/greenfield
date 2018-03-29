const path = require('path')

module.exports = {
  entry: './browser/src/index.js',
  output: {
    path: path.resolve(__dirname, 'browser/public'),
    filename: 'browser.bundle.js'
  }
}
