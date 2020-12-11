// Copyright 2020 Erik De Rijcke
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

import { Client } from 'westfield-runtime-server'
import { CompositorWebAppLauncher } from './index'
import WebAppSocket from './WebAppSocket'

export default class WebAppLauncher implements CompositorWebAppLauncher{
  private readonly _webAppSocket: WebAppSocket

  static create(webAppSocket: WebAppSocket) {
    return new WebAppLauncher(webAppSocket)
  }

  private constructor(webAppSocket: WebAppSocket) {
    this._webAppSocket = webAppSocket
  }

  launchBlob(blob: Blob): Client {
    const worker = new Worker(URL.createObjectURL(blob))
    const client = this._webAppSocket.onWebAppWorker(worker)
    client.onClose().then(() => worker.terminate())
    return client
  }

  launch(webAppURL: URL): Promise<Client> {
    // TODO store web apps locally so they can be used offline and/or faster
    // TODO alternatively web apps could be served through web-sockets and avoid the same origin policy.
    return new Promise(resolve => {
      // TODO use fetch api
      const xhr = new XMLHttpRequest()

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            try {
              const workerSrc = xhr.responseText
              const blob = new Blob([workerSrc], { type: 'application/javascript' })
              const client = this.launchBlob(blob)
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
