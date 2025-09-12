import './global.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import cn from './locales/cn.json'
import en from './locales/en.json'

import App from './App.vue'
import router from './router'

const i18n = createI18n({
  legacy: false,
  locale: 'cn',
  fallbackLocale: 'en',
  messages: {
    en: en,
    cn: cn,
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(i18n)
app.use(router)

app.mount('#app')
