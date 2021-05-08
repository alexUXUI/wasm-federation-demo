const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
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
    open: false,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
    },
  },
  plugins: [
    new CopyPlugin([path.resolve(__dirname, "public")]),

    new WasmPackPlugin({
      crateDirectory: __dirname,
    }),

    new ModuleFederationPlugin({
      name: "WasmModule",
      filename: "remoteEntry.js",
      exposes: {
        "./WasmModule": "./pkg/",
      },
    }),
  ],
  experiments: { asyncWebAssembly: true },
};
