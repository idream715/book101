<template>
    <div class="home" align="center" justify="center">
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

.home{
  font-family: 'Sarabun', sans-serif;
}
</style>


