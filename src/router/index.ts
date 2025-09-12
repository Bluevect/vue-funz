import AboutView from '@/views/AboutView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AboutView,
    },
    {
      path: '/snake',
      name: 'snake',
      // Lazy import
      component: () => import('@/views/SnakeView.vue'),
    },
    {
      path: '/snake/settings',
      name: 'snake-settings',
      // Lazy import
      component: () => import('@/views/settings/SnakeSettingsView.vue'),
    },
    {
      path: '/tetris',
      name: 'tetris',
      // Lazy import
      component: () => import('@/views/TetrisView.vue'),
    },
    {
      path: '/home',
      redirect: '/',
    },
  ],
})

export default router
