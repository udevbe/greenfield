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

import React from 'react'
import PropTypes from 'prop-types'
import Tab from '@material-ui/core/es/Tab/Tab'
import ManagedSurface from './ManagedSurface'
import Menu from '@material-ui/core/es/Menu'
import MenuList from '@material-ui/core/es/MenuList'
import ManagedSurfaceTile from './ManagedSurfaceTile'
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
    const currentTarget = e.currentTarget
    this.setState(() => ({ surfaceListAnchor: currentTarget }))
  }

  /**
   * @private
   */
  _surfaceListClose () {
    this.setState(() => ({ surfaceListAnchor: null }))
  }

  /**
   * @param {ManagedSurface}managedSurface
   * @private
   */
  _handleSurfaceSelection (managedSurface) {
    const { seat } = this.props
    managedSurface.requestActive()
    seat.pointer.session.flush()
    this._surfaceListClose()
  }

  render () {
    const { managedSurfaces, appLauncherEntry, activeManagedSurface } = this.props
    const { surfaceListAnchor } = this.state

    const ownManagedSurfaces = managedSurfaces
      .filter(managedSurface => managedSurface.surface.resource.client === appLauncherEntry.client)

    return (
      <React.Fragment>
        <Tab
          icon={
            <img
              alt='application-launcher-icon'
              src={appLauncherEntry.icon.href}
            />
          }
          selected={ownManagedSurfaces.includes(activeManagedSurface)}
          onClick={(e) => this._showSurfaces(e)}
        />
        <Menu
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
          onClose={() => this._surfaceListClose()}
        >
          <MenuList
            style={{
              display: 'flex',
              flexDirection: 'row',
              padding: 0
            }}
          >
            {
              ownManagedSurfaces
                .map(managedSurface => (
                  <MenuItem
                    key={`${managedSurface.surface.resource.client.id}-${managedSurface.surface.resource.id}`}
                    onClick={() => this._handleSurfaceSelection(managedSurface)}
                  >
                    <ManagedSurfaceTile width='200px' height='120px' view={managedSurface.tileView} />
                  </MenuItem>
                ))
            }
          </MenuList>
        </Menu>
      </React.Fragment>
    )
  }
}

RunningAppEntry.propTypes = {
  seat: PropTypes.object.isRequired,
  appLauncherEntry: PropTypes.object,
  activeManagedSurface: PropTypes.instanceOf(ManagedSurface)
}

export default RunningAppEntry
