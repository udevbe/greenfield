import { h, Component } from 'preact'

class ManagedSurfaceView extends Component {
  /**
   * @param {Seat}seat
   * @param {ManagedSurface}managedSurface
   * @param {boolean}active
   * @param {Workspace}workspace
   */
  constructor ({ seat, managedSurface, active, workspace }) {
    super({ seat, managedSurface, active })
  }

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
    managedSurface.view.attachTo(workspace.base)
    // FIXME this is racy. requestActivation callback must be provided when managed surface is created and not
    // set somewhere arbitrarily in the future
    managedSurface.requestActivation()
    seat.pointer.session.flush()
  }

  componentWillUnmount () {
    const { managedSurface } = /** @type {{ managedSurface: ManagedSurface }} */ this.props
    managedSurface.view.detach()
  }

  /**
   * @param {ManagedSurface}managedSurface
   * @param {boolean}active
   * @param state
   * @param context
   * @return {HTMLDivElement}
   */
  render ({ managedSurface, active }, state, context) {
    // TODO replace with empty fragment
    return <div />
  }
}

export default ManagedSurfaceView
