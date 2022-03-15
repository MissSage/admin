<template>
  <el-scrollbar>
    <div class="reports">
      <el-row :gutter="20">
        <el-col>
          <CardSearch ref="cardSearch" class="cardSearch" :config="cardSearchConfig" />
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :md="24" :lg="10" :xl="8">
          <div class="detail-box-item xjtj-rect-rwwcl hastitle">
            <div class="detail-box-item-title">任务完成率</div>
            <div class="detail-box-item-content">
              <div class="rwwcl-percent">
                <PieProgress v-model="PatrolCompleteRatio.percent" />
              </div>
              <div class="rwwcl-info">
                <div class="info">
                  <div class="info-label info-label-green">完成任务数</div>
                  <div class="info-count">{{ PatrolCompleteRatio.complete }}</div>
                </div>
                <div class="info">
                  <div class="info-label info-label-orange">未完成任务数</div>
                  <div class="info-count">{{ PatrolCompleteRatio.unExecute }}</div>
                </div>
                <div class="info">
                  <div class="info-label info-label-blue">异常数</div>
                  <div class="info-count">{{ PatrolCompleteRatio.exception }}</div>
                </div>
                <div class="info">
                  <div class="info-label info-label-blue">任务总数</div>
                  <div class="info-count">{{ PatrolCompleteRatio.total }}</div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :md="24" :lg="14" :xl="16">
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="detail-box-item xjtj-rect-task">
                <div class="detail-box-item-title task-orange">
                  <span class="title-text">待处理任务</span>
                  <span class="title-count">{{ PatrolStatusCount.unstart }}</span>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-box-item xjtj-rect-task">
                <div class="detail-box-item-title task-blue">
                  <span class="title-text">处理中任务</span>
                  <span class="title-count">{{ PatrolStatusCount.process }}</span>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-box-item xjtj-rect-task">
                <div class="detail-box-item-title task-green">
                  <span class="title-text">按时完成任务</span>
                  <span class="title-count">{{ PatrolStatusCount.complete }}</span>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-box-item xjtj-rect-task">
                <div class="detail-box-item-title task-pink">
                  <span class="title-text">超时完成任务</span>
                  <span class="title-count">{{ PatrolStatusCount.unExecute }}</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :md="24" :lg="10" :xl="8">
          <div class="detail-box-item xjtj-rect-xjryph hastitle">
            <div class="detail-box-item-title">巡检人员排行</div>
            <SLTable :config="slTableConfig" />
          </div>
        </el-col>
        <el-col :md="24" :lg="14" :xl="16">
          <el-row :gutter="10">
            <el-col>
              <div class="detail-box-item xjtj-rect-xjqsfx hastitle">
                <div class="detail-box-item-title">巡检趋势分析</div>
                <VChart :option="XJQSFX_options"></VChart>
              </div>
            </el-col>
            <el-col>
              <div class="detail-box-item xjtj-rect-mrxjycs hastitle">
                <div class="detail-box-item-title">每日巡检异常数</div>
                <VChart :option="MRXJYCS_options"></VChart>
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
import SLTable from '@/components/SLTable/index.vue'
import PieProgress from './components/PieProgress.vue'
import CardSearch from '@/components/cardSearch/index.vue'
import * as echarts from 'echarts'
import { hexToRgba } from '@/utils/chartUtils'
import useGlobal from '@/hooks/global/useGlobal'
import usePatrol from './hooks/usePatrol'
import { QueryListParam } from '@/common/types/reports'
import useProject from '@/hooks/project/useProject'
import { ISLTableConfig } from '@/components/SLTable/type'
export default defineComponent({
  name: 'PatrolStatistics',
  components: { CardSearch, PieProgress, SLTable },
  setup() {
    const { formatToNumber } = useGlobal()
    const {
      PatrolUserRank,
      PatrolStatusCount,
      PatrolExceptionTrend,
      PatrolCompleteRatio,
      PatrolTrend,
      getPatrolStatusCount,
      getPatrolExceptionTrend,
      getPatrolCompleteRatio,
      getPatrolUserRank,
      getPatrolTrend
    } = usePatrol()
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
      slTableConfig: ISLTableConfig
      XJQSFX_options: any
      MRXJYCS_options: any
    }>({
      MRXJYCS_options: {},
      XJQSFX_options: {},
      slTableConfig: {
        pagination: { hide: true },
        sort: { prop: 'complete', showBackground: true },
        columns: [
          {
            label: '姓名',
            prop: 'userName'
          },
          {
            label: '按时完成',
            prop: 'complete'
          },
          {
            label: '超时完成',
            prop: 'timeoutComplete'
          },
          {
            label: '未完成',
            prop: 'unExecute'
          }
        ],
        dataList: PatrolUserRank.value
      },
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
          { label: '选择时间', key: 'date', type: 'daterange', handleChange: () => refreshData() }
        ]
      }
    })
    const { formatToArrayNumber } = useGlobal()
    const cardSearch = ref<InstanceType<typeof CardSearch>>()
    const initXJQSFX_options = () => {
      const data: any[] = []
      const xData: string[] = []
      for (var key in PatrolTrend.value) {
        xData.push(key)
        data.push(PatrolTrend.value[key])
      }
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
        grid: {
          top: 40,
          bottom: 30,
          right: 30,
          left: 60
        },
        series: [
          {
            data: data,
            name: '百分比值',
            type: 'line',
            smooth: true,
            showSymbol: false,
            color: '#4EE5A8',
            lineStyle: {
              color: '#FFB253',
              width: 1
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: hexToRgba('#FFB253', 0.4)
                },
                {
                  offset: 1,
                  color: hexToRgba('#FFB253', 0)
                }
              ])
            }
          }
        ]
      }
      state.XJQSFX_options = options
    }
    const initMRXJYCS_options = () => {
      const xData: string[] = []
      const data: any[] = []
      for (var key in PatrolExceptionTrend.value) {
        xData.push(key)
        data.push(PatrolExceptionTrend.value[key])
      }
      const options = {
        backgroundColor: '#1A1D2D',
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: xData
        },
        yAxis: {
          type: 'value',
          name: '(个)',
          splitLine: {
            lineStyle: {
              color: '#40424D'
            }
          }
        },
        grid: {
          top: 40,
          bottom: 30,
          right: 30,
          left: 60
        },
        series: [
          {
            data: data,
            name: '异常数',
            type: 'bar',
            barMaxWidth: 40
          }
        ]
      }
      state.MRXJYCS_options = options
    }
    const refreshData = async () => {
      const params = cardSearch.value?.queryParams

      const [start, end] = params.date
        ? formatToArrayNumber(params.date)
        : [formatToNumber(new Date()) - 15638400000, formatToNumber(new Date())]
      const projectId = params && params.projectId && params.projectId[params.projectId.length - 1]
      const queryParams: QueryListParam = {
        projectId: projectId,
        start: start.toString(),
        end: end.toString()
      }
      state.slTableConfig.dataList = PatrolUserRank.value
      await getPatrolStatusCount(queryParams)
      await getPatrolExceptionTrend(queryParams)
      await getPatrolCompleteRatio(queryParams)
      await getPatrolUserRank(queryParams)

      await getPatrolTrend(queryParams)
      refreshChart()
    }
    const refreshChart = () => {
      initXJQSFX_options()
      initMRXJYCS_options()
      state.slTableConfig.dataList = PatrolUserRank.value
    }
    onMounted(() => {
      initProjectSelect()
      refreshData()
    })
    return {
      ...toRefs(state),
      PatrolUserRank,
      PatrolStatusCount,
      PatrolExceptionTrend,
      PatrolCompleteRatio,
      PatrolTrend,
      cardSearch
    }
  }
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
