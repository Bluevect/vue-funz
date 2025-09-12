<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheHeader from './components/TheHeader.vue'
</script>

<template>
  <header>
    <TheHeader></TheHeader>
  </header>

  <section>
    <RouterView></RouterView>
  </section>
</template>

<style scoped></style>
