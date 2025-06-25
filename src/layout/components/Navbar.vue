<template>
  <div class="navbar">
    <div class="left-menu">
      <el-breadcrumb separator="/" class="breadcrumb-container">
        <el-breadcrumb-item
          v-for="(item, index) in breadcrumbs"
          :key="item.path"
        >
          <span v-if="index === breadcrumbs.length - 1 || !item.clickable" class="no-redirect">
            {{ item.name }}
          </span>
          <router-link v-else :to="item.path">{{ item.name }}</router-link>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="userStore.getUserAvatar" class="user-avatar" alt="User Avatar">
          <el-icon><CaretBottom /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/dashboard">
              <el-dropdown-item>{{ t('route.dashboard') }}</el-dropdown-item>
            </router-link>
            <el-dropdown-item divided @click="handleLogout">
              <span style="display:block;">{{ t('navbar.logout') }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { CaretBottom } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
// import { useAppStore } from '@/store/app' // Not currently used here, but kept for potential sidebar toggle
import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const userStore = useUserStore()
// const appStore = useAppStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const breadcrumbs = ref([])

const getBreadcrumbItem = (routeRecord) => {
  if (!routeRecord || !routeRecord.meta || !routeRecord.meta.title) {
    return null;
  }
  const title = routeRecord.meta.title;
  const label = (typeof title === 'string' && title.startsWith('route.')) ? t(title) : title;
  return {
    path: routeRecord.path,
    name: label,
    meta: routeRecord.meta, // Keep meta for further checks like noRedirect
  };
};

const getBreadcrumbs = () => {
  let newBreadcrumbs = [];

  // Get the full list of router records
  const allRoutes = router.getRoutes();

  // Start with the current route
  let currentRouteRecord = route.matched[route.matched.length - 1]; // Most specific match

  // Traverse upwards using breadcrumbParent or route.matched structure
  const pathStack = [];
  while (currentRouteRecord) {
    const breadcrumbItem = getBreadcrumbItem(currentRouteRecord);
    if (breadcrumbItem) {
      pathStack.unshift(breadcrumbItem); // Add to the beginning
    }

    // Prioritize meta.breadcrumbParent
    if (currentRouteRecord.meta && currentRouteRecord.meta.breadcrumbParent) {
      currentRouteRecord = allRoutes.find(r => r.name === currentRouteRecord.meta.breadcrumbParent);
    } else {
      // Fallback to router hierarchy if no explicit parent
      // Find currentRouteRecord in route.matched and get its predecessor if any
      const currentIndexInMatched = route.matched.findIndex(r => r.name === currentRouteRecord.name);
      if (currentIndexInMatched > 0) {
        currentRouteRecord = route.matched[currentIndexInMatched - 1];
      } else {
        currentRouteRecord = null; // Reached the top of matched or no parent
      }
    }
  }

  // Ensure "Homepage" (Dashboard) is at the start if not already there and not the only item
  const dashboardRouteRecord = allRoutes.find(r => r.name === 'Dashboard');
  if (dashboardRouteRecord) {
    const dashboardBreadcrumb = getBreadcrumbItem(dashboardRouteRecord);
    if (dashboardBreadcrumb) {
      if (pathStack.length === 0 && route.name === 'Dashboard') {
        // If current page is Dashboard and stack is empty, just add Dashboard
        newBreadcrumbs.push({ ...dashboardBreadcrumb, clickable: false });
      } else if (pathStack.length > 0 && pathStack[0].name !== dashboardBreadcrumb.name) {
        // If stack is not empty and Dashboard is not the first, prepend Dashboard
        newBreadcrumbs.push({ ...dashboardBreadcrumb, clickable: true });
        newBreadcrumbs.push(...pathStack);
      } else if (pathStack.length === 0 && route.name !== 'Dashboard') {
        // If stack is empty but current page is not dashboard (e.g. a top level page), add dashboard
         newBreadcrumbs.push({ ...dashboardBreadcrumb, clickable: true });
      }
       else {
        // Pathstack already starts with dashboard or is dashboard itself
        newBreadcrumbs.push(...pathStack);
      }
    } else { // Fallback if dashboard route somehow has no title
        newBreadcrumbs.push(...pathStack);
    }
  } else { // Fallback if dashboard route not found
    newBreadcrumbs.push(...pathStack);
  }

  // Post-process for clickability
  breadcrumbs.value = newBreadcrumbs.map((item, index, arr) => {
    const isLast = index === arr.length - 1;
    return {
      ...item,
      clickable: !isLast && item.meta.noRedirect !== true && item.meta.breadcrumbClickable !== false,
    };
  }).filter(item => item.name); // Ensure there's a name
};


watch(
  () => route.path,
  () => {
    getBreadcrumbs();
  },
  { immediate: true }
);

const handleLogout = async () => {
  await userStore.logout();
  router.push({ path: '/dashboard', query: { loggedOut: true } });
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px; // Reverted to 50px
  overflow: hidden;
  position: relative;
  background: var(--el-bg-color-overlay);
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  // Remove overall navbar padding, will control spacing within left/right menu items
  padding: 0;

  .left-menu {
    display: flex;
    align-items: center;
    height: 100%; // Takes full 50px
    padding-left: 10px; // Space on the left of breadcrumbs
    flex-grow: 1;
    flex-shrink: 1;
    min-width: 0;
    overflow: hidden;
  }

  .breadcrumb-container {
    display: flex;
    align-items: center; // Vertically center el-breadcrumb within this container
    height: 100%; // Takes full 50px
    margin: 0;
    padding: 0;
    overflow: hidden; // Hide breadcrumb overflow if it's too wide
    text-overflow: ellipsis; // Add ellipsis if breadcrumb container overflows
    white-space: nowrap; // Keep breadcrumbs on one line

    :deep(.el-breadcrumb) {
      display: flex; // Make el-breadcrumb itself a flex container
      align-items: center; // Vertically center its items (el-breadcrumb__item)
      padding: 0; // Remove any padding from el-breadcrumb itself
      margin: 0;  // Remove any margin from el-breadcrumb itself
      line-height: 1; // Suppress line-height influence on height
      font-size: 14px; // Standard font size
    }

    :deep(.el-breadcrumb__item) {
      display: inline-flex; // Items behave like inline elements but allow flex properties
      align-items: center; // Vertically center content of each item
      margin: 0 !important; // Force no margin
      padding: 0 !important; // Force no padding
      line-height: 1; // Suppress line-height influence

      .el-breadcrumb__inner,
      .el-breadcrumb__inner a,
      .el-breadcrumb__inner.is-link {
        display: inline-block; // Simpler for text handling with ellipsis
        max-width: 150px; // Max width for individual breadcrumb links
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-decoration: none;
        padding: 0 3px; // Minimal padding around text
        line-height: normal; // Let the font determine its own line height here
                             // as its container .el-breadcrumb-item is flex-centered
      }
      .el-breadcrumb__separator {
        display: inline-flex;
        align-items: center;
        margin: 0 5px !important;
        color: var(--el-text-color-placeholder);
        line-height: normal; // Match text
      }
    }

    .no-redirect { // Current page text
      color: var(--el-text-color-primary);
      font-weight: 600;
      display: inline-block; // Match links
      max-width: 150px; // Max width for current page title
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0 3px; // Minimal padding
      line-height: normal; // Match text
    }

    :deep(.el-breadcrumb__inner a),
    :deep(.el-breadcrumb__inner.is-link) {
        color: var(--el-text-color-regular);
        font-weight: normal;
        &:hover {
            color: var(--el-color-primary);
        }
    }
    // Separator color already handled above
  }

  .right-menu {
    display: flex;
    align-items: center;
    height: 100%; // Takes full 50px
    flex-shrink: 0;
    padding-right: 10px;

    .avatar-container { // This is the el-dropdown
      display: flex;
      align-items: center;
      height: 100%; // Make dropdown fill height to center its trigger
      margin: 0; // Reset margin
      padding: 0; // Reset padding

      .avatar-wrapper { // This is the trigger slot content
        display: flex;
        align-items: center;
        cursor: pointer;
        // No explicit height, let content define it and be centered by parent

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: block;
        }

        .el-icon-caret-bottom { // Caret icon
          font-size: 12px;
          margin-left: 5px;
          color: var(--el-text-color-secondary);
        }
      }
    }
  }
}
</style>
