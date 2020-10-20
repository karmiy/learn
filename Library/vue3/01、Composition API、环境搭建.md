## Composition API

vue3 的升级，除了 Proxy 的变动侦测、更好的性能提升，最主要的变动是新的 [Composition API](https://composition-api.vuejs.org/zh/api.html)

Composition API 的作用同 react hook，**实现更灵活且无副作用的复用代码**

它并且解决了 vue2.x 中 mixin 的问题：

- 命名容易冲突（2 个 mixin 中变量相同）

- 数据来源不清晰（经常会在代码中出现一个在 data 和 prop 都找不到的变量，找半天才发现在 mixin 中）

此外还加强的 vue2.x 中一直存在的问题：

- 对 typescript 的支持不友好

vue2.x 中为了支持 typescript，经常都是使用 vue-class-component，然而 vue-class-component 与 vue 的常规做法却有很大的不同，往往会造成开发者的心智负担

并且 vue2.x 中通常都会 import 导入完整的 vue，即使开发者只使用了少量的功能，也会引入全部核心代码，这也导致了打包后可能存在许多无用代码

而 Composition API 就是为了解决这些问题而诞生的

## 项目搭建

直接使用 vue-cli 即可

```js
npm install @vue/cli -g

vue create xxx

// 构建项目过程中主要选择：

手动配置 Manually select features

选择 vue3 配置
```

## 运行常见问题

vue-cli 搭建后运行，经常会在 npm run serve 启动时遇到错误：

```
Error: Cannot find module 'vue-loader-v16/package.json'
```

解决方案：

1. 更新 npm 版本 npm install npm@latest -g

2. 清缓存 npm cache clean --force

3. Git Bash 环境下 npm install