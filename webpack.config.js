const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: [
            './src/test.ts'
        ],
        index: [
            './index.ts'
        ]
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
        library: 'esri-promise',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    externals: {
        // 'es6-promise': 'commonjs es6-promise'
    },

    devtool: 'source-map',

    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.jsx']
    },

    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
            { test: /\.js$/, loader: 'source-map-loader', enforce: 'pre' }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            inject: false,
            template: 'src/test.html'
        })
    ],

    devServer: {
        contentBase: __dirname + '/dist',
        historyApiFallback: true,
        hot: true,
        inline: true,
        port: 8000
    }
};
