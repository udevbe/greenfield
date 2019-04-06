import { h, Component } from 'preact'

class ManagedSurfaceView extends Component {
  /**
   * @param {Seat}seat
   * @param {ManagedSurface}managedSurface
   * @param {boolean}active
   */
  constructor ({ seat, managedSurface, active }) {
    super({ seat, managedSurface, active })
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    return false
  }

  componentDidMount () {
    const { managedSurface } = /** @type {{ managedSurface: ManagedSurface }} */ this.props
    managedSurface.view.attachTo(this.base)
  }

  /**
   * @param {ManagedSurface}managedSurface
   * @param {boolean}active
   * @param state
   * @param context
   * @return {HTMLDivElement}
   */
  render ({ managedSurface, active }, state, context) {
    if (active) {
      managedSurface.view.show()
      managedSurface.view.raise()
    }
    return <div style={{ zIndex: managedSurface.view.zIndex }} />
  }
}

export default ManagedSurfaceView
