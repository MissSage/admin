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

export const deviceInfoChart = {
  backgroundColor: 'rgba(255,255,255,0)',
  color: color,
  // legend: {
  //   right: 10,
  //   top: 10
  // },

  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      let html = ''
      params.forEach(v => {
        // console.log(v)
        html += `<div style="color: #fff;font-size: 14px;line-height: 24px">
                <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                  color[v.seriesIndex]
                };"></span>
                ${v.name}
                <span style="color:${color[v.seriesIndex]};font-weight:700;font-size: 18px">${
          v.value
        }</span>台`
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
    top: 20,
    right: 20,
    left: 40,
    bottom: 40
    // containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      axisLabel: {
        // formatter: '{value}月',
        textStyle: {
          color: '#808184'
        }
      },
      axisLine: {
        lineStyle: {
          color: '#808184'
        }
      },
      axisTick: {
        show: false
      },
      data: ['8/10', '8/11', '8/12', '8/13', '8/14', '8/15', '8/16']
    }
  ],
  yAxis: [
    {
      type: 'value',
      // scale: true,
      axisLabel: {
        textStyle: {
          color: '#808184'
        }
      },
      nameTextStyle: {
        color: '#808184',
        fontSize: 12
        // lineHeight: 40
      },
      splitLine: {
        show: false
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#808184'
        }
      },
      axisTick: {
        show: false
      }
    }
  ],
  series: [
    {
      // name: '2020',
      type: 'line',
      showSymbol: false,
      // symbolSize: 8,
      zlevel: 3,
      lineStyle: {
        color: color[0],
        shadowBlur: 3,
        shadowColor: hexToRgba(color[0], 0.5),
        shadowOffsetY: 8
      },
      areaStyle: {
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
      },
      data: [20, 40, 10, 30, 25, 10, 15]
    }
  ]
}

export const dataChart = {
  color: ['#BAAD6F', '#71A48E', '#8E8BB4', '#B77487', '#76A6B1'],
  tooltip: {
    trigger: 'axis'
  },

  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '7%',
    containLabel: true,
    height: '90%'
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    axisLine: {
      onZero: true,
      lineStyle: {
        color: '#747685'
      }
    },
    splitLine: {
      show: false
    },

    data: [
      '2021-04-14',
      '2021-04-15',
      '2021-04-16',
      '2021-04-17',
      '2021-04-18',
      '2021-04-19',
      '2021-04-20'
    ]
  },
  dataZoom: {
    show: true,
    type: 'inside',
    realtime: true,
    start: 0,
    end: 100,
    top: '95%',
    bottom: '00%'
    // xAxisIndex: [0, 1]
  },
  yAxis: {
    type: 'value',
    name: '速度(mm/s)',
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#40424D'],
        width: 1,
        type: 'solid'
      }
    },
    axisLine: {
      lineStyle: {
        color: '#747685'
      }
    }
  },
  series: [
    {
      name: 'X1',
      type: 'line',
      smooth: true,
      data: [120, 132, 101, 134, 90, 230, 210]
    }
  ],
  textStyle: {
    color: '#888EAE'
  }
}
