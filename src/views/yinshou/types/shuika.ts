import { IQueryBase } from './common'

/**
 * 绑定用户的参数
 */
export type IPostBindUser = {
  /**
   * 要绑定用户的水卡ID
   */
  cardId?: string
  /**
   * 绑定的用户编码
   */
  custCode?: string
}
/**
 * 查询水卡列表参数
 */
export interface IQuery_Yinshou_WaterCard extends IQueryBase {
  keyword?: string
  custCode?: string
}
