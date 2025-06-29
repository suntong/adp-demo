<template>
  <div class="demo-page">
    <h1>{{ $t('route.demoPage') }} - Art Design Pro Features Showcase</h1>

    <el-divider content-position="left">UI Components & Features</el-divider>

    <!-- Global Search (Mock UI) -->
    <section class="feature-section">
      <h2>Global Search (Mock UI)</h2>
      <el-input placeholder="Search anything..." style="width: 300px;">
        <template #prepend>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </section>

    <!-- Lock Screen (Mock UI & State) -->
    <section class="feature-section">
      <h2>Lock Screen (Mock UI & State)</h2>
      <el-button @click="toggleLockScreen" :type="isLocked ? 'danger' : 'success'">
        {{ isLocked ? 'Unlock Screen' : 'Lock Screen' }}
      </el-button>
      <p v-if="isLocked" style="color: red;">Screen is Locked! (UI for unlock would overlay)</p>
    </section>

    <!-- Multi-tabs (Basic visualization) -->
    <section class="feature-section">
      <h2>Multi-tabs (Conceptual - managed by store, shown in layout)</h2>
      <p>Open tabs: {{ openTabs.map(t => t.name).join(', ') }}</p>
      <el-button @click="addMockTab">Add Mock Tab</el-button>
      <el-button @click="removeLastMockTab" :disabled="openTabs.length <= 1">Remove Last Tab</el-button>
      <p><em>(Actual tabs UI would be in the main layout)</em></p>
    </section>

    <!-- Global Breadcrumbs (Conceptual) -->
    <section class="feature-section">
      <h2>Global Breadcrumbs (Conceptual - shown in layout)</h2>
      <p>Current route: {{ $route.path }}</p>
      <p>Breadcrumbs are typically generated based on route metadata in the Navbar.</p>
       <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">Homepage</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/demo' }">Demo Page</el-breadcrumb-item>
        <el-breadcrumb-item v-if="$route.path.includes('/demo/detail')">Detail</el-breadcrumb-item>
      </el-breadcrumb>
      <router-link to="/demo/detail-example">
        <el-button size="small" style="margin-top: 10px;">Go to Detail Example (for breadcrumb)</el-button>
      </router-link>
    </section>

    <!-- Icon Library Usage -->
    <section class="feature-section">
      <h2>Icon Library Usage (@element-plus/icons-vue)</h2>
      <el-icon :size="20" color="#409EFC"><Edit /></el-icon>
      <el-icon :size="20" color="#67C23A"><Share /></el-icon>
      <el-icon :size="20" color="#E6A23C"><Star /></el-icon>
      <p>Using Element Plus Icons: Edit, Share, Star.</p>
    </section>

    <!-- Rich Text Editor (Placeholder) -->
    <section class="feature-section">
      <h2>Rich Text Editor (Placeholder)</h2>
      <el-input type="textarea" :rows="4" placeholder="Imagine a rich text editor here..."></el-input>
      <p><em>Integration of a full rich text editor like WangEditor would be a larger sub-task.</em></p>
    </section>

    <!-- Echarts Charts -->
    <section class="feature-section">
      <h2>Echarts Charts</h2>
      <div ref="echartsBarChart" style="width: 100%; height: 300px;"></div>
      <div ref="echartsPieChart" style="width: 100%; height: 300px; margin-top: 20px;"></div>
    </section>

    <!-- Utils Toolkit Examples -->
    <section class="feature-section">
      <h2>Utils Toolkit Examples</h2>
      <p>Formatted Date (example util): {{ formattedDate }}</p>
      <p>Random Number (example util): {{ randomNumber }}</p>
    </section>

    <!-- Network Exception Handling (Demo Button) -->
    <section class="feature-section">
      <h2>Network Exception Handling</h2>
      <el-button @click="testNetworkError">Test 404 Error</el-button>
      <el-button @click="testNetworkSuccess">Test Success (HttpBin)</el-button>
      <p><em>(Global handlers in axios setup will show notifications)</em></p>
    </section>

    <!-- Route-level & Sidebar Menu Authentication (Conceptual) -->
    <section class="feature-section">
      <h2>Route-level & Sidebar Menu Authentication (Conceptual)</h2>
      <p>Current mock auth token: <code>{{ mockToken || 'Not Authenticated' }}</code></p>
      <el-button @click="mockLogin" v-if="!mockToken">Mock Login</el-button>
      <el-button @click="mockLogout" v-if="mockToken">Mock Logout</el-button>
      <p><em>(Actual route guards and dynamic sidebar are configured in router/store)</em></p>
      <p>Try navigating to a <router-link to="/admin-only"><a>mock admin page</a></router-link> (will redirect if not 'logged in').</p>
    </section>

    <!-- Authentication Directives (v-auth) -->
    <section class="feature-section">
      <h2>Authentication Directives (<code>v-auth</code>)</h2>
      <el-button v-auth="'admin'">Button visible only if user has 'admin' role (mocked)</el-button>
      <el-button v-auth="['editor']">Button visible only if user has 'editor' role (mocked)</el-button>
      <p><em>(Requires user store with roles and a custom directive setup)</em></p>
    </section>

    <!-- Mobile Adaptation -->
    <section class="feature-section">
      <h2>Mobile Adaptation</h2>
      <p>The overall layout (sidebar, navbar) should adapt to smaller screens. Element Plus components are responsive by default.</p>
      <p><em>(Test by resizing your browser window)</em></p>
    </section>

    <!-- Persistent Storage Solution (Pinia + pinia-plugin-persistedstate) -->
    <section class="feature-section">
      <h2>Persistent Storage</h2>
      <p>Theme, language, and other settings (like open tabs, user token) will be persisted in localStorage via Pinia plugin.</p>
      <p>Try changing the theme or language, then refresh the page. Your choices should remain.</p>
    </section>

    <!-- Local Data Storage Validation -->
    <section class="feature-section">
      <h2>Local Data Storage Validation (Example)</h2>
      <el-input v-model="dataToStore" placeholder="Enter data to store locally"></el-input>
      <el-button @click="saveDataWithValidation">Save to localStorage with Validation</el-button>
      <el-button @click="loadDataWithValidation">Load from localStorage with Validation</el-button>
      <p>Stored/Loaded data: <code>{{ validatedData }}</code></p>
      <p><em>(Example: data must be a non-empty string)</em></p>
    </section>

    <el-divider content-position="left">HttpBin Form</el-divider>
    <!-- HttpBin Form Component will be added here later -->
    <HttpBinForm />

    <el-divider content-position="left">Core Functionality</el-divider>

    <!-- Theme Switching -->
    <section class="feature-section">
      <h2>Theme Switching</h2>
      <el-radio-group v-model="theme" @change="handleThemeChange">
        <el-radio-button value="light">Light</el-radio-button>
        <el-radio-button value="dark">Dark</el-radio-button>
      </el-radio-group>
      <p>Current theme: {{ theme }}</p>
      <p class="theme-sensitive-text">This text color should change with the theme.</p>
    </section>

    <!-- Multi-language Support -->
    <section class="feature-section">
      <h2>Multi-language Support</h2>
      <el-radio-group v-model="currentLanguage" @change="handleLanguageChange">
        <el-radio-button value="en">English</el-radio-button>
        <el-radio-button value="zh-cn">中文 (Chinese)</el-radio-button>
      </el-radio-group>
      <p>{{ $t('message.hello') }}</p>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import * as echarts from 'echarts'
import { ElNotification } from 'element-plus'
import { Search, Edit, Share, Star } from '@element-plus/icons-vue'

// For HttpBinForm (will be its own component, but placeholder for now)
// import HttpBinForm from '@/components/HttpBinForm.vue' // Assuming this will be created
// This one is ALREADY imported below, so removing this duplicate.

import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'

// For HttpBinForm
import HttpBinForm from '@/components/HttpBinForm.vue'

const appStore = useAppStore()
const userStore = useUserStore()
const { t, locale } = useI18n()

// Destructure reactive properties from stores
const {
  theme: storeTheme,
  language: storeLanguage,
  isLocked: storeIsLocked,
  openTabs: storeOpenTabs
} = storeToRefs(appStore)

const {
  token: userToken,
  roles: userStoreRoles,
  name: userName
} = storeToRefs(userStore)


// --- Theme Switching ---
// Use computed properties to bind to store state for v-model
const theme = computed({
  get: () => storeTheme.value,
  set: (newTheme) => appStore.setTheme(newTheme)
})

const handleThemeChange = (newTheme) => {
  appStore.setTheme(newTheme) // Action handles DOM and localStorage
  ElNotification({ title: 'Theme Changed', message: `Switched to ${newTheme} theme.`, type: 'success' })
  // ECharts theme update is now handled by watching appStore.theme
}
// Initial theme application is handled by the store's own initialization or a watcher in App.vue/main.js for first load.
// For this component, we rely on the store being correctly initialized.
onMounted(() => {
  // Ensure current theme from store is applied on mount (if not done globally)
  document.documentElement.className = appStore.currentTheme === 'dark' ? 'dark' : '';
})


// --- Multi-language Support ---
const currentLanguage = computed({
  get: () => storeLanguage.value,
  set: (newLang) => appStore.setLanguage(newLang)
})

const handleLanguageChange = (lang) => {
  appStore.setLanguage(lang) // Action handles vue-i18n and localStorage
  ElNotification({ title: 'Language Changed', message: `Switched to ${lang}.`, type: 'success' })
}
// Initial language application is handled by the store / i18n plugin.
onMounted(() => {
   // Ensure i18n locale is synced with store on component mount
  if (locale.value !== appStore.currentLanguage) {
    locale.value = appStore.currentLanguage;
  }
})


// --- Lock Screen ---
const isLocked = computed({
    get: () => storeIsLocked.value,
    set: (val) => appStore.setLockState(val)
})
const toggleLockScreen = () => {
  appStore.setLockState(!isLocked.value) // Use the action
  ElNotification({ title: 'Lock Screen', message: `Screen is now ${isLocked.value ? 'Locked' : 'Unlocked'}.`, type: 'info' })
}

// --- Multi-tabs ---
// Display open tabs from store
const openTabs = computed(() => storeOpenTabs.value)

const addMockTab = () => {
  const newTabInfo = {
    name: `Mock Tab ${appStore.openTabs.length + 1}`, // name should be a route name or i18n key
    path: `/mockPath${appStore.openTabs.length}`,
    meta: { title: `Mock Tab ${appStore.openTabs.length + 1}`, closable: true, icon: 'Document' }
  }
  appStore.addTab(newTabInfo)
}
const removeLastMockTab = () => {
  if (appStore.openTabs.length > 1) {
    // Find last closable tab to remove
    let lastClosableTabIndex = -1;
    for (let i = appStore.openTabs.length - 1; i >= 0; i--) {
        if (appStore.openTabs[i].closable !== false) { // Check if closable is not explicitly false
            lastClosableTabIndex = i;
            break;
        }
    }
    if (lastClosableTabIndex !== -1) {
        appStore.removeTab(appStore.openTabs[lastClosableTabIndex].path)
    } else {
        ElNotification({title: 'Cannot Close', message: 'No more closable tabs to remove.', type: 'warning'})
    }
  }
}

// --- Echarts ---
const echartsBarChart = ref(null)
const echartsPieChart = ref(null)
let barChartInstance = null;
let pieChartInstance = null;

// Use appStore.currentTheme for ECharts theme directly
const getEchartsTheme = () => appStore.currentTheme === 'dark' ? 'dark' : 'light';

const initBarChart = () => {
  if (echartsBarChart.value) {
    if (barChartInstance) barChartInstance.dispose(); // Dispose before re-init
    barChartInstance = echarts.init(echartsBarChart.value, getEchartsTheme());
    barChartInstance.setOption({
      title: { text: 'Sample Bar Chart', textStyle: { color: appStore.currentTheme === 'dark' ? '#fff' : '#333'} },
      tooltip: {},
      xAxis: { data: ['Shirts', 'Cardigans', 'Chiffons', 'Pants', 'Heels', 'Socks'], axisLabel: { color: appStore.currentTheme === 'dark' ? '#ccc' : '#333'} },
      yAxis: { axisLabel: { color: appStore.currentTheme === 'dark' ? '#ccc' : '#333'} },
      series: [{ name: 'Sales', type: 'bar', data: [5, 20, 36, 10, 10, 20] }],
      backgroundColor: 'transparent'
    })
  }
}
const initPieChart = () => {
  if (echartsPieChart.value) {
    if (pieChartInstance) pieChartInstance.dispose(); // Dispose before re-init
    pieChartInstance = echarts.init(echartsPieChart.value, getEchartsTheme());
    pieChartInstance.setOption({
      title: { text: 'Sample Pie Chart', left: 'center', textStyle: { color: appStore.currentTheme === 'dark' ? '#fff' : '#333'} },
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left', data: ['Direct', 'Email', 'Ad', 'Video', 'Search'], textStyle: { color: appStore.currentTheme === 'dark' ? '#ccc' : '#333'} },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 1048, name: 'Direct' },
            { value: 735, name: 'Email' },
            { value: 580, name: 'Ad' },
            { value: 484, name: 'Video' },
            { value: 300, name: 'Search' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ],
      backgroundColor: 'transparent'
    })
  }
}
onMounted(() => {
  initBarChart()
  initPieChart()
})
// Watch for theme changes from store to re-init charts
watch(() => appStore.currentTheme, (newThemeVal) => {
    // Ensure charts are re-initialized with the new theme
    // The getEchartsTheme() function will use appStore.currentTheme
    if (barChartInstance) barChartInstance.dispose();
    if (pieChartInstance) pieChartInstance.dispose();
    initBarChart(); // Will pick up new theme via getEchartsTheme()
    initPieChart(); // Will pick up new theme via getEchartsTheme()

    // Also ensure the html class is updated if the store action didn't cover an edge case
    // (though it should). This is more of a safeguard or for components that might not react to store alone.
    document.documentElement.className = newThemeVal === 'dark' ? 'dark' : '';
});


// --- Utils Toolkit ---
import { formatDate, generateRandomNumber } from '@/utils/demoUtils.js' // Assuming utils file
const formattedDate = ref(formatDate(new Date()))
const randomNumber = ref(generateRandomNumber(1, 100))

// --- Network Exception Handling ---
import axiosInstance from '@/plugins/axios.js' // Use the configured axios instance

const testNetworkError = async () => {
  try {
    // This request should be caught by the global error handler in axiosInstance
    await axiosInstance.get('https://httpbin.org/status/404')
  } catch (error) {
    // Error is already handled by the interceptor, which shows a notification.
    // This local catch is mostly for additional component-specific logic if needed.
    console.error("DemoPage: Local catch for 404 (already handled globally by axios interceptor):", error.message)
  }
}
const testNetworkSuccess = async () => {
  try {
    const response = await axiosInstance.get('https://httpbin.org/get?show_env=1')
    ElNotification({ title: 'Success (Demo)', message: 'Successfully fetched data from httpbin.org/get!', type: 'success' })
    console.log("DemoPage Httpbin Success:", response.data) // response.data because interceptor returns full response
  } catch (error) {
    // Error should be handled by the global interceptor if it's a network/status error.
    console.error("DemoPage: Error in testNetworkSuccess (should be handled globally by axios interceptor if error):", error.message)
  }
}

// --- Mock Auth ---
// Use computed properties for display if needed, and actions for changes
const mockToken = computed(() => userToken.value) // reactive display from store
const userRoles = computed(() => userStoreRoles.value) // reactive display from store

const mockLogin = async () => {
  // Call userStore action. The action itself handles state update and localStorage.
  try {
    await userStore.login({ username: 'admin' }) // Simplified login, pass necessary info
    ElNotification({ title: 'Logged In (Mock)', message: `Welcome, ${userName.value}! You are now mock-logged in.`, type: 'success' })
  } catch (e) {
    ElNotification({ title: 'Login Failed (Mock)', message: e.message, type: 'error'})
  }
}
const mockLogout = async () => {
  // Call userStore action.
  try {
    await userStore.logout()
    ElNotification({ title: 'Logged Out (Mock)', message: 'You have been logged out.', type: 'info' })
  } catch(e) {
    ElNotification({ title: 'Logout Failed (Mock)', message: e.message, type: 'error'})
  }
}

// --- Local Data Storage Validation ---
const dataToStore = ref('')
const validatedData = ref(localStorage.getItem('validatedData') || null)
const saveToLocalStorage = (key, value) => localStorage.setItem(key, value)
const getFromLocalStorage = (key) => localStorage.getItem(key)

const saveDataWithValidation = () => {
  if (typeof dataToStore.value === 'string' && dataToStore.value.trim() !== '') {
    saveToLocalStorage('validatedData', dataToStore.value)
    validatedData.value = dataToStore.value
    ElNotification({ title: 'Saved', message: 'Data saved to localStorage.', type: 'success' })
  } else {
    ElNotification({ title: 'Validation Error', message: 'Data must be a non-empty string.', type: 'error' })
  }
}
const loadDataWithValidation = () => {
  const loaded = getFromLocalStorage('validatedData')
  if (loaded && typeof loaded === 'string' && loaded.trim() !== '') {
    validatedData.value = loaded
    dataToStore.value = loaded // also populate input
    ElNotification({ title: 'Loaded', message: 'Data loaded from localStorage.', type: 'success' })
  } else {
    validatedData.value = null
    ElNotification({ title: 'Load Error', message: 'No valid data found or data is invalid.', type: 'warning' })
    if(loaded) localStorage.removeItem('validatedData'); // Clean up invalid data
  }
}

// Directive v-auth (will be registered globally in main.js)
// For this page's demo, we simulate its effect:
// This is a placeholder. The actual directive would control element rendering/visibility.
// We'll add the directive registration later.

</script>

<style lang="scss" scoped>
.demo-page {
  padding: 20px;
}

.feature-section {
  margin-bottom: 30px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #fff; // White background for sections on gray page

  h2 {
    margin-top: 0;
    margin-bottom: 15px;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 10px;
  }
}

.el-divider {
  margin: 40px 0;
}

.theme-sensitive-text {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid var(--el-border-color); // Use Element Plus CSS variables for theme sensitivity
  color: var(--el-text-color-primary);
  background-color: var(--el-bg-color-page);
}

// Dark theme specific adjustments for the demo page itself
.dark .demo-page {
  background-color: #141414; // Darker page background
  color: #fff;
}
.dark .feature-section {
  background-color: #1e1e1e; // Darker section background
  border: 1px solid #303030;
  h2 {
    color: #eee;
    border-bottom: 1px solid #333;
  }
}

// Responsive
@media (max-width: 768px) {
  .demo-page {
    padding: 10px;
  }
  .feature-section {
    padding: 10px;
  }
  h1 {
    font-size: 1.5em;
  }
  h2 {
    font-size: 1.2em;
  }
}
</style>
