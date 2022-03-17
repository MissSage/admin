/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  /**
   * 接口路径
   */
   VITE_APP_BASEURL: string
  /**
   * scada接口路径
   */
   VITE_APP_SCADAURL:string
  /**
   * 营收接口
   */
   VITE_APP_YINSHOUURL:string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
