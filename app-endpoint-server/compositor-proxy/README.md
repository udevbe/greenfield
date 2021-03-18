# Usage
### Building
- `yarn global add cmake-js`
- `yarn install && yarn generate && yarn build`
### Running
- `yarn start`

# Configuration
There's a file `config.json5` that you can adjust to specify hardware accelerated video encoding (nvidia only) or
software based encoding. OpenGL (any gpu) is used for color conversion and is recommended for best performance.

`config.json5` is also used to specify which applications can be launched by the remote browser compositor.

# Docker
There's a docker build file that you can build & use. Note that this docker file uses headless software rendering, so
performance might be degraded.
- `docker build . -t app-endpoint-server`
- `docker run -p8081:8081 app-endpoint-server`

The docker build file includes the test applications `gtk3-demo` and `kwrite`. You can replace these with your own preferred applications.
