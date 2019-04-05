import './style.css'
import { Component } from 'preact'

class Workspace extends Component {
  constructor (props) {
    super(props)
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
      <div id={id} className={'workspace'} />
    )
  }
}

export default Workspace
