// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getProjectRoot } from '@/api/project'
import { NormalOption } from '@/common/types/common'
import { formatTree } from '@/utils/helper'
import { ref } from 'vue'

export default () => {
  const getAreaTreeData = async () => {
    const res = await getProjectRoot(false)
    const result = formatTree(res.data)
    areaTree.value = result
    console.log(result)

    return result
  }
  const areaTree = ref<NormalOption[]>([])
  return {
    areaTree,
    getAreaTreeData
  }
}
