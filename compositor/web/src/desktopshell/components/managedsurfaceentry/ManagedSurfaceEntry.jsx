import React from 'react'
import PropTypes from 'prop-types'
import Seat from '../../../Seat'
import Tab from '@material-ui/core/es/Tab/Tab'
import ManagedSurface from '../desktopusershell/ManagedSurface'

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
    managedSurface.requestActivation()
    seat.pointer.session.flush()
  }

  render () {
    const { active } = this.props
    const { title } = this.state

    return (
      <Tab label={title} selected={active} onClick={(e) => this._requestActivation(e)} />
    )
  }
}

ManagedSurfaceEntry.propTypes = {
  seat: PropTypes.instanceOf(Seat).isRequired,
  managedSurface: PropTypes.instanceOf(ManagedSurface).isRequired,
  active: PropTypes.bool.isRequired
}

export default ManagedSurfaceEntry
