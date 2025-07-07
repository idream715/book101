import { createPinia } from 'pinia'

export const pinia = createPinia()

// Export all stores
export { useBooksStore } from './books'
export { useSearchStore } from './search'
export { useCardsStore } from './cards'

export default pinia