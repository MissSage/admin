<template>
  <DispatchCard>
    <template #header><DispatchCardHeader :title="'报警分析'" /></template>
    <div class="dispatch-chart-box">
      <PieChart :data="pieData"/>
      <ProgressChart v-model="progress" />
    </div>
  </DispatchCard>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import DispatchCard from '../components/dispatchCard.vue'
import DispatchCardHeader from '../components/dispatchCardHeader.vue'
import PieChart from './PieChart.vue'
import ProgressChart from './ProgressChart.vue'
import { getPieData, IPieItem } from './index'
export default defineComponent({
  name: 'CardBjfx',
  components: { DispatchCard, DispatchCardHeader, PieChart, ProgressChart },
  setup() {
    // codes here
    const state = reactive<{
      progress: number
      pieData: IPieItem[]
    }>({
      progress: 80,
      pieData:getPieData()
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>

<style lang="scss" scoped>
.sl-dispatch-card {
  width: 564px;
  height: 368px;
  background: url('~@/assets/dispatchCenterImages/漏损率／排行／报警／工单背景框.png') no-repeat;
}
.dispatch-chart-box {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  height: 330px;
}
</style>
