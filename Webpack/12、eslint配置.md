## eslint配置

为了让代码让规范，项目开发中通常会安装eslint来校验代码的格式

可以根据定制的规范去矫正代码写法，配置具体可了解 [eslint配置规则](https://cn.eslint.org)
    
    // 1、安装依赖
    npm i eslint eslint-loader --save-dev
    
    // 2、根目录下初始化一份.eslintrc.js文件
    执行npx eslint --init
    
![Alt text](./imgs/12-01.png)
    
    // 3、生成.eslintrc.js文件
    module.exports = {
        "env": {
            "browser": true,
            "es6": true
        },
        "extends": "eslint:recommended",
        "globals": {
            "Atomics": "readonly",
            "SharedArrayBuffer": "readonly"
        },
        "parserOptions": {
            "ecmaVersion": 2018,
            "sourceType": "module"
        },
        "rules": {
        }
    };
    
    // 4、配置webpack.config.js
    const path = require('path')
    const { CleanWebpackPlugin } = require('clean-webpack-plugin')
    
    module.exports = {
        mode: 'production',
        entry: {
            index: './src/index.js',
        },
        output: {
            path: path.resolve(__dirname, '..', 'dist'),
            filename: '[name].js',
        },
        resolve: {
            extensions: ['.js'],
            alias: {
                '@': path.join(__dirname, '..', 'src'),
            },
        },
        module: {
            rules: [
                {
                    test: /\.js$/, // 使用正则来匹配 js 文件
                    exclude: /node_modules/, // 排除依赖包文件夹
                    use: [
                        'babel-loader',
                        {
                            loader: 'eslint-loader',
                            options: {
                                fix: true, // 自动修复一些可以修复的错误，不能修复的还是需要自己修复
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
    
    // 5、编写src/index.js入口文件
    let a = 1
    
    console.log(1);
    
    // 6、配置package.json
    "scripts": {
        "lint": "eslint --ext .js src/"  // 编译 src下的js文件
    },
    
    执行npm run lint
    
![Alt text](./imgs/12-02.png)

### 编辑器开启eslint

我们还可以让自己的编辑器开启eslint去自动检测

以VSCode为例

![Alt text](./imgs/12-03.png)

![Alt text](./imgs/12-04.png)