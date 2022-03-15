<template>
  <el-scrollbar>
    <div class="reports">
      <el-row :gutter="10">
        <el-col>
          <CardSearch ref="cardSearch" class="cardSearch" :config="cardSearchConfig" />
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :lg="16" :xl="14">
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="detail-box-item bjtj-square">
                <div class="detail-box-item-content">
                  <div class="bjtj-square-title">报警总数</div>
                  <div class="bjtj-square-content">
                    <span class="bjtj-square-count">{{ AlarmOverview.alarmTotal }}</span>
                    <span class="bjtj-square-unit">个</span>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="detail-box-item bjtj-square">
                <div class="detail-box-item-content">
                  <div class="bjtj-square-title">报警设备</div>
                  <div class="bjtj-square-content">
                    <span class="bjtj-square-count">{{ AlarmOverview.alarmDeviceTotal }}</span>
                    <span class="bjtj-square-unit">个</span>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="detail-box-item bjtj-square">
                <div class="detail-box-item-content">
                  <div class="bjtj-square-title">待确认数</div>
                  <div class="bjtj-square-content">
                    <span class="bjtj-square-count">{{ AlarmOverview.unconfirmTotal }}</span>
                    <span class="bjtj-square-unit">个</span>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="detail-box-item bjtj-square">
                <div class="detail-box-item-content">
                  <div class="bjtj-square-title">待解除数</div>
                  <div class="bjtj-square-content">
                    <span class="bjtj-square-count">{{ AlarmOverview.unremoveTotal }}</span>
                    <span class="bjtj-square-unit">个</span>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col>
              <div class="detail-box-item bjtj-rect-bjqst hastitle">
                <div class="detail-box-item-title">报警趋势图</div>
                <VChart :option="BJQST_options"></VChart>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :lg="8" :xl="10">
          <el-row>
            <el-col>
              <div class="detail-box-item bjtj-rect-bjzb hastitle">
                <div class="detail-box-item-title">报警占比</div>
                <VChart ref="bjzbChart" :option="BJZB_options"></VChart>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <div class="detail-box-item bjtj-rect-bjpm hastitle">
                <div class="detail-box-item-title">报警排行</div>
                <SLTable :config="slTableConfig" />
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </el-scrollbar>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import CardSearch from '@/components/cardSearch/index.vue'
import SLTable from '@/components/SLTable/index.vue'
import useGlobal from '@/hooks/global/useGlobal'
import useAlarm from './hooks/useAlarm'
import { QueryListParam } from '@/common/types/reports'
import * as echarts from 'echarts'
import { hexToRgba } from '@/utils/chartUtils'
import useProject from '@/hooks/project/useProject'
import { ISLTableConfig } from '@/components/SLTable/type'
export default defineComponent({
  name: 'WarningStatistics',
  components: { CardSearch, SLTable },
  setup() {
    const {
      AlarmRank,
      AlarmTrend,
      AlarmOverview,
      AlarmPriority,
      getAlarmRank,
      getAlarmTrend,
      getAlarmOverview,
      getAlarmPriority
    } = useAlarm()
    const { formatToArrayNumber, formatToNumber } = useGlobal()
    const { areaTree, getAreaTreeData } = useProject()
    const initProjectSelect = async () => {
      await getAreaTreeData().then(() => {
        state.cardSearchConfig.filters.map(item => {
          item.key === 'projectId' && (item.options = areaTree.value)
        })
      })
    }
    const state = reactive<{
      cardSearchConfig: CSSearchConfig
      BJZB_options: any
      BJQST_options: any
      slTableConfig: ISLTableConfig
    }>({
      cardSearchConfig: {
        operation: {
          // search: { text: '查询', handle: () => refreshData() }
        },
        filters: [
          {
            label: '选择区域',
            key: 'projectId',
            type: 'cascader',
            options: areaTree.value,
            width: '240px',
            handleChange: () => {
              refreshData()
            },
            props: {
              checkStrictly: true
            }
          }
        ],
        rightFilter: [
          { label: '选择时间', key: 'date', type: 'daterange', handleChange: () => refreshData() }
        ]
      },
      BJZB_options: {},
      BJQST_options: {},
      slTableConfig: {
        pagination: { hide: true },
        indexVisible: true,
        sort: {
          showBackground: true,
          prop: 'alarm',
          order: 'descending'
        },
        columns: [
          {
            label: '报警设备',
            prop: 'deviecName'
          },
          {
            label: '所属项目',
            prop: 'projectName'
          },
          {
            label: '报警总数',
            prop: 'alarm'
          }
        ],
        dataList: AlarmRank.value
      }
    })
    const bjzbChart = ref<any>()
    const initconstBJQST_options = () => {
      const data: number[] = []
      const xData: string[] = []
      AlarmTrend.value.map(item => {
        data.push(item.alarm)
        xData.push(item.date)
      })
      const options = {
        backgroundColor: '#1A1D2D',
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xData
        },
        yAxis: {
          name: '%',
          type: 'value',
          splitLine: {
            lineStyle: {
              color: '#40424D'
            }
          }
        },
        series: [
          {
            data: data,
            name:'百分比值',
            type: 'line',
            smooth: true,
            showSymbol: false,
            color: '#4EE5A8',
            lineStyle: {
              color: '#4EE5A8',
              width: 1
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: hexToRgba('#4EE5A8', 0.4)
                },
                {
                  offset: 1,
                  color: hexToRgba('#4EE5A8', 0)
                }
              ])
            }
          }
        ]
      }
      state.BJQST_options = options
    }
    const initBJZBOptions = () => {
      const chartWidth = bjzbChart.value ? parseFloat(bjzbChart.value.getWidth()) : 0
      const data: any[] = []
      for (var key in AlarmPriority.value) {
        data.push({ name: key, value: AlarmPriority.value[key] })
      }
      const BJZB_options = {
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
            name: '报警占比',
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
              length2: 0,
              maxSurfaceAngle: 80
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
      state.BJZB_options = BJZB_options
    }

    const cardSearch = ref<InstanceType<typeof CardSearch>>()
    const refreshData = async () => {
      const params = cardSearch.value && cardSearch.value?.queryParams

      const [start, end] =
        params && params.date
          ? formatToArrayNumber(params.date)
          : [formatToNumber(new Date()) - 15638400000, formatToNumber(new Date())]
      const projectId = params && params.projectId && params.projectId[params.projectId.length - 1]
      const queryParams: QueryListParam = {
        projectId: projectId,
        start: start.toString(),
        end: end.toString()
      }
      await getAlarmRank(queryParams)
      await getAlarmTrend(queryParams)
      await getAlarmOverview(queryParams)
      await getAlarmPriority(queryParams)
      refreshChart()
    }
    const refreshChart = () => {
      initBJZBOptions()
      initconstBJQST_options()
      state.slTableConfig.dataList = AlarmRank.value
    }
    onMounted(() => {
      initProjectSelect()
      refreshData()
    })
    return {
      ...toRefs(state),
      cardSearch,
      bjzbChart,
      AlarmRank,
      AlarmTrend,
      AlarmOverview,
      AlarmPriority
    }
  }
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
