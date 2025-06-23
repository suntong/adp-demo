<template>
  <div class="demo-detail-page">
    <h1>Demo Detail Page</h1>
    <p>This page is a child of the Demo Page route, primarily for testing breadcrumbs and active menu highlighting in the sidebar.</p>
    <p>Current route: <code>{{ $route.fullPath }}</code></p>
    <p>The sidebar should still highlight "Demo Page" as active due to <code>meta.activeMenu</code>.</p>
    <el-button @click="$router.back()">Go Back</el-button>
  </div>
</template>

<script setup>
// No specific script needed
</script>

<style lang="scss" scoped>
.demo-detail-page {
  padding: 20px;
  h1 {
    margin-top: 0;
  }
}
</style>
