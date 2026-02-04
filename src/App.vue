<template>
  <div class="homep">
    <!-- Pure Naive UI Layout -->
    <n-config-provider :theme="null">
      <n-message-provider>
        <n-notification-provider>
          <n-dialog-provider>
            <n-loading-bar-provider>
              <div id="app">
                <router-view/>
              </div>
            </n-loading-bar-provider>
          </n-dialog-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-config-provider>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSearchStore, useCardsStore, useBooksStore } from '@/stores'
// Naive UI components are auto-imported via unplugin-vue-components

// Initialize stores
const route = useRoute()
const searchStore = useSearchStore()
const cardsStore = useCardsStore()
const booksStore = useBooksStore()

// Clear stores when creator changes to prevent state pollution
watch(
  () => route.query.t,
  (newCreator, oldCreator) => {
    if (newCreator !== oldCreator && oldCreator !== undefined) {
      // Clear all stores when switching between creators
      searchStore.clear()
      cardsStore.clear()
      booksStore.clear()
    }
  }
)

// Clear overlay state when navigating to Home page
watch(
  () => route.name,
  (newRoute) => {
    if (newRoute === 'Home') {
      // Ensure no overlay is active on the homepage
      searchStore.overlay = false
    }
  }
)
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Prompt&display=swap');
.homep {
    font-family: 'Prompt', sans-serif;
  }
</style>