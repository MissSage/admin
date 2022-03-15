import { IQueryBase } from './common'

export interface IQueryMeterRead extends IQueryBase {
  /**
   * 表具编号
   */
  meterCode?: string
  /**
   * 户号
   */
  custCode?: string
}
/**
 * 开关阀门参数
 */
export interface IPostToggleValve {
  /**
   * 开关操作：0开1关
   */
  option?: string
  /**
   * 操作的表具编号
   */
  meterCode?: string
}
export interface IQueryUserBill {
  /**
   * 用户编号
   */
  custCode?: string
  start?: number
  end?: number
}
