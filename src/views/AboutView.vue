<script setup lang="ts">
import GameItem from '@/components/GameItem.vue'
import { useMaxSnakeScoreStore } from '@/stores/maxSnakeScoreStore'
import { useMaxTetrisScoreStore } from '@/stores/maxTetrisScoreStore'
import { useLangStore } from '@/stores/langStore'
import { useRoute } from 'vue-router'
import router from '@/router'
import { useI18n } from 'vue-i18n'

const maxSnakeScoreStore = useMaxSnakeScoreStore()
const maxTetrisScoreStore = useMaxTetrisScoreStore()
const langStore = useLangStore()

const route = useRoute()
const i18n = useI18n()

if (route.query.hasOwnProperty('lang')) {
  langStore.update(route.query.lang as string)
  i18n.locale.value = langStore.lang
} else {
  router.push({
    path: '/',
    query: {
      lang: langStore.lang,
    },
  })
}
</script>

<template>
  <div class="about-root">
    <h1>{{ $t('about.welcome') }}</h1>
    <h2>{{ $t('about.detail') }}</h2>
    <h2>{{ $t('about.checkOut') }}</h2>

    <div class="container">
      <GameItem :to="`/snake?lang=${langStore.lang}`">
        <template #title>{{ $t('games.snake') }}</template>
        <template #content>
          <span>{{ $t('games.snakeContent') }}</span>
          <br />
          <span>{{ $t('games.maxSnakeScore') }} {{ maxSnakeScoreStore.maxSnakeScore }}</span>
        </template>
      </GameItem>

      <GameItem :to="`/tetris?lang=${langStore.lang}`">
        <template #title>{{ $t('games.tetris') }}</template>
        <template #content>
          <span>{{ $t('games.tetrisContent') }}</span>
          <br />
          <span>{{ $t('games.maxTetrisScore') }} {{ maxTetrisScoreStore.maxTetrisScore }}</span>
        </template>
      </GameItem>
    </div>
  </div>
</template>

<style scoped>
.about-root {
  height: 100%;
  padding: 80px;
}

h1 {
  color: rgb(54, 104, 255);
  padding: 10px 0;
  font-size: 2.5rem;
}

h2 {
  padding: 10px 0;
  color: rgb(84, 84, 84);
}

.container {
  padding: 30px 0;
  display: flex;
}

@media (max-width: 1024px) {
  .container {
    display: block;
  }
}
</style>
