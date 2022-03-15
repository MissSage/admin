export interface IGwtjLeftTop {
  pipeTotal: number
  pipeBridgeTotal: number
  sinkPipeTotal: number
}
import { hexToRgba } from '@/utils/chartUtils'
const getData = (data?: any[], isRandom?: boolean) => {
  if(!data) data = []
  for (let i = 0; i < 30; i++) {
    if (isRandom) {
      data.push(Math.random().toFixed(2))
    } else {
      data.push('10.' + i)
    }
  }
  return data
}
export const initOption = () => {
  const option = {
    tooltip: {
      trigger:'axis'
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
        name: '（mp）',
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
        data: getData([],true),
        smooth: true,
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
