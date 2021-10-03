## 升级 Webpack5 相关包

```shell
npm install --save-dev webpack@latest
npm install --save-dev webpack-cli@latest
npm install --save-dev webpack-dev-server@latest
npm install --save-dev webpack-merge@latest
```

### webpack-dev-server

```js
{
    devServer: {
        port: 5000,
        useLocalIp: true,
        host: '0.0.0.0',
        hot: true, // 热重载
        overlay: true,
        historyApiFallback: true,
        progress: true,
    },
}

// =>

{
    devServer: {
        port: 5000,
        // useLocalIp: true, // ×
        host: '0.0.0.0',
        hot: true, // 热重载
        historyApiFallback: true,
        client: {
            overlay: true,
            progress: true,
        },
    },
}
```

### webpack-merge

```js
const merge = require('webpack-merge');
// =>
const { merge } = require('webpack-merge');
```