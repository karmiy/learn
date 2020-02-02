const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HappyPack = require('happypack'); // 开启子线程并发处理任务
const os = require('os');
const HappyPackThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

module.exports = {
    context: path.resolve(__dirname, '../'), // 配置上下文，当遇到相对路径时，会以context为根目录
    entry: ['./src/index.tsx'],
    output: {
        path: path.resolve(__dirname, '..', 'dist'),
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.scss', '.css'],
        alias: {
            '@': path.join(__dirname, '..', 'src'),
            'styles': path.join(__dirname, '..', 'src/assets/styles/index.scss'),
            '@kealm/react-components': path.join(__dirname, '../packages/components/cores/index.jsx'),
            // '@kealm/react-components': path.join(__dirname, '../publish/lib/index.js'),
            '@kealm/react-components-utils': path.join(__dirname, '../packages/components/common/index.jsx'),
            '@kealm/react-components-style': path.join(__dirname, '../packages/styles/index.scss'),
            // '@kealm/react-components-style': path.join(__dirname, '../publish/styles/index.min.css'),
            'hooks': path.join(__dirname, '../packages/hooks'),
            'utils': path.join(__dirname, '../packages/utils'),
            'api': path.join(__dirname, '../src/api'),
            'demos': path.join(__dirname, '../src/demos'),
        },
    },
    module: {
        rules: [
            {
                test: /\.js(x?)$/, // 使用正则来匹配 js 文件
                exclude: /node_modules/, // 排除依赖包文件夹
                use: [
                    {
                        // 一个loader对应一个id
                        loader: "happypack/loader?id=hpBabel"
                    }
                ]
            },
            {
                // 如果这个模块是.ts或者.tsx，则会使用ts-loader把代码转成es5
                test:/\.tsx?$/,
                exclude: /node_modules/,
                loader:"ts-loader"
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            // name: '[name]-[hash:5].min.[ext]',
                            name: '[name].[ext]',
                            outputPath: 'images/', // 输出到 images 文件夹
                            limit: 10000, // 小于10000K的文件会被转为base64格式
                        }
                    },
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
                            outputPath: 'fonts/'
                        }
                    }
                ]
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'kealm-react-components', // HTML中的title
            minify: {
                // 压缩 HTML 文件
                removeComments: true, // 移除 HTML 中的注释
                collapseWhitespace: true, // 删除空白符与换行符
                minifyCSS: true // 压缩内联 css
            },
            favicon: path.resolve(__dirname, '..', 'favicon.ico'),
            filename: 'index.html', // 生成后的文件名
            template: path.resolve(__dirname, '..', 'index.html'), // 根据此模版生成 HTML 文件
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '..', 'favicon.ico'),
                to: path.resolve(__dirname, '..', 'dist', 'favicon.ico'),
            }
        ]),
        new HappyPack({
            // 用唯一的标识符id，来代表当前的HappyPack是用来处理一类特定的文件
            id:'hpBabel',
            // 如何处理.js文件，用法和Loader配置中一样
            loaders:['babel-loader?cacheDirectory'],
            threadPool: HappyPackThreadPool,
        }),
    ]
}

