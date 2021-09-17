<template>
  <div class="homep">
    <v-app>
    <navbar></navbar>
    
    <v-main id="app">
      <router-view/>
     
    </v-main>
    
  </v-app>
  </div>
</template>

<script>
import navbar from '@/components/Navbar.vue'
export default {
  name: 'App',
  components:{
    navbar
  },
  data: () => ({
    //
  }),
  
};
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Prompt&display=swap');
.homep {
    font-family: 'Prompt', sans-serif;
  }
</style>