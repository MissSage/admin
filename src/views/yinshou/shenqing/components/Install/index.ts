import { ISLFormFieldSet } from '@/components/SLForm'
export enum InstallStatus {
  REFUZED = -1,
  OVER,
  DAISHENHE = 1,
  SHANGMENKANCHA,
  DAIJIAOFEI,
  SHANGMENSHIGONG,
  DAIYANSHOU,
  COMPLETE
}
/**
 * 状态 0 待审核  1审核未通过 2审核通过  3勘察未通过  4勘察通过  5缴费未通过  6缴费通过 7施工未完成 8施工已完成 9验收未完成  10 验收已完成 15 结束
 */
export const StatusForSubmit = {
  SHENHE_BUTONGGUO: '1',
  SHENHE_TONGGUO: '2',
  KANCHA_BUTONGGUO: '3',
  KANCHA_TONGGUO: '4',
  JIAOFEI_WEIWANCHENG: '5',
  JIAOFEI_WANCHENG: '6',
  SHIGONG_WEIWANCHENG: '7',
  SHIGONG_WANCHENG: '8',
  YANSHOU_WEIWANCHENG: '9',
  YANSHOU_WANCHENG: '10',
  OVER: '15'
}
/**
 * 通过状态获取步骤
 * @param status
 * @returns
 */
export const GetStepFromStatus = (status?: string) => {
  switch (status) {
    case StatusForSubmit.SHENHE_BUTONGGUO:
      return InstallStatus.REFUZED
    case StatusForSubmit.SHENHE_TONGGUO:
      return InstallStatus.SHANGMENKANCHA
    case StatusForSubmit.KANCHA_BUTONGGUO:
    case StatusForSubmit.OVER:
      return InstallStatus.OVER
    case StatusForSubmit.KANCHA_TONGGUO:
      return InstallStatus.DAIJIAOFEI
    case StatusForSubmit.JIAOFEI_WEIWANCHENG:
      return InstallStatus.DAIJIAOFEI
    case StatusForSubmit.JIAOFEI_WANCHENG:
      return InstallStatus.SHANGMENSHIGONG
    case StatusForSubmit.SHIGONG_WEIWANCHENG:
    case StatusForSubmit.SHIGONG_WANCHENG:
      return InstallStatus.DAIYANSHOU
    case StatusForSubmit.YANSHOU_WEIWANCHENG:
    case StatusForSubmit.YANSHOU_WANCHENG:
      return InstallStatus.COMPLETE
    default:
      return InstallStatus.DAISHENHE
  }
}
export const InstallSteps: SLStep[] = [
  { index: InstallStatus.DAISHENHE, title: '待审核', completeTitle: '审核通过' },
  { index: InstallStatus.SHANGMENKANCHA, title: '上门勘察', completeTitle: '勘察完成' },
  { index: InstallStatus.DAIJIAOFEI, title: '等缴费', completeTitle: '缴费完成' },
  { index: InstallStatus.SHANGMENSHIGONG, title: '上门施工', completeTitle: '施工完成' },
  { index: InstallStatus.DAIYANSHOU, title: '待验收', completeTitle: '已结束' }
]
export const InstallStatusOptions: NormalOption[] = [
  // 状态 0 待审核  1审核未通过 2审核通过  3勘察未通过  4勘察通过  5缴费未通过  6缴费通过 7施工未完成 8施工已完成 9验收未完成  10 验收已完成 15 结束
  { label: '待审核', value: '0' },
  { label: '审核未通过', value: '1' },
  { label: '审核通过', value: '2' },
  { label: '勘察未通过', value: '3' },
  { label: '勘察通过', value: '4' },
  { label: '缴费未通过', value: '5' },
  { label: '缴费通过', value: '6' },
  { label: '施工未完成', value: '7' },
  { label: '施工已完成', value: '8' },
  { label: '验收未完成', value: '9' },
  { label: '验收已完成', value: '10' },
  { label: '结束', value: '15' }
]
export const InstallStatusFormatter = (type: string) => {
  return InstallStatusOptions.find(item => item.value === type)?.label || '-'
}
export const setFormColumns = (status: number, fileUrl?: string): ISLFormFieldSet[] => {
  const columnSHENHE: ISLFormFieldSet[] =
    status >= InstallStatus.DAISHENHE ||
    status === InstallStatus.REFUZED ||
    status === InstallStatus.OVER
      ? [
          {
            fieldset: {
              desc: '申请信息'
            },
            fields: []
          },
          {
            flexable: true,
            cols: 4,
            fields: [
              {
                placeholder: ' ',
                type: 'input',
                disabled: true,
                label: '报装编号：',
                field: 'code'
              },
              {
                placeholder: ' ',
                type: 'input',
                disabled: true,
                label: '申请时间：',
                field: 'applyTime'
              },
              {
                placeholder: ' ',
                type: 'input',
                disabled: true,
                label: '用户名称：',
                field: 'custName'
              },
              {
                placeholder: ' ',
                type: 'input',
                disabled: true,
                label: '联系电话：',
                field: 'tel'
              },
              {
                placeholder: ' ',
                type: 'input',
                disabled: true,
                label: '用水小区：',
                field: 'bookName'
              },
              {
                placeholder: ' ',
                type: 'input',
                disabled: true,
                label: '用水地址：',
                field: 'address'
              },
              {
                placeholder: ' ',
                type: 'input',
                disabled: true,
                label: '身份证号码：',
                field: 'idCardNo'
              },
              {
                placeholder: ' ',
                type: 'textarea',
                disabled: true,
                label: '申请内容：',
                field: 'packageName',
                cols: 1,
                minRow: 4
              }
            ]
          }
        ]
      : []
  const columnKANCHA: ISLFormFieldSet[] =
    status >= InstallStatus.SHANGMENKANCHA || status === InstallStatus.OVER
      ? [
          {
            fieldset: {
              desc: '勘察结果'
            },
            fields: []
          },
          {
            flexable: true,
            cols: 4,
            fields: [
              {
                placeholder:
                  status > InstallStatus.SHANGMENKANCHA || status < InstallStatus.DAISHENHE
                    ? ' '
                    : '',
                disabled:
                  status > InstallStatus.SHANGMENKANCHA || status < InstallStatus.DAISHENHE
                    ? true
                    : false,
                type: 'radio',
                label: '能否施工：',
                field: 'kancha_status',
                options: [
                  { label: '能', value: '1' },
                  { label: '不能', value: '0' }
                ]
              },
              {
                placeholder:
                  status > InstallStatus.SHANGMENKANCHA || status < InstallStatus.DAISHENHE
                    ? ' '
                    : '',
                disabled:
                  status > InstallStatus.SHANGMENKANCHA || status < InstallStatus.DAISHENHE
                    ? true
                    : false,
                type: 'input',
                label: '勘察人：',
                field: 'kancha_person'
              },
              {
                placeholder:
                  status > InstallStatus.SHANGMENKANCHA || status < InstallStatus.DAISHENHE
                    ? ' '
                    : '',
                disabled:
                  status > InstallStatus.SHANGMENKANCHA || status < InstallStatus.DAISHENHE
                    ? true
                    : false,
                type: 'datetime',
                label: '勘察时间：',
                field: 'kancha_time'
              },
              {
                placeholder:
                  status > InstallStatus.SHANGMENKANCHA || status < InstallStatus.DAISHENHE
                    ? ' '
                    : '',
                disabled:
                  status > InstallStatus.SHANGMENKANCHA || status < InstallStatus.DAISHENHE
                    ? true
                    : false,
                type: 'input-number',
                label: '其他费用：',
                field: 'kancha_otherCost',
                unit: '元'
              },
              {
                placeholder:
                  status > InstallStatus.SHANGMENKANCHA || status < InstallStatus.DAISHENHE
                    ? ' '
                    : '',
                disabled:
                  status > InstallStatus.SHANGMENKANCHA || status < InstallStatus.DAISHENHE
                    ? true
                    : false,
                type: 'textarea',
                label: '勘察反馈：',
                field: 'kancha_remark',
                cols: 2,
                minRow: 4
              },
              {
                placeholder:
                  status > InstallStatus.SHANGMENKANCHA || status < InstallStatus.DAISHENHE
                    ? ' '
                    : '',
                disabled:
                  status > InstallStatus.SHANGMENKANCHA || status < InstallStatus.DAISHENHE
                    ? true
                    : false,
                type: 'image',
                label: status === InstallStatus.SHANGMENKANCHA ? '上传图片：' : '现场图片：',
                field: 'kancha_img',
                returnType: 'arrStr'
              },
              {
                placeholder:
                  status > InstallStatus.SHANGMENKANCHA || status < InstallStatus.DAISHENHE
                    ? ' '
                    : '',
                disabled:
                  status > InstallStatus.SHANGMENKANCHA || status < InstallStatus.DAISHENHE
                    ? true
                    : false,
                type: 'file',
                label: status === InstallStatus.SHANGMENKANCHA ? '上传相关文件：' : '相关文件：',
                field: 'kancha_file',
                returnType: 'arrStr'
                // url: fileUrl
              },
              {
                placeholder: status > InstallStatus.SHANGMENKANCHA ? ' ' : '',
                disabled: status > InstallStatus.SHANGMENKANCHA ? true : false,
                type: 'input',
                label: '用户编号：',
                field: 'kancha_custId'
              },
              {
                disabled: status > InstallStatus.SHANGMENKANCHA ? true : false,
                placeholder: status > InstallStatus.SHANGMENKANCHA ? ' ' : '',
                type: 'input',
                label: '用户名称',
                field: 'kancha_newName'
              }
            ]
          }
        ]
      : []
  const columnJIAOFEI: ISLFormFieldSet[] =
    status >= InstallStatus.DAIJIAOFEI
      ? [
          {
            fieldset: {
              desc: '缴费结果'
            },
            fields: []
          },
          {
            flexable: true,
            cols: 4,
            fields: [
              {
                placeholder: status > InstallStatus.DAIJIAOFEI ? ' ' : '',
                disabled: true,
                type: 'radio',
                label: '是否缴费：',
                field: 'jiaofei_status',
                options: [
                  { label: '是', value: '1' },
                  { label: '否', value: '0' }
                ]
              },
              {
                placeholder: ' ',
                disabled: true,
                type: 'datetime',
                label: '缴费时间',
                field: 'jiaofei_time'
              }
            ]
          }
        ]
      : []
  const columnSHIGONG: ISLFormFieldSet[] =
    status >= InstallStatus.SHANGMENSHIGONG
      ? [
          {
            fieldset: {
              desc: '施工结果'
            },
            fields: []
          },
          {
            flexable: true,
            cols: 4,
            fields: [
              {
                placeholder: status > InstallStatus.SHANGMENSHIGONG ? ' ' : '',
                disabled: status > InstallStatus.SHANGMENSHIGONG ? true : false,
                type: 'radio',
                label: '是否完成：',
                field: 'shigong_status',
                options: [
                  { label: '是', value: '1' },
                  { label: '否', value: '0' }
                ]
              },
              {
                placeholder: status > InstallStatus.SHANGMENSHIGONG ? ' ' : '',
                disabled: status > InstallStatus.SHANGMENSHIGONG ? true : false,
                type: 'input',
                label: '施工人：',
                field: 'shigong_person'
              },
              {
                placeholder: status > InstallStatus.SHANGMENSHIGONG ? ' ' : '',
                disabled: status > InstallStatus.SHANGMENSHIGONG ? true : false,
                type: 'datetime',
                label: '施工日期：',
                field: 'shigong_time'
              },
              {
                placeholder: status > InstallStatus.SHANGMENSHIGONG ? ' ' : '',
                disabled: status > InstallStatus.SHANGMENSHIGONG ? true : false,
                type: 'textarea',
                label: '施工反馈：',
                field: 'shigong_remark',
                minRow: 4,
                cols: 2
              },
              {
                placeholder: status > InstallStatus.SHANGMENSHIGONG ? ' ' : '',
                disabled: status > InstallStatus.SHANGMENSHIGONG ? true : false,
                type: 'image',
                returnType: 'arrStr',
                label: status === InstallStatus.SHANGMENSHIGONG ? '上传图片：' : '现场图片：',
                field: 'shigong_img'
              }
            ]
          }
        ]
      : []
  const columnYANSHOU: ISLFormFieldSet[] =
    status >= InstallStatus.DAIYANSHOU
      ? [
          {
            fieldset: {
              desc: '审核结果'
            },
            fields: []
          },
          {
            flexable: true,
            cols: 4,
            fields: [
              {
                placeholder: status > InstallStatus.DAIYANSHOU ? ' ' : '',
                disabled: status > InstallStatus.DAIYANSHOU ? true : false,
                type: 'radio',
                label: '是否完成：',
                field: 'yanshou_status',
                options: [
                  { label: '是', value: '10' },
                  { label: '否', value: '9' }
                ]
              },
              {
                hidden: status <= InstallStatus.DAIYANSHOU ? true : false,
                placeholder: ' ',
                disabled: true,
                type: 'input',
                label: '审核人：',
                field: 'examPerson'
              },
              {
                hidden: status <= InstallStatus.DAIYANSHOU ? true : false,
                placeholder: ' ',
                disabled: true,
                type: 'datetime',
                label: '审核时间：',
                field: 'examTime'
              }
            ]
          }
        ]
      : []
  return [...columnSHENHE, ...columnKANCHA, ...columnJIAOFEI, ...columnSHIGONG, ...columnYANSHOU]
}
