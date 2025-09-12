import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMaxSnakeScoreStore = defineStore('maxSnakeScore', () => {
  const maxSnakeScore = ref(0)

  function update(newScore: number) {
    maxSnakeScore.value = Math.max(maxSnakeScore.value, newScore)
  }

  return { maxSnakeScore, update }
})
