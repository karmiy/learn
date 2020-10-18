## Vue3

vue3 的升级，除了 Proxy 的变动侦测、更好的性能提升，最主要的变动是新的 **Composition API**

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

## template 根元素

在 vue2.x 中，每个组件都只能有唯一的根元素

这往往在某些场景会让开发者不得不在最外层添加一个无用的 div

vue3 中解决了这个问题，如同 react Fragment 一般，现在 template 中可以有多个根元素了：

```html
<template>
    <div>1</div>
    <div>2</div>
</template>
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
<script lang='ts'>
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

defineComponent 让对象中的属性类型**在 typescript 中都有了良好的提示**

## setup

现在组件的**入口**将在一个 setup 函数中

### 执行契机

这个入口函数的执行契机在于 vue2.x **beforeCreate 与 created 之间**，这也意味着**只执行一次**

### 返回值取代了 data

setup 返回的是对象，相当于 vue2.x 的 data，可以显示在 template 上

```html
<template>
    <div id='app'>
        {{name}}
    </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Home',
    setup() {
        return {
            name: 'k',
        }
    }
});
</script>
```
### 参数接收 props

setup 的第一个参数接收 props

```html
<template>
    <div class='header'>
        <h1>{{title}}</h1>
    </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Header',
    props: {
        title: String, // 不可缺少
    },
    setup(props) {
        console.log(props.title);
    },
});
</script>
```

### 参数接收 context

setup 的第二个参数接收 context

context 包含了一些 **vue2.x 中 this 才能访问到的属性**

```html
<template>
    <div class='header'>
        <h1>{{title}}</h1>
    </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Header',
    props: {
        title: String,
    },
    setup(props, context) {
        console.log(context.attrs);
        console.log(context.slots);
        console.log(context.emit);
    },
});
</script>
```
### 关于 this

vue3 的 setup 同 react 函数组件，内部不再有 this，**这意味着我们不能在 setup 里调用 this.xxx，this 在 setup 中是 undefined**（其他地方如之前的 methods 等里还是有 this 的）

## ref

ref 函数用于**给单个给定的值创建一个响应式对象**，返回的响应式对象只包含 value 属性，value 值即给定的值

可以通过 ref.value 获取或更新值

```html
<template>
    <div id='app'>
        <!-- 不需要 lock.value -->
        {{lock}}
    </div>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'Home',
    setup() {
        const lockRef = ref('open');

        console.log(lockRef.value);

        return {
            lock: lockRef,
        }
    }
});
</script>
```

> 注：ref 变量作为 setup 返回用于 template 时，不需要 .value，template 会自动根据是否是 ref 值来显示

## reactive

reactive 函数会**将对象经过 proxy 加工变成一个响应式对象**，返回的响应式对象就类似 vue2.x 的 data，**加工后返回的还是一个深克隆对象**

```html
<template>
    <div id='app'>
        {{user}}
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive } from 'vue';

export default defineComponent({
    name: 'Home',
    setup() {
        const user = reactive({
            id: 1,
            name: 'k',
        });

        console.log(user.id);
        console.log(user.name);

        return {
            user,
        }
    }
});
</script>
```

## reactive 与 ref 差别

- ref 一般在于单独为某个数据提供响应式能力（一般用在非对象数据，如 string, boolean 等）

- reactive 为整个属性赋予响应式能力

此外 ref 在 setup 中的操作是需要 .value 的，而 reactive 不需要

但是 reactive 存在一个问题：

- 不能将对象的属性进行解构操作，解构后**基本数据类型的属性值**不再有响应式能力

```html
<template>
    <div id='app'>
        {{id}}
        <!-- v-model 双向绑定  -->
        <input type='text' v-model='id' />
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive } from 'vue';

export default defineComponent({
    name: 'Home',
    setup() {
        const user = reactive({
            id: 1,
        });

        const { id } = user; // 解构

        return {
            id, // 将解构后的 id 返回，作用在 template
        }
    }
});
</script>
```

在上面这个例子中，被解构出来的 id 因为是基础数据类型，这时把它作为 setup 的返回值作用于模板，也与单纯的 const id = 1 无异了，自然失去了响应式能力，无法配合 input 的 v-model

当然，如果解构的属性值是**引用类型**，还是可以保留响应式能力的

```html
<template>
    <div id='app'>
        {{info}}
        <!-- 双向绑定有效 -->
        <input type='text' v-model='info.name' />
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive } from 'vue';

export default defineComponent({
    name: 'Home',
    setup() {
        const user = reactive({
            info: {
                name: 'k',
            },
        });

        const { info } = user; // info 是引用类型

        return {
            info,
        }
    }
});
</script>
```

## toRefs

为了解决上述 reactive 解构后基础数据类型无法有响应式功能，官方推出了 **toRefs**

toRefs **接收一个对象，并将对象的每一个属性值经过 ref 包装一层**

即：

```ts
const user = reactive({
    id: 1,
    info: {
        name: 'k',
    },
});

const _user = toRefs(user);
```

形式等价于：

```ts
const _user = {
    id: ref(1),
    info: ref({
        name: 'k'
    }),
};
```

即可解决 reactive 解构的基础数据类型无法有响应式能力的问题

```html
<template>
    <div id='app'>
        {{id}}
        <input type='text' v-model='id' />
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs } from 'vue';

export default defineComponent({
    name: 'Home',
    setup() {
        const user = reactive({
            id: 1,
            info: {
                name: 'k',
            },
        });

        const { id } = toRefs(user);

        return {
            id,
        }
    }
});
</script>
```

当然，也可以直接用对象的扩展运算符来直接返回 toRefs 的所有项：

```html
<template>
    <div id='app'>
        {{id}}
        <input type='text' v-model='id' />
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs } from 'vue';

export default defineComponent({
    name: 'Home',
    setup() {
        const user = reactive({
            id: 1,
            info: {
                name: 'k',
            },
        });

        return {
            ...toRefs(user),
        }
    }
});
</script>
```

## isRef

判断是否是 ref 的引用对象：

```html
<script lang='ts'>
import { defineComponent, ref, isRef } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const lockRef = ref('open');
        console.log(isRef(lockRef)); // true
    }
});
</script>
```

## template ref

vue2.x 中为了获取 template 中的某个 DOM 或子组件实例，通常需要给节点挂上 ref 属性，并使用 this.$refs.xxx 获取

在 vue3 中则是通过创建 ref 变量并在 setup 抛出的形式来实现的：

```html
<template>
    <div ref='appRef' id='app'>
    </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const appRef = ref<HTMLDivElement>();

        onMounted(() => {
            console.log(appRef.value);
        });

        return {
            appRef,
        }
    }
});
</script>
```

## computed

- 只读计算属性

```html
<template>
    <div id='app'>
        {{code}}
        <input type='text' v-model='id' />
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, computed } from 'vue';

export default defineComponent({
    name: 'Home',
    setup() {
        const user = reactive({
            id: 1,
            code: computed(() => {
                // 没有变量过渡层 + as number，typescript 不能识别？
                const code = (user.id * 100) as number;
                return code;
            })
        });

        return {
            ...toRefs(user),
        }
    }
});
</script>
```

- 可读写计算属性

```html
<template>
    <div id='app'>
        {{code}}
        <input type='text' v-model='id' />
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, computed } from 'vue';;

export default defineComponent({
    name: 'Home',
    setup() {
        const user = reactive({
            id: 1,
            code: computed<number>({
                get() {
                    const code = (user.id * 100) as number;
                    return code;
                },
                set(val) {
                    user.id = val / 100;   
                }
            })
        });
        
        setTimeout(() => {
            user.code = 200; // set 操作
        }, 2000);

        return {
            ...toRefs(user),
        }
    }
});
</script>
```

## watchEffect

类似 vue2.x 的 watch

- 可以自动识别回调内部的**响应式变量**，在响应式变量变化时触发回调

- 组件初始时也会立即执行

```html
<template>
    <div id='app'>
        {{code}}
        <input type='text' v-model='id' />
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, watchEffect } from 'vue';

export default defineComponent({
    name: 'Home',
    setup() {
        const user = reactive({
            id: 1,
            code: 100
        });

        watchEffect(() => {
            // user 的 id 变化后自动触发回调
            user.code = user.id * 100;
        });

        return {
            ...toRefs(user),
        }
    }
});
</script>
```

需要注意的是，需要是**响应式变量**，这意味着如下写法在变化后是不会触发回调的：

```html
<template>
    <div id='app'>
        {{code}}
        <input type='text' v-model='id' />
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, watchEffect } from 'vue';

export default defineComponent({
    name: 'Home',
    setup() {
        const user = reactive({
            id: 1,
            code: 100
        });

        const { id } = user;

        watchEffect(() => {
            // 无效，id 变化后不会触发回调
            user.code = id * 100;
        });

        return {
            ...toRefs(user),
        }
    }
});
</script>
```
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
    name: 'Home',
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
    name: 'Home',
    setup() {
        onMounted(() => {
            console.log('mounted');
        });
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
    name: 'Home',
    components: {
        Header: defineAsyncComponent(() => import('./components/header.vue')),
    },
});
</script>
```

> 注：Suspense 当前还是实验性特性，它的 API 之后可能会改变

## 全局 API

vue2.x 中的全局 API 在 vue3 也发生了改变

vue2.x：

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

vue3：

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

更多调整可以查看 [https://github.com/vuejs/rfcs/blob/master/active-rfcs/0009-global-api-change.md](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0009-global-api-change.md)

## v-model 与 .sync

vue3 中的 v-model 在自定义组件使用时与 vue2.x 略有不同，被 v-model 绑定的属性，在组件中不再是 model: { prop: xxx, event: xxx }，而是直接使用 **modelValue** 作为 prop 配合 **update:modelValue** 来实现：

```html
<!-- 父组件 -->
<template>
    <div id='app'>
        {{name}}
        <UserInfo v-model='name' />
    </div>
</template>
```

```html
<!-- 子组件 -->
<template>
    <div class='user-info'>
        <input type='text' :value='modelValue' @input='onNameChange' />
    </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'UserInfo',
    props: {
        modelValue: String, // modelValue 接收 v-model 绑定的值
    },
    setup(props, { emit }) {
        const onNameChange = (e: { target: HTMLInputElement }) => {
            emit('update:modelValue', e.target.value);
        };

        return {
            onNameChange,
        }
    },
});
</script>
```

此外在 vue2.x 中，只能有 1 个 v-model，如果希望多个双向绑定，则需要使用 .sync 来实现

vue3 中 v-model 不再局限唯一的限制，可以用 v-model:xxx 的形式多次绑定，不需要使用 .sync：

```html
<!-- 父组件 -->
<template>
    <div id='app'>
        {{name}}
        {{age}}
        <UserInfo v-model:name='name' v-model:age='age' />
    </div>
</template>
```

```html
<!-- 子组件 -->
<template>
    <div class='user-info'>
        <input type='text' :value='name' @input='onNameChange' />
        <br>
        <input type='text' :value='age' @input='onAgeChange' />
    </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'UserInfo',
    props: {
        name: String,
        age: Number,
    },
    setup(props, { emit }) {
        // emit('update:xxx') 向上抛出
        const onNameChange = (e: { target: HTMLInputElement }) => {
            emit('update:name', e.target.value);
        };

        const onAgeChange = (e: { target: HTMLInputElement }) => {
            emit('update:age', +e.target.value);
        };

        return {
            onNameChange,
            onAgeChange,
        }
    },
});
</script>
```
## directive 指令

vue3 的指令主要对钩子函数重新进行了命名并做了微小的调整

vue2.x 中指令：

```ts
const directive = {
    bind(el, binding, vnode, prevVnode) {},
    inserted() {},
    update() {},
    componentUpdated() {},
    unbind() {}
}
```

vue3 中的指令：

```ts
const MyDirective = {
    beforeMount(el, binding, vnode, prevVnode) {},
    mounted() {},
    beforeUpdate() {},
    updated() {},
    beforeUnmount() {}, // 新增
    unmounted() {}
}
```

示例：

```ts
const app = createApp(App);

app.directive('style', {
    beforeMount(el, binding) {
        const { arg, value } = binding;
        arg && (el.style[arg] = value);
    }
});
```

```html
<template>
    <div id='app'>
        <span v-style:color='"yellowgreen"'>my color is yellowgreen</span>
    </div>
</template>
```

## scoped 样式

vue2.x 中，如果在使用了 scoped 样式的组件里，使用第三方组件，并希望修改它的样式，直接修复是不可行的：

```html
<style lang='scss' scoped>
#app .el-input {
    color: pink;
}
</style>
```

vue2.x 提供了如 >>>， /deep/ 之类的样式来解决这个问题：

```html
<style lang='scss' scoped>
#app >>> .el-input {
    color: pink;
}

#app /deep/ .el-input {
    color: pink;
}

#app ::v-deep .el-input {
    color: pink;
}
</style>
```

在 vue3 中提供了 ::v-deep(xxx) 的方式来处理这种问题：

```html
<style lang='scss' scoped>
#app ::v-deep(.el-input) {
    color: pink;
}
</style>
```

此外，还有一个直接将 scoped 内的样式作为全局的方式 ::v-global(xxx)：

```html
<style lang='scss' scoped>
#app ::v-global(.el-input) {
    color: pink;
}

编译后：
.el-input {
    color: pink;
}
</style>
```

## vue-router

> 此处有些是 vue-router3.x 后续新增的，放一起过一下

vue-router4.x 的路由与之前没有很大的变化，主要功能了一些新的 API 或功能

- 创建路由

```ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [{
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home.vue'),
}];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
```

- 动态添加路由 router.addRoute(route: RouteRecord)

```ts
router.addRoute({
    path: '/about',
    name: 'About',
    component: () => import('@/views/about.vue'),
});

router.addRoute({
    path: '/:catchAll(.*)', // 匹配所有，前面都没匹配到的通用情况
    component: () => import('@/views/error.vue'),
});
```

- 动态删除路由 router.removeRoute(name: string | symbol)

```ts
router.removeRoute('About');
```

- 判断路由是否存在 router.hasRoute(name: string | symbol): boolean

```ts
console.log(router.hasRoute('About'));
```

- 获取路由列表 router.getRoutes(): RouteRecord[]

```ts
console.log(router.getRoutes());
```

- 获取当前路由 router.currentRoute

```html
<template>
    <div id='app'>
        <ul>
            <li>
                <!-- custom 作用在于：没有 custom 时 router-link 会自动解析成一个 a 标签，而配置 custom 后相当于一个抽象组件，不会自动加这层 a 标签 -->
                <router-link to='/home' custom v-slot='{ href, navigate, isActive }'>
                    <a :class='{ isActive }' :href='href' @click='navigate'>to home</a>
                </router-link>
            </li>
            <li><router-link to='/about'>to about</router-link></li>
        </ul>
        <router-view />
    </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import router from './router';

export default defineComponent({
    name: 'App',
    setup() {
        // 获取当前路由信息
        console.log(router.currentRoute);
    }
});
</script>
```

## emits-option

vue3 的 emit 与 vue2.x 的 emit 不同的是，新增了一个 emits 选项

```ts
{
    props: ...
    emits: ...
}
```

新增这个 emits 的好处在于：

- 让开发者更清晰的了解组件应该派发什么事件

- 提供类型推断

- 作为一个验证器，调用时验证，需要返回 boolean 类型，当返回 false 时控制台会打印警告


需要注意的是，**一旦有 emits 配置，必须把所有 emits 项都在配置中列出来，不可有遗漏，否则 typescript 会报错**

emits 的用法同 props，可以是个数组：

```html
<template>
    <div class='user-info'>
        <input type='text' :value='name' @input='onNameChange' />
        <br>
        <input type='text' :value='age' @input='onAgeChange' />
        <br>
        <input type='text' :value='code' @input='onCodeChange' />
    </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'UserInfo',
    props: {
        name: String,
        age: Number,
        code: Number,
    },
    emits: ['codeChange', 'update:name', 'update:age'], // 数组
    setup(props, { emit }) {
        const onNameChange = (e: { target: HTMLInputElement }) => {
            emit('update:name', e.target.value);
        };

        const onAgeChange = (e: { target: HTMLInputElement }) => {
            emit('update:age', +e.target.value);
        };

        const onCodeChange = (e: { target: HTMLInputElement }) => {
            emit('codeChange', +e.target.value);
        };

        return {
            onNameChange,
            onAgeChange,
            onCodeChange,
        }
    },
});
</script>
```

也可以是函数，需要返回 boolean，表示校验是否通过：

```html
<template>
    <div class='user-info'>
        <input type='text' :value='name' @input='onNameChange' />
        <br>
        <input type='text' :value='age' @input='onAgeChange' />
        <br>
        <input type='text' :value='code' @input='onCodeChange' />
    </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'UserInfo',
    props: {
        name: String,
        age: Number,
        code: Number,
    },
    // 需要返回 boolean，返回 false 控制台会报警告
    emits: {
        codeChange: (value: number) => true,
        'update:name': (value: string) => true,
        'update:age': (value: number) => true,
    },
    setup(props, { emit }) {
        const onNameChange = (e: { target: HTMLInputElement }) => {
            emit('update:name', e.target.value);
        };

        const onAgeChange = (e: { target: HTMLInputElement }) => {
            emit('update:age', +e.target.value);
        };

        const onCodeChange = (e: { target: HTMLInputElement }) => {
            emit('codeChange', +e.target.value);
        };

        return {
            onNameChange,
            onAgeChange,
            onCodeChange,
        }
    },
});
</script>
```

> 注：emits 配置中返回 false 并不会终止事件派发，只是控制台报警告