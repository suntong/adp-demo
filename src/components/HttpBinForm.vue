<template>
  <div class="httpbin-form-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>POST to httpbin.org/post</span>
        </div>
      </template>
      <el-form @submit.prevent="submitForm" label-position="top">
        <el-form-item :label="$t('form.inputPlaceholder')">
          <el-input
            v-model="inputText"
            :placeholder="$t('form.inputPlaceholder')"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="loading">
            {{ $t('form.submit') }}
          </el-button>
        </el-form-item>
      </el-form>

      <div v-if="response" class="response-area">
        <h3>{{ $t('form.response') }}</h3>
        <pre>{{ formattedResponse }}</pre>
      </div>
      <div v-if="error" class="error-area">
        <h3>Error:</h3>
        <pre>{{ error }}</pre>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axiosInstance from '@/plugins/axios.js' // Use our configured axios instance
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const inputText = ref('')
const response = ref(null)
const error = ref(null)
const loading = ref(false)

const submitForm = async () => {
  if (!inputText.value.trim()) {
    ElMessage.warning('Input cannot be empty.')
    return
  }
  loading.value = true
  response.value = null
  error.value = null
  try {
    // httpbin.org/post expects data as form data or JSON
    // Sending as JSON data
    const result = await axiosInstance.post('https://httpbin.org/post', {
      payload: inputText.value,
      timestamp: new Date().toISOString()
    })
    // The axios interceptor returns the full response object, data is in result.data
    response.value = result.data
    ElMessage.success('Data successfully sent to httpbin.org!')
  } catch (err) {
    // Error is already handled by the global interceptor (notification)
    // We can store the error object here if we want to display it locally
    error.value = err.response ? err.response.data : err.message
    console.error('HttpBinForm error:', err)
  } finally {
    loading.value = false
  }
}

const formattedResponse = computed(() => {
  if (response.value) {
    return JSON.stringify(response.value, null, 2)
  }
  return ''
})
</script>

<style lang="scss" scoped>
.httpbin-form-container {
  margin-top: 20px;
}

.card-header {
  font-weight: bold;
}

.response-area, .error-area {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
  background-color: var(--el-fill-color-lighter); // Slightly different background
  max-height: 400px;
  overflow-y: auto;

  h3 {
    margin-top: 0;
    font-size: 1.1em;
    color: var(--el-text-color-secondary);
  }

  pre {
    white-space: pre-wrap; /* CSS3 */
    white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
    white-space: -pre-wrap; /* Opera 4-6 */
    white-space: -o-pre-wrap; /* Opera 7 */
    word-wrap: break-word; /* Internet Explorer 5.5+ */
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.9em;
    color: var(--el-text-color-regular);
  }
}

.error-area {
  border-color: var(--el-color-danger);
  pre {
    color: var(--el-color-danger);
  }
}
</style>
