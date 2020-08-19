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

/***/ "./node_modules/westfield-runtime-client/dist/index.js":
/*!*************************************************************!*\
  !*** ./node_modules/westfield-runtime-client/dist/index.js ***!
  \*************************************************************/
/*! exports provided: webFS, display, frame, Proxy, WlDisplayProxy, WlDisplayProtocolName, WlDisplayError, WlRegistryProxy, WlRegistryProtocolName, WlCallbackProxy, WlCallbackProtocolName, WlCompositorProxy, WlCompositorProtocolName, WlShmPoolProxy, WlShmPoolProtocolName, WlShmProxy, WlShmProtocolName, WlShmError, WlShmFormat, WlBufferProxy, WlBufferProtocolName, WlDataOfferProxy, WlDataOfferProtocolName, WlDataOfferError, WlDataSourceProxy, WlDataSourceProtocolName, WlDataSourceError, WlDataDeviceProxy, WlDataDeviceProtocolName, WlDataDeviceError, WlDataDeviceManagerProxy, WlDataDeviceManagerProtocolName, WlDataDeviceManagerDndAction, WlShellProxy, WlShellProtocolName, WlShellError, WlShellSurfaceProxy, WlShellSurfaceProtocolName, WlShellSurfaceResize, WlShellSurfaceTransient, WlShellSurfaceFullscreenMethod, WlSurfaceProxy, WlSurfaceProtocolName, WlSurfaceError, WlSeatProxy, WlSeatProtocolName, WlSeatCapability, WlPointerProxy, WlPointerProtocolName, WlPointerError, WlPointerButtonState, WlPointerAxis, WlPointerAxisSource, WlKeyboardProxy, WlKeyboardProtocolName, WlKeyboardKeymapFormat, WlKeyboardKeyState, WlTouchProxy, WlTouchProtocolName, WlOutputProxy, WlOutputProtocolName, WlOutputSubpixel, WlOutputTransform, WlOutputMode, WlRegionProxy, WlRegionProtocolName, WlSubcompositorProxy, WlSubcompositorProtocolName, WlSubcompositorError, WlSubsurfaceProxy, WlSubsurfaceProtocolName, WlSubsurfaceError, GrWebGlBufferProxy, GrWebGlBufferProtocolName, GrWebGlProxy, GrWebGlProtocolName, GrWebShmBufferProxy, GrWebShmBufferProtocolName, GrWebShmProxy, GrWebShmProtocolName, XdgWmBaseProxy, XdgWmBaseProtocolName, XdgWmBaseError, XdgPositionerProxy, XdgPositionerProtocolName, XdgPositionerError, XdgPositionerAnchor, XdgPositionerGravity, XdgPositionerConstraintAdjustment, XdgSurfaceProxy, XdgSurfaceProtocolName, XdgSurfaceError, XdgToplevelProxy, XdgToplevelProtocolName, XdgToplevelResizeEdge, XdgToplevelState, XdgPopupProxy, XdgPopupProtocolName, XdgPopupError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "webFS", function() { return webFS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "display", function() { return display; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "frame", function() { return frame; });
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "./node_modules/westfield-runtime-common/dist/index.js");
/* harmony import */ var _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./westfield-runtime-client */ "./node_modules/westfield-runtime-client/dist/westfield-runtime-client.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Proxy", function() { return _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_1__["Proxy"]; });

/* harmony import */ var _protocol__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./protocol */ "./node_modules/westfield-runtime-client/dist/protocol/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDisplayProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlDisplayProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDisplayProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlDisplayProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDisplayError", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlDisplayError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlRegistryProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlRegistryProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlRegistryProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlRegistryProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlCallbackProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlCallbackProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlCallbackProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlCallbackProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlCompositorProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlCompositorProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlCompositorProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlCompositorProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShmPoolProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlShmPoolProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShmPoolProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlShmPoolProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShmProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlShmProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShmProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlShmProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShmError", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlShmError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShmFormat", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlShmFormat"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlBufferProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlBufferProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlBufferProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlBufferProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataOfferProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlDataOfferProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataOfferProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlDataOfferProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataOfferError", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlDataOfferError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataSourceProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlDataSourceProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataSourceProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlDataSourceProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataSourceError", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlDataSourceError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataDeviceProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlDataDeviceProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataDeviceProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlDataDeviceProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataDeviceError", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlDataDeviceError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataDeviceManagerProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlDataDeviceManagerProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataDeviceManagerProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlDataDeviceManagerProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataDeviceManagerDndAction", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlDataDeviceManagerDndAction"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShellProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlShellProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShellProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlShellProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShellError", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlShellError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShellSurfaceProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlShellSurfaceProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShellSurfaceProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlShellSurfaceProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShellSurfaceResize", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlShellSurfaceResize"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShellSurfaceTransient", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlShellSurfaceTransient"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShellSurfaceFullscreenMethod", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlShellSurfaceFullscreenMethod"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSurfaceProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlSurfaceProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSurfaceProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlSurfaceProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSurfaceError", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlSurfaceError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSeatProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlSeatProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSeatProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlSeatProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSeatCapability", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlSeatCapability"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlPointerProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlPointerProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlPointerProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlPointerProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlPointerError", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlPointerError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlPointerButtonState", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlPointerButtonState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlPointerAxis", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlPointerAxis"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlPointerAxisSource", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlPointerAxisSource"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlKeyboardProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlKeyboardProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlKeyboardProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlKeyboardProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlKeyboardKeymapFormat", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlKeyboardKeymapFormat"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlKeyboardKeyState", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlKeyboardKeyState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlTouchProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlTouchProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlTouchProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlTouchProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlOutputProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlOutputProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlOutputProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlOutputProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlOutputSubpixel", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlOutputSubpixel"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlOutputTransform", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlOutputTransform"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlOutputMode", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlOutputMode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlRegionProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlRegionProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlRegionProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlRegionProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSubcompositorProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlSubcompositorProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSubcompositorProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlSubcompositorProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSubcompositorError", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlSubcompositorError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSubsurfaceProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlSubsurfaceProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSubsurfaceProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlSubsurfaceProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSubsurfaceError", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["WlSubsurfaceError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GrWebGlBufferProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["GrWebGlBufferProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GrWebGlBufferProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["GrWebGlBufferProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GrWebGlProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["GrWebGlProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GrWebGlProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["GrWebGlProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GrWebShmBufferProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["GrWebShmBufferProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GrWebShmBufferProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["GrWebShmBufferProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GrWebShmProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["GrWebShmProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GrWebShmProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["GrWebShmProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgWmBaseProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["XdgWmBaseProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgWmBaseProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["XdgWmBaseProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgWmBaseError", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["XdgWmBaseError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgPositionerProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["XdgPositionerProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgPositionerProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["XdgPositionerProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgPositionerError", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["XdgPositionerError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgPositionerAnchor", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["XdgPositionerAnchor"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgPositionerGravity", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["XdgPositionerGravity"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgPositionerConstraintAdjustment", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["XdgPositionerConstraintAdjustment"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgSurfaceProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["XdgSurfaceProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgSurfaceProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["XdgSurfaceProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgSurfaceError", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["XdgSurfaceError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgToplevelProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["XdgToplevelProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgToplevelProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["XdgToplevelProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgToplevelResizeEdge", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["XdgToplevelResizeEdge"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgToplevelState", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["XdgToplevelState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgPopupProxy", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["XdgPopupProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgPopupProtocolName", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["XdgPopupProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgPopupError", function() { return _protocol__WEBPACK_IMPORTED_MODULE_2__["XdgPopupError"]; });

/*
MIT License

Copyright (c) 2020 Erik De Rijcke

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

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const webFS = _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_1__["WebFS"].create(_uuidv4());
const connection = new westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["Connection"]();
const display = new _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_1__["DisplayImpl"](connection);
function _uuidv4() {
    // @ts-ignore
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ self.crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
}
function _setupMessageHandling(display, connection, webFS) {
    const _flushQueue = [];
    onmessage = (event) => {
        if (connection.closed) {
            return;
        }
        const webWorkerMessage = event.data;
        if (webWorkerMessage.protocolMessage instanceof ArrayBuffer) {
            const buffer = new Uint32Array(/** @type {ArrayBuffer} */ webWorkerMessage.protocolMessage);
            const fds = webWorkerMessage.meta.map(transferable => {
                if (transferable instanceof ArrayBuffer) {
                    return webFS.fromArrayBuffer(transferable);
                }
                else if (transferable instanceof ImageBitmap) {
                    return webFS.fromImageBitmap(transferable);
                }
                else if (transferable instanceof OffscreenCanvas) {
                    return webFS.fromOffscreenCanvas(transferable);
                } // else if (transferable instanceof MessagePort) {
                // }
                else {
                    throw new Error(`COMPOSITOR BUG? Unsupported transferable received from compositor: ${transferable}.`);
                }
            });
            try {
                connection.message({ buffer, fds });
            }
            catch (e) {
                if (display.errorHandler && typeof display.errorHandler === 'function') {
                    display.errorHandler(e);
                }
                else {
                    console.error('\tname: ' + e.name + ' message: ' + e.message + ' text: ' + e.text);
                    console.error('error object stack: ');
                    console.error(e.stack);
                }
            }
        }
        else {
            console.error(`[web-worker-client] server send an illegal message.`);
            connection.close();
        }
    };
    connection.onFlush = (wireMessages) => __awaiter(this, void 0, void 0, function* () {
        _flushQueue.push(wireMessages);
        if (_flushQueue.length > 1) {
            return;
        }
        while (_flushQueue.length) {
            const sendWireMessages = _flushQueue[0];
            // convert to single arrayBuffer so it can be send over a data channel using zero copy semantics.
            const messagesSize = sendWireMessages.reduce((previousValue, currentValue) => previousValue + currentValue.buffer.byteLength, 0);
            const sendBuffer = new Uint32Array(new ArrayBuffer(messagesSize));
            let offset = 0;
            const meta = [];
            for (const wireMessage of sendWireMessages) {
                for (const webFd of wireMessage.fds) {
                    const transferable = yield webFd.getTransferable();
                    meta.push(transferable);
                }
                const message = new Uint32Array(wireMessage.buffer);
                sendBuffer.set(message, offset);
                offset += message.length;
            }
            self.postMessage({ protocolMessage: sendBuffer.buffer, meta }, [sendBuffer.buffer, ...meta]);
            _flushQueue.shift();
        }
    });
}
_setupMessageHandling(display, connection, webFS);
function frame(wlSurfaceProxy) {
    return () => {
        return new Promise(resolve => {
            const wlCallbackProxy = wlSurfaceProxy.frame();
            wlCallbackProxy.listener = {
                done: (data) => {
                    resolve(data);
                    wlCallbackProxy.destroy();
                }
            };
        });
    };
}


//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/westfield-runtime-client/dist/protocol/gr_web_gl.js":
/*!**************************************************************************!*\
  !*** ./node_modules/westfield-runtime-client/dist/protocol/gr_web_gl.js ***!
  \**************************************************************************/
/*! exports provided: GrWebGlBufferProxy, GrWebGlBufferProtocolName, GrWebGlProxy, GrWebGlProtocolName */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GrWebGlBufferProxy", function() { return GrWebGlBufferProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GrWebGlBufferProtocolName", function() { return GrWebGlBufferProtocolName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GrWebGlProxy", function() { return GrWebGlProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GrWebGlProtocolName", function() { return GrWebGlProtocolName; });
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "./node_modules/westfield-runtime-common/dist/index.js");
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! . */ "./node_modules/westfield-runtime-client/dist/protocol/index.js");
/* harmony import */ var _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../westfield-runtime-client */ "./node_modules/westfield-runtime-client/dist/westfield-runtime-client.js");
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
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



class GrWebGlBufferProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
    [0](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.offscreenCanvas(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["h"])(message)));
        });
    }
}
const GrWebGlBufferProtocolName = 'gr_web_gl_buffer';
/**
 *
 *            A singleton global object that provides support for web gl.
 *
 *            Clients can create wl_buffer objects using the create_buffer request.
 *
 */
class GrWebGlProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
    /**
     *
     *                Create a web_gl_buffer object.
     *
     * @since 1
     *
     */
    createWebGlBuffer() {
        return this._marshallConstructor(this.id, 0, ___WEBPACK_IMPORTED_MODULE_1__["GrWebGlBufferProxy"], [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["newObject"])()]);
    }
    /**
     *
     *                Create a wl_buffer object from a gr_web_gl_buffer so it can be used with a surface.
     *
     * @since 1
     *
     */
    createBuffer(grWebGlBuffer) {
        return this._marshallConstructor(this.id, 1, ___WEBPACK_IMPORTED_MODULE_1__["WlBufferProxy"], [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["newObject"])(), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["object"])(grWebGlBuffer)]);
    }
}
const GrWebGlProtocolName = 'gr_web_gl';
//# sourceMappingURL=gr_web_gl.js.map

/***/ }),

/***/ "./node_modules/westfield-runtime-client/dist/protocol/gr_web_shm.js":
/*!***************************************************************************!*\
  !*** ./node_modules/westfield-runtime-client/dist/protocol/gr_web_shm.js ***!
  \***************************************************************************/
/*! exports provided: GrWebShmBufferProxy, GrWebShmBufferProtocolName, GrWebShmProxy, GrWebShmProtocolName */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GrWebShmBufferProxy", function() { return GrWebShmBufferProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GrWebShmBufferProtocolName", function() { return GrWebShmBufferProtocolName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GrWebShmProxy", function() { return GrWebShmProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GrWebShmProtocolName", function() { return GrWebShmProtocolName; });
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "./node_modules/westfield-runtime-common/dist/index.js");
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! . */ "./node_modules/westfield-runtime-client/dist/protocol/index.js");
/* harmony import */ var _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../westfield-runtime-client */ "./node_modules/westfield-runtime-client/dist/westfield-runtime-client.js");
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
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



class GrWebShmBufferProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
    /**
     *
     *                Attaches an HTML5 array buffer to the compositor. After attaching, the array buffer ownership is passed
     *                to the compositor main thread. The array buffer can not be used for writing anymore by the client as
     *                per HTML5 Transferable objects spec.
     *
     *                The pixel format of the attached array buffer must always be RGBA8888 as per HTML5 ImageData spec.
     *                Stride must always equal width.
     *
     * @since 1
     *
     */
    attach(contents) {
        this._marshall(this.id, 0, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["fileDescriptor"])(contents)]);
    }
    [0](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.detach(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["h"])(message)));
        });
    }
}
const GrWebShmBufferProtocolName = 'gr_web_shm_buffer';
/**
 *
 *            A singleton global object that provides support for shared memory through HTML5 array buffers.
 *
 *            Clients can create wl_buffer objects using the create_buffer request.
 *
 */
class GrWebShmProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
    /**
     *
     *                Create a gr_web_shm_buffer object.
     *
     * @since 1
     *
     */
    createWebArrayBuffer() {
        return this._marshallConstructor(this.id, 0, ___WEBPACK_IMPORTED_MODULE_1__["GrWebShmBufferProxy"], [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["newObject"])()]);
    }
    /**
     *
     *                Create a wl_buffer object from a web_array_buffer so it can be used with a surface.
     *
     * @since 1
     *
     */
    createBuffer(webArrayBuffer, width, height) {
        return this._marshallConstructor(this.id, 1, ___WEBPACK_IMPORTED_MODULE_1__["WlBufferProxy"], [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["newObject"])(), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["object"])(webArrayBuffer), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(width), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(height)]);
    }
}
const GrWebShmProtocolName = 'gr_web_shm';
//# sourceMappingURL=gr_web_shm.js.map

/***/ }),

/***/ "./node_modules/westfield-runtime-client/dist/protocol/index.js":
/*!**********************************************************************!*\
  !*** ./node_modules/westfield-runtime-client/dist/protocol/index.js ***!
  \**********************************************************************/
/*! exports provided: WlDisplayProxy, WlDisplayProtocolName, WlDisplayError, WlRegistryProxy, WlRegistryProtocolName, WlCallbackProxy, WlCallbackProtocolName, WlCompositorProxy, WlCompositorProtocolName, WlShmPoolProxy, WlShmPoolProtocolName, WlShmProxy, WlShmProtocolName, WlShmError, WlShmFormat, WlBufferProxy, WlBufferProtocolName, WlDataOfferProxy, WlDataOfferProtocolName, WlDataOfferError, WlDataSourceProxy, WlDataSourceProtocolName, WlDataSourceError, WlDataDeviceProxy, WlDataDeviceProtocolName, WlDataDeviceError, WlDataDeviceManagerProxy, WlDataDeviceManagerProtocolName, WlDataDeviceManagerDndAction, WlShellProxy, WlShellProtocolName, WlShellError, WlShellSurfaceProxy, WlShellSurfaceProtocolName, WlShellSurfaceResize, WlShellSurfaceTransient, WlShellSurfaceFullscreenMethod, WlSurfaceProxy, WlSurfaceProtocolName, WlSurfaceError, WlSeatProxy, WlSeatProtocolName, WlSeatCapability, WlPointerProxy, WlPointerProtocolName, WlPointerError, WlPointerButtonState, WlPointerAxis, WlPointerAxisSource, WlKeyboardProxy, WlKeyboardProtocolName, WlKeyboardKeymapFormat, WlKeyboardKeyState, WlTouchProxy, WlTouchProtocolName, WlOutputProxy, WlOutputProtocolName, WlOutputSubpixel, WlOutputTransform, WlOutputMode, WlRegionProxy, WlRegionProtocolName, WlSubcompositorProxy, WlSubcompositorProtocolName, WlSubcompositorError, WlSubsurfaceProxy, WlSubsurfaceProtocolName, WlSubsurfaceError, GrWebGlBufferProxy, GrWebGlBufferProtocolName, GrWebGlProxy, GrWebGlProtocolName, GrWebShmBufferProxy, GrWebShmBufferProtocolName, GrWebShmProxy, GrWebShmProtocolName, XdgWmBaseProxy, XdgWmBaseProtocolName, XdgWmBaseError, XdgPositionerProxy, XdgPositionerProtocolName, XdgPositionerError, XdgPositionerAnchor, XdgPositionerGravity, XdgPositionerConstraintAdjustment, XdgSurfaceProxy, XdgSurfaceProtocolName, XdgSurfaceError, XdgToplevelProxy, XdgToplevelProtocolName, XdgToplevelResizeEdge, XdgToplevelState, XdgPopupProxy, XdgPopupProtocolName, XdgPopupError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wayland__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./wayland */ "./node_modules/westfield-runtime-client/dist/protocol/wayland.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDisplayProxy", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlDisplayProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDisplayProtocolName", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlDisplayProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDisplayError", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlDisplayError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlRegistryProxy", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlRegistryProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlRegistryProtocolName", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlRegistryProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlCallbackProxy", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlCallbackProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlCallbackProtocolName", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlCallbackProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlCompositorProxy", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlCompositorProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlCompositorProtocolName", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlCompositorProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShmPoolProxy", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlShmPoolProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShmPoolProtocolName", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlShmPoolProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShmProxy", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlShmProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShmProtocolName", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlShmProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShmError", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlShmError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShmFormat", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlShmFormat"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlBufferProxy", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlBufferProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlBufferProtocolName", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlBufferProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataOfferProxy", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlDataOfferProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataOfferProtocolName", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlDataOfferProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataOfferError", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlDataOfferError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataSourceProxy", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlDataSourceProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataSourceProtocolName", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlDataSourceProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataSourceError", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlDataSourceError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataDeviceProxy", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlDataDeviceProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataDeviceProtocolName", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlDataDeviceProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataDeviceError", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlDataDeviceError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataDeviceManagerProxy", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlDataDeviceManagerProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataDeviceManagerProtocolName", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlDataDeviceManagerProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlDataDeviceManagerDndAction", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlDataDeviceManagerDndAction"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShellProxy", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlShellProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShellProtocolName", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlShellProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShellError", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlShellError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShellSurfaceProxy", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlShellSurfaceProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShellSurfaceProtocolName", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlShellSurfaceProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShellSurfaceResize", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlShellSurfaceResize"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShellSurfaceTransient", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlShellSurfaceTransient"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlShellSurfaceFullscreenMethod", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlShellSurfaceFullscreenMethod"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSurfaceProxy", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlSurfaceProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSurfaceProtocolName", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlSurfaceProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSurfaceError", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlSurfaceError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSeatProxy", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlSeatProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSeatProtocolName", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlSeatProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSeatCapability", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlSeatCapability"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlPointerProxy", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlPointerProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlPointerProtocolName", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlPointerProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlPointerError", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlPointerError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlPointerButtonState", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlPointerButtonState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlPointerAxis", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlPointerAxis"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlPointerAxisSource", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlPointerAxisSource"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlKeyboardProxy", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlKeyboardProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlKeyboardProtocolName", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlKeyboardProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlKeyboardKeymapFormat", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlKeyboardKeymapFormat"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlKeyboardKeyState", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlKeyboardKeyState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlTouchProxy", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlTouchProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlTouchProtocolName", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlTouchProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlOutputProxy", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlOutputProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlOutputProtocolName", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlOutputProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlOutputSubpixel", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlOutputSubpixel"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlOutputTransform", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlOutputTransform"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlOutputMode", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlOutputMode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlRegionProxy", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlRegionProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlRegionProtocolName", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlRegionProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSubcompositorProxy", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlSubcompositorProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSubcompositorProtocolName", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlSubcompositorProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSubcompositorError", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlSubcompositorError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSubsurfaceProxy", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlSubsurfaceProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSubsurfaceProtocolName", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlSubsurfaceProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlSubsurfaceError", function() { return _wayland__WEBPACK_IMPORTED_MODULE_0__["WlSubsurfaceError"]; });

/* harmony import */ var _gr_web_gl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gr_web_gl */ "./node_modules/westfield-runtime-client/dist/protocol/gr_web_gl.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GrWebGlBufferProxy", function() { return _gr_web_gl__WEBPACK_IMPORTED_MODULE_1__["GrWebGlBufferProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GrWebGlBufferProtocolName", function() { return _gr_web_gl__WEBPACK_IMPORTED_MODULE_1__["GrWebGlBufferProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GrWebGlProxy", function() { return _gr_web_gl__WEBPACK_IMPORTED_MODULE_1__["GrWebGlProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GrWebGlProtocolName", function() { return _gr_web_gl__WEBPACK_IMPORTED_MODULE_1__["GrWebGlProtocolName"]; });

/* harmony import */ var _gr_web_shm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gr_web_shm */ "./node_modules/westfield-runtime-client/dist/protocol/gr_web_shm.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GrWebShmBufferProxy", function() { return _gr_web_shm__WEBPACK_IMPORTED_MODULE_2__["GrWebShmBufferProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GrWebShmBufferProtocolName", function() { return _gr_web_shm__WEBPACK_IMPORTED_MODULE_2__["GrWebShmBufferProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GrWebShmProxy", function() { return _gr_web_shm__WEBPACK_IMPORTED_MODULE_2__["GrWebShmProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GrWebShmProtocolName", function() { return _gr_web_shm__WEBPACK_IMPORTED_MODULE_2__["GrWebShmProtocolName"]; });

/* harmony import */ var _xdg_shell__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./xdg_shell */ "./node_modules/westfield-runtime-client/dist/protocol/xdg_shell.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgWmBaseProxy", function() { return _xdg_shell__WEBPACK_IMPORTED_MODULE_3__["XdgWmBaseProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgWmBaseProtocolName", function() { return _xdg_shell__WEBPACK_IMPORTED_MODULE_3__["XdgWmBaseProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgWmBaseError", function() { return _xdg_shell__WEBPACK_IMPORTED_MODULE_3__["XdgWmBaseError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgPositionerProxy", function() { return _xdg_shell__WEBPACK_IMPORTED_MODULE_3__["XdgPositionerProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgPositionerProtocolName", function() { return _xdg_shell__WEBPACK_IMPORTED_MODULE_3__["XdgPositionerProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgPositionerError", function() { return _xdg_shell__WEBPACK_IMPORTED_MODULE_3__["XdgPositionerError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgPositionerAnchor", function() { return _xdg_shell__WEBPACK_IMPORTED_MODULE_3__["XdgPositionerAnchor"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgPositionerGravity", function() { return _xdg_shell__WEBPACK_IMPORTED_MODULE_3__["XdgPositionerGravity"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgPositionerConstraintAdjustment", function() { return _xdg_shell__WEBPACK_IMPORTED_MODULE_3__["XdgPositionerConstraintAdjustment"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgSurfaceProxy", function() { return _xdg_shell__WEBPACK_IMPORTED_MODULE_3__["XdgSurfaceProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgSurfaceProtocolName", function() { return _xdg_shell__WEBPACK_IMPORTED_MODULE_3__["XdgSurfaceProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgSurfaceError", function() { return _xdg_shell__WEBPACK_IMPORTED_MODULE_3__["XdgSurfaceError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgToplevelProxy", function() { return _xdg_shell__WEBPACK_IMPORTED_MODULE_3__["XdgToplevelProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgToplevelProtocolName", function() { return _xdg_shell__WEBPACK_IMPORTED_MODULE_3__["XdgToplevelProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgToplevelResizeEdge", function() { return _xdg_shell__WEBPACK_IMPORTED_MODULE_3__["XdgToplevelResizeEdge"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgToplevelState", function() { return _xdg_shell__WEBPACK_IMPORTED_MODULE_3__["XdgToplevelState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgPopupProxy", function() { return _xdg_shell__WEBPACK_IMPORTED_MODULE_3__["XdgPopupProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgPopupProtocolName", function() { return _xdg_shell__WEBPACK_IMPORTED_MODULE_3__["XdgPopupProtocolName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "XdgPopupError", function() { return _xdg_shell__WEBPACK_IMPORTED_MODULE_3__["XdgPopupError"]; });





//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/westfield-runtime-client/dist/protocol/wayland.js":
/*!************************************************************************!*\
  !*** ./node_modules/westfield-runtime-client/dist/protocol/wayland.js ***!
  \************************************************************************/
/*! exports provided: WlDisplayProxy, WlDisplayProtocolName, WlDisplayError, WlRegistryProxy, WlRegistryProtocolName, WlCallbackProxy, WlCallbackProtocolName, WlCompositorProxy, WlCompositorProtocolName, WlShmPoolProxy, WlShmPoolProtocolName, WlShmProxy, WlShmProtocolName, WlShmError, WlShmFormat, WlBufferProxy, WlBufferProtocolName, WlDataOfferProxy, WlDataOfferProtocolName, WlDataOfferError, WlDataSourceProxy, WlDataSourceProtocolName, WlDataSourceError, WlDataDeviceProxy, WlDataDeviceProtocolName, WlDataDeviceError, WlDataDeviceManagerProxy, WlDataDeviceManagerProtocolName, WlDataDeviceManagerDndAction, WlShellProxy, WlShellProtocolName, WlShellError, WlShellSurfaceProxy, WlShellSurfaceProtocolName, WlShellSurfaceResize, WlShellSurfaceTransient, WlShellSurfaceFullscreenMethod, WlSurfaceProxy, WlSurfaceProtocolName, WlSurfaceError, WlSeatProxy, WlSeatProtocolName, WlSeatCapability, WlPointerProxy, WlPointerProtocolName, WlPointerError, WlPointerButtonState, WlPointerAxis, WlPointerAxisSource, WlKeyboardProxy, WlKeyboardProtocolName, WlKeyboardKeymapFormat, WlKeyboardKeyState, WlTouchProxy, WlTouchProtocolName, WlOutputProxy, WlOutputProtocolName, WlOutputSubpixel, WlOutputTransform, WlOutputMode, WlRegionProxy, WlRegionProtocolName, WlSubcompositorProxy, WlSubcompositorProtocolName, WlSubcompositorError, WlSubsurfaceProxy, WlSubsurfaceProtocolName, WlSubsurfaceError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlDisplayProxy", function() { return WlDisplayProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlDisplayProtocolName", function() { return WlDisplayProtocolName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlDisplayError", function() { return WlDisplayError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlRegistryProxy", function() { return WlRegistryProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlRegistryProtocolName", function() { return WlRegistryProtocolName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlCallbackProxy", function() { return WlCallbackProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlCallbackProtocolName", function() { return WlCallbackProtocolName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlCompositorProxy", function() { return WlCompositorProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlCompositorProtocolName", function() { return WlCompositorProtocolName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlShmPoolProxy", function() { return WlShmPoolProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlShmPoolProtocolName", function() { return WlShmPoolProtocolName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlShmProxy", function() { return WlShmProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlShmProtocolName", function() { return WlShmProtocolName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlShmError", function() { return WlShmError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlShmFormat", function() { return WlShmFormat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlBufferProxy", function() { return WlBufferProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlBufferProtocolName", function() { return WlBufferProtocolName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlDataOfferProxy", function() { return WlDataOfferProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlDataOfferProtocolName", function() { return WlDataOfferProtocolName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlDataOfferError", function() { return WlDataOfferError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlDataSourceProxy", function() { return WlDataSourceProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlDataSourceProtocolName", function() { return WlDataSourceProtocolName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlDataSourceError", function() { return WlDataSourceError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlDataDeviceProxy", function() { return WlDataDeviceProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlDataDeviceProtocolName", function() { return WlDataDeviceProtocolName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlDataDeviceError", function() { return WlDataDeviceError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlDataDeviceManagerProxy", function() { return WlDataDeviceManagerProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlDataDeviceManagerProtocolName", function() { return WlDataDeviceManagerProtocolName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlDataDeviceManagerDndAction", function() { return WlDataDeviceManagerDndAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlShellProxy", function() { return WlShellProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlShellProtocolName", function() { return WlShellProtocolName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlShellError", function() { return WlShellError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlShellSurfaceProxy", function() { return WlShellSurfaceProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlShellSurfaceProtocolName", function() { return WlShellSurfaceProtocolName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlShellSurfaceResize", function() { return WlShellSurfaceResize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlShellSurfaceTransient", function() { return WlShellSurfaceTransient; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlShellSurfaceFullscreenMethod", function() { return WlShellSurfaceFullscreenMethod; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlSurfaceProxy", function() { return WlSurfaceProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlSurfaceProtocolName", function() { return WlSurfaceProtocolName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlSurfaceError", function() { return WlSurfaceError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlSeatProxy", function() { return WlSeatProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlSeatProtocolName", function() { return WlSeatProtocolName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlSeatCapability", function() { return WlSeatCapability; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlPointerProxy", function() { return WlPointerProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlPointerProtocolName", function() { return WlPointerProtocolName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlPointerError", function() { return WlPointerError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlPointerButtonState", function() { return WlPointerButtonState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlPointerAxis", function() { return WlPointerAxis; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlPointerAxisSource", function() { return WlPointerAxisSource; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlKeyboardProxy", function() { return WlKeyboardProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlKeyboardProtocolName", function() { return WlKeyboardProtocolName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlKeyboardKeymapFormat", function() { return WlKeyboardKeymapFormat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlKeyboardKeyState", function() { return WlKeyboardKeyState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlTouchProxy", function() { return WlTouchProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlTouchProtocolName", function() { return WlTouchProtocolName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlOutputProxy", function() { return WlOutputProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlOutputProtocolName", function() { return WlOutputProtocolName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlOutputSubpixel", function() { return WlOutputSubpixel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlOutputTransform", function() { return WlOutputTransform; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlOutputMode", function() { return WlOutputMode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlRegionProxy", function() { return WlRegionProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlRegionProtocolName", function() { return WlRegionProtocolName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlSubcompositorProxy", function() { return WlSubcompositorProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlSubcompositorProtocolName", function() { return WlSubcompositorProtocolName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlSubcompositorError", function() { return WlSubcompositorError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlSubsurfaceProxy", function() { return WlSubsurfaceProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlSubsurfaceProtocolName", function() { return WlSubsurfaceProtocolName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlSubsurfaceError", function() { return WlSubsurfaceError; });
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "./node_modules/westfield-runtime-common/dist/index.js");
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! . */ "./node_modules/westfield-runtime-client/dist/protocol/index.js");
/* harmony import */ var _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../westfield-runtime-client */ "./node_modules/westfield-runtime-client/dist/westfield-runtime-client.js");
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
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



/**
 *
 *      The core global object.  This is a special singleton object.  It
 *      is used for internal Wayland protocol features.
 *
 */
class WlDisplayProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
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
     * @since 1
     *
     */
    sync() {
        return this._marshallConstructor(this.id, 0, ___WEBPACK_IMPORTED_MODULE_1__["WlCallbackProxy"], [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["newObject"])()]);
    }
    /**
     *
     *	This request creates a registry object that allows the client
     *	to list and bind the global objects available from the
     *	compositor.
     *
     * @since 1
     *
     */
    getRegistry() {
        return this._marshallConstructor(this.id, 1, ___WEBPACK_IMPORTED_MODULE_1__["WlRegistryProxy"], [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["newObject"])()]);
    }
    [0](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.error(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["o"])(message, this._connection), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["s"])(message)));
        });
    }
    [1](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.deleteId(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message)));
        });
    }
}
const WlDisplayProtocolName = 'wl_display';
var WlDisplayError;
(function (WlDisplayError) {
    /**
     * server couldn't find object
     */
    WlDisplayError[WlDisplayError["_invalidObject"] = 0] = "_invalidObject";
    /**
     * method doesn't exist on the specified interface
     */
    WlDisplayError[WlDisplayError["_invalidMethod"] = 1] = "_invalidMethod";
    /**
     * server is out of memory
     */
    WlDisplayError[WlDisplayError["_noMemory"] = 2] = "_noMemory";
})(WlDisplayError || (WlDisplayError = {}));
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
class WlRegistryProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
    /**
    * Bind a new object to the global.
    *
    * Binds a new, client-created object to the server using the specified name as the identifier.
    *
    */
    bind(name, interface_, proxyClass, version) {
        return this._marshallConstructor(this.id, 0, proxyClass, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(name), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["string"])(interface_), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(version), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["newObject"])()]);
    }
    [0](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.global(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["s"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message)));
        });
    }
    [1](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.globalRemove(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message)));
        });
    }
}
const WlRegistryProtocolName = 'wl_registry';
/**
 *
 *      Clients can handle the 'done' event to get notified when
 *      the related request is done.
 *
 */
class WlCallbackProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
    [0](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.done(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message)));
        });
    }
}
const WlCallbackProtocolName = 'wl_callback';
/**
 *
 *      A compositor.  This object is a singleton global.  The
 *      compositor is in charge of combining the contents of multiple
 *      surfaces into one displayable output.
 *
 */
class WlCompositorProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
    /**
     *
     *	Ask the compositor to create a new surface.
     *
     * @since 1
     *
     */
    createSurface() {
        return this._marshallConstructor(this.id, 0, ___WEBPACK_IMPORTED_MODULE_1__["WlSurfaceProxy"], [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["newObject"])()]);
    }
    /**
     *
     *	Ask the compositor to create a new region.
     *
     * @since 1
     *
     */
    createRegion() {
        return this._marshallConstructor(this.id, 1, ___WEBPACK_IMPORTED_MODULE_1__["WlRegionProxy"], [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["newObject"])()]);
    }
}
const WlCompositorProtocolName = 'wl_compositor';
/**
 *
 *      The wl_shm_pool object encapsulates a piece of memory shared
 *      between the compositor and client.  Through the wl_shm_pool
 *      object, the client can allocate shared memory wl_buffer objects.
 *      All objects created through the same pool share the same
 *      underlying mapped memory. Reusing the mapped memory avoids the
 *      setup/teardown overhead and is useful when interactively resizing
 *      a surface or for many small buffers.
 *
 */
class WlShmPoolProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
    /**
     *
     *	Create a wl_buffer object from the pool.
     *
     *	The buffer is created offset bytes into the pool and has
     *	width and height as specified.  The stride argument specifies
     *	the number of bytes from the beginning of one row to the beginning
     *	of the next.  The format is the pixel format of the buffer and
     *	must be one of those advertised through the wl_shm.format event.
     *
     *	A buffer will keep a reference to the pool it was created from
     *	so it is valid to destroy the pool immediately after creating
     *	a buffer from it.
     *
     * @since 1
     *
     */
    createBuffer(offset, width, height, stride, format) {
        return this._marshallConstructor(this.id, 0, ___WEBPACK_IMPORTED_MODULE_1__["WlBufferProxy"], [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["newObject"])(), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(offset), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(width), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(height), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(stride), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(format)]);
    }
    /**
     *
     *	Destroy the shared memory pool.
     *
     *	The mmapped memory will be released when all
     *	buffers that have been created from this pool
     *	are gone.
     *
     * @since 1
     *
     */
    destroy() {
        super.destroy();
        this._marshall(this.id, 1, []);
    }
    /**
     *
     *	This request will cause the server to remap the backing memory
     *	for the pool from the file descriptor passed when the pool was
     *	created, but using the new size.  This request can only be
     *	used to make the pool bigger.
     *
     * @since 1
     *
     */
    resize(size) {
        this._marshall(this.id, 2, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(size)]);
    }
}
const WlShmPoolProtocolName = 'wl_shm_pool';
/**
 *
 *      A singleton global object that provides support for shared
 *      memory.
 *
 *      Clients can create wl_shm_pool objects using the create_pool
 *      request.
 *
 *      At connection setup time, the wl_shm object emits one or more
 *      format events to inform clients about the valid pixel formats
 *      that can be used for buffers.
 *
 */
class WlShmProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
    /**
     *
     *	Create a new wl_shm_pool object.
     *
     *	The pool can be used to create shared memory based buffer
     *	objects.  The server will mmap size bytes of the passed file
     *	descriptor, to use as backing memory for the pool.
     *
     * @since 1
     *
     */
    createPool(fd, size) {
        return this._marshallConstructor(this.id, 0, ___WEBPACK_IMPORTED_MODULE_1__["WlShmPoolProxy"], [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["newObject"])(), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["fileDescriptor"])(fd), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(size)]);
    }
    [0](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.format(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message)));
        });
    }
}
const WlShmProtocolName = 'wl_shm';
var WlShmError;
(function (WlShmError) {
    /**
     * buffer format is not known
     */
    WlShmError[WlShmError["_invalidFormat"] = 0] = "_invalidFormat";
    /**
     * invalid size or stride during pool or buffer creation
     */
    WlShmError[WlShmError["_invalidStride"] = 1] = "_invalidStride";
    /**
     * mmapping the file descriptor failed
     */
    WlShmError[WlShmError["_invalidFd"] = 2] = "_invalidFd";
})(WlShmError || (WlShmError = {}));
var WlShmFormat;
(function (WlShmFormat) {
    /**
     * 32-bit ARGB format, [31:0] A:R:G:B 8:8:8:8 little endian
     */
    WlShmFormat[WlShmFormat["_argb8888"] = 0] = "_argb8888";
    /**
     * 32-bit RGB format, [31:0] x:R:G:B 8:8:8:8 little endian
     */
    WlShmFormat[WlShmFormat["_xrgb8888"] = 1] = "_xrgb8888";
    /**
     * 8-bit color index format, [7:0] C
     */
    WlShmFormat[WlShmFormat["_c8"] = 538982467] = "_c8";
    /**
     * 8-bit RGB format, [7:0] R:G:B 3:3:2
     */
    WlShmFormat[WlShmFormat["_rgb332"] = 943867730] = "_rgb332";
    /**
     * 8-bit BGR format, [7:0] B:G:R 2:3:3
     */
    WlShmFormat[WlShmFormat["_bgr233"] = 944916290] = "_bgr233";
    /**
     * 16-bit xRGB format, [15:0] x:R:G:B 4:4:4:4 little endian
     */
    WlShmFormat[WlShmFormat["_xrgb4444"] = 842093144] = "_xrgb4444";
    /**
     * 16-bit xBGR format, [15:0] x:B:G:R 4:4:4:4 little endian
     */
    WlShmFormat[WlShmFormat["_xbgr4444"] = 842089048] = "_xbgr4444";
    /**
     * 16-bit RGBx format, [15:0] R:G:B:x 4:4:4:4 little endian
     */
    WlShmFormat[WlShmFormat["_rgbx4444"] = 842094674] = "_rgbx4444";
    /**
     * 16-bit BGRx format, [15:0] B:G:R:x 4:4:4:4 little endian
     */
    WlShmFormat[WlShmFormat["_bgrx4444"] = 842094658] = "_bgrx4444";
    /**
     * 16-bit ARGB format, [15:0] A:R:G:B 4:4:4:4 little endian
     */
    WlShmFormat[WlShmFormat["_argb4444"] = 842093121] = "_argb4444";
    /**
     * 16-bit ABGR format, [15:0] A:B:G:R 4:4:4:4 little endian
     */
    WlShmFormat[WlShmFormat["_abgr4444"] = 842089025] = "_abgr4444";
    /**
     * 16-bit RBGA format, [15:0] R:G:B:A 4:4:4:4 little endian
     */
    WlShmFormat[WlShmFormat["_rgba4444"] = 842088786] = "_rgba4444";
    /**
     * 16-bit BGRA format, [15:0] B:G:R:A 4:4:4:4 little endian
     */
    WlShmFormat[WlShmFormat["_bgra4444"] = 842088770] = "_bgra4444";
    /**
     * 16-bit xRGB format, [15:0] x:R:G:B 1:5:5:5 little endian
     */
    WlShmFormat[WlShmFormat["_xrgb1555"] = 892424792] = "_xrgb1555";
    /**
     * 16-bit xBGR 1555 format, [15:0] x:B:G:R 1:5:5:5 little endian
     */
    WlShmFormat[WlShmFormat["_xbgr1555"] = 892420696] = "_xbgr1555";
    /**
     * 16-bit RGBx 5551 format, [15:0] R:G:B:x 5:5:5:1 little endian
     */
    WlShmFormat[WlShmFormat["_rgbx5551"] = 892426322] = "_rgbx5551";
    /**
     * 16-bit BGRx 5551 format, [15:0] B:G:R:x 5:5:5:1 little endian
     */
    WlShmFormat[WlShmFormat["_bgrx5551"] = 892426306] = "_bgrx5551";
    /**
     * 16-bit ARGB 1555 format, [15:0] A:R:G:B 1:5:5:5 little endian
     */
    WlShmFormat[WlShmFormat["_argb1555"] = 892424769] = "_argb1555";
    /**
     * 16-bit ABGR 1555 format, [15:0] A:B:G:R 1:5:5:5 little endian
     */
    WlShmFormat[WlShmFormat["_abgr1555"] = 892420673] = "_abgr1555";
    /**
     * 16-bit RGBA 5551 format, [15:0] R:G:B:A 5:5:5:1 little endian
     */
    WlShmFormat[WlShmFormat["_rgba5551"] = 892420434] = "_rgba5551";
    /**
     * 16-bit BGRA 5551 format, [15:0] B:G:R:A 5:5:5:1 little endian
     */
    WlShmFormat[WlShmFormat["_bgra5551"] = 892420418] = "_bgra5551";
    /**
     * 16-bit RGB 565 format, [15:0] R:G:B 5:6:5 little endian
     */
    WlShmFormat[WlShmFormat["_rgb565"] = 909199186] = "_rgb565";
    /**
     * 16-bit BGR 565 format, [15:0] B:G:R 5:6:5 little endian
     */
    WlShmFormat[WlShmFormat["_bgr565"] = 909199170] = "_bgr565";
    /**
     * 24-bit RGB format, [23:0] R:G:B little endian
     */
    WlShmFormat[WlShmFormat["_rgb888"] = 875710290] = "_rgb888";
    /**
     * 24-bit BGR format, [23:0] B:G:R little endian
     */
    WlShmFormat[WlShmFormat["_bgr888"] = 875710274] = "_bgr888";
    /**
     * 32-bit xBGR format, [31:0] x:B:G:R 8:8:8:8 little endian
     */
    WlShmFormat[WlShmFormat["_xbgr8888"] = 875709016] = "_xbgr8888";
    /**
     * 32-bit RGBx format, [31:0] R:G:B:x 8:8:8:8 little endian
     */
    WlShmFormat[WlShmFormat["_rgbx8888"] = 875714642] = "_rgbx8888";
    /**
     * 32-bit BGRx format, [31:0] B:G:R:x 8:8:8:8 little endian
     */
    WlShmFormat[WlShmFormat["_bgrx8888"] = 875714626] = "_bgrx8888";
    /**
     * 32-bit ABGR format, [31:0] A:B:G:R 8:8:8:8 little endian
     */
    WlShmFormat[WlShmFormat["_abgr8888"] = 875708993] = "_abgr8888";
    /**
     * 32-bit RGBA format, [31:0] R:G:B:A 8:8:8:8 little endian
     */
    WlShmFormat[WlShmFormat["_rgba8888"] = 875708754] = "_rgba8888";
    /**
     * 32-bit BGRA format, [31:0] B:G:R:A 8:8:8:8 little endian
     */
    WlShmFormat[WlShmFormat["_bgra8888"] = 875708738] = "_bgra8888";
    /**
     * 32-bit xRGB format, [31:0] x:R:G:B 2:10:10:10 little endian
     */
    WlShmFormat[WlShmFormat["_xrgb2101010"] = 808669784] = "_xrgb2101010";
    /**
     * 32-bit xBGR format, [31:0] x:B:G:R 2:10:10:10 little endian
     */
    WlShmFormat[WlShmFormat["_xbgr2101010"] = 808665688] = "_xbgr2101010";
    /**
     * 32-bit RGBx format, [31:0] R:G:B:x 10:10:10:2 little endian
     */
    WlShmFormat[WlShmFormat["_rgbx1010102"] = 808671314] = "_rgbx1010102";
    /**
     * 32-bit BGRx format, [31:0] B:G:R:x 10:10:10:2 little endian
     */
    WlShmFormat[WlShmFormat["_bgrx1010102"] = 808671298] = "_bgrx1010102";
    /**
     * 32-bit ARGB format, [31:0] A:R:G:B 2:10:10:10 little endian
     */
    WlShmFormat[WlShmFormat["_argb2101010"] = 808669761] = "_argb2101010";
    /**
     * 32-bit ABGR format, [31:0] A:B:G:R 2:10:10:10 little endian
     */
    WlShmFormat[WlShmFormat["_abgr2101010"] = 808665665] = "_abgr2101010";
    /**
     * 32-bit RGBA format, [31:0] R:G:B:A 10:10:10:2 little endian
     */
    WlShmFormat[WlShmFormat["_rgba1010102"] = 808665426] = "_rgba1010102";
    /**
     * 32-bit BGRA format, [31:0] B:G:R:A 10:10:10:2 little endian
     */
    WlShmFormat[WlShmFormat["_bgra1010102"] = 808665410] = "_bgra1010102";
    /**
     * packed YCbCr format, [31:0] Cr0:Y1:Cb0:Y0 8:8:8:8 little endian
     */
    WlShmFormat[WlShmFormat["_yuyv"] = 1448695129] = "_yuyv";
    /**
     * packed YCbCr format, [31:0] Cb0:Y1:Cr0:Y0 8:8:8:8 little endian
     */
    WlShmFormat[WlShmFormat["_yvyu"] = 1431918169] = "_yvyu";
    /**
     * packed YCbCr format, [31:0] Y1:Cr0:Y0:Cb0 8:8:8:8 little endian
     */
    WlShmFormat[WlShmFormat["_uyvy"] = 1498831189] = "_uyvy";
    /**
     * packed YCbCr format, [31:0] Y1:Cb0:Y0:Cr0 8:8:8:8 little endian
     */
    WlShmFormat[WlShmFormat["_vyuy"] = 1498765654] = "_vyuy";
    /**
     * packed AYCbCr format, [31:0] A:Y:Cb:Cr 8:8:8:8 little endian
     */
    WlShmFormat[WlShmFormat["_ayuv"] = 1448433985] = "_ayuv";
    /**
     * 2 plane YCbCr Cr:Cb format, 2x2 subsampled Cr:Cb plane
     */
    WlShmFormat[WlShmFormat["_nv12"] = 842094158] = "_nv12";
    /**
     * 2 plane YCbCr Cb:Cr format, 2x2 subsampled Cb:Cr plane
     */
    WlShmFormat[WlShmFormat["_nv21"] = 825382478] = "_nv21";
    /**
     * 2 plane YCbCr Cr:Cb format, 2x1 subsampled Cr:Cb plane
     */
    WlShmFormat[WlShmFormat["_nv16"] = 909203022] = "_nv16";
    /**
     * 2 plane YCbCr Cb:Cr format, 2x1 subsampled Cb:Cr plane
     */
    WlShmFormat[WlShmFormat["_nv61"] = 825644622] = "_nv61";
    /**
     * 3 plane YCbCr format, 4x4 subsampled Cb (1) and Cr (2) planes
     */
    WlShmFormat[WlShmFormat["_yuv410"] = 961959257] = "_yuv410";
    /**
     * 3 plane YCbCr format, 4x4 subsampled Cr (1) and Cb (2) planes
     */
    WlShmFormat[WlShmFormat["_yvu410"] = 961893977] = "_yvu410";
    /**
     * 3 plane YCbCr format, 4x1 subsampled Cb (1) and Cr (2) planes
     */
    WlShmFormat[WlShmFormat["_yuv411"] = 825316697] = "_yuv411";
    /**
     * 3 plane YCbCr format, 4x1 subsampled Cr (1) and Cb (2) planes
     */
    WlShmFormat[WlShmFormat["_yvu411"] = 825316953] = "_yvu411";
    /**
     * 3 plane YCbCr format, 2x2 subsampled Cb (1) and Cr (2) planes
     */
    WlShmFormat[WlShmFormat["_yuv420"] = 842093913] = "_yuv420";
    /**
     * 3 plane YCbCr format, 2x2 subsampled Cr (1) and Cb (2) planes
     */
    WlShmFormat[WlShmFormat["_yvu420"] = 842094169] = "_yvu420";
    /**
     * 3 plane YCbCr format, 2x1 subsampled Cb (1) and Cr (2) planes
     */
    WlShmFormat[WlShmFormat["_yuv422"] = 909202777] = "_yuv422";
    /**
     * 3 plane YCbCr format, 2x1 subsampled Cr (1) and Cb (2) planes
     */
    WlShmFormat[WlShmFormat["_yvu422"] = 909203033] = "_yvu422";
    /**
     * 3 plane YCbCr format, non-subsampled Cb (1) and Cr (2) planes
     */
    WlShmFormat[WlShmFormat["_yuv444"] = 875713881] = "_yuv444";
    /**
     * 3 plane YCbCr format, non-subsampled Cr (1) and Cb (2) planes
     */
    WlShmFormat[WlShmFormat["_yvu444"] = 875714137] = "_yvu444";
})(WlShmFormat || (WlShmFormat = {}));
/**
 *
 *      A buffer provides the content for a wl_surface. Buffers are
 *      created through factory interfaces such as wl_drm, wl_shm or
 *      similar. It has a width and a height and can be attached to a
 *      wl_surface, but the mechanism by which a client provides and
 *      updates the contents is defined by the buffer factory interface.
 *
 */
class WlBufferProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
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
    destroy() {
        super.destroy();
        this._marshall(this.id, 0, []);
    }
    [0](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.release());
        });
    }
}
const WlBufferProtocolName = 'wl_buffer';
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
class WlDataOfferProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
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
     * @since 1
     *
     */
    accept(serial, mimeType) {
        this._marshall(this.id, 0, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(serial), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["stringOptional"])(mimeType)]);
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
     * @since 1
     *
     */
    receive(mimeType, fd) {
        this._marshall(this.id, 1, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["string"])(mimeType), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["fileDescriptor"])(fd)]);
    }
    /**
     *
     *	Destroy the data offer.
     *
     * @since 1
     *
     */
    destroy() {
        super.destroy();
        this._marshall(this.id, 2, []);
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
    finish() {
        this._marshall(this.id, 3, []);
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
     * @since 3
     *
     */
    setActions(dndActions, preferredAction) {
        this._marshall(this.id, 4, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(dndActions), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(preferredAction)]);
    }
    [0](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.offer(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["s"])(message)));
        });
    }
    [1](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.sourceActions(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message)));
        });
    }
    [2](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.action(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message)));
        });
    }
}
const WlDataOfferProtocolName = 'wl_data_offer';
var WlDataOfferError;
(function (WlDataOfferError) {
    /**
     * finish request was called untimely
     */
    WlDataOfferError[WlDataOfferError["_invalidFinish"] = 0] = "_invalidFinish";
    /**
     * action mask contains invalid values
     */
    WlDataOfferError[WlDataOfferError["_invalidActionMask"] = 1] = "_invalidActionMask";
    /**
     * action argument has an invalid value
     */
    WlDataOfferError[WlDataOfferError["_invalidAction"] = 2] = "_invalidAction";
    /**
     * offer doesn't accept this request
     */
    WlDataOfferError[WlDataOfferError["_invalidOffer"] = 3] = "_invalidOffer";
})(WlDataOfferError || (WlDataOfferError = {}));
/**
 *
 *      The wl_data_source object is the source side of a wl_data_offer.
 *      It is created by the source client in a data transfer and
 *      provides a way to describe the offered data and a way to respond
 *      to requests to transfer the data.
 *
 */
class WlDataSourceProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
    /**
     *
     *	This request adds a mime type to the set of mime types
     *	advertised to targets.  Can be called several times to offer
     *	multiple types.
     *
     * @since 1
     *
     */
    offer(mimeType) {
        this._marshall(this.id, 0, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["string"])(mimeType)]);
    }
    /**
     *
     *	Destroy the data source.
     *
     * @since 1
     *
     */
    destroy() {
        super.destroy();
        this._marshall(this.id, 1, []);
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
     * @since 3
     *
     */
    setActions(dndActions) {
        this._marshall(this.id, 2, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(dndActions)]);
    }
    [0](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.target(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["sOptional"])(message)));
        });
    }
    [1](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.send(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["s"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["h"])(message)));
        });
    }
    [2](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.cancelled());
        });
    }
    [3](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.dndDropPerformed());
        });
    }
    [4](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.dndFinished());
        });
    }
    [5](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.action(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message)));
        });
    }
}
const WlDataSourceProtocolName = 'wl_data_source';
var WlDataSourceError;
(function (WlDataSourceError) {
    /**
     * action mask contains invalid values
     */
    WlDataSourceError[WlDataSourceError["_invalidActionMask"] = 0] = "_invalidActionMask";
    /**
     * source doesn't accept this request
     */
    WlDataSourceError[WlDataSourceError["_invalidSource"] = 1] = "_invalidSource";
})(WlDataSourceError || (WlDataSourceError = {}));
/**
 *
 *      There is one wl_data_device per seat which can be obtained
 *      from the global wl_data_device_manager singleton.
 *
 *      A wl_data_device provides access to inter-client data transfer
 *      mechanisms such as copy-and-paste and drag-and-drop.
 *
 */
class WlDataDeviceProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
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
     * @since 1
     *
     */
    startDrag(source, origin, icon, serial) {
        this._marshall(this.id, 0, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["objectOptional"])(source), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["object"])(origin), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["objectOptional"])(icon), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(serial)]);
    }
    /**
     *
     *	This request asks the compositor to set the selection
     *	to the data from the source on behalf of the client.
     *
     *	To unset the selection, set the source to NULL.
     *
     * @since 1
     *
     */
    setSelection(source, serial) {
        this._marshall(this.id, 1, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["objectOptional"])(source), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(serial)]);
    }
    /**
     *
     *	This request destroys the data device.
     *
     * @since 2
     *
     */
    release() {
        super.destroy();
        this._marshall(this.id, 2, []);
    }
    [0](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.dataOffer(new WlDataOfferProxy(this.display, this._connection, Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["n"])(message))));
        });
    }
    [1](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.enter(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["o"])(message, this._connection), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["f"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["f"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["oOptional"])(message, this._connection)));
        });
    }
    [2](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.leave());
        });
    }
    [3](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.motion(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["f"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["f"])(message)));
        });
    }
    [4](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.drop());
        });
    }
    [5](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.selection(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["oOptional"])(message, this._connection)));
        });
    }
}
const WlDataDeviceProtocolName = 'wl_data_device';
var WlDataDeviceError;
(function (WlDataDeviceError) {
    /**
     * given wl_surface has another role
     */
    WlDataDeviceError[WlDataDeviceError["_role"] = 0] = "_role";
})(WlDataDeviceError || (WlDataDeviceError = {}));
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
class WlDataDeviceManagerProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
    /**
     *
     *	Create a new data source.
     *
     * @since 1
     *
     */
    createDataSource() {
        return this._marshallConstructor(this.id, 0, ___WEBPACK_IMPORTED_MODULE_1__["WlDataSourceProxy"], [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["newObject"])()]);
    }
    /**
     *
     *	Create a new data device for a given seat.
     *
     * @since 1
     *
     */
    getDataDevice(seat) {
        return this._marshallConstructor(this.id, 1, ___WEBPACK_IMPORTED_MODULE_1__["WlDataDeviceProxy"], [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["newObject"])(), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["object"])(seat)]);
    }
}
const WlDataDeviceManagerProtocolName = 'wl_data_device_manager';
var WlDataDeviceManagerDndAction;
(function (WlDataDeviceManagerDndAction) {
    /**
     * no action
     */
    WlDataDeviceManagerDndAction[WlDataDeviceManagerDndAction["_none"] = 0] = "_none";
    /**
     * copy action
     */
    WlDataDeviceManagerDndAction[WlDataDeviceManagerDndAction["_copy"] = 1] = "_copy";
    /**
     * move action
     */
    WlDataDeviceManagerDndAction[WlDataDeviceManagerDndAction["_move"] = 2] = "_move";
    /**
     * ask action
     */
    WlDataDeviceManagerDndAction[WlDataDeviceManagerDndAction["_ask"] = 4] = "_ask";
})(WlDataDeviceManagerDndAction || (WlDataDeviceManagerDndAction = {}));
/**
 *
 *      This interface is implemented by servers that provide
 *      desktop-style user interfaces.
 *
 *      It allows clients to associate a wl_shell_surface with
 *      a basic surface.
 *
 */
class WlShellProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
    /**
     *
     *	Create a shell surface for an existing surface. This gives
     *	the wl_surface the role of a shell surface. If the wl_surface
     *	already has another role, it raises a protocol error.
     *
     *	Only one shell surface can be associated with a given surface.
     *
     * @since 1
     *
     */
    getShellSurface(surface) {
        return this._marshallConstructor(this.id, 0, ___WEBPACK_IMPORTED_MODULE_1__["WlShellSurfaceProxy"], [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["newObject"])(), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["object"])(surface)]);
    }
}
const WlShellProtocolName = 'wl_shell';
var WlShellError;
(function (WlShellError) {
    /**
     * given wl_surface has another role
     */
    WlShellError[WlShellError["_role"] = 0] = "_role";
})(WlShellError || (WlShellError = {}));
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
class WlShellSurfaceProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
    /**
     *
     *	A client must respond to a ping event with a pong request or
     *	the client may be deemed unresponsive.
     *
     * @since 1
     *
     */
    pong(serial) {
        this._marshall(this.id, 0, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(serial)]);
    }
    /**
     *
     *	Start a pointer-driven move of the surface.
     *
     *	This request must be used in response to a button press event.
     *	The server may ignore move requests depending on the state of
     *	the surface (e.g. fullscreen or maximized).
     *
     * @since 1
     *
     */
    move(seat, serial) {
        this._marshall(this.id, 1, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["object"])(seat), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(serial)]);
    }
    /**
     *
     *	Start a pointer-driven resizing of the surface.
     *
     *	This request must be used in response to a button press event.
     *	The server may ignore resize requests depending on the state of
     *	the surface (e.g. fullscreen or maximized).
     *
     * @since 1
     *
     */
    resize(seat, serial, edges) {
        this._marshall(this.id, 2, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["object"])(seat), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(serial), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(edges)]);
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
    setToplevel() {
        this._marshall(this.id, 3, []);
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
     * @since 1
     *
     */
    setTransient(parent, x, y, flags) {
        this._marshall(this.id, 4, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["object"])(parent), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(x), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(y), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(flags)]);
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
     * @since 1
     *
     */
    setFullscreen(method, framerate, output) {
        this._marshall(this.id, 5, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(method), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(framerate), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["objectOptional"])(output)]);
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
     * @since 1
     *
     */
    setPopup(seat, serial, parent, x, y, flags) {
        this._marshall(this.id, 6, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["object"])(seat), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(serial), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["object"])(parent), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(x), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(y), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(flags)]);
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
     * @since 1
     *
     */
    setMaximized(output) {
        this._marshall(this.id, 7, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["objectOptional"])(output)]);
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
     * @since 1
     *
     */
    setTitle(title) {
        this._marshall(this.id, 8, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["string"])(title)]);
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
     * @since 1
     *
     */
    setClass(clazz) {
        this._marshall(this.id, 9, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["string"])(clazz)]);
    }
    [0](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.ping(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message)));
        });
    }
    [1](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.configure(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["i"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["i"])(message)));
        });
    }
    [2](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.popupDone());
        });
    }
}
const WlShellSurfaceProtocolName = 'wl_shell_surface';
var WlShellSurfaceResize;
(function (WlShellSurfaceResize) {
    /**
     * no edge
     */
    WlShellSurfaceResize[WlShellSurfaceResize["_none"] = 0] = "_none";
    /**
     * top edge
     */
    WlShellSurfaceResize[WlShellSurfaceResize["_top"] = 1] = "_top";
    /**
     * bottom edge
     */
    WlShellSurfaceResize[WlShellSurfaceResize["_bottom"] = 2] = "_bottom";
    /**
     * left edge
     */
    WlShellSurfaceResize[WlShellSurfaceResize["_left"] = 4] = "_left";
    /**
     * top and left edges
     */
    WlShellSurfaceResize[WlShellSurfaceResize["_topLeft"] = 5] = "_topLeft";
    /**
     * bottom and left edges
     */
    WlShellSurfaceResize[WlShellSurfaceResize["_bottomLeft"] = 6] = "_bottomLeft";
    /**
     * right edge
     */
    WlShellSurfaceResize[WlShellSurfaceResize["_right"] = 8] = "_right";
    /**
     * top and right edges
     */
    WlShellSurfaceResize[WlShellSurfaceResize["_topRight"] = 9] = "_topRight";
    /**
     * bottom and right edges
     */
    WlShellSurfaceResize[WlShellSurfaceResize["_bottomRight"] = 10] = "_bottomRight";
})(WlShellSurfaceResize || (WlShellSurfaceResize = {}));
var WlShellSurfaceTransient;
(function (WlShellSurfaceTransient) {
    /**
     * do not set keyboard focus
     */
    WlShellSurfaceTransient[WlShellSurfaceTransient["_inactive"] = 1] = "_inactive";
})(WlShellSurfaceTransient || (WlShellSurfaceTransient = {}));
var WlShellSurfaceFullscreenMethod;
(function (WlShellSurfaceFullscreenMethod) {
    /**
     * no preference, apply default policy
     */
    WlShellSurfaceFullscreenMethod[WlShellSurfaceFullscreenMethod["_default"] = 0] = "_default";
    /**
     * scale, preserve the surface's aspect ratio and center on output
     */
    WlShellSurfaceFullscreenMethod[WlShellSurfaceFullscreenMethod["_scale"] = 1] = "_scale";
    /**
     * switch output mode to the smallest mode that can fit the surface, add black borders to compensate size mismatch
     */
    WlShellSurfaceFullscreenMethod[WlShellSurfaceFullscreenMethod["_driver"] = 2] = "_driver";
    /**
     * no upscaling, center on output and add black borders to compensate size mismatch
     */
    WlShellSurfaceFullscreenMethod[WlShellSurfaceFullscreenMethod["_fill"] = 3] = "_fill";
})(WlShellSurfaceFullscreenMethod || (WlShellSurfaceFullscreenMethod = {}));
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
class WlSurfaceProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
    /**
     *
     *	Deletes the surface and invalidates its object ID.
     *
     * @since 1
     *
     */
    destroy() {
        super.destroy();
        this._marshall(this.id, 0, []);
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
     * @since 1
     *
     */
    attach(buffer, x, y) {
        this._marshall(this.id, 1, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["objectOptional"])(buffer), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(x), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(y)]);
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
     * @since 1
     *
     */
    damage(x, y, width, height) {
        this._marshall(this.id, 2, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(x), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(y), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(width), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(height)]);
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
     * @since 1
     *
     */
    frame() {
        return this._marshallConstructor(this.id, 3, ___WEBPACK_IMPORTED_MODULE_1__["WlCallbackProxy"], [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["newObject"])()]);
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
     * @since 1
     *
     */
    setOpaqueRegion(region) {
        this._marshall(this.id, 4, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["objectOptional"])(region)]);
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
     * @since 1
     *
     */
    setInputRegion(region) {
        this._marshall(this.id, 5, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["objectOptional"])(region)]);
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
     * @since 1
     *
     */
    commit(serial) {
        this._marshall(this.id, 6, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(serial)]);
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
     * @since 2
     *
     */
    setBufferTransform(transform) {
        this._marshall(this.id, 7, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(transform)]);
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
     * @since 3
     *
     */
    setBufferScale(scale) {
        this._marshall(this.id, 8, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(scale)]);
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
     * @since 4
     *
     */
    damageBuffer(x, y, width, height) {
        this._marshall(this.id, 9, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(x), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(y), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(width), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(height)]);
    }
    [0](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.enter(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["o"])(message, this._connection)));
        });
    }
    [1](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.leave(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["o"])(message, this._connection)));
        });
    }
}
const WlSurfaceProtocolName = 'wl_surface';
var WlSurfaceError;
(function (WlSurfaceError) {
    /**
     * buffer scale value is invalid
     */
    WlSurfaceError[WlSurfaceError["_invalidScale"] = 0] = "_invalidScale";
    /**
     * buffer transform value is invalid
     */
    WlSurfaceError[WlSurfaceError["_invalidTransform"] = 1] = "_invalidTransform";
})(WlSurfaceError || (WlSurfaceError = {}));
/**
 *
 *      A seat is a group of keyboards, pointer and touch devices. This
 *      object is published as a global during start up, or when such a
 *      device is hot plugged.  A seat typically has a pointer and
 *      maintains a keyboard focus and a pointer focus.
 *
 */
class WlSeatProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
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
     * @since 1
     *
     */
    getPointer() {
        return this._marshallConstructor(this.id, 0, ___WEBPACK_IMPORTED_MODULE_1__["WlPointerProxy"], [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["newObject"])()]);
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
     * @since 1
     *
     */
    getKeyboard() {
        return this._marshallConstructor(this.id, 1, ___WEBPACK_IMPORTED_MODULE_1__["WlKeyboardProxy"], [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["newObject"])()]);
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
     * @since 1
     *
     */
    getTouch() {
        return this._marshallConstructor(this.id, 2, ___WEBPACK_IMPORTED_MODULE_1__["WlTouchProxy"], [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["newObject"])()]);
    }
    /**
     *
     *	Using this request a client can tell the server that it is not going to
     *	use the seat object anymore.
     *
     * @since 5
     *
     */
    release() {
        super.destroy();
        this._marshall(this.id, 3, []);
    }
    [0](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.capabilities(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message)));
        });
    }
    [1](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.name(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["s"])(message)));
        });
    }
}
const WlSeatProtocolName = 'wl_seat';
var WlSeatCapability;
(function (WlSeatCapability) {
    /**
     * the seat has pointer devices
     */
    WlSeatCapability[WlSeatCapability["_pointer"] = 1] = "_pointer";
    /**
     * the seat has one or more keyboards
     */
    WlSeatCapability[WlSeatCapability["_keyboard"] = 2] = "_keyboard";
    /**
     * the seat has touch devices
     */
    WlSeatCapability[WlSeatCapability["_touch"] = 4] = "_touch";
})(WlSeatCapability || (WlSeatCapability = {}));
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
class WlPointerProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
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
     * @since 1
     *
     */
    setCursor(serial, surface, hotspotX, hotspotY) {
        this._marshall(this.id, 0, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(serial), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["objectOptional"])(surface), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(hotspotX), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(hotspotY)]);
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
    release() {
        super.destroy();
        this._marshall(this.id, 1, []);
    }
    [0](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.enter(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["o"])(message, this._connection), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["f"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["f"])(message)));
        });
    }
    [1](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.leave(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["o"])(message, this._connection)));
        });
    }
    [2](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.motion(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["f"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["f"])(message)));
        });
    }
    [3](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.button(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message)));
        });
    }
    [4](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.axis(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["f"])(message)));
        });
    }
    [5](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.frame());
        });
    }
    [6](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.axisSource(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message)));
        });
    }
    [7](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.axisStop(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message)));
        });
    }
    [8](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.axisDiscrete(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["i"])(message)));
        });
    }
}
const WlPointerProtocolName = 'wl_pointer';
var WlPointerError;
(function (WlPointerError) {
    /**
     * given wl_surface has another role
     */
    WlPointerError[WlPointerError["_role"] = 0] = "_role";
})(WlPointerError || (WlPointerError = {}));
var WlPointerButtonState;
(function (WlPointerButtonState) {
    /**
     * the button is not pressed
     */
    WlPointerButtonState[WlPointerButtonState["_released"] = 0] = "_released";
    /**
     * the button is pressed
     */
    WlPointerButtonState[WlPointerButtonState["_pressed"] = 1] = "_pressed";
})(WlPointerButtonState || (WlPointerButtonState = {}));
var WlPointerAxis;
(function (WlPointerAxis) {
    /**
     * vertical axis
     */
    WlPointerAxis[WlPointerAxis["_verticalScroll"] = 0] = "_verticalScroll";
    /**
     * horizontal axis
     */
    WlPointerAxis[WlPointerAxis["_horizontalScroll"] = 1] = "_horizontalScroll";
})(WlPointerAxis || (WlPointerAxis = {}));
var WlPointerAxisSource;
(function (WlPointerAxisSource) {
    /**
     * a physical wheel rotation
     */
    WlPointerAxisSource[WlPointerAxisSource["_wheel"] = 0] = "_wheel";
    /**
     * finger on a touch surface
     */
    WlPointerAxisSource[WlPointerAxisSource["_finger"] = 1] = "_finger";
    /**
     * continuous coordinate space
     */
    WlPointerAxisSource[WlPointerAxisSource["_continuous"] = 2] = "_continuous";
    /**
     * a physical wheel tilt
     */
    WlPointerAxisSource[WlPointerAxisSource["_wheelTilt"] = 3] = "_wheelTilt";
})(WlPointerAxisSource || (WlPointerAxisSource = {}));
/**
 *
 *      The wl_keyboard interface represents one or more keyboards
 *      associated with a seat.
 *
 */
class WlKeyboardProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
    /**
     * @since 3
     *
     */
    release() {
        super.destroy();
        this._marshall(this.id, 0, []);
    }
    [0](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.keymap(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["h"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message)));
        });
    }
    [1](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.enter(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["o"])(message, this._connection), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["a"])(message)));
        });
    }
    [2](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.leave(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["o"])(message, this._connection)));
        });
    }
    [3](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.key(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message)));
        });
    }
    [4](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.modifiers(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message)));
        });
    }
    [5](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.repeatInfo(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["i"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["i"])(message)));
        });
    }
}
const WlKeyboardProtocolName = 'wl_keyboard';
var WlKeyboardKeymapFormat;
(function (WlKeyboardKeymapFormat) {
    /**
     * no keymap; client must understand how to interpret the raw keycode
     */
    WlKeyboardKeymapFormat[WlKeyboardKeymapFormat["_noKeymap"] = 0] = "_noKeymap";
    /**
     * libxkbcommon compatible; to determine the xkb keycode, clients must add 8 to the key event keycode
     */
    WlKeyboardKeymapFormat[WlKeyboardKeymapFormat["_xkbV1"] = 1] = "_xkbV1";
})(WlKeyboardKeymapFormat || (WlKeyboardKeymapFormat = {}));
var WlKeyboardKeyState;
(function (WlKeyboardKeyState) {
    /**
     * key is not pressed
     */
    WlKeyboardKeyState[WlKeyboardKeyState["_released"] = 0] = "_released";
    /**
     * key is pressed
     */
    WlKeyboardKeyState[WlKeyboardKeyState["_pressed"] = 1] = "_pressed";
})(WlKeyboardKeyState || (WlKeyboardKeyState = {}));
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
class WlTouchProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
    /**
     * @since 3
     *
     */
    release() {
        super.destroy();
        this._marshall(this.id, 0, []);
    }
    [0](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.down(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["o"])(message, this._connection), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["i"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["f"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["f"])(message)));
        });
    }
    [1](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.up(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["i"])(message)));
        });
    }
    [2](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.motion(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["i"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["f"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["f"])(message)));
        });
    }
    [3](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.frame());
        });
    }
    [4](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.cancel());
        });
    }
    [5](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.shape(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["i"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["f"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["f"])(message)));
        });
    }
    [6](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.orientation(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["i"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["f"])(message)));
        });
    }
}
const WlTouchProtocolName = 'wl_touch';
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
class WlOutputProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
    /**
     *
     *	Using this request a client can tell the server that it is not going to
     *	use the output object anymore.
     *
     * @since 3
     *
     */
    release() {
        super.destroy();
        this._marshall(this.id, 0, []);
    }
    [0](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.geometry(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["i"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["i"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["i"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["i"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["i"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["s"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["s"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["i"])(message)));
        });
    }
    [1](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.mode(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["i"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["i"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["i"])(message)));
        });
    }
    [2](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.done());
        });
    }
    [3](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.scale(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["i"])(message)));
        });
    }
}
const WlOutputProtocolName = 'wl_output';
var WlOutputSubpixel;
(function (WlOutputSubpixel) {
    /**
     * unknown geometry
     */
    WlOutputSubpixel[WlOutputSubpixel["_unknown"] = 0] = "_unknown";
    /**
     * no geometry
     */
    WlOutputSubpixel[WlOutputSubpixel["_none"] = 1] = "_none";
    /**
     * horizontal RGB
     */
    WlOutputSubpixel[WlOutputSubpixel["_horizontalRgb"] = 2] = "_horizontalRgb";
    /**
     * horizontal BGR
     */
    WlOutputSubpixel[WlOutputSubpixel["_horizontalBgr"] = 3] = "_horizontalBgr";
    /**
     * vertical RGB
     */
    WlOutputSubpixel[WlOutputSubpixel["_verticalRgb"] = 4] = "_verticalRgb";
    /**
     * vertical BGR
     */
    WlOutputSubpixel[WlOutputSubpixel["_verticalBgr"] = 5] = "_verticalBgr";
})(WlOutputSubpixel || (WlOutputSubpixel = {}));
var WlOutputTransform;
(function (WlOutputTransform) {
    /**
     * no transform
     */
    WlOutputTransform[WlOutputTransform["_normal"] = 0] = "_normal";
    /**
     * 90 degrees counter-clockwise
     */
    WlOutputTransform[WlOutputTransform["_90"] = 1] = "_90";
    /**
     * 180 degrees counter-clockwise
     */
    WlOutputTransform[WlOutputTransform["_180"] = 2] = "_180";
    /**
     * 270 degrees counter-clockwise
     */
    WlOutputTransform[WlOutputTransform["_270"] = 3] = "_270";
    /**
     * 180 degree flip around a vertical axis
     */
    WlOutputTransform[WlOutputTransform["_flipped"] = 4] = "_flipped";
    /**
     * flip and rotate 90 degrees counter-clockwise
     */
    WlOutputTransform[WlOutputTransform["_flipped90"] = 5] = "_flipped90";
    /**
     * flip and rotate 180 degrees counter-clockwise
     */
    WlOutputTransform[WlOutputTransform["_flipped180"] = 6] = "_flipped180";
    /**
     * flip and rotate 270 degrees counter-clockwise
     */
    WlOutputTransform[WlOutputTransform["_flipped270"] = 7] = "_flipped270";
})(WlOutputTransform || (WlOutputTransform = {}));
var WlOutputMode;
(function (WlOutputMode) {
    /**
     * indicates this is the current mode
     */
    WlOutputMode[WlOutputMode["_current"] = 1] = "_current";
    /**
     * indicates this is the preferred mode
     */
    WlOutputMode[WlOutputMode["_preferred"] = 2] = "_preferred";
})(WlOutputMode || (WlOutputMode = {}));
/**
 *
 *      A region object describes an area.
 *
 *      Region objects are used to describe the opaque and input
 *      regions of a surface.
 *
 */
class WlRegionProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
    /**
     *
     *	Destroy the region.  This will invalidate the object ID.
     *
     * @since 1
     *
     */
    destroy() {
        super.destroy();
        this._marshall(this.id, 0, []);
    }
    /**
     *
     *	Add the specified rectangle to the region.
     *
     * @since 1
     *
     */
    add(x, y, width, height) {
        this._marshall(this.id, 1, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(x), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(y), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(width), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(height)]);
    }
    /**
     *
     *	Subtract the specified rectangle from the region.
     *
     * @since 1
     *
     */
    subtract(x, y, width, height) {
        this._marshall(this.id, 2, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(x), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(y), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(width), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(height)]);
    }
}
const WlRegionProtocolName = 'wl_region';
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
class WlSubcompositorProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
    /**
     *
     *	Informs the server that the client will not be using this
     *	protocol object anymore. This does not affect any other
     *	objects, wl_subsurface objects included.
     *
     * @since 1
     *
     */
    destroy() {
        super.destroy();
        this._marshall(this.id, 0, []);
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
     * @since 1
     *
     */
    getSubsurface(surface, parent) {
        return this._marshallConstructor(this.id, 1, ___WEBPACK_IMPORTED_MODULE_1__["WlSubsurfaceProxy"], [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["newObject"])(), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["object"])(surface), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["object"])(parent)]);
    }
}
const WlSubcompositorProtocolName = 'wl_subcompositor';
var WlSubcompositorError;
(function (WlSubcompositorError) {
    /**
     * the to-be sub-surface is invalid
     */
    WlSubcompositorError[WlSubcompositorError["_badSurface"] = 0] = "_badSurface";
})(WlSubcompositorError || (WlSubcompositorError = {}));
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
class WlSubsurfaceProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
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
    destroy() {
        super.destroy();
        this._marshall(this.id, 0, []);
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
     * @since 1
     *
     */
    setPosition(x, y) {
        this._marshall(this.id, 1, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(x), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(y)]);
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
     * @since 1
     *
     */
    placeAbove(sibling) {
        this._marshall(this.id, 2, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["object"])(sibling)]);
    }
    /**
     *
     *	The sub-surface is placed just below the reference surface.
     *	See wl_subsurface.place_above.
     *
     * @since 1
     *
     */
    placeBelow(sibling) {
        this._marshall(this.id, 3, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["object"])(sibling)]);
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
    setSync() {
        this._marshall(this.id, 4, []);
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
    setDesync() {
        this._marshall(this.id, 5, []);
    }
}
const WlSubsurfaceProtocolName = 'wl_subsurface';
var WlSubsurfaceError;
(function (WlSubsurfaceError) {
    /**
     * wl_surface is not a sibling or the parent
     */
    WlSubsurfaceError[WlSubsurfaceError["_badSurface"] = 0] = "_badSurface";
})(WlSubsurfaceError || (WlSubsurfaceError = {}));
//# sourceMappingURL=wayland.js.map

/***/ }),

/***/ "./node_modules/westfield-runtime-client/dist/protocol/xdg_shell.js":
/*!**************************************************************************!*\
  !*** ./node_modules/westfield-runtime-client/dist/protocol/xdg_shell.js ***!
  \**************************************************************************/
/*! exports provided: XdgWmBaseProxy, XdgWmBaseProtocolName, XdgWmBaseError, XdgPositionerProxy, XdgPositionerProtocolName, XdgPositionerError, XdgPositionerAnchor, XdgPositionerGravity, XdgPositionerConstraintAdjustment, XdgSurfaceProxy, XdgSurfaceProtocolName, XdgSurfaceError, XdgToplevelProxy, XdgToplevelProtocolName, XdgToplevelResizeEdge, XdgToplevelState, XdgPopupProxy, XdgPopupProtocolName, XdgPopupError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XdgWmBaseProxy", function() { return XdgWmBaseProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XdgWmBaseProtocolName", function() { return XdgWmBaseProtocolName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XdgWmBaseError", function() { return XdgWmBaseError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XdgPositionerProxy", function() { return XdgPositionerProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XdgPositionerProtocolName", function() { return XdgPositionerProtocolName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XdgPositionerError", function() { return XdgPositionerError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XdgPositionerAnchor", function() { return XdgPositionerAnchor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XdgPositionerGravity", function() { return XdgPositionerGravity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XdgPositionerConstraintAdjustment", function() { return XdgPositionerConstraintAdjustment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XdgSurfaceProxy", function() { return XdgSurfaceProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XdgSurfaceProtocolName", function() { return XdgSurfaceProtocolName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XdgSurfaceError", function() { return XdgSurfaceError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XdgToplevelProxy", function() { return XdgToplevelProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XdgToplevelProtocolName", function() { return XdgToplevelProtocolName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XdgToplevelResizeEdge", function() { return XdgToplevelResizeEdge; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XdgToplevelState", function() { return XdgToplevelState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XdgPopupProxy", function() { return XdgPopupProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XdgPopupProtocolName", function() { return XdgPopupProtocolName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XdgPopupError", function() { return XdgPopupError; });
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "./node_modules/westfield-runtime-common/dist/index.js");
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! . */ "./node_modules/westfield-runtime-client/dist/protocol/index.js");
/* harmony import */ var _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../westfield-runtime-client */ "./node_modules/westfield-runtime-client/dist/westfield-runtime-client.js");
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
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



/**
 *
 *      The xdg_wm_base interface is exposed as a global object enabling clients
 *      to turn their wl_surfaces into windows in a desktop environment. It
 *      defines the basic functionality needed for clients and the compositor to
 *      create windows that can be dragged, resized, maximized, etc, as well as
 *      creating transient windows such as popup menus.
 *
 */
class XdgWmBaseProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
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
    destroy() {
        super.destroy();
        this._marshall(this.id, 0, []);
    }
    /**
     *
     *	Create a positioner object. A positioner object is used to position
     *	surfaces relative to some parent surface. See the interface description
     *	and xdg_surface.get_popup for details.
     *
     * @since 1
     *
     */
    createPositioner() {
        return this._marshallConstructor(this.id, 1, ___WEBPACK_IMPORTED_MODULE_1__["XdgPositionerProxy"], [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["newObject"])()]);
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
     * @since 1
     *
     */
    getXdgSurface(surface) {
        return this._marshallConstructor(this.id, 2, ___WEBPACK_IMPORTED_MODULE_1__["XdgSurfaceProxy"], [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["newObject"])(), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["object"])(surface)]);
    }
    /**
     *
     *	A client must respond to a ping event with a pong request or
     *	the client may be deemed unresponsive. See xdg_wm_base.ping.
     *
     * @since 1
     *
     */
    pong(serial) {
        this._marshall(this.id, 3, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(serial)]);
    }
    [0](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.ping(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message)));
        });
    }
}
const XdgWmBaseProtocolName = 'xdg_wm_base';
var XdgWmBaseError;
(function (XdgWmBaseError) {
    /**
     * given wl_surface has another role
     */
    XdgWmBaseError[XdgWmBaseError["_role"] = 0] = "_role";
    /**
     * xdg_wm_base was destroyed before children
     */
    XdgWmBaseError[XdgWmBaseError["_defunctSurfaces"] = 1] = "_defunctSurfaces";
    /**
     * the client tried to map or destroy a non-topmost popup
     */
    XdgWmBaseError[XdgWmBaseError["_notTheTopmostPopup"] = 2] = "_notTheTopmostPopup";
    /**
     * the client specified an invalid popup parent surface
     */
    XdgWmBaseError[XdgWmBaseError["_invalidPopupParent"] = 3] = "_invalidPopupParent";
    /**
     * the client provided an invalid surface state
     */
    XdgWmBaseError[XdgWmBaseError["_invalidSurfaceState"] = 4] = "_invalidSurfaceState";
    /**
     * the client provided an invalid positioner
     */
    XdgWmBaseError[XdgWmBaseError["_invalidPositioner"] = 5] = "_invalidPositioner";
})(XdgWmBaseError || (XdgWmBaseError = {}));
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
class XdgPositionerProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
    /**
     *
     *	Notify the compositor that the xdg_positioner will no longer be used.
     *
     * @since 1
     *
     */
    destroy() {
        super.destroy();
        this._marshall(this.id, 0, []);
    }
    /**
     *
     *	Set the size of the surface that is to be positioned with the positioner
     *	object. The size is in surface-local coordinates and corresponds to the
     *	window geometry. See xdg_surface.set_window_geometry.
     *
     *	If a zero or negative size is set the invalid_input error is raised.
     *
     * @since 1
     *
     */
    setSize(width, height) {
        this._marshall(this.id, 1, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(width), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(height)]);
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
     * @since 1
     *
     */
    setAnchorRect(x, y, width, height) {
        this._marshall(this.id, 2, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(x), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(y), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(width), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(height)]);
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
     * @since 1
     *
     */
    setAnchor(anchor) {
        this._marshall(this.id, 3, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(anchor)]);
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
     * @since 1
     *
     */
    setGravity(gravity) {
        this._marshall(this.id, 4, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(gravity)]);
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
     * @since 1
     *
     */
    setConstraintAdjustment(constraintAdjustment) {
        this._marshall(this.id, 5, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(constraintAdjustment)]);
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
     * @since 1
     *
     */
    setOffset(x, y) {
        this._marshall(this.id, 6, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(x), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(y)]);
    }
}
const XdgPositionerProtocolName = 'xdg_positioner';
var XdgPositionerError;
(function (XdgPositionerError) {
    /**
     * invalid input provided
     */
    XdgPositionerError[XdgPositionerError["_invalidInput"] = 0] = "_invalidInput";
})(XdgPositionerError || (XdgPositionerError = {}));
var XdgPositionerAnchor;
(function (XdgPositionerAnchor) {
    /**
     *
     */
    XdgPositionerAnchor[XdgPositionerAnchor["_none"] = 0] = "_none";
    /**
     *
     */
    XdgPositionerAnchor[XdgPositionerAnchor["_top"] = 1] = "_top";
    /**
     *
     */
    XdgPositionerAnchor[XdgPositionerAnchor["_bottom"] = 2] = "_bottom";
    /**
     *
     */
    XdgPositionerAnchor[XdgPositionerAnchor["_left"] = 3] = "_left";
    /**
     *
     */
    XdgPositionerAnchor[XdgPositionerAnchor["_right"] = 4] = "_right";
    /**
     *
     */
    XdgPositionerAnchor[XdgPositionerAnchor["_topLeft"] = 5] = "_topLeft";
    /**
     *
     */
    XdgPositionerAnchor[XdgPositionerAnchor["_bottomLeft"] = 6] = "_bottomLeft";
    /**
     *
     */
    XdgPositionerAnchor[XdgPositionerAnchor["_topRight"] = 7] = "_topRight";
    /**
     *
     */
    XdgPositionerAnchor[XdgPositionerAnchor["_bottomRight"] = 8] = "_bottomRight";
})(XdgPositionerAnchor || (XdgPositionerAnchor = {}));
var XdgPositionerGravity;
(function (XdgPositionerGravity) {
    /**
     *
     */
    XdgPositionerGravity[XdgPositionerGravity["_none"] = 0] = "_none";
    /**
     *
     */
    XdgPositionerGravity[XdgPositionerGravity["_top"] = 1] = "_top";
    /**
     *
     */
    XdgPositionerGravity[XdgPositionerGravity["_bottom"] = 2] = "_bottom";
    /**
     *
     */
    XdgPositionerGravity[XdgPositionerGravity["_left"] = 3] = "_left";
    /**
     *
     */
    XdgPositionerGravity[XdgPositionerGravity["_right"] = 4] = "_right";
    /**
     *
     */
    XdgPositionerGravity[XdgPositionerGravity["_topLeft"] = 5] = "_topLeft";
    /**
     *
     */
    XdgPositionerGravity[XdgPositionerGravity["_bottomLeft"] = 6] = "_bottomLeft";
    /**
     *
     */
    XdgPositionerGravity[XdgPositionerGravity["_topRight"] = 7] = "_topRight";
    /**
     *
     */
    XdgPositionerGravity[XdgPositionerGravity["_bottomRight"] = 8] = "_bottomRight";
})(XdgPositionerGravity || (XdgPositionerGravity = {}));
var XdgPositionerConstraintAdjustment;
(function (XdgPositionerConstraintAdjustment) {
    /**
     *
     */
    XdgPositionerConstraintAdjustment[XdgPositionerConstraintAdjustment["_none"] = 0] = "_none";
    /**
     *
     */
    XdgPositionerConstraintAdjustment[XdgPositionerConstraintAdjustment["_slideX"] = 1] = "_slideX";
    /**
     *
     */
    XdgPositionerConstraintAdjustment[XdgPositionerConstraintAdjustment["_slideY"] = 2] = "_slideY";
    /**
     *
     */
    XdgPositionerConstraintAdjustment[XdgPositionerConstraintAdjustment["_flipX"] = 4] = "_flipX";
    /**
     *
     */
    XdgPositionerConstraintAdjustment[XdgPositionerConstraintAdjustment["_flipY"] = 8] = "_flipY";
    /**
     *
     */
    XdgPositionerConstraintAdjustment[XdgPositionerConstraintAdjustment["_resizeX"] = 16] = "_resizeX";
    /**
     *
     */
    XdgPositionerConstraintAdjustment[XdgPositionerConstraintAdjustment["_resizeY"] = 32] = "_resizeY";
})(XdgPositionerConstraintAdjustment || (XdgPositionerConstraintAdjustment = {}));
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
class XdgSurfaceProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
    /**
     *
     *	Destroy the xdg_surface object. An xdg_surface must only be destroyed
     *	after its role object has been destroyed.
     *
     * @since 1
     *
     */
    destroy() {
        super.destroy();
        this._marshall(this.id, 0, []);
    }
    /**
     *
     *	This creates an xdg_toplevel object for the given xdg_surface and gives
     *	the associated wl_surface the xdg_toplevel role.
     *
     *	See the documentation of xdg_toplevel for more details about what an
     *	xdg_toplevel is and how it is used.
     *
     * @since 1
     *
     */
    getToplevel() {
        return this._marshallConstructor(this.id, 1, ___WEBPACK_IMPORTED_MODULE_1__["XdgToplevelProxy"], [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["newObject"])()]);
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
     * @since 1
     *
     */
    getPopup(parent, positioner) {
        return this._marshallConstructor(this.id, 2, ___WEBPACK_IMPORTED_MODULE_1__["XdgPopupProxy"], [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["newObject"])(), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["objectOptional"])(parent), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["object"])(positioner)]);
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
     * @since 1
     *
     */
    setWindowGeometry(x, y, width, height) {
        this._marshall(this.id, 3, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(x), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(y), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(width), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(height)]);
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
     * @since 1
     *
     */
    ackConfigure(serial) {
        this._marshall(this.id, 4, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(serial)]);
    }
    [0](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.configure(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message)));
        });
    }
}
const XdgSurfaceProtocolName = 'xdg_surface';
var XdgSurfaceError;
(function (XdgSurfaceError) {
    /**
     *
     */
    XdgSurfaceError[XdgSurfaceError["_notConstructed"] = 1] = "_notConstructed";
    /**
     *
     */
    XdgSurfaceError[XdgSurfaceError["_alreadyConstructed"] = 2] = "_alreadyConstructed";
    /**
     *
     */
    XdgSurfaceError[XdgSurfaceError["_unconfiguredBuffer"] = 3] = "_unconfiguredBuffer";
})(XdgSurfaceError || (XdgSurfaceError = {}));
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
class XdgToplevelProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
    /**
     *
     *	This request destroys the role surface and unmaps the surface;
     *	see "Unmapping" behavior in interface section for details.
     *
     * @since 1
     *
     */
    destroy() {
        super.destroy();
        this._marshall(this.id, 0, []);
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
     * @since 1
     *
     */
    setParent(parent) {
        this._marshall(this.id, 1, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["objectOptional"])(parent)]);
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
     * @since 1
     *
     */
    setTitle(title) {
        this._marshall(this.id, 2, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["string"])(title)]);
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
     * @since 1
     *
     */
    setAppId(appId) {
        this._marshall(this.id, 3, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["string"])(appId)]);
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
     * @since 1
     *
     */
    showWindowMenu(seat, serial, x, y) {
        this._marshall(this.id, 4, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["object"])(seat), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(serial), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(x), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(y)]);
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
     * @since 1
     *
     */
    move(seat, serial) {
        this._marshall(this.id, 5, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["object"])(seat), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(serial)]);
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
     * @since 1
     *
     */
    resize(seat, serial, edges) {
        this._marshall(this.id, 6, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["object"])(seat), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(serial), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(edges)]);
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
     * @since 1
     *
     */
    setMaxSize(width, height) {
        this._marshall(this.id, 7, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(width), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(height)]);
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
     * @since 1
     *
     */
    setMinSize(width, height) {
        this._marshall(this.id, 8, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(width), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["int"])(height)]);
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
    setMaximized() {
        this._marshall(this.id, 9, []);
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
    unsetMaximized() {
        this._marshall(this.id, 10, []);
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
     * @since 1
     *
     */
    setFullscreen(output) {
        this._marshall(this.id, 11, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["objectOptional"])(output)]);
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
    unsetFullscreen() {
        this._marshall(this.id, 12, []);
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
    setMinimized() {
        this._marshall(this.id, 13, []);
    }
    [0](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.configure(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["i"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["i"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["a"])(message)));
        });
    }
    [1](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.close());
        });
    }
}
const XdgToplevelProtocolName = 'xdg_toplevel';
var XdgToplevelResizeEdge;
(function (XdgToplevelResizeEdge) {
    /**
     *
     */
    XdgToplevelResizeEdge[XdgToplevelResizeEdge["_none"] = 0] = "_none";
    /**
     *
     */
    XdgToplevelResizeEdge[XdgToplevelResizeEdge["_top"] = 1] = "_top";
    /**
     *
     */
    XdgToplevelResizeEdge[XdgToplevelResizeEdge["_bottom"] = 2] = "_bottom";
    /**
     *
     */
    XdgToplevelResizeEdge[XdgToplevelResizeEdge["_left"] = 4] = "_left";
    /**
     *
     */
    XdgToplevelResizeEdge[XdgToplevelResizeEdge["_topLeft"] = 5] = "_topLeft";
    /**
     *
     */
    XdgToplevelResizeEdge[XdgToplevelResizeEdge["_bottomLeft"] = 6] = "_bottomLeft";
    /**
     *
     */
    XdgToplevelResizeEdge[XdgToplevelResizeEdge["_right"] = 8] = "_right";
    /**
     *
     */
    XdgToplevelResizeEdge[XdgToplevelResizeEdge["_topRight"] = 9] = "_topRight";
    /**
     *
     */
    XdgToplevelResizeEdge[XdgToplevelResizeEdge["_bottomRight"] = 10] = "_bottomRight";
})(XdgToplevelResizeEdge || (XdgToplevelResizeEdge = {}));
var XdgToplevelState;
(function (XdgToplevelState) {
    /**
     * the surface is maximized
     */
    XdgToplevelState[XdgToplevelState["_maximized"] = 1] = "_maximized";
    /**
     * the surface is fullscreen
     */
    XdgToplevelState[XdgToplevelState["_fullscreen"] = 2] = "_fullscreen";
    /**
     * the surface is being resized
     */
    XdgToplevelState[XdgToplevelState["_resizing"] = 3] = "_resizing";
    /**
     * the surface is now activated
     */
    XdgToplevelState[XdgToplevelState["_activated"] = 4] = "_activated";
})(XdgToplevelState || (XdgToplevelState = {}));
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
class XdgPopupProxy extends _westfield_runtime_client__WEBPACK_IMPORTED_MODULE_2__["Proxy"] {
    /**
     * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
     */
    constructor(display, connection, id) {
        super(display, connection, id);
    }
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
    destroy() {
        super.destroy();
        this._marshall(this.id, 0, []);
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
     * @since 1
     *
     */
    grab(seat, serial) {
        this._marshall(this.id, 1, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["object"])(seat), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(serial)]);
    }
    [0](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.configure(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["i"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["i"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["i"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["i"])(message)));
        });
    }
    [1](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.popupDone());
        });
    }
}
const XdgPopupProtocolName = 'xdg_popup';
var XdgPopupError;
(function (XdgPopupError) {
    /**
     * tried to grab after being mapped
     */
    XdgPopupError[XdgPopupError["_invalidGrab"] = 0] = "_invalidGrab";
})(XdgPopupError || (XdgPopupError = {}));
//# sourceMappingURL=xdg_shell.js.map

/***/ }),

/***/ "./node_modules/westfield-runtime-client/dist/westfield-runtime-client.js":
/*!********************************************************************************!*\
  !*** ./node_modules/westfield-runtime-client/dist/westfield-runtime-client.js ***!
  \********************************************************************************/
/*! exports provided: Proxy, DisplayImpl, WebFS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Proxy", function() { return Proxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DisplayImpl", function() { return DisplayImpl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebFS", function() { return WebFS; });
/* harmony import */ var westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-common */ "./node_modules/westfield-runtime-common/dist/index.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class Proxy extends westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["WlObject"] {
    constructor(display, connection, id) {
        super(id);
        this.display = display;
        this._connection = connection;
        connection.registerWlObject(this);
    }
    destroy() {
        super.destroy();
        this._connection.unregisterWlObject(this);
    }
    _marshallConstructor(id, opcode, proxyClass, argsArray) {
        // construct new object
        const proxy = new proxyClass(this.display, this._connection, this.display.generateNextId());
        // determine required wire message length
        let size = 4 + 2 + 2; // id+size+opcode
        argsArray.forEach(arg => {
            if (arg.type === 'n') {
                arg.value = proxy.id;
            }
            size += arg.size;
        });
        this._connection.marshallMsg(id, opcode, size, argsArray);
        return proxy;
    }
    _marshall(id, opcode, argsArray) {
        // determine required wire message length
        let size = 4 + 2 + 2; // id+size+opcode
        argsArray.forEach(arg => size += arg.size);
        this._connection.marshallMsg(id, opcode, size, argsArray);
    }
}
// c/p to break circular dep.
class WlDisplayProxy extends Proxy {
    constructor(display, connection, id) {
        super(display, connection, id);
    }
    sync() {
        return this._marshallConstructor(this.id, 0, WlCallbackProxy, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["newObject"])()]);
    }
    getRegistry() {
        return this._marshallConstructor(this.id, 1, WlRegistryProxy, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["newObject"])()]);
    }
    [0](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.error(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["o"])(message, this._connection), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["s"])(message)));
        });
    }
    [1](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.deleteId(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message)));
        });
    }
}
// c/p to break circular dep.
class WlRegistryProxy extends Proxy {
    constructor(display, connection, id) {
        super(display, connection, id);
    }
    bind(name, interface_, proxyClass, version) {
        return this._marshallConstructor(this.id, 0, proxyClass, [Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(name), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["string"])(interface_), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["uint"])(version), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["newObject"])()]);
    }
    [0](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.global(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["s"])(message), Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message)));
        });
    }
    [1](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.globalRemove(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message)));
        });
    }
}
// c/p to break circular dep.
class WlCallbackProxy extends Proxy {
    constructor(display, connection, id) {
        super(display, connection, id);
    }
    [0](message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.listener) === null || _a === void 0 ? void 0 : _a.done(Object(westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["u"])(message)));
        });
    }
}
class DisplayImpl {
    constructor(connection) {
        this._recycledIds = [];
        this._lastId = 1;
        this._connection = connection;
        this._displayProxy = new WlDisplayProxy(this, this._connection, 1);
        this._destroyPromise = new Promise(((resolve, reject) => {
            this._destroyResolve = resolve;
            this._destroyReject = reject;
        }));
        this._displayProxy.listener = {
            deleteId: (id) => {
                this._recycledIds.push(id);
            },
            error: (proxy, code, message) => {
                this._protocolError(proxy, code, message);
            }
        };
    }
    close() {
        if (this._connection.closed) {
            return;
        }
        this._connection.close();
        this._destroyResolve();
    }
    _protocolError(proxy, code, message) {
        if (this._connection.closed) {
            return;
        }
        this._connection.close();
        this._destroyReject(new Error(`Protocol error. type: ${proxy.constructor.name}, id: ${proxy.id}, code: ${code}, message: ${message}`));
    }
    onClose() {
        return this._destroyPromise;
    }
    getRegistry() {
        return this._displayProxy.getRegistry();
    }
    generateNextId() {
        if (this._recycledIds.length) {
            return this._recycledIds.shift();
        }
        else {
            return ++this._lastId;
        }
    }
    sync() {
        return new Promise(resolve => {
            const wlCallbackProxy = this._displayProxy.sync();
            wlCallbackProxy.listener = {
                done: (data) => {
                    resolve(data);
                    wlCallbackProxy.destroy();
                }
            };
        });
    }
    flush() {
        this._connection.flush();
    }
}
// TODO This is currently a literal copy of the server implementation. Do all use cases match 1o1 and can we use a single common code base between client & server for WebFS?
class WebFS {
    constructor(fdDomainUUID) {
        this._webFDs = {};
        this._nextFD = 0;
        this._fdDomainUUID = fdDomainUUID;
    }
    static create(fdDomainUUID) {
        return new WebFS(fdDomainUUID);
    }
    fromArrayBuffer(arrayBuffer) {
        const fd = this._nextFD++;
        const type = 'ArrayBuffer';
        const webFdURL = new URL(`client://`);
        webFdURL.searchParams.append('fd', `${fd}`);
        webFdURL.searchParams.append('type', type);
        webFdURL.searchParams.append('clientId', this._fdDomainUUID);
        const webFD = new westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["WebFD"](fd, type, webFdURL, () => Promise.resolve(arrayBuffer), () => {
            delete this._webFDs[fd];
        });
        this._webFDs[fd] = webFD;
        return webFD;
    }
    fromImageBitmap(imageBitmap) {
        const fd = this._nextFD++;
        const type = 'ImageBitmap';
        const webFdURL = new URL(`client://`);
        webFdURL.searchParams.append('fd', `${fd}`);
        webFdURL.searchParams.append('type', type);
        webFdURL.searchParams.append('clientId', this._fdDomainUUID);
        const webFD = new westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["WebFD"](fd, type, webFdURL, () => Promise.resolve(imageBitmap), () => {
            delete this._webFDs[fd];
        });
        this._webFDs[fd] = webFD;
        return webFD;
    }
    fromOffscreenCanvas(offscreenCanvas) {
        const fd = this._nextFD++;
        const type = 'OffscreenCanvas';
        const webFdURL = new URL(`client://`);
        webFdURL.searchParams.append('fd', `${fd}`);
        webFdURL.searchParams.append('type', type);
        webFdURL.searchParams.append('clientId', this._fdDomainUUID);
        const webFD = new westfield_runtime_common__WEBPACK_IMPORTED_MODULE_0__["WebFD"](fd, type, webFdURL, () => Promise.resolve(offscreenCanvas), () => {
            delete this._webFDs[fd];
        });
        this._webFDs[fd] = webFD;
        return webFD;
    }
    // TODO fromMessagePort
    getWebFD(fd) {
        return this._webFDs[fd];
    }
}
//# sourceMappingURL=westfield-runtime-client.js.map

/***/ }),

/***/ "./node_modules/westfield-runtime-common/dist/Connection.js":
/*!******************************************************************!*\
  !*** ./node_modules/westfield-runtime-common/dist/Connection.js ***!
  \******************************************************************/
/*! exports provided: WlObject, Fixed, WebFD, uint, fileDescriptor, int, fixed, object, objectOptional, newObject, string, stringOptional, array, arrayOptional, u, i, f, oOptional, o, n, sOptional, s, aOptional, a, h, Connection */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WlObject", function() { return WlObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Fixed", function() { return Fixed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebFD", function() { return WebFD; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "uint", function() { return uint; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fileDescriptor", function() { return fileDescriptor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "int", function() { return int; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fixed", function() { return fixed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "object", function() { return object; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "objectOptional", function() { return objectOptional; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "newObject", function() { return newObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "string", function() { return string; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stringOptional", function() { return stringOptional; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "array", function() { return array; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "arrayOptional", function() { return arrayOptional; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "u", function() { return u; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return i; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return f; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "oOptional", function() { return oOptional; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return o; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return n; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sOptional", function() { return sOptional; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "s", function() { return s; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "aOptional", function() { return aOptional; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return a; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return h; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Connection", function() { return Connection; });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/*
MIT License

Copyright (c) 2020 Erik De Rijcke

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
const textDecoder = new TextDecoder('utf8');
class WlObject {
    constructor(id) {
        this._destroyPromise = new Promise(resolve => this._destroyResolver = resolve);
        this._destroyListeners = [];
        this.id = id;
        this._destroyPromise.then(() => this._destroyListeners.forEach(destroyListener => destroyListener(this)));
    }
    destroy() {
        this._destroyResolver();
    }
    addDestroyListener(destroyListener) {
        this._destroyListeners.push(destroyListener);
    }
    removeDestroyListener(destroyListener) {
        this._destroyListeners = this._destroyListeners.filter((item) => item !== destroyListener);
    }
    onDestroy() {
        return this._destroyPromise;
    }
}
class Fixed {
    /**
     * use parseFixed instead
     * @param {number}raw
     */
    constructor(raw) {
        this._raw = raw;
    }
    static parse(data) {
        return new Fixed((data * 256.0) >> 0);
    }
    /**
     * Represent fixed as a signed 24-bit integer.
     *
     */
    asInt() {
        return ((this._raw / 256.0) >> 0);
    }
    /**
     * Represent fixed as a signed 24-bit number with an 8-bit fractional part.
     *
     */
    asDouble() {
        return this._raw / 256.0;
    }
}
class WebFD {
    constructor(fd, fdType, fdURL, onGetTransferable, onClose) {
        this.fd = fd;
        this.type = fdType;
        this.url = fdURL;
        this._onGetTransferable = onGetTransferable;
        this._onClose = onClose;
    }
    getTransferable() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._onGetTransferable(this);
        });
    }
    close() {
        this._onClose(this);
    }
}
function uint(arg) {
    return {
        value: arg,
        type: 'u',
        size: 4,
        optional: false,
        _marshallArg: function (wireMsg) {
            new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = arg;
            wireMsg.bufferOffset += this.size;
        }
    };
}
function fileDescriptor(arg) {
    return {
        value: arg,
        type: 'h',
        size: 0,
        optional: false,
        _marshallArg: function (wireMsg) {
            wireMsg.fds.push(arg);
        }
    };
}
function int(arg) {
    return {
        value: arg,
        type: 'i',
        size: 4,
        optional: false,
        _marshallArg: function (wireMsg) {
            new Int32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = this.value;
            wireMsg.bufferOffset += this.size;
        }
    };
}
function fixed(arg) {
    return {
        value: arg,
        type: 'f',
        size: 4,
        optional: false,
        _marshallArg: function (wireMsg) {
            new Int32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = this.value._raw;
            wireMsg.bufferOffset += this.size;
        }
    };
}
function object(arg) {
    return {
        value: arg,
        type: 'o',
        size: 4,
        optional: false,
        _marshallArg: function (wireMsg) {
            new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = this.value.id;
            wireMsg.bufferOffset += this.size;
        }
    };
}
function objectOptional(arg) {
    return {
        value: arg,
        type: 'o',
        size: 4,
        optional: true,
        _marshallArg: function (wireMsg) {
            new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = (this.value === undefined ? 0 : this.value.id);
            wireMsg.bufferOffset += this.size;
        }
    };
}
function newObject() {
    return {
        value: 0,
        type: 'n',
        size: 4,
        optional: false,
        _marshallArg: function (wireMsg) {
            new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = this.value;
            wireMsg.bufferOffset += this.size;
        }
    };
}
function string(arg) {
    return {
        value: `${arg}\0`,
        type: 's',
        size: 4 + (function () {
            // fancy logic to calculate size with padding to a multiple of 4 bytes (int).
            // length+1 for null terminator
            return (arg.length + 1 + 3) & ~3;
        })(),
        optional: false,
        _marshallArg: function (wireMsg) {
            new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = this.value.length;
            const strLen = this.value.length;
            const buf8 = new Uint8Array(wireMsg.buffer, wireMsg.bufferOffset + 4, strLen);
            for (let i = 0; i < strLen; i++) {
                buf8[i] = this.value[i].charCodeAt(0);
            }
            wireMsg.bufferOffset += this.size;
        }
    };
}
function stringOptional(arg) {
    return {
        value: arg ? `${arg}\0` : undefined,
        type: 's',
        size: 4 + (function () {
            if (arg === undefined) {
                return 0;
            }
            else {
                // fancy logic to calculate size with padding to a multiple of 4 bytes (int).
                // length+1 for null terminator
                return (arg.length + 1 + 3) & ~3;
            }
        })(),
        optional: true,
        _marshallArg: function (wireMsg) {
            if (this.value === undefined) {
                new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = 0;
            }
            else {
                new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = this.value.length;
                const strLen = this.value.length;
                const buf8 = new Uint8Array(wireMsg.buffer, wireMsg.bufferOffset + 4, strLen);
                for (let i = 0; i < strLen; i++) {
                    buf8[i] = this.value[i].charCodeAt(0);
                }
            }
            wireMsg.bufferOffset += this.size;
        }
    };
}
function array(arg) {
    return {
        value: arg,
        type: 'a',
        size: 4 + (function () {
            // fancy logic to calculate size with padding to a multiple of 4 bytes (int).
            return (arg.byteLength + 3) & ~3;
        })(),
        optional: false,
        _marshallArg: function (wireMsg) {
            new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = this.value.byteLength;
            const byteLength = this.value.byteLength;
            new Uint8Array(wireMsg.buffer, wireMsg.bufferOffset + 4, byteLength).set(new Uint8Array(this.value.buffer, 0, byteLength));
            wireMsg.bufferOffset += this.size;
        }
    };
}
function arrayOptional(arg) {
    return {
        value: arg,
        type: 'a',
        size: 4 + (function () {
            if (arg === undefined) {
                return 0;
            }
            else {
                // fancy logic to calculate size with padding to a multiple of 4 bytes (int).
                return (arg.byteLength + 3) & ~3;
            }
        })(),
        optional: true,
        _marshallArg: function (wireMsg) {
            if (this.value === undefined) {
                new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = 0;
            }
            else {
                new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0] = this.value.byteLength;
                const byteLength = this.value.byteLength;
                new Uint8Array(wireMsg.buffer, wireMsg.bufferOffset + 4, byteLength).set(new Uint8Array(this.value.buffer, 0, byteLength));
            }
            wireMsg.bufferOffset += this.size;
        }
    };
}
function checkMessageSize(message, consumption) {
    if (message.consumed + consumption > message.size) {
        throw new Error(`Request too short.`);
    }
    else {
        message.consumed += consumption;
    }
}
function u(message) {
    checkMessageSize(message, 4);
    return message.buffer[message.bufferOffset++];
}
function i(message) {
    checkMessageSize(message, 4);
    const arg = new Int32Array(message.buffer.buffer, message.buffer.byteOffset + (message.bufferOffset * Uint32Array.BYTES_PER_ELEMENT), 1)[0];
    message.bufferOffset += 1;
    return arg;
}
function f(message) {
    checkMessageSize(message, 4);
    const arg = new Int32Array(message.buffer.buffer, message.buffer.byteOffset + (message.bufferOffset * Uint32Array.BYTES_PER_ELEMENT), 1)[0];
    message.bufferOffset += 1;
    return new Fixed(arg >> 0);
}
function oOptional(message, connection) {
    checkMessageSize(message, 4);
    const arg = message.buffer[message.bufferOffset++];
    if (arg === 0) {
        return undefined;
    }
    else {
        const wlObject = connection.wlObjects[arg];
        if (wlObject) {
            // TODO add an extra check to make sure we cast correctly
            return wlObject;
        }
        else {
            throw new Error(`Unknown object id ${arg}`);
        }
    }
}
function o(message, connection) {
    checkMessageSize(message, 4);
    const arg = message.buffer[message.bufferOffset++];
    const wlObject = connection.wlObjects[arg];
    if (wlObject) {
        // TODO add an extra check to make sure we cast correctly
        return wlObject;
    }
    else {
        throw new Error(`Unknown object id ${arg}`);
    }
}
function n(message) {
    checkMessageSize(message, 4);
    return message.buffer[message.bufferOffset++];
}
function sOptional(message) {
    checkMessageSize(message, 4);
    const stringSize = message.buffer[message.bufferOffset++];
    if (stringSize === 0) {
        return undefined;
    }
    else {
        const alignedSize = ((stringSize + 3) & ~3);
        checkMessageSize(message, alignedSize);
        // size -1 to eliminate null byte
        const byteArray = new Uint8Array(message.buffer.buffer, message.buffer.byteOffset + (message.bufferOffset * Uint32Array.BYTES_PER_ELEMENT), stringSize - 1);
        message.bufferOffset += (alignedSize / 4);
        return textDecoder.decode(byteArray);
    }
}
function s(message) {
    checkMessageSize(message, 4);
    const stringSize = message.buffer[message.bufferOffset++];
    const alignedSize = ((stringSize + 3) & ~3);
    checkMessageSize(message, alignedSize);
    // size -1 to eliminate null byte
    const byteArray = new Uint8Array(message.buffer.buffer, message.buffer.byteOffset + (message.bufferOffset * Uint32Array.BYTES_PER_ELEMENT), stringSize - 1);
    message.bufferOffset += (alignedSize / 4);
    return textDecoder.decode(byteArray);
}
function aOptional(message, optional) {
    checkMessageSize(message, 4);
    const arraySize = message.buffer[message.bufferOffset++];
    if (arraySize === 0) {
        return undefined;
    }
    else {
        const alignedSize = ((arraySize + 3) & ~3);
        checkMessageSize(message, alignedSize);
        const arg = message.buffer.buffer.slice(message.buffer.byteOffset + (message.bufferOffset * Uint32Array.BYTES_PER_ELEMENT), message.buffer.byteOffset + (message.bufferOffset * Uint32Array.BYTES_PER_ELEMENT) + arraySize);
        message.bufferOffset += alignedSize;
        return arg;
    }
}
function a(message) {
    checkMessageSize(message, 4);
    const arraySize = message.buffer[message.bufferOffset++];
    const alignedSize = ((arraySize + 3) & ~3);
    checkMessageSize(message, alignedSize);
    const arg = message.buffer.buffer.slice(message.buffer.byteOffset + (message.bufferOffset * Uint32Array.BYTES_PER_ELEMENT), message.buffer.byteOffset + (message.bufferOffset * Uint32Array.BYTES_PER_ELEMENT) + arraySize);
    message.bufferOffset += alignedSize;
    return arg;
}
function h(message) {
    if (message.fds.length > 0) {
        let webFd = message.fds.shift();
        if (webFd === undefined) {
            throw new Error('No more webfds found in wl message.');
        }
        return webFd;
    }
    else {
        throw new Error('Not enough file descriptors in message object.');
    }
}
class Connection {
    constructor() {
        this.wlObjects = {};
        this.closed = false;
        this._outMessages = [];
        this._inMessages = [];
        this._idleHandlers = [];
    }
    /**
     * Adds a one-shot idle handler. The idle handler is fired once, after all incoming request messages have been processed.
     */
    addIdleHandler(idleHandler) {
        this._idleHandlers = [...this._idleHandlers, idleHandler];
    }
    removeIdleHandler(idleHandler) {
        this._idleHandlers = this._idleHandlers.filter(handler => handler !== idleHandler);
    }
    marshallMsg(id, opcode, size, argsArray) {
        const wireMsg = {
            buffer: new ArrayBuffer(size),
            fds: [],
            bufferOffset: 0
        };
        // write actual wire message
        const bufu32 = new Uint32Array(wireMsg.buffer);
        const bufu16 = new Uint16Array(wireMsg.buffer);
        bufu32[0] = id;
        bufu16[2] = opcode;
        bufu16[3] = size;
        wireMsg.bufferOffset = 8;
        // write actual argument value to buffer
        argsArray.forEach((arg) => arg._marshallArg(wireMsg));
        this.onSend(wireMsg);
    }
    _idle() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const idleHandler of this._idleHandlers) {
                yield idleHandler();
            }
        });
    }
    /**
     * Handle received wire messages.
     */
    message(incomingWireMessages) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.closed) {
                return;
            }
            // more than one message in queue means the message loop is in await, don't concurrently process the new
            // message, instead return early and let the resume-from-await pick up the newly queued message.
            if (this._inMessages.push(Object.assign(Object.assign({}, incomingWireMessages), { bufferOffset: 0, consumed: 0, size: 0 })) > 1) {
                return;
            }
            while (this._inMessages.length) {
                const wireMessages = this._inMessages[0];
                while (wireMessages.bufferOffset < wireMessages.buffer.length) {
                    const id = wireMessages.buffer[wireMessages.bufferOffset];
                    const sizeOpcode = wireMessages.buffer[wireMessages.bufferOffset + 1];
                    wireMessages.size = sizeOpcode >>> 16;
                    const opcode = sizeOpcode & 0x0000FFFF;
                    if (wireMessages.size > wireMessages.buffer.byteLength) {
                        throw new Error('Request buffer too small');
                    }
                    const wlObject = this.wlObjects[id];
                    if (wlObject) {
                        wireMessages.bufferOffset += 2;
                        wireMessages.consumed = 8;
                        try {
                            // @ts-ignore
                            yield wlObject[opcode](wireMessages);
                        }
                        catch (e) {
                            console.error(`
wlObject: ${wlObject.constructor.name}[${opcode}](..)
name: ${e.name} message: ${e.message} text: ${e.text}
error object stack:
${e.stack}
`);
                            this.close();
                            throw e;
                        }
                        if (this.closed) {
                            return;
                        }
                    }
                    else {
                        throw new Error(`invalid object ${id}`);
                    }
                }
                this._inMessages.shift();
            }
            this.flush();
            yield this._idle();
        });
    }
    /**
     * This doesn't actually send the message, but queues it so it can be send on flush.
     */
    onSend(wireMsg) {
        if (this.closed) {
            return;
        }
        this._outMessages.push(wireMsg);
    }
    flush() {
        var _a;
        if (this.closed) {
            return;
        }
        if (this._outMessages.length === 0) {
            return;
        }
        (_a = this.onFlush) === null || _a === void 0 ? void 0 : _a.call(this, this._outMessages);
        this._outMessages = [];
    }
    close() {
        if (this.closed) {
            return;
        }
        // destroy resources in descending order
        Object.values(this.wlObjects).sort((a, b) => a.id - b.id).forEach((wlObject) => wlObject.destroy());
        this.closed = true;
    }
    registerWlObject(wlObject) {
        if (this.closed) {
            return;
        }
        if (wlObject.id in this.wlObjects) {
            throw new Error(`Illegal object id: ${wlObject.id}. Already registered.`);
        }
        this.wlObjects[wlObject.id] = wlObject;
    }
    unregisterWlObject(wlObject) {
        if (this.closed) {
            return;
        }
        delete this.wlObjects[wlObject.id];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29ubmVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Db25uZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBc0JFO0FBQ0YsTUFBTSxXQUFXLEdBQUcsSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUE7QUFFM0MsTUFBTSxPQUFPLFFBQVE7SUFPbkIsWUFBWSxFQUFVO1FBSEwsb0JBQWUsR0FBa0IsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLENBQUE7UUFDakcsc0JBQWlCLEdBQXFDLEVBQUUsQ0FBQTtRQUc5RCxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQTtRQUNaLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzNHLENBQUM7SUFFRCxPQUFPO1FBQ0wsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUE7SUFDekIsQ0FBQztJQUVELGtCQUFrQixDQUFDLGVBQTZDO1FBQzlELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUE7SUFDOUMsQ0FBQztJQUVELHFCQUFxQixDQUFDLGVBQTZDO1FBQ2pFLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEtBQUssZUFBZSxDQUFDLENBQUE7SUFDNUYsQ0FBQztJQUVELFNBQVM7UUFDUCxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUE7SUFDN0IsQ0FBQztDQUNGO0FBRUQsTUFBTSxPQUFPLEtBQUs7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Q0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7UUFDbkcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUE7SUFDcEIsQ0FBQztJQUVELGdCQUFnQixDQUFDLFFBQWtCO1FBQ2pDLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNmLE9BQU07U0FDUDtRQUNELElBQUksUUFBUSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2pDLE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQXNCLFFBQVEsQ0FBQyxFQUFFLHVCQUF1QixDQUFDLENBQUE7U0FDMUU7UUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUE7SUFDeEMsQ0FBQztJQUVELGtCQUFrQixDQUFDLFFBQWtCO1FBQ25DLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNmLE9BQU07U0FDUDtRQUNELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDcEMsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLypcbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAyMCBFcmlrIERlIFJpamNrZVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbiAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4gIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cbiovXG5jb25zdCB0ZXh0RGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcigndXRmOCcpXG5cbmV4cG9ydCBjbGFzcyBXbE9iamVjdCB7XG4gIHJlYWRvbmx5IGlkOiBudW1iZXJcbiAgLy8gQHRzLWlnbm9yZVxuICBwcml2YXRlIF9kZXN0cm95UmVzb2x2ZXI6ICgpID0+IHZvaWRcbiAgcHJpdmF0ZSByZWFkb25seSBfZGVzdHJveVByb21pc2U6IFByb21pc2U8dm9pZD4gPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuX2Rlc3Ryb3lSZXNvbHZlciA9IHJlc29sdmUpXG4gIHByaXZhdGUgX2Rlc3Ryb3lMaXN0ZW5lcnM6ICgod2xPYmplY3Q6IFdsT2JqZWN0KSA9PiB2b2lkKVtdID0gW11cblxuICBjb25zdHJ1Y3RvcihpZDogbnVtYmVyKSB7XG4gICAgdGhpcy5pZCA9IGlkXG4gICAgdGhpcy5fZGVzdHJveVByb21pc2UudGhlbigoKSA9PiB0aGlzLl9kZXN0cm95TGlzdGVuZXJzLmZvckVhY2goZGVzdHJveUxpc3RlbmVyID0+IGRlc3Ryb3lMaXN0ZW5lcih0aGlzKSkpXG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3lSZXNvbHZlcigpXG4gIH1cblxuICBhZGREZXN0cm95TGlzdGVuZXIoZGVzdHJveUxpc3RlbmVyOiAod2xPYmplY3Q6IFdsT2JqZWN0KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5fZGVzdHJveUxpc3RlbmVycy5wdXNoKGRlc3Ryb3lMaXN0ZW5lcilcbiAgfVxuXG4gIHJlbW92ZURlc3Ryb3lMaXN0ZW5lcihkZXN0cm95TGlzdGVuZXI6ICh3bE9iamVjdDogV2xPYmplY3QpID0+IHZvaWQpIHtcbiAgICB0aGlzLl9kZXN0cm95TGlzdGVuZXJzID0gdGhpcy5fZGVzdHJveUxpc3RlbmVycy5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0gIT09IGRlc3Ryb3lMaXN0ZW5lcilcbiAgfVxuXG4gIG9uRGVzdHJveSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZGVzdHJveVByb21pc2VcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRml4ZWQge1xuICByZWFkb25seSBfcmF3OiBudW1iZXJcblxuICBzdGF0aWMgcGFyc2UoZGF0YTogbnVtYmVyKTogRml4ZWQge1xuICAgIHJldHVybiBuZXcgRml4ZWQoKGRhdGEgKiAyNTYuMCkgPj4gMClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXByZXNlbnQgZml4ZWQgYXMgYSBzaWduZWQgMjQtYml0IGludGVnZXIuXG4gICAqXG4gICAqL1xuICBhc0ludCgpOiBudW1iZXIge1xuICAgIHJldHVybiAoKHRoaXMuX3JhdyAvIDI1Ni4wKSA+PiAwKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlcHJlc2VudCBmaXhlZCBhcyBhIHNpZ25lZCAyNC1iaXQgbnVtYmVyIHdpdGggYW4gOC1iaXQgZnJhY3Rpb25hbCBwYXJ0LlxuICAgKlxuICAgKi9cbiAgYXNEb3VibGUoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fcmF3IC8gMjU2LjBcbiAgfVxuXG4gIC8qKlxuICAgKiB1c2UgcGFyc2VGaXhlZCBpbnN0ZWFkXG4gICAqIEBwYXJhbSB7bnVtYmVyfXJhd1xuICAgKi9cbiAgY29uc3RydWN0b3IocmF3OiBudW1iZXIpIHtcbiAgICB0aGlzLl9yYXcgPSByYXdcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgV2ViRkQge1xuICByZWFkb25seSBmZDogbnVtYmVyXG4gIHJlYWRvbmx5IHR5cGU6ICdJbWFnZUJpdG1hcCcgfCAnQXJyYXlCdWZmZXInIHwgJ01lc3NhZ2VQb3J0JyB8ICdPZmZzY3JlZW5DYW52YXMnXG4gIHJlYWRvbmx5IHVybDogVVJMXG4gIHByaXZhdGUgcmVhZG9ubHkgX29uR2V0VHJhbnNmZXJhYmxlOiAod2ViRmQ6IFdlYkZEKSA9PiBQcm9taXNlPFRyYW5zZmVyYWJsZT5cbiAgcHJpdmF0ZSByZWFkb25seSBfb25DbG9zZTogKHdlYkZkOiBXZWJGRCkgPT4gdm9pZFxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGZkOiBudW1iZXIsXG4gICAgZmRUeXBlOiAnSW1hZ2VCaXRtYXAnIHwgJ0FycmF5QnVmZmVyJyB8ICdNZXNzYWdlUG9ydCcgfCAnT2Zmc2NyZWVuQ2FudmFzJyxcbiAgICBmZFVSTDogVVJMLFxuICAgIG9uR2V0VHJhbnNmZXJhYmxlOiAod2ViRmQ6IFdlYkZEKSA9PiBQcm9taXNlPFRyYW5zZmVyYWJsZT4sXG4gICAgb25DbG9zZTogKHdlYkZkOiBXZWJGRCkgPT4gdm9pZFxuICApIHtcbiAgICB0aGlzLmZkID0gZmRcbiAgICB0aGlzLnR5cGUgPSBmZFR5cGVcbiAgICB0aGlzLnVybCA9IGZkVVJMXG4gICAgdGhpcy5fb25HZXRUcmFuc2ZlcmFibGUgPSBvbkdldFRyYW5zZmVyYWJsZVxuICAgIHRoaXMuX29uQ2xvc2UgPSBvbkNsb3NlXG4gIH1cblxuICBhc3luYyBnZXRUcmFuc2ZlcmFibGUoKTogUHJvbWlzZTxUcmFuc2ZlcmFibGU+IHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fb25HZXRUcmFuc2ZlcmFibGUodGhpcylcbiAgfVxuXG4gIGNsb3NlKCkge1xuICAgIHRoaXMuX29uQ2xvc2UodGhpcylcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1lc3NhZ2VNYXJzaGFsbGluZ0NvbnRleHQ8ViBleHRlbmRzIG51bWJlciB8IFdlYkZEIHwgRml4ZWQgfCBXbE9iamVjdCB8IDAgfCBzdHJpbmcgfCBBcnJheUJ1ZmZlclZpZXcgfCB1bmRlZmluZWQsXG4gIFQgZXh0ZW5kcyAndScgfCAnaCcgfCAnaScgfCAnZicgfCAnbycgfCAnbicgfCAncycgfCAnYScsXG4gIFMgZXh0ZW5kcyAwIHwgNCB8IG51bWJlcj4ge1xuICB2YWx1ZTogVixcbiAgcmVhZG9ubHkgdHlwZTogVCxcbiAgcmVhZG9ubHkgc2l6ZTogbnVtYmVyLFxuICByZWFkb25seSBvcHRpb25hbDogYm9vbGVhbixcbiAgcmVhZG9ubHkgX21hcnNoYWxsQXJnOiAod2lyZU1zZzogeyBidWZmZXI6IEFycmF5QnVmZmVyLCBmZHM6IEFycmF5PFdlYkZEPiwgYnVmZmVyT2Zmc2V0OiBudW1iZXIgfSkgPT4gdm9pZFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFdsTWVzc2FnZSB7XG4gIGJ1ZmZlcjogVWludDMyQXJyYXksXG4gIGZkczogQXJyYXk8V2ViRkQ+LFxuICBidWZmZXJPZmZzZXQ6IG51bWJlcixcbiAgY29uc3VtZWQ6IG51bWJlcixcbiAgc2l6ZTogbnVtYmVyXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2VuZE1lc3NhZ2Uge1xuICBidWZmZXI6IEFycmF5QnVmZmVyLFxuICBmZHM6IEFycmF5PFdlYkZEPlxufVxuXG5leHBvcnQgZnVuY3Rpb24gdWludChhcmc6IG51bWJlcik6IE1lc3NhZ2VNYXJzaGFsbGluZ0NvbnRleHQ8bnVtYmVyLCAndScsIDQ+IHtcbiAgcmV0dXJuIHtcbiAgICB2YWx1ZTogYXJnLFxuICAgIHR5cGU6ICd1JyxcbiAgICBzaXplOiA0LFxuICAgIG9wdGlvbmFsOiBmYWxzZSxcbiAgICBfbWFyc2hhbGxBcmc6IGZ1bmN0aW9uKHdpcmVNc2cpIHtcbiAgICAgIG5ldyBVaW50MzJBcnJheSh3aXJlTXNnLmJ1ZmZlciwgd2lyZU1zZy5idWZmZXJPZmZzZXQsIDEpWzBdID0gYXJnXG4gICAgICB3aXJlTXNnLmJ1ZmZlck9mZnNldCArPSB0aGlzLnNpemVcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbGVEZXNjcmlwdG9yKGFyZzogV2ViRkQpOiBNZXNzYWdlTWFyc2hhbGxpbmdDb250ZXh0PFdlYkZELCAnaCcsIDA+IHtcbiAgcmV0dXJuIHtcbiAgICB2YWx1ZTogYXJnLFxuICAgIHR5cGU6ICdoJyxcbiAgICBzaXplOiAwLCAvLyBmaWxlIGRlc2NyaXB0b3JzIGFyZSBub3QgYWRkZWQgdG8gdGhlIG1lc3NhZ2Ugc2l6ZSBiZWNhdXNlIHRoZXkgYXJlIHNvbWV3aGF0IGNvbnNpZGVyZWQgbWV0YSBkYXRhLlxuICAgIG9wdGlvbmFsOiBmYWxzZSxcbiAgICBfbWFyc2hhbGxBcmc6IGZ1bmN0aW9uKHdpcmVNc2cpIHtcbiAgICAgIHdpcmVNc2cuZmRzLnB1c2goYXJnKVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaW50KGFyZzogbnVtYmVyKTogTWVzc2FnZU1hcnNoYWxsaW5nQ29udGV4dDxudW1iZXIsICdpJywgND4ge1xuICByZXR1cm4ge1xuICAgIHZhbHVlOiBhcmcsXG4gICAgdHlwZTogJ2knLFxuICAgIHNpemU6IDQsXG4gICAgb3B0aW9uYWw6IGZhbHNlLFxuICAgIF9tYXJzaGFsbEFyZzogZnVuY3Rpb24od2lyZU1zZykge1xuICAgICAgbmV3IEludDMyQXJyYXkod2lyZU1zZy5idWZmZXIsIHdpcmVNc2cuYnVmZmVyT2Zmc2V0LCAxKVswXSA9IHRoaXMudmFsdWVcbiAgICAgIHdpcmVNc2cuYnVmZmVyT2Zmc2V0ICs9IHRoaXMuc2l6ZVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZml4ZWQoYXJnOiBGaXhlZCk6IE1lc3NhZ2VNYXJzaGFsbGluZ0NvbnRleHQ8Rml4ZWQsICdmJywgND4ge1xuICByZXR1cm4ge1xuICAgIHZhbHVlOiBhcmcsXG4gICAgdHlwZTogJ2YnLFxuICAgIHNpemU6IDQsXG4gICAgb3B0aW9uYWw6IGZhbHNlLFxuICAgIF9tYXJzaGFsbEFyZzogZnVuY3Rpb24od2lyZU1zZykge1xuICAgICAgbmV3IEludDMyQXJyYXkod2lyZU1zZy5idWZmZXIsIHdpcmVNc2cuYnVmZmVyT2Zmc2V0LCAxKVswXSA9IHRoaXMudmFsdWUuX3Jhd1xuICAgICAgd2lyZU1zZy5idWZmZXJPZmZzZXQgKz0gdGhpcy5zaXplXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvYmplY3QoYXJnOiBXbE9iamVjdCk6IE1lc3NhZ2VNYXJzaGFsbGluZ0NvbnRleHQ8V2xPYmplY3QsICdvJywgND4ge1xuICByZXR1cm4ge1xuICAgIHZhbHVlOiBhcmcsXG4gICAgdHlwZTogJ28nLFxuICAgIHNpemU6IDQsXG4gICAgb3B0aW9uYWw6IGZhbHNlLFxuICAgIF9tYXJzaGFsbEFyZzogZnVuY3Rpb24od2lyZU1zZykge1xuICAgICAgbmV3IFVpbnQzMkFycmF5KHdpcmVNc2cuYnVmZmVyLCB3aXJlTXNnLmJ1ZmZlck9mZnNldCwgMSlbMF0gPSB0aGlzLnZhbHVlLmlkXG4gICAgICB3aXJlTXNnLmJ1ZmZlck9mZnNldCArPSB0aGlzLnNpemVcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9iamVjdE9wdGlvbmFsKGFyZz86IFdsT2JqZWN0KTogTWVzc2FnZU1hcnNoYWxsaW5nQ29udGV4dDxXbE9iamVjdCB8IHVuZGVmaW5lZCwgJ28nLCA0PiB7XG4gIHJldHVybiB7XG4gICAgdmFsdWU6IGFyZyxcbiAgICB0eXBlOiAnbycsXG4gICAgc2l6ZTogNCxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICBfbWFyc2hhbGxBcmc6IGZ1bmN0aW9uKHdpcmVNc2cpIHtcbiAgICAgIG5ldyBVaW50MzJBcnJheSh3aXJlTXNnLmJ1ZmZlciwgd2lyZU1zZy5idWZmZXJPZmZzZXQsIDEpWzBdID0gKHRoaXMudmFsdWUgPT09IHVuZGVmaW5lZCA/IDAgOiB0aGlzLnZhbHVlLmlkKVxuICAgICAgd2lyZU1zZy5idWZmZXJPZmZzZXQgKz0gdGhpcy5zaXplXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuZXdPYmplY3QoKTogTWVzc2FnZU1hcnNoYWxsaW5nQ29udGV4dDwwLCAnbicsIDQ+IHtcbiAgcmV0dXJuIHtcbiAgICB2YWx1ZTogMCwgLy8gaWQgZmlsbGVkIGluIGJ5IF9tYXJzaGFsbENvbnN0cnVjdG9yXG4gICAgdHlwZTogJ24nLFxuICAgIHNpemU6IDQsXG4gICAgb3B0aW9uYWw6IGZhbHNlLFxuICAgIF9tYXJzaGFsbEFyZzogZnVuY3Rpb24od2lyZU1zZykge1xuICAgICAgbmV3IFVpbnQzMkFycmF5KHdpcmVNc2cuYnVmZmVyLCB3aXJlTXNnLmJ1ZmZlck9mZnNldCwgMSlbMF0gPSB0aGlzLnZhbHVlXG4gICAgICB3aXJlTXNnLmJ1ZmZlck9mZnNldCArPSB0aGlzLnNpemVcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0cmluZyhhcmc6IHN0cmluZyk6IE1lc3NhZ2VNYXJzaGFsbGluZ0NvbnRleHQ8c3RyaW5nLCAncycsIG51bWJlcj4ge1xuICByZXR1cm4ge1xuICAgIHZhbHVlOiBgJHthcmd9XFwwYCxcbiAgICB0eXBlOiAncycsXG4gICAgc2l6ZTogNCArIChmdW5jdGlvbigpIHtcbiAgICAgIC8vIGZhbmN5IGxvZ2ljIHRvIGNhbGN1bGF0ZSBzaXplIHdpdGggcGFkZGluZyB0byBhIG11bHRpcGxlIG9mIDQgYnl0ZXMgKGludCkuXG4gICAgICAvLyBsZW5ndGgrMSBmb3IgbnVsbCB0ZXJtaW5hdG9yXG4gICAgICByZXR1cm4gKGFyZy5sZW5ndGggKyAxICsgMykgJiB+M1xuICAgIH0pKCksXG4gICAgb3B0aW9uYWw6IGZhbHNlLFxuICAgIF9tYXJzaGFsbEFyZzogZnVuY3Rpb24od2lyZU1zZykge1xuICAgICAgbmV3IFVpbnQzMkFycmF5KHdpcmVNc2cuYnVmZmVyLCB3aXJlTXNnLmJ1ZmZlck9mZnNldCwgMSlbMF0gPSB0aGlzLnZhbHVlLmxlbmd0aFxuXG4gICAgICBjb25zdCBzdHJMZW4gPSB0aGlzLnZhbHVlLmxlbmd0aFxuICAgICAgY29uc3QgYnVmOCA9IG5ldyBVaW50OEFycmF5KHdpcmVNc2cuYnVmZmVyLCB3aXJlTXNnLmJ1ZmZlck9mZnNldCArIDQsIHN0ckxlbilcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyTGVuOyBpKyspIHtcbiAgICAgICAgYnVmOFtpXSA9IHRoaXMudmFsdWVbaV0uY2hhckNvZGVBdCgwKVxuICAgICAgfVxuICAgICAgd2lyZU1zZy5idWZmZXJPZmZzZXQgKz0gdGhpcy5zaXplXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdHJpbmdPcHRpb25hbChhcmc/OiBzdHJpbmcpOiBNZXNzYWdlTWFyc2hhbGxpbmdDb250ZXh0PHN0cmluZyB8IHVuZGVmaW5lZCwgJ3MnLCBudW1iZXI+IHtcbiAgcmV0dXJuIHtcbiAgICB2YWx1ZTogYXJnID8gYCR7YXJnfVxcMGAgOiB1bmRlZmluZWQsXG4gICAgdHlwZTogJ3MnLFxuICAgIHNpemU6IDQgKyAoZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoYXJnID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIDBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGZhbmN5IGxvZ2ljIHRvIGNhbGN1bGF0ZSBzaXplIHdpdGggcGFkZGluZyB0byBhIG11bHRpcGxlIG9mIDQgYnl0ZXMgKGludCkuXG4gICAgICAgIC8vIGxlbmd0aCsxIGZvciBudWxsIHRlcm1pbmF0b3JcbiAgICAgICAgcmV0dXJuIChhcmcubGVuZ3RoICsgMSArIDMpICYgfjNcbiAgICAgIH1cbiAgICB9KSgpLFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgIF9tYXJzaGFsbEFyZzogZnVuY3Rpb24od2lyZU1zZykge1xuICAgICAgaWYgKHRoaXMudmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBuZXcgVWludDMyQXJyYXkod2lyZU1zZy5idWZmZXIsIHdpcmVNc2cuYnVmZmVyT2Zmc2V0LCAxKVswXSA9IDBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ldyBVaW50MzJBcnJheSh3aXJlTXNnLmJ1ZmZlciwgd2lyZU1zZy5idWZmZXJPZmZzZXQsIDEpWzBdID0gdGhpcy52YWx1ZS5sZW5ndGhcblxuICAgICAgICBjb25zdCBzdHJMZW4gPSB0aGlzLnZhbHVlLmxlbmd0aFxuICAgICAgICBjb25zdCBidWY4ID0gbmV3IFVpbnQ4QXJyYXkod2lyZU1zZy5idWZmZXIsIHdpcmVNc2cuYnVmZmVyT2Zmc2V0ICsgNCwgc3RyTGVuKVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ckxlbjsgaSsrKSB7XG4gICAgICAgICAgYnVmOFtpXSA9IHRoaXMudmFsdWVbaV0uY2hhckNvZGVBdCgwKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB3aXJlTXNnLmJ1ZmZlck9mZnNldCArPSB0aGlzLnNpemVcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFycmF5KGFyZzogQXJyYXlCdWZmZXJWaWV3KTogTWVzc2FnZU1hcnNoYWxsaW5nQ29udGV4dDxBcnJheUJ1ZmZlclZpZXcsICdhJywgbnVtYmVyPiB7XG4gIHJldHVybiB7XG4gICAgdmFsdWU6IGFyZyxcbiAgICB0eXBlOiAnYScsXG4gICAgc2l6ZTogNCArIChmdW5jdGlvbigpIHtcbiAgICAgIC8vIGZhbmN5IGxvZ2ljIHRvIGNhbGN1bGF0ZSBzaXplIHdpdGggcGFkZGluZyB0byBhIG11bHRpcGxlIG9mIDQgYnl0ZXMgKGludCkuXG4gICAgICByZXR1cm4gKGFyZy5ieXRlTGVuZ3RoICsgMykgJiB+M1xuICAgIH0pKCksXG4gICAgb3B0aW9uYWw6IGZhbHNlLFxuICAgIF9tYXJzaGFsbEFyZzogZnVuY3Rpb24od2lyZU1zZykge1xuICAgICAgbmV3IFVpbnQzMkFycmF5KHdpcmVNc2cuYnVmZmVyLCB3aXJlTXNnLmJ1ZmZlck9mZnNldCwgMSlbMF0gPSB0aGlzLnZhbHVlLmJ5dGVMZW5ndGhcblxuICAgICAgY29uc3QgYnl0ZUxlbmd0aCA9IHRoaXMudmFsdWUuYnl0ZUxlbmd0aFxuICAgICAgbmV3IFVpbnQ4QXJyYXkod2lyZU1zZy5idWZmZXIsIHdpcmVNc2cuYnVmZmVyT2Zmc2V0ICsgNCwgYnl0ZUxlbmd0aCkuc2V0KG5ldyBVaW50OEFycmF5KHRoaXMudmFsdWUuYnVmZmVyLCAwLCBieXRlTGVuZ3RoKSlcblxuICAgICAgd2lyZU1zZy5idWZmZXJPZmZzZXQgKz0gdGhpcy5zaXplXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheU9wdGlvbmFsKGFyZz86IEFycmF5QnVmZmVyVmlldyk6IE1lc3NhZ2VNYXJzaGFsbGluZ0NvbnRleHQ8QXJyYXlCdWZmZXJWaWV3IHwgdW5kZWZpbmVkLCAnYScsIG51bWJlcj4ge1xuICByZXR1cm4ge1xuICAgIHZhbHVlOiBhcmcsXG4gICAgdHlwZTogJ2EnLFxuICAgIHNpemU6IDQgKyAoZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoYXJnID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIDBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGZhbmN5IGxvZ2ljIHRvIGNhbGN1bGF0ZSBzaXplIHdpdGggcGFkZGluZyB0byBhIG11bHRpcGxlIG9mIDQgYnl0ZXMgKGludCkuXG4gICAgICAgIHJldHVybiAoYXJnLmJ5dGVMZW5ndGggKyAzKSAmIH4zXG4gICAgICB9XG4gICAgfSkoKSxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICBfbWFyc2hhbGxBcmc6IGZ1bmN0aW9uKHdpcmVNc2cpIHtcbiAgICAgIGlmICh0aGlzLnZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbmV3IFVpbnQzMkFycmF5KHdpcmVNc2cuYnVmZmVyLCB3aXJlTXNnLmJ1ZmZlck9mZnNldCwgMSlbMF0gPSAwXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXcgVWludDMyQXJyYXkod2lyZU1zZy5idWZmZXIsIHdpcmVNc2cuYnVmZmVyT2Zmc2V0LCAxKVswXSA9IHRoaXMudmFsdWUuYnl0ZUxlbmd0aFxuXG4gICAgICAgIGNvbnN0IGJ5dGVMZW5ndGggPSB0aGlzLnZhbHVlLmJ5dGVMZW5ndGhcbiAgICAgICAgbmV3IFVpbnQ4QXJyYXkod2lyZU1zZy5idWZmZXIsIHdpcmVNc2cuYnVmZmVyT2Zmc2V0ICsgNCwgYnl0ZUxlbmd0aCkuc2V0KG5ldyBVaW50OEFycmF5KHRoaXMudmFsdWUuYnVmZmVyLCAwLCBieXRlTGVuZ3RoKSlcbiAgICAgIH1cbiAgICAgIHdpcmVNc2cuYnVmZmVyT2Zmc2V0ICs9IHRoaXMuc2l6ZVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjaGVja01lc3NhZ2VTaXplKG1lc3NhZ2U6IFdsTWVzc2FnZSwgY29uc3VtcHRpb246IG51bWJlcikge1xuICBpZiAobWVzc2FnZS5jb25zdW1lZCArIGNvbnN1bXB0aW9uID4gbWVzc2FnZS5zaXplKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBSZXF1ZXN0IHRvbyBzaG9ydC5gKVxuICB9IGVsc2Uge1xuICAgIG1lc3NhZ2UuY29uc3VtZWQgKz0gY29uc3VtcHRpb25cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdShtZXNzYWdlOiBXbE1lc3NhZ2UpOiBudW1iZXIge1xuICBjaGVja01lc3NhZ2VTaXplKG1lc3NhZ2UsIDQpXG4gIHJldHVybiBtZXNzYWdlLmJ1ZmZlclttZXNzYWdlLmJ1ZmZlck9mZnNldCsrXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaShtZXNzYWdlOiBXbE1lc3NhZ2UpOiBudW1iZXIge1xuICBjaGVja01lc3NhZ2VTaXplKG1lc3NhZ2UsIDQpXG4gIGNvbnN0IGFyZyA9IG5ldyBJbnQzMkFycmF5KG1lc3NhZ2UuYnVmZmVyLmJ1ZmZlciwgbWVzc2FnZS5idWZmZXIuYnl0ZU9mZnNldCArIChtZXNzYWdlLmJ1ZmZlck9mZnNldCAqIFVpbnQzMkFycmF5LkJZVEVTX1BFUl9FTEVNRU5UKSwgMSlbMF1cbiAgbWVzc2FnZS5idWZmZXJPZmZzZXQgKz0gMVxuICByZXR1cm4gYXJnXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmKG1lc3NhZ2U6IFdsTWVzc2FnZSk6IEZpeGVkIHtcbiAgY2hlY2tNZXNzYWdlU2l6ZShtZXNzYWdlLCA0KVxuICBjb25zdCBhcmcgPSBuZXcgSW50MzJBcnJheShtZXNzYWdlLmJ1ZmZlci5idWZmZXIsIG1lc3NhZ2UuYnVmZmVyLmJ5dGVPZmZzZXQgKyAobWVzc2FnZS5idWZmZXJPZmZzZXQgKiBVaW50MzJBcnJheS5CWVRFU19QRVJfRUxFTUVOVCksIDEpWzBdXG4gIG1lc3NhZ2UuYnVmZmVyT2Zmc2V0ICs9IDFcbiAgcmV0dXJuIG5ldyBGaXhlZChhcmcgPj4gMClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9PcHRpb25hbDxUIGV4dGVuZHMgV2xPYmplY3Q+KG1lc3NhZ2U6IFdsTWVzc2FnZSwgY29ubmVjdGlvbjogQ29ubmVjdGlvbik6IFQgfCB1bmRlZmluZWQge1xuICBjaGVja01lc3NhZ2VTaXplKG1lc3NhZ2UsIDQpXG4gIGNvbnN0IGFyZyA9IG1lc3NhZ2UuYnVmZmVyW21lc3NhZ2UuYnVmZmVyT2Zmc2V0KytdXG4gIGlmIChhcmcgPT09IDApIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkXG4gIH0gZWxzZSB7XG4gICAgY29uc3Qgd2xPYmplY3QgPSBjb25uZWN0aW9uLndsT2JqZWN0c1thcmddXG4gICAgaWYgKHdsT2JqZWN0KSB7XG4gICAgICAvLyBUT0RPIGFkZCBhbiBleHRyYSBjaGVjayB0byBtYWtlIHN1cmUgd2UgY2FzdCBjb3JyZWN0bHlcbiAgICAgIHJldHVybiB3bE9iamVjdCBhcyBUXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBvYmplY3QgaWQgJHthcmd9YClcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG88VCBleHRlbmRzIFdsT2JqZWN0PihtZXNzYWdlOiBXbE1lc3NhZ2UsIGNvbm5lY3Rpb246IENvbm5lY3Rpb24pOiBUIHtcbiAgY2hlY2tNZXNzYWdlU2l6ZShtZXNzYWdlLCA0KVxuICBjb25zdCBhcmcgPSBtZXNzYWdlLmJ1ZmZlclttZXNzYWdlLmJ1ZmZlck9mZnNldCsrXVxuXG4gIGNvbnN0IHdsT2JqZWN0ID0gY29ubmVjdGlvbi53bE9iamVjdHNbYXJnXVxuICBpZiAod2xPYmplY3QpIHtcbiAgICAvLyBUT0RPIGFkZCBhbiBleHRyYSBjaGVjayB0byBtYWtlIHN1cmUgd2UgY2FzdCBjb3JyZWN0bHlcbiAgICByZXR1cm4gd2xPYmplY3QgYXMgVFxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBvYmplY3QgaWQgJHthcmd9YClcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbihtZXNzYWdlOiBXbE1lc3NhZ2UpOiBudW1iZXIge1xuICBjaGVja01lc3NhZ2VTaXplKG1lc3NhZ2UsIDQpXG4gIHJldHVybiBtZXNzYWdlLmJ1ZmZlclttZXNzYWdlLmJ1ZmZlck9mZnNldCsrXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc09wdGlvbmFsKG1lc3NhZ2U6IFdsTWVzc2FnZSk6IHN0cmluZyB8IHVuZGVmaW5lZCB7IC8vIHtTdHJpbmd9XG4gIGNoZWNrTWVzc2FnZVNpemUobWVzc2FnZSwgNClcbiAgY29uc3Qgc3RyaW5nU2l6ZSA9IG1lc3NhZ2UuYnVmZmVyW21lc3NhZ2UuYnVmZmVyT2Zmc2V0KytdXG4gIGlmIChzdHJpbmdTaXplID09PSAwKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGFsaWduZWRTaXplID0gKChzdHJpbmdTaXplICsgMykgJiB+MylcbiAgICBjaGVja01lc3NhZ2VTaXplKG1lc3NhZ2UsIGFsaWduZWRTaXplKVxuICAgIC8vIHNpemUgLTEgdG8gZWxpbWluYXRlIG51bGwgYnl0ZVxuICAgIGNvbnN0IGJ5dGVBcnJheSA9IG5ldyBVaW50OEFycmF5KG1lc3NhZ2UuYnVmZmVyLmJ1ZmZlciwgbWVzc2FnZS5idWZmZXIuYnl0ZU9mZnNldCArIChtZXNzYWdlLmJ1ZmZlck9mZnNldCAqIFVpbnQzMkFycmF5LkJZVEVTX1BFUl9FTEVNRU5UKSwgc3RyaW5nU2l6ZSAtIDEpXG4gICAgbWVzc2FnZS5idWZmZXJPZmZzZXQgKz0gKGFsaWduZWRTaXplIC8gNClcbiAgICByZXR1cm4gdGV4dERlY29kZXIuZGVjb2RlKGJ5dGVBcnJheSlcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcyhtZXNzYWdlOiBXbE1lc3NhZ2UpOiBzdHJpbmcgeyAvLyB7U3RyaW5nfVxuICBjaGVja01lc3NhZ2VTaXplKG1lc3NhZ2UsIDQpXG4gIGNvbnN0IHN0cmluZ1NpemUgPSBtZXNzYWdlLmJ1ZmZlclttZXNzYWdlLmJ1ZmZlck9mZnNldCsrXVxuXG4gIGNvbnN0IGFsaWduZWRTaXplID0gKChzdHJpbmdTaXplICsgMykgJiB+MylcbiAgY2hlY2tNZXNzYWdlU2l6ZShtZXNzYWdlLCBhbGlnbmVkU2l6ZSlcbiAgLy8gc2l6ZSAtMSB0byBlbGltaW5hdGUgbnVsbCBieXRlXG4gIGNvbnN0IGJ5dGVBcnJheSA9IG5ldyBVaW50OEFycmF5KG1lc3NhZ2UuYnVmZmVyLmJ1ZmZlciwgbWVzc2FnZS5idWZmZXIuYnl0ZU9mZnNldCArIChtZXNzYWdlLmJ1ZmZlck9mZnNldCAqIFVpbnQzMkFycmF5LkJZVEVTX1BFUl9FTEVNRU5UKSwgc3RyaW5nU2l6ZSAtIDEpXG4gIG1lc3NhZ2UuYnVmZmVyT2Zmc2V0ICs9IChhbGlnbmVkU2l6ZSAvIDQpXG4gIHJldHVybiB0ZXh0RGVjb2Rlci5kZWNvZGUoYnl0ZUFycmF5KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYU9wdGlvbmFsKG1lc3NhZ2U6IFdsTWVzc2FnZSwgb3B0aW9uYWw6IGJvb2xlYW4pOiBBcnJheUJ1ZmZlciB8IHVuZGVmaW5lZCB7XG4gIGNoZWNrTWVzc2FnZVNpemUobWVzc2FnZSwgNClcbiAgY29uc3QgYXJyYXlTaXplID0gbWVzc2FnZS5idWZmZXJbbWVzc2FnZS5idWZmZXJPZmZzZXQrK11cbiAgaWYgKGFycmF5U2l6ZSA9PT0gMCkge1xuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBhbGlnbmVkU2l6ZSA9ICgoYXJyYXlTaXplICsgMykgJiB+MylcbiAgICBjaGVja01lc3NhZ2VTaXplKG1lc3NhZ2UsIGFsaWduZWRTaXplKVxuICAgIGNvbnN0IGFyZyA9IG1lc3NhZ2UuYnVmZmVyLmJ1ZmZlci5zbGljZShtZXNzYWdlLmJ1ZmZlci5ieXRlT2Zmc2V0ICsgKG1lc3NhZ2UuYnVmZmVyT2Zmc2V0ICogVWludDMyQXJyYXkuQllURVNfUEVSX0VMRU1FTlQpLCBtZXNzYWdlLmJ1ZmZlci5ieXRlT2Zmc2V0ICsgKG1lc3NhZ2UuYnVmZmVyT2Zmc2V0ICogVWludDMyQXJyYXkuQllURVNfUEVSX0VMRU1FTlQpICsgYXJyYXlTaXplKVxuICAgIG1lc3NhZ2UuYnVmZmVyT2Zmc2V0ICs9IGFsaWduZWRTaXplXG4gICAgcmV0dXJuIGFyZ1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhKG1lc3NhZ2U6IFdsTWVzc2FnZSk6IEFycmF5QnVmZmVyIHtcbiAgY2hlY2tNZXNzYWdlU2l6ZShtZXNzYWdlLCA0KVxuICBjb25zdCBhcnJheVNpemUgPSBtZXNzYWdlLmJ1ZmZlclttZXNzYWdlLmJ1ZmZlck9mZnNldCsrXVxuXG4gIGNvbnN0IGFsaWduZWRTaXplID0gKChhcnJheVNpemUgKyAzKSAmIH4zKVxuICBjaGVja01lc3NhZ2VTaXplKG1lc3NhZ2UsIGFsaWduZWRTaXplKVxuICBjb25zdCBhcmcgPSBtZXNzYWdlLmJ1ZmZlci5idWZmZXIuc2xpY2UobWVzc2FnZS5idWZmZXIuYnl0ZU9mZnNldCArIChtZXNzYWdlLmJ1ZmZlck9mZnNldCAqIFVpbnQzMkFycmF5LkJZVEVTX1BFUl9FTEVNRU5UKSwgbWVzc2FnZS5idWZmZXIuYnl0ZU9mZnNldCArIChtZXNzYWdlLmJ1ZmZlck9mZnNldCAqIFVpbnQzMkFycmF5LkJZVEVTX1BFUl9FTEVNRU5UKSArIGFycmF5U2l6ZSlcbiAgbWVzc2FnZS5idWZmZXJPZmZzZXQgKz0gYWxpZ25lZFNpemVcbiAgcmV0dXJuIGFyZ1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaChtZXNzYWdlOiBXbE1lc3NhZ2UpOiBXZWJGRCB7IC8vIGZpbGUgZGVzY3JpcHRvciB7bnVtYmVyfVxuICBpZiAobWVzc2FnZS5mZHMubGVuZ3RoID4gMCkge1xuICAgIGxldCB3ZWJGZCA9IG1lc3NhZ2UuZmRzLnNoaWZ0KClcbiAgICBpZiAod2ViRmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBtb3JlIHdlYmZkcyBmb3VuZCBpbiB3bCBtZXNzYWdlLicpXG4gICAgfVxuICAgIHJldHVybiB3ZWJGZFxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IGVub3VnaCBmaWxlIGRlc2NyaXB0b3JzIGluIG1lc3NhZ2Ugb2JqZWN0LicpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIENvbm5lY3Rpb24ge1xuICByZWFkb25seSB3bE9iamVjdHM6IHsgW2tleTogbnVtYmVyXTogV2xPYmplY3QgfSA9IHt9XG4gIGNsb3NlZDogYm9vbGVhbiA9IGZhbHNlXG4gIG9uRmx1c2g/OiAob3V0TXNnOiBTZW5kTWVzc2FnZVtdKSA9PiB2b2lkXG4gIHByaXZhdGUgX291dE1lc3NhZ2VzOiBTZW5kTWVzc2FnZVtdID0gW11cbiAgcHJpdmF0ZSBfaW5NZXNzYWdlczogV2xNZXNzYWdlW10gPSBbXVxuICBwcml2YXRlIF9pZGxlSGFuZGxlcnM6ICgoKSA9PiB2b2lkKVtdID0gW11cblxuICAvKipcbiAgICogQWRkcyBhIG9uZS1zaG90IGlkbGUgaGFuZGxlci4gVGhlIGlkbGUgaGFuZGxlciBpcyBmaXJlZCBvbmNlLCBhZnRlciBhbGwgaW5jb21pbmcgcmVxdWVzdCBtZXNzYWdlcyBoYXZlIGJlZW4gcHJvY2Vzc2VkLlxuICAgKi9cbiAgYWRkSWRsZUhhbmRsZXIoaWRsZUhhbmRsZXI6ICgpID0+IHZvaWQpIHtcbiAgICB0aGlzLl9pZGxlSGFuZGxlcnMgPSBbLi4udGhpcy5faWRsZUhhbmRsZXJzLCBpZGxlSGFuZGxlcl1cbiAgfVxuXG4gIHJlbW92ZUlkbGVIYW5kbGVyKGlkbGVIYW5kbGVyOiAoKSA9PiB2b2lkKSB7XG4gICAgdGhpcy5faWRsZUhhbmRsZXJzID0gdGhpcy5faWRsZUhhbmRsZXJzLmZpbHRlcihoYW5kbGVyID0+IGhhbmRsZXIgIT09IGlkbGVIYW5kbGVyKVxuICB9XG5cbiAgbWFyc2hhbGxNc2coaWQ6IG51bWJlciwgb3Bjb2RlOiBudW1iZXIsIHNpemU6IG51bWJlciwgYXJnc0FycmF5OiBNZXNzYWdlTWFyc2hhbGxpbmdDb250ZXh0PGFueSwgYW55LCBhbnk+W10pIHtcbiAgICBjb25zdCB3aXJlTXNnID0ge1xuICAgICAgYnVmZmVyOiBuZXcgQXJyYXlCdWZmZXIoc2l6ZSksXG4gICAgICBmZHM6IFtdLFxuICAgICAgYnVmZmVyT2Zmc2V0OiAwXG4gICAgfVxuXG4gICAgLy8gd3JpdGUgYWN0dWFsIHdpcmUgbWVzc2FnZVxuICAgIGNvbnN0IGJ1ZnUzMiA9IG5ldyBVaW50MzJBcnJheSh3aXJlTXNnLmJ1ZmZlcilcbiAgICBjb25zdCBidWZ1MTYgPSBuZXcgVWludDE2QXJyYXkod2lyZU1zZy5idWZmZXIpXG4gICAgYnVmdTMyWzBdID0gaWRcbiAgICBidWZ1MTZbMl0gPSBvcGNvZGVcbiAgICBidWZ1MTZbM10gPSBzaXplXG4gICAgd2lyZU1zZy5idWZmZXJPZmZzZXQgPSA4XG5cbiAgICAvLyB3cml0ZSBhY3R1YWwgYXJndW1lbnQgdmFsdWUgdG8gYnVmZmVyXG4gICAgYXJnc0FycmF5LmZvckVhY2goKGFyZykgPT4gYXJnLl9tYXJzaGFsbEFyZyh3aXJlTXNnKSlcbiAgICB0aGlzLm9uU2VuZCh3aXJlTXNnKVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBfaWRsZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBmb3IgKGNvbnN0IGlkbGVIYW5kbGVyIG9mIHRoaXMuX2lkbGVIYW5kbGVycykge1xuICAgICAgYXdhaXQgaWRsZUhhbmRsZXIoKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgcmVjZWl2ZWQgd2lyZSBtZXNzYWdlcy5cbiAgICovXG4gIGFzeW5jIG1lc3NhZ2UoaW5jb21pbmdXaXJlTWVzc2FnZXM6IHsgYnVmZmVyOiBVaW50MzJBcnJheSwgZmRzOiBBcnJheTxXZWJGRD4gfSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gbW9yZSB0aGFuIG9uZSBtZXNzYWdlIGluIHF1ZXVlIG1lYW5zIHRoZSBtZXNzYWdlIGxvb3AgaXMgaW4gYXdhaXQsIGRvbid0IGNvbmN1cnJlbnRseSBwcm9jZXNzIHRoZSBuZXdcbiAgICAvLyBtZXNzYWdlLCBpbnN0ZWFkIHJldHVybiBlYXJseSBhbmQgbGV0IHRoZSByZXN1bWUtZnJvbS1hd2FpdCBwaWNrIHVwIHRoZSBuZXdseSBxdWV1ZWQgbWVzc2FnZS5cbiAgICBpZiAodGhpcy5faW5NZXNzYWdlcy5wdXNoKHtcbiAgICAgIC4uLmluY29taW5nV2lyZU1lc3NhZ2VzLCBidWZmZXJPZmZzZXQ6IDAsXG4gICAgICBjb25zdW1lZDogMCxcbiAgICAgIHNpemU6IDBcbiAgICB9KSA+IDEpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHdoaWxlICh0aGlzLl9pbk1lc3NhZ2VzLmxlbmd0aCkge1xuICAgICAgY29uc3Qgd2lyZU1lc3NhZ2VzID0gdGhpcy5faW5NZXNzYWdlc1swXVxuICAgICAgd2hpbGUgKHdpcmVNZXNzYWdlcy5idWZmZXJPZmZzZXQgPCB3aXJlTWVzc2FnZXMuYnVmZmVyLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBpZCA9IHdpcmVNZXNzYWdlcy5idWZmZXJbd2lyZU1lc3NhZ2VzLmJ1ZmZlck9mZnNldF1cbiAgICAgICAgY29uc3Qgc2l6ZU9wY29kZSA9IHdpcmVNZXNzYWdlcy5idWZmZXJbd2lyZU1lc3NhZ2VzLmJ1ZmZlck9mZnNldCArIDFdXG4gICAgICAgIHdpcmVNZXNzYWdlcy5zaXplID0gc2l6ZU9wY29kZSA+Pj4gMTZcbiAgICAgICAgY29uc3Qgb3Bjb2RlID0gc2l6ZU9wY29kZSAmIDB4MDAwMEZGRkZcblxuICAgICAgICBpZiAod2lyZU1lc3NhZ2VzLnNpemUgPiB3aXJlTWVzc2FnZXMuYnVmZmVyLmJ5dGVMZW5ndGgpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlcXVlc3QgYnVmZmVyIHRvbyBzbWFsbCcpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB3bE9iamVjdCA9IHRoaXMud2xPYmplY3RzW2lkXVxuICAgICAgICBpZiAod2xPYmplY3QpIHtcbiAgICAgICAgICB3aXJlTWVzc2FnZXMuYnVmZmVyT2Zmc2V0ICs9IDJcbiAgICAgICAgICB3aXJlTWVzc2FnZXMuY29uc3VtZWQgPSA4XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGF3YWl0IHdsT2JqZWN0W29wY29kZV0od2lyZU1lc3NhZ2VzKVxuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFxud2xPYmplY3Q6ICR7d2xPYmplY3QuY29uc3RydWN0b3IubmFtZX1bJHtvcGNvZGV9XSguLilcbm5hbWU6ICR7ZS5uYW1lfSBtZXNzYWdlOiAke2UubWVzc2FnZX0gdGV4dDogJHtlLnRleHR9XG5lcnJvciBvYmplY3Qgc3RhY2s6XG4ke2Uuc3RhY2t9XG5gKVxuICAgICAgICAgICAgdGhpcy5jbG9zZSgpXG4gICAgICAgICAgICB0aHJvdyBlXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgaW52YWxpZCBvYmplY3QgJHtpZH1gKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLl9pbk1lc3NhZ2VzLnNoaWZ0KClcbiAgICB9XG5cbiAgICB0aGlzLmZsdXNoKClcblxuICAgIGF3YWl0IHRoaXMuX2lkbGUoKVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgZG9lc24ndCBhY3R1YWxseSBzZW5kIHRoZSBtZXNzYWdlLCBidXQgcXVldWVzIGl0IHNvIGl0IGNhbiBiZSBzZW5kIG9uIGZsdXNoLlxuICAgKi9cbiAgb25TZW5kKHdpcmVNc2c6IFNlbmRNZXNzYWdlKSB7XG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLl9vdXRNZXNzYWdlcy5wdXNoKHdpcmVNc2cpXG4gIH1cblxuICBmbHVzaCgpIHtcbiAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAodGhpcy5fb3V0TWVzc2FnZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLm9uRmx1c2g/Lih0aGlzLl9vdXRNZXNzYWdlcylcbiAgICB0aGlzLl9vdXRNZXNzYWdlcyA9IFtdXG4gIH1cblxuICBjbG9zZSgpIHtcbiAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIGRlc3Ryb3kgcmVzb3VyY2VzIGluIGRlc2NlbmRpbmcgb3JkZXJcbiAgICBPYmplY3QudmFsdWVzKHRoaXMud2xPYmplY3RzKS5zb3J0KChhLCBiKSA9PiBhLmlkIC0gYi5pZCkuZm9yRWFjaCgod2xPYmplY3QpID0+IHdsT2JqZWN0LmRlc3Ryb3koKSlcbiAgICB0aGlzLmNsb3NlZCA9IHRydWVcbiAgfVxuXG4gIHJlZ2lzdGVyV2xPYmplY3Qod2xPYmplY3Q6IFdsT2JqZWN0KSB7XG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKHdsT2JqZWN0LmlkIGluIHRoaXMud2xPYmplY3RzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYElsbGVnYWwgb2JqZWN0IGlkOiAke3dsT2JqZWN0LmlkfS4gQWxyZWFkeSByZWdpc3RlcmVkLmApXG4gICAgfVxuICAgIHRoaXMud2xPYmplY3RzW3dsT2JqZWN0LmlkXSA9IHdsT2JqZWN0XG4gIH1cblxuICB1bnJlZ2lzdGVyV2xPYmplY3Qod2xPYmplY3Q6IFdsT2JqZWN0KSB7XG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgZGVsZXRlIHRoaXMud2xPYmplY3RzW3dsT2JqZWN0LmlkXVxuICB9XG59XG4iXX0=

/***/ }),

/***/ "./node_modules/westfield-runtime-common/dist/index.js":
/*!*************************************************************!*\
  !*** ./node_modules/westfield-runtime-common/dist/index.js ***!
  \*************************************************************/
/*! exports provided: WlObject, Fixed, WebFD, uint, fileDescriptor, int, fixed, object, objectOptional, newObject, string, stringOptional, array, arrayOptional, u, i, f, oOptional, o, n, sOptional, s, aOptional, a, h, Connection */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Connection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Connection */ "./node_modules/westfield-runtime-common/dist/Connection.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WlObject", function() { return _Connection__WEBPACK_IMPORTED_MODULE_0__["WlObject"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Fixed", function() { return _Connection__WEBPACK_IMPORTED_MODULE_0__["Fixed"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebFD", function() { return _Connection__WEBPACK_IMPORTED_MODULE_0__["WebFD"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "uint", function() { return _Connection__WEBPACK_IMPORTED_MODULE_0__["uint"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "fileDescriptor", function() { return _Connection__WEBPACK_IMPORTED_MODULE_0__["fileDescriptor"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "int", function() { return _Connection__WEBPACK_IMPORTED_MODULE_0__["int"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "fixed", function() { return _Connection__WEBPACK_IMPORTED_MODULE_0__["fixed"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "object", function() { return _Connection__WEBPACK_IMPORTED_MODULE_0__["object"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "objectOptional", function() { return _Connection__WEBPACK_IMPORTED_MODULE_0__["objectOptional"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "newObject", function() { return _Connection__WEBPACK_IMPORTED_MODULE_0__["newObject"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "string", function() { return _Connection__WEBPACK_IMPORTED_MODULE_0__["string"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "stringOptional", function() { return _Connection__WEBPACK_IMPORTED_MODULE_0__["stringOptional"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "array", function() { return _Connection__WEBPACK_IMPORTED_MODULE_0__["array"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "arrayOptional", function() { return _Connection__WEBPACK_IMPORTED_MODULE_0__["arrayOptional"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "u", function() { return _Connection__WEBPACK_IMPORTED_MODULE_0__["u"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "i", function() { return _Connection__WEBPACK_IMPORTED_MODULE_0__["i"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "f", function() { return _Connection__WEBPACK_IMPORTED_MODULE_0__["f"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "oOptional", function() { return _Connection__WEBPACK_IMPORTED_MODULE_0__["oOptional"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "o", function() { return _Connection__WEBPACK_IMPORTED_MODULE_0__["o"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "n", function() { return _Connection__WEBPACK_IMPORTED_MODULE_0__["n"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "sOptional", function() { return _Connection__WEBPACK_IMPORTED_MODULE_0__["sOptional"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "s", function() { return _Connection__WEBPACK_IMPORTED_MODULE_0__["s"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "aOptional", function() { return _Connection__WEBPACK_IMPORTED_MODULE_0__["aOptional"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _Connection__WEBPACK_IMPORTED_MODULE_0__["a"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "h", function() { return _Connection__WEBPACK_IMPORTED_MODULE_0__["h"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Connection", function() { return _Connection__WEBPACK_IMPORTED_MODULE_0__["Connection"]; });


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsY0FBYyxjQUFjLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgKiBmcm9tICcuL0Nvbm5lY3Rpb24nXG4iXX0=

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var westfield_runtime_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! westfield-runtime-client */ "./node_modules/westfield-runtime-client/dist/index.js");
// Copyright 2020 Erik De Rijcke
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
// Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
// WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class ShmBufferPool {
    constructor(available) {
        this._busy = [];
        this._available = available;
        this._busy = [];
    }
    static create(webShm, poolSize, width, height) {
        const available = new Array(poolSize);
        const shmBufferPool = new ShmBufferPool(available);
        for (let i = 0; i < poolSize; i++) {
            available[i] = ShmBuffer.create(webShm, width, height, shmBufferPool);
        }
        return shmBufferPool;
    }
    give(shmBuffer) {
        const idx = this._busy.indexOf(shmBuffer);
        if (idx > -1) {
            this._busy.splice(idx, 1);
        }
        this._available.push(shmBuffer);
    }
    take() {
        const shmBuffer = this._available.shift();
        if (shmBuffer != null) {
            this._busy.push(shmBuffer);
            return shmBuffer;
        }
        return null;
    }
}
class ShmBuffer {
    constructor(proxy, bufferProxy, pixelContent, arrayBuffer, width, height, shmBufferPool) {
        this.proxy = proxy;
        this.bufferProxy = bufferProxy;
        this._pixelContent = pixelContent;
        this.arrayBuffer = arrayBuffer;
        this.width = width;
        this.height = height;
        this._shmBufferPool = shmBufferPool;
    }
    static create(webShm, width, height, webArrayBufferPool) {
        const arrayBuffer = new ArrayBuffer(height * width * Uint32Array.BYTES_PER_ELEMENT);
        const pixelContent = westfield_runtime_client__WEBPACK_IMPORTED_MODULE_0__["webFS"].fromArrayBuffer(arrayBuffer);
        const proxy = webShm.createWebArrayBuffer();
        const bufferProxy = webShm.createBuffer(proxy, width, height);
        const shmBuffer = new ShmBuffer(proxy, bufferProxy, pixelContent, arrayBuffer, width, height, webArrayBufferPool);
        proxy.listener = shmBuffer;
        bufferProxy.listener = shmBuffer;
        return shmBuffer;
    }
    attach() {
        this.proxy.attach(this._pixelContent);
    }
    detach(contents) {
        return __awaiter(this, void 0, void 0, function* () {
            this._pixelContent = contents;
            this.arrayBuffer = (yield contents.getTransferable());
        });
    }
    release() {
        this._shmBufferPool.give(this);
    }
}
class Window {
    constructor(registry, width, height) {
        this._registry = registry;
        this.width = width;
        this.height = height;
    }
    static create(width, height) {
        const registry = westfield_runtime_client__WEBPACK_IMPORTED_MODULE_0__["display"].getRegistry();
        const window = new Window(registry, width, height);
        registry.listener = window;
        return window;
    }
    global(name, interface_, version) {
        if (interface_ === westfield_runtime_client__WEBPACK_IMPORTED_MODULE_0__["WlCompositorProtocolName"]) {
            this._compositor = this._registry.bind(name, interface_, westfield_runtime_client__WEBPACK_IMPORTED_MODULE_0__["WlCompositorProxy"], version);
            this._surface = this._compositor.createSurface();
            this._onFrame = Object(westfield_runtime_client__WEBPACK_IMPORTED_MODULE_0__["frame"])(this._surface);
        }
        if (interface_ === westfield_runtime_client__WEBPACK_IMPORTED_MODULE_0__["GrWebShmProtocolName"]) {
            this._webShm = this._registry.bind(name, interface_, westfield_runtime_client__WEBPACK_IMPORTED_MODULE_0__["GrWebShmProxy"], version);
            this._shmBufferPool = ShmBufferPool.create(this._webShm, 2, this.width, this.height);
        }
        if (interface_ === westfield_runtime_client__WEBPACK_IMPORTED_MODULE_0__["WlShellProtocolName"]) {
            this._shell = this._registry.bind(name, interface_, westfield_runtime_client__WEBPACK_IMPORTED_MODULE_0__["WlShellProxy"], version);
        }
    }
    init() {
        if (this._shell === undefined) {
            westfield_runtime_client__WEBPACK_IMPORTED_MODULE_0__["display"].close();
            throw new Error('No shell proxy.');
        }
        if (this._surface === undefined) {
            westfield_runtime_client__WEBPACK_IMPORTED_MODULE_0__["display"].close();
            throw new Error('No surface proxy.');
        }
        this._shellSurface = this._shell.getShellSurface(this._surface);
        this._shellSurface.listener = this;
        this._shellSurface.setToplevel();
        this._shellSurface.setTitle('Simple Web Shm');
    }
    _paintPixels(shmBuffer, timestamp) {
        const halfh = shmBuffer.width >> 1;
        const halfw = shmBuffer.height >> 1;
        let ir;
        let or;
        const image = new Uint32Array(shmBuffer.arrayBuffer);
        /* squared radii thresholds */
        or = (halfw < halfh ? halfw : halfh) - 8;
        ir = or - 32;
        or = or * or;
        ir = ir * ir;
        let offset = 0;
        for (let y = 0; y < shmBuffer.height; y++) {
            const y2 = (y - halfh) * (y - halfh);
            for (let x = 0; x < shmBuffer.width; x++) {
                let v;
                let w = 0xff000000;
                /* squared distance from center */
                const r2 = (x - halfw) * (x - halfw) + y2;
                if (r2 < ir) {
                    v = ((r2 >> 5) + (timestamp >> 6)) * 0x0080401;
                }
                else if (r2 < or) {
                    v = (y + (timestamp >> 5)) * 0x0080401;
                }
                else {
                    v = (x + (timestamp >> 4)) * 0x0080401;
                }
                // ARGB => ABGR (RGBA LE)
                w |= ((v & 0x00ff0000) >> 16); // R
                w |= ((v & 0x0000ff00)); // G
                w |= ((v & 0x000000ff) << 16); // B
                image[offset++] = w;
            }
        }
    }
    draw(timestamp) {
        var _a;
        if (this._shmBufferPool === undefined) {
            westfield_runtime_client__WEBPACK_IMPORTED_MODULE_0__["display"].close();
            throw new Error('No shm buffer pool.');
        }
        if (this._surface === undefined) {
            westfield_runtime_client__WEBPACK_IMPORTED_MODULE_0__["display"].close();
            throw new Error('No surface proxy.');
        }
        const shmBuffer = this._shmBufferPool.take();
        if (shmBuffer) {
            this._paintPixels(shmBuffer, timestamp);
            shmBuffer.attach();
            this._surface.attach(shmBuffer.bufferProxy, 0, 0);
            this._surface.damage(0, 0, shmBuffer.width, shmBuffer.height);
            // Wait for the compositor to signal that we can draw the next frame.
            // Note that using 'await' here would result in a deadlock as the event loop would be blocked, and the event
            // that resolves the await state would never be picked up by the blocked event loop.
            (_a = this._onFrame) === null || _a === void 0 ? void 0 : _a.call(this).then(timestamp => this.draw(timestamp));
            // serial is only required if our buffer contents would take a long time to send to the compositor ie. in a network remote case
            this._surface.commit(0);
        }
        else {
            console.error('All buffers occupied by compositor!');
            westfield_runtime_client__WEBPACK_IMPORTED_MODULE_0__["display"].close();
        }
    }
    globalRemove(name) {
        // FIXME keep track of the name number of the globals we bind so we can do cleanup if a global should go away.
    }
    configure(edges, width, height) {
    }
    ping(serial) {
        if (this._shellSurface === undefined) {
            throw new Error('No shell surface proxy.');
        }
        this._shellSurface.pong(serial);
    }
    popupDone() {
    }
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // create a new window with some buffers
        const window = Window.create(250, 250);
        // create a sync promise
        const syncPromise = westfield_runtime_client__WEBPACK_IMPORTED_MODULE_0__["display"].sync();
        // flush out window creation & sync requests to the compositor
        westfield_runtime_client__WEBPACK_IMPORTED_MODULE_0__["display"].flush();
        // wait for compositor to have processed all our outgoing requests
        yield syncPromise;
        // Now begin drawing after the compositor is done processing all our requests
        window.init();
        window.draw(0);
        // wait for the display connection to close
        try {
            yield westfield_runtime_client__WEBPACK_IMPORTED_MODULE_0__["display"].onClose();
            console.log('Application exit.');
        }
        catch (e) {
            console.error('Application terminated with error.');
            console.error(e.stackTrace);
        }
    });
}
main();


/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/erik/git/greenfield/client-demos/simple-web-shm/src/index.ts */"./src/index.ts");


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3dlc3RmaWVsZC1ydW50aW1lLWNsaWVudC9kaXN0L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy93ZXN0ZmllbGQtcnVudGltZS1jbGllbnQvZGlzdC9wcm90b2NvbC9ncl93ZWJfZ2wuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3dlc3RmaWVsZC1ydW50aW1lLWNsaWVudC9kaXN0L3Byb3RvY29sL2dyX3dlYl9zaG0uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3dlc3RmaWVsZC1ydW50aW1lLWNsaWVudC9kaXN0L3Byb3RvY29sL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy93ZXN0ZmllbGQtcnVudGltZS1jbGllbnQvZGlzdC9wcm90b2NvbC93YXlsYW5kLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy93ZXN0ZmllbGQtcnVudGltZS1jbGllbnQvZGlzdC9wcm90b2NvbC94ZGdfc2hlbGwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3dlc3RmaWVsZC1ydW50aW1lLWNsaWVudC9kaXN0L3dlc3RmaWVsZC1ydW50aW1lLWNsaWVudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvd2VzdGZpZWxkLXJ1bnRpbWUtY29tbW9uL2Rpc3QvQ29ubmVjdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvd2VzdGZpZWxkLXJ1bnRpbWUtY29tbW9uL2Rpc3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7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QTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBMEI7QUFDRTtBQUNDO0FBQ0Q7QUFDNUIsaUM7Ozs7Ozs7Ozs7OztBQ0pBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLGtDQUFrQztBQUNuQztB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QUNBO0FBQ0E7QUFDQSxvQ0FBb0MscUVBQUk7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsdUVBQU0sUUFBUSxxRUFBSTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyx1RUFBTSxRQUFRLHFFQUFJLFVBQVUscUVBQUk7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLHVFQUFNLFVBQVUsb0VBQUcsS0FBSyxvRUFBRyxLQUFLLHFFQUFJO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MscUVBQUksVUFBVSxxRUFBSSxhQUFhLCtFQUFjO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyx1RUFBTSxRQUFRLHFFQUFJLFVBQVUsdUVBQU0sVUFBVSxvRUFBRyxLQUFLLG9FQUFHLEtBQUsscUVBQUk7QUFDcEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRCxpREFBeUIsR0FBRywwRUFBUztBQUMxRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLCtFQUFjO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQywrRUFBYztBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxxRUFBSTtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxvRUFBRztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLGdDQUFnQywrREFBSztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLG9FQUFHLEtBQUssb0VBQUc7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyx1RUFBTTtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyx1RUFBTTtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MscUVBQUk7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9EO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLHFFQUFJO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxxRUFBSTtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxvRUFBRyxLQUFLLG9FQUFHO0FBQy9DO0FBQ0E7QUFDTztBQUNBO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsZ0RBQWdEO0FBQzFDO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLGtEQUFrRDtBQUM1QztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxvREFBb0Q7QUFDOUM7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyw4RUFBOEU7QUFDL0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyw4QkFBOEIsK0RBQUs7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFELGtEQUEwQixHQUFHLDBFQUFTO0FBQzNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFELCtDQUF1QixHQUFHLDBFQUFTLElBQUksK0VBQWMsVUFBVSx1RUFBTTtBQUMxSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxvRUFBRyxLQUFLLG9FQUFHLEtBQUssb0VBQUcsU0FBUyxvRUFBRztBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MscUVBQUk7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwRkFBMEYsa0VBQUM7QUFDM0YsU0FBUztBQUNUO0FBQ0E7QUFDTztBQUNBO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLDBDQUEwQztBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sK0JBQStCLCtEQUFLO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsK0VBQWM7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLHVFQUFNO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLHVFQUFNO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLHVFQUFNLFFBQVEscUVBQUksVUFBVSxvRUFBRyxLQUFLLG9FQUFHO0FBQzNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyx1RUFBTSxRQUFRLHFFQUFJO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsdUVBQU0sUUFBUSxxRUFBSSxVQUFVLHFFQUFJO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxvRUFBRyxTQUFTLG9FQUFHO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxvRUFBRyxTQUFTLG9FQUFHO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLCtFQUFjO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEZBQTBGLGtFQUFDLFdBQVcsa0VBQUMsV0FBVyxrRUFBQztBQUNuSCxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087QUFDQTtBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxzREFBc0Q7QUFDaEQ7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyw0Q0FBNEM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyw0QkFBNEIsK0RBQUs7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLHVFQUFNLFFBQVEscUVBQUk7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwRkFBMEYsa0VBQUMsV0FBVyxrRUFBQyxXQUFXLGtFQUFDLFdBQVcsa0VBQUM7QUFDL0gsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ0E7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxzQ0FBc0M7QUFDdkMscUM7Ozs7Ozs7Ozs7OztBQ3ZyQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQUFpQixTQUFJLElBQUksU0FBSTtBQUM3QiwyQkFBMkIsK0RBQStELGdCQUFnQixFQUFFLEVBQUU7QUFDOUc7QUFDQSxtQ0FBbUMsTUFBTSw2QkFBNkIsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNqRyxrQ0FBa0MsTUFBTSxpQ0FBaUMsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNwRywrQkFBK0IscUZBQXFGO0FBQ3BIO0FBQ0EsS0FBSztBQUNMO0FBQzZGO0FBQ3RGLG9CQUFvQixpRUFBUTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVFQUF1RSwwRUFBUztBQUNoRjtBQUNBO0FBQ0EsdUVBQXVFLDBFQUFTO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0ZBQXNGLGtFQUFDLDZCQUE2QixrRUFBQyxXQUFXLGtFQUFDO0FBQ2pJLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlGQUF5RixrRUFBQztBQUMxRixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtFQUFrRSxxRUFBSSxRQUFRLHVFQUFNLGNBQWMscUVBQUksV0FBVywwRUFBUztBQUMxSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVGQUF1RixrRUFBQyxXQUFXLGtFQUFDLFdBQVcsa0VBQUM7QUFDaEgsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkZBQTZGLGtFQUFDO0FBQzlGLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFGQUFxRixrRUFBQztBQUN0RixTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtEQUErRCx1QkFBdUIsUUFBUSxTQUFTLFVBQVUsS0FBSyxhQUFhLFFBQVE7QUFDM0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLEdBQUc7QUFDakQ7QUFDQTtBQUNBLDBCQUEwQiw4REFBSztBQUMvQjtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QyxHQUFHO0FBQ2pEO0FBQ0E7QUFDQSwwQkFBMEIsOERBQUs7QUFDL0I7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsR0FBRztBQUNqRDtBQUNBO0FBQ0EsMEJBQTBCLDhEQUFLO0FBQy9CO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvRDs7Ozs7Ozs7Ozs7O0FDdk5BO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQUFpQixTQUFJLElBQUksU0FBSTtBQUM3QiwyQkFBMkIsK0RBQStELGdCQUFnQixFQUFFLEVBQUU7QUFDOUc7QUFDQSxtQ0FBbUMsTUFBTSw2QkFBNkIsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNqRyxrQ0FBa0MsTUFBTSxpQ0FBaUMsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNwRywrQkFBK0IscUZBQXFGO0FBQ3BIO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQSxrQkFBa0IsSUFBSTtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsWUFBWTtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0Esd0JBQXdCLElBQUk7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLFlBQVk7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQWlELElBQUk7QUFDckQ7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLElBQUk7QUFDakQ7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNB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NUU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLGdFQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBLFlBQVksZ0VBQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0EsMkJBQTJCLHFCQUFxQjtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDO0FBQzlDLHdDQUF3QztBQUN4Qyw4Q0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLGdFQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBLFlBQVksZ0VBQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksZ0VBQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLGdFQUFPO0FBQ25DO0FBQ0EsUUFBUSxnRUFBTztBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLGdFQUFPO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL1wiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG4iLCIvKlxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDIwIEVyaWsgRGUgUmlqY2tlXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuICBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbiAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuKi9cbid1c2Ugc3RyaWN0JztcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuaW1wb3J0IHsgQ29ubmVjdGlvbiB9IGZyb20gJ3dlc3RmaWVsZC1ydW50aW1lLWNvbW1vbic7XG5pbXBvcnQgeyBEaXNwbGF5SW1wbCwgUHJveHksIFdlYkZTIH0gZnJvbSAnLi93ZXN0ZmllbGQtcnVudGltZS1jbGllbnQnO1xuY29uc3Qgd2ViRlMgPSBXZWJGUy5jcmVhdGUoX3V1aWR2NCgpKTtcbmNvbnN0IGNvbm5lY3Rpb24gPSBuZXcgQ29ubmVjdGlvbigpO1xuY29uc3QgZGlzcGxheSA9IG5ldyBEaXNwbGF5SW1wbChjb25uZWN0aW9uKTtcbmZ1bmN0aW9uIF91dWlkdjQoKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHJldHVybiAoWzFlN10gKyAtMWUzICsgLTRlMyArIC04ZTMgKyAtMWUxMSkucmVwbGFjZSgvWzAxOF0vZywgYyA9PiAoYyBeIHNlbGYuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheSgxKSlbMF0gJiAxNSA+PiBjIC8gNCkudG9TdHJpbmcoMTYpKTtcbn1cbmZ1bmN0aW9uIF9zZXR1cE1lc3NhZ2VIYW5kbGluZyhkaXNwbGF5LCBjb25uZWN0aW9uLCB3ZWJGUykge1xuICAgIGNvbnN0IF9mbHVzaFF1ZXVlID0gW107XG4gICAgb25tZXNzYWdlID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGlmIChjb25uZWN0aW9uLmNsb3NlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHdlYldvcmtlck1lc3NhZ2UgPSBldmVudC5kYXRhO1xuICAgICAgICBpZiAod2ViV29ya2VyTWVzc2FnZS5wcm90b2NvbE1lc3NhZ2UgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgICAgICAgICAgY29uc3QgYnVmZmVyID0gbmV3IFVpbnQzMkFycmF5KC8qKiBAdHlwZSB7QXJyYXlCdWZmZXJ9ICovIHdlYldvcmtlck1lc3NhZ2UucHJvdG9jb2xNZXNzYWdlKTtcbiAgICAgICAgICAgIGNvbnN0IGZkcyA9IHdlYldvcmtlck1lc3NhZ2UubWV0YS5tYXAodHJhbnNmZXJhYmxlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodHJhbnNmZXJhYmxlIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHdlYkZTLmZyb21BcnJheUJ1ZmZlcih0cmFuc2ZlcmFibGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0cmFuc2ZlcmFibGUgaW5zdGFuY2VvZiBJbWFnZUJpdG1hcCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gd2ViRlMuZnJvbUltYWdlQml0bWFwKHRyYW5zZmVyYWJsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRyYW5zZmVyYWJsZSBpbnN0YW5jZW9mIE9mZnNjcmVlbkNhbnZhcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gd2ViRlMuZnJvbU9mZnNjcmVlbkNhbnZhcyh0cmFuc2ZlcmFibGUpO1xuICAgICAgICAgICAgICAgIH0gLy8gZWxzZSBpZiAodHJhbnNmZXJhYmxlIGluc3RhbmNlb2YgTWVzc2FnZVBvcnQpIHtcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ09NUE9TSVRPUiBCVUc/IFVuc3VwcG9ydGVkIHRyYW5zZmVyYWJsZSByZWNlaXZlZCBmcm9tIGNvbXBvc2l0b3I6ICR7dHJhbnNmZXJhYmxlfS5gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29ubmVjdGlvbi5tZXNzYWdlKHsgYnVmZmVyLCBmZHMgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGlmIChkaXNwbGF5LmVycm9ySGFuZGxlciAmJiB0eXBlb2YgZGlzcGxheS5lcnJvckhhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheS5lcnJvckhhbmRsZXIoZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdcXHRuYW1lOiAnICsgZS5uYW1lICsgJyBtZXNzYWdlOiAnICsgZS5tZXNzYWdlICsgJyB0ZXh0OiAnICsgZS50ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignZXJyb3Igb2JqZWN0IHN0YWNrOiAnKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBbd2ViLXdvcmtlci1jbGllbnRdIHNlcnZlciBzZW5kIGFuIGlsbGVnYWwgbWVzc2FnZS5gKTtcbiAgICAgICAgICAgIGNvbm5lY3Rpb24uY2xvc2UoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgY29ubmVjdGlvbi5vbkZsdXNoID0gKHdpcmVNZXNzYWdlcykgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBfZmx1c2hRdWV1ZS5wdXNoKHdpcmVNZXNzYWdlcyk7XG4gICAgICAgIGlmIChfZmx1c2hRdWV1ZS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKF9mbHVzaFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3Qgc2VuZFdpcmVNZXNzYWdlcyA9IF9mbHVzaFF1ZXVlWzBdO1xuICAgICAgICAgICAgLy8gY29udmVydCB0byBzaW5nbGUgYXJyYXlCdWZmZXIgc28gaXQgY2FuIGJlIHNlbmQgb3ZlciBhIGRhdGEgY2hhbm5lbCB1c2luZyB6ZXJvIGNvcHkgc2VtYW50aWNzLlxuICAgICAgICAgICAgY29uc3QgbWVzc2FnZXNTaXplID0gc2VuZFdpcmVNZXNzYWdlcy5yZWR1Y2UoKHByZXZpb3VzVmFsdWUsIGN1cnJlbnRWYWx1ZSkgPT4gcHJldmlvdXNWYWx1ZSArIGN1cnJlbnRWYWx1ZS5idWZmZXIuYnl0ZUxlbmd0aCwgMCk7XG4gICAgICAgICAgICBjb25zdCBzZW5kQnVmZmVyID0gbmV3IFVpbnQzMkFycmF5KG5ldyBBcnJheUJ1ZmZlcihtZXNzYWdlc1NpemUpKTtcbiAgICAgICAgICAgIGxldCBvZmZzZXQgPSAwO1xuICAgICAgICAgICAgY29uc3QgbWV0YSA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCB3aXJlTWVzc2FnZSBvZiBzZW5kV2lyZU1lc3NhZ2VzKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB3ZWJGZCBvZiB3aXJlTWVzc2FnZS5mZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHJhbnNmZXJhYmxlID0geWllbGQgd2ViRmQuZ2V0VHJhbnNmZXJhYmxlKCk7XG4gICAgICAgICAgICAgICAgICAgIG1ldGEucHVzaCh0cmFuc2ZlcmFibGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gbmV3IFVpbnQzMkFycmF5KHdpcmVNZXNzYWdlLmJ1ZmZlcik7XG4gICAgICAgICAgICAgICAgc2VuZEJ1ZmZlci5zZXQobWVzc2FnZSwgb2Zmc2V0KTtcbiAgICAgICAgICAgICAgICBvZmZzZXQgKz0gbWVzc2FnZS5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHsgcHJvdG9jb2xNZXNzYWdlOiBzZW5kQnVmZmVyLmJ1ZmZlciwgbWV0YSB9LCBbc2VuZEJ1ZmZlci5idWZmZXIsIC4uLm1ldGFdKTtcbiAgICAgICAgICAgIF9mbHVzaFF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbl9zZXR1cE1lc3NhZ2VIYW5kbGluZyhkaXNwbGF5LCBjb25uZWN0aW9uLCB3ZWJGUyk7XG5mdW5jdGlvbiBmcmFtZSh3bFN1cmZhY2VQcm94eSkge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHdsQ2FsbGJhY2tQcm94eSA9IHdsU3VyZmFjZVByb3h5LmZyYW1lKCk7XG4gICAgICAgICAgICB3bENhbGxiYWNrUHJveHkubGlzdGVuZXIgPSB7XG4gICAgICAgICAgICAgICAgZG9uZTogKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgd2xDYWxsYmFja1Byb3h5LmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICB9O1xufVxuZXhwb3J0IHsgd2ViRlMsIGRpc3BsYXksIGZyYW1lLCBQcm94eSB9O1xuZXhwb3J0ICogZnJvbSAnLi9wcm90b2NvbCc7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCIvKlxuICpcbiAqICAgICAgICBDb3B5cmlnaHQgwqkgMjAxOSBFcmlrIERlIFJpamNrZVxuICpcbiAqICAgICAgICBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogICAgICAgIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzXG4gKiAgICAgICAgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogICAgICAgIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiAgICAgICAgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqICAgICAgICBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogICAgICAgIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqICAgICAgICBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSAoaW5jbHVkaW5nIHRoZVxuICogICAgICAgIG5leHQgcGFyYWdyYXBoKSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsXG4gKiAgICAgICAgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqICAgICAgICBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogICAgICAgIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuICogICAgICAgIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG4gKiAgICAgICAgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSU1xuICogICAgICAgIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTlxuICogICAgICAgIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOXG4gKiAgICAgICAgQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuICogICAgICAgIFNPRlRXQVJFLlxuICpcbiAqL1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5pbXBvcnQgeyBvYmplY3QsIG5ld09iamVjdCwgaCB9IGZyb20gJ3dlc3RmaWVsZC1ydW50aW1lLWNvbW1vbic7XG5pbXBvcnQgKiBhcyBXZXN0ZmllbGQgZnJvbSAnLic7XG5pbXBvcnQgeyBQcm94eSB9IGZyb20gJy4uL3dlc3RmaWVsZC1ydW50aW1lLWNsaWVudCc7XG5leHBvcnQgY2xhc3MgR3JXZWJHbEJ1ZmZlclByb3h5IGV4dGVuZHMgUHJveHkge1xuICAgIC8qKlxuICAgICAqIERvIG5vdCBjb25zdHJ1Y3QgcHJveGllcyBkaXJlY3RseS4gSW5zdGVhZCB1c2Ugb25lIG9mIHRoZSBmYWN0b3J5IG1ldGhvZHMgZnJvbSBvdGhlciBwcm94aWVzLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKSB7XG4gICAgICAgIHN1cGVyKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKTtcbiAgICB9XG4gICAgWzBdKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgKChfYSA9IHRoaXMubGlzdGVuZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5vZmZzY3JlZW5DYW52YXMoaChtZXNzYWdlKSkpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnQgY29uc3QgR3JXZWJHbEJ1ZmZlclByb3RvY29sTmFtZSA9ICdncl93ZWJfZ2xfYnVmZmVyJztcbi8qKlxuICpcbiAqICAgICAgICAgICAgQSBzaW5nbGV0b24gZ2xvYmFsIG9iamVjdCB0aGF0IHByb3ZpZGVzIHN1cHBvcnQgZm9yIHdlYiBnbC5cbiAqXG4gKiAgICAgICAgICAgIENsaWVudHMgY2FuIGNyZWF0ZSB3bF9idWZmZXIgb2JqZWN0cyB1c2luZyB0aGUgY3JlYXRlX2J1ZmZlciByZXF1ZXN0LlxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIEdyV2ViR2xQcm94eSBleHRlbmRzIFByb3h5IHtcbiAgICAvKipcbiAgICAgKiBEbyBub3QgY29uc3RydWN0IHByb3hpZXMgZGlyZWN0bHkuIEluc3RlYWQgdXNlIG9uZSBvZiB0aGUgZmFjdG9yeSBtZXRob2RzIGZyb20gb3RoZXIgcHJveGllcy5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihkaXNwbGF5LCBjb25uZWN0aW9uLCBpZCkge1xuICAgICAgICBzdXBlcihkaXNwbGF5LCBjb25uZWN0aW9uLCBpZCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICogICAgICAgICAgICAgICAgQ3JlYXRlIGEgd2ViX2dsX2J1ZmZlciBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgY3JlYXRlV2ViR2xCdWZmZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXJzaGFsbENvbnN0cnVjdG9yKHRoaXMuaWQsIDAsIFdlc3RmaWVsZC5HcldlYkdsQnVmZmVyUHJveHksIFtuZXdPYmplY3QoKV0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqICAgICAgICAgICAgICAgIENyZWF0ZSBhIHdsX2J1ZmZlciBvYmplY3QgZnJvbSBhIGdyX3dlYl9nbF9idWZmZXIgc28gaXQgY2FuIGJlIHVzZWQgd2l0aCBhIHN1cmZhY2UuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgY3JlYXRlQnVmZmVyKGdyV2ViR2xCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hcnNoYWxsQ29uc3RydWN0b3IodGhpcy5pZCwgMSwgV2VzdGZpZWxkLldsQnVmZmVyUHJveHksIFtuZXdPYmplY3QoKSwgb2JqZWN0KGdyV2ViR2xCdWZmZXIpXSk7XG4gICAgfVxufVxuZXhwb3J0IGNvbnN0IEdyV2ViR2xQcm90b2NvbE5hbWUgPSAnZ3Jfd2ViX2dsJztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdyX3dlYl9nbC5qcy5tYXAiLCIvKlxuICpcbiAqICAgICAgICBDb3B5cmlnaHQgwqkgMjAxOSBFcmlrIERlIFJpamNrZVxuICpcbiAqICAgICAgICBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogICAgICAgIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzXG4gKiAgICAgICAgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogICAgICAgIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiAgICAgICAgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqICAgICAgICBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogICAgICAgIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqICAgICAgICBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSAoaW5jbHVkaW5nIHRoZVxuICogICAgICAgIG5leHQgcGFyYWdyYXBoKSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsXG4gKiAgICAgICAgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqICAgICAgICBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogICAgICAgIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuICogICAgICAgIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG4gKiAgICAgICAgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSU1xuICogICAgICAgIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTlxuICogICAgICAgIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOXG4gKiAgICAgICAgQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuICogICAgICAgIFNPRlRXQVJFLlxuICpcbiAqL1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5pbXBvcnQgeyBmaWxlRGVzY3JpcHRvciwgaW50LCBvYmplY3QsIG5ld09iamVjdCwgaCB9IGZyb20gJ3dlc3RmaWVsZC1ydW50aW1lLWNvbW1vbic7XG5pbXBvcnQgKiBhcyBXZXN0ZmllbGQgZnJvbSAnLic7XG5pbXBvcnQgeyBQcm94eSB9IGZyb20gJy4uL3dlc3RmaWVsZC1ydW50aW1lLWNsaWVudCc7XG5leHBvcnQgY2xhc3MgR3JXZWJTaG1CdWZmZXJQcm94eSBleHRlbmRzIFByb3h5IHtcbiAgICAvKipcbiAgICAgKiBEbyBub3QgY29uc3RydWN0IHByb3hpZXMgZGlyZWN0bHkuIEluc3RlYWQgdXNlIG9uZSBvZiB0aGUgZmFjdG9yeSBtZXRob2RzIGZyb20gb3RoZXIgcHJveGllcy5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihkaXNwbGF5LCBjb25uZWN0aW9uLCBpZCkge1xuICAgICAgICBzdXBlcihkaXNwbGF5LCBjb25uZWN0aW9uLCBpZCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICogICAgICAgICAgICAgICAgQXR0YWNoZXMgYW4gSFRNTDUgYXJyYXkgYnVmZmVyIHRvIHRoZSBjb21wb3NpdG9yLiBBZnRlciBhdHRhY2hpbmcsIHRoZSBhcnJheSBidWZmZXIgb3duZXJzaGlwIGlzIHBhc3NlZFxuICAgICAqICAgICAgICAgICAgICAgIHRvIHRoZSBjb21wb3NpdG9yIG1haW4gdGhyZWFkLiBUaGUgYXJyYXkgYnVmZmVyIGNhbiBub3QgYmUgdXNlZCBmb3Igd3JpdGluZyBhbnltb3JlIGJ5IHRoZSBjbGllbnQgYXNcbiAgICAgKiAgICAgICAgICAgICAgICBwZXIgSFRNTDUgVHJhbnNmZXJhYmxlIG9iamVjdHMgc3BlYy5cbiAgICAgKlxuICAgICAqICAgICAgICAgICAgICAgIFRoZSBwaXhlbCBmb3JtYXQgb2YgdGhlIGF0dGFjaGVkIGFycmF5IGJ1ZmZlciBtdXN0IGFsd2F5cyBiZSBSR0JBODg4OCBhcyBwZXIgSFRNTDUgSW1hZ2VEYXRhIHNwZWMuXG4gICAgICogICAgICAgICAgICAgICAgU3RyaWRlIG11c3QgYWx3YXlzIGVxdWFsIHdpZHRoLlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIGF0dGFjaChjb250ZW50cykge1xuICAgICAgICB0aGlzLl9tYXJzaGFsbCh0aGlzLmlkLCAwLCBbZmlsZURlc2NyaXB0b3IoY29udGVudHMpXSk7XG4gICAgfVxuICAgIFswXShtZXNzYWdlKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHlpZWxkICgoX2EgPSB0aGlzLmxpc3RlbmVyKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZGV0YWNoKGgobWVzc2FnZSkpKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0IGNvbnN0IEdyV2ViU2htQnVmZmVyUHJvdG9jb2xOYW1lID0gJ2dyX3dlYl9zaG1fYnVmZmVyJztcbi8qKlxuICpcbiAqICAgICAgICAgICAgQSBzaW5nbGV0b24gZ2xvYmFsIG9iamVjdCB0aGF0IHByb3ZpZGVzIHN1cHBvcnQgZm9yIHNoYXJlZCBtZW1vcnkgdGhyb3VnaCBIVE1MNSBhcnJheSBidWZmZXJzLlxuICpcbiAqICAgICAgICAgICAgQ2xpZW50cyBjYW4gY3JlYXRlIHdsX2J1ZmZlciBvYmplY3RzIHVzaW5nIHRoZSBjcmVhdGVfYnVmZmVyIHJlcXVlc3QuXG4gKlxuICovXG5leHBvcnQgY2xhc3MgR3JXZWJTaG1Qcm94eSBleHRlbmRzIFByb3h5IHtcbiAgICAvKipcbiAgICAgKiBEbyBub3QgY29uc3RydWN0IHByb3hpZXMgZGlyZWN0bHkuIEluc3RlYWQgdXNlIG9uZSBvZiB0aGUgZmFjdG9yeSBtZXRob2RzIGZyb20gb3RoZXIgcHJveGllcy5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihkaXNwbGF5LCBjb25uZWN0aW9uLCBpZCkge1xuICAgICAgICBzdXBlcihkaXNwbGF5LCBjb25uZWN0aW9uLCBpZCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICogICAgICAgICAgICAgICAgQ3JlYXRlIGEgZ3Jfd2ViX3NobV9idWZmZXIgb2JqZWN0LlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIGNyZWF0ZVdlYkFycmF5QnVmZmVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWFyc2hhbGxDb25zdHJ1Y3Rvcih0aGlzLmlkLCAwLCBXZXN0ZmllbGQuR3JXZWJTaG1CdWZmZXJQcm94eSwgW25ld09iamVjdCgpXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICogICAgICAgICAgICAgICAgQ3JlYXRlIGEgd2xfYnVmZmVyIG9iamVjdCBmcm9tIGEgd2ViX2FycmF5X2J1ZmZlciBzbyBpdCBjYW4gYmUgdXNlZCB3aXRoIGEgc3VyZmFjZS5cbiAgICAgKlxuICAgICAqIEBzaW5jZSAxXG4gICAgICpcbiAgICAgKi9cbiAgICBjcmVhdGVCdWZmZXIod2ViQXJyYXlCdWZmZXIsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hcnNoYWxsQ29uc3RydWN0b3IodGhpcy5pZCwgMSwgV2VzdGZpZWxkLldsQnVmZmVyUHJveHksIFtuZXdPYmplY3QoKSwgb2JqZWN0KHdlYkFycmF5QnVmZmVyKSwgaW50KHdpZHRoKSwgaW50KGhlaWdodCldKTtcbiAgICB9XG59XG5leHBvcnQgY29uc3QgR3JXZWJTaG1Qcm90b2NvbE5hbWUgPSAnZ3Jfd2ViX3NobSc7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ncl93ZWJfc2htLmpzLm1hcCIsImV4cG9ydCAqIGZyb20gJy4vd2F5bGFuZCc7XG5leHBvcnQgKiBmcm9tICcuL2dyX3dlYl9nbCc7XG5leHBvcnQgKiBmcm9tICcuL2dyX3dlYl9zaG0nO1xuZXhwb3J0ICogZnJvbSAnLi94ZGdfc2hlbGwnO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiLypcbiAqXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAwOC0yMDExIEtyaXN0aWFuIEjDuGdzYmVyZ1xuICogICAgQ29weXJpZ2h0IMKpIDIwMTAtMjAxMSBJbnRlbCBDb3Jwb3JhdGlvblxuICogICAgQ29weXJpZ2h0IMKpIDIwMTItMjAxMyBDb2xsYWJvcmEsIEx0ZC5cbiAqXG4gKiAgICBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogICAgb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXNcbiAqICAgICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqICAgIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiAgICBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogICAgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqICAgIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqICAgIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIChpbmNsdWRpbmcgdGhlXG4gKiAgICBuZXh0IHBhcmFncmFwaCkgc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbFxuICogICAgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqICAgIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiAgICBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0ZcbiAqICAgIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG4gKiAgICBOT05JTkZSSU5HRU1FTlQuICBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSU1xuICogICAgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOXG4gKiAgICBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTlxuICogICAgQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuICogICAgU09GVFdBUkUuXG4gKlxuICovXG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmltcG9ydCB7IGZpbGVEZXNjcmlwdG9yLCB1aW50LCBpbnQsIG9iamVjdCwgb2JqZWN0T3B0aW9uYWwsIG5ld09iamVjdCwgc3RyaW5nLCBzdHJpbmdPcHRpb25hbCwgdSwgaSwgZiwgb09wdGlvbmFsLCBvLCBuLCBzT3B0aW9uYWwsIHMsIGEsIGggfSBmcm9tICd3ZXN0ZmllbGQtcnVudGltZS1jb21tb24nO1xuaW1wb3J0ICogYXMgV2VzdGZpZWxkIGZyb20gJy4nO1xuaW1wb3J0IHsgUHJveHkgfSBmcm9tICcuLi93ZXN0ZmllbGQtcnVudGltZS1jbGllbnQnO1xuLyoqXG4gKlxuICogICAgICBUaGUgY29yZSBnbG9iYWwgb2JqZWN0LiAgVGhpcyBpcyBhIHNwZWNpYWwgc2luZ2xldG9uIG9iamVjdC4gIEl0XG4gKiAgICAgIGlzIHVzZWQgZm9yIGludGVybmFsIFdheWxhbmQgcHJvdG9jb2wgZmVhdHVyZXMuXG4gKlxuICovXG5leHBvcnQgY2xhc3MgV2xEaXNwbGF5UHJveHkgZXh0ZW5kcyBQcm94eSB7XG4gICAgLyoqXG4gICAgICogRG8gbm90IGNvbnN0cnVjdCBwcm94aWVzIGRpcmVjdGx5LiBJbnN0ZWFkIHVzZSBvbmUgb2YgdGhlIGZhY3RvcnkgbWV0aG9kcyBmcm9tIG90aGVyIHByb3hpZXMuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZGlzcGxheSwgY29ubmVjdGlvbiwgaWQpIHtcbiAgICAgICAgc3VwZXIoZGlzcGxheSwgY29ubmVjdGlvbiwgaWQpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqXHRUaGUgc3luYyByZXF1ZXN0IGFza3MgdGhlIHNlcnZlciB0byBlbWl0IHRoZSAnZG9uZScgZXZlbnRcbiAgICAgKlx0b24gdGhlIHJldHVybmVkIHdsX2NhbGxiYWNrIG9iamVjdC4gIFNpbmNlIHJlcXVlc3RzIGFyZVxuICAgICAqXHRoYW5kbGVkIGluLW9yZGVyIGFuZCBldmVudHMgYXJlIGRlbGl2ZXJlZCBpbi1vcmRlciwgdGhpcyBjYW5cbiAgICAgKlx0YmUgdXNlZCBhcyBhIGJhcnJpZXIgdG8gZW5zdXJlIGFsbCBwcmV2aW91cyByZXF1ZXN0cyBhbmQgdGhlXG4gICAgICpcdHJlc3VsdGluZyBldmVudHMgaGF2ZSBiZWVuIGhhbmRsZWQuXG4gICAgICpcbiAgICAgKlx0VGhlIG9iamVjdCByZXR1cm5lZCBieSB0aGlzIHJlcXVlc3Qgd2lsbCBiZSBkZXN0cm95ZWQgYnkgdGhlXG4gICAgICpcdGNvbXBvc2l0b3IgYWZ0ZXIgdGhlIGNhbGxiYWNrIGlzIGZpcmVkIGFuZCBhcyBzdWNoIHRoZSBjbGllbnQgbXVzdCBub3RcbiAgICAgKlx0YXR0ZW1wdCB0byB1c2UgaXQgYWZ0ZXIgdGhhdCBwb2ludC5cbiAgICAgKlxuICAgICAqXHRUaGUgY2FsbGJhY2tfZGF0YSBwYXNzZWQgaW4gdGhlIGNhbGxiYWNrIGlzIHRoZSBldmVudCBzZXJpYWwuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgc3luYygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hcnNoYWxsQ29uc3RydWN0b3IodGhpcy5pZCwgMCwgV2VzdGZpZWxkLldsQ2FsbGJhY2tQcm94eSwgW25ld09iamVjdCgpXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdFRoaXMgcmVxdWVzdCBjcmVhdGVzIGEgcmVnaXN0cnkgb2JqZWN0IHRoYXQgYWxsb3dzIHRoZSBjbGllbnRcbiAgICAgKlx0dG8gbGlzdCBhbmQgYmluZCB0aGUgZ2xvYmFsIG9iamVjdHMgYXZhaWxhYmxlIGZyb20gdGhlXG4gICAgICpcdGNvbXBvc2l0b3IuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgZ2V0UmVnaXN0cnkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXJzaGFsbENvbnN0cnVjdG9yKHRoaXMuaWQsIDEsIFdlc3RmaWVsZC5XbFJlZ2lzdHJ5UHJveHksIFtuZXdPYmplY3QoKV0pO1xuICAgIH1cbiAgICBbMF0obWVzc2FnZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB5aWVsZCAoKF9hID0gdGhpcy5saXN0ZW5lcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmVycm9yKG8obWVzc2FnZSwgdGhpcy5fY29ubmVjdGlvbiksIHUobWVzc2FnZSksIHMobWVzc2FnZSkpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFsxXShtZXNzYWdlKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHlpZWxkICgoX2EgPSB0aGlzLmxpc3RlbmVyKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZGVsZXRlSWQodShtZXNzYWdlKSkpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnQgY29uc3QgV2xEaXNwbGF5UHJvdG9jb2xOYW1lID0gJ3dsX2Rpc3BsYXknO1xuZXhwb3J0IHZhciBXbERpc3BsYXlFcnJvcjtcbihmdW5jdGlvbiAoV2xEaXNwbGF5RXJyb3IpIHtcbiAgICAvKipcbiAgICAgKiBzZXJ2ZXIgY291bGRuJ3QgZmluZCBvYmplY3RcbiAgICAgKi9cbiAgICBXbERpc3BsYXlFcnJvcltXbERpc3BsYXlFcnJvcltcIl9pbnZhbGlkT2JqZWN0XCJdID0gMF0gPSBcIl9pbnZhbGlkT2JqZWN0XCI7XG4gICAgLyoqXG4gICAgICogbWV0aG9kIGRvZXNuJ3QgZXhpc3Qgb24gdGhlIHNwZWNpZmllZCBpbnRlcmZhY2VcbiAgICAgKi9cbiAgICBXbERpc3BsYXlFcnJvcltXbERpc3BsYXlFcnJvcltcIl9pbnZhbGlkTWV0aG9kXCJdID0gMV0gPSBcIl9pbnZhbGlkTWV0aG9kXCI7XG4gICAgLyoqXG4gICAgICogc2VydmVyIGlzIG91dCBvZiBtZW1vcnlcbiAgICAgKi9cbiAgICBXbERpc3BsYXlFcnJvcltXbERpc3BsYXlFcnJvcltcIl9ub01lbW9yeVwiXSA9IDJdID0gXCJfbm9NZW1vcnlcIjtcbn0pKFdsRGlzcGxheUVycm9yIHx8IChXbERpc3BsYXlFcnJvciA9IHt9KSk7XG4vKipcbiAqXG4gKiAgICAgIFRoZSBzaW5nbGV0b24gZ2xvYmFsIHJlZ2lzdHJ5IG9iamVjdC4gIFRoZSBzZXJ2ZXIgaGFzIGEgbnVtYmVyIG9mXG4gKiAgICAgIGdsb2JhbCBvYmplY3RzIHRoYXQgYXJlIGF2YWlsYWJsZSB0byBhbGwgY2xpZW50cy4gIFRoZXNlIG9iamVjdHNcbiAqICAgICAgdHlwaWNhbGx5IHJlcHJlc2VudCBhbiBhY3R1YWwgb2JqZWN0IGluIHRoZSBzZXJ2ZXIgKGZvciBleGFtcGxlLFxuICogICAgICBhbiBpbnB1dCBkZXZpY2UpIG9yIHRoZXkgYXJlIHNpbmdsZXRvbiBvYmplY3RzIHRoYXQgcHJvdmlkZVxuICogICAgICBleHRlbnNpb24gZnVuY3Rpb25hbGl0eS5cbiAqXG4gKiAgICAgIFdoZW4gYSBjbGllbnQgY3JlYXRlcyBhIHJlZ2lzdHJ5IG9iamVjdCwgdGhlIHJlZ2lzdHJ5IG9iamVjdFxuICogICAgICB3aWxsIGVtaXQgYSBnbG9iYWwgZXZlbnQgZm9yIGVhY2ggZ2xvYmFsIGN1cnJlbnRseSBpbiB0aGVcbiAqICAgICAgcmVnaXN0cnkuICBHbG9iYWxzIGNvbWUgYW5kIGdvIGFzIGEgcmVzdWx0IG9mIGRldmljZSBvclxuICogICAgICBtb25pdG9yIGhvdHBsdWdzLCByZWNvbmZpZ3VyYXRpb24gb3Igb3RoZXIgZXZlbnRzLCBhbmQgdGhlXG4gKiAgICAgIHJlZ2lzdHJ5IHdpbGwgc2VuZCBvdXQgZ2xvYmFsIGFuZCBnbG9iYWxfcmVtb3ZlIGV2ZW50cyB0b1xuICogICAgICBrZWVwIHRoZSBjbGllbnQgdXAgdG8gZGF0ZSB3aXRoIHRoZSBjaGFuZ2VzLiAgVG8gbWFyayB0aGUgZW5kXG4gKiAgICAgIG9mIHRoZSBpbml0aWFsIGJ1cnN0IG9mIGV2ZW50cywgdGhlIGNsaWVudCBjYW4gdXNlIHRoZVxuICogICAgICB3bF9kaXNwbGF5LnN5bmMgcmVxdWVzdCBpbW1lZGlhdGVseSBhZnRlciBjYWxsaW5nXG4gKiAgICAgIHdsX2Rpc3BsYXkuZ2V0X3JlZ2lzdHJ5LlxuICpcbiAqICAgICAgQSBjbGllbnQgY2FuIGJpbmQgdG8gYSBnbG9iYWwgb2JqZWN0IGJ5IHVzaW5nIHRoZSBiaW5kXG4gKiAgICAgIHJlcXVlc3QuICBUaGlzIGNyZWF0ZXMgYSBjbGllbnQtc2lkZSBoYW5kbGUgdGhhdCBsZXRzIHRoZSBvYmplY3RcbiAqICAgICAgZW1pdCBldmVudHMgdG8gdGhlIGNsaWVudCBhbmQgbGV0cyB0aGUgY2xpZW50IGludm9rZSByZXF1ZXN0cyBvblxuICogICAgICB0aGUgb2JqZWN0LlxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIFdsUmVnaXN0cnlQcm94eSBleHRlbmRzIFByb3h5IHtcbiAgICAvKipcbiAgICAgKiBEbyBub3QgY29uc3RydWN0IHByb3hpZXMgZGlyZWN0bHkuIEluc3RlYWQgdXNlIG9uZSBvZiB0aGUgZmFjdG9yeSBtZXRob2RzIGZyb20gb3RoZXIgcHJveGllcy5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihkaXNwbGF5LCBjb25uZWN0aW9uLCBpZCkge1xuICAgICAgICBzdXBlcihkaXNwbGF5LCBjb25uZWN0aW9uLCBpZCk7XG4gICAgfVxuICAgIC8qKlxuICAgICogQmluZCBhIG5ldyBvYmplY3QgdG8gdGhlIGdsb2JhbC5cbiAgICAqXG4gICAgKiBCaW5kcyBhIG5ldywgY2xpZW50LWNyZWF0ZWQgb2JqZWN0IHRvIHRoZSBzZXJ2ZXIgdXNpbmcgdGhlIHNwZWNpZmllZCBuYW1lIGFzIHRoZSBpZGVudGlmaWVyLlxuICAgICpcbiAgICAqL1xuICAgIGJpbmQobmFtZSwgaW50ZXJmYWNlXywgcHJveHlDbGFzcywgdmVyc2lvbikge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWFyc2hhbGxDb25zdHJ1Y3Rvcih0aGlzLmlkLCAwLCBwcm94eUNsYXNzLCBbdWludChuYW1lKSwgc3RyaW5nKGludGVyZmFjZV8pLCB1aW50KHZlcnNpb24pLCBuZXdPYmplY3QoKV0pO1xuICAgIH1cbiAgICBbMF0obWVzc2FnZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB5aWVsZCAoKF9hID0gdGhpcy5saXN0ZW5lcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdsb2JhbCh1KG1lc3NhZ2UpLCBzKG1lc3NhZ2UpLCB1KG1lc3NhZ2UpKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBbMV0obWVzc2FnZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB5aWVsZCAoKF9hID0gdGhpcy5saXN0ZW5lcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdsb2JhbFJlbW92ZSh1KG1lc3NhZ2UpKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydCBjb25zdCBXbFJlZ2lzdHJ5UHJvdG9jb2xOYW1lID0gJ3dsX3JlZ2lzdHJ5Jztcbi8qKlxuICpcbiAqICAgICAgQ2xpZW50cyBjYW4gaGFuZGxlIHRoZSAnZG9uZScgZXZlbnQgdG8gZ2V0IG5vdGlmaWVkIHdoZW5cbiAqICAgICAgdGhlIHJlbGF0ZWQgcmVxdWVzdCBpcyBkb25lLlxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIFdsQ2FsbGJhY2tQcm94eSBleHRlbmRzIFByb3h5IHtcbiAgICAvKipcbiAgICAgKiBEbyBub3QgY29uc3RydWN0IHByb3hpZXMgZGlyZWN0bHkuIEluc3RlYWQgdXNlIG9uZSBvZiB0aGUgZmFjdG9yeSBtZXRob2RzIGZyb20gb3RoZXIgcHJveGllcy5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihkaXNwbGF5LCBjb25uZWN0aW9uLCBpZCkge1xuICAgICAgICBzdXBlcihkaXNwbGF5LCBjb25uZWN0aW9uLCBpZCk7XG4gICAgfVxuICAgIFswXShtZXNzYWdlKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHlpZWxkICgoX2EgPSB0aGlzLmxpc3RlbmVyKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZG9uZSh1KG1lc3NhZ2UpKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydCBjb25zdCBXbENhbGxiYWNrUHJvdG9jb2xOYW1lID0gJ3dsX2NhbGxiYWNrJztcbi8qKlxuICpcbiAqICAgICAgQSBjb21wb3NpdG9yLiAgVGhpcyBvYmplY3QgaXMgYSBzaW5nbGV0b24gZ2xvYmFsLiAgVGhlXG4gKiAgICAgIGNvbXBvc2l0b3IgaXMgaW4gY2hhcmdlIG9mIGNvbWJpbmluZyB0aGUgY29udGVudHMgb2YgbXVsdGlwbGVcbiAqICAgICAgc3VyZmFjZXMgaW50byBvbmUgZGlzcGxheWFibGUgb3V0cHV0LlxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIFdsQ29tcG9zaXRvclByb3h5IGV4dGVuZHMgUHJveHkge1xuICAgIC8qKlxuICAgICAqIERvIG5vdCBjb25zdHJ1Y3QgcHJveGllcyBkaXJlY3RseS4gSW5zdGVhZCB1c2Ugb25lIG9mIHRoZSBmYWN0b3J5IG1ldGhvZHMgZnJvbSBvdGhlciBwcm94aWVzLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKSB7XG4gICAgICAgIHN1cGVyKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0QXNrIHRoZSBjb21wb3NpdG9yIHRvIGNyZWF0ZSBhIG5ldyBzdXJmYWNlLlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIGNyZWF0ZVN1cmZhY2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXJzaGFsbENvbnN0cnVjdG9yKHRoaXMuaWQsIDAsIFdlc3RmaWVsZC5XbFN1cmZhY2VQcm94eSwgW25ld09iamVjdCgpXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdEFzayB0aGUgY29tcG9zaXRvciB0byBjcmVhdGUgYSBuZXcgcmVnaW9uLlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIGNyZWF0ZVJlZ2lvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hcnNoYWxsQ29uc3RydWN0b3IodGhpcy5pZCwgMSwgV2VzdGZpZWxkLldsUmVnaW9uUHJveHksIFtuZXdPYmplY3QoKV0pO1xuICAgIH1cbn1cbmV4cG9ydCBjb25zdCBXbENvbXBvc2l0b3JQcm90b2NvbE5hbWUgPSAnd2xfY29tcG9zaXRvcic7XG4vKipcbiAqXG4gKiAgICAgIFRoZSB3bF9zaG1fcG9vbCBvYmplY3QgZW5jYXBzdWxhdGVzIGEgcGllY2Ugb2YgbWVtb3J5IHNoYXJlZFxuICogICAgICBiZXR3ZWVuIHRoZSBjb21wb3NpdG9yIGFuZCBjbGllbnQuICBUaHJvdWdoIHRoZSB3bF9zaG1fcG9vbFxuICogICAgICBvYmplY3QsIHRoZSBjbGllbnQgY2FuIGFsbG9jYXRlIHNoYXJlZCBtZW1vcnkgd2xfYnVmZmVyIG9iamVjdHMuXG4gKiAgICAgIEFsbCBvYmplY3RzIGNyZWF0ZWQgdGhyb3VnaCB0aGUgc2FtZSBwb29sIHNoYXJlIHRoZSBzYW1lXG4gKiAgICAgIHVuZGVybHlpbmcgbWFwcGVkIG1lbW9yeS4gUmV1c2luZyB0aGUgbWFwcGVkIG1lbW9yeSBhdm9pZHMgdGhlXG4gKiAgICAgIHNldHVwL3RlYXJkb3duIG92ZXJoZWFkIGFuZCBpcyB1c2VmdWwgd2hlbiBpbnRlcmFjdGl2ZWx5IHJlc2l6aW5nXG4gKiAgICAgIGEgc3VyZmFjZSBvciBmb3IgbWFueSBzbWFsbCBidWZmZXJzLlxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIFdsU2htUG9vbFByb3h5IGV4dGVuZHMgUHJveHkge1xuICAgIC8qKlxuICAgICAqIERvIG5vdCBjb25zdHJ1Y3QgcHJveGllcyBkaXJlY3RseS4gSW5zdGVhZCB1c2Ugb25lIG9mIHRoZSBmYWN0b3J5IG1ldGhvZHMgZnJvbSBvdGhlciBwcm94aWVzLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKSB7XG4gICAgICAgIHN1cGVyKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0Q3JlYXRlIGEgd2xfYnVmZmVyIG9iamVjdCBmcm9tIHRoZSBwb29sLlxuICAgICAqXG4gICAgICpcdFRoZSBidWZmZXIgaXMgY3JlYXRlZCBvZmZzZXQgYnl0ZXMgaW50byB0aGUgcG9vbCBhbmQgaGFzXG4gICAgICpcdHdpZHRoIGFuZCBoZWlnaHQgYXMgc3BlY2lmaWVkLiAgVGhlIHN0cmlkZSBhcmd1bWVudCBzcGVjaWZpZXNcbiAgICAgKlx0dGhlIG51bWJlciBvZiBieXRlcyBmcm9tIHRoZSBiZWdpbm5pbmcgb2Ygb25lIHJvdyB0byB0aGUgYmVnaW5uaW5nXG4gICAgICpcdG9mIHRoZSBuZXh0LiAgVGhlIGZvcm1hdCBpcyB0aGUgcGl4ZWwgZm9ybWF0IG9mIHRoZSBidWZmZXIgYW5kXG4gICAgICpcdG11c3QgYmUgb25lIG9mIHRob3NlIGFkdmVydGlzZWQgdGhyb3VnaCB0aGUgd2xfc2htLmZvcm1hdCBldmVudC5cbiAgICAgKlxuICAgICAqXHRBIGJ1ZmZlciB3aWxsIGtlZXAgYSByZWZlcmVuY2UgdG8gdGhlIHBvb2wgaXQgd2FzIGNyZWF0ZWQgZnJvbVxuICAgICAqXHRzbyBpdCBpcyB2YWxpZCB0byBkZXN0cm95IHRoZSBwb29sIGltbWVkaWF0ZWx5IGFmdGVyIGNyZWF0aW5nXG4gICAgICpcdGEgYnVmZmVyIGZyb20gaXQuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgY3JlYXRlQnVmZmVyKG9mZnNldCwgd2lkdGgsIGhlaWdodCwgc3RyaWRlLCBmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hcnNoYWxsQ29uc3RydWN0b3IodGhpcy5pZCwgMCwgV2VzdGZpZWxkLldsQnVmZmVyUHJveHksIFtuZXdPYmplY3QoKSwgaW50KG9mZnNldCksIGludCh3aWR0aCksIGludChoZWlnaHQpLCBpbnQoc3RyaWRlKSwgdWludChmb3JtYXQpXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdERlc3Ryb3kgdGhlIHNoYXJlZCBtZW1vcnkgcG9vbC5cbiAgICAgKlxuICAgICAqXHRUaGUgbW1hcHBlZCBtZW1vcnkgd2lsbCBiZSByZWxlYXNlZCB3aGVuIGFsbFxuICAgICAqXHRidWZmZXJzIHRoYXQgaGF2ZSBiZWVuIGNyZWF0ZWQgZnJvbSB0aGlzIHBvb2xcbiAgICAgKlx0YXJlIGdvbmUuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLl9tYXJzaGFsbCh0aGlzLmlkLCAxLCBbXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdFRoaXMgcmVxdWVzdCB3aWxsIGNhdXNlIHRoZSBzZXJ2ZXIgdG8gcmVtYXAgdGhlIGJhY2tpbmcgbWVtb3J5XG4gICAgICpcdGZvciB0aGUgcG9vbCBmcm9tIHRoZSBmaWxlIGRlc2NyaXB0b3IgcGFzc2VkIHdoZW4gdGhlIHBvb2wgd2FzXG4gICAgICpcdGNyZWF0ZWQsIGJ1dCB1c2luZyB0aGUgbmV3IHNpemUuICBUaGlzIHJlcXVlc3QgY2FuIG9ubHkgYmVcbiAgICAgKlx0dXNlZCB0byBtYWtlIHRoZSBwb29sIGJpZ2dlci5cbiAgICAgKlxuICAgICAqIEBzaW5jZSAxXG4gICAgICpcbiAgICAgKi9cbiAgICByZXNpemUoc2l6ZSkge1xuICAgICAgICB0aGlzLl9tYXJzaGFsbCh0aGlzLmlkLCAyLCBbaW50KHNpemUpXSk7XG4gICAgfVxufVxuZXhwb3J0IGNvbnN0IFdsU2htUG9vbFByb3RvY29sTmFtZSA9ICd3bF9zaG1fcG9vbCc7XG4vKipcbiAqXG4gKiAgICAgIEEgc2luZ2xldG9uIGdsb2JhbCBvYmplY3QgdGhhdCBwcm92aWRlcyBzdXBwb3J0IGZvciBzaGFyZWRcbiAqICAgICAgbWVtb3J5LlxuICpcbiAqICAgICAgQ2xpZW50cyBjYW4gY3JlYXRlIHdsX3NobV9wb29sIG9iamVjdHMgdXNpbmcgdGhlIGNyZWF0ZV9wb29sXG4gKiAgICAgIHJlcXVlc3QuXG4gKlxuICogICAgICBBdCBjb25uZWN0aW9uIHNldHVwIHRpbWUsIHRoZSB3bF9zaG0gb2JqZWN0IGVtaXRzIG9uZSBvciBtb3JlXG4gKiAgICAgIGZvcm1hdCBldmVudHMgdG8gaW5mb3JtIGNsaWVudHMgYWJvdXQgdGhlIHZhbGlkIHBpeGVsIGZvcm1hdHNcbiAqICAgICAgdGhhdCBjYW4gYmUgdXNlZCBmb3IgYnVmZmVycy5cbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBXbFNobVByb3h5IGV4dGVuZHMgUHJveHkge1xuICAgIC8qKlxuICAgICAqIERvIG5vdCBjb25zdHJ1Y3QgcHJveGllcyBkaXJlY3RseS4gSW5zdGVhZCB1c2Ugb25lIG9mIHRoZSBmYWN0b3J5IG1ldGhvZHMgZnJvbSBvdGhlciBwcm94aWVzLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKSB7XG4gICAgICAgIHN1cGVyKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0Q3JlYXRlIGEgbmV3IHdsX3NobV9wb29sIG9iamVjdC5cbiAgICAgKlxuICAgICAqXHRUaGUgcG9vbCBjYW4gYmUgdXNlZCB0byBjcmVhdGUgc2hhcmVkIG1lbW9yeSBiYXNlZCBidWZmZXJcbiAgICAgKlx0b2JqZWN0cy4gIFRoZSBzZXJ2ZXIgd2lsbCBtbWFwIHNpemUgYnl0ZXMgb2YgdGhlIHBhc3NlZCBmaWxlXG4gICAgICpcdGRlc2NyaXB0b3IsIHRvIHVzZSBhcyBiYWNraW5nIG1lbW9yeSBmb3IgdGhlIHBvb2wuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgY3JlYXRlUG9vbChmZCwgc2l6ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWFyc2hhbGxDb25zdHJ1Y3Rvcih0aGlzLmlkLCAwLCBXZXN0ZmllbGQuV2xTaG1Qb29sUHJveHksIFtuZXdPYmplY3QoKSwgZmlsZURlc2NyaXB0b3IoZmQpLCBpbnQoc2l6ZSldKTtcbiAgICB9XG4gICAgWzBdKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgKChfYSA9IHRoaXMubGlzdGVuZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5mb3JtYXQodShtZXNzYWdlKSkpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnQgY29uc3QgV2xTaG1Qcm90b2NvbE5hbWUgPSAnd2xfc2htJztcbmV4cG9ydCB2YXIgV2xTaG1FcnJvcjtcbihmdW5jdGlvbiAoV2xTaG1FcnJvcikge1xuICAgIC8qKlxuICAgICAqIGJ1ZmZlciBmb3JtYXQgaXMgbm90IGtub3duXG4gICAgICovXG4gICAgV2xTaG1FcnJvcltXbFNobUVycm9yW1wiX2ludmFsaWRGb3JtYXRcIl0gPSAwXSA9IFwiX2ludmFsaWRGb3JtYXRcIjtcbiAgICAvKipcbiAgICAgKiBpbnZhbGlkIHNpemUgb3Igc3RyaWRlIGR1cmluZyBwb29sIG9yIGJ1ZmZlciBjcmVhdGlvblxuICAgICAqL1xuICAgIFdsU2htRXJyb3JbV2xTaG1FcnJvcltcIl9pbnZhbGlkU3RyaWRlXCJdID0gMV0gPSBcIl9pbnZhbGlkU3RyaWRlXCI7XG4gICAgLyoqXG4gICAgICogbW1hcHBpbmcgdGhlIGZpbGUgZGVzY3JpcHRvciBmYWlsZWRcbiAgICAgKi9cbiAgICBXbFNobUVycm9yW1dsU2htRXJyb3JbXCJfaW52YWxpZEZkXCJdID0gMl0gPSBcIl9pbnZhbGlkRmRcIjtcbn0pKFdsU2htRXJyb3IgfHwgKFdsU2htRXJyb3IgPSB7fSkpO1xuZXhwb3J0IHZhciBXbFNobUZvcm1hdDtcbihmdW5jdGlvbiAoV2xTaG1Gb3JtYXQpIHtcbiAgICAvKipcbiAgICAgKiAzMi1iaXQgQVJHQiBmb3JtYXQsIFszMTowXSBBOlI6RzpCIDg6ODo4OjggbGl0dGxlIGVuZGlhblxuICAgICAqL1xuICAgIFdsU2htRm9ybWF0W1dsU2htRm9ybWF0W1wiX2FyZ2I4ODg4XCJdID0gMF0gPSBcIl9hcmdiODg4OFwiO1xuICAgIC8qKlxuICAgICAqIDMyLWJpdCBSR0IgZm9ybWF0LCBbMzE6MF0geDpSOkc6QiA4Ojg6ODo4IGxpdHRsZSBlbmRpYW5cbiAgICAgKi9cbiAgICBXbFNobUZvcm1hdFtXbFNobUZvcm1hdFtcIl94cmdiODg4OFwiXSA9IDFdID0gXCJfeHJnYjg4ODhcIjtcbiAgICAvKipcbiAgICAgKiA4LWJpdCBjb2xvciBpbmRleCBmb3JtYXQsIFs3OjBdIENcbiAgICAgKi9cbiAgICBXbFNobUZvcm1hdFtXbFNobUZvcm1hdFtcIl9jOFwiXSA9IDUzODk4MjQ2N10gPSBcIl9jOFwiO1xuICAgIC8qKlxuICAgICAqIDgtYml0IFJHQiBmb3JtYXQsIFs3OjBdIFI6RzpCIDM6MzoyXG4gICAgICovXG4gICAgV2xTaG1Gb3JtYXRbV2xTaG1Gb3JtYXRbXCJfcmdiMzMyXCJdID0gOTQzODY3NzMwXSA9IFwiX3JnYjMzMlwiO1xuICAgIC8qKlxuICAgICAqIDgtYml0IEJHUiBmb3JtYXQsIFs3OjBdIEI6RzpSIDI6MzozXG4gICAgICovXG4gICAgV2xTaG1Gb3JtYXRbV2xTaG1Gb3JtYXRbXCJfYmdyMjMzXCJdID0gOTQ0OTE2MjkwXSA9IFwiX2JncjIzM1wiO1xuICAgIC8qKlxuICAgICAqIDE2LWJpdCB4UkdCIGZvcm1hdCwgWzE1OjBdIHg6UjpHOkIgNDo0OjQ6NCBsaXR0bGUgZW5kaWFuXG4gICAgICovXG4gICAgV2xTaG1Gb3JtYXRbV2xTaG1Gb3JtYXRbXCJfeHJnYjQ0NDRcIl0gPSA4NDIwOTMxNDRdID0gXCJfeHJnYjQ0NDRcIjtcbiAgICAvKipcbiAgICAgKiAxNi1iaXQgeEJHUiBmb3JtYXQsIFsxNTowXSB4OkI6RzpSIDQ6NDo0OjQgbGl0dGxlIGVuZGlhblxuICAgICAqL1xuICAgIFdsU2htRm9ybWF0W1dsU2htRm9ybWF0W1wiX3hiZ3I0NDQ0XCJdID0gODQyMDg5MDQ4XSA9IFwiX3hiZ3I0NDQ0XCI7XG4gICAgLyoqXG4gICAgICogMTYtYml0IFJHQnggZm9ybWF0LCBbMTU6MF0gUjpHOkI6eCA0OjQ6NDo0IGxpdHRsZSBlbmRpYW5cbiAgICAgKi9cbiAgICBXbFNobUZvcm1hdFtXbFNobUZvcm1hdFtcIl9yZ2J4NDQ0NFwiXSA9IDg0MjA5NDY3NF0gPSBcIl9yZ2J4NDQ0NFwiO1xuICAgIC8qKlxuICAgICAqIDE2LWJpdCBCR1J4IGZvcm1hdCwgWzE1OjBdIEI6RzpSOnggNDo0OjQ6NCBsaXR0bGUgZW5kaWFuXG4gICAgICovXG4gICAgV2xTaG1Gb3JtYXRbV2xTaG1Gb3JtYXRbXCJfYmdyeDQ0NDRcIl0gPSA4NDIwOTQ2NThdID0gXCJfYmdyeDQ0NDRcIjtcbiAgICAvKipcbiAgICAgKiAxNi1iaXQgQVJHQiBmb3JtYXQsIFsxNTowXSBBOlI6RzpCIDQ6NDo0OjQgbGl0dGxlIGVuZGlhblxuICAgICAqL1xuICAgIFdsU2htRm9ybWF0W1dsU2htRm9ybWF0W1wiX2FyZ2I0NDQ0XCJdID0gODQyMDkzMTIxXSA9IFwiX2FyZ2I0NDQ0XCI7XG4gICAgLyoqXG4gICAgICogMTYtYml0IEFCR1IgZm9ybWF0LCBbMTU6MF0gQTpCOkc6UiA0OjQ6NDo0IGxpdHRsZSBlbmRpYW5cbiAgICAgKi9cbiAgICBXbFNobUZvcm1hdFtXbFNobUZvcm1hdFtcIl9hYmdyNDQ0NFwiXSA9IDg0MjA4OTAyNV0gPSBcIl9hYmdyNDQ0NFwiO1xuICAgIC8qKlxuICAgICAqIDE2LWJpdCBSQkdBIGZvcm1hdCwgWzE1OjBdIFI6RzpCOkEgNDo0OjQ6NCBsaXR0bGUgZW5kaWFuXG4gICAgICovXG4gICAgV2xTaG1Gb3JtYXRbV2xTaG1Gb3JtYXRbXCJfcmdiYTQ0NDRcIl0gPSA4NDIwODg3ODZdID0gXCJfcmdiYTQ0NDRcIjtcbiAgICAvKipcbiAgICAgKiAxNi1iaXQgQkdSQSBmb3JtYXQsIFsxNTowXSBCOkc6UjpBIDQ6NDo0OjQgbGl0dGxlIGVuZGlhblxuICAgICAqL1xuICAgIFdsU2htRm9ybWF0W1dsU2htRm9ybWF0W1wiX2JncmE0NDQ0XCJdID0gODQyMDg4NzcwXSA9IFwiX2JncmE0NDQ0XCI7XG4gICAgLyoqXG4gICAgICogMTYtYml0IHhSR0IgZm9ybWF0LCBbMTU6MF0geDpSOkc6QiAxOjU6NTo1IGxpdHRsZSBlbmRpYW5cbiAgICAgKi9cbiAgICBXbFNobUZvcm1hdFtXbFNobUZvcm1hdFtcIl94cmdiMTU1NVwiXSA9IDg5MjQyNDc5Ml0gPSBcIl94cmdiMTU1NVwiO1xuICAgIC8qKlxuICAgICAqIDE2LWJpdCB4QkdSIDE1NTUgZm9ybWF0LCBbMTU6MF0geDpCOkc6UiAxOjU6NTo1IGxpdHRsZSBlbmRpYW5cbiAgICAgKi9cbiAgICBXbFNobUZvcm1hdFtXbFNobUZvcm1hdFtcIl94YmdyMTU1NVwiXSA9IDg5MjQyMDY5Nl0gPSBcIl94YmdyMTU1NVwiO1xuICAgIC8qKlxuICAgICAqIDE2LWJpdCBSR0J4IDU1NTEgZm9ybWF0LCBbMTU6MF0gUjpHOkI6eCA1OjU6NToxIGxpdHRsZSBlbmRpYW5cbiAgICAgKi9cbiAgICBXbFNobUZvcm1hdFtXbFNobUZvcm1hdFtcIl9yZ2J4NTU1MVwiXSA9IDg5MjQyNjMyMl0gPSBcIl9yZ2J4NTU1MVwiO1xuICAgIC8qKlxuICAgICAqIDE2LWJpdCBCR1J4IDU1NTEgZm9ybWF0LCBbMTU6MF0gQjpHOlI6eCA1OjU6NToxIGxpdHRsZSBlbmRpYW5cbiAgICAgKi9cbiAgICBXbFNobUZvcm1hdFtXbFNobUZvcm1hdFtcIl9iZ3J4NTU1MVwiXSA9IDg5MjQyNjMwNl0gPSBcIl9iZ3J4NTU1MVwiO1xuICAgIC8qKlxuICAgICAqIDE2LWJpdCBBUkdCIDE1NTUgZm9ybWF0LCBbMTU6MF0gQTpSOkc6QiAxOjU6NTo1IGxpdHRsZSBlbmRpYW5cbiAgICAgKi9cbiAgICBXbFNobUZvcm1hdFtXbFNobUZvcm1hdFtcIl9hcmdiMTU1NVwiXSA9IDg5MjQyNDc2OV0gPSBcIl9hcmdiMTU1NVwiO1xuICAgIC8qKlxuICAgICAqIDE2LWJpdCBBQkdSIDE1NTUgZm9ybWF0LCBbMTU6MF0gQTpCOkc6UiAxOjU6NTo1IGxpdHRsZSBlbmRpYW5cbiAgICAgKi9cbiAgICBXbFNobUZvcm1hdFtXbFNobUZvcm1hdFtcIl9hYmdyMTU1NVwiXSA9IDg5MjQyMDY3M10gPSBcIl9hYmdyMTU1NVwiO1xuICAgIC8qKlxuICAgICAqIDE2LWJpdCBSR0JBIDU1NTEgZm9ybWF0LCBbMTU6MF0gUjpHOkI6QSA1OjU6NToxIGxpdHRsZSBlbmRpYW5cbiAgICAgKi9cbiAgICBXbFNobUZvcm1hdFtXbFNobUZvcm1hdFtcIl9yZ2JhNTU1MVwiXSA9IDg5MjQyMDQzNF0gPSBcIl9yZ2JhNTU1MVwiO1xuICAgIC8qKlxuICAgICAqIDE2LWJpdCBCR1JBIDU1NTEgZm9ybWF0LCBbMTU6MF0gQjpHOlI6QSA1OjU6NToxIGxpdHRsZSBlbmRpYW5cbiAgICAgKi9cbiAgICBXbFNobUZvcm1hdFtXbFNobUZvcm1hdFtcIl9iZ3JhNTU1MVwiXSA9IDg5MjQyMDQxOF0gPSBcIl9iZ3JhNTU1MVwiO1xuICAgIC8qKlxuICAgICAqIDE2LWJpdCBSR0IgNTY1IGZvcm1hdCwgWzE1OjBdIFI6RzpCIDU6Njo1IGxpdHRsZSBlbmRpYW5cbiAgICAgKi9cbiAgICBXbFNobUZvcm1hdFtXbFNobUZvcm1hdFtcIl9yZ2I1NjVcIl0gPSA5MDkxOTkxODZdID0gXCJfcmdiNTY1XCI7XG4gICAgLyoqXG4gICAgICogMTYtYml0IEJHUiA1NjUgZm9ybWF0LCBbMTU6MF0gQjpHOlIgNTo2OjUgbGl0dGxlIGVuZGlhblxuICAgICAqL1xuICAgIFdsU2htRm9ybWF0W1dsU2htRm9ybWF0W1wiX2JncjU2NVwiXSA9IDkwOTE5OTE3MF0gPSBcIl9iZ3I1NjVcIjtcbiAgICAvKipcbiAgICAgKiAyNC1iaXQgUkdCIGZvcm1hdCwgWzIzOjBdIFI6RzpCIGxpdHRsZSBlbmRpYW5cbiAgICAgKi9cbiAgICBXbFNobUZvcm1hdFtXbFNobUZvcm1hdFtcIl9yZ2I4ODhcIl0gPSA4NzU3MTAyOTBdID0gXCJfcmdiODg4XCI7XG4gICAgLyoqXG4gICAgICogMjQtYml0IEJHUiBmb3JtYXQsIFsyMzowXSBCOkc6UiBsaXR0bGUgZW5kaWFuXG4gICAgICovXG4gICAgV2xTaG1Gb3JtYXRbV2xTaG1Gb3JtYXRbXCJfYmdyODg4XCJdID0gODc1NzEwMjc0XSA9IFwiX2Jncjg4OFwiO1xuICAgIC8qKlxuICAgICAqIDMyLWJpdCB4QkdSIGZvcm1hdCwgWzMxOjBdIHg6QjpHOlIgODo4Ojg6OCBsaXR0bGUgZW5kaWFuXG4gICAgICovXG4gICAgV2xTaG1Gb3JtYXRbV2xTaG1Gb3JtYXRbXCJfeGJncjg4ODhcIl0gPSA4NzU3MDkwMTZdID0gXCJfeGJncjg4ODhcIjtcbiAgICAvKipcbiAgICAgKiAzMi1iaXQgUkdCeCBmb3JtYXQsIFszMTowXSBSOkc6Qjp4IDg6ODo4OjggbGl0dGxlIGVuZGlhblxuICAgICAqL1xuICAgIFdsU2htRm9ybWF0W1dsU2htRm9ybWF0W1wiX3JnYng4ODg4XCJdID0gODc1NzE0NjQyXSA9IFwiX3JnYng4ODg4XCI7XG4gICAgLyoqXG4gICAgICogMzItYml0IEJHUnggZm9ybWF0LCBbMzE6MF0gQjpHOlI6eCA4Ojg6ODo4IGxpdHRsZSBlbmRpYW5cbiAgICAgKi9cbiAgICBXbFNobUZvcm1hdFtXbFNobUZvcm1hdFtcIl9iZ3J4ODg4OFwiXSA9IDg3NTcxNDYyNl0gPSBcIl9iZ3J4ODg4OFwiO1xuICAgIC8qKlxuICAgICAqIDMyLWJpdCBBQkdSIGZvcm1hdCwgWzMxOjBdIEE6QjpHOlIgODo4Ojg6OCBsaXR0bGUgZW5kaWFuXG4gICAgICovXG4gICAgV2xTaG1Gb3JtYXRbV2xTaG1Gb3JtYXRbXCJfYWJncjg4ODhcIl0gPSA4NzU3MDg5OTNdID0gXCJfYWJncjg4ODhcIjtcbiAgICAvKipcbiAgICAgKiAzMi1iaXQgUkdCQSBmb3JtYXQsIFszMTowXSBSOkc6QjpBIDg6ODo4OjggbGl0dGxlIGVuZGlhblxuICAgICAqL1xuICAgIFdsU2htRm9ybWF0W1dsU2htRm9ybWF0W1wiX3JnYmE4ODg4XCJdID0gODc1NzA4NzU0XSA9IFwiX3JnYmE4ODg4XCI7XG4gICAgLyoqXG4gICAgICogMzItYml0IEJHUkEgZm9ybWF0LCBbMzE6MF0gQjpHOlI6QSA4Ojg6ODo4IGxpdHRsZSBlbmRpYW5cbiAgICAgKi9cbiAgICBXbFNobUZvcm1hdFtXbFNobUZvcm1hdFtcIl9iZ3JhODg4OFwiXSA9IDg3NTcwODczOF0gPSBcIl9iZ3JhODg4OFwiO1xuICAgIC8qKlxuICAgICAqIDMyLWJpdCB4UkdCIGZvcm1hdCwgWzMxOjBdIHg6UjpHOkIgMjoxMDoxMDoxMCBsaXR0bGUgZW5kaWFuXG4gICAgICovXG4gICAgV2xTaG1Gb3JtYXRbV2xTaG1Gb3JtYXRbXCJfeHJnYjIxMDEwMTBcIl0gPSA4MDg2Njk3ODRdID0gXCJfeHJnYjIxMDEwMTBcIjtcbiAgICAvKipcbiAgICAgKiAzMi1iaXQgeEJHUiBmb3JtYXQsIFszMTowXSB4OkI6RzpSIDI6MTA6MTA6MTAgbGl0dGxlIGVuZGlhblxuICAgICAqL1xuICAgIFdsU2htRm9ybWF0W1dsU2htRm9ybWF0W1wiX3hiZ3IyMTAxMDEwXCJdID0gODA4NjY1Njg4XSA9IFwiX3hiZ3IyMTAxMDEwXCI7XG4gICAgLyoqXG4gICAgICogMzItYml0IFJHQnggZm9ybWF0LCBbMzE6MF0gUjpHOkI6eCAxMDoxMDoxMDoyIGxpdHRsZSBlbmRpYW5cbiAgICAgKi9cbiAgICBXbFNobUZvcm1hdFtXbFNobUZvcm1hdFtcIl9yZ2J4MTAxMDEwMlwiXSA9IDgwODY3MTMxNF0gPSBcIl9yZ2J4MTAxMDEwMlwiO1xuICAgIC8qKlxuICAgICAqIDMyLWJpdCBCR1J4IGZvcm1hdCwgWzMxOjBdIEI6RzpSOnggMTA6MTA6MTA6MiBsaXR0bGUgZW5kaWFuXG4gICAgICovXG4gICAgV2xTaG1Gb3JtYXRbV2xTaG1Gb3JtYXRbXCJfYmdyeDEwMTAxMDJcIl0gPSA4MDg2NzEyOThdID0gXCJfYmdyeDEwMTAxMDJcIjtcbiAgICAvKipcbiAgICAgKiAzMi1iaXQgQVJHQiBmb3JtYXQsIFszMTowXSBBOlI6RzpCIDI6MTA6MTA6MTAgbGl0dGxlIGVuZGlhblxuICAgICAqL1xuICAgIFdsU2htRm9ybWF0W1dsU2htRm9ybWF0W1wiX2FyZ2IyMTAxMDEwXCJdID0gODA4NjY5NzYxXSA9IFwiX2FyZ2IyMTAxMDEwXCI7XG4gICAgLyoqXG4gICAgICogMzItYml0IEFCR1IgZm9ybWF0LCBbMzE6MF0gQTpCOkc6UiAyOjEwOjEwOjEwIGxpdHRsZSBlbmRpYW5cbiAgICAgKi9cbiAgICBXbFNobUZvcm1hdFtXbFNobUZvcm1hdFtcIl9hYmdyMjEwMTAxMFwiXSA9IDgwODY2NTY2NV0gPSBcIl9hYmdyMjEwMTAxMFwiO1xuICAgIC8qKlxuICAgICAqIDMyLWJpdCBSR0JBIGZvcm1hdCwgWzMxOjBdIFI6RzpCOkEgMTA6MTA6MTA6MiBsaXR0bGUgZW5kaWFuXG4gICAgICovXG4gICAgV2xTaG1Gb3JtYXRbV2xTaG1Gb3JtYXRbXCJfcmdiYTEwMTAxMDJcIl0gPSA4MDg2NjU0MjZdID0gXCJfcmdiYTEwMTAxMDJcIjtcbiAgICAvKipcbiAgICAgKiAzMi1iaXQgQkdSQSBmb3JtYXQsIFszMTowXSBCOkc6UjpBIDEwOjEwOjEwOjIgbGl0dGxlIGVuZGlhblxuICAgICAqL1xuICAgIFdsU2htRm9ybWF0W1dsU2htRm9ybWF0W1wiX2JncmExMDEwMTAyXCJdID0gODA4NjY1NDEwXSA9IFwiX2JncmExMDEwMTAyXCI7XG4gICAgLyoqXG4gICAgICogcGFja2VkIFlDYkNyIGZvcm1hdCwgWzMxOjBdIENyMDpZMTpDYjA6WTAgODo4Ojg6OCBsaXR0bGUgZW5kaWFuXG4gICAgICovXG4gICAgV2xTaG1Gb3JtYXRbV2xTaG1Gb3JtYXRbXCJfeXV5dlwiXSA9IDE0NDg2OTUxMjldID0gXCJfeXV5dlwiO1xuICAgIC8qKlxuICAgICAqIHBhY2tlZCBZQ2JDciBmb3JtYXQsIFszMTowXSBDYjA6WTE6Q3IwOlkwIDg6ODo4OjggbGl0dGxlIGVuZGlhblxuICAgICAqL1xuICAgIFdsU2htRm9ybWF0W1dsU2htRm9ybWF0W1wiX3l2eXVcIl0gPSAxNDMxOTE4MTY5XSA9IFwiX3l2eXVcIjtcbiAgICAvKipcbiAgICAgKiBwYWNrZWQgWUNiQ3IgZm9ybWF0LCBbMzE6MF0gWTE6Q3IwOlkwOkNiMCA4Ojg6ODo4IGxpdHRsZSBlbmRpYW5cbiAgICAgKi9cbiAgICBXbFNobUZvcm1hdFtXbFNobUZvcm1hdFtcIl91eXZ5XCJdID0gMTQ5ODgzMTE4OV0gPSBcIl91eXZ5XCI7XG4gICAgLyoqXG4gICAgICogcGFja2VkIFlDYkNyIGZvcm1hdCwgWzMxOjBdIFkxOkNiMDpZMDpDcjAgODo4Ojg6OCBsaXR0bGUgZW5kaWFuXG4gICAgICovXG4gICAgV2xTaG1Gb3JtYXRbV2xTaG1Gb3JtYXRbXCJfdnl1eVwiXSA9IDE0OTg3NjU2NTRdID0gXCJfdnl1eVwiO1xuICAgIC8qKlxuICAgICAqIHBhY2tlZCBBWUNiQ3IgZm9ybWF0LCBbMzE6MF0gQTpZOkNiOkNyIDg6ODo4OjggbGl0dGxlIGVuZGlhblxuICAgICAqL1xuICAgIFdsU2htRm9ybWF0W1dsU2htRm9ybWF0W1wiX2F5dXZcIl0gPSAxNDQ4NDMzOTg1XSA9IFwiX2F5dXZcIjtcbiAgICAvKipcbiAgICAgKiAyIHBsYW5lIFlDYkNyIENyOkNiIGZvcm1hdCwgMngyIHN1YnNhbXBsZWQgQ3I6Q2IgcGxhbmVcbiAgICAgKi9cbiAgICBXbFNobUZvcm1hdFtXbFNobUZvcm1hdFtcIl9udjEyXCJdID0gODQyMDk0MTU4XSA9IFwiX252MTJcIjtcbiAgICAvKipcbiAgICAgKiAyIHBsYW5lIFlDYkNyIENiOkNyIGZvcm1hdCwgMngyIHN1YnNhbXBsZWQgQ2I6Q3IgcGxhbmVcbiAgICAgKi9cbiAgICBXbFNobUZvcm1hdFtXbFNobUZvcm1hdFtcIl9udjIxXCJdID0gODI1MzgyNDc4XSA9IFwiX252MjFcIjtcbiAgICAvKipcbiAgICAgKiAyIHBsYW5lIFlDYkNyIENyOkNiIGZvcm1hdCwgMngxIHN1YnNhbXBsZWQgQ3I6Q2IgcGxhbmVcbiAgICAgKi9cbiAgICBXbFNobUZvcm1hdFtXbFNobUZvcm1hdFtcIl9udjE2XCJdID0gOTA5MjAzMDIyXSA9IFwiX252MTZcIjtcbiAgICAvKipcbiAgICAgKiAyIHBsYW5lIFlDYkNyIENiOkNyIGZvcm1hdCwgMngxIHN1YnNhbXBsZWQgQ2I6Q3IgcGxhbmVcbiAgICAgKi9cbiAgICBXbFNobUZvcm1hdFtXbFNobUZvcm1hdFtcIl9udjYxXCJdID0gODI1NjQ0NjIyXSA9IFwiX252NjFcIjtcbiAgICAvKipcbiAgICAgKiAzIHBsYW5lIFlDYkNyIGZvcm1hdCwgNHg0IHN1YnNhbXBsZWQgQ2IgKDEpIGFuZCBDciAoMikgcGxhbmVzXG4gICAgICovXG4gICAgV2xTaG1Gb3JtYXRbV2xTaG1Gb3JtYXRbXCJfeXV2NDEwXCJdID0gOTYxOTU5MjU3XSA9IFwiX3l1djQxMFwiO1xuICAgIC8qKlxuICAgICAqIDMgcGxhbmUgWUNiQ3IgZm9ybWF0LCA0eDQgc3Vic2FtcGxlZCBDciAoMSkgYW5kIENiICgyKSBwbGFuZXNcbiAgICAgKi9cbiAgICBXbFNobUZvcm1hdFtXbFNobUZvcm1hdFtcIl95dnU0MTBcIl0gPSA5NjE4OTM5NzddID0gXCJfeXZ1NDEwXCI7XG4gICAgLyoqXG4gICAgICogMyBwbGFuZSBZQ2JDciBmb3JtYXQsIDR4MSBzdWJzYW1wbGVkIENiICgxKSBhbmQgQ3IgKDIpIHBsYW5lc1xuICAgICAqL1xuICAgIFdsU2htRm9ybWF0W1dsU2htRm9ybWF0W1wiX3l1djQxMVwiXSA9IDgyNTMxNjY5N10gPSBcIl95dXY0MTFcIjtcbiAgICAvKipcbiAgICAgKiAzIHBsYW5lIFlDYkNyIGZvcm1hdCwgNHgxIHN1YnNhbXBsZWQgQ3IgKDEpIGFuZCBDYiAoMikgcGxhbmVzXG4gICAgICovXG4gICAgV2xTaG1Gb3JtYXRbV2xTaG1Gb3JtYXRbXCJfeXZ1NDExXCJdID0gODI1MzE2OTUzXSA9IFwiX3l2dTQxMVwiO1xuICAgIC8qKlxuICAgICAqIDMgcGxhbmUgWUNiQ3IgZm9ybWF0LCAyeDIgc3Vic2FtcGxlZCBDYiAoMSkgYW5kIENyICgyKSBwbGFuZXNcbiAgICAgKi9cbiAgICBXbFNobUZvcm1hdFtXbFNobUZvcm1hdFtcIl95dXY0MjBcIl0gPSA4NDIwOTM5MTNdID0gXCJfeXV2NDIwXCI7XG4gICAgLyoqXG4gICAgICogMyBwbGFuZSBZQ2JDciBmb3JtYXQsIDJ4MiBzdWJzYW1wbGVkIENyICgxKSBhbmQgQ2IgKDIpIHBsYW5lc1xuICAgICAqL1xuICAgIFdsU2htRm9ybWF0W1dsU2htRm9ybWF0W1wiX3l2dTQyMFwiXSA9IDg0MjA5NDE2OV0gPSBcIl95dnU0MjBcIjtcbiAgICAvKipcbiAgICAgKiAzIHBsYW5lIFlDYkNyIGZvcm1hdCwgMngxIHN1YnNhbXBsZWQgQ2IgKDEpIGFuZCBDciAoMikgcGxhbmVzXG4gICAgICovXG4gICAgV2xTaG1Gb3JtYXRbV2xTaG1Gb3JtYXRbXCJfeXV2NDIyXCJdID0gOTA5MjAyNzc3XSA9IFwiX3l1djQyMlwiO1xuICAgIC8qKlxuICAgICAqIDMgcGxhbmUgWUNiQ3IgZm9ybWF0LCAyeDEgc3Vic2FtcGxlZCBDciAoMSkgYW5kIENiICgyKSBwbGFuZXNcbiAgICAgKi9cbiAgICBXbFNobUZvcm1hdFtXbFNobUZvcm1hdFtcIl95dnU0MjJcIl0gPSA5MDkyMDMwMzNdID0gXCJfeXZ1NDIyXCI7XG4gICAgLyoqXG4gICAgICogMyBwbGFuZSBZQ2JDciBmb3JtYXQsIG5vbi1zdWJzYW1wbGVkIENiICgxKSBhbmQgQ3IgKDIpIHBsYW5lc1xuICAgICAqL1xuICAgIFdsU2htRm9ybWF0W1dsU2htRm9ybWF0W1wiX3l1djQ0NFwiXSA9IDg3NTcxMzg4MV0gPSBcIl95dXY0NDRcIjtcbiAgICAvKipcbiAgICAgKiAzIHBsYW5lIFlDYkNyIGZvcm1hdCwgbm9uLXN1YnNhbXBsZWQgQ3IgKDEpIGFuZCBDYiAoMikgcGxhbmVzXG4gICAgICovXG4gICAgV2xTaG1Gb3JtYXRbV2xTaG1Gb3JtYXRbXCJfeXZ1NDQ0XCJdID0gODc1NzE0MTM3XSA9IFwiX3l2dTQ0NFwiO1xufSkoV2xTaG1Gb3JtYXQgfHwgKFdsU2htRm9ybWF0ID0ge30pKTtcbi8qKlxuICpcbiAqICAgICAgQSBidWZmZXIgcHJvdmlkZXMgdGhlIGNvbnRlbnQgZm9yIGEgd2xfc3VyZmFjZS4gQnVmZmVycyBhcmVcbiAqICAgICAgY3JlYXRlZCB0aHJvdWdoIGZhY3RvcnkgaW50ZXJmYWNlcyBzdWNoIGFzIHdsX2RybSwgd2xfc2htIG9yXG4gKiAgICAgIHNpbWlsYXIuIEl0IGhhcyBhIHdpZHRoIGFuZCBhIGhlaWdodCBhbmQgY2FuIGJlIGF0dGFjaGVkIHRvIGFcbiAqICAgICAgd2xfc3VyZmFjZSwgYnV0IHRoZSBtZWNoYW5pc20gYnkgd2hpY2ggYSBjbGllbnQgcHJvdmlkZXMgYW5kXG4gKiAgICAgIHVwZGF0ZXMgdGhlIGNvbnRlbnRzIGlzIGRlZmluZWQgYnkgdGhlIGJ1ZmZlciBmYWN0b3J5IGludGVyZmFjZS5cbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBXbEJ1ZmZlclByb3h5IGV4dGVuZHMgUHJveHkge1xuICAgIC8qKlxuICAgICAqIERvIG5vdCBjb25zdHJ1Y3QgcHJveGllcyBkaXJlY3RseS4gSW5zdGVhZCB1c2Ugb25lIG9mIHRoZSBmYWN0b3J5IG1ldGhvZHMgZnJvbSBvdGhlciBwcm94aWVzLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKSB7XG4gICAgICAgIHN1cGVyKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0RGVzdHJveSBhIGJ1ZmZlci4gSWYgYW5kIGhvdyB5b3UgbmVlZCB0byByZWxlYXNlIHRoZSBiYWNraW5nXG4gICAgICpcdHN0b3JhZ2UgaXMgZGVmaW5lZCBieSB0aGUgYnVmZmVyIGZhY3RvcnkgaW50ZXJmYWNlLlxuICAgICAqXG4gICAgICpcdEZvciBwb3NzaWJsZSBzaWRlLWVmZmVjdHMgdG8gYSBzdXJmYWNlLCBzZWUgd2xfc3VyZmFjZS5hdHRhY2guXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLl9tYXJzaGFsbCh0aGlzLmlkLCAwLCBbXSk7XG4gICAgfVxuICAgIFswXShtZXNzYWdlKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHlpZWxkICgoX2EgPSB0aGlzLmxpc3RlbmVyKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVsZWFzZSgpKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0IGNvbnN0IFdsQnVmZmVyUHJvdG9jb2xOYW1lID0gJ3dsX2J1ZmZlcic7XG4vKipcbiAqXG4gKiAgICAgIEEgd2xfZGF0YV9vZmZlciByZXByZXNlbnRzIGEgcGllY2Ugb2YgZGF0YSBvZmZlcmVkIGZvciB0cmFuc2ZlclxuICogICAgICBieSBhbm90aGVyIGNsaWVudCAodGhlIHNvdXJjZSBjbGllbnQpLiAgSXQgaXMgdXNlZCBieSB0aGVcbiAqICAgICAgY29weS1hbmQtcGFzdGUgYW5kIGRyYWctYW5kLWRyb3AgbWVjaGFuaXNtcy4gIFRoZSBvZmZlclxuICogICAgICBkZXNjcmliZXMgdGhlIGRpZmZlcmVudCBtaW1lIHR5cGVzIHRoYXQgdGhlIGRhdGEgY2FuIGJlXG4gKiAgICAgIGNvbnZlcnRlZCB0byBhbmQgcHJvdmlkZXMgdGhlIG1lY2hhbmlzbSBmb3IgdHJhbnNmZXJyaW5nIHRoZVxuICogICAgICBkYXRhIGRpcmVjdGx5IGZyb20gdGhlIHNvdXJjZSBjbGllbnQuXG4gKlxuICovXG5leHBvcnQgY2xhc3MgV2xEYXRhT2ZmZXJQcm94eSBleHRlbmRzIFByb3h5IHtcbiAgICAvKipcbiAgICAgKiBEbyBub3QgY29uc3RydWN0IHByb3hpZXMgZGlyZWN0bHkuIEluc3RlYWQgdXNlIG9uZSBvZiB0aGUgZmFjdG9yeSBtZXRob2RzIGZyb20gb3RoZXIgcHJveGllcy5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihkaXNwbGF5LCBjb25uZWN0aW9uLCBpZCkge1xuICAgICAgICBzdXBlcihkaXNwbGF5LCBjb25uZWN0aW9uLCBpZCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdEluZGljYXRlIHRoYXQgdGhlIGNsaWVudCBjYW4gYWNjZXB0IHRoZSBnaXZlbiBtaW1lIHR5cGUsIG9yXG4gICAgICpcdE5VTEwgZm9yIG5vdCBhY2NlcHRlZC5cbiAgICAgKlxuICAgICAqXHRGb3Igb2JqZWN0cyBvZiB2ZXJzaW9uIDIgb3Igb2xkZXIsIHRoaXMgcmVxdWVzdCBpcyB1c2VkIGJ5IHRoZVxuICAgICAqXHRjbGllbnQgdG8gZ2l2ZSBmZWVkYmFjayB3aGV0aGVyIHRoZSBjbGllbnQgY2FuIHJlY2VpdmUgdGhlIGdpdmVuXG4gICAgICpcdG1pbWUgdHlwZSwgb3IgTlVMTCBpZiBub25lIGlzIGFjY2VwdGVkOyB0aGUgZmVlZGJhY2sgZG9lcyBub3RcbiAgICAgKlx0ZGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGRyYWctYW5kLWRyb3Agb3BlcmF0aW9uIHN1Y2NlZWRzIG9yIG5vdC5cbiAgICAgKlxuICAgICAqXHRGb3Igb2JqZWN0cyBvZiB2ZXJzaW9uIDMgb3IgbmV3ZXIsIHRoaXMgcmVxdWVzdCBkZXRlcm1pbmVzIHRoZVxuICAgICAqXHRmaW5hbCByZXN1bHQgb2YgdGhlIGRyYWctYW5kLWRyb3Agb3BlcmF0aW9uLiBJZiB0aGUgZW5kIHJlc3VsdFxuICAgICAqXHRpcyB0aGF0IG5vIG1pbWUgdHlwZXMgd2VyZSBhY2NlcHRlZCwgdGhlIGRyYWctYW5kLWRyb3Agb3BlcmF0aW9uXG4gICAgICpcdHdpbGwgYmUgY2FuY2VsbGVkIGFuZCB0aGUgY29ycmVzcG9uZGluZyBkcmFnIHNvdXJjZSB3aWxsIHJlY2VpdmVcbiAgICAgKlx0d2xfZGF0YV9zb3VyY2UuY2FuY2VsbGVkLiBDbGllbnRzIG1heSBzdGlsbCB1c2UgdGhpcyBldmVudCBpblxuICAgICAqXHRjb25qdW5jdGlvbiB3aXRoIHdsX2RhdGFfc291cmNlLmFjdGlvbiBmb3IgZmVlZGJhY2suXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgYWNjZXB0KHNlcmlhbCwgbWltZVR5cGUpIHtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgMCwgW3VpbnQoc2VyaWFsKSwgc3RyaW5nT3B0aW9uYWwobWltZVR5cGUpXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdFRvIHRyYW5zZmVyIHRoZSBvZmZlcmVkIGRhdGEsIHRoZSBjbGllbnQgaXNzdWVzIHRoaXMgcmVxdWVzdFxuICAgICAqXHRhbmQgaW5kaWNhdGVzIHRoZSBtaW1lIHR5cGUgaXQgd2FudHMgdG8gcmVjZWl2ZS4gIFRoZSB0cmFuc2ZlclxuICAgICAqXHRoYXBwZW5zIHRocm91Z2ggdGhlIHBhc3NlZCBmaWxlIGRlc2NyaXB0b3IgKHR5cGljYWxseSBjcmVhdGVkXG4gICAgICpcdHdpdGggdGhlIHBpcGUgc3lzdGVtIGNhbGwpLiAgVGhlIHNvdXJjZSBjbGllbnQgd3JpdGVzIHRoZSBkYXRhXG4gICAgICpcdGluIHRoZSBtaW1lIHR5cGUgcmVwcmVzZW50YXRpb24gcmVxdWVzdGVkIGFuZCB0aGVuIGNsb3NlcyB0aGVcbiAgICAgKlx0ZmlsZSBkZXNjcmlwdG9yLlxuICAgICAqXG4gICAgICpcdFRoZSByZWNlaXZpbmcgY2xpZW50IHJlYWRzIGZyb20gdGhlIHJlYWQgZW5kIG9mIHRoZSBwaXBlIHVudGlsXG4gICAgICpcdEVPRiBhbmQgdGhlbiBjbG9zZXMgaXRzIGVuZCwgYXQgd2hpY2ggcG9pbnQgdGhlIHRyYW5zZmVyIGlzXG4gICAgICpcdGNvbXBsZXRlLlxuICAgICAqXG4gICAgICpcdFRoaXMgcmVxdWVzdCBtYXkgaGFwcGVuIG11bHRpcGxlIHRpbWVzIGZvciBkaWZmZXJlbnQgbWltZSB0eXBlcyxcbiAgICAgKlx0Ym90aCBiZWZvcmUgYW5kIGFmdGVyIHdsX2RhdGFfZGV2aWNlLmRyb3AuIERyYWctYW5kLWRyb3AgZGVzdGluYXRpb25cbiAgICAgKlx0Y2xpZW50cyBtYXkgcHJlZW1wdGl2ZWx5IGZldGNoIGRhdGEgb3IgZXhhbWluZSBpdCBtb3JlIGNsb3NlbHkgdG9cbiAgICAgKlx0ZGV0ZXJtaW5lIGFjY2VwdGFuY2UuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgcmVjZWl2ZShtaW1lVHlwZSwgZmQpIHtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgMSwgW3N0cmluZyhtaW1lVHlwZSksIGZpbGVEZXNjcmlwdG9yKGZkKV0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqXHREZXN0cm95IHRoZSBkYXRhIG9mZmVyLlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgMiwgW10pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqXHROb3RpZmllcyB0aGUgY29tcG9zaXRvciB0aGF0IHRoZSBkcmFnIGRlc3RpbmF0aW9uIHN1Y2Nlc3NmdWxseVxuICAgICAqXHRmaW5pc2hlZCB0aGUgZHJhZy1hbmQtZHJvcCBvcGVyYXRpb24uXG4gICAgICpcbiAgICAgKlx0VXBvbiByZWNlaXZpbmcgdGhpcyByZXF1ZXN0LCB0aGUgY29tcG9zaXRvciB3aWxsIGVtaXRcbiAgICAgKlx0d2xfZGF0YV9zb3VyY2UuZG5kX2ZpbmlzaGVkIG9uIHRoZSBkcmFnIHNvdXJjZSBjbGllbnQuXG4gICAgICpcbiAgICAgKlx0SXQgaXMgYSBjbGllbnQgZXJyb3IgdG8gcGVyZm9ybSBvdGhlciByZXF1ZXN0cyB0aGFuXG4gICAgICpcdHdsX2RhdGFfb2ZmZXIuZGVzdHJveSBhZnRlciB0aGlzIG9uZS4gSXQgaXMgYWxzbyBhbiBlcnJvciB0byBwZXJmb3JtXG4gICAgICpcdHRoaXMgcmVxdWVzdCBhZnRlciBhIE5VTEwgbWltZSB0eXBlIGhhcyBiZWVuIHNldCBpblxuICAgICAqXHR3bF9kYXRhX29mZmVyLmFjY2VwdCBvciBubyBhY3Rpb24gd2FzIHJlY2VpdmVkIHRocm91Z2hcbiAgICAgKlx0d2xfZGF0YV9vZmZlci5hY3Rpb24uXG4gICAgICpcbiAgICAgKiBAc2luY2UgM1xuICAgICAqXG4gICAgICovXG4gICAgZmluaXNoKCkge1xuICAgICAgICB0aGlzLl9tYXJzaGFsbCh0aGlzLmlkLCAzLCBbXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdFNldHMgdGhlIGFjdGlvbnMgdGhhdCB0aGUgZGVzdGluYXRpb24gc2lkZSBjbGllbnQgc3VwcG9ydHMgZm9yXG4gICAgICpcdHRoaXMgb3BlcmF0aW9uLiBUaGlzIHJlcXVlc3QgbWF5IHRyaWdnZXIgdGhlIGVtaXNzaW9uIG9mXG4gICAgICpcdHdsX2RhdGFfc291cmNlLmFjdGlvbiBhbmQgd2xfZGF0YV9vZmZlci5hY3Rpb24gZXZlbnRzIGlmIHRoZSBjb21wb3NpdG9yXG4gICAgICpcdG5lZWRzIHRvIGNoYW5nZSB0aGUgc2VsZWN0ZWQgYWN0aW9uLlxuICAgICAqXG4gICAgICpcdFRoaXMgcmVxdWVzdCBjYW4gYmUgY2FsbGVkIG11bHRpcGxlIHRpbWVzIHRocm91Z2hvdXQgdGhlXG4gICAgICpcdGRyYWctYW5kLWRyb3Agb3BlcmF0aW9uLCB0eXBpY2FsbHkgaW4gcmVzcG9uc2UgdG8gd2xfZGF0YV9kZXZpY2UuZW50ZXJcbiAgICAgKlx0b3Igd2xfZGF0YV9kZXZpY2UubW90aW9uIGV2ZW50cy5cbiAgICAgKlxuICAgICAqXHRUaGlzIHJlcXVlc3QgZGV0ZXJtaW5lcyB0aGUgZmluYWwgcmVzdWx0IG9mIHRoZSBkcmFnLWFuZC1kcm9wXG4gICAgICpcdG9wZXJhdGlvbi4gSWYgdGhlIGVuZCByZXN1bHQgaXMgdGhhdCBubyBhY3Rpb24gaXMgYWNjZXB0ZWQsXG4gICAgICpcdHRoZSBkcmFnIHNvdXJjZSB3aWxsIHJlY2VpdmUgd2xfZHJhZ19zb3VyY2UuY2FuY2VsbGVkLlxuICAgICAqXG4gICAgICpcdFRoZSBkbmRfYWN0aW9ucyBhcmd1bWVudCBtdXN0IGNvbnRhaW4gb25seSB2YWx1ZXMgZXhwcmVzc2VkIGluIHRoZVxuICAgICAqXHR3bF9kYXRhX2RldmljZV9tYW5hZ2VyLmRuZF9hY3Rpb25zIGVudW0sIGFuZCB0aGUgcHJlZmVycmVkX2FjdGlvblxuICAgICAqXHRhcmd1bWVudCBtdXN0IG9ubHkgY29udGFpbiBvbmUgb2YgdGhvc2UgdmFsdWVzIHNldCwgb3RoZXJ3aXNlIGl0XG4gICAgICpcdHdpbGwgcmVzdWx0IGluIGEgcHJvdG9jb2wgZXJyb3IuXG4gICAgICpcbiAgICAgKlx0V2hpbGUgbWFuYWdpbmcgYW4gXCJhc2tcIiBhY3Rpb24sIHRoZSBkZXN0aW5hdGlvbiBkcmFnLWFuZC1kcm9wIGNsaWVudFxuICAgICAqXHRtYXkgcGVyZm9ybSBmdXJ0aGVyIHdsX2RhdGFfb2ZmZXIucmVjZWl2ZSByZXF1ZXN0cywgYW5kIGlzIGV4cGVjdGVkXG4gICAgICpcdHRvIHBlcmZvcm0gb25lIGxhc3Qgd2xfZGF0YV9vZmZlci5zZXRfYWN0aW9ucyByZXF1ZXN0IHdpdGggYSBwcmVmZXJyZWRcbiAgICAgKlx0YWN0aW9uIG90aGVyIHRoYW4gXCJhc2tcIiAoYW5kIG9wdGlvbmFsbHkgd2xfZGF0YV9vZmZlci5hY2NlcHQpIGJlZm9yZVxuICAgICAqXHRyZXF1ZXN0aW5nIHdsX2RhdGFfb2ZmZXIuZmluaXNoLCBpbiBvcmRlciB0byBjb252ZXkgdGhlIGFjdGlvbiBzZWxlY3RlZFxuICAgICAqXHRieSB0aGUgdXNlci4gSWYgdGhlIHByZWZlcnJlZCBhY3Rpb24gaXMgbm90IGluIHRoZVxuICAgICAqXHR3bF9kYXRhX29mZmVyLnNvdXJjZV9hY3Rpb25zIG1hc2ssIGFuIGVycm9yIHdpbGwgYmUgcmFpc2VkLlxuICAgICAqXG4gICAgICpcdElmIHRoZSBcImFza1wiIGFjdGlvbiBpcyBkaXNtaXNzZWQgKGUuZy4gdXNlciBjYW5jZWxsYXRpb24pLCB0aGUgY2xpZW50XG4gICAgICpcdGlzIGV4cGVjdGVkIHRvIHBlcmZvcm0gd2xfZGF0YV9vZmZlci5kZXN0cm95IHJpZ2h0IGF3YXkuXG4gICAgICpcbiAgICAgKlx0VGhpcyByZXF1ZXN0IGNhbiBvbmx5IGJlIG1hZGUgb24gZHJhZy1hbmQtZHJvcCBvZmZlcnMsIGEgcHJvdG9jb2wgZXJyb3JcbiAgICAgKlx0d2lsbCBiZSByYWlzZWQgb3RoZXJ3aXNlLlxuICAgICAqXG4gICAgICogQHNpbmNlIDNcbiAgICAgKlxuICAgICAqL1xuICAgIHNldEFjdGlvbnMoZG5kQWN0aW9ucywgcHJlZmVycmVkQWN0aW9uKSB7XG4gICAgICAgIHRoaXMuX21hcnNoYWxsKHRoaXMuaWQsIDQsIFt1aW50KGRuZEFjdGlvbnMpLCB1aW50KHByZWZlcnJlZEFjdGlvbildKTtcbiAgICB9XG4gICAgWzBdKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgKChfYSA9IHRoaXMubGlzdGVuZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5vZmZlcihzKG1lc3NhZ2UpKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBbMV0obWVzc2FnZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB5aWVsZCAoKF9hID0gdGhpcy5saXN0ZW5lcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnNvdXJjZUFjdGlvbnModShtZXNzYWdlKSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgWzJdKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgKChfYSA9IHRoaXMubGlzdGVuZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5hY3Rpb24odShtZXNzYWdlKSkpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnQgY29uc3QgV2xEYXRhT2ZmZXJQcm90b2NvbE5hbWUgPSAnd2xfZGF0YV9vZmZlcic7XG5leHBvcnQgdmFyIFdsRGF0YU9mZmVyRXJyb3I7XG4oZnVuY3Rpb24gKFdsRGF0YU9mZmVyRXJyb3IpIHtcbiAgICAvKipcbiAgICAgKiBmaW5pc2ggcmVxdWVzdCB3YXMgY2FsbGVkIHVudGltZWx5XG4gICAgICovXG4gICAgV2xEYXRhT2ZmZXJFcnJvcltXbERhdGFPZmZlckVycm9yW1wiX2ludmFsaWRGaW5pc2hcIl0gPSAwXSA9IFwiX2ludmFsaWRGaW5pc2hcIjtcbiAgICAvKipcbiAgICAgKiBhY3Rpb24gbWFzayBjb250YWlucyBpbnZhbGlkIHZhbHVlc1xuICAgICAqL1xuICAgIFdsRGF0YU9mZmVyRXJyb3JbV2xEYXRhT2ZmZXJFcnJvcltcIl9pbnZhbGlkQWN0aW9uTWFza1wiXSA9IDFdID0gXCJfaW52YWxpZEFjdGlvbk1hc2tcIjtcbiAgICAvKipcbiAgICAgKiBhY3Rpb24gYXJndW1lbnQgaGFzIGFuIGludmFsaWQgdmFsdWVcbiAgICAgKi9cbiAgICBXbERhdGFPZmZlckVycm9yW1dsRGF0YU9mZmVyRXJyb3JbXCJfaW52YWxpZEFjdGlvblwiXSA9IDJdID0gXCJfaW52YWxpZEFjdGlvblwiO1xuICAgIC8qKlxuICAgICAqIG9mZmVyIGRvZXNuJ3QgYWNjZXB0IHRoaXMgcmVxdWVzdFxuICAgICAqL1xuICAgIFdsRGF0YU9mZmVyRXJyb3JbV2xEYXRhT2ZmZXJFcnJvcltcIl9pbnZhbGlkT2ZmZXJcIl0gPSAzXSA9IFwiX2ludmFsaWRPZmZlclwiO1xufSkoV2xEYXRhT2ZmZXJFcnJvciB8fCAoV2xEYXRhT2ZmZXJFcnJvciA9IHt9KSk7XG4vKipcbiAqXG4gKiAgICAgIFRoZSB3bF9kYXRhX3NvdXJjZSBvYmplY3QgaXMgdGhlIHNvdXJjZSBzaWRlIG9mIGEgd2xfZGF0YV9vZmZlci5cbiAqICAgICAgSXQgaXMgY3JlYXRlZCBieSB0aGUgc291cmNlIGNsaWVudCBpbiBhIGRhdGEgdHJhbnNmZXIgYW5kXG4gKiAgICAgIHByb3ZpZGVzIGEgd2F5IHRvIGRlc2NyaWJlIHRoZSBvZmZlcmVkIGRhdGEgYW5kIGEgd2F5IHRvIHJlc3BvbmRcbiAqICAgICAgdG8gcmVxdWVzdHMgdG8gdHJhbnNmZXIgdGhlIGRhdGEuXG4gKlxuICovXG5leHBvcnQgY2xhc3MgV2xEYXRhU291cmNlUHJveHkgZXh0ZW5kcyBQcm94eSB7XG4gICAgLyoqXG4gICAgICogRG8gbm90IGNvbnN0cnVjdCBwcm94aWVzIGRpcmVjdGx5LiBJbnN0ZWFkIHVzZSBvbmUgb2YgdGhlIGZhY3RvcnkgbWV0aG9kcyBmcm9tIG90aGVyIHByb3hpZXMuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZGlzcGxheSwgY29ubmVjdGlvbiwgaWQpIHtcbiAgICAgICAgc3VwZXIoZGlzcGxheSwgY29ubmVjdGlvbiwgaWQpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqXHRUaGlzIHJlcXVlc3QgYWRkcyBhIG1pbWUgdHlwZSB0byB0aGUgc2V0IG9mIG1pbWUgdHlwZXNcbiAgICAgKlx0YWR2ZXJ0aXNlZCB0byB0YXJnZXRzLiAgQ2FuIGJlIGNhbGxlZCBzZXZlcmFsIHRpbWVzIHRvIG9mZmVyXG4gICAgICpcdG11bHRpcGxlIHR5cGVzLlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIG9mZmVyKG1pbWVUeXBlKSB7XG4gICAgICAgIHRoaXMuX21hcnNoYWxsKHRoaXMuaWQsIDAsIFtzdHJpbmcobWltZVR5cGUpXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdERlc3Ryb3kgdGhlIGRhdGEgc291cmNlLlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgMSwgW10pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqXHRTZXRzIHRoZSBhY3Rpb25zIHRoYXQgdGhlIHNvdXJjZSBzaWRlIGNsaWVudCBzdXBwb3J0cyBmb3IgdGhpc1xuICAgICAqXHRvcGVyYXRpb24uIFRoaXMgcmVxdWVzdCBtYXkgdHJpZ2dlciB3bF9kYXRhX3NvdXJjZS5hY3Rpb24gYW5kXG4gICAgICpcdHdsX2RhdGFfb2ZmZXIuYWN0aW9uIGV2ZW50cyBpZiB0aGUgY29tcG9zaXRvciBuZWVkcyB0byBjaGFuZ2UgdGhlXG4gICAgICpcdHNlbGVjdGVkIGFjdGlvbi5cbiAgICAgKlxuICAgICAqXHRUaGUgZG5kX2FjdGlvbnMgYXJndW1lbnQgbXVzdCBjb250YWluIG9ubHkgdmFsdWVzIGV4cHJlc3NlZCBpbiB0aGVcbiAgICAgKlx0d2xfZGF0YV9kZXZpY2VfbWFuYWdlci5kbmRfYWN0aW9ucyBlbnVtLCBvdGhlcndpc2UgaXQgd2lsbCByZXN1bHRcbiAgICAgKlx0aW4gYSBwcm90b2NvbCBlcnJvci5cbiAgICAgKlxuICAgICAqXHRUaGlzIHJlcXVlc3QgbXVzdCBiZSBtYWRlIG9uY2Ugb25seSwgYW5kIGNhbiBvbmx5IGJlIG1hZGUgb24gc291cmNlc1xuICAgICAqXHR1c2VkIGluIGRyYWctYW5kLWRyb3AsIHNvIGl0IG11c3QgYmUgcGVyZm9ybWVkIGJlZm9yZVxuICAgICAqXHR3bF9kYXRhX2RldmljZS5zdGFydF9kcmFnLiBBdHRlbXB0aW5nIHRvIHVzZSB0aGUgc291cmNlIG90aGVyIHRoYW5cbiAgICAgKlx0Zm9yIGRyYWctYW5kLWRyb3Agd2lsbCByYWlzZSBhIHByb3RvY29sIGVycm9yLlxuICAgICAqXG4gICAgICogQHNpbmNlIDNcbiAgICAgKlxuICAgICAqL1xuICAgIHNldEFjdGlvbnMoZG5kQWN0aW9ucykge1xuICAgICAgICB0aGlzLl9tYXJzaGFsbCh0aGlzLmlkLCAyLCBbdWludChkbmRBY3Rpb25zKV0pO1xuICAgIH1cbiAgICBbMF0obWVzc2FnZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB5aWVsZCAoKF9hID0gdGhpcy5saXN0ZW5lcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnRhcmdldChzT3B0aW9uYWwobWVzc2FnZSkpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFsxXShtZXNzYWdlKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHlpZWxkICgoX2EgPSB0aGlzLmxpc3RlbmVyKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Euc2VuZChzKG1lc3NhZ2UpLCBoKG1lc3NhZ2UpKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBbMl0obWVzc2FnZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB5aWVsZCAoKF9hID0gdGhpcy5saXN0ZW5lcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbmNlbGxlZCgpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFszXShtZXNzYWdlKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHlpZWxkICgoX2EgPSB0aGlzLmxpc3RlbmVyKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZG5kRHJvcFBlcmZvcm1lZCgpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFs0XShtZXNzYWdlKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHlpZWxkICgoX2EgPSB0aGlzLmxpc3RlbmVyKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZG5kRmluaXNoZWQoKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBbNV0obWVzc2FnZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB5aWVsZCAoKF9hID0gdGhpcy5saXN0ZW5lcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmFjdGlvbih1KG1lc3NhZ2UpKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydCBjb25zdCBXbERhdGFTb3VyY2VQcm90b2NvbE5hbWUgPSAnd2xfZGF0YV9zb3VyY2UnO1xuZXhwb3J0IHZhciBXbERhdGFTb3VyY2VFcnJvcjtcbihmdW5jdGlvbiAoV2xEYXRhU291cmNlRXJyb3IpIHtcbiAgICAvKipcbiAgICAgKiBhY3Rpb24gbWFzayBjb250YWlucyBpbnZhbGlkIHZhbHVlc1xuICAgICAqL1xuICAgIFdsRGF0YVNvdXJjZUVycm9yW1dsRGF0YVNvdXJjZUVycm9yW1wiX2ludmFsaWRBY3Rpb25NYXNrXCJdID0gMF0gPSBcIl9pbnZhbGlkQWN0aW9uTWFza1wiO1xuICAgIC8qKlxuICAgICAqIHNvdXJjZSBkb2Vzbid0IGFjY2VwdCB0aGlzIHJlcXVlc3RcbiAgICAgKi9cbiAgICBXbERhdGFTb3VyY2VFcnJvcltXbERhdGFTb3VyY2VFcnJvcltcIl9pbnZhbGlkU291cmNlXCJdID0gMV0gPSBcIl9pbnZhbGlkU291cmNlXCI7XG59KShXbERhdGFTb3VyY2VFcnJvciB8fCAoV2xEYXRhU291cmNlRXJyb3IgPSB7fSkpO1xuLyoqXG4gKlxuICogICAgICBUaGVyZSBpcyBvbmUgd2xfZGF0YV9kZXZpY2UgcGVyIHNlYXQgd2hpY2ggY2FuIGJlIG9idGFpbmVkXG4gKiAgICAgIGZyb20gdGhlIGdsb2JhbCB3bF9kYXRhX2RldmljZV9tYW5hZ2VyIHNpbmdsZXRvbi5cbiAqXG4gKiAgICAgIEEgd2xfZGF0YV9kZXZpY2UgcHJvdmlkZXMgYWNjZXNzIHRvIGludGVyLWNsaWVudCBkYXRhIHRyYW5zZmVyXG4gKiAgICAgIG1lY2hhbmlzbXMgc3VjaCBhcyBjb3B5LWFuZC1wYXN0ZSBhbmQgZHJhZy1hbmQtZHJvcC5cbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBXbERhdGFEZXZpY2VQcm94eSBleHRlbmRzIFByb3h5IHtcbiAgICAvKipcbiAgICAgKiBEbyBub3QgY29uc3RydWN0IHByb3hpZXMgZGlyZWN0bHkuIEluc3RlYWQgdXNlIG9uZSBvZiB0aGUgZmFjdG9yeSBtZXRob2RzIGZyb20gb3RoZXIgcHJveGllcy5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihkaXNwbGF5LCBjb25uZWN0aW9uLCBpZCkge1xuICAgICAgICBzdXBlcihkaXNwbGF5LCBjb25uZWN0aW9uLCBpZCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdFRoaXMgcmVxdWVzdCBhc2tzIHRoZSBjb21wb3NpdG9yIHRvIHN0YXJ0IGEgZHJhZy1hbmQtZHJvcFxuICAgICAqXHRvcGVyYXRpb24gb24gYmVoYWxmIG9mIHRoZSBjbGllbnQuXG4gICAgICpcbiAgICAgKlx0VGhlIHNvdXJjZSBhcmd1bWVudCBpcyB0aGUgZGF0YSBzb3VyY2UgdGhhdCBwcm92aWRlcyB0aGUgZGF0YVxuICAgICAqXHRmb3IgdGhlIGV2ZW50dWFsIGRhdGEgdHJhbnNmZXIuIElmIHNvdXJjZSBpcyBOVUxMLCBlbnRlciwgbGVhdmVcbiAgICAgKlx0YW5kIG1vdGlvbiBldmVudHMgYXJlIHNlbnQgb25seSB0byB0aGUgY2xpZW50IHRoYXQgaW5pdGlhdGVkIHRoZVxuICAgICAqXHRkcmFnIGFuZCB0aGUgY2xpZW50IGlzIGV4cGVjdGVkIHRvIGhhbmRsZSB0aGUgZGF0YSBwYXNzaW5nXG4gICAgICpcdGludGVybmFsbHkuXG4gICAgICpcbiAgICAgKlx0VGhlIG9yaWdpbiBzdXJmYWNlIGlzIHRoZSBzdXJmYWNlIHdoZXJlIHRoZSBkcmFnIG9yaWdpbmF0ZXMgYW5kXG4gICAgICpcdHRoZSBjbGllbnQgbXVzdCBoYXZlIGFuIGFjdGl2ZSBpbXBsaWNpdCBncmFiIHRoYXQgbWF0Y2hlcyB0aGVcbiAgICAgKlx0c2VyaWFsLlxuICAgICAqXG4gICAgICpcdFRoZSBpY29uIHN1cmZhY2UgaXMgYW4gb3B0aW9uYWwgKGNhbiBiZSBOVUxMKSBzdXJmYWNlIHRoYXRcbiAgICAgKlx0cHJvdmlkZXMgYW4gaWNvbiB0byBiZSBtb3ZlZCBhcm91bmQgd2l0aCB0aGUgY3Vyc29yLiAgSW5pdGlhbGx5LFxuICAgICAqXHR0aGUgdG9wLWxlZnQgY29ybmVyIG9mIHRoZSBpY29uIHN1cmZhY2UgaXMgcGxhY2VkIGF0IHRoZSBjdXJzb3JcbiAgICAgKlx0aG90c3BvdCwgYnV0IHN1YnNlcXVlbnQgd2xfc3VyZmFjZS5hdHRhY2ggcmVxdWVzdCBjYW4gbW92ZSB0aGVcbiAgICAgKlx0cmVsYXRpdmUgcG9zaXRpb24uIEF0dGFjaCByZXF1ZXN0cyBtdXN0IGJlIGNvbmZpcm1lZCB3aXRoXG4gICAgICpcdHdsX3N1cmZhY2UuY29tbWl0IGFzIHVzdWFsLiBUaGUgaWNvbiBzdXJmYWNlIGlzIGdpdmVuIHRoZSByb2xlIG9mXG4gICAgICpcdGEgZHJhZy1hbmQtZHJvcCBpY29uLiBJZiB0aGUgaWNvbiBzdXJmYWNlIGFscmVhZHkgaGFzIGFub3RoZXIgcm9sZSxcbiAgICAgKlx0aXQgcmFpc2VzIGEgcHJvdG9jb2wgZXJyb3IuXG4gICAgICpcbiAgICAgKlx0VGhlIGN1cnJlbnQgYW5kIHBlbmRpbmcgaW5wdXQgcmVnaW9ucyBvZiB0aGUgaWNvbiB3bF9zdXJmYWNlIGFyZVxuICAgICAqXHRjbGVhcmVkLCBhbmQgd2xfc3VyZmFjZS5zZXRfaW5wdXRfcmVnaW9uIGlzIGlnbm9yZWQgdW50aWwgdGhlXG4gICAgICpcdHdsX3N1cmZhY2UgaXMgbm8gbG9uZ2VyIHVzZWQgYXMgdGhlIGljb24gc3VyZmFjZS4gV2hlbiB0aGUgdXNlXG4gICAgICpcdGFzIGFuIGljb24gZW5kcywgdGhlIGN1cnJlbnQgYW5kIHBlbmRpbmcgaW5wdXQgcmVnaW9ucyBiZWNvbWVcbiAgICAgKlx0dW5kZWZpbmVkLCBhbmQgdGhlIHdsX3N1cmZhY2UgaXMgdW5tYXBwZWQuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgc3RhcnREcmFnKHNvdXJjZSwgb3JpZ2luLCBpY29uLCBzZXJpYWwpIHtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgMCwgW29iamVjdE9wdGlvbmFsKHNvdXJjZSksIG9iamVjdChvcmlnaW4pLCBvYmplY3RPcHRpb25hbChpY29uKSwgdWludChzZXJpYWwpXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdFRoaXMgcmVxdWVzdCBhc2tzIHRoZSBjb21wb3NpdG9yIHRvIHNldCB0aGUgc2VsZWN0aW9uXG4gICAgICpcdHRvIHRoZSBkYXRhIGZyb20gdGhlIHNvdXJjZSBvbiBiZWhhbGYgb2YgdGhlIGNsaWVudC5cbiAgICAgKlxuICAgICAqXHRUbyB1bnNldCB0aGUgc2VsZWN0aW9uLCBzZXQgdGhlIHNvdXJjZSB0byBOVUxMLlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIHNldFNlbGVjdGlvbihzb3VyY2UsIHNlcmlhbCkge1xuICAgICAgICB0aGlzLl9tYXJzaGFsbCh0aGlzLmlkLCAxLCBbb2JqZWN0T3B0aW9uYWwoc291cmNlKSwgdWludChzZXJpYWwpXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdFRoaXMgcmVxdWVzdCBkZXN0cm95cyB0aGUgZGF0YSBkZXZpY2UuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMlxuICAgICAqXG4gICAgICovXG4gICAgcmVsZWFzZSgpIHtcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLl9tYXJzaGFsbCh0aGlzLmlkLCAyLCBbXSk7XG4gICAgfVxuICAgIFswXShtZXNzYWdlKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHlpZWxkICgoX2EgPSB0aGlzLmxpc3RlbmVyKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZGF0YU9mZmVyKG5ldyBXbERhdGFPZmZlclByb3h5KHRoaXMuZGlzcGxheSwgdGhpcy5fY29ubmVjdGlvbiwgbihtZXNzYWdlKSkpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFsxXShtZXNzYWdlKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHlpZWxkICgoX2EgPSB0aGlzLmxpc3RlbmVyKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZW50ZXIodShtZXNzYWdlKSwgbyhtZXNzYWdlLCB0aGlzLl9jb25uZWN0aW9uKSwgZihtZXNzYWdlKSwgZihtZXNzYWdlKSwgb09wdGlvbmFsKG1lc3NhZ2UsIHRoaXMuX2Nvbm5lY3Rpb24pKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBbMl0obWVzc2FnZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB5aWVsZCAoKF9hID0gdGhpcy5saXN0ZW5lcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmxlYXZlKCkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgWzNdKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgKChfYSA9IHRoaXMubGlzdGVuZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5tb3Rpb24odShtZXNzYWdlKSwgZihtZXNzYWdlKSwgZihtZXNzYWdlKSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgWzRdKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgKChfYSA9IHRoaXMubGlzdGVuZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5kcm9wKCkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgWzVdKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgKChfYSA9IHRoaXMubGlzdGVuZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5zZWxlY3Rpb24ob09wdGlvbmFsKG1lc3NhZ2UsIHRoaXMuX2Nvbm5lY3Rpb24pKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydCBjb25zdCBXbERhdGFEZXZpY2VQcm90b2NvbE5hbWUgPSAnd2xfZGF0YV9kZXZpY2UnO1xuZXhwb3J0IHZhciBXbERhdGFEZXZpY2VFcnJvcjtcbihmdW5jdGlvbiAoV2xEYXRhRGV2aWNlRXJyb3IpIHtcbiAgICAvKipcbiAgICAgKiBnaXZlbiB3bF9zdXJmYWNlIGhhcyBhbm90aGVyIHJvbGVcbiAgICAgKi9cbiAgICBXbERhdGFEZXZpY2VFcnJvcltXbERhdGFEZXZpY2VFcnJvcltcIl9yb2xlXCJdID0gMF0gPSBcIl9yb2xlXCI7XG59KShXbERhdGFEZXZpY2VFcnJvciB8fCAoV2xEYXRhRGV2aWNlRXJyb3IgPSB7fSkpO1xuLyoqXG4gKlxuICogICAgICBUaGUgd2xfZGF0YV9kZXZpY2VfbWFuYWdlciBpcyBhIHNpbmdsZXRvbiBnbG9iYWwgb2JqZWN0IHRoYXRcbiAqICAgICAgcHJvdmlkZXMgYWNjZXNzIHRvIGludGVyLWNsaWVudCBkYXRhIHRyYW5zZmVyIG1lY2hhbmlzbXMgc3VjaCBhc1xuICogICAgICBjb3B5LWFuZC1wYXN0ZSBhbmQgZHJhZy1hbmQtZHJvcC4gIFRoZXNlIG1lY2hhbmlzbXMgYXJlIHRpZWQgdG9cbiAqICAgICAgYSB3bF9zZWF0IGFuZCB0aGlzIGludGVyZmFjZSBsZXRzIGEgY2xpZW50IGdldCBhIHdsX2RhdGFfZGV2aWNlXG4gKiAgICAgIGNvcnJlc3BvbmRpbmcgdG8gYSB3bF9zZWF0LlxuICpcbiAqICAgICAgRGVwZW5kaW5nIG9uIHRoZSB2ZXJzaW9uIGJvdW5kLCB0aGUgb2JqZWN0cyBjcmVhdGVkIGZyb20gdGhlIGJvdW5kXG4gKiAgICAgIHdsX2RhdGFfZGV2aWNlX21hbmFnZXIgb2JqZWN0IHdpbGwgaGF2ZSBkaWZmZXJlbnQgcmVxdWlyZW1lbnRzIGZvclxuICogICAgICBmdW5jdGlvbmluZyBwcm9wZXJseS4gU2VlIHdsX2RhdGFfc291cmNlLnNldF9hY3Rpb25zLFxuICogICAgICB3bF9kYXRhX29mZmVyLmFjY2VwdCBhbmQgd2xfZGF0YV9vZmZlci5maW5pc2ggZm9yIGRldGFpbHMuXG4gKlxuICovXG5leHBvcnQgY2xhc3MgV2xEYXRhRGV2aWNlTWFuYWdlclByb3h5IGV4dGVuZHMgUHJveHkge1xuICAgIC8qKlxuICAgICAqIERvIG5vdCBjb25zdHJ1Y3QgcHJveGllcyBkaXJlY3RseS4gSW5zdGVhZCB1c2Ugb25lIG9mIHRoZSBmYWN0b3J5IG1ldGhvZHMgZnJvbSBvdGhlciBwcm94aWVzLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKSB7XG4gICAgICAgIHN1cGVyKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0Q3JlYXRlIGEgbmV3IGRhdGEgc291cmNlLlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIGNyZWF0ZURhdGFTb3VyY2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXJzaGFsbENvbnN0cnVjdG9yKHRoaXMuaWQsIDAsIFdlc3RmaWVsZC5XbERhdGFTb3VyY2VQcm94eSwgW25ld09iamVjdCgpXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdENyZWF0ZSBhIG5ldyBkYXRhIGRldmljZSBmb3IgYSBnaXZlbiBzZWF0LlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIGdldERhdGFEZXZpY2Uoc2VhdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWFyc2hhbGxDb25zdHJ1Y3Rvcih0aGlzLmlkLCAxLCBXZXN0ZmllbGQuV2xEYXRhRGV2aWNlUHJveHksIFtuZXdPYmplY3QoKSwgb2JqZWN0KHNlYXQpXSk7XG4gICAgfVxufVxuZXhwb3J0IGNvbnN0IFdsRGF0YURldmljZU1hbmFnZXJQcm90b2NvbE5hbWUgPSAnd2xfZGF0YV9kZXZpY2VfbWFuYWdlcic7XG5leHBvcnQgdmFyIFdsRGF0YURldmljZU1hbmFnZXJEbmRBY3Rpb247XG4oZnVuY3Rpb24gKFdsRGF0YURldmljZU1hbmFnZXJEbmRBY3Rpb24pIHtcbiAgICAvKipcbiAgICAgKiBubyBhY3Rpb25cbiAgICAgKi9cbiAgICBXbERhdGFEZXZpY2VNYW5hZ2VyRG5kQWN0aW9uW1dsRGF0YURldmljZU1hbmFnZXJEbmRBY3Rpb25bXCJfbm9uZVwiXSA9IDBdID0gXCJfbm9uZVwiO1xuICAgIC8qKlxuICAgICAqIGNvcHkgYWN0aW9uXG4gICAgICovXG4gICAgV2xEYXRhRGV2aWNlTWFuYWdlckRuZEFjdGlvbltXbERhdGFEZXZpY2VNYW5hZ2VyRG5kQWN0aW9uW1wiX2NvcHlcIl0gPSAxXSA9IFwiX2NvcHlcIjtcbiAgICAvKipcbiAgICAgKiBtb3ZlIGFjdGlvblxuICAgICAqL1xuICAgIFdsRGF0YURldmljZU1hbmFnZXJEbmRBY3Rpb25bV2xEYXRhRGV2aWNlTWFuYWdlckRuZEFjdGlvbltcIl9tb3ZlXCJdID0gMl0gPSBcIl9tb3ZlXCI7XG4gICAgLyoqXG4gICAgICogYXNrIGFjdGlvblxuICAgICAqL1xuICAgIFdsRGF0YURldmljZU1hbmFnZXJEbmRBY3Rpb25bV2xEYXRhRGV2aWNlTWFuYWdlckRuZEFjdGlvbltcIl9hc2tcIl0gPSA0XSA9IFwiX2Fza1wiO1xufSkoV2xEYXRhRGV2aWNlTWFuYWdlckRuZEFjdGlvbiB8fCAoV2xEYXRhRGV2aWNlTWFuYWdlckRuZEFjdGlvbiA9IHt9KSk7XG4vKipcbiAqXG4gKiAgICAgIFRoaXMgaW50ZXJmYWNlIGlzIGltcGxlbWVudGVkIGJ5IHNlcnZlcnMgdGhhdCBwcm92aWRlXG4gKiAgICAgIGRlc2t0b3Atc3R5bGUgdXNlciBpbnRlcmZhY2VzLlxuICpcbiAqICAgICAgSXQgYWxsb3dzIGNsaWVudHMgdG8gYXNzb2NpYXRlIGEgd2xfc2hlbGxfc3VyZmFjZSB3aXRoXG4gKiAgICAgIGEgYmFzaWMgc3VyZmFjZS5cbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBXbFNoZWxsUHJveHkgZXh0ZW5kcyBQcm94eSB7XG4gICAgLyoqXG4gICAgICogRG8gbm90IGNvbnN0cnVjdCBwcm94aWVzIGRpcmVjdGx5LiBJbnN0ZWFkIHVzZSBvbmUgb2YgdGhlIGZhY3RvcnkgbWV0aG9kcyBmcm9tIG90aGVyIHByb3hpZXMuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZGlzcGxheSwgY29ubmVjdGlvbiwgaWQpIHtcbiAgICAgICAgc3VwZXIoZGlzcGxheSwgY29ubmVjdGlvbiwgaWQpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqXHRDcmVhdGUgYSBzaGVsbCBzdXJmYWNlIGZvciBhbiBleGlzdGluZyBzdXJmYWNlLiBUaGlzIGdpdmVzXG4gICAgICpcdHRoZSB3bF9zdXJmYWNlIHRoZSByb2xlIG9mIGEgc2hlbGwgc3VyZmFjZS4gSWYgdGhlIHdsX3N1cmZhY2VcbiAgICAgKlx0YWxyZWFkeSBoYXMgYW5vdGhlciByb2xlLCBpdCByYWlzZXMgYSBwcm90b2NvbCBlcnJvci5cbiAgICAgKlxuICAgICAqXHRPbmx5IG9uZSBzaGVsbCBzdXJmYWNlIGNhbiBiZSBhc3NvY2lhdGVkIHdpdGggYSBnaXZlbiBzdXJmYWNlLlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIGdldFNoZWxsU3VyZmFjZShzdXJmYWNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXJzaGFsbENvbnN0cnVjdG9yKHRoaXMuaWQsIDAsIFdlc3RmaWVsZC5XbFNoZWxsU3VyZmFjZVByb3h5LCBbbmV3T2JqZWN0KCksIG9iamVjdChzdXJmYWNlKV0pO1xuICAgIH1cbn1cbmV4cG9ydCBjb25zdCBXbFNoZWxsUHJvdG9jb2xOYW1lID0gJ3dsX3NoZWxsJztcbmV4cG9ydCB2YXIgV2xTaGVsbEVycm9yO1xuKGZ1bmN0aW9uIChXbFNoZWxsRXJyb3IpIHtcbiAgICAvKipcbiAgICAgKiBnaXZlbiB3bF9zdXJmYWNlIGhhcyBhbm90aGVyIHJvbGVcbiAgICAgKi9cbiAgICBXbFNoZWxsRXJyb3JbV2xTaGVsbEVycm9yW1wiX3JvbGVcIl0gPSAwXSA9IFwiX3JvbGVcIjtcbn0pKFdsU2hlbGxFcnJvciB8fCAoV2xTaGVsbEVycm9yID0ge30pKTtcbi8qKlxuICpcbiAqICAgICAgQW4gaW50ZXJmYWNlIHRoYXQgbWF5IGJlIGltcGxlbWVudGVkIGJ5IGEgd2xfc3VyZmFjZSwgZm9yXG4gKiAgICAgIGltcGxlbWVudGF0aW9ucyB0aGF0IHByb3ZpZGUgYSBkZXNrdG9wLXN0eWxlIHVzZXIgaW50ZXJmYWNlLlxuICpcbiAqICAgICAgSXQgcHJvdmlkZXMgcmVxdWVzdHMgdG8gdHJlYXQgc3VyZmFjZXMgbGlrZSB0b3BsZXZlbCwgZnVsbHNjcmVlblxuICogICAgICBvciBwb3B1cCB3aW5kb3dzLCBtb3ZlLCByZXNpemUgb3IgbWF4aW1pemUgdGhlbSwgYXNzb2NpYXRlXG4gKiAgICAgIG1ldGFkYXRhIGxpa2UgdGl0bGUgYW5kIGNsYXNzLCBldGMuXG4gKlxuICogICAgICBPbiB0aGUgc2VydmVyIHNpZGUgdGhlIG9iamVjdCBpcyBhdXRvbWF0aWNhbGx5IGRlc3Ryb3llZCB3aGVuXG4gKiAgICAgIHRoZSByZWxhdGVkIHdsX3N1cmZhY2UgaXMgZGVzdHJveWVkLiBPbiB0aGUgY2xpZW50IHNpZGUsXG4gKiAgICAgIHdsX3NoZWxsX3N1cmZhY2VfZGVzdHJveSgpIG11c3QgYmUgY2FsbGVkIGJlZm9yZSBkZXN0cm95aW5nXG4gKiAgICAgIHRoZSB3bF9zdXJmYWNlIG9iamVjdC5cbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBXbFNoZWxsU3VyZmFjZVByb3h5IGV4dGVuZHMgUHJveHkge1xuICAgIC8qKlxuICAgICAqIERvIG5vdCBjb25zdHJ1Y3QgcHJveGllcyBkaXJlY3RseS4gSW5zdGVhZCB1c2Ugb25lIG9mIHRoZSBmYWN0b3J5IG1ldGhvZHMgZnJvbSBvdGhlciBwcm94aWVzLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKSB7XG4gICAgICAgIHN1cGVyKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0QSBjbGllbnQgbXVzdCByZXNwb25kIHRvIGEgcGluZyBldmVudCB3aXRoIGEgcG9uZyByZXF1ZXN0IG9yXG4gICAgICpcdHRoZSBjbGllbnQgbWF5IGJlIGRlZW1lZCB1bnJlc3BvbnNpdmUuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgcG9uZyhzZXJpYWwpIHtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgMCwgW3VpbnQoc2VyaWFsKV0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqXHRTdGFydCBhIHBvaW50ZXItZHJpdmVuIG1vdmUgb2YgdGhlIHN1cmZhY2UuXG4gICAgICpcbiAgICAgKlx0VGhpcyByZXF1ZXN0IG11c3QgYmUgdXNlZCBpbiByZXNwb25zZSB0byBhIGJ1dHRvbiBwcmVzcyBldmVudC5cbiAgICAgKlx0VGhlIHNlcnZlciBtYXkgaWdub3JlIG1vdmUgcmVxdWVzdHMgZGVwZW5kaW5nIG9uIHRoZSBzdGF0ZSBvZlxuICAgICAqXHR0aGUgc3VyZmFjZSAoZS5nLiBmdWxsc2NyZWVuIG9yIG1heGltaXplZCkuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgbW92ZShzZWF0LCBzZXJpYWwpIHtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgMSwgW29iamVjdChzZWF0KSwgdWludChzZXJpYWwpXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdFN0YXJ0IGEgcG9pbnRlci1kcml2ZW4gcmVzaXppbmcgb2YgdGhlIHN1cmZhY2UuXG4gICAgICpcbiAgICAgKlx0VGhpcyByZXF1ZXN0IG11c3QgYmUgdXNlZCBpbiByZXNwb25zZSB0byBhIGJ1dHRvbiBwcmVzcyBldmVudC5cbiAgICAgKlx0VGhlIHNlcnZlciBtYXkgaWdub3JlIHJlc2l6ZSByZXF1ZXN0cyBkZXBlbmRpbmcgb24gdGhlIHN0YXRlIG9mXG4gICAgICpcdHRoZSBzdXJmYWNlIChlLmcuIGZ1bGxzY3JlZW4gb3IgbWF4aW1pemVkKS5cbiAgICAgKlxuICAgICAqIEBzaW5jZSAxXG4gICAgICpcbiAgICAgKi9cbiAgICByZXNpemUoc2VhdCwgc2VyaWFsLCBlZGdlcykge1xuICAgICAgICB0aGlzLl9tYXJzaGFsbCh0aGlzLmlkLCAyLCBbb2JqZWN0KHNlYXQpLCB1aW50KHNlcmlhbCksIHVpbnQoZWRnZXMpXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdE1hcCB0aGUgc3VyZmFjZSBhcyBhIHRvcGxldmVsIHN1cmZhY2UuXG4gICAgICpcbiAgICAgKlx0QSB0b3BsZXZlbCBzdXJmYWNlIGlzIG5vdCBmdWxsc2NyZWVuLCBtYXhpbWl6ZWQgb3IgdHJhbnNpZW50LlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIHNldFRvcGxldmVsKCkge1xuICAgICAgICB0aGlzLl9tYXJzaGFsbCh0aGlzLmlkLCAzLCBbXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdE1hcCB0aGUgc3VyZmFjZSByZWxhdGl2ZSB0byBhbiBleGlzdGluZyBzdXJmYWNlLlxuICAgICAqXG4gICAgICpcdFRoZSB4IGFuZCB5IGFyZ3VtZW50cyBzcGVjaWZ5IHRoZSBsb2NhdGlvbiBvZiB0aGUgdXBwZXIgbGVmdFxuICAgICAqXHRjb3JuZXIgb2YgdGhlIHN1cmZhY2UgcmVsYXRpdmUgdG8gdGhlIHVwcGVyIGxlZnQgY29ybmVyIG9mIHRoZVxuICAgICAqXHRwYXJlbnQgc3VyZmFjZSwgaW4gc3VyZmFjZS1sb2NhbCBjb29yZGluYXRlcy5cbiAgICAgKlxuICAgICAqXHRUaGUgZmxhZ3MgYXJndW1lbnQgY29udHJvbHMgZGV0YWlscyBvZiB0aGUgdHJhbnNpZW50IGJlaGF2aW91ci5cbiAgICAgKlxuICAgICAqIEBzaW5jZSAxXG4gICAgICpcbiAgICAgKi9cbiAgICBzZXRUcmFuc2llbnQocGFyZW50LCB4LCB5LCBmbGFncykge1xuICAgICAgICB0aGlzLl9tYXJzaGFsbCh0aGlzLmlkLCA0LCBbb2JqZWN0KHBhcmVudCksIGludCh4KSwgaW50KHkpLCB1aW50KGZsYWdzKV0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqXHRNYXAgdGhlIHN1cmZhY2UgYXMgYSBmdWxsc2NyZWVuIHN1cmZhY2UuXG4gICAgICpcbiAgICAgKlx0SWYgYW4gb3V0cHV0IHBhcmFtZXRlciBpcyBnaXZlbiB0aGVuIHRoZSBzdXJmYWNlIHdpbGwgYmUgbWFkZVxuICAgICAqXHRmdWxsc2NyZWVuIG9uIHRoYXQgb3V0cHV0LiBJZiB0aGUgY2xpZW50IGRvZXMgbm90IHNwZWNpZnkgdGhlXG4gICAgICpcdG91dHB1dCB0aGVuIHRoZSBjb21wb3NpdG9yIHdpbGwgYXBwbHkgaXRzIHBvbGljeSAtIHVzdWFsbHlcbiAgICAgKlx0Y2hvb3NpbmcgdGhlIG91dHB1dCBvbiB3aGljaCB0aGUgc3VyZmFjZSBoYXMgdGhlIGJpZ2dlc3Qgc3VyZmFjZVxuICAgICAqXHRhcmVhLlxuICAgICAqXG4gICAgICpcdFRoZSBjbGllbnQgbWF5IHNwZWNpZnkgYSBtZXRob2QgdG8gcmVzb2x2ZSBhIHNpemUgY29uZmxpY3RcbiAgICAgKlx0YmV0d2VlbiB0aGUgb3V0cHV0IHNpemUgYW5kIHRoZSBzdXJmYWNlIHNpemUgLSB0aGlzIGlzIHByb3ZpZGVkXG4gICAgICpcdHRocm91Z2ggdGhlIG1ldGhvZCBwYXJhbWV0ZXIuXG4gICAgICpcbiAgICAgKlx0VGhlIGZyYW1lcmF0ZSBwYXJhbWV0ZXIgaXMgdXNlZCBvbmx5IHdoZW4gdGhlIG1ldGhvZCBpcyBzZXRcbiAgICAgKlx0dG8gXCJkcml2ZXJcIiwgdG8gaW5kaWNhdGUgdGhlIHByZWZlcnJlZCBmcmFtZXJhdGUuIEEgdmFsdWUgb2YgMFxuICAgICAqXHRpbmRpY2F0ZXMgdGhhdCB0aGUgY2xpZW50IGRvZXMgbm90IGNhcmUgYWJvdXQgZnJhbWVyYXRlLiAgVGhlXG4gICAgICpcdGZyYW1lcmF0ZSBpcyBzcGVjaWZpZWQgaW4gbUh6LCB0aGF0IGlzIGZyYW1lcmF0ZSBvZiA2MDAwMCBpcyA2MEh6LlxuICAgICAqXG4gICAgICpcdEEgbWV0aG9kIG9mIFwic2NhbGVcIiBvciBcImRyaXZlclwiIGltcGxpZXMgYSBzY2FsaW5nIG9wZXJhdGlvbiBvZlxuICAgICAqXHR0aGUgc3VyZmFjZSwgZWl0aGVyIHZpYSBhIGRpcmVjdCBzY2FsaW5nIG9wZXJhdGlvbiBvciBhIGNoYW5nZSBvZlxuICAgICAqXHR0aGUgb3V0cHV0IG1vZGUuIFRoaXMgd2lsbCBvdmVycmlkZSBhbnkga2luZCBvZiBvdXRwdXQgc2NhbGluZywgc29cbiAgICAgKlx0dGhhdCBtYXBwaW5nIGEgc3VyZmFjZSB3aXRoIGEgYnVmZmVyIHNpemUgZXF1YWwgdG8gdGhlIG1vZGUgY2FuXG4gICAgICpcdGZpbGwgdGhlIHNjcmVlbiBpbmRlcGVuZGVudCBvZiBidWZmZXJfc2NhbGUuXG4gICAgICpcbiAgICAgKlx0QSBtZXRob2Qgb2YgXCJmaWxsXCIgbWVhbnMgd2UgZG9uJ3Qgc2NhbGUgdXAgdGhlIGJ1ZmZlciwgaG93ZXZlclxuICAgICAqXHRhbnkgb3V0cHV0IHNjYWxlIGlzIGFwcGxpZWQuIFRoaXMgbWVhbnMgdGhhdCB5b3UgbWF5IHJ1biBpbnRvXG4gICAgICpcdGFuIGVkZ2UgY2FzZSB3aGVyZSB0aGUgYXBwbGljYXRpb24gbWFwcyBhIGJ1ZmZlciB3aXRoIHRoZSBzYW1lXG4gICAgICpcdHNpemUgb2YgdGhlIG91dHB1dCBtb2RlIGJ1dCBidWZmZXJfc2NhbGUgMSAodGh1cyBtYWtpbmcgYVxuICAgICAqXHRzdXJmYWNlIGxhcmdlciB0aGFuIHRoZSBvdXRwdXQpLiBJbiB0aGlzIGNhc2UgaXQgaXMgYWxsb3dlZCB0b1xuICAgICAqXHRkb3duc2NhbGUgdGhlIHJlc3VsdHMgdG8gZml0IHRoZSBzY3JlZW4uXG4gICAgICpcbiAgICAgKlx0VGhlIGNvbXBvc2l0b3IgbXVzdCByZXBseSB0byB0aGlzIHJlcXVlc3Qgd2l0aCBhIGNvbmZpZ3VyZSBldmVudFxuICAgICAqXHR3aXRoIHRoZSBkaW1lbnNpb25zIGZvciB0aGUgb3V0cHV0IG9uIHdoaWNoIHRoZSBzdXJmYWNlIHdpbGxcbiAgICAgKlx0YmUgbWFkZSBmdWxsc2NyZWVuLlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIHNldEZ1bGxzY3JlZW4obWV0aG9kLCBmcmFtZXJhdGUsIG91dHB1dCkge1xuICAgICAgICB0aGlzLl9tYXJzaGFsbCh0aGlzLmlkLCA1LCBbdWludChtZXRob2QpLCB1aW50KGZyYW1lcmF0ZSksIG9iamVjdE9wdGlvbmFsKG91dHB1dCldKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0TWFwIHRoZSBzdXJmYWNlIGFzIGEgcG9wdXAuXG4gICAgICpcbiAgICAgKlx0QSBwb3B1cCBzdXJmYWNlIGlzIGEgdHJhbnNpZW50IHN1cmZhY2Ugd2l0aCBhbiBhZGRlZCBwb2ludGVyXG4gICAgICpcdGdyYWIuXG4gICAgICpcbiAgICAgKlx0QW4gZXhpc3RpbmcgaW1wbGljaXQgZ3JhYiB3aWxsIGJlIGNoYW5nZWQgdG8gb3duZXItZXZlbnRzIG1vZGUsXG4gICAgICpcdGFuZCB0aGUgcG9wdXAgZ3JhYiB3aWxsIGNvbnRpbnVlIGFmdGVyIHRoZSBpbXBsaWNpdCBncmFiIGVuZHNcbiAgICAgKlx0KGkuZS4gcmVsZWFzaW5nIHRoZSBtb3VzZSBidXR0b24gZG9lcyBub3QgY2F1c2UgdGhlIHBvcHVwIHRvXG4gICAgICpcdGJlIHVubWFwcGVkKS5cbiAgICAgKlxuICAgICAqXHRUaGUgcG9wdXAgZ3JhYiBjb250aW51ZXMgdW50aWwgdGhlIHdpbmRvdyBpcyBkZXN0cm95ZWQgb3IgYVxuICAgICAqXHRtb3VzZSBidXR0b24gaXMgcHJlc3NlZCBpbiBhbnkgb3RoZXIgY2xpZW50J3Mgd2luZG93LiBBIGNsaWNrXG4gICAgICpcdGluIGFueSBvZiB0aGUgY2xpZW50J3Mgc3VyZmFjZXMgaXMgcmVwb3J0ZWQgYXMgbm9ybWFsLCBob3dldmVyLFxuICAgICAqXHRjbGlja3MgaW4gb3RoZXIgY2xpZW50cycgc3VyZmFjZXMgd2lsbCBiZSBkaXNjYXJkZWQgYW5kIHRyaWdnZXJcbiAgICAgKlx0dGhlIGNhbGxiYWNrLlxuICAgICAqXG4gICAgICpcdFRoZSB4IGFuZCB5IGFyZ3VtZW50cyBzcGVjaWZ5IHRoZSBsb2NhdGlvbiBvZiB0aGUgdXBwZXIgbGVmdFxuICAgICAqXHRjb3JuZXIgb2YgdGhlIHN1cmZhY2UgcmVsYXRpdmUgdG8gdGhlIHVwcGVyIGxlZnQgY29ybmVyIG9mIHRoZVxuICAgICAqXHRwYXJlbnQgc3VyZmFjZSwgaW4gc3VyZmFjZS1sb2NhbCBjb29yZGluYXRlcy5cbiAgICAgKlxuICAgICAqIEBzaW5jZSAxXG4gICAgICpcbiAgICAgKi9cbiAgICBzZXRQb3B1cChzZWF0LCBzZXJpYWwsIHBhcmVudCwgeCwgeSwgZmxhZ3MpIHtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgNiwgW29iamVjdChzZWF0KSwgdWludChzZXJpYWwpLCBvYmplY3QocGFyZW50KSwgaW50KHgpLCBpbnQoeSksIHVpbnQoZmxhZ3MpXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdE1hcCB0aGUgc3VyZmFjZSBhcyBhIG1heGltaXplZCBzdXJmYWNlLlxuICAgICAqXG4gICAgICpcdElmIGFuIG91dHB1dCBwYXJhbWV0ZXIgaXMgZ2l2ZW4gdGhlbiB0aGUgc3VyZmFjZSB3aWxsIGJlXG4gICAgICpcdG1heGltaXplZCBvbiB0aGF0IG91dHB1dC4gSWYgdGhlIGNsaWVudCBkb2VzIG5vdCBzcGVjaWZ5IHRoZVxuICAgICAqXHRvdXRwdXQgdGhlbiB0aGUgY29tcG9zaXRvciB3aWxsIGFwcGx5IGl0cyBwb2xpY3kgLSB1c3VhbGx5XG4gICAgICpcdGNob29zaW5nIHRoZSBvdXRwdXQgb24gd2hpY2ggdGhlIHN1cmZhY2UgaGFzIHRoZSBiaWdnZXN0IHN1cmZhY2VcbiAgICAgKlx0YXJlYS5cbiAgICAgKlxuICAgICAqXHRUaGUgY29tcG9zaXRvciB3aWxsIHJlcGx5IHdpdGggYSBjb25maWd1cmUgZXZlbnQgdGVsbGluZ1xuICAgICAqXHR0aGUgZXhwZWN0ZWQgbmV3IHN1cmZhY2Ugc2l6ZS4gVGhlIG9wZXJhdGlvbiBpcyBjb21wbGV0ZWRcbiAgICAgKlx0b24gdGhlIG5leHQgYnVmZmVyIGF0dGFjaCB0byB0aGlzIHN1cmZhY2UuXG4gICAgICpcbiAgICAgKlx0QSBtYXhpbWl6ZWQgc3VyZmFjZSB0eXBpY2FsbHkgZmlsbHMgdGhlIGVudGlyZSBvdXRwdXQgaXQgaXNcbiAgICAgKlx0Ym91bmQgdG8sIGV4Y2VwdCBmb3IgZGVza3RvcCBlbGVtZW50cyBzdWNoIGFzIHBhbmVscy4gVGhpcyBpc1xuICAgICAqXHR0aGUgbWFpbiBkaWZmZXJlbmNlIGJldHdlZW4gYSBtYXhpbWl6ZWQgc2hlbGwgc3VyZmFjZSBhbmQgYVxuICAgICAqXHRmdWxsc2NyZWVuIHNoZWxsIHN1cmZhY2UuXG4gICAgICpcbiAgICAgKlx0VGhlIGRldGFpbHMgZGVwZW5kIG9uIHRoZSBjb21wb3NpdG9yIGltcGxlbWVudGF0aW9uLlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIHNldE1heGltaXplZChvdXRwdXQpIHtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgNywgW29iamVjdE9wdGlvbmFsKG91dHB1dCldKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0U2V0IGEgc2hvcnQgdGl0bGUgZm9yIHRoZSBzdXJmYWNlLlxuICAgICAqXG4gICAgICpcdFRoaXMgc3RyaW5nIG1heSBiZSB1c2VkIHRvIGlkZW50aWZ5IHRoZSBzdXJmYWNlIGluIGEgdGFzayBiYXIsXG4gICAgICpcdHdpbmRvdyBsaXN0LCBvciBvdGhlciB1c2VyIGludGVyZmFjZSBlbGVtZW50cyBwcm92aWRlZCBieSB0aGVcbiAgICAgKlx0Y29tcG9zaXRvci5cbiAgICAgKlxuICAgICAqXHRUaGUgc3RyaW5nIG11c3QgYmUgZW5jb2RlZCBpbiBVVEYtOC5cbiAgICAgKlxuICAgICAqIEBzaW5jZSAxXG4gICAgICpcbiAgICAgKi9cbiAgICBzZXRUaXRsZSh0aXRsZSkge1xuICAgICAgICB0aGlzLl9tYXJzaGFsbCh0aGlzLmlkLCA4LCBbc3RyaW5nKHRpdGxlKV0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqXHRTZXQgYSBjbGFzcyBmb3IgdGhlIHN1cmZhY2UuXG4gICAgICpcbiAgICAgKlx0VGhlIHN1cmZhY2UgY2xhc3MgaWRlbnRpZmllcyB0aGUgZ2VuZXJhbCBjbGFzcyBvZiBhcHBsaWNhdGlvbnNcbiAgICAgKlx0dG8gd2hpY2ggdGhlIHN1cmZhY2UgYmVsb25ncy4gQSBjb21tb24gY29udmVudGlvbiBpcyB0byB1c2UgdGhlXG4gICAgICpcdGZpbGUgbmFtZSAob3IgdGhlIGZ1bGwgcGF0aCBpZiBpdCBpcyBhIG5vbi1zdGFuZGFyZCBsb2NhdGlvbikgb2ZcbiAgICAgKlx0dGhlIGFwcGxpY2F0aW9uJ3MgLmRlc2t0b3AgZmlsZSBhcyB0aGUgY2xhc3MuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgc2V0Q2xhc3MoY2xhenopIHtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgOSwgW3N0cmluZyhjbGF6eildKTtcbiAgICB9XG4gICAgWzBdKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgKChfYSA9IHRoaXMubGlzdGVuZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5waW5nKHUobWVzc2FnZSkpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFsxXShtZXNzYWdlKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHlpZWxkICgoX2EgPSB0aGlzLmxpc3RlbmVyKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY29uZmlndXJlKHUobWVzc2FnZSksIGkobWVzc2FnZSksIGkobWVzc2FnZSkpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFsyXShtZXNzYWdlKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHlpZWxkICgoX2EgPSB0aGlzLmxpc3RlbmVyKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucG9wdXBEb25lKCkpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnQgY29uc3QgV2xTaGVsbFN1cmZhY2VQcm90b2NvbE5hbWUgPSAnd2xfc2hlbGxfc3VyZmFjZSc7XG5leHBvcnQgdmFyIFdsU2hlbGxTdXJmYWNlUmVzaXplO1xuKGZ1bmN0aW9uIChXbFNoZWxsU3VyZmFjZVJlc2l6ZSkge1xuICAgIC8qKlxuICAgICAqIG5vIGVkZ2VcbiAgICAgKi9cbiAgICBXbFNoZWxsU3VyZmFjZVJlc2l6ZVtXbFNoZWxsU3VyZmFjZVJlc2l6ZVtcIl9ub25lXCJdID0gMF0gPSBcIl9ub25lXCI7XG4gICAgLyoqXG4gICAgICogdG9wIGVkZ2VcbiAgICAgKi9cbiAgICBXbFNoZWxsU3VyZmFjZVJlc2l6ZVtXbFNoZWxsU3VyZmFjZVJlc2l6ZVtcIl90b3BcIl0gPSAxXSA9IFwiX3RvcFwiO1xuICAgIC8qKlxuICAgICAqIGJvdHRvbSBlZGdlXG4gICAgICovXG4gICAgV2xTaGVsbFN1cmZhY2VSZXNpemVbV2xTaGVsbFN1cmZhY2VSZXNpemVbXCJfYm90dG9tXCJdID0gMl0gPSBcIl9ib3R0b21cIjtcbiAgICAvKipcbiAgICAgKiBsZWZ0IGVkZ2VcbiAgICAgKi9cbiAgICBXbFNoZWxsU3VyZmFjZVJlc2l6ZVtXbFNoZWxsU3VyZmFjZVJlc2l6ZVtcIl9sZWZ0XCJdID0gNF0gPSBcIl9sZWZ0XCI7XG4gICAgLyoqXG4gICAgICogdG9wIGFuZCBsZWZ0IGVkZ2VzXG4gICAgICovXG4gICAgV2xTaGVsbFN1cmZhY2VSZXNpemVbV2xTaGVsbFN1cmZhY2VSZXNpemVbXCJfdG9wTGVmdFwiXSA9IDVdID0gXCJfdG9wTGVmdFwiO1xuICAgIC8qKlxuICAgICAqIGJvdHRvbSBhbmQgbGVmdCBlZGdlc1xuICAgICAqL1xuICAgIFdsU2hlbGxTdXJmYWNlUmVzaXplW1dsU2hlbGxTdXJmYWNlUmVzaXplW1wiX2JvdHRvbUxlZnRcIl0gPSA2XSA9IFwiX2JvdHRvbUxlZnRcIjtcbiAgICAvKipcbiAgICAgKiByaWdodCBlZGdlXG4gICAgICovXG4gICAgV2xTaGVsbFN1cmZhY2VSZXNpemVbV2xTaGVsbFN1cmZhY2VSZXNpemVbXCJfcmlnaHRcIl0gPSA4XSA9IFwiX3JpZ2h0XCI7XG4gICAgLyoqXG4gICAgICogdG9wIGFuZCByaWdodCBlZGdlc1xuICAgICAqL1xuICAgIFdsU2hlbGxTdXJmYWNlUmVzaXplW1dsU2hlbGxTdXJmYWNlUmVzaXplW1wiX3RvcFJpZ2h0XCJdID0gOV0gPSBcIl90b3BSaWdodFwiO1xuICAgIC8qKlxuICAgICAqIGJvdHRvbSBhbmQgcmlnaHQgZWRnZXNcbiAgICAgKi9cbiAgICBXbFNoZWxsU3VyZmFjZVJlc2l6ZVtXbFNoZWxsU3VyZmFjZVJlc2l6ZVtcIl9ib3R0b21SaWdodFwiXSA9IDEwXSA9IFwiX2JvdHRvbVJpZ2h0XCI7XG59KShXbFNoZWxsU3VyZmFjZVJlc2l6ZSB8fCAoV2xTaGVsbFN1cmZhY2VSZXNpemUgPSB7fSkpO1xuZXhwb3J0IHZhciBXbFNoZWxsU3VyZmFjZVRyYW5zaWVudDtcbihmdW5jdGlvbiAoV2xTaGVsbFN1cmZhY2VUcmFuc2llbnQpIHtcbiAgICAvKipcbiAgICAgKiBkbyBub3Qgc2V0IGtleWJvYXJkIGZvY3VzXG4gICAgICovXG4gICAgV2xTaGVsbFN1cmZhY2VUcmFuc2llbnRbV2xTaGVsbFN1cmZhY2VUcmFuc2llbnRbXCJfaW5hY3RpdmVcIl0gPSAxXSA9IFwiX2luYWN0aXZlXCI7XG59KShXbFNoZWxsU3VyZmFjZVRyYW5zaWVudCB8fCAoV2xTaGVsbFN1cmZhY2VUcmFuc2llbnQgPSB7fSkpO1xuZXhwb3J0IHZhciBXbFNoZWxsU3VyZmFjZUZ1bGxzY3JlZW5NZXRob2Q7XG4oZnVuY3Rpb24gKFdsU2hlbGxTdXJmYWNlRnVsbHNjcmVlbk1ldGhvZCkge1xuICAgIC8qKlxuICAgICAqIG5vIHByZWZlcmVuY2UsIGFwcGx5IGRlZmF1bHQgcG9saWN5XG4gICAgICovXG4gICAgV2xTaGVsbFN1cmZhY2VGdWxsc2NyZWVuTWV0aG9kW1dsU2hlbGxTdXJmYWNlRnVsbHNjcmVlbk1ldGhvZFtcIl9kZWZhdWx0XCJdID0gMF0gPSBcIl9kZWZhdWx0XCI7XG4gICAgLyoqXG4gICAgICogc2NhbGUsIHByZXNlcnZlIHRoZSBzdXJmYWNlJ3MgYXNwZWN0IHJhdGlvIGFuZCBjZW50ZXIgb24gb3V0cHV0XG4gICAgICovXG4gICAgV2xTaGVsbFN1cmZhY2VGdWxsc2NyZWVuTWV0aG9kW1dsU2hlbGxTdXJmYWNlRnVsbHNjcmVlbk1ldGhvZFtcIl9zY2FsZVwiXSA9IDFdID0gXCJfc2NhbGVcIjtcbiAgICAvKipcbiAgICAgKiBzd2l0Y2ggb3V0cHV0IG1vZGUgdG8gdGhlIHNtYWxsZXN0IG1vZGUgdGhhdCBjYW4gZml0IHRoZSBzdXJmYWNlLCBhZGQgYmxhY2sgYm9yZGVycyB0byBjb21wZW5zYXRlIHNpemUgbWlzbWF0Y2hcbiAgICAgKi9cbiAgICBXbFNoZWxsU3VyZmFjZUZ1bGxzY3JlZW5NZXRob2RbV2xTaGVsbFN1cmZhY2VGdWxsc2NyZWVuTWV0aG9kW1wiX2RyaXZlclwiXSA9IDJdID0gXCJfZHJpdmVyXCI7XG4gICAgLyoqXG4gICAgICogbm8gdXBzY2FsaW5nLCBjZW50ZXIgb24gb3V0cHV0IGFuZCBhZGQgYmxhY2sgYm9yZGVycyB0byBjb21wZW5zYXRlIHNpemUgbWlzbWF0Y2hcbiAgICAgKi9cbiAgICBXbFNoZWxsU3VyZmFjZUZ1bGxzY3JlZW5NZXRob2RbV2xTaGVsbFN1cmZhY2VGdWxsc2NyZWVuTWV0aG9kW1wiX2ZpbGxcIl0gPSAzXSA9IFwiX2ZpbGxcIjtcbn0pKFdsU2hlbGxTdXJmYWNlRnVsbHNjcmVlbk1ldGhvZCB8fCAoV2xTaGVsbFN1cmZhY2VGdWxsc2NyZWVuTWV0aG9kID0ge30pKTtcbi8qKlxuICpcbiAqICAgICAgQSBzdXJmYWNlIGlzIGEgcmVjdGFuZ3VsYXIgYXJlYSB0aGF0IGlzIGRpc3BsYXllZCBvbiB0aGUgc2NyZWVuLlxuICogICAgICBJdCBoYXMgYSBsb2NhdGlvbiwgc2l6ZSBhbmQgcGl4ZWwgY29udGVudHMuXG4gKlxuICogICAgICBUaGUgc2l6ZSBvZiBhIHN1cmZhY2UgKGFuZCByZWxhdGl2ZSBwb3NpdGlvbnMgb24gaXQpIGlzIGRlc2NyaWJlZFxuICogICAgICBpbiBzdXJmYWNlLWxvY2FsIGNvb3JkaW5hdGVzLCB3aGljaCBtYXkgZGlmZmVyIGZyb20gdGhlIGJ1ZmZlclxuICogICAgICBjb29yZGluYXRlcyBvZiB0aGUgcGl4ZWwgY29udGVudCwgaW4gY2FzZSBhIGJ1ZmZlcl90cmFuc2Zvcm1cbiAqICAgICAgb3IgYSBidWZmZXJfc2NhbGUgaXMgdXNlZC5cbiAqXG4gKiAgICAgIEEgc3VyZmFjZSB3aXRob3V0IGEgXCJyb2xlXCIgaXMgZmFpcmx5IHVzZWxlc3M6IGEgY29tcG9zaXRvciBkb2VzXG4gKiAgICAgIG5vdCBrbm93IHdoZXJlLCB3aGVuIG9yIGhvdyB0byBwcmVzZW50IGl0LiBUaGUgcm9sZSBpcyB0aGVcbiAqICAgICAgcHVycG9zZSBvZiBhIHdsX3N1cmZhY2UuIEV4YW1wbGVzIG9mIHJvbGVzIGFyZSBhIGN1cnNvciBmb3IgYVxuICogICAgICBwb2ludGVyIChhcyBzZXQgYnkgd2xfcG9pbnRlci5zZXRfY3Vyc29yKSwgYSBkcmFnIGljb25cbiAqICAgICAgKHdsX2RhdGFfZGV2aWNlLnN0YXJ0X2RyYWcpLCBhIHN1Yi1zdXJmYWNlXG4gKiAgICAgICh3bF9zdWJjb21wb3NpdG9yLmdldF9zdWJzdXJmYWNlKSwgYW5kIGEgd2luZG93IGFzIGRlZmluZWQgYnkgYVxuICogICAgICBzaGVsbCBwcm90b2NvbCAoZS5nLiB3bF9zaGVsbC5nZXRfc2hlbGxfc3VyZmFjZSkuXG4gKlxuICogICAgICBBIHN1cmZhY2UgY2FuIGhhdmUgb25seSBvbmUgcm9sZSBhdCBhIHRpbWUuIEluaXRpYWxseSBhXG4gKiAgICAgIHdsX3N1cmZhY2UgZG9lcyBub3QgaGF2ZSBhIHJvbGUuIE9uY2UgYSB3bF9zdXJmYWNlIGlzIGdpdmVuIGFcbiAqICAgICAgcm9sZSwgaXQgaXMgc2V0IHBlcm1hbmVudGx5IGZvciB0aGUgd2hvbGUgbGlmZXRpbWUgb2YgdGhlXG4gKiAgICAgIHdsX3N1cmZhY2Ugb2JqZWN0LiBHaXZpbmcgdGhlIGN1cnJlbnQgcm9sZSBhZ2FpbiBpcyBhbGxvd2VkLFxuICogICAgICB1bmxlc3MgZXhwbGljaXRseSBmb3JiaWRkZW4gYnkgdGhlIHJlbGV2YW50IGludGVyZmFjZVxuICogICAgICBzcGVjaWZpY2F0aW9uLlxuICpcbiAqICAgICAgU3VyZmFjZSByb2xlcyBhcmUgZ2l2ZW4gYnkgcmVxdWVzdHMgaW4gb3RoZXIgaW50ZXJmYWNlcyBzdWNoIGFzXG4gKiAgICAgIHdsX3BvaW50ZXIuc2V0X2N1cnNvci4gVGhlIHJlcXVlc3Qgc2hvdWxkIGV4cGxpY2l0bHkgbWVudGlvblxuICogICAgICB0aGF0IHRoaXMgcmVxdWVzdCBnaXZlcyBhIHJvbGUgdG8gYSB3bF9zdXJmYWNlLiBPZnRlbiwgdGhpc1xuICogICAgICByZXF1ZXN0IGFsc28gY3JlYXRlcyBhIG5ldyBwcm90b2NvbCBvYmplY3QgdGhhdCByZXByZXNlbnRzIHRoZVxuICogICAgICByb2xlIGFuZCBhZGRzIGFkZGl0aW9uYWwgZnVuY3Rpb25hbGl0eSB0byB3bF9zdXJmYWNlLiBXaGVuIGFcbiAqICAgICAgY2xpZW50IHdhbnRzIHRvIGRlc3Ryb3kgYSB3bF9zdXJmYWNlLCB0aGV5IG11c3QgZGVzdHJveSB0aGlzICdyb2xlXG4gKiAgICAgIG9iamVjdCcgYmVmb3JlIHRoZSB3bF9zdXJmYWNlLlxuICpcbiAqICAgICAgRGVzdHJveWluZyB0aGUgcm9sZSBvYmplY3QgZG9lcyBub3QgcmVtb3ZlIHRoZSByb2xlIGZyb20gdGhlXG4gKiAgICAgIHdsX3N1cmZhY2UsIGJ1dCBpdCBtYXkgc3RvcCB0aGUgd2xfc3VyZmFjZSBmcm9tIFwicGxheWluZyB0aGUgcm9sZVwiLlxuICogICAgICBGb3IgaW5zdGFuY2UsIGlmIGEgd2xfc3Vic3VyZmFjZSBvYmplY3QgaXMgZGVzdHJveWVkLCB0aGUgd2xfc3VyZmFjZVxuICogICAgICBpdCB3YXMgY3JlYXRlZCBmb3Igd2lsbCBiZSB1bm1hcHBlZCBhbmQgZm9yZ2V0IGl0cyBwb3NpdGlvbiBhbmRcbiAqICAgICAgei1vcmRlci4gSXQgaXMgYWxsb3dlZCB0byBjcmVhdGUgYSB3bF9zdWJzdXJmYWNlIGZvciB0aGUgc2FtZVxuICogICAgICB3bF9zdXJmYWNlIGFnYWluLCBidXQgaXQgaXMgbm90IGFsbG93ZWQgdG8gdXNlIHRoZSB3bF9zdXJmYWNlIGFzXG4gKiAgICAgIGEgY3Vyc29yIChjdXJzb3IgaXMgYSBkaWZmZXJlbnQgcm9sZSB0aGFuIHN1Yi1zdXJmYWNlLCBhbmQgcm9sZVxuICogICAgICBzd2l0Y2hpbmcgaXMgbm90IGFsbG93ZWQpLlxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIFdsU3VyZmFjZVByb3h5IGV4dGVuZHMgUHJveHkge1xuICAgIC8qKlxuICAgICAqIERvIG5vdCBjb25zdHJ1Y3QgcHJveGllcyBkaXJlY3RseS4gSW5zdGVhZCB1c2Ugb25lIG9mIHRoZSBmYWN0b3J5IG1ldGhvZHMgZnJvbSBvdGhlciBwcm94aWVzLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKSB7XG4gICAgICAgIHN1cGVyKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0RGVsZXRlcyB0aGUgc3VyZmFjZSBhbmQgaW52YWxpZGF0ZXMgaXRzIG9iamVjdCBJRC5cbiAgICAgKlxuICAgICAqIEBzaW5jZSAxXG4gICAgICpcbiAgICAgKi9cbiAgICBkZXN0cm95KCkge1xuICAgICAgICBzdXBlci5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuX21hcnNoYWxsKHRoaXMuaWQsIDAsIFtdKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0U2V0IGEgYnVmZmVyIGFzIHRoZSBjb250ZW50IG9mIHRoaXMgc3VyZmFjZS5cbiAgICAgKlxuICAgICAqXHRUaGUgbmV3IHNpemUgb2YgdGhlIHN1cmZhY2UgaXMgY2FsY3VsYXRlZCBiYXNlZCBvbiB0aGUgYnVmZmVyXG4gICAgICpcdHNpemUgdHJhbnNmb3JtZWQgYnkgdGhlIGludmVyc2UgYnVmZmVyX3RyYW5zZm9ybSBhbmQgdGhlXG4gICAgICpcdGludmVyc2UgYnVmZmVyX3NjYWxlLiBUaGlzIG1lYW5zIHRoYXQgdGhlIHN1cHBsaWVkIGJ1ZmZlclxuICAgICAqXHRtdXN0IGJlIGFuIGludGVnZXIgbXVsdGlwbGUgb2YgdGhlIGJ1ZmZlcl9zY2FsZS5cbiAgICAgKlxuICAgICAqXHRUaGUgeCBhbmQgeSBhcmd1bWVudHMgc3BlY2lmeSB0aGUgbG9jYXRpb24gb2YgdGhlIG5ldyBwZW5kaW5nXG4gICAgICpcdGJ1ZmZlcidzIHVwcGVyIGxlZnQgY29ybmVyLCByZWxhdGl2ZSB0byB0aGUgY3VycmVudCBidWZmZXIncyB1cHBlclxuICAgICAqXHRsZWZ0IGNvcm5lciwgaW4gc3VyZmFjZS1sb2NhbCBjb29yZGluYXRlcy4gSW4gb3RoZXIgd29yZHMsIHRoZVxuICAgICAqXHR4IGFuZCB5LCBjb21iaW5lZCB3aXRoIHRoZSBuZXcgc3VyZmFjZSBzaXplIGRlZmluZSBpbiB3aGljaFxuICAgICAqXHRkaXJlY3Rpb25zIHRoZSBzdXJmYWNlJ3Mgc2l6ZSBjaGFuZ2VzLlxuICAgICAqXG4gICAgICpcdFN1cmZhY2UgY29udGVudHMgYXJlIGRvdWJsZS1idWZmZXJlZCBzdGF0ZSwgc2VlIHdsX3N1cmZhY2UuY29tbWl0LlxuICAgICAqXG4gICAgICpcdFRoZSBpbml0aWFsIHN1cmZhY2UgY29udGVudHMgYXJlIHZvaWQ7IHRoZXJlIGlzIG5vIGNvbnRlbnQuXG4gICAgICpcdHdsX3N1cmZhY2UuYXR0YWNoIGFzc2lnbnMgdGhlIGdpdmVuIHdsX2J1ZmZlciBhcyB0aGUgcGVuZGluZ1xuICAgICAqXHR3bF9idWZmZXIuIHdsX3N1cmZhY2UuY29tbWl0IG1ha2VzIHRoZSBwZW5kaW5nIHdsX2J1ZmZlciB0aGUgbmV3XG4gICAgICpcdHN1cmZhY2UgY29udGVudHMsIGFuZCB0aGUgc2l6ZSBvZiB0aGUgc3VyZmFjZSBiZWNvbWVzIHRoZSBzaXplXG4gICAgICpcdGNhbGN1bGF0ZWQgZnJvbSB0aGUgd2xfYnVmZmVyLCBhcyBkZXNjcmliZWQgYWJvdmUuIEFmdGVyIGNvbW1pdCxcbiAgICAgKlx0dGhlcmUgaXMgbm8gcGVuZGluZyBidWZmZXIgdW50aWwgdGhlIG5leHQgYXR0YWNoLlxuICAgICAqXG4gICAgICpcdENvbW1pdHRpbmcgYSBwZW5kaW5nIHdsX2J1ZmZlciBhbGxvd3MgdGhlIGNvbXBvc2l0b3IgdG8gcmVhZCB0aGVcbiAgICAgKlx0cGl4ZWxzIGluIHRoZSB3bF9idWZmZXIuIFRoZSBjb21wb3NpdG9yIG1heSBhY2Nlc3MgdGhlIHBpeGVscyBhdFxuICAgICAqXHRhbnkgdGltZSBhZnRlciB0aGUgd2xfc3VyZmFjZS5jb21taXQgcmVxdWVzdC4gV2hlbiB0aGUgY29tcG9zaXRvclxuICAgICAqXHR3aWxsIG5vdCBhY2Nlc3MgdGhlIHBpeGVscyBhbnltb3JlLCBpdCB3aWxsIHNlbmQgdGhlXG4gICAgICpcdHdsX2J1ZmZlci5yZWxlYXNlIGV2ZW50LiBPbmx5IGFmdGVyIHJlY2VpdmluZyB3bF9idWZmZXIucmVsZWFzZSxcbiAgICAgKlx0dGhlIGNsaWVudCBtYXkgcmV1c2UgdGhlIHdsX2J1ZmZlci4gQSB3bF9idWZmZXIgdGhhdCBoYXMgYmVlblxuICAgICAqXHRhdHRhY2hlZCBhbmQgdGhlbiByZXBsYWNlZCBieSBhbm90aGVyIGF0dGFjaCBpbnN0ZWFkIG9mIGNvbW1pdHRlZFxuICAgICAqXHR3aWxsIG5vdCByZWNlaXZlIGEgcmVsZWFzZSBldmVudCwgYW5kIGlzIG5vdCB1c2VkIGJ5IHRoZVxuICAgICAqXHRjb21wb3NpdG9yLlxuICAgICAqXG4gICAgICpcdERlc3Ryb3lpbmcgdGhlIHdsX2J1ZmZlciBhZnRlciB3bF9idWZmZXIucmVsZWFzZSBkb2VzIG5vdCBjaGFuZ2VcbiAgICAgKlx0dGhlIHN1cmZhY2UgY29udGVudHMuIEhvd2V2ZXIsIGlmIHRoZSBjbGllbnQgZGVzdHJveXMgdGhlXG4gICAgICpcdHdsX2J1ZmZlciBiZWZvcmUgcmVjZWl2aW5nIHRoZSB3bF9idWZmZXIucmVsZWFzZSBldmVudCwgdGhlIHN1cmZhY2VcbiAgICAgKlx0Y29udGVudHMgYmVjb21lIHVuZGVmaW5lZCBpbW1lZGlhdGVseS5cbiAgICAgKlxuICAgICAqXHRJZiB3bF9zdXJmYWNlLmF0dGFjaCBpcyBzZW50IHdpdGggYSBOVUxMIHdsX2J1ZmZlciwgdGhlXG4gICAgICpcdGZvbGxvd2luZyB3bF9zdXJmYWNlLmNvbW1pdCB3aWxsIHJlbW92ZSB0aGUgc3VyZmFjZSBjb250ZW50LlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIGF0dGFjaChidWZmZXIsIHgsIHkpIHtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgMSwgW29iamVjdE9wdGlvbmFsKGJ1ZmZlciksIGludCh4KSwgaW50KHkpXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdFRoaXMgcmVxdWVzdCBpcyB1c2VkIHRvIGRlc2NyaWJlIHRoZSByZWdpb25zIHdoZXJlIHRoZSBwZW5kaW5nXG4gICAgICpcdGJ1ZmZlciBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgY3VycmVudCBzdXJmYWNlIGNvbnRlbnRzLCBhbmQgd2hlcmVcbiAgICAgKlx0dGhlIHN1cmZhY2UgdGhlcmVmb3JlIG5lZWRzIHRvIGJlIHJlcGFpbnRlZC4gVGhlIGNvbXBvc2l0b3JcbiAgICAgKlx0aWdub3JlcyB0aGUgcGFydHMgb2YgdGhlIGRhbWFnZSB0aGF0IGZhbGwgb3V0c2lkZSBvZiB0aGUgc3VyZmFjZS5cbiAgICAgKlxuICAgICAqXHREYW1hZ2UgaXMgZG91YmxlLWJ1ZmZlcmVkIHN0YXRlLCBzZWUgd2xfc3VyZmFjZS5jb21taXQuXG4gICAgICpcbiAgICAgKlx0VGhlIGRhbWFnZSByZWN0YW5nbGUgaXMgc3BlY2lmaWVkIGluIHN1cmZhY2UtbG9jYWwgY29vcmRpbmF0ZXMsXG4gICAgICpcdHdoZXJlIHggYW5kIHkgc3BlY2lmeSB0aGUgdXBwZXIgbGVmdCBjb3JuZXIgb2YgdGhlIGRhbWFnZSByZWN0YW5nbGUuXG4gICAgICpcbiAgICAgKlx0VGhlIGluaXRpYWwgdmFsdWUgZm9yIHBlbmRpbmcgZGFtYWdlIGlzIGVtcHR5OiBubyBkYW1hZ2UuXG4gICAgICpcdHdsX3N1cmZhY2UuZGFtYWdlIGFkZHMgcGVuZGluZyBkYW1hZ2U6IHRoZSBuZXcgcGVuZGluZyBkYW1hZ2VcbiAgICAgKlx0aXMgdGhlIHVuaW9uIG9mIG9sZCBwZW5kaW5nIGRhbWFnZSBhbmQgdGhlIGdpdmVuIHJlY3RhbmdsZS5cbiAgICAgKlxuICAgICAqXHR3bF9zdXJmYWNlLmNvbW1pdCBhc3NpZ25zIHBlbmRpbmcgZGFtYWdlIGFzIHRoZSBjdXJyZW50IGRhbWFnZSxcbiAgICAgKlx0YW5kIGNsZWFycyBwZW5kaW5nIGRhbWFnZS4gVGhlIHNlcnZlciB3aWxsIGNsZWFyIHRoZSBjdXJyZW50XG4gICAgICpcdGRhbWFnZSBhcyBpdCByZXBhaW50cyB0aGUgc3VyZmFjZS5cbiAgICAgKlxuICAgICAqXHRBbHRlcm5hdGl2ZWx5LCBkYW1hZ2UgY2FuIGJlIHBvc3RlZCB3aXRoIHdsX3N1cmZhY2UuZGFtYWdlX2J1ZmZlclxuICAgICAqXHR3aGljaCB1c2VzIGJ1ZmZlciBjb29yZGluYXRlcyBpbnN0ZWFkIG9mIHN1cmZhY2UgY29vcmRpbmF0ZXMsXG4gICAgICpcdGFuZCBpcyBwcm9iYWJseSB0aGUgcHJlZmVycmVkIGFuZCBpbnR1aXRpdmUgd2F5IG9mIGRvaW5nIHRoaXMuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgZGFtYWdlKHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgMiwgW2ludCh4KSwgaW50KHkpLCBpbnQod2lkdGgpLCBpbnQoaGVpZ2h0KV0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqXHRSZXF1ZXN0IGEgbm90aWZpY2F0aW9uIHdoZW4gaXQgaXMgYSBnb29kIHRpbWUgdG8gc3RhcnQgZHJhd2luZyBhIG5ld1xuICAgICAqXHRmcmFtZSwgYnkgY3JlYXRpbmcgYSBmcmFtZSBjYWxsYmFjay4gVGhpcyBpcyB1c2VmdWwgZm9yIHRocm90dGxpbmdcbiAgICAgKlx0cmVkcmF3aW5nIG9wZXJhdGlvbnMsIGFuZCBkcml2aW5nIGFuaW1hdGlvbnMuXG4gICAgICpcbiAgICAgKlx0V2hlbiBhIGNsaWVudCBpcyBhbmltYXRpbmcgb24gYSB3bF9zdXJmYWNlLCBpdCBjYW4gdXNlIHRoZSAnZnJhbWUnXG4gICAgICpcdHJlcXVlc3QgdG8gZ2V0IG5vdGlmaWVkIHdoZW4gaXQgaXMgYSBnb29kIHRpbWUgdG8gZHJhdyBhbmQgY29tbWl0IHRoZVxuICAgICAqXHRuZXh0IGZyYW1lIG9mIGFuaW1hdGlvbi4gSWYgdGhlIGNsaWVudCBjb21taXRzIGFuIHVwZGF0ZSBlYXJsaWVyIHRoYW5cbiAgICAgKlx0dGhhdCwgaXQgaXMgbGlrZWx5IHRoYXQgc29tZSB1cGRhdGVzIHdpbGwgbm90IG1ha2UgaXQgdG8gdGhlIGRpc3BsYXksXG4gICAgICpcdGFuZCB0aGUgY2xpZW50IGlzIHdhc3RpbmcgcmVzb3VyY2VzIGJ5IGRyYXdpbmcgdG9vIG9mdGVuLlxuICAgICAqXG4gICAgICpcdFRoZSBmcmFtZSByZXF1ZXN0IHdpbGwgdGFrZSBlZmZlY3Qgb24gdGhlIG5leHQgd2xfc3VyZmFjZS5jb21taXQuXG4gICAgICpcdFRoZSBub3RpZmljYXRpb24gd2lsbCBvbmx5IGJlIHBvc3RlZCBmb3Igb25lIGZyYW1lIHVubGVzc1xuICAgICAqXHRyZXF1ZXN0ZWQgYWdhaW4uIEZvciBhIHdsX3N1cmZhY2UsIHRoZSBub3RpZmljYXRpb25zIGFyZSBwb3N0ZWQgaW5cbiAgICAgKlx0dGhlIG9yZGVyIHRoZSBmcmFtZSByZXF1ZXN0cyB3ZXJlIGNvbW1pdHRlZC5cbiAgICAgKlxuICAgICAqXHRUaGUgc2VydmVyIG11c3Qgc2VuZCB0aGUgbm90aWZpY2F0aW9ucyBzbyB0aGF0IGEgY2xpZW50XG4gICAgICpcdHdpbGwgbm90IHNlbmQgZXhjZXNzaXZlIHVwZGF0ZXMsIHdoaWxlIHN0aWxsIGFsbG93aW5nXG4gICAgICpcdHRoZSBoaWdoZXN0IHBvc3NpYmxlIHVwZGF0ZSByYXRlIGZvciBjbGllbnRzIHRoYXQgd2FpdCBmb3IgdGhlIHJlcGx5XG4gICAgICpcdGJlZm9yZSBkcmF3aW5nIGFnYWluLiBUaGUgc2VydmVyIHNob3VsZCBnaXZlIHNvbWUgdGltZSBmb3IgdGhlIGNsaWVudFxuICAgICAqXHR0byBkcmF3IGFuZCBjb21taXQgYWZ0ZXIgc2VuZGluZyB0aGUgZnJhbWUgY2FsbGJhY2sgZXZlbnRzIHRvIGxldCBpdFxuICAgICAqXHRoaXQgdGhlIG5leHQgb3V0cHV0IHJlZnJlc2guXG4gICAgICpcbiAgICAgKlx0QSBzZXJ2ZXIgc2hvdWxkIGF2b2lkIHNpZ25hbGluZyB0aGUgZnJhbWUgY2FsbGJhY2tzIGlmIHRoZVxuICAgICAqXHRzdXJmYWNlIGlzIG5vdCB2aXNpYmxlIGluIGFueSB3YXksIGUuZy4gdGhlIHN1cmZhY2UgaXMgb2ZmLXNjcmVlbixcbiAgICAgKlx0b3IgY29tcGxldGVseSBvYnNjdXJlZCBieSBvdGhlciBvcGFxdWUgc3VyZmFjZXMuXG4gICAgICpcbiAgICAgKlx0VGhlIG9iamVjdCByZXR1cm5lZCBieSB0aGlzIHJlcXVlc3Qgd2lsbCBiZSBkZXN0cm95ZWQgYnkgdGhlXG4gICAgICpcdGNvbXBvc2l0b3IgYWZ0ZXIgdGhlIGNhbGxiYWNrIGlzIGZpcmVkIGFuZCBhcyBzdWNoIHRoZSBjbGllbnQgbXVzdCBub3RcbiAgICAgKlx0YXR0ZW1wdCB0byB1c2UgaXQgYWZ0ZXIgdGhhdCBwb2ludC5cbiAgICAgKlxuICAgICAqXHRUaGUgY2FsbGJhY2tfZGF0YSBwYXNzZWQgaW4gdGhlIGNhbGxiYWNrIGlzIHRoZSBjdXJyZW50IHRpbWUsIGluXG4gICAgICpcdG1pbGxpc2Vjb25kcywgd2l0aCBhbiB1bmRlZmluZWQgYmFzZS5cbiAgICAgKlxuICAgICAqIEBzaW5jZSAxXG4gICAgICpcbiAgICAgKi9cbiAgICBmcmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hcnNoYWxsQ29uc3RydWN0b3IodGhpcy5pZCwgMywgV2VzdGZpZWxkLldsQ2FsbGJhY2tQcm94eSwgW25ld09iamVjdCgpXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdFRoaXMgcmVxdWVzdCBzZXRzIHRoZSByZWdpb24gb2YgdGhlIHN1cmZhY2UgdGhhdCBjb250YWluc1xuICAgICAqXHRvcGFxdWUgY29udGVudC5cbiAgICAgKlxuICAgICAqXHRUaGUgb3BhcXVlIHJlZ2lvbiBpcyBhbiBvcHRpbWl6YXRpb24gaGludCBmb3IgdGhlIGNvbXBvc2l0b3JcbiAgICAgKlx0dGhhdCBsZXRzIGl0IG9wdGltaXplIHRoZSByZWRyYXdpbmcgb2YgY29udGVudCBiZWhpbmQgb3BhcXVlXG4gICAgICpcdHJlZ2lvbnMuICBTZXR0aW5nIGFuIG9wYXF1ZSByZWdpb24gaXMgbm90IHJlcXVpcmVkIGZvciBjb3JyZWN0XG4gICAgICpcdGJlaGF2aW91ciwgYnV0IG1hcmtpbmcgdHJhbnNwYXJlbnQgY29udGVudCBhcyBvcGFxdWUgd2lsbCByZXN1bHRcbiAgICAgKlx0aW4gcmVwYWludCBhcnRpZmFjdHMuXG4gICAgICpcbiAgICAgKlx0VGhlIG9wYXF1ZSByZWdpb24gaXMgc3BlY2lmaWVkIGluIHN1cmZhY2UtbG9jYWwgY29vcmRpbmF0ZXMuXG4gICAgICpcbiAgICAgKlx0VGhlIGNvbXBvc2l0b3IgaWdub3JlcyB0aGUgcGFydHMgb2YgdGhlIG9wYXF1ZSByZWdpb24gdGhhdCBmYWxsXG4gICAgICpcdG91dHNpZGUgb2YgdGhlIHN1cmZhY2UuXG4gICAgICpcbiAgICAgKlx0T3BhcXVlIHJlZ2lvbiBpcyBkb3VibGUtYnVmZmVyZWQgc3RhdGUsIHNlZSB3bF9zdXJmYWNlLmNvbW1pdC5cbiAgICAgKlxuICAgICAqXHR3bF9zdXJmYWNlLnNldF9vcGFxdWVfcmVnaW9uIGNoYW5nZXMgdGhlIHBlbmRpbmcgb3BhcXVlIHJlZ2lvbi5cbiAgICAgKlx0d2xfc3VyZmFjZS5jb21taXQgY29waWVzIHRoZSBwZW5kaW5nIHJlZ2lvbiB0byB0aGUgY3VycmVudCByZWdpb24uXG4gICAgICpcdE90aGVyd2lzZSwgdGhlIHBlbmRpbmcgYW5kIGN1cnJlbnQgcmVnaW9ucyBhcmUgbmV2ZXIgY2hhbmdlZC5cbiAgICAgKlxuICAgICAqXHRUaGUgaW5pdGlhbCB2YWx1ZSBmb3IgYW4gb3BhcXVlIHJlZ2lvbiBpcyBlbXB0eS4gU2V0dGluZyB0aGUgcGVuZGluZ1xuICAgICAqXHRvcGFxdWUgcmVnaW9uIGhhcyBjb3B5IHNlbWFudGljcywgYW5kIHRoZSB3bF9yZWdpb24gb2JqZWN0IGNhbiBiZVxuICAgICAqXHRkZXN0cm95ZWQgaW1tZWRpYXRlbHkuIEEgTlVMTCB3bF9yZWdpb24gY2F1c2VzIHRoZSBwZW5kaW5nIG9wYXF1ZVxuICAgICAqXHRyZWdpb24gdG8gYmUgc2V0IHRvIGVtcHR5LlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIHNldE9wYXF1ZVJlZ2lvbihyZWdpb24pIHtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgNCwgW29iamVjdE9wdGlvbmFsKHJlZ2lvbildKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0VGhpcyByZXF1ZXN0IHNldHMgdGhlIHJlZ2lvbiBvZiB0aGUgc3VyZmFjZSB0aGF0IGNhbiByZWNlaXZlXG4gICAgICpcdHBvaW50ZXIgYW5kIHRvdWNoIGV2ZW50cy5cbiAgICAgKlxuICAgICAqXHRJbnB1dCBldmVudHMgaGFwcGVuaW5nIG91dHNpZGUgb2YgdGhpcyByZWdpb24gd2lsbCB0cnkgdGhlIG5leHRcbiAgICAgKlx0c3VyZmFjZSBpbiB0aGUgc2VydmVyIHN1cmZhY2Ugc3RhY2suIFRoZSBjb21wb3NpdG9yIGlnbm9yZXMgdGhlXG4gICAgICpcdHBhcnRzIG9mIHRoZSBpbnB1dCByZWdpb24gdGhhdCBmYWxsIG91dHNpZGUgb2YgdGhlIHN1cmZhY2UuXG4gICAgICpcbiAgICAgKlx0VGhlIGlucHV0IHJlZ2lvbiBpcyBzcGVjaWZpZWQgaW4gc3VyZmFjZS1sb2NhbCBjb29yZGluYXRlcy5cbiAgICAgKlxuICAgICAqXHRJbnB1dCByZWdpb24gaXMgZG91YmxlLWJ1ZmZlcmVkIHN0YXRlLCBzZWUgd2xfc3VyZmFjZS5jb21taXQuXG4gICAgICpcbiAgICAgKlx0d2xfc3VyZmFjZS5zZXRfaW5wdXRfcmVnaW9uIGNoYW5nZXMgdGhlIHBlbmRpbmcgaW5wdXQgcmVnaW9uLlxuICAgICAqXHR3bF9zdXJmYWNlLmNvbW1pdCBjb3BpZXMgdGhlIHBlbmRpbmcgcmVnaW9uIHRvIHRoZSBjdXJyZW50IHJlZ2lvbi5cbiAgICAgKlx0T3RoZXJ3aXNlIHRoZSBwZW5kaW5nIGFuZCBjdXJyZW50IHJlZ2lvbnMgYXJlIG5ldmVyIGNoYW5nZWQsXG4gICAgICpcdGV4Y2VwdCBjdXJzb3IgYW5kIGljb24gc3VyZmFjZXMgYXJlIHNwZWNpYWwgY2FzZXMsIHNlZVxuICAgICAqXHR3bF9wb2ludGVyLnNldF9jdXJzb3IgYW5kIHdsX2RhdGFfZGV2aWNlLnN0YXJ0X2RyYWcuXG4gICAgICpcbiAgICAgKlx0VGhlIGluaXRpYWwgdmFsdWUgZm9yIGFuIGlucHV0IHJlZ2lvbiBpcyBpbmZpbml0ZS4gVGhhdCBtZWFucyB0aGVcbiAgICAgKlx0d2hvbGUgc3VyZmFjZSB3aWxsIGFjY2VwdCBpbnB1dC4gU2V0dGluZyB0aGUgcGVuZGluZyBpbnB1dCByZWdpb25cbiAgICAgKlx0aGFzIGNvcHkgc2VtYW50aWNzLCBhbmQgdGhlIHdsX3JlZ2lvbiBvYmplY3QgY2FuIGJlIGRlc3Ryb3llZFxuICAgICAqXHRpbW1lZGlhdGVseS4gQSBOVUxMIHdsX3JlZ2lvbiBjYXVzZXMgdGhlIGlucHV0IHJlZ2lvbiB0byBiZSBzZXRcbiAgICAgKlx0dG8gaW5maW5pdGUuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgc2V0SW5wdXRSZWdpb24ocmVnaW9uKSB7XG4gICAgICAgIHRoaXMuX21hcnNoYWxsKHRoaXMuaWQsIDUsIFtvYmplY3RPcHRpb25hbChyZWdpb24pXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdFN1cmZhY2Ugc3RhdGUgKGlucHV0LCBvcGFxdWUsIGFuZCBkYW1hZ2UgcmVnaW9ucywgYXR0YWNoZWQgYnVmZmVycyxcbiAgICAgKlx0ZXRjLikgaXMgZG91YmxlLWJ1ZmZlcmVkLiBQcm90b2NvbCByZXF1ZXN0cyBtb2RpZnkgdGhlIHBlbmRpbmcgc3RhdGUsXG4gICAgICpcdGFzIG9wcG9zZWQgdG8gdGhlIGN1cnJlbnQgc3RhdGUgaW4gdXNlIGJ5IHRoZSBjb21wb3NpdG9yLiBBIGNvbW1pdFxuICAgICAqXHRyZXF1ZXN0IGF0b21pY2FsbHkgYXBwbGllcyBhbGwgcGVuZGluZyBzdGF0ZSwgcmVwbGFjaW5nIHRoZSBjdXJyZW50XG4gICAgICpcdHN0YXRlLiBBZnRlciBjb21taXQsIHRoZSBuZXcgcGVuZGluZyBzdGF0ZSBpcyBhcyBkb2N1bWVudGVkIGZvciBlYWNoXG4gICAgICpcdHJlbGF0ZWQgcmVxdWVzdC5cbiAgICAgKlxuICAgICAqXHRPbiBjb21taXQsIGEgcGVuZGluZyB3bF9idWZmZXIgaXMgYXBwbGllZCBmaXJzdCwgYW5kIGFsbCBvdGhlciBzdGF0ZVxuICAgICAqXHRzZWNvbmQuIFRoaXMgbWVhbnMgdGhhdCBhbGwgY29vcmRpbmF0ZXMgaW4gZG91YmxlLWJ1ZmZlcmVkIHN0YXRlIGFyZVxuICAgICAqXHRyZWxhdGl2ZSB0byB0aGUgbmV3IHdsX2J1ZmZlciBjb21pbmcgaW50byB1c2UsIGV4Y2VwdCBmb3JcbiAgICAgKlx0d2xfc3VyZmFjZS5hdHRhY2ggaXRzZWxmLiBJZiB0aGVyZSBpcyBubyBwZW5kaW5nIHdsX2J1ZmZlciwgdGhlXG4gICAgICpcdGNvb3JkaW5hdGVzIGFyZSByZWxhdGl2ZSB0byB0aGUgY3VycmVudCBzdXJmYWNlIGNvbnRlbnRzLlxuICAgICAqXG4gICAgICpcdEFsbCByZXF1ZXN0cyB0aGF0IG5lZWQgYSBjb21taXQgdG8gYmVjb21lIGVmZmVjdGl2ZSBhcmUgZG9jdW1lbnRlZFxuICAgICAqXHR0byBhZmZlY3QgZG91YmxlLWJ1ZmZlcmVkIHN0YXRlLlxuICAgICAqXG4gICAgICpcdE90aGVyIGludGVyZmFjZXMgbWF5IGFkZCBmdXJ0aGVyIGRvdWJsZS1idWZmZXJlZCBzdXJmYWNlIHN0YXRlLlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIGNvbW1pdChzZXJpYWwpIHtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgNiwgW3VpbnQoc2VyaWFsKV0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqXHRUaGlzIHJlcXVlc3Qgc2V0cyBhbiBvcHRpb25hbCB0cmFuc2Zvcm1hdGlvbiBvbiBob3cgdGhlIGNvbXBvc2l0b3JcbiAgICAgKlx0aW50ZXJwcmV0cyB0aGUgY29udGVudHMgb2YgdGhlIGJ1ZmZlciBhdHRhY2hlZCB0byB0aGUgc3VyZmFjZS4gVGhlXG4gICAgICpcdGFjY2VwdGVkIHZhbHVlcyBmb3IgdGhlIHRyYW5zZm9ybSBwYXJhbWV0ZXIgYXJlIHRoZSB2YWx1ZXMgZm9yXG4gICAgICpcdHdsX291dHB1dC50cmFuc2Zvcm0uXG4gICAgICpcbiAgICAgKlx0QnVmZmVyIHRyYW5zZm9ybSBpcyBkb3VibGUtYnVmZmVyZWQgc3RhdGUsIHNlZSB3bF9zdXJmYWNlLmNvbW1pdC5cbiAgICAgKlxuICAgICAqXHRBIG5ld2x5IGNyZWF0ZWQgc3VyZmFjZSBoYXMgaXRzIGJ1ZmZlciB0cmFuc2Zvcm1hdGlvbiBzZXQgdG8gbm9ybWFsLlxuICAgICAqXG4gICAgICpcdHdsX3N1cmZhY2Uuc2V0X2J1ZmZlcl90cmFuc2Zvcm0gY2hhbmdlcyB0aGUgcGVuZGluZyBidWZmZXJcbiAgICAgKlx0dHJhbnNmb3JtYXRpb24uIHdsX3N1cmZhY2UuY29tbWl0IGNvcGllcyB0aGUgcGVuZGluZyBidWZmZXJcbiAgICAgKlx0dHJhbnNmb3JtYXRpb24gdG8gdGhlIGN1cnJlbnQgb25lLiBPdGhlcndpc2UsIHRoZSBwZW5kaW5nIGFuZCBjdXJyZW50XG4gICAgICpcdHZhbHVlcyBhcmUgbmV2ZXIgY2hhbmdlZC5cbiAgICAgKlxuICAgICAqXHRUaGUgcHVycG9zZSBvZiB0aGlzIHJlcXVlc3QgaXMgdG8gYWxsb3cgY2xpZW50cyB0byByZW5kZXIgY29udGVudFxuICAgICAqXHRhY2NvcmRpbmcgdG8gdGhlIG91dHB1dCB0cmFuc2Zvcm0sIHRodXMgcGVybWl0dGluZyB0aGUgY29tcG9zaXRvciB0b1xuICAgICAqXHR1c2UgY2VydGFpbiBvcHRpbWl6YXRpb25zIGV2ZW4gaWYgdGhlIGRpc3BsYXkgaXMgcm90YXRlZC4gVXNpbmdcbiAgICAgKlx0aGFyZHdhcmUgb3ZlcmxheXMgYW5kIHNjYW5uaW5nIG91dCBhIGNsaWVudCBidWZmZXIgZm9yIGZ1bGxzY3JlZW5cbiAgICAgKlx0c3VyZmFjZXMgYXJlIGV4YW1wbGVzIG9mIHN1Y2ggb3B0aW1pemF0aW9ucy4gVGhvc2Ugb3B0aW1pemF0aW9ucyBhcmVcbiAgICAgKlx0aGlnaGx5IGRlcGVuZGVudCBvbiB0aGUgY29tcG9zaXRvciBpbXBsZW1lbnRhdGlvbiwgc28gdGhlIHVzZSBvZiB0aGlzXG4gICAgICpcdHJlcXVlc3Qgc2hvdWxkIGJlIGNvbnNpZGVyZWQgb24gYSBjYXNlLWJ5LWNhc2UgYmFzaXMuXG4gICAgICpcbiAgICAgKlx0Tm90ZSB0aGF0IGlmIHRoZSB0cmFuc2Zvcm0gdmFsdWUgaW5jbHVkZXMgOTAgb3IgMjcwIGRlZ3JlZSByb3RhdGlvbixcbiAgICAgKlx0dGhlIHdpZHRoIG9mIHRoZSBidWZmZXIgd2lsbCBiZWNvbWUgdGhlIHN1cmZhY2UgaGVpZ2h0IGFuZCB0aGUgaGVpZ2h0XG4gICAgICpcdG9mIHRoZSBidWZmZXIgd2lsbCBiZWNvbWUgdGhlIHN1cmZhY2Ugd2lkdGguXG4gICAgICpcbiAgICAgKlx0SWYgdHJhbnNmb3JtIGlzIG5vdCBvbmUgb2YgdGhlIHZhbHVlcyBmcm9tIHRoZVxuICAgICAqXHR3bF9vdXRwdXQudHJhbnNmb3JtIGVudW0gdGhlIGludmFsaWRfdHJhbnNmb3JtIHByb3RvY29sIGVycm9yXG4gICAgICpcdGlzIHJhaXNlZC5cbiAgICAgKlxuICAgICAqIEBzaW5jZSAyXG4gICAgICpcbiAgICAgKi9cbiAgICBzZXRCdWZmZXJUcmFuc2Zvcm0odHJhbnNmb3JtKSB7XG4gICAgICAgIHRoaXMuX21hcnNoYWxsKHRoaXMuaWQsIDcsIFtpbnQodHJhbnNmb3JtKV0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqXHRUaGlzIHJlcXVlc3Qgc2V0cyBhbiBvcHRpb25hbCBzY2FsaW5nIGZhY3RvciBvbiBob3cgdGhlIGNvbXBvc2l0b3JcbiAgICAgKlx0aW50ZXJwcmV0cyB0aGUgY29udGVudHMgb2YgdGhlIGJ1ZmZlciBhdHRhY2hlZCB0byB0aGUgd2luZG93LlxuICAgICAqXG4gICAgICpcdEJ1ZmZlciBzY2FsZSBpcyBkb3VibGUtYnVmZmVyZWQgc3RhdGUsIHNlZSB3bF9zdXJmYWNlLmNvbW1pdC5cbiAgICAgKlxuICAgICAqXHRBIG5ld2x5IGNyZWF0ZWQgc3VyZmFjZSBoYXMgaXRzIGJ1ZmZlciBzY2FsZSBzZXQgdG8gMS5cbiAgICAgKlxuICAgICAqXHR3bF9zdXJmYWNlLnNldF9idWZmZXJfc2NhbGUgY2hhbmdlcyB0aGUgcGVuZGluZyBidWZmZXIgc2NhbGUuXG4gICAgICpcdHdsX3N1cmZhY2UuY29tbWl0IGNvcGllcyB0aGUgcGVuZGluZyBidWZmZXIgc2NhbGUgdG8gdGhlIGN1cnJlbnQgb25lLlxuICAgICAqXHRPdGhlcndpc2UsIHRoZSBwZW5kaW5nIGFuZCBjdXJyZW50IHZhbHVlcyBhcmUgbmV2ZXIgY2hhbmdlZC5cbiAgICAgKlxuICAgICAqXHRUaGUgcHVycG9zZSBvZiB0aGlzIHJlcXVlc3QgaXMgdG8gYWxsb3cgY2xpZW50cyB0byBzdXBwbHkgaGlnaGVyXG4gICAgICpcdHJlc29sdXRpb24gYnVmZmVyIGRhdGEgZm9yIHVzZSBvbiBoaWdoIHJlc29sdXRpb24gb3V0cHV0cy4gSXQgaXNcbiAgICAgKlx0aW50ZW5kZWQgdGhhdCB5b3UgcGljayB0aGUgc2FtZSBidWZmZXIgc2NhbGUgYXMgdGhlIHNjYWxlIG9mIHRoZVxuICAgICAqXHRvdXRwdXQgdGhhdCB0aGUgc3VyZmFjZSBpcyBkaXNwbGF5ZWQgb24uIFRoaXMgbWVhbnMgdGhlIGNvbXBvc2l0b3JcbiAgICAgKlx0Y2FuIGF2b2lkIHNjYWxpbmcgd2hlbiByZW5kZXJpbmcgdGhlIHN1cmZhY2Ugb24gdGhhdCBvdXRwdXQuXG4gICAgICpcbiAgICAgKlx0Tm90ZSB0aGF0IGlmIHRoZSBzY2FsZSBpcyBsYXJnZXIgdGhhbiAxLCB0aGVuIHlvdSBoYXZlIHRvIGF0dGFjaFxuICAgICAqXHRhIGJ1ZmZlciB0aGF0IGlzIGxhcmdlciAoYnkgYSBmYWN0b3Igb2Ygc2NhbGUgaW4gZWFjaCBkaW1lbnNpb24pXG4gICAgICpcdHRoYW4gdGhlIGRlc2lyZWQgc3VyZmFjZSBzaXplLlxuICAgICAqXG4gICAgICpcdElmIHNjYWxlIGlzIG5vdCBwb3NpdGl2ZSB0aGUgaW52YWxpZF9zY2FsZSBwcm90b2NvbCBlcnJvciBpc1xuICAgICAqXHRyYWlzZWQuXG4gICAgICpcbiAgICAgKiBAc2luY2UgM1xuICAgICAqXG4gICAgICovXG4gICAgc2V0QnVmZmVyU2NhbGUoc2NhbGUpIHtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgOCwgW2ludChzY2FsZSldKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0VGhpcyByZXF1ZXN0IGlzIHVzZWQgdG8gZGVzY3JpYmUgdGhlIHJlZ2lvbnMgd2hlcmUgdGhlIHBlbmRpbmdcbiAgICAgKlx0YnVmZmVyIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBjdXJyZW50IHN1cmZhY2UgY29udGVudHMsIGFuZCB3aGVyZVxuICAgICAqXHR0aGUgc3VyZmFjZSB0aGVyZWZvcmUgbmVlZHMgdG8gYmUgcmVwYWludGVkLiBUaGUgY29tcG9zaXRvclxuICAgICAqXHRpZ25vcmVzIHRoZSBwYXJ0cyBvZiB0aGUgZGFtYWdlIHRoYXQgZmFsbCBvdXRzaWRlIG9mIHRoZSBzdXJmYWNlLlxuICAgICAqXG4gICAgICpcdERhbWFnZSBpcyBkb3VibGUtYnVmZmVyZWQgc3RhdGUsIHNlZSB3bF9zdXJmYWNlLmNvbW1pdC5cbiAgICAgKlxuICAgICAqXHRUaGUgZGFtYWdlIHJlY3RhbmdsZSBpcyBzcGVjaWZpZWQgaW4gYnVmZmVyIGNvb3JkaW5hdGVzLFxuICAgICAqXHR3aGVyZSB4IGFuZCB5IHNwZWNpZnkgdGhlIHVwcGVyIGxlZnQgY29ybmVyIG9mIHRoZSBkYW1hZ2UgcmVjdGFuZ2xlLlxuICAgICAqXG4gICAgICpcdFRoZSBpbml0aWFsIHZhbHVlIGZvciBwZW5kaW5nIGRhbWFnZSBpcyBlbXB0eTogbm8gZGFtYWdlLlxuICAgICAqXHR3bF9zdXJmYWNlLmRhbWFnZV9idWZmZXIgYWRkcyBwZW5kaW5nIGRhbWFnZTogdGhlIG5ldyBwZW5kaW5nXG4gICAgICpcdGRhbWFnZSBpcyB0aGUgdW5pb24gb2Ygb2xkIHBlbmRpbmcgZGFtYWdlIGFuZCB0aGUgZ2l2ZW4gcmVjdGFuZ2xlLlxuICAgICAqXG4gICAgICpcdHdsX3N1cmZhY2UuY29tbWl0IGFzc2lnbnMgcGVuZGluZyBkYW1hZ2UgYXMgdGhlIGN1cnJlbnQgZGFtYWdlLFxuICAgICAqXHRhbmQgY2xlYXJzIHBlbmRpbmcgZGFtYWdlLiBUaGUgc2VydmVyIHdpbGwgY2xlYXIgdGhlIGN1cnJlbnRcbiAgICAgKlx0ZGFtYWdlIGFzIGl0IHJlcGFpbnRzIHRoZSBzdXJmYWNlLlxuICAgICAqXG4gICAgICpcdFRoaXMgcmVxdWVzdCBkaWZmZXJzIGZyb20gd2xfc3VyZmFjZS5kYW1hZ2UgaW4gb25seSBvbmUgd2F5IC0gaXRcbiAgICAgKlx0dGFrZXMgZGFtYWdlIGluIGJ1ZmZlciBjb29yZGluYXRlcyBpbnN0ZWFkIG9mIHN1cmZhY2UtbG9jYWxcbiAgICAgKlx0Y29vcmRpbmF0ZXMuIFdoaWxlIHRoaXMgZ2VuZXJhbGx5IGlzIG1vcmUgaW50dWl0aXZlIHRoYW4gc3VyZmFjZVxuICAgICAqXHRjb29yZGluYXRlcywgaXQgaXMgZXNwZWNpYWxseSBkZXNpcmFibGUgd2hlbiB1c2luZyB3cF92aWV3cG9ydFxuICAgICAqXHRvciB3aGVuIGEgZHJhd2luZyBsaWJyYXJ5IChsaWtlIEVHTCkgaXMgdW5hd2FyZSBvZiBidWZmZXIgc2NhbGVcbiAgICAgKlx0YW5kIGJ1ZmZlciB0cmFuc2Zvcm0uXG4gICAgICpcbiAgICAgKlx0Tm90ZTogQmVjYXVzZSBidWZmZXIgdHJhbnNmb3JtYXRpb24gY2hhbmdlcyBhbmQgZGFtYWdlIHJlcXVlc3RzIG1heVxuICAgICAqXHRiZSBpbnRlcmxlYXZlZCBpbiB0aGUgcHJvdG9jb2wgc3RyZWFtLCBpdCBpcyBpbXBvc3NpYmxlIHRvIGRldGVybWluZVxuICAgICAqXHR0aGUgYWN0dWFsIG1hcHBpbmcgYmV0d2VlbiBzdXJmYWNlIGFuZCBidWZmZXIgZGFtYWdlIHVudGlsXG4gICAgICpcdHdsX3N1cmZhY2UuY29tbWl0IHRpbWUuIFRoZXJlZm9yZSwgY29tcG9zaXRvcnMgd2lzaGluZyB0byB0YWtlIGJvdGhcbiAgICAgKlx0a2luZHMgb2YgZGFtYWdlIGludG8gYWNjb3VudCB3aWxsIGhhdmUgdG8gYWNjdW11bGF0ZSBkYW1hZ2UgZnJvbSB0aGVcbiAgICAgKlx0dHdvIHJlcXVlc3RzIHNlcGFyYXRlbHkgYW5kIG9ubHkgdHJhbnNmb3JtIGZyb20gb25lIHRvIHRoZSBvdGhlclxuICAgICAqXHRhZnRlciByZWNlaXZpbmcgdGhlIHdsX3N1cmZhY2UuY29tbWl0LlxuICAgICAqXG4gICAgICogQHNpbmNlIDRcbiAgICAgKlxuICAgICAqL1xuICAgIGRhbWFnZUJ1ZmZlcih4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuX21hcnNoYWxsKHRoaXMuaWQsIDksIFtpbnQoeCksIGludCh5KSwgaW50KHdpZHRoKSwgaW50KGhlaWdodCldKTtcbiAgICB9XG4gICAgWzBdKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgKChfYSA9IHRoaXMubGlzdGVuZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5lbnRlcihvKG1lc3NhZ2UsIHRoaXMuX2Nvbm5lY3Rpb24pKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBbMV0obWVzc2FnZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB5aWVsZCAoKF9hID0gdGhpcy5saXN0ZW5lcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmxlYXZlKG8obWVzc2FnZSwgdGhpcy5fY29ubmVjdGlvbikpKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0IGNvbnN0IFdsU3VyZmFjZVByb3RvY29sTmFtZSA9ICd3bF9zdXJmYWNlJztcbmV4cG9ydCB2YXIgV2xTdXJmYWNlRXJyb3I7XG4oZnVuY3Rpb24gKFdsU3VyZmFjZUVycm9yKSB7XG4gICAgLyoqXG4gICAgICogYnVmZmVyIHNjYWxlIHZhbHVlIGlzIGludmFsaWRcbiAgICAgKi9cbiAgICBXbFN1cmZhY2VFcnJvcltXbFN1cmZhY2VFcnJvcltcIl9pbnZhbGlkU2NhbGVcIl0gPSAwXSA9IFwiX2ludmFsaWRTY2FsZVwiO1xuICAgIC8qKlxuICAgICAqIGJ1ZmZlciB0cmFuc2Zvcm0gdmFsdWUgaXMgaW52YWxpZFxuICAgICAqL1xuICAgIFdsU3VyZmFjZUVycm9yW1dsU3VyZmFjZUVycm9yW1wiX2ludmFsaWRUcmFuc2Zvcm1cIl0gPSAxXSA9IFwiX2ludmFsaWRUcmFuc2Zvcm1cIjtcbn0pKFdsU3VyZmFjZUVycm9yIHx8IChXbFN1cmZhY2VFcnJvciA9IHt9KSk7XG4vKipcbiAqXG4gKiAgICAgIEEgc2VhdCBpcyBhIGdyb3VwIG9mIGtleWJvYXJkcywgcG9pbnRlciBhbmQgdG91Y2ggZGV2aWNlcy4gVGhpc1xuICogICAgICBvYmplY3QgaXMgcHVibGlzaGVkIGFzIGEgZ2xvYmFsIGR1cmluZyBzdGFydCB1cCwgb3Igd2hlbiBzdWNoIGFcbiAqICAgICAgZGV2aWNlIGlzIGhvdCBwbHVnZ2VkLiAgQSBzZWF0IHR5cGljYWxseSBoYXMgYSBwb2ludGVyIGFuZFxuICogICAgICBtYWludGFpbnMgYSBrZXlib2FyZCBmb2N1cyBhbmQgYSBwb2ludGVyIGZvY3VzLlxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIFdsU2VhdFByb3h5IGV4dGVuZHMgUHJveHkge1xuICAgIC8qKlxuICAgICAqIERvIG5vdCBjb25zdHJ1Y3QgcHJveGllcyBkaXJlY3RseS4gSW5zdGVhZCB1c2Ugb25lIG9mIHRoZSBmYWN0b3J5IG1ldGhvZHMgZnJvbSBvdGhlciBwcm94aWVzLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKSB7XG4gICAgICAgIHN1cGVyKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0VGhlIElEIHByb3ZpZGVkIHdpbGwgYmUgaW5pdGlhbGl6ZWQgdG8gdGhlIHdsX3BvaW50ZXIgaW50ZXJmYWNlXG4gICAgICpcdGZvciB0aGlzIHNlYXQuXG4gICAgICpcbiAgICAgKlx0VGhpcyByZXF1ZXN0IG9ubHkgdGFrZXMgZWZmZWN0IGlmIHRoZSBzZWF0IGhhcyB0aGUgcG9pbnRlclxuICAgICAqXHRjYXBhYmlsaXR5LCBvciBoYXMgaGFkIHRoZSBwb2ludGVyIGNhcGFiaWxpdHkgaW4gdGhlIHBhc3QuXG4gICAgICpcdEl0IGlzIGEgcHJvdG9jb2wgdmlvbGF0aW9uIHRvIGlzc3VlIHRoaXMgcmVxdWVzdCBvbiBhIHNlYXQgdGhhdCBoYXNcbiAgICAgKlx0bmV2ZXIgaGFkIHRoZSBwb2ludGVyIGNhcGFiaWxpdHkuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgZ2V0UG9pbnRlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hcnNoYWxsQ29uc3RydWN0b3IodGhpcy5pZCwgMCwgV2VzdGZpZWxkLldsUG9pbnRlclByb3h5LCBbbmV3T2JqZWN0KCldKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0VGhlIElEIHByb3ZpZGVkIHdpbGwgYmUgaW5pdGlhbGl6ZWQgdG8gdGhlIHdsX2tleWJvYXJkIGludGVyZmFjZVxuICAgICAqXHRmb3IgdGhpcyBzZWF0LlxuICAgICAqXG4gICAgICpcdFRoaXMgcmVxdWVzdCBvbmx5IHRha2VzIGVmZmVjdCBpZiB0aGUgc2VhdCBoYXMgdGhlIGtleWJvYXJkXG4gICAgICpcdGNhcGFiaWxpdHksIG9yIGhhcyBoYWQgdGhlIGtleWJvYXJkIGNhcGFiaWxpdHkgaW4gdGhlIHBhc3QuXG4gICAgICpcdEl0IGlzIGEgcHJvdG9jb2wgdmlvbGF0aW9uIHRvIGlzc3VlIHRoaXMgcmVxdWVzdCBvbiBhIHNlYXQgdGhhdCBoYXNcbiAgICAgKlx0bmV2ZXIgaGFkIHRoZSBrZXlib2FyZCBjYXBhYmlsaXR5LlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIGdldEtleWJvYXJkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWFyc2hhbGxDb25zdHJ1Y3Rvcih0aGlzLmlkLCAxLCBXZXN0ZmllbGQuV2xLZXlib2FyZFByb3h5LCBbbmV3T2JqZWN0KCldKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0VGhlIElEIHByb3ZpZGVkIHdpbGwgYmUgaW5pdGlhbGl6ZWQgdG8gdGhlIHdsX3RvdWNoIGludGVyZmFjZVxuICAgICAqXHRmb3IgdGhpcyBzZWF0LlxuICAgICAqXG4gICAgICpcdFRoaXMgcmVxdWVzdCBvbmx5IHRha2VzIGVmZmVjdCBpZiB0aGUgc2VhdCBoYXMgdGhlIHRvdWNoXG4gICAgICpcdGNhcGFiaWxpdHksIG9yIGhhcyBoYWQgdGhlIHRvdWNoIGNhcGFiaWxpdHkgaW4gdGhlIHBhc3QuXG4gICAgICpcdEl0IGlzIGEgcHJvdG9jb2wgdmlvbGF0aW9uIHRvIGlzc3VlIHRoaXMgcmVxdWVzdCBvbiBhIHNlYXQgdGhhdCBoYXNcbiAgICAgKlx0bmV2ZXIgaGFkIHRoZSB0b3VjaCBjYXBhYmlsaXR5LlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIGdldFRvdWNoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWFyc2hhbGxDb25zdHJ1Y3Rvcih0aGlzLmlkLCAyLCBXZXN0ZmllbGQuV2xUb3VjaFByb3h5LCBbbmV3T2JqZWN0KCldKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0VXNpbmcgdGhpcyByZXF1ZXN0IGEgY2xpZW50IGNhbiB0ZWxsIHRoZSBzZXJ2ZXIgdGhhdCBpdCBpcyBub3QgZ29pbmcgdG9cbiAgICAgKlx0dXNlIHRoZSBzZWF0IG9iamVjdCBhbnltb3JlLlxuICAgICAqXG4gICAgICogQHNpbmNlIDVcbiAgICAgKlxuICAgICAqL1xuICAgIHJlbGVhc2UoKSB7XG4gICAgICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgMywgW10pO1xuICAgIH1cbiAgICBbMF0obWVzc2FnZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB5aWVsZCAoKF9hID0gdGhpcy5saXN0ZW5lcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhcGFiaWxpdGllcyh1KG1lc3NhZ2UpKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBbMV0obWVzc2FnZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB5aWVsZCAoKF9hID0gdGhpcy5saXN0ZW5lcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm5hbWUocyhtZXNzYWdlKSkpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnQgY29uc3QgV2xTZWF0UHJvdG9jb2xOYW1lID0gJ3dsX3NlYXQnO1xuZXhwb3J0IHZhciBXbFNlYXRDYXBhYmlsaXR5O1xuKGZ1bmN0aW9uIChXbFNlYXRDYXBhYmlsaXR5KSB7XG4gICAgLyoqXG4gICAgICogdGhlIHNlYXQgaGFzIHBvaW50ZXIgZGV2aWNlc1xuICAgICAqL1xuICAgIFdsU2VhdENhcGFiaWxpdHlbV2xTZWF0Q2FwYWJpbGl0eVtcIl9wb2ludGVyXCJdID0gMV0gPSBcIl9wb2ludGVyXCI7XG4gICAgLyoqXG4gICAgICogdGhlIHNlYXQgaGFzIG9uZSBvciBtb3JlIGtleWJvYXJkc1xuICAgICAqL1xuICAgIFdsU2VhdENhcGFiaWxpdHlbV2xTZWF0Q2FwYWJpbGl0eVtcIl9rZXlib2FyZFwiXSA9IDJdID0gXCJfa2V5Ym9hcmRcIjtcbiAgICAvKipcbiAgICAgKiB0aGUgc2VhdCBoYXMgdG91Y2ggZGV2aWNlc1xuICAgICAqL1xuICAgIFdsU2VhdENhcGFiaWxpdHlbV2xTZWF0Q2FwYWJpbGl0eVtcIl90b3VjaFwiXSA9IDRdID0gXCJfdG91Y2hcIjtcbn0pKFdsU2VhdENhcGFiaWxpdHkgfHwgKFdsU2VhdENhcGFiaWxpdHkgPSB7fSkpO1xuLyoqXG4gKlxuICogICAgICBUaGUgd2xfcG9pbnRlciBpbnRlcmZhY2UgcmVwcmVzZW50cyBvbmUgb3IgbW9yZSBpbnB1dCBkZXZpY2VzLFxuICogICAgICBzdWNoIGFzIG1pY2UsIHdoaWNoIGNvbnRyb2wgdGhlIHBvaW50ZXIgbG9jYXRpb24gYW5kIHBvaW50ZXJfZm9jdXNcbiAqICAgICAgb2YgYSBzZWF0LlxuICpcbiAqICAgICAgVGhlIHdsX3BvaW50ZXIgaW50ZXJmYWNlIGdlbmVyYXRlcyBtb3Rpb24sIGVudGVyIGFuZCBsZWF2ZVxuICogICAgICBldmVudHMgZm9yIHRoZSBzdXJmYWNlcyB0aGF0IHRoZSBwb2ludGVyIGlzIGxvY2F0ZWQgb3ZlcixcbiAqICAgICAgYW5kIGJ1dHRvbiBhbmQgYXhpcyBldmVudHMgZm9yIGJ1dHRvbiBwcmVzc2VzLCBidXR0b24gcmVsZWFzZXNcbiAqICAgICAgYW5kIHNjcm9sbGluZy5cbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBXbFBvaW50ZXJQcm94eSBleHRlbmRzIFByb3h5IHtcbiAgICAvKipcbiAgICAgKiBEbyBub3QgY29uc3RydWN0IHByb3hpZXMgZGlyZWN0bHkuIEluc3RlYWQgdXNlIG9uZSBvZiB0aGUgZmFjdG9yeSBtZXRob2RzIGZyb20gb3RoZXIgcHJveGllcy5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihkaXNwbGF5LCBjb25uZWN0aW9uLCBpZCkge1xuICAgICAgICBzdXBlcihkaXNwbGF5LCBjb25uZWN0aW9uLCBpZCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdFNldCB0aGUgcG9pbnRlciBzdXJmYWNlLCBpLmUuLCB0aGUgc3VyZmFjZSB0aGF0IGNvbnRhaW5zIHRoZVxuICAgICAqXHRwb2ludGVyIGltYWdlIChjdXJzb3IpLiBUaGlzIHJlcXVlc3QgZ2l2ZXMgdGhlIHN1cmZhY2UgdGhlIHJvbGVcbiAgICAgKlx0b2YgYSBjdXJzb3IuIElmIHRoZSBzdXJmYWNlIGFscmVhZHkgaGFzIGFub3RoZXIgcm9sZSwgaXQgcmFpc2VzXG4gICAgICpcdGEgcHJvdG9jb2wgZXJyb3IuXG4gICAgICpcbiAgICAgKlx0VGhlIGN1cnNvciBhY3R1YWxseSBjaGFuZ2VzIG9ubHkgaWYgdGhlIHBvaW50ZXJcbiAgICAgKlx0Zm9jdXMgZm9yIHRoaXMgZGV2aWNlIGlzIG9uZSBvZiB0aGUgcmVxdWVzdGluZyBjbGllbnQncyBzdXJmYWNlc1xuICAgICAqXHRvciB0aGUgc3VyZmFjZSBwYXJhbWV0ZXIgaXMgdGhlIGN1cnJlbnQgcG9pbnRlciBzdXJmYWNlLiBJZlxuICAgICAqXHR0aGVyZSB3YXMgYSBwcmV2aW91cyBzdXJmYWNlIHNldCB3aXRoIHRoaXMgcmVxdWVzdCBpdCBpc1xuICAgICAqXHRyZXBsYWNlZC4gSWYgc3VyZmFjZSBpcyBOVUxMLCB0aGUgcG9pbnRlciBpbWFnZSBpcyBoaWRkZW4uXG4gICAgICpcbiAgICAgKlx0VGhlIHBhcmFtZXRlcnMgaG90c3BvdF94IGFuZCBob3RzcG90X3kgZGVmaW5lIHRoZSBwb3NpdGlvbiBvZlxuICAgICAqXHR0aGUgcG9pbnRlciBzdXJmYWNlIHJlbGF0aXZlIHRvIHRoZSBwb2ludGVyIGxvY2F0aW9uLiBJdHNcbiAgICAgKlx0dG9wLWxlZnQgY29ybmVyIGlzIGFsd2F5cyBhdCAoeCwgeSkgLSAoaG90c3BvdF94LCBob3RzcG90X3kpLFxuICAgICAqXHR3aGVyZSAoeCwgeSkgYXJlIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgcG9pbnRlciBsb2NhdGlvbiwgaW5cbiAgICAgKlx0c3VyZmFjZS1sb2NhbCBjb29yZGluYXRlcy5cbiAgICAgKlxuICAgICAqXHRPbiBzdXJmYWNlLmF0dGFjaCByZXF1ZXN0cyB0byB0aGUgcG9pbnRlciBzdXJmYWNlLCBob3RzcG90X3hcbiAgICAgKlx0YW5kIGhvdHNwb3RfeSBhcmUgZGVjcmVtZW50ZWQgYnkgdGhlIHggYW5kIHkgcGFyYW1ldGVyc1xuICAgICAqXHRwYXNzZWQgdG8gdGhlIHJlcXVlc3QuIEF0dGFjaCBtdXN0IGJlIGNvbmZpcm1lZCBieVxuICAgICAqXHR3bF9zdXJmYWNlLmNvbW1pdCBhcyB1c3VhbC5cbiAgICAgKlxuICAgICAqXHRUaGUgaG90c3BvdCBjYW4gYWxzbyBiZSB1cGRhdGVkIGJ5IHBhc3NpbmcgdGhlIGN1cnJlbnRseSBzZXRcbiAgICAgKlx0cG9pbnRlciBzdXJmYWNlIHRvIHRoaXMgcmVxdWVzdCB3aXRoIG5ldyB2YWx1ZXMgZm9yIGhvdHNwb3RfeFxuICAgICAqXHRhbmQgaG90c3BvdF95LlxuICAgICAqXG4gICAgICpcdFRoZSBjdXJyZW50IGFuZCBwZW5kaW5nIGlucHV0IHJlZ2lvbnMgb2YgdGhlIHdsX3N1cmZhY2UgYXJlXG4gICAgICpcdGNsZWFyZWQsIGFuZCB3bF9zdXJmYWNlLnNldF9pbnB1dF9yZWdpb24gaXMgaWdub3JlZCB1bnRpbCB0aGVcbiAgICAgKlx0d2xfc3VyZmFjZSBpcyBubyBsb25nZXIgdXNlZCBhcyB0aGUgY3Vyc29yLiBXaGVuIHRoZSB1c2UgYXMgYVxuICAgICAqXHRjdXJzb3IgZW5kcywgdGhlIGN1cnJlbnQgYW5kIHBlbmRpbmcgaW5wdXQgcmVnaW9ucyBiZWNvbWVcbiAgICAgKlx0dW5kZWZpbmVkLCBhbmQgdGhlIHdsX3N1cmZhY2UgaXMgdW5tYXBwZWQuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgc2V0Q3Vyc29yKHNlcmlhbCwgc3VyZmFjZSwgaG90c3BvdFgsIGhvdHNwb3RZKSB7XG4gICAgICAgIHRoaXMuX21hcnNoYWxsKHRoaXMuaWQsIDAsIFt1aW50KHNlcmlhbCksIG9iamVjdE9wdGlvbmFsKHN1cmZhY2UpLCBpbnQoaG90c3BvdFgpLCBpbnQoaG90c3BvdFkpXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdFVzaW5nIHRoaXMgcmVxdWVzdCBhIGNsaWVudCBjYW4gdGVsbCB0aGUgc2VydmVyIHRoYXQgaXQgaXMgbm90IGdvaW5nIHRvXG4gICAgICpcdHVzZSB0aGUgcG9pbnRlciBvYmplY3QgYW55bW9yZS5cbiAgICAgKlxuICAgICAqXHRUaGlzIHJlcXVlc3QgZGVzdHJveXMgdGhlIHBvaW50ZXIgcHJveHkgb2JqZWN0LCBzbyBjbGllbnRzIG11c3Qgbm90IGNhbGxcbiAgICAgKlx0d2xfcG9pbnRlcl9kZXN0cm95KCkgYWZ0ZXIgdXNpbmcgdGhpcyByZXF1ZXN0LlxuICAgICAqXG4gICAgICogQHNpbmNlIDNcbiAgICAgKlxuICAgICAqL1xuICAgIHJlbGVhc2UoKSB7XG4gICAgICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgMSwgW10pO1xuICAgIH1cbiAgICBbMF0obWVzc2FnZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB5aWVsZCAoKF9hID0gdGhpcy5saXN0ZW5lcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmVudGVyKHUobWVzc2FnZSksIG8obWVzc2FnZSwgdGhpcy5fY29ubmVjdGlvbiksIGYobWVzc2FnZSksIGYobWVzc2FnZSkpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFsxXShtZXNzYWdlKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHlpZWxkICgoX2EgPSB0aGlzLmxpc3RlbmVyKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubGVhdmUodShtZXNzYWdlKSwgbyhtZXNzYWdlLCB0aGlzLl9jb25uZWN0aW9uKSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgWzJdKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgKChfYSA9IHRoaXMubGlzdGVuZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5tb3Rpb24odShtZXNzYWdlKSwgZihtZXNzYWdlKSwgZihtZXNzYWdlKSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgWzNdKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgKChfYSA9IHRoaXMubGlzdGVuZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5idXR0b24odShtZXNzYWdlKSwgdShtZXNzYWdlKSwgdShtZXNzYWdlKSwgdShtZXNzYWdlKSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgWzRdKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgKChfYSA9IHRoaXMubGlzdGVuZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5heGlzKHUobWVzc2FnZSksIHUobWVzc2FnZSksIGYobWVzc2FnZSkpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFs1XShtZXNzYWdlKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHlpZWxkICgoX2EgPSB0aGlzLmxpc3RlbmVyKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZnJhbWUoKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBbNl0obWVzc2FnZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB5aWVsZCAoKF9hID0gdGhpcy5saXN0ZW5lcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmF4aXNTb3VyY2UodShtZXNzYWdlKSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgWzddKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgKChfYSA9IHRoaXMubGlzdGVuZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5heGlzU3RvcCh1KG1lc3NhZ2UpLCB1KG1lc3NhZ2UpKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBbOF0obWVzc2FnZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB5aWVsZCAoKF9hID0gdGhpcy5saXN0ZW5lcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmF4aXNEaXNjcmV0ZSh1KG1lc3NhZ2UpLCBpKG1lc3NhZ2UpKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydCBjb25zdCBXbFBvaW50ZXJQcm90b2NvbE5hbWUgPSAnd2xfcG9pbnRlcic7XG5leHBvcnQgdmFyIFdsUG9pbnRlckVycm9yO1xuKGZ1bmN0aW9uIChXbFBvaW50ZXJFcnJvcikge1xuICAgIC8qKlxuICAgICAqIGdpdmVuIHdsX3N1cmZhY2UgaGFzIGFub3RoZXIgcm9sZVxuICAgICAqL1xuICAgIFdsUG9pbnRlckVycm9yW1dsUG9pbnRlckVycm9yW1wiX3JvbGVcIl0gPSAwXSA9IFwiX3JvbGVcIjtcbn0pKFdsUG9pbnRlckVycm9yIHx8IChXbFBvaW50ZXJFcnJvciA9IHt9KSk7XG5leHBvcnQgdmFyIFdsUG9pbnRlckJ1dHRvblN0YXRlO1xuKGZ1bmN0aW9uIChXbFBvaW50ZXJCdXR0b25TdGF0ZSkge1xuICAgIC8qKlxuICAgICAqIHRoZSBidXR0b24gaXMgbm90IHByZXNzZWRcbiAgICAgKi9cbiAgICBXbFBvaW50ZXJCdXR0b25TdGF0ZVtXbFBvaW50ZXJCdXR0b25TdGF0ZVtcIl9yZWxlYXNlZFwiXSA9IDBdID0gXCJfcmVsZWFzZWRcIjtcbiAgICAvKipcbiAgICAgKiB0aGUgYnV0dG9uIGlzIHByZXNzZWRcbiAgICAgKi9cbiAgICBXbFBvaW50ZXJCdXR0b25TdGF0ZVtXbFBvaW50ZXJCdXR0b25TdGF0ZVtcIl9wcmVzc2VkXCJdID0gMV0gPSBcIl9wcmVzc2VkXCI7XG59KShXbFBvaW50ZXJCdXR0b25TdGF0ZSB8fCAoV2xQb2ludGVyQnV0dG9uU3RhdGUgPSB7fSkpO1xuZXhwb3J0IHZhciBXbFBvaW50ZXJBeGlzO1xuKGZ1bmN0aW9uIChXbFBvaW50ZXJBeGlzKSB7XG4gICAgLyoqXG4gICAgICogdmVydGljYWwgYXhpc1xuICAgICAqL1xuICAgIFdsUG9pbnRlckF4aXNbV2xQb2ludGVyQXhpc1tcIl92ZXJ0aWNhbFNjcm9sbFwiXSA9IDBdID0gXCJfdmVydGljYWxTY3JvbGxcIjtcbiAgICAvKipcbiAgICAgKiBob3Jpem9udGFsIGF4aXNcbiAgICAgKi9cbiAgICBXbFBvaW50ZXJBeGlzW1dsUG9pbnRlckF4aXNbXCJfaG9yaXpvbnRhbFNjcm9sbFwiXSA9IDFdID0gXCJfaG9yaXpvbnRhbFNjcm9sbFwiO1xufSkoV2xQb2ludGVyQXhpcyB8fCAoV2xQb2ludGVyQXhpcyA9IHt9KSk7XG5leHBvcnQgdmFyIFdsUG9pbnRlckF4aXNTb3VyY2U7XG4oZnVuY3Rpb24gKFdsUG9pbnRlckF4aXNTb3VyY2UpIHtcbiAgICAvKipcbiAgICAgKiBhIHBoeXNpY2FsIHdoZWVsIHJvdGF0aW9uXG4gICAgICovXG4gICAgV2xQb2ludGVyQXhpc1NvdXJjZVtXbFBvaW50ZXJBeGlzU291cmNlW1wiX3doZWVsXCJdID0gMF0gPSBcIl93aGVlbFwiO1xuICAgIC8qKlxuICAgICAqIGZpbmdlciBvbiBhIHRvdWNoIHN1cmZhY2VcbiAgICAgKi9cbiAgICBXbFBvaW50ZXJBeGlzU291cmNlW1dsUG9pbnRlckF4aXNTb3VyY2VbXCJfZmluZ2VyXCJdID0gMV0gPSBcIl9maW5nZXJcIjtcbiAgICAvKipcbiAgICAgKiBjb250aW51b3VzIGNvb3JkaW5hdGUgc3BhY2VcbiAgICAgKi9cbiAgICBXbFBvaW50ZXJBeGlzU291cmNlW1dsUG9pbnRlckF4aXNTb3VyY2VbXCJfY29udGludW91c1wiXSA9IDJdID0gXCJfY29udGludW91c1wiO1xuICAgIC8qKlxuICAgICAqIGEgcGh5c2ljYWwgd2hlZWwgdGlsdFxuICAgICAqL1xuICAgIFdsUG9pbnRlckF4aXNTb3VyY2VbV2xQb2ludGVyQXhpc1NvdXJjZVtcIl93aGVlbFRpbHRcIl0gPSAzXSA9IFwiX3doZWVsVGlsdFwiO1xufSkoV2xQb2ludGVyQXhpc1NvdXJjZSB8fCAoV2xQb2ludGVyQXhpc1NvdXJjZSA9IHt9KSk7XG4vKipcbiAqXG4gKiAgICAgIFRoZSB3bF9rZXlib2FyZCBpbnRlcmZhY2UgcmVwcmVzZW50cyBvbmUgb3IgbW9yZSBrZXlib2FyZHNcbiAqICAgICAgYXNzb2NpYXRlZCB3aXRoIGEgc2VhdC5cbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBXbEtleWJvYXJkUHJveHkgZXh0ZW5kcyBQcm94eSB7XG4gICAgLyoqXG4gICAgICogRG8gbm90IGNvbnN0cnVjdCBwcm94aWVzIGRpcmVjdGx5LiBJbnN0ZWFkIHVzZSBvbmUgb2YgdGhlIGZhY3RvcnkgbWV0aG9kcyBmcm9tIG90aGVyIHByb3hpZXMuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZGlzcGxheSwgY29ubmVjdGlvbiwgaWQpIHtcbiAgICAgICAgc3VwZXIoZGlzcGxheSwgY29ubmVjdGlvbiwgaWQpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAc2luY2UgM1xuICAgICAqXG4gICAgICovXG4gICAgcmVsZWFzZSgpIHtcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLl9tYXJzaGFsbCh0aGlzLmlkLCAwLCBbXSk7XG4gICAgfVxuICAgIFswXShtZXNzYWdlKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHlpZWxkICgoX2EgPSB0aGlzLmxpc3RlbmVyKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Eua2V5bWFwKHUobWVzc2FnZSksIGgobWVzc2FnZSksIHUobWVzc2FnZSkpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFsxXShtZXNzYWdlKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHlpZWxkICgoX2EgPSB0aGlzLmxpc3RlbmVyKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZW50ZXIodShtZXNzYWdlKSwgbyhtZXNzYWdlLCB0aGlzLl9jb25uZWN0aW9uKSwgYShtZXNzYWdlKSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgWzJdKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgKChfYSA9IHRoaXMubGlzdGVuZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5sZWF2ZSh1KG1lc3NhZ2UpLCBvKG1lc3NhZ2UsIHRoaXMuX2Nvbm5lY3Rpb24pKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBbM10obWVzc2FnZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB5aWVsZCAoKF9hID0gdGhpcy5saXN0ZW5lcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmtleSh1KG1lc3NhZ2UpLCB1KG1lc3NhZ2UpLCB1KG1lc3NhZ2UpLCB1KG1lc3NhZ2UpKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBbNF0obWVzc2FnZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB5aWVsZCAoKF9hID0gdGhpcy5saXN0ZW5lcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm1vZGlmaWVycyh1KG1lc3NhZ2UpLCB1KG1lc3NhZ2UpLCB1KG1lc3NhZ2UpLCB1KG1lc3NhZ2UpLCB1KG1lc3NhZ2UpKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBbNV0obWVzc2FnZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB5aWVsZCAoKF9hID0gdGhpcy5saXN0ZW5lcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnJlcGVhdEluZm8oaShtZXNzYWdlKSwgaShtZXNzYWdlKSkpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnQgY29uc3QgV2xLZXlib2FyZFByb3RvY29sTmFtZSA9ICd3bF9rZXlib2FyZCc7XG5leHBvcnQgdmFyIFdsS2V5Ym9hcmRLZXltYXBGb3JtYXQ7XG4oZnVuY3Rpb24gKFdsS2V5Ym9hcmRLZXltYXBGb3JtYXQpIHtcbiAgICAvKipcbiAgICAgKiBubyBrZXltYXA7IGNsaWVudCBtdXN0IHVuZGVyc3RhbmQgaG93IHRvIGludGVycHJldCB0aGUgcmF3IGtleWNvZGVcbiAgICAgKi9cbiAgICBXbEtleWJvYXJkS2V5bWFwRm9ybWF0W1dsS2V5Ym9hcmRLZXltYXBGb3JtYXRbXCJfbm9LZXltYXBcIl0gPSAwXSA9IFwiX25vS2V5bWFwXCI7XG4gICAgLyoqXG4gICAgICogbGlieGtiY29tbW9uIGNvbXBhdGlibGU7IHRvIGRldGVybWluZSB0aGUgeGtiIGtleWNvZGUsIGNsaWVudHMgbXVzdCBhZGQgOCB0byB0aGUga2V5IGV2ZW50IGtleWNvZGVcbiAgICAgKi9cbiAgICBXbEtleWJvYXJkS2V5bWFwRm9ybWF0W1dsS2V5Ym9hcmRLZXltYXBGb3JtYXRbXCJfeGtiVjFcIl0gPSAxXSA9IFwiX3hrYlYxXCI7XG59KShXbEtleWJvYXJkS2V5bWFwRm9ybWF0IHx8IChXbEtleWJvYXJkS2V5bWFwRm9ybWF0ID0ge30pKTtcbmV4cG9ydCB2YXIgV2xLZXlib2FyZEtleVN0YXRlO1xuKGZ1bmN0aW9uIChXbEtleWJvYXJkS2V5U3RhdGUpIHtcbiAgICAvKipcbiAgICAgKiBrZXkgaXMgbm90IHByZXNzZWRcbiAgICAgKi9cbiAgICBXbEtleWJvYXJkS2V5U3RhdGVbV2xLZXlib2FyZEtleVN0YXRlW1wiX3JlbGVhc2VkXCJdID0gMF0gPSBcIl9yZWxlYXNlZFwiO1xuICAgIC8qKlxuICAgICAqIGtleSBpcyBwcmVzc2VkXG4gICAgICovXG4gICAgV2xLZXlib2FyZEtleVN0YXRlW1dsS2V5Ym9hcmRLZXlTdGF0ZVtcIl9wcmVzc2VkXCJdID0gMV0gPSBcIl9wcmVzc2VkXCI7XG59KShXbEtleWJvYXJkS2V5U3RhdGUgfHwgKFdsS2V5Ym9hcmRLZXlTdGF0ZSA9IHt9KSk7XG4vKipcbiAqXG4gKiAgICAgIFRoZSB3bF90b3VjaCBpbnRlcmZhY2UgcmVwcmVzZW50cyBhIHRvdWNoc2NyZWVuXG4gKiAgICAgIGFzc29jaWF0ZWQgd2l0aCBhIHNlYXQuXG4gKlxuICogICAgICBUb3VjaCBpbnRlcmFjdGlvbnMgY2FuIGNvbnNpc3Qgb2Ygb25lIG9yIG1vcmUgY29udGFjdHMuXG4gKiAgICAgIEZvciBlYWNoIGNvbnRhY3QsIGEgc2VyaWVzIG9mIGV2ZW50cyBpcyBnZW5lcmF0ZWQsIHN0YXJ0aW5nXG4gKiAgICAgIHdpdGggYSBkb3duIGV2ZW50LCBmb2xsb3dlZCBieSB6ZXJvIG9yIG1vcmUgbW90aW9uIGV2ZW50cyxcbiAqICAgICAgYW5kIGVuZGluZyB3aXRoIGFuIHVwIGV2ZW50LiBFdmVudHMgcmVsYXRpbmcgdG8gdGhlIHNhbWVcbiAqICAgICAgY29udGFjdCBwb2ludCBjYW4gYmUgaWRlbnRpZmllZCBieSB0aGUgSUQgb2YgdGhlIHNlcXVlbmNlLlxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIFdsVG91Y2hQcm94eSBleHRlbmRzIFByb3h5IHtcbiAgICAvKipcbiAgICAgKiBEbyBub3QgY29uc3RydWN0IHByb3hpZXMgZGlyZWN0bHkuIEluc3RlYWQgdXNlIG9uZSBvZiB0aGUgZmFjdG9yeSBtZXRob2RzIGZyb20gb3RoZXIgcHJveGllcy5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihkaXNwbGF5LCBjb25uZWN0aW9uLCBpZCkge1xuICAgICAgICBzdXBlcihkaXNwbGF5LCBjb25uZWN0aW9uLCBpZCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBzaW5jZSAzXG4gICAgICpcbiAgICAgKi9cbiAgICByZWxlYXNlKCkge1xuICAgICAgICBzdXBlci5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuX21hcnNoYWxsKHRoaXMuaWQsIDAsIFtdKTtcbiAgICB9XG4gICAgWzBdKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgKChfYSA9IHRoaXMubGlzdGVuZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5kb3duKHUobWVzc2FnZSksIHUobWVzc2FnZSksIG8obWVzc2FnZSwgdGhpcy5fY29ubmVjdGlvbiksIGkobWVzc2FnZSksIGYobWVzc2FnZSksIGYobWVzc2FnZSkpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFsxXShtZXNzYWdlKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHlpZWxkICgoX2EgPSB0aGlzLmxpc3RlbmVyKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EudXAodShtZXNzYWdlKSwgdShtZXNzYWdlKSwgaShtZXNzYWdlKSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgWzJdKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgKChfYSA9IHRoaXMubGlzdGVuZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5tb3Rpb24odShtZXNzYWdlKSwgaShtZXNzYWdlKSwgZihtZXNzYWdlKSwgZihtZXNzYWdlKSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgWzNdKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgKChfYSA9IHRoaXMubGlzdGVuZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5mcmFtZSgpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFs0XShtZXNzYWdlKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHlpZWxkICgoX2EgPSB0aGlzLmxpc3RlbmVyKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FuY2VsKCkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgWzVdKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgKChfYSA9IHRoaXMubGlzdGVuZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5zaGFwZShpKG1lc3NhZ2UpLCBmKG1lc3NhZ2UpLCBmKG1lc3NhZ2UpKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBbNl0obWVzc2FnZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB5aWVsZCAoKF9hID0gdGhpcy5saXN0ZW5lcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm9yaWVudGF0aW9uKGkobWVzc2FnZSksIGYobWVzc2FnZSkpKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0IGNvbnN0IFdsVG91Y2hQcm90b2NvbE5hbWUgPSAnd2xfdG91Y2gnO1xuLyoqXG4gKlxuICogICAgICBBbiBvdXRwdXQgZGVzY3JpYmVzIHBhcnQgb2YgdGhlIGNvbXBvc2l0b3IgZ2VvbWV0cnkuICBUaGVcbiAqICAgICAgY29tcG9zaXRvciB3b3JrcyBpbiB0aGUgJ2NvbXBvc2l0b3IgY29vcmRpbmF0ZSBzeXN0ZW0nIGFuZCBhblxuICogICAgICBvdXRwdXQgY29ycmVzcG9uZHMgdG8gYSByZWN0YW5ndWxhciBhcmVhIGluIHRoYXQgc3BhY2UgdGhhdCBpc1xuICogICAgICBhY3R1YWxseSB2aXNpYmxlLiAgVGhpcyB0eXBpY2FsbHkgY29ycmVzcG9uZHMgdG8gYSBtb25pdG9yIHRoYXRcbiAqICAgICAgZGlzcGxheXMgcGFydCBvZiB0aGUgY29tcG9zaXRvciBzcGFjZS4gIFRoaXMgb2JqZWN0IGlzIHB1Ymxpc2hlZFxuICogICAgICBhcyBnbG9iYWwgZHVyaW5nIHN0YXJ0IHVwLCBvciB3aGVuIGEgbW9uaXRvciBpcyBob3RwbHVnZ2VkLlxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIFdsT3V0cHV0UHJveHkgZXh0ZW5kcyBQcm94eSB7XG4gICAgLyoqXG4gICAgICogRG8gbm90IGNvbnN0cnVjdCBwcm94aWVzIGRpcmVjdGx5LiBJbnN0ZWFkIHVzZSBvbmUgb2YgdGhlIGZhY3RvcnkgbWV0aG9kcyBmcm9tIG90aGVyIHByb3hpZXMuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZGlzcGxheSwgY29ubmVjdGlvbiwgaWQpIHtcbiAgICAgICAgc3VwZXIoZGlzcGxheSwgY29ubmVjdGlvbiwgaWQpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqXHRVc2luZyB0aGlzIHJlcXVlc3QgYSBjbGllbnQgY2FuIHRlbGwgdGhlIHNlcnZlciB0aGF0IGl0IGlzIG5vdCBnb2luZyB0b1xuICAgICAqXHR1c2UgdGhlIG91dHB1dCBvYmplY3QgYW55bW9yZS5cbiAgICAgKlxuICAgICAqIEBzaW5jZSAzXG4gICAgICpcbiAgICAgKi9cbiAgICByZWxlYXNlKCkge1xuICAgICAgICBzdXBlci5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuX21hcnNoYWxsKHRoaXMuaWQsIDAsIFtdKTtcbiAgICB9XG4gICAgWzBdKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgKChfYSA9IHRoaXMubGlzdGVuZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nZW9tZXRyeShpKG1lc3NhZ2UpLCBpKG1lc3NhZ2UpLCBpKG1lc3NhZ2UpLCBpKG1lc3NhZ2UpLCBpKG1lc3NhZ2UpLCBzKG1lc3NhZ2UpLCBzKG1lc3NhZ2UpLCBpKG1lc3NhZ2UpKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBbMV0obWVzc2FnZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB5aWVsZCAoKF9hID0gdGhpcy5saXN0ZW5lcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm1vZGUodShtZXNzYWdlKSwgaShtZXNzYWdlKSwgaShtZXNzYWdlKSwgaShtZXNzYWdlKSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgWzJdKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgKChfYSA9IHRoaXMubGlzdGVuZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5kb25lKCkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgWzNdKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgKChfYSA9IHRoaXMubGlzdGVuZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5zY2FsZShpKG1lc3NhZ2UpKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydCBjb25zdCBXbE91dHB1dFByb3RvY29sTmFtZSA9ICd3bF9vdXRwdXQnO1xuZXhwb3J0IHZhciBXbE91dHB1dFN1YnBpeGVsO1xuKGZ1bmN0aW9uIChXbE91dHB1dFN1YnBpeGVsKSB7XG4gICAgLyoqXG4gICAgICogdW5rbm93biBnZW9tZXRyeVxuICAgICAqL1xuICAgIFdsT3V0cHV0U3VicGl4ZWxbV2xPdXRwdXRTdWJwaXhlbFtcIl91bmtub3duXCJdID0gMF0gPSBcIl91bmtub3duXCI7XG4gICAgLyoqXG4gICAgICogbm8gZ2VvbWV0cnlcbiAgICAgKi9cbiAgICBXbE91dHB1dFN1YnBpeGVsW1dsT3V0cHV0U3VicGl4ZWxbXCJfbm9uZVwiXSA9IDFdID0gXCJfbm9uZVwiO1xuICAgIC8qKlxuICAgICAqIGhvcml6b250YWwgUkdCXG4gICAgICovXG4gICAgV2xPdXRwdXRTdWJwaXhlbFtXbE91dHB1dFN1YnBpeGVsW1wiX2hvcml6b250YWxSZ2JcIl0gPSAyXSA9IFwiX2hvcml6b250YWxSZ2JcIjtcbiAgICAvKipcbiAgICAgKiBob3Jpem9udGFsIEJHUlxuICAgICAqL1xuICAgIFdsT3V0cHV0U3VicGl4ZWxbV2xPdXRwdXRTdWJwaXhlbFtcIl9ob3Jpem9udGFsQmdyXCJdID0gM10gPSBcIl9ob3Jpem9udGFsQmdyXCI7XG4gICAgLyoqXG4gICAgICogdmVydGljYWwgUkdCXG4gICAgICovXG4gICAgV2xPdXRwdXRTdWJwaXhlbFtXbE91dHB1dFN1YnBpeGVsW1wiX3ZlcnRpY2FsUmdiXCJdID0gNF0gPSBcIl92ZXJ0aWNhbFJnYlwiO1xuICAgIC8qKlxuICAgICAqIHZlcnRpY2FsIEJHUlxuICAgICAqL1xuICAgIFdsT3V0cHV0U3VicGl4ZWxbV2xPdXRwdXRTdWJwaXhlbFtcIl92ZXJ0aWNhbEJnclwiXSA9IDVdID0gXCJfdmVydGljYWxCZ3JcIjtcbn0pKFdsT3V0cHV0U3VicGl4ZWwgfHwgKFdsT3V0cHV0U3VicGl4ZWwgPSB7fSkpO1xuZXhwb3J0IHZhciBXbE91dHB1dFRyYW5zZm9ybTtcbihmdW5jdGlvbiAoV2xPdXRwdXRUcmFuc2Zvcm0pIHtcbiAgICAvKipcbiAgICAgKiBubyB0cmFuc2Zvcm1cbiAgICAgKi9cbiAgICBXbE91dHB1dFRyYW5zZm9ybVtXbE91dHB1dFRyYW5zZm9ybVtcIl9ub3JtYWxcIl0gPSAwXSA9IFwiX25vcm1hbFwiO1xuICAgIC8qKlxuICAgICAqIDkwIGRlZ3JlZXMgY291bnRlci1jbG9ja3dpc2VcbiAgICAgKi9cbiAgICBXbE91dHB1dFRyYW5zZm9ybVtXbE91dHB1dFRyYW5zZm9ybVtcIl85MFwiXSA9IDFdID0gXCJfOTBcIjtcbiAgICAvKipcbiAgICAgKiAxODAgZGVncmVlcyBjb3VudGVyLWNsb2Nrd2lzZVxuICAgICAqL1xuICAgIFdsT3V0cHV0VHJhbnNmb3JtW1dsT3V0cHV0VHJhbnNmb3JtW1wiXzE4MFwiXSA9IDJdID0gXCJfMTgwXCI7XG4gICAgLyoqXG4gICAgICogMjcwIGRlZ3JlZXMgY291bnRlci1jbG9ja3dpc2VcbiAgICAgKi9cbiAgICBXbE91dHB1dFRyYW5zZm9ybVtXbE91dHB1dFRyYW5zZm9ybVtcIl8yNzBcIl0gPSAzXSA9IFwiXzI3MFwiO1xuICAgIC8qKlxuICAgICAqIDE4MCBkZWdyZWUgZmxpcCBhcm91bmQgYSB2ZXJ0aWNhbCBheGlzXG4gICAgICovXG4gICAgV2xPdXRwdXRUcmFuc2Zvcm1bV2xPdXRwdXRUcmFuc2Zvcm1bXCJfZmxpcHBlZFwiXSA9IDRdID0gXCJfZmxpcHBlZFwiO1xuICAgIC8qKlxuICAgICAqIGZsaXAgYW5kIHJvdGF0ZSA5MCBkZWdyZWVzIGNvdW50ZXItY2xvY2t3aXNlXG4gICAgICovXG4gICAgV2xPdXRwdXRUcmFuc2Zvcm1bV2xPdXRwdXRUcmFuc2Zvcm1bXCJfZmxpcHBlZDkwXCJdID0gNV0gPSBcIl9mbGlwcGVkOTBcIjtcbiAgICAvKipcbiAgICAgKiBmbGlwIGFuZCByb3RhdGUgMTgwIGRlZ3JlZXMgY291bnRlci1jbG9ja3dpc2VcbiAgICAgKi9cbiAgICBXbE91dHB1dFRyYW5zZm9ybVtXbE91dHB1dFRyYW5zZm9ybVtcIl9mbGlwcGVkMTgwXCJdID0gNl0gPSBcIl9mbGlwcGVkMTgwXCI7XG4gICAgLyoqXG4gICAgICogZmxpcCBhbmQgcm90YXRlIDI3MCBkZWdyZWVzIGNvdW50ZXItY2xvY2t3aXNlXG4gICAgICovXG4gICAgV2xPdXRwdXRUcmFuc2Zvcm1bV2xPdXRwdXRUcmFuc2Zvcm1bXCJfZmxpcHBlZDI3MFwiXSA9IDddID0gXCJfZmxpcHBlZDI3MFwiO1xufSkoV2xPdXRwdXRUcmFuc2Zvcm0gfHwgKFdsT3V0cHV0VHJhbnNmb3JtID0ge30pKTtcbmV4cG9ydCB2YXIgV2xPdXRwdXRNb2RlO1xuKGZ1bmN0aW9uIChXbE91dHB1dE1vZGUpIHtcbiAgICAvKipcbiAgICAgKiBpbmRpY2F0ZXMgdGhpcyBpcyB0aGUgY3VycmVudCBtb2RlXG4gICAgICovXG4gICAgV2xPdXRwdXRNb2RlW1dsT3V0cHV0TW9kZVtcIl9jdXJyZW50XCJdID0gMV0gPSBcIl9jdXJyZW50XCI7XG4gICAgLyoqXG4gICAgICogaW5kaWNhdGVzIHRoaXMgaXMgdGhlIHByZWZlcnJlZCBtb2RlXG4gICAgICovXG4gICAgV2xPdXRwdXRNb2RlW1dsT3V0cHV0TW9kZVtcIl9wcmVmZXJyZWRcIl0gPSAyXSA9IFwiX3ByZWZlcnJlZFwiO1xufSkoV2xPdXRwdXRNb2RlIHx8IChXbE91dHB1dE1vZGUgPSB7fSkpO1xuLyoqXG4gKlxuICogICAgICBBIHJlZ2lvbiBvYmplY3QgZGVzY3JpYmVzIGFuIGFyZWEuXG4gKlxuICogICAgICBSZWdpb24gb2JqZWN0cyBhcmUgdXNlZCB0byBkZXNjcmliZSB0aGUgb3BhcXVlIGFuZCBpbnB1dFxuICogICAgICByZWdpb25zIG9mIGEgc3VyZmFjZS5cbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBXbFJlZ2lvblByb3h5IGV4dGVuZHMgUHJveHkge1xuICAgIC8qKlxuICAgICAqIERvIG5vdCBjb25zdHJ1Y3QgcHJveGllcyBkaXJlY3RseS4gSW5zdGVhZCB1c2Ugb25lIG9mIHRoZSBmYWN0b3J5IG1ldGhvZHMgZnJvbSBvdGhlciBwcm94aWVzLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKSB7XG4gICAgICAgIHN1cGVyKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0RGVzdHJveSB0aGUgcmVnaW9uLiAgVGhpcyB3aWxsIGludmFsaWRhdGUgdGhlIG9iamVjdCBJRC5cbiAgICAgKlxuICAgICAqIEBzaW5jZSAxXG4gICAgICpcbiAgICAgKi9cbiAgICBkZXN0cm95KCkge1xuICAgICAgICBzdXBlci5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuX21hcnNoYWxsKHRoaXMuaWQsIDAsIFtdKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0QWRkIHRoZSBzcGVjaWZpZWQgcmVjdGFuZ2xlIHRvIHRoZSByZWdpb24uXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgYWRkKHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgMSwgW2ludCh4KSwgaW50KHkpLCBpbnQod2lkdGgpLCBpbnQoaGVpZ2h0KV0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqXHRTdWJ0cmFjdCB0aGUgc3BlY2lmaWVkIHJlY3RhbmdsZSBmcm9tIHRoZSByZWdpb24uXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgc3VidHJhY3QoeCwgeSwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgICB0aGlzLl9tYXJzaGFsbCh0aGlzLmlkLCAyLCBbaW50KHgpLCBpbnQoeSksIGludCh3aWR0aCksIGludChoZWlnaHQpXSk7XG4gICAgfVxufVxuZXhwb3J0IGNvbnN0IFdsUmVnaW9uUHJvdG9jb2xOYW1lID0gJ3dsX3JlZ2lvbic7XG4vKipcbiAqXG4gKiAgICAgIFRoZSBnbG9iYWwgaW50ZXJmYWNlIGV4cG9zaW5nIHN1Yi1zdXJmYWNlIGNvbXBvc2l0aW5nIGNhcGFiaWxpdGllcy5cbiAqICAgICAgQSB3bF9zdXJmYWNlLCB0aGF0IGhhcyBzdWItc3VyZmFjZXMgYXNzb2NpYXRlZCwgaXMgY2FsbGVkIHRoZVxuICogICAgICBwYXJlbnQgc3VyZmFjZS4gU3ViLXN1cmZhY2VzIGNhbiBiZSBhcmJpdHJhcmlseSBuZXN0ZWQgYW5kIGNyZWF0ZVxuICogICAgICBhIHRyZWUgb2Ygc3ViLXN1cmZhY2VzLlxuICpcbiAqICAgICAgVGhlIHJvb3Qgc3VyZmFjZSBpbiBhIHRyZWUgb2Ygc3ViLXN1cmZhY2VzIGlzIHRoZSBtYWluXG4gKiAgICAgIHN1cmZhY2UuIFRoZSBtYWluIHN1cmZhY2UgY2Fubm90IGJlIGEgc3ViLXN1cmZhY2UsIGJlY2F1c2VcbiAqICAgICAgc3ViLXN1cmZhY2VzIG11c3QgYWx3YXlzIGhhdmUgYSBwYXJlbnQuXG4gKlxuICogICAgICBBIG1haW4gc3VyZmFjZSB3aXRoIGl0cyBzdWItc3VyZmFjZXMgZm9ybXMgYSAoY29tcG91bmQpIHdpbmRvdy5cbiAqICAgICAgRm9yIHdpbmRvdyBtYW5hZ2VtZW50IHB1cnBvc2VzLCB0aGlzIHNldCBvZiB3bF9zdXJmYWNlIG9iamVjdHMgaXNcbiAqICAgICAgdG8gYmUgY29uc2lkZXJlZCBhcyBhIHNpbmdsZSB3aW5kb3csIGFuZCBpdCBzaG91bGQgYWxzbyBiZWhhdmUgYXNcbiAqICAgICAgc3VjaC5cbiAqXG4gKiAgICAgIFRoZSBhaW0gb2Ygc3ViLXN1cmZhY2VzIGlzIHRvIG9mZmxvYWQgc29tZSBvZiB0aGUgY29tcG9zaXRpbmcgd29ya1xuICogICAgICB3aXRoaW4gYSB3aW5kb3cgZnJvbSBjbGllbnRzIHRvIHRoZSBjb21wb3NpdG9yLiBBIHByaW1lIGV4YW1wbGUgaXNcbiAqICAgICAgYSB2aWRlbyBwbGF5ZXIgd2l0aCBkZWNvcmF0aW9ucyBhbmQgdmlkZW8gaW4gc2VwYXJhdGUgd2xfc3VyZmFjZVxuICogICAgICBvYmplY3RzLiBUaGlzIHNob3VsZCBhbGxvdyB0aGUgY29tcG9zaXRvciB0byBwYXNzIFlVViB2aWRlbyBidWZmZXJcbiAqICAgICAgcHJvY2Vzc2luZyB0byBkZWRpY2F0ZWQgb3ZlcmxheSBoYXJkd2FyZSB3aGVuIHBvc3NpYmxlLlxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIFdsU3ViY29tcG9zaXRvclByb3h5IGV4dGVuZHMgUHJveHkge1xuICAgIC8qKlxuICAgICAqIERvIG5vdCBjb25zdHJ1Y3QgcHJveGllcyBkaXJlY3RseS4gSW5zdGVhZCB1c2Ugb25lIG9mIHRoZSBmYWN0b3J5IG1ldGhvZHMgZnJvbSBvdGhlciBwcm94aWVzLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKSB7XG4gICAgICAgIHN1cGVyKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0SW5mb3JtcyB0aGUgc2VydmVyIHRoYXQgdGhlIGNsaWVudCB3aWxsIG5vdCBiZSB1c2luZyB0aGlzXG4gICAgICpcdHByb3RvY29sIG9iamVjdCBhbnltb3JlLiBUaGlzIGRvZXMgbm90IGFmZmVjdCBhbnkgb3RoZXJcbiAgICAgKlx0b2JqZWN0cywgd2xfc3Vic3VyZmFjZSBvYmplY3RzIGluY2x1ZGVkLlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgMCwgW10pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqXHRDcmVhdGUgYSBzdWItc3VyZmFjZSBpbnRlcmZhY2UgZm9yIHRoZSBnaXZlbiBzdXJmYWNlLCBhbmRcbiAgICAgKlx0YXNzb2NpYXRlIGl0IHdpdGggdGhlIGdpdmVuIHBhcmVudCBzdXJmYWNlLiBUaGlzIHR1cm5zIGFcbiAgICAgKlx0cGxhaW4gd2xfc3VyZmFjZSBpbnRvIGEgc3ViLXN1cmZhY2UuXG4gICAgICpcbiAgICAgKlx0VGhlIHRvLWJlIHN1Yi1zdXJmYWNlIG11c3Qgbm90IGFscmVhZHkgaGF2ZSBhbm90aGVyIHJvbGUsIGFuZCBpdFxuICAgICAqXHRtdXN0IG5vdCBoYXZlIGFuIGV4aXN0aW5nIHdsX3N1YnN1cmZhY2Ugb2JqZWN0LiBPdGhlcndpc2UgYSBwcm90b2NvbFxuICAgICAqXHRlcnJvciBpcyByYWlzZWQuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgZ2V0U3Vic3VyZmFjZShzdXJmYWNlLCBwYXJlbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hcnNoYWxsQ29uc3RydWN0b3IodGhpcy5pZCwgMSwgV2VzdGZpZWxkLldsU3Vic3VyZmFjZVByb3h5LCBbbmV3T2JqZWN0KCksIG9iamVjdChzdXJmYWNlKSwgb2JqZWN0KHBhcmVudCldKTtcbiAgICB9XG59XG5leHBvcnQgY29uc3QgV2xTdWJjb21wb3NpdG9yUHJvdG9jb2xOYW1lID0gJ3dsX3N1YmNvbXBvc2l0b3InO1xuZXhwb3J0IHZhciBXbFN1YmNvbXBvc2l0b3JFcnJvcjtcbihmdW5jdGlvbiAoV2xTdWJjb21wb3NpdG9yRXJyb3IpIHtcbiAgICAvKipcbiAgICAgKiB0aGUgdG8tYmUgc3ViLXN1cmZhY2UgaXMgaW52YWxpZFxuICAgICAqL1xuICAgIFdsU3ViY29tcG9zaXRvckVycm9yW1dsU3ViY29tcG9zaXRvckVycm9yW1wiX2JhZFN1cmZhY2VcIl0gPSAwXSA9IFwiX2JhZFN1cmZhY2VcIjtcbn0pKFdsU3ViY29tcG9zaXRvckVycm9yIHx8IChXbFN1YmNvbXBvc2l0b3JFcnJvciA9IHt9KSk7XG4vKipcbiAqXG4gKiAgICAgIEFuIGFkZGl0aW9uYWwgaW50ZXJmYWNlIHRvIGEgd2xfc3VyZmFjZSBvYmplY3QsIHdoaWNoIGhhcyBiZWVuXG4gKiAgICAgIG1hZGUgYSBzdWItc3VyZmFjZS4gQSBzdWItc3VyZmFjZSBoYXMgb25lIHBhcmVudCBzdXJmYWNlLiBBXG4gKiAgICAgIHN1Yi1zdXJmYWNlJ3Mgc2l6ZSBhbmQgcG9zaXRpb24gYXJlIG5vdCBsaW1pdGVkIHRvIHRoYXQgb2YgdGhlIHBhcmVudC5cbiAqICAgICAgUGFydGljdWxhcmx5LCBhIHN1Yi1zdXJmYWNlIGlzIG5vdCBhdXRvbWF0aWNhbGx5IGNsaXBwZWQgdG8gaXRzXG4gKiAgICAgIHBhcmVudCdzIGFyZWEuXG4gKlxuICogICAgICBBIHN1Yi1zdXJmYWNlIGJlY29tZXMgbWFwcGVkLCB3aGVuIGEgbm9uLU5VTEwgd2xfYnVmZmVyIGlzIGFwcGxpZWRcbiAqICAgICAgYW5kIHRoZSBwYXJlbnQgc3VyZmFjZSBpcyBtYXBwZWQuIFRoZSBvcmRlciBvZiB3aGljaCBvbmUgaGFwcGVuc1xuICogICAgICBmaXJzdCBpcyBpcnJlbGV2YW50LiBBIHN1Yi1zdXJmYWNlIGlzIGhpZGRlbiBpZiB0aGUgcGFyZW50IGJlY29tZXNcbiAqICAgICAgaGlkZGVuLCBvciBpZiBhIE5VTEwgd2xfYnVmZmVyIGlzIGFwcGxpZWQuIFRoZXNlIHJ1bGVzIGFwcGx5XG4gKiAgICAgIHJlY3Vyc2l2ZWx5IHRocm91Z2ggdGhlIHRyZWUgb2Ygc3VyZmFjZXMuXG4gKlxuICogICAgICBUaGUgYmVoYXZpb3VyIG9mIGEgd2xfc3VyZmFjZS5jb21taXQgcmVxdWVzdCBvbiBhIHN1Yi1zdXJmYWNlXG4gKiAgICAgIGRlcGVuZHMgb24gdGhlIHN1Yi1zdXJmYWNlJ3MgbW9kZS4gVGhlIHBvc3NpYmxlIG1vZGVzIGFyZVxuICogICAgICBzeW5jaHJvbml6ZWQgYW5kIGRlc3luY2hyb25pemVkLCBzZWUgbWV0aG9kc1xuICogICAgICB3bF9zdWJzdXJmYWNlLnNldF9zeW5jIGFuZCB3bF9zdWJzdXJmYWNlLnNldF9kZXN5bmMuIFN5bmNocm9uaXplZFxuICogICAgICBtb2RlIGNhY2hlcyB0aGUgd2xfc3VyZmFjZSBzdGF0ZSB0byBiZSBhcHBsaWVkIHdoZW4gdGhlIHBhcmVudCdzXG4gKiAgICAgIHN0YXRlIGdldHMgYXBwbGllZCwgYW5kIGRlc3luY2hyb25pemVkIG1vZGUgYXBwbGllcyB0aGUgcGVuZGluZ1xuICogICAgICB3bF9zdXJmYWNlIHN0YXRlIGRpcmVjdGx5LiBBIHN1Yi1zdXJmYWNlIGlzIGluaXRpYWxseSBpbiB0aGVcbiAqICAgICAgc3luY2hyb25pemVkIG1vZGUuXG4gKlxuICogICAgICBTdWItc3VyZmFjZXMgaGF2ZSBhbHNvIG90aGVyIGtpbmQgb2Ygc3RhdGUsIHdoaWNoIGlzIG1hbmFnZWQgYnlcbiAqICAgICAgd2xfc3Vic3VyZmFjZSByZXF1ZXN0cywgYXMgb3Bwb3NlZCB0byB3bF9zdXJmYWNlIHJlcXVlc3RzLiBUaGlzXG4gKiAgICAgIHN0YXRlIGluY2x1ZGVzIHRoZSBzdWItc3VyZmFjZSBwb3NpdGlvbiByZWxhdGl2ZSB0byB0aGUgcGFyZW50XG4gKiAgICAgIHN1cmZhY2UgKHdsX3N1YnN1cmZhY2Uuc2V0X3Bvc2l0aW9uKSwgYW5kIHRoZSBzdGFja2luZyBvcmRlciBvZlxuICogICAgICB0aGUgcGFyZW50IGFuZCBpdHMgc3ViLXN1cmZhY2VzICh3bF9zdWJzdXJmYWNlLnBsYWNlX2Fib3ZlIGFuZFxuICogICAgICAucGxhY2VfYmVsb3cpLiBUaGlzIHN0YXRlIGlzIGFwcGxpZWQgd2hlbiB0aGUgcGFyZW50IHN1cmZhY2Unc1xuICogICAgICB3bF9zdXJmYWNlIHN0YXRlIGlzIGFwcGxpZWQsIHJlZ2FyZGxlc3Mgb2YgdGhlIHN1Yi1zdXJmYWNlJ3MgbW9kZS5cbiAqICAgICAgQXMgdGhlIGV4Y2VwdGlvbiwgc2V0X3N5bmMgYW5kIHNldF9kZXN5bmMgYXJlIGVmZmVjdGl2ZSBpbW1lZGlhdGVseS5cbiAqXG4gKiAgICAgIFRoZSBtYWluIHN1cmZhY2UgY2FuIGJlIHRob3VnaHQgdG8gYmUgYWx3YXlzIGluIGRlc3luY2hyb25pemVkIG1vZGUsXG4gKiAgICAgIHNpbmNlIGl0IGRvZXMgbm90IGhhdmUgYSBwYXJlbnQgaW4gdGhlIHN1Yi1zdXJmYWNlcyBzZW5zZS5cbiAqXG4gKiAgICAgIEV2ZW4gaWYgYSBzdWItc3VyZmFjZSBpcyBpbiBkZXN5bmNocm9uaXplZCBtb2RlLCBpdCB3aWxsIGJlaGF2ZSBhc1xuICogICAgICBpbiBzeW5jaHJvbml6ZWQgbW9kZSwgaWYgaXRzIHBhcmVudCBzdXJmYWNlIGJlaGF2ZXMgYXMgaW5cbiAqICAgICAgc3luY2hyb25pemVkIG1vZGUuIFRoaXMgcnVsZSBpcyBhcHBsaWVkIHJlY3Vyc2l2ZWx5IHRocm91Z2hvdXQgdGhlXG4gKiAgICAgIHRyZWUgb2Ygc3VyZmFjZXMuIFRoaXMgbWVhbnMsIHRoYXQgb25lIGNhbiBzZXQgYSBzdWItc3VyZmFjZSBpbnRvXG4gKiAgICAgIHN5bmNocm9uaXplZCBtb2RlLCBhbmQgdGhlbiBhc3N1bWUgdGhhdCBhbGwgaXRzIGNoaWxkIGFuZCBncmFuZC1jaGlsZFxuICogICAgICBzdWItc3VyZmFjZXMgYXJlIHN5bmNocm9uaXplZCwgdG9vLCB3aXRob3V0IGV4cGxpY2l0bHkgc2V0dGluZyB0aGVtLlxuICpcbiAqICAgICAgSWYgdGhlIHdsX3N1cmZhY2UgYXNzb2NpYXRlZCB3aXRoIHRoZSB3bF9zdWJzdXJmYWNlIGlzIGRlc3Ryb3llZCwgdGhlXG4gKiAgICAgIHdsX3N1YnN1cmZhY2Ugb2JqZWN0IGJlY29tZXMgaW5lcnQuIE5vdGUsIHRoYXQgZGVzdHJveWluZyBlaXRoZXIgb2JqZWN0XG4gKiAgICAgIHRha2VzIGVmZmVjdCBpbW1lZGlhdGVseS4gSWYgeW91IG5lZWQgdG8gc3luY2hyb25pemUgdGhlIHJlbW92YWxcbiAqICAgICAgb2YgYSBzdWItc3VyZmFjZSB0byB0aGUgcGFyZW50IHN1cmZhY2UgdXBkYXRlLCB1bm1hcCB0aGUgc3ViLXN1cmZhY2VcbiAqICAgICAgZmlyc3QgYnkgYXR0YWNoaW5nIGEgTlVMTCB3bF9idWZmZXIsIHVwZGF0ZSBwYXJlbnQsIGFuZCB0aGVuIGRlc3Ryb3lcbiAqICAgICAgdGhlIHN1Yi1zdXJmYWNlLlxuICpcbiAqICAgICAgSWYgdGhlIHBhcmVudCB3bF9zdXJmYWNlIG9iamVjdCBpcyBkZXN0cm95ZWQsIHRoZSBzdWItc3VyZmFjZSBpc1xuICogICAgICB1bm1hcHBlZC5cbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBXbFN1YnN1cmZhY2VQcm94eSBleHRlbmRzIFByb3h5IHtcbiAgICAvKipcbiAgICAgKiBEbyBub3QgY29uc3RydWN0IHByb3hpZXMgZGlyZWN0bHkuIEluc3RlYWQgdXNlIG9uZSBvZiB0aGUgZmFjdG9yeSBtZXRob2RzIGZyb20gb3RoZXIgcHJveGllcy5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihkaXNwbGF5LCBjb25uZWN0aW9uLCBpZCkge1xuICAgICAgICBzdXBlcihkaXNwbGF5LCBjb25uZWN0aW9uLCBpZCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdFRoZSBzdWItc3VyZmFjZSBpbnRlcmZhY2UgaXMgcmVtb3ZlZCBmcm9tIHRoZSB3bF9zdXJmYWNlIG9iamVjdFxuICAgICAqXHR0aGF0IHdhcyB0dXJuZWQgaW50byBhIHN1Yi1zdXJmYWNlIHdpdGggYVxuICAgICAqXHR3bF9zdWJjb21wb3NpdG9yLmdldF9zdWJzdXJmYWNlIHJlcXVlc3QuIFRoZSB3bF9zdXJmYWNlJ3MgYXNzb2NpYXRpb25cbiAgICAgKlx0dG8gdGhlIHBhcmVudCBpcyBkZWxldGVkLCBhbmQgdGhlIHdsX3N1cmZhY2UgbG9zZXMgaXRzIHJvbGUgYXNcbiAgICAgKlx0YSBzdWItc3VyZmFjZS4gVGhlIHdsX3N1cmZhY2UgaXMgdW5tYXBwZWQuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLl9tYXJzaGFsbCh0aGlzLmlkLCAwLCBbXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdFRoaXMgc2NoZWR1bGVzIGEgc3ViLXN1cmZhY2UgcG9zaXRpb24gY2hhbmdlLlxuICAgICAqXHRUaGUgc3ViLXN1cmZhY2Ugd2lsbCBiZSBtb3ZlZCBzbyB0aGF0IGl0cyBvcmlnaW4gKHRvcCBsZWZ0XG4gICAgICpcdGNvcm5lciBwaXhlbCkgd2lsbCBiZSBhdCB0aGUgbG9jYXRpb24geCwgeSBvZiB0aGUgcGFyZW50IHN1cmZhY2VcbiAgICAgKlx0Y29vcmRpbmF0ZSBzeXN0ZW0uIFRoZSBjb29yZGluYXRlcyBhcmUgbm90IHJlc3RyaWN0ZWQgdG8gdGhlIHBhcmVudFxuICAgICAqXHRzdXJmYWNlIGFyZWEuIE5lZ2F0aXZlIHZhbHVlcyBhcmUgYWxsb3dlZC5cbiAgICAgKlxuICAgICAqXHRUaGUgc2NoZWR1bGVkIGNvb3JkaW5hdGVzIHdpbGwgdGFrZSBlZmZlY3Qgd2hlbmV2ZXIgdGhlIHN0YXRlIG9mIHRoZVxuICAgICAqXHRwYXJlbnQgc3VyZmFjZSBpcyBhcHBsaWVkLiBXaGVuIHRoaXMgaGFwcGVucyBkZXBlbmRzIG9uIHdoZXRoZXIgdGhlXG4gICAgICpcdHBhcmVudCBzdXJmYWNlIGlzIGluIHN5bmNocm9uaXplZCBtb2RlIG9yIG5vdC4gU2VlXG4gICAgICpcdHdsX3N1YnN1cmZhY2Uuc2V0X3N5bmMgYW5kIHdsX3N1YnN1cmZhY2Uuc2V0X2Rlc3luYyBmb3IgZGV0YWlscy5cbiAgICAgKlxuICAgICAqXHRJZiBtb3JlIHRoYW4gb25lIHNldF9wb3NpdGlvbiByZXF1ZXN0IGlzIGludm9rZWQgYnkgdGhlIGNsaWVudCBiZWZvcmVcbiAgICAgKlx0dGhlIGNvbW1pdCBvZiB0aGUgcGFyZW50IHN1cmZhY2UsIHRoZSBwb3NpdGlvbiBvZiBhIG5ldyByZXF1ZXN0IGFsd2F5c1xuICAgICAqXHRyZXBsYWNlcyB0aGUgc2NoZWR1bGVkIHBvc2l0aW9uIGZyb20gYW55IHByZXZpb3VzIHJlcXVlc3QuXG4gICAgICpcbiAgICAgKlx0VGhlIGluaXRpYWwgcG9zaXRpb24gaXMgMCwgMC5cbiAgICAgKlxuICAgICAqIEBzaW5jZSAxXG4gICAgICpcbiAgICAgKi9cbiAgICBzZXRQb3NpdGlvbih4LCB5KSB7XG4gICAgICAgIHRoaXMuX21hcnNoYWxsKHRoaXMuaWQsIDEsIFtpbnQoeCksIGludCh5KV0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqXHRUaGlzIHN1Yi1zdXJmYWNlIGlzIHRha2VuIGZyb20gdGhlIHN0YWNrLCBhbmQgcHV0IGJhY2sganVzdFxuICAgICAqXHRhYm92ZSB0aGUgcmVmZXJlbmNlIHN1cmZhY2UsIGNoYW5naW5nIHRoZSB6LW9yZGVyIG9mIHRoZSBzdWItc3VyZmFjZXMuXG4gICAgICpcdFRoZSByZWZlcmVuY2Ugc3VyZmFjZSBtdXN0IGJlIG9uZSBvZiB0aGUgc2libGluZyBzdXJmYWNlcywgb3IgdGhlXG4gICAgICpcdHBhcmVudCBzdXJmYWNlLiBVc2luZyBhbnkgb3RoZXIgc3VyZmFjZSwgaW5jbHVkaW5nIHRoaXMgc3ViLXN1cmZhY2UsXG4gICAgICpcdHdpbGwgY2F1c2UgYSBwcm90b2NvbCBlcnJvci5cbiAgICAgKlxuICAgICAqXHRUaGUgei1vcmRlciBpcyBkb3VibGUtYnVmZmVyZWQuIFJlcXVlc3RzIGFyZSBoYW5kbGVkIGluIG9yZGVyIGFuZFxuICAgICAqXHRhcHBsaWVkIGltbWVkaWF0ZWx5IHRvIGEgcGVuZGluZyBzdGF0ZS4gVGhlIGZpbmFsIHBlbmRpbmcgc3RhdGUgaXNcbiAgICAgKlx0Y29waWVkIHRvIHRoZSBhY3RpdmUgc3RhdGUgdGhlIG5leHQgdGltZSB0aGUgc3RhdGUgb2YgdGhlIHBhcmVudFxuICAgICAqXHRzdXJmYWNlIGlzIGFwcGxpZWQuIFdoZW4gdGhpcyBoYXBwZW5zIGRlcGVuZHMgb24gd2hldGhlciB0aGUgcGFyZW50XG4gICAgICpcdHN1cmZhY2UgaXMgaW4gc3luY2hyb25pemVkIG1vZGUgb3Igbm90LiBTZWUgd2xfc3Vic3VyZmFjZS5zZXRfc3luYyBhbmRcbiAgICAgKlx0d2xfc3Vic3VyZmFjZS5zZXRfZGVzeW5jIGZvciBkZXRhaWxzLlxuICAgICAqXG4gICAgICpcdEEgbmV3IHN1Yi1zdXJmYWNlIGlzIGluaXRpYWxseSBhZGRlZCBhcyB0aGUgdG9wLW1vc3QgaW4gdGhlIHN0YWNrXG4gICAgICpcdG9mIGl0cyBzaWJsaW5ncyBhbmQgcGFyZW50LlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIHBsYWNlQWJvdmUoc2libGluZykge1xuICAgICAgICB0aGlzLl9tYXJzaGFsbCh0aGlzLmlkLCAyLCBbb2JqZWN0KHNpYmxpbmcpXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdFRoZSBzdWItc3VyZmFjZSBpcyBwbGFjZWQganVzdCBiZWxvdyB0aGUgcmVmZXJlbmNlIHN1cmZhY2UuXG4gICAgICpcdFNlZSB3bF9zdWJzdXJmYWNlLnBsYWNlX2Fib3ZlLlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIHBsYWNlQmVsb3coc2libGluZykge1xuICAgICAgICB0aGlzLl9tYXJzaGFsbCh0aGlzLmlkLCAzLCBbb2JqZWN0KHNpYmxpbmcpXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdENoYW5nZSB0aGUgY29tbWl0IGJlaGF2aW91ciBvZiB0aGUgc3ViLXN1cmZhY2UgdG8gc3luY2hyb25pemVkXG4gICAgICpcdG1vZGUsIGFsc28gZGVzY3JpYmVkIGFzIHRoZSBwYXJlbnQgZGVwZW5kZW50IG1vZGUuXG4gICAgICpcbiAgICAgKlx0SW4gc3luY2hyb25pemVkIG1vZGUsIHdsX3N1cmZhY2UuY29tbWl0IG9uIGEgc3ViLXN1cmZhY2Ugd2lsbFxuICAgICAqXHRhY2N1bXVsYXRlIHRoZSBjb21taXR0ZWQgc3RhdGUgaW4gYSBjYWNoZSwgYnV0IHRoZSBzdGF0ZSB3aWxsXG4gICAgICpcdG5vdCBiZSBhcHBsaWVkIGFuZCBoZW5jZSB3aWxsIG5vdCBjaGFuZ2UgdGhlIGNvbXBvc2l0b3Igb3V0cHV0LlxuICAgICAqXHRUaGUgY2FjaGVkIHN0YXRlIGlzIGFwcGxpZWQgdG8gdGhlIHN1Yi1zdXJmYWNlIGltbWVkaWF0ZWx5IGFmdGVyXG4gICAgICpcdHRoZSBwYXJlbnQgc3VyZmFjZSdzIHN0YXRlIGlzIGFwcGxpZWQuIFRoaXMgZW5zdXJlcyBhdG9taWNcbiAgICAgKlx0dXBkYXRlcyBvZiB0aGUgcGFyZW50IGFuZCBhbGwgaXRzIHN5bmNocm9uaXplZCBzdWItc3VyZmFjZXMuXG4gICAgICpcdEFwcGx5aW5nIHRoZSBjYWNoZWQgc3RhdGUgd2lsbCBpbnZhbGlkYXRlIHRoZSBjYWNoZSwgc28gZnVydGhlclxuICAgICAqXHRwYXJlbnQgc3VyZmFjZSBjb21taXRzIGRvIG5vdCAocmUtKWFwcGx5IG9sZCBzdGF0ZS5cbiAgICAgKlxuICAgICAqXHRTZWUgd2xfc3Vic3VyZmFjZSBmb3IgdGhlIHJlY3Vyc2l2ZSBlZmZlY3Qgb2YgdGhpcyBtb2RlLlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIHNldFN5bmMoKSB7XG4gICAgICAgIHRoaXMuX21hcnNoYWxsKHRoaXMuaWQsIDQsIFtdKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0Q2hhbmdlIHRoZSBjb21taXQgYmVoYXZpb3VyIG9mIHRoZSBzdWItc3VyZmFjZSB0byBkZXN5bmNocm9uaXplZFxuICAgICAqXHRtb2RlLCBhbHNvIGRlc2NyaWJlZCBhcyBpbmRlcGVuZGVudCBvciBmcmVlbHkgcnVubmluZyBtb2RlLlxuICAgICAqXG4gICAgICpcdEluIGRlc3luY2hyb25pemVkIG1vZGUsIHdsX3N1cmZhY2UuY29tbWl0IG9uIGEgc3ViLXN1cmZhY2Ugd2lsbFxuICAgICAqXHRhcHBseSB0aGUgcGVuZGluZyBzdGF0ZSBkaXJlY3RseSwgd2l0aG91dCBjYWNoaW5nLCBhcyBoYXBwZW5zXG4gICAgICpcdG5vcm1hbGx5IHdpdGggYSB3bF9zdXJmYWNlLiBDYWxsaW5nIHdsX3N1cmZhY2UuY29tbWl0IG9uIHRoZVxuICAgICAqXHRwYXJlbnQgc3VyZmFjZSBoYXMgbm8gZWZmZWN0IG9uIHRoZSBzdWItc3VyZmFjZSdzIHdsX3N1cmZhY2VcbiAgICAgKlx0c3RhdGUuIFRoaXMgbW9kZSBhbGxvd3MgYSBzdWItc3VyZmFjZSB0byBiZSB1cGRhdGVkIG9uIGl0cyBvd24uXG4gICAgICpcbiAgICAgKlx0SWYgY2FjaGVkIHN0YXRlIGV4aXN0cyB3aGVuIHdsX3N1cmZhY2UuY29tbWl0IGlzIGNhbGxlZCBpblxuICAgICAqXHRkZXN5bmNocm9uaXplZCBtb2RlLCB0aGUgcGVuZGluZyBzdGF0ZSBpcyBhZGRlZCB0byB0aGUgY2FjaGVkXG4gICAgICpcdHN0YXRlLCBhbmQgYXBwbGllZCBhcyBhIHdob2xlLiBUaGlzIGludmFsaWRhdGVzIHRoZSBjYWNoZS5cbiAgICAgKlxuICAgICAqXHROb3RlOiBldmVuIGlmIGEgc3ViLXN1cmZhY2UgaXMgc2V0IHRvIGRlc3luY2hyb25pemVkLCBhIHBhcmVudFxuICAgICAqXHRzdWItc3VyZmFjZSBtYXkgb3ZlcnJpZGUgaXQgdG8gYmVoYXZlIGFzIHN5bmNocm9uaXplZC4gRm9yIGRldGFpbHMsXG4gICAgICpcdHNlZSB3bF9zdWJzdXJmYWNlLlxuICAgICAqXG4gICAgICpcdElmIGEgc3VyZmFjZSdzIHBhcmVudCBzdXJmYWNlIGJlaGF2ZXMgYXMgZGVzeW5jaHJvbml6ZWQsIHRoZW5cbiAgICAgKlx0dGhlIGNhY2hlZCBzdGF0ZSBpcyBhcHBsaWVkIG9uIHNldF9kZXN5bmMuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgc2V0RGVzeW5jKCkge1xuICAgICAgICB0aGlzLl9tYXJzaGFsbCh0aGlzLmlkLCA1LCBbXSk7XG4gICAgfVxufVxuZXhwb3J0IGNvbnN0IFdsU3Vic3VyZmFjZVByb3RvY29sTmFtZSA9ICd3bF9zdWJzdXJmYWNlJztcbmV4cG9ydCB2YXIgV2xTdWJzdXJmYWNlRXJyb3I7XG4oZnVuY3Rpb24gKFdsU3Vic3VyZmFjZUVycm9yKSB7XG4gICAgLyoqXG4gICAgICogd2xfc3VyZmFjZSBpcyBub3QgYSBzaWJsaW5nIG9yIHRoZSBwYXJlbnRcbiAgICAgKi9cbiAgICBXbFN1YnN1cmZhY2VFcnJvcltXbFN1YnN1cmZhY2VFcnJvcltcIl9iYWRTdXJmYWNlXCJdID0gMF0gPSBcIl9iYWRTdXJmYWNlXCI7XG59KShXbFN1YnN1cmZhY2VFcnJvciB8fCAoV2xTdWJzdXJmYWNlRXJyb3IgPSB7fSkpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d2F5bGFuZC5qcy5tYXAiLCIvKlxuICpcbiAqICAgIENvcHlyaWdodCDCqSAyMDA4LTIwMTMgS3Jpc3RpYW4gSMO4Z3NiZXJnXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMyAgICAgIFJhZmFlbCBBbnRvZ25vbGxpXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMyAgICAgIEphc3BlciBTdC4gUGllcnJlXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxMC0yMDEzIEludGVsIENvcnBvcmF0aW9uXG4gKiAgICBDb3B5cmlnaHQgwqkgMjAxNS0yMDE3IFNhbXN1bmcgRWxlY3Ryb25pY3MgQ28uLCBMdGRcbiAqICAgIENvcHlyaWdodCDCqSAyMDE1LTIwMTcgUmVkIEhhdCBJbmMuXG4gKlxuICogICAgUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbiAqICAgIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSxcbiAqICAgIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb25cbiAqICAgIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLFxuICogICAgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlXG4gKiAgICBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqICAgIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIChpbmNsdWRpbmcgdGhlIG5leHRcbiAqICAgIHBhcmFncmFwaCkgc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGVcbiAqICAgIFNvZnR3YXJlLlxuICpcbiAqICAgIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqICAgIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogICAgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gIElOIE5PIEVWRU5UIFNIQUxMXG4gKiAgICBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogICAgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkdcbiAqICAgIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVJcbiAqICAgIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqXG4gKi9cbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuaW1wb3J0IHsgdWludCwgaW50LCBvYmplY3QsIG9iamVjdE9wdGlvbmFsLCBuZXdPYmplY3QsIHN0cmluZywgdSwgaSwgYSB9IGZyb20gJ3dlc3RmaWVsZC1ydW50aW1lLWNvbW1vbic7XG5pbXBvcnQgKiBhcyBXZXN0ZmllbGQgZnJvbSAnLic7XG5pbXBvcnQgeyBQcm94eSB9IGZyb20gJy4uL3dlc3RmaWVsZC1ydW50aW1lLWNsaWVudCc7XG4vKipcbiAqXG4gKiAgICAgIFRoZSB4ZGdfd21fYmFzZSBpbnRlcmZhY2UgaXMgZXhwb3NlZCBhcyBhIGdsb2JhbCBvYmplY3QgZW5hYmxpbmcgY2xpZW50c1xuICogICAgICB0byB0dXJuIHRoZWlyIHdsX3N1cmZhY2VzIGludG8gd2luZG93cyBpbiBhIGRlc2t0b3AgZW52aXJvbm1lbnQuIEl0XG4gKiAgICAgIGRlZmluZXMgdGhlIGJhc2ljIGZ1bmN0aW9uYWxpdHkgbmVlZGVkIGZvciBjbGllbnRzIGFuZCB0aGUgY29tcG9zaXRvciB0b1xuICogICAgICBjcmVhdGUgd2luZG93cyB0aGF0IGNhbiBiZSBkcmFnZ2VkLCByZXNpemVkLCBtYXhpbWl6ZWQsIGV0YywgYXMgd2VsbCBhc1xuICogICAgICBjcmVhdGluZyB0cmFuc2llbnQgd2luZG93cyBzdWNoIGFzIHBvcHVwIG1lbnVzLlxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIFhkZ1dtQmFzZVByb3h5IGV4dGVuZHMgUHJveHkge1xuICAgIC8qKlxuICAgICAqIERvIG5vdCBjb25zdHJ1Y3QgcHJveGllcyBkaXJlY3RseS4gSW5zdGVhZCB1c2Ugb25lIG9mIHRoZSBmYWN0b3J5IG1ldGhvZHMgZnJvbSBvdGhlciBwcm94aWVzLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKSB7XG4gICAgICAgIHN1cGVyKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0RGVzdHJveSB0aGlzIHhkZ193bV9iYXNlIG9iamVjdC5cbiAgICAgKlxuICAgICAqXHREZXN0cm95aW5nIGEgYm91bmQgeGRnX3dtX2Jhc2Ugb2JqZWN0IHdoaWxlIHRoZXJlIGFyZSBzdXJmYWNlc1xuICAgICAqXHRzdGlsbCBhbGl2ZSBjcmVhdGVkIGJ5IHRoaXMgeGRnX3dtX2Jhc2Ugb2JqZWN0IGluc3RhbmNlIGlzIGlsbGVnYWxcbiAgICAgKlx0YW5kIHdpbGwgcmVzdWx0IGluIGEgcHJvdG9jb2wgZXJyb3IuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLl9tYXJzaGFsbCh0aGlzLmlkLCAwLCBbXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdENyZWF0ZSBhIHBvc2l0aW9uZXIgb2JqZWN0LiBBIHBvc2l0aW9uZXIgb2JqZWN0IGlzIHVzZWQgdG8gcG9zaXRpb25cbiAgICAgKlx0c3VyZmFjZXMgcmVsYXRpdmUgdG8gc29tZSBwYXJlbnQgc3VyZmFjZS4gU2VlIHRoZSBpbnRlcmZhY2UgZGVzY3JpcHRpb25cbiAgICAgKlx0YW5kIHhkZ19zdXJmYWNlLmdldF9wb3B1cCBmb3IgZGV0YWlscy5cbiAgICAgKlxuICAgICAqIEBzaW5jZSAxXG4gICAgICpcbiAgICAgKi9cbiAgICBjcmVhdGVQb3NpdGlvbmVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWFyc2hhbGxDb25zdHJ1Y3Rvcih0aGlzLmlkLCAxLCBXZXN0ZmllbGQuWGRnUG9zaXRpb25lclByb3h5LCBbbmV3T2JqZWN0KCldKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0VGhpcyBjcmVhdGVzIGFuIHhkZ19zdXJmYWNlIGZvciB0aGUgZ2l2ZW4gc3VyZmFjZS4gV2hpbGUgeGRnX3N1cmZhY2VcbiAgICAgKlx0aXRzZWxmIGlzIG5vdCBhIHJvbGUsIHRoZSBjb3JyZXNwb25kaW5nIHN1cmZhY2UgbWF5IG9ubHkgYmUgYXNzaWduZWRcbiAgICAgKlx0YSByb2xlIGV4dGVuZGluZyB4ZGdfc3VyZmFjZSwgc3VjaCBhcyB4ZGdfdG9wbGV2ZWwgb3IgeGRnX3BvcHVwLlxuICAgICAqXG4gICAgICpcdFRoaXMgY3JlYXRlcyBhbiB4ZGdfc3VyZmFjZSBmb3IgdGhlIGdpdmVuIHN1cmZhY2UuIEFuIHhkZ19zdXJmYWNlIGlzXG4gICAgICpcdHVzZWQgYXMgYmFzaXMgdG8gZGVmaW5lIGEgcm9sZSB0byBhIGdpdmVuIHN1cmZhY2UsIHN1Y2ggYXMgeGRnX3RvcGxldmVsXG4gICAgICpcdG9yIHhkZ19wb3B1cC4gSXQgYWxzbyBtYW5hZ2VzIGZ1bmN0aW9uYWxpdHkgc2hhcmVkIGJldHdlZW4geGRnX3N1cmZhY2VcbiAgICAgKlx0YmFzZWQgc3VyZmFjZSByb2xlcy5cbiAgICAgKlxuICAgICAqXHRTZWUgdGhlIGRvY3VtZW50YXRpb24gb2YgeGRnX3N1cmZhY2UgZm9yIG1vcmUgZGV0YWlscyBhYm91dCB3aGF0IGFuXG4gICAgICpcdHhkZ19zdXJmYWNlIGlzIGFuZCBob3cgaXQgaXMgdXNlZC5cbiAgICAgKlxuICAgICAqIEBzaW5jZSAxXG4gICAgICpcbiAgICAgKi9cbiAgICBnZXRYZGdTdXJmYWNlKHN1cmZhY2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hcnNoYWxsQ29uc3RydWN0b3IodGhpcy5pZCwgMiwgV2VzdGZpZWxkLlhkZ1N1cmZhY2VQcm94eSwgW25ld09iamVjdCgpLCBvYmplY3Qoc3VyZmFjZSldKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0QSBjbGllbnQgbXVzdCByZXNwb25kIHRvIGEgcGluZyBldmVudCB3aXRoIGEgcG9uZyByZXF1ZXN0IG9yXG4gICAgICpcdHRoZSBjbGllbnQgbWF5IGJlIGRlZW1lZCB1bnJlc3BvbnNpdmUuIFNlZSB4ZGdfd21fYmFzZS5waW5nLlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIHBvbmcoc2VyaWFsKSB7XG4gICAgICAgIHRoaXMuX21hcnNoYWxsKHRoaXMuaWQsIDMsIFt1aW50KHNlcmlhbCldKTtcbiAgICB9XG4gICAgWzBdKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgKChfYSA9IHRoaXMubGlzdGVuZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5waW5nKHUobWVzc2FnZSkpKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0IGNvbnN0IFhkZ1dtQmFzZVByb3RvY29sTmFtZSA9ICd4ZGdfd21fYmFzZSc7XG5leHBvcnQgdmFyIFhkZ1dtQmFzZUVycm9yO1xuKGZ1bmN0aW9uIChYZGdXbUJhc2VFcnJvcikge1xuICAgIC8qKlxuICAgICAqIGdpdmVuIHdsX3N1cmZhY2UgaGFzIGFub3RoZXIgcm9sZVxuICAgICAqL1xuICAgIFhkZ1dtQmFzZUVycm9yW1hkZ1dtQmFzZUVycm9yW1wiX3JvbGVcIl0gPSAwXSA9IFwiX3JvbGVcIjtcbiAgICAvKipcbiAgICAgKiB4ZGdfd21fYmFzZSB3YXMgZGVzdHJveWVkIGJlZm9yZSBjaGlsZHJlblxuICAgICAqL1xuICAgIFhkZ1dtQmFzZUVycm9yW1hkZ1dtQmFzZUVycm9yW1wiX2RlZnVuY3RTdXJmYWNlc1wiXSA9IDFdID0gXCJfZGVmdW5jdFN1cmZhY2VzXCI7XG4gICAgLyoqXG4gICAgICogdGhlIGNsaWVudCB0cmllZCB0byBtYXAgb3IgZGVzdHJveSBhIG5vbi10b3Btb3N0IHBvcHVwXG4gICAgICovXG4gICAgWGRnV21CYXNlRXJyb3JbWGRnV21CYXNlRXJyb3JbXCJfbm90VGhlVG9wbW9zdFBvcHVwXCJdID0gMl0gPSBcIl9ub3RUaGVUb3Btb3N0UG9wdXBcIjtcbiAgICAvKipcbiAgICAgKiB0aGUgY2xpZW50IHNwZWNpZmllZCBhbiBpbnZhbGlkIHBvcHVwIHBhcmVudCBzdXJmYWNlXG4gICAgICovXG4gICAgWGRnV21CYXNlRXJyb3JbWGRnV21CYXNlRXJyb3JbXCJfaW52YWxpZFBvcHVwUGFyZW50XCJdID0gM10gPSBcIl9pbnZhbGlkUG9wdXBQYXJlbnRcIjtcbiAgICAvKipcbiAgICAgKiB0aGUgY2xpZW50IHByb3ZpZGVkIGFuIGludmFsaWQgc3VyZmFjZSBzdGF0ZVxuICAgICAqL1xuICAgIFhkZ1dtQmFzZUVycm9yW1hkZ1dtQmFzZUVycm9yW1wiX2ludmFsaWRTdXJmYWNlU3RhdGVcIl0gPSA0XSA9IFwiX2ludmFsaWRTdXJmYWNlU3RhdGVcIjtcbiAgICAvKipcbiAgICAgKiB0aGUgY2xpZW50IHByb3ZpZGVkIGFuIGludmFsaWQgcG9zaXRpb25lclxuICAgICAqL1xuICAgIFhkZ1dtQmFzZUVycm9yW1hkZ1dtQmFzZUVycm9yW1wiX2ludmFsaWRQb3NpdGlvbmVyXCJdID0gNV0gPSBcIl9pbnZhbGlkUG9zaXRpb25lclwiO1xufSkoWGRnV21CYXNlRXJyb3IgfHwgKFhkZ1dtQmFzZUVycm9yID0ge30pKTtcbi8qKlxuICpcbiAqICAgICAgVGhlIHhkZ19wb3NpdGlvbmVyIHByb3ZpZGVzIGEgY29sbGVjdGlvbiBvZiBydWxlcyBmb3IgdGhlIHBsYWNlbWVudCBvZiBhXG4gKiAgICAgIGNoaWxkIHN1cmZhY2UgcmVsYXRpdmUgdG8gYSBwYXJlbnQgc3VyZmFjZS4gUnVsZXMgY2FuIGJlIGRlZmluZWQgdG8gZW5zdXJlXG4gKiAgICAgIHRoZSBjaGlsZCBzdXJmYWNlIHJlbWFpbnMgd2l0aGluIHRoZSB2aXNpYmxlIGFyZWEncyBib3JkZXJzLCBhbmQgdG9cbiAqICAgICAgc3BlY2lmeSBob3cgdGhlIGNoaWxkIHN1cmZhY2UgY2hhbmdlcyBpdHMgcG9zaXRpb24sIHN1Y2ggYXMgc2xpZGluZyBhbG9uZ1xuICogICAgICBhbiBheGlzLCBvciBmbGlwcGluZyBhcm91bmQgYSByZWN0YW5nbGUuIFRoZXNlIHBvc2l0aW9uZXItY3JlYXRlZCBydWxlcyBhcmVcbiAqICAgICAgY29uc3RyYWluZWQgYnkgdGhlIHJlcXVpcmVtZW50IHRoYXQgYSBjaGlsZCBzdXJmYWNlIG11c3QgaW50ZXJzZWN0IHdpdGggb3JcbiAqICAgICAgYmUgYXQgbGVhc3QgcGFydGlhbGx5IGFkamFjZW50IHRvIGl0cyBwYXJlbnQgc3VyZmFjZS5cbiAqXG4gKiAgICAgIFNlZSB0aGUgdmFyaW91cyByZXF1ZXN0cyBmb3IgZGV0YWlscyBhYm91dCBwb3NzaWJsZSBydWxlcy5cbiAqXG4gKiAgICAgIEF0IHRoZSB0aW1lIG9mIHRoZSByZXF1ZXN0LCB0aGUgY29tcG9zaXRvciBtYWtlcyBhIGNvcHkgb2YgdGhlIHJ1bGVzXG4gKiAgICAgIHNwZWNpZmllZCBieSB0aGUgeGRnX3Bvc2l0aW9uZXIuIFRodXMsIGFmdGVyIHRoZSByZXF1ZXN0IGlzIGNvbXBsZXRlIHRoZVxuICogICAgICB4ZGdfcG9zaXRpb25lciBvYmplY3QgY2FuIGJlIGRlc3Ryb3llZCBvciByZXVzZWQ7IGZ1cnRoZXIgY2hhbmdlcyB0byB0aGVcbiAqICAgICAgb2JqZWN0IHdpbGwgaGF2ZSBubyBlZmZlY3Qgb24gcHJldmlvdXMgdXNhZ2VzLlxuICpcbiAqICAgICAgRm9yIGFuIHhkZ19wb3NpdGlvbmVyIG9iamVjdCB0byBiZSBjb25zaWRlcmVkIGNvbXBsZXRlLCBpdCBtdXN0IGhhdmUgYVxuICogICAgICBub24temVybyBzaXplIHNldCBieSBzZXRfc2l6ZSwgYW5kIGEgbm9uLXplcm8gYW5jaG9yIHJlY3RhbmdsZSBzZXQgYnlcbiAqICAgICAgc2V0X2FuY2hvcl9yZWN0LiBQYXNzaW5nIGFuIGluY29tcGxldGUgeGRnX3Bvc2l0aW9uZXIgb2JqZWN0IHdoZW5cbiAqICAgICAgcG9zaXRpb25pbmcgYSBzdXJmYWNlIHJhaXNlcyBhbiBlcnJvci5cbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBYZGdQb3NpdGlvbmVyUHJveHkgZXh0ZW5kcyBQcm94eSB7XG4gICAgLyoqXG4gICAgICogRG8gbm90IGNvbnN0cnVjdCBwcm94aWVzIGRpcmVjdGx5LiBJbnN0ZWFkIHVzZSBvbmUgb2YgdGhlIGZhY3RvcnkgbWV0aG9kcyBmcm9tIG90aGVyIHByb3hpZXMuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZGlzcGxheSwgY29ubmVjdGlvbiwgaWQpIHtcbiAgICAgICAgc3VwZXIoZGlzcGxheSwgY29ubmVjdGlvbiwgaWQpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqXHROb3RpZnkgdGhlIGNvbXBvc2l0b3IgdGhhdCB0aGUgeGRnX3Bvc2l0aW9uZXIgd2lsbCBubyBsb25nZXIgYmUgdXNlZC5cbiAgICAgKlxuICAgICAqIEBzaW5jZSAxXG4gICAgICpcbiAgICAgKi9cbiAgICBkZXN0cm95KCkge1xuICAgICAgICBzdXBlci5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuX21hcnNoYWxsKHRoaXMuaWQsIDAsIFtdKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0U2V0IHRoZSBzaXplIG9mIHRoZSBzdXJmYWNlIHRoYXQgaXMgdG8gYmUgcG9zaXRpb25lZCB3aXRoIHRoZSBwb3NpdGlvbmVyXG4gICAgICpcdG9iamVjdC4gVGhlIHNpemUgaXMgaW4gc3VyZmFjZS1sb2NhbCBjb29yZGluYXRlcyBhbmQgY29ycmVzcG9uZHMgdG8gdGhlXG4gICAgICpcdHdpbmRvdyBnZW9tZXRyeS4gU2VlIHhkZ19zdXJmYWNlLnNldF93aW5kb3dfZ2VvbWV0cnkuXG4gICAgICpcbiAgICAgKlx0SWYgYSB6ZXJvIG9yIG5lZ2F0aXZlIHNpemUgaXMgc2V0IHRoZSBpbnZhbGlkX2lucHV0IGVycm9yIGlzIHJhaXNlZC5cbiAgICAgKlxuICAgICAqIEBzaW5jZSAxXG4gICAgICpcbiAgICAgKi9cbiAgICBzZXRTaXplKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgMSwgW2ludCh3aWR0aCksIGludChoZWlnaHQpXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdFNwZWNpZnkgdGhlIGFuY2hvciByZWN0YW5nbGUgd2l0aGluIHRoZSBwYXJlbnQgc3VyZmFjZSB0aGF0IHRoZSBjaGlsZFxuICAgICAqXHRzdXJmYWNlIHdpbGwgYmUgcGxhY2VkIHJlbGF0aXZlIHRvLiBUaGUgcmVjdGFuZ2xlIGlzIHJlbGF0aXZlIHRvIHRoZVxuICAgICAqXHR3aW5kb3cgZ2VvbWV0cnkgYXMgZGVmaW5lZCBieSB4ZGdfc3VyZmFjZS5zZXRfd2luZG93X2dlb21ldHJ5IG9mIHRoZVxuICAgICAqXHRwYXJlbnQgc3VyZmFjZS5cbiAgICAgKlxuICAgICAqXHRXaGVuIHRoZSB4ZGdfcG9zaXRpb25lciBvYmplY3QgaXMgdXNlZCB0byBwb3NpdGlvbiBhIGNoaWxkIHN1cmZhY2UsIHRoZVxuICAgICAqXHRhbmNob3IgcmVjdGFuZ2xlIG1heSBub3QgZXh0ZW5kIG91dHNpZGUgdGhlIHdpbmRvdyBnZW9tZXRyeSBvZiB0aGVcbiAgICAgKlx0cG9zaXRpb25lZCBjaGlsZCdzIHBhcmVudCBzdXJmYWNlLlxuICAgICAqXG4gICAgICpcdElmIGEgbmVnYXRpdmUgc2l6ZSBpcyBzZXQgdGhlIGludmFsaWRfaW5wdXQgZXJyb3IgaXMgcmFpc2VkLlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIHNldEFuY2hvclJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgICB0aGlzLl9tYXJzaGFsbCh0aGlzLmlkLCAyLCBbaW50KHgpLCBpbnQoeSksIGludCh3aWR0aCksIGludChoZWlnaHQpXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdERlZmluZXMgdGhlIGFuY2hvciBwb2ludCBmb3IgdGhlIGFuY2hvciByZWN0YW5nbGUuIFRoZSBzcGVjaWZpZWQgYW5jaG9yXG4gICAgICpcdGlzIHVzZWQgZGVyaXZlIGFuIGFuY2hvciBwb2ludCB0aGF0IHRoZSBjaGlsZCBzdXJmYWNlIHdpbGwgYmVcbiAgICAgKlx0cG9zaXRpb25lZCByZWxhdGl2ZSB0by4gSWYgYSBjb3JuZXIgYW5jaG9yIGlzIHNldCAoZS5nLiAndG9wX2xlZnQnIG9yXG4gICAgICpcdCdib3R0b21fcmlnaHQnKSwgdGhlIGFuY2hvciBwb2ludCB3aWxsIGJlIGF0IHRoZSBzcGVjaWZpZWQgY29ybmVyO1xuICAgICAqXHRvdGhlcndpc2UsIHRoZSBkZXJpdmVkIGFuY2hvciBwb2ludCB3aWxsIGJlIGNlbnRlcmVkIG9uIHRoZSBzcGVjaWZpZWRcbiAgICAgKlx0ZWRnZSwgb3IgaW4gdGhlIGNlbnRlciBvZiB0aGUgYW5jaG9yIHJlY3RhbmdsZSBpZiBubyBlZGdlIGlzIHNwZWNpZmllZC5cbiAgICAgKlxuICAgICAqIEBzaW5jZSAxXG4gICAgICpcbiAgICAgKi9cbiAgICBzZXRBbmNob3IoYW5jaG9yKSB7XG4gICAgICAgIHRoaXMuX21hcnNoYWxsKHRoaXMuaWQsIDMsIFt1aW50KGFuY2hvcildKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0RGVmaW5lcyBpbiB3aGF0IGRpcmVjdGlvbiBhIHN1cmZhY2Ugc2hvdWxkIGJlIHBvc2l0aW9uZWQsIHJlbGF0aXZlIHRvXG4gICAgICpcdHRoZSBhbmNob3IgcG9pbnQgb2YgdGhlIHBhcmVudCBzdXJmYWNlLiBJZiBhIGNvcm5lciBncmF2aXR5IGlzXG4gICAgICpcdHNwZWNpZmllZCAoZS5nLiAnYm90dG9tX3JpZ2h0JyBvciAndG9wX2xlZnQnKSwgdGhlbiB0aGUgY2hpbGQgc3VyZmFjZVxuICAgICAqXHR3aWxsIGJlIHBsYWNlZCB0b3dhcmRzIHRoZSBzcGVjaWZpZWQgZ3Jhdml0eTsgb3RoZXJ3aXNlLCB0aGUgY2hpbGRcbiAgICAgKlx0c3VyZmFjZSB3aWxsIGJlIGNlbnRlcmVkIG92ZXIgdGhlIGFuY2hvciBwb2ludCBvbiBhbnkgYXhpcyB0aGF0IGhhZCBub1xuICAgICAqXHRncmF2aXR5IHNwZWNpZmllZC5cbiAgICAgKlxuICAgICAqIEBzaW5jZSAxXG4gICAgICpcbiAgICAgKi9cbiAgICBzZXRHcmF2aXR5KGdyYXZpdHkpIHtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgNCwgW3VpbnQoZ3Jhdml0eSldKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0U3BlY2lmeSBob3cgdGhlIHdpbmRvdyBzaG91bGQgYmUgcG9zaXRpb25lZCBpZiB0aGUgb3JpZ2luYWxseSBpbnRlbmRlZFxuICAgICAqXHRwb3NpdGlvbiBjYXVzZWQgdGhlIHN1cmZhY2UgdG8gYmUgY29uc3RyYWluZWQsIG1lYW5pbmcgYXQgbGVhc3RcbiAgICAgKlx0cGFydGlhbGx5IG91dHNpZGUgcG9zaXRpb25pbmcgYm91bmRhcmllcyBzZXQgYnkgdGhlIGNvbXBvc2l0b3IuIFRoZVxuICAgICAqXHRhZGp1c3RtZW50IGlzIHNldCBieSBjb25zdHJ1Y3RpbmcgYSBiaXRtYXNrIGRlc2NyaWJpbmcgdGhlIGFkanVzdG1lbnQgdG9cbiAgICAgKlx0YmUgbWFkZSB3aGVuIHRoZSBzdXJmYWNlIGlzIGNvbnN0cmFpbmVkIG9uIHRoYXQgYXhpcy5cbiAgICAgKlxuICAgICAqXHRJZiBubyBiaXQgZm9yIG9uZSBheGlzIGlzIHNldCwgdGhlIGNvbXBvc2l0b3Igd2lsbCBhc3N1bWUgdGhhdCB0aGUgY2hpbGRcbiAgICAgKlx0c3VyZmFjZSBzaG91bGQgbm90IGNoYW5nZSBpdHMgcG9zaXRpb24gb24gdGhhdCBheGlzIHdoZW4gY29uc3RyYWluZWQuXG4gICAgICpcbiAgICAgKlx0SWYgbW9yZSB0aGFuIG9uZSBiaXQgZm9yIG9uZSBheGlzIGlzIHNldCwgdGhlIG9yZGVyIG9mIGhvdyBhZGp1c3RtZW50c1xuICAgICAqXHRhcmUgYXBwbGllZCBpcyBzcGVjaWZpZWQgaW4gdGhlIGNvcnJlc3BvbmRpbmcgYWRqdXN0bWVudCBkZXNjcmlwdGlvbnMuXG4gICAgICpcbiAgICAgKlx0VGhlIGRlZmF1bHQgYWRqdXN0bWVudCBpcyBub25lLlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIHNldENvbnN0cmFpbnRBZGp1c3RtZW50KGNvbnN0cmFpbnRBZGp1c3RtZW50KSB7XG4gICAgICAgIHRoaXMuX21hcnNoYWxsKHRoaXMuaWQsIDUsIFt1aW50KGNvbnN0cmFpbnRBZGp1c3RtZW50KV0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqXHRTcGVjaWZ5IHRoZSBzdXJmYWNlIHBvc2l0aW9uIG9mZnNldCByZWxhdGl2ZSB0byB0aGUgcG9zaXRpb24gb2YgdGhlXG4gICAgICpcdGFuY2hvciBvbiB0aGUgYW5jaG9yIHJlY3RhbmdsZSBhbmQgdGhlIGFuY2hvciBvbiB0aGUgc3VyZmFjZS4gRm9yXG4gICAgICpcdGV4YW1wbGUgaWYgdGhlIGFuY2hvciBvZiB0aGUgYW5jaG9yIHJlY3RhbmdsZSBpcyBhdCAoeCwgeSksIHRoZSBzdXJmYWNlXG4gICAgICpcdGhhcyB0aGUgZ3Jhdml0eSBib3R0b218cmlnaHQsIGFuZCB0aGUgb2Zmc2V0IGlzIChveCwgb3kpLCB0aGUgY2FsY3VsYXRlZFxuICAgICAqXHRzdXJmYWNlIHBvc2l0aW9uIHdpbGwgYmUgKHggKyBveCwgeSArIG95KS4gVGhlIG9mZnNldCBwb3NpdGlvbiBvZiB0aGVcbiAgICAgKlx0c3VyZmFjZSBpcyB0aGUgb25lIHVzZWQgZm9yIGNvbnN0cmFpbnQgdGVzdGluZy4gU2VlXG4gICAgICpcdHNldF9jb25zdHJhaW50X2FkanVzdG1lbnQuXG4gICAgICpcbiAgICAgKlx0QW4gZXhhbXBsZSB1c2UgY2FzZSBpcyBwbGFjaW5nIGEgcG9wdXAgbWVudSBvbiB0b3Agb2YgYSB1c2VyIGludGVyZmFjZVxuICAgICAqXHRlbGVtZW50LCB3aGlsZSBhbGlnbmluZyB0aGUgdXNlciBpbnRlcmZhY2UgZWxlbWVudCBvZiB0aGUgcGFyZW50IHN1cmZhY2VcbiAgICAgKlx0d2l0aCBzb21lIHVzZXIgaW50ZXJmYWNlIGVsZW1lbnQgcGxhY2VkIHNvbWV3aGVyZSBpbiB0aGUgcG9wdXAgc3VyZmFjZS5cbiAgICAgKlxuICAgICAqIEBzaW5jZSAxXG4gICAgICpcbiAgICAgKi9cbiAgICBzZXRPZmZzZXQoeCwgeSkge1xuICAgICAgICB0aGlzLl9tYXJzaGFsbCh0aGlzLmlkLCA2LCBbaW50KHgpLCBpbnQoeSldKTtcbiAgICB9XG59XG5leHBvcnQgY29uc3QgWGRnUG9zaXRpb25lclByb3RvY29sTmFtZSA9ICd4ZGdfcG9zaXRpb25lcic7XG5leHBvcnQgdmFyIFhkZ1Bvc2l0aW9uZXJFcnJvcjtcbihmdW5jdGlvbiAoWGRnUG9zaXRpb25lckVycm9yKSB7XG4gICAgLyoqXG4gICAgICogaW52YWxpZCBpbnB1dCBwcm92aWRlZFxuICAgICAqL1xuICAgIFhkZ1Bvc2l0aW9uZXJFcnJvcltYZGdQb3NpdGlvbmVyRXJyb3JbXCJfaW52YWxpZElucHV0XCJdID0gMF0gPSBcIl9pbnZhbGlkSW5wdXRcIjtcbn0pKFhkZ1Bvc2l0aW9uZXJFcnJvciB8fCAoWGRnUG9zaXRpb25lckVycm9yID0ge30pKTtcbmV4cG9ydCB2YXIgWGRnUG9zaXRpb25lckFuY2hvcjtcbihmdW5jdGlvbiAoWGRnUG9zaXRpb25lckFuY2hvcikge1xuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgWGRnUG9zaXRpb25lckFuY2hvcltYZGdQb3NpdGlvbmVyQW5jaG9yW1wiX25vbmVcIl0gPSAwXSA9IFwiX25vbmVcIjtcbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIFhkZ1Bvc2l0aW9uZXJBbmNob3JbWGRnUG9zaXRpb25lckFuY2hvcltcIl90b3BcIl0gPSAxXSA9IFwiX3RvcFwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgWGRnUG9zaXRpb25lckFuY2hvcltYZGdQb3NpdGlvbmVyQW5jaG9yW1wiX2JvdHRvbVwiXSA9IDJdID0gXCJfYm90dG9tXCI7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBYZGdQb3NpdGlvbmVyQW5jaG9yW1hkZ1Bvc2l0aW9uZXJBbmNob3JbXCJfbGVmdFwiXSA9IDNdID0gXCJfbGVmdFwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgWGRnUG9zaXRpb25lckFuY2hvcltYZGdQb3NpdGlvbmVyQW5jaG9yW1wiX3JpZ2h0XCJdID0gNF0gPSBcIl9yaWdodFwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgWGRnUG9zaXRpb25lckFuY2hvcltYZGdQb3NpdGlvbmVyQW5jaG9yW1wiX3RvcExlZnRcIl0gPSA1XSA9IFwiX3RvcExlZnRcIjtcbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIFhkZ1Bvc2l0aW9uZXJBbmNob3JbWGRnUG9zaXRpb25lckFuY2hvcltcIl9ib3R0b21MZWZ0XCJdID0gNl0gPSBcIl9ib3R0b21MZWZ0XCI7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBYZGdQb3NpdGlvbmVyQW5jaG9yW1hkZ1Bvc2l0aW9uZXJBbmNob3JbXCJfdG9wUmlnaHRcIl0gPSA3XSA9IFwiX3RvcFJpZ2h0XCI7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBYZGdQb3NpdGlvbmVyQW5jaG9yW1hkZ1Bvc2l0aW9uZXJBbmNob3JbXCJfYm90dG9tUmlnaHRcIl0gPSA4XSA9IFwiX2JvdHRvbVJpZ2h0XCI7XG59KShYZGdQb3NpdGlvbmVyQW5jaG9yIHx8IChYZGdQb3NpdGlvbmVyQW5jaG9yID0ge30pKTtcbmV4cG9ydCB2YXIgWGRnUG9zaXRpb25lckdyYXZpdHk7XG4oZnVuY3Rpb24gKFhkZ1Bvc2l0aW9uZXJHcmF2aXR5KSB7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBYZGdQb3NpdGlvbmVyR3Jhdml0eVtYZGdQb3NpdGlvbmVyR3Jhdml0eVtcIl9ub25lXCJdID0gMF0gPSBcIl9ub25lXCI7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBYZGdQb3NpdGlvbmVyR3Jhdml0eVtYZGdQb3NpdGlvbmVyR3Jhdml0eVtcIl90b3BcIl0gPSAxXSA9IFwiX3RvcFwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgWGRnUG9zaXRpb25lckdyYXZpdHlbWGRnUG9zaXRpb25lckdyYXZpdHlbXCJfYm90dG9tXCJdID0gMl0gPSBcIl9ib3R0b21cIjtcbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIFhkZ1Bvc2l0aW9uZXJHcmF2aXR5W1hkZ1Bvc2l0aW9uZXJHcmF2aXR5W1wiX2xlZnRcIl0gPSAzXSA9IFwiX2xlZnRcIjtcbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIFhkZ1Bvc2l0aW9uZXJHcmF2aXR5W1hkZ1Bvc2l0aW9uZXJHcmF2aXR5W1wiX3JpZ2h0XCJdID0gNF0gPSBcIl9yaWdodFwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgWGRnUG9zaXRpb25lckdyYXZpdHlbWGRnUG9zaXRpb25lckdyYXZpdHlbXCJfdG9wTGVmdFwiXSA9IDVdID0gXCJfdG9wTGVmdFwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgWGRnUG9zaXRpb25lckdyYXZpdHlbWGRnUG9zaXRpb25lckdyYXZpdHlbXCJfYm90dG9tTGVmdFwiXSA9IDZdID0gXCJfYm90dG9tTGVmdFwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgWGRnUG9zaXRpb25lckdyYXZpdHlbWGRnUG9zaXRpb25lckdyYXZpdHlbXCJfdG9wUmlnaHRcIl0gPSA3XSA9IFwiX3RvcFJpZ2h0XCI7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBYZGdQb3NpdGlvbmVyR3Jhdml0eVtYZGdQb3NpdGlvbmVyR3Jhdml0eVtcIl9ib3R0b21SaWdodFwiXSA9IDhdID0gXCJfYm90dG9tUmlnaHRcIjtcbn0pKFhkZ1Bvc2l0aW9uZXJHcmF2aXR5IHx8IChYZGdQb3NpdGlvbmVyR3Jhdml0eSA9IHt9KSk7XG5leHBvcnQgdmFyIFhkZ1Bvc2l0aW9uZXJDb25zdHJhaW50QWRqdXN0bWVudDtcbihmdW5jdGlvbiAoWGRnUG9zaXRpb25lckNvbnN0cmFpbnRBZGp1c3RtZW50KSB7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBYZGdQb3NpdGlvbmVyQ29uc3RyYWludEFkanVzdG1lbnRbWGRnUG9zaXRpb25lckNvbnN0cmFpbnRBZGp1c3RtZW50W1wiX25vbmVcIl0gPSAwXSA9IFwiX25vbmVcIjtcbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIFhkZ1Bvc2l0aW9uZXJDb25zdHJhaW50QWRqdXN0bWVudFtYZGdQb3NpdGlvbmVyQ29uc3RyYWludEFkanVzdG1lbnRbXCJfc2xpZGVYXCJdID0gMV0gPSBcIl9zbGlkZVhcIjtcbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIFhkZ1Bvc2l0aW9uZXJDb25zdHJhaW50QWRqdXN0bWVudFtYZGdQb3NpdGlvbmVyQ29uc3RyYWludEFkanVzdG1lbnRbXCJfc2xpZGVZXCJdID0gMl0gPSBcIl9zbGlkZVlcIjtcbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIFhkZ1Bvc2l0aW9uZXJDb25zdHJhaW50QWRqdXN0bWVudFtYZGdQb3NpdGlvbmVyQ29uc3RyYWludEFkanVzdG1lbnRbXCJfZmxpcFhcIl0gPSA0XSA9IFwiX2ZsaXBYXCI7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBYZGdQb3NpdGlvbmVyQ29uc3RyYWludEFkanVzdG1lbnRbWGRnUG9zaXRpb25lckNvbnN0cmFpbnRBZGp1c3RtZW50W1wiX2ZsaXBZXCJdID0gOF0gPSBcIl9mbGlwWVwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgWGRnUG9zaXRpb25lckNvbnN0cmFpbnRBZGp1c3RtZW50W1hkZ1Bvc2l0aW9uZXJDb25zdHJhaW50QWRqdXN0bWVudFtcIl9yZXNpemVYXCJdID0gMTZdID0gXCJfcmVzaXplWFwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgWGRnUG9zaXRpb25lckNvbnN0cmFpbnRBZGp1c3RtZW50W1hkZ1Bvc2l0aW9uZXJDb25zdHJhaW50QWRqdXN0bWVudFtcIl9yZXNpemVZXCJdID0gMzJdID0gXCJfcmVzaXplWVwiO1xufSkoWGRnUG9zaXRpb25lckNvbnN0cmFpbnRBZGp1c3RtZW50IHx8IChYZGdQb3NpdGlvbmVyQ29uc3RyYWludEFkanVzdG1lbnQgPSB7fSkpO1xuLyoqXG4gKlxuICogICAgICBBbiBpbnRlcmZhY2UgdGhhdCBtYXkgYmUgaW1wbGVtZW50ZWQgYnkgYSB3bF9zdXJmYWNlLCBmb3JcbiAqICAgICAgaW1wbGVtZW50YXRpb25zIHRoYXQgcHJvdmlkZSBhIGRlc2t0b3Atc3R5bGUgdXNlciBpbnRlcmZhY2UuXG4gKlxuICogICAgICBJdCBwcm92aWRlcyBhIGJhc2Ugc2V0IG9mIGZ1bmN0aW9uYWxpdHkgcmVxdWlyZWQgdG8gY29uc3RydWN0IHVzZXJcbiAqICAgICAgaW50ZXJmYWNlIGVsZW1lbnRzIHJlcXVpcmluZyBtYW5hZ2VtZW50IGJ5IHRoZSBjb21wb3NpdG9yLCBzdWNoIGFzXG4gKiAgICAgIHRvcGxldmVsIHdpbmRvd3MsIG1lbnVzLCBldGMuIFRoZSB0eXBlcyBvZiBmdW5jdGlvbmFsaXR5IGFyZSBzcGxpdCBpbnRvXG4gKiAgICAgIHhkZ19zdXJmYWNlIHJvbGVzLlxuICpcbiAqICAgICAgQ3JlYXRpbmcgYW4geGRnX3N1cmZhY2UgZG9lcyBub3Qgc2V0IHRoZSByb2xlIGZvciBhIHdsX3N1cmZhY2UuIEluIG9yZGVyXG4gKiAgICAgIHRvIG1hcCBhbiB4ZGdfc3VyZmFjZSwgdGhlIGNsaWVudCBtdXN0IGNyZWF0ZSBhIHJvbGUtc3BlY2lmaWMgb2JqZWN0XG4gKiAgICAgIHVzaW5nLCBlLmcuLCBnZXRfdG9wbGV2ZWwsIGdldF9wb3B1cC4gVGhlIHdsX3N1cmZhY2UgZm9yIGFueSBnaXZlblxuICogICAgICB4ZGdfc3VyZmFjZSBjYW4gaGF2ZSBhdCBtb3N0IG9uZSByb2xlLCBhbmQgbWF5IG5vdCBiZSBhc3NpZ25lZCBhbnkgcm9sZVxuICogICAgICBub3QgYmFzZWQgb24geGRnX3N1cmZhY2UuXG4gKlxuICogICAgICBBIHJvbGUgbXVzdCBiZSBhc3NpZ25lZCBiZWZvcmUgYW55IG90aGVyIHJlcXVlc3RzIGFyZSBtYWRlIHRvIHRoZVxuICogICAgICB4ZGdfc3VyZmFjZSBvYmplY3QuXG4gKlxuICogICAgICBUaGUgY2xpZW50IG11c3QgY2FsbCB3bF9zdXJmYWNlLmNvbW1pdCBvbiB0aGUgY29ycmVzcG9uZGluZyB3bF9zdXJmYWNlXG4gKiAgICAgIGZvciB0aGUgeGRnX3N1cmZhY2Ugc3RhdGUgdG8gdGFrZSBlZmZlY3QuXG4gKlxuICogICAgICBDcmVhdGluZyBhbiB4ZGdfc3VyZmFjZSBmcm9tIGEgd2xfc3VyZmFjZSB3aGljaCBoYXMgYSBidWZmZXIgYXR0YWNoZWQgb3JcbiAqICAgICAgY29tbWl0dGVkIGlzIGEgY2xpZW50IGVycm9yLCBhbmQgYW55IGF0dGVtcHRzIGJ5IGEgY2xpZW50IHRvIGF0dGFjaCBvclxuICogICAgICBtYW5pcHVsYXRlIGEgYnVmZmVyIHByaW9yIHRvIHRoZSBmaXJzdCB4ZGdfc3VyZmFjZS5jb25maWd1cmUgY2FsbCBtdXN0XG4gKiAgICAgIGFsc28gYmUgdHJlYXRlZCBhcyBlcnJvcnMuXG4gKlxuICogICAgICBNYXBwaW5nIGFuIHhkZ19zdXJmYWNlLWJhc2VkIHJvbGUgc3VyZmFjZSBpcyBkZWZpbmVkIGFzIG1ha2luZyBpdFxuICogICAgICBwb3NzaWJsZSBmb3IgdGhlIHN1cmZhY2UgdG8gYmUgc2hvd24gYnkgdGhlIGNvbXBvc2l0b3IuIE5vdGUgdGhhdFxuICogICAgICBhIG1hcHBlZCBzdXJmYWNlIGlzIG5vdCBndWFyYW50ZWVkIHRvIGJlIHZpc2libGUgb25jZSBpdCBpcyBtYXBwZWQuXG4gKlxuICogICAgICBGb3IgYW4geGRnX3N1cmZhY2UgdG8gYmUgbWFwcGVkIGJ5IHRoZSBjb21wb3NpdG9yLCB0aGUgZm9sbG93aW5nXG4gKiAgICAgIGNvbmRpdGlvbnMgbXVzdCBiZSBtZXQ6XG4gKiAgICAgICgxKSB0aGUgY2xpZW50IGhhcyBhc3NpZ25lZCBhbiB4ZGdfc3VyZmFjZS1iYXNlZCByb2xlIHRvIHRoZSBzdXJmYWNlXG4gKiAgICAgICgyKSB0aGUgY2xpZW50IGhhcyBzZXQgYW5kIGNvbW1pdHRlZCB0aGUgeGRnX3N1cmZhY2Ugc3RhdGUgYW5kIHRoZVxuICpcdCAgcm9sZS1kZXBlbmRlbnQgc3RhdGUgdG8gdGhlIHN1cmZhY2VcbiAqICAgICAgKDMpIHRoZSBjbGllbnQgaGFzIGNvbW1pdHRlZCBhIGJ1ZmZlciB0byB0aGUgc3VyZmFjZVxuICpcbiAqICAgICAgQSBuZXdseS11bm1hcHBlZCBzdXJmYWNlIGlzIGNvbnNpZGVyZWQgdG8gaGF2ZSBtZXQgY29uZGl0aW9uICgxKSBvdXRcbiAqICAgICAgb2YgdGhlIDMgcmVxdWlyZWQgY29uZGl0aW9ucyBmb3IgbWFwcGluZyBhIHN1cmZhY2UgaWYgaXRzIHJvbGUgc3VyZmFjZVxuICogICAgICBoYXMgbm90IGJlZW4gZGVzdHJveWVkLlxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIFhkZ1N1cmZhY2VQcm94eSBleHRlbmRzIFByb3h5IHtcbiAgICAvKipcbiAgICAgKiBEbyBub3QgY29uc3RydWN0IHByb3hpZXMgZGlyZWN0bHkuIEluc3RlYWQgdXNlIG9uZSBvZiB0aGUgZmFjdG9yeSBtZXRob2RzIGZyb20gb3RoZXIgcHJveGllcy5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihkaXNwbGF5LCBjb25uZWN0aW9uLCBpZCkge1xuICAgICAgICBzdXBlcihkaXNwbGF5LCBjb25uZWN0aW9uLCBpZCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdERlc3Ryb3kgdGhlIHhkZ19zdXJmYWNlIG9iamVjdC4gQW4geGRnX3N1cmZhY2UgbXVzdCBvbmx5IGJlIGRlc3Ryb3llZFxuICAgICAqXHRhZnRlciBpdHMgcm9sZSBvYmplY3QgaGFzIGJlZW4gZGVzdHJveWVkLlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgMCwgW10pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqXHRUaGlzIGNyZWF0ZXMgYW4geGRnX3RvcGxldmVsIG9iamVjdCBmb3IgdGhlIGdpdmVuIHhkZ19zdXJmYWNlIGFuZCBnaXZlc1xuICAgICAqXHR0aGUgYXNzb2NpYXRlZCB3bF9zdXJmYWNlIHRoZSB4ZGdfdG9wbGV2ZWwgcm9sZS5cbiAgICAgKlxuICAgICAqXHRTZWUgdGhlIGRvY3VtZW50YXRpb24gb2YgeGRnX3RvcGxldmVsIGZvciBtb3JlIGRldGFpbHMgYWJvdXQgd2hhdCBhblxuICAgICAqXHR4ZGdfdG9wbGV2ZWwgaXMgYW5kIGhvdyBpdCBpcyB1c2VkLlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIGdldFRvcGxldmVsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWFyc2hhbGxDb25zdHJ1Y3Rvcih0aGlzLmlkLCAxLCBXZXN0ZmllbGQuWGRnVG9wbGV2ZWxQcm94eSwgW25ld09iamVjdCgpXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdFRoaXMgY3JlYXRlcyBhbiB4ZGdfcG9wdXAgb2JqZWN0IGZvciB0aGUgZ2l2ZW4geGRnX3N1cmZhY2UgYW5kIGdpdmVzXG4gICAgICpcdHRoZSBhc3NvY2lhdGVkIHdsX3N1cmZhY2UgdGhlIHhkZ19wb3B1cCByb2xlLlxuICAgICAqXG4gICAgICpcdElmIG51bGwgaXMgcGFzc2VkIGFzIGEgcGFyZW50LCBhIHBhcmVudCBzdXJmYWNlIG11c3QgYmUgc3BlY2lmaWVkIHVzaW5nXG4gICAgICpcdHNvbWUgb3RoZXIgcHJvdG9jb2wsIGJlZm9yZSBjb21taXR0aW5nIHRoZSBpbml0aWFsIHN0YXRlLlxuICAgICAqXG4gICAgICpcdFNlZSB0aGUgZG9jdW1lbnRhdGlvbiBvZiB4ZGdfcG9wdXAgZm9yIG1vcmUgZGV0YWlscyBhYm91dCB3aGF0IGFuXG4gICAgICpcdHhkZ19wb3B1cCBpcyBhbmQgaG93IGl0IGlzIHVzZWQuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgZ2V0UG9wdXAocGFyZW50LCBwb3NpdGlvbmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXJzaGFsbENvbnN0cnVjdG9yKHRoaXMuaWQsIDIsIFdlc3RmaWVsZC5YZGdQb3B1cFByb3h5LCBbbmV3T2JqZWN0KCksIG9iamVjdE9wdGlvbmFsKHBhcmVudCksIG9iamVjdChwb3NpdGlvbmVyKV0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqXHRUaGUgd2luZG93IGdlb21ldHJ5IG9mIGEgc3VyZmFjZSBpcyBpdHMgXCJ2aXNpYmxlIGJvdW5kc1wiIGZyb20gdGhlXG4gICAgICpcdHVzZXIncyBwZXJzcGVjdGl2ZS4gQ2xpZW50LXNpZGUgZGVjb3JhdGlvbnMgb2Z0ZW4gaGF2ZSBpbnZpc2libGVcbiAgICAgKlx0cG9ydGlvbnMgbGlrZSBkcm9wLXNoYWRvd3Mgd2hpY2ggc2hvdWxkIGJlIGlnbm9yZWQgZm9yIHRoZVxuICAgICAqXHRwdXJwb3NlcyBvZiBhbGlnbmluZywgcGxhY2luZyBhbmQgY29uc3RyYWluaW5nIHdpbmRvd3MuXG4gICAgICpcbiAgICAgKlx0VGhlIHdpbmRvdyBnZW9tZXRyeSBpcyBkb3VibGUgYnVmZmVyZWQsIGFuZCB3aWxsIGJlIGFwcGxpZWQgYXQgdGhlXG4gICAgICpcdHRpbWUgd2xfc3VyZmFjZS5jb21taXQgb2YgdGhlIGNvcnJlc3BvbmRpbmcgd2xfc3VyZmFjZSBpcyBjYWxsZWQuXG4gICAgICpcbiAgICAgKlx0V2hlbiBtYWludGFpbmluZyBhIHBvc2l0aW9uLCB0aGUgY29tcG9zaXRvciBzaG91bGQgdHJlYXQgdGhlICh4LCB5KVxuICAgICAqXHRjb29yZGluYXRlIG9mIHRoZSB3aW5kb3cgZ2VvbWV0cnkgYXMgdGhlIHRvcCBsZWZ0IGNvcm5lciBvZiB0aGUgd2luZG93LlxuICAgICAqXHRBIGNsaWVudCBjaGFuZ2luZyB0aGUgKHgsIHkpIHdpbmRvdyBnZW9tZXRyeSBjb29yZGluYXRlIHNob3VsZCBpblxuICAgICAqXHRnZW5lcmFsIG5vdCBhbHRlciB0aGUgcG9zaXRpb24gb2YgdGhlIHdpbmRvdy5cbiAgICAgKlxuICAgICAqXHRPbmNlIHRoZSB3aW5kb3cgZ2VvbWV0cnkgb2YgdGhlIHN1cmZhY2UgaXMgc2V0LCBpdCBpcyBub3QgcG9zc2libGUgdG9cbiAgICAgKlx0dW5zZXQgaXQsIGFuZCBpdCB3aWxsIHJlbWFpbiB0aGUgc2FtZSB1bnRpbCBzZXRfd2luZG93X2dlb21ldHJ5IGlzXG4gICAgICpcdGNhbGxlZCBhZ2FpbiwgZXZlbiBpZiBhIG5ldyBzdWJzdXJmYWNlIG9yIGJ1ZmZlciBpcyBhdHRhY2hlZC5cbiAgICAgKlxuICAgICAqXHRJZiBuZXZlciBzZXQsIHRoZSB2YWx1ZSBpcyB0aGUgZnVsbCBib3VuZHMgb2YgdGhlIHN1cmZhY2UsXG4gICAgICpcdGluY2x1ZGluZyBhbnkgc3Vic3VyZmFjZXMuIFRoaXMgdXBkYXRlcyBkeW5hbWljYWxseSBvbiBldmVyeVxuICAgICAqXHRjb21taXQuIFRoaXMgdW5zZXQgaXMgbWVhbnQgZm9yIGV4dHJlbWVseSBzaW1wbGUgY2xpZW50cy5cbiAgICAgKlxuICAgICAqXHRUaGUgYXJndW1lbnRzIGFyZSBnaXZlbiBpbiB0aGUgc3VyZmFjZS1sb2NhbCBjb29yZGluYXRlIHNwYWNlIG9mXG4gICAgICpcdHRoZSB3bF9zdXJmYWNlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHhkZ19zdXJmYWNlLlxuICAgICAqXG4gICAgICpcdFRoZSB3aWR0aCBhbmQgaGVpZ2h0IG11c3QgYmUgZ3JlYXRlciB0aGFuIHplcm8uIFNldHRpbmcgYW4gaW52YWxpZCBzaXplXG4gICAgICpcdHdpbGwgcmFpc2UgYW4gZXJyb3IuIFdoZW4gYXBwbGllZCwgdGhlIGVmZmVjdGl2ZSB3aW5kb3cgZ2VvbWV0cnkgd2lsbCBiZVxuICAgICAqXHR0aGUgc2V0IHdpbmRvdyBnZW9tZXRyeSBjbGFtcGVkIHRvIHRoZSBib3VuZGluZyByZWN0YW5nbGUgb2YgdGhlXG4gICAgICpcdGNvbWJpbmVkIGdlb21ldHJ5IG9mIHRoZSBzdXJmYWNlIG9mIHRoZSB4ZGdfc3VyZmFjZSBhbmQgdGhlIGFzc29jaWF0ZWRcbiAgICAgKlx0c3Vic3VyZmFjZXMuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgc2V0V2luZG93R2VvbWV0cnkoeCwgeSwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgICB0aGlzLl9tYXJzaGFsbCh0aGlzLmlkLCAzLCBbaW50KHgpLCBpbnQoeSksIGludCh3aWR0aCksIGludChoZWlnaHQpXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdFdoZW4gYSBjb25maWd1cmUgZXZlbnQgaXMgcmVjZWl2ZWQsIGlmIGEgY2xpZW50IGNvbW1pdHMgdGhlXG4gICAgICpcdHN1cmZhY2UgaW4gcmVzcG9uc2UgdG8gdGhlIGNvbmZpZ3VyZSBldmVudCwgdGhlbiB0aGUgY2xpZW50XG4gICAgICpcdG11c3QgbWFrZSBhbiBhY2tfY29uZmlndXJlIHJlcXVlc3Qgc29tZXRpbWUgYmVmb3JlIHRoZSBjb21taXRcbiAgICAgKlx0cmVxdWVzdCwgcGFzc2luZyBhbG9uZyB0aGUgc2VyaWFsIG9mIHRoZSBjb25maWd1cmUgZXZlbnQuXG4gICAgICpcbiAgICAgKlx0Rm9yIGluc3RhbmNlLCBmb3IgdG9wbGV2ZWwgc3VyZmFjZXMgdGhlIGNvbXBvc2l0b3IgbWlnaHQgdXNlIHRoaXNcbiAgICAgKlx0aW5mb3JtYXRpb24gdG8gbW92ZSBhIHN1cmZhY2UgdG8gdGhlIHRvcCBsZWZ0IG9ubHkgd2hlbiB0aGUgY2xpZW50IGhhc1xuICAgICAqXHRkcmF3biBpdHNlbGYgZm9yIHRoZSBtYXhpbWl6ZWQgb3IgZnVsbHNjcmVlbiBzdGF0ZS5cbiAgICAgKlxuICAgICAqXHRJZiB0aGUgY2xpZW50IHJlY2VpdmVzIG11bHRpcGxlIGNvbmZpZ3VyZSBldmVudHMgYmVmb3JlIGl0XG4gICAgICpcdGNhbiByZXNwb25kIHRvIG9uZSwgaXQgb25seSBoYXMgdG8gYWNrIHRoZSBsYXN0IGNvbmZpZ3VyZSBldmVudC5cbiAgICAgKlxuICAgICAqXHRBIGNsaWVudCBpcyBub3QgcmVxdWlyZWQgdG8gY29tbWl0IGltbWVkaWF0ZWx5IGFmdGVyIHNlbmRpbmdcbiAgICAgKlx0YW4gYWNrX2NvbmZpZ3VyZSByZXF1ZXN0IC0gaXQgbWF5IGV2ZW4gYWNrX2NvbmZpZ3VyZSBzZXZlcmFsIHRpbWVzXG4gICAgICpcdGJlZm9yZSBpdHMgbmV4dCBzdXJmYWNlIGNvbW1pdC5cbiAgICAgKlxuICAgICAqXHRBIGNsaWVudCBtYXkgc2VuZCBtdWx0aXBsZSBhY2tfY29uZmlndXJlIHJlcXVlc3RzIGJlZm9yZSBjb21taXR0aW5nLCBidXRcbiAgICAgKlx0b25seSB0aGUgbGFzdCByZXF1ZXN0IHNlbnQgYmVmb3JlIGEgY29tbWl0IGluZGljYXRlcyB3aGljaCBjb25maWd1cmVcbiAgICAgKlx0ZXZlbnQgdGhlIGNsaWVudCByZWFsbHkgaXMgcmVzcG9uZGluZyB0by5cbiAgICAgKlxuICAgICAqIEBzaW5jZSAxXG4gICAgICpcbiAgICAgKi9cbiAgICBhY2tDb25maWd1cmUoc2VyaWFsKSB7XG4gICAgICAgIHRoaXMuX21hcnNoYWxsKHRoaXMuaWQsIDQsIFt1aW50KHNlcmlhbCldKTtcbiAgICB9XG4gICAgWzBdKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgKChfYSA9IHRoaXMubGlzdGVuZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jb25maWd1cmUodShtZXNzYWdlKSkpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnQgY29uc3QgWGRnU3VyZmFjZVByb3RvY29sTmFtZSA9ICd4ZGdfc3VyZmFjZSc7XG5leHBvcnQgdmFyIFhkZ1N1cmZhY2VFcnJvcjtcbihmdW5jdGlvbiAoWGRnU3VyZmFjZUVycm9yKSB7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBYZGdTdXJmYWNlRXJyb3JbWGRnU3VyZmFjZUVycm9yW1wiX25vdENvbnN0cnVjdGVkXCJdID0gMV0gPSBcIl9ub3RDb25zdHJ1Y3RlZFwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgWGRnU3VyZmFjZUVycm9yW1hkZ1N1cmZhY2VFcnJvcltcIl9hbHJlYWR5Q29uc3RydWN0ZWRcIl0gPSAyXSA9IFwiX2FscmVhZHlDb25zdHJ1Y3RlZFwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgWGRnU3VyZmFjZUVycm9yW1hkZ1N1cmZhY2VFcnJvcltcIl91bmNvbmZpZ3VyZWRCdWZmZXJcIl0gPSAzXSA9IFwiX3VuY29uZmlndXJlZEJ1ZmZlclwiO1xufSkoWGRnU3VyZmFjZUVycm9yIHx8IChYZGdTdXJmYWNlRXJyb3IgPSB7fSkpO1xuLyoqXG4gKlxuICogICAgICBUaGlzIGludGVyZmFjZSBkZWZpbmVzIGFuIHhkZ19zdXJmYWNlIHJvbGUgd2hpY2ggYWxsb3dzIGEgc3VyZmFjZSB0byxcbiAqICAgICAgYW1vbmcgb3RoZXIgdGhpbmdzLCBzZXQgd2luZG93LWxpa2UgcHJvcGVydGllcyBzdWNoIGFzIG1heGltaXplLFxuICogICAgICBmdWxsc2NyZWVuLCBhbmQgbWluaW1pemUsIHNldCBhcHBsaWNhdGlvbi1zcGVjaWZpYyBtZXRhZGF0YSBsaWtlIHRpdGxlIGFuZFxuICogICAgICBpZCwgYW5kIHdlbGwgYXMgdHJpZ2dlciB1c2VyIGludGVyYWN0aXZlIG9wZXJhdGlvbnMgc3VjaCBhcyBpbnRlcmFjdGl2ZVxuICogICAgICByZXNpemUgYW5kIG1vdmUuXG4gKlxuICogICAgICBVbm1hcHBpbmcgYW4geGRnX3RvcGxldmVsIG1lYW5zIHRoYXQgdGhlIHN1cmZhY2UgY2Fubm90IGJlIHNob3duXG4gKiAgICAgIGJ5IHRoZSBjb21wb3NpdG9yIHVudGlsIGl0IGlzIGV4cGxpY2l0bHkgbWFwcGVkIGFnYWluLlxuICogICAgICBBbGwgYWN0aXZlIG9wZXJhdGlvbnMgKGUuZy4sIG1vdmUsIHJlc2l6ZSkgYXJlIGNhbmNlbGVkIGFuZCBhbGxcbiAqICAgICAgYXR0cmlidXRlcyAoZS5nLiB0aXRsZSwgc3RhdGUsIHN0YWNraW5nLCAuLi4pIGFyZSBkaXNjYXJkZWQgZm9yXG4gKiAgICAgIGFuIHhkZ190b3BsZXZlbCBzdXJmYWNlIHdoZW4gaXQgaXMgdW5tYXBwZWQuXG4gKlxuICogICAgICBBdHRhY2hpbmcgYSBudWxsIGJ1ZmZlciB0byBhIHRvcGxldmVsIHVubWFwcyB0aGUgc3VyZmFjZS5cbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBYZGdUb3BsZXZlbFByb3h5IGV4dGVuZHMgUHJveHkge1xuICAgIC8qKlxuICAgICAqIERvIG5vdCBjb25zdHJ1Y3QgcHJveGllcyBkaXJlY3RseS4gSW5zdGVhZCB1c2Ugb25lIG9mIHRoZSBmYWN0b3J5IG1ldGhvZHMgZnJvbSBvdGhlciBwcm94aWVzLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKSB7XG4gICAgICAgIHN1cGVyKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0VGhpcyByZXF1ZXN0IGRlc3Ryb3lzIHRoZSByb2xlIHN1cmZhY2UgYW5kIHVubWFwcyB0aGUgc3VyZmFjZTtcbiAgICAgKlx0c2VlIFwiVW5tYXBwaW5nXCIgYmVoYXZpb3IgaW4gaW50ZXJmYWNlIHNlY3Rpb24gZm9yIGRldGFpbHMuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLl9tYXJzaGFsbCh0aGlzLmlkLCAwLCBbXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdFNldCB0aGUgXCJwYXJlbnRcIiBvZiB0aGlzIHN1cmZhY2UuIFRoaXMgc3VyZmFjZSBzaG91bGQgYmUgc3RhY2tlZFxuICAgICAqXHRhYm92ZSB0aGUgcGFyZW50IHN1cmZhY2UgYW5kIGFsbCBvdGhlciBhbmNlc3RvciBzdXJmYWNlcy5cbiAgICAgKlxuICAgICAqXHRQYXJlbnQgd2luZG93cyBzaG91bGQgYmUgc2V0IG9uIGRpYWxvZ3MsIHRvb2xib3hlcywgb3Igb3RoZXJcbiAgICAgKlx0XCJhdXhpbGlhcnlcIiBzdXJmYWNlcywgc28gdGhhdCB0aGUgcGFyZW50IGlzIHJhaXNlZCB3aGVuIHRoZSBkaWFsb2dcbiAgICAgKlx0aXMgcmFpc2VkLlxuICAgICAqXG4gICAgICpcdFNldHRpbmcgYSBudWxsIHBhcmVudCBmb3IgYSBjaGlsZCB3aW5kb3cgcmVtb3ZlcyBhbnkgcGFyZW50LWNoaWxkXG4gICAgICpcdHJlbGF0aW9uc2hpcCBmb3IgdGhlIGNoaWxkLiBTZXR0aW5nIGEgbnVsbCBwYXJlbnQgZm9yIGEgd2luZG93IHdoaWNoXG4gICAgICpcdGN1cnJlbnRseSBoYXMgbm8gcGFyZW50IGlzIGEgbm8tb3AuXG4gICAgICpcbiAgICAgKlx0SWYgdGhlIHBhcmVudCBpcyB1bm1hcHBlZCB0aGVuIGl0cyBjaGlsZHJlbiBhcmUgbWFuYWdlZCBhc1xuICAgICAqXHR0aG91Z2ggdGhlIHBhcmVudCBvZiB0aGUgbm93LXVubWFwcGVkIHBhcmVudCBoYXMgYmVjb21lIHRoZVxuICAgICAqXHRwYXJlbnQgb2YgdGhpcyBzdXJmYWNlLiBJZiBubyBwYXJlbnQgZXhpc3RzIGZvciB0aGUgbm93LXVubWFwcGVkXG4gICAgICpcdHBhcmVudCB0aGVuIHRoZSBjaGlsZHJlbiBhcmUgbWFuYWdlZCBhcyB0aG91Z2ggdGhleSBoYXZlIG5vXG4gICAgICpcdHBhcmVudCBzdXJmYWNlLlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIHNldFBhcmVudChwYXJlbnQpIHtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgMSwgW29iamVjdE9wdGlvbmFsKHBhcmVudCldKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0U2V0IGEgc2hvcnQgdGl0bGUgZm9yIHRoZSBzdXJmYWNlLlxuICAgICAqXG4gICAgICpcdFRoaXMgc3RyaW5nIG1heSBiZSB1c2VkIHRvIGlkZW50aWZ5IHRoZSBzdXJmYWNlIGluIGEgdGFzayBiYXIsXG4gICAgICpcdHdpbmRvdyBsaXN0LCBvciBvdGhlciB1c2VyIGludGVyZmFjZSBlbGVtZW50cyBwcm92aWRlZCBieSB0aGVcbiAgICAgKlx0Y29tcG9zaXRvci5cbiAgICAgKlxuICAgICAqXHRUaGUgc3RyaW5nIG11c3QgYmUgZW5jb2RlZCBpbiBVVEYtOC5cbiAgICAgKlxuICAgICAqIEBzaW5jZSAxXG4gICAgICpcbiAgICAgKi9cbiAgICBzZXRUaXRsZSh0aXRsZSkge1xuICAgICAgICB0aGlzLl9tYXJzaGFsbCh0aGlzLmlkLCAyLCBbc3RyaW5nKHRpdGxlKV0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqXHRTZXQgYW4gYXBwbGljYXRpb24gaWRlbnRpZmllciBmb3IgdGhlIHN1cmZhY2UuXG4gICAgICpcbiAgICAgKlx0VGhlIGFwcCBJRCBpZGVudGlmaWVzIHRoZSBnZW5lcmFsIGNsYXNzIG9mIGFwcGxpY2F0aW9ucyB0byB3aGljaFxuICAgICAqXHR0aGUgc3VyZmFjZSBiZWxvbmdzLiBUaGUgY29tcG9zaXRvciBjYW4gdXNlIHRoaXMgdG8gZ3JvdXAgbXVsdGlwbGVcbiAgICAgKlx0c3VyZmFjZXMgdG9nZXRoZXIsIG9yIHRvIGRldGVybWluZSBob3cgdG8gbGF1bmNoIGEgbmV3IGFwcGxpY2F0aW9uLlxuICAgICAqXG4gICAgICpcdEZvciBELUJ1cyBhY3RpdmF0YWJsZSBhcHBsaWNhdGlvbnMsIHRoZSBhcHAgSUQgaXMgdXNlZCBhcyB0aGUgRC1CdXNcbiAgICAgKlx0c2VydmljZSBuYW1lLlxuICAgICAqXG4gICAgICpcdFRoZSBjb21wb3NpdG9yIHNoZWxsIHdpbGwgdHJ5IHRvIGdyb3VwIGFwcGxpY2F0aW9uIHN1cmZhY2VzIHRvZ2V0aGVyXG4gICAgICpcdGJ5IHRoZWlyIGFwcCBJRC4gQXMgYSBiZXN0IHByYWN0aWNlLCBpdCBpcyBzdWdnZXN0ZWQgdG8gc2VsZWN0IGFwcFxuICAgICAqXHRJRCdzIHRoYXQgbWF0Y2ggdGhlIGJhc2VuYW1lIG9mIHRoZSBhcHBsaWNhdGlvbidzIC5kZXNrdG9wIGZpbGUuXG4gICAgICpcdEZvciBleGFtcGxlLCBcIm9yZy5mcmVlZGVza3RvcC5Gb29WaWV3ZXJcIiB3aGVyZSB0aGUgLmRlc2t0b3AgZmlsZSBpc1xuICAgICAqXHRcIm9yZy5mcmVlZGVza3RvcC5Gb29WaWV3ZXIuZGVza3RvcFwiLlxuICAgICAqXG4gICAgICpcdFNlZSB0aGUgZGVza3RvcC1lbnRyeSBzcGVjaWZpY2F0aW9uIFswXSBmb3IgbW9yZSBkZXRhaWxzIG9uXG4gICAgICpcdGFwcGxpY2F0aW9uIGlkZW50aWZpZXJzIGFuZCBob3cgdGhleSByZWxhdGUgdG8gd2VsbC1rbm93biBELUJ1c1xuICAgICAqXHRuYW1lcyBhbmQgLmRlc2t0b3AgZmlsZXMuXG4gICAgICpcbiAgICAgKlx0WzBdIGh0dHA6Ly9zdGFuZGFyZHMuZnJlZWRlc2t0b3Aub3JnL2Rlc2t0b3AtZW50cnktc3BlYy9cbiAgICAgKlxuICAgICAqIEBzaW5jZSAxXG4gICAgICpcbiAgICAgKi9cbiAgICBzZXRBcHBJZChhcHBJZCkge1xuICAgICAgICB0aGlzLl9tYXJzaGFsbCh0aGlzLmlkLCAzLCBbc3RyaW5nKGFwcElkKV0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqXHRDbGllbnRzIGltcGxlbWVudGluZyBjbGllbnQtc2lkZSBkZWNvcmF0aW9ucyBtaWdodCB3YW50IHRvIHNob3dcbiAgICAgKlx0YSBjb250ZXh0IG1lbnUgd2hlbiByaWdodC1jbGlja2luZyBvbiB0aGUgZGVjb3JhdGlvbnMsIGdpdmluZyB0aGVcbiAgICAgKlx0dXNlciBhIG1lbnUgdGhhdCB0aGV5IGNhbiB1c2UgdG8gbWF4aW1pemUgb3IgbWluaW1pemUgdGhlIHdpbmRvdy5cbiAgICAgKlxuICAgICAqXHRUaGlzIHJlcXVlc3QgYXNrcyB0aGUgY29tcG9zaXRvciB0byBwb3AgdXAgc3VjaCBhIHdpbmRvdyBtZW51IGF0XG4gICAgICpcdHRoZSBnaXZlbiBwb3NpdGlvbiwgcmVsYXRpdmUgdG8gdGhlIGxvY2FsIHN1cmZhY2UgY29vcmRpbmF0ZXMgb2ZcbiAgICAgKlx0dGhlIHBhcmVudCBzdXJmYWNlLiBUaGVyZSBhcmUgbm8gZ3VhcmFudGVlcyBhcyB0byB3aGF0IG1lbnUgaXRlbXNcbiAgICAgKlx0dGhlIHdpbmRvdyBtZW51IGNvbnRhaW5zLlxuICAgICAqXG4gICAgICpcdFRoaXMgcmVxdWVzdCBtdXN0IGJlIHVzZWQgaW4gcmVzcG9uc2UgdG8gc29tZSBzb3J0IG9mIHVzZXIgYWN0aW9uXG4gICAgICpcdGxpa2UgYSBidXR0b24gcHJlc3MsIGtleSBwcmVzcywgb3IgdG91Y2ggZG93biBldmVudC5cbiAgICAgKlxuICAgICAqIEBzaW5jZSAxXG4gICAgICpcbiAgICAgKi9cbiAgICBzaG93V2luZG93TWVudShzZWF0LCBzZXJpYWwsIHgsIHkpIHtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgNCwgW29iamVjdChzZWF0KSwgdWludChzZXJpYWwpLCBpbnQoeCksIGludCh5KV0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqXHRTdGFydCBhbiBpbnRlcmFjdGl2ZSwgdXNlci1kcml2ZW4gbW92ZSBvZiB0aGUgc3VyZmFjZS5cbiAgICAgKlxuICAgICAqXHRUaGlzIHJlcXVlc3QgbXVzdCBiZSB1c2VkIGluIHJlc3BvbnNlIHRvIHNvbWUgc29ydCBvZiB1c2VyIGFjdGlvblxuICAgICAqXHRsaWtlIGEgYnV0dG9uIHByZXNzLCBrZXkgcHJlc3MsIG9yIHRvdWNoIGRvd24gZXZlbnQuIFRoZSBwYXNzZWRcbiAgICAgKlx0c2VyaWFsIGlzIHVzZWQgdG8gZGV0ZXJtaW5lIHRoZSB0eXBlIG9mIGludGVyYWN0aXZlIG1vdmUgKHRvdWNoLFxuICAgICAqXHRwb2ludGVyLCBldGMpLlxuICAgICAqXG4gICAgICpcdFRoZSBzZXJ2ZXIgbWF5IGlnbm9yZSBtb3ZlIHJlcXVlc3RzIGRlcGVuZGluZyBvbiB0aGUgc3RhdGUgb2ZcbiAgICAgKlx0dGhlIHN1cmZhY2UgKGUuZy4gZnVsbHNjcmVlbiBvciBtYXhpbWl6ZWQpLCBvciBpZiB0aGUgcGFzc2VkIHNlcmlhbFxuICAgICAqXHRpcyBubyBsb25nZXIgdmFsaWQuXG4gICAgICpcbiAgICAgKlx0SWYgdHJpZ2dlcmVkLCB0aGUgc3VyZmFjZSB3aWxsIGxvc2UgdGhlIGZvY3VzIG9mIHRoZSBkZXZpY2VcbiAgICAgKlx0KHdsX3BvaW50ZXIsIHdsX3RvdWNoLCBldGMpIHVzZWQgZm9yIHRoZSBtb3ZlLiBJdCBpcyB1cCB0byB0aGVcbiAgICAgKlx0Y29tcG9zaXRvciB0byB2aXN1YWxseSBpbmRpY2F0ZSB0aGF0IHRoZSBtb3ZlIGlzIHRha2luZyBwbGFjZSwgc3VjaCBhc1xuICAgICAqXHR1cGRhdGluZyBhIHBvaW50ZXIgY3Vyc29yLCBkdXJpbmcgdGhlIG1vdmUuIFRoZXJlIGlzIG5vIGd1YXJhbnRlZVxuICAgICAqXHR0aGF0IHRoZSBkZXZpY2UgZm9jdXMgd2lsbCByZXR1cm4gd2hlbiB0aGUgbW92ZSBpcyBjb21wbGV0ZWQuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgbW92ZShzZWF0LCBzZXJpYWwpIHtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgNSwgW29iamVjdChzZWF0KSwgdWludChzZXJpYWwpXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdFN0YXJ0IGEgdXNlci1kcml2ZW4sIGludGVyYWN0aXZlIHJlc2l6ZSBvZiB0aGUgc3VyZmFjZS5cbiAgICAgKlxuICAgICAqXHRUaGlzIHJlcXVlc3QgbXVzdCBiZSB1c2VkIGluIHJlc3BvbnNlIHRvIHNvbWUgc29ydCBvZiB1c2VyIGFjdGlvblxuICAgICAqXHRsaWtlIGEgYnV0dG9uIHByZXNzLCBrZXkgcHJlc3MsIG9yIHRvdWNoIGRvd24gZXZlbnQuIFRoZSBwYXNzZWRcbiAgICAgKlx0c2VyaWFsIGlzIHVzZWQgdG8gZGV0ZXJtaW5lIHRoZSB0eXBlIG9mIGludGVyYWN0aXZlIHJlc2l6ZSAodG91Y2gsXG4gICAgICpcdHBvaW50ZXIsIGV0YykuXG4gICAgICpcbiAgICAgKlx0VGhlIHNlcnZlciBtYXkgaWdub3JlIHJlc2l6ZSByZXF1ZXN0cyBkZXBlbmRpbmcgb24gdGhlIHN0YXRlIG9mXG4gICAgICpcdHRoZSBzdXJmYWNlIChlLmcuIGZ1bGxzY3JlZW4gb3IgbWF4aW1pemVkKS5cbiAgICAgKlxuICAgICAqXHRJZiB0cmlnZ2VyZWQsIHRoZSBjbGllbnQgd2lsbCByZWNlaXZlIGNvbmZpZ3VyZSBldmVudHMgd2l0aCB0aGVcbiAgICAgKlx0XCJyZXNpemVcIiBzdGF0ZSBlbnVtIHZhbHVlIGFuZCB0aGUgZXhwZWN0ZWQgc2l6ZXMuIFNlZSB0aGUgXCJyZXNpemVcIlxuICAgICAqXHRlbnVtIHZhbHVlIGZvciBtb3JlIGRldGFpbHMgYWJvdXQgd2hhdCBpcyByZXF1aXJlZC4gVGhlIGNsaWVudFxuICAgICAqXHRtdXN0IGFsc28gYWNrbm93bGVkZ2UgY29uZmlndXJlIGV2ZW50cyB1c2luZyBcImFja19jb25maWd1cmVcIi4gQWZ0ZXJcbiAgICAgKlx0dGhlIHJlc2l6ZSBpcyBjb21wbGV0ZWQsIHRoZSBjbGllbnQgd2lsbCByZWNlaXZlIGFub3RoZXIgXCJjb25maWd1cmVcIlxuICAgICAqXHRldmVudCB3aXRob3V0IHRoZSByZXNpemUgc3RhdGUuXG4gICAgICpcbiAgICAgKlx0SWYgdHJpZ2dlcmVkLCB0aGUgc3VyZmFjZSBhbHNvIHdpbGwgbG9zZSB0aGUgZm9jdXMgb2YgdGhlIGRldmljZVxuICAgICAqXHQod2xfcG9pbnRlciwgd2xfdG91Y2gsIGV0YykgdXNlZCBmb3IgdGhlIHJlc2l6ZS4gSXQgaXMgdXAgdG8gdGhlXG4gICAgICpcdGNvbXBvc2l0b3IgdG8gdmlzdWFsbHkgaW5kaWNhdGUgdGhhdCB0aGUgcmVzaXplIGlzIHRha2luZyBwbGFjZSxcbiAgICAgKlx0c3VjaCBhcyB1cGRhdGluZyBhIHBvaW50ZXIgY3Vyc29yLCBkdXJpbmcgdGhlIHJlc2l6ZS4gVGhlcmUgaXMgbm9cbiAgICAgKlx0Z3VhcmFudGVlIHRoYXQgdGhlIGRldmljZSBmb2N1cyB3aWxsIHJldHVybiB3aGVuIHRoZSByZXNpemUgaXNcbiAgICAgKlx0Y29tcGxldGVkLlxuICAgICAqXG4gICAgICpcdFRoZSBlZGdlcyBwYXJhbWV0ZXIgc3BlY2lmaWVzIGhvdyB0aGUgc3VyZmFjZSBzaG91bGQgYmUgcmVzaXplZCxcbiAgICAgKlx0YW5kIGlzIG9uZSBvZiB0aGUgdmFsdWVzIG9mIHRoZSByZXNpemVfZWRnZSBlbnVtLiBUaGUgY29tcG9zaXRvclxuICAgICAqXHRtYXkgdXNlIHRoaXMgaW5mb3JtYXRpb24gdG8gdXBkYXRlIHRoZSBzdXJmYWNlIHBvc2l0aW9uIGZvclxuICAgICAqXHRleGFtcGxlIHdoZW4gZHJhZ2dpbmcgdGhlIHRvcCBsZWZ0IGNvcm5lci4gVGhlIGNvbXBvc2l0b3IgbWF5IGFsc29cbiAgICAgKlx0dXNlIHRoaXMgaW5mb3JtYXRpb24gdG8gYWRhcHQgaXRzIGJlaGF2aW9yLCBlLmcuIGNob29zZSBhblxuICAgICAqXHRhcHByb3ByaWF0ZSBjdXJzb3IgaW1hZ2UuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgcmVzaXplKHNlYXQsIHNlcmlhbCwgZWRnZXMpIHtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgNiwgW29iamVjdChzZWF0KSwgdWludChzZXJpYWwpLCB1aW50KGVkZ2VzKV0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqXHRTZXQgYSBtYXhpbXVtIHNpemUgZm9yIHRoZSB3aW5kb3cuXG4gICAgICpcbiAgICAgKlx0VGhlIGNsaWVudCBjYW4gc3BlY2lmeSBhIG1heGltdW0gc2l6ZSBzbyB0aGF0IHRoZSBjb21wb3NpdG9yIGRvZXNcbiAgICAgKlx0bm90IHRyeSB0byBjb25maWd1cmUgdGhlIHdpbmRvdyBiZXlvbmQgdGhpcyBzaXplLlxuICAgICAqXG4gICAgICpcdFRoZSB3aWR0aCBhbmQgaGVpZ2h0IGFyZ3VtZW50cyBhcmUgaW4gd2luZG93IGdlb21ldHJ5IGNvb3JkaW5hdGVzLlxuICAgICAqXHRTZWUgeGRnX3N1cmZhY2Uuc2V0X3dpbmRvd19nZW9tZXRyeS5cbiAgICAgKlxuICAgICAqXHRWYWx1ZXMgc2V0IGluIHRoaXMgd2F5IGFyZSBkb3VibGUtYnVmZmVyZWQuIFRoZXkgd2lsbCBnZXQgYXBwbGllZFxuICAgICAqXHRvbiB0aGUgbmV4dCBjb21taXQuXG4gICAgICpcbiAgICAgKlx0VGhlIGNvbXBvc2l0b3IgY2FuIHVzZSB0aGlzIGluZm9ybWF0aW9uIHRvIGFsbG93IG9yIGRpc2FsbG93XG4gICAgICpcdGRpZmZlcmVudCBzdGF0ZXMgbGlrZSBtYXhpbWl6ZSBvciBmdWxsc2NyZWVuIGFuZCBkcmF3IGFjY3VyYXRlXG4gICAgICpcdGFuaW1hdGlvbnMuXG4gICAgICpcbiAgICAgKlx0U2ltaWxhcmx5LCBhIHRpbGluZyB3aW5kb3cgbWFuYWdlciBtYXkgdXNlIHRoaXMgaW5mb3JtYXRpb24gdG9cbiAgICAgKlx0cGxhY2UgYW5kIHJlc2l6ZSBjbGllbnQgd2luZG93cyBpbiBhIG1vcmUgZWZmZWN0aXZlIHdheS5cbiAgICAgKlxuICAgICAqXHRUaGUgY2xpZW50IHNob3VsZCBub3QgcmVseSBvbiB0aGUgY29tcG9zaXRvciB0byBvYmV5IHRoZSBtYXhpbXVtXG4gICAgICpcdHNpemUuIFRoZSBjb21wb3NpdG9yIG1heSBkZWNpZGUgdG8gaWdub3JlIHRoZSB2YWx1ZXMgc2V0IGJ5IHRoZVxuICAgICAqXHRjbGllbnQgYW5kIHJlcXVlc3QgYSBsYXJnZXIgc2l6ZS5cbiAgICAgKlxuICAgICAqXHRJZiBuZXZlciBzZXQsIG9yIGEgdmFsdWUgb2YgemVybyBpbiB0aGUgcmVxdWVzdCwgbWVhbnMgdGhhdCB0aGVcbiAgICAgKlx0Y2xpZW50IGhhcyBubyBleHBlY3RlZCBtYXhpbXVtIHNpemUgaW4gdGhlIGdpdmVuIGRpbWVuc2lvbi5cbiAgICAgKlx0QXMgYSByZXN1bHQsIGEgY2xpZW50IHdpc2hpbmcgdG8gcmVzZXQgdGhlIG1heGltdW0gc2l6ZVxuICAgICAqXHR0byBhbiB1bnNwZWNpZmllZCBzdGF0ZSBjYW4gdXNlIHplcm8gZm9yIHdpZHRoIGFuZCBoZWlnaHQgaW4gdGhlXG4gICAgICpcdHJlcXVlc3QuXG4gICAgICpcbiAgICAgKlx0UmVxdWVzdGluZyBhIG1heGltdW0gc2l6ZSB0byBiZSBzbWFsbGVyIHRoYW4gdGhlIG1pbmltdW0gc2l6ZSBvZlxuICAgICAqXHRhIHN1cmZhY2UgaXMgaWxsZWdhbCBhbmQgd2lsbCByZXN1bHQgaW4gYSBwcm90b2NvbCBlcnJvci5cbiAgICAgKlxuICAgICAqXHRUaGUgd2lkdGggYW5kIGhlaWdodCBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB6ZXJvLiBVc2luZ1xuICAgICAqXHRzdHJpY3RseSBuZWdhdGl2ZSB2YWx1ZXMgZm9yIHdpZHRoIGFuZCBoZWlnaHQgd2lsbCByZXN1bHQgaW4gYVxuICAgICAqXHRwcm90b2NvbCBlcnJvci5cbiAgICAgKlxuICAgICAqIEBzaW5jZSAxXG4gICAgICpcbiAgICAgKi9cbiAgICBzZXRNYXhTaXplKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgNywgW2ludCh3aWR0aCksIGludChoZWlnaHQpXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdFNldCBhIG1pbmltdW0gc2l6ZSBmb3IgdGhlIHdpbmRvdy5cbiAgICAgKlxuICAgICAqXHRUaGUgY2xpZW50IGNhbiBzcGVjaWZ5IGEgbWluaW11bSBzaXplIHNvIHRoYXQgdGhlIGNvbXBvc2l0b3IgZG9lc1xuICAgICAqXHRub3QgdHJ5IHRvIGNvbmZpZ3VyZSB0aGUgd2luZG93IGJlbG93IHRoaXMgc2l6ZS5cbiAgICAgKlxuICAgICAqXHRUaGUgd2lkdGggYW5kIGhlaWdodCBhcmd1bWVudHMgYXJlIGluIHdpbmRvdyBnZW9tZXRyeSBjb29yZGluYXRlcy5cbiAgICAgKlx0U2VlIHhkZ19zdXJmYWNlLnNldF93aW5kb3dfZ2VvbWV0cnkuXG4gICAgICpcbiAgICAgKlx0VmFsdWVzIHNldCBpbiB0aGlzIHdheSBhcmUgZG91YmxlLWJ1ZmZlcmVkLiBUaGV5IHdpbGwgZ2V0IGFwcGxpZWRcbiAgICAgKlx0b24gdGhlIG5leHQgY29tbWl0LlxuICAgICAqXG4gICAgICpcdFRoZSBjb21wb3NpdG9yIGNhbiB1c2UgdGhpcyBpbmZvcm1hdGlvbiB0byBhbGxvdyBvciBkaXNhbGxvd1xuICAgICAqXHRkaWZmZXJlbnQgc3RhdGVzIGxpa2UgbWF4aW1pemUgb3IgZnVsbHNjcmVlbiBhbmQgZHJhdyBhY2N1cmF0ZVxuICAgICAqXHRhbmltYXRpb25zLlxuICAgICAqXG4gICAgICpcdFNpbWlsYXJseSwgYSB0aWxpbmcgd2luZG93IG1hbmFnZXIgbWF5IHVzZSB0aGlzIGluZm9ybWF0aW9uIHRvXG4gICAgICpcdHBsYWNlIGFuZCByZXNpemUgY2xpZW50IHdpbmRvd3MgaW4gYSBtb3JlIGVmZmVjdGl2ZSB3YXkuXG4gICAgICpcbiAgICAgKlx0VGhlIGNsaWVudCBzaG91bGQgbm90IHJlbHkgb24gdGhlIGNvbXBvc2l0b3IgdG8gb2JleSB0aGUgbWluaW11bVxuICAgICAqXHRzaXplLiBUaGUgY29tcG9zaXRvciBtYXkgZGVjaWRlIHRvIGlnbm9yZSB0aGUgdmFsdWVzIHNldCBieSB0aGVcbiAgICAgKlx0Y2xpZW50IGFuZCByZXF1ZXN0IGEgc21hbGxlciBzaXplLlxuICAgICAqXG4gICAgICpcdElmIG5ldmVyIHNldCwgb3IgYSB2YWx1ZSBvZiB6ZXJvIGluIHRoZSByZXF1ZXN0LCBtZWFucyB0aGF0IHRoZVxuICAgICAqXHRjbGllbnQgaGFzIG5vIGV4cGVjdGVkIG1pbmltdW0gc2l6ZSBpbiB0aGUgZ2l2ZW4gZGltZW5zaW9uLlxuICAgICAqXHRBcyBhIHJlc3VsdCwgYSBjbGllbnQgd2lzaGluZyB0byByZXNldCB0aGUgbWluaW11bSBzaXplXG4gICAgICpcdHRvIGFuIHVuc3BlY2lmaWVkIHN0YXRlIGNhbiB1c2UgemVybyBmb3Igd2lkdGggYW5kIGhlaWdodCBpbiB0aGVcbiAgICAgKlx0cmVxdWVzdC5cbiAgICAgKlxuICAgICAqXHRSZXF1ZXN0aW5nIGEgbWluaW11bSBzaXplIHRvIGJlIGxhcmdlciB0aGFuIHRoZSBtYXhpbXVtIHNpemUgb2ZcbiAgICAgKlx0YSBzdXJmYWNlIGlzIGlsbGVnYWwgYW5kIHdpbGwgcmVzdWx0IGluIGEgcHJvdG9jb2wgZXJyb3IuXG4gICAgICpcbiAgICAgKlx0VGhlIHdpZHRoIGFuZCBoZWlnaHQgbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gemVyby4gVXNpbmdcbiAgICAgKlx0c3RyaWN0bHkgbmVnYXRpdmUgdmFsdWVzIGZvciB3aWR0aCBhbmQgaGVpZ2h0IHdpbGwgcmVzdWx0IGluIGFcbiAgICAgKlx0cHJvdG9jb2wgZXJyb3IuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgc2V0TWluU2l6ZSh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuX21hcnNoYWxsKHRoaXMuaWQsIDgsIFtpbnQod2lkdGgpLCBpbnQoaGVpZ2h0KV0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqXHRNYXhpbWl6ZSB0aGUgc3VyZmFjZS5cbiAgICAgKlxuICAgICAqXHRBZnRlciByZXF1ZXN0aW5nIHRoYXQgdGhlIHN1cmZhY2Ugc2hvdWxkIGJlIG1heGltaXplZCwgdGhlIGNvbXBvc2l0b3JcbiAgICAgKlx0d2lsbCByZXNwb25kIGJ5IGVtaXR0aW5nIGEgY29uZmlndXJlIGV2ZW50IHdpdGggdGhlIFwibWF4aW1pemVkXCIgc3RhdGVcbiAgICAgKlx0YW5kIHRoZSByZXF1aXJlZCB3aW5kb3cgZ2VvbWV0cnkuIFRoZSBjbGllbnQgc2hvdWxkIHRoZW4gdXBkYXRlIGl0c1xuICAgICAqXHRjb250ZW50LCBkcmF3aW5nIGl0IGluIGEgbWF4aW1pemVkIHN0YXRlLCBpLmUuIHdpdGhvdXQgc2hhZG93IG9yIG90aGVyXG4gICAgICpcdGRlY29yYXRpb24gb3V0c2lkZSBvZiB0aGUgd2luZG93IGdlb21ldHJ5LiBUaGUgY2xpZW50IG11c3QgYWxzb1xuICAgICAqXHRhY2tub3dsZWRnZSB0aGUgY29uZmlndXJlIHdoZW4gY29tbWl0dGluZyB0aGUgbmV3IGNvbnRlbnQgKHNlZVxuICAgICAqXHRhY2tfY29uZmlndXJlKS5cbiAgICAgKlxuICAgICAqXHRJdCBpcyB1cCB0byB0aGUgY29tcG9zaXRvciB0byBkZWNpZGUgaG93IGFuZCB3aGVyZSB0byBtYXhpbWl6ZSB0aGVcbiAgICAgKlx0c3VyZmFjZSwgZm9yIGV4YW1wbGUgd2hpY2ggb3V0cHV0IGFuZCB3aGF0IHJlZ2lvbiBvZiB0aGUgc2NyZWVuIHNob3VsZFxuICAgICAqXHRiZSB1c2VkLlxuICAgICAqXG4gICAgICpcdElmIHRoZSBzdXJmYWNlIHdhcyBhbHJlYWR5IG1heGltaXplZCwgdGhlIGNvbXBvc2l0b3Igd2lsbCBzdGlsbCBlbWl0XG4gICAgICpcdGEgY29uZmlndXJlIGV2ZW50IHdpdGggdGhlIFwibWF4aW1pemVkXCIgc3RhdGUuXG4gICAgICpcbiAgICAgKlx0SWYgdGhlIHN1cmZhY2UgaXMgaW4gYSBmdWxsc2NyZWVuIHN0YXRlLCB0aGlzIHJlcXVlc3QgaGFzIG5vIGRpcmVjdFxuICAgICAqXHRlZmZlY3QuIEl0IHdpbGwgYWx0ZXIgdGhlIHN0YXRlIHRoZSBzdXJmYWNlIGlzIHJldHVybmVkIHRvIHdoZW5cbiAgICAgKlx0dW5tYXhpbWl6ZWQgaWYgbm90IG92ZXJyaWRkZW4gYnkgdGhlIGNvbXBvc2l0b3IuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgc2V0TWF4aW1pemVkKCkge1xuICAgICAgICB0aGlzLl9tYXJzaGFsbCh0aGlzLmlkLCA5LCBbXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdFVubWF4aW1pemUgdGhlIHN1cmZhY2UuXG4gICAgICpcbiAgICAgKlx0QWZ0ZXIgcmVxdWVzdGluZyB0aGF0IHRoZSBzdXJmYWNlIHNob3VsZCBiZSB1bm1heGltaXplZCwgdGhlIGNvbXBvc2l0b3JcbiAgICAgKlx0d2lsbCByZXNwb25kIGJ5IGVtaXR0aW5nIGEgY29uZmlndXJlIGV2ZW50IHdpdGhvdXQgdGhlIFwibWF4aW1pemVkXCJcbiAgICAgKlx0c3RhdGUuIElmIGF2YWlsYWJsZSwgdGhlIGNvbXBvc2l0b3Igd2lsbCBpbmNsdWRlIHRoZSB3aW5kb3cgZ2VvbWV0cnlcbiAgICAgKlx0ZGltZW5zaW9ucyB0aGUgd2luZG93IGhhZCBwcmlvciB0byBiZWluZyBtYXhpbWl6ZWQgaW4gdGhlIGNvbmZpZ3VyZVxuICAgICAqXHRldmVudC4gVGhlIGNsaWVudCBtdXN0IHRoZW4gdXBkYXRlIGl0cyBjb250ZW50LCBkcmF3aW5nIGl0IGluIGFcbiAgICAgKlx0cmVndWxhciBzdGF0ZSwgaS5lLiBwb3RlbnRpYWxseSB3aXRoIHNoYWRvdywgZXRjLiBUaGUgY2xpZW50IG11c3QgYWxzb1xuICAgICAqXHRhY2tub3dsZWRnZSB0aGUgY29uZmlndXJlIHdoZW4gY29tbWl0dGluZyB0aGUgbmV3IGNvbnRlbnQgKHNlZVxuICAgICAqXHRhY2tfY29uZmlndXJlKS5cbiAgICAgKlxuICAgICAqXHRJdCBpcyB1cCB0byB0aGUgY29tcG9zaXRvciB0byBwb3NpdGlvbiB0aGUgc3VyZmFjZSBhZnRlciBpdCB3YXNcbiAgICAgKlx0dW5tYXhpbWl6ZWQ7IHVzdWFsbHkgdGhlIHBvc2l0aW9uIHRoZSBzdXJmYWNlIGhhZCBiZWZvcmUgbWF4aW1pemluZywgaWZcbiAgICAgKlx0YXBwbGljYWJsZS5cbiAgICAgKlxuICAgICAqXHRJZiB0aGUgc3VyZmFjZSB3YXMgYWxyZWFkeSBub3QgbWF4aW1pemVkLCB0aGUgY29tcG9zaXRvciB3aWxsIHN0aWxsXG4gICAgICpcdGVtaXQgYSBjb25maWd1cmUgZXZlbnQgd2l0aG91dCB0aGUgXCJtYXhpbWl6ZWRcIiBzdGF0ZS5cbiAgICAgKlxuICAgICAqXHRJZiB0aGUgc3VyZmFjZSBpcyBpbiBhIGZ1bGxzY3JlZW4gc3RhdGUsIHRoaXMgcmVxdWVzdCBoYXMgbm8gZGlyZWN0XG4gICAgICpcdGVmZmVjdC4gSXQgd2lsbCBhbHRlciB0aGUgc3RhdGUgdGhlIHN1cmZhY2UgaXMgcmV0dXJuZWQgdG8gd2hlblxuICAgICAqXHR1bm1heGltaXplZCBpZiBub3Qgb3ZlcnJpZGRlbiBieSB0aGUgY29tcG9zaXRvci5cbiAgICAgKlxuICAgICAqIEBzaW5jZSAxXG4gICAgICpcbiAgICAgKi9cbiAgICB1bnNldE1heGltaXplZCgpIHtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgMTAsIFtdKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0TWFrZSB0aGUgc3VyZmFjZSBmdWxsc2NyZWVuLlxuICAgICAqXG4gICAgICpcdEFmdGVyIHJlcXVlc3RpbmcgdGhhdCB0aGUgc3VyZmFjZSBzaG91bGQgYmUgZnVsbHNjcmVlbmVkLCB0aGVcbiAgICAgKlx0Y29tcG9zaXRvciB3aWxsIHJlc3BvbmQgYnkgZW1pdHRpbmcgYSBjb25maWd1cmUgZXZlbnQgd2l0aCB0aGVcbiAgICAgKlx0XCJmdWxsc2NyZWVuXCIgc3RhdGUgYW5kIHRoZSBmdWxsc2NyZWVuIHdpbmRvdyBnZW9tZXRyeS4gVGhlIGNsaWVudCBtdXN0XG4gICAgICpcdGFsc28gYWNrbm93bGVkZ2UgdGhlIGNvbmZpZ3VyZSB3aGVuIGNvbW1pdHRpbmcgdGhlIG5ldyBjb250ZW50IChzZWVcbiAgICAgKlx0YWNrX2NvbmZpZ3VyZSkuXG4gICAgICpcbiAgICAgKlx0VGhlIG91dHB1dCBwYXNzZWQgYnkgdGhlIHJlcXVlc3QgaW5kaWNhdGVzIHRoZSBjbGllbnQncyBwcmVmZXJlbmNlIGFzXG4gICAgICpcdHRvIHdoaWNoIGRpc3BsYXkgaXQgc2hvdWxkIGJlIHNldCBmdWxsc2NyZWVuIG9uLiBJZiB0aGlzIHZhbHVlIGlzIE5VTEwsXG4gICAgICpcdGl0J3MgdXAgdG8gdGhlIGNvbXBvc2l0b3IgdG8gY2hvb3NlIHdoaWNoIGRpc3BsYXkgd2lsbCBiZSB1c2VkIHRvIG1hcFxuICAgICAqXHR0aGlzIHN1cmZhY2UuXG4gICAgICpcbiAgICAgKlx0SWYgdGhlIHN1cmZhY2UgZG9lc24ndCBjb3ZlciB0aGUgd2hvbGUgb3V0cHV0LCB0aGUgY29tcG9zaXRvciB3aWxsXG4gICAgICpcdHBvc2l0aW9uIHRoZSBzdXJmYWNlIGluIHRoZSBjZW50ZXIgb2YgdGhlIG91dHB1dCBhbmQgY29tcGVuc2F0ZSB3aXRoXG4gICAgICpcdHdpdGggYm9yZGVyIGZpbGwgY292ZXJpbmcgdGhlIHJlc3Qgb2YgdGhlIG91dHB1dC4gVGhlIGNvbnRlbnQgb2YgdGhlXG4gICAgICpcdGJvcmRlciBmaWxsIGlzIHVuZGVmaW5lZCwgYnV0IHNob3VsZCBiZSBhc3N1bWVkIHRvIGJlIGluIHNvbWUgd2F5IHRoYXRcbiAgICAgKlx0YXR0ZW1wdHMgdG8gYmxlbmQgaW50byB0aGUgc3Vycm91bmRpbmcgYXJlYSAoZS5nLiBzb2xpZCBibGFjaykuXG4gICAgICpcbiAgICAgKlx0SWYgdGhlIGZ1bGxzY3JlZW5lZCBzdXJmYWNlIGlzIG5vdCBvcGFxdWUsIHRoZSBjb21wb3NpdG9yIG11c3QgbWFrZVxuICAgICAqXHRzdXJlIHRoYXQgb3RoZXIgc2NyZWVuIGNvbnRlbnQgbm90IHBhcnQgb2YgdGhlIHNhbWUgc3VyZmFjZSB0cmVlIChtYWRlXG4gICAgICpcdHVwIG9mIHN1YnN1cmZhY2VzLCBwb3B1cHMgb3Igc2ltaWxhcmx5IGNvdXBsZWQgc3VyZmFjZXMpIGFyZSBub3RcbiAgICAgKlx0dmlzaWJsZSBiZWxvdyB0aGUgZnVsbHNjcmVlbmVkIHN1cmZhY2UuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgc2V0RnVsbHNjcmVlbihvdXRwdXQpIHtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgMTEsIFtvYmplY3RPcHRpb25hbChvdXRwdXQpXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdE1ha2UgdGhlIHN1cmZhY2Ugbm8gbG9uZ2VyIGZ1bGxzY3JlZW4uXG4gICAgICpcbiAgICAgKlx0QWZ0ZXIgcmVxdWVzdGluZyB0aGF0IHRoZSBzdXJmYWNlIHNob3VsZCBiZSB1bmZ1bGxzY3JlZW5lZCwgdGhlXG4gICAgICpcdGNvbXBvc2l0b3Igd2lsbCByZXNwb25kIGJ5IGVtaXR0aW5nIGEgY29uZmlndXJlIGV2ZW50IHdpdGhvdXQgdGhlXG4gICAgICpcdFwiZnVsbHNjcmVlblwiIHN0YXRlLlxuICAgICAqXG4gICAgICpcdE1ha2luZyBhIHN1cmZhY2UgdW5mdWxsc2NyZWVuIHNldHMgc3RhdGVzIGZvciB0aGUgc3VyZmFjZSBiYXNlZCBvbiB0aGUgZm9sbG93aW5nOlxuICAgICAqXHQqIHRoZSBzdGF0ZShzKSBpdCBtYXkgaGF2ZSBoYWQgYmVmb3JlIGJlY29taW5nIGZ1bGxzY3JlZW5cbiAgICAgKlx0KiBhbnkgc3RhdGUocykgZGVjaWRlZCBieSB0aGUgY29tcG9zaXRvclxuICAgICAqXHQqIGFueSBzdGF0ZShzKSByZXF1ZXN0ZWQgYnkgdGhlIGNsaWVudCB3aGlsZSB0aGUgc3VyZmFjZSB3YXMgZnVsbHNjcmVlblxuICAgICAqXG4gICAgICpcdFRoZSBjb21wb3NpdG9yIG1heSBpbmNsdWRlIHRoZSBwcmV2aW91cyB3aW5kb3cgZ2VvbWV0cnkgZGltZW5zaW9ucyBpblxuICAgICAqXHR0aGUgY29uZmlndXJlIGV2ZW50LCBpZiBhcHBsaWNhYmxlLlxuICAgICAqXG4gICAgICpcdFRoZSBjbGllbnQgbXVzdCBhbHNvIGFja25vd2xlZGdlIHRoZSBjb25maWd1cmUgd2hlbiBjb21taXR0aW5nIHRoZSBuZXdcbiAgICAgKlx0Y29udGVudCAoc2VlIGFja19jb25maWd1cmUpLlxuICAgICAqXG4gICAgICogQHNpbmNlIDFcbiAgICAgKlxuICAgICAqL1xuICAgIHVuc2V0RnVsbHNjcmVlbigpIHtcbiAgICAgICAgdGhpcy5fbWFyc2hhbGwodGhpcy5pZCwgMTIsIFtdKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKlx0UmVxdWVzdCB0aGF0IHRoZSBjb21wb3NpdG9yIG1pbmltaXplIHlvdXIgc3VyZmFjZS4gVGhlcmUgaXMgbm9cbiAgICAgKlx0d2F5IHRvIGtub3cgaWYgdGhlIHN1cmZhY2UgaXMgY3VycmVudGx5IG1pbmltaXplZCwgbm9yIGlzIHRoZXJlXG4gICAgICpcdGFueSB3YXkgdG8gdW5zZXQgbWluaW1pemF0aW9uIG9uIHRoaXMgc3VyZmFjZS5cbiAgICAgKlxuICAgICAqXHRJZiB5b3UgYXJlIGxvb2tpbmcgdG8gdGhyb3R0bGUgcmVkcmF3aW5nIHdoZW4gbWluaW1pemVkLCBwbGVhc2VcbiAgICAgKlx0aW5zdGVhZCB1c2UgdGhlIHdsX3N1cmZhY2UuZnJhbWUgZXZlbnQgZm9yIHRoaXMsIGFzIHRoaXMgd2lsbFxuICAgICAqXHRhbHNvIHdvcmsgd2l0aCBsaXZlIHByZXZpZXdzIG9uIHdpbmRvd3MgaW4gQWx0LVRhYiwgRXhwb3NlIG9yXG4gICAgICpcdHNpbWlsYXIgY29tcG9zaXRvciBmZWF0dXJlcy5cbiAgICAgKlxuICAgICAqIEBzaW5jZSAxXG4gICAgICpcbiAgICAgKi9cbiAgICBzZXRNaW5pbWl6ZWQoKSB7XG4gICAgICAgIHRoaXMuX21hcnNoYWxsKHRoaXMuaWQsIDEzLCBbXSk7XG4gICAgfVxuICAgIFswXShtZXNzYWdlKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHlpZWxkICgoX2EgPSB0aGlzLmxpc3RlbmVyKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY29uZmlndXJlKGkobWVzc2FnZSksIGkobWVzc2FnZSksIGEobWVzc2FnZSkpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFsxXShtZXNzYWdlKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHlpZWxkICgoX2EgPSB0aGlzLmxpc3RlbmVyKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2xvc2UoKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydCBjb25zdCBYZGdUb3BsZXZlbFByb3RvY29sTmFtZSA9ICd4ZGdfdG9wbGV2ZWwnO1xuZXhwb3J0IHZhciBYZGdUb3BsZXZlbFJlc2l6ZUVkZ2U7XG4oZnVuY3Rpb24gKFhkZ1RvcGxldmVsUmVzaXplRWRnZSkge1xuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgWGRnVG9wbGV2ZWxSZXNpemVFZGdlW1hkZ1RvcGxldmVsUmVzaXplRWRnZVtcIl9ub25lXCJdID0gMF0gPSBcIl9ub25lXCI7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBYZGdUb3BsZXZlbFJlc2l6ZUVkZ2VbWGRnVG9wbGV2ZWxSZXNpemVFZGdlW1wiX3RvcFwiXSA9IDFdID0gXCJfdG9wXCI7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBYZGdUb3BsZXZlbFJlc2l6ZUVkZ2VbWGRnVG9wbGV2ZWxSZXNpemVFZGdlW1wiX2JvdHRvbVwiXSA9IDJdID0gXCJfYm90dG9tXCI7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBYZGdUb3BsZXZlbFJlc2l6ZUVkZ2VbWGRnVG9wbGV2ZWxSZXNpemVFZGdlW1wiX2xlZnRcIl0gPSA0XSA9IFwiX2xlZnRcIjtcbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIFhkZ1RvcGxldmVsUmVzaXplRWRnZVtYZGdUb3BsZXZlbFJlc2l6ZUVkZ2VbXCJfdG9wTGVmdFwiXSA9IDVdID0gXCJfdG9wTGVmdFwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgWGRnVG9wbGV2ZWxSZXNpemVFZGdlW1hkZ1RvcGxldmVsUmVzaXplRWRnZVtcIl9ib3R0b21MZWZ0XCJdID0gNl0gPSBcIl9ib3R0b21MZWZ0XCI7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBYZGdUb3BsZXZlbFJlc2l6ZUVkZ2VbWGRnVG9wbGV2ZWxSZXNpemVFZGdlW1wiX3JpZ2h0XCJdID0gOF0gPSBcIl9yaWdodFwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgWGRnVG9wbGV2ZWxSZXNpemVFZGdlW1hkZ1RvcGxldmVsUmVzaXplRWRnZVtcIl90b3BSaWdodFwiXSA9IDldID0gXCJfdG9wUmlnaHRcIjtcbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIFhkZ1RvcGxldmVsUmVzaXplRWRnZVtYZGdUb3BsZXZlbFJlc2l6ZUVkZ2VbXCJfYm90dG9tUmlnaHRcIl0gPSAxMF0gPSBcIl9ib3R0b21SaWdodFwiO1xufSkoWGRnVG9wbGV2ZWxSZXNpemVFZGdlIHx8IChYZGdUb3BsZXZlbFJlc2l6ZUVkZ2UgPSB7fSkpO1xuZXhwb3J0IHZhciBYZGdUb3BsZXZlbFN0YXRlO1xuKGZ1bmN0aW9uIChYZGdUb3BsZXZlbFN0YXRlKSB7XG4gICAgLyoqXG4gICAgICogdGhlIHN1cmZhY2UgaXMgbWF4aW1pemVkXG4gICAgICovXG4gICAgWGRnVG9wbGV2ZWxTdGF0ZVtYZGdUb3BsZXZlbFN0YXRlW1wiX21heGltaXplZFwiXSA9IDFdID0gXCJfbWF4aW1pemVkXCI7XG4gICAgLyoqXG4gICAgICogdGhlIHN1cmZhY2UgaXMgZnVsbHNjcmVlblxuICAgICAqL1xuICAgIFhkZ1RvcGxldmVsU3RhdGVbWGRnVG9wbGV2ZWxTdGF0ZVtcIl9mdWxsc2NyZWVuXCJdID0gMl0gPSBcIl9mdWxsc2NyZWVuXCI7XG4gICAgLyoqXG4gICAgICogdGhlIHN1cmZhY2UgaXMgYmVpbmcgcmVzaXplZFxuICAgICAqL1xuICAgIFhkZ1RvcGxldmVsU3RhdGVbWGRnVG9wbGV2ZWxTdGF0ZVtcIl9yZXNpemluZ1wiXSA9IDNdID0gXCJfcmVzaXppbmdcIjtcbiAgICAvKipcbiAgICAgKiB0aGUgc3VyZmFjZSBpcyBub3cgYWN0aXZhdGVkXG4gICAgICovXG4gICAgWGRnVG9wbGV2ZWxTdGF0ZVtYZGdUb3BsZXZlbFN0YXRlW1wiX2FjdGl2YXRlZFwiXSA9IDRdID0gXCJfYWN0aXZhdGVkXCI7XG59KShYZGdUb3BsZXZlbFN0YXRlIHx8IChYZGdUb3BsZXZlbFN0YXRlID0ge30pKTtcbi8qKlxuICpcbiAqICAgICAgQSBwb3B1cCBzdXJmYWNlIGlzIGEgc2hvcnQtbGl2ZWQsIHRlbXBvcmFyeSBzdXJmYWNlLiBJdCBjYW4gYmUgdXNlZCB0b1xuICogICAgICBpbXBsZW1lbnQgZm9yIGV4YW1wbGUgbWVudXMsIHBvcG92ZXJzLCB0b29sdGlwcyBhbmQgb3RoZXIgc2ltaWxhciB1c2VyXG4gKiAgICAgIGludGVyZmFjZSBjb25jZXB0cy5cbiAqXG4gKiAgICAgIEEgcG9wdXAgY2FuIGJlIG1hZGUgdG8gdGFrZSBhbiBleHBsaWNpdCBncmFiLiBTZWUgeGRnX3BvcHVwLmdyYWIgZm9yXG4gKiAgICAgIGRldGFpbHMuXG4gKlxuICogICAgICBXaGVuIHRoZSBwb3B1cCBpcyBkaXNtaXNzZWQsIGEgcG9wdXBfZG9uZSBldmVudCB3aWxsIGJlIHNlbnQgb3V0LCBhbmQgYXRcbiAqICAgICAgdGhlIHNhbWUgdGltZSB0aGUgc3VyZmFjZSB3aWxsIGJlIHVubWFwcGVkLiBTZWUgdGhlIHhkZ19wb3B1cC5wb3B1cF9kb25lXG4gKiAgICAgIGV2ZW50IGZvciBkZXRhaWxzLlxuICpcbiAqICAgICAgRXhwbGljaXRseSBkZXN0cm95aW5nIHRoZSB4ZGdfcG9wdXAgb2JqZWN0IHdpbGwgYWxzbyBkaXNtaXNzIHRoZSBwb3B1cCBhbmRcbiAqICAgICAgdW5tYXAgdGhlIHN1cmZhY2UuIENsaWVudHMgdGhhdCB3YW50IHRvIGRpc21pc3MgdGhlIHBvcHVwIHdoZW4gYW5vdGhlclxuICogICAgICBzdXJmYWNlIG9mIHRoZWlyIG93biBpcyBjbGlja2VkIHNob3VsZCBkaXNtaXNzIHRoZSBwb3B1cCB1c2luZyB0aGUgZGVzdHJveVxuICogICAgICByZXF1ZXN0LlxuICpcbiAqICAgICAgVGhlIHBhcmVudCBzdXJmYWNlIG11c3QgaGF2ZSBlaXRoZXIgdGhlIHhkZ190b3BsZXZlbCBvciB4ZGdfcG9wdXAgc3VyZmFjZVxuICogICAgICByb2xlLlxuICpcbiAqICAgICAgQSBuZXdseSBjcmVhdGVkIHhkZ19wb3B1cCB3aWxsIGJlIHN0YWNrZWQgb24gdG9wIG9mIGFsbCBwcmV2aW91c2x5IGNyZWF0ZWRcbiAqICAgICAgeGRnX3BvcHVwIHN1cmZhY2VzIGFzc29jaWF0ZWQgd2l0aCB0aGUgc2FtZSB4ZGdfdG9wbGV2ZWwuXG4gKlxuICogICAgICBUaGUgcGFyZW50IG9mIGFuIHhkZ19wb3B1cCBtdXN0IGJlIG1hcHBlZCAoc2VlIHRoZSB4ZGdfc3VyZmFjZVxuICogICAgICBkZXNjcmlwdGlvbikgYmVmb3JlIHRoZSB4ZGdfcG9wdXAgaXRzZWxmLlxuICpcbiAqICAgICAgVGhlIHggYW5kIHkgYXJndW1lbnRzIHBhc3NlZCB3aGVuIGNyZWF0aW5nIHRoZSBwb3B1cCBvYmplY3Qgc3BlY2lmeVxuICogICAgICB3aGVyZSB0aGUgdG9wIGxlZnQgb2YgdGhlIHBvcHVwIHNob3VsZCBiZSBwbGFjZWQsIHJlbGF0aXZlIHRvIHRoZVxuICogICAgICBsb2NhbCBzdXJmYWNlIGNvb3JkaW5hdGVzIG9mIHRoZSBwYXJlbnQgc3VyZmFjZS4gU2VlXG4gKiAgICAgIHhkZ19zdXJmYWNlLmdldF9wb3B1cC4gQW4geGRnX3BvcHVwIG11c3QgaW50ZXJzZWN0IHdpdGggb3IgYmUgYXQgbGVhc3RcbiAqICAgICAgcGFydGlhbGx5IGFkamFjZW50IHRvIGl0cyBwYXJlbnQgc3VyZmFjZS5cbiAqXG4gKiAgICAgIFRoZSBjbGllbnQgbXVzdCBjYWxsIHdsX3N1cmZhY2UuY29tbWl0IG9uIHRoZSBjb3JyZXNwb25kaW5nIHdsX3N1cmZhY2VcbiAqICAgICAgZm9yIHRoZSB4ZGdfcG9wdXAgc3RhdGUgdG8gdGFrZSBlZmZlY3QuXG4gKlxuICovXG5leHBvcnQgY2xhc3MgWGRnUG9wdXBQcm94eSBleHRlbmRzIFByb3h5IHtcbiAgICAvKipcbiAgICAgKiBEbyBub3QgY29uc3RydWN0IHByb3hpZXMgZGlyZWN0bHkuIEluc3RlYWQgdXNlIG9uZSBvZiB0aGUgZmFjdG9yeSBtZXRob2RzIGZyb20gb3RoZXIgcHJveGllcy5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihkaXNwbGF5LCBjb25uZWN0aW9uLCBpZCkge1xuICAgICAgICBzdXBlcihkaXNwbGF5LCBjb25uZWN0aW9uLCBpZCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdFRoaXMgZGVzdHJveXMgdGhlIHBvcHVwLiBFeHBsaWNpdGx5IGRlc3Ryb3lpbmcgdGhlIHhkZ19wb3B1cFxuICAgICAqXHRvYmplY3Qgd2lsbCBhbHNvIGRpc21pc3MgdGhlIHBvcHVwLCBhbmQgdW5tYXAgdGhlIHN1cmZhY2UuXG4gICAgICpcbiAgICAgKlx0SWYgdGhpcyB4ZGdfcG9wdXAgaXMgbm90IHRoZSBcInRvcG1vc3RcIiBwb3B1cCwgYSBwcm90b2NvbCBlcnJvclxuICAgICAqXHR3aWxsIGJlIHNlbnQuXG4gICAgICpcbiAgICAgKiBAc2luY2UgMVxuICAgICAqXG4gICAgICovXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLl9tYXJzaGFsbCh0aGlzLmlkLCAwLCBbXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICpcdFRoaXMgcmVxdWVzdCBtYWtlcyB0aGUgY3JlYXRlZCBwb3B1cCB0YWtlIGFuIGV4cGxpY2l0IGdyYWIuIEFuIGV4cGxpY2l0XG4gICAgICpcdGdyYWIgd2lsbCBiZSBkaXNtaXNzZWQgd2hlbiB0aGUgdXNlciBkaXNtaXNzZXMgdGhlIHBvcHVwLCBvciB3aGVuIHRoZVxuICAgICAqXHRjbGllbnQgZGVzdHJveXMgdGhlIHhkZ19wb3B1cC4gVGhpcyBjYW4gYmUgZG9uZSBieSB0aGUgdXNlciBjbGlja2luZ1xuICAgICAqXHRvdXRzaWRlIHRoZSBzdXJmYWNlLCB1c2luZyB0aGUga2V5Ym9hcmQsIG9yIGV2ZW4gbG9ja2luZyB0aGUgc2NyZWVuXG4gICAgICpcdHRocm91Z2ggY2xvc2luZyB0aGUgbGlkIG9yIGEgdGltZW91dC5cbiAgICAgKlxuICAgICAqXHRJZiB0aGUgY29tcG9zaXRvciBkZW5pZXMgdGhlIGdyYWIsIHRoZSBwb3B1cCB3aWxsIGJlIGltbWVkaWF0ZWx5XG4gICAgICpcdGRpc21pc3NlZC5cbiAgICAgKlxuICAgICAqXHRUaGlzIHJlcXVlc3QgbXVzdCBiZSB1c2VkIGluIHJlc3BvbnNlIHRvIHNvbWUgc29ydCBvZiB1c2VyIGFjdGlvbiBsaWtlIGFcbiAgICAgKlx0YnV0dG9uIHByZXNzLCBrZXkgcHJlc3MsIG9yIHRvdWNoIGRvd24gZXZlbnQuIFRoZSBzZXJpYWwgbnVtYmVyIG9mIHRoZVxuICAgICAqXHRldmVudCBzaG91bGQgYmUgcGFzc2VkIGFzICdzZXJpYWwnLlxuICAgICAqXG4gICAgICpcdFRoZSBwYXJlbnQgb2YgYSBncmFiYmluZyBwb3B1cCBtdXN0IGVpdGhlciBiZSBhbiB4ZGdfdG9wbGV2ZWwgc3VyZmFjZSBvclxuICAgICAqXHRhbm90aGVyIHhkZ19wb3B1cCB3aXRoIGFuIGV4cGxpY2l0IGdyYWIuIElmIHRoZSBwYXJlbnQgaXMgYW5vdGhlclxuICAgICAqXHR4ZGdfcG9wdXAgaXQgbWVhbnMgdGhhdCB0aGUgcG9wdXBzIGFyZSBuZXN0ZWQsIHdpdGggdGhpcyBwb3B1cCBub3cgYmVpbmdcbiAgICAgKlx0dGhlIHRvcG1vc3QgcG9wdXAuXG4gICAgICpcbiAgICAgKlx0TmVzdGVkIHBvcHVwcyBtdXN0IGJlIGRlc3Ryb3llZCBpbiB0aGUgcmV2ZXJzZSBvcmRlciB0aGV5IHdlcmUgY3JlYXRlZFxuICAgICAqXHRpbiwgZS5nLiB0aGUgb25seSBwb3B1cCB5b3UgYXJlIGFsbG93ZWQgdG8gZGVzdHJveSBhdCBhbGwgdGltZXMgaXMgdGhlXG4gICAgICpcdHRvcG1vc3Qgb25lLlxuICAgICAqXG4gICAgICpcdFdoZW4gY29tcG9zaXRvcnMgY2hvb3NlIHRvIGRpc21pc3MgYSBwb3B1cCwgdGhleSBtYXkgZGlzbWlzcyBldmVyeVxuICAgICAqXHRuZXN0ZWQgZ3JhYmJpbmcgcG9wdXAgYXMgd2VsbC4gV2hlbiBhIGNvbXBvc2l0b3IgZGlzbWlzc2VzIHBvcHVwcywgaXRcbiAgICAgKlx0d2lsbCBmb2xsb3cgdGhlIHNhbWUgZGlzbWlzc2luZyBvcmRlciBhcyByZXF1aXJlZCBmcm9tIHRoZSBjbGllbnQuXG4gICAgICpcbiAgICAgKlx0VGhlIHBhcmVudCBvZiBhIGdyYWJiaW5nIHBvcHVwIG11c3QgZWl0aGVyIGJlIGFub3RoZXIgeGRnX3BvcHVwIHdpdGggYW5cbiAgICAgKlx0YWN0aXZlIGV4cGxpY2l0IGdyYWIsIG9yIGFuIHhkZ19wb3B1cCBvciB4ZGdfdG9wbGV2ZWwsIGlmIHRoZXJlIGFyZSBub1xuICAgICAqXHRleHBsaWNpdCBncmFicyBhbHJlYWR5IHRha2VuLlxuICAgICAqXG4gICAgICpcdElmIHRoZSB0b3Btb3N0IGdyYWJiaW5nIHBvcHVwIGlzIGRlc3Ryb3llZCwgdGhlIGdyYWIgd2lsbCBiZSByZXR1cm5lZCB0b1xuICAgICAqXHR0aGUgcGFyZW50IG9mIHRoZSBwb3B1cCwgaWYgdGhhdCBwYXJlbnQgcHJldmlvdXNseSBoYWQgYW4gZXhwbGljaXQgZ3JhYi5cbiAgICAgKlxuICAgICAqXHRJZiB0aGUgcGFyZW50IGlzIGEgZ3JhYmJpbmcgcG9wdXAgd2hpY2ggaGFzIGFscmVhZHkgYmVlbiBkaXNtaXNzZWQsIHRoaXNcbiAgICAgKlx0cG9wdXAgd2lsbCBiZSBpbW1lZGlhdGVseSBkaXNtaXNzZWQuIElmIHRoZSBwYXJlbnQgaXMgYSBwb3B1cCB0aGF0IGRpZFxuICAgICAqXHRub3QgdGFrZSBhbiBleHBsaWNpdCBncmFiLCBhbiBlcnJvciB3aWxsIGJlIHJhaXNlZC5cbiAgICAgKlxuICAgICAqXHREdXJpbmcgYSBwb3B1cCBncmFiLCB0aGUgY2xpZW50IG93bmluZyB0aGUgZ3JhYiB3aWxsIHJlY2VpdmUgcG9pbnRlclxuICAgICAqXHRhbmQgdG91Y2ggZXZlbnRzIGZvciBhbGwgdGhlaXIgc3VyZmFjZXMgYXMgbm9ybWFsIChzaW1pbGFyIHRvIGFuXG4gICAgICpcdFwib3duZXItZXZlbnRzXCIgZ3JhYiBpbiBYMTEgcGFybGFuY2UpLCB3aGlsZSB0aGUgdG9wIG1vc3QgZ3JhYmJpbmcgcG9wdXBcbiAgICAgKlx0d2lsbCBhbHdheXMgaGF2ZSBrZXlib2FyZCBmb2N1cy5cbiAgICAgKlxuICAgICAqIEBzaW5jZSAxXG4gICAgICpcbiAgICAgKi9cbiAgICBncmFiKHNlYXQsIHNlcmlhbCkge1xuICAgICAgICB0aGlzLl9tYXJzaGFsbCh0aGlzLmlkLCAxLCBbb2JqZWN0KHNlYXQpLCB1aW50KHNlcmlhbCldKTtcbiAgICB9XG4gICAgWzBdKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgKChfYSA9IHRoaXMubGlzdGVuZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jb25maWd1cmUoaShtZXNzYWdlKSwgaShtZXNzYWdlKSwgaShtZXNzYWdlKSwgaShtZXNzYWdlKSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgWzFdKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgKChfYSA9IHRoaXMubGlzdGVuZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5wb3B1cERvbmUoKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydCBjb25zdCBYZGdQb3B1cFByb3RvY29sTmFtZSA9ICd4ZGdfcG9wdXAnO1xuZXhwb3J0IHZhciBYZGdQb3B1cEVycm9yO1xuKGZ1bmN0aW9uIChYZGdQb3B1cEVycm9yKSB7XG4gICAgLyoqXG4gICAgICogdHJpZWQgdG8gZ3JhYiBhZnRlciBiZWluZyBtYXBwZWRcbiAgICAgKi9cbiAgICBYZGdQb3B1cEVycm9yW1hkZ1BvcHVwRXJyb3JbXCJfaW52YWxpZEdyYWJcIl0gPSAwXSA9IFwiX2ludmFsaWRHcmFiXCI7XG59KShYZGdQb3B1cEVycm9yIHx8IChYZGdQb3B1cEVycm9yID0ge30pKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXhkZ19zaGVsbC5qcy5tYXAiLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmltcG9ydCB7IG5ld09iamVjdCwgbywgcywgc3RyaW5nLCB1LCB1aW50LCBXZWJGRCwgV2xPYmplY3QgfSBmcm9tICd3ZXN0ZmllbGQtcnVudGltZS1jb21tb24nO1xuZXhwb3J0IGNsYXNzIFByb3h5IGV4dGVuZHMgV2xPYmplY3Qge1xuICAgIGNvbnN0cnVjdG9yKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKSB7XG4gICAgICAgIHN1cGVyKGlkKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0gZGlzcGxheTtcbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbiA9IGNvbm5lY3Rpb247XG4gICAgICAgIGNvbm5lY3Rpb24ucmVnaXN0ZXJXbE9iamVjdCh0aGlzKTtcbiAgICB9XG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLl9jb25uZWN0aW9uLnVucmVnaXN0ZXJXbE9iamVjdCh0aGlzKTtcbiAgICB9XG4gICAgX21hcnNoYWxsQ29uc3RydWN0b3IoaWQsIG9wY29kZSwgcHJveHlDbGFzcywgYXJnc0FycmF5KSB7XG4gICAgICAgIC8vIGNvbnN0cnVjdCBuZXcgb2JqZWN0XG4gICAgICAgIGNvbnN0IHByb3h5ID0gbmV3IHByb3h5Q2xhc3ModGhpcy5kaXNwbGF5LCB0aGlzLl9jb25uZWN0aW9uLCB0aGlzLmRpc3BsYXkuZ2VuZXJhdGVOZXh0SWQoKSk7XG4gICAgICAgIC8vIGRldGVybWluZSByZXF1aXJlZCB3aXJlIG1lc3NhZ2UgbGVuZ3RoXG4gICAgICAgIGxldCBzaXplID0gNCArIDIgKyAyOyAvLyBpZCtzaXplK29wY29kZVxuICAgICAgICBhcmdzQXJyYXkuZm9yRWFjaChhcmcgPT4ge1xuICAgICAgICAgICAgaWYgKGFyZy50eXBlID09PSAnbicpIHtcbiAgICAgICAgICAgICAgICBhcmcudmFsdWUgPSBwcm94eS5pZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNpemUgKz0gYXJnLnNpemU7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9jb25uZWN0aW9uLm1hcnNoYWxsTXNnKGlkLCBvcGNvZGUsIHNpemUsIGFyZ3NBcnJheSk7XG4gICAgICAgIHJldHVybiBwcm94eTtcbiAgICB9XG4gICAgX21hcnNoYWxsKGlkLCBvcGNvZGUsIGFyZ3NBcnJheSkge1xuICAgICAgICAvLyBkZXRlcm1pbmUgcmVxdWlyZWQgd2lyZSBtZXNzYWdlIGxlbmd0aFxuICAgICAgICBsZXQgc2l6ZSA9IDQgKyAyICsgMjsgLy8gaWQrc2l6ZStvcGNvZGVcbiAgICAgICAgYXJnc0FycmF5LmZvckVhY2goYXJnID0+IHNpemUgKz0gYXJnLnNpemUpO1xuICAgICAgICB0aGlzLl9jb25uZWN0aW9uLm1hcnNoYWxsTXNnKGlkLCBvcGNvZGUsIHNpemUsIGFyZ3NBcnJheSk7XG4gICAgfVxufVxuLy8gYy9wIHRvIGJyZWFrIGNpcmN1bGFyIGRlcC5cbmNsYXNzIFdsRGlzcGxheVByb3h5IGV4dGVuZHMgUHJveHkge1xuICAgIGNvbnN0cnVjdG9yKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKSB7XG4gICAgICAgIHN1cGVyKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKTtcbiAgICB9XG4gICAgc3luYygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hcnNoYWxsQ29uc3RydWN0b3IodGhpcy5pZCwgMCwgV2xDYWxsYmFja1Byb3h5LCBbbmV3T2JqZWN0KCldKTtcbiAgICB9XG4gICAgZ2V0UmVnaXN0cnkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXJzaGFsbENvbnN0cnVjdG9yKHRoaXMuaWQsIDEsIFdsUmVnaXN0cnlQcm94eSwgW25ld09iamVjdCgpXSk7XG4gICAgfVxuICAgIFswXShtZXNzYWdlKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHlpZWxkICgoX2EgPSB0aGlzLmxpc3RlbmVyKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZXJyb3IobyhtZXNzYWdlLCB0aGlzLl9jb25uZWN0aW9uKSwgdShtZXNzYWdlKSwgcyhtZXNzYWdlKSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgWzFdKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgKChfYSA9IHRoaXMubGlzdGVuZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5kZWxldGVJZCh1KG1lc3NhZ2UpKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbi8vIGMvcCB0byBicmVhayBjaXJjdWxhciBkZXAuXG5jbGFzcyBXbFJlZ2lzdHJ5UHJveHkgZXh0ZW5kcyBQcm94eSB7XG4gICAgY29uc3RydWN0b3IoZGlzcGxheSwgY29ubmVjdGlvbiwgaWQpIHtcbiAgICAgICAgc3VwZXIoZGlzcGxheSwgY29ubmVjdGlvbiwgaWQpO1xuICAgIH1cbiAgICBiaW5kKG5hbWUsIGludGVyZmFjZV8sIHByb3h5Q2xhc3MsIHZlcnNpb24pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hcnNoYWxsQ29uc3RydWN0b3IodGhpcy5pZCwgMCwgcHJveHlDbGFzcywgW3VpbnQobmFtZSksIHN0cmluZyhpbnRlcmZhY2VfKSwgdWludCh2ZXJzaW9uKSwgbmV3T2JqZWN0KCldKTtcbiAgICB9XG4gICAgWzBdKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgKChfYSA9IHRoaXMubGlzdGVuZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nbG9iYWwodShtZXNzYWdlKSwgcyhtZXNzYWdlKSwgdShtZXNzYWdlKSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgWzFdKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgKChfYSA9IHRoaXMubGlzdGVuZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nbG9iYWxSZW1vdmUodShtZXNzYWdlKSkpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4vLyBjL3AgdG8gYnJlYWsgY2lyY3VsYXIgZGVwLlxuY2xhc3MgV2xDYWxsYmFja1Byb3h5IGV4dGVuZHMgUHJveHkge1xuICAgIGNvbnN0cnVjdG9yKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKSB7XG4gICAgICAgIHN1cGVyKGRpc3BsYXksIGNvbm5lY3Rpb24sIGlkKTtcbiAgICB9XG4gICAgWzBdKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgKChfYSA9IHRoaXMubGlzdGVuZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5kb25lKHUobWVzc2FnZSkpKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIERpc3BsYXlJbXBsIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25uZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuX3JlY3ljbGVkSWRzID0gW107XG4gICAgICAgIHRoaXMuX2xhc3RJZCA9IDE7XG4gICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSBjb25uZWN0aW9uO1xuICAgICAgICB0aGlzLl9kaXNwbGF5UHJveHkgPSBuZXcgV2xEaXNwbGF5UHJveHkodGhpcywgdGhpcy5fY29ubmVjdGlvbiwgMSk7XG4gICAgICAgIHRoaXMuX2Rlc3Ryb3lQcm9taXNlID0gbmV3IFByb21pc2UoKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2Rlc3Ryb3lSZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgICAgICAgIHRoaXMuX2Rlc3Ryb3lSZWplY3QgPSByZWplY3Q7XG4gICAgICAgIH0pKTtcbiAgICAgICAgdGhpcy5fZGlzcGxheVByb3h5Lmxpc3RlbmVyID0ge1xuICAgICAgICAgICAgZGVsZXRlSWQ6IChpZCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlY3ljbGVkSWRzLnB1c2goaWQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiAocHJveHksIGNvZGUsIG1lc3NhZ2UpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm90b2NvbEVycm9yKHByb3h5LCBjb2RlLCBtZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgY2xvc2UoKSB7XG4gICAgICAgIGlmICh0aGlzLl9jb25uZWN0aW9uLmNsb3NlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uY2xvc2UoKTtcbiAgICAgICAgdGhpcy5fZGVzdHJveVJlc29sdmUoKTtcbiAgICB9XG4gICAgX3Byb3RvY29sRXJyb3IocHJveHksIGNvZGUsIG1lc3NhZ2UpIHtcbiAgICAgICAgaWYgKHRoaXMuX2Nvbm5lY3Rpb24uY2xvc2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5jbG9zZSgpO1xuICAgICAgICB0aGlzLl9kZXN0cm95UmVqZWN0KG5ldyBFcnJvcihgUHJvdG9jb2wgZXJyb3IuIHR5cGU6ICR7cHJveHkuY29uc3RydWN0b3IubmFtZX0sIGlkOiAke3Byb3h5LmlkfSwgY29kZTogJHtjb2RlfSwgbWVzc2FnZTogJHttZXNzYWdlfWApKTtcbiAgICB9XG4gICAgb25DbG9zZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rlc3Ryb3lQcm9taXNlO1xuICAgIH1cbiAgICBnZXRSZWdpc3RyeSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rpc3BsYXlQcm94eS5nZXRSZWdpc3RyeSgpO1xuICAgIH1cbiAgICBnZW5lcmF0ZU5leHRJZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3JlY3ljbGVkSWRzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlY3ljbGVkSWRzLnNoaWZ0KCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gKyt0aGlzLl9sYXN0SWQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3luYygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgY29uc3Qgd2xDYWxsYmFja1Byb3h5ID0gdGhpcy5fZGlzcGxheVByb3h5LnN5bmMoKTtcbiAgICAgICAgICAgIHdsQ2FsbGJhY2tQcm94eS5saXN0ZW5lciA9IHtcbiAgICAgICAgICAgICAgICBkb25lOiAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB3bENhbGxiYWNrUHJveHkuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmbHVzaCgpIHtcbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5mbHVzaCgpO1xuICAgIH1cbn1cbi8vIFRPRE8gVGhpcyBpcyBjdXJyZW50bHkgYSBsaXRlcmFsIGNvcHkgb2YgdGhlIHNlcnZlciBpbXBsZW1lbnRhdGlvbi4gRG8gYWxsIHVzZSBjYXNlcyBtYXRjaCAxbzEgYW5kIGNhbiB3ZSB1c2UgYSBzaW5nbGUgY29tbW9uIGNvZGUgYmFzZSBiZXR3ZWVuIGNsaWVudCAmIHNlcnZlciBmb3IgV2ViRlM/XG5leHBvcnQgY2xhc3MgV2ViRlMge1xuICAgIGNvbnN0cnVjdG9yKGZkRG9tYWluVVVJRCkge1xuICAgICAgICB0aGlzLl93ZWJGRHMgPSB7fTtcbiAgICAgICAgdGhpcy5fbmV4dEZEID0gMDtcbiAgICAgICAgdGhpcy5fZmREb21haW5VVUlEID0gZmREb21haW5VVUlEO1xuICAgIH1cbiAgICBzdGF0aWMgY3JlYXRlKGZkRG9tYWluVVVJRCkge1xuICAgICAgICByZXR1cm4gbmV3IFdlYkZTKGZkRG9tYWluVVVJRCk7XG4gICAgfVxuICAgIGZyb21BcnJheUJ1ZmZlcihhcnJheUJ1ZmZlcikge1xuICAgICAgICBjb25zdCBmZCA9IHRoaXMuX25leHRGRCsrO1xuICAgICAgICBjb25zdCB0eXBlID0gJ0FycmF5QnVmZmVyJztcbiAgICAgICAgY29uc3Qgd2ViRmRVUkwgPSBuZXcgVVJMKGBjbGllbnQ6Ly9gKTtcbiAgICAgICAgd2ViRmRVUkwuc2VhcmNoUGFyYW1zLmFwcGVuZCgnZmQnLCBgJHtmZH1gKTtcbiAgICAgICAgd2ViRmRVUkwuc2VhcmNoUGFyYW1zLmFwcGVuZCgndHlwZScsIHR5cGUpO1xuICAgICAgICB3ZWJGZFVSTC5zZWFyY2hQYXJhbXMuYXBwZW5kKCdjbGllbnRJZCcsIHRoaXMuX2ZkRG9tYWluVVVJRCk7XG4gICAgICAgIGNvbnN0IHdlYkZEID0gbmV3IFdlYkZEKGZkLCB0eXBlLCB3ZWJGZFVSTCwgKCkgPT4gUHJvbWlzZS5yZXNvbHZlKGFycmF5QnVmZmVyKSwgKCkgPT4ge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3dlYkZEc1tmZF07XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl93ZWJGRHNbZmRdID0gd2ViRkQ7XG4gICAgICAgIHJldHVybiB3ZWJGRDtcbiAgICB9XG4gICAgZnJvbUltYWdlQml0bWFwKGltYWdlQml0bWFwKSB7XG4gICAgICAgIGNvbnN0IGZkID0gdGhpcy5fbmV4dEZEKys7XG4gICAgICAgIGNvbnN0IHR5cGUgPSAnSW1hZ2VCaXRtYXAnO1xuICAgICAgICBjb25zdCB3ZWJGZFVSTCA9IG5ldyBVUkwoYGNsaWVudDovL2ApO1xuICAgICAgICB3ZWJGZFVSTC5zZWFyY2hQYXJhbXMuYXBwZW5kKCdmZCcsIGAke2ZkfWApO1xuICAgICAgICB3ZWJGZFVSTC5zZWFyY2hQYXJhbXMuYXBwZW5kKCd0eXBlJywgdHlwZSk7XG4gICAgICAgIHdlYkZkVVJMLnNlYXJjaFBhcmFtcy5hcHBlbmQoJ2NsaWVudElkJywgdGhpcy5fZmREb21haW5VVUlEKTtcbiAgICAgICAgY29uc3Qgd2ViRkQgPSBuZXcgV2ViRkQoZmQsIHR5cGUsIHdlYkZkVVJMLCAoKSA9PiBQcm9taXNlLnJlc29sdmUoaW1hZ2VCaXRtYXApLCAoKSA9PiB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fd2ViRkRzW2ZkXTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3dlYkZEc1tmZF0gPSB3ZWJGRDtcbiAgICAgICAgcmV0dXJuIHdlYkZEO1xuICAgIH1cbiAgICBmcm9tT2Zmc2NyZWVuQ2FudmFzKG9mZnNjcmVlbkNhbnZhcykge1xuICAgICAgICBjb25zdCBmZCA9IHRoaXMuX25leHRGRCsrO1xuICAgICAgICBjb25zdCB0eXBlID0gJ09mZnNjcmVlbkNhbnZhcyc7XG4gICAgICAgIGNvbnN0IHdlYkZkVVJMID0gbmV3IFVSTChgY2xpZW50Oi8vYCk7XG4gICAgICAgIHdlYkZkVVJMLnNlYXJjaFBhcmFtcy5hcHBlbmQoJ2ZkJywgYCR7ZmR9YCk7XG4gICAgICAgIHdlYkZkVVJMLnNlYXJjaFBhcmFtcy5hcHBlbmQoJ3R5cGUnLCB0eXBlKTtcbiAgICAgICAgd2ViRmRVUkwuc2VhcmNoUGFyYW1zLmFwcGVuZCgnY2xpZW50SWQnLCB0aGlzLl9mZERvbWFpblVVSUQpO1xuICAgICAgICBjb25zdCB3ZWJGRCA9IG5ldyBXZWJGRChmZCwgdHlwZSwgd2ViRmRVUkwsICgpID0+IFByb21pc2UucmVzb2x2ZShvZmZzY3JlZW5DYW52YXMpLCAoKSA9PiB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fd2ViRkRzW2ZkXTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3dlYkZEc1tmZF0gPSB3ZWJGRDtcbiAgICAgICAgcmV0dXJuIHdlYkZEO1xuICAgIH1cbiAgICAvLyBUT0RPIGZyb21NZXNzYWdlUG9ydFxuICAgIGdldFdlYkZEKGZkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93ZWJGRHNbZmRdO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXdlc3RmaWVsZC1ydW50aW1lLWNsaWVudC5qcy5tYXAiLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbi8qXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMjAgRXJpayBEZSBSaWpja2VcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4gIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuICBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuU09GVFdBUkUuXG4qL1xuY29uc3QgdGV4dERlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoJ3V0ZjgnKTtcbmV4cG9ydCBjbGFzcyBXbE9iamVjdCB7XG4gICAgY29uc3RydWN0b3IoaWQpIHtcbiAgICAgICAgdGhpcy5fZGVzdHJveVByb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuX2Rlc3Ryb3lSZXNvbHZlciA9IHJlc29sdmUpO1xuICAgICAgICB0aGlzLl9kZXN0cm95TGlzdGVuZXJzID0gW107XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5fZGVzdHJveVByb21pc2UudGhlbigoKSA9PiB0aGlzLl9kZXN0cm95TGlzdGVuZXJzLmZvckVhY2goZGVzdHJveUxpc3RlbmVyID0+IGRlc3Ryb3lMaXN0ZW5lcih0aGlzKSkpO1xuICAgIH1cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLl9kZXN0cm95UmVzb2x2ZXIoKTtcbiAgICB9XG4gICAgYWRkRGVzdHJveUxpc3RlbmVyKGRlc3Ryb3lMaXN0ZW5lcikge1xuICAgICAgICB0aGlzLl9kZXN0cm95TGlzdGVuZXJzLnB1c2goZGVzdHJveUxpc3RlbmVyKTtcbiAgICB9XG4gICAgcmVtb3ZlRGVzdHJveUxpc3RlbmVyKGRlc3Ryb3lMaXN0ZW5lcikge1xuICAgICAgICB0aGlzLl9kZXN0cm95TGlzdGVuZXJzID0gdGhpcy5fZGVzdHJveUxpc3RlbmVycy5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0gIT09IGRlc3Ryb3lMaXN0ZW5lcik7XG4gICAgfVxuICAgIG9uRGVzdHJveSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rlc3Ryb3lQcm9taXNlO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBGaXhlZCB7XG4gICAgLyoqXG4gICAgICogdXNlIHBhcnNlRml4ZWQgaW5zdGVhZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfXJhd1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHJhdykge1xuICAgICAgICB0aGlzLl9yYXcgPSByYXc7XG4gICAgfVxuICAgIHN0YXRpYyBwYXJzZShkYXRhKSB7XG4gICAgICAgIHJldHVybiBuZXcgRml4ZWQoKGRhdGEgKiAyNTYuMCkgPj4gMCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlcHJlc2VudCBmaXhlZCBhcyBhIHNpZ25lZCAyNC1iaXQgaW50ZWdlci5cbiAgICAgKlxuICAgICAqL1xuICAgIGFzSW50KCkge1xuICAgICAgICByZXR1cm4gKCh0aGlzLl9yYXcgLyAyNTYuMCkgPj4gMCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlcHJlc2VudCBmaXhlZCBhcyBhIHNpZ25lZCAyNC1iaXQgbnVtYmVyIHdpdGggYW4gOC1iaXQgZnJhY3Rpb25hbCBwYXJ0LlxuICAgICAqXG4gICAgICovXG4gICAgYXNEb3VibGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yYXcgLyAyNTYuMDtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgV2ViRkQge1xuICAgIGNvbnN0cnVjdG9yKGZkLCBmZFR5cGUsIGZkVVJMLCBvbkdldFRyYW5zZmVyYWJsZSwgb25DbG9zZSkge1xuICAgICAgICB0aGlzLmZkID0gZmQ7XG4gICAgICAgIHRoaXMudHlwZSA9IGZkVHlwZTtcbiAgICAgICAgdGhpcy51cmwgPSBmZFVSTDtcbiAgICAgICAgdGhpcy5fb25HZXRUcmFuc2ZlcmFibGUgPSBvbkdldFRyYW5zZmVyYWJsZTtcbiAgICAgICAgdGhpcy5fb25DbG9zZSA9IG9uQ2xvc2U7XG4gICAgfVxuICAgIGdldFRyYW5zZmVyYWJsZSgpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHJldHVybiB5aWVsZCB0aGlzLl9vbkdldFRyYW5zZmVyYWJsZSh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNsb3NlKCkge1xuICAgICAgICB0aGlzLl9vbkNsb3NlKHRoaXMpO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiB1aW50KGFyZykge1xuICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlOiBhcmcsXG4gICAgICAgIHR5cGU6ICd1JyxcbiAgICAgICAgc2l6ZTogNCxcbiAgICAgICAgb3B0aW9uYWw6IGZhbHNlLFxuICAgICAgICBfbWFyc2hhbGxBcmc6IGZ1bmN0aW9uICh3aXJlTXNnKSB7XG4gICAgICAgICAgICBuZXcgVWludDMyQXJyYXkod2lyZU1zZy5idWZmZXIsIHdpcmVNc2cuYnVmZmVyT2Zmc2V0LCAxKVswXSA9IGFyZztcbiAgICAgICAgICAgIHdpcmVNc2cuYnVmZmVyT2Zmc2V0ICs9IHRoaXMuc2l6ZTtcbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gZmlsZURlc2NyaXB0b3IoYXJnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWU6IGFyZyxcbiAgICAgICAgdHlwZTogJ2gnLFxuICAgICAgICBzaXplOiAwLFxuICAgICAgICBvcHRpb25hbDogZmFsc2UsXG4gICAgICAgIF9tYXJzaGFsbEFyZzogZnVuY3Rpb24gKHdpcmVNc2cpIHtcbiAgICAgICAgICAgIHdpcmVNc2cuZmRzLnB1c2goYXJnKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gaW50KGFyZykge1xuICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlOiBhcmcsXG4gICAgICAgIHR5cGU6ICdpJyxcbiAgICAgICAgc2l6ZTogNCxcbiAgICAgICAgb3B0aW9uYWw6IGZhbHNlLFxuICAgICAgICBfbWFyc2hhbGxBcmc6IGZ1bmN0aW9uICh3aXJlTXNnKSB7XG4gICAgICAgICAgICBuZXcgSW50MzJBcnJheSh3aXJlTXNnLmJ1ZmZlciwgd2lyZU1zZy5idWZmZXJPZmZzZXQsIDEpWzBdID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgIHdpcmVNc2cuYnVmZmVyT2Zmc2V0ICs9IHRoaXMuc2l6ZTtcbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gZml4ZWQoYXJnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWU6IGFyZyxcbiAgICAgICAgdHlwZTogJ2YnLFxuICAgICAgICBzaXplOiA0LFxuICAgICAgICBvcHRpb25hbDogZmFsc2UsXG4gICAgICAgIF9tYXJzaGFsbEFyZzogZnVuY3Rpb24gKHdpcmVNc2cpIHtcbiAgICAgICAgICAgIG5ldyBJbnQzMkFycmF5KHdpcmVNc2cuYnVmZmVyLCB3aXJlTXNnLmJ1ZmZlck9mZnNldCwgMSlbMF0gPSB0aGlzLnZhbHVlLl9yYXc7XG4gICAgICAgICAgICB3aXJlTXNnLmJ1ZmZlck9mZnNldCArPSB0aGlzLnNpemU7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIG9iamVjdChhcmcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZTogYXJnLFxuICAgICAgICB0eXBlOiAnbycsXG4gICAgICAgIHNpemU6IDQsXG4gICAgICAgIG9wdGlvbmFsOiBmYWxzZSxcbiAgICAgICAgX21hcnNoYWxsQXJnOiBmdW5jdGlvbiAod2lyZU1zZykge1xuICAgICAgICAgICAgbmV3IFVpbnQzMkFycmF5KHdpcmVNc2cuYnVmZmVyLCB3aXJlTXNnLmJ1ZmZlck9mZnNldCwgMSlbMF0gPSB0aGlzLnZhbHVlLmlkO1xuICAgICAgICAgICAgd2lyZU1zZy5idWZmZXJPZmZzZXQgKz0gdGhpcy5zaXplO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBvYmplY3RPcHRpb25hbChhcmcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZTogYXJnLFxuICAgICAgICB0eXBlOiAnbycsXG4gICAgICAgIHNpemU6IDQsXG4gICAgICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgICAgICBfbWFyc2hhbGxBcmc6IGZ1bmN0aW9uICh3aXJlTXNnKSB7XG4gICAgICAgICAgICBuZXcgVWludDMyQXJyYXkod2lyZU1zZy5idWZmZXIsIHdpcmVNc2cuYnVmZmVyT2Zmc2V0LCAxKVswXSA9ICh0aGlzLnZhbHVlID09PSB1bmRlZmluZWQgPyAwIDogdGhpcy52YWx1ZS5pZCk7XG4gICAgICAgICAgICB3aXJlTXNnLmJ1ZmZlck9mZnNldCArPSB0aGlzLnNpemU7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIG5ld09iamVjdCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZTogMCxcbiAgICAgICAgdHlwZTogJ24nLFxuICAgICAgICBzaXplOiA0LFxuICAgICAgICBvcHRpb25hbDogZmFsc2UsXG4gICAgICAgIF9tYXJzaGFsbEFyZzogZnVuY3Rpb24gKHdpcmVNc2cpIHtcbiAgICAgICAgICAgIG5ldyBVaW50MzJBcnJheSh3aXJlTXNnLmJ1ZmZlciwgd2lyZU1zZy5idWZmZXJPZmZzZXQsIDEpWzBdID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgIHdpcmVNc2cuYnVmZmVyT2Zmc2V0ICs9IHRoaXMuc2l6ZTtcbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gc3RyaW5nKGFyZykge1xuICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlOiBgJHthcmd9XFwwYCxcbiAgICAgICAgdHlwZTogJ3MnLFxuICAgICAgICBzaXplOiA0ICsgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIGZhbmN5IGxvZ2ljIHRvIGNhbGN1bGF0ZSBzaXplIHdpdGggcGFkZGluZyB0byBhIG11bHRpcGxlIG9mIDQgYnl0ZXMgKGludCkuXG4gICAgICAgICAgICAvLyBsZW5ndGgrMSBmb3IgbnVsbCB0ZXJtaW5hdG9yXG4gICAgICAgICAgICByZXR1cm4gKGFyZy5sZW5ndGggKyAxICsgMykgJiB+MztcbiAgICAgICAgfSkoKSxcbiAgICAgICAgb3B0aW9uYWw6IGZhbHNlLFxuICAgICAgICBfbWFyc2hhbGxBcmc6IGZ1bmN0aW9uICh3aXJlTXNnKSB7XG4gICAgICAgICAgICBuZXcgVWludDMyQXJyYXkod2lyZU1zZy5idWZmZXIsIHdpcmVNc2cuYnVmZmVyT2Zmc2V0LCAxKVswXSA9IHRoaXMudmFsdWUubGVuZ3RoO1xuICAgICAgICAgICAgY29uc3Qgc3RyTGVuID0gdGhpcy52YWx1ZS5sZW5ndGg7XG4gICAgICAgICAgICBjb25zdCBidWY4ID0gbmV3IFVpbnQ4QXJyYXkod2lyZU1zZy5idWZmZXIsIHdpcmVNc2cuYnVmZmVyT2Zmc2V0ICsgNCwgc3RyTGVuKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyTGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBidWY4W2ldID0gdGhpcy52YWx1ZVtpXS5jaGFyQ29kZUF0KDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2lyZU1zZy5idWZmZXJPZmZzZXQgKz0gdGhpcy5zaXplO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzdHJpbmdPcHRpb25hbChhcmcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZTogYXJnID8gYCR7YXJnfVxcMGAgOiB1bmRlZmluZWQsXG4gICAgICAgIHR5cGU6ICdzJyxcbiAgICAgICAgc2l6ZTogNCArIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoYXJnID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGZhbmN5IGxvZ2ljIHRvIGNhbGN1bGF0ZSBzaXplIHdpdGggcGFkZGluZyB0byBhIG11bHRpcGxlIG9mIDQgYnl0ZXMgKGludCkuXG4gICAgICAgICAgICAgICAgLy8gbGVuZ3RoKzEgZm9yIG51bGwgdGVybWluYXRvclxuICAgICAgICAgICAgICAgIHJldHVybiAoYXJnLmxlbmd0aCArIDEgKyAzKSAmIH4zO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSgpLFxuICAgICAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICAgICAgX21hcnNoYWxsQXJnOiBmdW5jdGlvbiAod2lyZU1zZykge1xuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG5ldyBVaW50MzJBcnJheSh3aXJlTXNnLmJ1ZmZlciwgd2lyZU1zZy5idWZmZXJPZmZzZXQsIDEpWzBdID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ldyBVaW50MzJBcnJheSh3aXJlTXNnLmJ1ZmZlciwgd2lyZU1zZy5idWZmZXJPZmZzZXQsIDEpWzBdID0gdGhpcy52YWx1ZS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RyTGVuID0gdGhpcy52YWx1ZS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgY29uc3QgYnVmOCA9IG5ldyBVaW50OEFycmF5KHdpcmVNc2cuYnVmZmVyLCB3aXJlTXNnLmJ1ZmZlck9mZnNldCArIDQsIHN0ckxlbik7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHJMZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBidWY4W2ldID0gdGhpcy52YWx1ZVtpXS5jaGFyQ29kZUF0KDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdpcmVNc2cuYnVmZmVyT2Zmc2V0ICs9IHRoaXMuc2l6ZTtcbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gYXJyYXkoYXJnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWU6IGFyZyxcbiAgICAgICAgdHlwZTogJ2EnLFxuICAgICAgICBzaXplOiA0ICsgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIGZhbmN5IGxvZ2ljIHRvIGNhbGN1bGF0ZSBzaXplIHdpdGggcGFkZGluZyB0byBhIG11bHRpcGxlIG9mIDQgYnl0ZXMgKGludCkuXG4gICAgICAgICAgICByZXR1cm4gKGFyZy5ieXRlTGVuZ3RoICsgMykgJiB+MztcbiAgICAgICAgfSkoKSxcbiAgICAgICAgb3B0aW9uYWw6IGZhbHNlLFxuICAgICAgICBfbWFyc2hhbGxBcmc6IGZ1bmN0aW9uICh3aXJlTXNnKSB7XG4gICAgICAgICAgICBuZXcgVWludDMyQXJyYXkod2lyZU1zZy5idWZmZXIsIHdpcmVNc2cuYnVmZmVyT2Zmc2V0LCAxKVswXSA9IHRoaXMudmFsdWUuYnl0ZUxlbmd0aDtcbiAgICAgICAgICAgIGNvbnN0IGJ5dGVMZW5ndGggPSB0aGlzLnZhbHVlLmJ5dGVMZW5ndGg7XG4gICAgICAgICAgICBuZXcgVWludDhBcnJheSh3aXJlTXNnLmJ1ZmZlciwgd2lyZU1zZy5idWZmZXJPZmZzZXQgKyA0LCBieXRlTGVuZ3RoKS5zZXQobmV3IFVpbnQ4QXJyYXkodGhpcy52YWx1ZS5idWZmZXIsIDAsIGJ5dGVMZW5ndGgpKTtcbiAgICAgICAgICAgIHdpcmVNc2cuYnVmZmVyT2Zmc2V0ICs9IHRoaXMuc2l6ZTtcbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gYXJyYXlPcHRpb25hbChhcmcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZTogYXJnLFxuICAgICAgICB0eXBlOiAnYScsXG4gICAgICAgIHNpemU6IDQgKyAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGFyZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBmYW5jeSBsb2dpYyB0byBjYWxjdWxhdGUgc2l6ZSB3aXRoIHBhZGRpbmcgdG8gYSBtdWx0aXBsZSBvZiA0IGJ5dGVzIChpbnQpLlxuICAgICAgICAgICAgICAgIHJldHVybiAoYXJnLmJ5dGVMZW5ndGggKyAzKSAmIH4zO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSgpLFxuICAgICAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICAgICAgX21hcnNoYWxsQXJnOiBmdW5jdGlvbiAod2lyZU1zZykge1xuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG5ldyBVaW50MzJBcnJheSh3aXJlTXNnLmJ1ZmZlciwgd2lyZU1zZy5idWZmZXJPZmZzZXQsIDEpWzBdID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ldyBVaW50MzJBcnJheSh3aXJlTXNnLmJ1ZmZlciwgd2lyZU1zZy5idWZmZXJPZmZzZXQsIDEpWzBdID0gdGhpcy52YWx1ZS5ieXRlTGVuZ3RoO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJ5dGVMZW5ndGggPSB0aGlzLnZhbHVlLmJ5dGVMZW5ndGg7XG4gICAgICAgICAgICAgICAgbmV3IFVpbnQ4QXJyYXkod2lyZU1zZy5idWZmZXIsIHdpcmVNc2cuYnVmZmVyT2Zmc2V0ICsgNCwgYnl0ZUxlbmd0aCkuc2V0KG5ldyBVaW50OEFycmF5KHRoaXMudmFsdWUuYnVmZmVyLCAwLCBieXRlTGVuZ3RoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aXJlTXNnLmJ1ZmZlck9mZnNldCArPSB0aGlzLnNpemU7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZnVuY3Rpb24gY2hlY2tNZXNzYWdlU2l6ZShtZXNzYWdlLCBjb25zdW1wdGlvbikge1xuICAgIGlmIChtZXNzYWdlLmNvbnN1bWVkICsgY29uc3VtcHRpb24gPiBtZXNzYWdlLnNpemUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBSZXF1ZXN0IHRvbyBzaG9ydC5gKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG1lc3NhZ2UuY29uc3VtZWQgKz0gY29uc3VtcHRpb247XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIHUobWVzc2FnZSkge1xuICAgIGNoZWNrTWVzc2FnZVNpemUobWVzc2FnZSwgNCk7XG4gICAgcmV0dXJuIG1lc3NhZ2UuYnVmZmVyW21lc3NhZ2UuYnVmZmVyT2Zmc2V0KytdO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGkobWVzc2FnZSkge1xuICAgIGNoZWNrTWVzc2FnZVNpemUobWVzc2FnZSwgNCk7XG4gICAgY29uc3QgYXJnID0gbmV3IEludDMyQXJyYXkobWVzc2FnZS5idWZmZXIuYnVmZmVyLCBtZXNzYWdlLmJ1ZmZlci5ieXRlT2Zmc2V0ICsgKG1lc3NhZ2UuYnVmZmVyT2Zmc2V0ICogVWludDMyQXJyYXkuQllURVNfUEVSX0VMRU1FTlQpLCAxKVswXTtcbiAgICBtZXNzYWdlLmJ1ZmZlck9mZnNldCArPSAxO1xuICAgIHJldHVybiBhcmc7XG59XG5leHBvcnQgZnVuY3Rpb24gZihtZXNzYWdlKSB7XG4gICAgY2hlY2tNZXNzYWdlU2l6ZShtZXNzYWdlLCA0KTtcbiAgICBjb25zdCBhcmcgPSBuZXcgSW50MzJBcnJheShtZXNzYWdlLmJ1ZmZlci5idWZmZXIsIG1lc3NhZ2UuYnVmZmVyLmJ5dGVPZmZzZXQgKyAobWVzc2FnZS5idWZmZXJPZmZzZXQgKiBVaW50MzJBcnJheS5CWVRFU19QRVJfRUxFTUVOVCksIDEpWzBdO1xuICAgIG1lc3NhZ2UuYnVmZmVyT2Zmc2V0ICs9IDE7XG4gICAgcmV0dXJuIG5ldyBGaXhlZChhcmcgPj4gMCk7XG59XG5leHBvcnQgZnVuY3Rpb24gb09wdGlvbmFsKG1lc3NhZ2UsIGNvbm5lY3Rpb24pIHtcbiAgICBjaGVja01lc3NhZ2VTaXplKG1lc3NhZ2UsIDQpO1xuICAgIGNvbnN0IGFyZyA9IG1lc3NhZ2UuYnVmZmVyW21lc3NhZ2UuYnVmZmVyT2Zmc2V0KytdO1xuICAgIGlmIChhcmcgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNvbnN0IHdsT2JqZWN0ID0gY29ubmVjdGlvbi53bE9iamVjdHNbYXJnXTtcbiAgICAgICAgaWYgKHdsT2JqZWN0KSB7XG4gICAgICAgICAgICAvLyBUT0RPIGFkZCBhbiBleHRyYSBjaGVjayB0byBtYWtlIHN1cmUgd2UgY2FzdCBjb3JyZWN0bHlcbiAgICAgICAgICAgIHJldHVybiB3bE9iamVjdDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBvYmplY3QgaWQgJHthcmd9YCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gbyhtZXNzYWdlLCBjb25uZWN0aW9uKSB7XG4gICAgY2hlY2tNZXNzYWdlU2l6ZShtZXNzYWdlLCA0KTtcbiAgICBjb25zdCBhcmcgPSBtZXNzYWdlLmJ1ZmZlclttZXNzYWdlLmJ1ZmZlck9mZnNldCsrXTtcbiAgICBjb25zdCB3bE9iamVjdCA9IGNvbm5lY3Rpb24ud2xPYmplY3RzW2FyZ107XG4gICAgaWYgKHdsT2JqZWN0KSB7XG4gICAgICAgIC8vIFRPRE8gYWRkIGFuIGV4dHJhIGNoZWNrIHRvIG1ha2Ugc3VyZSB3ZSBjYXN0IGNvcnJlY3RseVxuICAgICAgICByZXR1cm4gd2xPYmplY3Q7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gb2JqZWN0IGlkICR7YXJnfWApO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBuKG1lc3NhZ2UpIHtcbiAgICBjaGVja01lc3NhZ2VTaXplKG1lc3NhZ2UsIDQpO1xuICAgIHJldHVybiBtZXNzYWdlLmJ1ZmZlclttZXNzYWdlLmJ1ZmZlck9mZnNldCsrXTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzT3B0aW9uYWwobWVzc2FnZSkge1xuICAgIGNoZWNrTWVzc2FnZVNpemUobWVzc2FnZSwgNCk7XG4gICAgY29uc3Qgc3RyaW5nU2l6ZSA9IG1lc3NhZ2UuYnVmZmVyW21lc3NhZ2UuYnVmZmVyT2Zmc2V0KytdO1xuICAgIGlmIChzdHJpbmdTaXplID09PSAwKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25zdCBhbGlnbmVkU2l6ZSA9ICgoc3RyaW5nU2l6ZSArIDMpICYgfjMpO1xuICAgICAgICBjaGVja01lc3NhZ2VTaXplKG1lc3NhZ2UsIGFsaWduZWRTaXplKTtcbiAgICAgICAgLy8gc2l6ZSAtMSB0byBlbGltaW5hdGUgbnVsbCBieXRlXG4gICAgICAgIGNvbnN0IGJ5dGVBcnJheSA9IG5ldyBVaW50OEFycmF5KG1lc3NhZ2UuYnVmZmVyLmJ1ZmZlciwgbWVzc2FnZS5idWZmZXIuYnl0ZU9mZnNldCArIChtZXNzYWdlLmJ1ZmZlck9mZnNldCAqIFVpbnQzMkFycmF5LkJZVEVTX1BFUl9FTEVNRU5UKSwgc3RyaW5nU2l6ZSAtIDEpO1xuICAgICAgICBtZXNzYWdlLmJ1ZmZlck9mZnNldCArPSAoYWxpZ25lZFNpemUgLyA0KTtcbiAgICAgICAgcmV0dXJuIHRleHREZWNvZGVyLmRlY29kZShieXRlQXJyYXkpO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBzKG1lc3NhZ2UpIHtcbiAgICBjaGVja01lc3NhZ2VTaXplKG1lc3NhZ2UsIDQpO1xuICAgIGNvbnN0IHN0cmluZ1NpemUgPSBtZXNzYWdlLmJ1ZmZlclttZXNzYWdlLmJ1ZmZlck9mZnNldCsrXTtcbiAgICBjb25zdCBhbGlnbmVkU2l6ZSA9ICgoc3RyaW5nU2l6ZSArIDMpICYgfjMpO1xuICAgIGNoZWNrTWVzc2FnZVNpemUobWVzc2FnZSwgYWxpZ25lZFNpemUpO1xuICAgIC8vIHNpemUgLTEgdG8gZWxpbWluYXRlIG51bGwgYnl0ZVxuICAgIGNvbnN0IGJ5dGVBcnJheSA9IG5ldyBVaW50OEFycmF5KG1lc3NhZ2UuYnVmZmVyLmJ1ZmZlciwgbWVzc2FnZS5idWZmZXIuYnl0ZU9mZnNldCArIChtZXNzYWdlLmJ1ZmZlck9mZnNldCAqIFVpbnQzMkFycmF5LkJZVEVTX1BFUl9FTEVNRU5UKSwgc3RyaW5nU2l6ZSAtIDEpO1xuICAgIG1lc3NhZ2UuYnVmZmVyT2Zmc2V0ICs9IChhbGlnbmVkU2l6ZSAvIDQpO1xuICAgIHJldHVybiB0ZXh0RGVjb2Rlci5kZWNvZGUoYnl0ZUFycmF5KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhT3B0aW9uYWwobWVzc2FnZSwgb3B0aW9uYWwpIHtcbiAgICBjaGVja01lc3NhZ2VTaXplKG1lc3NhZ2UsIDQpO1xuICAgIGNvbnN0IGFycmF5U2l6ZSA9IG1lc3NhZ2UuYnVmZmVyW21lc3NhZ2UuYnVmZmVyT2Zmc2V0KytdO1xuICAgIGlmIChhcnJheVNpemUgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNvbnN0IGFsaWduZWRTaXplID0gKChhcnJheVNpemUgKyAzKSAmIH4zKTtcbiAgICAgICAgY2hlY2tNZXNzYWdlU2l6ZShtZXNzYWdlLCBhbGlnbmVkU2l6ZSk7XG4gICAgICAgIGNvbnN0IGFyZyA9IG1lc3NhZ2UuYnVmZmVyLmJ1ZmZlci5zbGljZShtZXNzYWdlLmJ1ZmZlci5ieXRlT2Zmc2V0ICsgKG1lc3NhZ2UuYnVmZmVyT2Zmc2V0ICogVWludDMyQXJyYXkuQllURVNfUEVSX0VMRU1FTlQpLCBtZXNzYWdlLmJ1ZmZlci5ieXRlT2Zmc2V0ICsgKG1lc3NhZ2UuYnVmZmVyT2Zmc2V0ICogVWludDMyQXJyYXkuQllURVNfUEVSX0VMRU1FTlQpICsgYXJyYXlTaXplKTtcbiAgICAgICAgbWVzc2FnZS5idWZmZXJPZmZzZXQgKz0gYWxpZ25lZFNpemU7XG4gICAgICAgIHJldHVybiBhcmc7XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIGEobWVzc2FnZSkge1xuICAgIGNoZWNrTWVzc2FnZVNpemUobWVzc2FnZSwgNCk7XG4gICAgY29uc3QgYXJyYXlTaXplID0gbWVzc2FnZS5idWZmZXJbbWVzc2FnZS5idWZmZXJPZmZzZXQrK107XG4gICAgY29uc3QgYWxpZ25lZFNpemUgPSAoKGFycmF5U2l6ZSArIDMpICYgfjMpO1xuICAgIGNoZWNrTWVzc2FnZVNpemUobWVzc2FnZSwgYWxpZ25lZFNpemUpO1xuICAgIGNvbnN0IGFyZyA9IG1lc3NhZ2UuYnVmZmVyLmJ1ZmZlci5zbGljZShtZXNzYWdlLmJ1ZmZlci5ieXRlT2Zmc2V0ICsgKG1lc3NhZ2UuYnVmZmVyT2Zmc2V0ICogVWludDMyQXJyYXkuQllURVNfUEVSX0VMRU1FTlQpLCBtZXNzYWdlLmJ1ZmZlci5ieXRlT2Zmc2V0ICsgKG1lc3NhZ2UuYnVmZmVyT2Zmc2V0ICogVWludDMyQXJyYXkuQllURVNfUEVSX0VMRU1FTlQpICsgYXJyYXlTaXplKTtcbiAgICBtZXNzYWdlLmJ1ZmZlck9mZnNldCArPSBhbGlnbmVkU2l6ZTtcbiAgICByZXR1cm4gYXJnO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGgobWVzc2FnZSkge1xuICAgIGlmIChtZXNzYWdlLmZkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGxldCB3ZWJGZCA9IG1lc3NhZ2UuZmRzLnNoaWZ0KCk7XG4gICAgICAgIGlmICh3ZWJGZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIG1vcmUgd2ViZmRzIGZvdW5kIGluIHdsIG1lc3NhZ2UuJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHdlYkZkO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgZW5vdWdoIGZpbGUgZGVzY3JpcHRvcnMgaW4gbWVzc2FnZSBvYmplY3QuJyk7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIENvbm5lY3Rpb24ge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLndsT2JqZWN0cyA9IHt9O1xuICAgICAgICB0aGlzLmNsb3NlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9vdXRNZXNzYWdlcyA9IFtdO1xuICAgICAgICB0aGlzLl9pbk1lc3NhZ2VzID0gW107XG4gICAgICAgIHRoaXMuX2lkbGVIYW5kbGVycyA9IFtdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgb25lLXNob3QgaWRsZSBoYW5kbGVyLiBUaGUgaWRsZSBoYW5kbGVyIGlzIGZpcmVkIG9uY2UsIGFmdGVyIGFsbCBpbmNvbWluZyByZXF1ZXN0IG1lc3NhZ2VzIGhhdmUgYmVlbiBwcm9jZXNzZWQuXG4gICAgICovXG4gICAgYWRkSWRsZUhhbmRsZXIoaWRsZUhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5faWRsZUhhbmRsZXJzID0gWy4uLnRoaXMuX2lkbGVIYW5kbGVycywgaWRsZUhhbmRsZXJdO1xuICAgIH1cbiAgICByZW1vdmVJZGxlSGFuZGxlcihpZGxlSGFuZGxlcikge1xuICAgICAgICB0aGlzLl9pZGxlSGFuZGxlcnMgPSB0aGlzLl9pZGxlSGFuZGxlcnMuZmlsdGVyKGhhbmRsZXIgPT4gaGFuZGxlciAhPT0gaWRsZUhhbmRsZXIpO1xuICAgIH1cbiAgICBtYXJzaGFsbE1zZyhpZCwgb3Bjb2RlLCBzaXplLCBhcmdzQXJyYXkpIHtcbiAgICAgICAgY29uc3Qgd2lyZU1zZyA9IHtcbiAgICAgICAgICAgIGJ1ZmZlcjogbmV3IEFycmF5QnVmZmVyKHNpemUpLFxuICAgICAgICAgICAgZmRzOiBbXSxcbiAgICAgICAgICAgIGJ1ZmZlck9mZnNldDogMFxuICAgICAgICB9O1xuICAgICAgICAvLyB3cml0ZSBhY3R1YWwgd2lyZSBtZXNzYWdlXG4gICAgICAgIGNvbnN0IGJ1ZnUzMiA9IG5ldyBVaW50MzJBcnJheSh3aXJlTXNnLmJ1ZmZlcik7XG4gICAgICAgIGNvbnN0IGJ1ZnUxNiA9IG5ldyBVaW50MTZBcnJheSh3aXJlTXNnLmJ1ZmZlcik7XG4gICAgICAgIGJ1ZnUzMlswXSA9IGlkO1xuICAgICAgICBidWZ1MTZbMl0gPSBvcGNvZGU7XG4gICAgICAgIGJ1ZnUxNlszXSA9IHNpemU7XG4gICAgICAgIHdpcmVNc2cuYnVmZmVyT2Zmc2V0ID0gODtcbiAgICAgICAgLy8gd3JpdGUgYWN0dWFsIGFyZ3VtZW50IHZhbHVlIHRvIGJ1ZmZlclxuICAgICAgICBhcmdzQXJyYXkuZm9yRWFjaCgoYXJnKSA9PiBhcmcuX21hcnNoYWxsQXJnKHdpcmVNc2cpKTtcbiAgICAgICAgdGhpcy5vblNlbmQod2lyZU1zZyk7XG4gICAgfVxuICAgIF9pZGxlKCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBpZGxlSGFuZGxlciBvZiB0aGlzLl9pZGxlSGFuZGxlcnMpIHtcbiAgICAgICAgICAgICAgICB5aWVsZCBpZGxlSGFuZGxlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSGFuZGxlIHJlY2VpdmVkIHdpcmUgbWVzc2FnZXMuXG4gICAgICovXG4gICAgbWVzc2FnZShpbmNvbWluZ1dpcmVNZXNzYWdlcykge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gbW9yZSB0aGFuIG9uZSBtZXNzYWdlIGluIHF1ZXVlIG1lYW5zIHRoZSBtZXNzYWdlIGxvb3AgaXMgaW4gYXdhaXQsIGRvbid0IGNvbmN1cnJlbnRseSBwcm9jZXNzIHRoZSBuZXdcbiAgICAgICAgICAgIC8vIG1lc3NhZ2UsIGluc3RlYWQgcmV0dXJuIGVhcmx5IGFuZCBsZXQgdGhlIHJlc3VtZS1mcm9tLWF3YWl0IHBpY2sgdXAgdGhlIG5ld2x5IHF1ZXVlZCBtZXNzYWdlLlxuICAgICAgICAgICAgaWYgKHRoaXMuX2luTWVzc2FnZXMucHVzaChPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGluY29taW5nV2lyZU1lc3NhZ2VzKSwgeyBidWZmZXJPZmZzZXQ6IDAsIGNvbnN1bWVkOiAwLCBzaXplOiAwIH0pKSA+IDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aGlsZSAodGhpcy5faW5NZXNzYWdlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB3aXJlTWVzc2FnZXMgPSB0aGlzLl9pbk1lc3NhZ2VzWzBdO1xuICAgICAgICAgICAgICAgIHdoaWxlICh3aXJlTWVzc2FnZXMuYnVmZmVyT2Zmc2V0IDwgd2lyZU1lc3NhZ2VzLmJ1ZmZlci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaWQgPSB3aXJlTWVzc2FnZXMuYnVmZmVyW3dpcmVNZXNzYWdlcy5idWZmZXJPZmZzZXRdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzaXplT3Bjb2RlID0gd2lyZU1lc3NhZ2VzLmJ1ZmZlclt3aXJlTWVzc2FnZXMuYnVmZmVyT2Zmc2V0ICsgMV07XG4gICAgICAgICAgICAgICAgICAgIHdpcmVNZXNzYWdlcy5zaXplID0gc2l6ZU9wY29kZSA+Pj4gMTY7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9wY29kZSA9IHNpemVPcGNvZGUgJiAweDAwMDBGRkZGO1xuICAgICAgICAgICAgICAgICAgICBpZiAod2lyZU1lc3NhZ2VzLnNpemUgPiB3aXJlTWVzc2FnZXMuYnVmZmVyLmJ5dGVMZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUmVxdWVzdCBidWZmZXIgdG9vIHNtYWxsJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgd2xPYmplY3QgPSB0aGlzLndsT2JqZWN0c1tpZF07XG4gICAgICAgICAgICAgICAgICAgIGlmICh3bE9iamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lyZU1lc3NhZ2VzLmJ1ZmZlck9mZnNldCArPSAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lyZU1lc3NhZ2VzLmNvbnN1bWVkID0gODtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHlpZWxkIHdsT2JqZWN0W29wY29kZV0od2lyZU1lc3NhZ2VzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgXG53bE9iamVjdDogJHt3bE9iamVjdC5jb25zdHJ1Y3Rvci5uYW1lfVske29wY29kZX1dKC4uKVxubmFtZTogJHtlLm5hbWV9IG1lc3NhZ2U6ICR7ZS5tZXNzYWdlfSB0ZXh0OiAke2UudGV4dH1cbmVycm9yIG9iamVjdCBzdGFjazpcbiR7ZS5zdGFja31cbmApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBpbnZhbGlkIG9iamVjdCAke2lkfWApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2luTWVzc2FnZXMuc2hpZnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZmx1c2goKTtcbiAgICAgICAgICAgIHlpZWxkIHRoaXMuX2lkbGUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoaXMgZG9lc24ndCBhY3R1YWxseSBzZW5kIHRoZSBtZXNzYWdlLCBidXQgcXVldWVzIGl0IHNvIGl0IGNhbiBiZSBzZW5kIG9uIGZsdXNoLlxuICAgICAqL1xuICAgIG9uU2VuZCh3aXJlTXNnKSB7XG4gICAgICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX291dE1lc3NhZ2VzLnB1c2god2lyZU1zZyk7XG4gICAgfVxuICAgIGZsdXNoKCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9vdXRNZXNzYWdlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAoX2EgPSB0aGlzLm9uRmx1c2gpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jYWxsKHRoaXMsIHRoaXMuX291dE1lc3NhZ2VzKTtcbiAgICAgICAgdGhpcy5fb3V0TWVzc2FnZXMgPSBbXTtcbiAgICB9XG4gICAgY2xvc2UoKSB7XG4gICAgICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIGRlc3Ryb3kgcmVzb3VyY2VzIGluIGRlc2NlbmRpbmcgb3JkZXJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLndsT2JqZWN0cykuc29ydCgoYSwgYikgPT4gYS5pZCAtIGIuaWQpLmZvckVhY2goKHdsT2JqZWN0KSA9PiB3bE9iamVjdC5kZXN0cm95KCkpO1xuICAgICAgICB0aGlzLmNsb3NlZCA9IHRydWU7XG4gICAgfVxuICAgIHJlZ2lzdGVyV2xPYmplY3Qod2xPYmplY3QpIHtcbiAgICAgICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHdsT2JqZWN0LmlkIGluIHRoaXMud2xPYmplY3RzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYElsbGVnYWwgb2JqZWN0IGlkOiAke3dsT2JqZWN0LmlkfS4gQWxyZWFkeSByZWdpc3RlcmVkLmApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMud2xPYmplY3RzW3dsT2JqZWN0LmlkXSA9IHdsT2JqZWN0O1xuICAgIH1cbiAgICB1bnJlZ2lzdGVyV2xPYmplY3Qod2xPYmplY3QpIHtcbiAgICAgICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIHRoaXMud2xPYmplY3RzW3dsT2JqZWN0LmlkXTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lRMjl1Ym1WamRHbHZiaTVxY3lJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6SWpwYklpNHVMM055WXk5RGIyNXVaV04wYVc5dUxuUnpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPenM3T3pzN096dEJRVUZCT3pzN096czdPenM3T3pzN096czdPenM3T3pzN08wVkJjMEpGTzBGQlEwWXNUVUZCVFN4WFFVRlhMRWRCUVVjc1NVRkJTU3hYUVVGWExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVRTdRVUZGTTBNc1RVRkJUU3hQUVVGUExGRkJRVkU3U1VGUGJrSXNXVUZCV1N4RlFVRlZPMUZCU0V3c2IwSkJRV1VzUjBGQmEwSXNTVUZCU1N4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFVkJRVVVzUTBGQlF5eEpRVUZKTEVOQlFVTXNaMEpCUVdkQ0xFZEJRVWNzVDBGQlR5eERRVUZETEVOQlFVRTdVVUZEYWtjc2MwSkJRV2xDTEVkQlFYRkRMRVZCUVVVc1EwRkJRVHRSUVVjNVJDeEpRVUZKTEVOQlFVTXNSVUZCUlN4SFFVRkhMRVZCUVVVc1EwRkJRVHRSUVVOYUxFbEJRVWtzUTBGQlF5eGxRVUZsTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWRCUVVjc1JVRkJSU3hEUVVGRExFbEJRVWtzUTBGQlF5eHBRa0ZCYVVJc1EwRkJReXhQUVVGUExFTkJRVU1zWlVGQlpTeERRVUZETEVWQlFVVXNRMEZCUXl4bFFVRmxMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZCTzBsQlF6TkhMRU5CUVVNN1NVRkZSQ3hQUVVGUE8xRkJRMHdzU1VGQlNTeERRVUZETEdkQ1FVRm5RaXhGUVVGRkxFTkJRVUU3U1VGRGVrSXNRMEZCUXp0SlFVVkVMR3RDUVVGclFpeERRVUZETEdWQlFUWkRPMUZCUXpsRUxFbEJRVWtzUTBGQlF5eHBRa0ZCYVVJc1EwRkJReXhKUVVGSkxFTkJRVU1zWlVGQlpTeERRVUZETEVOQlFVRTdTVUZET1VNc1EwRkJRenRKUVVWRUxIRkNRVUZ4UWl4RFFVRkRMR1ZCUVRaRE8xRkJRMnBGTEVsQlFVa3NRMEZCUXl4cFFrRkJhVUlzUjBGQlJ5eEpRVUZKTEVOQlFVTXNhVUpCUVdsQ0xFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTXNTVUZCU1N4RlFVRkZMRVZCUVVVc1EwRkJReXhKUVVGSkxFdEJRVXNzWlVGQlpTeERRVUZETEVOQlFVRTdTVUZETlVZc1EwRkJRenRKUVVWRUxGTkJRVk03VVVGRFVDeFBRVUZQTEVsQlFVa3NRMEZCUXl4bFFVRmxMRU5CUVVFN1NVRkROMElzUTBGQlF6dERRVU5HTzBGQlJVUXNUVUZCVFN4UFFVRlBMRXRCUVVzN1NVRjFRbWhDT3pzN1QwRkhSenRKUVVOSUxGbEJRVmtzUjBGQlZ6dFJRVU55UWl4SlFVRkpMRU5CUVVNc1NVRkJTU3hIUVVGSExFZEJRVWNzUTBGQlFUdEpRVU5xUWl4RFFVRkRPMGxCTVVKRUxFMUJRVTBzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCV1R0UlFVTjJRaXhQUVVGUExFbEJRVWtzUzBGQlN5eERRVUZETEVOQlFVTXNTVUZCU1N4SFFVRkhMRXRCUVVzc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF5eERRVUZCTzBsQlEzWkRMRU5CUVVNN1NVRkZSRHM3TzA5QlIwYzdTVUZEU0N4TFFVRkxPMUZCUTBnc1QwRkJUeXhEUVVGRExFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NSMEZCUnl4TFFVRkxMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU1zUTBGQlFUdEpRVU51UXl4RFFVRkRPMGxCUlVRN096dFBRVWRITzBsQlEwZ3NVVUZCVVR0UlFVTk9MRTlCUVU4c1NVRkJTU3hEUVVGRExFbEJRVWtzUjBGQlJ5eExRVUZMTEVOQlFVRTdTVUZETVVJc1EwRkJRenREUVZOR08wRkJSVVFzVFVGQlRTeFBRVUZQTEV0QlFVczdTVUZQYUVJc1dVRkRSU3hGUVVGVkxFVkJRMVlzVFVGQmVVVXNSVUZEZWtVc1MwRkJWU3hGUVVOV0xHbENRVUV3UkN4RlFVTXhSQ3hQUVVFclFqdFJRVVV2UWl4SlFVRkpMRU5CUVVNc1JVRkJSU3hIUVVGSExFVkJRVVVzUTBGQlFUdFJRVU5hTEVsQlFVa3NRMEZCUXl4SlFVRkpMRWRCUVVjc1RVRkJUU3hEUVVGQk8xRkJRMnhDTEVsQlFVa3NRMEZCUXl4SFFVRkhMRWRCUVVjc1MwRkJTeXhEUVVGQk8xRkJRMmhDTEVsQlFVa3NRMEZCUXl4clFrRkJhMElzUjBGQlJ5eHBRa0ZCYVVJc1EwRkJRVHRSUVVNelF5eEpRVUZKTEVOQlFVTXNVVUZCVVN4SFFVRkhMRTlCUVU4c1EwRkJRVHRKUVVONlFpeERRVUZETzBsQlJVc3NaVUZCWlRzN1dVRkRia0lzVDBGQlR5eE5RVUZOTEVsQlFVa3NRMEZCUXl4clFrRkJhMElzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUVR0UlFVTTFReXhEUVVGRE8wdEJRVUU3U1VGRlJDeExRVUZMTzFGQlEwZ3NTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlFUdEpRVU55UWl4RFFVRkRPME5CUTBZN1FVRjVRa1FzVFVGQlRTeFZRVUZWTEVsQlFVa3NRMEZCUXl4SFFVRlhPMGxCUXpsQ0xFOUJRVTg3VVVGRFRDeExRVUZMTEVWQlFVVXNSMEZCUnp0UlFVTldMRWxCUVVrc1JVRkJSU3hIUVVGSE8xRkJRMVFzU1VGQlNTeEZRVUZGTEVOQlFVTTdVVUZEVUN4UlFVRlJMRVZCUVVVc1MwRkJTenRSUVVObUxGbEJRVmtzUlVGQlJTeFZRVUZUTEU5QlFVODdXVUZETlVJc1NVRkJTU3hYUVVGWExFTkJRVU1zVDBGQlR5eERRVUZETEUxQlFVMHNSVUZCUlN4UFFVRlBMRU5CUVVNc1dVRkJXU3hGUVVGRkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4SFFVRkhMRWRCUVVjc1EwRkJRVHRaUVVOcVJTeFBRVUZQTEVOQlFVTXNXVUZCV1N4SlFVRkpMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVUU3VVVGRGJrTXNRMEZCUXp0TFFVTkdMRU5CUVVFN1FVRkRTQ3hEUVVGRE8wRkJSVVFzVFVGQlRTeFZRVUZWTEdOQlFXTXNRMEZCUXl4SFFVRlZPMGxCUTNaRExFOUJRVTg3VVVGRFRDeExRVUZMTEVWQlFVVXNSMEZCUnp0UlFVTldMRWxCUVVrc1JVRkJSU3hIUVVGSE8xRkJRMVFzU1VGQlNTeEZRVUZGTEVOQlFVTTdVVUZEVUN4UlFVRlJMRVZCUVVVc1MwRkJTenRSUVVObUxGbEJRVmtzUlVGQlJTeFZRVUZUTEU5QlFVODdXVUZETlVJc1QwRkJUeXhEUVVGRExFZEJRVWNzUTBGQlF5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVFN1VVRkRka0lzUTBGQlF6dExRVU5HTEVOQlFVRTdRVUZEU0N4RFFVRkRPMEZCUlVRc1RVRkJUU3hWUVVGVkxFZEJRVWNzUTBGQlF5eEhRVUZYTzBsQlF6ZENMRTlCUVU4N1VVRkRUQ3hMUVVGTExFVkJRVVVzUjBGQlJ6dFJRVU5XTEVsQlFVa3NSVUZCUlN4SFFVRkhPMUZCUTFRc1NVRkJTU3hGUVVGRkxFTkJRVU03VVVGRFVDeFJRVUZSTEVWQlFVVXNTMEZCU3p0UlFVTm1MRmxCUVZrc1JVRkJSU3hWUVVGVExFOUJRVTg3V1VGRE5VSXNTVUZCU1N4VlFVRlZMRU5CUVVNc1QwRkJUeXhEUVVGRExFMUJRVTBzUlVGQlJTeFBRVUZQTEVOQlFVTXNXVUZCV1N4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVFN1dVRkRka1VzVDBGQlR5eERRVUZETEZsQlFWa3NTVUZCU1N4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGQk8xRkJRMjVETEVOQlFVTTdTMEZEUml4RFFVRkJPMEZCUTBnc1EwRkJRenRCUVVWRUxFMUJRVTBzVlVGQlZTeExRVUZMTEVOQlFVTXNSMEZCVlR0SlFVTTVRaXhQUVVGUE8xRkJRMHdzUzBGQlN5eEZRVUZGTEVkQlFVYzdVVUZEVml4SlFVRkpMRVZCUVVVc1IwRkJSenRSUVVOVUxFbEJRVWtzUlVGQlJTeERRVUZETzFGQlExQXNVVUZCVVN4RlFVRkZMRXRCUVVzN1VVRkRaaXhaUVVGWkxFVkJRVVVzVlVGQlV5eFBRVUZQTzFsQlF6VkNMRWxCUVVrc1ZVRkJWU3hEUVVGRExFOUJRVThzUTBGQlF5eE5RVUZOTEVWQlFVVXNUMEZCVHl4RFFVRkRMRmxCUVZrc1JVRkJSU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUTBGQlFUdFpRVU0xUlN4UFFVRlBMRU5CUVVNc1dVRkJXU3hKUVVGSkxFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVRTdVVUZEYmtNc1EwRkJRenRMUVVOR0xFTkJRVUU3UVVGRFNDeERRVUZETzBGQlJVUXNUVUZCVFN4VlFVRlZMRTFCUVUwc1EwRkJReXhIUVVGaE8wbEJRMnhETEU5QlFVODdVVUZEVEN4TFFVRkxMRVZCUVVVc1IwRkJSenRSUVVOV0xFbEJRVWtzUlVGQlJTeEhRVUZITzFGQlExUXNTVUZCU1N4RlFVRkZMRU5CUVVNN1VVRkRVQ3hSUVVGUkxFVkJRVVVzUzBGQlN6dFJRVU5tTEZsQlFWa3NSVUZCUlN4VlFVRlRMRTlCUVU4N1dVRkROVUlzU1VGQlNTeFhRVUZYTEVOQlFVTXNUMEZCVHl4RFFVRkRMRTFCUVUwc1JVRkJSU3hQUVVGUExFTkJRVU1zV1VGQldTeEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNSVUZCUlN4RFFVRkJPMWxCUXpORkxFOUJRVThzUTBGQlF5eFpRVUZaTEVsQlFVa3NTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJRVHRSUVVOdVF5eERRVUZETzB0QlEwWXNRMEZCUVR0QlFVTklMRU5CUVVNN1FVRkZSQ3hOUVVGTkxGVkJRVlVzWTBGQll5eERRVUZETEVkQlFXTTdTVUZETTBNc1QwRkJUenRSUVVOTUxFdEJRVXNzUlVGQlJTeEhRVUZITzFGQlExWXNTVUZCU1N4RlFVRkZMRWRCUVVjN1VVRkRWQ3hKUVVGSkxFVkJRVVVzUTBGQlF6dFJRVU5RTEZGQlFWRXNSVUZCUlN4SlFVRkpPMUZCUTJRc1dVRkJXU3hGUVVGRkxGVkJRVk1zVDBGQlR6dFpRVU0xUWl4SlFVRkpMRmRCUVZjc1EwRkJReXhQUVVGUExFTkJRVU1zVFVGQlRTeEZRVUZGTEU5QlFVOHNRMEZCUXl4WlFVRlpMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVkQlFVY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhMUVVGTExGTkJRVk1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVWQlFVVXNRMEZCUXl4RFFVRkJPMWxCUXpWSExFOUJRVThzUTBGQlF5eFpRVUZaTEVsQlFVa3NTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJRVHRSUVVOdVF5eERRVUZETzB0QlEwWXNRMEZCUVR0QlFVTklMRU5CUVVNN1FVRkZSQ3hOUVVGTkxGVkJRVlVzVTBGQlV6dEpRVU4yUWl4UFFVRlBPMUZCUTB3c1MwRkJTeXhGUVVGRkxFTkJRVU03VVVGRFVpeEpRVUZKTEVWQlFVVXNSMEZCUnp0UlFVTlVMRWxCUVVrc1JVRkJSU3hEUVVGRE8xRkJRMUFzVVVGQlVTeEZRVUZGTEV0QlFVczdVVUZEWml4WlFVRlpMRVZCUVVVc1ZVRkJVeXhQUVVGUE8xbEJRelZDTEVsQlFVa3NWMEZCVnl4RFFVRkRMRTlCUVU4c1EwRkJReXhOUVVGTkxFVkJRVVVzVDBGQlR5eERRVUZETEZsQlFWa3NSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkJPMWxCUTNoRkxFOUJRVThzUTBGQlF5eFpRVUZaTEVsQlFVa3NTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJRVHRSUVVOdVF5eERRVUZETzB0QlEwWXNRMEZCUVR0QlFVTklMRU5CUVVNN1FVRkZSQ3hOUVVGTkxGVkJRVlVzVFVGQlRTeERRVUZETEVkQlFWYzdTVUZEYUVNc1QwRkJUenRSUVVOTUxFdEJRVXNzUlVGQlJTeEhRVUZITEVkQlFVY3NTVUZCU1R0UlFVTnFRaXhKUVVGSkxFVkJRVVVzUjBGQlJ6dFJRVU5VTEVsQlFVa3NSVUZCUlN4RFFVRkRMRWRCUVVjc1EwRkJRenRaUVVOVUxEWkZRVUUyUlR0WlFVTTNSU3dyUWtGQkswSTdXVUZETDBJc1QwRkJUeXhEUVVGRExFZEJRVWNzUTBGQlF5eE5RVUZOTEVkQlFVY3NRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZCTzFGQlEyeERMRU5CUVVNc1EwRkJReXhGUVVGRk8xRkJRMG9zVVVGQlVTeEZRVUZGTEV0QlFVczdVVUZEWml4WlFVRlpMRVZCUVVVc1ZVRkJVeXhQUVVGUE8xbEJRelZDTEVsQlFVa3NWMEZCVnl4RFFVRkRMRTlCUVU4c1EwRkJReXhOUVVGTkxFVkJRVVVzVDBGQlR5eERRVUZETEZsQlFWa3NSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTFCUVUwc1EwRkJRVHRaUVVVdlJTeE5RVUZOTEUxQlFVMHNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFMUJRVTBzUTBGQlFUdFpRVU5vUXl4TlFVRk5MRWxCUVVrc1IwRkJSeXhKUVVGSkxGVkJRVlVzUTBGQlF5eFBRVUZQTEVOQlFVTXNUVUZCVFN4RlFVRkZMRTlCUVU4c1EwRkJReXhaUVVGWkxFZEJRVWNzUTBGQlF5eEZRVUZGTEUxQlFVMHNRMEZCUXl4RFFVRkJPMWxCUXpkRkxFdEJRVXNzU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4RlFVRkZMRU5CUVVNc1IwRkJSeXhOUVVGTkxFVkJRVVVzUTBGQlF5eEZRVUZGTEVWQlFVVTdaMEpCUXk5Q0xFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRVHRoUVVOMFF6dFpRVU5FTEU5QlFVOHNRMEZCUXl4WlFVRlpMRWxCUVVrc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlFUdFJRVU51UXl4RFFVRkRPMHRCUTBZc1EwRkJRVHRCUVVOSUxFTkJRVU03UVVGRlJDeE5RVUZOTEZWQlFWVXNZMEZCWXl4RFFVRkRMRWRCUVZrN1NVRkRla01zVDBGQlR6dFJRVU5NTEV0QlFVc3NSVUZCUlN4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRExFZEJRVWNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNRMEZCUXl4RFFVRkRMRk5CUVZNN1VVRkRia01zU1VGQlNTeEZRVUZGTEVkQlFVYzdVVUZEVkN4SlFVRkpMRVZCUVVVc1EwRkJReXhIUVVGSExFTkJRVU03V1VGRFZDeEpRVUZKTEVkQlFVY3NTMEZCU3l4VFFVRlRMRVZCUVVVN1owSkJRM0pDTEU5QlFVOHNRMEZCUXl4RFFVRkJPMkZCUTFRN2FVSkJRVTA3WjBKQlEwd3NOa1ZCUVRaRk8yZENRVU0zUlN3clFrRkJLMEk3WjBKQlF5OUNMRTlCUVU4c1EwRkJReXhIUVVGSExFTkJRVU1zVFVGQlRTeEhRVUZITEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlFUdGhRVU5xUXp0UlFVTklMRU5CUVVNc1EwRkJReXhGUVVGRk8xRkJRMG9zVVVGQlVTeEZRVUZGTEVsQlFVazdVVUZEWkN4WlFVRlpMRVZCUVVVc1ZVRkJVeXhQUVVGUE8xbEJRelZDTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1MwRkJTeXhUUVVGVExFVkJRVVU3WjBKQlF6VkNMRWxCUVVrc1YwRkJWeXhEUVVGRExFOUJRVThzUTBGQlF5eE5RVUZOTEVWQlFVVXNUMEZCVHl4RFFVRkRMRmxCUVZrc1JVRkJSU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVFN1lVRkRhRVU3YVVKQlFVMDdaMEpCUTB3c1NVRkJTU3hYUVVGWExFTkJRVU1zVDBGQlR5eERRVUZETEUxQlFVMHNSVUZCUlN4UFFVRlBMRU5CUVVNc1dVRkJXU3hGUVVGRkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVFVGQlRTeERRVUZCTzJkQ1FVVXZSU3hOUVVGTkxFMUJRVTBzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTFCUVUwc1EwRkJRVHRuUWtGRGFFTXNUVUZCVFN4SlFVRkpMRWRCUVVjc1NVRkJTU3hWUVVGVkxFTkJRVU1zVDBGQlR5eERRVUZETEUxQlFVMHNSVUZCUlN4UFFVRlBMRU5CUVVNc1dVRkJXU3hIUVVGSExFTkJRVU1zUlVGQlJTeE5RVUZOTEVOQlFVTXNRMEZCUVR0blFrRkROMFVzUzBGQlN5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRVZCUVVVc1EwRkJReXhIUVVGSExFMUJRVTBzUlVGQlJTeERRVUZETEVWQlFVVXNSVUZCUlR0dlFrRkRMMElzU1VGQlNTeERRVUZETEVOQlFVTXNRMEZCUXl4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNWVUZCVlN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGQk8ybENRVU4wUXp0aFFVTkdPMWxCUTBRc1QwRkJUeXhEUVVGRExGbEJRVmtzU1VGQlNTeEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkJPMUZCUTI1RExFTkJRVU03UzBGRFJpeERRVUZCTzBGQlEwZ3NRMEZCUXp0QlFVVkVMRTFCUVUwc1ZVRkJWU3hMUVVGTExFTkJRVU1zUjBGQmIwSTdTVUZEZUVNc1QwRkJUenRSUVVOTUxFdEJRVXNzUlVGQlJTeEhRVUZITzFGQlExWXNTVUZCU1N4RlFVRkZMRWRCUVVjN1VVRkRWQ3hKUVVGSkxFVkJRVVVzUTBGQlF5eEhRVUZITEVOQlFVTTdXVUZEVkN3MlJVRkJOa1U3V1VGRE4wVXNUMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXhWUVVGVkxFZEJRVWNzUTBGQlF5eERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVFN1VVRkRiRU1zUTBGQlF5eERRVUZETEVWQlFVVTdVVUZEU2l4UlFVRlJMRVZCUVVVc1MwRkJTenRSUVVObUxGbEJRVmtzUlVGQlJTeFZRVUZUTEU5QlFVODdXVUZETlVJc1NVRkJTU3hYUVVGWExFTkJRVU1zVDBGQlR5eERRVUZETEUxQlFVMHNSVUZCUlN4UFFVRlBMRU5CUVVNc1dVRkJXU3hGUVVGRkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVlVGQlZTeERRVUZCTzFsQlJXNUdMRTFCUVUwc1ZVRkJWU3hIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNWVUZCVlN4RFFVRkJPMWxCUTNoRExFbEJRVWtzVlVGQlZTeERRVUZETEU5QlFVOHNRMEZCUXl4TlFVRk5MRVZCUVVVc1QwRkJUeXhEUVVGRExGbEJRVmtzUjBGQlJ5eERRVUZETEVWQlFVVXNWVUZCVlN4RFFVRkRMRU5CUVVNc1IwRkJSeXhEUVVGRExFbEJRVWtzVlVGQlZTeERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU1zUlVGQlJTeFZRVUZWTEVOQlFVTXNRMEZCUXl4RFFVRkJPMWxCUlRGSUxFOUJRVThzUTBGQlF5eFpRVUZaTEVsQlFVa3NTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJRVHRSUVVOdVF5eERRVUZETzB0QlEwWXNRMEZCUVR0QlFVTklMRU5CUVVNN1FVRkZSQ3hOUVVGTkxGVkJRVlVzWVVGQllTeERRVUZETEVkQlFYRkNPMGxCUTJwRUxFOUJRVTg3VVVGRFRDeExRVUZMTEVWQlFVVXNSMEZCUnp0UlFVTldMRWxCUVVrc1JVRkJSU3hIUVVGSE8xRkJRMVFzU1VGQlNTeEZRVUZGTEVOQlFVTXNSMEZCUnl4RFFVRkRPMWxCUTFRc1NVRkJTU3hIUVVGSExFdEJRVXNzVTBGQlV5eEZRVUZGTzJkQ1FVTnlRaXhQUVVGUExFTkJRVU1zUTBGQlFUdGhRVU5VTzJsQ1FVRk5PMmRDUVVOTUxEWkZRVUUyUlR0blFrRkROMFVzVDBGQlR5eERRVUZETEVkQlFVY3NRMEZCUXl4VlFVRlZMRWRCUVVjc1EwRkJReXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVRTdZVUZEYWtNN1VVRkRTQ3hEUVVGRExFTkJRVU1zUlVGQlJUdFJRVU5LTEZGQlFWRXNSVUZCUlN4SlFVRkpPMUZCUTJRc1dVRkJXU3hGUVVGRkxGVkJRVk1zVDBGQlR6dFpRVU0xUWl4SlFVRkpMRWxCUVVrc1EwRkJReXhMUVVGTExFdEJRVXNzVTBGQlV5eEZRVUZGTzJkQ1FVTTFRaXhKUVVGSkxGZEJRVmNzUTBGQlF5eFBRVUZQTEVOQlFVTXNUVUZCVFN4RlFVRkZMRTlCUVU4c1EwRkJReXhaUVVGWkxFVkJRVVVzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGQk8yRkJRMmhGTzJsQ1FVRk5PMmRDUVVOTUxFbEJRVWtzVjBGQlZ5eERRVUZETEU5QlFVOHNRMEZCUXl4TlFVRk5MRVZCUVVVc1QwRkJUeXhEUVVGRExGbEJRVmtzUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZWQlFWVXNRMEZCUVR0blFrRkZia1lzVFVGQlRTeFZRVUZWTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhWUVVGVkxFTkJRVUU3WjBKQlEzaERMRWxCUVVrc1ZVRkJWU3hEUVVGRExFOUJRVThzUTBGQlF5eE5RVUZOTEVWQlFVVXNUMEZCVHl4RFFVRkRMRmxCUVZrc1IwRkJSeXhEUVVGRExFVkJRVVVzVlVGQlZTeERRVUZETEVOQlFVTXNSMEZCUnl4RFFVRkRMRWxCUVVrc1ZVRkJWU3hEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNc1JVRkJSU3hWUVVGVkxFTkJRVU1zUTBGQlF5eERRVUZCTzJGQlF6TklPMWxCUTBRc1QwRkJUeXhEUVVGRExGbEJRVmtzU1VGQlNTeEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkJPMUZCUTI1RExFTkJRVU03UzBGRFJpeERRVUZCTzBGQlEwZ3NRMEZCUXp0QlFVVkVMRk5CUVZNc1owSkJRV2RDTEVOQlFVTXNUMEZCYTBJc1JVRkJSU3hYUVVGdFFqdEpRVU12UkN4SlFVRkpMRTlCUVU4c1EwRkJReXhSUVVGUkxFZEJRVWNzVjBGQlZ5eEhRVUZITEU5QlFVOHNRMEZCUXl4SlFVRkpMRVZCUVVVN1VVRkRha1FzVFVGQlRTeEpRVUZKTEV0QlFVc3NRMEZCUXl4dlFrRkJiMElzUTBGQlF5eERRVUZCTzB0QlEzUkRPMU5CUVUwN1VVRkRUQ3hQUVVGUExFTkJRVU1zVVVGQlVTeEpRVUZKTEZkQlFWY3NRMEZCUVR0TFFVTm9RenRCUVVOSUxFTkJRVU03UVVGRlJDeE5RVUZOTEZWQlFWVXNRMEZCUXl4RFFVRkRMRTlCUVd0Q08wbEJRMnhETEdkQ1FVRm5RaXhEUVVGRExFOUJRVThzUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUVR0SlFVTTFRaXhQUVVGUExFOUJRVThzUTBGQlF5eE5RVUZOTEVOQlFVTXNUMEZCVHl4RFFVRkRMRmxCUVZrc1JVRkJSU3hEUVVGRExFTkJRVUU3UVVGREwwTXNRMEZCUXp0QlFVVkVMRTFCUVUwc1ZVRkJWU3hEUVVGRExFTkJRVU1zVDBGQmEwSTdTVUZEYkVNc1owSkJRV2RDTEVOQlFVTXNUMEZCVHl4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGQk8wbEJRelZDTEUxQlFVMHNSMEZCUnl4SFFVRkhMRWxCUVVrc1ZVRkJWU3hEUVVGRExFOUJRVThzUTBGQlF5eE5RVUZOTEVOQlFVTXNUVUZCVFN4RlFVRkZMRTlCUVU4c1EwRkJReXhOUVVGTkxFTkJRVU1zVlVGQlZTeEhRVUZITEVOQlFVTXNUMEZCVHl4RFFVRkRMRmxCUVZrc1IwRkJSeXhYUVVGWExFTkJRVU1zYVVKQlFXbENMRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUVR0SlFVTXpTU3hQUVVGUExFTkJRVU1zV1VGQldTeEpRVUZKTEVOQlFVTXNRMEZCUVR0SlFVTjZRaXhQUVVGUExFZEJRVWNzUTBGQlFUdEJRVU5hTEVOQlFVTTdRVUZGUkN4TlFVRk5MRlZCUVZVc1EwRkJReXhEUVVGRExFOUJRV3RDTzBsQlEyeERMR2RDUVVGblFpeERRVUZETEU5QlFVOHNSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJRVHRKUVVNMVFpeE5RVUZOTEVkQlFVY3NSMEZCUnl4SlFVRkpMRlZCUVZVc1EwRkJReXhQUVVGUExFTkJRVU1zVFVGQlRTeERRVUZETEUxQlFVMHNSVUZCUlN4UFFVRlBMRU5CUVVNc1RVRkJUU3hEUVVGRExGVkJRVlVzUjBGQlJ5eERRVUZETEU5QlFVOHNRMEZCUXl4WlFVRlpMRWRCUVVjc1YwRkJWeXhEUVVGRExHbENRVUZwUWl4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVRTdTVUZETTBrc1QwRkJUeXhEUVVGRExGbEJRVmtzU1VGQlNTeERRVUZETEVOQlFVRTdTVUZEZWtJc1QwRkJUeXhKUVVGSkxFdEJRVXNzUTBGQlF5eEhRVUZITEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVFN1FVRkROVUlzUTBGQlF6dEJRVVZFTEUxQlFVMHNWVUZCVlN4VFFVRlRMRU5CUVhGQ0xFOUJRV3RDTEVWQlFVVXNWVUZCYzBJN1NVRkRkRVlzWjBKQlFXZENMRU5CUVVNc1QwRkJUeXhGUVVGRkxFTkJRVU1zUTBGQlF5eERRVUZCTzBsQlF6VkNMRTFCUVUwc1IwRkJSeXhIUVVGSExFOUJRVThzUTBGQlF5eE5RVUZOTEVOQlFVTXNUMEZCVHl4RFFVRkRMRmxCUVZrc1JVRkJSU3hEUVVGRExFTkJRVUU3U1VGRGJFUXNTVUZCU1N4SFFVRkhMRXRCUVVzc1EwRkJReXhGUVVGRk8xRkJRMklzVDBGQlR5eFRRVUZUTEVOQlFVRTdTMEZEYWtJN1UwRkJUVHRSUVVOTUxFMUJRVTBzVVVGQlVTeEhRVUZITEZWQlFWVXNRMEZCUXl4VFFVRlRMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVUU3VVVGRE1VTXNTVUZCU1N4UlFVRlJMRVZCUVVVN1dVRkRXaXg1UkVGQmVVUTdXVUZEZWtRc1QwRkJUeXhSUVVGaExFTkJRVUU3VTBGRGNrSTdZVUZCVFR0WlFVTk1MRTFCUVUwc1NVRkJTU3hMUVVGTExFTkJRVU1zY1VKQlFYRkNMRWRCUVVjc1JVRkJSU3hEUVVGRExFTkJRVUU3VTBGRE5VTTdTMEZEUmp0QlFVTklMRU5CUVVNN1FVRkZSQ3hOUVVGTkxGVkJRVlVzUTBGQlF5eERRVUZ4UWl4UFFVRnJRaXhGUVVGRkxGVkJRWE5DTzBsQlF6bEZMR2RDUVVGblFpeERRVUZETEU5QlFVOHNSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJRVHRKUVVNMVFpeE5RVUZOTEVkQlFVY3NSMEZCUnl4UFFVRlBMRU5CUVVNc1RVRkJUU3hEUVVGRExFOUJRVThzUTBGQlF5eFpRVUZaTEVWQlFVVXNRMEZCUXl4RFFVRkJPMGxCUld4RUxFMUJRVTBzVVVGQlVTeEhRVUZITEZWQlFWVXNRMEZCUXl4VFFVRlRMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVUU3U1VGRE1VTXNTVUZCU1N4UlFVRlJMRVZCUVVVN1VVRkRXaXg1UkVGQmVVUTdVVUZEZWtRc1QwRkJUeXhSUVVGaExFTkJRVUU3UzBGRGNrSTdVMEZCVFR0UlFVTk1MRTFCUVUwc1NVRkJTU3hMUVVGTExFTkJRVU1zY1VKQlFYRkNMRWRCUVVjc1JVRkJSU3hEUVVGRExFTkJRVUU3UzBGRE5VTTdRVUZEU0N4RFFVRkRPMEZCUlVRc1RVRkJUU3hWUVVGVkxFTkJRVU1zUTBGQlF5eFBRVUZyUWp0SlFVTnNReXhuUWtGQlowSXNRMEZCUXl4UFFVRlBMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVUU3U1VGRE5VSXNUMEZCVHl4UFFVRlBMRU5CUVVNc1RVRkJUU3hEUVVGRExFOUJRVThzUTBGQlF5eFpRVUZaTEVWQlFVVXNRMEZCUXl4RFFVRkJPMEZCUXk5RExFTkJRVU03UVVGRlJDeE5RVUZOTEZWQlFWVXNVMEZCVXl4RFFVRkRMRTlCUVd0Q08wbEJRekZETEdkQ1FVRm5RaXhEUVVGRExFOUJRVThzUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUVR0SlFVTTFRaXhOUVVGTkxGVkJRVlVzUjBGQlJ5eFBRVUZQTEVOQlFVTXNUVUZCVFN4RFFVRkRMRTlCUVU4c1EwRkJReXhaUVVGWkxFVkJRVVVzUTBGQlF5eERRVUZCTzBsQlEzcEVMRWxCUVVrc1ZVRkJWU3hMUVVGTExFTkJRVU1zUlVGQlJUdFJRVU53UWl4UFFVRlBMRk5CUVZNc1EwRkJRVHRMUVVOcVFqdFRRVUZOTzFGQlEwd3NUVUZCVFN4WFFVRlhMRWRCUVVjc1EwRkJReXhEUVVGRExGVkJRVlVzUjBGQlJ5eERRVUZETEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGQk8xRkJRek5ETEdkQ1FVRm5RaXhEUVVGRExFOUJRVThzUlVGQlJTeFhRVUZYTEVOQlFVTXNRMEZCUVR0UlFVTjBReXhwUTBGQmFVTTdVVUZEYWtNc1RVRkJUU3hUUVVGVExFZEJRVWNzU1VGQlNTeFZRVUZWTEVOQlFVTXNUMEZCVHl4RFFVRkRMRTFCUVUwc1EwRkJReXhOUVVGTkxFVkJRVVVzVDBGQlR5eERRVUZETEUxQlFVMHNRMEZCUXl4VlFVRlZMRWRCUVVjc1EwRkJReXhQUVVGUExFTkJRVU1zV1VGQldTeEhRVUZITEZkQlFWY3NRMEZCUXl4cFFrRkJhVUlzUTBGQlF5eEZRVUZGTEZWQlFWVXNSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJRVHRSUVVNelNpeFBRVUZQTEVOQlFVTXNXVUZCV1N4SlFVRkpMRU5CUVVNc1YwRkJWeXhIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZCTzFGQlEzcERMRTlCUVU4c1YwRkJWeXhEUVVGRExFMUJRVTBzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUVR0TFFVTnlRenRCUVVOSUxFTkJRVU03UVVGRlJDeE5RVUZOTEZWQlFWVXNRMEZCUXl4RFFVRkRMRTlCUVd0Q08wbEJRMnhETEdkQ1FVRm5RaXhEUVVGRExFOUJRVThzUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUVR0SlFVTTFRaXhOUVVGTkxGVkJRVlVzUjBGQlJ5eFBRVUZQTEVOQlFVTXNUVUZCVFN4RFFVRkRMRTlCUVU4c1EwRkJReXhaUVVGWkxFVkJRVVVzUTBGQlF5eERRVUZCTzBsQlJYcEVMRTFCUVUwc1YwRkJWeXhIUVVGSExFTkJRVU1zUTBGQlF5eFZRVUZWTEVkQlFVY3NRMEZCUXl4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlFUdEpRVU16UXl4blFrRkJaMElzUTBGQlF5eFBRVUZQTEVWQlFVVXNWMEZCVnl4RFFVRkRMRU5CUVVFN1NVRkRkRU1zYVVOQlFXbERPMGxCUTJwRExFMUJRVTBzVTBGQlV5eEhRVUZITEVsQlFVa3NWVUZCVlN4RFFVRkRMRTlCUVU4c1EwRkJReXhOUVVGTkxFTkJRVU1zVFVGQlRTeEZRVUZGTEU5QlFVOHNRMEZCUXl4TlFVRk5MRU5CUVVNc1ZVRkJWU3hIUVVGSExFTkJRVU1zVDBGQlR5eERRVUZETEZsQlFWa3NSMEZCUnl4WFFVRlhMRU5CUVVNc2FVSkJRV2xDTEVOQlFVTXNSVUZCUlN4VlFVRlZMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVUU3U1VGRE0wb3NUMEZCVHl4RFFVRkRMRmxCUVZrc1NVRkJTU3hEUVVGRExGZEJRVmNzUjBGQlJ5eERRVUZETEVOQlFVTXNRMEZCUVR0SlFVTjZReXhQUVVGUExGZEJRVmNzUTBGQlF5eE5RVUZOTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVFN1FVRkRkRU1zUTBGQlF6dEJRVVZFTEUxQlFVMHNWVUZCVlN4VFFVRlRMRU5CUVVNc1QwRkJhMElzUlVGQlJTeFJRVUZwUWp0SlFVTTNSQ3huUWtGQlowSXNRMEZCUXl4UFFVRlBMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVUU3U1VGRE5VSXNUVUZCVFN4VFFVRlRMRWRCUVVjc1QwRkJUeXhEUVVGRExFMUJRVTBzUTBGQlF5eFBRVUZQTEVOQlFVTXNXVUZCV1N4RlFVRkZMRU5CUVVNc1EwRkJRVHRKUVVONFJDeEpRVUZKTEZOQlFWTXNTMEZCU3l4RFFVRkRMRVZCUVVVN1VVRkRia0lzVDBGQlR5eFRRVUZUTEVOQlFVRTdTMEZEYWtJN1UwRkJUVHRSUVVOTUxFMUJRVTBzVjBGQlZ5eEhRVUZITEVOQlFVTXNRMEZCUXl4VFFVRlRMRWRCUVVjc1EwRkJReXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUVR0UlFVTXhReXhuUWtGQlowSXNRMEZCUXl4UFFVRlBMRVZCUVVVc1YwRkJWeXhEUVVGRExFTkJRVUU3VVVGRGRFTXNUVUZCVFN4SFFVRkhMRWRCUVVjc1QwRkJUeXhEUVVGRExFMUJRVTBzUTBGQlF5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVU4c1EwRkJReXhOUVVGTkxFTkJRVU1zVlVGQlZTeEhRVUZITEVOQlFVTXNUMEZCVHl4RFFVRkRMRmxCUVZrc1IwRkJSeXhYUVVGWExFTkJRVU1zYVVKQlFXbENMRU5CUVVNc1JVRkJSU3hQUVVGUExFTkJRVU1zVFVGQlRTeERRVUZETEZWQlFWVXNSMEZCUnl4RFFVRkRMRTlCUVU4c1EwRkJReXhaUVVGWkxFZEJRVWNzVjBGQlZ5eERRVUZETEdsQ1FVRnBRaXhEUVVGRExFZEJRVWNzVTBGQlV5eERRVUZETEVOQlFVRTdVVUZETTA0c1QwRkJUeXhEUVVGRExGbEJRVmtzU1VGQlNTeFhRVUZYTEVOQlFVRTdVVUZEYmtNc1QwRkJUeXhIUVVGSExFTkJRVUU3UzBGRFdEdEJRVU5JTEVOQlFVTTdRVUZGUkN4TlFVRk5MRlZCUVZVc1EwRkJReXhEUVVGRExFOUJRV3RDTzBsQlEyeERMR2RDUVVGblFpeERRVUZETEU5QlFVOHNSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJRVHRKUVVNMVFpeE5RVUZOTEZOQlFWTXNSMEZCUnl4UFFVRlBMRU5CUVVNc1RVRkJUU3hEUVVGRExFOUJRVThzUTBGQlF5eFpRVUZaTEVWQlFVVXNRMEZCUXl4RFFVRkJPMGxCUlhoRUxFMUJRVTBzVjBGQlZ5eEhRVUZITEVOQlFVTXNRMEZCUXl4VFFVRlRMRWRCUVVjc1EwRkJReXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUVR0SlFVTXhReXhuUWtGQlowSXNRMEZCUXl4UFFVRlBMRVZCUVVVc1YwRkJWeXhEUVVGRExFTkJRVUU3U1VGRGRFTXNUVUZCVFN4SFFVRkhMRWRCUVVjc1QwRkJUeXhEUVVGRExFMUJRVTBzUTBGQlF5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVU4c1EwRkJReXhOUVVGTkxFTkJRVU1zVlVGQlZTeEhRVUZITEVOQlFVTXNUMEZCVHl4RFFVRkRMRmxCUVZrc1IwRkJSeXhYUVVGWExFTkJRVU1zYVVKQlFXbENMRU5CUVVNc1JVRkJSU3hQUVVGUExFTkJRVU1zVFVGQlRTeERRVUZETEZWQlFWVXNSMEZCUnl4RFFVRkRMRTlCUVU4c1EwRkJReXhaUVVGWkxFZEJRVWNzVjBGQlZ5eERRVUZETEdsQ1FVRnBRaXhEUVVGRExFZEJRVWNzVTBGQlV5eERRVUZETEVOQlFVRTdTVUZETTA0c1QwRkJUeXhEUVVGRExGbEJRVmtzU1VGQlNTeFhRVUZYTEVOQlFVRTdTVUZEYmtNc1QwRkJUeXhIUVVGSExFTkJRVUU3UVVGRFdpeERRVUZETzBGQlJVUXNUVUZCVFN4VlFVRlZMRU5CUVVNc1EwRkJReXhQUVVGclFqdEpRVU5zUXl4SlFVRkpMRTlCUVU4c1EwRkJReXhIUVVGSExFTkJRVU1zVFVGQlRTeEhRVUZITEVOQlFVTXNSVUZCUlR0UlFVTXhRaXhKUVVGSkxFdEJRVXNzUjBGQlJ5eFBRVUZQTEVOQlFVTXNSMEZCUnl4RFFVRkRMRXRCUVVzc1JVRkJSU3hEUVVGQk8xRkJReTlDTEVsQlFVa3NTMEZCU3l4TFFVRkxMRk5CUVZNc1JVRkJSVHRaUVVOMlFpeE5RVUZOTEVsQlFVa3NTMEZCU3l4RFFVRkRMSEZEUVVGeFF5eERRVUZETEVOQlFVRTdVMEZEZGtRN1VVRkRSQ3hQUVVGUExFdEJRVXNzUTBGQlFUdExRVU5pTzFOQlFVMDdVVUZEVEN4TlFVRk5MRWxCUVVrc1MwRkJTeXhEUVVGRExHZEVRVUZuUkN4RFFVRkRMRU5CUVVFN1MwRkRiRVU3UVVGRFNDeERRVUZETzBGQlJVUXNUVUZCVFN4UFFVRlBMRlZCUVZVN1NVRkJka0k3VVVGRFZ5eGpRVUZUTEVkQlFXZERMRVZCUVVVc1EwRkJRVHRSUVVOd1JDeFhRVUZOTEVkQlFWa3NTMEZCU3l4RFFVRkJPMUZCUldZc2FVSkJRVmtzUjBGQmEwSXNSVUZCUlN4RFFVRkJPMUZCUTJoRExHZENRVUZYTEVkQlFXZENMRVZCUVVVc1EwRkJRVHRSUVVNM1FpeHJRa0ZCWVN4SFFVRnRRaXhGUVVGRkxFTkJRVUU3U1VGelNqVkRMRU5CUVVNN1NVRndTa003TzA5QlJVYzdTVUZEU0N4alFVRmpMRU5CUVVNc1YwRkJkVUk3VVVGRGNFTXNTVUZCU1N4RFFVRkRMR0ZCUVdFc1IwRkJSeXhEUVVGRExFZEJRVWNzU1VGQlNTeERRVUZETEdGQlFXRXNSVUZCUlN4WFFVRlhMRU5CUVVNc1EwRkJRVHRKUVVNelJDeERRVUZETzBsQlJVUXNhVUpCUVdsQ0xFTkJRVU1zVjBGQmRVSTdVVUZEZGtNc1NVRkJTU3hEUVVGRExHRkJRV0VzUjBGQlJ5eEpRVUZKTEVOQlFVTXNZVUZCWVN4RFFVRkRMRTFCUVUwc1EwRkJReXhQUVVGUExFTkJRVU1zUlVGQlJTeERRVUZETEU5QlFVOHNTMEZCU3l4WFFVRlhMRU5CUVVNc1EwRkJRVHRKUVVOd1JpeERRVUZETzBsQlJVUXNWMEZCVnl4RFFVRkRMRVZCUVZVc1JVRkJSU3hOUVVGakxFVkJRVVVzU1VGQldTeEZRVUZGTEZOQlFYRkVPMUZCUTNwSExFMUJRVTBzVDBGQlR5eEhRVUZITzFsQlEyUXNUVUZCVFN4RlFVRkZMRWxCUVVrc1YwRkJWeXhEUVVGRExFbEJRVWtzUTBGQlF6dFpRVU0zUWl4SFFVRkhMRVZCUVVVc1JVRkJSVHRaUVVOUUxGbEJRVmtzUlVGQlJTeERRVUZETzFOQlEyaENMRU5CUVVFN1VVRkZSQ3cwUWtGQk5FSTdVVUZETlVJc1RVRkJUU3hOUVVGTkxFZEJRVWNzU1VGQlNTeFhRVUZYTEVOQlFVTXNUMEZCVHl4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVGQk8xRkJRemxETEUxQlFVMHNUVUZCVFN4SFFVRkhMRWxCUVVrc1YwRkJWeXhEUVVGRExFOUJRVThzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUVR0UlFVTTVReXhOUVVGTkxFTkJRVU1zUTBGQlF5eERRVUZETEVkQlFVY3NSVUZCUlN4RFFVRkJPMUZCUTJRc1RVRkJUU3hEUVVGRExFTkJRVU1zUTBGQlF5eEhRVUZITEUxQlFVMHNRMEZCUVR0UlFVTnNRaXhOUVVGTkxFTkJRVU1zUTBGQlF5eERRVUZETEVkQlFVY3NTVUZCU1N4RFFVRkJPMUZCUTJoQ0xFOUJRVThzUTBGQlF5eFpRVUZaTEVkQlFVY3NRMEZCUXl4RFFVRkJPMUZCUlhoQ0xIZERRVUYzUXp0UlFVTjRReXhUUVVGVExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTXNSMEZCUnl4RlFVRkZMRVZCUVVVc1EwRkJReXhIUVVGSExFTkJRVU1zV1VGQldTeERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRMRU5CUVVFN1VVRkRja1FzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRVHRKUVVOMFFpeERRVUZETzBsQlJXRXNTMEZCU3pzN1dVRkRha0lzUzBGQlN5eE5RVUZOTEZkQlFWY3NTVUZCU1N4SlFVRkpMRU5CUVVNc1lVRkJZU3hGUVVGRk8yZENRVU0xUXl4TlFVRk5MRmRCUVZjc1JVRkJSU3hEUVVGQk8yRkJRM0JDTzFGQlEwZ3NRMEZCUXp0TFFVRkJPMGxCUlVRN08wOUJSVWM3U1VGRFJ5eFBRVUZQTEVOQlFVTXNiMEpCUVdkRk96dFpRVU0xUlN4SlFVRkpMRWxCUVVrc1EwRkJReXhOUVVGTkxFVkJRVVU3WjBKQlEyWXNUMEZCVFR0aFFVTlFPMWxCUlVRc2QwZEJRWGRITzFsQlEzaEhMR2RIUVVGblJ6dFpRVU5vUnl4SlFVRkpMRWxCUVVrc1EwRkJReXhYUVVGWExFTkJRVU1zU1VGQlNTeHBRMEZEY0VJc2IwSkJRVzlDTEV0QlFVVXNXVUZCV1N4RlFVRkZMRU5CUVVNc1JVRkRlRU1zVVVGQlVTeEZRVUZGTEVOQlFVTXNSVUZEV0N4SlFVRkpMRVZCUVVVc1EwRkJReXhKUVVOUUxFZEJRVWNzUTBGQlF5eEZRVUZGTzJkQ1FVTk9MRTlCUVUwN1lVRkRVRHRaUVVWRUxFOUJRVThzU1VGQlNTeERRVUZETEZkQlFWY3NRMEZCUXl4TlFVRk5MRVZCUVVVN1owSkJRemxDTEUxQlFVMHNXVUZCV1N4SFFVRkhMRWxCUVVrc1EwRkJReXhYUVVGWExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVRTdaMEpCUTNoRExFOUJRVThzV1VGQldTeERRVUZETEZsQlFWa3NSMEZCUnl4WlFVRlpMRU5CUVVNc1RVRkJUU3hEUVVGRExFMUJRVTBzUlVGQlJUdHZRa0ZETjBRc1RVRkJUU3hGUVVGRkxFZEJRVWNzV1VGQldTeERRVUZETEUxQlFVMHNRMEZCUXl4WlFVRlpMRU5CUVVNc1dVRkJXU3hEUVVGRExFTkJRVUU3YjBKQlEzcEVMRTFCUVUwc1ZVRkJWU3hIUVVGSExGbEJRVmtzUTBGQlF5eE5RVUZOTEVOQlFVTXNXVUZCV1N4RFFVRkRMRmxCUVZrc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlFUdHZRa0ZEY2tVc1dVRkJXU3hEUVVGRExFbEJRVWtzUjBGQlJ5eFZRVUZWTEV0QlFVc3NSVUZCUlN4RFFVRkJPMjlDUVVOeVF5eE5RVUZOTEUxQlFVMHNSMEZCUnl4VlFVRlZMRWRCUVVjc1ZVRkJWU3hEUVVGQk8yOUNRVVYwUXl4SlFVRkpMRmxCUVZrc1EwRkJReXhKUVVGSkxFZEJRVWNzV1VGQldTeERRVUZETEUxQlFVMHNRMEZCUXl4VlFVRlZMRVZCUVVVN2QwSkJRM1JFTEUxQlFVMHNTVUZCU1N4TFFVRkxMRU5CUVVNc01FSkJRVEJDTEVOQlFVTXNRMEZCUVR0eFFrRkROVU03YjBKQlJVUXNUVUZCVFN4UlFVRlJMRWRCUVVjc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eEZRVUZGTEVOQlFVTXNRMEZCUVR0dlFrRkRia01zU1VGQlNTeFJRVUZSTEVWQlFVVTdkMEpCUTFvc1dVRkJXU3hEUVVGRExGbEJRVmtzU1VGQlNTeERRVUZETEVOQlFVRTdkMEpCUXpsQ0xGbEJRVmtzUTBGQlF5eFJRVUZSTEVkQlFVY3NRMEZCUXl4RFFVRkJPM2RDUVVONlFpeEpRVUZKT3pSQ1FVTkdMR0ZCUVdFN05FSkJRMklzVFVGQlRTeFJRVUZSTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNc1dVRkJXU3hEUVVGRExFTkJRVUU3ZVVKQlEzSkRPM2RDUVVGRExFOUJRVThzUTBGQlF5eEZRVUZGT3pSQ1FVTldMRTlCUVU4c1EwRkJReXhMUVVGTExFTkJRVU03V1VGRFpDeFJRVUZSTEVOQlFVTXNWMEZCVnl4RFFVRkRMRWxCUVVrc1NVRkJTU3hOUVVGTk8xRkJRM1pETEVOQlFVTXNRMEZCUXl4SlFVRkpMR0ZCUVdFc1EwRkJReXhEUVVGRExFOUJRVThzVlVGQlZTeERRVUZETEVOQlFVTXNTVUZCU1RzN1JVRkZiRVFzUTBGQlF5eERRVUZETEV0QlFVczdRMEZEVWl4RFFVRkRMRU5CUVVFN05FSkJRMVVzU1VGQlNTeERRVUZETEV0QlFVc3NSVUZCUlN4RFFVRkJPelJDUVVOYUxFMUJRVTBzUTBGQlF5eERRVUZCTzNsQ1FVTlNPM2RDUVVORUxFbEJRVWtzU1VGQlNTeERRVUZETEUxQlFVMHNSVUZCUlRzMFFrRkRaaXhQUVVGTk8zbENRVU5RTzNGQ1FVTkdPM2xDUVVGTk8zZENRVU5NTEUxQlFVMHNTVUZCU1N4TFFVRkxMRU5CUVVNc2EwSkJRV3RDTEVWQlFVVXNSVUZCUlN4RFFVRkRMRU5CUVVFN2NVSkJRM2hETzJsQ1FVTkdPMmRDUVVORUxFbEJRVWtzUTBGQlF5eFhRVUZYTEVOQlFVTXNTMEZCU3l4RlFVRkZMRU5CUVVFN1lVRkRla0k3V1VGRlJDeEpRVUZKTEVOQlFVTXNTMEZCU3l4RlFVRkZMRU5CUVVFN1dVRkZXaXhOUVVGTkxFbEJRVWtzUTBGQlF5eExRVUZMTEVWQlFVVXNRMEZCUVR0UlFVTndRaXhEUVVGRE8wdEJRVUU3U1VGRlJEczdUMEZGUnp0SlFVTklMRTFCUVUwc1EwRkJReXhQUVVGdlFqdFJRVU42UWl4SlFVRkpMRWxCUVVrc1EwRkJReXhOUVVGTkxFVkJRVVU3V1VGRFppeFBRVUZOTzFOQlExQTdVVUZGUkN4SlFVRkpMRU5CUVVNc1dVRkJXU3hEUVVGRExFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUVR0SlFVTnFReXhEUVVGRE8wbEJSVVFzUzBGQlN6czdVVUZEU0N4SlFVRkpMRWxCUVVrc1EwRkJReXhOUVVGTkxFVkJRVVU3V1VGRFppeFBRVUZOTzFOQlExQTdVVUZEUkN4SlFVRkpMRWxCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU1zVFVGQlRTeExRVUZMTEVOQlFVTXNSVUZCUlR0WlFVTnNReXhQUVVGTk8xTkJRMUE3VVVGRlJDeE5RVUZCTEVsQlFVa3NRMEZCUXl4UFFVRlBMQ3REUVVGYUxFbEJRVWtzUlVGQlZ5eEpRVUZKTEVOQlFVTXNXVUZCV1N4RlFVRkRPMUZCUTJwRExFbEJRVWtzUTBGQlF5eFpRVUZaTEVkQlFVY3NSVUZCUlN4RFFVRkJPMGxCUTNoQ0xFTkJRVU03U1VGRlJDeExRVUZMTzFGQlEwZ3NTVUZCU1N4SlFVRkpMRU5CUVVNc1RVRkJUU3hGUVVGRk8xbEJRMllzVDBGQlRUdFRRVU5RTzFGQlJVUXNkME5CUVhkRE8xRkJRM2hETEUxQlFVMHNRMEZCUXl4TlFVRk5MRU5CUVVNc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNc1JVRkJSU3hEUVVGRExFVkJRVVVzUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUXl4RlFVRkZMRWRCUVVjc1EwRkJReXhEUVVGRExFVkJRVVVzUTBGQlF5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRMRkZCUVZFc1JVRkJSU3hGUVVGRkxFTkJRVU1zVVVGQlVTeERRVUZETEU5QlFVOHNSVUZCUlN4RFFVRkRMRU5CUVVFN1VVRkRia2NzU1VGQlNTeERRVUZETEUxQlFVMHNSMEZCUnl4SlFVRkpMRU5CUVVFN1NVRkRjRUlzUTBGQlF6dEpRVVZFTEdkQ1FVRm5RaXhEUVVGRExGRkJRV3RDTzFGQlEycERMRWxCUVVrc1NVRkJTU3hEUVVGRExFMUJRVTBzUlVGQlJUdFpRVU5tTEU5QlFVMDdVMEZEVUR0UlFVTkVMRWxCUVVrc1VVRkJVU3hEUVVGRExFVkJRVVVzU1VGQlNTeEpRVUZKTEVOQlFVTXNVMEZCVXl4RlFVRkZPMWxCUTJwRExFMUJRVTBzU1VGQlNTeExRVUZMTEVOQlFVTXNjMEpCUVhOQ0xGRkJRVkVzUTBGQlF5eEZRVUZGTEhWQ1FVRjFRaXhEUVVGRExFTkJRVUU3VTBGRE1VVTdVVUZEUkN4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExGRkJRVkVzUTBGQlF5eEZRVUZGTEVOQlFVTXNSMEZCUnl4UlFVRlJMRU5CUVVFN1NVRkRlRU1zUTBGQlF6dEpRVVZFTEd0Q1FVRnJRaXhEUVVGRExGRkJRV3RDTzFGQlEyNURMRWxCUVVrc1NVRkJTU3hEUVVGRExFMUJRVTBzUlVGQlJUdFpRVU5tTEU5QlFVMDdVMEZEVUR0UlFVTkVMRTlCUVU4c1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eFJRVUZSTEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVFN1NVRkRjRU1zUTBGQlF6dERRVU5HSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUx5cGNiazFKVkNCTWFXTmxibk5sWEc1Y2JrTnZjSGx5YVdkb2RDQW9ZeWtnTWpBeU1DQkZjbWxySUVSbElGSnBhbU5yWlZ4dVhHNVFaWEp0YVhOemFXOXVJR2x6SUdobGNtVmllU0JuY21GdWRHVmtMQ0JtY21WbElHOW1JR05vWVhKblpTd2dkRzhnWVc1NUlIQmxjbk52YmlCdlluUmhhVzVwYm1jZ1lTQmpiM0I1WEc1dlppQjBhR2x6SUhOdlpuUjNZWEpsSUdGdVpDQmhjM052WTJsaGRHVmtJR1J2WTNWdFpXNTBZWFJwYjI0Z1ptbHNaWE1nS0hSb1pTQmNJbE52Wm5SM1lYSmxYQ0lwTENCMGJ5QmtaV0ZzWEc1cGJpQjBhR1VnVTI5bWRIZGhjbVVnZDJsMGFHOTFkQ0J5WlhOMGNtbGpkR2x2Yml3Z2FXNWpiSFZrYVc1bklIZHBkR2h2ZFhRZ2JHbHRhWFJoZEdsdmJpQjBhR1VnY21sbmFIUnpYRzUwYnlCMWMyVXNJR052Y0hrc0lHMXZaR2xtZVN3Z2JXVnlaMlVzSUhCMVlteHBjMmdzSUdScGMzUnlhV0oxZEdVc0lITjFZbXhwWTJWdWMyVXNJR0Z1WkM5dmNpQnpaV3hzWEc1amIzQnBaWE1nYjJZZ2RHaGxJRk52Wm5SM1lYSmxMQ0JoYm1RZ2RHOGdjR1Z5YldsMElIQmxjbk52Ym5NZ2RHOGdkMmh2YlNCMGFHVWdVMjltZEhkaGNtVWdhWE5jYm1aMWNtNXBjMmhsWkNCMGJ5QmtieUJ6Ynl3Z2MzVmlhbVZqZENCMGJ5QjBhR1VnWm05c2JHOTNhVzVuSUdOdmJtUnBkR2x2Ym5NNlhHNWNiaUFnVkdobElHRmliM1psSUdOdmNIbHlhV2RvZENCdWIzUnBZMlVnWVc1a0lIUm9hWE1nY0dWeWJXbHpjMmx2YmlCdWIzUnBZMlVnYzJoaGJHd2dZbVVnYVc1amJIVmtaV1FnYVc0Z1lXeHNYRzVqYjNCcFpYTWdiM0lnYzNWaWMzUmhiblJwWVd3Z2NHOXlkR2x2Ym5NZ2IyWWdkR2hsSUZOdlpuUjNZWEpsTGx4dVhHNGdJRlJJUlNCVFQwWlVWMEZTUlNCSlV5QlFVazlXU1VSRlJDQmNJa0ZUSUVsVFhDSXNJRmRKVkVoUFZWUWdWMEZTVWtGT1ZGa2dUMFlnUVU1WklFdEpUa1FzSUVWWVVGSkZVMU1nVDFKY2JrbE5VRXhKUlVRc0lFbE9RMHhWUkVsT1J5QkNWVlFnVGs5VUlFeEpUVWxVUlVRZ1ZFOGdWRWhGSUZkQlVsSkJUbFJKUlZNZ1QwWWdUVVZTUTBoQlRsUkJRa2xNU1ZSWkxGeHVJQ0JHU1ZST1JWTlRJRVpQVWlCQklGQkJVbFJKUTFWTVFWSWdVRlZTVUU5VFJTQkJUa1FnVGs5T1NVNUdVa2xPUjBWTlJVNVVMaUJKVGlCT1R5QkZWa1ZPVkNCVFNFRk1UQ0JVU0VWY2JrRlZWRWhQVWxNZ1QxSWdRMDlRV1ZKSlIwaFVJRWhQVEVSRlVsTWdRa1VnVEVsQlFreEZJRVpQVWlCQlRsa2dRMHhCU1Uwc0lFUkJUVUZIUlZNZ1QxSWdUMVJJUlZKY2JreEpRVUpKVEVsVVdTd2dWMGhGVkVoRlVpQkpUaUJCVGlCQlExUkpUMDRnVDBZZ1EwOU9WRkpCUTFRc0lGUlBVbFFnVDFJZ1QxUklSVkpYU1ZORkxDQkJVa2xUU1U1SElFWlNUMDBzWEc0Z0lFOVZWQ0JQUmlCUFVpQkpUaUJEVDA1T1JVTlVTVTlPSUZkSlZFZ2dWRWhGSUZOUFJsUlhRVkpGSUU5U0lGUklSU0JWVTBVZ1QxSWdUMVJJUlZJZ1JFVkJURWxPUjFNZ1NVNGdWRWhGWEc1VFQwWlVWMEZTUlM1Y2Jpb3ZYRzVqYjI1emRDQjBaWGgwUkdWamIyUmxjaUE5SUc1bGR5QlVaWGgwUkdWamIyUmxjaWduZFhSbU9DY3BYRzVjYm1WNGNHOXlkQ0JqYkdGemN5QlhiRTlpYW1WamRDQjdYRzRnSUhKbFlXUnZibXg1SUdsa09pQnVkVzFpWlhKY2JpQWdMeThnUUhSekxXbG5ibTl5WlZ4dUlDQndjbWwyWVhSbElGOWtaWE4wY205NVVtVnpiMngyWlhJNklDZ3BJRDArSUhadmFXUmNiaUFnY0hKcGRtRjBaU0J5WldGa2IyNXNlU0JmWkdWemRISnZlVkJ5YjIxcGMyVTZJRkJ5YjIxcGMyVThkbTlwWkQ0Z1BTQnVaWGNnVUhKdmJXbHpaU2h5WlhOdmJIWmxJRDArSUhSb2FYTXVYMlJsYzNSeWIzbFNaWE52YkhabGNpQTlJSEpsYzI5c2RtVXBYRzRnSUhCeWFYWmhkR1VnWDJSbGMzUnliM2xNYVhOMFpXNWxjbk02SUNnb2QyeFBZbXBsWTNRNklGZHNUMkpxWldOMEtTQTlQaUIyYjJsa0tWdGRJRDBnVzExY2JseHVJQ0JqYjI1emRISjFZM1J2Y2locFpEb2diblZ0WW1WeUtTQjdYRzRnSUNBZ2RHaHBjeTVwWkNBOUlHbGtYRzRnSUNBZ2RHaHBjeTVmWkdWemRISnZlVkJ5YjIxcGMyVXVkR2hsYmlnb0tTQTlQaUIwYUdsekxsOWtaWE4wY205NVRHbHpkR1Z1WlhKekxtWnZja1ZoWTJnb1pHVnpkSEp2ZVV4cGMzUmxibVZ5SUQwK0lHUmxjM1J5YjNsTWFYTjBaVzVsY2loMGFHbHpLU2twWEc0Z0lIMWNibHh1SUNCa1pYTjBjbTk1S0NrZ2UxeHVJQ0FnSUhSb2FYTXVYMlJsYzNSeWIzbFNaWE52YkhabGNpZ3BYRzRnSUgxY2JseHVJQ0JoWkdSRVpYTjBjbTk1VEdsemRHVnVaWElvWkdWemRISnZlVXhwYzNSbGJtVnlPaUFvZDJ4UFltcGxZM1E2SUZkc1QySnFaV04wS1NBOVBpQjJiMmxrS1NCN1hHNGdJQ0FnZEdocGN5NWZaR1Z6ZEhKdmVVeHBjM1JsYm1WeWN5NXdkWE5vS0dSbGMzUnliM2xNYVhOMFpXNWxjaWxjYmlBZ2ZWeHVYRzRnSUhKbGJXOTJaVVJsYzNSeWIzbE1hWE4wWlc1bGNpaGtaWE4wY205NVRHbHpkR1Z1WlhJNklDaDNiRTlpYW1WamREb2dWMnhQWW1wbFkzUXBJRDArSUhadmFXUXBJSHRjYmlBZ0lDQjBhR2x6TGw5a1pYTjBjbTk1VEdsemRHVnVaWEp6SUQwZ2RHaHBjeTVmWkdWemRISnZlVXhwYzNSbGJtVnljeTVtYVd4MFpYSW9LR2wwWlcwcElEMCtJR2wwWlcwZ0lUMDlJR1JsYzNSeWIzbE1hWE4wWlc1bGNpbGNiaUFnZlZ4dVhHNGdJRzl1UkdWemRISnZlU2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3k1ZlpHVnpkSEp2ZVZCeWIyMXBjMlZjYmlBZ2ZWeHVmVnh1WEc1bGVIQnZjblFnWTJ4aGMzTWdSbWw0WldRZ2UxeHVJQ0J5WldGa2IyNXNlU0JmY21GM09pQnVkVzFpWlhKY2JseHVJQ0J6ZEdGMGFXTWdjR0Z5YzJVb1pHRjBZVG9nYm5WdFltVnlLVG9nUm1sNFpXUWdlMXh1SUNBZ0lISmxkSFZ5YmlCdVpYY2dSbWw0WldRb0tHUmhkR0VnS2lBeU5UWXVNQ2tnUGo0Z01DbGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJTWlhCeVpYTmxiblFnWm1sNFpXUWdZWE1nWVNCemFXZHVaV1FnTWpRdFltbDBJR2x1ZEdWblpYSXVYRzRnSUNBcVhHNGdJQ0FxTDF4dUlDQmhjMGx1ZENncE9pQnVkVzFpWlhJZ2UxeHVJQ0FnSUhKbGRIVnliaUFvS0hSb2FYTXVYM0poZHlBdklESTFOaTR3S1NBK1BpQXdLVnh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUZKbGNISmxjMlZ1ZENCbWFYaGxaQ0JoY3lCaElITnBaMjVsWkNBeU5DMWlhWFFnYm5WdFltVnlJSGRwZEdnZ1lXNGdPQzFpYVhRZ1puSmhZM1JwYjI1aGJDQndZWEowTGx4dUlDQWdLbHh1SUNBZ0tpOWNiaUFnWVhORWIzVmliR1VvS1RvZ2JuVnRZbVZ5SUh0Y2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3k1ZmNtRjNJQzhnTWpVMkxqQmNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUIxYzJVZ2NHRnljMlZHYVhobFpDQnBibk4wWldGa1hHNGdJQ0FxSUVCd1lYSmhiU0I3Ym5WdFltVnlmWEpoZDF4dUlDQWdLaTljYmlBZ1kyOXVjM1J5ZFdOMGIzSW9jbUYzT2lCdWRXMWlaWElwSUh0Y2JpQWdJQ0IwYUdsekxsOXlZWGNnUFNCeVlYZGNiaUFnZlZ4dWZWeHVYRzVsZUhCdmNuUWdZMnhoYzNNZ1YyVmlSa1FnZTF4dUlDQnlaV0ZrYjI1c2VTQm1aRG9nYm5WdFltVnlYRzRnSUhKbFlXUnZibXg1SUhSNWNHVTZJQ2RKYldGblpVSnBkRzFoY0NjZ2ZDQW5RWEp5WVhsQ2RXWm1aWEluSUh3Z0owMWxjM05oWjJWUWIzSjBKeUI4SUNkUFptWnpZM0psWlc1RFlXNTJZWE1uWEc0Z0lISmxZV1J2Ym14NUlIVnliRG9nVlZKTVhHNGdJSEJ5YVhaaGRHVWdjbVZoWkc5dWJIa2dYMjl1UjJWMFZISmhibk5tWlhKaFlteGxPaUFvZDJWaVJtUTZJRmRsWWtaRUtTQTlQaUJRY205dGFYTmxQRlJ5WVc1elptVnlZV0pzWlQ1Y2JpQWdjSEpwZG1GMFpTQnlaV0ZrYjI1c2VTQmZiMjVEYkc5elpUb2dLSGRsWWtaa09pQlhaV0pHUkNrZ1BUNGdkbTlwWkZ4dVhHNGdJR052Ym5OMGNuVmpkRzl5S0Z4dUlDQWdJR1prT2lCdWRXMWlaWElzWEc0Z0lDQWdabVJVZVhCbE9pQW5TVzFoWjJWQ2FYUnRZWEFuSUh3Z0owRnljbUY1UW5WbVptVnlKeUI4SUNkTlpYTnpZV2RsVUc5eWRDY2dmQ0FuVDJabWMyTnlaV1Z1UTJGdWRtRnpKeXhjYmlBZ0lDQm1aRlZTVERvZ1ZWSk1MRnh1SUNBZ0lHOXVSMlYwVkhKaGJuTm1aWEpoWW14bE9pQW9kMlZpUm1RNklGZGxZa1pFS1NBOVBpQlFjbTl0YVhObFBGUnlZVzV6Wm1WeVlXSnNaVDRzWEc0Z0lDQWdiMjVEYkc5elpUb2dLSGRsWWtaa09pQlhaV0pHUkNrZ1BUNGdkbTlwWkZ4dUlDQXBJSHRjYmlBZ0lDQjBhR2x6TG1aa0lEMGdabVJjYmlBZ0lDQjBhR2x6TG5SNWNHVWdQU0JtWkZSNWNHVmNiaUFnSUNCMGFHbHpMblZ5YkNBOUlHWmtWVkpNWEc0Z0lDQWdkR2hwY3k1ZmIyNUhaWFJVY21GdWMyWmxjbUZpYkdVZ1BTQnZia2RsZEZSeVlXNXpabVZ5WVdKc1pWeHVJQ0FnSUhSb2FYTXVYMjl1UTJ4dmMyVWdQU0J2YmtOc2IzTmxYRzRnSUgxY2JseHVJQ0JoYzNsdVl5Qm5aWFJVY21GdWMyWmxjbUZpYkdVb0tUb2dVSEp2YldselpUeFVjbUZ1YzJabGNtRmliR1UrSUh0Y2JpQWdJQ0J5WlhSMWNtNGdZWGRoYVhRZ2RHaHBjeTVmYjI1SFpYUlVjbUZ1YzJabGNtRmliR1VvZEdocGN5bGNiaUFnZlZ4dVhHNGdJR05zYjNObEtDa2dlMXh1SUNBZ0lIUm9hWE11WDI5dVEyeHZjMlVvZEdocGN5bGNiaUFnZlZ4dWZWeHVYRzVsZUhCdmNuUWdhVzUwWlhKbVlXTmxJRTFsYzNOaFoyVk5ZWEp6YUdGc2JHbHVaME52Ym5SbGVIUThWaUJsZUhSbGJtUnpJRzUxYldKbGNpQjhJRmRsWWtaRUlId2dSbWw0WldRZ2ZDQlhiRTlpYW1WamRDQjhJREFnZkNCemRISnBibWNnZkNCQmNuSmhlVUoxWm1abGNsWnBaWGNnZkNCMWJtUmxabWx1WldRc1hHNGdJRlFnWlhoMFpXNWtjeUFuZFNjZ2ZDQW5hQ2NnZkNBbmFTY2dmQ0FuWmljZ2ZDQW5ieWNnZkNBbmJpY2dmQ0FuY3ljZ2ZDQW5ZU2NzWEc0Z0lGTWdaWGgwWlc1a2N5QXdJSHdnTkNCOElHNTFiV0psY2o0Z2UxeHVJQ0IyWVd4MVpUb2dWaXhjYmlBZ2NtVmhaRzl1YkhrZ2RIbHdaVG9nVkN4Y2JpQWdjbVZoWkc5dWJIa2djMmw2WlRvZ2JuVnRZbVZ5TEZ4dUlDQnlaV0ZrYjI1c2VTQnZjSFJwYjI1aGJEb2dZbTl2YkdWaGJpeGNiaUFnY21WaFpHOXViSGtnWDIxaGNuTm9ZV3hzUVhKbk9pQW9kMmx5WlUxelp6b2dleUJpZFdabVpYSTZJRUZ5Y21GNVFuVm1abVZ5TENCbVpITTZJRUZ5Y21GNVBGZGxZa1pFUGl3Z1luVm1abVZ5VDJabWMyVjBPaUJ1ZFcxaVpYSWdmU2tnUFQ0Z2RtOXBaRnh1ZlZ4dVhHNWxlSEJ2Y25RZ2FXNTBaWEptWVdObElGZHNUV1Z6YzJGblpTQjdYRzRnSUdKMVptWmxjam9nVldsdWRETXlRWEp5WVhrc1hHNGdJR1prY3pvZ1FYSnlZWGs4VjJWaVJrUStMRnh1SUNCaWRXWm1aWEpQWm1aelpYUTZJRzUxYldKbGNpeGNiaUFnWTI5dWMzVnRaV1E2SUc1MWJXSmxjaXhjYmlBZ2MybDZaVG9nYm5WdFltVnlYRzU5WEc1Y2JtVjRjRzl5ZENCcGJuUmxjbVpoWTJVZ1UyVnVaRTFsYzNOaFoyVWdlMXh1SUNCaWRXWm1aWEk2SUVGeWNtRjVRblZtWm1WeUxGeHVJQ0JtWkhNNklFRnljbUY1UEZkbFlrWkVQbHh1ZlZ4dVhHNWxlSEJ2Y25RZ1puVnVZM1JwYjI0Z2RXbHVkQ2hoY21jNklHNTFiV0psY2lrNklFMWxjM05oWjJWTllYSnphR0ZzYkdsdVowTnZiblJsZUhROGJuVnRZbVZ5TENBbmRTY3NJRFErSUh0Y2JpQWdjbVYwZFhKdUlIdGNiaUFnSUNCMllXeDFaVG9nWVhKbkxGeHVJQ0FnSUhSNWNHVTZJQ2QxSnl4Y2JpQWdJQ0J6YVhwbE9pQTBMRnh1SUNBZ0lHOXdkR2x2Ym1Gc09pQm1ZV3h6WlN4Y2JpQWdJQ0JmYldGeWMyaGhiR3hCY21jNklHWjFibU4wYVc5dUtIZHBjbVZOYzJjcElIdGNiaUFnSUNBZ0lHNWxkeUJWYVc1ME16SkJjbkpoZVNoM2FYSmxUWE5uTG1KMVptWmxjaXdnZDJseVpVMXpaeTVpZFdabVpYSlBabVp6WlhRc0lERXBXekJkSUQwZ1lYSm5YRzRnSUNBZ0lDQjNhWEpsVFhObkxtSjFabVpsY2s5bVpuTmxkQ0FyUFNCMGFHbHpMbk5wZW1WY2JpQWdJQ0I5WEc0Z0lIMWNibjFjYmx4dVpYaHdiM0owSUdaMWJtTjBhVzl1SUdacGJHVkVaWE5qY21sd2RHOXlLR0Z5WnpvZ1YyVmlSa1FwT2lCTlpYTnpZV2RsVFdGeWMyaGhiR3hwYm1kRGIyNTBaWGgwUEZkbFlrWkVMQ0FuYUNjc0lEQStJSHRjYmlBZ2NtVjBkWEp1SUh0Y2JpQWdJQ0IyWVd4MVpUb2dZWEpuTEZ4dUlDQWdJSFI1Y0dVNklDZG9KeXhjYmlBZ0lDQnphWHBsT2lBd0xDQXZMeUJtYVd4bElHUmxjMk55YVhCMGIzSnpJR0Z5WlNCdWIzUWdZV1JrWldRZ2RHOGdkR2hsSUcxbGMzTmhaMlVnYzJsNlpTQmlaV05oZFhObElIUm9aWGtnWVhKbElITnZiV1YzYUdGMElHTnZibk5wWkdWeVpXUWdiV1YwWVNCa1lYUmhMbHh1SUNBZ0lHOXdkR2x2Ym1Gc09pQm1ZV3h6WlN4Y2JpQWdJQ0JmYldGeWMyaGhiR3hCY21jNklHWjFibU4wYVc5dUtIZHBjbVZOYzJjcElIdGNiaUFnSUNBZ0lIZHBjbVZOYzJjdVptUnpMbkIxYzJnb1lYSm5LVnh1SUNBZ0lIMWNiaUFnZlZ4dWZWeHVYRzVsZUhCdmNuUWdablZ1WTNScGIyNGdhVzUwS0dGeVp6b2diblZ0WW1WeUtUb2dUV1Z6YzJGblpVMWhjbk5vWVd4c2FXNW5RMjl1ZEdWNGREeHVkVzFpWlhJc0lDZHBKeXdnTkQ0Z2UxeHVJQ0J5WlhSMWNtNGdlMXh1SUNBZ0lIWmhiSFZsT2lCaGNtY3NYRzRnSUNBZ2RIbHdaVG9nSjJrbkxGeHVJQ0FnSUhOcGVtVTZJRFFzWEc0Z0lDQWdiM0IwYVc5dVlXdzZJR1poYkhObExGeHVJQ0FnSUY5dFlYSnphR0ZzYkVGeVp6b2dablZ1WTNScGIyNG9kMmx5WlUxelp5a2dlMXh1SUNBZ0lDQWdibVYzSUVsdWRETXlRWEp5WVhrb2QybHlaVTF6Wnk1aWRXWm1aWElzSUhkcGNtVk5jMmN1WW5WbVptVnlUMlptYzJWMExDQXhLVnN3WFNBOUlIUm9hWE11ZG1Gc2RXVmNiaUFnSUNBZ0lIZHBjbVZOYzJjdVluVm1abVZ5VDJabWMyVjBJQ3M5SUhSb2FYTXVjMmw2WlZ4dUlDQWdJSDFjYmlBZ2ZWeHVmVnh1WEc1bGVIQnZjblFnWm5WdVkzUnBiMjRnWm1sNFpXUW9ZWEpuT2lCR2FYaGxaQ2s2SUUxbGMzTmhaMlZOWVhKemFHRnNiR2x1WjBOdmJuUmxlSFE4Um1sNFpXUXNJQ2RtSnl3Z05ENGdlMXh1SUNCeVpYUjFjbTRnZTF4dUlDQWdJSFpoYkhWbE9pQmhjbWNzWEc0Z0lDQWdkSGx3WlRvZ0oyWW5MRnh1SUNBZ0lITnBlbVU2SURRc1hHNGdJQ0FnYjNCMGFXOXVZV3c2SUdaaGJITmxMRnh1SUNBZ0lGOXRZWEp6YUdGc2JFRnlaem9nWm5WdVkzUnBiMjRvZDJseVpVMXpaeWtnZTF4dUlDQWdJQ0FnYm1WM0lFbHVkRE15UVhKeVlYa29kMmx5WlUxelp5NWlkV1ptWlhJc0lIZHBjbVZOYzJjdVluVm1abVZ5VDJabWMyVjBMQ0F4S1Zzd1hTQTlJSFJvYVhNdWRtRnNkV1V1WDNKaGQxeHVJQ0FnSUNBZ2QybHlaVTF6Wnk1aWRXWm1aWEpQWm1aelpYUWdLejBnZEdocGN5NXphWHBsWEc0Z0lDQWdmVnh1SUNCOVhHNTlYRzVjYm1WNGNHOXlkQ0JtZFc1amRHbHZiaUJ2WW1wbFkzUW9ZWEpuT2lCWGJFOWlhbVZqZENrNklFMWxjM05oWjJWTllYSnphR0ZzYkdsdVowTnZiblJsZUhROFYyeFBZbXBsWTNRc0lDZHZKeXdnTkQ0Z2UxeHVJQ0J5WlhSMWNtNGdlMXh1SUNBZ0lIWmhiSFZsT2lCaGNtY3NYRzRnSUNBZ2RIbHdaVG9nSjI4bkxGeHVJQ0FnSUhOcGVtVTZJRFFzWEc0Z0lDQWdiM0IwYVc5dVlXdzZJR1poYkhObExGeHVJQ0FnSUY5dFlYSnphR0ZzYkVGeVp6b2dablZ1WTNScGIyNG9kMmx5WlUxelp5a2dlMXh1SUNBZ0lDQWdibVYzSUZWcGJuUXpNa0Z5Y21GNUtIZHBjbVZOYzJjdVluVm1abVZ5TENCM2FYSmxUWE5uTG1KMVptWmxjazltWm5ObGRDd2dNU2xiTUYwZ1BTQjBhR2x6TG5aaGJIVmxMbWxrWEc0Z0lDQWdJQ0IzYVhKbFRYTm5MbUoxWm1abGNrOW1abk5sZENBclBTQjBhR2x6TG5OcGVtVmNiaUFnSUNCOVhHNGdJSDFjYm4xY2JseHVaWGh3YjNKMElHWjFibU4wYVc5dUlHOWlhbVZqZEU5d2RHbHZibUZzS0dGeVp6ODZJRmRzVDJKcVpXTjBLVG9nVFdWemMyRm5aVTFoY25Ob1lXeHNhVzVuUTI5dWRHVjRkRHhYYkU5aWFtVmpkQ0I4SUhWdVpHVm1hVzVsWkN3Z0oyOG5MQ0EwUGlCN1hHNGdJSEpsZEhWeWJpQjdYRzRnSUNBZ2RtRnNkV1U2SUdGeVp5eGNiaUFnSUNCMGVYQmxPaUFuYnljc1hHNGdJQ0FnYzJsNlpUb2dOQ3hjYmlBZ0lDQnZjSFJwYjI1aGJEb2dkSEoxWlN4Y2JpQWdJQ0JmYldGeWMyaGhiR3hCY21jNklHWjFibU4wYVc5dUtIZHBjbVZOYzJjcElIdGNiaUFnSUNBZ0lHNWxkeUJWYVc1ME16SkJjbkpoZVNoM2FYSmxUWE5uTG1KMVptWmxjaXdnZDJseVpVMXpaeTVpZFdabVpYSlBabVp6WlhRc0lERXBXekJkSUQwZ0tIUm9hWE11ZG1Gc2RXVWdQVDA5SUhWdVpHVm1hVzVsWkNBL0lEQWdPaUIwYUdsekxuWmhiSFZsTG1sa0tWeHVJQ0FnSUNBZ2QybHlaVTF6Wnk1aWRXWm1aWEpQWm1aelpYUWdLejBnZEdocGN5NXphWHBsWEc0Z0lDQWdmVnh1SUNCOVhHNTlYRzVjYm1WNGNHOXlkQ0JtZFc1amRHbHZiaUJ1WlhkUFltcGxZM1FvS1RvZ1RXVnpjMkZuWlUxaGNuTm9ZV3hzYVc1blEyOXVkR1Y0ZER3d0xDQW5iaWNzSURRK0lIdGNiaUFnY21WMGRYSnVJSHRjYmlBZ0lDQjJZV3gxWlRvZ01Dd2dMeThnYVdRZ1ptbHNiR1ZrSUdsdUlHSjVJRjl0WVhKemFHRnNiRU52Ym5OMGNuVmpkRzl5WEc0Z0lDQWdkSGx3WlRvZ0oyNG5MRnh1SUNBZ0lITnBlbVU2SURRc1hHNGdJQ0FnYjNCMGFXOXVZV3c2SUdaaGJITmxMRnh1SUNBZ0lGOXRZWEp6YUdGc2JFRnlaem9nWm5WdVkzUnBiMjRvZDJseVpVMXpaeWtnZTF4dUlDQWdJQ0FnYm1WM0lGVnBiblF6TWtGeWNtRjVLSGRwY21WTmMyY3VZblZtWm1WeUxDQjNhWEpsVFhObkxtSjFabVpsY2s5bVpuTmxkQ3dnTVNsYk1GMGdQU0IwYUdsekxuWmhiSFZsWEc0Z0lDQWdJQ0IzYVhKbFRYTm5MbUoxWm1abGNrOW1abk5sZENBclBTQjBhR2x6TG5OcGVtVmNiaUFnSUNCOVhHNGdJSDFjYm4xY2JseHVaWGh3YjNKMElHWjFibU4wYVc5dUlITjBjbWx1WnloaGNtYzZJSE4wY21sdVp5azZJRTFsYzNOaFoyVk5ZWEp6YUdGc2JHbHVaME52Ym5SbGVIUThjM1J5YVc1bkxDQW5jeWNzSUc1MWJXSmxjajRnZTF4dUlDQnlaWFIxY200Z2UxeHVJQ0FnSUhaaGJIVmxPaUJnSkh0aGNtZDlYRnd3WUN4Y2JpQWdJQ0IwZVhCbE9pQW5jeWNzWEc0Z0lDQWdjMmw2WlRvZ05DQXJJQ2htZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0FnSUM4dklHWmhibU41SUd4dloybGpJSFJ2SUdOaGJHTjFiR0YwWlNCemFYcGxJSGRwZEdnZ2NHRmtaR2x1WnlCMGJ5QmhJRzExYkhScGNHeGxJRzltSURRZ1lubDBaWE1nS0dsdWRDa3VYRzRnSUNBZ0lDQXZMeUJzWlc1bmRHZ3JNU0JtYjNJZ2JuVnNiQ0IwWlhKdGFXNWhkRzl5WEc0Z0lDQWdJQ0J5WlhSMWNtNGdLR0Z5Wnk1c1pXNW5kR2dnS3lBeElDc2dNeWtnSmlCK00xeHVJQ0FnSUgwcEtDa3NYRzRnSUNBZ2IzQjBhVzl1WVd3NklHWmhiSE5sTEZ4dUlDQWdJRjl0WVhKemFHRnNiRUZ5WnpvZ1puVnVZM1JwYjI0b2QybHlaVTF6WnlrZ2UxeHVJQ0FnSUNBZ2JtVjNJRlZwYm5Rek1rRnljbUY1S0hkcGNtVk5jMmN1WW5WbVptVnlMQ0IzYVhKbFRYTm5MbUoxWm1abGNrOW1abk5sZEN3Z01TbGJNRjBnUFNCMGFHbHpMblpoYkhWbExteGxibWQwYUZ4dVhHNGdJQ0FnSUNCamIyNXpkQ0J6ZEhKTVpXNGdQU0IwYUdsekxuWmhiSFZsTG14bGJtZDBhRnh1SUNBZ0lDQWdZMjl1YzNRZ1luVm1PQ0E5SUc1bGR5QlZhVzUwT0VGeWNtRjVLSGRwY21WTmMyY3VZblZtWm1WeUxDQjNhWEpsVFhObkxtSjFabVpsY2s5bVpuTmxkQ0FySURRc0lITjBja3hsYmlsY2JpQWdJQ0FnSUdadmNpQW9iR1YwSUdrZ1BTQXdPeUJwSUR3Z2MzUnlUR1Z1T3lCcEt5c3BJSHRjYmlBZ0lDQWdJQ0FnWW5WbU9GdHBYU0E5SUhSb2FYTXVkbUZzZFdWYmFWMHVZMmhoY2tOdlpHVkJkQ2d3S1Z4dUlDQWdJQ0FnZlZ4dUlDQWdJQ0FnZDJseVpVMXpaeTVpZFdabVpYSlBabVp6WlhRZ0t6MGdkR2hwY3k1emFYcGxYRzRnSUNBZ2ZWeHVJQ0I5WEc1OVhHNWNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQnpkSEpwYm1kUGNIUnBiMjVoYkNoaGNtYy9PaUJ6ZEhKcGJtY3BPaUJOWlhOellXZGxUV0Z5YzJoaGJHeHBibWREYjI1MFpYaDBQSE4wY21sdVp5QjhJSFZ1WkdWbWFXNWxaQ3dnSjNNbkxDQnVkVzFpWlhJK0lIdGNiaUFnY21WMGRYSnVJSHRjYmlBZ0lDQjJZV3gxWlRvZ1lYSm5JRDhnWUNSN1lYSm5mVnhjTUdBZ09pQjFibVJsWm1sdVpXUXNYRzRnSUNBZ2RIbHdaVG9nSjNNbkxGeHVJQ0FnSUhOcGVtVTZJRFFnS3lBb1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ0lDQnBaaUFvWVhKbklEMDlQU0IxYm1SbFptbHVaV1FwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SURCY2JpQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUM4dklHWmhibU41SUd4dloybGpJSFJ2SUdOaGJHTjFiR0YwWlNCemFYcGxJSGRwZEdnZ2NHRmtaR2x1WnlCMGJ5QmhJRzExYkhScGNHeGxJRzltSURRZ1lubDBaWE1nS0dsdWRDa3VYRzRnSUNBZ0lDQWdJQzh2SUd4bGJtZDBhQ3N4SUdadmNpQnVkV3hzSUhSbGNtMXBibUYwYjNKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUNoaGNtY3ViR1Z1WjNSb0lDc2dNU0FySURNcElDWWdmak5jYmlBZ0lDQWdJSDFjYmlBZ0lDQjlLU2dwTEZ4dUlDQWdJRzl3ZEdsdmJtRnNPaUIwY25WbExGeHVJQ0FnSUY5dFlYSnphR0ZzYkVGeVp6b2dablZ1WTNScGIyNG9kMmx5WlUxelp5a2dlMXh1SUNBZ0lDQWdhV1lnS0hSb2FYTXVkbUZzZFdVZ1BUMDlJSFZ1WkdWbWFXNWxaQ2tnZTF4dUlDQWdJQ0FnSUNCdVpYY2dWV2x1ZERNeVFYSnlZWGtvZDJseVpVMXpaeTVpZFdabVpYSXNJSGRwY21WTmMyY3VZblZtWm1WeVQyWm1jMlYwTENBeEtWc3dYU0E5SURCY2JpQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUc1bGR5QlZhVzUwTXpKQmNuSmhlU2gzYVhKbFRYTm5MbUoxWm1abGNpd2dkMmx5WlUxelp5NWlkV1ptWlhKUFptWnpaWFFzSURFcFd6QmRJRDBnZEdocGN5NTJZV3gxWlM1c1pXNW5kR2hjYmx4dUlDQWdJQ0FnSUNCamIyNXpkQ0J6ZEhKTVpXNGdQU0IwYUdsekxuWmhiSFZsTG14bGJtZDBhRnh1SUNBZ0lDQWdJQ0JqYjI1emRDQmlkV1k0SUQwZ2JtVjNJRlZwYm5RNFFYSnlZWGtvZDJseVpVMXpaeTVpZFdabVpYSXNJSGRwY21WTmMyY3VZblZtWm1WeVQyWm1jMlYwSUNzZ05Dd2djM1J5VEdWdUtWeHVJQ0FnSUNBZ0lDQm1iM0lnS0d4bGRDQnBJRDBnTURzZ2FTQThJSE4wY2t4bGJqc2dhU3NyS1NCN1hHNGdJQ0FnSUNBZ0lDQWdZblZtT0Z0cFhTQTlJSFJvYVhNdWRtRnNkV1ZiYVYwdVkyaGhja052WkdWQmRDZ3dLVnh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdJQ0IzYVhKbFRYTm5MbUoxWm1abGNrOW1abk5sZENBclBTQjBhR2x6TG5OcGVtVmNiaUFnSUNCOVhHNGdJSDFjYm4xY2JseHVaWGh3YjNKMElHWjFibU4wYVc5dUlHRnljbUY1S0dGeVp6b2dRWEp5WVhsQ2RXWm1aWEpXYVdWM0tUb2dUV1Z6YzJGblpVMWhjbk5vWVd4c2FXNW5RMjl1ZEdWNGREeEJjbkpoZVVKMVptWmxjbFpwWlhjc0lDZGhKeXdnYm5WdFltVnlQaUI3WEc0Z0lISmxkSFZ5YmlCN1hHNGdJQ0FnZG1Gc2RXVTZJR0Z5Wnl4Y2JpQWdJQ0IwZVhCbE9pQW5ZU2NzWEc0Z0lDQWdjMmw2WlRvZ05DQXJJQ2htZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0FnSUM4dklHWmhibU41SUd4dloybGpJSFJ2SUdOaGJHTjFiR0YwWlNCemFYcGxJSGRwZEdnZ2NHRmtaR2x1WnlCMGJ5QmhJRzExYkhScGNHeGxJRzltSURRZ1lubDBaWE1nS0dsdWRDa3VYRzRnSUNBZ0lDQnlaWFIxY200Z0tHRnlaeTVpZVhSbFRHVnVaM1JvSUNzZ015a2dKaUIrTTF4dUlDQWdJSDBwS0Nrc1hHNGdJQ0FnYjNCMGFXOXVZV3c2SUdaaGJITmxMRnh1SUNBZ0lGOXRZWEp6YUdGc2JFRnlaem9nWm5WdVkzUnBiMjRvZDJseVpVMXpaeWtnZTF4dUlDQWdJQ0FnYm1WM0lGVnBiblF6TWtGeWNtRjVLSGRwY21WTmMyY3VZblZtWm1WeUxDQjNhWEpsVFhObkxtSjFabVpsY2s5bVpuTmxkQ3dnTVNsYk1GMGdQU0IwYUdsekxuWmhiSFZsTG1KNWRHVk1aVzVuZEdoY2JseHVJQ0FnSUNBZ1kyOXVjM1FnWW5sMFpVeGxibWQwYUNBOUlIUm9hWE11ZG1Gc2RXVXVZbmwwWlV4bGJtZDBhRnh1SUNBZ0lDQWdibVYzSUZWcGJuUTRRWEp5WVhrb2QybHlaVTF6Wnk1aWRXWm1aWElzSUhkcGNtVk5jMmN1WW5WbVptVnlUMlptYzJWMElDc2dOQ3dnWW5sMFpVeGxibWQwYUNrdWMyVjBLRzVsZHlCVmFXNTBPRUZ5Y21GNUtIUm9hWE11ZG1Gc2RXVXVZblZtWm1WeUxDQXdMQ0JpZVhSbFRHVnVaM1JvS1NsY2JseHVJQ0FnSUNBZ2QybHlaVTF6Wnk1aWRXWm1aWEpQWm1aelpYUWdLejBnZEdocGN5NXphWHBsWEc0Z0lDQWdmVnh1SUNCOVhHNTlYRzVjYm1WNGNHOXlkQ0JtZFc1amRHbHZiaUJoY25KaGVVOXdkR2x2Ym1Gc0tHRnlaejg2SUVGeWNtRjVRblZtWm1WeVZtbGxkeWs2SUUxbGMzTmhaMlZOWVhKemFHRnNiR2x1WjBOdmJuUmxlSFE4UVhKeVlYbENkV1ptWlhKV2FXVjNJSHdnZFc1a1pXWnBibVZrTENBbllTY3NJRzUxYldKbGNqNGdlMXh1SUNCeVpYUjFjbTRnZTF4dUlDQWdJSFpoYkhWbE9pQmhjbWNzWEc0Z0lDQWdkSGx3WlRvZ0oyRW5MRnh1SUNBZ0lITnBlbVU2SURRZ0t5QW9ablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdJQ0JwWmlBb1lYSm5JRDA5UFNCMWJtUmxabWx1WldRcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlEQmNiaUFnSUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNBZ0lDOHZJR1poYm1ONUlHeHZaMmxqSUhSdklHTmhiR04xYkdGMFpTQnphWHBsSUhkcGRHZ2djR0ZrWkdsdVp5QjBieUJoSUcxMWJIUnBjR3hsSUc5bUlEUWdZbmwwWlhNZ0tHbHVkQ2t1WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUFvWVhKbkxtSjVkR1ZNWlc1bmRHZ2dLeUF6S1NBbUlINHpYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZTa29LU3hjYmlBZ0lDQnZjSFJwYjI1aGJEb2dkSEoxWlN4Y2JpQWdJQ0JmYldGeWMyaGhiR3hCY21jNklHWjFibU4wYVc5dUtIZHBjbVZOYzJjcElIdGNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxuWmhiSFZsSUQwOVBTQjFibVJsWm1sdVpXUXBJSHRjYmlBZ0lDQWdJQ0FnYm1WM0lGVnBiblF6TWtGeWNtRjVLSGRwY21WTmMyY3VZblZtWm1WeUxDQjNhWEpsVFhObkxtSjFabVpsY2s5bVpuTmxkQ3dnTVNsYk1GMGdQU0F3WEc0Z0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0J1WlhjZ1ZXbHVkRE15UVhKeVlYa29kMmx5WlUxelp5NWlkV1ptWlhJc0lIZHBjbVZOYzJjdVluVm1abVZ5VDJabWMyVjBMQ0F4S1Zzd1hTQTlJSFJvYVhNdWRtRnNkV1V1WW5sMFpVeGxibWQwYUZ4dVhHNGdJQ0FnSUNBZ0lHTnZibk4wSUdKNWRHVk1aVzVuZEdnZ1BTQjBhR2x6TG5aaGJIVmxMbUo1ZEdWTVpXNW5kR2hjYmlBZ0lDQWdJQ0FnYm1WM0lGVnBiblE0UVhKeVlYa29kMmx5WlUxelp5NWlkV1ptWlhJc0lIZHBjbVZOYzJjdVluVm1abVZ5VDJabWMyVjBJQ3NnTkN3Z1lubDBaVXhsYm1kMGFDa3VjMlYwS0c1bGR5QlZhVzUwT0VGeWNtRjVLSFJvYVhNdWRtRnNkV1V1WW5WbVptVnlMQ0F3TENCaWVYUmxUR1Z1WjNSb0tTbGNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lIZHBjbVZOYzJjdVluVm1abVZ5VDJabWMyVjBJQ3M5SUhSb2FYTXVjMmw2WlZ4dUlDQWdJSDFjYmlBZ2ZWeHVmVnh1WEc1bWRXNWpkR2x2YmlCamFHVmphMDFsYzNOaFoyVlRhWHBsS0cxbGMzTmhaMlU2SUZkc1RXVnpjMkZuWlN3Z1kyOXVjM1Z0Y0hScGIyNDZJRzUxYldKbGNpa2dlMXh1SUNCcFppQW9iV1Z6YzJGblpTNWpiMjV6ZFcxbFpDQXJJR052Ym5OMWJYQjBhVzl1SUQ0Z2JXVnpjMkZuWlM1emFYcGxLU0I3WEc0Z0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtHQlNaWEYxWlhOMElIUnZieUJ6YUc5eWRDNWdLVnh1SUNCOUlHVnNjMlVnZTF4dUlDQWdJRzFsYzNOaFoyVXVZMjl1YzNWdFpXUWdLejBnWTI5dWMzVnRjSFJwYjI1Y2JpQWdmVnh1ZlZ4dVhHNWxlSEJ2Y25RZ1puVnVZM1JwYjI0Z2RTaHRaWE56WVdkbE9pQlhiRTFsYzNOaFoyVXBPaUJ1ZFcxaVpYSWdlMXh1SUNCamFHVmphMDFsYzNOaFoyVlRhWHBsS0cxbGMzTmhaMlVzSURRcFhHNGdJSEpsZEhWeWJpQnRaWE56WVdkbExtSjFabVpsY2x0dFpYTnpZV2RsTG1KMVptWmxjazltWm5ObGRDc3JYVnh1ZlZ4dVhHNWxlSEJ2Y25RZ1puVnVZM1JwYjI0Z2FTaHRaWE56WVdkbE9pQlhiRTFsYzNOaFoyVXBPaUJ1ZFcxaVpYSWdlMXh1SUNCamFHVmphMDFsYzNOaFoyVlRhWHBsS0cxbGMzTmhaMlVzSURRcFhHNGdJR052Ym5OMElHRnlaeUE5SUc1bGR5QkpiblF6TWtGeWNtRjVLRzFsYzNOaFoyVXVZblZtWm1WeUxtSjFabVpsY2l3Z2JXVnpjMkZuWlM1aWRXWm1aWEl1WW5sMFpVOW1abk5sZENBcklDaHRaWE56WVdkbExtSjFabVpsY2s5bVpuTmxkQ0FxSUZWcGJuUXpNa0Z5Y21GNUxrSlpWRVZUWDFCRlVsOUZURVZOUlU1VUtTd2dNU2xiTUYxY2JpQWdiV1Z6YzJGblpTNWlkV1ptWlhKUFptWnpaWFFnS3owZ01WeHVJQ0J5WlhSMWNtNGdZWEpuWEc1OVhHNWNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQm1LRzFsYzNOaFoyVTZJRmRzVFdWemMyRm5aU2s2SUVacGVHVmtJSHRjYmlBZ1kyaGxZMnROWlhOellXZGxVMmw2WlNodFpYTnpZV2RsTENBMEtWeHVJQ0JqYjI1emRDQmhjbWNnUFNCdVpYY2dTVzUwTXpKQmNuSmhlU2h0WlhOellXZGxMbUoxWm1abGNpNWlkV1ptWlhJc0lHMWxjM05oWjJVdVluVm1abVZ5TG1KNWRHVlBabVp6WlhRZ0t5QW9iV1Z6YzJGblpTNWlkV1ptWlhKUFptWnpaWFFnS2lCVmFXNTBNekpCY25KaGVTNUNXVlJGVTE5UVJWSmZSVXhGVFVWT1ZDa3NJREVwV3pCZFhHNGdJRzFsYzNOaFoyVXVZblZtWm1WeVQyWm1jMlYwSUNzOUlERmNiaUFnY21WMGRYSnVJRzVsZHlCR2FYaGxaQ2hoY21jZ1BqNGdNQ2xjYm4xY2JseHVaWGh3YjNKMElHWjFibU4wYVc5dUlHOVBjSFJwYjI1aGJEeFVJR1Y0ZEdWdVpITWdWMnhQWW1wbFkzUStLRzFsYzNOaFoyVTZJRmRzVFdWemMyRm5aU3dnWTI5dWJtVmpkR2x2YmpvZ1EyOXVibVZqZEdsdmJpazZJRlFnZkNCMWJtUmxabWx1WldRZ2UxeHVJQ0JqYUdWamEwMWxjM05oWjJWVGFYcGxLRzFsYzNOaFoyVXNJRFFwWEc0Z0lHTnZibk4wSUdGeVp5QTlJRzFsYzNOaFoyVXVZblZtWm1WeVcyMWxjM05oWjJVdVluVm1abVZ5VDJabWMyVjBLeXRkWEc0Z0lHbG1JQ2hoY21jZ1BUMDlJREFwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdkVzVrWldacGJtVmtYRzRnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdZMjl1YzNRZ2QyeFBZbXBsWTNRZ1BTQmpiMjV1WldOMGFXOXVMbmRzVDJKcVpXTjBjMXRoY21kZFhHNGdJQ0FnYVdZZ0tIZHNUMkpxWldOMEtTQjdYRzRnSUNBZ0lDQXZMeUJVVDBSUElHRmtaQ0JoYmlCbGVIUnlZU0JqYUdWamF5QjBieUJ0WVd0bElITjFjbVVnZDJVZ1kyRnpkQ0JqYjNKeVpXTjBiSGxjYmlBZ0lDQWdJSEpsZEhWeWJpQjNiRTlpYW1WamRDQmhjeUJVWEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2loZ1ZXNXJibTkzYmlCdlltcGxZM1FnYVdRZ0pIdGhjbWQ5WUNsY2JpQWdJQ0I5WEc0Z0lIMWNibjFjYmx4dVpYaHdiM0owSUdaMWJtTjBhVzl1SUc4OFZDQmxlSFJsYm1SeklGZHNUMkpxWldOMFBpaHRaWE56WVdkbE9pQlhiRTFsYzNOaFoyVXNJR052Ym01bFkzUnBiMjQ2SUVOdmJtNWxZM1JwYjI0cE9pQlVJSHRjYmlBZ1kyaGxZMnROWlhOellXZGxVMmw2WlNodFpYTnpZV2RsTENBMEtWeHVJQ0JqYjI1emRDQmhjbWNnUFNCdFpYTnpZV2RsTG1KMVptWmxjbHR0WlhOellXZGxMbUoxWm1abGNrOW1abk5sZENzclhWeHVYRzRnSUdOdmJuTjBJSGRzVDJKcVpXTjBJRDBnWTI5dWJtVmpkR2x2Ymk1M2JFOWlhbVZqZEhOYllYSm5YVnh1SUNCcFppQW9kMnhQWW1wbFkzUXBJSHRjYmlBZ0lDQXZMeUJVVDBSUElHRmtaQ0JoYmlCbGVIUnlZU0JqYUdWamF5QjBieUJ0WVd0bElITjFjbVVnZDJVZ1kyRnpkQ0JqYjNKeVpXTjBiSGxjYmlBZ0lDQnlaWFIxY200Z2QyeFBZbXBsWTNRZ1lYTWdWRnh1SUNCOUlHVnNjMlVnZTF4dUlDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpaGdWVzVyYm05M2JpQnZZbXBsWTNRZ2FXUWdKSHRoY21kOVlDbGNiaUFnZlZ4dWZWeHVYRzVsZUhCdmNuUWdablZ1WTNScGIyNGdiaWh0WlhOellXZGxPaUJYYkUxbGMzTmhaMlVwT2lCdWRXMWlaWElnZTF4dUlDQmphR1ZqYTAxbGMzTmhaMlZUYVhwbEtHMWxjM05oWjJVc0lEUXBYRzRnSUhKbGRIVnliaUJ0WlhOellXZGxMbUoxWm1abGNsdHRaWE56WVdkbExtSjFabVpsY2s5bVpuTmxkQ3NyWFZ4dWZWeHVYRzVsZUhCdmNuUWdablZ1WTNScGIyNGdjMDl3ZEdsdmJtRnNLRzFsYzNOaFoyVTZJRmRzVFdWemMyRm5aU2s2SUhOMGNtbHVaeUI4SUhWdVpHVm1hVzVsWkNCN0lDOHZJSHRUZEhKcGJtZDlYRzRnSUdOb1pXTnJUV1Z6YzJGblpWTnBlbVVvYldWemMyRm5aU3dnTkNsY2JpQWdZMjl1YzNRZ2MzUnlhVzVuVTJsNlpTQTlJRzFsYzNOaFoyVXVZblZtWm1WeVcyMWxjM05oWjJVdVluVm1abVZ5VDJabWMyVjBLeXRkWEc0Z0lHbG1JQ2h6ZEhKcGJtZFRhWHBsSUQwOVBTQXdLU0I3WEc0Z0lDQWdjbVYwZFhKdUlIVnVaR1ZtYVc1bFpGeHVJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lHTnZibk4wSUdGc2FXZHVaV1JUYVhwbElEMGdLQ2h6ZEhKcGJtZFRhWHBsSUNzZ015a2dKaUIrTXlsY2JpQWdJQ0JqYUdWamEwMWxjM05oWjJWVGFYcGxLRzFsYzNOaFoyVXNJR0ZzYVdkdVpXUlRhWHBsS1Z4dUlDQWdJQzh2SUhOcGVtVWdMVEVnZEc4Z1pXeHBiV2x1WVhSbElHNTFiR3dnWW5sMFpWeHVJQ0FnSUdOdmJuTjBJR0o1ZEdWQmNuSmhlU0E5SUc1bGR5QlZhVzUwT0VGeWNtRjVLRzFsYzNOaFoyVXVZblZtWm1WeUxtSjFabVpsY2l3Z2JXVnpjMkZuWlM1aWRXWm1aWEl1WW5sMFpVOW1abk5sZENBcklDaHRaWE56WVdkbExtSjFabVpsY2s5bVpuTmxkQ0FxSUZWcGJuUXpNa0Z5Y21GNUxrSlpWRVZUWDFCRlVsOUZURVZOUlU1VUtTd2djM1J5YVc1blUybDZaU0F0SURFcFhHNGdJQ0FnYldWemMyRm5aUzVpZFdabVpYSlBabVp6WlhRZ0t6MGdLR0ZzYVdkdVpXUlRhWHBsSUM4Z05DbGNiaUFnSUNCeVpYUjFjbTRnZEdWNGRFUmxZMjlrWlhJdVpHVmpiMlJsS0dKNWRHVkJjbkpoZVNsY2JpQWdmVnh1ZlZ4dVhHNWxlSEJ2Y25RZ1puVnVZM1JwYjI0Z2N5aHRaWE56WVdkbE9pQlhiRTFsYzNOaFoyVXBPaUJ6ZEhKcGJtY2dleUF2THlCN1UzUnlhVzVuZlZ4dUlDQmphR1ZqYTAxbGMzTmhaMlZUYVhwbEtHMWxjM05oWjJVc0lEUXBYRzRnSUdOdmJuTjBJSE4wY21sdVoxTnBlbVVnUFNCdFpYTnpZV2RsTG1KMVptWmxjbHR0WlhOellXZGxMbUoxWm1abGNrOW1abk5sZENzclhWeHVYRzRnSUdOdmJuTjBJR0ZzYVdkdVpXUlRhWHBsSUQwZ0tDaHpkSEpwYm1kVGFYcGxJQ3NnTXlrZ0ppQitNeWxjYmlBZ1kyaGxZMnROWlhOellXZGxVMmw2WlNodFpYTnpZV2RsTENCaGJHbG5ibVZrVTJsNlpTbGNiaUFnTHk4Z2MybDZaU0F0TVNCMGJ5QmxiR2x0YVc1aGRHVWdiblZzYkNCaWVYUmxYRzRnSUdOdmJuTjBJR0o1ZEdWQmNuSmhlU0E5SUc1bGR5QlZhVzUwT0VGeWNtRjVLRzFsYzNOaFoyVXVZblZtWm1WeUxtSjFabVpsY2l3Z2JXVnpjMkZuWlM1aWRXWm1aWEl1WW5sMFpVOW1abk5sZENBcklDaHRaWE56WVdkbExtSjFabVpsY2s5bVpuTmxkQ0FxSUZWcGJuUXpNa0Z5Y21GNUxrSlpWRVZUWDFCRlVsOUZURVZOUlU1VUtTd2djM1J5YVc1blUybDZaU0F0SURFcFhHNGdJRzFsYzNOaFoyVXVZblZtWm1WeVQyWm1jMlYwSUNzOUlDaGhiR2xuYm1Wa1UybDZaU0F2SURRcFhHNGdJSEpsZEhWeWJpQjBaWGgwUkdWamIyUmxjaTVrWldOdlpHVW9ZbmwwWlVGeWNtRjVLVnh1ZlZ4dVhHNWxlSEJ2Y25RZ1puVnVZM1JwYjI0Z1lVOXdkR2x2Ym1Gc0tHMWxjM05oWjJVNklGZHNUV1Z6YzJGblpTd2diM0IwYVc5dVlXdzZJR0p2YjJ4bFlXNHBPaUJCY25KaGVVSjFabVpsY2lCOElIVnVaR1ZtYVc1bFpDQjdYRzRnSUdOb1pXTnJUV1Z6YzJGblpWTnBlbVVvYldWemMyRm5aU3dnTkNsY2JpQWdZMjl1YzNRZ1lYSnlZWGxUYVhwbElEMGdiV1Z6YzJGblpTNWlkV1ptWlhKYmJXVnpjMkZuWlM1aWRXWm1aWEpQWm1aelpYUXJLMTFjYmlBZ2FXWWdLR0Z5Y21GNVUybDZaU0E5UFQwZ01Da2dlMXh1SUNBZ0lISmxkSFZ5YmlCMWJtUmxabWx1WldSY2JpQWdmU0JsYkhObElIdGNiaUFnSUNCamIyNXpkQ0JoYkdsbmJtVmtVMmw2WlNBOUlDZ29ZWEp5WVhsVGFYcGxJQ3NnTXlrZ0ppQitNeWxjYmlBZ0lDQmphR1ZqYTAxbGMzTmhaMlZUYVhwbEtHMWxjM05oWjJVc0lHRnNhV2R1WldSVGFYcGxLVnh1SUNBZ0lHTnZibk4wSUdGeVp5QTlJRzFsYzNOaFoyVXVZblZtWm1WeUxtSjFabVpsY2k1emJHbGpaU2h0WlhOellXZGxMbUoxWm1abGNpNWllWFJsVDJabWMyVjBJQ3NnS0cxbGMzTmhaMlV1WW5WbVptVnlUMlptYzJWMElDb2dWV2x1ZERNeVFYSnlZWGt1UWxsVVJWTmZVRVZTWDBWTVJVMUZUbFFwTENCdFpYTnpZV2RsTG1KMVptWmxjaTVpZVhSbFQyWm1jMlYwSUNzZ0tHMWxjM05oWjJVdVluVm1abVZ5VDJabWMyVjBJQ29nVldsdWRETXlRWEp5WVhrdVFsbFVSVk5mVUVWU1gwVk1SVTFGVGxRcElDc2dZWEp5WVhsVGFYcGxLVnh1SUNBZ0lHMWxjM05oWjJVdVluVm1abVZ5VDJabWMyVjBJQ3M5SUdGc2FXZHVaV1JUYVhwbFhHNGdJQ0FnY21WMGRYSnVJR0Z5WjF4dUlDQjlYRzU5WEc1Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCaEtHMWxjM05oWjJVNklGZHNUV1Z6YzJGblpTazZJRUZ5Y21GNVFuVm1abVZ5SUh0Y2JpQWdZMmhsWTJ0TlpYTnpZV2RsVTJsNlpTaHRaWE56WVdkbExDQTBLVnh1SUNCamIyNXpkQ0JoY25KaGVWTnBlbVVnUFNCdFpYTnpZV2RsTG1KMVptWmxjbHR0WlhOellXZGxMbUoxWm1abGNrOW1abk5sZENzclhWeHVYRzRnSUdOdmJuTjBJR0ZzYVdkdVpXUlRhWHBsSUQwZ0tDaGhjbkpoZVZOcGVtVWdLeUF6S1NBbUlINHpLVnh1SUNCamFHVmphMDFsYzNOaFoyVlRhWHBsS0cxbGMzTmhaMlVzSUdGc2FXZHVaV1JUYVhwbEtWeHVJQ0JqYjI1emRDQmhjbWNnUFNCdFpYTnpZV2RsTG1KMVptWmxjaTVpZFdabVpYSXVjMnhwWTJVb2JXVnpjMkZuWlM1aWRXWm1aWEl1WW5sMFpVOW1abk5sZENBcklDaHRaWE56WVdkbExtSjFabVpsY2s5bVpuTmxkQ0FxSUZWcGJuUXpNa0Z5Y21GNUxrSlpWRVZUWDFCRlVsOUZURVZOUlU1VUtTd2diV1Z6YzJGblpTNWlkV1ptWlhJdVlubDBaVTltWm5ObGRDQXJJQ2h0WlhOellXZGxMbUoxWm1abGNrOW1abk5sZENBcUlGVnBiblF6TWtGeWNtRjVMa0paVkVWVFgxQkZVbDlGVEVWTlJVNVVLU0FySUdGeWNtRjVVMmw2WlNsY2JpQWdiV1Z6YzJGblpTNWlkV1ptWlhKUFptWnpaWFFnS3owZ1lXeHBaMjVsWkZOcGVtVmNiaUFnY21WMGRYSnVJR0Z5WjF4dWZWeHVYRzVsZUhCdmNuUWdablZ1WTNScGIyNGdhQ2h0WlhOellXZGxPaUJYYkUxbGMzTmhaMlVwT2lCWFpXSkdSQ0I3SUM4dklHWnBiR1VnWkdWelkzSnBjSFJ2Y2lCN2JuVnRZbVZ5ZlZ4dUlDQnBaaUFvYldWemMyRm5aUzVtWkhNdWJHVnVaM1JvSUQ0Z01Da2dlMXh1SUNBZ0lHeGxkQ0IzWldKR1pDQTlJRzFsYzNOaFoyVXVabVJ6TG5Ob2FXWjBLQ2xjYmlBZ0lDQnBaaUFvZDJWaVJtUWdQVDA5SUhWdVpHVm1hVzVsWkNrZ2UxeHVJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0NkT2J5QnRiM0psSUhkbFltWmtjeUJtYjNWdVpDQnBiaUIzYkNCdFpYTnpZV2RsTGljcFhHNGdJQ0FnZlZ4dUlDQWdJSEpsZEhWeWJpQjNaV0pHWkZ4dUlDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUhSb2NtOTNJRzVsZHlCRmNuSnZjaWduVG05MElHVnViM1ZuYUNCbWFXeGxJR1JsYzJOeWFYQjBiM0p6SUdsdUlHMWxjM05oWjJVZ2IySnFaV04wTGljcFhHNGdJSDFjYm4xY2JseHVaWGh3YjNKMElHTnNZWE56SUVOdmJtNWxZM1JwYjI0Z2UxeHVJQ0J5WldGa2IyNXNlU0IzYkU5aWFtVmpkSE02SUhzZ1cydGxlVG9nYm5WdFltVnlYVG9nVjJ4UFltcGxZM1FnZlNBOUlIdDlYRzRnSUdOc2IzTmxaRG9nWW05dmJHVmhiaUE5SUdaaGJITmxYRzRnSUc5dVJteDFjMmcvT2lBb2IzVjBUWE5uT2lCVFpXNWtUV1Z6YzJGblpWdGRLU0E5UGlCMmIybGtYRzRnSUhCeWFYWmhkR1VnWDI5MWRFMWxjM05oWjJWek9pQlRaVzVrVFdWemMyRm5aVnRkSUQwZ1cxMWNiaUFnY0hKcGRtRjBaU0JmYVc1TlpYTnpZV2RsY3pvZ1YyeE5aWE56WVdkbFcxMGdQU0JiWFZ4dUlDQndjbWwyWVhSbElGOXBaR3hsU0dGdVpHeGxjbk02SUNnb0tTQTlQaUIyYjJsa0tWdGRJRDBnVzExY2JseHVJQ0F2S2lwY2JpQWdJQ29nUVdSa2N5QmhJRzl1WlMxemFHOTBJR2xrYkdVZ2FHRnVaR3hsY2k0Z1ZHaGxJR2xrYkdVZ2FHRnVaR3hsY2lCcGN5Qm1hWEpsWkNCdmJtTmxMQ0JoWm5SbGNpQmhiR3dnYVc1amIyMXBibWNnY21WeGRXVnpkQ0J0WlhOellXZGxjeUJvWVhabElHSmxaVzRnY0hKdlkyVnpjMlZrTGx4dUlDQWdLaTljYmlBZ1lXUmtTV1JzWlVoaGJtUnNaWElvYVdSc1pVaGhibVJzWlhJNklDZ3BJRDArSUhadmFXUXBJSHRjYmlBZ0lDQjBhR2x6TGw5cFpHeGxTR0Z1Wkd4bGNuTWdQU0JiTGk0dWRHaHBjeTVmYVdSc1pVaGhibVJzWlhKekxDQnBaR3hsU0dGdVpHeGxjbDFjYmlBZ2ZWeHVYRzRnSUhKbGJXOTJaVWxrYkdWSVlXNWtiR1Z5S0dsa2JHVklZVzVrYkdWeU9pQW9LU0E5UGlCMmIybGtLU0I3WEc0Z0lDQWdkR2hwY3k1ZmFXUnNaVWhoYm1Sc1pYSnpJRDBnZEdocGN5NWZhV1JzWlVoaGJtUnNaWEp6TG1acGJIUmxjaWhvWVc1a2JHVnlJRDArSUdoaGJtUnNaWElnSVQwOUlHbGtiR1ZJWVc1a2JHVnlLVnh1SUNCOVhHNWNiaUFnYldGeWMyaGhiR3hOYzJjb2FXUTZJRzUxYldKbGNpd2diM0JqYjJSbE9pQnVkVzFpWlhJc0lITnBlbVU2SUc1MWJXSmxjaXdnWVhKbmMwRnljbUY1T2lCTlpYTnpZV2RsVFdGeWMyaGhiR3hwYm1kRGIyNTBaWGgwUEdGdWVTd2dZVzU1TENCaGJuaytXMTBwSUh0Y2JpQWdJQ0JqYjI1emRDQjNhWEpsVFhObklEMGdlMXh1SUNBZ0lDQWdZblZtWm1WeU9pQnVaWGNnUVhKeVlYbENkV1ptWlhJb2MybDZaU2tzWEc0Z0lDQWdJQ0JtWkhNNklGdGRMRnh1SUNBZ0lDQWdZblZtWm1WeVQyWm1jMlYwT2lBd1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHk4Z2QzSnBkR1VnWVdOMGRXRnNJSGRwY21VZ2JXVnpjMkZuWlZ4dUlDQWdJR052Ym5OMElHSjFablV6TWlBOUlHNWxkeUJWYVc1ME16SkJjbkpoZVNoM2FYSmxUWE5uTG1KMVptWmxjaWxjYmlBZ0lDQmpiMjV6ZENCaWRXWjFNVFlnUFNCdVpYY2dWV2x1ZERFMlFYSnlZWGtvZDJseVpVMXpaeTVpZFdabVpYSXBYRzRnSUNBZ1luVm1kVE15V3pCZElEMGdhV1JjYmlBZ0lDQmlkV1oxTVRaYk1sMGdQU0J2Y0dOdlpHVmNiaUFnSUNCaWRXWjFNVFpiTTEwZ1BTQnphWHBsWEc0Z0lDQWdkMmx5WlUxelp5NWlkV1ptWlhKUFptWnpaWFFnUFNBNFhHNWNiaUFnSUNBdkx5QjNjbWwwWlNCaFkzUjFZV3dnWVhKbmRXMWxiblFnZG1Gc2RXVWdkRzhnWW5WbVptVnlYRzRnSUNBZ1lYSm5jMEZ5Y21GNUxtWnZja1ZoWTJnb0tHRnlaeWtnUFQ0Z1lYSm5MbDl0WVhKemFHRnNiRUZ5WnloM2FYSmxUWE5uS1NsY2JpQWdJQ0IwYUdsekxtOXVVMlZ1WkNoM2FYSmxUWE5uS1Z4dUlDQjlYRzVjYmlBZ2NISnBkbUYwWlNCaGMzbHVZeUJmYVdSc1pTZ3BPaUJRY205dGFYTmxQSFp2YVdRK0lIdGNiaUFnSUNCbWIzSWdLR052Ym5OMElHbGtiR1ZJWVc1a2JHVnlJRzltSUhSb2FYTXVYMmxrYkdWSVlXNWtiR1Z5Y3lrZ2UxeHVJQ0FnSUNBZ1lYZGhhWFFnYVdSc1pVaGhibVJzWlhJb0tWeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQklZVzVrYkdVZ2NtVmpaV2wyWldRZ2QybHlaU0J0WlhOellXZGxjeTVjYmlBZ0lDb3ZYRzRnSUdGemVXNWpJRzFsYzNOaFoyVW9hVzVqYjIxcGJtZFhhWEpsVFdWemMyRm5aWE02SUhzZ1luVm1abVZ5T2lCVmFXNTBNekpCY25KaGVTd2dabVJ6T2lCQmNuSmhlVHhYWldKR1JENGdmU2s2SUZCeWIyMXBjMlU4ZG05cFpENGdlMXh1SUNBZ0lHbG1JQ2gwYUdsekxtTnNiM05sWkNrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeThnYlc5eVpTQjBhR0Z1SUc5dVpTQnRaWE56WVdkbElHbHVJSEYxWlhWbElHMWxZVzV6SUhSb1pTQnRaWE56WVdkbElHeHZiM0FnYVhNZ2FXNGdZWGRoYVhRc0lHUnZiaWQwSUdOdmJtTjFjbkpsYm5Sc2VTQndjbTlqWlhOeklIUm9aU0J1WlhkY2JpQWdJQ0F2THlCdFpYTnpZV2RsTENCcGJuTjBaV0ZrSUhKbGRIVnliaUJsWVhKc2VTQmhibVFnYkdWMElIUm9aU0J5WlhOMWJXVXRabkp2YlMxaGQyRnBkQ0J3YVdOcklIVndJSFJvWlNCdVpYZHNlU0J4ZFdWMVpXUWdiV1Z6YzJGblpTNWNiaUFnSUNCcFppQW9kR2hwY3k1ZmFXNU5aWE56WVdkbGN5NXdkWE5vS0h0Y2JpQWdJQ0FnSUM0dUxtbHVZMjl0YVc1blYybHlaVTFsYzNOaFoyVnpMQ0JpZFdabVpYSlBabVp6WlhRNklEQXNYRzRnSUNBZ0lDQmpiMjV6ZFcxbFpEb2dNQ3hjYmlBZ0lDQWdJSE5wZW1VNklEQmNiaUFnSUNCOUtTQStJREVwSUh0Y2JpQWdJQ0FnSUhKbGRIVnlibHh1SUNBZ0lIMWNibHh1SUNBZ0lIZG9hV3hsSUNoMGFHbHpMbDlwYmsxbGMzTmhaMlZ6TG14bGJtZDBhQ2tnZTF4dUlDQWdJQ0FnWTI5dWMzUWdkMmx5WlUxbGMzTmhaMlZ6SUQwZ2RHaHBjeTVmYVc1TlpYTnpZV2RsYzFzd1hWeHVJQ0FnSUNBZ2QyaHBiR1VnS0hkcGNtVk5aWE56WVdkbGN5NWlkV1ptWlhKUFptWnpaWFFnUENCM2FYSmxUV1Z6YzJGblpYTXVZblZtWm1WeUxteGxibWQwYUNrZ2UxeHVJQ0FnSUNBZ0lDQmpiMjV6ZENCcFpDQTlJSGRwY21WTlpYTnpZV2RsY3k1aWRXWm1aWEpiZDJseVpVMWxjM05oWjJWekxtSjFabVpsY2s5bVpuTmxkRjFjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdjMmw2WlU5d1kyOWtaU0E5SUhkcGNtVk5aWE56WVdkbGN5NWlkV1ptWlhKYmQybHlaVTFsYzNOaFoyVnpMbUoxWm1abGNrOW1abk5sZENBcklERmRYRzRnSUNBZ0lDQWdJSGRwY21WTlpYTnpZV2RsY3k1emFYcGxJRDBnYzJsNlpVOXdZMjlrWlNBK1BqNGdNVFpjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdiM0JqYjJSbElEMGdjMmw2WlU5d1kyOWtaU0FtSURCNE1EQXdNRVpHUmtaY2JseHVJQ0FnSUNBZ0lDQnBaaUFvZDJseVpVMWxjM05oWjJWekxuTnBlbVVnUGlCM2FYSmxUV1Z6YzJGblpYTXVZblZtWm1WeUxtSjVkR1ZNWlc1bmRHZ3BJSHRjYmlBZ0lDQWdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvSjFKbGNYVmxjM1FnWW5WbVptVnlJSFJ2YnlCemJXRnNiQ2NwWEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQmpiMjV6ZENCM2JFOWlhbVZqZENBOUlIUm9hWE11ZDJ4UFltcGxZM1J6VzJsa1hWeHVJQ0FnSUNBZ0lDQnBaaUFvZDJ4UFltcGxZM1FwSUh0Y2JpQWdJQ0FnSUNBZ0lDQjNhWEpsVFdWemMyRm5aWE11WW5WbVptVnlUMlptYzJWMElDczlJREpjYmlBZ0lDQWdJQ0FnSUNCM2FYSmxUV1Z6YzJGblpYTXVZMjl1YzNWdFpXUWdQU0E0WEc0Z0lDQWdJQ0FnSUNBZ2RISjVJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDOHZJRUIwY3kxcFoyNXZjbVZjYmlBZ0lDQWdJQ0FnSUNBZ0lHRjNZV2wwSUhkc1QySnFaV04wVzI5d1kyOWtaVjBvZDJseVpVMWxjM05oWjJWektWeHVJQ0FnSUNBZ0lDQWdJSDBnWTJGMFkyZ2dLR1VwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR052Ym5OdmJHVXVaWEp5YjNJb1lGeHVkMnhQWW1wbFkzUTZJQ1I3ZDJ4UFltcGxZM1F1WTI5dWMzUnlkV04wYjNJdWJtRnRaWDFiSkh0dmNHTnZaR1Y5WFNndUxpbGNibTVoYldVNklDUjdaUzV1WVcxbGZTQnRaWE56WVdkbE9pQWtlMlV1YldWemMyRm5aWDBnZEdWNGREb2dKSHRsTG5SbGVIUjlYRzVsY25KdmNpQnZZbXBsWTNRZ2MzUmhZMnM2WEc0a2UyVXVjM1JoWTJ0OVhHNWdLVnh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHBjeTVqYkc5elpTZ3BYRzRnSUNBZ0lDQWdJQ0FnSUNCMGFISnZkeUJsWEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQWdJR2xtSUNoMGFHbHpMbU5zYjNObFpDa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpaGdhVzUyWVd4cFpDQnZZbXBsWTNRZ0pIdHBaSDFnS1Z4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNCOVhHNGdJQ0FnSUNCMGFHbHpMbDlwYmsxbGMzTmhaMlZ6TG5Ob2FXWjBLQ2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQjBhR2x6TG1ac2RYTm9LQ2xjYmx4dUlDQWdJR0YzWVdsMElIUm9hWE11WDJsa2JHVW9LVnh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUZSb2FYTWdaRzlsYzI0bmRDQmhZM1IxWVd4c2VTQnpaVzVrSUhSb1pTQnRaWE56WVdkbExDQmlkWFFnY1hWbGRXVnpJR2wwSUhOdklHbDBJR05oYmlCaVpTQnpaVzVrSUc5dUlHWnNkWE5vTGx4dUlDQWdLaTljYmlBZ2IyNVRaVzVrS0hkcGNtVk5jMmM2SUZObGJtUk5aWE56WVdkbEtTQjdYRzRnSUNBZ2FXWWdLSFJvYVhNdVkyeHZjMlZrS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTVjYmlBZ0lDQjlYRzVjYmlBZ0lDQjBhR2x6TGw5dmRYUk5aWE56WVdkbGN5NXdkWE5vS0hkcGNtVk5jMmNwWEc0Z0lIMWNibHh1SUNCbWJIVnphQ2dwSUh0Y2JpQWdJQ0JwWmlBb2RHaHBjeTVqYkc5elpXUXBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJseHVJQ0FnSUgxY2JpQWdJQ0JwWmlBb2RHaHBjeTVmYjNWMFRXVnpjMkZuWlhNdWJHVnVaM1JvSUQwOVBTQXdLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNWNiaUFnSUNCOVhHNWNiaUFnSUNCMGFHbHpMbTl1Um14MWMyZy9MaWgwYUdsekxsOXZkWFJOWlhOellXZGxjeWxjYmlBZ0lDQjBhR2x6TGw5dmRYUk5aWE56WVdkbGN5QTlJRnRkWEc0Z0lIMWNibHh1SUNCamJHOXpaU2dwSUh0Y2JpQWdJQ0JwWmlBb2RHaHBjeTVqYkc5elpXUXBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJseHVJQ0FnSUgxY2JseHVJQ0FnSUM4dklHUmxjM1J5YjNrZ2NtVnpiM1Z5WTJWeklHbHVJR1JsYzJObGJtUnBibWNnYjNKa1pYSmNiaUFnSUNCUFltcGxZM1F1ZG1Gc2RXVnpLSFJvYVhNdWQyeFBZbXBsWTNSektTNXpiM0owS0NoaExDQmlLU0E5UGlCaExtbGtJQzBnWWk1cFpDa3VabTl5UldGamFDZ29kMnhQWW1wbFkzUXBJRDArSUhkc1QySnFaV04wTG1SbGMzUnliM2tvS1NsY2JpQWdJQ0IwYUdsekxtTnNiM05sWkNBOUlIUnlkV1ZjYmlBZ2ZWeHVYRzRnSUhKbFoybHpkR1Z5VjJ4UFltcGxZM1FvZDJ4UFltcGxZM1E2SUZkc1QySnFaV04wS1NCN1hHNGdJQ0FnYVdZZ0tIUm9hWE11WTJ4dmMyVmtLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNWNiaUFnSUNCOVhHNGdJQ0FnYVdZZ0tIZHNUMkpxWldOMExtbGtJR2x1SUhSb2FYTXVkMnhQWW1wbFkzUnpLU0I3WEc0Z0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9ZRWxzYkdWbllXd2diMkpxWldOMElHbGtPaUFrZTNkc1QySnFaV04wTG1sa2ZTNGdRV3h5WldGa2VTQnlaV2RwYzNSbGNtVmtMbUFwWEc0Z0lDQWdmVnh1SUNBZ0lIUm9hWE11ZDJ4UFltcGxZM1J6VzNkc1QySnFaV04wTG1sa1hTQTlJSGRzVDJKcVpXTjBYRzRnSUgxY2JseHVJQ0IxYm5KbFoybHpkR1Z5VjJ4UFltcGxZM1FvZDJ4UFltcGxZM1E2SUZkc1QySnFaV04wS1NCN1hHNGdJQ0FnYVdZZ0tIUm9hWE11WTJ4dmMyVmtLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNWNiaUFnSUNCOVhHNGdJQ0FnWkdWc1pYUmxJSFJvYVhNdWQyeFBZbXBsWTNSelczZHNUMkpxWldOMExtbGtYVnh1SUNCOVhHNTlYRzRpWFgwPSIsImV4cG9ydCAqIGZyb20gJy4vQ29ubmVjdGlvbic7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lhVzVrWlhndWFuTWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGN5STZXeUl1TGk5emNtTXZhVzVrWlhndWRITWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzWTBGQll5eGpRVUZqTEVOQlFVRWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpsZUhCdmNuUWdLaUJtY205dElDY3VMME52Ym01bFkzUnBiMjRuWEc0aVhYMD0iLCIvLyBDb3B5cmlnaHQgMjAyMCBFcmlrIERlIFJpamNrZVxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZFxuLy8gZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlXG4vLyByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGVcbi8vIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEVcbi8vIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUlxuLy8gQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuJ3VzZSBzdHJpY3QnO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5pbXBvcnQgeyBkaXNwbGF5LCBmcmFtZSwgR3JXZWJTaG1Qcm90b2NvbE5hbWUsIEdyV2ViU2htUHJveHksIHdlYkZTLCBXbENvbXBvc2l0b3JQcm90b2NvbE5hbWUsIFdsQ29tcG9zaXRvclByb3h5LCBXbFNoZWxsUHJvdG9jb2xOYW1lLCBXbFNoZWxsUHJveHkgfSBmcm9tICd3ZXN0ZmllbGQtcnVudGltZS1jbGllbnQnO1xuY2xhc3MgU2htQnVmZmVyUG9vbCB7XG4gICAgY29uc3RydWN0b3IoYXZhaWxhYmxlKSB7XG4gICAgICAgIHRoaXMuX2J1c3kgPSBbXTtcbiAgICAgICAgdGhpcy5fYXZhaWxhYmxlID0gYXZhaWxhYmxlO1xuICAgICAgICB0aGlzLl9idXN5ID0gW107XG4gICAgfVxuICAgIHN0YXRpYyBjcmVhdGUod2ViU2htLCBwb29sU2l6ZSwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgICBjb25zdCBhdmFpbGFibGUgPSBuZXcgQXJyYXkocG9vbFNpemUpO1xuICAgICAgICBjb25zdCBzaG1CdWZmZXJQb29sID0gbmV3IFNobUJ1ZmZlclBvb2woYXZhaWxhYmxlKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb29sU2l6ZTsgaSsrKSB7XG4gICAgICAgICAgICBhdmFpbGFibGVbaV0gPSBTaG1CdWZmZXIuY3JlYXRlKHdlYlNobSwgd2lkdGgsIGhlaWdodCwgc2htQnVmZmVyUG9vbCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNobUJ1ZmZlclBvb2w7XG4gICAgfVxuICAgIGdpdmUoc2htQnVmZmVyKSB7XG4gICAgICAgIGNvbnN0IGlkeCA9IHRoaXMuX2J1c3kuaW5kZXhPZihzaG1CdWZmZXIpO1xuICAgICAgICBpZiAoaWR4ID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuX2J1c3kuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fYXZhaWxhYmxlLnB1c2goc2htQnVmZmVyKTtcbiAgICB9XG4gICAgdGFrZSgpIHtcbiAgICAgICAgY29uc3Qgc2htQnVmZmVyID0gdGhpcy5fYXZhaWxhYmxlLnNoaWZ0KCk7XG4gICAgICAgIGlmIChzaG1CdWZmZXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5fYnVzeS5wdXNoKHNobUJ1ZmZlcik7XG4gICAgICAgICAgICByZXR1cm4gc2htQnVmZmVyO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cbmNsYXNzIFNobUJ1ZmZlciB7XG4gICAgY29uc3RydWN0b3IocHJveHksIGJ1ZmZlclByb3h5LCBwaXhlbENvbnRlbnQsIGFycmF5QnVmZmVyLCB3aWR0aCwgaGVpZ2h0LCBzaG1CdWZmZXJQb29sKSB7XG4gICAgICAgIHRoaXMucHJveHkgPSBwcm94eTtcbiAgICAgICAgdGhpcy5idWZmZXJQcm94eSA9IGJ1ZmZlclByb3h5O1xuICAgICAgICB0aGlzLl9waXhlbENvbnRlbnQgPSBwaXhlbENvbnRlbnQ7XG4gICAgICAgIHRoaXMuYXJyYXlCdWZmZXIgPSBhcnJheUJ1ZmZlcjtcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgdGhpcy5fc2htQnVmZmVyUG9vbCA9IHNobUJ1ZmZlclBvb2w7XG4gICAgfVxuICAgIHN0YXRpYyBjcmVhdGUod2ViU2htLCB3aWR0aCwgaGVpZ2h0LCB3ZWJBcnJheUJ1ZmZlclBvb2wpIHtcbiAgICAgICAgY29uc3QgYXJyYXlCdWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoaGVpZ2h0ICogd2lkdGggKiBVaW50MzJBcnJheS5CWVRFU19QRVJfRUxFTUVOVCk7XG4gICAgICAgIGNvbnN0IHBpeGVsQ29udGVudCA9IHdlYkZTLmZyb21BcnJheUJ1ZmZlcihhcnJheUJ1ZmZlcik7XG4gICAgICAgIGNvbnN0IHByb3h5ID0gd2ViU2htLmNyZWF0ZVdlYkFycmF5QnVmZmVyKCk7XG4gICAgICAgIGNvbnN0IGJ1ZmZlclByb3h5ID0gd2ViU2htLmNyZWF0ZUJ1ZmZlcihwcm94eSwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgIGNvbnN0IHNobUJ1ZmZlciA9IG5ldyBTaG1CdWZmZXIocHJveHksIGJ1ZmZlclByb3h5LCBwaXhlbENvbnRlbnQsIGFycmF5QnVmZmVyLCB3aWR0aCwgaGVpZ2h0LCB3ZWJBcnJheUJ1ZmZlclBvb2wpO1xuICAgICAgICBwcm94eS5saXN0ZW5lciA9IHNobUJ1ZmZlcjtcbiAgICAgICAgYnVmZmVyUHJveHkubGlzdGVuZXIgPSBzaG1CdWZmZXI7XG4gICAgICAgIHJldHVybiBzaG1CdWZmZXI7XG4gICAgfVxuICAgIGF0dGFjaCgpIHtcbiAgICAgICAgdGhpcy5wcm94eS5hdHRhY2godGhpcy5fcGl4ZWxDb250ZW50KTtcbiAgICB9XG4gICAgZGV0YWNoKGNvbnRlbnRzKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB0aGlzLl9waXhlbENvbnRlbnQgPSBjb250ZW50cztcbiAgICAgICAgICAgIHRoaXMuYXJyYXlCdWZmZXIgPSAoeWllbGQgY29udGVudHMuZ2V0VHJhbnNmZXJhYmxlKCkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVsZWFzZSgpIHtcbiAgICAgICAgdGhpcy5fc2htQnVmZmVyUG9vbC5naXZlKHRoaXMpO1xuICAgIH1cbn1cbmNsYXNzIFdpbmRvdyB7XG4gICAgY29uc3RydWN0b3IocmVnaXN0cnksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgdGhpcy5fcmVnaXN0cnkgPSByZWdpc3RyeTtcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZSh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIGNvbnN0IHJlZ2lzdHJ5ID0gZGlzcGxheS5nZXRSZWdpc3RyeSgpO1xuICAgICAgICBjb25zdCB3aW5kb3cgPSBuZXcgV2luZG93KHJlZ2lzdHJ5LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgcmVnaXN0cnkubGlzdGVuZXIgPSB3aW5kb3c7XG4gICAgICAgIHJldHVybiB3aW5kb3c7XG4gICAgfVxuICAgIGdsb2JhbChuYW1lLCBpbnRlcmZhY2VfLCB2ZXJzaW9uKSB7XG4gICAgICAgIGlmIChpbnRlcmZhY2VfID09PSBXbENvbXBvc2l0b3JQcm90b2NvbE5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbXBvc2l0b3IgPSB0aGlzLl9yZWdpc3RyeS5iaW5kKG5hbWUsIGludGVyZmFjZV8sIFdsQ29tcG9zaXRvclByb3h5LCB2ZXJzaW9uKTtcbiAgICAgICAgICAgIHRoaXMuX3N1cmZhY2UgPSB0aGlzLl9jb21wb3NpdG9yLmNyZWF0ZVN1cmZhY2UoKTtcbiAgICAgICAgICAgIHRoaXMuX29uRnJhbWUgPSBmcmFtZSh0aGlzLl9zdXJmYWNlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW50ZXJmYWNlXyA9PT0gR3JXZWJTaG1Qcm90b2NvbE5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3dlYlNobSA9IHRoaXMuX3JlZ2lzdHJ5LmJpbmQobmFtZSwgaW50ZXJmYWNlXywgR3JXZWJTaG1Qcm94eSwgdmVyc2lvbik7XG4gICAgICAgICAgICB0aGlzLl9zaG1CdWZmZXJQb29sID0gU2htQnVmZmVyUG9vbC5jcmVhdGUodGhpcy5fd2ViU2htLCAyLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGludGVyZmFjZV8gPT09IFdsU2hlbGxQcm90b2NvbE5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3NoZWxsID0gdGhpcy5fcmVnaXN0cnkuYmluZChuYW1lLCBpbnRlcmZhY2VfLCBXbFNoZWxsUHJveHksIHZlcnNpb24pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGluaXQoKSB7XG4gICAgICAgIGlmICh0aGlzLl9zaGVsbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBkaXNwbGF5LmNsb3NlKCk7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHNoZWxsIHByb3h5LicpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9zdXJmYWNlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGRpc3BsYXkuY2xvc2UoKTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gc3VyZmFjZSBwcm94eS4nKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zaGVsbFN1cmZhY2UgPSB0aGlzLl9zaGVsbC5nZXRTaGVsbFN1cmZhY2UodGhpcy5fc3VyZmFjZSk7XG4gICAgICAgIHRoaXMuX3NoZWxsU3VyZmFjZS5saXN0ZW5lciA9IHRoaXM7XG4gICAgICAgIHRoaXMuX3NoZWxsU3VyZmFjZS5zZXRUb3BsZXZlbCgpO1xuICAgICAgICB0aGlzLl9zaGVsbFN1cmZhY2Uuc2V0VGl0bGUoJ1NpbXBsZSBXZWIgU2htJyk7XG4gICAgfVxuICAgIF9wYWludFBpeGVscyhzaG1CdWZmZXIsIHRpbWVzdGFtcCkge1xuICAgICAgICBjb25zdCBoYWxmaCA9IHNobUJ1ZmZlci53aWR0aCA+PiAxO1xuICAgICAgICBjb25zdCBoYWxmdyA9IHNobUJ1ZmZlci5oZWlnaHQgPj4gMTtcbiAgICAgICAgbGV0IGlyO1xuICAgICAgICBsZXQgb3I7XG4gICAgICAgIGNvbnN0IGltYWdlID0gbmV3IFVpbnQzMkFycmF5KHNobUJ1ZmZlci5hcnJheUJ1ZmZlcik7XG4gICAgICAgIC8qIHNxdWFyZWQgcmFkaWkgdGhyZXNob2xkcyAqL1xuICAgICAgICBvciA9IChoYWxmdyA8IGhhbGZoID8gaGFsZncgOiBoYWxmaCkgLSA4O1xuICAgICAgICBpciA9IG9yIC0gMzI7XG4gICAgICAgIG9yID0gb3IgKiBvcjtcbiAgICAgICAgaXIgPSBpciAqIGlyO1xuICAgICAgICBsZXQgb2Zmc2V0ID0gMDtcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBzaG1CdWZmZXIuaGVpZ2h0OyB5KyspIHtcbiAgICAgICAgICAgIGNvbnN0IHkyID0gKHkgLSBoYWxmaCkgKiAoeSAtIGhhbGZoKTtcbiAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgc2htQnVmZmVyLndpZHRoOyB4KyspIHtcbiAgICAgICAgICAgICAgICBsZXQgdjtcbiAgICAgICAgICAgICAgICBsZXQgdyA9IDB4ZmYwMDAwMDA7XG4gICAgICAgICAgICAgICAgLyogc3F1YXJlZCBkaXN0YW5jZSBmcm9tIGNlbnRlciAqL1xuICAgICAgICAgICAgICAgIGNvbnN0IHIyID0gKHggLSBoYWxmdykgKiAoeCAtIGhhbGZ3KSArIHkyO1xuICAgICAgICAgICAgICAgIGlmIChyMiA8IGlyKSB7XG4gICAgICAgICAgICAgICAgICAgIHYgPSAoKHIyID4+IDUpICsgKHRpbWVzdGFtcCA+PiA2KSkgKiAweDAwODA0MDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHIyIDwgb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgdiA9ICh5ICsgKHRpbWVzdGFtcCA+PiA1KSkgKiAweDAwODA0MDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2ID0gKHggKyAodGltZXN0YW1wID4+IDQpKSAqIDB4MDA4MDQwMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gQVJHQiA9PiBBQkdSIChSR0JBIExFKVxuICAgICAgICAgICAgICAgIHcgfD0gKCh2ICYgMHgwMGZmMDAwMCkgPj4gMTYpOyAvLyBSXG4gICAgICAgICAgICAgICAgdyB8PSAoKHYgJiAweDAwMDBmZjAwKSk7IC8vIEdcbiAgICAgICAgICAgICAgICB3IHw9ICgodiAmIDB4MDAwMDAwZmYpIDw8IDE2KTsgLy8gQlxuICAgICAgICAgICAgICAgIGltYWdlW29mZnNldCsrXSA9IHc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZHJhdyh0aW1lc3RhbXApIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBpZiAodGhpcy5fc2htQnVmZmVyUG9vbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBkaXNwbGF5LmNsb3NlKCk7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHNobSBidWZmZXIgcG9vbC4nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fc3VyZmFjZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBkaXNwbGF5LmNsb3NlKCk7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHN1cmZhY2UgcHJveHkuJyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2htQnVmZmVyID0gdGhpcy5fc2htQnVmZmVyUG9vbC50YWtlKCk7XG4gICAgICAgIGlmIChzaG1CdWZmZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhaW50UGl4ZWxzKHNobUJ1ZmZlciwgdGltZXN0YW1wKTtcbiAgICAgICAgICAgIHNobUJ1ZmZlci5hdHRhY2goKTtcbiAgICAgICAgICAgIHRoaXMuX3N1cmZhY2UuYXR0YWNoKHNobUJ1ZmZlci5idWZmZXJQcm94eSwgMCwgMCk7XG4gICAgICAgICAgICB0aGlzLl9zdXJmYWNlLmRhbWFnZSgwLCAwLCBzaG1CdWZmZXIud2lkdGgsIHNobUJ1ZmZlci5oZWlnaHQpO1xuICAgICAgICAgICAgLy8gV2FpdCBmb3IgdGhlIGNvbXBvc2l0b3IgdG8gc2lnbmFsIHRoYXQgd2UgY2FuIGRyYXcgdGhlIG5leHQgZnJhbWUuXG4gICAgICAgICAgICAvLyBOb3RlIHRoYXQgdXNpbmcgJ2F3YWl0JyBoZXJlIHdvdWxkIHJlc3VsdCBpbiBhIGRlYWRsb2NrIGFzIHRoZSBldmVudCBsb29wIHdvdWxkIGJlIGJsb2NrZWQsIGFuZCB0aGUgZXZlbnRcbiAgICAgICAgICAgIC8vIHRoYXQgcmVzb2x2ZXMgdGhlIGF3YWl0IHN0YXRlIHdvdWxkIG5ldmVyIGJlIHBpY2tlZCB1cCBieSB0aGUgYmxvY2tlZCBldmVudCBsb29wLlxuICAgICAgICAgICAgKF9hID0gdGhpcy5fb25GcmFtZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwodGhpcykudGhlbih0aW1lc3RhbXAgPT4gdGhpcy5kcmF3KHRpbWVzdGFtcCkpO1xuICAgICAgICAgICAgLy8gc2VyaWFsIGlzIG9ubHkgcmVxdWlyZWQgaWYgb3VyIGJ1ZmZlciBjb250ZW50cyB3b3VsZCB0YWtlIGEgbG9uZyB0aW1lIHRvIHNlbmQgdG8gdGhlIGNvbXBvc2l0b3IgaWUuIGluIGEgbmV0d29yayByZW1vdGUgY2FzZVxuICAgICAgICAgICAgdGhpcy5fc3VyZmFjZS5jb21taXQoMCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdBbGwgYnVmZmVycyBvY2N1cGllZCBieSBjb21wb3NpdG9yIScpO1xuICAgICAgICAgICAgZGlzcGxheS5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdsb2JhbFJlbW92ZShuYW1lKSB7XG4gICAgICAgIC8vIEZJWE1FIGtlZXAgdHJhY2sgb2YgdGhlIG5hbWUgbnVtYmVyIG9mIHRoZSBnbG9iYWxzIHdlIGJpbmQgc28gd2UgY2FuIGRvIGNsZWFudXAgaWYgYSBnbG9iYWwgc2hvdWxkIGdvIGF3YXkuXG4gICAgfVxuICAgIGNvbmZpZ3VyZShlZGdlcywgd2lkdGgsIGhlaWdodCkge1xuICAgIH1cbiAgICBwaW5nKHNlcmlhbCkge1xuICAgICAgICBpZiAodGhpcy5fc2hlbGxTdXJmYWNlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gc2hlbGwgc3VyZmFjZSBwcm94eS4nKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zaGVsbFN1cmZhY2UucG9uZyhzZXJpYWwpO1xuICAgIH1cbiAgICBwb3B1cERvbmUoKSB7XG4gICAgfVxufVxuZnVuY3Rpb24gbWFpbigpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAvLyBjcmVhdGUgYSBuZXcgd2luZG93IHdpdGggc29tZSBidWZmZXJzXG4gICAgICAgIGNvbnN0IHdpbmRvdyA9IFdpbmRvdy5jcmVhdGUoMjUwLCAyNTApO1xuICAgICAgICAvLyBjcmVhdGUgYSBzeW5jIHByb21pc2VcbiAgICAgICAgY29uc3Qgc3luY1Byb21pc2UgPSBkaXNwbGF5LnN5bmMoKTtcbiAgICAgICAgLy8gZmx1c2ggb3V0IHdpbmRvdyBjcmVhdGlvbiAmIHN5bmMgcmVxdWVzdHMgdG8gdGhlIGNvbXBvc2l0b3JcbiAgICAgICAgZGlzcGxheS5mbHVzaCgpO1xuICAgICAgICAvLyB3YWl0IGZvciBjb21wb3NpdG9yIHRvIGhhdmUgcHJvY2Vzc2VkIGFsbCBvdXIgb3V0Z29pbmcgcmVxdWVzdHNcbiAgICAgICAgeWllbGQgc3luY1Byb21pc2U7XG4gICAgICAgIC8vIE5vdyBiZWdpbiBkcmF3aW5nIGFmdGVyIHRoZSBjb21wb3NpdG9yIGlzIGRvbmUgcHJvY2Vzc2luZyBhbGwgb3VyIHJlcXVlc3RzXG4gICAgICAgIHdpbmRvdy5pbml0KCk7XG4gICAgICAgIHdpbmRvdy5kcmF3KDApO1xuICAgICAgICAvLyB3YWl0IGZvciB0aGUgZGlzcGxheSBjb25uZWN0aW9uIHRvIGNsb3NlXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB5aWVsZCBkaXNwbGF5Lm9uQ2xvc2UoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdBcHBsaWNhdGlvbiBleGl0LicpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdBcHBsaWNhdGlvbiB0ZXJtaW5hdGVkIHdpdGggZXJyb3IuJyk7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUuc3RhY2tUcmFjZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbm1haW4oKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=