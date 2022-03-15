import { request } from '@/utils/axios'

export function getAdminSettings (key: string) {
  return request({
    url: 'api/admin/settings/' + key,
    method: 'get'
  })
}

export function saveAdminSettings (params: any) {
  return request({
    url: 'api/admin/settings',
    method: 'post',
    data: params
  })
}

export function sendTestMail (params: any) {
  return request({
    url: 'api/admin/settings/testMail',
    method: 'post',
    data: params
  })
}

export function setMesKey (params: any) {
  return request({
    url: 'api/setSmsKey',
    method: 'post',
    data: params
  })
}

export function sendMes (key: string) {
  return request({
    url: 'api/testSms?phone=' + key,
    method: 'get'
  })
}

export function getSMKey () {
  return request({
    url: 'api/getSmsKey',
    method: 'get'
  })
}
