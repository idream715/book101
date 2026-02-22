<template>
  <AppLayout>
    <ContentLayout
      title="🔍 ผลการค้นหา"
      :description="searchDescription"
      :loading="loading ? true : undefined"
      loading-text="กำลังค้นหา..."
    >
      <!-- Search Form -->
      <n-card class="search-form-card mb-6">
        <n-form>
          <n-form-item label="ค้นหาคำสอน">
            <n-input-group>
              <n-auto-complete
                v-model:value="keywordInput"
                :options="keywordOptions"
                @select="handleKeywordSelect"
                clearable
                clear-after-select
              >
                <template #default="{ handleInput, handleBlur, handleFocus, value: slotValue }">
                  <div class="tags-input-container" :class="{ 'has-tags': searchKeywords.length > 0 }">
                    <!-- Selected tags inside input -->
                    <n-tag
                      v-for="(keyword, index) in searchKeywords"
                      :key="keyword"
                      type="info"
                      closable
                      @close="removeKeyword(index)"
                    >
                      {{ keyword }}
                    </n-tag>

                    <!-- Actual input for new keywords -->
                    <input
                      ref="inputRef"
                      :value="slotValue"
                      :placeholder="searchKeywords.length > 0 ? '' : 'พิมพ์คำค้นหา...'"
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
              <n-button
                v-if="searchKeywords.length > 0"
                @click="clearSearch"
                type="error"
                class="clear-button"
                quaternary
              >
                <template #icon>
                  <n-icon>
                    <CloseCircleOutlined />
                  </n-icon>
                </template>
              </n-button>
            </n-input-group>
          </n-form-item>

          <n-space justify="end">
            <n-button
              type="primary"
              @click="performSearch"
              :loading="searching ? true : undefined"
              :disabled="!canSearch ? true : undefined"
              class="search-button"
            >
              <template #icon>
                <n-icon>
                  <SearchOutlined />
                </n-icon>
              </template>
              ค้นหา
            </n-button>
          </n-space>
        </n-form>
      </n-card>

      <!-- Search Results Stats -->
      <div v-if="!loading && searchResults.length > 0" class="search-stats mb-4">
        <n-text depth="3">
          พบ {{ totalResults }} รายการ
        </n-text>
      </div>

      <!-- Search Results with Infinite Scroll -->
      <n-infinite-scroll
        v-if="!loading && searchResults.length > 0"
        :distance="300"
        @load="loadMoreResults"
        :loading="infiniteScrollLoading || undefined"
        class="search-results"
      >
        <div
          v-for="(result, index) in searchResults"
          :key="index"
          class="search-result-item"
        >
          <n-card hoverable class="result-card">
            <div class="result-content">
              <div class="result-header">
                <h3 class="result-title">
                  <n-highlight
                    :text="result.mark_index"
                    :patterns="expandedSearchPatterns"
                  />
                </h3>
                <span class="result-number">{{ index + 1 }}</span>
              </div>

              <div class="result-book-info">
                <n-button
                  text
                  type="primary"
                  @click="navigateToBook(result.bookId)"
                  class="book-link"
                >
                  <template #icon>
                    <n-icon>
                      <BookOutlined />
                    </n-icon>
                  </template>
                  <span>
                    จากหนังสือ:
                    <n-highlight
                      :text="result.bookName"
                      :patterns="expandedSearchPatterns"
                    />
                  </span>
                </n-button>
              </div>

              <div class="result-excerpt">
                <div class="excerpt-content">
                  <n-highlight
                    :text="result.mark_details"
                    :patterns="expandedSearchPatterns"
                  />
                </div>
              </div>

              <div class="result-actions">
                <n-space>
                  <n-button
                    v-if="result.chapterLinkYouTube && result.chapterLinkYouTube.length > 0"
                    @click="showYouTubeModal(result.chapterLinkYouTube)"
                    type="error"
                    ghost
                    class="youtube-button"
                  >
                    <template #icon>
                      <n-icon>
                        <YoutubeOutlined />
                      </n-icon>
                    </template>
                    YouTube
                  </n-button>

                  <n-button
                    v-if="checkPdfLink(result.chapterLinkPdf)"
                    @click="openPdf(result.chapterLinkPdf)"
                    type="error"
                    ghost
                    class="pdf-button"
                  >
                    <template #icon>
                      <n-icon>
                        <FilePdfOutlined />
                      </n-icon>
                    </template>
                    PDF
                  </n-button>

                  <n-button
                    @click="openDetailModal(result)"
                    secondary
                    strong
                    type="primary"
                    class="detail-button"
                  >
                    <template #icon>
                      <n-icon>
                        <EyeOutlined />
                      </n-icon>
                    </template>
                    อ่านทั้งหมด
                  </n-button>
                </n-space>
              </div>
            </div>
          </n-card>
        </div>

        <!-- Loading indicator -->
        <template #loading>
          <div class="infinite-loading">
            <n-spin size="medium" />
            <n-text depth="3" class="loading-text">
              {{ infiniteScrollLoading ? 'กำลังโหลดผลลัพธ์เพิ่มเติม...' : 'เลื่อนลงเพื่อดูผลลัพธ์เพิ่มเติม' }}
            </n-text>
            <n-text v-if="searchResults.length > 0" depth="3" class="loading-stats">
              แสดงแล้ว {{ searchResults.length }} / {{ totalResults }} รายการ
            </n-text>
          </div>
        </template>
      </n-infinite-scroll>

      <!-- Loading Skeleton -->
      <div v-if="loading" class="loading-skeleton">
        <n-card v-for="i in 5" :key="i" class="skeleton-card mb-4">
          <n-skeleton text :repeat="4" />
          <n-skeleton text style="width: 60%" />
          <n-skeleton text style="width: 30%" />
        </n-card>
      </div>

      <!-- Empty State -->
      <n-empty
        v-if="!loading && searchResults.length === 0 && hasSearched"
        description="ไม่พบผลลัพธ์ที่ค้นหา"
        class="empty-state"
      >
        <template #extra>
          <div class="empty-suggestions">
            <n-text tag="div" class="mb-3">
              คำค้นหาของคุณไม่ตรงกับเอกสารใดๆ
            </n-text>
            <n-text
              v-for="(keyword, i) in searchKeywords"
              :key="i"
              type="error"
              class="keyword-display"
            >
              - {{ keyword }}
            </n-text>
            <div class="suggestions">
              <n-text tag="div" class="suggestions-title">คำแนะนำ:</n-text>
              <n-text tag="div">- ตรวจดูให้แน่ใจว่าสะกดถูกต้องทุกคำ</n-text>
              <n-text tag="div">- ลองใช้คำอื่นๆ</n-text>
              <n-text tag="div">- ลองใช้คำที่กว้างขึ้น</n-text>
              <n-text tag="div">- ลองใช้คำที่น้อยลง</n-text>
            </div>
          </div>
        </template>
      </n-empty>

    </ContentLayout>

    <!-- Detail Modal -->
    <n-modal
      v-model:show="detailModal.visible"
      preset="card"
      :title="detailModal.title"
      class="detail-modal"
      :style="{ width: '90vw', maxWidth: '900px' }"
    >
      <div v-if="detailModal.content" class="detail-content">
        <div class="detail-header">
          <h3>
            <n-highlight
              :text="detailModal.content.mark_index"
              :patterns="expandedSearchPatterns"
            />
          </h3>
          <div class="detail-book-info">
            <n-button
              text
              type="primary"
              @click="navigateToBook(detailModal.content.bookId)"
              class="book-link"
            >
              <template #icon>
                <n-icon>
                  <BookOutlined />
                </n-icon>
              </template>
              <span>
                จากหนังสือ:
                <n-highlight
                  :text="detailModal.content.bookName"
                  :patterns="expandedSearchPatterns"
                />
              </span>
            </n-button>
          </div>
        </div>

        <div class="detail-text">
          <n-highlight
            :text="detailModal.content.mark_details"
            :patterns="expandedSearchPatterns"
          />
        </div>
      </div>

      <template #footer>
        <n-space justify="end">
          <n-button @click="copyDetailText" type="primary" ghost>
            <template #icon>
              <n-icon>
                <CopyOutlined />
              </n-icon>
            </template>
            {{ copyButtonText }}
          </n-button>
          <n-button @click="closeDetailModal" secondary type="error">
            <template #icon>
              <n-icon><CloseCircleOutlined /></n-icon>
            </template>
            ออก
          </n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- YouTube Modal -->
    <n-modal
      v-model:show="youtubeModal.visible"
      preset="card"
      title="YouTube"
      class="youtube-modal"
      :style="{ width: '90vw', maxWidth: '700px' }"
    >
      <div v-if="youtubeModal.videoId" class="youtube-content">
        <div class="youtube-embed">
          <iframe
            :src="`https://www.youtube.com/embed/${youtubeModal.videoId}?autoplay=1`"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="youtube-iframe"
          ></iframe>
        </div>
      </div>

      <template #footer>
        <n-space justify="end">
          <n-button
            @click="openYouTubeExternal"
            type="error"
            ghost
          >
            <template #icon>
              <n-icon>
                <YoutubeOutlined />
              </n-icon>
            </template>
            เข้าสู่เว็บหลัก YouTube
          </n-button>
          <n-button @click="closeYouTubeModal" type="primary">
            ออก
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { refDebounced } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import {
  SearchOutlined,
  CloseCircleOutlined,
  BookOutlined,
  YoutubeOutlined,
  FilePdfOutlined,
  EyeOutlined,
  CopyOutlined
} from '@vicons/antd'
import AppLayout from '@/components/layouts/AppLayout.vue'
import ContentLayout from '@/components/layouts/ContentLayout.vue'
import { useSearchStore } from '@/stores/search'
import { useAnalytics } from '@/composables/useAnalytics'


// Types
interface SearchResult {
  mark_index: string
  mark_details: string
  bookName: string
  bookId: string
  chapterLinkYouTube?: string
  chapterLinkPdf?: string | undefined
}

interface DetailModal {
  visible: boolean
  title: string
  content: SearchResult | null
}

interface YouTubeModal {
  visible: boolean
  videoId: string
  url: string
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
const hasSearched = ref<boolean>(false)
const copyButtonText = ref<string>('คัดลอก')
const inputRef = ref<HTMLInputElement | null>(null)

const detailModal = ref<DetailModal>({
  visible: false,
  title: '',
  content: null
})

const youtubeModal = ref<YouTubeModal>({
  visible: false,
  videoId: '',
  url: ''
})

// Computed properties
const creatorId = computed((): string => (route.query.t as string) || '1')
const loading = computed((): boolean => searchStore.overlay)
const searchResults = computed((): SearchResult[] => searchStore.indexs || [])
const totalResults = computed((): number => searchStore.totalsIndexs || 0)

const searchDescription = computed((): string => {
  if (searchResults.value.length > 0) {
    return `ผลการค้นหาสำหรับ "${searchKeywords.value.join(' ')}" - พบ ${totalResults.value} รายการ`
  }
  return 'ค้นหาในเนื้อหาธรรมะ'
})

// Predefined search suggestions for better performance
const SEARCH_SUGGESTIONS = [
  'พระพุทธเจ้า', 'ธรรมะ', 'สบาย', 'สติ', 'ปัญญา',
  'เมตตา', 'กรุณา', 'มุทิตา', 'อุเบกขา', 'ความเพียร',
  'สมาธิ', 'หลวงพ่อ', 'นั่งธรรมะ', 'นิพพาน'
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
  let count = 0

  for (const word of SEARCH_SUGGESTIONS) {
    if (count >= 4) break

    if (word.toLowerCase().includes(inputLower) &&
        !searchKeywords.value.includes(word) &&
        word !== input) {
      options.push({ label: word, value: word })
      count++
    }
  }

  return options
})

const canSearch = computed((): boolean => {
  return searchKeywords.value.length > 0
})

// Utility functions for Thai-Arabic number conversion
const thaiDigits = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙']
const arabicDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

const convertThaiToArabic = (text: string): string => {
  return text.split('').map(char => {
    const index = thaiDigits.indexOf(char)
    return index !== -1 ? arabicDigits[index] : char
  }).join('')
}

const convertArabicToThai = (text: string): string => {
  return text.split('').map(char => {
    const index = arabicDigits.indexOf(char)
    return index !== -1 ? thaiDigits[index] : char
  }).join('')
}

const hasNumbers = (text: string): boolean => {
  return /[\d๐-๙]/.test(text)
}

// Expanded search patterns including both Thai and Arabic numerals
const expandedSearchPatterns = computed((): string[] => {
  const patterns: string[] = []

  searchKeywords.value.forEach(keyword => {
    patterns.push(keyword) // Original keyword

    if (hasNumbers(keyword)) {
      // If contains numbers, add both Thai and Arabic versions
      const arabicVersion = convertThaiToArabic(keyword)
      const thaiVersion = convertArabicToThai(keyword)

      if (arabicVersion !== keyword) patterns.push(arabicVersion)
      if (thaiVersion !== keyword) patterns.push(thaiVersion)
    }
  })

  return [...new Set(patterns)] // Remove duplicates
})



// Methods
const performSearch = async (): Promise<void> => {
  if (!canSearch.value) {
    message.warning('กรุณาใส่คำที่ต้องการค้นหา')
    return
  }

  searching.value = true
  hasSearched.value = true

  // Reset infinite scroll state when performing new search
  infiniteScrollLoading.value = false
  isLoadingResults.value = false
  lastLoadTime.value = 0

  try {
    const searchWords = searchKeywords.value.map(keyword => ({
      text: keyword,
      color: 'primary'
    }))

    // Save to search history
    searchStore.addToSearchHistory(searchKeywords.value)

    await searchStore.setFirstIndexsFromApi({
      words: searchWords,
      page: 0,
      creator: creatorId.value,
      type: 'books'
    })

    // Track search analytics
    analytics.trackSearch({
      keywords: searchKeywords.value,
      resultCount: searchResults.value.length,
      searchType: 'content',
      creatorId: parseInt(creatorId.value)
    })

  } catch {
    message.error('เกิดข้อผิดพลาดในการค้นหา')
  } finally {
    searching.value = false
  }
}

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
  const trimmedValue = value.trim()
  if (!trimmedValue || searchKeywords.value.includes(trimmedValue)) {
    keywordInput.value = '' // Clear input even if keyword already exists
    return
  }

  if (searchKeywords.value.length >= 5) {
    message.warning('สามารถค้นหาได้สูงสุด 5 คำเท่านั้น')
    keywordInput.value = '' // Clear input when limit reached
    return
  }

  searchKeywords.value.push(trimmedValue)
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

// Loading state management for infinite scroll
const infiniteScrollLoading = ref<boolean>(false)
const lastLoadTime = ref<number>(0)
const minLoadDelay = 1500 // Minimum delay between loads (ms)
const isLoadingResults = ref<boolean>(false) // Additional flag to prevent multiple calls

const loadMoreResults = async (): Promise<void> => {
  // Strong debouncing: prevent ANY concurrent calls
  if (infiniteScrollLoading.value || isLoadingResults.value) {
    return Promise.resolve()
  }

  // Check if there are more results to load
  if (searchResults.value.length >= totalResults.value) {
    return Promise.resolve()
  }

  // Debouncing: prevent too frequent calls
  const now = Date.now()
  const timeSinceLastLoad = now - lastLoadTime.value
  if (timeSinceLastLoad < minLoadDelay) {
    return Promise.resolve()
  }

  // Set both loading flags immediately
  infiniteScrollLoading.value = true
  isLoadingResults.value = true
  lastLoadTime.value = now

  try {
    const offset = searchResults.value.length
    const searchWords = searchKeywords.value.map(keyword => ({
      text: keyword,
      color: 'primary'
    }))


    // Add minimum loading time for better UX
    const loadingPromise = searchStore.setFirstIndexsFromApi_infenit({
      words: searchWords,
      page: offset,
      creator: creatorId.value,
      type: 'books'
    })

    // Ensure minimum loading time for better UX
    const minDelayPromise = new Promise(resolve => setTimeout(resolve, 1000))

    await Promise.all([loadingPromise, minDelayPromise])


  } catch (error) {

    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes('Network')) {
        message.error('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง')
      } else {
        message.error('เกิดข้อผิดพลาดในการโหลดข้อมูลเพิ่มเติม')
      }
    } else {
      message.error('เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ')
    }

    // Don't re-throw to prevent breaking the infinite scroll component
  } finally {
    // Clear both loading flags
    infiniteScrollLoading.value = false
    isLoadingResults.value = false
  }
}

const checkPdfLink = (url: string | undefined): boolean => {
  return (url) ? url.endsWith('.pdf') : false
}


const navigateToBook = (bookId: string): void => {
  const bookUrl = router.resolve({
    path: `/book/${bookId}`,
    query: { t: creatorId.value }
  })
  window.open(bookUrl.href, '_blank')
}

const openDetailModal = (result: SearchResult): void => {
  detailModal.value.visible = true
  detailModal.value.title = result.mark_index
  detailModal.value.content = result
  copyButtonText.value = 'คัดลอก'
}

const closeDetailModal = (): void => {
  detailModal.value.visible = false
  detailModal.value.content = null
  copyButtonText.value = 'คัดลอก'
}

const copyDetailText = async (): Promise<void> => {
  if (!detailModal.value.content) return

  try {
    // Copy original text directly to preserve \n formatting
    const textToCopy = detailModal.value.content.mark_details
    await navigator.clipboard.writeText(textToCopy)
    copyButtonText.value = 'คัดลอกแล้ว'
  } catch {
    message.error('ไม่สามารถคัดลอกข้อความได้')
  }
}

const showYouTubeModal = (url: string): void => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  const videoId = (match && match[7].length === 11) ? match[7] : ''

  if (videoId) {
    youtubeModal.value.visible = true
    youtubeModal.value.videoId = videoId
    youtubeModal.value.url = url
  }
}

const closeYouTubeModal = (): void => {
  youtubeModal.value.visible = false
  youtubeModal.value.videoId = ''
  youtubeModal.value.url = ''
}

const openYouTubeExternal = (): void => {
  if (youtubeModal.value.url) {
    window.open(youtubeModal.value.url, '_blank')
  }
}

const openPdf = (url: string | undefined): void => {
  window.open(url, '_blank')
}

// Lifecycle
onMounted(async () => {
  const queryString = route.query

  // Handle URL parameters for direct search
  if ('word1' in queryString) {
    const searchWords = []
    for (const [key, value] of Object.entries(queryString)) {
      if (key.startsWith('word') && typeof value === 'string') {
        searchWords.push(value)
      }
    }

    if (searchWords.length > 0) {
      searchKeywords.value = searchWords
      hasSearched.value = true

      // Save to search history
      searchStore.addToSearchHistory(searchWords)

      const formattedWords = searchWords.map(word => ({
        text: word,
        color: 'primary'
      }))

      await searchStore.setFirstIndexsFromApi({
        words: formattedWords,
        page: 0,
        creator: creatorId.value,
        type: 'books'
      })
    }
  }

})
</script>

<style scoped>

.search-form-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

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
  min-height: 36px;
  max-height: 120px;
  overflow-y: auto;
  background: white;
  border-radius: 6px;
  border: 2px solid #e6e6e6;
  transition: all 0.3s ease;
  width: 100%;
}

.tags-input-container:focus-within {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.15);
}


.tag-input {
  border: none;
  outline: none;
  flex: 1;
  min-width: 100px;
  background: transparent;
  font-size: 14px;
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
  height: 36px;
  border-radius: 6px;
  min-width: 36px;
  padding: 0 10px;
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

.search-button {
  color: white;
  font-family: 'Sarabun', sans-serif;
  font-weight: 500;
}

.search-stats {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

.search-results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-result-item {
  font-family: 'Sarabun', sans-serif;
}

.result-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.result-content {
  padding: 16px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.result-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.4;
  flex: 1;
}

.result-number {
  font-size: 14px;
  color: #999;
  margin-left: 16px;
}

.result-book-info {
  margin-bottom: 12px;
}

.book-link {
  font-size: 14px;
  color: #1890ff;
}

.result-excerpt {
  margin-bottom: 16px;
}

.excerpt-content {
  font-size: 16px;
  line-height: 1.6;
  color: #555;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Styling for n-highlight marks */
.excerpt-content :deep(.n-highlight__mark) {
  background-color: #fff3cd;
  color: #856404;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: 600;
  border: 1px solid #ffc107;
  box-shadow: 0 1px 3px rgba(255, 193, 7, 0.3);
}

.result-actions {
  display: flex;
  justify-content: flex-end;
}

.youtube-button,
.pdf-button,
.detail-button {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
}

.loading-skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-card {
  padding: 16px;
}

.empty-state {
  margin: 60px 0;
  font-family: 'Sarabun', sans-serif;
}

.empty-suggestions {
  text-align: left;
  max-width: 400px;
  margin: 0 auto;
}

.keyword-display {
  display: block;
  margin-bottom: 4px;
  font-size: 16px;
  font-weight: 600;
}

.suggestions {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.suggestions-title {
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
}

.suggestions div {
  margin-bottom: 4px;
}

/* Infinite Scroll Loading Indicator */
.infinite-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  margin-top: 16px;
  transition: all 0.3s ease;
}

.loading-text {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
  font-weight: 500;
  transition: opacity 0.3s ease;
}

.loading-stats {
  font-family: 'Sarabun', sans-serif;
  font-size: 12px;
  opacity: 0.7;
  margin-top: 4px;
}

/* Loading animation improvements */
.infinite-loading .n-spin {
  transition: transform 0.3s ease;
}

.infinite-loading:hover .n-spin {
  transform: scale(1.1);
}

/* Modal Styles */
.detail-modal,
.youtube-modal {
  font-family: 'Sarabun', sans-serif;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 16px;
}

.detail-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.detail-book-info {
  display: flex;
  align-items: center;
}

.detail-text {
  font-size: 16px;
  line-height: 1.6;
  color: #555;
  white-space: pre-wrap;
}

.detail-text p {
  margin: 0;
}

/* Mark tag styling in detail modal */
.detail-text :deep(.n-highlight__mark) {
  background-color: #fff3cd;
  color: #856404;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: 600;
  border: 1px solid #ffc107;
  box-shadow: 0 1px 3px rgba(255, 193, 7, 0.3);
}

.youtube-content {
  display: flex;
  justify-content: center;
}

.youtube-embed {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

.youtube-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

/* Search Highlighting */
.search-highlight {
  background-color: #ffeb3b;
  color: #333;
  padding: 1px 2px;
  border-radius: 2px;
  font-weight: 600;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .result-header {
    flex-direction: column;
    gap: 8px;
  }

  .result-number {
    align-self: flex-end;
    margin-left: 0;
  }

  .result-title {
    font-size: 18px;
  }

  .result-actions {
    justify-content: center;
  }

  .detail-modal,
  .youtube-modal {
    width: 95vw !important;
  }
}

@media (max-width: 480px) {
  .result-title {
    font-size: 16px;
  }

  .result-excerpt p {
    font-size: 15px;
  }

  .youtube-button,
  .pdf-button,
  .detail-button {
    font-size: 12px;
    padding: 0 8px;
  }
}</style>