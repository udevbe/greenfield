import './style.css'
import React from 'react'
import ManagedSurfaceView from '../managedsurfaceview/ManagedSurfaceView'

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
