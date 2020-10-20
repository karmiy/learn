## toRaw

将被 reactive、readonly 转成响应式的对象，还原为原对象，即去除 proxy 代理

```html
<script lang='ts'>
import { defineComponent, reactive, toRaw } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const rawUser = {
            id: 1,
            code: 100,
            title: 't',
        };
        
        const user = reactive(rawUser);

        console.log(toRaw(user) === rawUser); // true，toRaw 还原为原对象
    }
});
</script>
```

## markRaw

显式标记一个对象为**永远不会转为响应式代理**

```html
<script lang='ts'>
import { defineComponent, isReactive, markRaw, reactive } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const rawUser = markRaw({
            id: 1,
            code: 100,
            title: 't',
        });

        console.log(isReactive(reactive(rawUser))); // false，无法转为响应式
    }
});
</script>
```

> 注：这是一个很有用的方法，通常可以用于定义不可变数据，如不会变的省市县数组，因为这些数据往往是不变的，没有必要使用如 reactive, readonly 设为响应式，提升性能

需要注意的是，markRaw 的作用是**浅层**的，这就跟对象浅拷贝一样，不会作用于属性值：

```html
<script lang='ts'>
import { defineComponent, isReactive, markRaw, reactive } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const rawUser = markRaw({
            id: 1,
            code: 100,
            title: 't',
        });

        console.log(isReactive(reactive({
            id: rawUser.id,
        }))); // true，markRaw 的作用是浅层的，不会让属性值也不可响应转化
    }
});
</script>
```

## shallowReactive

reactive 的响应式转换是深层的：

```html
<template>
    <div id='app'>
        {{user}}
    </div>
</template>

<script lang='ts'>
import { defineComponent, isReactive, reactive } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const user = reactive({
            id: 1,
            nested: {
                name: 'k',
            }
        });

        setTimeout(() => {
            user.id++; // 1s 后，视图会更新
        }, 1000);

        setTimeout(() => {
            user.nested.name = 'kk'; // 2s 后，视图会更新，因为 reactive 是响应式是深层的，可以作用到对象内的对象
        }, 2000);

        console.log(isReactive(user.nested)); // true

        return {
            user,
        }
    }
});
</script>
```

shallowReactive 与 reactive 不同的是：

- shallowReactive 是**浅层**响应式转化

就如对象浅拷贝一般，响应式转换只作用于最外层

```html
<template>
    <div id='app'>
        {{info}}
    </div>
</template>

<script lang='ts'>
import { defineComponent, isReactive, shallowReactive, reactive } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const info = shallowReactive({
            id: 1,
            nested: {
                name: 'k',
            }
        });

        setTimeout(() => {
            info.id++; // 1s 后，视图会更新
        }, 1000);

        setTimeout(() => {
            info.nested.name = 'kk'; // 2s 后视图不会更新，因为是浅层的，响应式化没有作用到内部 nested 对象
        }, 2000);

        console.log(isReactive(info.nested)); // false，不是响应式的

        return {
            info,
        }
    }
});
</script>
```

## shallowReadonly

同 shallowReactive，浅层作用

```html
<script lang='ts'>
import { defineComponent, shallowReadonly, isReadonly } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const info = shallowReadonly({
            id: 1,
            nested: {
                name: 'k',
            }
        });

        console.log(isReadonly(info)); // true
        console.log(isReadonly(info.nested)); // false，只作用一层
    }
});
</script>
```