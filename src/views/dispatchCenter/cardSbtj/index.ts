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
        name: '（%）',
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
        color: hexToRgba('#40FFD1', 0.6),
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: hexToRgba('#40FFD1', 0.4)
            },
            {
              offset: 1,
              color: hexToRgba('#40FFD1', 0)
            }
          ])
        }
      }
    ]
  }
  return option
}
export const getTopLeftPieChartOption = (value: number, option?: any) => {
  if (!option) {
    option = initTopLeftPieChartOption(value)
  } else {
    option.title.text = value + '%'
    option.series = initSeries(value)
  }
  return option
}
const initSeries = (value: number) => {
  return [
    // 蓝色进度条
    {
      name: '',
      type: 'bar',
      roundCap: true,
      showBackground: true,
      backgroundStyle: {
        color: '#464451'
      },
      data: [value],
      coordinateSystem: 'polar',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
          {
            offset: 0,
            color: '#0ff'
          },
          {
            offset: 1,
            color: '#02aeff'
          }
        ])
      }
    },
    // 蓝色刻度
    {
      hoverAnimation: false,
      type: 'pie',
      z: 2,
      data: initTopLeftPieChartLabel(value),
      radius: ['53%', '60%'],
      zlevel: -2,
      itemStyle: {
        borderColor: '#1f1e26',
        borderWidth: 4
      },
      label: {
        position: 'inside',
        show: false
      },
      emphasis: {
        itemStyle: {
          color: 'inherit'
        }
      }
    },
    // 灰色刻度
    {
      hoverAnimation: false,
      type: 'pie',
      z: 1,
      data: initTopLeftPieChartLabel1(),
      radius: ['53%', '60%'],
      zlevel: -2,
      itemStyle: {
        borderColor: '#1f1e26',
        borderWidth: 4
      },
      emphasis: {
        itemStyle: {
          color: 'inherit'
        }
      },
      label: {
        position: 'inside',
        show: false
      }
    },
    // 红色进度条
    {
      type: 'pie',
      radius: ['40%', '43%'],
      center: ['50%', '50%'],
      data: [
        {
          hoverOffset: 1,
          value: 100,
          name: '',
          itemStyle: {
            color: '#ff6189'
          },
          label: {
            show: false
          },
          labelLine: {
            smooth: true,
            lineStyle: {
              width: 0
            }
          },
          hoverAnimation: false
        },
        {
          label: {
            show: false
          },
          labelLine: {
            smooth: true,
            lineStyle: {
              width: 0
            }
          },
          value: 100 - value,
          hoverAnimation: false,
          itemStyle: {
            color: '#3c3a48'
          }
        }
      ]
    },
    // 蓝色点 - 最外圈
    {
      type: 'pie',
      zlevel: 0,
      silent: true,
      radius: ['73%', '76%'],
      z: 1,
      label: {
        show: false
      },
      labelLine: {
        show: false
      },
      data: Pie()
    },
    // 第二层 小点
    {
      type: 'pie',
      zlevel: 0,
      silent: true,
      startAngle: -155,
      radius: ['67%', '69%'],
      z: 1,
      label: {
        show: false
      },
      labelLine: {
        show: false
      },
      data: Pie3()
    },
    // 蓝色点 - 最外圈
    {
      type: 'pie',
      zlevel: 0,
      silent: true,
      startAngle: -145,
      radius: ['73%', '76%'],
      z: 1,
      label: {
        show: false
      },
      labelLine: {
        show: false
      },
      data: Pie()
    },
    // 蓝色点 - 第三层亮点
    {
      type: 'pie',
      zlevel: 0,
      silent: true,
      radius: ['65%', '64%'],
      z: 1,
      label: {
        show: false
      },
      labelLine: {
        show: false
      },
      data: Pie1()
    },
    // 蓝色点 - 第三层暗点 左
    {
      type: 'pie',
      zlevel: 0,
      silent: true,
      startAngle: -140,
      radius: ['65%', '64%'],
      z: 1,
      label: {
        show: false
      },
      labelLine: {
        show: false
      },
      data: Pie2()
    },
    // 蓝色点 - 第三层暗点  右
    {
      type: 'pie',
      zlevel: 0,
      silent: true,
      startAngle: -147.5,
      radius: ['65%', '64%'],
      z: 1,
      label: {
        show: false
      },
      labelLine: {
        show: false
      },
      data: Pie2()
    }
  ]
}
export const initTopLeftPieChartOption = (value: number) => {
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: value + '%',
      subtext: '设备完好率',
      subtextStyle: {
        color: '#79ffff',
        lineHeight: 20
      },
      x: '50%',
      top: '40%',
      textAlign: 'center',
      textStyle: {
        fontSize: '30',
        fontWeight: '100',
        color: '#79ffff',
        textAlign: 'center'
      }
    },
    polar: {
      radius: ['51%', '47%'],
      center: ['50%', '50%']
    },
    angleAxis: {
      max: 100,
      show: false,
      startAngle: 0
    },
    radiusAxis: {
      type: 'category',
      show: true,
      axisLabel: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    series: initSeries(value)
  }
  return option
}
const initTopLeftPieChartLabel = (value: number) => {
  const labelData: any[] = []
  for (let i = 0; i < 100; ++i) {
    labelData.push({
      value: 1,
      name: i,
      itemStyle: {
        normal: {
          color: 'rgba(0,209,228,0)'
        }
      }
    })
  }
  for (let i = 0; i < labelData.length; ++i) {
    if (labelData[i].name < value) {
      labelData[i].itemStyle = {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            {
              offset: 0,
              color: '#6dfbff'
            },
            {
              offset: 1,
              color: '#02aeff'
            }
          ])
        }
      }
    }
  }
  return labelData
}
const initTopLeftPieChartLabel1 = () => {
  const labelData1: any[] = []

  for (let i = 0; i < 100; ++i) {
    labelData1.push({
      value: 1,
      name: i,
      itemStyle: {
        normal: {
          color: 'rgba(0,209,228,0)'
        }
      }
    })
  }
  for (let i = 0; i < labelData1.length; ++i) {
    if (labelData1[i].name < 100) {
      labelData1[i].itemStyle = {
        normal: {
          color: '#464451'
        }
      }
    }
  }
}

function Pie() {
  const dataArr: any[] = []
  for (let i = 0; i < 100; i++) {
    if (i % 10 === 0) {
      dataArr.push({
        name: (i + 1).toString(),
        value: 30,
        itemStyle: {
          normal: {
            color: 'rgba(0,255,255,1)',
            borderWidth: 0,
            borderColor: 'rgba(0,0,0,0)'
          }
        }
      })
    } else {
      dataArr.push({
        name: (i + 1).toString(),
        value: 100,
        itemStyle: {
          normal: {
            color: 'rgba(0,0,0,0)',
            borderWidth: 0,
            borderColor: 'rgba(0,0,0,0)'
          }
        }
      })
    }
  }
  return dataArr
}

function Pie1() {
  const dataArr: any[] = []
  for (let i = 0; i < 100; i++) {
    if (i % 5 === 0) {
      dataArr.push({
        name: (i + 1).toString(),
        value: 20,
        itemStyle: {
          normal: {
            color: 'rgba(0,255,255,1)',
            borderWidth: 0,
            borderColor: 'rgba(0,0,0,0)'
          }
        }
      })
    } else {
      dataArr.push({
        name: (i + 1).toString(),
        value: 100,
        itemStyle: {
          normal: {
            color: 'rgba(0,0,0,0)',
            borderWidth: 0,
            borderColor: 'rgba(0,0,0,0)'
          }
        }
      })
    }
  }
  return dataArr
}

function Pie2() {
  const dataArr: any[] = []
  for (let i = 0; i < 100; i++) {
    if (i % 5 === 0) {
      dataArr.push({
        name: (i + 1).toString(),
        value: 20,
        itemStyle: {
          normal: {
            color: 'rgba(0,255,255,.3)',
            borderWidth: 0,
            borderColor: 'rgba(0,0,0,0)'
          }
        }
      })
    } else {
      dataArr.push({
        name: (i + 1).toString(),
        value: 100,
        itemStyle: {
          normal: {
            color: 'rgba(0,0,0,0)',
            borderWidth: 0,
            borderColor: 'rgba(0,0,0,0)'
          }
        }
      })
    }
  }
  return dataArr
}

function Pie3() {
  const dataArr: any[] = []
  for (let i = 0; i < 100; i++) {
    if (i % 10 === 0) {
      dataArr.push({
        name: (i + 1).toString(),
        value: 30,
        itemStyle: {
          normal: {
            color: 'rgba(0,255,255,.5)',
            borderWidth: 0,
            borderColor: 'rgba(0,0,0,0)'
          }
        }
      })
    } else {
      dataArr.push({
        name: (i + 1).toString(),
        value: 100,
        itemStyle: {
          normal: {
            color: 'rgba(0,0,0,0)',
            borderWidth: 0,
            borderColor: 'rgba(0,0,0,0)'
          }
        }
      })
    }
  }
  return dataArr
}
const getTopRightBarChartSeries = (data: any[]) => {
  return [
    {
      type: 'bar',
      barWidth: 16,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: hexToRgba('#66F6ED', 1)
          },
          {
            offset: 1,
            color: hexToRgba('#66F6ED', 0.4)
          }
        ])
      },
      label: {
        show: true,
        position: 'top',
        color: '#66F6ED'
      },
      data: data,
      z: 10,
      zlevel: 0
    },
    {
      // 分隔
      type: 'pictorialBar',
      itemStyle: {
        normal: {
          color: '#041745'
        }
      },
      symbolRepeat: 'fixed',
      symbolMargin: 6,
      symbol: 'rect',
      symbolClip: true,
      symbolSize: [18, 2],
      symbolPosition: 'start',
      symbolOffset: [1, 1],
      data: data,
      width: 2,
      z: 0,
      zlevel: 1
    }
  ]
}

export const getTopRightBarChartOption = (data: any[], options?: any) => {
  const legend = data.map(item => item.label),
    values = data.map(item => item.value)
  console.log(legend, values)

  if (!options) {
    options = initTopRightBarChartOption(values, legend)
  } else {
    options.series = getTopRightBarChartSeries(values)
    options.xAxis.data = legend
  }
  return options
}
const initTopRightBarChartOption = (data: any[], legend: any[]) => {
  const option = {
    backgroundColor: 'transparent',
    animation: true,
    grid: {
      top: '10%',
      bottom: '15%',
      left: '0',
      right: '10%'
    },
    tooltip: {
      show: true,
      formatter: '{b}:{c}'
    },
    xAxis: {
      data: legend,
      axisLine: {
        show: false, //隐藏X轴轴线
        textStyle: {
          color: '#393952' //X轴文字颜色
        }
      },
      axisTick: {
        show: false //隐藏X轴轴线
      },
      axisLabel: {
        hideOverlap: false,
        interval: 0
      },
      splitLine: {
        show: false
      }
    },
    yAxis: [
      {
        show: false,
        type: 'value',
        gridIndex: 0,
        // interval: 25,
        name: '标题',
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#393952'
          }
        },
        axisLabel: {
          show: true,
          margin: 14,
          fontSize: 12,
          textStyle: {
            color: '#909090'
          }
        }
      }
    ],
    series: getTopRightBarChartSeries(data),
    dataZoom: [
      {
        type: 'slider',
        show: false,
        xAxisIndex: [0],
        endValue: 4,
        startValue: 0
      }
    ]
  }
  return option
}
