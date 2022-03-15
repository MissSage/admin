
import { postDeviceProperty } from '@/api/ledger/devControl'
import { ref } from 'vue'
import {  IControlItem, PostControlParam } from '../..'

const useContro = () => {
  const ControlList = ref<IControlItem[]>([
  ])
  const postControlInfo = async(params:PostControlParam) => {
    const res = await postDeviceProperty(params)
    console.log(res)
    return res
  }
  return {
    ControlList,
    postControlInfo
  }
}
export default useContro
