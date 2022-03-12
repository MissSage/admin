import path from 'path'
import eslintPlugin from 'vite-plugin-eslint'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import importToCDN, { autoComplete } from 'vite-plugin-cdn-import'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), eslintPlugin({
    cache: false
  }),
  importToCDN({
    modules: [
      autoComplete('vue'),
      autoComplete('axios'),
      autoComplete('lodash'),
      {
        name: 'vue',
        var: 'Vue',
        path: 'https://cdn.jsdelivr.net/npm/vue@next'
      },
      {
        name: 'vuex',
        var: 'Vuex',
        path: 'https://cdn.jsdelivr.net/npm/vuex@4.0.2/dist/vuex.global.prod.js'
      },
      {
        name: 'vue-router',
        var: 'VueRouter',
        path: 'https://cdn.jsdelivr.net/npm/vue-router@4.0.14/dist/vue-router.global.prod.js'
      },
      {
        name: 'element-plus',
        var: 'ElementPlus',
        css: 'https://cdn.jsdelivr.net/npm/element-plus/dist/index.css',
        path: 'https://cdn.jsdelivr.net/npm/element-plus@2.1.0'
      }
    ]
  })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  envDir: 'root/env',
  server: {
    port: 3000,
    host: '0.0.0.0',
    cors: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/styles/variables.scss";'
      },
      less: {
        globalVars: {
          primary: '#fff'
        }
      }
    },
    postcss: {
      map: false,
      plugins: [
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === 'charset') {
                atRule.remove()
              }
            }
          }
        }
      ]
    }
  },
  build: {
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks (id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: []
  }
})
