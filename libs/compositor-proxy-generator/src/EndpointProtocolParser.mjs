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

import path from "path";
import fs from "fs";
import xml2js from "xml2js";
import camelCase from "camelcase";
import ProtocolArguments from "./EndpointProtocolArguments.mjs";

export default class EndpointProtocolParser {
  static _parseMessageInterfaces(itfMessage, itfName) {
    let argInterfaces = "[";
    if (itfMessage.hasOwnProperty("arg")) {
      const evArgs = itfMessage.arg;
      for (let i = 0; i < evArgs.length; i++) {
        const arg = evArgs[i];
        const argType = arg.$.type;
        let interface_ = "null";
        if (argType === "object" || argType === "new_id") {
          const argInterface = arg.$.interface;
          if (argInterface != null) {
            if (argInterface === itfName) {
              interface_ = "wlInterface";
            } else {
              interface_ = `require('./${argInterface}_interface')`;
            }
          }
        }

        if (i !== 0) {
          argInterfaces += ", ";
        }
        argInterfaces += interface_;
      }
    }
    argInterfaces += "]";

    return argInterfaces;
  }

  static _parseMessageSignature(itfMessage) {
    let evSig = "";
    if (itfMessage.hasOwnProperty("arg")) {
      const evArgs = itfMessage.arg;
      for (let i = 0; i < evArgs.length; i++) {
        const arg = evArgs[i];

        const argName = camelCase(arg.$.name);
        const optional =
          arg.$.hasOwnProperty("allow-null") && arg.$["allow-null"] === "true";
        const argType = arg.$.type;

        evSig += ProtocolArguments[argType](argName, optional).signature;
      }
    }

    return evSig;
  }

  static _generateIfRequestGlue(out, itfRequest, opcode, protocolItf) {
    let evSig;
    if (protocolItf.$.name === "wl_registry" && itfRequest.$.name === "bind") {
      evSig = "usun";
    } else {
      evSig = EndpointProtocolParser._parseMessageSignature(itfRequest);
    }
    const evName = camelCase(itfRequest.$.name);
    if (evSig.includes("n")) {
      out.write(`\tR${opcode} (message) {\n`);
      out.write(`\t\tconst args = unmarshallArgs(message,'${evSig}')\n`);
      out.write(`\t\treturn this.requestHandlers.${evName}(...args)\n`);
      out.write("\t}\n");
    }
  }

  static _generateIfEventGlue(out, itfEvent, opcode, protocolItf) {
    let evSig;
    if (protocolItf.$.name === "wl_registry" && itfEvent.$.name === "bind") {
      evSig = "usun";
    } else {
      evSig = EndpointProtocolParser._parseMessageSignature(itfEvent);
    }
    const evName = camelCase(itfEvent.$.name);
    if (evSig.includes("n")) {
      out.write(`\tE${opcode} (message) {\n`);
      out.write(`\t\tconst args = unmarshallArgs(message,'${evSig}')\n`);
      out.write(`\t\treturn this.eventHandlers.${evName}(...args)\n`);
      out.write("\t}\n");
    }
  }

  /**
   * @param {Object}jsonProtocol
   * @param {string}outDir
   * @param {Object}protocolItf
   * @private
   */
  _writeInterface(jsonProtocol, outDir, protocolItf) {
    const itfName = protocolItf.$.name;
    let itfVersion = 1;
    if (protocolItf.$.hasOwnProperty("version")) {
      itfVersion = protocolItf.$.version;
    }

    const resourceName = `${itfName}_interface`;
    const interfaceOut = fs.createWriteStream(
      path.join(outDir, `${resourceName}.js`)
    );

    interfaceOut.write(
      `const { createWlInterface, createWlMessage, initWlInterface } = require('westfield-proxy')\n\n`
    );
    interfaceOut.write(`const wlInterface = createWlInterface()\n`);
    interfaceOut.write(`module.exports = wlInterface\n`);
    interfaceOut.write(`const requests = [\n`);
    if (protocolItf.hasOwnProperty("request")) {
      const itfRequests = protocolItf.request;
      for (let i = 0; i < itfRequests.length; i++) {
        const itfRequest = itfRequests[i];
        const messageName = itfRequest.$.name;
        const signature =
          EndpointProtocolParser._parseMessageSignature(itfRequest);
        if (i !== 0) {
          interfaceOut.write(", \n");
        }
        interfaceOut.write(
          `\tcreateWlMessage('${messageName}', '${signature}', ${EndpointProtocolParser._parseMessageInterfaces(
            itfRequest,
            itfName
          )})`
        );
      }
    }
    interfaceOut.write(`\n]\n\n`);

    interfaceOut.write(`const events = [\n`);
    if (protocolItf.hasOwnProperty("event")) {
      const itfEvents = protocolItf.event;
      for (let i = 0; i < itfEvents.length; i++) {
        const itfEvent = itfEvents[i];
        const messageName = itfEvent.$.name;
        const signature =
          EndpointProtocolParser._parseMessageSignature(itfEvent);
        if (i !== 0) {
          interfaceOut.write(", \n");
        }
        interfaceOut.write(
          `\tcreateWlMessage('${messageName}', '${signature}', ${EndpointProtocolParser._parseMessageInterfaces(
            itfEvent,
            itfName
          )})`
        );
      }
    }
    interfaceOut.write(`\n]\n\n`);

    interfaceOut.write(
      `initWlInterface(wlInterface, '${itfName}', ${itfVersion}, requests, events)\n`
    );
  }

  /**
   * @param {Object}jsonProtocol
   * @param {string}outDir
   * @param {Object}protocolItf
   * @private
   */
  _writeInterceptor(jsonProtocol, outDir, protocolItf) {
    const itfName = protocolItf.$.name;

    const resourceName = `${itfName}_interceptor`;
    const interceptorOut = fs.createWriteStream(
      path.join(outDir, `${resourceName}.js`)
    );

    interceptorOut.write(
      `const { createWlResource, unmarshallArgs } = require('westfield-proxy')\n\n`
    );

    // class
    interceptorOut.write(`class ${resourceName} {\n`);

    // constructor
    interceptorOut.write(
      "\tconstructor (wlClient, interceptors, version, wlResource, userData, creationArgs, id) {\n"
    );
    interceptorOut.write("\t\tthis.wlClient = wlClient\n");
    interceptorOut.write("\t\tthis.wlResource = wlResource\n");
    interceptorOut.write("\t\tthis.userData = userData\n");
    interceptorOut.write("\t\tthis.creationArgs = creationArgs\n");
    interceptorOut.write("\t\tthis.id = id\n");

    // constructor request handlers
    interceptorOut.write("\t\tthis.requestHandlers = {\n");
    const constructorRequests = this._getConstructorRequest(protocolItf);
    if (constructorRequests.length) {
      this._generateRequestFactoryInterceptionHandlers(
        interceptorOut,
        constructorRequests,
        protocolItf
      );
    }
    interceptorOut.write("\t\t}\n");

    // constructor event handlers
    interceptorOut.write("\t\tthis.eventHandlers = {\n");
    const constructorEvents = this._getConstructorEvent(protocolItf);
    if (constructorEvents.length) {
      this._generateEventFactoryInterceptionHandlers(
        interceptorOut,
        constructorEvents,
        protocolItf
      );
    }
    interceptorOut.write("\t\t}\n");
    interceptorOut.write("\t}\n\n");

    // glue functions
    if (protocolItf.hasOwnProperty("request")) {
      const itfRequests = protocolItf.request;
      for (let j = 0; j < itfRequests.length; j++) {
        const itfRequest = itfRequests[j];
        EndpointProtocolParser._generateIfRequestGlue(
          interceptorOut,
          itfRequest,
          j,
          protocolItf
        );
      }
    }
    if (protocolItf.hasOwnProperty("event")) {
      const itfEvents = protocolItf.event;
      for (let j = 0; j < itfEvents.length; j++) {
        const itfRequest = itfEvents[j];
        EndpointProtocolParser._generateIfEventGlue(
          interceptorOut,
          itfRequest,
          j,
          protocolItf
        );
      }
    }

    interceptorOut.write("}\n");

    interceptorOut.write(`module.exports = ${resourceName}\n`);
    interceptorOut.end();
  }

  /**
   * @param {Object}jsonProtocol
   * @param {string}outDir
   * @param {Object}protocolItf
   * @private
   */
  _parseInterface(jsonProtocol, outDir, protocolItf) {
    let itfVersion = 1;
    if (protocolItf.$.hasOwnProperty("version")) {
      itfVersion = parseInt(protocolItf.$.version);
    }
    console.log(`Processing interface ${protocolItf.$.name} v${itfVersion}`);

    this._writeInterface(jsonProtocol, outDir, protocolItf);
    this._writeInterceptor(jsonProtocol, outDir, protocolItf);
  }

  /**
   * @param {Object}jsonProtocol
   * @param {string}outDir
   * @private
   */
  _parseProtocol(jsonProtocol, outDir) {
    jsonProtocol.protocol.interface.forEach((itf) => {
      this._parseInterface(jsonProtocol, outDir, itf);
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

  _getConstructorRequest(protocolItf) {
    const constructorRequests = [];
    if (protocolItf.hasOwnProperty("request")) {
      const itfRequests = protocolItf.request;
      for (let j = 0; j < itfRequests.length; j++) {
        const itfRequest = itfRequests[j];
        if (itfRequest.hasOwnProperty("arg")) {
          const reqArg = itfRequest.arg;
          for (let i = 0; i < reqArg.length; i++) {
            const arg = reqArg[i];
            if (arg.$.type === "new_id") {
              constructorRequests.push(itfRequest);
            }
          }
        }
      }
    }

    return constructorRequests;
  }

  _getConstructorEvent(protocolItf) {
    const constructorEvents = [];
    if (protocolItf.hasOwnProperty("event")) {
      const itfEvents = protocolItf.event;
      for (let j = 0; j < itfEvents.length; j++) {
        const itfEvent = itfEvents[j];
        if (itfEvent.hasOwnProperty("arg")) {
          const evArg = itfEvent.arg;
          for (let i = 0; i < evArg.length; i++) {
            const arg = evArg[i];
            if (arg.$.type === "new_id") {
              constructorEvents.push(itfEvent);
            }
          }
        }
      }
    }

    return constructorEvents;
  }

  _generateRequestFactoryInterceptionHandlers(
    resourceOut,
    constructorRequests,
    protocolItf
  ) {
    constructorRequests.forEach((itfRequest) => {
      let resourceName = null;
      let resourceIdArgName = null;

      const reqName = itfRequest.$.name;
      resourceOut.write(`\t\t\t${camelCase(reqName)}: (`);

      if (reqName === "bind" && protocolItf.$.name === "wl_registry") {
        // special case registry bind, xml signature is 'un', generated signature should be 'usun'.
        resourceOut.write(`name, interface_, version, id`);
        resourceName = "${interface_}";
      } else {
        const evArgs = itfRequest.arg;
        for (let i = 0; i < evArgs.length; i++) {
          const reqArg = evArgs[i];
          if (reqArg.$.type === "new_id") {
            resourceOut.write(`${reqArg.$.name}`);
            resourceName = reqArg.$.interface;
            resourceIdArgName = reqArg.$.name;
            resourceOut.write(", ...constructionArgs");
            break
          }
        }
      }

      resourceOut.write(`) => {\n`);
      if (reqName === "bind" && protocolItf.$.name === "wl_registry") {
        resourceOut.write(
          `\t\t\t\tif (require('westfield-proxy').nativeGlobalNames.includes(name)) {\n`
        );
        resourceOut.write(`\t\t\t\t\treturn { native: true, browser: false }\n`);
        resourceOut.write(`\t\t\t\t} else {\n`);
        resourceOut.write(
          `\t\t\t\t\tconst remoteResource = createWlResource(wlClient, id, version, require(\`./${resourceName}_interface\`))\n`
        );
        resourceOut.write(
          `\t\t\t\t\tinterceptors[id] =  new (require(\`./${resourceName}_interceptor\`))(wlClient, interceptors, version, remoteResource, userData)\n`
        );
        resourceOut.write(`\t\t\t\t\treturn { native: false, browser: true }\n`);
        resourceOut.write(`\t\t\t\t}\n`);
      } else {
        if (reqName === "get_registry" && protocolItf.$.name === "wl_display") {
          resourceOut.write(
            `\t\t\t\t\tinterceptors[${resourceIdArgName}] =  new (require(\`./${resourceName}_interceptor\`))(wlClient, interceptors, version, null, userData)\n`
          );
          resourceOut.write(`\t\t\t\t\treturn { native: true, browser: true }\n`);
        } else if (reqName === "sync" && protocolItf.$.name === "wl_display") {
          resourceOut.write(
            `\t\t\t\t\tinterceptors[${resourceIdArgName}] =  new (require(\`./${resourceName}_interceptor\`))(wlClient, interceptors, version, null, userData)\n`
          );
          resourceOut.write(`\t\t\t\t\treturn { native: true, browser: true }\n`);
        } else {
          resourceOut.write(
            `\t\t\t\t\tconst remoteResource = createWlResource(wlClient, ${resourceIdArgName}, version, require(\`./${resourceName}_interface\`))\n`
          );
          resourceOut.write(
            `\t\t\t\t\tinterceptors[${resourceIdArgName}] =  new (require(\`./${resourceName}_interceptor\`))(wlClient, interceptors, version, remoteResource, userData, constructionArgs, ${resourceIdArgName})\n`
          );
          resourceOut.write(`\t\t\t\t\treturn { native: false, browser: true }\n`);
        }
      }
      resourceOut.write(`\t\t\t},\n`);
    });
  }

  _generateEventFactoryInterceptionHandlers(
    resourceOut,
    constructorRequests,
    protocolItf
  ) {
    constructorRequests.forEach((itfRequest) => {
      let resourceName = null;
      let resourceIdArgName = null;

      const reqName = itfRequest.$.name;
      resourceOut.write(`\t\t\t${camelCase(reqName)}: (`);

      const evArgs = itfRequest.arg;
      for (let i = 0; i < evArgs.length; i++) {
        const reqArg = evArgs[i];
        if (i !== 0) {
          resourceOut.write(", ");
        }
        resourceOut.write(`${reqArg.$.name}`);
        if (reqArg.$.type === "new_id") {
          resourceName = reqArg.$.interface;
          resourceIdArgName = reqArg.$.name;
        }
      }

      resourceOut.write(`) => {\n`);

      resourceOut.write(
        `\t\t\t\t\tconst remoteResource = createWlResource(wlClient, ${resourceIdArgName}, version, require(\`./${resourceName}_interface\`))\n`
      );
      // FIXME this requires the server side ids to be exactly in sync with the server side ids in the browser, instead we should create a separate native method that can create a server side resource with a known id (instead of 0).
      //resourceOut.write(`\t\t\t\t\tconst remoteResource = Endpoint.createWlResource(wlClient, 0, version, require(\`./${resourceName}_interface\`))\n`)

      resourceOut.write(
        `\t\t\t\t\tinterceptors[${resourceIdArgName}] =  new (require(\`./${resourceName}_interceptor\`))(wlClient, interceptors, version, remoteResource, userData)\n`
      );
      resourceOut.write(`\t\t\t\t\treturn { native: false, browser: true }\n`);

      resourceOut.write(`\t\t\t},\n`);
    });
  }
}
