import './style.css'
import { h, Component, cloneElement } from 'preact'

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
      <div id={'workspace'}>{
        children.map(child => {
          const element = cloneElement(child, { workspace: this })
          return element
        })
      }</div>
    )
  }
}

export default Workspace
