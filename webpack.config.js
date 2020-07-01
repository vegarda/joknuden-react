const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const copyAssetsPlugin = new CopyWebpackPlugin({
    patterns: [
        { from: './src/assets', to: 'assets' },
    ]
});

const htmlWebpackPlugin = new HtmlWebpackPlugin({
    hash: true,
    filename: 'index.html',
    title: 'joknuden',
    template: './src/index.html',
    // chunks: ['joknuden'],
});

const extractSass = new ExtractTextPlugin({
    filename: '[name].[hash].css'
});




const config = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, './dist/'),
        filename: '[name].js',
    },
    plugins: [
        copyAssetsPlugin,
        htmlWebpackPlugin,
        extractSass,
        new BundleAnalyzerPlugin(),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
            },
            {
                test: /\.s(a|c)ss$/,
                use: [
                  'style-loader',
                  {
                    loader: 'css-loader',
                    options: { modules: true }
                  },
                  'sass-loader'
                ]
            },
            {
                test: /\.(jpg|jpeg|gif|png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=1024'
            },
        ],
    },
};

module.exports = config;