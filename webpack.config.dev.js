const merge = require('webpack-merge');
const config = require ('./webpack.config');
const path = require('path');

module.exports = merge(config, {
    devtool: 'inline-source-map',
    mode: 'development',
    devServer: {
        port: 9000,
        disableHostCheck: true,
        compress: true,
        inline: true,
        contentBase: path.join(__dirname, 'dist'),
        // historyApiFallback: {
        //     index: 'index.html',
        // },
        historyApiFallback: true,
    },
    output: {
        publicPath: '/',
    },
});
