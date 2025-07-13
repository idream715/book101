import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useBooks } from '@/composables/useBooks'
import { createPinia, setActivePinia } from 'pinia'

// Mock the stores
const mockBooksStore = {
  getBooks: [],
  getBooksFromApi: vi.fn()
}

const mockSearchStore = {
  getoverlay: false
}

vi.mock('@/stores/books', () => ({
  useBooksStore: vi.fn(() => mockBooksStore)
}))

vi.mock('@/stores/search', () => ({
  useSearchStore: vi.fn(() => mockSearchStore)
}))

vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({
    query: { t: '1' }
  }))
}))

describe('useBooks composable', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default state', () => {
    const { books, loading, categories, searchOptions, filteredBooks, filterBookValue } = useBooks()

    expect(books.value).toEqual([])
    expect(loading.value).toBe(false)
    expect(categories.value).toEqual([])
    expect(searchOptions.value).toEqual([])
    expect(filteredBooks.value).toEqual([])
    expect(filterBookValue.value).toBeNull()
  })

  it('filters books by category', async () => {
    const mockBooks = [
      { bookId: 1, bookName: 'Book 1', bookCoverThumbnails: '', categoryName: 'Category A' },
      { bookId: 2, bookName: 'Book 2', bookCoverThumbnails: '', categoryName: 'Category B' },
      { bookId: 3, bookName: 'Book 3', bookCoverThumbnails: '', categoryName: 'Category A' }
    ]

    // Update mock store with test books
    mockBooksStore.getBooks = mockBooks

    const { filteredBooks, setFilter } = useBooks()

    setFilter('Category A')
    
    expect(filteredBooks.value).toHaveLength(2)
    expect(filteredBooks.value.every(book => book.categoryName === 'Category A')).toBe(true)
  })

  it('filters books by name', async () => {
    const mockBooks = [
      { bookId: 1, bookName: 'ธรรมะ Book 1', bookCoverThumbnails: '', categoryName: 'Category A' },
      { bookId: 2, bookName: 'Other Book', bookCoverThumbnails: '', categoryName: 'Category B' },
      { bookId: 3, bookName: 'ธรรมะ Book 2', bookCoverThumbnails: '', categoryName: 'Category A' }
    ]

    mockBooksStore.getBooks = mockBooks

    const { filteredBooks, setFilter } = useBooks()

    setFilter('ธรรมะ')
    
    expect(filteredBooks.value).toHaveLength(2)
    expect(filteredBooks.value.every(book => book.bookName.includes('ธรรมะ'))).toBe(true)
  })

  it('generates correct search options', () => {
    const mockBooks = [
      { bookId: 1, bookName: 'Book 1', bookCoverThumbnails: '', categoryName: 'Category A' },
      { bookId: 2, bookName: 'Book 2', bookCoverThumbnails: '', categoryName: 'Category B' },
      { bookId: 3, bookName: 'Book 3', bookCoverThumbnails: '', categoryName: 'Category A' }
    ]

    mockBooksStore.getBooks = mockBooks

    const { searchOptions } = useBooks()

    expect(searchOptions.value).toEqual([
      { label: '📂 Category A', value: 'Category A' },
      { label: '📂 Category B', value: 'Category B' },
      { label: '📖 Book 1', value: 'Book 1' },
      { label: '📖 Book 2', value: 'Book 2' },
      { label: '📖 Book 3', value: 'Book 3' }
    ])
  })

  it('clears filter correctly', () => {
    const { filterBookValue, setFilter, clearFilter } = useBooks()

    setFilter('test filter')
    expect(filterBookValue.value).toBe('test filter')

    clearFilter()
    expect(filterBookValue.value).toBeNull()
  })

  it('calls fetchBooks with correct parameters', async () => {
    const mockGetBooksFromApi = vi.fn()
    mockBooksStore.getBooksFromApi = mockGetBooksFromApi

    const { fetchBooks } = useBooks()

    await fetchBooks('2')
    expect(mockGetBooksFromApi).toHaveBeenCalledWith('2')

    await fetchBooks()
    expect(mockGetBooksFromApi).toHaveBeenCalledWith('1') // from mocked route.query.t
  })
})