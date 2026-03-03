import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Dashboard from '@/views/Dashboard.vue'
import Auth from '@/views/Auth.vue'
import { fetchAuthSession } from 'aws-amplify/auth'

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/auth", name: "Auth", component: Auth }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  if (to.path === "/dashboard") {
    try {
      const session = await fetchAuthSession()
      if (!session.tokens?.accessToken) {
        return next("/")
      }
      return next()
    } catch {
      return next("/")
    }
  }
  next()
})
export default router;
