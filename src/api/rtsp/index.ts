// 查询所有摄像头
import type { INegotiatModel } from '@/common/types/rtsp'
import { request } from '@/utils/axios'

// 查询所有视频
export function getMonitors () {
  return request({
    url: '/streams',
    method: 'get'
  })
}

export const handleNegotiation = (params: INegotiatModel) => {
  return request({
    url: params.url,
    method: 'post',
    data: 'data=' + params.data
  })
}
export const editMonitors = (params: { uuid: string }) => {
  return request({
    url: '/stream/' + params.uuid + '/edit',
    method: 'post'
  })
}
export const deleteMonitors = (id: string) => {
  return request({
    url: '/stream/' + id + '/delete',
    method: 'get'
  })
}
export const reloadMonitors = (params: { uuid: string }) => {
  return request({
    url: '/stream/' + params.uuid + '/reload',
    method: 'get'
  })
}
export const infoMonitors = (params: { uuid: string }) => {
  return request({
    url: '/stream/' + params.uuid + '/info',
    method: 'get'
  })
}
