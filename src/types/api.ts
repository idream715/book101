// API Response Types for Buddhist Content Platform

// Book related types
export interface Book {
  bookId: number
  bookName: string
  bookCoverThumbnails: string
  categoryName: string
  bookDescription?: string
  creatorId: number
  createdAt?: string
  updatedAt?: string
}

export interface BookChapter {
  chapterId: number
  chapterHeading: string
  chapterDetail: string
  bookId: number
  bookName: string
  year?: string
  situation?: string
}

// Card related types
export interface Card {
  cardId: number
  cardDetail: string
  cardPicThumbnails: string
  cardTags: string[]
  creatorId: number
  cardName?: string
  cardDescription?: string
}

// Shorts/Stories related types
export interface Short {
  shortId: number
  shortHeading: string
  shortDetail: string
  shortContent?: string
  year?: string
  creatorId: number
  chapterId?: number
  bookName?: string
}

// Search related types
export interface SearchParams {
  keywords: string[]
  type?: 'books' | 'cards' | 'shorts' | 'all'
  creator?: number
  tags?: string[]
  page?: number
  limit?: number
}

export interface SearchResult {
  id: number
  type: 'book' | 'card' | 'short'
  title: string
  content: string
  highlightedContent?: string
  source: string
  creatorId: number
  relevanceScore?: number
  chapterId?: number
  cardId?: number
  bookId?: number
}

// UI Component types
export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface MenuItem {
  logo: string
  title: string
  text?: string
  creator: number
  routeTo: string
}

// Creator related types
export interface Creator {
  id: number
  name: string
  fullName: string
  background: string
  color: string
  description?: string
}

// Store state types
export interface BooksState {
  books: Book[]
  loading: boolean
  error: string | null
  currentCreator: number | null
}

export interface SearchState {
  indexs: SearchResult[]
  totalsIndexs: number
  overlay: boolean
  keywords: string[]
  currentType: string
  currentCreator: number | null
}

// API Response wrappers
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  total?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Google Analytics types
export interface AnalyticsEvent {
  event_category: string
  event_label: string
  value?: number | string
}

// Route parameter types
export interface BookParams {
  id: string
}

export interface CreatorParams {
  t: string // creator ID
}