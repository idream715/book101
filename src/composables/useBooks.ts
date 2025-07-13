import { ref, computed } from 'vue'
import { useBooksStore } from '@/stores/books'
import { useSearchStore } from '@/stores/search'
import { useRoute } from 'vue-router'

export interface Book {
  bookId: number
  bookName: string
  bookCoverThumbnails: string
  categoryName: string
  creatorId?: number
}

export interface SearchOption {
  label: string
  value: string
}

export function useBooks() {
  const route = useRoute()
  const booksStore = useBooksStore()
  const searchStore = useSearchStore()

  // Reactive state
  const filterBookValue = ref<string | null>(null)

  // Computed properties
  const books = computed((): Book[] => booksStore.getBooks || [])
  const loading = computed((): boolean => searchStore.getoverlay)

  const categories = computed((): string[] => {
    return Array.from(new Set(books.value.map(book => book.categoryName).filter(Boolean)))
  })

  const searchOptions = computed((): SearchOption[] => {
    const categoryOptions = categories.value.map(category => ({
      label: `📂 ${category}`,
      value: category
    }))
    
    const bookOptions = books.value.map(book => ({
      label: `📖 ${book.bookName}`,
      value: book.bookName
    }))
    
    return [...categoryOptions, ...bookOptions]
  })

  const filteredBooks = computed((): Book[] => {
    if (!filterBookValue.value) {
      return books.value
    }
    
    // Check if it's a category filter
    if (categories.value.includes(filterBookValue.value)) {
      return books.value.filter(book => book.categoryName === filterBookValue.value)
    }
    
    // Otherwise, filter by book name
    return books.value.filter(book => 
      book.bookName.toLowerCase().includes(filterBookValue.value!.toLowerCase())
    )
  })

  // Methods
  const fetchBooks = async (creatorId?: string) => {
    const targetCreatorId = creatorId || route.query.t as string
    await booksStore.getBooksFromApi(targetCreatorId)
  }

  const clearFilter = () => {
    filterBookValue.value = null
  }

  const setFilter = (value: string | null) => {
    filterBookValue.value = value
  }

  return {
    // State
    books,
    loading,
    categories,
    searchOptions,
    filteredBooks,
    filterBookValue,
    
    // Methods
    fetchBooks,
    clearFilter,
    setFilter
  }
}