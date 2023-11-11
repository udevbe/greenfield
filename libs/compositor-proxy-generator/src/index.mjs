#!/usr/bin/env node

/*
MIT License

Copyright (c) 2018 Erik De Rijcke

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
"use strict";

import meow from "meow";
import ProtocolParser from "./EndpointProtocolParser.mjs";

const cli = meow(
  `Usage:
        index.js FILE... [options]

    Generates javascript server-side endpoint protocol files based on the given FILE argument.
    The FILE argument is a relative or absolute path to a Westfield compatible Wayland XML.
    The generated javascript protocol is generated in the output directory.

    Options:
        -o, --out          output directory
        -h, --help         print usage information
        -v, --version      show version info and exit
        
`,
  {
    importMeta: import.meta,
    flags: {
      out: {
        shortFlag: "o",
        type: "string",
      },
      help: {
        shortFlag: "h",
        type: "boolean",
      },
      version: {
        shortFlag: "v",
        type: "boolean",
      },
    },
  }
);

if (cli.input.length === 0 || cli.flags.help) {
  cli.showHelp();
}

let outFile = cli.flags.out;
cli.input.forEach((protocol) => {
  new ProtocolParser(protocol).parse(outFile);
});
