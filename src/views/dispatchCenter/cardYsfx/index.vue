<template>
  <DispatchCard>
    <template #header> <DispatchCardHeader title="用水分析" /> </template>
    <div class="dispatch-ysfx-top">
      <DispatchDescribeHeader :title="'用水量及水费分析'" />
      <VChart class="ysfx-chart" :option="xfoptions"></VChart>
    </div>
    <div class="dispatch-ysfx-bottom">
      <DispatchDescribeHeader :title="'不同时段用水情况'">
        <template #extra>
          <span>当前月份：{{curMonth}}</span>
        </template>
      </DispatchDescribeHeader>
      <VChart class="ysfx-chart" :option="sdoptions"></VChart>
    </div>
  </DispatchCard>
</template>

<script lang="ts">
import { initOption, initOption1 } from './index'
import { defineComponent } from 'vue'
import DispatchCard from '../components/dispatchCard.vue'
import DispatchCardHeader from '../components/dispatchCardHeader.vue'
import DispatchDescribeHeader from '../components/dispatchDescribeHeader.vue'
import useGlobal from '@/hooks/global/useGlobal'
export default defineComponent({
  name: 'CardYsfx',
  components: { DispatchCard, DispatchCardHeader, DispatchDescribeHeader },
  setup() {
    // codes here
    const {$format} = useGlobal()
    const curMonth = $format(new Date(), 'Y/M')
    const xfoptions = initOption(
      [50, 25, 11, 22, 32, 6, 33, 3, 27, 30, 18, 38],
      [100, 50, 23, 45, 63, 12, 65, 7, 55, 54, 100, 77]
    )
    const sdoptions = initOption1()
    return {
      xfoptions,
      sdoptions,
      curMonth
    }
  }
})
</script>

<style lang="scss" scoped>
.sl-dispatch-card {
  width: 564px;
  height: 600px;
  background: url('~@/assets/dispatchCenterImages/监测点／用水／水表背景框.png') no-repeat;
}
.dispatch-describe-header {
  margin-left: 44px;
}
.dispatch-ysfx-top {
  height: 250px;
}
.dispatch-ysfx-bottom{
  height: 250px;
}
</style>
