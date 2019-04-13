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
   * @private
   */
  _requestActivation (e) {
    e.preventDefault()
    const { seat, managedSurface } = /** @type{{seat:Seat, managedSurface: ManagedSurface}} */this.props
    // FIXME call is racy. Function is set at some arbitrary future point.
    managedSurface.requestActivation()
    seat.pointer.session.flush()
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
      <div className={classNames} onClick={(e) => this._requestActivation(e)}>{title}</div>
    )
  }
}

export default ManagedSurfaceEntry
