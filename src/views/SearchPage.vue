<template>
  <div class="search-page">
    <div class="search-background" :style="{ backgroundImage: `url(${backgroundImage})` }">
      <div class="search-overlay">
        <!-- Navigation Header -->
        <div class="nav-header">
          <div v-if="!isMobile" class="nav-desktop">
            <n-button v-if="isHomePage" text @click="navigateTo('/cards')" class="nav-button">
              <template #icon>
                <n-icon>
                  <CreditCardOutlined />
                </n-icon>
              </template>
              การ์ดธรรมะ
            </n-button>
            <n-button v-else text @click="navigateTo('/')" class="nav-button">
              <template #icon>
                <n-icon>
                  <HomeOutlined />
                </n-icon>
              </template>
              หน้าหลัก
            </n-button>
            <n-button text @click="navigateTo('/books')" class="nav-button">
              <template #icon>
                <n-icon>
                  <BookOutlined />
                </n-icon>
              </template>
              หนังสือธรรมะ
            </n-button>
            <n-button text @click="navigateTo('/about')" class="nav-button">
              <template #icon>
                <n-icon>
                  <InfoCircleOutlined />
                </n-icon>
              </template>
              เกี่ยวกับ
            </n-button>
          </div>
          <div v-else class="nav-mobile">
            <n-dropdown :options="mobileMenuOptions" @select="handleMobileMenuSelect" placement="bottom-start">
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
            <div class="logo-container" v-if="creatorId === '1'">
              <n-image :src="logo1" :alt="'Logo'" width="150" height="150" object-fit="contain"
                class="creator-logo" />
            </div>

            <h1 class="search-title">{{ headingTitle }}</h1>

            <div class="search-form">
              <n-form>
                <n-form-item>
                  <n-input-group>
                    <n-auto-complete
                      v-model:value="keywordInput"
                      :options="keywordOptions"
                      @select="handleKeywordSelect"
                      clearable
                      clear-after-select
                      size="medium"
                    >
                      <template #default="{ handleInput, handleBlur, handleFocus, value: slotValue }">
                        <div class="tags-input-container" :class="{ 'has-tags': searchKeywords.length > 0 }">
                          <!-- Selected tags inside input -->
                          <n-tag
                            v-for="(keyword, index) in searchKeywords"
                            :key="keyword"
                            size="medium"
                            :color="colourTags"
                            round
                            closable
                            @close="removeKeyword(index)"
                          >
                            {{ keyword }}
                          </n-tag>

                          <!-- Actual input for new keywords -->
                          <input
                            ref="inputRef"
                            :value="slotValue"
                            :placeholder="searchKeywords.length > 0 ? '' : searchPlaceholder"
                            @input="(e) => handleInput((e.target as HTMLInputElement).value)"
                            @blur="handleBlur"
                            @focus="handleFocus"
                            @keydown.enter="addKeywordFromInput"
                            @keydown.backspace="handleBackspace"
                            class="tag-input"
                          />
                        </div>
                      </template>
                    </n-auto-complete>
                    <n-button v-if="searchKeywords.length > 0" @click="clearSearch" type="info" quaternary size="large"
                      class="clear-button">
                      <template #icon>
                        <n-icon>
                          <CloseCircleOutlined />
                        </n-icon>
                      </template>
                    </n-button>
                  </n-input-group>
                </n-form-item>

                <n-space justify="center">
                  <n-button type="primary" @click="performSearch" :loading="searching || undefined"
                    :disabled="!canSearch || undefined" class="search-button">
                    <template #icon>
                      <n-icon>
                        <SearchOutlined />
                      </n-icon>
                    </template>
                    ค้นหา
                  </n-button>

                  <n-button type="primary" @click="performRandomSearch" :loading="randomSearching || undefined"
                    class="random-button">
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
    <n-modal v-model:show="randomModal.visible" preset="card" title="อ่านอะไรดี" class="random-modal"
      :style="{ width: '90vw', maxWidth: '800px' }">
      <div v-if="randomModal.content" class="random-content">
        <h3 class="random-title">{{ randomModal.content.chapterHeading }}</h3>

        <div class="random-book-info">
          <n-button text type="primary" @click="navigateToBook(randomModal.content.bookId)" class="book-link">
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
import { refDebounced } from '@vueuse/core'
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
import logo1 from '@/assets/logo1.png'

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


// Composables
const route = useRoute()
const router = useRouter()
const message = useMessage()
const searchStore = useSearchStore()
const analytics = useAnalytics()

// Reactive data
const searchKeywords = ref<string[]>([])
const keywordInput = ref<string>('')
const debouncedKeywordInput = refDebounced(keywordInput, 300)
const searching = ref<boolean>(false)
const randomSearching = ref<boolean>(false)
const inputRef = ref<HTMLInputElement | null>(null)
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

const colourTags = computed((): any => {
  switch (creatorId.value) {
    case '1':
      return { color: '#fed5da', textColor: '#522830', borderColor: '#fda4b4' }
    case '2':
      return { color: '#c5e3f5', textColor: '#0d58a0', borderColor: '#64b5f6' }
    case '4':
      return { color: '#f4e0a4', textColor: '#4B4123', borderColor: '#ECD99E' }
    default:
      return { color: '#fed5da', textColor: '#522830', borderColor: '#fda4b4' }
  }
})

const searchPlaceholder = computed((): string => {
  const type = route.name === 'CardsV2' ? 'การ์ด' : 'หนังสือ'
  return `ค้นหาคำสอน (${type})`
})


const canSearch = computed((): boolean => {
  return searchKeywords.value.length > 0
})

// Pre-defined common dharma terms for autocomplete
const DHARMA_SUGGESTIONS = [
  'พระพุทธเจ้า', 'ธรรมะ', 'สังฆะ', 'สติ', 'ปัญญา',
  'เมตตา', 'กรุณา', 'มุทิตา', 'อุเบกขา', 'ความเพียร',
  'สมาธิ', 'วิปัสสนา', 'กรรม', 'นิพพาน'
]

const keywordOptions = computed(() => {
  const input = debouncedKeywordInput.value?.trim()

  // When input is empty, show search history
  if (!input) {
    const history = searchStore.getSearchHistory
    if (history.length === 0) return []

    return history.map((entry, index) => ({
      label: `${entry.keywords.join(', ')}`,
      value: `__history__${index}__${entry.keywords.join('|')}`
    }))
  }

  const options = []

  // Add current input as first option
  if (!searchKeywords.value.includes(input)) {
    options.push({
      label: `"${input}" (พิมพ์แล้วกด Enter)`,
      value: input
    })
  }

  // Show matching history entries
  const inputLower = input.toLowerCase()
  const history = searchStore.getSearchHistory
  let historyCount = 0

  for (const entry of history) {
    if (historyCount >= 3) break
    const joined = entry.keywords.join(', ')
    if (joined.toLowerCase().includes(inputLower)) {
      const val = `__history__${historyCount}__${entry.keywords.join('|')}`
      options.push({ label: `${joined}`, value: val })
      historyCount++
    }
  }

  // Filter suggestions efficiently
  let suggestionCount = 0

  for (const word of DHARMA_SUGGESTIONS) {
    if (suggestionCount >= 4) break

    if (word.toLowerCase().includes(inputLower) &&
        !searchKeywords.value.includes(word) &&
        word !== input) {
      options.push({ label: word, value: word })
      suggestionCount++
    }
  }

  return options
})

const mobileMenuOptions = computed(() => {
  const options: any[] = []

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
  // Handle history entry selection
  if (value.startsWith('__history__')) {
    const keywords = value.split('__').pop()?.split('|') || []
    searchKeywords.value = keywords.filter(k => k.trim())
    keywordInput.value = ''
    // Auto-search when selecting from history
    performSearch()
    return
  }

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

const handleBackspace = (event: KeyboardEvent): void => {
  // If input is empty and backspace is pressed, remove the last keyword
  if (keywordInput.value === '' && searchKeywords.value.length > 0) {
    event.preventDefault()
    searchKeywords.value.pop()
  }
}

const performSearch = async (): Promise<void> => {
  if (!canSearch.value) {
    message.warning('กรุณาใส่คำที่ต้องการค้นหา')
    return
  }

  searching.value = true
  try {
    // Save to search history
    searchStore.addToSearchHistory(searchKeywords.value)

    // Navigate to search results — Search.vue will handle the API call
    const queryParams: Record<string, string> = {
      t: creatorId.value
    }

    searchKeywords.value.forEach((keyword, index) => {
      if (index < 5) {
        queryParams[`word${index + 1}`] = keyword
      }
    })

    await router.push({
      path: '/search',
      query: queryParams
    })

  } catch {
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

  } catch {
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
    path: `/book/${bookId}`,
    query: { t: creatorId.value }
  })
  window.open(bookUrl.href, '_blank')
}

const handleMobileMenuSelect = (key: string): void => {
  switch (key) {
    case 'cards':
      navigateTo('/cards')
      break
    case 'home':
      navigateTo('/')
      break
    case 'books':
      navigateTo('/books')
      break
    case 'about':
      navigateTo('/about')
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
})
</script>

<style scoped>

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
  background: transparent;
  border-radius: 8px;
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

/* Inline Tags Input Styling */
.tags-input-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  padding: 10px 16px;
  min-height: 44px;
  max-height: 120px;
  overflow-y: auto;
  background: white;
  border-radius: 22px;
  border: 2px solid #e6e6e6;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  width: 100%;
}

.tags-input-container:focus-within {
  border-color: #1890ff;
  box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.15);
}

.tag-input {
  border: none;
  outline: none;
  flex: 1;
  min-width: 100px;
  background: transparent;
  font-size: 16px;
  font-family: 'Sarabun', sans-serif;
  color: #333;
  line-height: 1.5;
}

.tag-input::placeholder {
  color: #999;
  font-family: 'Sarabun', sans-serif;
}

/* Input Group Styling */
.keyword-input {
  flex: 1;
  min-width: 0;
}

.clear-button {
  margin-left: 8px;
  height: 44px;
  border-radius: 22px;
  min-width: 44px;
  padding: 0 12px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
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

  /* Mobile responsive for inline tags */
  .tags-input-container {
    padding: 8px 14px;
    min-height: 40px;
    border-radius: 20px;
  }

  .clear-button {
    height: 40px;
    border-radius: 20px;
    min-width: 40px;
    padding: 0 10px;
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