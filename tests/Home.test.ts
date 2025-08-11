import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import naive from 'naive-ui'
import Home from '@/views/Home.vue'

describe('Home (Naive UI)', () => {
  const createWrapper = () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/',
          name: 'Home',
          component: Home
        }
      ]
    })

    const app = createApp({})
    app.use(naive)
    app.use(router)

    return mount(Home, {
      global: {
        plugins: [router, naive]
      }
    })
  }

  it('renders the Home component', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('displays creator sections', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    
    // Check for creator sections
    expect(html).toContain('พระมงคลเทพมุนี')  // Creator 4
    expect(html).toContain('หลวงพ่อธัมมชโย')   // Creator 1
    expect(html).toContain('คุณยายอาจารย์')    // Creator 2
  })

  it('has navigation menus for each creator', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    
    // Check for navigation buttons
    expect(html).toContain('หนังสือธรรมะ')
    expect(html).toContain('ค้นหาเนื้อหา')
    expect(html).toContain('การ์ดธรรมะ')
    expect(html).toContain('ปกิณกะ')
  })

  it('uses responsive layout', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    
    // Check for responsive classes
    expect(html).toContain('creator-section')
    expect(html).toContain('menu-grid')
  })

  it('has proper background styling', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()
    
    // Check for background styling classes
    expect(html).toContain('full-width')
    expect(html).toContain('gradient-overlay')
  })
})