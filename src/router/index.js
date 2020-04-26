import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/indexs',
    name: 'Indexs',
    component: () => import(/* webpackChunkName: "about" */ '../views/Indexs.vue')
  },
  {
    path: '/books',
    name: 'Books',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Books.vue')
  },
  {
    path: '/book/:book_name',
    name: 'Book',
    component: () => import('../views/Sarabun.vue'),
    props:true
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/home2',
    name: 'Home2',
    component: () => import('@/views/Home2.vue')
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
