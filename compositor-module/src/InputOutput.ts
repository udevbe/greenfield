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

import { FD } from 'westfield-runtime-common'

export interface InputOutputFD {
  fd: FD

  write(data: Blob): Promise<void>

  read(count: number): Promise<Blob>

  readStream(chunkSize: number): Promise<ReadableStream<Uint8Array>>

  readBlob(): Promise<Blob>

  close(): Promise<void>
}

export interface InputOutput {
  mkstempMmap(data: Blob): Promise<InputOutputFD>

  mkfifo(): Promise<Array<InputOutputFD>>

  wrapFD(fd: FD, type: 'pipe-read' | 'pipe-write' | 'shm'): InputOutputFD
}
