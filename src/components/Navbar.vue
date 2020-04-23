<template>
  <div>
    <!-- หน้า Home -->
    <div v-if="on" class="homep d-flex" align="center">
      <v-row align="center" justify="center">
        <v-col cols="4" sm="8" md="2">
            <v-img alt="logo" contain min-width="150" 
            src="@/assets/logo1.png" width="45" />
        </v-col>
        <v-col cols="10" sm="8" md="4">
          <h1 style="color:white">101's DOCTRINE</h1>
          <v-combobox v-model="words_search" :items="items" :search-input.sync="search" hide-selected hint="Maximum of 5 tags"
            :label="label_search" multiple persistent-hint chips solo>
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title align="center" justify="center">
                    "<strong>{{ search }}</strong>". Press <kbd>enter</kbd> 
                    <v-btn  class="ml-4 " dark color="blue lighten-1" @click="clicksearch"><v-icon >mdi-magnify</v-icon></v-btn>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-combobox>
          <v-btn @click="searchrandom" class="mr-8" dark color="red">
            <v-icon class="mr-2">mdi-card-text</v-icon>
            สุ่มอ่านธรรมะ
          </v-btn>
            
          <v-btn dark color="blue" router-link to="/Books">
            <v-icon class="mr-2">mdi-book-open-page-variant</v-icon>
            หนังสือธรรมะ
          </v-btn>
        </v-col>
      </v-row>
    </div>
    
    <!-- แถบ app-bar -->
    <div v-else>
      <v-app-bar app color="primary" dark hide-on-scroll
        src="https://images.unsplash.com/photo-1503455637927-730bce8583c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
        width="100%">

        <!-- เมนู bar -->
        <v-toolbar-title mt-2>
          <div class="d-flex align-center">
            <v-img alt="logo" class=" mt-2 hidden-sm" contain min-width="45"
              src="@/assets/logo1.png" width="45" />
            <v-btn
              text
              router-link to="/"
             >
              <h1 style="color:white;font-size:24px;">101's DOCTRINE</h1>
            </v-btn>
          </div>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon router-link to="/" text @click="clearBook">
          <v-icon>mdi-home</v-icon>
        </v-btn>
        <v-btn icon router-link to="/Books" text @click="clearBook">
          <v-icon>mdi-book-open-page-variant</v-icon>
        </v-btn>
      </v-app-bar>

      <!-- ปุ่ม to top -->
      <v-btn v-scroll="onScroll"  v-show="fab" fab fixed bottom right @click="toTop">
        <v-speed-dial v-model="fab" >
          <template v-slot:activator>
            <v-btn v-model="fab" color="blue darken-3" dark fab  >
              <v-icon>mdi-chevron-up</v-icon>
            </v-btn>
          </template>
          <v-btn fab dark small color="blue darken-1" @click="$vuetify.goTo('#search_index')">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </v-speed-dial>
      </v-btn>


    </div>

    <v-dialog v-model="dialog" width="1000"  >
      <v-card v-for="(item,i) in random" :key="i" :value="item">
        <v-card-title class="headline lighten-2" primary-title>{{ item.search_index }}</v-card-title>
        <v-card-text class="grey--text">จากหนังสือ:{{item.search_heading}}</v-card-text>
        <v-card-text style="font-size: 17px; white-space: pre-wrap;">{{ item.search_details }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="closs">ออก</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
    search: null,
    items: [],
    dialog: false,
    words_search:'',
    label_search:'ค้นหาธรรมะหลวงพ่อ',


  }),
  created(){
    this.label_search = 'ค้นหาธรรมะหลวงพ่อ'
    this.$store.dispatch('clear')
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
      if (this.$route.name === 'Home') {
        return true
      }
        return false
    },
    random(){
      return this.$store.getters.getsearchrandom
    },
    setoverlay(){
      return this.$store.getters.getoverlay
    },

  },

  methods:{
    clicksearch(){
      if(this.words_search===''){
        this.label_search = 'กรุณาใสคำที่ต้องการค้นหา'
      }else{
        this.$store.dispatch('setFirstIndexsFromApi',{words:this.words_search,page:"0"})
        this.$router.push('/Indexs')}
        
    },
    searchrandom(){
      let number = Math.ceil(Math.random() *3000)
      this.$store.dispatch('setsearchrandom',number)
      this.dialog=!this.dialog
    },
    closs(){
      this.dialog=!this.dialog
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
      this.$emit('emitFalse',false)
      this.page = 1
      this.$store.dispatch('clearSarabun')
      this.$store.dispatch('clearTotalsSarabun')
    },
  },
  watch:{
    words_search (val) {
      if (val.length > 5) {
        // หน้า home
        this.$nextTick(() => this.words_search.pop()) 
      }
    },
  },
};
</script>

<style scoped>
  #create .v-speed-dial {
    position: absolute;
    right: 25px;
    top: 650px;
  }

  #create .v-btn--floating {
    position: relative;
  }
      /* หน้า home */
  .homep {
    position: relative;
    background-image: url(https://images.unsplash.com/photo-1503455637927-730bce8583c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80);
    width: 100%;
    height: 100vh;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .Isearch{
     position: relative;
     top: 90px;
     left: 25px;
     width: 450px;
  }
  .Isearch-2{
     position: relative;
     top: 63px;
  }

  @media (min-width: 375px) {
    .Isearch{
     width: 325px;
    }
  }
  
</style>