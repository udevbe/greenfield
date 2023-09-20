#!/usr/bin/env node
"use strict";

import meow from 'meow'
import ProtocolParser from './ProtocolParser.mjs'

const cli = meow(
  `Usage:
        westfield-scanner.js FILE... [options]

    Generates a javascript client-side protocol file based on the given FILE argument.
    The FILE argument is a relative or absolute path to a Westfield compatible Wayland XML.
    The generated javascript protocol is generated in the output directory.

    Options:
        -o, --out          output directory
        -h, --help         print usage information
        -v, --version      show version info and exit
        
`,
  {
      importMeta: import.meta,
      alias: {
          o: 'out'
      }
  }
);

if (cli.input.length === 0) {
  cli.showHelp();
}

let outFile = cli.flags.o;
cli.input.forEach((protocol) => {
  new ProtocolParser(protocol).parse(outFile);
});
