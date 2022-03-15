import { IQueryBase } from '../common'

/**
 * 查询用水统计报表参数
 */
export type IQuery_YinShou_Water = {
  orgId?: string
  start?: number
  end?: number
}
export type IYinShou_WaterReport = {
  id?: string
  /**
   * 消费金额合计
   *
   * 元
   */
  moneyTotal: string
  /**
   * 表册名称
   */
  bookName: string
  /**
   * 方量合计
   *
   * 单位升
   */
  waterUseTotal: string
  /**
   * 表册ID
   */
  bookId: string
}
