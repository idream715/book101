import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export interface InfiniteScrollOptions {
  threshold?: number
  debounceMs?: number
  initialLoad?: boolean
  minLoadDelay?: number
  limit?: number
  enableAdvancedDebouncing?: boolean
}

export interface InfiniteScrollReturn<T> {
  items: Ref<T[]>
  loading: Ref<boolean>
  hasMore: Ref<boolean>
  error: Ref<string | null>
  loadMore: () => Promise<void>
  refresh: () => Promise<void>
  reset: () => void
  totalCount: Ref<number>
}

export function useInfiniteScroll<T>(
  fetchFn: (offset: number, limit: number) => Promise<{ items: T[]; total?: number }>,
  options: InfiniteScrollOptions = {}
): InfiniteScrollReturn<T> {
  const {
    threshold = 100,
    debounceMs = 1500, // Increased from 200ms to match Cards/Search implementation
    initialLoad = true,
    minLoadDelay = 1000, // Minimum loading time for better UX
    limit = 50, // Increased default limit
    enableAdvancedDebouncing = true
  } = options

  // Reactive state
  const items: Ref<T[]> = ref([])
  const loading = ref<boolean>(false)
  const hasMore = ref<boolean>(true)
  const error = ref<string | null>(null)
  const totalCount = ref<number>(0)
  const offset = ref<number>(0)
  
  // Advanced debouncing state (matching Cards/Search implementation)
  const isLoadingResults = ref<boolean>(false)
  const lastLoadTime = ref<number>(0)
  
  // Internal state
  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  let isInitialized = false

  const loadMore = async (): Promise<void> => {
    // Advanced debouncing logic from Cards/Search components
    if (enableAdvancedDebouncing) {
      // Strong debouncing: prevent ANY concurrent calls
      if (loading.value || isLoadingResults.value) {
        console.log('Load already in progress, skipping...')
        return Promise.resolve()
      }

      // Check if there are more results to load based on total count
      if (totalCount.value > 0 && items.value.length >= totalCount.value) {
        console.log('No more results to load')
        hasMore.value = false
        return Promise.resolve()
      }

      // Time-based debouncing: prevent too frequent calls
      const now = Date.now()
      const timeSinceLastLoad = now - lastLoadTime.value
      if (timeSinceLastLoad < debounceMs) {
        console.log(`Debouncing: ${debounceMs - timeSinceLastLoad}ms remaining`)
        return Promise.resolve()
      }

      // Set both loading flags immediately
      loading.value = true
      isLoadingResults.value = true
      lastLoadTime.value = now
    } else {
      // Simple debouncing (original logic)
      if (loading.value || !hasMore.value) return
      loading.value = true
    }

    error.value = null

    try {
      const currentOffset = items.value.length
      
      console.log('Loading more items:', {
        currentOffset,
        limit,
        totalCount: totalCount.value,
        timeSinceLastLoad: enableAdvancedDebouncing ? Date.now() - lastLoadTime.value : 'N/A'
      })

      // Add minimum loading time for better UX (matching Cards/Search)
      const loadingPromise = fetchFn(currentOffset, limit)
      const minDelayPromise = enableAdvancedDebouncing ? 
        new Promise(resolve => setTimeout(resolve, minLoadDelay)) : 
        Promise.resolve()

      const [result] = await Promise.all([loadingPromise, minDelayPromise])
      
      if (result.items.length === 0) {
        hasMore.value = false
        console.log('No more items to load')
      } else {
        items.value = [...items.value, ...result.items]
        offset.value = items.value.length
        
        // Update total count if provided
        if (result.total !== undefined) {
          totalCount.value = result.total
          // Check if we've loaded all items
          if (items.value.length >= result.total) {
            hasMore.value = false
          }
        }
        
        console.log('Items loaded successfully:', {
          newItems: result.items.length,
          totalItems: items.value.length,
          totalCount: totalCount.value,
          hasMore: hasMore.value
        })
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Infinite scroll load error:', err)
      
      // More specific error handling (matching Search implementation)
      if (enableAdvancedDebouncing && err instanceof Error) {
        if (err.message.includes('Network')) {
          error.value = 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง'
        } else {
          error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูลเพิ่มเติม'
        }
      }
    } finally {
      loading.value = false
      if (enableAdvancedDebouncing) {
        isLoadingResults.value = false
      }
    }
  }

  const refresh = async (): Promise<void> => {
    reset()
    await loadMore()
  }

  const reset = (): void => {
    items.value = []
    offset.value = 0
    hasMore.value = true
    error.value = null
    loading.value = false
    totalCount.value = 0
    
    // Reset advanced debouncing state
    if (enableAdvancedDebouncing) {
      isLoadingResults.value = false
      lastLoadTime.value = 0
    }
  }

  const debouncedLoadMore = (): void => {
    if (debounceTimer) clearTimeout(debounceTimer)
    
    debounceTimer = setTimeout(() => {
      loadMore()
    }, debounceMs)
  }

  const handleScroll = (): void => {
    if (loading.value || !hasMore.value) return

    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    // Check if we're near the bottom
    const distanceFromBottom = documentHeight - (scrollTop + windowHeight)
    
    if (distanceFromBottom <= threshold) {
      debouncedLoadMore()
    }
  }

  // Lifecycle
  onMounted(() => {
    if (initialLoad && !isInitialized) {
      isInitialized = true
      loadMore()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    if (debounceTimer) clearTimeout(debounceTimer)
  })

  return {
    items,
    loading,
    hasMore,
    error,
    loadMore,
    refresh,
    reset,
    totalCount
  }
}

// Alternative hook for element-based infinite scroll with enhanced debouncing
export function useElementInfiniteScroll<T>(
  fetchFn: (offset: number, limit: number) => Promise<{ items: T[]; total?: number }>,
  containerRef: Ref<HTMLElement | null>,
  options: InfiniteScrollOptions = {}
): InfiniteScrollReturn<T> {
  const {
    threshold = 100,
    debounceMs = 1500, // Enhanced debouncing
    initialLoad = true,
    minLoadDelay = 1000,
    limit = 50,
    enableAdvancedDebouncing = true
  } = options

  // Reactive state
  const items: Ref<T[]> = ref([])
  const loading = ref<boolean>(false)
  const hasMore = ref<boolean>(true)
  const error = ref<string | null>(null)
  const totalCount = ref<number>(0)
  const offset = ref<number>(0)
  
  // Advanced debouncing state
  const isLoadingResults = ref<boolean>(false)
  const lastLoadTime = ref<number>(0)
  
  // Internal state
  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  let observer: IntersectionObserver | null = null

  const loadMore = async (): Promise<void> => {
    // Enhanced debouncing logic (same as main function)
    if (enableAdvancedDebouncing) {
      if (loading.value || isLoadingResults.value) {
        console.log('Element scroll: Load already in progress, skipping...')
        return Promise.resolve()
      }

      if (totalCount.value > 0 && items.value.length >= totalCount.value) {
        console.log('Element scroll: No more results to load')
        hasMore.value = false
        return Promise.resolve()
      }

      const now = Date.now()
      const timeSinceLastLoad = now - lastLoadTime.value
      if (timeSinceLastLoad < debounceMs) {
        console.log(`Element scroll: Debouncing: ${debounceMs - timeSinceLastLoad}ms remaining`)
        return Promise.resolve()
      }

      loading.value = true
      isLoadingResults.value = true
      lastLoadTime.value = now
    } else {
      if (loading.value || !hasMore.value) return
      loading.value = true
    }

    error.value = null

    try {
      const currentOffset = items.value.length
      
      const loadingPromise = fetchFn(currentOffset, limit)
      const minDelayPromise = enableAdvancedDebouncing ? 
        new Promise(resolve => setTimeout(resolve, minLoadDelay)) : 
        Promise.resolve()

      const [result] = await Promise.all([loadingPromise, minDelayPromise])
      
      if (result.items.length === 0) {
        hasMore.value = false
      } else {
        items.value = [...items.value, ...result.items]
        offset.value = items.value.length
        
        if (result.total !== undefined) {
          totalCount.value = result.total
          if (items.value.length >= result.total) {
            hasMore.value = false
          }
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Element infinite scroll load error:', err)
      
      if (enableAdvancedDebouncing && err instanceof Error) {
        if (err.message.includes('Network')) {
          error.value = 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง'
        } else {
          error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูลเพิ่มเติม'
        }
      }
    } finally {
      loading.value = false
      if (enableAdvancedDebouncing) {
        isLoadingResults.value = false
      }
    }
  }

  const refresh = async (): Promise<void> => {
    reset()
    await loadMore()
  }

  const reset = (): void => {
    items.value = []
    offset.value = 0
    hasMore.value = true
    error.value = null
    loading.value = false
    totalCount.value = 0
    
    if (enableAdvancedDebouncing) {
      isLoadingResults.value = false
      lastLoadTime.value = 0
    }
  }

  const debouncedLoadMore = (): void => {
    if (debounceTimer) clearTimeout(debounceTimer)
    
    debounceTimer = setTimeout(() => {
      loadMore()
    }, debounceMs)
  }

  // Setup intersection observer
  const setupObserver = (container: HTMLElement): void => {
    if (observer) observer.disconnect()

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loading.value && hasMore.value) {
            debouncedLoadMore()
          }
        })
      },
      {
        root: container,
        rootMargin: `${threshold}px`
      }
    )

    // Create a sentinel element at the bottom
    const sentinel = document.createElement('div')
    sentinel.style.height = '1px'
    container.appendChild(sentinel)
    observer.observe(sentinel)
  }

  // Lifecycle
  onMounted(() => {
    if (initialLoad) {
      loadMore()
    }

    if (containerRef.value) {
      setupObserver(containerRef.value)
    }
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
    if (debounceTimer) clearTimeout(debounceTimer)
  })

  return {
    items,
    loading,
    hasMore,
    error,
    loadMore,
    refresh,
    reset,
    totalCount
  }
}