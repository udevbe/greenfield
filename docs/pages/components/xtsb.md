---
layout: default
title: X TypeScript Bindings
grand_parent: Components
parent: Libraries
nav_order: 9
---

# XTSB [![Build Status](https://travis-ci.org/udevbe/xtsb.svg?branch=master)](https://travis-ci.org/udevbe/xtsb) [![Coverage Status](https://coveralls.io/repos/github/udevbe/xtsb/badge.svg?branch=master)](https://coveralls.io/github/udevbe/xtsb?branch=master)

X11 TypeScript Bindings.

Works in Node and browser.

# Build

`yarn install`

# Usage

example:
```typescript
import { connect, EventMask, WindowClass } from '@gfld/xtsb'

async function main() {
  // create a new connection to the x server using the default environment variable DISPLAY
  const connection = await connect()
  
  // allocate a new windowId
  const windowId = connection.allocateID()

  // create a new window in a non-blocking way, we can optionally call 'check()' on the returned result so we receive a 'Promsise<void>' that can be 'await'ed.
  connection.createWindow(
    0,
    windowId,
    connection.setup.roots[0].root,
    0,
    0,
    150,
    150,
    0,
    WindowClass.InputOutput,
    0,
    { eventMask: EventMask.StructureNotify }
  )
  
  // query the window child tree and wait for the reply
  const queryTreeReply = await connection.queryTree(windowId)
  console.log(queryTreeReply.parent)
  
  // set the on destroy notify event listener
  connection.onDestroyNotifyEvent = event => {
    console.log(event.window)
  }
  
  // destroy the window and explicitly block & check if the request succeeded
  await connection.destroyWindow(windowId).check()
}

main()
```

# Documentation

http://udev.be/xtsb/

# License

MIT


