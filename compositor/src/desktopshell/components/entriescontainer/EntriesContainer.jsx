import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/es/Tabs'

import ManagedSurfaceEntry from '../managedsurfaceentry/ManagedSurfaceEntry'
import Seat from '../../../Seat'
import ManagedSurface from '../desktopusershell/ManagedSurface'

const styles = {
  root: {
    flexGrow: 1
  }
}

class EntriesContainer extends React.Component {
  render () {
    const { managedSurfaces, seat, activeManagedSurface } = this.props
    if (managedSurfaces.length === 0) return null

    const value = activeManagedSurface === null ? false : managedSurfaces.indexOf(activeManagedSurface)

    return (
      <Tabs value={value}>{
        managedSurfaces.map(managedSurface => {
          const { client, id } = managedSurface.surface.resource
          return (
            <ManagedSurfaceEntry
              key={`${client.id}-${id}`}
              seat={seat}
              managedSurface={managedSurface}
              active={activeManagedSurface === managedSurface}
            />
          )
        })
      }</Tabs>
    )
  }
}

EntriesContainer.propTypes = {
  classes: PropTypes.object.isRequired,

  seat: PropTypes.instanceOf(Seat).isRequired,
  activeManagedSurface: PropTypes.instanceOf(ManagedSurface),
  managedSurfaces: PropTypes.arrayOf(ManagedSurface).isRequired
}

export default withStyles(styles)(EntriesContainer)
