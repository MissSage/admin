import { request } from '@/utils/axios/yinshou'
import {
  IPostStatusParams,
  IQuery_YinShou_Repaire
} from '@/views/yinshou/types/shengqing/RepaireApply'
/**
 * 获取维修列表
 * @param params
 * @returns
 */
export const GetRepaireList = (params: IQuery_YinShou_Repaire) => {
  return request({
    url: 'zys/repair/m/list',
    method: 'get',
    params
  })
}
/**
 * 获取维修详情
 * @param id
 * @returns
 */
export const GetRepaireDetail = (id: string) => {
  return request({
    url: `zys/repair/m/${id}`,
    method: 'get'
  })
}
/**
 * 审核/验收/维修
 * @param id
 * @param params
 * @returns
 */
export const PostRepaireStatus = (id: string, params: IPostStatusParams) => {
  return request({
    url: `zys/repair/m/${id}`,
    method: 'post',
    data: params
  })
}
/**
 * 批量删除维修申请
 * @param ids
 * @returns
 */
export const DeleteRepaireApply = (ids: string[]) => {
  return request({
    url: 'zys/repair/m',
    method: 'delete',
    data: ids
  })
}
