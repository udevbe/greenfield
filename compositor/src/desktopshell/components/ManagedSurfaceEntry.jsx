// Copyright 2019 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import Seat from '../../Seat'
import Tab from '@material-ui/core/es/Tab/Tab'
import ManagedSurface from '../ManagedSurface'

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
    managedSurface.requestActivation(managedSurface)
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
