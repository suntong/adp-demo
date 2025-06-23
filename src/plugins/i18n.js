import { createI18n } from 'vue-i18n'
import enLocale from 'element-plus/dist/locale/en.mjs'
import zhCnLocale from 'element-plus/dist/locale/zh-cn.mjs'

// Load local messages
import enMessages from '@/lang/en.js'
import zhCnMessages from '@/lang/zh.js' // Assuming zh.js for zh-CN

// Function to get saved language or default
function getInitialLocale() {
  // Later, we can use Pinia store or localStorage to get saved language
  // For now, default to 'en' or browser language
  const savedLang = localStorage.getItem('language')
  if (savedLang) {
    return savedLang
  }
  const language = navigator.language.toLowerCase()
  return language.startsWith('zh') ? 'zh-cn' : 'en'
}

const messages = {
  en: {
    ...enLocale, // Element Plus English locale
    ...enMessages, // Your custom English messages
  },
  'zh-cn': {
    ...zhCnLocale, // Element Plus Chinese (Simplified) locale
    ...zhCnMessages, // Your custom Chinese messages
  }
}

const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: getInitialLocale(), // Set default locale
  fallbackLocale: 'en', // Fallback locale
  messages,
  silentTranslationWarn: true, // Suppress warnings for missing translations during development
  missingWarn: false,
  fallbackWarn: false,
})

export default i18n
