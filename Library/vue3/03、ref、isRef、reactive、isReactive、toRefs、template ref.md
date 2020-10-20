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
    name: 'App',
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

此外，如果 ref 包裹的是**响应式变量**：

- 返回的值与原数据将数据相互绑定（即修改一个，另一个跟着变）

- 如果 ref 包裹的也是 ref，返回的值不需要 .value.value，直接 .value 即可

```html
<script lang='ts'>
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const count = ref(100);
        const _count = ref(count); // ref 包裹 ref
        console.log(count.value, _count.value);
        // 返回的值 .value 即可
        // 输出 100，100

        _count.value = 110;
        console.log(count.value, _count.value);
        // 数据相互绑定，一个修改，另一个一起变
        // 输出 110, 110
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

## reactive

reactive 函数会**将对象经过 proxy 加工变成一个响应式对象**，返回的响应式对象就类似 vue2.x 的 observable，**加工后返回的还是一个深克隆对象**

```html
<template>
    <div id='app'>
        {{user}}
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive } from 'vue';

export default defineComponent({
    name: 'App',
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

## isReactive

判断是否是 reactive 的引用对象：

```html
<script lang='ts'>
import { defineComponent, reactive, isReactive } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const user = reactive({
            id: 1,
        });
        console.log(isReactive(user)); // true
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
    name: 'App',
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
    name: 'App',
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

toRefs **把一个响应式对象转换成普通对象，该普通对象的每个 property 都是一个 ref ，和响应式对象 property 一一对应**

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

可以理解为（不完全是这样）：

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
    name: 'App',
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
    name: 'App',
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

此外，**toRefs 包裹 reactive 变量，属性值与原数据将数据相互绑定**：

```html
<script lang='ts'>
import { defineComponent, reactive, ref, toRefs, getCurrentInstance } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const user = reactive({
            id: 1,
        });

        const _user = toRefs(user);

        user.id = 2;
        console.log(user.id, _user.id.value); // 2 2

        _user.id.value = 3;
        console.log(user.id, _user.id.value); // 3 3
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