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
<<<<<<< HEAD
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  
=======
    path: '/book/:book_name',
    name: 'Sarabun',
    component: () => import('@/views/Sarabun.vue'),
    props: true
  },
>>>>>>> 7d29412df782c55ba55d6b0ef2b2db0b4da0ad43
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
