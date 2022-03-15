<template>
  <DispatchCard>
    <template #header>
      <DispatchCardHeader :title="'产销差分析'" />
    </template>
    <div class="chart-box">
      <VChart :option="options"></VChart>
    </div>
  </DispatchCard>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { initOption } from './index'
import DispatchCard from '../components/dispatchCard.vue'
import DispatchCardHeader from '../components/dispatchCardHeader.vue'
export default defineComponent({
  name: 'CardCxxfx',
  components: { DispatchCard, DispatchCardHeader },
  setup() {
    // codes here
    const state = reactive<{
      options: any
    }>({
      options: initOption(
        [41.1, 38.4, 65.1, 41.1, 31.4, 65.1, 41.1, 30.4, 30.4, 65.1, 41.1, 30.4],
        [41.1, 30.4, 65.1, 41.1, 30.4, 38.3, 65.1, 41.1, 30.4, 30.4, 65.1, 41.1]
      )
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>

<style lang="scss" scoped>
.sl-dispatch-card {
  width: 1141px;
  height: 368px;
  background: url('~@/assets/dispatchCenterImages/产销差分析背景框.png') no-repeat;
}
.chart-box {
  height: 300px;
}
</style>
