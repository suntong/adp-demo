import { createRouter, createWebHistory, RouterView } from 'vue-router'
import { h } from 'vue'
import Layout from '@/layout/index.vue'
// import { useUserStore } from '@/store/user' // For auth guards

// Define routes
const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/DashboardPage.vue'), // Placeholder, create this view
        meta: { title: 'route.dashboard', icon: 'HomeFilled', affix: true } // affix for tabs
      },
      {
        path: 'demo',
        name: 'DemoPage',
        component: () => import('@/views/DemoPage.vue'),
        meta: { title: 'route.demoPage', icon: 'Promotion' }
      },
      { // Example detail page for breadcrumb testing
        path: 'demo/detail-example',
        name: 'DemoDetailExample',
        component: () => import('@/views/DemoDetailPage.vue'), // Placeholder, create this view
        meta: {
          title: 'Demo Detail',
          icon: 'List',
          activeMenu: '/demo',
          breadcrumbParent: 'DemoPage'
        }
      },
      // New Sub Menu Demo routes
      {
        path: 'sub-menu-demo', // Base path for this section
        name: 'SubMenuDemo', // Optional name for the group itself if needed for routing
        // If '/sub-menu-demo' itself should not be a page, redirect to its first child.
        // Or provide a component that acts as a RouterView for these children if they are deeply nested.
        // For simplicity, we can make the parent menu item in Sidebar.vue just a non-clickable title,
        // or link it to the first child. Here, we'll define children directly under Layout.
        // To make a top-level menu item in Sidebar.vue for "Sub Menu Demo",
        // we don't necessarily need a parent route here if children are direct children of Layout.
        // However, for cleaner breadcrumbs and potential future grouping, a parent route is good.
        // We'll make it a redirecting parent for now.
        redirect: '/sub-menu-demo/page1',
        component: { render: () => h(RouterView) }, // Use render function
        meta: { title: 'Sub Menu Demo', icon: 'Menu' }, // For potential top-level menu item in sidebar
        children: [
          {
            path: 'page1', // Full path will be /sub-menu-demo/page1
            name: 'SubMenuPage1',
            component: () => import('@/views/SubMenuPage1.vue'),
            meta: { title: 'Sub Menu 1', breadcrumbParent: 'SubMenuDemo', /* icon: 'Document' */ }
          },
          {
            path: 'page2', // Full path will be /sub-menu-demo/page2
            name: 'SubMenuPage2',
            component: () => import('@/views/SubMenuPage2.vue'),
            meta: { title: 'Sub Menu 2', breadcrumbParent: 'SubMenuDemo', /* icon: 'Document' */ }
          }
        ]
      }
    ]
  },
  {
    path: '/admin-only',
    component: Layout,
    children: [
      {
        path: '', // Default child for /admin-only
        name: 'AdminOnlyPage',
        component: () => import('@/views/AdminOnlyPage.vue'), // Placeholder, create this view
        meta: { title: 'Admin Area', icon: 'Lock', requiresAuth: true, roles: ['admin'] }
      }
    ]
  },
  // Example of a login page route (not part of layout)
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: () => import('@/views/LoginPage.vue'), // Placeholder
  //   meta: { title: 'Login', hidden: true } // Hidden from sidebar
  // },
  {
    path: '/:pathMatch(.*)*', // Catch-all for 404
    name: 'NotFound',
    component: () => import('@/views/NotFoundPage.vue'), // Placeholder, create this view
    meta: { title: '404 Not Found', hidden: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Vite uses import.meta.env.BASE_URL
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation Guards (Simplified)
router.beforeEach((to, from, next) => {
  // const userStore = useUserStore() // Assuming Pinia is setup
  const mockToken = localStorage.getItem('mockToken') // Using direct localStorage for now

  document.title = `${to.meta.title || 'Admin App'} - Vue Art Design Pro`

  if (to.meta.requiresAuth) {
    if (mockToken) { // Check for token (basic auth check)
      // Optional: Check for roles if to.meta.roles is defined
      // const userRoles = userStore.roles // or decode from token
      const requiredRoles = to.meta.roles
      const userHasRequiredRole = true; // Simplified: Assume true if token exists for now.
                                       // Real check: requiredRoles.some(role => userRoles.includes(role))

      if (requiredRoles && !userHasRequiredRole) {
        // Redirect to an unauthorized page or dashboard
        // ElMessage.error('You do not have permission to access this page.')
        next({ path: '/dashboard', query: { unauthorized: true } }) // Or a specific 403 page
      } else {
        next() // Proceed
      }
    } else {
      // No token, redirect to login page
      // next({ path: '/login', query: { redirect: to.fullPath } })
      // For demo, redirect to dashboard and show message
      console.warn(`Navigation to "${to.path}" blocked: requires authentication. Mock redirecting to dashboard.`);
      next({ path: '/dashboard', query: { loginRequired: true } })
    }
  } else {
    next() // No auth required, proceed
  }
})

export default router
