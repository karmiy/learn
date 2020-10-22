## createApp

vue3 与 vue2.x 从入口文件就颇有差异

### 构造 app 实例

- vue2.x 中通常是全局引入 Vue，再创建 Vue 实例：

```ts
import Vue from 'vue';
import App from './App.vue';

new Vue({
    render: h => h(App)
}).$mount('#app');
```

- vue3 则是按需引入 createApp 创建 app 实例：

```ts
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

app.mount(App, '#app');
```

## rootProps

createApp 也可以传递 props 给根组件：

```ts
const app = createApp(App, {
    uid: 108,
});
```

```html
<!-- app.vue -->
<template>
    <div id='app'>
        {{uid}}
    </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'App',
    props: {
        uid: Number,
    },
});
</script>
```

### 全局 API 的差异

vue2.x 中的全局 API 在 vue3 也发生了改变

- vue2.x：

```ts
import Vue from 'vue';
import App from './App.vue';

Vue.config.ignoredElements = [/^app-/];
Vue.use(/* ... */);
Vue.mixin(/* ... */);
Vue.component(/* ... */);
Vue.directive(/* ... */);

Vue.prototype.customProperty = 100;

new Vue({
    render: h => h(App)
}).$mount('#app');
```

- vue3：

```ts
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

app.config.isCustomElement = tag => tag.startsWith('app-');
app.use(/* ... */);
app.mixin(/* ... */);
app.component(/* ... */);
app.directive(/* ... */);

app.config.globalProperties.customProperty = 100;

app.mount(App, '#app');
```

app 上的方法：

- config

- use 

- mixin

- component

- directive

- mount

- unmount

- provide

值得注意的是，app 调用这些方法后，**返回的是还是 app 本身**，这就意味着可以有如下操作：

```ts
app.use().component().directive();
```

更多调整可以查看 [https://github.com/vuejs/rfcs/blob/master/active-rfcs/0009-global-api-change.md](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0009-global-api-change.md)

## component

vue3 中注册全局组件与 vue2.x 大同小异，只是从 Vue.component 变为 app.component

```html
<!-- Button 组件 -->
<template>
    <button class='km-button'>
        <slot></slot>
    </button>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'KmButton',
});
</script>
```

```ts
/* main.ts */
import Button from './components/button.vue';
...

const app = createApp(App);

// 全局注册
app.component(Button.name, Button);
...
```

## config

vue3 的 config 与 vue2.x 主要的差别在于 Vue.config 变化为 app.config，新增或调整了某些属性

### devtools

开发环境默认 true，生产环境默认 false

- vue2.x：

```ts
Vue.config.devtools = true;
```

- vue3：

```ts
app.config.devtools = true;
```

### errorHandler

指定组件的渲染和观察期间未捕获错误的处理函数。这个处理函数被调用时，可获取错误信息和 Vue 实例

- vue2.x：

```ts
Vue.config.errorHandler = (err, vm, info) => {
    console.log(err, vm, info);
}
```

- vue3：

```ts
app.config.errorHandler = (err, vm, info) => {
    console.log(err, vm, info);
}
```

### warnHandler

为 Vue 的运行时警告赋予一个自定义处理函数

只会在开发者环境下生效，在生产环境下它会被忽略

- vue2.x：

```ts
Vue.config.warnHandler = (msg, vm, trace) => {
    console.log(msg, vm, trace);
}
```

- vue3：

```ts
app.config.warnHandler = (msg, vm, trace) => {
    console.log(msg, vm, trace);
}
```

### globalProperties

新增得 config 配置项，用于**替代 vue2.x 全局属性 Vue.prototype.xxx**

- vue2.x：

```ts
Vue.prototype.baseUrl = '/client';

// 组件内
console.log(this.baseUrl);
```

- vue3：

```ts
app.config.globalProperties.baseUrl = '/client';

// 组件内

// 获取方式一
const instance = getCurrentInstance();
console.log(instance.ctx.baseUrl); // 不过目前 typescript 似乎缺失了 ctx 的类型？

// 获取方式二
const instance = getCurrentInstance();
console.log(instance?.appContext.config.globalProperties.baseUrl);
```

### isCustomElement

替代掉 vue2.x 的 ignoredElements

指定自定义元素，让 vue 不去编译它

例如我们在 template 写 <icon-up />，vue 会当组件去解析，去找有没有注册这个组件，没有控制台会报警告

该配置告诉 vue 这是自定义元素，不需要编译，会当作普通 DOM，就不会报警告了

- vue2.x：

```ts
Vue.config.ignoredElements = [
  // 忽略所有 icon- 开头的元素
  /^ion-/
];
```

- vue3：

```ts
app.config.isCustomElement = tag => tag.startsWith('icon-');
```

如果在 vue-cli 中配置了无法生效，可能需要在 vue.config.js 里配置，参考 [issues](https://github.com/vuejs/vue-next/issues/1414)

### optionMergeStrategies

主要定义 mixins 或 Vue.extend 的合并策略，具体实例略

- vue2.x：

```ts
Vue.config.optionMergeStrategies.xxx = ...
```

- vue3：

```ts
app.config.optionMergeStrategies.xxx = ...
```

### performance

设置为 true 以在浏览器开发工具的性能/时间线面板中启用对组件初始化、编译、渲染和打补丁的性能追踪。只适用于开发模式和支持 performance.mark API 的浏览器上

- vue2.x：

```ts
Vue.config.performance = true;
```

- vue3：

```ts
app.config.performance = true;
```

## provide

全局的 provide，可在任何组件内 inject 获取

```ts
app.provide('theme', 'dark');
```

```html
<script lang='ts'>
import { defineComponent, inject } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        console.log(inject('theme')); // 'dark'
    }
});
</script>
```

## unmount

卸载 app 根实例

```ts
const app = createApp(App);

app.mount('#app');

setTimeout(() => {
    app.unmount('#app'); // 3s 后卸载
}, 3000);
```

## use

同 vue2.x，会调用对象的 install 方法，不同在于：

- vue2.x install 接收的参数的 Vue 构造函数

- vue3 install 接收的参数是 app

```ts
import { createApp, App as AppType } from 'vue';
import App from './app.vue';

const app = createApp(App);

const log = {
    install(app: AppType) {
        console.log(app, 'log');
    }
}

app.use(log);
```