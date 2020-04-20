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
          <v-combobox v-model="model" :search-input.sync="search" hide-selected hint="Maximum of 5 tags"
            label="Search" multiple persistent-hint chips solo>
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title align="center" justify="center">
                    "<strong>{{search}}</strong>". Press <kbd>enter</kbd> 
                    <v-btn class="ml-4" dark color="blue lighten-1"><v-icon >mdi-magnify</v-icon></v-btn>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-combobox>
          <v-btn class="mr-8" dark color="blue lighten-1">อ่านอะไรดี</v-btn>
          <v-btn dark color="black" router-link to="/Books">
            <v-icon class="mr-2">mdi-book-open-page-variant</v-icon>หนังสือธรรมะ
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
             <h1 style="color:white;font-size:24px;">101's DOCTRINE</h1>
          </div>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon router-link to="/" text >
          <v-icon>mdi-home</v-icon>
        </v-btn>
        <v-btn icon router-link to="/Books" text >
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
          <v-btn fab dark small color="blue darken-1">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </v-speed-dial>
      </v-btn>

      <v-tabs dark background-color="blue lighten-2" show-arrows class="Isearch-2">
        <v-tabs-slide color="teal lighten-3"></v-tabs-slide>
        <v-tab v-for="i in 20" :key="i" :href="'#tab-' + i">
          TheBookCategory {{ i }}
        </v-tab>
      </v-tabs>
      <v-text-field v-model="model" placeholder="Search" solo class="Isearch">
      </v-text-field>
    </div>



  </div>
</template>

<script>

export default {
  name: 'Navbar',
  data: () => ({
    drawer: false,
    fab: false,
    title: '',
    model: [],
    search: null,
  }),
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
    }
  },

  methods:{
    onScroll (e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset ||   e.target.scrollTop || 0
      this.fab = top > 30
    },
    toTop () {
      this.$vuetify.goTo(0)
    }
  },
  watch:{
    model (val) {
      if (val.length > 5) {
        // หน้า home
        this.$nextTick(() => this.model.pop()) 
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