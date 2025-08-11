import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import naive from 'naive-ui'
import Search from '@/views/Search.vue'
import AppLayout from '@/components/layouts/AppLayout.vue'
import ContentLayout from '@/components/layouts/ContentLayout.vue'
import { createPinia } from 'pinia'

// Mock the layouts to avoid complex dependencies
vi.mock('@/components/layouts/AppLayout.vue', () => ({
  default: {
    template: '<div class="app-layout"><slot /></div>'
  }
}))

vi.mock('@/components/layouts/ContentLayout.vue', () => ({
  default: {
    template: '<div class="content-layout"><h1>{{ title }}</h1><p>{{ description }}</p><slot /></div>',
    props: ['title', 'description', 'loading', 'loading-text']
  }
}))

// Mock stores
const mockSearchStore = {
  indexs: [],
  totalsIndexs: 0,
  overlay: false,
  notfound: false,
  setFirstIndexsFromApi: vi.fn(),
  setFirstIndexsFromApi_infenit: vi.fn()
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
      name: 'Search'
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

describe('Search V2 (Naive UI)', () => {
  beforeEach(() => {
    // Reset mocks
    mockSearchStore.indexs = []
    mockSearchStore.totalsIndexs = 0
    mockSearchStore.overlay = false
    mockSearchStore.notfound = false
    mockSearchStore.setFirstIndexsFromApi = vi.fn()
    mockSearchStore.setFirstIndexsFromApi_infenit = vi.fn()
  })

  const createWrapper = () => {
    const pinia = createPinia()
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/search',
          name: 'Search',
          component: Search
        }
      ]
    })

    const app = createApp({})
    app.use(naive)
    app.use(router)
    app.use(pinia)

    return mount(Search, {
      global: {
        plugins: [router, naive, pinia],
        stubs: {
          AppLayout,
          ContentLayout
        }
      }
    })
  }

  it('renders the Search V2 component', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the correct title', () => {
    const wrapper = createWrapper()
    const contentLayout = wrapper.findComponent(ContentLayout)
    expect(contentLayout.props('title')).toBe('🔍 ผลการค้นหา')
  })

  it('uses AppLayout as the main layout wrapper', () => {
    const wrapper = createWrapper()
    expect(wrapper.findComponent(AppLayout).exists()).toBe(true)
  })

  it('uses ContentLayout with proper props', () => {
    const wrapper = createWrapper()
    const contentLayout = wrapper.findComponent(ContentLayout)
    expect(contentLayout.exists()).toBe(true)
    expect(contentLayout.props('title')).toBeDefined()
    expect(contentLayout.props('description')).toBeDefined()
  })

  it('has search form with keyword input', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    expect(html).toContain('search-form-card')
    expect(html).toContain('keyword-input')
    expect(html).toContain('ค้นหาคำสอน')
  })

  it('has search button', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    expect(html).toContain('search-button')
    expect(html).toContain('ค้นหา')
  })

  it('shows loading skeleton when loading', () => {
    mockSearchStore.overlay = true
    const wrapper = createWrapper()
    const html = wrapper.html()
    expect(html).toContain('loading-skeleton')
  })

  it('shows search results when available', () => {
    mockSearchStore.indexs = [
      {
        mark_index: 'Test Result',
        mark_details: 'Test details',
        bookName: 'Test Book',
        bookId: '1'
      }
    ]
    mockSearchStore.totalsIndexs = 1
    const wrapper = createWrapper()
    const html = wrapper.html()
    expect(html).toContain('search-results')
    expect(html).toContain('Test Result')
  })

  it('shows empty state when no results and has searched', () => {
    mockSearchStore.indexs = []
    mockSearchStore.notfound = true
    const wrapper = createWrapper()
    wrapper.vm.hasSearched = true
    const html = wrapper.html()
    expect(html).toContain('empty-state')
    expect(html).toContain('ไม่พบผลลัพธ์ที่ค้นหา')
  })

  it('displays search stats when results exist', () => {
    mockSearchStore.indexs = [
      {
        mark_index: 'Test Result',
        mark_details: 'Test details',
        bookName: 'Test Book',
        bookId: '1'
      }
    ]
    mockSearchStore.totalsIndexs = 1
    const wrapper = createWrapper()
    const html = wrapper.html()
    expect(html).toContain('search-stats')
    expect(html).toContain('พบ 1 รายการ')
  })

  it('has modal structures for detail and youtube', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    expect(html).toContain('detail-modal')
    expect(html).toContain('youtube-modal')
  })

  it('includes result action buttons', () => {
    mockSearchStore.indexs = [
      {
        mark_index: 'Test Result',
        mark_details: 'Test details',
        bookName: 'Test Book',
        bookId: '1',
        chapterLinkYouTube: 'https://youtube.com/test',
        chapterLinkPdf: 'https://test.pdf'
      }
    ]
    const wrapper = createWrapper()
    const html = wrapper.html()
    expect(html).toContain('youtube-button')
    expect(html).toContain('pdf-button')
    expect(html).toContain('detail-button')
  })

  it('logs component load message', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    createWrapper()
    expect(consoleSpy).toHaveBeenCalledWith('Search (Naive UI) component loaded!')
    consoleSpy.mockRestore()
  })

  it('has proper CSS classes for styling', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    expect(html).toContain('search-form-card')
    expect(html).toContain('search-results')
    expect(html).toContain('result-card')
  })

  it('handles infinite scroll trigger', () => {
    mockSearchStore.indexs = [
      {
        mark_index: 'Test Result',
        mark_details: 'Test details',
        bookName: 'Test Book',
        bookId: '1'
      }
    ]
    mockSearchStore.totalsIndexs = 10 // More than current results
    const wrapper = createWrapper()
    const html = wrapper.html()
    expect(html).toContain('infinite-scroll-trigger')
  })

  it('includes Thai Sarabun font', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    expect(html).toContain('Sarabun')
  })

  it('has responsive design classes', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    expect(html).toContain('result-header')
    expect(html).toContain('result-content')
    expect(html).toContain('result-actions')
  })

  it('handles creator parameter correctly', () => {
    const wrapper = createWrapper()
    // Component should initialize with creator from route query
    expect(wrapper.vm.creatorId).toBe('1')
  })

  it('has copy functionality in detail modal', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    expect(html).toContain('คัดลอก')
    expect(html).toContain('detail-text')
  })

  it('includes result highlighting functionality', () => {
    const wrapper = createWrapper()
    // Check if renderHighlightedText method exists
    expect(wrapper.vm.renderHighlightedText).toBeDefined()
  })

  it('has proper modal footer buttons', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    expect(html).toContain('ออก')
    expect(html).toContain('เข้าสู่เว็บหลัก YouTube')
  })
})