import { FileItem, NormalOption } from '@/common/types/common'
import { IOrderStatusOptions, ITreeNode, IWorkOrder } from '@/common/types/workorder'
import { SLStep } from '@/components/SLSteps/type'
import { DateFormatter } from '@/utils/formatter'
export const initOrderFormColums = (): any[] => {
  return [
    {
      type: 'input',
      label: '工单标题',
      key: 'name',
      rules: [{ required: true, message: '请填写工单标题' }]
    },
    {
      type: 'select',
      label: '工单类型',
      key: 'type',
      options: [
        { label: '维修', value: '1' },
        { label: '保养', value: '2' },
        { label: '其它', value: '0' }
      ],
      rules: [{ required: true, trigger: 'change', message: '请选择工单类型' }]
    },
    {
      type: 'select',
      label: '优先级',
      key: 'priority',
      options: [
        { label: '低', value: '1' },
        { label: '一般', value: '2' },
        { label: '高', value: '3' },
        { label: '紧急', value: '4' }
      ],
      rules: [{ required: true, trigger: 'change', message: '请选择优先级' }]
    },
    {
      type: 'select',
      label: '维修任务',
      key: 'contentId',
      options: [],
      rules: [{ required: true, trigger: 'change', message: '请选择维修任务' }]
    },
    {
      type: 'radio',
      label: '是否外委',
      key: 'isOutsider',
      options: [
        { label: '是', value: 'true' },
        { label: '否', value: 'false' }
      ]
    },
    {
      type: 'select',
      label: '处理人',
      key: 'executor',
      rules: [{ required: true, message: '请选择处理人' }]
    },
    {
      type: 'date',
      label: '截止时间',
      key: 'deadlineTime',
      rules: [{ required: true, message: '请选择截止时间' }]
    }
  ] as any[]
}
export const OrderTypes = {
  REPAIRE: '1',
  MAINTAIN: '2',
  OTHER: '0'
}
export const orderTypeOptions = [
  { label: '维修', value: OrderTypes.REPAIRE },
  { label: '保养', value: OrderTypes.MAINTAIN },
  { label: '其它', value: OrderTypes.OTHER }
]

export const formateType = (val: string | undefined) => {
  const type = orderTypeOptions.find(item => item.value === val)
  return (type ? type.label + '类型' : '') + '工单'
}
export const tagtypes = [
  { value: '#c27133', label: OrderTypes.REPAIRE },
  { value: '#2e9cd3', label: OrderTypes.MAINTAIN },
  { value: '#28a196', label: OrderTypes.OTHER }
]
export const formateTypeColor = (val: string | undefined) => {
  const type = tagtypes.find(item => item.label === val)
  return type ? type.value : ''
}
export const priorityLevels = {
  LOW: '1',
  NORMAL: '2',
  HIGH: '3',
  URGEN: '4'
}
export const priorityOptions = [
  { label: '低', value: priorityLevels.LOW },
  { label: '一般', value: priorityLevels.NORMAL },
  { label: '高', value: priorityLevels.HIGH },
  { label: '紧急', value: priorityLevels.URGEN }
]
export const priorityColors = [
  { label: priorityLevels.LOW, value: '#63b0f6' },
  { label: priorityLevels.NORMAL, value: '#a1f663' },
  { label: priorityLevels.HIGH, value: '#f6d163' },
  { label: priorityLevels.URGEN, value: '#f67b63' }
]
export const formatePriorityColor = (val: string) => {
  const pri = priorityColors.find(item => item.label === val)
  return pri ? pri.value : 'white'
}
export const isOutsiderOptions = [
  { label: '是', value: 'true' },
  { label: '否', value: 'false' }
]
export const devStatusOptions = [
  { label: '无异常', value: '0' },
  { label: '有异常', value: '1' }
]
export const isEndOptions = [
  { label: '是', value: 'true' },
  { label: '否', value: 'false' }
]
export const chartDataTypes = [
  { label: '类型', value: '1' },
  { label: '优先级', value: '2' }
]
export const createTimeOptions = [
  { label: '最近24小时', value: '24h', unit: 'hours' },
  // { label: '最近三天', value: '3d',unit:'days' },
  { label: '最近七天', value: '7d', unit: 'days' },
  { label: '最近一个月', value: '1m', unit: 'months' },
  // { label: '最近三个月', value: '3m',unit:'months' },
  { label: '最近半年', value: '6m', unit: 'months' },
  { label: '最近一年', value: '1y', unit: 'year' }
]

/**
 * 工单状态
 */
export const Status: IOrderStatusOptions = {
  DISCOMFIRMED: '-1', // 已拒单
  COMFIRMING: '1', // 等待接单,待处理状态
  DEALING: '2', // 已接单，处理中
  // 'DEALED':'2' // 处理中
  ACCEPTING: '3', // 待验收
  ACCEPTED: '4', // 已验收，已完成状态
  TIMEOUTED: '5' // 超时
}
export const StatusColor = [
  { label: Status.DISCOMFIRMED, value: '#a86722' },
  { label: Status.TIMEOUTED, value: '#a82222' },
  { label: Status.ACCEPTED, value: '#a8226e' },
  { label: Status.ACCEPTING, value: '#2256a8' },
  { label: Status.DEALING, value: '#22a87e' },
  { label: Status.COMFIRMING, value: '#94a822' }
]
export const statusOptions: NormalOption[] = [
  { label: '待处理', value: Status.COMFIRMING },
  { label: '处理中', value: Status.DEALING },
  { label: '待验收', value: Status.ACCEPTING },
  { label: '已完成', value: Status.ACCEPTED },
  { label: '已超时', value: Status.TIMEOUTED },
  { label: '被拒单', value: Status.DISCOMFIRMED }
]
export const formateStatusColor = (val: string | undefined) => {
  const colorObj = StatusColor.find(item => item.label === val)
  return colorObj ? colorObj.value : 'white'
}
/**
 * 状态转数字
 * @param status 工单状态
 * @returns number -1~5
 */
export const statusToNumber = (status?: string) => {
  return status ? Number(status) : 1
}
export const formateSteps = (): SLStep[] => {
  return statusOptions
    .filter(item => item.value !== Status.TIMEOUTED && item.value !== Status.DISCOMFIRMED)
    .map(item => {
      const obj: SLStep = {
        index: statusToNumber(item.value.toString()),
        title: item.label
      }
      return obj
    })
}
export const formateRowStatus = (row: IWorkOrder) => {
  const value = row.status || ''
  const option = statusOptions.find(item => item.value === value)
  return option ? option.label : value
}

export const formateStatus = (val: string) => {
  const status = statusOptions.find(item => item.value === val)
  return status ? status.label : ''
}
export const formateRowPriority = (row: IWorkOrder) => {
  const priority = row.priority || ''
  const priorityOption = priorityOptions.find(item => item.value === priority)
  return priorityOption ? priorityOption.label : priority
}
export const formateRowOrderType = (row: IWorkOrder) => {
  const type = row.type || ''
  const typeOption = orderTypeOptions.find(item => item.value === type)
  return typeOption ? typeOption.label : type
}

export const formateRowIsOutsider = (row: IWorkOrder) => {
  const value = row.isOutsider || ''
  const option = isOutsiderOptions.find(item => item.value === value)
  return option ? option.label : value
}
export const formateDevStatus = (val: string) => {
  const option = devStatusOptions.find(item => item.value === val)
  return option ? option.label : val
}
export const initTreeData: ITreeNode[] = [
  {
    id: '1',
    leaf: true,
    name: '所有工单',
    parentId: '0'
  },
  {
    id: '2',
    leaf: true,
    name: '我处理的',
    parentId: '0'
  },
  {
    id: '3',
    name: '我发布的',
    leaf: true,
    parentId: '0'
  },
  {
    id: '4',
    name: '我关注的',
    leaf: true,
    parentId: '0'
  }
]
export const initInnerUser = (users: any) => {
  return users.map((item: { firstName: any; id: { id: any } }) => {
    const user = {
      label: item.firstName,
      value: item.id.id
    }
    return user
  })
}

export const formatDate = (date: any) => {
  return DateFormatter(date)
}
export const formatRowDate = (row: any, key: string) => {
  return DateFormatter(row[key])
}

// 饼图相关
export const formatChartDataType = (type: string) => {
  const obj = chartDataTypes.find(item => item.value === type)
  return obj ? obj.label : type
}
const img =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMYAAADGCAYAAACJm/9dAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAE/9JREFUeJztnXmQVeWZxn/dIA2UgsriGmNNrEQNTqSio0IEFXeFkqi4kpngEhXjqMm4MIldkrE1bnGIMmPcUkOiIi6gJIragLKI0Songo5ZJlHGFTADaoRuhZ4/nnPmnO4+l+7bfc85d3l+VV18373n3Ptyvve53/5+da1L6jDdYjgwBhgNHALMBn6Sq0VdcxlwGvACsAx4HliTq0VlRlNzY+LrfTO2o5LoDxwOHAmMA/4WiP+KzM3DqCJpAA4K/i4F2oBXgWbgWWAxsDEv48oZC6M9Q4EJwInAMcDAfM0pOXXA14K/y4FPgQXAfOBxYF1+ppUXFgYMBiYCp6PaoU+B694HFqEmyVJgVSbW9Y6bgCeBb6Am4GHALrH3B6L/+0RgM6pFHgQeAzZkaWi5UVejfYx64AjgXOAk1OToSCtqajyFHGZlVsalzH7oB+BYJJR+Cde0oKbi3cBCYEtWxmVNoT5GrQljGHAecD7wxYT3P0bNirlIEB9lZ1ouDEICOQk1H7dLuOYt4C7gZ8Da7EzLhloXxv7AJcCZdK4dWpAIHkDt7FrtjA5A/aszkFiSntP9wAzgP7M1LT0KCaM+YzuyZixy+leAb9O+sN9AHdDd0S/mbGpXFKD/+2z0LHZHz+aN2PsN6Bm+gjrsY7M2MEuqVRhHoU7yYjS6FPI5MAc4FNgHzUN4JKYz69Cz2Qc9qzno2YUcjZ7t8iBddVSbMEYDzwFPA6Nir28Afgx8CZiERpVM91iKntnfoGcYH606BNUez6GRr6qhWoSxF/AoKsQxsdfXAj9AHe2rgNXZm1Y1/A96hl8E/pn2HfExwBJUBntlb1rpqXRhbA/cDLyGxuJDPgSuBPYErqPGx+RLzAagCT3bK9GzDpmIyuJmVDYVS6UKow74e+APwPeIxuI/AX6Emkw3opldkw6fome8F3rmnwSv90Nl8gdURhU57FmJwtgHdfx+jpZwgCag7gW+DFyDa4gsWY+e+ZdRGYSTgUNRGS1GZVZRVJIwtgF+iMbQ4/2IF4ADgHOA93Kwy4j3UBkcgMokZAwqsx+iMqwIKkUYI4AXgelEzab1wAVoNOSVnOwynXkFlckFqIxAZTYdleGInOwqinIXRh1wMfASMDL2+hxgb+BOqngdTwWzBZXN3qisQkaisryYMu97lLMwhgHzgJ+ivRGgIcJJwd8HOdllus8HROUVDu/2R2U6D5VxWVKuwjgEVcnjY689jqrhOYl3mHJmDiq7x2OvjUdlfEguFnVBOQrju2gmdbcgvwmYitbweFtm5bIGleFUVKagMn4OlXlZUU7C6A/MQqs3w9GLN4ADgZloW6apbNpQWR5ItEBxG1Tms4iazLlTLsLYCW2IOTv22iNor3Il7JQzxbEKle0jsdfORj6wUy4WdaAchDEC+A1RW3MzcAVwKtW/UaiW+QiV8RWozEE+8Bu0yzBX8hbGwaiNuUeQ/xi1Q2/CTadaoA2V9Umo7EG+8Dw57/fIUxhHAs8AOwb5t9Cy8fm5WWTyYj4q+7eC/PZoOfspeRmUlzBOBn4FbBvkX0XVaLUEHDDFsxL5wG+DfAOKWHJOHsbkIYwpaAtluLRjEdol5nVO5j20tmpRkO+DAjFclLUhWQvjUhSSJYzdNA84DneyTcRHyCfmBfk64HYUbjQzshTGVOBWojUys9GoREuGNpjKoAX5xuwgXwfcQoY1R1bCmILWx4SimAWcBXyW0febyuMz5COzgnxYc0zJ4suzEMZEFKwrFMVDKAzL5oJ3GCM2I195KMjXIV86Ke0vTlsYR6CRhbBPMReYjEVhus9mNCseRpfvg5pYR6T5pWkKYz8UNSIcfVqIzmpoTfE7TXXyGfKdhUG+H/Kt1GbI0xLGMODXKJI4aIz6m1gUpue0Ih8Kw4MORj6Wyp6ONITRADyBwjyC4hEdjwMUmN6zAUU+fDPI7458LSlafa9IQxh3oZWToP/ICcDbKXyPqU3WouDT4Q/tQcjnSkqphXEJ6lyDOk2T8TIPU3pW0n4QZzLyvZJRSmGMQislQ65C1ZwxafAEioQYchPt4xX3ilIJYygaaw5HoB5BM5XGpMmtwMNBuh/ywaGFL+8+pRBGHYpAF+7R/h2anfR+CpM2bWj1bbhNdjfki70OzVMKYVxEFM1jE955Z7Il3AkYHvoznhKsqeqtML6KIluHfB93tk32rEK+F3Iz8s0e0xth9EXVVhjZ4QkUAcKYPPg3orhV/YH76MVx3b0RxhXA3wXpdehoYPcrTF60oRN5w6PjDkQ+2iN6Kox9UOj3kAtxMDSTP2uQL4ZcA+zbkw/qiTDqULUVTsM/RDRkZkzePEy0TL0B+WrRo1Q9Eca3iEKbrKfEM47GlIBLgP8N0mPQyU5FUawwdqDz7Lajjpty4wPg6lj+RqIwTd2iWGE0Ei3zXUEKi7eMKRF3IR8F+ew1W7m2E8UI4ytEEydbUIRqH9piypWOPnoR8uFuUYwwbiKKQj4LeLmIe43Jg5eJgilsQ/tuwFbprjBGEy37+IT27TdjypmriY5aHo/OB+yS7grjulj6JzhqoKkc3gNui+X/pTs3dUcYRxMNz/4FLyc3lcfNyHdBvnxMVzd0RxiNsfQNeO+2qTw2IN8N6XKEqithjCXaFbUWuKNndhmTOzOJ1lGNoovzN7oSxrRY+jbg057bZUyu/BX1j0OmFboQti6Mkah/AVr64SXlptKZiXwZ5NsjC124NWFcGkvfHftAYyqV9bRfrXFpoQvrWpckLjwcigKl9Qc+B74ErC6hgcbkxR7Af6NNTK3Abk3Njes6XlSoxvgO0c68R7EoTPWwGvk0KLLIBUkXJQmjHu3GC5lRWruMyZ24T58zbdy1nXSQJIxxwJ5B+nVgWentMiZXliHfBvn6kR0vSBJG/JTMu0tvkzFlQdy3O53S1LHzPRht8mhA56DtTjQpYkw1MQR4h8jXd25qbvz/kdeONcZEor3cT2FRmOrlQ3S+Bsjn2x1f1lEYZ8TSD6RolDHlwP2x9JnxN+JNqWHAu2h892NgZ7wExFQ3A4H3ge3QkQK7NjU3roH2NcaJRJHb5mNRmOrnU+TroEMvw8147YQxIZaeizG1QdzXTwwTYVNqAOpoD0Q99GGoOWVMtTMIRTBsQBHThzQ1N24Ma4zDkCgAFmNRmBqhqbnxI+C5IDsAOByiplR85m9BhnYZUw48FUsfCcnCeCYzc4wpD+I+Pw7UxxiOhqzq0HDtbgk3GlOVNDUrpMG0cde+A+yKjhPYuR7F2QknM57PxTpj8ifsZ9QBh9ajYGohS7O3x5iyIL6KfFQ9cHDsBQvD1Cpx3z+4LzAHnV3Whg75M6YWWQVciZpSrYX2fBtTE4Sd746U4pxvY6oOC8OYBCwMYxKwMIxJwMIwJgELw5gELAxjErAwjEnAwjAmAQvDmAQsDGMSsDCMScDCMCYBC8OYBCwMYxKwMIxJwMIwJgELw5gELAxjErAwjEnAwjAmAQvDmAQsDGMSsDCMScDCMCYBC8OYBCwMYxKwMIxJwMIwJgELw5gELAxjErAwjEnAwjAmAQvDmAQsDGMSsDCMScDCMCYBC8OYBCwMYxLoC1wKNABtwC3A5lwtMiYHpo27tg/wPaAOaO0LnAqMCt5fAPw2J9uMyZMRwI+D9PJ6YEXszW9kb48xZUHc91fUA8sKvGlMLTE6ll5eDyxF/QuAMdnbY0xZMDb4tw1YUg+sAVYGL+6K2lrG1AzTxl07Avk+wMqm5sY14XBtc+y6o7I1y5jcift8M0TzGM/E3jgmM3OMKQ+OjaWfBahrXVIHMABYBwwEWoBhwMdZW2dMDgxC3YkGYCMwpKm5cWNYY2wEng7SDcBx2dtnTC4ci3weYEFTc+NGaL8k5IlY+qSsrDImZ+K+/qsw0VEYnwfpE1GzyphqZgDyddBSqMfDN+LCWAssCtLbAeMzMc2Y/DgB+TrAwqbmxjXhGx1X194fS5+WtlXG5MyZsfQD8Tc6CmMuGpUCOB4YkqJRxuTJEOTjIJ9/LP5mR2GsR+IA9dS/lappxuTHZKLRqLlNzY3r428mbVS6N5Y+Ny2rjMmZuG/f2/HNJGE8C7wZpPel/apDY6qB0cBXg/SbBLPdcZKEsQW4J5a/pORmGZMvcZ++p6m5cUvHCwrt+f53ok74N4E9SmyYMXmxB/JpgFbk650oJIx1wOwg3Rf4bklNMyY/LkY+DfBgU3PjuqSLthYl5LZY+lxg+xIZZkxeDAbOi+VvK3Th1oTxCtHCwu2BC3tvlzG5chHRD/wzyMcT6SquVFMsfRleP2Uql4HIh0Ou39rFXQnjOWB5kB4GTO25XcbkylTkwyCfXrSVa7sViXB6LH0VaqcZU0kMRr4b8qOubuiOMBagmgNgR+Dy4u0yJle+j3wX5MtPdXVDd2PX/iCWvhzYpTi7jMmNXVAY2pAfFLowTneFsZRoh9+2dNFxMaaMuB75LMiHl3bnpmKinf8T8FmQngwcUMS9xuTBAchXQb57RXdvLEYYvwNmxu77aZH3G5MlHX10JvBGMTcXw3S0BRbgYNrPIhpTTpyHfBS0xGn6Vq7tRLHC+AtqUoVcD+xU5GcYkzbDad8PvgL5brfpSVPoP4iGb3cA/rUHn2FMmsxAvgnwPPDzYj+gJ8JoQ+umwmXppwGn9OBzjEmDU4gCebQgX20rfHkyPe08/xft22wzUfVlTJ4MB+6I5acDr/fkg3ozqnQj8FKQHgbchc4vMyYP6pAPhj/QLyMf7RG9EcbnwLeBTUF+Al6abvLjQuSDoCbUPxBF1iya3s5DvEb7SZNbgP16+ZnGFMsI4OZY/irkmz2mFBN0twPzg3R/YA4KrW5MFgxCPjcgyD9JCUZKSyGMNmAK8E6Q/wqK0+P+hkmbOhTRZu8g/w5qQhU9CtWRUi3pWIuGyFqD/MnoMHFj0uRyoqmCVuSDawpf3n1KudZpGe1nxW/AEdNNeownOrAe5HvLClxbNKVeBDgD+EWQ7gPMwp1xU3r2Q77VJ8j/AvleyUhjdex5wItBejA6pWb3FL7H1CbD0AEv4RbrF0lhMWsawtiExpPfDvJfAH6N94qb3jMYhXTaM8i/jXxtU6Ebekpa+ynWoLMHNgT5/YBHgX4pfZ+pfvohH9o/yG9APlaSznZH0txotBLFCA1Hqo5AYT8tDlMs2yDfOSLItyLfWpnWF6a9A28hcBY6+A90Qma802RMV/RBnevwdNXN6IiwhWl+aRZbUx8GvkM06TIJuA+Lw3RNH+Qrk4J8G3A+8EjaX5zVnu170JkEoTgmA79EVaQxSWyDaoowmEEb8qFOpx+lQZbBDG5HM5WhOE4DHsJ9DtOZfsg3Tg/ybSho2u1ZGZB1lI/bUFUY73M8hRcdmohBaCFg2KdoQ+ez3JqlEXmEv7mb9uuqDkd7yB3d0OyMfCEcfdqMfkjvKHhHSuQVF+oR4ETgr0F+fxSB2stHapcRwAtE8xQtwBnohzRz8gyY9gxwJFFYkz3RIrAT8jLI5MYJ6IdxzyC/HjgO7bPIhbwjCa4ADgNWB/ntgHlopaT3c1Q/dahTPQ+VPcgXxtLF+RVpk7cwQLOXB6FqFDR2fSPeCVjthDvvbiKa01qBfOHVvIwKKQdhALyPOly/jL12Mlo5OSIXi0yajEBle3LstfvRQMz7uVjUgXIRBmiF5NnAPxJFVd8bhei5CDetqoE6VJYvEW1H/QyV+VmksEq2p5STMEJmoF+OcA95fzRcNxcHdatkhqMyvAOVKaiMD6PEm4xKQTkKAzQ6NRJtcgqZgPojp+ZikekNp6CymxB7bT4q4+WJd+RMuQoDFGBhPKpmwyp2OFoqMBtHWa8EhgMPok52WNtvQjPZE4iOlCg7ylkYoOUAM4ADaX9Y+SQUP/d8yv//UIvUo7J5gyjAMqgMD0Rrnnod4iZNKsWpVqFhvEaipSQ7AHcCS1CVbMqDkahM7iQKxd+Kyu4gVJZlT6UIAzR6MZ3owYeMQgF878HrrfJkF1QGL6MyCQl/uKYTjTaWPZUkjJDX0czoFHSEFOj/MQX4PXAtDryQJYPRM/89KoPQp9YF+bH0MBR/nlSiMEDt0/vQWPhMoqjW2wLXAH9Ey0oG5mJdbTAQPeM/omceHhn8OSqTfVAZlXVfohCVKoyQD4GpwNdQiJ6QoWhZyZ+BaXhpSSkZhJ7pn9EzHhp770lUFlOJavOKpNKFEfI6WqF5KO37H8OB69DCtBtQjCvTM76ADnxcjZ5pfLJ1CXr2x1OBzaYkqkUYIUuBMcAxRIsSQe3gK4E/oTmQ0dmbVrGMRs/sT+jciXj/bQVwLHrmS7M3LT2qTRghT6ORkcODdEhfNAeyFB0schmwY+bWlT9D0LN5DT2rSejZhTyNnu0hwILMrcuAahVGyGJUe3wdHWnbEntvX7SP+F3gMbTUZAC1ywAkgMfQGqZb0TMKaUHP8OvomS7O1rxsqWtdUlOLVoejGdnzgD0S3v8IreGZi4I0fJydabmwHWoKTUR9tKRBitXo0MefkVI4zDxpam5MfL3WhBFSj/Z/nI/W7DQkXNOCdpE9jbbhVsSMbTcYARwFHI2aQ4X+748jQTQDWzKzLmMKCaNv4qvVzxbg2eBve/SLeTowjmg3WQP6NT02yL+Lmg/Lgr9VRGGAypU+SAijg7/DgF0LXLsZiWA2Cp68PgP7ypZarTEKMQzVIOPRr+rWJgivRkPA5cxVaIi1EJ+i2vAJVEOU7WrXtHCN0T3WovU+96DO6OEoksk4FNqn0n9F2tC+iGZUWy4CNuZqUZliYRRmI5pND2fUd0JDwKPRMGVLgfvKiRa0EegF1PxbDnyQq0UVwv8BNYmwIpIWBvwAAAAASUVORK5CYII='
// 00FEFF
export const color = ['#FF801C', '#F5FF46', '#00FE65', '#00FEFF', '#ffa800', '#ff5b00', '#ff3000']

// 获取圆上面某点的坐标(x0,y0表示坐标，r半径，angle角度)
function getCirlPoint (x0: number, y0: number, r: number, angle: number) {
  const x1 = x0 + r * Math.cos((angle * Math.PI) / 180)
  const y1 = y0 + r * Math.sin((angle * Math.PI) / 180)
  return {
    x: x1,
    y: y1
  }
}
export const formateFiles = (fileStrings: string): FileItem[] => {
  if (!fileStrings) {
    return []
  }
  if (fileStrings.indexOf(',') === -1) {
    const paths = fileStrings.split('/')
    return [
      {
        name: paths.pop() || 'default',
        url: fileStrings
      }
    ]
  }
  try {
    const fileitems: FileItem[] = JSON.parse(fileStrings)
    return fileitems
  } catch (error: any) {
    console.log(error.message)
    return []
  }
}
const seriesOption = (data: any[], total: number, angle: number) => {
  return [
    {
      name: '',
      type: 'pie',
      clockWise: false,
      radius: [50, 70],
      hoverAnimation: false,
      animation: false,
      itemStyle: {
        label: {
          show: true,
          position: 'outside',
          color: '#ddd',
          formatter: function (params: { value: number; name: string }) {
            const percent = total === 0 ? 0 : Math.floor((params.value / total) * 100)
            if (params.name !== '') {
              return params.name + '\n' + percent + '%'
              // return '交通方式：' + params.name + '\n' + '\n' + '占百分比：' + percent + '%';
            } else {
              return ''
            }
          }
        },
        labelLine: {
          length: 20,
          length2: 20,
          show: true,
          color: '#00ffff'
        }
      },
      data: data
    },
    // 蓝色线1
    {
      name: 'ring5',
      type: 'custom',
      coordinateSystem: 'none',
      renderItem: function (params: any, api: { getWidth: () => number; getHeight: () => number }) {
        return {
          type: 'arc',
          shape: {
            cx: api.getWidth() / 2,
            cy: api.getHeight() / 2,
            r: Math.min(api.getWidth(), api.getHeight()) / 2.8,
            startAngle: ((0 + angle) * Math.PI) / 180,
            endAngle: ((90 + angle) * Math.PI) / 180
          },
          style: {
            stroke: '#00FEFF',
            fill: 'transparent',
            lineWidth: 1.5
          },
          silent: true
        }
      },
      data: [0]
    },
    // 蓝色球1
    {
      name: 'ring5',
      type: 'custom',
      coordinateSystem: 'none',
      renderItem: function (params: any, api: { getWidth: () => number; getHeight: () => number }) {
        const x0 = api.getWidth() / 2
        const y0 = api.getHeight() / 2
        const r = Math.min(api.getWidth(), api.getHeight()) / 2.8
        const point = getCirlPoint(x0, y0, r, 90 + angle)
        return {
          type: 'circle',
          shape: {
            cx: point.x,
            cy: point.y,
            r: 4
          },
          style: {
            stroke: '#00FEFF', // 绿
            fill: '#00FEFF'
          },
          silent: true
        }
      },
      data: [0]
    },
    // 蓝色线2

    {
      name: 'ring5',
      type: 'custom',
      coordinateSystem: 'none',
      renderItem: function (params: any, api: { getWidth: () => number; getHeight: () => number }) {
        return {
          type: 'arc',
          shape: {
            cx: api.getWidth() / 2,
            cy: api.getHeight() / 2,
            r: Math.min(api.getWidth(), api.getHeight()) / 2.8,
            startAngle: ((180 + angle) * Math.PI) / 180,
            endAngle: ((270 + angle) * Math.PI) / 180
          },
          style: {
            stroke: '#00FEFF',
            fill: 'transparent',
            lineWidth: 1.5
          },
          silent: true
        }
      },
      data: [0]
    },
    // 蓝色球2
    {
      name: 'ring5', // 蓝色
      type: 'custom',
      coordinateSystem: 'none',
      renderItem: function (params: any, api: { getWidth: () => number; getHeight: () => number }) {
        const x0 = api.getWidth() / 2
        const y0 = api.getHeight() / 2
        const r = Math.min(api.getWidth(), api.getHeight()) / 2.8
        const point = getCirlPoint(x0, y0, r, 180 + angle)
        return {
          type: 'circle',
          shape: {
            cx: point.x,
            cy: point.y,
            r: 4
          },
          style: {
            stroke: '#00FEFF', // 绿
            fill: '#00FEFF'
          },
          silent: true
        }
      },
      data: [0]
    },
    // 蓝色线3
    {
      name: 'ring5',
      type: 'custom',
      coordinateSystem: 'none',
      renderItem: function (params: any, api: { getWidth: () => number; getHeight: () => number }) {
        return {
          type: 'arc',
          shape: {
            cx: api.getWidth() / 2,
            cy: api.getHeight() / 2,
            r: Math.min(api.getWidth(), api.getHeight()) / 3.1,
            startAngle: ((270 + -angle) * Math.PI) / 180,
            endAngle: ((40 + -angle) * Math.PI) / 180
          },
          style: {
            stroke: '#00FEFF',
            fill: 'transparent',
            lineWidth: 1.5
          },
          silent: true
        }
      },
      data: [0]
    },
    // 蓝色线4
    {
      name: 'ring5',
      type: 'custom',
      coordinateSystem: 'none',
      renderItem: function (params: any, api: { getWidth: () => number; getHeight: () => number }) {
        return {
          type: 'arc',
          shape: {
            cx: api.getWidth() / 2,
            cy: api.getHeight() / 2,
            r: Math.min(api.getWidth(), api.getHeight()) / 3.1,
            startAngle: ((90 + -angle) * Math.PI) / 180,
            endAngle: ((220 + -angle) * Math.PI) / 180
          },
          style: {
            stroke: '#00FEFF',
            fill: 'transparent',
            lineWidth: 1.5
          },
          silent: true
        }
      },
      data: [0]
    },
    // 蓝色球3
    {
      name: 'ring5',
      type: 'custom',
      coordinateSystem: 'none',
      renderItem: function (params: any, api: { getWidth: () => number; getHeight: () => number }) {
        const x0 = api.getWidth() / 2
        const y0 = api.getHeight() / 2
        const r = Math.min(api.getWidth(), api.getHeight()) / 3.1
        const point = getCirlPoint(x0, y0, r, 90 + -angle)
        return {
          type: 'circle',
          shape: {
            cx: point.x,
            cy: point.y,
            r: 4
          },
          style: {
            stroke: '#00FEFF', // 粉
            fill: '#00FEFF'
          },
          silent: true
        }
      },
      data: [0]
    },
    // 蓝色球4
    {
      name: 'ring5',
      type: 'custom',
      coordinateSystem: 'none',
      renderItem: function (params: any, api: { getWidth: () => number; getHeight: () => number }) {
        const x0 = api.getWidth() / 2
        const y0 = api.getHeight() / 2
        const r = Math.min(api.getWidth(), api.getHeight()) / 3.1
        const point = getCirlPoint(x0, y0, r, 270 - angle)
        return {
          type: 'circle',
          shape: {
            cx: point.x,
            cy: point.y,
            r: 4
          },
          style: {
            stroke: '#00FEFF', // 绿
            fill: '#00FEFF'
          },
          silent: true
        }
      },
      data: [0]
    }
  ]
}
export const initOption = (data: any, legend: any, colors: any, total: number, angle: number) => {
  const option = {
    // backgroundColor: '#000E1A',
    backgroundColor: '#272A3E',
    color: colors,

    graphic: {
      elements: [
        {
          type: 'image',
          z: 3,
          style: {
            image: img,
            width: 65,
            height: 65
          },
          left: 'center',
          top: 'center',
          position: [100, 100]
        }
      ]
    },
    tooltip: {
      show: false
    },
    legend: {
      icon: 'circle',
      orient: 'horizontal',
      // x: 'left',
      // data: ['吃喝', '服饰', '日用品', '化妆品'],
      data: legend,
      align: 'right',
      textStyle: {
        color: '#fff'
      },
      itemGap: 20
    },
    toolbox: {
      show: false
    },
    series: seriesOption(data, total, angle)
  }
  return option
}
export const formatePathName = (url:string) => {
  const paths = url.split('/')
  if (paths.length > 1) {
    return paths[paths.length - 1]
  } else {
    return url
  }
}
