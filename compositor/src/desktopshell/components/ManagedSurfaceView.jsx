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

'use strict'

import React from 'react'

class ManagedSurfaceView extends React.Component {
  shouldComponentUpdate (nextProps, nextState, nextContext) {
    return false
  }

  componentWillReceiveProps ({ managedSurface, active }, nextContext) {
    if (active) {
      managedSurface.view.show()
      managedSurface.view.raise()
    }
  }

  componentDidMount () {
    const { seat, managedSurface, workspace } = /** @type {{ seat: Seat, managedSurface: ManagedSurface, workspace: Workspace }} */ this.props
    managedSurface.view.attachTo(workspace.ref.current)
    managedSurface.requestActivation(managedSurface)
    seat.pointer.session.flush()
  }

  componentWillUnmount () {
    const { managedSurface } = /** @type {{ managedSurface: ManagedSurface }} */ this.props
    managedSurface.view.detach()
  }

  render () {
    const { managedSurface, active } = this.props
    if (active) {
      managedSurface.view.show()
      managedSurface.view.raise()
    }
    return null
  }
}

export default ManagedSurfaceView
