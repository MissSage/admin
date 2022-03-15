import { ISLFormFieldSet } from '@/components/SLForm'

export enum LeakStatus {
  REFUZED = 0,
  DAISHENHE,
  SHANGMENWEIXIU,
  DAIYANSHOU,
  COMPLETE
}
export const StatusForSubmit = {
  SHENHE_BUTONGGUO: '1',
  SHENHE_TONGGUO: '2',
  WEIXIU_WEIWANCHENG:'3',
  WEIXIU_WANCHENG: '4',
  YANSHOU_WANCHENG: '9',
  YANSHOU_BUWANCHENG: '10'
}
export const GetStepFromStatus = (status?: string) => {
  switch (status) {
    case StatusForSubmit.SHENHE_BUTONGGUO:
      return LeakStatus.REFUZED
    case StatusForSubmit.SHENHE_TONGGUO:
      return LeakStatus.SHANGMENWEIXIU
    case StatusForSubmit.WEIXIU_WANCHENG:
    case StatusForSubmit.YANSHOU_BUWANCHENG:
      return LeakStatus.DAIYANSHOU
    case StatusForSubmit.YANSHOU_WANCHENG:
      return LeakStatus.COMPLETE
    default:
      return LeakStatus.DAISHENHE
  }
}
export const LeakApplySteps: SLStep[] = [
  { index: LeakStatus.DAISHENHE, title: '待审核', completeTitle: '审核通过' },
  { index: LeakStatus.SHANGMENWEIXIU, title: '上门维修', completeTitle: '维修完成' },
  { index: LeakStatus.DAIYANSHOU, title: '待验收', completeTitle: '已结束' }
]
export const LeakStatusOptions: NormalOption[] = [
  // 状态 0 待审核  1审核未通过 2审核通过  3勘察未通过  4勘察通过  5缴费未通过  6缴费通过 7施工未完成 8施工已完成 9验收未完成  10 验收已完成 15 结束
  { label: '待审核', value: '0' },
  { label: '审核未通过', value: '1' },
  { label: '审核通过', value: '2' },
  { label: '维修未完成', value: '3' },
  { label: '维修完成', value: '4' },
  { label: '验收完成', value: '9' },
  { label: '验收未完成', value: '10' }
]
export const LeakStatusFormatter = (type: string) => {
  return LeakStatusOptions.find(item => item.value === type)?.label || '-'
}
export const setFormColumns = (status: number): ISLFormFieldSet[] => {
  const columnSHENGHE: ISLFormFieldSet[] =
    status >= LeakStatus.DAISHENHE || status === LeakStatus.REFUZED
      ? [
          {
            fieldset: {
              desc: '报修信息'
            },
            fields: []
          },
          {
            flexable: true,
            cols: 4,
            fields: [
              {
                disabled: true,
                placeholder: ' ',
                type: 'input',
                field: 'code',
                label: '维修编号：'
              },
              {
                disabled: true,
                placeholder: ' ',
                type: 'datetime',
                field: 'applyTime',
                label: '申请时间：'
              },
              {
                disabled: true,
                placeholder: ' ',
                type: 'input',
                field: 'custName',
                label: '用户名称：'
              },
              {
                disabled: true,
                placeholder: ' ',
                type: 'input',
                field: 'custId',
                label: '用户编号：'
              },
              {
                disabled: true,
                placeholder: ' ',
                type: 'input',
                field: 'tel',
                label: '联系电话：'
              },
              {
                disabled: true,
                placeholder: ' ',
                type: 'input',
                field: 'address',
                label: '地址：',
                cols: 3
              },
              {
                disabled: true,
                placeholder: ' ',
                type: 'textarea',
                field: 'remark',
                label: '报修原因：',
                cols: 2,
                minRow: 4
              },
              {
                disabled: true,
                placeholder: ' ',
                type: 'image',
                field: 'img',
                label: '图片：',
                cols: 2
              }
            ]
          }
        ]
      : []
  const columnSHANGMENWEIXIU: ISLFormFieldSet[] =
    status >= LeakStatus.SHANGMENWEIXIU
      ? [
          {
            fieldset: {
              desc: '维修结果'
            },
            fields: []
          },
          {
            flexable: true,
            cols: 4,
            fields: [
              {
                disabled: status > LeakStatus.SHANGMENWEIXIU || status < LeakStatus.DAISHENHE,
                placeholder: status > LeakStatus.SHANGMENWEIXIU ? ' ' : '',
                type: 'radio',
                label: '是否完成：',
                field: 'repaire_status',
                options: [
                  { label: '是', value: '1' },
                  { label: '否', value: '0' }
                ]
              },
              {
                disabled: status > LeakStatus.SHANGMENWEIXIU || status < LeakStatus.DAISHENHE,
                placeholder: status > LeakStatus.SHANGMENWEIXIU ? ' ' : '',
                type: 'input',
                label: '维修人：',
                field: 'repaire_person'
              },
              {
                disabled: status > LeakStatus.SHANGMENWEIXIU || status < LeakStatus.DAISHENHE,
                placeholder: status > LeakStatus.SHANGMENWEIXIU ? ' ' : '',
                type: 'datetime',
                label: '维修时间：',
                field: 'repaire_time'
              },
              {
                disabled: status > LeakStatus.SHANGMENWEIXIU || status < LeakStatus.DAISHENHE,
                placeholder: status > LeakStatus.SHANGMENWEIXIU ? ' ' : '',
                type: 'input-number',
                unit:'元',
                label: '其他费用：',
                field: 'repaire_otherCost'
              },
              {
                disabled: status > LeakStatus.SHANGMENWEIXIU || status < LeakStatus.DAISHENHE,
                placeholder: status > LeakStatus.SHANGMENWEIXIU ? ' ' : '',
                type: 'textarea',
                label: '维修反馈：',
                field: 'repaire_remark',
                minRow: 4,
                cols: 2
              },
              {
                disabled: status > LeakStatus.SHANGMENWEIXIU || status < LeakStatus.DAISHENHE,
                placeholder: status > LeakStatus.SHANGMENWEIXIU ? ' ' : '',
                type: 'image',
                label: status === LeakStatus.SHANGMENWEIXIU ? '上传图片：' : '维修图片：',
                field: 'repaire_img',
                cols: 2,
                returnType:'arrStr'
              }
            ]
          }
        ]
      : []
  return [...columnSHENGHE, ...columnSHANGMENWEIXIU]
}
