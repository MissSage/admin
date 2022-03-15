import { hexToRgba } from '@/utils/chartUtils'
import * as echarts from 'echarts'
const getData = (data?: any[], isRandom?: boolean) => {
  if (!data) data = []
  for (let i = 0; i < 30; i++) {
    if (isRandom) {
      data.push(Math.random() * 100)
    } else {
      data.push('10.' + i)
    }
  }
  return data
}
export const initOption = () => {
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      splitLine: {
        show: false
      },
      data: getData()
    },
    yAxis: [
      {
        type: 'value',
        name: '（个）',
        axisLine: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: hexToRgba('#094055', 0.4)
          }
        }
      }
    ],
    series: [
      {
        data: getData([], true),
        smooth: true,
        showSymbol: false,
        type: 'line',
        color: '#40ABFF',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: hexToRgba('#40ABFF', 0.4)
            },
            {
              offset: 1,
              color: hexToRgba('#40ABFF', 0)
            }
          ])
        }
      }
    ]
  }
  return option
}
