<template>
  <AppLayout>
    <ContentLayout
      title="🃏 การ์ดธรรมะ"
      description="รวมการ์ดธรรมะคำสอนของหลวงพ่อธัมมชโย และคุณครูไม่ใหญ่ พร้อมระบบค้นหาและแท็ก"
      :loading="loading || undefined"
      loading-text="กำลังโหลดการ์ด..."
    >
      <!-- Search and Filter Section -->
      <n-card class="filter-card mb-6">
        <n-space vertical :size="16">
          <!-- Tag Filter -->
          <n-form-item label="เลือก Tag ของการ์ด">
            <n-select
              v-model:value="selectedTags"
              :options="tagOptions"
              multiple
              filterable
              clearable
              placeholder="เลือก Tag หรือพิมพ์เพื่อค้นหา..."
              class="tag-select"
            />
          </n-form-item>

          <!-- Keyword Search -->
          <n-form-item label="ค้นหาคำในการ์ด">
            <n-input-group>
              <n-auto-complete
                v-model:value="keywordInput"
                :options="keywordOptions"
                @select="handleKeywordSelect"
                clearable
                clear-after-select
              >
                <template #default="{ handleInput, handleBlur, handleFocus }">
                  <div class="tags-input-container" :class="{ 'has-tags': searchKeywords.length > 0 }">
                    <!-- Selected tags inside input -->
                    <n-tag
                      v-for="(keyword, index) in searchKeywords"
                      :key="keyword"
                      size="small"
                      type="info"
                      closable
                      @close="removeKeyword(index)"
                    >
                      {{ keyword }}
                    </n-tag>

                    <!-- Actual input for new keywords -->
                    <input
                      ref="inputRef"
                      v-model="keywordInput"
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
                type="primary"
                quaternary
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

          <!-- Search Button -->
          <n-space justify="end">
            <n-button
              type="primary"
              @click="performSearch"
              :loading="searchLoadingAttr"
              :disabled="canSearchDisabled"
            >
              <template #icon>
                <n-icon>
                  <SearchOutlined />
                </n-icon>
              </template>
              ค้นหา
            </n-button>
          </n-space>

          <!-- Filter Statistics -->
          <n-text depth="3" class="filter-stats">
            แสดง {{ cards.length }} การ์ด{{ hasActiveFilters ? ' จากการกรอง' : ' ทั้งหมด' }}
          </n-text>
        </n-space>
      </n-card>

      <!-- Cards Grid with Infinite Scroll -->
      <n-infinite-scroll
        :distance="1200"
        @load="loadMoreCards"
        :loading="infiniteScrollLoadingAttr"
        class="cards-infinite-scroll"
      >
        <div class="cards-grid">
          <n-grid
            cols="2 s:3 m:4 l:5 xl:6 2xl:7"
            :x-gap="12"
            :y-gap="18"
            responsive="screen"
            class="cards-container"
          >
            <n-grid-item
              v-for="card in cards"
              :key="card.cardId"
              class="card-item"
            >
              <div class="card-click-wrapper" @click="openCardModal(card)">
                <n-card
                  class="card-wrapper"
                  header-class="card-header-custom"
                  content-class="card-content-custom"
                  hoverable
                >
                <template #cover>
                  <div class="card-cover-container">
                    <n-image
                      :src="card.cardPicThumbnails"
                      :alt="`การ์ด ${card.cardDetail}`"
                      width="100%"
                      height="250"
                      object-fit="cover"
                      preview-disabled
                      class="card-cover"
                      :fallback-src="'/src/assets/logo2.png'"
                    />

                    <!-- Tags Badge -->
                    <div v-if="card.cardTags && card.cardTags.length > 0" class="tags-container">
                      <n-tag
                        v-for="tag in card.cardTags.slice(0, 2)"
                        :key="tag"
                        size="small"
                        type="info"
                        class="tag-badge"
                      >
                        {{ tag }}
                      </n-tag>
                      <n-tag
                        v-if="card.cardTags.length > 2"
                        size="small"
                        type="default"
                        class="tag-badge"
                      >
                        +{{ card.cardTags.length - 2 }}
                      </n-tag>
                    </div>
                  </div>
                </template>

                <template #header>
                  <n-ellipsis :line-clamp="2" class="card-title">
                    {{ card.cardDetail }}
                  </n-ellipsis>
                </template>

                </n-card>
              </div>
            </n-grid-item>
          </n-grid>
        </div>

        <!-- Loading indicator at the bottom -->
        <template #loading>
          <div class="infinite-loading">
            <n-spin size="medium" />
            <n-text depth="3" class="loading-text">
              {{ infiniteScrollLoading ? 'กำลังโหลดการ์ดเพิ่มเติม...' : 'เลื่อนลงเพื่อดูการ์ดเพิ่มเติม' }}
            </n-text>
            <n-text v-if="cards.length > 0" depth="3" class="loading-stats">
              แสดงแล้ว {{ cards.length }} / {{ totalCards }} การ์ด
            </n-text>
          </div>
        </template>
      </n-infinite-scroll>

      <!-- Empty State -->
      <n-empty
        v-if="!loading && cards.length === 0"
        description="ไม่พบการ์ดที่ค้นหา"
        class="empty-state"
      >
        <template #extra>
          <n-space>
            <n-button @click="clearFilters">
              ล้างการกรอง
            </n-button>
            <n-button type="primary" @click="performSearch">
              ค้นหาใหม่
            </n-button>
          </n-space>
        </template>
      </n-empty>


    </ContentLayout>

    <!-- Card Modal -->
    <n-modal
      v-model:show="cardModal.visible.value"
      preset="card"
      :title="cardModal.title.value"
      class="card-modal"
      :style="{ width: '90vw', maxWidth: '800px' }"
    >
      <div v-if="cardModal.currentCard.value" class="modal-content">
        <div class="modal-image-container">
          <n-image
            :src="cardModal.currentCard.value.cardPic"
            :alt="`การ์ด ${cardModal.currentCard.value.cardDetail}`"
            width="100%"
            object-fit="contain"
            class="modal-image"
          />
        </div>

        <div class="modal-details">
          <h3 class="modal-title">{{ cardModal.currentCard.value.cardDetail }}</h3>

          <div v-if="cardModal.currentCard.value.cardTags" class="modal-tags">
            <n-tag
              v-for="tag in cardModal.currentCard.value.cardTags"
              :key="tag"
              type="info"
              class="modal-tag"
            >
              {{ tag }}
            </n-tag>
          </div>

          <div class="modal-actions">
            <n-space>
              <n-button
                @click="copyCardText"
                type="primary"
                ghost
              >
                <template #icon>
                  <n-icon>
                    <CopyOutlined />
                  </n-icon>
                </template>
                คัดลอกข้อความ
              </n-button>

              <n-button
                @click="shareCard"
                type="primary"
                ghost
              >
                <template #icon>
                  <n-icon>
                    <ShareAltOutlined />
                  </n-icon>
                </template>
                แชร์
              </n-button>
            </n-space>
          </div>
        </div>
      </div>

      <template #footer>
        <n-space justify="space-between">
          <n-space>
            <n-button
              @click="cardModal.goToPrevious"
              :disabled="canGoPreviousDisabled"
              type="primary"
              ghost
            >
              <template #icon>
                <n-icon>
                  <LeftOutlined />
                </n-icon>
              </template>
              ก่อนหน้า
            </n-button>

            <n-button
              @click="cardModal.goToNext"
              :disabled="canGoNextDisabled"
              type="primary"
              ghost
            >
              <template #icon>
                <n-icon>
                  <RightOutlined />
                </n-icon>
              </template>
              ถัดไป
            </n-button>
          </n-space>

          <n-text depth="3">
            {{ cardModal.currentIndex.value + 1 }} / {{ cardModal.cardList.value.length }}
          </n-text>
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
  CloseCircleOutlined,
  SearchOutlined,
  CopyOutlined,
  ShareAltOutlined,
  LeftOutlined,
  RightOutlined
} from '@vicons/antd'
import AppLayout from '@/components/layouts/AppLayout.vue'
import ContentLayout from '@/components/layouts/ContentLayout.vue'
import { useCardsStore } from '@/stores/cards'
import { useCardModal } from '@/composables/useModal'
import { useAnalytics } from '@/composables/useAnalytics'
import { validateCreatorId, validateSearchKeywords, sanitizeTagName } from '@/utils/security'

// Types
interface Card {
  cardId: number
  cardDetail: string
  cardPicThumbnails: string
  cardPic: string
  cardTags?: string[]
  creatorId?: number
}

interface TagOption {
  label: string
  value: string
}

interface KeywordOption {
  label: string
  value: string
}


// Composables
const route = useRoute()
const message = useMessage()
const cardsStore = useCardsStore()
const cardModal = useCardModal()
const analytics = useAnalytics()

// Reactive data
const selectedTags = ref<string[]>([])
const searchKeywords = ref<string[]>([])
const keywordInput = ref<string>('')
const searching = ref<boolean>(false)
const inputRef = ref<HTMLInputElement | null>(null)

// Computed properties
const loading = computed((): boolean => cardsStore.getoverlay)
const cards = computed((): Card[] => cardsStore.getCards || [])
const totalCards = computed((): number => cardsStore.getTotalCards || 0)

const tagOptions = computed((): TagOption[] => {
  // Use tags from API (cardsStore.getTags) instead of extracting from cards
  const apiTags = cardsStore.getTags || []
  return apiTags.map((tag: any) => ({
    label: tag.tagName,
    value: tag.tagName
  }))
})

const keywordOptions = computed((): KeywordOption[] => {
  if (!keywordInput.value) return []

  const input = keywordInput.value.trim()
  if (!input) return []
  
  const options: KeywordOption[] = []

  // Add current input as first option
  if (!searchKeywords.value.includes(input)) {
    options.push({
      label: `"${input}" (พิมพ์แล้วกด Enter)`,
      value: input
    })
  }

  // Generate autocomplete suggestions based on input (optimized)
  const inputLower = input.toLowerCase()
  const uniqueSuggestions = new Set<string>()
  
  // Limit card processing for performance
  const cardsToProcess = cards.value.slice(0, 100) // Process only first 100 cards
  
  for (const card of cardsToProcess) {
    const words = card.cardDetail.split(' ')
    for (const word of words) {
      if (word.length > 2 && 
          word.toLowerCase().includes(inputLower) &&
          !searchKeywords.value.includes(word) &&
          word !== input) {
        uniqueSuggestions.add(word)
        if (uniqueSuggestions.size >= 4) break
      }
    }
    if (uniqueSuggestions.size >= 4) break
  }

  // Add unique suggestions
  Array.from(uniqueSuggestions).forEach(suggestion => {
    options.push({
      label: suggestion,
      value: suggestion
    })
  })

  return options
})


const hasActiveFilters = computed((): boolean => {
  return selectedTags.value.length > 0 || searchKeywords.value.length > 0
})

const canSearch = computed((): boolean => {
  return searchKeywords.value.length > 0 || selectedTags.value.length > 0
})

// Computed properties for proper attribute handling in Vue 3
const searchLoadingAttr = computed(() => searching.value || undefined)
const infiniteScrollLoadingAttr = computed(() => infiniteScrollLoading.value || undefined)
const canSearchDisabled = computed(() => !canSearch.value || undefined)
const canGoPreviousDisabled = computed(() => !cardModal.canGoPrevious.value || undefined)
const canGoNextDisabled = computed(() => !cardModal.canGoNext.value || undefined)

// Methods
const handleKeywordSelect = (value: string): void => {
  addKeyword(value)
  // Force clear the input after selection with a small delay
  setTimeout(() => {
    keywordInput.value = ''
  }, 10)
}

const addKeyword = (value: string): void => {
  if (!value || searchKeywords.value.includes(value)) {
    keywordInput.value = '' // Clear input even if keyword already exists
    return
  }

  if (searchKeywords.value.length >= 5) {
    message.warning('สามารถค้นหาได้สูงสุด 5 คำเท่านั้น')
    keywordInput.value = '' // Clear input when limit reached
    return
  }

  searchKeywords.value.push(value)
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

const handleBackspace = (event: KeyboardEvent): void => {
  // If input is empty and backspace is pressed, remove the last keyword
  if (keywordInput.value === '' && searchKeywords.value.length > 0) {
    event.preventDefault()
    searchKeywords.value.pop()
  }
}

const performSearch = async (): Promise<void> => {
  if (!canSearch.value) return

  searching.value = true

  // Reset infinite scroll state when performing new search
  infiniteScrollLoading.value = false
  isLoadingCards.value = false
  lastLoadTime.value = 0

  try {
    // Validate and sanitize creator ID
    const creatorParam = route.query.t as string
    const validCreatorId = validateCreatorId(creatorParam)

    // Validate and sanitize search inputs
    const validKeywords = validateSearchKeywords(searchKeywords.value)
    const validTags = selectedTags.value.map(tag => sanitizeTagName(tag)).filter(tag => tag.length > 0)

    // Use the actual search API
    if (validKeywords.length > 0) {
      // Use keyword search with or without tags
      await cardsStore.setSearchedCards({
        words: validKeywords,
        creator: validCreatorId,
        tags: validTags
      })
    } else if (validTags.length > 0) {
      // Use tag filter only
      await cardsStore.setFilteredCards({
        words: validTags,
        offset: 0,
        creator: validCreatorId
      })
    }

    // Track search analytics (with sanitized data)
    analytics.trackSearch({
      keywords: validKeywords,
      resultCount: cards.value.length,
      searchType: 'card',
      creatorId: validCreatorId
    })

  } catch (error) {
    console.error('Search error:', error)
    message.error('เกิดข้อผิดพลาดในการค้นหา')
  } finally {
    searching.value = false
  }
}

const clearSearch = (): void => {
  searchKeywords.value = []
}

const clearFilters = async (): Promise<void> => {
  selectedTags.value = []
  searchKeywords.value = []

  // Reset infinite scroll state
  infiniteScrollLoading.value = false
  isLoadingCards.value = false
  lastLoadTime.value = 0

  // Reset to show all cards
  const creatorId = route.query.t as string
  await cardsStore.getCardFromApi(parseInt(creatorId))
}

const openCardModal = (card: Card): void => {

  // Track card view
  analytics.trackCardView({
    cardId: card.cardId,
    cardTitle: card.cardDetail,
    creatorId: card.creatorId
  })

  cardModal.openCard(card, cards.value)
}

const copyCardText = async (): Promise<void> => {
  if (!cardModal.currentCard.value) return

  try {
    await navigator.clipboard.writeText(cardModal.currentCard.value.cardDetail)
    message.success('คัดลอกข้อความแล้ว')

    // Track copy analytics
    analytics.trackCardCopy({
      cardId: cardModal.currentCard.value.cardId,
      cardTitle: cardModal.currentCard.value.cardDetail,
      creatorId: cardModal.currentCard.value.creatorId
    })
  } catch (error) {
    console.error('Copy failed:', error)
    message.error('ไม่สามารถคัดลอกข้อความได้')
  }
}

const shareCard = async (): Promise<void> => {
  if (!cardModal.currentCard.value) return

  try {
    if (navigator.share) {
      await navigator.share({
        title: cardModal.currentCard.value.cardDetail,
        url: window.location.href
      })
    } else {
      // Fallback: copy URL to clipboard
      await navigator.clipboard.writeText(window.location.href)
      message.success('คัดลอกลิงก์แล้ว')
    }

    // Track share analytics
    analytics.trackCardShare({
      cardId: cardModal.currentCard.value.cardId,
      cardTitle: cardModal.currentCard.value.cardDetail,
      creatorId: cardModal.currentCard.value.creatorId
    })
  } catch (error) {
    console.error('Share failed:', error)
    message.error('ไม่สามารถแชร์ได้')
  }
}

// Loading state management
const infiniteScrollLoading = ref<boolean>(false)
const lastLoadTime = ref<number>(0)
const minLoadDelay = 1500 // Minimum delay between loads (ms)
const isLoadingCards = ref<boolean>(false) // Additional flag to prevent multiple calls

const loadMoreCards = async (): Promise<void> => {
  // Strong debouncing: prevent ANY concurrent calls
  if (infiniteScrollLoading.value || isLoadingCards.value) {
    return Promise.resolve()
  }

  // Check if there are more cards to load
  if (cards.value.length >= totalCards.value) {
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
  isLoadingCards.value = true
  lastLoadTime.value = now

  try {
    const creatorId = route.query.t as string

    // Validate creator ID
    if (!creatorId || isNaN(parseInt(creatorId))) {
      throw new Error('Invalid creator ID for infinite scroll')
    }

    const currentOffset = cards.value.length
    const toolbarFlag = cardsStore.getCheckToolbar


    // Add minimum loading time for better UX
    const loadingPromise = (async () => {
      switch (toolbarFlag) {
        case '':
          // Normal infinite scroll for all cards
          await cardsStore.setCardInfiniteScrolled({
            offset: currentOffset,
            creator: parseInt(creatorId)
          })
          break

        case 'filter':
          // Infinite scroll for filtered cards (tag filter only)
          await cardsStore.setFilteredCardsContinue({
            words: selectedTags.value,
            offset: currentOffset,
            creator: parseInt(creatorId)
          })
          break

        case 'search':
          // Infinite scroll for searched cards (keyword + tag search)
          await cardsStore.setSearchedCardsContinue({
            words: searchKeywords.value,
            offset: currentOffset,
            creator: parseInt(creatorId),
            tags: selectedTags.value
          })
          break

        default:
          console.warn('Unknown toolbar flag:', toolbarFlag)
          break
      }
    })()

    // Ensure minimum loading time for better UX
    const minDelayPromise = new Promise(resolve => setTimeout(resolve, 1000))

    await Promise.all([loadingPromise, minDelayPromise])


  } catch (error) {
    console.error('Load more cards error:', error)

    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes('Invalid creator ID')) {
        message.error('ไม่สามารถโหลดการ์ดได้: รหัสผู้สร้างไม่ถูกต้อง')
      } else if (error.message.includes('Network')) {
        message.error('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง')
      } else {
        message.error('เกิดข้อผิดพลาดในการโหลดการ์ดเพิ่มเติม')
      }
    } else {
      message.error('เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ')
    }

    // Don't re-throw to prevent breaking the infinite scroll component
    // Instead, allow it to retry later
  } finally {
    // Clear both loading flags
    infiniteScrollLoading.value = false
    isLoadingCards.value = false
  }
}

// Lifecycle
onMounted(async () => {
  const creatorId = route.query.t as string

  // Ensure creatorId is valid before making API calls
  if (!creatorId || isNaN(parseInt(creatorId))) {
    console.error('Invalid creator ID:', creatorId)
    return
  }

  try {
    // Load cards and tags data
    await Promise.all([
      cardsStore.getCardFromApi(parseInt(creatorId)),
      cardsStore.getTagOfCards(parseInt(creatorId))
    ])
  } catch (error) {
    console.error('Error loading cards data:', error)
  }
})
</script>

<style scoped>

.filter-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.tag-select,
.keyword-input {
  flex: 1;
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

.filter-stats {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
}

.cards-grid {
  font-family: 'Sarabun', sans-serif;
}

.cards-container {
  width: 100%;
}

.card-item {
  display: flex;
  justify-content: center;
}

.card-click-wrapper {
  width: 100%;
  max-width: 250px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.card-wrapper {
  width: 100%;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card-click-wrapper:hover .card-wrapper {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card-click-wrapper:active .card-wrapper {
  transform: translateY(-2px);
}

/* Card Section Styling */
.card-header-custom {
  padding: 12px;
  min-height: 50px;
  display: flex;
  align-items: center;
}

.card-content-custom {
  padding: 0;
  flex: 1;
}

.card-cover-container {
  position: relative;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
}

.card-cover {
  width: 100%;
  transition: transform 0.3s ease;
}

.card-click-wrapper:hover .card-cover {
  transform: scale(1.05);
}

.tags-container {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 10;
}

.tag-badge {
  backdrop-filter: blur(4px);
  background: rgba(255, 255, 255, 0.9);
  font-size: 10px;
}

.card-title {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  color: #333;
}


.empty-state {
  margin: 60px 0;
  font-family: 'Sarabun', sans-serif;
}

/* Modal Styles */
.card-modal {
  font-family: 'Sarabun', sans-serif;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-image-container {
  text-align: center;
}

.modal-image {
  max-height: 400px;
  border-radius: 8px;
}

.modal-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.modal-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.modal-tag {
  font-size: 12px;
}

.modal-actions {
  margin-top: 16px;
}

/* Infinite Scroll Styles */
.cards-infinite-scroll {
  width: 100%;
}

.infinite-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.02));
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


/* Mobile Responsiveness */
@media (max-width: 768px) {
  .filter-card {
    margin-bottom: 16px;
  }

  .card-click-wrapper {
    max-width: 180px;
  }

  .card-title {
    font-size: 13px;
  }

  .view-button {
    font-size: 12px;
    padding: 0 12px;
  }

  .filter-stats {
    font-size: 13px;
  }

  .keyword-tag {
    font-size: 12px;
  }

  .card-modal {
    width: 95vw !important;
  }
}

@media (max-width: 480px) {
  .card-click-wrapper {
    max-width: 160px;
  }

  .card-title {
    font-size: 12px;
  }

  .view-button {
    font-size: 11px;
    padding: 0 8px;
  }

  .tag-badge {
    font-size: 8px;
    padding: 2px 6px;
  }
}
</style>