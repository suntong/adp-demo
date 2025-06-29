<template>
  <el-config-provider :locale="currentElementPlusLocale">
    <router-view />

    <!-- Global Lock Screen Overlay -->
    <div v-if="isScreenLocked" class="lock-screen-overlay">
      <div class="lock-screen-content">
        <el-icon :size="50"><Lock /></el-icon>
        <h2>Screen Locked</h2>
        <p>Enter your password to unlock.</p>
        <el-input
          v-model="lockPassword"
          type="password"
          placeholder="Password"
          style="width: 200px; margin-bottom: 10px;"
          @keyup.enter="unlockScreen"
        />
        <el-button type="primary" @click="unlockScreen">Unlock</el-button>
      </div>
    </div>
  </el-config-provider>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { ElConfigProvider } from 'element-plus'
import { Lock } from '@element-plus/icons-vue' // Icon for lock screen
import { useAppStore } from '@/store/app'
import { ElMessage } from 'element-plus'

// Import Element Plus locales for ElConfigProvider
import enLocale from 'element-plus/dist/locale/en.mjs'
import zhCnLocale from 'element-plus/dist/locale/zh-cn.mjs'

const appStore = useAppStore()

// Element Plus locale based on appStore language
const currentElementPlusLocale = computed(() => {
  return appStore.currentLanguage === 'zh-cn' ? zhCnLocale : enLocale
})

// Lock screen state from store
const isScreenLocked = computed(() => appStore.screenIsLocked)
const lockPassword = ref('')

const unlockScreen = () => {
  // This is a mock unlock. In a real app, validate the password.
  if (lockPassword.value === 'password') { // Mock password
    appStore.setLockState(false)
    ElMessage.success('Screen unlocked!')
    lockPassword.value = ''
  } else {
    ElMessage.error('Incorrect password.')
    lockPassword.value = ''
  }
}

// Watch for language changes in the store to update document lang attribute
watch(() => appStore.currentLanguage, (newLang) => {
  document.documentElement.lang = newLang
}, { immediate: true }) // Set initially

// Watch for theme changes to update html class.
// This ensures consistency if the theme is changed by other means or on initial load.
watch(() => appStore.currentTheme, (themeValue) => {
  // appStore.currentTheme is now guaranteed to be 'light' or 'dark' by the store logic
  if (themeValue === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, { immediate: true }); // Set initially based on store's loaded/defaulted theme

</script>

<style lang="scss">
/* Global styles are in src/styles/index.scss and imported in main.js */
/* App.vue specific styles can go here if needed, but generally prefer global styles */

.lock-screen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* Reduced opacity for dimming effect */
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px); /* Optional: Add a blur effect to the background */
  -webkit-backdrop-filter: blur(5px); /* For Safari */
  z-index: 9999; // High z-index to cover everything
  color: #fff;
  text-align: center;

  .lock-screen-content {
    padding: 40px;
    background-color: var(--el-bg-color-overlay, #2c2c2c); // Use themed background
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(0,0,0,0.5);

    h2 {
      margin-top: 10px;
      margin-bottom: 10px;
    }
    p {
      margin-bottom: 20px;
    }
  }
}
</style>
