<template>
  <div class="szjc-charbox">
    <div class="szjc-chart-title">
      <div class="szjc-chart-title__inner">
        <span class="szjc-chart-title__text" :style="'color:' + color">{{ title }}</span>
      </div>
    </div>
    <div class="szjc-line-chart">
      <VChart class="szjc-chart-content" :option="options"></VChart>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'LineChart',
  props: {
    title: {
      type: String,
      default: 'COD'
    },
    color: {
      type: String,
      default: '#40A2FF'
    },
    options: {
      type: Object as PropType<any>,
      default: () => {
        return {
          //
        }
      }
    }
  },
  setup() {
    // F
  }
})
</script>

<style lang="scss" scoped>
.szjc-charbox {
  display: flex;
  justify-content: center;
  align-content: center;
  width: 100%;
  height: 60px;
  .szjc-chart-title {
    width: 36px;
    height: 36px;
    margin: 12px 0 12px 16px;
    padding: 2px;
    text-align: center;
    border-radius: 50% 50%;
    box-sizing: border-box;
    background: linear-gradient(180deg, rgba(80, 228, 248, 1), rgba(136, 243, 252, 0.4));
    .szjc-chart-title__inner {
      width: 32px;
      height: 32px;
      background-color: #081f33;
      border-radius: 50% 50%;
      .szjc-chart-title__text {
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        line-height: 32px;
      }
    }
  }
  .szjc-line-chart {
    width: 100%;
    height: 80px;
    margin-top: -5px;
  }
}
</style>
