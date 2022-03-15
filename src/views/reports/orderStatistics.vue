<template>
  <el-scrollbar>
    <div class="reports">
      <el-row :gutter="20">
        <el-col>
          <CardSearch ref="cardSearch" class="cardSearch" :config="cardSearchConfig" />
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :md="18">
          <div class="detail-flex-box">
            <div class="detail-box-item gdtj-rect-count is-gutterd">
              <div class="detail-box-item-content">
                <div class="gdtj-content-title">总工单数</div>
                <div class="gdtj-content-content">
                  <span class="gdtj-content-count count-orange">{{ OrderOverview.total }}</span>
                </div>
              </div>
            </div>
            <div class="detail-box-item gdtj-rect-count is-gutterd">
              <div class="detail-box-item-content">
                <div class="gdtj-content-title">待处理工单数</div>
                <div class="gdtj-content-content">
                  <span class="gdtj-content-count count-ligntblue">{{
                    OrderOverview.unstart
                  }}</span>
                </div>
              </div>
            </div>
            <div class="detail-box-item gdtj-rect-count is-gutterd">
              <div class="detail-box-item-content">
                <div class="gdtj-content-title">处理中工单数</div>
                <div class="gdtj-content-content">
                  <span class="gdtj-content-count count-blue">{{ OrderOverview.process }}</span>
                </div>
              </div>
            </div>
            <div class="detail-box-item gdtj-rect-count is-gutterd">
              <div class="detail-box-item-content">
                <div class="gdtj-content-title">超时工单数</div>
                <div class="gdtj-content-content">
                  <span class="gdtj-content-count count-red">{{ OrderOverview.timeout }}</span>
                </div>
              </div>
            </div>
            <div class="detail-box-item gdtj-rect-count is-gutterd">
              <div class="detail-box-item-content">
                <div class="gdtj-content-title">已完成工单数</div>
                <div class="gdtj-content-content">
                  <span class="gdtj-content-count count-green">{{ OrderOverview.complete }}</span>
                </div>
              </div>
            </div>
          </div>

          <el-row :gutter="20">
            <el-col :md="12">
              <div class="detail-box-item gdtj-rect-gdlxtj hastitle">
                <div class="detail-box-item-title">工单类型统计</div>
                <div class="gdlxtj-chart">
                  <VChart :option="GDLXFX_options"></VChart>
                </div>
                <SLTable :config="slTableConfig" />
              </div>
            </el-col>
            <el-col :md="12">
              <el-row>
                <el-col>
                  <div class="detail-box-item gdtj-rect-gdxzqsfx hastitle">
                    <div class="detail-box-item-title">工单新增趋势分析</div>
                    <VChart class="szjc-chart-content" :option="GDXZQSFX_options"></VChart>
                  </div>
                </el-col>
                <el-col>
                  <div class="detail-box-item gdtj-rect-gdclcspm hastitle">
                    <div class="detail-box-item-title">工单处理超时排名</div>
                    <VueScroll
                      v-if="GDCLCSPM_data.length > 0"
                      :data="GDCLCSPM_data"
                      :class-option="optionHover"
                      class="warp"
                    >
                      <ul>
                        <li v-for="(item, i) in GDCLCSPM_data" :key="i">
                          <ReportProgressItem :data="item" />
                        </li>
                      </ul>
                    </VueScroll>
                    <div v-else class="empty-block">
                      <span class="empty-text"> 暂无内容 </span>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
        <el-col :md="6">
          <el-row :gutter="20">
            <el-col :xs="8" :md="24">
              <div class="detail-box-item gdtj-rect-gdztzb hastitle">
                <div class="detail-box-item-title">工单状态占比</div>
                <VChart ref="gdztzbChart" :option="GDZTZB_options"></VChart>
              </div>
            </el-col>
            <el-col :xs="8" :md="24">
              <div class="detail-box-item gdtj-rect-gddjzb hastitle">
                <div class="detail-box-item-title">工单等级占比</div>
                <VChart ref="gddjzbChart" :option="GDDJZB_options"></VChart>
              </div>
            </el-col>
            <el-col :xs="8" :md="24">
              <div class="detail-box-item gdtj-rect-gdlxzb hastitle">
                <div class="detail-box-item-title">工单类型占比</div>
                <VChart ref="gdlxzbChart" :option="GDLXZB_options"></VChart>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </el-scrollbar>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, reactive, ref, toRefs } from 'vue'
import CardSearch from '@/components/cardSearch/index.vue'
import SLTable from '@/components/SLTable/index.vue'
import ReportProgressItem from './components/ReportProgressItem.vue'
import VueScroll from 'vue-seamless-scroll/src'
import useGlobal from '@/hooks/global/useGlobal'
import * as echarts from 'echarts'
import { hexToRgba } from '@/utils/chartUtils'
import useOrder from './hooks/useOrder'
import { QueryListParam } from '@/common/types/reports'
import useProject from '@/hooks/project/useProject'
import { ISLTableConfig } from '@/components/SLTable/type'
export default defineComponent({
  name: 'OrderStatistics',
  components: { CardSearch, SLTable, ReportProgressItem, VueScroll },
  setup() {
    const { formatToNumber, formatToArrayNumber } = useGlobal()
    const {
      OrderTimeoutRank,
      getOrderTimeoutRank,
      OrderPriorityCount,
      getOrderPriorityCount,
      OrderTypeCount,
      getOrderTypeCount,
      OrderTypeTrend,
      getOrderTypeTrend,
      OrderTypePriorityTrend,
      getOrderTypePriorityTrend,
      OrderOverview,
      getOrderOverview
    } = useOrder()
    const { areaTree, getAreaTreeData } = useProject()
    // 工单概览

    const state = reactive<{
      cardSearchConfig: CSSearchConfig
      slTableConfig: ISLTableConfig
      GDCLCSPM_data: any[]
      GDLXFX_options: any
      GDXZQSFX_options: any
      GDZTZB_options: any
      GDDJZB_options: any
      GDLXZB_options: any
      optionHover: any
    }>({
      cardSearchConfig: {
        operation: {
          // search: { text: '查询', handle: () => refreshData() }
        },
        filters: [
          // {
          //   label: '选择区域',
          //   key: 'projectId',
          //   type: 'cascader',
          //   options: areaTree.value,
          //   width: '240px',
          //   handleChange: () => {
          //     refreshData()
          //   },
          //   props: {
          //     checkStrictly: true
          //   }
          // }
        ],
        rightFilter: [
          {
            label: '选择时间',
            key: 'date',
            type: 'daterange',
            handleChange: () => {
              refreshData().then(() => {
                refreshChart()
              })
            }
          }
        ]
      },
      GDCLCSPM_data: [],
      GDLXFX_options: {},
      GDXZQSFX_options: {},
      slTableConfig: {
        pagination: { hide: true },
        height: 240,
        columns: [
          {
            label: '工单等级',
            prop: 'level'
          },
          {
            label: '维修',
            prop: 'repair'
          },
          {
            label: '保养',
            prop: 'maintenance'
          },
          {
            label: '其它',
            prop: 'other'
          }
        ],
        dataList: OrderTypePriorityTrend.value
      },
      GDZTZB_options: {},
      GDDJZB_options: {},
      GDLXZB_options: {},
      optionHover: {
        step: 0.4
      }
    })
    const cardSearch = ref<InstanceType<typeof CardSearch>>()
    const initGDLXFX_options = () => {
      const catogary: string[] = ['维修工单', '保养工单', '其他工单']
      const xData: string[] = ['紧急', '高', '一般', '普通']
      const colors: string[] = ['#FFB253', '#53A8FF', '#4EE5A8']
      const Data: any[][] = [[], [], []]
      OrderTypePriorityTrend.value.map(item => {
        Data[0].push(item.repair)
        Data[1].push(item.maintenance)
        Data[2].push(item.other)
      })

      const series = catogary.map((item, i) => {
        const serie = {
          type: 'bar',
          name: item,
          data: Data[i],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: hexToRgba(colors[i], 1) },
            { offset: 1, color: hexToRgba(colors[i], 0.4) }
          ])
        }
        return serie
      })
      const options = {
        backgroundColor: '#1A1D2D',
        legend: {
          data: catogary,
          top: 10,
          right: 35,
          textStyle: {
            color: '#718092'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: 50,
          left: 50,
          bottom: 35,
          right: 35
        },
        xAxis: {
          type: 'category',
          gridIndex: 0,
          data: xData
        },
        yAxis: {
          name: '(个)',
          splitLine: {
            show: true,
            lineStyle: {
              color: '#40424D'
            }
          }
        },
        series: series
      }
      state.GDLXFX_options = options
    }

    const getPressItem = (value, percentage, label) => {
      return {
        label,
        percentage,
        count: value,
        unit: '个'
      }
    }
    const initProgress = () => {
      state.GDCLCSPM_data = []
      OrderTimeoutRank.value.map(item => {
        state.GDCLCSPM_data.push(getPressItem(item.order, item.percent, item.userName))
      })
    }

    const initGDXZQSFX_options = () => {
      const legend: string[] = ['维修工单', '保养工单', '其他工单']
      const xAxis: string[] = []
      const colors: string[] = ['#FFB253', '#53A8FF', '#4EE5A8']
      const Data: any[][] = [[], [], []]
      OrderTypeTrend.value.map(item => {
        xAxis.push(item.date)
        Data[0].push(item.repair)
        Data[1].push(item.maintenance)
        Data[2].push(item.other)
      })
      const options: any = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          show: true,
          data: legend,
          colorBy: 'series',
          textStyle: {
            color: '#718092'
          },
          right: 40
        },
        grid: {
          top: 40,
          left: 50,
          bottom: 35,
          right: 35
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
          data: xAxis
        },
        yAxis: {
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
        },
        series: []
      }
      const seriesData = legend.map((item, i) => {
        return {
          name: item,
          color: colors[i],
          data: Data[i]
        }
      })

      seriesData.map(item => {
        const series = {
          data: item.data,
          name: item.name,
          smooth: true,
          showSymbol: false,
          type: 'line',
          color: item.color,
          lineStyle: {
            color: hexToRgba(item.color, 0.6),
            width: 1
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: hexToRgba(item.color, 0.4)
              },
              {
                offset: 1,
                color: hexToRgba(item.color, 0)
              }
            ])
          }
        }
        legend.push(item.name)
        options.series.push(series)
      })
      state.GDXZQSFX_options = options
    }
    const gdztzbChart = ref<any>()
    const gddjzbChart = ref<any>()
    const gdlxzbChart = ref<any>()

    const initTypeZBData = () => {
      const data: any[] = []
      if (!OrderTypeCount.value) return []
      for (let key in OrderTypeCount.value) {
        switch (key) {
          case 'repair':
            data.push({ name: '维修工单', value: OrderTypeCount.value.repair })
            break
          case 'maintenance':
            data.push({ name: '保养工单', value: OrderTypeCount.value.maintenance })
            break
          case 'other':
            data.push({ name: '其它工单', value: OrderTypeCount.value.other })
            break
          default:
            break
        }
      }
      return data
    }
    const initZTData = () => {
      const data: any[] = []
      if (!OrderOverview.value) return []
      for (let key in OrderOverview.value) {
        switch (key) {
          case 'complete':
            data.push({ name: '已完成', value: OrderOverview.value.complete })
            break
          case 'process':
            data.push({ name: '处理中', value: OrderOverview.value.process })
            break
          case 'unstart':
            data.push({ name: '待处理', value: OrderOverview.value.unstart })
            break
          case 'timeout':
            data.push({ name: '已超时', value: OrderOverview.value.timeout })
            break
        }
      }
      return data
    }
    const initDJData = () => {
      const data: any[] = []
      if (!OrderPriorityCount.value) return []
      for (let key in OrderPriorityCount.value) {
        switch (key) {
          case 'level1':
            data.push({ name: '低', value: OrderPriorityCount.value.level1 })
            break
          case 'level2':
            data.push({ name: '一般', value: OrderPriorityCount.value.level2 })
            break
          case 'level3':
            data.push({ name: '高', value: OrderPriorityCount.value.level3 })
            break
          case 'level4':
            data.push({ name: '紧急', value: OrderPriorityCount.value.level4 })
            break
        }
      }
      return data
    }
    const initGDZB_options = (type: 'lx' | 'dj' | 'zt') => {
      let chartWidth = 0
      let data: any[] | undefined = []
      if (type === 'lx') {
        data = initTypeZBData()
        chartWidth = gdlxzbChart.value ? parseFloat(gdlxzbChart.value.getWidth()) : 0
      } else if (type === 'dj') {
        data = initDJData()
        chartWidth = gddjzbChart.value ? parseFloat(gddjzbChart.value.getWidth()) : 0
      } else if (type === 'zt') {
        data = initZTData()
        chartWidth = gdztzbChart.value ? parseFloat(gdztzbChart.value.getWidth()) : 0
      }

      const options = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          bottom: -5,
          left: 'center',
          textStyle: {
            color: '#FFFFFF'
          }
        },
        series: [
          {
            name: '占比',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: true,
            label: {
              alignTo: 'edge',
              formatter: '{value|{c}}{percent|({d}%)}\n{name|{b}}',
              minMargin: 5,
              edgeDistance: 10,
              lineHeight: 15,
              rich: {
                value: {
                  fontSize: 20,
                  color: '#999'
                },
                percent: {
                  fontSize: 12,
                  color: '#999'
                },
                name: {
                  fontSize: 10,
                  color: '#999'
                }
              }
            },
            labelLine: {
              show: true,
              length: 15,
              length2: 0
            },
            labelLayout: function (params) {
              const isLeft = params.labelRect.x < chartWidth / 2
              const points = params.labelLinePoints

              // Update the end point.
              points[2][0] = isLeft
                ? params.labelRect.x
                : params.labelRect.x + params.labelRect.width
              return {
                labelLinePoints: points
              }
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold',
                formate: ''
              }
            },
            data: data
          }
        ]
      }
      return options
    }
    const initProjectSelect = async () => {
      await getAreaTreeData().then(() => {
        state.cardSearchConfig.filters.map(item => {
          item.key === 'projectId' && (item.options = areaTree.value)
        })
      })
    }
    const refreshData = async () => {
      const params = cardSearch.value && cardSearch.value?.queryParams

      const [start, end] =
        params && params.date
          ? formatToArrayNumber(params.date)
          : [formatToNumber(new Date()) - 15638400000, formatToNumber(new Date())]
      const projectId = params && params.projectId&& params.projectId[params.projectId.length-1]
      const queryParams: QueryListParam = {
        projectId: projectId,
        start: start.toString(),
        end: end.toString()
      }
      await getOrderTypeCount(queryParams)
      await getOrderTypeTrend(queryParams)
      await getOrderTypePriorityTrend(queryParams).then(() => {
        state.slTableConfig.dataList = OrderTypePriorityTrend.value
      })
      await getOrderOverview(queryParams)
      await getOrderTimeoutRank(queryParams)
      await getOrderPriorityCount(queryParams)
      refreshChart()
    }
    const refreshChart = () => {
      initGDLXFX_options()
      initGDXZQSFX_options()
      initProgress()
      state.GDLXZB_options = initGDZB_options('lx')
      state.GDZTZB_options = initGDZB_options('zt')
      state.GDDJZB_options = initGDZB_options('dj')
    }
    onBeforeMount(async () => {
      initProjectSelect()
      refreshData()
    })
    onMounted(() => {
      refreshChart()
    })
    return {
      OrderTimeoutRank,
      OrderPriorityCount,
      OrderTypeCount,
      OrderTypeTrend,
      OrderTypePriorityTrend,
      OrderOverview,
      ...toRefs(state),
      cardSearch,
      gdztzbChart,
      gddjzbChart,
      gdlxzbChart,
      areaTree
    }
  }
})
</script>

<style lang="scss" scoped>
@import './index.scss';
.warp {
  height: 284px;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  ul {
    list-style: none;
    padding: 0;
    margin: 0 auto;
    li,
    a {
      display: block;
      height: 30px;
      line-height: 30px;
      display: flex;
      margin: 20px 10px;
      justify-content: space-between;
      font-size: 15px;
    }
  }
}
:deep(.el-progress-bar__inner) {
  background-color: unset;
  background-image: linear-gradient(to right, #5070ea, #8c78fe);
}
.empty-block {
  height: 100%;
  width: 100%;
  text-align: center;
  padding-top: 100px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}
</style>
