<template>
  <div class="books">
      <v-container>
        
        <v-overlay v-model="loading">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>

        <v-card flat class="mt-3">
          <v-container fluid>
            <v-row
              align="center"
            >
              <v-col cols="10">
                <v-autocomplete
                  v-model="filBookCategoty"
                  :items="items"
                  outlined
                  dense
                  label="เลือกชุดหนังสือ"
                ></v-autocomplete>
              </v-col>
              <v-col cols="2" md="2" class="mb-8">
                  <v-icon 
                    color="primary" 
                    v-if="filBookCategoty"
                    outlined 
                    @click="filBookCategoty = null" 
                    >
                    mdi-filter-remove 
                  </v-icon> 
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        <v-row>
          <v-col 
            v-for="n in filterBooks"
            :key="n.book_name"
            cols="6"
            sm="4"
            md="3"
            lg="2"
            xl="1"
            > 
            <v-card 
              class="mx-auto" 
              max-width="160"
              @click="bookSelect(n)"
              >
              <v-img 
                :src="n.book_link_jpg" 
                height="200px" 
                width="500px"
              >
              </v-img>
              <v-card-text 
                class="
                  text-truncate 
                  caption
                "
              >
                {{n.book_name}}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
  </div>
</template>

<script>


export default {
  data() {
    return {
      openDialog : false,
      filBookCategoty:"",
    }
  },
  created(){
    if(this.books.length === 0 ){
      this.$store.dispatch('getBookFromApi')
    }
    this.track()
  },
  computed:{
    books(){
      return this.$store.getters.getBooks
    },
    filterBooks(){
      if(this.filBookCategoty){
        return this.books.filter(el => el.book_category === this.filBookCategoty)
      }else{
        return this.books
      }
    },
    loading(){
      return this.$store.getters.getoverlay     
    },
    items(){
      return Array.from(new Set(this.$store.getters.getBooks.map(a => a.book_category)))   
    },
    
  },
  methods: {
    track () {
      this.$gtag.pageview({
        page_path: '/books',
      })
    },
    bookSelect(selected){
      //new tab
      let openBook = this.$router.resolve({path: `/book/${selected['#']}`});
      window.open(openBook.href, '_blank');
    },
    setOpenDialog(val){
      this.openDialog = val
    },
  }
}
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Sarabun&display=swap');

.books{
  font-family: 'Sarabun', sans-serif;
}
</style>
