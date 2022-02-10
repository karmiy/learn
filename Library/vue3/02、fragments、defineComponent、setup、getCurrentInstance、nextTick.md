## template Fragments

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

这个入口函数的执行契机在于 vue2.x **beforeCreate 之前**，这也意味着**只执行一次**

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
    name: 'App',
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
import { defineComponent, computed } from 'vue';

export default defineComponent({
    name: 'Header',
    props: {
        title: String, // 不可缺少
    },
    setup(props) {
        console.log(props.title);

        // 值得注意的是，如果解构了，会使 props 里的属性失去响应式效果
        const { title } = props;

        // const subTitle = computed(() => `sub_${title}`); // ⭕，这个操作没有意义，computed 不能触发
        const subTitle = computed(() => `sub_${props.title}`); // ✅，应该这样
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

## getCurrentInstance

现在 setup 中没有了 this，如果希望获取组件实例，可以使用 getCurrentInstance：

```html
<script lang='ts'>
import { defineComponent, ref, getCurrentInstance } from 'vue';

export default defineComponent({
    name: 'Header',
    setup() {
        const instance = getCurrentInstance();
        console.log(instance); // 不过这个实例里的属性和 this 不同，如 this.$parent 是 instance.parent
        const { ctx } = instance; // this 似乎是这个 ctx，但是似乎 typescript 没有加入这个类型？
    },
});
</script>
```

## nextTick

- vue2.x

```ts
this.$nextTick(() => {
    // ...
});
```

- vue3

```html
<script>
import { defineComponent, nextTick } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        nextTick(() => {
            console.log(1);
        });
    }
});
</script>
```