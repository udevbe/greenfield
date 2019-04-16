import './style.css'
import { h, Component } from 'preact'

class Logo extends Component {
  render (props, state, context) {
    return (
      <p className={'logo'}>
        Greenf<span className={'logo i'}>i</span>eld
      </p>
    )
  }
}

export default Logo
