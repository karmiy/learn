## methods

vue3.x 中的 methods 很简单，只需要在 setup 中写一个函数并 return 即可

```html
<template>
    <div id='app'>
        {{id}}
        <input type='text' v-model='id' />
        <button @click='reset'>reset</button>
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const user = reactive({
            id: 1,
            code: 100,
        });

        const reset = () => user.id = 1;

        return {
            ...toRefs(user),
            reset,
        }
    }
});
</script>
```

## 生命周期钩子

vue3 的生命周期与 vue2.x 差别不大，主要在于部分由 setup 函数本身取代，其他有专用的回调钩子函数可以使用：

- beforeCreate => setup

- created => setup

- beforeMount => onBeforeMount

- mounted => onMounted

- beforeUpdate => onBeforeUpdate

- updated => onUpdated

- beforeDestroy => onBeforeUnmount

- destroyed => onUnmounted

- errorCaptured => onErrorCaptured

- activated => onActivated

- deactivated => onDeactivated

```html
<template>
    <div id='app'>
    </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        onMounted(() => {
            console.log('mounted');
        });
    }
});
</script>
```

此外，还新增了 2 个钩子：

- onRenderTracked: 组件**视图**重新渲染时触发，包括父组件更新 props、组件自身数据变化更新等都会触发，组件初始也会触发

- onRenderTriggered: 组件**自身视图**重新渲染时触发，父组件更新不会触发该钩子

这 2 个钩子都接收一个 DebuggerEvent 参数，**主要作用在于让开发者调试是什么引起了视图更新**

```html
<template>
    <div id='app'>
        <input type='text' v-model='id' />
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, onRenderTracked, onRenderTriggered } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const user = reactive({
            id: 1,
        });

        onRenderTracked((e) => {
            console.log('onRenderTracked', e); // 初始触发 + id 更新触发
        });

        onRenderTriggered((e) => {
            console.log('onRenderTriggered', e); // id 更新触发
        });

        return {
            ...toRefs(user),
        }
    }
});
</script>
```

**需要收集到依赖与响应更新才会触发这 2 个 hook**，这意味着下面这种方式是不会触发的，因为 user 没有相关的依赖需要收集，也没有需要响应更新的内容：

```html
<template>
    <div id='app'>
        <!-- 没有把 id 作用在视图上 -->
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, onRenderTracked, onRenderTriggered } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const user = reactive({
            id: 1,
        });

        onRenderTracked((e) => {
            console.log('onRenderTracked', e); // 不会触发
        });

        onRenderTriggered((e) => {
            console.log('onRenderTriggered', e); // 不会触发
        });

        setTimeout(() => {
            user.id = 2;
        }, 1000);

        return {
            ...toRefs(user),
        }
    }
});
</script>
```


## teleport 组件

teleport 是新增的一个重要组件，它解决了 vue2.x 开发弹窗类组件的问题

通常在 vue2.x 中开发弹框组件，往往需要用到 new Vue.extend 配合 $mount 将组件挂载到指定 DOM 上

如果是希望单纯的将某块 template 移到其他位置，可能就不得不手动操作 DOM 节点，而这些操作在 react 中是有 createPortal 可以实现的

vue 的使命即是尽量不让开发者直接操作 DOM，可见 teleport 的存在是非常必要的

teleport 会有如下行为：

- 将插槽的 template 移动到指定 selector（同 document.querySelector） 的节点下

```html
<template>
    <div id='app'>
        <teleport to='body'>
            <p>this will be moved to body.</p>
        </teleport>
    </div>
</template>
```

值得注意的是：**teleport 只能将插槽内容移动到已经存在的 DOM 中，在安装时如果找不到该 DOM，则会打印警告（开发环境会警告，生产环境不会）**

这意味着如下做法是不可行的，因为此时 #header 这个 DOM 还未渲染出来：

```html
<template>
    <div id='app'>
        <div id='header'></div>
        <div id='content'>
            <teleport to='#header'>
                <p>this can't be moved to #header.</p>
            </teleport>
        </div>
    </div>
</template>
```

此外，如果同时有多个 teleport 同时指向一个节点，则会有序的进行移动：

```html
<template>
    <div id='app'>
        <teleport to='body'>
            <p>body1.</p>
        </teleport>
        <teleport to='body'>
            <p>body2.</p>
        </teleport>
    </div>
</template>

<!-- 渲染结果如下 -->
<body>
    <div id='app'></div>
    <p>body1.</p>
    <p>body2.</p>
</body>
```

## Suspense 与 defineAsyncComponent 异步组件

类似与 react16 的 Suspense，它会在内部的异步组件加载并渲染完成之前先显示 fallback 插槽的内容

顺便需要注意的是，vue3 中异步组件单纯的 () => import('xxx') 的不可行的，vue3 提供了新的 **defineAsyncComponent** API

```html
<template>
    <div id='app'>
        <Suspense>
            <template #default>
                <Header title='Title' />
            </template>
            <!-- 在 Header 组件加载完成前会渲染下方模板 -->
            <template #fallback>
                Loading...
            </template>
        </Suspense>
    </div>
</template>

<script lang='ts'>
import { defineComponent, defineAsyncComponent } from 'vue';

export default defineComponent({
    name: 'App',
    components: {
        Header: defineAsyncComponent(() => import('./components/header.vue')),
    },
});
</script>
```

更多的配置：

```ts
const AsyncComp = defineAsyncComponent({
    // 工厂函数
    loader: () => import('./components/header.vue'),
    // 加载异步组件时使用的组件
    loadingComponent: LoadingComponent,
    // 加载失败的时候使用的组件
    errorComponent: ErrorComponent,
    // 在显示加载组件之前延迟。默认 200 ms。
    delay: 200,
    // 如果超时，将显示错误组件
    // 存在 timeout 并且超过这个时间
    timeout: 3000,
    // 返回布尔值的函数，指示当加载器 promise rejects 时异步组件是否应该重试
    retryWhen: error => error.code !== 404,
    // 允许的最大重试次数
    maxRetries: 3,
    // 定义组件是否可挂载
    suspensible: false
});
```

> 注：Suspense 当前还是实验性特性，它的 API 之后可能会改变