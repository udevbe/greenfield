import './style.css'
import React from 'react'

class ManagedSurfaceEntry extends React.PureComponent {
  /**
   * @param {{seat:Seat, managedSurface:ManagedSurface, active:boolean}}props
   */
  constructor (props) {
    super(props)
    this.state = {
      title: ''
    }

    props.managedSurface.onTitle.push((newTitle) => this.setState(() => ({ title: newTitle })))
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

  render () {
    const { active } = this.props
    const { title } = this.state

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
