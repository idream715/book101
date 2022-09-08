<template>
  <div class="cards-list">
    <v-container>
      <v-row>

      </v-row>
      <v-row>
        <v-col
          v-for="n in 24"
          :key="n"
          cols="4"
        >
          <v-card>
            <v-img
              :src="src"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="400px"
            >
              <v-card-title v-text="title"></v-card-title>
            </v-img>
            <v-card-actions>
              <v-btn
                color="orange lighten-2"
                text
              >
                Explore
              </v-btn>

              <v-spacer></v-spacer>

              <v-btn
                icon
                @click="show = !show"
              >
                <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>
            </v-card-actions>

          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data () {
      return {
        src: 'https://s3.ap-southeast-1.amazonaws.com/book.dhamma01.com/cards/luangpu.jpg',
        title: '',
        show: false
      }
    },
  created(){
      this.$store.dispatch('clear')
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Sarabun&display=swap');

.cards-list {
  font-family: 'Sarabun', sans-serif;
}
</style>