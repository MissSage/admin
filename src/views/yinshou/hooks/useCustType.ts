import { GetCustTypeList } from '@/api/yinshou'
import { ref } from 'vue'

const useCustType = () => {
  const getCustTypeList = async () => {
    const res = await GetCustTypeList()
    return res.data || []
  }
  const CustTypeList = ref<any[]>([])
  return {
    getCustTypeList,
    CustTypeList
  }
}
export default useCustType
