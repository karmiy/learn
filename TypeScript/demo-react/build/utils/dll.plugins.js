const path = require('path');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')
const webpack = require('webpack')
const fs = require('fs')

const files = fs.readdirSync(path.resolve(__dirname, '../../dll'))
const dllPlugins = [];
files.forEach(file => {
    /.*\.dll.js/.test(file) && dllPlugins.push(
        new AddAssetHtmlWebpackPlugin({
            filepath: path.resolve(__dirname, '../../dll', file)
        })
    );
    /.*\.manifest.json/.test(file) && dllPlugins.push(
        new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, '../../dll', file)
        })
    )
})

module.exports = dllPlugins;