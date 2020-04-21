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




