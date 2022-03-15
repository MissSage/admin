import { YXJOptions } from '@/views/repair/task'
import {
  CHUFAXINGJIHUA,
  GUDINGRIQIJIHUA,
  GUZHANGBAOXIU,
  YUFANGXINGJIHUA,
  TASKSTATUS
} from '@/common/constans/maintenance'
import { ITableItem } from '@/common/types/maintenance/task'
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
    key: 'deviceId',
    options: YXJOptions,
    rules: [{ required: true, message: '请选择' }]
  },
  {
    type: 'select',
    label: '处理人',
    key: 'imgs',
    rules: [{ required: true, message: '请选择' }]
  },
  {
    type: 'date',
    label: '截止时间',
    key: 'remark',
    rules: [{ required: true, message: '请选择' }]
  }
] as AOUCloumn[]
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
