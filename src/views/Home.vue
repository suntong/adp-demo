<template>
  <div class="home">
    <h1>Art Design Pro Dashboard</h1>
    <nav>
      <router-link to="/httpbin">HttpBin Form</router-link>
      <router-link to="/demo">View Full Demo</router-link>
    </nav>
    <div class="dashboard-content">
      <p>Welcome to the Art Design Pro dashboard. This is a demonstration of various UI components and features.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style scoped>
.home {
  padding: 20px;
}

h1 {
  color: #2c3e50;
  margin-bottom: 20px;
}

nav {
  margin-bottom: 20px;
}

.dashboard-content {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
}
</style>