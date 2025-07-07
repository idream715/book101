import { defineStore } from 'pinia'
import { callApi } from '@/plugins/axios'

export const useBooksStore = defineStore('books', {
  state: () => ({
    books: [],
    totalsBooks: 0,
    bookSelected: {},
    sarabunSelected: [],
    totalsSarabun: 0,
    flag: 1
  }),

  getters: {
    getBooks: (state) => state.books,
    getTotalbooks: (state) => state.totalsBooks,
    getbook: (state) => state.bookSelected,
    getSarabuns: (state) => state.sarabunSelected,
    getSarabun: (state) => (id) => state.sarabunSelected.find(item => item.id === id),
    getTotalSarabun: (state) => state.totalsSarabun
  },

  actions: {
    async getBooksFromApi(creator) {
      try {
        console.log(`creator`, creator)
        const response = await callApi.getData(`books/all?creator=${creator}`)
        this.books = response.data.items
        this.totalsBooks = response.data.nItems
      } catch (error) {
        console.error('Error fetching books:', error)
      }
    },

    async setbook(id) {
      try {
        const response = await callApi.getData(`books/${id}`)
        this.bookSelected = response.data
      } catch (error) {
        console.error('Error fetching book:', error)
      }
    },

    async setSarabun({ bookId, offset }) {
      try {
        const response = await callApi.getData(`books/${bookId}/index?offset=${offset}&limit=100`)
        console.log('Sarabun API response:', response.data)

        if (offset === 0) {
          this.sarabunSelected = response.data.indexs || response.data.items || []
        } else {
          this.sarabunSelected.push(...(response.data.indexs || response.data.items || []))
        }

        this.totalsSarabun = response.data.total || response.data.nItems || 0
      } catch (error) {
        console.error('Error fetching sarabun:', error)
      }
    },

    setFlagBook(value) {
      this.flag += value
    },

    clearFlag() {
      this.flag = 1
    },

    clearSarabun() {
      this.sarabunSelected = []
    },

    clearTotalsSarabun() {
      this.totalsSarabun = 0
      this.bookSelected = {}
    },

    clear() {
      this.books = []
      this.totalsBooks = 0
      this.sarabunSelected = []
      this.totalsSarabun = 0
      this.bookSelected = {}
      this.flag = 1
    }
  }
})