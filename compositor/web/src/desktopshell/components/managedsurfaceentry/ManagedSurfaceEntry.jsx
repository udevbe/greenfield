import './style.css'
import { h, Component } from 'preact'

class ManagedSurfaceEntry extends Component {
  /**
   * @param {Seat}seat
   * @param {ManagedSurface}managedSurface
   * @param {boolean}active
   */
  constructor ({ seat, managedSurface, active }) {
    super({ seat, managedSurface, active })
  }

  /**
   * @param {Seat}seat
   * @param {ManagedSurface}managedSurface
   * @param {boolean}active
   * @param state
   * @param context
   * @return {*}
   */
  render ({ seat, managedSurface, active }, state, context) {
    let classNames = 'entry'
    if (active) {
      classNames += ' entry-focus'
    }
    return (
      <div className={classNames} />
    )
  }
}

export default ManagedSurfaceEntry
