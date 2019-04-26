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

import './style.css'
import React from 'react'

import auth from '../Auth'

class Login extends React.Component {
  componentDidMount () {
    const { id } = this.props
    auth.start(this.base, id)
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    return false
  }

  render () {
    return (
      <div id={this.props.id} />
    )
  }
}

export default Login
