const path = require('path')

module.exports = {
  entry: './browser/src/index.js',
  output: {
    path: path._resolve(__dirname, 'browser/public'),
    filename: 'browser.bundle.js'
  },
  module: {
    noParse: [
      /libpixman-1.js/
    ]
  }
}
