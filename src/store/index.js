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
    notfound:false,
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
      state.overlay = payload
    },
    SET_NOTFOUND(state,payload){
      state.notfound = payload
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
        let tag = `{"search_details":{"$regex":"${element}"}}`
        tags.push(tag)
      });
      commit('SET_OVERLAY', true)
      callApi.getData(`?path=/indexs&limit=20&query={"$and":[${tags}]} `)
      .then(res=>{
        let data = res.data
        console.log(data.items.length)
        if(data.items.length===0){commit('SET_NOTFOUND', true)}else{commit('SET_NOTFOUND', false)}
        commit('SET_OVERLAY', false)
        commit('SET_TOTALS_INDEXS', data.nitems)
        let details = data.items.map(x=>x.search_details)
        let index = data.items.map(x=>x.search_index)
        function marks(array){        
          let marks = []
          array.forEach(index => {
            let render = index
            words.forEach(word=>{
              render = render.replace(word,`<mark>${word}</mark>`)
            })
            marks.push(render)
          })
          return marks
        }
        let indexmarked =  marks(index)
        let detailsmarked = marks(details) 
          
        data.items.forEach((item,i) =>{
          item["mark_index"]= indexmarked[i]
          item["mark_details"]= detailsmarked[i]
        })
        commit('SET_INDEXS', data.items)
        })
        .catch(err => console.log(err))
    },
    clear({commit}){
      commit('SET_TOTALS_INDEXS', 0)
      commit('SET_INDEXS', [])
      commit('SET_MARKS', [])
      commit('SET_WORDS_SEARCH', [])
      commit('SET_NOTFOUND', false)
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
    },
    getnotfound(state){
      return state.notfound
    },
    getmarks(state){
      return state.marks
    },
    getwords_search(state){
      return state.words_search
    }
  }
})
