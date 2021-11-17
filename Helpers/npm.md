# Npm 帮助文档

## 命令

- 打开库文档：npm docs xxx

```js
npm doc react
```

- 打开库源码仓库：npm repo xxx

```js
npm repo react
```

## .npmrc

```sh
SASS_BINARY_SITE=http://npm.taobao.org/mirrors/node-sass
registry=https://registry.npm.taobao.org/
@kealm:registry=https://registry.npm.taobao.org/
```

## 收藏包

- npm-run-all

```json
{
    "scripts": {
        "mock": "npm-run-all -p -r start:a start:b",
        "start:a": "xxx",
        "start:b": "xxx"
    },
}
```