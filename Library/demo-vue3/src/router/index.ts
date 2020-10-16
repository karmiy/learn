import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [{
    path: '/home',
    component: () => import('@/views/home.vue'),
}];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.addRoute({
    path: '/about',
    component: () => import('@/views/about.vue'),
});

router.addRoute({
    path: '/:catchAll(.*)',
    component: () => import('@/views/error.vue'),
});

export default router;
