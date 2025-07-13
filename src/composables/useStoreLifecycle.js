import { onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSearchStore, useCardsStore, useBooksStore } from '@/stores'

/**
 * Composable for managing Pinia store lifecycle
 * Provides consistent store initialization and cleanup patterns
 */
export function useStoreLifecycle(options = {}) {
  const {
    clearOnMount = false,
    clearOnUnmount = false,
    clearOnCreatorChange = true,
    autoInitialize = true,
    stores = ['search', 'cards', 'books']
  } = options

  const route = useRoute()
  const storeInstances = {}

  // Initialize store instances based on options
  if (stores.includes('search')) storeInstances.search = useSearchStore()
  if (stores.includes('cards')) storeInstances.cards = useCardsStore()
  if (stores.includes('books')) storeInstances.books = useBooksStore()

  /**
   * Clear all enabled stores
   */
  const clearAllStores = () => {
    Object.values(storeInstances).forEach(store => {
      if (store && typeof store.clear === 'function') {
        store.clear()
      }
    })
  }

  /**
   * Clear specific store
   */
  const clearStore = (storeName) => {
    const store = storeInstances[storeName]
    if (store && typeof store.clear === 'function') {
      store.clear()
    }
  }

  /**
   * Initialize stores with creator parameter
   */
  const initializeStores = (creator) => {
    if (!creator || !autoInitialize) return

    // Initialize stores based on current route and creator
    if (storeInstances.search) {
      // Search store initialization handled by specific components
    }
    
    if (storeInstances.cards) {
      // Cards store initialization handled by specific components
    }
    
    if (storeInstances.books) {
      // Books store initialization handled by specific components
    }
  }

  // Watch for creator changes and clear stores if needed
  if (clearOnCreatorChange) {
    watch(
      () => route.query.t,
      (newCreator, oldCreator) => {
        if (newCreator !== oldCreator && oldCreator !== undefined) {
          clearAllStores()
          if (autoInitialize) {
            initializeStores(newCreator)
          }
        }
      }
    )
  }

  // Lifecycle hooks
  if (clearOnMount) {
    onMounted(() => {
      clearAllStores()
    })
  }

  if (clearOnUnmount) {
    onBeforeUnmount(() => {
      clearAllStores()
    })
  }

  return {
    stores: storeInstances,
    clearAllStores,
    clearStore,
    initializeStores
  }
}

/**
 * Specialized composable for search components
 */
export function useSearchLifecycle() {
  return useStoreLifecycle({
    stores: ['search'],
    clearOnMount: true,
    clearOnUnmount: true,
    clearOnCreatorChange: true
  })
}

/**
 * Specialized composable for cards components
 */
export function useCardsLifecycle() {
  return useStoreLifecycle({
    stores: ['cards'],
    clearOnMount: true,
    clearOnUnmount: false,
    clearOnCreatorChange: true
  })
}

/**
 * Specialized composable for books components
 */
export function useBooksLifecycle() {
  return useStoreLifecycle({
    stores: ['books'],
    clearOnMount: false,
    clearOnUnmount: false,
    clearOnCreatorChange: true
  })
}