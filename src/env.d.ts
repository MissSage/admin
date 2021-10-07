/// <reference types="vite/client" />

// eslint-disable-next-line no-unused-vars
interface ImportMetaEnv {
  VITE_APP_TITLE: string
  VITE_API_BASEURL: string
  // 更多环境变量...
}
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
