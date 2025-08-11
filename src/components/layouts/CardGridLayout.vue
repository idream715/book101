<template>
  <div class="card-grid-layout">
    <!-- Grid Controls -->
    <div v-if="showControls" class="grid-controls">
      <n-card class="controls-card">
        <n-space justify="space-between" align="center">
          <div class="filter-section">
            <slot name="filters" />
          </div>
          
          <div class="view-controls">
            <n-space align="center">
              <n-text depth="3">มุมมอง:</n-text>
              <n-button-group>
                <n-button
                  :type="gridCols === 1 ? 'primary' : 'default'"
                  size="small"
                  @click="setGridCols(1)"
                >
                  <template #icon>
                    <n-icon :component="ListIcon" />
                  </template>
                </n-button>
                <n-button
                  :type="gridCols === 2 ? 'primary' : 'default'"
                  size="small"
                  @click="setGridCols(2)"
                >
                  <template #icon>
                    <n-icon :component="GridIcon" />
                  </template>
                </n-button>
                <n-button
                  :type="gridCols === 3 ? 'primary' : 'default'"
                  size="small"
                  @click="setGridCols(3)"
                >
                  <template #icon>
                    <n-icon :component="Grid3x3Icon" />
                  </template>
                </n-button>
              </n-button-group>
            </n-space>
          </div>
        </n-space>
      </n-card>
    </div>

    <!-- Grid Content -->
    <div class="grid-content">
      <n-grid
        :cols="responsiveCols"
        :x-gap="gap"
        :y-gap="gap"
        responsive="screen"
      >
        <n-grid-item
          v-for="(item, index) in items"
          :key="getItemKey(item, index)"
        >
          <slot name="item" :item="item" :index="index" />
        </n-grid-item>
      </n-grid>
    </div>

    <!-- Empty State -->
    <div v-if="isEmpty" class="empty-state">
      <n-empty
        :description="emptyText"
        size="large"
      >
        <template #extra>
          <slot name="empty-actions" />
        </template>
      </n-empty>
    </div>

    <!-- Load More -->
    <div v-if="showLoadMore" class="load-more">
      <n-space justify="center">
        <n-button
          :loading="loading"
          :disabled="!hasMore"
          @click="$emit('load-more')"
          size="large"
          secondary
        >
          {{ hasMore ? 'โหลดเพิ่มเติม' : 'ไม่มีข้อมูลเพิ่มเติม' }}
        </n-button>
      </n-space>
    </div>

    <!-- Infinite Scroll Trigger -->
    <div
      v-if="infiniteScroll"
      ref="scrollTrigger"
      class="scroll-trigger"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { 
  List as ListIcon, 
  Grid as GridIcon, 
  GridOutline as Grid3x3Icon 
} from '@vicons/ionicons5'

// Props
interface CardGridLayoutProps {
  items?: any[]
  keyField?: string
  showControls?: boolean
  showLoadMore?: boolean
  infiniteScroll?: boolean
  loading?: boolean
  hasMore?: boolean
  emptyText?: string
  gap?: number
}

const props = withDefaults(defineProps<CardGridLayoutProps>(), {
  items: () => [],
  keyField: 'id',
  showControls: true,
  showLoadMore: false,
  infiniteScroll: false,
  loading: false,
  hasMore: true,
  emptyText: 'ไม่พบข้อมูล',
  gap: 16
})

// Emits
const emit = defineEmits<{
  'load-more': []
  'grid-change': [cols: number]
}>()

// State
const gridCols = ref(2)
const scrollTrigger = ref<HTMLElement>()

// Computed
const isEmpty = computed(() => props.items.length === 0 && !props.loading)

const responsiveCols = computed(() => {
  const base = gridCols.value
  return {
    default: base,
    1000: Math.min(base, 3),
    768: Math.min(base, 2),
    480: 1
  }
})

// Methods
const setGridCols = (cols: number): void => {
  gridCols.value = cols
  emit('grid-change', cols)
}

const getItemKey = (item: any, index: number): string | number => {
  if (typeof item === 'object' && item[props.keyField]) {
    return item[props.keyField]
  }
  return index
}

// Infinite Scroll
let observer: IntersectionObserver | null = null

const setupInfiniteScroll = (): void => {
  if (!props.infiniteScroll || !scrollTrigger.value) return

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && props.hasMore && !props.loading) {
        emit('load-more')
      }
    },
    {
      threshold: 0.1,
      rootMargin: '100px'
    }
  )

  observer.observe(scrollTrigger.value)
}

const cleanupInfiniteScroll = (): void => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
}

// Lifecycle
onMounted(() => {
  setupInfiniteScroll()
})

onUnmounted(() => {
  cleanupInfiniteScroll()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600&display=swap');

.card-grid-layout {
  font-family: 'Sarabun', sans-serif;
}

.grid-controls {
  margin-bottom: 24px;
}

.controls-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-section {
  flex: 1;
}

.view-controls {
  flex-shrink: 0;
}

.grid-content {
  margin-bottom: 32px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.load-more {
  margin: 32px 0;
}

.scroll-trigger {
  height: 20px;
  margin: 20px 0;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .grid-controls .controls-card :deep(.n-space) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .view-controls {
    width: 100%;
    justify-content: center;
  }
  
  .grid-controls {
    margin-bottom: 16px;
  }
  
  .grid-content {
    margin-bottom: 24px;
  }
}

@media (max-width: 480px) {
  .empty-state {
    min-height: 200px;
  }
  
  .load-more {
    margin: 24px 0;
  }
}
</style>