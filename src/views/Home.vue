<template>
  <!-- Full-width layout without AppLayout wrapper -->
  <div class="home-page">
    <!-- Hero Section - Creator 4 (พระมงคลเทพมุนี) -->
    <section id="hero" class="hero-section creator-4-section">
      <div class="section-background creator-4-bg">
        <n-grid :cols="24" :x-gap="24" responsive="screen" class="section-content">
          <n-gi :span="24" :tablet="10" :desktop="14" class="section-text">
            <div class="section-titles">
              <h1 class="section-title">
                มรดกธรรมคำสอน <br> พระมงคลเทพมุนี
              </h1>
              <h1 class="section-subtitle">
                (หลวงปู่วัดปากน้ำ)
              </h1>
            </div>
          </n-gi>

          <n-gi :span="24" :tablet="14" :desktop="10" class="section-menu">
            <div class="menu-grid">
              <n-grid :cols="1" :tablet-cols="2" :x-gap="16" :y-gap="20">
                <n-gi v-for="(feature, i) in menuLuangPu" :key="i">
                  <div @click="navigateToFeature(feature)" class="clickable-wrapper">
                    <n-card
                      hoverable
                      class="menu-card creator-4-card"
                    >
                      <template #header>
                        <div class="menu-card-header">
                          <n-icon
                            :size="24"
                            :color="getCreatorColor(feature.creator)"
                            class="menu-icon"
                          >
                            <component :is="getIconComponent(feature.logo)" />
                          </n-icon>
                          <span class="menu-title">{{ feature.title }}</span>
                        </div>
                      </template>
                    </n-card>
                  </div>
                </n-gi>
              </n-grid>
            </div>
          </n-gi>
        </n-grid>

        <!-- Wave Border -->
        <div class="wave-border">
          <img src="/src/assets/borderWaves.svg" alt="Wave border" />
        </div>
      </div>
    </section>

    <!-- Main Section - Creator 1 (หลวงพ่อธัมมชโย) -->
    <section id="main" class="main-section creator-1-section">
      <div class="section-background creator-1-bg">
        <!-- Top Gradient Overlay -->
        <div class="gradient-overlay gradient-top"></div>

        <n-grid :cols="24" :x-gap="24" responsive="screen" class="section-content">
          <n-gi :span="24" :tablet="10" :desktop="14" class="section-text">
            <div class="main-logo">
              <n-image
                src="/src/assets/logo1.png"
                alt="Logo"
                width="100"
                height="100"
                object-fit="contain"
                class="logo-image"
                preview-disabled
              />
            </div>
            <div class="section-titles">
              <h1 class="section-title">{{ title }}</h1>
              <h1 class="section-subtitle">(คุณครูไม่ใหญ่)</h1>
            </div>
          </n-gi>

          <n-gi :span="24" :tablet="14" :desktop="10" class="section-menu">
            <div class="menu-grid">
              <n-grid :cols="2" :tablet-cols="2" :x-gap="16" :y-gap="20">
                <n-gi v-for="(feature, i) in menuLuangpor" :key="i">
                  <div @click="navigateToFeature(feature)" class="clickable-wrapper">
                    <n-card
                      hoverable
                      class="menu-card creator-1-card"
                    >
                      <template #header>
                        <div class="menu-card-header">
                          <n-icon
                            :size="24"
                            :color="getCreatorColor(feature.creator)"
                            class="menu-icon"
                          >
                            <component :is="getIconComponent(feature.logo)" />
                          </n-icon>
                          <span class="menu-title">{{ feature.title }}</span>
                        </div>
                      </template>
                    </n-card>
                  </div>
                </n-gi>
              </n-grid>
            </div>
          </n-gi>
        </n-grid>

        <!-- Wave Border -->
        <div class="wave-border">
          <img src="/src/assets/borderWaves.svg" alt="Wave border" />
        </div>
      </div>
    </section>

    <!-- Yay Section - Creator 2 (คุณยายอาจารย์) -->
    <section id="yay" class="yay-section creator-2-section">
      <div class="section-background creator-2-bg">
        <!-- Top Gradient Overlay -->
        <div class="gradient-overlay gradient-top"></div>

        <n-grid :cols="24" :x-gap="24" responsive="screen" class="section-content">
          <n-gi :span="24" :tablet="10" :desktop="14" class="section-text">
            <div class="section-titles">
              <h1 class="section-title">{{ titleYay }}</h1>
            </div>
          </n-gi>

          <n-gi :span="24" :tablet="14" :desktop="10" class="section-menu">
            <div class="menu-grid">
              <n-grid :cols="1" :tablet-cols="3" :x-gap="16" :y-gap="20">
                <n-gi v-for="(feature, i) in menuYay" :key="i">
                  <div @click="navigateToFeature(feature)" class="clickable-wrapper">
                    <n-card
                      hoverable
                      class="menu-card creator-2-card"
                    >
                      <template #header>
                        <div class="menu-card-header">
                          <n-icon
                            :size="24"
                            :color="getCreatorColor(feature.creator)"
                            class="menu-icon"
                          >
                            <component :is="getIconComponent(feature.logo)" />
                          </n-icon>
                          <span class="menu-title">{{ feature.title }}</span>
                        </div>
                      </template>
                    </n-card>
                  </div>
                </n-gi>
              </n-grid>
            </div>
          </n-gi>
        </n-grid>

        <!-- Wave Border -->
        <div class="wave-border">
          <img src="/src/assets/borderWaves.svg" alt="Wave border" />
        </div>
      </div>
    </section>

    <!-- Navigation Anchor (Optional - for future smooth scroll) -->
    <n-anchor
      v-if="!isMobile"
      class="page-anchor"
      :top="80"
      affix
    >
      <n-anchor-link href="#hero" title="พระมงคลเทพมุนี" />
      <n-anchor-link href="#main" title="หลวงพ่อธัมมชโย" />
      <n-anchor-link href="#yay" title="คุณยายอาจารย์" />
    </n-anchor>

    <!-- Information Section -->
    <section id="info" class="info-section">
      <div class="info-background">
        <div class="info-content">
          <n-card class="info-card" :bordered="undefined">
            <template #header>
              <h2 class="info-title">ศูนย์รวมโอวาทมหาปูชนียาจารย์</h2>
            </template>
            <div class="info-text">
              <p class="info-paragraph">
                มรดกธรรมคำสอนพระมงคลเทพมุนี (สด จนฺทสโร) พระผู้ปราบมาร<br>
                คำสอนหลวงพ่อธัมมชโย (คุณครูไม่ใหญ่)<br>
                คำสอนคุณยายอาจารย์มหารัตนอุบาสิกาจันทร์ ขนนกยูง ผู้ให้กำเนิดวัดพระธรรมกาย
              </p>
              <p class="info-paragraph">
                ขอผลานิสงส์ในการจัดทำ ส่งผลดลบันดาลให้ผู้มีบุญทุกท่าน
              </p>
              <p class="info-paragraph">
                เข้าถึงพระธรรมกายภายใน ซึ่งที่เป็นพึ่งที่ระลึกที่แท้จริง ที่มีอยู่ในตัวของมนุษย์ทุกคนในโลก เทอญ
              </p>
            </div>
          </n-card>
        </div>
      </div>
    </section>

    <!-- Footer Section -->
    <section id="footer" class="footer-section">
      <div class="footer-content">
        <n-text class="footer-text">
          &copy; 2563 — ผู้เรียบเรียงและเผยแพร่ในระบบคอมพิวเตอร์ : 'sinthu
        </n-text>
      </div>
    </section>


    <!-- Creator Search Navigation Button -->
    <div class="debug-nav" style="position: fixed; top: 10px; left: 10px; z-index: 9999;">
      <n-button secondary @click="toggleCreatorNav" style="padding: 8px; border: none;">
        <template #icon>
          <n-icon  size="24">
            <MenuOutlined />
          </n-icon>
        </template>
        เมนู
      </n-button>

      <!-- Creator Navigation Menu -->
      <div v-if="showCreatorNav" class="creator-nav-menu" style="position: absolute; top: 40px; left: 0; background: white; border: 1px solid #ccc; border-radius: 4px; padding: 16px; min-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <h3 style="margin: 0 0 12px 0; color: #333; font-size: 16px;">ค้นหาคำสอนจาก</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li v-for="creator in creatorList" :key="creator.id" style="margin-bottom: 8px;">
            <button
              @click="navigateToCreator(creator)"
              style="width: 100%; text-align: left; padding: 8px 12px; background: none; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; transition: all 0.2s;"
              :style="{ borderColor: getCreatorColor(creator.id), color: getCreatorColor(creator.id) }"
              @mouseover="$event.target.style.backgroundColor = getCreatorColor(creator.id); $event.target.style.color = 'white'"
              @mouseout="$event.target.style.backgroundColor = 'transparent'; $event.target.style.color = getCreatorColor(creator.id)"
            >
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 8px;" :style="{ backgroundColor: getCreatorColor(creator.id) }"></span>
              {{ creator.name }}
            </button>
          </li>
        </ul>
        <button @click="showCreatorNav = false" style="margin-top: 12px; padding: 4px 8px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">ปิด</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBreakpoints } from '@vueuse/core'
import { NIcon } from 'naive-ui'
import {
  BookOutlined,
  MenuOutlined,
  SearchOutlined,
  PictureOutlined,
  FileTextOutlined,
  YoutubeOutlined
} from '@vicons/antd'
import { useAnalytics } from '@/composables/useAnalytics'

// Types
interface MenuFeature {
  logo: string
  title: string
  text: string
  creator: number
  routeTo: string
}

interface Creator {
  id: number
  name: string
  shortName: string
}


// Composables
const router = useRouter()
const analytics = useAnalytics()

// Breakpoints for responsive design
const breakpoints = useBreakpoints({
  mobile: 640,
  tablet: 768,
  desktop: 1024
})

const isMobile = breakpoints.smaller('tablet')

// Creator Navigation State
const showCreatorNav = ref(false)

// Creator data with names
const creatorList = ref<Creator[]>([
  {
    id: 4,
    name: 'พระมงคลเทพมุนี (หลวงปู่วัดปากน้ำ)',
    shortName: 'พระมงคลเทพมุนี'
  },
  {
    id: 1,
    name: 'หลวงพ่อธัมมชโย (คุณครูไม่ใหญ่)',
    shortName: 'หลวงพ่อธัมมชโย'
  },
  {
    id: 2,
    name: 'คุณยายอาจารย์ มหารัตนอุบาสิกาจันทร์ ขนนกยูง',
    shortName: 'คุณยายอาจารย์'
  },
])

// Reactive data - Matches original Home.vue structure
const features = ref<MenuFeature[]>([
  // Creator 1 (หลวงพ่อธัมมชโย) - 4 เมนู
  {
    logo: 'mdi-book-open-page-variant',
    title: "หนังสือธรรมะ",
    text: "หนังสือที่เก็บรวบรวมคำสอนของหลวงพ่อธัมมชโย",
    creator: 1,
    routeTo: 'books'
  },
  {
    logo: 'mdi-image-multiple',
    title: "การ์ดธรรมะ",
    text: "ธรรมะ รูปแบบข้อความสั้น ๆ ที่อยู่ในรูปภาพที่สวยงาม",
    creator: 1,
    routeTo: 'cards'
  },
  {
    logo: 'mdi-magnify',
    title: "ค้นหาคำ",
    text: "ระบบสืบค้นธรรมะของหลวงพ่อ",
    creator: 1,
    routeTo: 'search-page'
  },
  {
    logo: 'mdi-file-document-multiple',
    title: "ปกิณกะ",
    text: "เรื่องสั้น ๆ ของหลวงพ่อที่สอนใจ",
    creator: 1,
    routeTo: 'shorts'
  },
  // Creator 2 (คุณยายอาจารย์) - 3 เมนู
  {
    logo: 'mdi-book-open-page-variant',
    title: "หนังสือธรรมะ",
    text: "หนังสือที่เก็บรวบรวมคำสอนของคุณยายอาจารย์",
    creator: 2,
    routeTo: 'books'
  },
  {
    logo: 'mdi-image-multiple',
    title: "การ์ดธรรมะ",
    text: "ธรรมะ รูปแบบข้อความสั้น ๆ ที่อยู่ในรูปภาพที่สวยงาม",
    creator: 2,
    routeTo: 'cards'
  },
  {
    logo: 'mdi-magnify',
    title: "ค้นหาคำ",
    text: "ระบบสืบค้นธรรมะของคุณยายอาจารย์",
    creator: 2,
    routeTo: 'search-page'
  },
  // Creator 4 (พระมงคลเทพมุนี) - 2 เมนู
  {
    logo: 'mdi-book-open-page-variant',
    title: "หนังสือธรรมะ",
    text: "หนังสือที่เก็บรวบรวมคำสอนของหลวงปู่",
    creator: 4,
    routeTo: 'books'
  },
  {
    logo: 'mdi-magnify',
    title: "ค้นหาคำ",
    text: "ระบบสืบค้นธรรมะของหลวงปู่",
    creator: 4,
    routeTo: 'search-page'
  }
])

// Computed properties
const title = computed((): string => 'คำสอนหลวงพ่อธัมมชโย')

const titleYay = computed((): string => {
  return !isMobile.value
    ? 'คำสอนคุณยายอาจารย์ มหารัตนอุบาสิกาจันทร์ ขนนกยูง'
    : 'คำสอนคุณยายอาจารย์'
})

// Menu filtering by creator (matches original computed properties)
const menuLuangpor = computed((): MenuFeature[] => {
  return features.value.filter(x => x.creator === 1)
})

const menuYay = computed((): MenuFeature[] => {
  return features.value.filter(x => x.creator === 2)
})

const menuLuangPu = computed((): MenuFeature[] => {
  return features.value.filter(x => x.creator === 4)
})

// Methods
const navigateToFeature = (feature: MenuFeature): void => {

  // Track analytics
  analytics.trackEvent('home_menu_click', {
    menu_item: feature.title,
    creator: feature.creator,
    route: feature.routeTo
  })

  // Navigate to V2 routes with creator query parameter
  const targetPath = `/${feature.routeTo}`
  const targetQuery = { t: feature.creator.toString() }


  router.push({
    path: targetPath,
    query: targetQuery
  }).then(() => {
  }).catch((error) => {
    console.error('Navigation failed:', error)
  })
}

const getCreatorColor = (creator: number): string => {
  // Matches original returnColor method
  switch (creator) {
    case 1:
      return '#ff5679' // primary lighten-4 equivalent
    case 2:
      return '#42a5f5' // blue lighten-2 equivalent
    case 4:
      return '#f57c00' // yellow darken-2 equivalent
    default:
      return '#ff5679'
  }
}

const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, any> = {
    'mdi-book-open-page-variant': BookOutlined,
    'mdi-magnify': SearchOutlined,
    'mdi-image-multiple': PictureOutlined,
    'mdi-file-document-multiple': FileTextOutlined,
    'mdi-youtube': YoutubeOutlined
  }

  return iconMap[iconName] || BookOutlined
}

// Creator Navigation Functions
const toggleCreatorNav = (): void => {
  showCreatorNav.value = !showCreatorNav.value
}

const navigateToCreator = (creator: Creator): void => {

  // Track analytics
  analytics.trackEvent('creator_search_click', {
    creator_id: creator.id,
    creator_name: creator.shortName
  })

  // Navigate to search-page for the selected creator
  router.push({
    path: '/search-page',
    query: { t: creator.id.toString() }
  }).then(() => {
    showCreatorNav.value = false // Close the menu
  }).catch(error => {
    console.error('Creator search navigation failed:', error)
  })
}

// Lifecycle
onMounted(() => {
  // Track page view
  analytics.trackPageView({
    page_title: 'Home',
    page_path: '/'
  })
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap');

/* Global Styles */
.home-page {
  font-family: 'Sarabun', sans-serif;
  width: 100%;
  overflow-x: hidden;
}

.hero-section,
.main-section,
.yay-section {
  font-family: 'Sarabun', sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
}

.section-background {
  width: 100%;
}

/* Creator-specific backgrounds based on design answers */
.creator-1-section {
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%);
  background-image: url('/src/assets/blackground_search.jpg');
  background-size: cover;
  background-position: center;
  background-blend-mode: overlay;
  background-attachment: fixed;
}

.creator-2-section {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  background-image: url('https://i.imgur.com/PA4GVvR.jpeg');
  background-size: cover;
  background-position: center;
  background-blend-mode: overlay;
  background-attachment: fixed;
}

.creator-4-section {
  background: linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%);
  background-image: url('/src/assets/lp.jpg');
  background-size: cover;
  background-position: center;
  background-blend-mode: overlay;
  background-attachment: fixed;
}

.creator-1-bg,
.creator-2-bg,
.creator-4-bg {
  padding: 80px 40px;
  width: 100%;
  height: 100%;
  min-height: inherit;
}

@keyframes gradientShift {
  0% {
    background: linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%);
  }
  100% {
    background: linear-gradient(135deg, #ffcc02 0%, #ff8f00 100%);
  }
}

/* Content containers */
.section-content {
  max-width: 1200px;
  margin: 0 auto;
  align-items: center;
  min-height: 60vh;
}

/* Text sections */
.section-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

/* Titles */
.section-title {
  font-size: 3rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.8);
}

.section-subtitle {
  font-size: 2.5rem;
  font-weight: 600;
  color: #555;
  margin-bottom: 32px;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
}

/* Logo */
.main-logo {
  margin-bottom: 24px;
}

.logo-image {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

/* Menu sections */
.section-menu {
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu-grid {
  width: 100%;
  max-width: 500px;
}

/* Clickable wrapper */
.clickable-wrapper {
  cursor: pointer;
  width: 100%;
  height: 100%;
}

/* Menu cards with hover effects matching original */
.menu-card {
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.menu-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.creator-1-card {
  border: 2px solid transparent;
}

.creator-1-card:hover {
  border-color: #fc4b6c;
  background: rgba(255, 255, 255, 1);
}

.creator-2-card {
  border: 2px solid transparent;
}

.creator-2-card:hover {
  border-color: #42a5f5;
  background: rgba(255, 255, 255, 1);
}

.creator-4-card {
  border: 2px solid transparent;
}

.creator-4-card:hover {
  border-color: #f57c00;
  background: rgba(255, 255, 255, 1);
}

/* Menu card content */
.menu-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px;
}

.menu-icon {
  transition: transform 0.3s ease;
}

.menu-card:hover .menu-icon {
  transform: scale(1.2) rotate(5deg);
}

.menu-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Wave border */
.wave-border {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

.wave-border img {
  width: 100%;
  height: auto;
  display: block;
}

/* Gradient overlays for smooth transitions */
.gradient-overlay {
  position: absolute;
  left: 0;
  right: 0;
  height: 150px;
  z-index: 5;
  pointer-events: none;
}

.gradient-top {
  top: 0;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.4) 60%, transparent 100%);
}

.gradient-bottom {
  bottom: 0;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%);
}

/* Navigation anchor */
.page-anchor {
  position: fixed;
  right: 20px;
  z-index: 1000;
}

/* Responsive Design - Mobile changes layout */
@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
    text-align: center;
  }

  .section-subtitle {
    font-size: 1.5rem;
    text-align: center;
  }

  .creator-1-bg,
  .creator-2-bg,
  .creator-4-bg {
    padding: 40px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .creator-1-section,
  .creator-2-section,
  .creator-4-section {
    background-attachment: scroll; /* Better for mobile */
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .section-content {
    min-height: 50vh;
    flex-direction: column;
    text-align: center; /* Center content on mobile */
    justify-content: center;
    align-items: center;
    padding: 0 16px; /* Add horizontal padding */
    display: flex;
    width: 100%;
  }

  .section-text {
    margin-bottom: 32px;
    width: 100%;
    text-align: center;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
  }

  .section-titles {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .main-logo {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 24px;
  }

  .section-menu {
    width: 100%;
    justify-content: center;
    align-items: center;
    display: flex;
  }

  .menu-title {
    font-size: 13px;
    text-align: center;
  }

  .menu-grid {
    max-width: 400px;
    width: 100%;
    margin: 0 auto; /* Center the menu grid */
    display: flex;
    justify-content: center;
  }

  .menu-card-header {
    justify-content: center;
    text-align: center;
  }

  /* Mobile responsive - text on top, menu below for each section */
  .section-text {
    order: 1;
  }

  .section-menu {
    order: 2;
  }

  /* Ensure grid items are centered */
  .book-item {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1.5rem;
    text-align: center;
  }

  .section-subtitle {
    font-size: 1.2rem;
    text-align: center;
  }

  .menu-title {
    font-size: 12px;
    text-align: center;
  }

  .creator-1-bg,
  .creator-2-bg,
  .creator-4-bg {
    padding: 20px 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .creator-1-section,
  .creator-2-section,
  .creator-4-section {
    background-attachment: scroll; /* Better for mobile */
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .section-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
  }

  .section-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
  }

  .section-menu {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .menu-grid {
    display: flex;
    justify-content: center;
    max-width: 300px;
    margin: 0 auto;
  }
}

/* Information Section */
.info-section {
  padding: 80px 40px;
  background:
    linear-gradient(135deg, #f5f5f5 100%, #e0e0e0 50%),
    url('@/assets/wave2.svg');
  background-size: cover;
  background-position: center;
  background-blend-mode: overlay;
  background-attachment: fixed;
  font-family: 'Sarabun', sans-serif;
}

.info-background {
  background: transparent;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.info-content {
  max-width: 1200px;
  width: 100%;
}

.info-card {
  background: transparent;
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.info-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  text-align: center;
  font-family: 'Sarabun', sans-serif;
  margin: 0;
}

.info-text {
  padding: 16px 0;
}

.info-paragraph {
  font-size: 1.1rem;
  text-align: center;
  line-height: 1.8;
  color: #555;
  margin-bottom: 16px;
  font-family: 'Sarabun', sans-serif;
}

/* Footer Section */
.footer-section {
  padding: 10px;
  margin-top: 10px;
  background: #333;
  color: white;
  text-align: center;
  font-family: 'Sarabun', sans-serif;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-text {
  font-size: 14px;
  color: #ccc;
  font-family: 'Sarabun', sans-serif;
}

/* Bottom Wave */
.bottom-wave {
  position: relative;
  z-index: 10;
}

.bottom-wave img {
  width: 100%;
  height: auto;
  display: block;
}

/* Mobile adjustments for new sections */
@media (max-width: 768px) {
  .info-section {
    padding: 40px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .info-content {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .info-title {
    font-size: 1.5rem;
    text-align: center;
  }

  .info-text {
    text-align: center;
  }

  .footer-section {
    padding: 24px 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .footer-content {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
}
</style>