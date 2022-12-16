import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const entryFile = path.resolve(__dirname, "./src/index.ts");

const commonConfig = () => {
  return {
    // mode: 'development',
    // devtool: 'inline-source-map',
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
        }
      ]
    },
    resolve: {
      extensions: [".ts", ".js"]
    },
    output: {
      // put build output somewhere where the compositor can find it.
      path: path.resolve(__dirname, `./build`),
      publicPath: "/",
      filename: "app.js"
    },
    devServer: {
      static: "./dist",
      headers: { "Access-Control-Allow-Origin": "*" },
      port: 9000
    }
  };
};

export default commonConfig;
