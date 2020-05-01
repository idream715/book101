<template>
  <div>
    <!-- หน้า Home -->
    <!-- เเถบเมนูหน้าคอม -->
    <div v-if="on" class="homep">
      <div v-if="opn" align="end">
        <v-btn dark router-link to="/Books" text>
          <v-icon class="mr-2">mdi-book</v-icon>หนังสือธรรมะ
        </v-btn>
        <v-btn dark router-link to="/About" text>
          <v-icon class="mr-2">mdi-account-circle</v-icon>เกี่ยวกับ
        </v-btn>
      </div>
      <!-- แถบเมนูโทรศัพท์ -->
      <div v-else align="end" class="mr-5">
        <v-menu
        bottom
        left
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            color="white"
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>  
            <v-list-item-title>
              <v-btn router-link to="/Books" text>
                <v-icon class="mr-2"></v-icon><v-icon class="mr-4">mdi-book</v-icon>หนังสือธรรมะ
              </v-btn>
            </v-list-item-title>
          </v-list-item>
          <v-list-item>  
            <v-list-item-title>
              <v-btn router-link to="/About" text>
                <v-icon class="mr-2"></v-icon><v-icon class="mr-4">mdi-account-circle</v-icon>เกี่ยวกับ
              </v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      </div>

      <div>
        <v-row>
          <v-col>
            <v-row :class="ml12">
              <v-col cols="12" sm="6" md="12" align="center">
              <!-- <v-col class="d-flex flex-column align-sm-end align-md-center"> -->
                <v-img class="mt-12" alt="logo" contain max-height="150"
                  src="@/assets/logo1.png" />
              </v-col>
              <v-col cols="12" sm="6" md="12">
              <!-- <v-col class="d-flex flex-column align-sm-start align-md-center"> -->
                <v-row :class="mr12">
                  <v-col cols="12" align="center">
                    <h1 style="color:white;text-shadow:2px 2px 8px #444444;" class="mt-8">คำสอนคุณครูไม่ใหญ่</h1>
                  </v-col>
                  <v-col cols="12" align="center">
                    <v-combobox 
                      v-model="words_search" 
                      :filter="filter" 
                      :hide-no-data="!search" 
                      :items="items" 
                      :search-input.sync="search"  
                      hide-selected  
                      :label="label_search"  
                      multiple 
                      small-chips  
                      solo 
                      style="width:325px" 
                      :delimiters="space"
                    >
                      <template v-slot:no-data>
                        <v-list-item>
                          <span class="subheading mr-1">กด</span>
                          <kbd >
                          <v-icon color="white" class="mb-2">mdi-keyboard-space</v-icon>
                          </kbd>
                          <span class="subheading mr-1">{{text_exp}}</span>
                          <v-chip
                            :color="`${colors[nonce - 1]} lighten-3`"
                            label
                            small
                          >
                            {{ search }}
                          </v-chip>                        
                        </v-list-item>
                      </template>
                      <template v-slot:selection="{ attrs, item, parent, selected }">
                        <v-chip  
                          v-if="item === Object(item)" 
                          v-bind="attrs" 
                          :color="`${item.color} lighten-3`" 
                          :input-value="selected" 
                          label 
                          small >
                          <span class="pr-2">{{ item.text }} </span>
                          <v-icon small @click="parent.selectItem(item)">mdi-close</v-icon>
                        </v-chip>
                      </template>
                    </v-combobox>
                  </v-col>
                  <v-col cols="12" align="center">
                    <v-btn id="search"  @click="clicksearch_home(words_search)" class="mr-10" dark color="blue lighten-1"><v-icon class="mr-3">mdi-magnify</v-icon>ค้นหา</v-btn>
                    <v-btn @click="searchrandom" class="" dark color="blue lighten-1">อ่านอะไรดี</v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
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

     <v-dialog v-model="dialog" max-width="1100" align="center"   >
        <v-card v-for="(item,i) in random" :key="i" :value="item">
          <v-card class="d-flex justify-center" flat>
            <v-card class="max-width-auto"  flat>
              <v-card-text class="headline lighten-2 ">{{item.search_index}}</v-card-text>
              <v-list-item-title class="grey--text  "><v-btn text color="primary lighten-1" @click="clickedSendbook(item.book_id)"><v-icon small class="mr-2">mdi-book-open-page-variant</v-icon>จากหนังสือ:{{item.search_heading}}</v-btn></v-list-item-title>
            <div >
              <v-card-text style="font-size: 17px; white-space: pre-wrap;" >{{item.search_details}}</v-card-text>
            </div>
            </v-card>  
          </v-card>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary lighten-1" text @click="searchrandom">สุ่มอ่าน</v-btn>
            <v-btn color="primary lighten-1" text @click="closs">ออก</v-btn>
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
    dialog: false,
    group: null,  
    label_search:'',
    activator: null,
    attach: null,
    colors: ['green', 'purple', 'indigo', 'cyan', 'teal', 'orange'],
    editing: null,
    index: -1,
    items: [{ header: 'สามารถใส่คำค้นหาได้สูงสุด 5 คำ' }],
    nonce: 1,
    menu: false,
    x: 0,      
    y: 0,
    space:[' '],
    words_search:[],

  }),
  created(){
      this.label_search = 'ค้นหาคำสอน (หนังสือ)'
      this.$store.dispatch('clear')
  },
  computed:{
    text_exp(){
      if (this.$vuetify.breakpoint.xsOnly){
        return 'ที่แป้นพิมพ์เพื่อยืนยัน'
      }
        return  '(spacebar,เว้นวรรค) ที่แป้นพิมพ์เพื่อยืนยัน'
    },
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
    mr12 (){
      if (this.$vuetify.breakpoint.smOnly){
        return 'mr-12'
      }
        return false
    },
    ml12 (){
      if (this.$vuetify.breakpoint.smOnly){
        return 'ml-12'
      }
        return false
    },
    close () {
      if (this.$route.name === 'Indexs') {
        return true
      }
        return false 
    },
    opn () {
      return !this.$vuetify.breakpoint.xsOnly
    },
    wn () {
      return this.$vuetify.breakpoint.xsOnly
    },
    random(){
      return this.$store.getters.getsearchrandom
    },
    setoverlay(){
      return this.$store.getters.getoverlay
    },
    

  },

  methods:{
    clicksearch_home(input){
      if(input.length!==0){
        this.$router.push('/Indexs');
        this.$store.dispatch('setFirstIndexsFromApi',{words:input,page:0})
      }else{
        this.label_search = 'กรุณาใส่คำที่่ต้องการค้นหา'
      }
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
    filter (item, queryText, itemText) {
      if (item.header) return false

        const hasValue = val => val != null ? val : ''

        const text = hasValue(itemText)
        const query = hasValue(queryText)

        return text.toString()
        .toLowerCase()
        .indexOf(query.toString().toLowerCase()) > -1
    },
    clickedSendbook(bookname2) {
        let openBook = this.$router.resolve({path: `/book/${bookname2}`});
        window.open(openBook.href, '_blank')
    },
  },
  watch:{
    words_search (val,prev) {
      if (val.length === prev.length) return

      if (val.length > 5) {
        this.$nextTick(() => this.words_search.pop()) 
      }
      this.words_search = val.map(v => {
        if (typeof v === 'string') {
            v = {
              text: v,
              color: this.colors[this.nonce - 1],
            }
            this.items.push(v)
            this.nonce++
        }
        return v
      })
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