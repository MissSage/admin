import { hexToRgba } from '@/utils/chartUtils'

// 摸扎数据
export const getList = (): string[] => {
  const data: string[] = []
  for (let i = 0; i < 7; i++) {
    const a = Math.random() * 100
    data.push(a.toFixed(2))
  }
  return data
}
export const initLineChartOption = (data: any[], color?: string, title?: string): any => {
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      axisTick: {
        show: false
      },
      axisLabel: {
        margin: 0
      },
      axisLine: {
        show: false
      },
      splitLine: {
        show: false
      },
      data: [
        '11-25 08:24',
        '11-25 08:24',
        '11-25 08:24',
        '11-25 08:24',
        '11-25 08:24',
        '11-25 08:24',
        '11-25 08:24'
      ]
    },
    yAxis: {
      type: 'value',
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
    series: [
      {
        data: data,
        type: 'line',
        name: title,
        showSymbol: false,
        smooth: true,
        color: color,
        lineStyle: {
          colorBy: 'seriese',
          shadowColor: color
        }
      }
    ]
  }
  return option
}
export const colors = ['#FBE400', '#40FF55', '#40A2FF', '#A524DE', '#FF7F40', '#40FCFF']
export const titles = ['COD', '氨氮', 'TN', 'PH', 'TP', 'SS']
const initOptions = () => {
  const options: any[] = []
  colors.map((item, i) => {
    const option: any = {
      title: titles[i],
      color: item,
      options: initLineChartOption(getList(), item, titles[i])
    }
    options.push(option)
  })
  return options
}
export const szjc_qsqx_data_linechart = [...initOptions()]
