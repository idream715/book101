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
                  v-model:search="search"
                  @update:search="onFilter"
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

<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBooksStore } from '@/stores/books'
import { useSearchStore } from '@/stores/search'

const route = useRoute()
const router = useRouter()
const booksStore = useBooksStore()
const searchStore = useSearchStore()

const openDialog = ref(false)
let filterBookValue = ref('')
const search = ref('')

const books = computed(() => booksStore.getBooks)

const filterBooks = computed(() => {
  console.log(filterBookValue.value)
  const booksData = books.value || []
  if (filterBookValue.value && !items.value.includes(filterBookValue.value)) {
    return booksData.filter(el => el.bookName.includes(filterBookValue.value))
  } else if (filterBookValue.value && items.value.includes(filterBookValue.value)) {
    return booksData.filter(el => el.categoryName === filterBookValue.value)
  } else {
    return booksData
  }
})

const onFilter = (value) => {
  console.log(filterBookValue.value)
  console.log(value)
}

const loading = computed(() => searchStore.getoverlay)

const items = computed(() => {
  return Array.from(new Set((booksStore.getBooks || []).map(a => a.categoryName)))
})

const trackBookClick = (selected) => {
  // Access gtag from globalProperties
  const { $gtag } = getCurrentInstance().appContext.config.globalProperties
  $gtag.event('view_book_from_click', {
    'event_category': 'view_item',
    'event_label': `Books Clicked: ${selected['bookName']}`,
    'value': `${Number(selected['bookId'])}`
  })
}

const bookSelect = (selected) => {
  // Legacy method - kept for compatibility
  trackBookClick(selected)
  let openBook = router.resolve({path: `/book/${selected['bookId']}`})
  window.open(openBook.href, '_blank')
}

const setOpenDialog = (val) => {
  openDialog.value = val
}

onMounted(() => {
  booksStore.getBooksFromApi(route.query.t)
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Sarabun&display=swap');

.books{
  font-family: 'Sarabun', sans-serif;
}
</style>
