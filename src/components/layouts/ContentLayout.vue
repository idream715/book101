<template>
  <div class="content-layout">
    <!-- Page Header -->
    <div v-if="showHeader" class="page-header">
      <n-card class="header-card">
        <div class="header-content">
          <div class="title-section">
            <h1 v-if="title" class="page-title">{{ title }}</h1>
            <p v-if="description" class="page-description">{{ description }}</p>
          </div>
          
          <div v-if="$slots.actions" class="actions-section">
            <slot name="actions" />
          </div>
        </div>
      </n-card>
    </div>

    <!-- Main Content Area -->
    <div class="main-content">
      <slot />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-overlay">
      <n-spin size="large">
        <template #description>
          {{ loadingText }}
        </template>
      </n-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ContentLayoutProps {
  title?: string
  description?: string
  loading?: boolean
  loadingText?: string
  showHeader?: boolean
}

withDefaults(defineProps<ContentLayoutProps>(), {
  loadingText: 'กำลังโหลด...',
  showHeader: true,
  loading: false
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap');

.content-layout {
  position: relative;
  font-family: 'Sarabun', sans-serif;
}

.page-header {
  margin-bottom: 24px;
}

.header-card {
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.title-section {
  flex: 1;
}

.page-title {
  font-family: 'Sarabun', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-description {
  font-family: 'Sarabun', sans-serif;
  font-size: 16px;
  color: #4a5568;
  margin: 0;
  line-height: 1.6;
}

.actions-section {
  flex-shrink: 0;
}

.main-content {
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  backdrop-filter: blur(4px);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .page-description {
    font-size: 14px;
  }
  
  .page-header {
    margin-bottom: 16px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 20px;
  }
  
  .page-description {
    font-size: 13px;
  }
}
</style>