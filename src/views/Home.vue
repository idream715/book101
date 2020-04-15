<template>
  <div class="home">
    <h1>this is a home page</h1>
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
  }
}
</script>

