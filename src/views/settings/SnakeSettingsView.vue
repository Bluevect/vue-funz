<template>
  <div class="snake-settings">
    <blockquote>
      <h3>
        <span>{{ $t('snake.settings.speed.title') }}</span>
        <select v-model="speedOpt">
          <option v-for="opt in options" :key="opt.val" :value="opt.val">{{ opt.text }}</option>
        </select>
      </h3>

      <div v-if="showOther">
        <span>{{ $t('snake.settings.speed.speedVal') }}</span>
        <div>
          <input type="text" v-model="config.time" />
        </div>
      </div>
    </blockquote>

    <blockquote>
      <h3>{{ $t('snake.settings.map.title') }}</h3>
      <div>
        <span>{{ $t('snake.settings.map.width') }}</span>
        <input type="text" v-model.number="mapConfig.width" />
      </div>
      <div>
        <span>{{ $t('snake.settings.map.height') }}</span>
        <input type="text" v-model="mapConfig.height" />
      </div>
    </blockquote>

    <blockquote>
      <h3>{{ $t('snake.settings.color.title') }}</h3>
      <div>
        <span>{{ $t('snake.settings.color.bgColor') }}</span>
        <input type="text" v-model="config.bg" />
      </div>
      <div>
        <span>{{ $t('snake.settings.color.snakeColor') }}</span>
        <input type="text" v-model="config.snakeColor" />
      </div>
      <div>
        <span>{{ $t('snake.settings.color.foodColor') }}</span>
        <input type="text" v-model="config.foodColor" />
      </div>
      <div>
        <span>{{ $t('snake.settings.color.killedColor') }}</span>
        <input type="text" v-model="config.killedColor" />
      </div>
    </blockquote>

    <button type="button" @click="goBack">{{ $t('snake.settings.backBtn') }}</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import router from '@/router'
import { config, mapConfig } from '@/games/snake'
import { useLangStore } from '@/stores/langStore'
import { useRoute } from 'vue-router'

const langStore = useLangStore()

// Language handling
const route = useRoute()
const i18n = useI18n()

if (route.query.hasOwnProperty('lang')) {
  langStore.update(route.query.lang as string)
  i18n.locale.value = langStore.lang
} else {
  router.push({
    path: '/snake/settings',
    query: {
      lang: langStore.lang,
    },
  })
}

const { t } = useI18n()

const options = [
  { text: t('snake.settings.speed.low'), val: 'low' },
  { text: t('snake.settings.speed.middle'), val: 'middle' },
  { text: t('snake.settings.speed.high'), val: 'high' },
  { text: t('snake.settings.speed.ultraHigh'), val: 'ultra-high' },
  { text: t('snake.settings.speed.other'), val: 'other' },
]

const speedOpt = ref('middle')
const showOther = ref(false)

watch(speedOpt, (val) => {
  switch (val) {
    case 'low':
      config.time = 200
      showOther.value = false
      break
    case 'middle':
      config.time = 150
      showOther.value = false
      break
    case 'high':
      config.time = 100
      showOther.value = false
      break
    case 'ultra-high':
      config.time = 50
      showOther.value = false
      break
    case 'other':
      showOther.value = true
      break
  }
})

function goBack() {
  router.push(`/snake?lang=${langStore.lang}`)
}
</script>

<style scoped>
.snake-settings {
  text-align: left;
  padding: 25px;
}

blockquote {
  width: 50%;
  padding: 15px;
  border-radius: 10px;
}

h3,
blockquote > div {
  margin-top: 1em;
  padding: 0;
  display: flex;
  justify-content: space-between;
}

.snake-settings select,
.snake-settings input {
  padding: 5px;
  border-radius: 15px;
  font-size: 0.9em;
  border: 1px solid #121;
}

.snake-settings button {
  background-color: #177eec;
  padding: 5px 20px;
  color: white;
  border: 0;
  border-radius: 10px;
  font-size: 1em;
  margin-left: 10px;
  cursor: pointer;
}

.snake-settings button:hover {
  box-shadow:
    0 2px 6px 0 rgba(0, 0, 0, 0.2),
    0 4px 7px 0 rgba(0, 0, 0, 0.1);
}
</style>
