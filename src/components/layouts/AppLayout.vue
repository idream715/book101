<template>
  <n-layout class="app-layout">
    <!-- Real Navbar Component -->
    <Navbar />

    <!-- Main Content -->
    <n-layout-content class="app-content">
      <div class="content-wrapper">
        <slot></slot>
      </div>
    </n-layout-content>

    <!-- Footer -->
    <n-layout-footer bordered class="app-footer">
      <div class="footer-content">
        <n-text depth="3" class="footer-text">
          &copy; 2563 — ธรรมะ 01
        </n-text>
      </div>
    </n-layout-footer>

    <!-- Custom Scroll to Top FAB -->
    <Transition name="fab-fade">
      <n-button
        v-show="showFAB"
        type="info"
        circle
        size="large"
        class="custom-fab"
        :style="{
          position: 'fixed',
          right: (isMobile ? 16 : 24) + 'px',
          bottom: (isMobile ? 80 : 24) + 'px',
          zIndex: 9999
        }"
        @click="handleScrollToTop"
      >
      <n-icon size="24">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10v10"></path><path d="M12 10l4 4"></path><path d="M12 10l-4 4"></path><path d="M4 4h16"></path></g></svg>
      </n-icon>
      </n-button>
    </Transition>
  </n-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { useResponsiveLayout } from '@/composables/useResponsiveLayout'

// Composables
const { isMobile } = useResponsiveLayout()

// FAB visibility state
const showFAB = ref(false)

// Handle scroll events
const handleScroll = () => {
  const scrollY = window.scrollY || document.documentElement.scrollTop
  showFAB.value = scrollY > 300
}

// Handle FAB click
const handleScrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll() // Initial check
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600&display=swap');

.app-layout {
  min-height: 100vh;
  font-family: 'Sarabun', sans-serif;
}

.app-content {
  flex: 1;
  background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
  padding-top: 64px; /* Space for fixed navbar */
  /* Removed fixed height to allow natural page flow */
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  /* Removed min-height to allow natural content height */
}

.app-footer {
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  padding: 16px 0;
}

.footer-content {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.footer-text {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
  margin: 0 8px;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 16px;
  }

  .footer-content {
    flex-direction: column;
    gap: 8px;
    padding: 0 16px;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: 12px;
  }

  .footer-text {
    font-size: 12px;
    text-align: center;
  }
}

/* Custom FAB Styles */
.custom-fab {
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.3);
  transition: all 0.3s ease;
}

.custom-fab:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(24, 144, 255, 0.4);
}

/* FAB Fade Animation */
.fab-fade-enter-active,
.fab-fade-leave-active {
  transition: all 0.3s ease;
}

.fab-fade-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}

.fab-fade-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}

.fab-fade-enter-to {
  opacity: 1;
  transform: scale(1) translateY(0);
}

</style>