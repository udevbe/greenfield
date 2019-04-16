import './style.css'
import { h, Component } from 'preact'

class Overlay extends Component {
  /**
   * @param {boolean}off
   * @param {Array}children
   * @param state
   * @param context
   * @return {*}
   */
  render ({ off, children }, state, context) {
    return (
      <div className={'overlay' + (off ? ' off' : '')}>{children}</div>
    )
  }
}

export default Overlay
