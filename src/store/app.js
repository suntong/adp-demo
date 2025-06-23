import { defineStore } from 'pinia'
import i18n from '@/plugins/i18n' // For language change side effects

export const useAppStore = defineStore('app', {
  state: () => ({
    theme: localStorage.getItem('theme') || 'light',
    language: localStorage.getItem('language') || (navigator.language.toLowerCase().startsWith('zh') ? 'zh-cn' : 'en'),
    isSidebarCollapsed: false, // Example state for sidebar
    isLocked: false, // Lock screen state
    openTabs: [ // Example: Initial tabs, could be persisted
      { name: 'route.dashboard', path: '/dashboard', closable: false, icon: 'HomeFilled' },
      // { name: 'route.demoPage', path: '/demo', closable: true, icon: 'Promotion' }
    ],
    // cachedViews for keep-alive, should be array of component names
    cachedViews: ['DashboardPage'] // Example
  }),
  getters: {
    currentTheme: (state) => state.theme,
    currentLanguage: (state) => state.language,
    sidebarCollapsed: (state) => state.isSidebarCollapsed,
    screenIsLocked: (state) => state.isLocked,
    getOpenTabs: (state) => state.openTabs,
    getCachedViews: (state) => state.cachedViews,
  },
  actions: {
    setTheme(newTheme) {
      this.theme = newTheme
      document.documentElement.className = newTheme === 'dark' ? 'dark' : ''
      localStorage.setItem('theme', newTheme)
      // Potentially trigger ECharts theme update if ECharts instances are managed globally
    },
    setLanguage(lang) {
      this.language = lang
      i18n.global.locale.value = lang // Update vue-i18n locale
      localStorage.setItem('language', lang)
      // HTML lang attribute can also be set: document.documentElement.lang = lang
    },
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed
    },
    setLockState(locked) {
      this.isLocked = locked
    },
    addTab(tab) {
      // Ensure tab has path and name. Add if not already open.
      if (!tab || !tab.path || !tab.name) return;
      const existingTab = this.openTabs.find(t => t.path === tab.path)
      if (!existingTab) {
        this.openTabs.push({
          name: tab.name, // Should be i18n key or resolved title
          path: tab.path,
          meta: tab.meta || {}, // Store meta for icon, closable etc.
          closable: tab.meta?.affix ? false : (tab.closable !== undefined ? tab.closable : true),
        })
      }
      // Add to cachedViews if component should be kept alive
      if (tab.name && tab.meta?.keepAlive && !this.cachedViews.includes(tab.name)) {
         // Assuming tab.name is the component Name property
        this.cachedViews.push(tab.name)
      }
    },
    removeTab(tabPath) {
      const tabIndex = this.openTabs.findIndex(t => t.path === tabPath)
      if (tabIndex !== -1) {
        const tabToRemove = this.openTabs[tabIndex];
        this.openTabs.splice(tabIndex, 1)
        // Remove from cachedViews if it was there
        if (tabToRemove.name && this.cachedViews.includes(tabToRemove.name)) {
          this.cachedViews.splice(this.cachedViews.indexOf(tabToRemove.name), 1);
        }
        // TODO: If current active tab is closed, navigate to another tab (e.g., previous or next)
      }
    },
    closeAllTabs() {
        this.openTabs = this.openTabs.filter(tab => tab.meta?.affix); // Keep only affixed tabs
        this.cachedViews = this.cachedViews.filter(viewName =>
            this.openTabs.some(tab => tab.name === viewName && tab.meta?.affix)
        );
        // Navigate to dashboard or first affixed tab
    },
    closeOtherTabs(currentTabPath) {
        this.openTabs = this.openTabs.filter(tab => tab.meta?.affix || tab.path === currentTabPath);
        this.cachedViews = this.cachedViews.filter(viewName =>
            this.openTabs.some(tab => tab.name === viewName && (tab.meta?.affix || tab.path === currentTabPath))
        );
    },
    // For keep-alive
    addCachedView(viewName) {
        if (viewName && !this.cachedViews.includes(viewName)) {
            this.cachedViews.push(viewName);
        }
    },
    removeCachedView(viewName) {
        const index = this.cachedViews.indexOf(viewName);
        if (index > -1) {
            this.cachedViews.splice(index, 1);
        }
    },
    resetCachedViews() {
        this.cachedViews = [];
    }
  },
  // To persist parts of this store with pinia-plugin-persistedstate:
  // Add `persist: true` or configure specific paths if plugin is globally set up.
  // Or, define persist options here:
  persist: {
    paths: ['theme', 'language', 'isSidebarCollapsed', 'openTabs', 'cachedViews'], // Specify which parts to persist
    storage: localStorage, // Or sessionStorage
  }
})
