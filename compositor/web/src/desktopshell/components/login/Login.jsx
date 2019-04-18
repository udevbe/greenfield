import './style.css'
import React from 'react'

class Login extends React.Component {
  componentDidMount () {
    const { auth, id } = this.props
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
