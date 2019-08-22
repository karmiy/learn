## 编写loader

[编写一个loader](https://webpack.docschina.org/contribute/writing-a-loader)

### 基本示例

自定义loader，将js中的 'this' 都转为 'that'

    // 1、入口文件src/index.js
    console.log("What's this?");
    console.log("Emmmmm...");
    console.log("Who is she?");
    console.log("XXX");
    
    // 2、根目录下新建loaders文件夹，新建replace.loader.js
    module.exports = function(source) {
        // source为源代码，即index.js里的内容，是个字符串
        // 将字符串里的 'this' 改为 'that'
        return source.replace(/this/g, 'that');
    }
    
    // 3、配置webpack.config.js
    const path = require('path');
    const { CleanWebpackPlugin } = require('clean-webpack-plugin')
    
    module.exports = {
        mode: "development",
        entry: {
            index: './src/index.js',
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].js',
        },
        resolve: {
            extensions: ['.js'],
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: path.resolve(__dirname, './loaders/replace.loader.js'), // 使用我们的自定义loader
                },
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
        ]
    }
    
    // 4、配置package.json
    "scripts": {
        "build": "webpack --progress --config webpack.config.js"
    },

    执行npm run build
    
![Alt text](./imgs/14-01.png)

### resolveLoader

可以看到，配置loader时需要加上path.resolve(__dirname, ...)，很不方便

配置**resolveLoader**可以解决这个问题

    module.exports = {
        ...
        resolve: {
            extensions: ['.js'],
        },
        resolveLoader: {
            modules: ['node_modules', './loaders'], // 当使用loader时，先去node_modules找，再去./loaders下找
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: 'replace.loader', // 使用我们的自定义loader
                },
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
        ]
    }

### options配置

    // 1、修改webpack.config.js
    const path = require('path');
    const { CleanWebpackPlugin } = require('clean-webpack-plugin')
    
    module.exports = {
        mode: "development",
        entry: {
            index: './src/index.js',
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].js',
        },
        resolve: {
            extensions: ['.js'],
        },
         resolveLoader: {
            modules: ['node_modules', './loaders'], // 当使用loader时，先去node_modules找，再去./loaders下找
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'replace.loader',
                            options: {
                                name: 'karloy', // 传递参数name
                            }
                        }
                    ],
                },
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
        ]
    }
    
    // 2、修改loaders/replace.loader.js
    module.exports = function(source) {
        // this.query接收options对象
        // 将JS中的 'XXX' 改为options的name配置
        return source
            .replace(/this/g, 'that')
            .replace(/XXX/g, this.query.name || 'kealm');
    }
    
    执行npm run build
    
![Alt text](./imgs/14-02.png)

如果**options不是一个对象**，而是按字符串的形式，可能会产生一些问题

官方推荐使用**loader-utils**来获取options，而不是使用this.query

    // 1、安装依赖
    npm i loader-utils --save-dev
    
    // 2、修改loaders/replace.loader.js
    const loaderUtils = require('loader-utils')
    
    module.exports = function(source) {
        // 获取options对象
        const options = loaderUtils.getOptions(this)
        return source
            .replace(/this/g, 'that')
            .replace(/XXX/g, options.name || 'kealm');
    }
    
    执行npm run build，可以看到效果是一样的
    
### this.callback

当我们想传递更多的参数时，return就不适用了

官方给我们提供了**this.callback**这个API解决这个问题

用法如下:

    this.callback(
        err: Error | null,
        content: string | Buffer,
        sourceMap?: SourceMap, // 此模块可解析的源映射
        meta?: any, // 可以是任何内容，例如一些元数据
    )
    
这里不详谈全部参数，我们用callback来实现之前的示例:

    const loaderUtils = require('loader-utils')
    
    module.exports = function(source, map, meta) {
        const options = loaderUtils.getOptions(this)
        const result =  source
            .replace(/this/g, 'that')
            .replace(/XXX/g, options.name || 'kealm');
        this.callback(null, result, map, meta);
        // 当使用callback时要返回undefined来告诉webpacck返回从callback取而不是return
        return;
    }
    
    执行npm run build，打包后可以看到效果是一样的
    
### this.async

当在loader中写异步代码，单纯的使用this.callback是会报错的

官方提供**this.async**来实现loader中的异步操作，async是一个封装后的this.callback


    // 1、新增loaders/translate.loader.js
    module.exports = function(source) {
        const callback = this.async(); // 使用async实现异步操作
        setTimeout(() => {
            callback(null, source.replace(/Emmmmm/g, '嗯...'))
        }, 2000);
    }

    // 2、配置webpack.config.js
    const path = require('path');
    const { CleanWebpackPlugin } = require('clean-webpack-plugin')
    
    module.exports = {
        mode: "development",
        entry: {
            index: './src/index.js',
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].js',
        },
        resolve: {
            extensions: ['.js'],
        },
        resolveLoader: {
            modules: ['node_modules', './loaders']
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                        'translate.loader', // 配置多个loader，加载顺序是从下往上，从右往左，这里是: replace => translate
                        {
                            loader: 'replace.loader',
                            options: {
                                name: 'karloy', // 传递参数name
                            }
                        }
                    ],
                },
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
        ]
    }
    
    执行npm run build
    
![Alt text](./imgs/14-03.png)