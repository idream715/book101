import { ref, computed } from 'vue'
import { useSearchStore } from '@/stores/search'

export interface SearchResult {
  id: number
  title: string
  content: string
  type: 'book' | 'card' | 'short'
  creatorId: number
  highlights?: string[]
}

export interface SearchParams {
  keywords: string[]
  creator: number
  type?: 'book' | 'card' | 'short'
  tags?: string[]
  offset?: number
  limit?: number
}

export function useSearch() {
  const searchStore = useSearchStore()

  // Reactive state
  const searchKeywords = ref<string[]>([])
  const searchResults = ref<SearchResult[]>([])
  const searchType = ref<'book' | 'card' | 'short' | 'all'>('all')
  const currentCreator = ref<number>(1)
  const selectedTags = ref<string[]>([])
  const searchOffset = ref<number>(0)
  const hasMoreResults = ref<boolean>(true)
  const isSearching = ref<boolean>(false)

  // Computed properties
  const loading = computed((): boolean => searchStore.getoverlay)
  
  const isValidSearch = computed((): boolean => {
    return searchKeywords.value.length > 0 && searchKeywords.value.length <= 5
  })

  const searchQuery = computed((): string => {
    return searchKeywords.value.join(' ')
  })

  // Methods
  const addKeyword = (keyword: string) => {
    if (keyword.trim() && !searchKeywords.value.includes(keyword.trim()) && searchKeywords.value.length < 5) {
      searchKeywords.value.push(keyword.trim())
    }
  }

  const removeKeyword = (index: number) => {
    searchKeywords.value.splice(index, 1)
  }

  const clearKeywords = () => {
    searchKeywords.value = []
  }

  const setSearchType = (type: 'book' | 'card' | 'short' | 'all') => {
    searchType.value = type
  }

  const setCreator = (creatorId: number) => {
    currentCreator.value = creatorId
  }

  const performSearch = async (params?: Partial<SearchParams>) => {
    if (!isValidSearch.value) return

    isSearching.value = true
    searchOffset.value = 0
    hasMoreResults.value = true

    const searchParams: SearchParams = {
      keywords: searchKeywords.value,
      creator: currentCreator.value,
      type: searchType.value === 'all' ? undefined : searchType.value,
      tags: selectedTags.value,
      offset: 0,
      limit: 20,
      ...params
    }

    try {
      // This would be implemented with the actual API call
      // For now, we'll use the existing search store
      const results = await searchStore.searchContent(searchParams)
      searchResults.value = results
      searchOffset.value = searchParams.limit || 20
    } catch (error) {
      console.error('Search error:', error)
      searchResults.value = []
    } finally {
      isSearching.value = false
    }
  }

  const loadMoreResults = async () => {
    if (!hasMoreResults.value || isSearching.value) return

    isSearching.value = true

    const searchParams: SearchParams = {
      keywords: searchKeywords.value,
      creator: currentCreator.value,
      type: searchType.value === 'all' ? undefined : searchType.value,
      tags: selectedTags.value,
      offset: searchOffset.value,
      limit: 20
    }

    try {
      const results = await searchStore.searchContent(searchParams)
      if (results.length === 0) {
        hasMoreResults.value = false
      } else {
        searchResults.value.push(...results)
        searchOffset.value += searchParams.limit || 20
      }
    } catch (error) {
      console.error('Load more error:', error)
    } finally {
      isSearching.value = false
    }
  }

  const clearSearch = () => {
    searchKeywords.value = []
    searchResults.value = []
    searchOffset.value = 0
    hasMoreResults.value = true
    selectedTags.value = []
  }

  const highlightKeywords = (text: string, keywords: string[]): string => {
    if (!keywords.length) return text

    let highlightedText = text
    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi')
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>')
    })
    return highlightedText
  }

  return {
    // State
    searchKeywords,
    searchResults,
    searchType,
    currentCreator,
    selectedTags,
    loading,
    isSearching,
    hasMoreResults,
    
    // Computed
    isValidSearch,
    searchQuery,
    
    // Methods
    addKeyword,
    removeKeyword,
    clearKeywords,
    setSearchType,
    setCreator,
    performSearch,
    loadMoreResults,
    clearSearch,
    highlightKeywords
  }
}