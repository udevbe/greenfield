#Introduction

Greenfield is a [Wayland compositor](https://en.wikipedia.org/wiki/Wayland_%28display_server_protocol%29) written entirely
in JavaScript while utilizing WebAssembly for the performance critical parts. It can run native Wayland 
applications remotely or it can run Wayland [web applications](https://preview.greenfield.app) directly in your browser.
No plugins required.

## Applications

Because Greenfield is 100% compatible Wayland compositor running in the browser, it does not care where and how
Wayland client applications run. This has some interesting implications.

* [Remote Applications](remote_applications.md)
* [Web Applications](web_applications.md)