const path = require('path');

module.exports = {
  mode: 'development',
  // entry: { index: "./src/index.js" },
  experiments: { asyncWebAssembly: true },
  module: {
    rules: [
      {
        type: "asset/resource",
        exclude: [ /\.wasm$/ ]
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        include: [ path.resolve(__dirname, "./styles") ],
        use: [
          {
            loader: "file-loader",
            options: { name: "[name].min.css" }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.m?js$/,
        type: "javascript/auto"
      },
      {
        test: /\.m?js$/,
        resolve: { fullySpecified: false }
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve(__dirname, "./styles" ),
      path.resolve(__dirname, "node_modules" )
    ]
  },
  devtool: 'inline-source-map',
  output: {
    filename: 'index.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
      watch: true
    },
    compress: true,
    port: 9000,
  },
};