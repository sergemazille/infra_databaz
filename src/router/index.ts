import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Configs from '@/views/Configs.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Configs',
    component: Configs,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
