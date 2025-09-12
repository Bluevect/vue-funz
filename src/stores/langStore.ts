import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLangStore = defineStore('lang', () => {
  const lang = ref('cn')

  function update(newLang: string) {
    lang.value = newLang
  }

  return { lang, update }
})
