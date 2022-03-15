<template>
  <DispatchCard>
    <template #header> <DispatchCardHeader title="设备统计" /> </template>
    <div class="dispatch-sbtj-top">
      <VChart class="sbtj-chart-left" :option="progressOption"></VChart>
      <VChart class="sbtj-chart-right" :option="barOption"></VChart>
    </div>
    <DispatchInnerCard title="设备信息">
      <div class="sbtj-sbxx-container">
        <CardSbxxItem v-for="(item, i) in sbxxList" :key="i" :data="item" />
      </div>
    </DispatchInnerCard>
    <div class="dipatch-sbtj-bottom">
      <DispatchDescribeHeader title="设备在线情况" />
      <VChart class="sbtj-chart" :option="xfoptions"></VChart>
    </div>
  </DispatchCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DispatchCard from '../components/dispatchCard.vue'
import DispatchCardHeader from '../components/dispatchCardHeader.vue'
import DispatchDescribeHeader from '../components/dispatchDescribeHeader.vue'
import DispatchInnerCard from '../components/dispatchInnerCard.vue'
import CardSbxxItem from './cardSbxxItem.vue'
import { initOption, getTopLeftPieChartOption, getTopRightBarChartOption } from './index'
export default defineComponent({
  name: 'CardSbtj',
  components: {
    DispatchCard,
    DispatchCardHeader,
    DispatchDescribeHeader,
    DispatchInnerCard,
    CardSbxxItem
  },
  setup() {
    // codes here
    const progressOption = getTopLeftPieChartOption(60)
    const data = [
      { label: '水表', value: 50 },
      { label: '压力计', value: 55 },
      { label: '流量计', value: 40 },
      { label: '水质监测器', value: 70 }
    ]
    const barOption = getTopRightBarChartOption(data)
    const xfoptions = initOption()
    const sbxxList = [
      {
        name: '管网',
        icon: '设备(4)',
        newAdd: 14.22,
        total: 233.44,
        persentageIncreased: '13%',
        unit: 'km'
      },
      {
        name: '泵站',
        icon: '设备(5)',
        newAdd: 3,
        total: 34,
        persentageIncreased: '2%',
        unit: '个'
      },
      {
        name: '压力计',
        icon: '设备(6)',
        newAdd: 18,
        total: 422,
        persentageIncreased: '9%',
        unit: '个'
      },
      {
        name: '流量计',
        icon: '设备(7)',
        newAdd: 32,
        total: 642,
        persentageIncreased: '22%',
        unit: '个'
      },
      {
        name: '阀门',
        icon: '设备(8)',
        newAdd: 9,
        total: 318,
        persentageIncreased: '5%',
        unit: '个'
      },
      {
        name: '水表',
        icon: '设备(9)',
        newAdd: 77,
        total: 2153,
        persentageIncreased: '41%',
        unit: '个'
      },
      {
        name: '水质传感器',
        icon: '设备(10)',
        newAdd: 4,
        total: 57,
        persentageIncreased: '6%',
        unit: '个'
      },
      {
        name: '摄像头',
        icon: '设备(11)',
        newAdd: 16,
        total: 164,
        persentageIncreased: '11%',
        unit: '个'
      }
    ]
    return {
      xfoptions,
      sbxxList,
      progressOption,
      barOption
    }
  }
})
</script>

<style lang="scss" scoped>
.sl-dispatch-card {
  width: 564px;
  height: 1136px;
  background: url('~@/assets/dispatchCenterImages/设备统计背景框.png') no-repeat;
}
.sl-disptach-inner-card {
  width: 484px;
  height: 444px;
  background: url('~@/assets/dispatchCenterImages/设备信息内容背景.png') no-repeat;
}
.dispatch-sbtj-top {
  height: 250px;
  margin: 32px 0 0 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  .sbtj-chart-left {
    width: 80%;
  }
}
.dipatch-sbtj-bottom {
  height: 300px;
  margin: 32px 0 0 0;
}
.sbtj-sbxx-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: center;
  margin: 0 40px;
  margin-top: 25px;
}
.dispatch-describe-header {
  margin-left: 44px;
}
.sbtj-chart {
  width: 560px;
}
</style>
