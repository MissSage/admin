import { ISLFormFieldSet } from '@/components/SLForm'

export const ComplaintsStatus = {
  DAIHUIFU: '0',
  COMPLETE: '1',
  OMITED: '2'
}
export const formatComplaintsStatus = (val: string) => {
  return val === '0' ? '待回复' : val === '1' ? '已回复' : val === '3' ? '已忽略' : '-'
}
export const setFormColumns = (status?: string): ISLFormFieldSet[] => {
  const columnDAIHUIFU: ISLFormFieldSet[] = [
    {
      fieldset: {
        desc: '投诉建议'
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
          label: '投诉编号：'
        },
        {
          disabled: true,
          placeholder: ' ',
          type: 'input',
          field: 'createTime',
          label: '投诉时间：'
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
          cols: 2
        },
        {
          disabled: true,
          placeholder: ' ',
          type: 'textarea',
          field: 'remark',
          label: '投诉内容：',
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
  const cloumnCOMPLETE: ISLFormFieldSet[] = [
    {
      fieldset: {
        desc: '回复'
      },
      fields: [
        {
          type: 'textarea',
          label: '回复内容：',
          field: 'reply',
          minRow: 4,
          placeholder: ' ',
          disabled: status === ComplaintsStatus.COMPLETE || status === ComplaintsStatus.OMITED
        }
      ]
    }
  ]
  return [...columnDAIHUIFU, ...cloumnCOMPLETE]
}
