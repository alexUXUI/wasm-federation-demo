const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "./src/index.js"),
  output: {
    publicPath: "auto",
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "esbuild-loader",
      },
      {
        test: /\.jsx$/,
        loader: "esbuild-loader",
        options: {
          loader: "jsx",
          target: "es2015",
        },
      },
    ],
  },
  devServer: {
    contentBase: path.resolve(__dirname, "./dist"),
    port: 3000,
    open: true,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "Host",
      remotes: {
        WasmModule: `WasmModule@http://localhost:3001/remoteEntry.js`,
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
