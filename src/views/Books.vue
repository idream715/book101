<template>
  <div class="about">
      <v-container>
        <v-row no-gutters>
          <v-col 
            v-for="n in books"
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
    <Sarabun/>
  </div>
</template>

<script>
// @ is an alias to /src
import Sarabun from '@/components/Sarabun.vue'

export default {
  components: {
    Sarabun
  },
  created(){
    if(this.books.length === 0 ){
      this.$store.dispatch('getBookFromApi')
    }
  },
  computed:{
    books(){
      return this.$store.getters.getBooks
    }
  },
  methods: {
    bookSelect(selected){
      this.$store.dispatch('setBookSelected', selected)
    }
  }
}
</script>

