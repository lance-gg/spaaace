var path = require('path');
var fs = require('fs');

module.exports = {
    entry: './src/client/clientEntryPoint.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        preLoaders: [
            { test: /\.json$/, exclude: /node_modules/, loader: 'json' },
            { test: /(ServerEngine)/, loader: 'null' }
        ],
        loaders: [
            { test: /\.css$/, loader: 'style!css' },
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'node_modules/incheon'),
                    fs.realpathSync('./node_modules/incheon')
                ],
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    resolve: { fallback: path.join(__dirname, 'node_modules') },
    resolveLoader: { fallback: path.join(__dirname, 'node_modules') }
};
