import {
  GetPatrolCompleteRatio,
  GetPatrolException,
  GetPatrolStatusCount,
  GetPatrolTaskTreend,
  GetPatrolUserRank
} from '@/api/reports/patrol'
import {
  IPatrolCompleteRatio,
  IPatrolException,
  IPatrolStatusCount,
  IPatrolTrend,
  IPatrolUserRank,
  QueryListParam
} from '@/common/types/reports'
import { ref } from 'vue'

const usePatrol = () => {
  const PatrolUserRank = ref<IPatrolUserRank[]>([])
  const getPatrolUserRank = async (params: QueryListParam) => {
    const res = await GetPatrolUserRank(params)
    PatrolUserRank.value = res.data
  }
  const PatrolStatusCount = ref<IPatrolStatusCount>({
    unstart: '0',
    total: '0',
    unExecute: '0',
    complete: '0',
    process: '0'
  })
  const getPatrolStatusCount = async (params: QueryListParam) => {
    const res = await GetPatrolStatusCount(params)
    PatrolStatusCount.value = res.data
  }
  const PatrolExceptionTrend = ref<IPatrolException>({})
  const getPatrolExceptionTrend = async (params: QueryListParam) => {
    const res = await GetPatrolException(params)
    PatrolExceptionTrend.value = res.data
  }
  const PatrolCompleteRatio = ref<IPatrolCompleteRatio>({
    total: '0',
    complete: '0',
    unExecute: '0',
    exception: '0',
    percent: 0
  })
  const getPatrolCompleteRatio = async (params: QueryListParam) => {
    const res = await GetPatrolCompleteRatio(params)
    const data = res.data
    if (data && data.total && data.total != '0') {
      data.percent = (parseFloat(data.complete) / parseFloat(data.total)) * 100
    } else {
      data.percent = 0
    }
    PatrolCompleteRatio.value = res.data
  }
  const PatrolTrend = ref<IPatrolTrend[]>([])
  const getPatrolTrend = async (params: QueryListParam) => {
    const res = await GetPatrolTaskTreend(params)
    PatrolTrend.value = res.data
  }
  return {
    PatrolUserRank,
    getPatrolUserRank,
    PatrolStatusCount,
    getPatrolStatusCount,
    PatrolExceptionTrend,
    getPatrolExceptionTrend,
    PatrolCompleteRatio,
    getPatrolCompleteRatio,
    PatrolTrend,
    getPatrolTrend
  }
}
export default usePatrol
