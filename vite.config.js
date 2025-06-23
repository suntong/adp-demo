import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 53000,
    host: '0.0.0.0',
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue-router', 'pinia'], // Auto import Vue, Vue Router, Pinia APIs
      dts: 'src/auto-imports.d.ts', // Generate TypeScript declaration file (optional, but good practice)
    }),
    Components({
      resolvers: [ElementPlusResolver({ importStyle: 'sass' })], // Auto import Element Plus components and import their sass styles
      dts: 'src/components.d.ts', // Generate TypeScript declaration file
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Example: additionalData: `@import "@/styles/variables.scss";`
        // We can add global SCSS variables here later if needed from Art Design Pro
      },
    },
  },
})
