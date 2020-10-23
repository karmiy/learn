import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/home',
        name: 'Home',
        component: () => import('../views/home.vue'),
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/about.vue'),
    },
    {
        path: '/:catchAll(.*)', // 匹配所有，前面都没匹配到的通用情况
        component: () => import('../views/error.vue'),
    }
];

const router = createRouter({
    history: createWebHistory('/'),
    routes
});

export default router;
