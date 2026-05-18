import { defineStore } from 'pinia'
import callApi from '@/plugins/axios'

export const useCardsStore = defineStore('cards', {
  state: () => ({
    cards: [],
    totalsCards: 0,
    cardTags: [],
    cardWordSearch: [],
    cardToolbarFlag: '',
    overlay: false,
    notfound: false,
    currentCreator: null, // Track current creator to avoid unnecessary reloads
    currentTagsCreator: null, // Track creator for tags cache
    singleCard: null, // Cache for single card view
    singleCardCache: {} // Cache map for multiple cards
  }),

  getters: {
    getCards: (state) => state.cards,
    getTotalCards: (state) => state.totalsCards,
    getTags: (state) => state.cardTags,
    getCheckToolbar: (state) => state.cardToolbarFlag,
    getoverlay: (state) => state.overlay,
    getnotfound: (state) => state.notfound,
    getSingleCard: (state) => state.singleCard
  },

  actions: {
    async getCardFromApi(creator) {
      // Skip if already loaded for same creator (and not in filter/search mode)
      if (this.currentCreator === creator && this.cards.length > 0 && this.cardToolbarFlag === '') {
        console.log('Cards already loaded for creator', creator, '- using cache')
        this.overlay = false // Ensure overlay is false when using cache
        return // Early return - no overlay, no loading
      }

      this.overlay = true
      this.cardToolbarFlag = ''

      try {
        const response = await callApi.getData(`cards/all?creator=${creator}&offset=0&limit=24`)
        this.cards = response.data.items || []
        this.totalsCards = response.data.nItems || 0
        this.notfound = this.cards.length === 0
        this.currentCreator = creator // Save current creator
      } catch (error) {
        console.error('Error fetching cards:', error)
        this.cards = []
        this.totalsCards = 0
        this.notfound = true
      } finally {
        this.overlay = false
      }
    },

    async getTagOfCards(creator) {
      // Skip if already loaded for same creator
      if (this.currentTagsCreator === creator && this.cardTags.length > 0) {
        console.log('Card tags already loaded for creator', creator, '- using cache')
        return
      }

      try {
        const response = await callApi.getData(`cards/tags?creator=${creator}`)
        this.cardTags = response.data.items || []
        this.currentTagsCreator = creator // Save current creator
      } catch (error) {
        console.error('Error fetching card tags:', error)
      }
    },

    async setCardInfiniteScrolled({ offset, creator }) {
      try {
        const response = await callApi.getData(`cards/all?creator=${creator}&offset=${offset}&limit=24`)
        if (response.data.items && response.data.items.length > 0) {
          this.cards.push(...response.data.items)
          return true
        }
        return false
      } catch (error) {
        console.error('Error in card infinite scroll:', error)
        throw error
      }
    },

    async setFilteredCards({ words, creator }) {
      this.overlay = true
      this.cardToolbarFlag = 'filter'

      try {
        const response = await callApi.postData('search', {
          keywords: [],
          type: 'cards',
          creator: creator,
          tags: words || [],
          offset: 0
        })

        this.cards = response.data.items || []
        this.totalsCards = response.data.nItems || 0
        this.notfound = this.cards.length === 0
      } catch (error) {
        console.error('Error filtering cards:', error)
        this.cards = []
        this.totalsCards = 0
        this.notfound = true
      } finally {
        this.overlay = false
      }
    },

    async setFilteredCardsContinue({ words, offset, creator }) {
      try {
        const response = await callApi.postData('search', {
          keywords: [],
          type: 'cards',
          creator: creator,
          tags: words,
          offset: offset
        })

        if (response.data.items && response.data.items.length > 0) {
          this.cards.push(...response.data.items)
          return true
        }
        return false
      } catch (error) {
        console.error('Error in filtered cards infinite scroll:', error)
        throw error
      }
    },

    async setSearchedCards({ words, creator, tags }) {
      this.overlay = true
      this.cardToolbarFlag = 'search'

      try {
        const response = await callApi.postData('search', {
          keywords: words,
          type: 'cards',
          creator: creator,
          tags: tags || [],
          offset: 0
        })

        this.cards = response.data.items || []
        this.totalsCards = response.data.nItems || 0
        this.notfound = this.cards.length === 0
      } catch (error) {
        console.error('Error searching cards:', error)
        this.cards = []
        this.totalsCards = 0
        this.notfound = true
      } finally {
        this.overlay = false
      }
    },

    async setSearchedCardsContinue({ words, offset, creator, tags }) {
      try {
        const response = await callApi.postData('search', {
          keywords: words,
          type: 'cards',
          creator: creator,
          tags: tags,
          offset: offset
        })

        if (response.data.items && response.data.items.length > 0) {
          this.cards.push(...response.data.items)
          return true
        }
        return false
      } catch (error) {
        console.error('Error in searched cards infinite scroll:', error)
        throw error
      }
    },

    async getCardById(cardId) {
      // Check cache first
      if (this.singleCardCache[cardId]) {
        console.log('Card loaded from cache:', cardId)
        this.singleCard = this.singleCardCache[cardId]
        return this.singleCard
      }

      // Check if card exists in current cards list
      const existingCard = this.cards.find(c => c.cardId === cardId)
      if (existingCard) {
        console.log('Card found in current list:', cardId)
        this.singleCard = existingCard
        this.singleCardCache[cardId] = existingCard
        return existingCard
      }

      this.overlay = true

      try {
        // Fetch single card from API
        const response = await callApi.getData(`cards/${cardId}`)
        // API returns { items: {...cardData...} } format
        const card = response.data.items

        if (card) {
          this.singleCard = card
          this.singleCardCache[cardId] = card
          this.notfound = false
          return card
        } else {
          this.notfound = true
          return null
        }
      } catch (error) {
        console.error('Error fetching card:', error)
        this.notfound = true
        return null
      } finally {
        this.overlay = false
      }
    },

    clear() {
      this.cards = []
      this.totalsCards = 0
      this.cardWordSearch = []
      this.cardToolbarFlag = ''
      this.overlay = false
      this.notfound = false
      this.currentCreator = null
      this.currentTagsCreator = null
      this.singleCard = null
      this.singleCardCache = {}
    }
  }
})