import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import HttpBinForm from '../components/HttpBinForm.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/httpbin',
    name: 'HttpBin',
    component: HttpBinForm
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router