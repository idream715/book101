<template>
  <div >
    <!-- <v-system-bar dark color="red lighten-2">
      <v-spacer></v-spacer>
    </v-system-bar> -->

    <!-- หน้า Home -->
    <div v-if="on" class="homep d-flex" align="center">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="1" md="1"></v-col>
        <v-col cols="12" sm="1" md="1"></v-col>
        <v-col cols="4" sm="6" md="2">
            <v-img alt="logo" contain min-width="150" 
            src="@/assets/logo1.png" width="45" />
        </v-col>
        <v-col cols="10" sm="8" md="4">
          <h1 style="color:white">101'S DOCTINE</h1>
          <!-- <v-card color="pink lighten-4" class="pa-6">
            
          </v-card> -->
          <!-- <v-text-field dark label="Search"></v-text-field> -->
          <!-- <v-text-field  v-model="title" label="Search" outlined></v-text-field> -->
          <v-combobox v-model="model" :search-input.sync="search" hide-selected hint="Maximum of 5 tags"
            label="Search" multiple persistent-hint chips solo>
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    "<strong>{{search}}</strong>". Press <kbd>enter</kbd> to create a new one
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-combobox>
          <v-btn class="mr-4"><v-icon dark>mdi-magnify</v-icon></v-btn>
          <v-btn dark color="blue lighten-1">Random</v-btn>
        </v-col>
        <v-col cols="12" sm="1" md="1"></v-col>
        <v-col cols="12" sm="1" md="1"></v-col>
        <v-col cols="12" sm="1" md="1"></v-col>
      </v-row>
    </div>
    
    <!-- แถบ app-bar -->
    <div v-if="!on">
      <v-app-bar app color="primary" dark hide-on-scroll
        src="https://images.unsplash.com/photo-1503455637927-730bce8583c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
        width="100%">
     
        <v-toolbar-title mt-2>
          <div class="d-flex align-center">
            <v-img alt="logo" class=" mt-2 hidden-sm" contain min-width="45"
              src="@/assets/logo1.png" width="45" />
             <h1 style="color:white;font-size:24px;">101'S DOCTINE</h1>
          </div>
        </v-toolbar-title>

        <v-spacer></v-spacer>
        <v-btn icon router-link to="/" text >
          <v-icon>mdi-home</v-icon>
        </v-btn>
        <v-btn icon router-link to="/Books" text >
          <v-icon>mdi-book-open-variant</v-icon>
        </v-btn>
      </v-app-bar>

      <v-btn v-scroll="onScroll"  v-show="fab" fab fixed bottom right >
        <!-- <v-icon>mdi-magnify</v-icon>  -->
        <v-speed-dial v-model="fab" :top="top" :bottom="bottom" :right="right" :left="left"
          :direction="direction" :open-on-hover="hover" :transition="transition">
          
          <template v-slot:activator v-scroll="onScroll"  v-show="fab">
            <v-btn v-model="fab" color="blue darken-3" dark fab>
              <v-icon v-if="fab">mdi-close</v-icon>
              <v-icon v-else>mdi-account-circle</v-icon>
            </v-btn>
          </template>
          <v-btn fab dark small color="blue darken-1">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
          <v-btn fab dark small color="blue lighten-2" router-link to="/Books">
            <v-icon>mdi-book-open-variant</v-icon>
          </v-btn>
          <v-btn fab dark small color="blue lighten-3" @click="toTop" >
            <v-icon>mdi-arrow-up-thick</v-icon>
          </v-btn>
        </v-speed-dial>
      </v-btn>
    </div>



  </div>
</template>

<script>

export default {
  name: 'Navbar',
  data: () => ({
    drawer: false,
    fab: false,
    on: false,
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

  .homep {
    position: relative;
    background-image: url(https://images.unsplash.com/photo-1503455637927-730bce8583c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80);
    width: 100%;
    height: 100vh;
    background-repeat: no-repeat;
    background-size: cover;
  }
  
</style>