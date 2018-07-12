const fs = require('fs')
const util = require('util')
const appendFile = util.promisify(fs.appendFile)
const config = require('./config')
const enabled = config['stats']['enabled']

fs.writeFileSync('stats/stats.js', `
const items = []\n
`)

module.exports = class Measurement {
  /**
   * @param {{content:string}}args
   * @return {Measurement}
   */
  static create (args) {
    return new Measurement(args)
  }

  /**
   * @param {{content:string}}args
   */
  constructor ({content}) {
    this._content = content
    this._start = 0
    this._end = 0
  }

  begin () {
    this._start = Date.now()
  }

  end () {
    this._end = Date.now()
  }

  toJSON () {
    return `{
      start: ${this._start},
      end: ${this._end},
      title: '${this._content}',
      content: '${this._content}',
      className: '${this._content}'
    }`
  }

  async register () {
    if (enabled) {
      await appendFile('stats/stats.js', `items.push(${this.toJSON()})\n`)
    }
  }
}
