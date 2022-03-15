import { hexToRgba } from '@/utils/chartUtils'

/**
 * 消费分析
 * @param data1 水费数组
 * @param data2 用水量数组
 * @returns
 */
export const initOption = (data1, data2) => {
  const option = {
    legend: {
      data: ['用水量', '水费'],
      right: 10,
      textStyle: {
        color: '#718092'
      }
    },
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
    yAxis: [
      {
        type: 'value',
        name: '（t）',
        axisLine: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: hexToRgba('#094055', 0.4)
          }
        }
      },
      {
        type: 'value',
        name: '（万元）',
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
        data: data1,
        type: 'line',
        name: '水费',
        showSymbol: false,
        smooth: true,
        color: '#FC6A88',
        lineStyle: {
          colorBy: 'seriese'
        }
      },
      {
        data: data2,
        smooth: true,
        name: '用水量',
        yAxisIndex: 1,
        showSymbol: false,
        type: 'line',
        color: '#2D83D3',
        areaStyle: {
          color: {
            type: 'linear',
            colorStops: [
              {
                offset: 0,
                color: '#2275A6' // 0% 处的颜色
              },
              {
                offset: 0.8,
                color: '#2D83D3' // 100% 处的颜色
              }
            ]
          }
        }
      }
    ]
  }
  return option
}
export const initOption1 = () => {
  const option = {
    legend: {
      show: false
    },
    tooltip: {
      trigger: 'axis'
    },
    // dataset: {
    //   source: [
    //     [
    //       'product',
    //       '01|02|03',
    //       '04|05|06',
    //       '07|08|09',
    //       '10|11|12',
    //       '13|14|15',
    //       '16|17|18',
    //       '19|20|21',
    //       '22|23|24'
    //     ],
    //     ['第一个小时', 41.1, 30.4, 65.1, 41.1, 30.4, 65.1, 41.1, 30.4],
    //     ['第二个小时', 86.5, 92.1, 85.7, 24.1, 67.2, 79.5, 24.1, 67.2],
    //     ['第三个小时', 24.1, 67.2, 79.5, 86.5, 92.1, 85.7, 24.1, 86.5]
    //   ]
    // },
    xAxis: {
      type: 'category',
      gridIndex: 0,
      data: [
        '01|02|03',
        '04|05|06',
        '07|08|09',
        '10|11|12',
        '13|14|15',
        '16|17|18',
        '19|20|21',
        '22|23|24'
      ]
    },
    yAxis: {
      gridIndex: 0,
      name: '（m³）',
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
        name: '第一个小时',
        seriesLayoutBy: 'row',
        data: [41.1, 30.4, 65.1, 41.1, 30.4, 65.1, 41.1, 30.4],
        color: '#F7E926'
      },
      {
        type: 'bar',
        name: '第二个小时',
        seriesLayoutBy: 'row',
        data: [86.5, 92.1, 85.7, 24.1, 67.2, 79.5, 24.1, 67.2],
        color: '#45CCFE'
      },
      {
        type: 'bar',
        name: '第三个小时',
        seriesLayoutBy: 'row',
        data: [24.1, 67.2, 79.5, 86.5, 92.1, 85.7, 24.1, 86.5],
        color: '#02FD76'
      }
    ]
  }
  return option
}
