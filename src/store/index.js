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
    words_search:[],
    bookSelected:{},
    sarabunSelected:[],
    totalsSarabun:0,
    offset:0,
    search_random:[],
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
    SET_OVERLAY(state,payload){
      state.overlay = payload
    },
    SET_NOTFOUND(state,payload){
      state.notfound = payload
    },
    SET_WORDS_SEARCH(state,payload){
      state.words_search = payload
    },
    SET_BOOK_SELECTED(state, payload){
      state.bookSelected = payload
    },
    SET_PAGENATION(state, payload){
      state.offset = payload
    },
    SET_SEARCH_RANDOM(state,payload){
      state.search_random = payload
    },
    
  },
  actions: {
    // GET
    getBookFromApi({ commit }){
      commit('SET_OVERLAY', true)
      callApi.getData(`?path=/books&limit=50`)
        .then(res=>{
          let data = res.data
          commit('SET_OVERLAY', false)
          commit('SET_TOTALS_BOOKS', data.nitems)
          commit('SET_BOOKS', data.items)
        })
        .catch(err => console.log(err))
    },
    // SET
      // PATH INDEXS
    setwordssearch({commit},words){
      commit('SET_WORDS_SEARCH',words)
    },
    setFirstIndexsFromApi({ commit },{words,page}){
      commit('SET_WORDS_SEARCH',words)
      let tags = []
      words.forEach(element => {
        let tag = `{"search_details":{"$regex":"${element}"}}`
        tags.push(tag)
      });
      commit('SET_OVERLAY', true)

      callApi.getData(`?path=/indexs&limit=10&offset=${page}&query={"$and":[${tags}]} `)
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
    setsearchrandom({ commit },number){
      commit('SET_OVERLAY', true)
      let tag = `{"%23":{"$regex":"${number}"}}`
      callApi.getData(`?path=/indexs&limit=1&query={"$and":[${tag}]} `)
      .then(res=>{
        commit('SET_OVERLAY', false)
        let data = res.data
        commit('SET_SEARCH_RANDOM',data.items)
      })
      .catch(err => console.log(err))
    },
      // PATH BOOKS
    setBookSelected({commit}, selected){
      commit('SET_BOOK_SELECTED', selected)
    },
    setPagenation({commit, state}, {limit, offset}){
      commit('SET_OVERLAY', true)
      callApi.getData(
        `?path=/indexs&limit=${limit}&offset=${offset}&query={"search_heading":"${state.bookSelected.book_name}"}`
      ).then(res=>{
          let data = res.data
          commit('SET_SARABUN', data.items)
          commit('SET_OVERLAY', false)
          if(!state.totalsSarabun)
            commit('SET_SARABUN_TOTAL', data.nitems);
        })
        .catch(err => console.log(err))
    },

    // clear state
    clear({commit}){
      commit('SET_TOTALS_INDEXS', 0)
      commit('SET_INDEXS', [])
      commit('SET_WORDS_SEARCH', [])
      commit('SET_NOTFOUND', false)
      commit('SET_SEARCH_RANDOM',[])
    },
    clearSarabun({commit}){
      commit('SET_SARABUN', [])
    },
    clearTotalsSarabun({commit}){
      commit('SET_SARABUN_TOTAL', 0)
    },
    
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
    getwords_search(state){
      return state.words_search
    },
    getBookSelected(state){
      return state.bookSelected
    },
    getTotalSarabun(state){
      return state.totalsSarabun
    },
    getsearchrandom(state){
      return state.search_random
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
  }
})
