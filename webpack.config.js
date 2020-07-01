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
    // hash: true,
    // filename: 'index.html',
    // title: 'joknuden',
    template: path.resolve(__dirname, 'src', 'index.html'),
    // chunks: ['joknuden'],
});

const extractSass = new ExtractTextPlugin({
    filename: '[name].[hash].css'
});




const config = {
    entry: path.resolve(__dirname, 'src', 'index.tsx'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['ts-loader'],
            },
            {
                test: /\.s(a|c)ss$/,
                use: [
                  'style-loader',
                  {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        // modules: {
                        //     // localIdentName: '[local]',
                        //     mode: 'local',
                        //     exportGlobals: true,
                        //     localIdentName: '[path][name]__[local]--[hash:base64:5]',
                        //     context: path.resolve(__dirname, 'src'),
                        //     hashPrefix: 'my-custom-hash',
                        // },
                    },
                  },
                  'sass-loader',
                ],
            },
            {
                test: /\.html/,
                use: ['html-loader'],
            },
            {
                test: /\.(jpg|jpeg|gif|png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=1024',
            },
        ],
    },
    plugins: [
        // copyAssetsPlugin,
        htmlWebpackPlugin,
        // extractSass,
        // new BundleAnalyzerPlugin(),
    ],
};

module.exports = config;