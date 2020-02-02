const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩 css
const CopyWebpackPlugin = require('copy-webpack-plugin');
const baseConfig = require('./webpack.base.conf');
const path = require('path');
const pkg = require('../package');
const { name, version } = pkg;

// 排除包
const externals = {};
const excludes = [
    '@babel/polyfill',
    '@babel/runtime',
    '@babel/runtime-corejs3',
    '@hot-loader/react-dom',
    'core-js',
    'react-router-dom'
];
Object.keys(pkg.dependencies).forEach(item => {
    !excludes.includes(item) && (externals[item] = item);
})

// 基本配置
const { context, resolve } = baseConfig;

/* 包说名 */
const banner =
    ` ${name} v${version}\n` +
    ` (c) ${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${(new Date().getDate().toString().padStart(2, '0'))} karmiy\n` +
    ` Release under the ISC License.\n` +
    ''

module.exports = {
    mode: "production",
    context,
    entry: './packages/index.jsx',
    output: {
        path: path.resolve(__dirname, '..', 'publish',  'lib'),
        filename: 'index.js',
        libraryTarget: 'umd',
    },
    resolve,
    externals,
    module: {
        rules: [
            {
                test: /\.js(x?)$/, // 使用正则来匹配 js 文件
                exclude: /node_modules/, // 排除依赖包文件夹
                use: {
                    loader: 'babel-loader', // 使用 babel-loader
                }
            },
            {
                test: /\.(sa|sc|c)ss$/, // 针对 .css 后缀的文件设置 loader
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                        }
                    },
                    'postcss-loader',
                    'resolve-url-loader',
                    'sass-loader?sourceMap=true' // 使用 sass-loader 将 scss 转为 css
                ]
            },
            {
                test: /\.(eot|woff2?|ttf|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[name]-[hash:5].min.[ext]',
                            limit: 5000,
                            publicPath: '../fonts/',
                            outputPath: '../fonts/'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin({banner}),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '../styles/index.css',
            chunkFilename: '../styles/[id].css'
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'), //用于优化\最小化 CSS 的 CSS处理器，默认为 cssnano
            cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }, //传递给 cssProcessor 的选项，默认为{}
            canPrint: true //布尔值，指示插件是否以将消息打印到控制台，默认为 true
        })
    ],
}
