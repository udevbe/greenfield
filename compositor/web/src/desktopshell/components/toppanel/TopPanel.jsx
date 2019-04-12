import './style.css'
import { h, Component } from 'preact'

class TopPanel extends Component {
  constructor (props) {
    super(props)
  }

  /**
   * @param props
   * @param state
   * @param context
   * @return {*}
   */
  render (props, state, context) {
    return (
      <div className={'top-panel'}>
        {props.children}
      </div>
    )
  }
}

export default TopPanel
