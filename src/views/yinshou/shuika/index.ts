import { ISLFormFieldSet } from '@/components/SLForm'
import { ISLFormItem } from '@/components/SLFormItem/type'
import { ISLTableColumn } from '@/components/SLTable/type'
export enum OPERATES {
  NONE = 0,
  ADD,
  EDIT,
  BIND,
  START,
  BILL,
  DELETE,
  DETAIL
}
export const SHUIKASTATUS = {
  NOBIND: '0',
  NOSTART: '1',
  STARTED: '2',
  INVALID: '3'
}
export const initAOUColumns = (type: number): ISLFormFieldSet[] => {
  const EditColumns: ISLFormItem[] =
    type === OPERATES.ADD ? [] : [{ type: 'datetime', label: '启用日期：', field: 'enableTime' }]
  return [
    {
      fields: [
        {
          type: 'input-number',
          label: '有效时长：',
          unit: '天',
          field: 'validityPeriod',
          rules: [{ required: true, message: '请输入有效时长' }]
        },
        { type: 'textarea', label: '备注：', field: 'remark', minRow: 4 },
        // {
        //   type: 'input',
        //   label: '绑定用户：',
        //   field: 'custCode'
        //   // multiple: false
        // },
        ...EditColumns
      ]
    }
  ]
}

export const initBindTableColumns = (): ISLTableColumn[] => {
  return [
    { label: '区域名', prop: 'field1' },
    { label: '用户姓名', prop: 'field2' },
    { label: '用户电话', prop: 'field3' },
    { label: '用户地址', prop: 'field4' },
    { label: '启用状态', prop: 'field5' }
  ]
}
/**
 * 初始化用户账单的table列
 * @returns
 */
export const initYSZDTableColumns = (): ISLTableColumn[] => {
  return [
    { label: '户号', prop: 'field1' },
    { label: '户名', prop: 'field2' },
    { label: '结算时间', prop: 'field3' },
    { label: '结算用量(m³)', prop: 'field4' },
    { label: '账单金额(元)', prop: 'field5' }
  ]
}
/**
 * 初始化用户信息table列
 */
export const initUserInfoColumns = (): ISLTableColumn[] => {
  return [
    { label: '水卡编号', prop: 'code' },
    { label: '状态', prop: 'status', formatter: (row: any, val: any) => formatShuikaStatus(val) },
    { label: '启用时间', prop: 'enableTime' },
    { label: '过期时间', prop: 'expiredTime' },
    { label: '剩余有效时长(天)', prop: 'validityPeriod' }
    // { label: '累积用水量(m³)', prop: '' }
  ]
}

/**
 * 格式化水卡的状态
 * @param val
 * @returns
 */
export const formatShuikaStatus = (val: any) => {
  return val === '0'
    ? '未绑定'
    : val === '1'
    ? '已绑定 、 未启用'
    : val === '2'
    ? '已启用'
    : val === '3'
    ? '过期'
    : '-'
}
