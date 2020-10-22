## vue-router

> 此处有些是 vue-router3.x 后续新增的，放一起过一下

vue-router4.x 的路由与之前没有很大的变化，主要功能了一些新的 API 或功能

- 创建路由

```ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [{
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home.vue'),
}];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
```

- 动态添加路由 router.addRoute(route: RouteRecord)

```ts
router.addRoute({
    path: '/about',
    name: 'About',
    component: () => import('@/views/about.vue'),
});

router.addRoute({
    path: '/:catchAll(.*)', // 匹配所有，前面都没匹配到的通用情况
    component: () => import('@/views/error.vue'),
});
```

- 动态删除路由 router.removeRoute(name: string | symbol)

```ts
router.removeRoute('About');
```

- 判断路由是否存在 router.hasRoute(name: string | symbol): boolean

```ts
console.log(router.hasRoute('About'));
```

- 获取路由列表 router.getRoutes(): RouteRecord[]

```ts
console.log(router.getRoutes());
```

- 获取当前路由 router.currentRoute

```html
<template>
    <div id='app'>
        <ul>
            <li>
                <!-- custom 作用在于：没有 custom 时 router-link 会自动解析成一个 a 标签，而配置 custom 后相当于一个抽象组件，不会自动加这层 a 标签 -->
                <router-link to='/home' custom v-slot='{ href, navigate, isActive }'>
                    <a :class='{ isActive }' :href='href' @click='navigate'>to home</a>
                </router-link>
            </li>
            <li><router-link to='/about'>to about</router-link></li>
        </ul>
        <router-view />
    </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import router from './router';

export default defineComponent({
    name: 'App',
    setup() {
        // 获取当前路由信息
        console.log(router.currentRoute);
    }
});
</script>
```

- 获取 router 与 route

vue2.x 的 this.$router，在 vue3 中可以用 **useRouter**

上述的 route，除了使用 router.currentRoute，还可以使用 **useRoute**

```html
<script lang='ts'>
import { defineComponent } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
    name: 'App',
    setup() {
        const router = useRouter();

        const route = useRoute();

        router.push('/home');
        console.log(route);
    }
});
</script>
```

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