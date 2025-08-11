<template>
  <div class="app-navbar">
    <n-affix :top="0" v-if="!hideOnHome || !isHomePage">
      <n-card 
        class="navbar-card"
        :style="{ 
          backgroundImage: `${creatorGradient}, url(${creatorBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }"
      >
        <div class="navbar-content">
          <!-- Logo Section -->
          <div class="logo-section">
            <n-space align="center" :size="12">
              <n-avatar
                :size="40"
                :src="logoUrl"
                fallback-src="/src/assets/logo2.png"
                round
                class="logo-avatar"
              />
              <div class="title-section" v-if="!isMobile">
                <router-link :to="homeRoute" class="title-link">
                  <n-text class="app-title">{{ displayTitle }}</n-text>
                </router-link>
              </div>
            </n-space>
          </div>

          <!-- Navigation Actions -->
          <div class="nav-actions">
            <n-space :size="8">
              <!-- Home Button -->
              <n-button
                circle
                tertiary
                :focusable="false"
                @click="navigateHome"
                class="nav-button"
              >
                <template #icon>
                  <n-icon :component="HomeIcon" />
                </template>
              </n-button>

              <!-- Books Button -->
              <n-button
                v-if="showBooksButton"
                circle
                tertiary
                :focusable="false"
                @click="navigateBooks"
                class="nav-button"
              >
                <template #icon>
                  <n-icon :component="isIndexsPage ? BookIcon : BookOpenIcon" />
                </template>
              </n-button>

              <!-- Creator Switcher -->
              <n-dropdown
                v-if="showCreatorSwitcher && !isMobile"
                :options="creatorOptions"
                @select="handleCreatorSelect"
                trigger="click"
              >
                <n-button
                  circle
                  tertiary
                  :focusable="false"
                  class="nav-button"
                >
                  <template #icon>
                    <n-icon :component="PersonIcon" />
                  </template>
                </n-button>
              </n-dropdown>

              <!-- Mobile Menu -->
              <n-dropdown
                v-if="isMobile"
                :options="mobileMenuOptions"
                @select="handleMobileMenuSelect"
                trigger="click"
              >
                <n-button
                  circle
                  tertiary
                  :focusable="false"
                  class="nav-button"
                >
                  <template #icon>
                    <n-icon :component="MenuIcon" />
                  </template>
                </n-button>
              </n-dropdown>
            </n-space>
          </div>
        </div>
      </n-card>
    </n-affix>

    <!-- Floating Action Button (Scroll to Top) -->
    <n-back-top
      :right="24"
      :bottom="24"
      :visibility-height="100"
      :show="showScrollToTop"
    >
      <n-button
        circle
        type="primary"
        size="large"
        class="scroll-to-top-button"
      >
        <template #icon>
          <n-icon :component="ChevronUpIcon" />
        </template>
      </n-button>
    </n-back-top>

    <!-- Loading Overlay -->
    <n-modal
      v-model:show="showOverlay"
      :closable="false"
      :close-on-esc="false"
      :mask-closable="false"
      class="loading-overlay"
    >
      <n-card class="loading-card">
        <n-space vertical align="center" :size="16">
          <n-spin size="large" />
          <n-text>กำลังโหลด...</n-text>
        </n-space>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBreakpoints } from '@vueuse/core'
import {
  Home as HomeIcon,
  Book as BookIcon,
  BookOutline as BookOpenIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  ChevronUp as ChevronUpIcon
} from '@vicons/ionicons5'

// Props
interface AppNavbarProps {
  hideOnHome?: boolean
  showBooksButton?: boolean
  showCreatorSwitcher?: boolean
  showScrollToTop?: boolean
  logoUrl?: string
  overlay?: boolean
}

const props = withDefaults(defineProps<AppNavbarProps>(), {
  hideOnHome: false,
  showBooksButton: true,
  showCreatorSwitcher: true,
  showScrollToTop: true,
  logoUrl: '/src/assets/logo2.png',
  overlay: false
})

// Emits
const emit = defineEmits<{
  'clear-book': []
  'creator-change': [creatorId: string]
}>()

// Composables
const route = useRoute()
const router = useRouter()

// Responsive breakpoints
const breakpoints = useBreakpoints({
  mobile: 768
})
const isMobile = breakpoints.smaller('mobile')

// Computed
const isHomePage = computed(() => route.name === 'Home')
const isIndexsPage = computed(() => route.name === 'Indexs')
const currentCreator = computed(() => route.query.t as string || '1')

const displayTitle = computed(() => {
  const creator = currentCreator.value
  const routeName = route.name

  if (routeName === 'Cards' && creator === '1') {
    return 'การ์ดคำสอนคุณครูไม่ใหญ่'
  } else if (routeName === 'Cards' && creator === '2') {
    return 'การ์ดคำสอนคุณยายอาจารย์'
  } else if (routeName === 'Cards' && creator === '4') {
    return 'การ์ดคำสอนพระมงคลเทพมุนี'
  } else if (creator === '1') {
    return 'คำสอนคุณครูไม่ใหญ่'
  } else if (creator === '2') {
    return 'คำสอนคุณยายอาจารย์'
  } else if (creator === '4') {
    return 'คำสอนพระมงคลเทพมุนี'
  }
  return 'Dhamma01'
})

const homeRoute = computed(() => {
  return '/'
})

const showOverlay = computed(() => props.overlay)

// Creator-specific background
const creatorBackground = computed(() => {
  switch (currentCreator.value) {
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

const creatorGradient = computed(() => {
  switch (currentCreator.value) {
    case '1':
      return 'linear-gradient(135deg, rgba(255, 182, 193, 0.8), rgba(255, 105, 180, 0.8))'
    case '2':
      return 'linear-gradient(135deg, rgba(173, 216, 230, 0.8), rgba(135, 206, 235, 0.8))'
    case '4':
      return 'linear-gradient(135deg, rgba(255, 223, 0, 0.8), rgba(255, 140, 0, 0.8))'
    default:
      return 'linear-gradient(135deg, rgba(255, 182, 193, 0.8), rgba(255, 105, 180, 0.8))'
  }
})

// Creator options
const creatorOptions = computed(() => [
  {
    label: 'หลวงพ่อธัมมชโย (คุณครูไม่ใหญ่)',
    key: '1',
    disabled: currentCreator.value === '1'
  },
  {
    label: 'คุณยายอาจารย์ มหารัตนอุบาสิกาจันทร์',
    key: '2',
    disabled: currentCreator.value === '2'
  },
  {
    label: 'พระมงคลเทพมุนี (หลวงพ่อวัดปากน้ำ)',
    key: '4',
    disabled: currentCreator.value === '4'
  }
])

// Mobile menu options
const mobileMenuOptions = computed(() => [
  {
    label: 'หน้าหลัก',
    key: 'home',
    icon: HomeIcon
  },
  {
    label: 'หนังสือ',
    key: 'books',
    icon: BookIcon
  },
  {
    type: 'divider',
    key: 'divider1'
  },
  ...creatorOptions.value
])

// Methods
const navigateHome = (): void => {
  emit('clear-book')
  router.push(homeRoute.value)
}

const navigateBooks = (): void => {
  routingTo('/books', currentCreator.value)
}

const routingTo = (path: string, creator: string): void => {
  emit('clear-book')
  router.push({ path, query: { t: creator } })
}

const handleCreatorSelect = (key: string): void => {
  if (key !== currentCreator.value) {
    emit('creator-change', key)
    const currentPath = route.path
    router.push({ path: currentPath, query: { t: key } })
  }
}

const handleMobileMenuSelect = (key: string): void => {
  if (key === 'home') {
    navigateHome()
  } else if (key === 'books') {
    navigateBooks()
  } else if (['1', '2', '4'].includes(key)) {
    handleCreatorSelect(key)
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600&display=swap');

.app-navbar {
  font-family: 'Sarabun', sans-serif;
}

.navbar-card {
  backdrop-filter: blur(10px);
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  position: relative;
}

.navbar-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.3);
  z-index: 1;
}

.navbar-content {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
}

.logo-section {
  flex: 1;
}

.logo-avatar {
  border: 2px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
}

.logo-avatar:hover {
  border-color: rgba(102, 126, 234, 0.6);
  transform: scale(1.05);
}

.title-section {
  min-width: 0;
}

.title-link {
  text-decoration: none;
  color: inherit;
}

.app-title {
  font-family: 'Sarabun', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-actions {
  flex-shrink: 0;
}

.nav-button {
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.nav-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.3);
}

.nav-button :deep(.n-icon) {
  color: white;
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.5));
}

.scroll-to-top-button {
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.loading-overlay :deep(.n-modal-mask) {
  backdrop-filter: blur(4px);
}

.loading-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 200px;
  margin: auto;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .navbar-content {
    padding: 8px 12px;
  }
  
  .app-title {
    font-size: 16px;
  }
  
  .logo-avatar {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 480px) {
  .navbar-content {
    padding: 6px 8px;
  }
  
  .app-title {
    font-size: 14px;
  }
  
  .logo-avatar {
    width: 32px;
    height: 32px;
  }
}
</style>