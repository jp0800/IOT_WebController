import { createRouter, createWebHistory } from 'vue-router'

import HomeAutomation from './HomeAutomation/HomeAutomation.vue'
import DashboardPage from './HomeAutomation/pages/DashboardPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: HomeAutomation,
      beforeEnter: (to, from, next) => {
        const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true'
        if (isAuthenticated) {
          next('/Home')
        } else {
          next()
        }
      }
    },
    {
      path: '/Home',
      name: 'Home',
      component: DashboardPage,
      beforeEnter: (to, from, next) => {
        const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true'
        if (isAuthenticated) {
          next()
        } else {
          next('/')
        }
      }
    }
  ]
})

export default router
