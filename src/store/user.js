import { defineStore } from 'pinia'
// import router from '@/router' // For navigation after login/logout
// import { ElMessage } from 'element-plus' // For notifications

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('mockToken') || null, // Mock token
    name: localStorage.getItem('mockUsername') || '', // Mock user name
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', // Mock avatar
    roles: JSON.parse(localStorage.getItem('mockUserRoles')) || [], // Mock user roles
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    getUserName: (state) => state.name,
    getUserAvatar: (state) => state.avatar,
    getUserRoles: (state) => state.roles,
  },
  actions: {
    // Mock login action
    async login(userInfo) {
      // In a real app, this would make an API call
      // const { username, password } = userInfo
      // const response = await api.login({ username, password })
      // const { token, userDetails } = response.data

      // Mocking successful login:
      return new Promise((resolve) => {
        setTimeout(() => {
          this.token = `fake-token-${Date.now()}-${userInfo.username}`
          this.name = userInfo.username || 'Mock User'
          this.roles = userInfo.username === 'admin' ? ['admin', 'editor'] : ['user']

          localStorage.setItem('mockToken', this.token)
          localStorage.setItem('mockUsername', this.name)
          localStorage.setItem('mockUserRoles', JSON.stringify(this.roles))

          // ElMessage.success('Login successful (mock)!')
          resolve({ success: true })
        }, 500)
      })
    },

    // Mock logout action
    async logout() {
      // In a real app, this might call a backend logout endpoint
      // await api.logout()

      return new Promise((resolve) => {
        setTimeout(() => {
          this.token = null
          this.name = ''
          this.roles = []

          localStorage.removeItem('mockToken')
          localStorage.removeItem('mockUsername')
          localStorage.removeItem('mockUserRoles')

          // Reset other app state if needed (e.g., clear tabs)
          // const appStore = useAppStore() // careful with circular deps if called at module scope
          // appStore.closeAllTabs() // Example

          // ElMessage.info('Logout successful (mock).')
          // router.push('/login') // Redirect to login page
          resolve({ success: true })
        }, 200)
      })
    },

    // Action to get user info (if needed separately, e.g., after page load)
    async getUserInfo() {
      if (!this.token) return; // No token, no info
      // In real app, fetch user info from API using token
      // const response = await api.getUserInfo()
      // this.name = response.data.name
      // this.avatar = response.data.avatar
      // this.roles = response.data.roles

      // For mock, we assume data is already in state or localStorage from login
      // This action could re-validate token or refresh roles
      if (!this.name && localStorage.getItem('mockUsername')) {
        this.name = localStorage.getItem('mockUsername');
        this.roles = JSON.parse(localStorage.getItem('mockUserRoles')) || [];
      }
    }
  },
  // Persist token, name, roles
  persist: {
    paths: ['token', 'name', 'roles', 'avatar'],
    storage: localStorage,
  }
})
