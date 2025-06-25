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
  height: 200px; // Changed to 200px as requested
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
    padding-left: 10px;
    flex-grow: 1; /* Allow left menu to take up space */
    flex-shrink: 1; /* Allow left menu to shrink */
    min-width: 0; /* Crucial for allowing shrinking below content size and enabling text-overflow */
    overflow: hidden; /* Hide overflow of the breadcrumb container if it's too wide */
  }

  .breadcrumb-container {
    display: flex;
    align-items: center;
    height: 100%;
    margin: 0;
    padding: 0;
    white-space: nowrap; /* Prevent breadcrumbs from wrapping to multiple lines */
    overflow: hidden; /* Hide individual items if they overflow */
    text-overflow: ellipsis; /* Show ellipsis for the container if content overflows */

    :deep(.el-breadcrumb) {
      display: flex;
      align-items: center;
      font-size: 14px;
      line-height: normal;
    }

    :deep(.el-breadcrumb__item) {
      display: inline-flex;
      align-items: center;
      margin: 0 !important;
      padding: 0 !important;
      line-height: normal;
      // For individual item truncation (might be too aggressive, container level might be better)
      // overflow: hidden;
      // text-overflow: ellipsis;
      // max-width: 150px; // Example max-width for individual items

      .el-breadcrumb__inner,
      .el-breadcrumb__inner a,
      .el-breadcrumb__inner.is-link {
        display: inline-block; // Changed from inline-flex for simpler text overflow
        align-items: center; // Still useful if there were icons
        padding: 0 5px !important;
        white-space: nowrap;
        overflow: hidden; // Apply overflow to inner text container
        text-overflow: ellipsis; // Apply ellipsis to inner text container
        text-decoration: none;
        line-height: normal;
        max-width: 200px; // Max width for individual breadcrumb text before ellipsis
      }
      .el-breadcrumb__separator {
        display: inline-flex !important;
        align-items: center !important;
        margin: 0 5px !important;
        line-height: normal;
        color: var(--el-text-color-placeholder);
      }
    }

    .no-redirect {
      color: var(--el-text-color-primary);
      cursor: text;
      font-weight: 600;
      display: inline-block; // Match inner
      align-items: center;
      padding: 0 5px !important;
      line-height: normal;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 200px; // Max width for current page title
    }

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
    align-items: center; // This should vertically center the avatar-container
    height: 100%; // Ensure right-menu also takes full navbar height for alignment
    flex-shrink: 0;
    padding-right: 10px;

    .avatar-container {
      margin-left: 15px;
      display: flex; // Make avatar-container a flex item to help center avatar-wrapper
      align-items: center; // Center avatar-wrapper vertically
      // Resetting any potential inherited line-height or height issues from el-dropdown
      line-height: 1;
      height: auto; // Let it be sized by its content (avatar-wrapper)

      .avatar-wrapper {
        position: relative;
        cursor: pointer;
        display: flex;
        align-items: center;
        line-height: 1; // Ensure wrapper itself doesn't add line height

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: block; // Good practice for images to avoid bottom space
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
