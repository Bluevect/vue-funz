import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMaxTetrisScoreStore = defineStore('maxTetrisScore', () => {
  const maxTetrisScore = ref(0)

  function update(newScore: number) {
    maxTetrisScore.value = Math.max(maxTetrisScore.value, newScore)
  }

  return { maxTetrisScore, update }
})
