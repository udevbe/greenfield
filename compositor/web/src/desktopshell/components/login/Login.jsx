import './style.css'
import { h, Component } from 'preact'

class Login extends Component {
  constructor ({ auth }) {
    super({ auth })
  }

  componentDidMount () {
    const { auth, id } = this.props
    auth.start(this.base, id)
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    return false
  }

  /**
   * @param {string}id
   * @param state
   * @param context
   * @return {*}
   */
  render ({ id }, state, context) {
    return (
      <div id={id} />
    )
  }
}

export default Login
