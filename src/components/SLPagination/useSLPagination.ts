import { ref } from 'vue'
import { ISLPaginationConfig } from './type'

const useSLPagination = (refreshData?: (...args: any[]) => void) => {
  const slPaginationConfig = ref<ISLPaginationConfig>({
    page: 1,
    limit: 20,
    total: 0,
    layout: 'total,sizes, prev, pager, next, jumper',
    align: 'left',
    handlePage: (page: number) => {
      slPaginationConfig.value.page = page
      refreshData && refreshData()
    },
    handleSize: (size: number) => {
      slPaginationConfig.value.limit = size
      refreshData && refreshData()
    }
  })
  return {
    slPaginationConfig
  }
}

export default useSLPagination
