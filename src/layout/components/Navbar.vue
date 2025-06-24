<template>
  <div class="navbar">
    <div class="left-menu">
      <!-- Hamburger Icon for sidebar toggle can be added here -->
      <!-- <el-icon @click="toggleSideBar" class="hamburger"><Menu /></el-icon> -->
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
import { CaretBottom, Menu } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
import { useAppStore } from '@/store/app'
import { useRoute, useRouter }
from 'vue-router'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const userStore = useUserStore()
const appStore = useAppStore() // Kept for potential future use (e.g. sidebar toggle)
const router = useRouter() // Kept for potential future use
const route = useRoute()
const { t } = useI18n()

const breadcrumbs = ref([])

const getBreadcrumbs = () => {
  const newBreadcrumbs = [];

  // Filter route.matched to include only routes that should appear in breadcrumbs
  // These are routes that have `meta.title`.
  const matchedRoutes = route.matched.filter(item => item.meta && item.meta.title);

  matchedRoutes.forEach((matchedRoute, index) => {
    const title = matchedRoute.meta.title;
    const label = (typeof title === 'string' && title.startsWith('route.')) ? t(title) : title;

    if (label) { // Only add if there's a valid label
      const path = matchedRoute.path;

      // The last item in the breadcrumb trail is the current page and should not be clickable.
      // Also, if a route record has `meta.noRedirect: true` or `meta.breadcrumbClickable: false`, it shouldn't be clickable.
      const isLast = index === matchedRoutes.length - 1;
      const clickable = !isLast &&
                        matchedRoute.meta.noRedirect !== true &&
                        matchedRoute.meta.breadcrumbClickable !== false;

      newBreadcrumbs.push({
        path: path, // Use the route's actual path for navigation
        name: label,
        clickable: clickable,
      });
    }
  });

  breadcrumbs.value = newBreadcrumbs;
};

watch(
  () => route.path, // Watch the path for changes
  () => {
    getBreadcrumbs();
  },
  { immediate: true } // immediate: true to run on component mount and initial route load
);

const handleLogout = async () => {
  await userStore.logout();
  router.push({ path: '/dashboard', query: { loggedOut: true } });
}

// Example for sidebar toggle if needed later
// const toggleSideBar = () => {
//   appStore.toggleSidebar();
// }
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
  padding: 0 15px;

  .left-menu {
    display: flex;
    align-items: center;

    .hamburger {
      font-size: 20px;
      cursor: pointer;
      margin-right: 15px;
      color: var(--el-text-color-primary);
      &:hover {
        color: var(--el-color-primary);
      }
    }
  }

  .breadcrumb-container {
    .no-redirect {
      color: var(--el-text-color-primary); // Current page title color
      cursor: text;
      font-weight: 600;
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
     /* This specific selector for last-child might not be needed if .no-redirect handles current page styling */
     /* :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
        color: var(--el-text-color-primary);
        font-weight: 600;
    } */
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
