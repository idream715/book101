<template>
  <div class="homep">
    <!-- V1 Routes: Vuetify Layout -->
    <v-app v-if="!isV2Route">
      <navbar></navbar>
      <v-main id="app">
        <router-view/>
      </v-main>
    </v-app>

    <!-- V2 Routes: Naive UI Layout -->
    <n-config-provider v-else :theme="null">
      <n-message-provider>
        <n-notification-provider>
          <n-dialog-provider>
            <n-loading-bar-provider>
              <div id="app-v2">
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
import navbar from '@/components/Navbar.vue'
import { watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSearchStore, useCardsStore, useBooksStore } from '@/stores'
import {
  NConfigProvider,
  NMessageProvider,
  NNotificationProvider,
  NDialogProvider,
  NLoadingBarProvider
} from 'naive-ui'

// Initialize stores
const route = useRoute()
const searchStore = useSearchStore()
const cardsStore = useCardsStore()
const booksStore = useBooksStore()

// Detect if current route is V2 (Naive UI)
const isV2Route = computed(() => {
  return route.path.startsWith('/v2')
})

console.log('v2 route: ' + isV2Route.value)

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