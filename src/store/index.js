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
    SET_TOTALS_INDEXS(state, payload){
      state.totalsIndexs = payload
    }
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
          console.log(data.items)
        })
        .catch(err => console.log(err))
    }
  },
  getters: {
    getTotalbooks(state){
      return state.totalsBooks
    },
    getbooks(state){
      return state.books
    },
    getTotalIndexs(state){
      return state.totalsIndexs
    },
    getIndexs(state){
      return state.indexs
    },
  }
})
