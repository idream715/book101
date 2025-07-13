import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSearch } from '@/composables/useSearch'
import { createPinia, setActivePinia } from 'pinia'

// Mock the search store
const mockSearchStore = {
  getoverlay: false,
  searchContent: vi.fn()
}

vi.mock('@/stores/search', () => ({
  useSearchStore: vi.fn(() => mockSearchStore)
}))

describe('useSearch composable', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default state', () => {
    const {
      searchKeywords,
      searchResults,
      searchType,
      currentCreator,
      selectedTags,
      isSearching,
      hasMoreResults,
      isValidSearch
    } = useSearch()

    expect(searchKeywords.value).toEqual([])
    expect(searchResults.value).toEqual([])
    expect(searchType.value).toBe('all')
    expect(currentCreator.value).toBe(1)
    expect(selectedTags.value).toEqual([])
    expect(isSearching.value).toBe(false)
    expect(hasMoreResults.value).toBe(true)
    expect(isValidSearch.value).toBe(false)
  })

  it('adds keywords correctly', () => {
    const { searchKeywords, addKeyword, isValidSearch } = useSearch()

    addKeyword('ธรรมะ')
    expect(searchKeywords.value).toEqual(['ธรรมะ'])
    expect(isValidSearch.value).toBe(true)

    addKeyword('สมาธิ')
    expect(searchKeywords.value).toEqual(['ธรรมะ', 'สมาธิ'])
  })

  it('prevents duplicate keywords', () => {
    const { searchKeywords, addKeyword } = useSearch()

    addKeyword('ธรรมะ')
    addKeyword('ธรรมะ')
    expect(searchKeywords.value).toEqual(['ธรรมะ'])
  })

  it('limits keywords to 5', () => {
    const { searchKeywords, addKeyword } = useSearch()

    for (let i = 1; i <= 6; i++) {
      addKeyword(`keyword${i}`)
    }

    expect(searchKeywords.value).toHaveLength(5)
    expect(searchKeywords.value).toEqual(['keyword1', 'keyword2', 'keyword3', 'keyword4', 'keyword5'])
  })

  it('removes keywords correctly', () => {
    const { searchKeywords, addKeyword, removeKeyword } = useSearch()

    addKeyword('ธรรมะ')
    addKeyword('สมาธิ')
    addKeyword('ปัญญา')

    removeKeyword(1) // Remove 'สมาธิ'
    expect(searchKeywords.value).toEqual(['ธรรมะ', 'ปัญญา'])
  })

  it('clears keywords correctly', () => {
    const { searchKeywords, addKeyword, clearKeywords } = useSearch()

    addKeyword('ธรรมะ')
    addKeyword('สมาธิ')
    expect(searchKeywords.value).toHaveLength(2)

    clearKeywords()
    expect(searchKeywords.value).toEqual([])
  })

  it('validates search correctly', () => {
    const { isValidSearch, addKeyword, clearKeywords } = useSearch()

    expect(isValidSearch.value).toBe(false)

    addKeyword('ธรรมะ')
    expect(isValidSearch.value).toBe(true)

    // Add 5 keywords (max limit)
    clearKeywords()
    for (let i = 1; i <= 5; i++) {
      addKeyword(`keyword${i}`)
    }
    expect(isValidSearch.value).toBe(true)
  })

  it('generates search query correctly', () => {
    const { searchQuery, addKeyword } = useSearch()

    addKeyword('ธรรมะ')
    addKeyword('สมาธิ')
    expect(searchQuery.value).toBe('ธรรมะ สมาธิ')
  })

  it('sets search type correctly', () => {
    const { searchType, setSearchType } = useSearch()

    setSearchType('book')
    expect(searchType.value).toBe('book')

    setSearchType('card')
    expect(searchType.value).toBe('card')
  })

  it('sets creator correctly', () => {
    const { currentCreator, setCreator } = useSearch()

    setCreator(2)
    expect(currentCreator.value).toBe(2)
  })

  it('highlights keywords correctly', () => {
    const { highlightKeywords } = useSearch()

    const text = 'ธรรมะคือสิ่งที่ดีงาม สมาธิคือการฝึกใจ'
    const keywords = ['ธรรมะ', 'สมาธิ']
    const result = highlightKeywords(text, keywords)

    expect(result).toBe('<mark>ธรรมะ</mark>คือสิ่งที่ดีงาม <mark>สมาธิ</mark>คือการฝึกใจ')
  })

  it('clears search correctly', () => {
    const {
      searchKeywords,
      searchResults,
      selectedTags,
      hasMoreResults,
      addKeyword,
      clearSearch
    } = useSearch()

    addKeyword('ธรรมะ')
    searchResults.value = [{ id: 1, title: 'Test', content: 'Content', type: 'book', creatorId: 1 }]
    selectedTags.value = ['tag1']
    hasMoreResults.value = false

    clearSearch()

    expect(searchKeywords.value).toEqual([])
    expect(searchResults.value).toEqual([])
    expect(selectedTags.value).toEqual([])
    expect(hasMoreResults.value).toBe(true)
  })
})