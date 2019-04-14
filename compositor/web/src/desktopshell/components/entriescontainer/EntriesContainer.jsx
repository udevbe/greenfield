import './style.css'
import { h, Component } from 'preact'

class EntriesContainer extends Component {
  constructor (props) {
    super(props)
  }

  /**
   * @param children
   * @param state
   * @param context
   */
  render ({ children }, state, context) {
    return (
      <div className={'entries-container'}>{children}</div>
    )
  }
}

export default EntriesContainer
