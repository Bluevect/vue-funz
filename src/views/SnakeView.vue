<template>
  <div class="canvas-container">
    <canvas ref="mapRef" :width="canvasWidth" :height="canvasHeight"></canvas>

    <span class="score-span">{{ $t('snake.score') }} {{ score }}</span>
    <button class="settings-btn" @click="toSettings">{{ $t('snake.settingsTxt') }}</button>

    <h2 class="menu" v-if="showMenu">
      {{ $t('snake.press') }} <i>{{ $t('snake.space') }}</i> {{ $t('snake.menuStart') }}
      <button class="start-btn" @click="snakeGame.start">{{ $t('snake.startBtn') }}</button>
    </h2>

    <div class="game-over" v-if="showGameOver">
      <div>
        <span>{{ $t('snake.gameOverTitle') }}</span>
        <br />
        <h2 class="menu">
          {{ $t('snake.press') }} <i>{{ $t('snake.space') }}</i> {{ $t('snake.menuRestart') }}
          <button class="restart-btn" @click="snakeGame.start">{{ $t('snake.restartBtn') }}</button>
        </h2>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useMaxSnakeScoreStore } from '@/stores/maxSnakeScoreStore'
import {
  fresh,
  SnakeGame,
  mapConfig,
  config,
  onGameOver,
  onAddScore,
  onGameStart,
} from '@/games/snake'
import router from '@/router'
import { useLangStore } from '@/stores/langStore'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const langStore = useLangStore()

// Language handling
const route = useRoute()
const i18n = useI18n()

if (route.query.hasOwnProperty('lang')) {
  langStore.update(route.query.lang as string)
  i18n.locale.value = langStore.lang
} else {
  router.push({
    path: '/snake',
    query: {
      lang: langStore.lang,
    },
  })
}

const canvasWidth = computed(() => {
  return mapConfig.width * mapConfig.blockWidth + 1
})

const canvasHeight = computed(() => {
  return mapConfig.height * mapConfig.blockHeight + 1
})

const mapRef = ref<HTMLCanvasElement | null>(null)
const score = ref(0)
const showMenu = ref(true)
const showGameOver = ref(false)
const maxSnakeScoreStore = useMaxSnakeScoreStore()
let snakeGame: SnakeGame
let cxt: CanvasRenderingContext2D | null

// Hooks
onAddScore(() => {
  score.value++
})

onGameStart(() => {
  score.value = 0
  showGameOver.value = false
  showMenu.value = false
  fresh(config.bg, cxt as CanvasRenderingContext2D)

  window.onkeydown = (e: KeyboardEvent) => {
    const direction = snakeGame.direction()
    const leftOrRight = direction == 1 || direction == -1

    if (snakeGame.getChangeFinished())
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          // Go Up
          if (leftOrRight) snakeGame.direction(-mapConfig.width)
          break

        case 'KeyS':
        case 'ArrowDown':
          // Go Down
          if (leftOrRight) snakeGame.direction(mapConfig.width)
          break

        case 'KeyA':
        case 'ArrowLeft':
          // Go Left
          if (!leftOrRight) snakeGame.direction(-1)
          break

        case 'KeyD':
        case 'ArrowRight':
          // Go Right
          if (!leftOrRight) snakeGame.direction(1)
          break
      }
  }
})

onGameOver(() => {
  window.onkeydown = keydownStart
  showGameOver.value = true
  maxSnakeScoreStore.update(score.value)
})

onMounted(() => {
  const map = mapRef.value as HTMLCanvasElement
  cxt = map.getContext('2d') as CanvasRenderingContext2D | null
  if (!cxt) {
    throw new Error('Failed to get canvas context')
  }

  fresh(config.bg, cxt)
  snakeGame = new SnakeGame(cxt)
  window.onkeydown = keydownStart
})

function keydownStart(e: KeyboardEvent) {
  if (e.code == 'Space') {
    snakeGame.start()
  }
}

function toSettings() {
  router.push(`/snake/settings?lang=${langStore.lang}`)
}
</script>

<style scoped>
.canvas-container {
  text-align: center;
}

.score-span {
  position: absolute;
  top: 80px;
  right: 30px;
  font-weight: 600;
  font-size: 1.3em;
  z-index: 2;
}

.settings-btn {
  position: absolute;
  top: 80px;
  left: 30px;
  background-color: #177eec;
  color: white;
  border: 0;
  border-radius: 10px;
  padding: 5px 20px;
  font-size: 1em;
  cursor: pointer;
  z-index: 2;
}

.settings-btn:hover {
  box-shadow:
    0 2px 6px 0 rgba(0, 0, 0, 0.2),
    0 4px 7px 0 rgba(0, 0, 0, 0.1);
}

.menu {
  animation: menu 0.55s infinite alternate;
}

.start-btn {
  background-color: #cecece;
  border: 1px solid #121;
  border-radius: 10px;
  padding: 2px 10px;
  font-size: 1em;
  cursor: pointer;
}

.start-btn:active {
  background-color: #5ec24d;
}

canvas {
  background-color: #121;
  margin-top: 30px;
}

.game-over {
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  opacity: 0.7;
  background-color: #fff;
  animation: gameOver 3s 1;
}

.game-over div {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -90%);
}

.game-over > div > span {
  font-size: 6em;
}

.restart-btn {
  font-size: 1em;
  padding: 2px 10px;
  border-radius: 10px;
  border: 1px solid #121;
  cursor: pointer;
}

@media (max-height: 700px) {
  canvas {
    zoom: 0.8;
  }
}

@keyframes menu {
  from {
    opacity: 1;
  }
  to {
    opacity: 0.3;
  }
}

@keyframes gameOver {
  from {
    opacity: 0.2;
  }
  to {
    opacity: 0.7;
  }
}
</style>
