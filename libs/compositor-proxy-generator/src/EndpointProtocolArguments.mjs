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

'use strict'

export default class EndpointProtocolArguments {
  /**
   * @param {string}argName
   * @param {boolean}optional
   * @return {{signature: string, jsType: string, marshallGen: string}}
   */
  static fd (argName, optional) {
    return {
      signature: optional ? '?h' : 'h',
      jsType: optional ? '?number' : 'number',
      marshallGen: optional ? `fileDescriptorOptional(${argName})` : `fileDescriptor(${argName})`
    }
  }

  /**
   * @param {string}argName
   * @param {boolean}optional
   * @return {{signature: string, jsType: string, marshallGen: string}}
   */
  static uint (argName, optional) {
    return {
      signature: optional ? '?u' : 'u',
      jsType: optional ? '?number' : 'number',
      marshallGen: optional ? `uintOptional(${argName})` : `uint(${argName})`
    }
  }

  /**
   * @param {string}argName
   * @param {boolean}optional
   * @return {{signature: string, jsType: string, marshallGen: string}}
   */
  static int (argName, optional) {
    return {
      signature: optional ? '?i' : 'i',
      jsType: optional ? '?number' : 'number',
      marshallGen: optional ? `intOptional(${argName})` : `int(${argName})`
    }
  }

  /**
   * @param {string}argName
   * @param {boolean}optional
   * @return {{signature: string, jsType: string, marshallGen: string}}
   */
  static fixed (argName, optional) {
    return {
      signature: optional ? '?f' : 'f',
      jsType: optional ? '?Fixed' : 'Fixed',
      marshallGen: optional ? `fixedOptional(${argName})` : `fixed(${argName})`
    }
  }

  /**
   * @param {string}argName
   * @param {boolean}optional
   * @return {{signature: string, jsType: string, marshallGen: string}}
   */
  static object (argName, optional) {
    return {
      signature: optional ? '?o' : 'o',
      jsType: optional ? '?*' : '*',
      marshallGen: optional ? `objectOptional(${argName})` : `object(${argName})`
    }
  }

  /**
   * @param {string}argName
   * @param {boolean}optional
   * @return {{signature: string, jsType: string, marshallGen: string}}
   */
  static new_id (argName, optional) {
    return {
      signature: optional ? '?n' : 'n',
      jsType: 'number',
      marshallGen: 'newObject()'
    }
  }

  /**
   * @param {string}argName
   * @param {boolean}optional
   * @return {{signature: string, jsType: string, marshallGen: string}}
   */
  static string (argName, optional) {
    return {
      signature: optional ? '?s' : 's',
      jsType: optional ? '?string' : 'string',
      marshallGen: optional ? `stringOptional(${argName})` : `string(${argName})`
    }
  }

  /**
   * @param {string}argName
   * @param {boolean}optional
   * @return {{signature: string, jsType: string, marshallGen: string}}
   */
  static array (argName, optional) {
    return {
      signature: optional ? '?a' : 'a',
      jsType: optional ? '?TypedArray' : 'TypedArray',
      marshallGen: optional ? `arrayOptional(${argName})` : `array(${argName})`
    }
  }
}