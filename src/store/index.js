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
    overlay:false,
    marks:[],
    words_search:[]
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
    },
    SET_MARKS(state,payload){
      state.marks = payload
    },
    SET_WORDS_SEARCH(state,payload){
      state.words_search = payload
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
    setwordssearch({commit},words){
      commit('SET_WORDS_SEARCH',words)
    },
    setFirstIndexsFromApi({ commit },words){
      commit('SET_WORDS_SEARCH',words)
      let tags = []
      words.forEach(element => {
        let tag = `{"search_index":{"$regex":"${element}"}}`
        tags.push(tag)
      });

      commit('SET_OVERLAY', true)
      callApi.getData(`?path=/indexs&limit=20&query={"$and":[${tags}]} `)
      .then(res=>{
        let data = res.data
        commit('SET_OVERLAY', false)
        commit('SET_TOTALS_INDEXS', data.nitems)
        commit('SET_INDEXS', data.items)
        
        let details = data.items.map(x=>x.search_index)
        let marks = []
        details.forEach(index => {
          let render = index
          words.forEach(word=>{
            render = render.replace(word,`<mark>${word}</mark>`)
          })
            marks.push(render)
          })
        commit('SET_MARKS',marks)
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
      console.log(state.overlay)
      return state.overlay
    },
    getmarks(state){
      return state.marks
    },
    getwords_search(state){
      return state.words_search
    }
  }
})
