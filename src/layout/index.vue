<template>
  <div class="app-wrapper">
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

// TODO: Add logic for theme, mobile adaptation, etc. later
</script>

<style lang="scss" scoped>
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
  width: 210px;
  flex-shrink: 0; // Prevent sidebar from shrinking
  height: 100vh; // Full viewport height
  overflow-y: auto; // Allow scrolling within sidebar if menu is too long
  overflow-x: hidden;
  background-color: var(--el-menu-bg-color, #304156); // Use Element Plus variable or fallback
  box-sizing: border-box;
  // font-size: 0px; // Removed, as it's often a hack and might affect icons if not careful.
  // transition: width 0.28s; // Keep for future sidebar collapse animation
}

// TODO: Add styles for mobile, collapsed sidebar, etc. from Art Design Pro
</style>
