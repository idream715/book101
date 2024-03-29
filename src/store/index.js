import Vue from 'vue'
import Vuex from 'vuex'
import callApi from '@/plugins/axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    totalsBooks: 0,
    books: [],
    totalsIndexs: 0,
    indexs: [],
    overlay: false,
    notfound: false,
    words_search: [],
    bookSelected: {},
    sarabunSelected: [],
    totalsSarabun: 0,
    search_random: [],
    flag: 1,
    // ------cards------ //
    cards: [],
    totalsCards: 0,
    cardTags: [],
    cardWordSearch: [],
    cardToolbarFlag: '',
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
      state.search_random.push(payload)
    },
    SET_FLAG(state){
      state.flag+=10
    },
    CLEAR_SEARCH_RANDOM(state){
      state.search_random = []
    },
    CLEAR_FLAG(state){
      state.flag=1
    },
    SET_FLAG_BOOK(state, payload){
      state.flag += payload
    },
    SET_CARDS(state, payload){
      state.cards = payload
    },
    SET_TOTALS_CARDS(state, payload){
      state.totalsCards = payload
    },
    SET_CARDS_TAGS(state, payload){
      state.cardTags = payload
    },
    SET_CARDS_INFINITE(state, payload){
      payload.forEach(x=>{state.cards.push(x)})
    },
    SET_CARDS_WORDS_SEARCH(state, payload){
      state.cardWordSearch = payload
    },
    SET_FLAGS_CARD(state, payload){
      state.flag += payload
    },
    SET_FLAGS_TOOLBAR(state, payload) {
      switch(payload) {
        case 0:
          state.cardToolbarFlag = ''
          break;
        case 1:
          state.cardToolbarFlag = 'filter'
          break;
        case 2:
          state.cardToolbarFlag = 'search'
          break;
      }
    },

  },
  actions: {
    // GET
    getBookFromApi({ commit }, creator){
      if (!creator) return null

      commit('SET_OVERLAY', true)
      callApi.getData(`/books/all/?limit=0&offset=0&creator=${creator}`)
        .then(res=>{
          let data = res.data
          commit('SET_OVERLAY', false)
          commit('SET_TOTALS_BOOKS', data.nItems)
          commit('SET_BOOKS', data.items)
        })
        .catch(err => console.log(err))
    },
    getCardFromApi({ commit }, creator){
      if (!creator) return null

      commit('SET_OVERLAY', true)
      commit('CLEAR_FLAG')
      callApi.getData(`/cards/all/?limit=48&offset=0&creator=${creator}`)
        .then(res=>{
          let data = res.data
          commit('SET_NOTFOUND', false)
          commit('SET_OVERLAY', false)
          commit('SET_TOTALS_CARDS', data.nItems)
          commit('SET_CARDS', data.items)
        })
        .catch(err => console.log(err))
    },
    getTagOfCards({ commit }, creator){
      if (!creator) return null

      commit('SET_OVERLAY', true)
      callApi.getData(`/cards/tags/?limit=100&offset=0&creator=${creator}`)
        .then(res=>{
          let data = res.data
          commit('SET_OVERLAY', false)
          commit('SET_CARDS_TAGS', data.items)
        })
        .catch(err => console.log(err))
    },
    // SET
      // PATH INDEXS
    setwordssearch({commit},words){
      commit('SET_WORDS_SEARCH',words)
    },
    setFirstIndexsFromApi({ commit },{ words, page, creator }){

      if (!creator) return null

      commit('SET_INDEXS', [])
      commit('SET_WORDS_SEARCH',words)
      commit('CLEAR_FLAG')
      let tags = words.map(element => element.text);

      let body = {
        keywords: tags,
        type: 'books',
        creator: parseInt(creator),
        limit: 10,
        offset: page,
        pageNo: 0
      }
      commit('SET_OVERLAY', true)
      callApi.postData(`/search` , body)
        .then(res=>{
          let data = res.data
          commit('SET_OVERLAY', false)
          if(data.nItems === 0){commit('SET_NOTFOUND', true)}else{commit('SET_NOTFOUND', false)}
          commit('SET_TOTALS_INDEXS', data.nItems)
          let details = data.items.map(x=>x.chapterDetail)
          let index = data.items.map(x=>x.chapterHeading)
          function marks(array1,array2){
            let marks = []
            array1.forEach(index => {
              let render = index
              if(render !== '') {
                array2.forEach(word=>{render = render.replaceAll(word.text,`<mark>${word.text}</mark>`)})
              }
              marks.push(render)
            })
            return marks
          }
          let indexmarked =  marks(index,words)
          let detailsmarked = marks(details,words)
          let count = detailsmarked.map(v => {
            let c = v.match(/mark/g)
            return (c === null) ? 0 : c.length
          })
          data.items.forEach((item,i) =>{
            item["mark_index"]= indexmarked[i]
            item["mark_details"]= detailsmarked[i]
            item["count"] = count[i]
          })
          data.items.sort((a,b) => b.count - a.count);
          commit('SET_INDEXS', data.items)
        }).catch(err => console.log(err))
    },
    setFirstIndexsFromApi_infenit({ commit, state },{ words, page, creator }){

      if (!creator) return null

      if(page>state.flag){
        commit('SET_FLAG')
        commit('SET_WORDS_SEARCH',words)
        let tags = []

        words.forEach(element => {
          let tag = element.text
          tags.push(tag)
        });

        let body = {
          keywords: tags,
          type: 'books',
          creator: parseInt(creator),
          limit: 10,
          offset: page,
          pageNo: 0
        }

        callApi.postData(`/search` , body)
          .then(res=>{
            let data = res.data
            let details = data.items.map(x=>x.chapterDetail)
            let index = data.items.map(x=>x.chapterHeading)
            function marks(array1,array2){
              let marks = []
              array1.forEach(index => {
                let render = index
                if(render !== '') {
                  array2.forEach(word=>{
                    render = render.replaceAll(word.text,`<mark>${word.text}</mark>`)
                  })
                }
                marks.push(render)
              })
              return marks
            }
            let indexmarked =  marks(index,words)
            let detailsmarked = marks(details,words)
            let count = detailsmarked.map(v => {
              let c = v.match(/mark/g)
              return (c === null) ? 0 : c.length
            })
            data.items.forEach((item,i) =>{
              item["mark_index"]= indexmarked[i]
              item["mark_details"]= detailsmarked[i]
              item["count"]= count[i]
            })
            data.items.sort((a,b) => b.count - a.count);
            commit('SET_INDEXS_INFENIT', data.items)
          }).catch(err => console.log(err))
      }else{return}
    },
    setsearchrandom({ commit },number){
      commit('SET_OVERLAY', true)
      callApi.getData(`/indexs/${number}`)
      .then(res=>{
        commit('SET_OVERLAY', false)
        let data = res.data
        commit('SET_SEARCH_RANDOM',data.items)
      })
      .catch(err => console.log(err))
    },
    setbook_index({ commit }, id){
      commit('SET_OVERLAY', true)
      callApi.getData(`/books/${id}`)
        .then(res=>{
          let data = res.data
          commit('SET_OVERLAY', false)
          commit('SET_BOOK_SELECTED', data)
        })
        .catch(err => console.log(err))
    },
      // PATH BOOKS
    setBookSelected({ commit }, selected){
      commit('SET_BOOK_SELECTED', selected)
    },
    setFirstSarabun({ commit, state }, { limit, offset, book_id }){
      commit('SET_OVERLAY', true)
      callApi.getData(
        `/books/${book_id}/index?limit=${limit}&offset=${offset}&creator=0`
      ).then(res=>{
          let data = res.data
          commit('SET_SARABUN', data.items)
          commit('SET_OVERLAY', false)
          if(!state.totalsSarabun)
            commit('SET_SARABUN_TOTAL', data.nItems);
        })
        .catch(err => console.log(err))
    },
    setContinueToLoad({ commit, state }, { limit, offset, book_id }){
      if(offset>state.flag){
        commit('SET_FLAG_BOOK', limit)
        callApi.getData(
          `/books/${book_id}/index?limit=${limit}&offset=${offset}&creator=0`
        ).then(res=>{
            let data = res.data
            commit('SET_SARABUN_INFENIT', data.items)
        }).catch(err => console.log(err))
      }else{return}

    },
      // PATH CARDS
    setCardInfiniteScrolled({ commit }, { offset, creator }){
      commit('SET_OVERLAY', true)
      callApi.getData(`/cards/all/?limit=48&offset=${offset}&creator=${creator}`)
        .then(res=>{
          let data = res.data
          commit('SET_OVERLAY', false)
          commit('SET_CARDS_INFINITE', data.items)
          commit('SET_FLAGS_CARD', offset)
        })
        .catch(err => console.log(err))
    },
    setFilteredCards( { commit }, { words, offset, creator }){
      if (!creator) return null

      commit('SET_NOTFOUND', false)
      commit('SET_OVERLAY', true)
      commit('SET_CARDS', [])
      commit('SET_TOTALS_CARDS', 0)
      // commit('SET_CARDS_WORDS_SEARCH',words)
      //
      commit('CLEAR_FLAG')

      let qs = ''

      words.forEach(word => qs += '|' + word)

      callApi.getData(
        `/cards/all?limit=${offset}&qstr=${qs}&creator=${creator}`
      ).then(res=>{
          let data = res.data
          commit('SET_FLAGS_TOOLBAR', 1)
          commit('SET_OVERLAY', false)
          commit('SET_TOTALS_CARDS', data.nItems)
          commit('SET_CARDS', data.items)
      }).catch(err => console.log(err))

    },
    setFilteredCardsContinue( { commit, state }, { words, offset, creator } ) {
      if (offset > state.flag) {
        commit('SET_OVERLAY', true)
        commit('SET_FLAGS_CARD', 48)
        let qs = ''

        words.forEach(word => qs += '|' + word)

        callApi.getData(
          `/cards/all?limit=48&offset=${offset}&qstr=${qs}&creator=${creator}`
        ).then(res=>{
            let data = res.data
            commit('SET_FLAGS_TOOLBAR', 1)
            commit('SET_OVERLAY', false)
            commit('SET_TOTALS_CARDS', data.nItems)
            commit('SET_CARDS_INFINITE', data.items)
        }).catch(err => console.log(err))
      }
    },
    setSearchedCards( { commit }, { words, creator, tags }){
      if (!creator) return null

      commit('SET_NOTFOUND', false)
      commit('SET_OVERLAY', true)
      commit('SET_CARDS', [])
      commit('SET_TOTALS_CARDS', 0)
      commit('CLEAR_FLAG')

      const data = {
        keywords: words,
        type: 'cards',
        limit: 48,
        creator: parseInt(creator),
        tags: tags,
        offset: 0,
        pageNo: 0
      }

      callApi.postData(
        `/search`, data
      ).then(res=>{
        let data = res.data
        data.nItems === 0 ? commit('SET_NOTFOUND', true) : commit('SET_NOTFOUND', false)
        commit('SET_FLAGS_TOOLBAR', 2)
        commit('SET_OVERLAY', false)
        commit('SET_TOTALS_CARDS', data.nItems)
        commit('SET_CARDS', data.items)
      }).catch(err => console.log(err))

    },
    setSearchedCardsContinue( { commit, state }, { words, offset, creator, tags }) {
      if (offset > state.flag) {
        commit('SET_OVERLAY', true)
        commit('SET_FLAGS_CARD', 48)

        const data = {
          keywords: words,
          type: 'cards',
          limit: 48,
          creator: parseInt(creator),
          offset: offset,
          tags: tags,
          pageNo: 0
        }

        callApi.postData(
          `/search`, data
        ).then(res=>{
            let data = res.data
            commit('SET_FLAGS_TOOLBAR', 2)
            commit('SET_OVERLAY', false)
            commit('SET_CARDS_INFINITE', data.items)
        }).catch(err => console.log(err))
      }
    },
    // clear state
    clear({commit}){
      commit('SET_TOTALS_INDEXS', 0)
      commit('SET_INDEXS', [])
      commit('SET_WORDS_SEARCH', [])
      commit('SET_NOTFOUND', false)
      commit('CLEAR_SEARCH_RANDOM')
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
      if(state.books.length > 0) {
        return state.books.sort((a, b) => {
          return a['bookName'].localeCompare(b['bookName'], 'th')
        })
      }
      return state.books
    },
    getTotalCards(state){
      return state.totalsCards
    },
    getCards(state){
      return state.cards
    },
    getCheckToolbar(state){
      return state.cardToolbarFlag
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

    getTags(state) {
      return state.cardTags.map(x => x.tagName)
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
