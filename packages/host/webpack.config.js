const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "./src/index.js"),
  output: {
    publicPath: "auto",
  },
  resolve: {
    extensions: [".js", ".jsx", ".css"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "esbuild-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
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
    port: 8080,
    open: true,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "Host",
      remotes: {
        GameOfLifeModule: `GameOfLifeModule@http://localhost:8081/remoteEntry.js`,
        Viz: `Viz@http://localhost:8083/remoteEntry.js`,
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
