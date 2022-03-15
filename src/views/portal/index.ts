export interface dialogrule {
    visible: boolean,
    title: string,
    type: boolean,
    value: any,
    appform: any,
    close: () => void
}
// 时间
export interface ITime {
    year: string | any
    month: string | any
    day: string | any
    nowtime: string | any
  }
  // 企业应用
  export interface IApps {
    applist: any
    length: number
    getapplist: () => void
    Jump: (id: string) => void
    filterAsyncRouter: any
  }