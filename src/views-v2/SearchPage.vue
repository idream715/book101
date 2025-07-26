<template>
  <div class="search-page">
    <div
      class="search-background"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
    >
      <div class="search-overlay">
        <!-- Navigation Header -->
        <div class="nav-header">
          <div v-if="!isMobile" class="nav-desktop">
            <n-button
              v-if="isHomePage"
              text
              @click="navigateTo('/v2/cards')"
              class="nav-button"
            >
              <template #icon>
                <n-icon>
                  <CreditCardOutlined />
                </n-icon>
              </template>
              การ์ดธรรมะ
            </n-button>
            <n-button
              v-else
              text
              @click="navigateTo('/v2')"
              class="nav-button"
            >
              <template #icon>
                <n-icon>
                  <HomeOutlined />
                </n-icon>
              </template>
              หน้าหลัก
            </n-button>
            <n-button
              text
              @click="navigateTo('/v2/books')"
              class="nav-button"
            >
              <template #icon>
                <n-icon>
                  <BookOutlined />
                </n-icon>
              </template>
              หนังสือธรรมะ
            </n-button>
            <n-button
              text
              @click="navigateTo('/v2/about')"
              class="nav-button"
            >
              <template #icon>
                <n-icon>
                  <InfoCircleOutlined />
                </n-icon>
              </template>
              เกี่ยวกับ
            </n-button>
          </div>
          <div v-else class="nav-mobile">
            <n-dropdown
              :options="mobileMenuOptions"
              @select="handleMobileMenuSelect"
              placement="bottom-start"
            >
              <n-button text class="mobile-menu-button">
                <template #icon>
                  <n-icon>
                    <MoreOutlined />
                  </n-icon>
                </template>
              </n-button>
            </n-dropdown>
          </div>
        </div>

        <!-- Main Search Content -->
        <div class="search-content">
          <div class="search-header">
            <div class="logo-container">
              <n-image
                v-if="creatorId === '1'"
                :src="'/src/assets/logo1.png'"
                :alt="'Logo'"
                width="150"
                height="150"
                object-fit="contain"
                class="creator-logo"
              />
              <div v-else class="logo-placeholder"></div>
            </div>

            <h1 class="search-title">{{ headingTitle }}</h1>

            <div class="search-form">
              <n-form>
                <n-form-item>
                  <n-input-group>
                    <n-auto-complete
                      v-model:value="keywordInput"
                      :options="keywordOptions"
                      :placeholder="searchPlaceholder"
                      class="keyword-input"
                      @select="handleKeywordSelect"
                      @keydown.enter="addKeywordFromInput"
                      @blur="addKeywordFromInput"
                      clearable
                      clear-after-select
                    />
                    <n-button
                      v-if="searchKeywords.length > 0"
                      @click="clearSearch"
                      type="primary"
                      ghost
                      class="clear-button"
                    >
                      <template #icon>
                        <n-icon>
                          <CloseCircleOutlined />
                        </n-icon>
                      </template>
                    </n-button>
                  </n-input-group>
                </n-form-item>

                <!-- Keyword Tags Display -->
                <n-card
                  v-if="searchKeywords.length > 0"
                  class="keyword-tags"
                  size="small"
                  :bordered="false"
                >
                   คำที่จะค้นหา:
                  <n-tag
                    v-for="(keyword, index) in searchKeywords"
                    :key="keyword"
                    type="primary"
                    closable
                    @close="removeKeyword(index)"
                    class="keyword-tag"
                  >
                    {{ keyword }}
                  </n-tag>
                </n-card>

                <n-space class="search-buttons-panel">
                  <n-button
                    type="primary"
                    @click="performSearch"
                    :loading="searching || undefined"
                    :disabled="!canSearch || undefined"
                    class="search-button"
                  >
                    <template #icon>
                      <n-icon>
                        <SearchOutlined />
                      </n-icon>
                    </template>
                    ค้นหา
                  </n-button>

                  <n-button
                    type="primary"
                    @click="performRandomSearch"
                    :loading="randomSearching || undefined"
                    class="random-button"
                  >
                    <template #icon>
                      <n-icon>
                        <Shuffle />
                      </n-icon>
                    </template>
                    อ่านอะไรดี
                  </n-button>
                </n-space>
              </n-form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Random Search Result Modal -->
    <n-modal
      v-model:show="randomModal.visible"
      preset="card"
      title="อ่านอะไรดี"
      class="random-modal"
      :style="{ width: '90vw', maxWidth: '800px' }"
    >
      <div v-if="randomModal.content" class="random-content">
        <h3 class="random-title">{{ randomModal.content.chapterHeading }}</h3>

        <div class="random-book-info">
          <n-button
            text
            type="primary"
            @click="navigateToBook(randomModal.content.bookId)"
            class="book-link"
          >
            <template #icon>
              <n-icon>
                <BookOutlined />
              </n-icon>
            </template>
            จากหนังสือ: {{ randomModal.content.bookName }}
          </n-button>
        </div>

        <div class="random-detail">
          <p>{{ randomModal.content.chapterDetail }}</p>
        </div>
      </div>

      <template #footer>
        <n-space justify="end">
          <n-button @click="performRandomSearch" :loading="randomSearching || undefined">
            สุ่มอ่าน
          </n-button>
          <n-button type="primary" @click="closeRandomModal">
            ออก
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import {
  SearchOutlined,
  CreditCardOutlined,
  HomeOutlined,
  BookOutlined,
  InfoCircleOutlined,
  MoreOutlined,
  CloseCircleOutlined
} from '@vicons/antd'
import { Shuffle } from '@vicons/ionicons5'
import { useSearchStore } from '@/stores/search'
import { useAnalytics } from '@/composables/useAnalytics'

// Types
interface RandomContent {
  chapterHeading: string
  bookName: string
  bookId: string
  chapterDetail: string
}

interface RandomModal {
  visible: boolean
  content: RandomContent | null
}

console.log('SearchPageV2 (Naive UI) component loaded!')

// Composables
const route = useRoute()
const router = useRouter()
const message = useMessage()
const searchStore = useSearchStore()
const analytics = useAnalytics()

// Reactive data
const searchKeywords = ref<string[]>([])
const keywordInput = ref<string>('')
const searching = ref<boolean>(false)
const randomSearching = ref<boolean>(false)
const randomModal = ref<RandomModal>({
  visible: false,
  content: null
})

// Computed properties
const creatorId = computed((): string => (route.query.t as string) || '1')

const isMobile = computed((): boolean => {
  // Simple mobile detection - in production, use proper responsive breakpoints
  return window.innerWidth < 768
})

const isHomePage = computed((): boolean => {
  return route.name === 'SearchPageV2' || route.name === 'HomeV2'
})

const backgroundImage = computed((): string => {
  switch (creatorId.value) {
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

const headingTitle = computed((): string => {
  switch (creatorId.value) {
    case '1':
      return 'หนังสือคุณครูไม่ใหญ่'
    case '2':
      return 'หนังสือคุณยายอาจารย์'
    case '4':
      return 'มรดกธรรมคำสอนพระมงคลเทพมุนี'
    default:
      return 'หนังสือคุณครูไม่ใหญ่'
  }
})

const searchPlaceholder = computed((): string => {
  const type = route.name === 'CardsV2' ? 'การ์ด' : 'หนังสือ'
  return `ค้นหาคำสอน (${type})`
})


const canSearch = computed((): boolean => {
  return searchKeywords.value.length > 0
})

const keywordOptions = computed(() => {
  if (!keywordInput.value) return []

  const input = keywordInput.value.trim()
  const options = []

  // Add current input as first option if it's not already in keywords and not empty
  if (input && !searchKeywords.value.includes(input) && input.length > 0) {
    options.push({
      label: `"${input}" (พิมพ์แล้วกด Enter)`,
      value: input
    })
  }

  // Generate autocomplete suggestions based on input
  const suggestions = [
    'พระพุทธเจ้า',
    'ธรรมะ',
    'สังฆะ',
    'สติ',
    'ปัญญา',
    'เมตตา',
    'กรุณา',
    'มุทิตา',
    'อุเบกขา',
    'ความเพียร',
    'สมาธิ',
    'วิปัสสนา',
    'กรรม',
    'นิพพาน'
  ].filter(word =>
    word.toLowerCase().includes(input.toLowerCase()) &&
    !searchKeywords.value.includes(word) &&
    word !== input
  )

  // Add suggestions
  suggestions.slice(0, 4).forEach(suggestion => {
    options.push({
      label: suggestion,
      value: suggestion
    })
  })

  return options
})

const mobileMenuOptions = computed(() => {
  const options = []

  if (isHomePage.value) {
    options.push({
      label: 'การ์ดธรรมะ',
      key: 'cards',
      icon: () => h(CreditCardOutlined)
    })
  } else {
    options.push({
      label: 'หน้าหลัก',
      key: 'home',
      icon: () => h(HomeOutlined)
    })
  }

  options.push(
    {
      label: 'หนังสือธรรมะ',
      key: 'books',
      icon: () => h(BookOutlined)
    },
    {
      label: 'เกี่ยวกับ',
      key: 'about',
      icon: () => h(InfoCircleOutlined)
    }
  )

  return options
})

// Methods
const handleKeywordSelect = (value: string): void => {
  addKeyword(value)
  // Force clear the input after selection with a small delay
  setTimeout(() => {
    keywordInput.value = ''
  }, 10)
}

const addKeyword = (value: string): void => {
  // Remove the suggestion text if it exists
  const cleanValue = value.replace(/ \(พิมพ์แล้วกด Enter\)$/, '').replace(/^"/, '').replace(/"$/, '').trim()

  if (!cleanValue || searchKeywords.value.includes(cleanValue)) {
    keywordInput.value = '' // Clear input even if keyword already exists
    return
  }

  if (searchKeywords.value.length >= 5) {
    message.warning('สามารถค้นหาได้สูงสุด 5 คำเท่านั้น')
    keywordInput.value = '' // Clear input when limit reached
    return
  }

  searchKeywords.value.push(cleanValue)
  keywordInput.value = '' // Clear input after successful addition
}

const addKeywordFromInput = (): void => {
  if (keywordInput.value.trim()) {
    addKeyword(keywordInput.value.trim())
  }
}

const removeKeyword = (index: number): void => {
  searchKeywords.value.splice(index, 1)
}

const clearSearch = (): void => {
  searchKeywords.value = []
  keywordInput.value = ''
}

const performSearch = async (): Promise<void> => {
  if (!canSearch.value) {
    message.warning('กรุณาใส่คำที่ต้องการค้นหา')
    return
  }

  searching.value = true
  try {
    // Convert keywords to search format
    const searchWords = searchKeywords.value.map(keyword => ({
      text: keyword,
      color: 'primary'
    }))

    // Perform search via store
    await searchStore.setFirstIndexsFromApi({
      words: searchWords,
      page: 0,
      creator: parseInt(creatorId.value),
      type: 'books'
    })

    // Track search analytics
    analytics.trackSearch({
      keywords: searchKeywords.value,
      searchType: 'content',
      creatorId: parseInt(creatorId.value),
      resultCount: searchStore.search_indexs?.length || 0
    })

    // Navigate to search results with keywords as URL parameters
    const queryParams: Record<string, string> = {
      t: creatorId.value
    }

    // Add keywords as word1, word2, etc. parameters
    searchKeywords.value.forEach((keyword, index) => {
      if (index < 5) {
        queryParams[`word${index + 1}`] = keyword
      }
    })

    await router.push({
      path: '/v2/search',
      query: queryParams
    })

    console.log('Search performed:', {
      keywords: searchKeywords.value,
      creatorId: creatorId.value
    })
  } catch (error) {
    console.error('Search error:', error)
    message.error('เกิดข้อผิดพลาดในการค้นหา')
  } finally {
    searching.value = false
  }
}

const performRandomSearch = async (): Promise<void> => {
  randomSearching.value = true
  try {
    await searchStore.setSearchRandom({
      creator: creatorId.value
    })

    const randomResult = searchStore.search_random
    console.log('Random search result:', randomResult)
    
    if (randomResult && randomResult.length > 0) {
      randomModal.value.content = randomResult[0]
      randomModal.value.visible = true
      
      // Track random search analytics
      analytics.trackSearch({
        keywords: ['random'],
        searchType: 'random',
        creatorId: parseInt(creatorId.value),
        resultCount: 1
      })
    } else {
      message.warning('ไม่พบข้อมูลสำหรับสุ่มอ่าน')
    }

    console.log('Random search performed:', {
      creatorId: creatorId.value,
      result: randomResult,
      modalContent: randomModal.value.content
    })
  } catch (error) {
    console.error('Random search error:', error)
    message.error('เกิดข้อผิดพลาดในการสุ่มอ่าน')
  } finally {
    randomSearching.value = false
  }
}

const navigateTo = (path: string): void => {
  router.push({
    path,
    query: { t: creatorId.value }
  })
}

const navigateToBook = (bookId: string): void => {
  const bookUrl = router.resolve({
    path: `/v2/book/${bookId}`,
    query: { t: creatorId.value }
  })
  window.open(bookUrl.href, '_blank')
}

const handleMobileMenuSelect = (key: string): void => {
  switch (key) {
    case 'cards':
      navigateTo('/v2/cards')
      break
    case 'home':
      navigateTo('/v2')
      break
    case 'books':
      navigateTo('/v2/books')
      break
    case 'about':
      navigateTo('/v2/about')
      break
  }
}

const closeRandomModal = (): void => {
  randomModal.value.visible = false
  randomModal.value.content = null
}

// Lifecycle
onMounted(() => {
  searchStore.clear()
  console.log('SearchPageV2 mounted with creator:', creatorId.value)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap');

.search-page {
  font-family: 'Sarabun', sans-serif;
}

.search-background {
  position: relative;
  width: 100%;
  height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.search-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(255,255,255, 0.5), rgba(255,255,255, 0.2));
  display: flex;
  flex-direction: column;
}

.nav-header {
  padding: 16px 24px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.nav-desktop {
  display: flex;
  gap: 16px;
}

.nav-button {
  color: white;
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-mobile {
  display: flex;
  align-items: center;
}

.mobile-menu-button {
  color: white;
  font-size: 20px;
}

.search-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
}

.search-header {
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.logo-container {
  margin-bottom: 24px;
}

.creator-logo {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.logo-placeholder {
  width: 150px;
  height: 150px;
  margin: 0 auto;
}

.search-title {
  color: white;
  text-shadow: 2px 2px 8px rgba(68, 68, 68, 0.8);
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 32px;
  line-height: 1.2;
}

.search-form {
  margin-bottom: 32px;
}

.search-input {
  width: 100%;
  margin-bottom: 16px;
}

.search-buttons-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.search-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
}

/* Keyword Input and Tags */
.keyword-input {
  flex: 1;
}

.clear-button {
  margin-left: 8px;
}

.keyword-tags {
  display: flex;
  background-color: transparent;
  flex-wrap: wrap;
  color: black;
  gap: 8px;
  margin-bottom: 8px;
}

.keyword-tag {
  font-family: 'Sarabun', sans-serif;
  font-size: 13px;
}

.search-button,
.random-button {
  font-family: 'Sarabun', sans-serif;
  font-weight: 500;
  color: white;
  padding: 0 24px;
  height: 40px;
}

.random-button {
  background-color: #1890ff;
  border-color: #1890ff;
}

.random-button:hover {
  background-color: #40a9ff;
  border-color: #40a9ff;
}

/* Modal Styles */
.random-modal {
  font-family: 'Sarabun', sans-serif;
}

.random-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.random-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.random-book-info {
  display: flex;
  align-items: center;
}

.book-link {
  font-size: 14px;
  color: #1890ff;
}

.random-detail {
  margin-top: 16px;
}

.random-detail p {
  font-size: 16px;
  line-height: 1.6;
  color: #555;
  margin: 0;
  white-space: pre-wrap;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .nav-header {
    padding: 12px 16px;
  }

  .search-content {
    padding: 0 16px;
  }

  .search-title {
    font-size: 1.5rem;
    margin-bottom: 24px;
  }

  .search-buttons {
    flex-direction: column;
    align-items: center;
  }

  .search-button,
  .random-button {
    width: 100%;
    max-width: 200px;
  }

  .random-modal {
    width: 95vw !important;
  }
}

@media (max-width: 480px) {
  .search-title {
    font-size: 1.25rem;
  }

  .logo-container {
    margin-bottom: 16px;
  }

  .creator-logo {
    width: 120px;
    height: 120px;
  }

  .logo-placeholder {
    width: 120px;
    height: 120px;
  }
}
</style>