import axios from 'axios'
import { ElNotification, ElMessage } from 'element-plus'
// import { useUserStore } from '@/store/user' // Import Pinia store for token

// Create an Axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || '/', // Base URL, can be configured in .env
  timeout: 10000, // Request timeout
})

// Request interceptor
service.interceptors.request.use(
  (config) => {
    // const userStore = useUserStore() // Needs Pinia to be initialized first
    // if (userStore.token) {
    //   config.headers['Authorization'] = `Bearer ${userStore.token}`
    // }
    // For demo, we can use localStorage directly if Pinia isn't fully set up for this part yet
    const mockToken = localStorage.getItem('mockToken');
    if (mockToken) {
      config.headers['Authorization'] = `Bearer ${mockToken}`; // Example, adjust as needed
    }
    return config
  },
  (error) => {
    console.error('Request Error:', error) // for debug
    return Promise.reject(error)
  }
)

// Response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response.data
    // If the custom code is not 200 (or 20000, common in some backends), it is judged as an error.
    // This depends on the backend API's response structure.
    // For httpbin.org, status code is the primary check.
    if (response.status !== 200 && response.status !== 201) {
      ElMessage({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000,
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      // If response is good, just return it (or res if data is always in res.data)
      // For httpbin, the data is the response.data itself.
      return response // Or specifically response.data if that's always the case
    }
  },
  (error) => {
    console.error('Response Error:', error) // for debug
    let message = error.message
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error Response Data:', error.response.data);
      console.error('Error Response Status:', error.response.status);
      console.error('Error Response Headers:', error.response.headers);

      // Customize error messages based on status code
      switch (error.response.status) {
        case 400: message = 'Bad Request (400)'; break;
        case 401: message = 'Unauthorized (401)'; /* TODO: Handle token refresh or redirect to login */ break;
        case 403: message = 'Forbidden (403)'; break;
        case 404: message = 'Not Found (404)'; break;
        case 500: message = 'Internal Server Error (500)'; break;
        // etc.
        default: message = `Request Failed: ${error.response.status}`;
      }
      // If the response has a message, use it
      if (error.response.data && error.response.data.message) {
        message = error.response.data.message;
      } else if (error.response.data && error.response.data.error) { // For httpbin errors
        message = error.response.data.error;
      }


    } else if (error.request) {
      // The request was made but no response was received
      message = 'No response from server. Check network connection.'
      console.error('Error Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      message = error.message;
    }

    ElNotification({
      title: 'Network Error',
      message: message,
      type: 'error',
      duration: 5 * 1000,
    })
    return Promise.reject(error)
  }
)

export default service
