## Babel7转译ES6

现代 Javascript 主要是用 ES6 编写的。但并非每个浏览器都知道如何处理 ES6。 我们需要某种转换，这个转换步骤称为 transpiling(转译)。transpiling(转译) 是指采用 ES6 语法，转译为旧浏览器可以理解的行为

Webpack并不知道如何转换，但是可以使用loader

**babel-loader**是一个webpack的loader，用于将ES6及以上版本转化ES5

使用需要安装一些依赖项，以Babel7为主

- @babel/core
- @babel/preset-env: 包含 ES6、7 等版本的语法转化规则
- @babel/plugin-transform-runtime: 避免 polyfill 污染全局变量，减小打包体积
- @babel/polyfill: ES6 内置方法和函数转化垫片
- babel-loader: 负责 ES6 语法转化

> 要安装@babel/core、@babel/preset-env 和 @babel/plugin-transform-runtime，而不是 babel-core、babel-preset-env 和 babel-plugin-transform-runtime，这些是babel6的


> @babel/plugin-transform-runtime 的作用：Babel 使用非常小的助手来完成常见功能。默认情况下，这将添加到需要它的每个文件中。这种重复有时是不必要的，尤其是当你的应用程序分布在多个文件上的时候。 transform-runtime 可以重复使用 Babel 注入的程序代码来节省代码，减小体积


> @babel/polyfill 的作用：Babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的 API，比如 Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Object.assign）都不会转码。必须使用 @babel/polyfill，为当前环境提供一个垫片。所谓垫片也就是垫平不同浏览器或者不同环境下的差异
     