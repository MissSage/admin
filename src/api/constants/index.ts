import { request } from '@/utils/axios'

export function getConstantsAttributeById (params: any) {
  return request({
    url: 'api/constants/find',
    method: 'get',
    params: params
  })
}

export function saveConstants (params: any) {
  return request({
    url: 'api/constants/save',
    method: 'post',
    data: params
  })
}

// 创建新的公告 POST api/bulletin/save
export function saveBulletin (params: any) {
  return request({
    url: 'api/bulletin/save',
    method: 'post',
    data: params
  })
}

// 获取企业下最新公告 GET api/bulletin/last
export function getBulletinLast () {
  return request({
    url: 'api/bulletin/last',
    method: 'get'
  })
}

// 获取企业所有公告列表 GET api/bulletin/list
export function getBulletinList () {
  return request({
    url: 'api/bulletin/list',
    method: 'get'
  })
}
