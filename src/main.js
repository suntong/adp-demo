import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import i18n from './plugins/i18n'
import axiosInstance from './plugins/axios.js' // Default export

// Import global custom styles
import '@/styles/index.scss'

// --- Initialize App ---
const app = createApp(App)

// --- Pinia Setup ---
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// --- Provide Axios globally (optional) ---
app.config.globalProperties.$axios = axiosInstance
// app.provide('axios', axiosInstance) // For Composition API injection

// --- Router Setup ---
app.use(router)

// --- i18n Setup ---
app.use(i18n)

// --- Global Error Handler (Vue specific errors) ---
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue Error Handler:', err, instance, info)
  // Example: import { ElNotification } from 'element-plus'
  // ElNotification({ title: 'Vue Runtime Error', message: err.message, type: 'error' })
}

// --- Custom Directives ---
import { useUserStore } from '@/store/user'
import { useAppStore } from '@/store/app' // Added import for useAppStore

app.directive('auth', {
  mounted(el, binding) {
    // Ensure Pinia store is available. It should be by the time mounted hook is called.
    try {
      const userStore = useUserStore()
      const requiredRolesInput = binding.value
      const userRoles = userStore.getUserRoles

      if (!requiredRolesInput) return;

      const requiredRoles = Array.isArray(requiredRolesInput) ? requiredRolesInput : [requiredRolesInput];

      const hasPermission = userRoles.some(role => requiredRoles.includes(role))

      if (!hasPermission) {
        el.style.display = 'none'
      }
    } catch (e) {
      console.error("Failed to initialize 'auth' directive, Pinia store might not be ready or userStore is problematic.", e);
      // Fallback: hide the element if directive setup fails, to be safe.
      el.style.display = 'none';
    }
  },
  // updated hook might be needed if roles can change dynamically while component is mounted
  updated(el, binding) {
    try {
      const userStore = useUserStore();
      const requiredRolesInput = binding.value;
      const userRoles = userStore.getUserRoles;

      if (!requiredRolesInput) {
        el.style.display = ''; // Or original display value
        return;
      }
      const requiredRoles = Array.isArray(requiredRolesInput) ? requiredRolesInput : [requiredRolesInput];
      const hasPermission = userRoles.some(role => requiredRoles.includes(role));

      el.style.display = hasPermission ? '' : 'none'; // Adjust display based on current permission
    } catch (e) {
        console.error("Failed to update 'auth' directive.", e);
        el.style.display = 'none'; // Fallback on error
    }
  }
})

// --- Mount App ---
// Initialize stores here to ensure they are ready before app mounts
// and can be used by router guards or initial configurations.
const appStore = useAppStore(pinia)
const userStorePinia = useUserStore(pinia) // Avoid conflict if useUserStore is imported elsewhere at module scope

// Initial theme and language setup from store
// Actions setTheme/setLanguage already handle DOM updates (html class, i18n locale)
appStore.setTheme(appStore.currentTheme)
appStore.setLanguage(appStore.currentLanguage)

router.isReady().then(() => {
  app.mount('#app')
})

// Debugging tools for development
if (import.meta.env.DEV) {
  window.vueApp = app
  window.vueRouter = router
  window.piniaStores = {
    app: appStore,
    user: userStorePinia,
  }
  console.log('Art Design Pro Mockup Initialized')
  console.log(`Current Environment: ${import.meta.env.MODE}`)
  console.log(`Base URL: ${import.meta.env.BASE_URL}`)
}
