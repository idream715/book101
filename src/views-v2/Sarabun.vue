<template>
  <AppLayout>
    <ContentLayout
      :title="bookSelected?.bookName || 'กำลังโหลด...'"
      description="สารบัญและรายละเอียดของหนังสือ"
      :loading="loading ? true : undefined"
      loading-text="กำลังโหลดข้อมูลหนังสือ..."
    >
      <!-- Book Information Section -->
      <n-card class="book-info-card mb-6" :bordered="undefined">
        <n-grid x-gap="24" :cols="24" responsive="screen">
          <!-- Book Cover -->
          <n-gi :span="24" :tablet="12" :desktop="10">
            <div class="book-cover-section">
              <n-skeleton
                v-if="loading"
                width="250px"
                height="350px"
                class="book-cover-skeleton"
              />
              <n-image
                v-else
                :src="bookSelected?.bookCover"
                alt="Book Cover"
                width="250"
                height="350"
                object-fit="cover"
                class="book-cover"
                :preview-disabled="undefined"
              >
                <template #placeholder>
                  <div class="image-placeholder">
                    <n-spin size="medium" />
                  </div>
                </template>
              </n-image>
            </div>
          </n-gi>

          <!-- Book Details -->
          <n-gi :span="24" :tablet="12" :desktop="14">
            <div class="book-details-section">
              <n-skeleton v-if="loading" text :repeat="4" />
              <div v-else class="book-details">
                <n-descriptions
                  :column="1"
                  label-placement="left"
                  label-style="font-weight: 600; color: #666;"
                  content-style="font-weight: 500;"
                  class="book-meta"
                >
                  <n-descriptions-item label="จำนวนสารบัญ">
                    <n-text type="primary" strong>{{ sarabunTotal }} รายการ</n-text>
                  </n-descriptions-item>
                  <n-descriptions-item label="ชุดหนังสือ">
                    <n-text type="primary" strong>{{ bookSelected?.categoryName || 'ไม่ระบุ' }}</n-text>
                  </n-descriptions-item>
                </n-descriptions>

                <!-- Action Buttons -->
                <n-space class="book-actions mt-4" vertical size="medium">
                  <n-space size="medium">
                    <n-button
                      v-if="bookSelected?.bookPdf"
                      type="error"
                      secondary
                      @click="openPdf(bookSelected.bookPdf)"
                      class="action-button"
                    >
                      <template #icon>
                        <n-icon>
                          <FilePdfOutlined />
                        </n-icon>
                      </template>
                      เปิด PDF
                    </n-button>

                    <n-button
                      v-if="bookSelected?.bookText && bookSelected.bookText.includes('.txt')"
                      type="primary"
                      secondary
                      @click="openText(bookSelected.bookText)"
                      class="action-button"
                    >
                      <template #icon>
                        <n-icon>
                          <BookOutlined />
                        </n-icon>
                      </template>
                      เปิดไฟล์ TEXT
                    </n-button>

                    <n-button
                      v-if="bookSelected?.bookPdf"
                      type="success"
                      secondary
                      @click="downloadBook"
                      :loading="downloadLoading ? true : undefined"
                      class="action-button"
                    >
                      <template #icon>
                        <n-icon>
                          <DownloadOutlined />
                        </n-icon>
                      </template>
                      ดาวน์โหลด PDF
                    </n-button>
                  </n-space>
                </n-space>
              </div>
            </div>
          </n-gi>
        </n-grid>
      </n-card>

      <!-- Table of Contents -->
      <n-card class="toc-card" :bordered="undefined">
        <template #header>
          <div class="toc-header">
            <n-icon size="20" class="toc-icon">
              <BookOutlined />
            </n-icon>
            <h3 class="toc-title">สารบัญ</h3>
          </div>
        </template>

        <!-- Loading Skeletons -->
        <div v-if="loading" class="toc-loading">
          <n-list>
            <n-list-item v-for="i in 5" :key="i">
              <template #prefix>
                <n-skeleton circle size="medium" />
              </template>
              <n-skeleton text style="width: 60%" />
              <template #suffix>
                <n-space>
                  <n-skeleton circle size="small" />
                  <n-skeleton circle size="small" />
                  <n-skeleton circle size="small" />
                </n-space>
              </template>
            </n-list-item>
          </n-list>
        </div>

        <!-- Table of Contents List with Infinite Scroll -->
        <n-infinite-scroll
          v-else-if="sarabunSelected.length > 0"
          :distance="300"
          @load="loadMoreChapters"
          class="toc-list"
        >
          <n-list hoverable clickable>
            <n-list-item
              v-for="(item, index) in sarabunSelected"
              :key="item.chapterId"
              class="chapter-item"
            >
              <template #prefix>
                <n-avatar
                  :size="32"
                  color="#696969"
                  class="chapter-number"
                >
                  {{ index + 1 }}
                </n-avatar>
              </template>

              <n-thing class="chapter-content">
                <template #header>
                  <span class="chapter-title">{{ item.chapterHeading }}</span>
                </template>
              </n-thing>

              <template #suffix>
                <n-space size="small" class="chapter-actions">
                  <!-- YouTube Button -->
                  <n-button
                    v-if="item.chapterLinkYouTube && item.chapterLinkYouTube.length > 0"
                    circle
                    secondary
                    type="error"
                    size="small"
                    @click="showYouTubeModal(item.chapterLinkYouTube)"
                    class="action-btn"
                  >
                    <template #icon>
                      <n-icon>
                        <YoutubeOutlined />
                      </n-icon>
                    </template>
                  </n-button>

                  <!-- PDF Button -->
                  <n-button
                    circle
                    secondary
                    :type="item.chapterLinkPdf && item.chapterLinkPdf.length > 0 ? 'error' : 'default'"
                    size="small"
                    @click="openPdf(item.chapterLinkPdf)"
                    :disabled="!item.chapterLinkPdf || item.chapterLinkPdf.length === 0 ? true : undefined"
                    class="action-btn"
                  >
                    <template #icon>
                      <n-icon>
                        <FilePdfOutlined />
                      </n-icon>
                    </template>
                  </n-button>

                  <!-- Read Detail Button -->
                  <n-button
                    circle
                    secondary
                    :type="item.chapterDetail ? 'primary' : 'default'"
                    size="small"
                    @click="openDetailModal(item)"
                    :disabled="!item.chapterDetail ? true : undefined"
                    class="action-btn"
                  >
                    <template #icon>
                      <n-icon>
                        <EyeOutlined />
                      </n-icon>
                    </template>
                  </n-button>
                </n-space>
              </template>
            </n-list-item>
          </n-list>
        </n-infinite-scroll>

        <!-- Empty State -->
        <n-empty
          v-else-if="!loading"
          description="ไม่พบสารบัญ"
          class="empty-toc"
        />
      </n-card>

    </ContentLayout>

    <!-- Chapter Detail Modal -->
    <n-modal
      v-model:show="detailModal.visible"
      preset="card"
      :title="detailModal.title"
      class="detail-modal"
      :style="{ width: '90vw', maxWidth: '800px' }"
    >
      <div v-if="detailModal.content" class="chapter-detail-content">
        <div class="chapter-text" ref="chapterTextRef">
          {{ detailModal.content.chapterDetail }}
        </div>
      </div>

      <template #footer>
        <n-space justify="end">
          <n-button @click="copyChapterText" secondary>
            <template #icon>
              <n-icon>
                <CopyOutlined />
              </n-icon>
            </template>
            {{ copyButtonText }}
          </n-button>
          <n-button @click="closeDetailModal" type="primary">
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
            secondary
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
import { useRoute } from 'vue-router'
import { useMessage } from 'naive-ui'
import {
  BookOutlined,
  FilePdfOutlined,
  DownloadOutlined,
  YoutubeOutlined,
  EyeOutlined,
  CopyOutlined
} from '@vicons/antd'
import AppLayout from '@/components-v2/layouts/AppLayout.vue'
import ContentLayout from '@/components-v2/layouts/ContentLayout.vue'
import { useBooksStore } from '@/stores/books'
import { useSearchStore } from '@/stores/search'
import { useAnalytics } from '@/composables/useAnalytics'
import axios from 'axios'

// Types
interface ChapterItem {
  chapterId: string
  chapterHeading: string
  chapterDetail?: string
  chapterLinkYouTube?: string
  chapterLinkPdf?: string
}

interface BookInfo {
  bookName: string
  bookCover: string
  categoryName: string
  bookPdf: string
  bookText?: string
}

interface DetailModal {
  visible: boolean
  title: string
  content: ChapterItem | null
}

interface YouTubeModal {
  visible: boolean
  videoId: string
  url: string
}

// Props
const props = defineProps<{
  id: string
}>()

console.log('SarabunV2 (Naive UI) component loaded!')

// Composables
const route = useRoute()
const message = useMessage()
const booksStore = useBooksStore()
const searchStore = useSearchStore()
const analytics = useAnalytics()

// Reactive data
const itemsPerPage = ref<number>(50)
const downloadLoading = ref<boolean>(false)
const copyButtonText = ref<string>('คัดลอก')
const chapterTextRef = ref<HTMLElement | null>(null)

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
const bookSelected = computed((): BookInfo | null => booksStore.getbook)
const sarabunSelected = computed((): ChapterItem[] => booksStore.getSarabuns || [])
const sarabunTotal = computed((): number => booksStore.getTotalSarabun || 0)
const loading = computed((): boolean => searchStore.getoverlay)
const pages = computed((): number => Math.ceil(sarabunTotal.value / itemsPerPage.value))

// Loading state management for infinite scroll
const infiniteScrollLoading = ref<boolean>(false)
const lastLoadTime = ref<number>(0)
const minLoadDelay = 1500
const isLoadingChapters = ref<boolean>(false)

const loadMoreChapters = async (): Promise<void> => {
  // Strong debouncing: prevent ANY concurrent calls
  if (infiniteScrollLoading.value || isLoadingChapters.value || loading.value) {
    console.log('Load already in progress, skipping...')
    return Promise.resolve()
  }

  // Check if there are more chapters to load
  if (sarabunSelected.value.length >= sarabunTotal.value) {
    console.log('No more chapters to load')
    return Promise.resolve()
  }

  // Debouncing: prevent too frequent calls
  const now = Date.now()
  const timeSinceLastLoad = now - lastLoadTime.value
  if (timeSinceLastLoad < minLoadDelay) {
    console.log(`Debouncing: ${minLoadDelay - timeSinceLastLoad}ms remaining`)
    return Promise.resolve()
  }

  // Set both loading flags immediately
  infiniteScrollLoading.value = true
  isLoadingChapters.value = true
  lastLoadTime.value = now

  try {
    const timesLoaded = Math.ceil(sarabunSelected.value.length / itemsPerPage.value)
    if (timesLoaded < pages.value) {
      const nextPage = timesLoaded + 1
      const offset = nextPage * itemsPerPage.value - itemsPerPage.value

      console.log('Loading more chapters:', {
        offset,
        totalChapters: sarabunTotal.value,
        timesLoaded
      })

      // Add minimum loading time for better UX
      const loadingPromise = booksStore.setSarabun({
        bookId: props.id,
        offset: offset
      })

      const minDelayPromise = new Promise(resolve => setTimeout(resolve, 1000))

      await Promise.all([loadingPromise, minDelayPromise])

      console.log('More chapters loaded:', {
        newTotal: sarabunSelected.value.length,
        remaining: sarabunTotal.value - sarabunSelected.value.length,
        loadTime: Date.now() - now
      })
    }
  } catch (error) {
    console.error('Load more chapters error:', error)

    if (error instanceof Error) {
      if (error.message.includes('Network')) {
        message.error('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง')
      } else {
        message.error('เกิดข้อผิดพลาดในการโหลดสารบัญเพิ่มเติม')
      }
    } else {
      message.error('เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ')
    }
  } finally {
    // Clear both loading flags
    infiniteScrollLoading.value = false
    isLoadingChapters.value = false
  }
}

// Methods
const openPdf = (url: string): void => {
  if (!url) {
    message.warning('ไม่มีลิงก์ PDF')
    return
  }
  window.open(url, '_blank')

  // Track analytics
  analytics.trackEvent('open_pdf', {
    book_id: props.id,
    source: 'sarabun_page'
  })
}

const openText = (url: string): void => {
  if (!url) {
    message.warning('ไม่มีไฟล์ TEXT')
    return
  }
  window.open(url, '_blank')

  // Track analytics
  analytics.trackEvent('open_text', {
    book_id: props.id,
    source: 'sarabun_page'
  })
}

const downloadBook = async (): Promise<void> => {
  if (!bookSelected.value?.bookPdf) {
    message.warning('ไม่มีไฟล์ PDF สำหรับดาวน์โหลด')
    return
  }

  downloadLoading.value = true

  try {
    const pdfFileName = extractPdfFileName(bookSelected.value.bookPdf)
    if (!pdfFileName) {
      throw new Error('Invalid PDF URL')
    }

    const response = await axios({
      url: `https://one.rgtcenter.com/dm01/api/download/book/${pdfFileName}`,
      method: 'GET',
      responseType: 'blob',
    })

    const blob = new Blob([response.data], { type: 'application/pdf' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.setAttribute('download', `${bookSelected.value.bookName}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.parentNode?.removeChild(link)

    message.success('ดาวน์โหลดสำเร็จ')

    // Track analytics
    analytics.trackEvent('download_book', {
      book_id: props.id,
      book_name: bookSelected.value.bookName,
      source: 'sarabun_page'
    })

  } catch (error) {
    console.error('Download error:', error)
    message.error('เกิดข้อผิดพลาดในการดาวน์โหลด')
  } finally {
    downloadLoading.value = false
  }
}

const extractPdfFileName = (url: string): string | null => {
  const parts = url.split('/')
  const lastPart = parts[parts.length - 1]

  if (lastPart.endsWith('.pdf')) {
    return lastPart
  }
  return null
}

const openDetailModal = (item: ChapterItem): void => {
  if (!item.chapterDetail) {
    message.warning('ไม่มีเนื้อหารายละเอียด')
    return
  }

  detailModal.value.visible = true
  detailModal.value.title = item.chapterHeading
  detailModal.value.content = item
  copyButtonText.value = 'คัดลอก'

  // Track analytics
  analytics.trackEvent('view_chapter_detail', {
    chapter_id: item.chapterId,
    book_id: props.id,
    source: 'sarabun_page'
  })
}

const closeDetailModal = (): void => {
  detailModal.value.visible = false
  detailModal.value.content = null
  copyButtonText.value = 'คัดลอก'
}

const copyChapterText = async (): Promise<void> => {
  if (!detailModal.value.content?.chapterDetail) return

  try {
    const text = detailModal.value.content.chapterDetail

    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      copyButtonText.value = 'คัดลอกแล้ว'
      message.success('คัดลอกข้อความสำเร็จ')
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      copyButtonText.value = 'คัดลอกแล้ว'
      message.success('คัดลอกข้อความสำเร็จ')
    }

    // Reset button text after 2 seconds
    setTimeout(() => {
      copyButtonText.value = 'คัดลอก'
    }, 2000)

  } catch (error) {
    console.error('Copy failed:', error)
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

    // Track analytics
    analytics.trackEvent('view_youtube', {
      video_id: videoId,
      book_id: props.id,
      source: 'sarabun_page'
    })
  } else {
    message.error('ลิงก์ YouTube ไม่ถูกต้อง')
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

// Lifecycle
onMounted(async () => {
  try {
    // Track page view
    analytics.trackPageView({
      page_title: 'Book101 Sarabun',
      page_path: `/${route.params.id}`,
    })

    // Load book and sarabun data
    await Promise.all([
      booksStore.setbook(props.id),
      booksStore.setSarabun({ bookId: props.id, offset: 0 })
    ])

    console.log('SarabunV2 mounted with book ID:', props.id)
  } catch (error) {
    console.error('Failed to load book data:', error)
    message.error('เกิดข้อผิดพลาดในการโหลดข้อมูลหนังสือ')
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap');

/* Book Information Section */
.book-info-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 24px;
}

.book-cover-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.book-cover-skeleton {
  border-radius: 8px;
}

.book-cover {
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.image-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.book-details-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: 'Sarabun', sans-serif;
}

.book-meta {
  margin-bottom: 16px;
}

.book-actions {
  width: 100%;
}

.action-button {
  font-family: 'Sarabun', sans-serif;
  font-weight: 500;
}

/* Table of Contents */
.toc-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.toc-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Sarabun', sans-serif;
}

.toc-icon {
  color: #1890ff;
}

.toc-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.toc-loading {
  padding: 16px 0;
}

.toc-list {
  font-family: 'Sarabun', sans-serif;
}

.chapter-item {
  transition: all 0.2s ease;
  border-radius: 8px;
  margin-bottom: 4px;
}

.chapter-item:hover {
  background-color: #fafafa;
}

.chapter-number {
  font-weight: 600;
}

.chapter-content {
  flex: 1;
  min-width: 0;
}

.chapter-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
  word-break: break-word;
}

.chapter-actions {
  flex-shrink: 0;
}

.action-btn {
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: scale(1.05);
}

.empty-toc {
  margin: 60px 0;
  font-family: 'Sarabun', sans-serif;
}

/* Modal Styles */
.detail-modal,
.youtube-modal {
  font-family: 'Sarabun', sans-serif;
}

.chapter-detail-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chapter-text {
  font-size: 16px;
  line-height: 1.6;
  color: #555;
  white-space: pre-wrap;
  word-break: break-word;
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

/* Responsive Design */
@media (max-width: 768px) {
  .book-info-card {
    padding: 16px;
  }

  .book-cover-section {
    margin-bottom: 20px;
  }

  .book-cover {
    width: 200px;
    height: 280px;
  }

  .book-cover-skeleton {
    width: 200px !important;
    height: 280px !important;
  }

  .chapter-title {
    font-size: 14px;
  }

  .action-button {
    font-size: 13px;
  }

  .detail-modal,
  .youtube-modal {
    width: 95vw !important;
  }

  .toc-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .chapter-actions {
    flex-direction: column;
    gap: 4px;
  }
}

@media (max-width: 480px) {
  .book-cover {
    width: 180px;
    height: 252px;
  }

  .book-cover-skeleton {
    width: 180px !important;
    height: 252px !important;
  }

  .chapter-title {
    font-size: 13px;
  }

  .chapter-text {
    font-size: 15px;
  }

  .action-btn {
    font-size: 12px;
  }
}
</style>