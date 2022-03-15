<template>
  <div class="tabContainer">
    <p class="title">设备情况</p>
    <div class="deviceInfo">
      <div class="item">
        <i class="iconfont icon-shebei1"></i>
        <div>
          <span>设备数量</span>
          <div class="countBox">
            <span class="count total">{{ deviceCount.total }}</span> 台
          </div>
        </div>
      </div>
      <div class="item">
        <i class="iconfont icon-shebei1"></i>
        <div>
          <span>在线设备数</span>
          <div class="countBox">
            <span class="count online">{{ deviceCount.online }}</span> 台
          </div>
        </div>
      </div>
      <div class="item">
        <i class="iconfont icon-shebei1"></i>
        <div>
          <span>离线设备数</span>
          <div class="countBox">
            <span class="count outline">{{ deviceCount.offline }}</span> 台
          </div>
        </div>
      </div>
    </div>
    <p class="title">设备运行情况</p>
    <div class="chartsBox">
      <VChart ref="charts1" :option="chart1"></VChart>
    </div>
    <p class="title">设备列表</p>
    <el-table
      height="300"
      highlight-current-row
      size="mini"
      :data="deviceList"
      style="width: 100%"
      @row-click="deviceClick"
    >
      <el-table-column label="序号" type="index" width="60"> </el-table-column>
      <el-table-column show-overflow-tooltip label="设备名称" prop="name"> </el-table-column>
      <el-table-column show-overflow-tooltip label="类型" prop="type" width="80"> </el-table-column>
      <el-table-column label="状态" prop="status" width="50">
        <template #default="scope">
          <span :style="{ color: scope.row.status ? '#59FF84' : '#FF5959' }">{{
            scope.row.status ? '在线' : '掉线'
          }}</span>
        </template>
      </el-table-column>
    </el-table>
    <p class="title">报警情况</p>
    <el-table height="300" highlight-current-row size="mini" :data="alarmList" style="width: 100%">
      <el-table-column show-overflow-tooltip label="设备名称" prop="deviceName"> </el-table-column>
      <el-table-column label="时间" prop="time" width="100"> </el-table-column>
      <el-table-column label="原因" prop="cause" width="80"> </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'
import { deviceInfoChart } from '../chartData'
import { getTenantGateway, getDeviceCount } from '@/api/device'
import { getAlarmRealByProjectId } from '@/api/alarm' // , clearAlarm, alarmConfirm, getDevicesAlarm, getAlarmReal,
import useGlobal from '@/hooks/global/useGlobal'
import moment from 'moment'

export default defineComponent({
  components: {},
  setup(props, ctx) {
    const { $format } = useGlobal()
    const chart1 = ref<any>(deviceInfoChart)

    const deviceList = ref<any[]>([])
    const alarmList = ref<any[]>([])

    watch(
      () => deviceList.value,
      () =>
        ctx.emit(
          'setRestaurants',
          deviceList.value.map(item => ({ value: item.name, id: item.id }))
        )
    )

    const deviceCount = ref<{ total: number; online: number; offline: number }>({
      total: 0,
      online: 0,
      offline: 0
    })

    onMounted(async () => {
      const deviceRes = await getTenantGateway()
      deviceList.value = deviceRes.data

      const alarmRes = await getAlarmRealByProjectId({
        start: moment().subtract(1, 'year').startOf('day').valueOf(),
        end: new Date().getTime()
      })

      // const alarmTypes = {
      //   offline: '设备掉线'
      // }
      alarmList.value = alarmRes.data.map(alarm => ({
        deviceName: alarm.deviceName,
        time: $format(alarm.startTs, 'Y-M-D'),
        cause: alarm.type === 'offline' ? '设备掉线' : '检测量报警'
      }))

      const deviceCountRes = await getDeviceCount()
      deviceCount.value = deviceCountRes.data || {
        total: 0,
        online: 0,
        offline: 0
      }
    })

    const deviceClick = (row: any) => {
      ctx.emit('openChartBox', row)
    }

    return { chart1, deviceList, alarmList, deviceCount, deviceClick }
  }
})
</script>

<style lang="scss" scoped>
.tabContainer {
  overflow-y: auto;
  height: calc(100% - 70px);
}
.title {
  color: #717d92;
  margin: 0;
  height: 32px;
  line-height: 32px;
  background: #1c1d24;
  padding: 0 16px;
}
.deviceInfo {
  height: 80px;
  align-items: center;
  justify-content: space-evenly;
  display: flex;
  display: flex;
  .item {
    color: #808184;
    display: flex;
    .iconfont {
      margin-right: 5px;
      font-size: 12px;
    }
    > div {
      > span {
        color: #808184;
      }
      margin-top: 2px;
      color: #fff;
      .countBox {
        margin-top: 8px;
        height: 25px;
        line-height: 25px;
      }
      .count {
        height: 25px;
        font-size: 18px;
        font-weight: 600;
        line-height: 25px;
        &.total {
          color: #598dff;
        }
        &.online {
          color: #59ff84;
        }
        &.outline {
          color: #ff5959;
        }
      }
    }
  }
}
.chartsBox {
  height: 181px;
  width: 100%;

  .echarts {
    height: 100%;
    width: 100%;

    div:nth-of-type(1) {
      height: 100%;
      width: 100% !important;

      canvas {
        height: 100%;
        width: 100% !important;
      }
    }
  }
}
</style>
