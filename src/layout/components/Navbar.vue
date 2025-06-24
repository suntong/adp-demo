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
  const newBreadcrumbs = [];

  // Filter route.matched to include only routes with meta.title
  const matchedRoutes = route.matched.filter(item => item.meta && item.meta.title);

  matchedRoutes.forEach((item, index) => {
    const title = item.meta.title;
    const label = (typeof title === 'string' && title.startsWith('route.')) ? t(title) : title;

    if (label) {
      let path = item.path;

      const isLast = index === matchedRoutes.length - 1;
      // A breadcrumb item is clickable if it's not the last one AND
      // it's not marked as noRedirect AND its path is different from the current full path.
      // (The last part `item.path !== route.fullPath` ensures even if a parent has same path as child, only child is non-clickable if last)
      // Or if it has a specific meta.breadcrumbPath to click to.
      let clickablePath = item.redirect || item.path; // Path to navigate to
      let clickable = !isLast && item.meta.noRedirect !== true && item.meta.breadcrumbClickable !== false;

      // If a route has a specific breadcrumbPath in meta, use that for navigation
      if (item.meta.breadcrumbPath) {
          clickablePath = item.meta.breadcrumbPath;
      }

      newBreadcrumbs.push({
        path: clickablePath,
        name: label,
        clickable: clickable,
      });
    }
  });

  breadcrumbs.value = newBreadcrumbs;
};

watch(
  () => route.fullPath, // Watch fullPath to react to query/hash changes if they affect breadcrumbs (though usually not)
                       // More commonly, route.path is sufficient if only path segments matter.
  () => {
    getBreadcrumbs();
  },
  { immediate: true }
);

// onMounted is not strictly needed due to immediate:true in watch, but doesn't hurt.
// onMounted(() => {
//   getBreadcrumbs();
// });

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
