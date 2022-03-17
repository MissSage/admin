<template>
  <div ref="chartBox" class="chartBox"></div>
</template>

<script lang='ts'>
import {
  defineComponent,
  onMounted,
  onUnmounted,
  PropType,
  reactive,
  ref,
  toRefs,
  watch
} from 'vue'
import * as echarts from 'echarts'
import { ICounterOrderParams, IOrderCatogaries } from '@/common/types/workorder'
import { countOrder } from '@/api/workorder'
import { color, initOption } from '../index'
export default defineComponent({
  name: 'Chart',
  props: {
    countType: {
      type: String,
      default: ''
    },
    queryType: {
      type: String as PropType<IOrderCatogaries>,
      default: ''
    }
  },
  setup (props) {
    const { countType, queryType } = toRefs(props)
    const state = reactive<{
      chartIns: any
      angle: number
      timer: any
      option: any
    }>({
      chartIns: null,
      angle: 0,
      timer: null,
      option: {}
    })
    const resetChart = async () => {
      if (state.timer) {
        clearInterval(state.timer)
      }
      const params: ICounterOrderParams = {
        queryType: queryType.value,
        countType: countType.value
      }

      const res = await countOrder(params)
      console.log(res)
      let total = 0
      total = res.data
        ? res.data.reduce((prev: any, next: { value: any }) => {
          return prev + next.value
        }, total)
        : 0
      const data: any[] = []
      const legend: any[] = []
      const colors: any[] = []
      res.data &&
        res.data.map((item: { value: any; key: any }, i: number) => {
          data.push(
            {
              value: item.value,
              name: item.key,
              itemStyle: {
                borderWidth: 5,
                shadowBlur: 20,
                borderColor: color[i],
                shadowColor: color[i]
              }
            },
            {
              value: 0.02,
              name: '',
              itemStyle: {
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                },
                color: 'rgba(0, 0, 0, 0)',
                borderColor: 'rgba(0, 0, 0, 0)',
                borderWidth: 0
              }
            }
          )
          legend.push(item.key)
          colors.push(color[i % color.length])
        })
      state.timer = setInterval(function () {
        // 用setInterval做动画感觉有问题
        state.angle += 3
        state.option = initOption(data, legend, colors, total, state.angle)
        initChart()
      }, 33)
    }
    const chartBox = ref<HTMLDivElement>()
    const initChart = () => {
      if (!state.chartIns) {
        if (chartBox.value) {
          state.chartIns = echarts.init(chartBox.value)
        } else {
          console.log('没有找到dom')
          return
        }
      }
      state.chartIns.setOption(state.option)
    }
    watch(queryType, () => {
      resetChart()
    })
    watch(countType, () => {
      resetChart()
    })
    onMounted(() => {
      resetChart()
      window.onresize = function () {
        // 自适应大小
        state.chartIns && state.chartIns.resize()
      }
    })
    onUnmounted(() => {
      if (state.timer) {
        clearInterval(state.timer)
      }
    })
    return {
      ...toRefs(state),
      chartBox,
      initOption,
      initChart,
      resetChart
    }
  }
})
</script>

<style lang='scss' scoped>
.chartBox {
  width: 100%;
  height: 360px;
}
</style>
