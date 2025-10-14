<template>
  <AppLayout>
    <ContentLayout
      title="รายละเอียดการ์ดธรรมะ"
      :description="pageTitle"
      :loading="loading || undefined"
      loading-text="กำลังโหลดการ์ด..."
    >
      <!-- Card Display with Grid Layout -->
      <n-grid v-if="card && !loading" cols="1 m:2" :x-gap="24" :y-gap="24" responsive="screen" class="card-detail-grid">
        <!-- Left: Card Image -->
        <n-grid-item>
          <div>
            <n-image
              :src="card.cardPic"
              :alt="`การ์ด ${card.cardDetail}`"
              width="100%"
              object-fit="contain"
              class="card-full-image"
              :fallback-src="'/logo2.png'"
            />
          </div>
        </n-grid-item>

        <!-- Right: Card Details -->
        <n-grid-item>
          <n-card class="info-card">
            <h2 class="card-title">{{ card.cardDetail }}</h2>

            <!-- Tags -->
            <div v-if="card.cardTags && card.cardTags.length > 0" class="card-tags">
              <n-tag
                v-for="tag in card.cardTags"
                :key="tag"
                type="info"
                class="card-tag"
              >
                {{ tag }}
              </n-tag>
            </div>

            <!-- Action Buttons -->
            <div class="card-actions">
              <n-space vertical :size="12">
                <n-button
                  @click="shareCard"
                  type="primary"
                  size="large"
                  block
                >
                  <template #icon>
                    <n-icon>
                      <ShareAltOutlined />
                    </n-icon>
                  </template>
                  แชร์การ์ด
                </n-button>

                <n-button
                  @click="copyCardText"
                  type="primary"
                  ghost
                  size="large"
                  block
                >
                  <template #icon>
                    <n-icon>
                      <CopyOutlined />
                    </n-icon>
                  </template>
                  คัดลอกข้อความ
                </n-button>

                <n-button
                  @click="downloadCard"
                  type="success"
                  ghost
                  size="large"
                  block
                >
                  <template #icon>
                    <n-icon>
                      <DownloadOutlined />
                    </n-icon>
                  </template>
                  ดาวน์โหลดรูป
                </n-button>
              </n-space>
            </div>

            <!-- Navigation to Cards List -->
            <div class="navigation-section">
              <n-button
                @click="goBackToCards"
                text
                type="primary"
              >
                <template #icon>
                  <n-icon>
                    <LeftOutlined />
                  </n-icon>
                </template>
                กลับไปหน้าการ์ดทั้งหมด
              </n-button>
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>

      <!-- Not Found State -->
      <n-empty
        v-if="notFound && !loading"
        description="ไม่พบการ์ดที่ค้นหา"
        class="empty-state"
      >
        <template #extra>
          <n-button type="primary" @click="goBackToCards">
            กลับไปหน้าการ์ดทั้งหมด
          </n-button>
        </template>
      </n-empty>
    </ContentLayout>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessage, useLoadingBar } from 'naive-ui'
import { useHead } from '@unhead/vue'
import {
  CopyOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  LeftOutlined
} from '@vicons/antd'
import AppLayout from '@/components/layouts/AppLayout.vue'
import ContentLayout from '@/components/layouts/ContentLayout.vue'
import { useCardsStore } from '@/stores/cards'
import { useAnalytics } from '@/composables/useAnalytics'

// Types
interface Card {
  cardId: number
  cardDetail: string
  cardPicThumbnails: string
  cardPic: string
  cardTags?: string[]
  creatorId?: number
}

// Composables
const route = useRoute()
const router = useRouter()
const message = useMessage()
const loadingBar = useLoadingBar()
const cardsStore = useCardsStore()
const analytics = useAnalytics()

// State
const card = ref<Card | null>(null)
const loading = ref<boolean>(false)
const notFound = ref<boolean>(false)

// Computed
const pageTitle = computed(() => {
  if (card.value && card.value.cardDetail) {
    return card.value.cardDetail.length > 100
      ? card.value.cardDetail.substring(0, 100) + '...'
      : card.value.cardDetail
  }
  return 'การ์ดธรรมะ'
})

const cardUrl = computed(() => {
  const baseUrl = window.location.origin
  const creatorParam = route.query.t ? `?t=${route.query.t}` : ''
  return `${baseUrl}/card/${route.params.id}${creatorParam}`
})

// Dynamic meta tags for social sharing
const metaDescription = computed(() => {
  return (card.value && card.value.cardDetail) ? card.value.cardDetail : 'การ์ดธรรมะจาก Dhamma01.com'
})

const metaImage = computed(() => {
  return (card.value && card.value.cardPic) ? card.value.cardPic : '/logo2.png'
})

// Set page meta tags for SEO and social sharing
useHead({
  title: pageTitle,
  meta: [
    {
      name: 'description',
      content: metaDescription
    },
    // Open Graph / Facebook
    {
      property: 'og:type',
      content: 'article'
    },
    {
      property: 'og:title',
      content: pageTitle
    },
    {
      property: 'og:description',
      content: metaDescription
    },
    {
      property: 'og:image',
      content: metaImage
    },
    {
      property: 'og:url',
      content: cardUrl
    },
    // Twitter
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: pageTitle
    },
    {
      name: 'twitter:description',
      content: metaDescription
    },
    {
      name: 'twitter:image',
      content: metaImage
    }
  ]
})

// Methods
const loadCard = async () => {
  const cardId = parseInt(route.params.id as string)

  if (isNaN(cardId)) {
    notFound.value = true
    return
  }

  loading.value = true
  loadingBar.start()

  try {
    const loadedCard = await cardsStore.getCardById(cardId)

    if (loadedCard) {
      card.value = loadedCard
      notFound.value = false

      // Track card view
      analytics.trackCardView({
        cardId: loadedCard.cardId,
        cardTitle: loadedCard.cardDetail,
        creatorId: loadedCard.creatorId
      })
    } else {
      notFound.value = true
    }

    loadingBar.finish()
  } catch (error) {
    console.error('Error loading card:', error)
    message.error('เกิดข้อผิดพลาดในการโหลดการ์ด')
    notFound.value = true
    loadingBar.error()
  } finally {
    loading.value = false
  }
}

const copyCardText = async () => {
  if (!card.value) return

  try {
    await navigator.clipboard.writeText(card.value.cardDetail)
    message.success('คัดลอกข้อความแล้ว')

    analytics.trackCardCopy({
      cardId: card.value.cardId,
      cardTitle: card.value.cardDetail,
      creatorId: card.value.creatorId
    })
  } catch (error) {
    console.error('Copy failed:', error)
    message.error('ไม่สามารถคัดลอกข้อความได้')
  }
}

const shareCard = async () => {
  if (!card.value) return

  const shareData = {
    title: card.value.cardDetail,
    text: card.value.cardDetail,
    url: cardUrl.value
  }

  try {
    if (navigator.share && navigator.canShare(shareData)) {
      await navigator.share(shareData)
      message.success('แชร์สำเร็จ')

      analytics.trackCardShare({
        cardId: card.value.cardId,
        cardTitle: card.value.cardDetail,
        creatorId: card.value.creatorId
      })
    } else {
      // Fallback: Copy URL to clipboard
      await navigator.clipboard.writeText(cardUrl.value)
      message.success('คัดลอกลิงก์แล้ว')
    }
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      console.error('Share failed:', error)
      message.error('ไม่สามารถแชร์ได้')
    }
  }
}

const downloadCard = async () => {
  if (!card.value) return

  try {
    const response = await fetch(card.value.cardPic, {
      mode: 'cors',
      cache: 'no-cache'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch image')
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `card-${card.value.cardId}.jpg`
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()

    setTimeout(() => {
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }, 100)

    message.success('ดาวน์โหลดรูปภาพสำเร็จ')
  } catch (error) {
    console.error('Download failed:', error)
    message.error('ไม่สามารถดาวน์โหลดรูปภาพได้')
  }
}

const goBackToCards = () => {
  const creatorParam = route.query.t
  if (creatorParam) {
    router.push({ path: '/cards', query: { t: creatorParam } })
  } else {
    router.push('/cards')
  }
}

// Lifecycle
onMounted(() => {
  loadCard()
})

// Watch for route changes (if navigating between cards)
watch(() => route.params.id, () => {
  if (route.name === 'CardDetail') {
    loadCard()
  }
})
</script>

<style scoped>
.card-detail-grid {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Sarabun', sans-serif;
}

.card-full-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.info-card {
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.card-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  line-height: 1.5;
  font-family: 'Sarabun', sans-serif;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.card-tag {
  font-size: 13px;
}

.card-actions {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e6e6e6;
}

.navigation-section {
  display: flex;
  justify-content: flex-start;
}

.empty-state {
  margin: 60px 0;
  font-family: 'Sarabun', sans-serif;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .card-detail-grid {
    gap: 16px;
  }

  .card-image-section {
    padding: 16px;
    min-height: 300px;
  }

  .card-title {
    font-size: 20px;
  }

  .card-actions {
    margin-bottom: 16px;
    padding-bottom: 16px;
  }
}

@media (max-width: 480px) {
  .card-image-section {
    min-height: 250px;
    padding: 12px;
  }

  .card-title {
    font-size: 18px;
  }

  .card-tag {
    font-size: 12px;
  }
}
</style>
