import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollToTop(threshold: number = 300) {
  const showScrollToTop = ref(false)
  let ticking = false
  
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop
        showScrollToTop.value = scrollY > threshold
        ticking = false
      })
      ticking = true
    }
  }
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  
  onMounted(() => {
    if (typeof window !== 'undefined') {
      // Initial check
      handleScroll()
      window.addEventListener('scroll', handleScroll, { passive: true })
    }
  })
  
  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', handleScroll)
    }
  })
  
  return {
    showScrollToTop,
    scrollToTop
  }
}