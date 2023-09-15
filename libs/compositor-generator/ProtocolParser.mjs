/*
MIT License

Copyright (c) 2017 Erik De Rijcke

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

import path from 'node:path'
import fs from 'node:fs'
import xml2js from 'xml2js'
import camelCase from 'camelcase'
import upperCamelCase from 'uppercamelcase'
import ProtocolArguments from './ProtocolArguments.mjs'

class ProtocolParser {
  static _generateEventArgs(out, req) {
    if (req.hasOwnProperty("arg")) {
      const evArgs = req.arg;
      let processedFirstArg = false;
      for (let i = 0; i < evArgs.length; i++) {
        const arg = evArgs[i];
        const optional =
          arg.$.hasOwnProperty("allow-null") && arg.$["allow-null"] === "true";
        const argInterface = arg.$.hasOwnProperty("interface")
          ? `${upperCamelCase(arg.$.interface)}Resource`
          : undefined;
        const argType = arg.$.type;
        if (argType === "new_id") {
          continue;
        }

        const argName = camelCase(arg.$.name);
        if (processedFirstArg) {
          out.write(", ");
        }
        const tsType = ProtocolArguments[argType](
          argName,
          optional,
          argInterface
        ).jsType;
        out.write(`${argName}: ${tsType}`);
        processedFirstArg = true;
      }
    }
  }

  static _generateRequestArgs(out, ev, resourceName) {
    const evArgs = ev.arg;

    out.write(`resource: ${resourceName}`);
    if (ev.hasOwnProperty("arg")) {
      for (let i = 0; i < evArgs.length; i++) {
        const arg = evArgs[i];
        const argName = camelCase(arg.$.name);
        const optional =
          arg.$.hasOwnProperty("allow-null") && arg.$["allow-null"] === "true";
        const argInterface = arg.$.hasOwnProperty("interface")
          ? `${upperCamelCase(arg.$.interface)}Resource`
          : undefined;
        const argType = arg.$.type;

        out.write(
          `, ${argName}: ${
            ProtocolArguments[argType](argName, optional, argInterface).jsType
          }`
        );
      }
    }
  }

  static _parseRequestSignature(ev) {
    let evSig = "";
    if (ev.hasOwnProperty("arg")) {
      const evArgs = ev.arg;
      for (let i = 0; i < evArgs.length; i++) {
        const arg = evArgs[i];

        const argName = camelCase(arg.$.name);
        const optional =
          arg.$.hasOwnProperty("allow-null") && arg.$["allow-null"] === "true";
        const argInterface = arg.$.hasOwnProperty("interface")
          ? `${upperCamelCase(arg.$.interface)}Resource`
          : undefined;
        const argType = arg.$.type;

        if (i !== 0) {
          evSig += ", ";
        }
        evSig += ProtocolArguments[argType](
          argName,
          optional,
          ProtocolArguments[argType](argName, false, argInterface).jsType
        ).signature;
      }
    }

    return evSig;
  }

  static _generateIfRequestGlue(out, ev, opcode) {
    const evName = camelCase(ev.$.name);

    out.write(`\t[${opcode}] (message: WlMessage) {\n`);
    const evSig = ProtocolParser._parseRequestSignature(ev);
    if (evSig.length) {
      out.write(`\t\treturn this.implementation.${evName}(this, ${evSig})\n`);
    } else {
      out.write(`\t\treturn this.implementation.${evName}(this)\n`);
    }
    out.write("\t}\n");
  }

  _parseItfRequest(requestsOut, resourceName, itfRequest) {
    const sinceVersion = itfRequest.$.hasOwnProperty("since")
      ? parseInt(itfRequest.$.since)
      : 1;
    const reqName = camelCase(itfRequest.$.name);

    // function docs
    if (itfRequest.hasOwnProperty("description")) {
      const description = itfRequest.description;
      description.forEach((val) => {
        requestsOut.write("\n\t/**\n");
        if (val.hasOwnProperty("_")) {
          val._.split("\n").forEach((line) => {
            requestsOut.write("\t *" + line + "\n");
          });
        }

        requestsOut.write("\t *\n");
        requestsOut.write(
          `\t * @param resource The protocol resource of this implementation.\n`
        );
        if (itfRequest.hasOwnProperty("arg")) {
          const evArgs = itfRequest.arg;
          evArgs.forEach((arg) => {
            const argDescription = arg.$.summary || "";
            const argName = camelCase(arg.$.name);

            requestsOut.write(`\t * @param ${argName} ${argDescription} \n`);
          });
        }
        requestsOut.write("\t *\n");
        requestsOut.write(`\t * @since ${sinceVersion}\n`);
        requestsOut.write("\t *\n");
        requestsOut.write("\t */\n");
      });
    }

    // function
    requestsOut.write(`\t${reqName}(`);
    ProtocolParser._generateRequestArgs(requestsOut, itfRequest, resourceName);
    requestsOut.write("): void\n");
  }

  _parseItfEvent(out, itfEvent, opcode) {
    const sinceVersion = itfEvent.$.hasOwnProperty("since")
      ? parseInt(itfEvent.$.since)
      : 1;

    const reqName = camelCase(itfEvent.$.name);

    // function docs
    if (itfEvent.hasOwnProperty("description")) {
      const description = itfEvent.description;
      description.forEach((val) => {
        out.write("\n\t/**\n");
        if (val.hasOwnProperty("_")) {
          val._.split("\n").forEach((line) => {
            out.write("\t *" + line + "\n");
          });
        }

        if (itfEvent.hasOwnProperty("arg")) {
          const reqArgs = itfEvent.arg;
          out.write("\t *\n");
          reqArgs.forEach((arg) => {
            const argDescription = arg.$.summary || "";
            const argName = camelCase(arg.$.name);
            const argType = arg.$.type;
            if (argType !== "new_id") {
              out.write(`\t * @param ${argName} ${argDescription} \n`);
            }
          });

          reqArgs.forEach((arg) => {
            const argDescription = arg.$.summary || "";
            const argType = arg.$.type;
            if (argType === "new_id") {
              out.write(`\t * @return resource id. ${argDescription} \n`);
            }
          });
          out.write("\t *\n");
        }
        out.write(`\t * @since ${sinceVersion}\n`);
        out.write("\t *\n");
        out.write("\t */\n");
      });
    }

    // function
    out.write(`\t${reqName} (`);
    ProtocolParser._generateEventArgs(out, itfEvent);
    out.write(") {\n");

    let itfName;
    // function args
    let argArray = "[";
    if (itfEvent.hasOwnProperty("arg")) {
      const reqArgs = itfEvent.arg;

      for (let i = 0; i < reqArgs.length; i++) {
        const arg = reqArgs[i];
        const argType = arg.$.type;
        const argName = camelCase(arg.$.name);
        const optional =
          arg.$.hasOwnProperty("allow-null") && arg.$["allow-null"] === "true";

        if (argType === "new_id") {
          itfName = upperCamelCase(arg.$["interface"]);
        }

        if (i !== 0) {
          argArray += ", ";
        }

        argArray += ProtocolArguments[argType](argName, optional).marshallGen;
      }
    }
    argArray += "]";

    if (itfName) {
      out.write(
        `\t\treturn this.client.marshallConstructor(this.id, ${opcode}, ${argArray})\n`
      );
    } else {
      out.write(`\t\tthis.client.marshall(this.id, ${opcode}, ${argArray})\n`);
    }

    out.write("\t}\n");
  }

  /**
   * @param {Object}jsonProtocol
   * @param {string}outDir
   * @param {Object}protocolItf
   * @param {WriteStream}out
   * @private
   */
  _writeResource(jsonProtocol, outDir, protocolItf, out) {
    const itfNameOrig = protocolItf.$.name;
    if (itfNameOrig === "wl_registry" || itfNameOrig === "wl_display") {
      // registry & display are special cases which are implemented in the runtime part so we skip there code generation.
      return;
    }

    const itfName = upperCamelCase(itfNameOrig);
    let itfVersion = 1;

    if (protocolItf.$.hasOwnProperty("version")) {
      itfVersion = parseInt(protocolItf.$.version);
    }

    console.log(`Processing interface ${itfName} v${itfVersion}`);

    const resourceName = `${itfName}Resource`;

    // class docs
    const description = protocolItf.description;
    if (description) {
      description.forEach((val) => {
        out.write("\n/**\n");
        if (val.hasOwnProperty("_")) {
          val._.split("\n").forEach((line) => {
            out.write(" *" + line + "\n");
          });
        }
        out.write(" */\n");
      });
    }
    const requestsName = protocolItf.hasOwnProperty("request")
      ? `${itfName}Requests`
      : "never";

    // class
    out.write(`export class ${resourceName} extends Westfield.Resource {\n`);
    out.write(`\tstatic readonly protocolName = '${itfNameOrig}'\n\n`);
    out.write(
      "\t//@ts-ignore Should always be set when resource is created.\n"
    );
    if (protocolItf.hasOwnProperty("request")) {
      out.write(`\timplementation: ${requestsName}\n\n`);
    } else {
      out.write(`\timplementation: any\n\n`);
    }

    // events
    if (protocolItf.hasOwnProperty("event")) {
      const itfEvents = protocolItf.event;
      for (let j = 0; j < itfEvents.length; j++) {
        this._parseItfEvent(out, itfEvents[j], j);
      }
    }

    // constructor
    out.write(
      "\tconstructor (client: Westfield.Client, id: number, version: number) {\n"
    );
    out.write("\t\tsuper(client, id, version)\n");
    out.write("\t}\n\n");

    // glue request functions
    if (protocolItf.hasOwnProperty("request")) {
      const itfRequests = protocolItf.request;
      for (let j = 0; j < itfRequests.length; j++) {
        const itfRequest = itfRequests[j];
        let since = "1";
        if (itfRequest.$.hasOwnProperty("since")) {
          since = itfRequest.$.since;
        }

        ProtocolParser._generateIfRequestGlue(out, itfRequest, j);
      }
    }

    out.write("}\n");
    // requests
    if (protocolItf.hasOwnProperty("request")) {
      const itfRequests = protocolItf.request;
      this._writeRequests(
        jsonProtocol,
        outDir,
        itfRequests,
        resourceName,
        requestsName,
        out
      );
    }

    // enums
    if (protocolItf.hasOwnProperty("enum")) {
      // create new files to define enums
      const itfEnums = protocolItf.enum;
      for (let j = 0; j < itfEnums.length; j++) {
        const itfEnum = itfEnums[j];
        const enumName = upperCamelCase(itfEnum.$.name);

        out.write(`export enum ${itfName}${enumName} {\n`);

        let firstArg = true;
        itfEnum.entry.forEach((entry) => {
          let entryName = camelCase(entry.$.name);
          if (!isNaN(entryName[0])) {
            entryName = `_${entryName}`;
          }
          const entryValue = entry.$.value;
          const entrySummary = entry.$.summary || "";

          if (!firstArg) {
            out.write(",\n");
          }
          firstArg = false;

          out.write("  /**\n");
          out.write(`   * ${entrySummary}\n`);
          out.write("   */\n");
          out.write(`  ${entryName} = ${entryValue}`);
        });
        out.write("\n}\n\n");
      }
    }
  }

  /**
   * @param {Object}jsonProtocol
   * @param {string}outDir
   * @private
   */
  _parseProtocol(jsonProtocol, outDir) {
    const out = fs.createWriteStream(
      path.join(outDir, `${jsonProtocol.protocol.$.name}.ts`)
    );
    out.write("/*\n");
    jsonProtocol.protocol.copyright.forEach((val) => {
      val.split("\n").forEach((line) => {
        out.write(" *" + line + "\n");
      });
    });
    out.write(" */\n\n");
    out.write(
      "import { WlMessage, fileDescriptor, uint, int, \n" +
        "\tfixed, object, objectOptional, newObject, string, stringOptional, \n" +
        "\tarray, arrayOptional, u, i, f, oOptional, o, n, sOptional, s, aOptional, a, h," +
        "\tFD, Fixed } from '@gfld/common'\n"
    );
    out.write("import * as Westfield from '..'\n\n");
    jsonProtocol.protocol.interface.forEach((itf) => {
      this._writeResource(jsonProtocol, outDir, itf, out);
    });
    console.log("Done");
  }

  // TODO make outFile -> outDir
  /**
   * @param {string}outDir
   */
  parse(outDir) {
    let appRoot;
    if (this.protocolFile.substring(0, 1) === "/") {
      appRoot = "";
    } else {
      appRoot = process.env.PWD;
    }

    if (!outDir) {
      outDir = process.env.PWD;
    }

    fs.readFile(path.join(appRoot, this.protocolFile), (err, data) => {
      if (err) throw err;
      new xml2js.Parser().parseString(data, (err, result) => {
        if (err) throw err;

        // uncomment to see the protocol as json output
        // console.log(util.inspect(result, false, null));

        this._parseProtocol(result, outDir);
      });
    });
  }

  constructor(protocolFile) {
    this.protocolFile = protocolFile;
  }

  _writeRequests(
    jsonProtocol,
    outDir,
    itfRequests,
    resourceName,
    requestsName,
    out
  ) {
    out.write(`\nexport interface ${requestsName} {\n`);

    for (let j = 0; j < itfRequests.length; j++) {
      const itfRequest = itfRequests[j];
      this._parseItfRequest(out, resourceName, itfRequest);
    }

    out.write("}\n\n");
  }
}

export default ProtocolParser;
