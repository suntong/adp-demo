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
  /* 50= navbar height */
  min-height: calc(100vh - 50px); // Reverted
  width: 100%;
  position: relative;
  overflow-x: hidden; // Prevent horizontal scroll
  overflow-y: auto;   // Allow vertical scroll
  padding: 20px;
  background-color: var(--el-bg-color-page, #f0f2f5); // Use theme variable
  // Ensure proper scrolling context for absolutely positioned children if any
  -webkit-overflow-scrolling: touch; // For smoother scrolling on mobile
}

.fixed-header+.app-main {
  // This class would be added to app-main if there's a fixed header scenario
  // For now, our Navbar is part of the flex layout, not fixed on top of AppMain typically
  padding-top: 50px; // Reverted
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
