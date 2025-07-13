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
  </n-layout>
</template>

<script setup lang="ts">
import Navbar from '@/components-v2/Navbar.vue'

console.log('AppLayout (Naive UI) with real Navbar loaded!')
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
  min-height: calc(100vh - 64px);
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  min-height: 100%;
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
</style>