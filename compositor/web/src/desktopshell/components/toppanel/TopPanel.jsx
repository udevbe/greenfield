import './style.css'
import { h, Component } from 'preact'
import EntriesContainer from '../entriescontainer/EntriesContainer'
import Entry from '../entry/Entry'



class TopPanel extends Component {
  constructor (props) {
    super(props)
    this.state = INITIAL_STATE
  }



  /**
   * @param props
   * @param state
   * @param context
   * @return {*}
   */
  render (props, state, context) {
    const { /** @type{Array<DesktopUserShellSurface>} */ desktopUserShellSurfaces } = this.state
    return (
      <div className={'top-panel'}>
        <EntriesContainer>
          {
            desktopUserShellSurfaces.map(desktopUserShellSurface =>
              <Entry desktopUserShellSurface={desktopUserShellSurface} />)
          }
        </EntriesContainer>
      </div>
    )
  }
}

export default TopPanel
