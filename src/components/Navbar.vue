<template>
  <div>
    <!-- แถบ app-bar -->
    <div v-if="!on">
      <v-app-bar app color="primary" dark hide-on-scroll
        src="https://images.unsplash.com/photo-1503455637927-730bce8583c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
        width="100%">

        <!-- เมนู bar -->
        <v-toolbar-title mt-2>
          <div class="d-flex align-center">
            <v-img alt="logo" class=" mt-2 hidden-sm" contain min-width="45"
              src="@/assets/logo1.png" width="45" />
            <v-btn text router-link to="/">
              <h1 v-if="wn" style="color:white;font-size:18px;"></h1>
              <h1 v-else style="color:white;font-size:24px; font-family: 'Sarabun', sans-serif;">{{ headingWords }}</h1>
            </v-btn>
          </div>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon router-link to="/" text @click="clearBook">
          <v-icon>mdi-home</v-icon>
        </v-btn>
        <v-btn v-if="close" icon @click="routingTo('/Books', creator)" text>
          <v-icon>mdi-book</v-icon>
        </v-btn>
        <v-btn v-else icon @click="routingTo('/Books', creator)" text>
          <v-icon>mdi-book-open-page-variant</v-icon>
        </v-btn>
      </v-app-bar>

    </div>
    <div v-else-if="checkHome">
      <v-app-bar
        absolute
        color="transparent"
        elevate-on-scroll
        scroll-target="#scrolling-techniques-7"
      >
        <v-spacer></v-spacer>
        <v-btn color="white" rounded text @click="$vuetify.goTo('#features')">
          <v-icon>mdi-information-outline</v-icon>
          &nbsp;&nbsp;หนังสือของยาย
        </v-btn>
      </v-app-bar>
    </div>
    <!-- ปุ่ม to top -->
    <v-btn v-scroll="onScroll"  v-show="fab" fab fixed bottom right >
      <!-- <v-btn v-model="fab" color="blue darken-3" dark fab  >
        <v-icon>mdi-chevron-up</v-icon>
      </v-btn> -->
      <v-speed-dial v-model="fab">
        <template v-slot:activator>
          <v-btn v-model="fab" color="blue darken-3" dark fab>
            <v-icon v-if="fab">mdi-close</v-icon>
          </v-btn>
        </template>
        <v-btn v-model="fab" color="blue lighten-1" dark fab @click="toTop">
          <v-icon>mdi-chevron-up</v-icon>
        </v-btn>
      </v-speed-dial>

    </v-btn>

   <v-overlay v-if="setoverlay===true && on">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

  </div>
</template>

<script>

export default {
  name: 'Navbar',
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
      this.$store.dispatch('clear')
  },
  mounted () {
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
      return this.$vuetify.breakpoint.xsOnly
    },
    setoverlay(){
      return this.$store.getters.getoverlay
    },
  },

  methods:{
    routingTo (path, creator) {
      this.clearBook()
      return this.$router.push({ path: path, query: { t: creator } })
    },
    closs(){
      this.dialog=false
      this.$store.dispatch('clear')
    },
    onScroll (e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset ||   e.target.scrollTop || 0
      this.fab = top > 30
    },
    toTop () {
      this.$vuetify.goTo(0)
    },
    clearBook(){
      this.page = 1
      this.$store.dispatch('clearSarabun')
      this.$store.dispatch('clearTotalsSarabun')
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