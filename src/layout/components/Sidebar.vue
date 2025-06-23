<template>
  <div class="sidebar">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
      >
        <!-- Placeholder Menu Item -->
        <el-menu-item index="/">
          <el-icon><HomeFilled /></el-icon>
          <span>Dashboard</span>
        </el-menu-item>
        <el-menu-item index="/demo">
          <el-icon><Promotion /></el-icon>
          <span>Demo Page</span>
        </el-menu-item>
        <!-- TODO: Dynamically generate menu from routes -->
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { HomeFilled, Promotion } from '@element-plus/icons-vue' // Example icons

// TODO: Get collapse state from store (Pinia)
const isCollapse = ref(false) // Placeholder

const route = useRoute()
const activeMenu = computed(() => {
  const { meta, path } = route
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})

// TODO: Fetch menu items from router configuration or a dedicated menu store module
// For now, using static items.
</script>

<style lang="scss" scoped>
.sidebar {
  height: 100%;

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 210px;
    min-height: 400px;
  }
  .el-menu {
    border-right: none;
  }
}
.scrollbar-wrapper {
  overflow-x: hidden !important;
}
</style>
