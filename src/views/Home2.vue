<template>
  <div>
    <div class="home2"></div>

  </div>
</template>

<script>
export default {
  data () {
      return {
      }
    }, 
  created(){
      this.$store.dispatch('clear')
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Sarabun&display=swap');

.home2 {
  font-family: 'Sarabun', sans-serif;
}
</style>