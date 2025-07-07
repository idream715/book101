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
    async setFirstIndexsFromApi({ words, page, creator }) {
      this.overlay = true
      this.notfound = false

      try {
        const wordsArray = words.map(w => w.text)
        const response = await searchApi.post('/search', {
          keywords: wordsArray,
          type: 'indexs',
          creator: creator,
          tags: [],
          offset: page
        })

        if (response.data.indexs && response.data.indexs.length > 0) {
          // Process marked text for highlighting
          const processedIndexs = response.data.indexs.map(index => ({
            ...index,
            mark_index: this.processMarkedText(index.mark_index),
            mark_details: this.processMarkedText(index.mark_details)
          }))

          this.indexs = processedIndexs
          this.totalsIndexs = response.data.total
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

    async setFirstIndexsFromApi_infenit({ words, page, creator }) {
      try {
        const wordsArray = words.map(w => w.text)
        const response = await searchApi.post('/search', {
          keywords: wordsArray,
          type: 'indexs',
          creator: creator,
          tags: [],
          offset: page
        })

        if (response.data.indexs && response.data.indexs.length > 0) {
          const processedIndexs = response.data.indexs.map(index => ({
            ...index,
            mark_index: this.processMarkedText(index.mark_index),
            mark_details: this.processMarkedText(index.mark_details)
          }))

          this.indexs.push(...processedIndexs)
        }
      } catch (error) {
        console.error('Error in infinite search:', error)
      }
    },

    async setSearchRandom() {
      try {
        const response = await callApi.getData('/indexs-rand')
        this.search_random.push(response.data)
      } catch (error) {
        console.error('Error fetching random search:', error)
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
      this.overlay = false
      this.notfound = false
    }
  }
})