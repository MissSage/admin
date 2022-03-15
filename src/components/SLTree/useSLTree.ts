import { ref } from 'vue'
import { SLTreeConfig } from './type'

const useSLTree = (refreshData?: (currentProject?:any) => void) => {
  const slTreeConfig = ref<SLTreeConfig>({
    title: '项目列表',
    data: [],
    loading: false,
    isFilterTree: true,
    currentProject: {},
    expandNodeId: [],
    defaultProps: {
      children: 'children',
      label: 'label'
    },
    treeNodeHandleClick: data => {
      // 设置当前选中项目信息
      slTreeConfig.value.currentProject = data
      refreshData && refreshData(data)
    }
  })
  return {
    slTreeConfig
  }
}

export default useSLTree
