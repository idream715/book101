<template>
  <div>
    <v-system-bar dark color="red lighten-2">
      <v-spacer></v-spacer>
    </v-system-bar>
    <!-- <v-app-bar app color="primary" dark hide-on-scroll
      src="https://images.unsplash.com/photo-1503455637927-730bce8583c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
      width="100%">
     
      <v-toolbar-title mt-2>
        <div class="d-flex align-center">
          <v-img alt="logo" class=" mt-2 hidden-sm" contain min-width="45"
            src="@/assets/logo1.png" width="45" />
          <v-img alt="Vuetify Name" class="shrink mt-1 hidden-sm-and-down mr-5" contain min-width="100"
            src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png" width="100" />
        </div>
      </v-toolbar-title>

      <v-toolbar dense floating width="350">
        <v-text-field hide-details prepend-icon="mdi-magnify" single-line style="width:350px">
        </v-text-field>
      </v-toolbar>

      <v-spacer></v-spacer>
      <v-btn icon router-link to="/" text >
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn icon router-link to="/Books" text >
        <v-icon>mdi-book-open-variant</v-icon>
      </v-btn>
    </v-app-bar> -->
    
    <!-- <v-btn v-scroll="onScroll"  v-show="fab" fab dark fixed bottom right color="primary"
      @click="toTop" >
      <v-icon>mdi-magnify</v-icon> 
    </v-btn> -->

  
    
  </div>
</template>

<script>

export default {
  name: 'Navbar',
  data: () => ({
    drawer: false,
    fab: false,
  }),
  computed:{
   
  },

  methods:{
    onScroll (e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset ||   e.target.scrollTop || 0
      this.fab = top > 20
    },
    toTop () {
      this.$vuetify.goTo(0)
    }
  },
  watch:{
    
  },
};
</script>

<style scoped>
  #create .v-speed-dial {
    position: absolute;
  }

  #create .v-btn--floating {
    position: relative;
  }
</style>