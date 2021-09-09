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

import { WebFD } from 'westfield-runtime-common'

export default class WebFS {
  private _webFDs: { [key: number]: WebFD } = {}
  private _nextFD = 0

  static create(compositorSessionId: string): WebFS {
    return new WebFS(compositorSessionId)
  }

  private constructor(private readonly compositorSessionId: string) {}

  fromArrayBuffer(arrayBuffer: ArrayBuffer): WebFD {
    const fd = this._nextFD++
    const type = 'ArrayBuffer'
    // FIXME we want to use reference counting here instead of simply deleting.
    // Sending the WebFD to an endpoint will increase the ref, and we should wait until the endpoint has closed the fd as well.
    // TODO probably lots of other edge cases here as well => write some extensive e2e tests
    const webFdURL = new URL('compositor://')
    webFdURL.searchParams.append('fd', `${fd}`)
    webFdURL.searchParams.append('type', type)
    webFdURL.searchParams.append('compositorSessionId', this.compositorSessionId)

    const webFD = new WebFD(
      fd,
      type,
      webFdURL,
      () => Promise.resolve(arrayBuffer),
      () => {
        delete this._webFDs[fd]
      },
    )
    this._webFDs[fd] = webFD
    return webFD
  }

  fromImageBitmap(imageBitmap: ImageBitmap): WebFD {
    const fd = this._nextFD++
    const type = 'ImageBitmap'

    const webFdURL = new URL('compositor://')
    webFdURL.searchParams.append('fd', `${fd}`)
    webFdURL.searchParams.append('type', type)
    webFdURL.searchParams.append('compositorSessionId', this.compositorSessionId)

    const webFD = new WebFD(
      fd,
      'ImageBitmap',
      webFdURL,
      () => Promise.resolve(imageBitmap),
      () => {
        delete this._webFDs[fd]
      },
    )
    this._webFDs[fd] = webFD
    return webFD
  }

  // TODO fromMessagePort

  getWebFD(fd: number): WebFD {
    return this._webFDs[fd]
  }
}
