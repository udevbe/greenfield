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
