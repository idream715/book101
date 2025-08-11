import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import naive from 'naive-ui'
import ShortsList from '@/views/ShortsList.vue'
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

describe('ShortsList (Naive UI)', () => {
  const createWrapper = () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/shorts',
          name: 'Shorts',
          component: ShortsList
        }
      ]
    })

    const app = createApp({})
    app.use(naive)
    app.use(router)

    return mount(ShortsList, {
      global: {
        plugins: [router, naive],
        stubs: {
          AppLayout,
          ContentLayout
        }
      }
    })
  }

  it('renders the ShortsList component', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('uses AppLayout as the main wrapper', () => {
    const wrapper = createWrapper()
    expect(wrapper.findComponent(AppLayout).exists()).toBe(true)
  })

  it('uses ContentLayout for shorts content', () => {
    const wrapper = createWrapper()
    expect(wrapper.findComponent(ContentLayout).exists()).toBe(true)
  })

  it('has search functionality', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    
    // Check for search elements
    expect(html).toContain('search-form')
  })

  it('displays shorts in timeline format', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    
    // Check for timeline elements
    expect(html).toContain('timeline')
  })

  it('has collapsible search section', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    
    // Check for collapsible elements
    expect(html).toContain('collapse')
  })

  it('supports keyword filtering', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    
    // Check for keyword input
    expect(html).toContain('keyword-input')
  })

  it('has infinite scroll capability', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    
    // Check for infinite scroll elements
    expect(html).toContain('infinite-scroll')
  })
})