## setup 语法糖

Vue3.2 新增了 setup 语法糖，不需要在 defineComponent 里定义 setup

可直接标识 `<script setup>`

但是 setup 直接定义在 script 上，之前 setup 函数接收的参数就无法拿到，遇到 Vue 提供了一些列方法来解决这个问题

### defineProps

使用 defineProps 接收 props

有两种定义的方式：

```ts
// ---------- NO.1 ----------
// ts 版
const props = defineProps<{ id: number }>();
// js 版
const props = defineProps({ id: Number });

// ---------- NO.2 ----------
// 也会自动推导出 typescript 类型
defineProps({
    description: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        default: 60,
    },
});
```

第一种方式比较简洁，但存在一些弊端，如不能设置默认值：

```ts
// 这个默认值 10 是无效的（原因其实是因为 props 属性会自动抛出到 setup，和这里有没有解构是没有关系的，见下面解读）
const { id = 10 } = defineProps<{ id?: number }>();
```

第二种方式比较繁琐，但可以解决第一种方式的默认值问题，但值得注意的是，`type` 要指定如 ts 的强类型，需要借助 `PropType`：

```ts
import { PropType } from 'vue';

defineProps({
    label: {
        type: String,
        required: true,
    },
    align: {
        type: String as PropType<'top' | 'center' | 'bottom'>,
        default: 'center',
    },
    list: {
        type: Array as PropType<Array<{ label: string }>>,
        default: () => [],
    },
});
```

值得注意的，**props 的属性会自动抛出 setup，可以直接在模板里使用**，不需要手动解构抛出

```html
<script setup lang="ts">
    // 不需要 const { label } = defineProps(); 解构出来  
    defineProps({
        label: {
            type: String,
            required: true,
        },
        align: {
            type: String as PropType<'top' | 'center' | 'bottom'>,
            default: 'center',
        },
        list: {
            type: Array as PropType<Array<{ label: string }>>,
            default: () => [],
        },
    });
</script>

<template>
    <div>{{ label }}</div>
</template>
```

### defineEmits

使用 defineEmits 定义 emits

```ts
const emits = defineEmits(['update:modelValue']);

emits('update:modelValue', 10);
```

### defineExpose

使用 defineExpose 定义组件 ref 抛出的方法

```ts
// sidebar.vue
defineExpose({
    count: 1,
});
```

```html
<script>
    const sidebarRef = ref<{ count: number } | null>(null);

    onMounted(() => {
        console.log(sidebarRef.value?.count);
    });
</script>
<template>
    <sidebar ref="sidebarRef" />
</template>
```

## v-memo

Vue3.2 新增了指令 `v-memo`

可以理解为 React 的 `React.memo`，在依赖没有变化时跳过更新

```html
<div v-memo="[valueA, valueB]">
  	...
</div>
```

如上，在 `valueA`、`valueB` 没有变化时，**div 及其子节点**都不会更新（其实连虚拟 DOM 的 VNode 创建也会跳过），原来子树的记忆副本会被重用

```html
<template>
    <!-- 1s 后 div 这个节点文本是不会更新的，因为 deps 数组里没有变化 -->
    <div v-memo="deps">{{ msg }}</div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';

const msg = ref('a');
const deps = [1, 2];

setTimeout(() => {
    msg.value = 'b';
}, 1000);
</script>
```

> v-memo 接收空数组时，相当于 [v-once](https://v3.cn.vuejs.org/api/directives.html#v-once)

`v-memo` 并不常用，仅供性能敏感场景的针对性优化（如 `v-for` 渲染 > 1000 条长列表）

```html
<!-- 在这个示例假设是一个 Select 组件，有 1000 条数据 -->
<!-- 当 selectedValue 选择项变化时，假设选中从 100 => 200 -->
<!-- 其实只有第 100 和第 200 的节点发生了变化，其他 998 个节点都没有变化，但避免不了差异的比较，这个过程也是需要消耗性能的 -->
<!-- 当配置了如下 v-memo 后，代表着：仅在 item 从未选中变为选中时更新它，反之亦然 -->
<!-- 而每个未受影响的 item 重用之前的 VNode，并完全跳过差异比较 -->
<div v-for="item in list" :key="item.id" v-memo="[item.id === selected]">
      <p>ID: {{ item.id }} - selected: {{ item.id === selected }}</p>
      <p>...more child nodes</p>
</div>
```

## style v-bind

Vue3.2 实现了 `style v-bind`，即可以在 style 中动态关联响应式状态

```html
<template>
    <div class="main">Main</div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';

const state = reactive({
    color: 'red',
});

const backgroundColor = ref('pink');
</script>
<style>
.main {
    color: v-bind('state.color');
    background-color: v-bind('backgroundColor');
}
</style>
```

