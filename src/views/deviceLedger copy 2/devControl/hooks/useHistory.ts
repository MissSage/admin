
import { queryDeviceDataIstar } from '@/api/tsdb'
import useGlobal from '@/hooks/global/useGlobal'
import { removeSlash } from '@/utils/removeIdSlash'
import { ref } from 'vue'
import { ControlInfo, IControlHis, QueryTrendListParam } from '../..'

const useHistory = () => {
  const HistoryTable = ref<IControlHis[]>([])
  /**
   * 设置table列
   * @returns 
   */
  const InitHistoryTableColums = (device?:ControlInfo) => {
    const {$format} = useGlobal()
    const columns:CTColum[] = [{
      prop: 'alarmTime',
      label: '采集时间',
      formatter: (row: any) => (row.alarmTime ? $format(row.alarmTime) : ''),
      minWidth: '180'
    }]
    if(device&&device.propertyDataList){
      device.propertyDataList.map(item=>{
        columns.push({
          label: item.propertyName,
          prop:item.property
        })
      })
    }
    
    return columns
  }
  const getHistoryTable = async (params: QueryTrendListParam, device: ControlInfo) => {
    
    params.attributes = device.propertyDataList.map(item=>{
      return removeSlash(device.id.id || '') + '.' + item.property
    })
    const res = await queryDeviceDataIstar(params)
    HistoryTable.value = []
    if(!res||!res.data) return []
    for(const key in res.data){
      const item = res.data[key]
      const tableItem:IControlHis = {}
      for(const key1 in item){
        const label = key1.indexOf('.')===-1?key1:key1.split('.')[1]
        // const property = device.propertyDataList && device.propertyDataList.find(propertyData=>propertyData.property===label)
        // label = property?property.propertyName:label
        tableItem[label]=item[key1]
      }
      tableItem.alarmTime = key
      HistoryTable.value.push(tableItem)
    }
  }
  const TrendList = ref<NormalOption[]>([])
  /**
   * 获取设备变量的趋势数据
   * @param params 
   * @returns 
   */
  const getTrendList = async (params:QueryTrendListParam) => {
    TrendList.value = []
    const res = await queryDeviceDataIstar(params)
    if(!res||!res.data) return []
    for(const key in res.data){
      let value = 0
      const item = res.data[key]
      for(const key1 in item){
        value = item[key1]
      }
      TrendList.value.push({label:key,value:value})
    }
  }
  return {
    HistoryTable,
    getHistoryTable,
    TrendList,
    getTrendList,
    InitHistoryTableColums
  }
}
export default useHistory
