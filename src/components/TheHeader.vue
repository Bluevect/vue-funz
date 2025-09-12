<script setup lang="ts">
import { RouterLink } from 'vue-router'
import GithubLink from './GithubLink.vue'
import { useLangStore } from '@/stores/langStore'

const langStore = useLangStore()
</script>

<template>
  <div class="header-root">
    <h1>FunZ</h1>

    <nav>
      <ul>
        <li>
          <RouterLink :to="`/?lang=${langStore.lang}`">{{ $t('nav.aboutPage') }}</RouterLink>
        </li>
        <li>
          <RouterLink :to="`/snake?lang=${langStore.lang}`">{{ $t('nav.snake') }}</RouterLink>
        </li>
        <li>
          <RouterLink :to="`/tetris?lang=${langStore.lang}`">{{ $t('nav.tetris') }}</RouterLink>
        </li>
      </ul>
    </nav>

    <div class="gh-container">
      <GithubLink href="https://www.github.com" target="_blank"></GithubLink>
    </div>
  </div>
</template>

<style scoped>
* {
  display: flex;
  box-sizing: border-box;
}

.header-root {
  height: 55px;
  border-bottom: 1px solid #e7e7e7;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  justify-content: space-between;
  align-items: center;
}

.header-root h1 {
  line-height: 55px;
  margin-left: 3em;
  font-family: 'Times New Roman', Times, serif;
  font-size: 1.5em;
  font-weight: 900;
  color: #213547;
}

ul {
  justify-content: space-between;
  list-style: none;
}

li a {
  text-decoration: none;
  cursor: pointer;
  font-family: Arial, Helvetica, sans-serif;
  color: #213547;
  padding: 0 30px;
  align-items: center;
}

li a:hover {
  color: #0088ff;
  transition: all 0.3s ease 0s;
}

.gh-container {
  margin-right: 3em;
}
</style>
