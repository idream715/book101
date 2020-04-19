<template>
  <div class="about">
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <h1>This is an books page</h1>
    <sarabun msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import sarabun from '@/components/Sarabun.vue'

export default {
  name: 'Home',
  components: {
    sarabun
  },
  created(){
    if(this.books.length === 0 ){
      this.$store.dispatch('getBookFromApi')
    }
  },
  computed:{
    books(){
      return this.$store.getters.getBooks
    }
  }
}
</script>
