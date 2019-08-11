## webpack-dev-server

### 常规配置

前面我们更多的是执行npm run build在dist文件夹下打包项目文件，也就是生产环境

在项目开发中，我们一般是使用**npm run dev**，也就是**开发环境**，对项目代码进行调试

**为什么需要开发模式:**

之前我们没做一次代码的调整，通过都需要重新build项目，生成新的文件。随着项目需求的扩大，打包速度会越来越慢，稍微修改一下代码可能需要花费几十秒去等等打包才能查看结果

开发模式使用**webpack-dev-server**开启一个本地服务器，当代码调整后，可以自动快速的刷新页面，甚至可以做到**热重载、代理请求**等操作，为项目开发提供了很大的便利

    // 1、安装依赖
    npm i webpack-dev-server --save-dev
    
    // 2、配置package.json
    "scripts": {
        "dev": "webpack-dev-server --open --progress", // --open在启动后会自动打开浏览器，--progress会在启动时将进度显示在控制台
        "build": "webpack --mode production"
    },
    
    // 3、src/vendors
    minus.js:
    module.exports = function(a, b) {
        return a - b
    }
    
    multi.js:
    define(function(require, factory) {
        'use strict'
        return function(a, b) {
            return a * b
        }
    })
    
    sum.js:
    export default function(a, b) {
        return a + b
    }
    
    // 4、src/style/base.scss
    body {
        background-color: aquamarine;
    }
    
    
    // 5、入口文件src/index.js
    import './style/base.scss'
    import sum from './vendors/sum'
    console.log('sum(1, 2) = ', sum(1, 41))
    
    var minus = require('./vendors/minus')
    console.log('minus(1, 2) = ', minus(1, 10))
    
    require(['./vendors/multi'], function(multi) {
        console.log('multi(1, 2) = ', multi(1, 2))
    })

    // 6、完整webpack.config.js
    const path = require('path')
    const webpack = require('webpack')
    const { CleanWebpackPlugin } = require('clean-webpack-plugin')
    const HtmlWebpackPlugin = require('html-webpack-plugin')
    
    module.exports = {
        mode: 'development', // 开发模式
        devtool: 'source-map', // 开启调试
        entry: {
            main: './src/index.js', // 需要打包的文件入口
        },
        output: {
            publicPath: '/', // js 引用的路径或者 CDN 地址
            path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
            filename: '[name].bundle.js', // 代码打包后的文件名
            chunkFilename: '[name].chunk.js', // 代码拆分后的文件名
        },
        resolve: {
            extensions: ['.js', '.json', '.scss', '.css'],
        },
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            port: 8080, // 本地服务器端口号
            hot: true, // 热重载
            overlay: true, // 如果代码出错，会在浏览器页面弹出“浮动层”。类似于 vue-cli 等脚手架
            proxy: {
                // 跨域代理转发
                '/help': {
                    target: 'https://www.wangsucloud.com/base-portal/frontpages/help/menu/HELP',
                    changeOrigin: true,
                    ws: false,
                    pathRewrite: {
                        [`^/help`]: '/'
                    },
                    logLevel: 'debug',
                    headers: {
                        Cookie: ''
                    }
                }
            },
        },
        module: {
            rules: [
                {
                    test: /\.(scss|css)$/, // 针对 .css 后缀的文件设置 loader
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [require('autoprefixer')]
                            }
                        },
                        'sass-loader' // 使用 sass-loader 将 scss 转为 css
                    ]
                },
                {
                    test: /\.(png|jpg|jpeg|gif)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                name: '[name]-[hash:5].min.[ext]',
                                outputPath: 'images/', // 输出到 images 文件夹
                                limit: 1000, // 小于10000K的文件会被转为base64格式
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
                                // limit: 1, // fonts file size <= 5KB, use 'base64'; else, output svg file
                                publicPath: 'fonts/',
                                outputPath: 'fonts/'
                            }
                        }
                    ]
                },
            ]
        },
        plugins: [
            new CleanWebpackPlugin(), // 默认情况下，此插件将删除 webpack output.path目录中的所有文件，以及每次成功重建后所有未使用的 webpack 资产。
            new HtmlWebpackPlugin({
                title: 'webpack-demo', // HTML中的title
                minify: {
                    // 压缩 HTML 文件
                    removeComments: true, // 移除 HTML 中的注释
                    collapseWhitespace: true, // 删除空白符与换行符
                    minifyCSS: true // 压缩内联 css
                },
                filename: 'index.html', // 生成后的文件名
                template: './index.html', // 根据此模版生成 HTML 文件
            }),
            new webpack.HotModuleReplacementPlugin(), // 热部署模块
            new webpack.NamedModulesPlugin(),
        ],
    }
    
    执行npm run dev
    
![Alt text](./imgs/08-01.png)

修改js/scss文件，会发现**页面自动刷新**

我们发现**没有生成dist文件夹**，因为webpack-dev-server是将打包文件的相关内容**存储在内存之中的**

接着我们对上述的配置进行分析

### 模块热更新

模块热更新需要 **HotModuleReplacementPlugin** 和 **NamedModulesPlugin** 这两个插件，并且**顺序不能错**，并且指定 **devServer.hot 为 true**

    const webpack = require('webpack')
    module.exports = {
        ...
        devServer: {
            ...
            hot: true, // 热重载
        },
        plugins: [
            ...
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin()
        ]
    }
    
配置了这2个插件，项目中JS代码**可以针对侦测到变更的文件并且做出相关处理**(注意是JS代码，修改index.html并不会改变)

前言中我们提到，修改文件，会发现页面**自动刷新**,这并不是我们所要说的热更新，只是webpack-dev-server启动的服务自动在我们修改后做页面的刷新

要做到热更新，我们需要在index.js中加入热更新的语句
    
    // --- 热更新 --- start
    if (module.hot) {
        module.hot.accept();
    }
    // --- 热更新 --- end
    import './style/base'
    import sum from './vendors/sum'
    console.log('sum(1, 2) = ', sum(1, 41))
    
    var minus = require('./vendors/minus')
    console.log('minus(1, 2) = ', minus(1, 10))
    
    require(['./vendors/multi'], function(multi) {
        console.log('multi(1, 2) = ', multi(1, 2))
    })
    
这时我们修改代码:

    console.log('sum(1, 2) = ', sum(1, 4111111))
    
![Alt text](./imgs/08-02.png)

会发现页面**没有重新刷新，只更新了我们修改的部分**，达到了热更新的效果

### 跨域代理

随着前后端分离开发的普及，跨域请求变得越来越常见。为了快速开发，可以利用 **devServer.proxy** 做一个代理转发，来绕过浏览器的跨域限制

devServer模块的底层是使用了 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) 

假如我们本地想请求一个跨域地址:
    
    // 安装axios依赖
    npm i axios --save
    
    // src/index.js
    import axios from 'axios'
    
    axios.get('https://www.wangsucloud.com/base-portal/frontpages/help/menu/HELP').then(res => {
        console.log(res);
    })
    
    执行npm run dev打开本地8080服务
    
![Alt text](./imgs/08-03.png)


配置devServer

    devServer: {
        ...
        proxy: {
            // 跨域代理转发
            '/help': {
                target: 'https://www.wangsucloud.com/base-portal/frontpages/help/menu/HELP',
                changeOrigin: true,
                ws: false,
                pathRewrite: {
                    [`^/help`]: '/'
                },
                logLevel: 'debug',
                headers: {
                    Cookie: ''
                }
            }
        },
    },
    
    主要配置解析:
    proxy是个对象:
        key: 项目中请求的地址，这里是请求 '/help'，即我的接口是/help开头才用代理
        value: 是对象
            changeOrigin: 将主机标头的原点更改为目标URL(是否跨域)
            ws: 是否代理websockets
            target: 代理的目标URL地址
            pathRewrite: 重定向路径
                            如果这里不配置这个，当请求 '/help'时，会变成'https://www.wangsucloud.com/base-portal/frontpages/help/menu/HELP/help'
                            可是这样路径不对，我们只想代理到'https://www.wangsucloud.com/base-portal/frontpages/help/menu/HELP'，后面不需要加'/help'
                            所以我们将'/help'重置为'/'
                            
    
    // 修改src/index.js的请求
    axios.get('/help').then(res => {
        console.log(res);
    })
                            
![Alt text](./imgs/08-04.png)

### source-map

开启source-map可以方便我们调试代码

    module.exports = {
        devtool: 'source-map', // 开启调试        
    }
    
![Alt text](./imgs/08-05.png)

### contentBase与publicPath

可以发现，在devServer中，我们配置了**contentBase**

contentBase与publicPath是比较容易弄乱的配置，下面我们一个个去分析

#### output.publicPath

先去掉devServer中的contentBase与publicPath，仅仅配置output的publicPath为 '/aaa'后启动项目

    output: {
        publicPath: '/aaa', // js 引用的路径或者 CDN 地址
        path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
        filename: '[name].bundle.js', // 代码打包后的文件名
        chunkFilename: '[name].chunk.js', // 代码拆分后的文件名
    },
    
![Alt text](./imgs/08-05-01.png)
    
打开localhost:8080，会发现只有html页面，没有加载任何资源

![Alt text](./imgs/08-06.png)

打开localhost:8080/aaa，页面、资源正常加载

![Alt text](./imgs/08-07.png)
    
> output的publicPath，会为资源加上前缀，在devServer没有配置publicPath时，webpack-dev-server打包时生成的静态文件所在位置及index.html里引用的资源前缀都是output.publicPath

#### devServer.publicPath

保留output的publicPath，配置devServer的publicPath

    devServer: {
        ...
        publicPath: '/bbb'
    }

![Alt text](./imgs/08-07-02.png)
    
这时访问localhost:8080/aaa只会html页面，没有加载任何资源

打开localhost:8080/bbb，页面正常打开，资源加载报错

![Alt text](./imgs/08-08.png)

> devServer的publicPath是打包后生成静态文件所在的位置(即打包后的main.bundle.js、index.html放在/bbb下)，但引用资源的路径前缀，还是会取output.publicPath的

#### devServer.contentBase

修改output和devServer的publicPath都是 '/bbb'

在根目录下新建kkk/index.html

![Alt text](./imgs/08-09.png)

    output: {
        publicPath: '/bbb',
        ...
    },
    devServer: {
        ...
        contentBase: './kkk',
        publicPath: '/bbb'
    }
    
![Alt text](./imgs/08-09-01.png)

打开localhost:8080，会发现打开了我们kkk/index.html

![Alt text](./imgs/08-10.png)

![Alt text](./imgs/08-11.png)

> contentBase指不是由webpack打包生成的静态文件，默认是根目录，当访问localhost:8080时，在根目录下找不到index.html，所以会去contentBase指定的./kkk下寻找，即会打开我们另外写好的那份html

**注:**

通常情况下，开发模式配置output.publicPath为'/'就可以了，让资源放于根目录下，不需要配置devServer.publicPath，这样可以与资源路径一直，也不需要配置contentBase


