<template>
  <div class="search-layout">
    <!-- Search Header -->
    <div class="search-header">
      <n-card class="search-card">
        <div class="search-content">
          <!-- Search Input Section -->
          <div class="search-input-section">
            <n-space vertical :size="16">
              <div class="search-title">
                <h2>{{ title || 'ค้นหาเนื้อหา' }}</h2>
                <p v-if="subtitle" class="search-subtitle">{{ subtitle }}</p>
              </div>
              
              <div class="search-form">
                <slot name="search-form" />
              </div>
            </n-space>
          </div>

          <!-- Search Options -->
          <div v-if="$slots.options" class="search-options">
            <slot name="options" />
          </div>
        </div>
      </n-card>
    </div>

    <!-- Search Results Section -->
    <div v-if="showResults" class="search-results">
      <!-- Results Header -->
      <div class="results-header">
        <n-space justify="space-between" align="center">
          <div class="results-info">
            <n-text v-if="resultCount !== undefined">
              {{ resultText }}
            </n-text>
          </div>
          
          <div v-if="$slots['results-actions']" class="results-actions">
            <slot name="results-actions" />
          </div>
        </n-space>
      </div>

      <!-- Results Content -->
      <div class="results-content">
        <slot name="results" />
      </div>
    </div>

    <!-- No Results State -->
    <div v-if="showNoResults" class="no-results">
      <n-empty
        description="ไม่พบผลลัพธ์ที่ตรงกับการค้นหา"
        size="large"
      >
        <template #extra>
          <n-space vertical align="center">
            <n-text depth="3">ลองใช้คำค้นหาอื่นหรือปรับเงื่อนไขการค้นหา</n-text>
            <slot name="no-results-actions" />
          </n-space>
        </template>
      </n-empty>
    </div>

    <!-- Search Suggestions -->
    <div v-if="showSuggestions && suggestions.length > 0" class="search-suggestions">
      <n-card title="คำแนะนำการค้นหา">
        <n-space>
          <n-tag
            v-for="suggestion in suggestions"
            :key="suggestion"
            :bordered="false"
            checkable
            @click="$emit('suggestion-click', suggestion)"
            class="suggestion-tag"
          >
            {{ suggestion }}
          </n-tag>
        </n-space>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface SearchLayoutProps {
  title?: string
  subtitle?: string
  showResults?: boolean
  showNoResults?: boolean
  showSuggestions?: boolean
  resultCount?: number
  searchKeywords?: string[]
  suggestions?: string[]
}

const props = withDefaults(defineProps<SearchLayoutProps>(), {
  showResults: false,
  showNoResults: false,
  showSuggestions: false,
  searchKeywords: () => [],
  suggestions: () => []
})

// Emits
const emit = defineEmits<{
  'suggestion-click': [suggestion: string]
}>()

// Computed
const resultText = computed(() => {
  if (props.resultCount === undefined) return ''
  
  const count = props.resultCount
  const keywords = props.searchKeywords.join(', ')
  
  if (count === 0) {
    return keywords 
      ? `ไม่พบผลลัพธ์สำหรับ "${keywords}"`
      : 'ไม่พบผลลัพธ์'
  }
  
  const resultWord = count === 1 ? 'ผลลัพธ์' : 'ผลลัพธ์'
  return keywords
    ? `พบ ${count} ${resultWord} สำหรับ "${keywords}"`
    : `พบ ${count} ${resultWord}`
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap');

.search-layout {
  font-family: 'Sarabun', sans-serif;
}

.search-header {
  margin-bottom: 24px;
}

.search-card {
  border: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

.search-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-input-section {
  flex: 1;
}

.search-title h2 {
  font-family: 'Sarabun', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.search-subtitle {
  font-family: 'Sarabun', sans-serif;
  font-size: 16px;
  color: #4a5568;
  margin: 0;
  line-height: 1.6;
}

.search-form {
  width: 100%;
}

.search-options {
  border-top: 1px solid #e2e8f0;
  padding-top: 20px;
}

.search-results {
  margin-bottom: 32px;
}

.results-header {
  margin-bottom: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #e2e8f0;
}

.results-info {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
  color: #4a5568;
}

.results-actions {
  flex-shrink: 0;
}

.results-content {
  margin-top: 16px;
}

.no-results {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  margin: 32px 0;
}

.search-suggestions {
  margin-top: 24px;
}

.suggestion-tag {
  cursor: pointer;
  transition: all 0.3s ease;
}

.suggestion-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .search-content {
    gap: 16px;
  }
  
  .search-title h2 {
    font-size: 24px;
  }
  
  .search-subtitle {
    font-size: 14px;
  }
  
  .results-header :deep(.n-space) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .search-header {
    margin-bottom: 16px;
  }
}

@media (max-width: 480px) {
  .search-title h2 {
    font-size: 20px;
  }
  
  .search-subtitle {
    font-size: 13px;
  }
  
  .no-results {
    min-height: 200px;
    margin: 24px 0;
  }
  
  .search-suggestions {
    margin-top: 16px;
  }
}
</style>