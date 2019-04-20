import './style.css'
import React from 'react'

export default React.memo((props) =>
  <div className={'overlay' + (props.off ? ' off' : '')}>{props.children}</div>
)
