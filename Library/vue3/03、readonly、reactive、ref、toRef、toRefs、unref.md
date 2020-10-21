## reactive

reactive 函数会将对象经过 proxy 加工变成一个响应式对象，类似 vue2.x 的 observable，需要注意：

- 返回的是 **Proxy** 对象

- 对属性的监听是**深度**监听的（即 const user = { id: 1, nested: { name: 'k' } } 修改 user.nested.name，也是可以响应式更新视图的）

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

### reactive 与原对象相互引用

reactive 与原对象之间是会忽然影响的：

```html
<script lang='ts'>
import { defineComponent, reactive } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
         const rawUser = {
            id: 1,
        };
        const user = reactive(rawUser);

        rawUser.id = 2;
        console.log(rawUser.id, user.id); // 2 2

        user.id = 3;
        console.log(rawUser.id, user.id); // 3 3
    }
});
</script>
```

原因在于 reactive 创建的是 Proxy 对象，[Proxy 对象与原对象是会相互影响的](./99、spec-proxy.md)

更多关于 reactive 的响应式可以参考：

- [Vue 3.x 响应式原理——reactive源码分析](https://zhuanlan.zhihu.com/p/89940326)

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

参考：

- [Vue3 源码浅析之 Ref](https://juejin.im/post/6844904003579412493)

- [Vue3 响应式系统源码解析 - Ref篇](https://zhuanlan.zhihu.com/p/85978064)

- [Vue3.x 响应式原理 —— ref源码分析](https://zhuanlan.zhihu.com/p/95010735)

核心部分：

- 如果 ref 接收是个**对象**，会用 **reactive** 包装

- 如果基础数据类型，ref 内部会创建一个对象，用 .value 保存数据源，接着对该对象的 value 创建 setter 与 getter 来达到数据拦截的效果，即可实现响应式

```ts
const convert = (val: any): any => (isObject(val) ? reactive(val) : val)

export function isRef(r: any): r is Ref {
  return r ? r._isRef === true : false
}

export function ref<T>(raw: T): Ref<T> {
    // 如果是 ref 直接返回
    if (isRef(raw)) {
        return raw
    }
    // 转化数据
    raw = convert(raw)
    const v = {
        [refSymbol]: true,
        get value() {
            // 监听函数收集依赖
            track(v, OperationTypes.GET, 'value')
            return raw
        },
        set value(newVal) {
            raw = convert(newVal)
            // 触发监听函数执行
            trigger(v, OperationTypes.SET, 'value', __DEV__ ? { newValue: newVal } : void 0)
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
### ref 接收 ref

如果 ref 包裹的也是 ref，返回的值不需要 .value.value，直接 .value 即可（原因即 ref 原理：ref 接收的是 ref 则直接返回）

```html
<script lang='ts'>
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const count = ref(100);
        const _count = ref(count); // ref 包裹 ref
        console.log(count.value, _count.value);
        // 输出 100，100

        _count.value = 110;
        console.log(count.value, _count.value);
        // 输出 110, 110

        console.log(count === _count); // true，是同一个 ref
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

而不需要 .value 的原因，在 reactive 的源码中可以看到，getter 函数中，如果获取的属性值是 ref，会自动返回它的 .value：

```ts
function createGetter(isReadonly: boolean) {
    return function get(target: object, key: string | symbol, receiver: object) {
        // 通过Reflect拿到原始的get行为
        const res = Reflect.get(target, key, receiver)
        // 如果是内置方法，不需要另外进行代理
        if (isSymbol(key) && builtInSymbols.has(key)) {
            return res
        }
        // 如果是ref对象，代理到ref.value
        if (isRef(res)) {
            return res.value
        }
        // track用于收集依赖
        track(target, OperationTypes.GET, key)
        // 判断是嵌套对象，如果是嵌套对象，需要另外处理
        // 如果是基本类型，直接返回代理到的值
        return isObject(res)
        // 这里createGetter是创建响应式对象的，传入的isReadonly是false
        // 如果是嵌套对象的情况，通过递归调用reactive拿到结果
        ? isReadonly
            ? // need to lazy access readonly and reactive here to avoid
            // circular dependency
            readonly(res)
            : reactive(res)
        : res
    }
}
```

注意：只是获取 ref 类型的属性值时不需要 .value，并不代表 reactive 该属性值被赋值为了 ref.value ，reactive 的该属性值依旧是那个 ref，只是获取时 **getter 直接返回 ref.value** 而已

### 为属性值是 ref 的 reactive 赋值

相反，如果 reactive 的属性值是 ref，在为这个属性赋值时，同样可以为原 ref 进行更新：

```html
<script lang='ts'>
import { defineComponent, reactive, ref } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const idRef = ref(10);
        const user = reactive({
            id: idRef,
        });

        user.id = 100; // 赋值
        console.log(idRef.value); // 100，ref 也一起被更新

    }
});
</script>
```

原因还是从 reactive 的源码得知，在 setter 函数中如果原数据是 ref，会自动为其 .value 赋值：

```ts
function set(
    target: object,
    key: string | symbol,
    value: unknown,
    receiver: object
): boolean {
    // 首先拿到原始值oldValue
    value = toRaw(value)
    const oldValue = (target as any)[key]
    // 如果原始值是ref对象，新赋值不是ref对象，直接修改ref包装对象的value属性
    if (isRef(oldValue) && !isRef(value)) {
        oldValue.value = value
        return true
    }
    // 原始对象里是否有新赋值的这个key
    const hadKey = hasOwn(target, key)
    // 通过Reflect拿到原始的set行为
    const result = Reflect.set(target, key, value, receiver)
    // don't trigger if target is something up in the prototype chain of original
    // 操作原型链的数据，不做任何触发监听函数的行为
    if (target === toRaw(receiver)) {
        /* istanbul ignore else */
        if (__DEV__) {
            const extraInfo = { oldValue, newValue: value }
            // 没有这个key，则是添加属性
            // 否则是给原始属性赋值
            // trigger 用于通知deps，通知依赖这一状态的对象更新
            if (!hadKey) {
                trigger(target, OperationTypes.ADD, key, extraInfo)
            } else if (hasChanged(value, oldValue)) {
                trigger(target, OperationTypes.SET, key, extraInfo)
            }
        } else {
            if (!hadKey) {
                trigger(target, OperationTypes.ADD, key)
            } else if (hasChanged(value, oldValue)) {
                trigger(target, OperationTypes.SET, key)
            }
        }
    }
    return result
}
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

vue3 提供了 readonly 函数，接收 **object 对象、reactive 对象、ref 对象**，返回一个**只读的 Proxy 对象**

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