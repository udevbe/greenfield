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



import './style.css'
import React from 'react'
import ManagedSurfaceView from './ManagedSurfaceView'

class Workspace extends React.PureComponent {
  constructor (props) {
    super(props)
    this.ref = React.createRef()
  }

  render () {
    const { managedSurfaces, seat, activeManagedSurface } = this.props

    return (
      <div id={'workspace'} ref={this.ref}>{
        managedSurfaces.map(managedSurface => {
          const { client, id } = managedSurface.surface.resource

          return (
            <ManagedSurfaceView
              key={`${client.id}-${id}`}
              seat={seat}
              managedSurface={managedSurface}
              active={activeManagedSurface === managedSurface}
              workspace={this}
            />
          )
        })
      }</div>
    )
  }
}

export default Workspace
