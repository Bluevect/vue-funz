<template>
  <div class="canvas-container">
    <canvas ref="mapRef" :width="canvasWidth" :height="canvasHeight"></canvas>

    <div class="next-shape-container">
      <h3>{{ $t('tetris.score') }} {{ score }}</h3>

      <br />

      <h3>{{ $t('tetris.nextShape') }}</h3>
      <canvas ref="nextShapeRef" width="101" height="101"></canvas>
    </div>

    <h2 class="menu" v-if="showMenu">
      {{ $t('tetris.press') }} <i>{{ $t('tetris.space') }}</i> {{ $t('tetris.menuStart') }}
      <button class="start-btn" @click="tetris.start">{{ $t('tetris.startBtn') }}</button>
    </h2>

    <div class="game-over" v-if="showGameOver">
      <div>
        <span>{{ $t('tetris.gameOverTitle') }}</span>
        <br />
        <h2 class="menu">
          {{ $t('tetris.press') }} <i>{{ $t('tetris.space') }}</i> {{ $t('tetris.menuRestart') }}
          <button class="restart-btn" @click="tetris.start">{{ $t('tetris.restartBtn') }}</button>
        </h2>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useMaxTetrisScoreStore } from '@/stores/maxTetrisScoreStore'
import {
  mapConfig,
  fresh,
  nextShapeConfig,
  nextShapeLength,
  config,
  Tetris,
  onGameStart,
  onAddScore,
  onGameOver,
} from '@/games/tetris'
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

const mapRef = ref<HTMLCanvasElement | null>(null)
const nextShapeRef = ref<HTMLCanvasElement | null>(null)
const score = ref(0)
const showMenu = ref(true)
const showGameOver = ref(false)
const maxTetrisScoreStore = useMaxTetrisScoreStore()

const canvasWidth = computed(() => {
  return mapConfig.width * mapConfig.blockWidth + 1
})

const canvasHeight = computed(() => {
  return mapConfig.height * mapConfig.blockHeight + 1
})

let tetris: Tetris
let cxt: CanvasRenderingContext2D | null = null
let nextCxt: CanvasRenderingContext2D | null = null

// Hooks
onAddScore((lines: number) => {
  switch (lines) {
    case 1:
      score.value += 1
      break
    case 2:
      score.value += 3
      break
    case 3:
      score.value += 5
      break
    case 4:
      score.value += 8
      break
  }
})

onGameStart(() => {
  score.value = 0
  showGameOver.value = false
  showMenu.value = false
  fresh(config.bg, cxt as CanvasRenderingContext2D)
  fresh(config.bg, nextCxt as CanvasRenderingContext2D, nextShapeConfig, nextShapeLength.value)

  window.onkeydown = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        // Go Up
        tetris.rotate()
        break

      case 'KeyS':
      case 'ArrowDown':
        // Go Down
        tetris.move(mapConfig.width)
        break

      case 'KeyA':
      case 'ArrowLeft':
        // Go Left
        tetris.move(-1)
        break

      case 'KeyD':
      case 'ArrowRight':
        // Go Right
        tetris.move(1)
        break
    }
  }
})

onGameOver(() => {
  window.onkeydown = keydownStart
  showGameOver.value = true
  maxTetrisScoreStore.update(score.value)
})

onMounted(() => {
  const map = mapRef.value as HTMLCanvasElement
  const nextShape = nextShapeRef.value as HTMLCanvasElement

  cxt = map.getContext('2d') as CanvasRenderingContext2D | null
  nextCxt = nextShape.getContext('2d') as CanvasRenderingContext2D | null

  if (!cxt || !nextCxt) {
    throw new Error('Failed to get canvas context')
  }

  fresh(config.bg, cxt)
  fresh(config.bg, nextCxt, nextShapeConfig, nextShapeLength.value)

  tetris = new Tetris(cxt, nextCxt)

  window.onkeydown = keydownStart
})

function keydownStart(e: KeyboardEvent) {
  if (e.code == 'Space') {
    tetris.start()
  }
}
</script>

<style scoped>
.canvas-container {
  text-align: center;
}

canvas {
  background-color: #121;
}

.canvas-container > canvas {
  margin-top: 30px;
}

.next-shape-container {
  position: absolute;
  top: 80px;
  right: 30px;
}

.next-shape-container canvas {
  margin-top: 10px;
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
