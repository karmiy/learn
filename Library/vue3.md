## Vue3

vue3 的升级，除了更好的性能，最主要的变动是新的 **Composition API**

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

## defineComponent

在 vue2.x 中，组件的结构是这样的：

```js
export default {
    name: 'Header',
    props: {
        title: String,
    },
};
```

而在 vue3 中，将使用 defineComponent 包裹该组件结构对对象：

```ts
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Header',
    props: {
        title: String,
    },
    setup(props) {
        console.log(props)
    },
});
</script>
```

## setup

现在组件的**入口**将在一个 setup 函数中：

```js

```