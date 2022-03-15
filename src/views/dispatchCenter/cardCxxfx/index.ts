import { hexToRgba } from '@/utils/chartUtils'
import * as echarts from 'echarts'

export const initOption = (data1: any[], data2: any[]) => {
  const option = {
    legend: {
      data: ['今年', '去年'],
      right: 40,
      textStyle: {
        color: '#718092'
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      gridIndex: 0,
      data: [
        '一月',
        '二月',
        '三月',
        '四月',
        '五月',
        '六月',
        '七月',
        '八月',
        '九月',
        '十月',
        '十一月',
        '十二月'
      ]
    },
    yAxis: {
      splitLine: {
        show: true,
        lineStyle: {
          color: hexToRgba('#094055', 0.4)
        }
      }
    },
    series: [
      // These series are in the first grid.
      {
        type: 'bar',
        name: '今年',
        data: data1,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: hexToRgba('#FF5B69', 1) },
          { offset: 1, color: hexToRgba('#861E24', 0.4) }
        ])
      },
      {
        type: 'bar',
        name: '去年',
        data: data2,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: hexToRgba('#FFCE5B', 1) },
          { offset: 1, color: hexToRgba('#865D1E', 0.4) }
        ])
      }
    ]
  }
  return option
}
