import moment from 'moment'
import { RouteRecordRaw } from 'vue-router'

/**
 * 描述时间，转换成带单位的时间
 * @param val
 * @returns xx秒、xx小时、xx分、xx天
 */
export const DescribeDate = (val: any) => {
  const timeLast: number = moment(val).valueOf() / 1000
  if (timeLast < 60) return timeLast.toFixed(0) + '秒'
  else if (timeLast < 3600) return (timeLast / 60).toFixed(0) + '分'
  else if (timeLast < 3600 * 24) return (timeLast / 3600).toFixed(0) + '小时'
  else return (timeLast / 3600 / 24).toFixed(0) + '天'
}
/**
 * 格式化时间
 * @param val
 * @param format
 * @returns
 */
export const DateFormatter = (val: string | Date, format?: string) => {
  if (!val) return '-'
  if (!format) return moment(val).format('YYYY-MM-DD HH:mm:ss')
  format = format.replace('Y', 'YYYY')
  format = format.replace('M', 'MM')
  format = format.replace('D', 'DD')
  format = format.replace('H', 'HH')
  format = format.replace('m', 'mm')
  format = format.replace('s', 'ss')
  return moment(val).format(format)
}
/**
 * 处理路由路径
 * @param routers
 * @param parent
 * @returns
 */
export const filterRouters = (routers:RouteRecordRaw[], parent?:RouteRecordRaw) => {
  return routers.filter(item => !item.meta?.hidden).map(item => {
    parent && (item.path = parent.path + '/' + item.path)
    item.children && (item.children = filterRouters(item.children, item))
    return item
  })
}
