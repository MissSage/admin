import { ISLFormFieldSet } from '@/components/SLForm'
import { ISLTableColumn, ISLTableConfig } from '@/components/SLTable/type'
import { DateFormatter } from '@/utils/formatter'
import moment from 'moment'

export enum OPERATETYPE {
  /**
   * 抄表数据
   */
  CHAOBIAOSHUJU,
  /**
   * 用户账单
   */
  YONGHUZHANGDAN,
  /**
   * 关阀
   */
  GUANFA,
  /**
   * 开阀
   */
  KAIFA,
  /**
   * 更改表具低值
   */
  GGBJDZ,
  /**
   * 更改上报周期
   */
  GGSBZQ,
  /**
   * 历史指令
   */
  LISHIZHILIN
}
export const formatValveStatus = (val: any) => {
  return val === '0' ? '开' : val === '1' ? '关' : val === '3' ? '异常' : '-'
}
/**
 * 初始化抄表记录table列
 * @returns
 */
export const initCBGLClolumns = (): ISLTableColumn[] => {
  return [
    { minWidth: 150, fixed: true, prop: 'custName', label: '用户姓名' },
    { minWidth: 150, fixed: true, prop: 'custCode', label: '户号' },
    { minWidth: 150, prop: 'money', label: '余额(元)' },
    { minWidth: 150, prop: 'currentRead', label: '当前读数(L)' },
    { minWidth: 180, prop: 'lastTime', label: '上次抄表时间' },
    { minWidth: 150, prop: 'useMoney', label: '消费金额(元)' },
    { minWidth: 220, prop: 'area', label: '区域' },
    { minWidth: 300, prop: 'address', label: '地址' },
    { minWidth: 150, prop: 'meterCode', label: '表具编号' },
    { minWidth: 180, prop: 'installTime', label: '报装时间' },
    {
      minWidth: 150,
      prop: 'valveStatus',
      label: '阀门状态',
      formatter: (row: any, val: any) => formatValveStatus(val)
    },
    { minWidth: 180, prop: 'uploadTime', label: '抄表时间' },
    { minWidth: 150, prop: 'voltage', label: '电池电压(V)' },
    { minWidth: 150, prop: 'waterUseTotal', label: '用水量(m³)' }
  ]
}
/**
 * 初始化弹窗抄表数据table列
 * @returns
 */
export const initCBSJ = (): ISLTableColumn[] => {
  return [
    // { minWidth: 120, label: '上报时间', prop: 'sbjs', fixed: true },
    // { minWidth: 120, label: '表具编号', prop: 'sbjs', fixed: true },
    // { minWidth: 120, label: '当前读数(m³)', prop: 'sbjs' },
    // { minWidth: 120, label: '阀门状态', prop: 'sbjs' },
    // { minWidth: 120, label: '电池电量(mAh)', prop: 'sbjs' },
    // { minWidth: 120, label: '电池电压(V)', prop: 'sbjs' },
    // { minWidth: 120, label: '信号强度', prop: 'sbjs' },
    // { minWidth: 120, label: '信号值', prop: 'sbjs' },
    // { minWidth: 120, label: '传感器', prop: 'sbjs' },
    // { minWidth: 120, label: '上报周期', prop: 'sbjs' },
    // { minWidth: 120, label: '表具时间', prop: 'sbjs' }

    { minWidth: 120, label: '水表编号', prop: 'meterCode' },
    { minWidth: 120, label: '当前读数', prop: 'currentRead' },
    // { minWidth: 120, label: '剩余量', prop: 'currentSurplus' },
    {
      minWidth: 120,
      label: '阀门状态',
      prop: 'valveStatus',
      formatter: (row: any, val: any) => formatValveStatus(val)
    },
    { minWidth: 120, label: '电池电压(V)', prop: 'voltage' },
    { minWidth: 120, label: '抄表时间', prop: 'uploadTime' }
  ]
}
/**
 * 初始化用户账单弹窗Form
 * @param tableConfig
 * @param refreshTable
 * @returns
 */
export const initYHZD = (
  tableConfig: ISLTableConfig,
  refreshTable?: (val: any) => any
): ISLFormFieldSet[] => {
  return [
    {
      flexable: true,
      cols: 3,
      fields: [
        { type: 'text', field: 'custCode', label: '户号：' },
        { type: 'text', field: 'custName', label: '用户姓名：' },
        { type: 'text', field: 'meterCode', label: '水表表号：' },
        { type: 'text', field: 'custType', label: '用户类型：' },
        { type: 'text', field: 'money', label: '账户余额：' },
        { type: 'text', field: 'address', label: '地址：', cols: 2 }
      ]
    },
    {
      fieldset: {
        desc: '月度账单（' + moment().format('YYYY-MM') + '）',
        query: [{ type: 'month', label: '月份', field: 'ydzd' }],
        handleQuery: async (val: any, item: any, column: ISLFormFieldSet) => {
          refreshTable && (await refreshTable(val))
          column.fieldset && (column.fieldset.desc = '月度账单（' + val + '）')
        }
      },
      fields: []
    },
    {
      fields: [
        { type: 'text', label: '月账单总金额：', field: 'moneyTotal' },
        { type: 'text', label: '月用水金额：', field: 'waterMoneyTotal' },
        { type: 'text', label: '月用水量：', field: 'waterUseTotal' },
        { type: 'text', label: '水卡扣费', field: 'cardUseTotal' },
        { type: 'text', label: '余额扣费', field: 'accountUseTotal' }
      ],
      flexable: true,
      cols: 3
    },
    {
      fields: [{ type: 'table', label: '', field: 'dataList', config: tableConfig }]
    }
  ]
}

/**
 * 初始化月度账单弹窗table列
 * @returns
 */
export const initYDZDTableColumn = (): ISLTableColumn[] => {
  return [
    {
      label: '结算时间',
      prop: 'uploadTime',
      formatter: (row: any) => {
        return DateFormatter(row.uploadTime)
      }
    },
    { label: '结算用量(m³)', prop: 'waterUseTotal' },
    { label: '扣费金额(元)', prop: 'useMoney' },
    { label: '水表读数(m³)', prop: 'currentRead' },
    {
      label: '扣费方',
      prop: 'deductionMethod',
      formatter: (row: any, val: any) => {
        return val === '1' ? '水卡扣费' : val === '2' ? '余额扣费' : '-'
      }
    }
  ]
}
/**
 * 初始化历史指令弹窗table列
 * @returns
 */
export const initLSZL = (): ISLTableColumn[] => {
  return [
    { minWidth: 180, label: '指令执行时间', prop: 'ts' },
    { minWidth: 180, label: '指令名称', prop: 'commandType' },
    { minWidth: 180, label: '指令状态', prop: 'result' },
    { minWidth: 180, label: '设备编号', prop: 'meterCode' },
    { minWidth: 180, label: '操作人', prop: 'executor' }
    // { label: '设备ID', prop: 'meterCode' },
    // { label: '更新人', prop: 'executor' },
    // { label: '更新时间', prop: 'executor' }
  ]
}

export const initKGFAColumns = (
  tableConfig: ISLTableConfig,
  toggleValve: (type: number) => any
): ISLFormFieldSet[] => {
  return [
    {
      fieldset: {
        desc: '设备详情',
        right: [
          { perm: true, text: '开 阀', click: () => toggleValve(OPERATETYPE.KAIFA) },
          { perm: true, text: '关 阀', click: () => toggleValve(OPERATETYPE.GUANFA) }
        ]
      },
      fields: []
    },
    {
      flexable: true,
      cols: 3,
      fields: [
        { type: 'text', field: 'meterCode', label: '水表编号：', placeholder: ' ' },
        {
          type: 'text',
          field: 'valveStatus',
          label: '阀门状态：',
          placeholder: ' ',
          formatter: (val: any) => formatValveStatus(val)
        },
        { type: 'text', field: 'voltage', label: '电池电压：', placeholder: ' ', unit: 'V' },
        { type: 'text', field: 'uploadTime', label: '数据更新时间：', placeholder: ' ' }
      ]
    },
    {
      fieldset: {
        desc: '历史指令'
      },
      fields: [
        {
          type: 'table',
          field: 'dataList',
          label: '',
          config: tableConfig
        }
      ]
    }
  ]
}
