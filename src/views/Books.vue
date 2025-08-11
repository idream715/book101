<template>
  <AppLayout>
    <ContentLayout
      title="📚 หนังสือธรรมะ"
      description="รวมหนังสือคำสอนของหลวงพ่อธัมมชโย และคุณครูไม่ใหญ่ ครบถ้วนทุกเล่ม"
      :loading="loading || undefined"
      loading-text="กำลังโหลดหนังสือ..."
    >
      <!-- Search and Filter Section -->
      <n-card class="filter-card mb-6">
        <n-space vertical :size="16">
          <n-form-item label="เลือกชุดหนังสือ หรือ พิมพ์ชื่อหนังสือ">
            <n-input-group>
              <n-select
                v-model:value="filterBookValue"
                :options="searchOptions"
                filterable
                clearable
                placeholder="เลือกหรือพิมพ์เพื่อค้นหา..."
                class="search-select"
                @update:value="onFilterChange"
              />
              <n-button
                v-if="filterBookValue"
                @click="clearFilter"
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

          <!-- Filter Statistics -->
          <n-text depth="3" class="filter-stats">
            แสดง {{ filteredBooks.length }} เล่ม{{ filterBookValue ? ` จากการกรอง "${filterBookValue}"` : ' ทั้งหมด' }}
          </n-text>
        </n-space>
      </n-card>

      <!-- Books Grid -->
      <div class="books-grid">
        <n-grid
          cols="2 m:4 l:5 xl:6 2xl:8"
          :x-gap="16"
          :y-gap="20"
          responsive="screen"
          class="books-container"
        >
          <n-grid-item
            v-for="book in filteredBooks"
            :key="book.bookId"
            class="book-item"
          >
            <div class="book-click-wrapper" @click="navigateToBook(book)">
              <n-card
                class="book-card"
                hoverable
              >
              <template #cover>
                <div class="book-cover-container">
                  <n-image
                    :src="book.bookCoverThumbnails"
                    :alt="`ปกหนังสือ ${book.bookName}`"
                    width="200"
                    height="250"
                    object-fit="cover"
                    preview-disabled
                    class="book-cover"
                    :fallback-src="'/src/assets/logo2.png'"
                  />

                  <!-- Category Badge -->
                  <n-tag
                    v-if="catFilter(book.categoryName)"
                    size="small"
                    type="info"
                    class="category-badge"
                  >
                    {{ book.categoryName }}
                  </n-tag>
                </div>
              </template>
                <p></p>
                <n-performant-ellipsis
                  expand-trigger="click"
                  tooltip
                >
                  {{ book.bookName }}
                </n-performant-ellipsis>

              </n-card>
            </div>
          </n-grid-item>
        </n-grid>
      </div>

      <!-- Empty State -->
      <n-empty
        v-if="!loading && filteredBooks.length === 0"
        description="ไม่พบหนังสือที่ค้นหา"
        class="empty-state"
      >
        <template #extra>
          <n-button @click="clearFilter">
            ล้างการกรอง
          </n-button>
        </template>
      </n-empty>

    </ContentLayout>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NIcon } from 'naive-ui'
import { CloseCircleOutlined } from '@vicons/antd'
import AppLayout from '@/components/layouts/AppLayout.vue'
import ContentLayout from '@/components/layouts/ContentLayout.vue'
import { useBooksStore } from '@/stores/books'
import { useSearchStore } from '@/stores/search'
import { useAnalytics } from '@/composables/useAnalytics'

// Types
interface Book {
  bookId: number
  bookName: string
  bookCoverThumbnails: string
  categoryName: string
}

interface SearchOption {
  label: string
  value: string
}


// Composables
const route = useRoute()
const router = useRouter()
const booksStore = useBooksStore()
const searchStore = useSearchStore()
const analytics = useAnalytics()

// Reactive data
const filterBookValue = ref<string | null>(null)

// Computed properties
const books = computed((): Book[] => booksStore.getBooks || [])
const loading = computed((): boolean => searchStore.getoverlay)

const categories = computed((): string[] => {
  return Array.from(new Set(books.value.map(book => book.categoryName).filter(Boolean)))
})

const searchOptions = computed((): SearchOption[] => {
  const categoryOptions = categories.value.map(category => ({
    label: `📂 ${category}`,
    value: category
  }))

  const bookOptions = books.value.map(book => ({
    label: `📖 ${book.bookName}`,
    value: book.bookName
  }))

  return [...categoryOptions, ...bookOptions]
})

const filteredBooks = computed((): Book[] => {
  if (!filterBookValue.value) {
    return books.value
  }

  // Check if it's a category filter
  if (categories.value.includes(filterBookValue.value)) {
    return books.value.filter(book => book.categoryName === filterBookValue.value)
  }

  // Otherwise, filter by book name
  return books.value.filter(book =>
    book.bookName.toLowerCase().includes(filterBookValue.value!.toLowerCase())
  )
})


// Using static cols value to match design requirements
// Original design: cols="6" sm="4" md="3" lg="2" xl="1"
// Naive UI: We'll use responsive CSS for better control

// Methods
const onFilterChange = (_value: string | null): void => {
  // Handle filter change if needed
}

const catFilter = (category: string): boolean => {
  return category === "ไม่มี" ? false : true;
}

const clearFilter = (): void => {
  filterBookValue.value = null
}

const navigateToBook = (book: Book): void => {
  trackBookClick(book)
  const creatorId = route.query.t as string


  router.push({
    path: `/book/${book.bookId}`,
    query: creatorId ? { t: creatorId } : {}
  })
}

const trackBookClick = (book: Book): void => {
  analytics.trackBookView({
    bookId: book.bookId,
    bookName: book.bookName
  })
}

// Lifecycle
onMounted(() => {
  const creatorId = route.query.t as string
  booksStore.getBooksFromApi(creatorId)
})
</script>

<style scoped>

.filter-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.search-select {
  flex: 1;
}

.clear-button {
  margin-left: 8px;
}

.filter-stats {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
}

.books-grid {
  font-family: 'Sarabun', sans-serif;
}

.books-container {
  width: 100%;
  display: grid;
}

.book-item {
  display: flex;
  justify-content: center;
  width: 100%;
}

.book-click-wrapper {
  width: 100%;
  max-width: 200px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.book-card {
  width: 100%;
  min-height: 320px; /* Fixed minimum height for consistent layout */
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.book-click-wrapper:hover .book-card {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.book-click-wrapper:hover .book-cover {
  transform: scale(1.05);
}

.book-click-wrapper:active .book-card {
  transform: translateY(-2px);
}

.book-cover-container {
  position: relative;
  overflow: hidden;
  border-radius: 2px 2px 0 0;
}

.book-cover {
  width: 100%;
  transition: transform 0.3s ease;
}

.book-card:hover .book-cover {
  transform: scale(1.05);
}

.category-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  backdrop-filter: blur(4px);
  background: rgba(255, 255, 255, 0.9);
}

.book-title-container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  text-align: center;
  overflow: hidden;
}

.book-title {
  padding-top: 10px;
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  color: #333;
}

/* Book Card Section Styling */


.empty-state {
  margin: 60px 0;
  font-family: 'Sarabun', sans-serif;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .filter-card {
    margin-bottom: 16px;
  }

  .books-container {
    width: 100%;
    padding: 0 8px;
  }

  .book-item {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .book-card {
    width: 100%;
    max-width: 160px;
    min-width: 140px;
  }

  .book-title {
    font-size: 12px;
  }

  .read-button {
    font-size: 12px;
    padding: 0 12px;
  }

  .filter-stats {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .books-container {
    padding: 0 4px;
  }

  .book-item {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .book-card {
    width: 100%;
    max-width: 140px;
    min-width: 120px;
  }

  .book-title {
    font-size: 12px;
  }

  .read-button {
    font-size: 11px;
    padding: 0 8px;
  }

  .category-badge {
    font-size: 10px;
    padding: 2px 6px;
  }
}
</style>