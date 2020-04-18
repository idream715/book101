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
    overlay:false
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
    },
    SET_OVERLAY(state,payload){
      state.overlay  = payload
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
    getFirstIndexsFromApi({ commit },words){
      let t = true
      let f = false
      commit('SET_OVERLAY', t)
      callApi.getData(`?path=/indexs&limit=20&query={"$and":[${words}]} `)
      .then(res=>{
        let data = res.data
        commit('SET_OVERLAY', f)
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
    getBooks(state){
      return state.books
    },
    getTotalIndexs(state){
      return state.totalsIndexs
    },
    getIndexs(state){
      return state.indexs
    },
    getoverlay(state){
      return state.overlay
    }
  }
})
