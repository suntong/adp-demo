<template>
  <div class="sidebar">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        background-color="transparent" <!-- Inherit from .sidebar or .sidebar-container -->
        text-color="#bfcbd9" <!-- These can be CSS variables too for theming -->
        active-text-color="#409EFF" <!-- e.g. var(--el-color-primary) -->
        router
      >
        <!-- Menu Item -->
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
  }
  .el-menu {
    border-right: none;
    height: 100%; // Ensure el-menu itself tries to fill the scrollbar view height

    // When collapsed, ensure the icons are centered if text is hidden
    &.el-menu--collapse {
      :deep(.el-tooltip__trigger) {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%; // Ensure the trigger area fills the collapsed item width
      }
      // Element Plus typically handles hiding text via CSS for collapsed menu,
      // but these can be added if default behavior is not sufficient.
      // :deep(.el-sub-menu__title span), :deep(.el-menu-item span) {
      //   display: none;
      // }
      // :deep(.el-sub-menu__icon-arrow) {
      //   display: none;
      // }
    }
  }
}
.scrollbar-wrapper {
  height: 100%;
  overflow-x: hidden !important;
  .el-scrollbar__view {
    height: 100%;
  }
}

// More specific styling for collapsed icons might be needed if they don't center well
// within the 64px width. Element Plus usually handles this with its own :collapse styles.
// :global(.app-wrapper.sidebar-collapsed .sidebar-container .el-menu--collapse .el-menu-item),
// :global(.app-wrapper.sidebar-collapsed .sidebar-container .el-menu--collapse .el-sub-menu__title) {
//   justify-content: center;
// }
</style>
