// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

module.exports = {
  content: [path.join(__dirname, '/index.html'), path.join(__dirname, '/src/**/*.{js,ts,jsx,tsx}')],
  theme: {
    extend: {},
  },
  plugins: [],
}
