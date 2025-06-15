import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import HttpBinForm from '../components/HttpBinForm.vue'
import Demo from '../views/Demo.vue'

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
  },
  {
    path: '/demo',
    name: 'Demo',
    component: Demo
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router