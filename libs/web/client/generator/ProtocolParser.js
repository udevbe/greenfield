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

const path = require("path");
const fs = require("fs");
const xml2js = require("xml2js");

const camelCase = require("camelcase");
const upperCamelCase = require("uppercamelcase");

const ProtocolArguments = require("./ProtocolArguments");

class ProtocolParser {
  static _generateRequestArgs(codeLines, req) {
    if (req.hasOwnProperty("arg")) {
      const reqArgs = req.arg;
      let processedFirstArg = false;
      for (let i = 0; i < reqArgs.length; i++) {
        const arg = reqArgs[i];
        let argType = arg.$.type;
        const optional =
          arg.$.hasOwnProperty("allow-null") && arg.$["allow-null"] === "true";
        let argName;
        if (argType === "new_id") {
          if (arg.$.hasOwnProperty("interface")) {
            continue;
          } else {
            argName = "anyProxy";
          }
        } else {
          argName = camelCase(arg.$.name);
        }

        if (processedFirstArg) {
          codeLines.push(", ");
        }
        if (argName === "interface") {
          argName = "interface_";
        }
        let argTsType;
        if (argType !== "new_id") {
          if (argType === "object") {
            const proxyTypeName = arg.$.hasOwnProperty("interface")
              ? `${upperCamelCase(arg.$["interface"])}Proxy`
              : "Proxy";
            argTsType = ProtocolArguments[argType](
              argName,
              optional,
              proxyTypeName
            ).jsType;
          } else {
            argTsType = ProtocolArguments[argType](argName, optional).jsType;
          }
        } else if (argType === "new_id" && !arg.$.hasOwnProperty("interface")) {
          argTsType =
            "{ new(display: Display, connection: Connection, id: number): Proxy }";
        }
        codeLines.push(`${argName}${argTsType}`);
        processedFirstArg = true;
      }
    }
  }

  static _generateEventArgs(out, ev) {
    if (ev.hasOwnProperty("arg")) {
      const evArgs = ev.arg;

      const arg0 = evArgs[0];
      const arg0Name = camelCase(arg0.$.name);
      const optional0 =
        arg0.$.hasOwnProperty("allow-null") && arg0.$["allow-null"] === "true";
      const arg0Type = arg0.$.type;

      let arg0TsType;
      if (arg0Type === "object" || arg0Type === "new_id") {
        if (arg0.$.hasOwnProperty("interface")) {
          let proxyName = `${upperCamelCase(arg0.$["interface"])}Proxy`;
          arg0TsType = ProtocolArguments[arg0Type](
            arg0Name,
            optional0,
            proxyName
          ).jsType;
        } else {
          arg0TsType = ": Proxy";
        }
      } else {
        arg0TsType = ProtocolArguments[arg0Type](arg0Name, optional0).jsType;
      }

      out.write(`${arg0Name}${arg0TsType}`);

      for (let i = 1; i < evArgs.length; i++) {
        const arg = evArgs[i];
        let argName = camelCase(arg.$.name);
        if (argName === "interface") {
          argName = "interface_";
        }
        const optional =
          arg.$.hasOwnProperty("allow-null") && arg.$["allow-null"] === "true";
        const argType = arg.$.type;

        let argTsType;
        if (argType === "object" || argType === "new_id") {
          if (arg.$.hasOwnProperty("interface")) {
            let proxyName = `${upperCamelCase(arg.$["interface"])}Proxy`;
            argTsType = ProtocolArguments[argType](
              argName,
              optional,
              proxyName
            ).jsType;
          } else {
            argTsType = ": Proxy";
          }
        } else {
          argTsType = ProtocolArguments[argType](argName, optional).jsType;
        }
        out.write(`, ${argName}${argTsType}`);
      }
    }
  }

  static _parseEventSignature(ev) {
    let evSig = "";
    if (ev.hasOwnProperty("arg")) {
      const evArgs = ev.arg;
      for (let i = 0; i < evArgs.length; i++) {
        const arg = evArgs[i];

        const argName = camelCase(arg.$.name);
        const optional =
          arg.$.hasOwnProperty("allow-null") && arg.$["allow-null"] === "true";
        const argType = arg.$.type;
        if (i !== 0) {
          evSig += ", ";
        }
        if (argType === "new_id") {
          const argItf = upperCamelCase(arg.$["interface"]) + "Proxy";
          evSig += `new ${argItf}(this.display, this.connection, ${
            ProtocolArguments[argType](argName, optional).signature
          })`;
        } else {
          evSig += ProtocolArguments[argType](argName, optional).signature;
        }
      }
    }

    return evSig;
  }

  static _generateIfEventGlue(importLines, codeLines, ev, opcode) {
    const evName = camelCase(ev.$.name);

    codeLines.push(`\tasync [${opcode}] (message: WlMessage) {\n`);
    const evSig = this._parseEventSignature(ev, importLines);
    if (evSig.length) {
      codeLines.push(`\t\tawait this.listener?.${evName}(${evSig})\n`);
    } else {
      codeLines.push(`\t\tawait this.listener?.${evName}()\n`);
    }

    codeLines.push("\t}\n\n");
  }

  _parseItfEvent(eventsOut, itfEvent) {
    const sinceVersion = itfEvent.$.hasOwnProperty("since")
      ? parseInt(itfEvent.$.since)
      : 1;
    const reqName = camelCase(itfEvent.$.name);

    // function docs
    if (itfEvent.hasOwnProperty("description")) {
      const description = itfEvent.description;
      description.forEach((val) => {
        eventsOut.write("\n\t/**\n");
        if (val.hasOwnProperty("_")) {
          val._.split("\n").forEach((line) => {
            eventsOut.write("\t *" + line + "\n");
          });
        }
        eventsOut.write("\t *\n");
        eventsOut.write(`\t * @since ${sinceVersion}\n`);
        eventsOut.write("\t *\n");
        eventsOut.write("\t */\n");
      });
    }

    // function
    eventsOut.write(`\t${reqName}(`);
    ProtocolParser._generateEventArgs(eventsOut, itfEvent);
    eventsOut.write("): void\n");
  }

  _parseRegistryBindRequest(codeLines) {
    codeLines.push(
      `\t/**
\t* Bind a new object to the global.
\t*
\t* Binds a new, client-created object to the server using the specified name as the identifier.
\t*
\t*/
\tbind<T extends Proxy> (name: number, interface_: string, proxyClass: { new(display: Display, connection: Connection, id: number): T }, version: number): T {
\t\treturn this.marshallConstructor(this.id, 0, proxyClass, [uint(name), string(interface_), uint(version), newObject()])
\t}\n`
    );
  }

  _parseItfRequest(codeLines, importLines, itfRequest, opcode) {
    const sinceVersion = itfRequest.$.hasOwnProperty("since")
      ? parseInt(itfRequest.$.since)
      : 1;

    const reqName = camelCase(itfRequest.$.name);

    // function docs
    if (itfRequest.hasOwnProperty("description")) {
      const description = itfRequest.description;
      description.forEach((val) => {
        codeLines.push("\n\t/**\n");
        if (val.hasOwnProperty("_")) {
          val._.split("\n").forEach((line) => {
            codeLines.push("\t *" + line + "\n");
          });
        }
        codeLines.push(`\t * @since ${sinceVersion}\n`);
        codeLines.push("\t *\n");
        codeLines.push("\t */\n");
      });
    }

    let itfName;
    // function args
    let argArray = "[";
    if (itfRequest.hasOwnProperty("arg")) {
      const reqArgs = itfRequest.arg;

      for (let i = 0; i < reqArgs.length; i++) {
        const arg = reqArgs[i];
        const argType = arg.$.type;
        const argName = camelCase(arg.$.name);
        const optional =
          arg.$.hasOwnProperty("allow-null") && arg.$["allow-null"] === "true";

        if (argType === "new_id") {
          if (arg.$.hasOwnProperty("interface")) {
            itfName = upperCamelCase(arg.$["interface"]);
          } else {
            itfName = "any";
          }
        }

        if (i !== 0) {
          argArray += ", ";
        }

        argArray += ProtocolArguments[argType](argName, optional).marshallGen;
      }
    }
    argArray += "]";

    // function
    let returnTsType = "void";
    if (itfRequest.hasOwnProperty("arg")) {
      const reqArgs = itfRequest.arg;
      reqArgs.forEach((arg) => {
        const argDescription = arg.$.summary || "";
        const argItf = arg.$["interface"];
        const argType = arg.$.type;
        if (argType === "new_id") {
          if (arg.$.hasOwnProperty("interface")) {
            returnTsType = `Westfield.${upperCamelCase(argItf)}Proxy`;
          } else {
            returnTsType = "Proxy";
          }
        }
      });
    }
    codeLines.push(`\t${reqName} (`);
    ProtocolParser._generateRequestArgs(codeLines, itfRequest);
    codeLines.push(`): ${returnTsType} {
    `);

    if (itfRequest.$.type === "destructor") {
      codeLines.push(`\tsuper.destroy()\n`);
    }

    if (itfName) {
      codeLines.push(
        `\t\treturn this.marshallConstructor(this.id, ${opcode}, Westfield.${itfName}Proxy, ${argArray})\n`
      );
    } else {
      codeLines.push(`\t\tthis.marshall(this.id, ${opcode}, ${argArray})\n`);
    }

    codeLines.push("\t}\n");
  }

  /**
   * @param {Object}jsonProtocol
   * @param {string}outDir
   * @param {Object}protocolItf
   * @param {WriteStream}out
   * @private
   */
  _writeProxy(jsonProtocol, outDir, protocolItf, out) {
    const itfNameOrig = protocolItf.$.name;
    const itfName = upperCamelCase(itfNameOrig);
    let itfVersion = 1;

    if (protocolItf.$.hasOwnProperty("version")) {
      itfVersion = parseInt(protocolItf.$.version);
    }

    console.log(`Processing interface ${itfName} v${itfVersion}`);

    const proxyName = `${itfName}Proxy`;

    const importLines = [];
    const codeLines = [];

    // class docs
    const description = protocolItf.description;
    if (description) {
      description.forEach((val) => {
        codeLines.push("\n/**\n");
        if (val.hasOwnProperty("_")) {
          val._.split("\n").forEach((line) => {
            codeLines.push(" *" + line + "\n");
          });
        }
        codeLines.push(" */\n");
      });
    }

    // class
    codeLines.push(`export class ${proxyName} extends Proxy {\n`);
    const eventsName = `${itfName}Events`;

    // constructor
    if (protocolItf.hasOwnProperty("event")) {
      codeLines.push(`\tlistener?: ${eventsName}`);
    }
    codeLines.push("\n\t/**\n");
    codeLines.push(
      "\t * Do not construct proxies directly. Instead use one of the factory methods from other proxies.\n"
    );
    codeLines.push("\t */\n");
    codeLines.push(
      "\tconstructor (display: Display, connection: Connection, id: number) {\n"
    );
    codeLines.push("\t\tsuper(display, connection, id)\n");
    codeLines.push("\t}\n\n");

    // requests
    if (protocolItf.hasOwnProperty("request")) {
      const itfRequests = protocolItf.request;
      for (let j = 0; j < itfRequests.length; j++) {
        // we need to special case for registry bind request.
        if (itfRequests[j].$.name === "bind" && itfNameOrig === "wl_registry") {
          this._parseRegistryBindRequest(
            codeLines,
            importLines,
            itfRequests[j],
            j
          );
        } else {
          this._parseItfRequest(codeLines, importLines, itfRequests[j], j);
        }
      }
    }

    // events
    if (protocolItf.hasOwnProperty("event")) {
      const itfEvents = protocolItf.event;
      this._writeEvents(jsonProtocol, outDir, itfEvents, eventsName, out);
    }

    // glue event functions
    if (protocolItf.hasOwnProperty("event")) {
      const itfEvents = protocolItf.event;
      for (let j = 0; j < itfEvents.length; j++) {
        const itfEvent = itfEvents[j];
        let since = "1";
        if (itfEvent.$.hasOwnProperty("since")) {
          since = itfEvent.$.since;
        }

        ProtocolParser._generateIfEventGlue(
          importLines,
          codeLines,
          itfEvent,
          j
        );
      }
    }

    codeLines.push("}\n");
    codeLines.push(
      `export const ${itfName}ProtocolName = '${itfNameOrig}'\n\n`
    );

    // enums
    if (protocolItf.hasOwnProperty("enum")) {
      // create new files to define enums
      const itfEnums = protocolItf.enum;
      for (let j = 0; j < itfEnums.length; j++) {
        const itfEnum = itfEnums[j];
        const enumName = upperCamelCase(itfEnum.$.name);

        codeLines.push(`export enum ${itfName}${enumName} {\n`);

        let firstArg = true;
        itfEnum.entry.forEach((entry) => {
          const entryName = camelCase(entry.$.name);
          const entryValue = entry.$.value;
          const entrySummary = entry.$.summary || "";

          if (!firstArg) {
            codeLines.push(",\n");
          }
          firstArg = false;

          codeLines.push("  /**\n");
          codeLines.push(`   * ${entrySummary}\n`);
          codeLines.push("   */\n");
          codeLines.push(`  _${entryName} = ${entryValue}`);
        });
        codeLines.push("\n}\n\n");
      }
    }

    importLines.forEach((line) => out.write(line));
    codeLines.forEach((line) => out.write(line));
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
      "import { Connection, WlMessage, fileDescriptor, uint, int, \n" +
        "\tfixed, object, objectOptional, newObject, string, stringOptional, \n" +
        "\tarray, arrayOptional, u, i, f, oOptional, o, n, sOptional, s, aOptional, a, h," +
        "\tFD, Fixed } from 'westfield-runtime-common'\n"
    );
    out.write("import * as Westfield from '.'\n");
    out.write(
      "import { Proxy, Display } from '../westfield-runtime-client'\n\n"
    );
    jsonProtocol.protocol.interface.forEach((itf) => {
      this._writeProxy(jsonProtocol, outDir, itf, out);
    });
    console.log("Done");
  }

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

  _writeEvents(jsonProtocol, outDir, itfEvents, eventsName, out) {
    out.write(`export interface ${eventsName} {\n`);

    for (let j = 0; j < itfEvents.length; j++) {
      const itfEvent = itfEvents[j];
      this._parseItfEvent(out, itfEvent);
    }

    out.write("}\n\n");
  }
}

module.exports = ProtocolParser;
