export type QueryListParam = {
  projectId?: string
  // 开始时间毫秒值
  start: string
  // 结束时间毫秒值
  end: string
}
/**
 * 巡检任务完成率
 */
export type IPatrolCompleteRatio = {
  total?: string
  complete?: string
  unExecute?: string
  exception?: string
  percent?: number
}
/**
 * 巡检任务状态
 */
export type IPatrolStatusCount = {
  unstart?: string
  total?: string
  unExecute?: string
  complete?: string
  process?: string
}
/**
 * 巡检人员排名
 */
export type IPatrolUserRank = {
  userId: string
  userName: string
  complete: number
  timeout: number
  timeoutComplete: number
}
/**
 * 巡检每日异常
 */
export type IPatrolException = Record<string, number>
/**
 * 巡检趋势
 */
export type IPatrolTrend = Record<string, number>
/**
 * 报警排名
 */
export type IAlarmRank = {
  deviceName: string
  projectName: string
  alarm: number
}
/**
 * 报警趋势
 */
export type IAlarmTrend = {
  date: string
  alarm: number
}
/**
 * 报警概览
 */
export type IAlarmOverview = {
  alarmTotal?: number
  alarmDeviceTotal?: number
  unconfirmTotal?: number
  unremoveTotal?: number
}
/**
 * 报警等级
 */
export type IAlarmPriority = Record<string, number>

/**
 * 工单超时数
 */
export type IOrderTimeout = {
  userId: string
  userName: string
  order: number
  percent?: number
}
/**
 * 工单概览
 */
export type IOrderOverview = {
  total?: number
  complete?: number
  process?: number
  unstart?: number
  timeout?: number
}
/**
 * 工单等级
 */
export type IOrderPriority = {
  level1?: number
  level2?: number
  level3?: number
  level4?: number
}
/**
 * 工单类型
 */
export type IOrderType = {
  repair?: number
  maintenance?: number
  other?: number
}
/**
 * 工单趋势-类型
 */
export type IOrderTypeTrend = {
  date: string
  repair: number
  maintenance: number
  other: number
}
/**
 * 工单类型等级趋势
 */
export type IOrderTypePriority = {
  level: string
  repair: string
  maintenance: string
  other: string
}
