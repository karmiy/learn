## vue-router

> 此处有些是 vue-router3.x 后续新增的，放一起过一下

vue-router4.x 的路由与之前没有很大的变化，主要功能了一些新的 API 或功能

### 动态路由

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

### router 与 route

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

### 组件级路由钩子

在 vue2.x 中的组件级路由钩子有：

- beforeRouteEnter

- beforeRouteUpdate

- beforeRouteLeave

vue3 中提供了 update 与 leave 的钩子：

- onBeforeRouteUpdate

- onBeforeRouteLeave

```html
<script lang='ts'>
import { defineComponent } from 'vue';
import { onBeforeRouteUpdate, onBeforeRouteLeave } from 'vue-router';

export default defineComponent({
    name: 'Home',
    setup() {
        onBeforeRouteUpdate(() => {
            // ...
        });

        onBeforeRouteLeave(() => {
            // ...
        });
    }
});
</script>
```

## vuex

vue3 中使用 vuex 与 vue2.x 的区别主要在于 store 的创建与获取

- 创建 store

```ts
import { createStore } from 'vuex';

export default createStore({
    state: {
        isLogin: true,
    },
    mutations: {
        updateLogin(state, login: boolean) {
            state.isLogin = login;
        }
    },
    actions: {},
    modules: {}
});
```

- 安装 store

```ts
app.use(store);
```

- 使用 store

```html
<template>
    <div id='app'>
        {{isLogin ? 'login' : 'unlogin'}}
        <button @click='toggleLogin'>toggle login</button>
    </div>
</template>

<script lang='ts'>
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
    name: 'App',
    setup() {
        const store = useStore<{ isLogin: boolean }>();

        const isLogin = computed(() => store.state.isLogin);

        return {
            isLogin,
            toggleLogin: () => store.commit('updateLogin', !isLogin.value),
        }
    }
});
</script>
```