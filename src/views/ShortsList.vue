<template>
  <AppLayout>
    <ContentLayout
      title="📝 ปกิณกะ"
      description="เนื้อหาสั้น ๆ และข้อคิดจากคำสอน"
      :loading="loading ? true : undefined"
      loading-text="กำลังโหลด..."
    >
      <!-- Search Form Card -->
      <n-card class="search-form-card mb-6">
        <n-collapse :default-expanded-names="['search']">
          <n-collapse-item title="ค้นหาในเนื้อหาปกิณกะ" name="search">
            <n-form>
              <n-form-item label="ค้นหาข้อความปกิณกะ">
                <n-input-group>
                  <n-auto-complete
                    v-model:value="keywordInput"
                    :options="keywordOptions"
                    placeholder="พิมพ์คำค้นหา..."
                    class="keyword-input"
                    @select="addKeyword"
                    @keydown.enter="addKeywordFromInput"
                    @blur="addKeywordFromInput"
                    clearable
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
              <div v-if="searchKeywords.length > 0" class="keyword-tags mb-4">
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
              </div>

              <n-space justify="end">
                <n-button
                  v-if="searchKeywords.length > 0"
                  type="primary"
                  @click="performSearch"
                  :loading="searching ? true : undefined"
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
          </n-collapse-item>
        </n-collapse>
      </n-card>

      <!-- Search Results Stats -->
      <div v-if="!loading && filteredShorts.length > 0" class="search-stats mb-4">
        <n-text depth="3">
          พบ {{ totalResults }} รายการ
          <span v-if="searchKeywords.length > 0" class="search-info">
            (กรองจากคำค้นหา: {{ searchKeywords.join(', ') }})
          </span>
        </n-text>
      </div>

      <!-- Timeline Display with Infinite Scroll -->
      <n-infinite-scroll
        v-if="!loading && filteredShorts.length > 0"
        :distance="300"
        @load="loadMoreResults"
        class="shorts-timeline"
      >
        <n-timeline class="custom-timeline">
          <n-timeline-item
            v-for="(item, index) in filteredShorts"
            :key="index"
            type="info"
            :title="item.year"
            class="timeline-item"
          >
            <template #default>
              <div
                class="timeline-card-wrapper"
                @click="openDetailModal(item)"
              >
                <n-card
                  hoverable
                  class="timeline-card"
                >
                  <div class="timeline-content">
                    <h3 class="timeline-title">
                      <n-highlight
                        v-if="searchKeywords.length > 0"
                        :text="item.chapterHeading"
                        :patterns="searchKeywords"
                      />
                      <span v-else>{{ item.chapterHeading }}</span>
                    </h3>
                    <div class="timeline-situation">
                      <n-text depth="3">
                        <n-highlight
                          v-if="searchKeywords.length > 0"
                          :text="item.situation"
                          :patterns="searchKeywords"
                        />
                        <span v-else>{{ item.situation }}</span>
                      </n-text>
                    </div>
                    <div class="timeline-book-info">
                      <n-button
                        text
                        type="primary"
                        size="small"
                        class="book-info-button"
                        @click.stop
                      >
                        <template #icon>
                          <n-icon>
                            <BookOutlined />
                          </n-icon>
                        </template>
                        จากหนังสือ: {{ item.bookName }}
                      </n-button>
                    </div>
                  </div>
                </n-card>
              </div>
            </template>
          </n-timeline-item>
        </n-timeline>
      </n-infinite-scroll>

      <!-- Loading Skeleton -->
      <div v-if="loading" class="loading-skeleton">
        <n-timeline class="skeleton-timeline">
          <n-timeline-item
            v-for="i in 8"
            :key="i"
            type="info"
            class="skeleton-item"
          >
            <template #default>
              <n-card class="skeleton-card">
                <n-skeleton text :repeat="3" />
                <n-skeleton text style="width: 60%" />
              </n-card>
            </template>
          </n-timeline-item>
        </n-timeline>
      </div>

      <!-- Empty State -->
      <n-empty
        v-if="!loading && filteredShorts.length === 0"
        description="ไม่พบเนื้อหาปกิณกะ"
        class="empty-state"
      >
        <template #extra>
          <div v-if="searchKeywords.length > 0" class="empty-suggestions">
            <n-text tag="div" class="mb-3">
              ไม่พบผลลัพธ์สำหรับคำค้นหา
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
          <n-text v-else tag="div">
            ยังไม่มีเนื้อหาปกิณกะ
          </n-text>
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
              v-if="searchKeywords.length > 0"
              :text="detailModal.content.chapterHeading"
              :patterns="searchKeywords"
            />
            <span v-else>{{ detailModal.content.chapterHeading }}</span>
          </h3>
          <div class="detail-book-info">
            <n-button
              text
              type="primary"
              class="book-link"
            >
              <template #icon>
                <n-icon>
                  <BookOutlined />
                </n-icon>
              </template>
              จากหนังสือ: {{ detailModal.content.bookName }}
            </n-button>
          </div>
        </div>

        <div class="detail-text" ref="detailTextRef">
          <n-highlight
            v-if="searchKeywords.length > 0"
            :text="detailModal.content.chapterDetail"
            :patterns="searchKeywords"
          />
          <span v-else>{{ detailModal.content.chapterDetail }}</span>
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
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMessage } from 'naive-ui'
import {
  SearchOutlined,
  CloseCircleOutlined,
  BookOutlined,
  CopyOutlined
} from '@vicons/antd'
import AppLayout from '@/components/layouts/AppLayout.vue'
import ContentLayout from '@/components/layouts/ContentLayout.vue'
import { useSearchStore } from '@/stores/search'
import { useAnalytics } from '@/composables/useAnalytics'

// Types
interface ShortItem {
  chapterHeading: string
  chapterDetail: string
  situation: string
  bookName: string
  chapterId: string
  year: string
}

interface DetailModal {
  visible: boolean
  title: string
  content: ShortItem | null
}


// Composables
const route = useRoute()
const message = useMessage()
const searchStore = useSearchStore()
const analytics = useAnalytics()

// Reactive data
const searchKeywords = ref<string[]>([])
const keywordInput = ref<string>('')
const searching = ref<boolean>(false)
const copyButtonText = ref<string>('คัดลอก')
const detailTextRef = ref<HTMLElement | null>(null)

const detailModal = ref<DetailModal>({
  visible: false,
  title: '',
  content: null
})

// Computed properties
const creatorId = computed((): string => (route.query.t as string) || '1')
const loading = computed((): boolean => searchStore.overlay)
const shortsData = computed((): ShortItem[] => searchStore.indexs || [])
const totalResults = computed((): number => searchStore.totalsIndexs || 0)

const filteredShorts = computed((): ShortItem[] => {
  if (searchKeywords.value.length === 0) {
    return shortsData.value
  }

  // Filter shorts based on search keywords
  return shortsData.value.filter(item => {
    const searchText = `${item.chapterHeading} ${item.situation} ${item.chapterDetail}`.toLowerCase()
    return searchKeywords.value.every(keyword =>
      searchText.includes(keyword.toLowerCase())
    )
  })
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
    'นิพพาน',
    'ปกิณกะ',
    'ข้อคิด',
    'คำสอน'
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

// Loading state management for infinite scroll
const infiniteScrollLoading = ref<boolean>(false)
const lastLoadTime = ref<number>(0)
const minLoadDelay = 1500 // Minimum delay between loads (ms)
const isLoadingResults = ref<boolean>(false) // Additional flag to prevent multiple calls

const loadMoreResults = async (): Promise<void> => {
  // Strong debouncing: prevent ANY concurrent calls
  if (infiniteScrollLoading.value || isLoadingResults.value || loading.value) {
    return Promise.resolve()
  }

  // Check if there are more results to load
  if (shortsData.value.length >= totalResults.value) {
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
    const offset = shortsData.value.length


    // Add minimum loading time for better UX
    let loadingPromise

    if (searchKeywords.value.length > 0) {
      const searchWords = searchKeywords.value.map(keyword => ({
        text: keyword,
        color: 'primary'
      }))
      loadingPromise = searchStore.searchShortFromApiContinue({
        words: searchWords,
        page: offset,
        creator: creatorId.value
      })
    } else {
      loadingPromise = searchStore.setShortFromApiContinue({
        page: offset,
        creator: creatorId.value
      })
    }

    // Ensure minimum loading time for better UX
    const minDelayPromise = new Promise(resolve => setTimeout(resolve, 1000))

    await Promise.all([loadingPromise, minDelayPromise])


  } catch (error) {
    console.error('Load more shorts error:', error)

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

// Methods
const performSearch = (): void => {
  if (searchKeywords.value.length === 0) {
    message.warning('กรุณาใส่คำที่ต้องการค้นหา')
    return
  }

  searching.value = true

  // Reset infinite scroll state when performing new search
  infiniteScrollLoading.value = false
  isLoadingResults.value = false
  lastLoadTime.value = 0

  try {

    // For shorts, we use client-side filtering, so we track the search
    analytics.trackSearch({
      keywords: searchKeywords.value,
      resultCount: filteredShorts.value.length,
      searchType: 'shorts',
      creatorId: parseInt(creatorId.value)
    })

  } catch (error) {
    console.error('Search error:', error)
    message.error('เกิดข้อผิดพลาดในการค้นหา')
  } finally {
    searching.value = false
  }
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

const openDetailModal = (item: ShortItem): void => {
  detailModal.value.visible = true
  detailModal.value.title = item.chapterHeading
  detailModal.value.content = item
  copyButtonText.value = 'คัดลอก'

  // Track analytics
  analytics.trackEvent('view_short_detail', {
    chapter_id: item.chapterId,
    source: 'shorts_list'
  })
}

const closeDetailModal = (): void => {
  detailModal.value.visible = false
  detailModal.value.content = null
  copyButtonText.value = 'คัดลอก'
}

const copyDetailText = async (): Promise<void> => {
  if (!detailTextRef.value) return

  try {
    // Select text
    const range = document.createRange()
    range.selectNode(detailTextRef.value)
    window.getSelection()?.removeAllRanges()
    window.getSelection()?.addRange(range)

    // Copy to clipboard
    const successful = document.execCommand('copy')
    copyButtonText.value = successful ? 'คัดลอกแล้ว' : 'คัดลอกไม่สำเร็จ'

    window.getSelection()?.removeAllRanges()
  } catch (error) {
    console.error('Copy failed:', error)
    message.error('ไม่สามารถคัดลอกข้อความได้')
  }
}

// Lifecycle
onMounted(async () => {
  // Clear any previous data and load shorts
  searchStore.clear()

  try {
    await searchStore.getShortsFromApi(creatorId.value)
  } catch (error) {
    console.error('Failed to load shorts:', error)
    message.error('เกิดข้อผิดพลาดในการโหลดข้อมูล')
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap');

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

.keyword-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.keyword-tag {
  font-family: 'Sarabun', sans-serif;
  font-size: 13px;
}

.search-button {
  font-family: 'Sarabun', sans-serif;
  font-weight: 500;
}

.search-stats {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

.search-info {
  font-style: italic;
  color: #999;
}

.shorts-timeline {
  font-family: 'Sarabun', sans-serif;
}

.custom-timeline {
  padding: 16px 0;
}

.timeline-item {
  margin-bottom: 16px;
}

.timeline-card-wrapper {
  cursor: pointer;
  user-select: none;
  display: block;
  width: 100%;
}

.timeline-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  width: 100%;
}

.timeline-card-wrapper:hover .timeline-card {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.timeline-content {
  padding: 16px;
}

.timeline-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.timeline-situation {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.4;
}

.timeline-book-info {
  display: flex;
  align-items: center;
}

.book-info-button {
  font-size: 12px;
  color: #1890ff;
}

.loading-skeleton {
  font-family: 'Sarabun', sans-serif;
}

.skeleton-timeline {
  padding: 16px 0;
}

.skeleton-item {
  margin-bottom: 16px;
}

.skeleton-card {
  padding: 16px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

/* Modal Styles */
.detail-modal {
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
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.detail-book-info {
  display: flex;
  align-items: center;
}

.book-link {
  font-size: 14px;
  color: #1890ff;
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

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .timeline-title {
    font-size: 16px;
  }

  .timeline-situation {
    font-size: 13px;
  }

  .book-info-button {
    font-size: 11px;
  }

  .detail-modal {
    width: 95vw !important;
  }
}

@media (max-width: 480px) {
  .timeline-title {
    font-size: 15px;
  }

  .timeline-situation {
    font-size: 12px;
  }

  .timeline-content {
    padding: 12px;
  }
}
</style>