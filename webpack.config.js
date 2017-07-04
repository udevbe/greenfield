const path = require('path');

module.exports = {
    entry: './client/src/compositor-client.js',
    output: {
        path: path.resolve(__dirname, 'client/public'),
        filename: 'compositor-client.bundle.js'
    }
};