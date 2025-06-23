<template>
  <div class="admin-only-page">
    <h1>Admin Only Area</h1>
    <el-alert type="success" show-icon :closable="false">
      <template #title>Welcome, Authenticated Admin!</template>
      <p>If you can see this page, it means the route guard allowed access based on your mock authentication status and (conceptually) your 'admin' role.</p>
    </el-alert>

    <p style="margin-top: 20px;">This page is protected by <code>meta.requiresAuth: true</code> and (conceptually) <code>meta.roles: ['admin']</code> in its route definition.</p>
    <p>You can try logging out (via the Demo Page's mock logout) and attempting to access this page again. You should be redirected.</p>

    <el-button @click="$router.push('/dashboard')">Back to Dashboard</el-button>
  </div>
</template>

<script setup>
// No specific script needed
</script>

<style lang="scss" scoped>
.admin-only-page {
  padding: 20px;
  h1 {
    margin-top: 0;
  }
}
</style>
