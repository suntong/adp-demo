<template>
  <div class="not-found-page">
    <el-result
      icon="error"
      status="404"
      title="404 - Page Not Found"
      sub-title="Oops! The page you are looking for does not exist."
    >
      <template #extra>
        <el-button type="primary" @click="$router.push('/')">Back to Home</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup>
// No specific script needed
</script>

<style lang="scss" scoped>
.not-found-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 50px); // Assuming navbar height is 50px. Adjust if layout is different.
  // If this page is accessed outside the main layout, height could be 100vh.
  // For now, assuming it might be rendered within the layout context if a child route is not found.
  // If it's a top-level catch-all, it won't have the layout.
}
.el-result {
    // The result component might have its own background.
    // background-color: var(--el-bg-color-page); // Ensure it matches theme
}
</style>
