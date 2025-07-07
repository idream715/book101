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
                  variant="outlined"
                  density="compact"
                  label="เลือกชุดหนังสือ หรือ พิมพ์ชื่อหนังสือ"
                ></v-combobox>
              </v-col>
              <v-col cols="2" md="2" class="mb-8">
                  <v-icon
                    color="primary"
                    v-if="filterBookValue"
                    variant="outlined"
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
              :to="`/book/${n.bookId}`"
              @click="trackBookClick(n)"
              >
              <v-img
                :src="n.bookCoverThumbnails"
                height="200px"
                width="500px"
              >
              </v-img>
              <v-card-text
                class="
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
import { useBooksStore } from '@/stores/books'
import { useSearchStore } from '@/stores/search'

export default {
  data() {
    return {
      openDialog : false,
      filterBookValue:"",
    }
  },
  setup() {
    const booksStore = useBooksStore()
    const searchStore = useSearchStore()
    return { booksStore, searchStore }
  },
  created() {
    this.booksStore.getBooksFromApi(this.$route.query.t)
  },
  computed:{
    books(){
      return this.booksStore.getBooks
    },
    filterBooks(){
      const books = this.books || []
      if (this.filterBookValue && !this.items.includes(this.filterBookValue)) {
        console.log(`1`)
        return books.filter(el => el.bookName.includes(this.filterBookValue))
      } else if(this.filterBookValue && this.items.includes(this.filterBookValue)) {
        console.log(`12`)
        return books.filter(el => el.categoryName === this.filterBookValue)
      } else {
        console.log(`3`)
        return books
      }
    },
    loading(){
      return this.searchStore.getoverlay
    },
    items(){
      return Array.from(new Set((this.booksStore.getBooks || []).map(a => a.categoryName)))
    },

  },
  methods: {
    trackBookClick(selected){
      this.$gtag.event('view_book_from_click', {
          'event_category': 'view_item',
          'event_label': `Books Clicked: ${selected['bookName']}`,
          'value': `${Number(selected['bookId'])}`
        })
    },
    bookSelect(selected){
      // Legacy method - kept for compatibility
      this.trackBookClick(selected)
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
