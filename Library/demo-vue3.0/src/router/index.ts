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

router.addRoute({
    path: '/about',
    name: 'About',
    component: () => import('@/views/about.vue'),
});

router.addRoute({
    path: '/:catchAll(.*)', // 匹配所有，前面都没匹配到的通用情况
    component: () => import('@/views/error.vue'),
});

// router.removeRoute('About');

export default router;
