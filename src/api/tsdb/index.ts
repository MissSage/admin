
/** save Tenant */

import { request } from '@/utils/axios'

// TODO: fix parameters
export function queryDeviceData (params: any) {
  return request({
    url: 'api/device/data',
    method: 'post',
    data: params
  })
}

// istar
export function queryDeviceDataIstar (params: { page: string | number | undefined; size: string | number | undefined; start: number; end: number; type: string; attributes: any[] }) {
  return request({
    url: 'istar/api/device/data',
    method: 'post',
    data: params
  })
}

export function queryAssetData (params: any) {
  return request({
    url: 'api/asset/data',
    method: 'post',
    data: params
  })
}

// api/asset/multipleData
export function queryAssetMultipleData (params: any) {
  return request({
    url: 'api/asset/multipleData',
    method: 'post',
    data: params
  })
}

export function queryAssetDataAndPrice (params: any) {
  return request({
    url: 'api/asset/dataAndPrice',
    method: 'post',
    data: params
  })
}

export function queryAssetTimeSharingData (params: any) {
  return request({
    url: 'api/asset/dataBySharing',
    method: 'post',
    data: params
  })
}

export function queryenergyByTimeSharing (params: any) {
  return request({
    url: 'api/asset/energyByTimeSharing',
    method: 'post',
    data: params
  })
}

export function queryVirtualData (params: any) {
  return request({
    url: 'api/virtual/data',
    method: 'post',
    data: params
  })
}

export function queryRealTimeData (params: any) {
  return request({
    url: 'api/device/realTime',
    method: 'post',
    data: params
  })
}
