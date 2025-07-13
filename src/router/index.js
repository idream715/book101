import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import { routesV2 } from './routes-v2'

// Legacy V1 routes (Vuetify)
const routesV1 = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/cards-search',
    name: 'Cards-Home',
    component: Home
  },
  {
    path: '/indexs',
    name: 'Indexs',
    component: () => import(/* webpackChunkName: "about" */ '../views/Indexs.vue'),
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import(/* webpackChunkName: "search" */ '../views/Search.vue')
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
    path: '/book/:id',
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
    path: '/search-page',
    name: 'SearchPage',
    component: () => import('@/views/SearchPage.vue')
  },
  {
    path: '/cards',
    name: 'Cards',
    component: () => import('@/views/CardsList.vue')
  },
  {
    path: '/shorts',
    name: 'Shorts',
    component: () => import('@/views/ShortsList.vue')
  },
]

// Combine V2 and V1 routes (V2 routes must come first for proper matching)
const routes = [
  ...routesV2,
  ...routesV1
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
