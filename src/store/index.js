import Vue from 'vue'
import Vuex from 'vuex'
import callApi from '@/plugins/axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    totalsBooks:0,
    books:[],
    totalsIndexs:0,
    indexs:[],
    bookSelected:{},
    sarabunSelected:[],
    totalsSarabun:0,
    offset:0,
  },
  mutations: {
    SET_BOOKS(state, payload){
      state.books = payload
    },
    SET_TOTALS_BOOKS(state, payload){
      state.totalsBooks = payload
    },
    SET_INDEXS(state, payload){
      state.indexs = payload
    },
    SET_SARABUN_TOTAL(state, payload){
      state.totalsSarabun = payload
    },
    SET_SARABUN(state, payload){
      state.sarabunSelected = payload
    },
    SET_TOTALS_INDEXS(state, payload){
      state.totalsIndexs = payload
    },
    SET_BOOK_SELECTED(state, payload){
      state.bookSelected = payload
    },
    SET_PAGENATION(state, payload){
      state.offset = payload
    },
    
  },
  actions: {
    getBookFromApi({ commit }){
      callApi.getData(`?path=/books&limit=50`)
        .then(res=>{
          let data = res.data
          commit('SET_TOTALS_BOOKS', data.nitems)
          commit('SET_BOOKS', data.items)
        })
        .catch(err => console.log(err))
    },
    getFirstIndexsFromApi({ commit }){
      callApi.getData(`?path=/indexs&limit=20`)
        .then(res=>{
          let data = res.data
          commit('SET_TOTALS_INDEXS', data.nitems)
          commit('SET_INDEXS', data.items)
        })
        .catch(err => console.log(err))
    },
    setBookSelected({commit, state}, selected){
      commit('SET_BOOK_SELECTED', selected)
      let name_book = selected.book_name
      callApi.getData(`?path=/indexs&limit=50&offset=${state.offset}&query={"search_heading":"${name_book}"}`)
        .then(res=>{
          let data = res.data
          commit('SET_SARABUN_TOTAL', data.nitems)
          commit('SET_SARABUN', data.items)
        })
        .catch(err => console.log(err))
    },
    setPagenation({commit}, offset){
      commit('SET_PAGENATION', offset)
    }
  },
  getters: {
    getTotalbooks(state){
      return state.totalsBooks
    },
    getBooks(state){
      return state.books
    },
    getTotalIndexs(state){
      return state.totalsIndexs
    },
    getIndexs(state){
      return state.indexs
    },
    getBookSelected(state){
      return state.bookSelected
    },
    getTotalSarabun(state){
      return state.totalsSarabun
    },
    getSarabun(state){
      // return state.sarabunSelected
      let sarabuns = Array.from(new Set(state.sarabunSelected.map(book => book.search_index)))
      .map(nameSarabun => {
        return state.sarabunSelected.find(book => book.search_index === nameSarabun)
      })
      return sarabuns
    },
  }
})
