import './style.css'
import { h, Component } from 'preact'

class EntriesContainer extends Component {
  constructor (props) {
    super(props)
  }

  /**
   * @param props
   * @param state
   * @param context
   */
  render (props, state, context) {
    return (
      <div className={'entries-container'}>
        {props.children}
      </div>
    )
  }
}

export default EntriesContainer
