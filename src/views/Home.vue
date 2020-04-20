<template>

  <div class="home">
    <h1>this is home</h1>
  </div>
</template>

<script>
export default {
  mounted(){
    if(this.indexs.length === 0 ){
      this.$store.dispatch('getFirstIndexsFromApi')
    }
  },
  computed:{
    indexs(){
      return this.$store.getters.getIndexs
    }
  },
 
  
}
</script>
<style>
/* @media (min-width: 320px) {
  h5.heading {
    font-size: 0.8em;
  }
} */

</style>

