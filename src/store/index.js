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
    setBookSelected({commit}, selected){
      commit('SET_BOOK_SELECTED', selected)
    },
    setPagenation({commit, state}, {limit, offset}){
      callApi.getData(
        `?path=/indexs&limit=${limit}&offset=${offset}&query={"search_heading":"${state.bookSelected.book_name}"}`
      ).then(res=>{
          let data = res.data
          commit('SET_SARABUN', data.items)
          if(!state.totalsSarabun)
            commit('SET_SARABUN_TOTAL', data.nitems);
        })
        .catch(err => console.log(err))
    },

    // clear state
    clearSarabun({commit}){
      commit('SET_SARABUN', [])
    },
    clearTotalsSarabun({commit}){
      commit('SET_SARABUN_TOTAL', 0)
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
      //show duplicate
      return state.sarabunSelected

      //not duplicate
      // let sarabuns = Array.from(new Set(state.sarabunSelected.map(book => book.search_index)))
      // .map(nameSarabun => {
      //   return state.sarabunSelected.find(book => book.search_index === nameSarabun)
      // })
      // return sarabuns
    },
    getCheckLoadSarabun(state){
      if(state.sarabunSelected.length>0)return false
      else return true
    }  
  }
})
