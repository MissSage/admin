<template>
  <VChart :option="options"></VChart>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'PieProgress',
  props: {
    modelValue: {
      default: 0,
      type: Number
    }
  },

  setup(props) {
    // codes here
    const lasted = computed(() => 100 - props.modelValue)
    const gaugeData = [
      {
        value: props.modelValue,
        detail: {
          valueAnimation: true,
          offsetCenter: ['0%', '0%']
        }
      }
    ]

    const options = {
      // title: {
      //   text: '处理完成率',
      //   textStyle: {
      //     color: '#FFFFFF',
      //     fontSize: 14
      //   },
      //   bottom: 0,
      //   right: 90
      // },
      series: [
        {
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          pointer: {
            show: false
          },
          clockwise: true, // 是否反向
          progress: {
            show: true,
            overlap: false,
            roundCap: true,
            clip: false,
            itemStyle: {
              borderWidth: 1,
              borderColor: '#3296FB',
              color: '#3296FB',
              clip: true
            }
          },
          axisLine: {
            lineStyle: {
              width: 10,
              color: [
                [0, '#153450'],
                [100, '#153450']
              ]
            }
          },
          splitLine: {
            show: false,
            distance: 0,
            length: 10
          },
          markLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false,
            distance: 50
          },
          data: gaugeData,
          title: {
            fontSize: 14
          },
          detail: {
            width: 50,
            height: 30,
            fontSize: 30,
            color: '#3296FB',
            borderColor: 'inherit',
            borderRadius: 20,
            borderWidth: 0,
            formatter: '{value}%'
          }
        }
      ]
    }

    return {
      options,
      lasted
    }
  }
})
</script>

<style lang="scss" scoped></style>
