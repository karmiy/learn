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

## ref

ref 函数用于**给单个给定的值创建一个响应式对象**，返回的响应式对象只包含 value 属性，value 值即给定的值

可以通过 ref.value 获取或更新值

```html
<script lang='ts'>
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const lockRef = ref('open');

        console.log(lockRef.value); // get

        setTimeout(() => {
            lockRef.value = 'close'; // set
        }, 2000);

        return {
            lock: lockRef,
        }
    }
});
</script>
```

### ref 的原理

[Vue3响应式系统源码解析 - Ref篇](https://zhuanlan.zhihu.com/p/85978064)

[Vue 3.x 响应式原理 —— ref源码分析](https://zhuanlan.zhihu.com/p/95010735)

- 如果 ref 接收是个对象，会用 reactive 包装

- 如果基础数据类型，ref 内部会创建一个对象，用 .value 保存数据源，接着对该对象的 value 创建 setter 与 getter 来达到数据拦截的效果，即可实现响应式

```ts
const convert = (val: any): any => (isObject(val) ? reactive(val) : val)

export function ref<T>(raw: T): Ref<T> {
    // 转化数据
    raw = convert(raw)
    const v = {
        [refSymbol]: true,
        get value() {
            // 监听函数收集依赖
            track(v, OperationTypes.GET, '')
            return raw
        },
        set value(newVal) {
            raw = convert(newVal)
            // 触发监听函数执行
            trigger(v, OperationTypes.SET, '')
        }
    }
    return v as Ref<T>
}
```

### ref 作用于 template

ref 变量作为 setup 返回用于 template 时，**不需要 .value，template 会自动根据是否是 ref 值来显示**

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
### ref 作用于响应式变量

如果 ref 包裹的是**响应式变量**：

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

### ref 作为 reactive 的属性值

当 ref 作为 reactive 的属性值时，**同样不需要 .value**

```html
<script lang='ts'>
import { defineComponent, reactive, ref } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const user = reactive({
            id: ref(10),
        });

        console.log(user.id); // 不需要 .value
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

## toRef

toRef 是为了解决上述 reactive 解构后基础数据类型无法有响应式功能

它可以取出 reactive 的属性值并创建一个 ref：

```html
<template>
    <div id='app'>
        {{id}}
        {{idRef}}
        <input type='text' v-model='id' />
        <input type='text' v-model='idRef' />
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, ref, toRef } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const user = reactive({
            id: 1,
        });

        const idRef = toRef(user, 'id'); // 为 id 创建 ref

        idRef.value++;
        console.log(idRef.value, user.id); // 2 2

        user.id++;
        console.log(idRef.value, user.id); // 3 3

        return {
            ...toRefs(user),
            idRef,
        }
    }
});
</script>
```

需要注意的是，**toRef(obj, key) 与 ref(obj.key) 并不等价**：

```html
<script lang='ts'>
import { defineComponent, reactive, ref, toRef } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const user = reactive({
            id: 1,
        });

        const idRef = ref(user.id);

        idRef.value++;
        console.log(idRef.value, user.id); // 2 1

        user.id++;
        console.log(idRef.value, user.id); // 2 2
    }
});
</script>
```

这是因为：

- ref(user.id) 等价于 ref(1)，idRef 与 user.id 并**不会有关联**

- toRef 是为 reactive 的某些属性创建响应式，直接作用于 reactive 上，相当于拦截监听 reactive 上的属性，核心源码如下：

```ts
// 可以看到
// 当调用 idRef.value 更新时，会触发 setter，更新 object[key]，即 user.id
// 当更新 user.id 时，idRef.value 由于是通过 getter 获取 object[key] 的，即 user.id，所以也可以拿到更新后的值
function toProxyRef<T extends object, K extends keyof T>(
    object: T,
    key: K
): Ref<T[K]> {
    return {
        _isRef: true,
        get value(): any {
            return object[key]
        },
        set value(newVal) {
            object[key] = newVal
        }
    } as any
}
```

## toRefs

相比 toRef，更常用的是 toRefs， **把一个响应式对象转换成普通对象，该普通对象的每个 property 都是一个 ref ，和响应式对象 property 一一对应**

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

相当于：

```ts
const _user = {
    id: toRef(user, 'id'),
    info: toRef(user, 'info'),
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

## readonly

vue3 提供了 readonly 函数，接收 **object 对象、reactive 对象、ref 对象**，返回一个只读对象（Proxy 对象）

在对只读对象修改时，**控制台会报警告，但不会影响代码运行**

```html
<template>
    <div id='app'>
        <input type='text' v-model='id' />
    </div>
</template>

<script lang='ts'>
import { defineComponent, ref, readonly } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const id = readonly(ref(1));

        return {
            id,
        }
    }
});
</script>
```

## unref

unref 等价于：

```ts
isRef(val) ? val.value : val
```

这在接收 T | Ref\<T> 转为 T 的场合很有用：

```ts
function useCount(count: number | Ref<number>) {
    const value = unref(count); // 直接获取 number 值，很方便
}
```