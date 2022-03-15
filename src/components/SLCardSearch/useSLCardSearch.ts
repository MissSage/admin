import { ref } from 'vue'
import { ISLCardSearch } from './type'

const useSLCardSearch = (refreshData?: (...args: any[]) => void) => {
  const slCardSearchConfig = ref<ISLCardSearch>({
    filters: [{ label: '', type: 'input', field: 'name' }],
    operations: refreshData
      ? [
          {
            text: '搜索',
            click: (params: any) => {
              refreshData && refreshData(params)
              console.log(params)
            },
            perm: true,
            icon: 'iconfont icon-sousuo'
          }
        ]
      : []
  })
  return {
    slCardSearchConfig
  }
}
export default useSLCardSearch
