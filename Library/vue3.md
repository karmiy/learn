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

<script lang="ts">
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

<script lang="ts">
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

<script lang="ts">
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

<script lang="ts">
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

<script lang="ts">
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

<script lang="ts">
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

<script lang="ts">
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

<script lang="ts">
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

<script lang="ts">
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

## computed

- 只读计算属性

```html
<template>
    <div id='app'>
        {{code}}
        <input type='text' v-model='id' />
    </div>
</template>

<script lang="ts">
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

<script lang="ts">
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

<script lang="ts">
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

<script lang="ts">
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

<script lang="ts">
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

<script lang="ts">
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