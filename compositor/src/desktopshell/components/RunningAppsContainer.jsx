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

import { withStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/es/Tabs'

import Seat from '../../Seat'
import ManagedSurface from '../ManagedSurface'
import RunningAppEntry from './RunningAppEntry'

const styles = {}

class RunningAppsContainer extends React.Component {
  render () {
    const { seat, activeManagedSurface, managedSurfaces, appLauncherEntries } =
      /** @type {{appLauncherEntries: Array<AppLauncherEntry>, seat: Seat, activeManagedSurface:ManagedSurface}} */this.props
    if (appLauncherEntries.length === 0) return null

    let value = false
    if (activeManagedSurface) {
      const activeAppLauncherEntry = appLauncherEntries.find(appLauncherEntry => appLauncherEntry.client === activeManagedSurface.surface.resource.client)
      value = activeAppLauncherEntry === null ? false : appLauncherEntries.indexOf(activeAppLauncherEntry)
    }

    return (
      <Tabs
        value={value}
        textColor='primary'
        variant='scrollable'
        scrollButtons='auto'
      >
        {
          appLauncherEntries
            .map(appLauncherEntry => {
              const { client, id } = appLauncherEntry
              return (
                <RunningAppEntry
                  key={`${id}`}
                  seat={seat}
                  client={client}
                  appLauncherEntry={appLauncherEntry}
                  activeManagedSurface={activeManagedSurface}
                  managedSurfaces={managedSurfaces}
                />
              )
            })
        }
      </Tabs>
    )
  }
}

RunningAppsContainer.propTypes = {
  classes: PropTypes.object.isRequired,

  seat: PropTypes.instanceOf(Seat).isRequired,
  activeManagedSurface: PropTypes.instanceOf(ManagedSurface),
  managedSurfaces: PropTypes.arrayOf(ManagedSurface).isRequired
}

export default withStyles(styles)(RunningAppsContainer)
