<template>
  <div class="httpbin-form">
    <h2>HttpBin Form</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="inputString">Enter a string:</label>
        <input
          type="text"
          id="inputString"
          v-model="inputString"
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>

    <div v-if="response" class="response-container">
      <h3>Response:</h3>
      <pre>{{ response }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputString: '',
      response: null
    }
  },
  methods: {
    async submitForm() {
      try {
        const response = await fetch('https://httpbin.org/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ data: this.inputString })
        })
        const data = await response.json()
        this.response = JSON.stringify(data, null, 2)
      } catch (error) {
        this.response = `Error: ${error.message}`
      }
    }
  }
}
</script>

<style scoped>
.httpbin-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
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

button {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #3aa876;
}

.response-container {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>