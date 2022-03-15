import { ref } from 'vue'
import { ISLCardTable } from './type'

const useSLCardTable = (fn?: (...args: any[]) => any) => {
  const slCardTableConfig = ref<ISLCardTable>({
    columns: [],
    selectList: [],
    dataList: [],
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      layout: 'total,sizes, prev, pager, next, jumper',
      handleSize: (size: number) => {
        slCardTableConfig.value.pagination && (slCardTableConfig.value.pagination.limit = size)
        fn && fn()
      },
      handlePage: (page: number) => {
        slCardTableConfig.value.pagination && (slCardTableConfig.value.pagination.page = page)
        fn && fn()
      }
      //
    }
  })
  return {
    slCardTableConfig
  }
}
export default useSLCardTable
