import { defineStore } from 'pinia'
import callApi, { searchApi } from '@/plugins/axios'

export const useSearchStore = defineStore('search', {
  state: () => ({
    indexs: [],
    totalsIndexs: 0,
    words_search: [],
    search_random: [],
    overlay: false,
    notfound: false,
    flag: 1
  }),

  getters: {
    getIndexs: (state) => state.indexs,
    getTotalIndexs: (state) => state.totalsIndexs,
    getwords_search: (state) => state.words_search,
    getsearchrandom: (state) => state.search_random,
    getoverlay: (state) => state.overlay,
    getnotfound: (state) => state.notfound
  },

  actions: {
    async setFirstIndexsFromApi({ words, page, creator, type = 'books' }) {
      this.overlay = true
      this.notfound = false

      try {
        const wordsArray = words.map(w => w.text)
        const response = await searchApi.post('/search', {
          keywords: wordsArray,
          type: type,
          creator: parseInt(creator),
          tags: [],
          offset: page,
          limit: 50
        })

        if (response.data.items && response.data.items.length > 0) {
          // Map new API structure to expected format
          const processedIndexs = response.data.items.map(item => ({
            ...item,
            mark_index: item.chapterHeading || item.bookName || '',
            mark_details: item.chapterDetail || '',
            bookName: item.bookName || '',
            bookId: item.bookId || item.searchId || ''
          }))

          this.indexs = processedIndexs
          this.totalsIndexs = response.data.nItems
          this.words_search = words
          this.notfound = false
        } else {
          this.indexs = []
          this.totalsIndexs = 0
          this.notfound = true
        }
      } catch (error) {
        console.error('Error in search:', error)
        this.notfound = true
      } finally {
        this.overlay = false
      }
    },

    async setFirstIndexsFromApi_infenit({ words, page, creator, type = 'books' }) {
      try {
        const wordsArray = words.map(w => w.text)
        const response = await searchApi.post('/search', {
          keywords: wordsArray,
          type: type,
          creator: parseInt(creator),
          tags: [],
          offset: page,
          limit: 50
        })

        if (response.data.items && response.data.items.length > 0) {
          // Map new API structure to expected format
          const processedIndexs = response.data.items.map(item => ({
            ...item,
            mark_index: item.chapterHeading || item.bookName || '',
            mark_details: item.chapterDetail || '',
            bookName: item.bookName || '',
            bookId: item.bookId || item.searchId || ''
          }))

          // Limit items to not exceed totalsIndexs
          const remainingSlots = this.totalsIndexs - this.indexs.length
          if (remainingSlots <= 0) return false

          const itemsToAdd = processedIndexs.slice(0, remainingSlots)
          if (itemsToAdd.length > 0) {
            this.indexs.push(...itemsToAdd)
            return true
          }
        }
        return false
      } catch (error) {
        console.error('Error in infinite search:', error)
        throw error
      }
    },

    async setSearchRandom({ creator }) {
      try {
        const response = await callApi.getData(`/indexs-rand??limit=1&offset=0&creator=${creator}`)
        // Clear previous results
        this.search_random = []
        // Handle response.items which can be object or array
        if (response.data.nItems > 0) {
            // If items is an object, wrap it in an array
            this.search_random = [response.data.items]
        }
      } catch (error) {
        console.error('Error fetching random search:', error)
        this.search_random = []
      }
    },

    processMarkedText(text) {
      if (!text || !text.includes('<mark>')) return text

      const parts = text.split('html')
      if (parts.length > 1) {
        const processedText = parts.slice(1).join(' ')
        const marked = processedText.replace('<mark>', '$<mark>')
        const sections = marked.split('$')
        const words = sections[0].split(' ')
        return `${words[words.length - 1]}${sections[1]}`
      } else {
        const marked = text.replace('<mark>', '$<mark>')
        const sections = marked.split('$')
        const words = sections[0].split(' ')
        return `${words[words.length - 1]}${sections[1]}`
      }
    },

    setwordssearch(words) {
      this.words_search = words
    },

    setOverlay(value) {
      this.overlay = value
    },

    setNotfound(value) {
      this.notfound = value
    },

    clearSearchRandom() {
      this.search_random = []
    },

    setFlag() {
      this.flag += 10
    },

    clearFlag() {
      this.flag = 1
    },

    clear() {
      this.indexs = []
      this.totalsIndexs = 0
      this.words_search = []
      this.search_random = []
      this.overlay = false
      this.notfound = false
      this.flag = 1
    },

    // Shorts-specific methods migrated from Vuex
    async getShortsFromApi(creator) {
      if (!creator) return null

      this.overlay = true
      this.flag = 1

      try {
        const response = await callApi.getData(`/shorts/all/?limit=50&offset=0&creator=${creator}`)
        const data = response.data
        this.notfound = false
        this.overlay = false
        this.totalsIndexs = data.nItems
        this.indexs = data.items
      } catch (error) {
        console.error('Error fetching shorts:', error)
        this.overlay = false
      }
    },

    async searchShortFromApiContinue({ words, page, creator }) {
      if (!creator) return null

      if (page > this.flag) {
        this.flag += 50
        this.words_search = words

        const tags = words.map(element => element.text)
        const body = {
          keywords: tags,
          type: 'shorts',
          creator: parseInt(creator),
          limit: 50,
          offset: page,
          pageNo: 0
        }

        try {
          const response = await callApi.postData('/search', body)
          const data = response.data

          if (data.items && data.items.length > 0) {
            this.indexs.push(...data.items)
          }
        } catch (error) {
          console.error('Error in search short continue:', error)
        }
      }
    },

    async setShortFromApiContinue({ page, creator }) {
      if (!creator) return null

      if (page > this.flag) {
        this.flag += 50

        try {
          const response = await callApi.getData(`/shorts/all?limit=50&offset=${page}&creator=${creator}`)
          const data = response.data

          if (data.items && data.items.length > 0) {
            this.indexs.push(...data.items)
          }
        } catch (error) {
          console.error('Error in short continue:', error)
        }
      }
    }
  }
})