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
import PropTypes from 'prop-types'
import Seat from '../../Seat'
import Tab from '@material-ui/core/es/Tab/Tab'
import ManagedSurface from '../ManagedSurface'
import Menu from '@material-ui/core/es/Menu'
import MenuList from '@material-ui/core/es/MenuList'
import MenuItem from '@material-ui/core/es/MenuItem'

class RunningAppEntry extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      surfaceListAnchor: null
    }
  }

  /**
   * @private
   */
  _showSurfaces (e) {
    e.preventDefault()
    const { seat, appLauncherEntry, managedSurfaces } = this.props
    const clientSurfaces = managedSurfaces.filter(managedSurface => managedSurface.surface.resource.client === appLauncherEntry.client)

    if (clientSurfaces.length === 1) {
      clientSurfaces[0].requestActivation()
      seat.pointer.session.flush()
    } else if (clientSurfaces.length > 1) {
      const currentTarget = e.currentTarget
      this.setState(() => ({ surfaceListAnchor: currentTarget }))
    }
  }

  _handleSurfaceListClose () {
    this.setState(() => ({ surfaceListAnchor: null }))
  }

  render () {
    const { managedSurfaces, appLauncherEntry, activeManagedSurface } = this.props
    const { surfaceListAnchor } = this.state

    return (
      <>
        <Tab
          icon={
            <img
              src={appLauncherEntry.icon.href}
            />
          }
          selected={
            managedSurfaces
              .filter(managedSurface => managedSurface.surface.resource.client === appLauncherEntry.client)
              .includes(activeManagedSurface)
          }
          onClick={(e) => this._showSurfaces(e)}
        />
        <Menu
          elevation={0}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          id='surface-list-menu'
          anchorEl={surfaceListAnchor}
          keepMounted
          open={Boolean(surfaceListAnchor)}
          onClose={() => this._handleSurfaceListClose()}
        >
          <MenuList style={{
            display: 'flex',
            flexDirection: 'row',
            padding: 0
          }}>
            <MenuItem>
                          bleh
            </MenuItem>
            <MenuItem>
              bloh
            </MenuItem>
          </MenuList>
        </Menu>
      </>
    )
  }
}

RunningAppEntry.propTypes = {
  seat: PropTypes.instanceOf(Seat).isRequired,
  appLauncherEntry: PropTypes.object,
  activeManagedSurface: PropTypes.instanceOf(ManagedSurface)
}

export default RunningAppEntry
