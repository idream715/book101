<template>
  <div class="navbar-container">
    <!-- Main Navigation Bar -->
    <n-layout-header
      v-if="!hideNavbar"
      class="navbar-header"
      :style="navbarStyle"
      :class="navbarBackgroundClass"
      position="absolute"
    >
      <div class="navbar-content">
        <!-- Logo and Title Section -->
        <div class="navbar-brand">
          <n-image
            v-if="!isMobile"
            src="/src/assets/logo1.png"
            alt="Dhamma01 Logo"
            width="45"
            height="45"
            object-fit="contain"
            preview-disabled
            class="navbar-logo"
          />

          <n-button
            text
            type="primary"
            class="navbar-title-btn"
            @click="navigateHome"
          >
            <h1 class="navbar-title" :class="{ 'navbar-title--mobile': isMobile }">
              {{ headingWords }}
            </h1>
          </n-button>
        </div>

        <!-- Navigation Actions -->
        <div class="navbar-actions">
          <n-space :size="8">
            <!-- Home Button -->
            <n-button
              circle
              quaternary
              type="primary"
              class="navbar-btn"
              @click="navigateHome"
            >
              <template #icon>
                <n-icon :size="20">
                  <HomeOutlined />
                </n-icon>
              </template>
            </n-button>

            <!-- Books Button -->
            <n-button
              circle
              quaternary
              type="primary"
              class="navbar-btn"
              @click="navigateToBooks"
            >
              <template #icon>
                <n-icon :size="20">
                  <component :is="booksIcon" />
                </n-icon>
              </template>
            </n-button>

            <!-- Theme Toggle Button (Optional) -->
            <n-button
              v-if="props.showThemeToggle"
              circle
              quaternary
              type="primary"
              class="navbar-btn"
              @click="toggleTheme"
            >
              <template #icon>
                <n-icon :size="18">
                  <component :is="themeIcon" />
                </n-icon>
              </template>
            </n-button>
          </n-space>
        </div>
      </div>
    </n-layout-header>

    <!-- Back to Top Button -->
    <n-back-top
      v-if="showBackToTop"
      :right="isMobile ? 16 : 24"
      :bottom="isMobile ? 16 : 24"
      :visibility-height="100"
      :listen-to="backTopTarget"
      class="back-to-top-btn"
    >
      <n-button
        circle
        type="primary"
        size="large"
        class="back-to-top-button"
      >
        <template #icon>
          <n-icon :size="24">
            <UpOutlined />
          </n-icon>
        </template>
      </n-button>
    </n-back-top>

    <!-- Loading Overlay -->
    <n-modal
      v-model:show="showLoadingOverlay"
      :mask-closable="false"
      :close-on-esc="false"
      :show-icon="false"
      preset="card"
      class="loading-overlay"
      :style="loadingModalStyle"
    >
      <template #header>
        <span></span>
      </template>

      <div class="loading-content">
        <n-spin size="large" />
        <n-text class="loading-text">กำลังโหลด...</n-text>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NIcon } from 'naive-ui'
import {
  HomeOutlined,
  BookOutlined,
  ReadOutlined,
  UpOutlined
} from '@vicons/antd'
import {
  Sunny,
  Moon
} from '@vicons/ionicons5'
import { useBooksStore } from '@/stores/books'
import { useSearchStore } from '@/stores/search'
import { useResponsiveLayout } from '@/composables/useResponsiveLayout'
import { useTheme } from '@/composables/useTheme'

// Props
interface NavbarProps {
  showThemeToggle?: boolean
}

const props = withDefaults(defineProps<NavbarProps>(), {
  showThemeToggle: false
})

console.log('NavbarV2 (Naive UI) component loaded!')

// Composables
const route = useRoute()
const router = useRouter()
const booksStore = useBooksStore()
const searchStore = useSearchStore()
const { isMobile } = useResponsiveLayout()
const { isDarkMode, toggleTheme: toggleAppTheme } = useTheme()

// Reactive state
const showBackToTop = ref<boolean>(false)
const backTopTarget = ref<string | HTMLElement>('body')

// Computed properties
const hideNavbar = computed((): boolean => {
  return route.name === 'Home' || route.name === 'SearchPage' ||
         route.name === 'HomeV2' || route.name === 'SearchPageV2'
})

const creator = computed((): string => {
  return (route.query.t as string) || '1'
})

// Creator-specific background
const creatorBackground = computed((): string => {
  switch (creator.value) {
    case '1':
      return 'https://images.unsplash.com/photo-1503455637927-730bce8583c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80'
    case '2':
      return 'https://i.imgur.com/PA4GVvR.jpeg'
    case '4':
      return 'https://i.postimg.cc/2yNjQ85Z/gold.jpg'
    default:
      return 'https://images.unsplash.com/photo-1503455637927-730bce8583c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80'
  }
})

const creatorGradient = computed((): string => {
  switch (creator.value) {
    case '1':
      return 'linear-gradient(135deg, rgba(255, 182, 193, 0.8), rgba(255, 105, 180, 0.8))'
    case '2':
      return 'linear-gradient(135deg, rgba(9, 16, 196, 0.8), rgba(0, 128, 180, 0.8))'
    case '4':
      return 'linear-gradient(135deg, rgba(255, 223, 0, 0.8), rgba(255, 140, 0, 0.8))'
    default:
      return 'linear-gradient(135deg, rgba(255, 182, 193, 0.8), rgba(255, 105, 180, 0.8))'
  }
})

const headingWords = computed((): string => {
  if (!route.name) return ''

  const routeName = route.name.toString()
  const creatorId = creator.value

  // Handle V2 routes
  const isV2Route = routeName.endsWith('V2')
  const baseName = isV2Route ? routeName.replace('V2', '') : routeName

  if (baseName === 'Cards' && creatorId === '1') {
    return 'การ์ดคำสอนคุณครูไม่ใหญ่'
  } else if (baseName === 'Cards' && creatorId === '2') {
    return 'การ์ดคำสอนคุณยายอาจารย์'
  } else if (baseName === 'Cards' && creatorId === '4') {
    return 'การ์ดธรรมะ'
  } else if (baseName !== 'Cards' && creatorId === '1') {
    return 'คำสอนคุณครูไม่ใหญ่'
  } else if (baseName !== 'Cards' && creatorId === '2') {
    return 'คำสอนคุณยายอาจารย์'
  } else if (baseName !== 'Cards' && creatorId === '4') {
    return 'คำสอนพระมงคลเทพมุนี'
  } else {
    return 'ธรรมะ 01'
  }
})

const isIndexsPage = computed((): boolean => {
  const routeName = route.name?.toString() || ''
  return routeName === 'Indexs' || routeName === 'IndexsV2'
})

const booksIcon = computed(() => {
  return isIndexsPage.value ? BookOutlined : ReadOutlined
})

const themeIcon = computed(() => {
  return isDarkMode.value ? Sunny : Moon
})

const showLoadingOverlay = computed((): boolean => {
  return searchStore.getoverlay && !hideNavbar.value && route.name !== 'Home'
})

const navbarBackgroundClass = computed(() => {
  return `navbar-creator-${creator.value}`
})

const navbarStyle = computed(() => {
  return {
    backgroundImage: `${creatorGradient.value}, url(${creatorBackground.value}) !important`,
    backgroundSize: 'cover !important',
    backgroundPosition: 'center !important',
    backgroundBlendMode: 'overlay !important',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    zIndex: 1000
  }
})

const loadingModalStyle = computed(() => {
  return {
    width: 'auto',
    minWidth: '200px'
  }
})

// Methods
const navigateHome = (): void => {
  clearBookData()

  // Determine if we should go to V2 or V1 home
  const targetRoute = route.path.startsWith('/v2') ? '/v2' : '/'
  router.push(targetRoute)
}

const navigateToBooks = (): void => {
  clearBookData()

  // Determine target route based on current route
  const isV2 = route.path.startsWith('/v2')
  const targetPath = isV2 ? '/v2/books' : '/books'

  router.push({
    path: targetPath,
    query: { t: creator.value }
  })
}

const clearBookData = (): void => {
  booksStore.clearSarabun()
  booksStore.clearTotalsSarabun()
}

const toggleTheme = (): void => {
  toggleAppTheme()
}

// Scroll handling
const handleScroll = (): void => {
  if (typeof window === 'undefined') return

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0
  showBackToTop.value = scrollTop > 100
}

// Lifecycle
onMounted(() => {
  // Clear search store on mount
  searchStore.clear()

  // Add scroll listener
  window.addEventListener('scroll', handleScroll, { passive: true })

  // Set initial back to top state
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Watch route changes to clear data
watch(() => route.path, () => {
  if (route.name === 'Home' || route.name === 'HomeV2') {
    clearBookData()
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap');

.navbar-container {
  position: relative;
  z-index: 1000;
}

.navbar-header {
  height: 64px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  position: relative;
}

.navbar-header :deep(.n-layout-header) {
  background: transparent !important;
}

/* Force Naive UI background override */
.navbar-container :deep(.n-layout-header) {
  background: transparent !important;
}

.navbar-container :deep(.n-layout-header__header) {
  background: transparent !important;
}

.navbar-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  z-index: 1;
}

.navbar-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.navbar-logo {
  border-radius: 8px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.navbar-title-btn {
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.navbar-title-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.navbar-title {
  font-family: 'Sarabun', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: white;
  margin: 0;
  white-space: nowrap;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  transition: all 0.3s ease;
}

.navbar-title--mobile {
  font-size: 18px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.navbar-actions {
  display: flex;
  align-items: center;
}

.navbar-btn {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.navbar-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.navbar-btn :deep(.n-icon) {
  color: white;
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.5));
}

.back-to-top-btn {
  z-index: 1001;
}

.back-to-top-button {
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
  box-shadow: 0 4px 16px rgba(236, 72, 153, 0.3);
  transition: all 0.3s ease;
}

.back-to-top-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
}

.loading-overlay {
  z-index: 2000;
}

.loading-overlay :deep(.n-card) {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
}

.loading-text {
  font-family: 'Sarabun', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #666;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .navbar-content {
    padding: 0 12px;
  }

  .navbar-brand {
    gap: 8px;
  }

  .navbar-title {
    font-size: 16px;
  }

  .navbar-btn {
    width: 36px;
    height: 36px;
  }

  .navbar-btn :deep(.n-icon) {
    font-size: 18px;
  }

  .loading-content {
    padding: 16px;
  }

  .loading-text {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .navbar-title {
    font-size: 14px;
    max-width: 150px;
  }

  .navbar-btn {
    width: 32px;
    height: 32px;
  }

  .navbar-btn :deep(.n-icon) {
    font-size: 16px;
  }
}

/* Theme-specific styles */
:global(.theme-dark) .navbar-btn {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.25);
}

:global(.theme-dark) .navbar-btn:hover {
  background-color: rgba(255, 255, 255, 0.25);
}

:global(.theme-dark) .loading-overlay :deep(.n-card) {
  background: rgba(36, 36, 42, 0.95);
}

:global(.theme-dark) .loading-text {
  color: #ccc;
}
</style>