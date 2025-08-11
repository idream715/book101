import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import naive from 'naive-ui'
import Sarabun from '@/views/Sarabun.vue'
import AppLayout from '@/components/layouts/AppLayout.vue'
import ContentLayout from '@/components/layouts/ContentLayout.vue'

// Mock the layouts
vi.mock('@/components/layouts/AppLayout.vue', () => ({
  default: {
    template: '<div class="app-layout"><slot /></div>'
  }
}))

vi.mock('@/components/layouts/ContentLayout.vue', () => ({
  default: {
    template: '<div class="content-layout"><slot /></div>',
    props: ['title', 'description', 'loading']
  }
}))

describe('Sarabun (Naive UI)', () => {
  const createWrapper = (bookId = '1') => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/book/:id',
          name: 'Book',
          component: Sarabun,
          props: true
        }
      ]
    })

    // Navigate to book route
    router.push(`/book/${bookId}`)

    const app = createApp({})
    app.use(naive)
    app.use(router)

    return mount(Sarabun, {
      props: {
        id: bookId
      },
      global: {
        plugins: [router, naive],
        stubs: {
          AppLayout,
          ContentLayout
        }
      }
    })
  }

  it('renders the Sarabun component', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('uses AppLayout as the main wrapper', () => {
    const wrapper = createWrapper()
    expect(wrapper.findComponent(AppLayout).exists()).toBe(true)
  })

  it('uses ContentLayout for book content', () => {
    const wrapper = createWrapper()
    expect(wrapper.findComponent(ContentLayout).exists()).toBe(true)
  })

  it('accepts book ID as prop', () => {
    const wrapper = createWrapper('123')
    expect(wrapper.props('id')).toBe('123')
  })

  it('has book information display section', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    
    // Check for book info elements
    expect(html).toContain('book-info')
  })

  it('has table of contents section', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    
    // Check for TOC elements
    expect(html).toContain('table-of-contents')
  })

  it('has proper responsive grid layout', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    
    // Check for grid layout classes
    expect(html).toContain('responsive-grid')
  })
})