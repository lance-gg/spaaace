const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: './src/client/clientMain.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 8080
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Development',
            template: 'index.html'
        })
    ],
    module: {
        loaders: [
            { test: /\.json$/, loader: 'json-loader' },
            { test: /\.css$/, loader: 'style!css' },
            {
                test: /\.scss$/,
                loaders: ['style-loader', 'raw-loader', 'sass-loader']
            },
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'node_modules/lance-gg'),
                    fs.realpathSync('./node_modules/lance-gg')
                ],
                loader: 'babel-loader',
                query: {
                    presets: [
                        'babel-preset-es2015'
                    ].map(require.resolve),
                }
            }
        ]
    },
    resolve: {
        alias: {
            lance: path.resolve(__dirname, 'node_modules/lance-gg/src/'),
        }
    }
};
