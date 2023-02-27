const path = require("path");
const fs = require("fs");

module.exports = {
  mode: "development",
  entry: "./src/client/clientEntryPoint.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js",
  },
  devtool: "source-map",
  module: {
    rules: [
      { test: /\.css$/, loader: "style-css" },
      {
        test: /\.scss$/,
        use: ["style-loader", "raw-loader", "sass-loader"],
      },
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "src"),
          path.resolve(__dirname, "node_modules/lance-gg/"),
          fs.realpathSync("./node_modules/lance-gg/"),
        ],
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"].map(require.resolve),
        },
      },
    ],
  },
  resolve: {
    fallback: {
      path: require.resolve("path-browserify"),
      http: require.resolve("stream-http"),
      url: require.resolve("url/"),
      buffer: require.resolve("buffer/"),
    },
  },
};
