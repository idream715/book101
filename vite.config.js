import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 2, // Vue 2 compatibility mode
            GLOBAL_PROTOTYPE: false,
            COMPONENT_ASYNC: false
          }
        }
      }
    }),
    vuetify({
      autoImport: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // Vue 2 compatibility
      vue: '@vue/compat'
    }
  },
  define: {
    // Vue 2 compatibility
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
  },
  server: {
    port: 8080,
    // Proxy configuration for API calls
    proxy: {
      '/api1': {
        target: 'https://api3.rgtcenter.com:2053',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api1/, '/dm01')
      },
      '/api2': {
        target: 'https://dm01.code-th.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api2/, '/books')
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler' // Use modern Sass API
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vuetify', 'vue-router', 'pinia'],
          'naive-ui': ['naive-ui']
        }
      }
    }
  }
})