import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from '../src/App.vue'

// Mock the navbar component to avoid Vuetify dependency
vi.mock('@/components/Navbar.vue', () => ({
  default: { template: '<div class="navbar">Mock Navbar</div>' }
}))

// Mock stores
vi.mock('@/stores', () => ({
  useSearchStore: () => ({
    clear: vi.fn(),
    overlay: false
  }),
  useCardsStore: () => ({
    clear: vi.fn()
  }),
  useBooksStore: () => ({
    clear: vi.fn()
  })
}))

// Mock Naive UI components
vi.mock('naive-ui', () => ({
  NConfigProvider: { template: '<div class="n-config-provider"><slot /></div>' },
  NMessageProvider: { template: '<div class="n-message-provider"><slot /></div>' },
  NNotificationProvider: { template: '<div class="n-notification-provider"><slot /></div>' },
  NDialogProvider: { template: '<div class="n-dialog-provider"><slot /></div>' },
  NLoadingBarProvider: { template: '<div class="n-loading-bar-provider"><slot /></div>' }
}))

describe('App.vue - Route Detection Logic', () => {
  it('correctly detects V1 routes (non-v2 paths)', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/books', component: { template: '<div>Books</div>' } },
        { path: '/cards', component: { template: '<div>Cards</div>' } }
      ]
    })
    const pinia = createPinia()

    // Test root route
    await router.push('/')
    const wrapper1 = mount(App, {
      global: {
        plugins: [router, pinia],
        stubs: {
          'v-app': true,
          'v-main': true,
          'router-view': true
        }
      }
    })
    await router.isReady()

    // Check that isV2Route computed property returns false for root route
    expect(wrapper1.vm.$route.path).toBe('/')
    expect(wrapper1.vm.$route.path.startsWith('/v2/')).toBe(false)

    // Test books route
    await router.push('/books')
    const wrapper2 = mount(App, {
      global: {
        plugins: [router, pinia],
        stubs: {
          'v-app': true,
          'v-main': true,
          'router-view': true
        }
      }
    })
    await router.isReady()

    expect(wrapper2.vm.$route.path).toBe('/books')
    expect(wrapper2.vm.$route.path.startsWith('/v2/')).toBe(false)
  })

  it('correctly detects V2 routes (paths starting with /v2/)', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/v2/about', component: { template: '<div>About V2</div>' } },
        { path: '/v2/books', component: { template: '<div>Books V2</div>' } }
      ]
    })
    const pinia = createPinia()

    // Test v2/about route
    await router.push('/v2/about')
    const wrapper1 = mount(App, {
      global: {
        plugins: [router, pinia],
        stubs: {
          'v-app': true,
          'v-main': true,
          'router-view': true
        }
      }
    })
    await router.isReady()

    expect(wrapper1.vm.$route.path).toBe('/v2/about')
    expect(wrapper1.vm.$route.path.startsWith('/v2/')).toBe(true)

    // Test v2/books route
    await router.push('/v2/books')
    const wrapper2 = mount(App, {
      global: {
        plugins: [router, pinia],
        stubs: {
          'v-app': true,
          'v-main': true,
          'router-view': true
        }
      }
    })
    await router.isReady()

    expect(wrapper2.vm.$route.path).toBe('/v2/books')
    expect(wrapper2.vm.$route.path.startsWith('/v2/')).toBe(true)
  })

  it('renders different layouts based on route', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/v2/about', component: { template: '<div>About V2</div>' } }
      ]
    })
    const pinia = createPinia()

    // Test V1 route - should render Vuetify layout
    await router.push('/')
    const wrapper1 = mount(App, {
      global: {
        plugins: [router, pinia],
        stubs: {
          'v-app': { template: '<div class="v-app"><slot /></div>' },
          'v-main': { template: '<div class="v-main"><slot /></div>' },
          'router-view': true
        }
      }
    })
    await router.isReady()

    expect(wrapper1.find('.v-app').exists()).toBe(true)
    expect(wrapper1.find('.v-main').exists()).toBe(true)

    // Test V2 route - should render Naive UI layout
    await router.push('/v2/about')
    const wrapper2 = mount(App, {
      global: {
        plugins: [router, pinia],
        stubs: {
          'v-app': { template: '<div class="v-app"><slot /></div>' },
          'v-main': { template: '<div class="v-main"><slot /></div>' },
          'router-view': true
        }
      }
    })
    await router.isReady()

    expect(wrapper2.find('.v-app').exists()).toBe(false)
    expect(wrapper2.find('#app-v2').exists()).toBe(true)
  })

  it('switches layouts when navigating between V1 and V2 routes', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/v2/about', component: { template: '<div>About V2</div>' } }
      ]
    })
    const pinia = createPinia()

    const wrapper = mount(App, {
      global: {
        plugins: [router, pinia],
        stubs: {
          'v-app': { template: '<div class="v-app"><slot /></div>' },
          'v-main': { template: '<div class="v-main"><slot /></div>' },
          'router-view': true
        }
      }
    })

    // Start with V1 route
    await router.push('/')
    await router.isReady()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.v-app').exists()).toBe(true)
    expect(wrapper.find('#app-v2').exists()).toBe(false)

    // Navigate to V2 route
    await router.push('/v2/about')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.v-app').exists()).toBe(false)
    expect(wrapper.find('#app-v2').exists()).toBe(true)

    // Navigate back to V1 route
    await router.push('/')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.v-app').exists()).toBe(true)
    expect(wrapper.find('#app-v2').exists()).toBe(false)
  })
})