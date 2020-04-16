<template>
  <div class="about">
      <v-container>
        <v-row no-gutters="">
          <v-col 
          v-for="n in 47"
          :key="n"
          
          >
            <v-card class="mx-auto mt-3 mb-5" max-width="180">
              <v-img src="https://book.rgtcenter.com/cover/052-01.jpg" height="250px"></v-img>
              <v-card-title>
                <v-title class="text-truncate">
                  ที่นี่มีคำตอบ ที่นี่มีคำตอบ
                </v-title>
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
  }
}
</script>
