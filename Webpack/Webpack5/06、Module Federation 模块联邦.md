# Module Federation 模块联邦

## 学习来源

[官方 Module Federation](https://webpack.docschina.org/concepts/module-federation/#root)

[官方 ModuleFederationPlugin](https://webpack.docschina.org/plugins/module-federation-plugin/#Options)

[Module Federation 加载流程](https://juejin.cn/post/6885970818606727182#heading-4)

[精读《Webpack5 新特性 - 模块联邦》](https://zhuanlan.zhihu.com/p/115403616)

## 作用

让 Webpack 达到了**线上 Runtime 的效果**，代码直接在项目间利用 CDN 直接共享，不再需要本地安装 Npm 包、构建再发布

## 对比其他模块共享方案

### npm 

最常见的方式，通常会将公共模块发布为一个 npm 包在各个项目里应用

问题：

- 应用的项目都要进行安装打包，各个项目都会打包出同一个 npm 包的相同代码，仅是本地编译的复用

- npm 包的升级后，应用的项目若想达到最新版本，都需要手动升级

### monorepo

将全部 packages 放置在一个仓库中进行管理，作用于 npm link 的效果，一个 package 的更新可以即时同步到其他 packages

问题：

- 需要将关联的项目、包放置在同一个项目，分支管理较为复杂，相比应用在项目管理，更适合应用在公共包

- 依然走的是本地编译的复用，不是真正的 runtime

### umd

达到了 runtime 共享模块，项目运行时通过 cdn 的方式加载使用，不需要打包到各个项目中

问题：

- umd 需要打包出各种兼容代码，包的体积无法达到本地编译时的效果

- 包依赖其他库时容易冲突

### MFE 微前端

解决多项目并存问题，通常是基座模式的主子应用，国内代表库 qiankun

一般有 2 种打包方式：

- 子应用独立打包，模块解耦，在主应用再加载子应用，但是无法抽取公共依赖等

- 主应用一起打包，解决上述问题，但存在打包慢等问题

## Module Federation 模块联邦作用

模块联邦中，各个应用都是独立的，任何应用都可以作为基座

各个应用通过 exposes 暴露各自的模块，并可以通过 remotes 远程加载其他应用暴露的模块，与基座不同，是**去中心化**的效果

所有应用都可以用 **runtime** 的方式复用其他模块

## 运用

[官方 Demo](https://github.com/module-federation/module-federation-examples/tree/master/advanced-api/dynamic-remotes)

[本地 Demo](https://github.com/karmiy/kealm-demo/tree/master/packages/demo-webpack/module-federation)

