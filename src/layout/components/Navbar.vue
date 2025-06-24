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
  height: 50px;
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
    align-items: center; // This should vertically center .breadcrumb-container within .left-menu
    height: 100%;
    padding-left: 10px; // Standardized left padding for the navbar content area
    // Removed flex-grow and overflow from here for simplicity, relying on parent .navbar
  }

  .breadcrumb-container {
    display: flex;
    align-items: center; // This should vertically center the el-breadcrumb component itself
    height: 100%; // Take full height of parent (.left-menu)
    margin: 0;
    padding: 0;

    :deep(.el-breadcrumb) {
      display: flex;
      align-items: center;
      height: 100%; // Make el-breadcrumb fill the .breadcrumb-container height
      font-size: 14px; // Set a base font size
      // line-height: 50px; // Remove this, let align-items handle vertical centering of items
    }

    :deep(.el-breadcrumb__item) {
      display: flex; // Make each item a flex container
      align-items: center; // Vertically center its inner content (.el-breadcrumb__inner and separator)
      margin: 0 !important;
      padding: 0 !important;
      // No explicit line-height here, rely on parent's flex centering

      .el-breadcrumb__inner,
      .el-breadcrumb__inner a,
      .el-breadcrumb__inner.is-link {
        display: flex !important; // Use flex for inner content as well for alignment
        align-items: center !important;
        padding: 0 3px !important; // Minimal padding around the text/link
        line-height: normal; // Use browser default line-height for the text itself
        white-space: nowrap;
        text-decoration: none; // Remove underline from links by default
      }
      .el-breadcrumb__separator {
        display: flex !important; // Flex for separator
        align-items: center !important;
        margin: 0 5px !important;
        line-height: normal; // Browser default line-height
        color: var(--el-text-color-placeholder);
      }
    }

    // Style for the non-clickable current page text
    .no-redirect {
      color: var(--el-text-color-primary);
      cursor: text;
      font-weight: 600;
      display: flex; // Ensure it behaves like other inner items for alignment
      align-items: center;
      padding: 0 3px !important; // Match link padding
      line-height: normal;
    }

    // Link styles
    :deep(.el-breadcrumb__inner a),
    :deep(.el-breadcrumb__inner.is-link) {
        color: var(--el-text-color-regular);
        font-weight: normal;
        &:hover {
            color: var(--el-color-primary);
        }
    }
    :deep(.el-breadcrumb__separator) {
        color: var(--el-text-color-placeholder);
    }
  }

  .right-menu {
    display: flex;
    align-items: center;

    .avatar-container {
      margin-left: 30px;
      .avatar-wrapper {
        position: relative;
        cursor: pointer;
        display: flex;
        align-items: center;

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 8px;
        }

        .el-icon-caret-bottom {
          font-size: 12px;
          margin-left: 5px;
          color: var(--el-text-color-secondary);
        }
      }
    }
  }
}
</style>
