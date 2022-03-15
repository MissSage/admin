const color = ['#0090FF', '#36CE9E', '#FFC005', '#FF515A', '#8B5CFF', '#00CA69']
import * as echarts from 'echarts'
const hexToRgba = (hex, opacity) => {
  let rgbaColor = ''
  const reg = /^#[\da-f]{6}$/i
  if (reg.test(hex)) {
    rgbaColor = `rgba(${parseInt('0x' + hex.slice(1, 3))},${parseInt(
      '0x' + hex.slice(3, 5)
    )},${parseInt('0x' + hex.slice(5, 7))},${opacity})`
  }
  return rgbaColor
}

export const grossYieldChart = {
  backgroundColor: 'rgba(255,255,255,0)',
  color: color,
  // legend: {
  //   right: 10,
  //   top: 10
  // },
  title: {
    text: '2020-2021年农业总产值对比',
    x: 'center',
    y: 0,
    textStyle: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'normal'
    }
  },
  tooltip: {
    trigger: 'axis',
    formatter: function(params) {
      let html = ''
      params.forEach(v => {
        // console.log(v)
        html += `<div style="color: #fff;font-size: 14px;line-height: 24px">
                <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
  color[v.seriesIndex]
};"></span>
                ${v.seriesName}.${v.name}
                <span style="color:${
  color[v.seriesIndex]
};font-weight:700;font-size: 18px">${v.value}</span>
                万元`
      })

      return html
    },
    extraCssText:
      'background: rgba(0, 0, 0, 0.3); border-radius: 0;box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #fff;',
    axisPointer: {
      type: 'shadow',
      shadowStyle: {
        color: 'rgba(225,225,225,0.2)',
        shadowColor: 'rgba(225,225,225,0.1)',
        shadowBlur: 5
      }
    }
  },
  grid: {
    // top: 100,
    top: 40,
    right: 10,
    left: 40,
    bottom: 30
    // containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      // boundaryGap: false,
      axisLabel: {
        // formatter: '{value}月',
        textStyle: {
          color: '#fff'
        }
      },
      axisLine: {
        lineStyle: {
          color: '#D9D9D9'
        }
      },
      data: [
        '1月',
        '2月',
        '3月',
        '4月',
        '5月',
        '6月',
        '7月',
        '8月',
        '9月',
        '10月',
        '11月',
        '12月'
      ]
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: '(万元)',
      scale: true,
      axisLabel: {
        textStyle: {
          color: '#fff'
        }
      },
      nameTextStyle: {
        color: '#fff',
        fontSize: 12
        // lineHeight: 40
      },
      splitLine: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#fff'
        }
      },
      axisTick: {
        show: false
      }
    }
  ],
  series: [
    {
      name: '2020',
      type: 'line',
      showSymbol: false,
      // symbolSize: 8,
      zlevel: 3,
      lineStyle: {
        normal: {
          color: color[0],
          shadowBlur: 3,
          shadowColor: hexToRgba(color[0], 0.5),
          shadowOffsetY: 8
        }
      },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: hexToRgba(color[0], 0.3)
              },
              {
                offset: 1,
                color: hexToRgba(color[0], 0.1)
              }
            ],
            false
          ),
          shadowColor: hexToRgba(color[0], 0.1),
          shadowBlur: 10
        }
      },
      data: [100, 138, 350, 173, 180, 150, 180, 230, 310, 260, 170, 210]
    },
    {
      name: '2021',
      type: 'line',
      showSymbol: false,
      // symbolSize: 8,
      zlevel: 3,
      lineStyle: {
        normal: {
          color: color[1],
          shadowBlur: 3,
          shadowColor: hexToRgba(color[1], 0.5),
          shadowOffsetY: 8
        }
      },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: hexToRgba(color[1], 0.3)
              },
              {
                offset: 1,
                color: hexToRgba(color[1], 0.1)
              }
            ],
            false
          ),
          shadowColor: hexToRgba(color[1], 0.1)
          // shadowBlur: 10
        }
      },
      data: [233, 233, 200, 180, 200, 233, 210, 180, 150, 240, 260, 220]
    }
  ]
}

export const gardenYieldChart = {
  // tooltip: {
  //   trigger: 'axis',
  //   extraCssText:
  //     'background: rgba(0, 0, 0, 0.3); border-radius: 0;box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #fff;',
  //   axisPointer: {
  //     type: 'shadow',
  //     shadowStyle: {
  //       color: 'rgba(225,225,225,0.2)',
  //       shadowColor: 'rgba(225,225,225,0.1)',
  //       shadowBlur: 5
  //     }
  //   }
  // },
  title: [
    {
      text: '园区产量情况',
      x: '12%',
      y: '80%',
      textStyle: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'normal'
      }
    },
    {
      text: '园区产量情况',
      x: '62%',
      y: '80%',
      textStyle: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'normal'
      }
    }
  ],

  color: ['#00A6AA', '#16C2C2', '#0070C0', '#42ACD1', '#F0F0F0', '#FCB908'],

  radar: [
    {
      indicator: [
        { text: '茶', max: 150, axisLabel: { show: true }},
        { text: '蔬菜', max: 150, axisLine: { show: false }},
        { text: '药材', max: 150, axisLine: { show: false }},
        { text: '水果', max: 150, axisLine: { show: false }},
        { text: '粮油', max: 150, axisLine: { show: false }}
      ],
      name: { fontSize: 0 },
      center: ['25%', '50%'],
      radius: '60%',
      splitNumber: 3,
      splitLine: {
        lineStyle: {
          color: '#9f9e9f',
          type: 'dashed',
          opacity: 1,
          width: 1
        }
      },
      splitArea: {
        show: false
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#9f9e9f',
          width: 2
        }
      }
    },
    {
      indicator: [
        { text: '茶', max: 150, axisLabel: { show: true }},
        { text: '蔬菜', max: 150, axisLine: { show: false }},
        { text: '药材', max: 150, axisLine: { show: false }},
        { text: '水果', max: 150, axisLine: { show: false }},
        { text: '粮油', max: 150, axisLine: { show: false }}
      ],
      radius: '60%',
      name: { fontSize: 0 },
      center: ['75%', '50%'],
      splitNumber: 3,
      splitLine: {
        lineStyle: {
          color: '#9f9e9f',
          type: 'dashed',
          opacity: 1,
          width: 1
        }
      },
      splitArea: {
        show: false
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#9f9e9f',
          width: 2
        }
      }
    }
  ],
  series: [
    {
      type: 'radar',
      tooltip: {
        trigger: 'item'
      },
      lineStyle: {
        normal: {
          color: '#63a4b9',
          width: 2
        }
      },
      areaStyle: {
        normal: {
          color: '#63a4b9',
          opacity: 0.4
        }
      },
      symbol: 'none',

      data: [{ value: [90, 150, 60, 120, 120, 90], name: '园区1' }]
    },
    {
      type: 'radar',
      tooltip: {
        trigger: 'item'
      },
      radarIndex: 1,
      lineStyle: {
        normal: {
          color: '#6e6dc1',
          width: 2
        }
      },
      areaStyle: {
        normal: {
          color: '#6e6dc1',
          opacity: 0.4
        }
      },
      symbol: 'none',
      data: [{ value: [90, 120, 120, 60, 120], name: '园区2' }]
    }
  ]
}

export const monthYieldChart = {
  backgroundColor: 'rgba(0,0,0,0)',
  tooltip: {
    trigger: 'item'
  },
  title: {
    text: '2021年产量统计',
    x: 'center',
    y: 0,
    textStyle: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'normal'
    }
  },
  legend: {
    data: [
      {
        name: '产量',
        itemStyle: {
          color: '#1F98D8'
        }
      },
      {
        name: '产值',
        itemStyle: {
          color: '#43D5A0'
        }
      }
    ],
    top: '20',
    right: '10',
    itemGap: 20,
    itemWidth: 8,
    itemHeight: 8,
    show: false,
    textStyle: {
      color: '#eee',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontFamily: 'sans-serif',
      fontSize: 12
    }
  },
  xAxis: {
    type: 'category',
    data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月'],
    axisTick: {
      show: false // 不显示坐标轴刻度线
    },
    axisLine: {
      lineStyle: {
        color: '#D9D9D9'
      }
    },
    axisLabel: {
      show: true,
      interval: 0,
      textStyle: {
        color: '#fff', // X轴文字颜色
        fontSize: 12
      }
    }
  },
  grid: {
    containLabel: true,
    left: 10,
    right: 10,
    top: 50,
    bottom: 20
  },
  yAxis: [
    {
      type: 'value',
      name: '(万元)',
      scale: true,
      axisLabel: {
        textStyle: {
          color: '#fff'
        }
      },
      nameTextStyle: {
        color: '#fff',
        fontSize: 12
        // lineHeight: 40
      },
      splitLine: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#D9D9D9'
        }
      },
      axisTick: {
        show: false
      }
    }
  ],
  series: [
    {
      name: '产量',
      data: [2000, 1600, 2800, 2600, 3600, 3100, 4200],
      type: 'bar',
      barWidth: 8,
      itemStyle: {
        fontSize: 16,
        normal: {
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: '#1F98D8' // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(31,152,216,.4)' // 100% 处的颜色
              }
            ],
            false
          )
        }
      }
    },
    {
      name: '产值',
      data: [1800, 2400, 3200, 2300, 3800, 2800, 4400],
      type: 'bar',
      barWidth: 8,
      itemStyle: {
        fontSize: 16,
        normal: {
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: '#43D5A0' // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(67,213,160,.4)' // 100% 处的颜色
              }
            ],
            false
          )
        }
      }
    }
  ]
}

export const cropsProportionChart = {
  legend: {
    top: 'bottom',
    show: false
  },
  color: [
    '#8d48e3',
    '#ff8a45',
    '#05c091',
    '#58d9f9',
    '#ff6e76',
    '#fddd60',
    '#7cffb2',
    '#4992ff'
  ],
  grid: {
    containLabel: true,
    left: 10,
    right: 10,
    top: 50,
    bottom: 20
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b} : {c} ({d}%)'
  },
  series: [
    {
      name: '面积模式',
      type: 'pie',
      radius: ['15%', '76%'],
      center: ['50%', '50%'],
      roseType: 'area',
      itemStyle: {
        borderRadius: 10
      },
      labelLine: {
        length: 1,
        length2: 20
      },
      label: {
        color: '#fff'
      },
      data: [
        { value: 40, name: '茶叶' },
        { value: 38, name: '蔬菜' },
        { value: 32, name: '烟草' },
        { value: 30, name: '食用菌' },
        { value: 28, name: '牲畜' },
        { value: 26, name: '水产品' },
        { value: 22, name: '粮油作物' },
        { value: 18, name: '水果' }
      ]
    }
  ]
}
