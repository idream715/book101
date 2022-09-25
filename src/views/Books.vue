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
                <v-combobox
                  v-model="filterBookValue"
                  :items="items"
                  outlined
                  dense
                  label="เลือกชุดหนังสือ หรือ พิมพ์ชื่อหนังสือ"
                ></v-combobox>
              </v-col>
              <v-col cols="2" md="2" class="mb-8">
                  <v-icon
                    color="primary"
                    v-if="filterBookValue"
                    outlined
                    @click="filterBookValue = null"
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
                :src="n.bookCoverThumbnails"
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
                {{n.bookName}}
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
      filterBookValue:"",
    }
  },
  created() {

  this.$store.dispatch('getBookFromApi', this.$route.query.t)

  },
  computed:{
    books(){
      return this.$store.getters.getBooks
    },
    filterBooks(){
      if (this.filterBookValue && !this.items.includes(this.filterBookValue)) {
        console.log(`1`)
        return this.books.filter(el => el.bookName.includes(this.filterBookValue))
      } else if(this.filterBookValue && this.items.includes(this.filterBookValue)) {
        console.log(`12`)
        return this.books.filter(el => el.categoryName === this.filterBookValue)
      } else {
        console.log(`3`)
        return this.books
      }
    },
    loading(){
      return this.$store.getters.getoverlay
    },
    items(){
      return Array.from(new Set(this.$store.getters.getBooks.map(a => a.categoryName)))
    },

  },
  methods: {
    bookSelect(selected){
      //new tab
      console.log(selected)
      let openBook = this.$router.resolve({path: `/book/${selected['bookId']}`});
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
