import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import naive from 'naive-ui'
import SearchPage from '@/views-v2/SearchPage.vue'
import { createPinia } from 'pinia'

// Mock stores
const mockSearchStore = {
  search_random: [],
  overlay: false,
  clear: vi.fn(),
  setFirstIndexsFromApi: vi.fn(),
  setSearchRandom: vi.fn()
}

vi.mock('@/stores/search', () => ({
  useSearchStore: vi.fn(() => mockSearchStore)
}))

// Mock composables
vi.mock('@/composables/useAnalytics', () => ({
  useAnalytics: vi.fn(() => ({
    trackSearch: vi.fn()
  }))
}))

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: vi.fn(() => ({
      query: { t: '1' },
      name: 'SearchPageV2'
    })),
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      resolve: vi.fn(() => ({ href: '/test' }))
    }))
  }
})

vi.mock('naive-ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('naive-ui')>()
  return {
    ...actual,
    useMessage: vi.fn(() => ({
      success: vi.fn(),
      warning: vi.fn(),
      error: vi.fn()
    }))
  }
})

// Mock window width for mobile detection
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024
})

describe('SearchPage V2 (Naive UI)', () => {
  beforeEach(() => {
    // Reset mocks
    mockSearchStore.search_random = []
    mockSearchStore.overlay = false
    mockSearchStore.clear = vi.fn()
    mockSearchStore.setFirstIndexsFromApi = vi.fn()
    mockSearchStore.setSearchRandom = vi.fn()
    
    // Reset window width
    window.innerWidth = 1024
  })

  const createWrapper = () => {
    const pinia = createPinia()
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/v2/search-page',
          name: 'SearchPageV2',
          component: SearchPage
        }
      ]
    })

    const app = createApp({})
    app.use(naive)
    app.use(router)
    app.use(pinia)

    return mount(SearchPage, {
      global: {
        plugins: [router, naive, pinia]
      }
    })
  }

  it('renders the SearchPage V2 component', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('displays correct background image for creator 1', () => {
    const wrapper = createWrapper()
    const backgroundDiv = wrapper.find('.search-background')
    expect(backgroundDiv.attributes('style')).toContain('https://images.unsplash.com/photo-1503455637927-730bce8583c0')
  })

  it('shows correct heading title for creator 1', () => {
    const wrapper = createWrapper()
    const title = wrapper.find('.search-title')
    expect(title.text()).toBe('หนังสือคุณครูไม่ใหญ่')
  })

  it('displays logo for creator 1', () => {
    const wrapper = createWrapper()
    const logo = wrapper.find('.creator-logo')
    expect(logo.exists()).toBe(true)
  })

  it('shows desktop navigation when not mobile', () => {
    window.innerWidth = 1024
    const wrapper = createWrapper()
    const desktopNav = wrapper.find('.nav-desktop')
    expect(desktopNav.exists()).toBe(true)
  })

  it('shows mobile navigation when mobile', () => {
    window.innerWidth = 600
    const wrapper = createWrapper()
    const mobileNav = wrapper.find('.nav-mobile')
    expect(mobileNav.exists()).toBe(true)
  })

  it('has search form with keyword input', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    expect(html).toContain('search-input')
    expect(html).toContain('ค้นหาคำสอน')
  })

  it('has search and random buttons', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    expect(html).toContain('ค้นหา')
    expect(html).toContain('อ่านอะไรดี')
  })

  it('clears search store on mount', () => {
    createWrapper()
    expect(mockSearchStore.clear).toHaveBeenCalled()
  })

  it('logs component load message', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    createWrapper()
    expect(consoleSpy).toHaveBeenCalledWith('SearchPageV2 (Naive UI) component loaded!')
    consoleSpy.mockRestore()
  })

  it('has random search modal structure', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    expect(html).toContain('random-modal')
    expect(html).toContain('อ่านอะไรดี')
  })

  it('contains navigation buttons', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    expect(html).toContain('การ์ดธรรมะ')
    expect(html).toContain('หนังสือธรรมะ')
    expect(html).toContain('เกี่ยวกับ')
  })

  it('has proper CSS classes for styling', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    expect(html).toContain('search-page')
    expect(html).toContain('search-background')
    expect(html).toContain('search-overlay')
    expect(html).toContain('search-content')
  })

  it('has responsive design classes', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    expect(html).toContain('nav-header')
    expect(html).toContain('search-header')
    expect(html).toContain('search-buttons')
  })

  it('includes Thai Sarabun font', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    expect(html).toContain('Sarabun')
  })

  it('handles creator parameter correctly', () => {
    const wrapper = createWrapper()
    // Component should initialize with creator from route query
    expect(wrapper.vm.creatorId).toBe('1')
  })

  it('has proper modal structure for random search', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    expect(html).toContain('random-content')
    expect(html).toContain('random-title')
    expect(html).toContain('random-detail')
  })

  it('includes search form components', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    expect(html).toContain('search-form')
    expect(html).toContain('search-button')
    expect(html).toContain('random-button')
  })
})