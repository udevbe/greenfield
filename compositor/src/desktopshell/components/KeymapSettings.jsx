import React from 'react'
import FormControl from '@material-ui/core/es/FormControl'
import InputLabel from '@material-ui/core/es/InputLabel'
import Select from '@material-ui/core/es/Select'
import MenuItem from '@material-ui/core/es/MenuItem'
import { withStyles } from '@material-ui/core'
import PropTypes from 'prop-types'
import Keyboard from '../../Keyboard'

const styles = theme => ({
  keymapMenuItem: {
    display: 'flex'
  }
})

// TODO make a component that takes up the whole settings drawer space & includes all keyboard related settings.
class KeymapSettings extends React.Component {
  // TODO We need to extend the component keymap settings to make the model selection flexible
  // TODO We need to extend the component keymap settings to make the option selection flexible

  /**
   * @param event
   * @private
   */
  _handleKeymapLayoutUpdate (event) {
    const nrmlvo = event.target.value
    this.props.keyboard.updateKeymapFromNames(nrmlvo)
    this.setState(() => ({ nrmlvo }))
  }

  render () {
    const { classes, keyboard } = this.props

    return <FormControl>
      <InputLabel htmlFor='keymap-layout'>Layout</InputLabel>
      <Select
        inputProps={{
          name: 'keymap-layout',
          id: 'keymap-layout'
        }}
        value={this.props.keyboard.nrmlvo}
        onChange={event => this._handleKeymapLayoutUpdate(event)}
        MenuProps={{
          keepMounted: true
        }}
      >
        {
          // TODO This is large list which renders really slow. We should probably resort to some kind of infinite scroll/pagination.
          keyboard.nrmlvoEntries.map(nrmlvo =>
            <MenuItem
              key={nrmlvo.name}
              className={classes.keymapMenuItem}
              value={nrmlvo}
            >
              {nrmlvo.name}
            </MenuItem>)
        }
      </Select>
    </FormControl>
  }
}

KeymapSettings.propTypes = {
  keyboard: PropTypes.instanceOf(Keyboard).isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(KeymapSettings)
