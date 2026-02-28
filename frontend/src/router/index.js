import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import Dashboard from '@/views/Dashboard.vue'
import Auth from '@/views/Auth.vue'

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/auth", name: "Auth", component: Auth }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

/*router.beforeEach((to) => {
  const loggedIn = localStorage.getItem("bb_logged_in") === "true";
  if (to.path === "/dashboard" && !loggedIn) return "/";
});
*/
export default router;
