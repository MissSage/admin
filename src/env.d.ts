/// <reference types="vite/client" />

// eslint-disable-next-line no-unused-vars
interface ImportMetaEnv {
  /**
   * 项目名称
   */
  VITE_APP_TITLE: string
  /**
   * 接口路径
   */
  VITE_API_BASEURL: string
  /**
   * scada接口路径
   */
  VITE_API_SCADAURL:string
  /**
   * 营收接口
   */
  VITE_API_YINSHOUURL:string
}
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

// yarn add --dev eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-vue @typescript-eslint/parser @typescript-eslint/eslint-plugin
