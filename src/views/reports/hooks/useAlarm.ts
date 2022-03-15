import {
  GetAlarmOverview,
  GetAlarmPriority,
  GetAlarmRank,
  GetAlarmTrend
} from '@/api/reports/alarm'
import {
  IAlarmOverview,
  IAlarmPriority,
  IAlarmRank,
  IAlarmTrend,
  QueryListParam
} from '@/common/types/reports'
import { ref } from 'vue'

const useAlarm = () => {
  const AlarmRank = ref<IAlarmRank[]>([])
  const getAlarmRank = async (params: QueryListParam) => {
    const res = await GetAlarmRank(params)
    AlarmRank.value = res.data
  }
  const AlarmTrend = ref<IAlarmTrend[]>([])
  const getAlarmTrend = async (params: QueryListParam) => {
    const res = await GetAlarmTrend(params)
    AlarmTrend.value = res.data
  }
  const AlarmOverview = ref<IAlarmOverview>({
    alarmTotal: 0,
    alarmDeviceTotal: 0,
    unconfirmTotal: 0,
    unremoveTotal: 0
  })
  const getAlarmOverview = async (params: QueryListParam) => {
    const res = await GetAlarmOverview(params)
    AlarmOverview.value = res.data
  }
  const AlarmPriority = ref<IAlarmPriority>({
    提示: 0,
    次要: 0,
    重要: 0,
    紧急: 0
  })
  const getAlarmPriority = async (params: QueryListParam) => {
    const res = await GetAlarmPriority(params)
    AlarmPriority.value = res.data
  }

  return {
    AlarmRank,
    getAlarmRank,
    AlarmTrend,
    getAlarmTrend,
    AlarmOverview,
    getAlarmOverview,
    AlarmPriority,
    getAlarmPriority
  }
}
export default useAlarm
