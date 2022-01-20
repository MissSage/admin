
import LgsLayerBox from '@/plugins/LgsLayer/utils/LgsLayerBox'
import { inject } from 'vue'
const useGlobal = ():{
  $layer:LgsLayerBox
} => {
  const globalProperties:any = inject('globalProperties')
  const $layer = globalProperties.$layer
  return {
    $layer
  }
}
export default useGlobal
