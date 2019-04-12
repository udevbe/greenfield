import './style.css'
import { h, Component } from 'preact'

class Workspace extends Component {
  constructor (props) {
    super(props)
  }

  /**
   * @param {Array}children
   * @param state
   * @param context
   * @return {*}
   */
  render ({ children }, state, context) {
    return (
      <div className={'workspace'}> {
        children
      }
      </div>
    )
  }
}

export default Workspace
