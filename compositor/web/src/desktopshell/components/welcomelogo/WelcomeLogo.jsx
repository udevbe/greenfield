import './style.css'
import { h, Component } from 'preact'

class WelcomeLogo extends Component {
  render (props, state, context) {
    return (
      <p className={'welcome-logo'}>
        Greenf<span className={'i'}>i</span>eld
      </p>
    )
  }
}

export default WelcomeLogo
