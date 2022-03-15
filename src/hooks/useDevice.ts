import { getAttrListData } from '@/api/device'
import { getDeviceTreeData, getDeviceType } from '@/api/ledger/ledger2'
import { getAllMaintStandards } from '@/api/maintenance/standard'
import { getAllRepairStandards } from '@/api/repair/standard'
import { NormalOption } from '@/common/types/common'
import { ref } from 'vue'

export default () => {
  /**
   * 设备类型列表
   */
  const DeviceTypes = ref<NormalOption[]>([])

  /**
   * 获取设备类型树
   */
  const getDeviceTypeTree = async (): Promise<void> => {
    const res: any = await getDeviceType().catch((err: Error) => {
      console.log(err.message)
    })
    const result = res.data.map((item: any) => {
      const obj: NormalOption = {
        label: item,
        value: item
      }
      return obj
    })
    DeviceTypes.value = result
  }
  /**
   * 设备树
   */
  const DeviceTree = ref<NormalOption[]>([])
  /**
   * 根据项目Id获取设备树
   * @param projectId
   */
  const getDeviceTree = async (projectId: string): Promise<void> => {
    const res: any = await getDeviceTreeData(projectId).catch((err: Error) => {
      console.log(err.message)
    })
    DeviceTree.value = res.data.map((item: { nodeName: any; nodeId: any; children: any[] }) => {
      const obj: NormalOption = {
        label: item.nodeName,
        value: item.nodeId,
        children: item.children.map((item1: any): NormalOption => {
          return {
            label: item1.nodeName,
            value: item1.nodeId,
            data: item1.data
          }
        })
      }
      return obj
    })
  }
  /**
   * 从设备树中获取指定类型下的指定设备
   * @param type
   * @param id
   * @returns
   */
  const getDeviceFromTree = (type: any, id: any) => {
    const typeObj = DeviceTree.value.find(item => item.value === type)
    const device = typeObj
      ? typeObj.children
        ? typeObj.children.find(item => item.data.id === id)
        : undefined
      : undefined
    return device
  }
  /**
   * 设备属性树
   */
  const AttrList = ref<NormalOption[]>([])
  /**
   * 获取指定设备的属性表
   */
  const getAttrList = async (deviceId: string) => {
    const res: any = await getAttrListData(deviceId).catch((err: Error) => {
      console.log(err.message)
    })
    if (res.data) {
      AttrList.value = res.data.map((item: { label: any; value: any; unit: any }) => {
        return {
          label: item.label,
          value: item.value,
          data: item.unit
        }
      })
    } else {
      console.log(res)
    }
  }
  /**
   * 维修标准树
   */
  const RepaireStandardTree = ref<NormalOption[]>([])
  /**
   * 获取维修标准树
   * @param deviceType 设备类型
   */
  const getRepaireStandardTree = async () => {
    const res: any = await getAllRepairStandards('').catch((err: Error) => {
      console.log(err.message)
    })
    if (res.data) {
      RepaireStandardTree.value = res.data.map((item: { name: any; id: any }) => {
        return {
          label: item.name,
          value: item.id,
          data: item
        }
      })
    } else {
      console.log(res)
    }
  }
  /**
   * 维修标准树
   */
  const MaintenanceStandardTree = ref<NormalOption[]>([])
  /**
   * 维修标准树
   * @param deviceType
   */
  const getMaintenanceStandardTress = async () => {
    const res: any = await getAllMaintStandards('').catch((err: Error) => {
      console.log(err.message)
    })
    if (res.data) {
      MaintenanceStandardTree.value = res.data.map((item: { name: any; id: any }) => {
        return {
          label: item.name,
          value: item.id,
          data: item
        }
      })
    } else {
      console.log(res)
    }
  }
  return {
    getDeviceTypeTree,
    DeviceTypes,
    getDeviceTree,
    getDeviceFromTree,
    DeviceTree,
    getAttrList,
    AttrList,
    RepaireStandardTree,
    getRepaireStandardTree,
    MaintenanceStandardTree,
    getMaintenanceStandardTress
  }
}
