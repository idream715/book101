<template>
  <div class="about">
      <v-container>
        
        <v-overlay v-model="loading">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>

        <v-card>
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
                <v-btn 
                  color="primary" 
                  v-if="filBookCategoty"
                  outlined 
                  @click="filBookCategoty = null" 
                  >
                  <p class="mt-2">ยกเลิก</p>
                  <v-icon class="mb-1" right>mdi-close-circle</v-icon> 
                </v-btn>
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
              class="mx-auto ma-5 " 
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
    <Sarabun @emitFalse="setOpenDialog" :dialog="openDialog" />
  </div>
</template>

<script>
// @ is an alias to /src
import Sarabun from '@/components/Sarabun.vue'

export default {
  components: {
    Sarabun
  },
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
    bookSelect(selected){
      this.$store.dispatch('setBookSelected', selected)
      this.$store.dispatch('setPagenation', {limit:50, offset:0})
      this.openDialog = !this.openDialog
    },
    setOpenDialog(val){
      this.openDialog = val
    },
  }
}
</script>

