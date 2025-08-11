import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import naive from 'naive-ui'
import Books from '@/views/Books.vue'
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
vi.mock('@/stores/books', () => ({
  useBooksStore: () => ({
    getBooks: [],
    getBooksFromApi: vi.fn()
  })
}))

vi.mock('@/stores/search', () => ({
  useSearchStore: () => ({
    getoverlay: false
  })
}))

describe('Books V2 (Naive UI)', () => {
  const createWrapper = () => {
    const pinia = createPinia()
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/books',
          name: 'Books',
          component: Books
        }
      ]
    })

    const app = createApp({})
    app.use(naive)
    app.use(router)
    app.use(pinia)

    return mount(Books, {
      global: {
        plugins: [router, naive, pinia],
        stubs: {
          AppLayout,
          ContentLayout
        }
      }
    })
  }

  it('renders the Books V2 component', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the correct title', () => {
    const wrapper = createWrapper()
    const contentLayout = wrapper.findComponent(ContentLayout)
    expect(contentLayout.props('title')).toBe('📚 หนังสือธรรมะ')
  })

  it('displays the correct description', () => {
    const wrapper = createWrapper()
    const contentLayout = wrapper.findComponent(ContentLayout)
    expect(contentLayout.props('description')).toBe('รวมหนังสือคำสอนของหลวงพ่อธัมมชโย และคุณครูไม่ใหญ่ ครบถ้วนทุกเล่ม')
  })

  it('contains search and filter functionality', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    expect(html).toContain('เลือกชุดหนังสือ หรือ พิมพ์ชื่อหนังสือ')
    expect(html).toContain('filter-card')
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

  it('logs component load message', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    createWrapper()
    expect(consoleSpy).toHaveBeenCalledWith('Books (Naive UI) component loaded!')
    consoleSpy.mockRestore()
  })

  it('has correct CSS classes for styling', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    expect(html).toContain('filter-card')
    expect(html).toContain('books-grid')
    expect(html).toContain('books-container')
  })

  it('has empty state functionality', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    expect(html).toContain('empty-state')
    expect(html).toContain('ไม่พบหนังสือที่ค้นหา')
  })

  it('implements responsive grid system', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    expect(html).toContain('books-container')
    expect(html).toContain('books-grid')
  })
})