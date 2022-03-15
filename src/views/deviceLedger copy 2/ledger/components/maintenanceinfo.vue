<template>
  <div class="info-container">
    <!--保养信息 -->
    <h3>保养统计</h3>
    <el-form ref="baseForm" :model="formData">
      <SLFlexGroup>
      <el-form-item label="保养次数：" prop="deviceNo" class="ls-flex-item--4">
        <span>{{ formData.total }} 次</span>
      </el-form-item>
      <el-form-item label="最近保养：" prop="deviceName" class="ls-flex-item--4">
        <span>{{ formData.executeTime }}</span>
      </el-form-item>
      <el-form-item
        label=""
        prop="deviceName"
        class="ls-flex-item--1"
        style="height: 250px"
      >
        <div ref="line" style="height: 100%; width: 48%; display: inline-block"></div>
      </el-form-item>
      </SLFlexGroup>
      <h3>保养记录</h3>
      <CardTable :config="cardTableConfigFile" style="height: 400px" />
    </el-form>
  </div>
</template>

<script lang="ts">
import SLFlexGroup from '@/components/SLFlexGroup/index.vue'
import CardSearch from '@/components/cardSearch/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import { ref, onMounted, reactive, toRefs } from 'vue'
import useGlobal from '@/hooks/global/useGlobal'
import { ICTCardTable } from '@/common/types/ledger/ledger'
//接口
import { getMDataById, getMLineData } from '@/api/ledger/ledger'
import router from '@/router'

const { $message } = useGlobal()
import { useRoute } from 'vue-router'
import useProject from '@/hooks/project/useProject'
import * as echarts from 'echarts'
//引格式化
import { BTASKTYPE } from '@/common/constans/ledger'
export default {
  name: 'Registration',
  components: {
    CardTable,
    SLFlexGroup
  },
  props: {
    currentId: {
      type: String,
      default: ''
    }
  },
  setup(props, ctx) {
    //1.定义变量
    const { $format } = useGlobal()
    const cardSearchSon = ref<InstanceType<typeof CardSearch> | null>(null)
    const cardSearchFa = ref<InstanceType<typeof CardSearch> | null>(null)
    const cardSearchRele = ref<InstanceType<typeof CardSearch> | null>(null)
    //所属部门数据
    const { getAreaTreeData } = useProject()
    //路由
    const route = useRoute()
    //添加级联选择
    const state = reactive<{
      showTable: boolean
      areaTree: NormalOption[]
      projectId: string
      dialogVisible: boolean
    }>({
      showTable: true,
      areaTree: [],
      projectId: '',
      dialogVisible: false
    })
    const baseForm = ref<any>()
    //表格栏-上传文件
    const cardTableConfigFile = ref<ICTCardTable>({
      loading: false,
      dataList: [],
      operationFixed: 'right',
      columns: [
        { prop: 'name', label: '任务名称' },
        { prop: '', label: '任务类型', formatter: row => BTASKTYPE[row.type] },
        {
          prop: '',
          label: '任务开启时间',
          formatter: row => $format(row.executeTime),
          icon: 'el-icon-time',
          iconStyle: {
            color: '#69e850',
            display: 'inline-block',
            'font-size': '16px'
          }
        },
        {
          prop: '',
          label: '关联工单',
          textColor: '#6BD2F8FF',
          textDecoration: 'underline',
          handleClick: row => openOrder(row),
          formatter: row => asOrder(row)
        }
      ],
      pagination: {
        page: 1,
        limit: 5,
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        sizeHandle: val => {
          cardTableConfigFile.value.pagination.limit = val
          refreshDataFile()
        },
        pageHandle: val => {
          cardTableConfigFile.value.pagination.page = val
          refreshDataFile()
        }
      }
    })
    //表单内容
    let formData = ref<any>({
      total: 0,
      executeTime: ''
    })
    let FilesList = ref<any>({
      list: []
    })
    let states = reactive({
      line: ref(),
      bar: ref()
    })
    //2.方法
    //开始一个生命周期钩子,挂载后再加载数据
    onMounted(async () => {
      initForm()
      state.areaTree = await getAreaTreeData()
      initLineCharts(states.line)
    })
    //初始化-数据表格
    const initForm = () => {
      if (props.currentId) {
        const paramsObj = {
          page: 1,
          size: 5,
          deviceId: props.currentId
        }
        console.log('paramsObj', paramsObj)
        getMDataById(paramsObj).then(res => {
          console.log('res ', res)
          cardTableConfigFile.value.dataList = res.data.data
          cardTableConfigFile.value.pagination.total = res.data.total
          formData.value.total = res.data.total
          if (res.data.total > 0) {
            formData.value.executeTime = $format(res.data.data[0].executeTime)
          }
        })
      } else {
        $message.error('获取设备信息失败')
      }
    }
    const asOrder = row => {
      if (row.orderId == null) {
        return '暂未关联工单'
      } else {
        return row.name
      }
    }
    const openOrder = (row: any) => {
      if (row.orderId) {
        router.push({
          name: 'OrderDetail',
          query: { id: row.orderId, title: row.name } //query: {id: 'ff8080817d4a5a05017d4a6b2778022f', title: '666' }
        })
      }
    }
    //更新查询数据-设备文件
    const refreshDataFile = async () => {
      const paramsObj = {
        page: cardTableConfigFile.value.pagination.page,
        size: cardTableConfigFile.value.pagination.limit,
        deviceId: props.currentId
      }
      getMDataById(paramsObj).then(res => {
        cardTableConfigFile.value.dataList = res.data.data
        cardTableConfigFile.value.pagination.total = res.data.total
        formData.value.total = res.data.total
        if (res.data.total > 0) {
          formData.value.executeTime = $format(res.data.data[0].executeTime)
        }
      })
    }
    let LineData = ref<any>({
      data: [],
      month: [],
      count: []
    })
    //转化line数据方法
    const formatLineData = (data: any) => {
      data.data.forEach((item: any) => {
        const aitem = ref<any>([])
        aitem.value.push(item.month)
        aitem.value.push(item.count)
        LineData.value.data.push(aitem)
        LineData.value.month.push(item.month)
        LineData.value.count.push(item.count)
      })
    }
    //折线图
    const initLineCharts = (item: any) => {
      var myChart = echarts.init(item)
      //获取数据
      const paramsObj = {
        deviceId: props.currentId
      }
      var data1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      var XName = [
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
      getMLineData(paramsObj).then(res => {
        console.log('res', res)
        //格式化数据
        formatLineData(res)
        if (LineData.value.count.length > 0) {
          data1 = LineData.value.count
        }
        if (LineData.value.month.length > 0) {
          XName = LineData.value.month
        }
        //加载
        var img = [
          'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABRCAYAAABFTSEIAAAACXBIWXMAAAsSAAALEgHS3X78AAAEp0lEQVR42u3cz4sjRRTA8W9Vd3Vn8mMmjj9WQWSRZQ+CsH+B7MnDIgiCd0E8CYJ/gOAIelo8ehUP/gF6WLw5/gMueFP2sIcF0dHd2Z1kknR11fOQZJJJMtlZd03H7HtQpNOTnpn+8Lrm1etmjIig8e/DKoECKqACKqCGAiqgAiqghgIqoAIqoIYCKqACKqCGAiqgAiqghgIqoAJudKTr+osZMNPvBUQBHwHsPF9fB9R0DeHMOQ6T6WOrhEzXBM4swDOL0M6CrArRVoq3t2dGUIb9fTvatg8ZZup1PDBgzPmy98mey6qfzjLz2WaWjEUZKEvGyi9nWyneMOvGIyFQo2Sbg4MUSChpU9IeTTUpJdsEajPZOJeJG5uBZj7rLLduWS5dGm6XNLEELOFUFj54ACJCaychkpDSASK3bwsXL0YgVpWJKwM0iy9Zy8HdGru7jvt3Pbu7w0wES7drTwAbjTHMGCsQcIAnYTC1/wRx0wEnl27JNgZI8HQ6Kc1mQq83RNzaMjPzXqDbjTQaJRFLxIyyMSxAXEkWrhrQzAAmo5HOjCQf7jflILxOkohL+aUPgV4vEGNJo+E5PAy02+UIMEwBxo0CPDP7Dg5SnEtpt1PA0e87XO25FOoh8IYIH2Y5b45RzGAQBiIltZoHxqMcjbksXAVgdc2EQMYzzzdotyeZWKuleULXJtwT4SODfC2QCWR+IF9KnjuX1Xbo99Op7LVE8iXlz0YBTk5SyLEEjo5OLuccEoFUvHfO+reuUPx4zftXAIcx1hdcF+/TvFab4A0Bs0VwqyhpVnkJT89/Q4DDQ0e77YCMwIUsFMeFZD856699URRvX4nxE4A/jbnxXp7v4Zw3ReGNSDHI8wFQjIafuoyn58L/fB6sth/Ybg9fez2TRC6QZcZYvgHsazF+MP7YCyLXcM7gvSXLDGBqYDg+NhwdmSpPoTrAkub0W+f4FSB1fDucIunMHSLpO8WAH0rSy8u+19MBCHB4OHzd2pI+CEUhpigEiN+l6WcdY252jLn5s7Wf472ImPcN8pUl/tEHoV4XWq1Ke4KrLmPsTA3oODpytFoOyJKSyzHyMSIxteWngMW5cSEdDJQUhTdZVgxOz3/+jFJm4+bA2e5JpNU6WZ4Fw99JwnWMKccwpeddP+B7GZTNUPKqybJy0O+Hs1YfMz9swwvpB8fbGDG0GuGkkK7V0hxSmZQpABI8l2z0v3sJf50qpAMJCd2qCulql3LD1lRGQjm7lEsDz0rkxTQOfiPPxUBcuJTbbhss/Y1eyi3NwsmKInmkZsKk5gtPUzNhvp11507CSy/X6XYStpvFudpZw1ZWIOF4Cq6SdtbKbioJyAhRTu3u9yMJXerN+ugvaQQsjcZ8Q3VnZwxlSDhe1lB9GjrSw5b+1avT8+Jw+979nNaOI6U3KpTrWAosxVQmygK4ld8X0ZtK/7eViExD7O1NQPb3T7fsl4/4sBpwYzPwjFbTo95Yl9l9Vd1YN1X/147HebSjary1AHyc5qc+XLQEQx9ve8Kg6xr6hKoCKqACKqCGAiqgAiqghgIqoAIqoIYCKqACKqCGAiqgAiqghgIq4JrHP8fEWV8FMTmOAAAAAElFTkSuQmCC',
          'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE8AAABPCAYAAACqNJiGAAAACXBIWXMAAAsSAAALEgHS3X78AAAGS0lEQVR42u2cz4skSRXHPy8iMrOrq7qnp3dqloEeD0PvHrbxB/TJkwt6EGVBwRHUf0BPXj146JPgosJe/PEX6NoHYUUE8bCC11ZQtw+DLMq2DtPlbM9MVXVVZkbE85DVXdU97e6yi1U9TXwhyaIq4lXmh29ERrxXlKgqSR9OJiFI8BK8BC/BS0rwErwEL8FLSvASvAQvwUvwkhK8BC/BS/CSErwEL8FL8JISvI8udxkvShA5/55y+QrMchmK3hfBej9dBpgLhXcBNIGd9+ix03C7JBAXBm8GnEzBvDV53bvAid3JhW7pDGBdJMC5wzvnNoG7U2B7fWF7G/aPhJdmWu0DL11X9vZge0WnIHd11onzhrgoeDJ1Wk/gRYEjgYHA88LBUNiY6XQAbLQVHih0FK4r3JtAPHWizhueWYzrZsDtdw28Y6BtKJfbVHWbDSzvxg5la413Y4cNLFXdZtxepV4q4B3T9OtJE2fnQz94ngnnzYCTqeO6DbT7Dw1uyZBlHTreM3QBqacgNFPa3jJwjhg85fExt56LMIzQizMOnOscOO9F8tPgyv4ymVi6WExdMbJgbYZ1GSU51mVYmzGyYOqK9ViTiaXsL0PbNHFOHIhcuWF7drhCM8cNhLK/zBCLW7fQcqegqphjNMfRnKuYnwKl5XDrliETgIPJnDmNP6/hO+cdxonrEOgYCipGtcOWjqF3mJal9A6Lxahg7QZB1nB6RKX/pMg8w5FgnUCoKTIPHQNHOnHfU+vAKzJsd+SM6x48NpAb1jKDwVLmjljfJONFRL5CaX8A5tcQ7yHmAS2TIVVGmTsMlrWs6f/gsTnnPrmC8IA3e8L+UbMcydfbPBoaBlhELctqCTJAwwHoZ4BPA6/hydH4I8rwDSqzRaE3ELUMsDwaGvL1NjzfxH2zd7XmvDPzz8vQLH6HgpYekxnEGcZYZAJRnCPG7+L44nf4wgG5dcBfQL4M+hDlVtPeGUxm0NLDsFlUv/zR9suXP6vy94HQdkKx6pHjDBCWW4IPn0D5JF7/+Cn5WPx++OrPWpK/8Pnw8cFr/O7rv4p/fh1nKjL5D84JYSSIF1iuuf9EGHph86rm83bfusAJKyCFgBeCCvBNNB5/y3z2lRb5C80FSudLsv0KRIEolLFpL4XAygf8nmcd3t0tPTeeLQDHwBiAv2H0c2RmNJbqyWzTUuo+mVGi/B5YYzzpd6K8aP/P77lCi2TY7ExvTkeKlorWCkbBRdD4bfP6G//i0S8GjP/Uo/+bn8gf3gCNID8FbqL1pN+oiRVCdSbunLSYTHJYUkLfYzqOlo1UMYJuEilBfgjht1+LP34VcYJ6JWjEmYDYnxO1RiXSMpEQlNhXqqJexG383513dp/ZbTIivq3cuBaJdUR9JEog+vsQIvBLkC2c1kStMeZ7GPsqUe6g9S3iOBAlNP3qyI1rEd+eZFq6c01PzSUxME1D3RX23jZs3zQ8bK+y0oZR7bGFYzzKsLnDeIcYg9QGMoFaUXsLWCaaf+N9j6VWTSg9rczRH8JzwyfsHUa278STHN884M1zzmsyH9sryn5HWW2N6fvINQnEQSBkniLW5FKhsUU0N1G/SZCKyD/I5K/kHBIyTxwErkmg7yOrrTH7nSYuWzrP7dk8ncdZ990RDrAUWLq5AbX01WKwjKxh2U+XHMdOaYVIJLAiASTQqyIlgQ0Ce2/rrOvmNWzNfCx3eiMT992JcF0ZDxoANQ6fC6HwBF9TmIog06MwFcHXhMLjc6GkoCQwHjRxtu/EWddd1XxekzbaBbinbN6OjAeRLDsm9KEeelZXalZCjffTYyXUrK7U1ENP6IMxY8aDyObtCPe0ibdz9Z62F7rv7q6y21U4ijy+3WSEi+Mh3banHkI5dmheUC15qiXPuCyoh0K37SmOh2Tjsul3FNntNvEWUElbZPXs6SLQadVscMEWq6OnVbQLij/zBreQYXt2/ttRmHHhYW9SkxgF9g4jHMbmPArQm3w+cRu7JzWLhdVuL0PRm7NOPMk4n9fJnnXnqWzxwn41oKoLPVDkwmMHg2Im5wvbLPra5TL9u8UHSWBepl9LSfprkGdqnZfgJSV4CV6Cl+AleEkJXoKX4CV4SQlegpfgJXgJXlKCl+AleAleUoKX4CV4V0//BfBm5Ekg9qBkAAAAAElFTkSuQmCC',
          'image://data:image/png;base64,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',
          'image://data:image/png;base64,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'
        ]
        var data = [
          {
            coords: [LineData.value.data]
          }
        ]
        var option = {
          title: {
            text: '今年保养情况',
            textStyle: {
              color: '#FFFFFF',
              fontSize: 15,
              lineHeight: 25
            }
          },
          // backgroundColor: '#0e2147',
          grid: {
            left: '10%',
            top: '15%',
            bottom: '10%',
            right: '5%'
          },
          legend: {
            type: 'scroll',
            data: '来电量',
            itemWidth: 18,
            itemHeight: 12,
            textStyle: {
              color: '#00ffff',
              fontSize: 14
            }
          },
          yAxis: [
            {
              type: 'value',
              position: 'left',
              nameTextStyle: {
                color: '#00FFFF'
              },
              splitLine: {
                lineStyle: {
                  type: 'dashed',
                  color: 'rgba(135,140,147,0.8)'
                }
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                formatter: '{value}',
                color: '#fff',
                fontSize: 14
              }
            }
          ],
          xAxis: [
            {
              type: 'category',
              axisTick: {
                show: false
              },
              axisLine: {
                show: false,
                lineStyle: {
                  color: '#0696f9'
                }
              },
              axisLabel: {
                inside: false,
                textStyle: {
                  color: '#fff', // x轴颜色
                  fontWeight: 'normal',
                  fontSize: '14',
                  lineHeight: 22
                }
              },
              data: XName
            }
          ],
          series: [
            {
              symbolSize: 150,
              symbol: img[2],
              name: '小灯光',
              type: 'line',
              data: data1,
              itemStyle: {
                normal: {
                  borderWidth: 5,
                  color: '#0696f9'
                }
              }
            },
            {
              name: '滑行的光点',
              type: 'lines',
              coordinateSystem: 'cartesian2d',
              symbolSize: 30,
              polyline: true,
              effect: {
                show: true,
                trailLength: 0,
                // symbol: "arrow",
                period: 10, //光点滑动速度
                symbolSize: 150,
                symbol: img[0]
              },
              lineStyle: {
                normal: {
                  width: 1,
                  opacity: 0.6,
                  curveness: 0.2
                }
              },
              data: data
            }
          ]
        }
        myChart.setOption(option)
      })
    }
    const FileList = ref<any>([])
    //返回
    return {
      formData,
      FilesList,
      FileList,
      cardSearchSon,
      cardSearchFa,
      cardSearchRele,
      cardTableConfigFile,
      refreshDataFile,
      ...toRefs(state), //添加级联选择
      ...toRefs(states), //添加级联选择
      initForm,
      initLineCharts,
      baseForm,
      asOrder,
      openOrder
    }
  },
  //返回
  methods: {
    //返回上一页
    goOff() {
      router.push({ name: 'deviceLedgerIndex' })
    },
    handlePreview(file) {
      console.log('预览图片', file)
    },
    handleExceed(files, FileList) {
      $message.warning(
        `The limit is 5, you selected ${files.length} files this time, add up to ${
          files.length + FileList.length
        } totally`
      )
    },
    beforeRemove(file, FileList) {
      // return $confirm(`Cancel the transfert of ${file.name} ?`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../css/ledger-router.scss';
span {
  font-size: 16px;
}
el-form-item {
  width: 280px;
  font-size: 15px;
}
.sel {
  position: absolute;
  clip: rect(2px 80px 30px 2px);
  width: 100%;
  height: 28px;
  line-height: 28px;
  font-size: 15px;
  font-weight: bold;
}
.info-item-size {
  width: 280px;
  font-size: 15px;
}

.uploadPic-style {
  margin-left: 30px;
  width: 100%;
}

.uploadFile-btn-style {
  margin-left: 1290px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.item-size-wd {
  height: 80px;
  width: 680px;
  margin-top: 20px;
}

.table-style {
  margin-left: 50px;
  width: 1448px;
}
</style>
