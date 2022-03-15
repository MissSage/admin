import { IControlAlarm } from '../..'

export const severityColor = {
  提示: 'rgb(85,204,244)',
  次要: 'rgb(255,216,0)',
  重要: '#f58717',
  紧急: 'rgb(245,75,23)',
  严重: '#FF0000'
}
export const alarmTypes = { offline: '掉线报警', scope: '范围报警', change: '变动报警' }
export const formateStatus = (item: IControlAlarm) => {
  switch (item.status) {
    case 'CONFIRM_UNACK':
    case 'ACTIVE_ACK':
      item.confirm = '未恢复 | 未确认'
      break
    case 'CONFIRM_ACK':
      item.confirm = '未恢复 | 已确认'
      break
    case 'RESTORE_ACK':
      item.confirm = '已恢复 | 未确认'
      break
      case 'CLEAR_FORCED':
        item.confirm = '强制解除'
    default:
      break
  }
  return item.confirm || ''
}
export const formateColor = (item: IControlAlarm) => {
  return item.status === 'CONFIRM_UNACK' || item.status === 'ACTIVE_ACK' ? 'red' : '#36a624'
}
