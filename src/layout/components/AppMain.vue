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
  flex: 1; // Take remaining vertical space in .main-container (column flex)
  overflow-y: auto;   // Allow vertical scroll for its own content
  padding: 20px;
  background-color: var(--el-bg-color-page, #f0f2f5);
  position: relative; // For transitions or positioned children
  // overflow-x: hidden; // Usually not needed if content is well-behaved, but can be added if horizontal overflow is an issue within app-main
  -webkit-overflow-scrolling: touch;
}

.fixed-header+.app-main {
  // This class is for a scenario where the header (navbar) is position:fixed.
  // In our current flex layout, this might not be directly applicable unless layout changes.
  // If it were used, the padding-top should match the fixed header's height.
  padding-top: 50px; // Assuming navbar height is 50px if fixed
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
