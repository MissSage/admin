import { request } from '@/utils/axios/yinshou'
import {
  IPostStatusParams,
  IQuery_YinShou_Install
} from '@/views/yinshou/types/shengqing/InstallApply'
/**
 * 获取报装详情
 * @param id
 * @returns
 */
export const GetInstallDetail = (id: string) => {
  return request({
    url: `zys/install/m/${id}`,
    method: 'get'
  })
}
/**
 * 审核/勘察/缴费/施工
 * @param id
 * @param params
 * @returns
 */
export const PostInstallStatus = (id: string, params: IPostStatusParams) => {
  return request({
    url: `zys/install/m/${id}`,
    method: 'post',
    data: params
  })
}
/**
 * 获取当前用户的报装申请列表
 * @param params
 * @returns
 */
export const GetInstallList = (params: IQuery_YinShou_Install) => {
  return request({
    url: 'zys/install/m/list',
    method: 'get',
    params
  })
}
/**
 * 批量删除安装申请
 * @param ids
 * @returns
 */
export const DeleteInstallApply = (ids:string[]) => {
  return request({
    url: 'water/zys/install/m',
    method: 'delete',
    data: ids
  })
}
