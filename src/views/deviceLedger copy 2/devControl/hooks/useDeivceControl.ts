import { getControlList } from '@/api/ledger/devControl'
import { ref } from 'vue'
import { ControlInfo, QueryControlListParam } from '../..'

const useDevice = () => {
  const DeviceList = ref<ControlInfo[]>([])
  const getDeviceList = async (params: QueryControlListParam) => {
    const res = await getControlList(params)
    // DeviceList.value = [
    //   {
    //     data: {
    //       deviceName: '观景台气象站',
    //       deviceId: 'aaaaa',
    //       status: 'on',
    //       showHistory: true,
    //       showWarning: true,
    //       data: [
    //         { name: '大气温度', value: '6.0', unit: '℃', date: '2021-05-21 12:43' },
    //         { name: '大气温度', value: '6.0', unit: '℃', date: '2021-05-21 12:43' },
    //         {
    //           name: '大气温度',
    //           value: '6.0',
    //           unit: '℃',
    //           date: '2021-05-21 12:43',
    //           isWarning: true
    //         },
    //         { name: '大气温度', value: '6.0', unit: '℃', date: '2021-05-21 12:43' },
    //         { name: '大气温度', value: '6.0', unit: '℃', date: '2021-05-21 12:43' },
    //         { name: '大气温度', value: '6.0', unit: '℃', date: '2021-05-21 12:43' },
    //         { name: '大气温度', value: '6.0', unit: '℃', date: '2021-05-21 12:43' },
    //         { name: '大气温度', value: '6.0', unit: '℃', date: '2021-05-21 12:43' },
    //         { name: '大气温度', value: '6.0', unit: '℃', date: '2021-05-21 12:43' }
    //       ]
    //     },
    //     btns: [
    //       {
    //         text: '远程控制',
    //         icon: 'icon-buzhou',
    //         type: 'yckz'
    //       },
    //       {
    //         text: '历史数据',
    //         icon: 'icon-baobiaoguanli',
    //         type: 'lssj'
    //       },
    //       {
    //         text: '报警记录',
    //         icon: 'icon-baojingguanli',
    //         type: 'bjjl'
    //       }
    //     ]
    //   },
    //   {
    //     data: {
    //       deviceName: '土壤成分监测设备',
    //       deviceId: 'vbbbb',
    //       status: 'off',
    //       showHistory: true,
    //       showWarning: true,
    //       showRemote: true,
    //       data: [
    //         { name: '大气温度', value: '6.0', unit: '℃', date: '2021-05-21 12:43' },
    //         { name: '大气温度', value: '6.0', unit: '℃', date: '2021-05-21 12:43' },
    //         { name: '大气温度', value: '6.0', unit: '℃', date: '2021-05-21 12:43' },
    //         { name: '大气温度', value: '6.0', unit: '℃', date: '2021-05-21 12:43' },
    //         { name: '大气温度', value: '6.0', unit: '℃', date: '2021-05-21 12:43' },
    //         { name: '大气温度', value: '6.0', unit: '℃', date: '2021-05-21 12:43' },
    //         { name: '大气温度', value: '6.0', unit: '℃', date: '2021-05-21 12:43' },
    //         { name: '大气温度', value: '6.0', unit: '℃', date: '2021-05-21 12:43' },
    //         { name: '大气温度', value: '6.0', unit: '℃', date: '2021-05-21 12:43' }
    //       ]
    //     },
    //     btns: [
    //       {
    //         text: '远程控制',
    //         icon: 'icon-buzhou',
    //         type: 'yckz'
    //       },
    //       {
    //         text: '历史数据',
    //         icon: 'icon-baobiaoguanli',
    //         type: 'lssj'
    //       },
    //       {
    //         text: '报警记录',
    //         icon: 'icon-baojingguanli',
    //         type: 'bjjl'
    //       }
    //     ]
    //   },
    //   {
    //     data: {
    //       deviceName: '土壤成分监测设备',
    //       deviceId: 'vbbbb',
    //       status: 'off',
    //       data: [
    //         { name: '大气温度', value: '6.0', unit: '℃', date: '2021-05-21 12:43' },
    //         { name: '大气温度', value: '6.0', unit: '℃', date: '2021-05-21 12:43' },
    //         { name: '大气温度', value: '6.0', unit: '℃', date: '2021-05-21 12:43' },
    //         { name: '大气温度', value: '6.0', unit: '℃', date: '2021-05-21 12:43' },
    //         { name: '大气温度', value: '6.0', unit: '℃', date: '2021-05-21 12:43' },
    //         { name: '大气温度', value: '6.0', unit: '℃', date: '2021-05-21 12:43' },
    //         { name: '大气温度', value: '6.0', unit: '℃', date: '2021-05-21 12:43' },
    //         { name: '大气温度', value: '6.0', unit: '℃', date: '2021-05-21 12:43' },
    //         { name: '大气温度', value: '6.0', unit: '℃', date: '2021-05-21 12:43' }
    //       ]
    //     },
    //     btns: [
    //       {
    //         text: '远程控制',
    //         icon: 'icon-buzhou',
    //         type: 'yckz'
    //       }
    //     ]
    //   }
    // ]
    return res.data||[]
  }
  return {
    DeviceList,
    getDeviceList
  }
}
export default useDevice
