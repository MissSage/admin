import { request } from '@/utils/axios/yinshou'

/**
 * 回复投诉
 * @param params
 * @returns
 */
export const ComplaintsReply = (params: any) => {
  return request({
    url: 'zys/complaints',
    method: 'post',
    data: params
  })
}
/**
 * 获取投诉意见列表
 * @param params
 * @returns
 */
export const GeComplaintsList = (params: any) => {
  return request({
    url: 'zys/complaints/list',
    method: 'get',
    params
  })
}
/**
 * 批量删除投诉
 * @param ids
 * @returns
 */
export const DeleteComplaints = (ids: string[]) => {
  return request({
    url: 'zys/complaints',
    method: 'delete',
    data: ids
  })
}
