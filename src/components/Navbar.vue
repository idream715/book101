<template>
    <div>
      <!-- แถบ app-bar -->
      <v-app-bar
        v-if="!on"
        color="primary"
        theme="dark"
        absolute
        elevation="4"
        image="https://images.unsplash.com/photo-1503455637927-730bce8583c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
      >
        <!-- เมนู bar -->
        <v-toolbar-title mt-2>
          <div class="d-flex align-center">
            <v-img alt="logo" class=" mt-2 hidden-sm" contain min-width="45"
              src="@/assets/logo1.png" width="45" />
            <v-btn variant="text" router-link to="/">
              <h1 v-if="wn" style="color:white;font-size:18px;"></h1>
              <h1 v-else style="color:white;font-size:24px; font-family: 'Sarabun', sans-serif;">{{ headingWords }}</h1>
            </v-btn>
          </div>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon variant="plain" router-link to="/" @click="clearBook">
          <v-icon>mdi-home</v-icon>
        </v-btn>
        <v-btn v-if="close" icon variant="plain" @click="routingTo('/Books', creator)">
          <v-icon>mdi-book</v-icon>
        </v-btn>
        <v-btn v-else icon variant="plain" @click="routingTo('/Books', creator)">
          <v-icon>mdi-book-open-page-variant</v-icon>
        </v-btn>
      </v-app-bar>
      <!-- Removed unnecessary transparent navbar for Home page -->
    <!-- ปุ่ม to top -->
      <v-fab 
        v-show="fab"
        location="bottom end"
        color="blue-darken-3"
        icon="mdi-chevron-up"
        @click="toTop"
      ></v-fab>

      <v-overlay v-if="setoverlay===true && on && $route.name !== 'Home'">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </div>

</template>

<script>
import { useBooksStore } from '@/stores/books'
import { useSearchStore } from '@/stores/search'

export default {
  name: 'Navbar',
  setup() {
    const booksStore = useBooksStore()
    const searchStore = useSearchStore()
    return { booksStore, searchStore }
  },
  data: () => ({
    drawer: false,
    fab: false,
    title: '',
    dialog: false,
    group: null,
    activator: null,
    attach: null,
    editing: null,
    index: -1,
    menu: false,
    x: 0,
    y: 0,
  }),
  created(){
      this.searchStore.clear()
  },
  mounted () {
    window.addEventListener('scroll', this.onScroll)
  },
  beforeUnmount () {
    window.removeEventListener('scroll', this.onScroll)
  },
  computed:{
    activeFab () {
      switch (this.tabs) {
        case 'one': return { class: 'purple', icon: 'account_circle' }
        case 'two': return { class: 'red', icon: 'edit' }
        case 'three': return { class: 'green', icon: 'keyboard_arrow_up' }
        default: return {}
      }
    },
    on () {
      if (this.$route.name === 'Home' || this.$route.name ===  'SearchPage') {
        return true
      }
        return false
    },
    headingWords () {
      if (this.$route.name === 'Cards' && this.creator === '1') {
        return 'การ์ดคำสอนคุณครูไม่ใหญ่'
      } else if (this.$route.name === 'Cards' && this.creator === '2') {
        return 'การ์ดคำสอนคุณยายอาจารย์'
      } else if (this.$route.name !== 'Cards' && this.creator === '1') {
        return 'คำสอนคุณครูไม่ใหญ่'
      } else if (this.$route.name !== 'Cards' && this.creator === '2') {
        return 'คำสอนคุณยายอาจารย์'
      } else {
        return ''
      }
    },
    creator () {
      return this.$route.query.t
    },
    close () {
      if (this.$route.name === 'Indexs') {
        return true
      }
        return false
    },
    checkHome () {
      if (this.$route.name === 'Home') {
        return true
      }
        return false
    },
    wn () {
      return this.$vuetify.display.xs
    },
    setoverlay(){
      return this.searchStore.overlay
    },
  },

  methods:{
    routingTo (path, creator) {
      this.clearBook()
      return this.$router.push({ path: path, query: { t: creator } })
    },
    closs(){
      this.dialog=false
      this.searchStore.clear()
    },
    onScroll (e) {
      if (typeof window === 'undefined') return
      const top = window.scrollY || e.target?.scrollTop || 0
      this.fab = top > 30
    },
    toTop () {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    clearBook(){
      this.page = 1
      this.booksStore.clearSarabun()
      this.booksStore.clearTotalsSarabun()
    },
  },

  watch:{
    group () {
      this.drawer = false
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun&display=swap');
  #create .v-speed-dial {
    position: absolute;
    right: 25px;
    top: 650px;
  }

  #create .v-btn--floating {
    position: relative;
  }


</style>