import { IControlAlarm, IControlAlarmDetail, QueryAlarmListParam } from '../../index'
import { ref } from 'vue'
import { getHistoryAlarmList } from '@/api/alarm'

const useAlarm = () => {
  const AlarmTable = ref<IControlAlarm[]>([])
  const getAlarmTable = async (params:QueryAlarmListParam) => {
    const res = await getHistoryAlarmList(params)
    AlarmTable.value = []
    let total = 0

    if(res&&res.data){
      AlarmTable.value = res.data.data
      total = res.data.total
    }
    return {
      total
    }
  }
  const AlarmDetail = ref<IControlAlarmDetail[]>([])
  const getAlarmDetail = (params: any) => {
    AlarmDetail.value = []
    // AlarmDetail.value = [
    //   {
    //     alarmInfo: 'infoinfoinfo',
    //     alarmTime: '2022-12-12 12:12:12',
    //     deAlarmTime: '2022-12-13 12:12:12'
    //   },
    //   {
    //     id: 'bbb',
    //     alarmInfo: 'infoinfoinfo',
    //     alarmTime: '2022-12-12 12:12:12',
    //     deAlarmTime: '2022-12-13 12:12:12'
    //   },
    //   {
    //     id: 'ccc',
    //     alarmInfo: 'infoinfoinfo',
    //     alarmTime: '2022-12-12 12:12:12',
    //     deAlarmTime: '2022-12-13 12:12:12'
    //   },
    //   {
    //     id: 'ddd',
    //     alarmInfo: 'infoinfoinfo',
    //     alarmTime: '2022-12-12 12:12:12',
    //     deAlarmTime: '2022-12-13 12:12:12'
    //   },
    //   {
    //     id: 'eee',
    //     alarmInfo: 'infoinfoinfo',
    //     alarmTime: '2022-12-12 12:12:12',
    //     deAlarmTime: '2022-12-13 12:12:12'
    //   }
    // ]
  }
  return {
    AlarmTable,
    getAlarmTable,
    AlarmDetail,
    getAlarmDetail
  }
}
export default useAlarm
