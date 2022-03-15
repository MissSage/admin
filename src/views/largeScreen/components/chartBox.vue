<template>
  <div class="chartDrawer" :class="{ chartVisible: chartVisible }">
    <div class="line-chart-content">
      <div class="chartInfo">
        <div class="lineBox">
          <span>最大值：</span>
          <span class="valueBox">{{ chartInfo.max }}</span>
        </div>
        <div class="lineBox">
          <span>最小值：</span>
          <span class="valueBox">{{ chartInfo.min }}</span>
        </div>
        <div class="lineBox">
          <span>平均值：</span>
          <span class="valueBox">{{ chartInfo.average }}</span>
        </div>
      </div>
      <div class="line-chart">
        <p class="l-c-title">
          {{ config.title || '暂无' }}
        </p>
        <VChart ref="chartsBox" :option="chartsOptions" :autoresize="true"></VChart>
      </div>
    </div>
    <div class="closeBtn" @click="config.close">×</div>
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { dataChart } from '../chartData/index'
export default defineComponent({
  props: {
    config: {
      type: Object,
      default() {
        return {
          visible: false,
          title: '',
          close: () => {
            //do sth
          },
          data: []
        }
      }
    },
    chartInfo: {
      type: Object,
      default() {
        return {
          max: 44,
          min: 23,
          average: 35
        }
      }
    }
  },
  setup(props: any) {
    props.config.data
    const chartVisible = computed(() => props.config.visible)

    const chartsOptions = ref<any>(dataChart)
    const chartsBox = ref<any>(null)

    onMounted(() => {
      setTimeout(() => {
        window.onresize = () => {
          if (chartsBox.value) chartsBox.value.resize()
        }
      }, 100)
    })

    return { chartVisible, chartsBox, chartsOptions }
  }
})
</script>

<style lang="scss" scoped>
.chartDrawer {
  width: calc(100% - 368px);
  height: 28%;
  position: absolute;
  bottom: -50%;
  left: 352px;
  background: #25262d;
  color: #69778a;
  border-radius: 8px;
  z-index: 2000;
  transition: all 1s ease;
  .closeBtn {
    width: 30px;
    height: 30px;
    position: absolute;
    top: 5px;
    font-size: 28px;
    line-height: 30px;
    right: 5px;
    cursor: pointer;
  }
  &.chartVisible {
    bottom: 16px;
  }
}

.line-chart-content {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  .chartInfo {
    width: 25%;
    font-size: 14px;
    .lineBox {
      display: flex;
      align-items: center;
      width: 70%;
      justify-content: space-between;
      margin: 5% auto;
      .valueBox {
        width: 100px;
        height: 18px;
        border-radius: 14px;
        font-size: 12px;
        border: 1px solid #69778a;
        text-align: center;
        line-height: 18px;
      }
    }
  }

  .l-c-title {
    width: 50%;
    margin: 10px auto;
    letter-spacing: 3px;
    text-align: center;
    text-align: center;
    border-radius: 8px;
  }
  .line-chart {
    width: 75%;
    height: calc(100% - 48px);
    margin: auto;
    margin-top: 3px;
  }
  .echarts {
    width: 100%;
    height: 100%;
  }
  .pretend-line {
    position: absolute;
    height: 89%;
    width: 0;
    top: 13px;
    border-left: 2px solid #020f99;
  }
  .left-line {
    left: 5px;
  }
  .right-line {
    right: 5px;
  }
}
</style>
