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
    name: 'App',
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
    name: 'App',
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

## watch

等价于 vue2.x 的 watch

- 接收需要监听的响应式变量，回调中可获取新值与旧值

- 组件初始不立即执行（可配 immediate）

- 返回一个解绑函数，执行后取消监听

```html
<template>
    <div id='app'>
        <input type='text' v-model='id' />
        <button @click='stop'>stop watch</button>
    </div>
</template>

<script lang='ts'>
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const id = ref(1);

        const stop = watch(id, (nextId, prevId) => {
            console.log(nextId, prevId);
        });

        return {
            id,
            stop,
        }
    }
});
</script>
```

### 函数的第一个参数

函数的第一个参数可以是：

- ref 变量，即上例，值得注意的是**如果是 ref，在回调监听到值的时候，不需要再 .value 了，会自动解析转换，即已经是 ref 的值**

- reactive 变量

- 拥有返回值的 getter 函数，注意这里必须是**确切的返回值**，如返回 ref 并不能自动解析转换

```ts
// id.value，不能是 id，否则 nextId 与 prevId 都会是 ref
const stop = watch(() => id.value, (nextId, prevId) => {
    console.log(nextId.value); // 需要 .value
});
```

### 回调第三个参数 onInvalidate

watch 的回调有第三个参数 onInvalidate，作用在于**清除副作用**

实际开发中，可能经常会在 watch 中进行某个副作用操作，如请求数据，这时如果快速更新数据，会导致请求不断被触发，显然不是我们想要的

通用的做法是：**下一次 watch 触发前取消上一次未完成的请求，这便是清除副作用**

```html
<script lang='ts'>
import { defineComponent, reactive, ref, toRefs, watch } from 'vue';

const request = (id: number) => {
    const timer = setTimeout(() => {
        console.log('请求数据, id: ' + id);
    }, 1000);

    return () => clearTimeout(timer);
}

export default defineComponent({
    name: 'App',
    setup() {
        const id = ref(1);

        const stop = watch(id, (nextId, prevId, onInvalidate) => {
            const cancel = request(nextId);

            // onInvalidate 会在下一次 watch 触发前调用，相当于 react userEffect 的返回值
            onInvalidate(() => {
                cancel();
            });
        });

        return {
            id,
            stop,
        }
    }
});
</script>
```

### 函数的第三个参数 options

watch 的第三个参数 options，等价于 vue2.x watch 的配置项：

- immediate: 是否立即执行

- deep: 是否深度监听

此外还有其他 3 个配置项，具体看 watchEffect

### 监听多个项

watch 与 vue2.x 不同的时，可以监听多个变量：

```html
<template>
    <div id='app'>
        {{id}}
        {{code}}
        <input type='text' v-model='id' />
        <input type='text' v-model='code' />
        <button @click='stop'>stop watch</button>
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, watch } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const user = reactive({
            id: 1,
            code: 100,
            title: 't',
        });

        // 数组，监听多个变量
        const stop = watch([() => user.id, () => user.code], ([id, code], [prevId, prevCode]) => {
            console.log(id, code);
            console.log(prevId, prevCode);
        });

        return {
            ...toRefs(user),
            stop,
        }
    }
});
</script>
```

## watchEffect

与 watch 略有不同

- 可以自动识别回调内部的**响应式变量**，在响应式变量变化时触发回调

- 组件初始时也会立即执行

- 返回一个解绑函数，执行后取消监听

```html
<template>
    <div id='app'>
        {{code}}
        <input type='text' v-model='id' />
        <button @click='stop'>stop watch</button>
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, watchEffect } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const user = reactive({
            id: 1,
            code: 100
        });

        const stop = watchEffect(() => {
            // user 的 id 变化后自动触发回调
            user.code = user.id * 100;
        });

        return {
            ...toRefs(user),
            stop,
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
    name: 'App',
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

### options

与 watch 不同的 options 在于，watchEffect 只有如下 3 个配置项（watch 都有）

- onTrack: 当一个 reactive 对象属性或一个 ref 作为依赖被追踪时，将调用 onTrack

- onTrigger: 依赖项变更导致副作用被触发时，将调用 onTrigger

- flush: 回调执行时机，有 'pre' | 'post' | 'sync' 可选项，默认 post

其中 onTrack 与 onTrigger 同新的生命周期钩子，接收一个 DebuggerEvent 对象用于调试

而 flush 表示 watchEffect 副作用回调在什么时候执行

默认清空下，**会将副作用回调放入队列中，并异步的执行它，即会在组件更新后执行，相当于 nextTick**

如果希望副作用是**同步**或在**组件更新之前**重新运行，可以传递 flush 为 **sync 或 pre**

### 初始在 mounted 后执行

watchEffect 在组件初始时是会立即执行的，如果希望第一次执行在 mounted 之后，可以放在 onMounted 内：

```ts
onMounted(() => {
    watchEffect(() => {
        // 在这里可以访问到 DOM 或者 template refs
    })
})
```

## provide 与 inject

vue3 中的 provide 与 inject 与 vue2.x 略有不同，单独提供了 provide 与 inject 函数：

```html
<!-- 父组件 -->
<template>
    <div id='app'>
        <Header />
    </div>
</template>

<script lang='ts'>
import { defineComponent, provide } from 'vue';
import Header from '@/components/header.vue';

export default defineComponent({
    name: 'App',
    components: {
        Header,
    },
    setup() {
        provide('theme', 'yellowgreen');
    }
});
</script>
```

```html
<!-- 子组件 -->
<template>
    <div class='header'>
    </div>
</template>

<script lang='ts'>
import { defineComponent, inject } from 'vue';

export default defineComponent({
    name: 'Header',
    setup() {
        // 第二个参数是默认值
        const theme = inject('theme', 'transparent');
        console.log(theme);
    },
});
</script>
```

> 注：如果希望提供的值与注入的数据是响应式的，可以传递 ref，而不是单纯的字符串