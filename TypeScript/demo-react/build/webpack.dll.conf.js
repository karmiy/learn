const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        /*'react': ['react'],
        'reactDom': ['react-dom'],
        'reactRouterDom': ['react-router-dom'],*/
        'react': ['react', 'react-dom', 'react-router-dom'],
    },
    output: {
        filename: '[name].dll.js',
        path: path.resolve(__dirname, '../dll'),
        library: '[name]'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DllPlugin({
            name: '[name]',
            // 用这个插件来分析打包后的这个库，把库里的第三方映射关系放在了这个 json 的文件下，这个文件在 dll 目录下
            path: path.resolve(__dirname, '../dll/[name].manifest.json')
        })
    ],
}