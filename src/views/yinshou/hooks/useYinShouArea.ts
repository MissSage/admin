import { GetYinShouArea } from '@/api/yinshou'
import { ref } from 'vue'

const useYinShouArea = () => {
  const getYinShouArea = async () => {
    const res = await GetYinShouArea()

    return (
      res.data?.map(item => {
        const obj: NormalOption = {
          label: item.name,
          value: item.id,
          data: item
        }
        return obj
      }) || []
    )
  }
  const YinShouArea = ref<NormalOption[]>([])
  return {
    /**
     * 区域树
     */
    YinShouArea,
    /**
     * 获取区域树
     */
    getYinShouArea
  }
}
export default useYinShouArea
