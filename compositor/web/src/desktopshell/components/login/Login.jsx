import './style.css'
import React from 'react'

import auth from '../desktopusershell/Auth'

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
