import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './stores/index.ts'

const routes = [
  {
    name: 'home',
    path: '/',
    component: () => import('./pages/Home.vue'),
    meta: { requiresAuth: true },
  },
  {
    name: 'about',
    path: '/about',
    component: () => import('./pages/About.vue'),
    meta: { requiresAuth: true },
  },
  {
    name: 'auth',
    path: '/auth',
    component: () => import('./pages/Auth.vue'),
    meta: { requiresGuest: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeResolve((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.user) {
    auth.logout()
    return { name: 'auth', query: { r: to.name ? `${to.name as string}`: undefined} }
  } if (to.meta.requiresGuest && auth.user) return { name: 'home' }

  if (
    to.meta.requiresAuth &&
    to.meta.requiresAbility &&
    !auth.user?.role.abilities.includes(to.meta.requiresAbility as string)
  ) {
    if (!import.meta.env.PROD)
      console.warn(`You don't have the ability '${to.meta.requiresAbility}' to navigate to '${to.fullPath}' route.`)
    return { name: 'home' }
  }
})

export default router
