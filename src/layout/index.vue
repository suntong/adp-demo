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
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  // transition: margin-left .28s; // Keep for future sidebar collapse animation
  // margin-left: 210px; // Default sidebar width - REMOVED for direct flex layout
  position: relative;
  overflow-x: hidden; // Prevent main container from causing horizontal scroll if content is too wide
}

.sidebar-container {
  transition: width 0.28s;
  width: 210px; // Removed !important to see if it was causing issues, should still respect this width
  flex-shrink: 0; // Prevent sidebar from shrinking if app-wrapper gets too narrow
  height: 100vh;
  font-size: 0px; // This is unusual, usually for inline-block spacing. Check if needed.
  // top, bottom, left, z-index are more for fixed/absolute positioning, not strictly needed if it's a direct flex child
  // For a flex child, these are not directly applicable unless its position is changed.
  // z-index: 1001;
  overflow: hidden; // Keep to hide overflowing sidebar content
  background-color: #304156; // Example background
  // Adding box-sizing explicitly just in case global one is overridden somewhere, though unlikely.
  box-sizing: border-box;
}

// TODO: Add styles for mobile, collapsed sidebar, etc. from Art Design Pro
</style>
