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
    notfound: false
  }),

  getters: {
    getCards: (state) => state.cards,
    getTotalCards: (state) => state.totalsCards,
    getTags: (state) => state.cardTags,
    getCheckToolbar: (state) => state.cardToolbarFlag,
    getoverlay: (state) => state.overlay,
    getnotfound: (state) => state.notfound
  },

  actions: {
    async getCardFromApi(creator) {
      this.overlay = true
      this.cardToolbarFlag = ''

      try {
        const response = await callApi.getData(`cards/all?creator=${creator}&offset=0&limit=48`)
        this.cards = response.data.items || []
        this.totalsCards = response.data.nItems || 0
        this.notfound = this.cards.length === 0
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
      try {
        const response = await callApi.getData(`cards/tags?creator=${creator}`)
        this.cardTags = response.data.items || []
      } catch (error) {
        console.error('Error fetching card tags:', error)
      }
    },

    async setCardInfiniteScrolled({ offset, creator }) {
      try {
        const response = await callApi.getData(`cards/all?creator=${creator}&offset=${offset}&limit=48`)
        if (response.data.items && response.data.items.length > 0) {
          this.cards.push(...response.data.items)
        }
      } catch (error) {
        console.error('Error in card infinite scroll:', error)
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
        }
      } catch (error) {
        console.error('Error in filtered cards infinite scroll:', error)
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
        }
      } catch (error) {
        console.error('Error in searched cards infinite scroll:', error)
      }
    },

    clear() {
      this.cards = []
      this.totalsCards = 0
      this.cardWordSearch = []
      this.cardToolbarFlag = ''
      this.overlay = false
      this.notfound = false
    }
  }
})