import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import naive from 'naive-ui'
import About from '@/views/About.vue'
import AppLayout from '@/components/layouts/AppLayout.vue'
import ContentLayout from '@/components/layouts/ContentLayout.vue'

// Mock the layouts to avoid complex dependencies
vi.mock('@/components/layouts/AppLayout.vue', () => ({
  default: {
    template: '<div class="app-layout"><slot /></div>'
  }
}))

vi.mock('@/components/layouts/ContentLayout.vue', () => ({
  default: {
    template: '<div class="content-layout"><h1>{{ title }}</h1><p>{{ description }}</p><slot /></div>',
    props: ['title', 'description']
  }
}))

describe('About (Naive UI)', () => {
  const createWrapper = () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/about',
          name: 'About',
          component: About
        }
      ]
    })

    const app = createApp({})
    app.use(naive)
    app.use(router)

    return mount(About, {
      global: {
        plugins: [router, naive],
        stubs: {
          AppLayout,
          ContentLayout
        }
      }
    })
  }

  it('renders the About component', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the correct title', () => {
    const wrapper = createWrapper()
    const contentLayout = wrapper.findComponent(ContentLayout)
    expect(contentLayout.props('title')).toBe('เกี่ยวกับเรา')
  })

  it('displays the correct description', () => {
    const wrapper = createWrapper()
    const contentLayout = wrapper.findComponent(ContentLayout)
    expect(contentLayout.props('description')).toBe('คำสอนหลวงพ่อธัมมชโย (คุณครูไม่ใหญ่) - ธรรมะที่เข้าใจง่าย ลึกซึ้ง และทรงคุณค่า')
  })

  it('contains the main content about หลวงพ่อธัมมชโย', () => {
    const wrapper = createWrapper()
    const text = wrapper.text()
    expect(text).toContain('คำสอนของหลวงพ่อธัมมชโย (คุณครูไม่ใหญ่)')
    expect(text).toContain('เป็นธรรมะที่ง่ายแต่ลึกซึ้งและทรงคุณค่า')
    expect(text).toContain('อาสาสมัครเพื่อเผยแพร่ธรรมะ')
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
    expect(consoleSpy).toHaveBeenCalledWith('About (Naive UI) component with layouts loaded!')
    consoleSpy.mockRestore()
  })

  it('has correct CSS classes for styling', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    expect(html).toContain('logo-card')
    expect(html).toContain('content-card')
    expect(html).toContain('section-title')
    expect(html).toContain('content-text')
  })
})