import { request } from '@/utils/axios'

export function getDataBackupList (params: { start: string; end: string }) {
  return request({
    url: 'api/databackup/list?start=' + params.start + '&end=' + params.end,
    method: 'GET'
  })
}

export function backup () {
  return request({
    url: 'api/databackup/backup',
    method: 'POST'
  })
}
