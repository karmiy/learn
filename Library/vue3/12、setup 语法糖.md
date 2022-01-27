## setup 语法糖

Vue3.2 新增了 setup 语法糖，不需要在 defineComponent 里定义 setup

可直接标识 `<script setup>`

但是 setup 直接定义在 script 上，之前 setup 函数接收的参数就无法拿到，遇到 Vue 提供了一些列方法来解决这个问题

### defineProps

使用 defineProps 接收 props

```ts
// ts 版
const props = defineProps<{ id: number }>();

// js 版
const props = defineProps({ id: Number });
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
// app.vue
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