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

class ProtocolArguments {
  /**
   * @param {string}argName
   * @return {{signature: string, jsType: string, marshallGen: string}}
   */
  static fd(argName) {
    return {
      signature: "h(message)",
      jsType: ": FD",
      marshallGen: `fileDescriptor(${argName})`,
    };
  }

  /**
   * @param {string}argName
   * @return {{signature: string, jsType: string, marshallGen: string}}
   */
  static uint(argName) {
    return {
      signature: "u(message)",
      jsType: ": number",
      marshallGen: `uint(${argName})`,
    };
  }

  /**
   * @param {string}argName
   * @return {{signature: string, jsType: string, marshallGen: string}}
   */
  static int(argName) {
    return {
      signature: "i(message)",
      jsType: ": number",
      marshallGen: `int(${argName})`,
    };
  }

  /**
   * @param {string}argName
   * @return {{signature: string, jsType: string, marshallGen: string}}
   */
  static fixed(argName) {
    return {
      signature: "f(message)",
      jsType: ": Fixed",
      marshallGen: `fixed(${argName})`,
    };
  }

  /**
   * @param {string}argName
   * @param {boolean}optional
   * @param {string}proxyName
   * @return {{signature: string, jsType: string, marshallGen: string}}
   */
  static object(argName, optional, proxyName) {
    return {
      signature: optional
        ? `oOptional(message, this.connection)`
        : `o(message, this.connection)`,
      jsType: optional
        ? `: Westfield.${proxyName}|undefined`
        : `: Westfield.${proxyName}`,
      marshallGen: optional
        ? `objectOptional(${argName})`
        : `object(${argName})`,
    };
  }

  /**
   * @param {string}argName
   * @param {boolean}optional
   * @param {string}proxyName
   * @return {{signature: string, jsType: string, marshallGen: string}}
   */
  static new_id(argName, optional, proxyName) {
    return {
      signature: "n(message)",
      jsType: `: Westfield.${proxyName}`,
      marshallGen: "newObject()",
    };
  }

  /**
   * @param {string}argName
   * @param {boolean}optional
   * @return {{signature: string, jsType: string, marshallGen: string}}
   */
  static string(argName, optional) {
    return {
      signature: optional ? `sOptional(message)` : `s(message)`,
      jsType: optional ? ": string|undefined" : ": string",
      marshallGen: optional
        ? `stringOptional(${argName})`
        : `string(${argName})`,
    };
  }

  /**
   * @param {string}argName
   * @param {boolean}optional
   * @return {{signature: string, jsType: string, marshallGen: string}}
   */
  static array(argName, optional) {
    return {
      signature: optional ? `aOptional(message)` : `a(message)`,
      jsType: optional ? ": ArrayBuffer|undefined" : ": ArrayBuffer",
      marshallGen: optional ? `arrayOptional(${argName})` : `array(${argName})`,
    };
  }
}

module.exports = ProtocolArguments;
