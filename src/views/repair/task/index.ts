import {
  CHUFAXINGJIHUA,
  GUDINGRIQIJIHUA,
  GUZHANGBAOXIU,
  YUFANGXINGJIHUA,
  TASKSTATUS
} from '@/common/constans/repair'
import type { IIssue, ITableItem } from '@/common/types/repair/task'
/**
 * 优先级
 */
export const YXJOptions = [
  { label: '紧急', value: '' },
  { label: '高', value: '' },
  { label: '一般', value: '' },
  { label: '低', value: '' }
] as SelectOption[]
/**
 * 开具工单表单字段
 */
export const IssueColums = [
  {
    type: 'input',
    label: '工单标题',
    key: 'name',
    rules: [{ required: true, message: '请输入' }]
  },
  {
    type: 'input',
    label: '工单类型',
    key: 'type',
    rules: [{ required: true, message: '请选择' }]
  },
  {
    type: 'select',
    label: '优先级',
    key: 'yxj',
    options: YXJOptions,
    rules: [{ required: true, message: '请选择' }]
  },
  {
    type: 'select',
    label: '处理人',
    key: 'chuliren',
    rules: [{ required: true, message: '请选择' }]
  },
  {
    type: 'date',
    label: '截止时间',
    key: 'jiezhishijian',
    rules: [{ required: true, message: '请选择' }]
  }
] as AOUCloumn[]

/**
 * 开具工单字段整理
 * @param params
 * @returns
 */
export const setReportParams = (params: IIssue) => {
  let deviceId = ''
  if (typeof params.deviceId === 'object') {
    deviceId = params.deviceId[params.deviceId.length - 1]
  }
  let projectId = ''
  if (typeof params.projectId === 'object') {
    projectId = params.projectId[params.projectId.length - 1]
  }
  const newparams = {
    type: params.type,
    name: params.name,
    jobList: [
      {
        projectId: projectId,
        deviceId: deviceId,
        imgs: params.imgs,
        remark: params.remark
      }
    ]
  }
  return newparams
}
/**
 * 格式化任务类型
 * @param row
 * @returns
 */
export const formatType = (row: ITableItem) => {
  switch (row.type) {
    case GUDINGRIQIJIHUA:
      return '固定日期任务'
    case YUFANGXINGJIHUA:
      return '预防性任务'
    case CHUFAXINGJIHUA:
      return '触发性任务'
    case GUZHANGBAOXIU:
      return '故障报修任务'
    default:
      return row.type
  }
}
/**
 * 格式化状态
 * @param row
 * @returns
 */
export const formatStatus = (row: ITableItem) => {
  switch (row.status) {
    case TASKSTATUS.WEIKAISHI:
      return '未开始'
    case TASKSTATUS.DAIZHIXING:
      return '待执行'
    case TASKSTATUS.DAIYANSHOU:
      return '待验收'
    case TASKSTATUS.YIWANCHENG:
      return '已完成'
    default:
      return row.status
  }
}
