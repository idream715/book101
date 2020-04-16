<template>
  <div class="about">
      <v-container>
        <v-row no-gutters>
          <v-col 
          v-for="n in books"
          :key="n"
          xs="3"
          md="2"
          >
            <v-card class="mx-auto mt-3 mb-5" max-width="160">
              <v-img :src="n.book_link_jpg" height="200px" width="500px"></v-img>
              <v-card-title>
                <v-text class="text-truncate subtitle-1">
                  {{n.book_name}}
                </v-text>
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    <sarabun msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import sarabun from '@/components/Sarabun.vue'

export default {
  name: 'Home',
  components: {
    sarabun
  },
   created(){
    this.$store.dispatch('getBookFromApi')
  },
  computed:{
    books(){
      return this.$store.getters.getbooks
    },
    Totalbooks(){
      return this.$store.getters.getTotalbooks
    },

  }
}
</script>

