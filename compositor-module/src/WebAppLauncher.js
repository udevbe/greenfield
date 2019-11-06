// Copyright 2019 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

export default class WebAppLauncher {
  /**
   * @param {WebAppSocket}webAppSocket
   * @return {WebAppLauncher}
   */
  static create (webAppSocket) {
    return new WebAppLauncher(webAppSocket)
  }

  /**
   * @param {WebAppSocket}webAppSocket
   */
  constructor (webAppSocket) {
    /**
     * @type {WebAppSocket}
     * @private
     */
    this._webAppSocket = webAppSocket
  }

  /**
   * @param {URL}webAppURL
   * @return {Promise<Client>}
   */
  launch (webAppURL) {
    // TODO store web apps locally so they can be used offline and/or faster
    // TODO alternatively web apps could be served through web-sockets and avoid the same origin policy.
    return new Promise(resolve => {
      const xhr = new window.XMLHttpRequest()

      xhr.onreadystatechange = () => {
        if (xhr.readyState === window.XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            try {
              const workerSrc = xhr.responseText
              const blob = new window.Blob([workerSrc], { type: 'application/javascript' })

              const worker = new window.Worker(URL.createObjectURL(blob))
              const client = this._webAppSocket.onWebAppWorker(worker)
              client.onClose().then(() => worker.terminate())

              resolve(client)
            } catch (e) {
              console.error('\tname: ' + e.name + ' message: ' + e.message + ' text: ' + e.text)
              console.error('error object stack: ')
              console.error(e.stack)
              throw new Error('Could not launch web application.')
            }
          } else {
            console.error(`Could not download web application. ${xhr.status}: ${xhr.statusText}`)
            throw new Error('Could not download web application.')
          }
        }
      }
      xhr.open('GET', webAppURL.href)
      xhr.send()
    })
  }
}
