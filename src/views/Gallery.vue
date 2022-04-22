<template>
  <div>
    <div class="gallery"></div>

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

.gallery {
  font-family: 'Sarabun', sans-serif;
}
</style>