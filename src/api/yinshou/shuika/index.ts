import { request } from '@/utils/axios/yinshou'
import { IPostBindUser, IQuery_Yinshou_WaterCard } from '@/views/yinshou/types/shuika'
/**
 * 批量删除水卡
 * @param ids
 * @returns
 */
export const DeleteWaterCard = (ids: string[]) => {
  return request({
    url: 'zys/waterCard/remove',
    method: 'delete',
    data: ids
  })
}
/**
 * 更改水卡状态
 * @param option 0：未绑定 1：已绑定 2：已启用 3：已过期
 * @returns
 */
export const UpdateWaterCardStatus = (option: string, cardId: string) => {
  return request({
    url: `zys/waterCard/status/${option}?cardId=${cardId}`,
    method: 'post'
  })
}
/**
 * 绑定用户
 * @param params
 * @returns
 */
export const BindUser = (params: IPostBindUser) => {
  return request({
    url: 'zys/waterCard/bindUser',
    method: 'post',
    data: params
  })
}
/**
 * 编辑
 * @param params
 * @returns
 */
export const UpdateWaterCard = (params: any) => {
  return request({
    url: 'zys/waterCard/update',
    method: 'post',
    data: params
  })
}
/**
 * 新增水卡
 * @param params
 * @returns
 */
export const SaveWaterCard = (params: any) => {
  return request({
    url: 'zys/waterCard/save',
    method: 'post',
    data: params
  })
}
/**
 * 查询水卡列表
 * @param params
 * @returns
 */
export const GetWaterCardList = (params: IQuery_Yinshou_WaterCard) => {
  return request({
    url: 'zys/waterCard/list',
    method: 'get',
    params
  })
}
