<template>
  <div class="home">
    <h1>this is a home page</h1>
  </div>
</template>

<script>
export default {
  created(){
    this.$store.dispatch('getFirstIndexsFromApi')
  }
}
</script>

