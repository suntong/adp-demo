<template>
  <div class="app-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <Sidebar class="sidebar-container" />
    <div class="main-container">
      <Navbar />
      <AppMain />
    </div>
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue'
import Navbar from './components/Navbar.vue'
import AppMain from './components/AppMain.vue'
import { useAppStore } from '@/store/app'
import { computed } from 'vue'

const appStore = useAppStore()
const isSidebarCollapsed = computed(() => appStore.isSidebarCollapsed)

// TODO: Add logic for theme, mobile adaptation, etc. later
</script>

<style lang="scss" scoped>
// Define collapsed width for sidebar
$sidebar-width-collapsed: 64px;
$sidebar-width-expanded: 210px;

.app-wrapper {
  position: relative; // Usually good for containing absolute elements if any
  height: 100vh; // Occupy full viewport height
  width: 100%;
  display: flex;
  overflow: hidden; // Prevent scrollbars on the body/html if content overflows flex items
}

.main-container {
  flex: 1; // Take up remaining width after sidebar
  display: flex;
  flex-direction: column; // Stack Navbar and AppMain vertically
  // min-height: 100vh; // Not needed if app-wrapper is 100vh and this is a flex child
  overflow: hidden; // Prevent this container's children from expanding it
  position: relative; // For potential absolutely positioned children or z-index stacking
}

.sidebar-container {
  width: $sidebar-width-expanded; // Use variable for expanded width
  flex-shrink: 0;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--el-menu-bg-color, #304156);
  box-sizing: border-box;
  transition: width 0.28s ease-in-out; // Smooth transition for width
}

.app-wrapper.sidebar-collapsed {
  .sidebar-container {
    width: $sidebar-width-collapsed; // Width when collapsed
    // When sidebar is collapsed, icons should ideally remain visible.
    // el-menu with :collapse handles this internally for menu items.
  }
  // If using margin-left on main-container for positioning:
  // .main-container {
  //   margin-left: $sidebar-width-collapsed;
  // }
}

// TODO: Add styles for mobile, collapsed sidebar, etc. from Art Design Pro.
// For example, on mobile, sidebar might become an overlay or hide completely,
// and main-container would take full width.
</style>
