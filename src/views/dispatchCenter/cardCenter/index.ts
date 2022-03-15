export interface IDispatchNormalOption {
  icon?: string
  alt?: string
  label?: string
  value?: string | number
  unit?: string
}
// const uploadedDataURL = "/asset/get/s/data-1519279347346-BkslpCjwf.json";
export const initMapOption = () => {
  const option = {}
  return option
}

const points = [
  {
    name: '宜秀水厂',
    value: [117.03, 30.52]
  },
  {
    name: '供水工程1',
    value: [117.490375, 32.064111]
  },
  {
    name: '供水工程2',
    value: [116.469325, 30.260624]
  },
  {
    name: '供水工程3',
    value: [116.220961, 30.833885]
  },
  {
    name: '供水工程4',
    value: [117.223614, 30.825946]
  },
  {
    name: '供水工程5',
    value: [117.904314, 30.284578]
  },
  {
    name: '供水工程6',
    value: [116.699291, 30.092781]
  },
  {
    name: '供水工程7',
    value: [116.202564, 31.047973]
  },
  {
    name: '供水工程8',
    value: [116.588907, 31.158791]
  }
]

export const mapOption = {
  // backgroundColor: '#0E0E0E',
  backgroundColor: 'transparent',
  geo: {
    map: 'beijing',
    aspectScale: 0.75, //长宽比
    zoom: 1.1,
    roam: true,
    label: {
      show: true,
      color: '#fff'
    },
    scaleLimit:{
      min:1,
      max:10
    },
    emphasis: {
      label: {
        color: '#fff'
      },
      itemStyle: {
        areaColor: '#389BB7',
        borderWidth: 0
      }
    },
    itemStyle: {
      borderColor: 'rgba(147, 235, 248, 1)',
      borderWidth: 1,
      areaColor: {
        type: 'radial',
        x: 0.5,
        y: 0.5,
        r: 0.8,
        colorStops: [
          {
            offset: 0,
            color: 'rgba(147, 235, 248, 0)' // 0% 处的颜色
          },
          {
            offset: 1,
            color: 'rgba(147, 235, 248, .2)' // 100% 处的颜色
          }
        ],
        globalCoord: false // 缺省为 false
      },
      shadowColor: 'rgba(128, 217, 248, 1)',
      shadowOffsetX: -2,
      shadowOffsetY: 2,
      shadowBlur: 10
    }
  },
  series: [
    {
      type: 'effectScatter',
      coordinateSystem: 'geo',
      showEffectOn: 'render',
      rippleEffect: {
        period: 15,
        scale: 4,
        brushType: 'fill'
      },
      emphasis: {
        scale:true
      },
      label: {
        formatter: '{b}',
        position: 'right',
        offset: [15, 0],
        color: '#1DE9B6',
        show: true
      },
      itemStyle: {
        color: '#1DE9B6',
        shadowBlur: 10,
        shadowColor: '#333'
      },
      data: points
    }, //地图线的动画效果
    {
      type: 'lines',
      zlevel: 2,
      effect: {
        show: true,
        period: 4, //箭头指向速度，值越小速度越快
        trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
        symbol: 'arrow', //箭头图标
        symbolSize: 5 //图标大小
      },
      lineStyle: {
        color: '#1DE9B6',
        width: 0.5, //线条宽度
        opacity: 0.5, //尾迹线条透明度
        curveness: 0.3 //尾迹线条曲直度
      },
      data: [
        {
          coords: [
            [117.03, 30.52],
            [117.490375, 32.064111]
          ]
        },
        {
          coords: [
            [117.03, 30.52],
            [116.469325, 30.260624]
          ]
        },
        {
          coords: [
            [117.03, 30.52],
            [116.220961, 30.833885]
          ]
        },
        {
          coords: [
            [117.03, 30.52],
            [117.223614, 30.825946]
          ]
        },
        {
          coords: [
            [117.03, 30.52],
            [117.904314, 30.284578]
          ]
        },
        {
          coords: [
            [117.03, 30.52],
            [116.699291, 30.092781]
          ]
        },
        {
          coords: [
            [117.03, 30.52],
            [116.202564, 31.047973]
          ]
        },
        {
          coords: [
            [117.03, 30.52],
            [116.588907, 31.158791]
          ]
        }
      ]
    }
  ]
}
