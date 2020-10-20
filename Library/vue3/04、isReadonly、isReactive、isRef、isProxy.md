## isReadonly

检查一个对象是否是由 readonly 创建的只读代理

```html
<template>
    <div id='app'>
        <input type='text' v-model='id' />
    </div>
</template>

<script lang='ts'>
import { defineComponent, readonly, isReadonly } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const user = readonly(ref(1));

        console.log(isReadonly(user)); // true

        return {
            id,
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
如果 reactive 对象被 readonly 包裹，也会返回 true：

```ts
const user = reactive({
    id: 1,
});
const _user = readonly(user);

console.log(isReactive(_user)); // true
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

## isProxy

检查一个对象是否是由 reactive 或者 readonly 方法创建的代理

```html
<script lang='ts'>
import { defineComponent, reactive, ref, readonly, isProxy } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const user = reactive({
            id: 1,
            code: 100,
            title: 't',
        });

        const id = ref(10);
        const info = readonly({
            id: 1,
        });

        console.log(isProxy(user), isProxy(id), isProxy(info)); // true false true
    }
});
</script>
```