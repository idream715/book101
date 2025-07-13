<template>
  <div>
    <div class="home2"></div>

  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCardsStore } from '@/stores/cards'

const cardsStore = useCardsStore()

onMounted(() => {
  cardsStore.clear()
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Sarabun&display=swap');

.home2 {
  font-family: 'Sarabun', sans-serif;
}
</style>