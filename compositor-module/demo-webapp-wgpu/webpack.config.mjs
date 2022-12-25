import path from "path";
import { fileURLToPath } from "url";

// import WasmPackPlugin from "@wasm-tool/wasm-pack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const entryFile = path.resolve(__dirname, "./src/index.ts");
const commonConfig = () => {
  return {
    entry: [entryFile],
    target: "webworker",
    mode: "production",
    module: {
      rules: [
        // Handle TypeScript
        {
          test: /\.(ts?)$/,
          use: "ts-loader",
          exclude: [/node_modules/]
        },
        // Handle WebAssembly
        {
          test: /\.wasm$/,
          type: "webassembly/async"
        }
      ]
    },
    experiments: {
      asyncWebAssembly: true,
    },
    resolve: {
      extensions: [".ts", ".js"]
    },
    output: {
      clean: true,
      filename: "app.js"
    },
    devServer: {
      static: "./dist",
      headers: { "Access-Control-Allow-Origin": "*" },
      port: 9001
    }
  };
};

export default commonConfig;
