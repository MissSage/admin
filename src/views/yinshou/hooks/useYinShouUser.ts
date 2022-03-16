import { GetYinShouUserList } from '@/api/yinshou'
import { ref } from 'vue'

const useYinShouUser = () => {
  const getYinShouUserList = async () => {
    const res = await GetYinShouUserList()
    YinShouUserList.value = res.data
  }
  const YinShouUserList = ref<any[]>([])
  return {
    getYinShouUserList,
    YinShouUserList
  }
}
export default useYinShouUser
