import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

// Main routes using V2 Naive UI components
const routes = [
  // Home routes
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
  
  // Books routes
  {
    path: '/books',
    name: 'Books',
    component: () => import('../views/Books.vue')
  },
  {
    path: '/book/:id',
    name: 'Book',
    component: () => import('../views/Sarabun.vue'),
    props: true
  },
  
  // Cards routes
  {
    path: '/cards',
    name: 'Cards',
    component: () => import('../views/Cards.vue')
  },
  {
    path: '/card/:id',
    name: 'CardDetail',
    component: () => import('../views/CardDetail.vue'),
    props: true
  },
  
  // Search routes
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/Search.vue')
  },
  {
    path: '/search-page',
    name: 'SearchPage',
    component: () => import('../views/SearchPage.vue')
  },
  {
    path: '/indexs',
    name: 'Indexs',
    component: () => import('../views/Search.vue')  // Use Search.vue instead of removed Indexs.vue
  },
  
  // Shorts routes
  {
    path: '/shorts',
    name: 'Shorts',
    component: () => import('../views/ShortsList.vue')
  },
  
  // About route
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top when navigating
    // This ensures users see the nav bar on every page
    if (savedPosition) {
      // When using browser back/forward buttons, restore saved position
      // But we want to scroll to top instead
      return { top: 0, behavior: 'instant' }
    } else {
      // For new navigation, always scroll to top
      return { top: 0, behavior: 'instant' }
    }
  }
})

export default router
