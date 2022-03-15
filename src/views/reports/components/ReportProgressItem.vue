<template>
  <div class="dispatch-progress">
    <div class="dispatch-progress__info">
      <span class="dispatch-progress__info__label">{{ data.label }}</span>
      <span class="dispatch-progress__info__count">{{ data.count }}</span>
      <span class="dispatch-progress__info__unit">{{ data.unit }}</span>
    </div>
    <el-progress
      class="dispatch-progress__progress"
      :show-text="false"
      :stroke-width="8"
      :percentage="data.percentage"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'ReportProgressItem',
  props: {
    data: {
      type: Object as PropType<any>,
      default: () => {
        return {
          //
        }
      }
    }
  },
  setup() {
    // codes here
  }
})
</script>

<style lang="scss" scoped>
.dispatch-progress {
  height: 46px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  font-family: PingFangSC-Regular, PingFang SC;
  :deep(.el-progress-bar__outer){
    background-color: #153450;
  }
  .dispatch-progress__info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .dispatch-progress__info__label {
      flex: 1;
      font-size: 12px;
      font-weight: 400;
      color: #ffffff;
      line-height: 22px;
    }
    .dispatch-progress__info__count {
      font-size: 16px;
      font-weight: 500;
      color: #53ecff;
      line-height: 22px;
      margin-right: 8px;
    }
    .dispatch-progress__info__unit {
      font-size: 12px;
      font-weight: 400;
      color: #32929e;
      line-height: 22px;
    }
  }
}
</style>
