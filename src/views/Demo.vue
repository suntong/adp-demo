<template>
  <div class="demo-container">
    <h1>Art Design Pro Demo</h1>
    
    <!-- Navigation Menu -->
    <nav class="demo-nav">
      <router-link to="/">Home</router-link>
      <router-link to="/httpbin">HttpBin Form</router-link>
    </nav>

    <!-- Dashboard Section -->
    <section class="dashboard-section">
      <h2>Dashboard Components</h2>
      <div class="cards-container">
        <div class="card">
          <h3>Statistics Card</h3>
          <p>Example statistics content</p>
        </div>
        <div class="card">
          <h3>Quick Actions</h3>
          <p>Example quick actions</p>
        </div>
      </div>
    </section>

    <!-- UI Elements Section -->
    <section class="ui-elements">
      <h2>UI Elements</h2>
      <div class="buttons">
        <button class="primary">Primary Button</button>
        <button class="secondary">Secondary Button</button>
      </div>
      
      <div class="form-group">
        <label for="exampleInput">Example Input</label>
        <input type="text" id="exampleInput" placeholder="Enter text">
      </div>
    </section>

    <!-- Table Section -->
    <section class="table-section">
      <h2>Data Table</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Item One</td>
            <td>Active</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Item Two</td>
            <td>Inactive</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
export default {
  name: 'DemoView'
}
</script>

<style scoped>
.demo-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.demo-nav {
  margin-bottom: 20px;
}

.demo-nav a {
  margin-right: 15px;
  text-decoration: none;
  color: #2c3e50;
}

.demo-nav a.router-link-exact-active {
  font-weight: bold;
}

.dashboard-section {
  margin: 20px 0;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.ui-elements {
  margin: 20px 0;
}

.buttons {
  display: flex;
  gap: 10px;
  margin: 10px 0;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.primary {
  background-color: #42b983;
  color: white;
}

.secondary {
  background-color: #f0f0f0;
  color: #2c3e50;
}

.form-group {
  margin: 20px 0;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f5f5f5;
}
</style>