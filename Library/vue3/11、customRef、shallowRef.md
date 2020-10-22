## customRef

自定义 ref，接受一个工厂函数，接收 track（追踪依赖）与 trigger（触发响应），返回带有 get, set 的对象：

```ts
customRef((track, trigger) => {
    return {
        get() {},
        set() {},
    }
});
```

customRef 的好处在于：

- 可以显示的控制依赖跟踪与触发响应

- 更灵活的控制 ref 值的获取与更新

### 基本用法

```html
<template>
    <div id='app'>
        {{value}}
        <input type='text' v-model='value' />
    </div>
</template>

<script lang='ts'>
import { defineComponent, customRef } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        let value = 'k';

        const valueRef = customRef((track, trigger) => {
            return {
                get() {
                    // 初始化手动追踪依赖讲究什么时候去触发依赖收集
                    track();
                    return value;
                },
                set(newValue: string) {
                    value = newValue;
                    // 在有依赖追踪的前提下触发响应式
                    trigger();
                },
            }
        });

        return {
            value: valueRef,
        }
    }
});
</script>
```

这个实现相当于普通的 ref('k')

### track 与 trigger 的作用

需要注意的是 track 与 trigger：

- track：收集依赖，即让 valueRef 去收集用到它的相关依赖，如上例中，valueRef 将了解到 template 处的 {{value}} 有使用到它，并把这个依赖收集起来

- trigger：触发响应式，如上例中，valueRef 收集到了 template {{value}} 的依赖，trigger 则触发响应，即触发这部分视图更新

这样也意味着如果没有执行 track 与 trigger，视图是不会更新的：

```html
<template>
    <div id='app'>
        <!-- 修改 input 的内容，{{value}} 不会同步更新，因为没有 track 与 trigger 收集依赖触发响应 -->
        {{value}}
        <input type='text' v-model='value' />
    </div>
</template>

<script lang='ts'>
import { defineComponent, customRef } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        let value = 'k';

        const valueRef = customRef((track, trigger) => {
            return {
                get() {
                    return value;
                },
                set(newValue: string) {
                    value = newValue;
                },
            }
        });

        return {
            value: valueRef,
        }
    }
});
</script>
```

### 实现防抖的 ref

由于 customRef 可以手动控制值得获取与更新，甚至可以控制依赖的收集与视图响应，这使得 customRef 相对于 ref 的自由度更高，例如可以实现 set 赋值防抖的 ref：

```html
<template>
    <div id='app'>
        {{value}}
        <input type='text' v-model='value' />
    </div>
</template>

<script lang='ts'>
import { defineComponent, customRef } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        let timeout: ReturnType<typeof setTimeout>;

        let value = 'k';

        const valueRef = customRef((track, trigger) => {
            return {
                get() {
                    track();
                    return value;
                },
                set(newValue: string) {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                        value = newValue;
                        trigger();
                    }, 1000);
                },
            }
        });

        return {
            value: valueRef,
        }
    }
});
</script>
```

还可以封装为自定义 hook：

```html
<template>
    <div id='app'>
        {{value}}
        <input type='text' v-model='value' />
    </div>
</template>

<script lang='ts'>
import { defineComponent, customRef } from 'vue';

function useDebouncedRef<T>(value: T, delay = 1000) {
    let timeout: ReturnType<typeof setTimeout>;
    
    return customRef((track, trigger) => {
        return {
            get() {
                track();
                return value;
            },
            set(newValue: T) {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    value = newValue;
                    trigger();
                }, delay);
            },
        }
    });
}

export default defineComponent({
    name: 'App',
    setup() {
        return {
            value: useDebouncedRef('k'),
        }
    }
});
</script>
```

## shallowRef

在 ref 小节中可以知道，当 ref 接收的是对象时，将会对该对象使用 reactive 进行包装

而 shallowRef 只会对 .value 进行追踪，如果 .value 是个对象，并不会对其做 reactive 包装，这意味着如果参数是个对象，修改对象的数据，并不会响应视图：

```html
<template>
    <div id='app'>
        <!-- 1s 后视图不会更新 -->
        {{info}}
    </div>
</template>

<script lang='ts'>
import { defineComponent, isReactive, shallowRef } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const info = shallowRef({
            id: 1,
        });

        setTimeout(() => {
            info.value.id = 2; // 不会驱动视图更新
        }, 1000);

        console.log(isReactive(info.value)); // false，没有使用 reactive 包装

        return {
            info,
        }
    }
});
</script>
```

## triggerRef

手动触发 ref 响应更新，可以配合 shallowRef，主动触发相关依赖的更新

```html
<template>
    <div id='app'>
        <!-- 1s 后视图更新 -->
        {{info}}
    </div>
</template>

<script lang='ts'>
import { defineComponent, triggerRef, shallowRef } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const info = shallowRef({
            id: 1,
        });

        setTimeout(() => {
            info.value.id = 2;
            triggerRef(info); // 手动触发视图更新
        }, 1000);

        return {
            info,
        }
    }
});
</script>
```