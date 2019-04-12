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
    this.state = {
      title: ''
    }

    managedSurface.onTitle.push((newTitle) => this.setState(() => ({ title: newTitle })))
  }

  /**
   * @param {Seat}seat
   * @param {ManagedSurface}managedSurface
   * @param {boolean}active
   * @param {string}title
   * @param context
   * @return {*}
   */
  render ({ seat, managedSurface, active }, { title }, context) {
    let classNames = 'entry'
    if (active) {
      classNames += ' entry-focus'
    }
    return (
      <div className={classNames}>{title}</div>
    )
  }
}

export default ManagedSurfaceEntry
