<template>
  <div class="dashboard-page">
    <h1>{{ $t('route.dashboard') }}</h1>
    <p>Welcome to the Art Design Pro dashboard showcase!</p>
    <el-alert v-if="$route.query.loginRequired" title="Login Required" type="warning" description="You were redirected here because the page you tried to access requires authentication. (Mock login available on Demo Page)" show-icon :closable="false" />
    <el-alert v-if="$route.query.unauthorized" title="Unauthorized" type="error" description="You do not have the necessary permissions to access the requested page. (Mock roles are simplified)" show-icon :closable="false" />

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>Quick Stats</template>
          <div>Users: 1,234</div>
          <div>Sales: $56,789</div>
          <div>Active Projects: 42</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>Recent Activity</template>
          <ul>
            <li>User John Doe signed up.</li>
            <li>Project "Phoenix" updated.</li>
            <li>Invoice #INV-007 paid.</li>
          </ul>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>System Status</template>
          <el-progress :percentage="85" status="success" />
          <span>API Latency: 120ms</span>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
// No specific script needed for this simple dashboard yet
</script>

<style lang="scss" scoped>
.dashboard-page {
  padding: 20px;
  h1 {
    margin-top: 0;
  }
}
ul {
  list-style-type: none;
  padding-left: 0;
  li {
    margin-bottom: 8px;
  }
}
.el-card {
  height: 100%; // Make cards in a row same height
}
</style>
