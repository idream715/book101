import type { RouteRecordRaw } from 'vue-router'

// V2 Routes with Naive UI + TypeScript
export const routesV2: RouteRecordRaw[] = [
  // Home route (v2)
  {
    path: '/v2',
    name: 'HomeV2',
    component: () => import('../views-v2/Home.vue')
  },
  {
    path: '/v2/home',
    redirect: '/v2'
  },
  
  // Books routes (v2)
  {
    path: '/v2/books',
    name: 'BooksV2',
    component: () => import('../views-v2/Books.vue')
  },
  {
    path: '/v2/book/:id',
    name: 'BookV2',
    component: () => import('../views-v2/Sarabun.vue'),
    props: true
  },
  
  // Cards routes (v2)
  {
    path: '/v2/cards',
    name: 'CardsV2',
    component: () => import('../views-v2/Cards.vue')
  },
  {
    path: '/v2/cards-search',
    name: 'CardsHomeV2',
    redirect: '/v2'
  },
  
  // Search routes (v2)
  {
    path: '/v2/search',
    name: 'SearchV2',
    component: () => import('../views-v2/Search.vue')
  },
  {
    path: '/v2/search-page',
    name: 'SearchPageV2',
    component: () => import('../views-v2/SearchPage.vue')
  },
  {
    path: '/v2/indexs',
    name: 'IndexsV2',
    component: () => import('../views-v2/Indexs.vue')
  },
  
  // Shorts routes (v2)
  {
    path: '/v2/shorts',
    name: 'ShortsV2',
    component: () => import('../views-v2/ShortsList.vue')
  },
  
  // About route (v2)
  {
    path: '/v2/about',
    name: 'AboutV2',
    component: () => import('../views-v2/About.vue')
  }
]

// Legacy route mappings for migration compatibility
export const legacyRouteMapping = {
  '/': '/v2',
  '/books': '/v2/books',
  '/book/': '/v2/book/',
  '/cards': '/v2/cards',
  '/search': '/v2/search',
  '/search-page': '/v2/search-page',
  '/indexs': '/v2/indexs',
  '/shorts': '/v2/shorts',
  '/about': '/v2/about'
}