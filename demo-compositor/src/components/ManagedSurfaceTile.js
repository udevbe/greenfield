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



import React from 'react'
import PropTypes from 'prop-types'
import { Mat4 } from 'compositor-module'

class ManagedSurfaceTile extends React.Component {
  constructor (props) {
    super(props)
    /**
     * @type {?View}
     */
    this.view = null
    this.ref = React.createRef()
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) { return false }

  componentDidMount () {
    const { view, width, height } = this.props

    // TODO dynamically adjust the canvas size so it always fits the max container size while using proper scaling

    view.bufferedCanvas.frontContext.canvas.style.width = width
    view.bufferedCanvas.frontContext.canvas.style.height = height

    view.bufferedCanvas.backContext.canvas.style.width = width
    view.bufferedCanvas.backContext.canvas.style.height = height

    view.customTransformation = Mat4.IDENTITY()
    view.disableInputRegion = true
    view.updateInputRegion()

    view.attachTo(this.ref.current)
  }

  componentWillUnmount () {
    const { view } = this.props

    view.detach()
    view.destroy()
  }

  render () {
    const { width, height } = this.props
    return (
      <span
        ref={this.ref}
        style={{ width: width, height: height }}
      />
    )
  }
}

ManagedSurfaceTile.propTypes = {
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  view: PropTypes.object.isRequired
}

export default ManagedSurfaceTile
