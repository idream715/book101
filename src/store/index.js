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
    search_random:[],
    flag:1,
  },
  mutations: {
    SET_BOOKS(state, payload){
      state.books = payload
    },
    SET_TOTALS_BOOKS(state, payload){
      state.totalsBooks = payload
    },
    SET_INDEXS_INFENIT(state, payload){
      payload.forEach(x=>{state.indexs.push(x)})
    },
    SET_SARABUN_INFENIT(state, payload){
      payload.forEach(x=>{state.sarabunSelected.push(x)})
    },
    SET_INDEXS(state, payload){
      state.indexs=payload
    },
    SET_SARABUN_TOTAL(state, payload){
        state.totalsSarabun=payload
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
    SET_SEARCH_RANDOM(state, payload){
      state.search_random = payload
    },
    SET_FLAG(state){
      state.flag+=10
    },
    CLEAR_FLAG(state){
      state.flag=1
    },
    SET_FLAG_BOOK(state, payload){
      state.flag += payload
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
      commit('SET_INDEXS', [])
      commit('SET_WORDS_SEARCH',words)
      commit('CLEAR_FLAG')
      let tags = []
      words.forEach(element => {
        let tag = `{"search_all":{"$regex":"${element.text}"}}`
        tags.push(tag)
      });
      commit('SET_OVERLAY', true)
      callApi.getData(`?path=/indexs&limit=10&offset=${page}&query={"$and":[${tags}]} `)
        .then(res=>{
          let data = res.data
          commit('SET_OVERLAY', false)
          if(data.nitems === 0){commit('SET_NOTFOUND', true)}else{commit('SET_NOTFOUND', false)}
          commit('SET_TOTALS_INDEXS', data.nitems)
          let details = data.items.map(x=>x.search_details)
          let index = data.items.map(x=>x.search_index)
          function marks(array1,array2){        
            let marks = []
            array1.forEach(index => {
              let render = index
              array2.forEach(word=>{render = render.replace(word.text,`<mark>${word.text}</mark>`)})
              marks.push(render)
            })
            return marks
          }
          let indexmarked =  marks(index,words)
          let detailsmarked = marks(details,words)  
          data.items.forEach((item,i) =>{
            item["mark_index"]= indexmarked[i]
            item["mark_details"]= detailsmarked[i]
          })
          commit('SET_INDEXS', data.items)
        }).catch(err => console.log(err))
    },
    setFirstIndexsFromApi_infenit({ commit,state },{words,page}){
      if(page>state.flag){
        commit('SET_FLAG')
        commit('SET_WORDS_SEARCH',words)
        let tags = []
        words.forEach(element => {
          let tag = `{"search_all":{"$regex":"${element.text}"}}`
          tags.push(tag)
        });
        callApi.getData(`?path=/indexs&limit=10&offset=${page}&query={"$and":[${tags}]} `)
          .then(res=>{
            let data = res.data
            let details = data.items.map(x=>x.search_details)
            let index = data.items.map(x=>x.search_index)
            function marks(array1,array2){        
              let marks = []
              array1.forEach(index => {
                let render = index
                array2.forEach(word=>{
                  render = render.replace(word.text,`<mark>${word.text}</mark>`)
                })
                marks.push(render)
              })
              return marks
            }
            let indexmarked =  marks(index,words)
            let detailsmarked = marks(details,words)  
            data.items.forEach((item,i) =>{
              item["mark_index"]= indexmarked[i]
              item["mark_details"]= detailsmarked[i]
            })
          commit('SET_INDEXS_INFENIT', data.items)
          }).catch(err => console.log(err))
      }else{return}  
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
    setbook_index({commit}, id){
      commit('SET_OVERLAY', true)
      callApi.getData(`?path=/books/${id}`)
        .then(res=>{
          let data = res.data
          commit('SET_OVERLAY', false)
          commit('SET_BOOK_SELECTED', data)
        })
        .catch(err => console.log(err))
    },
      // PATH BOOKS
    setBookSelected({commit}, selected){
      commit('SET_BOOK_SELECTED', selected)
    },
    setPagenation({commit, state}, {limit, offset, book_id}){
      commit('SET_OVERLAY', true)
      callApi.getData(
        `?path=/indexs&limit=${limit}&offset=${offset}&query={"book_id":"${book_id}"}`
      ).then(res=>{
          let data = res.data
          commit('SET_SARABUN', data.items)
          commit('SET_OVERLAY', false)
          if(!state.totalsSarabun)
            commit('SET_SARABUN_TOTAL', data.nitems);
        })
        .catch(err => console.log(err))
    },
    setContinueToLoad({commit, state}, {limit, offset, book_id}){
      if(offset>state.flag){
        commit('SET_FLAG_BOOK', limit)
        callApi.getData(
          `?path=/indexs&limit=${limit}&offset=${offset}&query={"book_id":"${book_id}"}`
        ).then(res=>{
            let data = res.data
            commit('SET_SARABUN_INFENIT', data.items)
        }).catch(err => console.log(err))
      }else{return}
      
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
      commit('SET_BOOK_SELECTED', {})
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
