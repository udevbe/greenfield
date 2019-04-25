import './style.css'
import React from 'react'
import { withStyles } from '@material-ui/core/es/styles'

const styles = {
  logo: {
    fontFamily: 'Montserrat',
    textAlign: 'center',
    color: '#565656'
  },
  i: {
    color: '#33cc33;'
  }
}

export default withStyles(styles)(React.memo(
  (props) => {
    const fontSize = props.fontSize ? props.fontSize : '4rem'

    return (
      <span className={props.classes.logo} style={{ fontSize }}>
        Greenf<span className={props.classes.i}>i</span>eld
      </span>
    )
  }
))
