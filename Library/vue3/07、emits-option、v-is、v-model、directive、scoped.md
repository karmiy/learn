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

## v-is

同 vue2.x 的 component 组件：

```html
<component :is='"Header"'></component>
```

即

```html
<div v-is='"Header"'></div>
```

都会解析为 Header 组件：

```html
<Header></Header>
```

## v-model 与 .sync

### modelValue

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

### v-model 代替 .sync

在 vue2.x 中，只能有 1 个 v-model，如果希望多个双向绑定，则需要使用 .sync 来实现

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

### ::v-deep(selector)

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

在 vue3 中提供了 **::v-deep(xxx)** 的方式来处理这种问题：

```html
<style lang='scss' scoped>
#app ::v-deep(.el-input) {
    color: pink;
}
</style>
```

### ::v-global(selector)

如果希望将 scoped 中的样式完全抛出约束，作为全局样式，vue3 提供了 **::v-global(xxx)**：

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

### ::v-slotted(selector)

在 vue2.x 中，如果希望子组件的 scoped 样式中，为其 slot 插槽的元素添加样式是做不到的，因为 slot 的元素是归属父组件的：

```html
<!-- 父组件 -->
<template>
    <div id='app'>
        <Header>
            <span class='title'>{{title}}</span>
        </Header>
    </div>
</template>
```

```html
<!-- 子组件 -->
<template>
    <div class='header'>
        <h1>
            <slot></slot>
        </h1>
    </div>
</template>
<style lang='scss' scoped>
.title {
    color: yellowgreen; // 无效，因为 .title 是属于父组件的 
}
</style>
```

vue3 提供了 ::v-slotted 允许我们在子组件的 scoped style 内为 slot 元素设置样式：

```html
<!-- 子组件 -->
<template>
    <div class='header'>
        <h1>
            <slot></slot>
        </h1>
    </div>
</template>
<style lang='scss' scoped>
::v-slotted(.title) {
    color: yellowgreen; // ok
}
</style>
```