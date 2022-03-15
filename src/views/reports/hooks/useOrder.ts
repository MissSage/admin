import {
  GetOrderOverview,
  GetOrderPriorityCount,
  GetOrderTimeoutRank,
  GetOrderTypeCount,
  GetOrderTypePriorityCount,
  GetOrderTypeTrend
} from '@/api/reports/order'
import {
  IOrderOverview,
  IOrderPriority,
  IOrderTimeout,
  IOrderType,
  IOrderTypePriority,
  IOrderTypeTrend,
  QueryListParam
} from '@/common/types/reports'
import { maxBy } from 'lodash'
import { ref } from 'vue'

const useOrder = () => {
  const OrderTimeoutRank = ref<IOrderTimeout[]>([])
  const getOrderTimeoutRank = async (params: QueryListParam) => {
    const res = await GetOrderTimeoutRank(params)
    const data: IOrderTimeout[] = res.data
    const order = maxBy(data, item => item.order)
    const max = order ? order.order : 9999999
    data.map(item => (item.percent = (item.order / max) * 100))
    OrderTimeoutRank.value = data
  }
  const OrderPriorityCount = ref<IOrderPriority>({
    level1: 0,
    level2: 0,
    level3: 0,
    level4: 0
  })
  const getOrderPriorityCount = async (params: QueryListParam) => {
    const res = await GetOrderPriorityCount(params)
    OrderPriorityCount.value = res.data
  }
  const OrderTypeCount = ref<IOrderType>({
    repair: 0,
    maintenance: 0,
    other: 0
  })
  const getOrderTypeCount = async (params: QueryListParam) => {
    const res = await GetOrderTypeCount(params)
    OrderTypeCount.value = res.data
  }
  const OrderTypeTrend = ref<IOrderTypeTrend[]>([])
  const getOrderTypeTrend = async (params: QueryListParam) => {
    const res = await GetOrderTypeTrend(params)
    OrderTypeTrend.value = res.data
  }
  const OrderTypePriorityTrend = ref<IOrderTypePriority[]>([])
  const formatPriority = (level: string) => {
    switch (level) {
      case '1':
        return '低'
      case '2':
        return '一般'
      case '3':
        return '高'
      case '4':
        return '紧急'
      default:
        break
    }
  }
  const getOrderTypePriorityTrend = async (params: QueryListParam) => {
    const res = await GetOrderTypePriorityCount(params)
    OrderTypePriorityTrend.value = res.data.map(item => {
      item.level = formatPriority(item.level)
      return item
    })
  }
  const OrderOverview = ref<IOrderOverview>({
    total: 0,
    complete: 0,
    process: 0,
    unstart: 0,
    timeout: 0
  })
  const getOrderOverview = async (params: QueryListParam) => {
    const res = await GetOrderOverview(params)
    OrderOverview.value = res.data
  }
  return {
    OrderTimeoutRank,
    getOrderTimeoutRank,
    OrderPriorityCount,
    getOrderPriorityCount,
    OrderTypeCount,
    getOrderTypeCount,
    OrderTypeTrend,
    getOrderTypeTrend,
    OrderTypePriorityTrend,
    getOrderTypePriorityTrend,
    OrderOverview,
    getOrderOverview
  }
}

export default useOrder
