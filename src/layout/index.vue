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
  min-height: 100vh; // Changed from 100%
  transition: margin-left .28s;
  margin-left: 210px; // Default sidebar width
  position: relative;
}

.sidebar-container {
  transition: width 0.28s;
  width: 210px !important;
  height: 100vh; // Changed from 100%
  font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  background-color: #304156; // Example background
}

// TODO: Add styles for mobile, collapsed sidebar, etc. from Art Design Pro
</style>
