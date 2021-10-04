/// <reference types="vite/client" />

// eslint-disable-next-line no-unused-vars
interface ImportMetaEnv {
  VITE_APP_TITLE: string
  VITE_API_BASEURL: string,
  VITE_MAP_JSPATH:string, // 地图API脚本地址
  VITE_MAP_CSSPATH:string // 地图API样式脚本
  // 更多环境变量...
}
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
