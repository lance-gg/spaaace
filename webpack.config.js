var path = require("path");

module.exports = {
    entry: "./src/client/clientEntryPoint.js",
    output: {
        path: path.join(__dirname,"dist"),
        filename: "bundle.js"
    },
    module: {
        preLoaders: [
            { test: /\.json$/, exclude: /node_modules/, loader: 'json'},
            { test: /(ServerEngine)/, exclude: /node_modules/, loader: "null" }
        ],
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};