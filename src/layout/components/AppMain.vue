<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
    <!-- TODO: Add multi-tabs functionality here or in Navbar -->
  </section>
</template>

<script setup>
import { computed } from 'vue'
// import { useTabsStore } from '@/store/tabs' // Mocked for now

// const tabsStore = useTabsStore() // Mocked
// const cachedViews = computed(() => tabsStore.cachedViews) // Mocked
const cachedViews = computed(() => []) // Placeholder

// This key on router-view is important for re-rendering when route changes
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 20px; // Added padding
  background-color: #f0f2f5; // Example background
}

.fixed-header+.app-main {
  padding-top: 50px;
}

/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all .5s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
