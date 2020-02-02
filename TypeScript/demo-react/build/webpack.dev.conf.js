const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.conf');

module.exports = merge(baseConfig, {
    mode: "development",
    devtool: 'cheap-module-eval-source-map', // 开启development调试
    entry: ["react-hot-loader/patch"],
    output: {
        path: path.resolve(__dirname, '..', 'dev'),
        publicPath: '/',
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunk.js'
    },
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom'  
        },
    },
    devServer: {
        port: 8080, // 本地服务器端口号
        hot: true, // 热重载
        overlay: true, // 如果代码出错，会在浏览器页面弹出“浮动层”。类似于 vue-cli 等脚手架
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/, // 针对 .css 后缀的文件设置 loader
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                        }
                    },
                    'postcss-loader',
                    'resolve-url-loader',
                    'sass-loader?sourceMap=true',
                ]
            },
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(), // 热部署模块
        new webpack.NamedModulesPlugin(),
    ]
})
