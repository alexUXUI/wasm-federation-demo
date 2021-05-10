const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

const dist = path.resolve(__dirname, "dist");

module.exports = {
  entry: {
    index: "./public/index.js",
  },
  output: {
    path: dist,
    filename: "[name].js",
  },
  devServer: {
    port: 3001,
    contentBase: path.resolve(__dirname, "dist"),
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
    },
  },
  experiments: { asyncWebAssembly: true },

  plugins: [
    new CopyPlugin([path.resolve(__dirname, "public")]),

    new WasmPackPlugin({
      crateDirectory: __dirname,
    }),

    new ModuleFederationPlugin({
      name: "GameOfLifeModule",
      filename: "remoteEntry.js",
      exposes: {
        "./GameOfLifeLogic": "./pkg/",
      },
    }),
  ],
};
