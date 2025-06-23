<template>
  <div class="navbar">
    <!-- TODO: Implement Breadcrumb, Hamburger, Global Search, Fullscreen, Language, Theme Switcher etc. -->
    <el-breadcrumb separator="/">
      <!-- Placeholder breadcrumb -->
      <el-breadcrumb-item :to="{ path: '/' }">Homepage</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">Activity list</a></el-breadcrumb-item>
    </el-breadcrumb>

    <div class="right-menu">
      <!-- Placeholder for right menu items like user avatar, settings dropdown -->
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" class="user-avatar">
          <el-icon><CaretBottom /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/">
              <el-dropdown-item>Home</el-dropdown-item>
            </router-link>
            <el-dropdown-item divided @click="logout">
              <span style="display:block;">Log Out</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { CaretBottom } from '@element-plus/icons-vue'
// import { useUserStore } from '@/store/user' // Mocked for now
// import { useRouter } from 'vue-router'

// const userStore = useUserStore() // Mocked
// const router = useRouter() // Mocked

const logout = async () => {
  // await userStore.logout() // Mocked
  // router.push(`/login?redirect=${router.currentRoute.value.fullPath}`) // Mocked
  console.log('Mock logout triggered')
}

// TODO: Add methods for search, theme change, language change etc.
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;

  .right-menu {
    display: flex;
    align-items: center;

    .avatar-container {
      margin-left: 30px;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        cursor: pointer;
        display: flex;
        align-items: center;

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          font-size: 12px;
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
