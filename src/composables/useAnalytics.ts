import { getCurrentInstance } from 'vue'

export interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
}

export interface BookAnalytics {
  bookId: number
  bookName: string
  creatorId?: number
}

export interface CardAnalytics {
  cardId: number
  cardTitle: string
  creatorId?: number
}

export interface SearchAnalytics {
  keywords: string[]
  resultCount: number
  searchType: string
  creatorId?: number
}

export function useAnalytics() {
  const instance = getCurrentInstance()
  const gtag = instance?.appContext.config.globalProperties.$gtag

  const trackEvent = (event: AnalyticsEvent): void => {
    try {
      if (gtag) {
        gtag.event(event.action, {
          event_category: event.category,
          event_label: event.label,
          value: event.value
        })
      }
    } catch (error) {
      console.warn('Analytics tracking failed:', error)
    }
  }

  // Book related analytics
  const trackBookView = (book: BookAnalytics): void => {
    trackEvent({
      action: 'view_book_from_click',
      category: 'view_item',
      label: `Books Clicked: ${book.bookName}`,
      value: book.bookId
    })
  }

  const trackBookRead = (book: BookAnalytics): void => {
    trackEvent({
      action: 'read_book',
      category: 'engagement',
      label: `Books Read: ${book.bookName}`,
      value: book.bookId
    })
  }

  const trackBookDownload = (book: BookAnalytics): void => {
    trackEvent({
      action: 'download_book',
      category: 'download',
      label: `Books Downloaded: ${book.bookName}`,
      value: book.bookId
    })
  }

  // Card related analytics
  const trackCardView = (card: CardAnalytics): void => {
    trackEvent({
      action: 'view_card',
      category: 'view_item',
      label: `Cards Viewed: ${card.cardTitle}`,
      value: card.cardId
    })
  }

  const trackCardShare = (card: CardAnalytics): void => {
    trackEvent({
      action: 'share_card',
      category: 'share',
      label: `Cards Shared: ${card.cardTitle}`,
      value: card.cardId
    })
  }

  const trackCardCopy = (card: CardAnalytics): void => {
    trackEvent({
      action: 'copy_card_text',
      category: 'engagement',
      label: `Cards Copied: ${card.cardTitle}`,
      value: card.cardId
    })
  }

  // Search related analytics
  const trackSearch = (search: SearchAnalytics): void => {
    trackEvent({
      action: 'search_performed',
      category: 'search',
      label: `Search: ${search.keywords.join(', ')} (${search.resultCount} results)`,
      value: search.resultCount
    })
  }

  const trackSearchResult = (search: SearchAnalytics & { resultId: number }): void => {
    trackEvent({
      action: 'search_result_click',
      category: 'search',
      label: `Search Result: ${search.keywords.join(', ')}`,
      value: search.resultId
    })
  }

  const trackRandomSearch = (creatorId?: number): void => {
    trackEvent({
      action: 'random_search',
      category: 'engagement',
      label: `Random Search - Creator: ${creatorId || 'All'}`,
      value: creatorId
    })
  }

  // Navigation analytics
  const trackPageView = (pageName: string, creatorId?: number): void => {
    trackEvent({
      action: 'page_view',
      category: 'navigation',
      label: `Page: ${pageName}${creatorId ? ` - Creator: ${creatorId}` : ''}`,
      value: creatorId
    })
  }

  const trackNavigation = (from: string, to: string): void => {
    trackEvent({
      action: 'navigation',
      category: 'navigation',
      label: `From: ${from} To: ${to}`
    })
  }

  // Filter and interaction analytics
  const trackFilterUsage = (filterType: string, filterValue: string): void => {
    trackEvent({
      action: 'filter_used',
      category: 'interaction',
      label: `Filter: ${filterType} = ${filterValue}`
    })
  }

  const trackInfiniteScroll = (contentType: string, page: number): void => {
    trackEvent({
      action: 'infinite_scroll',
      category: 'engagement',
      label: `${contentType} - Page: ${page}`,
      value: page
    })
  }

  // Error tracking
  const trackError = (errorType: string, errorMessage: string): void => {
    trackEvent({
      action: 'error_occurred',
      category: 'error',
      label: `${errorType}: ${errorMessage}`
    })
  }

  return {
    // Core tracking
    trackEvent,
    
    // Book analytics
    trackBookView,
    trackBookRead,
    trackBookDownload,
    
    // Card analytics
    trackCardView,
    trackCardShare,
    trackCardCopy,
    
    // Search analytics
    trackSearch,
    trackSearchResult,
    trackRandomSearch,
    
    // Navigation analytics
    trackPageView,
    trackNavigation,
    
    // Interaction analytics
    trackFilterUsage,
    trackInfiniteScroll,
    
    // Error tracking
    trackError
  }
}