export const GSLFX = {
  backgroundColor: '#1A1D2D', // this.$store.state.app.theme === '252C47' ? '#252C47' : 'white',

  grid: {
    left: '3%',
    right: '7%',
    bottom: '15%',
    top: '15%',
    containLabel: true,
    backgroundColor: 'transparent'
  },
  textStyle: {
    color: '#fff' // '#333'
  },
  // color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
  color: [
    '#9E87FF',
    '#73DDFF',
    '#fe9a8b',
    '#F56948',
    '#9E87FF',
    '#0090FF',
    '#36CE9E',
    '#FFC005',
    '#FF515A',
    '#8B5CFF',
    '#00CA69'
  ],
  tooltip: {
    trigger: 'axis',
    formatter: params => {
      let relVal = params[0].name
      for (let i = 0; i < params.length; i++) {
        relVal +=
          '<div class="circle" ><span style="background:' +
          params[i].color +
          '"></span>' +
          params[i].seriesName +
          ' : ' +
          params[i].value +
          '' +
          '名称' +
          '</div>'
      }
      return relVal
    },
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#ffffff',
        color: '#333'
      }
    }
  },
  legend: {
    data: [],
    type: 'scroll',
    left: 100,
    textStyle: {
      backgroundColor: '#222536',
      color: '#fff' // '#333'
    },
    pageIconColor: '#3E8EF7', // '#2f4554',
    pageTextStyle: {
      color: '#BCC3DF' // '#aaa'
    }
  },
  xAxis: {
    data: [],
    boundaryGap: false,
    type: 'category',
    axisLine: {
      lineStyle: {
        color: '#333' // '#333'
      }
    }
  },
  yAxis: {
    splitLine: {
      lineStyle: {
        color: '#40424D' // '#ccc'
      }
    },
    axisLine: {
      lineStyle: {
        color: '#333' // '#333'
      }
    },
    min: null,
    max: null
  },
  dataZoom: [
    {
      show: true,
      start: 53,
      end: 100,
      bottom: '3%',
      dataBackground: {
        lineStyle: {
          color: '#6070A0'
        },
        areaStyle: {
          color: 'rgba(189, 210, 225, 0.75)'
        }
      },
      textStyle: {
        color: '#fff' // '#333'
      },
      width: '90%',
      left: '3%'
    },
    {
      type: 'inside',
      start: 53,
      end: 100
    },
    {
      show: true,
      yAxisIndex: 0,
      width: 30,
      height: '80%',
      showDataShadow: false,
      left: '97%',
      filterMode: 'none',
      textStyle: {
        color: '#fff' // '#333'
      }
    }
  ],
  series: []
}
