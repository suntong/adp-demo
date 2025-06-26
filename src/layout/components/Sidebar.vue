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
import { computed } from 'vue' // ref removed as isCollapse comes from store
import { useRoute } from 'vue-router'
import { HomeFilled, Promotion } from '@element-plus/icons-vue' // Example icons
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
const isCollapse = computed(() => appStore.isSidebarCollapsed)

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
  background-color: var(--el-menu-bg-color, #304156); // Match layout's sidebar bg

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    // width: 210px; // Width is controlled by .sidebar-container in Layout.vue
    // min-height: 400px; // Not necessary, should fill height
  }
  .el-menu {
    border-right: none;
    // When collapsed, ensure the icons are centered if text is hidden
    &.el-menu--collapse {
      :deep(.el-tooltip__trigger) { // Targets the wrapper for tooltip in collapsed mode
        display: flex;
        justify-content: center;
        align-items: center;
      }
       :deep(.el-sub-menu__title span), :deep(.el-menu-item span) {
        display: none; // Explicitly hide span text if menu structure doesn't auto-hide well
      }
      :deep(.el-sub-menu__icon-arrow) {
        display: none; // Hide submenu arrows when collapsed
      }
    }
  }
}
.scrollbar-wrapper {
  height: 100%; // Ensure scrollbar takes full height
  overflow-x: hidden !important;
  .el-scrollbar__view { // Ensure view inside scrollbar also takes full height
    height: 100%;
  }
}

// Adjust icon size or padding if needed when collapsed
:global(.app-wrapper.sidebar-collapsed .sidebar-container .el-menu-item [class^=el-icon-]),
:global(.app-wrapper.sidebar-collapsed .sidebar-container .el-sub-menu__title [class^=el-icon-]) {
  // font-size: 18px; // Example: slightly larger icons when collapsed
  // margin: 0;
  // padding: 0 23px; // Adjust padding to center the 20px icon in 64px width
}

:global(.app-wrapper.sidebar-collapsed .sidebar-container .el-menu-item),
:global(.app-wrapper.sidebar-collapsed .sidebar-container .el-sub-menu__title) {
  // padding: 0 20px !important; // Adjust padding for items when collapsed
}

</style>
