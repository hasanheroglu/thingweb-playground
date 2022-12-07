const path = require('path')
const webpack = require('webpack')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = {
    resolve: {
        fallback: {
            "buffer": require.resolve('buffer/'),
            "http": false,
            "https": false,
            "stream": false,
            "path": false
        }
    },
    "mode": "none", 
    "entry": "./script.js",
    "output": {
        "path": __dirname + '/out/',
        "filename": "bundle.js"
    },
    "module": {
        "rules": [ {
            "test": /\.css$/,
            "use": [ "style-loader", "css-loader" ],
        },
        {
            "test": /\.js$/,
            "exclude": /node_modules/,
            "use": {
                "loader": "babel-loader",
                "options": {
                    "presets": [ "@babel/preset-env" ]
                }
            }
        },
        {
            test: /\.csv$/,
            use: [ 'csv-loader' ]
          }]
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser'
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer']
        }),
        new MonacoWebpackPlugin(),
        new MiniCssExtractPlugin()
    ]
}