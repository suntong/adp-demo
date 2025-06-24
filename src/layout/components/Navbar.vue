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
      <!-- TODO: Global Search, Fullscreen, Language, Theme Switcher etc. can be added here -->
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
            <!-- Example: Profile link
            <router-link to="/profile">
              <el-dropdown-item>Profile</el-dropdown-item>
            </router-link>
            -->
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
import { CaretBottom, Menu } from '@element-plus/icons-vue' // Menu for hamburger icon
import { useUserStore } from '@/store/user'
import { useAppStore } from '@/store/app' // For sidebar toggle
import { useRoute, useRouter } from 'vue-router'
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const userStore = useUserStore()
const appStore = useAppStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const breadcrumbs = ref([])

const getBreadcrumbs = () => {
  let matched = route.matched.filter(item => item.meta && item.meta.title);

  // Handle the case where the root path might be the layout itself.
  // We always want 'Dashboard' or a similar home link as the first clickable item if not on Dashboard page.
  const isDashboardRoute = route.name === 'Dashboard' || route.path === '/dashboard';

  if (!isDashboardRoute && matched.length > 0 && matched[0].name !== 'Dashboard') {
      // Check if 'Dashboard' is part of the matched routes (e.g. if routes are nested under a Dashboard parent that is not the Layout)
      // This simple check assumes 'Dashboard' is a top-level sibling or the target of root redirect.
      if (!matched.some(r => r.name === 'Dashboard')) {
          const dashboardRouteConfig = router.getRoutes().find(r => r.name === 'Dashboard');
          if (dashboardRouteConfig) {
              matched.unshift({
                  path: dashboardRouteConfig.path,
                  meta: { ...dashboardRouteConfig.meta }, // Clone meta
                  name: dashboardRouteConfig.name // Use route name for consistency
              });
          }
      }
  }

  // If current route is dashboard, only show dashboard breadcrumb
  if (isDashboardRoute) {
      const dashboardRouteConfig = router.getRoutes().find(r => r.name === 'Dashboard');
      if (dashboardRouteConfig && dashboardRouteConfig.meta && dashboardRouteConfig.meta.title) {
          matched = [{ path: dashboardRouteConfig.path, meta: { ...dashboardRouteConfig.meta }, name: dashboardRouteConfig.name }];
      } else {
          matched = []; // Safety net
      }
  }

  breadcrumbs.value = matched
    .filter(item => item.meta && item.meta.title) // Ensure item has meta and title
    .map((item, index, arr) => {
      const title = item.meta.title;
      // Translate title if it's an i18n key (e.g., "route.dashboard")
      const label = (typeof title === 'string' && title.startsWith('route.')) ? t(title) : title;

      const isLast = index === arr.length - 1;
      let path = item.redirect || item.path; // Use redirect path if available for parent items

      // The last item is not clickable. Also, items with meta.noRedirect are not clickable.
      // Or if an item explicitly says it's not breadcrumbClickable
      const clickable = !isLast && item.meta.noRedirect !== true && item.meta.breadcrumbClickable !== false;

      return {
        path: path,
        name: label,
        clickable: clickable
      };
    }).filter(item => item.name && item.name.trim() !== ''); // Filter out items with no valid name
};

watch(
  () => route.path,
  () => {
    getBreadcrumbs();
  },
  { immediate: true } // immediate: true to run on component mount
);

const handleLogout = async () => {
  await userStore.logout();
  router.push({ path: '/dashboard', query: { loggedOut: true } });
}

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
    // margin-left: 10px; // If hamburger is present
    .no-redirect {
      color: var(--el-text-color-placeholder);
      cursor: text;
    }
    // Element Plus breadcrumb items style override for dark theme consistency
    :deep(.el-breadcrumb__inner a),
    :deep(.el-breadcrumb__inner.is-link) {
        color: var(--el-text-color-regular); // Regular text color for links
        font-weight: normal;
        &:hover {
            color: var(--el-color-primary);
        }
    }
    :deep(.el-breadcrumb__separator) {
        color: var(--el-text-color-placeholder);
    }
     // Last item (current page)
     :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
        color: var(--el-text-color-primary); // Primary text color for current page
        font-weight: 600;
    }
  }

  .right-menu {
    display: flex;
    align-items: center;

    .avatar-container {
      margin-left: 30px;
      .avatar-wrapper {
        // margin-top: 5px; // Removed to better align vertically
        position: relative;
        cursor: pointer;
        display: flex;
        align-items: center;

        .user-avatar {
          width: 36px; // Slightly smaller
          height: 36px;
          border-radius: 8px; // softer radius
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
