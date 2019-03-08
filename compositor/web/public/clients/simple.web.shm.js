/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../westfield/client/runtime/index.js":
/*!********************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/index.js ***!
  \********************************************************/
/*! exports provided: webFS, display, WlDisplayProxy, WlRegistryProxy, WlCallbackProxy, WlCompositorProxy, WlBufferProxy, WlDataOfferProxy, WlDataSourceProxy, WlDataDeviceProxy, WlDataDeviceManagerProxy, WlShellProxy, WlShellSurfaceProxy, WlSurfaceProxy, WlSeatProxy, WlPointerProxy, WlKeyboardProxy, WlTouchProxy, WlOutputProxy, WlRegionProxy, WlSubcompositorProxy, WlSubsurfaceProxy, WlDisplayEvents, WlRegistryEvents, WlCallbackEvents, WlBufferEvents, WlDataOfferEvents, WlDataSourceEvents, WlDataDeviceEvents, WlShellSurfaceEvents, WlSurfaceEvents, WlSeatEvents, WlPointerEvents, WlKeyboardEvents, WlTouchEvents, WlOutputEvents, XdgWmBaseProxy, XdgPositionerProxy, XdgSurfaceProxy, XdgToplevelProxy, XdgPopupProxy, XdgWmBaseEvents, XdgSurfaceEvents, XdgToplevelEvents, XdgPopupEvents, WebArrayBufferProxy, WebShmProxy, WebArrayBufferEvents, WebShmEvents */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "webFS", function() { return webFS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "display", function() { return display; });
/* harmony import */ var _src_WebFS__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/WebFS */ "../../westfield/client/runtime/src/WebFS.js");
/* harmony import */ var _src_Display__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/Display */ "../../westfield/client/runtime/src/Display.js");
/* harmony import */ var _src_protocol_WlDisplayProxy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/protocol/WlDisplayProxy */ "../../westfield/client/runtime/src/protocol/WlDisplayProxy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDisplayProxy", function() { return _src_protocol_WlDisplayProxy__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _src_protocol_WlRegistryProxy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/protocol/WlRegistryProxy */ "../../westfield/client/runtime/src/protocol/WlRegistryProxy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlRegistryProxy", function() { return _src_protocol_WlRegistryProxy__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* harmony import */ var _src_protocol_WlCallbackProxy__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./src/protocol/WlCallbackProxy */ "../../westfield/client/runtime/src/protocol/WlCallbackProxy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlCallbackProxy", function() { return _src_protocol_WlCallbackProxy__WEBPACK_IMPORTED_MODULE_4__["default"]; });

/* harmony import */ var _src_protocol_WlCompositorProxy__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./src/protocol/WlCompositorProxy */ "../../westfield/client/runtime/src/protocol/WlCompositorProxy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlCompositorProxy", function() { return _src_protocol_WlCompositorProxy__WEBPACK_IMPORTED_MODULE_5__["default"]; });

/* harmony import */ var _src_protocol_WlBufferProxy__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./src/protocol/WlBufferProxy */ "../../westfield/client/runtime/src/protocol/WlBufferProxy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlBufferProxy", function() { return _src_protocol_WlBufferProxy__WEBPACK_IMPORTED_MODULE_6__["default"]; });

/* harmony import */ var _src_protocol_WlDataOfferProxy__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./src/protocol/WlDataOfferProxy */ "../../westfield/client/runtime/src/protocol/WlDataOfferProxy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataOfferProxy", function() { return _src_protocol_WlDataOfferProxy__WEBPACK_IMPORTED_MODULE_7__["default"]; });

/* harmony import */ var _src_protocol_WlDataSourceProxy__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./src/protocol/WlDataSourceProxy */ "../../westfield/client/runtime/src/protocol/WlDataSourceProxy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataSourceProxy", function() { return _src_protocol_WlDataSourceProxy__WEBPACK_IMPORTED_MODULE_8__["default"]; });

/* harmony import */ var _src_protocol_WlDataDeviceProxy__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./src/protocol/WlDataDeviceProxy */ "../../westfield/client/runtime/src/protocol/WlDataDeviceProxy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataDeviceProxy", function() { return _src_protocol_WlDataDeviceProxy__WEBPACK_IMPORTED_MODULE_9__["default"]; });

/* harmony import */ var _src_protocol_WlDataDeviceManagerProxy__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./src/protocol/WlDataDeviceManagerProxy */ "../../westfield/client/runtime/src/protocol/WlDataDeviceManagerProxy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataDeviceManagerProxy", function() { return _src_protocol_WlDataDeviceManagerProxy__WEBPACK_IMPORTED_MODULE_10__["default"]; });

/* harmony import */ var _src_protocol_WlShellProxy__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./src/protocol/WlShellProxy */ "../../westfield/client/runtime/src/protocol/WlShellProxy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShellProxy", function() { return _src_protocol_WlShellProxy__WEBPACK_IMPORTED_MODULE_11__["default"]; });

/* harmony import */ var _src_protocol_WlShellSurfaceProxy__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./src/protocol/WlShellSurfaceProxy */ "../../westfield/client/runtime/src/protocol/WlShellSurfaceProxy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShellSurfaceProxy", function() { return _src_protocol_WlShellSurfaceProxy__WEBPACK_IMPORTED_MODULE_12__["default"]; });

/* harmony import */ var _src_protocol_WlSurfaceProxy__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./src/protocol/WlSurfaceProxy */ "../../westfield/client/runtime/src/protocol/WlSurfaceProxy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSurfaceProxy", function() { return _src_protocol_WlSurfaceProxy__WEBPACK_IMPORTED_MODULE_13__["default"]; });

/* harmony import */ var _src_protocol_WlSeatProxy__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./src/protocol/WlSeatProxy */ "../../westfield/client/runtime/src/protocol/WlSeatProxy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSeatProxy", function() { return _src_protocol_WlSeatProxy__WEBPACK_IMPORTED_MODULE_14__["default"]; });

/* harmony import */ var _src_protocol_WlPointerProxy__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./src/protocol/WlPointerProxy */ "../../westfield/client/runtime/src/protocol/WlPointerProxy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlPointerProxy", function() { return _src_protocol_WlPointerProxy__WEBPACK_IMPORTED_MODULE_15__["default"]; });

/* harmony import */ var _src_protocol_WlKeyboardProxy__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./src/protocol/WlKeyboardProxy */ "../../westfield/client/runtime/src/protocol/WlKeyboardProxy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlKeyboardProxy", function() { return _src_protocol_WlKeyboardProxy__WEBPACK_IMPORTED_MODULE_16__["default"]; });

/* harmony import */ var _src_protocol_WlTouchProxy__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./src/protocol/WlTouchProxy */ "../../westfield/client/runtime/src/protocol/WlTouchProxy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlTouchProxy", function() { return _src_protocol_WlTouchProxy__WEBPACK_IMPORTED_MODULE_17__["default"]; });

/* harmony import */ var _src_protocol_WlOutputProxy__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./src/protocol/WlOutputProxy */ "../../westfield/client/runtime/src/protocol/WlOutputProxy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlOutputProxy", function() { return _src_protocol_WlOutputProxy__WEBPACK_IMPORTED_MODULE_18__["default"]; });

/* harmony import */ var _src_protocol_WlRegionProxy__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./src/protocol/WlRegionProxy */ "../../westfield/client/runtime/src/protocol/WlRegionProxy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlRegionProxy", function() { return _src_protocol_WlRegionProxy__WEBPACK_IMPORTED_MODULE_19__["default"]; });

/* harmony import */ var _src_protocol_WlSubcompositorProxy__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./src/protocol/WlSubcompositorProxy */ "../../westfield/client/runtime/src/protocol/WlSubcompositorProxy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSubcompositorProxy", function() { return _src_protocol_WlSubcompositorProxy__WEBPACK_IMPORTED_MODULE_20__["default"]; });

/* harmony import */ var _src_protocol_WlSubsurfaceProxy__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./src/protocol/WlSubsurfaceProxy */ "../../westfield/client/runtime/src/protocol/WlSubsurfaceProxy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSubsurfaceProxy", function() { return _src_protocol_WlSubsurfaceProxy__WEBPACK_IMPORTED_MODULE_21__["default"]; });

/* harmony import */ var _src_protocol_WlDisplayEvents__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./src/protocol/WlDisplayEvents */ "../../westfield/client/runtime/src/protocol/WlDisplayEvents.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDisplayEvents", function() { return _src_protocol_WlDisplayEvents__WEBPACK_IMPORTED_MODULE_22__["default"]; });

/* harmony import */ var _src_protocol_WlRegistryEvents__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./src/protocol/WlRegistryEvents */ "../../westfield/client/runtime/src/protocol/WlRegistryEvents.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlRegistryEvents", function() { return _src_protocol_WlRegistryEvents__WEBPACK_IMPORTED_MODULE_23__["default"]; });

/* harmony import */ var _src_protocol_WlCallbackEvents__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./src/protocol/WlCallbackEvents */ "../../westfield/client/runtime/src/protocol/WlCallbackEvents.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlCallbackEvents", function() { return _src_protocol_WlCallbackEvents__WEBPACK_IMPORTED_MODULE_24__["default"]; });

/* harmony import */ var _src_protocol_WlBufferEvents__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./src/protocol/WlBufferEvents */ "../../westfield/client/runtime/src/protocol/WlBufferEvents.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlBufferEvents", function() { return _src_protocol_WlBufferEvents__WEBPACK_IMPORTED_MODULE_25__["default"]; });

/* harmony import */ var _src_protocol_WlDataOfferEvents__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./src/protocol/WlDataOfferEvents */ "../../westfield/client/runtime/src/protocol/WlDataOfferEvents.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataOfferEvents", function() { return _src_protocol_WlDataOfferEvents__WEBPACK_IMPORTED_MODULE_26__["default"]; });

/* harmony import */ var _src_protocol_WlDataSourceEvents__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./src/protocol/WlDataSourceEvents */ "../../westfield/client/runtime/src/protocol/WlDataSourceEvents.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataSourceEvents", function() { return _src_protocol_WlDataSourceEvents__WEBPACK_IMPORTED_MODULE_27__["default"]; });

/* harmony import */ var _src_protocol_WlDataDeviceEvents__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./src/protocol/WlDataDeviceEvents */ "../../westfield/client/runtime/src/protocol/WlDataDeviceEvents.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataDeviceEvents", function() { return _src_protocol_WlDataDeviceEvents__WEBPACK_IMPORTED_MODULE_28__["default"]; });

/* harmony import */ var _src_protocol_WlShellSurfaceEvents__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./src/protocol/WlShellSurfaceEvents */ "../../westfield/client/runtime/src/protocol/WlShellSurfaceEvents.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShellSurfaceEvents", function() { return _src_protocol_WlShellSurfaceEvents__WEBPACK_IMPORTED_MODULE_29__["default"]; });

/* harmony import */ var _src_protocol_WlSurfaceEvents__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./src/protocol/WlSurfaceEvents */ "../../westfield/client/runtime/src/protocol/WlSurfaceEvents.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSurfaceEvents", function() { return _src_protocol_WlSurfaceEvents__WEBPACK_IMPORTED_MODULE_30__["default"]; });

/* harmony import */ var _src_protocol_WlSeatEvents__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./src/protocol/WlSeatEvents */ "../../westfield/client/runtime/src/protocol/WlSeatEvents.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSeatEvents", function() { return _src_protocol_WlSeatEvents__WEBPACK_IMPORTED_MODULE_31__["default"]; });

/* harmony import */ var _src_protocol_WlPointerEvents__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./src/protocol/WlPointerEvents */ "../../westfield/client/runtime/src/protocol/WlPointerEvents.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlPointerEvents", function() { return _src_protocol_WlPointerEvents__WEBPACK_IMPORTED_MODULE_32__["default"]; });

/* harmony import */ var _src_protocol_WlKeyboardEvents__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./src/protocol/WlKeyboardEvents */ "../../westfield/client/runtime/src/protocol/WlKeyboardEvents.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlKeyboardEvents", function() { return _src_protocol_WlKeyboardEvents__WEBPACK_IMPORTED_MODULE_33__["default"]; });

/* harmony import */ var _src_protocol_WlTouchEvents__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ./src/protocol/WlTouchEvents */ "../../westfield/client/runtime/src/protocol/WlTouchEvents.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlTouchEvents", function() { return _src_protocol_WlTouchEvents__WEBPACK_IMPORTED_MODULE_34__["default"]; });

/* harmony import */ var _src_protocol_WlOutputEvents__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ./src/protocol/WlOutputEvents */ "../../westfield/client/runtime/src/protocol/WlOutputEvents.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlOutputEvents", function() { return _src_protocol_WlOutputEvents__WEBPACK_IMPORTED_MODULE_35__["default"]; });

/* harmony import */ var _src_protocol_XdgWmBaseProxy__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ./src/protocol/XdgWmBaseProxy */ "../../westfield/client/runtime/src/protocol/XdgWmBaseProxy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgWmBaseProxy", function() { return _src_protocol_XdgWmBaseProxy__WEBPACK_IMPORTED_MODULE_36__["default"]; });

/* harmony import */ var _src_protocol_XdgPositionerProxy__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ./src/protocol/XdgPositionerProxy */ "../../westfield/client/runtime/src/protocol/XdgPositionerProxy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgPositionerProxy", function() { return _src_protocol_XdgPositionerProxy__WEBPACK_IMPORTED_MODULE_37__["default"]; });

/* harmony import */ var _src_protocol_XdgSurfaceProxy__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! ./src/protocol/XdgSurfaceProxy */ "../../westfield/client/runtime/src/protocol/XdgSurfaceProxy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgSurfaceProxy", function() { return _src_protocol_XdgSurfaceProxy__WEBPACK_IMPORTED_MODULE_38__["default"]; });

/* harmony import */ var _src_protocol_XdgToplevelProxy__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! ./src/protocol/XdgToplevelProxy */ "../../westfield/client/runtime/src/protocol/XdgToplevelProxy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgToplevelProxy", function() { return _src_protocol_XdgToplevelProxy__WEBPACK_IMPORTED_MODULE_39__["default"]; });

/* harmony import */ var _src_protocol_XdgPopupProxy__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! ./src/protocol/XdgPopupProxy */ "../../westfield/client/runtime/src/protocol/XdgPopupProxy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgPopupProxy", function() { return _src_protocol_XdgPopupProxy__WEBPACK_IMPORTED_MODULE_40__["default"]; });

/* harmony import */ var _src_protocol_XdgWmBaseEvents__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(/*! ./src/protocol/XdgWmBaseEvents */ "../../westfield/client/runtime/src/protocol/XdgWmBaseEvents.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgWmBaseEvents", function() { return _src_protocol_XdgWmBaseEvents__WEBPACK_IMPORTED_MODULE_41__["default"]; });

/* harmony import */ var _src_protocol_XdgSurfaceEvents__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(/*! ./src/protocol/XdgSurfaceEvents */ "../../westfield/client/runtime/src/protocol/XdgSurfaceEvents.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgSurfaceEvents", function() { return _src_protocol_XdgSurfaceEvents__WEBPACK_IMPORTED_MODULE_42__["default"]; });

/* harmony import */ var _src_protocol_XdgToplevelEvents__WEBPACK_IMPORTED_MODULE_43__ = __webpack_require__(/*! ./src/protocol/XdgToplevelEvents */ "../../westfield/client/runtime/src/protocol/XdgToplevelEvents.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgToplevelEvents", function() { return _src_protocol_XdgToplevelEvents__WEBPACK_IMPORTED_MODULE_43__["default"]; });

/* harmony import */ var _src_protocol_XdgPopupEvents__WEBPACK_IMPORTED_MODULE_44__ = __webpack_require__(/*! ./src/protocol/XdgPopupEvents */ "../../westfield/client/runtime/src/protocol/XdgPopupEvents.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgPopupEvents", function() { return _src_protocol_XdgPopupEvents__WEBPACK_IMPORTED_MODULE_44__["default"]; });

/* harmony import */ var _src_protocol_WebArrayBufferProxy__WEBPACK_IMPORTED_MODULE_45__ = __webpack_require__(/*! ./src/protocol/WebArrayBufferProxy */ "../../westfield/client/runtime/src/protocol/WebArrayBufferProxy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebArrayBufferProxy", function() { return _src_protocol_WebArrayBufferProxy__WEBPACK_IMPORTED_MODULE_45__["default"]; });

/* harmony import */ var _src_protocol_WebShmProxy__WEBPACK_IMPORTED_MODULE_46__ = __webpack_require__(/*! ./src/protocol/WebShmProxy */ "../../westfield/client/runtime/src/protocol/WebShmProxy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebShmProxy", function() { return _src_protocol_WebShmProxy__WEBPACK_IMPORTED_MODULE_46__["default"]; });

/* harmony import */ var _src_protocol_WebArrayBufferEvents__WEBPACK_IMPORTED_MODULE_47__ = __webpack_require__(/*! ./src/protocol/WebArrayBufferEvents */ "../../westfield/client/runtime/src/protocol/WebArrayBufferEvents.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebArrayBufferEvents", function() { return _src_protocol_WebArrayBufferEvents__WEBPACK_IMPORTED_MODULE_47__["default"]; });

/* harmony import */ var _src_protocol_WebShmEvents__WEBPACK_IMPORTED_MODULE_48__ = __webpack_require__(/*! ./src/protocol/WebShmEvents */ "../../westfield/client/runtime/src/protocol/WebShmEvents.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebShmEvents", function() { return _src_protocol_WebShmEvents__WEBPACK_IMPORTED_MODULE_48__["default"]; });

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






// core wayland protocol




// import WlShmPoolProxy from './src/protocol/WlShmPoolProxy'
// import WlShmProxy from './src/protocol/WlShmProxy'



















// import WlShmEvents from './src/protocol/WlShmEvents'












// xdg_shell










// web shm





/**
 * @type {WebFS}
 */
const webFS = _src_WebFS__WEBPACK_IMPORTED_MODULE_0__["default"].create(_uuidv4())
/**
 * @type {Display}
 */
const display = new _src_Display__WEBPACK_IMPORTED_MODULE_1__["default"]()

/**
 * @returns {string}
 * @private
 */
function _uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ self.crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

/**
 * @param {Connection}connection
 * @param {WebFS}webFS
 * @private
 */
function _setupMessageHandling (connection, webFS) {
  /**
   * @type {Array<Array<{buffer: ArrayBuffer, fds: Array<WebFD>}>>}
   * @private
   */
  const _flushQueue = []
  /**
   * @param {MessageEvent}event
   */
  onmessage = (event) => {
    const webWorkerMessage = /** @type {{protocolMessage:ArrayBuffer, meta:Array<Transferable>}} */event.data
    if (webWorkerMessage.protocolMessage instanceof ArrayBuffer) {
      const buffer = new Uint32Array(/** @type {ArrayBuffer} */webWorkerMessage.protocolMessage)
      const fds = webWorkerMessage.meta.map(transferable => {
        if (transferable instanceof ArrayBuffer) {
          return webFS.fromArrayBuffer(transferable)
        } else if (transferable instanceof ImageBitmap) {
          return webFS.fromImageBitmap(transferable)
        }// else if (transferable instanceof MessagePort) {
        // }
        throw new Error(`Unsupported transferable: ${transferable}`)
      })
      connection.message({ buffer, fds })
    } else {
      console.error(`[web-worker-client] server send an illegal message.`)
      connection.close()
    }
  }

  /**
   * @param {Array<{buffer: ArrayBuffer, fds: Array<WebFD>}>}wireMessages
   * @return {Promise<void>}
   */
  connection.onFlush = async (wireMessages) => {
    _flushQueue.push(wireMessages)

    if (_flushQueue.length > 1) {
      return
    }

    while (_flushQueue.length) {
      const sendWireMessages = _flushQueue[0]

      // convert to single arrayBuffer so it can be send over a data channel using zero copy semantics.
      const messagesSize = sendWireMessages.reduce((previousValue, currentValue) => previousValue + currentValue.buffer.byteLength, 0)

      const sendBuffer = new Uint32Array(new ArrayBuffer(messagesSize))
      let offset = 0
      const meta = []
      for (const wireMessage of sendWireMessages) {
        for (const webFd of wireMessage.fds) {
          const transferable = await webFd.getTransferable()
          meta.push(transferable)
        }
        const message = new Uint32Array(wireMessage.buffer)
        sendBuffer.set(message, offset)
        offset += message.length
      }

      postMessage({ protocolMessage: sendBuffer.buffer, meta }, [sendBuffer.buffer].concat(meta))
      _flushQueue.shift()
    }
  }
}

_setupMessageHandling(display.connection, webFS)

/**
 * @type {{display: Display, webFS: WebFS}}
 */


/***/ }),

/***/ "../../westfield/client/runtime/src/Display.js":
/*!**************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/Display.js ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Display; });
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");
/* harmony import */ var _protocol_WlDisplayProxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./protocol/WlDisplayProxy */ "../../westfield/client/runtime/src/protocol/WlDisplayProxy.js");
/* harmony import */ var _protocol_WlDisplayEvents__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./protocol/WlDisplayEvents */ "../../westfield/client/runtime/src/protocol/WlDisplayEvents.js");
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






/**
 * @implements WlDisplayEvents
 */
class Display extends _protocol_WlDisplayEvents__WEBPACK_IMPORTED_MODULE_2__["default"] {
  constructor () {
    super()
    /**
     * @type {number}
     */
    this.nextId = 1
    /**
     * @type {Connection}
     */
    this.connection = new westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["Connection"]()
    /**
     * @type {WlDisplayProxy}
     */
    this.displayProxy = new _protocol_WlDisplayProxy__WEBPACK_IMPORTED_MODULE_1__["default"](this, this.nextId++)
    /**
     * @type {Display}
     */
    this.displayProxy.listener = this
  }

  /**
   * For internal use only.
   * @param {number} id
   * @param {number} opcode
   * @param {Proxy} proxyClass
   * @param {Array<{value: *, type: string, size: number, optional: boolean, _marshallArg: function({buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}):void}>} argsArray
   */
  marshallConstructor (id, opcode, proxyClass, argsArray) {
    // construct new object
    const proxy = new proxyClass(this, this.nextId++)
    this.registerProxy(proxy)

    // determine required wire message length
    let size = 4 + 2 + 2 // id+size+opcode
    argsArray.forEach(arg => {
      if (arg.type === 'n') {
        arg.value = proxy.id
      }
      size += arg.size
    })

    this.connection.marshallMsg(id, opcode, size, argsArray)

    return proxy
  }

  /**
   * For internal use only.
   * @param {number} id
   * @param {number} opcode
   * @param {Array<{value: *, type: string, size: number, optional: boolean, _marshallArg: function({buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}):void}>} argsArray
   */
  marshall (id, opcode, argsArray) {
    // determine required wire message length
    let size = 4 + 2 + 2  // id+size+opcode
    argsArray.forEach(arg => size += arg.size)
    this.connection.marshallMsg(id, opcode, size, argsArray)
  }

  close () {
    if (this.connection.closed) { return }
    this.connection.close()
    this.display = null
    this.implementation = null
    this._destroyedResolver()
  }

  /**
   *
   * @param {Proxy} proxy
   */
  registerProxy (proxy) {
    this.connection.registerWlObject(proxy)
    // TODO proxy created listener?
  }

  /**
   * @param {Proxy}proxy
   * @private
   */
  unregisterProxy (proxy) {
    this.connection.unregisterWlObject(proxy)
    // TODO proxy destroyed listener?
  }

  /**
   * @return {WlRegistryProxy}
   */
  getRegistry () {
    // createRegistry -> opcode 1
    return this.displayProxy.getRegistry()
  }

  /**
   * Flush and resolve once all requests have been processed by the server.
   * @return {Promise<number>}
   */
  async roundtrip () {
    return new Promise(resolve => {
      const syncCallback = this.sync()
      syncCallback.listener = resolve
      this.connection.flush()
    })
  }

  /**
   * @param {Proxy}proxy
   * @param {number}code
   * @param {string}message
   * @override
   * @private
   */
  error (proxy, code, message) {
    console.error(message)
    this.close()
  }

  /**
   * @return {WlCallbackProxy}
   */
  sync () {
    return this.displayProxy.sync()
  }

  /**
   * @param {number}id
   * @override
   * @private
   */
  deleteId (id) {
    // TODO object id recycling?
  }
}


/***/ }),

/***/ "../../westfield/client/runtime/src/WebFS.js":
/*!************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/WebFS.js ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WebFS; });
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");


// TODO This is currently a literal copy of the server implementation. Do all use cases match 1o1 and can we use a single common code base between client & server for WebFS?
class WebFS {
  /**
   * @param {string}fdDomainUUID
   * @return {WebFS}
   */
  static create (fdDomainUUID) {
    return new WebFS(fdDomainUUID)
  }

  /**
   * @param {string}fdDomainUUID
   */
  constructor (fdDomainUUID) {
    /**
     * @type {string}
     * @private
     */
    this._fdDomainUUID = fdDomainUUID
    /**
     * @type {Object.<number,WebFD>}
     * @private
     */
    this._webFDs = {}
    /**
     * @type {number}
     * @private
     */
    this._nextFD = 0
  }

  /**
   * @param {ArrayBuffer} arrayBuffer
   * @return {WebFD}
   */
  fromArrayBuffer (arrayBuffer) {
    const fd = this._nextFD++
    // FIXME we want to use reference counting here instead of simply deleting.
    // Sending the WebFD to an endpoint will increase the ref, and we should wait until the endpoint has closed the fd as well.
    const webFD = new westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["WebFD"](fd, 'ArrayBuffer', this._fdDomainUUID, () => Promise.resolve(arrayBuffer), () => { delete this._webFDs[fd] })
    this._webFDs[fd] = webFD
    return webFD
  }

  /**
   * @param {ImageBitmap}imageBitmap
   * @return {WebFD}
   */
  fromImageBitmap (imageBitmap) {
    const fd = this._nextFD++
    const webFD = new westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["WebFD"](fd, 'ImageBitmap', this._fdDomainUUID, () => Promise.resolve(imageBitmap), () => { delete this._webFDs[fd] })
    this._webFDs[fd] = webFD
    return webFD
  }

  // TODO fromMessagePort

  /**
   * @param {number}fd
   * @return {WebFD}
   */
  getWebFD (fd) {
    return this._webFDs[fd]
  }
}


/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/Proxy.js":
/*!*********************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/Proxy.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Proxy; });
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");
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




class Proxy extends westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["WlObject"] {
  /**
   *
   * @param {Display} display
   * @param {number}id
   */
  constructor (display, id) {
    super(id)
    /**
     * @type {Display}
     */
    this.display = display
    this.display.registerProxy(this)
  }
}


/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WebArrayBufferEvents.js":
/*!************************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WebArrayBufferEvents.js ***!
  \************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WebArrayBufferEvents; });
/*
 *
 *        Copyright © 2019 Erik De Rijcke
 *
 *        Permission is hereby granted, free of charge, to any person
 *        obtaining a copy of this software and associated documentation files
 *        (the "Software"), to deal in the Software without restriction,
 *        including without limitation the rights to use, copy, modify, merge,
 *        publish, distribute, sublicense, and/or sell copies of the Software,
 *        and to permit persons to whom the Software is furnished to do so,
 *        subject to the following conditions:
 *
 *        The above copyright notice and this permission notice (including the
 *        next paragraph) shall be included in all copies or substantial
 *        portions of the Software.
 *
 *        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *        EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *        NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *        BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *        ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *        CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *        SOFTWARE.
 *    
 */

/**
 * @interface
 */
class WebArrayBufferEvents {

	/**
	 *
	 *                Detaches the associated HTML5 array buffer from the compositor and returns it to the client.
	 *                No action is expected for this event. It merely functions as a HTML5 array buffer ownership
	 *                transfer from main thread to web-worker.
	 *            
	 *
	 * @param {WebFD} arrayBuffer HTML5 array buffer to detach from the compositor 
	 *
	 * @since 1
	 *
	 */
	detach(arrayBuffer) {}
}



/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WebArrayBufferProxy.js":
/*!***********************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WebArrayBufferProxy.js ***!
  \***********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Proxy */ "../../westfield/client/runtime/src/protocol/Proxy.js");
/*
 *
 *        Copyright © 2019 Erik De Rijcke
 *
 *        Permission is hereby granted, free of charge, to any person
 *        obtaining a copy of this software and associated documentation files
 *        (the "Software"), to deal in the Software without restriction,
 *        including without limitation the rights to use, copy, modify, merge,
 *        publish, distribute, sublicense, and/or sell copies of the Software,
 *        and to permit persons to whom the Software is furnished to do so,
 *        subject to the following conditions:
 *
 *        The above copyright notice and this permission notice (including the
 *        next paragraph) shall be included in all copies or substantial
 *        portions of the Software.
 *
 *        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *        EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *        NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *        BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *        ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *        CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *        SOFTWARE.
 *    
 */


const { uint, uintOptional, int, intOptional, fixed, 
	fixedOptional, object, objectOptional, newObject, string, 
	stringOptional, array, arrayOptional, 
	fileDescriptorOptional, fileDescriptor, 
h, u, i, f, o, n, s, a } = westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["Connection"]

class WebArrayBufferProxy extends _Proxy__WEBPACK_IMPORTED_MODULE_1__["default"] {

	/**
	 *
	 *                Attaches the associated HTML5 array buffer to the compositor. The array buffer should be the same
	 *                object as the one used to create this buffer. No action is expected for this request. It merely
	 *                functions as a HTML5 array buffer ownership transfer from web-worker to main thread.
	 *            
	 *
	 * @param {WebFD} arrayBuffer HTML5 array buffer to attach to the compositor. 
	 *
	 * @since 1
	 *
	 */
	attach (arrayBuffer) {
		this.display.marshall(this.id, 0, [fileDescriptor(arrayBuffer)])
	}

/**
	 *@param {Display}display
	 *@param {number}id
	 */
	constructor (display, id) {
		super(display, id)
		/**
		 * @type {WebArrayBufferEvents|null}
		 */
		this.listener = null
	}

	async [0] (message) {
		await this.listener.detach(h(message))
	}

}
WebArrayBufferProxy.protocolName = 'web_array_buffer'

/* harmony default export */ __webpack_exports__["default"] = (WebArrayBufferProxy);


/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WebShmEvents.js":
/*!****************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WebShmEvents.js ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WebShmEvents; });
/*
 *
 *        Copyright © 2019 Erik De Rijcke
 *
 *        Permission is hereby granted, free of charge, to any person
 *        obtaining a copy of this software and associated documentation files
 *        (the "Software"), to deal in the Software without restriction,
 *        including without limitation the rights to use, copy, modify, merge,
 *        publish, distribute, sublicense, and/or sell copies of the Software,
 *        and to permit persons to whom the Software is furnished to do so,
 *        subject to the following conditions:
 *
 *        The above copyright notice and this permission notice (including the
 *        next paragraph) shall be included in all copies or substantial
 *        portions of the Software.
 *
 *        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *        EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *        NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *        BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *        ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *        CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *        SOFTWARE.
 *    
 */

/**
 * @interface
 */
class WebShmEvents {

	/**
	 *
	 *                Informs the client about a valid pixel format that
	 *                can be used for buffers. Known formats include
	 *                argb8888 and xrgb8888.
	 *            
	 *
	 * @param {number} format buffer pixel format 
	 *
	 * @since 1
	 *
	 */
	format(format) {}
}



/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WebShmProxy.js":
/*!***************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WebShmProxy.js ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Proxy */ "../../westfield/client/runtime/src/protocol/Proxy.js");
/* harmony import */ var _WebArrayBufferProxy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./WebArrayBufferProxy */ "../../westfield/client/runtime/src/protocol/WebArrayBufferProxy.js");
/* harmony import */ var _WlBufferProxy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./WlBufferProxy */ "../../westfield/client/runtime/src/protocol/WlBufferProxy.js");
/*
 *
 *        Copyright © 2019 Erik De Rijcke
 *
 *        Permission is hereby granted, free of charge, to any person
 *        obtaining a copy of this software and associated documentation files
 *        (the "Software"), to deal in the Software without restriction,
 *        including without limitation the rights to use, copy, modify, merge,
 *        publish, distribute, sublicense, and/or sell copies of the Software,
 *        and to permit persons to whom the Software is furnished to do so,
 *        subject to the following conditions:
 *
 *        The above copyright notice and this permission notice (including the
 *        next paragraph) shall be included in all copies or substantial
 *        portions of the Software.
 *
 *        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *        EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *        NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *        BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *        ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *        CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *        SOFTWARE.
 *    
 */


const { uint, uintOptional, int, intOptional, fixed, 
	fixedOptional, object, objectOptional, newObject, string, 
	stringOptional, array, arrayOptional, 
	fileDescriptorOptional, fileDescriptor, 
h, u, i, f, o, n, s, a } = westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["Connection"]




/**
 *
 *            A singleton global object that provides support for shared
 *            memory.
 *
 *            Clients can create wl_buffer objects using the create_buffer
 *            request.
 *
 *            At connection setup time, the web_shm object emits one or more
 *            format events to inform clients about the valid pixel formats
 *            that can be used for buffers.
 *        
 */
class WebShmProxy extends _Proxy__WEBPACK_IMPORTED_MODULE_1__["default"] {

	/**
	 *
	 *                Create a web_array_buffer object.
	 *
	 *                The buffer is created using an HTML5 array buffer as the fd argument
	 *                and width and height as specified. The stride argument specifies
	 *                the number of bytes from the beginning of one row to the beginning
	 *                of the next. The format is the pixel format of the buffer and
	 *                must be one of those advertised through the web_shm.format event.
	 *
	 *                Creating a buffer with an HTML5 array buffer as the fd argument
	 *                will attach the array buffer to the compositor and as such it can not be used
	 *                by the client until the compositor detaches it. As such clients should
	 *                wait for the compositor to emit the web_array_buffer detach event
	 *                before using the array buffer again.
	 *
	 *                A compositor will emit the detach event in conjunction with a wl_buffer release event.
	 *                Clients should therefore only create a web_array_buffer after all data is written to
	 *                the HTML5 array buffer, after which it should be immediately attach+commit to a surface.
	 *            
	 *
	 * @param {WebFD} arrayBuffer file descriptor for shared memory of the buffer 
	 * @param {number} width buffer width, in pixels 
	 * @param {number} height buffer height, in pixels 
	 * @return {WebArrayBufferProxy} array buffer to create 
	 *
	 * @since 1
	 *
	 */
	createWebArrayBuffer (arrayBuffer, width, height) {
		return this.display.marshallConstructor(this.id, 0, _WebArrayBufferProxy__WEBPACK_IMPORTED_MODULE_2__["default"], [newObject(), fileDescriptor(arrayBuffer), int(width), int(height)])
	}

	/**
	 *
	 *                Create a wl_buffer object from a web_array_buffer so it can be used with a surface.
	 *            
	 *
	 * @param {*} webArrayBuffer web_array_buffer to wrap 
	 * @return {WlBufferProxy} buffer to create 
	 *
	 * @since 1
	 *
	 */
	createBuffer (webArrayBuffer) {
		return this.display.marshallConstructor(this.id, 1, _WlBufferProxy__WEBPACK_IMPORTED_MODULE_3__["default"], [newObject(), object(webArrayBuffer)])
	}

/**
	 *@param {Display}display
	 *@param {number}id
	 */
	constructor (display, id) {
		super(display, id)
		/**
		 * @type {WebShmEvents|null}
		 */
		this.listener = null
	}

}
WebShmProxy.protocolName = 'web_shm'

/* harmony default export */ __webpack_exports__["default"] = (WebShmProxy);


/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlBufferEvents.js":
/*!******************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlBufferEvents.js ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WlBufferEvents; });
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */

/**
 * @interface
 */
class WlBufferEvents {

	/**
	 *
	 *	Sent when this wl_buffer is no longer used by the compositor.
	 *	The client is now free to reuse or destroy this buffer and its
	 *	backing storage.
	 *
	 *	If a client receives a release event before the frame callback
	 *	requested in the same wl_surface.commit that attaches this
	 *	wl_buffer to a surface, then the client is immediately free to
	 *	reuse the buffer and its backing storage, and does not need a
	 *	second buffer for the next surface content update. Typically
	 *	this is possible, when the compositor maintains a copy of the
	 *	wl_surface contents, e.g. as a GL texture. This is an important
	 *	optimization for GL(ES) compositors with wl_shm clients.
	 *      
	 *
	 *
	 * @since 1
	 *
	 */
	release() {}
}



/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlBufferProxy.js":
/*!*****************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlBufferProxy.js ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Proxy */ "../../westfield/client/runtime/src/protocol/Proxy.js");
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */


const { uint, uintOptional, int, intOptional, fixed, 
	fixedOptional, object, objectOptional, newObject, string, 
	stringOptional, array, arrayOptional, 
	fileDescriptorOptional, fileDescriptor, 
h, u, i, f, o, n, s, a } = westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["Connection"]


/**
 *
 *      A buffer provides the content for a wl_surface. Buffers are
 *      created through factory interfaces such as wl_drm, wl_shm or
 *      similar. It has a width and a height and can be attached to a
 *      wl_surface, but the mechanism by which a client provides and
 *      updates the contents is defined by the buffer factory interface.
 *    
 */
class WlBufferProxy extends _Proxy__WEBPACK_IMPORTED_MODULE_1__["default"] {

	/**
	 *
	 *	Destroy a buffer. If and how you need to release the backing
	 *	storage is defined by the buffer factory interface.
	 *
	 *	For possible side-effects to a surface, see wl_surface.attach.
	 *      
	 * @since 1
	 *
	 */
	destroy () {
		this.display.marshall(this.id, 0, [])
	}

/**
	 *@param {Display}display
	 *@param {number}id
	 */
	constructor (display, id) {
		super(display, id)
		/**
		 * @type {WlBufferEvents|null}
		 */
		this.listener = null
	}

	async [0] (message) {
		await this.listener.release()
	}

}
WlBufferProxy.protocolName = 'wl_buffer'

/* harmony default export */ __webpack_exports__["default"] = (WlBufferProxy);


/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlCallbackEvents.js":
/*!********************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlCallbackEvents.js ***!
  \********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WlCallbackEvents; });
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */

/**
 * @interface
 */
class WlCallbackEvents {

	/**
	 *
	 *	Notify the client when the related request is done.
	 *      
	 *
	 * @param {number} callbackData request-specific data for the callback 
	 *
	 * @since 1
	 *
	 */
	done(callbackData) {}
}



/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlCallbackProxy.js":
/*!*******************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlCallbackProxy.js ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Proxy */ "../../westfield/client/runtime/src/protocol/Proxy.js");
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */


const { uint, uintOptional, int, intOptional, fixed, 
	fixedOptional, object, objectOptional, newObject, string, 
	stringOptional, array, arrayOptional, 
	fileDescriptorOptional, fileDescriptor, 
h, u, i, f, o, n, s, a } = westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["Connection"]


/**
 *
 *      Clients can handle the 'done' event to get notified when
 *      the related request is done.
 *    
 */
class WlCallbackProxy extends _Proxy__WEBPACK_IMPORTED_MODULE_1__["default"] {

/**
	 *@param {Display}display
	 *@param {number}id
	 */
	constructor (display, id) {
		super(display, id)
		/**
		 * @type {WlCallbackEvents|null}
		 */
		this.listener = null
	}

	async [0] (message) {
		await this.listener.done(u(message))
	}

}
WlCallbackProxy.protocolName = 'wl_callback'

/* harmony default export */ __webpack_exports__["default"] = (WlCallbackProxy);


/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlCompositorProxy.js":
/*!*********************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlCompositorProxy.js ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Proxy */ "../../westfield/client/runtime/src/protocol/Proxy.js");
/* harmony import */ var _WlSurfaceProxy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./WlSurfaceProxy */ "../../westfield/client/runtime/src/protocol/WlSurfaceProxy.js");
/* harmony import */ var _WlRegionProxy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./WlRegionProxy */ "../../westfield/client/runtime/src/protocol/WlRegionProxy.js");
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */


const { uint, uintOptional, int, intOptional, fixed, 
	fixedOptional, object, objectOptional, newObject, string, 
	stringOptional, array, arrayOptional, 
	fileDescriptorOptional, fileDescriptor, 
h, u, i, f, o, n, s, a } = westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["Connection"]




/**
 *
 *      A compositor.  This object is a singleton global.  The
 *      compositor is in charge of combining the contents of multiple
 *      surfaces into one displayable output.
 *    
 */
class WlCompositorProxy extends _Proxy__WEBPACK_IMPORTED_MODULE_1__["default"] {

	/**
	 *
	 *	Ask the compositor to create a new surface.
	 *      
	 *
	 * @return {WlSurfaceProxy} the new surface 
	 *
	 * @since 1
	 *
	 */
	createSurface () {
		return this.display.marshallConstructor(this.id, 0, _WlSurfaceProxy__WEBPACK_IMPORTED_MODULE_2__["default"], [newObject()])
	}

	/**
	 *
	 *	Ask the compositor to create a new region.
	 *      
	 *
	 * @return {WlRegionProxy} the new region 
	 *
	 * @since 1
	 *
	 */
	createRegion () {
		return this.display.marshallConstructor(this.id, 1, _WlRegionProxy__WEBPACK_IMPORTED_MODULE_3__["default"], [newObject()])
	}

/**
	 *@param {Display}display
	 *@param {number}id
	 */
	constructor (display, id) {
		super(display, id)
		/**
		 * @type {WlCompositorEvents|null}
		 */
		this.listener = null
	}

}
WlCompositorProxy.protocolName = 'wl_compositor'

/* harmony default export */ __webpack_exports__["default"] = (WlCompositorProxy);


/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlDataDeviceEvents.js":
/*!**********************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlDataDeviceEvents.js ***!
  \**********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WlDataDeviceEvents; });
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */

/**
 * @interface
 */
class WlDataDeviceEvents {

	/**
	 *
	 *	The data_offer event introduces a new wl_data_offer object,
	 *	which will subsequently be used in either the
	 *	data_device.enter event (for drag-and-drop) or the
	 *	data_device.selection event (for selections).  Immediately
	 *	following the data_device_data_offer event, the new data_offer
	 *	object will send out data_offer.offer events to describe the
	 *	mime types it offers.
	 *      
	 *
	 * @param {number} id the new data_offer object 
	 *
	 * @since 1
	 *
	 */
	dataOffer(id) {}

	/**
	 *
	 *	This event is sent when an active drag-and-drop pointer enters
	 *	a surface owned by the client.  The position of the pointer at
	 *	enter time is provided by the x and y arguments, in surface-local
	 *	coordinates.
	 *      
	 *
	 * @param {number} serial serial number of the enter event 
	 * @param {*} surface client surface entered 
	 * @param {Fixed} x surface-local x coordinate 
	 * @param {Fixed} y surface-local y coordinate 
	 * @param {?*} id source data_offer object 
	 *
	 * @since 1
	 *
	 */
	enter(serial, surface, x, y, id) {}

	/**
	 *
	 *	This event is sent when the drag-and-drop pointer leaves the
	 *	surface and the session ends.  The client must destroy the
	 *	wl_data_offer introduced at enter time at this point.
	 *      
	 *
	 *
	 * @since 1
	 *
	 */
	leave() {}

	/**
	 *
	 *	This event is sent when the drag-and-drop pointer moves within
	 *	the currently focused surface. The new position of the pointer
	 *	is provided by the x and y arguments, in surface-local
	 *	coordinates.
	 *      
	 *
	 * @param {number} time timestamp with millisecond granularity 
	 * @param {Fixed} x surface-local x coordinate 
	 * @param {Fixed} y surface-local y coordinate 
	 *
	 * @since 1
	 *
	 */
	motion(time, x, y) {}

	/**
	 *
	 *	The event is sent when a drag-and-drop operation is ended
	 *	because the implicit grab is removed.
	 *
	 *	The drag-and-drop destination is expected to honor the last action
	 *	received through wl_data_offer.action, if the resulting action is
	 *	"copy" or "move", the destination can still perform
	 *	wl_data_offer.receive requests, and is expected to end all
	 *	transfers with a wl_data_offer.finish request.
	 *
	 *	If the resulting action is "ask", the action will not be considered
	 *	final. The drag-and-drop destination is expected to perform one last
	 *	wl_data_offer.set_actions request, or wl_data_offer.destroy in order
	 *	to cancel the operation.
	 *      
	 *
	 *
	 * @since 1
	 *
	 */
	drop() {}

	/**
	 *
	 *	The selection event is sent out to notify the client of a new
	 *	wl_data_offer for the selection for this device.  The
	 *	data_device.data_offer and the data_offer.offer events are
	 *	sent out immediately before this event to introduce the data
	 *	offer object.  The selection event is sent to a client
	 *	immediately before receiving keyboard focus and when a new
	 *	selection is set while the client has keyboard focus.  The
	 *	data_offer is valid until a new data_offer or NULL is received
	 *	or until the client loses keyboard focus.  The client must
	 *	destroy the previous selection data_offer, if any, upon receiving
	 *	this event.
	 *      
	 *
	 * @param {?*} id selection data_offer object 
	 *
	 * @since 1
	 *
	 */
	selection(id) {}
}



/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlDataDeviceManagerProxy.js":
/*!****************************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlDataDeviceManagerProxy.js ***!
  \****************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Proxy */ "../../westfield/client/runtime/src/protocol/Proxy.js");
/* harmony import */ var _WlDataSourceProxy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./WlDataSourceProxy */ "../../westfield/client/runtime/src/protocol/WlDataSourceProxy.js");
/* harmony import */ var _WlDataDeviceProxy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./WlDataDeviceProxy */ "../../westfield/client/runtime/src/protocol/WlDataDeviceProxy.js");
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */


const { uint, uintOptional, int, intOptional, fixed, 
	fixedOptional, object, objectOptional, newObject, string, 
	stringOptional, array, arrayOptional, 
	fileDescriptorOptional, fileDescriptor, 
h, u, i, f, o, n, s, a } = westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["Connection"]




/**
 *
 *      The wl_data_device_manager is a singleton global object that
 *      provides access to inter-client data transfer mechanisms such as
 *      copy-and-paste and drag-and-drop.  These mechanisms are tied to
 *      a wl_seat and this interface lets a client get a wl_data_device
 *      corresponding to a wl_seat.
 *
 *      Depending on the version bound, the objects created from the bound
 *      wl_data_device_manager object will have different requirements for
 *      functioning properly. See wl_data_source.set_actions,
 *      wl_data_offer.accept and wl_data_offer.finish for details.
 *    
 */
class WlDataDeviceManagerProxy extends _Proxy__WEBPACK_IMPORTED_MODULE_1__["default"] {

	/**
	 *
	 *	Create a new data source.
	 *      
	 *
	 * @return {WlDataSourceProxy} data source to create 
	 *
	 * @since 1
	 *
	 */
	createDataSource () {
		return this.display.marshallConstructor(this.id, 0, _WlDataSourceProxy__WEBPACK_IMPORTED_MODULE_2__["default"], [newObject()])
	}

	/**
	 *
	 *	Create a new data device for a given seat.
	 *      
	 *
	 * @param {*} seat seat associated with the data device 
	 * @return {WlDataDeviceProxy} data device to create 
	 *
	 * @since 1
	 *
	 */
	getDataDevice (seat) {
		return this.display.marshallConstructor(this.id, 1, _WlDataDeviceProxy__WEBPACK_IMPORTED_MODULE_3__["default"], [newObject(), object(seat)])
	}

/**
	 *@param {Display}display
	 *@param {number}id
	 */
	constructor (display, id) {
		super(display, id)
		/**
		 * @type {WlDataDeviceManagerEvents|null}
		 */
		this.listener = null
	}

}
WlDataDeviceManagerProxy.protocolName = 'wl_data_device_manager'

WlDataDeviceManagerProxy.DndAction = {
  /**
   * no action
   */
  none: 0,
  /**
   * copy action
   */
  copy: 1,
  /**
   * move action
   */
  move: 2,
  /**
   * ask action
   */
  ask: 4
}

/* harmony default export */ __webpack_exports__["default"] = (WlDataDeviceManagerProxy);


/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlDataDeviceProxy.js":
/*!*********************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlDataDeviceProxy.js ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Proxy */ "../../westfield/client/runtime/src/protocol/Proxy.js");
/* harmony import */ var _WlDataOfferProxy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./WlDataOfferProxy */ "../../westfield/client/runtime/src/protocol/WlDataOfferProxy.js");
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */


const { uint, uintOptional, int, intOptional, fixed, 
	fixedOptional, object, objectOptional, newObject, string, 
	stringOptional, array, arrayOptional, 
	fileDescriptorOptional, fileDescriptor, 
h, u, i, f, o, n, s, a } = westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["Connection"]



/**
 *
 *      There is one wl_data_device per seat which can be obtained
 *      from the global wl_data_device_manager singleton.
 *
 *      A wl_data_device provides access to inter-client data transfer
 *      mechanisms such as copy-and-paste and drag-and-drop.
 *    
 */
class WlDataDeviceProxy extends _Proxy__WEBPACK_IMPORTED_MODULE_1__["default"] {

	/**
	 *
	 *	This request asks the compositor to start a drag-and-drop
	 *	operation on behalf of the client.
	 *
	 *	The source argument is the data source that provides the data
	 *	for the eventual data transfer. If source is NULL, enter, leave
	 *	and motion events are sent only to the client that initiated the
	 *	drag and the client is expected to handle the data passing
	 *	internally.
	 *
	 *	The origin surface is the surface where the drag originates and
	 *	the client must have an active implicit grab that matches the
	 *	serial.
	 *
	 *	The icon surface is an optional (can be NULL) surface that
	 *	provides an icon to be moved around with the cursor.  Initially,
	 *	the top-left corner of the icon surface is placed at the cursor
	 *	hotspot, but subsequent wl_surface.attach request can move the
	 *	relative position. Attach requests must be confirmed with
	 *	wl_surface.commit as usual. The icon surface is given the role of
	 *	a drag-and-drop icon. If the icon surface already has another role,
	 *	it raises a protocol error.
	 *
	 *	The current and pending input regions of the icon wl_surface are
	 *	cleared, and wl_surface.set_input_region is ignored until the
	 *	wl_surface is no longer used as the icon surface. When the use
	 *	as an icon ends, the current and pending input regions become
	 *	undefined, and the wl_surface is unmapped.
	 *      
	 *
	 * @param {?*} source data source for the eventual transfer 
	 * @param {*} origin surface where the drag originates 
	 * @param {?*} icon drag-and-drop icon surface 
	 * @param {number} serial serial number of the implicit grab on the origin 
	 *
	 * @since 1
	 *
	 */
	startDrag (source, origin, icon, serial) {
		this.display.marshall(this.id, 0, [objectOptional(source), object(origin), objectOptional(icon), uint(serial)])
	}

	/**
	 *
	 *	This request asks the compositor to set the selection
	 *	to the data from the source on behalf of the client.
	 *
	 *	To unset the selection, set the source to NULL.
	 *      
	 *
	 * @param {?*} source data source for the selection 
	 * @param {number} serial serial number of the event that triggered this request 
	 *
	 * @since 1
	 *
	 */
	setSelection (source, serial) {
		this.display.marshall(this.id, 1, [objectOptional(source), uint(serial)])
	}

	/**
	 *
	 *	This request destroys the data device.
	 *      
	 * @since 2
	 *
	 */
	release () {
		this.display.marshall(this.id, 2, [])
	}

/**
	 *@param {Display}display
	 *@param {number}id
	 */
	constructor (display, id) {
		super(display, id)
		/**
		 * @type {WlDataDeviceEvents|null}
		 */
		this.listener = null
	}

	async [0] (message) {
		await this.listener.dataOffer(new _WlDataOfferProxy__WEBPACK_IMPORTED_MODULE_2__["default"](this.display, n(message)))
	}

	async [1] (message) {
		await this.listener.enter(u(message), o(message, false, this.display.connection), f(message), f(message), o(message, true, this.display.connection))
	}

	async [2] (message) {
		await this.listener.leave()
	}

	async [3] (message) {
		await this.listener.motion(u(message), f(message), f(message))
	}

	async [4] (message) {
		await this.listener.drop()
	}

	async [5] (message) {
		await this.listener.selection(o(message, true, this.display.connection))
	}

}
WlDataDeviceProxy.protocolName = 'wl_data_device'

WlDataDeviceProxy.Error = {
  /**
   * given wl_surface has another role
   */
  role: 0
}

/* harmony default export */ __webpack_exports__["default"] = (WlDataDeviceProxy);


/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlDataOfferEvents.js":
/*!*********************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlDataOfferEvents.js ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WlDataOfferEvents; });
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */

/**
 * @interface
 */
class WlDataOfferEvents {

	/**
	 *
	 *	Sent immediately after creating the wl_data_offer object.  One
	 *	event per offered mime type.
	 *      
	 *
	 * @param {string} mimeType offered mime type 
	 *
	 * @since 1
	 *
	 */
	offer(mimeType) {}

	/**
	 *
	 *	This event indicates the actions offered by the data source. It
	 *	will be sent right after wl_data_device.enter, or anytime the source
	 *	side changes its offered actions through wl_data_source.set_actions.
	 *      
	 *
	 * @param {number} sourceActions actions offered by the data source 
	 *
	 * @since 3
	 *
	 */
	sourceActions(sourceActions) {}

	/**
	 *
	 *	This event indicates the action selected by the compositor after
	 *	matching the source/destination side actions. Only one action (or
	 *	none) will be offered here.
	 *
	 *	This event can be emitted multiple times during the drag-and-drop
	 *	operation in response to destination side action changes through
	 *	wl_data_offer.set_actions.
	 *
	 *	This event will no longer be emitted after wl_data_device.drop
	 *	happened on the drag-and-drop destination, the client must
	 *	honor the last action received, or the last preferred one set
	 *	through wl_data_offer.set_actions when handling an "ask" action.
	 *
	 *	Compositors may also change the selected action on the fly, mainly
	 *	in response to keyboard modifier changes during the drag-and-drop
	 *	operation.
	 *
	 *	The most recent action received is always the valid one. Prior to
	 *	receiving wl_data_device.drop, the chosen action may change (e.g.
	 *	due to keyboard modifiers being pressed). At the time of receiving
	 *	wl_data_device.drop the drag-and-drop destination must honor the
	 *	last action received.
	 *
	 *	Action changes may still happen after wl_data_device.drop,
	 *	especially on "ask" actions, where the drag-and-drop destination
	 *	may choose another action afterwards. Action changes happening
	 *	at this stage are always the result of inter-client negotiation, the
	 *	compositor shall no longer be able to induce a different action.
	 *
	 *	Upon "ask" actions, it is expected that the drag-and-drop destination
	 *	may potentially choose a different action and/or mime type,
	 *	based on wl_data_offer.source_actions and finally chosen by the
	 *	user (e.g. popping up a menu with the available options). The
	 *	final wl_data_offer.set_actions and wl_data_offer.accept requests
	 *	must happen before the call to wl_data_offer.finish.
	 *      
	 *
	 * @param {number} dndAction action selected by the compositor 
	 *
	 * @since 3
	 *
	 */
	action(dndAction) {}
}



/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlDataOfferProxy.js":
/*!********************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlDataOfferProxy.js ***!
  \********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Proxy */ "../../westfield/client/runtime/src/protocol/Proxy.js");
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */


const { uint, uintOptional, int, intOptional, fixed, 
	fixedOptional, object, objectOptional, newObject, string, 
	stringOptional, array, arrayOptional, 
	fileDescriptorOptional, fileDescriptor, 
h, u, i, f, o, n, s, a } = westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["Connection"]


/**
 *
 *      A wl_data_offer represents a piece of data offered for transfer
 *      by another client (the source client).  It is used by the
 *      copy-and-paste and drag-and-drop mechanisms.  The offer
 *      describes the different mime types that the data can be
 *      converted to and provides the mechanism for transferring the
 *      data directly from the source client.
 *    
 */
class WlDataOfferProxy extends _Proxy__WEBPACK_IMPORTED_MODULE_1__["default"] {

	/**
	 *
	 *	Indicate that the client can accept the given mime type, or
	 *	NULL for not accepted.
	 *
	 *	For objects of version 2 or older, this request is used by the
	 *	client to give feedback whether the client can receive the given
	 *	mime type, or NULL if none is accepted; the feedback does not
	 *	determine whether the drag-and-drop operation succeeds or not.
	 *
	 *	For objects of version 3 or newer, this request determines the
	 *	final result of the drag-and-drop operation. If the end result
	 *	is that no mime types were accepted, the drag-and-drop operation
	 *	will be cancelled and the corresponding drag source will receive
	 *	wl_data_source.cancelled. Clients may still use this event in
	 *	conjunction with wl_data_source.action for feedback.
	 *      
	 *
	 * @param {number} serial serial number of the accept request 
	 * @param {?string} mimeType mime type accepted by the client 
	 *
	 * @since 1
	 *
	 */
	accept (serial, mimeType) {
		this.display.marshall(this.id, 0, [uint(serial), stringOptional(mimeType)])
	}

	/**
	 *
	 *	To transfer the offered data, the client issues this request
	 *	and indicates the mime type it wants to receive.  The transfer
	 *	happens through the passed file descriptor (typically created
	 *	with the pipe system call).  The source client writes the data
	 *	in the mime type representation requested and then closes the
	 *	file descriptor.
	 *
	 *	The receiving client reads from the read end of the pipe until
	 *	EOF and then closes its end, at which point the transfer is
	 *	complete.
	 *
	 *	This request may happen multiple times for different mime types,
	 *	both before and after wl_data_device.drop. Drag-and-drop destination
	 *	clients may preemptively fetch data or examine it more closely to
	 *	determine acceptance.
	 *      
	 *
	 * @param {string} mimeType mime type desired by receiver 
	 * @param {WebFD} fd file descriptor for data transfer 
	 *
	 * @since 1
	 *
	 */
	receive (mimeType, fd) {
		this.display.marshall(this.id, 1, [string(mimeType), fileDescriptor(fd)])
	}

	/**
	 *
	 *	Destroy the data offer.
	 *      
	 * @since 1
	 *
	 */
	destroy () {
		this.display.marshall(this.id, 2, [])
	}

	/**
	 *
	 *	Notifies the compositor that the drag destination successfully
	 *	finished the drag-and-drop operation.
	 *
	 *	Upon receiving this request, the compositor will emit
	 *	wl_data_source.dnd_finished on the drag source client.
	 *
	 *	It is a client error to perform other requests than
	 *	wl_data_offer.destroy after this one. It is also an error to perform
	 *	this request after a NULL mime type has been set in
	 *	wl_data_offer.accept or no action was received through
	 *	wl_data_offer.action.
	 *      
	 * @since 3
	 *
	 */
	finish () {
		this.display.marshall(this.id, 3, [])
	}

	/**
	 *
	 *	Sets the actions that the destination side client supports for
	 *	this operation. This request may trigger the emission of
	 *	wl_data_source.action and wl_data_offer.action events if the compositor
	 *	needs to change the selected action.
	 *
	 *	This request can be called multiple times throughout the
	 *	drag-and-drop operation, typically in response to wl_data_device.enter
	 *	or wl_data_device.motion events.
	 *
	 *	This request determines the final result of the drag-and-drop
	 *	operation. If the end result is that no action is accepted,
	 *	the drag source will receive wl_drag_source.cancelled.
	 *
	 *	The dnd_actions argument must contain only values expressed in the
	 *	wl_data_device_manager.dnd_actions enum, and the preferred_action
	 *	argument must only contain one of those values set, otherwise it
	 *	will result in a protocol error.
	 *
	 *	While managing an "ask" action, the destination drag-and-drop client
	 *	may perform further wl_data_offer.receive requests, and is expected
	 *	to perform one last wl_data_offer.set_actions request with a preferred
	 *	action other than "ask" (and optionally wl_data_offer.accept) before
	 *	requesting wl_data_offer.finish, in order to convey the action selected
	 *	by the user. If the preferred action is not in the
	 *	wl_data_offer.source_actions mask, an error will be raised.
	 *
	 *	If the "ask" action is dismissed (e.g. user cancellation), the client
	 *	is expected to perform wl_data_offer.destroy right away.
	 *
	 *	This request can only be made on drag-and-drop offers, a protocol error
	 *	will be raised otherwise.
	 *      
	 *
	 * @param {number} dndActions actions supported by the destination client 
	 * @param {number} preferredAction action preferred by the destination client 
	 *
	 * @since 3
	 *
	 */
	setActions (dndActions, preferredAction) {
		this.display.marshall(this.id, 4, [uint(dndActions), uint(preferredAction)])
	}

/**
	 *@param {Display}display
	 *@param {number}id
	 */
	constructor (display, id) {
		super(display, id)
		/**
		 * @type {WlDataOfferEvents|null}
		 */
		this.listener = null
	}

	async [0] (message) {
		await this.listener.offer(s(message, false))
	}

	async [1] (message) {
		await this.listener.sourceActions(u(message))
	}

	async [2] (message) {
		await this.listener.action(u(message))
	}

}
WlDataOfferProxy.protocolName = 'wl_data_offer'

WlDataOfferProxy.Error = {
  /**
   * finish request was called untimely
   */
  invalidFinish: 0,
  /**
   * action mask contains invalid values
   */
  invalidActionMask: 1,
  /**
   * action argument has an invalid value
   */
  invalidAction: 2,
  /**
   * offer doesn't accept this request
   */
  invalidOffer: 3
}

/* harmony default export */ __webpack_exports__["default"] = (WlDataOfferProxy);


/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlDataSourceEvents.js":
/*!**********************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlDataSourceEvents.js ***!
  \**********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WlDataSourceEvents; });
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */

/**
 * @interface
 */
class WlDataSourceEvents {

	/**
	 *
	 *	Sent when a target accepts pointer_focus or motion events.  If
	 *	a target does not accept any of the offered types, type is NULL.
	 *
	 *	Used for feedback during drag-and-drop.
	 *      
	 *
	 * @param {?string} mimeType mime type accepted by the target 
	 *
	 * @since 1
	 *
	 */
	target(mimeType) {}

	/**
	 *
	 *	Request for data from the client.  Send the data as the
	 *	specified mime type over the passed file descriptor, then
	 *	close it.
	 *      
	 *
	 * @param {string} mimeType mime type for the data 
	 * @param {WebFD} fd file descriptor for the data 
	 *
	 * @since 1
	 *
	 */
	send(mimeType, fd) {}

	/**
	 *
	 *	This data source is no longer valid. There are several reasons why
	 *	this could happen:
	 *
	 *	- The data source has been replaced by another data source.
	 *	- The drag-and-drop operation was performed, but the drop destination
	 *	  did not accept any of the mime types offered through
	 *	  wl_data_source.target.
	 *	- The drag-and-drop operation was performed, but the drop destination
	 *	  did not select any of the actions present in the mask offered through
	 *	  wl_data_source.action.
	 *	- The drag-and-drop operation was performed but didn't happen over a
	 *	  surface.
	 *	- The compositor cancelled the drag-and-drop operation (e.g. compositor
	 *	  dependent timeouts to avoid stale drag-and-drop transfers).
	 *
	 *	The client should clean up and destroy this data source.
	 *
	 *	For objects of version 2 or older, wl_data_source.cancelled will
	 *	only be emitted if the data source was replaced by another data
	 *	source.
	 *      
	 *
	 *
	 * @since 1
	 *
	 */
	cancelled() {}

	/**
	 *
	 *	The user performed the drop action. This event does not indicate
	 *	acceptance, wl_data_source.cancelled may still be emitted afterwards
	 *	if the drop destination does not accept any mime type.
	 *
	 *	However, this event might however not be received if the compositor
	 *	cancelled the drag-and-drop operation before this event could happen.
	 *
	 *	Note that the data_source may still be used in the future and should
	 *	not be destroyed here.
	 *      
	 *
	 *
	 * @since 3
	 *
	 */
	dndDropPerformed() {}

	/**
	 *
	 *	The drop destination finished interoperating with this data
	 *	source, so the client is now free to destroy this data source and
	 *	free all associated data.
	 *
	 *	If the action used to perform the operation was "move", the
	 *	source can now delete the transferred data.
	 *      
	 *
	 *
	 * @since 3
	 *
	 */
	dndFinished() {}

	/**
	 *
	 *	This event indicates the action selected by the compositor after
	 *	matching the source/destination side actions. Only one action (or
	 *	none) will be offered here.
	 *
	 *	This event can be emitted multiple times during the drag-and-drop
	 *	operation, mainly in response to destination side changes through
	 *	wl_data_offer.set_actions, and as the data device enters/leaves
	 *	surfaces.
	 *
	 *	It is only possible to receive this event after
	 *	wl_data_source.dnd_drop_performed if the drag-and-drop operation
	 *	ended in an "ask" action, in which case the final wl_data_source.action
	 *	event will happen immediately before wl_data_source.dnd_finished.
	 *
	 *	Compositors may also change the selected action on the fly, mainly
	 *	in response to keyboard modifier changes during the drag-and-drop
	 *	operation.
	 *
	 *	The most recent action received is always the valid one. The chosen
	 *	action may change alongside negotiation (e.g. an "ask" action can turn
	 *	into a "move" operation), so the effects of the final action must
	 *	always be applied in wl_data_offer.dnd_finished.
	 *
	 *	Clients can trigger cursor surface changes from this point, so
	 *	they reflect the current action.
	 *      
	 *
	 * @param {number} dndAction action selected by the compositor 
	 *
	 * @since 3
	 *
	 */
	action(dndAction) {}
}



/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlDataSourceProxy.js":
/*!*********************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlDataSourceProxy.js ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Proxy */ "../../westfield/client/runtime/src/protocol/Proxy.js");
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */


const { uint, uintOptional, int, intOptional, fixed, 
	fixedOptional, object, objectOptional, newObject, string, 
	stringOptional, array, arrayOptional, 
	fileDescriptorOptional, fileDescriptor, 
h, u, i, f, o, n, s, a } = westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["Connection"]


/**
 *
 *      The wl_data_source object is the source side of a wl_data_offer.
 *      It is created by the source client in a data transfer and
 *      provides a way to describe the offered data and a way to respond
 *      to requests to transfer the data.
 *    
 */
class WlDataSourceProxy extends _Proxy__WEBPACK_IMPORTED_MODULE_1__["default"] {

	/**
	 *
	 *	This request adds a mime type to the set of mime types
	 *	advertised to targets.  Can be called several times to offer
	 *	multiple types.
	 *      
	 *
	 * @param {string} mimeType mime type offered by the data source 
	 *
	 * @since 1
	 *
	 */
	offer (mimeType) {
		this.display.marshall(this.id, 0, [string(mimeType)])
	}

	/**
	 *
	 *	Destroy the data source.
	 *      
	 * @since 1
	 *
	 */
	destroy () {
		this.display.marshall(this.id, 1, [])
	}

	/**
	 *
	 *	Sets the actions that the source side client supports for this
	 *	operation. This request may trigger wl_data_source.action and
	 *	wl_data_offer.action events if the compositor needs to change the
	 *	selected action.
	 *
	 *	The dnd_actions argument must contain only values expressed in the
	 *	wl_data_device_manager.dnd_actions enum, otherwise it will result
	 *	in a protocol error.
	 *
	 *	This request must be made once only, and can only be made on sources
	 *	used in drag-and-drop, so it must be performed before
	 *	wl_data_device.start_drag. Attempting to use the source other than
	 *	for drag-and-drop will raise a protocol error.
	 *      
	 *
	 * @param {number} dndActions actions supported by the data source 
	 *
	 * @since 3
	 *
	 */
	setActions (dndActions) {
		this.display.marshall(this.id, 2, [uint(dndActions)])
	}

/**
	 *@param {Display}display
	 *@param {number}id
	 */
	constructor (display, id) {
		super(display, id)
		/**
		 * @type {WlDataSourceEvents|null}
		 */
		this.listener = null
	}

	async [0] (message) {
		await this.listener.target(s(message, true))
	}

	async [1] (message) {
		await this.listener.send(s(message, false), h(message))
	}

	async [2] (message) {
		await this.listener.cancelled()
	}

	async [3] (message) {
		await this.listener.dndDropPerformed()
	}

	async [4] (message) {
		await this.listener.dndFinished()
	}

	async [5] (message) {
		await this.listener.action(u(message))
	}

}
WlDataSourceProxy.protocolName = 'wl_data_source'

WlDataSourceProxy.Error = {
  /**
   * action mask contains invalid values
   */
  invalidActionMask: 0,
  /**
   * source doesn't accept this request
   */
  invalidSource: 1
}

/* harmony default export */ __webpack_exports__["default"] = (WlDataSourceProxy);


/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlDisplayEvents.js":
/*!*******************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlDisplayEvents.js ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WlDisplayEvents; });
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */

/**
 * @interface
 */
class WlDisplayEvents {

	/**
	 *
	 *	The error event is sent out when a fatal (non-recoverable)
	 *	error has occurred.  The object_id argument is the object
	 *	where the error occurred, most often in response to a request
	 *	to that object.  The code identifies the error and is defined
	 *	by the object interface.  As such, each interface defines its
	 *	own set of error codes.  The message is a brief description
	 *	of the error, for (debugging) convenience.
	 *      
	 *
	 * @param {*} objectId object where the error occurred 
	 * @param {number} code error code 
	 * @param {string} message error description 
	 *
	 * @since 1
	 *
	 */
	error(objectId, code, message) {}

	/**
	 *
	 *	This event is used internally by the object ID management
	 *	logic.  When a client deletes an object, the server will send
	 *	this event to acknowledge that it has seen the delete request.
	 *	When the client receives this event, it will know that it can
	 *	safely reuse the object ID.
	 *      
	 *
	 * @param {number} id deleted object ID 
	 *
	 * @since 1
	 *
	 */
	deleteId(id) {}
}



/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlDisplayProxy.js":
/*!******************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlDisplayProxy.js ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Proxy */ "../../westfield/client/runtime/src/protocol/Proxy.js");
/* harmony import */ var _WlCallbackProxy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./WlCallbackProxy */ "../../westfield/client/runtime/src/protocol/WlCallbackProxy.js");
/* harmony import */ var _WlRegistryProxy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./WlRegistryProxy */ "../../westfield/client/runtime/src/protocol/WlRegistryProxy.js");
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */


const { uint, uintOptional, int, intOptional, fixed, 
	fixedOptional, object, objectOptional, newObject, string, 
	stringOptional, array, arrayOptional, 
	fileDescriptorOptional, fileDescriptor, 
h, u, i, f, o, n, s, a } = westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["Connection"]




/**
 *
 *      The core global object.  This is a special singleton object.  It
 *      is used for internal Wayland protocol features.
 *    
 */
class WlDisplayProxy extends _Proxy__WEBPACK_IMPORTED_MODULE_1__["default"] {

	/**
	 *
	 *	The sync request asks the server to emit the 'done' event
	 *	on the returned wl_callback object.  Since requests are
	 *	handled in-order and events are delivered in-order, this can
	 *	be used as a barrier to ensure all previous requests and the
	 *	resulting events have been handled.
	 *
	 *	The object returned by this request will be destroyed by the
	 *	compositor after the callback is fired and as such the client must not
	 *	attempt to use it after that point.
	 *
	 *	The callback_data passed in the callback is the event serial.
	 *      
	 *
	 * @return {WlCallbackProxy} callback object for the sync request 
	 *
	 * @since 1
	 *
	 */
	sync () {
		return this.display.marshallConstructor(this.id, 0, _WlCallbackProxy__WEBPACK_IMPORTED_MODULE_2__["default"], [newObject()])
	}

	/**
	 *
	 *	This request creates a registry object that allows the client
	 *	to list and bind the global objects available from the
	 *	compositor.
	 *      
	 *
	 * @return {WlRegistryProxy} global registry object 
	 *
	 * @since 1
	 *
	 */
	getRegistry () {
		return this.display.marshallConstructor(this.id, 1, _WlRegistryProxy__WEBPACK_IMPORTED_MODULE_3__["default"], [newObject()])
	}

/**
	 *@param {Display}display
	 *@param {number}id
	 */
	constructor (display, id) {
		super(display, id)
		/**
		 * @type {WlDisplayEvents|null}
		 */
		this.listener = null
	}

	async [0] (message) {
		await this.listener.error(o(message, false, this.display.connection), u(message), s(message, false))
	}

	async [1] (message) {
		await this.listener.deleteId(u(message))
	}

}
WlDisplayProxy.protocolName = 'wl_display'

WlDisplayProxy.Error = {
  /**
   * server couldn't find object
   */
  invalidObject: 0,
  /**
   * method doesn't exist on the specified interface
   */
  invalidMethod: 1,
  /**
   * server is out of memory
   */
  noMemory: 2
}

/* harmony default export */ __webpack_exports__["default"] = (WlDisplayProxy);


/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlKeyboardEvents.js":
/*!********************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlKeyboardEvents.js ***!
  \********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WlKeyboardEvents; });
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */

/**
 * @interface
 */
class WlKeyboardEvents {

	/**
	 *
	 *	This event provides a file descriptor to the client which can be
	 *	memory-mapped to provide a keyboard mapping description.
	 *      
	 *
	 * @param {number} format keymap format 
	 * @param {WebFD} fd keymap file descriptor 
	 * @param {number} size keymap size, in bytes 
	 *
	 * @since 1
	 *
	 */
	keymap(format, fd, size) {}

	/**
	 *
	 *	Notification that this seat's keyboard focus is on a certain
	 *	surface.
	 *      
	 *
	 * @param {number} serial serial number of the enter event 
	 * @param {*} surface surface gaining keyboard focus 
	 * @param {ArrayBuffer} keys the currently pressed keys 
	 *
	 * @since 1
	 *
	 */
	enter(serial, surface, keys) {}

	/**
	 *
	 *	Notification that this seat's keyboard focus is no longer on
	 *	a certain surface.
	 *
	 *	The leave notification is sent before the enter notification
	 *	for the new focus.
	 *      
	 *
	 * @param {number} serial serial number of the leave event 
	 * @param {*} surface surface that lost keyboard focus 
	 *
	 * @since 1
	 *
	 */
	leave(serial, surface) {}

	/**
	 *
	 *	A key was pressed or released.
	 *	The time argument is a timestamp with millisecond
	 *	granularity, with an undefined base.
	 *      
	 *
	 * @param {number} serial serial number of the key event 
	 * @param {number} time timestamp with millisecond granularity 
	 * @param {number} key key that produced the event 
	 * @param {number} state physical state of the key 
	 *
	 * @since 1
	 *
	 */
	key(serial, time, key, state) {}

	/**
	 *
	 *	Notifies clients that the modifier and/or group state has
	 *	changed, and it should update its local state.
	 *      
	 *
	 * @param {number} serial serial number of the modifiers event 
	 * @param {number} modsDepressed depressed modifiers 
	 * @param {number} modsLatched latched modifiers 
	 * @param {number} modsLocked locked modifiers 
	 * @param {number} group keyboard layout 
	 *
	 * @since 1
	 *
	 */
	modifiers(serial, modsDepressed, modsLatched, modsLocked, group) {}

	/**
	 *
	 *	Informs the client about the keyboard's repeat rate and delay.
	 *
	 *	This event is sent as soon as the wl_keyboard object has been created,
	 *	and is guaranteed to be received by the client before any key press
	 *	event.
	 *
	 *	Negative values for either rate or delay are illegal. A rate of zero
	 *	will disable any repeating (regardless of the value of delay).
	 *
	 *	This event can be sent later on as well with a new value if necessary,
	 *	so clients should continue listening for the event past the creation
	 *	of wl_keyboard.
	 *      
	 *
	 * @param {number} rate the rate of repeating keys in characters per second 
	 * @param {number} delay delay in milliseconds since key down until repeating starts 
	 *
	 * @since 4
	 *
	 */
	repeatInfo(rate, delay) {}
}



/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlKeyboardProxy.js":
/*!*******************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlKeyboardProxy.js ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Proxy */ "../../westfield/client/runtime/src/protocol/Proxy.js");
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */


const { uint, uintOptional, int, intOptional, fixed, 
	fixedOptional, object, objectOptional, newObject, string, 
	stringOptional, array, arrayOptional, 
	fileDescriptorOptional, fileDescriptor, 
h, u, i, f, o, n, s, a } = westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["Connection"]


/**
 *
 *      The wl_keyboard interface represents one or more keyboards
 *      associated with a seat.
 *    
 */
class WlKeyboardProxy extends _Proxy__WEBPACK_IMPORTED_MODULE_1__["default"] {

	/**
	 * @since 3
	 *
	 */
	release () {
		this.display.marshall(this.id, 0, [])
	}

/**
	 *@param {Display}display
	 *@param {number}id
	 */
	constructor (display, id) {
		super(display, id)
		/**
		 * @type {WlKeyboardEvents|null}
		 */
		this.listener = null
	}

	async [0] (message) {
		await this.listener.keymap(u(message), h(message), u(message))
	}

	async [1] (message) {
		await this.listener.enter(u(message), o(message, false, this.display.connection), a(message, false))
	}

	async [2] (message) {
		await this.listener.leave(u(message), o(message, false, this.display.connection))
	}

	async [3] (message) {
		await this.listener.key(u(message), u(message), u(message), u(message))
	}

	async [4] (message) {
		await this.listener.modifiers(u(message), u(message), u(message), u(message), u(message))
	}

	async [5] (message) {
		await this.listener.repeatInfo(i(message), i(message))
	}

}
WlKeyboardProxy.protocolName = 'wl_keyboard'

WlKeyboardProxy.KeymapFormat = {
  /**
   * no keymap; client must understand how to interpret the raw keycode
   */
  noKeymap: 0,
  /**
   * libxkbcommon compatible; to determine the xkb keycode, clients must add 8 to the key event keycode
   */
  xkbV1: 1
}

WlKeyboardProxy.KeyState = {
  /**
   * key is not pressed
   */
  released: 0,
  /**
   * key is pressed
   */
  pressed: 1
}

/* harmony default export */ __webpack_exports__["default"] = (WlKeyboardProxy);


/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlOutputEvents.js":
/*!******************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlOutputEvents.js ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WlOutputEvents; });
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */

/**
 * @interface
 */
class WlOutputEvents {

	/**
	 *
	 *	The geometry event describes geometric properties of the output.
	 *	The event is sent when binding to the output object and whenever
	 *	any of the properties change.
	 *      
	 *
	 * @param {number} x x position within the global compositor space 
	 * @param {number} y y position within the global compositor space 
	 * @param {number} physicalWidth width in millimeters of the output 
	 * @param {number} physicalHeight height in millimeters of the output 
	 * @param {number} subpixel subpixel orientation of the output 
	 * @param {string} make textual description of the manufacturer 
	 * @param {string} model textual description of the model 
	 * @param {number} transform transform that maps framebuffer to output 
	 *
	 * @since 1
	 *
	 */
	geometry(x, y, physicalWidth, physicalHeight, subpixel, make, model, transform) {}

	/**
	 *
	 *	The mode event describes an available mode for the output.
	 *
	 *	The event is sent when binding to the output object and there
	 *	will always be one mode, the current mode.  The event is sent
	 *	again if an output changes mode, for the mode that is now
	 *	current.  In other words, the current mode is always the last
	 *	mode that was received with the current flag set.
	 *
	 *	The size of a mode is given in physical hardware units of
	 *	the output device. This is not necessarily the same as
	 *	the output size in the global compositor space. For instance,
	 *	the output may be scaled, as described in wl_output.scale,
	 *	or transformed, as described in wl_output.transform.
	 *      
	 *
	 * @param {number} flags bitfield of mode flags 
	 * @param {number} width width of the mode in hardware units 
	 * @param {number} height height of the mode in hardware units 
	 * @param {number} refresh vertical refresh rate in mHz 
	 *
	 * @since 1
	 *
	 */
	mode(flags, width, height, refresh) {}

	/**
	 *
	 *	This event is sent after all other properties have been
	 *	sent after binding to the output object and after any
	 *	other property changes done after that. This allows
	 *	changes to the output properties to be seen as
	 *	atomic, even if they happen via multiple events.
	 *      
	 *
	 *
	 * @since 2
	 *
	 */
	done() {}

	/**
	 *
	 *	This event contains scaling geometry information
	 *	that is not in the geometry event. It may be sent after
	 *	binding the output object or if the output scale changes
	 *	later. If it is not sent, the client should assume a
	 *	scale of 1.
	 *
	 *	A scale larger than 1 means that the compositor will
	 *	automatically scale surface buffers by this amount
	 *	when rendering. This is used for very high resolution
	 *	displays where applications rendering at the native
	 *	resolution would be too small to be legible.
	 *
	 *	It is intended that scaling aware clients track the
	 *	current output of a surface, and if it is on a scaled
	 *	output it should use wl_surface.set_buffer_scale with
	 *	the scale of the output. That way the compositor can
	 *	avoid scaling the surface, and the client can supply
	 *	a higher detail image.
	 *      
	 *
	 * @param {number} factor scaling factor of output 
	 *
	 * @since 2
	 *
	 */
	scale(factor) {}
}



/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlOutputProxy.js":
/*!*****************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlOutputProxy.js ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Proxy */ "../../westfield/client/runtime/src/protocol/Proxy.js");
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */


const { uint, uintOptional, int, intOptional, fixed, 
	fixedOptional, object, objectOptional, newObject, string, 
	stringOptional, array, arrayOptional, 
	fileDescriptorOptional, fileDescriptor, 
h, u, i, f, o, n, s, a } = westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["Connection"]


/**
 *
 *      An output describes part of the compositor geometry.  The
 *      compositor works in the 'compositor coordinate system' and an
 *      output corresponds to a rectangular area in that space that is
 *      actually visible.  This typically corresponds to a monitor that
 *      displays part of the compositor space.  This object is published
 *      as global during start up, or when a monitor is hotplugged.
 *    
 */
class WlOutputProxy extends _Proxy__WEBPACK_IMPORTED_MODULE_1__["default"] {

	/**
	 *
	 *	Using this request a client can tell the server that it is not going to
	 *	use the output object anymore.
	 *      
	 * @since 3
	 *
	 */
	release () {
		this.display.marshall(this.id, 0, [])
	}

/**
	 *@param {Display}display
	 *@param {number}id
	 */
	constructor (display, id) {
		super(display, id)
		/**
		 * @type {WlOutputEvents|null}
		 */
		this.listener = null
	}

	async [0] (message) {
		await this.listener.geometry(i(message), i(message), i(message), i(message), i(message), s(message, false), s(message, false), i(message))
	}

	async [1] (message) {
		await this.listener.mode(u(message), i(message), i(message), i(message))
	}

	async [2] (message) {
		await this.listener.done()
	}

	async [3] (message) {
		await this.listener.scale(i(message))
	}

}
WlOutputProxy.protocolName = 'wl_output'

WlOutputProxy.Subpixel = {
  /**
   * unknown geometry
   */
  unknown: 0,
  /**
   * no geometry
   */
  none: 1,
  /**
   * horizontal RGB
   */
  horizontalRgb: 2,
  /**
   * horizontal BGR
   */
  horizontalBgr: 3,
  /**
   * vertical RGB
   */
  verticalRgb: 4,
  /**
   * vertical BGR
   */
  verticalBgr: 5
}

WlOutputProxy.Transform = {
  /**
   * no transform
   */
  normal: 0,
  /**
   * 90 degrees counter-clockwise
   */
  90: 1,
  /**
   * 180 degrees counter-clockwise
   */
  180: 2,
  /**
   * 270 degrees counter-clockwise
   */
  270: 3,
  /**
   * 180 degree flip around a vertical axis
   */
  flipped: 4,
  /**
   * flip and rotate 90 degrees counter-clockwise
   */
  flipped90: 5,
  /**
   * flip and rotate 180 degrees counter-clockwise
   */
  flipped180: 6,
  /**
   * flip and rotate 270 degrees counter-clockwise
   */
  flipped270: 7
}

WlOutputProxy.Mode = {
  /**
   * indicates this is the current mode
   */
  current: 0x1,
  /**
   * indicates this is the preferred mode
   */
  preferred: 0x2
}

/* harmony default export */ __webpack_exports__["default"] = (WlOutputProxy);


/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlPointerEvents.js":
/*!*******************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlPointerEvents.js ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WlPointerEvents; });
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */

/**
 * @interface
 */
class WlPointerEvents {

	/**
	 *
	 *	Notification that this seat's pointer is focused on a certain
	 *	surface.
	 *
	 *	When a seat's focus enters a surface, the pointer image
	 *	is undefined and a client should respond to this event by setting
	 *	an appropriate pointer image with the set_cursor request.
	 *      
	 *
	 * @param {number} serial serial number of the enter event 
	 * @param {*} surface surface entered by the pointer 
	 * @param {Fixed} surfaceX surface-local x coordinate 
	 * @param {Fixed} surfaceY surface-local y coordinate 
	 *
	 * @since 1
	 *
	 */
	enter(serial, surface, surfaceX, surfaceY) {}

	/**
	 *
	 *	Notification that this seat's pointer is no longer focused on
	 *	a certain surface.
	 *
	 *	The leave notification is sent before the enter notification
	 *	for the new focus.
	 *      
	 *
	 * @param {number} serial serial number of the leave event 
	 * @param {*} surface surface left by the pointer 
	 *
	 * @since 1
	 *
	 */
	leave(serial, surface) {}

	/**
	 *
	 *	Notification of pointer location change. The arguments
	 *	surface_x and surface_y are the location relative to the
	 *	focused surface.
	 *      
	 *
	 * @param {number} time timestamp with millisecond granularity 
	 * @param {Fixed} surfaceX surface-local x coordinate 
	 * @param {Fixed} surfaceY surface-local y coordinate 
	 *
	 * @since 1
	 *
	 */
	motion(time, surfaceX, surfaceY) {}

	/**
	 *
	 *	Mouse button click and release notifications.
	 *
	 *	The location of the click is given by the last motion or
	 *	enter event.
	 *	The time argument is a timestamp with millisecond
	 *	granularity, with an undefined base.
	 *
	 *	The button is a button code as defined in the Linux kernel's
	 *	linux/input-event-codes.h header file, e.g. BTN_LEFT.
	 *
	 *	Any 16-bit button code value is reserved for future additions to the
	 *	kernel's event code list. All other button codes above 0xFFFF are
	 *	currently undefined but may be used in future versions of this
	 *	protocol.
	 *      
	 *
	 * @param {number} serial serial number of the button event 
	 * @param {number} time timestamp with millisecond granularity 
	 * @param {number} button button that produced the event 
	 * @param {number} state physical state of the button 
	 *
	 * @since 1
	 *
	 */
	button(serial, time, button, state) {}

	/**
	 *
	 *	Scroll and other axis notifications.
	 *
	 *	For scroll events (vertical and horizontal scroll axes), the
	 *	value parameter is the length of a vector along the specified
	 *	axis in a coordinate space identical to those of motion events,
	 *	representing a relative movement along the specified axis.
	 *
	 *	For devices that support movements non-parallel to axes multiple
	 *	axis events will be emitted.
	 *
	 *	When applicable, for example for touch pads, the server can
	 *	choose to emit scroll events where the motion vector is
	 *	equivalent to a motion event vector.
	 *
	 *	When applicable, a client can transform its content relative to the
	 *	scroll distance.
	 *      
	 *
	 * @param {number} time timestamp with millisecond granularity 
	 * @param {number} axis axis type 
	 * @param {Fixed} value length of vector in surface-local coordinate space 
	 *
	 * @since 1
	 *
	 */
	axis(time, axis, value) {}

	/**
	 *
	 *	Indicates the end of a set of events that logically belong together.
	 *	A client is expected to accumulate the data in all events within the
	 *	frame before proceeding.
	 *
	 *	All wl_pointer events before a wl_pointer.frame event belong
	 *	logically together. For example, in a diagonal scroll motion the
	 *	compositor will send an optional wl_pointer.axis_source event, two
	 *	wl_pointer.axis events (horizontal and vertical) and finally a
	 *	wl_pointer.frame event. The client may use this information to
	 *	calculate a diagonal vector for scrolling.
	 *
	 *	When multiple wl_pointer.axis events occur within the same frame,
	 *	the motion vector is the combined motion of all events.
	 *	When a wl_pointer.axis and a wl_pointer.axis_stop event occur within
	 *	the same frame, this indicates that axis movement in one axis has
	 *	stopped but continues in the other axis.
	 *	When multiple wl_pointer.axis_stop events occur within the same
	 *	frame, this indicates that these axes stopped in the same instance.
	 *
	 *	A wl_pointer.frame event is sent for every logical event group,
	 *	even if the group only contains a single wl_pointer event.
	 *	Specifically, a client may get a sequence: motion, frame, button,
	 *	frame, axis, frame, axis_stop, frame.
	 *
	 *	The wl_pointer.enter and wl_pointer.leave events are logical events
	 *	generated by the compositor and not the hardware. These events are
	 *	also grouped by a wl_pointer.frame. When a pointer moves from one
	 *	surface to another, a compositor should group the
	 *	wl_pointer.leave event within the same wl_pointer.frame.
	 *	However, a client must not rely on wl_pointer.leave and
	 *	wl_pointer.enter being in the same wl_pointer.frame.
	 *	Compositor-specific policies may require the wl_pointer.leave and
	 *	wl_pointer.enter event being split across multiple wl_pointer.frame
	 *	groups.
	 *      
	 *
	 *
	 * @since 5
	 *
	 */
	frame() {}

	/**
	 *
	 *	Source information for scroll and other axes.
	 *
	 *	This event does not occur on its own. It is sent before a
	 *	wl_pointer.frame event and carries the source information for
	 *	all events within that frame.
	 *
	 *	The source specifies how this event was generated. If the source is
	 *	wl_pointer.axis_source.finger, a wl_pointer.axis_stop event will be
	 *	sent when the user lifts the finger off the device.
	 *
	 *	If the source is wl_pointer.axis_source.wheel,
	 *	wl_pointer.axis_source.wheel_tilt or
	 *	wl_pointer.axis_source.continuous, a wl_pointer.axis_stop event may
	 *	or may not be sent. Whether a compositor sends an axis_stop event
	 *	for these sources is hardware-specific and implementation-dependent;
	 *	clients must not rely on receiving an axis_stop event for these
	 *	scroll sources and should treat scroll sequences from these scroll
	 *	sources as unterminated by default.
	 *
	 *	This event is optional. If the source is unknown for a particular
	 *	axis event sequence, no event is sent.
	 *	Only one wl_pointer.axis_source event is permitted per frame.
	 *
	 *	The order of wl_pointer.axis_discrete and wl_pointer.axis_source is
	 *	not guaranteed.
	 *      
	 *
	 * @param {number} axisSource source of the axis event 
	 *
	 * @since 5
	 *
	 */
	axisSource(axisSource) {}

	/**
	 *
	 *	Stop notification for scroll and other axes.
	 *
	 *	For some wl_pointer.axis_source types, a wl_pointer.axis_stop event
	 *	is sent to notify a client that the axis sequence has terminated.
	 *	This enables the client to implement kinetic scrolling.
	 *	See the wl_pointer.axis_source documentation for information on when
	 *	this event may be generated.
	 *
	 *	Any wl_pointer.axis events with the same axis_source after this
	 *	event should be considered as the start of a new axis motion.
	 *
	 *	The timestamp is to be interpreted identical to the timestamp in the
	 *	wl_pointer.axis event. The timestamp value may be the same as a
	 *	preceding wl_pointer.axis event.
	 *      
	 *
	 * @param {number} time timestamp with millisecond granularity 
	 * @param {number} axis the axis stopped with this event 
	 *
	 * @since 5
	 *
	 */
	axisStop(time, axis) {}

	/**
	 *
	 *	Discrete step information for scroll and other axes.
	 *
	 *	This event carries the axis value of the wl_pointer.axis event in
	 *	discrete steps (e.g. mouse wheel clicks).
	 *
	 *	This event does not occur on its own, it is coupled with a
	 *	wl_pointer.axis event that represents this axis value on a
	 *	continuous scale. The protocol guarantees that each axis_discrete
	 *	event is always followed by exactly one axis event with the same
	 *	axis number within the same wl_pointer.frame. Note that the protocol
	 *	allows for other events to occur between the axis_discrete and
	 *	its coupled axis event, including other axis_discrete or axis
	 *	events.
	 *
	 *	This event is optional; continuous scrolling devices
	 *	like two-finger scrolling on touchpads do not have discrete
	 *	steps and do not generate this event.
	 *
	 *	The discrete value carries the directional information. e.g. a value
	 *	of -2 is two steps towards the negative direction of this axis.
	 *
	 *	The axis number is identical to the axis number in the associated
	 *	axis event.
	 *
	 *	The order of wl_pointer.axis_discrete and wl_pointer.axis_source is
	 *	not guaranteed.
	 *      
	 *
	 * @param {number} axis axis type 
	 * @param {number} discrete number of steps 
	 *
	 * @since 5
	 *
	 */
	axisDiscrete(axis, discrete) {}
}



/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlPointerProxy.js":
/*!******************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlPointerProxy.js ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Proxy */ "../../westfield/client/runtime/src/protocol/Proxy.js");
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */


const { uint, uintOptional, int, intOptional, fixed, 
	fixedOptional, object, objectOptional, newObject, string, 
	stringOptional, array, arrayOptional, 
	fileDescriptorOptional, fileDescriptor, 
h, u, i, f, o, n, s, a } = westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["Connection"]


/**
 *
 *      The wl_pointer interface represents one or more input devices,
 *      such as mice, which control the pointer location and pointer_focus
 *      of a seat.
 *
 *      The wl_pointer interface generates motion, enter and leave
 *      events for the surfaces that the pointer is located over,
 *      and button and axis events for button presses, button releases
 *      and scrolling.
 *    
 */
class WlPointerProxy extends _Proxy__WEBPACK_IMPORTED_MODULE_1__["default"] {

	/**
	 *
	 *	Set the pointer surface, i.e., the surface that contains the
	 *	pointer image (cursor). This request gives the surface the role
	 *	of a cursor. If the surface already has another role, it raises
	 *	a protocol error.
	 *
	 *	The cursor actually changes only if the pointer
	 *	focus for this device is one of the requesting client's surfaces
	 *	or the surface parameter is the current pointer surface. If
	 *	there was a previous surface set with this request it is
	 *	replaced. If surface is NULL, the pointer image is hidden.
	 *
	 *	The parameters hotspot_x and hotspot_y define the position of
	 *	the pointer surface relative to the pointer location. Its
	 *	top-left corner is always at (x, y) - (hotspot_x, hotspot_y),
	 *	where (x, y) are the coordinates of the pointer location, in
	 *	surface-local coordinates.
	 *
	 *	On surface.attach requests to the pointer surface, hotspot_x
	 *	and hotspot_y are decremented by the x and y parameters
	 *	passed to the request. Attach must be confirmed by
	 *	wl_surface.commit as usual.
	 *
	 *	The hotspot can also be updated by passing the currently set
	 *	pointer surface to this request with new values for hotspot_x
	 *	and hotspot_y.
	 *
	 *	The current and pending input regions of the wl_surface are
	 *	cleared, and wl_surface.set_input_region is ignored until the
	 *	wl_surface is no longer used as the cursor. When the use as a
	 *	cursor ends, the current and pending input regions become
	 *	undefined, and the wl_surface is unmapped.
	 *      
	 *
	 * @param {number} serial serial number of the enter event 
	 * @param {?*} surface pointer surface 
	 * @param {number} hotspotX surface-local x coordinate 
	 * @param {number} hotspotY surface-local y coordinate 
	 *
	 * @since 1
	 *
	 */
	setCursor (serial, surface, hotspotX, hotspotY) {
		this.display.marshall(this.id, 0, [uint(serial), objectOptional(surface), int(hotspotX), int(hotspotY)])
	}

	/**
	 *
	 *	Using this request a client can tell the server that it is not going to
	 *	use the pointer object anymore.
	 *
	 *	This request destroys the pointer proxy object, so clients must not call
	 *	wl_pointer_destroy() after using this request.
	 *      
	 * @since 3
	 *
	 */
	release () {
		this.display.marshall(this.id, 1, [])
	}

/**
	 *@param {Display}display
	 *@param {number}id
	 */
	constructor (display, id) {
		super(display, id)
		/**
		 * @type {WlPointerEvents|null}
		 */
		this.listener = null
	}

	async [0] (message) {
		await this.listener.enter(u(message), o(message, false, this.display.connection), f(message), f(message))
	}

	async [1] (message) {
		await this.listener.leave(u(message), o(message, false, this.display.connection))
	}

	async [2] (message) {
		await this.listener.motion(u(message), f(message), f(message))
	}

	async [3] (message) {
		await this.listener.button(u(message), u(message), u(message), u(message))
	}

	async [4] (message) {
		await this.listener.axis(u(message), u(message), f(message))
	}

	async [5] (message) {
		await this.listener.frame()
	}

	async [6] (message) {
		await this.listener.axisSource(u(message))
	}

	async [7] (message) {
		await this.listener.axisStop(u(message), u(message))
	}

	async [8] (message) {
		await this.listener.axisDiscrete(u(message), i(message))
	}

}
WlPointerProxy.protocolName = 'wl_pointer'

WlPointerProxy.Error = {
  /**
   * given wl_surface has another role
   */
  role: 0
}

WlPointerProxy.ButtonState = {
  /**
   * the button is not pressed
   */
  released: 0,
  /**
   * the button is pressed
   */
  pressed: 1
}

WlPointerProxy.Axis = {
  /**
   * vertical axis
   */
  verticalScroll: 0,
  /**
   * horizontal axis
   */
  horizontalScroll: 1
}

WlPointerProxy.AxisSource = {
  /**
   * a physical wheel rotation
   */
  wheel: 0,
  /**
   * finger on a touch surface
   */
  finger: 1,
  /**
   * continuous coordinate space
   */
  continuous: 2,
  /**
   * a physical wheel tilt
   */
  wheelTilt: 3
}

/* harmony default export */ __webpack_exports__["default"] = (WlPointerProxy);


/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlRegionProxy.js":
/*!*****************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlRegionProxy.js ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Proxy */ "../../westfield/client/runtime/src/protocol/Proxy.js");
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */


const { uint, uintOptional, int, intOptional, fixed, 
	fixedOptional, object, objectOptional, newObject, string, 
	stringOptional, array, arrayOptional, 
	fileDescriptorOptional, fileDescriptor, 
h, u, i, f, o, n, s, a } = westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["Connection"]


/**
 *
 *      A region object describes an area.
 *
 *      Region objects are used to describe the opaque and input
 *      regions of a surface.
 *    
 */
class WlRegionProxy extends _Proxy__WEBPACK_IMPORTED_MODULE_1__["default"] {

	/**
	 *
	 *	Destroy the region.  This will invalidate the object ID.
	 *      
	 * @since 1
	 *
	 */
	destroy () {
		this.display.marshall(this.id, 0, [])
	}

	/**
	 *
	 *	Add the specified rectangle to the region.
	 *      
	 *
	 * @param {number} x region-local x coordinate 
	 * @param {number} y region-local y coordinate 
	 * @param {number} width rectangle width 
	 * @param {number} height rectangle height 
	 *
	 * @since 1
	 *
	 */
	add (x, y, width, height) {
		this.display.marshall(this.id, 1, [int(x), int(y), int(width), int(height)])
	}

	/**
	 *
	 *	Subtract the specified rectangle from the region.
	 *      
	 *
	 * @param {number} x region-local x coordinate 
	 * @param {number} y region-local y coordinate 
	 * @param {number} width rectangle width 
	 * @param {number} height rectangle height 
	 *
	 * @since 1
	 *
	 */
	subtract (x, y, width, height) {
		this.display.marshall(this.id, 2, [int(x), int(y), int(width), int(height)])
	}

/**
	 *@param {Display}display
	 *@param {number}id
	 */
	constructor (display, id) {
		super(display, id)
		/**
		 * @type {WlRegionEvents|null}
		 */
		this.listener = null
	}

}
WlRegionProxy.protocolName = 'wl_region'

/* harmony default export */ __webpack_exports__["default"] = (WlRegionProxy);


/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlRegistryEvents.js":
/*!********************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlRegistryEvents.js ***!
  \********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WlRegistryEvents; });
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */

/**
 * @interface
 */
class WlRegistryEvents {

	/**
	 *
	 *	Notify the client of global objects.
	 *
	 *	The event notifies the client that a global object with
	 *	the given name is now available, and it implements the
	 *	given version of the given interface.
	 *      
	 *
	 * @param {number} name numeric name of the global object 
	 * @param {string} interface interface implemented by the object 
	 * @param {number} version interface version 
	 *
	 * @since 1
	 *
	 */
	global(name, interface_, version) {}

	/**
	 *
	 *	Notify the client of removed global objects.
	 *
	 *	This event notifies the client that the global identified
	 *	by name is no longer available.  If the client bound to
	 *	the global using the bind request, the client should now
	 *	destroy that object.
	 *
	 *	The object remains valid and requests to the object will be
	 *	ignored until the client destroys it, to avoid races between
	 *	the global going away and a client sending a request to it.
	 *      
	 *
	 * @param {number} name numeric name of the global object 
	 *
	 * @since 1
	 *
	 */
	globalRemove(name) {}
}



/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlRegistryProxy.js":
/*!*******************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlRegistryProxy.js ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Proxy */ "../../westfield/client/runtime/src/protocol/Proxy.js");
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */


const { uint, uintOptional, int, intOptional, fixed, 
	fixedOptional, object, objectOptional, newObject, string, 
	stringOptional, array, arrayOptional, 
	fileDescriptorOptional, fileDescriptor, 
h, u, i, f, o, n, s, a } = westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["Connection"]


/**
 *
 *      The singleton global registry object.  The server has a number of
 *      global objects that are available to all clients.  These objects
 *      typically represent an actual object in the server (for example,
 *      an input device) or they are singleton objects that provide
 *      extension functionality.
 *
 *      When a client creates a registry object, the registry object
 *      will emit a global event for each global currently in the
 *      registry.  Globals come and go as a result of device or
 *      monitor hotplugs, reconfiguration or other events, and the
 *      registry will send out global and global_remove events to
 *      keep the client up to date with the changes.  To mark the end
 *      of the initial burst of events, the client can use the
 *      wl_display.sync request immediately after calling
 *      wl_display.get_registry.
 *
 *      A client can bind to a global object by using the bind
 *      request.  This creates a client-side handle that lets the object
 *      emit events to the client and lets the client invoke requests on
 *      the object.
 *    
 */
class WlRegistryProxy extends _Proxy__WEBPACK_IMPORTED_MODULE_1__["default"] {
	/**
	* Bind a new object to the global.
	*
	* Binds a new, client-created object to the server using the specified name as the identifier.
	*
	* @param {number} name unique numeric name of the global
	* @param {string} interface_ interface implemented by the new object
	* @param {Object} proxyClass
	* @param {number} version The version used and supported by the client
	* @return {Object} a new bounded object
	*/
	bind (name, interface_, proxyClass, version) {
		return this.display.marshallConstructor(this.id, 0, proxyClass, [uint(name), string(interface_), uint(version), newObject()])
	}

/**
	 *@param {Display}display
	 *@param {number}id
	 */
	constructor (display, id) {
		super(display, id)
		/**
		 * @type {WlRegistryEvents|null}
		 */
		this.listener = null
	}

	async [0] (message) {
		await this.listener.global(u(message), s(message, false), u(message))
	}

	async [1] (message) {
		await this.listener.globalRemove(u(message))
	}

}
WlRegistryProxy.protocolName = 'wl_registry'

/* harmony default export */ __webpack_exports__["default"] = (WlRegistryProxy);


/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlSeatEvents.js":
/*!****************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlSeatEvents.js ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WlSeatEvents; });
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */

/**
 * @interface
 */
class WlSeatEvents {

	/**
	 *
	 *	This is emitted whenever a seat gains or loses the pointer,
	 *	keyboard or touch capabilities.  The argument is a capability
	 *	enum containing the complete set of capabilities this seat has.
	 *
	 *	When the pointer capability is added, a client may create a
	 *	wl_pointer object using the wl_seat.get_pointer request. This object
	 *	will receive pointer events until the capability is removed in the
	 *	future.
	 *
	 *	When the pointer capability is removed, a client should destroy the
	 *	wl_pointer objects associated with the seat where the capability was
	 *	removed, using the wl_pointer.release request. No further pointer
	 *	events will be received on these objects.
	 *
	 *	In some compositors, if a seat regains the pointer capability and a
	 *	client has a previously obtained wl_pointer object of version 4 or
	 *	less, that object may start sending pointer events again. This
	 *	behavior is considered a misinterpretation of the intended behavior
	 *	and must not be relied upon by the client. wl_pointer objects of
	 *	version 5 or later must not send events if created before the most
	 *	recent event notifying the client of an added pointer capability.
	 *
	 *	The above behavior also applies to wl_keyboard and wl_touch with the
	 *	keyboard and touch capabilities, respectively.
	 *      
	 *
	 * @param {number} capabilities capabilities of the seat 
	 *
	 * @since 1
	 *
	 */
	capabilities(capabilities) {}

	/**
	 *
	 *	In a multiseat configuration this can be used by the client to help
	 *	identify which physical devices the seat represents. Based on
	 *	the seat configuration used by the compositor.
	 *      
	 *
	 * @param {string} name seat identifier 
	 *
	 * @since 2
	 *
	 */
	name(name) {}
}



/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlSeatProxy.js":
/*!***************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlSeatProxy.js ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Proxy */ "../../westfield/client/runtime/src/protocol/Proxy.js");
/* harmony import */ var _WlPointerProxy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./WlPointerProxy */ "../../westfield/client/runtime/src/protocol/WlPointerProxy.js");
/* harmony import */ var _WlKeyboardProxy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./WlKeyboardProxy */ "../../westfield/client/runtime/src/protocol/WlKeyboardProxy.js");
/* harmony import */ var _WlTouchProxy__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./WlTouchProxy */ "../../westfield/client/runtime/src/protocol/WlTouchProxy.js");
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */


const { uint, uintOptional, int, intOptional, fixed, 
	fixedOptional, object, objectOptional, newObject, string, 
	stringOptional, array, arrayOptional, 
	fileDescriptorOptional, fileDescriptor, 
h, u, i, f, o, n, s, a } = westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["Connection"]





/**
 *
 *      A seat is a group of keyboards, pointer and touch devices. This
 *      object is published as a global during start up, or when such a
 *      device is hot plugged.  A seat typically has a pointer and
 *      maintains a keyboard focus and a pointer focus.
 *    
 */
class WlSeatProxy extends _Proxy__WEBPACK_IMPORTED_MODULE_1__["default"] {

	/**
	 *
	 *	The ID provided will be initialized to the wl_pointer interface
	 *	for this seat.
	 *
	 *	This request only takes effect if the seat has the pointer
	 *	capability, or has had the pointer capability in the past.
	 *	It is a protocol violation to issue this request on a seat that has
	 *	never had the pointer capability.
	 *      
	 *
	 * @return {WlPointerProxy} seat pointer 
	 *
	 * @since 1
	 *
	 */
	getPointer () {
		return this.display.marshallConstructor(this.id, 0, _WlPointerProxy__WEBPACK_IMPORTED_MODULE_2__["default"], [newObject()])
	}

	/**
	 *
	 *	The ID provided will be initialized to the wl_keyboard interface
	 *	for this seat.
	 *
	 *	This request only takes effect if the seat has the keyboard
	 *	capability, or has had the keyboard capability in the past.
	 *	It is a protocol violation to issue this request on a seat that has
	 *	never had the keyboard capability.
	 *      
	 *
	 * @return {WlKeyboardProxy} seat keyboard 
	 *
	 * @since 1
	 *
	 */
	getKeyboard () {
		return this.display.marshallConstructor(this.id, 1, _WlKeyboardProxy__WEBPACK_IMPORTED_MODULE_3__["default"], [newObject()])
	}

	/**
	 *
	 *	The ID provided will be initialized to the wl_touch interface
	 *	for this seat.
	 *
	 *	This request only takes effect if the seat has the touch
	 *	capability, or has had the touch capability in the past.
	 *	It is a protocol violation to issue this request on a seat that has
	 *	never had the touch capability.
	 *      
	 *
	 * @return {WlTouchProxy} seat touch interface 
	 *
	 * @since 1
	 *
	 */
	getTouch () {
		return this.display.marshallConstructor(this.id, 2, _WlTouchProxy__WEBPACK_IMPORTED_MODULE_4__["default"], [newObject()])
	}

	/**
	 *
	 *	Using this request a client can tell the server that it is not going to
	 *	use the seat object anymore.
	 *      
	 * @since 5
	 *
	 */
	release () {
		this.display.marshall(this.id, 3, [])
	}

/**
	 *@param {Display}display
	 *@param {number}id
	 */
	constructor (display, id) {
		super(display, id)
		/**
		 * @type {WlSeatEvents|null}
		 */
		this.listener = null
	}

	async [0] (message) {
		await this.listener.capabilities(u(message))
	}

	async [1] (message) {
		await this.listener.name(s(message, false))
	}

}
WlSeatProxy.protocolName = 'wl_seat'

WlSeatProxy.Capability = {
  /**
   * the seat has pointer devices
   */
  pointer: 1,
  /**
   * the seat has one or more keyboards
   */
  keyboard: 2,
  /**
   * the seat has touch devices
   */
  touch: 4
}

/* harmony default export */ __webpack_exports__["default"] = (WlSeatProxy);


/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlShellProxy.js":
/*!****************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlShellProxy.js ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Proxy */ "../../westfield/client/runtime/src/protocol/Proxy.js");
/* harmony import */ var _WlShellSurfaceProxy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./WlShellSurfaceProxy */ "../../westfield/client/runtime/src/protocol/WlShellSurfaceProxy.js");
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */


const { uint, uintOptional, int, intOptional, fixed, 
	fixedOptional, object, objectOptional, newObject, string, 
	stringOptional, array, arrayOptional, 
	fileDescriptorOptional, fileDescriptor, 
h, u, i, f, o, n, s, a } = westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["Connection"]



/**
 *
 *      This interface is implemented by servers that provide
 *      desktop-style user interfaces.
 *
 *      It allows clients to associate a wl_shell_surface with
 *      a basic surface.
 *    
 */
class WlShellProxy extends _Proxy__WEBPACK_IMPORTED_MODULE_1__["default"] {

	/**
	 *
	 *	Create a shell surface for an existing surface. This gives
	 *	the wl_surface the role of a shell surface. If the wl_surface
	 *	already has another role, it raises a protocol error.
	 *
	 *	Only one shell surface can be associated with a given surface.
	 *      
	 *
	 * @param {*} surface surface to be given the shell surface role 
	 * @return {WlShellSurfaceProxy} shell surface to create 
	 *
	 * @since 1
	 *
	 */
	getShellSurface (surface) {
		return this.display.marshallConstructor(this.id, 0, _WlShellSurfaceProxy__WEBPACK_IMPORTED_MODULE_2__["default"], [newObject(), object(surface)])
	}

/**
	 *@param {Display}display
	 *@param {number}id
	 */
	constructor (display, id) {
		super(display, id)
		/**
		 * @type {WlShellEvents|null}
		 */
		this.listener = null
	}

}
WlShellProxy.protocolName = 'wl_shell'

WlShellProxy.Error = {
  /**
   * given wl_surface has another role
   */
  role: 0
}

/* harmony default export */ __webpack_exports__["default"] = (WlShellProxy);


/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlShellSurfaceEvents.js":
/*!************************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlShellSurfaceEvents.js ***!
  \************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WlShellSurfaceEvents; });
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */

/**
 * @interface
 */
class WlShellSurfaceEvents {

	/**
	 *
	 *	Ping a client to check if it is receiving events and sending
	 *	requests. A client is expected to reply with a pong request.
	 *      
	 *
	 * @param {number} serial serial number of the ping 
	 *
	 * @since 1
	 *
	 */
	ping(serial) {}

	/**
	 *
	 *	The configure event asks the client to resize its surface.
	 *
	 *	The size is a hint, in the sense that the client is free to
	 *	ignore it if it doesn't resize, pick a smaller size (to
	 *	satisfy aspect ratio or resize in steps of NxM pixels).
	 *
	 *	The edges parameter provides a hint about how the surface
	 *	was resized. The client may use this information to decide
	 *	how to adjust its content to the new size (e.g. a scrolling
	 *	area might adjust its content position to leave the viewable
	 *	content unmoved).
	 *
	 *	The client is free to dismiss all but the last configure
	 *	event it received.
	 *
	 *	The width and height arguments specify the size of the window
	 *	in surface-local coordinates.
	 *      
	 *
	 * @param {number} edges how the surface was resized 
	 * @param {number} width new width of the surface 
	 * @param {number} height new height of the surface 
	 *
	 * @since 1
	 *
	 */
	configure(edges, width, height) {}

	/**
	 *
	 *	The popup_done event is sent out when a popup grab is broken,
	 *	that is, when the user clicks a surface that doesn't belong
	 *	to the client owning the popup surface.
	 *      
	 *
	 *
	 * @since 1
	 *
	 */
	popupDone() {}
}



/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlShellSurfaceProxy.js":
/*!***********************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlShellSurfaceProxy.js ***!
  \***********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Proxy */ "../../westfield/client/runtime/src/protocol/Proxy.js");
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */


const { uint, uintOptional, int, intOptional, fixed, 
	fixedOptional, object, objectOptional, newObject, string, 
	stringOptional, array, arrayOptional, 
	fileDescriptorOptional, fileDescriptor, 
h, u, i, f, o, n, s, a } = westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["Connection"]


/**
 *
 *      An interface that may be implemented by a wl_surface, for
 *      implementations that provide a desktop-style user interface.
 *
 *      It provides requests to treat surfaces like toplevel, fullscreen
 *      or popup windows, move, resize or maximize them, associate
 *      metadata like title and class, etc.
 *
 *      On the server side the object is automatically destroyed when
 *      the related wl_surface is destroyed. On the client side,
 *      wl_shell_surface_destroy() must be called before destroying
 *      the wl_surface object.
 *    
 */
class WlShellSurfaceProxy extends _Proxy__WEBPACK_IMPORTED_MODULE_1__["default"] {

	/**
	 *
	 *	A client must respond to a ping event with a pong request or
	 *	the client may be deemed unresponsive.
	 *      
	 *
	 * @param {number} serial serial number of the ping event 
	 *
	 * @since 1
	 *
	 */
	pong (serial) {
		this.display.marshall(this.id, 0, [uint(serial)])
	}

	/**
	 *
	 *	Start a pointer-driven move of the surface.
	 *
	 *	This request must be used in response to a button press event.
	 *	The server may ignore move requests depending on the state of
	 *	the surface (e.g. fullscreen or maximized).
	 *      
	 *
	 * @param {*} seat seat whose pointer is used 
	 * @param {number} serial serial number of the implicit grab on the pointer 
	 *
	 * @since 1
	 *
	 */
	move (seat, serial) {
		this.display.marshall(this.id, 1, [object(seat), uint(serial)])
	}

	/**
	 *
	 *	Start a pointer-driven resizing of the surface.
	 *
	 *	This request must be used in response to a button press event.
	 *	The server may ignore resize requests depending on the state of
	 *	the surface (e.g. fullscreen or maximized).
	 *      
	 *
	 * @param {*} seat seat whose pointer is used 
	 * @param {number} serial serial number of the implicit grab on the pointer 
	 * @param {number} edges which edge or corner is being dragged 
	 *
	 * @since 1
	 *
	 */
	resize (seat, serial, edges) {
		this.display.marshall(this.id, 2, [object(seat), uint(serial), uint(edges)])
	}

	/**
	 *
	 *	Map the surface as a toplevel surface.
	 *
	 *	A toplevel surface is not fullscreen, maximized or transient.
	 *      
	 * @since 1
	 *
	 */
	setToplevel () {
		this.display.marshall(this.id, 3, [])
	}

	/**
	 *
	 *	Map the surface relative to an existing surface.
	 *
	 *	The x and y arguments specify the location of the upper left
	 *	corner of the surface relative to the upper left corner of the
	 *	parent surface, in surface-local coordinates.
	 *
	 *	The flags argument controls details of the transient behaviour.
	 *      
	 *
	 * @param {*} parent parent surface 
	 * @param {number} x surface-local x coordinate 
	 * @param {number} y surface-local y coordinate 
	 * @param {number} flags transient surface behavior 
	 *
	 * @since 1
	 *
	 */
	setTransient (parent, x, y, flags) {
		this.display.marshall(this.id, 4, [object(parent), int(x), int(y), uint(flags)])
	}

	/**
	 *
	 *	Map the surface as a fullscreen surface.
	 *
	 *	If an output parameter is given then the surface will be made
	 *	fullscreen on that output. If the client does not specify the
	 *	output then the compositor will apply its policy - usually
	 *	choosing the output on which the surface has the biggest surface
	 *	area.
	 *
	 *	The client may specify a method to resolve a size conflict
	 *	between the output size and the surface size - this is provided
	 *	through the method parameter.
	 *
	 *	The framerate parameter is used only when the method is set
	 *	to "driver", to indicate the preferred framerate. A value of 0
	 *	indicates that the client does not care about framerate.  The
	 *	framerate is specified in mHz, that is framerate of 60000 is 60Hz.
	 *
	 *	A method of "scale" or "driver" implies a scaling operation of
	 *	the surface, either via a direct scaling operation or a change of
	 *	the output mode. This will override any kind of output scaling, so
	 *	that mapping a surface with a buffer size equal to the mode can
	 *	fill the screen independent of buffer_scale.
	 *
	 *	A method of "fill" means we don't scale up the buffer, however
	 *	any output scale is applied. This means that you may run into
	 *	an edge case where the application maps a buffer with the same
	 *	size of the output mode but buffer_scale 1 (thus making a
	 *	surface larger than the output). In this case it is allowed to
	 *	downscale the results to fit the screen.
	 *
	 *	The compositor must reply to this request with a configure event
	 *	with the dimensions for the output on which the surface will
	 *	be made fullscreen.
	 *      
	 *
	 * @param {number} method method for resolving size conflict 
	 * @param {number} framerate framerate in mHz 
	 * @param {?*} output output on which the surface is to be fullscreen 
	 *
	 * @since 1
	 *
	 */
	setFullscreen (method, framerate, output) {
		this.display.marshall(this.id, 5, [uint(method), uint(framerate), objectOptional(output)])
	}

	/**
	 *
	 *	Map the surface as a popup.
	 *
	 *	A popup surface is a transient surface with an added pointer
	 *	grab.
	 *
	 *	An existing implicit grab will be changed to owner-events mode,
	 *	and the popup grab will continue after the implicit grab ends
	 *	(i.e. releasing the mouse button does not cause the popup to
	 *	be unmapped).
	 *
	 *	The popup grab continues until the window is destroyed or a
	 *	mouse button is pressed in any other client's window. A click
	 *	in any of the client's surfaces is reported as normal, however,
	 *	clicks in other clients' surfaces will be discarded and trigger
	 *	the callback.
	 *
	 *	The x and y arguments specify the location of the upper left
	 *	corner of the surface relative to the upper left corner of the
	 *	parent surface, in surface-local coordinates.
	 *      
	 *
	 * @param {*} seat seat whose pointer is used 
	 * @param {number} serial serial number of the implicit grab on the pointer 
	 * @param {*} parent parent surface 
	 * @param {number} x surface-local x coordinate 
	 * @param {number} y surface-local y coordinate 
	 * @param {number} flags transient surface behavior 
	 *
	 * @since 1
	 *
	 */
	setPopup (seat, serial, parent, x, y, flags) {
		this.display.marshall(this.id, 6, [object(seat), uint(serial), object(parent), int(x), int(y), uint(flags)])
	}

	/**
	 *
	 *	Map the surface as a maximized surface.
	 *
	 *	If an output parameter is given then the surface will be
	 *	maximized on that output. If the client does not specify the
	 *	output then the compositor will apply its policy - usually
	 *	choosing the output on which the surface has the biggest surface
	 *	area.
	 *
	 *	The compositor will reply with a configure event telling
	 *	the expected new surface size. The operation is completed
	 *	on the next buffer attach to this surface.
	 *
	 *	A maximized surface typically fills the entire output it is
	 *	bound to, except for desktop elements such as panels. This is
	 *	the main difference between a maximized shell surface and a
	 *	fullscreen shell surface.
	 *
	 *	The details depend on the compositor implementation.
	 *      
	 *
	 * @param {?*} output output on which the surface is to be maximized 
	 *
	 * @since 1
	 *
	 */
	setMaximized (output) {
		this.display.marshall(this.id, 7, [objectOptional(output)])
	}

	/**
	 *
	 *	Set a short title for the surface.
	 *
	 *	This string may be used to identify the surface in a task bar,
	 *	window list, or other user interface elements provided by the
	 *	compositor.
	 *
	 *	The string must be encoded in UTF-8.
	 *      
	 *
	 * @param {string} title surface title 
	 *
	 * @since 1
	 *
	 */
	setTitle (title) {
		this.display.marshall(this.id, 8, [string(title)])
	}

	/**
	 *
	 *	Set a class for the surface.
	 *
	 *	The surface class identifies the general class of applications
	 *	to which the surface belongs. A common convention is to use the
	 *	file name (or the full path if it is a non-standard location) of
	 *	the application's .desktop file as the class.
	 *      
	 *
	 * @param {string} clazz surface class 
	 *
	 * @since 1
	 *
	 */
	setClass (clazz) {
		this.display.marshall(this.id, 9, [string(clazz)])
	}

/**
	 *@param {Display}display
	 *@param {number}id
	 */
	constructor (display, id) {
		super(display, id)
		/**
		 * @type {WlShellSurfaceEvents|null}
		 */
		this.listener = null
	}

	async [0] (message) {
		await this.listener.ping(u(message))
	}

	async [1] (message) {
		await this.listener.configure(u(message), i(message), i(message))
	}

	async [2] (message) {
		await this.listener.popupDone()
	}

}
WlShellSurfaceProxy.protocolName = 'wl_shell_surface'

WlShellSurfaceProxy.Resize = {
  /**
   * no edge
   */
  none: 0,
  /**
   * top edge
   */
  top: 1,
  /**
   * bottom edge
   */
  bottom: 2,
  /**
   * left edge
   */
  left: 4,
  /**
   * top and left edges
   */
  topLeft: 5,
  /**
   * bottom and left edges
   */
  bottomLeft: 6,
  /**
   * right edge
   */
  right: 8,
  /**
   * top and right edges
   */
  topRight: 9,
  /**
   * bottom and right edges
   */
  bottomRight: 10
}

WlShellSurfaceProxy.Transient = {
  /**
   * do not set keyboard focus
   */
  inactive: 0x1
}

WlShellSurfaceProxy.FullscreenMethod = {
  /**
   * no preference, apply default policy
   */
  default: 0,
  /**
   * scale, preserve the surface's aspect ratio and center on output
   */
  scale: 1,
  /**
   * switch output mode to the smallest mode that can fit the surface, add black borders to compensate size mismatch
   */
  driver: 2,
  /**
   * no upscaling, center on output and add black borders to compensate size mismatch
   */
  fill: 3
}

/* harmony default export */ __webpack_exports__["default"] = (WlShellSurfaceProxy);


/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlSubcompositorProxy.js":
/*!************************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlSubcompositorProxy.js ***!
  \************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Proxy */ "../../westfield/client/runtime/src/protocol/Proxy.js");
/* harmony import */ var _WlSubsurfaceProxy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./WlSubsurfaceProxy */ "../../westfield/client/runtime/src/protocol/WlSubsurfaceProxy.js");
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */


const { uint, uintOptional, int, intOptional, fixed, 
	fixedOptional, object, objectOptional, newObject, string, 
	stringOptional, array, arrayOptional, 
	fileDescriptorOptional, fileDescriptor, 
h, u, i, f, o, n, s, a } = westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["Connection"]



/**
 *
 *      The global interface exposing sub-surface compositing capabilities.
 *      A wl_surface, that has sub-surfaces associated, is called the
 *      parent surface. Sub-surfaces can be arbitrarily nested and create
 *      a tree of sub-surfaces.
 *
 *      The root surface in a tree of sub-surfaces is the main
 *      surface. The main surface cannot be a sub-surface, because
 *      sub-surfaces must always have a parent.
 *
 *      A main surface with its sub-surfaces forms a (compound) window.
 *      For window management purposes, this set of wl_surface objects is
 *      to be considered as a single window, and it should also behave as
 *      such.
 *
 *      The aim of sub-surfaces is to offload some of the compositing work
 *      within a window from clients to the compositor. A prime example is
 *      a video player with decorations and video in separate wl_surface
 *      objects. This should allow the compositor to pass YUV video buffer
 *      processing to dedicated overlay hardware when possible.
 *    
 */
class WlSubcompositorProxy extends _Proxy__WEBPACK_IMPORTED_MODULE_1__["default"] {

	/**
	 *
	 *	Informs the server that the client will not be using this
	 *	protocol object anymore. This does not affect any other
	 *	objects, wl_subsurface objects included.
	 *      
	 * @since 1
	 *
	 */
	destroy () {
		this.display.marshall(this.id, 0, [])
	}

	/**
	 *
	 *	Create a sub-surface interface for the given surface, and
	 *	associate it with the given parent surface. This turns a
	 *	plain wl_surface into a sub-surface.
	 *
	 *	The to-be sub-surface must not already have another role, and it
	 *	must not have an existing wl_subsurface object. Otherwise a protocol
	 *	error is raised.
	 *      
	 *
	 * @param {*} surface the surface to be turned into a sub-surface 
	 * @param {*} parent the parent surface 
	 * @return {WlSubsurfaceProxy} the new sub-surface object ID 
	 *
	 * @since 1
	 *
	 */
	getSubsurface (surface, parent) {
		return this.display.marshallConstructor(this.id, 1, _WlSubsurfaceProxy__WEBPACK_IMPORTED_MODULE_2__["default"], [newObject(), object(surface), object(parent)])
	}

/**
	 *@param {Display}display
	 *@param {number}id
	 */
	constructor (display, id) {
		super(display, id)
		/**
		 * @type {WlSubcompositorEvents|null}
		 */
		this.listener = null
	}

}
WlSubcompositorProxy.protocolName = 'wl_subcompositor'

WlSubcompositorProxy.Error = {
  /**
   * the to-be sub-surface is invalid
   */
  badSurface: 0
}

/* harmony default export */ __webpack_exports__["default"] = (WlSubcompositorProxy);


/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlSubsurfaceProxy.js":
/*!*********************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlSubsurfaceProxy.js ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Proxy */ "../../westfield/client/runtime/src/protocol/Proxy.js");
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */


const { uint, uintOptional, int, intOptional, fixed, 
	fixedOptional, object, objectOptional, newObject, string, 
	stringOptional, array, arrayOptional, 
	fileDescriptorOptional, fileDescriptor, 
h, u, i, f, o, n, s, a } = westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["Connection"]


/**
 *
 *      An additional interface to a wl_surface object, which has been
 *      made a sub-surface. A sub-surface has one parent surface. A
 *      sub-surface's size and position are not limited to that of the parent.
 *      Particularly, a sub-surface is not automatically clipped to its
 *      parent's area.
 *
 *      A sub-surface becomes mapped, when a non-NULL wl_buffer is applied
 *      and the parent surface is mapped. The order of which one happens
 *      first is irrelevant. A sub-surface is hidden if the parent becomes
 *      hidden, or if a NULL wl_buffer is applied. These rules apply
 *      recursively through the tree of surfaces.
 *
 *      The behaviour of a wl_surface.commit request on a sub-surface
 *      depends on the sub-surface's mode. The possible modes are
 *      synchronized and desynchronized, see methods
 *      wl_subsurface.set_sync and wl_subsurface.set_desync. Synchronized
 *      mode caches the wl_surface state to be applied when the parent's
 *      state gets applied, and desynchronized mode applies the pending
 *      wl_surface state directly. A sub-surface is initially in the
 *      synchronized mode.
 *
 *      Sub-surfaces have also other kind of state, which is managed by
 *      wl_subsurface requests, as opposed to wl_surface requests. This
 *      state includes the sub-surface position relative to the parent
 *      surface (wl_subsurface.set_position), and the stacking order of
 *      the parent and its sub-surfaces (wl_subsurface.place_above and
 *      .place_below). This state is applied when the parent surface's
 *      wl_surface state is applied, regardless of the sub-surface's mode.
 *      As the exception, set_sync and set_desync are effective immediately.
 *
 *      The main surface can be thought to be always in desynchronized mode,
 *      since it does not have a parent in the sub-surfaces sense.
 *
 *      Even if a sub-surface is in desynchronized mode, it will behave as
 *      in synchronized mode, if its parent surface behaves as in
 *      synchronized mode. This rule is applied recursively throughout the
 *      tree of surfaces. This means, that one can set a sub-surface into
 *      synchronized mode, and then assume that all its child and grand-child
 *      sub-surfaces are synchronized, too, without explicitly setting them.
 *
 *      If the wl_surface associated with the wl_subsurface is destroyed, the
 *      wl_subsurface object becomes inert. Note, that destroying either object
 *      takes effect immediately. If you need to synchronize the removal
 *      of a sub-surface to the parent surface update, unmap the sub-surface
 *      first by attaching a NULL wl_buffer, update parent, and then destroy
 *      the sub-surface.
 *
 *      If the parent wl_surface object is destroyed, the sub-surface is
 *      unmapped.
 *    
 */
class WlSubsurfaceProxy extends _Proxy__WEBPACK_IMPORTED_MODULE_1__["default"] {

	/**
	 *
	 *	The sub-surface interface is removed from the wl_surface object
	 *	that was turned into a sub-surface with a
	 *	wl_subcompositor.get_subsurface request. The wl_surface's association
	 *	to the parent is deleted, and the wl_surface loses its role as
	 *	a sub-surface. The wl_surface is unmapped.
	 *      
	 * @since 1
	 *
	 */
	destroy () {
		this.display.marshall(this.id, 0, [])
	}

	/**
	 *
	 *	This schedules a sub-surface position change.
	 *	The sub-surface will be moved so that its origin (top left
	 *	corner pixel) will be at the location x, y of the parent surface
	 *	coordinate system. The coordinates are not restricted to the parent
	 *	surface area. Negative values are allowed.
	 *
	 *	The scheduled coordinates will take effect whenever the state of the
	 *	parent surface is applied. When this happens depends on whether the
	 *	parent surface is in synchronized mode or not. See
	 *	wl_subsurface.set_sync and wl_subsurface.set_desync for details.
	 *
	 *	If more than one set_position request is invoked by the client before
	 *	the commit of the parent surface, the position of a new request always
	 *	replaces the scheduled position from any previous request.
	 *
	 *	The initial position is 0, 0.
	 *      
	 *
	 * @param {number} x x coordinate in the parent surface 
	 * @param {number} y y coordinate in the parent surface 
	 *
	 * @since 1
	 *
	 */
	setPosition (x, y) {
		this.display.marshall(this.id, 1, [int(x), int(y)])
	}

	/**
	 *
	 *	This sub-surface is taken from the stack, and put back just
	 *	above the reference surface, changing the z-order of the sub-surfaces.
	 *	The reference surface must be one of the sibling surfaces, or the
	 *	parent surface. Using any other surface, including this sub-surface,
	 *	will cause a protocol error.
	 *
	 *	The z-order is double-buffered. Requests are handled in order and
	 *	applied immediately to a pending state. The final pending state is
	 *	copied to the active state the next time the state of the parent
	 *	surface is applied. When this happens depends on whether the parent
	 *	surface is in synchronized mode or not. See wl_subsurface.set_sync and
	 *	wl_subsurface.set_desync for details.
	 *
	 *	A new sub-surface is initially added as the top-most in the stack
	 *	of its siblings and parent.
	 *      
	 *
	 * @param {*} sibling the reference surface 
	 *
	 * @since 1
	 *
	 */
	placeAbove (sibling) {
		this.display.marshall(this.id, 2, [object(sibling)])
	}

	/**
	 *
	 *	The sub-surface is placed just below the reference surface.
	 *	See wl_subsurface.place_above.
	 *      
	 *
	 * @param {*} sibling the reference surface 
	 *
	 * @since 1
	 *
	 */
	placeBelow (sibling) {
		this.display.marshall(this.id, 3, [object(sibling)])
	}

	/**
	 *
	 *	Change the commit behaviour of the sub-surface to synchronized
	 *	mode, also described as the parent dependent mode.
	 *
	 *	In synchronized mode, wl_surface.commit on a sub-surface will
	 *	accumulate the committed state in a cache, but the state will
	 *	not be applied and hence will not change the compositor output.
	 *	The cached state is applied to the sub-surface immediately after
	 *	the parent surface's state is applied. This ensures atomic
	 *	updates of the parent and all its synchronized sub-surfaces.
	 *	Applying the cached state will invalidate the cache, so further
	 *	parent surface commits do not (re-)apply old state.
	 *
	 *	See wl_subsurface for the recursive effect of this mode.
	 *      
	 * @since 1
	 *
	 */
	setSync () {
		this.display.marshall(this.id, 4, [])
	}

	/**
	 *
	 *	Change the commit behaviour of the sub-surface to desynchronized
	 *	mode, also described as independent or freely running mode.
	 *
	 *	In desynchronized mode, wl_surface.commit on a sub-surface will
	 *	apply the pending state directly, without caching, as happens
	 *	normally with a wl_surface. Calling wl_surface.commit on the
	 *	parent surface has no effect on the sub-surface's wl_surface
	 *	state. This mode allows a sub-surface to be updated on its own.
	 *
	 *	If cached state exists when wl_surface.commit is called in
	 *	desynchronized mode, the pending state is added to the cached
	 *	state, and applied as a whole. This invalidates the cache.
	 *
	 *	Note: even if a sub-surface is set to desynchronized, a parent
	 *	sub-surface may override it to behave as synchronized. For details,
	 *	see wl_subsurface.
	 *
	 *	If a surface's parent surface behaves as desynchronized, then
	 *	the cached state is applied on set_desync.
	 *      
	 * @since 1
	 *
	 */
	setDesync () {
		this.display.marshall(this.id, 5, [])
	}

/**
	 *@param {Display}display
	 *@param {number}id
	 */
	constructor (display, id) {
		super(display, id)
		/**
		 * @type {WlSubsurfaceEvents|null}
		 */
		this.listener = null
	}

}
WlSubsurfaceProxy.protocolName = 'wl_subsurface'

WlSubsurfaceProxy.Error = {
  /**
   * wl_surface is not a sibling or the parent
   */
  badSurface: 0
}

/* harmony default export */ __webpack_exports__["default"] = (WlSubsurfaceProxy);


/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlSurfaceEvents.js":
/*!*******************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlSurfaceEvents.js ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WlSurfaceEvents; });
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */

/**
 * @interface
 */
class WlSurfaceEvents {

	/**
	 *
	 *	This is emitted whenever a surface's creation, movement, or resizing
	 *	results in some part of it being within the scanout region of an
	 *	output.
	 *
	 *	Note that a surface may be overlapping with zero or more outputs.
	 *      
	 *
	 * @param {*} output output entered by the surface 
	 *
	 * @since 1
	 *
	 */
	enter(output) {}

	/**
	 *
	 *	This is emitted whenever a surface's creation, movement, or resizing
	 *	results in it no longer having any part of it within the scanout region
	 *	of an output.
	 *      
	 *
	 * @param {*} output output left by the surface 
	 *
	 * @since 1
	 *
	 */
	leave(output) {}
}



/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlSurfaceProxy.js":
/*!******************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlSurfaceProxy.js ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Proxy */ "../../westfield/client/runtime/src/protocol/Proxy.js");
/* harmony import */ var _WlCallbackProxy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./WlCallbackProxy */ "../../westfield/client/runtime/src/protocol/WlCallbackProxy.js");
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */


const { uint, uintOptional, int, intOptional, fixed, 
	fixedOptional, object, objectOptional, newObject, string, 
	stringOptional, array, arrayOptional, 
	fileDescriptorOptional, fileDescriptor, 
h, u, i, f, o, n, s, a } = westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["Connection"]



/**
 *
 *      A surface is a rectangular area that is displayed on the screen.
 *      It has a location, size and pixel contents.
 *
 *      The size of a surface (and relative positions on it) is described
 *      in surface-local coordinates, which may differ from the buffer
 *      coordinates of the pixel content, in case a buffer_transform
 *      or a buffer_scale is used.
 *
 *      A surface without a "role" is fairly useless: a compositor does
 *      not know where, when or how to present it. The role is the
 *      purpose of a wl_surface. Examples of roles are a cursor for a
 *      pointer (as set by wl_pointer.set_cursor), a drag icon
 *      (wl_data_device.start_drag), a sub-surface
 *      (wl_subcompositor.get_subsurface), and a window as defined by a
 *      shell protocol (e.g. wl_shell.get_shell_surface).
 *
 *      A surface can have only one role at a time. Initially a
 *      wl_surface does not have a role. Once a wl_surface is given a
 *      role, it is set permanently for the whole lifetime of the
 *      wl_surface object. Giving the current role again is allowed,
 *      unless explicitly forbidden by the relevant interface
 *      specification.
 *
 *      Surface roles are given by requests in other interfaces such as
 *      wl_pointer.set_cursor. The request should explicitly mention
 *      that this request gives a role to a wl_surface. Often, this
 *      request also creates a new protocol object that represents the
 *      role and adds additional functionality to wl_surface. When a
 *      client wants to destroy a wl_surface, they must destroy this 'role
 *      object' before the wl_surface.
 *
 *      Destroying the role object does not remove the role from the
 *      wl_surface, but it may stop the wl_surface from "playing the role".
 *      For instance, if a wl_subsurface object is destroyed, the wl_surface
 *      it was created for will be unmapped and forget its position and
 *      z-order. It is allowed to create a wl_subsurface for the same
 *      wl_surface again, but it is not allowed to use the wl_surface as
 *      a cursor (cursor is a different role than sub-surface, and role
 *      switching is not allowed).
 *    
 */
class WlSurfaceProxy extends _Proxy__WEBPACK_IMPORTED_MODULE_1__["default"] {

	/**
	 *
	 *	Deletes the surface and invalidates its object ID.
	 *      
	 * @since 1
	 *
	 */
	destroy () {
		this.display.marshall(this.id, 0, [])
	}

	/**
	 *
	 *	Set a buffer as the content of this surface.
	 *
	 *	The new size of the surface is calculated based on the buffer
	 *	size transformed by the inverse buffer_transform and the
	 *	inverse buffer_scale. This means that the supplied buffer
	 *	must be an integer multiple of the buffer_scale.
	 *
	 *	The x and y arguments specify the location of the new pending
	 *	buffer's upper left corner, relative to the current buffer's upper
	 *	left corner, in surface-local coordinates. In other words, the
	 *	x and y, combined with the new surface size define in which
	 *	directions the surface's size changes.
	 *
	 *	Surface contents are double-buffered state, see wl_surface.commit.
	 *
	 *	The initial surface contents are void; there is no content.
	 *	wl_surface.attach assigns the given wl_buffer as the pending
	 *	wl_buffer. wl_surface.commit makes the pending wl_buffer the new
	 *	surface contents, and the size of the surface becomes the size
	 *	calculated from the wl_buffer, as described above. After commit,
	 *	there is no pending buffer until the next attach.
	 *
	 *	Committing a pending wl_buffer allows the compositor to read the
	 *	pixels in the wl_buffer. The compositor may access the pixels at
	 *	any time after the wl_surface.commit request. When the compositor
	 *	will not access the pixels anymore, it will send the
	 *	wl_buffer.release event. Only after receiving wl_buffer.release,
	 *	the client may reuse the wl_buffer. A wl_buffer that has been
	 *	attached and then replaced by another attach instead of committed
	 *	will not receive a release event, and is not used by the
	 *	compositor.
	 *
	 *	Destroying the wl_buffer after wl_buffer.release does not change
	 *	the surface contents. However, if the client destroys the
	 *	wl_buffer before receiving the wl_buffer.release event, the surface
	 *	contents become undefined immediately.
	 *
	 *	If wl_surface.attach is sent with a NULL wl_buffer, the
	 *	following wl_surface.commit will remove the surface content.
	 *      
	 *
	 * @param {?*} buffer buffer of surface contents 
	 * @param {number} x surface-local x coordinate 
	 * @param {number} y surface-local y coordinate 
	 *
	 * @since 1
	 *
	 */
	attach (buffer, x, y) {
		this.display.marshall(this.id, 1, [objectOptional(buffer), int(x), int(y)])
	}

	/**
	 *
	 *	This request is used to describe the regions where the pending
	 *	buffer is different from the current surface contents, and where
	 *	the surface therefore needs to be repainted. The compositor
	 *	ignores the parts of the damage that fall outside of the surface.
	 *
	 *	Damage is double-buffered state, see wl_surface.commit.
	 *
	 *	The damage rectangle is specified in surface-local coordinates,
	 *	where x and y specify the upper left corner of the damage rectangle.
	 *
	 *	The initial value for pending damage is empty: no damage.
	 *	wl_surface.damage adds pending damage: the new pending damage
	 *	is the union of old pending damage and the given rectangle.
	 *
	 *	wl_surface.commit assigns pending damage as the current damage,
	 *	and clears pending damage. The server will clear the current
	 *	damage as it repaints the surface.
	 *
	 *	Alternatively, damage can be posted with wl_surface.damage_buffer
	 *	which uses buffer coordinates instead of surface coordinates,
	 *	and is probably the preferred and intuitive way of doing this.
	 *      
	 *
	 * @param {number} x surface-local x coordinate 
	 * @param {number} y surface-local y coordinate 
	 * @param {number} width width of damage rectangle 
	 * @param {number} height height of damage rectangle 
	 *
	 * @since 1
	 *
	 */
	damage (x, y, width, height) {
		this.display.marshall(this.id, 2, [int(x), int(y), int(width), int(height)])
	}

	/**
	 *
	 *	Request a notification when it is a good time to start drawing a new
	 *	frame, by creating a frame callback. This is useful for throttling
	 *	redrawing operations, and driving animations.
	 *
	 *	When a client is animating on a wl_surface, it can use the 'frame'
	 *	request to get notified when it is a good time to draw and commit the
	 *	next frame of animation. If the client commits an update earlier than
	 *	that, it is likely that some updates will not make it to the display,
	 *	and the client is wasting resources by drawing too often.
	 *
	 *	The frame request will take effect on the next wl_surface.commit.
	 *	The notification will only be posted for one frame unless
	 *	requested again. For a wl_surface, the notifications are posted in
	 *	the order the frame requests were committed.
	 *
	 *	The server must send the notifications so that a client
	 *	will not send excessive updates, while still allowing
	 *	the highest possible update rate for clients that wait for the reply
	 *	before drawing again. The server should give some time for the client
	 *	to draw and commit after sending the frame callback events to let it
	 *	hit the next output refresh.
	 *
	 *	A server should avoid signaling the frame callbacks if the
	 *	surface is not visible in any way, e.g. the surface is off-screen,
	 *	or completely obscured by other opaque surfaces.
	 *
	 *	The object returned by this request will be destroyed by the
	 *	compositor after the callback is fired and as such the client must not
	 *	attempt to use it after that point.
	 *
	 *	The callback_data passed in the callback is the current time, in
	 *	milliseconds, with an undefined base.
	 *      
	 *
	 * @return {WlCallbackProxy} callback object for the frame request 
	 *
	 * @since 1
	 *
	 */
	frame () {
		return this.display.marshallConstructor(this.id, 3, _WlCallbackProxy__WEBPACK_IMPORTED_MODULE_2__["default"], [newObject()])
	}

	/**
	 *
	 *	This request sets the region of the surface that contains
	 *	opaque content.
	 *
	 *	The opaque region is an optimization hint for the compositor
	 *	that lets it optimize the redrawing of content behind opaque
	 *	regions.  Setting an opaque region is not required for correct
	 *	behaviour, but marking transparent content as opaque will result
	 *	in repaint artifacts.
	 *
	 *	The opaque region is specified in surface-local coordinates.
	 *
	 *	The compositor ignores the parts of the opaque region that fall
	 *	outside of the surface.
	 *
	 *	Opaque region is double-buffered state, see wl_surface.commit.
	 *
	 *	wl_surface.set_opaque_region changes the pending opaque region.
	 *	wl_surface.commit copies the pending region to the current region.
	 *	Otherwise, the pending and current regions are never changed.
	 *
	 *	The initial value for an opaque region is empty. Setting the pending
	 *	opaque region has copy semantics, and the wl_region object can be
	 *	destroyed immediately. A NULL wl_region causes the pending opaque
	 *	region to be set to empty.
	 *      
	 *
	 * @param {?*} region opaque region of the surface 
	 *
	 * @since 1
	 *
	 */
	setOpaqueRegion (region) {
		this.display.marshall(this.id, 4, [objectOptional(region)])
	}

	/**
	 *
	 *	This request sets the region of the surface that can receive
	 *	pointer and touch events.
	 *
	 *	Input events happening outside of this region will try the next
	 *	surface in the server surface stack. The compositor ignores the
	 *	parts of the input region that fall outside of the surface.
	 *
	 *	The input region is specified in surface-local coordinates.
	 *
	 *	Input region is double-buffered state, see wl_surface.commit.
	 *
	 *	wl_surface.set_input_region changes the pending input region.
	 *	wl_surface.commit copies the pending region to the current region.
	 *	Otherwise the pending and current regions are never changed,
	 *	except cursor and icon surfaces are special cases, see
	 *	wl_pointer.set_cursor and wl_data_device.start_drag.
	 *
	 *	The initial value for an input region is infinite. That means the
	 *	whole surface will accept input. Setting the pending input region
	 *	has copy semantics, and the wl_region object can be destroyed
	 *	immediately. A NULL wl_region causes the input region to be set
	 *	to infinite.
	 *      
	 *
	 * @param {?*} region input region of the surface 
	 *
	 * @since 1
	 *
	 */
	setInputRegion (region) {
		this.display.marshall(this.id, 5, [objectOptional(region)])
	}

	/**
	 *
	 *	Surface state (input, opaque, and damage regions, attached buffers,
	 *	etc.) is double-buffered. Protocol requests modify the pending state,
	 *	as opposed to the current state in use by the compositor. A commit
	 *	request atomically applies all pending state, replacing the current
	 *	state. After commit, the new pending state is as documented for each
	 *	related request.
	 *
	 *	On commit, a pending wl_buffer is applied first, and all other state
	 *	second. This means that all coordinates in double-buffered state are
	 *	relative to the new wl_buffer coming into use, except for
	 *	wl_surface.attach itself. If there is no pending wl_buffer, the
	 *	coordinates are relative to the current surface contents.
	 *
	 *	All requests that need a commit to become effective are documented
	 *	to affect double-buffered state.
	 *
	 *	Other interfaces may add further double-buffered surface state.
	 *      
	 *
	 * @param {number} serial serial number of the commit 
	 *
	 * @since 1
	 *
	 */
	commit (serial) {
		this.display.marshall(this.id, 6, [uint(serial)])
	}

	/**
	 *
	 *	This request sets an optional transformation on how the compositor
	 *	interprets the contents of the buffer attached to the surface. The
	 *	accepted values for the transform parameter are the values for
	 *	wl_output.transform.
	 *
	 *	Buffer transform is double-buffered state, see wl_surface.commit.
	 *
	 *	A newly created surface has its buffer transformation set to normal.
	 *
	 *	wl_surface.set_buffer_transform changes the pending buffer
	 *	transformation. wl_surface.commit copies the pending buffer
	 *	transformation to the current one. Otherwise, the pending and current
	 *	values are never changed.
	 *
	 *	The purpose of this request is to allow clients to render content
	 *	according to the output transform, thus permitting the compositor to
	 *	use certain optimizations even if the display is rotated. Using
	 *	hardware overlays and scanning out a client buffer for fullscreen
	 *	surfaces are examples of such optimizations. Those optimizations are
	 *	highly dependent on the compositor implementation, so the use of this
	 *	request should be considered on a case-by-case basis.
	 *
	 *	Note that if the transform value includes 90 or 270 degree rotation,
	 *	the width of the buffer will become the surface height and the height
	 *	of the buffer will become the surface width.
	 *
	 *	If transform is not one of the values from the
	 *	wl_output.transform enum the invalid_transform protocol error
	 *	is raised.
	 *      
	 *
	 * @param {number} transform transform for interpreting buffer contents 
	 *
	 * @since 2
	 *
	 */
	setBufferTransform (transform) {
		this.display.marshall(this.id, 7, [int(transform)])
	}

	/**
	 *
	 *	This request sets an optional scaling factor on how the compositor
	 *	interprets the contents of the buffer attached to the window.
	 *
	 *	Buffer scale is double-buffered state, see wl_surface.commit.
	 *
	 *	A newly created surface has its buffer scale set to 1.
	 *
	 *	wl_surface.set_buffer_scale changes the pending buffer scale.
	 *	wl_surface.commit copies the pending buffer scale to the current one.
	 *	Otherwise, the pending and current values are never changed.
	 *
	 *	The purpose of this request is to allow clients to supply higher
	 *	resolution buffer data for use on high resolution outputs. It is
	 *	intended that you pick the same buffer scale as the scale of the
	 *	output that the surface is displayed on. This means the compositor
	 *	can avoid scaling when rendering the surface on that output.
	 *
	 *	Note that if the scale is larger than 1, then you have to attach
	 *	a buffer that is larger (by a factor of scale in each dimension)
	 *	than the desired surface size.
	 *
	 *	If scale is not positive the invalid_scale protocol error is
	 *	raised.
	 *      
	 *
	 * @param {number} scale positive scale for interpreting buffer contents 
	 *
	 * @since 3
	 *
	 */
	setBufferScale (scale) {
		this.display.marshall(this.id, 8, [int(scale)])
	}

	/**
	 *
	 *	This request is used to describe the regions where the pending
	 *	buffer is different from the current surface contents, and where
	 *	the surface therefore needs to be repainted. The compositor
	 *	ignores the parts of the damage that fall outside of the surface.
	 *
	 *	Damage is double-buffered state, see wl_surface.commit.
	 *
	 *	The damage rectangle is specified in buffer coordinates,
	 *	where x and y specify the upper left corner of the damage rectangle.
	 *
	 *	The initial value for pending damage is empty: no damage.
	 *	wl_surface.damage_buffer adds pending damage: the new pending
	 *	damage is the union of old pending damage and the given rectangle.
	 *
	 *	wl_surface.commit assigns pending damage as the current damage,
	 *	and clears pending damage. The server will clear the current
	 *	damage as it repaints the surface.
	 *
	 *	This request differs from wl_surface.damage in only one way - it
	 *	takes damage in buffer coordinates instead of surface-local
	 *	coordinates. While this generally is more intuitive than surface
	 *	coordinates, it is especially desirable when using wp_viewport
	 *	or when a drawing library (like EGL) is unaware of buffer scale
	 *	and buffer transform.
	 *
	 *	Note: Because buffer transformation changes and damage requests may
	 *	be interleaved in the protocol stream, it is impossible to determine
	 *	the actual mapping between surface and buffer damage until
	 *	wl_surface.commit time. Therefore, compositors wishing to take both
	 *	kinds of damage into account will have to accumulate damage from the
	 *	two requests separately and only transform from one to the other
	 *	after receiving the wl_surface.commit.
	 *      
	 *
	 * @param {number} x buffer-local x coordinate 
	 * @param {number} y buffer-local y coordinate 
	 * @param {number} width width of damage rectangle 
	 * @param {number} height height of damage rectangle 
	 *
	 * @since 4
	 *
	 */
	damageBuffer (x, y, width, height) {
		this.display.marshall(this.id, 9, [int(x), int(y), int(width), int(height)])
	}

/**
	 *@param {Display}display
	 *@param {number}id
	 */
	constructor (display, id) {
		super(display, id)
		/**
		 * @type {WlSurfaceEvents|null}
		 */
		this.listener = null
	}

	async [0] (message) {
		await this.listener.enter(o(message, false, this.display.connection))
	}

	async [1] (message) {
		await this.listener.leave(o(message, false, this.display.connection))
	}

}
WlSurfaceProxy.protocolName = 'wl_surface'

WlSurfaceProxy.Error = {
  /**
   * buffer scale value is invalid
   */
  invalidScale: 0,
  /**
   * buffer transform value is invalid
   */
  invalidTransform: 1
}

/* harmony default export */ __webpack_exports__["default"] = (WlSurfaceProxy);


/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlTouchEvents.js":
/*!*****************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlTouchEvents.js ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WlTouchEvents; });
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */

/**
 * @interface
 */
class WlTouchEvents {

	/**
	 *
	 *	A new touch point has appeared on the surface. This touch point is
	 *	assigned a unique ID. Future events from this touch point reference
	 *	this ID. The ID ceases to be valid after a touch up event and may be
	 *	reused in the future.
	 *      
	 *
	 * @param {number} serial serial number of the touch down event 
	 * @param {number} time timestamp with millisecond granularity 
	 * @param {*} surface surface touched 
	 * @param {number} id the unique ID of this touch point 
	 * @param {Fixed} x surface-local x coordinate 
	 * @param {Fixed} y surface-local y coordinate 
	 *
	 * @since 1
	 *
	 */
	down(serial, time, surface, id, x, y) {}

	/**
	 *
	 *	The touch point has disappeared. No further events will be sent for
	 *	this touch point and the touch point's ID is released and may be
	 *	reused in a future touch down event.
	 *      
	 *
	 * @param {number} serial serial number of the touch up event 
	 * @param {number} time timestamp with millisecond granularity 
	 * @param {number} id the unique ID of this touch point 
	 *
	 * @since 1
	 *
	 */
	up(serial, time, id) {}

	/**
	 *
	 *	A touch point has changed coordinates.
	 *      
	 *
	 * @param {number} time timestamp with millisecond granularity 
	 * @param {number} id the unique ID of this touch point 
	 * @param {Fixed} x surface-local x coordinate 
	 * @param {Fixed} y surface-local y coordinate 
	 *
	 * @since 1
	 *
	 */
	motion(time, id, x, y) {}

	/**
	 *
	 *	Indicates the end of a set of events that logically belong together.
	 *	A client is expected to accumulate the data in all events within the
	 *	frame before proceeding.
	 *
	 *	A wl_touch.frame terminates at least one event but otherwise no
	 *	guarantee is provided about the set of events within a frame. A client
	 *	must assume that any state not updated in a frame is unchanged from the
	 *	previously known state.
	 *      
	 *
	 *
	 * @since 1
	 *
	 */
	frame() {}

	/**
	 *
	 *	Sent if the compositor decides the touch stream is a global
	 *	gesture. No further events are sent to the clients from that
	 *	particular gesture. Touch cancellation applies to all touch points
	 *	currently active on this client's surface. The client is
	 *	responsible for finalizing the touch points, future touch points on
	 *	this surface may reuse the touch point ID.
	 *      
	 *
	 *
	 * @since 1
	 *
	 */
	cancel() {}

	/**
	 *
	 *	Sent when a touchpoint has changed its shape.
	 *
	 *	This event does not occur on its own. It is sent before a
	 *	wl_touch.frame event and carries the new shape information for
	 *	any previously reported, or new touch points of that frame.
	 *
	 *	Other events describing the touch point such as wl_touch.down,
	 *	wl_touch.motion or wl_touch.orientation may be sent within the
	 *	same wl_touch.frame. A client should treat these events as a single
	 *	logical touch point update. The order of wl_touch.shape,
	 *	wl_touch.orientation and wl_touch.motion is not guaranteed.
	 *	A wl_touch.down event is guaranteed to occur before the first
	 *	wl_touch.shape event for this touch ID but both events may occur within
	 *	the same wl_touch.frame.
	 *
	 *	A touchpoint shape is approximated by an ellipse through the major and
	 *	minor axis length. The major axis length describes the longer diameter
	 *	of the ellipse, while the minor axis length describes the shorter
	 *	diameter. Major and minor are orthogonal and both are specified in
	 *	surface-local coordinates. The center of the ellipse is always at the
	 *	touchpoint location as reported by wl_touch.down or wl_touch.move.
	 *
	 *	This event is only sent by the compositor if the touch device supports
	 *	shape reports. The client has to make reasonable assumptions about the
	 *	shape if it did not receive this event.
	 *      
	 *
	 * @param {number} id the unique ID of this touch point 
	 * @param {Fixed} major length of the major axis in surface-local coordinates 
	 * @param {Fixed} minor length of the minor axis in surface-local coordinates 
	 *
	 * @since 6
	 *
	 */
	shape(id, major, minor) {}

	/**
	 *
	 *	Sent when a touchpoint has changed its orientation.
	 *
	 *	This event does not occur on its own. It is sent before a
	 *	wl_touch.frame event and carries the new shape information for
	 *	any previously reported, or new touch points of that frame.
	 *
	 *	Other events describing the touch point such as wl_touch.down,
	 *	wl_touch.motion or wl_touch.shape may be sent within the
	 *	same wl_touch.frame. A client should treat these events as a single
	 *	logical touch point update. The order of wl_touch.shape,
	 *	wl_touch.orientation and wl_touch.motion is not guaranteed.
	 *	A wl_touch.down event is guaranteed to occur before the first
	 *	wl_touch.orientation event for this touch ID but both events may occur
	 *	within the same wl_touch.frame.
	 *
	 *	The orientation describes the clockwise angle of a touchpoint's major
	 *	axis to the positive surface y-axis and is normalized to the -180 to
	 *	+180 degree range. The granularity of orientation depends on the touch
	 *	device, some devices only support binary rotation values between 0 and
	 *	90 degrees.
	 *
	 *	This event is only sent by the compositor if the touch device supports
	 *	orientation reports.
	 *      
	 *
	 * @param {number} id the unique ID of this touch point 
	 * @param {Fixed} orientation angle between major axis and positive surface y-axis in degrees 
	 *
	 * @since 6
	 *
	 */
	orientation(id, orientation) {}
}



/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/WlTouchProxy.js":
/*!****************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/WlTouchProxy.js ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Proxy */ "../../westfield/client/runtime/src/protocol/Proxy.js");
/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */


const { uint, uintOptional, int, intOptional, fixed, 
	fixedOptional, object, objectOptional, newObject, string, 
	stringOptional, array, arrayOptional, 
	fileDescriptorOptional, fileDescriptor, 
h, u, i, f, o, n, s, a } = westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["Connection"]


/**
 *
 *      The wl_touch interface represents a touchscreen
 *      associated with a seat.
 *
 *      Touch interactions can consist of one or more contacts.
 *      For each contact, a series of events is generated, starting
 *      with a down event, followed by zero or more motion events,
 *      and ending with an up event. Events relating to the same
 *      contact point can be identified by the ID of the sequence.
 *    
 */
class WlTouchProxy extends _Proxy__WEBPACK_IMPORTED_MODULE_1__["default"] {

	/**
	 * @since 3
	 *
	 */
	release () {
		this.display.marshall(this.id, 0, [])
	}

/**
	 *@param {Display}display
	 *@param {number}id
	 */
	constructor (display, id) {
		super(display, id)
		/**
		 * @type {WlTouchEvents|null}
		 */
		this.listener = null
	}

	async [0] (message) {
		await this.listener.down(u(message), u(message), o(message, false, this.display.connection), i(message), f(message), f(message))
	}

	async [1] (message) {
		await this.listener.up(u(message), u(message), i(message))
	}

	async [2] (message) {
		await this.listener.motion(u(message), i(message), f(message), f(message))
	}

	async [3] (message) {
		await this.listener.frame()
	}

	async [4] (message) {
		await this.listener.cancel()
	}

	async [5] (message) {
		await this.listener.shape(i(message), f(message), f(message))
	}

	async [6] (message) {
		await this.listener.orientation(i(message), f(message))
	}

}
WlTouchProxy.protocolName = 'wl_touch'

/* harmony default export */ __webpack_exports__["default"] = (WlTouchProxy);


/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/XdgPopupEvents.js":
/*!******************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/XdgPopupEvents.js ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return XdgPopupEvents; });
/*
 *
 *    Copyright © 2008-2013 Kristian Høgsberg
 *    Copyright © 2013      Rafael Antognolli
 *    Copyright © 2013      Jasper St. Pierre
 *    Copyright © 2010-2013 Intel Corporation
 *    Copyright © 2015-2017 Samsung Electronics Co., Ltd
 *    Copyright © 2015-2017 Red Hat Inc.
 *
 *    Permission is hereby granted, free of charge, to any person obtaining a
 *    copy of this software and associated documentation files (the "Software"),
 *    to deal in the Software without restriction, including without limitation
 *    the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *    and/or sell copies of the Software, and to permit persons to whom the
 *    Software is furnished to do so, subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the next
 *    paragraph) shall be included in all copies or substantial portions of the
 *    Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 *    THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *    DEALINGS IN THE SOFTWARE.
 *  
 */

/**
 * @interface
 */
class XdgPopupEvents {

	/**
	 *
	 *	This event asks the popup surface to configure itself given the
	 *	configuration. The configured state should not be applied immediately.
	 *	See xdg_surface.configure for details.
	 *
	 *	The x and y arguments represent the position the popup was placed at
	 *	given the xdg_positioner rule, relative to the upper left corner of the
	 *	window geometry of the parent surface.
	 *      
	 *
	 * @param {number} x x position relative to parent surface window geometry 
	 * @param {number} y y position relative to parent surface window geometry 
	 * @param {number} width window geometry width 
	 * @param {number} height window geometry height 
	 *
	 * @since 1
	 *
	 */
	configure(x, y, width, height) {}

	/**
	 *
	 *	The popup_done event is sent out when a popup is dismissed by the
	 *	compositor. The client should destroy the xdg_popup object at this
	 *	point.
	 *      
	 *
	 *
	 * @since 1
	 *
	 */
	popupDone() {}
}



/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/XdgPopupProxy.js":
/*!*****************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/XdgPopupProxy.js ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Proxy */ "../../westfield/client/runtime/src/protocol/Proxy.js");
/*
 *
 *    Copyright © 2008-2013 Kristian Høgsberg
 *    Copyright © 2013      Rafael Antognolli
 *    Copyright © 2013      Jasper St. Pierre
 *    Copyright © 2010-2013 Intel Corporation
 *    Copyright © 2015-2017 Samsung Electronics Co., Ltd
 *    Copyright © 2015-2017 Red Hat Inc.
 *
 *    Permission is hereby granted, free of charge, to any person obtaining a
 *    copy of this software and associated documentation files (the "Software"),
 *    to deal in the Software without restriction, including without limitation
 *    the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *    and/or sell copies of the Software, and to permit persons to whom the
 *    Software is furnished to do so, subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the next
 *    paragraph) shall be included in all copies or substantial portions of the
 *    Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 *    THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *    DEALINGS IN THE SOFTWARE.
 *  
 */


const { uint, uintOptional, int, intOptional, fixed, 
	fixedOptional, object, objectOptional, newObject, string, 
	stringOptional, array, arrayOptional, 
	fileDescriptorOptional, fileDescriptor, 
h, u, i, f, o, n, s, a } = westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["Connection"]


/**
 *
 *      A popup surface is a short-lived, temporary surface. It can be used to
 *      implement for example menus, popovers, tooltips and other similar user
 *      interface concepts.
 *
 *      A popup can be made to take an explicit grab. See xdg_popup.grab for
 *      details.
 *
 *      When the popup is dismissed, a popup_done event will be sent out, and at
 *      the same time the surface will be unmapped. See the xdg_popup.popup_done
 *      event for details.
 *
 *      Explicitly destroying the xdg_popup object will also dismiss the popup and
 *      unmap the surface. Clients that want to dismiss the popup when another
 *      surface of their own is clicked should dismiss the popup using the destroy
 *      request.
 *
 *      The parent surface must have either the xdg_toplevel or xdg_popup surface
 *      role.
 *
 *      A newly created xdg_popup will be stacked on top of all previously created
 *      xdg_popup surfaces associated with the same xdg_toplevel.
 *
 *      The parent of an xdg_popup must be mapped (see the xdg_surface
 *      description) before the xdg_popup itself.
 *
 *      The x and y arguments passed when creating the popup object specify
 *      where the top left of the popup should be placed, relative to the
 *      local surface coordinates of the parent surface. See
 *      xdg_surface.get_popup. An xdg_popup must intersect with or be at least
 *      partially adjacent to its parent surface.
 *
 *      The client must call wl_surface.commit on the corresponding wl_surface
 *      for the xdg_popup state to take effect.
 *    
 */
class XdgPopupProxy extends _Proxy__WEBPACK_IMPORTED_MODULE_1__["default"] {

	/**
	 *
	 *	This destroys the popup. Explicitly destroying the xdg_popup
	 *	object will also dismiss the popup, and unmap the surface.
	 *
	 *	If this xdg_popup is not the "topmost" popup, a protocol error
	 *	will be sent.
	 *      
	 * @since 1
	 *
	 */
	destroy () {
		this.display.marshall(this.id, 0, [])
	}

	/**
	 *
	 *	This request makes the created popup take an explicit grab. An explicit
	 *	grab will be dismissed when the user dismisses the popup, or when the
	 *	client destroys the xdg_popup. This can be done by the user clicking
	 *	outside the surface, using the keyboard, or even locking the screen
	 *	through closing the lid or a timeout.
	 *
	 *	If the compositor denies the grab, the popup will be immediately
	 *	dismissed.
	 *
	 *	This request must be used in response to some sort of user action like a
	 *	button press, key press, or touch down event. The serial number of the
	 *	event should be passed as 'serial'.
	 *
	 *	The parent of a grabbing popup must either be an xdg_toplevel surface or
	 *	another xdg_popup with an explicit grab. If the parent is another
	 *	xdg_popup it means that the popups are nested, with this popup now being
	 *	the topmost popup.
	 *
	 *	Nested popups must be destroyed in the reverse order they were created
	 *	in, e.g. the only popup you are allowed to destroy at all times is the
	 *	topmost one.
	 *
	 *	When compositors choose to dismiss a popup, they may dismiss every
	 *	nested grabbing popup as well. When a compositor dismisses popups, it
	 *	will follow the same dismissing order as required from the client.
	 *
	 *	The parent of a grabbing popup must either be another xdg_popup with an
	 *	active explicit grab, or an xdg_popup or xdg_toplevel, if there are no
	 *	explicit grabs already taken.
	 *
	 *	If the topmost grabbing popup is destroyed, the grab will be returned to
	 *	the parent of the popup, if that parent previously had an explicit grab.
	 *
	 *	If the parent is a grabbing popup which has already been dismissed, this
	 *	popup will be immediately dismissed. If the parent is a popup that did
	 *	not take an explicit grab, an error will be raised.
	 *
	 *	During a popup grab, the client owning the grab will receive pointer
	 *	and touch events for all their surfaces as normal (similar to an
	 *	"owner-events" grab in X11 parlance), while the top most grabbing popup
	 *	will always have keyboard focus.
	 *      
	 *
	 * @param {*} seat the wl_seat of the user event 
	 * @param {number} serial the serial of the user event 
	 *
	 * @since 1
	 *
	 */
	grab (seat, serial) {
		this.display.marshall(this.id, 1, [object(seat), uint(serial)])
	}

/**
	 *@param {Display}display
	 *@param {number}id
	 */
	constructor (display, id) {
		super(display, id)
		/**
		 * @type {XdgPopupEvents|null}
		 */
		this.listener = null
	}

	async [0] (message) {
		await this.listener.configure(i(message), i(message), i(message), i(message))
	}

	async [1] (message) {
		await this.listener.popupDone()
	}

}
XdgPopupProxy.protocolName = 'xdg_popup'

XdgPopupProxy.Error = {
  /**
   * tried to grab after being mapped
   */
  invalidGrab: 0
}

/* harmony default export */ __webpack_exports__["default"] = (XdgPopupProxy);


/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/XdgPositionerProxy.js":
/*!**********************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/XdgPositionerProxy.js ***!
  \**********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Proxy */ "../../westfield/client/runtime/src/protocol/Proxy.js");
/*
 *
 *    Copyright © 2008-2013 Kristian Høgsberg
 *    Copyright © 2013      Rafael Antognolli
 *    Copyright © 2013      Jasper St. Pierre
 *    Copyright © 2010-2013 Intel Corporation
 *    Copyright © 2015-2017 Samsung Electronics Co., Ltd
 *    Copyright © 2015-2017 Red Hat Inc.
 *
 *    Permission is hereby granted, free of charge, to any person obtaining a
 *    copy of this software and associated documentation files (the "Software"),
 *    to deal in the Software without restriction, including without limitation
 *    the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *    and/or sell copies of the Software, and to permit persons to whom the
 *    Software is furnished to do so, subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the next
 *    paragraph) shall be included in all copies or substantial portions of the
 *    Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 *    THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *    DEALINGS IN THE SOFTWARE.
 *  
 */


const { uint, uintOptional, int, intOptional, fixed, 
	fixedOptional, object, objectOptional, newObject, string, 
	stringOptional, array, arrayOptional, 
	fileDescriptorOptional, fileDescriptor, 
h, u, i, f, o, n, s, a } = westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["Connection"]


/**
 *
 *      The xdg_positioner provides a collection of rules for the placement of a
 *      child surface relative to a parent surface. Rules can be defined to ensure
 *      the child surface remains within the visible area's borders, and to
 *      specify how the child surface changes its position, such as sliding along
 *      an axis, or flipping around a rectangle. These positioner-created rules are
 *      constrained by the requirement that a child surface must intersect with or
 *      be at least partially adjacent to its parent surface.
 *
 *      See the various requests for details about possible rules.
 *
 *      At the time of the request, the compositor makes a copy of the rules
 *      specified by the xdg_positioner. Thus, after the request is complete the
 *      xdg_positioner object can be destroyed or reused; further changes to the
 *      object will have no effect on previous usages.
 *
 *      For an xdg_positioner object to be considered complete, it must have a
 *      non-zero size set by set_size, and a non-zero anchor rectangle set by
 *      set_anchor_rect. Passing an incomplete xdg_positioner object when
 *      positioning a surface raises an error.
 *    
 */
class XdgPositionerProxy extends _Proxy__WEBPACK_IMPORTED_MODULE_1__["default"] {

	/**
	 *
	 *	Notify the compositor that the xdg_positioner will no longer be used.
	 *      
	 * @since 1
	 *
	 */
	destroy () {
		this.display.marshall(this.id, 0, [])
	}

	/**
	 *
	 *	Set the size of the surface that is to be positioned with the positioner
	 *	object. The size is in surface-local coordinates and corresponds to the
	 *	window geometry. See xdg_surface.set_window_geometry.
	 *
	 *	If a zero or negative size is set the invalid_input error is raised.
	 *      
	 *
	 * @param {number} width width of positioned rectangle 
	 * @param {number} height height of positioned rectangle 
	 *
	 * @since 1
	 *
	 */
	setSize (width, height) {
		this.display.marshall(this.id, 1, [int(width), int(height)])
	}

	/**
	 *
	 *	Specify the anchor rectangle within the parent surface that the child
	 *	surface will be placed relative to. The rectangle is relative to the
	 *	window geometry as defined by xdg_surface.set_window_geometry of the
	 *	parent surface.
	 *
	 *	When the xdg_positioner object is used to position a child surface, the
	 *	anchor rectangle may not extend outside the window geometry of the
	 *	positioned child's parent surface.
	 *
	 *	If a negative size is set the invalid_input error is raised.
	 *      
	 *
	 * @param {number} x x position of anchor rectangle 
	 * @param {number} y y position of anchor rectangle 
	 * @param {number} width width of anchor rectangle 
	 * @param {number} height height of anchor rectangle 
	 *
	 * @since 1
	 *
	 */
	setAnchorRect (x, y, width, height) {
		this.display.marshall(this.id, 2, [int(x), int(y), int(width), int(height)])
	}

	/**
	 *
	 *	Defines the anchor point for the anchor rectangle. The specified anchor
	 *	is used derive an anchor point that the child surface will be
	 *	positioned relative to. If a corner anchor is set (e.g. 'top_left' or
	 *	'bottom_right'), the anchor point will be at the specified corner;
	 *	otherwise, the derived anchor point will be centered on the specified
	 *	edge, or in the center of the anchor rectangle if no edge is specified.
	 *      
	 *
	 * @param {number} anchor anchor 
	 *
	 * @since 1
	 *
	 */
	setAnchor (anchor) {
		this.display.marshall(this.id, 3, [uint(anchor)])
	}

	/**
	 *
	 *	Defines in what direction a surface should be positioned, relative to
	 *	the anchor point of the parent surface. If a corner gravity is
	 *	specified (e.g. 'bottom_right' or 'top_left'), then the child surface
	 *	will be placed towards the specified gravity; otherwise, the child
	 *	surface will be centered over the anchor point on any axis that had no
	 *	gravity specified.
	 *      
	 *
	 * @param {number} gravity gravity direction 
	 *
	 * @since 1
	 *
	 */
	setGravity (gravity) {
		this.display.marshall(this.id, 4, [uint(gravity)])
	}

	/**
	 *
	 *	Specify how the window should be positioned if the originally intended
	 *	position caused the surface to be constrained, meaning at least
	 *	partially outside positioning boundaries set by the compositor. The
	 *	adjustment is set by constructing a bitmask describing the adjustment to
	 *	be made when the surface is constrained on that axis.
	 *
	 *	If no bit for one axis is set, the compositor will assume that the child
	 *	surface should not change its position on that axis when constrained.
	 *
	 *	If more than one bit for one axis is set, the order of how adjustments
	 *	are applied is specified in the corresponding adjustment descriptions.
	 *
	 *	The default adjustment is none.
	 *      
	 *
	 * @param {number} constraintAdjustment bit mask of constraint adjustments 
	 *
	 * @since 1
	 *
	 */
	setConstraintAdjustment (constraintAdjustment) {
		this.display.marshall(this.id, 5, [uint(constraintAdjustment)])
	}

	/**
	 *
	 *	Specify the surface position offset relative to the position of the
	 *	anchor on the anchor rectangle and the anchor on the surface. For
	 *	example if the anchor of the anchor rectangle is at (x, y), the surface
	 *	has the gravity bottom|right, and the offset is (ox, oy), the calculated
	 *	surface position will be (x + ox, y + oy). The offset position of the
	 *	surface is the one used for constraint testing. See
	 *	set_constraint_adjustment.
	 *
	 *	An example use case is placing a popup menu on top of a user interface
	 *	element, while aligning the user interface element of the parent surface
	 *	with some user interface element placed somewhere in the popup surface.
	 *      
	 *
	 * @param {number} x surface position x offset 
	 * @param {number} y surface position y offset 
	 *
	 * @since 1
	 *
	 */
	setOffset (x, y) {
		this.display.marshall(this.id, 6, [int(x), int(y)])
	}

/**
	 *@param {Display}display
	 *@param {number}id
	 */
	constructor (display, id) {
		super(display, id)
		/**
		 * @type {XdgPositionerEvents|null}
		 */
		this.listener = null
	}

}
XdgPositionerProxy.protocolName = 'xdg_positioner'

XdgPositionerProxy.Error = {
  /**
   * invalid input provided
   */
  invalidInput: 0
}

XdgPositionerProxy.Anchor = {
  /**
   * 
   */
  none: 0,
  /**
   * 
   */
  top: 1,
  /**
   * 
   */
  bottom: 2,
  /**
   * 
   */
  left: 3,
  /**
   * 
   */
  right: 4,
  /**
   * 
   */
  topLeft: 5,
  /**
   * 
   */
  bottomLeft: 6,
  /**
   * 
   */
  topRight: 7,
  /**
   * 
   */
  bottomRight: 8
}

XdgPositionerProxy.Gravity = {
  /**
   * 
   */
  none: 0,
  /**
   * 
   */
  top: 1,
  /**
   * 
   */
  bottom: 2,
  /**
   * 
   */
  left: 3,
  /**
   * 
   */
  right: 4,
  /**
   * 
   */
  topLeft: 5,
  /**
   * 
   */
  bottomLeft: 6,
  /**
   * 
   */
  topRight: 7,
  /**
   * 
   */
  bottomRight: 8
}

XdgPositionerProxy.ConstraintAdjustment = {
  /**
   * 
   */
  none: 0,
  /**
   * 
   */
  slideX: 1,
  /**
   * 
   */
  slideY: 2,
  /**
   * 
   */
  flipX: 4,
  /**
   * 
   */
  flipY: 8,
  /**
   * 
   */
  resizeX: 16,
  /**
   * 
   */
  resizeY: 32
}

/* harmony default export */ __webpack_exports__["default"] = (XdgPositionerProxy);


/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/XdgSurfaceEvents.js":
/*!********************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/XdgSurfaceEvents.js ***!
  \********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return XdgSurfaceEvents; });
/*
 *
 *    Copyright © 2008-2013 Kristian Høgsberg
 *    Copyright © 2013      Rafael Antognolli
 *    Copyright © 2013      Jasper St. Pierre
 *    Copyright © 2010-2013 Intel Corporation
 *    Copyright © 2015-2017 Samsung Electronics Co., Ltd
 *    Copyright © 2015-2017 Red Hat Inc.
 *
 *    Permission is hereby granted, free of charge, to any person obtaining a
 *    copy of this software and associated documentation files (the "Software"),
 *    to deal in the Software without restriction, including without limitation
 *    the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *    and/or sell copies of the Software, and to permit persons to whom the
 *    Software is furnished to do so, subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the next
 *    paragraph) shall be included in all copies or substantial portions of the
 *    Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 *    THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *    DEALINGS IN THE SOFTWARE.
 *  
 */

/**
 * @interface
 */
class XdgSurfaceEvents {

	/**
	 *
	 *	The configure event marks the end of a configure sequence. A configure
	 *	sequence is a set of one or more events configuring the state of the
	 *	xdg_surface, including the final xdg_surface.configure event.
	 *
	 *	Where applicable, xdg_surface surface roles will during a configure
	 *	sequence extend this event as a latched state sent as events before the
	 *	xdg_surface.configure event. Such events should be considered to make up
	 *	a set of atomically applied configuration states, where the
	 *	xdg_surface.configure commits the accumulated state.
	 *
	 *	Clients should arrange their surface for the new states, and then send
	 *	an ack_configure request with the serial sent in this configure event at
	 *	some point before committing the new surface.
	 *
	 *	If the client receives multiple configure events before it can respond
	 *	to one, it is free to discard all but the last event it received.
	 *      
	 *
	 * @param {number} serial serial of the configure event 
	 *
	 * @since 1
	 *
	 */
	configure(serial) {}
}



/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/XdgSurfaceProxy.js":
/*!*******************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/XdgSurfaceProxy.js ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Proxy */ "../../westfield/client/runtime/src/protocol/Proxy.js");
/* harmony import */ var _XdgToplevelProxy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./XdgToplevelProxy */ "../../westfield/client/runtime/src/protocol/XdgToplevelProxy.js");
/* harmony import */ var _XdgPopupProxy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./XdgPopupProxy */ "../../westfield/client/runtime/src/protocol/XdgPopupProxy.js");
/*
 *
 *    Copyright © 2008-2013 Kristian Høgsberg
 *    Copyright © 2013      Rafael Antognolli
 *    Copyright © 2013      Jasper St. Pierre
 *    Copyright © 2010-2013 Intel Corporation
 *    Copyright © 2015-2017 Samsung Electronics Co., Ltd
 *    Copyright © 2015-2017 Red Hat Inc.
 *
 *    Permission is hereby granted, free of charge, to any person obtaining a
 *    copy of this software and associated documentation files (the "Software"),
 *    to deal in the Software without restriction, including without limitation
 *    the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *    and/or sell copies of the Software, and to permit persons to whom the
 *    Software is furnished to do so, subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the next
 *    paragraph) shall be included in all copies or substantial portions of the
 *    Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 *    THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *    DEALINGS IN THE SOFTWARE.
 *  
 */


const { uint, uintOptional, int, intOptional, fixed, 
	fixedOptional, object, objectOptional, newObject, string, 
	stringOptional, array, arrayOptional, 
	fileDescriptorOptional, fileDescriptor, 
h, u, i, f, o, n, s, a } = westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["Connection"]




/**
 *
 *      An interface that may be implemented by a wl_surface, for
 *      implementations that provide a desktop-style user interface.
 *
 *      It provides a base set of functionality required to construct user
 *      interface elements requiring management by the compositor, such as
 *      toplevel windows, menus, etc. The types of functionality are split into
 *      xdg_surface roles.
 *
 *      Creating an xdg_surface does not set the role for a wl_surface. In order
 *      to map an xdg_surface, the client must create a role-specific object
 *      using, e.g., get_toplevel, get_popup. The wl_surface for any given
 *      xdg_surface can have at most one role, and may not be assigned any role
 *      not based on xdg_surface.
 *
 *      A role must be assigned before any other requests are made to the
 *      xdg_surface object.
 *
 *      The client must call wl_surface.commit on the corresponding wl_surface
 *      for the xdg_surface state to take effect.
 *
 *      Creating an xdg_surface from a wl_surface which has a buffer attached or
 *      committed is a client error, and any attempts by a client to attach or
 *      manipulate a buffer prior to the first xdg_surface.configure call must
 *      also be treated as errors.
 *
 *      Mapping an xdg_surface-based role surface is defined as making it
 *      possible for the surface to be shown by the compositor. Note that
 *      a mapped surface is not guaranteed to be visible once it is mapped.
 *
 *      For an xdg_surface to be mapped by the compositor, the following
 *      conditions must be met:
 *      (1) the client has assigned an xdg_surface-based role to the surface
 *      (2) the client has set and committed the xdg_surface state and the
 *	  role-dependent state to the surface
 *      (3) the client has committed a buffer to the surface
 *
 *      A newly-unmapped surface is considered to have met condition (1) out
 *      of the 3 required conditions for mapping a surface if its role surface
 *      has not been destroyed.
 *    
 */
class XdgSurfaceProxy extends _Proxy__WEBPACK_IMPORTED_MODULE_1__["default"] {

	/**
	 *
	 *	Destroy the xdg_surface object. An xdg_surface must only be destroyed
	 *	after its role object has been destroyed.
	 *      
	 * @since 1
	 *
	 */
	destroy () {
		this.display.marshall(this.id, 0, [])
	}

	/**
	 *
	 *	This creates an xdg_toplevel object for the given xdg_surface and gives
	 *	the associated wl_surface the xdg_toplevel role.
	 *
	 *	See the documentation of xdg_toplevel for more details about what an
	 *	xdg_toplevel is and how it is used.
	 *      
	 *
	 * @return {XdgToplevelProxy}  
	 *
	 * @since 1
	 *
	 */
	getToplevel () {
		return this.display.marshallConstructor(this.id, 1, _XdgToplevelProxy__WEBPACK_IMPORTED_MODULE_2__["default"], [newObject()])
	}

	/**
	 *
	 *	This creates an xdg_popup object for the given xdg_surface and gives
	 *	the associated wl_surface the xdg_popup role.
	 *
	 *	If null is passed as a parent, a parent surface must be specified using
	 *	some other protocol, before committing the initial state.
	 *
	 *	See the documentation of xdg_popup for more details about what an
	 *	xdg_popup is and how it is used.
	 *      
	 *
	 * @param {?*} parent  
	 * @param {*} positioner  
	 * @return {XdgPopupProxy}  
	 *
	 * @since 1
	 *
	 */
	getPopup (parent, positioner) {
		return this.display.marshallConstructor(this.id, 2, _XdgPopupProxy__WEBPACK_IMPORTED_MODULE_3__["default"], [newObject(), objectOptional(parent), object(positioner)])
	}

	/**
	 *
	 *	The window geometry of a surface is its "visible bounds" from the
	 *	user's perspective. Client-side decorations often have invisible
	 *	portions like drop-shadows which should be ignored for the
	 *	purposes of aligning, placing and constraining windows.
	 *
	 *	The window geometry is double buffered, and will be applied at the
	 *	time wl_surface.commit of the corresponding wl_surface is called.
	 *
	 *	When maintaining a position, the compositor should treat the (x, y)
	 *	coordinate of the window geometry as the top left corner of the window.
	 *	A client changing the (x, y) window geometry coordinate should in
	 *	general not alter the position of the window.
	 *
	 *	Once the window geometry of the surface is set, it is not possible to
	 *	unset it, and it will remain the same until set_window_geometry is
	 *	called again, even if a new subsurface or buffer is attached.
	 *
	 *	If never set, the value is the full bounds of the surface,
	 *	including any subsurfaces. This updates dynamically on every
	 *	commit. This unset is meant for extremely simple clients.
	 *
	 *	The arguments are given in the surface-local coordinate space of
	 *	the wl_surface associated with this xdg_surface.
	 *
	 *	The width and height must be greater than zero. Setting an invalid size
	 *	will raise an error. When applied, the effective window geometry will be
	 *	the set window geometry clamped to the bounding rectangle of the
	 *	combined geometry of the surface of the xdg_surface and the associated
	 *	subsurfaces.
	 *      
	 *
	 * @param {number} x  
	 * @param {number} y  
	 * @param {number} width  
	 * @param {number} height  
	 *
	 * @since 1
	 *
	 */
	setWindowGeometry (x, y, width, height) {
		this.display.marshall(this.id, 3, [int(x), int(y), int(width), int(height)])
	}

	/**
	 *
	 *	When a configure event is received, if a client commits the
	 *	surface in response to the configure event, then the client
	 *	must make an ack_configure request sometime before the commit
	 *	request, passing along the serial of the configure event.
	 *
	 *	For instance, for toplevel surfaces the compositor might use this
	 *	information to move a surface to the top left only when the client has
	 *	drawn itself for the maximized or fullscreen state.
	 *
	 *	If the client receives multiple configure events before it
	 *	can respond to one, it only has to ack the last configure event.
	 *
	 *	A client is not required to commit immediately after sending
	 *	an ack_configure request - it may even ack_configure several times
	 *	before its next surface commit.
	 *
	 *	A client may send multiple ack_configure requests before committing, but
	 *	only the last request sent before a commit indicates which configure
	 *	event the client really is responding to.
	 *      
	 *
	 * @param {number} serial the serial from the configure event 
	 *
	 * @since 1
	 *
	 */
	ackConfigure (serial) {
		this.display.marshall(this.id, 4, [uint(serial)])
	}

/**
	 *@param {Display}display
	 *@param {number}id
	 */
	constructor (display, id) {
		super(display, id)
		/**
		 * @type {XdgSurfaceEvents|null}
		 */
		this.listener = null
	}

	async [0] (message) {
		await this.listener.configure(u(message))
	}

}
XdgSurfaceProxy.protocolName = 'xdg_surface'

XdgSurfaceProxy.Error = {
  /**
   * 
   */
  notConstructed: 1,
  /**
   * 
   */
  alreadyConstructed: 2,
  /**
   * 
   */
  unconfiguredBuffer: 3
}

/* harmony default export */ __webpack_exports__["default"] = (XdgSurfaceProxy);


/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/XdgToplevelEvents.js":
/*!*********************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/XdgToplevelEvents.js ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return XdgToplevelEvents; });
/*
 *
 *    Copyright © 2008-2013 Kristian Høgsberg
 *    Copyright © 2013      Rafael Antognolli
 *    Copyright © 2013      Jasper St. Pierre
 *    Copyright © 2010-2013 Intel Corporation
 *    Copyright © 2015-2017 Samsung Electronics Co., Ltd
 *    Copyright © 2015-2017 Red Hat Inc.
 *
 *    Permission is hereby granted, free of charge, to any person obtaining a
 *    copy of this software and associated documentation files (the "Software"),
 *    to deal in the Software without restriction, including without limitation
 *    the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *    and/or sell copies of the Software, and to permit persons to whom the
 *    Software is furnished to do so, subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the next
 *    paragraph) shall be included in all copies or substantial portions of the
 *    Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 *    THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *    DEALINGS IN THE SOFTWARE.
 *  
 */

/**
 * @interface
 */
class XdgToplevelEvents {

	/**
	 *
	 *	This configure event asks the client to resize its toplevel surface or
	 *	to change its state. The configured state should not be applied
	 *	immediately. See xdg_surface.configure for details.
	 *
	 *	The width and height arguments specify a hint to the window
	 *	about how its surface should be resized in window geometry
	 *	coordinates. See set_window_geometry.
	 *
	 *	If the width or height arguments are zero, it means the client
	 *	should decide its own window dimension. This may happen when the
	 *	compositor needs to configure the state of the surface but doesn't
	 *	have any information about any previous or expected dimension.
	 *
	 *	The states listed in the event specify how the width/height
	 *	arguments should be interpreted, and possibly how it should be
	 *	drawn.
	 *
	 *	Clients must send an ack_configure in response to this event. See
	 *	xdg_surface.configure and xdg_surface.ack_configure for details.
	 *      
	 *
	 * @param {number} width  
	 * @param {number} height  
	 * @param {ArrayBuffer} states  
	 *
	 * @since 1
	 *
	 */
	configure(width, height, states) {}

	/**
	 *
	 *	The close event is sent by the compositor when the user
	 *	wants the surface to be closed. This should be equivalent to
	 *	the user clicking the close button in client-side decorations,
	 *	if your application has any.
	 *
	 *	This is only a request that the user intends to close the
	 *	window. The client may choose to ignore this request, or show
	 *	a dialog to ask the user to save their data, etc.
	 *      
	 *
	 *
	 * @since 1
	 *
	 */
	close() {}
}



/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/XdgToplevelProxy.js":
/*!********************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/XdgToplevelProxy.js ***!
  \********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Proxy */ "../../westfield/client/runtime/src/protocol/Proxy.js");
/*
 *
 *    Copyright © 2008-2013 Kristian Høgsberg
 *    Copyright © 2013      Rafael Antognolli
 *    Copyright © 2013      Jasper St. Pierre
 *    Copyright © 2010-2013 Intel Corporation
 *    Copyright © 2015-2017 Samsung Electronics Co., Ltd
 *    Copyright © 2015-2017 Red Hat Inc.
 *
 *    Permission is hereby granted, free of charge, to any person obtaining a
 *    copy of this software and associated documentation files (the "Software"),
 *    to deal in the Software without restriction, including without limitation
 *    the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *    and/or sell copies of the Software, and to permit persons to whom the
 *    Software is furnished to do so, subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the next
 *    paragraph) shall be included in all copies or substantial portions of the
 *    Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 *    THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *    DEALINGS IN THE SOFTWARE.
 *  
 */


const { uint, uintOptional, int, intOptional, fixed, 
	fixedOptional, object, objectOptional, newObject, string, 
	stringOptional, array, arrayOptional, 
	fileDescriptorOptional, fileDescriptor, 
h, u, i, f, o, n, s, a } = westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["Connection"]


/**
 *
 *      This interface defines an xdg_surface role which allows a surface to,
 *      among other things, set window-like properties such as maximize,
 *      fullscreen, and minimize, set application-specific metadata like title and
 *      id, and well as trigger user interactive operations such as interactive
 *      resize and move.
 *
 *      Unmapping an xdg_toplevel means that the surface cannot be shown
 *      by the compositor until it is explicitly mapped again.
 *      All active operations (e.g., move, resize) are canceled and all
 *      attributes (e.g. title, state, stacking, ...) are discarded for
 *      an xdg_toplevel surface when it is unmapped.
 *
 *      Attaching a null buffer to a toplevel unmaps the surface.
 *    
 */
class XdgToplevelProxy extends _Proxy__WEBPACK_IMPORTED_MODULE_1__["default"] {

	/**
	 *
	 *	This request destroys the role surface and unmaps the surface;
	 *	see "Unmapping" behavior in interface section for details.
	 *      
	 * @since 1
	 *
	 */
	destroy () {
		this.display.marshall(this.id, 0, [])
	}

	/**
	 *
	 *	Set the "parent" of this surface. This surface should be stacked
	 *	above the parent surface and all other ancestor surfaces.
	 *
	 *	Parent windows should be set on dialogs, toolboxes, or other
	 *	"auxiliary" surfaces, so that the parent is raised when the dialog
	 *	is raised.
	 *
	 *	Setting a null parent for a child window removes any parent-child
	 *	relationship for the child. Setting a null parent for a window which
	 *	currently has no parent is a no-op.
	 *
	 *	If the parent is unmapped then its children are managed as
	 *	though the parent of the now-unmapped parent has become the
	 *	parent of this surface. If no parent exists for the now-unmapped
	 *	parent then the children are managed as though they have no
	 *	parent surface.
	 *      
	 *
	 * @param {?*} parent  
	 *
	 * @since 1
	 *
	 */
	setParent (parent) {
		this.display.marshall(this.id, 1, [objectOptional(parent)])
	}

	/**
	 *
	 *	Set a short title for the surface.
	 *
	 *	This string may be used to identify the surface in a task bar,
	 *	window list, or other user interface elements provided by the
	 *	compositor.
	 *
	 *	The string must be encoded in UTF-8.
	 *      
	 *
	 * @param {string} title  
	 *
	 * @since 1
	 *
	 */
	setTitle (title) {
		this.display.marshall(this.id, 2, [string(title)])
	}

	/**
	 *
	 *	Set an application identifier for the surface.
	 *
	 *	The app ID identifies the general class of applications to which
	 *	the surface belongs. The compositor can use this to group multiple
	 *	surfaces together, or to determine how to launch a new application.
	 *
	 *	For D-Bus activatable applications, the app ID is used as the D-Bus
	 *	service name.
	 *
	 *	The compositor shell will try to group application surfaces together
	 *	by their app ID. As a best practice, it is suggested to select app
	 *	ID's that match the basename of the application's .desktop file.
	 *	For example, "org.freedesktop.FooViewer" where the .desktop file is
	 *	"org.freedesktop.FooViewer.desktop".
	 *
	 *	See the desktop-entry specification [0] for more details on
	 *	application identifiers and how they relate to well-known D-Bus
	 *	names and .desktop files.
	 *
	 *	[0] http://standards.freedesktop.org/desktop-entry-spec/
	 *      
	 *
	 * @param {string} appId  
	 *
	 * @since 1
	 *
	 */
	setAppId (appId) {
		this.display.marshall(this.id, 3, [string(appId)])
	}

	/**
	 *
	 *	Clients implementing client-side decorations might want to show
	 *	a context menu when right-clicking on the decorations, giving the
	 *	user a menu that they can use to maximize or minimize the window.
	 *
	 *	This request asks the compositor to pop up such a window menu at
	 *	the given position, relative to the local surface coordinates of
	 *	the parent surface. There are no guarantees as to what menu items
	 *	the window menu contains.
	 *
	 *	This request must be used in response to some sort of user action
	 *	like a button press, key press, or touch down event.
	 *      
	 *
	 * @param {*} seat the wl_seat of the user event 
	 * @param {number} serial the serial of the user event 
	 * @param {number} x the x position to pop up the window menu at 
	 * @param {number} y the y position to pop up the window menu at 
	 *
	 * @since 1
	 *
	 */
	showWindowMenu (seat, serial, x, y) {
		this.display.marshall(this.id, 4, [object(seat), uint(serial), int(x), int(y)])
	}

	/**
	 *
	 *	Start an interactive, user-driven move of the surface.
	 *
	 *	This request must be used in response to some sort of user action
	 *	like a button press, key press, or touch down event. The passed
	 *	serial is used to determine the type of interactive move (touch,
	 *	pointer, etc).
	 *
	 *	The server may ignore move requests depending on the state of
	 *	the surface (e.g. fullscreen or maximized), or if the passed serial
	 *	is no longer valid.
	 *
	 *	If triggered, the surface will lose the focus of the device
	 *	(wl_pointer, wl_touch, etc) used for the move. It is up to the
	 *	compositor to visually indicate that the move is taking place, such as
	 *	updating a pointer cursor, during the move. There is no guarantee
	 *	that the device focus will return when the move is completed.
	 *      
	 *
	 * @param {*} seat the wl_seat of the user event 
	 * @param {number} serial the serial of the user event 
	 *
	 * @since 1
	 *
	 */
	move (seat, serial) {
		this.display.marshall(this.id, 5, [object(seat), uint(serial)])
	}

	/**
	 *
	 *	Start a user-driven, interactive resize of the surface.
	 *
	 *	This request must be used in response to some sort of user action
	 *	like a button press, key press, or touch down event. The passed
	 *	serial is used to determine the type of interactive resize (touch,
	 *	pointer, etc).
	 *
	 *	The server may ignore resize requests depending on the state of
	 *	the surface (e.g. fullscreen or maximized).
	 *
	 *	If triggered, the client will receive configure events with the
	 *	"resize" state enum value and the expected sizes. See the "resize"
	 *	enum value for more details about what is required. The client
	 *	must also acknowledge configure events using "ack_configure". After
	 *	the resize is completed, the client will receive another "configure"
	 *	event without the resize state.
	 *
	 *	If triggered, the surface also will lose the focus of the device
	 *	(wl_pointer, wl_touch, etc) used for the resize. It is up to the
	 *	compositor to visually indicate that the resize is taking place,
	 *	such as updating a pointer cursor, during the resize. There is no
	 *	guarantee that the device focus will return when the resize is
	 *	completed.
	 *
	 *	The edges parameter specifies how the surface should be resized,
	 *	and is one of the values of the resize_edge enum. The compositor
	 *	may use this information to update the surface position for
	 *	example when dragging the top left corner. The compositor may also
	 *	use this information to adapt its behavior, e.g. choose an
	 *	appropriate cursor image.
	 *      
	 *
	 * @param {*} seat the wl_seat of the user event 
	 * @param {number} serial the serial of the user event 
	 * @param {number} edges which edge or corner is being dragged 
	 *
	 * @since 1
	 *
	 */
	resize (seat, serial, edges) {
		this.display.marshall(this.id, 6, [object(seat), uint(serial), uint(edges)])
	}

	/**
	 *
	 *	Set a maximum size for the window.
	 *
	 *	The client can specify a maximum size so that the compositor does
	 *	not try to configure the window beyond this size.
	 *
	 *	The width and height arguments are in window geometry coordinates.
	 *	See xdg_surface.set_window_geometry.
	 *
	 *	Values set in this way are double-buffered. They will get applied
	 *	on the next commit.
	 *
	 *	The compositor can use this information to allow or disallow
	 *	different states like maximize or fullscreen and draw accurate
	 *	animations.
	 *
	 *	Similarly, a tiling window manager may use this information to
	 *	place and resize client windows in a more effective way.
	 *
	 *	The client should not rely on the compositor to obey the maximum
	 *	size. The compositor may decide to ignore the values set by the
	 *	client and request a larger size.
	 *
	 *	If never set, or a value of zero in the request, means that the
	 *	client has no expected maximum size in the given dimension.
	 *	As a result, a client wishing to reset the maximum size
	 *	to an unspecified state can use zero for width and height in the
	 *	request.
	 *
	 *	Requesting a maximum size to be smaller than the minimum size of
	 *	a surface is illegal and will result in a protocol error.
	 *
	 *	The width and height must be greater than or equal to zero. Using
	 *	strictly negative values for width and height will result in a
	 *	protocol error.
	 *      
	 *
	 * @param {number} width  
	 * @param {number} height  
	 *
	 * @since 1
	 *
	 */
	setMaxSize (width, height) {
		this.display.marshall(this.id, 7, [int(width), int(height)])
	}

	/**
	 *
	 *	Set a minimum size for the window.
	 *
	 *	The client can specify a minimum size so that the compositor does
	 *	not try to configure the window below this size.
	 *
	 *	The width and height arguments are in window geometry coordinates.
	 *	See xdg_surface.set_window_geometry.
	 *
	 *	Values set in this way are double-buffered. They will get applied
	 *	on the next commit.
	 *
	 *	The compositor can use this information to allow or disallow
	 *	different states like maximize or fullscreen and draw accurate
	 *	animations.
	 *
	 *	Similarly, a tiling window manager may use this information to
	 *	place and resize client windows in a more effective way.
	 *
	 *	The client should not rely on the compositor to obey the minimum
	 *	size. The compositor may decide to ignore the values set by the
	 *	client and request a smaller size.
	 *
	 *	If never set, or a value of zero in the request, means that the
	 *	client has no expected minimum size in the given dimension.
	 *	As a result, a client wishing to reset the minimum size
	 *	to an unspecified state can use zero for width and height in the
	 *	request.
	 *
	 *	Requesting a minimum size to be larger than the maximum size of
	 *	a surface is illegal and will result in a protocol error.
	 *
	 *	The width and height must be greater than or equal to zero. Using
	 *	strictly negative values for width and height will result in a
	 *	protocol error.
	 *      
	 *
	 * @param {number} width  
	 * @param {number} height  
	 *
	 * @since 1
	 *
	 */
	setMinSize (width, height) {
		this.display.marshall(this.id, 8, [int(width), int(height)])
	}

	/**
	 *
	 *	Maximize the surface.
	 *
	 *	After requesting that the surface should be maximized, the compositor
	 *	will respond by emitting a configure event with the "maximized" state
	 *	and the required window geometry. The client should then update its
	 *	content, drawing it in a maximized state, i.e. without shadow or other
	 *	decoration outside of the window geometry. The client must also
	 *	acknowledge the configure when committing the new content (see
	 *	ack_configure).
	 *
	 *	It is up to the compositor to decide how and where to maximize the
	 *	surface, for example which output and what region of the screen should
	 *	be used.
	 *
	 *	If the surface was already maximized, the compositor will still emit
	 *	a configure event with the "maximized" state.
	 *
	 *	If the surface is in a fullscreen state, this request has no direct
	 *	effect. It will alter the state the surface is returned to when
	 *	unmaximized if not overridden by the compositor.
	 *      
	 * @since 1
	 *
	 */
	setMaximized () {
		this.display.marshall(this.id, 9, [])
	}

	/**
	 *
	 *	Unmaximize the surface.
	 *
	 *	After requesting that the surface should be unmaximized, the compositor
	 *	will respond by emitting a configure event without the "maximized"
	 *	state. If available, the compositor will include the window geometry
	 *	dimensions the window had prior to being maximized in the configure
	 *	event. The client must then update its content, drawing it in a
	 *	regular state, i.e. potentially with shadow, etc. The client must also
	 *	acknowledge the configure when committing the new content (see
	 *	ack_configure).
	 *
	 *	It is up to the compositor to position the surface after it was
	 *	unmaximized; usually the position the surface had before maximizing, if
	 *	applicable.
	 *
	 *	If the surface was already not maximized, the compositor will still
	 *	emit a configure event without the "maximized" state.
	 *
	 *	If the surface is in a fullscreen state, this request has no direct
	 *	effect. It will alter the state the surface is returned to when
	 *	unmaximized if not overridden by the compositor.
	 *      
	 * @since 1
	 *
	 */
	unsetMaximized () {
		this.display.marshall(this.id, 10, [])
	}

	/**
	 *
	 *	Make the surface fullscreen.
	 *
	 *	After requesting that the surface should be fullscreened, the
	 *	compositor will respond by emitting a configure event with the
	 *	"fullscreen" state and the fullscreen window geometry. The client must
	 *	also acknowledge the configure when committing the new content (see
	 *	ack_configure).
	 *
	 *	The output passed by the request indicates the client's preference as
	 *	to which display it should be set fullscreen on. If this value is NULL,
	 *	it's up to the compositor to choose which display will be used to map
	 *	this surface.
	 *
	 *	If the surface doesn't cover the whole output, the compositor will
	 *	position the surface in the center of the output and compensate with
	 *	with border fill covering the rest of the output. The content of the
	 *	border fill is undefined, but should be assumed to be in some way that
	 *	attempts to blend into the surrounding area (e.g. solid black).
	 *
	 *	If the fullscreened surface is not opaque, the compositor must make
	 *	sure that other screen content not part of the same surface tree (made
	 *	up of subsurfaces, popups or similarly coupled surfaces) are not
	 *	visible below the fullscreened surface.
	 *      
	 *
	 * @param {?*} output  
	 *
	 * @since 1
	 *
	 */
	setFullscreen (output) {
		this.display.marshall(this.id, 11, [objectOptional(output)])
	}

	/**
	 *
	 *	Make the surface no longer fullscreen.
	 *
	 *	After requesting that the surface should be unfullscreened, the
	 *	compositor will respond by emitting a configure event without the
	 *	"fullscreen" state.
	 *
	 *	Making a surface unfullscreen sets states for the surface based on the following:
	 *	* the state(s) it may have had before becoming fullscreen
	 *	* any state(s) decided by the compositor
	 *	* any state(s) requested by the client while the surface was fullscreen
	 *
	 *	The compositor may include the previous window geometry dimensions in
	 *	the configure event, if applicable.
	 *
	 *	The client must also acknowledge the configure when committing the new
	 *	content (see ack_configure).
	 *      
	 * @since 1
	 *
	 */
	unsetFullscreen () {
		this.display.marshall(this.id, 12, [])
	}

	/**
	 *
	 *	Request that the compositor minimize your surface. There is no
	 *	way to know if the surface is currently minimized, nor is there
	 *	any way to unset minimization on this surface.
	 *
	 *	If you are looking to throttle redrawing when minimized, please
	 *	instead use the wl_surface.frame event for this, as this will
	 *	also work with live previews on windows in Alt-Tab, Expose or
	 *	similar compositor features.
	 *      
	 * @since 1
	 *
	 */
	setMinimized () {
		this.display.marshall(this.id, 13, [])
	}

/**
	 *@param {Display}display
	 *@param {number}id
	 */
	constructor (display, id) {
		super(display, id)
		/**
		 * @type {XdgToplevelEvents|null}
		 */
		this.listener = null
	}

	async [0] (message) {
		await this.listener.configure(i(message), i(message), a(message, false))
	}

	async [1] (message) {
		await this.listener.close()
	}

}
XdgToplevelProxy.protocolName = 'xdg_toplevel'

XdgToplevelProxy.ResizeEdge = {
  /**
   * 
   */
  none: 0,
  /**
   * 
   */
  top: 1,
  /**
   * 
   */
  bottom: 2,
  /**
   * 
   */
  left: 4,
  /**
   * 
   */
  topLeft: 5,
  /**
   * 
   */
  bottomLeft: 6,
  /**
   * 
   */
  right: 8,
  /**
   * 
   */
  topRight: 9,
  /**
   * 
   */
  bottomRight: 10
}

XdgToplevelProxy.State = {
  /**
   * the surface is maximized
   */
  maximized: 1,
  /**
   * the surface is fullscreen
   */
  fullscreen: 2,
  /**
   * the surface is being resized
   */
  resizing: 3,
  /**
   * the surface is now activated
   */
  activated: 4
}

/* harmony default export */ __webpack_exports__["default"] = (XdgToplevelProxy);


/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/XdgWmBaseEvents.js":
/*!*******************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/XdgWmBaseEvents.js ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return XdgWmBaseEvents; });
/*
 *
 *    Copyright © 2008-2013 Kristian Høgsberg
 *    Copyright © 2013      Rafael Antognolli
 *    Copyright © 2013      Jasper St. Pierre
 *    Copyright © 2010-2013 Intel Corporation
 *    Copyright © 2015-2017 Samsung Electronics Co., Ltd
 *    Copyright © 2015-2017 Red Hat Inc.
 *
 *    Permission is hereby granted, free of charge, to any person obtaining a
 *    copy of this software and associated documentation files (the "Software"),
 *    to deal in the Software without restriction, including without limitation
 *    the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *    and/or sell copies of the Software, and to permit persons to whom the
 *    Software is furnished to do so, subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the next
 *    paragraph) shall be included in all copies or substantial portions of the
 *    Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 *    THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *    DEALINGS IN THE SOFTWARE.
 *  
 */

/**
 * @interface
 */
class XdgWmBaseEvents {

	/**
	 *
	 *	The ping event asks the client if it's still alive. Pass the
	 *	serial specified in the event back to the compositor by sending
	 *	a "pong" request back with the specified serial. See xdg_wm_base.ping.
	 *
	 *	Compositors can use this to determine if the client is still
	 *	alive. It's unspecified what will happen if the client doesn't
	 *	respond to the ping request, or in what timeframe. Clients should
	 *	try to respond in a reasonable amount of time.
	 *
	 *	A compositor is free to ping in any way it wants, but a client must
	 *	always respond to any xdg_wm_base object it created.
	 *      
	 *
	 * @param {number} serial pass this to the pong request 
	 *
	 * @since 1
	 *
	 */
	ping(serial) {}
}



/***/ }),

/***/ "../../westfield/client/runtime/src/protocol/XdgWmBaseProxy.js":
/*!******************************************************************************!*\
  !*** /home/erik/git/westfield/client/runtime/src/protocol/XdgWmBaseProxy.js ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "../../westfield/common/index.js");
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Proxy */ "../../westfield/client/runtime/src/protocol/Proxy.js");
/* harmony import */ var _XdgPositionerProxy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./XdgPositionerProxy */ "../../westfield/client/runtime/src/protocol/XdgPositionerProxy.js");
/* harmony import */ var _XdgSurfaceProxy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./XdgSurfaceProxy */ "../../westfield/client/runtime/src/protocol/XdgSurfaceProxy.js");
/*
 *
 *    Copyright © 2008-2013 Kristian Høgsberg
 *    Copyright © 2013      Rafael Antognolli
 *    Copyright © 2013      Jasper St. Pierre
 *    Copyright © 2010-2013 Intel Corporation
 *    Copyright © 2015-2017 Samsung Electronics Co., Ltd
 *    Copyright © 2015-2017 Red Hat Inc.
 *
 *    Permission is hereby granted, free of charge, to any person obtaining a
 *    copy of this software and associated documentation files (the "Software"),
 *    to deal in the Software without restriction, including without limitation
 *    the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *    and/or sell copies of the Software, and to permit persons to whom the
 *    Software is furnished to do so, subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the next
 *    paragraph) shall be included in all copies or substantial portions of the
 *    Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 *    THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *    DEALINGS IN THE SOFTWARE.
 *  
 */


const { uint, uintOptional, int, intOptional, fixed, 
	fixedOptional, object, objectOptional, newObject, string, 
	stringOptional, array, arrayOptional, 
	fileDescriptorOptional, fileDescriptor, 
h, u, i, f, o, n, s, a } = westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["Connection"]




/**
 *
 *      The xdg_wm_base interface is exposed as a global object enabling clients
 *      to turn their wl_surfaces into windows in a desktop environment. It
 *      defines the basic functionality needed for clients and the compositor to
 *      create windows that can be dragged, resized, maximized, etc, as well as
 *      creating transient windows such as popup menus.
 *    
 */
class XdgWmBaseProxy extends _Proxy__WEBPACK_IMPORTED_MODULE_1__["default"] {

	/**
	 *
	 *	Destroy this xdg_wm_base object.
	 *
	 *	Destroying a bound xdg_wm_base object while there are surfaces
	 *	still alive created by this xdg_wm_base object instance is illegal
	 *	and will result in a protocol error.
	 *      
	 * @since 1
	 *
	 */
	destroy () {
		this.display.marshall(this.id, 0, [])
	}

	/**
	 *
	 *	Create a positioner object. A positioner object is used to position
	 *	surfaces relative to some parent surface. See the interface description
	 *	and xdg_surface.get_popup for details.
	 *      
	 *
	 * @return {XdgPositionerProxy}  
	 *
	 * @since 1
	 *
	 */
	createPositioner () {
		return this.display.marshallConstructor(this.id, 1, _XdgPositionerProxy__WEBPACK_IMPORTED_MODULE_2__["default"], [newObject()])
	}

	/**
	 *
	 *	This creates an xdg_surface for the given surface. While xdg_surface
	 *	itself is not a role, the corresponding surface may only be assigned
	 *	a role extending xdg_surface, such as xdg_toplevel or xdg_popup.
	 *
	 *	This creates an xdg_surface for the given surface. An xdg_surface is
	 *	used as basis to define a role to a given surface, such as xdg_toplevel
	 *	or xdg_popup. It also manages functionality shared between xdg_surface
	 *	based surface roles.
	 *
	 *	See the documentation of xdg_surface for more details about what an
	 *	xdg_surface is and how it is used.
	 *      
	 *
	 * @param {*} surface  
	 * @return {XdgSurfaceProxy}  
	 *
	 * @since 1
	 *
	 */
	getXdgSurface (surface) {
		return this.display.marshallConstructor(this.id, 2, _XdgSurfaceProxy__WEBPACK_IMPORTED_MODULE_3__["default"], [newObject(), object(surface)])
	}

	/**
	 *
	 *	A client must respond to a ping event with a pong request or
	 *	the client may be deemed unresponsive. See xdg_wm_base.ping.
	 *      
	 *
	 * @param {number} serial serial of the ping event 
	 *
	 * @since 1
	 *
	 */
	pong (serial) {
		this.display.marshall(this.id, 3, [uint(serial)])
	}

/**
	 *@param {Display}display
	 *@param {number}id
	 */
	constructor (display, id) {
		super(display, id)
		/**
		 * @type {XdgWmBaseEvents|null}
		 */
		this.listener = null
	}

	async [0] (message) {
		await this.listener.ping(u(message))
	}

}
XdgWmBaseProxy.protocolName = 'xdg_wm_base'

XdgWmBaseProxy.Error = {
  /**
   * given wl_surface has another role
   */
  role: 0,
  /**
   * xdg_wm_base was destroyed before children
   */
  defunctSurfaces: 1,
  /**
   * the client tried to map or destroy a non-topmost popup
   */
  notTheTopmostPopup: 2,
  /**
   * the client specified an invalid popup parent surface
   */
  invalidPopupParent: 3,
  /**
   * the client provided an invalid surface state
   */
  invalidSurfaceState: 4,
  /**
   * the client provided an invalid positioner
   */
  invalidPositioner: 5
}

/* harmony default export */ __webpack_exports__["default"] = (XdgWmBaseProxy);


/***/ }),

/***/ "../../westfield/common/index.js":
/*!************************************************!*\
  !*** /home/erik/git/westfield/common/index.js ***!
  \************************************************/
/*! exports provided: Connection, Fixed, WebFD, WlObject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_Connection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/Connection */ "../../westfield/common/src/Connection.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Connection", function() { return _src_Connection__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _src_Fixed__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/Fixed */ "../../westfield/common/src/Fixed.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Fixed", function() { return _src_Fixed__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _src_WebFD__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/WebFD */ "../../westfield/common/src/WebFD.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebFD", function() { return _src_WebFD__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _src_WlObject__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/WlObject */ "../../westfield/common/src/WlObject.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlObject", function() { return _src_WlObject__WEBPACK_IMPORTED_MODULE_3__["default"]; });








/***/ }),

/***/ "../../westfield/common/src/Connection.js":
/*!*********************************************************!*\
  !*** /home/erik/git/westfield/common/src/Connection.js ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Fixed__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Fixed */ "../../westfield/common/src/Fixed.js");
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





class Connection {
  /**
   * @param {number} arg
   * @returns {{value: number, type: 'u', size: number, optional: boolean, _marshallArg: function({buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}):void}}
   */
  static uint (arg) {
    return {
      value: arg,
      type: 'u',
      size: 4,
      optional: false,
      /**
       *
       * @param {{buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}} wireMsg
       * @private
       */
      _marshallArg: function (wireMsg) {
        new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = this.value
        wireMsg.bufferOffset += this.size
      }
    }
  }

  /**
   *
   * @param {number} arg
   * @returns {{value: number, type: 'u', size: number, optional: boolean, _marshallArg: function({buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}):void}}
   *
   */
  static uintOptional (arg) {
    return {
      value: arg,
      type: 'u',
      size: 4,
      optional: true,
      /**
       *
       * @param {{buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}} wireMsg
       * @private
       */
      _marshallArg: function (wireMsg) {
        new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = (arg === null ? 0 : this.value)
        wireMsg.bufferOffset += this.size
      }
    }
  }

  /**
   *
   * @param {WebFD} arg
   * @returns {{value: number, type: 'h', size: number, optional: boolean, _marshallArg: function({buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}):void}}
   *
   */
  static fileDescriptor (arg) {
    return {
      value: arg,
      type: 'h',
      size: 0, // file descriptors are not added to the message size because they are somewhat considered meta data.
      optional: false,
      /**
       *
       * @param {{buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}} wireMsg
       * @private
       */
      _marshallArg: function (wireMsg) {
        wireMsg.fds.push(this.value)
      }
    }
  }

  /**
   *
   * @param {number} arg
   * @returns {{value: number, type: 'h', size: number, optional: boolean, _marshallArg: function({buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}):void}}
   *
   */
  static fileDescriptorOptional (arg) {
    return {
      value: arg,
      type: 'h',
      size: 0, // file descriptors are not added to the message size because they are not part of the unix socket message buffer.
      optional: true,
      /**
       *
       * @param {{buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}} wireMsg
       * @private
       */
      _marshallArg: function (wireMsg) {
        wireMsg.fds.push(this.value)
      }
    }
  }

  /**
   *
   * @param {number} arg
   * @returns {{value: number, type: 'i', size: number, optional: boolean, _marshallArg: function({buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}):void}}
   *
   */
  static int (arg) {
    return {
      value: arg,
      type: 'i',
      size: 4,
      optional: false,
      /**
       *
       * @param {{buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}} wireMsg
       * @private
       */
      _marshallArg: function (wireMsg) {
        new Int32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = this.value
        wireMsg.bufferOffset += this.size
      }
    }
  }

  /**
   *
   * @param {number} arg
   * @returns {{value: number, type: 'i', size: number, optional: boolean, _marshallArg: function({buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}):void}}
   *
   */
  static intOptional (arg) {
    return {
      value: arg,
      type: 'i',
      size: 4,
      optional: true,
      /**
       *
       * @param {{buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}} wireMsg
       * @private
       */
      _marshallArg: function (wireMsg) {
        new Int32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = (arg === null ? 0 : this.value)
        wireMsg.bufferOffset += this.size
      }
    }
  }

  /**
   *
   * @param {Fixed} arg
   * @returns {{value: Fixed, type: 'f', size: number, optional: boolean, _marshallArg: function({buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}):void}}
   */
  static fixed (arg) {
    return {
      value: arg,
      type: 'f',
      size: 4,
      optional: false,
      /**
       *
       * @param {{buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}} wireMsg
       * @private
       */
      _marshallArg: function (wireMsg) {
        new Int32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = this.value._raw
        wireMsg.bufferOffset += this.size
      }
    }
  }

  /**
   *
   * @param {Fixed} arg
   * @returns {{value: Fixed, type: 'f', size: number, optional: boolean, _marshallArg: function({buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}):void}}
   */
  static fixedOptional (arg) {
    return {
      value: arg,
      type: 'f',
      size: 4,
      optional: true,
      /**
       *
       * @param {{buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}} wireMsg
       * @private
       */
      _marshallArg: function (wireMsg) {
        new Int32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = (arg === null ? 0 : this.value._raw)
        wireMsg.bufferOffset += this.size
      }
    }
  }

  /**
   *
   * @param {Resource} arg
   * @returns {{value: Resource, type: 'o', size: number, optional: boolean, _marshallArg: function({buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}):void}}
   *
   */
  static object (arg) {
    return {
      value: arg,
      type: 'o',
      size: 4,
      optional: false,
      /**
       *
       * @param {{buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}} wireMsg
       * @private
       */
      _marshallArg: function (wireMsg) {
        new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = this.value.id
        wireMsg.bufferOffset += this.size
      }
    }
  }

  /**
   *
   * @param {Resource} arg
   * @returns {{value: Resource, type: 'o', size: number, optional: boolean, _marshallArg: function({buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}):void}}
   *
   */
  static objectOptional (arg) {
    return {
      value: arg,
      type: 'o',
      size: 4,
      optional: true,
      /**
       *
       * @param {{buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}} wireMsg
       * @private
       */
      _marshallArg: function (wireMsg) {
        new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = (arg === null ? 0 : this.value.id)
        wireMsg.bufferOffset += this.size
      }
    }
  }

  /**
   * @returns {{value: number, type: 'n', size: number, optional: boolean, _marshallArg: function({buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}):void}}
   */
  static newObject () {
    return {
      value: 0, // id filled in by _marshallConstructor
      type: 'n',
      size: 4,
      optional: false,
      /**
       * @param {{buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}} wireMsg
       * @private
       */
      _marshallArg: function (wireMsg) {
        new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = this.value
        wireMsg.bufferOffset += this.size
      }
    }
  }

  /**
   *
   * @param {string} arg
   * @returns {{value: string, type: 's', size: number, optional: boolean, _marshallArg: function({buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}):void}}
   *
   */
  static string (arg) {
    return {
      value: `${arg}\0`,
      type: 's',
      size: 4 + (function () {
        // fancy logic to calculate size with padding to a multiple of 4 bytes (int).
        // length+1 for null terminator
        return (arg.length + 1 + 3) & ~3
      })(),
      optional: false,
      /**
       * @param {{buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}} wireMsg
       * @private
       */
      _marshallArg: function (wireMsg) {
        new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = this.value.length

        const strLen = this.value.length
        const buf8 = new Uint8Array(wireMsg.buffer, wireMsg.bufferOffset + 4, strLen)
        for (let i = 0; i < strLen; i++) {
          buf8[i] = this.value[i].codePointAt(0)
        }
        wireMsg.bufferOffset += this.size
      }
    }
  }

  /**
   *
   * @param {String} arg
   * @returns {{value: *, type: 's', size: number, optional: boolean, _marshallArg: function({buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}):void}}
   *
   */
  static stringOptional (arg) {
    return {
      value: `${arg}\0`,
      type: 's',
      size: 4 + (function () {
        if (arg === null) {
          return 0
        } else {
          // fancy logic to calculate size with padding to a multiple of 4 bytes (int).
          // length+1 for null terminator
          return (arg.length + 1 + 3) & ~3
        }
      })(),
      optional: true,
      /**
       *
       * @param {{buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}} wireMsg
       * @private
       */
      _marshallArg: function (wireMsg) {
        if (this.value === null) {
          new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = 0
        } else {
          new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = this.value.length

          const strLen = this.value.length
          const buf8 = new Uint8Array(wireMsg.buffer, wireMsg.bufferOffset + 4, strLen)
          for (let i = 0; i < strLen; i++) {
            buf8[i] = this.value[i].codePointAt(0)
          }
        }
        wireMsg.bufferOffset += this.size
      }
    }
  }

  /**
   *
   * @param {TypedArray} arg
   * @returns {{value: *, type: 'a', size: number, optional: boolean, _marshallArg: function({buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}):void}}
   *
   */
  static array (arg) {
    return {
      value: arg,
      type: 'a',
      size: 4 + (function () {
        // fancy logic to calculate size with padding to a multiple of 4 bytes (int).
        return (arg.byteLength + 3) & ~3
      })(),
      optional: false,
      /**
       *
       * @param {{buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}} wireMsg
       * @private
       */
      _marshallArg: function (wireMsg) {
        new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = this.value.byteLength

        const byteLength = this.value.byteLength
        new Uint8Array(wireMsg.buffer, wireMsg.bufferOffset + 4, byteLength).set(new Uint8Array(this.value.buffer, 0, byteLength))

        wireMsg.bufferOffset += this.size
      }
    }
  }

  /**
   *
   * @param {TypedArray} arg
   * @returns {{value: *, type: 'a', size: number, optional: boolean, _marshallArg: function({buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}):void}}
   *
   */
  static arrayOptional (arg) {
    return {
      value: arg,
      type: 'a',
      size: 4 + (function () {
        if (arg === null) {
          return 0
        } else {
          // fancy logic to calculate size with padding to a multiple of 4 bytes (int).
          return (arg.byteLength + 3) & ~3
        }
      })(),
      optional: true,
      _marshallArg: function (wireMsg) {
        if (this.value === null) {
          new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = 0
        } else {
          new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = this.value.byteLength

          const byteLength = this.value.byteLength
          new Uint8Array(wireMsg.buffer, wireMsg.bufferOffset + 4, byteLength).set(new Uint8Array(this.value.buffer, 0, byteLength))
        }
        wireMsg.bufferOffset += this.size
      }
    }
  }

  /**
   * @param {{buffer: Uint32Array, fds: Array<WebFD>, bufferOffset: number, consumed: number, size: number}} message
   * @param {number}consumption
   * @private
   */
  static _checkMessageSize (message, consumption) {
    if (message.consumed + consumption > message.size) {
      throw new Error(`Request too short.`)
    } else {
      message.consumed += consumption
    }
  }

  /**
   *
   * @param {{buffer: Uint32Array, fds: Array<WebFD>, bufferOffset: number, consumed: number, size: number}} message
   * @returns {number}
   */
  static u (message) { // unsigned integer {number}
    Connection._checkMessageSize(message, 4)
    return message.buffer[message.bufferOffset++]
  }

  /**
   *
   * @param {{buffer: Uint32Array, fds: Array<WebFD>, bufferOffset: number, consumed: number, size: number}} message
   * @returns {number}
   */
  static i (message) {
    Connection._checkMessageSize(message, 4)
    const arg = new Int32Array(message.buffer.buffer, message.buffer.byteOffset + (message.bufferOffset * Uint32Array.BYTES_PER_ELEMENT), 1)[0]
    message.bufferOffset += 1
    return arg
  }

  /**
   *
   * @param {{buffer: Uint32Array, fds: Array<WebFD>, bufferOffset: number, consumed: number, size: number}} message
   * @returns {Fixed}
   */
  static f (message) {
    Connection._checkMessageSize(message, 4)
    const arg = new Int32Array(message.buffer.buffer, message.buffer.byteOffset + (message.bufferOffset * Uint32Array.BYTES_PER_ELEMENT), 1)[0]
    message.bufferOffset += 1
    return new _Fixed__WEBPACK_IMPORTED_MODULE_0__["default"](arg >> 0)
  }

  /**
   *
   * @param {{buffer: Uint32Array, fds: Array<WebFD>, bufferOffset: number, consumed: number, size: number}} message
   * @param {Boolean} optional
   * @param {Connection}connection
   * @returns {WlObject}
   */
  static o (message, optional, connection) {
    Connection._checkMessageSize(message, 4)
    const arg = message.buffer[message.bufferOffset++]
    if (optional && arg === 0) {
      return null
    } else {
      const wlObject = connection.wlObjects[arg]
      if (wlObject) {
        return wlObject
      } else {
        throw new Error(`Unknown object id ${arg}`)
      }
    }
  }

  /**
   * @param {{buffer: Uint32Array, fds: Array<WebFD>, bufferOffset: number, consumed: number, size: number}} message
   * @returns {number}
   */
  static n (message) {
    Connection._checkMessageSize(message, 4)
    return message.buffer[message.bufferOffset++]
  }

  /**
   *
   * @param {{buffer: Uint32Array, fds: Array<WebFD>, bufferOffset: number, consumed: number, size: number}} message
   * @param {Boolean} optional
   * @returns {String}
   */
  static s (message, optional) { // {String}
    Connection._checkMessageSize(message, 4)
    const stringSize = message.buffer[message.bufferOffset++]
    if (optional && stringSize === 0) {
      return null
    } else {
      const alignedSize = ((stringSize + 3) & ~3)
      Connection._checkMessageSize(message, alignedSize)
      // size -1 to eliminate null byte
      const byteArray = new Uint8Array(message.buffer.buffer, message.buffer.byteOffset + (message.bufferOffset * Uint32Array.BYTES_PER_ELEMENT), stringSize - 1)
      message.bufferOffset += (alignedSize / 4)
      return String.fromCharCode(...byteArray)
    }
  }

  /**
   *
   * @param {{buffer: Uint32Array, fds: Array<WebFD>, bufferOffset: number, consumed: number, size: number}} message
   * @param {Boolean} optional
   * @returns {ArrayBuffer}
   */
  static a (message, optional) {
    Connection._checkMessageSize(message, 4)
    const arraySize = message.buffer[message.bufferOffset++]
    if (optional && arraySize === 0) {
      return null
    } else {
      const alignedSize = ((arraySize + 3) & ~3)
      Connection._checkMessageSize(message, alignedSize)
      const arg = message.buffer.buffer.slice(message.buffer.byteOffset + (message.bufferOffset * Uint32Array.BYTES_PER_ELEMENT), message.buffer.byteOffset + (message.bufferOffset * Uint32Array.BYTES_PER_ELEMENT) + arraySize)
      message.bufferOffset += alignedSize
      return arg
    }
  }

  /**
   *
   * @param {{buffer: Uint32Array, fds: Array<WebFD>, bufferOffset: number, consumed: number, size: number}} message
   * @returns {WebFD}
   */
  static h (message) { // file descriptor {number}
    if (message.fds.length > 0) {
      return message.fds.shift()
    } else {
      throw new Error('Not enough file descriptors in message object.')
    }
  }

  constructor () {
    /**
     * @type {Object.<number,WlObject>}
     */
    this.wlObjects = {}
    /**
     * @type {boolean}
     * @private
     */
    this.closed = false
    /**
     * @type {Array<{buffer: ArrayBuffer, fds: Array<WebFD>}>}
     * @private
     */
    this._outMessages = []
    /**
     * @type {Array<{buffer: Uint32Array, fds: Array<WebFD>}>}
     * @private
     */
    this._inMessages = []
  }

  /**
   *
   * @param {number} id
   * @param {number} opcode
   * @param {number} size
   * @param {Array<{value: *, type: string, size: number, optional: boolean, _marshallArg: function({buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}):void}>} argsArray
   */
  marshallMsg (id, opcode, size, argsArray) {
    /**
     * @type {{buffer: ArrayBuffer, fds: Array<WebFD>, bufferOffset: number}}
     */
    const wireMsg = {
      buffer: new ArrayBuffer(size),
      fds: [],
      bufferOffset: 0
    }

    // write actual wire message
    const bufu32 = new Uint32Array(wireMsg.buffer)
    const bufu16 = new Uint16Array(wireMsg.buffer)
    bufu32[0] = id
    bufu16[2] = opcode
    bufu16[3] = size
    wireMsg.bufferOffset = 8

    // write actual argument value to buffer
    argsArray.forEach((arg) => arg._marshallArg(wireMsg))
    this.onSend(wireMsg)
  }

  /**
   * Handle received wire messages.
   * @param {{buffer: Uint32Array, fds: Array<WebFD>}} incomingWireMessages
   * @return {Promise<void>}
   * @throws Error If an illegal client request is received ie. bad length or missing file descriptor.
   */
  async message (incomingWireMessages) {
    if (this.closed) { return }

    // more than one message in queue means the message loop is in await, don't concurrently process the new
    // message, instead return early and let the resume-from-await pick up the newly queued message.
    if (this._inMessages.push(incomingWireMessages) > 1) { return }

    while (this._inMessages.length) {
      const wireMessages = /** @type {{buffer: Uint32Array, fds: Array<WebFD>, bufferOffset: number, consumed: number, size: number}} */this._inMessages[0]
      wireMessages.bufferOffset = 0
      wireMessages.consumed = 0
      wireMessages.size = 0
      while (wireMessages.bufferOffset < wireMessages.buffer.length) {
        const id = wireMessages.buffer[wireMessages.bufferOffset]
        const sizeOpcode = wireMessages.buffer[wireMessages.bufferOffset + 1]
        wireMessages.size = sizeOpcode >>> 16
        const opcode = sizeOpcode & 0x0000FFFF

        if (wireMessages.size > wireMessages.buffer.byteLength) {
          throw new Error('Request buffer too small')
        }

        const resource = this.wlObjects[id]
        if (resource) {
          wireMessages.bufferOffset += 2
          wireMessages.consumed = 8
          await resource[opcode](wireMessages)
          if (this.closed) { return }
        } else {
          throw new Error(`invalid object ${id}`)
        }
      }
      this._inMessages.shift()
    }

    this.flush()
  }

  /**
   * This doesn't actually send the message, but queues it so it can be send on flush.
   * @param {{buffer: ArrayBuffer, fds: Array<WebFD>}}wireMsg a single wire message event.
   */
  onSend (wireMsg) {
    if (this.closed) { return }

    this._outMessages.push(wireMsg)
  }

  /**
   * Empty the queue of wire messages and send them to the other end.
   */
  flush () {
    if (this.closed) { return }
    if (this._outMessages.length === 0) { return }

    this.onFlush(this._outMessages)
    this._outMessages = []
  }

  /**
   * Callback when this connection wishes to send data to the other end. This callback can be used to send the given
   * array buffers using any transport mechanism.
   * @param {Array<{buffer: ArrayBuffer, fds: Array<WebFD>}>}wireMessages
   */
  onFlush (wireMessages) {}

  close () {
    if (this.closed) { return }

    // destroy resources in descending order
    Object.values(this.wlObjects).sort((a, b) => a.id - b.id).forEach((wlObject) => wlObject.destroy())

    this._outMessages = null
    this._inMessages = null
    this.closed = true
  }

  /**
   *
   * @param {WlObject} wlObject
   */
  registerWlObject (wlObject) {
    if (this.closed) { return }
    this.wlObjects[wlObject.id] = wlObject
  }

  /**
   *
   * @param {WlObject} wlObject
   */
  unregisterWlObject (wlObject) {
    if (this.closed) { return }
    delete this.wlObjects[wlObject.id]
  }
}

/* harmony default export */ __webpack_exports__["default"] = (Connection);

/***/ }),

/***/ "../../westfield/common/src/Fixed.js":
/*!****************************************************!*\
  !*** /home/erik/git/westfield/common/src/Fixed.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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



class Fixed {
  /**
   * @param {number}number
   * @return {Fixed}
   */
  static parse (number) {
    return new Fixed((number * 256.0) >> 0)
  }

  /**
   * Represent fixed as a signed 24-bit integer.
   *
   * @returns {number}
   */
  asInt () {
    return ((this._raw / 256.0) >> 0)
  }

  /**
   * Represent fixed as a signed 24-bit number with an 8-bit fractional part.
   *
   * @returns {number}
   */
  asDouble () {
    return this._raw / 256.0
  }

  /**
   * use parseFixed instead
   * @param {number}raw
   */
  constructor (raw) {
    this._raw = raw
  }
}

/* harmony default export */ __webpack_exports__["default"] = (Fixed);

/***/ }),

/***/ "../../westfield/common/src/WebFD.js":
/*!****************************************************!*\
  !*** /home/erik/git/westfield/common/src/WebFD.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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



class WebFD {
  /**
   * @param {number}fd
   * @param {'ImageBitmap'|'ArrayBuffer'|'MessagePort'}fdType
   * @param {string}fdDomainUUID
   * @param {function(WebFD): Promise<Transferable>}onGetTransferable
   * @param {function(WebFD): Promise<void>} onClose
   */
  constructor (fd, fdType, fdDomainUUID, onGetTransferable, onClose) {
    /**
     * @type {number}
     */
    this.fd = fd
    /**
     * @type {string}
     */
    this.fdType = fdType
    /**
     * @type {string}
     */
    this.fdDomainUUID = fdDomainUUID
    /**
     * @type {function(WebFD): Promise<Transferable>}
     * @private
     */
    this._onGetTransferable = onGetTransferable
    /**
     * @type {function(WebFD): Promise<void>}
     * @private
     */
    this._onClose = onClose
  }

  /**
   * @return {Promise<Transferable>}
   */
  async getTransferable () {
    return await this._onGetTransferable(this)
  }

  /**
   * @return {Promise<void>}
   */
  async close () {
    await this._onClose(this)
  }
}

/* harmony default export */ __webpack_exports__["default"] = (WebFD);

/***/ }),

/***/ "../../westfield/common/src/WlObject.js":
/*!*******************************************************!*\
  !*** /home/erik/git/westfield/common/src/WlObject.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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



class WlObject {
  constructor (id) {
    this.id = id
    /**
     * @type {Promise<void>}
     * @private
     */
    this._destroyPromise = new Promise((resolve) => {
      this._destroyResolver = resolve
    })
    /**
     * @type {Array<function(Resource):void>}
     * @private
     */
    this._destroyListeners = []
    this._destroyPromise.then(() => this._destroyListeners.forEach((destroyListener) => destroyListener(this)))
  }

  destroy () {
    this._destroyResolver()
  }

  /**
   * @param {function(Resource):void}destroyListener
   */
  addDestroyListener (destroyListener) {
    this._destroyListeners.push(destroyListener)
  }

  /**
   * @param {function(Resource):void}destroyListener
   */
  removeDestroyListener (destroyListener) {
    this._destroyListeners = this._destroyListeners.filter((item) => { return item !== destroyListener })
  }

  /**
   * @return {Promise<void>}
   */
  onDestroy () {
    return this._destroyPromise
  }
}

/* harmony default export */ __webpack_exports__["default"] = (WlObject);

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var westfield_runtime_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-client */ "../../westfield/client/runtime/index.js");


/**
 * @implements WebArrayBufferEvents
 */
class WebArrayBuffer {
  /**
   * @param {WebShmProxy}webShm
   * @param {number}width
   * @param {number}height
   * @return {WebArrayBuffer}
   */
  static create (webShm, width, height) {
    const arrayBuffer = new ArrayBuffer(height * width * Uint32Array.BYTES_PER_ELEMENT)
    const shmBufferWebFD = westfield_runtime_client__WEBPACK_IMPORTED_MODULE_0__["webFS"].fromArrayBuffer(arrayBuffer)

    return new WebArrayBuffer(webShm, shmBufferWebFD, arrayBuffer, width, height)
  }

  /**
   * @param {WebShmProxy}webShm
   * @param {WebFD}shmBufferWebFD
   * @param {ArrayBuffer}arrayBuffer
   * @param {number}width
   * @param {number}height
   */
  constructor (webShm, shmBufferWebFD, arrayBuffer, width, height) {
    /**
     * @type {WebShmProxy}
     * @private
     */
    this._webShm = webShm
    /**
     * @type {WebArrayBufferProxy|null}
     */
    this.proxy = null
    /**
     * @type {WlBufferProxy|null}
     */
    this.bufferProxy = null
    /**
     * @type {WebFD}
     * @private
     */
    this._shmBufferWebFD = shmBufferWebFD
    /**
     * @type {ArrayBuffer}
     */
    this.arrayBuffer = arrayBuffer
    /**
     * @type {number}
     */
    this.width = width
    /**
     * @type {number}
     */
    this.height = height
  }

  seal () {
    if (this.proxy) {
      this.proxy.attach(this._shmBufferWebFD)
    } else {
      this.proxy = this._webShm.createWebArrayBuffer(this._shmBufferWebFD, this.width, this.height, this.stride, this.format)
      this.bufferProxy = this._webShm.createBuffer(this.proxy)
    }
  }

  /**
   *
   *                Detaches the associated HTML5 array buffer from the compositor and returns it to the client.
   *                No action is expected for this event. It merely functions as a HTML5 array buffer ownership
   *                transfer from main thread to web-worker.
   *
   *
   * @param {WebFD} arrayBuffer HTML5 array buffer to detach from the compositor
   *
   * @since 1
   *
   */
  detach (arrayBuffer) {}
}

/**
 * @implements WlRegistryEvents
 * @implements WebShmEvents
 * @implements WlShellSurfaceEvents
 */
class Window {
  /**
   * @return {Window}
   */
  static create (width, height) {
    const registry = westfield_runtime_client__WEBPACK_IMPORTED_MODULE_0__["display"].getRegistry()
    const window = new Window(registry)
    registry.listener = window
    return window
  }

  /**
   * @param {WlRegistryProxy}registry
   */
  constructor (registry) {
    /**
     * @type {WlRegistryProxy}
     * @protected
     */
    this._registry = registry
    /**
     * @type {WlCompositorProxy|null}
     * @private
     */
    this._compositor = null
    /**
     * @type {WebShmProxy|null}
     * @private
     */
    this._webShm = null
    /**
     * @type {WlShellProxy|null}
     * @private
     */
    this._shell = null
    /**
     * @type {WlSurfaceProxy|null}
     * @private
     */
    this._surface = null
    /**
     * @type {Array<WebArrayBuffer>}
     * @protected
     */
    this._buffers = []
    /**
     * @type {number}
     * @protected
     */
    this._nextBufferIdx = 0
    /**
     * @type {Promise<number>}
     * @private
     */
    this._syncPromise = null
  }

  /**
   *
   *  Notify the client of global objects.
   *
   *  The event notifies the client that a global object with
   *  the given name is now available, and it implements the
   *  given version of the given interface.
   *
   *
   * @param {number} name numeric name of the global object
   * @param {string} interface_ interface implemented by the object
   * @param {number} version interface version
   *
   * @since 1
   *
   */
  global (name, interface_, version) {
    if (interface_ === westfield_runtime_client__WEBPACK_IMPORTED_MODULE_0__["WlCompositorProxy"].protocolName) {
      this._compositor = this._registry.bind(name, interface_, westfield_runtime_client__WEBPACK_IMPORTED_MODULE_0__["WlCompositorProxy"], version)
      this._surface = this._compositor.createSurface()
    }

    if (interface_ === westfield_runtime_client__WEBPACK_IMPORTED_MODULE_0__["WebShmProxy"].protocolName) {
      this._webShm = this._registry.bind(name, interface_, westfield_runtime_client__WEBPACK_IMPORTED_MODULE_0__["WebShmProxy"], version)
      this._webShm.listener = this

      const bufWidth = 250
      const bufHeight = 250

      this._buffers[0] = WebArrayBuffer.create(this._webShm, bufWidth, bufHeight)
      this._buffers[1] = WebArrayBuffer.create(this._webShm, bufWidth, bufHeight)
    }

    if (interface_ === westfield_runtime_client__WEBPACK_IMPORTED_MODULE_0__["WlShellProxy"].protocolName) {
      this._shell = this._registry.bind(name, interface_, westfield_runtime_client__WEBPACK_IMPORTED_MODULE_0__["WlShellProxy"], version)
    }
  }

  init () {
    this._shellSurface = this._shell.getShellSurface(this._surface)
    this._shellSurface.listener = this
    this._shellSurface.setToplevel()
    this._shellSurface.setTitle('Simple Shm Web')
  }

  /**
   * @param {WebArrayBuffer}buffer
   * @param {number}timestamp
   * @private
   */
  _paintPixels (buffer, timestamp) {
    const halfh = buffer.width / 2
    const halfw = buffer.height / 2
    let ir
    let or
    const image = new Uint32Array(buffer.arrayBuffer)

    /* squared radii thresholds */
    or = (halfw < halfh ? halfw : halfh) - 8
    ir = or - 32
    or = or * or
    ir = ir * ir

    let offset = 0
    for (let y = 0; y < buffer.height; y++) {
      const y2 = (y - halfh) * (y - halfh)

      for (let x = 0; x < buffer.width; x++) {
        let v

        const r2 = (x - halfw) * (x - halfw) + y2

        if (r2 < ir) {
          v = (r2 / 32 + timestamp / 64) * 0x8040100
        } else if (r2 < or) {
          v = (y + timestamp / 32) * 0x8040100
        } else {
          v = (x + timestamp / 16) * 0x8040100
        }
        v &= 0x0ffffff00

        if (Math.abs(x - y) > 6 && Math.abs(x + y - buffer.height) > 6) {
          v |= 0x000000ff
        }

        image[offset++] = v
      }
    }
  }

  /**
   * @param {number}timestamp
   */
  draw (timestamp) {
    const webArrayBuffer = this._buffers[this._nextBufferIdx++ % 2]

    this._paintPixels(webArrayBuffer, timestamp)
    webArrayBuffer.seal()

    this._surface.attach(webArrayBuffer.bufferProxy, 0, 0)
    this._surface.damage(0, 0, webArrayBuffer.width, webArrayBuffer.height)

    // wait for the compositor to signal that we can draw the next frame
    new Promise(resolve => { this._surface.frame().listener = { done: resolve } }).then(timestamp => this.draw(timestamp))

    // serial is only required if our buffer contents would take a long time to send to the compositor ie. in a network remote case
    this._surface.commit(0)
  }

  /**
   * @param {number}name
   */
  globalRemove (name) {
    // FIXME keep track of the name number of the globals we bind so we can do cleanup if a global should go away.
  }

  /**
   *
   *  The configure event asks the client to resize its surface.
   *
   *  The size is a hint, in the sense that the client is free to
   *  ignore it if it doesn't resize, pick a smaller size (to
   *  satisfy aspect ratio or resize in steps of NxM pixels).
   *
   *  The edges parameter provides a hint about how the surface
   *  was resized. The client may use this information to decide
   *  how to adjust its content to the new size (e.g. a scrolling
   *  area might adjust its content position to leave the viewable
   *  content unmoved).
   *
   *  The client is free to dismiss all but the last configure
   *  event it received.
   *
   *  The width and height arguments specify the size of the window
   *  in surface-local coordinates.
   *
   *
   * @param {number} edges how the surface was resized
   * @param {number} width new width of the surface
   * @param {number} height new height of the surface
   *
   * @since 1
   *
   */
  configure (edges, width, height) {
    // NOOP
  }

  /**
   *
   *  Ping a client to check if it is receiving events and sending
   *  requests. A client is expected to reply with a pong request.
   *
   *
   * @param {number} serial serial number of the ping
   *
   * @since 1
   *
   */
  ping (serial) {
    this._shellSurface.pong()
  }

  /**
   *
   *  The popup_done event is sent out when a popup grab is broken,
   *  that is, when the user clicks a surface that doesn't belong
   *  to the client owning the popup surface.
   *
   *
   *
   * @since 1
   *
   */
  popupDone () {
    // NOOP
  }
}

function main () {
  // create a new window with some buffers
  const window = Window.create()
  // Wait for all outgoing window creation requests to be processed before we attempt to draw something
  new Promise(resolve => { westfield_runtime_client__WEBPACK_IMPORTED_MODULE_0__["display"].sync().listener = { done: resolve } }).then(() => {
    window.init()
    window.draw(0)
  })
  // flush piled up window creation requests to the display
  westfield_runtime_client__WEBPACK_IMPORTED_MODULE_0__["display"].connection.flush()
}

main()


/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/erik/git/greenfield/simpleshmweb/src/index.js */"./src/index.js");


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy9ob21lL2VyaWsvZ2l0L3dlc3RmaWVsZC9jbGllbnQvcnVudGltZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vL2hvbWUvZXJpay9naXQvd2VzdGZpZWxkL2NsaWVudC9ydW50aW1lL3NyYy9EaXNwbGF5LmpzIiwid2VicGFjazovLy8vaG9tZS9lcmlrL2dpdC93ZXN0ZmllbGQvY2xpZW50L3J1bnRpbWUvc3JjL1dlYkZTLmpzIiwid2VicGFjazovLy8vaG9tZS9lcmlrL2dpdC93ZXN0ZmllbGQvY2xpZW50L3J1bnRpbWUvc3JjL3Byb3RvY29sL1Byb3h5LmpzIiwid2VicGFjazovLy8vaG9tZS9lcmlrL2dpdC93ZXN0ZmllbGQvY2xpZW50L3J1bnRpbWUvc3JjL3Byb3RvY29sL1dlYkFycmF5QnVmZmVyRXZlbnRzLmpzIiwid2VicGFjazovLy8vaG9tZS9lcmlrL2dpdC93ZXN0ZmllbGQvY2xpZW50L3J1bnRpbWUvc3JjL3Byb3RvY29sL1dlYkFycmF5QnVmZmVyUHJveHkuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL2VyaWsvZ2l0L3dlc3RmaWVsZC9jbGllbnQvcnVudGltZS9zcmMvcHJvdG9jb2wvV2ViU2htRXZlbnRzLmpzIiwid2VicGFjazovLy8vaG9tZS9lcmlrL2dpdC93ZXN0ZmllbGQvY2xpZW50L3J1bnRpbWUvc3JjL3Byb3RvY29sL1dlYlNobVByb3h5LmpzIiwid2VicGFjazovLy8vaG9tZS9lcmlrL2dpdC93ZXN0ZmllbGQvY2xpZW50L3J1bnRpbWUvc3JjL3Byb3RvY29sL1dsQnVmZmVyRXZlbnRzLmpzIiwid2VicGFjazovLy8vaG9tZS9lcmlrL2dpdC93ZXN0ZmllbGQvY2xpZW50L3J1bnRpbWUvc3JjL3Byb3RvY29sL1dsQnVmZmVyUHJveHkuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL2VyaWsvZ2l0L3dlc3RmaWVsZC9jbGllbnQvcnVudGltZS9zcmMvcHJvdG9jb2wvV2xDYWxsYmFja0V2ZW50cy5qcyIsIndlYnBhY2s6Ly8vL2hvbWUvZXJpay9naXQvd2VzdGZpZWxkL2NsaWVudC9ydW50aW1lL3NyYy9wcm90b2NvbC9XbENhbGxiYWNrUHJveHkuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL2VyaWsvZ2l0L3dlc3RmaWVsZC9jbGllbnQvcnVudGltZS9zcmMvcHJvdG9jb2wvV2xDb21wb3NpdG9yUHJveHkuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL2VyaWsvZ2l0L3dlc3RmaWVsZC9jbGllbnQvcnVudGltZS9zcmMvcHJvdG9jb2wvV2xEYXRhRGV2aWNlRXZlbnRzLmpzIiwid2VicGFjazovLy8vaG9tZS9lcmlrL2dpdC93ZXN0ZmllbGQvY2xpZW50L3J1bnRpbWUvc3JjL3Byb3RvY29sL1dsRGF0YURldmljZU1hbmFnZXJQcm94eS5qcyIsIndlYnBhY2s6Ly8vL2hvbWUvZXJpay9naXQvd2VzdGZpZWxkL2NsaWVudC9ydW50aW1lL3NyYy9wcm90b2NvbC9XbERhdGFEZXZpY2VQcm94eS5qcyIsIndlYnBhY2s6Ly8vL2hvbWUvZXJpay9naXQvd2VzdGZpZWxkL2NsaWVudC9ydW50aW1lL3NyYy9wcm90b2NvbC9XbERhdGFPZmZlckV2ZW50cy5qcyIsIndlYnBhY2s6Ly8vL2hvbWUvZXJpay9naXQvd2VzdGZpZWxkL2NsaWVudC9ydW50aW1lL3NyYy9wcm90b2NvbC9XbERhdGFPZmZlclByb3h5LmpzIiwid2VicGFjazovLy8vaG9tZS9lcmlrL2dpdC93ZXN0ZmllbGQvY2xpZW50L3J1bnRpbWUvc3JjL3Byb3RvY29sL1dsRGF0YVNvdXJjZUV2ZW50cy5qcyIsIndlYnBhY2s6Ly8vL2hvbWUvZXJpay9naXQvd2VzdGZpZWxkL2NsaWVudC9ydW50aW1lL3NyYy9wcm90b2NvbC9XbERhdGFTb3VyY2VQcm94eS5qcyIsIndlYnBhY2s6Ly8vL2hvbWUvZXJpay9naXQvd2VzdGZpZWxkL2NsaWVudC9ydW50aW1lL3NyYy9wcm90b2NvbC9XbERpc3BsYXlFdmVudHMuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL2VyaWsvZ2l0L3dlc3RmaWVsZC9jbGllbnQvcnVudGltZS9zcmMvcHJvdG9jb2wvV2xEaXNwbGF5UHJveHkuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL2VyaWsvZ2l0L3dlc3RmaWVsZC9jbGllbnQvcnVudGltZS9zcmMvcHJvdG9jb2wvV2xLZXlib2FyZEV2ZW50cy5qcyIsIndlYnBhY2s6Ly8vL2hvbWUvZXJpay9naXQvd2VzdGZpZWxkL2NsaWVudC9ydW50aW1lL3NyYy9wcm90b2NvbC9XbEtleWJvYXJkUHJveHkuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL2VyaWsvZ2l0L3dlc3RmaWVsZC9jbGllbnQvcnVudGltZS9zcmMvcHJvdG9jb2wvV2xPdXRwdXRFdmVudHMuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL2VyaWsvZ2l0L3dlc3RmaWVsZC9jbGllbnQvcnVudGltZS9zcmMvcHJvdG9jb2wvV2xPdXRwdXRQcm94eS5qcyIsIndlYnBhY2s6Ly8vL2hvbWUvZXJpay9naXQvd2VzdGZpZWxkL2NsaWVudC9ydW50aW1lL3NyYy9wcm90b2NvbC9XbFBvaW50ZXJFdmVudHMuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL2VyaWsvZ2l0L3dlc3RmaWVsZC9jbGllbnQvcnVudGltZS9zcmMvcHJvdG9jb2wvV2xQb2ludGVyUHJveHkuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL2VyaWsvZ2l0L3dlc3RmaWVsZC9jbGllbnQvcnVudGltZS9zcmMvcHJvdG9jb2wvV2xSZWdpb25Qcm94eS5qcyIsIndlYnBhY2s6Ly8vL2hvbWUvZXJpay9naXQvd2VzdGZpZWxkL2NsaWVudC9ydW50aW1lL3NyYy9wcm90b2NvbC9XbFJlZ2lzdHJ5RXZlbnRzLmpzIiwid2VicGFjazovLy8vaG9tZS9lcmlrL2dpdC93ZXN0ZmllbGQvY2xpZW50L3J1bnRpbWUvc3JjL3Byb3RvY29sL1dsUmVnaXN0cnlQcm94eS5qcyIsIndlYnBhY2s6Ly8vL2hvbWUvZXJpay9naXQvd2VzdGZpZWxkL2NsaWVudC9ydW50aW1lL3NyYy9wcm90b2NvbC9XbFNlYXRFdmVudHMuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL2VyaWsvZ2l0L3dlc3RmaWVsZC9jbGllbnQvcnVudGltZS9zcmMvcHJvdG9jb2wvV2xTZWF0UHJveHkuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL2VyaWsvZ2l0L3dlc3RmaWVsZC9jbGllbnQvcnVudGltZS9zcmMvcHJvdG9jb2wvV2xTaGVsbFByb3h5LmpzIiwid2VicGFjazovLy8vaG9tZS9lcmlrL2dpdC93ZXN0ZmllbGQvY2xpZW50L3J1bnRpbWUvc3JjL3Byb3RvY29sL1dsU2hlbGxTdXJmYWNlRXZlbnRzLmpzIiwid2VicGFjazovLy8vaG9tZS9lcmlrL2dpdC93ZXN0ZmllbGQvY2xpZW50L3J1bnRpbWUvc3JjL3Byb3RvY29sL1dsU2hlbGxTdXJmYWNlUHJveHkuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL2VyaWsvZ2l0L3dlc3RmaWVsZC9jbGllbnQvcnVudGltZS9zcmMvcHJvdG9jb2wvV2xTdWJjb21wb3NpdG9yUHJveHkuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL2VyaWsvZ2l0L3dlc3RmaWVsZC9jbGllbnQvcnVudGltZS9zcmMvcHJvdG9jb2wvV2xTdWJzdXJmYWNlUHJveHkuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL2VyaWsvZ2l0L3dlc3RmaWVsZC9jbGllbnQvcnVudGltZS9zcmMvcHJvdG9jb2wvV2xTdXJmYWNlRXZlbnRzLmpzIiwid2VicGFjazovLy8vaG9tZS9lcmlrL2dpdC93ZXN0ZmllbGQvY2xpZW50L3J1bnRpbWUvc3JjL3Byb3RvY29sL1dsU3VyZmFjZVByb3h5LmpzIiwid2VicGFjazovLy8vaG9tZS9lcmlrL2dpdC93ZXN0ZmllbGQvY2xpZW50L3J1bnRpbWUvc3JjL3Byb3RvY29sL1dsVG91Y2hFdmVudHMuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL2VyaWsvZ2l0L3dlc3RmaWVsZC9jbGllbnQvcnVudGltZS9zcmMvcHJvdG9jb2wvV2xUb3VjaFByb3h5LmpzIiwid2VicGFjazovLy8vaG9tZS9lcmlrL2dpdC93ZXN0ZmllbGQvY2xpZW50L3J1bnRpbWUvc3JjL3Byb3RvY29sL1hkZ1BvcHVwRXZlbnRzLmpzIiwid2VicGFjazovLy8vaG9tZS9lcmlrL2dpdC93ZXN0ZmllbGQvY2xpZW50L3J1bnRpbWUvc3JjL3Byb3RvY29sL1hkZ1BvcHVwUHJveHkuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL2VyaWsvZ2l0L3dlc3RmaWVsZC9jbGllbnQvcnVudGltZS9zcmMvcHJvdG9jb2wvWGRnUG9zaXRpb25lclByb3h5LmpzIiwid2VicGFjazovLy8vaG9tZS9lcmlrL2dpdC93ZXN0ZmllbGQvY2xpZW50L3J1bnRpbWUvc3JjL3Byb3RvY29sL1hkZ1N1cmZhY2VFdmVudHMuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL2VyaWsvZ2l0L3dlc3RmaWVsZC9jbGllbnQvcnVudGltZS9zcmMvcHJvdG9jb2wvWGRnU3VyZmFjZVByb3h5LmpzIiwid2VicGFjazovLy8vaG9tZS9lcmlrL2dpdC93ZXN0ZmllbGQvY2xpZW50L3J1bnRpbWUvc3JjL3Byb3RvY29sL1hkZ1RvcGxldmVsRXZlbnRzLmpzIiwid2VicGFjazovLy8vaG9tZS9lcmlrL2dpdC93ZXN0ZmllbGQvY2xpZW50L3J1bnRpbWUvc3JjL3Byb3RvY29sL1hkZ1RvcGxldmVsUHJveHkuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL2VyaWsvZ2l0L3dlc3RmaWVsZC9jbGllbnQvcnVudGltZS9zcmMvcHJvdG9jb2wvWGRnV21CYXNlRXZlbnRzLmpzIiwid2VicGFjazovLy8vaG9tZS9lcmlrL2dpdC93ZXN0ZmllbGQvY2xpZW50L3J1bnRpbWUvc3JjL3Byb3RvY29sL1hkZ1dtQmFzZVByb3h5LmpzIiwid2VicGFjazovLy8vaG9tZS9lcmlrL2dpdC93ZXN0ZmllbGQvY29tbW9uL2luZGV4LmpzIiwid2VicGFjazovLy8vaG9tZS9lcmlrL2dpdC93ZXN0ZmllbGQvY29tbW9uL3NyYy9Db25uZWN0aW9uLmpzIiwid2VicGFjazovLy8vaG9tZS9lcmlrL2dpdC93ZXN0ZmllbGQvY29tbW9uL3NyYy9GaXhlZC5qcyIsIndlYnBhY2s6Ly8vL2hvbWUvZXJpay9naXQvd2VzdGZpZWxkL2NvbW1vbi9zcmMvV2ViRkQuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL2VyaWsvZ2l0L3dlc3RmaWVsZC9jb21tb24vc3JjL1dsT2JqZWN0LmpzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRVk7O0FBRW1CO0FBQ0k7O0FBRW5DO0FBQzBEO0FBQ0U7QUFDQTtBQUNJO0FBQ2hFO0FBQ0E7QUFDd0Q7QUFDTTtBQUNFO0FBQ0E7QUFDYztBQUN4QjtBQUNjO0FBQ1Y7QUFDTjtBQUNNO0FBQ0U7QUFDTjtBQUNFO0FBQ0E7QUFDYztBQUNOO0FBQ0o7QUFDRTtBQUNBO0FBQzlEO0FBQzBEO0FBQ007QUFDRTtBQUNBO0FBQ0k7QUFDVjtBQUNOO0FBQ007QUFDRTtBQUNOO0FBQ0U7O0FBRTFEO0FBQzBEO0FBQ1E7QUFDTjtBQUNFO0FBQ047QUFDSTtBQUNFO0FBQ0U7QUFDTjs7QUFFMUQ7QUFDb0U7QUFDaEI7QUFD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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNlOztBQUVmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CLFlBQVksRUFBRTtBQUNkLFlBQVksTUFBTTtBQUNsQixZQUFZLE1BQU07QUFDbEIsWUFBWSxHQUFHO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQixZQUFZLE1BQU07QUFDbEIsWUFBWSxNQUFNO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxHQUFHO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7OztBQ2pKQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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Q0E7QUFDQTtBQUNlOztBQUVmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFFBQVE7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQixZQUFZLE1BQU07QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDcEtBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVxRDtBQUNyRCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLEdBQUcsbUVBQVU7QUFDVjs7QUFFM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyw4Q0FBSzs7QUFFckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWUsZ0ZBQWlCOzs7Ozs7Ozs7Ozs7O0FDdEpoQztBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ2U7O0FBRWY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksRUFBRTtBQUNkLFlBQVksT0FBTztBQUNuQixZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7OztBQ3JFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRXFEO0FBQ3JELE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsR0FBRyxtRUFBVTtBQUNWO0FBQ29CO0FBQ0E7O0FBRS9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2Qiw4Q0FBSzs7QUFFbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxnQkFBZ0I7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRCx3REFBZTtBQUNyRTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsZ0JBQWdCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0Qsd0RBQWU7QUFDckU7O0FBRUE7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFZSw2RUFBYzs7Ozs7Ozs7Ozs7OztBQzdIN0I7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNlOztBQUVmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQixZQUFZLE1BQU07QUFDbEIsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CLFlBQVksRUFBRTtBQUNkLFlBQVksWUFBWTtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQixZQUFZLEVBQUU7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CLFlBQVksT0FBTztBQUNuQixZQUFZLE9BQU87QUFDbkIsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CLFlBQVksT0FBTztBQUNuQixZQUFZLE9BQU87QUFDbkIsWUFBWSxPQUFPO0FBQ25CLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDMUlBO0FBQUE7QUFB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QUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFZSw0RUFBYTs7Ozs7Ozs7Ozs7OztBQ3JLNUI7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNlOztBQUVmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CLFlBQVksRUFBRTtBQUNkLFlBQVksTUFBTTtBQUNsQixZQUFZLE1BQU07QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkIsWUFBWSxFQUFFO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQixZQUFZLE1BQU07QUFDbEIsWUFBWSxNQUFNO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CLFlBQVksT0FBTztBQUNuQixZQUFZLE9BQU87QUFDbkIsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQixZQUFZLE9BQU87QUFDbkIsWUFBWSxNQUFNO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQixZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQixZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7OztBQy9SQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFcUQ7QUFDckQsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixHQUFHLG1FQUFVO0FBQ1Y7O0FBRTNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2Qiw4Q0FBSzs7QUFFbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQixZQUFZLEdBQUc7QUFDZixZQUFZLE9BQU87QUFDbkIsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWUsNkVBQWM7Ozs7Ozs7Ozs7Ozs7QUNwTjdCO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVxRDtBQUNyRCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLEdBQUcsbUVBQVU7QUFDVjs7QUFFM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qiw4Q0FBSzs7QUFFakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FB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QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksRUFBRTtBQUNkLFlBQVksT0FBTztBQUNuQixZQUFZLE9BQU87QUFDbkIsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CLFlBQVksT0FBTztBQUNuQixZQUFZLEdBQUc7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxFQUFFO0FBQ2QsWUFBWSxPQUFPO0FBQ25CLFlBQVksRUFBRTtBQUNkLFlBQVksT0FBTztBQUNuQixZQUFZLE9BQU87QUFDbkIsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxHQUFHO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVlLGtGQUFtQjs7Ozs7Ozs7Ozs7OztBQ3ZZbEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFcUQ7QUFDckQsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixHQUFHLG1FQUFVO0FBQ1Y7QUFDd0I7O0FBRW5EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsOENBQUs7O0FBRXhDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxFQUFFO0FBQ2QsWUFBWSxFQUFFO0FBQ2QsYUFBYSxrQkFBa0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRCwwREFBaUI7QUFDdkU7O0FBRUE7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFZSxtRkFBb0I7Ozs7Ozs7Ozs7Ozs7QUN4SG5DO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVxRDtBQUNyRCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLEdBQUcsbUVBQVU7QUFDVjs7QUFFM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyw4Q0FBSzs7QUFFckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksRUFBRTtBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksRUFBRTtBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsT0FBTztB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxHQUFHO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksR0FBRztBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQixZQUFZLE9BQU87QUFDbkIsWUFBWSxPQUFPO0FBQ25CLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFZSw2RUFBYzs7Ozs7Ozs7Ozs7OztBQzVlN0I7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNlOztBQUVmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkIsWUFBWSxPQUFPO0FBQ25CLFlBQVksRUFBRTtBQUNkLFlBQVksT0FBTztBQUNuQixZQUFZLE1BQU07QUFDbEIsWUFBWSxNQUFNO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkIsWUFBWSxPQUFPO0FBQ25CLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkIsWUFBWSxPQUFPO0FBQ25CLFlBQVksTUFBTTtBQUNsQixZQUFZLE1BQU07QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CLFlBQVksTUFBTTtBQUNsQixZQUFZLE1BQU07QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkIsWUFBWSxNQUFNO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUMvTEE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRXFEO0FBQ3JELE9BQU87QUFD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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxHQUFHO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxFQUFFO0FBQ2QsWUFBWSxPQUFPO0FBQ25CLFlBQVksT0FBTztBQUNuQixZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksRUFBRTtBQUNkLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksRUFBRTtBQUNkLFlBQVksT0FBTztBQUNuQixZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQixZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQixZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLEdBQUc7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsT0FBTztBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVlLCtFQUFnQjs7Ozs7Ozs7Ozs7OztBQzNqQi9CO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLENBQUMsZ0VBQU8sb0JBQW9CLGdCQUFnQixFQUFFO0FBQ3hFO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxFQUFFLGdFQUFPO0FBQ1Q7O0FBRUEiLCJmaWxlIjoic2ltcGxlLndlYi5zaG0uanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9cIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuIiwiLypcbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAxNyBFcmlrIERlIFJpamNrZVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbiAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4gIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cbiovXG5cbid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgV2ViRlMgZnJvbSAnLi9zcmMvV2ViRlMnXG5pbXBvcnQgRGlzcGxheSBmcm9tICcuL3NyYy9EaXNwbGF5J1xuXG4vLyBjb3JlIHdheWxhbmQgcHJvdG9jb2xcbmltcG9ydCBXbERpc3BsYXlQcm94eSBmcm9tICcuL3NyYy9wcm90b2NvbC9XbERpc3BsYXlQcm94eSdcbmltcG9ydCBXbFJlZ2lzdHJ5UHJveHkgZnJvbSAnLi9zcmMvcHJvdG9jb2wvV2xSZWdpc3RyeVByb3h5J1xuaW1wb3J0IFdsQ2FsbGJhY2tQcm94eSBmcm9tICcuL3NyYy9wcm90b2NvbC9XbENhbGxiYWNrUHJveHknXG5pbXBvcnQgV2xDb21wb3NpdG9yUHJveHkgZnJvbSAnLi9zcmMvcHJvdG9jb2wvV2xDb21wb3NpdG9yUHJveHknXG4vLyBpbXBvcnQgV2xTaG1Qb29sUHJveHkgZnJvbSAnLi9zcmMvcHJvdG9jb2wvV2xTaG1Qb29sUHJveHknXG4vLyBpbXBvcnQgV2xTaG1Qcm94eSBmcm9tICcuL3NyYy9wcm90b2NvbC9XbFNobVByb3h5J1xuaW1wb3J0IFdsQnVmZmVyUHJveHkgZnJvbSAnLi9zcmMvcHJvdG9jb2wvV2xCdWZmZXJQcm94eSdcbmltcG9ydCBXbERhdGFPZmZlclByb3h5IGZyb20gJy4vc3JjL3Byb3RvY29sL1dsRGF0YU9mZmVyUHJveHknXG5pbXBvcnQgV2xEYXRhU291cmNlUHJveHkgZnJvbSAnLi9zcmMvcHJvdG9jb2wvV2xEYXRhU291cmNlUHJveHknXG5pbXBvcnQgV2xEYXRhRGV2aWNlUHJveHkgZnJvbSAnLi9zcmMvcHJvdG9jb2wvV2xEYXRhRGV2aWNlUHJveHknXG5pbXBvcnQgV2xEYXRhRGV2aWNlTWFuYWdlclByb3h5IGZyb20gJy4vc3JjL3Byb3RvY29sL1dsRGF0YURldmljZU1hbmFnZXJQcm94eSdcbmltcG9ydCBXbFNoZWxsUHJveHkgZnJvbSAnLi9zcmMvcHJvdG9jb2wvV2xTaGVsbFByb3h5J1xuaW1wb3J0IFdsU2hlbGxTdXJmYWNlUHJveHkgZnJvbSAnLi9zcmMvcHJvdG9jb2wvV2xTaGVsbFN1cmZhY2VQcm94eSdcbmltcG9ydCBXbFN1cmZhY2VQcm94eSBmcm9tICcuL3NyYy9wcm90b2NvbC9XbFN1cmZhY2VQcm94eSdcbmltcG9ydCBXbFNlYXRQcm94eSBmcm9tICcuL3NyYy9wcm90b2NvbC9XbFNlYXRQcm94eSdcbmltcG9ydCBXbFBvaW50ZXJQcm94eSBmcm9tICcuL3NyYy9wcm90b2NvbC9XbFBvaW50ZXJQcm94eSdcbmltcG9ydCBXbEtleWJvYXJkUHJveHkgZnJvbSAnLi9zcmMvcHJvdG9jb2wvV2xLZXlib2FyZFByb3h5J1xuaW1wb3J0IFdsVG91Y2hQcm94eSBmcm9tICcuL3NyYy9wcm90b2NvbC9XbFRvdWNoUHJveHknXG5pbXBvcnQgV2xPdXRwdXRQcm94eSBmcm9tICcuL3NyYy9wcm90b2NvbC9XbE91dHB1dFByb3h5J1xuaW1wb3J0IFdsUmVnaW9uUHJveHkgZnJvbSAnLi9zcmMvcHJvdG9jb2wvV2xSZWdpb25Qcm94eSdcbmltcG9ydCBXbFN1YmNvbXBvc2l0b3JQcm94eSBmcm9tICcuL3NyYy9wcm90b2NvbC9XbFN1YmNvbXBvc2l0b3JQcm94eSdcbmltcG9ydCBXbFN1YnN1cmZhY2VQcm94eSBmcm9tICcuL3NyYy9wcm90b2NvbC9XbFN1YnN1cmZhY2VQcm94eSdcbmltcG9ydCBXbERpc3BsYXlFdmVudHMgZnJvbSAnLi9zcmMvcHJvdG9jb2wvV2xEaXNwbGF5RXZlbnRzJ1xuaW1wb3J0IFdsUmVnaXN0cnlFdmVudHMgZnJvbSAnLi9zcmMvcHJvdG9jb2wvV2xSZWdpc3RyeUV2ZW50cydcbmltcG9ydCBXbENhbGxiYWNrRXZlbnRzIGZyb20gJy4vc3JjL3Byb3RvY29sL1dsQ2FsbGJhY2tFdmVudHMnXG4vLyBpbXBvcnQgV2xTaG1FdmVudHMgZnJvbSAnLi9zcmMvcHJvdG9jb2wvV2xTaG1FdmVudHMnXG5pbXBvcnQgV2xCdWZmZXJFdmVudHMgZnJvbSAnLi9zcmMvcHJvdG9jb2wvV2xCdWZmZXJFdmVudHMnXG5pbXBvcnQgV2xEYXRhT2ZmZXJFdmVudHMgZnJvbSAnLi9zcmMvcHJvdG9jb2wvV2xEYXRhT2ZmZXJFdmVudHMnXG5pbXBvcnQgV2xEYXRhU291cmNlRXZlbnRzIGZyb20gJy4vc3JjL3Byb3RvY29sL1dsRGF0YVNvdXJjZUV2ZW50cydcbmltcG9ydCBXbERhdGFEZXZpY2VFdmVudHMgZnJvbSAnLi9zcmMvcHJvdG9jb2wvV2xEYXRhRGV2aWNlRXZlbnRzJ1xuaW1wb3J0IFdsU2hlbGxTdXJmYWNlRXZlbnRzIGZyb20gJy4vc3JjL3Byb3RvY29sL1dsU2hlbGxTdXJmYWNlRXZlbnRzJ1xuaW1wb3J0IFdsU3VyZmFjZUV2ZW50cyBmcm9tICcuL3NyYy9wcm90b2NvbC9XbFN1cmZhY2VFdmVudHMnXG5pbXBvcnQgV2xTZWF0RXZlbnRzIGZyb20gJy4vc3JjL3Byb3RvY29sL1dsU2VhdEV2ZW50cydcbmltcG9ydCBXbFBvaW50ZXJFdmVudHMgZnJvbSAnLi9zcmMvcHJvdG9jb2wvV2xQb2ludGVyRXZlbnRzJ1xuaW1wb3J0IFdsS2V5Ym9hcmRFdmVudHMgZnJvbSAnLi9zcmMvcHJvdG9jb2wvV2xLZXlib2FyZEV2ZW50cydcbmltcG9ydCBXbFRvdWNoRXZlbnRzIGZyb20gJy4vc3JjL3Byb3RvY29sL1dsVG91Y2hFdmVudHMnXG5pbXBvcnQgV2xPdXRwdXRFdmVudHMgZnJvbSAnLi9zcmMvcHJvdG9jb2wvV2xPdXRwdXRFdmVudHMnXG5cbi8vIHhkZ19zaGVsbFxuaW1wb3J0IFhkZ1dtQmFzZVByb3h5IGZyb20gJy4vc3JjL3Byb3RvY29sL1hkZ1dtQmFzZVByb3h5J1xuaW1wb3J0IFhkZ1Bvc2l0aW9uZXJQcm94eSBmcm9tICcuL3NyYy9wcm90b2NvbC9YZGdQb3NpdGlvbmVyUHJveHknXG5pbXBvcnQgWGRnU3VyZmFjZVByb3h5IGZyb20gJy4vc3JjL3Byb3RvY29sL1hkZ1N1cmZhY2VQcm94eSdcbmltcG9ydCBYZGdUb3BsZXZlbFByb3h5IGZyb20gJy4vc3JjL3Byb3RvY29sL1hkZ1RvcGxldmVsUHJveHknXG5pbXBvcnQgWGRnUG9wdXBQcm94eSBmcm9tICcuL3NyYy9wcm90b2NvbC9YZGdQb3B1cFByb3h5J1xuaW1wb3J0IFhkZ1dtQmFzZUV2ZW50cyBmcm9tICcuL3NyYy9wcm90b2NvbC9YZGdXbUJhc2VFdmVudHMnXG5pbXBvcnQgWGRnU3VyZmFjZUV2ZW50cyBmcm9tICcuL3NyYy9wcm90b2NvbC9YZGdTdXJmYWNlRXZlbnRzJ1xuaW1wb3J0IFhkZ1RvcGxldmVsRXZlbnRzIGZyb20gJy4vc3JjL3Byb3RvY29sL1hkZ1RvcGxldmVsRXZlbnRzJ1xuaW1wb3J0IFhkZ1BvcHVwRXZlbnRzIGZyb20gJy4vc3JjL3Byb3RvY29sL1hkZ1BvcHVwRXZlbnRzJ1xuXG4vLyB3ZWIgc2htXG5pbXBvcnQgV2ViQXJyYXlCdWZmZXJQcm94eSBmcm9tICcuL3NyYy9wcm90b2NvbC9XZWJBcnJheUJ1ZmZlclByb3h5J1xuaW1wb3J0IFdlYlNobVByb3h5IGZyb20gJy4vc3JjL3Byb3RvY29sL1dlYlNobVByb3h5J1xuaW1wb3J0IFdlYkFycmF5QnVmZmVyRXZlbnRzIGZyb20gJy4vc3JjL3Byb3RvY29sL1dlYkFycmF5QnVmZmVyRXZlbnRzJ1xuaW1wb3J0IFdlYlNobUV2ZW50cyBmcm9tICcuL3NyYy9wcm90b2NvbC9XZWJTaG1FdmVudHMnXG5cbi8qKlxuICogQHR5cGUge1dlYkZTfVxuICovXG5jb25zdCB3ZWJGUyA9IFdlYkZTLmNyZWF0ZShfdXVpZHY0KCkpXG4vKipcbiAqIEB0eXBlIHtEaXNwbGF5fVxuICovXG5jb25zdCBkaXNwbGF5ID0gbmV3IERpc3BsYXkoKVxuXG4vKipcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBfdXVpZHY0ICgpIHtcbiAgcmV0dXJuIChbMWU3XSArIC0xZTMgKyAtNGUzICsgLThlMyArIC0xZTExKS5yZXBsYWNlKC9bMDE4XS9nLCBjID0+XG4gICAgKGMgXiBzZWxmLmNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQ4QXJyYXkoMSkpWzBdICYgMTUgPj4gYyAvIDQpLnRvU3RyaW5nKDE2KVxuICApXG59XG5cbi8qKlxuICogQHBhcmFtIHtDb25uZWN0aW9ufWNvbm5lY3Rpb25cbiAqIEBwYXJhbSB7V2ViRlN9d2ViRlNcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIF9zZXR1cE1lc3NhZ2VIYW5kbGluZyAoY29ubmVjdGlvbiwgd2ViRlMpIHtcbiAgLyoqXG4gICAqIEB0eXBlIHtBcnJheTxBcnJheTx7YnVmZmVyOiBBcnJheUJ1ZmZlciwgZmRzOiBBcnJheTxXZWJGRD59Pj59XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjb25zdCBfZmx1c2hRdWV1ZSA9IFtdXG4gIC8qKlxuICAgKiBAcGFyYW0ge01lc3NhZ2VFdmVudH1ldmVudFxuICAgKi9cbiAgb25tZXNzYWdlID0gKGV2ZW50KSA9PiB7XG4gICAgY29uc3Qgd2ViV29ya2VyTWVzc2FnZSA9IC8qKiBAdHlwZSB7e3Byb3RvY29sTWVzc2FnZTpBcnJheUJ1ZmZlciwgbWV0YTpBcnJheTxUcmFuc2ZlcmFibGU+fX0gKi9ldmVudC5kYXRhXG4gICAgaWYgKHdlYldvcmtlck1lc3NhZ2UucHJvdG9jb2xNZXNzYWdlIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBVaW50MzJBcnJheSgvKiogQHR5cGUge0FycmF5QnVmZmVyfSAqL3dlYldvcmtlck1lc3NhZ2UucHJvdG9jb2xNZXNzYWdlKVxuICAgICAgY29uc3QgZmRzID0gd2ViV29ya2VyTWVzc2FnZS5tZXRhLm1hcCh0cmFuc2ZlcmFibGUgPT4ge1xuICAgICAgICBpZiAodHJhbnNmZXJhYmxlIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgICByZXR1cm4gd2ViRlMuZnJvbUFycmF5QnVmZmVyKHRyYW5zZmVyYWJsZSlcbiAgICAgICAgfSBlbHNlIGlmICh0cmFuc2ZlcmFibGUgaW5zdGFuY2VvZiBJbWFnZUJpdG1hcCkge1xuICAgICAgICAgIHJldHVybiB3ZWJGUy5mcm9tSW1hZ2VCaXRtYXAodHJhbnNmZXJhYmxlKVxuICAgICAgICB9Ly8gZWxzZSBpZiAodHJhbnNmZXJhYmxlIGluc3RhbmNlb2YgTWVzc2FnZVBvcnQpIHtcbiAgICAgICAgLy8gfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIHRyYW5zZmVyYWJsZTogJHt0cmFuc2ZlcmFibGV9YClcbiAgICAgIH0pXG4gICAgICBjb25uZWN0aW9uLm1lc3NhZ2UoeyBidWZmZXIsIGZkcyB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBbd2ViLXdvcmtlci1jbGllbnRdIHNlcnZlciBzZW5kIGFuIGlsbGVnYWwgbWVzc2FnZS5gKVxuICAgICAgY29ubmVjdGlvbi5jbG9zZSgpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7QXJyYXk8e2J1ZmZlcjogQXJyYXlCdWZmZXIsIGZkczogQXJyYXk8V2ViRkQ+fT59d2lyZU1lc3NhZ2VzXG4gICAqIEByZXR1cm4ge1Byb21pc2U8dm9pZD59XG4gICAqL1xuICBjb25uZWN0aW9uLm9uRmx1c2ggPSBhc3luYyAod2lyZU1lc3NhZ2VzKSA9PiB7XG4gICAgX2ZsdXNoUXVldWUucHVzaCh3aXJlTWVzc2FnZXMpXG5cbiAgICBpZiAoX2ZsdXNoUXVldWUubGVuZ3RoID4gMSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgd2hpbGUgKF9mbHVzaFF1ZXVlLmxlbmd0aCkge1xuICAgICAgY29uc3Qgc2VuZFdpcmVNZXNzYWdlcyA9IF9mbHVzaFF1ZXVlWzBdXG5cbiAgICAgIC8vIGNvbnZlcnQgdG8gc2luZ2xlIGFycmF5QnVmZmVyIHNvIGl0IGNhbiBiZSBzZW5kIG92ZXIgYSBkYXRhIGNoYW5uZWwgdXNpbmcgemVybyBjb3B5IHNlbWFudGljcy5cbiAgICAgIGNvbnN0IG1lc3NhZ2VzU2l6ZSA9IHNlbmRXaXJlTWVzc2FnZXMucmVkdWNlKChwcmV2aW91c1ZhbHVlLCBjdXJyZW50VmFsdWUpID0+IHByZXZpb3VzVmFsdWUgKyBjdXJyZW50VmFsdWUuYnVmZmVyLmJ5dGVMZW5ndGgsIDApXG5cbiAgICAgIGNvbnN0IHNlbmRCdWZmZXIgPSBuZXcgVWludDMyQXJyYXkobmV3IEFycmF5QnVmZmVyKG1lc3NhZ2VzU2l6ZSkpXG4gICAgICBsZXQgb2Zmc2V0ID0gMFxuICAgICAgY29uc3QgbWV0YSA9IFtdXG4gICAgICBmb3IgKGNvbnN0IHdpcmVNZXNzYWdlIG9mIHNlbmRXaXJlTWVzc2FnZXMpIHtcbiAgICAgICAgZm9yIChjb25zdCB3ZWJGZCBvZiB3aXJlTWVzc2FnZS5mZHMpIHtcbiAgICAgICAgICBjb25zdCB0cmFuc2ZlcmFibGUgPSBhd2FpdCB3ZWJGZC5nZXRUcmFuc2ZlcmFibGUoKVxuICAgICAgICAgIG1ldGEucHVzaCh0cmFuc2ZlcmFibGUpXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IG5ldyBVaW50MzJBcnJheSh3aXJlTWVzc2FnZS5idWZmZXIpXG4gICAgICAgIHNlbmRCdWZmZXIuc2V0KG1lc3NhZ2UsIG9mZnNldClcbiAgICAgICAgb2Zmc2V0ICs9IG1lc3NhZ2UubGVuZ3RoXG4gICAgICB9XG5cbiAgICAgIHBvc3RNZXNzYWdlKHsgcHJvdG9jb2xNZXNzYWdlOiBzZW5kQnVmZmVyLmJ1ZmZlciwgbWV0YSB9LCBbc2VuZEJ1ZmZlci5idWZmZXJdLmNvbmNhdChtZXRhKSlcbiAgICAgIF9mbHVzaFF1ZXVlLnNoaWZ0KClcbiAgICB9XG4gIH1cbn1cblxuX3NldHVwTWVzc2FnZUhhbmRsaW5nKGRpc3BsYXkuY29ubmVjdGlvbiwgd2ViRlMpXG5cbi8qKlxuICogQHR5cGUge3tkaXNwbGF5OiBEaXNwbGF5LCB3ZWJGUzogV2ViRlN9fVxuICovXG5leHBvcnQge1xuICB3ZWJGUyxcbiAgZGlzcGxheSxcblxuICBXbERpc3BsYXlQcm94eSxcbiAgV2xSZWdpc3RyeVByb3h5LFxuICBXbENhbGxiYWNrUHJveHksXG4gIFdsQ29tcG9zaXRvclByb3h5LFxuICBXbEJ1ZmZlclByb3h5LFxuICBXbERhdGFPZmZlclByb3h5LFxuICBXbERhdGFTb3VyY2VQcm94eSxcbiAgV2xEYXRhRGV2aWNlUHJveHksXG4gIFdsRGF0YURldmljZU1hbmFnZXJQcm94eSxcbiAgV2xTaGVsbFByb3h5LFxuICBXbFNoZWxsU3VyZmFjZVByb3h5LFxuICBXbFN1cmZhY2VQcm94eSxcbiAgV2xTZWF0UHJveHksXG4gIFdsUG9pbnRlclByb3h5LFxuICBXbEtleWJvYXJkUHJveHksXG4gIFdsVG91Y2hQcm94eSxcbiAgV2xPdXRwdXRQcm94eSxcbiAgV2xSZWdpb25Qcm94eSxcbiAgV2xTdWJjb21wb3NpdG9yUHJveHksXG4gIFdsU3Vic3VyZmFjZVByb3h5LFxuICBXbERpc3BsYXlFdmVudHMsXG4gIFdsUmVnaXN0cnlFdmVudHMsXG4gIFdsQ2FsbGJhY2tFdmVudHMsXG4gIFdsQnVmZmVyRXZlbnRzLFxuICBXbERhdGFPZmZlckV2ZW50cyxcbiAgV2xEYXRhU291cmNlRXZlbnRzLFxuICBXbERhdGFEZXZpY2VFdmVudHMsXG4gIFdsU2hlbGxTdXJmYWNlRXZlbnRzLFxuICBXbFN1cmZhY2VFdmVudHMsXG4gIFdsU2VhdEV2ZW50cyxcbiAgV2xQb2ludGVyRXZlbnRzLFxuICBXbEtleWJvYXJkRXZlbnRzLFxuICBXbFRvdWNoRXZlbnRzLFxuICBXbE91dHB1dEV2ZW50cyxcblxuICBYZGdXbUJhc2VQcm94eSxcbiAgWGRnUG9zaXRpb25lclByb3h5LFxuICBYZGdTdXJmYWNlUHJveHksXG4gIFhkZ1RvcGxldmVsUHJveHksXG4gIFhkZ1BvcHVwUHJveHksXG4gIFhkZ1dtQmFzZUV2ZW50cyxcbiAgWGRnU3VyZmFjZUV2ZW50cyxcbiAgWGRnVG9wbGV2ZWxFdmVudHMsXG4gIFhkZ1BvcHVwRXZlbnRzLFxuXG4gIFdlYkFycmF5QnVmZmVyUHJveHksXG4gIFdlYlNobVByb3h5LFxuICBXZWJBcnJheUJ1ZmZlckV2ZW50cyxcbiAgV2ViU2htRXZlbnRzXG59IiwiLypcbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAxNyBFcmlrIERlIFJpamNrZVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbiAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4gIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cbiovXG4ndXNlIHN0cmljdCdcblxuaW1wb3J0IHsgQ29ubmVjdGlvbiB9IGZyb20gJ3dlc3RmaWVsZC1ydW50aW1lLWNvbW1vbidcbmltcG9ydCBXbERpc3BsYXlQcm94eSBmcm9tICcuL3Byb3RvY29sL1dsRGlzcGxheVByb3h5J1xuaW1wb3J0IFdsRGlzcGxheUV2ZW50cyBmcm9tICcuL3Byb3RvY29sL1dsRGlzcGxheUV2ZW50cydcblxuLyoqXG4gKiBAaW1wbGVtZW50cyBXbERpc3BsYXlFdmVudHNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGlzcGxheSBleHRlbmRzIFdsRGlzcGxheUV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigpXG4gICAgLyoqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLm5leHRJZCA9IDFcbiAgICAvKipcbiAgICAgKiBAdHlwZSB7Q29ubmVjdGlvbn1cbiAgICAgKi9cbiAgICB0aGlzLmNvbm5lY3Rpb24gPSBuZXcgQ29ubmVjdGlvbigpXG4gICAgLyoqXG4gICAgICogQHR5cGUge1dsRGlzcGxheVByb3h5fVxuICAgICAqL1xuICAgIHRoaXMuZGlzcGxheVByb3h5ID0gbmV3IFdsRGlzcGxheVByb3h5KHRoaXMsIHRoaXMubmV4dElkKyspXG4gICAgLyoqXG4gICAgICogQHR5cGUge0Rpc3BsYXl9XG4gICAgICovXG4gICAgdGhpcy5kaXNwbGF5UHJveHkubGlzdGVuZXIgPSB0aGlzXG4gIH1cblxuICAvKipcbiAgICogRm9yIGludGVybmFsIHVzZSBvbmx5LlxuICAgKiBAcGFyYW0ge251bWJlcn0gaWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IG9wY29kZVxuICAgKiBAcGFyYW0ge1Byb3h5fSBwcm94eUNsYXNzXG4gICAqIEBwYXJhbSB7QXJyYXk8e3ZhbHVlOiAqLCB0eXBlOiBzdHJpbmcsIHNpemU6IG51bWJlciwgb3B0aW9uYWw6IGJvb2xlYW4sIF9tYXJzaGFsbEFyZzogZnVuY3Rpb24oe2J1ZmZlcjogQXJyYXlCdWZmZXIsIGZkczogQXJyYXk8V2ViRkQ+LCBidWZmZXJPZmZzZXQ6IG51bWJlcn0pOnZvaWR9Pn0gYXJnc0FycmF5XG4gICAqL1xuICBtYXJzaGFsbENvbnN0cnVjdG9yIChpZCwgb3Bjb2RlLCBwcm94eUNsYXNzLCBhcmdzQXJyYXkpIHtcbiAgICAvLyBjb25zdHJ1Y3QgbmV3IG9iamVjdFxuICAgIGNvbnN0IHByb3h5ID0gbmV3IHByb3h5Q2xhc3ModGhpcywgdGhpcy5uZXh0SWQrKylcbiAgICB0aGlzLnJlZ2lzdGVyUHJveHkocHJveHkpXG5cbiAgICAvLyBkZXRlcm1pbmUgcmVxdWlyZWQgd2lyZSBtZXNzYWdlIGxlbmd0aFxuICAgIGxldCBzaXplID0gNCArIDIgKyAyIC8vIGlkK3NpemUrb3Bjb2RlXG4gICAgYXJnc0FycmF5LmZvckVhY2goYXJnID0+IHtcbiAgICAgIGlmIChhcmcudHlwZSA9PT0gJ24nKSB7XG4gICAgICAgIGFyZy52YWx1ZSA9IHByb3h5LmlkXG4gICAgICB9XG4gICAgICBzaXplICs9IGFyZy5zaXplXG4gICAgfSlcblxuICAgIHRoaXMuY29ubmVjdGlvbi5tYXJzaGFsbE1zZyhpZCwgb3Bjb2RlLCBzaXplLCBhcmdzQXJyYXkpXG5cbiAgICByZXR1cm4gcHJveHlcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3IgaW50ZXJuYWwgdXNlIG9ubHkuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpZFxuICAgKiBAcGFyYW0ge251bWJlcn0gb3Bjb2RlXG4gICAqIEBwYXJhbSB7QXJyYXk8e3ZhbHVlOiAqLCB0eXBlOiBzdHJpbmcsIHNpemU6IG51bWJlciwgb3B0aW9uYWw6IGJvb2xlYW4sIF9tYXJzaGFsbEFyZzogZnVuY3Rpb24oe2J1ZmZlcjogQXJyYXlCdWZmZXIsIGZkczogQXJyYXk8V2ViRkQ+LCBidWZmZXJPZmZzZXQ6IG51bWJlcn0pOnZvaWR9Pn0gYXJnc0FycmF5XG4gICAqL1xuICBtYXJzaGFsbCAoaWQsIG9wY29kZSwgYXJnc0FycmF5KSB7XG4gICAgLy8gZGV0ZXJtaW5lIHJlcXVpcmVkIHdpcmUgbWVzc2FnZSBsZW5ndGhcbiAgICBsZXQgc2l6ZSA9IDQgKyAyICsgMiAgLy8gaWQrc2l6ZStvcGNvZGVcbiAgICBhcmdzQXJyYXkuZm9yRWFjaChhcmcgPT4gc2l6ZSArPSBhcmcuc2l6ZSlcbiAgICB0aGlzLmNvbm5lY3Rpb24ubWFyc2hhbGxNc2coaWQsIG9wY29kZSwgc2l6ZSwgYXJnc0FycmF5KVxuICB9XG5cbiAgY2xvc2UgKCkge1xuICAgIGlmICh0aGlzLmNvbm5lY3Rpb24uY2xvc2VkKSB7IHJldHVybiB9XG4gICAgdGhpcy5jb25uZWN0aW9uLmNsb3NlKClcbiAgICB0aGlzLmRpc3BsYXkgPSBudWxsXG4gICAgdGhpcy5pbXBsZW1lbnRhdGlvbiA9IG51bGxcbiAgICB0aGlzLl9kZXN0cm95ZWRSZXNvbHZlcigpXG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtQcm94eX0gcHJveHlcbiAgICovXG4gIHJlZ2lzdGVyUHJveHkgKHByb3h5KSB7XG4gICAgdGhpcy5jb25uZWN0aW9uLnJlZ2lzdGVyV2xPYmplY3QocHJveHkpXG4gICAgLy8gVE9ETyBwcm94eSBjcmVhdGVkIGxpc3RlbmVyP1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7UHJveHl9cHJveHlcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHVucmVnaXN0ZXJQcm94eSAocHJveHkpIHtcbiAgICB0aGlzLmNvbm5lY3Rpb24udW5yZWdpc3RlcldsT2JqZWN0KHByb3h5KVxuICAgIC8vIFRPRE8gcHJveHkgZGVzdHJveWVkIGxpc3RlbmVyP1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge1dsUmVnaXN0cnlQcm94eX1cbiAgICovXG4gIGdldFJlZ2lzdHJ5ICgpIHtcbiAgICAvLyBjcmVhdGVSZWdpc3RyeSAtPiBvcGNvZGUgMVxuICAgIHJldHVybiB0aGlzLmRpc3BsYXlQcm94eS5nZXRSZWdpc3RyeSgpXG4gIH1cblxuICAvKipcbiAgICogRmx1c2ggYW5kIHJlc29sdmUgb25jZSBhbGwgcmVxdWVzdHMgaGF2ZSBiZWVuIHByb2Nlc3NlZCBieSB0aGUgc2VydmVyLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlPG51bWJlcj59XG4gICAqL1xuICBhc3luYyByb3VuZHRyaXAgKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGNvbnN0IHN5bmNDYWxsYmFjayA9IHRoaXMuc3luYygpXG4gICAgICBzeW5jQ2FsbGJhY2subGlzdGVuZXIgPSByZXNvbHZlXG4gICAgICB0aGlzLmNvbm5lY3Rpb24uZmx1c2goKVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtQcm94eX1wcm94eVxuICAgKiBAcGFyYW0ge251bWJlcn1jb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nfW1lc3NhZ2VcbiAgICogQG92ZXJyaWRlXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBlcnJvciAocHJveHksIGNvZGUsIG1lc3NhZ2UpIHtcbiAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpXG4gICAgdGhpcy5jbG9zZSgpXG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7V2xDYWxsYmFja1Byb3h5fVxuICAgKi9cbiAgc3luYyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGxheVByb3h5LnN5bmMoKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7bnVtYmVyfWlkXG4gICAqIEBvdmVycmlkZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGVsZXRlSWQgKGlkKSB7XG4gICAgLy8gVE9ETyBvYmplY3QgaWQgcmVjeWNsaW5nP1xuICB9XG59XG4iLCJpbXBvcnQgeyBXZWJGRCB9IGZyb20gJ3dlc3RmaWVsZC1ydW50aW1lLWNvbW1vbidcblxuLy8gVE9ETyBUaGlzIGlzIGN1cnJlbnRseSBhIGxpdGVyYWwgY29weSBvZiB0aGUgc2VydmVyIGltcGxlbWVudGF0aW9uLiBEbyBhbGwgdXNlIGNhc2VzIG1hdGNoIDFvMSBhbmQgY2FuIHdlIHVzZSBhIHNpbmdsZSBjb21tb24gY29kZSBiYXNlIGJldHdlZW4gY2xpZW50ICYgc2VydmVyIGZvciBXZWJGUz9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYkZTIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfWZkRG9tYWluVVVJRFxuICAgKiBAcmV0dXJuIHtXZWJGU31cbiAgICovXG4gIHN0YXRpYyBjcmVhdGUgKGZkRG9tYWluVVVJRCkge1xuICAgIHJldHVybiBuZXcgV2ViRlMoZmREb21haW5VVUlEKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfWZkRG9tYWluVVVJRFxuICAgKi9cbiAgY29uc3RydWN0b3IgKGZkRG9tYWluVVVJRCkge1xuICAgIC8qKlxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9mZERvbWFpblVVSUQgPSBmZERvbWFpblVVSURcbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0LjxudW1iZXIsV2ViRkQ+fVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fd2ViRkRzID0ge31cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fbmV4dEZEID0gMFxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ9IGFycmF5QnVmZmVyXG4gICAqIEByZXR1cm4ge1dlYkZEfVxuICAgKi9cbiAgZnJvbUFycmF5QnVmZmVyIChhcnJheUJ1ZmZlcikge1xuICAgIGNvbnN0IGZkID0gdGhpcy5fbmV4dEZEKytcbiAgICAvLyBGSVhNRSB3ZSB3YW50IHRvIHVzZSByZWZlcmVuY2UgY291bnRpbmcgaGVyZSBpbnN0ZWFkIG9mIHNpbXBseSBkZWxldGluZy5cbiAgICAvLyBTZW5kaW5nIHRoZSBXZWJGRCB0byBhbiBlbmRwb2ludCB3aWxsIGluY3JlYXNlIHRoZSByZWYsIGFuZCB3ZSBzaG91bGQgd2FpdCB1bnRpbCB0aGUgZW5kcG9pbnQgaGFzIGNsb3NlZCB0aGUgZmQgYXMgd2VsbC5cbiAgICBjb25zdCB3ZWJGRCA9IG5ldyBXZWJGRChmZCwgJ0FycmF5QnVmZmVyJywgdGhpcy5fZmREb21haW5VVUlELCAoKSA9PiBQcm9taXNlLnJlc29sdmUoYXJyYXlCdWZmZXIpLCAoKSA9PiB7IGRlbGV0ZSB0aGlzLl93ZWJGRHNbZmRdIH0pXG4gICAgdGhpcy5fd2ViRkRzW2ZkXSA9IHdlYkZEXG4gICAgcmV0dXJuIHdlYkZEXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtJbWFnZUJpdG1hcH1pbWFnZUJpdG1hcFxuICAgKiBAcmV0dXJuIHtXZWJGRH1cbiAgICovXG4gIGZyb21JbWFnZUJpdG1hcCAoaW1hZ2VCaXRtYXApIHtcbiAgICBjb25zdCBmZCA9IHRoaXMuX25leHRGRCsrXG4gICAgY29uc3Qgd2ViRkQgPSBuZXcgV2ViRkQoZmQsICdJbWFnZUJpdG1hcCcsIHRoaXMuX2ZkRG9tYWluVVVJRCwgKCkgPT4gUHJvbWlzZS5yZXNvbHZlKGltYWdlQml0bWFwKSwgKCkgPT4geyBkZWxldGUgdGhpcy5fd2ViRkRzW2ZkXSB9KVxuICAgIHRoaXMuX3dlYkZEc1tmZF0gPSB3ZWJGRFxuICAgIHJldHVybiB3ZWJGRFxuICB9XG5cbiAgLy8gVE9ETyBmcm9tTWVzc2FnZVBvcnRcblxuICAvKipcbiAgICogQHBhcmFtIHtudW1iZXJ9ZmRcbiAgICogQHJldHVybiB7V2ViRkR9XG4gICAqL1xuICBnZXRXZWJGRCAoZmQpIHtcbiAgICByZXR1cm4gdGhpcy5fd2ViRkRzW2ZkXVxuICB9XG59XG4iLCIvKlxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDE3IEVyaWsgRGUgUmlqY2tlXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuICBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbiAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuKi9cbid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgeyBXbE9iamVjdCB9IGZyb20gJ3dlc3RmaWVsZC1ydW50aW1lLWNvbW1vbidcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJveHkgZXh0ZW5kcyBXbE9iamVjdCB7XG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge0Rpc3BsYXl9IGRpc3BsYXlcbiAgICogQHBhcmFtIHtudW1iZXJ9aWRcbiAgICovXG4gIGNvbnN0cnVjdG9yIChkaXNwbGF5LCBpZCkge1xuICAgIHN1cGVyKGlkKVxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtEaXNwbGF5fVxuICAgICAqL1xuICAgIHRoaXMuZGlzcGxheSA9IGRpc3BsYXlcbiAgICB0aGlzLmRpc3BsYXkucmVnaXN0ZXJQcm94eSh0aGlzKVxuICB9XG59XG4iLCIvKlxuICpcbiAqICAgICAgICBDb3B5cmlnaHQgwqkgMjAxOSBFcmlrIERlIFJpamNrZVxuICpcbiAqICAgICAgICBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogICAgICAgIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzXG4gKiAgICAgICAgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogICAgICAgIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiAgICAgICAgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqICAgICAgICBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogICAgICAgIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqICAgICAgICBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSAoaW5jbHVkaW5nIHRoZVxuICogICAgICAgIG5leHQgcGFyYWdyYXBoKSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsXG4gKiAgICAgICAgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqICAgICAgICBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogICAgICAgIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuICogICAgICAgIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG4gKiAgICAgICAgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSU1xuICogICAgICAgIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTlxuICogICAgICAgIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOXG4gKiAgICAgICAgQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuICogICAgICAgIFNPRlRXQVJFLlxuICogICAgXG4gKi9cblxuLyoqXG4gKiBAaW50ZXJmYWNlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYkFycmF5QnVmZmVyRXZlbnRzIHtcblxuXHQvKipcblx0ICpcblx0ICogICAgICAgICAgICAgICAgRGV0YWNoZXMgdGhlIGFzc29jaWF0ZWQgSFRNTDUgYXJyYXkgYnVmZmVyIGZyb20gdGhlIGNvbXBvc2l0b3IgYW5kIHJldHVybnMgaXQgdG8gdGhlIGNsaWVudC5cblx0ICogICAgICAgICAgICAgICAgTm8gYWN0aW9uIGlzIGV4cGVjdGVkIGZvciB0aGlzIGV2ZW50LiBJdCBtZXJlbHkgZnVuY3Rpb25zIGFzIGEgSFRNTDUgYXJyYXkgYnVmZmVyIG93bmVyc2hpcFxuXHQgKiAgICAgICAgICAgICAgICB0cmFuc2ZlciBmcm9tIG1haW4gdGhyZWFkIHRvIHdlYi13b3JrZXIuXG5cdCAqICAgICAgICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7V2ViRkR9IGFycmF5QnVmZmVyIEhUTUw1IGFycmF5IGJ1ZmZlciB0byBkZXRhY2ggZnJvbSB0aGUgY29tcG9zaXRvciBcblx0ICpcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdGRldGFjaChhcnJheUJ1ZmZlcikge31cbn1cblxuIiwiLypcbiAqXG4gKiAgICAgICAgQ29weXJpZ2h0IMKpIDIwMTkgRXJpayBEZSBSaWpja2VcbiAqXG4gKiAgICAgICAgUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqICAgICAgICBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlc1xuICogICAgICAgICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqICAgICAgICBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogICAgICAgIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiAgICAgICAgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqICAgICAgICBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiAgICAgICAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2UgKGluY2x1ZGluZyB0aGVcbiAqICAgICAgICBuZXh0IHBhcmFncmFwaCkgc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbFxuICogICAgICAgIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiAgICAgICAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqICAgICAgICBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0ZcbiAqICAgICAgICBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuICogICAgICAgIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlNcbiAqICAgICAgICBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU5cbiAqICAgICAgICBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTlxuICogICAgICAgIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbiAqICAgICAgICBTT0ZUV0FSRS5cbiAqICAgIFxuICovXG5cbmltcG9ydCB7IENvbm5lY3Rpb24gfSBmcm9tICd3ZXN0ZmllbGQtcnVudGltZS1jb21tb24nXG5jb25zdCB7IHVpbnQsIHVpbnRPcHRpb25hbCwgaW50LCBpbnRPcHRpb25hbCwgZml4ZWQsIFxuXHRmaXhlZE9wdGlvbmFsLCBvYmplY3QsIG9iamVjdE9wdGlvbmFsLCBuZXdPYmplY3QsIHN0cmluZywgXG5cdHN0cmluZ09wdGlvbmFsLCBhcnJheSwgYXJyYXlPcHRpb25hbCwgXG5cdGZpbGVEZXNjcmlwdG9yT3B0aW9uYWwsIGZpbGVEZXNjcmlwdG9yLCBcbmgsIHUsIGksIGYsIG8sIG4sIHMsIGEgfSA9IENvbm5lY3Rpb25cbmltcG9ydCBQcm94eSBmcm9tICcuL1Byb3h5J1xuY2xhc3MgV2ViQXJyYXlCdWZmZXJQcm94eSBleHRlbmRzIFByb3h5IHtcblxuXHQvKipcblx0ICpcblx0ICogICAgICAgICAgICAgICAgQXR0YWNoZXMgdGhlIGFzc29jaWF0ZWQgSFRNTDUgYXJyYXkgYnVmZmVyIHRvIHRoZSBjb21wb3NpdG9yLiBUaGUgYXJyYXkgYnVmZmVyIHNob3VsZCBiZSB0aGUgc2FtZVxuXHQgKiAgICAgICAgICAgICAgICBvYmplY3QgYXMgdGhlIG9uZSB1c2VkIHRvIGNyZWF0ZSB0aGlzIGJ1ZmZlci4gTm8gYWN0aW9uIGlzIGV4cGVjdGVkIGZvciB0aGlzIHJlcXVlc3QuIEl0IG1lcmVseVxuXHQgKiAgICAgICAgICAgICAgICBmdW5jdGlvbnMgYXMgYSBIVE1MNSBhcnJheSBidWZmZXIgb3duZXJzaGlwIHRyYW5zZmVyIGZyb20gd2ViLXdvcmtlciB0byBtYWluIHRocmVhZC5cblx0ICogICAgICAgICAgICBcblx0ICpcblx0ICogQHBhcmFtIHtXZWJGRH0gYXJyYXlCdWZmZXIgSFRNTDUgYXJyYXkgYnVmZmVyIHRvIGF0dGFjaCB0byB0aGUgY29tcG9zaXRvci4gXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRhdHRhY2ggKGFycmF5QnVmZmVyKSB7XG5cdFx0dGhpcy5kaXNwbGF5Lm1hcnNoYWxsKHRoaXMuaWQsIDAsIFtmaWxlRGVzY3JpcHRvcihhcnJheUJ1ZmZlcildKVxuXHR9XG5cbi8qKlxuXHQgKkBwYXJhbSB7RGlzcGxheX1kaXNwbGF5XG5cdCAqQHBhcmFtIHtudW1iZXJ9aWRcblx0ICovXG5cdGNvbnN0cnVjdG9yIChkaXNwbGF5LCBpZCkge1xuXHRcdHN1cGVyKGRpc3BsYXksIGlkKVxuXHRcdC8qKlxuXHRcdCAqIEB0eXBlIHtXZWJBcnJheUJ1ZmZlckV2ZW50c3xudWxsfVxuXHRcdCAqL1xuXHRcdHRoaXMubGlzdGVuZXIgPSBudWxsXG5cdH1cblxuXHRhc3luYyBbMF0gKG1lc3NhZ2UpIHtcblx0XHRhd2FpdCB0aGlzLmxpc3RlbmVyLmRldGFjaChoKG1lc3NhZ2UpKVxuXHR9XG5cbn1cbldlYkFycmF5QnVmZmVyUHJveHkucHJvdG9jb2xOYW1lID0gJ3dlYl9hcnJheV9idWZmZXInXG5cbmV4cG9ydCBkZWZhdWx0IFdlYkFycmF5QnVmZmVyUHJveHlcbiIsIi8qXG4gKlxuICogICAgICAgIENvcHlyaWdodCDCqSAyMDE5IEVyaWsgRGUgUmlqY2tlXG4gKlxuICogICAgICAgIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiAgICAgICAgb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXNcbiAqICAgICAgICAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiAgICAgICAgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqICAgICAgICBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogICAgICAgIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiAgICAgICAgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogICAgICAgIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIChpbmNsdWRpbmcgdGhlXG4gKiAgICAgICAgbmV4dCBwYXJhZ3JhcGgpIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWxcbiAqICAgICAgICBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogICAgICAgIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiAgICAgICAgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4gKiAgICAgICAgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbiAqICAgICAgICBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTXG4gKiAgICAgICAgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOXG4gKiAgICAgICAgQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU5cbiAqICAgICAgICBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4gKiAgICAgICAgU09GVFdBUkUuXG4gKiAgICBcbiAqL1xuXG4vKipcbiAqIEBpbnRlcmZhY2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2ViU2htRXZlbnRzIHtcblxuXHQvKipcblx0ICpcblx0ICogICAgICAgICAgICAgICAgSW5mb3JtcyB0aGUgY2xpZW50IGFib3V0IGEgdmFsaWQgcGl4ZWwgZm9ybWF0IHRoYXRcblx0ICogICAgICAgICAgICAgICAgY2FuIGJlIHVzZWQgZm9yIGJ1ZmZlcnMuIEtub3duIGZvcm1hdHMgaW5jbHVkZVxuXHQgKiAgICAgICAgICAgICAgICBhcmdiODg4OCBhbmQgeHJnYjg4ODguXG5cdCAqICAgICAgICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBmb3JtYXQgYnVmZmVyIHBpeGVsIGZvcm1hdCBcblx0ICpcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdGZvcm1hdChmb3JtYXQpIHt9XG59XG5cbiIsIi8qXG4gKlxuICogICAgICAgIENvcHlyaWdodCDCqSAyMDE5IEVyaWsgRGUgUmlqY2tlXG4gKlxuICogICAgICAgIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiAgICAgICAgb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXNcbiAqICAgICAgICAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiAgICAgICAgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqICAgICAgICBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogICAgICAgIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiAgICAgICAgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogICAgICAgIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIChpbmNsdWRpbmcgdGhlXG4gKiAgICAgICAgbmV4dCBwYXJhZ3JhcGgpIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWxcbiAqICAgICAgICBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogICAgICAgIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiAgICAgICAgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4gKiAgICAgICAgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbiAqICAgICAgICBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTXG4gKiAgICAgICAgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOXG4gKiAgICAgICAgQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU5cbiAqICAgICAgICBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4gKiAgICAgICAgU09GVFdBUkUuXG4gKiAgICBcbiAqL1xuXG5pbXBvcnQgeyBDb25uZWN0aW9uIH0gZnJvbSAnd2VzdGZpZWxkLXJ1bnRpbWUtY29tbW9uJ1xuY29uc3QgeyB1aW50LCB1aW50T3B0aW9uYWwsIGludCwgaW50T3B0aW9uYWwsIGZpeGVkLCBcblx0Zml4ZWRPcHRpb25hbCwgb2JqZWN0LCBvYmplY3RPcHRpb25hbCwgbmV3T2JqZWN0LCBzdHJpbmcsIFxuXHRzdHJpbmdPcHRpb25hbCwgYXJyYXksIGFycmF5T3B0aW9uYWwsIFxuXHRmaWxlRGVzY3JpcHRvck9wdGlvbmFsLCBmaWxlRGVzY3JpcHRvciwgXG5oLCB1LCBpLCBmLCBvLCBuLCBzLCBhIH0gPSBDb25uZWN0aW9uXG5pbXBvcnQgUHJveHkgZnJvbSAnLi9Qcm94eSdcbmltcG9ydCBXZWJBcnJheUJ1ZmZlclByb3h5IGZyb20gJy4vV2ViQXJyYXlCdWZmZXJQcm94eSdcbmltcG9ydCBXbEJ1ZmZlclByb3h5IGZyb20gJy4vV2xCdWZmZXJQcm94eSdcblxuLyoqXG4gKlxuICogICAgICAgICAgICBBIHNpbmdsZXRvbiBnbG9iYWwgb2JqZWN0IHRoYXQgcHJvdmlkZXMgc3VwcG9ydCBmb3Igc2hhcmVkXG4gKiAgICAgICAgICAgIG1lbW9yeS5cbiAqXG4gKiAgICAgICAgICAgIENsaWVudHMgY2FuIGNyZWF0ZSB3bF9idWZmZXIgb2JqZWN0cyB1c2luZyB0aGUgY3JlYXRlX2J1ZmZlclxuICogICAgICAgICAgICByZXF1ZXN0LlxuICpcbiAqICAgICAgICAgICAgQXQgY29ubmVjdGlvbiBzZXR1cCB0aW1lLCB0aGUgd2ViX3NobSBvYmplY3QgZW1pdHMgb25lIG9yIG1vcmVcbiAqICAgICAgICAgICAgZm9ybWF0IGV2ZW50cyB0byBpbmZvcm0gY2xpZW50cyBhYm91dCB0aGUgdmFsaWQgcGl4ZWwgZm9ybWF0c1xuICogICAgICAgICAgICB0aGF0IGNhbiBiZSB1c2VkIGZvciBidWZmZXJzLlxuICogICAgICAgIFxuICovXG5jbGFzcyBXZWJTaG1Qcm94eSBleHRlbmRzIFByb3h5IHtcblxuXHQvKipcblx0ICpcblx0ICogICAgICAgICAgICAgICAgQ3JlYXRlIGEgd2ViX2FycmF5X2J1ZmZlciBvYmplY3QuXG5cdCAqXG5cdCAqICAgICAgICAgICAgICAgIFRoZSBidWZmZXIgaXMgY3JlYXRlZCB1c2luZyBhbiBIVE1MNSBhcnJheSBidWZmZXIgYXMgdGhlIGZkIGFyZ3VtZW50XG5cdCAqICAgICAgICAgICAgICAgIGFuZCB3aWR0aCBhbmQgaGVpZ2h0IGFzIHNwZWNpZmllZC4gVGhlIHN0cmlkZSBhcmd1bWVudCBzcGVjaWZpZXNcblx0ICogICAgICAgICAgICAgICAgdGhlIG51bWJlciBvZiBieXRlcyBmcm9tIHRoZSBiZWdpbm5pbmcgb2Ygb25lIHJvdyB0byB0aGUgYmVnaW5uaW5nXG5cdCAqICAgICAgICAgICAgICAgIG9mIHRoZSBuZXh0LiBUaGUgZm9ybWF0IGlzIHRoZSBwaXhlbCBmb3JtYXQgb2YgdGhlIGJ1ZmZlciBhbmRcblx0ICogICAgICAgICAgICAgICAgbXVzdCBiZSBvbmUgb2YgdGhvc2UgYWR2ZXJ0aXNlZCB0aHJvdWdoIHRoZSB3ZWJfc2htLmZvcm1hdCBldmVudC5cblx0ICpcblx0ICogICAgICAgICAgICAgICAgQ3JlYXRpbmcgYSBidWZmZXIgd2l0aCBhbiBIVE1MNSBhcnJheSBidWZmZXIgYXMgdGhlIGZkIGFyZ3VtZW50XG5cdCAqICAgICAgICAgICAgICAgIHdpbGwgYXR0YWNoIHRoZSBhcnJheSBidWZmZXIgdG8gdGhlIGNvbXBvc2l0b3IgYW5kIGFzIHN1Y2ggaXQgY2FuIG5vdCBiZSB1c2VkXG5cdCAqICAgICAgICAgICAgICAgIGJ5IHRoZSBjbGllbnQgdW50aWwgdGhlIGNvbXBvc2l0b3IgZGV0YWNoZXMgaXQuIEFzIHN1Y2ggY2xpZW50cyBzaG91bGRcblx0ICogICAgICAgICAgICAgICAgd2FpdCBmb3IgdGhlIGNvbXBvc2l0b3IgdG8gZW1pdCB0aGUgd2ViX2FycmF5X2J1ZmZlciBkZXRhY2ggZXZlbnRcblx0ICogICAgICAgICAgICAgICAgYmVmb3JlIHVzaW5nIHRoZSBhcnJheSBidWZmZXIgYWdhaW4uXG5cdCAqXG5cdCAqICAgICAgICAgICAgICAgIEEgY29tcG9zaXRvciB3aWxsIGVtaXQgdGhlIGRldGFjaCBldmVudCBpbiBjb25qdW5jdGlvbiB3aXRoIGEgd2xfYnVmZmVyIHJlbGVhc2UgZXZlbnQuXG5cdCAqICAgICAgICAgICAgICAgIENsaWVudHMgc2hvdWxkIHRoZXJlZm9yZSBvbmx5IGNyZWF0ZSBhIHdlYl9hcnJheV9idWZmZXIgYWZ0ZXIgYWxsIGRhdGEgaXMgd3JpdHRlbiB0b1xuXHQgKiAgICAgICAgICAgICAgICB0aGUgSFRNTDUgYXJyYXkgYnVmZmVyLCBhZnRlciB3aGljaCBpdCBzaG91bGQgYmUgaW1tZWRpYXRlbHkgYXR0YWNoK2NvbW1pdCB0byBhIHN1cmZhY2UuXG5cdCAqICAgICAgICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7V2ViRkR9IGFycmF5QnVmZmVyIGZpbGUgZGVzY3JpcHRvciBmb3Igc2hhcmVkIG1lbW9yeSBvZiB0aGUgYnVmZmVyIFxuXHQgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggYnVmZmVyIHdpZHRoLCBpbiBwaXhlbHMgXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgYnVmZmVyIGhlaWdodCwgaW4gcGl4ZWxzIFxuXHQgKiBAcmV0dXJuIHtXZWJBcnJheUJ1ZmZlclByb3h5fSBhcnJheSBidWZmZXIgdG8gY3JlYXRlIFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0Y3JlYXRlV2ViQXJyYXlCdWZmZXIgKGFycmF5QnVmZmVyLCB3aWR0aCwgaGVpZ2h0KSB7XG5cdFx0cmV0dXJuIHRoaXMuZGlzcGxheS5tYXJzaGFsbENvbnN0cnVjdG9yKHRoaXMuaWQsIDAsIFdlYkFycmF5QnVmZmVyUHJveHksIFtuZXdPYmplY3QoKSwgZmlsZURlc2NyaXB0b3IoYXJyYXlCdWZmZXIpLCBpbnQod2lkdGgpLCBpbnQoaGVpZ2h0KV0pXG5cdH1cblxuXHQvKipcblx0ICpcblx0ICogICAgICAgICAgICAgICAgQ3JlYXRlIGEgd2xfYnVmZmVyIG9iamVjdCBmcm9tIGEgd2ViX2FycmF5X2J1ZmZlciBzbyBpdCBjYW4gYmUgdXNlZCB3aXRoIGEgc3VyZmFjZS5cblx0ICogICAgICAgICAgICBcblx0ICpcblx0ICogQHBhcmFtIHsqfSB3ZWJBcnJheUJ1ZmZlciB3ZWJfYXJyYXlfYnVmZmVyIHRvIHdyYXAgXG5cdCAqIEByZXR1cm4ge1dsQnVmZmVyUHJveHl9IGJ1ZmZlciB0byBjcmVhdGUgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRjcmVhdGVCdWZmZXIgKHdlYkFycmF5QnVmZmVyKSB7XG5cdFx0cmV0dXJuIHRoaXMuZGlzcGxheS5tYXJzaGFsbENvbnN0cnVjdG9yKHRoaXMuaWQsIDEsIFdsQnVmZmVyUHJveHksIFtuZXdPYmplY3QoKSwgb2JqZWN0KHdlYkFycmF5QnVmZmVyKV0pXG5cdH1cblxuLyoqXG5cdCAqQHBhcmFtIHtEaXNwbGF5fWRpc3BsYXlcblx0ICpAcGFyYW0ge251bWJlcn1pZFxuXHQgKi9cblx0Y29uc3RydWN0b3IgKGRpc3BsYXksIGlkKSB7XG5cdFx0c3VwZXIoZGlzcGxheSwgaWQpXG5cdFx0LyoqXG5cdFx0ICogQHR5cGUge1dlYlNobUV2ZW50c3xudWxsfVxuXHRcdCAqL1xuXHRcdHRoaXMubGlzdGVuZXIgPSBudWxsXG5cdH1cblxufVxuV2ViU2htUHJveHkucHJvdG9jb2xOYW1lID0gJ3dlYl9zaG0nXG5cbmV4cG9ydCBkZWZhdWx0IFdlYlNobVByb3h5XG4iLCIvKlxuICpcbiAqICAgIENvcHlyaWdodCDCqSAyMDA4LTIwMTEgS3Jpc3RpYW4gSMO4Z3NiZXJnXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMC0yMDExIEludGVsIENvcnBvcmF0aW9uXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMi0yMDEzIENvbGxhYm9yYSwgTHRkLlxuICpcbiAqICAgIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiAgICBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlc1xuICogICAgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogICAgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqICAgIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiAgICBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogICAgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogICAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2UgKGluY2x1ZGluZyB0aGVcbiAqICAgIG5leHQgcGFyYWdyYXBoKSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsXG4gKiAgICBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogICAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqICAgIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuICogICAgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbiAqICAgIE5PTklORlJJTkdFTUVOVC4gIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTXG4gKiAgICBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU5cbiAqICAgIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOXG4gKiAgICBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4gKiAgICBTT0ZUV0FSRS5cbiAqICBcbiAqL1xuXG4vKipcbiAqIEBpbnRlcmZhY2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2xCdWZmZXJFdmVudHMge1xuXG5cdC8qKlxuXHQgKlxuXHQgKlx0U2VudCB3aGVuIHRoaXMgd2xfYnVmZmVyIGlzIG5vIGxvbmdlciB1c2VkIGJ5IHRoZSBjb21wb3NpdG9yLlxuXHQgKlx0VGhlIGNsaWVudCBpcyBub3cgZnJlZSB0byByZXVzZSBvciBkZXN0cm95IHRoaXMgYnVmZmVyIGFuZCBpdHNcblx0ICpcdGJhY2tpbmcgc3RvcmFnZS5cblx0ICpcblx0ICpcdElmIGEgY2xpZW50IHJlY2VpdmVzIGEgcmVsZWFzZSBldmVudCBiZWZvcmUgdGhlIGZyYW1lIGNhbGxiYWNrXG5cdCAqXHRyZXF1ZXN0ZWQgaW4gdGhlIHNhbWUgd2xfc3VyZmFjZS5jb21taXQgdGhhdCBhdHRhY2hlcyB0aGlzXG5cdCAqXHR3bF9idWZmZXIgdG8gYSBzdXJmYWNlLCB0aGVuIHRoZSBjbGllbnQgaXMgaW1tZWRpYXRlbHkgZnJlZSB0b1xuXHQgKlx0cmV1c2UgdGhlIGJ1ZmZlciBhbmQgaXRzIGJhY2tpbmcgc3RvcmFnZSwgYW5kIGRvZXMgbm90IG5lZWQgYVxuXHQgKlx0c2Vjb25kIGJ1ZmZlciBmb3IgdGhlIG5leHQgc3VyZmFjZSBjb250ZW50IHVwZGF0ZS4gVHlwaWNhbGx5XG5cdCAqXHR0aGlzIGlzIHBvc3NpYmxlLCB3aGVuIHRoZSBjb21wb3NpdG9yIG1haW50YWlucyBhIGNvcHkgb2YgdGhlXG5cdCAqXHR3bF9zdXJmYWNlIGNvbnRlbnRzLCBlLmcuIGFzIGEgR0wgdGV4dHVyZS4gVGhpcyBpcyBhbiBpbXBvcnRhbnRcblx0ICpcdG9wdGltaXphdGlvbiBmb3IgR0woRVMpIGNvbXBvc2l0b3JzIHdpdGggd2xfc2htIGNsaWVudHMuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRyZWxlYXNlKCkge31cbn1cblxuIiwiLypcbiAqXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAwOC0yMDExIEtyaXN0aWFuIEjDuGdzYmVyZ1xuICogICAgQ29weXJpZ2h0IMKpIDIwMTAtMjAxMSBJbnRlbCBDb3Jwb3JhdGlvblxuICogICAgQ29weXJpZ2h0IMKpIDIwMTItMjAxMyBDb2xsYWJvcmEsIEx0ZC5cbiAqXG4gKiAgICBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogICAgb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXNcbiAqICAgICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqICAgIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiAgICBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogICAgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqICAgIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqICAgIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIChpbmNsdWRpbmcgdGhlXG4gKiAgICBuZXh0IHBhcmFncmFwaCkgc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbFxuICogICAgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqICAgIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiAgICBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0ZcbiAqICAgIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG4gKiAgICBOT05JTkZSSU5HRU1FTlQuICBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSU1xuICogICAgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOXG4gKiAgICBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTlxuICogICAgQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuICogICAgU09GVFdBUkUuXG4gKiAgXG4gKi9cblxuaW1wb3J0IHsgQ29ubmVjdGlvbiB9IGZyb20gJ3dlc3RmaWVsZC1ydW50aW1lLWNvbW1vbidcbmNvbnN0IHsgdWludCwgdWludE9wdGlvbmFsLCBpbnQsIGludE9wdGlvbmFsLCBmaXhlZCwgXG5cdGZpeGVkT3B0aW9uYWwsIG9iamVjdCwgb2JqZWN0T3B0aW9uYWwsIG5ld09iamVjdCwgc3RyaW5nLCBcblx0c3RyaW5nT3B0aW9uYWwsIGFycmF5LCBhcnJheU9wdGlvbmFsLCBcblx0ZmlsZURlc2NyaXB0b3JPcHRpb25hbCwgZmlsZURlc2NyaXB0b3IsIFxuaCwgdSwgaSwgZiwgbywgbiwgcywgYSB9ID0gQ29ubmVjdGlvblxuaW1wb3J0IFByb3h5IGZyb20gJy4vUHJveHknXG5cbi8qKlxuICpcbiAqICAgICAgQSBidWZmZXIgcHJvdmlkZXMgdGhlIGNvbnRlbnQgZm9yIGEgd2xfc3VyZmFjZS4gQnVmZmVycyBhcmVcbiAqICAgICAgY3JlYXRlZCB0aHJvdWdoIGZhY3RvcnkgaW50ZXJmYWNlcyBzdWNoIGFzIHdsX2RybSwgd2xfc2htIG9yXG4gKiAgICAgIHNpbWlsYXIuIEl0IGhhcyBhIHdpZHRoIGFuZCBhIGhlaWdodCBhbmQgY2FuIGJlIGF0dGFjaGVkIHRvIGFcbiAqICAgICAgd2xfc3VyZmFjZSwgYnV0IHRoZSBtZWNoYW5pc20gYnkgd2hpY2ggYSBjbGllbnQgcHJvdmlkZXMgYW5kXG4gKiAgICAgIHVwZGF0ZXMgdGhlIGNvbnRlbnRzIGlzIGRlZmluZWQgYnkgdGhlIGJ1ZmZlciBmYWN0b3J5IGludGVyZmFjZS5cbiAqICAgIFxuICovXG5jbGFzcyBXbEJ1ZmZlclByb3h5IGV4dGVuZHMgUHJveHkge1xuXG5cdC8qKlxuXHQgKlxuXHQgKlx0RGVzdHJveSBhIGJ1ZmZlci4gSWYgYW5kIGhvdyB5b3UgbmVlZCB0byByZWxlYXNlIHRoZSBiYWNraW5nXG5cdCAqXHRzdG9yYWdlIGlzIGRlZmluZWQgYnkgdGhlIGJ1ZmZlciBmYWN0b3J5IGludGVyZmFjZS5cblx0ICpcblx0ICpcdEZvciBwb3NzaWJsZSBzaWRlLWVmZmVjdHMgdG8gYSBzdXJmYWNlLCBzZWUgd2xfc3VyZmFjZS5hdHRhY2guXG5cdCAqICAgICAgXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRkZXN0cm95ICgpIHtcblx0XHR0aGlzLmRpc3BsYXkubWFyc2hhbGwodGhpcy5pZCwgMCwgW10pXG5cdH1cblxuLyoqXG5cdCAqQHBhcmFtIHtEaXNwbGF5fWRpc3BsYXlcblx0ICpAcGFyYW0ge251bWJlcn1pZFxuXHQgKi9cblx0Y29uc3RydWN0b3IgKGRpc3BsYXksIGlkKSB7XG5cdFx0c3VwZXIoZGlzcGxheSwgaWQpXG5cdFx0LyoqXG5cdFx0ICogQHR5cGUge1dsQnVmZmVyRXZlbnRzfG51bGx9XG5cdFx0ICovXG5cdFx0dGhpcy5saXN0ZW5lciA9IG51bGxcblx0fVxuXG5cdGFzeW5jIFswXSAobWVzc2FnZSkge1xuXHRcdGF3YWl0IHRoaXMubGlzdGVuZXIucmVsZWFzZSgpXG5cdH1cblxufVxuV2xCdWZmZXJQcm94eS5wcm90b2NvbE5hbWUgPSAnd2xfYnVmZmVyJ1xuXG5leHBvcnQgZGVmYXVsdCBXbEJ1ZmZlclByb3h5XG4iLCIvKlxuICpcbiAqICAgIENvcHlyaWdodCDCqSAyMDA4LTIwMTEgS3Jpc3RpYW4gSMO4Z3NiZXJnXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMC0yMDExIEludGVsIENvcnBvcmF0aW9uXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMi0yMDEzIENvbGxhYm9yYSwgTHRkLlxuICpcbiAqICAgIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiAgICBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlc1xuICogICAgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogICAgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqICAgIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiAgICBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogICAgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogICAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2UgKGluY2x1ZGluZyB0aGVcbiAqICAgIG5leHQgcGFyYWdyYXBoKSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsXG4gKiAgICBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogICAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqICAgIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuICogICAgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbiAqICAgIE5PTklORlJJTkdFTUVOVC4gIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTXG4gKiAgICBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU5cbiAqICAgIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOXG4gKiAgICBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4gKiAgICBTT0ZUV0FSRS5cbiAqICBcbiAqL1xuXG4vKipcbiAqIEBpbnRlcmZhY2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2xDYWxsYmFja0V2ZW50cyB7XG5cblx0LyoqXG5cdCAqXG5cdCAqXHROb3RpZnkgdGhlIGNsaWVudCB3aGVuIHRoZSByZWxhdGVkIHJlcXVlc3QgaXMgZG9uZS5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHtudW1iZXJ9IGNhbGxiYWNrRGF0YSByZXF1ZXN0LXNwZWNpZmljIGRhdGEgZm9yIHRoZSBjYWxsYmFjayBcblx0ICpcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdGRvbmUoY2FsbGJhY2tEYXRhKSB7fVxufVxuXG4iLCIvKlxuICpcbiAqICAgIENvcHlyaWdodCDCqSAyMDA4LTIwMTEgS3Jpc3RpYW4gSMO4Z3NiZXJnXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMC0yMDExIEludGVsIENvcnBvcmF0aW9uXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMi0yMDEzIENvbGxhYm9yYSwgTHRkLlxuICpcbiAqICAgIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiAgICBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlc1xuICogICAgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogICAgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqICAgIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiAgICBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogICAgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogICAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2UgKGluY2x1ZGluZyB0aGVcbiAqICAgIG5leHQgcGFyYWdyYXBoKSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsXG4gKiAgICBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogICAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqICAgIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuICogICAgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbiAqICAgIE5PTklORlJJTkdFTUVOVC4gIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTXG4gKiAgICBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU5cbiAqICAgIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOXG4gKiAgICBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4gKiAgICBTT0ZUV0FSRS5cbiAqICBcbiAqL1xuXG5pbXBvcnQgeyBDb25uZWN0aW9uIH0gZnJvbSAnd2VzdGZpZWxkLXJ1bnRpbWUtY29tbW9uJ1xuY29uc3QgeyB1aW50LCB1aW50T3B0aW9uYWwsIGludCwgaW50T3B0aW9uYWwsIGZpeGVkLCBcblx0Zml4ZWRPcHRpb25hbCwgb2JqZWN0LCBvYmplY3RPcHRpb25hbCwgbmV3T2JqZWN0LCBzdHJpbmcsIFxuXHRzdHJpbmdPcHRpb25hbCwgYXJyYXksIGFycmF5T3B0aW9uYWwsIFxuXHRmaWxlRGVzY3JpcHRvck9wdGlvbmFsLCBmaWxlRGVzY3JpcHRvciwgXG5oLCB1LCBpLCBmLCBvLCBuLCBzLCBhIH0gPSBDb25uZWN0aW9uXG5pbXBvcnQgUHJveHkgZnJvbSAnLi9Qcm94eSdcblxuLyoqXG4gKlxuICogICAgICBDbGllbnRzIGNhbiBoYW5kbGUgdGhlICdkb25lJyBldmVudCB0byBnZXQgbm90aWZpZWQgd2hlblxuICogICAgICB0aGUgcmVsYXRlZCByZXF1ZXN0IGlzIGRvbmUuXG4gKiAgICBcbiAqL1xuY2xhc3MgV2xDYWxsYmFja1Byb3h5IGV4dGVuZHMgUHJveHkge1xuXG4vKipcblx0ICpAcGFyYW0ge0Rpc3BsYXl9ZGlzcGxheVxuXHQgKkBwYXJhbSB7bnVtYmVyfWlkXG5cdCAqL1xuXHRjb25zdHJ1Y3RvciAoZGlzcGxheSwgaWQpIHtcblx0XHRzdXBlcihkaXNwbGF5LCBpZClcblx0XHQvKipcblx0XHQgKiBAdHlwZSB7V2xDYWxsYmFja0V2ZW50c3xudWxsfVxuXHRcdCAqL1xuXHRcdHRoaXMubGlzdGVuZXIgPSBudWxsXG5cdH1cblxuXHRhc3luYyBbMF0gKG1lc3NhZ2UpIHtcblx0XHRhd2FpdCB0aGlzLmxpc3RlbmVyLmRvbmUodShtZXNzYWdlKSlcblx0fVxuXG59XG5XbENhbGxiYWNrUHJveHkucHJvdG9jb2xOYW1lID0gJ3dsX2NhbGxiYWNrJ1xuXG5leHBvcnQgZGVmYXVsdCBXbENhbGxiYWNrUHJveHlcbiIsIi8qXG4gKlxuICogICAgQ29weXJpZ2h0IMKpIDIwMDgtMjAxMSBLcmlzdGlhbiBIw7hnc2JlcmdcbiAqICAgIENvcHlyaWdodCDCqSAyMDEwLTIwMTEgSW50ZWwgQ29ycG9yYXRpb25cbiAqICAgIENvcHlyaWdodCDCqSAyMDEyLTIwMTMgQ29sbGFib3JhLCBMdGQuXG4gKlxuICogICAgUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqICAgIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzXG4gKiAgICAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiAgICBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogICAgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqICAgIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiAgICBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiAgICBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSAoaW5jbHVkaW5nIHRoZVxuICogICAgbmV4dCBwYXJhZ3JhcGgpIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWxcbiAqICAgIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiAgICBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogICAgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4gKiAgICBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuICogICAgTk9OSU5GUklOR0VNRU5ULiAgSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlNcbiAqICAgIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTlxuICogICAgQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU5cbiAqICAgIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbiAqICAgIFNPRlRXQVJFLlxuICogIFxuICovXG5cbmltcG9ydCB7IENvbm5lY3Rpb24gfSBmcm9tICd3ZXN0ZmllbGQtcnVudGltZS1jb21tb24nXG5jb25zdCB7IHVpbnQsIHVpbnRPcHRpb25hbCwgaW50LCBpbnRPcHRpb25hbCwgZml4ZWQsIFxuXHRmaXhlZE9wdGlvbmFsLCBvYmplY3QsIG9iamVjdE9wdGlvbmFsLCBuZXdPYmplY3QsIHN0cmluZywgXG5cdHN0cmluZ09wdGlvbmFsLCBhcnJheSwgYXJyYXlPcHRpb25hbCwgXG5cdGZpbGVEZXNjcmlwdG9yT3B0aW9uYWwsIGZpbGVEZXNjcmlwdG9yLCBcbmgsIHUsIGksIGYsIG8sIG4sIHMsIGEgfSA9IENvbm5lY3Rpb25cbmltcG9ydCBQcm94eSBmcm9tICcuL1Byb3h5J1xuaW1wb3J0IFdsU3VyZmFjZVByb3h5IGZyb20gJy4vV2xTdXJmYWNlUHJveHknXG5pbXBvcnQgV2xSZWdpb25Qcm94eSBmcm9tICcuL1dsUmVnaW9uUHJveHknXG5cbi8qKlxuICpcbiAqICAgICAgQSBjb21wb3NpdG9yLiAgVGhpcyBvYmplY3QgaXMgYSBzaW5nbGV0b24gZ2xvYmFsLiAgVGhlXG4gKiAgICAgIGNvbXBvc2l0b3IgaXMgaW4gY2hhcmdlIG9mIGNvbWJpbmluZyB0aGUgY29udGVudHMgb2YgbXVsdGlwbGVcbiAqICAgICAgc3VyZmFjZXMgaW50byBvbmUgZGlzcGxheWFibGUgb3V0cHV0LlxuICogICAgXG4gKi9cbmNsYXNzIFdsQ29tcG9zaXRvclByb3h5IGV4dGVuZHMgUHJveHkge1xuXG5cdC8qKlxuXHQgKlxuXHQgKlx0QXNrIHRoZSBjb21wb3NpdG9yIHRvIGNyZWF0ZSBhIG5ldyBzdXJmYWNlLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcmV0dXJuIHtXbFN1cmZhY2VQcm94eX0gdGhlIG5ldyBzdXJmYWNlIFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0Y3JlYXRlU3VyZmFjZSAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZGlzcGxheS5tYXJzaGFsbENvbnN0cnVjdG9yKHRoaXMuaWQsIDAsIFdsU3VyZmFjZVByb3h5LCBbbmV3T2JqZWN0KCldKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRBc2sgdGhlIGNvbXBvc2l0b3IgdG8gY3JlYXRlIGEgbmV3IHJlZ2lvbi5cblx0ICogICAgICBcblx0ICpcblx0ICogQHJldHVybiB7V2xSZWdpb25Qcm94eX0gdGhlIG5ldyByZWdpb24gXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRjcmVhdGVSZWdpb24gKCkge1xuXHRcdHJldHVybiB0aGlzLmRpc3BsYXkubWFyc2hhbGxDb25zdHJ1Y3Rvcih0aGlzLmlkLCAxLCBXbFJlZ2lvblByb3h5LCBbbmV3T2JqZWN0KCldKVxuXHR9XG5cbi8qKlxuXHQgKkBwYXJhbSB7RGlzcGxheX1kaXNwbGF5XG5cdCAqQHBhcmFtIHtudW1iZXJ9aWRcblx0ICovXG5cdGNvbnN0cnVjdG9yIChkaXNwbGF5LCBpZCkge1xuXHRcdHN1cGVyKGRpc3BsYXksIGlkKVxuXHRcdC8qKlxuXHRcdCAqIEB0eXBlIHtXbENvbXBvc2l0b3JFdmVudHN8bnVsbH1cblx0XHQgKi9cblx0XHR0aGlzLmxpc3RlbmVyID0gbnVsbFxuXHR9XG5cbn1cbldsQ29tcG9zaXRvclByb3h5LnByb3RvY29sTmFtZSA9ICd3bF9jb21wb3NpdG9yJ1xuXG5leHBvcnQgZGVmYXVsdCBXbENvbXBvc2l0b3JQcm94eVxuIiwiLypcbiAqXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAwOC0yMDExIEtyaXN0aWFuIEjDuGdzYmVyZ1xuICogICAgQ29weXJpZ2h0IMKpIDIwMTAtMjAxMSBJbnRlbCBDb3Jwb3JhdGlvblxuICogICAgQ29weXJpZ2h0IMKpIDIwMTItMjAxMyBDb2xsYWJvcmEsIEx0ZC5cbiAqXG4gKiAgICBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogICAgb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXNcbiAqICAgICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqICAgIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiAgICBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogICAgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqICAgIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqICAgIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIChpbmNsdWRpbmcgdGhlXG4gKiAgICBuZXh0IHBhcmFncmFwaCkgc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbFxuICogICAgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqICAgIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiAgICBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0ZcbiAqICAgIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG4gKiAgICBOT05JTkZSSU5HRU1FTlQuICBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSU1xuICogICAgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOXG4gKiAgICBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTlxuICogICAgQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuICogICAgU09GVFdBUkUuXG4gKiAgXG4gKi9cblxuLyoqXG4gKiBAaW50ZXJmYWNlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdsRGF0YURldmljZUV2ZW50cyB7XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRUaGUgZGF0YV9vZmZlciBldmVudCBpbnRyb2R1Y2VzIGEgbmV3IHdsX2RhdGFfb2ZmZXIgb2JqZWN0LFxuXHQgKlx0d2hpY2ggd2lsbCBzdWJzZXF1ZW50bHkgYmUgdXNlZCBpbiBlaXRoZXIgdGhlXG5cdCAqXHRkYXRhX2RldmljZS5lbnRlciBldmVudCAoZm9yIGRyYWctYW5kLWRyb3ApIG9yIHRoZVxuXHQgKlx0ZGF0YV9kZXZpY2Uuc2VsZWN0aW9uIGV2ZW50IChmb3Igc2VsZWN0aW9ucykuICBJbW1lZGlhdGVseVxuXHQgKlx0Zm9sbG93aW5nIHRoZSBkYXRhX2RldmljZV9kYXRhX29mZmVyIGV2ZW50LCB0aGUgbmV3IGRhdGFfb2ZmZXJcblx0ICpcdG9iamVjdCB3aWxsIHNlbmQgb3V0IGRhdGFfb2ZmZXIub2ZmZXIgZXZlbnRzIHRvIGRlc2NyaWJlIHRoZVxuXHQgKlx0bWltZSB0eXBlcyBpdCBvZmZlcnMuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBpZCB0aGUgbmV3IGRhdGFfb2ZmZXIgb2JqZWN0IFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0ZGF0YU9mZmVyKGlkKSB7fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0VGhpcyBldmVudCBpcyBzZW50IHdoZW4gYW4gYWN0aXZlIGRyYWctYW5kLWRyb3AgcG9pbnRlciBlbnRlcnNcblx0ICpcdGEgc3VyZmFjZSBvd25lZCBieSB0aGUgY2xpZW50LiAgVGhlIHBvc2l0aW9uIG9mIHRoZSBwb2ludGVyIGF0XG5cdCAqXHRlbnRlciB0aW1lIGlzIHByb3ZpZGVkIGJ5IHRoZSB4IGFuZCB5IGFyZ3VtZW50cywgaW4gc3VyZmFjZS1sb2NhbFxuXHQgKlx0Y29vcmRpbmF0ZXMuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBzZXJpYWwgc2VyaWFsIG51bWJlciBvZiB0aGUgZW50ZXIgZXZlbnQgXG5cdCAqIEBwYXJhbSB7Kn0gc3VyZmFjZSBjbGllbnQgc3VyZmFjZSBlbnRlcmVkIFxuXHQgKiBAcGFyYW0ge0ZpeGVkfSB4IHN1cmZhY2UtbG9jYWwgeCBjb29yZGluYXRlIFxuXHQgKiBAcGFyYW0ge0ZpeGVkfSB5IHN1cmZhY2UtbG9jYWwgeSBjb29yZGluYXRlIFxuXHQgKiBAcGFyYW0gez8qfSBpZCBzb3VyY2UgZGF0YV9vZmZlciBvYmplY3QgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRlbnRlcihzZXJpYWwsIHN1cmZhY2UsIHgsIHksIGlkKSB7fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0VGhpcyBldmVudCBpcyBzZW50IHdoZW4gdGhlIGRyYWctYW5kLWRyb3AgcG9pbnRlciBsZWF2ZXMgdGhlXG5cdCAqXHRzdXJmYWNlIGFuZCB0aGUgc2Vzc2lvbiBlbmRzLiAgVGhlIGNsaWVudCBtdXN0IGRlc3Ryb3kgdGhlXG5cdCAqXHR3bF9kYXRhX29mZmVyIGludHJvZHVjZWQgYXQgZW50ZXIgdGltZSBhdCB0aGlzIHBvaW50LlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0bGVhdmUoKSB7fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0VGhpcyBldmVudCBpcyBzZW50IHdoZW4gdGhlIGRyYWctYW5kLWRyb3AgcG9pbnRlciBtb3ZlcyB3aXRoaW5cblx0ICpcdHRoZSBjdXJyZW50bHkgZm9jdXNlZCBzdXJmYWNlLiBUaGUgbmV3IHBvc2l0aW9uIG9mIHRoZSBwb2ludGVyXG5cdCAqXHRpcyBwcm92aWRlZCBieSB0aGUgeCBhbmQgeSBhcmd1bWVudHMsIGluIHN1cmZhY2UtbG9jYWxcblx0ICpcdGNvb3JkaW5hdGVzLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0ge251bWJlcn0gdGltZSB0aW1lc3RhbXAgd2l0aCBtaWxsaXNlY29uZCBncmFudWxhcml0eSBcblx0ICogQHBhcmFtIHtGaXhlZH0geCBzdXJmYWNlLWxvY2FsIHggY29vcmRpbmF0ZSBcblx0ICogQHBhcmFtIHtGaXhlZH0geSBzdXJmYWNlLWxvY2FsIHkgY29vcmRpbmF0ZSBcblx0ICpcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdG1vdGlvbih0aW1lLCB4LCB5KSB7fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0VGhlIGV2ZW50IGlzIHNlbnQgd2hlbiBhIGRyYWctYW5kLWRyb3Agb3BlcmF0aW9uIGlzIGVuZGVkXG5cdCAqXHRiZWNhdXNlIHRoZSBpbXBsaWNpdCBncmFiIGlzIHJlbW92ZWQuXG5cdCAqXG5cdCAqXHRUaGUgZHJhZy1hbmQtZHJvcCBkZXN0aW5hdGlvbiBpcyBleHBlY3RlZCB0byBob25vciB0aGUgbGFzdCBhY3Rpb25cblx0ICpcdHJlY2VpdmVkIHRocm91Z2ggd2xfZGF0YV9vZmZlci5hY3Rpb24sIGlmIHRoZSByZXN1bHRpbmcgYWN0aW9uIGlzXG5cdCAqXHRcImNvcHlcIiBvciBcIm1vdmVcIiwgdGhlIGRlc3RpbmF0aW9uIGNhbiBzdGlsbCBwZXJmb3JtXG5cdCAqXHR3bF9kYXRhX29mZmVyLnJlY2VpdmUgcmVxdWVzdHMsIGFuZCBpcyBleHBlY3RlZCB0byBlbmQgYWxsXG5cdCAqXHR0cmFuc2ZlcnMgd2l0aCBhIHdsX2RhdGFfb2ZmZXIuZmluaXNoIHJlcXVlc3QuXG5cdCAqXG5cdCAqXHRJZiB0aGUgcmVzdWx0aW5nIGFjdGlvbiBpcyBcImFza1wiLCB0aGUgYWN0aW9uIHdpbGwgbm90IGJlIGNvbnNpZGVyZWRcblx0ICpcdGZpbmFsLiBUaGUgZHJhZy1hbmQtZHJvcCBkZXN0aW5hdGlvbiBpcyBleHBlY3RlZCB0byBwZXJmb3JtIG9uZSBsYXN0XG5cdCAqXHR3bF9kYXRhX29mZmVyLnNldF9hY3Rpb25zIHJlcXVlc3QsIG9yIHdsX2RhdGFfb2ZmZXIuZGVzdHJveSBpbiBvcmRlclxuXHQgKlx0dG8gY2FuY2VsIHRoZSBvcGVyYXRpb24uXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRkcm9wKCkge31cblxuXHQvKipcblx0ICpcblx0ICpcdFRoZSBzZWxlY3Rpb24gZXZlbnQgaXMgc2VudCBvdXQgdG8gbm90aWZ5IHRoZSBjbGllbnQgb2YgYSBuZXdcblx0ICpcdHdsX2RhdGFfb2ZmZXIgZm9yIHRoZSBzZWxlY3Rpb24gZm9yIHRoaXMgZGV2aWNlLiAgVGhlXG5cdCAqXHRkYXRhX2RldmljZS5kYXRhX29mZmVyIGFuZCB0aGUgZGF0YV9vZmZlci5vZmZlciBldmVudHMgYXJlXG5cdCAqXHRzZW50IG91dCBpbW1lZGlhdGVseSBiZWZvcmUgdGhpcyBldmVudCB0byBpbnRyb2R1Y2UgdGhlIGRhdGFcblx0ICpcdG9mZmVyIG9iamVjdC4gIFRoZSBzZWxlY3Rpb24gZXZlbnQgaXMgc2VudCB0byBhIGNsaWVudFxuXHQgKlx0aW1tZWRpYXRlbHkgYmVmb3JlIHJlY2VpdmluZyBrZXlib2FyZCBmb2N1cyBhbmQgd2hlbiBhIG5ld1xuXHQgKlx0c2VsZWN0aW9uIGlzIHNldCB3aGlsZSB0aGUgY2xpZW50IGhhcyBrZXlib2FyZCBmb2N1cy4gIFRoZVxuXHQgKlx0ZGF0YV9vZmZlciBpcyB2YWxpZCB1bnRpbCBhIG5ldyBkYXRhX29mZmVyIG9yIE5VTEwgaXMgcmVjZWl2ZWRcblx0ICpcdG9yIHVudGlsIHRoZSBjbGllbnQgbG9zZXMga2V5Ym9hcmQgZm9jdXMuICBUaGUgY2xpZW50IG11c3Rcblx0ICpcdGRlc3Ryb3kgdGhlIHByZXZpb3VzIHNlbGVjdGlvbiBkYXRhX29mZmVyLCBpZiBhbnksIHVwb24gcmVjZWl2aW5nXG5cdCAqXHR0aGlzIGV2ZW50LlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0gez8qfSBpZCBzZWxlY3Rpb24gZGF0YV9vZmZlciBvYmplY3QgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRzZWxlY3Rpb24oaWQpIHt9XG59XG5cbiIsIi8qXG4gKlxuICogICAgQ29weXJpZ2h0IMKpIDIwMDgtMjAxMSBLcmlzdGlhbiBIw7hnc2JlcmdcbiAqICAgIENvcHlyaWdodCDCqSAyMDEwLTIwMTEgSW50ZWwgQ29ycG9yYXRpb25cbiAqICAgIENvcHlyaWdodCDCqSAyMDEyLTIwMTMgQ29sbGFib3JhLCBMdGQuXG4gKlxuICogICAgUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqICAgIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzXG4gKiAgICAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiAgICBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogICAgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqICAgIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiAgICBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiAgICBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSAoaW5jbHVkaW5nIHRoZVxuICogICAgbmV4dCBwYXJhZ3JhcGgpIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWxcbiAqICAgIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiAgICBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogICAgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4gKiAgICBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuICogICAgTk9OSU5GUklOR0VNRU5ULiAgSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlNcbiAqICAgIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTlxuICogICAgQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU5cbiAqICAgIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbiAqICAgIFNPRlRXQVJFLlxuICogIFxuICovXG5cbmltcG9ydCB7IENvbm5lY3Rpb24gfSBmcm9tICd3ZXN0ZmllbGQtcnVudGltZS1jb21tb24nXG5jb25zdCB7IHVpbnQsIHVpbnRPcHRpb25hbCwgaW50LCBpbnRPcHRpb25hbCwgZml4ZWQsIFxuXHRmaXhlZE9wdGlvbmFsLCBvYmplY3QsIG9iamVjdE9wdGlvbmFsLCBuZXdPYmplY3QsIHN0cmluZywgXG5cdHN0cmluZ09wdGlvbmFsLCBhcnJheSwgYXJyYXlPcHRpb25hbCwgXG5cdGZpbGVEZXNjcmlwdG9yT3B0aW9uYWwsIGZpbGVEZXNjcmlwdG9yLCBcbmgsIHUsIGksIGYsIG8sIG4sIHMsIGEgfSA9IENvbm5lY3Rpb25cbmltcG9ydCBQcm94eSBmcm9tICcuL1Byb3h5J1xuaW1wb3J0IFdsRGF0YVNvdXJjZVByb3h5IGZyb20gJy4vV2xEYXRhU291cmNlUHJveHknXG5pbXBvcnQgV2xEYXRhRGV2aWNlUHJveHkgZnJvbSAnLi9XbERhdGFEZXZpY2VQcm94eSdcblxuLyoqXG4gKlxuICogICAgICBUaGUgd2xfZGF0YV9kZXZpY2VfbWFuYWdlciBpcyBhIHNpbmdsZXRvbiBnbG9iYWwgb2JqZWN0IHRoYXRcbiAqICAgICAgcHJvdmlkZXMgYWNjZXNzIHRvIGludGVyLWNsaWVudCBkYXRhIHRyYW5zZmVyIG1lY2hhbmlzbXMgc3VjaCBhc1xuICogICAgICBjb3B5LWFuZC1wYXN0ZSBhbmQgZHJhZy1hbmQtZHJvcC4gIFRoZXNlIG1lY2hhbmlzbXMgYXJlIHRpZWQgdG9cbiAqICAgICAgYSB3bF9zZWF0IGFuZCB0aGlzIGludGVyZmFjZSBsZXRzIGEgY2xpZW50IGdldCBhIHdsX2RhdGFfZGV2aWNlXG4gKiAgICAgIGNvcnJlc3BvbmRpbmcgdG8gYSB3bF9zZWF0LlxuICpcbiAqICAgICAgRGVwZW5kaW5nIG9uIHRoZSB2ZXJzaW9uIGJvdW5kLCB0aGUgb2JqZWN0cyBjcmVhdGVkIGZyb20gdGhlIGJvdW5kXG4gKiAgICAgIHdsX2RhdGFfZGV2aWNlX21hbmFnZXIgb2JqZWN0IHdpbGwgaGF2ZSBkaWZmZXJlbnQgcmVxdWlyZW1lbnRzIGZvclxuICogICAgICBmdW5jdGlvbmluZyBwcm9wZXJseS4gU2VlIHdsX2RhdGFfc291cmNlLnNldF9hY3Rpb25zLFxuICogICAgICB3bF9kYXRhX29mZmVyLmFjY2VwdCBhbmQgd2xfZGF0YV9vZmZlci5maW5pc2ggZm9yIGRldGFpbHMuXG4gKiAgICBcbiAqL1xuY2xhc3MgV2xEYXRhRGV2aWNlTWFuYWdlclByb3h5IGV4dGVuZHMgUHJveHkge1xuXG5cdC8qKlxuXHQgKlxuXHQgKlx0Q3JlYXRlIGEgbmV3IGRhdGEgc291cmNlLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcmV0dXJuIHtXbERhdGFTb3VyY2VQcm94eX0gZGF0YSBzb3VyY2UgdG8gY3JlYXRlIFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0Y3JlYXRlRGF0YVNvdXJjZSAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZGlzcGxheS5tYXJzaGFsbENvbnN0cnVjdG9yKHRoaXMuaWQsIDAsIFdsRGF0YVNvdXJjZVByb3h5LCBbbmV3T2JqZWN0KCldKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRDcmVhdGUgYSBuZXcgZGF0YSBkZXZpY2UgZm9yIGEgZ2l2ZW4gc2VhdC5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHsqfSBzZWF0IHNlYXQgYXNzb2NpYXRlZCB3aXRoIHRoZSBkYXRhIGRldmljZSBcblx0ICogQHJldHVybiB7V2xEYXRhRGV2aWNlUHJveHl9IGRhdGEgZGV2aWNlIHRvIGNyZWF0ZSBcblx0ICpcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdGdldERhdGFEZXZpY2UgKHNlYXQpIHtcblx0XHRyZXR1cm4gdGhpcy5kaXNwbGF5Lm1hcnNoYWxsQ29uc3RydWN0b3IodGhpcy5pZCwgMSwgV2xEYXRhRGV2aWNlUHJveHksIFtuZXdPYmplY3QoKSwgb2JqZWN0KHNlYXQpXSlcblx0fVxuXG4vKipcblx0ICpAcGFyYW0ge0Rpc3BsYXl9ZGlzcGxheVxuXHQgKkBwYXJhbSB7bnVtYmVyfWlkXG5cdCAqL1xuXHRjb25zdHJ1Y3RvciAoZGlzcGxheSwgaWQpIHtcblx0XHRzdXBlcihkaXNwbGF5LCBpZClcblx0XHQvKipcblx0XHQgKiBAdHlwZSB7V2xEYXRhRGV2aWNlTWFuYWdlckV2ZW50c3xudWxsfVxuXHRcdCAqL1xuXHRcdHRoaXMubGlzdGVuZXIgPSBudWxsXG5cdH1cblxufVxuV2xEYXRhRGV2aWNlTWFuYWdlclByb3h5LnByb3RvY29sTmFtZSA9ICd3bF9kYXRhX2RldmljZV9tYW5hZ2VyJ1xuXG5XbERhdGFEZXZpY2VNYW5hZ2VyUHJveHkuRG5kQWN0aW9uID0ge1xuICAvKipcbiAgICogbm8gYWN0aW9uXG4gICAqL1xuICBub25lOiAwLFxuICAvKipcbiAgICogY29weSBhY3Rpb25cbiAgICovXG4gIGNvcHk6IDEsXG4gIC8qKlxuICAgKiBtb3ZlIGFjdGlvblxuICAgKi9cbiAgbW92ZTogMixcbiAgLyoqXG4gICAqIGFzayBhY3Rpb25cbiAgICovXG4gIGFzazogNFxufVxuXG5leHBvcnQgZGVmYXVsdCBXbERhdGFEZXZpY2VNYW5hZ2VyUHJveHlcbiIsIi8qXG4gKlxuICogICAgQ29weXJpZ2h0IMKpIDIwMDgtMjAxMSBLcmlzdGlhbiBIw7hnc2JlcmdcbiAqICAgIENvcHlyaWdodCDCqSAyMDEwLTIwMTEgSW50ZWwgQ29ycG9yYXRpb25cbiAqICAgIENvcHlyaWdodCDCqSAyMDEyLTIwMTMgQ29sbGFib3JhLCBMdGQuXG4gKlxuICogICAgUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqICAgIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzXG4gKiAgICAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiAgICBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogICAgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqICAgIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiAgICBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiAgICBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSAoaW5jbHVkaW5nIHRoZVxuICogICAgbmV4dCBwYXJhZ3JhcGgpIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWxcbiAqICAgIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiAgICBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogICAgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4gKiAgICBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuICogICAgTk9OSU5GUklOR0VNRU5ULiAgSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlNcbiAqICAgIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTlxuICogICAgQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU5cbiAqICAgIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbiAqICAgIFNPRlRXQVJFLlxuICogIFxuICovXG5cbmltcG9ydCB7IENvbm5lY3Rpb24gfSBmcm9tICd3ZXN0ZmllbGQtcnVudGltZS1jb21tb24nXG5jb25zdCB7IHVpbnQsIHVpbnRPcHRpb25hbCwgaW50LCBpbnRPcHRpb25hbCwgZml4ZWQsIFxuXHRmaXhlZE9wdGlvbmFsLCBvYmplY3QsIG9iamVjdE9wdGlvbmFsLCBuZXdPYmplY3QsIHN0cmluZywgXG5cdHN0cmluZ09wdGlvbmFsLCBhcnJheSwgYXJyYXlPcHRpb25hbCwgXG5cdGZpbGVEZXNjcmlwdG9yT3B0aW9uYWwsIGZpbGVEZXNjcmlwdG9yLCBcbmgsIHUsIGksIGYsIG8sIG4sIHMsIGEgfSA9IENvbm5lY3Rpb25cbmltcG9ydCBQcm94eSBmcm9tICcuL1Byb3h5J1xuaW1wb3J0IFdsRGF0YU9mZmVyUHJveHkgZnJvbSAnLi9XbERhdGFPZmZlclByb3h5J1xuXG4vKipcbiAqXG4gKiAgICAgIFRoZXJlIGlzIG9uZSB3bF9kYXRhX2RldmljZSBwZXIgc2VhdCB3aGljaCBjYW4gYmUgb2J0YWluZWRcbiAqICAgICAgZnJvbSB0aGUgZ2xvYmFsIHdsX2RhdGFfZGV2aWNlX21hbmFnZXIgc2luZ2xldG9uLlxuICpcbiAqICAgICAgQSB3bF9kYXRhX2RldmljZSBwcm92aWRlcyBhY2Nlc3MgdG8gaW50ZXItY2xpZW50IGRhdGEgdHJhbnNmZXJcbiAqICAgICAgbWVjaGFuaXNtcyBzdWNoIGFzIGNvcHktYW5kLXBhc3RlIGFuZCBkcmFnLWFuZC1kcm9wLlxuICogICAgXG4gKi9cbmNsYXNzIFdsRGF0YURldmljZVByb3h5IGV4dGVuZHMgUHJveHkge1xuXG5cdC8qKlxuXHQgKlxuXHQgKlx0VGhpcyByZXF1ZXN0IGFza3MgdGhlIGNvbXBvc2l0b3IgdG8gc3RhcnQgYSBkcmFnLWFuZC1kcm9wXG5cdCAqXHRvcGVyYXRpb24gb24gYmVoYWxmIG9mIHRoZSBjbGllbnQuXG5cdCAqXG5cdCAqXHRUaGUgc291cmNlIGFyZ3VtZW50IGlzIHRoZSBkYXRhIHNvdXJjZSB0aGF0IHByb3ZpZGVzIHRoZSBkYXRhXG5cdCAqXHRmb3IgdGhlIGV2ZW50dWFsIGRhdGEgdHJhbnNmZXIuIElmIHNvdXJjZSBpcyBOVUxMLCBlbnRlciwgbGVhdmVcblx0ICpcdGFuZCBtb3Rpb24gZXZlbnRzIGFyZSBzZW50IG9ubHkgdG8gdGhlIGNsaWVudCB0aGF0IGluaXRpYXRlZCB0aGVcblx0ICpcdGRyYWcgYW5kIHRoZSBjbGllbnQgaXMgZXhwZWN0ZWQgdG8gaGFuZGxlIHRoZSBkYXRhIHBhc3Npbmdcblx0ICpcdGludGVybmFsbHkuXG5cdCAqXG5cdCAqXHRUaGUgb3JpZ2luIHN1cmZhY2UgaXMgdGhlIHN1cmZhY2Ugd2hlcmUgdGhlIGRyYWcgb3JpZ2luYXRlcyBhbmRcblx0ICpcdHRoZSBjbGllbnQgbXVzdCBoYXZlIGFuIGFjdGl2ZSBpbXBsaWNpdCBncmFiIHRoYXQgbWF0Y2hlcyB0aGVcblx0ICpcdHNlcmlhbC5cblx0ICpcblx0ICpcdFRoZSBpY29uIHN1cmZhY2UgaXMgYW4gb3B0aW9uYWwgKGNhbiBiZSBOVUxMKSBzdXJmYWNlIHRoYXRcblx0ICpcdHByb3ZpZGVzIGFuIGljb24gdG8gYmUgbW92ZWQgYXJvdW5kIHdpdGggdGhlIGN1cnNvci4gIEluaXRpYWxseSxcblx0ICpcdHRoZSB0b3AtbGVmdCBjb3JuZXIgb2YgdGhlIGljb24gc3VyZmFjZSBpcyBwbGFjZWQgYXQgdGhlIGN1cnNvclxuXHQgKlx0aG90c3BvdCwgYnV0IHN1YnNlcXVlbnQgd2xfc3VyZmFjZS5hdHRhY2ggcmVxdWVzdCBjYW4gbW92ZSB0aGVcblx0ICpcdHJlbGF0aXZlIHBvc2l0aW9uLiBBdHRhY2ggcmVxdWVzdHMgbXVzdCBiZSBjb25maXJtZWQgd2l0aFxuXHQgKlx0d2xfc3VyZmFjZS5jb21taXQgYXMgdXN1YWwuIFRoZSBpY29uIHN1cmZhY2UgaXMgZ2l2ZW4gdGhlIHJvbGUgb2Zcblx0ICpcdGEgZHJhZy1hbmQtZHJvcCBpY29uLiBJZiB0aGUgaWNvbiBzdXJmYWNlIGFscmVhZHkgaGFzIGFub3RoZXIgcm9sZSxcblx0ICpcdGl0IHJhaXNlcyBhIHByb3RvY29sIGVycm9yLlxuXHQgKlxuXHQgKlx0VGhlIGN1cnJlbnQgYW5kIHBlbmRpbmcgaW5wdXQgcmVnaW9ucyBvZiB0aGUgaWNvbiB3bF9zdXJmYWNlIGFyZVxuXHQgKlx0Y2xlYXJlZCwgYW5kIHdsX3N1cmZhY2Uuc2V0X2lucHV0X3JlZ2lvbiBpcyBpZ25vcmVkIHVudGlsIHRoZVxuXHQgKlx0d2xfc3VyZmFjZSBpcyBubyBsb25nZXIgdXNlZCBhcyB0aGUgaWNvbiBzdXJmYWNlLiBXaGVuIHRoZSB1c2Vcblx0ICpcdGFzIGFuIGljb24gZW5kcywgdGhlIGN1cnJlbnQgYW5kIHBlbmRpbmcgaW5wdXQgcmVnaW9ucyBiZWNvbWVcblx0ICpcdHVuZGVmaW5lZCwgYW5kIHRoZSB3bF9zdXJmYWNlIGlzIHVubWFwcGVkLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0gez8qfSBzb3VyY2UgZGF0YSBzb3VyY2UgZm9yIHRoZSBldmVudHVhbCB0cmFuc2ZlciBcblx0ICogQHBhcmFtIHsqfSBvcmlnaW4gc3VyZmFjZSB3aGVyZSB0aGUgZHJhZyBvcmlnaW5hdGVzIFxuXHQgKiBAcGFyYW0gez8qfSBpY29uIGRyYWctYW5kLWRyb3AgaWNvbiBzdXJmYWNlIFxuXHQgKiBAcGFyYW0ge251bWJlcn0gc2VyaWFsIHNlcmlhbCBudW1iZXIgb2YgdGhlIGltcGxpY2l0IGdyYWIgb24gdGhlIG9yaWdpbiBcblx0ICpcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdHN0YXJ0RHJhZyAoc291cmNlLCBvcmlnaW4sIGljb24sIHNlcmlhbCkge1xuXHRcdHRoaXMuZGlzcGxheS5tYXJzaGFsbCh0aGlzLmlkLCAwLCBbb2JqZWN0T3B0aW9uYWwoc291cmNlKSwgb2JqZWN0KG9yaWdpbiksIG9iamVjdE9wdGlvbmFsKGljb24pLCB1aW50KHNlcmlhbCldKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRUaGlzIHJlcXVlc3QgYXNrcyB0aGUgY29tcG9zaXRvciB0byBzZXQgdGhlIHNlbGVjdGlvblxuXHQgKlx0dG8gdGhlIGRhdGEgZnJvbSB0aGUgc291cmNlIG9uIGJlaGFsZiBvZiB0aGUgY2xpZW50LlxuXHQgKlxuXHQgKlx0VG8gdW5zZXQgdGhlIHNlbGVjdGlvbiwgc2V0IHRoZSBzb3VyY2UgdG8gTlVMTC5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHs/Kn0gc291cmNlIGRhdGEgc291cmNlIGZvciB0aGUgc2VsZWN0aW9uIFxuXHQgKiBAcGFyYW0ge251bWJlcn0gc2VyaWFsIHNlcmlhbCBudW1iZXIgb2YgdGhlIGV2ZW50IHRoYXQgdHJpZ2dlcmVkIHRoaXMgcmVxdWVzdCBcblx0ICpcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdHNldFNlbGVjdGlvbiAoc291cmNlLCBzZXJpYWwpIHtcblx0XHR0aGlzLmRpc3BsYXkubWFyc2hhbGwodGhpcy5pZCwgMSwgW29iamVjdE9wdGlvbmFsKHNvdXJjZSksIHVpbnQoc2VyaWFsKV0pXG5cdH1cblxuXHQvKipcblx0ICpcblx0ICpcdFRoaXMgcmVxdWVzdCBkZXN0cm95cyB0aGUgZGF0YSBkZXZpY2UuXG5cdCAqICAgICAgXG5cdCAqIEBzaW5jZSAyXG5cdCAqXG5cdCAqL1xuXHRyZWxlYXNlICgpIHtcblx0XHR0aGlzLmRpc3BsYXkubWFyc2hhbGwodGhpcy5pZCwgMiwgW10pXG5cdH1cblxuLyoqXG5cdCAqQHBhcmFtIHtEaXNwbGF5fWRpc3BsYXlcblx0ICpAcGFyYW0ge251bWJlcn1pZFxuXHQgKi9cblx0Y29uc3RydWN0b3IgKGRpc3BsYXksIGlkKSB7XG5cdFx0c3VwZXIoZGlzcGxheSwgaWQpXG5cdFx0LyoqXG5cdFx0ICogQHR5cGUge1dsRGF0YURldmljZUV2ZW50c3xudWxsfVxuXHRcdCAqL1xuXHRcdHRoaXMubGlzdGVuZXIgPSBudWxsXG5cdH1cblxuXHRhc3luYyBbMF0gKG1lc3NhZ2UpIHtcblx0XHRhd2FpdCB0aGlzLmxpc3RlbmVyLmRhdGFPZmZlcihuZXcgV2xEYXRhT2ZmZXJQcm94eSh0aGlzLmRpc3BsYXksIG4obWVzc2FnZSkpKVxuXHR9XG5cblx0YXN5bmMgWzFdIChtZXNzYWdlKSB7XG5cdFx0YXdhaXQgdGhpcy5saXN0ZW5lci5lbnRlcih1KG1lc3NhZ2UpLCBvKG1lc3NhZ2UsIGZhbHNlLCB0aGlzLmRpc3BsYXkuY29ubmVjdGlvbiksIGYobWVzc2FnZSksIGYobWVzc2FnZSksIG8obWVzc2FnZSwgdHJ1ZSwgdGhpcy5kaXNwbGF5LmNvbm5lY3Rpb24pKVxuXHR9XG5cblx0YXN5bmMgWzJdIChtZXNzYWdlKSB7XG5cdFx0YXdhaXQgdGhpcy5saXN0ZW5lci5sZWF2ZSgpXG5cdH1cblxuXHRhc3luYyBbM10gKG1lc3NhZ2UpIHtcblx0XHRhd2FpdCB0aGlzLmxpc3RlbmVyLm1vdGlvbih1KG1lc3NhZ2UpLCBmKG1lc3NhZ2UpLCBmKG1lc3NhZ2UpKVxuXHR9XG5cblx0YXN5bmMgWzRdIChtZXNzYWdlKSB7XG5cdFx0YXdhaXQgdGhpcy5saXN0ZW5lci5kcm9wKClcblx0fVxuXG5cdGFzeW5jIFs1XSAobWVzc2FnZSkge1xuXHRcdGF3YWl0IHRoaXMubGlzdGVuZXIuc2VsZWN0aW9uKG8obWVzc2FnZSwgdHJ1ZSwgdGhpcy5kaXNwbGF5LmNvbm5lY3Rpb24pKVxuXHR9XG5cbn1cbldsRGF0YURldmljZVByb3h5LnByb3RvY29sTmFtZSA9ICd3bF9kYXRhX2RldmljZSdcblxuV2xEYXRhRGV2aWNlUHJveHkuRXJyb3IgPSB7XG4gIC8qKlxuICAgKiBnaXZlbiB3bF9zdXJmYWNlIGhhcyBhbm90aGVyIHJvbGVcbiAgICovXG4gIHJvbGU6IDBcbn1cblxuZXhwb3J0IGRlZmF1bHQgV2xEYXRhRGV2aWNlUHJveHlcbiIsIi8qXG4gKlxuICogICAgQ29weXJpZ2h0IMKpIDIwMDgtMjAxMSBLcmlzdGlhbiBIw7hnc2JlcmdcbiAqICAgIENvcHlyaWdodCDCqSAyMDEwLTIwMTEgSW50ZWwgQ29ycG9yYXRpb25cbiAqICAgIENvcHlyaWdodCDCqSAyMDEyLTIwMTMgQ29sbGFib3JhLCBMdGQuXG4gKlxuICogICAgUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqICAgIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzXG4gKiAgICAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiAgICBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogICAgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqICAgIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiAgICBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiAgICBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSAoaW5jbHVkaW5nIHRoZVxuICogICAgbmV4dCBwYXJhZ3JhcGgpIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWxcbiAqICAgIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiAgICBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogICAgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4gKiAgICBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuICogICAgTk9OSU5GUklOR0VNRU5ULiAgSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlNcbiAqICAgIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTlxuICogICAgQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU5cbiAqICAgIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbiAqICAgIFNPRlRXQVJFLlxuICogIFxuICovXG5cbi8qKlxuICogQGludGVyZmFjZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXbERhdGFPZmZlckV2ZW50cyB7XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRTZW50IGltbWVkaWF0ZWx5IGFmdGVyIGNyZWF0aW5nIHRoZSB3bF9kYXRhX29mZmVyIG9iamVjdC4gIE9uZVxuXHQgKlx0ZXZlbnQgcGVyIG9mZmVyZWQgbWltZSB0eXBlLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbWltZVR5cGUgb2ZmZXJlZCBtaW1lIHR5cGUgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRvZmZlcihtaW1lVHlwZSkge31cblxuXHQvKipcblx0ICpcblx0ICpcdFRoaXMgZXZlbnQgaW5kaWNhdGVzIHRoZSBhY3Rpb25zIG9mZmVyZWQgYnkgdGhlIGRhdGEgc291cmNlLiBJdFxuXHQgKlx0d2lsbCBiZSBzZW50IHJpZ2h0IGFmdGVyIHdsX2RhdGFfZGV2aWNlLmVudGVyLCBvciBhbnl0aW1lIHRoZSBzb3VyY2Vcblx0ICpcdHNpZGUgY2hhbmdlcyBpdHMgb2ZmZXJlZCBhY3Rpb25zIHRocm91Z2ggd2xfZGF0YV9zb3VyY2Uuc2V0X2FjdGlvbnMuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBzb3VyY2VBY3Rpb25zIGFjdGlvbnMgb2ZmZXJlZCBieSB0aGUgZGF0YSBzb3VyY2UgXG5cdCAqXG5cdCAqIEBzaW5jZSAzXG5cdCAqXG5cdCAqL1xuXHRzb3VyY2VBY3Rpb25zKHNvdXJjZUFjdGlvbnMpIHt9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRUaGlzIGV2ZW50IGluZGljYXRlcyB0aGUgYWN0aW9uIHNlbGVjdGVkIGJ5IHRoZSBjb21wb3NpdG9yIGFmdGVyXG5cdCAqXHRtYXRjaGluZyB0aGUgc291cmNlL2Rlc3RpbmF0aW9uIHNpZGUgYWN0aW9ucy4gT25seSBvbmUgYWN0aW9uIChvclxuXHQgKlx0bm9uZSkgd2lsbCBiZSBvZmZlcmVkIGhlcmUuXG5cdCAqXG5cdCAqXHRUaGlzIGV2ZW50IGNhbiBiZSBlbWl0dGVkIG11bHRpcGxlIHRpbWVzIGR1cmluZyB0aGUgZHJhZy1hbmQtZHJvcFxuXHQgKlx0b3BlcmF0aW9uIGluIHJlc3BvbnNlIHRvIGRlc3RpbmF0aW9uIHNpZGUgYWN0aW9uIGNoYW5nZXMgdGhyb3VnaFxuXHQgKlx0d2xfZGF0YV9vZmZlci5zZXRfYWN0aW9ucy5cblx0ICpcblx0ICpcdFRoaXMgZXZlbnQgd2lsbCBubyBsb25nZXIgYmUgZW1pdHRlZCBhZnRlciB3bF9kYXRhX2RldmljZS5kcm9wXG5cdCAqXHRoYXBwZW5lZCBvbiB0aGUgZHJhZy1hbmQtZHJvcCBkZXN0aW5hdGlvbiwgdGhlIGNsaWVudCBtdXN0XG5cdCAqXHRob25vciB0aGUgbGFzdCBhY3Rpb24gcmVjZWl2ZWQsIG9yIHRoZSBsYXN0IHByZWZlcnJlZCBvbmUgc2V0XG5cdCAqXHR0aHJvdWdoIHdsX2RhdGFfb2ZmZXIuc2V0X2FjdGlvbnMgd2hlbiBoYW5kbGluZyBhbiBcImFza1wiIGFjdGlvbi5cblx0ICpcblx0ICpcdENvbXBvc2l0b3JzIG1heSBhbHNvIGNoYW5nZSB0aGUgc2VsZWN0ZWQgYWN0aW9uIG9uIHRoZSBmbHksIG1haW5seVxuXHQgKlx0aW4gcmVzcG9uc2UgdG8ga2V5Ym9hcmQgbW9kaWZpZXIgY2hhbmdlcyBkdXJpbmcgdGhlIGRyYWctYW5kLWRyb3Bcblx0ICpcdG9wZXJhdGlvbi5cblx0ICpcblx0ICpcdFRoZSBtb3N0IHJlY2VudCBhY3Rpb24gcmVjZWl2ZWQgaXMgYWx3YXlzIHRoZSB2YWxpZCBvbmUuIFByaW9yIHRvXG5cdCAqXHRyZWNlaXZpbmcgd2xfZGF0YV9kZXZpY2UuZHJvcCwgdGhlIGNob3NlbiBhY3Rpb24gbWF5IGNoYW5nZSAoZS5nLlxuXHQgKlx0ZHVlIHRvIGtleWJvYXJkIG1vZGlmaWVycyBiZWluZyBwcmVzc2VkKS4gQXQgdGhlIHRpbWUgb2YgcmVjZWl2aW5nXG5cdCAqXHR3bF9kYXRhX2RldmljZS5kcm9wIHRoZSBkcmFnLWFuZC1kcm9wIGRlc3RpbmF0aW9uIG11c3QgaG9ub3IgdGhlXG5cdCAqXHRsYXN0IGFjdGlvbiByZWNlaXZlZC5cblx0ICpcblx0ICpcdEFjdGlvbiBjaGFuZ2VzIG1heSBzdGlsbCBoYXBwZW4gYWZ0ZXIgd2xfZGF0YV9kZXZpY2UuZHJvcCxcblx0ICpcdGVzcGVjaWFsbHkgb24gXCJhc2tcIiBhY3Rpb25zLCB3aGVyZSB0aGUgZHJhZy1hbmQtZHJvcCBkZXN0aW5hdGlvblxuXHQgKlx0bWF5IGNob29zZSBhbm90aGVyIGFjdGlvbiBhZnRlcndhcmRzLiBBY3Rpb24gY2hhbmdlcyBoYXBwZW5pbmdcblx0ICpcdGF0IHRoaXMgc3RhZ2UgYXJlIGFsd2F5cyB0aGUgcmVzdWx0IG9mIGludGVyLWNsaWVudCBuZWdvdGlhdGlvbiwgdGhlXG5cdCAqXHRjb21wb3NpdG9yIHNoYWxsIG5vIGxvbmdlciBiZSBhYmxlIHRvIGluZHVjZSBhIGRpZmZlcmVudCBhY3Rpb24uXG5cdCAqXG5cdCAqXHRVcG9uIFwiYXNrXCIgYWN0aW9ucywgaXQgaXMgZXhwZWN0ZWQgdGhhdCB0aGUgZHJhZy1hbmQtZHJvcCBkZXN0aW5hdGlvblxuXHQgKlx0bWF5IHBvdGVudGlhbGx5IGNob29zZSBhIGRpZmZlcmVudCBhY3Rpb24gYW5kL29yIG1pbWUgdHlwZSxcblx0ICpcdGJhc2VkIG9uIHdsX2RhdGFfb2ZmZXIuc291cmNlX2FjdGlvbnMgYW5kIGZpbmFsbHkgY2hvc2VuIGJ5IHRoZVxuXHQgKlx0dXNlciAoZS5nLiBwb3BwaW5nIHVwIGEgbWVudSB3aXRoIHRoZSBhdmFpbGFibGUgb3B0aW9ucykuIFRoZVxuXHQgKlx0ZmluYWwgd2xfZGF0YV9vZmZlci5zZXRfYWN0aW9ucyBhbmQgd2xfZGF0YV9vZmZlci5hY2NlcHQgcmVxdWVzdHNcblx0ICpcdG11c3QgaGFwcGVuIGJlZm9yZSB0aGUgY2FsbCB0byB3bF9kYXRhX29mZmVyLmZpbmlzaC5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHtudW1iZXJ9IGRuZEFjdGlvbiBhY3Rpb24gc2VsZWN0ZWQgYnkgdGhlIGNvbXBvc2l0b3IgXG5cdCAqXG5cdCAqIEBzaW5jZSAzXG5cdCAqXG5cdCAqL1xuXHRhY3Rpb24oZG5kQWN0aW9uKSB7fVxufVxuXG4iLCIvKlxuICpcbiAqICAgIENvcHlyaWdodCDCqSAyMDA4LTIwMTEgS3Jpc3RpYW4gSMO4Z3NiZXJnXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMC0yMDExIEludGVsIENvcnBvcmF0aW9uXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMi0yMDEzIENvbGxhYm9yYSwgTHRkLlxuICpcbiAqICAgIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiAgICBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlc1xuICogICAgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogICAgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqICAgIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiAgICBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogICAgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogICAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2UgKGluY2x1ZGluZyB0aGVcbiAqICAgIG5leHQgcGFyYWdyYXBoKSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsXG4gKiAgICBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogICAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqICAgIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuICogICAgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbiAqICAgIE5PTklORlJJTkdFTUVOVC4gIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTXG4gKiAgICBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU5cbiAqICAgIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOXG4gKiAgICBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4gKiAgICBTT0ZUV0FSRS5cbiAqICBcbiAqL1xuXG5pbXBvcnQgeyBDb25uZWN0aW9uIH0gZnJvbSAnd2VzdGZpZWxkLXJ1bnRpbWUtY29tbW9uJ1xuY29uc3QgeyB1aW50LCB1aW50T3B0aW9uYWwsIGludCwgaW50T3B0aW9uYWwsIGZpeGVkLCBcblx0Zml4ZWRPcHRpb25hbCwgb2JqZWN0LCBvYmplY3RPcHRpb25hbCwgbmV3T2JqZWN0LCBzdHJpbmcsIFxuXHRzdHJpbmdPcHRpb25hbCwgYXJyYXksIGFycmF5T3B0aW9uYWwsIFxuXHRmaWxlRGVzY3JpcHRvck9wdGlvbmFsLCBmaWxlRGVzY3JpcHRvciwgXG5oLCB1LCBpLCBmLCBvLCBuLCBzLCBhIH0gPSBDb25uZWN0aW9uXG5pbXBvcnQgUHJveHkgZnJvbSAnLi9Qcm94eSdcblxuLyoqXG4gKlxuICogICAgICBBIHdsX2RhdGFfb2ZmZXIgcmVwcmVzZW50cyBhIHBpZWNlIG9mIGRhdGEgb2ZmZXJlZCBmb3IgdHJhbnNmZXJcbiAqICAgICAgYnkgYW5vdGhlciBjbGllbnQgKHRoZSBzb3VyY2UgY2xpZW50KS4gIEl0IGlzIHVzZWQgYnkgdGhlXG4gKiAgICAgIGNvcHktYW5kLXBhc3RlIGFuZCBkcmFnLWFuZC1kcm9wIG1lY2hhbmlzbXMuICBUaGUgb2ZmZXJcbiAqICAgICAgZGVzY3JpYmVzIHRoZSBkaWZmZXJlbnQgbWltZSB0eXBlcyB0aGF0IHRoZSBkYXRhIGNhbiBiZVxuICogICAgICBjb252ZXJ0ZWQgdG8gYW5kIHByb3ZpZGVzIHRoZSBtZWNoYW5pc20gZm9yIHRyYW5zZmVycmluZyB0aGVcbiAqICAgICAgZGF0YSBkaXJlY3RseSBmcm9tIHRoZSBzb3VyY2UgY2xpZW50LlxuICogICAgXG4gKi9cbmNsYXNzIFdsRGF0YU9mZmVyUHJveHkgZXh0ZW5kcyBQcm94eSB7XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRJbmRpY2F0ZSB0aGF0IHRoZSBjbGllbnQgY2FuIGFjY2VwdCB0aGUgZ2l2ZW4gbWltZSB0eXBlLCBvclxuXHQgKlx0TlVMTCBmb3Igbm90IGFjY2VwdGVkLlxuXHQgKlxuXHQgKlx0Rm9yIG9iamVjdHMgb2YgdmVyc2lvbiAyIG9yIG9sZGVyLCB0aGlzIHJlcXVlc3QgaXMgdXNlZCBieSB0aGVcblx0ICpcdGNsaWVudCB0byBnaXZlIGZlZWRiYWNrIHdoZXRoZXIgdGhlIGNsaWVudCBjYW4gcmVjZWl2ZSB0aGUgZ2l2ZW5cblx0ICpcdG1pbWUgdHlwZSwgb3IgTlVMTCBpZiBub25lIGlzIGFjY2VwdGVkOyB0aGUgZmVlZGJhY2sgZG9lcyBub3Rcblx0ICpcdGRldGVybWluZSB3aGV0aGVyIHRoZSBkcmFnLWFuZC1kcm9wIG9wZXJhdGlvbiBzdWNjZWVkcyBvciBub3QuXG5cdCAqXG5cdCAqXHRGb3Igb2JqZWN0cyBvZiB2ZXJzaW9uIDMgb3IgbmV3ZXIsIHRoaXMgcmVxdWVzdCBkZXRlcm1pbmVzIHRoZVxuXHQgKlx0ZmluYWwgcmVzdWx0IG9mIHRoZSBkcmFnLWFuZC1kcm9wIG9wZXJhdGlvbi4gSWYgdGhlIGVuZCByZXN1bHRcblx0ICpcdGlzIHRoYXQgbm8gbWltZSB0eXBlcyB3ZXJlIGFjY2VwdGVkLCB0aGUgZHJhZy1hbmQtZHJvcCBvcGVyYXRpb25cblx0ICpcdHdpbGwgYmUgY2FuY2VsbGVkIGFuZCB0aGUgY29ycmVzcG9uZGluZyBkcmFnIHNvdXJjZSB3aWxsIHJlY2VpdmVcblx0ICpcdHdsX2RhdGFfc291cmNlLmNhbmNlbGxlZC4gQ2xpZW50cyBtYXkgc3RpbGwgdXNlIHRoaXMgZXZlbnQgaW5cblx0ICpcdGNvbmp1bmN0aW9uIHdpdGggd2xfZGF0YV9zb3VyY2UuYWN0aW9uIGZvciBmZWVkYmFjay5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHtudW1iZXJ9IHNlcmlhbCBzZXJpYWwgbnVtYmVyIG9mIHRoZSBhY2NlcHQgcmVxdWVzdCBcblx0ICogQHBhcmFtIHs/c3RyaW5nfSBtaW1lVHlwZSBtaW1lIHR5cGUgYWNjZXB0ZWQgYnkgdGhlIGNsaWVudCBcblx0ICpcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdGFjY2VwdCAoc2VyaWFsLCBtaW1lVHlwZSkge1xuXHRcdHRoaXMuZGlzcGxheS5tYXJzaGFsbCh0aGlzLmlkLCAwLCBbdWludChzZXJpYWwpLCBzdHJpbmdPcHRpb25hbChtaW1lVHlwZSldKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRUbyB0cmFuc2ZlciB0aGUgb2ZmZXJlZCBkYXRhLCB0aGUgY2xpZW50IGlzc3VlcyB0aGlzIHJlcXVlc3Rcblx0ICpcdGFuZCBpbmRpY2F0ZXMgdGhlIG1pbWUgdHlwZSBpdCB3YW50cyB0byByZWNlaXZlLiAgVGhlIHRyYW5zZmVyXG5cdCAqXHRoYXBwZW5zIHRocm91Z2ggdGhlIHBhc3NlZCBmaWxlIGRlc2NyaXB0b3IgKHR5cGljYWxseSBjcmVhdGVkXG5cdCAqXHR3aXRoIHRoZSBwaXBlIHN5c3RlbSBjYWxsKS4gIFRoZSBzb3VyY2UgY2xpZW50IHdyaXRlcyB0aGUgZGF0YVxuXHQgKlx0aW4gdGhlIG1pbWUgdHlwZSByZXByZXNlbnRhdGlvbiByZXF1ZXN0ZWQgYW5kIHRoZW4gY2xvc2VzIHRoZVxuXHQgKlx0ZmlsZSBkZXNjcmlwdG9yLlxuXHQgKlxuXHQgKlx0VGhlIHJlY2VpdmluZyBjbGllbnQgcmVhZHMgZnJvbSB0aGUgcmVhZCBlbmQgb2YgdGhlIHBpcGUgdW50aWxcblx0ICpcdEVPRiBhbmQgdGhlbiBjbG9zZXMgaXRzIGVuZCwgYXQgd2hpY2ggcG9pbnQgdGhlIHRyYW5zZmVyIGlzXG5cdCAqXHRjb21wbGV0ZS5cblx0ICpcblx0ICpcdFRoaXMgcmVxdWVzdCBtYXkgaGFwcGVuIG11bHRpcGxlIHRpbWVzIGZvciBkaWZmZXJlbnQgbWltZSB0eXBlcyxcblx0ICpcdGJvdGggYmVmb3JlIGFuZCBhZnRlciB3bF9kYXRhX2RldmljZS5kcm9wLiBEcmFnLWFuZC1kcm9wIGRlc3RpbmF0aW9uXG5cdCAqXHRjbGllbnRzIG1heSBwcmVlbXB0aXZlbHkgZmV0Y2ggZGF0YSBvciBleGFtaW5lIGl0IG1vcmUgY2xvc2VseSB0b1xuXHQgKlx0ZGV0ZXJtaW5lIGFjY2VwdGFuY2UuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBtaW1lVHlwZSBtaW1lIHR5cGUgZGVzaXJlZCBieSByZWNlaXZlciBcblx0ICogQHBhcmFtIHtXZWJGRH0gZmQgZmlsZSBkZXNjcmlwdG9yIGZvciBkYXRhIHRyYW5zZmVyIFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0cmVjZWl2ZSAobWltZVR5cGUsIGZkKSB7XG5cdFx0dGhpcy5kaXNwbGF5Lm1hcnNoYWxsKHRoaXMuaWQsIDEsIFtzdHJpbmcobWltZVR5cGUpLCBmaWxlRGVzY3JpcHRvcihmZCldKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHREZXN0cm95IHRoZSBkYXRhIG9mZmVyLlxuXHQgKiAgICAgIFxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0ZGVzdHJveSAoKSB7XG5cdFx0dGhpcy5kaXNwbGF5Lm1hcnNoYWxsKHRoaXMuaWQsIDIsIFtdKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHROb3RpZmllcyB0aGUgY29tcG9zaXRvciB0aGF0IHRoZSBkcmFnIGRlc3RpbmF0aW9uIHN1Y2Nlc3NmdWxseVxuXHQgKlx0ZmluaXNoZWQgdGhlIGRyYWctYW5kLWRyb3Agb3BlcmF0aW9uLlxuXHQgKlxuXHQgKlx0VXBvbiByZWNlaXZpbmcgdGhpcyByZXF1ZXN0LCB0aGUgY29tcG9zaXRvciB3aWxsIGVtaXRcblx0ICpcdHdsX2RhdGFfc291cmNlLmRuZF9maW5pc2hlZCBvbiB0aGUgZHJhZyBzb3VyY2UgY2xpZW50LlxuXHQgKlxuXHQgKlx0SXQgaXMgYSBjbGllbnQgZXJyb3IgdG8gcGVyZm9ybSBvdGhlciByZXF1ZXN0cyB0aGFuXG5cdCAqXHR3bF9kYXRhX29mZmVyLmRlc3Ryb3kgYWZ0ZXIgdGhpcyBvbmUuIEl0IGlzIGFsc28gYW4gZXJyb3IgdG8gcGVyZm9ybVxuXHQgKlx0dGhpcyByZXF1ZXN0IGFmdGVyIGEgTlVMTCBtaW1lIHR5cGUgaGFzIGJlZW4gc2V0IGluXG5cdCAqXHR3bF9kYXRhX29mZmVyLmFjY2VwdCBvciBubyBhY3Rpb24gd2FzIHJlY2VpdmVkIHRocm91Z2hcblx0ICpcdHdsX2RhdGFfb2ZmZXIuYWN0aW9uLlxuXHQgKiAgICAgIFxuXHQgKiBAc2luY2UgM1xuXHQgKlxuXHQgKi9cblx0ZmluaXNoICgpIHtcblx0XHR0aGlzLmRpc3BsYXkubWFyc2hhbGwodGhpcy5pZCwgMywgW10pXG5cdH1cblxuXHQvKipcblx0ICpcblx0ICpcdFNldHMgdGhlIGFjdGlvbnMgdGhhdCB0aGUgZGVzdGluYXRpb24gc2lkZSBjbGllbnQgc3VwcG9ydHMgZm9yXG5cdCAqXHR0aGlzIG9wZXJhdGlvbi4gVGhpcyByZXF1ZXN0IG1heSB0cmlnZ2VyIHRoZSBlbWlzc2lvbiBvZlxuXHQgKlx0d2xfZGF0YV9zb3VyY2UuYWN0aW9uIGFuZCB3bF9kYXRhX29mZmVyLmFjdGlvbiBldmVudHMgaWYgdGhlIGNvbXBvc2l0b3Jcblx0ICpcdG5lZWRzIHRvIGNoYW5nZSB0aGUgc2VsZWN0ZWQgYWN0aW9uLlxuXHQgKlxuXHQgKlx0VGhpcyByZXF1ZXN0IGNhbiBiZSBjYWxsZWQgbXVsdGlwbGUgdGltZXMgdGhyb3VnaG91dCB0aGVcblx0ICpcdGRyYWctYW5kLWRyb3Agb3BlcmF0aW9uLCB0eXBpY2FsbHkgaW4gcmVzcG9uc2UgdG8gd2xfZGF0YV9kZXZpY2UuZW50ZXJcblx0ICpcdG9yIHdsX2RhdGFfZGV2aWNlLm1vdGlvbiBldmVudHMuXG5cdCAqXG5cdCAqXHRUaGlzIHJlcXVlc3QgZGV0ZXJtaW5lcyB0aGUgZmluYWwgcmVzdWx0IG9mIHRoZSBkcmFnLWFuZC1kcm9wXG5cdCAqXHRvcGVyYXRpb24uIElmIHRoZSBlbmQgcmVzdWx0IGlzIHRoYXQgbm8gYWN0aW9uIGlzIGFjY2VwdGVkLFxuXHQgKlx0dGhlIGRyYWcgc291cmNlIHdpbGwgcmVjZWl2ZSB3bF9kcmFnX3NvdXJjZS5jYW5jZWxsZWQuXG5cdCAqXG5cdCAqXHRUaGUgZG5kX2FjdGlvbnMgYXJndW1lbnQgbXVzdCBjb250YWluIG9ubHkgdmFsdWVzIGV4cHJlc3NlZCBpbiB0aGVcblx0ICpcdHdsX2RhdGFfZGV2aWNlX21hbmFnZXIuZG5kX2FjdGlvbnMgZW51bSwgYW5kIHRoZSBwcmVmZXJyZWRfYWN0aW9uXG5cdCAqXHRhcmd1bWVudCBtdXN0IG9ubHkgY29udGFpbiBvbmUgb2YgdGhvc2UgdmFsdWVzIHNldCwgb3RoZXJ3aXNlIGl0XG5cdCAqXHR3aWxsIHJlc3VsdCBpbiBhIHByb3RvY29sIGVycm9yLlxuXHQgKlxuXHQgKlx0V2hpbGUgbWFuYWdpbmcgYW4gXCJhc2tcIiBhY3Rpb24sIHRoZSBkZXN0aW5hdGlvbiBkcmFnLWFuZC1kcm9wIGNsaWVudFxuXHQgKlx0bWF5IHBlcmZvcm0gZnVydGhlciB3bF9kYXRhX29mZmVyLnJlY2VpdmUgcmVxdWVzdHMsIGFuZCBpcyBleHBlY3RlZFxuXHQgKlx0dG8gcGVyZm9ybSBvbmUgbGFzdCB3bF9kYXRhX29mZmVyLnNldF9hY3Rpb25zIHJlcXVlc3Qgd2l0aCBhIHByZWZlcnJlZFxuXHQgKlx0YWN0aW9uIG90aGVyIHRoYW4gXCJhc2tcIiAoYW5kIG9wdGlvbmFsbHkgd2xfZGF0YV9vZmZlci5hY2NlcHQpIGJlZm9yZVxuXHQgKlx0cmVxdWVzdGluZyB3bF9kYXRhX29mZmVyLmZpbmlzaCwgaW4gb3JkZXIgdG8gY29udmV5IHRoZSBhY3Rpb24gc2VsZWN0ZWRcblx0ICpcdGJ5IHRoZSB1c2VyLiBJZiB0aGUgcHJlZmVycmVkIGFjdGlvbiBpcyBub3QgaW4gdGhlXG5cdCAqXHR3bF9kYXRhX29mZmVyLnNvdXJjZV9hY3Rpb25zIG1hc2ssIGFuIGVycm9yIHdpbGwgYmUgcmFpc2VkLlxuXHQgKlxuXHQgKlx0SWYgdGhlIFwiYXNrXCIgYWN0aW9uIGlzIGRpc21pc3NlZCAoZS5nLiB1c2VyIGNhbmNlbGxhdGlvbiksIHRoZSBjbGllbnRcblx0ICpcdGlzIGV4cGVjdGVkIHRvIHBlcmZvcm0gd2xfZGF0YV9vZmZlci5kZXN0cm95IHJpZ2h0IGF3YXkuXG5cdCAqXG5cdCAqXHRUaGlzIHJlcXVlc3QgY2FuIG9ubHkgYmUgbWFkZSBvbiBkcmFnLWFuZC1kcm9wIG9mZmVycywgYSBwcm90b2NvbCBlcnJvclxuXHQgKlx0d2lsbCBiZSByYWlzZWQgb3RoZXJ3aXNlLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0ge251bWJlcn0gZG5kQWN0aW9ucyBhY3Rpb25zIHN1cHBvcnRlZCBieSB0aGUgZGVzdGluYXRpb24gY2xpZW50IFxuXHQgKiBAcGFyYW0ge251bWJlcn0gcHJlZmVycmVkQWN0aW9uIGFjdGlvbiBwcmVmZXJyZWQgYnkgdGhlIGRlc3RpbmF0aW9uIGNsaWVudCBcblx0ICpcblx0ICogQHNpbmNlIDNcblx0ICpcblx0ICovXG5cdHNldEFjdGlvbnMgKGRuZEFjdGlvbnMsIHByZWZlcnJlZEFjdGlvbikge1xuXHRcdHRoaXMuZGlzcGxheS5tYXJzaGFsbCh0aGlzLmlkLCA0LCBbdWludChkbmRBY3Rpb25zKSwgdWludChwcmVmZXJyZWRBY3Rpb24pXSlcblx0fVxuXG4vKipcblx0ICpAcGFyYW0ge0Rpc3BsYXl9ZGlzcGxheVxuXHQgKkBwYXJhbSB7bnVtYmVyfWlkXG5cdCAqL1xuXHRjb25zdHJ1Y3RvciAoZGlzcGxheSwgaWQpIHtcblx0XHRzdXBlcihkaXNwbGF5LCBpZClcblx0XHQvKipcblx0XHQgKiBAdHlwZSB7V2xEYXRhT2ZmZXJFdmVudHN8bnVsbH1cblx0XHQgKi9cblx0XHR0aGlzLmxpc3RlbmVyID0gbnVsbFxuXHR9XG5cblx0YXN5bmMgWzBdIChtZXNzYWdlKSB7XG5cdFx0YXdhaXQgdGhpcy5saXN0ZW5lci5vZmZlcihzKG1lc3NhZ2UsIGZhbHNlKSlcblx0fVxuXG5cdGFzeW5jIFsxXSAobWVzc2FnZSkge1xuXHRcdGF3YWl0IHRoaXMubGlzdGVuZXIuc291cmNlQWN0aW9ucyh1KG1lc3NhZ2UpKVxuXHR9XG5cblx0YXN5bmMgWzJdIChtZXNzYWdlKSB7XG5cdFx0YXdhaXQgdGhpcy5saXN0ZW5lci5hY3Rpb24odShtZXNzYWdlKSlcblx0fVxuXG59XG5XbERhdGFPZmZlclByb3h5LnByb3RvY29sTmFtZSA9ICd3bF9kYXRhX29mZmVyJ1xuXG5XbERhdGFPZmZlclByb3h5LkVycm9yID0ge1xuICAvKipcbiAgICogZmluaXNoIHJlcXVlc3Qgd2FzIGNhbGxlZCB1bnRpbWVseVxuICAgKi9cbiAgaW52YWxpZEZpbmlzaDogMCxcbiAgLyoqXG4gICAqIGFjdGlvbiBtYXNrIGNvbnRhaW5zIGludmFsaWQgdmFsdWVzXG4gICAqL1xuICBpbnZhbGlkQWN0aW9uTWFzazogMSxcbiAgLyoqXG4gICAqIGFjdGlvbiBhcmd1bWVudCBoYXMgYW4gaW52YWxpZCB2YWx1ZVxuICAgKi9cbiAgaW52YWxpZEFjdGlvbjogMixcbiAgLyoqXG4gICAqIG9mZmVyIGRvZXNuJ3QgYWNjZXB0IHRoaXMgcmVxdWVzdFxuICAgKi9cbiAgaW52YWxpZE9mZmVyOiAzXG59XG5cbmV4cG9ydCBkZWZhdWx0IFdsRGF0YU9mZmVyUHJveHlcbiIsIi8qXG4gKlxuICogICAgQ29weXJpZ2h0IMKpIDIwMDgtMjAxMSBLcmlzdGlhbiBIw7hnc2JlcmdcbiAqICAgIENvcHlyaWdodCDCqSAyMDEwLTIwMTEgSW50ZWwgQ29ycG9yYXRpb25cbiAqICAgIENvcHlyaWdodCDCqSAyMDEyLTIwMTMgQ29sbGFib3JhLCBMdGQuXG4gKlxuICogICAgUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqICAgIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzXG4gKiAgICAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiAgICBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogICAgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqICAgIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiAgICBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiAgICBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSAoaW5jbHVkaW5nIHRoZVxuICogICAgbmV4dCBwYXJhZ3JhcGgpIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWxcbiAqICAgIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiAgICBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogICAgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4gKiAgICBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuICogICAgTk9OSU5GUklOR0VNRU5ULiAgSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlNcbiAqICAgIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTlxuICogICAgQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU5cbiAqICAgIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbiAqICAgIFNPRlRXQVJFLlxuICogIFxuICovXG5cbi8qKlxuICogQGludGVyZmFjZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXbERhdGFTb3VyY2VFdmVudHMge1xuXG5cdC8qKlxuXHQgKlxuXHQgKlx0U2VudCB3aGVuIGEgdGFyZ2V0IGFjY2VwdHMgcG9pbnRlcl9mb2N1cyBvciBtb3Rpb24gZXZlbnRzLiAgSWZcblx0ICpcdGEgdGFyZ2V0IGRvZXMgbm90IGFjY2VwdCBhbnkgb2YgdGhlIG9mZmVyZWQgdHlwZXMsIHR5cGUgaXMgTlVMTC5cblx0ICpcblx0ICpcdFVzZWQgZm9yIGZlZWRiYWNrIGR1cmluZyBkcmFnLWFuZC1kcm9wLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0gez9zdHJpbmd9IG1pbWVUeXBlIG1pbWUgdHlwZSBhY2NlcHRlZCBieSB0aGUgdGFyZ2V0IFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0dGFyZ2V0KG1pbWVUeXBlKSB7fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0UmVxdWVzdCBmb3IgZGF0YSBmcm9tIHRoZSBjbGllbnQuICBTZW5kIHRoZSBkYXRhIGFzIHRoZVxuXHQgKlx0c3BlY2lmaWVkIG1pbWUgdHlwZSBvdmVyIHRoZSBwYXNzZWQgZmlsZSBkZXNjcmlwdG9yLCB0aGVuXG5cdCAqXHRjbG9zZSBpdC5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IG1pbWVUeXBlIG1pbWUgdHlwZSBmb3IgdGhlIGRhdGEgXG5cdCAqIEBwYXJhbSB7V2ViRkR9IGZkIGZpbGUgZGVzY3JpcHRvciBmb3IgdGhlIGRhdGEgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRzZW5kKG1pbWVUeXBlLCBmZCkge31cblxuXHQvKipcblx0ICpcblx0ICpcdFRoaXMgZGF0YSBzb3VyY2UgaXMgbm8gbG9uZ2VyIHZhbGlkLiBUaGVyZSBhcmUgc2V2ZXJhbCByZWFzb25zIHdoeVxuXHQgKlx0dGhpcyBjb3VsZCBoYXBwZW46XG5cdCAqXG5cdCAqXHQtIFRoZSBkYXRhIHNvdXJjZSBoYXMgYmVlbiByZXBsYWNlZCBieSBhbm90aGVyIGRhdGEgc291cmNlLlxuXHQgKlx0LSBUaGUgZHJhZy1hbmQtZHJvcCBvcGVyYXRpb24gd2FzIHBlcmZvcm1lZCwgYnV0IHRoZSBkcm9wIGRlc3RpbmF0aW9uXG5cdCAqXHQgIGRpZCBub3QgYWNjZXB0IGFueSBvZiB0aGUgbWltZSB0eXBlcyBvZmZlcmVkIHRocm91Z2hcblx0ICpcdCAgd2xfZGF0YV9zb3VyY2UudGFyZ2V0LlxuXHQgKlx0LSBUaGUgZHJhZy1hbmQtZHJvcCBvcGVyYXRpb24gd2FzIHBlcmZvcm1lZCwgYnV0IHRoZSBkcm9wIGRlc3RpbmF0aW9uXG5cdCAqXHQgIGRpZCBub3Qgc2VsZWN0IGFueSBvZiB0aGUgYWN0aW9ucyBwcmVzZW50IGluIHRoZSBtYXNrIG9mZmVyZWQgdGhyb3VnaFxuXHQgKlx0ICB3bF9kYXRhX3NvdXJjZS5hY3Rpb24uXG5cdCAqXHQtIFRoZSBkcmFnLWFuZC1kcm9wIG9wZXJhdGlvbiB3YXMgcGVyZm9ybWVkIGJ1dCBkaWRuJ3QgaGFwcGVuIG92ZXIgYVxuXHQgKlx0ICBzdXJmYWNlLlxuXHQgKlx0LSBUaGUgY29tcG9zaXRvciBjYW5jZWxsZWQgdGhlIGRyYWctYW5kLWRyb3Agb3BlcmF0aW9uIChlLmcuIGNvbXBvc2l0b3Jcblx0ICpcdCAgZGVwZW5kZW50IHRpbWVvdXRzIHRvIGF2b2lkIHN0YWxlIGRyYWctYW5kLWRyb3AgdHJhbnNmZXJzKS5cblx0ICpcblx0ICpcdFRoZSBjbGllbnQgc2hvdWxkIGNsZWFuIHVwIGFuZCBkZXN0cm95IHRoaXMgZGF0YSBzb3VyY2UuXG5cdCAqXG5cdCAqXHRGb3Igb2JqZWN0cyBvZiB2ZXJzaW9uIDIgb3Igb2xkZXIsIHdsX2RhdGFfc291cmNlLmNhbmNlbGxlZCB3aWxsXG5cdCAqXHRvbmx5IGJlIGVtaXR0ZWQgaWYgdGhlIGRhdGEgc291cmNlIHdhcyByZXBsYWNlZCBieSBhbm90aGVyIGRhdGFcblx0ICpcdHNvdXJjZS5cblx0ICogICAgICBcblx0ICpcblx0ICpcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdGNhbmNlbGxlZCgpIHt9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRUaGUgdXNlciBwZXJmb3JtZWQgdGhlIGRyb3AgYWN0aW9uLiBUaGlzIGV2ZW50IGRvZXMgbm90IGluZGljYXRlXG5cdCAqXHRhY2NlcHRhbmNlLCB3bF9kYXRhX3NvdXJjZS5jYW5jZWxsZWQgbWF5IHN0aWxsIGJlIGVtaXR0ZWQgYWZ0ZXJ3YXJkc1xuXHQgKlx0aWYgdGhlIGRyb3AgZGVzdGluYXRpb24gZG9lcyBub3QgYWNjZXB0IGFueSBtaW1lIHR5cGUuXG5cdCAqXG5cdCAqXHRIb3dldmVyLCB0aGlzIGV2ZW50IG1pZ2h0IGhvd2V2ZXIgbm90IGJlIHJlY2VpdmVkIGlmIHRoZSBjb21wb3NpdG9yXG5cdCAqXHRjYW5jZWxsZWQgdGhlIGRyYWctYW5kLWRyb3Agb3BlcmF0aW9uIGJlZm9yZSB0aGlzIGV2ZW50IGNvdWxkIGhhcHBlbi5cblx0ICpcblx0ICpcdE5vdGUgdGhhdCB0aGUgZGF0YV9zb3VyY2UgbWF5IHN0aWxsIGJlIHVzZWQgaW4gdGhlIGZ1dHVyZSBhbmQgc2hvdWxkXG5cdCAqXHRub3QgYmUgZGVzdHJveWVkIGhlcmUuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqXG5cdCAqIEBzaW5jZSAzXG5cdCAqXG5cdCAqL1xuXHRkbmREcm9wUGVyZm9ybWVkKCkge31cblxuXHQvKipcblx0ICpcblx0ICpcdFRoZSBkcm9wIGRlc3RpbmF0aW9uIGZpbmlzaGVkIGludGVyb3BlcmF0aW5nIHdpdGggdGhpcyBkYXRhXG5cdCAqXHRzb3VyY2UsIHNvIHRoZSBjbGllbnQgaXMgbm93IGZyZWUgdG8gZGVzdHJveSB0aGlzIGRhdGEgc291cmNlIGFuZFxuXHQgKlx0ZnJlZSBhbGwgYXNzb2NpYXRlZCBkYXRhLlxuXHQgKlxuXHQgKlx0SWYgdGhlIGFjdGlvbiB1c2VkIHRvIHBlcmZvcm0gdGhlIG9wZXJhdGlvbiB3YXMgXCJtb3ZlXCIsIHRoZVxuXHQgKlx0c291cmNlIGNhbiBub3cgZGVsZXRlIHRoZSB0cmFuc2ZlcnJlZCBkYXRhLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKlxuXHQgKiBAc2luY2UgM1xuXHQgKlxuXHQgKi9cblx0ZG5kRmluaXNoZWQoKSB7fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0VGhpcyBldmVudCBpbmRpY2F0ZXMgdGhlIGFjdGlvbiBzZWxlY3RlZCBieSB0aGUgY29tcG9zaXRvciBhZnRlclxuXHQgKlx0bWF0Y2hpbmcgdGhlIHNvdXJjZS9kZXN0aW5hdGlvbiBzaWRlIGFjdGlvbnMuIE9ubHkgb25lIGFjdGlvbiAob3Jcblx0ICpcdG5vbmUpIHdpbGwgYmUgb2ZmZXJlZCBoZXJlLlxuXHQgKlxuXHQgKlx0VGhpcyBldmVudCBjYW4gYmUgZW1pdHRlZCBtdWx0aXBsZSB0aW1lcyBkdXJpbmcgdGhlIGRyYWctYW5kLWRyb3Bcblx0ICpcdG9wZXJhdGlvbiwgbWFpbmx5IGluIHJlc3BvbnNlIHRvIGRlc3RpbmF0aW9uIHNpZGUgY2hhbmdlcyB0aHJvdWdoXG5cdCAqXHR3bF9kYXRhX29mZmVyLnNldF9hY3Rpb25zLCBhbmQgYXMgdGhlIGRhdGEgZGV2aWNlIGVudGVycy9sZWF2ZXNcblx0ICpcdHN1cmZhY2VzLlxuXHQgKlxuXHQgKlx0SXQgaXMgb25seSBwb3NzaWJsZSB0byByZWNlaXZlIHRoaXMgZXZlbnQgYWZ0ZXJcblx0ICpcdHdsX2RhdGFfc291cmNlLmRuZF9kcm9wX3BlcmZvcm1lZCBpZiB0aGUgZHJhZy1hbmQtZHJvcCBvcGVyYXRpb25cblx0ICpcdGVuZGVkIGluIGFuIFwiYXNrXCIgYWN0aW9uLCBpbiB3aGljaCBjYXNlIHRoZSBmaW5hbCB3bF9kYXRhX3NvdXJjZS5hY3Rpb25cblx0ICpcdGV2ZW50IHdpbGwgaGFwcGVuIGltbWVkaWF0ZWx5IGJlZm9yZSB3bF9kYXRhX3NvdXJjZS5kbmRfZmluaXNoZWQuXG5cdCAqXG5cdCAqXHRDb21wb3NpdG9ycyBtYXkgYWxzbyBjaGFuZ2UgdGhlIHNlbGVjdGVkIGFjdGlvbiBvbiB0aGUgZmx5LCBtYWlubHlcblx0ICpcdGluIHJlc3BvbnNlIHRvIGtleWJvYXJkIG1vZGlmaWVyIGNoYW5nZXMgZHVyaW5nIHRoZSBkcmFnLWFuZC1kcm9wXG5cdCAqXHRvcGVyYXRpb24uXG5cdCAqXG5cdCAqXHRUaGUgbW9zdCByZWNlbnQgYWN0aW9uIHJlY2VpdmVkIGlzIGFsd2F5cyB0aGUgdmFsaWQgb25lLiBUaGUgY2hvc2VuXG5cdCAqXHRhY3Rpb24gbWF5IGNoYW5nZSBhbG9uZ3NpZGUgbmVnb3RpYXRpb24gKGUuZy4gYW4gXCJhc2tcIiBhY3Rpb24gY2FuIHR1cm5cblx0ICpcdGludG8gYSBcIm1vdmVcIiBvcGVyYXRpb24pLCBzbyB0aGUgZWZmZWN0cyBvZiB0aGUgZmluYWwgYWN0aW9uIG11c3Rcblx0ICpcdGFsd2F5cyBiZSBhcHBsaWVkIGluIHdsX2RhdGFfb2ZmZXIuZG5kX2ZpbmlzaGVkLlxuXHQgKlxuXHQgKlx0Q2xpZW50cyBjYW4gdHJpZ2dlciBjdXJzb3Igc3VyZmFjZSBjaGFuZ2VzIGZyb20gdGhpcyBwb2ludCwgc29cblx0ICpcdHRoZXkgcmVmbGVjdCB0aGUgY3VycmVudCBhY3Rpb24uXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBkbmRBY3Rpb24gYWN0aW9uIHNlbGVjdGVkIGJ5IHRoZSBjb21wb3NpdG9yIFxuXHQgKlxuXHQgKiBAc2luY2UgM1xuXHQgKlxuXHQgKi9cblx0YWN0aW9uKGRuZEFjdGlvbikge31cbn1cblxuIiwiLypcbiAqXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAwOC0yMDExIEtyaXN0aWFuIEjDuGdzYmVyZ1xuICogICAgQ29weXJpZ2h0IMKpIDIwMTAtMjAxMSBJbnRlbCBDb3Jwb3JhdGlvblxuICogICAgQ29weXJpZ2h0IMKpIDIwMTItMjAxMyBDb2xsYWJvcmEsIEx0ZC5cbiAqXG4gKiAgICBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogICAgb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXNcbiAqICAgICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqICAgIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiAgICBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogICAgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqICAgIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqICAgIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIChpbmNsdWRpbmcgdGhlXG4gKiAgICBuZXh0IHBhcmFncmFwaCkgc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbFxuICogICAgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqICAgIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiAgICBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0ZcbiAqICAgIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG4gKiAgICBOT05JTkZSSU5HRU1FTlQuICBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSU1xuICogICAgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOXG4gKiAgICBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTlxuICogICAgQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuICogICAgU09GVFdBUkUuXG4gKiAgXG4gKi9cblxuaW1wb3J0IHsgQ29ubmVjdGlvbiB9IGZyb20gJ3dlc3RmaWVsZC1ydW50aW1lLWNvbW1vbidcbmNvbnN0IHsgdWludCwgdWludE9wdGlvbmFsLCBpbnQsIGludE9wdGlvbmFsLCBmaXhlZCwgXG5cdGZpeGVkT3B0aW9uYWwsIG9iamVjdCwgb2JqZWN0T3B0aW9uYWwsIG5ld09iamVjdCwgc3RyaW5nLCBcblx0c3RyaW5nT3B0aW9uYWwsIGFycmF5LCBhcnJheU9wdGlvbmFsLCBcblx0ZmlsZURlc2NyaXB0b3JPcHRpb25hbCwgZmlsZURlc2NyaXB0b3IsIFxuaCwgdSwgaSwgZiwgbywgbiwgcywgYSB9ID0gQ29ubmVjdGlvblxuaW1wb3J0IFByb3h5IGZyb20gJy4vUHJveHknXG5cbi8qKlxuICpcbiAqICAgICAgVGhlIHdsX2RhdGFfc291cmNlIG9iamVjdCBpcyB0aGUgc291cmNlIHNpZGUgb2YgYSB3bF9kYXRhX29mZmVyLlxuICogICAgICBJdCBpcyBjcmVhdGVkIGJ5IHRoZSBzb3VyY2UgY2xpZW50IGluIGEgZGF0YSB0cmFuc2ZlciBhbmRcbiAqICAgICAgcHJvdmlkZXMgYSB3YXkgdG8gZGVzY3JpYmUgdGhlIG9mZmVyZWQgZGF0YSBhbmQgYSB3YXkgdG8gcmVzcG9uZFxuICogICAgICB0byByZXF1ZXN0cyB0byB0cmFuc2ZlciB0aGUgZGF0YS5cbiAqICAgIFxuICovXG5jbGFzcyBXbERhdGFTb3VyY2VQcm94eSBleHRlbmRzIFByb3h5IHtcblxuXHQvKipcblx0ICpcblx0ICpcdFRoaXMgcmVxdWVzdCBhZGRzIGEgbWltZSB0eXBlIHRvIHRoZSBzZXQgb2YgbWltZSB0eXBlc1xuXHQgKlx0YWR2ZXJ0aXNlZCB0byB0YXJnZXRzLiAgQ2FuIGJlIGNhbGxlZCBzZXZlcmFsIHRpbWVzIHRvIG9mZmVyXG5cdCAqXHRtdWx0aXBsZSB0eXBlcy5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IG1pbWVUeXBlIG1pbWUgdHlwZSBvZmZlcmVkIGJ5IHRoZSBkYXRhIHNvdXJjZSBcblx0ICpcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdG9mZmVyIChtaW1lVHlwZSkge1xuXHRcdHRoaXMuZGlzcGxheS5tYXJzaGFsbCh0aGlzLmlkLCAwLCBbc3RyaW5nKG1pbWVUeXBlKV0pXG5cdH1cblxuXHQvKipcblx0ICpcblx0ICpcdERlc3Ryb3kgdGhlIGRhdGEgc291cmNlLlxuXHQgKiAgICAgIFxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0ZGVzdHJveSAoKSB7XG5cdFx0dGhpcy5kaXNwbGF5Lm1hcnNoYWxsKHRoaXMuaWQsIDEsIFtdKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRTZXRzIHRoZSBhY3Rpb25zIHRoYXQgdGhlIHNvdXJjZSBzaWRlIGNsaWVudCBzdXBwb3J0cyBmb3IgdGhpc1xuXHQgKlx0b3BlcmF0aW9uLiBUaGlzIHJlcXVlc3QgbWF5IHRyaWdnZXIgd2xfZGF0YV9zb3VyY2UuYWN0aW9uIGFuZFxuXHQgKlx0d2xfZGF0YV9vZmZlci5hY3Rpb24gZXZlbnRzIGlmIHRoZSBjb21wb3NpdG9yIG5lZWRzIHRvIGNoYW5nZSB0aGVcblx0ICpcdHNlbGVjdGVkIGFjdGlvbi5cblx0ICpcblx0ICpcdFRoZSBkbmRfYWN0aW9ucyBhcmd1bWVudCBtdXN0IGNvbnRhaW4gb25seSB2YWx1ZXMgZXhwcmVzc2VkIGluIHRoZVxuXHQgKlx0d2xfZGF0YV9kZXZpY2VfbWFuYWdlci5kbmRfYWN0aW9ucyBlbnVtLCBvdGhlcndpc2UgaXQgd2lsbCByZXN1bHRcblx0ICpcdGluIGEgcHJvdG9jb2wgZXJyb3IuXG5cdCAqXG5cdCAqXHRUaGlzIHJlcXVlc3QgbXVzdCBiZSBtYWRlIG9uY2Ugb25seSwgYW5kIGNhbiBvbmx5IGJlIG1hZGUgb24gc291cmNlc1xuXHQgKlx0dXNlZCBpbiBkcmFnLWFuZC1kcm9wLCBzbyBpdCBtdXN0IGJlIHBlcmZvcm1lZCBiZWZvcmVcblx0ICpcdHdsX2RhdGFfZGV2aWNlLnN0YXJ0X2RyYWcuIEF0dGVtcHRpbmcgdG8gdXNlIHRoZSBzb3VyY2Ugb3RoZXIgdGhhblxuXHQgKlx0Zm9yIGRyYWctYW5kLWRyb3Agd2lsbCByYWlzZSBhIHByb3RvY29sIGVycm9yLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0ge251bWJlcn0gZG5kQWN0aW9ucyBhY3Rpb25zIHN1cHBvcnRlZCBieSB0aGUgZGF0YSBzb3VyY2UgXG5cdCAqXG5cdCAqIEBzaW5jZSAzXG5cdCAqXG5cdCAqL1xuXHRzZXRBY3Rpb25zIChkbmRBY3Rpb25zKSB7XG5cdFx0dGhpcy5kaXNwbGF5Lm1hcnNoYWxsKHRoaXMuaWQsIDIsIFt1aW50KGRuZEFjdGlvbnMpXSlcblx0fVxuXG4vKipcblx0ICpAcGFyYW0ge0Rpc3BsYXl9ZGlzcGxheVxuXHQgKkBwYXJhbSB7bnVtYmVyfWlkXG5cdCAqL1xuXHRjb25zdHJ1Y3RvciAoZGlzcGxheSwgaWQpIHtcblx0XHRzdXBlcihkaXNwbGF5LCBpZClcblx0XHQvKipcblx0XHQgKiBAdHlwZSB7V2xEYXRhU291cmNlRXZlbnRzfG51bGx9XG5cdFx0ICovXG5cdFx0dGhpcy5saXN0ZW5lciA9IG51bGxcblx0fVxuXG5cdGFzeW5jIFswXSAobWVzc2FnZSkge1xuXHRcdGF3YWl0IHRoaXMubGlzdGVuZXIudGFyZ2V0KHMobWVzc2FnZSwgdHJ1ZSkpXG5cdH1cblxuXHRhc3luYyBbMV0gKG1lc3NhZ2UpIHtcblx0XHRhd2FpdCB0aGlzLmxpc3RlbmVyLnNlbmQocyhtZXNzYWdlLCBmYWxzZSksIGgobWVzc2FnZSkpXG5cdH1cblxuXHRhc3luYyBbMl0gKG1lc3NhZ2UpIHtcblx0XHRhd2FpdCB0aGlzLmxpc3RlbmVyLmNhbmNlbGxlZCgpXG5cdH1cblxuXHRhc3luYyBbM10gKG1lc3NhZ2UpIHtcblx0XHRhd2FpdCB0aGlzLmxpc3RlbmVyLmRuZERyb3BQZXJmb3JtZWQoKVxuXHR9XG5cblx0YXN5bmMgWzRdIChtZXNzYWdlKSB7XG5cdFx0YXdhaXQgdGhpcy5saXN0ZW5lci5kbmRGaW5pc2hlZCgpXG5cdH1cblxuXHRhc3luYyBbNV0gKG1lc3NhZ2UpIHtcblx0XHRhd2FpdCB0aGlzLmxpc3RlbmVyLmFjdGlvbih1KG1lc3NhZ2UpKVxuXHR9XG5cbn1cbldsRGF0YVNvdXJjZVByb3h5LnByb3RvY29sTmFtZSA9ICd3bF9kYXRhX3NvdXJjZSdcblxuV2xEYXRhU291cmNlUHJveHkuRXJyb3IgPSB7XG4gIC8qKlxuICAgKiBhY3Rpb24gbWFzayBjb250YWlucyBpbnZhbGlkIHZhbHVlc1xuICAgKi9cbiAgaW52YWxpZEFjdGlvbk1hc2s6IDAsXG4gIC8qKlxuICAgKiBzb3VyY2UgZG9lc24ndCBhY2NlcHQgdGhpcyByZXF1ZXN0XG4gICAqL1xuICBpbnZhbGlkU291cmNlOiAxXG59XG5cbmV4cG9ydCBkZWZhdWx0IFdsRGF0YVNvdXJjZVByb3h5XG4iLCIvKlxuICpcbiAqICAgIENvcHlyaWdodCDCqSAyMDA4LTIwMTEgS3Jpc3RpYW4gSMO4Z3NiZXJnXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMC0yMDExIEludGVsIENvcnBvcmF0aW9uXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMi0yMDEzIENvbGxhYm9yYSwgTHRkLlxuICpcbiAqICAgIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiAgICBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlc1xuICogICAgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogICAgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqICAgIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiAgICBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogICAgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogICAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2UgKGluY2x1ZGluZyB0aGVcbiAqICAgIG5leHQgcGFyYWdyYXBoKSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsXG4gKiAgICBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogICAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqICAgIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuICogICAgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbiAqICAgIE5PTklORlJJTkdFTUVOVC4gIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTXG4gKiAgICBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU5cbiAqICAgIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOXG4gKiAgICBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4gKiAgICBTT0ZUV0FSRS5cbiAqICBcbiAqL1xuXG4vKipcbiAqIEBpbnRlcmZhY2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2xEaXNwbGF5RXZlbnRzIHtcblxuXHQvKipcblx0ICpcblx0ICpcdFRoZSBlcnJvciBldmVudCBpcyBzZW50IG91dCB3aGVuIGEgZmF0YWwgKG5vbi1yZWNvdmVyYWJsZSlcblx0ICpcdGVycm9yIGhhcyBvY2N1cnJlZC4gIFRoZSBvYmplY3RfaWQgYXJndW1lbnQgaXMgdGhlIG9iamVjdFxuXHQgKlx0d2hlcmUgdGhlIGVycm9yIG9jY3VycmVkLCBtb3N0IG9mdGVuIGluIHJlc3BvbnNlIHRvIGEgcmVxdWVzdFxuXHQgKlx0dG8gdGhhdCBvYmplY3QuICBUaGUgY29kZSBpZGVudGlmaWVzIHRoZSBlcnJvciBhbmQgaXMgZGVmaW5lZFxuXHQgKlx0YnkgdGhlIG9iamVjdCBpbnRlcmZhY2UuICBBcyBzdWNoLCBlYWNoIGludGVyZmFjZSBkZWZpbmVzIGl0c1xuXHQgKlx0b3duIHNldCBvZiBlcnJvciBjb2Rlcy4gIFRoZSBtZXNzYWdlIGlzIGEgYnJpZWYgZGVzY3JpcHRpb25cblx0ICpcdG9mIHRoZSBlcnJvciwgZm9yIChkZWJ1Z2dpbmcpIGNvbnZlbmllbmNlLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0geyp9IG9iamVjdElkIG9iamVjdCB3aGVyZSB0aGUgZXJyb3Igb2NjdXJyZWQgXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBjb2RlIGVycm9yIGNvZGUgXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIGVycm9yIGRlc2NyaXB0aW9uIFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0ZXJyb3Iob2JqZWN0SWQsIGNvZGUsIG1lc3NhZ2UpIHt9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRUaGlzIGV2ZW50IGlzIHVzZWQgaW50ZXJuYWxseSBieSB0aGUgb2JqZWN0IElEIG1hbmFnZW1lbnRcblx0ICpcdGxvZ2ljLiAgV2hlbiBhIGNsaWVudCBkZWxldGVzIGFuIG9iamVjdCwgdGhlIHNlcnZlciB3aWxsIHNlbmRcblx0ICpcdHRoaXMgZXZlbnQgdG8gYWNrbm93bGVkZ2UgdGhhdCBpdCBoYXMgc2VlbiB0aGUgZGVsZXRlIHJlcXVlc3QuXG5cdCAqXHRXaGVuIHRoZSBjbGllbnQgcmVjZWl2ZXMgdGhpcyBldmVudCwgaXQgd2lsbCBrbm93IHRoYXQgaXQgY2FuXG5cdCAqXHRzYWZlbHkgcmV1c2UgdGhlIG9iamVjdCBJRC5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHtudW1iZXJ9IGlkIGRlbGV0ZWQgb2JqZWN0IElEIFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0ZGVsZXRlSWQoaWQpIHt9XG59XG5cbiIsIi8qXG4gKlxuICogICAgQ29weXJpZ2h0IMKpIDIwMDgtMjAxMSBLcmlzdGlhbiBIw7hnc2JlcmdcbiAqICAgIENvcHlyaWdodCDCqSAyMDEwLTIwMTEgSW50ZWwgQ29ycG9yYXRpb25cbiAqICAgIENvcHlyaWdodCDCqSAyMDEyLTIwMTMgQ29sbGFib3JhLCBMdGQuXG4gKlxuICogICAgUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqICAgIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzXG4gKiAgICAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiAgICBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogICAgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqICAgIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiAgICBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiAgICBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSAoaW5jbHVkaW5nIHRoZVxuICogICAgbmV4dCBwYXJhZ3JhcGgpIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWxcbiAqICAgIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiAgICBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogICAgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4gKiAgICBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuICogICAgTk9OSU5GUklOR0VNRU5ULiAgSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlNcbiAqICAgIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTlxuICogICAgQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU5cbiAqICAgIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbiAqICAgIFNPRlRXQVJFLlxuICogIFxuICovXG5cbmltcG9ydCB7IENvbm5lY3Rpb24gfSBmcm9tICd3ZXN0ZmllbGQtcnVudGltZS1jb21tb24nXG5jb25zdCB7IHVpbnQsIHVpbnRPcHRpb25hbCwgaW50LCBpbnRPcHRpb25hbCwgZml4ZWQsIFxuXHRmaXhlZE9wdGlvbmFsLCBvYmplY3QsIG9iamVjdE9wdGlvbmFsLCBuZXdPYmplY3QsIHN0cmluZywgXG5cdHN0cmluZ09wdGlvbmFsLCBhcnJheSwgYXJyYXlPcHRpb25hbCwgXG5cdGZpbGVEZXNjcmlwdG9yT3B0aW9uYWwsIGZpbGVEZXNjcmlwdG9yLCBcbmgsIHUsIGksIGYsIG8sIG4sIHMsIGEgfSA9IENvbm5lY3Rpb25cbmltcG9ydCBQcm94eSBmcm9tICcuL1Byb3h5J1xuaW1wb3J0IFdsQ2FsbGJhY2tQcm94eSBmcm9tICcuL1dsQ2FsbGJhY2tQcm94eSdcbmltcG9ydCBXbFJlZ2lzdHJ5UHJveHkgZnJvbSAnLi9XbFJlZ2lzdHJ5UHJveHknXG5cbi8qKlxuICpcbiAqICAgICAgVGhlIGNvcmUgZ2xvYmFsIG9iamVjdC4gIFRoaXMgaXMgYSBzcGVjaWFsIHNpbmdsZXRvbiBvYmplY3QuICBJdFxuICogICAgICBpcyB1c2VkIGZvciBpbnRlcm5hbCBXYXlsYW5kIHByb3RvY29sIGZlYXR1cmVzLlxuICogICAgXG4gKi9cbmNsYXNzIFdsRGlzcGxheVByb3h5IGV4dGVuZHMgUHJveHkge1xuXG5cdC8qKlxuXHQgKlxuXHQgKlx0VGhlIHN5bmMgcmVxdWVzdCBhc2tzIHRoZSBzZXJ2ZXIgdG8gZW1pdCB0aGUgJ2RvbmUnIGV2ZW50XG5cdCAqXHRvbiB0aGUgcmV0dXJuZWQgd2xfY2FsbGJhY2sgb2JqZWN0LiAgU2luY2UgcmVxdWVzdHMgYXJlXG5cdCAqXHRoYW5kbGVkIGluLW9yZGVyIGFuZCBldmVudHMgYXJlIGRlbGl2ZXJlZCBpbi1vcmRlciwgdGhpcyBjYW5cblx0ICpcdGJlIHVzZWQgYXMgYSBiYXJyaWVyIHRvIGVuc3VyZSBhbGwgcHJldmlvdXMgcmVxdWVzdHMgYW5kIHRoZVxuXHQgKlx0cmVzdWx0aW5nIGV2ZW50cyBoYXZlIGJlZW4gaGFuZGxlZC5cblx0ICpcblx0ICpcdFRoZSBvYmplY3QgcmV0dXJuZWQgYnkgdGhpcyByZXF1ZXN0IHdpbGwgYmUgZGVzdHJveWVkIGJ5IHRoZVxuXHQgKlx0Y29tcG9zaXRvciBhZnRlciB0aGUgY2FsbGJhY2sgaXMgZmlyZWQgYW5kIGFzIHN1Y2ggdGhlIGNsaWVudCBtdXN0IG5vdFxuXHQgKlx0YXR0ZW1wdCB0byB1c2UgaXQgYWZ0ZXIgdGhhdCBwb2ludC5cblx0ICpcblx0ICpcdFRoZSBjYWxsYmFja19kYXRhIHBhc3NlZCBpbiB0aGUgY2FsbGJhY2sgaXMgdGhlIGV2ZW50IHNlcmlhbC5cblx0ICogICAgICBcblx0ICpcblx0ICogQHJldHVybiB7V2xDYWxsYmFja1Byb3h5fSBjYWxsYmFjayBvYmplY3QgZm9yIHRoZSBzeW5jIHJlcXVlc3QgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRzeW5jICgpIHtcblx0XHRyZXR1cm4gdGhpcy5kaXNwbGF5Lm1hcnNoYWxsQ29uc3RydWN0b3IodGhpcy5pZCwgMCwgV2xDYWxsYmFja1Byb3h5LCBbbmV3T2JqZWN0KCldKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRUaGlzIHJlcXVlc3QgY3JlYXRlcyBhIHJlZ2lzdHJ5IG9iamVjdCB0aGF0IGFsbG93cyB0aGUgY2xpZW50XG5cdCAqXHR0byBsaXN0IGFuZCBiaW5kIHRoZSBnbG9iYWwgb2JqZWN0cyBhdmFpbGFibGUgZnJvbSB0aGVcblx0ICpcdGNvbXBvc2l0b3IuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEByZXR1cm4ge1dsUmVnaXN0cnlQcm94eX0gZ2xvYmFsIHJlZ2lzdHJ5IG9iamVjdCBcblx0ICpcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdGdldFJlZ2lzdHJ5ICgpIHtcblx0XHRyZXR1cm4gdGhpcy5kaXNwbGF5Lm1hcnNoYWxsQ29uc3RydWN0b3IodGhpcy5pZCwgMSwgV2xSZWdpc3RyeVByb3h5LCBbbmV3T2JqZWN0KCldKVxuXHR9XG5cbi8qKlxuXHQgKkBwYXJhbSB7RGlzcGxheX1kaXNwbGF5XG5cdCAqQHBhcmFtIHtudW1iZXJ9aWRcblx0ICovXG5cdGNvbnN0cnVjdG9yIChkaXNwbGF5LCBpZCkge1xuXHRcdHN1cGVyKGRpc3BsYXksIGlkKVxuXHRcdC8qKlxuXHRcdCAqIEB0eXBlIHtXbERpc3BsYXlFdmVudHN8bnVsbH1cblx0XHQgKi9cblx0XHR0aGlzLmxpc3RlbmVyID0gbnVsbFxuXHR9XG5cblx0YXN5bmMgWzBdIChtZXNzYWdlKSB7XG5cdFx0YXdhaXQgdGhpcy5saXN0ZW5lci5lcnJvcihvKG1lc3NhZ2UsIGZhbHNlLCB0aGlzLmRpc3BsYXkuY29ubmVjdGlvbiksIHUobWVzc2FnZSksIHMobWVzc2FnZSwgZmFsc2UpKVxuXHR9XG5cblx0YXN5bmMgWzFdIChtZXNzYWdlKSB7XG5cdFx0YXdhaXQgdGhpcy5saXN0ZW5lci5kZWxldGVJZCh1KG1lc3NhZ2UpKVxuXHR9XG5cbn1cbldsRGlzcGxheVByb3h5LnByb3RvY29sTmFtZSA9ICd3bF9kaXNwbGF5J1xuXG5XbERpc3BsYXlQcm94eS5FcnJvciA9IHtcbiAgLyoqXG4gICAqIHNlcnZlciBjb3VsZG4ndCBmaW5kIG9iamVjdFxuICAgKi9cbiAgaW52YWxpZE9iamVjdDogMCxcbiAgLyoqXG4gICAqIG1ldGhvZCBkb2Vzbid0IGV4aXN0IG9uIHRoZSBzcGVjaWZpZWQgaW50ZXJmYWNlXG4gICAqL1xuICBpbnZhbGlkTWV0aG9kOiAxLFxuICAvKipcbiAgICogc2VydmVyIGlzIG91dCBvZiBtZW1vcnlcbiAgICovXG4gIG5vTWVtb3J5OiAyXG59XG5cbmV4cG9ydCBkZWZhdWx0IFdsRGlzcGxheVByb3h5XG4iLCIvKlxuICpcbiAqICAgIENvcHlyaWdodCDCqSAyMDA4LTIwMTEgS3Jpc3RpYW4gSMO4Z3NiZXJnXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMC0yMDExIEludGVsIENvcnBvcmF0aW9uXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMi0yMDEzIENvbGxhYm9yYSwgTHRkLlxuICpcbiAqICAgIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiAgICBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlc1xuICogICAgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogICAgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqICAgIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiAgICBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogICAgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogICAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2UgKGluY2x1ZGluZyB0aGVcbiAqICAgIG5leHQgcGFyYWdyYXBoKSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsXG4gKiAgICBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogICAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqICAgIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuICogICAgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbiAqICAgIE5PTklORlJJTkdFTUVOVC4gIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTXG4gKiAgICBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU5cbiAqICAgIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOXG4gKiAgICBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4gKiAgICBTT0ZUV0FSRS5cbiAqICBcbiAqL1xuXG4vKipcbiAqIEBpbnRlcmZhY2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2xLZXlib2FyZEV2ZW50cyB7XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRUaGlzIGV2ZW50IHByb3ZpZGVzIGEgZmlsZSBkZXNjcmlwdG9yIHRvIHRoZSBjbGllbnQgd2hpY2ggY2FuIGJlXG5cdCAqXHRtZW1vcnktbWFwcGVkIHRvIHByb3ZpZGUgYSBrZXlib2FyZCBtYXBwaW5nIGRlc2NyaXB0aW9uLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0ge251bWJlcn0gZm9ybWF0IGtleW1hcCBmb3JtYXQgXG5cdCAqIEBwYXJhbSB7V2ViRkR9IGZkIGtleW1hcCBmaWxlIGRlc2NyaXB0b3IgXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBzaXplIGtleW1hcCBzaXplLCBpbiBieXRlcyBcblx0ICpcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdGtleW1hcChmb3JtYXQsIGZkLCBzaXplKSB7fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0Tm90aWZpY2F0aW9uIHRoYXQgdGhpcyBzZWF0J3Mga2V5Ym9hcmQgZm9jdXMgaXMgb24gYSBjZXJ0YWluXG5cdCAqXHRzdXJmYWNlLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0ge251bWJlcn0gc2VyaWFsIHNlcmlhbCBudW1iZXIgb2YgdGhlIGVudGVyIGV2ZW50IFxuXHQgKiBAcGFyYW0geyp9IHN1cmZhY2Ugc3VyZmFjZSBnYWluaW5nIGtleWJvYXJkIGZvY3VzIFxuXHQgKiBAcGFyYW0ge0FycmF5QnVmZmVyfSBrZXlzIHRoZSBjdXJyZW50bHkgcHJlc3NlZCBrZXlzIFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0ZW50ZXIoc2VyaWFsLCBzdXJmYWNlLCBrZXlzKSB7fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0Tm90aWZpY2F0aW9uIHRoYXQgdGhpcyBzZWF0J3Mga2V5Ym9hcmQgZm9jdXMgaXMgbm8gbG9uZ2VyIG9uXG5cdCAqXHRhIGNlcnRhaW4gc3VyZmFjZS5cblx0ICpcblx0ICpcdFRoZSBsZWF2ZSBub3RpZmljYXRpb24gaXMgc2VudCBiZWZvcmUgdGhlIGVudGVyIG5vdGlmaWNhdGlvblxuXHQgKlx0Zm9yIHRoZSBuZXcgZm9jdXMuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBzZXJpYWwgc2VyaWFsIG51bWJlciBvZiB0aGUgbGVhdmUgZXZlbnQgXG5cdCAqIEBwYXJhbSB7Kn0gc3VyZmFjZSBzdXJmYWNlIHRoYXQgbG9zdCBrZXlib2FyZCBmb2N1cyBcblx0ICpcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdGxlYXZlKHNlcmlhbCwgc3VyZmFjZSkge31cblxuXHQvKipcblx0ICpcblx0ICpcdEEga2V5IHdhcyBwcmVzc2VkIG9yIHJlbGVhc2VkLlxuXHQgKlx0VGhlIHRpbWUgYXJndW1lbnQgaXMgYSB0aW1lc3RhbXAgd2l0aCBtaWxsaXNlY29uZFxuXHQgKlx0Z3JhbnVsYXJpdHksIHdpdGggYW4gdW5kZWZpbmVkIGJhc2UuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBzZXJpYWwgc2VyaWFsIG51bWJlciBvZiB0aGUga2V5IGV2ZW50IFxuXHQgKiBAcGFyYW0ge251bWJlcn0gdGltZSB0aW1lc3RhbXAgd2l0aCBtaWxsaXNlY29uZCBncmFudWxhcml0eSBcblx0ICogQHBhcmFtIHtudW1iZXJ9IGtleSBrZXkgdGhhdCBwcm9kdWNlZCB0aGUgZXZlbnQgXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBzdGF0ZSBwaHlzaWNhbCBzdGF0ZSBvZiB0aGUga2V5IFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0a2V5KHNlcmlhbCwgdGltZSwga2V5LCBzdGF0ZSkge31cblxuXHQvKipcblx0ICpcblx0ICpcdE5vdGlmaWVzIGNsaWVudHMgdGhhdCB0aGUgbW9kaWZpZXIgYW5kL29yIGdyb3VwIHN0YXRlIGhhc1xuXHQgKlx0Y2hhbmdlZCwgYW5kIGl0IHNob3VsZCB1cGRhdGUgaXRzIGxvY2FsIHN0YXRlLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0ge251bWJlcn0gc2VyaWFsIHNlcmlhbCBudW1iZXIgb2YgdGhlIG1vZGlmaWVycyBldmVudCBcblx0ICogQHBhcmFtIHtudW1iZXJ9IG1vZHNEZXByZXNzZWQgZGVwcmVzc2VkIG1vZGlmaWVycyBcblx0ICogQHBhcmFtIHtudW1iZXJ9IG1vZHNMYXRjaGVkIGxhdGNoZWQgbW9kaWZpZXJzIFxuXHQgKiBAcGFyYW0ge251bWJlcn0gbW9kc0xvY2tlZCBsb2NrZWQgbW9kaWZpZXJzIFxuXHQgKiBAcGFyYW0ge251bWJlcn0gZ3JvdXAga2V5Ym9hcmQgbGF5b3V0IFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0bW9kaWZpZXJzKHNlcmlhbCwgbW9kc0RlcHJlc3NlZCwgbW9kc0xhdGNoZWQsIG1vZHNMb2NrZWQsIGdyb3VwKSB7fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0SW5mb3JtcyB0aGUgY2xpZW50IGFib3V0IHRoZSBrZXlib2FyZCdzIHJlcGVhdCByYXRlIGFuZCBkZWxheS5cblx0ICpcblx0ICpcdFRoaXMgZXZlbnQgaXMgc2VudCBhcyBzb29uIGFzIHRoZSB3bF9rZXlib2FyZCBvYmplY3QgaGFzIGJlZW4gY3JlYXRlZCxcblx0ICpcdGFuZCBpcyBndWFyYW50ZWVkIHRvIGJlIHJlY2VpdmVkIGJ5IHRoZSBjbGllbnQgYmVmb3JlIGFueSBrZXkgcHJlc3Ncblx0ICpcdGV2ZW50LlxuXHQgKlxuXHQgKlx0TmVnYXRpdmUgdmFsdWVzIGZvciBlaXRoZXIgcmF0ZSBvciBkZWxheSBhcmUgaWxsZWdhbC4gQSByYXRlIG9mIHplcm9cblx0ICpcdHdpbGwgZGlzYWJsZSBhbnkgcmVwZWF0aW5nIChyZWdhcmRsZXNzIG9mIHRoZSB2YWx1ZSBvZiBkZWxheSkuXG5cdCAqXG5cdCAqXHRUaGlzIGV2ZW50IGNhbiBiZSBzZW50IGxhdGVyIG9uIGFzIHdlbGwgd2l0aCBhIG5ldyB2YWx1ZSBpZiBuZWNlc3NhcnksXG5cdCAqXHRzbyBjbGllbnRzIHNob3VsZCBjb250aW51ZSBsaXN0ZW5pbmcgZm9yIHRoZSBldmVudCBwYXN0IHRoZSBjcmVhdGlvblxuXHQgKlx0b2Ygd2xfa2V5Ym9hcmQuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSByYXRlIHRoZSByYXRlIG9mIHJlcGVhdGluZyBrZXlzIGluIGNoYXJhY3RlcnMgcGVyIHNlY29uZCBcblx0ICogQHBhcmFtIHtudW1iZXJ9IGRlbGF5IGRlbGF5IGluIG1pbGxpc2Vjb25kcyBzaW5jZSBrZXkgZG93biB1bnRpbCByZXBlYXRpbmcgc3RhcnRzIFxuXHQgKlxuXHQgKiBAc2luY2UgNFxuXHQgKlxuXHQgKi9cblx0cmVwZWF0SW5mbyhyYXRlLCBkZWxheSkge31cbn1cblxuIiwiLypcbiAqXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAwOC0yMDExIEtyaXN0aWFuIEjDuGdzYmVyZ1xuICogICAgQ29weXJpZ2h0IMKpIDIwMTAtMjAxMSBJbnRlbCBDb3Jwb3JhdGlvblxuICogICAgQ29weXJpZ2h0IMKpIDIwMTItMjAxMyBDb2xsYWJvcmEsIEx0ZC5cbiAqXG4gKiAgICBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogICAgb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXNcbiAqICAgICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqICAgIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiAgICBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogICAgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqICAgIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqICAgIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIChpbmNsdWRpbmcgdGhlXG4gKiAgICBuZXh0IHBhcmFncmFwaCkgc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbFxuICogICAgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqICAgIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiAgICBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0ZcbiAqICAgIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG4gKiAgICBOT05JTkZSSU5HRU1FTlQuICBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSU1xuICogICAgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOXG4gKiAgICBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTlxuICogICAgQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuICogICAgU09GVFdBUkUuXG4gKiAgXG4gKi9cblxuaW1wb3J0IHsgQ29ubmVjdGlvbiB9IGZyb20gJ3dlc3RmaWVsZC1ydW50aW1lLWNvbW1vbidcbmNvbnN0IHsgdWludCwgdWludE9wdGlvbmFsLCBpbnQsIGludE9wdGlvbmFsLCBmaXhlZCwgXG5cdGZpeGVkT3B0aW9uYWwsIG9iamVjdCwgb2JqZWN0T3B0aW9uYWwsIG5ld09iamVjdCwgc3RyaW5nLCBcblx0c3RyaW5nT3B0aW9uYWwsIGFycmF5LCBhcnJheU9wdGlvbmFsLCBcblx0ZmlsZURlc2NyaXB0b3JPcHRpb25hbCwgZmlsZURlc2NyaXB0b3IsIFxuaCwgdSwgaSwgZiwgbywgbiwgcywgYSB9ID0gQ29ubmVjdGlvblxuaW1wb3J0IFByb3h5IGZyb20gJy4vUHJveHknXG5cbi8qKlxuICpcbiAqICAgICAgVGhlIHdsX2tleWJvYXJkIGludGVyZmFjZSByZXByZXNlbnRzIG9uZSBvciBtb3JlIGtleWJvYXJkc1xuICogICAgICBhc3NvY2lhdGVkIHdpdGggYSBzZWF0LlxuICogICAgXG4gKi9cbmNsYXNzIFdsS2V5Ym9hcmRQcm94eSBleHRlbmRzIFByb3h5IHtcblxuXHQvKipcblx0ICogQHNpbmNlIDNcblx0ICpcblx0ICovXG5cdHJlbGVhc2UgKCkge1xuXHRcdHRoaXMuZGlzcGxheS5tYXJzaGFsbCh0aGlzLmlkLCAwLCBbXSlcblx0fVxuXG4vKipcblx0ICpAcGFyYW0ge0Rpc3BsYXl9ZGlzcGxheVxuXHQgKkBwYXJhbSB7bnVtYmVyfWlkXG5cdCAqL1xuXHRjb25zdHJ1Y3RvciAoZGlzcGxheSwgaWQpIHtcblx0XHRzdXBlcihkaXNwbGF5LCBpZClcblx0XHQvKipcblx0XHQgKiBAdHlwZSB7V2xLZXlib2FyZEV2ZW50c3xudWxsfVxuXHRcdCAqL1xuXHRcdHRoaXMubGlzdGVuZXIgPSBudWxsXG5cdH1cblxuXHRhc3luYyBbMF0gKG1lc3NhZ2UpIHtcblx0XHRhd2FpdCB0aGlzLmxpc3RlbmVyLmtleW1hcCh1KG1lc3NhZ2UpLCBoKG1lc3NhZ2UpLCB1KG1lc3NhZ2UpKVxuXHR9XG5cblx0YXN5bmMgWzFdIChtZXNzYWdlKSB7XG5cdFx0YXdhaXQgdGhpcy5saXN0ZW5lci5lbnRlcih1KG1lc3NhZ2UpLCBvKG1lc3NhZ2UsIGZhbHNlLCB0aGlzLmRpc3BsYXkuY29ubmVjdGlvbiksIGEobWVzc2FnZSwgZmFsc2UpKVxuXHR9XG5cblx0YXN5bmMgWzJdIChtZXNzYWdlKSB7XG5cdFx0YXdhaXQgdGhpcy5saXN0ZW5lci5sZWF2ZSh1KG1lc3NhZ2UpLCBvKG1lc3NhZ2UsIGZhbHNlLCB0aGlzLmRpc3BsYXkuY29ubmVjdGlvbikpXG5cdH1cblxuXHRhc3luYyBbM10gKG1lc3NhZ2UpIHtcblx0XHRhd2FpdCB0aGlzLmxpc3RlbmVyLmtleSh1KG1lc3NhZ2UpLCB1KG1lc3NhZ2UpLCB1KG1lc3NhZ2UpLCB1KG1lc3NhZ2UpKVxuXHR9XG5cblx0YXN5bmMgWzRdIChtZXNzYWdlKSB7XG5cdFx0YXdhaXQgdGhpcy5saXN0ZW5lci5tb2RpZmllcnModShtZXNzYWdlKSwgdShtZXNzYWdlKSwgdShtZXNzYWdlKSwgdShtZXNzYWdlKSwgdShtZXNzYWdlKSlcblx0fVxuXG5cdGFzeW5jIFs1XSAobWVzc2FnZSkge1xuXHRcdGF3YWl0IHRoaXMubGlzdGVuZXIucmVwZWF0SW5mbyhpKG1lc3NhZ2UpLCBpKG1lc3NhZ2UpKVxuXHR9XG5cbn1cbldsS2V5Ym9hcmRQcm94eS5wcm90b2NvbE5hbWUgPSAnd2xfa2V5Ym9hcmQnXG5cbldsS2V5Ym9hcmRQcm94eS5LZXltYXBGb3JtYXQgPSB7XG4gIC8qKlxuICAgKiBubyBrZXltYXA7IGNsaWVudCBtdXN0IHVuZGVyc3RhbmQgaG93IHRvIGludGVycHJldCB0aGUgcmF3IGtleWNvZGVcbiAgICovXG4gIG5vS2V5bWFwOiAwLFxuICAvKipcbiAgICogbGlieGtiY29tbW9uIGNvbXBhdGlibGU7IHRvIGRldGVybWluZSB0aGUgeGtiIGtleWNvZGUsIGNsaWVudHMgbXVzdCBhZGQgOCB0byB0aGUga2V5IGV2ZW50IGtleWNvZGVcbiAgICovXG4gIHhrYlYxOiAxXG59XG5cbldsS2V5Ym9hcmRQcm94eS5LZXlTdGF0ZSA9IHtcbiAgLyoqXG4gICAqIGtleSBpcyBub3QgcHJlc3NlZFxuICAgKi9cbiAgcmVsZWFzZWQ6IDAsXG4gIC8qKlxuICAgKiBrZXkgaXMgcHJlc3NlZFxuICAgKi9cbiAgcHJlc3NlZDogMVxufVxuXG5leHBvcnQgZGVmYXVsdCBXbEtleWJvYXJkUHJveHlcbiIsIi8qXG4gKlxuICogICAgQ29weXJpZ2h0IMKpIDIwMDgtMjAxMSBLcmlzdGlhbiBIw7hnc2JlcmdcbiAqICAgIENvcHlyaWdodCDCqSAyMDEwLTIwMTEgSW50ZWwgQ29ycG9yYXRpb25cbiAqICAgIENvcHlyaWdodCDCqSAyMDEyLTIwMTMgQ29sbGFib3JhLCBMdGQuXG4gKlxuICogICAgUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqICAgIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzXG4gKiAgICAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiAgICBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogICAgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqICAgIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiAgICBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiAgICBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSAoaW5jbHVkaW5nIHRoZVxuICogICAgbmV4dCBwYXJhZ3JhcGgpIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWxcbiAqICAgIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiAgICBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogICAgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4gKiAgICBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuICogICAgTk9OSU5GUklOR0VNRU5ULiAgSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlNcbiAqICAgIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTlxuICogICAgQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU5cbiAqICAgIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbiAqICAgIFNPRlRXQVJFLlxuICogIFxuICovXG5cbi8qKlxuICogQGludGVyZmFjZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXbE91dHB1dEV2ZW50cyB7XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRUaGUgZ2VvbWV0cnkgZXZlbnQgZGVzY3JpYmVzIGdlb21ldHJpYyBwcm9wZXJ0aWVzIG9mIHRoZSBvdXRwdXQuXG5cdCAqXHRUaGUgZXZlbnQgaXMgc2VudCB3aGVuIGJpbmRpbmcgdG8gdGhlIG91dHB1dCBvYmplY3QgYW5kIHdoZW5ldmVyXG5cdCAqXHRhbnkgb2YgdGhlIHByb3BlcnRpZXMgY2hhbmdlLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0ge251bWJlcn0geCB4IHBvc2l0aW9uIHdpdGhpbiB0aGUgZ2xvYmFsIGNvbXBvc2l0b3Igc3BhY2UgXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB5IHkgcG9zaXRpb24gd2l0aGluIHRoZSBnbG9iYWwgY29tcG9zaXRvciBzcGFjZSBcblx0ICogQHBhcmFtIHtudW1iZXJ9IHBoeXNpY2FsV2lkdGggd2lkdGggaW4gbWlsbGltZXRlcnMgb2YgdGhlIG91dHB1dCBcblx0ICogQHBhcmFtIHtudW1iZXJ9IHBoeXNpY2FsSGVpZ2h0IGhlaWdodCBpbiBtaWxsaW1ldGVycyBvZiB0aGUgb3V0cHV0IFxuXHQgKiBAcGFyYW0ge251bWJlcn0gc3VicGl4ZWwgc3VicGl4ZWwgb3JpZW50YXRpb24gb2YgdGhlIG91dHB1dCBcblx0ICogQHBhcmFtIHtzdHJpbmd9IG1ha2UgdGV4dHVhbCBkZXNjcmlwdGlvbiBvZiB0aGUgbWFudWZhY3R1cmVyIFxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbW9kZWwgdGV4dHVhbCBkZXNjcmlwdGlvbiBvZiB0aGUgbW9kZWwgXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB0cmFuc2Zvcm0gdHJhbnNmb3JtIHRoYXQgbWFwcyBmcmFtZWJ1ZmZlciB0byBvdXRwdXQgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRnZW9tZXRyeSh4LCB5LCBwaHlzaWNhbFdpZHRoLCBwaHlzaWNhbEhlaWdodCwgc3VicGl4ZWwsIG1ha2UsIG1vZGVsLCB0cmFuc2Zvcm0pIHt9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRUaGUgbW9kZSBldmVudCBkZXNjcmliZXMgYW4gYXZhaWxhYmxlIG1vZGUgZm9yIHRoZSBvdXRwdXQuXG5cdCAqXG5cdCAqXHRUaGUgZXZlbnQgaXMgc2VudCB3aGVuIGJpbmRpbmcgdG8gdGhlIG91dHB1dCBvYmplY3QgYW5kIHRoZXJlXG5cdCAqXHR3aWxsIGFsd2F5cyBiZSBvbmUgbW9kZSwgdGhlIGN1cnJlbnQgbW9kZS4gIFRoZSBldmVudCBpcyBzZW50XG5cdCAqXHRhZ2FpbiBpZiBhbiBvdXRwdXQgY2hhbmdlcyBtb2RlLCBmb3IgdGhlIG1vZGUgdGhhdCBpcyBub3dcblx0ICpcdGN1cnJlbnQuICBJbiBvdGhlciB3b3JkcywgdGhlIGN1cnJlbnQgbW9kZSBpcyBhbHdheXMgdGhlIGxhc3Rcblx0ICpcdG1vZGUgdGhhdCB3YXMgcmVjZWl2ZWQgd2l0aCB0aGUgY3VycmVudCBmbGFnIHNldC5cblx0ICpcblx0ICpcdFRoZSBzaXplIG9mIGEgbW9kZSBpcyBnaXZlbiBpbiBwaHlzaWNhbCBoYXJkd2FyZSB1bml0cyBvZlxuXHQgKlx0dGhlIG91dHB1dCBkZXZpY2UuIFRoaXMgaXMgbm90IG5lY2Vzc2FyaWx5IHRoZSBzYW1lIGFzXG5cdCAqXHR0aGUgb3V0cHV0IHNpemUgaW4gdGhlIGdsb2JhbCBjb21wb3NpdG9yIHNwYWNlLiBGb3IgaW5zdGFuY2UsXG5cdCAqXHR0aGUgb3V0cHV0IG1heSBiZSBzY2FsZWQsIGFzIGRlc2NyaWJlZCBpbiB3bF9vdXRwdXQuc2NhbGUsXG5cdCAqXHRvciB0cmFuc2Zvcm1lZCwgYXMgZGVzY3JpYmVkIGluIHdsX291dHB1dC50cmFuc2Zvcm0uXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBmbGFncyBiaXRmaWVsZCBvZiBtb2RlIGZsYWdzIFxuXHQgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggd2lkdGggb2YgdGhlIG1vZGUgaW4gaGFyZHdhcmUgdW5pdHMgXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgaGVpZ2h0IG9mIHRoZSBtb2RlIGluIGhhcmR3YXJlIHVuaXRzIFxuXHQgKiBAcGFyYW0ge251bWJlcn0gcmVmcmVzaCB2ZXJ0aWNhbCByZWZyZXNoIHJhdGUgaW4gbUh6IFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0bW9kZShmbGFncywgd2lkdGgsIGhlaWdodCwgcmVmcmVzaCkge31cblxuXHQvKipcblx0ICpcblx0ICpcdFRoaXMgZXZlbnQgaXMgc2VudCBhZnRlciBhbGwgb3RoZXIgcHJvcGVydGllcyBoYXZlIGJlZW5cblx0ICpcdHNlbnQgYWZ0ZXIgYmluZGluZyB0byB0aGUgb3V0cHV0IG9iamVjdCBhbmQgYWZ0ZXIgYW55XG5cdCAqXHRvdGhlciBwcm9wZXJ0eSBjaGFuZ2VzIGRvbmUgYWZ0ZXIgdGhhdC4gVGhpcyBhbGxvd3Ncblx0ICpcdGNoYW5nZXMgdG8gdGhlIG91dHB1dCBwcm9wZXJ0aWVzIHRvIGJlIHNlZW4gYXNcblx0ICpcdGF0b21pYywgZXZlbiBpZiB0aGV5IGhhcHBlbiB2aWEgbXVsdGlwbGUgZXZlbnRzLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKlxuXHQgKiBAc2luY2UgMlxuXHQgKlxuXHQgKi9cblx0ZG9uZSgpIHt9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRUaGlzIGV2ZW50IGNvbnRhaW5zIHNjYWxpbmcgZ2VvbWV0cnkgaW5mb3JtYXRpb25cblx0ICpcdHRoYXQgaXMgbm90IGluIHRoZSBnZW9tZXRyeSBldmVudC4gSXQgbWF5IGJlIHNlbnQgYWZ0ZXJcblx0ICpcdGJpbmRpbmcgdGhlIG91dHB1dCBvYmplY3Qgb3IgaWYgdGhlIG91dHB1dCBzY2FsZSBjaGFuZ2VzXG5cdCAqXHRsYXRlci4gSWYgaXQgaXMgbm90IHNlbnQsIHRoZSBjbGllbnQgc2hvdWxkIGFzc3VtZSBhXG5cdCAqXHRzY2FsZSBvZiAxLlxuXHQgKlxuXHQgKlx0QSBzY2FsZSBsYXJnZXIgdGhhbiAxIG1lYW5zIHRoYXQgdGhlIGNvbXBvc2l0b3Igd2lsbFxuXHQgKlx0YXV0b21hdGljYWxseSBzY2FsZSBzdXJmYWNlIGJ1ZmZlcnMgYnkgdGhpcyBhbW91bnRcblx0ICpcdHdoZW4gcmVuZGVyaW5nLiBUaGlzIGlzIHVzZWQgZm9yIHZlcnkgaGlnaCByZXNvbHV0aW9uXG5cdCAqXHRkaXNwbGF5cyB3aGVyZSBhcHBsaWNhdGlvbnMgcmVuZGVyaW5nIGF0IHRoZSBuYXRpdmVcblx0ICpcdHJlc29sdXRpb24gd291bGQgYmUgdG9vIHNtYWxsIHRvIGJlIGxlZ2libGUuXG5cdCAqXG5cdCAqXHRJdCBpcyBpbnRlbmRlZCB0aGF0IHNjYWxpbmcgYXdhcmUgY2xpZW50cyB0cmFjayB0aGVcblx0ICpcdGN1cnJlbnQgb3V0cHV0IG9mIGEgc3VyZmFjZSwgYW5kIGlmIGl0IGlzIG9uIGEgc2NhbGVkXG5cdCAqXHRvdXRwdXQgaXQgc2hvdWxkIHVzZSB3bF9zdXJmYWNlLnNldF9idWZmZXJfc2NhbGUgd2l0aFxuXHQgKlx0dGhlIHNjYWxlIG9mIHRoZSBvdXRwdXQuIFRoYXQgd2F5IHRoZSBjb21wb3NpdG9yIGNhblxuXHQgKlx0YXZvaWQgc2NhbGluZyB0aGUgc3VyZmFjZSwgYW5kIHRoZSBjbGllbnQgY2FuIHN1cHBseVxuXHQgKlx0YSBoaWdoZXIgZGV0YWlsIGltYWdlLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0ge251bWJlcn0gZmFjdG9yIHNjYWxpbmcgZmFjdG9yIG9mIG91dHB1dCBcblx0ICpcblx0ICogQHNpbmNlIDJcblx0ICpcblx0ICovXG5cdHNjYWxlKGZhY3Rvcikge31cbn1cblxuIiwiLypcbiAqXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAwOC0yMDExIEtyaXN0aWFuIEjDuGdzYmVyZ1xuICogICAgQ29weXJpZ2h0IMKpIDIwMTAtMjAxMSBJbnRlbCBDb3Jwb3JhdGlvblxuICogICAgQ29weXJpZ2h0IMKpIDIwMTItMjAxMyBDb2xsYWJvcmEsIEx0ZC5cbiAqXG4gKiAgICBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogICAgb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXNcbiAqICAgICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqICAgIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiAgICBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogICAgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqICAgIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqICAgIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIChpbmNsdWRpbmcgdGhlXG4gKiAgICBuZXh0IHBhcmFncmFwaCkgc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbFxuICogICAgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqICAgIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiAgICBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0ZcbiAqICAgIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG4gKiAgICBOT05JTkZSSU5HRU1FTlQuICBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSU1xuICogICAgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOXG4gKiAgICBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTlxuICogICAgQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuICogICAgU09GVFdBUkUuXG4gKiAgXG4gKi9cblxuaW1wb3J0IHsgQ29ubmVjdGlvbiB9IGZyb20gJ3dlc3RmaWVsZC1ydW50aW1lLWNvbW1vbidcbmNvbnN0IHsgdWludCwgdWludE9wdGlvbmFsLCBpbnQsIGludE9wdGlvbmFsLCBmaXhlZCwgXG5cdGZpeGVkT3B0aW9uYWwsIG9iamVjdCwgb2JqZWN0T3B0aW9uYWwsIG5ld09iamVjdCwgc3RyaW5nLCBcblx0c3RyaW5nT3B0aW9uYWwsIGFycmF5LCBhcnJheU9wdGlvbmFsLCBcblx0ZmlsZURlc2NyaXB0b3JPcHRpb25hbCwgZmlsZURlc2NyaXB0b3IsIFxuaCwgdSwgaSwgZiwgbywgbiwgcywgYSB9ID0gQ29ubmVjdGlvblxuaW1wb3J0IFByb3h5IGZyb20gJy4vUHJveHknXG5cbi8qKlxuICpcbiAqICAgICAgQW4gb3V0cHV0IGRlc2NyaWJlcyBwYXJ0IG9mIHRoZSBjb21wb3NpdG9yIGdlb21ldHJ5LiAgVGhlXG4gKiAgICAgIGNvbXBvc2l0b3Igd29ya3MgaW4gdGhlICdjb21wb3NpdG9yIGNvb3JkaW5hdGUgc3lzdGVtJyBhbmQgYW5cbiAqICAgICAgb3V0cHV0IGNvcnJlc3BvbmRzIHRvIGEgcmVjdGFuZ3VsYXIgYXJlYSBpbiB0aGF0IHNwYWNlIHRoYXQgaXNcbiAqICAgICAgYWN0dWFsbHkgdmlzaWJsZS4gIFRoaXMgdHlwaWNhbGx5IGNvcnJlc3BvbmRzIHRvIGEgbW9uaXRvciB0aGF0XG4gKiAgICAgIGRpc3BsYXlzIHBhcnQgb2YgdGhlIGNvbXBvc2l0b3Igc3BhY2UuICBUaGlzIG9iamVjdCBpcyBwdWJsaXNoZWRcbiAqICAgICAgYXMgZ2xvYmFsIGR1cmluZyBzdGFydCB1cCwgb3Igd2hlbiBhIG1vbml0b3IgaXMgaG90cGx1Z2dlZC5cbiAqICAgIFxuICovXG5jbGFzcyBXbE91dHB1dFByb3h5IGV4dGVuZHMgUHJveHkge1xuXG5cdC8qKlxuXHQgKlxuXHQgKlx0VXNpbmcgdGhpcyByZXF1ZXN0IGEgY2xpZW50IGNhbiB0ZWxsIHRoZSBzZXJ2ZXIgdGhhdCBpdCBpcyBub3QgZ29pbmcgdG9cblx0ICpcdHVzZSB0aGUgb3V0cHV0IG9iamVjdCBhbnltb3JlLlxuXHQgKiAgICAgIFxuXHQgKiBAc2luY2UgM1xuXHQgKlxuXHQgKi9cblx0cmVsZWFzZSAoKSB7XG5cdFx0dGhpcy5kaXNwbGF5Lm1hcnNoYWxsKHRoaXMuaWQsIDAsIFtdKVxuXHR9XG5cbi8qKlxuXHQgKkBwYXJhbSB7RGlzcGxheX1kaXNwbGF5XG5cdCAqQHBhcmFtIHtudW1iZXJ9aWRcblx0ICovXG5cdGNvbnN0cnVjdG9yIChkaXNwbGF5LCBpZCkge1xuXHRcdHN1cGVyKGRpc3BsYXksIGlkKVxuXHRcdC8qKlxuXHRcdCAqIEB0eXBlIHtXbE91dHB1dEV2ZW50c3xudWxsfVxuXHRcdCAqL1xuXHRcdHRoaXMubGlzdGVuZXIgPSBudWxsXG5cdH1cblxuXHRhc3luYyBbMF0gKG1lc3NhZ2UpIHtcblx0XHRhd2FpdCB0aGlzLmxpc3RlbmVyLmdlb21ldHJ5KGkobWVzc2FnZSksIGkobWVzc2FnZSksIGkobWVzc2FnZSksIGkobWVzc2FnZSksIGkobWVzc2FnZSksIHMobWVzc2FnZSwgZmFsc2UpLCBzKG1lc3NhZ2UsIGZhbHNlKSwgaShtZXNzYWdlKSlcblx0fVxuXG5cdGFzeW5jIFsxXSAobWVzc2FnZSkge1xuXHRcdGF3YWl0IHRoaXMubGlzdGVuZXIubW9kZSh1KG1lc3NhZ2UpLCBpKG1lc3NhZ2UpLCBpKG1lc3NhZ2UpLCBpKG1lc3NhZ2UpKVxuXHR9XG5cblx0YXN5bmMgWzJdIChtZXNzYWdlKSB7XG5cdFx0YXdhaXQgdGhpcy5saXN0ZW5lci5kb25lKClcblx0fVxuXG5cdGFzeW5jIFszXSAobWVzc2FnZSkge1xuXHRcdGF3YWl0IHRoaXMubGlzdGVuZXIuc2NhbGUoaShtZXNzYWdlKSlcblx0fVxuXG59XG5XbE91dHB1dFByb3h5LnByb3RvY29sTmFtZSA9ICd3bF9vdXRwdXQnXG5cbldsT3V0cHV0UHJveHkuU3VicGl4ZWwgPSB7XG4gIC8qKlxuICAgKiB1bmtub3duIGdlb21ldHJ5XG4gICAqL1xuICB1bmtub3duOiAwLFxuICAvKipcbiAgICogbm8gZ2VvbWV0cnlcbiAgICovXG4gIG5vbmU6IDEsXG4gIC8qKlxuICAgKiBob3Jpem9udGFsIFJHQlxuICAgKi9cbiAgaG9yaXpvbnRhbFJnYjogMixcbiAgLyoqXG4gICAqIGhvcml6b250YWwgQkdSXG4gICAqL1xuICBob3Jpem9udGFsQmdyOiAzLFxuICAvKipcbiAgICogdmVydGljYWwgUkdCXG4gICAqL1xuICB2ZXJ0aWNhbFJnYjogNCxcbiAgLyoqXG4gICAqIHZlcnRpY2FsIEJHUlxuICAgKi9cbiAgdmVydGljYWxCZ3I6IDVcbn1cblxuV2xPdXRwdXRQcm94eS5UcmFuc2Zvcm0gPSB7XG4gIC8qKlxuICAgKiBubyB0cmFuc2Zvcm1cbiAgICovXG4gIG5vcm1hbDogMCxcbiAgLyoqXG4gICAqIDkwIGRlZ3JlZXMgY291bnRlci1jbG9ja3dpc2VcbiAgICovXG4gIDkwOiAxLFxuICAvKipcbiAgICogMTgwIGRlZ3JlZXMgY291bnRlci1jbG9ja3dpc2VcbiAgICovXG4gIDE4MDogMixcbiAgLyoqXG4gICAqIDI3MCBkZWdyZWVzIGNvdW50ZXItY2xvY2t3aXNlXG4gICAqL1xuICAyNzA6IDMsXG4gIC8qKlxuICAgKiAxODAgZGVncmVlIGZsaXAgYXJvdW5kIGEgdmVydGljYWwgYXhpc1xuICAgKi9cbiAgZmxpcHBlZDogNCxcbiAgLyoqXG4gICAqIGZsaXAgYW5kIHJvdGF0ZSA5MCBkZWdyZWVzIGNvdW50ZXItY2xvY2t3aXNlXG4gICAqL1xuICBmbGlwcGVkOTA6IDUsXG4gIC8qKlxuICAgKiBmbGlwIGFuZCByb3RhdGUgMTgwIGRlZ3JlZXMgY291bnRlci1jbG9ja3dpc2VcbiAgICovXG4gIGZsaXBwZWQxODA6IDYsXG4gIC8qKlxuICAgKiBmbGlwIGFuZCByb3RhdGUgMjcwIGRlZ3JlZXMgY291bnRlci1jbG9ja3dpc2VcbiAgICovXG4gIGZsaXBwZWQyNzA6IDdcbn1cblxuV2xPdXRwdXRQcm94eS5Nb2RlID0ge1xuICAvKipcbiAgICogaW5kaWNhdGVzIHRoaXMgaXMgdGhlIGN1cnJlbnQgbW9kZVxuICAgKi9cbiAgY3VycmVudDogMHgxLFxuICAvKipcbiAgICogaW5kaWNhdGVzIHRoaXMgaXMgdGhlIHByZWZlcnJlZCBtb2RlXG4gICAqL1xuICBwcmVmZXJyZWQ6IDB4MlxufVxuXG5leHBvcnQgZGVmYXVsdCBXbE91dHB1dFByb3h5XG4iLCIvKlxuICpcbiAqICAgIENvcHlyaWdodCDCqSAyMDA4LTIwMTEgS3Jpc3RpYW4gSMO4Z3NiZXJnXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMC0yMDExIEludGVsIENvcnBvcmF0aW9uXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMi0yMDEzIENvbGxhYm9yYSwgTHRkLlxuICpcbiAqICAgIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiAgICBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlc1xuICogICAgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogICAgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqICAgIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiAgICBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogICAgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogICAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2UgKGluY2x1ZGluZyB0aGVcbiAqICAgIG5leHQgcGFyYWdyYXBoKSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsXG4gKiAgICBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogICAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqICAgIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuICogICAgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbiAqICAgIE5PTklORlJJTkdFTUVOVC4gIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTXG4gKiAgICBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU5cbiAqICAgIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOXG4gKiAgICBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4gKiAgICBTT0ZUV0FSRS5cbiAqICBcbiAqL1xuXG4vKipcbiAqIEBpbnRlcmZhY2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2xQb2ludGVyRXZlbnRzIHtcblxuXHQvKipcblx0ICpcblx0ICpcdE5vdGlmaWNhdGlvbiB0aGF0IHRoaXMgc2VhdCdzIHBvaW50ZXIgaXMgZm9jdXNlZCBvbiBhIGNlcnRhaW5cblx0ICpcdHN1cmZhY2UuXG5cdCAqXG5cdCAqXHRXaGVuIGEgc2VhdCdzIGZvY3VzIGVudGVycyBhIHN1cmZhY2UsIHRoZSBwb2ludGVyIGltYWdlXG5cdCAqXHRpcyB1bmRlZmluZWQgYW5kIGEgY2xpZW50IHNob3VsZCByZXNwb25kIHRvIHRoaXMgZXZlbnQgYnkgc2V0dGluZ1xuXHQgKlx0YW4gYXBwcm9wcmlhdGUgcG9pbnRlciBpbWFnZSB3aXRoIHRoZSBzZXRfY3Vyc29yIHJlcXVlc3QuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBzZXJpYWwgc2VyaWFsIG51bWJlciBvZiB0aGUgZW50ZXIgZXZlbnQgXG5cdCAqIEBwYXJhbSB7Kn0gc3VyZmFjZSBzdXJmYWNlIGVudGVyZWQgYnkgdGhlIHBvaW50ZXIgXG5cdCAqIEBwYXJhbSB7Rml4ZWR9IHN1cmZhY2VYIHN1cmZhY2UtbG9jYWwgeCBjb29yZGluYXRlIFxuXHQgKiBAcGFyYW0ge0ZpeGVkfSBzdXJmYWNlWSBzdXJmYWNlLWxvY2FsIHkgY29vcmRpbmF0ZSBcblx0ICpcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdGVudGVyKHNlcmlhbCwgc3VyZmFjZSwgc3VyZmFjZVgsIHN1cmZhY2VZKSB7fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0Tm90aWZpY2F0aW9uIHRoYXQgdGhpcyBzZWF0J3MgcG9pbnRlciBpcyBubyBsb25nZXIgZm9jdXNlZCBvblxuXHQgKlx0YSBjZXJ0YWluIHN1cmZhY2UuXG5cdCAqXG5cdCAqXHRUaGUgbGVhdmUgbm90aWZpY2F0aW9uIGlzIHNlbnQgYmVmb3JlIHRoZSBlbnRlciBub3RpZmljYXRpb25cblx0ICpcdGZvciB0aGUgbmV3IGZvY3VzLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0ge251bWJlcn0gc2VyaWFsIHNlcmlhbCBudW1iZXIgb2YgdGhlIGxlYXZlIGV2ZW50IFxuXHQgKiBAcGFyYW0geyp9IHN1cmZhY2Ugc3VyZmFjZSBsZWZ0IGJ5IHRoZSBwb2ludGVyIFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0bGVhdmUoc2VyaWFsLCBzdXJmYWNlKSB7fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0Tm90aWZpY2F0aW9uIG9mIHBvaW50ZXIgbG9jYXRpb24gY2hhbmdlLiBUaGUgYXJndW1lbnRzXG5cdCAqXHRzdXJmYWNlX3ggYW5kIHN1cmZhY2VfeSBhcmUgdGhlIGxvY2F0aW9uIHJlbGF0aXZlIHRvIHRoZVxuXHQgKlx0Zm9jdXNlZCBzdXJmYWNlLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0ge251bWJlcn0gdGltZSB0aW1lc3RhbXAgd2l0aCBtaWxsaXNlY29uZCBncmFudWxhcml0eSBcblx0ICogQHBhcmFtIHtGaXhlZH0gc3VyZmFjZVggc3VyZmFjZS1sb2NhbCB4IGNvb3JkaW5hdGUgXG5cdCAqIEBwYXJhbSB7Rml4ZWR9IHN1cmZhY2VZIHN1cmZhY2UtbG9jYWwgeSBjb29yZGluYXRlIFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0bW90aW9uKHRpbWUsIHN1cmZhY2VYLCBzdXJmYWNlWSkge31cblxuXHQvKipcblx0ICpcblx0ICpcdE1vdXNlIGJ1dHRvbiBjbGljayBhbmQgcmVsZWFzZSBub3RpZmljYXRpb25zLlxuXHQgKlxuXHQgKlx0VGhlIGxvY2F0aW9uIG9mIHRoZSBjbGljayBpcyBnaXZlbiBieSB0aGUgbGFzdCBtb3Rpb24gb3Jcblx0ICpcdGVudGVyIGV2ZW50LlxuXHQgKlx0VGhlIHRpbWUgYXJndW1lbnQgaXMgYSB0aW1lc3RhbXAgd2l0aCBtaWxsaXNlY29uZFxuXHQgKlx0Z3JhbnVsYXJpdHksIHdpdGggYW4gdW5kZWZpbmVkIGJhc2UuXG5cdCAqXG5cdCAqXHRUaGUgYnV0dG9uIGlzIGEgYnV0dG9uIGNvZGUgYXMgZGVmaW5lZCBpbiB0aGUgTGludXgga2VybmVsJ3Ncblx0ICpcdGxpbnV4L2lucHV0LWV2ZW50LWNvZGVzLmggaGVhZGVyIGZpbGUsIGUuZy4gQlROX0xFRlQuXG5cdCAqXG5cdCAqXHRBbnkgMTYtYml0IGJ1dHRvbiBjb2RlIHZhbHVlIGlzIHJlc2VydmVkIGZvciBmdXR1cmUgYWRkaXRpb25zIHRvIHRoZVxuXHQgKlx0a2VybmVsJ3MgZXZlbnQgY29kZSBsaXN0LiBBbGwgb3RoZXIgYnV0dG9uIGNvZGVzIGFib3ZlIDB4RkZGRiBhcmVcblx0ICpcdGN1cnJlbnRseSB1bmRlZmluZWQgYnV0IG1heSBiZSB1c2VkIGluIGZ1dHVyZSB2ZXJzaW9ucyBvZiB0aGlzXG5cdCAqXHRwcm90b2NvbC5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHtudW1iZXJ9IHNlcmlhbCBzZXJpYWwgbnVtYmVyIG9mIHRoZSBidXR0b24gZXZlbnQgXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lIHRpbWVzdGFtcCB3aXRoIG1pbGxpc2Vjb25kIGdyYW51bGFyaXR5IFxuXHQgKiBAcGFyYW0ge251bWJlcn0gYnV0dG9uIGJ1dHRvbiB0aGF0IHByb2R1Y2VkIHRoZSBldmVudCBcblx0ICogQHBhcmFtIHtudW1iZXJ9IHN0YXRlIHBoeXNpY2FsIHN0YXRlIG9mIHRoZSBidXR0b24gXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRidXR0b24oc2VyaWFsLCB0aW1lLCBidXR0b24sIHN0YXRlKSB7fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0U2Nyb2xsIGFuZCBvdGhlciBheGlzIG5vdGlmaWNhdGlvbnMuXG5cdCAqXG5cdCAqXHRGb3Igc2Nyb2xsIGV2ZW50cyAodmVydGljYWwgYW5kIGhvcml6b250YWwgc2Nyb2xsIGF4ZXMpLCB0aGVcblx0ICpcdHZhbHVlIHBhcmFtZXRlciBpcyB0aGUgbGVuZ3RoIG9mIGEgdmVjdG9yIGFsb25nIHRoZSBzcGVjaWZpZWRcblx0ICpcdGF4aXMgaW4gYSBjb29yZGluYXRlIHNwYWNlIGlkZW50aWNhbCB0byB0aG9zZSBvZiBtb3Rpb24gZXZlbnRzLFxuXHQgKlx0cmVwcmVzZW50aW5nIGEgcmVsYXRpdmUgbW92ZW1lbnQgYWxvbmcgdGhlIHNwZWNpZmllZCBheGlzLlxuXHQgKlxuXHQgKlx0Rm9yIGRldmljZXMgdGhhdCBzdXBwb3J0IG1vdmVtZW50cyBub24tcGFyYWxsZWwgdG8gYXhlcyBtdWx0aXBsZVxuXHQgKlx0YXhpcyBldmVudHMgd2lsbCBiZSBlbWl0dGVkLlxuXHQgKlxuXHQgKlx0V2hlbiBhcHBsaWNhYmxlLCBmb3IgZXhhbXBsZSBmb3IgdG91Y2ggcGFkcywgdGhlIHNlcnZlciBjYW5cblx0ICpcdGNob29zZSB0byBlbWl0IHNjcm9sbCBldmVudHMgd2hlcmUgdGhlIG1vdGlvbiB2ZWN0b3IgaXNcblx0ICpcdGVxdWl2YWxlbnQgdG8gYSBtb3Rpb24gZXZlbnQgdmVjdG9yLlxuXHQgKlxuXHQgKlx0V2hlbiBhcHBsaWNhYmxlLCBhIGNsaWVudCBjYW4gdHJhbnNmb3JtIGl0cyBjb250ZW50IHJlbGF0aXZlIHRvIHRoZVxuXHQgKlx0c2Nyb2xsIGRpc3RhbmNlLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0ge251bWJlcn0gdGltZSB0aW1lc3RhbXAgd2l0aCBtaWxsaXNlY29uZCBncmFudWxhcml0eSBcblx0ICogQHBhcmFtIHtudW1iZXJ9IGF4aXMgYXhpcyB0eXBlIFxuXHQgKiBAcGFyYW0ge0ZpeGVkfSB2YWx1ZSBsZW5ndGggb2YgdmVjdG9yIGluIHN1cmZhY2UtbG9jYWwgY29vcmRpbmF0ZSBzcGFjZSBcblx0ICpcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdGF4aXModGltZSwgYXhpcywgdmFsdWUpIHt9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRJbmRpY2F0ZXMgdGhlIGVuZCBvZiBhIHNldCBvZiBldmVudHMgdGhhdCBsb2dpY2FsbHkgYmVsb25nIHRvZ2V0aGVyLlxuXHQgKlx0QSBjbGllbnQgaXMgZXhwZWN0ZWQgdG8gYWNjdW11bGF0ZSB0aGUgZGF0YSBpbiBhbGwgZXZlbnRzIHdpdGhpbiB0aGVcblx0ICpcdGZyYW1lIGJlZm9yZSBwcm9jZWVkaW5nLlxuXHQgKlxuXHQgKlx0QWxsIHdsX3BvaW50ZXIgZXZlbnRzIGJlZm9yZSBhIHdsX3BvaW50ZXIuZnJhbWUgZXZlbnQgYmVsb25nXG5cdCAqXHRsb2dpY2FsbHkgdG9nZXRoZXIuIEZvciBleGFtcGxlLCBpbiBhIGRpYWdvbmFsIHNjcm9sbCBtb3Rpb24gdGhlXG5cdCAqXHRjb21wb3NpdG9yIHdpbGwgc2VuZCBhbiBvcHRpb25hbCB3bF9wb2ludGVyLmF4aXNfc291cmNlIGV2ZW50LCB0d29cblx0ICpcdHdsX3BvaW50ZXIuYXhpcyBldmVudHMgKGhvcml6b250YWwgYW5kIHZlcnRpY2FsKSBhbmQgZmluYWxseSBhXG5cdCAqXHR3bF9wb2ludGVyLmZyYW1lIGV2ZW50LiBUaGUgY2xpZW50IG1heSB1c2UgdGhpcyBpbmZvcm1hdGlvbiB0b1xuXHQgKlx0Y2FsY3VsYXRlIGEgZGlhZ29uYWwgdmVjdG9yIGZvciBzY3JvbGxpbmcuXG5cdCAqXG5cdCAqXHRXaGVuIG11bHRpcGxlIHdsX3BvaW50ZXIuYXhpcyBldmVudHMgb2NjdXIgd2l0aGluIHRoZSBzYW1lIGZyYW1lLFxuXHQgKlx0dGhlIG1vdGlvbiB2ZWN0b3IgaXMgdGhlIGNvbWJpbmVkIG1vdGlvbiBvZiBhbGwgZXZlbnRzLlxuXHQgKlx0V2hlbiBhIHdsX3BvaW50ZXIuYXhpcyBhbmQgYSB3bF9wb2ludGVyLmF4aXNfc3RvcCBldmVudCBvY2N1ciB3aXRoaW5cblx0ICpcdHRoZSBzYW1lIGZyYW1lLCB0aGlzIGluZGljYXRlcyB0aGF0IGF4aXMgbW92ZW1lbnQgaW4gb25lIGF4aXMgaGFzXG5cdCAqXHRzdG9wcGVkIGJ1dCBjb250aW51ZXMgaW4gdGhlIG90aGVyIGF4aXMuXG5cdCAqXHRXaGVuIG11bHRpcGxlIHdsX3BvaW50ZXIuYXhpc19zdG9wIGV2ZW50cyBvY2N1ciB3aXRoaW4gdGhlIHNhbWVcblx0ICpcdGZyYW1lLCB0aGlzIGluZGljYXRlcyB0aGF0IHRoZXNlIGF4ZXMgc3RvcHBlZCBpbiB0aGUgc2FtZSBpbnN0YW5jZS5cblx0ICpcblx0ICpcdEEgd2xfcG9pbnRlci5mcmFtZSBldmVudCBpcyBzZW50IGZvciBldmVyeSBsb2dpY2FsIGV2ZW50IGdyb3VwLFxuXHQgKlx0ZXZlbiBpZiB0aGUgZ3JvdXAgb25seSBjb250YWlucyBhIHNpbmdsZSB3bF9wb2ludGVyIGV2ZW50LlxuXHQgKlx0U3BlY2lmaWNhbGx5LCBhIGNsaWVudCBtYXkgZ2V0IGEgc2VxdWVuY2U6IG1vdGlvbiwgZnJhbWUsIGJ1dHRvbixcblx0ICpcdGZyYW1lLCBheGlzLCBmcmFtZSwgYXhpc19zdG9wLCBmcmFtZS5cblx0ICpcblx0ICpcdFRoZSB3bF9wb2ludGVyLmVudGVyIGFuZCB3bF9wb2ludGVyLmxlYXZlIGV2ZW50cyBhcmUgbG9naWNhbCBldmVudHNcblx0ICpcdGdlbmVyYXRlZCBieSB0aGUgY29tcG9zaXRvciBhbmQgbm90IHRoZSBoYXJkd2FyZS4gVGhlc2UgZXZlbnRzIGFyZVxuXHQgKlx0YWxzbyBncm91cGVkIGJ5IGEgd2xfcG9pbnRlci5mcmFtZS4gV2hlbiBhIHBvaW50ZXIgbW92ZXMgZnJvbSBvbmVcblx0ICpcdHN1cmZhY2UgdG8gYW5vdGhlciwgYSBjb21wb3NpdG9yIHNob3VsZCBncm91cCB0aGVcblx0ICpcdHdsX3BvaW50ZXIubGVhdmUgZXZlbnQgd2l0aGluIHRoZSBzYW1lIHdsX3BvaW50ZXIuZnJhbWUuXG5cdCAqXHRIb3dldmVyLCBhIGNsaWVudCBtdXN0IG5vdCByZWx5IG9uIHdsX3BvaW50ZXIubGVhdmUgYW5kXG5cdCAqXHR3bF9wb2ludGVyLmVudGVyIGJlaW5nIGluIHRoZSBzYW1lIHdsX3BvaW50ZXIuZnJhbWUuXG5cdCAqXHRDb21wb3NpdG9yLXNwZWNpZmljIHBvbGljaWVzIG1heSByZXF1aXJlIHRoZSB3bF9wb2ludGVyLmxlYXZlIGFuZFxuXHQgKlx0d2xfcG9pbnRlci5lbnRlciBldmVudCBiZWluZyBzcGxpdCBhY3Jvc3MgbXVsdGlwbGUgd2xfcG9pbnRlci5mcmFtZVxuXHQgKlx0Z3JvdXBzLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKlxuXHQgKiBAc2luY2UgNVxuXHQgKlxuXHQgKi9cblx0ZnJhbWUoKSB7fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0U291cmNlIGluZm9ybWF0aW9uIGZvciBzY3JvbGwgYW5kIG90aGVyIGF4ZXMuXG5cdCAqXG5cdCAqXHRUaGlzIGV2ZW50IGRvZXMgbm90IG9jY3VyIG9uIGl0cyBvd24uIEl0IGlzIHNlbnQgYmVmb3JlIGFcblx0ICpcdHdsX3BvaW50ZXIuZnJhbWUgZXZlbnQgYW5kIGNhcnJpZXMgdGhlIHNvdXJjZSBpbmZvcm1hdGlvbiBmb3Jcblx0ICpcdGFsbCBldmVudHMgd2l0aGluIHRoYXQgZnJhbWUuXG5cdCAqXG5cdCAqXHRUaGUgc291cmNlIHNwZWNpZmllcyBob3cgdGhpcyBldmVudCB3YXMgZ2VuZXJhdGVkLiBJZiB0aGUgc291cmNlIGlzXG5cdCAqXHR3bF9wb2ludGVyLmF4aXNfc291cmNlLmZpbmdlciwgYSB3bF9wb2ludGVyLmF4aXNfc3RvcCBldmVudCB3aWxsIGJlXG5cdCAqXHRzZW50IHdoZW4gdGhlIHVzZXIgbGlmdHMgdGhlIGZpbmdlciBvZmYgdGhlIGRldmljZS5cblx0ICpcblx0ICpcdElmIHRoZSBzb3VyY2UgaXMgd2xfcG9pbnRlci5heGlzX3NvdXJjZS53aGVlbCxcblx0ICpcdHdsX3BvaW50ZXIuYXhpc19zb3VyY2Uud2hlZWxfdGlsdCBvclxuXHQgKlx0d2xfcG9pbnRlci5heGlzX3NvdXJjZS5jb250aW51b3VzLCBhIHdsX3BvaW50ZXIuYXhpc19zdG9wIGV2ZW50IG1heVxuXHQgKlx0b3IgbWF5IG5vdCBiZSBzZW50LiBXaGV0aGVyIGEgY29tcG9zaXRvciBzZW5kcyBhbiBheGlzX3N0b3AgZXZlbnRcblx0ICpcdGZvciB0aGVzZSBzb3VyY2VzIGlzIGhhcmR3YXJlLXNwZWNpZmljIGFuZCBpbXBsZW1lbnRhdGlvbi1kZXBlbmRlbnQ7XG5cdCAqXHRjbGllbnRzIG11c3Qgbm90IHJlbHkgb24gcmVjZWl2aW5nIGFuIGF4aXNfc3RvcCBldmVudCBmb3IgdGhlc2Vcblx0ICpcdHNjcm9sbCBzb3VyY2VzIGFuZCBzaG91bGQgdHJlYXQgc2Nyb2xsIHNlcXVlbmNlcyBmcm9tIHRoZXNlIHNjcm9sbFxuXHQgKlx0c291cmNlcyBhcyB1bnRlcm1pbmF0ZWQgYnkgZGVmYXVsdC5cblx0ICpcblx0ICpcdFRoaXMgZXZlbnQgaXMgb3B0aW9uYWwuIElmIHRoZSBzb3VyY2UgaXMgdW5rbm93biBmb3IgYSBwYXJ0aWN1bGFyXG5cdCAqXHRheGlzIGV2ZW50IHNlcXVlbmNlLCBubyBldmVudCBpcyBzZW50LlxuXHQgKlx0T25seSBvbmUgd2xfcG9pbnRlci5heGlzX3NvdXJjZSBldmVudCBpcyBwZXJtaXR0ZWQgcGVyIGZyYW1lLlxuXHQgKlxuXHQgKlx0VGhlIG9yZGVyIG9mIHdsX3BvaW50ZXIuYXhpc19kaXNjcmV0ZSBhbmQgd2xfcG9pbnRlci5heGlzX3NvdXJjZSBpc1xuXHQgKlx0bm90IGd1YXJhbnRlZWQuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBheGlzU291cmNlIHNvdXJjZSBvZiB0aGUgYXhpcyBldmVudCBcblx0ICpcblx0ICogQHNpbmNlIDVcblx0ICpcblx0ICovXG5cdGF4aXNTb3VyY2UoYXhpc1NvdXJjZSkge31cblxuXHQvKipcblx0ICpcblx0ICpcdFN0b3Agbm90aWZpY2F0aW9uIGZvciBzY3JvbGwgYW5kIG90aGVyIGF4ZXMuXG5cdCAqXG5cdCAqXHRGb3Igc29tZSB3bF9wb2ludGVyLmF4aXNfc291cmNlIHR5cGVzLCBhIHdsX3BvaW50ZXIuYXhpc19zdG9wIGV2ZW50XG5cdCAqXHRpcyBzZW50IHRvIG5vdGlmeSBhIGNsaWVudCB0aGF0IHRoZSBheGlzIHNlcXVlbmNlIGhhcyB0ZXJtaW5hdGVkLlxuXHQgKlx0VGhpcyBlbmFibGVzIHRoZSBjbGllbnQgdG8gaW1wbGVtZW50IGtpbmV0aWMgc2Nyb2xsaW5nLlxuXHQgKlx0U2VlIHRoZSB3bF9wb2ludGVyLmF4aXNfc291cmNlIGRvY3VtZW50YXRpb24gZm9yIGluZm9ybWF0aW9uIG9uIHdoZW5cblx0ICpcdHRoaXMgZXZlbnQgbWF5IGJlIGdlbmVyYXRlZC5cblx0ICpcblx0ICpcdEFueSB3bF9wb2ludGVyLmF4aXMgZXZlbnRzIHdpdGggdGhlIHNhbWUgYXhpc19zb3VyY2UgYWZ0ZXIgdGhpc1xuXHQgKlx0ZXZlbnQgc2hvdWxkIGJlIGNvbnNpZGVyZWQgYXMgdGhlIHN0YXJ0IG9mIGEgbmV3IGF4aXMgbW90aW9uLlxuXHQgKlxuXHQgKlx0VGhlIHRpbWVzdGFtcCBpcyB0byBiZSBpbnRlcnByZXRlZCBpZGVudGljYWwgdG8gdGhlIHRpbWVzdGFtcCBpbiB0aGVcblx0ICpcdHdsX3BvaW50ZXIuYXhpcyBldmVudC4gVGhlIHRpbWVzdGFtcCB2YWx1ZSBtYXkgYmUgdGhlIHNhbWUgYXMgYVxuXHQgKlx0cHJlY2VkaW5nIHdsX3BvaW50ZXIuYXhpcyBldmVudC5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHtudW1iZXJ9IHRpbWUgdGltZXN0YW1wIHdpdGggbWlsbGlzZWNvbmQgZ3JhbnVsYXJpdHkgXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBheGlzIHRoZSBheGlzIHN0b3BwZWQgd2l0aCB0aGlzIGV2ZW50IFxuXHQgKlxuXHQgKiBAc2luY2UgNVxuXHQgKlxuXHQgKi9cblx0YXhpc1N0b3AodGltZSwgYXhpcykge31cblxuXHQvKipcblx0ICpcblx0ICpcdERpc2NyZXRlIHN0ZXAgaW5mb3JtYXRpb24gZm9yIHNjcm9sbCBhbmQgb3RoZXIgYXhlcy5cblx0ICpcblx0ICpcdFRoaXMgZXZlbnQgY2FycmllcyB0aGUgYXhpcyB2YWx1ZSBvZiB0aGUgd2xfcG9pbnRlci5heGlzIGV2ZW50IGluXG5cdCAqXHRkaXNjcmV0ZSBzdGVwcyAoZS5nLiBtb3VzZSB3aGVlbCBjbGlja3MpLlxuXHQgKlxuXHQgKlx0VGhpcyBldmVudCBkb2VzIG5vdCBvY2N1ciBvbiBpdHMgb3duLCBpdCBpcyBjb3VwbGVkIHdpdGggYVxuXHQgKlx0d2xfcG9pbnRlci5heGlzIGV2ZW50IHRoYXQgcmVwcmVzZW50cyB0aGlzIGF4aXMgdmFsdWUgb24gYVxuXHQgKlx0Y29udGludW91cyBzY2FsZS4gVGhlIHByb3RvY29sIGd1YXJhbnRlZXMgdGhhdCBlYWNoIGF4aXNfZGlzY3JldGVcblx0ICpcdGV2ZW50IGlzIGFsd2F5cyBmb2xsb3dlZCBieSBleGFjdGx5IG9uZSBheGlzIGV2ZW50IHdpdGggdGhlIHNhbWVcblx0ICpcdGF4aXMgbnVtYmVyIHdpdGhpbiB0aGUgc2FtZSB3bF9wb2ludGVyLmZyYW1lLiBOb3RlIHRoYXQgdGhlIHByb3RvY29sXG5cdCAqXHRhbGxvd3MgZm9yIG90aGVyIGV2ZW50cyB0byBvY2N1ciBiZXR3ZWVuIHRoZSBheGlzX2Rpc2NyZXRlIGFuZFxuXHQgKlx0aXRzIGNvdXBsZWQgYXhpcyBldmVudCwgaW5jbHVkaW5nIG90aGVyIGF4aXNfZGlzY3JldGUgb3IgYXhpc1xuXHQgKlx0ZXZlbnRzLlxuXHQgKlxuXHQgKlx0VGhpcyBldmVudCBpcyBvcHRpb25hbDsgY29udGludW91cyBzY3JvbGxpbmcgZGV2aWNlc1xuXHQgKlx0bGlrZSB0d28tZmluZ2VyIHNjcm9sbGluZyBvbiB0b3VjaHBhZHMgZG8gbm90IGhhdmUgZGlzY3JldGVcblx0ICpcdHN0ZXBzIGFuZCBkbyBub3QgZ2VuZXJhdGUgdGhpcyBldmVudC5cblx0ICpcblx0ICpcdFRoZSBkaXNjcmV0ZSB2YWx1ZSBjYXJyaWVzIHRoZSBkaXJlY3Rpb25hbCBpbmZvcm1hdGlvbi4gZS5nLiBhIHZhbHVlXG5cdCAqXHRvZiAtMiBpcyB0d28gc3RlcHMgdG93YXJkcyB0aGUgbmVnYXRpdmUgZGlyZWN0aW9uIG9mIHRoaXMgYXhpcy5cblx0ICpcblx0ICpcdFRoZSBheGlzIG51bWJlciBpcyBpZGVudGljYWwgdG8gdGhlIGF4aXMgbnVtYmVyIGluIHRoZSBhc3NvY2lhdGVkXG5cdCAqXHRheGlzIGV2ZW50LlxuXHQgKlxuXHQgKlx0VGhlIG9yZGVyIG9mIHdsX3BvaW50ZXIuYXhpc19kaXNjcmV0ZSBhbmQgd2xfcG9pbnRlci5heGlzX3NvdXJjZSBpc1xuXHQgKlx0bm90IGd1YXJhbnRlZWQuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBheGlzIGF4aXMgdHlwZSBcblx0ICogQHBhcmFtIHtudW1iZXJ9IGRpc2NyZXRlIG51bWJlciBvZiBzdGVwcyBcblx0ICpcblx0ICogQHNpbmNlIDVcblx0ICpcblx0ICovXG5cdGF4aXNEaXNjcmV0ZShheGlzLCBkaXNjcmV0ZSkge31cbn1cblxuIiwiLypcbiAqXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAwOC0yMDExIEtyaXN0aWFuIEjDuGdzYmVyZ1xuICogICAgQ29weXJpZ2h0IMKpIDIwMTAtMjAxMSBJbnRlbCBDb3Jwb3JhdGlvblxuICogICAgQ29weXJpZ2h0IMKpIDIwMTItMjAxMyBDb2xsYWJvcmEsIEx0ZC5cbiAqXG4gKiAgICBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogICAgb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXNcbiAqICAgICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqICAgIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiAgICBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogICAgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqICAgIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqICAgIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIChpbmNsdWRpbmcgdGhlXG4gKiAgICBuZXh0IHBhcmFncmFwaCkgc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbFxuICogICAgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqICAgIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiAgICBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0ZcbiAqICAgIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG4gKiAgICBOT05JTkZSSU5HRU1FTlQuICBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSU1xuICogICAgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOXG4gKiAgICBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTlxuICogICAgQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuICogICAgU09GVFdBUkUuXG4gKiAgXG4gKi9cblxuaW1wb3J0IHsgQ29ubmVjdGlvbiB9IGZyb20gJ3dlc3RmaWVsZC1ydW50aW1lLWNvbW1vbidcbmNvbnN0IHsgdWludCwgdWludE9wdGlvbmFsLCBpbnQsIGludE9wdGlvbmFsLCBmaXhlZCwgXG5cdGZpeGVkT3B0aW9uYWwsIG9iamVjdCwgb2JqZWN0T3B0aW9uYWwsIG5ld09iamVjdCwgc3RyaW5nLCBcblx0c3RyaW5nT3B0aW9uYWwsIGFycmF5LCBhcnJheU9wdGlvbmFsLCBcblx0ZmlsZURlc2NyaXB0b3JPcHRpb25hbCwgZmlsZURlc2NyaXB0b3IsIFxuaCwgdSwgaSwgZiwgbywgbiwgcywgYSB9ID0gQ29ubmVjdGlvblxuaW1wb3J0IFByb3h5IGZyb20gJy4vUHJveHknXG5cbi8qKlxuICpcbiAqICAgICAgVGhlIHdsX3BvaW50ZXIgaW50ZXJmYWNlIHJlcHJlc2VudHMgb25lIG9yIG1vcmUgaW5wdXQgZGV2aWNlcyxcbiAqICAgICAgc3VjaCBhcyBtaWNlLCB3aGljaCBjb250cm9sIHRoZSBwb2ludGVyIGxvY2F0aW9uIGFuZCBwb2ludGVyX2ZvY3VzXG4gKiAgICAgIG9mIGEgc2VhdC5cbiAqXG4gKiAgICAgIFRoZSB3bF9wb2ludGVyIGludGVyZmFjZSBnZW5lcmF0ZXMgbW90aW9uLCBlbnRlciBhbmQgbGVhdmVcbiAqICAgICAgZXZlbnRzIGZvciB0aGUgc3VyZmFjZXMgdGhhdCB0aGUgcG9pbnRlciBpcyBsb2NhdGVkIG92ZXIsXG4gKiAgICAgIGFuZCBidXR0b24gYW5kIGF4aXMgZXZlbnRzIGZvciBidXR0b24gcHJlc3NlcywgYnV0dG9uIHJlbGVhc2VzXG4gKiAgICAgIGFuZCBzY3JvbGxpbmcuXG4gKiAgICBcbiAqL1xuY2xhc3MgV2xQb2ludGVyUHJveHkgZXh0ZW5kcyBQcm94eSB7XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRTZXQgdGhlIHBvaW50ZXIgc3VyZmFjZSwgaS5lLiwgdGhlIHN1cmZhY2UgdGhhdCBjb250YWlucyB0aGVcblx0ICpcdHBvaW50ZXIgaW1hZ2UgKGN1cnNvcikuIFRoaXMgcmVxdWVzdCBnaXZlcyB0aGUgc3VyZmFjZSB0aGUgcm9sZVxuXHQgKlx0b2YgYSBjdXJzb3IuIElmIHRoZSBzdXJmYWNlIGFscmVhZHkgaGFzIGFub3RoZXIgcm9sZSwgaXQgcmFpc2VzXG5cdCAqXHRhIHByb3RvY29sIGVycm9yLlxuXHQgKlxuXHQgKlx0VGhlIGN1cnNvciBhY3R1YWxseSBjaGFuZ2VzIG9ubHkgaWYgdGhlIHBvaW50ZXJcblx0ICpcdGZvY3VzIGZvciB0aGlzIGRldmljZSBpcyBvbmUgb2YgdGhlIHJlcXVlc3RpbmcgY2xpZW50J3Mgc3VyZmFjZXNcblx0ICpcdG9yIHRoZSBzdXJmYWNlIHBhcmFtZXRlciBpcyB0aGUgY3VycmVudCBwb2ludGVyIHN1cmZhY2UuIElmXG5cdCAqXHR0aGVyZSB3YXMgYSBwcmV2aW91cyBzdXJmYWNlIHNldCB3aXRoIHRoaXMgcmVxdWVzdCBpdCBpc1xuXHQgKlx0cmVwbGFjZWQuIElmIHN1cmZhY2UgaXMgTlVMTCwgdGhlIHBvaW50ZXIgaW1hZ2UgaXMgaGlkZGVuLlxuXHQgKlxuXHQgKlx0VGhlIHBhcmFtZXRlcnMgaG90c3BvdF94IGFuZCBob3RzcG90X3kgZGVmaW5lIHRoZSBwb3NpdGlvbiBvZlxuXHQgKlx0dGhlIHBvaW50ZXIgc3VyZmFjZSByZWxhdGl2ZSB0byB0aGUgcG9pbnRlciBsb2NhdGlvbi4gSXRzXG5cdCAqXHR0b3AtbGVmdCBjb3JuZXIgaXMgYWx3YXlzIGF0ICh4LCB5KSAtIChob3RzcG90X3gsIGhvdHNwb3RfeSksXG5cdCAqXHR3aGVyZSAoeCwgeSkgYXJlIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgcG9pbnRlciBsb2NhdGlvbiwgaW5cblx0ICpcdHN1cmZhY2UtbG9jYWwgY29vcmRpbmF0ZXMuXG5cdCAqXG5cdCAqXHRPbiBzdXJmYWNlLmF0dGFjaCByZXF1ZXN0cyB0byB0aGUgcG9pbnRlciBzdXJmYWNlLCBob3RzcG90X3hcblx0ICpcdGFuZCBob3RzcG90X3kgYXJlIGRlY3JlbWVudGVkIGJ5IHRoZSB4IGFuZCB5IHBhcmFtZXRlcnNcblx0ICpcdHBhc3NlZCB0byB0aGUgcmVxdWVzdC4gQXR0YWNoIG11c3QgYmUgY29uZmlybWVkIGJ5XG5cdCAqXHR3bF9zdXJmYWNlLmNvbW1pdCBhcyB1c3VhbC5cblx0ICpcblx0ICpcdFRoZSBob3RzcG90IGNhbiBhbHNvIGJlIHVwZGF0ZWQgYnkgcGFzc2luZyB0aGUgY3VycmVudGx5IHNldFxuXHQgKlx0cG9pbnRlciBzdXJmYWNlIHRvIHRoaXMgcmVxdWVzdCB3aXRoIG5ldyB2YWx1ZXMgZm9yIGhvdHNwb3RfeFxuXHQgKlx0YW5kIGhvdHNwb3RfeS5cblx0ICpcblx0ICpcdFRoZSBjdXJyZW50IGFuZCBwZW5kaW5nIGlucHV0IHJlZ2lvbnMgb2YgdGhlIHdsX3N1cmZhY2UgYXJlXG5cdCAqXHRjbGVhcmVkLCBhbmQgd2xfc3VyZmFjZS5zZXRfaW5wdXRfcmVnaW9uIGlzIGlnbm9yZWQgdW50aWwgdGhlXG5cdCAqXHR3bF9zdXJmYWNlIGlzIG5vIGxvbmdlciB1c2VkIGFzIHRoZSBjdXJzb3IuIFdoZW4gdGhlIHVzZSBhcyBhXG5cdCAqXHRjdXJzb3IgZW5kcywgdGhlIGN1cnJlbnQgYW5kIHBlbmRpbmcgaW5wdXQgcmVnaW9ucyBiZWNvbWVcblx0ICpcdHVuZGVmaW5lZCwgYW5kIHRoZSB3bF9zdXJmYWNlIGlzIHVubWFwcGVkLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0ge251bWJlcn0gc2VyaWFsIHNlcmlhbCBudW1iZXIgb2YgdGhlIGVudGVyIGV2ZW50IFxuXHQgKiBAcGFyYW0gez8qfSBzdXJmYWNlIHBvaW50ZXIgc3VyZmFjZSBcblx0ICogQHBhcmFtIHtudW1iZXJ9IGhvdHNwb3RYIHN1cmZhY2UtbG9jYWwgeCBjb29yZGluYXRlIFxuXHQgKiBAcGFyYW0ge251bWJlcn0gaG90c3BvdFkgc3VyZmFjZS1sb2NhbCB5IGNvb3JkaW5hdGUgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRzZXRDdXJzb3IgKHNlcmlhbCwgc3VyZmFjZSwgaG90c3BvdFgsIGhvdHNwb3RZKSB7XG5cdFx0dGhpcy5kaXNwbGF5Lm1hcnNoYWxsKHRoaXMuaWQsIDAsIFt1aW50KHNlcmlhbCksIG9iamVjdE9wdGlvbmFsKHN1cmZhY2UpLCBpbnQoaG90c3BvdFgpLCBpbnQoaG90c3BvdFkpXSlcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0VXNpbmcgdGhpcyByZXF1ZXN0IGEgY2xpZW50IGNhbiB0ZWxsIHRoZSBzZXJ2ZXIgdGhhdCBpdCBpcyBub3QgZ29pbmcgdG9cblx0ICpcdHVzZSB0aGUgcG9pbnRlciBvYmplY3QgYW55bW9yZS5cblx0ICpcblx0ICpcdFRoaXMgcmVxdWVzdCBkZXN0cm95cyB0aGUgcG9pbnRlciBwcm94eSBvYmplY3QsIHNvIGNsaWVudHMgbXVzdCBub3QgY2FsbFxuXHQgKlx0d2xfcG9pbnRlcl9kZXN0cm95KCkgYWZ0ZXIgdXNpbmcgdGhpcyByZXF1ZXN0LlxuXHQgKiAgICAgIFxuXHQgKiBAc2luY2UgM1xuXHQgKlxuXHQgKi9cblx0cmVsZWFzZSAoKSB7XG5cdFx0dGhpcy5kaXNwbGF5Lm1hcnNoYWxsKHRoaXMuaWQsIDEsIFtdKVxuXHR9XG5cbi8qKlxuXHQgKkBwYXJhbSB7RGlzcGxheX1kaXNwbGF5XG5cdCAqQHBhcmFtIHtudW1iZXJ9aWRcblx0ICovXG5cdGNvbnN0cnVjdG9yIChkaXNwbGF5LCBpZCkge1xuXHRcdHN1cGVyKGRpc3BsYXksIGlkKVxuXHRcdC8qKlxuXHRcdCAqIEB0eXBlIHtXbFBvaW50ZXJFdmVudHN8bnVsbH1cblx0XHQgKi9cblx0XHR0aGlzLmxpc3RlbmVyID0gbnVsbFxuXHR9XG5cblx0YXN5bmMgWzBdIChtZXNzYWdlKSB7XG5cdFx0YXdhaXQgdGhpcy5saXN0ZW5lci5lbnRlcih1KG1lc3NhZ2UpLCBvKG1lc3NhZ2UsIGZhbHNlLCB0aGlzLmRpc3BsYXkuY29ubmVjdGlvbiksIGYobWVzc2FnZSksIGYobWVzc2FnZSkpXG5cdH1cblxuXHRhc3luYyBbMV0gKG1lc3NhZ2UpIHtcblx0XHRhd2FpdCB0aGlzLmxpc3RlbmVyLmxlYXZlKHUobWVzc2FnZSksIG8obWVzc2FnZSwgZmFsc2UsIHRoaXMuZGlzcGxheS5jb25uZWN0aW9uKSlcblx0fVxuXG5cdGFzeW5jIFsyXSAobWVzc2FnZSkge1xuXHRcdGF3YWl0IHRoaXMubGlzdGVuZXIubW90aW9uKHUobWVzc2FnZSksIGYobWVzc2FnZSksIGYobWVzc2FnZSkpXG5cdH1cblxuXHRhc3luYyBbM10gKG1lc3NhZ2UpIHtcblx0XHRhd2FpdCB0aGlzLmxpc3RlbmVyLmJ1dHRvbih1KG1lc3NhZ2UpLCB1KG1lc3NhZ2UpLCB1KG1lc3NhZ2UpLCB1KG1lc3NhZ2UpKVxuXHR9XG5cblx0YXN5bmMgWzRdIChtZXNzYWdlKSB7XG5cdFx0YXdhaXQgdGhpcy5saXN0ZW5lci5heGlzKHUobWVzc2FnZSksIHUobWVzc2FnZSksIGYobWVzc2FnZSkpXG5cdH1cblxuXHRhc3luYyBbNV0gKG1lc3NhZ2UpIHtcblx0XHRhd2FpdCB0aGlzLmxpc3RlbmVyLmZyYW1lKClcblx0fVxuXG5cdGFzeW5jIFs2XSAobWVzc2FnZSkge1xuXHRcdGF3YWl0IHRoaXMubGlzdGVuZXIuYXhpc1NvdXJjZSh1KG1lc3NhZ2UpKVxuXHR9XG5cblx0YXN5bmMgWzddIChtZXNzYWdlKSB7XG5cdFx0YXdhaXQgdGhpcy5saXN0ZW5lci5heGlzU3RvcCh1KG1lc3NhZ2UpLCB1KG1lc3NhZ2UpKVxuXHR9XG5cblx0YXN5bmMgWzhdIChtZXNzYWdlKSB7XG5cdFx0YXdhaXQgdGhpcy5saXN0ZW5lci5heGlzRGlzY3JldGUodShtZXNzYWdlKSwgaShtZXNzYWdlKSlcblx0fVxuXG59XG5XbFBvaW50ZXJQcm94eS5wcm90b2NvbE5hbWUgPSAnd2xfcG9pbnRlcidcblxuV2xQb2ludGVyUHJveHkuRXJyb3IgPSB7XG4gIC8qKlxuICAgKiBnaXZlbiB3bF9zdXJmYWNlIGhhcyBhbm90aGVyIHJvbGVcbiAgICovXG4gIHJvbGU6IDBcbn1cblxuV2xQb2ludGVyUHJveHkuQnV0dG9uU3RhdGUgPSB7XG4gIC8qKlxuICAgKiB0aGUgYnV0dG9uIGlzIG5vdCBwcmVzc2VkXG4gICAqL1xuICByZWxlYXNlZDogMCxcbiAgLyoqXG4gICAqIHRoZSBidXR0b24gaXMgcHJlc3NlZFxuICAgKi9cbiAgcHJlc3NlZDogMVxufVxuXG5XbFBvaW50ZXJQcm94eS5BeGlzID0ge1xuICAvKipcbiAgICogdmVydGljYWwgYXhpc1xuICAgKi9cbiAgdmVydGljYWxTY3JvbGw6IDAsXG4gIC8qKlxuICAgKiBob3Jpem9udGFsIGF4aXNcbiAgICovXG4gIGhvcml6b250YWxTY3JvbGw6IDFcbn1cblxuV2xQb2ludGVyUHJveHkuQXhpc1NvdXJjZSA9IHtcbiAgLyoqXG4gICAqIGEgcGh5c2ljYWwgd2hlZWwgcm90YXRpb25cbiAgICovXG4gIHdoZWVsOiAwLFxuICAvKipcbiAgICogZmluZ2VyIG9uIGEgdG91Y2ggc3VyZmFjZVxuICAgKi9cbiAgZmluZ2VyOiAxLFxuICAvKipcbiAgICogY29udGludW91cyBjb29yZGluYXRlIHNwYWNlXG4gICAqL1xuICBjb250aW51b3VzOiAyLFxuICAvKipcbiAgICogYSBwaHlzaWNhbCB3aGVlbCB0aWx0XG4gICAqL1xuICB3aGVlbFRpbHQ6IDNcbn1cblxuZXhwb3J0IGRlZmF1bHQgV2xQb2ludGVyUHJveHlcbiIsIi8qXG4gKlxuICogICAgQ29weXJpZ2h0IMKpIDIwMDgtMjAxMSBLcmlzdGlhbiBIw7hnc2JlcmdcbiAqICAgIENvcHlyaWdodCDCqSAyMDEwLTIwMTEgSW50ZWwgQ29ycG9yYXRpb25cbiAqICAgIENvcHlyaWdodCDCqSAyMDEyLTIwMTMgQ29sbGFib3JhLCBMdGQuXG4gKlxuICogICAgUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqICAgIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzXG4gKiAgICAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiAgICBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogICAgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqICAgIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiAgICBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiAgICBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSAoaW5jbHVkaW5nIHRoZVxuICogICAgbmV4dCBwYXJhZ3JhcGgpIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWxcbiAqICAgIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiAgICBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogICAgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4gKiAgICBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuICogICAgTk9OSU5GUklOR0VNRU5ULiAgSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlNcbiAqICAgIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTlxuICogICAgQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU5cbiAqICAgIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbiAqICAgIFNPRlRXQVJFLlxuICogIFxuICovXG5cbmltcG9ydCB7IENvbm5lY3Rpb24gfSBmcm9tICd3ZXN0ZmllbGQtcnVudGltZS1jb21tb24nXG5jb25zdCB7IHVpbnQsIHVpbnRPcHRpb25hbCwgaW50LCBpbnRPcHRpb25hbCwgZml4ZWQsIFxuXHRmaXhlZE9wdGlvbmFsLCBvYmplY3QsIG9iamVjdE9wdGlvbmFsLCBuZXdPYmplY3QsIHN0cmluZywgXG5cdHN0cmluZ09wdGlvbmFsLCBhcnJheSwgYXJyYXlPcHRpb25hbCwgXG5cdGZpbGVEZXNjcmlwdG9yT3B0aW9uYWwsIGZpbGVEZXNjcmlwdG9yLCBcbmgsIHUsIGksIGYsIG8sIG4sIHMsIGEgfSA9IENvbm5lY3Rpb25cbmltcG9ydCBQcm94eSBmcm9tICcuL1Byb3h5J1xuXG4vKipcbiAqXG4gKiAgICAgIEEgcmVnaW9uIG9iamVjdCBkZXNjcmliZXMgYW4gYXJlYS5cbiAqXG4gKiAgICAgIFJlZ2lvbiBvYmplY3RzIGFyZSB1c2VkIHRvIGRlc2NyaWJlIHRoZSBvcGFxdWUgYW5kIGlucHV0XG4gKiAgICAgIHJlZ2lvbnMgb2YgYSBzdXJmYWNlLlxuICogICAgXG4gKi9cbmNsYXNzIFdsUmVnaW9uUHJveHkgZXh0ZW5kcyBQcm94eSB7XG5cblx0LyoqXG5cdCAqXG5cdCAqXHREZXN0cm95IHRoZSByZWdpb24uICBUaGlzIHdpbGwgaW52YWxpZGF0ZSB0aGUgb2JqZWN0IElELlxuXHQgKiAgICAgIFxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0ZGVzdHJveSAoKSB7XG5cdFx0dGhpcy5kaXNwbGF5Lm1hcnNoYWxsKHRoaXMuaWQsIDAsIFtdKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRBZGQgdGhlIHNwZWNpZmllZCByZWN0YW5nbGUgdG8gdGhlIHJlZ2lvbi5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHtudW1iZXJ9IHggcmVnaW9uLWxvY2FsIHggY29vcmRpbmF0ZSBcblx0ICogQHBhcmFtIHtudW1iZXJ9IHkgcmVnaW9uLWxvY2FsIHkgY29vcmRpbmF0ZSBcblx0ICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIHJlY3RhbmdsZSB3aWR0aCBcblx0ICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCByZWN0YW5nbGUgaGVpZ2h0IFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0YWRkICh4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XG5cdFx0dGhpcy5kaXNwbGF5Lm1hcnNoYWxsKHRoaXMuaWQsIDEsIFtpbnQoeCksIGludCh5KSwgaW50KHdpZHRoKSwgaW50KGhlaWdodCldKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRTdWJ0cmFjdCB0aGUgc3BlY2lmaWVkIHJlY3RhbmdsZSBmcm9tIHRoZSByZWdpb24uXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB4IHJlZ2lvbi1sb2NhbCB4IGNvb3JkaW5hdGUgXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB5IHJlZ2lvbi1sb2NhbCB5IGNvb3JkaW5hdGUgXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCByZWN0YW5nbGUgd2lkdGggXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgcmVjdGFuZ2xlIGhlaWdodCBcblx0ICpcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdHN1YnRyYWN0ICh4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XG5cdFx0dGhpcy5kaXNwbGF5Lm1hcnNoYWxsKHRoaXMuaWQsIDIsIFtpbnQoeCksIGludCh5KSwgaW50KHdpZHRoKSwgaW50KGhlaWdodCldKVxuXHR9XG5cbi8qKlxuXHQgKkBwYXJhbSB7RGlzcGxheX1kaXNwbGF5XG5cdCAqQHBhcmFtIHtudW1iZXJ9aWRcblx0ICovXG5cdGNvbnN0cnVjdG9yIChkaXNwbGF5LCBpZCkge1xuXHRcdHN1cGVyKGRpc3BsYXksIGlkKVxuXHRcdC8qKlxuXHRcdCAqIEB0eXBlIHtXbFJlZ2lvbkV2ZW50c3xudWxsfVxuXHRcdCAqL1xuXHRcdHRoaXMubGlzdGVuZXIgPSBudWxsXG5cdH1cblxufVxuV2xSZWdpb25Qcm94eS5wcm90b2NvbE5hbWUgPSAnd2xfcmVnaW9uJ1xuXG5leHBvcnQgZGVmYXVsdCBXbFJlZ2lvblByb3h5XG4iLCIvKlxuICpcbiAqICAgIENvcHlyaWdodCDCqSAyMDA4LTIwMTEgS3Jpc3RpYW4gSMO4Z3NiZXJnXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMC0yMDExIEludGVsIENvcnBvcmF0aW9uXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMi0yMDEzIENvbGxhYm9yYSwgTHRkLlxuICpcbiAqICAgIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiAgICBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlc1xuICogICAgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogICAgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqICAgIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiAgICBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogICAgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogICAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2UgKGluY2x1ZGluZyB0aGVcbiAqICAgIG5leHQgcGFyYWdyYXBoKSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsXG4gKiAgICBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogICAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqICAgIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuICogICAgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbiAqICAgIE5PTklORlJJTkdFTUVOVC4gIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTXG4gKiAgICBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU5cbiAqICAgIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOXG4gKiAgICBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4gKiAgICBTT0ZUV0FSRS5cbiAqICBcbiAqL1xuXG4vKipcbiAqIEBpbnRlcmZhY2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2xSZWdpc3RyeUV2ZW50cyB7XG5cblx0LyoqXG5cdCAqXG5cdCAqXHROb3RpZnkgdGhlIGNsaWVudCBvZiBnbG9iYWwgb2JqZWN0cy5cblx0ICpcblx0ICpcdFRoZSBldmVudCBub3RpZmllcyB0aGUgY2xpZW50IHRoYXQgYSBnbG9iYWwgb2JqZWN0IHdpdGhcblx0ICpcdHRoZSBnaXZlbiBuYW1lIGlzIG5vdyBhdmFpbGFibGUsIGFuZCBpdCBpbXBsZW1lbnRzIHRoZVxuXHQgKlx0Z2l2ZW4gdmVyc2lvbiBvZiB0aGUgZ2l2ZW4gaW50ZXJmYWNlLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0ge251bWJlcn0gbmFtZSBudW1lcmljIG5hbWUgb2YgdGhlIGdsb2JhbCBvYmplY3QgXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBpbnRlcmZhY2UgaW50ZXJmYWNlIGltcGxlbWVudGVkIGJ5IHRoZSBvYmplY3QgXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB2ZXJzaW9uIGludGVyZmFjZSB2ZXJzaW9uIFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0Z2xvYmFsKG5hbWUsIGludGVyZmFjZV8sIHZlcnNpb24pIHt9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHROb3RpZnkgdGhlIGNsaWVudCBvZiByZW1vdmVkIGdsb2JhbCBvYmplY3RzLlxuXHQgKlxuXHQgKlx0VGhpcyBldmVudCBub3RpZmllcyB0aGUgY2xpZW50IHRoYXQgdGhlIGdsb2JhbCBpZGVudGlmaWVkXG5cdCAqXHRieSBuYW1lIGlzIG5vIGxvbmdlciBhdmFpbGFibGUuICBJZiB0aGUgY2xpZW50IGJvdW5kIHRvXG5cdCAqXHR0aGUgZ2xvYmFsIHVzaW5nIHRoZSBiaW5kIHJlcXVlc3QsIHRoZSBjbGllbnQgc2hvdWxkIG5vd1xuXHQgKlx0ZGVzdHJveSB0aGF0IG9iamVjdC5cblx0ICpcblx0ICpcdFRoZSBvYmplY3QgcmVtYWlucyB2YWxpZCBhbmQgcmVxdWVzdHMgdG8gdGhlIG9iamVjdCB3aWxsIGJlXG5cdCAqXHRpZ25vcmVkIHVudGlsIHRoZSBjbGllbnQgZGVzdHJveXMgaXQsIHRvIGF2b2lkIHJhY2VzIGJldHdlZW5cblx0ICpcdHRoZSBnbG9iYWwgZ29pbmcgYXdheSBhbmQgYSBjbGllbnQgc2VuZGluZyBhIHJlcXVlc3QgdG8gaXQuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBuYW1lIG51bWVyaWMgbmFtZSBvZiB0aGUgZ2xvYmFsIG9iamVjdCBcblx0ICpcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdGdsb2JhbFJlbW92ZShuYW1lKSB7fVxufVxuXG4iLCIvKlxuICpcbiAqICAgIENvcHlyaWdodCDCqSAyMDA4LTIwMTEgS3Jpc3RpYW4gSMO4Z3NiZXJnXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMC0yMDExIEludGVsIENvcnBvcmF0aW9uXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMi0yMDEzIENvbGxhYm9yYSwgTHRkLlxuICpcbiAqICAgIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiAgICBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlc1xuICogICAgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogICAgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqICAgIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiAgICBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogICAgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogICAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2UgKGluY2x1ZGluZyB0aGVcbiAqICAgIG5leHQgcGFyYWdyYXBoKSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsXG4gKiAgICBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogICAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqICAgIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuICogICAgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbiAqICAgIE5PTklORlJJTkdFTUVOVC4gIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTXG4gKiAgICBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU5cbiAqICAgIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOXG4gKiAgICBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4gKiAgICBTT0ZUV0FSRS5cbiAqICBcbiAqL1xuXG5pbXBvcnQgeyBDb25uZWN0aW9uIH0gZnJvbSAnd2VzdGZpZWxkLXJ1bnRpbWUtY29tbW9uJ1xuY29uc3QgeyB1aW50LCB1aW50T3B0aW9uYWwsIGludCwgaW50T3B0aW9uYWwsIGZpeGVkLCBcblx0Zml4ZWRPcHRpb25hbCwgb2JqZWN0LCBvYmplY3RPcHRpb25hbCwgbmV3T2JqZWN0LCBzdHJpbmcsIFxuXHRzdHJpbmdPcHRpb25hbCwgYXJyYXksIGFycmF5T3B0aW9uYWwsIFxuXHRmaWxlRGVzY3JpcHRvck9wdGlvbmFsLCBmaWxlRGVzY3JpcHRvciwgXG5oLCB1LCBpLCBmLCBvLCBuLCBzLCBhIH0gPSBDb25uZWN0aW9uXG5pbXBvcnQgUHJveHkgZnJvbSAnLi9Qcm94eSdcblxuLyoqXG4gKlxuICogICAgICBUaGUgc2luZ2xldG9uIGdsb2JhbCByZWdpc3RyeSBvYmplY3QuICBUaGUgc2VydmVyIGhhcyBhIG51bWJlciBvZlxuICogICAgICBnbG9iYWwgb2JqZWN0cyB0aGF0IGFyZSBhdmFpbGFibGUgdG8gYWxsIGNsaWVudHMuICBUaGVzZSBvYmplY3RzXG4gKiAgICAgIHR5cGljYWxseSByZXByZXNlbnQgYW4gYWN0dWFsIG9iamVjdCBpbiB0aGUgc2VydmVyIChmb3IgZXhhbXBsZSxcbiAqICAgICAgYW4gaW5wdXQgZGV2aWNlKSBvciB0aGV5IGFyZSBzaW5nbGV0b24gb2JqZWN0cyB0aGF0IHByb3ZpZGVcbiAqICAgICAgZXh0ZW5zaW9uIGZ1bmN0aW9uYWxpdHkuXG4gKlxuICogICAgICBXaGVuIGEgY2xpZW50IGNyZWF0ZXMgYSByZWdpc3RyeSBvYmplY3QsIHRoZSByZWdpc3RyeSBvYmplY3RcbiAqICAgICAgd2lsbCBlbWl0IGEgZ2xvYmFsIGV2ZW50IGZvciBlYWNoIGdsb2JhbCBjdXJyZW50bHkgaW4gdGhlXG4gKiAgICAgIHJlZ2lzdHJ5LiAgR2xvYmFscyBjb21lIGFuZCBnbyBhcyBhIHJlc3VsdCBvZiBkZXZpY2Ugb3JcbiAqICAgICAgbW9uaXRvciBob3RwbHVncywgcmVjb25maWd1cmF0aW9uIG9yIG90aGVyIGV2ZW50cywgYW5kIHRoZVxuICogICAgICByZWdpc3RyeSB3aWxsIHNlbmQgb3V0IGdsb2JhbCBhbmQgZ2xvYmFsX3JlbW92ZSBldmVudHMgdG9cbiAqICAgICAga2VlcCB0aGUgY2xpZW50IHVwIHRvIGRhdGUgd2l0aCB0aGUgY2hhbmdlcy4gIFRvIG1hcmsgdGhlIGVuZFxuICogICAgICBvZiB0aGUgaW5pdGlhbCBidXJzdCBvZiBldmVudHMsIHRoZSBjbGllbnQgY2FuIHVzZSB0aGVcbiAqICAgICAgd2xfZGlzcGxheS5zeW5jIHJlcXVlc3QgaW1tZWRpYXRlbHkgYWZ0ZXIgY2FsbGluZ1xuICogICAgICB3bF9kaXNwbGF5LmdldF9yZWdpc3RyeS5cbiAqXG4gKiAgICAgIEEgY2xpZW50IGNhbiBiaW5kIHRvIGEgZ2xvYmFsIG9iamVjdCBieSB1c2luZyB0aGUgYmluZFxuICogICAgICByZXF1ZXN0LiAgVGhpcyBjcmVhdGVzIGEgY2xpZW50LXNpZGUgaGFuZGxlIHRoYXQgbGV0cyB0aGUgb2JqZWN0XG4gKiAgICAgIGVtaXQgZXZlbnRzIHRvIHRoZSBjbGllbnQgYW5kIGxldHMgdGhlIGNsaWVudCBpbnZva2UgcmVxdWVzdHMgb25cbiAqICAgICAgdGhlIG9iamVjdC5cbiAqICAgIFxuICovXG5jbGFzcyBXbFJlZ2lzdHJ5UHJveHkgZXh0ZW5kcyBQcm94eSB7XG5cdC8qKlxuXHQqIEJpbmQgYSBuZXcgb2JqZWN0IHRvIHRoZSBnbG9iYWwuXG5cdCpcblx0KiBCaW5kcyBhIG5ldywgY2xpZW50LWNyZWF0ZWQgb2JqZWN0IHRvIHRoZSBzZXJ2ZXIgdXNpbmcgdGhlIHNwZWNpZmllZCBuYW1lIGFzIHRoZSBpZGVudGlmaWVyLlxuXHQqXG5cdCogQHBhcmFtIHtudW1iZXJ9IG5hbWUgdW5pcXVlIG51bWVyaWMgbmFtZSBvZiB0aGUgZ2xvYmFsXG5cdCogQHBhcmFtIHtzdHJpbmd9IGludGVyZmFjZV8gaW50ZXJmYWNlIGltcGxlbWVudGVkIGJ5IHRoZSBuZXcgb2JqZWN0XG5cdCogQHBhcmFtIHtPYmplY3R9IHByb3h5Q2xhc3Ncblx0KiBAcGFyYW0ge251bWJlcn0gdmVyc2lvbiBUaGUgdmVyc2lvbiB1c2VkIGFuZCBzdXBwb3J0ZWQgYnkgdGhlIGNsaWVudFxuXHQqIEByZXR1cm4ge09iamVjdH0gYSBuZXcgYm91bmRlZCBvYmplY3Rcblx0Ki9cblx0YmluZCAobmFtZSwgaW50ZXJmYWNlXywgcHJveHlDbGFzcywgdmVyc2lvbikge1xuXHRcdHJldHVybiB0aGlzLmRpc3BsYXkubWFyc2hhbGxDb25zdHJ1Y3Rvcih0aGlzLmlkLCAwLCBwcm94eUNsYXNzLCBbdWludChuYW1lKSwgc3RyaW5nKGludGVyZmFjZV8pLCB1aW50KHZlcnNpb24pLCBuZXdPYmplY3QoKV0pXG5cdH1cblxuLyoqXG5cdCAqQHBhcmFtIHtEaXNwbGF5fWRpc3BsYXlcblx0ICpAcGFyYW0ge251bWJlcn1pZFxuXHQgKi9cblx0Y29uc3RydWN0b3IgKGRpc3BsYXksIGlkKSB7XG5cdFx0c3VwZXIoZGlzcGxheSwgaWQpXG5cdFx0LyoqXG5cdFx0ICogQHR5cGUge1dsUmVnaXN0cnlFdmVudHN8bnVsbH1cblx0XHQgKi9cblx0XHR0aGlzLmxpc3RlbmVyID0gbnVsbFxuXHR9XG5cblx0YXN5bmMgWzBdIChtZXNzYWdlKSB7XG5cdFx0YXdhaXQgdGhpcy5saXN0ZW5lci5nbG9iYWwodShtZXNzYWdlKSwgcyhtZXNzYWdlLCBmYWxzZSksIHUobWVzc2FnZSkpXG5cdH1cblxuXHRhc3luYyBbMV0gKG1lc3NhZ2UpIHtcblx0XHRhd2FpdCB0aGlzLmxpc3RlbmVyLmdsb2JhbFJlbW92ZSh1KG1lc3NhZ2UpKVxuXHR9XG5cbn1cbldsUmVnaXN0cnlQcm94eS5wcm90b2NvbE5hbWUgPSAnd2xfcmVnaXN0cnknXG5cbmV4cG9ydCBkZWZhdWx0IFdsUmVnaXN0cnlQcm94eVxuIiwiLypcbiAqXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAwOC0yMDExIEtyaXN0aWFuIEjDuGdzYmVyZ1xuICogICAgQ29weXJpZ2h0IMKpIDIwMTAtMjAxMSBJbnRlbCBDb3Jwb3JhdGlvblxuICogICAgQ29weXJpZ2h0IMKpIDIwMTItMjAxMyBDb2xsYWJvcmEsIEx0ZC5cbiAqXG4gKiAgICBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogICAgb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXNcbiAqICAgICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqICAgIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiAgICBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogICAgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqICAgIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqICAgIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIChpbmNsdWRpbmcgdGhlXG4gKiAgICBuZXh0IHBhcmFncmFwaCkgc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbFxuICogICAgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqICAgIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiAgICBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0ZcbiAqICAgIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG4gKiAgICBOT05JTkZSSU5HRU1FTlQuICBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSU1xuICogICAgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOXG4gKiAgICBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTlxuICogICAgQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuICogICAgU09GVFdBUkUuXG4gKiAgXG4gKi9cblxuLyoqXG4gKiBAaW50ZXJmYWNlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdsU2VhdEV2ZW50cyB7XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRUaGlzIGlzIGVtaXR0ZWQgd2hlbmV2ZXIgYSBzZWF0IGdhaW5zIG9yIGxvc2VzIHRoZSBwb2ludGVyLFxuXHQgKlx0a2V5Ym9hcmQgb3IgdG91Y2ggY2FwYWJpbGl0aWVzLiAgVGhlIGFyZ3VtZW50IGlzIGEgY2FwYWJpbGl0eVxuXHQgKlx0ZW51bSBjb250YWluaW5nIHRoZSBjb21wbGV0ZSBzZXQgb2YgY2FwYWJpbGl0aWVzIHRoaXMgc2VhdCBoYXMuXG5cdCAqXG5cdCAqXHRXaGVuIHRoZSBwb2ludGVyIGNhcGFiaWxpdHkgaXMgYWRkZWQsIGEgY2xpZW50IG1heSBjcmVhdGUgYVxuXHQgKlx0d2xfcG9pbnRlciBvYmplY3QgdXNpbmcgdGhlIHdsX3NlYXQuZ2V0X3BvaW50ZXIgcmVxdWVzdC4gVGhpcyBvYmplY3Rcblx0ICpcdHdpbGwgcmVjZWl2ZSBwb2ludGVyIGV2ZW50cyB1bnRpbCB0aGUgY2FwYWJpbGl0eSBpcyByZW1vdmVkIGluIHRoZVxuXHQgKlx0ZnV0dXJlLlxuXHQgKlxuXHQgKlx0V2hlbiB0aGUgcG9pbnRlciBjYXBhYmlsaXR5IGlzIHJlbW92ZWQsIGEgY2xpZW50IHNob3VsZCBkZXN0cm95IHRoZVxuXHQgKlx0d2xfcG9pbnRlciBvYmplY3RzIGFzc29jaWF0ZWQgd2l0aCB0aGUgc2VhdCB3aGVyZSB0aGUgY2FwYWJpbGl0eSB3YXNcblx0ICpcdHJlbW92ZWQsIHVzaW5nIHRoZSB3bF9wb2ludGVyLnJlbGVhc2UgcmVxdWVzdC4gTm8gZnVydGhlciBwb2ludGVyXG5cdCAqXHRldmVudHMgd2lsbCBiZSByZWNlaXZlZCBvbiB0aGVzZSBvYmplY3RzLlxuXHQgKlxuXHQgKlx0SW4gc29tZSBjb21wb3NpdG9ycywgaWYgYSBzZWF0IHJlZ2FpbnMgdGhlIHBvaW50ZXIgY2FwYWJpbGl0eSBhbmQgYVxuXHQgKlx0Y2xpZW50IGhhcyBhIHByZXZpb3VzbHkgb2J0YWluZWQgd2xfcG9pbnRlciBvYmplY3Qgb2YgdmVyc2lvbiA0IG9yXG5cdCAqXHRsZXNzLCB0aGF0IG9iamVjdCBtYXkgc3RhcnQgc2VuZGluZyBwb2ludGVyIGV2ZW50cyBhZ2Fpbi4gVGhpc1xuXHQgKlx0YmVoYXZpb3IgaXMgY29uc2lkZXJlZCBhIG1pc2ludGVycHJldGF0aW9uIG9mIHRoZSBpbnRlbmRlZCBiZWhhdmlvclxuXHQgKlx0YW5kIG11c3Qgbm90IGJlIHJlbGllZCB1cG9uIGJ5IHRoZSBjbGllbnQuIHdsX3BvaW50ZXIgb2JqZWN0cyBvZlxuXHQgKlx0dmVyc2lvbiA1IG9yIGxhdGVyIG11c3Qgbm90IHNlbmQgZXZlbnRzIGlmIGNyZWF0ZWQgYmVmb3JlIHRoZSBtb3N0XG5cdCAqXHRyZWNlbnQgZXZlbnQgbm90aWZ5aW5nIHRoZSBjbGllbnQgb2YgYW4gYWRkZWQgcG9pbnRlciBjYXBhYmlsaXR5LlxuXHQgKlxuXHQgKlx0VGhlIGFib3ZlIGJlaGF2aW9yIGFsc28gYXBwbGllcyB0byB3bF9rZXlib2FyZCBhbmQgd2xfdG91Y2ggd2l0aCB0aGVcblx0ICpcdGtleWJvYXJkIGFuZCB0b3VjaCBjYXBhYmlsaXRpZXMsIHJlc3BlY3RpdmVseS5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHtudW1iZXJ9IGNhcGFiaWxpdGllcyBjYXBhYmlsaXRpZXMgb2YgdGhlIHNlYXQgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRjYXBhYmlsaXRpZXMoY2FwYWJpbGl0aWVzKSB7fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0SW4gYSBtdWx0aXNlYXQgY29uZmlndXJhdGlvbiB0aGlzIGNhbiBiZSB1c2VkIGJ5IHRoZSBjbGllbnQgdG8gaGVscFxuXHQgKlx0aWRlbnRpZnkgd2hpY2ggcGh5c2ljYWwgZGV2aWNlcyB0aGUgc2VhdCByZXByZXNlbnRzLiBCYXNlZCBvblxuXHQgKlx0dGhlIHNlYXQgY29uZmlndXJhdGlvbiB1c2VkIGJ5IHRoZSBjb21wb3NpdG9yLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBzZWF0IGlkZW50aWZpZXIgXG5cdCAqXG5cdCAqIEBzaW5jZSAyXG5cdCAqXG5cdCAqL1xuXHRuYW1lKG5hbWUpIHt9XG59XG5cbiIsIi8qXG4gKlxuICogICAgQ29weXJpZ2h0IMKpIDIwMDgtMjAxMSBLcmlzdGlhbiBIw7hnc2JlcmdcbiAqICAgIENvcHlyaWdodCDCqSAyMDEwLTIwMTEgSW50ZWwgQ29ycG9yYXRpb25cbiAqICAgIENvcHlyaWdodCDCqSAyMDEyLTIwMTMgQ29sbGFib3JhLCBMdGQuXG4gKlxuICogICAgUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqICAgIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzXG4gKiAgICAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiAgICBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogICAgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqICAgIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiAgICBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiAgICBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSAoaW5jbHVkaW5nIHRoZVxuICogICAgbmV4dCBwYXJhZ3JhcGgpIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWxcbiAqICAgIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiAgICBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogICAgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4gKiAgICBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuICogICAgTk9OSU5GUklOR0VNRU5ULiAgSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlNcbiAqICAgIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTlxuICogICAgQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU5cbiAqICAgIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbiAqICAgIFNPRlRXQVJFLlxuICogIFxuICovXG5cbmltcG9ydCB7IENvbm5lY3Rpb24gfSBmcm9tICd3ZXN0ZmllbGQtcnVudGltZS1jb21tb24nXG5jb25zdCB7IHVpbnQsIHVpbnRPcHRpb25hbCwgaW50LCBpbnRPcHRpb25hbCwgZml4ZWQsIFxuXHRmaXhlZE9wdGlvbmFsLCBvYmplY3QsIG9iamVjdE9wdGlvbmFsLCBuZXdPYmplY3QsIHN0cmluZywgXG5cdHN0cmluZ09wdGlvbmFsLCBhcnJheSwgYXJyYXlPcHRpb25hbCwgXG5cdGZpbGVEZXNjcmlwdG9yT3B0aW9uYWwsIGZpbGVEZXNjcmlwdG9yLCBcbmgsIHUsIGksIGYsIG8sIG4sIHMsIGEgfSA9IENvbm5lY3Rpb25cbmltcG9ydCBQcm94eSBmcm9tICcuL1Byb3h5J1xuaW1wb3J0IFdsUG9pbnRlclByb3h5IGZyb20gJy4vV2xQb2ludGVyUHJveHknXG5pbXBvcnQgV2xLZXlib2FyZFByb3h5IGZyb20gJy4vV2xLZXlib2FyZFByb3h5J1xuaW1wb3J0IFdsVG91Y2hQcm94eSBmcm9tICcuL1dsVG91Y2hQcm94eSdcblxuLyoqXG4gKlxuICogICAgICBBIHNlYXQgaXMgYSBncm91cCBvZiBrZXlib2FyZHMsIHBvaW50ZXIgYW5kIHRvdWNoIGRldmljZXMuIFRoaXNcbiAqICAgICAgb2JqZWN0IGlzIHB1Ymxpc2hlZCBhcyBhIGdsb2JhbCBkdXJpbmcgc3RhcnQgdXAsIG9yIHdoZW4gc3VjaCBhXG4gKiAgICAgIGRldmljZSBpcyBob3QgcGx1Z2dlZC4gIEEgc2VhdCB0eXBpY2FsbHkgaGFzIGEgcG9pbnRlciBhbmRcbiAqICAgICAgbWFpbnRhaW5zIGEga2V5Ym9hcmQgZm9jdXMgYW5kIGEgcG9pbnRlciBmb2N1cy5cbiAqICAgIFxuICovXG5jbGFzcyBXbFNlYXRQcm94eSBleHRlbmRzIFByb3h5IHtcblxuXHQvKipcblx0ICpcblx0ICpcdFRoZSBJRCBwcm92aWRlZCB3aWxsIGJlIGluaXRpYWxpemVkIHRvIHRoZSB3bF9wb2ludGVyIGludGVyZmFjZVxuXHQgKlx0Zm9yIHRoaXMgc2VhdC5cblx0ICpcblx0ICpcdFRoaXMgcmVxdWVzdCBvbmx5IHRha2VzIGVmZmVjdCBpZiB0aGUgc2VhdCBoYXMgdGhlIHBvaW50ZXJcblx0ICpcdGNhcGFiaWxpdHksIG9yIGhhcyBoYWQgdGhlIHBvaW50ZXIgY2FwYWJpbGl0eSBpbiB0aGUgcGFzdC5cblx0ICpcdEl0IGlzIGEgcHJvdG9jb2wgdmlvbGF0aW9uIHRvIGlzc3VlIHRoaXMgcmVxdWVzdCBvbiBhIHNlYXQgdGhhdCBoYXNcblx0ICpcdG5ldmVyIGhhZCB0aGUgcG9pbnRlciBjYXBhYmlsaXR5LlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcmV0dXJuIHtXbFBvaW50ZXJQcm94eX0gc2VhdCBwb2ludGVyIFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0Z2V0UG9pbnRlciAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZGlzcGxheS5tYXJzaGFsbENvbnN0cnVjdG9yKHRoaXMuaWQsIDAsIFdsUG9pbnRlclByb3h5LCBbbmV3T2JqZWN0KCldKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRUaGUgSUQgcHJvdmlkZWQgd2lsbCBiZSBpbml0aWFsaXplZCB0byB0aGUgd2xfa2V5Ym9hcmQgaW50ZXJmYWNlXG5cdCAqXHRmb3IgdGhpcyBzZWF0LlxuXHQgKlxuXHQgKlx0VGhpcyByZXF1ZXN0IG9ubHkgdGFrZXMgZWZmZWN0IGlmIHRoZSBzZWF0IGhhcyB0aGUga2V5Ym9hcmRcblx0ICpcdGNhcGFiaWxpdHksIG9yIGhhcyBoYWQgdGhlIGtleWJvYXJkIGNhcGFiaWxpdHkgaW4gdGhlIHBhc3QuXG5cdCAqXHRJdCBpcyBhIHByb3RvY29sIHZpb2xhdGlvbiB0byBpc3N1ZSB0aGlzIHJlcXVlc3Qgb24gYSBzZWF0IHRoYXQgaGFzXG5cdCAqXHRuZXZlciBoYWQgdGhlIGtleWJvYXJkIGNhcGFiaWxpdHkuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEByZXR1cm4ge1dsS2V5Ym9hcmRQcm94eX0gc2VhdCBrZXlib2FyZCBcblx0ICpcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdGdldEtleWJvYXJkICgpIHtcblx0XHRyZXR1cm4gdGhpcy5kaXNwbGF5Lm1hcnNoYWxsQ29uc3RydWN0b3IodGhpcy5pZCwgMSwgV2xLZXlib2FyZFByb3h5LCBbbmV3T2JqZWN0KCldKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRUaGUgSUQgcHJvdmlkZWQgd2lsbCBiZSBpbml0aWFsaXplZCB0byB0aGUgd2xfdG91Y2ggaW50ZXJmYWNlXG5cdCAqXHRmb3IgdGhpcyBzZWF0LlxuXHQgKlxuXHQgKlx0VGhpcyByZXF1ZXN0IG9ubHkgdGFrZXMgZWZmZWN0IGlmIHRoZSBzZWF0IGhhcyB0aGUgdG91Y2hcblx0ICpcdGNhcGFiaWxpdHksIG9yIGhhcyBoYWQgdGhlIHRvdWNoIGNhcGFiaWxpdHkgaW4gdGhlIHBhc3QuXG5cdCAqXHRJdCBpcyBhIHByb3RvY29sIHZpb2xhdGlvbiB0byBpc3N1ZSB0aGlzIHJlcXVlc3Qgb24gYSBzZWF0IHRoYXQgaGFzXG5cdCAqXHRuZXZlciBoYWQgdGhlIHRvdWNoIGNhcGFiaWxpdHkuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEByZXR1cm4ge1dsVG91Y2hQcm94eX0gc2VhdCB0b3VjaCBpbnRlcmZhY2UgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRnZXRUb3VjaCAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZGlzcGxheS5tYXJzaGFsbENvbnN0cnVjdG9yKHRoaXMuaWQsIDIsIFdsVG91Y2hQcm94eSwgW25ld09iamVjdCgpXSlcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0VXNpbmcgdGhpcyByZXF1ZXN0IGEgY2xpZW50IGNhbiB0ZWxsIHRoZSBzZXJ2ZXIgdGhhdCBpdCBpcyBub3QgZ29pbmcgdG9cblx0ICpcdHVzZSB0aGUgc2VhdCBvYmplY3QgYW55bW9yZS5cblx0ICogICAgICBcblx0ICogQHNpbmNlIDVcblx0ICpcblx0ICovXG5cdHJlbGVhc2UgKCkge1xuXHRcdHRoaXMuZGlzcGxheS5tYXJzaGFsbCh0aGlzLmlkLCAzLCBbXSlcblx0fVxuXG4vKipcblx0ICpAcGFyYW0ge0Rpc3BsYXl9ZGlzcGxheVxuXHQgKkBwYXJhbSB7bnVtYmVyfWlkXG5cdCAqL1xuXHRjb25zdHJ1Y3RvciAoZGlzcGxheSwgaWQpIHtcblx0XHRzdXBlcihkaXNwbGF5LCBpZClcblx0XHQvKipcblx0XHQgKiBAdHlwZSB7V2xTZWF0RXZlbnRzfG51bGx9XG5cdFx0ICovXG5cdFx0dGhpcy5saXN0ZW5lciA9IG51bGxcblx0fVxuXG5cdGFzeW5jIFswXSAobWVzc2FnZSkge1xuXHRcdGF3YWl0IHRoaXMubGlzdGVuZXIuY2FwYWJpbGl0aWVzKHUobWVzc2FnZSkpXG5cdH1cblxuXHRhc3luYyBbMV0gKG1lc3NhZ2UpIHtcblx0XHRhd2FpdCB0aGlzLmxpc3RlbmVyLm5hbWUocyhtZXNzYWdlLCBmYWxzZSkpXG5cdH1cblxufVxuV2xTZWF0UHJveHkucHJvdG9jb2xOYW1lID0gJ3dsX3NlYXQnXG5cbldsU2VhdFByb3h5LkNhcGFiaWxpdHkgPSB7XG4gIC8qKlxuICAgKiB0aGUgc2VhdCBoYXMgcG9pbnRlciBkZXZpY2VzXG4gICAqL1xuICBwb2ludGVyOiAxLFxuICAvKipcbiAgICogdGhlIHNlYXQgaGFzIG9uZSBvciBtb3JlIGtleWJvYXJkc1xuICAgKi9cbiAga2V5Ym9hcmQ6IDIsXG4gIC8qKlxuICAgKiB0aGUgc2VhdCBoYXMgdG91Y2ggZGV2aWNlc1xuICAgKi9cbiAgdG91Y2g6IDRcbn1cblxuZXhwb3J0IGRlZmF1bHQgV2xTZWF0UHJveHlcbiIsIi8qXG4gKlxuICogICAgQ29weXJpZ2h0IMKpIDIwMDgtMjAxMSBLcmlzdGlhbiBIw7hnc2JlcmdcbiAqICAgIENvcHlyaWdodCDCqSAyMDEwLTIwMTEgSW50ZWwgQ29ycG9yYXRpb25cbiAqICAgIENvcHlyaWdodCDCqSAyMDEyLTIwMTMgQ29sbGFib3JhLCBMdGQuXG4gKlxuICogICAgUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqICAgIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzXG4gKiAgICAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiAgICBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogICAgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqICAgIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiAgICBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiAgICBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSAoaW5jbHVkaW5nIHRoZVxuICogICAgbmV4dCBwYXJhZ3JhcGgpIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWxcbiAqICAgIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiAgICBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogICAgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4gKiAgICBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuICogICAgTk9OSU5GUklOR0VNRU5ULiAgSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlNcbiAqICAgIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTlxuICogICAgQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU5cbiAqICAgIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbiAqICAgIFNPRlRXQVJFLlxuICogIFxuICovXG5cbmltcG9ydCB7IENvbm5lY3Rpb24gfSBmcm9tICd3ZXN0ZmllbGQtcnVudGltZS1jb21tb24nXG5jb25zdCB7IHVpbnQsIHVpbnRPcHRpb25hbCwgaW50LCBpbnRPcHRpb25hbCwgZml4ZWQsIFxuXHRmaXhlZE9wdGlvbmFsLCBvYmplY3QsIG9iamVjdE9wdGlvbmFsLCBuZXdPYmplY3QsIHN0cmluZywgXG5cdHN0cmluZ09wdGlvbmFsLCBhcnJheSwgYXJyYXlPcHRpb25hbCwgXG5cdGZpbGVEZXNjcmlwdG9yT3B0aW9uYWwsIGZpbGVEZXNjcmlwdG9yLCBcbmgsIHUsIGksIGYsIG8sIG4sIHMsIGEgfSA9IENvbm5lY3Rpb25cbmltcG9ydCBQcm94eSBmcm9tICcuL1Byb3h5J1xuaW1wb3J0IFdsU2hlbGxTdXJmYWNlUHJveHkgZnJvbSAnLi9XbFNoZWxsU3VyZmFjZVByb3h5J1xuXG4vKipcbiAqXG4gKiAgICAgIFRoaXMgaW50ZXJmYWNlIGlzIGltcGxlbWVudGVkIGJ5IHNlcnZlcnMgdGhhdCBwcm92aWRlXG4gKiAgICAgIGRlc2t0b3Atc3R5bGUgdXNlciBpbnRlcmZhY2VzLlxuICpcbiAqICAgICAgSXQgYWxsb3dzIGNsaWVudHMgdG8gYXNzb2NpYXRlIGEgd2xfc2hlbGxfc3VyZmFjZSB3aXRoXG4gKiAgICAgIGEgYmFzaWMgc3VyZmFjZS5cbiAqICAgIFxuICovXG5jbGFzcyBXbFNoZWxsUHJveHkgZXh0ZW5kcyBQcm94eSB7XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRDcmVhdGUgYSBzaGVsbCBzdXJmYWNlIGZvciBhbiBleGlzdGluZyBzdXJmYWNlLiBUaGlzIGdpdmVzXG5cdCAqXHR0aGUgd2xfc3VyZmFjZSB0aGUgcm9sZSBvZiBhIHNoZWxsIHN1cmZhY2UuIElmIHRoZSB3bF9zdXJmYWNlXG5cdCAqXHRhbHJlYWR5IGhhcyBhbm90aGVyIHJvbGUsIGl0IHJhaXNlcyBhIHByb3RvY29sIGVycm9yLlxuXHQgKlxuXHQgKlx0T25seSBvbmUgc2hlbGwgc3VyZmFjZSBjYW4gYmUgYXNzb2NpYXRlZCB3aXRoIGEgZ2l2ZW4gc3VyZmFjZS5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHsqfSBzdXJmYWNlIHN1cmZhY2UgdG8gYmUgZ2l2ZW4gdGhlIHNoZWxsIHN1cmZhY2Ugcm9sZSBcblx0ICogQHJldHVybiB7V2xTaGVsbFN1cmZhY2VQcm94eX0gc2hlbGwgc3VyZmFjZSB0byBjcmVhdGUgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRnZXRTaGVsbFN1cmZhY2UgKHN1cmZhY2UpIHtcblx0XHRyZXR1cm4gdGhpcy5kaXNwbGF5Lm1hcnNoYWxsQ29uc3RydWN0b3IodGhpcy5pZCwgMCwgV2xTaGVsbFN1cmZhY2VQcm94eSwgW25ld09iamVjdCgpLCBvYmplY3Qoc3VyZmFjZSldKVxuXHR9XG5cbi8qKlxuXHQgKkBwYXJhbSB7RGlzcGxheX1kaXNwbGF5XG5cdCAqQHBhcmFtIHtudW1iZXJ9aWRcblx0ICovXG5cdGNvbnN0cnVjdG9yIChkaXNwbGF5LCBpZCkge1xuXHRcdHN1cGVyKGRpc3BsYXksIGlkKVxuXHRcdC8qKlxuXHRcdCAqIEB0eXBlIHtXbFNoZWxsRXZlbnRzfG51bGx9XG5cdFx0ICovXG5cdFx0dGhpcy5saXN0ZW5lciA9IG51bGxcblx0fVxuXG59XG5XbFNoZWxsUHJveHkucHJvdG9jb2xOYW1lID0gJ3dsX3NoZWxsJ1xuXG5XbFNoZWxsUHJveHkuRXJyb3IgPSB7XG4gIC8qKlxuICAgKiBnaXZlbiB3bF9zdXJmYWNlIGhhcyBhbm90aGVyIHJvbGVcbiAgICovXG4gIHJvbGU6IDBcbn1cblxuZXhwb3J0IGRlZmF1bHQgV2xTaGVsbFByb3h5XG4iLCIvKlxuICpcbiAqICAgIENvcHlyaWdodCDCqSAyMDA4LTIwMTEgS3Jpc3RpYW4gSMO4Z3NiZXJnXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMC0yMDExIEludGVsIENvcnBvcmF0aW9uXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMi0yMDEzIENvbGxhYm9yYSwgTHRkLlxuICpcbiAqICAgIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiAgICBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlc1xuICogICAgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogICAgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqICAgIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiAgICBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogICAgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogICAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2UgKGluY2x1ZGluZyB0aGVcbiAqICAgIG5leHQgcGFyYWdyYXBoKSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsXG4gKiAgICBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogICAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqICAgIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuICogICAgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbiAqICAgIE5PTklORlJJTkdFTUVOVC4gIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTXG4gKiAgICBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU5cbiAqICAgIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOXG4gKiAgICBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4gKiAgICBTT0ZUV0FSRS5cbiAqICBcbiAqL1xuXG4vKipcbiAqIEBpbnRlcmZhY2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2xTaGVsbFN1cmZhY2VFdmVudHMge1xuXG5cdC8qKlxuXHQgKlxuXHQgKlx0UGluZyBhIGNsaWVudCB0byBjaGVjayBpZiBpdCBpcyByZWNlaXZpbmcgZXZlbnRzIGFuZCBzZW5kaW5nXG5cdCAqXHRyZXF1ZXN0cy4gQSBjbGllbnQgaXMgZXhwZWN0ZWQgdG8gcmVwbHkgd2l0aCBhIHBvbmcgcmVxdWVzdC5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHtudW1iZXJ9IHNlcmlhbCBzZXJpYWwgbnVtYmVyIG9mIHRoZSBwaW5nIFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0cGluZyhzZXJpYWwpIHt9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRUaGUgY29uZmlndXJlIGV2ZW50IGFza3MgdGhlIGNsaWVudCB0byByZXNpemUgaXRzIHN1cmZhY2UuXG5cdCAqXG5cdCAqXHRUaGUgc2l6ZSBpcyBhIGhpbnQsIGluIHRoZSBzZW5zZSB0aGF0IHRoZSBjbGllbnQgaXMgZnJlZSB0b1xuXHQgKlx0aWdub3JlIGl0IGlmIGl0IGRvZXNuJ3QgcmVzaXplLCBwaWNrIGEgc21hbGxlciBzaXplICh0b1xuXHQgKlx0c2F0aXNmeSBhc3BlY3QgcmF0aW8gb3IgcmVzaXplIGluIHN0ZXBzIG9mIE54TSBwaXhlbHMpLlxuXHQgKlxuXHQgKlx0VGhlIGVkZ2VzIHBhcmFtZXRlciBwcm92aWRlcyBhIGhpbnQgYWJvdXQgaG93IHRoZSBzdXJmYWNlXG5cdCAqXHR3YXMgcmVzaXplZC4gVGhlIGNsaWVudCBtYXkgdXNlIHRoaXMgaW5mb3JtYXRpb24gdG8gZGVjaWRlXG5cdCAqXHRob3cgdG8gYWRqdXN0IGl0cyBjb250ZW50IHRvIHRoZSBuZXcgc2l6ZSAoZS5nLiBhIHNjcm9sbGluZ1xuXHQgKlx0YXJlYSBtaWdodCBhZGp1c3QgaXRzIGNvbnRlbnQgcG9zaXRpb24gdG8gbGVhdmUgdGhlIHZpZXdhYmxlXG5cdCAqXHRjb250ZW50IHVubW92ZWQpLlxuXHQgKlxuXHQgKlx0VGhlIGNsaWVudCBpcyBmcmVlIHRvIGRpc21pc3MgYWxsIGJ1dCB0aGUgbGFzdCBjb25maWd1cmVcblx0ICpcdGV2ZW50IGl0IHJlY2VpdmVkLlxuXHQgKlxuXHQgKlx0VGhlIHdpZHRoIGFuZCBoZWlnaHQgYXJndW1lbnRzIHNwZWNpZnkgdGhlIHNpemUgb2YgdGhlIHdpbmRvd1xuXHQgKlx0aW4gc3VyZmFjZS1sb2NhbCBjb29yZGluYXRlcy5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHtudW1iZXJ9IGVkZ2VzIGhvdyB0aGUgc3VyZmFjZSB3YXMgcmVzaXplZCBcblx0ICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIG5ldyB3aWR0aCBvZiB0aGUgc3VyZmFjZSBcblx0ICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCBuZXcgaGVpZ2h0IG9mIHRoZSBzdXJmYWNlIFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0Y29uZmlndXJlKGVkZ2VzLCB3aWR0aCwgaGVpZ2h0KSB7fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0VGhlIHBvcHVwX2RvbmUgZXZlbnQgaXMgc2VudCBvdXQgd2hlbiBhIHBvcHVwIGdyYWIgaXMgYnJva2VuLFxuXHQgKlx0dGhhdCBpcywgd2hlbiB0aGUgdXNlciBjbGlja3MgYSBzdXJmYWNlIHRoYXQgZG9lc24ndCBiZWxvbmdcblx0ICpcdHRvIHRoZSBjbGllbnQgb3duaW5nIHRoZSBwb3B1cCBzdXJmYWNlLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0cG9wdXBEb25lKCkge31cbn1cblxuIiwiLypcbiAqXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAwOC0yMDExIEtyaXN0aWFuIEjDuGdzYmVyZ1xuICogICAgQ29weXJpZ2h0IMKpIDIwMTAtMjAxMSBJbnRlbCBDb3Jwb3JhdGlvblxuICogICAgQ29weXJpZ2h0IMKpIDIwMTItMjAxMyBDb2xsYWJvcmEsIEx0ZC5cbiAqXG4gKiAgICBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogICAgb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXNcbiAqICAgICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqICAgIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiAgICBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogICAgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqICAgIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqICAgIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIChpbmNsdWRpbmcgdGhlXG4gKiAgICBuZXh0IHBhcmFncmFwaCkgc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbFxuICogICAgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqICAgIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiAgICBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0ZcbiAqICAgIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG4gKiAgICBOT05JTkZSSU5HRU1FTlQuICBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSU1xuICogICAgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOXG4gKiAgICBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTlxuICogICAgQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuICogICAgU09GVFdBUkUuXG4gKiAgXG4gKi9cblxuaW1wb3J0IHsgQ29ubmVjdGlvbiB9IGZyb20gJ3dlc3RmaWVsZC1ydW50aW1lLWNvbW1vbidcbmNvbnN0IHsgdWludCwgdWludE9wdGlvbmFsLCBpbnQsIGludE9wdGlvbmFsLCBmaXhlZCwgXG5cdGZpeGVkT3B0aW9uYWwsIG9iamVjdCwgb2JqZWN0T3B0aW9uYWwsIG5ld09iamVjdCwgc3RyaW5nLCBcblx0c3RyaW5nT3B0aW9uYWwsIGFycmF5LCBhcnJheU9wdGlvbmFsLCBcblx0ZmlsZURlc2NyaXB0b3JPcHRpb25hbCwgZmlsZURlc2NyaXB0b3IsIFxuaCwgdSwgaSwgZiwgbywgbiwgcywgYSB9ID0gQ29ubmVjdGlvblxuaW1wb3J0IFByb3h5IGZyb20gJy4vUHJveHknXG5cbi8qKlxuICpcbiAqICAgICAgQW4gaW50ZXJmYWNlIHRoYXQgbWF5IGJlIGltcGxlbWVudGVkIGJ5IGEgd2xfc3VyZmFjZSwgZm9yXG4gKiAgICAgIGltcGxlbWVudGF0aW9ucyB0aGF0IHByb3ZpZGUgYSBkZXNrdG9wLXN0eWxlIHVzZXIgaW50ZXJmYWNlLlxuICpcbiAqICAgICAgSXQgcHJvdmlkZXMgcmVxdWVzdHMgdG8gdHJlYXQgc3VyZmFjZXMgbGlrZSB0b3BsZXZlbCwgZnVsbHNjcmVlblxuICogICAgICBvciBwb3B1cCB3aW5kb3dzLCBtb3ZlLCByZXNpemUgb3IgbWF4aW1pemUgdGhlbSwgYXNzb2NpYXRlXG4gKiAgICAgIG1ldGFkYXRhIGxpa2UgdGl0bGUgYW5kIGNsYXNzLCBldGMuXG4gKlxuICogICAgICBPbiB0aGUgc2VydmVyIHNpZGUgdGhlIG9iamVjdCBpcyBhdXRvbWF0aWNhbGx5IGRlc3Ryb3llZCB3aGVuXG4gKiAgICAgIHRoZSByZWxhdGVkIHdsX3N1cmZhY2UgaXMgZGVzdHJveWVkLiBPbiB0aGUgY2xpZW50IHNpZGUsXG4gKiAgICAgIHdsX3NoZWxsX3N1cmZhY2VfZGVzdHJveSgpIG11c3QgYmUgY2FsbGVkIGJlZm9yZSBkZXN0cm95aW5nXG4gKiAgICAgIHRoZSB3bF9zdXJmYWNlIG9iamVjdC5cbiAqICAgIFxuICovXG5jbGFzcyBXbFNoZWxsU3VyZmFjZVByb3h5IGV4dGVuZHMgUHJveHkge1xuXG5cdC8qKlxuXHQgKlxuXHQgKlx0QSBjbGllbnQgbXVzdCByZXNwb25kIHRvIGEgcGluZyBldmVudCB3aXRoIGEgcG9uZyByZXF1ZXN0IG9yXG5cdCAqXHR0aGUgY2xpZW50IG1heSBiZSBkZWVtZWQgdW5yZXNwb25zaXZlLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0ge251bWJlcn0gc2VyaWFsIHNlcmlhbCBudW1iZXIgb2YgdGhlIHBpbmcgZXZlbnQgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRwb25nIChzZXJpYWwpIHtcblx0XHR0aGlzLmRpc3BsYXkubWFyc2hhbGwodGhpcy5pZCwgMCwgW3VpbnQoc2VyaWFsKV0pXG5cdH1cblxuXHQvKipcblx0ICpcblx0ICpcdFN0YXJ0IGEgcG9pbnRlci1kcml2ZW4gbW92ZSBvZiB0aGUgc3VyZmFjZS5cblx0ICpcblx0ICpcdFRoaXMgcmVxdWVzdCBtdXN0IGJlIHVzZWQgaW4gcmVzcG9uc2UgdG8gYSBidXR0b24gcHJlc3MgZXZlbnQuXG5cdCAqXHRUaGUgc2VydmVyIG1heSBpZ25vcmUgbW92ZSByZXF1ZXN0cyBkZXBlbmRpbmcgb24gdGhlIHN0YXRlIG9mXG5cdCAqXHR0aGUgc3VyZmFjZSAoZS5nLiBmdWxsc2NyZWVuIG9yIG1heGltaXplZCkuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7Kn0gc2VhdCBzZWF0IHdob3NlIHBvaW50ZXIgaXMgdXNlZCBcblx0ICogQHBhcmFtIHtudW1iZXJ9IHNlcmlhbCBzZXJpYWwgbnVtYmVyIG9mIHRoZSBpbXBsaWNpdCBncmFiIG9uIHRoZSBwb2ludGVyIFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0bW92ZSAoc2VhdCwgc2VyaWFsKSB7XG5cdFx0dGhpcy5kaXNwbGF5Lm1hcnNoYWxsKHRoaXMuaWQsIDEsIFtvYmplY3Qoc2VhdCksIHVpbnQoc2VyaWFsKV0pXG5cdH1cblxuXHQvKipcblx0ICpcblx0ICpcdFN0YXJ0IGEgcG9pbnRlci1kcml2ZW4gcmVzaXppbmcgb2YgdGhlIHN1cmZhY2UuXG5cdCAqXG5cdCAqXHRUaGlzIHJlcXVlc3QgbXVzdCBiZSB1c2VkIGluIHJlc3BvbnNlIHRvIGEgYnV0dG9uIHByZXNzIGV2ZW50LlxuXHQgKlx0VGhlIHNlcnZlciBtYXkgaWdub3JlIHJlc2l6ZSByZXF1ZXN0cyBkZXBlbmRpbmcgb24gdGhlIHN0YXRlIG9mXG5cdCAqXHR0aGUgc3VyZmFjZSAoZS5nLiBmdWxsc2NyZWVuIG9yIG1heGltaXplZCkuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7Kn0gc2VhdCBzZWF0IHdob3NlIHBvaW50ZXIgaXMgdXNlZCBcblx0ICogQHBhcmFtIHtudW1iZXJ9IHNlcmlhbCBzZXJpYWwgbnVtYmVyIG9mIHRoZSBpbXBsaWNpdCBncmFiIG9uIHRoZSBwb2ludGVyIFxuXHQgKiBAcGFyYW0ge251bWJlcn0gZWRnZXMgd2hpY2ggZWRnZSBvciBjb3JuZXIgaXMgYmVpbmcgZHJhZ2dlZCBcblx0ICpcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdHJlc2l6ZSAoc2VhdCwgc2VyaWFsLCBlZGdlcykge1xuXHRcdHRoaXMuZGlzcGxheS5tYXJzaGFsbCh0aGlzLmlkLCAyLCBbb2JqZWN0KHNlYXQpLCB1aW50KHNlcmlhbCksIHVpbnQoZWRnZXMpXSlcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0TWFwIHRoZSBzdXJmYWNlIGFzIGEgdG9wbGV2ZWwgc3VyZmFjZS5cblx0ICpcblx0ICpcdEEgdG9wbGV2ZWwgc3VyZmFjZSBpcyBub3QgZnVsbHNjcmVlbiwgbWF4aW1pemVkIG9yIHRyYW5zaWVudC5cblx0ICogICAgICBcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdHNldFRvcGxldmVsICgpIHtcblx0XHR0aGlzLmRpc3BsYXkubWFyc2hhbGwodGhpcy5pZCwgMywgW10pXG5cdH1cblxuXHQvKipcblx0ICpcblx0ICpcdE1hcCB0aGUgc3VyZmFjZSByZWxhdGl2ZSB0byBhbiBleGlzdGluZyBzdXJmYWNlLlxuXHQgKlxuXHQgKlx0VGhlIHggYW5kIHkgYXJndW1lbnRzIHNwZWNpZnkgdGhlIGxvY2F0aW9uIG9mIHRoZSB1cHBlciBsZWZ0XG5cdCAqXHRjb3JuZXIgb2YgdGhlIHN1cmZhY2UgcmVsYXRpdmUgdG8gdGhlIHVwcGVyIGxlZnQgY29ybmVyIG9mIHRoZVxuXHQgKlx0cGFyZW50IHN1cmZhY2UsIGluIHN1cmZhY2UtbG9jYWwgY29vcmRpbmF0ZXMuXG5cdCAqXG5cdCAqXHRUaGUgZmxhZ3MgYXJndW1lbnQgY29udHJvbHMgZGV0YWlscyBvZiB0aGUgdHJhbnNpZW50IGJlaGF2aW91ci5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHsqfSBwYXJlbnQgcGFyZW50IHN1cmZhY2UgXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB4IHN1cmZhY2UtbG9jYWwgeCBjb29yZGluYXRlIFxuXHQgKiBAcGFyYW0ge251bWJlcn0geSBzdXJmYWNlLWxvY2FsIHkgY29vcmRpbmF0ZSBcblx0ICogQHBhcmFtIHtudW1iZXJ9IGZsYWdzIHRyYW5zaWVudCBzdXJmYWNlIGJlaGF2aW9yIFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0c2V0VHJhbnNpZW50IChwYXJlbnQsIHgsIHksIGZsYWdzKSB7XG5cdFx0dGhpcy5kaXNwbGF5Lm1hcnNoYWxsKHRoaXMuaWQsIDQsIFtvYmplY3QocGFyZW50KSwgaW50KHgpLCBpbnQoeSksIHVpbnQoZmxhZ3MpXSlcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0TWFwIHRoZSBzdXJmYWNlIGFzIGEgZnVsbHNjcmVlbiBzdXJmYWNlLlxuXHQgKlxuXHQgKlx0SWYgYW4gb3V0cHV0IHBhcmFtZXRlciBpcyBnaXZlbiB0aGVuIHRoZSBzdXJmYWNlIHdpbGwgYmUgbWFkZVxuXHQgKlx0ZnVsbHNjcmVlbiBvbiB0aGF0IG91dHB1dC4gSWYgdGhlIGNsaWVudCBkb2VzIG5vdCBzcGVjaWZ5IHRoZVxuXHQgKlx0b3V0cHV0IHRoZW4gdGhlIGNvbXBvc2l0b3Igd2lsbCBhcHBseSBpdHMgcG9saWN5IC0gdXN1YWxseVxuXHQgKlx0Y2hvb3NpbmcgdGhlIG91dHB1dCBvbiB3aGljaCB0aGUgc3VyZmFjZSBoYXMgdGhlIGJpZ2dlc3Qgc3VyZmFjZVxuXHQgKlx0YXJlYS5cblx0ICpcblx0ICpcdFRoZSBjbGllbnQgbWF5IHNwZWNpZnkgYSBtZXRob2QgdG8gcmVzb2x2ZSBhIHNpemUgY29uZmxpY3Rcblx0ICpcdGJldHdlZW4gdGhlIG91dHB1dCBzaXplIGFuZCB0aGUgc3VyZmFjZSBzaXplIC0gdGhpcyBpcyBwcm92aWRlZFxuXHQgKlx0dGhyb3VnaCB0aGUgbWV0aG9kIHBhcmFtZXRlci5cblx0ICpcblx0ICpcdFRoZSBmcmFtZXJhdGUgcGFyYW1ldGVyIGlzIHVzZWQgb25seSB3aGVuIHRoZSBtZXRob2QgaXMgc2V0XG5cdCAqXHR0byBcImRyaXZlclwiLCB0byBpbmRpY2F0ZSB0aGUgcHJlZmVycmVkIGZyYW1lcmF0ZS4gQSB2YWx1ZSBvZiAwXG5cdCAqXHRpbmRpY2F0ZXMgdGhhdCB0aGUgY2xpZW50IGRvZXMgbm90IGNhcmUgYWJvdXQgZnJhbWVyYXRlLiAgVGhlXG5cdCAqXHRmcmFtZXJhdGUgaXMgc3BlY2lmaWVkIGluIG1IeiwgdGhhdCBpcyBmcmFtZXJhdGUgb2YgNjAwMDAgaXMgNjBIei5cblx0ICpcblx0ICpcdEEgbWV0aG9kIG9mIFwic2NhbGVcIiBvciBcImRyaXZlclwiIGltcGxpZXMgYSBzY2FsaW5nIG9wZXJhdGlvbiBvZlxuXHQgKlx0dGhlIHN1cmZhY2UsIGVpdGhlciB2aWEgYSBkaXJlY3Qgc2NhbGluZyBvcGVyYXRpb24gb3IgYSBjaGFuZ2Ugb2Zcblx0ICpcdHRoZSBvdXRwdXQgbW9kZS4gVGhpcyB3aWxsIG92ZXJyaWRlIGFueSBraW5kIG9mIG91dHB1dCBzY2FsaW5nLCBzb1xuXHQgKlx0dGhhdCBtYXBwaW5nIGEgc3VyZmFjZSB3aXRoIGEgYnVmZmVyIHNpemUgZXF1YWwgdG8gdGhlIG1vZGUgY2FuXG5cdCAqXHRmaWxsIHRoZSBzY3JlZW4gaW5kZXBlbmRlbnQgb2YgYnVmZmVyX3NjYWxlLlxuXHQgKlxuXHQgKlx0QSBtZXRob2Qgb2YgXCJmaWxsXCIgbWVhbnMgd2UgZG9uJ3Qgc2NhbGUgdXAgdGhlIGJ1ZmZlciwgaG93ZXZlclxuXHQgKlx0YW55IG91dHB1dCBzY2FsZSBpcyBhcHBsaWVkLiBUaGlzIG1lYW5zIHRoYXQgeW91IG1heSBydW4gaW50b1xuXHQgKlx0YW4gZWRnZSBjYXNlIHdoZXJlIHRoZSBhcHBsaWNhdGlvbiBtYXBzIGEgYnVmZmVyIHdpdGggdGhlIHNhbWVcblx0ICpcdHNpemUgb2YgdGhlIG91dHB1dCBtb2RlIGJ1dCBidWZmZXJfc2NhbGUgMSAodGh1cyBtYWtpbmcgYVxuXHQgKlx0c3VyZmFjZSBsYXJnZXIgdGhhbiB0aGUgb3V0cHV0KS4gSW4gdGhpcyBjYXNlIGl0IGlzIGFsbG93ZWQgdG9cblx0ICpcdGRvd25zY2FsZSB0aGUgcmVzdWx0cyB0byBmaXQgdGhlIHNjcmVlbi5cblx0ICpcblx0ICpcdFRoZSBjb21wb3NpdG9yIG11c3QgcmVwbHkgdG8gdGhpcyByZXF1ZXN0IHdpdGggYSBjb25maWd1cmUgZXZlbnRcblx0ICpcdHdpdGggdGhlIGRpbWVuc2lvbnMgZm9yIHRoZSBvdXRwdXQgb24gd2hpY2ggdGhlIHN1cmZhY2Ugd2lsbFxuXHQgKlx0YmUgbWFkZSBmdWxsc2NyZWVuLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0ge251bWJlcn0gbWV0aG9kIG1ldGhvZCBmb3IgcmVzb2x2aW5nIHNpemUgY29uZmxpY3QgXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBmcmFtZXJhdGUgZnJhbWVyYXRlIGluIG1IeiBcblx0ICogQHBhcmFtIHs/Kn0gb3V0cHV0IG91dHB1dCBvbiB3aGljaCB0aGUgc3VyZmFjZSBpcyB0byBiZSBmdWxsc2NyZWVuIFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0c2V0RnVsbHNjcmVlbiAobWV0aG9kLCBmcmFtZXJhdGUsIG91dHB1dCkge1xuXHRcdHRoaXMuZGlzcGxheS5tYXJzaGFsbCh0aGlzLmlkLCA1LCBbdWludChtZXRob2QpLCB1aW50KGZyYW1lcmF0ZSksIG9iamVjdE9wdGlvbmFsKG91dHB1dCldKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRNYXAgdGhlIHN1cmZhY2UgYXMgYSBwb3B1cC5cblx0ICpcblx0ICpcdEEgcG9wdXAgc3VyZmFjZSBpcyBhIHRyYW5zaWVudCBzdXJmYWNlIHdpdGggYW4gYWRkZWQgcG9pbnRlclxuXHQgKlx0Z3JhYi5cblx0ICpcblx0ICpcdEFuIGV4aXN0aW5nIGltcGxpY2l0IGdyYWIgd2lsbCBiZSBjaGFuZ2VkIHRvIG93bmVyLWV2ZW50cyBtb2RlLFxuXHQgKlx0YW5kIHRoZSBwb3B1cCBncmFiIHdpbGwgY29udGludWUgYWZ0ZXIgdGhlIGltcGxpY2l0IGdyYWIgZW5kc1xuXHQgKlx0KGkuZS4gcmVsZWFzaW5nIHRoZSBtb3VzZSBidXR0b24gZG9lcyBub3QgY2F1c2UgdGhlIHBvcHVwIHRvXG5cdCAqXHRiZSB1bm1hcHBlZCkuXG5cdCAqXG5cdCAqXHRUaGUgcG9wdXAgZ3JhYiBjb250aW51ZXMgdW50aWwgdGhlIHdpbmRvdyBpcyBkZXN0cm95ZWQgb3IgYVxuXHQgKlx0bW91c2UgYnV0dG9uIGlzIHByZXNzZWQgaW4gYW55IG90aGVyIGNsaWVudCdzIHdpbmRvdy4gQSBjbGlja1xuXHQgKlx0aW4gYW55IG9mIHRoZSBjbGllbnQncyBzdXJmYWNlcyBpcyByZXBvcnRlZCBhcyBub3JtYWwsIGhvd2V2ZXIsXG5cdCAqXHRjbGlja3MgaW4gb3RoZXIgY2xpZW50cycgc3VyZmFjZXMgd2lsbCBiZSBkaXNjYXJkZWQgYW5kIHRyaWdnZXJcblx0ICpcdHRoZSBjYWxsYmFjay5cblx0ICpcblx0ICpcdFRoZSB4IGFuZCB5IGFyZ3VtZW50cyBzcGVjaWZ5IHRoZSBsb2NhdGlvbiBvZiB0aGUgdXBwZXIgbGVmdFxuXHQgKlx0Y29ybmVyIG9mIHRoZSBzdXJmYWNlIHJlbGF0aXZlIHRvIHRoZSB1cHBlciBsZWZ0IGNvcm5lciBvZiB0aGVcblx0ICpcdHBhcmVudCBzdXJmYWNlLCBpbiBzdXJmYWNlLWxvY2FsIGNvb3JkaW5hdGVzLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0geyp9IHNlYXQgc2VhdCB3aG9zZSBwb2ludGVyIGlzIHVzZWQgXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBzZXJpYWwgc2VyaWFsIG51bWJlciBvZiB0aGUgaW1wbGljaXQgZ3JhYiBvbiB0aGUgcG9pbnRlciBcblx0ICogQHBhcmFtIHsqfSBwYXJlbnQgcGFyZW50IHN1cmZhY2UgXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB4IHN1cmZhY2UtbG9jYWwgeCBjb29yZGluYXRlIFxuXHQgKiBAcGFyYW0ge251bWJlcn0geSBzdXJmYWNlLWxvY2FsIHkgY29vcmRpbmF0ZSBcblx0ICogQHBhcmFtIHtudW1iZXJ9IGZsYWdzIHRyYW5zaWVudCBzdXJmYWNlIGJlaGF2aW9yIFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0c2V0UG9wdXAgKHNlYXQsIHNlcmlhbCwgcGFyZW50LCB4LCB5LCBmbGFncykge1xuXHRcdHRoaXMuZGlzcGxheS5tYXJzaGFsbCh0aGlzLmlkLCA2LCBbb2JqZWN0KHNlYXQpLCB1aW50KHNlcmlhbCksIG9iamVjdChwYXJlbnQpLCBpbnQoeCksIGludCh5KSwgdWludChmbGFncyldKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRNYXAgdGhlIHN1cmZhY2UgYXMgYSBtYXhpbWl6ZWQgc3VyZmFjZS5cblx0ICpcblx0ICpcdElmIGFuIG91dHB1dCBwYXJhbWV0ZXIgaXMgZ2l2ZW4gdGhlbiB0aGUgc3VyZmFjZSB3aWxsIGJlXG5cdCAqXHRtYXhpbWl6ZWQgb24gdGhhdCBvdXRwdXQuIElmIHRoZSBjbGllbnQgZG9lcyBub3Qgc3BlY2lmeSB0aGVcblx0ICpcdG91dHB1dCB0aGVuIHRoZSBjb21wb3NpdG9yIHdpbGwgYXBwbHkgaXRzIHBvbGljeSAtIHVzdWFsbHlcblx0ICpcdGNob29zaW5nIHRoZSBvdXRwdXQgb24gd2hpY2ggdGhlIHN1cmZhY2UgaGFzIHRoZSBiaWdnZXN0IHN1cmZhY2Vcblx0ICpcdGFyZWEuXG5cdCAqXG5cdCAqXHRUaGUgY29tcG9zaXRvciB3aWxsIHJlcGx5IHdpdGggYSBjb25maWd1cmUgZXZlbnQgdGVsbGluZ1xuXHQgKlx0dGhlIGV4cGVjdGVkIG5ldyBzdXJmYWNlIHNpemUuIFRoZSBvcGVyYXRpb24gaXMgY29tcGxldGVkXG5cdCAqXHRvbiB0aGUgbmV4dCBidWZmZXIgYXR0YWNoIHRvIHRoaXMgc3VyZmFjZS5cblx0ICpcblx0ICpcdEEgbWF4aW1pemVkIHN1cmZhY2UgdHlwaWNhbGx5IGZpbGxzIHRoZSBlbnRpcmUgb3V0cHV0IGl0IGlzXG5cdCAqXHRib3VuZCB0bywgZXhjZXB0IGZvciBkZXNrdG9wIGVsZW1lbnRzIHN1Y2ggYXMgcGFuZWxzLiBUaGlzIGlzXG5cdCAqXHR0aGUgbWFpbiBkaWZmZXJlbmNlIGJldHdlZW4gYSBtYXhpbWl6ZWQgc2hlbGwgc3VyZmFjZSBhbmQgYVxuXHQgKlx0ZnVsbHNjcmVlbiBzaGVsbCBzdXJmYWNlLlxuXHQgKlxuXHQgKlx0VGhlIGRldGFpbHMgZGVwZW5kIG9uIHRoZSBjb21wb3NpdG9yIGltcGxlbWVudGF0aW9uLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0gez8qfSBvdXRwdXQgb3V0cHV0IG9uIHdoaWNoIHRoZSBzdXJmYWNlIGlzIHRvIGJlIG1heGltaXplZCBcblx0ICpcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdHNldE1heGltaXplZCAob3V0cHV0KSB7XG5cdFx0dGhpcy5kaXNwbGF5Lm1hcnNoYWxsKHRoaXMuaWQsIDcsIFtvYmplY3RPcHRpb25hbChvdXRwdXQpXSlcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0U2V0IGEgc2hvcnQgdGl0bGUgZm9yIHRoZSBzdXJmYWNlLlxuXHQgKlxuXHQgKlx0VGhpcyBzdHJpbmcgbWF5IGJlIHVzZWQgdG8gaWRlbnRpZnkgdGhlIHN1cmZhY2UgaW4gYSB0YXNrIGJhcixcblx0ICpcdHdpbmRvdyBsaXN0LCBvciBvdGhlciB1c2VyIGludGVyZmFjZSBlbGVtZW50cyBwcm92aWRlZCBieSB0aGVcblx0ICpcdGNvbXBvc2l0b3IuXG5cdCAqXG5cdCAqXHRUaGUgc3RyaW5nIG11c3QgYmUgZW5jb2RlZCBpbiBVVEYtOC5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHRpdGxlIHN1cmZhY2UgdGl0bGUgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRzZXRUaXRsZSAodGl0bGUpIHtcblx0XHR0aGlzLmRpc3BsYXkubWFyc2hhbGwodGhpcy5pZCwgOCwgW3N0cmluZyh0aXRsZSldKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRTZXQgYSBjbGFzcyBmb3IgdGhlIHN1cmZhY2UuXG5cdCAqXG5cdCAqXHRUaGUgc3VyZmFjZSBjbGFzcyBpZGVudGlmaWVzIHRoZSBnZW5lcmFsIGNsYXNzIG9mIGFwcGxpY2F0aW9uc1xuXHQgKlx0dG8gd2hpY2ggdGhlIHN1cmZhY2UgYmVsb25ncy4gQSBjb21tb24gY29udmVudGlvbiBpcyB0byB1c2UgdGhlXG5cdCAqXHRmaWxlIG5hbWUgKG9yIHRoZSBmdWxsIHBhdGggaWYgaXQgaXMgYSBub24tc3RhbmRhcmQgbG9jYXRpb24pIG9mXG5cdCAqXHR0aGUgYXBwbGljYXRpb24ncyAuZGVza3RvcCBmaWxlIGFzIHRoZSBjbGFzcy5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGNsYXp6IHN1cmZhY2UgY2xhc3MgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRzZXRDbGFzcyAoY2xhenopIHtcblx0XHR0aGlzLmRpc3BsYXkubWFyc2hhbGwodGhpcy5pZCwgOSwgW3N0cmluZyhjbGF6eildKVxuXHR9XG5cbi8qKlxuXHQgKkBwYXJhbSB7RGlzcGxheX1kaXNwbGF5XG5cdCAqQHBhcmFtIHtudW1iZXJ9aWRcblx0ICovXG5cdGNvbnN0cnVjdG9yIChkaXNwbGF5LCBpZCkge1xuXHRcdHN1cGVyKGRpc3BsYXksIGlkKVxuXHRcdC8qKlxuXHRcdCAqIEB0eXBlIHtXbFNoZWxsU3VyZmFjZUV2ZW50c3xudWxsfVxuXHRcdCAqL1xuXHRcdHRoaXMubGlzdGVuZXIgPSBudWxsXG5cdH1cblxuXHRhc3luYyBbMF0gKG1lc3NhZ2UpIHtcblx0XHRhd2FpdCB0aGlzLmxpc3RlbmVyLnBpbmcodShtZXNzYWdlKSlcblx0fVxuXG5cdGFzeW5jIFsxXSAobWVzc2FnZSkge1xuXHRcdGF3YWl0IHRoaXMubGlzdGVuZXIuY29uZmlndXJlKHUobWVzc2FnZSksIGkobWVzc2FnZSksIGkobWVzc2FnZSkpXG5cdH1cblxuXHRhc3luYyBbMl0gKG1lc3NhZ2UpIHtcblx0XHRhd2FpdCB0aGlzLmxpc3RlbmVyLnBvcHVwRG9uZSgpXG5cdH1cblxufVxuV2xTaGVsbFN1cmZhY2VQcm94eS5wcm90b2NvbE5hbWUgPSAnd2xfc2hlbGxfc3VyZmFjZSdcblxuV2xTaGVsbFN1cmZhY2VQcm94eS5SZXNpemUgPSB7XG4gIC8qKlxuICAgKiBubyBlZGdlXG4gICAqL1xuICBub25lOiAwLFxuICAvKipcbiAgICogdG9wIGVkZ2VcbiAgICovXG4gIHRvcDogMSxcbiAgLyoqXG4gICAqIGJvdHRvbSBlZGdlXG4gICAqL1xuICBib3R0b206IDIsXG4gIC8qKlxuICAgKiBsZWZ0IGVkZ2VcbiAgICovXG4gIGxlZnQ6IDQsXG4gIC8qKlxuICAgKiB0b3AgYW5kIGxlZnQgZWRnZXNcbiAgICovXG4gIHRvcExlZnQ6IDUsXG4gIC8qKlxuICAgKiBib3R0b20gYW5kIGxlZnQgZWRnZXNcbiAgICovXG4gIGJvdHRvbUxlZnQ6IDYsXG4gIC8qKlxuICAgKiByaWdodCBlZGdlXG4gICAqL1xuICByaWdodDogOCxcbiAgLyoqXG4gICAqIHRvcCBhbmQgcmlnaHQgZWRnZXNcbiAgICovXG4gIHRvcFJpZ2h0OiA5LFxuICAvKipcbiAgICogYm90dG9tIGFuZCByaWdodCBlZGdlc1xuICAgKi9cbiAgYm90dG9tUmlnaHQ6IDEwXG59XG5cbldsU2hlbGxTdXJmYWNlUHJveHkuVHJhbnNpZW50ID0ge1xuICAvKipcbiAgICogZG8gbm90IHNldCBrZXlib2FyZCBmb2N1c1xuICAgKi9cbiAgaW5hY3RpdmU6IDB4MVxufVxuXG5XbFNoZWxsU3VyZmFjZVByb3h5LkZ1bGxzY3JlZW5NZXRob2QgPSB7XG4gIC8qKlxuICAgKiBubyBwcmVmZXJlbmNlLCBhcHBseSBkZWZhdWx0IHBvbGljeVxuICAgKi9cbiAgZGVmYXVsdDogMCxcbiAgLyoqXG4gICAqIHNjYWxlLCBwcmVzZXJ2ZSB0aGUgc3VyZmFjZSdzIGFzcGVjdCByYXRpbyBhbmQgY2VudGVyIG9uIG91dHB1dFxuICAgKi9cbiAgc2NhbGU6IDEsXG4gIC8qKlxuICAgKiBzd2l0Y2ggb3V0cHV0IG1vZGUgdG8gdGhlIHNtYWxsZXN0IG1vZGUgdGhhdCBjYW4gZml0IHRoZSBzdXJmYWNlLCBhZGQgYmxhY2sgYm9yZGVycyB0byBjb21wZW5zYXRlIHNpemUgbWlzbWF0Y2hcbiAgICovXG4gIGRyaXZlcjogMixcbiAgLyoqXG4gICAqIG5vIHVwc2NhbGluZywgY2VudGVyIG9uIG91dHB1dCBhbmQgYWRkIGJsYWNrIGJvcmRlcnMgdG8gY29tcGVuc2F0ZSBzaXplIG1pc21hdGNoXG4gICAqL1xuICBmaWxsOiAzXG59XG5cbmV4cG9ydCBkZWZhdWx0IFdsU2hlbGxTdXJmYWNlUHJveHlcbiIsIi8qXG4gKlxuICogICAgQ29weXJpZ2h0IMKpIDIwMDgtMjAxMSBLcmlzdGlhbiBIw7hnc2JlcmdcbiAqICAgIENvcHlyaWdodCDCqSAyMDEwLTIwMTEgSW50ZWwgQ29ycG9yYXRpb25cbiAqICAgIENvcHlyaWdodCDCqSAyMDEyLTIwMTMgQ29sbGFib3JhLCBMdGQuXG4gKlxuICogICAgUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqICAgIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzXG4gKiAgICAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiAgICBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogICAgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqICAgIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiAgICBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiAgICBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSAoaW5jbHVkaW5nIHRoZVxuICogICAgbmV4dCBwYXJhZ3JhcGgpIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWxcbiAqICAgIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiAgICBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogICAgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4gKiAgICBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuICogICAgTk9OSU5GUklOR0VNRU5ULiAgSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlNcbiAqICAgIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTlxuICogICAgQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU5cbiAqICAgIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbiAqICAgIFNPRlRXQVJFLlxuICogIFxuICovXG5cbmltcG9ydCB7IENvbm5lY3Rpb24gfSBmcm9tICd3ZXN0ZmllbGQtcnVudGltZS1jb21tb24nXG5jb25zdCB7IHVpbnQsIHVpbnRPcHRpb25hbCwgaW50LCBpbnRPcHRpb25hbCwgZml4ZWQsIFxuXHRmaXhlZE9wdGlvbmFsLCBvYmplY3QsIG9iamVjdE9wdGlvbmFsLCBuZXdPYmplY3QsIHN0cmluZywgXG5cdHN0cmluZ09wdGlvbmFsLCBhcnJheSwgYXJyYXlPcHRpb25hbCwgXG5cdGZpbGVEZXNjcmlwdG9yT3B0aW9uYWwsIGZpbGVEZXNjcmlwdG9yLCBcbmgsIHUsIGksIGYsIG8sIG4sIHMsIGEgfSA9IENvbm5lY3Rpb25cbmltcG9ydCBQcm94eSBmcm9tICcuL1Byb3h5J1xuaW1wb3J0IFdsU3Vic3VyZmFjZVByb3h5IGZyb20gJy4vV2xTdWJzdXJmYWNlUHJveHknXG5cbi8qKlxuICpcbiAqICAgICAgVGhlIGdsb2JhbCBpbnRlcmZhY2UgZXhwb3Npbmcgc3ViLXN1cmZhY2UgY29tcG9zaXRpbmcgY2FwYWJpbGl0aWVzLlxuICogICAgICBBIHdsX3N1cmZhY2UsIHRoYXQgaGFzIHN1Yi1zdXJmYWNlcyBhc3NvY2lhdGVkLCBpcyBjYWxsZWQgdGhlXG4gKiAgICAgIHBhcmVudCBzdXJmYWNlLiBTdWItc3VyZmFjZXMgY2FuIGJlIGFyYml0cmFyaWx5IG5lc3RlZCBhbmQgY3JlYXRlXG4gKiAgICAgIGEgdHJlZSBvZiBzdWItc3VyZmFjZXMuXG4gKlxuICogICAgICBUaGUgcm9vdCBzdXJmYWNlIGluIGEgdHJlZSBvZiBzdWItc3VyZmFjZXMgaXMgdGhlIG1haW5cbiAqICAgICAgc3VyZmFjZS4gVGhlIG1haW4gc3VyZmFjZSBjYW5ub3QgYmUgYSBzdWItc3VyZmFjZSwgYmVjYXVzZVxuICogICAgICBzdWItc3VyZmFjZXMgbXVzdCBhbHdheXMgaGF2ZSBhIHBhcmVudC5cbiAqXG4gKiAgICAgIEEgbWFpbiBzdXJmYWNlIHdpdGggaXRzIHN1Yi1zdXJmYWNlcyBmb3JtcyBhIChjb21wb3VuZCkgd2luZG93LlxuICogICAgICBGb3Igd2luZG93IG1hbmFnZW1lbnQgcHVycG9zZXMsIHRoaXMgc2V0IG9mIHdsX3N1cmZhY2Ugb2JqZWN0cyBpc1xuICogICAgICB0byBiZSBjb25zaWRlcmVkIGFzIGEgc2luZ2xlIHdpbmRvdywgYW5kIGl0IHNob3VsZCBhbHNvIGJlaGF2ZSBhc1xuICogICAgICBzdWNoLlxuICpcbiAqICAgICAgVGhlIGFpbSBvZiBzdWItc3VyZmFjZXMgaXMgdG8gb2ZmbG9hZCBzb21lIG9mIHRoZSBjb21wb3NpdGluZyB3b3JrXG4gKiAgICAgIHdpdGhpbiBhIHdpbmRvdyBmcm9tIGNsaWVudHMgdG8gdGhlIGNvbXBvc2l0b3IuIEEgcHJpbWUgZXhhbXBsZSBpc1xuICogICAgICBhIHZpZGVvIHBsYXllciB3aXRoIGRlY29yYXRpb25zIGFuZCB2aWRlbyBpbiBzZXBhcmF0ZSB3bF9zdXJmYWNlXG4gKiAgICAgIG9iamVjdHMuIFRoaXMgc2hvdWxkIGFsbG93IHRoZSBjb21wb3NpdG9yIHRvIHBhc3MgWVVWIHZpZGVvIGJ1ZmZlclxuICogICAgICBwcm9jZXNzaW5nIHRvIGRlZGljYXRlZCBvdmVybGF5IGhhcmR3YXJlIHdoZW4gcG9zc2libGUuXG4gKiAgICBcbiAqL1xuY2xhc3MgV2xTdWJjb21wb3NpdG9yUHJveHkgZXh0ZW5kcyBQcm94eSB7XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRJbmZvcm1zIHRoZSBzZXJ2ZXIgdGhhdCB0aGUgY2xpZW50IHdpbGwgbm90IGJlIHVzaW5nIHRoaXNcblx0ICpcdHByb3RvY29sIG9iamVjdCBhbnltb3JlLiBUaGlzIGRvZXMgbm90IGFmZmVjdCBhbnkgb3RoZXJcblx0ICpcdG9iamVjdHMsIHdsX3N1YnN1cmZhY2Ugb2JqZWN0cyBpbmNsdWRlZC5cblx0ICogICAgICBcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdGRlc3Ryb3kgKCkge1xuXHRcdHRoaXMuZGlzcGxheS5tYXJzaGFsbCh0aGlzLmlkLCAwLCBbXSlcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0Q3JlYXRlIGEgc3ViLXN1cmZhY2UgaW50ZXJmYWNlIGZvciB0aGUgZ2l2ZW4gc3VyZmFjZSwgYW5kXG5cdCAqXHRhc3NvY2lhdGUgaXQgd2l0aCB0aGUgZ2l2ZW4gcGFyZW50IHN1cmZhY2UuIFRoaXMgdHVybnMgYVxuXHQgKlx0cGxhaW4gd2xfc3VyZmFjZSBpbnRvIGEgc3ViLXN1cmZhY2UuXG5cdCAqXG5cdCAqXHRUaGUgdG8tYmUgc3ViLXN1cmZhY2UgbXVzdCBub3QgYWxyZWFkeSBoYXZlIGFub3RoZXIgcm9sZSwgYW5kIGl0XG5cdCAqXHRtdXN0IG5vdCBoYXZlIGFuIGV4aXN0aW5nIHdsX3N1YnN1cmZhY2Ugb2JqZWN0LiBPdGhlcndpc2UgYSBwcm90b2NvbFxuXHQgKlx0ZXJyb3IgaXMgcmFpc2VkLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0geyp9IHN1cmZhY2UgdGhlIHN1cmZhY2UgdG8gYmUgdHVybmVkIGludG8gYSBzdWItc3VyZmFjZSBcblx0ICogQHBhcmFtIHsqfSBwYXJlbnQgdGhlIHBhcmVudCBzdXJmYWNlIFxuXHQgKiBAcmV0dXJuIHtXbFN1YnN1cmZhY2VQcm94eX0gdGhlIG5ldyBzdWItc3VyZmFjZSBvYmplY3QgSUQgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRnZXRTdWJzdXJmYWNlIChzdXJmYWNlLCBwYXJlbnQpIHtcblx0XHRyZXR1cm4gdGhpcy5kaXNwbGF5Lm1hcnNoYWxsQ29uc3RydWN0b3IodGhpcy5pZCwgMSwgV2xTdWJzdXJmYWNlUHJveHksIFtuZXdPYmplY3QoKSwgb2JqZWN0KHN1cmZhY2UpLCBvYmplY3QocGFyZW50KV0pXG5cdH1cblxuLyoqXG5cdCAqQHBhcmFtIHtEaXNwbGF5fWRpc3BsYXlcblx0ICpAcGFyYW0ge251bWJlcn1pZFxuXHQgKi9cblx0Y29uc3RydWN0b3IgKGRpc3BsYXksIGlkKSB7XG5cdFx0c3VwZXIoZGlzcGxheSwgaWQpXG5cdFx0LyoqXG5cdFx0ICogQHR5cGUge1dsU3ViY29tcG9zaXRvckV2ZW50c3xudWxsfVxuXHRcdCAqL1xuXHRcdHRoaXMubGlzdGVuZXIgPSBudWxsXG5cdH1cblxufVxuV2xTdWJjb21wb3NpdG9yUHJveHkucHJvdG9jb2xOYW1lID0gJ3dsX3N1YmNvbXBvc2l0b3InXG5cbldsU3ViY29tcG9zaXRvclByb3h5LkVycm9yID0ge1xuICAvKipcbiAgICogdGhlIHRvLWJlIHN1Yi1zdXJmYWNlIGlzIGludmFsaWRcbiAgICovXG4gIGJhZFN1cmZhY2U6IDBcbn1cblxuZXhwb3J0IGRlZmF1bHQgV2xTdWJjb21wb3NpdG9yUHJveHlcbiIsIi8qXG4gKlxuICogICAgQ29weXJpZ2h0IMKpIDIwMDgtMjAxMSBLcmlzdGlhbiBIw7hnc2JlcmdcbiAqICAgIENvcHlyaWdodCDCqSAyMDEwLTIwMTEgSW50ZWwgQ29ycG9yYXRpb25cbiAqICAgIENvcHlyaWdodCDCqSAyMDEyLTIwMTMgQ29sbGFib3JhLCBMdGQuXG4gKlxuICogICAgUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqICAgIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzXG4gKiAgICAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiAgICBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogICAgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqICAgIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiAgICBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiAgICBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSAoaW5jbHVkaW5nIHRoZVxuICogICAgbmV4dCBwYXJhZ3JhcGgpIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWxcbiAqICAgIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiAgICBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogICAgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4gKiAgICBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuICogICAgTk9OSU5GUklOR0VNRU5ULiAgSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlNcbiAqICAgIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTlxuICogICAgQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU5cbiAqICAgIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbiAqICAgIFNPRlRXQVJFLlxuICogIFxuICovXG5cbmltcG9ydCB7IENvbm5lY3Rpb24gfSBmcm9tICd3ZXN0ZmllbGQtcnVudGltZS1jb21tb24nXG5jb25zdCB7IHVpbnQsIHVpbnRPcHRpb25hbCwgaW50LCBpbnRPcHRpb25hbCwgZml4ZWQsIFxuXHRmaXhlZE9wdGlvbmFsLCBvYmplY3QsIG9iamVjdE9wdGlvbmFsLCBuZXdPYmplY3QsIHN0cmluZywgXG5cdHN0cmluZ09wdGlvbmFsLCBhcnJheSwgYXJyYXlPcHRpb25hbCwgXG5cdGZpbGVEZXNjcmlwdG9yT3B0aW9uYWwsIGZpbGVEZXNjcmlwdG9yLCBcbmgsIHUsIGksIGYsIG8sIG4sIHMsIGEgfSA9IENvbm5lY3Rpb25cbmltcG9ydCBQcm94eSBmcm9tICcuL1Byb3h5J1xuXG4vKipcbiAqXG4gKiAgICAgIEFuIGFkZGl0aW9uYWwgaW50ZXJmYWNlIHRvIGEgd2xfc3VyZmFjZSBvYmplY3QsIHdoaWNoIGhhcyBiZWVuXG4gKiAgICAgIG1hZGUgYSBzdWItc3VyZmFjZS4gQSBzdWItc3VyZmFjZSBoYXMgb25lIHBhcmVudCBzdXJmYWNlLiBBXG4gKiAgICAgIHN1Yi1zdXJmYWNlJ3Mgc2l6ZSBhbmQgcG9zaXRpb24gYXJlIG5vdCBsaW1pdGVkIHRvIHRoYXQgb2YgdGhlIHBhcmVudC5cbiAqICAgICAgUGFydGljdWxhcmx5LCBhIHN1Yi1zdXJmYWNlIGlzIG5vdCBhdXRvbWF0aWNhbGx5IGNsaXBwZWQgdG8gaXRzXG4gKiAgICAgIHBhcmVudCdzIGFyZWEuXG4gKlxuICogICAgICBBIHN1Yi1zdXJmYWNlIGJlY29tZXMgbWFwcGVkLCB3aGVuIGEgbm9uLU5VTEwgd2xfYnVmZmVyIGlzIGFwcGxpZWRcbiAqICAgICAgYW5kIHRoZSBwYXJlbnQgc3VyZmFjZSBpcyBtYXBwZWQuIFRoZSBvcmRlciBvZiB3aGljaCBvbmUgaGFwcGVuc1xuICogICAgICBmaXJzdCBpcyBpcnJlbGV2YW50LiBBIHN1Yi1zdXJmYWNlIGlzIGhpZGRlbiBpZiB0aGUgcGFyZW50IGJlY29tZXNcbiAqICAgICAgaGlkZGVuLCBvciBpZiBhIE5VTEwgd2xfYnVmZmVyIGlzIGFwcGxpZWQuIFRoZXNlIHJ1bGVzIGFwcGx5XG4gKiAgICAgIHJlY3Vyc2l2ZWx5IHRocm91Z2ggdGhlIHRyZWUgb2Ygc3VyZmFjZXMuXG4gKlxuICogICAgICBUaGUgYmVoYXZpb3VyIG9mIGEgd2xfc3VyZmFjZS5jb21taXQgcmVxdWVzdCBvbiBhIHN1Yi1zdXJmYWNlXG4gKiAgICAgIGRlcGVuZHMgb24gdGhlIHN1Yi1zdXJmYWNlJ3MgbW9kZS4gVGhlIHBvc3NpYmxlIG1vZGVzIGFyZVxuICogICAgICBzeW5jaHJvbml6ZWQgYW5kIGRlc3luY2hyb25pemVkLCBzZWUgbWV0aG9kc1xuICogICAgICB3bF9zdWJzdXJmYWNlLnNldF9zeW5jIGFuZCB3bF9zdWJzdXJmYWNlLnNldF9kZXN5bmMuIFN5bmNocm9uaXplZFxuICogICAgICBtb2RlIGNhY2hlcyB0aGUgd2xfc3VyZmFjZSBzdGF0ZSB0byBiZSBhcHBsaWVkIHdoZW4gdGhlIHBhcmVudCdzXG4gKiAgICAgIHN0YXRlIGdldHMgYXBwbGllZCwgYW5kIGRlc3luY2hyb25pemVkIG1vZGUgYXBwbGllcyB0aGUgcGVuZGluZ1xuICogICAgICB3bF9zdXJmYWNlIHN0YXRlIGRpcmVjdGx5LiBBIHN1Yi1zdXJmYWNlIGlzIGluaXRpYWxseSBpbiB0aGVcbiAqICAgICAgc3luY2hyb25pemVkIG1vZGUuXG4gKlxuICogICAgICBTdWItc3VyZmFjZXMgaGF2ZSBhbHNvIG90aGVyIGtpbmQgb2Ygc3RhdGUsIHdoaWNoIGlzIG1hbmFnZWQgYnlcbiAqICAgICAgd2xfc3Vic3VyZmFjZSByZXF1ZXN0cywgYXMgb3Bwb3NlZCB0byB3bF9zdXJmYWNlIHJlcXVlc3RzLiBUaGlzXG4gKiAgICAgIHN0YXRlIGluY2x1ZGVzIHRoZSBzdWItc3VyZmFjZSBwb3NpdGlvbiByZWxhdGl2ZSB0byB0aGUgcGFyZW50XG4gKiAgICAgIHN1cmZhY2UgKHdsX3N1YnN1cmZhY2Uuc2V0X3Bvc2l0aW9uKSwgYW5kIHRoZSBzdGFja2luZyBvcmRlciBvZlxuICogICAgICB0aGUgcGFyZW50IGFuZCBpdHMgc3ViLXN1cmZhY2VzICh3bF9zdWJzdXJmYWNlLnBsYWNlX2Fib3ZlIGFuZFxuICogICAgICAucGxhY2VfYmVsb3cpLiBUaGlzIHN0YXRlIGlzIGFwcGxpZWQgd2hlbiB0aGUgcGFyZW50IHN1cmZhY2Unc1xuICogICAgICB3bF9zdXJmYWNlIHN0YXRlIGlzIGFwcGxpZWQsIHJlZ2FyZGxlc3Mgb2YgdGhlIHN1Yi1zdXJmYWNlJ3MgbW9kZS5cbiAqICAgICAgQXMgdGhlIGV4Y2VwdGlvbiwgc2V0X3N5bmMgYW5kIHNldF9kZXN5bmMgYXJlIGVmZmVjdGl2ZSBpbW1lZGlhdGVseS5cbiAqXG4gKiAgICAgIFRoZSBtYWluIHN1cmZhY2UgY2FuIGJlIHRob3VnaHQgdG8gYmUgYWx3YXlzIGluIGRlc3luY2hyb25pemVkIG1vZGUsXG4gKiAgICAgIHNpbmNlIGl0IGRvZXMgbm90IGhhdmUgYSBwYXJlbnQgaW4gdGhlIHN1Yi1zdXJmYWNlcyBzZW5zZS5cbiAqXG4gKiAgICAgIEV2ZW4gaWYgYSBzdWItc3VyZmFjZSBpcyBpbiBkZXN5bmNocm9uaXplZCBtb2RlLCBpdCB3aWxsIGJlaGF2ZSBhc1xuICogICAgICBpbiBzeW5jaHJvbml6ZWQgbW9kZSwgaWYgaXRzIHBhcmVudCBzdXJmYWNlIGJlaGF2ZXMgYXMgaW5cbiAqICAgICAgc3luY2hyb25pemVkIG1vZGUuIFRoaXMgcnVsZSBpcyBhcHBsaWVkIHJlY3Vyc2l2ZWx5IHRocm91Z2hvdXQgdGhlXG4gKiAgICAgIHRyZWUgb2Ygc3VyZmFjZXMuIFRoaXMgbWVhbnMsIHRoYXQgb25lIGNhbiBzZXQgYSBzdWItc3VyZmFjZSBpbnRvXG4gKiAgICAgIHN5bmNocm9uaXplZCBtb2RlLCBhbmQgdGhlbiBhc3N1bWUgdGhhdCBhbGwgaXRzIGNoaWxkIGFuZCBncmFuZC1jaGlsZFxuICogICAgICBzdWItc3VyZmFjZXMgYXJlIHN5bmNocm9uaXplZCwgdG9vLCB3aXRob3V0IGV4cGxpY2l0bHkgc2V0dGluZyB0aGVtLlxuICpcbiAqICAgICAgSWYgdGhlIHdsX3N1cmZhY2UgYXNzb2NpYXRlZCB3aXRoIHRoZSB3bF9zdWJzdXJmYWNlIGlzIGRlc3Ryb3llZCwgdGhlXG4gKiAgICAgIHdsX3N1YnN1cmZhY2Ugb2JqZWN0IGJlY29tZXMgaW5lcnQuIE5vdGUsIHRoYXQgZGVzdHJveWluZyBlaXRoZXIgb2JqZWN0XG4gKiAgICAgIHRha2VzIGVmZmVjdCBpbW1lZGlhdGVseS4gSWYgeW91IG5lZWQgdG8gc3luY2hyb25pemUgdGhlIHJlbW92YWxcbiAqICAgICAgb2YgYSBzdWItc3VyZmFjZSB0byB0aGUgcGFyZW50IHN1cmZhY2UgdXBkYXRlLCB1bm1hcCB0aGUgc3ViLXN1cmZhY2VcbiAqICAgICAgZmlyc3QgYnkgYXR0YWNoaW5nIGEgTlVMTCB3bF9idWZmZXIsIHVwZGF0ZSBwYXJlbnQsIGFuZCB0aGVuIGRlc3Ryb3lcbiAqICAgICAgdGhlIHN1Yi1zdXJmYWNlLlxuICpcbiAqICAgICAgSWYgdGhlIHBhcmVudCB3bF9zdXJmYWNlIG9iamVjdCBpcyBkZXN0cm95ZWQsIHRoZSBzdWItc3VyZmFjZSBpc1xuICogICAgICB1bm1hcHBlZC5cbiAqICAgIFxuICovXG5jbGFzcyBXbFN1YnN1cmZhY2VQcm94eSBleHRlbmRzIFByb3h5IHtcblxuXHQvKipcblx0ICpcblx0ICpcdFRoZSBzdWItc3VyZmFjZSBpbnRlcmZhY2UgaXMgcmVtb3ZlZCBmcm9tIHRoZSB3bF9zdXJmYWNlIG9iamVjdFxuXHQgKlx0dGhhdCB3YXMgdHVybmVkIGludG8gYSBzdWItc3VyZmFjZSB3aXRoIGFcblx0ICpcdHdsX3N1YmNvbXBvc2l0b3IuZ2V0X3N1YnN1cmZhY2UgcmVxdWVzdC4gVGhlIHdsX3N1cmZhY2UncyBhc3NvY2lhdGlvblxuXHQgKlx0dG8gdGhlIHBhcmVudCBpcyBkZWxldGVkLCBhbmQgdGhlIHdsX3N1cmZhY2UgbG9zZXMgaXRzIHJvbGUgYXNcblx0ICpcdGEgc3ViLXN1cmZhY2UuIFRoZSB3bF9zdXJmYWNlIGlzIHVubWFwcGVkLlxuXHQgKiAgICAgIFxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0ZGVzdHJveSAoKSB7XG5cdFx0dGhpcy5kaXNwbGF5Lm1hcnNoYWxsKHRoaXMuaWQsIDAsIFtdKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRUaGlzIHNjaGVkdWxlcyBhIHN1Yi1zdXJmYWNlIHBvc2l0aW9uIGNoYW5nZS5cblx0ICpcdFRoZSBzdWItc3VyZmFjZSB3aWxsIGJlIG1vdmVkIHNvIHRoYXQgaXRzIG9yaWdpbiAodG9wIGxlZnRcblx0ICpcdGNvcm5lciBwaXhlbCkgd2lsbCBiZSBhdCB0aGUgbG9jYXRpb24geCwgeSBvZiB0aGUgcGFyZW50IHN1cmZhY2Vcblx0ICpcdGNvb3JkaW5hdGUgc3lzdGVtLiBUaGUgY29vcmRpbmF0ZXMgYXJlIG5vdCByZXN0cmljdGVkIHRvIHRoZSBwYXJlbnRcblx0ICpcdHN1cmZhY2UgYXJlYS4gTmVnYXRpdmUgdmFsdWVzIGFyZSBhbGxvd2VkLlxuXHQgKlxuXHQgKlx0VGhlIHNjaGVkdWxlZCBjb29yZGluYXRlcyB3aWxsIHRha2UgZWZmZWN0IHdoZW5ldmVyIHRoZSBzdGF0ZSBvZiB0aGVcblx0ICpcdHBhcmVudCBzdXJmYWNlIGlzIGFwcGxpZWQuIFdoZW4gdGhpcyBoYXBwZW5zIGRlcGVuZHMgb24gd2hldGhlciB0aGVcblx0ICpcdHBhcmVudCBzdXJmYWNlIGlzIGluIHN5bmNocm9uaXplZCBtb2RlIG9yIG5vdC4gU2VlXG5cdCAqXHR3bF9zdWJzdXJmYWNlLnNldF9zeW5jIGFuZCB3bF9zdWJzdXJmYWNlLnNldF9kZXN5bmMgZm9yIGRldGFpbHMuXG5cdCAqXG5cdCAqXHRJZiBtb3JlIHRoYW4gb25lIHNldF9wb3NpdGlvbiByZXF1ZXN0IGlzIGludm9rZWQgYnkgdGhlIGNsaWVudCBiZWZvcmVcblx0ICpcdHRoZSBjb21taXQgb2YgdGhlIHBhcmVudCBzdXJmYWNlLCB0aGUgcG9zaXRpb24gb2YgYSBuZXcgcmVxdWVzdCBhbHdheXNcblx0ICpcdHJlcGxhY2VzIHRoZSBzY2hlZHVsZWQgcG9zaXRpb24gZnJvbSBhbnkgcHJldmlvdXMgcmVxdWVzdC5cblx0ICpcblx0ICpcdFRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIDAsIDAuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB4IHggY29vcmRpbmF0ZSBpbiB0aGUgcGFyZW50IHN1cmZhY2UgXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB5IHkgY29vcmRpbmF0ZSBpbiB0aGUgcGFyZW50IHN1cmZhY2UgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRzZXRQb3NpdGlvbiAoeCwgeSkge1xuXHRcdHRoaXMuZGlzcGxheS5tYXJzaGFsbCh0aGlzLmlkLCAxLCBbaW50KHgpLCBpbnQoeSldKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRUaGlzIHN1Yi1zdXJmYWNlIGlzIHRha2VuIGZyb20gdGhlIHN0YWNrLCBhbmQgcHV0IGJhY2sganVzdFxuXHQgKlx0YWJvdmUgdGhlIHJlZmVyZW5jZSBzdXJmYWNlLCBjaGFuZ2luZyB0aGUgei1vcmRlciBvZiB0aGUgc3ViLXN1cmZhY2VzLlxuXHQgKlx0VGhlIHJlZmVyZW5jZSBzdXJmYWNlIG11c3QgYmUgb25lIG9mIHRoZSBzaWJsaW5nIHN1cmZhY2VzLCBvciB0aGVcblx0ICpcdHBhcmVudCBzdXJmYWNlLiBVc2luZyBhbnkgb3RoZXIgc3VyZmFjZSwgaW5jbHVkaW5nIHRoaXMgc3ViLXN1cmZhY2UsXG5cdCAqXHR3aWxsIGNhdXNlIGEgcHJvdG9jb2wgZXJyb3IuXG5cdCAqXG5cdCAqXHRUaGUgei1vcmRlciBpcyBkb3VibGUtYnVmZmVyZWQuIFJlcXVlc3RzIGFyZSBoYW5kbGVkIGluIG9yZGVyIGFuZFxuXHQgKlx0YXBwbGllZCBpbW1lZGlhdGVseSB0byBhIHBlbmRpbmcgc3RhdGUuIFRoZSBmaW5hbCBwZW5kaW5nIHN0YXRlIGlzXG5cdCAqXHRjb3BpZWQgdG8gdGhlIGFjdGl2ZSBzdGF0ZSB0aGUgbmV4dCB0aW1lIHRoZSBzdGF0ZSBvZiB0aGUgcGFyZW50XG5cdCAqXHRzdXJmYWNlIGlzIGFwcGxpZWQuIFdoZW4gdGhpcyBoYXBwZW5zIGRlcGVuZHMgb24gd2hldGhlciB0aGUgcGFyZW50XG5cdCAqXHRzdXJmYWNlIGlzIGluIHN5bmNocm9uaXplZCBtb2RlIG9yIG5vdC4gU2VlIHdsX3N1YnN1cmZhY2Uuc2V0X3N5bmMgYW5kXG5cdCAqXHR3bF9zdWJzdXJmYWNlLnNldF9kZXN5bmMgZm9yIGRldGFpbHMuXG5cdCAqXG5cdCAqXHRBIG5ldyBzdWItc3VyZmFjZSBpcyBpbml0aWFsbHkgYWRkZWQgYXMgdGhlIHRvcC1tb3N0IGluIHRoZSBzdGFja1xuXHQgKlx0b2YgaXRzIHNpYmxpbmdzIGFuZCBwYXJlbnQuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7Kn0gc2libGluZyB0aGUgcmVmZXJlbmNlIHN1cmZhY2UgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRwbGFjZUFib3ZlIChzaWJsaW5nKSB7XG5cdFx0dGhpcy5kaXNwbGF5Lm1hcnNoYWxsKHRoaXMuaWQsIDIsIFtvYmplY3Qoc2libGluZyldKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRUaGUgc3ViLXN1cmZhY2UgaXMgcGxhY2VkIGp1c3QgYmVsb3cgdGhlIHJlZmVyZW5jZSBzdXJmYWNlLlxuXHQgKlx0U2VlIHdsX3N1YnN1cmZhY2UucGxhY2VfYWJvdmUuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7Kn0gc2libGluZyB0aGUgcmVmZXJlbmNlIHN1cmZhY2UgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRwbGFjZUJlbG93IChzaWJsaW5nKSB7XG5cdFx0dGhpcy5kaXNwbGF5Lm1hcnNoYWxsKHRoaXMuaWQsIDMsIFtvYmplY3Qoc2libGluZyldKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRDaGFuZ2UgdGhlIGNvbW1pdCBiZWhhdmlvdXIgb2YgdGhlIHN1Yi1zdXJmYWNlIHRvIHN5bmNocm9uaXplZFxuXHQgKlx0bW9kZSwgYWxzbyBkZXNjcmliZWQgYXMgdGhlIHBhcmVudCBkZXBlbmRlbnQgbW9kZS5cblx0ICpcblx0ICpcdEluIHN5bmNocm9uaXplZCBtb2RlLCB3bF9zdXJmYWNlLmNvbW1pdCBvbiBhIHN1Yi1zdXJmYWNlIHdpbGxcblx0ICpcdGFjY3VtdWxhdGUgdGhlIGNvbW1pdHRlZCBzdGF0ZSBpbiBhIGNhY2hlLCBidXQgdGhlIHN0YXRlIHdpbGxcblx0ICpcdG5vdCBiZSBhcHBsaWVkIGFuZCBoZW5jZSB3aWxsIG5vdCBjaGFuZ2UgdGhlIGNvbXBvc2l0b3Igb3V0cHV0LlxuXHQgKlx0VGhlIGNhY2hlZCBzdGF0ZSBpcyBhcHBsaWVkIHRvIHRoZSBzdWItc3VyZmFjZSBpbW1lZGlhdGVseSBhZnRlclxuXHQgKlx0dGhlIHBhcmVudCBzdXJmYWNlJ3Mgc3RhdGUgaXMgYXBwbGllZC4gVGhpcyBlbnN1cmVzIGF0b21pY1xuXHQgKlx0dXBkYXRlcyBvZiB0aGUgcGFyZW50IGFuZCBhbGwgaXRzIHN5bmNocm9uaXplZCBzdWItc3VyZmFjZXMuXG5cdCAqXHRBcHBseWluZyB0aGUgY2FjaGVkIHN0YXRlIHdpbGwgaW52YWxpZGF0ZSB0aGUgY2FjaGUsIHNvIGZ1cnRoZXJcblx0ICpcdHBhcmVudCBzdXJmYWNlIGNvbW1pdHMgZG8gbm90IChyZS0pYXBwbHkgb2xkIHN0YXRlLlxuXHQgKlxuXHQgKlx0U2VlIHdsX3N1YnN1cmZhY2UgZm9yIHRoZSByZWN1cnNpdmUgZWZmZWN0IG9mIHRoaXMgbW9kZS5cblx0ICogICAgICBcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdHNldFN5bmMgKCkge1xuXHRcdHRoaXMuZGlzcGxheS5tYXJzaGFsbCh0aGlzLmlkLCA0LCBbXSlcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0Q2hhbmdlIHRoZSBjb21taXQgYmVoYXZpb3VyIG9mIHRoZSBzdWItc3VyZmFjZSB0byBkZXN5bmNocm9uaXplZFxuXHQgKlx0bW9kZSwgYWxzbyBkZXNjcmliZWQgYXMgaW5kZXBlbmRlbnQgb3IgZnJlZWx5IHJ1bm5pbmcgbW9kZS5cblx0ICpcblx0ICpcdEluIGRlc3luY2hyb25pemVkIG1vZGUsIHdsX3N1cmZhY2UuY29tbWl0IG9uIGEgc3ViLXN1cmZhY2Ugd2lsbFxuXHQgKlx0YXBwbHkgdGhlIHBlbmRpbmcgc3RhdGUgZGlyZWN0bHksIHdpdGhvdXQgY2FjaGluZywgYXMgaGFwcGVuc1xuXHQgKlx0bm9ybWFsbHkgd2l0aCBhIHdsX3N1cmZhY2UuIENhbGxpbmcgd2xfc3VyZmFjZS5jb21taXQgb24gdGhlXG5cdCAqXHRwYXJlbnQgc3VyZmFjZSBoYXMgbm8gZWZmZWN0IG9uIHRoZSBzdWItc3VyZmFjZSdzIHdsX3N1cmZhY2Vcblx0ICpcdHN0YXRlLiBUaGlzIG1vZGUgYWxsb3dzIGEgc3ViLXN1cmZhY2UgdG8gYmUgdXBkYXRlZCBvbiBpdHMgb3duLlxuXHQgKlxuXHQgKlx0SWYgY2FjaGVkIHN0YXRlIGV4aXN0cyB3aGVuIHdsX3N1cmZhY2UuY29tbWl0IGlzIGNhbGxlZCBpblxuXHQgKlx0ZGVzeW5jaHJvbml6ZWQgbW9kZSwgdGhlIHBlbmRpbmcgc3RhdGUgaXMgYWRkZWQgdG8gdGhlIGNhY2hlZFxuXHQgKlx0c3RhdGUsIGFuZCBhcHBsaWVkIGFzIGEgd2hvbGUuIFRoaXMgaW52YWxpZGF0ZXMgdGhlIGNhY2hlLlxuXHQgKlxuXHQgKlx0Tm90ZTogZXZlbiBpZiBhIHN1Yi1zdXJmYWNlIGlzIHNldCB0byBkZXN5bmNocm9uaXplZCwgYSBwYXJlbnRcblx0ICpcdHN1Yi1zdXJmYWNlIG1heSBvdmVycmlkZSBpdCB0byBiZWhhdmUgYXMgc3luY2hyb25pemVkLiBGb3IgZGV0YWlscyxcblx0ICpcdHNlZSB3bF9zdWJzdXJmYWNlLlxuXHQgKlxuXHQgKlx0SWYgYSBzdXJmYWNlJ3MgcGFyZW50IHN1cmZhY2UgYmVoYXZlcyBhcyBkZXN5bmNocm9uaXplZCwgdGhlblxuXHQgKlx0dGhlIGNhY2hlZCBzdGF0ZSBpcyBhcHBsaWVkIG9uIHNldF9kZXN5bmMuXG5cdCAqICAgICAgXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRzZXREZXN5bmMgKCkge1xuXHRcdHRoaXMuZGlzcGxheS5tYXJzaGFsbCh0aGlzLmlkLCA1LCBbXSlcblx0fVxuXG4vKipcblx0ICpAcGFyYW0ge0Rpc3BsYXl9ZGlzcGxheVxuXHQgKkBwYXJhbSB7bnVtYmVyfWlkXG5cdCAqL1xuXHRjb25zdHJ1Y3RvciAoZGlzcGxheSwgaWQpIHtcblx0XHRzdXBlcihkaXNwbGF5LCBpZClcblx0XHQvKipcblx0XHQgKiBAdHlwZSB7V2xTdWJzdXJmYWNlRXZlbnRzfG51bGx9XG5cdFx0ICovXG5cdFx0dGhpcy5saXN0ZW5lciA9IG51bGxcblx0fVxuXG59XG5XbFN1YnN1cmZhY2VQcm94eS5wcm90b2NvbE5hbWUgPSAnd2xfc3Vic3VyZmFjZSdcblxuV2xTdWJzdXJmYWNlUHJveHkuRXJyb3IgPSB7XG4gIC8qKlxuICAgKiB3bF9zdXJmYWNlIGlzIG5vdCBhIHNpYmxpbmcgb3IgdGhlIHBhcmVudFxuICAgKi9cbiAgYmFkU3VyZmFjZTogMFxufVxuXG5leHBvcnQgZGVmYXVsdCBXbFN1YnN1cmZhY2VQcm94eVxuIiwiLypcbiAqXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAwOC0yMDExIEtyaXN0aWFuIEjDuGdzYmVyZ1xuICogICAgQ29weXJpZ2h0IMKpIDIwMTAtMjAxMSBJbnRlbCBDb3Jwb3JhdGlvblxuICogICAgQ29weXJpZ2h0IMKpIDIwMTItMjAxMyBDb2xsYWJvcmEsIEx0ZC5cbiAqXG4gKiAgICBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogICAgb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXNcbiAqICAgICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqICAgIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiAgICBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogICAgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqICAgIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqICAgIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIChpbmNsdWRpbmcgdGhlXG4gKiAgICBuZXh0IHBhcmFncmFwaCkgc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbFxuICogICAgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqICAgIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiAgICBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0ZcbiAqICAgIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG4gKiAgICBOT05JTkZSSU5HRU1FTlQuICBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSU1xuICogICAgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOXG4gKiAgICBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTlxuICogICAgQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuICogICAgU09GVFdBUkUuXG4gKiAgXG4gKi9cblxuLyoqXG4gKiBAaW50ZXJmYWNlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdsU3VyZmFjZUV2ZW50cyB7XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRUaGlzIGlzIGVtaXR0ZWQgd2hlbmV2ZXIgYSBzdXJmYWNlJ3MgY3JlYXRpb24sIG1vdmVtZW50LCBvciByZXNpemluZ1xuXHQgKlx0cmVzdWx0cyBpbiBzb21lIHBhcnQgb2YgaXQgYmVpbmcgd2l0aGluIHRoZSBzY2Fub3V0IHJlZ2lvbiBvZiBhblxuXHQgKlx0b3V0cHV0LlxuXHQgKlxuXHQgKlx0Tm90ZSB0aGF0IGEgc3VyZmFjZSBtYXkgYmUgb3ZlcmxhcHBpbmcgd2l0aCB6ZXJvIG9yIG1vcmUgb3V0cHV0cy5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHsqfSBvdXRwdXQgb3V0cHV0IGVudGVyZWQgYnkgdGhlIHN1cmZhY2UgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRlbnRlcihvdXRwdXQpIHt9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRUaGlzIGlzIGVtaXR0ZWQgd2hlbmV2ZXIgYSBzdXJmYWNlJ3MgY3JlYXRpb24sIG1vdmVtZW50LCBvciByZXNpemluZ1xuXHQgKlx0cmVzdWx0cyBpbiBpdCBubyBsb25nZXIgaGF2aW5nIGFueSBwYXJ0IG9mIGl0IHdpdGhpbiB0aGUgc2Nhbm91dCByZWdpb25cblx0ICpcdG9mIGFuIG91dHB1dC5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHsqfSBvdXRwdXQgb3V0cHV0IGxlZnQgYnkgdGhlIHN1cmZhY2UgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRsZWF2ZShvdXRwdXQpIHt9XG59XG5cbiIsIi8qXG4gKlxuICogICAgQ29weXJpZ2h0IMKpIDIwMDgtMjAxMSBLcmlzdGlhbiBIw7hnc2JlcmdcbiAqICAgIENvcHlyaWdodCDCqSAyMDEwLTIwMTEgSW50ZWwgQ29ycG9yYXRpb25cbiAqICAgIENvcHlyaWdodCDCqSAyMDEyLTIwMTMgQ29sbGFib3JhLCBMdGQuXG4gKlxuICogICAgUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqICAgIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzXG4gKiAgICAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiAgICBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogICAgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqICAgIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiAgICBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiAgICBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSAoaW5jbHVkaW5nIHRoZVxuICogICAgbmV4dCBwYXJhZ3JhcGgpIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWxcbiAqICAgIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiAgICBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogICAgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4gKiAgICBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuICogICAgTk9OSU5GUklOR0VNRU5ULiAgSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlNcbiAqICAgIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTlxuICogICAgQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU5cbiAqICAgIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbiAqICAgIFNPRlRXQVJFLlxuICogIFxuICovXG5cbmltcG9ydCB7IENvbm5lY3Rpb24gfSBmcm9tICd3ZXN0ZmllbGQtcnVudGltZS1jb21tb24nXG5jb25zdCB7IHVpbnQsIHVpbnRPcHRpb25hbCwgaW50LCBpbnRPcHRpb25hbCwgZml4ZWQsIFxuXHRmaXhlZE9wdGlvbmFsLCBvYmplY3QsIG9iamVjdE9wdGlvbmFsLCBuZXdPYmplY3QsIHN0cmluZywgXG5cdHN0cmluZ09wdGlvbmFsLCBhcnJheSwgYXJyYXlPcHRpb25hbCwgXG5cdGZpbGVEZXNjcmlwdG9yT3B0aW9uYWwsIGZpbGVEZXNjcmlwdG9yLCBcbmgsIHUsIGksIGYsIG8sIG4sIHMsIGEgfSA9IENvbm5lY3Rpb25cbmltcG9ydCBQcm94eSBmcm9tICcuL1Byb3h5J1xuaW1wb3J0IFdsQ2FsbGJhY2tQcm94eSBmcm9tICcuL1dsQ2FsbGJhY2tQcm94eSdcblxuLyoqXG4gKlxuICogICAgICBBIHN1cmZhY2UgaXMgYSByZWN0YW5ndWxhciBhcmVhIHRoYXQgaXMgZGlzcGxheWVkIG9uIHRoZSBzY3JlZW4uXG4gKiAgICAgIEl0IGhhcyBhIGxvY2F0aW9uLCBzaXplIGFuZCBwaXhlbCBjb250ZW50cy5cbiAqXG4gKiAgICAgIFRoZSBzaXplIG9mIGEgc3VyZmFjZSAoYW5kIHJlbGF0aXZlIHBvc2l0aW9ucyBvbiBpdCkgaXMgZGVzY3JpYmVkXG4gKiAgICAgIGluIHN1cmZhY2UtbG9jYWwgY29vcmRpbmF0ZXMsIHdoaWNoIG1heSBkaWZmZXIgZnJvbSB0aGUgYnVmZmVyXG4gKiAgICAgIGNvb3JkaW5hdGVzIG9mIHRoZSBwaXhlbCBjb250ZW50LCBpbiBjYXNlIGEgYnVmZmVyX3RyYW5zZm9ybVxuICogICAgICBvciBhIGJ1ZmZlcl9zY2FsZSBpcyB1c2VkLlxuICpcbiAqICAgICAgQSBzdXJmYWNlIHdpdGhvdXQgYSBcInJvbGVcIiBpcyBmYWlybHkgdXNlbGVzczogYSBjb21wb3NpdG9yIGRvZXNcbiAqICAgICAgbm90IGtub3cgd2hlcmUsIHdoZW4gb3IgaG93IHRvIHByZXNlbnQgaXQuIFRoZSByb2xlIGlzIHRoZVxuICogICAgICBwdXJwb3NlIG9mIGEgd2xfc3VyZmFjZS4gRXhhbXBsZXMgb2Ygcm9sZXMgYXJlIGEgY3Vyc29yIGZvciBhXG4gKiAgICAgIHBvaW50ZXIgKGFzIHNldCBieSB3bF9wb2ludGVyLnNldF9jdXJzb3IpLCBhIGRyYWcgaWNvblxuICogICAgICAod2xfZGF0YV9kZXZpY2Uuc3RhcnRfZHJhZyksIGEgc3ViLXN1cmZhY2VcbiAqICAgICAgKHdsX3N1YmNvbXBvc2l0b3IuZ2V0X3N1YnN1cmZhY2UpLCBhbmQgYSB3aW5kb3cgYXMgZGVmaW5lZCBieSBhXG4gKiAgICAgIHNoZWxsIHByb3RvY29sIChlLmcuIHdsX3NoZWxsLmdldF9zaGVsbF9zdXJmYWNlKS5cbiAqXG4gKiAgICAgIEEgc3VyZmFjZSBjYW4gaGF2ZSBvbmx5IG9uZSByb2xlIGF0IGEgdGltZS4gSW5pdGlhbGx5IGFcbiAqICAgICAgd2xfc3VyZmFjZSBkb2VzIG5vdCBoYXZlIGEgcm9sZS4gT25jZSBhIHdsX3N1cmZhY2UgaXMgZ2l2ZW4gYVxuICogICAgICByb2xlLCBpdCBpcyBzZXQgcGVybWFuZW50bHkgZm9yIHRoZSB3aG9sZSBsaWZldGltZSBvZiB0aGVcbiAqICAgICAgd2xfc3VyZmFjZSBvYmplY3QuIEdpdmluZyB0aGUgY3VycmVudCByb2xlIGFnYWluIGlzIGFsbG93ZWQsXG4gKiAgICAgIHVubGVzcyBleHBsaWNpdGx5IGZvcmJpZGRlbiBieSB0aGUgcmVsZXZhbnQgaW50ZXJmYWNlXG4gKiAgICAgIHNwZWNpZmljYXRpb24uXG4gKlxuICogICAgICBTdXJmYWNlIHJvbGVzIGFyZSBnaXZlbiBieSByZXF1ZXN0cyBpbiBvdGhlciBpbnRlcmZhY2VzIHN1Y2ggYXNcbiAqICAgICAgd2xfcG9pbnRlci5zZXRfY3Vyc29yLiBUaGUgcmVxdWVzdCBzaG91bGQgZXhwbGljaXRseSBtZW50aW9uXG4gKiAgICAgIHRoYXQgdGhpcyByZXF1ZXN0IGdpdmVzIGEgcm9sZSB0byBhIHdsX3N1cmZhY2UuIE9mdGVuLCB0aGlzXG4gKiAgICAgIHJlcXVlc3QgYWxzbyBjcmVhdGVzIGEgbmV3IHByb3RvY29sIG9iamVjdCB0aGF0IHJlcHJlc2VudHMgdGhlXG4gKiAgICAgIHJvbGUgYW5kIGFkZHMgYWRkaXRpb25hbCBmdW5jdGlvbmFsaXR5IHRvIHdsX3N1cmZhY2UuIFdoZW4gYVxuICogICAgICBjbGllbnQgd2FudHMgdG8gZGVzdHJveSBhIHdsX3N1cmZhY2UsIHRoZXkgbXVzdCBkZXN0cm95IHRoaXMgJ3JvbGVcbiAqICAgICAgb2JqZWN0JyBiZWZvcmUgdGhlIHdsX3N1cmZhY2UuXG4gKlxuICogICAgICBEZXN0cm95aW5nIHRoZSByb2xlIG9iamVjdCBkb2VzIG5vdCByZW1vdmUgdGhlIHJvbGUgZnJvbSB0aGVcbiAqICAgICAgd2xfc3VyZmFjZSwgYnV0IGl0IG1heSBzdG9wIHRoZSB3bF9zdXJmYWNlIGZyb20gXCJwbGF5aW5nIHRoZSByb2xlXCIuXG4gKiAgICAgIEZvciBpbnN0YW5jZSwgaWYgYSB3bF9zdWJzdXJmYWNlIG9iamVjdCBpcyBkZXN0cm95ZWQsIHRoZSB3bF9zdXJmYWNlXG4gKiAgICAgIGl0IHdhcyBjcmVhdGVkIGZvciB3aWxsIGJlIHVubWFwcGVkIGFuZCBmb3JnZXQgaXRzIHBvc2l0aW9uIGFuZFxuICogICAgICB6LW9yZGVyLiBJdCBpcyBhbGxvd2VkIHRvIGNyZWF0ZSBhIHdsX3N1YnN1cmZhY2UgZm9yIHRoZSBzYW1lXG4gKiAgICAgIHdsX3N1cmZhY2UgYWdhaW4sIGJ1dCBpdCBpcyBub3QgYWxsb3dlZCB0byB1c2UgdGhlIHdsX3N1cmZhY2UgYXNcbiAqICAgICAgYSBjdXJzb3IgKGN1cnNvciBpcyBhIGRpZmZlcmVudCByb2xlIHRoYW4gc3ViLXN1cmZhY2UsIGFuZCByb2xlXG4gKiAgICAgIHN3aXRjaGluZyBpcyBub3QgYWxsb3dlZCkuXG4gKiAgICBcbiAqL1xuY2xhc3MgV2xTdXJmYWNlUHJveHkgZXh0ZW5kcyBQcm94eSB7XG5cblx0LyoqXG5cdCAqXG5cdCAqXHREZWxldGVzIHRoZSBzdXJmYWNlIGFuZCBpbnZhbGlkYXRlcyBpdHMgb2JqZWN0IElELlxuXHQgKiAgICAgIFxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0ZGVzdHJveSAoKSB7XG5cdFx0dGhpcy5kaXNwbGF5Lm1hcnNoYWxsKHRoaXMuaWQsIDAsIFtdKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRTZXQgYSBidWZmZXIgYXMgdGhlIGNvbnRlbnQgb2YgdGhpcyBzdXJmYWNlLlxuXHQgKlxuXHQgKlx0VGhlIG5ldyBzaXplIG9mIHRoZSBzdXJmYWNlIGlzIGNhbGN1bGF0ZWQgYmFzZWQgb24gdGhlIGJ1ZmZlclxuXHQgKlx0c2l6ZSB0cmFuc2Zvcm1lZCBieSB0aGUgaW52ZXJzZSBidWZmZXJfdHJhbnNmb3JtIGFuZCB0aGVcblx0ICpcdGludmVyc2UgYnVmZmVyX3NjYWxlLiBUaGlzIG1lYW5zIHRoYXQgdGhlIHN1cHBsaWVkIGJ1ZmZlclxuXHQgKlx0bXVzdCBiZSBhbiBpbnRlZ2VyIG11bHRpcGxlIG9mIHRoZSBidWZmZXJfc2NhbGUuXG5cdCAqXG5cdCAqXHRUaGUgeCBhbmQgeSBhcmd1bWVudHMgc3BlY2lmeSB0aGUgbG9jYXRpb24gb2YgdGhlIG5ldyBwZW5kaW5nXG5cdCAqXHRidWZmZXIncyB1cHBlciBsZWZ0IGNvcm5lciwgcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnQgYnVmZmVyJ3MgdXBwZXJcblx0ICpcdGxlZnQgY29ybmVyLCBpbiBzdXJmYWNlLWxvY2FsIGNvb3JkaW5hdGVzLiBJbiBvdGhlciB3b3JkcywgdGhlXG5cdCAqXHR4IGFuZCB5LCBjb21iaW5lZCB3aXRoIHRoZSBuZXcgc3VyZmFjZSBzaXplIGRlZmluZSBpbiB3aGljaFxuXHQgKlx0ZGlyZWN0aW9ucyB0aGUgc3VyZmFjZSdzIHNpemUgY2hhbmdlcy5cblx0ICpcblx0ICpcdFN1cmZhY2UgY29udGVudHMgYXJlIGRvdWJsZS1idWZmZXJlZCBzdGF0ZSwgc2VlIHdsX3N1cmZhY2UuY29tbWl0LlxuXHQgKlxuXHQgKlx0VGhlIGluaXRpYWwgc3VyZmFjZSBjb250ZW50cyBhcmUgdm9pZDsgdGhlcmUgaXMgbm8gY29udGVudC5cblx0ICpcdHdsX3N1cmZhY2UuYXR0YWNoIGFzc2lnbnMgdGhlIGdpdmVuIHdsX2J1ZmZlciBhcyB0aGUgcGVuZGluZ1xuXHQgKlx0d2xfYnVmZmVyLiB3bF9zdXJmYWNlLmNvbW1pdCBtYWtlcyB0aGUgcGVuZGluZyB3bF9idWZmZXIgdGhlIG5ld1xuXHQgKlx0c3VyZmFjZSBjb250ZW50cywgYW5kIHRoZSBzaXplIG9mIHRoZSBzdXJmYWNlIGJlY29tZXMgdGhlIHNpemVcblx0ICpcdGNhbGN1bGF0ZWQgZnJvbSB0aGUgd2xfYnVmZmVyLCBhcyBkZXNjcmliZWQgYWJvdmUuIEFmdGVyIGNvbW1pdCxcblx0ICpcdHRoZXJlIGlzIG5vIHBlbmRpbmcgYnVmZmVyIHVudGlsIHRoZSBuZXh0IGF0dGFjaC5cblx0ICpcblx0ICpcdENvbW1pdHRpbmcgYSBwZW5kaW5nIHdsX2J1ZmZlciBhbGxvd3MgdGhlIGNvbXBvc2l0b3IgdG8gcmVhZCB0aGVcblx0ICpcdHBpeGVscyBpbiB0aGUgd2xfYnVmZmVyLiBUaGUgY29tcG9zaXRvciBtYXkgYWNjZXNzIHRoZSBwaXhlbHMgYXRcblx0ICpcdGFueSB0aW1lIGFmdGVyIHRoZSB3bF9zdXJmYWNlLmNvbW1pdCByZXF1ZXN0LiBXaGVuIHRoZSBjb21wb3NpdG9yXG5cdCAqXHR3aWxsIG5vdCBhY2Nlc3MgdGhlIHBpeGVscyBhbnltb3JlLCBpdCB3aWxsIHNlbmQgdGhlXG5cdCAqXHR3bF9idWZmZXIucmVsZWFzZSBldmVudC4gT25seSBhZnRlciByZWNlaXZpbmcgd2xfYnVmZmVyLnJlbGVhc2UsXG5cdCAqXHR0aGUgY2xpZW50IG1heSByZXVzZSB0aGUgd2xfYnVmZmVyLiBBIHdsX2J1ZmZlciB0aGF0IGhhcyBiZWVuXG5cdCAqXHRhdHRhY2hlZCBhbmQgdGhlbiByZXBsYWNlZCBieSBhbm90aGVyIGF0dGFjaCBpbnN0ZWFkIG9mIGNvbW1pdHRlZFxuXHQgKlx0d2lsbCBub3QgcmVjZWl2ZSBhIHJlbGVhc2UgZXZlbnQsIGFuZCBpcyBub3QgdXNlZCBieSB0aGVcblx0ICpcdGNvbXBvc2l0b3IuXG5cdCAqXG5cdCAqXHREZXN0cm95aW5nIHRoZSB3bF9idWZmZXIgYWZ0ZXIgd2xfYnVmZmVyLnJlbGVhc2UgZG9lcyBub3QgY2hhbmdlXG5cdCAqXHR0aGUgc3VyZmFjZSBjb250ZW50cy4gSG93ZXZlciwgaWYgdGhlIGNsaWVudCBkZXN0cm95cyB0aGVcblx0ICpcdHdsX2J1ZmZlciBiZWZvcmUgcmVjZWl2aW5nIHRoZSB3bF9idWZmZXIucmVsZWFzZSBldmVudCwgdGhlIHN1cmZhY2Vcblx0ICpcdGNvbnRlbnRzIGJlY29tZSB1bmRlZmluZWQgaW1tZWRpYXRlbHkuXG5cdCAqXG5cdCAqXHRJZiB3bF9zdXJmYWNlLmF0dGFjaCBpcyBzZW50IHdpdGggYSBOVUxMIHdsX2J1ZmZlciwgdGhlXG5cdCAqXHRmb2xsb3dpbmcgd2xfc3VyZmFjZS5jb21taXQgd2lsbCByZW1vdmUgdGhlIHN1cmZhY2UgY29udGVudC5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHs/Kn0gYnVmZmVyIGJ1ZmZlciBvZiBzdXJmYWNlIGNvbnRlbnRzIFxuXHQgKiBAcGFyYW0ge251bWJlcn0geCBzdXJmYWNlLWxvY2FsIHggY29vcmRpbmF0ZSBcblx0ICogQHBhcmFtIHtudW1iZXJ9IHkgc3VyZmFjZS1sb2NhbCB5IGNvb3JkaW5hdGUgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRhdHRhY2ggKGJ1ZmZlciwgeCwgeSkge1xuXHRcdHRoaXMuZGlzcGxheS5tYXJzaGFsbCh0aGlzLmlkLCAxLCBbb2JqZWN0T3B0aW9uYWwoYnVmZmVyKSwgaW50KHgpLCBpbnQoeSldKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRUaGlzIHJlcXVlc3QgaXMgdXNlZCB0byBkZXNjcmliZSB0aGUgcmVnaW9ucyB3aGVyZSB0aGUgcGVuZGluZ1xuXHQgKlx0YnVmZmVyIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBjdXJyZW50IHN1cmZhY2UgY29udGVudHMsIGFuZCB3aGVyZVxuXHQgKlx0dGhlIHN1cmZhY2UgdGhlcmVmb3JlIG5lZWRzIHRvIGJlIHJlcGFpbnRlZC4gVGhlIGNvbXBvc2l0b3Jcblx0ICpcdGlnbm9yZXMgdGhlIHBhcnRzIG9mIHRoZSBkYW1hZ2UgdGhhdCBmYWxsIG91dHNpZGUgb2YgdGhlIHN1cmZhY2UuXG5cdCAqXG5cdCAqXHREYW1hZ2UgaXMgZG91YmxlLWJ1ZmZlcmVkIHN0YXRlLCBzZWUgd2xfc3VyZmFjZS5jb21taXQuXG5cdCAqXG5cdCAqXHRUaGUgZGFtYWdlIHJlY3RhbmdsZSBpcyBzcGVjaWZpZWQgaW4gc3VyZmFjZS1sb2NhbCBjb29yZGluYXRlcyxcblx0ICpcdHdoZXJlIHggYW5kIHkgc3BlY2lmeSB0aGUgdXBwZXIgbGVmdCBjb3JuZXIgb2YgdGhlIGRhbWFnZSByZWN0YW5nbGUuXG5cdCAqXG5cdCAqXHRUaGUgaW5pdGlhbCB2YWx1ZSBmb3IgcGVuZGluZyBkYW1hZ2UgaXMgZW1wdHk6IG5vIGRhbWFnZS5cblx0ICpcdHdsX3N1cmZhY2UuZGFtYWdlIGFkZHMgcGVuZGluZyBkYW1hZ2U6IHRoZSBuZXcgcGVuZGluZyBkYW1hZ2Vcblx0ICpcdGlzIHRoZSB1bmlvbiBvZiBvbGQgcGVuZGluZyBkYW1hZ2UgYW5kIHRoZSBnaXZlbiByZWN0YW5nbGUuXG5cdCAqXG5cdCAqXHR3bF9zdXJmYWNlLmNvbW1pdCBhc3NpZ25zIHBlbmRpbmcgZGFtYWdlIGFzIHRoZSBjdXJyZW50IGRhbWFnZSxcblx0ICpcdGFuZCBjbGVhcnMgcGVuZGluZyBkYW1hZ2UuIFRoZSBzZXJ2ZXIgd2lsbCBjbGVhciB0aGUgY3VycmVudFxuXHQgKlx0ZGFtYWdlIGFzIGl0IHJlcGFpbnRzIHRoZSBzdXJmYWNlLlxuXHQgKlxuXHQgKlx0QWx0ZXJuYXRpdmVseSwgZGFtYWdlIGNhbiBiZSBwb3N0ZWQgd2l0aCB3bF9zdXJmYWNlLmRhbWFnZV9idWZmZXJcblx0ICpcdHdoaWNoIHVzZXMgYnVmZmVyIGNvb3JkaW5hdGVzIGluc3RlYWQgb2Ygc3VyZmFjZSBjb29yZGluYXRlcyxcblx0ICpcdGFuZCBpcyBwcm9iYWJseSB0aGUgcHJlZmVycmVkIGFuZCBpbnR1aXRpdmUgd2F5IG9mIGRvaW5nIHRoaXMuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB4IHN1cmZhY2UtbG9jYWwgeCBjb29yZGluYXRlIFxuXHQgKiBAcGFyYW0ge251bWJlcn0geSBzdXJmYWNlLWxvY2FsIHkgY29vcmRpbmF0ZSBcblx0ICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIHdpZHRoIG9mIGRhbWFnZSByZWN0YW5nbGUgXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgaGVpZ2h0IG9mIGRhbWFnZSByZWN0YW5nbGUgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRkYW1hZ2UgKHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcblx0XHR0aGlzLmRpc3BsYXkubWFyc2hhbGwodGhpcy5pZCwgMiwgW2ludCh4KSwgaW50KHkpLCBpbnQod2lkdGgpLCBpbnQoaGVpZ2h0KV0pXG5cdH1cblxuXHQvKipcblx0ICpcblx0ICpcdFJlcXVlc3QgYSBub3RpZmljYXRpb24gd2hlbiBpdCBpcyBhIGdvb2QgdGltZSB0byBzdGFydCBkcmF3aW5nIGEgbmV3XG5cdCAqXHRmcmFtZSwgYnkgY3JlYXRpbmcgYSBmcmFtZSBjYWxsYmFjay4gVGhpcyBpcyB1c2VmdWwgZm9yIHRocm90dGxpbmdcblx0ICpcdHJlZHJhd2luZyBvcGVyYXRpb25zLCBhbmQgZHJpdmluZyBhbmltYXRpb25zLlxuXHQgKlxuXHQgKlx0V2hlbiBhIGNsaWVudCBpcyBhbmltYXRpbmcgb24gYSB3bF9zdXJmYWNlLCBpdCBjYW4gdXNlIHRoZSAnZnJhbWUnXG5cdCAqXHRyZXF1ZXN0IHRvIGdldCBub3RpZmllZCB3aGVuIGl0IGlzIGEgZ29vZCB0aW1lIHRvIGRyYXcgYW5kIGNvbW1pdCB0aGVcblx0ICpcdG5leHQgZnJhbWUgb2YgYW5pbWF0aW9uLiBJZiB0aGUgY2xpZW50IGNvbW1pdHMgYW4gdXBkYXRlIGVhcmxpZXIgdGhhblxuXHQgKlx0dGhhdCwgaXQgaXMgbGlrZWx5IHRoYXQgc29tZSB1cGRhdGVzIHdpbGwgbm90IG1ha2UgaXQgdG8gdGhlIGRpc3BsYXksXG5cdCAqXHRhbmQgdGhlIGNsaWVudCBpcyB3YXN0aW5nIHJlc291cmNlcyBieSBkcmF3aW5nIHRvbyBvZnRlbi5cblx0ICpcblx0ICpcdFRoZSBmcmFtZSByZXF1ZXN0IHdpbGwgdGFrZSBlZmZlY3Qgb24gdGhlIG5leHQgd2xfc3VyZmFjZS5jb21taXQuXG5cdCAqXHRUaGUgbm90aWZpY2F0aW9uIHdpbGwgb25seSBiZSBwb3N0ZWQgZm9yIG9uZSBmcmFtZSB1bmxlc3Ncblx0ICpcdHJlcXVlc3RlZCBhZ2Fpbi4gRm9yIGEgd2xfc3VyZmFjZSwgdGhlIG5vdGlmaWNhdGlvbnMgYXJlIHBvc3RlZCBpblxuXHQgKlx0dGhlIG9yZGVyIHRoZSBmcmFtZSByZXF1ZXN0cyB3ZXJlIGNvbW1pdHRlZC5cblx0ICpcblx0ICpcdFRoZSBzZXJ2ZXIgbXVzdCBzZW5kIHRoZSBub3RpZmljYXRpb25zIHNvIHRoYXQgYSBjbGllbnRcblx0ICpcdHdpbGwgbm90IHNlbmQgZXhjZXNzaXZlIHVwZGF0ZXMsIHdoaWxlIHN0aWxsIGFsbG93aW5nXG5cdCAqXHR0aGUgaGlnaGVzdCBwb3NzaWJsZSB1cGRhdGUgcmF0ZSBmb3IgY2xpZW50cyB0aGF0IHdhaXQgZm9yIHRoZSByZXBseVxuXHQgKlx0YmVmb3JlIGRyYXdpbmcgYWdhaW4uIFRoZSBzZXJ2ZXIgc2hvdWxkIGdpdmUgc29tZSB0aW1lIGZvciB0aGUgY2xpZW50XG5cdCAqXHR0byBkcmF3IGFuZCBjb21taXQgYWZ0ZXIgc2VuZGluZyB0aGUgZnJhbWUgY2FsbGJhY2sgZXZlbnRzIHRvIGxldCBpdFxuXHQgKlx0aGl0IHRoZSBuZXh0IG91dHB1dCByZWZyZXNoLlxuXHQgKlxuXHQgKlx0QSBzZXJ2ZXIgc2hvdWxkIGF2b2lkIHNpZ25hbGluZyB0aGUgZnJhbWUgY2FsbGJhY2tzIGlmIHRoZVxuXHQgKlx0c3VyZmFjZSBpcyBub3QgdmlzaWJsZSBpbiBhbnkgd2F5LCBlLmcuIHRoZSBzdXJmYWNlIGlzIG9mZi1zY3JlZW4sXG5cdCAqXHRvciBjb21wbGV0ZWx5IG9ic2N1cmVkIGJ5IG90aGVyIG9wYXF1ZSBzdXJmYWNlcy5cblx0ICpcblx0ICpcdFRoZSBvYmplY3QgcmV0dXJuZWQgYnkgdGhpcyByZXF1ZXN0IHdpbGwgYmUgZGVzdHJveWVkIGJ5IHRoZVxuXHQgKlx0Y29tcG9zaXRvciBhZnRlciB0aGUgY2FsbGJhY2sgaXMgZmlyZWQgYW5kIGFzIHN1Y2ggdGhlIGNsaWVudCBtdXN0IG5vdFxuXHQgKlx0YXR0ZW1wdCB0byB1c2UgaXQgYWZ0ZXIgdGhhdCBwb2ludC5cblx0ICpcblx0ICpcdFRoZSBjYWxsYmFja19kYXRhIHBhc3NlZCBpbiB0aGUgY2FsbGJhY2sgaXMgdGhlIGN1cnJlbnQgdGltZSwgaW5cblx0ICpcdG1pbGxpc2Vjb25kcywgd2l0aCBhbiB1bmRlZmluZWQgYmFzZS5cblx0ICogICAgICBcblx0ICpcblx0ICogQHJldHVybiB7V2xDYWxsYmFja1Byb3h5fSBjYWxsYmFjayBvYmplY3QgZm9yIHRoZSBmcmFtZSByZXF1ZXN0IFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0ZnJhbWUgKCkge1xuXHRcdHJldHVybiB0aGlzLmRpc3BsYXkubWFyc2hhbGxDb25zdHJ1Y3Rvcih0aGlzLmlkLCAzLCBXbENhbGxiYWNrUHJveHksIFtuZXdPYmplY3QoKV0pXG5cdH1cblxuXHQvKipcblx0ICpcblx0ICpcdFRoaXMgcmVxdWVzdCBzZXRzIHRoZSByZWdpb24gb2YgdGhlIHN1cmZhY2UgdGhhdCBjb250YWluc1xuXHQgKlx0b3BhcXVlIGNvbnRlbnQuXG5cdCAqXG5cdCAqXHRUaGUgb3BhcXVlIHJlZ2lvbiBpcyBhbiBvcHRpbWl6YXRpb24gaGludCBmb3IgdGhlIGNvbXBvc2l0b3Jcblx0ICpcdHRoYXQgbGV0cyBpdCBvcHRpbWl6ZSB0aGUgcmVkcmF3aW5nIG9mIGNvbnRlbnQgYmVoaW5kIG9wYXF1ZVxuXHQgKlx0cmVnaW9ucy4gIFNldHRpbmcgYW4gb3BhcXVlIHJlZ2lvbiBpcyBub3QgcmVxdWlyZWQgZm9yIGNvcnJlY3Rcblx0ICpcdGJlaGF2aW91ciwgYnV0IG1hcmtpbmcgdHJhbnNwYXJlbnQgY29udGVudCBhcyBvcGFxdWUgd2lsbCByZXN1bHRcblx0ICpcdGluIHJlcGFpbnQgYXJ0aWZhY3RzLlxuXHQgKlxuXHQgKlx0VGhlIG9wYXF1ZSByZWdpb24gaXMgc3BlY2lmaWVkIGluIHN1cmZhY2UtbG9jYWwgY29vcmRpbmF0ZXMuXG5cdCAqXG5cdCAqXHRUaGUgY29tcG9zaXRvciBpZ25vcmVzIHRoZSBwYXJ0cyBvZiB0aGUgb3BhcXVlIHJlZ2lvbiB0aGF0IGZhbGxcblx0ICpcdG91dHNpZGUgb2YgdGhlIHN1cmZhY2UuXG5cdCAqXG5cdCAqXHRPcGFxdWUgcmVnaW9uIGlzIGRvdWJsZS1idWZmZXJlZCBzdGF0ZSwgc2VlIHdsX3N1cmZhY2UuY29tbWl0LlxuXHQgKlxuXHQgKlx0d2xfc3VyZmFjZS5zZXRfb3BhcXVlX3JlZ2lvbiBjaGFuZ2VzIHRoZSBwZW5kaW5nIG9wYXF1ZSByZWdpb24uXG5cdCAqXHR3bF9zdXJmYWNlLmNvbW1pdCBjb3BpZXMgdGhlIHBlbmRpbmcgcmVnaW9uIHRvIHRoZSBjdXJyZW50IHJlZ2lvbi5cblx0ICpcdE90aGVyd2lzZSwgdGhlIHBlbmRpbmcgYW5kIGN1cnJlbnQgcmVnaW9ucyBhcmUgbmV2ZXIgY2hhbmdlZC5cblx0ICpcblx0ICpcdFRoZSBpbml0aWFsIHZhbHVlIGZvciBhbiBvcGFxdWUgcmVnaW9uIGlzIGVtcHR5LiBTZXR0aW5nIHRoZSBwZW5kaW5nXG5cdCAqXHRvcGFxdWUgcmVnaW9uIGhhcyBjb3B5IHNlbWFudGljcywgYW5kIHRoZSB3bF9yZWdpb24gb2JqZWN0IGNhbiBiZVxuXHQgKlx0ZGVzdHJveWVkIGltbWVkaWF0ZWx5LiBBIE5VTEwgd2xfcmVnaW9uIGNhdXNlcyB0aGUgcGVuZGluZyBvcGFxdWVcblx0ICpcdHJlZ2lvbiB0byBiZSBzZXQgdG8gZW1wdHkuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7Pyp9IHJlZ2lvbiBvcGFxdWUgcmVnaW9uIG9mIHRoZSBzdXJmYWNlIFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0c2V0T3BhcXVlUmVnaW9uIChyZWdpb24pIHtcblx0XHR0aGlzLmRpc3BsYXkubWFyc2hhbGwodGhpcy5pZCwgNCwgW29iamVjdE9wdGlvbmFsKHJlZ2lvbildKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRUaGlzIHJlcXVlc3Qgc2V0cyB0aGUgcmVnaW9uIG9mIHRoZSBzdXJmYWNlIHRoYXQgY2FuIHJlY2VpdmVcblx0ICpcdHBvaW50ZXIgYW5kIHRvdWNoIGV2ZW50cy5cblx0ICpcblx0ICpcdElucHV0IGV2ZW50cyBoYXBwZW5pbmcgb3V0c2lkZSBvZiB0aGlzIHJlZ2lvbiB3aWxsIHRyeSB0aGUgbmV4dFxuXHQgKlx0c3VyZmFjZSBpbiB0aGUgc2VydmVyIHN1cmZhY2Ugc3RhY2suIFRoZSBjb21wb3NpdG9yIGlnbm9yZXMgdGhlXG5cdCAqXHRwYXJ0cyBvZiB0aGUgaW5wdXQgcmVnaW9uIHRoYXQgZmFsbCBvdXRzaWRlIG9mIHRoZSBzdXJmYWNlLlxuXHQgKlxuXHQgKlx0VGhlIGlucHV0IHJlZ2lvbiBpcyBzcGVjaWZpZWQgaW4gc3VyZmFjZS1sb2NhbCBjb29yZGluYXRlcy5cblx0ICpcblx0ICpcdElucHV0IHJlZ2lvbiBpcyBkb3VibGUtYnVmZmVyZWQgc3RhdGUsIHNlZSB3bF9zdXJmYWNlLmNvbW1pdC5cblx0ICpcblx0ICpcdHdsX3N1cmZhY2Uuc2V0X2lucHV0X3JlZ2lvbiBjaGFuZ2VzIHRoZSBwZW5kaW5nIGlucHV0IHJlZ2lvbi5cblx0ICpcdHdsX3N1cmZhY2UuY29tbWl0IGNvcGllcyB0aGUgcGVuZGluZyByZWdpb24gdG8gdGhlIGN1cnJlbnQgcmVnaW9uLlxuXHQgKlx0T3RoZXJ3aXNlIHRoZSBwZW5kaW5nIGFuZCBjdXJyZW50IHJlZ2lvbnMgYXJlIG5ldmVyIGNoYW5nZWQsXG5cdCAqXHRleGNlcHQgY3Vyc29yIGFuZCBpY29uIHN1cmZhY2VzIGFyZSBzcGVjaWFsIGNhc2VzLCBzZWVcblx0ICpcdHdsX3BvaW50ZXIuc2V0X2N1cnNvciBhbmQgd2xfZGF0YV9kZXZpY2Uuc3RhcnRfZHJhZy5cblx0ICpcblx0ICpcdFRoZSBpbml0aWFsIHZhbHVlIGZvciBhbiBpbnB1dCByZWdpb24gaXMgaW5maW5pdGUuIFRoYXQgbWVhbnMgdGhlXG5cdCAqXHR3aG9sZSBzdXJmYWNlIHdpbGwgYWNjZXB0IGlucHV0LiBTZXR0aW5nIHRoZSBwZW5kaW5nIGlucHV0IHJlZ2lvblxuXHQgKlx0aGFzIGNvcHkgc2VtYW50aWNzLCBhbmQgdGhlIHdsX3JlZ2lvbiBvYmplY3QgY2FuIGJlIGRlc3Ryb3llZFxuXHQgKlx0aW1tZWRpYXRlbHkuIEEgTlVMTCB3bF9yZWdpb24gY2F1c2VzIHRoZSBpbnB1dCByZWdpb24gdG8gYmUgc2V0XG5cdCAqXHR0byBpbmZpbml0ZS5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHs/Kn0gcmVnaW9uIGlucHV0IHJlZ2lvbiBvZiB0aGUgc3VyZmFjZSBcblx0ICpcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdHNldElucHV0UmVnaW9uIChyZWdpb24pIHtcblx0XHR0aGlzLmRpc3BsYXkubWFyc2hhbGwodGhpcy5pZCwgNSwgW29iamVjdE9wdGlvbmFsKHJlZ2lvbildKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRTdXJmYWNlIHN0YXRlIChpbnB1dCwgb3BhcXVlLCBhbmQgZGFtYWdlIHJlZ2lvbnMsIGF0dGFjaGVkIGJ1ZmZlcnMsXG5cdCAqXHRldGMuKSBpcyBkb3VibGUtYnVmZmVyZWQuIFByb3RvY29sIHJlcXVlc3RzIG1vZGlmeSB0aGUgcGVuZGluZyBzdGF0ZSxcblx0ICpcdGFzIG9wcG9zZWQgdG8gdGhlIGN1cnJlbnQgc3RhdGUgaW4gdXNlIGJ5IHRoZSBjb21wb3NpdG9yLiBBIGNvbW1pdFxuXHQgKlx0cmVxdWVzdCBhdG9taWNhbGx5IGFwcGxpZXMgYWxsIHBlbmRpbmcgc3RhdGUsIHJlcGxhY2luZyB0aGUgY3VycmVudFxuXHQgKlx0c3RhdGUuIEFmdGVyIGNvbW1pdCwgdGhlIG5ldyBwZW5kaW5nIHN0YXRlIGlzIGFzIGRvY3VtZW50ZWQgZm9yIGVhY2hcblx0ICpcdHJlbGF0ZWQgcmVxdWVzdC5cblx0ICpcblx0ICpcdE9uIGNvbW1pdCwgYSBwZW5kaW5nIHdsX2J1ZmZlciBpcyBhcHBsaWVkIGZpcnN0LCBhbmQgYWxsIG90aGVyIHN0YXRlXG5cdCAqXHRzZWNvbmQuIFRoaXMgbWVhbnMgdGhhdCBhbGwgY29vcmRpbmF0ZXMgaW4gZG91YmxlLWJ1ZmZlcmVkIHN0YXRlIGFyZVxuXHQgKlx0cmVsYXRpdmUgdG8gdGhlIG5ldyB3bF9idWZmZXIgY29taW5nIGludG8gdXNlLCBleGNlcHQgZm9yXG5cdCAqXHR3bF9zdXJmYWNlLmF0dGFjaCBpdHNlbGYuIElmIHRoZXJlIGlzIG5vIHBlbmRpbmcgd2xfYnVmZmVyLCB0aGVcblx0ICpcdGNvb3JkaW5hdGVzIGFyZSByZWxhdGl2ZSB0byB0aGUgY3VycmVudCBzdXJmYWNlIGNvbnRlbnRzLlxuXHQgKlxuXHQgKlx0QWxsIHJlcXVlc3RzIHRoYXQgbmVlZCBhIGNvbW1pdCB0byBiZWNvbWUgZWZmZWN0aXZlIGFyZSBkb2N1bWVudGVkXG5cdCAqXHR0byBhZmZlY3QgZG91YmxlLWJ1ZmZlcmVkIHN0YXRlLlxuXHQgKlxuXHQgKlx0T3RoZXIgaW50ZXJmYWNlcyBtYXkgYWRkIGZ1cnRoZXIgZG91YmxlLWJ1ZmZlcmVkIHN1cmZhY2Ugc3RhdGUuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBzZXJpYWwgc2VyaWFsIG51bWJlciBvZiB0aGUgY29tbWl0IFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0Y29tbWl0IChzZXJpYWwpIHtcblx0XHR0aGlzLmRpc3BsYXkubWFyc2hhbGwodGhpcy5pZCwgNiwgW3VpbnQoc2VyaWFsKV0pXG5cdH1cblxuXHQvKipcblx0ICpcblx0ICpcdFRoaXMgcmVxdWVzdCBzZXRzIGFuIG9wdGlvbmFsIHRyYW5zZm9ybWF0aW9uIG9uIGhvdyB0aGUgY29tcG9zaXRvclxuXHQgKlx0aW50ZXJwcmV0cyB0aGUgY29udGVudHMgb2YgdGhlIGJ1ZmZlciBhdHRhY2hlZCB0byB0aGUgc3VyZmFjZS4gVGhlXG5cdCAqXHRhY2NlcHRlZCB2YWx1ZXMgZm9yIHRoZSB0cmFuc2Zvcm0gcGFyYW1ldGVyIGFyZSB0aGUgdmFsdWVzIGZvclxuXHQgKlx0d2xfb3V0cHV0LnRyYW5zZm9ybS5cblx0ICpcblx0ICpcdEJ1ZmZlciB0cmFuc2Zvcm0gaXMgZG91YmxlLWJ1ZmZlcmVkIHN0YXRlLCBzZWUgd2xfc3VyZmFjZS5jb21taXQuXG5cdCAqXG5cdCAqXHRBIG5ld2x5IGNyZWF0ZWQgc3VyZmFjZSBoYXMgaXRzIGJ1ZmZlciB0cmFuc2Zvcm1hdGlvbiBzZXQgdG8gbm9ybWFsLlxuXHQgKlxuXHQgKlx0d2xfc3VyZmFjZS5zZXRfYnVmZmVyX3RyYW5zZm9ybSBjaGFuZ2VzIHRoZSBwZW5kaW5nIGJ1ZmZlclxuXHQgKlx0dHJhbnNmb3JtYXRpb24uIHdsX3N1cmZhY2UuY29tbWl0IGNvcGllcyB0aGUgcGVuZGluZyBidWZmZXJcblx0ICpcdHRyYW5zZm9ybWF0aW9uIHRvIHRoZSBjdXJyZW50IG9uZS4gT3RoZXJ3aXNlLCB0aGUgcGVuZGluZyBhbmQgY3VycmVudFxuXHQgKlx0dmFsdWVzIGFyZSBuZXZlciBjaGFuZ2VkLlxuXHQgKlxuXHQgKlx0VGhlIHB1cnBvc2Ugb2YgdGhpcyByZXF1ZXN0IGlzIHRvIGFsbG93IGNsaWVudHMgdG8gcmVuZGVyIGNvbnRlbnRcblx0ICpcdGFjY29yZGluZyB0byB0aGUgb3V0cHV0IHRyYW5zZm9ybSwgdGh1cyBwZXJtaXR0aW5nIHRoZSBjb21wb3NpdG9yIHRvXG5cdCAqXHR1c2UgY2VydGFpbiBvcHRpbWl6YXRpb25zIGV2ZW4gaWYgdGhlIGRpc3BsYXkgaXMgcm90YXRlZC4gVXNpbmdcblx0ICpcdGhhcmR3YXJlIG92ZXJsYXlzIGFuZCBzY2FubmluZyBvdXQgYSBjbGllbnQgYnVmZmVyIGZvciBmdWxsc2NyZWVuXG5cdCAqXHRzdXJmYWNlcyBhcmUgZXhhbXBsZXMgb2Ygc3VjaCBvcHRpbWl6YXRpb25zLiBUaG9zZSBvcHRpbWl6YXRpb25zIGFyZVxuXHQgKlx0aGlnaGx5IGRlcGVuZGVudCBvbiB0aGUgY29tcG9zaXRvciBpbXBsZW1lbnRhdGlvbiwgc28gdGhlIHVzZSBvZiB0aGlzXG5cdCAqXHRyZXF1ZXN0IHNob3VsZCBiZSBjb25zaWRlcmVkIG9uIGEgY2FzZS1ieS1jYXNlIGJhc2lzLlxuXHQgKlxuXHQgKlx0Tm90ZSB0aGF0IGlmIHRoZSB0cmFuc2Zvcm0gdmFsdWUgaW5jbHVkZXMgOTAgb3IgMjcwIGRlZ3JlZSByb3RhdGlvbixcblx0ICpcdHRoZSB3aWR0aCBvZiB0aGUgYnVmZmVyIHdpbGwgYmVjb21lIHRoZSBzdXJmYWNlIGhlaWdodCBhbmQgdGhlIGhlaWdodFxuXHQgKlx0b2YgdGhlIGJ1ZmZlciB3aWxsIGJlY29tZSB0aGUgc3VyZmFjZSB3aWR0aC5cblx0ICpcblx0ICpcdElmIHRyYW5zZm9ybSBpcyBub3Qgb25lIG9mIHRoZSB2YWx1ZXMgZnJvbSB0aGVcblx0ICpcdHdsX291dHB1dC50cmFuc2Zvcm0gZW51bSB0aGUgaW52YWxpZF90cmFuc2Zvcm0gcHJvdG9jb2wgZXJyb3Jcblx0ICpcdGlzIHJhaXNlZC5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHtudW1iZXJ9IHRyYW5zZm9ybSB0cmFuc2Zvcm0gZm9yIGludGVycHJldGluZyBidWZmZXIgY29udGVudHMgXG5cdCAqXG5cdCAqIEBzaW5jZSAyXG5cdCAqXG5cdCAqL1xuXHRzZXRCdWZmZXJUcmFuc2Zvcm0gKHRyYW5zZm9ybSkge1xuXHRcdHRoaXMuZGlzcGxheS5tYXJzaGFsbCh0aGlzLmlkLCA3LCBbaW50KHRyYW5zZm9ybSldKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRUaGlzIHJlcXVlc3Qgc2V0cyBhbiBvcHRpb25hbCBzY2FsaW5nIGZhY3RvciBvbiBob3cgdGhlIGNvbXBvc2l0b3Jcblx0ICpcdGludGVycHJldHMgdGhlIGNvbnRlbnRzIG9mIHRoZSBidWZmZXIgYXR0YWNoZWQgdG8gdGhlIHdpbmRvdy5cblx0ICpcblx0ICpcdEJ1ZmZlciBzY2FsZSBpcyBkb3VibGUtYnVmZmVyZWQgc3RhdGUsIHNlZSB3bF9zdXJmYWNlLmNvbW1pdC5cblx0ICpcblx0ICpcdEEgbmV3bHkgY3JlYXRlZCBzdXJmYWNlIGhhcyBpdHMgYnVmZmVyIHNjYWxlIHNldCB0byAxLlxuXHQgKlxuXHQgKlx0d2xfc3VyZmFjZS5zZXRfYnVmZmVyX3NjYWxlIGNoYW5nZXMgdGhlIHBlbmRpbmcgYnVmZmVyIHNjYWxlLlxuXHQgKlx0d2xfc3VyZmFjZS5jb21taXQgY29waWVzIHRoZSBwZW5kaW5nIGJ1ZmZlciBzY2FsZSB0byB0aGUgY3VycmVudCBvbmUuXG5cdCAqXHRPdGhlcndpc2UsIHRoZSBwZW5kaW5nIGFuZCBjdXJyZW50IHZhbHVlcyBhcmUgbmV2ZXIgY2hhbmdlZC5cblx0ICpcblx0ICpcdFRoZSBwdXJwb3NlIG9mIHRoaXMgcmVxdWVzdCBpcyB0byBhbGxvdyBjbGllbnRzIHRvIHN1cHBseSBoaWdoZXJcblx0ICpcdHJlc29sdXRpb24gYnVmZmVyIGRhdGEgZm9yIHVzZSBvbiBoaWdoIHJlc29sdXRpb24gb3V0cHV0cy4gSXQgaXNcblx0ICpcdGludGVuZGVkIHRoYXQgeW91IHBpY2sgdGhlIHNhbWUgYnVmZmVyIHNjYWxlIGFzIHRoZSBzY2FsZSBvZiB0aGVcblx0ICpcdG91dHB1dCB0aGF0IHRoZSBzdXJmYWNlIGlzIGRpc3BsYXllZCBvbi4gVGhpcyBtZWFucyB0aGUgY29tcG9zaXRvclxuXHQgKlx0Y2FuIGF2b2lkIHNjYWxpbmcgd2hlbiByZW5kZXJpbmcgdGhlIHN1cmZhY2Ugb24gdGhhdCBvdXRwdXQuXG5cdCAqXG5cdCAqXHROb3RlIHRoYXQgaWYgdGhlIHNjYWxlIGlzIGxhcmdlciB0aGFuIDEsIHRoZW4geW91IGhhdmUgdG8gYXR0YWNoXG5cdCAqXHRhIGJ1ZmZlciB0aGF0IGlzIGxhcmdlciAoYnkgYSBmYWN0b3Igb2Ygc2NhbGUgaW4gZWFjaCBkaW1lbnNpb24pXG5cdCAqXHR0aGFuIHRoZSBkZXNpcmVkIHN1cmZhY2Ugc2l6ZS5cblx0ICpcblx0ICpcdElmIHNjYWxlIGlzIG5vdCBwb3NpdGl2ZSB0aGUgaW52YWxpZF9zY2FsZSBwcm90b2NvbCBlcnJvciBpc1xuXHQgKlx0cmFpc2VkLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0ge251bWJlcn0gc2NhbGUgcG9zaXRpdmUgc2NhbGUgZm9yIGludGVycHJldGluZyBidWZmZXIgY29udGVudHMgXG5cdCAqXG5cdCAqIEBzaW5jZSAzXG5cdCAqXG5cdCAqL1xuXHRzZXRCdWZmZXJTY2FsZSAoc2NhbGUpIHtcblx0XHR0aGlzLmRpc3BsYXkubWFyc2hhbGwodGhpcy5pZCwgOCwgW2ludChzY2FsZSldKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRUaGlzIHJlcXVlc3QgaXMgdXNlZCB0byBkZXNjcmliZSB0aGUgcmVnaW9ucyB3aGVyZSB0aGUgcGVuZGluZ1xuXHQgKlx0YnVmZmVyIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBjdXJyZW50IHN1cmZhY2UgY29udGVudHMsIGFuZCB3aGVyZVxuXHQgKlx0dGhlIHN1cmZhY2UgdGhlcmVmb3JlIG5lZWRzIHRvIGJlIHJlcGFpbnRlZC4gVGhlIGNvbXBvc2l0b3Jcblx0ICpcdGlnbm9yZXMgdGhlIHBhcnRzIG9mIHRoZSBkYW1hZ2UgdGhhdCBmYWxsIG91dHNpZGUgb2YgdGhlIHN1cmZhY2UuXG5cdCAqXG5cdCAqXHREYW1hZ2UgaXMgZG91YmxlLWJ1ZmZlcmVkIHN0YXRlLCBzZWUgd2xfc3VyZmFjZS5jb21taXQuXG5cdCAqXG5cdCAqXHRUaGUgZGFtYWdlIHJlY3RhbmdsZSBpcyBzcGVjaWZpZWQgaW4gYnVmZmVyIGNvb3JkaW5hdGVzLFxuXHQgKlx0d2hlcmUgeCBhbmQgeSBzcGVjaWZ5IHRoZSB1cHBlciBsZWZ0IGNvcm5lciBvZiB0aGUgZGFtYWdlIHJlY3RhbmdsZS5cblx0ICpcblx0ICpcdFRoZSBpbml0aWFsIHZhbHVlIGZvciBwZW5kaW5nIGRhbWFnZSBpcyBlbXB0eTogbm8gZGFtYWdlLlxuXHQgKlx0d2xfc3VyZmFjZS5kYW1hZ2VfYnVmZmVyIGFkZHMgcGVuZGluZyBkYW1hZ2U6IHRoZSBuZXcgcGVuZGluZ1xuXHQgKlx0ZGFtYWdlIGlzIHRoZSB1bmlvbiBvZiBvbGQgcGVuZGluZyBkYW1hZ2UgYW5kIHRoZSBnaXZlbiByZWN0YW5nbGUuXG5cdCAqXG5cdCAqXHR3bF9zdXJmYWNlLmNvbW1pdCBhc3NpZ25zIHBlbmRpbmcgZGFtYWdlIGFzIHRoZSBjdXJyZW50IGRhbWFnZSxcblx0ICpcdGFuZCBjbGVhcnMgcGVuZGluZyBkYW1hZ2UuIFRoZSBzZXJ2ZXIgd2lsbCBjbGVhciB0aGUgY3VycmVudFxuXHQgKlx0ZGFtYWdlIGFzIGl0IHJlcGFpbnRzIHRoZSBzdXJmYWNlLlxuXHQgKlxuXHQgKlx0VGhpcyByZXF1ZXN0IGRpZmZlcnMgZnJvbSB3bF9zdXJmYWNlLmRhbWFnZSBpbiBvbmx5IG9uZSB3YXkgLSBpdFxuXHQgKlx0dGFrZXMgZGFtYWdlIGluIGJ1ZmZlciBjb29yZGluYXRlcyBpbnN0ZWFkIG9mIHN1cmZhY2UtbG9jYWxcblx0ICpcdGNvb3JkaW5hdGVzLiBXaGlsZSB0aGlzIGdlbmVyYWxseSBpcyBtb3JlIGludHVpdGl2ZSB0aGFuIHN1cmZhY2Vcblx0ICpcdGNvb3JkaW5hdGVzLCBpdCBpcyBlc3BlY2lhbGx5IGRlc2lyYWJsZSB3aGVuIHVzaW5nIHdwX3ZpZXdwb3J0XG5cdCAqXHRvciB3aGVuIGEgZHJhd2luZyBsaWJyYXJ5IChsaWtlIEVHTCkgaXMgdW5hd2FyZSBvZiBidWZmZXIgc2NhbGVcblx0ICpcdGFuZCBidWZmZXIgdHJhbnNmb3JtLlxuXHQgKlxuXHQgKlx0Tm90ZTogQmVjYXVzZSBidWZmZXIgdHJhbnNmb3JtYXRpb24gY2hhbmdlcyBhbmQgZGFtYWdlIHJlcXVlc3RzIG1heVxuXHQgKlx0YmUgaW50ZXJsZWF2ZWQgaW4gdGhlIHByb3RvY29sIHN0cmVhbSwgaXQgaXMgaW1wb3NzaWJsZSB0byBkZXRlcm1pbmVcblx0ICpcdHRoZSBhY3R1YWwgbWFwcGluZyBiZXR3ZWVuIHN1cmZhY2UgYW5kIGJ1ZmZlciBkYW1hZ2UgdW50aWxcblx0ICpcdHdsX3N1cmZhY2UuY29tbWl0IHRpbWUuIFRoZXJlZm9yZSwgY29tcG9zaXRvcnMgd2lzaGluZyB0byB0YWtlIGJvdGhcblx0ICpcdGtpbmRzIG9mIGRhbWFnZSBpbnRvIGFjY291bnQgd2lsbCBoYXZlIHRvIGFjY3VtdWxhdGUgZGFtYWdlIGZyb20gdGhlXG5cdCAqXHR0d28gcmVxdWVzdHMgc2VwYXJhdGVseSBhbmQgb25seSB0cmFuc2Zvcm0gZnJvbSBvbmUgdG8gdGhlIG90aGVyXG5cdCAqXHRhZnRlciByZWNlaXZpbmcgdGhlIHdsX3N1cmZhY2UuY29tbWl0LlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0ge251bWJlcn0geCBidWZmZXItbG9jYWwgeCBjb29yZGluYXRlIFxuXHQgKiBAcGFyYW0ge251bWJlcn0geSBidWZmZXItbG9jYWwgeSBjb29yZGluYXRlIFxuXHQgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggd2lkdGggb2YgZGFtYWdlIHJlY3RhbmdsZSBcblx0ICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCBoZWlnaHQgb2YgZGFtYWdlIHJlY3RhbmdsZSBcblx0ICpcblx0ICogQHNpbmNlIDRcblx0ICpcblx0ICovXG5cdGRhbWFnZUJ1ZmZlciAoeCwgeSwgd2lkdGgsIGhlaWdodCkge1xuXHRcdHRoaXMuZGlzcGxheS5tYXJzaGFsbCh0aGlzLmlkLCA5LCBbaW50KHgpLCBpbnQoeSksIGludCh3aWR0aCksIGludChoZWlnaHQpXSlcblx0fVxuXG4vKipcblx0ICpAcGFyYW0ge0Rpc3BsYXl9ZGlzcGxheVxuXHQgKkBwYXJhbSB7bnVtYmVyfWlkXG5cdCAqL1xuXHRjb25zdHJ1Y3RvciAoZGlzcGxheSwgaWQpIHtcblx0XHRzdXBlcihkaXNwbGF5LCBpZClcblx0XHQvKipcblx0XHQgKiBAdHlwZSB7V2xTdXJmYWNlRXZlbnRzfG51bGx9XG5cdFx0ICovXG5cdFx0dGhpcy5saXN0ZW5lciA9IG51bGxcblx0fVxuXG5cdGFzeW5jIFswXSAobWVzc2FnZSkge1xuXHRcdGF3YWl0IHRoaXMubGlzdGVuZXIuZW50ZXIobyhtZXNzYWdlLCBmYWxzZSwgdGhpcy5kaXNwbGF5LmNvbm5lY3Rpb24pKVxuXHR9XG5cblx0YXN5bmMgWzFdIChtZXNzYWdlKSB7XG5cdFx0YXdhaXQgdGhpcy5saXN0ZW5lci5sZWF2ZShvKG1lc3NhZ2UsIGZhbHNlLCB0aGlzLmRpc3BsYXkuY29ubmVjdGlvbikpXG5cdH1cblxufVxuV2xTdXJmYWNlUHJveHkucHJvdG9jb2xOYW1lID0gJ3dsX3N1cmZhY2UnXG5cbldsU3VyZmFjZVByb3h5LkVycm9yID0ge1xuICAvKipcbiAgICogYnVmZmVyIHNjYWxlIHZhbHVlIGlzIGludmFsaWRcbiAgICovXG4gIGludmFsaWRTY2FsZTogMCxcbiAgLyoqXG4gICAqIGJ1ZmZlciB0cmFuc2Zvcm0gdmFsdWUgaXMgaW52YWxpZFxuICAgKi9cbiAgaW52YWxpZFRyYW5zZm9ybTogMVxufVxuXG5leHBvcnQgZGVmYXVsdCBXbFN1cmZhY2VQcm94eVxuIiwiLypcbiAqXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAwOC0yMDExIEtyaXN0aWFuIEjDuGdzYmVyZ1xuICogICAgQ29weXJpZ2h0IMKpIDIwMTAtMjAxMSBJbnRlbCBDb3Jwb3JhdGlvblxuICogICAgQ29weXJpZ2h0IMKpIDIwMTItMjAxMyBDb2xsYWJvcmEsIEx0ZC5cbiAqXG4gKiAgICBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogICAgb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXNcbiAqICAgICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqICAgIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiAgICBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogICAgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqICAgIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqICAgIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIChpbmNsdWRpbmcgdGhlXG4gKiAgICBuZXh0IHBhcmFncmFwaCkgc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbFxuICogICAgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqICAgIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiAgICBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0ZcbiAqICAgIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG4gKiAgICBOT05JTkZSSU5HRU1FTlQuICBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSU1xuICogICAgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOXG4gKiAgICBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTlxuICogICAgQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuICogICAgU09GVFdBUkUuXG4gKiAgXG4gKi9cblxuLyoqXG4gKiBAaW50ZXJmYWNlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdsVG91Y2hFdmVudHMge1xuXG5cdC8qKlxuXHQgKlxuXHQgKlx0QSBuZXcgdG91Y2ggcG9pbnQgaGFzIGFwcGVhcmVkIG9uIHRoZSBzdXJmYWNlLiBUaGlzIHRvdWNoIHBvaW50IGlzXG5cdCAqXHRhc3NpZ25lZCBhIHVuaXF1ZSBJRC4gRnV0dXJlIGV2ZW50cyBmcm9tIHRoaXMgdG91Y2ggcG9pbnQgcmVmZXJlbmNlXG5cdCAqXHR0aGlzIElELiBUaGUgSUQgY2Vhc2VzIHRvIGJlIHZhbGlkIGFmdGVyIGEgdG91Y2ggdXAgZXZlbnQgYW5kIG1heSBiZVxuXHQgKlx0cmV1c2VkIGluIHRoZSBmdXR1cmUuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBzZXJpYWwgc2VyaWFsIG51bWJlciBvZiB0aGUgdG91Y2ggZG93biBldmVudCBcblx0ICogQHBhcmFtIHtudW1iZXJ9IHRpbWUgdGltZXN0YW1wIHdpdGggbWlsbGlzZWNvbmQgZ3JhbnVsYXJpdHkgXG5cdCAqIEBwYXJhbSB7Kn0gc3VyZmFjZSBzdXJmYWNlIHRvdWNoZWQgXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBpZCB0aGUgdW5pcXVlIElEIG9mIHRoaXMgdG91Y2ggcG9pbnQgXG5cdCAqIEBwYXJhbSB7Rml4ZWR9IHggc3VyZmFjZS1sb2NhbCB4IGNvb3JkaW5hdGUgXG5cdCAqIEBwYXJhbSB7Rml4ZWR9IHkgc3VyZmFjZS1sb2NhbCB5IGNvb3JkaW5hdGUgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRkb3duKHNlcmlhbCwgdGltZSwgc3VyZmFjZSwgaWQsIHgsIHkpIHt9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRUaGUgdG91Y2ggcG9pbnQgaGFzIGRpc2FwcGVhcmVkLiBObyBmdXJ0aGVyIGV2ZW50cyB3aWxsIGJlIHNlbnQgZm9yXG5cdCAqXHR0aGlzIHRvdWNoIHBvaW50IGFuZCB0aGUgdG91Y2ggcG9pbnQncyBJRCBpcyByZWxlYXNlZCBhbmQgbWF5IGJlXG5cdCAqXHRyZXVzZWQgaW4gYSBmdXR1cmUgdG91Y2ggZG93biBldmVudC5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHtudW1iZXJ9IHNlcmlhbCBzZXJpYWwgbnVtYmVyIG9mIHRoZSB0b3VjaCB1cCBldmVudCBcblx0ICogQHBhcmFtIHtudW1iZXJ9IHRpbWUgdGltZXN0YW1wIHdpdGggbWlsbGlzZWNvbmQgZ3JhbnVsYXJpdHkgXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBpZCB0aGUgdW5pcXVlIElEIG9mIHRoaXMgdG91Y2ggcG9pbnQgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHR1cChzZXJpYWwsIHRpbWUsIGlkKSB7fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0QSB0b3VjaCBwb2ludCBoYXMgY2hhbmdlZCBjb29yZGluYXRlcy5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHtudW1iZXJ9IHRpbWUgdGltZXN0YW1wIHdpdGggbWlsbGlzZWNvbmQgZ3JhbnVsYXJpdHkgXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBpZCB0aGUgdW5pcXVlIElEIG9mIHRoaXMgdG91Y2ggcG9pbnQgXG5cdCAqIEBwYXJhbSB7Rml4ZWR9IHggc3VyZmFjZS1sb2NhbCB4IGNvb3JkaW5hdGUgXG5cdCAqIEBwYXJhbSB7Rml4ZWR9IHkgc3VyZmFjZS1sb2NhbCB5IGNvb3JkaW5hdGUgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRtb3Rpb24odGltZSwgaWQsIHgsIHkpIHt9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRJbmRpY2F0ZXMgdGhlIGVuZCBvZiBhIHNldCBvZiBldmVudHMgdGhhdCBsb2dpY2FsbHkgYmVsb25nIHRvZ2V0aGVyLlxuXHQgKlx0QSBjbGllbnQgaXMgZXhwZWN0ZWQgdG8gYWNjdW11bGF0ZSB0aGUgZGF0YSBpbiBhbGwgZXZlbnRzIHdpdGhpbiB0aGVcblx0ICpcdGZyYW1lIGJlZm9yZSBwcm9jZWVkaW5nLlxuXHQgKlxuXHQgKlx0QSB3bF90b3VjaC5mcmFtZSB0ZXJtaW5hdGVzIGF0IGxlYXN0IG9uZSBldmVudCBidXQgb3RoZXJ3aXNlIG5vXG5cdCAqXHRndWFyYW50ZWUgaXMgcHJvdmlkZWQgYWJvdXQgdGhlIHNldCBvZiBldmVudHMgd2l0aGluIGEgZnJhbWUuIEEgY2xpZW50XG5cdCAqXHRtdXN0IGFzc3VtZSB0aGF0IGFueSBzdGF0ZSBub3QgdXBkYXRlZCBpbiBhIGZyYW1lIGlzIHVuY2hhbmdlZCBmcm9tIHRoZVxuXHQgKlx0cHJldmlvdXNseSBrbm93biBzdGF0ZS5cblx0ICogICAgICBcblx0ICpcblx0ICpcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdGZyYW1lKCkge31cblxuXHQvKipcblx0ICpcblx0ICpcdFNlbnQgaWYgdGhlIGNvbXBvc2l0b3IgZGVjaWRlcyB0aGUgdG91Y2ggc3RyZWFtIGlzIGEgZ2xvYmFsXG5cdCAqXHRnZXN0dXJlLiBObyBmdXJ0aGVyIGV2ZW50cyBhcmUgc2VudCB0byB0aGUgY2xpZW50cyBmcm9tIHRoYXRcblx0ICpcdHBhcnRpY3VsYXIgZ2VzdHVyZS4gVG91Y2ggY2FuY2VsbGF0aW9uIGFwcGxpZXMgdG8gYWxsIHRvdWNoIHBvaW50c1xuXHQgKlx0Y3VycmVudGx5IGFjdGl2ZSBvbiB0aGlzIGNsaWVudCdzIHN1cmZhY2UuIFRoZSBjbGllbnQgaXNcblx0ICpcdHJlc3BvbnNpYmxlIGZvciBmaW5hbGl6aW5nIHRoZSB0b3VjaCBwb2ludHMsIGZ1dHVyZSB0b3VjaCBwb2ludHMgb25cblx0ICpcdHRoaXMgc3VyZmFjZSBtYXkgcmV1c2UgdGhlIHRvdWNoIHBvaW50IElELlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0Y2FuY2VsKCkge31cblxuXHQvKipcblx0ICpcblx0ICpcdFNlbnQgd2hlbiBhIHRvdWNocG9pbnQgaGFzIGNoYW5nZWQgaXRzIHNoYXBlLlxuXHQgKlxuXHQgKlx0VGhpcyBldmVudCBkb2VzIG5vdCBvY2N1ciBvbiBpdHMgb3duLiBJdCBpcyBzZW50IGJlZm9yZSBhXG5cdCAqXHR3bF90b3VjaC5mcmFtZSBldmVudCBhbmQgY2FycmllcyB0aGUgbmV3IHNoYXBlIGluZm9ybWF0aW9uIGZvclxuXHQgKlx0YW55IHByZXZpb3VzbHkgcmVwb3J0ZWQsIG9yIG5ldyB0b3VjaCBwb2ludHMgb2YgdGhhdCBmcmFtZS5cblx0ICpcblx0ICpcdE90aGVyIGV2ZW50cyBkZXNjcmliaW5nIHRoZSB0b3VjaCBwb2ludCBzdWNoIGFzIHdsX3RvdWNoLmRvd24sXG5cdCAqXHR3bF90b3VjaC5tb3Rpb24gb3Igd2xfdG91Y2gub3JpZW50YXRpb24gbWF5IGJlIHNlbnQgd2l0aGluIHRoZVxuXHQgKlx0c2FtZSB3bF90b3VjaC5mcmFtZS4gQSBjbGllbnQgc2hvdWxkIHRyZWF0IHRoZXNlIGV2ZW50cyBhcyBhIHNpbmdsZVxuXHQgKlx0bG9naWNhbCB0b3VjaCBwb2ludCB1cGRhdGUuIFRoZSBvcmRlciBvZiB3bF90b3VjaC5zaGFwZSxcblx0ICpcdHdsX3RvdWNoLm9yaWVudGF0aW9uIGFuZCB3bF90b3VjaC5tb3Rpb24gaXMgbm90IGd1YXJhbnRlZWQuXG5cdCAqXHRBIHdsX3RvdWNoLmRvd24gZXZlbnQgaXMgZ3VhcmFudGVlZCB0byBvY2N1ciBiZWZvcmUgdGhlIGZpcnN0XG5cdCAqXHR3bF90b3VjaC5zaGFwZSBldmVudCBmb3IgdGhpcyB0b3VjaCBJRCBidXQgYm90aCBldmVudHMgbWF5IG9jY3VyIHdpdGhpblxuXHQgKlx0dGhlIHNhbWUgd2xfdG91Y2guZnJhbWUuXG5cdCAqXG5cdCAqXHRBIHRvdWNocG9pbnQgc2hhcGUgaXMgYXBwcm94aW1hdGVkIGJ5IGFuIGVsbGlwc2UgdGhyb3VnaCB0aGUgbWFqb3IgYW5kXG5cdCAqXHRtaW5vciBheGlzIGxlbmd0aC4gVGhlIG1ham9yIGF4aXMgbGVuZ3RoIGRlc2NyaWJlcyB0aGUgbG9uZ2VyIGRpYW1ldGVyXG5cdCAqXHRvZiB0aGUgZWxsaXBzZSwgd2hpbGUgdGhlIG1pbm9yIGF4aXMgbGVuZ3RoIGRlc2NyaWJlcyB0aGUgc2hvcnRlclxuXHQgKlx0ZGlhbWV0ZXIuIE1ham9yIGFuZCBtaW5vciBhcmUgb3J0aG9nb25hbCBhbmQgYm90aCBhcmUgc3BlY2lmaWVkIGluXG5cdCAqXHRzdXJmYWNlLWxvY2FsIGNvb3JkaW5hdGVzLiBUaGUgY2VudGVyIG9mIHRoZSBlbGxpcHNlIGlzIGFsd2F5cyBhdCB0aGVcblx0ICpcdHRvdWNocG9pbnQgbG9jYXRpb24gYXMgcmVwb3J0ZWQgYnkgd2xfdG91Y2guZG93biBvciB3bF90b3VjaC5tb3ZlLlxuXHQgKlxuXHQgKlx0VGhpcyBldmVudCBpcyBvbmx5IHNlbnQgYnkgdGhlIGNvbXBvc2l0b3IgaWYgdGhlIHRvdWNoIGRldmljZSBzdXBwb3J0c1xuXHQgKlx0c2hhcGUgcmVwb3J0cy4gVGhlIGNsaWVudCBoYXMgdG8gbWFrZSByZWFzb25hYmxlIGFzc3VtcHRpb25zIGFib3V0IHRoZVxuXHQgKlx0c2hhcGUgaWYgaXQgZGlkIG5vdCByZWNlaXZlIHRoaXMgZXZlbnQuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBpZCB0aGUgdW5pcXVlIElEIG9mIHRoaXMgdG91Y2ggcG9pbnQgXG5cdCAqIEBwYXJhbSB7Rml4ZWR9IG1ham9yIGxlbmd0aCBvZiB0aGUgbWFqb3IgYXhpcyBpbiBzdXJmYWNlLWxvY2FsIGNvb3JkaW5hdGVzIFxuXHQgKiBAcGFyYW0ge0ZpeGVkfSBtaW5vciBsZW5ndGggb2YgdGhlIG1pbm9yIGF4aXMgaW4gc3VyZmFjZS1sb2NhbCBjb29yZGluYXRlcyBcblx0ICpcblx0ICogQHNpbmNlIDZcblx0ICpcblx0ICovXG5cdHNoYXBlKGlkLCBtYWpvciwgbWlub3IpIHt9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRTZW50IHdoZW4gYSB0b3VjaHBvaW50IGhhcyBjaGFuZ2VkIGl0cyBvcmllbnRhdGlvbi5cblx0ICpcblx0ICpcdFRoaXMgZXZlbnQgZG9lcyBub3Qgb2NjdXIgb24gaXRzIG93bi4gSXQgaXMgc2VudCBiZWZvcmUgYVxuXHQgKlx0d2xfdG91Y2guZnJhbWUgZXZlbnQgYW5kIGNhcnJpZXMgdGhlIG5ldyBzaGFwZSBpbmZvcm1hdGlvbiBmb3Jcblx0ICpcdGFueSBwcmV2aW91c2x5IHJlcG9ydGVkLCBvciBuZXcgdG91Y2ggcG9pbnRzIG9mIHRoYXQgZnJhbWUuXG5cdCAqXG5cdCAqXHRPdGhlciBldmVudHMgZGVzY3JpYmluZyB0aGUgdG91Y2ggcG9pbnQgc3VjaCBhcyB3bF90b3VjaC5kb3duLFxuXHQgKlx0d2xfdG91Y2gubW90aW9uIG9yIHdsX3RvdWNoLnNoYXBlIG1heSBiZSBzZW50IHdpdGhpbiB0aGVcblx0ICpcdHNhbWUgd2xfdG91Y2guZnJhbWUuIEEgY2xpZW50IHNob3VsZCB0cmVhdCB0aGVzZSBldmVudHMgYXMgYSBzaW5nbGVcblx0ICpcdGxvZ2ljYWwgdG91Y2ggcG9pbnQgdXBkYXRlLiBUaGUgb3JkZXIgb2Ygd2xfdG91Y2guc2hhcGUsXG5cdCAqXHR3bF90b3VjaC5vcmllbnRhdGlvbiBhbmQgd2xfdG91Y2gubW90aW9uIGlzIG5vdCBndWFyYW50ZWVkLlxuXHQgKlx0QSB3bF90b3VjaC5kb3duIGV2ZW50IGlzIGd1YXJhbnRlZWQgdG8gb2NjdXIgYmVmb3JlIHRoZSBmaXJzdFxuXHQgKlx0d2xfdG91Y2gub3JpZW50YXRpb24gZXZlbnQgZm9yIHRoaXMgdG91Y2ggSUQgYnV0IGJvdGggZXZlbnRzIG1heSBvY2N1clxuXHQgKlx0d2l0aGluIHRoZSBzYW1lIHdsX3RvdWNoLmZyYW1lLlxuXHQgKlxuXHQgKlx0VGhlIG9yaWVudGF0aW9uIGRlc2NyaWJlcyB0aGUgY2xvY2t3aXNlIGFuZ2xlIG9mIGEgdG91Y2hwb2ludCdzIG1ham9yXG5cdCAqXHRheGlzIHRvIHRoZSBwb3NpdGl2ZSBzdXJmYWNlIHktYXhpcyBhbmQgaXMgbm9ybWFsaXplZCB0byB0aGUgLTE4MCB0b1xuXHQgKlx0KzE4MCBkZWdyZWUgcmFuZ2UuIFRoZSBncmFudWxhcml0eSBvZiBvcmllbnRhdGlvbiBkZXBlbmRzIG9uIHRoZSB0b3VjaFxuXHQgKlx0ZGV2aWNlLCBzb21lIGRldmljZXMgb25seSBzdXBwb3J0IGJpbmFyeSByb3RhdGlvbiB2YWx1ZXMgYmV0d2VlbiAwIGFuZFxuXHQgKlx0OTAgZGVncmVlcy5cblx0ICpcblx0ICpcdFRoaXMgZXZlbnQgaXMgb25seSBzZW50IGJ5IHRoZSBjb21wb3NpdG9yIGlmIHRoZSB0b3VjaCBkZXZpY2Ugc3VwcG9ydHNcblx0ICpcdG9yaWVudGF0aW9uIHJlcG9ydHMuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBpZCB0aGUgdW5pcXVlIElEIG9mIHRoaXMgdG91Y2ggcG9pbnQgXG5cdCAqIEBwYXJhbSB7Rml4ZWR9IG9yaWVudGF0aW9uIGFuZ2xlIGJldHdlZW4gbWFqb3IgYXhpcyBhbmQgcG9zaXRpdmUgc3VyZmFjZSB5LWF4aXMgaW4gZGVncmVlcyBcblx0ICpcblx0ICogQHNpbmNlIDZcblx0ICpcblx0ICovXG5cdG9yaWVudGF0aW9uKGlkLCBvcmllbnRhdGlvbikge31cbn1cblxuIiwiLypcbiAqXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAwOC0yMDExIEtyaXN0aWFuIEjDuGdzYmVyZ1xuICogICAgQ29weXJpZ2h0IMKpIDIwMTAtMjAxMSBJbnRlbCBDb3Jwb3JhdGlvblxuICogICAgQ29weXJpZ2h0IMKpIDIwMTItMjAxMyBDb2xsYWJvcmEsIEx0ZC5cbiAqXG4gKiAgICBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogICAgb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXNcbiAqICAgICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqICAgIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiAgICBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogICAgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqICAgIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqICAgIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIChpbmNsdWRpbmcgdGhlXG4gKiAgICBuZXh0IHBhcmFncmFwaCkgc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbFxuICogICAgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqICAgIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiAgICBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0ZcbiAqICAgIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG4gKiAgICBOT05JTkZSSU5HRU1FTlQuICBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSU1xuICogICAgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOXG4gKiAgICBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTlxuICogICAgQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuICogICAgU09GVFdBUkUuXG4gKiAgXG4gKi9cblxuaW1wb3J0IHsgQ29ubmVjdGlvbiB9IGZyb20gJ3dlc3RmaWVsZC1ydW50aW1lLWNvbW1vbidcbmNvbnN0IHsgdWludCwgdWludE9wdGlvbmFsLCBpbnQsIGludE9wdGlvbmFsLCBmaXhlZCwgXG5cdGZpeGVkT3B0aW9uYWwsIG9iamVjdCwgb2JqZWN0T3B0aW9uYWwsIG5ld09iamVjdCwgc3RyaW5nLCBcblx0c3RyaW5nT3B0aW9uYWwsIGFycmF5LCBhcnJheU9wdGlvbmFsLCBcblx0ZmlsZURlc2NyaXB0b3JPcHRpb25hbCwgZmlsZURlc2NyaXB0b3IsIFxuaCwgdSwgaSwgZiwgbywgbiwgcywgYSB9ID0gQ29ubmVjdGlvblxuaW1wb3J0IFByb3h5IGZyb20gJy4vUHJveHknXG5cbi8qKlxuICpcbiAqICAgICAgVGhlIHdsX3RvdWNoIGludGVyZmFjZSByZXByZXNlbnRzIGEgdG91Y2hzY3JlZW5cbiAqICAgICAgYXNzb2NpYXRlZCB3aXRoIGEgc2VhdC5cbiAqXG4gKiAgICAgIFRvdWNoIGludGVyYWN0aW9ucyBjYW4gY29uc2lzdCBvZiBvbmUgb3IgbW9yZSBjb250YWN0cy5cbiAqICAgICAgRm9yIGVhY2ggY29udGFjdCwgYSBzZXJpZXMgb2YgZXZlbnRzIGlzIGdlbmVyYXRlZCwgc3RhcnRpbmdcbiAqICAgICAgd2l0aCBhIGRvd24gZXZlbnQsIGZvbGxvd2VkIGJ5IHplcm8gb3IgbW9yZSBtb3Rpb24gZXZlbnRzLFxuICogICAgICBhbmQgZW5kaW5nIHdpdGggYW4gdXAgZXZlbnQuIEV2ZW50cyByZWxhdGluZyB0byB0aGUgc2FtZVxuICogICAgICBjb250YWN0IHBvaW50IGNhbiBiZSBpZGVudGlmaWVkIGJ5IHRoZSBJRCBvZiB0aGUgc2VxdWVuY2UuXG4gKiAgICBcbiAqL1xuY2xhc3MgV2xUb3VjaFByb3h5IGV4dGVuZHMgUHJveHkge1xuXG5cdC8qKlxuXHQgKiBAc2luY2UgM1xuXHQgKlxuXHQgKi9cblx0cmVsZWFzZSAoKSB7XG5cdFx0dGhpcy5kaXNwbGF5Lm1hcnNoYWxsKHRoaXMuaWQsIDAsIFtdKVxuXHR9XG5cbi8qKlxuXHQgKkBwYXJhbSB7RGlzcGxheX1kaXNwbGF5XG5cdCAqQHBhcmFtIHtudW1iZXJ9aWRcblx0ICovXG5cdGNvbnN0cnVjdG9yIChkaXNwbGF5LCBpZCkge1xuXHRcdHN1cGVyKGRpc3BsYXksIGlkKVxuXHRcdC8qKlxuXHRcdCAqIEB0eXBlIHtXbFRvdWNoRXZlbnRzfG51bGx9XG5cdFx0ICovXG5cdFx0dGhpcy5saXN0ZW5lciA9IG51bGxcblx0fVxuXG5cdGFzeW5jIFswXSAobWVzc2FnZSkge1xuXHRcdGF3YWl0IHRoaXMubGlzdGVuZXIuZG93bih1KG1lc3NhZ2UpLCB1KG1lc3NhZ2UpLCBvKG1lc3NhZ2UsIGZhbHNlLCB0aGlzLmRpc3BsYXkuY29ubmVjdGlvbiksIGkobWVzc2FnZSksIGYobWVzc2FnZSksIGYobWVzc2FnZSkpXG5cdH1cblxuXHRhc3luYyBbMV0gKG1lc3NhZ2UpIHtcblx0XHRhd2FpdCB0aGlzLmxpc3RlbmVyLnVwKHUobWVzc2FnZSksIHUobWVzc2FnZSksIGkobWVzc2FnZSkpXG5cdH1cblxuXHRhc3luYyBbMl0gKG1lc3NhZ2UpIHtcblx0XHRhd2FpdCB0aGlzLmxpc3RlbmVyLm1vdGlvbih1KG1lc3NhZ2UpLCBpKG1lc3NhZ2UpLCBmKG1lc3NhZ2UpLCBmKG1lc3NhZ2UpKVxuXHR9XG5cblx0YXN5bmMgWzNdIChtZXNzYWdlKSB7XG5cdFx0YXdhaXQgdGhpcy5saXN0ZW5lci5mcmFtZSgpXG5cdH1cblxuXHRhc3luYyBbNF0gKG1lc3NhZ2UpIHtcblx0XHRhd2FpdCB0aGlzLmxpc3RlbmVyLmNhbmNlbCgpXG5cdH1cblxuXHRhc3luYyBbNV0gKG1lc3NhZ2UpIHtcblx0XHRhd2FpdCB0aGlzLmxpc3RlbmVyLnNoYXBlKGkobWVzc2FnZSksIGYobWVzc2FnZSksIGYobWVzc2FnZSkpXG5cdH1cblxuXHRhc3luYyBbNl0gKG1lc3NhZ2UpIHtcblx0XHRhd2FpdCB0aGlzLmxpc3RlbmVyLm9yaWVudGF0aW9uKGkobWVzc2FnZSksIGYobWVzc2FnZSkpXG5cdH1cblxufVxuV2xUb3VjaFByb3h5LnByb3RvY29sTmFtZSA9ICd3bF90b3VjaCdcblxuZXhwb3J0IGRlZmF1bHQgV2xUb3VjaFByb3h5XG4iLCIvKlxuICpcbiAqICAgIENvcHlyaWdodCDCqSAyMDA4LTIwMTMgS3Jpc3RpYW4gSMO4Z3NiZXJnXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMyAgICAgIFJhZmFlbCBBbnRvZ25vbGxpXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMyAgICAgIEphc3BlciBTdC4gUGllcnJlXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMC0yMDEzIEludGVsIENvcnBvcmF0aW9uXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxNS0yMDE3IFNhbXN1bmcgRWxlY3Ryb25pY3MgQ28uLCBMdGRcbiAqICAgIENvcHlyaWdodCDCqSAyMDE1LTIwMTcgUmVkIEhhdCBJbmMuXG4gKlxuICogICAgUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbiAqICAgIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSxcbiAqICAgIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb25cbiAqICAgIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLFxuICogICAgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlXG4gKiAgICBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqICAgIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIChpbmNsdWRpbmcgdGhlIG5leHRcbiAqICAgIHBhcmFncmFwaCkgc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGVcbiAqICAgIFNvZnR3YXJlLlxuICpcbiAqICAgIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqICAgIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogICAgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gIElOIE5PIEVWRU5UIFNIQUxMXG4gKiAgICBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogICAgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkdcbiAqICAgIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVJcbiAqICAgIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqICBcbiAqL1xuXG4vKipcbiAqIEBpbnRlcmZhY2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgWGRnUG9wdXBFdmVudHMge1xuXG5cdC8qKlxuXHQgKlxuXHQgKlx0VGhpcyBldmVudCBhc2tzIHRoZSBwb3B1cCBzdXJmYWNlIHRvIGNvbmZpZ3VyZSBpdHNlbGYgZ2l2ZW4gdGhlXG5cdCAqXHRjb25maWd1cmF0aW9uLiBUaGUgY29uZmlndXJlZCBzdGF0ZSBzaG91bGQgbm90IGJlIGFwcGxpZWQgaW1tZWRpYXRlbHkuXG5cdCAqXHRTZWUgeGRnX3N1cmZhY2UuY29uZmlndXJlIGZvciBkZXRhaWxzLlxuXHQgKlxuXHQgKlx0VGhlIHggYW5kIHkgYXJndW1lbnRzIHJlcHJlc2VudCB0aGUgcG9zaXRpb24gdGhlIHBvcHVwIHdhcyBwbGFjZWQgYXRcblx0ICpcdGdpdmVuIHRoZSB4ZGdfcG9zaXRpb25lciBydWxlLCByZWxhdGl2ZSB0byB0aGUgdXBwZXIgbGVmdCBjb3JuZXIgb2YgdGhlXG5cdCAqXHR3aW5kb3cgZ2VvbWV0cnkgb2YgdGhlIHBhcmVudCBzdXJmYWNlLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0ge251bWJlcn0geCB4IHBvc2l0aW9uIHJlbGF0aXZlIHRvIHBhcmVudCBzdXJmYWNlIHdpbmRvdyBnZW9tZXRyeSBcblx0ICogQHBhcmFtIHtudW1iZXJ9IHkgeSBwb3NpdGlvbiByZWxhdGl2ZSB0byBwYXJlbnQgc3VyZmFjZSB3aW5kb3cgZ2VvbWV0cnkgXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCB3aW5kb3cgZ2VvbWV0cnkgd2lkdGggXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgd2luZG93IGdlb21ldHJ5IGhlaWdodCBcblx0ICpcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdGNvbmZpZ3VyZSh4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0VGhlIHBvcHVwX2RvbmUgZXZlbnQgaXMgc2VudCBvdXQgd2hlbiBhIHBvcHVwIGlzIGRpc21pc3NlZCBieSB0aGVcblx0ICpcdGNvbXBvc2l0b3IuIFRoZSBjbGllbnQgc2hvdWxkIGRlc3Ryb3kgdGhlIHhkZ19wb3B1cCBvYmplY3QgYXQgdGhpc1xuXHQgKlx0cG9pbnQuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRwb3B1cERvbmUoKSB7fVxufVxuXG4iLCIvKlxuICpcbiAqICAgIENvcHlyaWdodCDCqSAyMDA4LTIwMTMgS3Jpc3RpYW4gSMO4Z3NiZXJnXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMyAgICAgIFJhZmFlbCBBbnRvZ25vbGxpXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMyAgICAgIEphc3BlciBTdC4gUGllcnJlXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMC0yMDEzIEludGVsIENvcnBvcmF0aW9uXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxNS0yMDE3IFNhbXN1bmcgRWxlY3Ryb25pY3MgQ28uLCBMdGRcbiAqICAgIENvcHlyaWdodCDCqSAyMDE1LTIwMTcgUmVkIEhhdCBJbmMuXG4gKlxuICogICAgUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbiAqICAgIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSxcbiAqICAgIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb25cbiAqICAgIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLFxuICogICAgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlXG4gKiAgICBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqICAgIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIChpbmNsdWRpbmcgdGhlIG5leHRcbiAqICAgIHBhcmFncmFwaCkgc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGVcbiAqICAgIFNvZnR3YXJlLlxuICpcbiAqICAgIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqICAgIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogICAgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gIElOIE5PIEVWRU5UIFNIQUxMXG4gKiAgICBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogICAgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkdcbiAqICAgIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVJcbiAqICAgIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqICBcbiAqL1xuXG5pbXBvcnQgeyBDb25uZWN0aW9uIH0gZnJvbSAnd2VzdGZpZWxkLXJ1bnRpbWUtY29tbW9uJ1xuY29uc3QgeyB1aW50LCB1aW50T3B0aW9uYWwsIGludCwgaW50T3B0aW9uYWwsIGZpeGVkLCBcblx0Zml4ZWRPcHRpb25hbCwgb2JqZWN0LCBvYmplY3RPcHRpb25hbCwgbmV3T2JqZWN0LCBzdHJpbmcsIFxuXHRzdHJpbmdPcHRpb25hbCwgYXJyYXksIGFycmF5T3B0aW9uYWwsIFxuXHRmaWxlRGVzY3JpcHRvck9wdGlvbmFsLCBmaWxlRGVzY3JpcHRvciwgXG5oLCB1LCBpLCBmLCBvLCBuLCBzLCBhIH0gPSBDb25uZWN0aW9uXG5pbXBvcnQgUHJveHkgZnJvbSAnLi9Qcm94eSdcblxuLyoqXG4gKlxuICogICAgICBBIHBvcHVwIHN1cmZhY2UgaXMgYSBzaG9ydC1saXZlZCwgdGVtcG9yYXJ5IHN1cmZhY2UuIEl0IGNhbiBiZSB1c2VkIHRvXG4gKiAgICAgIGltcGxlbWVudCBmb3IgZXhhbXBsZSBtZW51cywgcG9wb3ZlcnMsIHRvb2x0aXBzIGFuZCBvdGhlciBzaW1pbGFyIHVzZXJcbiAqICAgICAgaW50ZXJmYWNlIGNvbmNlcHRzLlxuICpcbiAqICAgICAgQSBwb3B1cCBjYW4gYmUgbWFkZSB0byB0YWtlIGFuIGV4cGxpY2l0IGdyYWIuIFNlZSB4ZGdfcG9wdXAuZ3JhYiBmb3JcbiAqICAgICAgZGV0YWlscy5cbiAqXG4gKiAgICAgIFdoZW4gdGhlIHBvcHVwIGlzIGRpc21pc3NlZCwgYSBwb3B1cF9kb25lIGV2ZW50IHdpbGwgYmUgc2VudCBvdXQsIGFuZCBhdFxuICogICAgICB0aGUgc2FtZSB0aW1lIHRoZSBzdXJmYWNlIHdpbGwgYmUgdW5tYXBwZWQuIFNlZSB0aGUgeGRnX3BvcHVwLnBvcHVwX2RvbmVcbiAqICAgICAgZXZlbnQgZm9yIGRldGFpbHMuXG4gKlxuICogICAgICBFeHBsaWNpdGx5IGRlc3Ryb3lpbmcgdGhlIHhkZ19wb3B1cCBvYmplY3Qgd2lsbCBhbHNvIGRpc21pc3MgdGhlIHBvcHVwIGFuZFxuICogICAgICB1bm1hcCB0aGUgc3VyZmFjZS4gQ2xpZW50cyB0aGF0IHdhbnQgdG8gZGlzbWlzcyB0aGUgcG9wdXAgd2hlbiBhbm90aGVyXG4gKiAgICAgIHN1cmZhY2Ugb2YgdGhlaXIgb3duIGlzIGNsaWNrZWQgc2hvdWxkIGRpc21pc3MgdGhlIHBvcHVwIHVzaW5nIHRoZSBkZXN0cm95XG4gKiAgICAgIHJlcXVlc3QuXG4gKlxuICogICAgICBUaGUgcGFyZW50IHN1cmZhY2UgbXVzdCBoYXZlIGVpdGhlciB0aGUgeGRnX3RvcGxldmVsIG9yIHhkZ19wb3B1cCBzdXJmYWNlXG4gKiAgICAgIHJvbGUuXG4gKlxuICogICAgICBBIG5ld2x5IGNyZWF0ZWQgeGRnX3BvcHVwIHdpbGwgYmUgc3RhY2tlZCBvbiB0b3Agb2YgYWxsIHByZXZpb3VzbHkgY3JlYXRlZFxuICogICAgICB4ZGdfcG9wdXAgc3VyZmFjZXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBzYW1lIHhkZ190b3BsZXZlbC5cbiAqXG4gKiAgICAgIFRoZSBwYXJlbnQgb2YgYW4geGRnX3BvcHVwIG11c3QgYmUgbWFwcGVkIChzZWUgdGhlIHhkZ19zdXJmYWNlXG4gKiAgICAgIGRlc2NyaXB0aW9uKSBiZWZvcmUgdGhlIHhkZ19wb3B1cCBpdHNlbGYuXG4gKlxuICogICAgICBUaGUgeCBhbmQgeSBhcmd1bWVudHMgcGFzc2VkIHdoZW4gY3JlYXRpbmcgdGhlIHBvcHVwIG9iamVjdCBzcGVjaWZ5XG4gKiAgICAgIHdoZXJlIHRoZSB0b3AgbGVmdCBvZiB0aGUgcG9wdXAgc2hvdWxkIGJlIHBsYWNlZCwgcmVsYXRpdmUgdG8gdGhlXG4gKiAgICAgIGxvY2FsIHN1cmZhY2UgY29vcmRpbmF0ZXMgb2YgdGhlIHBhcmVudCBzdXJmYWNlLiBTZWVcbiAqICAgICAgeGRnX3N1cmZhY2UuZ2V0X3BvcHVwLiBBbiB4ZGdfcG9wdXAgbXVzdCBpbnRlcnNlY3Qgd2l0aCBvciBiZSBhdCBsZWFzdFxuICogICAgICBwYXJ0aWFsbHkgYWRqYWNlbnQgdG8gaXRzIHBhcmVudCBzdXJmYWNlLlxuICpcbiAqICAgICAgVGhlIGNsaWVudCBtdXN0IGNhbGwgd2xfc3VyZmFjZS5jb21taXQgb24gdGhlIGNvcnJlc3BvbmRpbmcgd2xfc3VyZmFjZVxuICogICAgICBmb3IgdGhlIHhkZ19wb3B1cCBzdGF0ZSB0byB0YWtlIGVmZmVjdC5cbiAqICAgIFxuICovXG5jbGFzcyBYZGdQb3B1cFByb3h5IGV4dGVuZHMgUHJveHkge1xuXG5cdC8qKlxuXHQgKlxuXHQgKlx0VGhpcyBkZXN0cm95cyB0aGUgcG9wdXAuIEV4cGxpY2l0bHkgZGVzdHJveWluZyB0aGUgeGRnX3BvcHVwXG5cdCAqXHRvYmplY3Qgd2lsbCBhbHNvIGRpc21pc3MgdGhlIHBvcHVwLCBhbmQgdW5tYXAgdGhlIHN1cmZhY2UuXG5cdCAqXG5cdCAqXHRJZiB0aGlzIHhkZ19wb3B1cCBpcyBub3QgdGhlIFwidG9wbW9zdFwiIHBvcHVwLCBhIHByb3RvY29sIGVycm9yXG5cdCAqXHR3aWxsIGJlIHNlbnQuXG5cdCAqICAgICAgXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRkZXN0cm95ICgpIHtcblx0XHR0aGlzLmRpc3BsYXkubWFyc2hhbGwodGhpcy5pZCwgMCwgW10pXG5cdH1cblxuXHQvKipcblx0ICpcblx0ICpcdFRoaXMgcmVxdWVzdCBtYWtlcyB0aGUgY3JlYXRlZCBwb3B1cCB0YWtlIGFuIGV4cGxpY2l0IGdyYWIuIEFuIGV4cGxpY2l0XG5cdCAqXHRncmFiIHdpbGwgYmUgZGlzbWlzc2VkIHdoZW4gdGhlIHVzZXIgZGlzbWlzc2VzIHRoZSBwb3B1cCwgb3Igd2hlbiB0aGVcblx0ICpcdGNsaWVudCBkZXN0cm95cyB0aGUgeGRnX3BvcHVwLiBUaGlzIGNhbiBiZSBkb25lIGJ5IHRoZSB1c2VyIGNsaWNraW5nXG5cdCAqXHRvdXRzaWRlIHRoZSBzdXJmYWNlLCB1c2luZyB0aGUga2V5Ym9hcmQsIG9yIGV2ZW4gbG9ja2luZyB0aGUgc2NyZWVuXG5cdCAqXHR0aHJvdWdoIGNsb3NpbmcgdGhlIGxpZCBvciBhIHRpbWVvdXQuXG5cdCAqXG5cdCAqXHRJZiB0aGUgY29tcG9zaXRvciBkZW5pZXMgdGhlIGdyYWIsIHRoZSBwb3B1cCB3aWxsIGJlIGltbWVkaWF0ZWx5XG5cdCAqXHRkaXNtaXNzZWQuXG5cdCAqXG5cdCAqXHRUaGlzIHJlcXVlc3QgbXVzdCBiZSB1c2VkIGluIHJlc3BvbnNlIHRvIHNvbWUgc29ydCBvZiB1c2VyIGFjdGlvbiBsaWtlIGFcblx0ICpcdGJ1dHRvbiBwcmVzcywga2V5IHByZXNzLCBvciB0b3VjaCBkb3duIGV2ZW50LiBUaGUgc2VyaWFsIG51bWJlciBvZiB0aGVcblx0ICpcdGV2ZW50IHNob3VsZCBiZSBwYXNzZWQgYXMgJ3NlcmlhbCcuXG5cdCAqXG5cdCAqXHRUaGUgcGFyZW50IG9mIGEgZ3JhYmJpbmcgcG9wdXAgbXVzdCBlaXRoZXIgYmUgYW4geGRnX3RvcGxldmVsIHN1cmZhY2Ugb3Jcblx0ICpcdGFub3RoZXIgeGRnX3BvcHVwIHdpdGggYW4gZXhwbGljaXQgZ3JhYi4gSWYgdGhlIHBhcmVudCBpcyBhbm90aGVyXG5cdCAqXHR4ZGdfcG9wdXAgaXQgbWVhbnMgdGhhdCB0aGUgcG9wdXBzIGFyZSBuZXN0ZWQsIHdpdGggdGhpcyBwb3B1cCBub3cgYmVpbmdcblx0ICpcdHRoZSB0b3Btb3N0IHBvcHVwLlxuXHQgKlxuXHQgKlx0TmVzdGVkIHBvcHVwcyBtdXN0IGJlIGRlc3Ryb3llZCBpbiB0aGUgcmV2ZXJzZSBvcmRlciB0aGV5IHdlcmUgY3JlYXRlZFxuXHQgKlx0aW4sIGUuZy4gdGhlIG9ubHkgcG9wdXAgeW91IGFyZSBhbGxvd2VkIHRvIGRlc3Ryb3kgYXQgYWxsIHRpbWVzIGlzIHRoZVxuXHQgKlx0dG9wbW9zdCBvbmUuXG5cdCAqXG5cdCAqXHRXaGVuIGNvbXBvc2l0b3JzIGNob29zZSB0byBkaXNtaXNzIGEgcG9wdXAsIHRoZXkgbWF5IGRpc21pc3MgZXZlcnlcblx0ICpcdG5lc3RlZCBncmFiYmluZyBwb3B1cCBhcyB3ZWxsLiBXaGVuIGEgY29tcG9zaXRvciBkaXNtaXNzZXMgcG9wdXBzLCBpdFxuXHQgKlx0d2lsbCBmb2xsb3cgdGhlIHNhbWUgZGlzbWlzc2luZyBvcmRlciBhcyByZXF1aXJlZCBmcm9tIHRoZSBjbGllbnQuXG5cdCAqXG5cdCAqXHRUaGUgcGFyZW50IG9mIGEgZ3JhYmJpbmcgcG9wdXAgbXVzdCBlaXRoZXIgYmUgYW5vdGhlciB4ZGdfcG9wdXAgd2l0aCBhblxuXHQgKlx0YWN0aXZlIGV4cGxpY2l0IGdyYWIsIG9yIGFuIHhkZ19wb3B1cCBvciB4ZGdfdG9wbGV2ZWwsIGlmIHRoZXJlIGFyZSBub1xuXHQgKlx0ZXhwbGljaXQgZ3JhYnMgYWxyZWFkeSB0YWtlbi5cblx0ICpcblx0ICpcdElmIHRoZSB0b3Btb3N0IGdyYWJiaW5nIHBvcHVwIGlzIGRlc3Ryb3llZCwgdGhlIGdyYWIgd2lsbCBiZSByZXR1cm5lZCB0b1xuXHQgKlx0dGhlIHBhcmVudCBvZiB0aGUgcG9wdXAsIGlmIHRoYXQgcGFyZW50IHByZXZpb3VzbHkgaGFkIGFuIGV4cGxpY2l0IGdyYWIuXG5cdCAqXG5cdCAqXHRJZiB0aGUgcGFyZW50IGlzIGEgZ3JhYmJpbmcgcG9wdXAgd2hpY2ggaGFzIGFscmVhZHkgYmVlbiBkaXNtaXNzZWQsIHRoaXNcblx0ICpcdHBvcHVwIHdpbGwgYmUgaW1tZWRpYXRlbHkgZGlzbWlzc2VkLiBJZiB0aGUgcGFyZW50IGlzIGEgcG9wdXAgdGhhdCBkaWRcblx0ICpcdG5vdCB0YWtlIGFuIGV4cGxpY2l0IGdyYWIsIGFuIGVycm9yIHdpbGwgYmUgcmFpc2VkLlxuXHQgKlxuXHQgKlx0RHVyaW5nIGEgcG9wdXAgZ3JhYiwgdGhlIGNsaWVudCBvd25pbmcgdGhlIGdyYWIgd2lsbCByZWNlaXZlIHBvaW50ZXJcblx0ICpcdGFuZCB0b3VjaCBldmVudHMgZm9yIGFsbCB0aGVpciBzdXJmYWNlcyBhcyBub3JtYWwgKHNpbWlsYXIgdG8gYW5cblx0ICpcdFwib3duZXItZXZlbnRzXCIgZ3JhYiBpbiBYMTEgcGFybGFuY2UpLCB3aGlsZSB0aGUgdG9wIG1vc3QgZ3JhYmJpbmcgcG9wdXBcblx0ICpcdHdpbGwgYWx3YXlzIGhhdmUga2V5Ym9hcmQgZm9jdXMuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7Kn0gc2VhdCB0aGUgd2xfc2VhdCBvZiB0aGUgdXNlciBldmVudCBcblx0ICogQHBhcmFtIHtudW1iZXJ9IHNlcmlhbCB0aGUgc2VyaWFsIG9mIHRoZSB1c2VyIGV2ZW50IFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0Z3JhYiAoc2VhdCwgc2VyaWFsKSB7XG5cdFx0dGhpcy5kaXNwbGF5Lm1hcnNoYWxsKHRoaXMuaWQsIDEsIFtvYmplY3Qoc2VhdCksIHVpbnQoc2VyaWFsKV0pXG5cdH1cblxuLyoqXG5cdCAqQHBhcmFtIHtEaXNwbGF5fWRpc3BsYXlcblx0ICpAcGFyYW0ge251bWJlcn1pZFxuXHQgKi9cblx0Y29uc3RydWN0b3IgKGRpc3BsYXksIGlkKSB7XG5cdFx0c3VwZXIoZGlzcGxheSwgaWQpXG5cdFx0LyoqXG5cdFx0ICogQHR5cGUge1hkZ1BvcHVwRXZlbnRzfG51bGx9XG5cdFx0ICovXG5cdFx0dGhpcy5saXN0ZW5lciA9IG51bGxcblx0fVxuXG5cdGFzeW5jIFswXSAobWVzc2FnZSkge1xuXHRcdGF3YWl0IHRoaXMubGlzdGVuZXIuY29uZmlndXJlKGkobWVzc2FnZSksIGkobWVzc2FnZSksIGkobWVzc2FnZSksIGkobWVzc2FnZSkpXG5cdH1cblxuXHRhc3luYyBbMV0gKG1lc3NhZ2UpIHtcblx0XHRhd2FpdCB0aGlzLmxpc3RlbmVyLnBvcHVwRG9uZSgpXG5cdH1cblxufVxuWGRnUG9wdXBQcm94eS5wcm90b2NvbE5hbWUgPSAneGRnX3BvcHVwJ1xuXG5YZGdQb3B1cFByb3h5LkVycm9yID0ge1xuICAvKipcbiAgICogdHJpZWQgdG8gZ3JhYiBhZnRlciBiZWluZyBtYXBwZWRcbiAgICovXG4gIGludmFsaWRHcmFiOiAwXG59XG5cbmV4cG9ydCBkZWZhdWx0IFhkZ1BvcHVwUHJveHlcbiIsIi8qXG4gKlxuICogICAgQ29weXJpZ2h0IMKpIDIwMDgtMjAxMyBLcmlzdGlhbiBIw7hnc2JlcmdcbiAqICAgIENvcHlyaWdodCDCqSAyMDEzICAgICAgUmFmYWVsIEFudG9nbm9sbGlcbiAqICAgIENvcHlyaWdodCDCqSAyMDEzICAgICAgSmFzcGVyIFN0LiBQaWVycmVcbiAqICAgIENvcHlyaWdodCDCqSAyMDEwLTIwMTMgSW50ZWwgQ29ycG9yYXRpb25cbiAqICAgIENvcHlyaWdodCDCqSAyMDE1LTIwMTcgU2Ftc3VuZyBFbGVjdHJvbmljcyBDby4sIEx0ZFxuICogICAgQ29weXJpZ2h0IMKpIDIwMTUtMjAxNyBSZWQgSGF0IEluYy5cbiAqXG4gKiAgICBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuICogICAgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLFxuICogICAgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvblxuICogICAgdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsXG4gKiAgICBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGVcbiAqICAgIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogICAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2UgKGluY2x1ZGluZyB0aGUgbmV4dFxuICogICAgcGFyYWdyYXBoKSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZVxuICogICAgU29mdHdhcmUuXG4gKlxuICogICAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogICAgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiAgICBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiAgSU4gTk8gRVZFTlQgU0hBTExcbiAqICAgIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiAgICBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lOR1xuICogICAgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUlxuICogICAgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICogIFxuICovXG5cbmltcG9ydCB7IENvbm5lY3Rpb24gfSBmcm9tICd3ZXN0ZmllbGQtcnVudGltZS1jb21tb24nXG5jb25zdCB7IHVpbnQsIHVpbnRPcHRpb25hbCwgaW50LCBpbnRPcHRpb25hbCwgZml4ZWQsIFxuXHRmaXhlZE9wdGlvbmFsLCBvYmplY3QsIG9iamVjdE9wdGlvbmFsLCBuZXdPYmplY3QsIHN0cmluZywgXG5cdHN0cmluZ09wdGlvbmFsLCBhcnJheSwgYXJyYXlPcHRpb25hbCwgXG5cdGZpbGVEZXNjcmlwdG9yT3B0aW9uYWwsIGZpbGVEZXNjcmlwdG9yLCBcbmgsIHUsIGksIGYsIG8sIG4sIHMsIGEgfSA9IENvbm5lY3Rpb25cbmltcG9ydCBQcm94eSBmcm9tICcuL1Byb3h5J1xuXG4vKipcbiAqXG4gKiAgICAgIFRoZSB4ZGdfcG9zaXRpb25lciBwcm92aWRlcyBhIGNvbGxlY3Rpb24gb2YgcnVsZXMgZm9yIHRoZSBwbGFjZW1lbnQgb2YgYVxuICogICAgICBjaGlsZCBzdXJmYWNlIHJlbGF0aXZlIHRvIGEgcGFyZW50IHN1cmZhY2UuIFJ1bGVzIGNhbiBiZSBkZWZpbmVkIHRvIGVuc3VyZVxuICogICAgICB0aGUgY2hpbGQgc3VyZmFjZSByZW1haW5zIHdpdGhpbiB0aGUgdmlzaWJsZSBhcmVhJ3MgYm9yZGVycywgYW5kIHRvXG4gKiAgICAgIHNwZWNpZnkgaG93IHRoZSBjaGlsZCBzdXJmYWNlIGNoYW5nZXMgaXRzIHBvc2l0aW9uLCBzdWNoIGFzIHNsaWRpbmcgYWxvbmdcbiAqICAgICAgYW4gYXhpcywgb3IgZmxpcHBpbmcgYXJvdW5kIGEgcmVjdGFuZ2xlLiBUaGVzZSBwb3NpdGlvbmVyLWNyZWF0ZWQgcnVsZXMgYXJlXG4gKiAgICAgIGNvbnN0cmFpbmVkIGJ5IHRoZSByZXF1aXJlbWVudCB0aGF0IGEgY2hpbGQgc3VyZmFjZSBtdXN0IGludGVyc2VjdCB3aXRoIG9yXG4gKiAgICAgIGJlIGF0IGxlYXN0IHBhcnRpYWxseSBhZGphY2VudCB0byBpdHMgcGFyZW50IHN1cmZhY2UuXG4gKlxuICogICAgICBTZWUgdGhlIHZhcmlvdXMgcmVxdWVzdHMgZm9yIGRldGFpbHMgYWJvdXQgcG9zc2libGUgcnVsZXMuXG4gKlxuICogICAgICBBdCB0aGUgdGltZSBvZiB0aGUgcmVxdWVzdCwgdGhlIGNvbXBvc2l0b3IgbWFrZXMgYSBjb3B5IG9mIHRoZSBydWxlc1xuICogICAgICBzcGVjaWZpZWQgYnkgdGhlIHhkZ19wb3NpdGlvbmVyLiBUaHVzLCBhZnRlciB0aGUgcmVxdWVzdCBpcyBjb21wbGV0ZSB0aGVcbiAqICAgICAgeGRnX3Bvc2l0aW9uZXIgb2JqZWN0IGNhbiBiZSBkZXN0cm95ZWQgb3IgcmV1c2VkOyBmdXJ0aGVyIGNoYW5nZXMgdG8gdGhlXG4gKiAgICAgIG9iamVjdCB3aWxsIGhhdmUgbm8gZWZmZWN0IG9uIHByZXZpb3VzIHVzYWdlcy5cbiAqXG4gKiAgICAgIEZvciBhbiB4ZGdfcG9zaXRpb25lciBvYmplY3QgdG8gYmUgY29uc2lkZXJlZCBjb21wbGV0ZSwgaXQgbXVzdCBoYXZlIGFcbiAqICAgICAgbm9uLXplcm8gc2l6ZSBzZXQgYnkgc2V0X3NpemUsIGFuZCBhIG5vbi16ZXJvIGFuY2hvciByZWN0YW5nbGUgc2V0IGJ5XG4gKiAgICAgIHNldF9hbmNob3JfcmVjdC4gUGFzc2luZyBhbiBpbmNvbXBsZXRlIHhkZ19wb3NpdGlvbmVyIG9iamVjdCB3aGVuXG4gKiAgICAgIHBvc2l0aW9uaW5nIGEgc3VyZmFjZSByYWlzZXMgYW4gZXJyb3IuXG4gKiAgICBcbiAqL1xuY2xhc3MgWGRnUG9zaXRpb25lclByb3h5IGV4dGVuZHMgUHJveHkge1xuXG5cdC8qKlxuXHQgKlxuXHQgKlx0Tm90aWZ5IHRoZSBjb21wb3NpdG9yIHRoYXQgdGhlIHhkZ19wb3NpdGlvbmVyIHdpbGwgbm8gbG9uZ2VyIGJlIHVzZWQuXG5cdCAqICAgICAgXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRkZXN0cm95ICgpIHtcblx0XHR0aGlzLmRpc3BsYXkubWFyc2hhbGwodGhpcy5pZCwgMCwgW10pXG5cdH1cblxuXHQvKipcblx0ICpcblx0ICpcdFNldCB0aGUgc2l6ZSBvZiB0aGUgc3VyZmFjZSB0aGF0IGlzIHRvIGJlIHBvc2l0aW9uZWQgd2l0aCB0aGUgcG9zaXRpb25lclxuXHQgKlx0b2JqZWN0LiBUaGUgc2l6ZSBpcyBpbiBzdXJmYWNlLWxvY2FsIGNvb3JkaW5hdGVzIGFuZCBjb3JyZXNwb25kcyB0byB0aGVcblx0ICpcdHdpbmRvdyBnZW9tZXRyeS4gU2VlIHhkZ19zdXJmYWNlLnNldF93aW5kb3dfZ2VvbWV0cnkuXG5cdCAqXG5cdCAqXHRJZiBhIHplcm8gb3IgbmVnYXRpdmUgc2l6ZSBpcyBzZXQgdGhlIGludmFsaWRfaW5wdXQgZXJyb3IgaXMgcmFpc2VkLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggd2lkdGggb2YgcG9zaXRpb25lZCByZWN0YW5nbGUgXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgaGVpZ2h0IG9mIHBvc2l0aW9uZWQgcmVjdGFuZ2xlIFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0c2V0U2l6ZSAod2lkdGgsIGhlaWdodCkge1xuXHRcdHRoaXMuZGlzcGxheS5tYXJzaGFsbCh0aGlzLmlkLCAxLCBbaW50KHdpZHRoKSwgaW50KGhlaWdodCldKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRTcGVjaWZ5IHRoZSBhbmNob3IgcmVjdGFuZ2xlIHdpdGhpbiB0aGUgcGFyZW50IHN1cmZhY2UgdGhhdCB0aGUgY2hpbGRcblx0ICpcdHN1cmZhY2Ugd2lsbCBiZSBwbGFjZWQgcmVsYXRpdmUgdG8uIFRoZSByZWN0YW5nbGUgaXMgcmVsYXRpdmUgdG8gdGhlXG5cdCAqXHR3aW5kb3cgZ2VvbWV0cnkgYXMgZGVmaW5lZCBieSB4ZGdfc3VyZmFjZS5zZXRfd2luZG93X2dlb21ldHJ5IG9mIHRoZVxuXHQgKlx0cGFyZW50IHN1cmZhY2UuXG5cdCAqXG5cdCAqXHRXaGVuIHRoZSB4ZGdfcG9zaXRpb25lciBvYmplY3QgaXMgdXNlZCB0byBwb3NpdGlvbiBhIGNoaWxkIHN1cmZhY2UsIHRoZVxuXHQgKlx0YW5jaG9yIHJlY3RhbmdsZSBtYXkgbm90IGV4dGVuZCBvdXRzaWRlIHRoZSB3aW5kb3cgZ2VvbWV0cnkgb2YgdGhlXG5cdCAqXHRwb3NpdGlvbmVkIGNoaWxkJ3MgcGFyZW50IHN1cmZhY2UuXG5cdCAqXG5cdCAqXHRJZiBhIG5lZ2F0aXZlIHNpemUgaXMgc2V0IHRoZSBpbnZhbGlkX2lucHV0IGVycm9yIGlzIHJhaXNlZC5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHtudW1iZXJ9IHggeCBwb3NpdGlvbiBvZiBhbmNob3IgcmVjdGFuZ2xlIFxuXHQgKiBAcGFyYW0ge251bWJlcn0geSB5IHBvc2l0aW9uIG9mIGFuY2hvciByZWN0YW5nbGUgXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCB3aWR0aCBvZiBhbmNob3IgcmVjdGFuZ2xlIFxuXHQgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IGhlaWdodCBvZiBhbmNob3IgcmVjdGFuZ2xlIFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0c2V0QW5jaG9yUmVjdCAoeCwgeSwgd2lkdGgsIGhlaWdodCkge1xuXHRcdHRoaXMuZGlzcGxheS5tYXJzaGFsbCh0aGlzLmlkLCAyLCBbaW50KHgpLCBpbnQoeSksIGludCh3aWR0aCksIGludChoZWlnaHQpXSlcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0RGVmaW5lcyB0aGUgYW5jaG9yIHBvaW50IGZvciB0aGUgYW5jaG9yIHJlY3RhbmdsZS4gVGhlIHNwZWNpZmllZCBhbmNob3Jcblx0ICpcdGlzIHVzZWQgZGVyaXZlIGFuIGFuY2hvciBwb2ludCB0aGF0IHRoZSBjaGlsZCBzdXJmYWNlIHdpbGwgYmVcblx0ICpcdHBvc2l0aW9uZWQgcmVsYXRpdmUgdG8uIElmIGEgY29ybmVyIGFuY2hvciBpcyBzZXQgKGUuZy4gJ3RvcF9sZWZ0JyBvclxuXHQgKlx0J2JvdHRvbV9yaWdodCcpLCB0aGUgYW5jaG9yIHBvaW50IHdpbGwgYmUgYXQgdGhlIHNwZWNpZmllZCBjb3JuZXI7XG5cdCAqXHRvdGhlcndpc2UsIHRoZSBkZXJpdmVkIGFuY2hvciBwb2ludCB3aWxsIGJlIGNlbnRlcmVkIG9uIHRoZSBzcGVjaWZpZWRcblx0ICpcdGVkZ2UsIG9yIGluIHRoZSBjZW50ZXIgb2YgdGhlIGFuY2hvciByZWN0YW5nbGUgaWYgbm8gZWRnZSBpcyBzcGVjaWZpZWQuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBhbmNob3IgYW5jaG9yIFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0c2V0QW5jaG9yIChhbmNob3IpIHtcblx0XHR0aGlzLmRpc3BsYXkubWFyc2hhbGwodGhpcy5pZCwgMywgW3VpbnQoYW5jaG9yKV0pXG5cdH1cblxuXHQvKipcblx0ICpcblx0ICpcdERlZmluZXMgaW4gd2hhdCBkaXJlY3Rpb24gYSBzdXJmYWNlIHNob3VsZCBiZSBwb3NpdGlvbmVkLCByZWxhdGl2ZSB0b1xuXHQgKlx0dGhlIGFuY2hvciBwb2ludCBvZiB0aGUgcGFyZW50IHN1cmZhY2UuIElmIGEgY29ybmVyIGdyYXZpdHkgaXNcblx0ICpcdHNwZWNpZmllZCAoZS5nLiAnYm90dG9tX3JpZ2h0JyBvciAndG9wX2xlZnQnKSwgdGhlbiB0aGUgY2hpbGQgc3VyZmFjZVxuXHQgKlx0d2lsbCBiZSBwbGFjZWQgdG93YXJkcyB0aGUgc3BlY2lmaWVkIGdyYXZpdHk7IG90aGVyd2lzZSwgdGhlIGNoaWxkXG5cdCAqXHRzdXJmYWNlIHdpbGwgYmUgY2VudGVyZWQgb3ZlciB0aGUgYW5jaG9yIHBvaW50IG9uIGFueSBheGlzIHRoYXQgaGFkIG5vXG5cdCAqXHRncmF2aXR5IHNwZWNpZmllZC5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHtudW1iZXJ9IGdyYXZpdHkgZ3Jhdml0eSBkaXJlY3Rpb24gXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRzZXRHcmF2aXR5IChncmF2aXR5KSB7XG5cdFx0dGhpcy5kaXNwbGF5Lm1hcnNoYWxsKHRoaXMuaWQsIDQsIFt1aW50KGdyYXZpdHkpXSlcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0U3BlY2lmeSBob3cgdGhlIHdpbmRvdyBzaG91bGQgYmUgcG9zaXRpb25lZCBpZiB0aGUgb3JpZ2luYWxseSBpbnRlbmRlZFxuXHQgKlx0cG9zaXRpb24gY2F1c2VkIHRoZSBzdXJmYWNlIHRvIGJlIGNvbnN0cmFpbmVkLCBtZWFuaW5nIGF0IGxlYXN0XG5cdCAqXHRwYXJ0aWFsbHkgb3V0c2lkZSBwb3NpdGlvbmluZyBib3VuZGFyaWVzIHNldCBieSB0aGUgY29tcG9zaXRvci4gVGhlXG5cdCAqXHRhZGp1c3RtZW50IGlzIHNldCBieSBjb25zdHJ1Y3RpbmcgYSBiaXRtYXNrIGRlc2NyaWJpbmcgdGhlIGFkanVzdG1lbnQgdG9cblx0ICpcdGJlIG1hZGUgd2hlbiB0aGUgc3VyZmFjZSBpcyBjb25zdHJhaW5lZCBvbiB0aGF0IGF4aXMuXG5cdCAqXG5cdCAqXHRJZiBubyBiaXQgZm9yIG9uZSBheGlzIGlzIHNldCwgdGhlIGNvbXBvc2l0b3Igd2lsbCBhc3N1bWUgdGhhdCB0aGUgY2hpbGRcblx0ICpcdHN1cmZhY2Ugc2hvdWxkIG5vdCBjaGFuZ2UgaXRzIHBvc2l0aW9uIG9uIHRoYXQgYXhpcyB3aGVuIGNvbnN0cmFpbmVkLlxuXHQgKlxuXHQgKlx0SWYgbW9yZSB0aGFuIG9uZSBiaXQgZm9yIG9uZSBheGlzIGlzIHNldCwgdGhlIG9yZGVyIG9mIGhvdyBhZGp1c3RtZW50c1xuXHQgKlx0YXJlIGFwcGxpZWQgaXMgc3BlY2lmaWVkIGluIHRoZSBjb3JyZXNwb25kaW5nIGFkanVzdG1lbnQgZGVzY3JpcHRpb25zLlxuXHQgKlxuXHQgKlx0VGhlIGRlZmF1bHQgYWRqdXN0bWVudCBpcyBub25lLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0ge251bWJlcn0gY29uc3RyYWludEFkanVzdG1lbnQgYml0IG1hc2sgb2YgY29uc3RyYWludCBhZGp1c3RtZW50cyBcblx0ICpcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdHNldENvbnN0cmFpbnRBZGp1c3RtZW50IChjb25zdHJhaW50QWRqdXN0bWVudCkge1xuXHRcdHRoaXMuZGlzcGxheS5tYXJzaGFsbCh0aGlzLmlkLCA1LCBbdWludChjb25zdHJhaW50QWRqdXN0bWVudCldKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRTcGVjaWZ5IHRoZSBzdXJmYWNlIHBvc2l0aW9uIG9mZnNldCByZWxhdGl2ZSB0byB0aGUgcG9zaXRpb24gb2YgdGhlXG5cdCAqXHRhbmNob3Igb24gdGhlIGFuY2hvciByZWN0YW5nbGUgYW5kIHRoZSBhbmNob3Igb24gdGhlIHN1cmZhY2UuIEZvclxuXHQgKlx0ZXhhbXBsZSBpZiB0aGUgYW5jaG9yIG9mIHRoZSBhbmNob3IgcmVjdGFuZ2xlIGlzIGF0ICh4LCB5KSwgdGhlIHN1cmZhY2Vcblx0ICpcdGhhcyB0aGUgZ3Jhdml0eSBib3R0b218cmlnaHQsIGFuZCB0aGUgb2Zmc2V0IGlzIChveCwgb3kpLCB0aGUgY2FsY3VsYXRlZFxuXHQgKlx0c3VyZmFjZSBwb3NpdGlvbiB3aWxsIGJlICh4ICsgb3gsIHkgKyBveSkuIFRoZSBvZmZzZXQgcG9zaXRpb24gb2YgdGhlXG5cdCAqXHRzdXJmYWNlIGlzIHRoZSBvbmUgdXNlZCBmb3IgY29uc3RyYWludCB0ZXN0aW5nLiBTZWVcblx0ICpcdHNldF9jb25zdHJhaW50X2FkanVzdG1lbnQuXG5cdCAqXG5cdCAqXHRBbiBleGFtcGxlIHVzZSBjYXNlIGlzIHBsYWNpbmcgYSBwb3B1cCBtZW51IG9uIHRvcCBvZiBhIHVzZXIgaW50ZXJmYWNlXG5cdCAqXHRlbGVtZW50LCB3aGlsZSBhbGlnbmluZyB0aGUgdXNlciBpbnRlcmZhY2UgZWxlbWVudCBvZiB0aGUgcGFyZW50IHN1cmZhY2Vcblx0ICpcdHdpdGggc29tZSB1c2VyIGludGVyZmFjZSBlbGVtZW50IHBsYWNlZCBzb21ld2hlcmUgaW4gdGhlIHBvcHVwIHN1cmZhY2UuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB4IHN1cmZhY2UgcG9zaXRpb24geCBvZmZzZXQgXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB5IHN1cmZhY2UgcG9zaXRpb24geSBvZmZzZXQgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRzZXRPZmZzZXQgKHgsIHkpIHtcblx0XHR0aGlzLmRpc3BsYXkubWFyc2hhbGwodGhpcy5pZCwgNiwgW2ludCh4KSwgaW50KHkpXSlcblx0fVxuXG4vKipcblx0ICpAcGFyYW0ge0Rpc3BsYXl9ZGlzcGxheVxuXHQgKkBwYXJhbSB7bnVtYmVyfWlkXG5cdCAqL1xuXHRjb25zdHJ1Y3RvciAoZGlzcGxheSwgaWQpIHtcblx0XHRzdXBlcihkaXNwbGF5LCBpZClcblx0XHQvKipcblx0XHQgKiBAdHlwZSB7WGRnUG9zaXRpb25lckV2ZW50c3xudWxsfVxuXHRcdCAqL1xuXHRcdHRoaXMubGlzdGVuZXIgPSBudWxsXG5cdH1cblxufVxuWGRnUG9zaXRpb25lclByb3h5LnByb3RvY29sTmFtZSA9ICd4ZGdfcG9zaXRpb25lcidcblxuWGRnUG9zaXRpb25lclByb3h5LkVycm9yID0ge1xuICAvKipcbiAgICogaW52YWxpZCBpbnB1dCBwcm92aWRlZFxuICAgKi9cbiAgaW52YWxpZElucHV0OiAwXG59XG5cblhkZ1Bvc2l0aW9uZXJQcm94eS5BbmNob3IgPSB7XG4gIC8qKlxuICAgKiBcbiAgICovXG4gIG5vbmU6IDAsXG4gIC8qKlxuICAgKiBcbiAgICovXG4gIHRvcDogMSxcbiAgLyoqXG4gICAqIFxuICAgKi9cbiAgYm90dG9tOiAyLFxuICAvKipcbiAgICogXG4gICAqL1xuICBsZWZ0OiAzLFxuICAvKipcbiAgICogXG4gICAqL1xuICByaWdodDogNCxcbiAgLyoqXG4gICAqIFxuICAgKi9cbiAgdG9wTGVmdDogNSxcbiAgLyoqXG4gICAqIFxuICAgKi9cbiAgYm90dG9tTGVmdDogNixcbiAgLyoqXG4gICAqIFxuICAgKi9cbiAgdG9wUmlnaHQ6IDcsXG4gIC8qKlxuICAgKiBcbiAgICovXG4gIGJvdHRvbVJpZ2h0OiA4XG59XG5cblhkZ1Bvc2l0aW9uZXJQcm94eS5HcmF2aXR5ID0ge1xuICAvKipcbiAgICogXG4gICAqL1xuICBub25lOiAwLFxuICAvKipcbiAgICogXG4gICAqL1xuICB0b3A6IDEsXG4gIC8qKlxuICAgKiBcbiAgICovXG4gIGJvdHRvbTogMixcbiAgLyoqXG4gICAqIFxuICAgKi9cbiAgbGVmdDogMyxcbiAgLyoqXG4gICAqIFxuICAgKi9cbiAgcmlnaHQ6IDQsXG4gIC8qKlxuICAgKiBcbiAgICovXG4gIHRvcExlZnQ6IDUsXG4gIC8qKlxuICAgKiBcbiAgICovXG4gIGJvdHRvbUxlZnQ6IDYsXG4gIC8qKlxuICAgKiBcbiAgICovXG4gIHRvcFJpZ2h0OiA3LFxuICAvKipcbiAgICogXG4gICAqL1xuICBib3R0b21SaWdodDogOFxufVxuXG5YZGdQb3NpdGlvbmVyUHJveHkuQ29uc3RyYWludEFkanVzdG1lbnQgPSB7XG4gIC8qKlxuICAgKiBcbiAgICovXG4gIG5vbmU6IDAsXG4gIC8qKlxuICAgKiBcbiAgICovXG4gIHNsaWRlWDogMSxcbiAgLyoqXG4gICAqIFxuICAgKi9cbiAgc2xpZGVZOiAyLFxuICAvKipcbiAgICogXG4gICAqL1xuICBmbGlwWDogNCxcbiAgLyoqXG4gICAqIFxuICAgKi9cbiAgZmxpcFk6IDgsXG4gIC8qKlxuICAgKiBcbiAgICovXG4gIHJlc2l6ZVg6IDE2LFxuICAvKipcbiAgICogXG4gICAqL1xuICByZXNpemVZOiAzMlxufVxuXG5leHBvcnQgZGVmYXVsdCBYZGdQb3NpdGlvbmVyUHJveHlcbiIsIi8qXG4gKlxuICogICAgQ29weXJpZ2h0IMKpIDIwMDgtMjAxMyBLcmlzdGlhbiBIw7hnc2JlcmdcbiAqICAgIENvcHlyaWdodCDCqSAyMDEzICAgICAgUmFmYWVsIEFudG9nbm9sbGlcbiAqICAgIENvcHlyaWdodCDCqSAyMDEzICAgICAgSmFzcGVyIFN0LiBQaWVycmVcbiAqICAgIENvcHlyaWdodCDCqSAyMDEwLTIwMTMgSW50ZWwgQ29ycG9yYXRpb25cbiAqICAgIENvcHlyaWdodCDCqSAyMDE1LTIwMTcgU2Ftc3VuZyBFbGVjdHJvbmljcyBDby4sIEx0ZFxuICogICAgQ29weXJpZ2h0IMKpIDIwMTUtMjAxNyBSZWQgSGF0IEluYy5cbiAqXG4gKiAgICBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuICogICAgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLFxuICogICAgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvblxuICogICAgdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsXG4gKiAgICBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGVcbiAqICAgIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogICAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2UgKGluY2x1ZGluZyB0aGUgbmV4dFxuICogICAgcGFyYWdyYXBoKSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZVxuICogICAgU29mdHdhcmUuXG4gKlxuICogICAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogICAgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiAgICBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiAgSU4gTk8gRVZFTlQgU0hBTExcbiAqICAgIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiAgICBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lOR1xuICogICAgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUlxuICogICAgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICogIFxuICovXG5cbi8qKlxuICogQGludGVyZmFjZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBYZGdTdXJmYWNlRXZlbnRzIHtcblxuXHQvKipcblx0ICpcblx0ICpcdFRoZSBjb25maWd1cmUgZXZlbnQgbWFya3MgdGhlIGVuZCBvZiBhIGNvbmZpZ3VyZSBzZXF1ZW5jZS4gQSBjb25maWd1cmVcblx0ICpcdHNlcXVlbmNlIGlzIGEgc2V0IG9mIG9uZSBvciBtb3JlIGV2ZW50cyBjb25maWd1cmluZyB0aGUgc3RhdGUgb2YgdGhlXG5cdCAqXHR4ZGdfc3VyZmFjZSwgaW5jbHVkaW5nIHRoZSBmaW5hbCB4ZGdfc3VyZmFjZS5jb25maWd1cmUgZXZlbnQuXG5cdCAqXG5cdCAqXHRXaGVyZSBhcHBsaWNhYmxlLCB4ZGdfc3VyZmFjZSBzdXJmYWNlIHJvbGVzIHdpbGwgZHVyaW5nIGEgY29uZmlndXJlXG5cdCAqXHRzZXF1ZW5jZSBleHRlbmQgdGhpcyBldmVudCBhcyBhIGxhdGNoZWQgc3RhdGUgc2VudCBhcyBldmVudHMgYmVmb3JlIHRoZVxuXHQgKlx0eGRnX3N1cmZhY2UuY29uZmlndXJlIGV2ZW50LiBTdWNoIGV2ZW50cyBzaG91bGQgYmUgY29uc2lkZXJlZCB0byBtYWtlIHVwXG5cdCAqXHRhIHNldCBvZiBhdG9taWNhbGx5IGFwcGxpZWQgY29uZmlndXJhdGlvbiBzdGF0ZXMsIHdoZXJlIHRoZVxuXHQgKlx0eGRnX3N1cmZhY2UuY29uZmlndXJlIGNvbW1pdHMgdGhlIGFjY3VtdWxhdGVkIHN0YXRlLlxuXHQgKlxuXHQgKlx0Q2xpZW50cyBzaG91bGQgYXJyYW5nZSB0aGVpciBzdXJmYWNlIGZvciB0aGUgbmV3IHN0YXRlcywgYW5kIHRoZW4gc2VuZFxuXHQgKlx0YW4gYWNrX2NvbmZpZ3VyZSByZXF1ZXN0IHdpdGggdGhlIHNlcmlhbCBzZW50IGluIHRoaXMgY29uZmlndXJlIGV2ZW50IGF0XG5cdCAqXHRzb21lIHBvaW50IGJlZm9yZSBjb21taXR0aW5nIHRoZSBuZXcgc3VyZmFjZS5cblx0ICpcblx0ICpcdElmIHRoZSBjbGllbnQgcmVjZWl2ZXMgbXVsdGlwbGUgY29uZmlndXJlIGV2ZW50cyBiZWZvcmUgaXQgY2FuIHJlc3BvbmRcblx0ICpcdHRvIG9uZSwgaXQgaXMgZnJlZSB0byBkaXNjYXJkIGFsbCBidXQgdGhlIGxhc3QgZXZlbnQgaXQgcmVjZWl2ZWQuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBzZXJpYWwgc2VyaWFsIG9mIHRoZSBjb25maWd1cmUgZXZlbnQgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRjb25maWd1cmUoc2VyaWFsKSB7fVxufVxuXG4iLCIvKlxuICpcbiAqICAgIENvcHlyaWdodCDCqSAyMDA4LTIwMTMgS3Jpc3RpYW4gSMO4Z3NiZXJnXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMyAgICAgIFJhZmFlbCBBbnRvZ25vbGxpXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMyAgICAgIEphc3BlciBTdC4gUGllcnJlXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMC0yMDEzIEludGVsIENvcnBvcmF0aW9uXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxNS0yMDE3IFNhbXN1bmcgRWxlY3Ryb25pY3MgQ28uLCBMdGRcbiAqICAgIENvcHlyaWdodCDCqSAyMDE1LTIwMTcgUmVkIEhhdCBJbmMuXG4gKlxuICogICAgUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbiAqICAgIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSxcbiAqICAgIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb25cbiAqICAgIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLFxuICogICAgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlXG4gKiAgICBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqICAgIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIChpbmNsdWRpbmcgdGhlIG5leHRcbiAqICAgIHBhcmFncmFwaCkgc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGVcbiAqICAgIFNvZnR3YXJlLlxuICpcbiAqICAgIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqICAgIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogICAgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gIElOIE5PIEVWRU5UIFNIQUxMXG4gKiAgICBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogICAgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkdcbiAqICAgIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVJcbiAqICAgIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqICBcbiAqL1xuXG5pbXBvcnQgeyBDb25uZWN0aW9uIH0gZnJvbSAnd2VzdGZpZWxkLXJ1bnRpbWUtY29tbW9uJ1xuY29uc3QgeyB1aW50LCB1aW50T3B0aW9uYWwsIGludCwgaW50T3B0aW9uYWwsIGZpeGVkLCBcblx0Zml4ZWRPcHRpb25hbCwgb2JqZWN0LCBvYmplY3RPcHRpb25hbCwgbmV3T2JqZWN0LCBzdHJpbmcsIFxuXHRzdHJpbmdPcHRpb25hbCwgYXJyYXksIGFycmF5T3B0aW9uYWwsIFxuXHRmaWxlRGVzY3JpcHRvck9wdGlvbmFsLCBmaWxlRGVzY3JpcHRvciwgXG5oLCB1LCBpLCBmLCBvLCBuLCBzLCBhIH0gPSBDb25uZWN0aW9uXG5pbXBvcnQgUHJveHkgZnJvbSAnLi9Qcm94eSdcbmltcG9ydCBYZGdUb3BsZXZlbFByb3h5IGZyb20gJy4vWGRnVG9wbGV2ZWxQcm94eSdcbmltcG9ydCBYZGdQb3B1cFByb3h5IGZyb20gJy4vWGRnUG9wdXBQcm94eSdcblxuLyoqXG4gKlxuICogICAgICBBbiBpbnRlcmZhY2UgdGhhdCBtYXkgYmUgaW1wbGVtZW50ZWQgYnkgYSB3bF9zdXJmYWNlLCBmb3JcbiAqICAgICAgaW1wbGVtZW50YXRpb25zIHRoYXQgcHJvdmlkZSBhIGRlc2t0b3Atc3R5bGUgdXNlciBpbnRlcmZhY2UuXG4gKlxuICogICAgICBJdCBwcm92aWRlcyBhIGJhc2Ugc2V0IG9mIGZ1bmN0aW9uYWxpdHkgcmVxdWlyZWQgdG8gY29uc3RydWN0IHVzZXJcbiAqICAgICAgaW50ZXJmYWNlIGVsZW1lbnRzIHJlcXVpcmluZyBtYW5hZ2VtZW50IGJ5IHRoZSBjb21wb3NpdG9yLCBzdWNoIGFzXG4gKiAgICAgIHRvcGxldmVsIHdpbmRvd3MsIG1lbnVzLCBldGMuIFRoZSB0eXBlcyBvZiBmdW5jdGlvbmFsaXR5IGFyZSBzcGxpdCBpbnRvXG4gKiAgICAgIHhkZ19zdXJmYWNlIHJvbGVzLlxuICpcbiAqICAgICAgQ3JlYXRpbmcgYW4geGRnX3N1cmZhY2UgZG9lcyBub3Qgc2V0IHRoZSByb2xlIGZvciBhIHdsX3N1cmZhY2UuIEluIG9yZGVyXG4gKiAgICAgIHRvIG1hcCBhbiB4ZGdfc3VyZmFjZSwgdGhlIGNsaWVudCBtdXN0IGNyZWF0ZSBhIHJvbGUtc3BlY2lmaWMgb2JqZWN0XG4gKiAgICAgIHVzaW5nLCBlLmcuLCBnZXRfdG9wbGV2ZWwsIGdldF9wb3B1cC4gVGhlIHdsX3N1cmZhY2UgZm9yIGFueSBnaXZlblxuICogICAgICB4ZGdfc3VyZmFjZSBjYW4gaGF2ZSBhdCBtb3N0IG9uZSByb2xlLCBhbmQgbWF5IG5vdCBiZSBhc3NpZ25lZCBhbnkgcm9sZVxuICogICAgICBub3QgYmFzZWQgb24geGRnX3N1cmZhY2UuXG4gKlxuICogICAgICBBIHJvbGUgbXVzdCBiZSBhc3NpZ25lZCBiZWZvcmUgYW55IG90aGVyIHJlcXVlc3RzIGFyZSBtYWRlIHRvIHRoZVxuICogICAgICB4ZGdfc3VyZmFjZSBvYmplY3QuXG4gKlxuICogICAgICBUaGUgY2xpZW50IG11c3QgY2FsbCB3bF9zdXJmYWNlLmNvbW1pdCBvbiB0aGUgY29ycmVzcG9uZGluZyB3bF9zdXJmYWNlXG4gKiAgICAgIGZvciB0aGUgeGRnX3N1cmZhY2Ugc3RhdGUgdG8gdGFrZSBlZmZlY3QuXG4gKlxuICogICAgICBDcmVhdGluZyBhbiB4ZGdfc3VyZmFjZSBmcm9tIGEgd2xfc3VyZmFjZSB3aGljaCBoYXMgYSBidWZmZXIgYXR0YWNoZWQgb3JcbiAqICAgICAgY29tbWl0dGVkIGlzIGEgY2xpZW50IGVycm9yLCBhbmQgYW55IGF0dGVtcHRzIGJ5IGEgY2xpZW50IHRvIGF0dGFjaCBvclxuICogICAgICBtYW5pcHVsYXRlIGEgYnVmZmVyIHByaW9yIHRvIHRoZSBmaXJzdCB4ZGdfc3VyZmFjZS5jb25maWd1cmUgY2FsbCBtdXN0XG4gKiAgICAgIGFsc28gYmUgdHJlYXRlZCBhcyBlcnJvcnMuXG4gKlxuICogICAgICBNYXBwaW5nIGFuIHhkZ19zdXJmYWNlLWJhc2VkIHJvbGUgc3VyZmFjZSBpcyBkZWZpbmVkIGFzIG1ha2luZyBpdFxuICogICAgICBwb3NzaWJsZSBmb3IgdGhlIHN1cmZhY2UgdG8gYmUgc2hvd24gYnkgdGhlIGNvbXBvc2l0b3IuIE5vdGUgdGhhdFxuICogICAgICBhIG1hcHBlZCBzdXJmYWNlIGlzIG5vdCBndWFyYW50ZWVkIHRvIGJlIHZpc2libGUgb25jZSBpdCBpcyBtYXBwZWQuXG4gKlxuICogICAgICBGb3IgYW4geGRnX3N1cmZhY2UgdG8gYmUgbWFwcGVkIGJ5IHRoZSBjb21wb3NpdG9yLCB0aGUgZm9sbG93aW5nXG4gKiAgICAgIGNvbmRpdGlvbnMgbXVzdCBiZSBtZXQ6XG4gKiAgICAgICgxKSB0aGUgY2xpZW50IGhhcyBhc3NpZ25lZCBhbiB4ZGdfc3VyZmFjZS1iYXNlZCByb2xlIHRvIHRoZSBzdXJmYWNlXG4gKiAgICAgICgyKSB0aGUgY2xpZW50IGhhcyBzZXQgYW5kIGNvbW1pdHRlZCB0aGUgeGRnX3N1cmZhY2Ugc3RhdGUgYW5kIHRoZVxuICpcdCAgcm9sZS1kZXBlbmRlbnQgc3RhdGUgdG8gdGhlIHN1cmZhY2VcbiAqICAgICAgKDMpIHRoZSBjbGllbnQgaGFzIGNvbW1pdHRlZCBhIGJ1ZmZlciB0byB0aGUgc3VyZmFjZVxuICpcbiAqICAgICAgQSBuZXdseS11bm1hcHBlZCBzdXJmYWNlIGlzIGNvbnNpZGVyZWQgdG8gaGF2ZSBtZXQgY29uZGl0aW9uICgxKSBvdXRcbiAqICAgICAgb2YgdGhlIDMgcmVxdWlyZWQgY29uZGl0aW9ucyBmb3IgbWFwcGluZyBhIHN1cmZhY2UgaWYgaXRzIHJvbGUgc3VyZmFjZVxuICogICAgICBoYXMgbm90IGJlZW4gZGVzdHJveWVkLlxuICogICAgXG4gKi9cbmNsYXNzIFhkZ1N1cmZhY2VQcm94eSBleHRlbmRzIFByb3h5IHtcblxuXHQvKipcblx0ICpcblx0ICpcdERlc3Ryb3kgdGhlIHhkZ19zdXJmYWNlIG9iamVjdC4gQW4geGRnX3N1cmZhY2UgbXVzdCBvbmx5IGJlIGRlc3Ryb3llZFxuXHQgKlx0YWZ0ZXIgaXRzIHJvbGUgb2JqZWN0IGhhcyBiZWVuIGRlc3Ryb3llZC5cblx0ICogICAgICBcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdGRlc3Ryb3kgKCkge1xuXHRcdHRoaXMuZGlzcGxheS5tYXJzaGFsbCh0aGlzLmlkLCAwLCBbXSlcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0VGhpcyBjcmVhdGVzIGFuIHhkZ190b3BsZXZlbCBvYmplY3QgZm9yIHRoZSBnaXZlbiB4ZGdfc3VyZmFjZSBhbmQgZ2l2ZXNcblx0ICpcdHRoZSBhc3NvY2lhdGVkIHdsX3N1cmZhY2UgdGhlIHhkZ190b3BsZXZlbCByb2xlLlxuXHQgKlxuXHQgKlx0U2VlIHRoZSBkb2N1bWVudGF0aW9uIG9mIHhkZ190b3BsZXZlbCBmb3IgbW9yZSBkZXRhaWxzIGFib3V0IHdoYXQgYW5cblx0ICpcdHhkZ190b3BsZXZlbCBpcyBhbmQgaG93IGl0IGlzIHVzZWQuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEByZXR1cm4ge1hkZ1RvcGxldmVsUHJveHl9ICBcblx0ICpcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdGdldFRvcGxldmVsICgpIHtcblx0XHRyZXR1cm4gdGhpcy5kaXNwbGF5Lm1hcnNoYWxsQ29uc3RydWN0b3IodGhpcy5pZCwgMSwgWGRnVG9wbGV2ZWxQcm94eSwgW25ld09iamVjdCgpXSlcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0VGhpcyBjcmVhdGVzIGFuIHhkZ19wb3B1cCBvYmplY3QgZm9yIHRoZSBnaXZlbiB4ZGdfc3VyZmFjZSBhbmQgZ2l2ZXNcblx0ICpcdHRoZSBhc3NvY2lhdGVkIHdsX3N1cmZhY2UgdGhlIHhkZ19wb3B1cCByb2xlLlxuXHQgKlxuXHQgKlx0SWYgbnVsbCBpcyBwYXNzZWQgYXMgYSBwYXJlbnQsIGEgcGFyZW50IHN1cmZhY2UgbXVzdCBiZSBzcGVjaWZpZWQgdXNpbmdcblx0ICpcdHNvbWUgb3RoZXIgcHJvdG9jb2wsIGJlZm9yZSBjb21taXR0aW5nIHRoZSBpbml0aWFsIHN0YXRlLlxuXHQgKlxuXHQgKlx0U2VlIHRoZSBkb2N1bWVudGF0aW9uIG9mIHhkZ19wb3B1cCBmb3IgbW9yZSBkZXRhaWxzIGFib3V0IHdoYXQgYW5cblx0ICpcdHhkZ19wb3B1cCBpcyBhbmQgaG93IGl0IGlzIHVzZWQuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7Pyp9IHBhcmVudCAgXG5cdCAqIEBwYXJhbSB7Kn0gcG9zaXRpb25lciAgXG5cdCAqIEByZXR1cm4ge1hkZ1BvcHVwUHJveHl9ICBcblx0ICpcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdGdldFBvcHVwIChwYXJlbnQsIHBvc2l0aW9uZXIpIHtcblx0XHRyZXR1cm4gdGhpcy5kaXNwbGF5Lm1hcnNoYWxsQ29uc3RydWN0b3IodGhpcy5pZCwgMiwgWGRnUG9wdXBQcm94eSwgW25ld09iamVjdCgpLCBvYmplY3RPcHRpb25hbChwYXJlbnQpLCBvYmplY3QocG9zaXRpb25lcildKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRUaGUgd2luZG93IGdlb21ldHJ5IG9mIGEgc3VyZmFjZSBpcyBpdHMgXCJ2aXNpYmxlIGJvdW5kc1wiIGZyb20gdGhlXG5cdCAqXHR1c2VyJ3MgcGVyc3BlY3RpdmUuIENsaWVudC1zaWRlIGRlY29yYXRpb25zIG9mdGVuIGhhdmUgaW52aXNpYmxlXG5cdCAqXHRwb3J0aW9ucyBsaWtlIGRyb3Atc2hhZG93cyB3aGljaCBzaG91bGQgYmUgaWdub3JlZCBmb3IgdGhlXG5cdCAqXHRwdXJwb3NlcyBvZiBhbGlnbmluZywgcGxhY2luZyBhbmQgY29uc3RyYWluaW5nIHdpbmRvd3MuXG5cdCAqXG5cdCAqXHRUaGUgd2luZG93IGdlb21ldHJ5IGlzIGRvdWJsZSBidWZmZXJlZCwgYW5kIHdpbGwgYmUgYXBwbGllZCBhdCB0aGVcblx0ICpcdHRpbWUgd2xfc3VyZmFjZS5jb21taXQgb2YgdGhlIGNvcnJlc3BvbmRpbmcgd2xfc3VyZmFjZSBpcyBjYWxsZWQuXG5cdCAqXG5cdCAqXHRXaGVuIG1haW50YWluaW5nIGEgcG9zaXRpb24sIHRoZSBjb21wb3NpdG9yIHNob3VsZCB0cmVhdCB0aGUgKHgsIHkpXG5cdCAqXHRjb29yZGluYXRlIG9mIHRoZSB3aW5kb3cgZ2VvbWV0cnkgYXMgdGhlIHRvcCBsZWZ0IGNvcm5lciBvZiB0aGUgd2luZG93LlxuXHQgKlx0QSBjbGllbnQgY2hhbmdpbmcgdGhlICh4LCB5KSB3aW5kb3cgZ2VvbWV0cnkgY29vcmRpbmF0ZSBzaG91bGQgaW5cblx0ICpcdGdlbmVyYWwgbm90IGFsdGVyIHRoZSBwb3NpdGlvbiBvZiB0aGUgd2luZG93LlxuXHQgKlxuXHQgKlx0T25jZSB0aGUgd2luZG93IGdlb21ldHJ5IG9mIHRoZSBzdXJmYWNlIGlzIHNldCwgaXQgaXMgbm90IHBvc3NpYmxlIHRvXG5cdCAqXHR1bnNldCBpdCwgYW5kIGl0IHdpbGwgcmVtYWluIHRoZSBzYW1lIHVudGlsIHNldF93aW5kb3dfZ2VvbWV0cnkgaXNcblx0ICpcdGNhbGxlZCBhZ2FpbiwgZXZlbiBpZiBhIG5ldyBzdWJzdXJmYWNlIG9yIGJ1ZmZlciBpcyBhdHRhY2hlZC5cblx0ICpcblx0ICpcdElmIG5ldmVyIHNldCwgdGhlIHZhbHVlIGlzIHRoZSBmdWxsIGJvdW5kcyBvZiB0aGUgc3VyZmFjZSxcblx0ICpcdGluY2x1ZGluZyBhbnkgc3Vic3VyZmFjZXMuIFRoaXMgdXBkYXRlcyBkeW5hbWljYWxseSBvbiBldmVyeVxuXHQgKlx0Y29tbWl0LiBUaGlzIHVuc2V0IGlzIG1lYW50IGZvciBleHRyZW1lbHkgc2ltcGxlIGNsaWVudHMuXG5cdCAqXG5cdCAqXHRUaGUgYXJndW1lbnRzIGFyZSBnaXZlbiBpbiB0aGUgc3VyZmFjZS1sb2NhbCBjb29yZGluYXRlIHNwYWNlIG9mXG5cdCAqXHR0aGUgd2xfc3VyZmFjZSBhc3NvY2lhdGVkIHdpdGggdGhpcyB4ZGdfc3VyZmFjZS5cblx0ICpcblx0ICpcdFRoZSB3aWR0aCBhbmQgaGVpZ2h0IG11c3QgYmUgZ3JlYXRlciB0aGFuIHplcm8uIFNldHRpbmcgYW4gaW52YWxpZCBzaXplXG5cdCAqXHR3aWxsIHJhaXNlIGFuIGVycm9yLiBXaGVuIGFwcGxpZWQsIHRoZSBlZmZlY3RpdmUgd2luZG93IGdlb21ldHJ5IHdpbGwgYmVcblx0ICpcdHRoZSBzZXQgd2luZG93IGdlb21ldHJ5IGNsYW1wZWQgdG8gdGhlIGJvdW5kaW5nIHJlY3RhbmdsZSBvZiB0aGVcblx0ICpcdGNvbWJpbmVkIGdlb21ldHJ5IG9mIHRoZSBzdXJmYWNlIG9mIHRoZSB4ZGdfc3VyZmFjZSBhbmQgdGhlIGFzc29jaWF0ZWRcblx0ICpcdHN1YnN1cmZhY2VzLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0ge251bWJlcn0geCAgXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB5ICBcblx0ICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoICBcblx0ICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRzZXRXaW5kb3dHZW9tZXRyeSAoeCwgeSwgd2lkdGgsIGhlaWdodCkge1xuXHRcdHRoaXMuZGlzcGxheS5tYXJzaGFsbCh0aGlzLmlkLCAzLCBbaW50KHgpLCBpbnQoeSksIGludCh3aWR0aCksIGludChoZWlnaHQpXSlcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0V2hlbiBhIGNvbmZpZ3VyZSBldmVudCBpcyByZWNlaXZlZCwgaWYgYSBjbGllbnQgY29tbWl0cyB0aGVcblx0ICpcdHN1cmZhY2UgaW4gcmVzcG9uc2UgdG8gdGhlIGNvbmZpZ3VyZSBldmVudCwgdGhlbiB0aGUgY2xpZW50XG5cdCAqXHRtdXN0IG1ha2UgYW4gYWNrX2NvbmZpZ3VyZSByZXF1ZXN0IHNvbWV0aW1lIGJlZm9yZSB0aGUgY29tbWl0XG5cdCAqXHRyZXF1ZXN0LCBwYXNzaW5nIGFsb25nIHRoZSBzZXJpYWwgb2YgdGhlIGNvbmZpZ3VyZSBldmVudC5cblx0ICpcblx0ICpcdEZvciBpbnN0YW5jZSwgZm9yIHRvcGxldmVsIHN1cmZhY2VzIHRoZSBjb21wb3NpdG9yIG1pZ2h0IHVzZSB0aGlzXG5cdCAqXHRpbmZvcm1hdGlvbiB0byBtb3ZlIGEgc3VyZmFjZSB0byB0aGUgdG9wIGxlZnQgb25seSB3aGVuIHRoZSBjbGllbnQgaGFzXG5cdCAqXHRkcmF3biBpdHNlbGYgZm9yIHRoZSBtYXhpbWl6ZWQgb3IgZnVsbHNjcmVlbiBzdGF0ZS5cblx0ICpcblx0ICpcdElmIHRoZSBjbGllbnQgcmVjZWl2ZXMgbXVsdGlwbGUgY29uZmlndXJlIGV2ZW50cyBiZWZvcmUgaXRcblx0ICpcdGNhbiByZXNwb25kIHRvIG9uZSwgaXQgb25seSBoYXMgdG8gYWNrIHRoZSBsYXN0IGNvbmZpZ3VyZSBldmVudC5cblx0ICpcblx0ICpcdEEgY2xpZW50IGlzIG5vdCByZXF1aXJlZCB0byBjb21taXQgaW1tZWRpYXRlbHkgYWZ0ZXIgc2VuZGluZ1xuXHQgKlx0YW4gYWNrX2NvbmZpZ3VyZSByZXF1ZXN0IC0gaXQgbWF5IGV2ZW4gYWNrX2NvbmZpZ3VyZSBzZXZlcmFsIHRpbWVzXG5cdCAqXHRiZWZvcmUgaXRzIG5leHQgc3VyZmFjZSBjb21taXQuXG5cdCAqXG5cdCAqXHRBIGNsaWVudCBtYXkgc2VuZCBtdWx0aXBsZSBhY2tfY29uZmlndXJlIHJlcXVlc3RzIGJlZm9yZSBjb21taXR0aW5nLCBidXRcblx0ICpcdG9ubHkgdGhlIGxhc3QgcmVxdWVzdCBzZW50IGJlZm9yZSBhIGNvbW1pdCBpbmRpY2F0ZXMgd2hpY2ggY29uZmlndXJlXG5cdCAqXHRldmVudCB0aGUgY2xpZW50IHJlYWxseSBpcyByZXNwb25kaW5nIHRvLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0ge251bWJlcn0gc2VyaWFsIHRoZSBzZXJpYWwgZnJvbSB0aGUgY29uZmlndXJlIGV2ZW50IFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0YWNrQ29uZmlndXJlIChzZXJpYWwpIHtcblx0XHR0aGlzLmRpc3BsYXkubWFyc2hhbGwodGhpcy5pZCwgNCwgW3VpbnQoc2VyaWFsKV0pXG5cdH1cblxuLyoqXG5cdCAqQHBhcmFtIHtEaXNwbGF5fWRpc3BsYXlcblx0ICpAcGFyYW0ge251bWJlcn1pZFxuXHQgKi9cblx0Y29uc3RydWN0b3IgKGRpc3BsYXksIGlkKSB7XG5cdFx0c3VwZXIoZGlzcGxheSwgaWQpXG5cdFx0LyoqXG5cdFx0ICogQHR5cGUge1hkZ1N1cmZhY2VFdmVudHN8bnVsbH1cblx0XHQgKi9cblx0XHR0aGlzLmxpc3RlbmVyID0gbnVsbFxuXHR9XG5cblx0YXN5bmMgWzBdIChtZXNzYWdlKSB7XG5cdFx0YXdhaXQgdGhpcy5saXN0ZW5lci5jb25maWd1cmUodShtZXNzYWdlKSlcblx0fVxuXG59XG5YZGdTdXJmYWNlUHJveHkucHJvdG9jb2xOYW1lID0gJ3hkZ19zdXJmYWNlJ1xuXG5YZGdTdXJmYWNlUHJveHkuRXJyb3IgPSB7XG4gIC8qKlxuICAgKiBcbiAgICovXG4gIG5vdENvbnN0cnVjdGVkOiAxLFxuICAvKipcbiAgICogXG4gICAqL1xuICBhbHJlYWR5Q29uc3RydWN0ZWQ6IDIsXG4gIC8qKlxuICAgKiBcbiAgICovXG4gIHVuY29uZmlndXJlZEJ1ZmZlcjogM1xufVxuXG5leHBvcnQgZGVmYXVsdCBYZGdTdXJmYWNlUHJveHlcbiIsIi8qXG4gKlxuICogICAgQ29weXJpZ2h0IMKpIDIwMDgtMjAxMyBLcmlzdGlhbiBIw7hnc2JlcmdcbiAqICAgIENvcHlyaWdodCDCqSAyMDEzICAgICAgUmFmYWVsIEFudG9nbm9sbGlcbiAqICAgIENvcHlyaWdodCDCqSAyMDEzICAgICAgSmFzcGVyIFN0LiBQaWVycmVcbiAqICAgIENvcHlyaWdodCDCqSAyMDEwLTIwMTMgSW50ZWwgQ29ycG9yYXRpb25cbiAqICAgIENvcHlyaWdodCDCqSAyMDE1LTIwMTcgU2Ftc3VuZyBFbGVjdHJvbmljcyBDby4sIEx0ZFxuICogICAgQ29weXJpZ2h0IMKpIDIwMTUtMjAxNyBSZWQgSGF0IEluYy5cbiAqXG4gKiAgICBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuICogICAgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLFxuICogICAgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvblxuICogICAgdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsXG4gKiAgICBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGVcbiAqICAgIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogICAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2UgKGluY2x1ZGluZyB0aGUgbmV4dFxuICogICAgcGFyYWdyYXBoKSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZVxuICogICAgU29mdHdhcmUuXG4gKlxuICogICAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogICAgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiAgICBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiAgSU4gTk8gRVZFTlQgU0hBTExcbiAqICAgIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiAgICBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lOR1xuICogICAgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUlxuICogICAgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICogIFxuICovXG5cbi8qKlxuICogQGludGVyZmFjZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBYZGdUb3BsZXZlbEV2ZW50cyB7XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRUaGlzIGNvbmZpZ3VyZSBldmVudCBhc2tzIHRoZSBjbGllbnQgdG8gcmVzaXplIGl0cyB0b3BsZXZlbCBzdXJmYWNlIG9yXG5cdCAqXHR0byBjaGFuZ2UgaXRzIHN0YXRlLiBUaGUgY29uZmlndXJlZCBzdGF0ZSBzaG91bGQgbm90IGJlIGFwcGxpZWRcblx0ICpcdGltbWVkaWF0ZWx5LiBTZWUgeGRnX3N1cmZhY2UuY29uZmlndXJlIGZvciBkZXRhaWxzLlxuXHQgKlxuXHQgKlx0VGhlIHdpZHRoIGFuZCBoZWlnaHQgYXJndW1lbnRzIHNwZWNpZnkgYSBoaW50IHRvIHRoZSB3aW5kb3dcblx0ICpcdGFib3V0IGhvdyBpdHMgc3VyZmFjZSBzaG91bGQgYmUgcmVzaXplZCBpbiB3aW5kb3cgZ2VvbWV0cnlcblx0ICpcdGNvb3JkaW5hdGVzLiBTZWUgc2V0X3dpbmRvd19nZW9tZXRyeS5cblx0ICpcblx0ICpcdElmIHRoZSB3aWR0aCBvciBoZWlnaHQgYXJndW1lbnRzIGFyZSB6ZXJvLCBpdCBtZWFucyB0aGUgY2xpZW50XG5cdCAqXHRzaG91bGQgZGVjaWRlIGl0cyBvd24gd2luZG93IGRpbWVuc2lvbi4gVGhpcyBtYXkgaGFwcGVuIHdoZW4gdGhlXG5cdCAqXHRjb21wb3NpdG9yIG5lZWRzIHRvIGNvbmZpZ3VyZSB0aGUgc3RhdGUgb2YgdGhlIHN1cmZhY2UgYnV0IGRvZXNuJ3Rcblx0ICpcdGhhdmUgYW55IGluZm9ybWF0aW9uIGFib3V0IGFueSBwcmV2aW91cyBvciBleHBlY3RlZCBkaW1lbnNpb24uXG5cdCAqXG5cdCAqXHRUaGUgc3RhdGVzIGxpc3RlZCBpbiB0aGUgZXZlbnQgc3BlY2lmeSBob3cgdGhlIHdpZHRoL2hlaWdodFxuXHQgKlx0YXJndW1lbnRzIHNob3VsZCBiZSBpbnRlcnByZXRlZCwgYW5kIHBvc3NpYmx5IGhvdyBpdCBzaG91bGQgYmVcblx0ICpcdGRyYXduLlxuXHQgKlxuXHQgKlx0Q2xpZW50cyBtdXN0IHNlbmQgYW4gYWNrX2NvbmZpZ3VyZSBpbiByZXNwb25zZSB0byB0aGlzIGV2ZW50LiBTZWVcblx0ICpcdHhkZ19zdXJmYWNlLmNvbmZpZ3VyZSBhbmQgeGRnX3N1cmZhY2UuYWNrX2NvbmZpZ3VyZSBmb3IgZGV0YWlscy5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoICBcblx0ICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAgXG5cdCAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ9IHN0YXRlcyAgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRjb25maWd1cmUod2lkdGgsIGhlaWdodCwgc3RhdGVzKSB7fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0VGhlIGNsb3NlIGV2ZW50IGlzIHNlbnQgYnkgdGhlIGNvbXBvc2l0b3Igd2hlbiB0aGUgdXNlclxuXHQgKlx0d2FudHMgdGhlIHN1cmZhY2UgdG8gYmUgY2xvc2VkLiBUaGlzIHNob3VsZCBiZSBlcXVpdmFsZW50IHRvXG5cdCAqXHR0aGUgdXNlciBjbGlja2luZyB0aGUgY2xvc2UgYnV0dG9uIGluIGNsaWVudC1zaWRlIGRlY29yYXRpb25zLFxuXHQgKlx0aWYgeW91ciBhcHBsaWNhdGlvbiBoYXMgYW55LlxuXHQgKlxuXHQgKlx0VGhpcyBpcyBvbmx5IGEgcmVxdWVzdCB0aGF0IHRoZSB1c2VyIGludGVuZHMgdG8gY2xvc2UgdGhlXG5cdCAqXHR3aW5kb3cuIFRoZSBjbGllbnQgbWF5IGNob29zZSB0byBpZ25vcmUgdGhpcyByZXF1ZXN0LCBvciBzaG93XG5cdCAqXHRhIGRpYWxvZyB0byBhc2sgdGhlIHVzZXIgdG8gc2F2ZSB0aGVpciBkYXRhLCBldGMuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRjbG9zZSgpIHt9XG59XG5cbiIsIi8qXG4gKlxuICogICAgQ29weXJpZ2h0IMKpIDIwMDgtMjAxMyBLcmlzdGlhbiBIw7hnc2JlcmdcbiAqICAgIENvcHlyaWdodCDCqSAyMDEzICAgICAgUmFmYWVsIEFudG9nbm9sbGlcbiAqICAgIENvcHlyaWdodCDCqSAyMDEzICAgICAgSmFzcGVyIFN0LiBQaWVycmVcbiAqICAgIENvcHlyaWdodCDCqSAyMDEwLTIwMTMgSW50ZWwgQ29ycG9yYXRpb25cbiAqICAgIENvcHlyaWdodCDCqSAyMDE1LTIwMTcgU2Ftc3VuZyBFbGVjdHJvbmljcyBDby4sIEx0ZFxuICogICAgQ29weXJpZ2h0IMKpIDIwMTUtMjAxNyBSZWQgSGF0IEluYy5cbiAqXG4gKiAgICBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuICogICAgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLFxuICogICAgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvblxuICogICAgdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsXG4gKiAgICBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGVcbiAqICAgIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogICAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2UgKGluY2x1ZGluZyB0aGUgbmV4dFxuICogICAgcGFyYWdyYXBoKSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZVxuICogICAgU29mdHdhcmUuXG4gKlxuICogICAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogICAgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiAgICBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiAgSU4gTk8gRVZFTlQgU0hBTExcbiAqICAgIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiAgICBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lOR1xuICogICAgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUlxuICogICAgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICogIFxuICovXG5cbmltcG9ydCB7IENvbm5lY3Rpb24gfSBmcm9tICd3ZXN0ZmllbGQtcnVudGltZS1jb21tb24nXG5jb25zdCB7IHVpbnQsIHVpbnRPcHRpb25hbCwgaW50LCBpbnRPcHRpb25hbCwgZml4ZWQsIFxuXHRmaXhlZE9wdGlvbmFsLCBvYmplY3QsIG9iamVjdE9wdGlvbmFsLCBuZXdPYmplY3QsIHN0cmluZywgXG5cdHN0cmluZ09wdGlvbmFsLCBhcnJheSwgYXJyYXlPcHRpb25hbCwgXG5cdGZpbGVEZXNjcmlwdG9yT3B0aW9uYWwsIGZpbGVEZXNjcmlwdG9yLCBcbmgsIHUsIGksIGYsIG8sIG4sIHMsIGEgfSA9IENvbm5lY3Rpb25cbmltcG9ydCBQcm94eSBmcm9tICcuL1Byb3h5J1xuXG4vKipcbiAqXG4gKiAgICAgIFRoaXMgaW50ZXJmYWNlIGRlZmluZXMgYW4geGRnX3N1cmZhY2Ugcm9sZSB3aGljaCBhbGxvd3MgYSBzdXJmYWNlIHRvLFxuICogICAgICBhbW9uZyBvdGhlciB0aGluZ3MsIHNldCB3aW5kb3ctbGlrZSBwcm9wZXJ0aWVzIHN1Y2ggYXMgbWF4aW1pemUsXG4gKiAgICAgIGZ1bGxzY3JlZW4sIGFuZCBtaW5pbWl6ZSwgc2V0IGFwcGxpY2F0aW9uLXNwZWNpZmljIG1ldGFkYXRhIGxpa2UgdGl0bGUgYW5kXG4gKiAgICAgIGlkLCBhbmQgd2VsbCBhcyB0cmlnZ2VyIHVzZXIgaW50ZXJhY3RpdmUgb3BlcmF0aW9ucyBzdWNoIGFzIGludGVyYWN0aXZlXG4gKiAgICAgIHJlc2l6ZSBhbmQgbW92ZS5cbiAqXG4gKiAgICAgIFVubWFwcGluZyBhbiB4ZGdfdG9wbGV2ZWwgbWVhbnMgdGhhdCB0aGUgc3VyZmFjZSBjYW5ub3QgYmUgc2hvd25cbiAqICAgICAgYnkgdGhlIGNvbXBvc2l0b3IgdW50aWwgaXQgaXMgZXhwbGljaXRseSBtYXBwZWQgYWdhaW4uXG4gKiAgICAgIEFsbCBhY3RpdmUgb3BlcmF0aW9ucyAoZS5nLiwgbW92ZSwgcmVzaXplKSBhcmUgY2FuY2VsZWQgYW5kIGFsbFxuICogICAgICBhdHRyaWJ1dGVzIChlLmcuIHRpdGxlLCBzdGF0ZSwgc3RhY2tpbmcsIC4uLikgYXJlIGRpc2NhcmRlZCBmb3JcbiAqICAgICAgYW4geGRnX3RvcGxldmVsIHN1cmZhY2Ugd2hlbiBpdCBpcyB1bm1hcHBlZC5cbiAqXG4gKiAgICAgIEF0dGFjaGluZyBhIG51bGwgYnVmZmVyIHRvIGEgdG9wbGV2ZWwgdW5tYXBzIHRoZSBzdXJmYWNlLlxuICogICAgXG4gKi9cbmNsYXNzIFhkZ1RvcGxldmVsUHJveHkgZXh0ZW5kcyBQcm94eSB7XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRUaGlzIHJlcXVlc3QgZGVzdHJveXMgdGhlIHJvbGUgc3VyZmFjZSBhbmQgdW5tYXBzIHRoZSBzdXJmYWNlO1xuXHQgKlx0c2VlIFwiVW5tYXBwaW5nXCIgYmVoYXZpb3IgaW4gaW50ZXJmYWNlIHNlY3Rpb24gZm9yIGRldGFpbHMuXG5cdCAqICAgICAgXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRkZXN0cm95ICgpIHtcblx0XHR0aGlzLmRpc3BsYXkubWFyc2hhbGwodGhpcy5pZCwgMCwgW10pXG5cdH1cblxuXHQvKipcblx0ICpcblx0ICpcdFNldCB0aGUgXCJwYXJlbnRcIiBvZiB0aGlzIHN1cmZhY2UuIFRoaXMgc3VyZmFjZSBzaG91bGQgYmUgc3RhY2tlZFxuXHQgKlx0YWJvdmUgdGhlIHBhcmVudCBzdXJmYWNlIGFuZCBhbGwgb3RoZXIgYW5jZXN0b3Igc3VyZmFjZXMuXG5cdCAqXG5cdCAqXHRQYXJlbnQgd2luZG93cyBzaG91bGQgYmUgc2V0IG9uIGRpYWxvZ3MsIHRvb2xib3hlcywgb3Igb3RoZXJcblx0ICpcdFwiYXV4aWxpYXJ5XCIgc3VyZmFjZXMsIHNvIHRoYXQgdGhlIHBhcmVudCBpcyByYWlzZWQgd2hlbiB0aGUgZGlhbG9nXG5cdCAqXHRpcyByYWlzZWQuXG5cdCAqXG5cdCAqXHRTZXR0aW5nIGEgbnVsbCBwYXJlbnQgZm9yIGEgY2hpbGQgd2luZG93IHJlbW92ZXMgYW55IHBhcmVudC1jaGlsZFxuXHQgKlx0cmVsYXRpb25zaGlwIGZvciB0aGUgY2hpbGQuIFNldHRpbmcgYSBudWxsIHBhcmVudCBmb3IgYSB3aW5kb3cgd2hpY2hcblx0ICpcdGN1cnJlbnRseSBoYXMgbm8gcGFyZW50IGlzIGEgbm8tb3AuXG5cdCAqXG5cdCAqXHRJZiB0aGUgcGFyZW50IGlzIHVubWFwcGVkIHRoZW4gaXRzIGNoaWxkcmVuIGFyZSBtYW5hZ2VkIGFzXG5cdCAqXHR0aG91Z2ggdGhlIHBhcmVudCBvZiB0aGUgbm93LXVubWFwcGVkIHBhcmVudCBoYXMgYmVjb21lIHRoZVxuXHQgKlx0cGFyZW50IG9mIHRoaXMgc3VyZmFjZS4gSWYgbm8gcGFyZW50IGV4aXN0cyBmb3IgdGhlIG5vdy11bm1hcHBlZFxuXHQgKlx0cGFyZW50IHRoZW4gdGhlIGNoaWxkcmVuIGFyZSBtYW5hZ2VkIGFzIHRob3VnaCB0aGV5IGhhdmUgbm9cblx0ICpcdHBhcmVudCBzdXJmYWNlLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0gez8qfSBwYXJlbnQgIFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0c2V0UGFyZW50IChwYXJlbnQpIHtcblx0XHR0aGlzLmRpc3BsYXkubWFyc2hhbGwodGhpcy5pZCwgMSwgW29iamVjdE9wdGlvbmFsKHBhcmVudCldKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRTZXQgYSBzaG9ydCB0aXRsZSBmb3IgdGhlIHN1cmZhY2UuXG5cdCAqXG5cdCAqXHRUaGlzIHN0cmluZyBtYXkgYmUgdXNlZCB0byBpZGVudGlmeSB0aGUgc3VyZmFjZSBpbiBhIHRhc2sgYmFyLFxuXHQgKlx0d2luZG93IGxpc3QsIG9yIG90aGVyIHVzZXIgaW50ZXJmYWNlIGVsZW1lbnRzIHByb3ZpZGVkIGJ5IHRoZVxuXHQgKlx0Y29tcG9zaXRvci5cblx0ICpcblx0ICpcdFRoZSBzdHJpbmcgbXVzdCBiZSBlbmNvZGVkIGluIFVURi04LlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdGl0bGUgIFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0c2V0VGl0bGUgKHRpdGxlKSB7XG5cdFx0dGhpcy5kaXNwbGF5Lm1hcnNoYWxsKHRoaXMuaWQsIDIsIFtzdHJpbmcodGl0bGUpXSlcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0U2V0IGFuIGFwcGxpY2F0aW9uIGlkZW50aWZpZXIgZm9yIHRoZSBzdXJmYWNlLlxuXHQgKlxuXHQgKlx0VGhlIGFwcCBJRCBpZGVudGlmaWVzIHRoZSBnZW5lcmFsIGNsYXNzIG9mIGFwcGxpY2F0aW9ucyB0byB3aGljaFxuXHQgKlx0dGhlIHN1cmZhY2UgYmVsb25ncy4gVGhlIGNvbXBvc2l0b3IgY2FuIHVzZSB0aGlzIHRvIGdyb3VwIG11bHRpcGxlXG5cdCAqXHRzdXJmYWNlcyB0b2dldGhlciwgb3IgdG8gZGV0ZXJtaW5lIGhvdyB0byBsYXVuY2ggYSBuZXcgYXBwbGljYXRpb24uXG5cdCAqXG5cdCAqXHRGb3IgRC1CdXMgYWN0aXZhdGFibGUgYXBwbGljYXRpb25zLCB0aGUgYXBwIElEIGlzIHVzZWQgYXMgdGhlIEQtQnVzXG5cdCAqXHRzZXJ2aWNlIG5hbWUuXG5cdCAqXG5cdCAqXHRUaGUgY29tcG9zaXRvciBzaGVsbCB3aWxsIHRyeSB0byBncm91cCBhcHBsaWNhdGlvbiBzdXJmYWNlcyB0b2dldGhlclxuXHQgKlx0YnkgdGhlaXIgYXBwIElELiBBcyBhIGJlc3QgcHJhY3RpY2UsIGl0IGlzIHN1Z2dlc3RlZCB0byBzZWxlY3QgYXBwXG5cdCAqXHRJRCdzIHRoYXQgbWF0Y2ggdGhlIGJhc2VuYW1lIG9mIHRoZSBhcHBsaWNhdGlvbidzIC5kZXNrdG9wIGZpbGUuXG5cdCAqXHRGb3IgZXhhbXBsZSwgXCJvcmcuZnJlZWRlc2t0b3AuRm9vVmlld2VyXCIgd2hlcmUgdGhlIC5kZXNrdG9wIGZpbGUgaXNcblx0ICpcdFwib3JnLmZyZWVkZXNrdG9wLkZvb1ZpZXdlci5kZXNrdG9wXCIuXG5cdCAqXG5cdCAqXHRTZWUgdGhlIGRlc2t0b3AtZW50cnkgc3BlY2lmaWNhdGlvbiBbMF0gZm9yIG1vcmUgZGV0YWlscyBvblxuXHQgKlx0YXBwbGljYXRpb24gaWRlbnRpZmllcnMgYW5kIGhvdyB0aGV5IHJlbGF0ZSB0byB3ZWxsLWtub3duIEQtQnVzXG5cdCAqXHRuYW1lcyBhbmQgLmRlc2t0b3AgZmlsZXMuXG5cdCAqXG5cdCAqXHRbMF0gaHR0cDovL3N0YW5kYXJkcy5mcmVlZGVza3RvcC5vcmcvZGVza3RvcC1lbnRyeS1zcGVjL1xuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gYXBwSWQgIFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0c2V0QXBwSWQgKGFwcElkKSB7XG5cdFx0dGhpcy5kaXNwbGF5Lm1hcnNoYWxsKHRoaXMuaWQsIDMsIFtzdHJpbmcoYXBwSWQpXSlcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0Q2xpZW50cyBpbXBsZW1lbnRpbmcgY2xpZW50LXNpZGUgZGVjb3JhdGlvbnMgbWlnaHQgd2FudCB0byBzaG93XG5cdCAqXHRhIGNvbnRleHQgbWVudSB3aGVuIHJpZ2h0LWNsaWNraW5nIG9uIHRoZSBkZWNvcmF0aW9ucywgZ2l2aW5nIHRoZVxuXHQgKlx0dXNlciBhIG1lbnUgdGhhdCB0aGV5IGNhbiB1c2UgdG8gbWF4aW1pemUgb3IgbWluaW1pemUgdGhlIHdpbmRvdy5cblx0ICpcblx0ICpcdFRoaXMgcmVxdWVzdCBhc2tzIHRoZSBjb21wb3NpdG9yIHRvIHBvcCB1cCBzdWNoIGEgd2luZG93IG1lbnUgYXRcblx0ICpcdHRoZSBnaXZlbiBwb3NpdGlvbiwgcmVsYXRpdmUgdG8gdGhlIGxvY2FsIHN1cmZhY2UgY29vcmRpbmF0ZXMgb2Zcblx0ICpcdHRoZSBwYXJlbnQgc3VyZmFjZS4gVGhlcmUgYXJlIG5vIGd1YXJhbnRlZXMgYXMgdG8gd2hhdCBtZW51IGl0ZW1zXG5cdCAqXHR0aGUgd2luZG93IG1lbnUgY29udGFpbnMuXG5cdCAqXG5cdCAqXHRUaGlzIHJlcXVlc3QgbXVzdCBiZSB1c2VkIGluIHJlc3BvbnNlIHRvIHNvbWUgc29ydCBvZiB1c2VyIGFjdGlvblxuXHQgKlx0bGlrZSBhIGJ1dHRvbiBwcmVzcywga2V5IHByZXNzLCBvciB0b3VjaCBkb3duIGV2ZW50LlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0geyp9IHNlYXQgdGhlIHdsX3NlYXQgb2YgdGhlIHVzZXIgZXZlbnQgXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBzZXJpYWwgdGhlIHNlcmlhbCBvZiB0aGUgdXNlciBldmVudCBcblx0ICogQHBhcmFtIHtudW1iZXJ9IHggdGhlIHggcG9zaXRpb24gdG8gcG9wIHVwIHRoZSB3aW5kb3cgbWVudSBhdCBcblx0ICogQHBhcmFtIHtudW1iZXJ9IHkgdGhlIHkgcG9zaXRpb24gdG8gcG9wIHVwIHRoZSB3aW5kb3cgbWVudSBhdCBcblx0ICpcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdHNob3dXaW5kb3dNZW51IChzZWF0LCBzZXJpYWwsIHgsIHkpIHtcblx0XHR0aGlzLmRpc3BsYXkubWFyc2hhbGwodGhpcy5pZCwgNCwgW29iamVjdChzZWF0KSwgdWludChzZXJpYWwpLCBpbnQoeCksIGludCh5KV0pXG5cdH1cblxuXHQvKipcblx0ICpcblx0ICpcdFN0YXJ0IGFuIGludGVyYWN0aXZlLCB1c2VyLWRyaXZlbiBtb3ZlIG9mIHRoZSBzdXJmYWNlLlxuXHQgKlxuXHQgKlx0VGhpcyByZXF1ZXN0IG11c3QgYmUgdXNlZCBpbiByZXNwb25zZSB0byBzb21lIHNvcnQgb2YgdXNlciBhY3Rpb25cblx0ICpcdGxpa2UgYSBidXR0b24gcHJlc3MsIGtleSBwcmVzcywgb3IgdG91Y2ggZG93biBldmVudC4gVGhlIHBhc3NlZFxuXHQgKlx0c2VyaWFsIGlzIHVzZWQgdG8gZGV0ZXJtaW5lIHRoZSB0eXBlIG9mIGludGVyYWN0aXZlIG1vdmUgKHRvdWNoLFxuXHQgKlx0cG9pbnRlciwgZXRjKS5cblx0ICpcblx0ICpcdFRoZSBzZXJ2ZXIgbWF5IGlnbm9yZSBtb3ZlIHJlcXVlc3RzIGRlcGVuZGluZyBvbiB0aGUgc3RhdGUgb2Zcblx0ICpcdHRoZSBzdXJmYWNlIChlLmcuIGZ1bGxzY3JlZW4gb3IgbWF4aW1pemVkKSwgb3IgaWYgdGhlIHBhc3NlZCBzZXJpYWxcblx0ICpcdGlzIG5vIGxvbmdlciB2YWxpZC5cblx0ICpcblx0ICpcdElmIHRyaWdnZXJlZCwgdGhlIHN1cmZhY2Ugd2lsbCBsb3NlIHRoZSBmb2N1cyBvZiB0aGUgZGV2aWNlXG5cdCAqXHQod2xfcG9pbnRlciwgd2xfdG91Y2gsIGV0YykgdXNlZCBmb3IgdGhlIG1vdmUuIEl0IGlzIHVwIHRvIHRoZVxuXHQgKlx0Y29tcG9zaXRvciB0byB2aXN1YWxseSBpbmRpY2F0ZSB0aGF0IHRoZSBtb3ZlIGlzIHRha2luZyBwbGFjZSwgc3VjaCBhc1xuXHQgKlx0dXBkYXRpbmcgYSBwb2ludGVyIGN1cnNvciwgZHVyaW5nIHRoZSBtb3ZlLiBUaGVyZSBpcyBubyBndWFyYW50ZWVcblx0ICpcdHRoYXQgdGhlIGRldmljZSBmb2N1cyB3aWxsIHJldHVybiB3aGVuIHRoZSBtb3ZlIGlzIGNvbXBsZXRlZC5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHsqfSBzZWF0IHRoZSB3bF9zZWF0IG9mIHRoZSB1c2VyIGV2ZW50IFxuXHQgKiBAcGFyYW0ge251bWJlcn0gc2VyaWFsIHRoZSBzZXJpYWwgb2YgdGhlIHVzZXIgZXZlbnQgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRtb3ZlIChzZWF0LCBzZXJpYWwpIHtcblx0XHR0aGlzLmRpc3BsYXkubWFyc2hhbGwodGhpcy5pZCwgNSwgW29iamVjdChzZWF0KSwgdWludChzZXJpYWwpXSlcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0U3RhcnQgYSB1c2VyLWRyaXZlbiwgaW50ZXJhY3RpdmUgcmVzaXplIG9mIHRoZSBzdXJmYWNlLlxuXHQgKlxuXHQgKlx0VGhpcyByZXF1ZXN0IG11c3QgYmUgdXNlZCBpbiByZXNwb25zZSB0byBzb21lIHNvcnQgb2YgdXNlciBhY3Rpb25cblx0ICpcdGxpa2UgYSBidXR0b24gcHJlc3MsIGtleSBwcmVzcywgb3IgdG91Y2ggZG93biBldmVudC4gVGhlIHBhc3NlZFxuXHQgKlx0c2VyaWFsIGlzIHVzZWQgdG8gZGV0ZXJtaW5lIHRoZSB0eXBlIG9mIGludGVyYWN0aXZlIHJlc2l6ZSAodG91Y2gsXG5cdCAqXHRwb2ludGVyLCBldGMpLlxuXHQgKlxuXHQgKlx0VGhlIHNlcnZlciBtYXkgaWdub3JlIHJlc2l6ZSByZXF1ZXN0cyBkZXBlbmRpbmcgb24gdGhlIHN0YXRlIG9mXG5cdCAqXHR0aGUgc3VyZmFjZSAoZS5nLiBmdWxsc2NyZWVuIG9yIG1heGltaXplZCkuXG5cdCAqXG5cdCAqXHRJZiB0cmlnZ2VyZWQsIHRoZSBjbGllbnQgd2lsbCByZWNlaXZlIGNvbmZpZ3VyZSBldmVudHMgd2l0aCB0aGVcblx0ICpcdFwicmVzaXplXCIgc3RhdGUgZW51bSB2YWx1ZSBhbmQgdGhlIGV4cGVjdGVkIHNpemVzLiBTZWUgdGhlIFwicmVzaXplXCJcblx0ICpcdGVudW0gdmFsdWUgZm9yIG1vcmUgZGV0YWlscyBhYm91dCB3aGF0IGlzIHJlcXVpcmVkLiBUaGUgY2xpZW50XG5cdCAqXHRtdXN0IGFsc28gYWNrbm93bGVkZ2UgY29uZmlndXJlIGV2ZW50cyB1c2luZyBcImFja19jb25maWd1cmVcIi4gQWZ0ZXJcblx0ICpcdHRoZSByZXNpemUgaXMgY29tcGxldGVkLCB0aGUgY2xpZW50IHdpbGwgcmVjZWl2ZSBhbm90aGVyIFwiY29uZmlndXJlXCJcblx0ICpcdGV2ZW50IHdpdGhvdXQgdGhlIHJlc2l6ZSBzdGF0ZS5cblx0ICpcblx0ICpcdElmIHRyaWdnZXJlZCwgdGhlIHN1cmZhY2UgYWxzbyB3aWxsIGxvc2UgdGhlIGZvY3VzIG9mIHRoZSBkZXZpY2Vcblx0ICpcdCh3bF9wb2ludGVyLCB3bF90b3VjaCwgZXRjKSB1c2VkIGZvciB0aGUgcmVzaXplLiBJdCBpcyB1cCB0byB0aGVcblx0ICpcdGNvbXBvc2l0b3IgdG8gdmlzdWFsbHkgaW5kaWNhdGUgdGhhdCB0aGUgcmVzaXplIGlzIHRha2luZyBwbGFjZSxcblx0ICpcdHN1Y2ggYXMgdXBkYXRpbmcgYSBwb2ludGVyIGN1cnNvciwgZHVyaW5nIHRoZSByZXNpemUuIFRoZXJlIGlzIG5vXG5cdCAqXHRndWFyYW50ZWUgdGhhdCB0aGUgZGV2aWNlIGZvY3VzIHdpbGwgcmV0dXJuIHdoZW4gdGhlIHJlc2l6ZSBpc1xuXHQgKlx0Y29tcGxldGVkLlxuXHQgKlxuXHQgKlx0VGhlIGVkZ2VzIHBhcmFtZXRlciBzcGVjaWZpZXMgaG93IHRoZSBzdXJmYWNlIHNob3VsZCBiZSByZXNpemVkLFxuXHQgKlx0YW5kIGlzIG9uZSBvZiB0aGUgdmFsdWVzIG9mIHRoZSByZXNpemVfZWRnZSBlbnVtLiBUaGUgY29tcG9zaXRvclxuXHQgKlx0bWF5IHVzZSB0aGlzIGluZm9ybWF0aW9uIHRvIHVwZGF0ZSB0aGUgc3VyZmFjZSBwb3NpdGlvbiBmb3Jcblx0ICpcdGV4YW1wbGUgd2hlbiBkcmFnZ2luZyB0aGUgdG9wIGxlZnQgY29ybmVyLiBUaGUgY29tcG9zaXRvciBtYXkgYWxzb1xuXHQgKlx0dXNlIHRoaXMgaW5mb3JtYXRpb24gdG8gYWRhcHQgaXRzIGJlaGF2aW9yLCBlLmcuIGNob29zZSBhblxuXHQgKlx0YXBwcm9wcmlhdGUgY3Vyc29yIGltYWdlLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0geyp9IHNlYXQgdGhlIHdsX3NlYXQgb2YgdGhlIHVzZXIgZXZlbnQgXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBzZXJpYWwgdGhlIHNlcmlhbCBvZiB0aGUgdXNlciBldmVudCBcblx0ICogQHBhcmFtIHtudW1iZXJ9IGVkZ2VzIHdoaWNoIGVkZ2Ugb3IgY29ybmVyIGlzIGJlaW5nIGRyYWdnZWQgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRyZXNpemUgKHNlYXQsIHNlcmlhbCwgZWRnZXMpIHtcblx0XHR0aGlzLmRpc3BsYXkubWFyc2hhbGwodGhpcy5pZCwgNiwgW29iamVjdChzZWF0KSwgdWludChzZXJpYWwpLCB1aW50KGVkZ2VzKV0pXG5cdH1cblxuXHQvKipcblx0ICpcblx0ICpcdFNldCBhIG1heGltdW0gc2l6ZSBmb3IgdGhlIHdpbmRvdy5cblx0ICpcblx0ICpcdFRoZSBjbGllbnQgY2FuIHNwZWNpZnkgYSBtYXhpbXVtIHNpemUgc28gdGhhdCB0aGUgY29tcG9zaXRvciBkb2VzXG5cdCAqXHRub3QgdHJ5IHRvIGNvbmZpZ3VyZSB0aGUgd2luZG93IGJleW9uZCB0aGlzIHNpemUuXG5cdCAqXG5cdCAqXHRUaGUgd2lkdGggYW5kIGhlaWdodCBhcmd1bWVudHMgYXJlIGluIHdpbmRvdyBnZW9tZXRyeSBjb29yZGluYXRlcy5cblx0ICpcdFNlZSB4ZGdfc3VyZmFjZS5zZXRfd2luZG93X2dlb21ldHJ5LlxuXHQgKlxuXHQgKlx0VmFsdWVzIHNldCBpbiB0aGlzIHdheSBhcmUgZG91YmxlLWJ1ZmZlcmVkLiBUaGV5IHdpbGwgZ2V0IGFwcGxpZWRcblx0ICpcdG9uIHRoZSBuZXh0IGNvbW1pdC5cblx0ICpcblx0ICpcdFRoZSBjb21wb3NpdG9yIGNhbiB1c2UgdGhpcyBpbmZvcm1hdGlvbiB0byBhbGxvdyBvciBkaXNhbGxvd1xuXHQgKlx0ZGlmZmVyZW50IHN0YXRlcyBsaWtlIG1heGltaXplIG9yIGZ1bGxzY3JlZW4gYW5kIGRyYXcgYWNjdXJhdGVcblx0ICpcdGFuaW1hdGlvbnMuXG5cdCAqXG5cdCAqXHRTaW1pbGFybHksIGEgdGlsaW5nIHdpbmRvdyBtYW5hZ2VyIG1heSB1c2UgdGhpcyBpbmZvcm1hdGlvbiB0b1xuXHQgKlx0cGxhY2UgYW5kIHJlc2l6ZSBjbGllbnQgd2luZG93cyBpbiBhIG1vcmUgZWZmZWN0aXZlIHdheS5cblx0ICpcblx0ICpcdFRoZSBjbGllbnQgc2hvdWxkIG5vdCByZWx5IG9uIHRoZSBjb21wb3NpdG9yIHRvIG9iZXkgdGhlIG1heGltdW1cblx0ICpcdHNpemUuIFRoZSBjb21wb3NpdG9yIG1heSBkZWNpZGUgdG8gaWdub3JlIHRoZSB2YWx1ZXMgc2V0IGJ5IHRoZVxuXHQgKlx0Y2xpZW50IGFuZCByZXF1ZXN0IGEgbGFyZ2VyIHNpemUuXG5cdCAqXG5cdCAqXHRJZiBuZXZlciBzZXQsIG9yIGEgdmFsdWUgb2YgemVybyBpbiB0aGUgcmVxdWVzdCwgbWVhbnMgdGhhdCB0aGVcblx0ICpcdGNsaWVudCBoYXMgbm8gZXhwZWN0ZWQgbWF4aW11bSBzaXplIGluIHRoZSBnaXZlbiBkaW1lbnNpb24uXG5cdCAqXHRBcyBhIHJlc3VsdCwgYSBjbGllbnQgd2lzaGluZyB0byByZXNldCB0aGUgbWF4aW11bSBzaXplXG5cdCAqXHR0byBhbiB1bnNwZWNpZmllZCBzdGF0ZSBjYW4gdXNlIHplcm8gZm9yIHdpZHRoIGFuZCBoZWlnaHQgaW4gdGhlXG5cdCAqXHRyZXF1ZXN0LlxuXHQgKlxuXHQgKlx0UmVxdWVzdGluZyBhIG1heGltdW0gc2l6ZSB0byBiZSBzbWFsbGVyIHRoYW4gdGhlIG1pbmltdW0gc2l6ZSBvZlxuXHQgKlx0YSBzdXJmYWNlIGlzIGlsbGVnYWwgYW5kIHdpbGwgcmVzdWx0IGluIGEgcHJvdG9jb2wgZXJyb3IuXG5cdCAqXG5cdCAqXHRUaGUgd2lkdGggYW5kIGhlaWdodCBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB6ZXJvLiBVc2luZ1xuXHQgKlx0c3RyaWN0bHkgbmVnYXRpdmUgdmFsdWVzIGZvciB3aWR0aCBhbmQgaGVpZ2h0IHdpbGwgcmVzdWx0IGluIGFcblx0ICpcdHByb3RvY29sIGVycm9yLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggIFxuXHQgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0ICBcblx0ICpcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdHNldE1heFNpemUgKHdpZHRoLCBoZWlnaHQpIHtcblx0XHR0aGlzLmRpc3BsYXkubWFyc2hhbGwodGhpcy5pZCwgNywgW2ludCh3aWR0aCksIGludChoZWlnaHQpXSlcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0U2V0IGEgbWluaW11bSBzaXplIGZvciB0aGUgd2luZG93LlxuXHQgKlxuXHQgKlx0VGhlIGNsaWVudCBjYW4gc3BlY2lmeSBhIG1pbmltdW0gc2l6ZSBzbyB0aGF0IHRoZSBjb21wb3NpdG9yIGRvZXNcblx0ICpcdG5vdCB0cnkgdG8gY29uZmlndXJlIHRoZSB3aW5kb3cgYmVsb3cgdGhpcyBzaXplLlxuXHQgKlxuXHQgKlx0VGhlIHdpZHRoIGFuZCBoZWlnaHQgYXJndW1lbnRzIGFyZSBpbiB3aW5kb3cgZ2VvbWV0cnkgY29vcmRpbmF0ZXMuXG5cdCAqXHRTZWUgeGRnX3N1cmZhY2Uuc2V0X3dpbmRvd19nZW9tZXRyeS5cblx0ICpcblx0ICpcdFZhbHVlcyBzZXQgaW4gdGhpcyB3YXkgYXJlIGRvdWJsZS1idWZmZXJlZC4gVGhleSB3aWxsIGdldCBhcHBsaWVkXG5cdCAqXHRvbiB0aGUgbmV4dCBjb21taXQuXG5cdCAqXG5cdCAqXHRUaGUgY29tcG9zaXRvciBjYW4gdXNlIHRoaXMgaW5mb3JtYXRpb24gdG8gYWxsb3cgb3IgZGlzYWxsb3dcblx0ICpcdGRpZmZlcmVudCBzdGF0ZXMgbGlrZSBtYXhpbWl6ZSBvciBmdWxsc2NyZWVuIGFuZCBkcmF3IGFjY3VyYXRlXG5cdCAqXHRhbmltYXRpb25zLlxuXHQgKlxuXHQgKlx0U2ltaWxhcmx5LCBhIHRpbGluZyB3aW5kb3cgbWFuYWdlciBtYXkgdXNlIHRoaXMgaW5mb3JtYXRpb24gdG9cblx0ICpcdHBsYWNlIGFuZCByZXNpemUgY2xpZW50IHdpbmRvd3MgaW4gYSBtb3JlIGVmZmVjdGl2ZSB3YXkuXG5cdCAqXG5cdCAqXHRUaGUgY2xpZW50IHNob3VsZCBub3QgcmVseSBvbiB0aGUgY29tcG9zaXRvciB0byBvYmV5IHRoZSBtaW5pbXVtXG5cdCAqXHRzaXplLiBUaGUgY29tcG9zaXRvciBtYXkgZGVjaWRlIHRvIGlnbm9yZSB0aGUgdmFsdWVzIHNldCBieSB0aGVcblx0ICpcdGNsaWVudCBhbmQgcmVxdWVzdCBhIHNtYWxsZXIgc2l6ZS5cblx0ICpcblx0ICpcdElmIG5ldmVyIHNldCwgb3IgYSB2YWx1ZSBvZiB6ZXJvIGluIHRoZSByZXF1ZXN0LCBtZWFucyB0aGF0IHRoZVxuXHQgKlx0Y2xpZW50IGhhcyBubyBleHBlY3RlZCBtaW5pbXVtIHNpemUgaW4gdGhlIGdpdmVuIGRpbWVuc2lvbi5cblx0ICpcdEFzIGEgcmVzdWx0LCBhIGNsaWVudCB3aXNoaW5nIHRvIHJlc2V0IHRoZSBtaW5pbXVtIHNpemVcblx0ICpcdHRvIGFuIHVuc3BlY2lmaWVkIHN0YXRlIGNhbiB1c2UgemVybyBmb3Igd2lkdGggYW5kIGhlaWdodCBpbiB0aGVcblx0ICpcdHJlcXVlc3QuXG5cdCAqXG5cdCAqXHRSZXF1ZXN0aW5nIGEgbWluaW11bSBzaXplIHRvIGJlIGxhcmdlciB0aGFuIHRoZSBtYXhpbXVtIHNpemUgb2Zcblx0ICpcdGEgc3VyZmFjZSBpcyBpbGxlZ2FsIGFuZCB3aWxsIHJlc3VsdCBpbiBhIHByb3RvY29sIGVycm9yLlxuXHQgKlxuXHQgKlx0VGhlIHdpZHRoIGFuZCBoZWlnaHQgbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gemVyby4gVXNpbmdcblx0ICpcdHN0cmljdGx5IG5lZ2F0aXZlIHZhbHVlcyBmb3Igd2lkdGggYW5kIGhlaWdodCB3aWxsIHJlc3VsdCBpbiBhXG5cdCAqXHRwcm90b2NvbCBlcnJvci5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoICBcblx0ICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRzZXRNaW5TaXplICh3aWR0aCwgaGVpZ2h0KSB7XG5cdFx0dGhpcy5kaXNwbGF5Lm1hcnNoYWxsKHRoaXMuaWQsIDgsIFtpbnQod2lkdGgpLCBpbnQoaGVpZ2h0KV0pXG5cdH1cblxuXHQvKipcblx0ICpcblx0ICpcdE1heGltaXplIHRoZSBzdXJmYWNlLlxuXHQgKlxuXHQgKlx0QWZ0ZXIgcmVxdWVzdGluZyB0aGF0IHRoZSBzdXJmYWNlIHNob3VsZCBiZSBtYXhpbWl6ZWQsIHRoZSBjb21wb3NpdG9yXG5cdCAqXHR3aWxsIHJlc3BvbmQgYnkgZW1pdHRpbmcgYSBjb25maWd1cmUgZXZlbnQgd2l0aCB0aGUgXCJtYXhpbWl6ZWRcIiBzdGF0ZVxuXHQgKlx0YW5kIHRoZSByZXF1aXJlZCB3aW5kb3cgZ2VvbWV0cnkuIFRoZSBjbGllbnQgc2hvdWxkIHRoZW4gdXBkYXRlIGl0c1xuXHQgKlx0Y29udGVudCwgZHJhd2luZyBpdCBpbiBhIG1heGltaXplZCBzdGF0ZSwgaS5lLiB3aXRob3V0IHNoYWRvdyBvciBvdGhlclxuXHQgKlx0ZGVjb3JhdGlvbiBvdXRzaWRlIG9mIHRoZSB3aW5kb3cgZ2VvbWV0cnkuIFRoZSBjbGllbnQgbXVzdCBhbHNvXG5cdCAqXHRhY2tub3dsZWRnZSB0aGUgY29uZmlndXJlIHdoZW4gY29tbWl0dGluZyB0aGUgbmV3IGNvbnRlbnQgKHNlZVxuXHQgKlx0YWNrX2NvbmZpZ3VyZSkuXG5cdCAqXG5cdCAqXHRJdCBpcyB1cCB0byB0aGUgY29tcG9zaXRvciB0byBkZWNpZGUgaG93IGFuZCB3aGVyZSB0byBtYXhpbWl6ZSB0aGVcblx0ICpcdHN1cmZhY2UsIGZvciBleGFtcGxlIHdoaWNoIG91dHB1dCBhbmQgd2hhdCByZWdpb24gb2YgdGhlIHNjcmVlbiBzaG91bGRcblx0ICpcdGJlIHVzZWQuXG5cdCAqXG5cdCAqXHRJZiB0aGUgc3VyZmFjZSB3YXMgYWxyZWFkeSBtYXhpbWl6ZWQsIHRoZSBjb21wb3NpdG9yIHdpbGwgc3RpbGwgZW1pdFxuXHQgKlx0YSBjb25maWd1cmUgZXZlbnQgd2l0aCB0aGUgXCJtYXhpbWl6ZWRcIiBzdGF0ZS5cblx0ICpcblx0ICpcdElmIHRoZSBzdXJmYWNlIGlzIGluIGEgZnVsbHNjcmVlbiBzdGF0ZSwgdGhpcyByZXF1ZXN0IGhhcyBubyBkaXJlY3Rcblx0ICpcdGVmZmVjdC4gSXQgd2lsbCBhbHRlciB0aGUgc3RhdGUgdGhlIHN1cmZhY2UgaXMgcmV0dXJuZWQgdG8gd2hlblxuXHQgKlx0dW5tYXhpbWl6ZWQgaWYgbm90IG92ZXJyaWRkZW4gYnkgdGhlIGNvbXBvc2l0b3IuXG5cdCAqICAgICAgXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRzZXRNYXhpbWl6ZWQgKCkge1xuXHRcdHRoaXMuZGlzcGxheS5tYXJzaGFsbCh0aGlzLmlkLCA5LCBbXSlcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0VW5tYXhpbWl6ZSB0aGUgc3VyZmFjZS5cblx0ICpcblx0ICpcdEFmdGVyIHJlcXVlc3RpbmcgdGhhdCB0aGUgc3VyZmFjZSBzaG91bGQgYmUgdW5tYXhpbWl6ZWQsIHRoZSBjb21wb3NpdG9yXG5cdCAqXHR3aWxsIHJlc3BvbmQgYnkgZW1pdHRpbmcgYSBjb25maWd1cmUgZXZlbnQgd2l0aG91dCB0aGUgXCJtYXhpbWl6ZWRcIlxuXHQgKlx0c3RhdGUuIElmIGF2YWlsYWJsZSwgdGhlIGNvbXBvc2l0b3Igd2lsbCBpbmNsdWRlIHRoZSB3aW5kb3cgZ2VvbWV0cnlcblx0ICpcdGRpbWVuc2lvbnMgdGhlIHdpbmRvdyBoYWQgcHJpb3IgdG8gYmVpbmcgbWF4aW1pemVkIGluIHRoZSBjb25maWd1cmVcblx0ICpcdGV2ZW50LiBUaGUgY2xpZW50IG11c3QgdGhlbiB1cGRhdGUgaXRzIGNvbnRlbnQsIGRyYXdpbmcgaXQgaW4gYVxuXHQgKlx0cmVndWxhciBzdGF0ZSwgaS5lLiBwb3RlbnRpYWxseSB3aXRoIHNoYWRvdywgZXRjLiBUaGUgY2xpZW50IG11c3QgYWxzb1xuXHQgKlx0YWNrbm93bGVkZ2UgdGhlIGNvbmZpZ3VyZSB3aGVuIGNvbW1pdHRpbmcgdGhlIG5ldyBjb250ZW50IChzZWVcblx0ICpcdGFja19jb25maWd1cmUpLlxuXHQgKlxuXHQgKlx0SXQgaXMgdXAgdG8gdGhlIGNvbXBvc2l0b3IgdG8gcG9zaXRpb24gdGhlIHN1cmZhY2UgYWZ0ZXIgaXQgd2FzXG5cdCAqXHR1bm1heGltaXplZDsgdXN1YWxseSB0aGUgcG9zaXRpb24gdGhlIHN1cmZhY2UgaGFkIGJlZm9yZSBtYXhpbWl6aW5nLCBpZlxuXHQgKlx0YXBwbGljYWJsZS5cblx0ICpcblx0ICpcdElmIHRoZSBzdXJmYWNlIHdhcyBhbHJlYWR5IG5vdCBtYXhpbWl6ZWQsIHRoZSBjb21wb3NpdG9yIHdpbGwgc3RpbGxcblx0ICpcdGVtaXQgYSBjb25maWd1cmUgZXZlbnQgd2l0aG91dCB0aGUgXCJtYXhpbWl6ZWRcIiBzdGF0ZS5cblx0ICpcblx0ICpcdElmIHRoZSBzdXJmYWNlIGlzIGluIGEgZnVsbHNjcmVlbiBzdGF0ZSwgdGhpcyByZXF1ZXN0IGhhcyBubyBkaXJlY3Rcblx0ICpcdGVmZmVjdC4gSXQgd2lsbCBhbHRlciB0aGUgc3RhdGUgdGhlIHN1cmZhY2UgaXMgcmV0dXJuZWQgdG8gd2hlblxuXHQgKlx0dW5tYXhpbWl6ZWQgaWYgbm90IG92ZXJyaWRkZW4gYnkgdGhlIGNvbXBvc2l0b3IuXG5cdCAqICAgICAgXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHR1bnNldE1heGltaXplZCAoKSB7XG5cdFx0dGhpcy5kaXNwbGF5Lm1hcnNoYWxsKHRoaXMuaWQsIDEwLCBbXSlcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0TWFrZSB0aGUgc3VyZmFjZSBmdWxsc2NyZWVuLlxuXHQgKlxuXHQgKlx0QWZ0ZXIgcmVxdWVzdGluZyB0aGF0IHRoZSBzdXJmYWNlIHNob3VsZCBiZSBmdWxsc2NyZWVuZWQsIHRoZVxuXHQgKlx0Y29tcG9zaXRvciB3aWxsIHJlc3BvbmQgYnkgZW1pdHRpbmcgYSBjb25maWd1cmUgZXZlbnQgd2l0aCB0aGVcblx0ICpcdFwiZnVsbHNjcmVlblwiIHN0YXRlIGFuZCB0aGUgZnVsbHNjcmVlbiB3aW5kb3cgZ2VvbWV0cnkuIFRoZSBjbGllbnQgbXVzdFxuXHQgKlx0YWxzbyBhY2tub3dsZWRnZSB0aGUgY29uZmlndXJlIHdoZW4gY29tbWl0dGluZyB0aGUgbmV3IGNvbnRlbnQgKHNlZVxuXHQgKlx0YWNrX2NvbmZpZ3VyZSkuXG5cdCAqXG5cdCAqXHRUaGUgb3V0cHV0IHBhc3NlZCBieSB0aGUgcmVxdWVzdCBpbmRpY2F0ZXMgdGhlIGNsaWVudCdzIHByZWZlcmVuY2UgYXNcblx0ICpcdHRvIHdoaWNoIGRpc3BsYXkgaXQgc2hvdWxkIGJlIHNldCBmdWxsc2NyZWVuIG9uLiBJZiB0aGlzIHZhbHVlIGlzIE5VTEwsXG5cdCAqXHRpdCdzIHVwIHRvIHRoZSBjb21wb3NpdG9yIHRvIGNob29zZSB3aGljaCBkaXNwbGF5IHdpbGwgYmUgdXNlZCB0byBtYXBcblx0ICpcdHRoaXMgc3VyZmFjZS5cblx0ICpcblx0ICpcdElmIHRoZSBzdXJmYWNlIGRvZXNuJ3QgY292ZXIgdGhlIHdob2xlIG91dHB1dCwgdGhlIGNvbXBvc2l0b3Igd2lsbFxuXHQgKlx0cG9zaXRpb24gdGhlIHN1cmZhY2UgaW4gdGhlIGNlbnRlciBvZiB0aGUgb3V0cHV0IGFuZCBjb21wZW5zYXRlIHdpdGhcblx0ICpcdHdpdGggYm9yZGVyIGZpbGwgY292ZXJpbmcgdGhlIHJlc3Qgb2YgdGhlIG91dHB1dC4gVGhlIGNvbnRlbnQgb2YgdGhlXG5cdCAqXHRib3JkZXIgZmlsbCBpcyB1bmRlZmluZWQsIGJ1dCBzaG91bGQgYmUgYXNzdW1lZCB0byBiZSBpbiBzb21lIHdheSB0aGF0XG5cdCAqXHRhdHRlbXB0cyB0byBibGVuZCBpbnRvIHRoZSBzdXJyb3VuZGluZyBhcmVhIChlLmcuIHNvbGlkIGJsYWNrKS5cblx0ICpcblx0ICpcdElmIHRoZSBmdWxsc2NyZWVuZWQgc3VyZmFjZSBpcyBub3Qgb3BhcXVlLCB0aGUgY29tcG9zaXRvciBtdXN0IG1ha2Vcblx0ICpcdHN1cmUgdGhhdCBvdGhlciBzY3JlZW4gY29udGVudCBub3QgcGFydCBvZiB0aGUgc2FtZSBzdXJmYWNlIHRyZWUgKG1hZGVcblx0ICpcdHVwIG9mIHN1YnN1cmZhY2VzLCBwb3B1cHMgb3Igc2ltaWxhcmx5IGNvdXBsZWQgc3VyZmFjZXMpIGFyZSBub3Rcblx0ICpcdHZpc2libGUgYmVsb3cgdGhlIGZ1bGxzY3JlZW5lZCBzdXJmYWNlLlxuXHQgKiAgICAgIFxuXHQgKlxuXHQgKiBAcGFyYW0gez8qfSBvdXRwdXQgIFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0c2V0RnVsbHNjcmVlbiAob3V0cHV0KSB7XG5cdFx0dGhpcy5kaXNwbGF5Lm1hcnNoYWxsKHRoaXMuaWQsIDExLCBbb2JqZWN0T3B0aW9uYWwob3V0cHV0KV0pXG5cdH1cblxuXHQvKipcblx0ICpcblx0ICpcdE1ha2UgdGhlIHN1cmZhY2Ugbm8gbG9uZ2VyIGZ1bGxzY3JlZW4uXG5cdCAqXG5cdCAqXHRBZnRlciByZXF1ZXN0aW5nIHRoYXQgdGhlIHN1cmZhY2Ugc2hvdWxkIGJlIHVuZnVsbHNjcmVlbmVkLCB0aGVcblx0ICpcdGNvbXBvc2l0b3Igd2lsbCByZXNwb25kIGJ5IGVtaXR0aW5nIGEgY29uZmlndXJlIGV2ZW50IHdpdGhvdXQgdGhlXG5cdCAqXHRcImZ1bGxzY3JlZW5cIiBzdGF0ZS5cblx0ICpcblx0ICpcdE1ha2luZyBhIHN1cmZhY2UgdW5mdWxsc2NyZWVuIHNldHMgc3RhdGVzIGZvciB0aGUgc3VyZmFjZSBiYXNlZCBvbiB0aGUgZm9sbG93aW5nOlxuXHQgKlx0KiB0aGUgc3RhdGUocykgaXQgbWF5IGhhdmUgaGFkIGJlZm9yZSBiZWNvbWluZyBmdWxsc2NyZWVuXG5cdCAqXHQqIGFueSBzdGF0ZShzKSBkZWNpZGVkIGJ5IHRoZSBjb21wb3NpdG9yXG5cdCAqXHQqIGFueSBzdGF0ZShzKSByZXF1ZXN0ZWQgYnkgdGhlIGNsaWVudCB3aGlsZSB0aGUgc3VyZmFjZSB3YXMgZnVsbHNjcmVlblxuXHQgKlxuXHQgKlx0VGhlIGNvbXBvc2l0b3IgbWF5IGluY2x1ZGUgdGhlIHByZXZpb3VzIHdpbmRvdyBnZW9tZXRyeSBkaW1lbnNpb25zIGluXG5cdCAqXHR0aGUgY29uZmlndXJlIGV2ZW50LCBpZiBhcHBsaWNhYmxlLlxuXHQgKlxuXHQgKlx0VGhlIGNsaWVudCBtdXN0IGFsc28gYWNrbm93bGVkZ2UgdGhlIGNvbmZpZ3VyZSB3aGVuIGNvbW1pdHRpbmcgdGhlIG5ld1xuXHQgKlx0Y29udGVudCAoc2VlIGFja19jb25maWd1cmUpLlxuXHQgKiAgICAgIFxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0dW5zZXRGdWxsc2NyZWVuICgpIHtcblx0XHR0aGlzLmRpc3BsYXkubWFyc2hhbGwodGhpcy5pZCwgMTIsIFtdKVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXHRSZXF1ZXN0IHRoYXQgdGhlIGNvbXBvc2l0b3IgbWluaW1pemUgeW91ciBzdXJmYWNlLiBUaGVyZSBpcyBub1xuXHQgKlx0d2F5IHRvIGtub3cgaWYgdGhlIHN1cmZhY2UgaXMgY3VycmVudGx5IG1pbmltaXplZCwgbm9yIGlzIHRoZXJlXG5cdCAqXHRhbnkgd2F5IHRvIHVuc2V0IG1pbmltaXphdGlvbiBvbiB0aGlzIHN1cmZhY2UuXG5cdCAqXG5cdCAqXHRJZiB5b3UgYXJlIGxvb2tpbmcgdG8gdGhyb3R0bGUgcmVkcmF3aW5nIHdoZW4gbWluaW1pemVkLCBwbGVhc2Vcblx0ICpcdGluc3RlYWQgdXNlIHRoZSB3bF9zdXJmYWNlLmZyYW1lIGV2ZW50IGZvciB0aGlzLCBhcyB0aGlzIHdpbGxcblx0ICpcdGFsc28gd29yayB3aXRoIGxpdmUgcHJldmlld3Mgb24gd2luZG93cyBpbiBBbHQtVGFiLCBFeHBvc2Ugb3Jcblx0ICpcdHNpbWlsYXIgY29tcG9zaXRvciBmZWF0dXJlcy5cblx0ICogICAgICBcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdHNldE1pbmltaXplZCAoKSB7XG5cdFx0dGhpcy5kaXNwbGF5Lm1hcnNoYWxsKHRoaXMuaWQsIDEzLCBbXSlcblx0fVxuXG4vKipcblx0ICpAcGFyYW0ge0Rpc3BsYXl9ZGlzcGxheVxuXHQgKkBwYXJhbSB7bnVtYmVyfWlkXG5cdCAqL1xuXHRjb25zdHJ1Y3RvciAoZGlzcGxheSwgaWQpIHtcblx0XHRzdXBlcihkaXNwbGF5LCBpZClcblx0XHQvKipcblx0XHQgKiBAdHlwZSB7WGRnVG9wbGV2ZWxFdmVudHN8bnVsbH1cblx0XHQgKi9cblx0XHR0aGlzLmxpc3RlbmVyID0gbnVsbFxuXHR9XG5cblx0YXN5bmMgWzBdIChtZXNzYWdlKSB7XG5cdFx0YXdhaXQgdGhpcy5saXN0ZW5lci5jb25maWd1cmUoaShtZXNzYWdlKSwgaShtZXNzYWdlKSwgYShtZXNzYWdlLCBmYWxzZSkpXG5cdH1cblxuXHRhc3luYyBbMV0gKG1lc3NhZ2UpIHtcblx0XHRhd2FpdCB0aGlzLmxpc3RlbmVyLmNsb3NlKClcblx0fVxuXG59XG5YZGdUb3BsZXZlbFByb3h5LnByb3RvY29sTmFtZSA9ICd4ZGdfdG9wbGV2ZWwnXG5cblhkZ1RvcGxldmVsUHJveHkuUmVzaXplRWRnZSA9IHtcbiAgLyoqXG4gICAqIFxuICAgKi9cbiAgbm9uZTogMCxcbiAgLyoqXG4gICAqIFxuICAgKi9cbiAgdG9wOiAxLFxuICAvKipcbiAgICogXG4gICAqL1xuICBib3R0b206IDIsXG4gIC8qKlxuICAgKiBcbiAgICovXG4gIGxlZnQ6IDQsXG4gIC8qKlxuICAgKiBcbiAgICovXG4gIHRvcExlZnQ6IDUsXG4gIC8qKlxuICAgKiBcbiAgICovXG4gIGJvdHRvbUxlZnQ6IDYsXG4gIC8qKlxuICAgKiBcbiAgICovXG4gIHJpZ2h0OiA4LFxuICAvKipcbiAgICogXG4gICAqL1xuICB0b3BSaWdodDogOSxcbiAgLyoqXG4gICAqIFxuICAgKi9cbiAgYm90dG9tUmlnaHQ6IDEwXG59XG5cblhkZ1RvcGxldmVsUHJveHkuU3RhdGUgPSB7XG4gIC8qKlxuICAgKiB0aGUgc3VyZmFjZSBpcyBtYXhpbWl6ZWRcbiAgICovXG4gIG1heGltaXplZDogMSxcbiAgLyoqXG4gICAqIHRoZSBzdXJmYWNlIGlzIGZ1bGxzY3JlZW5cbiAgICovXG4gIGZ1bGxzY3JlZW46IDIsXG4gIC8qKlxuICAgKiB0aGUgc3VyZmFjZSBpcyBiZWluZyByZXNpemVkXG4gICAqL1xuICByZXNpemluZzogMyxcbiAgLyoqXG4gICAqIHRoZSBzdXJmYWNlIGlzIG5vdyBhY3RpdmF0ZWRcbiAgICovXG4gIGFjdGl2YXRlZDogNFxufVxuXG5leHBvcnQgZGVmYXVsdCBYZGdUb3BsZXZlbFByb3h5XG4iLCIvKlxuICpcbiAqICAgIENvcHlyaWdodCDCqSAyMDA4LTIwMTMgS3Jpc3RpYW4gSMO4Z3NiZXJnXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMyAgICAgIFJhZmFlbCBBbnRvZ25vbGxpXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMyAgICAgIEphc3BlciBTdC4gUGllcnJlXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMC0yMDEzIEludGVsIENvcnBvcmF0aW9uXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxNS0yMDE3IFNhbXN1bmcgRWxlY3Ryb25pY3MgQ28uLCBMdGRcbiAqICAgIENvcHlyaWdodCDCqSAyMDE1LTIwMTcgUmVkIEhhdCBJbmMuXG4gKlxuICogICAgUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbiAqICAgIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSxcbiAqICAgIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb25cbiAqICAgIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLFxuICogICAgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlXG4gKiAgICBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqICAgIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIChpbmNsdWRpbmcgdGhlIG5leHRcbiAqICAgIHBhcmFncmFwaCkgc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGVcbiAqICAgIFNvZnR3YXJlLlxuICpcbiAqICAgIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqICAgIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogICAgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gIElOIE5PIEVWRU5UIFNIQUxMXG4gKiAgICBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogICAgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkdcbiAqICAgIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVJcbiAqICAgIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqICBcbiAqL1xuXG4vKipcbiAqIEBpbnRlcmZhY2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgWGRnV21CYXNlRXZlbnRzIHtcblxuXHQvKipcblx0ICpcblx0ICpcdFRoZSBwaW5nIGV2ZW50IGFza3MgdGhlIGNsaWVudCBpZiBpdCdzIHN0aWxsIGFsaXZlLiBQYXNzIHRoZVxuXHQgKlx0c2VyaWFsIHNwZWNpZmllZCBpbiB0aGUgZXZlbnQgYmFjayB0byB0aGUgY29tcG9zaXRvciBieSBzZW5kaW5nXG5cdCAqXHRhIFwicG9uZ1wiIHJlcXVlc3QgYmFjayB3aXRoIHRoZSBzcGVjaWZpZWQgc2VyaWFsLiBTZWUgeGRnX3dtX2Jhc2UucGluZy5cblx0ICpcblx0ICpcdENvbXBvc2l0b3JzIGNhbiB1c2UgdGhpcyB0byBkZXRlcm1pbmUgaWYgdGhlIGNsaWVudCBpcyBzdGlsbFxuXHQgKlx0YWxpdmUuIEl0J3MgdW5zcGVjaWZpZWQgd2hhdCB3aWxsIGhhcHBlbiBpZiB0aGUgY2xpZW50IGRvZXNuJ3Rcblx0ICpcdHJlc3BvbmQgdG8gdGhlIHBpbmcgcmVxdWVzdCwgb3IgaW4gd2hhdCB0aW1lZnJhbWUuIENsaWVudHMgc2hvdWxkXG5cdCAqXHR0cnkgdG8gcmVzcG9uZCBpbiBhIHJlYXNvbmFibGUgYW1vdW50IG9mIHRpbWUuXG5cdCAqXG5cdCAqXHRBIGNvbXBvc2l0b3IgaXMgZnJlZSB0byBwaW5nIGluIGFueSB3YXkgaXQgd2FudHMsIGJ1dCBhIGNsaWVudCBtdXN0XG5cdCAqXHRhbHdheXMgcmVzcG9uZCB0byBhbnkgeGRnX3dtX2Jhc2Ugb2JqZWN0IGl0IGNyZWF0ZWQuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBzZXJpYWwgcGFzcyB0aGlzIHRvIHRoZSBwb25nIHJlcXVlc3QgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRwaW5nKHNlcmlhbCkge31cbn1cblxuIiwiLypcbiAqXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAwOC0yMDEzIEtyaXN0aWFuIEjDuGdzYmVyZ1xuICogICAgQ29weXJpZ2h0IMKpIDIwMTMgICAgICBSYWZhZWwgQW50b2dub2xsaVxuICogICAgQ29weXJpZ2h0IMKpIDIwMTMgICAgICBKYXNwZXIgU3QuIFBpZXJyZVxuICogICAgQ29weXJpZ2h0IMKpIDIwMTAtMjAxMyBJbnRlbCBDb3Jwb3JhdGlvblxuICogICAgQ29weXJpZ2h0IMKpIDIwMTUtMjAxNyBTYW1zdW5nIEVsZWN0cm9uaWNzIENvLiwgTHRkXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxNS0yMDE3IFJlZCBIYXQgSW5jLlxuICpcbiAqICAgIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4gKiAgICBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksXG4gKiAgICB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uXG4gKiAgICB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSxcbiAqICAgIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZVxuICogICAgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiAgICBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSAoaW5jbHVkaW5nIHRoZSBuZXh0XG4gKiAgICBwYXJhZ3JhcGgpIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlXG4gKiAgICBTb2Z0d2FyZS5cbiAqXG4gKiAgICBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiAgICBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqICAgIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuICBJTiBOTyBFVkVOVCBTSEFMTFxuICogICAgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqICAgIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HXG4gKiAgICBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSXG4gKiAgICBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKiAgXG4gKi9cblxuaW1wb3J0IHsgQ29ubmVjdGlvbiB9IGZyb20gJ3dlc3RmaWVsZC1ydW50aW1lLWNvbW1vbidcbmNvbnN0IHsgdWludCwgdWludE9wdGlvbmFsLCBpbnQsIGludE9wdGlvbmFsLCBmaXhlZCwgXG5cdGZpeGVkT3B0aW9uYWwsIG9iamVjdCwgb2JqZWN0T3B0aW9uYWwsIG5ld09iamVjdCwgc3RyaW5nLCBcblx0c3RyaW5nT3B0aW9uYWwsIGFycmF5LCBhcnJheU9wdGlvbmFsLCBcblx0ZmlsZURlc2NyaXB0b3JPcHRpb25hbCwgZmlsZURlc2NyaXB0b3IsIFxuaCwgdSwgaSwgZiwgbywgbiwgcywgYSB9ID0gQ29ubmVjdGlvblxuaW1wb3J0IFByb3h5IGZyb20gJy4vUHJveHknXG5pbXBvcnQgWGRnUG9zaXRpb25lclByb3h5IGZyb20gJy4vWGRnUG9zaXRpb25lclByb3h5J1xuaW1wb3J0IFhkZ1N1cmZhY2VQcm94eSBmcm9tICcuL1hkZ1N1cmZhY2VQcm94eSdcblxuLyoqXG4gKlxuICogICAgICBUaGUgeGRnX3dtX2Jhc2UgaW50ZXJmYWNlIGlzIGV4cG9zZWQgYXMgYSBnbG9iYWwgb2JqZWN0IGVuYWJsaW5nIGNsaWVudHNcbiAqICAgICAgdG8gdHVybiB0aGVpciB3bF9zdXJmYWNlcyBpbnRvIHdpbmRvd3MgaW4gYSBkZXNrdG9wIGVudmlyb25tZW50LiBJdFxuICogICAgICBkZWZpbmVzIHRoZSBiYXNpYyBmdW5jdGlvbmFsaXR5IG5lZWRlZCBmb3IgY2xpZW50cyBhbmQgdGhlIGNvbXBvc2l0b3IgdG9cbiAqICAgICAgY3JlYXRlIHdpbmRvd3MgdGhhdCBjYW4gYmUgZHJhZ2dlZCwgcmVzaXplZCwgbWF4aW1pemVkLCBldGMsIGFzIHdlbGwgYXNcbiAqICAgICAgY3JlYXRpbmcgdHJhbnNpZW50IHdpbmRvd3Mgc3VjaCBhcyBwb3B1cCBtZW51cy5cbiAqICAgIFxuICovXG5jbGFzcyBYZGdXbUJhc2VQcm94eSBleHRlbmRzIFByb3h5IHtcblxuXHQvKipcblx0ICpcblx0ICpcdERlc3Ryb3kgdGhpcyB4ZGdfd21fYmFzZSBvYmplY3QuXG5cdCAqXG5cdCAqXHREZXN0cm95aW5nIGEgYm91bmQgeGRnX3dtX2Jhc2Ugb2JqZWN0IHdoaWxlIHRoZXJlIGFyZSBzdXJmYWNlc1xuXHQgKlx0c3RpbGwgYWxpdmUgY3JlYXRlZCBieSB0aGlzIHhkZ193bV9iYXNlIG9iamVjdCBpbnN0YW5jZSBpcyBpbGxlZ2FsXG5cdCAqXHRhbmQgd2lsbCByZXN1bHQgaW4gYSBwcm90b2NvbCBlcnJvci5cblx0ICogICAgICBcblx0ICogQHNpbmNlIDFcblx0ICpcblx0ICovXG5cdGRlc3Ryb3kgKCkge1xuXHRcdHRoaXMuZGlzcGxheS5tYXJzaGFsbCh0aGlzLmlkLCAwLCBbXSlcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0Q3JlYXRlIGEgcG9zaXRpb25lciBvYmplY3QuIEEgcG9zaXRpb25lciBvYmplY3QgaXMgdXNlZCB0byBwb3NpdGlvblxuXHQgKlx0c3VyZmFjZXMgcmVsYXRpdmUgdG8gc29tZSBwYXJlbnQgc3VyZmFjZS4gU2VlIHRoZSBpbnRlcmZhY2UgZGVzY3JpcHRpb25cblx0ICpcdGFuZCB4ZGdfc3VyZmFjZS5nZXRfcG9wdXAgZm9yIGRldGFpbHMuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEByZXR1cm4ge1hkZ1Bvc2l0aW9uZXJQcm94eX0gIFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0Y3JlYXRlUG9zaXRpb25lciAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZGlzcGxheS5tYXJzaGFsbENvbnN0cnVjdG9yKHRoaXMuaWQsIDEsIFhkZ1Bvc2l0aW9uZXJQcm94eSwgW25ld09iamVjdCgpXSlcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0VGhpcyBjcmVhdGVzIGFuIHhkZ19zdXJmYWNlIGZvciB0aGUgZ2l2ZW4gc3VyZmFjZS4gV2hpbGUgeGRnX3N1cmZhY2Vcblx0ICpcdGl0c2VsZiBpcyBub3QgYSByb2xlLCB0aGUgY29ycmVzcG9uZGluZyBzdXJmYWNlIG1heSBvbmx5IGJlIGFzc2lnbmVkXG5cdCAqXHRhIHJvbGUgZXh0ZW5kaW5nIHhkZ19zdXJmYWNlLCBzdWNoIGFzIHhkZ190b3BsZXZlbCBvciB4ZGdfcG9wdXAuXG5cdCAqXG5cdCAqXHRUaGlzIGNyZWF0ZXMgYW4geGRnX3N1cmZhY2UgZm9yIHRoZSBnaXZlbiBzdXJmYWNlLiBBbiB4ZGdfc3VyZmFjZSBpc1xuXHQgKlx0dXNlZCBhcyBiYXNpcyB0byBkZWZpbmUgYSByb2xlIHRvIGEgZ2l2ZW4gc3VyZmFjZSwgc3VjaCBhcyB4ZGdfdG9wbGV2ZWxcblx0ICpcdG9yIHhkZ19wb3B1cC4gSXQgYWxzbyBtYW5hZ2VzIGZ1bmN0aW9uYWxpdHkgc2hhcmVkIGJldHdlZW4geGRnX3N1cmZhY2Vcblx0ICpcdGJhc2VkIHN1cmZhY2Ugcm9sZXMuXG5cdCAqXG5cdCAqXHRTZWUgdGhlIGRvY3VtZW50YXRpb24gb2YgeGRnX3N1cmZhY2UgZm9yIG1vcmUgZGV0YWlscyBhYm91dCB3aGF0IGFuXG5cdCAqXHR4ZGdfc3VyZmFjZSBpcyBhbmQgaG93IGl0IGlzIHVzZWQuXG5cdCAqICAgICAgXG5cdCAqXG5cdCAqIEBwYXJhbSB7Kn0gc3VyZmFjZSAgXG5cdCAqIEByZXR1cm4ge1hkZ1N1cmZhY2VQcm94eX0gIFxuXHQgKlxuXHQgKiBAc2luY2UgMVxuXHQgKlxuXHQgKi9cblx0Z2V0WGRnU3VyZmFjZSAoc3VyZmFjZSkge1xuXHRcdHJldHVybiB0aGlzLmRpc3BsYXkubWFyc2hhbGxDb25zdHJ1Y3Rvcih0aGlzLmlkLCAyLCBYZGdTdXJmYWNlUHJveHksIFtuZXdPYmplY3QoKSwgb2JqZWN0KHN1cmZhY2UpXSlcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlx0QSBjbGllbnQgbXVzdCByZXNwb25kIHRvIGEgcGluZyBldmVudCB3aXRoIGEgcG9uZyByZXF1ZXN0IG9yXG5cdCAqXHR0aGUgY2xpZW50IG1heSBiZSBkZWVtZWQgdW5yZXNwb25zaXZlLiBTZWUgeGRnX3dtX2Jhc2UucGluZy5cblx0ICogICAgICBcblx0ICpcblx0ICogQHBhcmFtIHtudW1iZXJ9IHNlcmlhbCBzZXJpYWwgb2YgdGhlIHBpbmcgZXZlbnQgXG5cdCAqXG5cdCAqIEBzaW5jZSAxXG5cdCAqXG5cdCAqL1xuXHRwb25nIChzZXJpYWwpIHtcblx0XHR0aGlzLmRpc3BsYXkubWFyc2hhbGwodGhpcy5pZCwgMywgW3VpbnQoc2VyaWFsKV0pXG5cdH1cblxuLyoqXG5cdCAqQHBhcmFtIHtEaXNwbGF5fWRpc3BsYXlcblx0ICpAcGFyYW0ge251bWJlcn1pZFxuXHQgKi9cblx0Y29uc3RydWN0b3IgKGRpc3BsYXksIGlkKSB7XG5cdFx0c3VwZXIoZGlzcGxheSwgaWQpXG5cdFx0LyoqXG5cdFx0ICogQHR5cGUge1hkZ1dtQmFzZUV2ZW50c3xudWxsfVxuXHRcdCAqL1xuXHRcdHRoaXMubGlzdGVuZXIgPSBudWxsXG5cdH1cblxuXHRhc3luYyBbMF0gKG1lc3NhZ2UpIHtcblx0XHRhd2FpdCB0aGlzLmxpc3RlbmVyLnBpbmcodShtZXNzYWdlKSlcblx0fVxuXG59XG5YZGdXbUJhc2VQcm94eS5wcm90b2NvbE5hbWUgPSAneGRnX3dtX2Jhc2UnXG5cblhkZ1dtQmFzZVByb3h5LkVycm9yID0ge1xuICAvKipcbiAgICogZ2l2ZW4gd2xfc3VyZmFjZSBoYXMgYW5vdGhlciByb2xlXG4gICAqL1xuICByb2xlOiAwLFxuICAvKipcbiAgICogeGRnX3dtX2Jhc2Ugd2FzIGRlc3Ryb3llZCBiZWZvcmUgY2hpbGRyZW5cbiAgICovXG4gIGRlZnVuY3RTdXJmYWNlczogMSxcbiAgLyoqXG4gICAqIHRoZSBjbGllbnQgdHJpZWQgdG8gbWFwIG9yIGRlc3Ryb3kgYSBub24tdG9wbW9zdCBwb3B1cFxuICAgKi9cbiAgbm90VGhlVG9wbW9zdFBvcHVwOiAyLFxuICAvKipcbiAgICogdGhlIGNsaWVudCBzcGVjaWZpZWQgYW4gaW52YWxpZCBwb3B1cCBwYXJlbnQgc3VyZmFjZVxuICAgKi9cbiAgaW52YWxpZFBvcHVwUGFyZW50OiAzLFxuICAvKipcbiAgICogdGhlIGNsaWVudCBwcm92aWRlZCBhbiBpbnZhbGlkIHN1cmZhY2Ugc3RhdGVcbiAgICovXG4gIGludmFsaWRTdXJmYWNlU3RhdGU6IDQsXG4gIC8qKlxuICAgKiB0aGUgY2xpZW50IHByb3ZpZGVkIGFuIGludmFsaWQgcG9zaXRpb25lclxuICAgKi9cbiAgaW52YWxpZFBvc2l0aW9uZXI6IDVcbn1cblxuZXhwb3J0IGRlZmF1bHQgWGRnV21CYXNlUHJveHlcbiIsImltcG9ydCBDb25uZWN0aW9uIGZyb20gJy4vc3JjL0Nvbm5lY3Rpb24nXG5pbXBvcnQgRml4ZWQgZnJvbSAnLi9zcmMvRml4ZWQnXG5pbXBvcnQgV2ViRkQgZnJvbSAnLi9zcmMvV2ViRkQnXG5pbXBvcnQgV2xPYmplY3QgZnJvbSAnLi9zcmMvV2xPYmplY3QnXG5cbmV4cG9ydCB7XG4gIENvbm5lY3Rpb24sXG4gIEZpeGVkLFxuICBXZWJGRCxcbiAgV2xPYmplY3Rcbn0iLCIvKlxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDE3IEVyaWsgRGUgUmlqY2tlXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuICBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbiAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuKi9cblxuJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBGaXhlZCBmcm9tICcuL0ZpeGVkJ1xuXG5jbGFzcyBDb25uZWN0aW9uIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhcmdcbiAgICogQHJldHVybnMge3t2YWx1ZTogbnVtYmVyLCB0eXBlOiAndScsIHNpemU6IG51bWJlciwgb3B0aW9uYWw6IGJvb2xlYW4sIF9tYXJzaGFsbEFyZzogZnVuY3Rpb24oe2J1ZmZlcjogQXJyYXlCdWZmZXIsIGZkczogQXJyYXk8V2ViRkQ+LCBidWZmZXJPZmZzZXQ6IG51bWJlcn0pOnZvaWR9fVxuICAgKi9cbiAgc3RhdGljIHVpbnQgKGFyZykge1xuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZTogYXJnLFxuICAgICAgdHlwZTogJ3UnLFxuICAgICAgc2l6ZTogNCxcbiAgICAgIG9wdGlvbmFsOiBmYWxzZSxcbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7e2J1ZmZlcjogQXJyYXlCdWZmZXIsIGZkczogQXJyYXk8V2ViRkQ+LCBidWZmZXJPZmZzZXQ6IG51bWJlcn19IHdpcmVNc2dcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIF9tYXJzaGFsbEFyZzogZnVuY3Rpb24gKHdpcmVNc2cpIHtcbiAgICAgICAgbmV3IFVpbnQzMkFycmF5KHdpcmVNc2cuYnVmZmVyLCB3aXJlTXNnLmJ1ZmZlck9mZnNldCwgMSlbMF0gPSB0aGlzLnZhbHVlXG4gICAgICAgIHdpcmVNc2cuYnVmZmVyT2Zmc2V0ICs9IHRoaXMuc2l6ZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gYXJnXG4gICAqIEByZXR1cm5zIHt7dmFsdWU6IG51bWJlciwgdHlwZTogJ3UnLCBzaXplOiBudW1iZXIsIG9wdGlvbmFsOiBib29sZWFuLCBfbWFyc2hhbGxBcmc6IGZ1bmN0aW9uKHtidWZmZXI6IEFycmF5QnVmZmVyLCBmZHM6IEFycmF5PFdlYkZEPiwgYnVmZmVyT2Zmc2V0OiBudW1iZXJ9KTp2b2lkfX1cbiAgICpcbiAgICovXG4gIHN0YXRpYyB1aW50T3B0aW9uYWwgKGFyZykge1xuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZTogYXJnLFxuICAgICAgdHlwZTogJ3UnLFxuICAgICAgc2l6ZTogNCxcbiAgICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHt7YnVmZmVyOiBBcnJheUJ1ZmZlciwgZmRzOiBBcnJheTxXZWJGRD4sIGJ1ZmZlck9mZnNldDogbnVtYmVyfX0gd2lyZU1zZ1xuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgX21hcnNoYWxsQXJnOiBmdW5jdGlvbiAod2lyZU1zZykge1xuICAgICAgICBuZXcgVWludDMyQXJyYXkod2lyZU1zZy5idWZmZXIsIHdpcmVNc2cuYnVmZmVyT2Zmc2V0LCAxKVswXSA9IChhcmcgPT09IG51bGwgPyAwIDogdGhpcy52YWx1ZSlcbiAgICAgICAgd2lyZU1zZy5idWZmZXJPZmZzZXQgKz0gdGhpcy5zaXplXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7V2ViRkR9IGFyZ1xuICAgKiBAcmV0dXJucyB7e3ZhbHVlOiBudW1iZXIsIHR5cGU6ICdoJywgc2l6ZTogbnVtYmVyLCBvcHRpb25hbDogYm9vbGVhbiwgX21hcnNoYWxsQXJnOiBmdW5jdGlvbih7YnVmZmVyOiBBcnJheUJ1ZmZlciwgZmRzOiBBcnJheTxXZWJGRD4sIGJ1ZmZlck9mZnNldDogbnVtYmVyfSk6dm9pZH19XG4gICAqXG4gICAqL1xuICBzdGF0aWMgZmlsZURlc2NyaXB0b3IgKGFyZykge1xuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZTogYXJnLFxuICAgICAgdHlwZTogJ2gnLFxuICAgICAgc2l6ZTogMCwgLy8gZmlsZSBkZXNjcmlwdG9ycyBhcmUgbm90IGFkZGVkIHRvIHRoZSBtZXNzYWdlIHNpemUgYmVjYXVzZSB0aGV5IGFyZSBzb21ld2hhdCBjb25zaWRlcmVkIG1ldGEgZGF0YS5cbiAgICAgIG9wdGlvbmFsOiBmYWxzZSxcbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7e2J1ZmZlcjogQXJyYXlCdWZmZXIsIGZkczogQXJyYXk8V2ViRkQ+LCBidWZmZXJPZmZzZXQ6IG51bWJlcn19IHdpcmVNc2dcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIF9tYXJzaGFsbEFyZzogZnVuY3Rpb24gKHdpcmVNc2cpIHtcbiAgICAgICAgd2lyZU1zZy5mZHMucHVzaCh0aGlzLnZhbHVlKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gYXJnXG4gICAqIEByZXR1cm5zIHt7dmFsdWU6IG51bWJlciwgdHlwZTogJ2gnLCBzaXplOiBudW1iZXIsIG9wdGlvbmFsOiBib29sZWFuLCBfbWFyc2hhbGxBcmc6IGZ1bmN0aW9uKHtidWZmZXI6IEFycmF5QnVmZmVyLCBmZHM6IEFycmF5PFdlYkZEPiwgYnVmZmVyT2Zmc2V0OiBudW1iZXJ9KTp2b2lkfX1cbiAgICpcbiAgICovXG4gIHN0YXRpYyBmaWxlRGVzY3JpcHRvck9wdGlvbmFsIChhcmcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsdWU6IGFyZyxcbiAgICAgIHR5cGU6ICdoJyxcbiAgICAgIHNpemU6IDAsIC8vIGZpbGUgZGVzY3JpcHRvcnMgYXJlIG5vdCBhZGRlZCB0byB0aGUgbWVzc2FnZSBzaXplIGJlY2F1c2UgdGhleSBhcmUgbm90IHBhcnQgb2YgdGhlIHVuaXggc29ja2V0IG1lc3NhZ2UgYnVmZmVyLlxuICAgICAgb3B0aW9uYWw6IHRydWUsXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge3tidWZmZXI6IEFycmF5QnVmZmVyLCBmZHM6IEFycmF5PFdlYkZEPiwgYnVmZmVyT2Zmc2V0OiBudW1iZXJ9fSB3aXJlTXNnXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBfbWFyc2hhbGxBcmc6IGZ1bmN0aW9uICh3aXJlTXNnKSB7XG4gICAgICAgIHdpcmVNc2cuZmRzLnB1c2godGhpcy52YWx1ZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGFyZ1xuICAgKiBAcmV0dXJucyB7e3ZhbHVlOiBudW1iZXIsIHR5cGU6ICdpJywgc2l6ZTogbnVtYmVyLCBvcHRpb25hbDogYm9vbGVhbiwgX21hcnNoYWxsQXJnOiBmdW5jdGlvbih7YnVmZmVyOiBBcnJheUJ1ZmZlciwgZmRzOiBBcnJheTxXZWJGRD4sIGJ1ZmZlck9mZnNldDogbnVtYmVyfSk6dm9pZH19XG4gICAqXG4gICAqL1xuICBzdGF0aWMgaW50IChhcmcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsdWU6IGFyZyxcbiAgICAgIHR5cGU6ICdpJyxcbiAgICAgIHNpemU6IDQsXG4gICAgICBvcHRpb25hbDogZmFsc2UsXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge3tidWZmZXI6IEFycmF5QnVmZmVyLCBmZHM6IEFycmF5PFdlYkZEPiwgYnVmZmVyT2Zmc2V0OiBudW1iZXJ9fSB3aXJlTXNnXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBfbWFyc2hhbGxBcmc6IGZ1bmN0aW9uICh3aXJlTXNnKSB7XG4gICAgICAgIG5ldyBJbnQzMkFycmF5KHdpcmVNc2cuYnVmZmVyLCB3aXJlTXNnLmJ1ZmZlck9mZnNldCwgMSlbMF0gPSB0aGlzLnZhbHVlXG4gICAgICAgIHdpcmVNc2cuYnVmZmVyT2Zmc2V0ICs9IHRoaXMuc2l6ZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gYXJnXG4gICAqIEByZXR1cm5zIHt7dmFsdWU6IG51bWJlciwgdHlwZTogJ2knLCBzaXplOiBudW1iZXIsIG9wdGlvbmFsOiBib29sZWFuLCBfbWFyc2hhbGxBcmc6IGZ1bmN0aW9uKHtidWZmZXI6IEFycmF5QnVmZmVyLCBmZHM6IEFycmF5PFdlYkZEPiwgYnVmZmVyT2Zmc2V0OiBudW1iZXJ9KTp2b2lkfX1cbiAgICpcbiAgICovXG4gIHN0YXRpYyBpbnRPcHRpb25hbCAoYXJnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbHVlOiBhcmcsXG4gICAgICB0eXBlOiAnaScsXG4gICAgICBzaXplOiA0LFxuICAgICAgb3B0aW9uYWw6IHRydWUsXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge3tidWZmZXI6IEFycmF5QnVmZmVyLCBmZHM6IEFycmF5PFdlYkZEPiwgYnVmZmVyT2Zmc2V0OiBudW1iZXJ9fSB3aXJlTXNnXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBfbWFyc2hhbGxBcmc6IGZ1bmN0aW9uICh3aXJlTXNnKSB7XG4gICAgICAgIG5ldyBJbnQzMkFycmF5KHdpcmVNc2cuYnVmZmVyLCB3aXJlTXNnLmJ1ZmZlck9mZnNldCwgMSlbMF0gPSAoYXJnID09PSBudWxsID8gMCA6IHRoaXMudmFsdWUpXG4gICAgICAgIHdpcmVNc2cuYnVmZmVyT2Zmc2V0ICs9IHRoaXMuc2l6ZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge0ZpeGVkfSBhcmdcbiAgICogQHJldHVybnMge3t2YWx1ZTogRml4ZWQsIHR5cGU6ICdmJywgc2l6ZTogbnVtYmVyLCBvcHRpb25hbDogYm9vbGVhbiwgX21hcnNoYWxsQXJnOiBmdW5jdGlvbih7YnVmZmVyOiBBcnJheUJ1ZmZlciwgZmRzOiBBcnJheTxXZWJGRD4sIGJ1ZmZlck9mZnNldDogbnVtYmVyfSk6dm9pZH19XG4gICAqL1xuICBzdGF0aWMgZml4ZWQgKGFyZykge1xuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZTogYXJnLFxuICAgICAgdHlwZTogJ2YnLFxuICAgICAgc2l6ZTogNCxcbiAgICAgIG9wdGlvbmFsOiBmYWxzZSxcbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7e2J1ZmZlcjogQXJyYXlCdWZmZXIsIGZkczogQXJyYXk8V2ViRkQ+LCBidWZmZXJPZmZzZXQ6IG51bWJlcn19IHdpcmVNc2dcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIF9tYXJzaGFsbEFyZzogZnVuY3Rpb24gKHdpcmVNc2cpIHtcbiAgICAgICAgbmV3IEludDMyQXJyYXkod2lyZU1zZy5idWZmZXIsIHdpcmVNc2cuYnVmZmVyT2Zmc2V0LCAxKVswXSA9IHRoaXMudmFsdWUuX3Jhd1xuICAgICAgICB3aXJlTXNnLmJ1ZmZlck9mZnNldCArPSB0aGlzLnNpemVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtGaXhlZH0gYXJnXG4gICAqIEByZXR1cm5zIHt7dmFsdWU6IEZpeGVkLCB0eXBlOiAnZicsIHNpemU6IG51bWJlciwgb3B0aW9uYWw6IGJvb2xlYW4sIF9tYXJzaGFsbEFyZzogZnVuY3Rpb24oe2J1ZmZlcjogQXJyYXlCdWZmZXIsIGZkczogQXJyYXk8V2ViRkQ+LCBidWZmZXJPZmZzZXQ6IG51bWJlcn0pOnZvaWR9fVxuICAgKi9cbiAgc3RhdGljIGZpeGVkT3B0aW9uYWwgKGFyZykge1xuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZTogYXJnLFxuICAgICAgdHlwZTogJ2YnLFxuICAgICAgc2l6ZTogNCxcbiAgICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHt7YnVmZmVyOiBBcnJheUJ1ZmZlciwgZmRzOiBBcnJheTxXZWJGRD4sIGJ1ZmZlck9mZnNldDogbnVtYmVyfX0gd2lyZU1zZ1xuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgX21hcnNoYWxsQXJnOiBmdW5jdGlvbiAod2lyZU1zZykge1xuICAgICAgICBuZXcgSW50MzJBcnJheSh3aXJlTXNnLmJ1ZmZlciwgd2lyZU1zZy5idWZmZXJPZmZzZXQsIDEpWzBdID0gKGFyZyA9PT0gbnVsbCA/IDAgOiB0aGlzLnZhbHVlLl9yYXcpXG4gICAgICAgIHdpcmVNc2cuYnVmZmVyT2Zmc2V0ICs9IHRoaXMuc2l6ZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge1Jlc291cmNlfSBhcmdcbiAgICogQHJldHVybnMge3t2YWx1ZTogUmVzb3VyY2UsIHR5cGU6ICdvJywgc2l6ZTogbnVtYmVyLCBvcHRpb25hbDogYm9vbGVhbiwgX21hcnNoYWxsQXJnOiBmdW5jdGlvbih7YnVmZmVyOiBBcnJheUJ1ZmZlciwgZmRzOiBBcnJheTxXZWJGRD4sIGJ1ZmZlck9mZnNldDogbnVtYmVyfSk6dm9pZH19XG4gICAqXG4gICAqL1xuICBzdGF0aWMgb2JqZWN0IChhcmcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsdWU6IGFyZyxcbiAgICAgIHR5cGU6ICdvJyxcbiAgICAgIHNpemU6IDQsXG4gICAgICBvcHRpb25hbDogZmFsc2UsXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge3tidWZmZXI6IEFycmF5QnVmZmVyLCBmZHM6IEFycmF5PFdlYkZEPiwgYnVmZmVyT2Zmc2V0OiBudW1iZXJ9fSB3aXJlTXNnXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBfbWFyc2hhbGxBcmc6IGZ1bmN0aW9uICh3aXJlTXNnKSB7XG4gICAgICAgIG5ldyBVaW50MzJBcnJheSh3aXJlTXNnLmJ1ZmZlciwgd2lyZU1zZy5idWZmZXJPZmZzZXQsIDEpWzBdID0gdGhpcy52YWx1ZS5pZFxuICAgICAgICB3aXJlTXNnLmJ1ZmZlck9mZnNldCArPSB0aGlzLnNpemVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtSZXNvdXJjZX0gYXJnXG4gICAqIEByZXR1cm5zIHt7dmFsdWU6IFJlc291cmNlLCB0eXBlOiAnbycsIHNpemU6IG51bWJlciwgb3B0aW9uYWw6IGJvb2xlYW4sIF9tYXJzaGFsbEFyZzogZnVuY3Rpb24oe2J1ZmZlcjogQXJyYXlCdWZmZXIsIGZkczogQXJyYXk8V2ViRkQ+LCBidWZmZXJPZmZzZXQ6IG51bWJlcn0pOnZvaWR9fVxuICAgKlxuICAgKi9cbiAgc3RhdGljIG9iamVjdE9wdGlvbmFsIChhcmcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsdWU6IGFyZyxcbiAgICAgIHR5cGU6ICdvJyxcbiAgICAgIHNpemU6IDQsXG4gICAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7e2J1ZmZlcjogQXJyYXlCdWZmZXIsIGZkczogQXJyYXk8V2ViRkQ+LCBidWZmZXJPZmZzZXQ6IG51bWJlcn19IHdpcmVNc2dcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIF9tYXJzaGFsbEFyZzogZnVuY3Rpb24gKHdpcmVNc2cpIHtcbiAgICAgICAgbmV3IFVpbnQzMkFycmF5KHdpcmVNc2cuYnVmZmVyLCB3aXJlTXNnLmJ1ZmZlck9mZnNldCwgMSlbMF0gPSAoYXJnID09PSBudWxsID8gMCA6IHRoaXMudmFsdWUuaWQpXG4gICAgICAgIHdpcmVNc2cuYnVmZmVyT2Zmc2V0ICs9IHRoaXMuc2l6ZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7e3ZhbHVlOiBudW1iZXIsIHR5cGU6ICduJywgc2l6ZTogbnVtYmVyLCBvcHRpb25hbDogYm9vbGVhbiwgX21hcnNoYWxsQXJnOiBmdW5jdGlvbih7YnVmZmVyOiBBcnJheUJ1ZmZlciwgZmRzOiBBcnJheTxXZWJGRD4sIGJ1ZmZlck9mZnNldDogbnVtYmVyfSk6dm9pZH19XG4gICAqL1xuICBzdGF0aWMgbmV3T2JqZWN0ICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsdWU6IDAsIC8vIGlkIGZpbGxlZCBpbiBieSBfbWFyc2hhbGxDb25zdHJ1Y3RvclxuICAgICAgdHlwZTogJ24nLFxuICAgICAgc2l6ZTogNCxcbiAgICAgIG9wdGlvbmFsOiBmYWxzZSxcbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHt7YnVmZmVyOiBBcnJheUJ1ZmZlciwgZmRzOiBBcnJheTxXZWJGRD4sIGJ1ZmZlck9mZnNldDogbnVtYmVyfX0gd2lyZU1zZ1xuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgX21hcnNoYWxsQXJnOiBmdW5jdGlvbiAod2lyZU1zZykge1xuICAgICAgICBuZXcgVWludDMyQXJyYXkod2lyZU1zZy5idWZmZXIsIHdpcmVNc2cuYnVmZmVyT2Zmc2V0LCAxKVswXSA9IHRoaXMudmFsdWVcbiAgICAgICAgd2lyZU1zZy5idWZmZXJPZmZzZXQgKz0gdGhpcy5zaXplXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhcmdcbiAgICogQHJldHVybnMge3t2YWx1ZTogc3RyaW5nLCB0eXBlOiAncycsIHNpemU6IG51bWJlciwgb3B0aW9uYWw6IGJvb2xlYW4sIF9tYXJzaGFsbEFyZzogZnVuY3Rpb24oe2J1ZmZlcjogQXJyYXlCdWZmZXIsIGZkczogQXJyYXk8V2ViRkQ+LCBidWZmZXJPZmZzZXQ6IG51bWJlcn0pOnZvaWR9fVxuICAgKlxuICAgKi9cbiAgc3RhdGljIHN0cmluZyAoYXJnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbHVlOiBgJHthcmd9XFwwYCxcbiAgICAgIHR5cGU6ICdzJyxcbiAgICAgIHNpemU6IDQgKyAoZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBmYW5jeSBsb2dpYyB0byBjYWxjdWxhdGUgc2l6ZSB3aXRoIHBhZGRpbmcgdG8gYSBtdWx0aXBsZSBvZiA0IGJ5dGVzIChpbnQpLlxuICAgICAgICAvLyBsZW5ndGgrMSBmb3IgbnVsbCB0ZXJtaW5hdG9yXG4gICAgICAgIHJldHVybiAoYXJnLmxlbmd0aCArIDEgKyAzKSAmIH4zXG4gICAgICB9KSgpLFxuICAgICAgb3B0aW9uYWw6IGZhbHNlLFxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge3tidWZmZXI6IEFycmF5QnVmZmVyLCBmZHM6IEFycmF5PFdlYkZEPiwgYnVmZmVyT2Zmc2V0OiBudW1iZXJ9fSB3aXJlTXNnXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBfbWFyc2hhbGxBcmc6IGZ1bmN0aW9uICh3aXJlTXNnKSB7XG4gICAgICAgIG5ldyBVaW50MzJBcnJheSh3aXJlTXNnLmJ1ZmZlciwgd2lyZU1zZy5idWZmZXJPZmZzZXQsIDEpWzBdID0gdGhpcy52YWx1ZS5sZW5ndGhcblxuICAgICAgICBjb25zdCBzdHJMZW4gPSB0aGlzLnZhbHVlLmxlbmd0aFxuICAgICAgICBjb25zdCBidWY4ID0gbmV3IFVpbnQ4QXJyYXkod2lyZU1zZy5idWZmZXIsIHdpcmVNc2cuYnVmZmVyT2Zmc2V0ICsgNCwgc3RyTGVuKVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ckxlbjsgaSsrKSB7XG4gICAgICAgICAgYnVmOFtpXSA9IHRoaXMudmFsdWVbaV0uY29kZVBvaW50QXQoMClcbiAgICAgICAgfVxuICAgICAgICB3aXJlTXNnLmJ1ZmZlck9mZnNldCArPSB0aGlzLnNpemVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGFyZ1xuICAgKiBAcmV0dXJucyB7e3ZhbHVlOiAqLCB0eXBlOiAncycsIHNpemU6IG51bWJlciwgb3B0aW9uYWw6IGJvb2xlYW4sIF9tYXJzaGFsbEFyZzogZnVuY3Rpb24oe2J1ZmZlcjogQXJyYXlCdWZmZXIsIGZkczogQXJyYXk8V2ViRkQ+LCBidWZmZXJPZmZzZXQ6IG51bWJlcn0pOnZvaWR9fVxuICAgKlxuICAgKi9cbiAgc3RhdGljIHN0cmluZ09wdGlvbmFsIChhcmcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsdWU6IGAke2FyZ31cXDBgLFxuICAgICAgdHlwZTogJ3MnLFxuICAgICAgc2l6ZTogNCArIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChhcmcgPT09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gMFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGZhbmN5IGxvZ2ljIHRvIGNhbGN1bGF0ZSBzaXplIHdpdGggcGFkZGluZyB0byBhIG11bHRpcGxlIG9mIDQgYnl0ZXMgKGludCkuXG4gICAgICAgICAgLy8gbGVuZ3RoKzEgZm9yIG51bGwgdGVybWluYXRvclxuICAgICAgICAgIHJldHVybiAoYXJnLmxlbmd0aCArIDEgKyAzKSAmIH4zXG4gICAgICAgIH1cbiAgICAgIH0pKCksXG4gICAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7e2J1ZmZlcjogQXJyYXlCdWZmZXIsIGZkczogQXJyYXk8V2ViRkQ+LCBidWZmZXJPZmZzZXQ6IG51bWJlcn19IHdpcmVNc2dcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIF9tYXJzaGFsbEFyZzogZnVuY3Rpb24gKHdpcmVNc2cpIHtcbiAgICAgICAgaWYgKHRoaXMudmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICBuZXcgVWludDMyQXJyYXkod2lyZU1zZy5idWZmZXIsIHdpcmVNc2cuYnVmZmVyT2Zmc2V0LCAxKVswXSA9IDBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXcgVWludDMyQXJyYXkod2lyZU1zZy5idWZmZXIsIHdpcmVNc2cuYnVmZmVyT2Zmc2V0LCAxKVswXSA9IHRoaXMudmFsdWUubGVuZ3RoXG5cbiAgICAgICAgICBjb25zdCBzdHJMZW4gPSB0aGlzLnZhbHVlLmxlbmd0aFxuICAgICAgICAgIGNvbnN0IGJ1ZjggPSBuZXcgVWludDhBcnJheSh3aXJlTXNnLmJ1ZmZlciwgd2lyZU1zZy5idWZmZXJPZmZzZXQgKyA0LCBzdHJMZW4pXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHJMZW47IGkrKykge1xuICAgICAgICAgICAgYnVmOFtpXSA9IHRoaXMudmFsdWVbaV0uY29kZVBvaW50QXQoMClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgd2lyZU1zZy5idWZmZXJPZmZzZXQgKz0gdGhpcy5zaXplXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7VHlwZWRBcnJheX0gYXJnXG4gICAqIEByZXR1cm5zIHt7dmFsdWU6ICosIHR5cGU6ICdhJywgc2l6ZTogbnVtYmVyLCBvcHRpb25hbDogYm9vbGVhbiwgX21hcnNoYWxsQXJnOiBmdW5jdGlvbih7YnVmZmVyOiBBcnJheUJ1ZmZlciwgZmRzOiBBcnJheTxXZWJGRD4sIGJ1ZmZlck9mZnNldDogbnVtYmVyfSk6dm9pZH19XG4gICAqXG4gICAqL1xuICBzdGF0aWMgYXJyYXkgKGFyZykge1xuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZTogYXJnLFxuICAgICAgdHlwZTogJ2EnLFxuICAgICAgc2l6ZTogNCArIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGZhbmN5IGxvZ2ljIHRvIGNhbGN1bGF0ZSBzaXplIHdpdGggcGFkZGluZyB0byBhIG11bHRpcGxlIG9mIDQgYnl0ZXMgKGludCkuXG4gICAgICAgIHJldHVybiAoYXJnLmJ5dGVMZW5ndGggKyAzKSAmIH4zXG4gICAgICB9KSgpLFxuICAgICAgb3B0aW9uYWw6IGZhbHNlLFxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHt7YnVmZmVyOiBBcnJheUJ1ZmZlciwgZmRzOiBBcnJheTxXZWJGRD4sIGJ1ZmZlck9mZnNldDogbnVtYmVyfX0gd2lyZU1zZ1xuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgX21hcnNoYWxsQXJnOiBmdW5jdGlvbiAod2lyZU1zZykge1xuICAgICAgICBuZXcgVWludDMyQXJyYXkod2lyZU1zZy5idWZmZXIsIHdpcmVNc2cuYnVmZmVyT2Zmc2V0LCAxKVswXSA9IHRoaXMudmFsdWUuYnl0ZUxlbmd0aFxuXG4gICAgICAgIGNvbnN0IGJ5dGVMZW5ndGggPSB0aGlzLnZhbHVlLmJ5dGVMZW5ndGhcbiAgICAgICAgbmV3IFVpbnQ4QXJyYXkod2lyZU1zZy5idWZmZXIsIHdpcmVNc2cuYnVmZmVyT2Zmc2V0ICsgNCwgYnl0ZUxlbmd0aCkuc2V0KG5ldyBVaW50OEFycmF5KHRoaXMudmFsdWUuYnVmZmVyLCAwLCBieXRlTGVuZ3RoKSlcblxuICAgICAgICB3aXJlTXNnLmJ1ZmZlck9mZnNldCArPSB0aGlzLnNpemVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtUeXBlZEFycmF5fSBhcmdcbiAgICogQHJldHVybnMge3t2YWx1ZTogKiwgdHlwZTogJ2EnLCBzaXplOiBudW1iZXIsIG9wdGlvbmFsOiBib29sZWFuLCBfbWFyc2hhbGxBcmc6IGZ1bmN0aW9uKHtidWZmZXI6IEFycmF5QnVmZmVyLCBmZHM6IEFycmF5PFdlYkZEPiwgYnVmZmVyT2Zmc2V0OiBudW1iZXJ9KTp2b2lkfX1cbiAgICpcbiAgICovXG4gIHN0YXRpYyBhcnJheU9wdGlvbmFsIChhcmcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsdWU6IGFyZyxcbiAgICAgIHR5cGU6ICdhJyxcbiAgICAgIHNpemU6IDQgKyAoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoYXJnID09PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIDBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBmYW5jeSBsb2dpYyB0byBjYWxjdWxhdGUgc2l6ZSB3aXRoIHBhZGRpbmcgdG8gYSBtdWx0aXBsZSBvZiA0IGJ5dGVzIChpbnQpLlxuICAgICAgICAgIHJldHVybiAoYXJnLmJ5dGVMZW5ndGggKyAzKSAmIH4zXG4gICAgICAgIH1cbiAgICAgIH0pKCksXG4gICAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICAgIF9tYXJzaGFsbEFyZzogZnVuY3Rpb24gKHdpcmVNc2cpIHtcbiAgICAgICAgaWYgKHRoaXMudmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICBuZXcgVWludDMyQXJyYXkod2lyZU1zZy5idWZmZXIsIHdpcmVNc2cuYnVmZmVyT2Zmc2V0LCAxKVswXSA9IDBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXcgVWludDMyQXJyYXkod2lyZU1zZy5idWZmZXIsIHdpcmVNc2cuYnVmZmVyT2Zmc2V0LCAxKVswXSA9IHRoaXMudmFsdWUuYnl0ZUxlbmd0aFxuXG4gICAgICAgICAgY29uc3QgYnl0ZUxlbmd0aCA9IHRoaXMudmFsdWUuYnl0ZUxlbmd0aFxuICAgICAgICAgIG5ldyBVaW50OEFycmF5KHdpcmVNc2cuYnVmZmVyLCB3aXJlTXNnLmJ1ZmZlck9mZnNldCArIDQsIGJ5dGVMZW5ndGgpLnNldChuZXcgVWludDhBcnJheSh0aGlzLnZhbHVlLmJ1ZmZlciwgMCwgYnl0ZUxlbmd0aCkpXG4gICAgICAgIH1cbiAgICAgICAgd2lyZU1zZy5idWZmZXJPZmZzZXQgKz0gdGhpcy5zaXplXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7e2J1ZmZlcjogVWludDMyQXJyYXksIGZkczogQXJyYXk8V2ViRkQ+LCBidWZmZXJPZmZzZXQ6IG51bWJlciwgY29uc3VtZWQ6IG51bWJlciwgc2l6ZTogbnVtYmVyfX0gbWVzc2FnZVxuICAgKiBAcGFyYW0ge251bWJlcn1jb25zdW1wdGlvblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhdGljIF9jaGVja01lc3NhZ2VTaXplIChtZXNzYWdlLCBjb25zdW1wdGlvbikge1xuICAgIGlmIChtZXNzYWdlLmNvbnN1bWVkICsgY29uc3VtcHRpb24gPiBtZXNzYWdlLnNpemUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgUmVxdWVzdCB0b28gc2hvcnQuYClcbiAgICB9IGVsc2Uge1xuICAgICAgbWVzc2FnZS5jb25zdW1lZCArPSBjb25zdW1wdGlvblxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge3tidWZmZXI6IFVpbnQzMkFycmF5LCBmZHM6IEFycmF5PFdlYkZEPiwgYnVmZmVyT2Zmc2V0OiBudW1iZXIsIGNvbnN1bWVkOiBudW1iZXIsIHNpemU6IG51bWJlcn19IG1lc3NhZ2VcbiAgICogQHJldHVybnMge251bWJlcn1cbiAgICovXG4gIHN0YXRpYyB1IChtZXNzYWdlKSB7IC8vIHVuc2lnbmVkIGludGVnZXIge251bWJlcn1cbiAgICBDb25uZWN0aW9uLl9jaGVja01lc3NhZ2VTaXplKG1lc3NhZ2UsIDQpXG4gICAgcmV0dXJuIG1lc3NhZ2UuYnVmZmVyW21lc3NhZ2UuYnVmZmVyT2Zmc2V0KytdXG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHt7YnVmZmVyOiBVaW50MzJBcnJheSwgZmRzOiBBcnJheTxXZWJGRD4sIGJ1ZmZlck9mZnNldDogbnVtYmVyLCBjb25zdW1lZDogbnVtYmVyLCBzaXplOiBudW1iZXJ9fSBtZXNzYWdlXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAqL1xuICBzdGF0aWMgaSAobWVzc2FnZSkge1xuICAgIENvbm5lY3Rpb24uX2NoZWNrTWVzc2FnZVNpemUobWVzc2FnZSwgNClcbiAgICBjb25zdCBhcmcgPSBuZXcgSW50MzJBcnJheShtZXNzYWdlLmJ1ZmZlci5idWZmZXIsIG1lc3NhZ2UuYnVmZmVyLmJ5dGVPZmZzZXQgKyAobWVzc2FnZS5idWZmZXJPZmZzZXQgKiBVaW50MzJBcnJheS5CWVRFU19QRVJfRUxFTUVOVCksIDEpWzBdXG4gICAgbWVzc2FnZS5idWZmZXJPZmZzZXQgKz0gMVxuICAgIHJldHVybiBhcmdcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge3tidWZmZXI6IFVpbnQzMkFycmF5LCBmZHM6IEFycmF5PFdlYkZEPiwgYnVmZmVyT2Zmc2V0OiBudW1iZXIsIGNvbnN1bWVkOiBudW1iZXIsIHNpemU6IG51bWJlcn19IG1lc3NhZ2VcbiAgICogQHJldHVybnMge0ZpeGVkfVxuICAgKi9cbiAgc3RhdGljIGYgKG1lc3NhZ2UpIHtcbiAgICBDb25uZWN0aW9uLl9jaGVja01lc3NhZ2VTaXplKG1lc3NhZ2UsIDQpXG4gICAgY29uc3QgYXJnID0gbmV3IEludDMyQXJyYXkobWVzc2FnZS5idWZmZXIuYnVmZmVyLCBtZXNzYWdlLmJ1ZmZlci5ieXRlT2Zmc2V0ICsgKG1lc3NhZ2UuYnVmZmVyT2Zmc2V0ICogVWludDMyQXJyYXkuQllURVNfUEVSX0VMRU1FTlQpLCAxKVswXVxuICAgIG1lc3NhZ2UuYnVmZmVyT2Zmc2V0ICs9IDFcbiAgICByZXR1cm4gbmV3IEZpeGVkKGFyZyA+PiAwKVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7e2J1ZmZlcjogVWludDMyQXJyYXksIGZkczogQXJyYXk8V2ViRkQ+LCBidWZmZXJPZmZzZXQ6IG51bWJlciwgY29uc3VtZWQ6IG51bWJlciwgc2l6ZTogbnVtYmVyfX0gbWVzc2FnZVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbmFsXG4gICAqIEBwYXJhbSB7Q29ubmVjdGlvbn1jb25uZWN0aW9uXG4gICAqIEByZXR1cm5zIHtXbE9iamVjdH1cbiAgICovXG4gIHN0YXRpYyBvIChtZXNzYWdlLCBvcHRpb25hbCwgY29ubmVjdGlvbikge1xuICAgIENvbm5lY3Rpb24uX2NoZWNrTWVzc2FnZVNpemUobWVzc2FnZSwgNClcbiAgICBjb25zdCBhcmcgPSBtZXNzYWdlLmJ1ZmZlclttZXNzYWdlLmJ1ZmZlck9mZnNldCsrXVxuICAgIGlmIChvcHRpb25hbCAmJiBhcmcgPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHdsT2JqZWN0ID0gY29ubmVjdGlvbi53bE9iamVjdHNbYXJnXVxuICAgICAgaWYgKHdsT2JqZWN0KSB7XG4gICAgICAgIHJldHVybiB3bE9iamVjdFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIG9iamVjdCBpZCAke2FyZ31gKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3tidWZmZXI6IFVpbnQzMkFycmF5LCBmZHM6IEFycmF5PFdlYkZEPiwgYnVmZmVyT2Zmc2V0OiBudW1iZXIsIGNvbnN1bWVkOiBudW1iZXIsIHNpemU6IG51bWJlcn19IG1lc3NhZ2VcbiAgICogQHJldHVybnMge251bWJlcn1cbiAgICovXG4gIHN0YXRpYyBuIChtZXNzYWdlKSB7XG4gICAgQ29ubmVjdGlvbi5fY2hlY2tNZXNzYWdlU2l6ZShtZXNzYWdlLCA0KVxuICAgIHJldHVybiBtZXNzYWdlLmJ1ZmZlclttZXNzYWdlLmJ1ZmZlck9mZnNldCsrXVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7e2J1ZmZlcjogVWludDMyQXJyYXksIGZkczogQXJyYXk8V2ViRkQ+LCBidWZmZXJPZmZzZXQ6IG51bWJlciwgY29uc3VtZWQ6IG51bWJlciwgc2l6ZTogbnVtYmVyfX0gbWVzc2FnZVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbmFsXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgcyAobWVzc2FnZSwgb3B0aW9uYWwpIHsgLy8ge1N0cmluZ31cbiAgICBDb25uZWN0aW9uLl9jaGVja01lc3NhZ2VTaXplKG1lc3NhZ2UsIDQpXG4gICAgY29uc3Qgc3RyaW5nU2l6ZSA9IG1lc3NhZ2UuYnVmZmVyW21lc3NhZ2UuYnVmZmVyT2Zmc2V0KytdXG4gICAgaWYgKG9wdGlvbmFsICYmIHN0cmluZ1NpemUgPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGFsaWduZWRTaXplID0gKChzdHJpbmdTaXplICsgMykgJiB+MylcbiAgICAgIENvbm5lY3Rpb24uX2NoZWNrTWVzc2FnZVNpemUobWVzc2FnZSwgYWxpZ25lZFNpemUpXG4gICAgICAvLyBzaXplIC0xIHRvIGVsaW1pbmF0ZSBudWxsIGJ5dGVcbiAgICAgIGNvbnN0IGJ5dGVBcnJheSA9IG5ldyBVaW50OEFycmF5KG1lc3NhZ2UuYnVmZmVyLmJ1ZmZlciwgbWVzc2FnZS5idWZmZXIuYnl0ZU9mZnNldCArIChtZXNzYWdlLmJ1ZmZlck9mZnNldCAqIFVpbnQzMkFycmF5LkJZVEVTX1BFUl9FTEVNRU5UKSwgc3RyaW5nU2l6ZSAtIDEpXG4gICAgICBtZXNzYWdlLmJ1ZmZlck9mZnNldCArPSAoYWxpZ25lZFNpemUgLyA0KVxuICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoLi4uYnl0ZUFycmF5KVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge3tidWZmZXI6IFVpbnQzMkFycmF5LCBmZHM6IEFycmF5PFdlYkZEPiwgYnVmZmVyT2Zmc2V0OiBudW1iZXIsIGNvbnN1bWVkOiBudW1iZXIsIHNpemU6IG51bWJlcn19IG1lc3NhZ2VcbiAgICogQHBhcmFtIHtCb29sZWFufSBvcHRpb25hbFxuICAgKiBAcmV0dXJucyB7QXJyYXlCdWZmZXJ9XG4gICAqL1xuICBzdGF0aWMgYSAobWVzc2FnZSwgb3B0aW9uYWwpIHtcbiAgICBDb25uZWN0aW9uLl9jaGVja01lc3NhZ2VTaXplKG1lc3NhZ2UsIDQpXG4gICAgY29uc3QgYXJyYXlTaXplID0gbWVzc2FnZS5idWZmZXJbbWVzc2FnZS5idWZmZXJPZmZzZXQrK11cbiAgICBpZiAob3B0aW9uYWwgJiYgYXJyYXlTaXplID09PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBhbGlnbmVkU2l6ZSA9ICgoYXJyYXlTaXplICsgMykgJiB+MylcbiAgICAgIENvbm5lY3Rpb24uX2NoZWNrTWVzc2FnZVNpemUobWVzc2FnZSwgYWxpZ25lZFNpemUpXG4gICAgICBjb25zdCBhcmcgPSBtZXNzYWdlLmJ1ZmZlci5idWZmZXIuc2xpY2UobWVzc2FnZS5idWZmZXIuYnl0ZU9mZnNldCArIChtZXNzYWdlLmJ1ZmZlck9mZnNldCAqIFVpbnQzMkFycmF5LkJZVEVTX1BFUl9FTEVNRU5UKSwgbWVzc2FnZS5idWZmZXIuYnl0ZU9mZnNldCArIChtZXNzYWdlLmJ1ZmZlck9mZnNldCAqIFVpbnQzMkFycmF5LkJZVEVTX1BFUl9FTEVNRU5UKSArIGFycmF5U2l6ZSlcbiAgICAgIG1lc3NhZ2UuYnVmZmVyT2Zmc2V0ICs9IGFsaWduZWRTaXplXG4gICAgICByZXR1cm4gYXJnXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7e2J1ZmZlcjogVWludDMyQXJyYXksIGZkczogQXJyYXk8V2ViRkQ+LCBidWZmZXJPZmZzZXQ6IG51bWJlciwgY29uc3VtZWQ6IG51bWJlciwgc2l6ZTogbnVtYmVyfX0gbWVzc2FnZVxuICAgKiBAcmV0dXJucyB7V2ViRkR9XG4gICAqL1xuICBzdGF0aWMgaCAobWVzc2FnZSkgeyAvLyBmaWxlIGRlc2NyaXB0b3Ige251bWJlcn1cbiAgICBpZiAobWVzc2FnZS5mZHMubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIG1lc3NhZ2UuZmRzLnNoaWZ0KClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgZW5vdWdoIGZpbGUgZGVzY3JpcHRvcnMgaW4gbWVzc2FnZSBvYmplY3QuJylcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgLyoqXG4gICAgICogQHR5cGUge09iamVjdC48bnVtYmVyLFdsT2JqZWN0Pn1cbiAgICAgKi9cbiAgICB0aGlzLndsT2JqZWN0cyA9IHt9XG4gICAgLyoqXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmNsb3NlZCA9IGZhbHNlXG4gICAgLyoqXG4gICAgICogQHR5cGUge0FycmF5PHtidWZmZXI6IEFycmF5QnVmZmVyLCBmZHM6IEFycmF5PFdlYkZEPn0+fVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fb3V0TWVzc2FnZXMgPSBbXVxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtBcnJheTx7YnVmZmVyOiBVaW50MzJBcnJheSwgZmRzOiBBcnJheTxXZWJGRD59Pn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX2luTWVzc2FnZXMgPSBbXVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpZFxuICAgKiBAcGFyYW0ge251bWJlcn0gb3Bjb2RlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzaXplXG4gICAqIEBwYXJhbSB7QXJyYXk8e3ZhbHVlOiAqLCB0eXBlOiBzdHJpbmcsIHNpemU6IG51bWJlciwgb3B0aW9uYWw6IGJvb2xlYW4sIF9tYXJzaGFsbEFyZzogZnVuY3Rpb24oe2J1ZmZlcjogQXJyYXlCdWZmZXIsIGZkczogQXJyYXk8V2ViRkQ+LCBidWZmZXJPZmZzZXQ6IG51bWJlcn0pOnZvaWR9Pn0gYXJnc0FycmF5XG4gICAqL1xuICBtYXJzaGFsbE1zZyAoaWQsIG9wY29kZSwgc2l6ZSwgYXJnc0FycmF5KSB7XG4gICAgLyoqXG4gICAgICogQHR5cGUge3tidWZmZXI6IEFycmF5QnVmZmVyLCBmZHM6IEFycmF5PFdlYkZEPiwgYnVmZmVyT2Zmc2V0OiBudW1iZXJ9fVxuICAgICAqL1xuICAgIGNvbnN0IHdpcmVNc2cgPSB7XG4gICAgICBidWZmZXI6IG5ldyBBcnJheUJ1ZmZlcihzaXplKSxcbiAgICAgIGZkczogW10sXG4gICAgICBidWZmZXJPZmZzZXQ6IDBcbiAgICB9XG5cbiAgICAvLyB3cml0ZSBhY3R1YWwgd2lyZSBtZXNzYWdlXG4gICAgY29uc3QgYnVmdTMyID0gbmV3IFVpbnQzMkFycmF5KHdpcmVNc2cuYnVmZmVyKVxuICAgIGNvbnN0IGJ1ZnUxNiA9IG5ldyBVaW50MTZBcnJheSh3aXJlTXNnLmJ1ZmZlcilcbiAgICBidWZ1MzJbMF0gPSBpZFxuICAgIGJ1ZnUxNlsyXSA9IG9wY29kZVxuICAgIGJ1ZnUxNlszXSA9IHNpemVcbiAgICB3aXJlTXNnLmJ1ZmZlck9mZnNldCA9IDhcblxuICAgIC8vIHdyaXRlIGFjdHVhbCBhcmd1bWVudCB2YWx1ZSB0byBidWZmZXJcbiAgICBhcmdzQXJyYXkuZm9yRWFjaCgoYXJnKSA9PiBhcmcuX21hcnNoYWxsQXJnKHdpcmVNc2cpKVxuICAgIHRoaXMub25TZW5kKHdpcmVNc2cpXG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIHJlY2VpdmVkIHdpcmUgbWVzc2FnZXMuXG4gICAqIEBwYXJhbSB7e2J1ZmZlcjogVWludDMyQXJyYXksIGZkczogQXJyYXk8V2ViRkQ+fX0gaW5jb21pbmdXaXJlTWVzc2FnZXNcbiAgICogQHJldHVybiB7UHJvbWlzZTx2b2lkPn1cbiAgICogQHRocm93cyBFcnJvciBJZiBhbiBpbGxlZ2FsIGNsaWVudCByZXF1ZXN0IGlzIHJlY2VpdmVkIGllLiBiYWQgbGVuZ3RoIG9yIG1pc3NpbmcgZmlsZSBkZXNjcmlwdG9yLlxuICAgKi9cbiAgYXN5bmMgbWVzc2FnZSAoaW5jb21pbmdXaXJlTWVzc2FnZXMpIHtcbiAgICBpZiAodGhpcy5jbG9zZWQpIHsgcmV0dXJuIH1cblxuICAgIC8vIG1vcmUgdGhhbiBvbmUgbWVzc2FnZSBpbiBxdWV1ZSBtZWFucyB0aGUgbWVzc2FnZSBsb29wIGlzIGluIGF3YWl0LCBkb24ndCBjb25jdXJyZW50bHkgcHJvY2VzcyB0aGUgbmV3XG4gICAgLy8gbWVzc2FnZSwgaW5zdGVhZCByZXR1cm4gZWFybHkgYW5kIGxldCB0aGUgcmVzdW1lLWZyb20tYXdhaXQgcGljayB1cCB0aGUgbmV3bHkgcXVldWVkIG1lc3NhZ2UuXG4gICAgaWYgKHRoaXMuX2luTWVzc2FnZXMucHVzaChpbmNvbWluZ1dpcmVNZXNzYWdlcykgPiAxKSB7IHJldHVybiB9XG5cbiAgICB3aGlsZSAodGhpcy5faW5NZXNzYWdlcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHdpcmVNZXNzYWdlcyA9IC8qKiBAdHlwZSB7e2J1ZmZlcjogVWludDMyQXJyYXksIGZkczogQXJyYXk8V2ViRkQ+LCBidWZmZXJPZmZzZXQ6IG51bWJlciwgY29uc3VtZWQ6IG51bWJlciwgc2l6ZTogbnVtYmVyfX0gKi90aGlzLl9pbk1lc3NhZ2VzWzBdXG4gICAgICB3aXJlTWVzc2FnZXMuYnVmZmVyT2Zmc2V0ID0gMFxuICAgICAgd2lyZU1lc3NhZ2VzLmNvbnN1bWVkID0gMFxuICAgICAgd2lyZU1lc3NhZ2VzLnNpemUgPSAwXG4gICAgICB3aGlsZSAod2lyZU1lc3NhZ2VzLmJ1ZmZlck9mZnNldCA8IHdpcmVNZXNzYWdlcy5idWZmZXIubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGlkID0gd2lyZU1lc3NhZ2VzLmJ1ZmZlclt3aXJlTWVzc2FnZXMuYnVmZmVyT2Zmc2V0XVxuICAgICAgICBjb25zdCBzaXplT3Bjb2RlID0gd2lyZU1lc3NhZ2VzLmJ1ZmZlclt3aXJlTWVzc2FnZXMuYnVmZmVyT2Zmc2V0ICsgMV1cbiAgICAgICAgd2lyZU1lc3NhZ2VzLnNpemUgPSBzaXplT3Bjb2RlID4+PiAxNlxuICAgICAgICBjb25zdCBvcGNvZGUgPSBzaXplT3Bjb2RlICYgMHgwMDAwRkZGRlxuXG4gICAgICAgIGlmICh3aXJlTWVzc2FnZXMuc2l6ZSA+IHdpcmVNZXNzYWdlcy5idWZmZXIuYnl0ZUxlbmd0aCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUmVxdWVzdCBidWZmZXIgdG9vIHNtYWxsJylcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc291cmNlID0gdGhpcy53bE9iamVjdHNbaWRdXG4gICAgICAgIGlmIChyZXNvdXJjZSkge1xuICAgICAgICAgIHdpcmVNZXNzYWdlcy5idWZmZXJPZmZzZXQgKz0gMlxuICAgICAgICAgIHdpcmVNZXNzYWdlcy5jb25zdW1lZCA9IDhcbiAgICAgICAgICBhd2FpdCByZXNvdXJjZVtvcGNvZGVdKHdpcmVNZXNzYWdlcylcbiAgICAgICAgICBpZiAodGhpcy5jbG9zZWQpIHsgcmV0dXJuIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGludmFsaWQgb2JqZWN0ICR7aWR9YClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5faW5NZXNzYWdlcy5zaGlmdCgpXG4gICAgfVxuXG4gICAgdGhpcy5mbHVzaCgpXG4gIH1cblxuICAvKipcbiAgICogVGhpcyBkb2Vzbid0IGFjdHVhbGx5IHNlbmQgdGhlIG1lc3NhZ2UsIGJ1dCBxdWV1ZXMgaXQgc28gaXQgY2FuIGJlIHNlbmQgb24gZmx1c2guXG4gICAqIEBwYXJhbSB7e2J1ZmZlcjogQXJyYXlCdWZmZXIsIGZkczogQXJyYXk8V2ViRkQ+fX13aXJlTXNnIGEgc2luZ2xlIHdpcmUgbWVzc2FnZSBldmVudC5cbiAgICovXG4gIG9uU2VuZCAod2lyZU1zZykge1xuICAgIGlmICh0aGlzLmNsb3NlZCkgeyByZXR1cm4gfVxuXG4gICAgdGhpcy5fb3V0TWVzc2FnZXMucHVzaCh3aXJlTXNnKVxuICB9XG5cbiAgLyoqXG4gICAqIEVtcHR5IHRoZSBxdWV1ZSBvZiB3aXJlIG1lc3NhZ2VzIGFuZCBzZW5kIHRoZW0gdG8gdGhlIG90aGVyIGVuZC5cbiAgICovXG4gIGZsdXNoICgpIHtcbiAgICBpZiAodGhpcy5jbG9zZWQpIHsgcmV0dXJuIH1cbiAgICBpZiAodGhpcy5fb3V0TWVzc2FnZXMubGVuZ3RoID09PSAwKSB7IHJldHVybiB9XG5cbiAgICB0aGlzLm9uRmx1c2godGhpcy5fb3V0TWVzc2FnZXMpXG4gICAgdGhpcy5fb3V0TWVzc2FnZXMgPSBbXVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHdoZW4gdGhpcyBjb25uZWN0aW9uIHdpc2hlcyB0byBzZW5kIGRhdGEgdG8gdGhlIG90aGVyIGVuZC4gVGhpcyBjYWxsYmFjayBjYW4gYmUgdXNlZCB0byBzZW5kIHRoZSBnaXZlblxuICAgKiBhcnJheSBidWZmZXJzIHVzaW5nIGFueSB0cmFuc3BvcnQgbWVjaGFuaXNtLlxuICAgKiBAcGFyYW0ge0FycmF5PHtidWZmZXI6IEFycmF5QnVmZmVyLCBmZHM6IEFycmF5PFdlYkZEPn0+fXdpcmVNZXNzYWdlc1xuICAgKi9cbiAgb25GbHVzaCAod2lyZU1lc3NhZ2VzKSB7fVxuXG4gIGNsb3NlICgpIHtcbiAgICBpZiAodGhpcy5jbG9zZWQpIHsgcmV0dXJuIH1cblxuICAgIC8vIGRlc3Ryb3kgcmVzb3VyY2VzIGluIGRlc2NlbmRpbmcgb3JkZXJcbiAgICBPYmplY3QudmFsdWVzKHRoaXMud2xPYmplY3RzKS5zb3J0KChhLCBiKSA9PiBhLmlkIC0gYi5pZCkuZm9yRWFjaCgod2xPYmplY3QpID0+IHdsT2JqZWN0LmRlc3Ryb3koKSlcblxuICAgIHRoaXMuX291dE1lc3NhZ2VzID0gbnVsbFxuICAgIHRoaXMuX2luTWVzc2FnZXMgPSBudWxsXG4gICAgdGhpcy5jbG9zZWQgPSB0cnVlXG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtXbE9iamVjdH0gd2xPYmplY3RcbiAgICovXG4gIHJlZ2lzdGVyV2xPYmplY3QgKHdsT2JqZWN0KSB7XG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7IHJldHVybiB9XG4gICAgdGhpcy53bE9iamVjdHNbd2xPYmplY3QuaWRdID0gd2xPYmplY3RcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge1dsT2JqZWN0fSB3bE9iamVjdFxuICAgKi9cbiAgdW5yZWdpc3RlcldsT2JqZWN0ICh3bE9iamVjdCkge1xuICAgIGlmICh0aGlzLmNsb3NlZCkgeyByZXR1cm4gfVxuICAgIGRlbGV0ZSB0aGlzLndsT2JqZWN0c1t3bE9iamVjdC5pZF1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb25uZWN0aW9uIiwiLypcbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAxNyBFcmlrIERlIFJpamNrZVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbiAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4gIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cbiovXG5cbid1c2Ugc3RyaWN0J1xuXG5jbGFzcyBGaXhlZCB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge251bWJlcn1udW1iZXJcbiAgICogQHJldHVybiB7Rml4ZWR9XG4gICAqL1xuICBzdGF0aWMgcGFyc2UgKG51bWJlcikge1xuICAgIHJldHVybiBuZXcgRml4ZWQoKG51bWJlciAqIDI1Ni4wKSA+PiAwKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlcHJlc2VudCBmaXhlZCBhcyBhIHNpZ25lZCAyNC1iaXQgaW50ZWdlci5cbiAgICpcbiAgICogQHJldHVybnMge251bWJlcn1cbiAgICovXG4gIGFzSW50ICgpIHtcbiAgICByZXR1cm4gKCh0aGlzLl9yYXcgLyAyNTYuMCkgPj4gMClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXByZXNlbnQgZml4ZWQgYXMgYSBzaWduZWQgMjQtYml0IG51bWJlciB3aXRoIGFuIDgtYml0IGZyYWN0aW9uYWwgcGFydC5cbiAgICpcbiAgICogQHJldHVybnMge251bWJlcn1cbiAgICovXG4gIGFzRG91YmxlICgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmF3IC8gMjU2LjBcbiAgfVxuXG4gIC8qKlxuICAgKiB1c2UgcGFyc2VGaXhlZCBpbnN0ZWFkXG4gICAqIEBwYXJhbSB7bnVtYmVyfXJhd1xuICAgKi9cbiAgY29uc3RydWN0b3IgKHJhdykge1xuICAgIHRoaXMuX3JhdyA9IHJhd1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZpeGVkIiwiLypcbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAxNyBFcmlrIERlIFJpamNrZVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbiAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4gIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cbiovXG5cbid1c2Ugc3RyaWN0J1xuXG5jbGFzcyBXZWJGRCB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge251bWJlcn1mZFxuICAgKiBAcGFyYW0geydJbWFnZUJpdG1hcCd8J0FycmF5QnVmZmVyJ3wnTWVzc2FnZVBvcnQnfWZkVHlwZVxuICAgKiBAcGFyYW0ge3N0cmluZ31mZERvbWFpblVVSURcbiAgICogQHBhcmFtIHtmdW5jdGlvbihXZWJGRCk6IFByb21pc2U8VHJhbnNmZXJhYmxlPn1vbkdldFRyYW5zZmVyYWJsZVxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKFdlYkZEKTogUHJvbWlzZTx2b2lkPn0gb25DbG9zZVxuICAgKi9cbiAgY29uc3RydWN0b3IgKGZkLCBmZFR5cGUsIGZkRG9tYWluVVVJRCwgb25HZXRUcmFuc2ZlcmFibGUsIG9uQ2xvc2UpIHtcbiAgICAvKipcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuZmQgPSBmZFxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5mZFR5cGUgPSBmZFR5cGVcbiAgICAvKipcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMuZmREb21haW5VVUlEID0gZmREb21haW5VVUlEXG4gICAgLyoqXG4gICAgICogQHR5cGUge2Z1bmN0aW9uKFdlYkZEKTogUHJvbWlzZTxUcmFuc2ZlcmFibGU+fVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fb25HZXRUcmFuc2ZlcmFibGUgPSBvbkdldFRyYW5zZmVyYWJsZVxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtmdW5jdGlvbihXZWJGRCk6IFByb21pc2U8dm9pZD59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9vbkNsb3NlID0gb25DbG9zZVxuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge1Byb21pc2U8VHJhbnNmZXJhYmxlPn1cbiAgICovXG4gIGFzeW5jIGdldFRyYW5zZmVyYWJsZSAoKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX29uR2V0VHJhbnNmZXJhYmxlKHRoaXMpXG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7UHJvbWlzZTx2b2lkPn1cbiAgICovXG4gIGFzeW5jIGNsb3NlICgpIHtcbiAgICBhd2FpdCB0aGlzLl9vbkNsb3NlKHRoaXMpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgV2ViRkQiLCIvKlxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDE3IEVyaWsgRGUgUmlqY2tlXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuICBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbiAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuKi9cblxuJ3VzZSBzdHJpY3QnXG5cbmNsYXNzIFdsT2JqZWN0IHtcbiAgY29uc3RydWN0b3IgKGlkKSB7XG4gICAgdGhpcy5pZCA9IGlkXG4gICAgLyoqXG4gICAgICogQHR5cGUge1Byb21pc2U8dm9pZD59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9kZXN0cm95UHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICB0aGlzLl9kZXN0cm95UmVzb2x2ZXIgPSByZXNvbHZlXG4gICAgfSlcbiAgICAvKipcbiAgICAgKiBAdHlwZSB7QXJyYXk8ZnVuY3Rpb24oUmVzb3VyY2UpOnZvaWQ+fVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fZGVzdHJveUxpc3RlbmVycyA9IFtdXG4gICAgdGhpcy5fZGVzdHJveVByb21pc2UudGhlbigoKSA9PiB0aGlzLl9kZXN0cm95TGlzdGVuZXJzLmZvckVhY2goKGRlc3Ryb3lMaXN0ZW5lcikgPT4gZGVzdHJveUxpc3RlbmVyKHRoaXMpKSlcbiAgfVxuXG4gIGRlc3Ryb3kgKCkge1xuICAgIHRoaXMuX2Rlc3Ryb3lSZXNvbHZlcigpXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtmdW5jdGlvbihSZXNvdXJjZSk6dm9pZH1kZXN0cm95TGlzdGVuZXJcbiAgICovXG4gIGFkZERlc3Ryb3lMaXN0ZW5lciAoZGVzdHJveUxpc3RlbmVyKSB7XG4gICAgdGhpcy5fZGVzdHJveUxpc3RlbmVycy5wdXNoKGRlc3Ryb3lMaXN0ZW5lcilcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKFJlc291cmNlKTp2b2lkfWRlc3Ryb3lMaXN0ZW5lclxuICAgKi9cbiAgcmVtb3ZlRGVzdHJveUxpc3RlbmVyIChkZXN0cm95TGlzdGVuZXIpIHtcbiAgICB0aGlzLl9kZXN0cm95TGlzdGVuZXJzID0gdGhpcy5fZGVzdHJveUxpc3RlbmVycy5maWx0ZXIoKGl0ZW0pID0+IHsgcmV0dXJuIGl0ZW0gIT09IGRlc3Ryb3lMaXN0ZW5lciB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge1Byb21pc2U8dm9pZD59XG4gICAqL1xuICBvbkRlc3Ryb3kgKCkge1xuICAgIHJldHVybiB0aGlzLl9kZXN0cm95UHJvbWlzZVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFdsT2JqZWN0IiwiaW1wb3J0IHtcbiAgZGlzcGxheSxcbiAgd2ViRlMsXG4gIFdsQ29tcG9zaXRvclByb3h5LFxuICBXZWJTaG1Qcm94eSxcbiAgV2xTaGVsbFByb3h5XG59IGZyb20gJ3dlc3RmaWVsZC1ydW50aW1lLWNsaWVudCdcblxuLyoqXG4gKiBAaW1wbGVtZW50cyBXZWJBcnJheUJ1ZmZlckV2ZW50c1xuICovXG5jbGFzcyBXZWJBcnJheUJ1ZmZlciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge1dlYlNobVByb3h5fXdlYlNobVxuICAgKiBAcGFyYW0ge251bWJlcn13aWR0aFxuICAgKiBAcGFyYW0ge251bWJlcn1oZWlnaHRcbiAgICogQHJldHVybiB7V2ViQXJyYXlCdWZmZXJ9XG4gICAqL1xuICBzdGF0aWMgY3JlYXRlICh3ZWJTaG0sIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBjb25zdCBhcnJheUJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcihoZWlnaHQgKiB3aWR0aCAqIFVpbnQzMkFycmF5LkJZVEVTX1BFUl9FTEVNRU5UKVxuICAgIGNvbnN0IHNobUJ1ZmZlcldlYkZEID0gd2ViRlMuZnJvbUFycmF5QnVmZmVyKGFycmF5QnVmZmVyKVxuXG4gICAgcmV0dXJuIG5ldyBXZWJBcnJheUJ1ZmZlcih3ZWJTaG0sIHNobUJ1ZmZlcldlYkZELCBhcnJheUJ1ZmZlciwgd2lkdGgsIGhlaWdodClcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1dlYlNobVByb3h5fXdlYlNobVxuICAgKiBAcGFyYW0ge1dlYkZEfXNobUJ1ZmZlcldlYkZEXG4gICAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ9YXJyYXlCdWZmZXJcbiAgICogQHBhcmFtIHtudW1iZXJ9d2lkdGhcbiAgICogQHBhcmFtIHtudW1iZXJ9aGVpZ2h0XG4gICAqL1xuICBjb25zdHJ1Y3RvciAod2ViU2htLCBzaG1CdWZmZXJXZWJGRCwgYXJyYXlCdWZmZXIsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAvKipcbiAgICAgKiBAdHlwZSB7V2ViU2htUHJveHl9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl93ZWJTaG0gPSB3ZWJTaG1cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7V2ViQXJyYXlCdWZmZXJQcm94eXxudWxsfVxuICAgICAqL1xuICAgIHRoaXMucHJveHkgPSBudWxsXG4gICAgLyoqXG4gICAgICogQHR5cGUge1dsQnVmZmVyUHJveHl8bnVsbH1cbiAgICAgKi9cbiAgICB0aGlzLmJ1ZmZlclByb3h5ID0gbnVsbFxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtXZWJGRH1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX3NobUJ1ZmZlcldlYkZEID0gc2htQnVmZmVyV2ViRkRcbiAgICAvKipcbiAgICAgKiBAdHlwZSB7QXJyYXlCdWZmZXJ9XG4gICAgICovXG4gICAgdGhpcy5hcnJheUJ1ZmZlciA9IGFycmF5QnVmZmVyXG4gICAgLyoqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLndpZHRoID0gd2lkdGhcbiAgICAvKipcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0XG4gIH1cblxuICBzZWFsICgpIHtcbiAgICBpZiAodGhpcy5wcm94eSkge1xuICAgICAgdGhpcy5wcm94eS5hdHRhY2godGhpcy5fc2htQnVmZmVyV2ViRkQpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHJveHkgPSB0aGlzLl93ZWJTaG0uY3JlYXRlV2ViQXJyYXlCdWZmZXIodGhpcy5fc2htQnVmZmVyV2ViRkQsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0LCB0aGlzLnN0cmlkZSwgdGhpcy5mb3JtYXQpXG4gICAgICB0aGlzLmJ1ZmZlclByb3h5ID0gdGhpcy5fd2ViU2htLmNyZWF0ZUJ1ZmZlcih0aGlzLnByb3h5KVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiAgICAgICAgICAgICAgICBEZXRhY2hlcyB0aGUgYXNzb2NpYXRlZCBIVE1MNSBhcnJheSBidWZmZXIgZnJvbSB0aGUgY29tcG9zaXRvciBhbmQgcmV0dXJucyBpdCB0byB0aGUgY2xpZW50LlxuICAgKiAgICAgICAgICAgICAgICBObyBhY3Rpb24gaXMgZXhwZWN0ZWQgZm9yIHRoaXMgZXZlbnQuIEl0IG1lcmVseSBmdW5jdGlvbnMgYXMgYSBIVE1MNSBhcnJheSBidWZmZXIgb3duZXJzaGlwXG4gICAqICAgICAgICAgICAgICAgIHRyYW5zZmVyIGZyb20gbWFpbiB0aHJlYWQgdG8gd2ViLXdvcmtlci5cbiAgICpcbiAgICpcbiAgICogQHBhcmFtIHtXZWJGRH0gYXJyYXlCdWZmZXIgSFRNTDUgYXJyYXkgYnVmZmVyIHRvIGRldGFjaCBmcm9tIHRoZSBjb21wb3NpdG9yXG4gICAqXG4gICAqIEBzaW5jZSAxXG4gICAqXG4gICAqL1xuICBkZXRhY2ggKGFycmF5QnVmZmVyKSB7fVxufVxuXG4vKipcbiAqIEBpbXBsZW1lbnRzIFdsUmVnaXN0cnlFdmVudHNcbiAqIEBpbXBsZW1lbnRzIFdlYlNobUV2ZW50c1xuICogQGltcGxlbWVudHMgV2xTaGVsbFN1cmZhY2VFdmVudHNcbiAqL1xuY2xhc3MgV2luZG93IHtcbiAgLyoqXG4gICAqIEByZXR1cm4ge1dpbmRvd31cbiAgICovXG4gIHN0YXRpYyBjcmVhdGUgKHdpZHRoLCBoZWlnaHQpIHtcbiAgICBjb25zdCByZWdpc3RyeSA9IGRpc3BsYXkuZ2V0UmVnaXN0cnkoKVxuICAgIGNvbnN0IHdpbmRvdyA9IG5ldyBXaW5kb3cocmVnaXN0cnkpXG4gICAgcmVnaXN0cnkubGlzdGVuZXIgPSB3aW5kb3dcbiAgICByZXR1cm4gd2luZG93XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtXbFJlZ2lzdHJ5UHJveHl9cmVnaXN0cnlcbiAgICovXG4gIGNvbnN0cnVjdG9yIChyZWdpc3RyeSkge1xuICAgIC8qKlxuICAgICAqIEB0eXBlIHtXbFJlZ2lzdHJ5UHJveHl9XG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIHRoaXMuX3JlZ2lzdHJ5ID0gcmVnaXN0cnlcbiAgICAvKipcbiAgICAgKiBAdHlwZSB7V2xDb21wb3NpdG9yUHJveHl8bnVsbH1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX2NvbXBvc2l0b3IgPSBudWxsXG4gICAgLyoqXG4gICAgICogQHR5cGUge1dlYlNobVByb3h5fG51bGx9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl93ZWJTaG0gPSBudWxsXG4gICAgLyoqXG4gICAgICogQHR5cGUge1dsU2hlbGxQcm94eXxudWxsfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fc2hlbGwgPSBudWxsXG4gICAgLyoqXG4gICAgICogQHR5cGUge1dsU3VyZmFjZVByb3h5fG51bGx9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9zdXJmYWNlID0gbnVsbFxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtBcnJheTxXZWJBcnJheUJ1ZmZlcj59XG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIHRoaXMuX2J1ZmZlcnMgPSBbXVxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIHRoaXMuX25leHRCdWZmZXJJZHggPSAwXG4gICAgLyoqXG4gICAgICogQHR5cGUge1Byb21pc2U8bnVtYmVyPn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX3N5bmNQcm9taXNlID0gbnVsbFxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqICBOb3RpZnkgdGhlIGNsaWVudCBvZiBnbG9iYWwgb2JqZWN0cy5cbiAgICpcbiAgICogIFRoZSBldmVudCBub3RpZmllcyB0aGUgY2xpZW50IHRoYXQgYSBnbG9iYWwgb2JqZWN0IHdpdGhcbiAgICogIHRoZSBnaXZlbiBuYW1lIGlzIG5vdyBhdmFpbGFibGUsIGFuZCBpdCBpbXBsZW1lbnRzIHRoZVxuICAgKiAgZ2l2ZW4gdmVyc2lvbiBvZiB0aGUgZ2l2ZW4gaW50ZXJmYWNlLlxuICAgKlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gbmFtZSBudW1lcmljIG5hbWUgb2YgdGhlIGdsb2JhbCBvYmplY3RcbiAgICogQHBhcmFtIHtzdHJpbmd9IGludGVyZmFjZV8gaW50ZXJmYWNlIGltcGxlbWVudGVkIGJ5IHRoZSBvYmplY3RcbiAgICogQHBhcmFtIHtudW1iZXJ9IHZlcnNpb24gaW50ZXJmYWNlIHZlcnNpb25cbiAgICpcbiAgICogQHNpbmNlIDFcbiAgICpcbiAgICovXG4gIGdsb2JhbCAobmFtZSwgaW50ZXJmYWNlXywgdmVyc2lvbikge1xuICAgIGlmIChpbnRlcmZhY2VfID09PSBXbENvbXBvc2l0b3JQcm94eS5wcm90b2NvbE5hbWUpIHtcbiAgICAgIHRoaXMuX2NvbXBvc2l0b3IgPSB0aGlzLl9yZWdpc3RyeS5iaW5kKG5hbWUsIGludGVyZmFjZV8sIFdsQ29tcG9zaXRvclByb3h5LCB2ZXJzaW9uKVxuICAgICAgdGhpcy5fc3VyZmFjZSA9IHRoaXMuX2NvbXBvc2l0b3IuY3JlYXRlU3VyZmFjZSgpXG4gICAgfVxuXG4gICAgaWYgKGludGVyZmFjZV8gPT09IFdlYlNobVByb3h5LnByb3RvY29sTmFtZSkge1xuICAgICAgdGhpcy5fd2ViU2htID0gdGhpcy5fcmVnaXN0cnkuYmluZChuYW1lLCBpbnRlcmZhY2VfLCBXZWJTaG1Qcm94eSwgdmVyc2lvbilcbiAgICAgIHRoaXMuX3dlYlNobS5saXN0ZW5lciA9IHRoaXNcblxuICAgICAgY29uc3QgYnVmV2lkdGggPSAyNTBcbiAgICAgIGNvbnN0IGJ1ZkhlaWdodCA9IDI1MFxuXG4gICAgICB0aGlzLl9idWZmZXJzWzBdID0gV2ViQXJyYXlCdWZmZXIuY3JlYXRlKHRoaXMuX3dlYlNobSwgYnVmV2lkdGgsIGJ1ZkhlaWdodClcbiAgICAgIHRoaXMuX2J1ZmZlcnNbMV0gPSBXZWJBcnJheUJ1ZmZlci5jcmVhdGUodGhpcy5fd2ViU2htLCBidWZXaWR0aCwgYnVmSGVpZ2h0KVxuICAgIH1cblxuICAgIGlmIChpbnRlcmZhY2VfID09PSBXbFNoZWxsUHJveHkucHJvdG9jb2xOYW1lKSB7XG4gICAgICB0aGlzLl9zaGVsbCA9IHRoaXMuX3JlZ2lzdHJ5LmJpbmQobmFtZSwgaW50ZXJmYWNlXywgV2xTaGVsbFByb3h5LCB2ZXJzaW9uKVxuICAgIH1cbiAgfVxuXG4gIGluaXQgKCkge1xuICAgIHRoaXMuX3NoZWxsU3VyZmFjZSA9IHRoaXMuX3NoZWxsLmdldFNoZWxsU3VyZmFjZSh0aGlzLl9zdXJmYWNlKVxuICAgIHRoaXMuX3NoZWxsU3VyZmFjZS5saXN0ZW5lciA9IHRoaXNcbiAgICB0aGlzLl9zaGVsbFN1cmZhY2Uuc2V0VG9wbGV2ZWwoKVxuICAgIHRoaXMuX3NoZWxsU3VyZmFjZS5zZXRUaXRsZSgnU2ltcGxlIFNobSBXZWInKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7V2ViQXJyYXlCdWZmZXJ9YnVmZmVyXG4gICAqIEBwYXJhbSB7bnVtYmVyfXRpbWVzdGFtcFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3BhaW50UGl4ZWxzIChidWZmZXIsIHRpbWVzdGFtcCkge1xuICAgIGNvbnN0IGhhbGZoID0gYnVmZmVyLndpZHRoIC8gMlxuICAgIGNvbnN0IGhhbGZ3ID0gYnVmZmVyLmhlaWdodCAvIDJcbiAgICBsZXQgaXJcbiAgICBsZXQgb3JcbiAgICBjb25zdCBpbWFnZSA9IG5ldyBVaW50MzJBcnJheShidWZmZXIuYXJyYXlCdWZmZXIpXG5cbiAgICAvKiBzcXVhcmVkIHJhZGlpIHRocmVzaG9sZHMgKi9cbiAgICBvciA9IChoYWxmdyA8IGhhbGZoID8gaGFsZncgOiBoYWxmaCkgLSA4XG4gICAgaXIgPSBvciAtIDMyXG4gICAgb3IgPSBvciAqIG9yXG4gICAgaXIgPSBpciAqIGlyXG5cbiAgICBsZXQgb2Zmc2V0ID0gMFxuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgYnVmZmVyLmhlaWdodDsgeSsrKSB7XG4gICAgICBjb25zdCB5MiA9ICh5IC0gaGFsZmgpICogKHkgLSBoYWxmaClcblxuICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBidWZmZXIud2lkdGg7IHgrKykge1xuICAgICAgICBsZXQgdlxuXG4gICAgICAgIGNvbnN0IHIyID0gKHggLSBoYWxmdykgKiAoeCAtIGhhbGZ3KSArIHkyXG5cbiAgICAgICAgaWYgKHIyIDwgaXIpIHtcbiAgICAgICAgICB2ID0gKHIyIC8gMzIgKyB0aW1lc3RhbXAgLyA2NCkgKiAweDgwNDAxMDBcbiAgICAgICAgfSBlbHNlIGlmIChyMiA8IG9yKSB7XG4gICAgICAgICAgdiA9ICh5ICsgdGltZXN0YW1wIC8gMzIpICogMHg4MDQwMTAwXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdiA9ICh4ICsgdGltZXN0YW1wIC8gMTYpICogMHg4MDQwMTAwXG4gICAgICAgIH1cbiAgICAgICAgdiAmPSAweDBmZmZmZmYwMFxuXG4gICAgICAgIGlmIChNYXRoLmFicyh4IC0geSkgPiA2ICYmIE1hdGguYWJzKHggKyB5IC0gYnVmZmVyLmhlaWdodCkgPiA2KSB7XG4gICAgICAgICAgdiB8PSAweDAwMDAwMGZmXG4gICAgICAgIH1cblxuICAgICAgICBpbWFnZVtvZmZzZXQrK10gPSB2XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7bnVtYmVyfXRpbWVzdGFtcFxuICAgKi9cbiAgZHJhdyAodGltZXN0YW1wKSB7XG4gICAgY29uc3Qgd2ViQXJyYXlCdWZmZXIgPSB0aGlzLl9idWZmZXJzW3RoaXMuX25leHRCdWZmZXJJZHgrKyAlIDJdXG5cbiAgICB0aGlzLl9wYWludFBpeGVscyh3ZWJBcnJheUJ1ZmZlciwgdGltZXN0YW1wKVxuICAgIHdlYkFycmF5QnVmZmVyLnNlYWwoKVxuXG4gICAgdGhpcy5fc3VyZmFjZS5hdHRhY2god2ViQXJyYXlCdWZmZXIuYnVmZmVyUHJveHksIDAsIDApXG4gICAgdGhpcy5fc3VyZmFjZS5kYW1hZ2UoMCwgMCwgd2ViQXJyYXlCdWZmZXIud2lkdGgsIHdlYkFycmF5QnVmZmVyLmhlaWdodClcblxuICAgIC8vIHdhaXQgZm9yIHRoZSBjb21wb3NpdG9yIHRvIHNpZ25hbCB0aGF0IHdlIGNhbiBkcmF3IHRoZSBuZXh0IGZyYW1lXG4gICAgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7IHRoaXMuX3N1cmZhY2UuZnJhbWUoKS5saXN0ZW5lciA9IHsgZG9uZTogcmVzb2x2ZSB9IH0pLnRoZW4odGltZXN0YW1wID0+IHRoaXMuZHJhdyh0aW1lc3RhbXApKVxuXG4gICAgLy8gc2VyaWFsIGlzIG9ubHkgcmVxdWlyZWQgaWYgb3VyIGJ1ZmZlciBjb250ZW50cyB3b3VsZCB0YWtlIGEgbG9uZyB0aW1lIHRvIHNlbmQgdG8gdGhlIGNvbXBvc2l0b3IgaWUuIGluIGEgbmV0d29yayByZW1vdGUgY2FzZVxuICAgIHRoaXMuX3N1cmZhY2UuY29tbWl0KDApXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtudW1iZXJ9bmFtZVxuICAgKi9cbiAgZ2xvYmFsUmVtb3ZlIChuYW1lKSB7XG4gICAgLy8gRklYTUUga2VlcCB0cmFjayBvZiB0aGUgbmFtZSBudW1iZXIgb2YgdGhlIGdsb2JhbHMgd2UgYmluZCBzbyB3ZSBjYW4gZG8gY2xlYW51cCBpZiBhIGdsb2JhbCBzaG91bGQgZ28gYXdheS5cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiAgVGhlIGNvbmZpZ3VyZSBldmVudCBhc2tzIHRoZSBjbGllbnQgdG8gcmVzaXplIGl0cyBzdXJmYWNlLlxuICAgKlxuICAgKiAgVGhlIHNpemUgaXMgYSBoaW50LCBpbiB0aGUgc2Vuc2UgdGhhdCB0aGUgY2xpZW50IGlzIGZyZWUgdG9cbiAgICogIGlnbm9yZSBpdCBpZiBpdCBkb2Vzbid0IHJlc2l6ZSwgcGljayBhIHNtYWxsZXIgc2l6ZSAodG9cbiAgICogIHNhdGlzZnkgYXNwZWN0IHJhdGlvIG9yIHJlc2l6ZSBpbiBzdGVwcyBvZiBOeE0gcGl4ZWxzKS5cbiAgICpcbiAgICogIFRoZSBlZGdlcyBwYXJhbWV0ZXIgcHJvdmlkZXMgYSBoaW50IGFib3V0IGhvdyB0aGUgc3VyZmFjZVxuICAgKiAgd2FzIHJlc2l6ZWQuIFRoZSBjbGllbnQgbWF5IHVzZSB0aGlzIGluZm9ybWF0aW9uIHRvIGRlY2lkZVxuICAgKiAgaG93IHRvIGFkanVzdCBpdHMgY29udGVudCB0byB0aGUgbmV3IHNpemUgKGUuZy4gYSBzY3JvbGxpbmdcbiAgICogIGFyZWEgbWlnaHQgYWRqdXN0IGl0cyBjb250ZW50IHBvc2l0aW9uIHRvIGxlYXZlIHRoZSB2aWV3YWJsZVxuICAgKiAgY29udGVudCB1bm1vdmVkKS5cbiAgICpcbiAgICogIFRoZSBjbGllbnQgaXMgZnJlZSB0byBkaXNtaXNzIGFsbCBidXQgdGhlIGxhc3QgY29uZmlndXJlXG4gICAqICBldmVudCBpdCByZWNlaXZlZC5cbiAgICpcbiAgICogIFRoZSB3aWR0aCBhbmQgaGVpZ2h0IGFyZ3VtZW50cyBzcGVjaWZ5IHRoZSBzaXplIG9mIHRoZSB3aW5kb3dcbiAgICogIGluIHN1cmZhY2UtbG9jYWwgY29vcmRpbmF0ZXMuXG4gICAqXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBlZGdlcyBob3cgdGhlIHN1cmZhY2Ugd2FzIHJlc2l6ZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIG5ldyB3aWR0aCBvZiB0aGUgc3VyZmFjZVxuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IG5ldyBoZWlnaHQgb2YgdGhlIHN1cmZhY2VcbiAgICpcbiAgICogQHNpbmNlIDFcbiAgICpcbiAgICovXG4gIGNvbmZpZ3VyZSAoZWRnZXMsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAvLyBOT09QXG4gIH1cblxuICAvKipcbiAgICpcbiAgICogIFBpbmcgYSBjbGllbnQgdG8gY2hlY2sgaWYgaXQgaXMgcmVjZWl2aW5nIGV2ZW50cyBhbmQgc2VuZGluZ1xuICAgKiAgcmVxdWVzdHMuIEEgY2xpZW50IGlzIGV4cGVjdGVkIHRvIHJlcGx5IHdpdGggYSBwb25nIHJlcXVlc3QuXG4gICAqXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXJpYWwgc2VyaWFsIG51bWJlciBvZiB0aGUgcGluZ1xuICAgKlxuICAgKiBAc2luY2UgMVxuICAgKlxuICAgKi9cbiAgcGluZyAoc2VyaWFsKSB7XG4gICAgdGhpcy5fc2hlbGxTdXJmYWNlLnBvbmcoKVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqICBUaGUgcG9wdXBfZG9uZSBldmVudCBpcyBzZW50IG91dCB3aGVuIGEgcG9wdXAgZ3JhYiBpcyBicm9rZW4sXG4gICAqICB0aGF0IGlzLCB3aGVuIHRoZSB1c2VyIGNsaWNrcyBhIHN1cmZhY2UgdGhhdCBkb2Vzbid0IGJlbG9uZ1xuICAgKiAgdG8gdGhlIGNsaWVudCBvd25pbmcgdGhlIHBvcHVwIHN1cmZhY2UuXG4gICAqXG4gICAqXG4gICAqXG4gICAqIEBzaW5jZSAxXG4gICAqXG4gICAqL1xuICBwb3B1cERvbmUgKCkge1xuICAgIC8vIE5PT1BcbiAgfVxufVxuXG5mdW5jdGlvbiBtYWluICgpIHtcbiAgLy8gY3JlYXRlIGEgbmV3IHdpbmRvdyB3aXRoIHNvbWUgYnVmZmVyc1xuICBjb25zdCB3aW5kb3cgPSBXaW5kb3cuY3JlYXRlKClcbiAgLy8gV2FpdCBmb3IgYWxsIG91dGdvaW5nIHdpbmRvdyBjcmVhdGlvbiByZXF1ZXN0cyB0byBiZSBwcm9jZXNzZWQgYmVmb3JlIHdlIGF0dGVtcHQgdG8gZHJhdyBzb21ldGhpbmdcbiAgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7IGRpc3BsYXkuc3luYygpLmxpc3RlbmVyID0geyBkb25lOiByZXNvbHZlIH0gfSkudGhlbigoKSA9PiB7XG4gICAgd2luZG93LmluaXQoKVxuICAgIHdpbmRvdy5kcmF3KDApXG4gIH0pXG4gIC8vIGZsdXNoIHBpbGVkIHVwIHdpbmRvdyBjcmVhdGlvbiByZXF1ZXN0cyB0byB0aGUgZGlzcGxheVxuICBkaXNwbGF5LmNvbm5lY3Rpb24uZmx1c2goKVxufVxuXG5tYWluKClcbiJdLCJzb3VyY2VSb290IjoiIn0=