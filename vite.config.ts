import path from 'path'
import eslintPlugin from 'vite-plugin-eslint'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), eslintPlugin({
    cache: false
  })],
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
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
    sourcemap: false
  }
})
