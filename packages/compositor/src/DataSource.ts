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

import { WlDataDeviceManagerDndAction } from '@gfld/compositor-protocol'
import DataOffer from './DataOffer'
import { InputOutputFD, InputOutput } from './InputOutput'

export interface DataSource {
  /**
   * The filesystem associated with this datasource in the context of the compositor.
   * Useful if you want to receive data from this data-source in the compositor.
   */
  readonly inputOutput: InputOutput
  mimeTypes: string[]
  setSelection: boolean
  dataOffer?: DataOffer
  accepted: boolean
  dndActions: number
  currentDndAction: WlDataDeviceManagerDndAction
  compositorAction: WlDataDeviceManagerDndAction
  readonly version: 3 | number

  accept(mimeType: string | undefined): void
  send(mimeType: string, ioFD: InputOutputFD): void
  cancel(force?: boolean): void

  action(action: WlDataDeviceManagerDndAction): void
  dndDropPerformed(): void
  notifyFinish(): void

  addDestroyListener(destroyListener: () => void): void
  removeDestroyListener(destroyListener: () => void): void
  destroyDataSource(): void
}
