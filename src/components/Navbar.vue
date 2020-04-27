<template>
  <div>
    <!-- หน้า Home -->
    <div v-if="on" class="homep" align="center">
      <div v-if="opn" align="end">
        <v-btn dark router-link to="/Books" text>
          <v-icon class="mr-2"></v-icon>หนังสือธรรมะ
        </v-btn>

        <v-btn v-if="hp" dark router-link to="/" text>
          <v-icon class="mr-2"></v-icon>ค้นเนื้อหา
        </v-btn>
        <v-btn v-else dark router-link to="/home2" text>
          <v-icon class="mr-2"></v-icon>ค้นหาการ์ด
        </v-btn>

        <v-btn dark router-link to="/About" text>
          <v-icon class="mr-2"></v-icon>เกี่ยวกับ
        </v-btn>
      </div>
      <div v-else align="end" class="mr-5">
          <v-app-bar-nav-icon dark @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          <v-navigation-drawer v-model="drawer" absolute right temporary color="blue lighten-2">
            <v-list nav dense>
              <v-list-item-group align="start" v-model="group">
                <v-list-item>
                  <v-list-item-title>
                    <v-btn dark router-link to="/Books" text>
                      <v-icon class="mr-2"></v-icon><v-icon class="mr-4">mdi-book-open-page-variant</v-icon>หนังสือธรรมะ
                    </v-btn>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>
                    <v-btn v-if="hp" dark router-link to="/" text>
                      <v-icon class="mr-2"></v-icon><v-icon class="mr-4">mdi-view-carousel</v-icon>ค้นเนื้อหา
                    </v-btn>
                    <v-btn v-else dark router-link to="/Home2" text>
                      <v-icon class="mr-2"></v-icon><v-icon class="mr-4">mdi-view-carousel</v-icon>ค้นหาการ์ด
                    </v-btn>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>
                    <v-btn dark router-link to="/About" text>
                      <v-icon class="mr-2"></v-icon><v-icon class="mr-4">mdi-account-circle</v-icon>เกี่ยวกับ
                    </v-btn>
                  </v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-navigation-drawer>
      </div>
      
      <div class="d-flex" align="center" justify="center">
        <v-row v-if="pz" align="center" justify="center">
          <v-col>
            <v-row>
              <v-col cols="5">
                <v-img class="ml-12 mt-12" alt="logo" contain min-width="175" 
                  src="@/assets/logo1.png" width="45" />
              </v-col>
              <v-col cols="5">
                <v-row align="center" justify="center">
                  <v-col cols="12">
                    <h1 style="color:white" class="mt-8">คำสอนคุณครูไม่ใหญ่</h1>
                  </v-col>
                  <v-col cols="12">
                    <v-combobox v-model="words_search" :items="items" :search-input.sync="search" hide-selected hint="สูงสุด 5 เเท็ก"
                      :label="label_search" multiple persistent-hint chips solo style="width:325px;">
                      <template v-slot:no-data>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title align="center" justify="center">
                              ยืนยันคำว่า"<strong>{{ search }}</strong>"กรุณากด<kbd>enter</kbd> 
                              <v-btn class="ml-4" dark color="blue lighten-1" @click="clicksearch_home"><v-icon >mdi-magnify</v-icon></v-btn>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-combobox>
                  </v-col>
                  <v-col cols="5">
                    <v-btn @click="clicksearch_home" class="mb-4" dark color="blue lighten-1"><v-icon class="mr-3">mdi-magnify</v-icon>ค้นหา</v-btn>
                  </v-col>
                  <v-col cols="5">
                    <v-btn @click="searchrandom" class="mb-4" dark color="blue lighten-1">อ่านอะไรดี</v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col> 
        </v-row>

        <v-row v-else align="center" justify="center">
          <v-col cols="12">
            <v-img class="mt-3" alt="logo" contain min-width="200" 
              src="@/assets/logo1.png" width="45" />
            <h1 style="color:white" class="mt-8">คำสอนคุณครูไม่ใหญ่</h1>
          </v-col>
          <v-col cols="12">
            <v-combobox v-if="hp" v-model="words_search" :items="items" :search-input.sync="search" hide-selected hint="สูงสุด 5 เเท็ก"
              label="ค้นหาการ์ด" multiple persistent-hint chips solo style="width:325px;">
              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title align="center" justify="center">
                      ยืนยันคำว่า"<strong>{{ search }}</strong>"กรุณากด<kbd>enter</kbd> 
                      <v-btn class="ml-4" dark color="blue lighten-1" @click="clicksearch_home"><v-icon >mdi-magnify</v-icon></v-btn>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-combobox>
            <v-combobox v-else v-model="words_search" :items="items" :search-input.sync="search" hide-selected hint="สูงสุด 5 เเท็ก"
              label="ค้นหาธรรมะหลวงพ่อ" multiple persistent-hint chips solo style="width:325px;">
              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title align="center" justify="center">
                      ยืนยันคำว่า"<strong>{{ search }}</strong>"กรุณากด<kbd>enter</kbd> 
                      <v-btn class="ml-4" dark color="blue lighten-1" @click="clicksearch_home"><v-icon >mdi-magnify</v-icon></v-btn>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-combobox>
          </v-col>
          <v-col cols="4" sm="2" md="2" lg="1">
            <v-btn @click="clicksearch_home" class="mb-4" dark color="blue lighten-1"><v-icon class="mr-3">mdi-magnify</v-icon>ค้นหา</v-btn>
          </v-col> 
          <v-col cols="4" sm="2" md="2" lg="1">
            <v-btn v-if="hp" @click="searchrandom" class="mb-4" dark color="blue lighten-1">กดสุ่มการ์ด</v-btn>
            <v-btn v-else @click="searchrandom" class="mb-4" dark color="blue lighten-1">อ่านอะไรดี</v-btn>
          </v-col> 
        </v-row>
      </div>
      
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
            <v-btn text router-link to="/">
              <h1 v-if="wn" style="color:white;font-size:18px;"></h1>
              <h1 v-else style="color:white;font-size:24px; font-family: 'Sarabun', sans-serif;">คำสอนคุณครูไม่ใหญ่</h1>
            </v-btn>
          </div>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon router-link to="/" text @click="clearBook">
          <v-icon>mdi-home</v-icon>
        </v-btn>
        <v-btn v-if="close" icon router-link to="/Books" text @click="clearBook">
          <v-icon>mdi-book</v-icon>
        </v-btn>
        <v-btn v-else icon router-link to="/Books" text @click="clearBook">
          <v-icon>mdi-book-open-page-variant</v-icon>
        </v-btn>
      </v-app-bar>

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
    </div>

   <v-overlay v-if="setoverlay===true && on">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-dialog v-model="dialog" width="1000"  >
      <v-card v-for="(item,i) in random" :key="i" :value="item">
        <v-card-title class="headline lighten-2" primary-title>{{ item.search_index }}</v-card-title>
        <v-card-text class="grey--text">จากหนังสือ:{{item.search_heading}}</v-card-text>
        <v-card-text style="font-size: 17px; white-space: pre-wrap;">{{ item.search_details }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="searchrandom">สุ่มเพิ่ม</v-btn>
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
    group: null,
    model: '',
    words_search:'',
    label_search:'',
  }),
  created(){
      this.words_search = ''
      
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
      if (this.$route.name === 'Home' || this.$route.name ===  'Home2') {
        return true
      }
        return false
    },
    close () {
      if (this.$route.name === 'Indexs') {
        return true
      }
        return false 
    },
    hp () {
      if (this.$route.name === 'Home2') {
        return true
      }
        return false 
    },
    opn () {
      // console.log (!this.$vuetify.breakpoint.xsOnly)
      return !this.$vuetify.breakpoint.xsOnly
    },
    wn () {
      return this.$vuetify.breakpoint.xsOnly
    },
    pz () {
      return this.$vuetify.breakpoint.smOnly
    },
    random(){
      return this.$store.getters.getsearchrandom
    },
    setoverlay(){
      return this.$store.getters.getoverlay
    },

  },

  methods:{
    clicksearch_home(){
      if(this.words_search===''){
        this.label_search = 'กรุณาใสคำที่ต้องการค้นหา'
      }else{
        this.$router.push('/Indexs')}
        this.$store.dispatch('clearindex')
        this.$store.dispatch('setFirstIndexsFromApi',{words:this.words_search,page:"0",infenit:false})

    },
    searchrandom(){
      this.$store.dispatch('clear')
      let number = Math.ceil(Math.random() *3548)
      this.$store.dispatch('setsearchrandom',number)
      this.dialog=true
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
    words_search (val) {
      if (val.length > 5) {
        // หน้า home
        this.$nextTick(() => this.words_search.pop()) 
      }
    },
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
      /* หน้า home */
  .homep {
    font-family: 'Sarabun', sans-serif;
    position: relative;
    background-image: url(https://images.unsplash.com/photo-1503455637927-730bce8583c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80);
    width: 100%;
    height: 100vh;
    background-repeat: no-repeat;
    background-size: cover;
  }
  
</style>