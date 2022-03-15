import { request } from '@/utils/axios'

export function getAttributes (entityType: string | any[], entityId: string) {
  if (Array.isArray(entityType)) {
    const type = entityType[0]
    const Id = entityType[1]
    const _url = '/plugins/telemetry/' + type + '/' + Id + '/values/attributes'
    return request({
      url: _url,
      method: 'get'
    })
  } else {
    return request({
      url: 'api/plugins/telemetry/' + entityType + '/' + entityId + '/values/attributes',
      method: 'get'
    })
  }
}
/** save asset formula:  */
export function saveEntityAttributesV1 (entityType: string, entityId: string, params: any) {
  console.log(params)
  return request({
    url: 'api/plugins/telemetry/' + entityType + '/' + entityId + '/SERVER_SCOPE',
    method: 'post',
    data: params
  })
}

// 删除entity 信息 删除换表
export function deleteEntityAttributesV1 (entityType: string, entityId: string, params: string) {
  return request({
    url: 'api/plugins/telemetry/' + entityType + '/' + entityId + '/SERVER_SCOPE?keys=' + params,
    method: 'delete'
  })
}
